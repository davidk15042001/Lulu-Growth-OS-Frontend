import { ChevronDown, LogOut, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { pageLinkProps, navigateApp, routes } from "../routing";
import { requestApi } from "../api/client";
import { clearSelectedWorkspaceId, getSelectedWorkspaceId } from "../api/session";
import { websitesApi, type WebsiteGenerationJob } from "../api/websites";
import { luluDropdownNavigation } from "../pages/fancily-leaf-1766/components/generated/LuluExecutiveDashboard";

type NavigationPage = { id: string; label: string; soon?: boolean };
type NavigationSection = { label: string; pages: readonly NavigationPage[] };

const navigationSections = luluDropdownNavigation as readonly NavigationSection[];
const WEBSITE_GENERATION_STORAGE_KEY = "lulu.website.active-generation";
const WEBSITE_JOB_RUNNING_STATUSES = new Set(["queued", "planning", "publishing"]);
const WEBSITE_JOB_DISPLAY_STATUSES = new Set(["queued", "planning", "generated", "preview", "publishing", "failed", "cancelled"]);
type StoredWebsiteGeneration = { workspaceId: string; siteId: string; provider: "wordpress" | "webflow"; job: WebsiteGenerationJob };

function isBlockingWebsiteJob(job: Pick<WebsiteGenerationJob, "status" | "autoPublish">) {
  return WEBSITE_JOB_RUNNING_STATUSES.has(job.status) || (job.autoPublish !== false && ["generated", "preview"].includes(job.status));
}

function readWebsiteGenerationLock() {
  try {
    const raw = window.localStorage.getItem(WEBSITE_GENERATION_STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<StoredWebsiteGeneration>;
    const status = String(value.job?.status ?? "");
    if (!value.workspaceId || value.workspaceId !== getSelectedWorkspaceId() || !value.siteId || !value.job?.id || !WEBSITE_JOB_DISPLAY_STATUSES.has(status)) return null;
    return {
      siteId: value.siteId,
      jobId: value.job.id,
      provider: value.provider === "webflow" ? "Webflow" : "WordPress / Jetpack",
      status,
      blocking: isBlockingWebsiteJob(value.job),
      errorMessage: value.job?.errorMessage ?? null,
    };
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
    let requestRunning = false;
    const poll = async () => {
      update();
      if (requestRunning) return;
      const workspaceId = getSelectedWorkspaceId();
      const current = readWebsiteGenerationLock();
      if (!workspaceId || !current?.blocking) return;
      requestRunning = true;
      try {
        const response = await websitesApi.getGenerationJob(workspaceId, current.siteId, current.jobId);
        const raw = window.localStorage.getItem(WEBSITE_GENERATION_STORAGE_KEY);
        const stored = raw ? JSON.parse(raw) as Partial<StoredWebsiteGeneration> : null;
        if (!stored || stored.job?.id !== current.jobId) return;
        const next = { ...stored, job: response.data } as StoredWebsiteGeneration;
        if (isBlockingWebsiteJob(response.data) || ["failed", "cancelled"].includes(response.data.status)) {
          window.localStorage.setItem(WEBSITE_GENERATION_STORAGE_KEY, JSON.stringify(next));
        } else {
          window.localStorage.removeItem(WEBSITE_GENERATION_STORAGE_KEY);
        }
        update();
      } catch {
        // A temporary status request failure must never fabricate a failed generation.
      } finally {
        requestRunning = false;
      }
    };
    window.addEventListener("storage", update);
    window.addEventListener("lulu:website-generation-status", update);
    const timer = window.setInterval(() => void poll(), 2500);
    void poll();
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
            <details key={section.label} open={isActiveSection}>
              <summary className={isActiveSection ? "is-active" : undefined}>
                <span>{section.label}</span>
                <ChevronDown aria-hidden="true" size={14} />
              </summary>
              <div className="lulu-global-navigation__subitems">
                {section.pages.map((page) => {
                  const props = pageLinkProps(page.id);
                  const available = Boolean(props.href);
                  const isActivePage = page.id === activeSlug;
                  const isWebsiteLocked = Boolean(websiteLock?.blocking && isWebsiteSection);
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
                    <RefreshCw aria-hidden="true" size={13} className={websiteLock.blocking ? "animate-spin" : undefined} />
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
                        window.localStorage.removeItem(WEBSITE_GENERATION_STORAGE_KEY);
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

