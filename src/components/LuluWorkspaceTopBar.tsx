import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { workspaceAppApi, type ContentRefreshJob } from '../api/workspace-app';
import { ApiError } from '../api/client';
import { getSelectedWorkspaceId } from '../api/session';
import { useTranslation } from '../i18n/GlobalLanguageSwitcher';
import { clearRuntimeSnapshotCache } from './useLuluAgentRuntime';
import { emitWorkspaceRefreshed } from './workspace-refresh-events';

const ACTIVE_JOB_KEY = 'lulu.workspace.content-refresh';
const ACTIVE_JOB_STALE_MS = 2 * 60 * 1000;

const PHASE_LABELS: Record<string, string> = {
  website: 'Website',
  seo: 'SEO',
  marketing: 'Marketing',
  advertisement: 'Advertising',
  email: 'Email',
  analytics: 'Analytics',
  competitors: 'Competitors',
  knowledge: 'Knowledge',
  modules: 'Starting',
  completed: 'Completed',
  failed: 'Failed',
};

type ModuleStatusEntry = {
  module: string;
  status: string;
  goal?: string;
  error?: string | null;
  runId?: string | null;
};

function clearStoredJob() {
  try {
    window.localStorage.removeItem(ACTIVE_JOB_KEY);
  } catch {
    // Ignore storage restrictions so the button can still recover.
  }
}

function getJobLastSeenAt(job: ContentRefreshJob | null) {
  if (!job?.updatedAt) return null;
  const updatedAt = Date.parse(job.updatedAt);
  return Number.isFinite(updatedAt) ? updatedAt : null;
}

function isStale(job: ContentRefreshJob | null) {
  if (!job || isDone(job)) return false;
  const lastSeenAt = getJobLastSeenAt(job);
  return lastSeenAt !== null && Date.now() - lastSeenAt > ACTIVE_JOB_STALE_MS;
}

function readStoredJob(workspaceId?: string | null): ContentRefreshJob | null {
  try {
    const raw = window.localStorage.getItem(ACTIVE_JOB_KEY);
    const job = raw ? JSON.parse(raw) as ContentRefreshJob : null;
    if (!job) return null;
    if ((workspaceId && job.workspaceId !== workspaceId) || isStale(job)) {
      clearStoredJob();
      return null;
    }
    return job;
  } catch {
    return null;
  }
}

function isDone(job: ContentRefreshJob | null) {
  return !job || ['completed', 'failed', 'cancelled'].includes(job.status);
}

function readModuleStatuses(job: ContentRefreshJob | null): ModuleStatusEntry[] {
  if (!job?.moduleStatus || typeof job.moduleStatus !== 'object') return [];
  return Object.entries(job.moduleStatus).map(([module, value]) => {
    const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
    return {
      module,
      status: typeof record.status === 'string' ? record.status : 'queued',
      goal: typeof record.goal === 'string' ? record.goal : undefined,
      error: typeof record.error === 'string' ? record.error : null,
      runId: typeof record.runId === 'string' ? record.runId : null,
    };
  });
}

function moduleStatusLabel(status: string) {
  if (status === 'completed') return 'Completed';
  if (status === 'running') return 'Running';
  if (status === 'failed') return 'Failed';
  if (status === 'waiting_approval') return 'Waiting for approval';
  if (status === 'cancelled') return 'Cancelled';
  return 'Queued';
}

function moduleStatusTone(status: string) {
  if (status === 'completed') return 'text-emerald-300';
  if (status === 'running') return 'text-sky-300';
  if (status === 'failed') return 'text-rose-300';
  if (status === 'waiting_approval') return 'text-amber-300';
  return 'text-slate-300';
}

