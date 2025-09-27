"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useApp, type CostoMantenimiento } from "@/contexts/app-context"
import { DollarSign, Plus, Edit, Trash2, Receipt } from "lucide-react"

export function CostosDashboard() {
  const {
    costos,
    mantenimientos,
    agregarCosto,
    actualizarCosto,
    eliminarCosto,
    obtenerCostosTotales,
    obtenerCostosPorCategoria,
  } = useApp()

  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [costoEditando, setCostoEditando] = useState<CostoMantenimiento | null>(null)
  const [formData, setFormData] = useState({
    mantenimientoId: "",
    concepto: "",
    categoria: "Repuestos" as CostoMantenimiento["categoria"],
    costo: "",
    fecha: new Date().toISOString().split("T")[0],
    proveedor: "",
    observaciones: "",
  })

  const costosTotales = obtenerCostosTotales()
  const costosPorCategoria = obtenerCostosPorCategoria()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const costoData = {
      mantenimientoId: formData.mantenimientoId,
      concepto: formData.concepto,
      categoria: formData.categoria,
      costo: Number.parseFloat(formData.costo),
      fecha: formData.fecha,
      proveedor: formData.proveedor || undefined,
      observaciones: formData.observaciones || undefined,
    }

    if (costoEditando) {
      actualizarCosto(costoEditando.id, costoData)
    } else {
      agregarCosto(costoData)
    }

    // Resetear formulario
    setFormData({
      mantenimientoId: "",
      concepto: "",
      categoria: "Repuestos",
      costo: "",
      fecha: new Date().toISOString().split("T")[0],
      proveedor: "",
      observaciones: "",
    })
    setCostoEditando(null)
    setDialogoAbierto(false)
  }

  const handleEditar = (costo: CostoMantenimiento) => {
    setCostoEditando(costo)
    setFormData({
      mantenimientoId: costo.mantenimientoId,
      concepto: costo.concepto,
      categoria: costo.categoria,
      costo: costo.costo.toString(),
      fecha: costo.fecha,
      proveedor: costo.proveedor || "",
      observaciones: costo.observaciones || "",
    })
    setDialogoAbierto(true)
  }

  const handleEliminar = (costoId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este costo?")) {
      eliminarCosto(costoId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            Gestión de Costos
          </h2>
          <p className="text-muted-foreground">Administra los costos de mantenimiento por categoría</p>
        </div>
        <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Costo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{costoEditando ? "Editar Costo" : "Agregar Nuevo Costo"}</DialogTitle>
              <DialogDescription>
                {costoEditando
                  ? "Modifica los datos del costo"
                  : "Ingresa los detalles del nuevo costo de mantenimiento"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="mantenimiento">Mantenimiento</Label>
                <Select
                  value={formData.mantenimientoId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, mantenimientoId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar mantenimiento" />
                  </SelectTrigger>
                  <SelectContent>
                    {mantenimientos.map((mnt) => (
                      <SelectItem key={mnt.id} value={mnt.id}>
                        {mnt.equipoNombre} - {mnt.tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="concepto">Concepto</Label>
                <Input
                  id="concepto"
                  value={formData.concepto}
                  onChange={(e) => setFormData((prev) => ({ ...prev, concepto: e.target.value }))}
                  placeholder="Ej: Aceite lubricante, Mano de obra..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="categoria">Categoría</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, categoria: value as CostoMantenimiento["categoria"] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mano de Obra">Mano de Obra</SelectItem>
                    <SelectItem value="Repuestos">Repuestos</SelectItem>
                    <SelectItem value="Herramientas">Herramientas</SelectItem>
                    <SelectItem value="Servicios Externos">Servicios Externos</SelectItem>
                    <SelectItem value="Otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="costo">Costo ($)</Label>
                  <Input
                    id="costo"
                    type="number"
                    step="0.01"
                    value={formData.costo}
                    onChange={(e) => setFormData((prev) => ({ ...prev, costo: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fecha: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="proveedor">Proveedor (Opcional)</Label>
                <Input
                  id="proveedor"
                  value={formData.proveedor}
                  onChange={(e) => setFormData((prev) => ({ ...prev, proveedor: e.target.value }))}
                  placeholder="Nombre del proveedor"
                />
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => setFormData((prev) => ({ ...prev, observaciones: e.target.value }))}
                  placeholder="Detalles adicionales..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {costoEditando ? "Actualizar" : "Agregar"} Costo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogoAbierto(false)
                    setCostoEditando(null)
                    setFormData({
                      mantenimientoId: "",
                      concepto: "",
                      categoria: "Repuestos",
                      costo: "",
                      fecha: new Date().toISOString().split("T")[0],
                      proveedor: "",
                      observaciones: "",
                    })
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumen de Costos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${costosTotales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Todos los mantenimientos</p>
          </CardContent>
        </Card>

        {Object.entries(costosPorCategoria)
          .slice(0, 3)
          .map(([categoria, total]) => (
            <Card key={categoria}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{categoria}</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">${total.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{((total / costosTotales) * 100).toFixed(1)}% del total</p>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Tabla de Costos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Registro de Costos
          </CardTitle>
          <CardDescription>Historial completo de todos los costos de mantenimiento</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Mantenimiento</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead className="text-right">Costo</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costos.map((costo) => {
                const mantenimiento = mantenimientos.find((m) => m.id === costo.mantenimientoId)
                return (
                  <TableRow key={costo.id}>
                    <TableCell>{new Date(costo.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{mantenimiento?.equipoNombre}</div>
                        <div className="text-sm text-muted-foreground">{mantenimiento?.tipo}</div>
                      </div>
                    </TableCell>
                    <TableCell>{costo.concepto}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{costo.categoria}</Badge>
                    </TableCell>
                    <TableCell>{costo.proveedor || "-"}</TableCell>
                    <TableCell className="text-right font-medium">${costo.costo.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditar(costo)} className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEliminar(costo.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
