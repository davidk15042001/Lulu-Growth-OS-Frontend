export const HOME_PAGE_SLUG = "fresh-moon-5374";

export const routes = {
  auth: {
    login: "/login",
    signUp: "/auth/sign-up",
    forgotPassword: "/auth/forgot-password",
    verificationEmail: "/auth/verification-email",
    verifyEmail: "/auth/verify-email",
    resetPassword: "/auth/reset-password",
    sessionExpired: "/auth/session-expired",
    signedOut: "/auth/signed-out",
  },
  onboarding: {
    welcome: "/onboarding/welcome",
    companyInformation: "/onboarding/company-information",
    businessDescription: "/onboarding/business-description",
    productsServices: "/onboarding/products-services",
    existingPlatforms: "/onboarding/existing-platforms",
    billing: "/onboarding/billing",
    billings: "/billings",
  },
  app: {
    dashboard: `/app/${HOME_PAGE_SLUG}`,
    website: "/app/website",
    email: "/app/email",
    calendar: "/app/calendar",
  },
  allPages: "/all-pages",
} as const;

const canonicalPathsBySlug: Readonly<Record<string, string>> = {
  "brightly-door-5741": routes.auth.login,
  "finely-year-1146": routes.auth.signUp,
  "crisp-garden-7026": routes.auth.forgotPassword,
  "crisp-week-7116": routes.auth.verificationEmail,
  "eagerly-bay-9885": routes.auth.verifyEmail,
  "deep-coast-9085": routes.auth.resetPassword,
  "kind-morning-4984": routes.auth.sessionExpired,
  "mightily-minute-5145": routes.auth.signedOut,
  "bravely-path-4713": routes.onboarding.companyInformation,
  "quiet-garden-9477": routes.onboarding.businessDescription,
  "keen-morning-6353": routes.onboarding.productsServices,
  "lulu-website-portal-9012": routes.app.website,
  "lulu-email-portal-9013": routes.app.email,
  "lulu-calendar-portal-9014": routes.app.calendar,
};

export const LEGACY_SETUP_COMPLETE_PATH = "/onboarding/setup-complete";
export const LULU_NAVIGATION_MESSAGE = "lulu:navigate";
export const SUBPAGE_NAVIGATION_LOCKED = false;
export const PRIMARY_AUDIENCES_SLUG = "breezily-wood-5980";
export const PRIMARY_REVIEWS_SLUG = "daring-brook-9034";
export const AI_KNOWLEDGE_SLUG = "rich-field-1880";
export const LEGACY_ADVERTISING_AUDIENCES_SLUG = "softly-second-7684";
export const GOOGLE_BUSINESS_NAVIGATION_SLUGS = new Set([
  PRIMARY_REVIEWS_SLUG,
  "fresh-tide-9404",
  "glad-coast-1428",
]);

const EXPLICITLY_UNLOCKED_SUBPAGE_SLUGS = new Set([
  "smartly-shore-1468",
  PRIMARY_AUDIENCES_SLUG,
  AI_KNOWLEDGE_SLUG,
  PRIMARY_REVIEWS_SLUG,
]);

const WEBSITE_NAVIGATION_SLUGS = new Set([
  "lulu-website-portal-9012",
  "sparklingly-moon-5114",
  "zealously-path-4224",
  "sunny-house-9595",
  "smartly-shore-1468",
]);

const WEB_PRESENCE_NAVIGATION_SLUGS = new Set([
  ...WEBSITE_NAVIGATION_SLUGS,
  "smart-ocean-3898",
  "nice-year-6253",
  "nicely-ocean-1051",
  "richly-forest-5832",
  "mightily-shore-7108",
  "fancy-ground-8040",
  "serenely-sand-9226",
  "smart-village-1099",
  "dreamy-shade-5445",
  PRIMARY_REVIEWS_SLUG,
  "sharply-sky-4161",
  "wildly-time-4260",
  "quietly-moon-4186",
  "merry-castle-3260",
  "merry-cliff-8846",
  "safely-dawn-7731",
  "purely-dusk-2409",
  "soft-hill-4757",
  "safely-air-9334",
  "merry-land-6169",
]);

export type LuluNavigationMessage = {
  type: typeof LULU_NAVIGATION_MESSAGE;
  to: string;
  replace?: boolean;
};

