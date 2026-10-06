import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarClock, CheckCircle2, ClipboardList, FlaskConical, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import { executiveApi, type ExecutiveOperatingCycle, type ExecutiveOverview } from "../api/executive";
import { useLuluApp } from "../api/LuluAppContext";
import { getFriendlyErrorMessage } from "../api/client";
import { useLanguage } from "../i18n/GlobalLanguageSwitcher";
import { toIntlLocale } from "../i18n/languages";

function formatTimestamp(value: string | null | undefined, locale: string) {
  if (!value) return "Not available";
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp)
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(timestamp)
    : "Not available";
}

function cycleLabel(cycle: ExecutiveOverview["latestCycles"]["daily"] | ExecutiveOverview["latestCycles"]["weekly"]) {
  if (!cycle) return "Not run yet";
  return cycle.status.replaceAll("_", " ");
}

function severityLabel(severity: number) {
  if (severity >= 4) return "High";
  if (severity >= 2) return "Medium";
  return "Low";
}

function MetricCard({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: number; detail: string }) {
  return <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
    <div className="flex items-center justify-between gap-3 text-muted-foreground">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary">{icon}</span>
      <span className="text-[11px] font-medium uppercase tracking-[0.12em]">Verified</span>
    </div>
    <p className="mt-5 text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
    <strong className="mt-2 block text-3xl tracking-[-0.04em] text-foreground">{value}</strong>
    <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
  </article>;
}

/**
 * The management view deliberately renders only the canonical Executive API.
 * It replaces the previous generated mock dashboard, which could claim a
 * healthy business or identify opportunities without any evidence.
 */
