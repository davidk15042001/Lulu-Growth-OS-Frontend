import { useEffect, useState } from "react";
import { NativePage } from "../NativePage";
import type { PageDefinition } from "../pages-manifest";
import { useLuluApp } from "../api/LuluAppContext";
import { AuthenticatedWorkspaceTopBar } from "../components/AuthenticatedWorkspaceTopBar";
import { subscribeWorkspaceRefresh } from "../components/workspace-refresh-events";
import { useLocation } from "react-router-dom";
import { isOfficePanelSurface } from "../routing";

export function PageFrame({
  page,
  isStandalone,
}: {
  page: PageDefinition;
  isStandalone: boolean;
}) {
  const { selectedWorkspace } = useLuluApp();
  const location = useLocation();
  const officePanel = isOfficePanelSurface(location.search);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  useEffect(() => {
    document.title = page.name;
  }, [page]);

  useEffect(() => {
    setMobileNavigationOpen(false);
  }, [isStandalone, page.slug]);

  useEffect(() => {
    if (isStandalone || officePanel) return;
    document.body.classList.toggle("lulu-mobile-nav-open", mobileNavigationOpen);
    return () => {
      document.body.classList.remove("lulu-mobile-nav-open");
    };
  }, [isStandalone, mobileNavigationOpen, officePanel]);

  useEffect(() => {
    if (!selectedWorkspace?.id) return;
    return subscribeWorkspaceRefresh(selectedWorkspace.id, () => {
      setRefreshVersion((current) => current + 1);
    });
  }, [page.slug, selectedWorkspace?.id]);

  return (
    <>
      {!isStandalone && !officePanel && (
        <AuthenticatedWorkspaceTopBar
          navigationOpen={mobileNavigationOpen}
          onToggleNavigation={() => setMobileNavigationOpen((current) => !current)}
          onCloseNavigation={() => setMobileNavigationOpen(false)}
        />
      )}
      <main
        className={`page-frame${isStandalone ? " page-frame--auth" : ""}${officePanel ? " page-frame--office-panel" : ""}`}
        style={isStandalone ? { height: "auto", minHeight: "100vh", overflow: "visible" } : undefined}
      >
        <NativePage
          key={`${page.slug}:${refreshVersion}`}
          slug={page.slug}
          mobileNavigationOpen={mobileNavigationOpen}
          onCloseMobileNavigation={() => setMobileNavigationOpen(false)}
        />
      </main>
    </>
  );
}
