'use strict'

import { ipcMain } from 'electron';
import { NotificationType } from '@/common/enums/NotificationType';
import { spawn } from 'cross-spawn';
import path from 'path';
import WinRegistry from 'winreg';
const { getProcesses, ProcessObject } = require('memoryjs');

ipcMain.on('check-game-opened', (e: Electron.IpcMainEvent) => {
    const opened: boolean = getProcesses().find((p: typeof ProcessObject) => p.szExeFile === 'Among Us.exe') != undefined || false;
    if (!opened) e.reply('notify', 'Among Us does not seem to be opened.', NotificationType.WARNING);
    else e.reply('notify', 'Among Us is running...', NotificationType.SUCCESS)
    e.reply('game-opened', opened);
});

ipcMain.on('open-game', (e: Electron.IpcMainEvent) => {
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

ipcMain.on('call-error', (e: Electron.IpcMainEvent) => {
    setTimeout(() => {
        try {
            throw new Error('EROEROEREOOEOROEROEOR.');
        }
        catch (error) {
            e.reply('notify', error.message + ' Try opening the game manually.');
        }
    }, 2000);
});