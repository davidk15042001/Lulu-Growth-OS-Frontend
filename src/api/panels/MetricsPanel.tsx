import { useCallback, useEffect, useState, type FormEvent } from "react";
import { metricApi, type Metric, type MetricPoint } from "../metrics";
import { getFriendlyErrorMessage } from "../client";
import { LiveEmpty, LiveError, LivePanelShell, LiveSection, formatLiveDate } from "../live-panel-ui";

export function MetricsPanel({ workspaceId, onClose }: { workspaceId: string; onClose: () => void }) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [points, setPoints] = useState<MetricPoint[]>([]);
  const [draft, setDraft] = useState({ key: "", name: "", domain: "general", unit: "number" });
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadMetrics = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const response = await metricApi.list(workspaceId);
      setMetrics(response.data.items);
      setSelectedId((current) => current && response.data.items.some((item) => item.id === current) ? current : response.data.items[0]?.id ?? "");
    } catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not load your metrics. Please try again.")); }
    finally { setBusy(false); }
  }, [workspaceId]);

  const loadPoints = useCallback(async () => {
    if (!selectedId) { setPoints([]); return; }
    try { setPoints((await metricApi.points(workspaceId, selectedId, "limit=50&order=desc")).data.items); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not load the metric values. Please try again.")); }
  }, [selectedId, workspaceId]);

  useEffect(() => { void loadMetrics(); }, [loadMetrics]);
  useEffect(() => { void loadPoints(); }, [loadPoints]);

  async function createMetric(event: FormEvent) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      await metricApi.create(workspaceId, { ...draft, key: draft.key.trim(), name: draft.name.trim() });
      setDraft({ key: "", name: "", domain: "general", unit: "number" });
      await loadMetrics();
    } catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not create this metric. Please try again.")); setBusy(false); }
  }

  async function ingest(event: FormEvent) {
    event.preventDefault();
    const number = Number(value);
    if (!selectedId || !Number.isFinite(number)) { setError("Enter a valid numeric value."); return; }
    setBusy(true); setError("");
    try {
      await metricApi.ingest(workspaceId, selectedId, [{ recordedAt: new Date().toISOString(), value: number }]);
      setValue("");
      await Promise.all([loadMetrics(), loadPoints()]);
    } catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not save this value. Please try again.")); setBusy(false); }
  }

  return <LivePanelShell title="Live metrics" subtitle={`${metrics.length} configured metrics`} onClose={onClose}>
    <LiveError message={error} />
    <LiveSection title="Metrics" action={<span className="lulu-live-message">Use Update in the navigation bar.</span>}>
      {metrics.length === 0 ? <LiveEmpty>No live metrics yet.</LiveEmpty> : <div className="lulu-live-form"><label>Select metric<select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>{metrics.map((metric) => <option key={metric.id} value={metric.id}>{metric.name}</option>)}</select></label></div>}
      {metrics.map((metric) => <article className="lulu-live-row" key={metric.id}>
        <div className="lulu-live-row-top"><div><strong>{metric.name}</strong><span>{metric.key} · {metric.domain}</span></div><span className="lulu-live-badge good">{metric.latestValue ?? "—"} {metric.unit}</span></div>
        <small>{metric.latestRecordedAt ? `Recorded ${formatLiveDate(metric.latestRecordedAt)}` : "No points recorded"}</small>
        <button className="lulu-live-button danger" style={{ marginTop: 8 }} onClick={async () => { if (!window.confirm(`Archive ${metric.name}?`)) return; await metricApi.archive(workspaceId, metric.id); await loadMetrics(); }}>Archive</button>
      </article>)}
    </LiveSection>
    <LiveSection title="Record a point">
      <form className="lulu-live-form" onSubmit={ingest}><label>Value<input type="number" step="any" value={value} onChange={(event) => setValue(event.target.value)} disabled={!selectedId} /></label><button className="lulu-live-button primary" disabled={busy || !selectedId}>Record now</button></form>
      {points.map((point) => <div className="lulu-live-row" key={point.id}><strong>{point.value}</strong><small>{formatLiveDate(point.recordedAt)}</small></div>)}
    </LiveSection>
    <LiveSection title="Create metric">
      <form className="lulu-live-form" onSubmit={createMetric}>
        <div className="lulu-live-grid"><label>Key<input value={draft.key} onChange={(event) => setDraft({ ...draft, key: event.target.value })} pattern="[a-z][a-z0-9_]*" required /></label><label>Name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required /></label></div>
        <div className="lulu-live-grid"><label>Domain<input value={draft.domain} onChange={(event) => setDraft({ ...draft, domain: event.target.value })} pattern="[a-z][a-z0-9_]*" required /></label><label>Unit<input value={draft.unit} onChange={(event) => setDraft({ ...draft, unit: event.target.value })} /></label></div>
        <button className="lulu-live-button primary" disabled={busy}>Create metric</button>
      </form>
    </LiveSection>
  </LivePanelShell>;
}
