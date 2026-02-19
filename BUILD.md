# Guía de Build y Deployment - Music Player PWA

## Configuración como SPA (Single Page Application)

Este proyecto está configurado específicamente como una SPA pura sin Server-Side Rendering (SSR).

### Archivos de Configuración Críticos

#### 1. `svelte.config.js` - Adapter Estático

```javascript
export default {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',  // ← Ruta a index.html para SPA routing
      precompress: true,
      strict: false
    }),
    // PWA configuration
    csrf: { checkOrigin: false }
  }
};
```

**Qué hace:**
- `@sveltejs/adapter-static` genera archivos estáticos puros
- `fallback: 'index.html'` asegura que todas las rutas desconocidas van a index.html
- PWA se configura automáticamente con `@vite-pwa/sveltekit`

#### 2. `src/routes/+layout.ts` - Deshabilitar SSR

```typescript
export const ssr = false;      // NO renderizar en servidor
export const prerender = false; // NO pregenerar páginas
export const csr = true;        // SÍ renderizar en cliente

export async function load() {
  return {
    title: 'Music Player PWA',
    description: '...'
  };
}
```

**Qué hace:**
- `ssr = false`: Desabilita rendering en servidor completamente
- `csr = true`: Fuerza rendering 100% cliente-side
- Todas las páginas se sirven como SPA

#### 3. `vite.config.ts` - Optimizaciones de Build

```typescript
export default defineConfig({
  plugins: [sveltekit()],
  build: {
    target: 'ES2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,     // Remover console.logs
        drop_debugger: true     // Remover debugger
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['jsmediatags'],
          ui: ['lucide-svelte']
        }
      }
    }
  }
});
```

**Qué hace:**
- `target: 'ES2020'`: Soporte moderno sin polyfills innecesarios
- `minify: 'terser'`: Compresión máxima
- `manualChunks`: Code splitting para vendors separados
- Elimina logs de debug en producción

## Build Process

### Paso 1: Instalar Dependencias

```bash
pnpm install
```

Instala todas las dependencias necesarias incluyendo:
- SvelteKit y plugins
- Tailwind CSS v4
- jsmediatags (metadata)
- Dexie (IndexedDB wrapper)
- Lucide Icons

### Paso 2: Ejecutar Build

```bash
pnpm run build
```

**Qué sucede:**
1. Svelte compila componentes `.svelte` a JavaScript
2. TypeScript se compila a JavaScript puro
3. Tailwind CSS genera utilidades usadas solamente
4. Assets se optimizan (imágenes, iconos)
5. Service Worker se genera automáticamente
6. Code splitting crea chunks optimizados
7. Todo se minifica y compresa

**Salida:**
```
build/
├── _app/
│   ├── chunks/
│   │   ├── index-XXX.js      # Main bundle
│   │   ├── vendor-XXX.js     # jsmediatags, dexie
│   │   └── ui-XXX.js         # lucide-svelte
│   ├── version.json          # Cache busting
│   └── app.html
├── index.html                # Entry point
├── manifest.json             # PWA manifest
├── icon-*.png               # PWA icons
└── sw.js                    # Service Worker
```

### Paso 3: Preview Localmente

```bash
pnpm run preview
```

Sirve la carpeta `build/` localmente en puerto 4173 (simulando producción).

### Paso 4: Deploy a Hosting Estático

Sube la carpeta `build/` a:

#### Vercel
```bash
# Automático si conectas el repositorio
# O:
vercel --prod
```

#### Netlify
```bash
# Conecta repositorio o:
netlify deploy --prod --dir=build
```

#### GitHub Pages
```bash
# Configura el repositorio para servir /build como página
```

## Características PWA

### Service Worker Automático

El Service Worker se genera automáticamente gracias a `@vite-pwa/sveltekit`:

```javascript
// src/sw.ts
const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

// Precachea assets en instalación
// Cache-first para assets, network-first para datos
```

**Qué cachea:**
- HTML, CSS, JavaScript
- Iconos y manifests
- Fuentes (si aplica)

