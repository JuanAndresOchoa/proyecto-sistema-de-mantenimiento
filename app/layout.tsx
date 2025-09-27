import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { AppProvider } from "@/contexts/app-context"
import { ThemeProvider } from "next-themes"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sistema de Mantenimiento",
  description: "Aplicación de gestión de mantenimiento industrial",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body>
        <AppProvider>
          <Suspense fallback={null}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </Suspense>
        </AppProvider>
      </body>
    </html>
  )
}
