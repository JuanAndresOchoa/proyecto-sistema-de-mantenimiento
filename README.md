# Sistema de Gestión de Mantenimiento Industrial

Una aplicación de escritorio construida con Next.js y Electron para la gestión integral de mantenimiento industrial, equipos, órdenes de trabajo y costos.

## Características

- 🔧 Gestión de equipos industriales
- 📋 Planificación y seguimiento de mantenimientos
- 📊 Dashboard con métricas y KPIs
- 🚨 Sistema de alertas y notificaciones
- 💰 Control de costos de mantenimiento
- 📝 Órdenes de trabajo
- 📈 Reportes y análisis
- 🗄️ Base de datos SQLite local
- 🖥️ Aplicación de escritorio multiplataforma

## Tecnologías

- **Frontend**: Next.js 14, React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Desktop**: Electron
- **Base de datos**: SQLite con better-sqlite3
- **Gráficos**: Recharts
- **Formularios**: React Hook Form + Zod

## Instalación y Desarrollo

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn

### Instalación

1. Clona el repositorio:
\`\`\`bash
git clone <repository-url>
cd maintenance-app
\`\`\`

2. Instala las dependencias:
\`\`\`bash
npm install
\`\`\`

3. Reconstruye los módulos nativos para Electron:
\`\`\`bash
npm run rebuild
\`\`\`

### Desarrollo

Para ejecutar en modo desarrollo:

\`\`\`bash
npm run dev
\`\`\`

Esto iniciará tanto el servidor de Next.js como Electron en paralelo.

### Construcción y Empaquetado

1. Construir la aplicación:
\`\`\`bash
npm run build
\`\`\`

2. Empaquetar para distribución:
\`\`\`bash
npm run dist
\`\`\`

Los archivos empaquetados se generarán en la carpeta `dist/`.

## Estructura del Proyecto

\`\`\`
├── app/                    # Páginas de Next.js (App Router)
├── components/            # Componentes React
│   ├── ui/               # Componentes base de shadcn/ui
│   ├── equipos/          # Componentes de gestión de equipos
│   ├── mantenimientos/   # Componentes de mantenimientos
│   └── ...
├── contexts/             # Contextos de React
├── lib/                  # Utilidades y configuraciones
├── main/                 # Proceso principal de Electron
│   ├── main.js          # Archivo principal de Electron
│   └── preload.js       # Script de preload
├── database/            # Archivos de base de datos
│   ├── init.sql         # Script de inicialización
│   └── maintenance.db   # Base de datos SQLite
└── scripts/             # Scripts de utilidad
\`\`\`

## Base de Datos

La aplicación utiliza SQLite como base de datos local. Las tablas principales incluyen:

- `equipos` - Información de equipos industriales
- `mantenimientos` - Registros de mantenimientos
- `alertas` - Sistema de alertas
- `costos` - Costos asociados a mantenimientos
- `ordenes_trabajo` - Órdenes de trabajo
- `areas_empresa` - Áreas de la empresa

## Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Iniciar servidor de producción
- `npm run electron` - Ejecutar solo Electron
- `npm run rebuild` - Reconstruir módulos nativos
- `npm run lint` - Ejecutar linter

## Configuración de Electron

La aplicación está configurada para:

- Empaquetado multiplataforma (Windows, macOS, Linux)
- Base de datos SQLite integrada
- Comunicación segura entre procesos
- Auto-actualización (configuración adicional requerida)

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Para soporte técnico o preguntas, por favor abre un issue en el repositorio.
