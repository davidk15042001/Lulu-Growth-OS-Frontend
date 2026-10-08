import { Database, RefreshCw } from "lucide-react";
import { useLuluApp } from "../api/LuluAppContext";
import { BackendResourceOverviewPage } from "./BackendResourceOverviewPage";

function readableResourceType(resourceType: string) {
  return resourceType
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function LiveResourceRoute({ resourceType }: { resourceType: string }) {
  const { selectedWorkspace, loading, error, refresh } = useLuluApp();

  if (loading) {
    return <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]" role="status"><div className="mx-auto max-w-5xl animate-pulse text-sm text-[var(--muted-foreground)]">Loading live workspace data…</div></main>;
  }

  if (!selectedWorkspace) {
    return <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]"><div className="mx-auto max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8"><Database size={22} /><h1 className="mt-4 text-2xl font-semibold">No workspace selected</h1><p className="mt-2 text-sm text-[var(--muted-foreground)]">Connect or complete a workspace before opening live {readableResourceType(resourceType)} data.</p>{error && <p className="mt-4 text-sm text-[var(--destructive)]">{error}</p>}<button type="button" onClick={() => void refresh()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"><RefreshCw size={15} />Try again</button></div></main>;
  }

  return <BackendResourceOverviewPage
    resourceType={resourceType}
    eyebrow="Live workspace data"
    title={readableResourceType(resourceType)}
    description="This page shows only tenant-scoped records returned by the connected workspace. Changes belong to the canonical domain workspace."
    emptyTitle="No live records are available yet."
    emptyDescription="Connect a provider or complete the relevant canonical workflow before reviewing this resource. No example values or generic mutations are shown."
    emptyIcon={<Database aria-hidden="true" size={24} />}
  />;
}
