#!/bin/bash

# Script para generar environment.prod.ts desde variables de entorno de Netlify

echo "🔧 Generando environment.prod.ts desde variables de entorno..."

cat > src/environments/environment.prod.ts << EOF
export const environment = {
  production: true,
  
  apiUrl: 'https://farmaapi-production.up.railway.app/farmacontrol-api/api',
  
  firebase: {
    apiKey: "${FIREBASE_API_KEY}",
    authDomain: "${FIREBASE_AUTH_DOMAIN}",
    projectId: "${FIREBASE_PROJECT_ID}",
    storageBucket: "${FIREBASE_STORAGE_BUCKET}",
    messagingSenderId: "${FIREBASE_MESSAGING_SENDER_ID}",
    appId: "${FIREBASE_APP_ID}"
  },
  
  endpoints: {
    auth: '/usuarios/auth',
    refreshToken: '/usuarios/refresh',
    profile: '/usuarios/perfil',
    usuarios: '/usuarios',
    productos: '/productos',
    productosPorCategoria: '/productos?categoria=',
    productosStockBajo: '/productos?stock=bajo',
    categorias: '/categorias',
    clientes: '/clientes',
    proveedores: '/proveedores',
    ventas: '/ventas',
    ventasDetalles: '/ventas/{id}/detalles',
    compras: '/compras',
    comprasDetalles: '/compras/{id}/detalles',
    reportes: '/reportes',
    reportesVentas: '/reportes/ventas',
    reportesCompras: '/reportes/compras',
    reportesInventario: '/reportes/inventario',
    reportesProductosMasVendidos: '/reportes/productos/mas-vendidos',
    reportesClientesTop: '/reportes/clientes/top',
    reportesProveedoresTop: '/reportes/proveedores/top',
    dashboardEstadisticas: '/reportes/estadisticas',
    dashboardVentasRecientes: '/ventas?recientes=true',
    dashboardStockBajo: '/productos?stock=bajo',
    roles: '/roles',
    permisos: '/permisos',
    usuariosRoles: '/usuarios/{id}/roles',
    rolesPermisos: '/roles/{id}/permisos',
    googleAuth: '/usuarios/google-auth'
  }
};
EOF

echo "✅ environment.prod.ts generado correctamente"
