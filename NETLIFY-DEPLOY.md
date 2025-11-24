# 🚀 Guía de Despliegue en Netlify

## 📋 Requisitos Previos

- Cuenta en [Netlify](https://app.netlify.com/)
- Repositorio de GitHub con el código
- Variables de entorno configuradas

## 🔧 Paso 1: Preparar el Proyecto

### 1.1 Verificar archivo de configuración

Asegúrate de que exista `netlify.toml` en la raíz del proyecto (ya está creado).

### 1.2 Actualizar package.json

Verifica que tengas el script de build:

```json
{
  "scripts": {
    "build": "ionic build",
    "build:prod": "ionic build --prod"
  }
}
```

## 🌐 Paso 2: Conectar con Netlify

### Opción A: Despliegue desde Git (Recomendado)

1. **Ir a Netlify Dashboard:**
   - https://app.netlify.com/

2. **Crear nuevo sitio:**
   - Click en "Add new site" → "Import an existing project"
   - Selecciona "GitHub"
   - Autoriza Netlify a acceder a tu cuenta
   - Selecciona el repositorio `gestpharmaapp`

3. **Configuración de Build:**
   ```
   Base directory: (dejar vacío)
   Build command: npm run build --prod
   Publish directory: www
   ```

4. **Click en "Deploy site"**

### Opción B: Despliegue Manual con CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Inicializar
netlify init

# Desplegar
netlify deploy --prod
```

## 🔐 Paso 3: Configurar Variables de Entorno

### 3.1 En Netlify UI

1. Ve a **Site settings** → **Environment variables**
2. Click en **"Add a variable"** o **"Import from a .env file"**

### 3.2 Variables Requeridas

Copia del archivo `.env.example` y agrega:

#### 🔥 Firebase (Marcar como Secret)
```env
FIREBASE_API_KEY=AIzaSyAxiaUFUaLBwDZSd3OTgWMqmLocp5NJbVc
FIREBASE_AUTH_DOMAIN=auth-app-cff73.firebaseapp.com
FIREBASE_PROJECT_ID=auth-app-cff73
FIREBASE_STORAGE_BUCKET=auth-app-cff73.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=310871799777
FIREBASE_APP_ID=1:310871799777:web:1e9218cf21dcd956d604a0
```

#### 🔐 Google OAuth (Marcar como Secret)
```env
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
```

#### 🌐 API Backend
```env
API_URL_PROD=https://tu-api.railway.app/api
```

#### ⚙️ Configuración App
```env
APP_NAME=GestPharma
APP_VERSION=1.0.0
API_TIMEOUT=30000
JWT_REFRESH_INTERVAL=840000
```

#### 📊 Feature Flags
```env
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true
ENABLE_DEBUG_MODE=false
```

### 3.3 Configurar Scopes y Deploy Contexts

Para cada variable:
- **Scopes:** "All scopes" (o "Functions" si solo se usa ahí)
- **Deploy contexts:**
  - ✅ Production
  - ✅ Deploy Previews (para PRs)
  - ✅ Branch deploys (opcional)

### 3.4 Marcar como Secretas

Variables que DEBEN marcarse como secretas (checkbox "Contains secret values"):
- ✅ `FIREBASE_API_KEY`
- ✅ `GOOGLE_CLIENT_ID`
- ✅ `API_URL_PROD` (si contiene credenciales)

## 🔄 Paso 4: Actualizar Código para Usar Variables de Netlify

### 4.1 Crear archivo de configuración para build

Crea `src/environments/environment.netlify.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: process.env['API_URL_PROD'] || 'https://default-api.com/api',
  firebase: {
    apiKey: process.env['FIREBASE_API_KEY'] || '',
    authDomain: process.env['FIREBASE_AUTH_DOMAIN'] || '',
    projectId: process.env['FIREBASE_PROJECT_ID'] || '',
    storageBucket: process.env['FIREBASE_STORAGE_BUCKET'] || '',
    messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'] || '',
    appId: process.env['FIREBASE_APP_ID'] || ''
  },
  googleClientId: process.env['GOOGLE_CLIENT_ID'] || '',
  // ... resto de endpoints
};
```

### 4.2 Actualizar angular.json

Agrega configuración para Netlify:

```json
{
  "configurations": {
    "netlify": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.netlify.ts"
        }
      ],
      "optimization": true,
      "outputHashing": "all",
      "sourceMap": false,
      "extractCss": true,
      "namedChunks": false,
      "aot": true,
      "extractLicenses": true,
      "vendorChunk": false,
      "buildOptimizer": true
    }
  }
}
```

### 4.3 Actualizar netlify.toml

Cambia el comando de build para usar la configuración:

```toml
[build]
  command = "npm run build -- --configuration=netlify"
  publish = "www"
