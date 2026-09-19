import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, ExternalLink, RefreshCw, ShieldCheck, XCircle } from 'lucide-react';
import { growthApprovalApi, type GrowthApproval } from '../api/approvals';
import { getFriendlyErrorMessage, getTechnicalErrorDetails } from '../api/client';
import { providerControlApi, type ProviderLaunchReadiness } from '../api/providers';
import { onboardingApi } from '../api/onboarding';
import { formatLiveDate } from '../api/live-panel-ui';
import { useTranslation } from '../i18n/GlobalLanguageSwitcher';

function statusTone(status: string) {
  if (status === 'READY' || status === 'approved') return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
  if (status === 'PENDING' || status === 'pending') return 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300';
  if (status === 'BLOCKED' || status === 'rejected' || status === 'expired') return 'border-destructive/20 bg-destructive/10 text-destructive';
  return 'border-border bg-background/60 text-foreground';
}

function readableProvider(providerKey: string) {
  return providerKey.replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

function oauthProviderFor(providerKey: string) {
  const normalized = providerKey.toLowerCase();
  if (normalized.startsWith('google_')) return 'google';
  if (['meta', 'facebook', 'instagram'].includes(normalized)) return 'meta';
  if (['linkedin', 'tiktok_ads', 'salesforce', 'hubspot', 'pipedrive'].includes(normalized)) return normalized;
  return null;
}

export function GrowthGovernancePanel({ workspaceId }: { workspaceId: string | null }) {
  const t = useTranslation();
  const [approvals, setApprovals] = useState<GrowthApproval[]>([]);
  const [readiness, setReadiness] = useState<ProviderLaunchReadiness | null>(null);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);
  const [providerAction, setProviderAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [technicalDetails, setTechnicalDetails] = useState<string | null>(null);
  const [noteById, setNoteById] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    setError(null);
    setTechnicalDetails(null);
    try {
      const [approvalResponse, readinessResponse] = await Promise.all([
        growthApprovalApi.list(workspaceId),
        providerControlApi.launchReadiness(workspaceId),
      ]);
      setApprovals(approvalResponse.data);
      setReadiness(readinessResponse.data);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t('Governance status could not be loaded.')));
      setTechnicalDetails(getTechnicalErrorDetails(cause));
    } finally {
      setLoading(false);
    }
  }, [t, workspaceId]);

  useEffect(() => { void load(); }, [load]);

  async function decide(approval: GrowthApproval, decision: 'approve' | 'reject') {
    if (!workspaceId || actingId) return;
    setActingId(approval.id);
    setError(null);
    setTechnicalDetails(null);
    try {
      await growthApprovalApi.decide(workspaceId, approval.id, decision, noteById[approval.id]);
      setApprovals((current) => current.filter((entry) => entry.id !== approval.id));
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t('The approval decision could not be saved.')));
      setTechnicalDetails(getTechnicalErrorDetails(cause));
    } finally {
      setActingId(null);
    }
  }

  async function connectProvider(providerKey: string) {
    if (!workspaceId || providerAction) return;
    const oauthProvider = oauthProviderFor(providerKey);
    if (!oauthProvider) return;
    setProviderAction(`connect:${providerKey}`);
    setError(null);
    setTechnicalDetails(null);
    try {
      const response = await onboardingApi.startOAuth(workspaceId, oauthProvider, undefined, `${window.location.pathname}${window.location.search}`);
      window.location.assign(response.data.authorizationUrl);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t('The provider connection could not be started.')));
      setTechnicalDetails(getTechnicalErrorDetails(cause));
      setProviderAction(null);
    }
  }

  async function verifyProvider(connectionId: string) {
    if (!workspaceId || providerAction) return;
    setProviderAction(`verify:${connectionId}`);
    setError(null);
    setTechnicalDetails(null);
    try {
      await providerControlApi.verify(workspaceId, connectionId);
      await load();
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t('The provider verification could not be completed.')));
      setTechnicalDetails(getTechnicalErrorDetails(cause));
    } finally {
      setProviderAction(null);
    }
  }

  async function syncProvider(connectionId: string) {
    if (!workspaceId || providerAction) return;
    setProviderAction(`sync:${connectionId}`);
    setError(null);
    setTechnicalDetails(null);
    try {
      await providerControlApi.sync(workspaceId, connectionId);
      await load();
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t('The provider sync could not be started.')));
      setTechnicalDetails(getTechnicalErrorDetails(cause));
    } finally {
      setProviderAction(null);
    }
  }

  if (!workspaceId) return null;
  const blockedProviders = readiness?.connections.filter((connection) => !connection.ready) ?? [];

  return (
    <section className="mt-5 rounded-xl border border-border bg-card p-4 sm:p-5" aria-label={t('Growth governance')}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={17} className="text-primary" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">{t('Governance and integrations')}</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t('External, financial and publishing actions stay blocked until the exact scope is authorized and the required integration is ready.')}</p>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary disabled:opacity-60">
          <RefreshCw size={13} className={loading ? 'animate-spin' : undefined} aria-hidden="true" /> {t('Refresh status')}
        </button>
      </div>

      {error ? <div role="alert" className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"><AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" /><div><p>{error}</p>{technicalDetails ? <details className="mt-1 text-xs"><summary className="cursor-pointer">{t('Technical details')}</summary><p className="mt-1 break-words font-mono">{technicalDetails}</p></details> : null}</div></div> : null}

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="rounded-lg border border-border bg-background/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">{t('Approval inbox')}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t('Pending decisions are tenant-scoped and tied to one exact action payload.')}</p>
            </div>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone(approvals.length ? 'PENDING' : 'READY')}`}>{approvals.length} {t('pending')}</span>
          </div>
          <div className="mt-3 space-y-3">
            {approvals.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">{loading ? t('Loading pending approvals…') : t('No pending growth approvals.')}</p>
            ) : approvals.map((approval) => (
              <article key={approval.id} className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-foreground">{approval.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{approval.description || t('No additional action description was provided.')}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 px-2 py-1 text-[11px] text-amber-700 dark:text-amber-300"><Clock3 size={12} /> {t('Pending')}</span>
                </div>
                <div className="mt-3 grid gap-1 text-[11px] text-muted-foreground sm:grid-cols-2">
                  <span>{t('Action')}: {approval.actionType}</span>
                  <span>{t('Created')}: {formatLiveDate(approval.createdAt)}</span>
                  <span>{t('Expires')}: {approval.expiresAt ? formatLiveDate(approval.expiresAt) : '—'}</span>
                  <span>{t('Target')}: {approval.entityType || '—'}{approval.entityId ? ` · ${approval.entityId.slice(0, 8)}` : ''}</span>
                </div>
                <label className="mt-3 block">
                  <span className="sr-only">{t('Decision note')}</span>
                  <input value={noteById[approval.id] ?? ''} onChange={(event) => setNoteById((current) => ({ ...current, [approval.id]: event.target.value }))} placeholder={t('Optional decision note')} className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground outline-none ring-primary/30 placeholder:text-muted-foreground focus:ring-2" />
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => void decide(approval, 'approve')} disabled={actingId !== null} className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"><CheckCircle2 size={13} /> {t('Approve and queue')}</button>
                  <button type="button" onClick={() => void decide(approval, 'reject')} disabled={actingId !== null} className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/5 disabled:opacity-60"><XCircle size={13} /> {t('Reject')}</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-background/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">{t('Provider readiness')}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t('Unverified and unavailable providers remain blocked; no live capability is implied.')}</p>
            </div>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone(readiness?.overallReady ? 'READY' : blockedProviders.length ? 'BLOCKED' : 'PENDING')}`}>{readiness?.overallReady ? t('Ready') : blockedProviders.length ? t('Blocked') : t('Unverified')}</span>
          </div>
          <div className="mt-3 space-y-2">
            {blockedProviders.length === 0 && readiness?.connections.length ? <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-3 text-sm text-emerald-700 dark:text-emerald-300">{t('All connected provider checks currently pass.')}</p> : null}
            {blockedProviders.length === 0 && !readiness ? <p className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">{loading ? t('Checking providers…') : t('No provider readiness result is available.')}</p> : null}
            {blockedProviders.map((connection) => (
              <article key={connection.connectionId} className="rounded-lg border border-border bg-background/60 px-3 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><p className="text-sm font-medium text-foreground">{connection.displayName || readableProvider(connection.providerKey)}</p><p className="mt-1 text-xs text-muted-foreground">{connection.providerKey} · {connection.evidence.latestContractCheck}</p></div>
                  <span className={`rounded-full border px-2 py-1 text-[11px] font-medium ${statusTone(connection.status)}`}>{connection.status}</span>
                </div>
                {connection.blockers.slice(0, 3).map((blocker) => <p key={blocker.code} className="mt-2 text-xs text-muted-foreground"><strong className="text-foreground">{blocker.code}</strong> · {blocker.message}</p>)}
                <div className="mt-3 flex flex-wrap gap-2">
                  {oauthProviderFor(connection.providerKey) ? <button type="button" onClick={() => void connectProvider(connection.providerKey)} disabled={providerAction !== null} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"><ExternalLink size={12} /> {providerAction === `connect:${connection.providerKey}` ? t('Opening…') : t('Connect / reconnect')}</button> : null}
                  <button type="button" onClick={() => void verifyProvider(connection.connectionId)} disabled={providerAction !== null} className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[11px] text-foreground hover:bg-secondary disabled:opacity-60"><ShieldCheck size={12} /> {providerAction === `verify:${connection.connectionId}` ? t('Checking…') : t('Verify')}</button>
                  <button type="button" onClick={() => void syncProvider(connection.connectionId)} disabled={providerAction !== null} className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[11px] text-foreground hover:bg-secondary disabled:opacity-60"><RefreshCw size={12} className={providerAction === `sync:${connection.connectionId}` ? 'animate-spin' : undefined} /> {providerAction === `sync:${connection.connectionId}` ? t('Starting…') : t('Sync')}</button>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">{t('Granted scopes')}: {connection.evidence.authorizationState} · {connection.evidence.healthStatus}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
