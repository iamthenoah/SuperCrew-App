'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { closeProxy } from './common/ipcMainEvents';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import './common/ipcMainEvents';
//import './common/io';

const isDevelopment = process.env.NODE_ENV !== 'production';

protocol.registerSchemesAsPrivileged([
	{ scheme: 'app', privileges: { secure: true, standard: true } }
]);

async function createWindow() {
	const win = new BrowserWindow({
		alwaysOnTop: isDevelopment,
		width: isDevelopment ? 1000 : 320, // 320:400
		height: 400,
		show: false,
		frame: false,
		resizable: isDevelopment,
		fullscreenable: false,
		backgroundColor: '#303336',
		webPreferences: {
			// devTools: true,
			enableRemoteModule: true,
			nodeIntegration: true,
		},
	});

	const splashWin = new BrowserWindow({
		width: 300,
		height: 300,
		frame: false,
		alwaysOnTop: true,
		resizable: false,
		backgroundColor: '#2b3138',
	});
	
	const splashUrl = require('url').format({
		protocol: 'file',
		slashes: true,
		pathname: path.join(__dirname, '../public/splash.html')
	});

	splashWin.loadURL(splashUrl);

	// ===================================
	// 				UPDATER
	// ===================================

	// console.log(autoUpdater.getFeedURL())

	autoUpdater.checkForUpdates();

	autoUpdater.on('checking-for-update', () => {
		console.log('Checking for update...');
	});
	autoUpdater.on('update-available', (_) => {
		console.log('Update available.');
	});
	autoUpdater.on('update-not-available', (_) => {
		console.log('Update not available.');
	});
	autoUpdater.on('error', (err) => {
		console.log('Error in auto-updater. ' + err);
	});
	autoUpdater.on('download-progress', (progressObj) => {
		let log = "Download speed: " + progressObj.bytesPerSecond;
		log = log + ' - Downloaded ' + progressObj.percent + '%';
		log = log + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
		console.log(log);
	});
	autoUpdater.on('update-downloaded', (_) => {
		console.log('Update downloaded');
	});

	// ===================================
	//             UPDATEREND
	// ===================================

	win.once('ready-to-show', () => {
		setTimeout(() => {
			splashWin.destroy();
			win.show();
		}, 1000)
	});
	
	ipcMain.handle('minimize-window', () => win.minimize());
	ipcMain.handle('close-window', () => win.close());
	
	if (process.env.WEBPACK_DEV_SERVER_URL) {
		await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
		if (!process.env.IS_TEST) win.webContents.openDevTools();
	} else {
		createProtocol('app');
		win.loadURL('app://./index.html');
	}
}


app.on('window-all-closed', () => {
	closeProxy();
	app.quit();
});


app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
	if (isDevelopment && !process.env.IS_TEST) {
		// Install Vue Devtools
		try {
			await installExtension(VUEJS_DEVTOOLS);
		} catch (e) {
			console.error('Vue Devtools failed to install:', e.toString());
		}
	}
	createWindow();
});


// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === 'win32') {
		process.on('message', (data) => {
			if (data === 'graceful-exit') {
				app.quit();
			}
		});
	} else {
		process.on('SIGTERM', () => {
			app.quit();
		});
	}
}