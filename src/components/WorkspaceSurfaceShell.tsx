import { useEffect, useState, type ReactNode } from "react";
import { LuluGlobalNavigation } from "./LuluGlobalNavigation";
import { AuthenticatedWorkspaceTopBar } from "./AuthenticatedWorkspaceTopBar";

/**
 * Shared chrome for the canonical pages that are mounted directly from App.tsx.
 * Generated pages get the same chrome from NativePage; keeping this small shell
 * here prevents direct routes (quotes, invoices and CRM) from losing navigation.
 */
export function WorkspaceSurfaceShell({ activeSlug, children }: { activeSlug: string; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);

  useEffect(() => {
    document.body.classList.toggle("lulu-mobile-nav-open", mobileOpen);
    return () => document.body.classList.remove("lulu-mobile-nav-open");
  }, [mobileOpen]);

  return (
    <>
      <AuthenticatedWorkspaceTopBar
        navigationOpen={mobileOpen}
        onToggleNavigation={() => setMobileOpen((value) => !value)}
        onCloseNavigation={close}
      />
      <div className={`lulu-global-shell${mobileOpen ? " lulu-global-shell--nav-open" : ""}`}>
        <div className="lulu-global-navigation__backdrop" aria-hidden={!mobileOpen} onClick={close} />
        <LuluGlobalNavigation activeSlug={activeSlug} mobileOpen={mobileOpen} onNavigate={close} onRequestClose={close} />
        <div className="lulu-global-content">
          <div className="lulu-native-page lulu-native-page--surface-shell lulu-native-page--without-secondary-navigation">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
