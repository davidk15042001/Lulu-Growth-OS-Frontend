import { CalendarDays, Check, ChevronDown, Languages, LogOut, RefreshCw, X } from "lucide-react";
import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";
import { requestApi } from "../api/client";
import { useLuluApp } from "../api/LuluAppContext";
import { clearSelectedWorkspaceId, getSelectedWorkspaceId } from "../api/session";
import { websitesApi, type WebsiteGenerationJob } from "../api/websites";
import { AccountSessions } from "./AccountSessions";
import { switchLanguage, useLanguage, useTranslation } from "../i18n/GlobalLanguageSwitcher";
import { isAvailableLanguageCode, languages } from "../i18n/languages";
import { isPageAvailable, navigateApp, pageLinkProps, routes } from "../routing";
import {
  CRM_LABEL,
  CRM_LANDING_PAGE_ID,
  DIRECT_SECTION_LABELS,
  SETTINGS_LABEL,
  WEBSITE_AND_COMMERCE_LABEL,
  getWorkspaceCapabilityRoute,
  getWorkspaceNavigationSections,
  type NavigationPage,
  type NavigationSection,
} from "../config/workspace-capability-registry";

const WEBSITE_GENERATION_STORAGE_KEY = "lulu.website.active-generation";
const RUNNING_STATUSES = new Set(["queued", "planning", "publishing"]);
const DISPLAY_STATUSES = new Set(["queued", "planning", "generated", "preview", "publishing", "failed", "cancelled"]);
type StoredWebsiteGeneration = { workspaceId: string; siteId: string; provider: "wordpress" | "webflow"; job: WebsiteGenerationJob };

function isBlockingWebsiteJob(job: Pick<WebsiteGenerationJob, "status" | "autoPublish">) {
  return RUNNING_STATUSES.has(job.status) || (job.autoPublish !== false && ["generated", "preview"].includes(job.status));
}

