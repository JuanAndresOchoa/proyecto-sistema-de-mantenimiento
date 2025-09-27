"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { dbService } from "@/lib/database"

// Tipos de datos
export interface Equipo {
  id: string
  nombre: string
  tipo: string
  ubicacion: string
  estado: "Operativo" | "Mantenimiento" | "Fuera de Servicio"
  fechaInstalacion: string
  proximoMantenimiento: string
  horasOperacion: number
  eficiencia: number
}

export interface Mantenimiento {
  id: string
  equipoId: string
  equipoNombre: string
  tipo: "Preventivo" | "Correctivo" | "Predictivo"
  descripcion: string
  fechaProgramada: string
  fechaInicio?: string
  fechaCompletado?: string
  estado: "Programado" | "En Progreso" | "Completado" | "Cancelado"
  tecnico: string
  prioridad: "Baja" | "Media" | "Alta" | "Crítica"
  costo?: number
  observaciones?: string
}

export interface OrdenTrabajo {
  id: string
  numero: string
  titulo: string
  descripcion: string
  equipoId: string
  equipoNombre: string
  tipoTrabajo:
    | "Mantenimiento Preventivo"
    | "Mantenimiento Correctivo"
    | "Reparación"
    | "Instalación"
    | "Inspección"
    | "Modificación"
  prioridad: "Baja" | "Media" | "Alta" | "Crítica" | "Urgente"
  estado: "Abierta" | "Asignada" | "En Progreso" | "En Pausa" | "Completada" | "Cancelada" | "Cerrada"
  fechaCreacion: string
  fechaVencimiento?: string
  fechaInicio?: string
  fechaCompletado?: string
  solicitante: string
  tecnicoAsignado?: string
  departamento: string
  area: string
  ubicacion: string
  materialesRequeridos?: string[]
  herramientasRequeridas?: string[]
  procedimientos?: string[]
  tiempoEstimado?: number // en horas
  tiempoReal?: number // en horas
  costoEstimado?: number
  costoReal?: number
  observaciones?: string
  solucion?: string
  validadoPor?: string
  fechaValidacion?: string
}

export interface Alerta {
  id: number
  equipoId: string
  equipoNombre: string
  tipo: string
  mensaje: string
  nivel: "Crítico" | "Advertencia" | "Info"
  fechaCreacion: string
  fechaVencimiento?: string
  estado: "Activa" | "Leída" | "Resuelta"
}

export interface CostoMantenimiento {
  id: string
  mantenimientoId: string
  concepto: string
  categoria: "Mano de Obra" | "Repuestos" | "Herramientas" | "Servicios Externos" | "Otros"
  costo: number
  fecha: string
  proveedor?: string
  observaciones?: string
}

export interface AreaEmpresa {
  id: string
  nombre: string
  descripcion: string
  responsable: string
  activa: boolean
}

