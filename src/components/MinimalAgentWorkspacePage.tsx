import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLuluApp } from "../api/LuluAppContext";
import { getFriendlyErrorMessage } from "../api/client";
import { getPageContract, RESOURCE_BY_SLUG, type PageContract } from "../api/page-contracts";
import { getRecord, type WorkspaceRecord } from "../api/records";
import { useLiveRecords } from "../api/useLiveRecords";
import { type LuluAgentContract } from "../config/lulu-agent-registry";
import { useLanguage, useTranslation } from "../i18n/GlobalLanguageSwitcher";
import { WorkspaceIntelligencePanel } from "./WorkspaceIntelligencePanel";

const OVERVIEW_RESOURCE_BY_PAGE_ID: Readonly<Record<string, string>> = {
  "finely-garden-9221": "ad_campaigns",
  "quietly-stone-4158": "finance_invoices",
  "fine-park-8079": "sales_deals",
  "eagerly-winter-3152": "marketing_campaigns",
  "smart-ocean-3898": "ecommerce_orders",
  "pure-minute-5446": "finance_invoices",
};

function formatDate(value: string | null | undefined, language: string) {
  if (!value) return "—";
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return "—";
  return new Date(parsed).toLocaleString(language);
}

function resolveResourceType(slug: string, contract: PageContract | undefined) {
  if (contract?.kind === "resource") return contract.resourceType;
  if (contract?.kind === "billing") return "finance_invoices";
  return OVERVIEW_RESOURCE_BY_PAGE_ID[slug] ?? RESOURCE_BY_SLUG[slug] ?? null;
}

function formatRecordValue(value: unknown, language: string) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return new Intl.NumberFormat(language).format(value);
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function fillTranslation(template: string, values: Array<string | number>) {
  return values.reduce<string>((result, value, index) => result.replace(`{{${index + 1}}}`, String(value)), template);
}

