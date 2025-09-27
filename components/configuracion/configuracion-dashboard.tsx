"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Plus, Edit, Trash2, Save, X, MapPin } from "lucide-react"
import { useApp } from "@/contexts/app-context"

interface Tecnico {
  id: number
  nombre: string
  cargo: string
  especialidad: string
  telefono: string
  email: string
  activo: boolean
}

export function ConfiguracionDashboard() {
  const { areasEmpresa, crearAreaEmpresa, actualizarAreaEmpresa, eliminarAreaEmpresa } = useApp()

  const [empresa, setEmpresa] = useState({
    nombre: "Industrias Ejemplo S.A.",
    direccion: "Av. Industrial 123, Zona Industrial",
    telefono: "+1 234 567 8900",
    email: "contacto@industriasejemplo.com",
    ruc: "12345678901",
  })

  const [tecnicos, setTecnicos] = useState<Tecnico[]>([
    {
      id: 1,
      nombre: "Juan Pérez",
      cargo: "Técnico Eléctrico Senior",
      especialidad: "Motores y Transformadores",
      telefono: "+1 234 567 8901",
      email: "juan.perez@empresa.com",
      activo: true,
    },
    {
      id: 2,
      nombre: "Carlos López",
      cargo: "Técnico Mecánico",
      especialidad: "Bombas y Sistemas Hidráulicos",
      telefono: "+1 234 567 8902",
      email: "carlos.lopez@empresa.com",
      activo: true,
    },
    {
      id: 3,
      nombre: "Ana García",
      cargo: "Ingeniera de Mantenimiento",
      especialidad: "Planificación y Supervisión",
      telefono: "+1 234 567 8903",
      email: "ana.garcia@empresa.com",
      activo: true,
    },
    {
      id: 4,
      nombre: "Miguel Torres",
      cargo: "Técnico Instrumentista",
      especialidad: "Calibración y Medición",
      telefono: "+1 234 567 8904",
      email: "miguel.torres@empresa.com",
      activo: false,
    },
  ])

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
  const [areaEditando, setAreaEditando] = useState<any>(null)
  const [nuevaArea, setNuevaArea] = useState({
    nombre: "",
    descripcion: "",
    responsable: "",
    activa: true,
  })

  const guardarEmpresa = () => {
    console.log("Guardando información de empresa:", empresa)
    setEditandoEmpresa(false)
  }

  const agregarTecnico = () => {
    if (nuevoTecnico.nombre && nuevoTecnico.cargo) {
      const tecnico: Tecnico = {
        id: Math.max(...tecnicos.map((t) => t.id)) + 1,
        nombre: nuevoTecnico.nombre!,
        cargo: nuevoTecnico.cargo!,
        especialidad: nuevoTecnico.especialidad || "",
        telefono: nuevoTecnico.telefono || "",
        email: nuevoTecnico.email || "",
        activo: nuevoTecnico.activo ?? true,
      }
      setTecnicos([...tecnicos, tecnico])
      setNuevoTecnico({ nombre: "", cargo: "", especialidad: "", telefono: "", email: "", activo: true })
      setMostrarFormTecnico(false)
    }
  }

  const editarTecnico = (tecnico: Tecnico) => {
    setTecnicoEditando(tecnico)
    setNuevoTecnico(tecnico)
    setMostrarFormTecnico(true)
  }

  const guardarTecnico = () => {
    if (tecnicoEditando && nuevoTecnico.nombre && nuevoTecnico.cargo) {
      const tecnicoActualizado: Tecnico = {
        ...tecnicoEditando,
        nombre: nuevoTecnico.nombre!,
        cargo: nuevoTecnico.cargo!,
        especialidad: nuevoTecnico.especialidad || "",
        telefono: nuevoTecnico.telefono || "",
        email: nuevoTecnico.email || "",
        activo: nuevoTecnico.activo ?? true,
      }
      setTecnicos(tecnicos.map((t) => (t.id === tecnicoEditando.id ? tecnicoActualizado : t)))
      cancelarFormTecnico()
    }
  }

  const eliminarTecnico = (id: number) => {
    setTecnicos(tecnicos.filter((t) => t.id !== id))
  }

  const toggleActivoTecnico = (id: number) => {
    setTecnicos(tecnicos.map((t) => (t.id === id ? { ...t, activo: !t.activo } : t)))
  }

  const cancelarFormTecnico = () => {
    setMostrarFormTecnico(false)
    setTecnicoEditando(null)
    setNuevoTecnico({ nombre: "", cargo: "", especialidad: "", telefono: "", email: "", activo: true })
  }

  const agregarArea = () => {
    if (nuevaArea.nombre && nuevaArea.responsable) {
      crearAreaEmpresa({
        nombre: nuevaArea.nombre,
        descripcion: nuevaArea.descripcion,
        responsable: nuevaArea.responsable,
        activa: nuevaArea.activa,
      })
      setNuevaArea({ nombre: "", descripcion: "", responsable: "", activa: true })
      setMostrarFormArea(false)
    }
  }

  const editarArea = (area: any) => {
    setAreaEditando(area)
    setNuevaArea(area)
    setMostrarFormArea(true)
  }

  const guardarArea = () => {
    if (areaEditando && nuevaArea.nombre && nuevaArea.responsable) {
      actualizarAreaEmpresa(areaEditando.id, {
        nombre: nuevaArea.nombre,
        descripcion: nuevaArea.descripcion,
        responsable: nuevaArea.responsable,
        activa: nuevaArea.activa,
      })
      cancelarFormArea()
    }
  }

  const eliminarArea = (id: string) => {
    eliminarAreaEmpresa(id)
  }

  const toggleActivaArea = (id: string) => {
    const area = areasEmpresa.find((a) => a.id === id)
    if (area) {
      actualizarAreaEmpresa(id, { activa: !area.activa })
    }
  }

  const cancelarFormArea = () => {
    setMostrarFormArea(false)
    setAreaEditando(null)
    setNuevaArea({ nombre: "", descripcion: "", responsable: "", activa: true })
  }

  const tecnicosActivos = tecnicos.filter((t) => t.activo).length
  const areasActivas = areasEmpresa.filter((a) => a.activa).length

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
              onClick={() => (editandoEmpresa ? setEditandoEmpresa(false) : setEditandoEmpresa(true))}
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
                  <p className="font-semibold">{empresa.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">RUC/NIT</p>
                  <p className="font-semibold">{empresa.ruc}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p className="font-semibold">{empresa.direccion}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-semibold">{empresa.telefono}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{empresa.email}</p>
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
                        value={nuevaArea.nombre}
                        onChange={(e) => setNuevaArea({ ...nuevaArea, nombre: e.target.value })}
                        placeholder="Nombre del área o departamento"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsableArea">Responsable *</Label>
                      <Input
                        id="responsableArea"
                        value={nuevaArea.responsable}
                        onChange={(e) => setNuevaArea({ ...nuevaArea, responsable: e.target.value })}
                        placeholder="Responsable del área"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcionArea">Descripción</Label>
                    <Textarea
                      id="descripcionArea"
                      value={nuevaArea.descripcion}
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
                        value={nuevoTecnico.nombre}
                        onChange={(e) => setNuevoTecnico({ ...nuevoTecnico, nombre: e.target.value })}
                        placeholder="Nombre completo del técnico"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cargoTecnico">Cargo *</Label>
                      <Input
                        id="cargoTecnico"
                        value={nuevoTecnico.cargo}
                        onChange={(e) => setNuevoTecnico({ ...nuevoTecnico, cargo: e.target.value })}
                        placeholder="Cargo o posición"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="especialidadTecnico">Especialidad</Label>
                    <Input
                      id="especialidadTecnico"
                      value={nuevoTecnico.especialidad}
                      onChange={(e) => setNuevoTecnico({ ...nuevoTecnico, especialidad: e.target.value })}
                      placeholder="Área de especialización"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="telefonoTecnico">Teléfono</Label>
                      <Input
                        id="telefonoTecnico"
                        value={nuevoTecnico.telefono}
                        onChange={(e) => setNuevoTecnico({ ...nuevoTecnico, telefono: e.target.value })}
                        placeholder="Teléfono de contacto"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailTecnico">Email</Label>
                      <Input
                        id="emailTecnico"
                        type="email"
                        value={nuevoTecnico.email}
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
                    <Button onClick={tecnicoEditando ? guardarTecnico : agregarTecnico}>
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
              <Card key={tecnico.id} className={!tecnico.activo ? "opacity-60" : ""}>
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
