const { app, BrowserWindow, ipcMain, dialog } = require("electron")
const path = require("path")
const isDev = require("electron-is-dev")
const Database = require("better-sqlite3")
const fs = require("fs")

let mainWindow
let db

// Inicializar base de datos
function initDatabase() {
  const dbPath = path.join(app.getPath("userData"), "mantenimiento.db")

  try {
    db = new Database(dbPath)

    // Configurar WAL mode para mejor rendimiento
    db.pragma("journal_mode = WAL")

    // Crear tablas si no existen
    createTables()

    console.log("Base de datos inicializada correctamente")
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error)
    dialog.showErrorBox("Error de Base de Datos", "No se pudo inicializar la base de datos: " + error.message)
  }
}

function createTables() {
  const createTablesSQL = `
    -- Tabla de equipos
    CREATE TABLE IF NOT EXISTS equipos (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      tipo TEXT NOT NULL,
      ubicacion TEXT NOT NULL,
      estado TEXT NOT NULL DEFAULT 'Operativo',
      fechaInstalacion TEXT NOT NULL,
      proximoMantenimiento TEXT,
      horasOperacion INTEGER DEFAULT 0,
      eficiencia REAL DEFAULT 100.0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabla de mantenimientos
    CREATE TABLE IF NOT EXISTS mantenimientos (
      id TEXT PRIMARY KEY,
      equipoId TEXT NOT NULL,
      tipo TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      fechaProgramada TEXT NOT NULL,
      fechaCompletado TEXT,
      tecnico TEXT NOT NULL,
      prioridad TEXT NOT NULL DEFAULT 'Media',
      estado TEXT NOT NULL DEFAULT 'Programado',
      observaciones TEXT,
      tiempoEstimado INTEGER,
      tiempoReal INTEGER,
      materiales TEXT,
      herramientas TEXT,
      procedimientos TEXT,
      repuestos TEXT,
      frecuencia TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (equipoId) REFERENCES equipos (id)
    );

    -- Tabla de costos
    CREATE TABLE IF NOT EXISTS costos (
      id TEXT PRIMARY KEY,
      mantenimientoId TEXT NOT NULL,
      categoria TEXT NOT NULL,
      concepto TEXT NOT NULL,
      monto REAL NOT NULL,
      proveedor TEXT,
      fecha TEXT NOT NULL,
      observaciones TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (mantenimientoId) REFERENCES mantenimientos (id)
    );

    -- Tabla de órdenes de trabajo
    CREATE TABLE IF NOT EXISTS ordenes_trabajo (
      id TEXT PRIMARY KEY,
      numero TEXT UNIQUE NOT NULL,
      titulo TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      equipoId TEXT NOT NULL,
      tipoTrabajo TEXT NOT NULL,
      prioridad TEXT NOT NULL DEFAULT 'Media',
      estado TEXT NOT NULL DEFAULT 'Abierta',
      solicitante TEXT NOT NULL,
      tecnicoAsignado TEXT,
      departamento TEXT,
      area TEXT,
      ubicacion TEXT,
      fechaCreacion TEXT NOT NULL,
      fechaAsignacion TEXT,
      fechaInicio TEXT,
      fechaCompletado TEXT,
      tiempoEstimado INTEGER,
      tiempoReal INTEGER,
      costoEstimado REAL,
      costoReal REAL,
      materiales TEXT,
      herramientas TEXT,
      procedimientos TEXT,
      observaciones TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (equipoId) REFERENCES equipos (id)
    );

    -- Tabla de alertas
    CREATE TABLE IF NOT EXISTS alertas (
      id TEXT PRIMARY KEY,
      tipo TEXT NOT NULL,
      titulo TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      nivel TEXT NOT NULL DEFAULT 'Info',
      estado TEXT NOT NULL DEFAULT 'Activa',
      equipoId TEXT,
      fechaCreacion TEXT NOT NULL,
      fechaLeida TEXT,
      fechaResuelta TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (equipoId) REFERENCES equipos (id)
    );

    -- Tabla de áreas de la empresa
    CREATE TABLE IF NOT EXISTS areas_empresa (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL UNIQUE,
      descripcion TEXT,
      responsable TEXT,
      activo INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Índices para mejor rendimiento
    CREATE INDEX IF NOT EXISTS idx_equipos_estado ON equipos(estado);
    CREATE INDEX IF NOT EXISTS idx_mantenimientos_equipo ON mantenimientos(equipoId);
    CREATE INDEX IF NOT EXISTS idx_mantenimientos_estado ON mantenimientos(estado);
    CREATE INDEX IF NOT EXISTS idx_costos_mantenimiento ON costos(mantenimientoId);
    CREATE INDEX IF NOT EXISTS idx_ordenes_estado ON ordenes_trabajo(estado);
    CREATE INDEX IF NOT EXISTS idx_ordenes_equipo ON ordenes_trabajo(equipoId);
    CREATE INDEX IF NOT EXISTS idx_alertas_estado ON alertas(estado);
  `

  db.exec(createTablesSQL)
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "assets", "icon.png"),
    show: false,
    titleBarStyle: "default",
  })

  const startUrl = isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../out/index.html")}`

  mainWindow.loadURL(startUrl)

  mainWindow.once("ready-to-show", () => {
    mainWindow.show()
  })

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  initDatabase()
  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (db) {
      db.close()
    }
    app.quit()
  }
})

app.on("before-quit", () => {
  if (db) {
    db.close()
  }
})

// IPC Handlers para operaciones de base de datos
require("./database-handlers")(ipcMain, db)
