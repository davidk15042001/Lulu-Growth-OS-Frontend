import { Building2, LayoutDashboard, Menu, X } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLuluApp } from "../api/LuluAppContext";
import { isOfficePanelSurface, routes } from "../routing";
import { LuluWorkspaceRefreshButton } from "./LuluWorkspaceTopBar";
import { LuluUsageControl } from "./LuluUsageControl";

const LAST_WORKSPACE_ROUTE_KEY = "lulu.workspace.last-route";

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
  const location = useLocation();
  const navigate = useNavigate();
  const officePanel = isOfficePanelSurface(location.search);
  const officeMode = location.pathname === routes.app.office;
  const activationLocked = Boolean(selectedWorkspace && !selectedWorkspace.onboardingCompletedAt
    && (selectedWorkspace.onboardingStep === 'profile_completion' || selectedWorkspace.onboardingStep === 'knowledge_base'));

  useEffect(() => {
    if (!location.pathname.startsWith("/app/") || officeMode) return;
    window.sessionStorage.setItem(LAST_WORKSPACE_ROUTE_KEY, `${location.pathname}${location.search}${location.hash}`);
  }, [location.hash, location.pathname, location.search, officeMode]);

  if (!currentUser || !selectedWorkspace || officePanel) return null;

  return (
    <div className="lulu-auth-search-wrap" data-lulu-auth-topbar="true">
      {showNavigationToggle && <button
          type="button"
          className="lulu-auth-nav-toggle"
          aria-label={navigationOpen ? "Close navigation" : "Open navigation"}
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
      {!activationLocked && <nav className="lulu-surface-switch" aria-label="Lulu view">
        <button type="button" className={officeMode ? "is-active" : undefined} aria-current={officeMode ? "page" : undefined} onClick={() => navigate(routes.app.office)}>
          <Building2 aria-hidden="true" size={15} /><span>Office</span>
        </button>
        <button type="button" className={!officeMode ? "is-active" : undefined} aria-current={!officeMode ? "page" : undefined} onClick={() => {
          const stored = window.sessionStorage.getItem(LAST_WORKSPACE_ROUTE_KEY);
          navigate(stored?.startsWith("/app/") && !stored.startsWith(routes.app.office) ? stored : routes.app.dashboard);
        }}>
          <LayoutDashboard aria-hidden="true" size={15} /><span>Workspace</span>
        </button>
      </nav>}
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
