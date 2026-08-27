# Optimizer Frontend

Frontend dashboard for the AI website optimization backend.

## Features

- Connect a managed site with provider, keywords, goals, and daily automation time
- Inspect SEO, GEO, AEO, technical, content, authority, and performance scores
- Review keyword, SERP, and AI-search insights
- Trigger analysis, optimization, or a full cycle from the UI
- Inspect issues, proposed actions, and run history

## Run locally

1. Copy `.env.example` to `.env`
2. Install dependencies with `npm install`
3. Start the frontend with `npm run dev -- --host 0.0.0.0`

The app expects the backend API at `VITE_API_URL` and sends `VITE_API_TOKEN`, `VITE_WORKSPACE_ID`, and `VITE_USER_ID` with every request.
