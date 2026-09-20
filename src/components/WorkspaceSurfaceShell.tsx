import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { LuluGlobalNavigation } from "./LuluGlobalNavigation";
import { AuthenticatedWorkspaceTopBar } from "./AuthenticatedWorkspaceTopBar";
import { isOfficePanelSurface } from "../routing";

/**
 * Shared chrome for the canonical pages that are mounted directly from App.tsx.
 * Generated pages get the same chrome from NativePage; keeping this small shell
 * here prevents direct routes (quotes, invoices and CRM) from losing navigation.
 */
export function WorkspaceSurfaceShell({
  activeSlug,
  children,
  showNavigation = true,
  showGlobalNavigation = true,
}: {
  activeSlug: string;
  children: ReactNode;
  showNavigation?: boolean;
  showGlobalNavigation?: boolean;
}) {
  const location = useLocation();
  const officePanel = isOfficePanelSurface(location.search);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigationTriggerRef = useRef<HTMLElement | null>(null);
  const restoreNavigationFocus = useCallback(() => {
    const trigger = navigationTriggerRef.current;
    if (trigger?.isConnected) window.requestAnimationFrame(() => { if (trigger.isConnected) trigger.focus(); });
  }, []);
  const close = useCallback(() => {
    setMobileOpen(false);
    restoreNavigationFocus();
  }, [restoreNavigationFocus]);
  const toggleNavigation = () => {
    if (mobileOpen) {
      close();
      return;
    }
    navigationTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setMobileOpen(true);
  };

  useEffect(() => {
    if (officePanel) return;
    document.body.classList.toggle("lulu-mobile-nav-open", mobileOpen);
    return () => document.body.classList.remove("lulu-mobile-nav-open");
  }, [mobileOpen, officePanel]);

  useEffect(() => {
    if (officePanel || !showGlobalNavigation || !mobileOpen || !window.matchMedia("(max-width: 900px)").matches) return;
    const navigation = document.getElementById("lulu-global-navigation");
    if (!navigation) return;
    const topbar = document.querySelector<HTMLElement>("[data-lulu-auth-topbar]");
    const previousTopbarState = topbar ? {
      inert: topbar.inert,
      ariaHidden: topbar.getAttribute("aria-hidden"),
    } : null;
    const previousRole = navigation.getAttribute("role");
    const previousModal = navigation.getAttribute("aria-modal");
    if (topbar) {
      topbar.inert = true;
      topbar.setAttribute("aria-hidden", "true");
    }
    navigation.setAttribute("role", "dialog");
    navigation.setAttribute("aria-modal", "true");
    window.requestAnimationFrame(() => navigation.querySelector<HTMLElement>(".lulu-global-navigation__close")?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
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
      if (topbar && previousTopbarState) {
        topbar.inert = previousTopbarState.inert;
        if (previousTopbarState.ariaHidden == null) topbar.removeAttribute("aria-hidden");
        else topbar.setAttribute("aria-hidden", previousTopbarState.ariaHidden);
      }
      if (previousRole == null) navigation.removeAttribute("role");
      else navigation.setAttribute("role", previousRole);
      if (previousModal == null) navigation.removeAttribute("aria-modal");
      else navigation.setAttribute("aria-modal", previousModal);
    };
  }, [close, mobileOpen, officePanel, showGlobalNavigation]);

  if (!showNavigation) return <>{children}</>;

  if (officePanel) {
    return (
      <div className="lulu-global-content lulu-global-content--office-panel lulu-office-panel-surface" data-lulu-office-panel-surface="true">
        <div className="lulu-native-page lulu-native-page--surface-shell lulu-native-page--without-secondary-navigation">
          {children}
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthenticatedWorkspaceTopBar
        navigationOpen={mobileOpen}
        onToggleNavigation={toggleNavigation}
        onCloseNavigation={close}
        showNavigationToggle={showGlobalNavigation}
      />
      <div className={`lulu-global-shell${mobileOpen ? " lulu-global-shell--nav-open" : ""}${showGlobalNavigation ? "" : " lulu-global-shell--without-navigation"}`}>
        {showGlobalNavigation && <div className="lulu-global-navigation__backdrop" aria-hidden="true" onClick={close} />}
        {showGlobalNavigation && <LuluGlobalNavigation activeSlug={activeSlug} mobileOpen={mobileOpen} onNavigate={close} onRequestClose={close} />}
        <div className="lulu-global-content" inert={showGlobalNavigation && mobileOpen ? true : undefined} aria-hidden={showGlobalNavigation && mobileOpen ? true : undefined}>
          <div className="lulu-native-page lulu-native-page--surface-shell lulu-native-page--without-secondary-navigation">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
