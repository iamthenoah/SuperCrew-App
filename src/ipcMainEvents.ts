'use strict'

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { spawn } from 'cross-spawn';
import path from 'path';
import WinRegistry from 'winreg';
const { getProcesses, ProcessObject } = require('memoryjs');

ipcMain.handle('check-game-opened', (e: IpcMainInvokeEvent, args: string = 'Among Us.exe') : boolean => {
    return getProcesses().find((p: typeof ProcessObject) => p.szExeFile === args) != undefined;
});

ipcMain.handle('open-game', () : boolean => {
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

            process.on('error', () => { throw new Error('Error opening Among Us.'); });
            
            return true;
        });
    }
    catch (e) {
        throw new Error(e.message + ' Try opening the game manually.');
    }
    return false;
});


ipcMain.handle('call-error', () : boolean => {
    throw new Error('Error opening Among Us.');
});