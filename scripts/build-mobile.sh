#!/bin/bash

# Script para construir y desplegar la aplicación móvil
# Uso: ./scripts/build-mobile.sh [android|ios]

PLATFORM=${1:-android}

echo "🏗️  Construyendo aplicación para $PLATFORM..."

# Construir la aplicación web
echo "📦 Construyendo aplicación web..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en el build web"
    exit 1
fi

# Sincronizar con Capacitor
echo "🔄 Sincronizando con Capacitor..."
npx cap sync $PLATFORM

if [ $? -ne 0 ]; then
    echo "❌ Error en la sincronización"
    exit 1
fi

echo "✅ Build completado para $PLATFORM"
echo ""
echo "📱 Para abrir en $PLATFORM Studio/IDE:"
echo "   npx cap open $PLATFORM"
echo ""
echo "📱 Para construir APK/IPA:"
echo "   npx cap build $PLATFORM"