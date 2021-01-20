'use strict'

import { ipcMain, IpcMainEvent } from 'electron';
import { NotificationType } from '@/common/NotificationType';
import { spawn } from 'cross-spawn';
import path from 'path';
import WinRegistry from 'winreg';
import { getProcesses, ProcessObject } from 'memoryjs';
import AmongUsProxy from '@/common/proxy/AmongUsProxy';
import Util from '@/common/proxy/Util';
import { IOffsets } from '@/common/proxy/interfaces/IOffsets';
import { AmongUsGameData } from '@/common/proxy/AmongUsGameData';
import Store from 'electron-store';

const isDevelopment = process.env.NODE_ENV !== 'production';
const store = new Store({ accessPropertiesByDotNotation: false });

ipcMain.on('check-game-opened', (e: IpcMainEvent) => {
    try {
        const opened: boolean = getProcesses().find((p: typeof ProcessObject) => p.szExeFile === 'Among Us.exe') != undefined || false;
        if (!opened) {
            e.reply('game-opened', false);
            e.reply('notify', 'Among Us does not seem to be opened.', NotificationType.WARNING);
        } else runGameProxy(e);
    } 
    catch (error) {
        e.reply('notify', error.message);
    }
});


ipcMain.on('open-game', (e: IpcMainEvent) => {
    try {
        if (getProcesses().find((p: typeof ProcessObject) => p.szExeFile === 'Among Us.exe') != undefined) {
            runGameProxy(e);
            return;
        }

        const key = new WinRegistry({
            hive: WinRegistry.HKLM,                       // open LM registry hive
            key: '\\Software\\Wow6432node\\Valve\\Steam'  // key containing steam application info
        });

        key.values((err: Error, regs: WinRegistry.RegistryItem[]) => {
            if (err) throw new Error('Could not locate Steam.');
            let steamRegistry: WinRegistry.RegistryItem | null = regs.find(v => v.name === 'InstallPath') || null;
            if (!steamRegistry) throw new Error('Steam does not seem to be installed.');

            const process = spawn(
                path.join(steamRegistry!.value as string, 'steam.exe'),
                [ '-applaunch', '945360' ]
            );

            process.on('error', () => { throw new Error('Could not open Among Us.'); });
            runGameProxy(e);
        });
    } 
    catch (error) {
        e.reply('notify', error.message + ' Try opening the game manually.');
    }
});


let runProxy: boolean = true;
export const closeProxy = () => runProxy = true;


async function runGameProxy(e: IpcMainEvent) {
    try {
        var offsets: IOffsets | null = null;
        const version: string = Util.getCurrentVersion() as string;
        
        if (store.has('offsets')) {
            const versionStored = store.get('version');
            offsets = (version != versionStored)
                ? offsets = await loadNewOffsets(version)
                : offsets = store.get('offsets') as IOffsets;
        } else {
            offsets = await loadNewOffsets(version);
        }
        
        if (!offsets) throw new Error('Could not load game offests... Server ran into an error.');
        
        let GameProxy: AmongUsProxy | null = new AmongUsProxy(e.reply as (event: string, ...args: unknown[]) => void, offsets as IOffsets);
        
        const tick = () => {
            if (GameProxy) {
                GameProxy!.operate();
                
                const data = {
                    players: GameProxy!.players,
                    lobbyCode: GameProxy!.gameCode,
                    state: {
                        game: GameProxy!.gameState,
                        discussion: GameProxy!.discussionState
                    }
                } as AmongUsGameData;

                e.reply('game-data', data);
                setTimeout(tick, isDevelopment ? 1000 : 50);
            }
        };

        if (GameProxy && runProxy) tick(); 
    }
    catch (error) {
        e.reply('notify', error.message);
    }
}

async function loadNewOffsets(version: string): Promise<IOffsets> {
    console.log('Loading new offsets', version);
    const offsets = await Util.getOffsetSchema(version as string);
    store.set('offsets', { offsetsStored: offsets, versionStored: version });
    return offsets as IOffsets;
}


ipcMain.handle('get-setting', (_, keys: string[]): object => {
    let settings = { keys };
    for (const i in keys) {
        const k = keys[i];
        if (store.has(k))  settings[k] = store.get(k) as any
    }
    return settings;
});

ipcMain.on('set-setting', (e: IpcMainEvent, params: string[]) => {
    for (const i in params) store.set(params[i][0], params[i][1]);
    e.reply('notify', 'Changes have been saved.', NotificationType.SUCCESS);
});

ipcMain.handle('get-user-settings', (_): object => {
    return {
        displayName: store.has('displayName') ? store.get('displayName') : null,
        server: store.has('server') ? store.get('server') : 'https://supercrew.herokuapp.com',
        perifs: {
            input: store.has('input') ? store.get('input') : null,
            output: store.has('output') ? store.get('output') : null
        },
        shortcuts: {
            pushToTalk: store.has('pushToTalkKey') ? store.get('pushToTalkKey') : 'V',
            deafen: store.has('deafenKey') ? store.get('deafenKey') : 'B',
        },
        configs: {
            pushToTalk: store.has('pushToTalk') ? store.get('pushToTalk') : true,
            hideCode: store.has('hideCode') ? store.get('hideCode') : false,
            theme: store.has('theme') ? store.get('theme') : null,
        }
    }
});