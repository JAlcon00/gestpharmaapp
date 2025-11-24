#!/bin/bash

echo "🔍 Verificando configuración de GestPharma..."
echo ""

ERRORS=0

# Verificar archivos requeridos
echo "📋 Verificando archivos de configuración..."

if [ ! -f "src/environments/environment.ts" ]; then
    echo "❌ Falta: src/environments/environment.ts"
    echo "   Ejecuta: cp src/environments/environment.example.ts src/environments/environment.ts"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ src/environments/environment.ts"
fi

if [ ! -f "src/environments/environment.prod.ts" ]; then
    echo "❌ Falta: src/environments/environment.prod.ts"
    echo "   Ejecuta: cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ src/environments/environment.prod.ts"
fi

if [ ! -f "capacitor.config.ts" ]; then
    echo "❌ Falta: capacitor.config.ts"
    echo "   Ejecuta: cp capacitor.config.example.ts capacitor.config.ts"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ capacitor.config.ts"
fi

echo ""
echo "🔐 Verificando credenciales..."

# Verificar que no contengan valores de ejemplo
if [ -f "src/environments/environment.ts" ]; then
    if grep -q "TU-API-KEY" src/environments/environment.ts 2>/dev/null; then
        echo "⚠️  environment.ts contiene valores de ejemplo"
        echo "   Actualiza las credenciales reales de Firebase"
        ERRORS=$((ERRORS + 1))
    else
        echo "✅ Credenciales de desarrollo configuradas"
    fi
fi

if [ -f "capacitor.config.ts" ]; then
    if grep -q "TU-CLIENT-ID" capacitor.config.ts 2>/dev/null; then
        echo "⚠️  capacitor.config.ts contiene valores de ejemplo"
        echo "   Actualiza el Google Client ID"
        ERRORS=$((ERRORS + 1))
    else
        echo "✅ Capacitor configurado"
    fi
fi

echo ""
echo "📦 Verificando dependencias..."

if [ ! -d "node_modules" ]; then
    echo "⚠️  Faltan dependencias"
    echo "   Ejecuta: npm install"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ Dependencias instaladas"
fi

echo ""
if [ $ERRORS -eq 0 ]; then
    echo "✅ ¡Configuración completa! Puedes ejecutar: ionic serve"
    exit 0
else
    echo "❌ Encontrados $ERRORS errores. Revisa CONFIG.md para más información."
    exit 1
fi
