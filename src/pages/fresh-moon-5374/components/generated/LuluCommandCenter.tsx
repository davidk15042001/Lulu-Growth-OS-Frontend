import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Check,
  CheckCircle2,
  Layers,
  Play,
  RefreshCw,
  Search,
  ShieldAlert,
  X,
} from "lucide-react";
import {
  agentApi,
  agentModuleForContract,
  agentPageContextFromContract,
  autoAgentGoalForContract,
  type AgentHealth,
  type AgentHealthItem,
} from "../../../../api/agents";
import { workspaceApi } from "../../../../api/workspaces";
import type { WorkspaceBootstrap } from "../../../../api/types";
import { approvalApi, type Approval } from "../../../../api/approvals";
import { getFriendlyErrorMessage } from "../../../../api/client";
import { getSelectedWorkspaceId } from "../../../../api/session";
import { workspaceAppApi } from "../../../../api/workspace-app";
import { isPageAvailable, navigateApp, pagePath } from "../../../../routing";
import { clearRuntimeSnapshotCache } from "../../../../components/useLuluAgentRuntime";
import { emitWorkspaceRefreshed } from "../../../../components/workspace-refresh-events";
import { getLuluAgentContract } from "../../../../config/lulu-agent-registry";

type StatusKind = "ok" | "warn" | "danger" | "idle";

function statusKind(item: AgentHealthItem): StatusKind {
  if (item.lastRunStatus === "failed") return "danger";
  if (item.lastRunStatus === "waiting_approval") return "warn";
  if (item.failedRunCount > 0) return "warn";
  if (item.lastRunStatus === "completed") return "ok";
  if (item.lastRunStatus === "running" || item.lastRunStatus === "queued" || item.lastRunStatus === "planning") return "ok";
  return "idle";
}

function statusLabel(item: AgentHealthItem): string {
  switch (item.lastRunStatus) {
    case "completed": return "Bereit";
    case "failed": return "Fehler";
    case "waiting_approval": return "Freigabe nötig";
    case "running": return "Aktiv";
    case "queued": return "Warteschlange";
    case "planning": return "Planung";
    case "cancelled": return "Abgebrochen";
    default: return "—";
  }
}

function StatusBadge({ kind, label }: { kind: StatusKind; label: string }) {
  const dot = kind === "ok" ? "bg-emerald-500" : kind === "warn" ? "bg-amber-500" : kind === "danger" ? "bg-red-500" : "bg-[var(--muted-foreground)]/40";
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--muted-foreground)]">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

