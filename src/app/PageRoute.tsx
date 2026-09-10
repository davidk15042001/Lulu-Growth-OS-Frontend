import { Navigate, useLocation } from "react-router-dom";
import type { PageDefinition } from "../pages-manifest";
import { getPageContract } from "../api/page-contracts";
import { useLuluApp } from "../api/LuluAppContext";
import { LEGACY_ADVERTISING_AUDIENCES_SLUG, PRIMARY_AUDIENCES_SLUG, SUBPAGE_NAVIGATION_LOCKED, isPageNavigable, pagePath, routes } from "../routing";
import { PageFrame } from "./PageShell";
import { DEFAULT_WEBSITE_SECTION, WEBSITE_PORTAL_SLUG } from "./page-registry";

const onboardingPathByStep: Record<string, string> = {
  company_information: routes.onboarding.companyInformation,
  business_description: routes.onboarding.productsServices,
  products_services: routes.onboarding.productsServices,
  existing_platforms: routes.onboarding.productsServices,
  billing: routes.onboarding.billing,
  setup_complete: routes.app.dashboard,
};

const onboardingOrderByStep: Record<string, number> = {
  company_information: 1,
  business_description: 2,
  products_services: 2,
  existing_platforms: 2,
  billing: 3,
};

const onboardingOrderByPath: Record<string, number> = {
  [routes.onboarding.companyInformation]: 1,
  [routes.onboarding.productsServices]: 2,
  [routes.onboarding.billing]: 3,
};

export function PageRoute({ page }: { page: PageDefinition }) {
  const contract = getPageContract(page.slug);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const section = searchParams.get("section");
  const { currentUser, selectedWorkspace, loading, error: workspaceError } = useLuluApp();
  const isAuthPath = location.pathname === routes.auth.login
    || location.pathname === routes.auth.signUp
    || location.pathname.startsWith("/auth/");
  const isPublic = contract?.kind === "public" || isAuthPath;
  const isOnboarding = contract?.kind === "onboarding" || location.pathname.startsWith("/onboarding/");

  if (page.slug === LEGACY_ADVERTISING_AUDIENCES_SLUG) {
    return <Navigate replace to={pagePath(PRIMARY_AUDIENCES_SLUG)} state={{ from: location.pathname }} />;
  }

  if (page.slug === WEBSITE_PORTAL_SLUG && section === "settings-9019") {
    const params = new URLSearchParams(location.search);
    params.set("section", DEFAULT_WEBSITE_SECTION);
    return <Navigate replace to={{ pathname: routes.app.website, search: `?${params.toString()}` }} />;
  }

  if (SUBPAGE_NAVIGATION_LOCKED && page.slug === "lulu-email-portal-9013" && section) {
    searchParams.delete("section");
    const nextSearch = searchParams.toString();
    return <Navigate replace to={{ pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : "" }} />;
  }

  if (page.slug === WEBSITE_PORTAL_SLUG && !section && !SUBPAGE_NAVIGATION_LOCKED) {
    const params = new URLSearchParams(location.search);
    params.set("section", DEFAULT_WEBSITE_SECTION);
    return <Navigate replace to={{ pathname: routes.app.website, search: `?${params.toString()}` }} />;
  }

  if (location.pathname === "/onboarding/ai-preferences") {
    return <Navigate replace to={routes.onboarding.productsServices} state={{ from: location.pathname }} />;
  }

  if (!isPublic && loading) {
    return <main role="status" className="page-frame grid min-h-screen place-items-center">Loading your session…</main>;
  }

  if (!isPublic && !loading && !currentUser) {
    return <Navigate replace to={routes.auth.login} state={{ from: location.pathname }} />;
  }

  if (!isPublic && !isOnboarding && page.slug !== routes.app.dashboard.slice("/app/".length) && !isPageNavigable(page.slug)) {
    return <Navigate replace to={routes.app.dashboard} state={{ from: location.pathname }} />;
  }

  if (!isPublic && !isOnboarding && currentUser && !selectedWorkspace && !workspaceError) {
    return <Navigate replace to={routes.onboarding.companyInformation} state={{ from: location.pathname }} />;
  }

  const oauthReturn = (() => {
    const params = new URLSearchParams(location.search);
    return params.has("connected") || params.has("oauthCode") || params.has("oauthError");
  })();

  if (isOnboarding && selectedWorkspace && !selectedWorkspace.onboardingCompletedAt) {
    const target = onboardingPathByStep[selectedWorkspace.onboardingStep] ?? routes.onboarding.companyInformation;
    const currentOrder = onboardingOrderByStep[selectedWorkspace.onboardingStep] ?? 1;
    const requestedOrder = onboardingOrderByPath[location.pathname];
    // Completed steps stay editable. Only attempts to skip forward are sent
    // back to the next required step.
    if (requestedOrder === undefined || requestedOrder > currentOrder) {
      return <Navigate replace to={target} state={{ from: location.pathname }} />;
    }
  }

  if (!isPublic && !isOnboarding && !oauthReturn && currentUser && selectedWorkspace && !selectedWorkspace.onboardingCompletedAt) {
    const target = onboardingPathByStep[selectedWorkspace.onboardingStep] ?? routes.onboarding.companyInformation;
    if (location.pathname !== target) return <Navigate replace to={target} state={{ from: location.pathname }} />;
  }

  return <PageFrame page={page} isStandalone={isPublic || isOnboarding} />;
}
