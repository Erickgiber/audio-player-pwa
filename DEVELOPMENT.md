# Guía de Desarrollo - Music Player PWA

Para contribuidores y desarrolladores que quieren mejorar la aplicación.

## 🛠️ Setup de Desarrollo

### Requisitos
- Node.js 18+ (recomendado 20+)
- pnpm 8+ (instalarlo con `npm install -g pnpm`)
- Git
- Editor de código (VS Code recomendado)

### Instalación Inicial

```bash
# Clonar repositorio
git clone <repo-url>
cd music-player-pwa

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm run dev

# Abrir http://localhost:5173
```

### VS Code Extensions Recomendadas

```json
{
  "recommendations": [
    "svelte.svelte-vscode",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "firsttris.vscode-jest-runner"
  ]
}
```

## 📁 Estructura de Carpetas

```
src/
├── routes/                 # SvelteKit routes
│   ├── +layout.ts         # Layout server
│   ├── +layout.svelte     # Layout root
│   └── +page.svelte       # Home page
│
├── lib/                   # Código reutilizable
│   ├── components/        # Componentes Svelte
│   │   ├── Player.svelte       # Main player
│   │   ├── Playlist.svelte     # Playlist view
│   │   ├── Uploader.svelte     # File upload
│   │   └── Visualizer.svelte   # Audio visualizer
│   │
│   ├── stores/            # Svelte stores
│   │   ├── audioStore.ts       # Audio state
│   │   ├── playerStore.ts      # Player state
│   │   └── dbStore.ts          # Database state
│   │
│   ├── utils/             # Utility functions
│   │   ├── audioDb.ts          # IndexedDB operations
│   │   ├── audioProcessor.ts   # Web Audio API
│   │   ├── metadataExtractor.ts # ID3 tags
│   │   └── fileHandler.ts      # File processing
│   │
│   └── types/             # TypeScript types
│       └── audio.ts       # Audio interfaces
│
├── app.html               # HTML template
├── app.css                # Global styles
└── sw.ts                  # Service Worker

static/                    # Static assets
├── manifest.json          # PWA manifest
├── favicon.svg            # Favicon
├── icon-192x192.png       # PWA icon
└── icon-512x512.png       # PWA icon

{svelte,vite,tailwind}.config.ts  # Configs
```

## 🎯 Conceptos Principales

### Svelte Stores

Para estado global reactivo:

```typescript
// src/lib/stores/myStore.ts
import { writable } from 'svelte/store';

function createMyStore() {
  const { subscribe, set, update } = writable({
    value: 0
  });

  return {
    subscribe,
    increment: () => update(state => ({
      ...state,
      value: state.value + 1
    }))
  };
}

export const myStore = createMyStore();
```

Usar en componentes:

```svelte
<script>
  import { myStore } from '$stores/myStore';
</script>

<p>Value: {$myStore.value}</p>
<button on:click={() => myStore.increment()}>+</button>
```

### IndexedDB con Dexie

Para almacenamiento local persistente:

```typescript
// src/lib/utils/audioDb.ts
import { db } from './audioDb';

// Guardar
await db.audios.add({
  id: '1',
  title: 'Song',
  artist: 'Artist',
  blob: audioBlob
});

// Cargar
const audios = await db.audios.toArray();

// Buscar
const results = await db.audios
  .where('artist')
  .startsWith('The')
  .toArray();

// Eliminar
await db.audios.delete('1');
```

### Web Audio API

Para reproducción eficiente:

```typescript
// src/lib/utils/audioProcessor.ts
const context = new AudioContext();
const source = context.createMediaElementAudioSource(audioElement);
const analyser = context.createAnalyser();

source.connect(analyser);
analyser.connect(context.destination);
```

## 🧩 Agregar Nuevas Funciones

### Ejemplo: Agregar Búsqueda

1. **Actualizar Store**

```typescript
// src/lib/stores/audioStore.ts
export const searchQuery = writable('');
export const filteredAudios = derived(
  [audioStore, searchQuery],
  ([$audioStore, $query]) => {
    if (!$query) return $audioStore.audios;
    return $audioStore.audios.filter(a =>
      a.title.toLowerCase().includes($query.toLowerCase())
    );
  }
);
```

2. **Crear Componente**

```svelte
<!-- src/lib/components/SearchBox.svelte -->
<script>
  import { searchQuery } from '$stores/audioStore';
</script>

<input
  type="text"
  placeholder="Buscar..."
  value={$searchQuery}
  on:input={e => $searchQuery = e.target.value}
/>
```

