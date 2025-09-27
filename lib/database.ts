// Capa de abstracción para la base de datos
// Funciona tanto en entorno web (localStorage) como en Electron (SQLite)

import type {
  Equipo,
  Mantenimiento,
  Alerta,
  CostoMantenimiento,
  OrdenTrabajo,
  AreaEmpresa,
} from "@/contexts/app-context"

export class DatabaseService {
  private isElectron: boolean

  constructor() {
    this.isElectron = typeof window !== "undefined" && window.electronAPI?.isElectron === true
  }

  // Equipos
  async getEquipos(): Promise<Equipo[]> {
    if (this.isElectron) {
      return await window.electronAPI.getEquipos()
    } else {
      const data = localStorage.getItem("equipos")
      return data ? JSON.parse(data) : []
    }
  }

  async createEquipo(equipo: Equipo): Promise<{ success: boolean; error?: string }> {
    if (this.isElectron) {
      return await window.electronAPI.createEquipo(equipo)
    } else {
      const equipos = await this.getEquipos()
      equipos.push(equipo)
      localStorage.setItem("equipos", JSON.stringify(equipos))
      return { success: true }
    }
  }

  async updateEquipo(id: string, changes: Partial<Equipo>): Promise<{ success: boolean; error?: string }> {
    if (this.isElectron) {
      return await window.electronAPI.updateEquipo(id, changes)
    } else {
      const equipos = await this.getEquipos()
      const index = equipos.findIndex((e) => e.id === id)
      if (index !== -1) {
        equipos[index] = { ...equipos[index], ...changes }
        localStorage.setItem("equipos", JSON.stringify(equipos))
        return { success: true }
      }
      return { success: false, error: "Equipo not found" }
    }
  }

  async deleteEquipo(id: string): Promise<{ success: boolean; error?: string }> {
    if (this.isElectron) {
      return await window.electronAPI.deleteEquipo(id)
    } else {
      const equipos = await this.getEquipos()
      const filtered = equipos.filter((e) => e.id !== id)
      localStorage.setItem("equipos", JSON.stringify(filtered))
      return { success: true }
    }
  }

  // Mantenimientos
  async getMantenimientos(): Promise<Mantenimiento[]> {
    if (this.isElectron) {
      return await window.electronAPI.getMantenimientos()
    } else {
      const data = localStorage.getItem("mantenimientos")
      return data ? JSON.parse(data) : []
    }
  }

  async createMantenimiento(mantenimiento: Mantenimiento): Promise<{ success: boolean; error?: string }> {
    if (this.isElectron) {
      return await window.electronAPI.createMantenimiento(mantenimiento)
    } else {
      const mantenimientos = await this.getMantenimientos()
      mantenimientos.push(mantenimiento)
      localStorage.setItem("mantenimientos", JSON.stringify(mantenimientos))
      return { success: true }
    }
  }

  async updateMantenimiento(
    id: string,
    changes: Partial<Mantenimiento>,
  ): Promise<{ success: boolean; error?: string }> {
    if (this.isElectron) {
      return await window.electronAPI.updateMantenimiento(id, changes)
    } else {
      const mantenimientos = await this.getMantenimientos()
      const index = mantenimientos.findIndex((m) => m.id === id)
      if (index !== -1) {
        mantenimientos[index] = { ...mantenimientos[index], ...changes }
        localStorage.setItem("mantenimientos", JSON.stringify(mantenimientos))
        return { success: true }
      }
      return { success: false, error: "Mantenimiento not found" }
    }
  }

  // Alertas
  async getAlertas(): Promise<Alerta[]> {
    if (this.isElectron) {
      return await window.electronAPI.getAlertas()
    } else {
      const data = localStorage.getItem("alertas")
      return data ? JSON.parse(data) : []
    }
  }

  async createAlerta(alerta: Omit<Alerta, "id">): Promise<{ success: boolean; id?: number; error?: string }> {
    if (this.isElectron) {
      return await window.electronAPI.createAlerta(alerta)
    } else {
      const alertas = await this.getAlertas()
      const id = Math.max(...alertas.map((a) => a.id), 0) + 1
      const nuevaAlerta = { ...alerta, id }
      alertas.push(nuevaAlerta)
      localStorage.setItem("alertas", JSON.stringify(alertas))
      return { success: true, id }
    }
  }

  async updateAlerta(id: number, changes: Partial<Alerta>): Promise<{ success: boolean; error?: string }> {
    if (this.isElectron) {
      return await window.electronAPI.updateAlerta(id, changes)
    } else {
      const alertas = await this.getAlertas()
      const index = alertas.findIndex((a) => a.id === id)
      if (index !== -1) {
        alertas[index] = { ...alertas[index], ...changes }
        localStorage.setItem("alertas", JSON.stringify(alertas))
        return { success: true }
      }
      return { success: false, error: "Alerta not found" }
    }
  }

