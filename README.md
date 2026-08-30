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

The frontend reads its environment from the sibling backend file `../Lulu-Growth-OS-Backend/.env`, so `VITE_API_URL` now lives in that single shared file. When frontend and backend share a domain through a reverse proxy, the default `/api/v1` works without additional configuration.

## Live backend integration

Authentication and onboarding forms call the backend directly. Every protected application page also exposes a **Live data** control without replacing the original MagicPath design. Its content follows the page contract:

- resource pages: records, search, create, edit, archive and saved views
- workspace pages: bootstrap summary, notifications, approvals, members, invitations and audit log
- special pages: metrics and points, AI conversations, billing, integrations and sync jobs

All calls use the shared authenticated client, automatic access-token refresh, the selected workspace and the `/api/v1` endpoint configured above.

## Build

```bash
npm run build
npm run preview
```

Run the complete frontend verification before deployment:

```bash
npm run check
```

This validates TypeScript, all 141 routes, the page-to-API contracts and the production build. If the backend repository is available beside this repository, the API audit also verifies every frontend resource type against the backend catalog.

The shared Lulu Intelligence logo is stored at `public/branding/lulu-intelligence-logo.png`. `GlobalBranding` replaces the former page-specific marks at runtime so authentication, onboarding and application pages always use the same asset.

## Structure

- `src/pages/<generatedName>/` — exact source snapshot for one MagicPath component
- `entries/<generatedName>/index.html` — isolated build entry for that component
- `src/pages-manifest.ts` — source metadata for all 141 pages
- `src/routing.ts` — canonical route registry and embedded-page navigation bridge
- `src/App.tsx` — application router, route directory and native page host
- `src/api/client.ts` — shared authenticated API client and legacy embedded-page token broker
- `src/api/page-contracts.ts` — API contract for every exported page
- `src/api/runtime.tsx` — authentication, workspace and bootstrap guard for isolated pages

Each design is mounted through the native page host, which injects the page-specific CSS while keeping browser history, back/forward navigation and deep links stable. Legacy embedded entry support remains for older `/entries/*` links, but production navigation uses the native React shell.

The typed API clients live in `src/api/`, while `src/api/LiveApiPanel.tsx` provides the contract-aware live backend controls for protected pages.
