const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;
const ffmpeg = require('fluent-ffmpeg');
// ready is a preset string (event) that we know that the app is going to issue
// Note that this just the app not the window.
let mainWindow;
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        // I added this object because of nodeIntegration is false by default (true WAS the default)
        // this object for writting nodejs code inside HTML
        // but in best practices try to avoid these because it uses nodejs it self (can access and do anything nodejs can)
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
});
// first arg has some data about the process that sent this event, you can got dive separate windows inside of our app and any one of them could trigger this event, so you know that from event object
// second arg is the data
ipcMain.on('video:submit', (event, path) => {
    ffmpeg.ffprobe(path, (err, metadata) => {
        duration = metadata.format.duration
        mainWindow.webContents.send('video:duration', metadata.format.duration)
    });
});
