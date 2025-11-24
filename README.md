# 💊 GestPharma

Sistema de gestión farmacéutica desarrollado con Ionic, Angular y Spring Boot.

## 📱 Descripción

GestPharma es una aplicación móvil completa para la gestión de farmacias que incluye:

- 🔐 Autenticación con JWT y Google Sign-In
- 📦 Gestión de inventario de productos
- 🛒 Sistema de punto de venta (POS)
- 👥 Gestión de clientes y proveedores
- 📊 Reportes y estadísticas en tiempo real
- 👤 Sistema de roles y permisos
- 📄 Generación de reportes en PDF

## 🚀 Tecnologías

### Frontend
- **Framework:** Angular 18 + Ionic 7
- **Autenticación:** Firebase Authentication
- **Estado:** RxJS
- **UI:** Ionic Components
- **Gráficas:** Chart.js
- **PDF:** jsPDF + autoTable

### Backend
- **Framework:** Spring Boot 3.1.5
- **Base de Datos:** MySQL 8.0
- **Autenticación:** JWT
- **Contenedores:** Docker + Docker Compose

## 📦 Instalación

### Requisitos Previos
- Node.js 18+
- npm o yarn
- Java 17+ (para el backend)
- Docker y Docker Compose (opcional)

### Configuración

1. **Clonar el repositorio:**
```bash
git clone https://github.com/JAlcon00/gestpharmaapp.git
cd gestpharmaapp
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
# Copiar archivos de ejemplo
cp src/environments/environment.example.ts src/environments/environment.ts
cp capacitor.config.example.ts capacitor.config.ts

# Editar con tus credenciales
nano src/environments/environment.ts
```

4. **Configurar Firebase:**
- Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
- Habilitar Authentication → Google Sign-In
- Copiar configuración web en `environment.ts`

5. **Verificar configuración:**
```bash
chmod +x check-config.sh
./check-config.sh
```

## 🎯 Uso

### Desarrollo
```bash
# Servidor de desarrollo
ionic serve

# O con live reload
ionic serve --lab
```

### Build
```bash
# Build para producción
npm run build --prod

# Build para Android
ionic capacitor build android --prod

# Build para iOS
ionic capacitor build ios --prod
```

### Testing
```bash
# Unit tests
npm test

# E2E tests
npm run e2e
```

## 📱 Funcionalidades Principales

### 🔐 Autenticación
- Login con usuario/contraseña
- Login con Google OAuth
- Renovación automática de tokens JWT
- Roles: ADMIN, CAJERO, VENDEDOR

### 📦 Inventario
- CRUD completo de productos
- Categorías y subcategorías
- Control de stock y alertas de bajo inventario
- Búsqueda y filtros avanzados

### 🛒 Punto de Venta
- Carrito de compras
- Búsqueda rápida de productos
- Cálculo automático de totales
- Registro de ventas

### 📊 Reportes
- Ventas por período
- Productos más vendidos
- Inventario actual
- Clientes frecuentes
- Exportación a PDF

### 👤 Perfil de Usuario
- Visualización de datos personales
- Indicador de tipo de autenticación (Google/Nativo)
- Cambio de contraseña
- Gestión de sesión

## 🔒 Seguridad

### Variables de Entorno
Los siguientes archivos contienen información sensible y **NO** están en el repositorio:
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`
- `capacitor.config.ts`

Usa los archivos `.example.ts` como plantilla.

### Credenciales
- Las contraseñas se hashean con BCrypt
- Tokens JWT con expiración de 24 horas
- Variables sensibles protegidas con `.gitignore`

## 📚 Documentación

- [Guía de Configuración](CONFIG.md)
- [Implementación - Fase 1](IMPLEMENTATION-PHASE-1.md)

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 👥 Créditos

Este proyecto fue desarrollado por:

- **Jesús Almanza** - Desarrollo Backend y Base de Datos
- **Jossue Amador** - Desarrollo Frontend y UI/UX
- **Jorge Estrada** - Desarrollo Frontend y UI/UX

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la Licencia MIT.

## 🔗 Enlaces

- **Repositorio Frontend:** [gestpharmaapp](https://github.com/JAlcon00/gestpharmaapp)
- **Backend:** FarmaApi (Spring Boot)
- **Documentación API:** `/api/swagger-ui.html`

## 📞 Soporte

Para reportar problemas o solicitar funcionalidades:
- Abre un [Issue](https://github.com/JAlcon00/gestpharmaapp/issues)
- Contacta al equipo de desarrollo

---

Desarrollado con ❤️ por el equipo de GestPharma
