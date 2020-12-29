import { ipcMain } from 'electron';
const { getProcesses, ProcessObject } = require('memoryjs');

ipcMain.handleOnce('check-game-opened', (e: Electron.IpcMainInvokeEvent, args: string) : boolean => {
    const game = getProcesses().find((p: typeof ProcessObject) => p.szExeFile === args);
    return game != undefined;
});

ipcMain.handle('open-game', () => {
    return false;
});