interface AppContextType {
  equipos: Equipo[]
  mantenimientos: Mantenimiento[]
  alertas: Alerta[]
  costos: CostoMantenimiento[]
  ordenesTrabajo: OrdenTrabajo[]
  areasEmpresa: AreaEmpresa[]
  loading: boolean
  error: string | null
  actualizarEquipo: (equipoId: string, cambios: Partial<Equipo>) => Promise<void>
  iniciarMantenimiento: (mantenimientoId: string) => Promise<void>
  completarMantenimiento: (mantenimientoId: string, observaciones?: string) => Promise<void>
  crearAlerta: (alerta: Omit<Alerta, "id">) => Promise<void>
  eliminarAlerta: (alertaId: number) => Promise<void>
  marcarAlertaComoLeida: (alertaId: number) => Promise<void>
  resolverAlerta: (alertaId: number) => Promise<void>
  reactivarAlerta: (alertaId: number) => Promise<void>
  agregarCosto: (costo: Omit<CostoMantenimiento, "id">) => Promise<void>
  actualizarCosto: (costoId: string, cambios: Partial<CostoMantenimiento>) => Promise<void>
  eliminarCosto: (costoId: string) => Promise<void>
  obtenerCostosTotales: () => number
  obtenerCostosPorCategoria: () => { [key: string]: number }
  obtenerCostosPorMantenimiento: (mantenimientoId: string) => CostoMantenimiento[]
  crearOrdenTrabajo: (orden: Omit<OrdenTrabajo, "id" | "fechaCreacion">) => Promise<void>
  actualizarOrdenTrabajo: (ordenId: string, cambios: Partial<OrdenTrabajo>) => Promise<void>
  eliminarOrdenTrabajo: (ordenId: string) => Promise<void>
  asignarOrdenTrabajo: (ordenId: string, tecnico: string) => Promise<void>
  iniciarOrdenTrabajo: (ordenId: string) => Promise<void>
  pausarOrdenTrabajo: (ordenId: string) => Promise<void>
  completarOrdenTrabajo: (ordenId: string, solucion: string, tiempoReal?: number, costoReal?: number) => Promise<void>
  cancelarOrdenTrabajo: (ordenId: string, motivo: string) => Promise<void>
  cerrarOrdenTrabajo: (ordenId: string, validadoPor: string) => Promise<void>
  obtenerOrdenesPorEstado: (estado: string) => OrdenTrabajo[]
  obtenerOrdenesPorTecnico: (tecnico: string) => OrdenTrabajo[]
  crearAreaEmpresa: (area: Omit<AreaEmpresa, "id">) => Promise<void>
  actualizarAreaEmpresa: (areaId: string, cambios: Partial<AreaEmpresa>) => Promise<void>
  eliminarAreaEmpresa: (areaId: string) => Promise<void>
  generarNumeroOrden: () => string
  refreshData: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([])
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [costos, setCostos] = useState<CostoMantenimiento[]>([])
  const [ordenesTrabajo, setOrdenesTrabajo] = useState<OrdenTrabajo[]>([])
  const [areasEmpresa, setAreasEmpresa] = useState<AreaEmpresa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [equiposData, mantenimientosData, alertasData, costosData, ordenesData, areasData] = await Promise.all([
        dbService.getEquipos(),
        dbService.getMantenimientos(),
        dbService.getAlertas(),
        dbService.getCostos(),
        dbService.getOrdenesTrabajo(),
        dbService.getAreasEmpresa(),
      ])

      setEquipos(equiposData)
      setMantenimientos(mantenimientosData)
      setAlertas(alertasData)
      setCostos(costosData)
      setOrdenesTrabajo(ordenesData)
      setAreasEmpresa(areasData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading data")
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      await dbService.initializeSampleData()
      await loadData()
    }

