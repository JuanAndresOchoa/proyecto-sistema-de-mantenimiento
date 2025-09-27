#!/bin/bash

# Script de desarrollo para la aplicación de mantenimiento
echo "🚀 Iniciando modo desarrollo..."

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

# Verificar que las dependencias estén instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Crear directorio main si no existe
mkdir -p main

# Crear base de datos si no existe
mkdir -p database
if [ ! -f database/maintenance.db ]; then
    touch database/maintenance.db
    echo "🗄️ Base de datos creada"
fi

# Reconstruir módulos nativos si es necesario
if [ ! -f "node_modules/.bin/electron-rebuild" ]; then
    echo "🔨 Reconstruyendo módulos nativos..."
    npm run rebuild
fi

echo "✅ Entorno de desarrollo listo"
echo "🔧 Iniciando aplicación..."

# Iniciar en modo desarrollo
npm run dev
