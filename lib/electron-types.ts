// Tipos para las APIs de Electron
export interface ElectronAPI {
  // Equipos
  getEquipos: () => Promise<any[]>
  createEquipo: (equipo: any) => Promise<{ success: boolean; error?: string }>
  updateEquipo: (id: string, changes: any) => Promise<{ success: boolean; error?: string }>
  deleteEquipo: (id: string) => Promise<{ success: boolean; error?: string }>

  // Mantenimientos
  getMantenimientos: () => Promise<any[]>
  createMantenimiento: (mantenimiento: any) => Promise<{ success: boolean; error?: string }>
  updateMantenimiento: (id: string, changes: any) => Promise<{ success: boolean; error?: string }>

  // Alertas
  getAlertas: () => Promise<any[]>
  createAlerta: (alerta: any) => Promise<{ success: boolean; id?: number; error?: string }>
  updateAlerta: (id: number, changes: any) => Promise<{ success: boolean; error?: string }>
  deleteAlerta: (id: number) => Promise<{ success: boolean; error?: string }>

  // Costos
  getCostos: () => Promise<any[]>
  createCosto: (costo: any) => Promise<{ success: boolean; error?: string }>

  // Órdenes de trabajo
  getOrdenesTrabajo: () => Promise<any[]>
  createOrdenTrabajo: (orden: any) => Promise<{ success: boolean; error?: string }>

  // Áreas de empresa
  getAreasEmpresa: () => Promise<any[]>
  createAreaEmpresa: (area: any) => Promise<{ success: boolean; error?: string }>

  // Utilidades
  isElectron: boolean
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
