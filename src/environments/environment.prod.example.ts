// 📋 INSTRUCCIONES:
// 1. Copia este archivo y renómbralo a: environment.prod.ts
// 2. Reemplaza los valores con tus credenciales de PRODUCCIÓN
// 3. NO subas environment.prod.ts a Git

export const environment = {
  production: true,
  
  // 🌐 API Backend (Producción - Railway/Render/Cloud)
  apiUrl: 'https://tu-api-produccion.railway.app/api',
  
  // 🔥 Firebase Configuration (Producción)
  // Obtén estos valores en: https://console.firebase.google.com/
  // Project Settings → General → Your apps → SDK setup and configuration
  firebase: {
    apiKey: "TU-API-KEY-PRODUCCION",
    authDomain: "tu-proyecto-prod.firebaseapp.com",
    projectId: "tu-proyecto-prod",
    storageBucket: "tu-proyecto-prod.appspot.com",
    messagingSenderId: "987654321098",
    appId: "1:987654321098:web:fedcba654321"
  },
  
  endpoints: {
    // Autenticación
    auth: '/usuarios/auth',
    refreshToken: '/usuarios/refresh',
    profile: '/usuarios/perfil',
    
    // Usuarios
    usuarios: '/usuarios',
    
    // Productos
    productos: '/productos',
    productosPorCategoria: '/productos?categoria=',
    productosStockBajo: '/productos?stock=bajo',
    
    // Categorías
    categorias: '/categorias',
    
    // Clientes
    clientes: '/clientes',
    
    // Proveedores
    proveedores: '/proveedores',
    
    // Ventas
    ventas: '/ventas',
    ventasDetalles: '/ventas/{id}/detalles',
    
    // Compras
    compras: '/compras',
    comprasDetalles: '/compras/{id}/detalles',
    
    // Reportes
    reportes: '/reportes',
    reportesVentas: '/reportes/ventas',
    reportesCompras: '/reportes/compras',
    reportesInventario: '/reportes/inventario',
    reportesProductosMasVendidos: '/reportes/productos/mas-vendidos',
    reportesClientesTop: '/reportes/clientes/top',
    reportesProveedoresTop: '/reportes/proveedores/top',
    
    // Dashboard
    dashboardEstadisticas: '/reportes/estadisticas',
    dashboardVentasRecientes: '/ventas?recientes=true',
    dashboardStockBajo: '/productos?stock=bajo',
    
    // Roles y Permisos
    roles: '/roles',
    permisos: '/permisos',
    usuariosRoles: '/usuarios/{id}/roles',
    rolesPermisos: '/roles/{id}/permisos',
    
    // Google Auth
    googleAuth: '/usuarios/google-auth'
  }
};
