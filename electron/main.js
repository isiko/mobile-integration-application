const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");

const EncryptionHandler = require("./EncryptionHandler");
const PluginHandler = require("./PluginHandler");

var handlers = []
var windows = []

// Setup Grlobals
global.isDev = require("electron-is-dev");

function createWindow() {
  // Create the browser window.
  const devtools = new BrowserWindow()
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: true,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Open the DevTools.
  if (isDev) {
    win.webContents.setDevToolsWebContents(devtools.webContents)
    win.webContents.openDevTools({ mode: 'detach' })
  }

  windows.push(win);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  console.log("App Ready");
  createWindow();

  // Setup Settings
  global.settings = undefined;
  global.settingsPath = app.getPath("userData") + "/settings.json";
  global.SettingsHandler = require('./SettingsHandler')
  handlers = handlers.concat(SettingsHandler.handlers)
  
  //Setup Encryption
  global.EncryptionHandler = new EncryptionHandler();

  //Setup Plugin Handling
  global.PluginHandler = new PluginHandler();

  // Setup Device Handling
  global.deviceCache = undefined;
  global.deviceCachePath = app.getPath("userData") + "/deviceCache.json";
  global.ConnectionHandler = require('./ConnectionHandler')
  handlers = handlers.concat(ConnectionHandler.handlers)

  console.log("Loading IPC Handlers");
  handlers.forEach(handler => {
    console.log(`Registering handler for ${handler.name}`);
    ipcMain.handle(handler.name, handler.handler)
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});