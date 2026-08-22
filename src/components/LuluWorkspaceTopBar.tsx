import { RefreshCw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { workspaceAppApi, type ContentRefreshJob } from '../api/workspace-app';
import { ApiError } from '../api/client';
import { getSelectedWorkspaceId } from '../api/session';
import { useTranslation } from '../i18n/GlobalLanguageSwitcher';

const ACTIVE_JOB_KEY = 'lulu.workspace.content-refresh';

function readStoredJob(): ContentRefreshJob | null {
  try {
    const raw = window.localStorage.getItem(ACTIVE_JOB_KEY);
    return raw ? JSON.parse(raw) as ContentRefreshJob : null;
  } catch {
    return null;
  }
}

function isDone(job: ContentRefreshJob | null) {
  return !job || ['completed', 'failed', 'cancelled'].includes(job.status);
}

export function LuluWorkspaceTopBar() {
  const t = useTranslation();
  const [query, setQuery] = useState('');
  const [job, setJob] = useState<ContentRefreshJob | null>(() => readStoredJob());
  const [error, setError] = useState<string | null>(null);
  const workspaceId = getSelectedWorkspaceId();
  const running = Boolean(job && !isDone(job));

  useEffect(() => {
    if (!workspaceId || !job || isDone(job)) return;
    let stopped = false;
    const poll = async () => {
      try {
        const response = await workspaceAppApi.contentRefreshStatus(workspaceId, job.id);
        if (stopped) return;
        setJob(response.data);
        window.localStorage.setItem(ACTIVE_JOB_KEY, JSON.stringify(response.data));
        if (isDone(response.data)) window.localStorage.removeItem(ACTIVE_JOB_KEY);
      } catch (cause) {
        if (!stopped) setError(cause instanceof ApiError ? cause.message : t('Workspace update status unavailable'));
      }
    };
    void poll();
    const timer = window.setInterval(() => void poll(), 2000);
    return () => { stopped = true; window.clearInterval(timer); };
  }, [workspaceId, job?.id, job?.status, t]);

  async function refreshWorkspace() {
    if (!workspaceId || running) return;
    setError(null);
    try {
      const response = await workspaceAppApi.startContentRefresh(workspaceId);
      setJob(response.data.job);
      window.localStorage.setItem(ACTIVE_JOB_KEY, JSON.stringify(response.data.job));
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : t('Workspace update could not be started'));
    }
  }

  const statusText = running
    ? `${t('Updating workspace')} · ${job?.currentPhase ?? t('starting')} · ${job?.progress ?? 0}%`
    : job?.status === 'completed'
      ? t('Workspace updated')
      : error ?? '';

  return (
    <header className="lulu-workspace-topbar" data-lulu-workspace-topbar="true">
      <div className="lulu-workspace-topbar__search">
        <Search aria-hidden="true" size={16} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('Search workspace')} aria-label={t('Search workspace')} />
      </div>
      <button type="button" className="lulu-workspace-topbar__refresh" onClick={() => void refreshWorkspace()} disabled={!workspaceId || running} aria-label={running ? t('Workspace update in progress') : t('Update workspace')} title={statusText || t('Update workspace')}>
        <RefreshCw aria-hidden="true" size={16} className={running ? 'animate-spin' : undefined} />
        <span>{running ? `${job?.progress ?? 0}%` : t('Update')}</span>
      </button>
      {statusText && <span className="lulu-workspace-topbar__status" role="status" aria-live="polite">{statusText}</span>}
    </header>
  );
}
