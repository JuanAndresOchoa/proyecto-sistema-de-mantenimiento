"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save, X } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface EquipoFormProps {
  onCancel: () => void
  onSave: (equipo: any) => void
  equipo?: any // Para edición
}

export function EquipoForm({ onCancel, onSave, equipo }: EquipoFormProps) {
  const [formData, setFormData] = useState({
    codigo: equipo?.codigo || "",
    nombre: equipo?.nombre || "",
    tipo: equipo?.tipo || "",
    marca: equipo?.marca || "",
    modelo: equipo?.modelo || "",
    numeroSerie: equipo?.numeroSerie || "",
    ubicacion: equipo?.ubicacion || "",
    fechaInstalacion: equipo?.fechaInstalacion ? new Date(equipo.fechaInstalacion) : undefined,
    potencia: equipo?.potencia || "",
    voltaje: equipo?.voltaje || "",
    amperaje: equipo?.amperaje || "",
    estado: equipo?.estado || "Operativo",
    criticidad: equipo?.criticidad || "Media",
    notas: equipo?.notas || "",
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{equipo ? "Editar Equipo" : "Nuevo Equipo"}</CardTitle>
        <CardDescription>
          {equipo ? "Modifica los datos del equipo" : "Registra un nuevo equipo en el sistema"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código del Equipo *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleInputChange("codigo", e.target.value)}
                placeholder="ej: MOT-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Equipo *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="ej: Motor Principal Línea A"
                required
              />
            </div>
          </div>

          {/* Tipo y Clasificación */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Equipo *</Label>
              <Select value={formData.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Motor">Motor</SelectItem>
                  <SelectItem value="Bomba">Bomba</SelectItem>
                  <SelectItem value="Transformador">Transformador</SelectItem>
                  <SelectItem value="Compresor">Compresor</SelectItem>
                  <SelectItem value="Generador">Generador</SelectItem>
                  <SelectItem value="Ventilador">Ventilador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operativo">Operativo</SelectItem>
                  <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="Fuera de Servicio">Fuera de Servicio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="criticidad">Criticidad *</Label>
              <Select value={formData.criticidad} onValueChange={(value) => handleInputChange("criticidad", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar criticidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Información del Fabricante */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                value={formData.marca}
                onChange={(e) => handleInputChange("marca", e.target.value)}
                placeholder="ej: Siemens"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                value={formData.modelo}
                onChange={(e) => handleInputChange("modelo", e.target.value)}
                placeholder="ej: IE3-1500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroSerie">Número de Serie</Label>
              <Input
                id="numeroSerie"
                value={formData.numeroSerie}
                onChange={(e) => handleInputChange("numeroSerie", e.target.value)}
                placeholder="ej: SN123456789"
              />
            </div>
          </div>

          {/* Ubicación y Fecha */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ubicacion">Ubicación *</Label>
              <Input
                id="ubicacion"
                value={formData.ubicacion}
                onChange={(e) => handleInputChange("ubicacion", e.target.value)}
                placeholder="ej: Planta Principal - Sector A"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha de Instalación</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.fechaInstalacion ? (
                      format(formData.fechaInstalacion, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.fechaInstalacion}
                    onSelect={(date) => handleInputChange("fechaInstalacion", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Especificaciones Técnicas */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="potencia">Potencia</Label>
              <Input
                id="potencia"
                value={formData.potencia}
                onChange={(e) => handleInputChange("potencia", e.target.value)}
                placeholder="ej: 15 HP"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voltaje">Voltaje</Label>
              <Input
                id="voltaje"
                value={formData.voltaje}
                onChange={(e) => handleInputChange("voltaje", e.target.value)}
                placeholder="ej: 440V"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amperaje">Amperaje</Label>
              <Input
                id="amperaje"
                value={formData.amperaje}
                onChange={(e) => handleInputChange("amperaje", e.target.value)}
                placeholder="ej: 25A"
              />
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notas">Notas y Observaciones</Label>
            <Textarea
              id="notas"
              value={formData.notas}
              onChange={(e) => handleInputChange("notas", e.target.value)}
              placeholder="Información adicional sobre el equipo..."
              rows={3}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {equipo ? "Actualizar" : "Guardar"} Equipo
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
