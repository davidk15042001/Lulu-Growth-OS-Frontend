import { BrainCircuit, Clock3, Coins, Eye, RotateCcw, ShieldCheck, XCircle } from "lucide-react";
import { formatLiveDate } from "../api/live-panel-ui";
import type { AgentRunStatus, AgentStep } from "../api/agents";
import type { WorkspaceRecord } from "../api/records";
import { useLanguage, useTranslation } from "../i18n/GlobalLanguageSwitcher";
import { toIntlLocale } from "../i18n/languages";
import { usePageAgentRun } from "./usePageAgentRun";

type PageAgentRunController = ReturnType<typeof usePageAgentRun>;

function statusTone(status: AgentRunStatus | string) {
  if (status === "completed") return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  if (status === "waiting_approval") return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  if (status === "failed" || status === "cancelled") return "border-destructive/20 bg-destructive/10 text-destructive";
  return "border-border bg-background/60 text-foreground";
}

function statusLabel(status: AgentRunStatus | string, t: (key: string) => string) {
  const labels: Record<string, string> = {
    idle: "Not started",
    queued: "Queued",
    planning: "Planning",
    running: "Working",
    waiting_approval: "Waiting for approval",
    completed: "Completed",
    failed: "Failed",
    cancelled: "Cancelled",
    pending: "Waiting for provider",
  };
  return t(labels[status] ?? status);
}

function statusDescription(status: AgentRunStatus | string, t: (key: string) => string) {
  const descriptions: Record<string, string> = {
    queued: "The run is waiting for its turn.",
    planning: "The coordinator is framing the objective and evidence requirements.",
    running: "Specialists are working through the bounded execution plan.",
    waiting_approval: "The run is paused until the required approval is available.",
    completed: "The result was recorded and passed the available checks.",
    failed: "The run stopped with a recorded failure and will not replay external work automatically.",
    cancelled: "The run was cancelled before completion.",
  };
  return t(descriptions[status] ?? "The run state is recorded by the backend.");
}

function stepTone(step: AgentStep) {
  if (step.status === "completed") return "text-emerald-600 dark:text-emerald-300";
  if (step.status === "waiting_approval") return "text-amber-600 dark:text-amber-300";
  if (step.status === "failed" || step.status === "cancelled") return "text-destructive";
  return "text-foreground";
}

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stringList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
}

function packetExecutionStatus(packet: WorkspaceRecord) {
  return textValue(packet.data.executionStatus) || packet.stage || packet.status;
}

function isPlanningOnlyPacket(packet: WorkspaceRecord) {
  return textValue(packet.data.executionBoundary) === "planning_artifact_only"
    || textValue(packet.data.executionStatus) === "planned"
    || packet.stage === "planned";
}

function boundaryLabel(packet: WorkspaceRecord, t: (key: string) => string) {
  if (isPlanningOnlyPacket(packet)) return t("Planning only");
  if (textValue(packet.data.executionBoundary) === "canonical_domain_action" && packet.data.sideEffectsApplied === true) return t("Canonical action");
  return t("Not yet verified");
}

function resultCount(packet: WorkspaceRecord) {
  const ids = packet.data.resultRecordIds;
  return Array.isArray(ids) ? ids.length : 0;
}

function recordTone(record: WorkspaceRecord) {
  const status = `${record.status} ${record.stage ?? ""} ${packetExecutionStatus(record)}`.toLowerCase();
  if (status.includes("failed") || status.includes("error")) return "border-destructive/20 bg-destructive/5";
  if (isPlanningOnlyPacket(record)) return "border-sky-500/20 bg-sky-500/5";
  if (status.includes("executed") || status.includes("completed")) return "border-emerald-500/20 bg-emerald-500/5";
  if (status.includes("waiting") || status.includes("approval")) return "border-amber-500/20 bg-amber-500/5";
  return "border-border bg-background/70";
}

function payloadPreview(value: Record<string, unknown> | null | undefined) {
  if (!value) return "";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
}

function tokenCount(value: number | undefined, locale: string) {
  return typeof value === "number" ? value.toLocaleString(locale) : "0";
}

function costValue(value: number | undefined) {
  return typeof value === "number" ? `$${value.toFixed(4)}` : "$0.0000";
}