**NO cachea:**
- Archivos de audio (demasiado grandes)
- Datos dinámicos

### Manifest.json

```json
{
  "name": "Music Player PWA",
  "short_name": "Music Player",
  "display": "standalone",
  "start_url": "/",
  "scope": "/",
  "theme_color": "#ef4444",
  "background_color": "#000000",
  "icons": [...]
}
```

**Permite:**
- Instalación como app nativa
- Icono en pantalla de inicio
- Modo fullscreen sin barras del navegador

## Optimizaciones de Performance

### 1. Code Splitting

```typescript
// Automático por Rollup
// Vendor bundle separado para libs estables
// Invalidación de cache solo cuando cambia
```

### 2. Minificación

```bash
# HTML → 2-3 KB
# CSS → 5-8 KB (después de pruning Tailwind)
# JS → 40-60 KB (incluye librerías)
```

### 3. Compresión de Assets

```typescript
// En build:
- Images: JPEG con quality 0.7
- Icons: SVG optimizados
- Fonts: Subsetting si aplica
```

### 4. Tree Shaking

```typescript
// Solo imports usados se incluyen
import { Play } from 'lucide-svelte';  // ✅ Incluido
// Icono no usado no entra al bundle
```

## Configuración de Servidor Web

### Headers Recomendados

```
# Cache static assets for long time
Cache-Control: public, max-age=31536000, immutable
  for: /_app/chunks/*, /_app/version.json

# Cache busting for index.html
Cache-Control: public, max-age=0, must-revalidate
  for: /index.html

# PWA assets
Cache-Control: public, max-age=3600
  for: /manifest.json, /sw.js

# Fallback SPA routing
Fallback: /index.html
  for: all 404s
```

### Vercel (automático)

```vercel.json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "build",
  "trailingSlash": false
}
```

### Netlify

```toml
[build]
  command = "pnpm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages (requiere setup especial)

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run build
      - uses: actions/upload-pages-artifact@v2
        with:
          path: 'build/'

  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v2
        id: deployment
```

## Troubleshooting Build

### Problema: "Cannot find module 'jsmediatags'"
**Solución:** Ejecutar `pnpm install`

### Problema: Assets en ruta incorrecta
**Solución:** Verificar `paths` en `svelte.config.js`:
```javascript
alias: {
  $components: './src/lib/components',
  $stores: './src/lib/stores',
  $utils: './src/lib/utils',
  $types: './src/lib/types'
}
```

### Problema: Service Worker no funciona
**Solución:** 
1. Verificar que app se sirve con HTTPS
2. Revisar console del navegador para errores
3. Limpiar cache: DevTools → Application → Clear site data

### Problema: Rutas SPA no funcionan
**Solución:** Asegurar que el servidor tiene:
```
Fallback → /index.html
```

## Verificación Pre-Deployment

```bash
# 1. Build local sin errores
pnpm run build

# 2. Preview funciona
pnpm run preview

# 3. Service Worker en dev tools
DevTools → Application → Service Workers

# 4. Offline funciona (DevTools → Network → offline)

# 5. PWA installable
DevTools → Manifest válido y icons presentes

# 6. No errores de console
Abrir console (F12) sin errores rojos

# 7. Performance check
Google Lighthouse: Target 90+
```

## Monitoreo Post-Deployment

### Métricas Importantes

- **First Contentful Paint (FCP)**: < 2s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Service Worker**: Activo y cacheando

### Tools para Monitoreo

- Google Lighthouse
- WebPageTest
- Sentry (error tracking)
- LogRocket (session replay)

## Rollback Plan

Si hay issues en producción:

1. **Revert último commit** en repositorio
2. **Redeploy automático** si está configurado
3. **Verificar Service Worker cache**
   - DevTools → Clear site data
   - Nuevo deployment reemplaza cache

---

**Documento actualizado:** 2024
**Versión SvelteKit:** 2.x
**Versión Tailwind:** 4.x
