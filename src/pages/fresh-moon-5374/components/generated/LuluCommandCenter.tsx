import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Check,
  CheckCircle2,
  Layers,
  Pencil,
  Search,
  ShieldAlert,
  Square,
  Trash2,
  X,
} from "lucide-react";
import {
  agentApi,
  type AgentHealth,
  type AgentHealthItem,
  type AgentRun,
} from "../../../../api/agents";
import { workspaceApi } from "../../../../api/workspaces";
import type { WorkspaceBootstrap } from "../../../../api/types";
import { approvalApi, type Approval } from "../../../../api/approvals";
import {
  archiveRecord,
  listRecords,
  listResourceTypes,
  updateRecord,
  type ResourceTypeDefinition,
  type WorkspaceRecord,
} from "../../../../api/records";
import { getFriendlyErrorMessage } from "../../../../api/client";
import { getSelectedWorkspaceId } from "../../../../api/session";
import { isPageAvailable, navigateApp, pagePath } from "../../../../routing";

type StatusKind = "ok" | "warn" | "danger" | "idle";

const ACTIVE_RUN_STATUSES = new Set(["queued", "planning", "running", "waiting_approval"]);

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

function runPageId(run: AgentRun): string | null {
  const page = run.plan?.page;
  if (page && typeof page === "object") {
    const value = (page as Record<string, unknown>).pageId;
    if (typeof value === "string") return value;
  }
  return null;
}

