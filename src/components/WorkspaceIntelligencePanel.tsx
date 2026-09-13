import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, Database, RefreshCw, Sparkles } from 'lucide-react';
import { agentApi, type IntelligenceBundle } from '../api/agents';
import { getFriendlyErrorMessage } from '../api/client';
import { useLanguage, useTranslation } from '../i18n/GlobalLanguageSwitcher';

type Props = {
  workspaceId: string | null;
  pageId?: string | null;
  title?: string;
  summaryBadge?: string;
};

function statusLabel(status: string, t: (key: string) => string) {
  if (status === 'verified') return t('Verified');
  if (status === 'derived') return t('Derived');
  if (status === 'forecast') return t('Forecast');
  if (status === 'not_applicable') return t('Not applicable');
  return t('Unavailable');
}

export function WorkspaceIntelligencePanel({
  workspaceId,
  pageId = null,
  title,
  summaryBadge,
}: Props) {
  const t = useTranslation();
  const language = useLanguage();
  const scopeKey = workspaceId ? `${workspaceId}:${pageId ?? 'workspace'}` : null;
  const [snapshot, setSnapshot] = useState<{ key: string; bundle: IntelligenceBundle } | null>(null);
  const [failure, setFailure] = useState<{ key: string; message: string } | null>(null);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [showAllMobileSignals, setShowAllMobileSignals] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const bundle = snapshot?.key === scopeKey ? snapshot.bundle : null;
  const error = failure?.key === scopeKey ? failure.message : null;
  const loading = loadingKey === scopeKey || Boolean(scopeKey && !bundle && !error);

  const load = useCallback(async () => {
    if (!workspaceId || !scopeKey) return;
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoadingKey(scopeKey);
    setFailure((current) => current?.key === scopeKey ? null : current);
    try {
      const response = await agentApi.knowledge(workspaceId, pageId ? { pageId } : undefined, controller.signal);
      if (controller.signal.aborted) return;
      setSnapshot({ key: scopeKey, bundle: response.data });
      setFailure(null);
    } catch (cause) {
      if (!controller.signal.aborted) setFailure({
        key: scopeKey,
        message: getFriendlyErrorMessage(cause, t('The intelligence data could not be loaded.')),
      });
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null;
        setLoadingKey(null);
      }
    }
  }, [pageId, scopeKey, t, workspaceId]);

  useEffect(() => {
    setShowAllMobileSignals(false);
    void load();
    return () => requestRef.current?.abort();
  }, [load]);

  const counts = useMemo(() => {
    const metrics = bundle?.metrics ?? [];
    return {
      total: metrics.length,
      verified: metrics.filter((metric) => metric.sourceStatus === 'verified').length,
      unavailable: metrics.filter((metric) => metric.sourceStatus === 'unavailable').length,
      gaps: bundle?.snapshot?.dataGaps.length ?? 0,
    };
  }, [bundle]);
  const summaryCards = [
    { label: t('Knowledge sections'), value: bundle ? bundle.sections.length : '—' },
    { label: t('Tracked categories'), value: bundle ? counts.total : '—' },
    { label: t('Verified metrics'), value: bundle ? counts.verified : '—' },
    { label: t('Data gaps'), value: bundle ? counts.gaps : '—' },
  ];
  const visibleMetrics = bundle?.metrics.slice(0, 8) ?? [];

  if (!workspaceId) return null;
  const resolvedTitle = title ?? t(pageId ? 'Page intelligence' : 'Workspace intelligence');
  const resolvedBadge = summaryBadge ?? t(pageId ? 'Live page data' : 'Live workspace data');
  const pendingTitle = t(pageId ? 'Initial page intelligence analysis pending' : 'Initial intelligence analysis pending');
  const pendingDescription = pageId
    ? t('The page analysis starts automatically and uses only page-specific signals, onboarding data and connected sources. No demo values are shown.')
    : t('The analysis starts automatically and uses only your onboarding data and connected sources. No demo values are shown.');

  if (loading && !bundle) return <section className="lulu-workspace-intelligence-panel mb-7 rounded-xl border border-border bg-card p-5" role="status"><div className="flex items-center gap-3 text-sm text-muted-foreground"><RefreshCw aria-hidden="true" className="animate-spin" size={16} /> {t(pageId ? 'Loading page intelligence…' : 'Loading workspace intelligence…')}</div></section>;
  if (error && !bundle?.snapshot) return <section className="lulu-workspace-intelligence-panel mb-7 rounded-xl border border-chart-5/30 bg-chart-5/5 p-5" role="alert"><div className="flex items-start gap-3"><AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-chart-5" size={18} /><div className="min-w-0"><h2 className="text-sm font-semibold text-foreground">{t('Intelligence data unavailable')}</h2><p className="mt-1 text-sm text-muted-foreground">{error}</p><button type="button" onClick={() => void load()} className="mt-3 inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary"><RefreshCw aria-hidden="true" size={13} /> {t('Retry')}</button></div></div></section>;
  if (!bundle?.snapshot) return <section className="lulu-workspace-intelligence-panel mb-7 rounded-xl border border-border bg-card p-5"><div className="flex items-start gap-3"><Clock3 aria-hidden="true" className="mt-0.5 shrink-0 text-muted-foreground" size={18} /><div><h2 className="text-sm font-semibold text-foreground">{pendingTitle}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{pendingDescription}</p></div></div></section>;

  return <section className="lulu-workspace-intelligence-panel mb-7 rounded-xl border border-border bg-card p-4 sm:p-6">
    <div className="flex flex-col gap-4">
      <div className="flex min-w-0 items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Sparkles aria-hidden="true" size={17} /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-semibold text-foreground [overflow-wrap:anywhere]">{resolvedTitle}</h2><span className="rounded-full bg-chart-4/10 px-2 py-1 text-[11px] font-medium text-chart-4">{resolvedBadge}</span></div><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{bundle.snapshot.executiveSummary || t('The initial business intelligence analysis has been completed.')}</p></div></div>
    </div>
    {error ? <div className="mt-4 flex items-start gap-2 rounded-lg border border-chart-5/25 bg-chart-5/5 px-3 py-2 text-xs text-muted-foreground" role="status"><AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-chart-5" size={14} /><span>{t('Latest refresh failed. The last verified intelligence remains visible.')} {error}</span></div> : null}
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {summaryCards.map((card, index) => (
        <div key={card.label} className={`${!showAllMobileSignals && index >= 2 ? 'hidden sm:block ' : ''}rounded-lg border border-border bg-background/40 p-3`}>
          <p className="text-xs text-muted-foreground">{card.label}</p>
          <p className="mt-1 text-lg font-semibold text-foreground">{card.value}</p>
        </div>
      ))}
    </div>
    <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"><div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Database aria-hidden="true" size={13} /> {counts.unavailable} {t('categories need a connected source')}</span><span className="inline-flex items-center gap-1.5"><CheckCircle2 aria-hidden="true" size={13} /> {t('Confidence')}: {t(bundle.snapshot.confidence ?? 'low')}</span></div><p className="text-xs text-muted-foreground">{t('Generated')} {bundle.snapshot.generatedAt ? new Date(bundle.snapshot.generatedAt).toLocaleString(language) : t('not available')}</p></div>
    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{visibleMetrics.map((metric, index) => <div key={metric.metricKey} className={`${!showAllMobileSignals && index >= 3 ? 'hidden sm:block ' : ''}min-w-0 rounded-md border border-border/70 px-3 py-2`}><p className="truncate text-[11px] text-muted-foreground">{metric.metricKey.replaceAll('_', ' ')}</p><p className="mt-1 break-words text-xs font-medium text-foreground">{metric.value === null || metric.value === undefined ? '—' : String(metric.value)} <span className="text-muted-foreground">· {statusLabel(metric.sourceStatus, t)}</span></p></div>)}</div>
    {(bundle.metrics.length > 3 || summaryCards.length > 2) ? (
      <div className="mt-4 sm:hidden">
        <button
          type="button"
          onClick={() => setShowAllMobileSignals((current) => !current)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary"
        >
          {t(showAllMobileSignals ? 'Show fewer mobile signals' : 'Show more mobile signals')}
        </button>
      </div>
    ) : null}
  </section>;
}
