import { Bot, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { formatLiveDate } from "../api/live-panel-ui";
import { useLuluApp } from "../api/LuluAppContext";
import { useTranslation } from "../i18n/GlobalLanguageSwitcher";
import type { LuluAgentContract, LuluAgentUiState } from "../config/lulu-agent-registry";
import { useLuluAgentRuntime } from "./useLuluAgentRuntime";

const UI_STATE_PRIORITY: readonly LuluAgentUiState[] = [
  "needs_approval",
  "executing",
  "analyzing",
  "monitoring",
  "drafting",
  "syncing",
  "connecting",
  "attention_required",
  "completed",
];

const UI_STATE_TRANSLATION_KEYS: Record<LuluAgentUiState, string> = {
  connecting: "Connecting",
  syncing: "Syncing",
  drafting: "Drafting",
  monitoring: "Monitoring",
  analyzing: "Analyzing",
  needs_approval: "Needs approval",
  executing: "Executing",
  completed: "Completed",
  attention_required: "Attention required",
};

function interpolate(template: string, values: Array<string | number>) {
  return values.reduce<string>((message, value, index) => message.replace(`{{${index}}}`, String(value)), template);
}

function currentUiState(contract: LuluAgentContract) {
  return UI_STATE_PRIORITY.find((state) => contract.uiStates.includes(state)) ?? contract.uiStates[0] ?? "monitoring";
}

function summarizeList(items: readonly string[], limit: number) {
  return items.slice(0, limit).join(" · ");
}

export function LuluAgentWorkspaceHeader({ contract }: { contract: LuluAgentContract }) {
  const t = useTranslation();
  const { selectedWorkspace } = useLuluApp();
  const integrationsLabel = summarizeList(contract.integrations, 3);
  const jobsLabel = summarizeList(contract.jobs, 3);
  const metricsLabel = summarizeList(contract.successMetrics, 3);
  const approvalLabel = contract.approvalPolicy.requiresApproval
    ? summarizeList(contract.approvalPolicy.gates, 2)
    : t("No approval needed for ongoing work.");
  const workspaceId = selectedWorkspace?.id ?? null;
  const {
    currentFocusDetail,
    connectedSystemsDetail,
    impactDetail,
    latestActivityAt,
    liveError,
    liveLoading,
    runtimeStatus,
    visibleLiveCards,
  } = useLuluAgentRuntime(workspaceId, contract, t);
  const fallbackStatus = currentUiState(contract);
  const status = liveLoading ? (contract.uiStates.includes("syncing") ? "syncing" : runtimeStatus) : runtimeStatus;
  const statusLabel = t(UI_STATE_TRANSLATION_KEYS[status ?? fallbackStatus]);

  return (
    <section className="lulu-agent-workspace-header" aria-label={t("Dedicated agent workspace")}>
      <div className="lulu-agent-workspace-header__intro">
        <div className="lulu-agent-workspace-header__eyebrow">
          <span>{t("Lulu AI Agent")}</span>
          <span aria-hidden="true">/</span>
          <span>{contract.sectionLabel}</span>
        </div>
        <div className="lulu-agent-workspace-header__headline">
          <div className="lulu-agent-workspace-header__identity">
            <div className="lulu-agent-workspace-header__icon" aria-hidden="true">
              <Bot size={18} />
            </div>
            <div className="lulu-agent-workspace-header__copy">
              <h1>{contract.pageLabel}</h1>
              <p>{contract.objective}</p>
            </div>
          </div>
          <div className="lulu-agent-workspace-header__badges" aria-label={t("Agent workspace metadata")}>
            <span className="lulu-agent-workspace-header__badge">
              <Sparkles size={13} aria-hidden="true" />
              {contract.agentName}
            </span>
            <span className="lulu-agent-workspace-header__badge">
              <Gauge size={13} aria-hidden="true" />
              {interpolate(t("Autonomy {{0}}"), [contract.autonomy])}
            </span>
            <span className={`lulu-agent-workspace-header__badge lulu-agent-workspace-header__badge--status is-${status}`}>
              <ShieldCheck size={13} aria-hidden="true" />
              {statusLabel}
            </span>
          </div>
        </div>
      </div>
      <div className="lulu-agent-workspace-header__live-strip" aria-label={t("Live agent signals")}>
        <article className="lulu-agent-workspace-header__live-card">
          <div className="lulu-agent-workspace-header__live-label">{t("Live status")}</div>
          <strong>{liveLoading ? t("Syncing") : statusLabel}</strong>
          <p>{latestActivityAt ? interpolate(t("Latest activity: {{0}}"), [formatLiveDate(latestActivityAt)]) : t("No live activity recorded yet.")}</p>
        </article>
        {visibleLiveCards.map((card) => (
          <article className="lulu-agent-workspace-header__live-card" key={card.label}>
            <div className="lulu-agent-workspace-header__live-label">{card.label}</div>
            <strong>{card.value}</strong>
            <p>{card.detail}</p>
          </article>
        ))}
      </div>
      {liveError ? <div className="lulu-agent-workspace-header__notice lulu-agent-workspace-header__notice--error" role="status">{liveError}</div> : null}
      <div className="lulu-agent-workspace-header__grid">
        <article className="lulu-agent-workspace-header__panel">
          <div className="lulu-agent-workspace-header__panel-label">{t("Current focus")}</div>
          <strong>{jobsLabel}</strong>
          <p>{currentFocusDetail}</p>
        </article>
        <article className="lulu-agent-workspace-header__panel">
          <div className="lulu-agent-workspace-header__panel-label">{t("Connected systems")}</div>
          <strong>{integrationsLabel}</strong>
          <p>{connectedSystemsDetail}</p>
        </article>
        <article className="lulu-agent-workspace-header__panel">
          <div className="lulu-agent-workspace-header__panel-label">{t("Approval boundary")}</div>
          <strong>{approvalLabel}</strong>
          <p>{contract.approvalPolicy.requiresApproval ? t("Sensitive execution stays behind approval gates.") : t("The agent can continue operating inside its current guardrails.")}</p>
        </article>
        <article className="lulu-agent-workspace-header__panel">
          <div className="lulu-agent-workspace-header__panel-label">{t("Impact target")}</div>
          <strong>{metricsLabel}</strong>
          <p>{impactDetail}</p>
        </article>
      </div>
    </section>
  );
}
