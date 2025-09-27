"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Zap,
  Calendar,
  BarChart3,
  AlertTriangle,
  Home,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
} from "lucide-react"
import { useApp } from "@/contexts/app-context"

interface SidebarProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
}

export function Sidebar({ activeSection = "dashboard", onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { equipos, mantenimientos, alertas, costos, ordenesTrabajo } = useApp()

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", active: activeSection === "dashboard" },
    {
      id: "equipos",
      icon: Zap,
      label: "Equipos",
      badge: equipos.length.toString(),
      active: activeSection === "equipos",
    },
    {
      id: "mantenimientos",
      icon: Calendar,
      label: "Mantenimientos",
      badge: mantenimientos.filter((m) => m.estado === "Programado").length.toString(),
      active: activeSection === "mantenimientos",
    },
    {
      id: "ordenes-trabajo",
      icon: FileText,
      label: "Órdenes de Trabajo",
      badge: ordenesTrabajo?.filter((o) => o.estado === "Abierta").length.toString() || "0",
      active: activeSection === "ordenes-trabajo",
    },
    {
      id: "costos",
      icon: DollarSign,
      label: "Costos",
      badge: costos.length.toString(),
      active: activeSection === "costos",
    },
    { id: "reportes", icon: BarChart3, label: "Reportes", active: activeSection === "reportes" },
    {
      id: "alertas",
      icon: AlertTriangle,
      label: "Alertas",
      badge: alertas.filter((a) => a.estado === "Activa").length.toString(),
      active: activeSection === "alertas",
    },
    { id: "configuracion", icon: Settings, label: "Configuración", active: activeSection === "configuracion" },
  ]

  const handleMenuClick = (itemId: string) => {
    onSectionChange?.(itemId)
  }

  return (
    <Card
      className={`${isCollapsed ? "w-16" : "w-64"} h-full rounded-none border-r bg-sidebar transition-all duration-300`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-sidebar-foreground">Sistema de control de mantenimiento</h2>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant={item.active ? "default" : "ghost"}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full justify-start gap-3 ${
                  item.active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                } ${isCollapsed ? "px-2" : "px-3"}`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          {!isCollapsed && (
            <div className="text-xs text-sidebar-foreground/60">
              <p>Usuario: Admin</p>
              <p>Última conexión: Hoy</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
