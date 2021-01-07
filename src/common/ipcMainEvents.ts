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

const isDevelopment = process.env.NODE_ENV !== 'production';

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


async function runGameProxy(e: IpcMainEvent) {
    try {
        e.reply('prevent-input');

        const version: string | null = Util.getCurrentVersion();
        const offsets: IOffsets | null = await Util.getOffsetSchema(version as string);
        if (!offsets) throw new Error('Could not load game offests... Server ran into an error.');
        let GameProxy: AmongUsProxy | null = new AmongUsProxy(e.reply as (event: string, ...args: unknown[]) => void, offsets as IOffsets);
        
        const tick = () => {
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
        };

        if (GameProxy && runProxy) tick(); 
    }
    catch (error) {
        e.reply('notify', error.message);
    }
}


let runProxy: boolean = true;
export const closeProxy = () => runProxy = true;