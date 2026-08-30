import { Bot, ShieldCheck } from "lucide-react";
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
  const workspaceId = selectedWorkspace?.id ?? null;
  const {
    currentFocusDetail,
    connectedSystemsDetail,
    latestActivityAt,
    liveError,
    liveLoading,
    runtimeStatus,
  } = useLuluAgentRuntime(workspaceId, contract, t);
  const fallbackStatus = currentUiState(contract);
  const status = liveLoading ? (contract.uiStates.includes("syncing") ? "syncing" : runtimeStatus) : runtimeStatus;
  const statusLabel = t(UI_STATE_TRANSLATION_KEYS[status ?? fallbackStatus]);
  const latestActivityLabel = latestActivityAt
    ? interpolate(t("Latest activity: {{0}}"), [formatLiveDate(latestActivityAt)])
    : t("No live activity recorded yet.");

  return (
    <section className="lulu-agent-workspace-header" aria-label={t("Dedicated agent workspace")}>
      <div className="lulu-agent-workspace-header__intro">
        <div className="lulu-agent-workspace-header__eyebrow">
          <span>{contract.sectionLabel}</span>
          <span aria-hidden="true">/</span>
          <span>{contract.agentName}</span>
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
            <span className={`lulu-agent-workspace-header__badge lulu-agent-workspace-header__badge--status is-${status}`}>
              <ShieldCheck size={13} aria-hidden="true" />
              {statusLabel}
            </span>
          </div>
        </div>
        <div className="lulu-agent-workspace-header__summary" aria-label={t("Live agent signals")}>
          <div className="lulu-agent-workspace-header__summary-item">
            <span>{t("Live status")}</span>
            <strong>{liveLoading ? t("Syncing") : statusLabel}</strong>
          </div>
          <div className="lulu-agent-workspace-header__summary-item">
            <span>{t("Current focus")}</span>
            <strong>{jobsLabel}</strong>
          </div>
          <div className="lulu-agent-workspace-header__summary-item">
            <span>{t("Connected systems")}</span>
            <strong>{integrationsLabel}</strong>
          </div>
          <div className="lulu-agent-workspace-header__summary-item">
            <span>{t("Latest activity")}</span>
            <strong>{latestActivityLabel}</strong>
          </div>
        </div>
      </div>
      {liveError ? <div className="lulu-agent-workspace-header__notice lulu-agent-workspace-header__notice--error" role="status">{liveError}</div> : null}
      <div className="lulu-agent-workspace-header__details">
        <p>{currentFocusDetail}</p>
        <p>{connectedSystemsDetail}</p>
      </div>
    </section>
  );
}
