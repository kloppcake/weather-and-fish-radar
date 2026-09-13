// ============================================================
//  Storm Ranger — Electron main process
//  This file creates the app window and loads index.html into it.
//  You don't normally need to edit this.
// ============================================================
const { app, BrowserWindow, session } = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 960,
    minWidth: 760,
    minHeight: 620,
    backgroundColor: '#05080f',      // matches the app's dark background so there's no white flash on launch
    title: 'Storm Ranger',
    autoHideMenuBar: true,           // hides the File/Edit/View menu bar for a cleaner "app" feel
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');

  // F11 toggles fullscreen "storm station" mode; Esc leaves it.
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') {
      win.setFullScreen(!win.isFullScreen());
    }
    if (input.type === 'keyDown' && input.key === 'Escape' && win.isFullScreen()) {
      win.setFullScreen(false);
    }
  });

  win.on('closed', () => { win = null; });
}

// Auto-approve the location prompt so "Use my location" in Settings works
// without a popup. Nothing else is granted: the app has no need for the
// camera or microphone.
const ALLOWED = new Set(['geolocation']);

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(ALLOWED.has(permission));
  });
  session.defaultSession.setPermissionCheckHandler((webContents, permission) => ALLOWED.has(permission));

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // On Windows, closing the window quits the app.
  if (process.platform !== 'darwin') app.quit();
});
