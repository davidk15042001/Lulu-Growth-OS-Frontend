import { CalendarDays, ChevronDown, LogOut, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PRIMARY_AUDIENCES_SLUG, PRIMARY_REVIEWS_SLUG, SUBPAGE_NAVIGATION_LOCKED, isPageAvailable, isWebsiteNavigationSlug, pageLinkProps, navigateApp, routes } from "../routing";
import { requestApi } from "../api/client";
import { clearSelectedWorkspaceId, getSelectedWorkspaceId } from "../api/session";
import { useTranslation } from "../i18n/GlobalLanguageSwitcher";
import { websitesApi, type WebsiteGenerationJob } from "../api/websites";
import { luluDropdownNavigation } from "../pages/fancily-leaf-1766/components/generated/LuluExecutiveDashboard";

type NavigationPage = { id: string; label: string; soon?: boolean };
type NavigationSection = { label: string; pages: readonly NavigationPage[] };

const WEBSITE_AND_COMMERCE_LABEL = "Website & Commerce";
const FINANCE_LABEL = "Finance";
const SETTINGS_LABEL = "Settings";

const navigationSections: readonly NavigationSection[] = (() => {
  const availableSections = (luluDropdownNavigation as readonly NavigationSection[])
    .map((section) => ({
      ...section,
      pages: section.pages.filter((page) => isPageAvailable(page.id)),
    }))
    .filter((section) => section.pages.length > 0);

  const financeIndex = availableSections.findIndex((section) => section.label === FINANCE_LABEL);
  const webPresenceIndex = availableSections.findIndex((section) => section.label === WEBSITE_AND_COMMERCE_LABEL);
  const settingsIndex = availableSections.findIndex((section) => section.label === SETTINGS_LABEL);

  if (financeIndex === -1 || webPresenceIndex === -1 || settingsIndex === -1) {
    return availableSections;
  }

  const reorderedSections = [...availableSections];
  const [financeSection] = reorderedSections.splice(financeIndex, 1);
  const adjustedSettingsIndex = reorderedSections.findIndex((section) => section.label === SETTINGS_LABEL);
  reorderedSections.splice(adjustedSettingsIndex, 0, financeSection);

  return reorderedSections;
})();
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
  const t = useTranslation();
  const [websiteLock, setWebsiteLock] = useState(() => readWebsiteGenerationLock());
  const signOut = async () => {
    try {
      await requestApi({ path: "/auth/logout", method: "POST", body: {} });
    } finally {
      window.localStorage.removeItem(WEBSITE_GENERATION_STORAGE_KEY);
      clearSelectedWorkspaceId();
      navigateApp(routes.auth.login);
    }
  };
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
          if (section.label === "Calendar") {
            const calendarProps = pageLinkProps("lulu-calendar-portal-9014");
            const isCalendarActive = activeSlug === "lulu-calendar-portal-9014" || activeSlug.startsWith("calendar-");
            return (
              <a
                key={section.label}
                {...calendarProps}
                className={`lulu-global-navigation__primary-link${isCalendarActive ? " is-active" : ""}`}
                aria-current={isCalendarActive ? "page" : undefined}
              >
                <CalendarDays aria-hidden="true" size={16} />
                <span>{t("Calendar")}</span>
              </a>
            );
          }
          return (
            <details key={section.label} open={isActiveSection}>
              <summary
                className={isActiveSection ? "is-active" : undefined}
              >
                <span className="lulu-global-navigation__section-label">
                  <span>{section.label}</span>
                </span>
                <ChevronDown aria-hidden="true" size={14} />
              </summary>
              <div className="lulu-global-navigation__subitems">
                {section.pages.map((page) => {
                  const props = pageLinkProps(page.id);
                  const available = Boolean(props.href);
                  const isActivePage = page.id === activeSlug;
                  const isWebsiteLocked = Boolean(websiteLock?.blocking && isWebsiteNavigationSlug(page.id));
                  const supportsUnlockedSubpages = section.label === WEBSITE_AND_COMMERCE_LABEL || section.label === "Calendar";
                  const isDropdownLinkLocked = (SUBPAGE_NAVIGATION_LOCKED
                    && !supportsUnlockedSubpages
                    && page.id !== "smartly-shore-1468"
                    && page.id !== PRIMARY_AUDIENCES_SLUG
                    && page.id !== PRIMARY_REVIEWS_SLUG) || isWebsiteLocked || !available;
                  const lockedLabel = isWebsiteLocked ? websiteLockText : "Navigation-Link gesperrt";
                  return (
                    <a
                      key={page.id}
                      {...props}
                      href={isDropdownLinkLocked ? undefined : props.href}
                      data-lulu-route={isDropdownLinkLocked ? undefined : props["data-lulu-route"]}
                      className={`${isActivePage ? "is-active" : ""}${isDropdownLinkLocked ? " is-locked" : ""}`.trim() || undefined}
                      aria-current={isActivePage ? "page" : undefined}
                      aria-disabled={isDropdownLinkLocked || undefined}
                      tabIndex={isDropdownLinkLocked ? -1 : undefined}
                      onClick={isDropdownLinkLocked ? (event) => event.preventDefault() : undefined}
                      aria-label={isDropdownLinkLocked ? `${page.label} gesperrt: ${lockedLabel}` : page.label}
                      title={isDropdownLinkLocked ? lockedLabel : undefined}
                    >
                      <span>{page.label}</span>
                    </a>
                  );
                })}
                {section.label === SETTINGS_LABEL && (
                  <button
                    type="button"
                    className="lulu-global-navigation__subitem-action"
                    onClick={() => void signOut()}
                  >
                    <LogOut aria-hidden="true" size={14} />
                    <span>{t("Sign out")}</span>
                  </button>
                )}
                {websiteLock && section.label === WEBSITE_AND_COMMERCE_LABEL && (
                  <div className={`lulu-global-navigation__website-lock is-${websiteLock.status}`} role="status" aria-live="polite">
                    <RefreshCw aria-hidden="true" size={13} className={websiteLock.blocking ? "animate-spin" : undefined} />
                    <span>{websiteLockText}</span>
                  </div>
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

