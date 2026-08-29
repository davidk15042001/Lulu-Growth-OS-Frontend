import { Navigate, useLocation } from "react-router-dom";
import type { PageDefinition } from "../pages-manifest";
import { getPageContract } from "../api/page-contracts";
import { useLuluApp } from "../api/LuluAppContext";
import { SUBPAGE_NAVIGATION_LOCKED, isPageNavigable, routes } from "../routing";
import { PageFrame } from "./PageShell";
import { DEFAULT_WEBSITE_SECTION, WEBSITE_PORTAL_SLUG } from "./page-registry";

const onboardingPathByStep: Record<string, string> = {
  company_information: routes.onboarding.companyInformation,
  business_description: routes.onboarding.businessDescription,
  products_services: routes.onboarding.productsServices,
  existing_platforms: routes.onboarding.existingPlatforms,
  billing: routes.onboarding.billing,
  setup_complete: routes.onboarding.billing,
};

export function PageRoute({ page }: { page: PageDefinition }) {
  const contract = getPageContract(page.slug);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const section = searchParams.get("section");
  const { currentUser, selectedWorkspace, loading, error: workspaceError, refresh } = useLuluApp();
  const isAuthPath = location.pathname === routes.auth.login
    || location.pathname === routes.auth.signUp
    || location.pathname.startsWith("/auth/");
  const isPublic = contract?.kind === "public" || isAuthPath;
  const isOnboarding = contract?.kind === "onboarding";

  if (SUBPAGE_NAVIGATION_LOCKED && (page.slug === "lulu-email-portal-9013" || page.slug === "lulu-calendar-portal-9014") && section) {
    searchParams.delete("section");
    const nextSearch = searchParams.toString();
    return <Navigate replace to={{ pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : "" }} />;
  }

  if (page.slug === WEBSITE_PORTAL_SLUG && !section && !SUBPAGE_NAVIGATION_LOCKED) {
    const params = new URLSearchParams(location.search);
    params.set("section", DEFAULT_WEBSITE_SECTION);
    return <Navigate replace to={{ pathname: routes.app.website, search: `?${params.toString()}` }} />;
  }

  if (location.pathname === routes.onboarding.productsServices || location.pathname === "/onboarding/ai-preferences") {
    return <Navigate replace to={routes.onboarding.existingPlatforms} state={{ from: location.pathname }} />;
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

  if (!isPublic && !isOnboarding && currentUser && !selectedWorkspace) {
    if (workspaceError) {
      return (
        <main role="alert" className="page-frame grid min-h-screen place-items-center p-6">
          <div className="max-w-md rounded-2xl border border-border bg-card p-6 text-center">
            <h1 className="text-lg font-semibold">Workspace konnte nicht geladen werden</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Deine Anmeldung ist noch vorhanden. Die Workspace-Daten konnten gerade nicht geladen werden.
            </p>
            <button
              type="button"
              onClick={() => void refresh()}
              className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Erneut versuchen
            </button>
          </div>
        </main>
      );
    }
    return <Navigate replace to={routes.onboarding.companyInformation} state={{ from: location.pathname }} />;
  }

  const oauthReturn = (() => {
    const params = new URLSearchParams(location.search);
    return params.has("connected") || params.has("oauthCode") || params.has("oauthError");
  })();

  if (
    isOnboarding
    && selectedWorkspace?.onboardingFileReuploadRequired
    && location.pathname !== routes.onboarding.businessDescription
  ) {
    return <Navigate replace to={routes.onboarding.businessDescription} state={{ from: location.pathname }} />;
  }

  if (!isPublic && !isOnboarding && !oauthReturn && currentUser && selectedWorkspace && !selectedWorkspace.onboardingCompletedAt) {
    const target = onboardingPathByStep[selectedWorkspace.onboardingStep] ?? routes.onboarding.companyInformation;
    if (location.pathname !== target) return <Navigate replace to={target} state={{ from: location.pathname }} />;
  }

  return <PageFrame page={page} isStandalone={isPublic || isOnboarding} />;
}
