import { app, BrowserWindow } from 'electron';
import path from 'path';
import { isDev } from './util.js';

app.on('ready', () => { 
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 900,
        resizable: true,        // ✅ Must be true to keep maximize button enabled
        maximizable: true,      // ✅ Allow maximize
        minWidth: 1000,         // ⛔️ Prevent resizing smaller
        minHeight: 900,
        maxWidth: 1510,         // ⛔️ Prevent resizing bigger
        maxHeight: 1100,
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
});
