// Tank Levels for Windows: a plain window around the Tank Levels app, with no address bar.
const { app, BrowserWindow, Menu, shell, session } = require('electron');
const path = require('path');

const APP_URL = 'https://m9r1u5.github.io/Tank/';
const APP_HOST = 'm9r1u5.github.io';
let win = null;

if (!app.requestSingleInstanceLock()) { app.quit(); }
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });

function isAppUrl(u) {
  try { const x = new URL(u); return x.host === APP_HOST && x.pathname.startsWith('/Tank'); } catch (e) { return false; }
}

function createWindow() {
  Menu.setApplicationMenu(null);
  win = new BrowserWindow({
    width: 1400, height: 900, minWidth: 420, minHeight: 500,
    title: 'Tank Levels',
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#f3f5f7',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false }
  });
  win.maximize();
  win.webContents.setUserAgent(win.webContents.getUserAgent() + ' TankLevelsDesktop/1.0');
  win.on('page-title-updated', (e) => { e.preventDefault(); win.setTitle('Tank Levels'); });

  // Links that leave the app open in the normal browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith('blob:')) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!isAppUrl(url) && !url.startsWith('file:')) { e.preventDefault(); shell.openExternal(url); }
  });

  // No internet: show a friendly page with a Try again button.
  win.webContents.on('did-fail-load', (e, code, desc, url, isMain) => {
    if (isMain && code !== -3) win.loadFile(path.join(__dirname, 'offline.html'));
  });

  // Ctrl + mouse wheel / Ctrl +/- zoom, F5 reload, F11 full screen.
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    const wc = win.webContents;
    if (input.key === 'F5') { wc.reload(); e.preventDefault(); }
    else if (input.key === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
    else if (input.control && (input.key === '=' || input.key === '+')) { wc.setZoomLevel(wc.getZoomLevel() + 0.5); e.preventDefault(); }
    else if (input.control && input.key === '-') { wc.setZoomLevel(wc.getZoomLevel() - 0.5); e.preventDefault(); }
    else if (input.control && input.key === '0') { wc.setZoomLevel(0); e.preventDefault(); }
  });

  win.loadURL(APP_URL);
}

app.whenReady().then(() => {
  // Exports go straight to the Downloads folder.
  session.defaultSession.on('will-download', (e, item) => {
    item.setSavePath(path.join(app.getPath('downloads'), item.getFilename()));
    item.once('done', (ev, state) => { if (state === 'completed') shell.showItemInFolder(item.getSavePath()); });
  });
  createWindow();
});
app.on('window-all-closed', () => app.quit());
