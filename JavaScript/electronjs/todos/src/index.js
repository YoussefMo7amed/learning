const electron = require("electron");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;
app.on("ready", () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    // building menu
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    // we have to add this function to put in use this menu
    Menu.setApplicationMenu(mainMenu);
    // so if the user closed the main window, the whole app closes.
    mainWindow.on("closed", () => {
        app.quit();
    });
});

ipcMain.on("input:add", (event, data) => {
    mainWindow.webContents.send("input:add", data);
    addWindow.close();
});

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: "add new todo",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on("close", () => (addWindow = null));
}
function clearTodos() {
    mainWindow.webContents.send("todos:clear");
}
// Comment (1)
const menuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "New Todo",
                click() {
                    createAddWindow();
                },
                accelerator: "CmdOrCtrl" + "+N",
            },
            {
                label: "Clear Todos",
                click() {
                    clearTodos();
                },
                accelerator: "CmdOrCtrl" + "+D",
            },
            {
                label: "Quit",
                accelerator: "CmdOrCtrl" + "+Q",
                click() {
                    app.quit();
                },
            },
        ],
    },
];

// Comment (2)
// mac, ios, and all apple related OSs based on 'darwin'
if (process.platform === "darwin") {
    menuTemplate.unshift({}); // add empty object at first
}

if (process.env.NODE_ENV !== "producation") {
    menuTemplate.push({
        label: "View",
        submenu: [
            {
                role: "reload",
            },
            {
                label: "Toggle Developer Tools",
                accelerator: "CmdorCtrl" + "+Shift+I",
                click(item, focusWindow) {
                    focusWindow.toggleDevTools();
                },
            },
        ],
    });
}

/*
## Big Comments Section
    1)
    each menu that we add to this menu template corresponds to a single drop down on the status bar on the top
    vscode for example has 8 objects [file, edit, selection, view, go, run, terminal, help]
    every object has at least one property (which is label)

    2)
    - there is a problem with mac, which it will show first label as the app name (electron),
    while in windows and linux it will normaly show app name and first label (File)
    - we can add first object in array as empty object, that works for mac but not the others!
    so we can twick it by know the OS and if it is mac we add empty object at first
*/
