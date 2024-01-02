const { app, BrowserWindow, globalShortcut, clipboard, ipcMain, screen } = require('electron/main');
const path = require('node:path');
const translate = require('@iamtraction/google-translate');

let win; 

const checkClipboardShortcut = 'CommandOrControl+Shift+C'; // global shortcut to check clipboard

const createWindow = () => {
  win = new BrowserWindow({
    show: false, 
    autoHideMenuBar: true, 
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register(checkClipboardShortcut, () => {
    const text = clipboard.readText();
    translate(text, { to: 'ar' }).then(res => {
      const { width, height } = screen.getPrimaryDisplay().workAreaSize;
      win.setSize(width/4, height/4); 
      win.setPosition( 
        Math.floor(width - width/4), 
        0 
      );
      win.show();
      win.webContents.send('update-clipboard', [res.text, text]);
      console.log('Translated text:', res.text);
    }).catch(err => {
      console.error(err);
    });
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
