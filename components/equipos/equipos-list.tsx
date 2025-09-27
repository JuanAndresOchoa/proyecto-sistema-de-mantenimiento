"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Eye, Trash2, Zap } from "lucide-react"
import { EquipoForm } from "./equipo-form"
import { DialogCustom } from "@/components/ui/dialog-custom"

interface Equipo {
  id: string
  codigo: string
  nombre: string
  tipo: string
  marca: string
  modelo: string
  ubicacion: string
  estado: "Operativo" | "Mantenimiento" | "Fuera de Servicio"
  criticidad: "Alta" | "Media" | "Baja"
  fechaInstalacion: string
  potencia: string
  voltaje: string
}

export function EquiposList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipo, setFilterTipo] = useState("todos")
  const [filterEstado, setFilterEstado] = useState("todos")
  const [showForm, setShowForm] = useState(false)
  const [editingEquipo, setEditingEquipo] = useState<Equipo | null>(null)
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; equipo: Equipo | null }>({
    isOpen: false,
    equipo: null,
  })
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; equipo: Equipo | null }>({
    isOpen: false,
    equipo: null,
  })

  const [equipos, setEquipos] = useState<Equipo[]>([
    {
      id: "1",
      codigo: "MOT-001",
      nombre: "Motor Principal Línea A",
      tipo: "Motor",
      marca: "Siemens",
      modelo: "IE3-1500",
      ubicacion: "Planta Principal - Sector A",
      estado: "Operativo",
      criticidad: "Alta",
      fechaInstalacion: "2020-03-15",
      potencia: "15 HP",
      voltaje: "440V",
    },
    {
      id: "2",
      codigo: "BOM-001",
      nombre: "Bomba Centrífuga Agua",
      tipo: "Bomba",
      marca: "Grundfos",
      modelo: "CR-45",
      ubicacion: "Sala de Bombas",
      estado: "Operativo",
      criticidad: "Alta",
      fechaInstalacion: "2019-08-22",
      potencia: "5 HP",
      voltaje: "220V",
    },
    {
      id: "3",
      codigo: "MOT-002",
      nombre: "Motor Ventilador Extracción",
      tipo: "Motor",
      marca: "WEG",
      modelo: "W22-1800",
      ubicacion: "Área de Ventilación",
      estado: "Operativo",
      criticidad: "Media",
      fechaInstalacion: "2021-01-10",
      potencia: "3 HP",
      voltaje: "220V",
    },
    {
      id: "4",
      codigo: "TRA-001",
      nombre: "Transformador Principal",
      tipo: "Transformador",
      marca: "ABB",
      modelo: "ONAN-500",
      ubicacion: "Subestación Eléctrica",
      estado: "Operativo",
      criticidad: "Alta",
      fechaInstalacion: "2018-05-30",
      potencia: "500 KVA",
      voltaje: "13.8KV/440V",
    },
    {
      id: "5",
      codigo: "BOM-002",
      nombre: "Bomba Aceite Hidráulico",
      tipo: "Bomba",
      marca: "Rexroth",
      modelo: "A10V-28",
      ubicacion: "Taller Mecánico",
      estado: "Mantenimiento",
      criticidad: "Media",
      fechaInstalacion: "2020-11-18",
      potencia: "2 HP",
      voltaje: "220V",
    },
  ])

  const handleSaveEquipo = (equipoData: Omit<Equipo, "id">) => {
    if (editingEquipo) {
      setEquipos((prev) =>
        prev.map((eq) => (eq.id === editingEquipo.id ? { ...equipoData, id: editingEquipo.id } : eq)),
      )
    } else {
      const newEquipo: Equipo = {
        ...equipoData,
        id: (equipos.length + 1).toString(),
      }
      setEquipos((prev) => [...prev, newEquipo])
    }
    setShowForm(false)
    setEditingEquipo(null)
  }

  const handleEditEquipo = (equipo: Equipo) => {
    setEditingEquipo(equipo)
    setShowForm(true)
  }

  const handleDeleteEquipo = (equipoId: string) => {
    setEquipos((prev) => prev.filter((eq) => eq.id !== equipoId))
    setDeleteModal({ isOpen: false, equipo: null })
  }

  const handleViewEquipo = (equipo: Equipo) => {
    setViewModal({ isOpen: true, equipo })
  }

  const handleDeleteClick = (equipo: Equipo) => {
    setDeleteModal({ isOpen: true, equipo })
  }

  const filteredEquipos = equipos.filter((equipo) => {
    const matchesSearch =
      equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = filterTipo === "todos" || equipo.tipo === filterTipo
    const matchesEstado = filterEstado === "todos" || equipo.estado === filterEstado

    return matchesSearch && matchesTipo && matchesEstado
  })

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Operativo":
        return "default"
      case "Mantenimiento":
        return "secondary"
      case "Fuera de Servicio":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getCriticidadBadgeVariant = (criticidad: string) => {
    switch (criticidad) {
      case "Alta":
        return "destructive"
      case "Media":
        return "secondary"
      case "Baja":
        return "outline"
      default:
        return "outline"
    }
  }

  if (showForm) {
    return (
      <EquipoForm
        equipo={editingEquipo}
        onSave={handleSaveEquipo}
        onCancel={() => {
          setShowForm(false)
          setEditingEquipo(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Gestión de Equipos
          </h2>
          <p className="text-muted-foreground">Administra todos los equipos eléctricos de la planta</p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Nuevo Equipo
        </Button>
      </div>

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
                  placeholder="Buscar por nombre, código o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo de equipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="Motor">Motor</SelectItem>
                <SelectItem value="Bomba">Bomba</SelectItem>
                <SelectItem value="Transformador">Transformador</SelectItem>
                <SelectItem value="Compresor">Compresor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="Operativo">Operativo</SelectItem>
                <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                <SelectItem value="Fuera de Servicio">Fuera de Servicio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equipos Registrados</CardTitle>
          <CardDescription>
            Mostrando {filteredEquipos.length} de {equipos.length} equipos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Criticidad</TableHead>
                <TableHead>Especificaciones</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipos.map((equipo) => (
                <TableRow key={equipo.id}>
                  <TableCell className="font-medium">{equipo.codigo}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{equipo.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        {equipo.marca} {equipo.modelo}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{equipo.tipo}</TableCell>
                  <TableCell className="max-w-48">
                    <p className="truncate">{equipo.ubicacion}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getEstadoBadgeVariant(equipo.estado)}>{equipo.estado}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getCriticidadBadgeVariant(equipo.criticidad)}>{equipo.criticidad}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{equipo.potencia}</p>
                      <p className="text-muted-foreground">{equipo.voltaje}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewEquipo(equipo)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditEquipo(equipo)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(equipo)}
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

      <DialogCustom
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, equipo: null })}
        title={`Detalles del Equipo ${viewModal.equipo?.codigo}`}
        actions={<Button onClick={() => setViewModal({ isOpen: false, equipo: null })}>Cerrar</Button>}
      >
        {viewModal.equipo && (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre</p>
              <p className="text-base">{viewModal.equipo.nombre}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo</p>
              <p className="text-base">{viewModal.equipo.tipo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Marca y Modelo</p>
              <p className="text-base">
                {viewModal.equipo.marca} {viewModal.equipo.modelo}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ubicación</p>
              <p className="text-base">{viewModal.equipo.ubicacion}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado</p>
                <Badge variant={getEstadoBadgeVariant(viewModal.equipo.estado)}>{viewModal.equipo.estado}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Criticidad</p>
                <Badge variant={getCriticidadBadgeVariant(viewModal.equipo.criticidad)}>
                  {viewModal.equipo.criticidad}
                </Badge>
              </div>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Potencia</p>
                <p className="text-base">{viewModal.equipo.potencia}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Voltaje</p>
                <p className="text-base">{viewModal.equipo.voltaje}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha de Instalación</p>
              <p className="text-base">{new Date(viewModal.equipo.fechaInstalacion).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </DialogCustom>

      <DialogCustom
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, equipo: null })}
        title="Confirmar Eliminación"
        actions={
          <>
            <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false, equipo: null })}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteModal.equipo && handleDeleteEquipo(deleteModal.equipo.id)}
            >
              Eliminar
            </Button>
          </>
        }
      >
        {deleteModal.equipo && (
          <div className="space-y-3">
            <p className="text-base">
              ¿Estás seguro de que quieres eliminar el equipo <strong>{deleteModal.equipo.codigo}</strong>?
            </p>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">{deleteModal.equipo.nombre}</p>
              <p className="text-sm text-muted-foreground">
                {deleteModal.equipo.marca} {deleteModal.equipo.modelo}
              </p>
              <p className="text-sm text-muted-foreground">{deleteModal.equipo.ubicacion}</p>
            </div>
            <p className="text-sm text-destructive">Esta acción no se puede deshacer.</p>
          </div>
        )}
      </DialogCustom>
    </div>
  )
}