export function MinimalAgentWorkspacePage({
  slug,
  contract,
  agentContract,
}: {
  slug: string;
  contract: PageContract | undefined;
  agentContract: LuluAgentContract;
}) {
  const t = useTranslation();
  const language = useLanguage();
  const { selectedWorkspace } = useLuluApp();
  const workspaceId = selectedWorkspace?.id ?? null;
  const resourceType = resolveResourceType(slug, contract);
  const [searchParams] = useSearchParams();
  const linkedRecordId = searchParams.get("recordId");
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState<"createdAt" | "updatedAt" | "name">("updatedAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const recordsQuery = useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(pageSize),
      includeTotal: "true",
      sort,
      order,
    });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    return params.toString();
  }, [order, page, search, sort, statusFilter]);
  const records = useLiveRecords(resourceType, recordsQuery, { includeTotal: true });
  const recordsLoaded = records.configured && (records.status === "ready" || records.status === "stale");
  const dataState = !records.configured
    ? { label: "Not configured", className: "border-chart-1/30 bg-chart-1/10 text-chart-1" }
    : records.status === "ready"
      ? { label: "Live", className: "border-chart-4/30 bg-chart-4/10 text-chart-4" }
      : records.status === "stale"
        ? { label: "Refresh needed", className: "border-chart-1/30 bg-chart-1/10 text-chart-1" }
        : records.status === "error"
          ? { label: "Unavailable", className: "border-chart-5/30 bg-chart-5/10 text-chart-5" }
          : { label: "Waiting", className: "border-border bg-secondary text-muted-foreground" };
  const linkedKey = workspaceId && resourceType && linkedRecordId
    ? `${workspaceId}:${resourceType}:${linkedRecordId}`
    : null;
  const [linkedRecordState, setLinkedRecordState] = useState<{ key: string; record: WorkspaceRecord } | null>(null);
  const [linkedRecordFailure, setLinkedRecordFailure] = useState<{ key: string; message: string } | null>(null);
  const [linkedRecordLoadingKey, setLinkedRecordLoadingKey] = useState<string | null>(null);
  const linkedRequestRef = useRef(0);
  const linkedRecord = linkedRecordState?.key === linkedKey ? linkedRecordState.record : null;
  const linkedRecordError = linkedRecordFailure?.key === linkedKey ? linkedRecordFailure.message : null;
  const linkedRecordLoading = Boolean(linkedKey && linkedRecordLoadingKey === linkedKey);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(linkedRecordId);

  useEffect(() => {
    setSelectedRecordId(linkedRecordId);
  }, [linkedRecordId]);

  useEffect(() => {
    const request = ++linkedRequestRef.current;
    if (!linkedKey || !linkedRecordId || !resourceType || !workspaceId) {
      setLinkedRecordLoadingKey(null);
      return;
    }
    const listedRecord = records.items.find((record) => record.id === linkedRecordId);
    if (listedRecord) {
      setLinkedRecordState({ key: linkedKey, record: listedRecord });
      setLinkedRecordFailure(null);
      setLinkedRecordLoadingKey(null);
      return;
    }
    setLinkedRecordLoadingKey(linkedKey);
    void getRecord(resourceType, linkedRecordId).then((response) => {
      if (request !== linkedRequestRef.current || selectedWorkspace?.id !== workspaceId) return;
      setLinkedRecordState({ key: linkedKey, record: response.data });
      setLinkedRecordFailure(null);
    }).catch((cause) => {
      if (request !== linkedRequestRef.current || selectedWorkspace?.id !== workspaceId) return;
      setLinkedRecordFailure({
        key: linkedKey,
        message: getFriendlyErrorMessage(cause, "The selected record could not be loaded."),
      });
    }).finally(() => {
      if (request === linkedRequestRef.current) setLinkedRecordLoadingKey(null);
    });
    return () => { linkedRequestRef.current += 1; };
  }, [linkedKey, linkedRecordId, records.items, resourceType, selectedWorkspace?.id, workspaceId]);

  const visibleRecords = useMemo(
    () => linkedRecord
      ? [linkedRecord, ...records.items.filter((record) => record.id !== linkedRecord.id)]
      : records.items,
    [linkedRecord, records.items],
  );

  const selectedRecord = useMemo(
    () => linkedRecord ?? visibleRecords.find((record) => record.id === selectedRecordId) ?? null,
    [linkedRecord, selectedRecordId, visibleRecords],
  );

  const statusOptions = useMemo(
    () => Array.from(new Set(records.items.map((record) => record.status).filter(Boolean))).sort(),
    [records.items],
  );

  const totalPages = Math.max(1, Math.ceil(records.total / pageSize));
  const pageStart = records.total === 0 ? 0 : (page - 1) * pageSize + 1;
  const pageEnd = Math.min(page * pageSize, records.total);
  const recordDataEntries = useMemo(
    () => selectedRecord
      ? Object.entries(selectedRecord.data ?? {}).filter(([, value]) => value !== null && value !== undefined).slice(0, 12)
      : [],
    [selectedRecord],
  );

  const recentRecords = useMemo(
    () => {
      const sorted = visibleRecords
        .filter((record) => record.id !== linkedRecord?.id)
        .slice()
        .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));
      return linkedRecord ? [linkedRecord, ...sorted] : sorted;
    },
    [linkedRecord, visibleRecords],
  );

  const signalTags = useMemo(
    () => Array.from(new Set(visibleRecords.flatMap((record) => record.tags).filter(Boolean))).slice(0, 4),
    [visibleRecords],
  );

  const activeRecords = useMemo(
    () => visibleRecords.filter((record) => !/done|completed|paid|won|archived|closed/i.test(record.status || "")).length,
    [visibleRecords],
  );

  return (
    <main className="lulu-minimal-agent-page min-h-screen bg-[var(--background)] text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 sm:px-8 sm:py-8">
        <WorkspaceIntelligencePanel
          workspaceId={workspaceId}
          pageId={agentContract.pageId}
          title={`${t(agentContract.pageLabel)} ${t("intelligence")}`}
          summaryBadge={t(recordsLoaded ? "Live page data" : dataState.label)}
        />

        {resourceType ? <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground" role="status" aria-live="polite">
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${dataState.className}`}>
            <span className="h-2 w-2 rounded-full bg-current" />
            {t(dataState.label)}
          </span>
          {records.lastLoadedAt ? <span className="rounded-full border border-border bg-card px-3 py-1.5">
            {t("Last updated")} {formatDate(records.lastLoadedAt, language)}
          </span> : null}
          {records.status === "stale" && records.error ? <span className="max-w-full rounded-full border border-chart-1/30 bg-chart-1/5 px-3 py-1.5 text-chart-1">
            {t("The latest refresh failed. Only the last successfully loaded records are shown.")}
          </span> : null}
        </div> : null}

        {resourceType ? (
          <section className="lulu-agent-kpi-grid grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article className="lulu-agent-kpi rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("Records")}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{recordsLoaded ? records.total : "—"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("Live records in this workflow")}</p>
            </article>
            <article className="lulu-agent-kpi rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("Active in view")}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{recordsLoaded ? activeRecords : "—"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("Loaded records not marked complete")}</p>
            </article>
            <article className="lulu-agent-kpi rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("Records shown")}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{recordsLoaded ? recentRecords.length : "—"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("Most recently updated records")}</p>
            </article>
            <article className="lulu-agent-kpi rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("Tags in view")}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{recordsLoaded ? signalTags.length : "—"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{recordsLoaded && signalTags.length > 0 ? signalTags.join(" · ") : recordsLoaded ? t("No dominant tags yet") : t("Waiting for workspace data")}</p>
            </article>
          </section>
        ) : (
          <section className="grid gap-3 md:grid-cols-3">
            <article className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("Runs automatically")}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {agentContract.jobs.slice(0, 4).map((job) => (
                  <span key={job} className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-foreground">
                    {t(job)}
                  </span>
                ))}
              </div>
            </article>
            <article className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("Connected systems")}</p>
              <p className="mt-3 text-sm text-foreground">
                {agentContract.integrations.length > 0 ? agentContract.integrations.slice(0, 4).map((integration) => t(integration)).join(" · ") : t("No integration dependency is defined for this page.")}
              </p>
            </article>
            <article className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("Autonomy boundary")}</p>
              <p className="mt-3 text-sm text-foreground">{t("Lulu runs autonomously within registered policies. Before an external action, the server rechecks authorization, funding, provider readiness and verification.")}</p>
            </article>
          </section>
        )}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)]">
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {resourceType ? t("Most important records") : t("What matters here")}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-foreground">
                  {resourceType ? t("Current live view") : t("How this agent helps")}
                </h2>
              </div>
              {resourceType ? (
                <button
                  type="button"
                  onClick={() => void records.refresh()}
                  disabled={records.loading}
                  className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-background disabled:cursor-wait disabled:opacity-60"
                >
                  {records.loading ? t("Loading…") : t("Refresh")}
                </button>
              ) : null}
            </div>

            {resourceType ? (
              <>
                <form
                  className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setPage(1);
                    setSearch(searchDraft.trim());
                  }}
                >
                  <input
                    value={searchDraft}
                    onChange={(event) => setSearchDraft(event.target.value)}
                    placeholder={t("Search live records")}
                    aria-label={t("Search live records")}
                    className="min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <select
                    value={statusFilter}
                    onChange={(event) => { setPage(1); setStatusFilter(event.target.value); }}
                    aria-label={t("Filter by status")}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  >
                    <option value="">{t("All statuses")}</option>
                    {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                  <select
                    value={`${sort}:${order}`}
                    onChange={(event) => {
                      const [nextSort, nextOrder] = event.target.value.split(":") as ["createdAt" | "updatedAt" | "name", "asc" | "desc"];
                      setPage(1);
                      setSort(nextSort);
                      setOrder(nextOrder);
                    }}
                    aria-label={t("Sort records")}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  >
                    <option value="updatedAt:desc">{t("Recently updated")}</option>
                    <option value="createdAt:desc">{t("Recently created")}</option>
                    <option value="name:asc">{t("Name A–Z")}</option>
                    <option value="name:desc">{t("Name Z–A")}</option>
                  </select>
                  <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                    {t("Search")}
                  </button>
                </form>

                {linkedRecordLoading && recentRecords.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">{t("Loading selected record…")}</p>
              ) : linkedRecordError && recentRecords.length === 0 ? (
                <p role="alert" className="mt-4 rounded-lg border border-dashed border-border px-4 py-6 text-sm text-destructive">{linkedRecordError}</p>
              ) : records.loading && recentRecords.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">{t("Loading live records…")}</p>
              ) : records.error && recentRecords.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-border px-4 py-6 text-sm text-destructive">{records.error}</p>
              ) : recentRecords.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">{t("No live records are available for this page yet.")}</p>
              ) : (
                <div className="mt-4 grid gap-3">
                  {linkedRecordError ? <p role="alert" className="rounded-lg border border-dashed border-border px-4 py-3 text-sm text-destructive">{linkedRecordError}</p> : null}
                  {records.error ? <p role="status" className="rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">{records.error}</p> : null}
                  {recentRecords.map((record) => (
                    <button
                      type="button"
                      key={record.id}
                      onClick={() => setSelectedRecordId(record.id)}
                      aria-pressed={record.id === selectedRecord?.id}
                      className={`w-full rounded-lg border px-4 py-3 text-left transition hover:border-primary/50 hover:bg-primary/5 ${record.id === selectedRecord?.id ? "border-primary/40 bg-primary/5" : "border-border bg-background/50"}`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          {record.id === linkedRecordId ? <p className="mb-1 text-[10px] font-semibold uppercase tracking-[.12em] text-primary">{t("Selected record")}</p> : null}
                          <div className="text-sm font-medium text-foreground">{record.name}</div>
                          <div className="mt-1 text-sm text-muted-foreground">{record.description ?? t("No additional detail")}</div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <div>{record.status || "—"}</div>
                          <div className="mt-1">{record.stage ?? "—"}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span>
                          {t("Value")}: {record.valueAmount ?? "—"} {record.currency ?? ""}
                        </span>
                        <span>
                          {t("Updated")}: {formatDate(record.updatedAt, language)}
                        </span>
                      </div>
                      <div className="mt-3 text-xs font-semibold text-primary">{t("Open record")}</div>
                    </button>
                  ))}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                    <span>{fillTranslation(t("Showing {{1}}–{{2}} of {{3}}"), [pageStart, pageEnd, records.total])}</span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1 || records.loading} className="rounded-lg border border-border px-3 py-1.5 font-semibold text-foreground disabled:opacity-40">{t("Previous")}</button>
                      <span>{fillTranslation(t("Page {{1}} of {{2}}"), [page, totalPages])}</span>
                      <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages || records.loading} className="rounded-lg border border-border px-3 py-1.5 font-semibold text-foreground disabled:opacity-40">{t("Next")}</button>
                    </div>
                  </div>
                </div>
              )}
              </>
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <article className="rounded-lg border border-border bg-background/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">{t("Primary jobs")}</p>
                  <div className="mt-2 space-y-2 text-sm text-foreground">
                    {agentContract.jobs.slice(0, 4).map((job) => (
                      <div key={job}>{t(job)}</div>
                    ))}
                  </div>
                </article>
                <article className="rounded-lg border border-border bg-background/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">{t("Success metrics")}</p>
                  <div className="mt-2 space-y-2 text-sm text-foreground">
                    {agentContract.successMetrics.slice(0, 4).map((metric) => (
                      <div key={metric}>{t(metric)}</div>
                    ))}
                  </div>
                </article>
              </div>
            )}
          </section>

          <div className="grid gap-5">
            {resourceType ? (
              <section className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{t("Record details")}</p>
                {selectedRecord ? (
                  <>
                    <h2 className="mt-1 text-lg font-semibold text-foreground">{selectedRecord.name}</h2>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-border bg-background px-2.5 py-1 text-foreground">{selectedRecord.status || "—"}</span>
                      {selectedRecord.stage ? <span className="rounded-full border border-border bg-background px-2.5 py-1 text-muted-foreground">{selectedRecord.stage}</span> : null}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{selectedRecord.description ?? t("No additional detail")}</p>
                    <dl className="mt-4 grid gap-2 text-xs">
                      <div className="flex justify-between gap-3 border-b border-border pb-2"><dt className="text-muted-foreground">{t("Updated")}</dt><dd className="text-right text-foreground">{formatDate(selectedRecord.updatedAt, language)}</dd></div>
                      <div className="flex justify-between gap-3 border-b border-border pb-2"><dt className="text-muted-foreground">{t("Source")}</dt><dd className="text-right text-foreground">{selectedRecord.source ?? "—"}</dd></div>
                      <div className="flex justify-between gap-3 border-b border-border pb-2"><dt className="text-muted-foreground">{t("Value")}</dt><dd className="text-right text-foreground">{selectedRecord.valueAmount ?? "—"} {selectedRecord.currency ?? ""}</dd></div>
                    </dl>
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{t("Data fields")}</p>
                      {recordDataEntries.length > 0 ? (
                        <dl className="mt-2 space-y-2 text-xs">
                          {recordDataEntries.map(([key, value]) => <div key={key} className="grid grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] gap-3 border-b border-border/70 pb-2"><dt className="break-words text-muted-foreground">{key}</dt><dd className="break-words text-right text-foreground">{formatRecordValue(value, language)}</dd></div>)}
                        </dl>
                      ) : <p className="mt-2 text-sm text-muted-foreground">{t("No additional fields returned.")}</p>}
                    </div>
                  </>
                ) : (
                  <p className="mt-3 rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">{t("Select a record to inspect its live fields.")}</p>
                )}
              </section>
            ) : null}
            <section className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {t("Autonomous execution")}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                {t("What Lulu handles here")}
              </h2>
              <div className="mt-4 space-y-3">
                <p className="rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
                  {t("Lulu continuously observes, analyzes and prepares work here. A consequential action continues only when the canonical execution policy permits the workspace, capability, provider state, funding and verification route.")}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
