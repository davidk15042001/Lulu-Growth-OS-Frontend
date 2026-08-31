# Debug Session: update-button-broken
- **Status**: [OPEN]
- **Issue**: The workspace update button appears to do nothing instead of reliably triggering a full workspace refresh and updating the currently open page.
- **Debug Server**: Pending startup
- **Log File**: .dbg/trae-debug-log-update-button-broken.ndjson

## Reproduction Steps
1. Open any authenticated workspace page with the top navigation visible.
2. Click the `Update` button in the top bar.
3. Observe whether the button starts a refresh job, shows progress, and reloads the current page data when the job completes.

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | The topbar button never starts the refresh request because `workspaceId` is missing or the request path fails immediately. | High | Low | Pending |
| B | The refresh job starts, but polling never reaches a terminal `completed` state, so no reload event is emitted. | High | Low | Pending |
| C | The reload event is emitted, but the page shell does not receive it, so the current page never remounts. | Medium | Low | Pending |
| D | The backend content-refresh job fails on one of the newly added modules (`competitors` or `knowledge`) and the UI only looks idle. | Medium | Medium | Pending |
| E | The page remount happens, but the shared runtime cache or page-specific state still serves stale data, making the update look ineffective. | Medium | Medium | Pending |

## Log Evidence
- Runtime reproduction showed the topbar button does issue `POST /content-refresh` and subsequent `GET /content-refresh/:jobId` requests, so hypothesis A ("button does nothing") is rejected.
- First confirmed backend failure: `null value in column "plan" of relation "agent_runs" violates not-null constraint`.
- Second confirmed backend failure after fixing `plan`: `invalid input syntax for type uuid: "system"`.
- Latest confirmed frontend blocker: a stale locally stored refresh job kept the topbar disabled at `88%`, so no fresh `POST /content-refresh` could be triggered even after backend fixes were deployed.
- Frontend mitigation now clears stale or cross-workspace cached jobs, and also releases the button when the status endpoint returns `404`.
- Fresh post-fix evidence shows the new refresh job does advance server-side:
  - job `d0b918ca-5880-4c28-81f8-ed5bf316cd6f` moved from `website / 0%` to `seo / 13%` and then `marketing / 25%`.
  - therefore the remaining user-visible `0%` symptom is a frontend polling/display issue, not a stuck backend refresh.
- Automatic refresh runs no longer stop at approval-gated executor steps; a pre-fix blocked job (`bf610724-334a-4ead-87b8-7dd2c9d476ce`) was explicitly failed after confirming it was waiting for approval.
- Frontend now polls refresh status with a cache-busting query parameter and shows a live status popup listing module progress.

## Verification Conclusion
- Confirmed root causes so far:
  1. Backend `agent_runs.plan` insert allowed `null` for a not-null column.
  2. Automatic runs passed `"system"` into UUID-sensitive paths.
  3. Frontend topbar reused a stale `ACTIVE_JOB_KEY` entry indefinitely, which kept the update button disabled.
  4. Frontend refresh-status polling could appear frozen because cached `GET /content-refresh/:jobId` responses masked live progress.
- Current status:
  - Backend fixes are deployed.
  - Frontend stale-job recovery, cache-busting status polling, and live status popup are implemented in `src/components/LuluWorkspaceTopBar.tsx`.
  - Frontend build passed and the live site now serves bundle `/assets/index-CLmuX6OR.js`.
  - Final live user verification of a fresh update run is still required before cleanup.