export function pagePath(slug: string) {
  if (slug.startsWith("website-")) return `${routes.app.website}?section=${encodeURIComponent(slug.slice("website-".length))}`;
  if (slug.startsWith("email-")) return `${routes.app.email}?section=${encodeURIComponent(slug.slice("email-".length))}`;
  if (slug.startsWith("calendar-")) return `${routes.app.calendar}?section=${encodeURIComponent(slug.slice("calendar-".length))}`;
  return canonicalPathsBySlug[slug] ?? `/app/${slug}`;
}

const REMOVED_PAGE_SLUGS = new Set([
  "brave-stream-5322",
  "boldly-field-4971",
  "website-settings-9019",
  LEGACY_ADVERTISING_AUDIENCES_SLUG,
  "swift-hour-7844",
  "calmly-cloud-9988",
  "sunnily-gulf-7520",
  "smartly-shade-4619",
]);

const TOP_LEVEL_PAGE_SLUGS = new Set([
  HOME_PAGE_SLUG,
  "fancily-leaf-1766",
  "lulu-website-portal-9012",
  "lulu-email-portal-9013",
  "lulu-calendar-portal-9014",
]);

export function isPageAvailable(slug: string) {
  return Boolean(slug) && !REMOVED_PAGE_SLUGS.has(slug);
}

export function isPortalSectionSlug(slug: string) {
  return slug.startsWith("website-") || slug.startsWith("email-") || slug.startsWith("calendar-");
}

export function isWebsiteNavigationSlug(slug: string) {
  return slug.startsWith("website-") || WEBSITE_NAVIGATION_SLUGS.has(slug);
}

export function isWebPresenceNavigationSlug(slug: string) {
  return slug.startsWith("website-") || WEB_PRESENCE_NAVIGATION_SLUGS.has(slug);
}

export function isGoogleBusinessNavigationSlug(slug: string) {
  return GOOGLE_BUSINESS_NAVIGATION_SLUGS.has(slug);
}

export function isSubpageLocked(slug: string) {
  if (!SUBPAGE_NAVIGATION_LOCKED) return false;
  if (!isPageAvailable(slug)) return true;
  if (isWebPresenceNavigationSlug(slug)) return false;
  if (isGoogleBusinessNavigationSlug(slug)) return false;
  if (EXPLICITLY_UNLOCKED_SUBPAGE_SLUGS.has(slug)) return false;
  if (slug.startsWith("calendar-")) return false;
  if (isPortalSectionSlug(slug)) return true;
  if (canonicalPathsBySlug[slug]) return false;
  return !TOP_LEVEL_PAGE_SLUGS.has(slug);
}

export function isPageNavigable(slug: string) {
  return isPageAvailable(slug) && !isSubpageLocked(slug);
}

export function pageLinkProps(slug: string) {
  const href = pagePath(slug);
  const isAvailable = isPageAvailable(slug);
  const isNavigable = isPageNavigable(slug);
  return {
    href: isNavigable ? href : undefined,
    target: "_top" as const,
    "data-lulu-route": isNavigable ? href : undefined,
    "data-lulu-soon": undefined,
    "aria-disabled": isNavigable ? undefined : ("true" as const),
    hidden: isAvailable ? undefined : true,
    tabIndex: isNavigable ? undefined : -1,
  };
}

export function isLuluNavigationMessage(value: unknown): value is LuluNavigationMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<LuluNavigationMessage>;
  return message.type === LULU_NAVIGATION_MESSAGE && typeof message.to === "string" && message.to.startsWith("/");
}

export function navigateApp(to: string, options: { replace?: boolean } = {}) {
  const message: LuluNavigationMessage = {
    type: LULU_NAVIGATION_MESSAGE,
    to,
    replace: options.replace,
  };

  if (window.parent !== window) {
    const target = new URL(to, window.location.href);
    const before = `${window.location.pathname}${window.location.search}`;
    window.parent.postMessage(message, window.location.origin);
    window.setTimeout(() => {
      const current = `${window.location.pathname}${window.location.search}`;
      if (current === before && `${target.pathname}${target.search}` !== before) window.location.assign(target.pathname + target.search + target.hash);
    }, 180);
    return;
  }

  if (options.replace) {
    window.location.replace(to);
  } else {
    window.location.assign(to);
  }
}
