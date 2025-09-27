"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  FileText,
  Clock,
  User,
  Play,
  Pause,
  CheckCircle,
  X,
  Eye,
  Edit,
  Download,
  UserCheck,
  AlertTriangle,
  Trash2,
} from "lucide-react"
import { OrdenTrabajoForm } from "./orden-trabajo-form"
import { OrdenTrabajoDetalle } from "./orden-trabajo-detalle"
import { DialogCustom } from "@/components/ui/dialog-custom"
import { useApp } from "@/contexts/app-context"

export function OrdenesTrabajoList() {
  const {
    ordenesTrabajo,
    equipos,
    asignarOrdenTrabajo,
    iniciarOrdenTrabajo,
    pausarOrdenTrabajo,
    completarOrdenTrabajo,
    cancelarOrdenTrabajo,
    cerrarOrdenTrabajo,
    eliminarOrdenTrabajo,
  } = useApp()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState("todos")
  const [filterPrioridad, setFilterPrioridad] = useState("todos")
  const [filterTipo, setFilterTipo] = useState("todos")
  const [showForm, setShowForm] = useState(false)
  const [selectedOrden, setSelectedOrden] = useState<any>(null)
  const [showDetalle, setShowDetalle] = useState(false)
  const [editingOrden, setEditingOrden] = useState<any>(null)

  // Modales de acciones
  const [asignarModal, setAsignarModal] = useState<{ isOpen: boolean; orden: any | null }>({
    isOpen: false,
    orden: null,
  })
  const [completarModal, setCompletarModal] = useState<{ isOpen: boolean; orden: any | null }>({
    isOpen: false,
    orden: null,
  })
  const [cancelarModal, setCancelarModal] = useState<{ isOpen: boolean; orden: any | null }>({
    isOpen: false,
    orden: null,
  })
  const [cerrarModal, setCerrarModal] = useState<{ isOpen: boolean; orden: any | null }>({ isOpen: false, orden: null })

  const [eliminarModal, setEliminarModal] = useState<{ isOpen: boolean; orden: any | null }>({
    isOpen: false,
    orden: null,
  })

  const [tecnicoAsignar, setTecnicoAsignar] = useState("")
  const [solucionCompletar, setSolucionCompletar] = useState("")
  const [tiempoReal, setTiempoReal] = useState("")
  const [costoReal, setCostoReal] = useState("")
  const [motivoCancelar, setMotivoCancelar] = useState("")
  const [validadoPor, setValidadoPor] = useState("")

  const ordenesAbiertas = ordenesTrabajo.filter((o) =>
    ["Abierta", "Asignada", "En Progreso", "En Pausa"].includes(o.estado),
  )
  const ordenesCompletadas = ordenesTrabajo.filter((o) => ["Completada", "Cerrada"].includes(o.estado))
  const ordenesCanceladas = ordenesTrabajo.filter((o) => o.estado === "Cancelada")

  const filteredOrdenes = ordenesAbiertas.filter((orden) => {
    const matchesSearch =
      orden.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.equipoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (orden.tecnicoAsignado && orden.tecnicoAsignado.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesEstado = filterEstado === "todos" || orden.estado === filterEstado
    const matchesPrioridad = filterPrioridad === "todos" || orden.prioridad === filterPrioridad
    const matchesTipo = filterTipo === "todos" || orden.tipoTrabajo === filterTipo

    return matchesSearch && matchesEstado && matchesPrioridad && matchesTipo
  })

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Abierta":
        return "outline"
      case "Asignada":
        return "secondary"
      case "En Progreso":
        return "default"
      case "En Pausa":
        return "secondary"
      case "Completada":
        return "default"
      case "Cerrada":
        return "default"
      case "Cancelada":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPrioridadBadgeVariant = (prioridad: string) => {
    switch (prioridad) {
      case "Urgente":
        return "destructive"
      case "Crítica":
        return "destructive"
      case "Alta":
        return "secondary"
      case "Media":
        return "outline"
      case "Baja":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "Urgente":
        return "text-red-600"
      case "Crítica":
        return "text-red-500"
      case "Alta":
        return "text-orange-500"
      case "Media":
        return "text-yellow-500"
      case "Baja":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const tecnicos = ["Juan Pérez", "María García", "Carlos López", "Ana Rodríguez", "Luis Martín", "Carmen Silva"]

  const handleSaveOrden = (ordenData: any) => {
    console.log("[v0] Guardando orden de trabajo:", ordenData)
    setShowForm(false)
    setEditingOrden(null)
  }

  const handleAsignar = (orden: any) => {
    setAsignarModal({ isOpen: true, orden })
    setTecnicoAsignar("")
  }

  const confirmAsignar = () => {
    if (asignarModal.orden && tecnicoAsignar) {
      asignarOrdenTrabajo(asignarModal.orden.id, tecnicoAsignar)
      setAsignarModal({ isOpen: false, orden: null })
      setTecnicoAsignar("")
    }
  }

  const handleIniciar = (orden: any) => {
    iniciarOrdenTrabajo(orden.id)
  }

  const handlePausar = (orden: any) => {
    pausarOrdenTrabajo(orden.id)
  }

  const handleCompletar = (orden: any) => {
    setCompletarModal({ isOpen: true, orden })
    setSolucionCompletar("")
    setTiempoReal("")
    setCostoReal("")
  }

  const confirmCompletar = () => {
    if (completarModal.orden && solucionCompletar) {
      completarOrdenTrabajo(
        completarModal.orden.id,
        solucionCompletar,
        tiempoReal ? Number.parseFloat(tiempoReal) : undefined,
        costoReal ? Number.parseFloat(costoReal) : undefined,
      )
      setCompletarModal({ isOpen: false, orden: null })
      setSolucionCompletar("")
      setTiempoReal("")
      setCostoReal("")
    }
  }

  const handleCancelar = (orden: any) => {
    setCancelarModal({ isOpen: true, orden })
    setMotivoCancelar("")
  }

  const confirmCancelar = () => {
    if (cancelarModal.orden && motivoCancelar) {
      cancelarOrdenTrabajo(cancelarModal.orden.id, motivoCancelar)
      setCancelarModal({ isOpen: false, orden: null })
      setMotivoCancelar("")
    }
  }

  const handleCerrar = (orden: any) => {
    setCerrarModal({ isOpen: true, orden })
    setValidadoPor("")
  }

  const confirmCerrar = () => {
    if (cerrarModal.orden && validadoPor) {
      cerrarOrdenTrabajo(cerrarModal.orden.id, validadoPor)
      setCerrarModal({ isOpen: false, orden: null })
      setValidadoPor("")
    }
  }

  const handleEliminar = (orden: any) => {
    setEliminarModal({ isOpen: true, orden })
  }

  const confirmEliminar = () => {
    if (eliminarModal.orden) {
      eliminarOrdenTrabajo(eliminarModal.orden.id)
      setEliminarModal({ isOpen: false, orden: null })
    }
  }

  const handleVerDetalle = (orden: any) => {
    setSelectedOrden(orden)
    setShowDetalle(true)
  }

  const handleEditar = (orden: any) => {
    setEditingOrden(orden)
    setShowForm(true)
  }

  const exportarOrdenPDF = (orden: any) => {
    const fechaActual = new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Orden de Trabajo ${orden.numero}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333; 
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #2563eb; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
          }
          .header h1 { 
            color: #2563eb; 
            margin: 0; 
            font-size: 28px; 
          }
          .orden-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .info-section {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            background: #f9fafb;
          }
          .info-section h3 {
            color: #1f2937;
            margin-top: 0;
            margin-bottom: 15px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .info-label {
            font-weight: bold;
            color: #374151;
          }
          .info-value {
            color: #6b7280;
          }
          .descripcion {
            background: #f0f9ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
          }
          .lista {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
          }
          .lista h4 {
            margin-top: 0;
            color: #374151;
          }
          .lista ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .lista li {
            margin-bottom: 5px;
          }
          .estado {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .estado-abierta { background: #f3f4f6; color: #374151; }
          .estado-asignada { background: #fef3c7; color: #92400e; }
          .estado-progreso { background: #dbeafe; color: #1e40af; }
          .estado-completada { background: #d1fae5; color: #065f46; }
          .estado-cancelada { background: #fee2e2; color: #991b1b; }
          .prioridad {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .prioridad-urgente { background: #fee2e2; color: #991b1b; }
          .prioridad-critica { background: #fecaca; color: #b91c1c; }
          .prioridad-alta { background: #fed7aa; color: #c2410c; }
          .prioridad-media { background: #fef3c7; color: #92400e; }
          .prioridad-baja { background: #d1fae5; color: #065f46; }
          .footer {
            margin-top: 50px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          .firma-section {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 30px;
          }
          .firma-box {
            border: 1px solid #e5e7eb;
            padding: 20px;
            text-align: center;
            min-height: 80px;
          }
          .firma-label {
            font-weight: bold;
            margin-bottom: 10px;
          }
          .firma-line {
            border-top: 1px solid #374151;
            margin-top: 40px;
            padding-top: 5px;
            font-size: 12px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ORDEN DE TRABAJO</h1>
          <p><strong>No. ${orden.numero}</strong></p>
          <p>Fecha de emisión: ${fechaActual}</p>
        </div>

        <div class="orden-info">
          <div class="info-section">
            <h3>Información General</h3>
            <div class="info-row">
              <span class="info-label">Título:</span>
              <span class="info-value">${orden.titulo}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Tipo de Trabajo:</span>
              <span class="info-value">${orden.tipoTrabajo}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Estado:</span>
              <span class="estado estado-${orden.estado.toLowerCase().replace(" ", "-")}">${orden.estado}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Prioridad:</span>
              <span class="prioridad prioridad-${orden.prioridad.toLowerCase()}">${orden.prioridad}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Solicitante:</span>
              <span class="info-value">${orden.solicitante}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Departamento:</span>
              <span class="info-value">${orden.departamento}</span>
            </div>
          </div>

          <div class="info-section">
            <h3>Equipo y Ubicación</h3>
            <div class="info-row">
              <span class="info-label">Equipo ID:</span>
              <span class="info-value">${orden.equipoId}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Nombre del Equipo:</span>
              <span class="info-value">${orden.equipoNombre}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Ubicación:</span>
              <span class="info-value">${orden.ubicacion}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Técnico Asignado:</span>
              <span class="info-value">${orden.tecnicoAsignado || "No asignado"}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Tiempo Estimado:</span>
              <span class="info-value">${orden.tiempoEstimado || "N/A"} horas</span>
            </div>
            <div class="info-row">
              <span class="info-label">Costo Estimado:</span>
              <span class="info-value">$${orden.costoEstimado?.toLocaleString() || "N/A"}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3>Fechas Importantes</h3>
          <div class="orden-info">
            <div>
              <div class="info-row">
                <span class="info-label">Fecha de Creación:</span>
                <span class="info-value">${new Date(orden.fechaCreacion).toLocaleDateString("es-ES")}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Fecha de Vencimiento:</span>
                <span class="info-value">${orden.fechaVencimiento ? new Date(orden.fechaVencimiento).toLocaleDateString("es-ES") : "N/A"}</span>
              </div>
            </div>
            <div>
              <div class="info-row">
                <span class="info-label">Fecha de Inicio:</span>
                <span class="info-value">${orden.fechaInicio ? new Date(orden.fechaInicio).toLocaleDateString("es-ES") : "N/A"}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Fecha de Completado:</span>
                <span class="info-value">${orden.fechaCompletado ? new Date(orden.fechaCompletado).toLocaleDateString("es-ES") : "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="descripcion">
          <h3>Descripción del Trabajo</h3>
          <p>${orden.descripcion}</p>
        </div>

        ${
          orden.materialesRequeridos && orden.materialesRequeridos.length > 0
            ? `
        <div class="lista">
          <h4>Materiales Requeridos</h4>
          <ul>
            ${orden.materialesRequeridos.map((material) => `<li>${material}</li>`).join("")}
          </ul>
        </div>
        `
            : ""
        }

        ${
          orden.herramientasRequeridas && orden.herramientasRequeridas.length > 0
            ? `
        <div class="lista">
          <h4>Herramientas Requeridas</h4>
          <ul>
            ${orden.herramientasRequeridas.map((herramienta) => `<li>${herramienta}</li>`).join("")}
          </ul>
        </div>
        `
            : ""
        }

        ${
          orden.procedimientos && orden.procedimientos.length > 0
            ? `
        <div class="lista">
          <h4>Procedimientos</h4>
          <ul>
            ${orden.procedimientos.map((procedimiento) => `<li>${procedimiento}</li>`).join("")}
          </ul>
        </div>
        `
            : ""
        }

        ${
          orden.solucion
            ? `
        <div class="descripcion">
          <h3>Solución Implementada</h3>
          <p>${orden.solucion}</p>
        </div>
        `
            : ""
        }

        ${
          orden.observaciones
            ? `
        <div class="descripcion">
          <h3>Observaciones</h3>
          <p>${orden.observaciones}</p>
        </div>
        `
            : ""
        }

        <div class="firma-section">
          <div class="firma-box">
            <div class="firma-label">Solicitante</div>
            <div class="firma-line">${orden.solicitante}</div>
          </div>
          <div class="firma-box">
            <div class="firma-label">Técnico Ejecutor</div>
            <div class="firma-line">${orden.tecnicoAsignado || "_________________"}</div>
          </div>
          <div class="firma-box">
            <div class="firma-label">Supervisor</div>
            <div class="firma-line">${orden.validadoPor || "_________________"}</div>
          </div>
        </div>

        <div class="footer">
          <p>Orden de Trabajo generada automáticamente por el Sistema de Gestión de Mantenimiento</p>
          <p>Fecha y hora de generación: ${new Date().toLocaleString("es-ES")}</p>
        </div>
      </body>
      </html>
    `

    // Crear un nuevo documento para imprimir
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()

      // Esperar a que se cargue el contenido y luego imprimir
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 500)
      }
    }

    console.log("[v0] Orden de trabajo PDF generada exitosamente")
  }

  if (showForm) {
    return (
      <OrdenTrabajoForm
        orden={editingOrden}
        onSave={handleSaveOrden}
        onCancel={() => {
          setShowForm(false)
          setEditingOrden(null)
        }}
      />
    )
  }

  if (showDetalle && selectedOrden) {
    return (
      <OrdenTrabajoDetalle
        orden={selectedOrden}
        onClose={() => {
          setShowDetalle(false)
          setSelectedOrden(null)
        }}
        onEdit={() => {
          setShowDetalle(false)
          handleEditar(selectedOrden)
        }}
        onExportPDF={() => exportarOrdenPDF(selectedOrden)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Órdenes de Trabajo
          </h2>
          <p className="text-muted-foreground">Gestiona y supervisa todas las órdenes de trabajo del sistema</p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Nueva Orden
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Abiertas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{ordenesAbiertas.length}</div>
            <p className="text-xs text-muted-foreground">Pendientes de gestión</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {ordenesTrabajo.filter((o) => o.estado === "En Progreso").length}
            </div>
            <p className="text-xs text-muted-foreground">Trabajos activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-5">{ordenesCompletadas.length}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticas/Urgentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {
                ordenesTrabajo.filter(
                  (o) =>
                    ["Crítica", "Urgente"].includes(o.prioridad) &&
                    !["Completada", "Cerrada", "Cancelada"].includes(o.estado),
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="activas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activas">Órdenes Activas</TabsTrigger>
          <TabsTrigger value="completadas">Completadas</TabsTrigger>
          <TabsTrigger value="canceladas">Canceladas</TabsTrigger>
        </TabsList>

        {/* Órdenes Activas */}
        <TabsContent value="activas" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por número, título, equipo o técnico..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterEstado} onValueChange={setFilterEstado}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="Abierta">Abierta</SelectItem>
                    <SelectItem value="Asignada">Asignada</SelectItem>
                    <SelectItem value="En Progreso">En Progreso</SelectItem>
                    <SelectItem value="En Pausa">En Pausa</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPrioridad} onValueChange={setFilterPrioridad}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas las prioridades</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                    <SelectItem value="Crítica">Crítica</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterTipo} onValueChange={setFilterTipo}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    <SelectItem value="Mantenimiento Preventivo">Preventivo</SelectItem>
                    <SelectItem value="Mantenimiento Correctivo">Correctivo</SelectItem>
                    <SelectItem value="Reparación">Reparación</SelectItem>
                    <SelectItem value="Instalación">Instalación</SelectItem>
                    <SelectItem value="Inspección">Inspección</SelectItem>
                    <SelectItem value="Modificación">Modificación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de Órdenes Activas */}
          <Card>
            <CardHeader>
              <CardTitle>Órdenes de Trabajo Activas</CardTitle>
              <CardDescription>
                Mostrando {filteredOrdenes.length} de {ordenesAbiertas.length} órdenes activas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Orden</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Técnico</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrdenes.map((orden) => (
                    <TableRow key={orden.id}>
                      <TableCell>
                        <div className="font-medium">{orden.numero}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium truncate">{orden.titulo}</p>
                          <p className="text-sm text-muted-foreground truncate">{orden.solicitante}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{orden.equipoId}</p>
                          <p className="text-sm text-muted-foreground">{orden.equipoNombre}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{orden.tipoTrabajo}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPrioridadBadgeVariant(orden.prioridad)}>{orden.prioridad}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getEstadoBadgeVariant(orden.estado)}>{orden.estado}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {orden.tecnicoAsignado || "Sin asignar"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {orden.fechaVencimiento ? (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {new Date(orden.fechaVencimiento).toLocaleDateString()}
                          </div>
                        ) : (
                          "Sin fecha"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerDetalle(orden)}
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditar(orden)} title="Editar orden">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => exportarOrdenPDF(orden)}
                            title="Exportar PDF"
                          >
                            <Download className="h-4 w-4" />
                          </Button>

                          {orden.estado === "Abierta" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAsignar(orden)}
                              title="Asignar técnico"
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          )}

                          {orden.estado === "Asignada" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleIniciar(orden)}
                              title="Iniciar trabajo"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}

                          {orden.estado === "En Progreso" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePausar(orden)}
                                title="Pausar trabajo"
                              >
                                <Pause className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCompletar(orden)}
                                title="Completar trabajo"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}

                          {orden.estado === "En Pausa" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleIniciar(orden)}
                              title="Reanudar trabajo"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}

                          {!["Completada", "Cerrada"].includes(orden.estado) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelar(orden)}
                              title="Cancelar orden"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEliminar(orden)}
                            title="Eliminar orden permanentemente"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Órdenes Completadas */}
        <TabsContent value="completadas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Órdenes de Trabajo Completadas</CardTitle>
              <CardDescription>Historial de órdenes completadas y cerradas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Orden</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Técnico</TableHead>
                    <TableHead>Fecha Completado</TableHead>
                    <TableHead>Tiempo Real</TableHead>
                    <TableHead>Costo Real</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordenesCompletadas.map((orden) => (
                    <TableRow key={orden.id}>
                      <TableCell>
                        <div className="font-medium">{orden.numero}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium truncate">{orden.titulo}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{orden.equipoId}</p>
                          <p className="text-sm text-muted-foreground">{orden.equipoNombre}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {orden.tecnicoAsignado}
                        </div>
                      </TableCell>
                      <TableCell>
                        {orden.fechaCompletado ? (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {new Date(orden.fechaCompletado).toLocaleDateString()}
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>{orden.tiempoReal ? `${orden.tiempoReal}h` : "N/A"}</TableCell>
                      <TableCell>{orden.costoReal ? `$${orden.costoReal.toLocaleString()}` : "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={getEstadoBadgeVariant(orden.estado)}>{orden.estado}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerDetalle(orden)}
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => exportarOrdenPDF(orden)}
                            title="Exportar PDF"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {orden.estado === "Completada" && (
                            <Button variant="ghost" size="sm" onClick={() => handleCerrar(orden)} title="Cerrar orden">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEliminar(orden)}
                            title="Eliminar orden permanentemente"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Órdenes Canceladas */}
        <TabsContent value="canceladas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Órdenes de Trabajo Canceladas</CardTitle>
              <CardDescription>Historial de órdenes canceladas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Orden</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Solicitante</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordenesCanceladas.map((orden) => (
                    <TableRow key={orden.id}>
                      <TableCell>
                        <div className="font-medium">{orden.numero}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium truncate">{orden.titulo}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{orden.equipoId}</p>
                          <p className="text-sm text-muted-foreground">{orden.equipoNombre}</p>
                        </div>
                      </TableCell>
                      <TableCell>{orden.solicitante}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {new Date(orden.fechaCreacion).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {orden.observaciones || "Sin especificar"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerDetalle(orden)}
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => exportarOrdenPDF(orden)}
                            title="Exportar PDF"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEliminar(orden)}
                            title="Eliminar orden permanentemente"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modales */}

      {/* Modal Asignar Técnico */}
      <DialogCustom
        isOpen={asignarModal.isOpen}
        onClose={() => setAsignarModal({ isOpen: false, orden: null })}
        title="Asignar Técnico"
        actions={
          <>
            <Button variant="outline" onClick={() => setAsignarModal({ isOpen: false, orden: null })}>
              Cancelar
            </Button>
            <Button onClick={confirmAsignar} disabled={!tecnicoAsignar}>
              <UserCheck className="h-4 w-4 mr-1" />
              Asignar
            </Button>
          </>
        }
      >
        {asignarModal.orden && (
          <div className="space-y-4">
            <p>
              Asignar técnico a la orden <strong>{asignarModal.orden.numero}</strong>
            </p>
            <div>
              <label className="text-sm font-medium">Técnico:</label>
              <Select value={tecnicoAsignar} onValueChange={setTecnicoAsignar}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar técnico" />
                </SelectTrigger>
                <SelectContent>
                  {tecnicos.map((tecnico) => (
                    <SelectItem key={tecnico} value={tecnico}>
                      {tecnico}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </DialogCustom>

      {/* Modal Completar Orden */}
      <DialogCustom
        isOpen={completarModal.isOpen}
        onClose={() => setCompletarModal({ isOpen: false, orden: null })}
        title="Completar Orden de Trabajo"
        actions={
          <>
            <Button variant="outline" onClick={() => setCompletarModal({ isOpen: false, orden: null })}>
              Cancelar
            </Button>
            <Button onClick={confirmCompletar} disabled={!solucionCompletar}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Completar
            </Button>
          </>
        }
      >
        {completarModal.orden && (
          <div className="space-y-4">
            <p>
              Completar orden <strong>{completarModal.orden.numero}</strong>
            </p>
            <div>
              <label className="text-sm font-medium">Solución implementada *:</label>
              <textarea
                className="w-full mt-1 p-2 border rounded-md"
                rows={3}
                value={solucionCompletar}
                onChange={(e) => setSolucionCompletar(e.target.value)}
                placeholder="Describe la solución implementada..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tiempo real (horas):</label>
                <Input
                  type="number"
                  step="0.5"
                  value={tiempoReal}
                  onChange={(e) => setTiempoReal(e.target.value)}
                  placeholder="Ej: 3.5"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Costo real:</label>
                <Input
                  type="number"
                  step="0.01"
                  value={costoReal}
                  onChange={(e) => setCostoReal(e.target.value)}
                  placeholder="Ej: 250.00"
                />
              </div>
            </div>
          </div>
        )}
      </DialogCustom>

      {/* Modal Cancelar Orden */}
      <DialogCustom
        isOpen={cancelarModal.isOpen}
        onClose={() => setCancelarModal({ isOpen: false, orden: null })}
        title="Cancelar Orden de Trabajo"
        actions={
          <>
            <Button variant="outline" onClick={() => setCancelarModal({ isOpen: false, orden: null })}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmCancelar} disabled={!motivoCancelar}>
              <X className="h-4 w-4 mr-1" />
              Cancelar Orden
            </Button>
          </>
        }
      >
        {cancelarModal.orden && (
          <div className="space-y-4">
            <p>
              ¿Estás seguro de cancelar la orden <strong>{cancelarModal.orden.numero}</strong>?
            </p>
            <div>
              <label className="text-sm font-medium">Motivo de cancelación *:</label>
              <textarea
                className="w-full mt-1 p-2 border rounded-md"
                rows={3}
                value={motivoCancelar}
                onChange={(e) => setMotivoCancelar(e.target.value)}
                placeholder="Especifica el motivo de la cancelación..."
              />
            </div>
          </div>
        )}
      </DialogCustom>

      {/* Modal Cerrar Orden */}
      <DialogCustom
        isOpen={cerrarModal.isOpen}
        onClose={() => setCerrarModal({ isOpen: false, orden: null })}
        title="Cerrar Orden de Trabajo"
        actions={
          <>
            <Button variant="outline" onClick={() => setCerrarModal({ isOpen: false, orden: null })}>
              Cancelar
            </Button>
            <Button onClick={confirmCerrar} disabled={!validadoPor}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Cerrar Orden
            </Button>
          </>
        }
      >
        {cerrarModal.orden && (
          <div className="space-y-4">
            <p>
              Cerrar orden completada <strong>{cerrarModal.orden.numero}</strong>
            </p>
            <div>
              <label className="text-sm font-medium">Validado por *:</label>
              <Input
                value={validadoPor}
                onChange={(e) => setValidadoPor(e.target.value)}
                placeholder="Nombre del supervisor que valida"
              />
            </div>
          </div>
        )}
      </DialogCustom>

      <DialogCustom
        isOpen={eliminarModal.isOpen}
        onClose={() => setEliminarModal({ isOpen: false, orden: null })}
        title="Eliminar Orden de Trabajo"
        actions={
          <>
            <Button variant="outline" onClick={() => setEliminarModal({ isOpen: false, orden: null })}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmEliminar}>
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar Permanentemente
            </Button>
          </>
        }
      >
        {eliminarModal.orden && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">¡Advertencia!</span>
            </div>
            <p>
              ¿Estás seguro de que deseas eliminar permanentemente la orden{" "}
              <strong>{eliminarModal.orden.numero}</strong>?
            </p>
            <p className="text-sm text-muted-foreground">
              Esta acción no se puede deshacer. La orden será eliminada completamente del sistema junto con todo su
              historial.
            </p>
            <div className="bg-muted p-3 rounded">
              <p className="text-sm">
                <strong>Orden:</strong> {eliminarModal.orden.titulo}
              </p>
              <p className="text-sm">
                <strong>Equipo:</strong> {eliminarModal.orden.equipoNombre}
              </p>
              <p className="text-sm">
                <strong>Estado:</strong> {eliminarModal.orden.estado}
              </p>
            </div>
          </div>
        )}
      </DialogCustom>
    </div>
  )
}
