# Optimizer Backend

AI website optimization backend for SEO, GEO, and AEO analysis with a daily automation loop.

## Features

- Connect WordPress, Webflow, or Shopify sites into a managed optimization workspace
- Run analysis, optimization, or full-cycle execution per site
- Persist site state and run history in a local JSON store for fast testing
- Use DataForSEO as the primary external intelligence source when credentials are configured
- Fall back to deterministic mock intelligence when live credentials are missing
- Trigger daily automation by hour in UTC
- Expand one site into multiple country/language market packs with local language plus English

## Run locally

1. Copy `.env.example` to `.env`
2. Install dependencies with `npm install`
3. Start the backend with `npm run dev`

The API runs on `http://localhost:4100`.

## Important environment variables

- `DATAFORSEO_MOCK_MODE=true`: test the full product without live API credentials
- `DATAFORSEO_MOCK_MODE=false`: activate live DataForSEO requests
- `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD`: required for live mode
- `DATAFORSEO_PRIMARY_LANGUAGE` and `DATAFORSEO_PRIMARY_LOCATION`: legacy fallback values only; active runs now use per-market country/language pairs

## Main API routes

- `GET /api/health`
- `GET /api/options`
- `GET /api/sites`
- `POST /api/sites`
- `GET /api/sites/:siteId`
- `PATCH /api/sites/:siteId`
- `POST /api/sites/:siteId/analyze`
- `POST /api/sites/:siteId/optimize`
- `POST /api/sites/:siteId/full-cycle`
- `POST /api/scheduler/run-due`

## Default market scope

- Countries: USA, Germany, China, United Kingdom, Netherlands, Sweden, Denmark, Norway, Switzerland, Canada, Australia, United Arab Emirates, India, Pakistan, Bangladesh
- Language model: local market language plus English
