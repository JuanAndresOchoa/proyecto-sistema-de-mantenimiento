"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Save, ArrowLeft } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import type { OrdenTrabajo } from "@/contexts/app-context"

interface OrdenTrabajoFormProps {
  orden?: OrdenTrabajo | null
  onSave: (ordenData: any) => void
  onCancel: () => void
}

export function OrdenTrabajoForm({ orden, onSave, onCancel }: OrdenTrabajoFormProps) {
  const { equipos, areasEmpresa, crearOrdenTrabajo, actualizarOrdenTrabajo, generarNumeroOrden } = useApp()

  const [formData, setFormData] = useState({
    numero: "",
    titulo: "",
    descripcion: "",
    equipoId: "",
    tipoTrabajo: "",
    prioridad: "Media",
    solicitante: "",
    departamento: "",
    area: "",
    ubicacion: "",
    fechaVencimiento: "",
    tiempoEstimado: "",
    costoEstimado: "",
    materialesRequeridos: [] as string[],
    herramientasRequeridas: [] as string[],
    procedimientos: [] as string[],
    observaciones: "",
  })

  const [newMaterial, setNewMaterial] = useState("")
  const [newHerramienta, setNewHerramienta] = useState("")
  const [newProcedimiento, setNewProcedimiento] = useState("")

  useEffect(() => {
    if (orden) {
      setFormData({
        numero: orden.numero || "",
        titulo: orden.titulo || "",
        descripcion: orden.descripcion || "",
        equipoId: orden.equipoId || "",
        tipoTrabajo: orden.tipoTrabajo || "",
        prioridad: orden.prioridad || "Media",
        solicitante: orden.solicitante || "",
        departamento: orden.departamento || "",
        area: orden.area || "",
        ubicacion: orden.ubicacion || "",
        fechaVencimiento: orden.fechaVencimiento ? orden.fechaVencimiento.split("T")[0] : "",
        tiempoEstimado: orden.tiempoEstimado?.toString() || "",
        costoEstimado: orden.costoEstimado?.toString() || "",
        materialesRequeridos: orden.materialesRequeridos || [],
        herramientasRequeridas: orden.herramientasRequeridas || [],
        procedimientos: orden.procedimientos || [],
        observaciones: orden.observaciones || "",
      })
    } else {
      setFormData((prev) => ({
        ...prev,
        numero: generarNumeroOrden(),
      }))
    }
  }, [orden, generarNumeroOrden])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleEquipoChange = (equipoId: string) => {
    const equipo = equipos.find((e) => e.id === equipoId)
    setFormData((prev) => ({
      ...prev,
      equipoId,
      ubicacion: equipo?.ubicacion || prev.ubicacion,
    }))
  }

  const addMaterial = () => {
    if (newMaterial.trim()) {
      setFormData((prev) => ({
        ...prev,
        materialesRequeridos: [...prev.materialesRequeridos, newMaterial.trim()],
      }))
      setNewMaterial("")
    }
  }

  const removeMaterial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      materialesRequeridos: prev.materialesRequeridos.filter((_, i) => i !== index),
    }))
  }

  const addHerramienta = () => {
    if (newHerramienta.trim()) {
      setFormData((prev) => ({
        ...prev,
        herramientasRequeridas: [...prev.herramientasRequeridas, newHerramienta.trim()],
      }))
      setNewHerramienta("")
    }
  }

  const removeHerramienta = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      herramientasRequeridas: prev.herramientasRequeridas.filter((_, i) => i !== index),
    }))
  }

  const addProcedimiento = () => {
    if (newProcedimiento.trim()) {
      setFormData((prev) => ({
        ...prev,
        procedimientos: [...prev.procedimientos, newProcedimiento.trim()],
      }))
      setNewProcedimiento("")
    }
  }

  const removeProcedimiento = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      procedimientos: prev.procedimientos.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const equipoSeleccionado = equipos.find((e) => e.id === formData.equipoId)

    const ordenData = {
      ...formData,
      equipoNombre: equipoSeleccionado?.nombre || "",
      fechaVencimiento: formData.fechaVencimiento ? new Date(formData.fechaVencimiento).toISOString() : undefined,
      tiempoEstimado: formData.tiempoEstimado ? Number.parseFloat(formData.tiempoEstimado) : undefined,
      costoEstimado: formData.costoEstimado ? Number.parseFloat(formData.costoEstimado) : undefined,
    }

    if (orden) {
      actualizarOrdenTrabajo(orden.id, ordenData)
    } else {
      crearOrdenTrabajo(ordenData)
    }

    onSave(ordenData)
  }

  const isFormValid =
    formData.titulo &&
    formData.descripcion &&
    formData.equipoId &&
    formData.tipoTrabajo &&
    formData.solicitante &&
    formData.departamento &&
    formData.area

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ArrowLeft className="h-6 w-6 text-primary cursor-pointer" onClick={onCancel} />
            {orden ? "Editar Orden de Trabajo" : "Nueva Orden de Trabajo"}
          </h2>
          <p className="text-muted-foreground">
            {orden ? `Editando orden ${orden.numero}` : "Completa la información para crear una nueva orden"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            <Save className="h-4 w-4 mr-2" />
            {orden ? "Actualizar" : "Crear Orden"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <CardDescription>Datos básicos de la orden de trabajo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero">Número de Orden</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => handleInputChange("numero", e.target.value)}
                  placeholder="Ej: 2024-001"
                />
                <p className="text-xs text-muted-foreground">Deja en blanco para generar automáticamente</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange("titulo", e.target.value)}
                  placeholder="Título descriptivo de la orden"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoTrabajo">Tipo de Trabajo *</Label>
                <Select value={formData.tipoTrabajo} onValueChange={(value) => handleInputChange("tipoTrabajo", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mantenimiento Preventivo">Mantenimiento Preventivo</SelectItem>
                    <SelectItem value="Mantenimiento Correctivo">Mantenimiento Correctivo</SelectItem>
                    <SelectItem value="Reparación">Reparación</SelectItem>
                    <SelectItem value="Instalación">Instalación</SelectItem>
                    <SelectItem value="Inspección">Inspección</SelectItem>
                    <SelectItem value="Modificación">Modificación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
                placeholder="Descripción detallada del trabajo a realizar"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prioridad">Prioridad</Label>
                <Select value={formData.prioridad} onValueChange={(value) => handleInputChange("prioridad", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baja">Baja</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Crítica">Crítica</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaVencimiento">Fecha de Vencimiento</Label>
                <Input
                  id="fechaVencimiento"
                  type="date"
                  value={formData.fechaVencimiento}
                  onChange={(e) => handleInputChange("fechaVencimiento", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipo y Ubicación */}
        <Card>
          <CardHeader>
            <CardTitle>Equipo y Ubicación</CardTitle>
            <CardDescription>Información del equipo y ubicación del trabajo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="equipoId">Equipo *</Label>
                <Select value={formData.equipoId} onValueChange={handleEquipoChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipos.map((equipo) => (
                      <SelectItem key={equipo.id} value={equipo.id}>
                        {equipo.id} - {equipo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ubicacion">Ubicación *</Label>
                <Input
                  id="ubicacion"
                  value={formData.ubicacion}
                  onChange={(e) => handleInputChange("ubicacion", e.target.value)}
                  placeholder="Ubicación específica del trabajo"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solicitante y Departamento */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Solicitante</CardTitle>
            <CardDescription>Datos de quien solicita el trabajo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="solicitante">Solicitante *</Label>
                <Input
                  id="solicitante"
                  value={formData.solicitante}
                  onChange={(e) => handleInputChange("solicitante", e.target.value)}
                  placeholder="Nombre del solicitante"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento *</Label>
                <Select
                  value={formData.departamento}
                  onValueChange={(value) => handleInputChange("departamento", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Producción">Producción</SelectItem>
                    <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="Calidad">Calidad</SelectItem>
                    <SelectItem value="Ingeniería">Ingeniería</SelectItem>
                    <SelectItem value="Seguridad">Seguridad</SelectItem>
                    <SelectItem value="Administración">Administración</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Área *</Label>
                <Select value={formData.area} onValueChange={(value) => handleInputChange("area", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar área" />
                  </SelectTrigger>
                  <SelectContent>
                    {areasEmpresa
                      .filter((area) => area.activa)
                      .map((area) => (
                        <SelectItem key={area.id} value={area.nombre}>
                          {area.nombre}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estimaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Estimaciones</CardTitle>
            <CardDescription>Tiempo y costo estimado del trabajo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tiempoEstimado">Tiempo Estimado (horas)</Label>
                <Input
                  id="tiempoEstimado"
                  type="number"
                  step="0.5"
                  value={formData.tiempoEstimado}
                  onChange={(e) => handleInputChange("tiempoEstimado", e.target.value)}
                  placeholder="Ej: 4.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costoEstimado">Costo Estimado</Label>
                <Input
                  id="costoEstimado"
                  type="number"
                  step="0.01"
                  value={formData.costoEstimado}
                  onChange={(e) => handleInputChange("costoEstimado", e.target.value)}
                  placeholder="Ej: 250.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Materiales Requeridos */}
        <Card>
          <CardHeader>
            <CardTitle>Materiales Requeridos</CardTitle>
            <CardDescription>Lista de materiales necesarios para el trabajo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                placeholder="Agregar material..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMaterial())}
              />
              <Button type="button" onClick={addMaterial} disabled={!newMaterial.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.materialesRequeridos.map((material, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {material}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeMaterial(index)} />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Herramientas Requeridas */}
        <Card>
          <CardHeader>
            <CardTitle>Herramientas Requeridas</CardTitle>
            <CardDescription>Lista de herramientas necesarias para el trabajo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newHerramienta}
                onChange={(e) => setNewHerramienta(e.target.value)}
                placeholder="Agregar herramienta..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHerramienta())}
              />
              <Button type="button" onClick={addHerramienta} disabled={!newHerramienta.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.herramientasRequeridas.map((herramienta, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {herramienta}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeHerramienta(index)} />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Procedimientos */}
        <Card>
          <CardHeader>
            <CardTitle>Procedimientos</CardTitle>
            <CardDescription>Pasos o procedimientos a seguir</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newProcedimiento}
                onChange={(e) => setNewProcedimiento(e.target.value)}
                placeholder="Agregar procedimiento..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addProcedimiento())}
              />
              <Button type="button" onClick={addProcedimiento} disabled={!newProcedimiento.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.procedimientos.map((procedimiento, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="flex-1">
                    {index + 1}. {procedimiento}
                  </span>
                  <X
                    className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => removeProcedimiento(index)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Observaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Observaciones</CardTitle>
            <CardDescription>Información adicional o comentarios</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.observaciones}
              onChange={(e) => handleInputChange("observaciones", e.target.value)}
              placeholder="Observaciones adicionales..."
              rows={3}
            />
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
