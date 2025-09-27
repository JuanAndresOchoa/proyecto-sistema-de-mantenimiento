"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { EquiposList } from "@/components/equipos/equipos-list"
import { MantenimientosList } from "@/components/mantenimientos/mantenimientos-list"
import { ReportesDashboard } from "@/components/reportes/reportes-dashboard"
import { AlertasDashboard } from "@/components/alertas/alertas-dashboard"
import { ConfiguracionDashboard } from "@/components/configuracion/configuracion-dashboard"
import { CostosDashboard } from "@/components/costos/costos-dashboard"
import { OrdenesTrabajoList } from "@/components/ordenes-trabajo/ordenes-trabajo-list"

export default function Home() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard onSectionChange={setActiveSection} />
      case "equipos":
        return <EquiposList />
      case "mantenimientos":
        return <MantenimientosList />
      case "ordenes-trabajo":
        return <OrdenesTrabajoList />
      case "costos":
        return <CostosDashboard />
      case "reportes":
        return <ReportesDashboard />
      case "alertas":
        return <AlertasDashboard />
      case "configuracion":
        return <ConfiguracionDashboard />
      default:
        return <Dashboard onSectionChange={setActiveSection} />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
    </div>
  )
}
