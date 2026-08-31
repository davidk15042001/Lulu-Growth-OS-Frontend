import { CheckCircle2, Clock3, Play, RefreshCw, ShieldAlert, XCircle } from "lucide-react";
import { formatLiveDate } from "../api/live-panel-ui";
import type { AgentRunStatus, AgentStep } from "../api/agents";
import { useTranslation } from "../i18n/GlobalLanguageSwitcher";
import { usePageAgentRun } from "./usePageAgentRun";

type PageAgentRunController = ReturnType<typeof usePageAgentRun>;

function statusTone(status: AgentRunStatus | string) {
  if (status === "completed") return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  if (status === "waiting_approval") return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  if (status === "failed" || status === "cancelled") return "border-destructive/20 bg-destructive/10 text-destructive";
  return "border-border bg-background/60 text-foreground";
}

function stepTone(step: AgentStep) {
  if (step.status === "completed") return "text-emerald-600 dark:text-emerald-300";
  if (step.status === "waiting_approval") return "text-amber-600 dark:text-amber-300";
  if (step.status === "failed" || step.status === "cancelled") return "text-destructive";
  return "text-foreground";
}

export function AgentRuntimeControlPanel({
  runtime,
  pageLabel,
}: {
  runtime: PageAgentRunController;
  pageLabel: string;
}) {
  const t = useTranslation();
  const currentRun = runtime.details?.run ?? runtime.latestRun;
  const status = currentRun?.status ?? "idle";
  const stepCount = runtime.details?.steps.length ?? 0;
  const approvalCount = runtime.pendingApprovalSteps.length;
  const isRunning = status === "queued" || status === "planning" || status === "running";
  const isBlocked = status === "waiting_approval";

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{t("Agent runtime")}</p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">{t("Run control and approvals")}</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {t("This is the live execution layer for this page agent, including the current run, recent steps and approvals.")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void runtime.start()}
            disabled={runtime.acting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Play size={15} />
            {currentRun ? t("Start new run") : t("Start agent")}
          </button>
          <button
            type="button"
            onClick={() => void runtime.refresh()}
            disabled={runtime.loading || runtime.acting}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={15} />
            {t("Refresh")}
          </button>
          {currentRun && isRunning ? (
            <button
              type="button"
              onClick={() => void runtime.cancel()}
              disabled={runtime.acting}
              className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <XCircle size={15} />
              {t("Cancel run")}
            </button>
          ) : null}
        </div>
      </div>

      {runtime.error ? (
        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {runtime.error}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <article className="rounded-lg border border-border bg-background/60 p-4">
          <p className="text-xs text-muted-foreground">{t("Run status")}</p>
          <div className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone(status)}`}>
            {status}
          </div>
        </article>
        <article className="rounded-lg border border-border bg-background/60 p-4">
          <p className="text-xs text-muted-foreground">{t("Latest run")}</p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {currentRun ? formatLiveDate(currentRun.updatedAt) : t("No run yet")}
          </p>
        </article>
        <article className="rounded-lg border border-border bg-background/60 p-4">
          <p className="text-xs text-muted-foreground">{t("Steps")}</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{stepCount}</p>
        </article>
        <article className="rounded-lg border border-border bg-background/60 p-4">
          <p className="text-xs text-muted-foreground">{t("Approvals")}</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{approvalCount}</p>
        </article>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section className="rounded-lg border border-border bg-background/40 p-4">
          <div className="flex items-center gap-2">
            <Clock3 size={16} className="text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">{t("Recent steps")}</h3>
          </div>
          <div className="mt-4 space-y-3">
            {runtime.recentSteps.length > 0 ? runtime.recentSteps.map((step) => (
              <article key={step.id} className="rounded-lg border border-border bg-background/70 px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-medium ${stepTone(step)}`}>{step.sequenceNo}. {step.title}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      {step.agentRole} {step.toolName ? `· ${step.toolName}` : ""}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{step.instruction}</p>
                    {step.errorMessage ? <p className="mt-2 text-sm text-destructive">{step.errorMessage}</p> : null}
                  </div>
                  <div className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone(step.status)}`}>
                    {step.status}
                  </div>
                </div>
              </article>
            )) : (
              <p className="rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
                {runtime.loading ? t("Loading the latest agent steps…") : t("No step timeline exists for this page agent yet.")}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-background/40 p-4">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">{t("Approval queue")}</h3>
          </div>
          <div className="mt-4 space-y-3">
            {runtime.pendingApprovalSteps.length > 0 ? runtime.pendingApprovalSteps.map((step) => (
              <article key={step.id} className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">{step.title}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      {pageLabel} · {step.agentRole}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{step.instruction}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void runtime.decide(step.id, "approved")}
                    disabled={runtime.acting}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CheckCircle2 size={15} />
                    {t("Approve")}
                  </button>
                  <button
                    type="button"
                    onClick={() => void runtime.decide(step.id, "rejected")}
                    disabled={runtime.acting}
                    className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <XCircle size={15} />
                    {t("Reject")}
                  </button>
                </div>
              </article>
            )) : (
              <p className="rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
                {isBlocked
                  ? t("This run is blocked, but the backend has not returned any actionable approval step yet.")
                  : t("No approval is currently waiting for this page agent.")}
              </p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
