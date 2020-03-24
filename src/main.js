const { app, BrowserWindow, ipcMain } = require('electron');
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} = require('electron-devtools-installer');
const path = require('path');
const events = require('./electron/events');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // installExtension(REACT_DEVELOPER_TOOLS)
  //   .then(name => console.log(`Added Extension:  ${name}`))
  //   .catch(err => console.log('An error occurred: ', err));
  // installExtension(REDUX_DEVTOOLS)
  //   .then(name => console.log(`Added Extension:  ${name}`))
  //   .catch(err => console.log('An error occurred: ', err));

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'electron', 'preload.js'),
      webSecurity: process.env.NODE_ENV !== 'development',
      nodeIntegration: true
    }
  });

  mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

process.on('uncaughtException', ({ message }) => {
  mainWindow.webContents.send('error', message);
  // Handle the error
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

events.forEach(({ event, handler }) => {
  ipcMain.on(event, handler);
});
