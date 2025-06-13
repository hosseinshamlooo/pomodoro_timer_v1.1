import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import { isDev } from './util.js';

app.on('ready', () => { 

    //Menu.setApplicationMenu(null); // 🔥 Removes the default menu
    
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 900,
        resizable: true,
        maximizable: true,
        minWidth: 1000,
        minHeight: 900,
        maxWidth: 1510,
        maxHeight: 1100,
        title: "ZenTime", // Initial title
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
    }

    // 🔥 Force override the title after content finishes loading
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.setTitle("ZenTime");
    });
});