3. **Usar en Página**

```svelte
<!-- src/routes/+page.svelte -->
<script>
  import SearchBox from '$components/SearchBox.svelte';
  import { filteredAudios } from '$stores/audioStore';
</script>

<SearchBox />
<Playlist audios={$filteredAudios} />
```

## 🎨 Estilo y Animaciones

### Tailwind CSS

Usar utilidades en componentes:

```svelte
<div class="flex items-center justify-center gap-4 p-4 bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
  Contenido
</div>
```

### Animaciones Personalizadas

En `src/app.css`:

```css
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
```

## 🧪 Testing (Futuro)

Estructura para Vitest:

```typescript
// src/lib/utils/__tests__/metadataExtractor.test.ts
import { describe, it, expect } from 'vitest';
import { formatDuration } from '../metadataExtractor';

describe('metadataExtractor', () => {
  it('should format duration correctly', () => {
    expect(formatDuration(125)).toBe('2:05');
  });
});
```

Ejecutar:
```bash
pnpm test
pnpm test --watch
```

## 🐛 Debugging

### Console Logs

Usar prefix `[v0]` para identificar logs:

```typescript
console.log('[v0] Loading audio:', audioId);
console.warn('[v0] Storage limit reached');
console.error('[v0] Failed to load metadata');
```

### DevTools

1. **Breakpoints**: Click en línea de código (F12)
2. **Watch expressions**: Agregar variables a watch
3. **Debugger statement**: Pausar ejecución
4. **Network**: Monitorear requests
5. **Performance**: Profiling de performance

### Error Handling

```typescript
try {
  await operation();
} catch (error) {
  console.error('[v0] Operation failed:', error);
  // Notificar al usuario
}
```

## 📦 Gestionar Dependencias

### Agregar Paquete

```bash
pnpm add package-name
pnpm add -D dev-package-name  # Dev dependency
```

### Actualizar

```bash
pnpm update              # Actualizar según semver
pnpm update --interactive # Selector interactivo
```

### Limpiar

```bash
pnpm prune              # Remover no-usadas
pnpm store prune        # Limpiar cache local
```

## 🚀 Build & Deployment

### Build Local

```bash
pnpm run build
pnpm run preview
```

### Check TypeScript

```bash
pnpm run check          # Una sola vez
pnpm run check:watch   # Watch mode
```

## 🔄 Git Workflow

```bash
# Feature branch
git checkout -b feature/my-feature

# Hacer cambios
git add .
git commit -m "Add my feature"

# Push
git push origin feature/my-feature

# Pull request en GitHub
# Merge after review
```

### Commit Message Format

```
type(scope): subject

body

footer
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`

Ejemplo:
```
feat(player): add equalizer control

Add a 10-band equalizer to the player UI.
Supports preset configurations.

Closes #123
```

## 📚 Recursos

### Documentación Oficial
- [SvelteKit Docs](https://kit.svelte.dev)
- [Svelte Docs](https://svelte.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

### Librerías Usadas
- [Dexie.js Docs](https://dexie.org)
- [jsmediatags Docs](https://github.com/jsmediatags/jsmediatags)
- [Lucide Icons](https://lucide.dev)

## ✅ Checklist para PR

Antes de hacer un pull request:

- [ ] Code sigue convenciones del proyecto
- [ ] No hay `console.log` sin prefix `[v0]`
- [ ] TypeScript compila sin errores (`pnpm run check`)
- [ ] Svelte components son eficientes
- [ ] Animations suave (60 FPS)
- [ ] Mobile responsive
- [ ] Offline sigue funcionando
- [ ] Service Worker actualizado si aplica
- [ ] Tests pasan (si aplican)
- [ ] Commit messages claros
- [ ] README actualizado si aplica

## 🎓 Best Practices

### Performance
- [ ] Usar keyed `#each` loops
- [ ] Evitar re-renders innecesarios
- [ ] Lazy load heavy components
- [ ] Minimizar API calls
- [ ] Cache en IndexedDB

### Code Quality
- [ ] TypeScript strict mode
- [ ] Nombres descriptivos
- [ ] Funciones pequeñas y reutilizables
- [ ] Comments solo donde sea necesario
- [ ] Manejo de errores robusto

### Accessibility
- [ ] Alt text para imágenes
- [ ] ARIA labels para controles
- [ ] Navegación por teclado
- [ ] Suficiente contraste
- [ ] Focus visible

---

**Happy coding! 🚀**

Para preguntas, revisar los issues en GitHub o contactar al mantainer.
