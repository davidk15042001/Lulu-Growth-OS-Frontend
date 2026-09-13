import { Building2, LayoutDashboard, Menu, X } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLuluApp } from "../api/LuluAppContext";
import { isOfficePanelSurface, routes } from "../routing";
import { LuluWorkspaceRefreshButton } from "./LuluWorkspaceTopBar";
import { LuluUsageControl } from "./LuluUsageControl";
import { useTranslation } from "../i18n/GlobalLanguageSwitcher";

const LAST_WORKSPACE_ROUTE_KEY = "lulu.workspace.last-route";

function storedWorkspaceRoute(value: string | null) {
  if (!value?.startsWith("/app/") || value.startsWith(routes.app.office)) return null;
  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin || isOfficePanelSurface(url.search)) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

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
  const location = useLocation();
  const navigate = useNavigate();
  const officePanel = isOfficePanelSurface(location.search);
  const officeMode = location.pathname === routes.app.office;
  const activationLocked = Boolean(selectedWorkspace && !selectedWorkspace.onboardingCompletedAt
    && (selectedWorkspace.onboardingStep === 'profile_completion' || selectedWorkspace.onboardingStep === 'knowledge_base'));

  useEffect(() => {
    if (!location.pathname.startsWith("/app/") || officeMode || officePanel) return;
    window.sessionStorage.setItem(LAST_WORKSPACE_ROUTE_KEY, `${location.pathname}${location.search}${location.hash}`);
  }, [location.hash, location.pathname, location.search, officeMode, officePanel]);

  if (!currentUser || !selectedWorkspace || officePanel) return null;

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
      {!activationLocked && <nav className="lulu-surface-switch" aria-label={t("Lulu view")}>
        <button type="button" className={officeMode ? "is-active" : undefined} aria-current={officeMode ? "page" : undefined} onClick={() => navigate(routes.app.office)}>
          <Building2 aria-hidden="true" size={15} /><span>{t("Office")}</span>
        </button>
        <button type="button" className={!officeMode ? "is-active" : undefined} aria-current={!officeMode ? "page" : undefined} onClick={() => {
          navigate(storedWorkspaceRoute(window.sessionStorage.getItem(LAST_WORKSPACE_ROUTE_KEY)) ?? routes.app.dashboard);
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
