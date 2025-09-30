"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Plus, Edit, Trash2, Save, X, MapPin } from "lucide-react"
import { useApp } from "@/contexts/app-context"

/**
 * Tipos utilizados en el componente
 */
interface Tecnico {
  id: number | string
  nombre: string
  cargo: string
  especialidad?: string
  telefono?: string
  email?: string
  activo: boolean
}

interface Area {
  id: string
  nombre: string
  descripcion?: string
  responsable?: string
  activa: boolean
}

interface Empresa {
  nombre: string
  direccion: string
  telefono: string
  email: string
  ruc: string
}

interface AppContext {
  areasEmpresa?: Area[]
  crearAreaEmpresa?: (area: Partial<Area>) => Promise<any>
  actualizarAreaEmpresa?: (id: string, data: Partial<Area>) => Promise<any>
  eliminarAreaEmpresa?: (id: string) => Promise<any>

  tecnicos?: Tecnico[]
  crearTecnico?: (t: Tecnico) => Promise<any>
  actualizarTecnico?: (id: number | string, t: Tecnico) => Promise<any>
  eliminarTecnico?: (id: number | string) => Promise<any>

  empresa?: Partial<Empresa> | null
  actualizarEmpresa?: (e: Partial<Empresa>) => Promise<any>
}

export function ConfiguracionDashboard() {
  // Tipamos el contexto en vez de usar `any`
  const app = useApp() as AppContext

  // Fuente de verdad para áreas: directamente del contexto
  const areasEmpresa: Area[] = app?.areasEmpresa ?? []
  const crearAreaEmpresa = app?.crearAreaEmpresa
  const actualizarAreaEmpresa = app?.actualizarAreaEmpresa
  const eliminarAreaEmpresa = app?.eliminarAreaEmpresa

  // Técnicos (sincronizamos con contexto pero mantenemos estado local para la UI)
  const contextoTecnicos: Tecnico[] = app?.tecnicos ?? []
  const crearTecnicoContext = app?.crearTecnico
  const actualizarTecnicoContext = app?.actualizarTecnico
  const eliminarTecnicoContext = app?.eliminarTecnico

  // Empresa
  const empresaContext = app?.empresa ?? null
  const actualizarEmpresaContext = app?.actualizarEmpresa

  // Estado local (formularios / lista de técnicos para UI)
  const [empresa, setEmpresa] = useState<Empresa>({
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
    ruc: "",
  })

  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])

  const [editandoEmpresa, setEditandoEmpresa] = useState(false)
  const [mostrarFormTecnico, setMostrarFormTecnico] = useState(false)
  const [tecnicoEditando, setTecnicoEditando] = useState<Tecnico | null>(null)
  const [nuevoTecnico, setNuevoTecnico] = useState<Partial<Tecnico>>({
    nombre: "",
    cargo: "",
    especialidad: "",
    telefono: "",
    email: "",
    activo: true,
  })

  const [mostrarFormArea, setMostrarFormArea] = useState(false)
  const [areaEditando, setAreaEditando] = useState<Area | null>(null)
  const [nuevaArea, setNuevaArea] = useState<Partial<Area>>({
    nombre: "",
    descripcion: "",
    responsable: "",
    activa: true,
  })

  // Sincronizar empresa y técnicos con el contexto cuando cambien
  useEffect(() => {
    if (empresaContext) {
      setEmpresa({
        nombre: (empresaContext.nombre as string) || "",
        direccion: (empresaContext.direccion as string) || "",
        telefono: (empresaContext.telefono as string) || "",
        email: (empresaContext.email as string) || "",
        ruc: (empresaContext.ruc as string) || "",
      })
    }
  }, [empresaContext])

  useEffect(() => {
    setTecnicos(Array.isArray(contextoTecnicos) ? contextoTecnicos.map((t) => ({ ...t })) : [])
  }, [contextoTecnicos])

  // Contadores
  const tecnicosActivos = tecnicos.filter((t) => t.activo).length
  const areasActivas = areasEmpresa.filter((a) => a.activa).length

  // Util: generar id seguro (prefiere ids numéricos existentes, sino timestamp)
  const generarIdTecnico = (): number | string => {
    const numericIds = tecnicos
      .map((t) => (typeof t.id === "number" ? t.id : NaN))
      .filter((n) => Number.isFinite(n))
    if (numericIds.length > 0) {
      return Math.max(...numericIds) + 1
    }
    return `t_${Date.now()}`
  }

  // Empresa
  const guardarEmpresa = async () => {
    try {
      if (typeof actualizarEmpresaContext === "function") {
        const res = await Promise.resolve(actualizarEmpresaContext(empresa))
        // si el provider devuelve la empresa actualizada, úsala
        if (res && typeof res === "object") {
          setEmpresa({
            nombre: (res.nombre as string) || "",
            direccion: (res.direccion as string) || "",
            telefono: (res.telefono as string) || "",
            email: (res.email as string) || "",
            ruc: (res.ruc as string) || "",
          })
        }
      } else {
        // No hay provider: los cambios quedan locales (como fallback)
        console.warn("actualizarEmpresaContext no está definido — cambios solo locales")
      }
      setEditandoEmpresa(false)
    } catch (err) {
      console.error("Error guardando empresa:", err)
    }
  }

  // Técnicos: agregar / editar / eliminar (usa contexto si existe)
  const agregarTecnico = async () => {
    if (!nuevoTecnico.nombre || !nuevoTecnico.cargo) return
    const tecnico: Tecnico = {
      id: generarIdTecnico(),
      nombre: (nuevoTecnico.nombre as string).trim(),
      cargo: (nuevoTecnico.cargo as string).trim(),
      especialidad: (nuevoTecnico.especialidad as string) || "",
      telefono: (nuevoTecnico.telefono as string) || "",
      email: (nuevoTecnico.email as string) || "",
      activo: nuevoTecnico.activo ?? true,
    }

    try {
      if (typeof crearTecnicoContext === "function") {
        const res = await Promise.resolve(crearTecnicoContext(tecnico))
        const tecnicoFinal = (res && typeof res === "object") ? (res as Tecnico) : tecnico
        setTecnicos((prev) => (prev.some((t) => t.id === tecnicoFinal.id) ? prev : [...prev, tecnicoFinal]))
      } else {
        setTecnicos((prev) => [...prev, tecnico])
      }
      cancelarFormTecnico()
    } catch (err) {
      console.error("Error creando técnico:", err)
    }
  }

  const editarTecnico = (t: Tecnico) => {
    setTecnicoEditando(t)
    setNuevoTecnico({ ...t })
    setMostrarFormTecnico(true)
  }

  const guardarTecnico = async () => {
    if (!tecnicoEditando) return
    if (!nuevoTecnico.nombre || !nuevoTecnico.cargo) return

    const tecnicoActualizado: Tecnico = {
      ...tecnicoEditando,
      nombre: (nuevoTecnico.nombre as string).trim(),
      cargo: (nuevoTecnico.cargo as string).trim(),
      especialidad: (nuevoTecnico.especialidad as string) || "",
      telefono: (nuevoTecnico.telefono as string) || "",
      email: (nuevoTecnico.email as string) || "",
      activo: nuevoTecnico.activo ?? true,
    }

    try {
      if (typeof actualizarTecnicoContext === "function") {
        const res = await Promise.resolve(actualizarTecnicoContext(tecnicoActualizado.id, tecnicoActualizado))
        const tecnicoFinal = (res && typeof res === "object") ? (res as Tecnico) : tecnicoActualizado
        setTecnicos((prev) => prev.map((t) => (t.id === tecnicoFinal.id ? tecnicoFinal : t)))
      } else {
        setTecnicos((prev) => prev.map((t) => (t.id === tecnicoActualizado.id ? tecnicoActualizado : t)))
      }
      cancelarFormTecnico()
    } catch (err) {
      console.error("Error actualizando técnico:", err)
    }
  }

  const eliminarTecnico = async (id: number | string) => {
    try {
      if (typeof eliminarTecnicoContext === "function") {
        await Promise.resolve(eliminarTecnicoContext(id))
      }
      setTecnicos((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      console.error("Error eliminando técnico:", err)
    }
  }

  const toggleActivoTecnico = async (id: number | string) => {
    const t = tecnicos.find((x) => x.id === id)
    if (!t) return
    const actualizado = { ...t, activo: !t.activo }
    try {
      if (typeof actualizarTecnicoContext === "function") {
        const res = await Promise.resolve(actualizarTecnicoContext(id, actualizado))
        const tecnicoFinal = (res && typeof res === "object") ? (res as Tecnico) : actualizado
        setTecnicos((prev) => prev.map((x) => (x.id === id ? tecnicoFinal : x)))
      } else {
        setTecnicos((prev) => prev.map((x) => (x.id === id ? actualizado : x)))
      }
    } catch (err) {
      console.error("Error toggling activo técnico:", err)
    }
  }

  const cancelarFormTecnico = () => {
    setMostrarFormTecnico(false)
    setTecnicoEditando(null)
    setNuevoTecnico({ nombre: "", cargo: "", especialidad: "", telefono: "", email: "", activo: true })
  }

  // Áreas: agregar / editar / eliminar (usamos siempre la fuente de verdad del provider)
  const agregarArea = async () => {
    if (!nuevaArea.nombre || !nuevaArea.responsable) return
    try {
      if (typeof crearAreaEmpresa === "function") {
        await Promise.resolve(
          crearAreaEmpresa({
            nombre: nuevaArea.nombre,
            descripcion: nuevaArea.descripcion,
            responsable: nuevaArea.responsable,
            activa: nuevaArea.activa,
          })
        )
      } else {
        console.warn("crearAreaEmpresa no definido en provider — cambios no persistirán")
      }
      setNuevaArea({ nombre: "", descripcion: "", responsable: "", activa: true })
      setMostrarFormArea(false)
    } catch (err) {
      console.error("Error creando área:", err)
    }
  }

  const editarArea = (area: Area) => {
    setAreaEditando(area)
    setNuevaArea({
      nombre: area.nombre || "",
      descripcion: area.descripcion || "",
      responsable: area.responsable || "",
      activa: area.activa ?? true,
    })
    setMostrarFormArea(true)
  }

  const guardarArea = async () => {
    if (!areaEditando) return
    if (!nuevaArea.nombre || !nuevaArea.responsable) return
    try {
      if (typeof actualizarAreaEmpresa === "function") {
        await Promise.resolve(
          actualizarAreaEmpresa(areaEditando.id, {
            nombre: nuevaArea.nombre,
            descripcion: nuevaArea.descripcion,
            responsable: nuevaArea.responsable,
            activa: nuevaArea.activa,
          })
        )
      } else {
        console.warn("actualizarAreaEmpresa no definido en provider — cambios no persistirán")
      }
      cancelarFormArea()
    } catch (err) {
      console.error("Error actualizando área:", err)
    }
  }

  const eliminarArea = async (id: string) => {
    try {
      if (typeof eliminarAreaEmpresa === "function") {
        await Promise.resolve(eliminarAreaEmpresa(id))
      } else {
        console.warn("eliminarAreaEmpresa no definido en provider — cambios no persistirán")
      }
    } catch (err) {
      console.error("Error eliminando área:", err)
    }
  }

  const toggleActivaArea = async (id: string) => {
    const area = areasEmpresa.find((a) => a.id === id)
    if (!area) return
    try {
      if (typeof actualizarAreaEmpresa === "function") {
        await Promise.resolve(actualizarAreaEmpresa(id, { activa: !area.activa }))
      } else {
        console.warn("actualizarAreaEmpresa no definido en provider — toggle no persistente")
      }
    } catch (err) {
      console.error("Error toggling área:", err)
    }
  }

  const cancelarFormArea = () => {
    setMostrarFormArea(false)
    setAreaEditando(null)
    setNuevaArea({ nombre: "", descripcion: "", responsable: "", activa: true })
  }

  // Validaciones simples
  const tecnicoValido = !!nuevoTecnico.nombre && !!nuevoTecnico.cargo

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuración del Sistema</h1>
          <p className="text-muted-foreground">Gestión de empresa, técnicos y áreas de trabajo</p>
        </div>
        <div className="flex gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Técnicos Activos</p>
                <p className="text-2xl font-bold">{tecnicosActivos}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Áreas Activas</p>
                <p className="text-2xl font-bold">{areasActivas}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Información de la Empresa */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información de la Empresa
              </CardTitle>
              <CardDescription>Datos generales de la empresa</CardDescription>
            </div>
            <Button
              variant={editandoEmpresa ? "outline" : "default"}
              onClick={() => setEditandoEmpresa((s) => !s)}
            >
              {editandoEmpresa ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
              {editandoEmpresa ? "Cancelar" : "Editar"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editandoEmpresa ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de la Empresa *</Label>
                  <Input
                    id="nombre"
                    value={empresa.nombre}
                    onChange={(e) => setEmpresa({ ...empresa, nombre: e.target.value })}
                    placeholder="Nombre de la empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ruc">RUC/NIT</Label>
                  <Input
                    id="ruc"
                    value={empresa.ruc}
                    onChange={(e) => setEmpresa({ ...empresa, ruc: e.target.value })}
                    placeholder="Número de identificación fiscal"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Textarea
                  id="direccion"
                  value={empresa.direccion}
                  onChange={(e) => setEmpresa({ ...empresa, direccion: e.target.value })}
                  placeholder="Dirección completa de la empresa"
                  rows={2}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={empresa.telefono}
                    onChange={(e) => setEmpresa({ ...empresa, telefono: e.target.value })}
                    placeholder="Teléfono principal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={empresa.email}
                    onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })}
                    placeholder="Email de contacto"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={guardarEmpresa}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-semibold">{empresa.nombre || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">RUC/NIT</p>
                  <p className="font-semibold">{empresa.ruc || "—"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p className="font-semibold">{empresa.direccion || "—"}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-semibold">{empresa.telefono || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{empresa.email || "—"}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Áreas de la Empresa */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Áreas de la Empresa
              </CardTitle>
              <CardDescription>Gestión de áreas y departamentos de trabajo</CardDescription>
            </div>
            <Button onClick={() => setMostrarFormArea(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Área
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Formulario para agregar/editar área */}
          {mostrarFormArea && (
            <Card className="mb-6 border-primary">
              <CardHeader>
                <CardTitle>{areaEditando ? "Editar Área" : "Nueva Área"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nombreArea">Nombre del Área *</Label>
                      <Input
                        id="nombreArea"
                        value={nuevaArea.nombre || ""}
                        onChange={(e) => setNuevaArea({ ...nuevaArea, nombre: e.target.value })}
                        placeholder="Nombre del área o departamento"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsableArea">Responsable *</Label>
                      <Input
                        id="responsableArea"
                        value={nuevaArea.responsable || ""}
                        onChange={(e) => setNuevaArea({ ...nuevaArea, responsable: e.target.value })}
                        placeholder="Responsable del área"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcionArea">Descripción</Label>
                    <Textarea
                      id="descripcionArea"
                      value={nuevaArea.descripcion || ""}
                      onChange={(e) => setNuevaArea({ ...nuevaArea, descripcion: e.target.value })}
                      placeholder="Descripción del área y sus funciones"
                      rows={2}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={cancelarFormArea}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button onClick={areaEditando ? guardarArea : agregarArea}>
                      <Save className="h-4 w-4 mr-2" />
                      {areaEditando ? "Actualizar" : "Agregar"} Área
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de áreas */}
          <div className="space-y-4">
            {areasEmpresa.map((area) => (
              <Card key={area.id} className={!area.activa ? "opacity-60" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{area.nombre}</h3>
                        <Badge variant={area.activa ? "default" : "secondary"}>
                          {area.activa ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground font-medium mb-1">Responsable: {area.responsable}</p>
                      {area.descripcion && <p className="text-sm text-muted-foreground mb-2">{area.descripcion}</p>}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => toggleActivaArea(area.id)}>
                        {area.activa ? "Desactivar" : "Activar"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => editarArea(area)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => eliminarArea(area.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {areasEmpresa.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay áreas registradas</h3>
              <p className="text-muted-foreground mb-4">Agrega áreas para organizar mejor el trabajo.</p>
              <Button onClick={() => setMostrarFormArea(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primera Área
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gestión de Técnicos */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Técnicos de Mantenimiento
              </CardTitle>
              <CardDescription>Gestión del personal técnico</CardDescription>
            </div>
            <Button onClick={() => setMostrarFormTecnico(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Técnico
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Formulario para agregar/editar técnico */}
          {mostrarFormTecnico && (
            <Card className="mb-6 border-primary">
              <CardHeader>
                <CardTitle>{tecnicoEditando ? "Editar Técnico" : "Nuevo Técnico"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nombreTecnico">Nombre Completo *</Label>
                      <Input
                        id="nombreTecnico"
                        value={nuevoTecnico.nombre || ""}
                        onChange={(e) => setNuevoTecnico({ ...nuevoTecnico, nombre: e.target.value })}
                        placeholder="Nombre completo del técnico"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cargoTecnico">Cargo *</Label>
                      <Input
                        id="cargoTecnico"
                        value={nuevoTecnico.cargo || ""}
                        onChange={(e) => setNuevoTecnico({ ...nuevoTecnico, cargo: e.target.value })}
                        placeholder="Cargo o posición"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="especialidadTecnico">Especialidad</Label>
                    <Input
                      id="especialidadTecnico"
                      value={nuevoTecnico.especialidad || ""}
                      onChange={(e) => setNuevoTecnico({ ...nuevoTecnico, especialidad: e.target.value })}
                      placeholder="Área de especialización"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="telefonoTecnico">Teléfono</Label>
                      <Input
                        id="telefonoTecnico"
                        value={nuevoTecnico.telefono || ""}
                        onChange={(e) => setNuevoTecnico({ ...nuevoTecnico, telefono: e.target.value })}
                        placeholder="Teléfono de contacto"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailTecnico">Email</Label>
                      <Input
                        id="emailTecnico"
                        type="email"
                        value={nuevoTecnico.email || ""}
                        onChange={(e) => setNuevoTecnico({ ...nuevoTecnico, email: e.target.value })}
                        placeholder="Email del técnico"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={cancelarFormTecnico}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button onClick={tecnicoEditando ? guardarTecnico : agregarTecnico} disabled={!tecnicoValido}>
                      <Save className="h-4 w-4 mr-2" />
                      {tecnicoEditando ? "Actualizar" : "Agregar"} Técnico
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de técnicos */}
          <div className="space-y-4">
            {tecnicos.map((tecnico) => (
              <Card key={String(tecnico.id)} className={!tecnico.activo ? "opacity-60" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{tecnico.nombre}</h3>
                        <Badge variant={tecnico.activo ? "default" : "secondary"}>
                          {tecnico.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground font-medium mb-1">{tecnico.cargo}</p>
                      {tecnico.especialidad && (
                        <p className="text-sm text-muted-foreground mb-2">Especialidad: {tecnico.especialidad}</p>
                      )}
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        {tecnico.telefono && <span>📞 {tecnico.telefono}</span>}
                        {tecnico.email && <span>✉️ {tecnico.email}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => toggleActivoTecnico(tecnico.id)}>
                        {tecnico.activo ? "Desactivar" : "Activar"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => editarTecnico(tecnico)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => eliminarTecnico(tecnico.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {tecnicos.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay técnicos registrados</h3>
              <p className="text-muted-foreground mb-4">Agrega técnicos para asignar trabajos de mantenimiento.</p>
              <Button onClick={() => setMostrarFormTecnico(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Técnico
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
