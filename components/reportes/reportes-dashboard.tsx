"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { BarChart3, Download, Calendar, TrendingUp, Clock, DollarSign, Wrench, AlertTriangle } from "lucide-react"
import { useApp } from "@/contexts/app-context"

export function ReportesDashboard() {
  const { equipos, mantenimientos, alertas, costos, obtenerCostosTotales, obtenerCostosPorCategoria } = useApp()

  const disponibilidadMensual = [
    { mes: "Ene", disponibilidad: 92, mantenimientos: 15 },
    { mes: "Feb", disponibilidad: 88, mantenimientos: 22 },
    { mes: "Mar", disponibilidad: 95, mantenimientos: 12 },
    { mes: "Apr", disponibilidad: 87, mantenimientos: 28 },
    { mes: "May", disponibilidad: 91, mantenimientos: 18 },
    {
      mes: "Jun",
      disponibilidad: Math.round((equipos.filter((e) => e.estado === "Operativo").length / equipos.length) * 100),
      mantenimientos: mantenimientos.length,
    },
  ]

  const costosPorCategoria = obtenerCostosPorCategoria()
  const costosPorTipo = Object.entries(costosPorCategoria).map(([categoria, costo]) => ({
    tipo: categoria,
    costo: costo,
    cantidad: costos.filter((c) => c.categoria === categoria).length,
  }))

  const equiposPorEstado = [
    {
      estado: "Operativo",
      cantidad: equipos.filter((e) => e.estado === "Operativo").length,
      color: "#22c55e",
    },
    {
      estado: "Mantenimiento",
      cantidad: equipos.filter((e) => e.estado === "Mantenimiento").length,
      color: "#f59e0b",
    },
    {
      estado: "Fuera de Servicio",
      cantidad: equipos.filter((e) => e.estado === "Fuera de Servicio").length,
      color: "#ef4444",
    },
  ]

  const tecnicosUnicos = [...new Set(mantenimientos.map((m) => m.tecnico))]
  const rendimientoTecnicos = tecnicosUnicos.map((tecnico) => {
    const mantenimientosTecnico = mantenimientos.filter((m) => m.tecnico === tecnico)
    const completados = mantenimientosTecnico.filter((m) => m.estado === "Completado").length
    return {
      tecnico,
      completados,
      promedio: Math.floor(Math.random() * 15) + 85, // Simulado entre 85-100
      eficiencia: Math.floor(Math.random() * 15) + 85, // Simulado entre 85-100
    }
  })

  const tendenciaFallas = [
    { semana: "S1", fallas: 3, preventivos: mantenimientos.filter((m) => m.tipo === "Preventivo").length },
    { semana: "S2", fallas: 5, preventivos: 6 },
    { semana: "S3", fallas: 2, preventivos: 10 },
    { semana: "S4", fallas: 4, preventivos: 7 },
    { semana: "S5", fallas: 1, preventivos: 12 },
    { semana: "S6", fallas: mantenimientos.filter((m) => m.tipo === "Correctivo").length, preventivos: 5 },
  ]

  const costoTotal = obtenerCostosTotales()
  const disponibilidadGeneral = Math.round(
    (equipos.filter((e) => e.estado === "Operativo").length / equipos.length) * 100,
  )
  const eficienciaPromedio = equipos.reduce((sum, e) => sum + e.eficiencia, 0) / equipos.length

  const metricas = {
    mtbf: Math.round(equipos.reduce((sum, e) => sum + e.horasOperacion, 0) / equipos.length / 100), // Simulado
    mttr: 4.2, // Simulado
    disponibilidadGeneral,
    costoTotalMes: costoTotal,
    mantenimientosCompletados: mantenimientos.filter((m) => m.estado === "Completado").length,
    mantenimientosPendientes: mantenimientos.filter((m) => m.estado === "Programado").length,
    alertasActivas: alertas.filter((a) => a.estado === "Activa").length,
    eficienciaPromedio: Math.round(eficienciaPromedio),
  }

  const exportarReporte = () => {
    const fechaActual = new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reporte de Mantenimiento - ${fechaActual}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333; 
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #2563eb; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
          }
          .header h1 { 
            color: #2563eb; 
            margin: 0; 
            font-size: 28px; 
          }
          .header p { 
            color: #666; 
            margin: 5px 0 0 0; 
          }
          .metrics-grid { 
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 20px; 
            margin-bottom: 30px; 
          }
          .metric-card { 
            border: 1px solid #e5e7eb; 
            border-radius: 8px; 
            padding: 20px; 
            text-align: center; 
            background: #f9fafb; 
          }
          .metric-value { 
            font-size: 24px; 
            font-weight: bold; 
            color: #2563eb; 
            margin-bottom: 5px; 
          }
          .metric-label { 
            color: #666; 
            font-size: 14px; 
          }
          .section { 
            margin-bottom: 40px; 
          }
          .section h2 { 
            color: #1f2937; 
            border-bottom: 1px solid #e5e7eb; 
            padding-bottom: 10px; 
            margin-bottom: 20px; 
          }
          .table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px; 
          }
          .table th, .table td { 
            border: 1px solid #e5e7eb; 
            padding: 12px; 
            text-align: left; 
          }
          .table th { 
            background: #f3f4f6; 
            font-weight: bold; 
          }
          .table tr:nth-child(even) { 
            background: #f9fafb; 
          }
          .alert { 
            padding: 15px; 
            border-radius: 8px; 
            margin-bottom: 15px; 
          }
          .alert-critical { 
            background: #fef2f2; 
            border-left: 4px solid #ef4444; 
          }
          .alert-warning { 
            background: #fffbeb; 
            border-left: 4px solid #f59e0b; 
          }
          .alert-info { 
            background: #f0f9ff; 
            border-left: 4px solid #3b82f6; 
          }
          .footer { 
            margin-top: 50px; 
            text-align: center; 
            color: #666; 
            font-size: 12px; 
            border-top: 1px solid #e5e7eb; 
            padding-top: 20px; 
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Reporte de Mantenimiento</h1>
          <p>Análisis completo del rendimiento y costos de mantenimiento</p>
          <p><strong>Fecha de generación:</strong> ${fechaActual}</p>
        </div>

        <div class="section">
          <h2>📈 Métricas Principales (KPIs)</h2>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value">${metricas.mtbf}h</div>
              <div class="metric-label">MTBF Promedio<br>Tiempo medio entre fallas</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${metricas.mttr}h</div>
              <div class="metric-label">MTTR Promedio<br>Tiempo medio de reparación</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${metricas.disponibilidadGeneral}%</div>
              <div class="metric-label">Disponibilidad<br>Disponibilidad general</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">$${metricas.costoTotalMes.toLocaleString()}</div>
              <div class="metric-label">Costo Total<br>Este mes</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>📊 Disponibilidad Mensual</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Mes</th>
                <th>Disponibilidad (%)</th>
                <th>Mantenimientos</th>
              </tr>
            </thead>
            <tbody>
              ${disponibilidadMensual
                .map(
                  (item) => `
                <tr>
                  <td>${item.mes}</td>
                  <td>${item.disponibilidad}%</td>
                  <td>${item.mantenimientos}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>💰 Análisis de Costos por Categoría</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Costo Total</th>
                <th>Cantidad de Items</th>
                <th>Costo Promedio</th>
              </tr>
            </thead>
            <tbody>
              ${costosPorTipo
                .map(
                  (item) => `
                <tr>
                  <td>${item.tipo}</td>
                  <td>$${item.costo.toLocaleString()}</td>
                  <td>${item.cantidad}</td>
                  <td>$${item.cantidad > 0 ? Math.round(item.costo / item.cantidad) : 0}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>⚙️ Estado Actual de Equipos</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Estado</th>
                <th>Cantidad</th>
                <th>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              ${equiposPorEstado
                .map((item) => {
                  const total = equiposPorEstado.reduce((sum, eq) => sum + eq.cantidad, 0)
                  const porcentaje = total > 0 ? ((item.cantidad / total) * 100).toFixed(1) : "0"
                  return `
                  <tr>
                    <td>${item.estado}</td>
                    <td>${item.cantidad}</td>
                    <td>${porcentaje}%</td>
                  </tr>
                `
                })
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>👥 Rendimiento de Técnicos</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Técnico</th>
                <th>Trabajos Completados</th>
                <th>Calidad Promedio (%)</th>
                <th>Eficiencia (%)</th>
              </tr>
            </thead>
            <tbody>
              ${rendimientoTecnicos
                .map(
                  (tecnico) => `
                <tr>
                  <td>${tecnico.tecnico}</td>
                  <td>${tecnico.completados}</td>
                  <td>${tecnico.promedio}%</td>
                  <td>${tecnico.eficiencia}%</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>⚠️ Alertas y Recomendaciones</h2>
          <div class="alert alert-info">
            <strong>📈 Estado del Sistema</strong><br>
            Sistema funcionando con ${metricas.disponibilidadGeneral}% de disponibilidad general.
          </div>
          <div class="alert alert-warning">
            <strong>💰 Costos de Mantenimiento</strong><br>
            Costo total actual: $${metricas.costoTotalMes.toLocaleString()}. Revisar optimización de gastos.
          </div>
          <div class="alert alert-info">
            <strong>📅 Mantenimientos Pendientes</strong><br>
            ${metricas.mantenimientosPendientes} mantenimientos programados requieren atención.
          </div>
        </div>

        <div class="section">
          <h2>📋 Resumen Ejecutivo</h2>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value">${metricas.mantenimientosCompletados}</div>
              <div class="metric-label">Trabajos Completados<br>Total</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${metricas.eficienciaPromedio}%</div>
              <div class="metric-label">Eficiencia Promedio<br>Todos los equipos</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${metricas.mantenimientosPendientes}</div>
              <div class="metric-label">Trabajos Pendientes<br>Por asignar</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${metricas.alertasActivas}</div>
              <div class="metric-label">Alertas Activas<br>Requieren atención</div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Reporte generado automáticamente por el Sistema de Gestión de Mantenimiento</p>
          <p>Fecha y hora de generación: ${new Date().toLocaleString("es-ES")}</p>
        </div>
      </body>
      </html>
    `

    // Crear un nuevo documento para imprimir
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()

      // Esperar a que se cargue el contenido y luego imprimir
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 500)
      }
    }

    console.log("[v0] Reporte PDF generado exitosamente")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Reportes y Métricas
          </h2>
          <p className="text-muted-foreground">Análisis completo del rendimiento y costos de mantenimiento</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="mes">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="mes">Mes</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="año">Año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 bg-transparent" onClick={exportarReporte}>
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MTBF Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">{metricas.mtbf}h</div>
            <p className="text-xs text-muted-foreground">Tiempo medio entre fallas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MTTR Promedio</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{metricas.mttr}h</div>
            <p className="text-xs text-muted-foreground">Tiempo medio de reparación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibilidad</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-5">{metricas.disponibilidadGeneral}%</div>
            <p className="text-xs text-muted-foreground">Disponibilidad general</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${metricas.costoTotalMes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total registrado</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Reportes */}
      <Tabs defaultValue="disponibilidad" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="disponibilidad">Disponibilidad</TabsTrigger>
          <TabsTrigger value="costos">Costos</TabsTrigger>
          <TabsTrigger value="rendimiento">Rendimiento</TabsTrigger>
          <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
        </TabsList>

        {/* Reporte de Disponibilidad */}
        <TabsContent value="disponibilidad" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Disponibilidad Mensual</CardTitle>
                <CardDescription>Porcentaje de disponibilidad por mes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={disponibilidadMensual}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="disponibilidad"
                      stroke="hsl(var(--chart-4))"
                      fill="hsl(var(--chart-4))"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado Actual de Equipos</CardTitle>
                <CardDescription>Distribución por estado operativo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={equiposPorEstado}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="cantidad"
                      label={({ estado, cantidad }) => `${estado}: ${cantidad}`}
                    >
                      {equiposPorEstado.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Resumen de Disponibilidad */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Disponibilidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-5">89.5%</div>
                  <p className="text-sm text-muted-foreground">Disponibilidad Promedio</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">720h</div>
                  <p className="text-sm text-muted-foreground">MTBF Promedio</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">4.2h</div>
                  <p className="text-sm text-muted-foreground">MTTR Promedio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reporte de Costos */}
        <TabsContent value="costos" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Costos por Categoría</CardTitle>
                <CardDescription>Distribución de costos por categoría</CardDescription>
              </CardHeader>
              <CardContent>
                {costosPorTipo.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={costosPorTipo}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tipo" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="costo" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No hay datos de costos disponibles</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análisis de Costos</CardTitle>
                <CardDescription>Desglose detallado de gastos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {costosPorTipo.length > 0 ? (
                    costosPorTipo.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <span className="text-sm font-medium">{item.tipo}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${item.costo.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">{item.cantidad} items</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <p>No hay datos de costos para mostrar</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métricas de Costo */}
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Costo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">${metricas.costoTotalMes.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Costo Total</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">
                    ${costos.length > 0 ? Math.round(metricas.costoTotalMes / costos.length) : 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Costo Promedio/Item</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-4">
                    ${equipos.length > 0 ? Math.round(metricas.costoTotalMes / equipos.length) : 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Costo/Equipo</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-5">{costos.length}</div>
                  <p className="text-sm text-muted-foreground">Items Registrados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reporte de Rendimiento */}
        <TabsContent value="rendimiento" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento de Técnicos</CardTitle>
              <CardDescription>Análisis de productividad y eficiencia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rendimientoTecnicos.map((tecnico, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{tecnico.tecnico}</div>
                      <div className="text-sm text-muted-foreground">{tecnico.completados} trabajos completados</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-bold">{tecnico.promedio}%</div>
                        <div className="text-xs text-muted-foreground">Calidad</div>
                      </div>
                      <div className="text-center">
                        <Badge
                          variant={
                            tecnico.eficiencia >= 90 ? "default" : tecnico.eficiencia >= 85 ? "secondary" : "outline"
                          }
                        >
                          {tecnico.eficiencia}% Eficiencia
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Métricas de Rendimiento */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trabajos Completados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-chart-5">{metricas.mantenimientosCompletados}</div>
                <p className="text-sm text-muted-foreground">Este mes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Eficiencia Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{metricas.eficienciaPromedio}%</div>
                <p className="text-sm text-muted-foreground">Todos los técnicos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trabajos Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">{metricas.mantenimientosPendientes}</div>
                <p className="text-sm text-muted-foreground">Por asignar</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reporte de Tendencias */}
        <TabsContent value="tendencias" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Fallas vs Mantenimiento Preventivo</CardTitle>
              <CardDescription>Análisis semanal de fallas y mantenimientos preventivos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={tendenciaFallas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="fallas" stroke="hsl(var(--destructive))" strokeWidth={2} />
                  <Line type="monotone" dataKey="preventivos" stroke="hsl(var(--chart-5))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Alertas y Recomendaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Alertas y Recomendaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg border-destructive/20 bg-destructive/5">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Incremento en fallas correctivas</p>
                    <p className="text-sm text-muted-foreground">
                      Se detectó un aumento del 15% en mantenimientos correctivos. Revisar programa preventivo.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg border-secondary/20 bg-secondary/5">
                  <TrendingUp className="h-4 w-4 text-secondary mt-0.5" />
                  <div>
                    <p className="font-medium text-secondary">Mejora en disponibilidad</p>
                    <p className="text-sm text-muted-foreground">
                      La disponibilidad general mejoró 3% este mes gracias al mantenimiento preventivo.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg border-chart-4/20 bg-chart-4/5">
                  <Calendar className="h-4 w-4 text-chart-4 mt-0.5" />
                  <div>
                    <p className="font-medium text-chart-4">Programación optimizada</p>
                    <p className="text-sm text-muted-foreground">
                      Considerar redistribuir cargas de trabajo entre técnicos para mejorar eficiencia.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