export function LuluWorkspaceRefreshButton() {
  const t = useTranslation();
  const workspaceId = getSelectedWorkspaceId();
  const [job, setJob] = useState<ContentRefreshJob | null>(() => readStoredJob(workspaceId));
  const [error, setError] = useState<string | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const running = Boolean(job && !isDone(job) && !isStale(job));
  const phaseLabel = job?.currentPhase ? (PHASE_LABELS[job.currentPhase] ?? job.currentPhase) : t('starting');
  const moduleStatuses = readModuleStatuses(job);

  useEffect(() => {
    setJob(readStoredJob(workspaceId));
  }, [workspaceId]);

  useEffect(() => {
    if (running) setShowStatusDialog(true);
  }, [running]);

  useEffect(() => {
    if (!workspaceId || !job || isDone(job)) return;
    if (isStale(job)) {
      clearStoredJob();
      setJob(null);
      return;
    }
    let stopped = false;
    const poll = async () => {
      try {
        // #region debug-point B:topbar-poll-start
        fetch("http://127.0.0.1:7777/event", { method: "POST", body: JSON.stringify({ sessionId: "update-button-broken", runId: "pre-fix", hypothesisId: "B", location: "src/components/LuluWorkspaceTopBar.tsx:poll:start", msg: "[DEBUG] Topbar polling refresh status", data: { workspaceId, jobId: job.id, cachedStatus: job.status }, ts: Date.now() }) }).catch(() => {});
        // #endregion
        const response = await workspaceAppApi.contentRefreshStatus(workspaceId, job.id);
        if (stopped) return;
        if (isStale(response.data)) {
          clearStoredJob();
          setJob(null);
          return;
        }
        setJob(response.data);
        window.localStorage.setItem(ACTIVE_JOB_KEY, JSON.stringify(response.data));
        // #region debug-point B:topbar-poll-response
        fetch("http://127.0.0.1:7777/event", { method: "POST", body: JSON.stringify({ sessionId: "update-button-broken", runId: "pre-fix", hypothesisId: "B", location: "src/components/LuluWorkspaceTopBar.tsx:poll:response", msg: "[DEBUG] Topbar received refresh status", data: { workspaceId, jobId: response.data.id, status: response.data.status, phase: response.data.currentPhase, progress: response.data.progress, errorMessage: response.data.errorMessage }, ts: Date.now() }) }).catch(() => {});
        // #endregion
        if (isDone(response.data)) {
          clearStoredJob();
          if (response.data.status === 'completed') {
            clearRuntimeSnapshotCache(workspaceId);
            // #region debug-point C:topbar-emit-refresh
            fetch("http://127.0.0.1:7777/event", { method: "POST", body: JSON.stringify({ sessionId: "update-button-broken", runId: "pre-fix", hypothesisId: "C", location: "src/components/LuluWorkspaceTopBar.tsx:poll:completed", msg: "[DEBUG] Topbar completed refresh and emits page reload", data: { workspaceId, jobId: response.data.id }, ts: Date.now() }) }).catch(() => {});
            // #endregion
            emitWorkspaceRefreshed(workspaceId, 'topbar-update');
          }
        }
      } catch (cause) {
        // #region debug-point B:topbar-poll-error
        fetch("http://127.0.0.1:7777/event", { method: "POST", body: JSON.stringify({ sessionId: "update-button-broken", runId: "pre-fix", hypothesisId: "B", location: "src/components/LuluWorkspaceTopBar.tsx:poll:error", msg: "[DEBUG] Topbar failed to poll refresh status", data: { workspaceId, jobId: job.id, message: cause instanceof Error ? cause.message : String(cause) }, ts: Date.now() }) }).catch(() => {});
        // #endregion
        if (stopped) return;
        if (cause instanceof ApiError && cause.status === 404) {
          clearStoredJob();
          setJob(null);
          setError(null);
          return;
        }
        setError(cause instanceof ApiError ? cause.message : t('Workspace update status unavailable'));
      }
    };
    void poll();
    const timer = window.setInterval(() => void poll(), 2000);
    return () => { stopped = true; window.clearInterval(timer); };
  }, [workspaceId, job?.id, job?.status, t]);

  async function refreshWorkspace() {
    if (!workspaceId || running) return;
    if (job && isStale(job)) {
      clearStoredJob();
      setJob(null);
    }
    setError(null);
    try {
      // #region debug-point A:topbar-start-request
      fetch("http://127.0.0.1:7777/event", { method: "POST", body: JSON.stringify({ sessionId: "update-button-broken", runId: "pre-fix", hypothesisId: "A", location: "src/components/LuluWorkspaceTopBar.tsx:refresh:start", msg: "[DEBUG] Topbar starts workspace refresh", data: { workspaceId, running }, ts: Date.now() }) }).catch(() => {});
      // #endregion
      const response = await workspaceAppApi.startContentRefresh(workspaceId);
      setJob(response.data.job);
      window.localStorage.setItem(ACTIVE_JOB_KEY, JSON.stringify(response.data.job));
      setShowStatusDialog(true);
      // #region debug-point A:topbar-start-response
      fetch("http://127.0.0.1:7777/event", { method: "POST", body: JSON.stringify({ sessionId: "update-button-broken", runId: "pre-fix", hypothesisId: "A", location: "src/components/LuluWorkspaceTopBar.tsx:refresh:response", msg: "[DEBUG] Topbar received workspace refresh job", data: { workspaceId, jobId: response.data.job.id, status: response.data.job.status, reused: response.data.reused, modules: response.data.job.modules }, ts: Date.now() }) }).catch(() => {});
      // #endregion
    } catch (cause) {
      // #region debug-point A:topbar-start-error
      fetch("http://127.0.0.1:7777/event", { method: "POST", body: JSON.stringify({ sessionId: "update-button-broken", runId: "pre-fix", hypothesisId: "A", location: "src/components/LuluWorkspaceTopBar.tsx:refresh:error", msg: "[DEBUG] Topbar failed to start workspace refresh", data: { workspaceId, message: cause instanceof Error ? cause.message : String(cause) }, ts: Date.now() }) }).catch(() => {});
      // #endregion
      setError(cause instanceof ApiError ? cause.message : t('Workspace update could not be started'));
    }
  }

  const statusText = running
    ? `${t('Updating workspace')} · ${phaseLabel} · ${job?.progress ?? 0}%`
    : job?.status === 'completed'
      ? t('Workspace updated')
      : error ?? t('Update workspace');

  return (
    <>
      <button
        type="button"
        className="lulu-auth-search-refresh"
        onClick={() => void refreshWorkspace()}
        disabled={!workspaceId || running}
        aria-label={running ? t('Workspace update in progress') : t('Update entire workspace')}
        title={running ? statusText : `${t('Update workspace')} · ${t('Refreshes all pages and AI drafts')}`}
      >
        <RefreshCw aria-hidden="true" size={17} className={running ? 'animate-spin' : undefined} />
        <span className="lulu-auth-search-refresh__label">{running ? `${job?.progress ?? 0}%` : t('Update')}</span>
      </button>
      {showStatusDialog && job ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-5 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Workspace update</p>
                <h2 className="mt-1 text-lg font-semibold">{running ? `${job.progress}%` : phaseLabel}</h2>
                <p className="mt-1 text-sm text-slate-300">
                  {running ? `Currently updating ${phaseLabel}.` : job.status === 'completed' ? 'Workspace update completed.' : job.errorMessage ?? statusText}
                </p>
              </div>
              <button
                type="button"
                className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/5"
                onClick={() => setShowStatusDialog(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-sky-400 transition-all"
                style={{ width: `${Math.max(4, Math.min(job.progress || 0, 100))}%` }}
              />
            </div>
            <div className="mt-4 space-y-2">
              {moduleStatuses.length ? moduleStatuses.map((entry) => (
                <div key={entry.module} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium capitalize">{PHASE_LABELS[entry.module] ?? entry.module}</span>
                    <span className={`text-xs ${moduleStatusTone(entry.status)}`}>{moduleStatusLabel(entry.status)}</span>
                  </div>
                  {entry.error ? <p className="mt-1 text-xs text-rose-200">{entry.error}</p> : null}
                </div>
              )) : (
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                  Preparing module status...
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
