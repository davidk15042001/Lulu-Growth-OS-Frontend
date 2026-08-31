import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, Database, RefreshCw, Sparkles } from 'lucide-react';
import { agentApi, type IntelligenceBundle } from '../api/agents';
import { ApiError } from '../api/client';

type Props = {
  workspaceId: string | null;
  pageId?: string | null;
  title?: string;
  summaryBadge?: string;
};

function statusLabel(status: string) {
  if (status === 'verified') return 'Verified';
  if (status === 'derived') return 'Derived';
  if (status === 'forecast') return 'Forecast';
  if (status === 'not_applicable') return 'Not applicable';
  return 'Unavailable';
}

export function WorkspaceIntelligencePanel({
  workspaceId,
  pageId = null,
  title,
  summaryBadge,
}: Props) {
  const [bundle, setBundle] = useState<IntelligenceBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllMobileSignals, setShowAllMobileSignals] = useState(false);

  const load = async () => {
    if (!workspaceId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await agentApi.knowledge(workspaceId, pageId ? { pageId } : undefined);
      setBundle(response.data);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'The intelligence data could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [pageId, workspaceId]);

  const counts = useMemo(() => {
    const metrics = bundle?.metrics ?? [];
    return {
      total: metrics.length,
      verified: metrics.filter((metric) => metric.sourceStatus === 'verified').length,
      unavailable: metrics.filter((metric) => metric.sourceStatus === 'unavailable').length,
      gaps: bundle?.snapshot?.dataGaps.length ?? 0,
    };
  }, [bundle]);
  const visibleSummaryCards = showAllMobileSignals
    ? [
        { label: 'Knowledge sections', value: bundle?.sections.length || '—' },
        { label: 'Tracked categories', value: counts.total || '—' },
        { label: 'Verified metrics', value: counts.verified || '—' },
        { label: 'Data gaps', value: counts.gaps || '—' },
      ]
    : [
        { label: 'Tracked categories', value: counts.total || '—' },
        { label: 'Verified metrics', value: counts.verified || '—' },
      ];
  const visibleMetrics = showAllMobileSignals ? bundle?.metrics.slice(0, 8) ?? [] : bundle?.metrics.slice(0, 3) ?? [];

  if (!workspaceId) return null;
  const resolvedTitle = title ?? (pageId ? 'Page intelligence' : 'Workspace intelligence');
  const resolvedBadge = summaryBadge ?? (pageId ? 'Live page data' : 'Live workspace data');
  const pendingTitle = pageId ? 'Initial page intelligence analysis pending' : 'Initial intelligence analysis pending';
  const pendingDescription = pageId
    ? 'The page analysis starts automatically and uses only page-specific signals, onboarding data and connected sources. No demo values are shown.'
    : 'The analysis starts automatically and uses only your onboarding data and connected sources. No demo values are shown.';

  if (loading && !bundle) return <section className="mb-7 rounded-xl border border-border bg-card p-5"><div className="flex items-center gap-3 text-sm text-muted-foreground"><RefreshCw className="animate-spin" size={16} /> {pageId ? 'Loading page intelligence…' : 'Loading workspace intelligence…'}</div></section>;
  if (error) return <section className="mb-7 rounded-xl border border-chart-5/30 bg-chart-5/5 p-5"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 shrink-0 text-chart-5" size={18} /><div className="min-w-0"><h2 className="text-sm font-semibold text-foreground">Intelligence data unavailable</h2><p className="mt-1 text-sm text-muted-foreground">{error}</p><button type="button" onClick={() => void load()} className="mt-3 inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary"><RefreshCw size={13} /> Retry</button></div></div></section>;
  if (!bundle?.snapshot) return <section className="mb-7 rounded-xl border border-border bg-card p-5"><div className="flex items-start gap-3"><Clock3 className="mt-0.5 shrink-0 text-muted-foreground" size={18} /><div><h2 className="text-sm font-semibold text-foreground">{pendingTitle}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{pendingDescription}</p></div></div></section>;

  return <section className="mb-7 rounded-xl border border-border bg-card p-4 sm:p-6">
    <div className="flex flex-col gap-4">
      <div className="flex min-w-0 items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Sparkles size={17} /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-semibold text-foreground">{resolvedTitle}</h2><span className="rounded-full bg-chart-4/10 px-2 py-1 text-[11px] font-medium text-chart-4">{resolvedBadge}</span></div><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{bundle.snapshot.executiveSummary || 'The initial business intelligence analysis has been completed.'}</p></div></div>
    </div>
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {visibleSummaryCards.map((card) => (
        <div key={card.label} className="rounded-lg border border-border bg-background/40 p-3">
          <p className="text-xs text-muted-foreground">{card.label}</p>
          <p className="mt-1 text-lg font-semibold text-foreground">{card.value}</p>
        </div>
      ))}
    </div>
    <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"><div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Database size={13} /> {counts.unavailable} categories need a connected source</span><span className="inline-flex items-center gap-1.5"><CheckCircle2 size={13} /> Confidence: {bundle.snapshot.confidence ?? 'low'}</span></div><p className="text-xs text-muted-foreground">Generated {bundle.snapshot.generatedAt ? new Date(bundle.snapshot.generatedAt).toLocaleString() : 'not available'}</p></div>
    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{visibleMetrics.map((metric) => <div key={metric.metricKey} className="rounded-md border border-border/70 px-3 py-2"><p className="truncate text-[11px] text-muted-foreground">{metric.metricKey.replaceAll('_', ' ')}</p><p className="mt-1 text-xs font-medium text-foreground">{metric.value === null || metric.value === undefined ? '—' : String(metric.value)} <span className="text-muted-foreground">· {statusLabel(metric.sourceStatus)}</span></p></div>)}</div>
    {(bundle.metrics.length > 3 || visibleSummaryCards.length < 4) ? (
      <div className="mt-4 sm:hidden">
        <button
          type="button"
          onClick={() => setShowAllMobileSignals((current) => !current)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary"
        >
          {showAllMobileSignals ? 'Show fewer mobile signals' : 'Show more mobile signals'}
        </button>
      </div>
    ) : null}
  </section>;
}
