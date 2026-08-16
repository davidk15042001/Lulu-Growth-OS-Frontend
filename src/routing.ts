export const routes = {
  auth: {
    login: "/auth/login",
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
    aiPreferences: "/onboarding/ai-preferences",
    setupComplete: "/onboarding/setup-complete",
  },
  app: {
    dashboard: "/app/fancily-leaf-1766",
    website: "/app/website",
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
  "steady-stone-6443": routes.onboarding.welcome,
  "bravely-path-4713": routes.onboarding.companyInformation,
  "quiet-garden-9477": routes.onboarding.businessDescription,
  "keen-morning-6353": routes.onboarding.productsServices,
  "fresh-tide-9404": routes.onboarding.existingPlatforms,
  "wisely-brook-1005": routes.onboarding.aiPreferences,
  "keenly-valley-3615": routes.onboarding.setupComplete,
  "lulu-website-portal-9012": routes.app.website,
};

export const LULU_NAVIGATION_MESSAGE = "lulu:navigate";

export type LuluNavigationMessage = {
  type: typeof LULU_NAVIGATION_MESSAGE;
  to: string;
  replace?: boolean;
};

export function pagePath(slug: string) {
  return canonicalPathsBySlug[slug] ?? `/app/${slug}`;
}

export function pageLinkProps(slug: string) {
  const href = pagePath(slug);
  return {
    href,
    target: "_top" as const,
    "data-lulu-route": href,
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
    window.parent.postMessage(message, window.location.origin);
    return;
  }

  if (options.replace) {
    window.location.replace(to);
  } else {
    window.location.assign(to);
  }
}
