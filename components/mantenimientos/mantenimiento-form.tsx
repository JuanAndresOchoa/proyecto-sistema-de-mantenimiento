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
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, X, Clock, Plus, Trash2, AlertTriangle, Calendar, Wrench } from "lucide-react"
import { useApp } from "@/contexts/app-context"

interface MantenimientoFormProps {
  mantenimiento?: any | null
  onSave: (mantenimientoData: any) => void
  onCancel: () => void
}

export function MantenimientoForm({ mantenimiento, onSave, onCancel }: MantenimientoFormProps) {
  const { equipos, areasEmpresa, crearMantenimiento, actualizarMantenimiento } = useApp()

  const [formData, setFormData] = useState({
    equipoId: "",
    equipoNombre: "",
    tipo: "Preventivo",
    descripcion: "",
    fechaProgramada: "",
    prioridad: "Media",
    tecnico: "",
    area: "",
    costo: "",
    duracionEstimada: "",
    frecuencia: "",
    proximoMantenimiento: "",
    materialesRequeridos: [] as string[],
    herramientasRequeridas: [] as string[],
    procedimientos: [] as string[],
    observaciones: "",
    requiereParada: false,
    tiempoParada: "",
    // Campos para mantenimiento completado
    fechaInicio: "",
    fechaCompletado: "",
    tiempoReal: "",
    costoReal: "",
    trabajoRealizado: "",
    repuestosUtilizados: [] as string[],
    problemasEncontrados: "",
    solucionesAplicadas: "",
    recomendaciones: "",
  })

  const [newMaterial, setNewMaterial] = useState("")
  const [newHerramienta, setNewHerramienta] = useState("")
  const [newProcedimiento, setNewProcedimiento] = useState("")
  const [newRepuesto, setNewRepuesto] = useState("")

  useEffect(() => {
    if (mantenimiento) {
      setFormData({
        equipoId: mantenimiento.equipoId || "",
        equipoNombre: mantenimiento.equipoNombre || "",
        tipo: mantenimiento.tipo || "Preventivo",
        descripcion: mantenimiento.descripcion || "",
        fechaProgramada: mantenimiento.fechaProgramada ? mantenimiento.fechaProgramada.split("T")[0] : "",
        prioridad: mantenimiento.prioridad || "Media",
        tecnico: mantenimiento.tecnico || "",
        area: mantenimiento.area || "",
        costo: mantenimiento.costo?.toString() || "",
        duracionEstimada: mantenimiento.duracionEstimada?.toString() || "",
        frecuencia: mantenimiento.frecuencia || "",
        proximoMantenimiento: mantenimiento.proximoMantenimiento
          ? mantenimiento.proximoMantenimiento.split("T")[0]
          : "",
        materialesRequeridos: mantenimiento.materialesRequeridos || [],
        herramientasRequeridas: mantenimiento.herramientasRequeridas || [],
        procedimientos: mantenimiento.procedimientos || [],
        observaciones: mantenimiento.observaciones || "",
        requiereParada: mantenimiento.requiereParada || false,
        tiempoParada: mantenimiento.tiempoParada?.toString() || "",
        fechaInicio: mantenimiento.fechaInicio ? mantenimiento.fechaInicio.split("T")[0] : "",
        fechaCompletado: mantenimiento.fechaCompletado ? mantenimiento.fechaCompletado.split("T")[0] : "",
        tiempoReal: mantenimiento.tiempoReal?.toString() || "",
        costoReal: mantenimiento.costoReal?.toString() || "",
        trabajoRealizado: mantenimiento.trabajoRealizado || "",
        repuestosUtilizados: mantenimiento.repuestosUtilizados || [],
        problemasEncontrados: mantenimiento.problemasEncontrados || "",
        solucionesAplicadas: mantenimiento.solucionesAplicadas || "",
        recomendaciones: mantenimiento.recomendaciones || "",
      })
    }
  }, [mantenimiento])

  const tecnicos = ["Juan Pérez", "María García", "Carlos López", "Ana Rodríguez", "Luis Martín", "Carmen Silva"]

  const tiposMantenimiento = [
    "Preventivo",
    "Correctivo",
    "Predictivo",
    "Lubricación",
    "Inspección",
    "Calibración",
    "Limpieza",
    "Modificación",
  ]

  const frecuenciasMantenimiento = [
    "Diario",
    "Semanal",
    "Quincenal",
    "Mensual",
    "Bimestral",
    "Trimestral",
    "Semestral",
    "Anual",
    "Según condición",
    "Una vez",
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleEquipoChange = (equipoId: string) => {
    const equipo = equipos.find((e) => e.id === equipoId)
    setFormData((prev) => ({
      ...prev,
      equipoId,
      equipoNombre: equipo?.nombre || "",
      area: equipo?.area || prev.area,
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

  const addRepuesto = () => {
    if (newRepuesto.trim()) {
      setFormData((prev) => ({
        ...prev,
        repuestosUtilizados: [...prev.repuestosUtilizados, newRepuesto.trim()],
      }))
      setNewRepuesto("")
    }
  }

  const removeRepuesto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      repuestosUtilizados: prev.repuestosUtilizados.filter((_, i) => i !== index),
    }))
  }

  const calcularProximoMantenimiento = () => {
    if (formData.fechaProgramada && formData.frecuencia) {
      const fecha = new Date(formData.fechaProgramada)
      let proximaFecha = new Date(fecha)

      switch (formData.frecuencia) {
        case "Diario":
          proximaFecha.setDate(fecha.getDate() + 1)
          break
        case "Semanal":
          proximaFecha.setDate(fecha.getDate() + 7)
          break
        case "Quincenal":
          proximaFecha.setDate(fecha.getDate() + 15)
          break
        case "Mensual":
          proximaFecha.setMonth(fecha.getMonth() + 1)
          break
        case "Bimestral":
          proximaFecha.setMonth(fecha.getMonth() + 2)
          break
        case "Trimestral":
          proximaFecha.setMonth(fecha.getMonth() + 3)
          break
        case "Semestral":
          proximaFecha.setMonth(fecha.getMonth() + 6)
          break
        case "Anual":
          proximaFecha.setFullYear(fecha.getFullYear() + 1)
          break
        default:
          proximaFecha = fecha
      }

      setFormData((prev) => ({
        ...prev,
        proximoMantenimiento: proximaFecha.toISOString().split("T")[0],
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const mantenimientoData = {
      ...formData,
      fechaProgramada: formData.fechaProgramada ? new Date(formData.fechaProgramada).toISOString() : undefined,
      proximoMantenimiento: formData.proximoMantenimiento
        ? new Date(formData.proximoMantenimiento).toISOString()
        : undefined,
      fechaInicio: formData.fechaInicio ? new Date(formData.fechaInicio).toISOString() : undefined,
      fechaCompletado: formData.fechaCompletado ? new Date(formData.fechaCompletado).toISOString() : undefined,
      costo: formData.costo ? Number.parseFloat(formData.costo) : undefined,
      costoReal: formData.costoReal ? Number.parseFloat(formData.costoReal) : undefined,
      duracionEstimada: formData.duracionEstimada ? Number.parseFloat(formData.duracionEstimada) : undefined,
      tiempoReal: formData.tiempoReal ? Number.parseFloat(formData.tiempoReal) : undefined,
      tiempoParada: formData.tiempoParada ? Number.parseFloat(formData.tiempoParada) : undefined,
    }

    if (mantenimiento) {
      actualizarMantenimiento(mantenimiento.id, mantenimientoData)
    } else {
      crearMantenimiento(mantenimientoData)
    }

    onSave(mantenimientoData)
  }

  const isFormValid =
    formData.equipoId && formData.tipo && formData.descripcion && formData.fechaProgramada && formData.tecnico

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ArrowLeft className="h-6 w-6 text-primary cursor-pointer" onClick={onCancel} />
            {mantenimiento ? "Editar Mantenimiento" : "Nuevo Mantenimiento"}
          </h2>
          <p className="text-muted-foreground">
            {mantenimiento
              ? `Editando mantenimiento ${mantenimiento.id}`
              : "Programa un nuevo mantenimiento preventivo o correctivo"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            <Save className="h-4 w-4 mr-2" />
            {mantenimiento ? "Actualizar" : "Crear"} Mantenimiento
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Información General
            </CardTitle>
            <CardDescription>Datos básicos del mantenimiento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label htmlFor="tipo">Tipo de Mantenimiento *</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposMantenimiento.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción del Trabajo *</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
                placeholder="Describe detalladamente el trabajo de mantenimiento a realizar"
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Programación y Asignación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Programación y Asignación
            </CardTitle>
            <CardDescription>Fechas, técnico responsable y área</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaProgramada">Fecha Programada *</Label>
                <Input
                  id="fechaProgramada"
                  type="date"
                  value={formData.fechaProgramada}
                  onChange={(e) => handleInputChange("fechaProgramada", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tecnico">Técnico Responsable *</Label>
                <Select value={formData.tecnico} onValueChange={(value) => handleInputChange("tecnico", value)}>
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
              <div className="space-y-2">
                <Label htmlFor="area">Área</Label>
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duracionEstimada">Duración Estimada (horas)</Label>
                <Input
                  id="duracionEstimada"
                  type="number"
                  step="0.5"
                  value={formData.duracionEstimada}
                  onChange={(e) => handleInputChange("duracionEstimada", e.target.value)}
                  placeholder="Ej: 2.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costo">Costo Estimado</Label>
                <Input
                  id="costo"
                  type="number"
                  step="0.01"
                  value={formData.costo}
                  onChange={(e) => handleInputChange("costo", e.target.value)}
                  placeholder="Ej: 150.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frecuencia">Frecuencia</Label>
                <Select value={formData.frecuencia} onValueChange={(value) => handleInputChange("frecuencia", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    {frecuenciasMantenimiento.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="proximoMantenimiento">Próximo Mantenimiento</Label>
                <div className="flex gap-2">
                  <Input
                    id="proximoMantenimiento"
                    type="date"
                    value={formData.proximoMantenimiento}
                    onChange={(e) => handleInputChange("proximoMantenimiento", e.target.value)}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={calcularProximoMantenimiento}>
                    Auto
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiereParada"
                checked={formData.requiereParada}
                onCheckedChange={(checked) => handleInputChange("requiereParada", checked)}
              />
              <Label htmlFor="requiereParada" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Requiere parada de equipo
              </Label>
              {formData.requiereParada && (
                <Input
                  type="number"
                  step="0.5"
                  value={formData.tiempoParada}
                  onChange={(e) => handleInputChange("tiempoParada", e.target.value)}
                  placeholder="Tiempo de parada (horas)"
                  className="w-48"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Materiales y Herramientas */}
        <Card>
          <CardHeader>
            <CardTitle>Materiales y Herramientas</CardTitle>
            <CardDescription>Recursos necesarios para el mantenimiento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Materiales Requeridos */}
            <div className="space-y-3">
              <Label>Materiales Requeridos</Label>
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
            </div>

            {/* Herramientas Requeridas */}
            <div className="space-y-3">
              <Label>Herramientas Requeridas</Label>
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
            </div>
          </CardContent>
        </Card>

        {/* Procedimientos */}
        <Card>
          <CardHeader>
            <CardTitle>Procedimientos de Trabajo</CardTitle>
            <CardDescription>Pasos a seguir durante el mantenimiento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newProcedimiento}
                onChange={(e) => setNewProcedimiento(e.target.value)}
                placeholder="Agregar paso del procedimiento..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addProcedimiento())}
              />
              <Button type="button" onClick={addProcedimiento} disabled={!newProcedimiento.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.procedimientos.map((procedimiento, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded">
                  <span className="flex-1">
                    {index + 1}. {procedimiento}
                  </span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeProcedimiento(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Información de Ejecución (si está completado) */}
        {mantenimiento && mantenimiento.estado === "Completado" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Información de Ejecución
              </CardTitle>
              <CardDescription>Datos del trabajo realizado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) => handleInputChange("fechaInicio", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaCompletado">Fecha de Completado</Label>
                  <Input
                    id="fechaCompletado"
                    type="date"
                    value={formData.fechaCompletado}
                    onChange={(e) => handleInputChange("fechaCompletado", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiempoReal">Tiempo Real (horas)</Label>
                  <Input
                    id="tiempoReal"
                    type="number"
                    step="0.5"
                    value={formData.tiempoReal}
                    onChange={(e) => handleInputChange("tiempoReal", e.target.value)}
                    placeholder="Ej: 3.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costoReal">Costo Real</Label>
                  <Input
                    id="costoReal"
                    type="number"
                    step="0.01"
                    value={formData.costoReal}
                    onChange={(e) => handleInputChange("costoReal", e.target.value)}
                    placeholder="Ej: 175.50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trabajoRealizado">Trabajo Realizado</Label>
                <Textarea
                  id="trabajoRealizado"
                  value={formData.trabajoRealizado}
                  onChange={(e) => handleInputChange("trabajoRealizado", e.target.value)}
                  placeholder="Describe el trabajo que se realizó..."
                  rows={3}
                />
              </div>

              {/* Repuestos Utilizados */}
              <div className="space-y-3">
                <Label>Repuestos Utilizados</Label>
                <div className="flex gap-2">
                  <Input
                    value={newRepuesto}
                    onChange={(e) => setNewRepuesto(e.target.value)}
                    placeholder="Agregar repuesto utilizado..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRepuesto())}
                  />
                  <Button type="button" onClick={addRepuesto} disabled={!newRepuesto.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.repuestosUtilizados.map((repuesto, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {repuesto}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeRepuesto(index)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="problemasEncontrados">Problemas Encontrados</Label>
                  <Textarea
                    id="problemasEncontrados"
                    value={formData.problemasEncontrados}
                    onChange={(e) => handleInputChange("problemasEncontrados", e.target.value)}
                    placeholder="Describe los problemas encontrados durante el mantenimiento..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="solucionesAplicadas">Soluciones Aplicadas</Label>
                  <Textarea
                    id="solucionesAplicadas"
                    value={formData.solucionesAplicadas}
                    onChange={(e) => handleInputChange("solucionesAplicadas", e.target.value)}
                    placeholder="Describe las soluciones que se aplicaron..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recomendaciones">Recomendaciones</Label>
                <Textarea
                  id="recomendaciones"
                  value={formData.recomendaciones}
                  onChange={(e) => handleInputChange("recomendaciones", e.target.value)}
                  placeholder="Recomendaciones para futuros mantenimientos..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        )}

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
              placeholder="Observaciones adicionales, notas especiales, precauciones..."
              rows={3}
            />
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
