// electron/main.js (corregido - pega sobre tu archivo actual)
// Proceso principal de Electron: crea la ventana y expone handlers IPC
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';

// Importa la capa de DB (asegúrate que electron/db.js exista y reciba (sql, paramsArray) o (sql, ...params) o (sql, namedParamsObj))
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
  if (Array.isArray(p)) {
    // convierte cada elemento del array
    return p.map(sanitizeParam);
  }
  if (typeof p === 'object') {
    // objeto genérico -> sanitizar todas sus propiedades (preservando keys)
    try {
      const out = {};
      for (const [k, v] of Object.entries(p)) out[k] = sanitizeParam(v);
      return out;
    } catch (e) {
      // en caso de objeto no serializable, devolver string
      return String(p);
    }
  }
  return String(p);
}

function sanitizeParams(arr) {
  // Normaliza a un array o a un objeto de valores aceptables por better-sqlite3.
  if (arr === undefined || arr === null) return [];

  // Si es array, sanear cada elemento y devolver array
  if (Array.isArray(arr)) return arr.map(sanitizeParam);

  // Si es objeto (named params), sanear cada valor y devolver objeto con mismas keys
  if (typeof arr === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(arr)) out[k] = sanitizeParam(v);
    return out;
  }

  // Si es string/number -> envolver en array
  return [sanitizeParam(arr)];
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
   Helpers para logging de params (depuración)
   -------------------- */
function describeParams(params) {
  try {
    if (Array.isArray(params)) {
      return params.map(p => ({ value: p === null ? null : (Buffer.isBuffer(p) ? `<Buffer ${p.length}>` : p), type: p === null ? 'null' : (Buffer.isBuffer(p) ? 'buffer' : typeof p) }));
    }
    if (typeof params === 'object') {
      const out = {};
      for (const [k, v] of Object.entries(params)) {
        out[k] = { value: v === null ? null : (Buffer.isBuffer(v) ? `<Buffer ${v.length}>` : v), type: v === null ? 'null' : (Buffer.isBuffer(v) ? 'buffer' : typeof v) };
      }
      return out;
    }
    return { value: params, type: typeof params };
  } catch (e) {
    return String(params);
  }
}

/* --------------------
   IPC handlers para DB
   - db-run  -> stmt.run(...)
   - db-get  -> stmt.get(...)
   - db-all  -> stmt.all(...)
   -------------------- */

/*
  Nota importante:
  - Algunos adaptadores de DB esperan runQuery(sql, paramsArray)
  - Otros pueden esperar runQuery(sql, ...params) y hacer stmt.run(...params)
  - Better-sqlite3 además acepta named bindings con un objeto: stmt.run({':id': 'x'}) o stmt.run({ id: 'x' })
  Para cubrir ambos casos probamos las dos formas (spread y como objeto/array) y hacemos logging detallado.
*/

async function callDbWithFallback(fn, sql, cleanParams) {
  // Intento 1: si cleanParams es array -> spread (positional)
  // Intento 2: pasar el array u objeto tal cual (named or array)
  let lastErr = null;

  try {
    if (Array.isArray(cleanParams)) {
      // Prueba spread: fn(sql, ...params)
      return await safeInvokeSyncOrAsync(fn, sql, ...cleanParams);
    } else {
      // Si no es array, pasarlo como objeto (named params)
      return await safeInvokeSyncOrAsync(fn, sql, cleanParams);
    }
  } catch (err) {
    lastErr = err;
    // si falló la primera aproximación, intentamos la otra forma
    try {
      if (Array.isArray(cleanParams)) {
        // ahora intentar pasar el array como un único argumento (algunos adaptadores quieren run(sql, paramsArray))
        return await safeInvokeSyncOrAsync(fn, sql, cleanParams);
      } else {
        // si era objeto, intentar convertir a array de values (positional) por compatibilidad
        const vals = Object.values(cleanParams);
        return await safeInvokeSyncOrAsync(fn, sql, ...vals);
      }
    } catch (err2) {
      // devolver ambos errores para debugging
      const e = new Error(`Both DB call forms failed. firstError=${lastErr && lastErr.message ? lastErr.message : lastErr}, secondError=${err2 && err2.message ? err2.message : err2}`);
      e.first = lastErr;
      e.second = err2;
      throw e;
    }
  }
}

ipcMain.handle('db-run', async (event, sql, params) => {
  try {
    if (typeof sql !== 'string') throw new Error('SQL debe ser string');
    const cleanParams = sanitizeParams(params);

    if (isDev) {
      console.debug('IPC db-run ->', { sql, params: describeParams(cleanParams) });
    }

    const res = await callDbWithFallback(runQuery, sql, cleanParams);
    return { ok: true, result: res };
  } catch (err) {
    try {
      console.error('IPC db-run error:', err && err.message ? err.message : err);
      console.error('SQL:', sql);
      console.error('params (raw):', params);
      console.error('params (cleaned):', describeParams(sanitizeParams(params)));
      if (err.first) {
        console.error('first error stack:', err.first && err.first.stack ? err.first.stack : err.first);
      }
      if (err.second) {
        console.error('second error stack:', err.second && err.second.stack ? err.second.stack : err.second);
      }
    } catch (e) {
      console.error('Error al loguear params', e);
    }
    return { ok: false, error: String(err) };
  }
});

ipcMain.handle('db-get', async (event, sql, params) => {
  try {
    if (typeof sql !== 'string') throw new Error('SQL debe ser string');
    const cleanParams = sanitizeParams(params);
    if (isDev) console.debug('IPC db-get ->', { sql, params: describeParams(cleanParams) });
    const row = await callDbWithFallback(getQuery, sql, cleanParams);
    return { ok: true, row };
  } catch (err) {
    try {
      console.error('IPC db-get error:', err && err.message ? err.message : err);
      console.error('SQL:', sql);
      console.error('params (raw):', params);
      console.error('params (cleaned):', describeParams(sanitizeParams(params)));
      if (err.first) console.error('first error stack:', err.first && err.first.stack ? err.first.stack : err.first);
      if (err.second) console.error('second error stack:', err.second && err.second.stack ? err.second.stack : err.second);
    } catch (e) {
      console.error('Error al loguear params', e);
    }
    return { ok: false, error: String(err) };
  }
});

ipcMain.handle('db-all', async (event, sql, params) => {
  try {
    if (typeof sql !== 'string') throw new Error('SQL debe ser string');
    const cleanParams = sanitizeParams(params);
    if (isDev) console.debug('IPC db-all ->', { sql, params: describeParams(cleanParams) });
    const rows = await callDbWithFallback(allQuery, sql, cleanParams);
    return { ok: true, rows };
  } catch (err) {
    try {
      console.error('IPC db-all error:', err && err.message ? err.message : err);
      console.error('SQL:', sql);
      console.error('params (raw):', params);
      console.error('params (cleaned):', describeParams(sanitizeParams(params)));
      if (err.first) console.error('first error stack:', err.first && err.first.stack ? err.first.stack : err.first);
      if (err.second) console.error('second error stack:', err.second && err.second.stack ? err.second.stack : err.second);
    } catch (e) {
      console.error('Error al loguear params', e);
    }
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

// Export para testing (útil si haces unit tests sobre las funciones desde Node)
module.exports = {
  sanitizeParam,
  sanitizeParams,
  describeParams
};
