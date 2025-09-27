"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Edit,
  Download,
  Calendar,
  User,
  MapPin,
  FileText,
  Wrench,
  Package,
  CheckSquare,
  DollarSign,
} from "lucide-react"
import type { OrdenTrabajo } from "@/contexts/app-context"

interface OrdenTrabajoDetalleProps {
  orden: OrdenTrabajo
  onClose: () => void
  onEdit: () => void
  onExportPDF: () => void
}

export function OrdenTrabajoDetalle({ orden, onClose, onEdit, onExportPDF }: OrdenTrabajoDetalleProps) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Orden de Trabajo {orden.numero}
            </h2>
            <p className="text-muted-foreground">{orden.titulo}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" onClick={onExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Número</p>
                <p className="font-semibold">{orden.numero}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo de Trabajo</p>
                <p className="font-semibold">{orden.tipoTrabajo}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado</p>
                <Badge variant={getEstadoBadgeVariant(orden.estado)} className="mt-1">
                  {orden.estado}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prioridad</p>
                <Badge variant={getPrioridadBadgeVariant(orden.prioridad)} className="mt-1">
                  {orden.prioridad}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Descripción</p>
              <p className="mt-1 text-sm leading-relaxed">{orden.descripcion}</p>
            </div>
          </CardContent>
        </Card>

        {/* Equipo y Ubicación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Equipo y Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Equipo</p>
              <p className="font-semibold">{orden.equipoId}</p>
              <p className="text-sm text-muted-foreground">{orden.equipoNombre}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Ubicación
              </p>
              <p className="font-semibold">{orden.ubicacion}</p>
            </div>
          </CardContent>
        </Card>

        {/* Solicitante y Asignación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Solicitante y Asignación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Solicitante</p>
                <p className="font-semibold">{orden.solicitante}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Departamento</p>
                <p className="font-semibold">{orden.departamento}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Técnico Asignado</p>
              <p className="font-semibold">{orden.tecnicoAsignado || "Sin asignar"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Fechas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Fechas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha de Creación</p>
              <p className="font-semibold">{formatDate(orden.fechaCreacion)}</p>
            </div>

            {orden.fechaVencimiento && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha de Vencimiento</p>
                <p className="font-semibold">{formatDateShort(orden.fechaVencimiento)}</p>
              </div>
            )}

            {orden.fechaInicio && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha de Inicio</p>
                <p className="font-semibold">{formatDate(orden.fechaInicio)}</p>
              </div>
            )}

            {orden.fechaCompletado && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha de Completado</p>
                <p className="font-semibold">{formatDate(orden.fechaCompletado)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estimaciones y Costos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Estimaciones y Costos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tiempo Estimado</p>
                <p className="font-semibold">{orden.tiempoEstimado ? `${orden.tiempoEstimado}h` : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tiempo Real</p>
                <p className="font-semibold">{orden.tiempoReal ? `${orden.tiempoReal}h` : "N/A"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Costo Estimado</p>
                <p className="font-semibold">
                  {orden.costoEstimado ? `$${orden.costoEstimado.toLocaleString()}` : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Costo Real</p>
                <p className="font-semibold">{orden.costoReal ? `$${orden.costoReal.toLocaleString()}` : "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validación */}
        {(orden.validadoPor || orden.fechaValidacion) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Validación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orden.validadoPor && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Validado por</p>
                  <p className="font-semibold">{orden.validadoPor}</p>
                </div>
              )}

              {orden.fechaValidacion && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha de Validación</p>
                  <p className="font-semibold">{formatDate(orden.fechaValidacion)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Materiales Requeridos */}
      {orden.materialesRequeridos && orden.materialesRequeridos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Materiales Requeridos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {orden.materialesRequeridos.map((material, index) => (
                <Badge key={index} variant="outline" className="justify-start">
                  {material}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Herramientas Requeridas */}
      {orden.herramientasRequeridas && orden.herramientasRequeridas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Herramientas Requeridas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {orden.herramientasRequeridas.map((herramienta, index) => (
                <Badge key={index} variant="outline" className="justify-start">
                  {herramienta}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Procedimientos */}
      {orden.procedimientos && orden.procedimientos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Procedimientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {orden.procedimientos.map((procedimiento, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm">{procedimiento}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Solución */}
      {orden.solucion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Solución Implementada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{orden.solucion}</p>
          </CardContent>
        </Card>
      )}

      {/* Observaciones */}
      {orden.observaciones && (
        <Card>
          <CardHeader>
            <CardTitle>Observaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{orden.observaciones}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
