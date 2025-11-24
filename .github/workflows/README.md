# 🔄 GitHub Actions Workflows

Este directorio contiene los workflows de GitHub Actions para el proyecto GestPharma.

## 📋 Workflows Disponibles

### 1. `netlify-production.yml` - Despliegue a Producción
**Trigger:** Push a la rama `main`

Este workflow despliega automáticamente la aplicación a Netlify en producción cuando se hace push a la rama main.

**Pasos:**
1. ✅ Checkout del código
2. ✅ Setup de Node.js 20
3. ✅ Instalación de dependencias (`npm ci`)
4. ✅ Generación de archivos environment desde GitHub Secrets
5. ✅ Build de producción
6. ✅ Deploy a Netlify (producción)
7. ✅ Comentario en el commit con URL del despliegue

**Secrets requeridos:**
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`

### 2. `netlify-preview.yml` - Despliegue de Preview
**Trigger:** Pull Requests (opened, synchronize, reopened)

Este workflow crea un despliegue de preview para cada Pull Request, permitiendo revisar los cambios antes de mergear.

**Pasos:**
1. ✅ Checkout del código
2. ✅ Setup de Node.js 20
3. ✅ Instalación de dependencias (`npm ci`)
4. ✅ Generación de archivos environment desde GitHub Secrets
5. ✅ Build de producción
6. ✅ Deploy a Netlify (preview)
7. ✅ Comentario en el PR con URL del preview

**Secrets requeridos:** Los mismos que el workflow de producción

**URLs de preview:**
- `https://deploy-preview-{PR_NUMBER}--tu-sitio.netlify.app`
- `https://pr-{PR_NUMBER}--tu-sitio.netlify.app` (alias)

## 🔐 Configuración de Secrets

Para configurar los secrets necesarios:

1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Click en **"New repository secret"**
3. Agrega cada secret con su valor correspondiente

Ver la [Guía completa de configuración](../GITHUB-ACTIONS-SETUP.md) para instrucciones detalladas.

## 📊 Monitoreo

Para ver el estado de los workflows:
1. Ve a la pestaña **Actions** en GitHub
2. Selecciona un workflow de la lista
3. Click en un run específico para ver los detalles
4. Expande los steps para ver los logs

## 🔧 Mantenimiento

### Actualizar versión de Node.js
Edita ambos workflows y cambia el valor en:
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'  # Cambiar aquí
```

### Cambiar comando de build
Edita el step "Build application":
```yaml
- name: Build application
  run: npm run build -- --configuration production  # Cambiar aquí
```

### Modificar timeout
Edita el step "Deploy to Netlify":
```yaml
timeout-minutes: 10  # Cambiar aquí (en minutos)
```

## 📚 Recursos

- [Documentación completa](../GITHUB-ACTIONS-SETUP.md)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Netlify Deploy Action](https://github.com/nwtgck/actions-netlify)
- [Guía de Netlify](../../NETLIFY-DEPLOY.md)

## 🆘 Troubleshooting

Si un workflow falla:
1. Revisa los logs en la pestaña Actions
2. Verifica que todos los secrets estén configurados
3. Asegúrate de que el build funcione localmente
4. Consulta la sección de troubleshooting en la [documentación completa](../GITHUB-ACTIONS-SETUP.md)

---

Para más información, consulta la [Guía completa de GitHub Actions](../GITHUB-ACTIONS-SETUP.md).