export function ExecutiveOverviewWorkspace() {
  const { selectedWorkspace } = useLuluApp();
  const language = useLanguage();
  const locale = toIntlLocale(language);
  const workspaceId = selectedWorkspace?.id ?? "";
  const [overview, setOverview] = useState<ExecutiveOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    setError("");
    try {
      const response = await executiveApi.overview(workspaceId);
      setOverview(response.data);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Executive intelligence could not be loaded."));
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => { void load(); }, [load]);

  const latestCycle = useMemo(() => {
    const candidates = [overview?.latestCycles.daily, overview?.latestCycles.weekly]
      .filter((cycle): cycle is ExecutiveOperatingCycle => Boolean(cycle));
    return candidates.sort((left, right) => Date.parse(right.completedAt ?? right.updatedAt) - Date.parse(left.completedAt ?? left.updatedAt))[0] ?? null;
  }, [overview]);

  if (!workspaceId) return <main className="grid min-h-screen place-items-center bg-background p-6 text-sm text-muted-foreground">Loading workspace…</main>;

  return <main className="min-h-screen bg-background px-4 py-7 text-foreground sm:px-8 sm:py-10 lg:px-12">
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Company intelligence</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">Executive overview</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Verified operating cycles, findings and decision proposals from this workspace. Lulu does not infer a business status when the evidence is missing.</p>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-secondary disabled:cursor-wait disabled:opacity-60">
          <RefreshCw aria-hidden="true" size={15} className={loading ? "animate-spin" : undefined} />
          Refresh
        </button>
      </header>

      {loading && !overview ? <section className="mt-7 grid min-h-[360px] place-items-center rounded-2xl border border-border bg-card p-8" role="status"><div className="flex items-center gap-3 text-sm text-muted-foreground"><RefreshCw aria-hidden="true" size={18} className="animate-spin" />Loading verified executive intelligence…</div></section> : null}

      {error && !overview ? <section className="mt-7 grid min-h-[360px] place-items-center rounded-2xl border border-chart-5/30 bg-chart-5/5 p-8 text-center" role="alert"><div className="max-w-xl"><AlertTriangle aria-hidden="true" className="mx-auto mb-4 text-chart-5" size={30} /><h2 className="text-lg font-semibold">Executive intelligence is unavailable</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{error}</p><button type="button" onClick={() => void load()} className="mt-5 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary">Try again</button></div></section> : null}

      {overview ? <>
        {error ? <div className="mt-6 flex items-start gap-3 rounded-xl border border-chart-1/30 bg-chart-1/5 px-4 py-3 text-sm text-muted-foreground" role="status"><AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-chart-1" size={17} /><span>The latest refresh failed. The last successfully loaded executive evidence remains visible.</span></div> : null}

        <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={<AlertTriangle size={17} />} label="Open findings" value={overview.summary.visibleFindingCount} detail="Visible signals from completed operating cycles" />
          <MetricCard icon={<ClipboardList size={17} />} label="Decision proposals" value={overview.summary.visibleProposalCount} detail="Proposals awaiting or carrying a recorded decision" />
          <MetricCard icon={<TrendingUp size={17} />} label="Forecasts" value={overview.summary.forecastCount} detail="Evidence-backed forecast records" />
          <MetricCard icon={<FlaskConical size={17} />} label="Scenarios" value={overview.summary.scenarioCount} detail="Saved planning scenarios" />
        </section>

        <section className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,.75fr)]">
          <article className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Latest operating evidence</p><h2 className="mt-1 text-xl font-semibold">Management briefing</h2></div><span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">{latestCycle ? cycleLabel(latestCycle) : "Pending"}</span></div>
            {latestCycle ? <div className="mt-5 rounded-xl border border-border bg-background/50 p-4"><p className="text-sm font-medium">{latestCycle.cycleType === "daily" ? "Daily" : "Weekly"} cycle · {cycleLabel(latestCycle)}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{String(latestCycle.summary.executiveSummary ?? latestCycle.summary.summary ?? "No written summary was stored for this completed cycle.")}</p><dl className="mt-4 grid gap-3 border-t border-border pt-4 text-xs sm:grid-cols-2"><div><dt className="text-muted-foreground">Data cutoff</dt><dd className="mt-1 font-medium">{formatTimestamp(latestCycle.dataCutoffAt, locale)}</dd></div><div><dt className="text-muted-foreground">Cycle completed</dt><dd className="mt-1 font-medium">{formatTimestamp(latestCycle.completedAt, locale)}</dd></div></dl></div> : <div className="mt-5 rounded-xl border border-dashed border-border px-5 py-7 text-sm leading-6 text-muted-foreground">No executive cycle has completed yet. Connect the relevant sources and let Lulu collect verified operating evidence before it produces a management briefing.</div>}
          </article>
          <article className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground"><CalendarClock size={17} /></span><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Operating cadence</p><h2 className="mt-1 text-xl font-semibold">Scheduled cycles</h2></div></div><div className="mt-5 space-y-3">{overview.schedules.length ? overview.schedules.map((schedule) => <div key={schedule.id} className="rounded-xl border border-border bg-background/50 p-4"><div className="flex justify-between gap-3"><strong className="text-sm capitalize">{schedule.cycleType}</strong><span className="text-xs text-muted-foreground">{schedule.active ? "Active" : "Paused"}</span></div><p className="mt-2 text-xs leading-5 text-muted-foreground">Next run: {formatTimestamp(schedule.nextRunAt, locale)}<br />Last run: {formatTimestamp(schedule.lastRunAt, locale)}</p></div>) : <p className="rounded-xl border border-dashed border-border px-4 py-6 text-sm leading-6 text-muted-foreground">No executive schedule has been configured for this workspace.</p>}</div></article>
        </section>

        <section className="mt-7 grid gap-5 xl:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Verified signals</p><h2 className="mt-1 text-xl font-semibold">Open findings</h2></div><CheckCircle2 aria-hidden="true" className="text-muted-foreground" size={19} /></div>{overview.findings.length ? <div className="mt-5 space-y-3">{overview.findings.slice(0, 6).map((finding) => <article key={finding.id} className="rounded-xl border border-border bg-background/50 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h3 className="text-sm font-semibold">{finding.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{finding.description}</p></div><span className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground">{severityLabel(finding.severity)} · {finding.status}</span></div><p className="mt-3 text-xs text-muted-foreground">Recorded {formatTimestamp(finding.createdAt, locale)}</p></article>)}</div> : <p className="mt-5 rounded-xl border border-dashed border-border px-4 py-7 text-sm leading-6 text-muted-foreground">No open executive findings are available. This is not a health claim; it only means no visible finding has been recorded.</p>}</article>
          <article className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Decision workflow</p><h2 className="mt-1 text-xl font-semibold">Recent proposals</h2></div>{overview.proposals.length ? <div className="mt-5 space-y-3">{overview.proposals.slice(0, 6).map((proposal) => <article key={proposal.id} className="rounded-xl border border-border bg-background/50 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h3 className="text-sm font-semibold">{proposal.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{proposal.objective}</p></div><span className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground">{proposal.status.replaceAll("_", " ")}</span></div><p className="mt-3 text-xs text-muted-foreground">Created {formatTimestamp(proposal.createdAt, locale)} · {proposal.requiresHumanApproval ? "Approval required" : "No approval requirement recorded"}</p></article>)}</div> : <p className="mt-5 rounded-xl border border-dashed border-border px-4 py-7 text-sm leading-6 text-muted-foreground">No decision proposals have been created from verified executive evidence yet.</p>}</article>
        </section>
      </> : null}
    </div>
  </main>;
}
