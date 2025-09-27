"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Clock, Zap, CheckCircle, Search, Filter, RotateCcw, Trash2 } from "lucide-react"
import { useApp } from "@/contexts/app-context"

export function AlertasDashboard() {
  const { alertas, marcarAlertaComoLeida, resolverAlerta, reactivarAlerta, eliminarAlerta } = useApp()
  const [filtroNivel, setFiltroNivel] = useState("Todas")
  const [filtroEstado, setFiltroEstado] = useState("Todas")
  const [busqueda, setBusqueda] = useState("")

  const alertasFiltradas = alertas.filter((alerta) => {
    const coincideBusqueda =
      alerta.equipoNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      alerta.mensaje.toLowerCase().includes(busqueda.toLowerCase())
    const coincideNivel = filtroNivel === "Todas" || alerta.nivel === filtroNivel
    const coincideEstado = filtroEstado === "Todas" || alerta.estado === filtroEstado

    return coincideBusqueda && coincideNivel && coincideEstado
  })

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "Crítico":
        return "destructive"
      case "Advertencia":
        return "default"
      case "Info":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getNivelIcon = (nivel: string) => {
    switch (nivel) {
      case "Crítico":
        return <AlertTriangle className="h-4 w-4" />
      case "Advertencia":
        return <Clock className="h-4 w-4" />
      case "Info":
        return <Zap className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Activa":
        return "destructive"
      case "Leída":
        return "default"
      case "Resuelta":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const alertasActivas = alertas.filter((a) => a.estado === "Activa").length
  const alertasCriticas = alertas.filter((a) => a.nivel === "Crítico" && a.estado === "Activa").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alertas del Sistema</h1>
          <p className="text-muted-foreground">Gestión de alertas y notificaciones de mantenimiento</p>
        </div>
        <div className="flex gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Alertas Activas</p>
                <p className="text-2xl font-bold">{alertasActivas}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Críticas</p>
                <p className="text-2xl font-bold text-destructive">{alertasCriticas}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por equipo o mensaje..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filtroNivel} onValueChange={setFiltroNivel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todos los niveles</SelectItem>
                <SelectItem value="Crítico">Crítico</SelectItem>
                <SelectItem value="Advertencia">Advertencia</SelectItem>
                <SelectItem value="Info">Información</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todos los estados</SelectItem>
                <SelectItem value="Activa">Activas</SelectItem>
                <SelectItem value="Leída">Leídas</SelectItem>
                <SelectItem value="Resuelta">Resueltas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alertas */}
      <div className="space-y-4">
        {alertasFiltradas.map((alerta) => (
          <Card
            key={alerta.id}
            className={`${alerta.estado === "Activa" && alerta.nivel === "Crítico" ? "border-destructive" : ""}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getNivelIcon(alerta.nivel)}
                    <Badge variant={getNivelColor(alerta.nivel) as any}>{alerta.nivel}</Badge>
                    <Badge variant={getEstadoColor(alerta.estado) as any}>{alerta.estado}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {alerta.equipoId} - {alerta.equipoNombre}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{alerta.tipo}</h3>
                  <p className="text-muted-foreground mb-3">{alerta.mensaje}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Creada: {new Date(alerta.fechaCreacion).toLocaleString()}</span>
                    {alerta.fechaVencimiento && (
                      <span>Vence: {new Date(alerta.fechaVencimiento).toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => eliminarAlerta(alerta.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  {alerta.estado === "Activa" && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => marcarAlertaComoLeida(alerta.id)}>
                        Marcar como Leída
                      </Button>
                      <Button variant="default" size="sm" onClick={() => resolverAlerta(alerta.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolver
                      </Button>
                    </>
                  )}
                  {(alerta.estado === "Leída" || alerta.estado === "Resuelta") && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => reactivarAlerta(alerta.id)}>
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reactivar
                      </Button>
                      {alerta.estado === "Leída" && (
                        <Button variant="default" size="sm" onClick={() => resolverAlerta(alerta.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolver
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {alertasFiltradas.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron alertas</h3>
            <p className="text-muted-foreground">No hay alertas que coincidan con los filtros seleccionados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
