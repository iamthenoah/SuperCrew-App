'use strict'

import { ipcMain, IpcMainEvent } from 'electron';
import { NotificationType } from '@/common/enums/NotificationType';
import { spawn } from 'cross-spawn';
import path from 'path';
import WinRegistry from 'winreg';
import { getProcesses, ProcessObject } from 'memoryjs';
import AmongUsProxy from '@/common/proxy/AmongUsProxy';
import Util from '@/common/proxy/Util';
import { IOffsets } from '@/common/proxy/interfaces/IOffsets';



ipcMain.on('call-error', (e: IpcMainEvent) => {
    setTimeout(() => {
        try {
            throw new Error('EROEROEREOOEOROEROEOR.');
        }
        catch (error) {
            e.reply('notify', error.message + ' Try opening the game manually.');
        }
    }, 2000);
});



ipcMain.on('check-game-opened', (e: IpcMainEvent) => {
    try {
        const opened: boolean = getProcesses().find((p: typeof ProcessObject) => p.szExeFile === 'Among Us.exe') != undefined || false;
        if (!opened) e.reply('notify', 'Among Us does not seem to be opened.', NotificationType.WARNING);
        else e.reply('notify', 'Among Us is running...', NotificationType.SUCCESS);
        e.reply('game-opened', opened);
    }
    catch (error) {
        e.reply('game-opened', false);
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
            setTimeout(() => {
                e.reply('notify', 'Game is now running...', NotificationType.SUCCESS);
                e.reply('game-opened', true);
            }, 5000);
        });
    }
    catch (error) {
        e.reply('notify', error.message + ' Try opening the game manually.');
    }
});

ipcMain.on('run-game-proxy', async (e: IpcMainEvent) => {
    try {

        const version: string | null = Util.getCurrentVersion();
        const offsets: IOffsets | null = await Util.getOffsetSchema(version as string);
        if (!offsets) throw new Error('Could not load game offests... Server ran into an error');
        const GameProxy: AmongUsProxy | null = new AmongUsProxy(offsets as IOffsets);
        if (!GameProxy) throw new Error('Fatal error cause the game proxy to fail...');
        
        const tick = () => {
            GameProxy.operate();
            e.reply('game-code', GameProxy.gameCode);
			setTimeout(tick, 20);
		};
		tick();

        e.reply('notify', `App running with Among Us version ${version}...`, NotificationType.SUCCESS);
    }
    catch (error) {
        e.reply('notify', error.message);
    }
});