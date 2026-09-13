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
  const records = useLiveRecords(resourceType, "limit=25");
  const [searchParams] = useSearchParams();
  const linkedRecordId = searchParams.get("recordId");
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

  const recentRecords = useMemo(
    () => {
      const sorted = visibleRecords
        .filter((record) => record.id !== linkedRecord?.id)
        .slice()
        .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));
      return linkedRecord ? [linkedRecord, ...sorted].slice(0, 6) : sorted.slice(0, 6);
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
          summaryBadge={t("Live page data")}
        />

        {resourceType ? (
          <section className="lulu-agent-kpi-grid grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article className="lulu-agent-kpi rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("Records")}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{records.total}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("Live records in this workflow")}</p>
            </article>
            <article className="lulu-agent-kpi rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("Active in view")}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{activeRecords}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("Loaded records not marked complete")}</p>
            </article>
            <article className="lulu-agent-kpi rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("Records shown")}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{recentRecords.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("Most recently updated records")}</p>
            </article>
            <article className="lulu-agent-kpi rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("Tags in view")}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{signalTags.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">{signalTags.length > 0 ? signalTags.join(" · ") : t("No dominant tags yet")}</p>
            </article>
          </section>
        ) : (
          <section className="grid gap-3 md:grid-cols-3">
            <article className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("Runs automatically")}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {agentContract.jobs.slice(0, 4).map((job) => (
                  <span key={job} className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-foreground">
                    {job}
                  </span>
                ))}
              </div>
            </article>
            <article className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("Connected systems")}</p>
              <p className="mt-3 text-sm text-foreground">
                {agentContract.integrations.length > 0 ? agentContract.integrations.slice(0, 4).join(" · ") : t("No integration dependency is defined for this page.")}
              </p>
            </article>
            <article className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("Autonomy boundary")}</p>
              <p className="mt-3 text-sm text-foreground">{t("Only new paid-media funds need customer authorization. Every other agent action executes automatically within system safeguards.")}</p>
            </article>
          </section>
        )}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)]">
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {resourceType ? t("Most important records") : t("What matters here")}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-foreground">
                  {resourceType ? t("Current live view") : t("How this agent helps")}
                </h2>
              </div>
            </div>

            {resourceType ? (
              linkedRecordLoading && recentRecords.length === 0 ? (
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
                    <article key={record.id} className={`rounded-lg border px-4 py-3 ${record.id === linkedRecordId ? "border-primary/40 bg-primary/5" : "border-border bg-background/50"}`}>
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
                    </article>
                  ))}
                </div>
              )
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <article className="rounded-lg border border-border bg-background/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">{t("Primary jobs")}</p>
                  <div className="mt-2 space-y-2 text-sm text-foreground">
                    {agentContract.jobs.slice(0, 4).map((job) => (
                      <div key={job}>{job}</div>
                    ))}
                  </div>
                </article>
                <article className="rounded-lg border border-border bg-background/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground">{t("Success metrics")}</p>
                  <div className="mt-2 space-y-2 text-sm text-foreground">
                    {agentContract.successMetrics.slice(0, 4).map((metric) => (
                      <div key={metric}>{metric}</div>
                    ))}
                  </div>
                </article>
              </div>
            )}
          </section>

          <div className="grid gap-5">
            <section className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {t("Autonomous execution")}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                {t("What Lulu handles here")}
              </h2>
              <div className="mt-4 space-y-3">
                <p className="rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
                  {t("Lulu continuously analyzes, decides and executes here. There is no approval queue; only missing funds, expired connections, compliance blocks or technical failures can pause execution.")}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
