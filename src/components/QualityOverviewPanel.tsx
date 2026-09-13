import { useEffect, useState } from 'react';
import { CheckCircle2, CircleAlert, Eye, Gauge, ShieldCheck, X } from 'lucide-react';
import { qualityApi, type QualityArtifactDetail, type QualityOverview } from '../api/quality';

const labelize = (value: string) => value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

export function QualityOverviewPanel({ workspaceId }: { workspaceId: string }) {
  const [data, setData] = useState<QualityOverview | null>(null);
  const [selected, setSelected] = useState<QualityArtifactDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
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

  const inspect = (artifactId: string) => {
    setDetailLoading(true);
    void qualityApi.artifact(workspaceId, artifactId)
      .then((response) => setSelected(response.data))
      .catch(() => setError('Quality data is not available yet.'))
      .finally(() => setDetailLoading(false));
  };

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
      {data.recent.length === 0 ? <p className="mt-5 rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">No quality artifacts have been recorded yet.</p> : <div className="mt-5 space-y-2">{data.recent.slice(0, 6).map((artifact) => <div key={artifact.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border px-3 py-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground">{artifact.status === 'RELEASED' ? <CheckCircle2 size={15} /> : artifact.openHardBlockCount ? <CircleAlert size={15} /> : <Gauge size={15} />}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-foreground">{labelize(artifact.artifactType)}</p><p className="text-xs text-muted-foreground">{labelize(artifact.status)} · v{artifact.currentVersion} · {artifact.reviewCount ?? 0} review(s)</p></div>{artifact.openHardBlockCount ? <span className="text-xs font-medium text-destructive">{artifact.openHardBlockCount} hard block(s)</span> : <span className="text-xs text-muted-foreground">{labelize(artifact.releaseMode)}</span>}<button type="button" onClick={() => inspect(artifact.id)} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-foreground hover:bg-secondary/10" aria-label="Inspect quality"><Eye size={13} />Inspect</button></div>)}</div>}
    </>}
    {selected && <div className="mt-5 rounded-lg border border-border bg-secondary/[0.04] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Quality detail</p><h3 className="mt-1 text-base font-semibold text-foreground">{labelize(selected.artifact.artifactType)} · v{selected.artifact.currentVersion}</h3></div><button type="button" onClick={() => setSelected(null)} className="rounded-md p-1 text-muted-foreground hover:bg-secondary/10" aria-label="Close"><X size={16} /></button></div>{detailLoading ? <p className="mt-4 text-sm text-muted-foreground">Loading quality detail…</p> : <div className="mt-4 grid gap-3 sm:grid-cols-4"><div><p className="text-xs text-muted-foreground">Claims</p><p className="font-semibold text-foreground">{selected.claims.length}</p></div><div><p className="text-xs text-muted-foreground">Reviews</p><p className="font-semibold text-foreground">{selected.reviews.length}</p></div><div><p className="text-xs text-muted-foreground">Findings</p><p className="font-semibold text-foreground">{selected.findings.length}</p></div><div><p className="text-xs text-muted-foreground">Release decisions</p><p className="font-semibold text-foreground">{selected.releaseDecisions.length}</p></div></div>}{selected.findings.length > 0 && <div className="mt-4 space-y-2">{selected.findings.slice(0, 3).map((finding) => <div key={finding.id} className="rounded-md border border-border px-3 py-2"><p className="text-xs font-medium text-destructive">{labelize(finding.severity)} · {labelize(finding.category)}</p><p className="mt-1 text-sm text-foreground">{finding.message}</p></div>)}</div>}</div>}
  </section>;
}