```

## ✅ Paso 5: Verificar Despliegue

1. **Monitorear el build:**
   - Ve a "Deploys" en Netlify
   - Revisa los logs de build
   - Verifica que no haya errores

2. **Probar el sitio:**
   - Netlify genera una URL temporal: `random-name-123456.netlify.app`
   - Prueba todas las funcionalidades
   - Verifica que Firebase funcione
   - Prueba Google Sign-In

3. **Revisar logs:**
   ```bash
   # Ver logs en tiempo real
   netlify logs
   
   # Ver funciones (si usas)
   netlify functions:list
   ```

## 🎨 Paso 6: Configurar Dominio Personalizado (Opcional)

1. **En Netlify:**
   - Site settings → Domain management
   - Click "Add custom domain"
   - Ingresa tu dominio: `gestpharma.com`

2. **Configurar DNS:**
   - A Record: `75.2.60.5` (Netlify Load Balancer)
   - CNAME: `www` → `random-name-123456.netlify.app`

3. **Habilitar HTTPS:**
   - Netlify lo hace automáticamente con Let's Encrypt
   - Espera unos minutos para la propagación

## 🔒 Paso 7: Configurar Google OAuth para Producción

1. **Google Cloud Console:**
   - Ve a Credentials
   - Edita tu OAuth 2.0 Client ID
   - Agrega "Authorized JavaScript origins":
     ```
     https://tu-sitio.netlify.app
     https://gestpharma.com (si tienes dominio)
     ```
   - Agrega "Authorized redirect URIs":
     ```
     https://tu-sitio.netlify.app/auth/callback
     https://gestpharma.com/auth/callback
     ```

2. **Firebase Console:**
   - Authentication → Sign-in method → Google
   - Agrega los dominios autorizados:
     - `tu-sitio.netlify.app`
     - `gestpharma.com`

## 📊 Paso 8: Configurar Analytics (Opcional)

### Netlify Analytics
```bash
# Habilitar en la UI de Netlify
Site settings → Analytics → Enable
```

### Google Analytics
Ya configurado en Firebase si `ENABLE_ANALYTICS=true`

## 🔄 Paso 9: Configurar Deploy Automático

Netlify despliega automáticamente cuando haces push a GitHub:

```bash
# Desarrollo
git checkout develop
git push origin develop
# → Despliega en deploy-preview

# Producción
git checkout main
git push origin main
# → Despliega en producción
```

## 🛠️ Troubleshooting

### Error: "Build failed"
```bash
# Verificar logs
netlify logs

# Limpiar cache
netlify build --clear-cache
```

### Error: "Firebase not initialized"
- Verifica que las variables de entorno estén configuradas
- Marca `FIREBASE_API_KEY` como secreta
- Verifica que estén en "Production" deploy context

### Error: "API CORS"
- Configura el proxy en `netlify.toml` (ya incluido)
- O habilita CORS en tu backend

### Error: "Page not found on refresh"
- Verifica que exista el redirect en `netlify.toml`:
  ```toml
  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```

## 📚 Recursos

- [Netlify Docs](https://docs.netlify.com/)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)
- [Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Angular on Netlify](https://docs.netlify.com/frameworks/angular/)

## 🎯 Checklist Final

- [ ] Código pusheado a GitHub
- [ ] Sitio conectado en Netlify
- [ ] Variables de entorno configuradas
- [ ] Variables secretas marcadas correctamente
- [ ] Build exitoso
- [ ] Sitio accesible en URL de Netlify
- [ ] Firebase funciona correctamente
- [ ] Google Sign-In funciona
- [ ] API backend conectada
- [ ] Dominios autorizados en Google/Firebase
- [ ] SSL/HTTPS habilitado
- [ ] (Opcional) Dominio personalizado configurado

---

¡Tu aplicación GestPharma está lista para producción en Netlify! 🎉
