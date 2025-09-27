// electron/preload.js
// Expone una API segura al renderer (contextBridge).
const { contextBridge, ipcRenderer } = require('electron');

// Reenvía errores no atrapados del renderer al main (útil para debugging)
try {
  window.addEventListener('error', (ev) => {
    try { ipcRenderer.send('renderer-error', { message: ev.message, stack: ev.error?.stack }); } catch (e) {}
  });
  window.addEventListener('unhandledrejection', (ev) => {
    try { ipcRenderer.send('renderer-error', { message: ev.reason?.message || String(ev.reason), stack: ev.reason?.stack }); } catch (e) {}
  });
} catch (e) {
  // en caso de que window no esté disponible por alguna razón no crítica en preload
}

/**
 * Helper: normaliza params para que siempre sea un array.
 * Si el caller pasa un único valor, lo convertimos a [value].
 */
function normalizeParams(params) {
  if (params === undefined || params === null) return [];
  return Array.isArray(params) ? params : [params];
}

contextBridge.exposeInMainWorld('electronAPI', {
  // DB: las llamadas devuelven la estructura { ok: boolean, ... }
  dbRun: (sql, params) => ipcRenderer.invoke('db-run', sql, normalizeParams(params)),
  dbGet: (sql, params) => ipcRenderer.invoke('db-get', sql, normalizeParams(params)),
  dbAll: (sql, params) => ipcRenderer.invoke('db-all', sql, normalizeParams(params)),

  // utilitarios
  log: (...args) => {
    try { ipcRenderer.send('renderer-log', ...args); } catch (e) {}
  }
});
