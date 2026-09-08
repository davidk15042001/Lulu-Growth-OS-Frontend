import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { LuluGlobalNavigation } from "./LuluGlobalNavigation";
import { useTranslation } from "../i18n/GlobalLanguageSwitcher";

/**
 * Shared chrome for the canonical pages that are mounted directly from App.tsx.
 * Generated pages get the same chrome from NativePage; keeping this small shell
 * here prevents direct routes (quotes, invoices and CRM) from losing navigation.
 */
export function WorkspaceSurfaceShell({ activeSlug, children }: { activeSlug: string; children: ReactNode }) {
  const t = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);
  return (
    <div className={`lulu-global-shell${mobileOpen ? " lulu-global-shell--nav-open" : ""}`}>
      <div className="lulu-global-navigation__backdrop" aria-hidden={!mobileOpen} onClick={close} />
      <LuluGlobalNavigation activeSlug={activeSlug} mobileOpen={mobileOpen} onNavigate={close} onRequestClose={close} />
      <div className="lulu-global-content">
        <button
          type="button"
          className="lulu-auth-nav-toggle"
          aria-label={mobileOpen ? t("Close navigation") : t("Open navigation")}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          <span className="sr-only">{mobileOpen ? t("Close navigation") : t("Open navigation")}</span>
        </button>
        {children}
      </div>
    </div>
  );
}
