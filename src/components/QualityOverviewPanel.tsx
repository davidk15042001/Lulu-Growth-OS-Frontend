import { useEffect, useState } from 'react';
import { CheckCircle2, CircleAlert, Gauge, ShieldCheck } from 'lucide-react';
import { qualityApi, type QualityOverview } from '../api/quality';

const labelize = (value: string) => value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

export function QualityOverviewPanel({ workspaceId }: { workspaceId: string }) {
  const [data, setData] = useState<QualityOverview | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setError('');
    void qualityApi.overview(workspaceId, controller.signal)
      .then((response) => setData(response.data))
      .catch((reason: unknown) => {
        if (!(reason instanceof DOMException && reason.name === 'AbortError')) setError('Quality data is not available yet.');
      });
    return () => controller.abort();
  }, [workspaceId]);

  return <section className="mt-5 rounded-xl border border-border bg-[var(--card)] p-5" aria-label="Quality intelligence">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Quality intelligence</p><h2 className="mt-1 text-lg font-semibold text-foreground">Trust before execution</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Only persisted quality artifacts, reviews and release decisions appear here. No demo scores or synthetic findings are shown.</p></div>
      <ShieldCheck className="text-foreground" size={20} aria-hidden="true" />
    </div>
    {error ? <p className="mt-5 rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">{error}</p> : !data ? <p className="mt-5 rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">Loading quality data…</p> : <>
      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-border px-3 py-3"><p className="text-xs text-muted-foreground">Artifacts</p><p className="mt-1 text-2xl font-semibold text-foreground">{data.counts.artifactCount}</p></div>
        <div className="rounded-lg border border-border px-3 py-3"><p className="text-xs text-muted-foreground">Blocked / withheld</p><p className="mt-1 text-2xl font-semibold text-foreground">{data.counts.blockedCount}</p></div>
        <div className="rounded-lg border border-border px-3 py-3"><p className="text-xs text-muted-foreground">Released</p><p className="mt-1 text-2xl font-semibold text-foreground">{data.counts.releasedCount}</p></div>
        <div className="rounded-lg border border-border px-3 py-3"><p className="text-xs text-muted-foreground">Measured outcomes</p><p className="mt-1 text-2xl font-semibold text-foreground">{data.counts.measuredCount}</p></div>
      </div>
      {data.recent.length === 0 ? <p className="mt-5 rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">No quality artifacts have been recorded yet.</p> : <div className="mt-5 space-y-2">{data.recent.slice(0, 6).map((artifact) => <div key={artifact.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border px-3 py-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground">{artifact.status === 'RELEASED' ? <CheckCircle2 size={15} /> : artifact.openHardBlockCount ? <CircleAlert size={15} /> : <Gauge size={15} />}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-foreground">{labelize(artifact.artifactType)}</p><p className="text-xs text-muted-foreground">{labelize(artifact.status)} · v{artifact.currentVersion} · {artifact.reviewCount ?? 0} review(s)</p></div>{artifact.openHardBlockCount ? <span className="text-xs font-medium text-destructive">{artifact.openHardBlockCount} hard block(s)</span> : <span className="text-xs text-muted-foreground">{labelize(artifact.releaseMode)}</span>}</div>)}</div>}
    </>}
  </section>;
}
