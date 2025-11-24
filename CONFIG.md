# 🔐 Guía de Configuración de Variables de Entorno

## 📋 Archivos Requeridos (NO están en Git)

Antes de ejecutar la aplicación, debes crear estos archivos a partir de sus ejemplos:

### 1️⃣ Environment Variables

```bash
# Copiar plantillas
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts
cp capacitor.config.example.ts capacitor.config.ts
```

### 2️⃣ Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto o crea uno nuevo
3. Ve a **Project Settings** → **General**
4. Copia la configuración web:

```typescript
firebase: {
  apiKey: "AIza...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123"
}
```

5. Pega esta configuración en:
   - `src/environments/environment.ts` (desarrollo)
   - `src/environments/environment.prod.ts` (producción)

### 3️⃣ Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Navega a **APIs & Services** → **Credentials**
3. Crea credenciales OAuth 2.0:
   - **Tipo:** Web application
   - **Authorized JavaScript origins:**
     - `http://localhost:8100` (desarrollo)
     - `https://tu-dominio.com` (producción)
   - **Authorized redirect URIs:**
     - `http://localhost:8100/auth/callback`
     - `https://tu-dominio.com/auth/callback`

4. Copia el **Client ID**:
```typescript
serverClientId: '123456789012-abcdefghijklmnop.apps.googleusercontent.com'
```

5. Pégalo en `capacitor.config.ts` → plugins → GoogleAuth

### 4️⃣ Configurar API URL

**Desarrollo (local):**
```typescript
apiUrl: 'http://localhost:8080/api'
```

**Producción (Railway/Render):**
```typescript
apiUrl: 'https://tu-api.railway.app/api'
```

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo local
ionic serve

# Build para producción
npm run build --prod

# Build para Android
ionic capacitor build android --prod

# Build para iOS
ionic capacitor build ios --prod
```

## 📱 Deploy Móvil

### Android
```bash
# Generar keystore (primera vez)
keytool -genkey -v -keystore gestpharma.jks -keyalg RSA -keysize 2048 -validity 10000 -alias gestpharma

# Configurar en capacitor.config.ts
android: {
  buildOptions: {
    keystorePath: './gestpharma.jks',
    keystorePassword: 'TU_PASSWORD',
    keystoreAlias: 'gestpharma',
    keystoreAliasPassword: 'TU_ALIAS_PASSWORD'
  }
}

# Build release
ionic capacitor build android --prod --release
```

### iOS
```bash
# Requiere Mac con Xcode
ionic capacitor build ios --prod
```

## 🔒 Seguridad

⚠️ **NUNCA subas a Git:**
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`
- `capacitor.config.ts`
- `*.jks` (keystores de Android)
- Cualquier archivo con credenciales

✅ **SÍ puedes subir:**
- `*.example.ts` (plantillas sin credenciales)
- `.gitignore`
- `CONFIG.md` (esta guía)

## 🆘 Troubleshooting

### Error: "Firebase not configured"
→ Asegúrate de haber copiado `environment.example.ts` a `environment.ts`

### Error: "API connection refused"
→ Verifica que el backend esté corriendo en el puerto correcto

### Error: "Google Sign-In failed"
→ Revisa que el Client ID esté correctamente configurado en Google Console

### Error: "Module not found: environment"
→ Ejecuta: `cp src/environments/environment.example.ts src/environments/environment.ts`

## ✅ Verificación Rápida

```bash
# Ejecutar script de verificación
chmod +x check-config.sh
./check-config.sh
```

## 📞 Soporte

Si tienes problemas con la configuración:
1. Verifica que todos los archivos `.example.ts` se hayan copiado
2. Confirma que las credenciales sean correctas
3. Revisa los logs del navegador (F12)
4. Consulta la documentación oficial de Firebase/Ionic

---

## 🔄 Restaurar Archivos de Configuración

Si perdiste tus archivos de configuración o necesitas empezar de cero:

```bash
# Restaurar desde ejemplos
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts
cp capacitor.config.example.ts capacitor.config.ts

# Editar con tus credenciales
nano src/environments/environment.ts
```
