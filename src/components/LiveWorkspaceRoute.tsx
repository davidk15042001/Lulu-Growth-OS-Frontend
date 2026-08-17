import { RefreshCw, Users } from "lucide-react";
import { useLuluApp } from "../api/LuluAppContext";
import { WorkspacePanel } from "../api/panels/WorkspacePanel";

export function LiveWorkspaceRoute() {
  const { selectedWorkspace, loading, error, refresh } = useLuluApp();

  if (loading) {
    return <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]" role="status"><div className="mx-auto max-w-5xl animate-pulse text-sm text-[var(--muted-foreground)]">Loading live workspace data…</div></main>;
  }

  if (!selectedWorkspace) {
    return <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]"><div className="mx-auto max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8"><Users size={22} /><h1 className="mt-4 text-2xl font-semibold">No workspace selected</h1><p className="mt-2 text-sm text-[var(--muted-foreground)]">Complete workspace setup before opening live workspace data.</p>{error && <p className="mt-4 text-sm text-[var(--destructive)]">{error}</p>}<button type="button" onClick={() => void refresh()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"><RefreshCw size={15} />Try again</button></div></main>;
  }

  return <main className="min-h-screen bg-[var(--background)] px-5 py-8 text-[var(--foreground)] sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl"><header className="mb-6 border-b border-[var(--border)] pb-6"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[var(--muted-foreground)]">Live workspace operations</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Workspace overview</h1><p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">This page shows only workspace data returned by the backend. No sample team, audit, approval or notification data is displayed.</p></header><WorkspacePanel workspaceId={selectedWorkspace.id} onClose={() => undefined} /></div></main>;
}