function groupBySection(items: AgentHealthItem[]) {
  const groups = new Map<string, AgentHealthItem[]>();
  for (const item of items) {
    const key = item.sectionLabel?.trim() || "Weitere";
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export function LuluCommandCenter() {
  const workspaceId = getSelectedWorkspaceId();
  const [health, setHealth] = useState<AgentHealth | null>(null);
  const [bootstrap, setBootstrap] = useState<WorkspaceBootstrap | null>(null);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [decidingId, setDecidingId] = useState<string | null>(null);
  const [startingPageId, setStartingPageId] = useState<string | null>(null);
  const [startedPageId, setStartedPageId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!workspaceId) return;
    try {
      const [healthResponse, bootstrapResponse] = await Promise.all([
        agentApi.health(workspaceId),
        workspaceApi.bootstrap(workspaceId),
      ]);
      setHealth(healthResponse.data);
      setBootstrap(bootstrapResponse.data);
      setError("");
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Die Steuerzentrale konnte nicht geladen werden."));
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  const loadApprovals = useCallback(async () => {
    if (!workspaceId) return;
    try {
      const result = await approvalApi.list(workspaceId, "status=pending&limit=50");
      setApprovals(result.data.items);
    } catch {
      setApprovals([]);
    }
  }, [workspaceId]);

  useEffect(() => {
    void load();
    void loadApprovals();
  }, [load, loadApprovals]);

  const canEdit = bootstrap?.permissions.canEdit ?? false;

  const refreshAll = async () => {
    if (!workspaceId || refreshing) return;
    setRefreshing(true);
    try {
      const started = await workspaceAppApi.startContentRefresh(workspaceId);
      const jobId = started.data.job.id;
      for (let attempt = 0; attempt < 60; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const status = await workspaceAppApi.contentRefreshStatus(workspaceId, jobId);
        if (status.data.status === "completed") {
          clearRuntimeSnapshotCache(workspaceId);
          emitWorkspaceRefreshed(workspaceId, "command-center");
          await load();
          break;
        }
        if (["failed", "cancelled"].includes(status.data.status)) break;
      }
    } catch {
      // The refresh error is surfaced by the navigation update button.
    } finally {
      setRefreshing(false);
    }
  };

  const decide = async (approvalId: string, decision: "approved" | "rejected") => {
    if (!workspaceId || decidingId) return;
    setDecidingId(approvalId);
    setActionError("");
    try {
      await approvalApi.decide(workspaceId, approvalId, decision);
      await Promise.all([loadApprovals(), load()]);
    } catch (cause) {
      setActionError(getFriendlyErrorMessage(cause, "Die Freigabe konnte nicht bearbeitet werden."));
    } finally {
      setDecidingId(null);
    }
  };

  const startAgent = async (pageId: string) => {
    if (!workspaceId || startingPageId) return;
    setStartingPageId(pageId);
    setActionError("");
    try {
      const contract = getLuluAgentContract(pageId);
      const goal = contract
        ? autoAgentGoalForContract(contract)
        : `[page-agent:${pageId}] Analyze and act.`;
      const module = contract ? agentModuleForContract(contract) : undefined;
      const page = contract ? agentPageContextFromContract(contract) : undefined;
      await agentApi.create(workspaceId, goal, { module, page });
      setStartedPageId(pageId);
      window.setTimeout(() => {
        setStartedPageId((current) => (current === pageId ? null : current));
        void load();
      }, 2500);
    } catch (cause) {
      setActionError(getFriendlyErrorMessage(cause, "Agent konnte nicht gestartet werden."));
    } finally {
      setStartingPageId(null);
    }
  };

  const items = useMemo(() => {
    if (!health) return [];
    return health.items
      .filter((item) => isPageAvailable(item.pageId))
      .filter((item) => {
        const needle = query.trim().toLowerCase();
        if (!needle) return true;
        return `${item.pageLabel} ${item.sectionLabel} ${item.module} ${item.pageId}`.toLowerCase().includes(needle);
      });
  }, [health, query]);

  const groups = useMemo(() => groupBySection(items), [items]);
  const summary = health?.summary ?? null;
  const pendingApprovals = bootstrap?.approvals.pending ?? approvals.length;
  const totalRecords = bootstrap?.records.total ?? 0;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Steuerzentrale</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Alle Agenten, Systeme und Freigaben an einem Ort.</p>
          </div>
          <button
            type="button"
            onClick={() => void refreshAll()}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : undefined} />
            {refreshing ? "Aktualisiere …" : "Alle aktualisieren"}
          </button>
        </div>

        {error && (
          <p className="rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-4 py-2.5 text-sm text-[var(--destructive)]">
            {error}
          </p>
        )}
        {actionError && (
          <p className="rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-4 py-2.5 text-sm text-[var(--destructive)]">
            {actionError}
          </p>
        )}

        {loading ? (
          <p className="py-16 text-center text-sm text-[var(--muted-foreground)]">Steuerzentrale wird geladen …</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <Activity size={15} />
                  <span className="text-xs">Agenten</span>
                </div>
                <p className="mt-2 text-2xl font-semibold">{summary?.totalPages ?? 0}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{summary?.activePages ?? 0} aktiv</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <CheckCircle2 size={15} />
                  <span className="text-xs">Gesund</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-emerald-600">{summary?.healthyPages ?? 0}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{summary?.pagesNeedingAttention ?? 0} brauchen Aufmerksamkeit</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <ShieldAlert size={15} />
                  <span className="text-xs">Offene Freigaben</span>
                </div>
                <p className="mt-2 text-2xl font-semibold">{pendingApprovals}</p>
                <p className="text-xs text-[var(--muted-foreground)]">warten auf Entscheidung</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <Layers size={15} />
                  <span className="text-xs">Datensätze</span>
                </div>
                <p className="mt-2 text-2xl font-semibold">{totalRecords}</p>
                <p className="text-xs text-[var(--muted-foreground)]">im Workspace</p>
              </div>
            </div>

            {canEdit && (
              <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldAlert size={15} />
                    Offene Freigaben
                  </h3>
                  <span className="text-xs text-[var(--muted-foreground)]">{approvals.length}</span>
                </div>
                {approvals.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">Keine offenen Freigaben.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {approvals.map((approval) => (
                      <div
                        key={approval.id}
                        className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{approval.title}</p>
                          <p className="truncate text-xs text-[var(--muted-foreground)]">
                            {approval.actionType}
                            {approval.impactAmount ? ` · ${approval.impactAmount} ${approval.impactCurrency ?? ""}` : ""}
                            {approval.description ? ` · ${approval.description}` : ""}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => void decide(approval.id, "approved")}
                            disabled={decidingId === approval.id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                          >
                            <Check size={14} />
                            Freigeben
                          </button>
                          <button
                            type="button"
                            onClick={() => void decide(approval.id, "rejected")}
                            disabled={decidingId === approval.id}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)] disabled:opacity-60"
                          >
                            <X size={14} />
                            Ablehnen
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Agenten suchen …"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 pl-9 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>

            {groups.length === 0 ? (
              <p className="py-10 text-center text-sm text-[var(--muted-foreground)]">Keine Agenten gefunden.</p>
            ) : (
              <div className="flex flex-col gap-5">
                {groups.map(([section, sectionItems]) => (
                  <section key={section}>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)]">
                      {section}
                      <span className="text-xs font-normal text-[var(--muted-foreground)]/70">{sectionItems.length}</span>
                    </h3>
                    <div className="flex flex-col gap-1.5">
                      {sectionItems.map((item) => (
                        <div
                          key={item.pageId}
                          className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] transition hover:bg-[var(--secondary)]/50"
                        >
                          <button
                            type="button"
                            onClick={() => navigateApp(pagePath(item.pageId))}
                            className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4 py-3 text-left"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{item.pageLabel || item.pageId}</p>
                              <p className="truncate text-xs text-[var(--muted-foreground)]">{item.module}{item.failedRunCount > 0 ? ` · ${item.failedRunCount} Fehler` : ""}</p>
                            </div>
                            <StatusBadge kind={statusKind(item)} label={statusLabel(item)} />
                          </button>
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => void startAgent(item.pageId)}
                              disabled={startingPageId === item.pageId}
                              title="Start"
                              aria-label="Start"
                              className="mr-3 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)] disabled:opacity-50"
                            >
                              {startedPageId === item.pageId ? (
                                <Check size={15} className="text-emerald-600" />
                              ) : (
                                <Play size={15} />
                              )}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
