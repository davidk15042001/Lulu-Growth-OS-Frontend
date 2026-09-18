# Production smoke test

Run `npm run smoke:production` after a deployment. The check is intentionally
read-only: it performs public `GET` requests only and does not authenticate,
modify a workspace, send provider messages, or create payments.

The test verifies:

- the public release manifest contains frontend/backend revisions and a build timestamp;
- the public root, login, registration, Office and website-preview shells return HTML;
- `/api/v1/health` reports `ok`;
- `/api/v1/ready` reports `ready: true`.

Use `LULU_PRODUCTION_BASE_URL` to target another environment and
`LULU_SMOKE_TIMEOUT_MS` to adjust the per-request timeout.