    initializeData()
  }, [])

  const refreshData = async () => {
    await loadData()
  }

  const actualizarEquipo = async (equipoId: string, cambios: Partial<Equipo>) => {
    try {
      const result = await dbService.updateEquipo(equipoId, cambios)
      if (result.success) {
        setEquipos((prev) => prev.map((equipo) => (equipo.id === equipoId ? { ...equipo, ...cambios } : equipo)))
      } else {
        throw new Error(result.error || "Error updating equipo")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating equipo")
      throw err
    }
  }

  const iniciarMantenimiento = async (mantenimientoId: string) => {
    try {
      const ahora = new Date().toISOString()
      const result = await dbService.updateMantenimiento(mantenimientoId, {
        estado: "En Progreso",
        fechaInicio: ahora,
      })

      if (result.success) {
        setMantenimientos((prev) =>
          prev.map((mnt) => (mnt.id === mantenimientoId ? { ...mnt, estado: "En Progreso", fechaInicio: ahora } : mnt)),
        )

        // Actualizar estado del equipo
        const mantenimiento = mantenimientos.find((m) => m.id === mantenimientoId)
        if (mantenimiento) {
          await actualizarEquipo(mantenimiento.equipoId, { estado: "Mantenimiento" })
        }
      } else {
        throw new Error(result.error || "Error starting maintenance")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error starting maintenance")
      throw err
    }
  }

  const completarMantenimiento = async (mantenimientoId: string, observaciones?: string) => {
    try {
      const ahora = new Date().toISOString()
      const result = await dbService.updateMantenimiento(mantenimientoId, {
        estado: "Completado",
        fechaCompletado: ahora,
        observaciones: observaciones || "Mantenimiento completado exitosamente",
      })

      if (result.success) {
        setMantenimientos((prev) =>
          prev.map((mnt) =>
            mnt.id === mantenimientoId
              ? {
                  ...mnt,
                  estado: "Completado",
                  fechaCompletado: ahora,
                  observaciones: observaciones || "Mantenimiento completado exitosamente",
                }
              : mnt,
          ),
        )

        // Actualizar estado del equipo y próximo mantenimiento
        const mantenimiento = mantenimientos.find((m) => m.id === mantenimientoId)
        if (mantenimiento) {
          const proximaFecha = new Date()
          proximaFecha.setMonth(proximaFecha.getMonth() + 3) // Próximo mantenimiento en 3 meses

          await actualizarEquipo(mantenimiento.equipoId, {
            estado: "Operativo",
            proximoMantenimiento: proximaFecha.toISOString().split("T")[0],
          })

          // Crear alerta de mantenimiento completado
          await crearAlerta({
            equipoId: mantenimiento.equipoId,
            equipoNombre: mantenimiento.equipoNombre,
            tipo: "Mantenimiento Completado",
            mensaje: `${mantenimiento.tipo} completado exitosamente`,
            nivel: "Info",
            fechaCreacion: ahora,
            estado: "Activa",
          })
        }
      } else {
        throw new Error(result.error || "Error completing maintenance")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error completing maintenance")
      throw err
    }
  }

  const crearAlerta = async (nuevaAlerta: Omit<Alerta, "id">) => {
    try {
      const result = await dbService.createAlerta(nuevaAlerta)
      if (result.success && result.id) {
        setAlertas((prev) => [...prev, { ...nuevaAlerta, id: result.id }])
      } else {
        throw new Error(result.error || "Error creating alert")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating alert")
      throw err
    }
  }

  const eliminarAlerta = async (alertaId: number) => {
    try {
      const result = await dbService.deleteAlerta(alertaId)
      if (result.success) {
        setAlertas((prev) => prev.filter((alerta) => alerta.id !== alertaId))
      } else {
        throw new Error(result.error || "Error deleting alert")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting alert")
      throw err
    }
  }

  const marcarAlertaComoLeida = async (alertaId: number) => {
    try {
      const result = await dbService.updateAlerta(alertaId, { estado: "Leída" })
      if (result.success) {
        setAlertas((prev) => prev.map((alerta) => (alerta.id === alertaId ? { ...alerta, estado: "Leída" } : alerta)))
      } else {
        throw new Error(result.error || "Error marking alert as read")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error marking alert as read")
      throw err
    }
  }

  const resolverAlerta = async (alertaId: number) => {
    try {
      const result = await dbService.updateAlerta(alertaId, { estado: "Resuelta" })
      if (result.success) {
        setAlertas((prev) =>
          prev.map((alerta) => (alerta.id === alertaId ? { ...alerta, estado: "Resuelta" } : alerta)),
        )
      } else {
        throw new Error(result.error || "Error resolving alert")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error resolving alert")
      throw err
    }
  }

  const reactivarAlerta = async (alertaId: number) => {
    try {
      const result = await dbService.updateAlerta(alertaId, { estado: "Activa" })
      if (result.success) {
        setAlertas((prev) => prev.map((alerta) => (alerta.id === alertaId ? { ...alerta, estado: "Activa" } : alerta)))
      } else {
        throw new Error(result.error || "Error reactivating alert")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error reactivating alert")
      throw err
    }
  }

  const agregarCosto = async (nuevoCosto: Omit<CostoMantenimiento, "id">) => {
    try {
      const id = `CST-${String(costos.length + 1).padStart(3, "0")}`
      const costoCompleto = { ...nuevoCosto, id }

      const result = await dbService.createCosto(costoCompleto)
      if (result.success) {
        setCostos((prev) => [...prev, costoCompleto])

        // Actualizar el costo total del mantenimiento
        const costosMantenimiento = costos.filter((c) => c.mantenimientoId === nuevoCosto.mantenimientoId)
        const costoTotal = costosMantenimiento.reduce((sum, c) => sum + c.costo, 0) + nuevoCosto.costo

        await dbService.updateMantenimiento(nuevoCosto.mantenimientoId, { costo: costoTotal })
        setMantenimientos((prev) =>
          prev.map((mnt) => (mnt.id === nuevoCosto.mantenimientoId ? { ...mnt, costo: costoTotal } : mnt)),
        )
      } else {
        throw new Error(result.error || "Error adding cost")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error adding cost")
      throw err
    }
  }

  const actualizarCosto = async (costoId: string, cambios: Partial<CostoMantenimiento>) => {
    setCostos((prev) => prev.map((costo) => (costo.id === costoId ? { ...costo, ...cambios } : costo)))

    // Recalcular costo total del mantenimiento
    const costo = costos.find((c) => c.id === costoId)
    if (costo) {
      const costosMantenimiento = costos.filter((c) => c.mantenimientoId === costo.mantenimientoId)
      const costoTotal = costosMantenimiento.reduce(
        (sum, c) => (c.id === costoId ? sum + (cambios.costo || c.costo) : sum + c.costo),
        0,
      )

      setMantenimientos((prev) =>
        prev.map((mnt) => (mnt.id === costo.mantenimientoId ? { ...mnt, costo: costoTotal } : mnt)),
      )
    }
  }

  const eliminarCosto = async (costoId: string) => {
    const costo = costos.find((c) => c.id === costoId)
    setCostos((prev) => prev.filter((c) => c.id !== costoId))

    // Recalcular costo total del mantenimiento
    if (costo) {
      const costosMantenimiento = costos.filter((c) => c.mantenimientoId === costo.mantenimientoId && c.id !== costoId)
      const costoTotal = costosMantenimiento.reduce((sum, c) => sum + c.costo, 0)

      setMantenimientos((prev) =>
        prev.map((mnt) => (mnt.id === costo.mantenimientoId ? { ...mnt, costo: costoTotal } : mnt)),
      )
    }
  }

  const obtenerCostosTotales = () => {
    return costos.reduce((total, costo) => total + costo.costo, 0)
  }

  const obtenerCostosPorCategoria = () => {
    return costos.reduce(
      (acc, costo) => {
        acc[costo.categoria] = (acc[costo.categoria] || 0) + costo.costo
        return acc
      },
      {} as { [key: string]: number },
    )
  }

  const obtenerCostosPorMantenimiento = (mantenimientoId: string) => {
    return costos.filter((costo) => costo.mantenimientoId === mantenimientoId)
  }

  const generarNumeroOrden = () => {
    const año = new Date().getFullYear()
    const numeroSecuencial = ordenesTrabajo.length + 1
    return `${año}-${String(numeroSecuencial).padStart(3, "0")}`
  }

  const crearOrdenTrabajo = async (nuevaOrden: Omit<OrdenTrabajo, "id" | "fechaCreacion">) => {
    try {
      const id = `OT-${String(ordenesTrabajo.length + 1).padStart(3, "0")}`
      const fechaCreacion = new Date().toISOString()

      // Si no se proporciona número o está vacío, generar automáticamente
      const numero = nuevaOrden.numero && nuevaOrden.numero.trim() !== "" ? nuevaOrden.numero : generarNumeroOrden()

      const ordenCompleta = {
        ...nuevaOrden,
        id,
        numero,
        fechaCreacion,
        estado: "Abierta" as const,
      }

      const result = await dbService.createOrdenTrabajo(ordenCompleta)
      if (result.success) {
        setOrdenesTrabajo((prev) => [...prev, ordenCompleta])
      } else {
        throw new Error(result.error || "Error creating work order")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating work order")
      throw err
    }
  }

  const actualizarOrdenTrabajo = async (ordenId: string, cambios: Partial<OrdenTrabajo>) => {
    setOrdenesTrabajo((prev) => prev.map((orden) => (orden.id === ordenId ? { ...orden, ...cambios } : orden)))
  }

  const eliminarOrdenTrabajo = async (ordenId: string) => {
    setOrdenesTrabajo((prev) => prev.filter((orden) => orden.id !== ordenId))
  }

  const asignarOrdenTrabajo = async (ordenId: string, tecnico: string) => {
    setOrdenesTrabajo((prev) =>
      prev.map((orden) => (orden.id === ordenId ? { ...orden, tecnicoAsignado: tecnico, estado: "Asignada" } : orden)),
    )
  }

  const iniciarOrdenTrabajo = async (ordenId: string) => {
    const ahora = new Date().toISOString()
    setOrdenesTrabajo((prev) =>
      prev.map((orden) => (orden.id === ordenId ? { ...orden, estado: "En Progreso", fechaInicio: ahora } : orden)),
    )
  }

  const pausarOrdenTrabajo = async (ordenId: string) => {
    setOrdenesTrabajo((prev) => prev.map((orden) => (orden.id === ordenId ? { ...orden, estado: "En Pausa" } : orden)))
  }

  const completarOrdenTrabajo = async (ordenId: string, solucion: string, tiempoReal?: number, costoReal?: number) => {
    const ahora = new Date().toISOString()
    setOrdenesTrabajo((prev) =>
      prev.map((orden) =>
        orden.id === ordenId
          ? {
              ...orden,
              estado: "Completada",
              fechaCompletado: ahora,
              solucion,
              tiempoReal,
              costoReal,
            }
          : orden,
      ),
    )
  }

  const cancelarOrdenTrabajo = async (ordenId: string, motivo: string) => {
    setOrdenesTrabajo((prev) =>
      prev.map((orden) => (orden.id === ordenId ? { ...orden, estado: "Cancelada", observaciones: motivo } : orden)),
    )
  }

  const cerrarOrdenTrabajo = async (ordenId: string, validadoPor: string) => {
    const ahora = new Date().toISOString()
    setOrdenesTrabajo((prev) =>
      prev.map((orden) =>
        orden.id === ordenId ? { ...orden, estado: "Cerrada", validadoPor, fechaValidacion: ahora } : orden,
      ),
    )
  }

  const obtenerOrdenesPorEstado = (estado: string) => {
    return ordenesTrabajo.filter((orden) => orden.estado === estado)
  }

  const obtenerOrdenesPorTecnico = (tecnico: string) => {
    return ordenesTrabajo.filter((orden) => orden.tecnicoAsignado === tecnico)
  }

  const crearAreaEmpresa = async (nuevaArea: Omit<AreaEmpresa, "id">) => {
    try {
      const id = `AREA-${String(areasEmpresa.length + 1).padStart(3, "0")}`
      const areaCompleta = { ...nuevaArea, id }

      const result = await dbService.createAreaEmpresa(areaCompleta)
      if (result.success) {
        setAreasEmpresa((prev) => [...prev, areaCompleta])
      } else {
        throw new Error(result.error || "Error creating company area")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating company area")
      throw err
    }
  }

  const actualizarAreaEmpresa = async (areaId: string, cambios: Partial<AreaEmpresa>) => {
    setAreasEmpresa((prev) => prev.map((area) => (area.id === areaId ? { ...area, ...cambios } : area)))
  }

  const eliminarAreaEmpresa = async (areaId: string) => {
    setAreasEmpresa((prev) => prev.filter((area) => area.id !== areaId))
  }

  return (
    <AppContext.Provider
      value={{
        equipos,
        mantenimientos,
        alertas,
        costos,
        ordenesTrabajo,
        areasEmpresa,
        loading,
        error,
        actualizarEquipo,
        iniciarMantenimiento,
        completarMantenimiento,
        crearAlerta,
        eliminarAlerta,
        marcarAlertaComoLeida,
        resolverAlerta,
        reactivarAlerta,
        agregarCosto,
        actualizarCosto,
        eliminarCosto,
        obtenerCostosTotales,
        obtenerCostosPorCategoria,
        obtenerCostosPorMantenimiento,
        crearOrdenTrabajo,
        actualizarOrdenTrabajo,
        eliminarOrdenTrabajo,
        asignarOrdenTrabajo,
        iniciarOrdenTrabajo,
        pausarOrdenTrabajo,
        completarOrdenTrabajo,
        cancelarOrdenTrabajo,
        cerrarOrdenTrabajo,
        obtenerOrdenesPorEstado,
        obtenerOrdenesPorTecnico,
        crearAreaEmpresa,
        actualizarAreaEmpresa,
        eliminarAreaEmpresa,
        generarNumeroOrden,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
