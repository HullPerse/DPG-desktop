const { BrowserWindow, app } = require('electron');
const DiscordRPC = require('discord-rpc');

// Initialize Discord RPC
DiscordRPC.register('1164429222345965668'); // Replace 'your-client-id' with your actual Discord application's client ID
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

app.whenReady().then(() => {
  // Create a loading window
  const loadingWin = new BrowserWindow({
    width: 400,
    height: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  loadingWin.loadFile('loading.html');

  // Set up the Discord Rich Presence
  rpc.login({ clientId: '1164429222345965668' }); // Replace 'your-client-id' with your actual Discord application's client ID

  setTimeout(() => {
    const win = new BrowserWindow({
      minWidth: 1350,
      minHeight: 920,
      autoHideMenuBar: true,
      spellcheck: true,
      hiddenInMissionControl: true,
      icon: 'dpg.ico',
      webPreferences: {
        nodeIntegration: true,
        webviewTag: true,
      },
    });
    win.loadURL('http://localhost:3000'); // Note the 'http://' in the URL
    win.setBackgroundColor('#17191a');
    win.reload();
    win.icon = 'dpg.ico';

    win.once('ready-to-show', () => {
      loadingWin.destroy();
      win.show();
      win.center();
    });

    // Set up Discord Rich Presence details
    rpc.setActivity({
      details: 'Username from cookies',
      state: 'Страница: Page from cookies || Клетка: Cell from cookies',
      largeImageText: 'DPG',
      largeImageKey: 'dpg',
    });
  }, 3000);

  app.on('window-all-closed', () => {
    app.quit();
  });
});