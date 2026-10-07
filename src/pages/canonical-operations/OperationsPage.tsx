import { useMemo, useState } from "react";
import { Activity, CheckCircle2, CircleAlert, Clock3, ListTodo, RefreshCw, Search, Zap } from "lucide-react";
import { useLiveRecords } from "../../api/useLiveRecords";
import type { WorkspaceRecord } from "../../api/records";
import { WorkspaceSurfaceShell } from "../../components/WorkspaceSurfaceShell";

const CLOSED_STATUS = /completed|closed|succeeded|archived|cancelled|canceled|done/i;
const BLOCKED_STATUS = /blocked|failed|error|needs[_ -]?attention|requires[_ -]?action/i;

function recordStatus(record: WorkspaceRecord) {
  return record.status?.trim() || record.stage?.trim() || "Recorded";
}

function recordUpdatedAt(record: WorkspaceRecord) {
  const date = new Date(record.updatedAt);
  return Number.isNaN(date.valueOf()) ? "—" : date.toLocaleString();
}

function mergeRecords(actions: WorkspaceRecord[], tasks: WorkspaceRecord[]) {
  return [...actions, ...tasks]
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
    .slice(0, 50);
}

export default function OperationsPage() {
  const actions = useLiveRecords("ai_actions", "limit=50");
  const tasks = useLiveRecords("ai_tasks", "limit=50");
  const [query, setQuery] = useState("");
  const records = useMemo(() => mergeRecords(actions.items, tasks.items), [actions.items, tasks.items]);
  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return records;
    return records.filter((record) => `${record.name} ${record.description ?? ""} ${record.status} ${JSON.stringify(record.data)}`.toLowerCase().includes(normalized));
  }, [query, records]);
  const activeCount = records.filter((record) => !CLOSED_STATUS.test(recordStatus(record))).length;
  const blockedCount = records.filter((record) => BLOCKED_STATUS.test(recordStatus(record))).length;
  const completedCount = records.filter((record) => CLOSED_STATUS.test(recordStatus(record))).length;
  const loading = actions.loading || tasks.loading;
  const error = actions.error || tasks.error;

  const refresh = async () => {
    await Promise.all([actions.refresh(), tasks.refresh()]);
  };

  return (
    <WorkspaceSurfaceShell activeSlug="gently-light-6089">
      <main className="min-h-screen bg-[var(--background)] px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Operations control</p>
              <h1 className="text-3xl font-semibold tracking-tight">Operations</h1>
              <p className="mt-2 max-w-3xl text-sm text-[var(--muted-foreground)]">A live view of persisted AI actions and operational tasks for this workspace. No simulated activity or sample volumes are shown.</p>
            </div>
            <button type="button" onClick={() => void refresh()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium disabled:opacity-50">
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </header>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Live operations summary">
            <SummaryCard icon={Activity} label="Persisted records" value={String(records.length)} detail="AI actions and tasks" />
            <SummaryCard icon={Zap} label="Active" value={String(activeCount)} detail="Not in a terminal state" tone="violet" />
            <SummaryCard icon={CircleAlert} label="Needs attention" value={String(blockedCount)} detail="Blocked or failed status" tone={blockedCount ? "rose" : "default"} />
            <SummaryCard icon={CheckCircle2} label="Completed" value={String(completedCount)} detail="Terminal statuses only" tone="emerald" />
          </section>

          {error && <div role="alert" className="rounded-2xl border border-rose-300/60 bg-rose-500/10 px-4 py-3 text-sm text-rose-700">{error}</div>}

          <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
            <div className="flex flex-col gap-3 border-b border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div><p className="eyebrow">Execution ledger</p><h2 className="mt-1 text-xl font-semibold">Recent operational records</h2></div>
              <label className="relative block sm:w-72">
                <Search size={15} className="absolute left-3 top-3 text-[var(--muted-foreground)]" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records…" className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" />
              </label>
            </div>
            {loading && records.length === 0 ? <div className="p-12 text-center text-sm text-[var(--muted-foreground)]">Loading persisted operations…</div> : filteredRecords.length === 0 ? (
              <div className="p-12 text-center"><ListTodo className="mx-auto text-[var(--muted-foreground)]" size={32} /><h3 className="mt-3 font-semibold">No matching operational records</h3><p className="mt-1 text-sm text-[var(--muted-foreground)]">Only actions and tasks returned by the selected workspace are displayed here.</p></div>
            ) : (
              <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-[var(--border)] text-xs text-[var(--muted-foreground)]"><tr><th className="px-5 py-3">Record</th><th className="px-3 py-3">Type</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Updated</th></tr></thead><tbody className="divide-y divide-[var(--border)]">{filteredRecords.map((record) => <tr key={`${record.resourceType}:${record.id}`}><td className="px-5 py-4"><div className="font-medium">{record.name}</div><div className="mt-1 max-w-[480px] truncate text-xs text-[var(--muted-foreground)]">{record.description || String(record.data?.description || "No description recorded")}</div></td><td className="px-3 py-4 text-xs text-[var(--muted-foreground)]">{record.resourceType === "ai_tasks" ? "Task" : "AI action"}</td><td className="px-3 py-4"><span className="rounded-full bg-[var(--secondary)] px-2.5 py-1 text-xs">{recordStatus(record)}</span></td><td className="px-3 py-4 text-xs text-[var(--muted-foreground)]"><span className="inline-flex items-center gap-1.5"><Clock3 size={13} />{recordUpdatedAt(record)}</span></td></tr>)}</tbody></table></div>
            )}
          </section>
        </div>
      </main>
    </WorkspaceSurfaceShell>
  );
}

function SummaryCard({ icon: Icon, label, value, detail, tone = "default" }: { icon: typeof Activity; label: string; value: string; detail: string; tone?: "default" | "violet" | "rose" | "emerald" }) {
  const toneClasses = { default: "text-[var(--muted-foreground)]", violet: "text-violet-600", rose: "text-rose-600", emerald: "text-emerald-600" };
  return <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"><div className={`flex items-center gap-2 text-xs ${toneClasses[tone]}`}><Icon size={15} />{label}</div><p className="mt-3 text-2xl font-semibold">{value}</p><p className="mt-1 text-xs text-[var(--muted-foreground)]">{detail}</p></article>;
}