export function AgentRuntimeControlPanel({
  runtime,
  pageLabel,
}: {
  runtime: PageAgentRunController;
  pageLabel: string;
}) {
  const t = useTranslation();
  const language = useLanguage();
  const locale = toIntlLocale(language);
  const currentRun = runtime.details?.run ?? runtime.latestRun;
  const status = currentRun?.status ?? "idle";
  const stepCount = runtime.details?.steps.length ?? 0;
  const isRunning = status === "queued" || status === "planning" || status === "running";
  const canRetry = status === "failed" || status === "cancelled";
  const executedPacketCount = runtime.executionPackets.filter((entry) => packetExecutionStatus(entry.packet) === "executed").length;
  const plannedPacketCount = runtime.executionPackets.filter((entry) => isPlanningOnlyPacket(entry.packet)).length;
  const hasOnlyPlanningPackets = plannedPacketCount > 0 && executedPacketCount === 0;
  const artifactCount = runtime.executionArtifacts.length;
  const currentHealth = runtime.currentHealth;
  const runUsage = currentRun?.usage;
  const activity = [
    ...(runtime.details?.events ?? []).map((event) => ({
      id: `event:${event.id}`,
      type: event.eventType,
      summary: textValue(event.payload.summary)
        || textValue(event.payload.executionSummary)
        || textValue(event.payload.message)
        || textValue(event.payload.noActionReason)
        || event.eventType,
      role: event.agentRole,
      createdAt: event.createdAt,
    })),
    ...(runtime.details?.collaboration?.items ?? []).map((message) => ({
      id: `message:${message.id}`,
      type: message.messageType,
      summary: message.content,
      role: message.senderAgentId ?? message.senderType,
      createdAt: message.createdAt,
    })),
  ].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)).slice(0, 24);
  const plannedSteps = Array.isArray(currentRun?.plan?.steps)
    ? currentRun.plan.steps.filter((step): step is Record<string, unknown> => Boolean(step && typeof step === "object"))
    : [];
  const teamPlan = currentRun?.plan?.team && typeof currentRun.plan.team === "object" ? currentRun.plan.team as Record<string, unknown> : null;
  const selectionReasons = stringList(teamPlan?.selectionReason);

  return (
    <section className="lulu-agent-runtime-panel rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{t("Agent runtime")}</p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">{t("Autonomous execution control")}</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {hasOnlyPlanningPackets
              ? t("This page has a recorded planning boundary. No external side effect is claimed until a canonical domain action is registered.")
              : t("This is the live execution layer for the permanent global-brand mission. Actions execute automatically and remain fully auditable.")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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
          {canRetry ? (
            <button
              type="button"
              onClick={() => void runtime.retry()}
              disabled={runtime.acting}
              className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              title={t("Starts a new bounded run; external work is not replayed automatically.")}
            >
              <RotateCcw size={15} />
              {t("Start a safe retry")}
            </button>
          ) : null}
        </div>
      </div>

      {runtime.error ? (
        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {runtime.error}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <article className="rounded-lg border border-border bg-background/60 p-4">
          <p className="text-xs text-muted-foreground">{t("Run status")}</p>
          <div className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone(status)}`}>
            {statusLabel(status, t)}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{statusDescription(status, t)}</p>
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
          <p className="text-xs text-muted-foreground">{t("Execution mode")}</p>
          <p className="mt-2 text-sm font-semibold text-foreground">{t("Autonomous")}</p>
        </article>
        <article className="rounded-lg border border-border bg-background/60 p-4">
          <p className="text-xs text-muted-foreground">{t("Action packets")}</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{runtime.executionPackets.length}</p>
        </article>
        <article className="rounded-lg border border-border bg-background/60 p-4">
          <p className="text-xs text-muted-foreground">{t("Executed")}</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{executedPacketCount}</p>
        </article>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-lg border border-border bg-background/60 p-4 xl:col-span-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Coins size={15} /> {t("AI token usage")}</div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground">
            <span>{t("Input")}: <strong>{tokenCount(runUsage?.inputTokens, locale)}</strong></span>
            <span>{t("Output")}: <strong>{tokenCount(runUsage?.outputTokens, locale)}</strong></span>
            <span>{t("Total")}: <strong>{tokenCount(runUsage?.totalTokens, locale)}</strong></span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{runUsage?.model || t("No metered AI call yet")} · {costValue(runUsage?.customerCostUsd)} {t("customer cost")}</p>
        </article>
        <article className="rounded-lg border border-border bg-background/60 p-4 md:col-span-2 xl:col-span-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Eye size={15} /> {t("Transparent activity")}</div>
          <p className="mt-2 text-sm text-foreground">{t("You can follow the durable plan, actions, tool results, approvals and verification in this timeline.")}</p>
          <p className="mt-2 text-xs text-muted-foreground">{t("Internal hidden chain-of-thought is not exposed; users receive safe rationale summaries and evidence references instead.")}</p>
          {selectionReasons.length > 0 ? <div className="mt-3"><p className="text-xs font-medium uppercase tracking-[0.12em] text-primary">{t("Why this team was selected")}</p><div className="mt-2 flex flex-wrap gap-2">{selectionReasons.map((reason) => <span key={reason} className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs text-foreground">{reason}</span>)}</div></div> : null}
          {currentRun?.errorMessage ? <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive"><strong>{currentRun.errorCode ?? t("Run stopped")}</strong><span className="ml-1">{currentRun.errorMessage}</span></div> : null}
        </article>
      </div>

      {currentHealth ? (
        <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <article className="rounded-lg border border-border bg-background/60 p-4">
            <p className="text-xs text-muted-foreground">{t("Success rate")}</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{currentHealth.successRate ?? 0}%</p>
          </article>
          <article className="rounded-lg border border-border bg-background/60 p-4">
            <p className="text-xs text-muted-foreground">{t("Failed runs")}</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{currentHealth.failedRunCount}</p>
          </article>
          <article className="rounded-lg border border-border bg-background/60 p-4">
            <p className="text-xs text-muted-foreground">{t("Recent runs")}</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{currentHealth.recentRunCount}</p>
          </article>
          <article className="rounded-lg border border-border bg-background/60 p-4">
            <p className="text-xs text-muted-foreground">{t("Connected tools")}</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{currentHealth.connectedIntegrations.length}</p>
          </article>
          <article className="rounded-lg border border-border bg-background/60 p-4">
            <p className="text-xs text-muted-foreground">{t("Last error")}</p>
            <p className="mt-2 text-sm font-medium text-foreground">{currentHealth.lastErrorCode ?? t("No recent error")}</p>
          </article>
          <article className="rounded-lg border border-border bg-background/60 p-4">
            <p className="text-xs text-muted-foreground">{t("Execution profile")}</p>
            <p className="mt-2 text-sm font-medium text-foreground">{currentHealth.executionProfile.executorToolName ?? t("Read only")}</p>
          </article>
        </div>
      ) : null}

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
                    <p className="mt-2 text-sm text-muted-foreground">
                      {step.status === "completed"
                        ? t("Completed and recorded a verifiable result.")
                        : step.status === "failed"
                          ? t("The step stopped with a recorded error.")
                          : step.status === "running"
                            ? t("The agent is executing this bounded step now.")
                            : t("This step is queued in the durable execution plan.")}
                    </p>
                    {step.usage ? (
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>{t("Tokens")}: {tokenCount(step.usage.totalTokens, locale)}</span>
                        <span>{t("Input")}: {tokenCount(step.usage.inputTokens, locale)}</span>
                        <span>{t("Output")}: {tokenCount(step.usage.outputTokens, locale)}</span>
                      </div>
                    ) : null}
                    {step.errorMessage ? <p className="mt-2 text-sm text-destructive">{step.errorMessage}</p> : null}
                  </div>
                  <div className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone(step.status)}`}>
                    {statusLabel(step.status, t)}
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
            <ShieldCheck size={16} className="text-emerald-600" />
            <h3 className="text-sm font-semibold text-foreground">{t("Autonomy boundary")}</h3>
          </div>
          <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-4">
            <p className="text-sm font-medium text-foreground">{t("Governed execution")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("Read and bounded analysis can run automatically. External, financial, identity and publishing actions are blocked until the exact action is approved in the workspace governance inbox.")}</p>
            <p className="mt-3 text-xs font-medium text-emerald-700 dark:text-emerald-300">{pageLabel} · {t("Autonomous and auditable")}</p>
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-lg border border-border bg-background/40 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2"><BrainCircuit size={16} className="text-primary" /><h3 className="text-sm font-semibold text-foreground">{t("AI activity timeline")}</h3></div>
            <p className="mt-1 text-xs text-muted-foreground">{t("Every persisted planning and execution signal for the selected run, including safe rationale summaries.")}</p>
          </div>
          <div className="text-xs text-muted-foreground">{activity.length} {t("updates")}</div>
        </div>
        {plannedSteps.length > 0 ? (
          <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-[0.12em] text-primary">{t("Execution plan")}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {plannedSteps.map((step, index) => (
                <span key={String(step.id ?? index)} className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-xs text-foreground">
                  {index + 1}. {textValue(step.title) || textValue(step.role) || t("planned step")}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-4 space-y-2">
          {activity.length > 0 ? activity.map((item) => (
            <article key={item.id} className="flex gap-3 rounded-lg border border-border bg-background/70 px-3 py-3">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">{item.type}</span>
                  <span className="text-xs text-muted-foreground">{formatLiveDate(item.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.1em] text-muted-foreground">{item.role ?? t("system")}</p>
              </div>
            </article>
          )) : (
            <p className="rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">{t("No AI activity has been recorded for this run yet.")}</p>
          )}
        </div>
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="rounded-lg border border-border bg-background/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">{t("Run history")}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t("Recent page-agent runs for this workspace page.")}</p>
            </div>
            <div className="text-xs text-muted-foreground">{t("Total")}: {runtime.runs.length}</div>
          </div>
          <div className="mt-4 space-y-3">
            {runtime.runs.length > 0 ? runtime.runs.slice(0, 10).map((run) => (
              <button
                key={run.id}
                type="button"
                onClick={() => void runtime.selectRun(run.id)}
                disabled={runtime.acting}
                className={`flex w-full flex-col rounded-lg border px-4 py-3 text-left transition hover:bg-background/80 ${runtime.selectedRunId === run.id ? "border-primary/40 bg-primary/5" : "border-border bg-background/70"}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-medium text-foreground">{run.goal}</div>
                  <div className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone(run.status)}`}>{run.status}</div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <span>{t("Updated")}: {formatLiveDate(run.updatedAt)}</span>
                  <span>{t("Run id")}: {run.id.slice(0, 8)}</span>
                </div>
              </button>
            )) : (
              <p className="rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
                {runtime.loading ? t("Loading recent runs…") : t("No run history exists for this page agent yet.")}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-background/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">{t("Event stream")}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t("Latest backend events, payloads, and execution signals for the selected run.")}</p>
            </div>
            <div className="text-xs text-muted-foreground">{t("Events")}: {runtime.recentEvents.length}</div>
          </div>
          <div className="mt-4 space-y-3">
            {runtime.recentEvents.length > 0 ? runtime.recentEvents.map((event) => (
              <article key={event.id} className="rounded-lg border border-border bg-background/70 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-medium text-foreground">{event.eventType}</div>
                  <div className="text-xs text-muted-foreground">{formatLiveDate(event.createdAt)}</div>
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {event.agentRole ?? t("system")}
                </div>
                {payloadPreview(event.payload) ? (
                  <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                    {payloadPreview(event.payload)}
                  </pre>
                ) : null}
              </article>
            )) : (
              <p className="rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
                {runtime.loading ? t("Loading recent events…") : t("No backend event stream is available for this run yet.")}
              </p>
            )}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="rounded-lg border border-border bg-background/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">{t("Execution trail")}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t("Live backend action packets and their execution state.")}</p>
            </div>
            <div className="text-xs text-muted-foreground">{t("Results")}: {artifactCount}</div>
          </div>
          {runtime.executionError ? (
            <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {runtime.executionError}
            </div>
          ) : null}
          <div className="mt-4 space-y-3">
            {runtime.executionPackets.length > 0 ? runtime.executionPackets.map(({ packet, results }) => (
              <article key={packet.id} className={`rounded-lg border px-4 py-3 ${recordTone(packet)}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground">{packet.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      {textValue(packet.data.targetSystem) || t("ai")} · {packet.resourceType}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {textValue(packet.data.executionSummary) || packet.description || t("No execution summary is available yet.")}
                    </p>
                  </div>
                  <div className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone(packetExecutionStatus(packet))}`}>
                    {packetExecutionStatus(packet)}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <span>{t("Stage")}: {packet.stage ?? "—"}</span>
                  <span>{t("Mode")}: {textValue(packet.data.executionMode) || "—"}</span>
                  <span>{t("Policy")}: {textValue(packet.data.policyDecision) || "—"}</span>
                  <span>{t("Command")}: {textValue(packet.data.primaryCommandType) || "—"}</span>
                  <span>{t("Boundary")}: {boundaryLabel(packet, t)}</span>
                  <span>{t("Side effects")}: {packet.data.sideEffectsApplied === true ? t("Applied") : t("None claimed")}</span>
                  <span>{t("Outputs")}: {results.length || resultCount(packet)}</span>
                  <span>{t("Updated")}: {formatLiveDate(packet.updatedAt)}</span>
                </div>
                {(textValue(packet.data.targetEntityType) || textValue(packet.data.targetEntityId) || textValue(packet.data.provider) || textValue(packet.data.riskLevel) || textValue(packet.data.approvalPolicy) || stringList(packet.data.evidenceRefs).length > 0) ? (
                  <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{t("Action preview")}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground">
                      {textValue(packet.data.targetEntityType) ? <span>{t("Target")}: {textValue(packet.data.targetEntityType)}{textValue(packet.data.targetEntityId) ? ` · ${textValue(packet.data.targetEntityId)}` : ""}</span> : null}
                      {textValue(packet.data.provider) ? <span>{t("Provider")}: {textValue(packet.data.provider)}</span> : null}
                      {textValue(packet.data.riskLevel) ? <span>{t("Risk")}: {textValue(packet.data.riskLevel)}</span> : null}
                      {textValue(packet.data.approvalPolicy) ? <span>{t("Approval")}: {textValue(packet.data.approvalPolicy)}</span> : null}
                    </div>
                    {stringList(packet.data.evidenceRefs).length > 0 ? <p className="mt-2 text-xs text-muted-foreground">{t("Evidence")}: {stringList(packet.data.evidenceRefs).slice(0, 4).join(" · ")}</p> : null}
                    {isPlanningOnlyPacket(packet) ? <p className="mt-2 text-xs text-sky-700 dark:text-sky-300">{t("The page agent recorded a planning artifact. It did not mutate an external provider or canonical business entity.")}</p> : null}
                  </div>
                ) : null}
                {textValue(packet.data.requiresHumanReviewReason) ? (
                  <p className="mt-3 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                    {textValue(packet.data.requiresHumanReviewReason)}
                  </p>
                ) : null}
                {textValue(packet.data.executionNextAttemptAt) ? (
                  <p className="mt-3 text-xs text-amber-600 dark:text-amber-300">
                    {t("Next retry")}: {formatLiveDate(textValue(packet.data.executionNextAttemptAt))}
                  </p>
                ) : null}
              </article>
            )) : (
              <p className="rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
                {runtime.executionLoading
                  ? t("Loading the latest execution packets…")
                  : t("No execution packets have been produced by this page agent yet.")}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-background/40 p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("Generated records")}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{t("Operational records created by the executor for this page.")}</p>
          </div>
          <div className="mt-4 space-y-3">
            {runtime.executionArtifacts.length > 0 ? runtime.executionArtifacts.map((record) => (
              <article key={record.id} className={`rounded-lg border px-4 py-3 ${recordTone(record)}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground">{record.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      {record.resourceType} · {textValue(record.data.targetSystem) || t("ai")}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{record.description || t("No generated description is available yet.")}</p>
                  </div>
                  <div className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone(record.status)}`}>
                    {record.status}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <span>{t("Stage")}: {record.stage ?? "—"}</span>
                  <span>{t("Updated")}: {formatLiveDate(record.updatedAt)}</span>
                </div>
              </article>
            )) : (
              <p className="rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
                {runtime.executionLoading
                  ? t("Loading generated records…")
                  : t("No generated execution records are visible for this page yet.")}
              </p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
