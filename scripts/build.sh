#!/bin/bash

# Script de construcción para la aplicación de mantenimiento
echo "🔧 Iniciando proceso de construcción..."

# Limpiar directorios anteriores
echo "🧹 Limpiando directorios..."
rm -rf out/
rm -rf dist/
rm -rf main/

# Crear directorio main si no existe
mkdir -p main

# Copiar archivos de Electron
echo "📁 Copiando archivos de Electron..."
cp main/main.js main/ 2>/dev/null || echo "main.js no encontrado, se creará durante la construcción"
cp main/preload.js main/ 2>/dev/null || echo "preload.js no encontrado, se creará durante la construcción"

# Construir Next.js
echo "⚛️ Construyendo aplicación Next.js..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en la construcción de Next.js"
    exit 1
fi

# Reconstruir módulos nativos
echo "🔨 Reconstruyendo módulos nativos..."
npm run rebuild

if [ $? -ne 0 ]; then
    echo "⚠️ Advertencia: Error al reconstruir módulos nativos"
fi

# Crear base de datos si no existe
echo "🗄️ Inicializando base de datos..."
mkdir -p database
if [ ! -f database/maintenance.db ]; then
    touch database/maintenance.db
    echo "Base de datos creada"
fi

echo "✅ Construcción completada exitosamente!"
echo "📦 Para empaquetar la aplicación, ejecuta: npm run dist"
