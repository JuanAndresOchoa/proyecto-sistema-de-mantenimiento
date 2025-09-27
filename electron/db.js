// electron/db.js
// Wrapper para better-sqlite3 que sanitiza parámetros antes de bindear
const path = require('path');
const { app } = require('electron');
const Database = require('better-sqlite3');

// Ruta recomendada: carpeta userData de Electron.
// Si preferís un archivo dentro del repo, ajustá la ruta aquí.
const userDataPath = (app && app.getPath) ? app.getPath('userData') : path.join(__dirname, '..', 'data');
const dbPath = path.join(userDataPath, 'maintenance.db');

console.log('DB -> path:', dbPath);

// Abre o crea la DB. Quitá verbose si no querés logs de cada query.
const db = new Database(dbPath, { verbose: false });

// sanitizeParam: convierte valores no permitidos por better-sqlite3
function sanitizeParam(v) {
  if (v === undefined) return null;
  if (v === null) return null;
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (typeof v === 'number') return v;
  if (typeof v === 'bigint') return v;
  if (typeof v === 'string') return v;
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(v)) return v;
  if (v instanceof Date) return v.toISOString();
  // Para objetos que no son Buffer: stringify (almacenar JSON)
  try {
    return JSON.stringify(v);
  } catch (e) {
    return String(v);
  }
}

// sanitizeParams: soporta arrays (positional) y objetos (named parameters)
function sanitizeParams(params) {
  if (params == null) return [];
  if (Array.isArray(params)) return params.map(sanitizeParam);
  if (typeof params === 'object') {
    // named parameters: devuelve nuevo objeto con valores sanitizados
    const out = {};
    for (const k of Object.keys(params)) {
      out[k] = sanitizeParam(params[k]);
    }
    return out;
  }
  // un único valor -> array con elemento sanitizado
  return [sanitizeParam(params)];
}

function runQuery(sql, params) {
  const stmt = db.prepare(sql);
  const sanitized = sanitizeParams(params);
  // Si sanitized es objeto (named params) -> usar run(sanitized)
  if (!Array.isArray(sanitized) && typeof sanitized === 'object') {
    return stmt.run(sanitized);
  }
  return stmt.run(...sanitized);
}

function getQuery(sql, params) {
  const stmt = db.prepare(sql);
  const sanitized = sanitizeParams(params);
  if (!Array.isArray(sanitized) && typeof sanitized === 'object') {
    return stmt.get(sanitized);
  }
  return stmt.get(...sanitized);
}

function allQuery(sql, params) {
  const stmt = db.prepare(sql);
  const sanitized = sanitizeParams(params);
  if (!Array.isArray(sanitized) && typeof sanitized === 'object') {
    return stmt.all(sanitized);
  }
  return stmt.all(...sanitized);
}

module.exports = { runQuery, getQuery, allQuery, db };
