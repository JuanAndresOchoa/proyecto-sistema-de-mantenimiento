const { contextBridge, ipcRenderer } = require("electron")

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  // Equipos
  getEquipos: () => ipcRenderer.invoke("get-equipos"),
  createEquipo: (equipo) => ipcRenderer.invoke("create-equipo", equipo),
  updateEquipo: (id, equipo) => ipcRenderer.invoke("update-equipo", id, equipo),
  deleteEquipo: (id) => ipcRenderer.invoke("delete-equipo", id),

  // Mantenimientos
  getMantenimientos: () => ipcRenderer.invoke("get-mantenimientos"),
  createMantenimiento: (mantenimiento) => ipcRenderer.invoke("create-mantenimiento", mantenimiento),
  updateMantenimiento: (id, mantenimiento) => ipcRenderer.invoke("update-mantenimiento", id, mantenimiento),
  deleteMantenimiento: (id) => ipcRenderer.invoke("delete-mantenimiento", id),

  // Costos
  getCostos: () => ipcRenderer.invoke("get-costos"),
  createCosto: (costo) => ipcRenderer.invoke("create-costo", costo),
  updateCosto: (id, costo) => ipcRenderer.invoke("update-costo", id, costo),
  deleteCosto: (id) => ipcRenderer.invoke("delete-costo", id),

  // Órdenes de trabajo
  getOrdenesTrabajos: () => ipcRenderer.invoke("get-ordenes-trabajo"),
  createOrdenTrabajo: (orden) => ipcRenderer.invoke("create-orden-trabajo", orden),
  updateOrdenTrabajo: (id, orden) => ipcRenderer.invoke("update-orden-trabajo", id, orden),
  deleteOrdenTrabajo: (id) => ipcRenderer.invoke("delete-orden-trabajo", id),

  // Alertas
  getAlertas: () => ipcRenderer.invoke("get-alertas"),
  createAlerta: (alerta) => ipcRenderer.invoke("create-alerta", alerta),
  updateAlerta: (id, alerta) => ipcRenderer.invoke("update-alerta", id, alerta),
  deleteAlerta: (id) => ipcRenderer.invoke("delete-alerta", id),

  // Áreas de empresa
  getAreasEmpresa: () => ipcRenderer.invoke("get-areas-empresa"),
  createAreaEmpresa: (area) => ipcRenderer.invoke("create-area-empresa", area),
  updateAreaEmpresa: (id, area) => ipcRenderer.invoke("update-area-empresa", id, area),
  deleteAreaEmpresa: (id) => ipcRenderer.invoke("delete-area-empresa", id),

  // Utilidades
  generateNextOrderNumber: () => ipcRenderer.invoke("generate-next-order-number"),
  getStatistics: () => ipcRenderer.invoke("get-statistics"),
  exportData: (type, filters) => ipcRenderer.invoke("export-data", type, filters),
})
