import { useEffect, useState } from "react";
import { NativePage } from "../NativePage";
import type { PageDefinition } from "../pages-manifest";
import { useLuluApp } from "../api/LuluAppContext";
import { AuthenticatedWorkspaceTopBar } from "../components/AuthenticatedWorkspaceTopBar";
import { subscribeWorkspaceRefresh } from "../components/workspace-refresh-events";

export function PageFrame({
  page,
  isStandalone,
}: {
  page: PageDefinition;
  isStandalone: boolean;
}) {
  const { selectedWorkspace } = useLuluApp();
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  useEffect(() => {
    document.title = page.name;
  }, [page]);

  useEffect(() => {
    setMobileNavigationOpen(false);
  }, [isStandalone, page.slug]);

  useEffect(() => {
    if (isStandalone) return;
    document.body.classList.toggle("lulu-mobile-nav-open", mobileNavigationOpen);
    return () => {
      document.body.classList.remove("lulu-mobile-nav-open");
    };
  }, [isStandalone, mobileNavigationOpen]);

  useEffect(() => {
    if (!selectedWorkspace?.id) return;
    return subscribeWorkspaceRefresh(selectedWorkspace.id, () => {
      setRefreshVersion((current) => current + 1);
    });
  }, [page.slug, selectedWorkspace?.id]);

  return (
    <>
      {!isStandalone && (
        <AuthenticatedWorkspaceTopBar
          navigationOpen={mobileNavigationOpen}
          onToggleNavigation={() => setMobileNavigationOpen((current) => !current)}
          onCloseNavigation={() => setMobileNavigationOpen(false)}
        />
      )}
      <main
        className={`page-frame${isStandalone ? " page-frame--auth" : ""}`}
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
