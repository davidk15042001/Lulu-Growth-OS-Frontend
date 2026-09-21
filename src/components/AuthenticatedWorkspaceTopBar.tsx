import { Building2, LayoutDashboard, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLuluApp } from "../api/LuluAppContext";
import { releaseApi } from "../api/release";
import { isOfficePanelSurface, routes } from "../routing";
import { LuluWorkspaceRefreshButton } from "./LuluWorkspaceTopBar";
import { LuluUsageControl } from "./LuluUsageControl";
import { useTranslation } from "../i18n/GlobalLanguageSwitcher";

export function AuthenticatedWorkspaceTopBar({
  navigationOpen,
  onToggleNavigation,
  showNavigationToggle = true,
}: {
  navigationOpen: boolean;
  onToggleNavigation: () => void;
  onCloseNavigation: () => void;
  showNavigationToggle?: boolean;
}) {
  const { currentUser, selectedWorkspace } = useLuluApp();
  const t = useTranslation();
  const [backendPushedAt, setBackendPushedAt] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const officePanel = isOfficePanelSurface(location.search);
  const officeMode = location.pathname === routes.app.office;
  const activationLocked = Boolean(selectedWorkspace && !selectedWorkspace.onboardingCompletedAt
    && ['company_information', 'billing', 'profile_completion', 'knowledge_base'].includes(selectedWorkspace.onboardingStep));

  useEffect(() => {
    const controller = new AbortController();
    void releaseApi.backend(controller.signal).then((response) => {
      setBackendPushedAt(response.data.pushedAt);
    }).catch(() => undefined);
    return () => controller.abort();
  }, []);

  if (!currentUser || !selectedWorkspace || officePanel || activationLocked) return null;

  const backendTimestamp = backendPushedAt ? new Date(backendPushedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }) : null;

  return (
    <div className="lulu-auth-search-wrap" data-lulu-auth-topbar="true">
      {showNavigationToggle && <button
          type="button"
          className="lulu-auth-nav-toggle"
          aria-label={t(navigationOpen ? "Close navigation" : "Open navigation")}
          aria-controls="lulu-global-navigation"
          aria-expanded={navigationOpen}
          onClick={onToggleNavigation}
        >
          {navigationOpen ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
        </button>}
      <div className="lulu-auth-brand">
        <div className="lulu-auth-logo" data-lulu-no-translate="true" translate="no">
          <img className="lulu-agentic-logo-image" src="/branding/lulu-agentic-logo.svg" alt="Lulu" draggable={false} />
        </div>
      </div>
      <div className="lulu-auth-workspace-context">
        <span>{selectedWorkspace.companyName}</span>
        <small>{t("Workspace")}</small>
      </div>
      {backendTimestamp && <span className="lulu-backend-release" title={t("Backend push: {{0}}").replace("{{0}}", backendTimestamp)} aria-label={t("Backend push: {{0}}").replace("{{0}}", backendTimestamp)}>
        <span className="lulu-backend-release__dot" aria-hidden="true" />
        <span>{t("System synchronized")}</span>
      </span>}
      {!activationLocked && <nav className="lulu-surface-switch" aria-label={t("Lulu view")}>
        <button type="button" className={officeMode ? "is-active" : undefined} aria-current={officeMode ? "page" : undefined} onClick={() => navigate(routes.app.office)}>
          <Building2 aria-hidden="true" size={15} /><span>{t("Office")}</span>
        </button>
        <button type="button" className={!officeMode ? "is-active" : undefined} aria-current={!officeMode ? "page" : undefined} onClick={() => {
          navigate(routes.app.dashboard);
        }}>
          <LayoutDashboard aria-hidden="true" size={15} /><span>{t("Workspace")}</span>
        </button>
      </nav>}
      {activationLocked ? (
        <div className="lulu-auth-activation-status">{t("Complete activation to unlock Lulu")}</div>
      ) : (
        <div className="lulu-auth-actions">
          <LuluWorkspaceRefreshButton />
          <LuluUsageControl />
        </div>
      )}
    </div>
  );
}
