// electron/main.js
// Proceso principal de Electron: crea la ventana y expone handlers IPC
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';

// Importa la capa de DB (asegurate que electron/db.js exista)
const { runQuery, getQuery, allQuery } = require('./db');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false
    }
  });

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';
  console.log('Main -> loading URL:', startUrl);

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Main -> did-fail-load', { errorCode, errorDescription, validatedURL });
  });
  mainWindow.webContents.on('crashed', () => {
    console.error('Main -> Renderer process crashed');
  });
  mainWindow.on('unresponsive', () => {
    console.error('Main -> Window unresponsive');
  });

  mainWindow.loadURL(startUrl).catch(err => console.error('Main -> loadURL error', err));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

/* --------------------
   Sanitización y util
   -------------------- */
function sanitizeParam(p) {
  if (p === undefined) return null;
  if (p === null) return null;
  if (typeof p === 'number' || typeof p === 'bigint' || typeof p === 'string') return p;
  if (Buffer.isBuffer(p)) return p;
  if (p instanceof Date) return p.toISOString(); // o p.getTime() si prefieres INTEGER
  if (typeof p === 'boolean') return p ? 1 : 0;
  if (Array.isArray(p) || typeof p === 'object') {
    try { return JSON.stringify(p); } catch (e) { return String(p); }
  }
  return String(p);
}
function sanitizeParams(arr) {
  if (!arr) return [];
  if (!Array.isArray(arr)) arr = [arr];
  return arr.map(sanitizeParam);
}

function safeInvokeSyncOrAsync(fn, ...args) {
  // runQuery/getQuery/allQuery pueden ser sync o async; normalizamos a Promise
  try {
    const res = fn(...args);
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
}

/* --------------------
   IPC handlers para DB
   - db-run  -> stmt.run(...)
   - db-get  -> stmt.get(...)
   - db-all  -> stmt.all(...)
   -------------------- */
ipcMain.handle('db-run', async (event, sql, params) => {
  try {
    if (typeof sql !== 'string') throw new Error('SQL debe ser string');
    const cleanParams = sanitizeParams(params);
    if (isDev) {
      // útil para debugging local en Electron
      console.debug('IPC db-run ->', { sql, params: cleanParams });
    }
    const res = await safeInvokeSyncOrAsync(runQuery, sql, cleanParams);
    return { ok: true, result: res };
  } catch (err) {
    console.error('IPC db-run error:', err, 'SQL:', sql, 'params:', params);
    return { ok: false, error: String(err) };
  }
});

ipcMain.handle('db-get', async (event, sql, params) => {
  try {
    if (typeof sql !== 'string') throw new Error('SQL debe ser string');
    const cleanParams = sanitizeParams(params);
    if (isDev) console.debug('IPC db-get ->', { sql, params: cleanParams });
    const row = await safeInvokeSyncOrAsync(getQuery, sql, cleanParams);
    return { ok: true, row };
  } catch (err) {
    console.error('IPC db-get error:', err, 'SQL:', sql, 'params:', params);
    return { ok: false, error: String(err) };
  }
});

ipcMain.handle('db-all', async (event, sql, params) => {
  try {
    if (typeof sql !== 'string') throw new Error('SQL debe ser string');
    const cleanParams = sanitizeParams(params);
    if (isDev) console.debug('IPC db-all ->', { sql, params: cleanParams });
    const rows = await safeInvokeSyncOrAsync(allQuery, sql, cleanParams);
    return { ok: true, rows };
  } catch (err) {
    console.error('IPC db-all error:', err, 'SQL:', sql, 'params:', params);
    return { ok: false, error: String(err) };
  }
});

// Logs y errores desde renderer (opcional util)
ipcMain.on('renderer-log', (e, ...args) => {
  console.log('Renderer log ->', ...args);
});
ipcMain.on('renderer-error', (e, info) => {
  console.error('Renderer forwarded error ->', info);
});
