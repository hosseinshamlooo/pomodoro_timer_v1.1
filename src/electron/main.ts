import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import fs from 'fs';

const userDataPath = app.getPath('userData');
const logFilePath = path.join(userDataPath, 'session-log.json');

// ✅ Ensure log file exists and is valid
function ensureLogFile() {
  try {
    if (!fs.existsSync(logFilePath)) {
      fs.writeFileSync(logFilePath, JSON.stringify([]));
    } else {
      // Make sure the file isn't corrupt
      const content = fs.readFileSync(logFilePath, 'utf-8');
      JSON.parse(content); // throws if invalid
    }
  } catch {
    fs.writeFileSync(logFilePath, JSON.stringify([])); // reset if invalid
  }
}

// ✅ App ready
app.on('ready', () => {
  ensureLogFile();

  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
  }
});

// ✅ Save a focus session with duration auto-calculated
ipcMain.handle('save-focus-session', async (_event, session) => {
  try {
    const start = new Date(session.start);
    const end = new Date(session.end);
    const duration = Math.round((end.getTime() - start.getTime()) / 60000); // in minutes

    const existing = fs.existsSync(logFilePath)
      ? JSON.parse(fs.readFileSync(logFilePath, 'utf-8'))
      : [];

    existing.push({
      ...session,
      duration,
    });

    fs.writeFileSync(logFilePath, JSON.stringify(existing, null, 2));
    return { success: true };
  } catch (err: unknown) {
    console.error('Error saving focus session:', err);
  
    // Narrow the type to get message safely:
    let message = 'Unknown error';
    if (err instanceof Error) {
      message = err.message;
    }
  
    return { success: false, error: message };
  }
});

// ✅ Return all sessions
ipcMain.handle('get-focus-sessions', async () => {
  try {
    const data = fs.existsSync(logFilePath)
      ? JSON.parse(fs.readFileSync(logFilePath, 'utf-8'))
      : [];
    return data;
  } catch (err) {
    console.error('Error reading focus sessions:', err);
    return [];
  }
});
