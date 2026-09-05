import { useMemo } from "react";
import { useLuluApp } from "../api/LuluAppContext";
import { getPageContract, RESOURCE_BY_SLUG, type PageContract } from "../api/page-contracts";
import type { WorkspaceRecord } from "../api/records";
import { useLiveRecords } from "../api/useLiveRecords";
import { type LuluAgentContract } from "../config/lulu-agent-registry";
import { useTranslation } from "../i18n/GlobalLanguageSwitcher";
import { AgentRuntimeControlPanel } from "./AgentRuntimeControlPanel";
import { KnowledgeBaseWorkspace } from "./KnowledgeBaseWorkspace";
import { usePageAgentRun } from "./usePageAgentRun";
import { WorkspaceIntelligencePanel } from "./WorkspaceIntelligencePanel";

const OVERVIEW_RESOURCE_BY_PAGE_ID: Readonly<Record<string, string>> = {
  "finely-garden-9221": "ad_campaigns",
  "quietly-stone-4158": "finance_invoices",
  "fine-park-8079": "sales_deals",
  "eagerly-winter-3152": "marketing_campaigns",
  "smart-ocean-3898": "ecommerce_orders",
  "pure-minute-5446": "finance_invoices",
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return "—";
  return new Date(parsed).toLocaleString();
}

function resolveResourceType(slug: string, contract: PageContract | undefined) {
  if (contract?.kind === "resource") return contract.resourceType;
  if (contract?.kind === "billing") return "finance_invoices";
  return OVERVIEW_RESOURCE_BY_PAGE_ID[slug] ?? RESOURCE_BY_SLUG[slug] ?? null;
}

function recordNeedsAttention(record: WorkspaceRecord) {
  return /overdue|error|failed|pending|review|attention|due|draft|paused|risk/i.test(
    `${record.status} ${record.stage ?? ""} ${record.description ?? ""}`,
  );
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
  const { selectedWorkspace } = useLuluApp();
  const workspaceId = selectedWorkspace?.id ?? null;
  const resourceType = resolveResourceType(slug, contract);
  const records = useLiveRecords(resourceType, "limit=25");
  const pageRuntime = usePageAgentRun(workspaceId, agentContract, t);

  const recentRecords = useMemo(
    () =>
      records.items
        .slice()
        .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
        .slice(0, 6),
    [records.items],
  );

  const attentionRecords = useMemo(
    () => recentRecords.filter(recordNeedsAttention).slice(0, 5),
    [recentRecords],
  );

  const signalTags = useMemo(
    () => Array.from(new Set(records.items.flatMap((record) => record.tags).filter(Boolean))).slice(0, 4),
    [records.items],
  );

  const activeRecords = useMemo(
    () => records.items.filter((record) => !/done|completed|paid|won|archived|closed/i.test(record.status || "")).length,
    [records.items],
  );

  const approvalGates = agentContract.approvalPolicy.gates.slice(0, 3);
  const isKnowledgePage = slug === "rich-field-1880";

  return (
    <main className="min-h-screen bg-[var(--background)] text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 sm:px-8 sm:py-8">
        <header className="lulu-minimal-agent-page__header flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{agentContract.sectionLabel}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">{agentContract.pageLabel}</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{agentContract.objective}</p>
          </div>
        </header>

        <WorkspaceIntelligencePanel
          workspaceId={workspaceId}
          pageId={agentContract.pageId}
          title={`${agentContract.pageLabel} intelligence`}
          summaryBadge="Live page data"
        />

        <AgentRuntimeControlPanel runtime={pageRuntime} pageLabel={agentContract.pageLabel} />

        {isKnowledgePage ? <KnowledgeBaseWorkspace /> : null}

        {!isKnowledgePage && resourceType ? (
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("Records")}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{records.total}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("Live records in this workflow")}</p>
            </article>
            <article className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("Active")}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{activeRecords}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("Items not marked complete")}</p>
            </article>
            <article className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("Needs attention")}</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{attentionRecords.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("Flagged by status, stage or description")}</p>
            </article>
            <article className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("Signal tags")}</p>
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
              <p className="text-xs text-muted-foreground">{t("Approval boundary")}</p>
              <p className="mt-3 text-sm text-foreground">
                {agentContract.approvalPolicy.requiresApproval
                  ? approvalGates.join(" · ")
                  : t("This agent only needs approval when the user triggers a sensitive action.")}
              </p>
            </article>
          </section>
        )}

        {!isKnowledgePage ? <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)]">
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
              records.loading && recentRecords.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">{t("Loading live records…")}</p>
              ) : records.error ? (
                <p className="mt-4 rounded-lg border border-dashed border-border px-4 py-6 text-sm text-destructive">{records.error}</p>
              ) : recentRecords.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">{t("No live records are available for this page yet.")}</p>
              ) : (
                <div className="mt-4 grid gap-3">
                  {recentRecords.map((record) => (
                    <article key={record.id} className="rounded-lg border border-border bg-background/50 px-4 py-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
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
                          {t("Updated")}: {formatDate(record.updatedAt)}
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
                {resourceType ? t("Needs attention") : t("Approval boundary")}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                {resourceType ? t("Priority queue") : t("What still needs a user decision")}
              </h2>
              <div className="mt-4 space-y-3">
                {resourceType ? (
                  attentionRecords.length > 0 ? (
                    attentionRecords.map((record) => (
                      <article key={record.id} className="rounded-lg border border-border bg-background/50 px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <strong className="text-sm text-foreground">{record.name}</strong>
                          <span className="text-xs text-muted-foreground">{record.status}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{record.description ?? record.stage ?? t("No additional detail")}</p>
                      </article>
                    ))
                  ) : (
                    <p className="rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
                      {t("No records are currently flagged for attention.")}
                    </p>
                  )
                ) : agentContract.approvalPolicy.requiresApproval ? (
                  approvalGates.map((gate) => (
                    <article key={gate} className="rounded-lg border border-border bg-background/50 px-4 py-3 text-sm text-foreground">
                      {gate}
                    </article>
                  ))
                ) : (
                  <p className="rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
                    {t("This page is already reduced to the essential view. Sensitive actions still require explicit approval where relevant.")}
                  </p>
                )}
              </div>
            </section>
          </div>
        </div> : null}
      </div>
    </main>
  );
}
