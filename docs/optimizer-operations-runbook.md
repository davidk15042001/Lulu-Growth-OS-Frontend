# Optimizer Operations Runbook

## Scope

This runbook covers the optimizer backend and frontend located in `optimizer-backend/` and `optimizer-frontend/`.

## Verification before deploy

Run these checks locally or in CI:

```bash
cd /workspace/optimizer-backend
npm ci
npm run check
npm test
npm run build

cd /workspace/optimizer-frontend
npm ci
npm run lint
npm run build
```

The repository CI workflow is stored in `.github/workflows/optimizer-enterprise-ci.yml`.

## Runtime health

- `GET /api/health`: process health and mode visibility
- `GET /api/ready`: readiness with store and queue state
- `GET /api/admin/metrics`: operational counters, latency, queue backlog and store status

## Backup operations

List backups:

```bash
curl -H "Authorization: Bearer <admin-token>" \
  http://localhost:4100/api/admin/backups
```

Create a backup:

```bash
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"reason":"pre-deploy"}' \
  http://localhost:4100/api/admin/backups
```

Restore a backup:

```bash
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  http://localhost:4100/api/admin/backups/<backup-id>/restore
```

Backups are stored in `optimizer-backend/.data/backups/`. Retention is controlled by `BACKUP_RETENTION_COUNT`.

## Restore notes

- Restore replaces the active SQLite file
- Restore also removes `-wal` and `-shm` sidecar files before replacement
- The backend reopens the database after restore automatically
- Only admin users with backup-write permission can run restores

## Queue operations

- Manual runs are accepted as queued work and processed by the worker loop
- Queue status is available through `GET /api/admin/run-queue`
- Scheduler-triggered work is available through `POST /api/scheduler/run-due`

## Shutdown behavior

- `SIGINT` and `SIGTERM` stop the scheduler
- The queue polling interval is cleared before exit
- The HTTP server closes before the SQLite connection is closed

## Incident checklist

- Check `GET /api/ready`
- Check `GET /api/admin/metrics`
- Check `GET /api/admin/run-queue`
- Create a backup before any manual recovery action
- Restore the most recent known-good backup if store corruption or invalid destructive changes are confirmed
