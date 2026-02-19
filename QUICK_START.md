# Quick Start Guide

## Instalación Rápida

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Iniciar servidor de desarrollo
```bash
pnpm run dev
```
La aplicación estará disponible en `http://localhost:5173`

## Características principales

### Subir música
1. Haz clic en **"Add Files"** para seleccionar archivos de audio individuales
2. O haz clic en **"Add Folder"** para subir una carpeta completa
3. La aplicación extraerá automáticamente:
   - Título, artista y álbum
   - Carátula del álbum
   - Duración de la canción

### Reproducir música
- **Play/Pause**: Botón grande rojo en el centro
- **Anterior/Siguiente**: Botones de salto a los lados
- **Volumen**: Control deslizable en la parte inferior
- **Repetición**: Modo off/all/one (cambia con cada clic)
- **Shuffle**: Activa/desactiva reproducción aleatoria

### Gestos
- Toca la carátula para reproducir/pausar (en mobile)
- Desliza sobre la barra de progreso para buscar

## Formatos soportados

✓ MP3, MP4/M4A, WAV, OGG, WebM, FLAC, AAC

## Instalación como app

### En Android
1. Abre la app en Chrome
2. Toca el menú (⋮) → "Instalar aplicación"

### En iOS/iPad
1. Abre la app en Safari
2. Toca Compartir → "Añadir a la pantalla de inicio"

## Almacenamiento

- Los archivos se guardan localmente usando **IndexedDB**
- Capacidad: hasta **500MB** por navegador
- **Completamente privado** - nada se envía a servidores
- Funciona completamente **sin conexión**

## Compilar para producción

```bash
# Build optimizado
pnpm run build

# Previsualizar build
pnpm run preview
```

La carpeta `build/` contiene la app lista para desplegar en hosting estático (Vercel, Netlify, GitHub Pages).

## Troubleshooting

**Q: ¿Por qué no aparecen mis archivos?**
A: Asegúrate de que el formato es compatible (MP3, OGG, WAV, etc.)

**Q: ¿Se pierden los archivos si recargo la página?**
A: No, se guardan en IndexedDB del navegador. Persisten entre sesiones.

**Q: ¿Cómo acceso los files sin conexión?**
A: Una vez cargados, funcionan sin internet gracias al Service Worker.

**Q: ¿Hay límite de canciones?**
A: Hasta llenar el límite de almacenamiento (500MB por defecto).

## Desarrollo

### Agregar un componente nuevo
```bash
# Crear en src/lib/components/MiComponente.svelte
```

### Modificar estilos
- Global: `src/app.css` (tokens de diseño)
- Componentes: inline `<style>` en cada `.svelte`

### Depuración
```bash
pnpm run check       # Validar TypeScript
pnpm run format      # Formatear código
pnpm run lint        # Verificar linting
```

## Próximos pasos

1. Carga tus canciones favoritas
2. Crea una playlist
3. ¡Disfruta la música offline!
4. Personaliza los colores en `src/app.css` si deseas

---

Para más detalles, consulta el [README completo](./README.md)
