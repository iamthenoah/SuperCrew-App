import { ipcMain } from 'electron';
import { spawn } from 'cross-spawn';
import path from 'path';
import WinRegistry from 'winreg';
const { getProcesses, ProcessObject } = require('memoryjs');


ipcMain.handleOnce('check-game-opened', (e: Electron.IpcMainInvokeEvent, args: string) : boolean => {
    return getProcesses().find((p: typeof ProcessObject) => p.szExeFile === args) != undefined;
});

ipcMain.handle('open-game', () : void => {
    try {
        const key = new WinRegistry({
            hive: WinRegistry.HKLM,                       // open LM registry hive
            key: '\\Software\\Wow6432node\\Valve\\Steam'  // key containing steam info
        });

        key.values((err: Error, regs: WinRegistry.RegistryItem[]) => {
            let steamRegistry: WinRegistry.RegistryItem | null = regs.find(v => v.name === 'InstallPath') || null;
            if (!steamRegistry) throw new Error('Steam does not seem to be installed.');

            const directives = [ '-applaunch', '945360' ];
            const process = spawn(path.join(steamRegistry!.value as string, 'steam.exe'), directives);
            
            process.on('error', () => { throw new Error('An error occurred while opening the game.'); });
        });
    }
    catch(e) {
        throw new Error('Could not open game - ' + e.message + ' Try opening the game manually.');
    }
});