  async deleteAlerta(id: number): Promise<{ success: boolean; error?: string }> {
    if (this.isElectron) {
      return await window.electronAPI.deleteAlerta(id)
    } else {
      const alertas = await this.getAlertas()
      const filtered = alertas.filter((a) => a.id !== id)
      localStorage.setItem("alertas", JSON.stringify(filtered))
      return { success: true }
    }
  }

  // Costos
  async getCostos(): Promise<CostoMantenimiento[]> {
    if (this.isElectron) {
      return await window.electronAPI.getCostos()
    } else {
      const data = localStorage.getItem("costos")
      return data ? JSON.parse(data) : []
    }
  }

  async createCosto(costo: CostoMantenimiento): Promise<{ success: boolean; error?: string }> {
    if (this.isElectron) {
      return await window.electronAPI.createCosto(costo)
    } else {
      const costos = await this.getCostos()
      costos.push(costo)
      localStorage.setItem("costos", JSON.stringify(costos))
      return { success: true }
    }
  }

  // Órdenes de trabajo
  async getOrdenesTrabajo(): Promise<OrdenTrabajo[]> {
    if (this.isElectron) {
      return await window.electronAPI.getOrdenesTrabajo()
    } else {
      const data = localStorage.getItem("ordenesTrabajo")
      return data ? JSON.parse(data) : []
    }
  }

  async createOrdenTrabajo(orden: OrdenTrabajo): Promise<{ success: boolean; error?: string }> {
    if (this.isElectron) {
      return await window.electronAPI.createOrdenTrabajo(orden)
    } else {
      const ordenes = await this.getOrdenesTrabajo()
      ordenes.push(orden)
      localStorage.setItem("ordenesTrabajo", JSON.stringify(ordenes))
      return { success: true }
    }
  }

  // Áreas de empresa
  async getAreasEmpresa(): Promise<AreaEmpresa[]> {
    if (this.isElectron) {
      return await window.electronAPI.getAreasEmpresa()
    } else {
      const data = localStorage.getItem("areasEmpresa")
      return data ? JSON.parse(data) : []
    }
  }

  async createAreaEmpresa(area: AreaEmpresa): Promise<{ success: boolean; error?: string }> {
    if (this.isElectron) {
      return await window.electronAPI.createAreaEmpresa(area)
    } else {
      const areas = await this.getAreasEmpresa()
      areas.push(area)
      localStorage.setItem("areasEmpresa", JSON.stringify(areas))
      return { success: true }
    }
  }

  // Método para inicializar datos de ejemplo (solo en localStorage)
  async initializeSampleData(): Promise<void> {
    if (this.isElectron) return // En Electron, los datos se manejan desde el main process

    const equipos = await this.getEquipos()
    if (equipos.length === 0) {
      // Datos de ejemplo para equipos
      const sampleEquipos: Equipo[] = [
        {
          id: "MOT-001",
          nombre: "Motor Principal Línea A",
          tipo: "Motor Eléctrico",
          ubicacion: "Planta Principal - Sector A",
          estado: "Operativo",
          fechaInstalacion: "2020-03-15",
          proximoMantenimiento: "2024-01-25",
          horasOperacion: 8760,
          eficiencia: 87,
        },
        {
          id: "BOM-001",
          nombre: "Bomba Centrífuga Agua",
          tipo: "Bomba Centrífuga",
          ubicacion: "Sala de Bombas",
          estado: "Operativo",
          fechaInstalacion: "2021-06-10",
          proximoMantenimiento: "2024-01-18",
          horasOperacion: 6240,
          eficiencia: 92,
        },
      ]

      for (const equipo of sampleEquipos) {
        await this.createEquipo(equipo)
      }
    }

    // Inicializar otros datos de ejemplo si es necesario
    const mantenimientos = await this.getMantenimientos()
    if (mantenimientos.length === 0) {
      const sampleMantenimientos: Mantenimiento[] = [
        {
          id: "MNT-001",
          equipoId: "MOT-001",
          equipoNombre: "Motor Principal Línea A",
          tipo: "Preventivo",
          descripcion: "Cambio de aceite y filtros, inspección general",
          fechaProgramada: "2024-01-25T08:00:00",
          estado: "Programado",
          tecnico: "Juan Pérez",
          prioridad: "Alta",
          costo: 450,
        },
      ]

      for (const mantenimiento of sampleMantenimientos) {
        await this.createMantenimiento(mantenimiento)
      }
    }
  }
}

// Instancia singleton del servicio de base de datos
export const dbService = new DatabaseService()
