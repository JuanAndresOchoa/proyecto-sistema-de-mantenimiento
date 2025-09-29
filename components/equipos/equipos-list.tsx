"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Eye, Trash2, Zap } from "lucide-react"
import { EquipoForm } from "./equipo-form"
import { DialogCustom } from "@/components/ui/dialog-custom"
import { useApp } from "@/contexts/app-context"

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
  // Contexto (si existe)
  const app = useApp() as any
  const contextEquipos: Equipo[] = app?.equipos ?? []
  const crearEquipoContext = app?.crearEquipo
  const actualizarEquipoContext = app?.actualizarEquipo
  const eliminarEquipoContext = app?.eliminarEquipo

  // Filters / UI state
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

  // Estado local (fallback si context no provee)
  const [equipos, setEquipos] = useState<Equipo[]>([])

  // Cargar desde contexto al montar / cuando cambie
  useEffect(() => {
    if (Array.isArray(contextEquipos) && contextEquipos.length > 0) {
      // clonamos para evitar mutaciones directas
      setEquipos(contextEquipos.map((e) => ({ ...e })))
    } else {
      setEquipos([]) // arranque limpio si no hay equipos en contexto
    }
  }, [contextEquipos])

  // Generador de id seguro (prefiere secuencia numérica si existen)
  const generarIdEquipo = () => {
    const numericIds = equipos
      .map((t) => {
        const n = Number(t.id)
        return Number.isFinite(n) ? n : NaN
      })
      .filter((n) => Number.isFinite(n))
    if (numericIds.length > 0) {
      return (Math.max(...numericIds) + 1).toString()
    }
    return `eq_${Date.now()}`
  }

  // Guardar (crear o actualizar). Acepta que las funciones de contexto retornes entity o nothing.
  const handleSaveEquipo = async (equipoData: Omit<Equipo, "id">) => {
    try {
      if (editingEquipo) {
        // actualización
        if (typeof actualizarEquipoContext === "function") {
          const result = await Promise.resolve(actualizarEquipoContext(editingEquipo.id, equipoData))
          // Si el contexto devuelve el equipo actualizado con id, úsalo; si no, reconstruimos con id conocido.
          const actualizado: Equipo =
            result && result.id ? result : ({ ...equipoData, id: editingEquipo.id } as Equipo)

          // Si el contexto es la fuente de la verdad, la lista llegará por efecto; si no, actualizamos local.
          if (!Array.isArray(contextEquipos) || contextEquipos.length === 0) {
            setEquipos((prev) => prev.map((eq) => (eq.id === editingEquipo.id ? actualizado : eq)))
          }
        } else {
          // fallback local
          setEquipos((prev) => prev.map((eq) => (eq.id === editingEquipo.id ? ({ ...equipoData, id: editingEquipo.id } as Equipo) : eq)))
        }
      } else {
        // creación
        if (typeof crearEquipoContext === "function") {
          const result = await Promise.resolve(crearEquipoContext(equipoData))
          if (result && result.id) {
            // si contexto retorna la entidad creada, todo bien (la lista puede venir por contexto)
            if (!Array.isArray(contextEquipos) || contextEquipos.length === 0) {
              setEquipos((prev) => [...prev, result])
            }
          } else {
            // contexto no retornó id -> generamos localmente
            const newEquipo: Equipo = { ...equipoData, id: generarIdEquipo() }
            setEquipos((prev) => [...prev, newEquipo])
          }
        } else {
          // fallback local
          const newEquipo: Equipo = { ...equipoData, id: generarIdEquipo() }
          setEquipos((prev) => [...prev, newEquipo])
        }
      }
    } catch (err) {
      console.error("Error guardando equipo:", err)
    } finally {
      setShowForm(false)
      setEditingEquipo(null)
    }
  }

  const handleEditEquipo = (equipo: Equipo) => {
    setEditingEquipo(equipo)
    setShowForm(true)
  }

  const handleDeleteEquipo = async (equipoId: string) => {
    try {
      if (typeof eliminarEquipoContext === "function") {
        await Promise.resolve(eliminarEquipoContext(equipoId))
        // si el contexto administra la lista, el efecto de contextEquipos la actualizará
        if (!Array.isArray(contextEquipos) || contextEquipos.length === 0) {
          setEquipos((prev) => prev.filter((eq) => eq.id !== equipoId))
        }
      } else {
        setEquipos((prev) => prev.filter((eq) => eq.id !== equipoId))
      }
    } catch (err) {
      console.error("Error eliminando equipo:", err)
    } finally {
      setDeleteModal({ isOpen: false, equipo: null })
    }
  }

  const handleViewEquipo = (equipo: Equipo) => {
    setViewModal({ isOpen: true, equipo })
  }

  const handleDeleteClick = (equipo: Equipo) => {
    setDeleteModal({ isOpen: true, equipo })
  }

  const filteredEquipos = equipos.filter((equipo) => {
    const q = searchTerm.trim().toLowerCase()
    const matchesSearch =
      q === "" ||
      equipo.nombre.toLowerCase().includes(q) ||
      equipo.codigo.toLowerCase().includes(q) ||
      equipo.ubicacion.toLowerCase().includes(q)
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
              <p className="text-base">
                {viewModal.equipo.fechaInstalacion ? new Date(viewModal.equipo.fechaInstalacion).toLocaleDateString() : "—"}
              </p>
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
            <Button variant="destructive" onClick={() => deleteModal.equipo && handleDeleteEquipo(deleteModal.equipo.id)}>
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
