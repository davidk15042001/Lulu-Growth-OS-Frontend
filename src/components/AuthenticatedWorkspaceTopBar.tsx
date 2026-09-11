import { Activity, Menu, X } from "lucide-react";
import { useLuluApp } from "../api/LuluAppContext";
import { LuluWorkspaceRefreshButton } from "./LuluWorkspaceTopBar";
import { LuluUsageControl } from "./LuluUsageControl";
import { useTranslation } from "../i18n/GlobalLanguageSwitcher";

export function AuthenticatedWorkspaceTopBar({
  navigationOpen,
  onToggleNavigation,
}: {
  navigationOpen: boolean;
  onToggleNavigation: () => void;
  onCloseNavigation: () => void;
}) {
  const t = useTranslation();
  const { currentUser, selectedWorkspace } = useLuluApp();
  const activationLocked = Boolean(selectedWorkspace && !selectedWorkspace.onboardingCompletedAt
    && (selectedWorkspace.onboardingStep === 'profile_completion' || selectedWorkspace.onboardingStep === 'knowledge_base'));

  if (!currentUser || !selectedWorkspace) return null;

  return (
    <div className="lulu-auth-search-wrap" data-lulu-auth-topbar="true">
      <button
        type="button"
        className="lulu-auth-nav-toggle"
        aria-label={navigationOpen ? "Close navigation" : "Open navigation"}
        aria-controls="lulu-global-navigation"
        aria-expanded={navigationOpen}
        onClick={onToggleNavigation}
      >
        {navigationOpen ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
      </button>
      <div className="lulu-auth-brand">
        <div className="lulu-auth-logo" data-lulu-no-translate="true" translate="no">
          <img className="lulu-agentic-logo-image" src="/branding/lulu-agentic-logo.svg" alt="Lulu" draggable={false} />
        </div>
        <div className="lulu-auth-runtime" aria-label={`${t("Autonomous execution")} · 140+ ${t("AI agents")}`}>
          <span className="lulu-auth-runtime__signal" aria-hidden="true"><Activity size={12} /></span>
          <span className="lulu-auth-runtime__copy">
            <strong>{t("Autonomous")}</strong>
            <small>140+ {t("AI agents")}</small>
          </span>
        </div>
      </div>
      {activationLocked ? (
        <div className="lulu-auth-activation-status">Complete activation to unlock Lulu</div>
      ) : (
        <div className="lulu-auth-actions">
          <LuluWorkspaceRefreshButton />
          <LuluUsageControl />
        </div>
      )}
    </div>
  );
}
