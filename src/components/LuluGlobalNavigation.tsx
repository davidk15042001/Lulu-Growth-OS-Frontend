import { CalendarDays, Check, ChevronDown, Languages, LogOut, RefreshCw, X } from "lucide-react";
import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";
import { clearAuthSession, getTechnicalErrorDetails, requestApi } from "../api/client";
import { useLuluApp } from "../api/LuluAppContext";
import { clearSelectedWorkspaceId, clearStoredUser, getSelectedWorkspaceId } from "../api/session";
import { websitesApi, type WebsiteGenerationJob } from "../api/websites";
import { workspaceAppApi } from "../api/workspace-app";
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
// This route remains a valid internal destination, but the user asked to keep
// the legacy assistant landing page out of the Workspace navigation.
const HIDDEN_WORKSPACE_NAVIGATION_PAGE_IDS = new Set(["fresh-moon-5374"]);
type StoredWebsiteGeneration = { workspaceId: string; siteId: string; provider: "managed"; job: WebsiteGenerationJob };

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
  const canToggleAgents = Boolean(selectedWorkspace && permissions.status === "ready");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [websiteLock, setWebsiteLock] = useState(() => readWebsiteGenerationLock());
  const [agentsPaused, setAgentsPaused] = useState(false);
  const [agentCadenceMinutes, setAgentCadenceMinutes] = useState(360);
  const [agentsToggleBusy, setAgentsToggleBusy] = useState(false);
  const [agentCadenceBusy, setAgentCadenceBusy] = useState(false);
  const [agentsToggleError, setAgentsToggleError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const activationPageId = !selectedWorkspace?.onboardingCompletedAt
    ? selectedWorkspace?.onboardingStep === "profile_completion" ? "profile" : selectedWorkspace?.onboardingStep === "knowledge_base" ? "rich-field-1880" : null
    : null;
  const navigationSections = useMemo(() => getWorkspaceNavigationSections()
    .map((section) => ({
      ...section,
      pages: section.pages.filter((page) => {
        if (HIDDEN_WORKSPACE_NAVIGATION_PAGE_IDS.has(page.id)) return false;
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
    if (!selectedWorkspace || !canToggleAgents) return;
    let mounted = true;
    void workspaceAppApi.settings(selectedWorkspace.id).then((response) => {
      if (mounted) {
        setAgentsPaused(response.data.settings.agents?.paused === true);
        const cadence = response.data.settings.agents?.cadenceMinutes;
        if (typeof cadence === "number" && Number.isFinite(cadence)) setAgentCadenceMinutes(cadence);
      }
    }).catch(() => undefined);
    return () => { mounted = false; };
  }, [selectedWorkspace, canToggleAgents]);
  const toggleAgents = async () => {
    if (!selectedWorkspace || !canToggleAgents || agentsToggleBusy) return;
    const nextPaused = !agentsPaused;
    setAgentsToggleBusy(true);
    try {
      const response = await workspaceAppApi.updateSettings(selectedWorkspace.id, { agents: { paused: nextPaused } });
      setAgentsPaused(response.data.settings.agents?.paused === true);
      window.dispatchEvent(new CustomEvent("lulu:agent-settings-changed", { detail: { workspaceId: selectedWorkspace.id } }));
      setAgentsToggleError(null);
      } catch (error) {
        // Keep the last confirmed state visible and give the user a retryable
        // signal instead of leaving an unhandled promise behind.
        setAgentsToggleError(getTechnicalErrorDetails(error));
    } finally {
      setAgentsToggleBusy(false);
    }
  };
  const updateAgentCadence = async (value: string) => {
    if (!selectedWorkspace || !canToggleAgents || agentCadenceBusy) return;
    const cadenceMinutes = Number(value);
    if (!Number.isInteger(cadenceMinutes)) return;
    setAgentCadenceBusy(true);
    try {
      const response = await workspaceAppApi.updateSettings(selectedWorkspace.id, { agents: { cadenceMinutes } });
      const next = response.data.settings.agents?.cadenceMinutes;
      if (typeof next === "number") setAgentCadenceMinutes(next);
      setAgentsToggleError(null);
    } catch (error) {
      setAgentsToggleError(getTechnicalErrorDetails(error));
    } finally { setAgentCadenceBusy(false); }
  };
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
    if (signingOut) return;
    setSigningOut(true);
    try { await requestApi({ path: "/auth/logout", method: "POST", body: {} }); }
    finally {
      window.localStorage.removeItem(WEBSITE_GENERATION_STORAGE_KEY);
      clearSelectedWorkspaceId();
      clearStoredUser();
      clearAuthSession();
      // Do not use client-side route navigation here. The provider still has
      // the old user for one render, which can bounce PublicAuthRoute back to
      // the workspace. A single document redirect prevents that flash loop.
      window.location.replace(routes.auth.login);
    }
  };
  const signOutButton = <button type="button" className="lulu-global-navigation__subitem-action" onClick={() => void signOut()} disabled={signingOut} aria-busy={signingOut}><LogOut aria-hidden="true" size={14} /><span>{t("Sign out")}</span></button>;
  const directLink = (section: NavigationSection, pageId: string, icon?: ReactNode) => {
    const props = pageLinkProps(pageId);
    const active = section.pages.some((page) => page.id === activeSlug);
    return <a key={section.label} {...props} className={`lulu-global-navigation__primary-link${active ? " is-active" : ""}`} aria-current={active ? "page" : undefined} onClick={(event) => { event.preventDefault(); if (props.href) { onNavigate?.(); navigateApp(props.href); } }}>
      {icon}<span>{t(section.label)}</span>
    </a>;
  };

  return <aside id="lulu-global-navigation" className={`lulu-global-navigation${mobileOpen ? " is-mobile-open" : ""}`} data-lulu-global-navigation="true">
    <div className="lulu-global-navigation__workspace-label"><span>{t(activationPageId ? "Complete activation" : "Workspace")}</span><button type="button" className="lulu-global-navigation__close" aria-label={t("Close navigation")} onClick={onRequestClose}><X aria-hidden="true" size={16} /></button></div>
    <nav className="lulu-global-navigation__sections" aria-label={t("Workspace")}>
      {navigationSections.map((section) => {
        if (section.label === CRM_LABEL) return directLink(section, CRM_LANDING_PAGE_ID);
        if (section.label === "Finance") return directLink(section, "quietly-stone-4158");
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
                {canToggleAgents && <><button type="button" className="lulu-global-navigation__subitem-action" onClick={() => void toggleAgents()} disabled={agentsToggleBusy} aria-pressed={!agentsPaused} aria-busy={agentsToggleBusy} title={agentsToggleError ?? undefined}><span className={`lulu-global-navigation__agent-toggle${agentsPaused ? " is-paused" : " is-active"}`} aria-hidden="true"><span /></span><span>{agentsToggleBusy ? t("Updating agents…") : agentsPaused ? t("Agents paused") : t("Agents active")}</span></button><label className="lulu-global-navigation__subitem-action" title={t("How often Lulu may run scheduled work")}>{t("Agent schedule")}<select value={agentCadenceMinutes} onChange={(event) => void updateAgentCadence(event.target.value)} disabled={agentCadenceBusy} aria-label={t("Agent schedule")}><option value={15}>{t("Every 15 minutes")}</option><option value={60}>{t("Every hour")}</option><option value={360}>{t("Every 6 hours")}</option><option value={720}>{t("Twice a day")}</option><option value={1440}>{t("Once a day")}</option></select></label>{agentsToggleError && <span className="lulu-global-navigation__agent-toggle-error" role="alert">{t("Could not update agent status. Please try again.")} <small>{agentsToggleError}</small></span>}</>}
                <button type="button" className="lulu-global-navigation__subitem-action" onClick={() => setLanguageOpen((value) => !value)} aria-expanded={languageOpen}><Languages aria-hidden="true" size={14} /><span>{t("Language")}</span></button>
                {languageOpen && <div className="lulu-global-navigation__language-list">{languages.filter((option) => isAvailableLanguageCode(option.code)).map((option) => <button key={option.code} type="button" className={`lulu-global-navigation__language-option${option.code === language ? " is-active" : ""}`} onClick={() => switchLanguage(option.code)}><span lang={option.code} dir={option.direction} data-lulu-no-translate="true" translate="no">{option.nativeName}</span>{option.code === language && <Check aria-hidden="true" size={13} />}</button>)}</div>}
              </>}
              {signOutButton}
            </>}
            {websiteLock && section.label === WEBSITE_AND_COMMERCE_LABEL && <div className={`lulu-global-navigation__website-lock is-${websiteLock.status}`} role="status"><RefreshCw aria-hidden="true" size={13} className={websiteLock.blocking ? "animate-spin" : undefined} /><span>{websiteLockLabel(websiteLock.status, t)} · {t(websiteLock.status)}</span></div>}
          </div>
        </details></Fragment>;
      })}
      {activationPageId && navigationSections.length === 0 && signOutButton}
      {!navigationSections.some((section) => section.label === SETTINGS_LABEL) && !activationPageId && signOutButton}
    </nav>
  </aside>;
}

export type { NavigationPage, NavigationSection };
