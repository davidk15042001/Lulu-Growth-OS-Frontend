# Debug Session: google-business-broken
- **Status**: [OPEN]
- **Issue**: The newly shipped Google Business flows do not work as expected in production.
- **Debug Server**: not started yet
- **Log File**: .dbg/trae-debug-log-google-business-broken.ndjson

## Reproduction Steps
1. Open the Google Business sidebar section in the live app.
2. Open `Connection Setup` and `Integrations`.
3. Verify whether the pages load the expected Google Business UI and whether the actions work.

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | The `Connection Setup` navigation points to the wrong route, so the new page is never reached correctly. | High | Low | Pending |
| B | The live frontend bundle is stale or partially deployed, so the new Google Business UI is not the one currently executing. | Medium | Low | Pending |
| C | The new frontend pages render, but the runtime context or API response shape breaks them silently. | High | Low | Pending |
| D | The backend endpoints exist but return an error or unexpected payload in production. | Medium | Low | Pending |
| E | A runtime JS error or auth/workspace edge case prevents the new actions from working after initial render. | Medium | Medium | Pending |

## Log Evidence
- Live browser evidence:
  - `Connection Setup` in the Google Business sidebar resolves to `/onboarding/existing-platforms`, not to an app-local `/app/...` route.
  - Direct navigation to `/app/fresh-tide-9404` previously produced `Page not found`.
  - `glad-coast-1428` renders the old large Integrations page in the main content area while a live panel is mounted separately.
  - `LiveApiPanel` still routes `contract.kind === "integrations"` to the generic `IntegrationsPanel`, not the new Google Business panel.
- Health evidence:
  - Public `/api/v1/health` and `/api/v1/ready` both return success in production.

## Verification Conclusion
- Hypothesis A: Confirmed. `fresh-tide-9404` is still mapped to `routes.onboarding.existingPlatforms` and treated as onboarding.
- Hypothesis B: Rejected. The live bundle contains the latest Google Business page titles and code paths.
- Hypothesis C: Confirmed. The page runtime and live panel runtime are not aligned for `glad-coast-1428`.
- Hypothesis D: Rejected. Backend health and readiness are healthy; this is not the primary failure.
- Hypothesis E: Inconclusive. No blocking frontend runtime exception was observed on the Google Business pages themselves.

## Applied Local Fix
- Removed the canonical onboarding mapping for `fresh-tide-9404` so the page resolves as an app page instead of `/onboarding/existing-platforms`.
- Reclassified `fresh-tide-9404` as `kind: "integrations"` so the runtime mounts the workspace integration surface.
- Routed `LiveApiPanel` integrations to `GoogleBusinessIntegrationsPanel` instead of the generic integrations panel.
- Suppressed the legacy generated `glad-coast-1428` content inside workspace context so the old page no longer renders behind the live panel.

## Local Validation
- `npm run build` ✅
- `npm run typecheck` ✅
- `npm run audit:routing` ✅
- `npm run audit:api` ✅
- Pending: push and deploy the validated frontend fix, then verify production behavior again.
