"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Zap, Wrench, AlertTriangle, CheckCircle, Clock, Calendar, Settings } from "lucide-react"
import { useApp } from "@/contexts/app-context"

interface DashboardProps {
  onSectionChange?: (section: string) => void
}

export function Dashboard({ onSectionChange }: DashboardProps) {
  const { equipos, mantenimientos, alertas, obtenerCostosTotales } = useApp()

  const stats = {
    totalEquipos: equipos.length,
    equiposOperativos: equipos.filter((e) => e.estado === "Operativo").length,
    equiposMantenimiento: equipos.filter((e) => e.estado === "Mantenimiento").length,
    equiposFueraServicio: equipos.filter((e) => e.estado === "Fuera de Servicio").length,
    mantenimientosPendientes: mantenimientos.filter((m) => m.estado === "Programado").length,
    mantenimientosVencidos: mantenimientos.filter((m) => {
      const fechaProgramada = new Date(m.fechaProgramada)
      const hoy = new Date()
      return m.estado === "Programado" && fechaProgramada < hoy
    }).length,
    alertasActivas: alertas.filter((a) => a.estado === "Activa").length,
  }

  const equiposCriticos = equipos.slice(0, 4).map((equipo) => ({
    id: equipo.id,
    nombre: equipo.nombre,
    estado: equipo.estado,
    criticidad: equipo.eficiencia < 80 ? "Alta" : equipo.eficiencia < 90 ? "Media" : "Baja",
  }))

  const mantenimientosPendientes = mantenimientos
    .filter((m) => m.estado === "Programado")
    .slice(0, 3)
    .map((m) => ({
      equipo: m.equipoId,
      equipoNombre: m.equipoNombre,
      tipo: m.tipo,
      fecha: new Date(m.fechaProgramada).toLocaleDateString(),
      prioridad: m.prioridad,
      tecnico: m.tecnico,
    }))

  const alertasRecientes = alertas
    .filter((a) => a.estado === "Activa")
    .slice(0, 3)
    .map((a) => ({
      tipo: a.nivel === "Crítico" ? "Crítico" : a.nivel === "Advertencia" ? "Advertencia" : "Info",
      mensaje: a.mensaje,
      tiempo: (() => {
        const fechaCreacion = new Date(a.fechaCreacion)
        const ahora = new Date()
        const diffDias = Math.floor((ahora.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24))
        return diffDias === 0 ? "Hoy" : `${diffDias} día${diffDias > 1 ? "s" : ""}`
      })(),
    }))

  const disponibilidad = Math.round((stats.equiposOperativos / stats.totalEquipos) * 100)

  // Funciones para manejar los botones
  const handleProgramarClick = () => {
    onSectionChange?.("mantenimientos")
  }

  const handleConfigurarClick = () => {
    onSectionChange?.("configuracion")
  }

  return (
    <div className="flex-1 space-y-6 p-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sistema de control de mantenimiento</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleProgramarClick}>
            <Calendar className="h-4 w-4 mr-2" />
            Programar
          </Button>
          <button
            onClick={handleConfigurarClick}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 hover:border-blue-700"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipos</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalEquipos}</div>
            <p className="text-xs text-muted-foreground">
              {stats.equiposOperativos} operativos, {stats.equiposMantenimiento} en mantenimiento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mantenimientos</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.mantenimientosPendientes}</div>
            <p className="text-xs text-muted-foreground">{stats.mantenimientosVencidos} vencidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibilidad</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{disponibilidad}%</div>
            <Progress value={disponibilidad} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.alertasActivas}</div>
            <p className="text-xs text-muted-foreground">Requieren atención inmediata</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Equipos Críticos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Equipos Críticos
            </CardTitle>
            <CardDescription>Estado actual de los equipos de mayor criticidad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {equiposCriticos.map((equipo, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{equipo.id}</span>
                      <Badge variant={equipo.criticidad === "Alta" ? "destructive" : "secondary"} className="text-xs">
                        {equipo.criticidad}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{equipo.nombre}</p>
                  </div>
                  <Badge
                    variant={equipo.estado === "Operativo" ? "default" : "secondary"}
                    className={equipo.estado === "Operativo" ? "bg-chart-5" : ""}
                  >
                    {equipo.estado}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Alertas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertasRecientes.length > 0 ? (
                alertasRecientes.map((alerta, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant={
                          alerta.tipo === "Crítico"
                            ? "destructive"
                            : alerta.tipo === "Advertencia"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {alerta.tipo}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{alerta.tiempo}</span>
                    </div>
                    <p className="text-sm">{alerta.mensaje}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-chart-5" />
                  <p className="text-sm">No hay alertas activas</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mantenimientos Pendientes */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-secondary" />
              Mantenimientos Pendientes
            </CardTitle>
            <CardDescription>Próximos mantenimientos programados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mantenimientosPendientes.length > 0 ? (
                mantenimientosPendientes.map((mantenimiento, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{mantenimiento.equipo}</span>
                          <Badge
                            variant={
                              mantenimiento.prioridad === "Crítica"
                                ? "destructive"
                                : mantenimiento.prioridad === "Alta"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {mantenimiento.prioridad}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{mantenimiento.equipoNombre}</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{mantenimiento.fecha}</p>
                        <p className="text-muted-foreground">{mantenimiento.tecnico}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => onSectionChange?.("mantenimientos")}>
                      Ver Detalles
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-chart-5" />
                  <p className="text-sm">No hay mantenimientos pendientes</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
