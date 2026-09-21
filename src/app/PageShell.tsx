import { useCallback, useEffect, useRef, useState } from "react";
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
  const navigationTriggerRef = useRef<HTMLElement | null>(null);
  const closeMobileNavigation = useCallback(() => {
    setMobileNavigationOpen(false);
    const trigger = navigationTriggerRef.current;
    if (trigger?.isConnected) window.requestAnimationFrame(() => { if (trigger.isConnected) trigger.focus(); });
  }, []);
  const toggleMobileNavigation = () => {
    if (mobileNavigationOpen) {
      closeMobileNavigation();
      return;
    }
    navigationTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setMobileNavigationOpen(true);
  };

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
    if (isStandalone || officePanel || !mobileNavigationOpen || !window.matchMedia("(max-width: 900px)").matches) return;
    const navigation = document.getElementById("lulu-global-navigation");
    if (!navigation) return;
    const backgroundRegions = Array.from(document.querySelectorAll<HTMLElement>(
      "[data-lulu-auth-topbar], .page-frame .lulu-global-content",
    ));
    const previousBackgroundState = backgroundRegions.map((element) => ({
      inert: element.inert,
      ariaHidden: element.getAttribute("aria-hidden"),
    }));
    const previousRole = navigation.getAttribute("role");
    const previousModal = navigation.getAttribute("aria-modal");
    backgroundRegions.forEach((element) => {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });
    navigation.setAttribute("role", "dialog");
    navigation.setAttribute("aria-modal", "true");
    window.requestAnimationFrame(() => navigation.querySelector<HTMLElement>(".lulu-global-navigation__close")?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileNavigation();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(navigation.querySelectorAll<HTMLElement>(
        'a[href]:not([aria-disabled="true"]), button:not([disabled]), summary, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      backgroundRegions.forEach((element, index) => {
        const previous = previousBackgroundState[index];
        element.inert = previous?.inert ?? false;
        if (previous?.ariaHidden == null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", previous.ariaHidden);
      });
      if (previousRole == null) navigation.removeAttribute("role");
      else navigation.setAttribute("role", previousRole);
      if (previousModal == null) navigation.removeAttribute("aria-modal");
      else navigation.setAttribute("aria-modal", previousModal);
    };
  }, [closeMobileNavigation, isStandalone, mobileNavigationOpen, officePanel]);

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
          onToggleNavigation={toggleMobileNavigation}
          onCloseNavigation={closeMobileNavigation}
          showNavigationToggle
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
          onCloseMobileNavigation={closeMobileNavigation}
        />
      </main>
    </>
  );
}
