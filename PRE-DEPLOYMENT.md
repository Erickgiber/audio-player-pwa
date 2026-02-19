# Pre-Deployment Checklist - Music Player PWA

Antes de deploye a producción, verificar que todo funciona correctamente.

## ✅ Checklist de Validación

### Paso 1: Instalación & Build

- [ ] `pnpm install` sin errores
- [ ] `pnpm run build` sin errores
- [ ] Carpeta `build/` contiene archivos
- [ ] `pnpm run preview` funciona en http://localhost:4173

### Paso 2: Funcionalidad Básica

- [ ] Página carga sin errores (F12 → Console)
- [ ] Puedo seleccionar "Add Files"
- [ ] Puedo seleccionar "Add Folder"
- [ ] Carga de audios funciona
- [ ] Audios aparecen en playlist
- [ ] Play button reproduce audio
- [ ] Pause button pausa audio
- [ ] Volumen se ajusta
- [ ] Seek bar funciona
- [ ] Next/Previous funciona
- [ ] Repeat modes funcionan (off → all → one)
- [ ] Shuffle funciona
- [ ] Eliminar canción de playlist funciona

### Paso 3: Almacenamiento

- [ ] DevTools → Application → IndexedDB
  - [ ] Base de datos "MusicPlayerDB" existe
  - [ ] Audios se guardan en tabla
  - [ ] Volumen se persiste en localStorage
  - [ ] Bounce página → preferencias persisten

### Paso 4: Service Worker

- [ ] DevTools → Application → Service Workers
  - [ ] Service Worker registrado
  - [ ] Status: "activated and running"
- [ ] Desconectar internet (DevTools → Network → Offline)
  - [ ] App sigue funcionando
  - [ ] Audios guardados pueden reproducirse
  - [ ] Controles funcionan sin red

### Paso 5: PWA Features

- [ ] Manifest.json válido
  - [ ] DevTools → Application → Manifest
  - [ ] Todos los fields presentes
  - [ ] Icons apuntan a rutas correctas
- [ ] Instalación (si es posible en tu navegador)
  - [ ] Icono "Instalar" aparece (en algunos navegadores)
  - [ ] App se instala como app nativa

### Paso 6: Performance

- [ ] Google Lighthouse (DevTools → Lighthouse)
  - [ ] Performance: 90+
  - [ ] Accessibility: 95+
  - [ ] Best Practices: 95+
  - [ ] SEO: 100
- [ ] Bundle size razonable
  - [ ] Abrir DevTools → Network
  - [ ] `index.html` < 5 KB
  - [ ] Total assets < 100 KB

### Paso 7: Responsividad

- [ ] Resize navegador a móvil (DevTools → Toggle device toolbar)
  - [ ] Layout se adapta
  - [ ] Player visible y usable
  - [ ] Botones clickeables
  - [ ] Texto legible
- [ ] Tablet view (800x600)
  - [ ] Sidebar playlist visible
  - [ ] Controles accesibles
- [ ] Desktop view (1920x1080)
  - [ ] Layout horizontal óptimo
  - [ ] Sin overflow

### Paso 8: Navegadores

- [ ] Chrome/Edge (99+)
- [ ] Firefox (97+)
- [ ] Safari (14+)
  - [ ] PWA instalable en iOS

### Paso 9: Rutas SPA

- [ ] Escribir URL en navegador (ej: http://localhost:4173/foo)
  - [ ] Carga index.html (no 404)
  - [ ] App funciona correctamente
  - [ ] Refresh página → app persiste
- [ ] Usar navegador back/forward
  - [ ] App responde correctamente

### Paso 10: Errores & Warnings

- [ ] F12 → Console → Sin errores rojos
- [ ] F12 → Console → Sin warnings de deprecation
- [ ] F12 → Application → No console errors
- [ ] F12 → Network → Sin requests fallidas (404, 500)

### Paso 11: Configuración de Deploy

- [ ] `vercel.json` (si usas Vercel)
  - [ ] `buildCommand` correcto
  - [ ] `outputDirectory: "build"`
  - [ ] Headers configurados
- [ ] `netlify.toml` (si usas Netlify)
  - [ ] Redirects a index.html
- [ ] GitHub Actions (si usas GitHub Pages)
  - [ ] Workflow configurado

### Paso 12: Últimos Detalles

- [ ] Favicon visible (tab del navegador)
- [ ] Título de página correcto: "Music Player PWA"
- [ ] Meta tags en place:
  - [ ] `viewport` para mobile
  - [ ] `theme-color` para PWA
  - [ ] `apple-mobile-web-app-capable`
- [ ] Colores de tema correctos (rojo y negro)
- [ ] Animaciones suaves (sin stuttering)

## 🚀 Deployment

### Vercel

```bash
# Si conectaste repositorio, auto-deploy en push
git add .
git commit -m "Deploy Music Player PWA"
git push origin main

# O manual:
pnpm run build
vercel --prod
```

**Verificar después del deploy:**
- [ ] URL en navegador funciona
- [ ] Service Worker activo
- [ ] Offline funciona
- [ ] PWA installable
- [ ] Lighthouse score > 90

### Netlify

```bash
# Build
pnpm run build

# Deploy (opción 1: UI)
# 1. Abre netlify.com
# 2. Arrastra carpeta 'build/'

# Deploy (opción 2: CLI)
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### GitHub Pages

```bash
# Push a GitHub
git add .
git commit -m "Deploy Music Player PWA"
git push origin main

# GitHub Actions ejecuta build automáticamente
# Verificar en Actions tab
```

## ⚠️ Problemas Comunes

### "Service Worker no se registra"
- [ ] Verificar HTTPS en producción
- [ ] Revisar console para errores
- [ ] Limpiar cache del navegador

### "Audios no se cargan"
- [ ] IndexedDB tiene cuota disponible?
- [ ] Archivo está en formato soportado?
- [ ] Revisar Network tab en DevTools

### "PWA no installable"
- [ ] manifest.json accesible?
- [ ] Icones en rutas correctas?
- [ ] HTTPS requerido (excepto localhost)

### "Tema color no aplica"
- [ ] Verificar `theme-color` en manifest
- [ ] Verificar `theme-color` en HTML meta
- [ ] Limpiar cache del navegador

## 📊 Métricas Finales

Después del deployment, verificar:

| Métrica | Expected | Actual |
|---------|----------|--------|
| Lighthouse Performance | 90+ | __ |
| Lighthouse Accessibility | 95+ | __ |
| Lighthouse Best Practices | 95+ | __ |
| Lighthouse SEO | 100 | __ |
| Bundle Size (gzipped) | < 50 KB | __ |
| First Contentful Paint | < 2s | __ |
| Largest Contentful Paint | < 2.5s | __ |
| Time to Interactive | < 3.8s | __ |
| Service Worker | Active | __ |
| PWA Installable | Yes | __ |

## 🎓 Post-Deployment

1. **Monitor**: Revisar logs de error (Sentry, LogRocket)
2. **Analytics**: Trackear user interactions
3. **Feedback**: Recopilar feedback de usuarios
4. **Updates**: Plan futuras mejoras
5. **Maintenance**: Revisar security updates de deps

## ✨ Conclusión

Si todos los checkboxes están marcados, ¡está listo para deployment! 🚀

---

**Última revisión antes de deployar: ___/___/202__**
**Responsable: _____________________**
**Servidor: ( ) Vercel ( ) Netlify ( ) GitHub Pages ( ) Otro: _______**

---

En caso de issues post-deployment, revisar BUILD.md y PERFORMANCE.md para troubleshooting.
