import { BarChart3, Bot, CreditCard, GitBranch, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useLuluApp } from "../api/LuluAppContext";
import { IntegrationsPanel } from "../api/panels/IntegrationsPanel";
import { MetricsPanel } from "../api/panels/MetricsPanel";
import { AiPanel } from "../api/panels/AiPanel";
import { BillingPanel } from "../api/panels/BillingPanel";

type SpecialKind = "metrics" | "integrations" | "ai" | "billing";

export function LiveSpecialRoute({ kind }: { kind: SpecialKind }) {
  const { selectedWorkspace, loading, error, refresh } = useLuluApp();
  const [panelOpen, setPanelOpen] = useState(true);
  const label = kind === "metrics" ? "Metrics" : kind === "integrations" ? "Integrations" : kind === "ai" ? "AI workspace" : "Billing";
  const Icon = kind === "metrics" ? BarChart3 : kind === "integrations" ? GitBranch : kind === "ai" ? Bot : CreditCard;

  if (loading) return <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]" role="status"><div className="mx-auto max-w-5xl animate-pulse text-sm text-[var(--muted-foreground)]">Loading live {label.toLowerCase()}…</div></main>;
  if (!selectedWorkspace) return <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]"><div className="mx-auto max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8"><Icon size={22} /><h1 className="mt-4 text-2xl font-semibold">No workspace selected</h1><p className="mt-2 text-sm text-[var(--muted-foreground)]">Complete workspace setup before opening live {label.toLowerCase()}.</p>{error && <p className="mt-4 text-sm text-[var(--destructive)]">{error}</p>}<button type="button" onClick={() => void refresh()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"><RefreshCw size={15} />Try again</button></div></main>;

  return <main className="min-h-screen bg-[var(--background)] px-5 py-8 text-[var(--foreground)] sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl"><header className="mb-6 border-b border-[var(--border)] pb-6"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[var(--muted-foreground)]">Live workspace data</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{label}</h1><p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">Only data returned by the connected workspace is displayed. No sample data is used.</p></header>{panelOpen ? (kind === "metrics" ? <MetricsPanel workspaceId={selectedWorkspace.id} onClose={() => setPanelOpen(false)} /> : kind === "integrations" ? <IntegrationsPanel workspaceId={selectedWorkspace.id} onClose={() => setPanelOpen(false)} /> : kind === "ai" ? <AiPanel workspaceId={selectedWorkspace.id} onClose={() => setPanelOpen(false)} /> : <BillingPanel workspaceId={selectedWorkspace.id} onClose={() => setPanelOpen(false)} />) : <button type="button" onClick={() => setPanelOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]">Open live {label.toLowerCase()}</button>}</div></main>;
}
