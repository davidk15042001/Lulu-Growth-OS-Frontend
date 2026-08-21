import { ChevronDown, LogOut, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { pageLinkProps, navigateApp, routes } from "../routing";
import { requestApi } from "../api/client";
import { clearSelectedWorkspaceId } from "../api/session";
import { luluDropdownNavigation } from "../pages/fancily-leaf-1766/components/generated/LuluExecutiveDashboard";

type NavigationPage = { id: string; label: string; soon?: boolean };
type NavigationSection = { label: string; pages: readonly NavigationPage[] };

const navigationSections = luluDropdownNavigation as readonly NavigationSection[];
const WEBSITE_GENERATION_STORAGE_KEY = "lulu.website.active-generation";
const WEBSITE_JOB_BLOCKED_STATUSES = new Set(["queued", "planning", "publishing", "failed", "cancelled"]);

function readWebsiteGenerationLock() {
  try {
    const raw = window.localStorage.getItem(WEBSITE_GENERATION_STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as { provider?: string; job?: { status?: string; errorMessage?: string | null } };
    const status = String(value.job?.status ?? "");
    if (!WEBSITE_JOB_BLOCKED_STATUSES.has(status)) return null;
    return { provider: value.provider === "webflow" ? "Webflow" : "WordPress / Jetpack", status, errorMessage: value.job?.errorMessage ?? null };
  } catch {
    return null;
  }
}

function websiteLockLabel(status: string) {
  if (status === "failed") return "Generierung fehlgeschlagen";
  if (status === "cancelled") return "Generierung abgebrochen";
  if (status === "publishing") return "Veröffentlichung läuft";
  if (status === "preview") return "Vorschau wird vorbereitet";
  if (status === "planning") return "Planung läuft";
  return "Website wird generiert";
}

export function LuluGlobalNavigation({ activeSlug }: { activeSlug: string }) {
  const [websiteLock, setWebsiteLock] = useState(() => readWebsiteGenerationLock());
  useEffect(() => {
    const update = () => setWebsiteLock(readWebsiteGenerationLock());
    window.addEventListener("storage", update);
    window.addEventListener("lulu:website-generation-status", update);
    const timer = window.setInterval(update, 2000);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("lulu:website-generation-status", update);
      window.clearInterval(timer);
    };
  }, []);
  const websiteLockText = useMemo(() => websiteLock ? `${websiteLockLabel(websiteLock.status)} · ${websiteLock.status}` : "", [websiteLock]);
  return (
    <aside className="lulu-global-navigation" data-lulu-global-navigation="true">
      <div className="lulu-global-navigation__workspace-label">Workspace</div>
      <nav className="lulu-global-navigation__sections">
        {navigationSections.map((section) => {
          const isActiveSection = section.pages.some((page) => page.id === activeSlug);
          const isWebsiteSection = section.label === "Website";
          return (
            <details key={section.label} open={isActiveSection || section.label === "Website" || section.label === "Settings"}>
              <summary className={isActiveSection ? "is-active" : undefined}>
                <span>{section.label}</span>
                <ChevronDown aria-hidden="true" size={14} />
              </summary>
              <div className="lulu-global-navigation__subitems">
                {section.pages.map((page) => {
                  const props = pageLinkProps(page.id);
                  const available = Boolean(props.href);
                  const isActivePage = page.id === activeSlug;
                  const isWebsiteLocked = Boolean(websiteLock && isWebsiteSection);
                  return (
                    <a
                      key={page.id}
                      {...props}
                      className={`${isActivePage ? "is-active" : ""}${isWebsiteLocked ? " is-locked" : ""}`.trim() || undefined}
                      aria-current={isActivePage ? "page" : undefined}
                      aria-disabled={!available || isWebsiteLocked || undefined}
                      tabIndex={available && !isWebsiteLocked ? undefined : -1}
                      onClick={isWebsiteLocked ? (event) => event.preventDefault() : undefined}
                      aria-label={isWebsiteLocked ? `${page.label} gesperrt: ${websiteLockText}` : page.label}
                      title={isWebsiteLocked ? websiteLockText : undefined}
                    >
                      <span>{page.label}</span>
                    </a>
                  );
                })}
                {websiteLock && isWebsiteSection && (
                  <div className={`lulu-global-navigation__website-lock is-${websiteLock.status}`} role="status" aria-live="polite">
                    <RefreshCw aria-hidden="true" size={13} className={["queued", "planning", "generated", "preview", "publishing"].includes(websiteLock.status) ? "animate-spin" : undefined} />
                    <span>{websiteLockText}</span>
                  </div>
                )}
                {section.label === "Settings" && (
                  <button
                    type="button"
                    className="lulu-global-navigation__logout"
                    onClick={async () => {
                      try {
                        await requestApi({ path: "/auth/logout", method: "POST", body: {} });
                      } finally {
                        clearSelectedWorkspaceId();
                        navigateApp(routes.auth.login);
                      }
                    }}
                  >
                    <LogOut aria-hidden="true" size={14} />
                    <span>Sign out</span>
                  </button>
                )}
              </div>
            </details>
          );
        })}
      </nav>
    </aside>
  );
}

export type { NavigationPage, NavigationSection };

