import {
  BookOpen,
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  Globe2,
  Languages,
  Link2,
  LogOut,
  MessagesSquare,
  Settings,
  Sparkles,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import { requestApi } from "../api/client";
import { useLuluApp } from "../api/LuluAppContext";
import { clearSelectedWorkspaceId } from "../api/session";
import { AccountSessions } from "./AccountSessions";
import { switchLanguage, useLanguage, useTranslation } from "../i18n/GlobalLanguageSwitcher";
import { isAvailableLanguageCode, languages } from "../i18n/languages";
import { isWebPresenceNavigationSlug, navigateApp, routes } from "../routing";

type NavigationItem = {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  isActive: (slug: string) => boolean;
};

const COMPANY_SLUGS = new Set(["sturdy-month-1562", "kindly-pool-8785"]);
const COMMUNICATION_SLUGS = new Set(["communications", "omnichannel", "lulu-email-portal-9013", "lulu-calendar-portal-9014"]);
const FINANCE_SLUGS = new Set([
  "finance", "breezy-soil-2475", "tender-creek-3139", "quietly-stone-4158", "cool-rain-6499",
  "richly-land-8084", "calm-tide-3752", "zesty-earth-3938", "bravely-bay-4544", "eager-minute-1586",
  "fair-bridge-8618", "soft-town-3284", "wisely-gate-3183", "sharp-morning-7310", "sparklingly-city-3338",
  "radiant-hour-5376", "lucky-park-8649", "vibrantly-second-9428", "sturdy-week-3372",
]);
const SETTINGS_SLUGS = new Set(["profile", "rich-field-1880", "fresh-tide-9404", "glad-coast-1428", "support"]);

const MAIN_NAVIGATION: readonly NavigationItem[] = [
  { id: "lulu", label: "Lulu", href: routes.app.dashboard, icon: Sparkles, isActive: (slug) => slug === "fresh-moon-5374" },
  { id: "companies", label: "Companies", href: "/app/sturdy-month-1562", icon: Building2, isActive: (slug) => COMPANY_SLUGS.has(slug) },
  {
    id: "communications",
    label: "Communications",
    href: routes.app.communications,
    icon: MessagesSquare,
    isActive: (slug) => COMMUNICATION_SLUGS.has(slug) || slug.startsWith("email-") || slug.startsWith("calendar-"),
  },
  { id: "growth", label: "Growth", href: routes.app.growth, icon: TrendingUp, isActive: (slug) => slug === "growth" },
  {
    id: "online-presence",
    label: "Online Presence",
    href: routes.app.onlinePresence,
    icon: Globe2,
    isActive: (slug) => slug === "online-presence" || slug === "nicely-ocean-1051" || isWebPresenceNavigationSlug(slug),
  },
  { id: "finance", label: "Finance", href: routes.app.finance, icon: WalletCards, isActive: (slug) => FINANCE_SLUGS.has(slug) },
];

const SETTINGS_ITEMS = [
  { id: "profile", label: "Profile", href: routes.app.profile, icon: Building2 },
  { id: "rich-field-1880", label: "Knowledge Base", href: routes.app.knowledgeBase, icon: BookOpen },
  { id: "fresh-tide-9404", label: "Connections", href: routes.app.connections, icon: Link2 },
  { id: "support", label: "Support", href: "/app/support", icon: CircleHelp },
] as const;

function NavigationLink({ item, activeSlug, onNavigate }: { item: NavigationItem; activeSlug: string; onNavigate?: () => void }) {
  const t = useTranslation();
  const active = item.isActive(activeSlug);
  const Icon = item.icon;
  return (
    <a
      href={item.href}
      data-lulu-route={item.href}
      className={`lulu-global-navigation__primary-link${active ? " is-active" : ""}`}
      aria-current={active ? "page" : undefined}
      onClick={(event) => {
        event.preventDefault();
        onNavigate?.();
        navigateApp(item.href);
      }}
    >
      <Icon aria-hidden={true} size={17} />
      <span>{t(item.label)}</span>
    </a>
  );
}

export function LuluGlobalNavigation({
  activeSlug,
  mobileOpen = false,
  onNavigate,
  onRequestClose,
}: {
  activeSlug: string;
  mobileOpen?: boolean;
  onNavigate?: () => void;
  onRequestClose?: () => void;
}) {
  const t = useTranslation();
  const language = useLanguage();
  const { selectedWorkspace } = useLuluApp();
  const [settingsOpen, setSettingsOpen] = useState(() => SETTINGS_SLUGS.has(activeSlug));
  const [languageOpen, setLanguageOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);

  const activationPageId = !selectedWorkspace?.onboardingCompletedAt
    ? selectedWorkspace?.onboardingStep === "profile_completion"
      ? "profile"
      : selectedWorkspace?.onboardingStep === "knowledge_base"
        ? "rich-field-1880"
        : null
    : null;
  const visibleSettings = useMemo(
    () => activationPageId ? SETTINGS_ITEMS.filter((item) => item.id === activationPageId) : SETTINGS_ITEMS,
    [activationPageId],
  );

  useEffect(() => {
    if (SETTINGS_SLUGS.has(activeSlug) || activationPageId) setSettingsOpen(true);
  }, [activeSlug, activationPageId]);

  const signOut = async () => {
    try {
      await requestApi({ path: "/auth/logout", method: "POST", body: {} });
    } finally {
      clearSelectedWorkspaceId();
      onNavigate?.();
      navigateApp(routes.auth.login);
    }
  };

  return (
    <aside
      id="lulu-global-navigation"
      className={`lulu-global-navigation${mobileOpen ? " is-mobile-open" : ""}`}
      data-lulu-global-navigation="true"
    >
      <div className="lulu-global-navigation__workspace-label">
        <span>{activationPageId ? t("Complete activation") : t("Workspace")}</span>
        <button type="button" className="lulu-global-navigation__close" aria-label={t("Close navigation")} onClick={onRequestClose}>
          <X aria-hidden="true" size={16} />
        </button>
      </div>

      <nav className="lulu-global-navigation__sections">
        {!activationPageId && MAIN_NAVIGATION.map((item) => (
          <NavigationLink key={item.id} item={item} activeSlug={activeSlug} onNavigate={onNavigate} />
        ))}

        <details open={settingsOpen} onToggle={(event) => setSettingsOpen(event.currentTarget.open)}>
          <summary className={SETTINGS_SLUGS.has(activeSlug) ? "is-active" : undefined}>
            <span className="lulu-global-navigation__section-label">
              <Settings aria-hidden="true" size={17} />
              <span>{t("Settings")}</span>
            </span>
            <ChevronDown aria-hidden="true" size={14} />
          </summary>
          <div className="lulu-global-navigation__subitems">
            {visibleSettings.map((item) => {
              const Icon = item.icon;
              const active = item.id === activeSlug;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  data-lulu-route={item.href}
                  className={active ? "is-active" : undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate?.();
                    navigateApp(item.href);
                  }}
                >
                  <Icon aria-hidden={true} size={14} />
                  <span>{t(item.label)}</span>
                </a>
              );
            })}

            {!activationPageId && (
              <>
                <button type="button" className="lulu-global-navigation__subitem-action" onClick={() => setSessionsOpen(true)}>
                  {t("Active sessions")}
                </button>
                {sessionsOpen && <AccountSessions onClose={() => setSessionsOpen(false)} />}
                <button
                  type="button"
                  className="lulu-global-navigation__subitem-action"
                  onClick={() => setLanguageOpen((value) => !value)}
                  aria-expanded={languageOpen}
                >
                  <Languages aria-hidden="true" size={14} />
                  <span>{t("Language")}</span>
                </button>
                {languageOpen && (
                  <div className="lulu-global-navigation__language-list">
                    {languages.filter((option) => isAvailableLanguageCode(option.code)).map((option) => (
                      <button
                        key={option.code}
                        type="button"
                        className={`lulu-global-navigation__language-option${option.code === language ? " is-active" : ""}`}
                        onClick={() => switchLanguage(option.code)}
                      >
                        <span lang={option.code} dir={option.direction} data-lulu-no-translate="true" translate="no">{option.nativeName}</span>
                        {option.code === language && <Check aria-hidden="true" size={13} />}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
            <button type="button" className="lulu-global-navigation__subitem-action" onClick={() => void signOut()}>
              <LogOut aria-hidden="true" size={14} />
              <span>{t("Sign out")}</span>
            </button>
          </div>
        </details>
      </nav>
    </aside>
  );
}
