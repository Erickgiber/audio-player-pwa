# Setup Guide - Music Player PWA

## Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 8+ (package manager)

## Installation

### 1. Install Dependencies

```bash
pnpm install
```

This will install all required dependencies:
- SvelteKit 2.0
- TypeScript 5.7
- Tailwind CSS 4.1
- Svelte 4.0
- Development tools (ESLint, Prettier, etc.)

### 2. Verify Installation

Check that all dependencies are installed correctly:

```bash
pnpm list
```

## Development

### Start Development Server

```bash
pnpm run dev
```

The server will start at `http://localhost:5173`

### Features Available in Dev Mode

- Hot Module Replacement (HMR) for instant code updates
- Source maps for easier debugging
- Service Worker in development mode
- Full TypeScript support with IDE integration

### Development Commands

```bash
# Check TypeScript
pnpm run check

# Format code
pnpm run format

# Lint code
pnpm run lint

# Preview production build locally
pnpm run preview
```

## Build for Production

### Build as SPA

```bash
pnpm run build
```

This creates an optimized production build in the `build/` directory:
- Minified JavaScript and CSS
- Assets optimized and hashed
- Ready for static hosting

### Build Output Structure

```
build/
├── _app/              # SvelteKit app bundle
│   ├── version.json
│   ├── chunks/        # Code-split chunks
│   ├── immutable/     # Immutable assets
│   └── styles/        # CSS bundles
├── index.html         # Main entry point
├── favicon.ico        # Website icon
├── manifest.json      # PWA manifest
└── icon-*.png         # App icons
```

## SPA Configuration

The project is configured as a **client-side only SPA**:

```typescript
// src/routes/+layout.ts
export const ssr = false;      // No server-side rendering
export const prerender = false; // Don't prerender
export const csr = true;       // Client-side rendering only
```

Service Worker is registered in `src/app.html` and handles caching automatically.

## Deployment

### Vercel

```bash
# Automatic deployment with GitHub
# Just push to your repository
git push origin main
```

Vercel will auto-detect SvelteKit and deploy the `build/` folder.

### Netlify

```bash
# Deploy the build folder
netlify deploy --prod --dir=build
```

### GitHub Pages

Configure in repository settings to deploy from `gh-pages` branch, then:

```bash
# Build and deploy
pnpm run build
# Deploy build/ to gh-pages branch
```

### Static Hosting (Any Provider)

Simply upload the contents of the `build/` folder to your static hosting provider.

## Troubleshooting

### "Cannot find base config file" Error

If you see TypeScript warnings about paths, ensure:

1. `tsconfig.json` has `"baseUrl": "."` ✓
2. All paths start with `./` (relative paths) ✓
3. Run `pnpm install` to regenerate node_modules

### Service Worker Not Registering

1. Check browser DevTools > Application > Service Workers
2. Ensure app is running on HTTPS in production (required for SW)
3. In development, SW is registered but may not cache everything
4. Check console for SW registration errors

### Styles Not Applied

1. Ensure `src/app.css` is imported in `src/routes/+layout.svelte` ✓
2. Verify Tailwind CSS custom properties are defined ✓
3. Clear browser cache with Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)

### Hot Reload Not Working

1. Check that dev server is running (`pnpm run dev`)
2. Ensure you're accessing `http://localhost:5173` (not another port)
3. Check browser console for HMR errors
4. Restart dev server if needed

## Environment Variables

No environment variables are required for basic functionality.

Optional for future features:
- Create `.env` file in project root
- Add `VITE_API_URL=` for backend API (if needed)
- Env vars must start with `VITE_` to be exposed to client

## Performance Tips

### During Development

- Use `pnpm run check` to validate TypeScript before building
- Check bundle size: `pnpm run build` shows gzipped size
- Use browser DevTools to profile performance

### For Production

- The build process automatically:
  - Minifies JavaScript and CSS
  - Creates code-split chunks
  - Optimizes images
  - Generates source maps (for error tracking)

### Monitoring

- Use Lighthouse in Chrome DevTools to audit performance
- Target: Lighthouse score 90+ for all categories
- Service Worker enables offline functionality

## Getting Help

- Check existing documentation in root folder
- Review SvelteKit docs: https://kit.svelte.dev
- Check component source code in `src/lib/components/`
- Review store implementations in `src/lib/stores/`

## Next Steps

1. Run `pnpm install` to install dependencies
2. Run `pnpm run dev` to start development
3. Open `http://localhost:5173` in your browser
4. Upload music files to test the player
5. Inspect DevTools to see Service Worker and IndexedDB

Enjoy your Music Player PWA!
