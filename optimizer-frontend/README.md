# Optimizer Frontend

Frontend dashboard for the optimizer backend with enterprise login, MFA, permission-aware UI visibility and queue-backed execution feedback.

## Features

- Login, refresh rotation, password reset and MFA flows
- Site creation and multi-country market targeting
- Queue-aware run triggering with automatic refresh until completion
- Account security self-service for password, MFA and own sessions
- Permission-aware admin console for users, sessions, queue status and migrations
- Tenant-scoped SEO, GEO and AEO result views

## Run locally

1. Create a `.env` file in `optimizer-frontend/`
2. Install dependencies with `npm install`
3. Start the frontend with `npm run dev -- --host 0.0.0.0`

## Environment

- `VITE_API_URL`: backend API base URL, default `http://localhost:4100/api`

The UI uses bearer-token authentication and refresh tokens stored in the browser. Workspace and permission context comes from the backend session bootstrap, not from static frontend headers.

## Verification

```bash
npm run lint
npm run build
```
