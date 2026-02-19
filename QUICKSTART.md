# Quick Start - Music Player PWA

## 🚀 Empezar en 30 segundos

### 1. Instalar
```bash
pnpm install
```

### 2. Desarrollo
```bash
pnpm run dev
```
Abre http://localhost:5173

### 3. Build
```bash
pnpm run build
pnpm run preview
```

### 4. Deploy
- **Vercel**: Push a GitHub y auto-deploy
- **Netlify**: Deploy carpeta `build/` manualmente
- **GitHub Pages**: Configurar repositorio settings

---

## 📱 Usar la Aplicación

1. **Cargar música**:
   - Click "Add Files" para archivo único
   - Click "Add Folder" para carpeta completa
   - O arrastra & suelta archivos

2. **Reproducir**:
   - Click en canción de la playlist
   - Controles: play/pause, volumen, seek
   - Shuffle, repeat, next, previous

3. **Instalar PWA**:
   - Móvil: Opción "Instalar" en navegador
   - Desktop: Opción "Instalar app" si está disponible
   - Funciona offline

---

## 🎯 Anatomía del Proyecto

```
src/
├── routes/          # Páginas (SPA sin SSR)
├── lib/
│   ├── components/  # UI (Player, Playlist, etc)
│   ├── stores/      # Estado global
│   └── utils/       # Funciones (Audio, DB, etc)
└── app.html         # HTML raíz

static/
└── assets PWA       # Iconos, manifest
```

---

## 🔧 Comandos Principales

| Comando | Qué hace |
|---------|----------|
| `pnpm run dev` | Servidor desarrollo con HMR |
| `pnpm run build` | Build SPA optimizado |
| `pnpm run preview` | Vista previa del build |
| `pnpm run check` | Type checking TypeScript |

---

## 💡 Tips

- **Debugging**: Abre DevTools (F12) → Console. Logs con `[v0]` prefix
- **Service Worker**: DevTools → Application → Service Workers
- **Storage**: DevTools → Application → IndexedDB
- **Performance**: Lighthouse en DevTools (Ctrl+Shift+P)

---

## 📚 Documentación Completa

- **README.md** - Guía completa de features
- **BUILD.md** - Configuración técnica y deployment
- **PERFORMANCE.md** - Optimizaciones y tuning
- **SUMMARY.md** - Resumen de implementación

---

## ❓ FAQ

**P: ¿Funciona offline?**
A: Sí, con Service Worker. Precachea la app, IndexedDB guarda audios.

**P: ¿Cuántos archivos puedo cargar?**
A: Hasta ~500MB (o límite del navegador). Ver dev tools.

**P: ¿Qué formatos soporta?**
A: MP3, WAV, OGG, MP4/M4A, AAC, FLAC, WebM

**P: ¿Los archivos se suben a servidor?**
A: No. Todo se almacena localmente en IndexedDB.

**P: ¿Funciona en iOS?**
A: Sí. Instala como app nativa desde Safari.

---

## 🎬 Próximos Pasos

1. Cargar algunos MP3 para probar
2. Instalar la app en móvil
3. Explorar DevTools para ver IndexedDB
4. Personalizar colores en `src/app.css`
5. Deploy a Vercel/Netlify

---

**¡A disfrutar! 🎵**
