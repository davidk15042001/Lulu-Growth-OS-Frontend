# Lulu AI — Complete MagicPath React Export

This project contains all **141 components** from MagicPath project `437844461893066814` as a fully routed React application.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite. The application starts at `/auth/login` and uses these route families:

- `/auth/*` — authentication flow
- `/onboarding/*` — company onboarding flow
- `/app/<generatedName>` — all product areas
- `/all-pages` — searchable route directory

Legacy `/pages/<generatedName>` URLs redirect to their canonical routes.

## Build

```bash
npm run build
npm run preview
```

## Structure

- `src/pages/<generatedName>/` — exact source snapshot for one MagicPath component
- `entries/<generatedName>/index.html` — isolated build entry for that component
- `src/pages-manifest.ts` — source metadata for all 141 pages
- `src/routing.ts` — canonical route registry and embedded-page navigation bridge
- `src/App.tsx` — application router, route directory and isolated page host

Each design runs inside its own document so its original MagicPath theme and global CSS cannot leak into other pages. Route changes are forwarded to the top-level React router, so browser history, back/forward navigation and deep links continue to work.
