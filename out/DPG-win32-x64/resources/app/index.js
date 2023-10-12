const { BrowserWindow, app } = require("electron");

app.whenReady().then(() => {
  const loadingWin = new BrowserWindow({
    width: 400,
    height: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  loadingWin.loadFile('loading.html');

  setTimeout(() => {
    const win = new BrowserWindow({
      minWidth: 1350,
      minHeight: 920,
      autoHideMenuBar: true,
      spellcheck: true,
      hiddenInMissionControl: true,
      icon: "dpg.ico",
      webPreferences: {
        nodeIntegration: true,
        webviewTag: true
      }
    });
    win.loadURL(`http://localhost:3000`);
    win.setBackgroundColor("#17191a");
    win.reload();
    
    win.once('ready-to-show', () => {
      loadingWin.destroy();
      win.show();
      win.center();
    });
  }, 3000);

  app.on("window-all-closed", () => {
    app.quit();
  });
});