export function LuluCommandCenter() {
  const workspaceId = getSelectedWorkspaceId();
  const [health, setHealth] = useState<AgentHealth | null>(null);
  const [bootstrap, setBootstrap] = useState<WorkspaceBootstrap | null>(null);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [activeRuns, setActiveRuns] = useState<Map<string, string>>(new Map());
  const [resourceTypes, setResourceTypes] = useState<ResourceTypeDefinition[]>([]);
  const [selectedResourceType, setSelectedResourceType] = useState<string | null>(null);
  const [records, setRecords] = useState<WorkspaceRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [busyRecordId, setBusyRecordId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [decidingId, setDecidingId] = useState<string | null>(null);
  const [cancellingPageId, setCancellingPageId] = useState<string | null>(null);

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

  const loadRuns = useCallback(async () => {
    if (!workspaceId) return;
    try {
      const result = await agentApi.list(workspaceId);
      const next = new Map<string, string>();
      for (const run of result.data.items) {
        if (!ACTIVE_RUN_STATUSES.has(run.status)) continue;
        const pageId = runPageId(run);
        if (pageId) next.set(pageId, run.id);
      }
      setActiveRuns(next);
    } catch {
      setActiveRuns(new Map());
    }
  }, [workspaceId]);

  const loadResourceTypes = useCallback(async () => {
    try {
      const result = await listResourceTypes();
      const items = result.data.items;
      setResourceTypes(items);
      if (items.length && !selectedResourceType) setSelectedResourceType(items[0].key);
    } catch {
      setResourceTypes([]);
    }
  }, [selectedResourceType]);

  const loadRecords = useCallback(async (resourceType: string) => {
    if (!resourceType) return;
    setRecordsLoading(true);
    try {
      const result = await listRecords(resourceType);
      setRecords(result.data.items);
    } catch {
      setRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    void loadApprovals();
    void loadRuns();
    void loadResourceTypes();
  }, [load, loadApprovals, loadRuns, loadResourceTypes]);

  useEffect(() => {
    if (selectedResourceType) void loadRecords(selectedResourceType);
  }, [selectedResourceType, loadRecords]);

  const canEdit = bootstrap?.permissions.canEdit ?? false;

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

  const cancelAgent = async (pageId: string) => {
    const runId = activeRuns.get(pageId);
    if (!workspaceId || !runId || cancellingPageId) return;
    setCancellingPageId(pageId);
    setActionError("");
    try {
      await agentApi.cancel(workspaceId, runId);
      await Promise.all([load(), loadRuns()]);
    } catch (cause) {
      setActionError(getFriendlyErrorMessage(cause, "Agent konnte nicht gestoppt werden."));
    } finally {
      setCancellingPageId(null);
    }
  };

  const saveRecord = async (record: WorkspaceRecord) => {
    if (!selectedResourceType || busyRecordId) return;
    const name = editName.trim();
    if (!name) return;
    setBusyRecordId(record.id);
    setActionError("");
    try {
      await updateRecord(selectedResourceType, record.id, { name });
      setEditingRecordId(null);
      await loadRecords(selectedResourceType);
    } catch (cause) {
      setActionError(getFriendlyErrorMessage(cause, "Datensatz konnte nicht gespeichert werden."));
    } finally {
      setBusyRecordId(null);
    }
  };

  const deleteRecord = async (record: WorkspaceRecord) => {
    if (!selectedResourceType || busyRecordId) return;
    setBusyRecordId(record.id);
    setActionError("");
    try {
      await archiveRecord(selectedResourceType, record.id);
      await loadRecords(selectedResourceType);
    } catch (cause) {
      setActionError(getFriendlyErrorMessage(cause, "Datensatz konnte nicht gelöscht werden."));
    } finally {
      setBusyRecordId(null);
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
        <div>
          <h2 className="text-lg font-semibold">Steuerzentrale</h2>
          <p className="text-sm text-[var(--muted-foreground)]">Alle Agenten, Systeme und Freigaben an einem Ort.</p>
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

            <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldAlert size={15} />
                  Offene Freigaben
                </h3>
                <span className="text-xs text-[var(--muted-foreground)]">{approvals.length}</span>
              </div>
              {!canEdit && (
                <p className="mb-2 text-xs text-[var(--muted-foreground)]">Nur lesbar</p>
              )}
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
                      {canEdit && (
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
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Layers size={15} />
                Datensätze
              </h3>
              <div className="mb-3 flex flex-wrap gap-2">
                {resourceTypes.map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => setSelectedResourceType(type.key)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${selectedResourceType === type.key ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"}`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
              {recordsLoading ? (
                <p className="text-sm text-[var(--muted-foreground)]">Datensätze werden geladen …</p>
              ) : records.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">Keine Datensätze.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {records.map((record) => (
                    <div
                      key={record.id}
                      className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                    >
                      {editingRecordId === record.id ? (
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <input
                            value={editName}
                            onChange={(event) => setEditName(event.target.value)}
                            autoFocus
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
                          />
                          <button
                            type="button"
                            onClick={() => void saveRecord(record)}
                            disabled={busyRecordId === record.id}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                          >
                            <Check size={13} />
                            Speichern
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingRecordId(null)}
                            className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-semibold text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"
                          >
                            Abbrechen
                          </button>
                        </div>
                      ) : (
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{record.name}</p>
                          <p className="truncate text-xs text-[var(--muted-foreground)]">{record.status}</p>
                        </div>
                      )}
                      {canEdit && editingRecordId !== record.id && (
                        <div className="flex shrink-0 items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => { setEditingRecordId(record.id); setEditName(record.name); }}
                            title="Bearbeiten"
                            aria-label="Bearbeiten"
                            className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)]"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteRecord(record)}
                            disabled={busyRecordId === record.id}
                            title="Löschen"
                            aria-label="Löschen"
                            className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)] disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

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
                      {sectionItems.map((item) => {
                        const activeRunId = activeRuns.get(item.pageId);
                        return (
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
                            {canEdit && activeRunId ? (
                              <button
                                type="button"
                                onClick={() => void cancelAgent(item.pageId)}
                                disabled={cancellingPageId === item.pageId}
                                title="Stoppen"
                                aria-label="Stoppen"
                                className="mr-3 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[var(--destructive)]/40 text-[var(--destructive)] transition hover:bg-[var(--destructive)]/10 disabled:opacity-50"
                              >
                                <Square size={13} />
                              </button>
                            ) : null}
                          </div>
                        );
                      })}
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
