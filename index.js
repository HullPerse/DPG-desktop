const { BrowserWindow, app, session } = require('electron');
const DiscordRPC = require('discord-rpc');

DiscordRPC.register('1164429222345965668');
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

app.whenReady().then(() => {
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

  setInterval(setDiscordPresence, 5000);
  clearInterval(setInterval(setDiscordPresence, 5000))

  rpc.login({ clientId: '1164429222345965668' });

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
    win.loadURL('http://localhost:3000');
    setDiscordPresence();
    win.setBackgroundColor('#17191a');
    win.reload();
    win.icon = 'dpg.ico';

    win.once('ready-to-show', () => {
      loadingWin.destroy();
      win.show();
      win.center();
    });
  }, 3000);

  function setDiscordPresence() {
    session.defaultSession.cookies
      .get({ url: 'http://localhost:3000' })
      .then((cookies) => {
        const usernameCookie = cookies.find((cookie) => cookie.name == 'username');
        const mapCellCookie = cookies.find((cookie) => cookie.name == 'mapCell');
        const pageCookie = cookies.find((cookie) => cookie.name == 'page');
  
        let username = "Пользователь не авторизован";
        let mapCell;
        let page;
  
        rpc.setActivity({
          details: username,
          largeImageText: 'DPG',
          largeImageKey: 'dpg',
        });

        if (usernameCookie && mapCellCookie && pageCookie) {
          username = usernameCookie.value;
          mapCell = "Клетка: " + mapCellCookie.value;
          page = " || " + pageCookie.value;

          rpc.setActivity({
            details: username,
            state: mapCell + page,
            largeImageText: 'DPG',
            largeImageKey: 'dpg',
          });
        }

      })
      .catch((error) => {
        console.error(error);
      });
  }

  app.on('window-all-closed', () => {
    app.quit();
    loadingWin.destroy();
    rpc.clearActivity();
  });
});