function readWebsiteGenerationLock() {
  try {
    const raw = window.localStorage.getItem(WEBSITE_GENERATION_STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<StoredWebsiteGeneration>;
    const status = String(value.job?.status ?? "");
    if (!value.workspaceId || value.workspaceId !== getSelectedWorkspaceId() || !value.siteId || !value.job?.id || !DISPLAY_STATUSES.has(status)) return null;
    return { siteId: value.siteId, jobId: value.job.id, status, blocking: isBlockingWebsiteJob(value.job) };
  } catch { return null; }
}

function websiteLockLabel(status: string, t: (key: string) => string) {
  if (status === "failed") return t("Generierung fehlgeschlagen");
  if (status === "cancelled") return t("Generierung abgebrochen");
  if (status === "publishing") return t("Veröffentlichung läuft");
  if (status === "preview") return t("Vorschau wird vorbereitet");
  if (status === "planning") return t("Planung läuft");
  return t("Website wird generiert");
}

export function LuluGlobalNavigation({ activeSlug, mobileOpen = false, onNavigate, onRequestClose }: { activeSlug: string; mobileOpen?: boolean; onNavigate?: () => void; onRequestClose?: () => void }) {
  const t = useTranslation();
  const language = useLanguage();
  const { selectedWorkspace, permissions } = useLuluApp();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [websiteLock, setWebsiteLock] = useState(() => readWebsiteGenerationLock());
  const activationPageId = !selectedWorkspace?.onboardingCompletedAt
    ? selectedWorkspace?.onboardingStep === "profile_completion" ? "profile" : selectedWorkspace?.onboardingStep === "knowledge_base" ? "rich-field-1880" : null
    : null;
  const navigationSections = useMemo(() => getWorkspaceNavigationSections()
    .map((section) => ({
      ...section,
      pages: section.pages.filter((page) => {
        if (!isPageAvailable(page.id) && page.id !== activeSlug) return false;
        if (activationPageId) return page.id === activationPageId;
        // During a rolling deploy or a workspace switch, retain only the current
        // read surface. Never infer mutation rights from a role while bootstrap is unknown.
        if (permissions.status !== "ready") return page.id === activeSlug;
        const route = getWorkspaceCapabilityRoute(page.id);
        return !route || route.requiredPermissions.every((capability) => permissions.capabilities.includes(capability));
      }),
    }))
    .filter((section) => section.pages.length > 0), [activeSlug, activationPageId, permissions]);
  const activeSection = navigationSections.find((section) => section.pages.some((page) => page.id === activeSlug))?.label ?? null;
  const [openSection, setOpenSection] = useState<string | null>(() => activeSection);

  useEffect(() => setOpenSection(activeSection), [activeSection]);
  useEffect(() => {
    const update = () => setWebsiteLock(readWebsiteGenerationLock());
    let requestRunning = false;
    const poll = async () => {
      update();
      const current = readWebsiteGenerationLock();
      const workspaceId = getSelectedWorkspaceId();
      if (requestRunning || !current?.blocking || !workspaceId) return;
      requestRunning = true;
      try {
        const response = await websitesApi.getGenerationJob(workspaceId, current.siteId, current.jobId);
        const raw = window.localStorage.getItem(WEBSITE_GENERATION_STORAGE_KEY);
        const stored = raw ? JSON.parse(raw) as Partial<StoredWebsiteGeneration> : null;
        if (stored?.job?.id === current.jobId) {
          if (isBlockingWebsiteJob(response.data) || ["failed", "cancelled"].includes(response.data.status)) window.localStorage.setItem(WEBSITE_GENERATION_STORAGE_KEY, JSON.stringify({ ...stored, job: response.data }));
          else window.localStorage.removeItem(WEBSITE_GENERATION_STORAGE_KEY);
        }
      } catch { /* A transient poll error is not a failed generation. */ }
      finally { requestRunning = false; update(); }
    };
    window.addEventListener("storage", update);
    window.addEventListener("lulu:website-generation-status", update);
    const timer = window.setInterval(() => void poll(), 2500);
    void poll();
    return () => { window.removeEventListener("storage", update); window.removeEventListener("lulu:website-generation-status", update); window.clearInterval(timer); };
  }, []);

  const signOut = async () => {
    try { await requestApi({ path: "/auth/logout", method: "POST", body: {} }); }
    finally { window.localStorage.removeItem(WEBSITE_GENERATION_STORAGE_KEY); clearSelectedWorkspaceId(); onNavigate?.(); navigateApp(routes.auth.login); }
  };
  const directLink = (section: NavigationSection, pageId: string, icon?: ReactNode) => {
    const props = pageLinkProps(pageId);
    const active = section.pages.some((page) => page.id === activeSlug);
    return <a key={section.label} {...props} className={`lulu-global-navigation__primary-link${active ? " is-active" : ""}`} aria-current={active ? "page" : undefined} onClick={(event) => { event.preventDefault(); if (props.href) { onNavigate?.(); navigateApp(props.href); } }}>
      {icon}<span>{t(section.label)}</span>
    </a>;
  };

  return <aside id="lulu-global-navigation" className={`lulu-global-navigation${mobileOpen ? " is-mobile-open" : ""}`} data-lulu-global-navigation="true">
    <div className="lulu-global-navigation__workspace-label"><span>{t(activationPageId ? "Complete activation" : "Workspace")}</span><button type="button" className="lulu-global-navigation__close" aria-label={t("Close navigation")} onClick={onRequestClose}><X aria-hidden="true" size={16} /></button></div>
    <nav className="lulu-global-navigation__sections">
      {navigationSections.map((section) => {
        if (section.label === CRM_LABEL) return directLink(section, CRM_LANDING_PAGE_ID);
        if (section.label === "Calendar") return directLink(section, "lulu-calendar-portal-9014", <CalendarDays aria-hidden="true" size={16} />);
        if (DIRECT_SECTION_LABELS.has(section.label)) return directLink(section, section.pages[0]!.id);
        const active = section.pages.some((page) => page.id === activeSlug);
        return <Fragment key={section.label}><details open={openSection === section.label} onToggle={(event) => {
          const isOpen = event.currentTarget.open;
          setOpenSection((current) => isOpen ? section.label : current === section.label ? null : current);
        }}>
          <summary className={active ? "is-active" : undefined}><span className="lulu-global-navigation__section-label"><span>{t(section.label)}</span></span><ChevronDown aria-hidden="true" size={14} /></summary>
          <div className="lulu-global-navigation__subitems">
            {section.pages.map((page) => {
              const props = pageLinkProps(page.id);
              const available = Boolean(props.href);
              return <a key={page.id} {...props} href={available ? props.href : undefined} data-lulu-route={available ? props["data-lulu-route"] : undefined} className={`${page.id === activeSlug ? "is-active" : ""}${available ? "" : " is-locked"}`.trim() || undefined} aria-current={page.id === activeSlug ? "page" : undefined} aria-disabled={!available || undefined} onClick={(event) => { event.preventDefault(); if (props.href) { onNavigate?.(); navigateApp(props.href); } }}><span>{t(page.label)}</span></a>;
            })}
            {section.label === SETTINGS_LABEL && <>
              {!activationPageId && <><button type="button" className="lulu-global-navigation__subitem-action" onClick={() => setSessionsOpen(true)}>{t("Active sessions")}</button>{sessionsOpen && <AccountSessions onClose={() => setSessionsOpen(false)} />}
                <button type="button" className="lulu-global-navigation__subitem-action" onClick={() => setLanguageOpen((value) => !value)} aria-expanded={languageOpen}><Languages aria-hidden="true" size={14} /><span>{t("Language")}</span></button>
                {languageOpen && <div className="lulu-global-navigation__language-list">{languages.filter((option) => isAvailableLanguageCode(option.code)).map((option) => <button key={option.code} type="button" className={`lulu-global-navigation__language-option${option.code === language ? " is-active" : ""}`} onClick={() => switchLanguage(option.code)}><span lang={option.code} dir={option.direction} data-lulu-no-translate="true" translate="no">{option.nativeName}</span>{option.code === language && <Check aria-hidden="true" size={13} />}</button>)}</div>}
              </>}
              <button type="button" className="lulu-global-navigation__subitem-action" onClick={() => void signOut()}><LogOut aria-hidden="true" size={14} /><span>{t("Sign out")}</span></button>
            </>}
            {websiteLock && section.label === WEBSITE_AND_COMMERCE_LABEL && <div className={`lulu-global-navigation__website-lock is-${websiteLock.status}`} role="status"><RefreshCw aria-hidden="true" size={13} className={websiteLock.blocking ? "animate-spin" : undefined} /><span>{websiteLockLabel(websiteLock.status, t)} · {t(websiteLock.status)}</span></div>}
          </div>
        </details></Fragment>;
      })}
      {activationPageId && navigationSections.length === 0 && <button type="button" className="lulu-global-navigation__subitem-action" onClick={() => void signOut()}><LogOut aria-hidden="true" size={14} /><span>{t("Sign out")}</span></button>}
      {!navigationSections.some((section) => section.label === SETTINGS_LABEL) && !activationPageId && <button type="button" className="lulu-global-navigation__subitem-action" onClick={() => void signOut()}><LogOut aria-hidden="true" size={14} /><span>{t("Sign out")}</span></button>}
    </nav>
  </aside>;
}

export type { NavigationPage, NavigationSection };
