# Optimizer Backend

AI website optimization backend for SEO, GEO and AEO analysis with enterprise authentication, tenant isolation, queue-backed executions and SQLite persistence.

## Features

- Workspace-scoped sites, runs, users, sessions and audit events
- Permission-based access control for sites, runs, scheduler, admin and backup operations
- Login, refresh rotation, password reset, MFA/TOTP and session revocation
- Queue-backed run execution with persisted job state and worker processing
- SQLite persistence with schema migration tracking and legacy JSON import handling
- Backup and restore administration for the SQLite store
- Readiness, health and metrics endpoints for operations and deployment checks
- DataForSEO live mode with deterministic mock fallback

## Run locally

1. Create a `.env` file in `optimizer-backend/`
2. Install dependencies with `npm install`
3. Start the API with `npm run dev`

The API listens on `http://localhost:4100`.

## Important environment variables

- `PORT`: backend port, default `4100`
- `FRONTEND_ORIGIN`: allowed frontend origin for CORS
- `STORE_PATH`: SQLite database location, default `.data/store.sqlite`
- `BACKUP_DIR`: backup directory, default `.data/backups`
- `BACKUP_RETENTION_COUNT`: number of retained backups, default `10`
- `AUTH_JWT_SECRET`: JWT signing secret for access tokens
- `AUTH_TOKEN_TTL_MINUTES`: access-token TTL in minutes
- `AUTH_REFRESH_TOKEN_TTL_DAYS`: refresh-token TTL in days
- `API_RATE_LIMIT_WINDOW_MS` and `API_RATE_LIMIT_MAX_REQUESTS`: in-memory rate limiting
- `DATAFORSEO_TIMEOUT_MS`: timeout for external intelligence calls
- `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD`: required for live mode
- `DATAFORSEO_MOCK_MODE`: set to `false` to enable live mode when credentials exist

## Access model

- Protected routes require `Authorization: Bearer <token>`
- Sessions are workspace-bound and validated server-side on every request
- Request context exposes role plus derived permissions
- Demo users after bootstrap:
  - `demo-admin` in `demo-workspace`
  - `demo-editor` in `demo-workspace`
  - `demo-viewer` in `demo-workspace`
  - `second-admin` in `second-workspace`

## Operational routes

- `GET /api/health`
- `GET /api/ready`
- `GET /api/admin/metrics`
- `GET /api/admin/run-queue`
- `GET /api/admin/migrations`
- `GET /api/admin/backups`
- `POST /api/admin/backups`
- `POST /api/admin/backups/:backupId/restore`

## Verification

```bash
npm run check
npm test
npm run build
```

## Default market scope

- Countries: USA, Germany, China, United Kingdom, Netherlands, Sweden, Denmark, Norway, Switzerland, Canada, Australia, United Arab Emirates, India, Pakistan, Bangladesh
- Language strategy: local market language plus English
