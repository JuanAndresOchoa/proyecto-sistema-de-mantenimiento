// lib/database.ts
// Wrapper minimal para las APIs expuestas por preload.js (asumimos que preload expone window.electronAPI en Electron)
export const dbService = {
  // Equipos
  getEquipos: async () => {
    return (window as any).electronAPI?.getEquipos ? await (window as any).electronAPI.getEquipos() : [];
  },
  createEquipo: async (equipo: any) => {
    return (window as any).electronAPI?.createEquipo ? await (window as any).electronAPI.createEquipo(equipo) : { success: true };
  },
  updateEquipo: async (id: string, changes: any) => {
    return (window as any).electronAPI?.updateEquipo ? await (window as any).electronAPI.updateEquipo(id, changes) : { success: true };
  },
  deleteEquipo: async (id: string) => {
    return (window as any).electronAPI?.deleteEquipo ? await (window as any).electronAPI.deleteEquipo(id) : { success: true };
  },

  // Mantenimientos
  getMantenimientos: async () => {
    return (window as any).electronAPI?.getMantenimientos ? await (window as any).electronAPI.getMantenimientos() : [];
  },
  createMantenimiento: async (mantenimiento: any) => {
    return (window as any).electronAPI?.createMantenimiento ? await (window as any).electronAPI.createMantenimiento(mantenimiento) : { success: true };
  },
  updateMantenimiento: async (id: string, changes: any) => {
    return (window as any).electronAPI?.updateMantenimiento ? await (window as any).electronAPI.updateMantenimiento(id, changes) : { success: true };
  },

  // Alertas
  getAlertas: async () => {
    return (window as any).electronAPI?.getAlertas ? await (window as any).electronAPI.getAlertas() : [];
  },
  createAlerta: async (alerta: any) => {
    return (window as any).electronAPI?.createAlerta ? await (window as any).electronAPI.createAlerta(alerta) : { success: true, id: 1 };
  },
  updateAlerta: async (id: number, changes: any) => {
    return (window as any).electronAPI?.updateAlerta ? await (window as any).electronAPI.updateAlerta(id, changes) : { success: true };
  },
  deleteAlerta: async (id: number) => {
    return (window as any).electronAPI?.deleteAlerta ? await (window as any).electronAPI.deleteAlerta(id) : { success: true };
  },

  // Costos
  getCostos: async () => {
    return (window as any).electronAPI?.getCostos ? await (window as any).electronAPI.getCostos() : [];
  },
  createCosto: async (costo: any) => {
    return (window as any).electronAPI?.createCosto ? await (window as any).electronAPI.createCosto(costo) : { success: true };
  },

  // Órdenes de trabajo
  getOrdenesTrabajo: async () => {
    return (window as any).electronAPI?.getOrdenesTrabajo ? await (window as any).electronAPI.getOrdenesTrabajo() : [];
  },
  createOrdenTrabajo: async (orden: any) => {
    return (window as any).electronAPI?.createOrdenTrabajo ? await (window as any).electronAPI.createOrdenTrabajo(orden) : { success: true };
  },

  // Áreas de empresa
  getAreasEmpresa: async () => {
    return (window as any).electronAPI?.getAreasEmpresa ? await (window as any).electronAPI.getAreasEmpresa() : [];
  },
  createAreaEmpresa: async (area: any) => {
    return (window as any).electronAPI?.createAreaEmpresa ? await (window as any).electronAPI.createAreaEmpresa(area) : { success: true };
  },

  // TECNICOS
  getTecnicos: async () => {
    return (window as any).electronAPI?.getTecnicos ? await (window as any).electronAPI.getTecnicos() : [];
  },
  createTecnico: async (tecnico: any) => {
    return (window as any).electronAPI?.createTecnico ? await (window as any).electronAPI.createTecnico(tecnico) : { success: true };
  },
  updateTecnico: async (id: string, changes: any) => {
    return (window as any).electronAPI?.updateTecnico ? await (window as any).electronAPI.updateTecnico(id, changes) : { success: true };
  },
  deleteTecnico: async (id: string) => {
    return (window as any).electronAPI?.deleteTecnico ? await (window as any).electronAPI.deleteTecnico(id) : { success: true };
  },

  // EMPRESA (configuración)
  getEmpresa: async () => {
    return (window as any).electronAPI?.getEmpresa ? await (window as any).electronAPI.getEmpresa() : null;
  },
  upsertEmpresa: async (empresa: any) => {
    return (window as any).electronAPI?.upsertEmpresa ? await (window as any).electronAPI.upsertEmpresa(empresa) : { success: true };
  },

  // initializeSampleData (no-op para arrancar limpio)
  initializeSampleData: async () => {
    return { success: true };
  },
};
