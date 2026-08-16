import { useCallback, useEffect, useState } from "react";
import { Activity, CreditCard, Database, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { getFriendlyErrorMessage } from "../api/client";
import { workspaceAppApi, type BillingState } from "../api/workspace-app";
import { workspaceApi } from "../api/workspaces";
import type { WorkspaceBootstrap } from "../api/types";
import { useLuluApp } from "../api/LuluAppContext";

function formatDate(value: string | null | undefined) {
  if (!value) return "No date available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "No date available" : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function planLabel(planKey: string | undefined) {
  if (!planKey) return "No plan selected";
  return planKey.charAt(0).toUpperCase() + planKey.slice(1);
}

function EmptyState({ children }: { children: string }) {
  return <div className="rounded-2xl border border-dashed border-[var(--border)] px-5 py-8 text-center text-sm text-[var(--muted-foreground)]">{children}</div>;
}

export function DynamicWorkspaceDashboard() {
  const { selectedWorkspace } = useLuluApp();
  const workspaceId = selectedWorkspace?.id ?? "";
  const [bootstrap, setBootstrap] = useState<WorkspaceBootstrap | null>(null);
  const [billing, setBilling] = useState<BillingState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    setError("");
    try {
      const [bootstrapResponse, billingResponse] = await Promise.all([
        workspaceApi.bootstrap(workspaceId),
        workspaceAppApi.billing(workspaceId),
      ]);
      setBootstrap(bootstrapResponse.data);
      setBilling(billingResponse.data);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Live workspace data could not be loaded."));
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => { void load(); }, [load]);

  if (loading) {
    return <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]"><div className="mx-auto max-w-7xl animate-pulse text-sm text-[var(--muted-foreground)]">Loading your live workspace…</div></main>;
  }

  if (error || !bootstrap) {
    return <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]"><div className="mx-auto max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8"><h1 className="text-2xl font-semibold">Workspace data unavailable</h1><p className="mt-2 text-sm text-[var(--muted-foreground)]">{error || "No workspace data was returned by the API."}</p><button type="button" onClick={() => void load()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"><RefreshCw size={15} />Try again</button></div></main>;
  }

  const subscription = billing?.subscription;
  const metricRows = bootstrap.metrics.filter((metric) => metric.value !== null);
  const integrationRows = Object.entries(bootstrap.integrations);

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-8 text-[var(--foreground)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[var(--muted-foreground)]">Live workspace</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">{bootstrap.workspace.companyName || "Your workspace"}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">This dashboard only shows information returned by your connected workspace. No sample or demo metrics are displayed.</p>
          </div>
          <button type="button" onClick={() => void load()} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold hover:border-[var(--foreground)]"><RefreshCw size={15} />Refresh live data</button>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"><Database size={18} /><p className="mt-5 text-xs uppercase tracking-[.14em] text-[var(--muted-foreground)]">Workspace records</p><strong className="mt-2 block text-3xl">{bootstrap.records.total}</strong></div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"><Users size={18} /><p className="mt-5 text-xs uppercase tracking-[.14em] text-[var(--muted-foreground)]">Members</p><strong className="mt-2 block text-3xl">{bootstrap.members.total}</strong></div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"><CreditCard size={18} /><p className="mt-5 text-xs uppercase tracking-[.14em] text-[var(--muted-foreground)]">Plan</p><strong className="mt-2 block text-2xl">{planLabel(subscription?.planKey)}</strong><span className="text-xs text-[var(--muted-foreground)]">{subscription?.status ?? "not confirmed"}</span></div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"><ShieldCheck size={18} /><p className="mt-5 text-xs uppercase tracking-[.14em] text-[var(--muted-foreground)]">Access</p><strong className="mt-2 block text-2xl">{bootstrap.permissions.role}</strong><span className="text-xs text-[var(--muted-foreground)]">AI {bootstrap.capabilities.aiGeneration ? "enabled" : "not enabled"}</span></div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold">Your metrics</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">Only connected and recorded metrics appear here.</p></div><Activity size={18} /></div><div className="mt-6 space-y-3">{metricRows.length === 0 ? <EmptyState>No metrics have been recorded yet. Connect a platform or add data to see live performance here.</EmptyState> : metricRows.map((metric) => <div key={metric.id} className="flex items-center justify-between border-b border-[var(--border)] py-3 last:border-0"><div><strong className="text-sm">{metric.name}</strong><p className="text-xs text-[var(--muted-foreground)]">{metric.domain}</p></div><span className="text-sm font-semibold">{metric.value} {metric.unit}</span></div>)}</div></article>
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"><h2 className="text-lg font-semibold">Connected platforms</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">No platform is shown as connected unless the backend reports it.</p><div className="mt-6 space-y-3">{integrationRows.length === 0 ? <EmptyState>No platforms are connected yet.</EmptyState> : integrationRows.map(([name, count]) => <div key={name} className="flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3"><span className="text-sm">{name}</span><span className="text-sm font-semibold">{count}</span></div>)}</div></article>
        </section>

        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"><h2 className="text-lg font-semibold">Recent activity</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">Real audit events from this workspace.</p><div className="mt-6">{bootstrap.recentActivity.length === 0 ? <EmptyState>No activity has been recorded yet.</EmptyState> : <div className="space-y-3">{bootstrap.recentActivity.map((entry) => <div key={entry.id} className="flex flex-col gap-1 border-b border-[var(--border)] py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between"><span className="text-sm font-medium">{entry.action}</span><span className="text-xs text-[var(--muted-foreground)]">{entry.entityType} · {formatDate(entry.createdAt)}</span></div>)}</div>}</div></section>
      </div>
    </main>
  );
}
