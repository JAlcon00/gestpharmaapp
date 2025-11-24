// 📋 INSTRUCCIONES:
// 1. Copia este archivo y renómbralo a: environment.ts
// 2. Reemplaza los valores de ejemplo con tus credenciales reales
// 3. NO subas environment.ts a Git (ya está en .gitignore)

export const environment = {
  production: false,
  
  // 🌐 API Backend (desarrollo local)
  apiUrl: 'http://localhost:8080/api',
  
  // 🔥 Firebase Configuration
  // Obtén estos valores en: https://console.firebase.google.com/
  // Project Settings → General → Your apps → SDK setup and configuration
  firebase: {
    apiKey: "TU-API-KEY-AQUI",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
