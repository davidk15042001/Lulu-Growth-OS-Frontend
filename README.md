# Lulu AI — Complete MagicPath React Export

This project contains all **141 components** from MagicPath project `437844461893066814` as individually routed React pages.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite. The home page lists every exported design. Each design is available at `/pages/<generatedName>` and can also be opened as an isolated standalone page from the viewer toolbar.

## Build

```bash
npm run build
npm run preview
```

## Structure

- `src/pages/<generatedName>/` — exact source snapshot for one MagicPath component
- `entries/<generatedName>/index.html` — isolated build entry for that component
- `src/pages-manifest.ts` — route metadata for all 141 pages
- `src/App.tsx` — searchable route directory and page viewer

Each design runs inside its own document so its original MagicPath theme and global CSS cannot leak into other pages.
