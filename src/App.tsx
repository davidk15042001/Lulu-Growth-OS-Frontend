import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { pages, type PageDefinition } from "./pages-manifest";
import { LEGACY_SETUP_COMPLETE_PATH, pagePath, routes } from "./routing";
import { NativePage } from "./NativePage";
import { ApiError, getFriendlyErrorMessage, installApiBroker, requestApi } from "./api/client";
import {
  clearPendingInvitation,
  setPendingInvitation,
  setSelectedWorkspaceId,
} from "./api/session";
import { GlobalLanguageSwitcher } from "./i18n/GlobalLanguageSwitcher";
import { getPageContract } from "./api/page-contracts";
import { useLuluApp } from "./api/LuluAppContext";
import { BillingOnboarding } from "./components/BillingOnboarding";

function Directory() {
  const [query, setQuery] = useState("");
  const visiblePages = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return pages;
    return pages.filter((page) => `${page.name} ${page.generatedName}`.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <>
      <main className="directory">
        <header className="directory__header">
          <div>
            <p className="eyebrow">Lulu AI application routes</p>
            <h1>Lulu AI</h1>
            <p>All {pages.length} pages are connected to the application router.</p>
          </div>
          <label className="search">
            <Search aria-hidden="true" size={17} />
            <span className="sr-only">Search pages</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all pages" />
          </label>
        </header>
        <section className="page-grid" aria-label="All application routes">
          {visiblePages.map((page, index) => (
            <Link className="page-card" key={page.id} to={pagePath(page.slug)}>
              <span className="page-card__number">{String(index + 1).padStart(3, "0")}</span>
              <strong>{page.name}</strong>
              <span>{pagePath(page.slug)}</span>
            </Link>
          ))}
        </section>
      </main>
      <GlobalLanguageSwitcher />
    </>
  );
}

const onboardingPathByStep: Record<string, string> = {
  company_information: routes.onboarding.companyInformation,
  business_description: routes.onboarding.businessDescription,
  products_services: routes.onboarding.productsServices,
  existing_platforms: routes.onboarding.existingPlatforms,
  setup_complete: routes.onboarding.billing,
};

function PageRoute({ page }: { page: PageDefinition }) {
  const contract = getPageContract(page.slug);
  const location = useLocation();
  const { currentUser, selectedWorkspace, loading } = useLuluApp();
  const isPublic = contract?.kind === "public";
  const isOnboarding = contract?.kind === "onboarding";

  if (location.pathname === routes.onboarding.productsServices || location.pathname === "/onboarding/ai-preferences") {
    return <Navigate replace to={routes.onboarding.existingPlatforms} state={{ from: location.pathname }} />;
  }

  if (!isPublic && loading) {
    return <main role="status" className="page-frame grid min-h-screen place-items-center">Loading your session…</main>;
  }

  if (!isPublic && !loading && !currentUser) {
    return <Navigate replace to={routes.auth.login} state={{ from: location.pathname }} />;
  }

  if (!isPublic && !isOnboarding && currentUser && !selectedWorkspace) {
    return <Navigate replace to={routes.onboarding.welcome} state={{ from: location.pathname }} />;
  }

  if (!isPublic && !isOnboarding && currentUser && selectedWorkspace && !selectedWorkspace.onboardingCompletedAt) {
    const target = onboardingPathByStep[selectedWorkspace.onboardingStep] ?? routes.onboarding.companyInformation;
    if (location.pathname !== target) return <Navigate replace to={target} state={{ from: location.pathname }} />;
  }

  if (!isPublic && !isOnboarding && currentUser && selectedWorkspace && selectedWorkspace.onboardingCompletedAt) {
    const selectedPlan = window.localStorage.getItem(`lulu:selected-plan:${selectedWorkspace.id}`);
    const validPlan = selectedPlan === "explorer" || selectedPlan === "starter" || selectedPlan === "ai";
    if (!validPlan && location.pathname !== routes.onboarding.billing) return <Navigate replace to={routes.onboarding.billing} state={{ from: location.pathname }} />;
  }

  return <PageFrame page={page} />;
}

function PageFrame({ page }: { page: PageDefinition }) {
  useEffect(() => {
    document.title = page.name;
  }, [page]);
  const isAuthPage = pagePath(page.slug).startsWith("/auth/");
  return (
    <main
      className={`page-frame${isAuthPage ? " page-frame--auth" : ""}`}
      style={isAuthPage ? { height: "auto", minHeight: "100vh", overflow: "visible" } : undefined}
    >
      <NativePage slug={page.slug} />
    </main>
  );
}
function LegacyPageRedirect() {
  const { slug } = useParams();
  const page = pages.find((item) => item.slug === slug);
  return page ? <Navigate replace to={pagePath(page.slug)} /> : <Navigate replace to="/not-found" />;
}function NotFound() {
  return (
    <>
      <main className="not-found">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The requested Lulu AI route does not exist.</p>
        <Link to={routes.auth.login}>Return to login</Link>
      </main>
      <GlobalLanguageSwitcher />
    </>
  );
}

function InvitationAccept() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Accepting your invitationâ€¦");

  useEffect(() => {
    if (!token) {
      navigate("/not-found", { replace: true });
      return;
    }
    let active = true;
    requestApi<{ workspaceId: string }>({ path: `/workspaces/invitations/${encodeURIComponent(token)}/accept`, method: "POST" })
      .then((response) => {
        if (!active) return;
        setSelectedWorkspaceId(response.data.workspaceId);
        clearPendingInvitation();
        navigate(routes.app.dashboard, { replace: true });
      })
      .catch((error) => {
        if (!active) return;
        if (error instanceof ApiError && error.status === 401) {
          setPendingInvitation(token);
          navigate(routes.auth.login, { replace: true });
          return;
        }
        setStatus(getFriendlyErrorMessage(error, "We could not accept this invitation. Please ask the sender for a new link."));
      });
    return () => { active = false; };
  }, [navigate, token]);

  return <>
    <main className="not-found">
      <p className="eyebrow">Workspace invitation</p>
      <h1>Joining Lulu AI</h1>
      <p>{status}</p>
    </main>
    <GlobalLanguageSwitcher />
  </>;
}

export default function App() {
  useEffect(() => installApiBroker(), []);

  return (
    <Routes>
      <Route path="/" element={<Navigate replace to={routes.auth.login} />} />
      <Route path={routes.allPages} element={<Directory />} />
      <Route path="/pages" element={<Navigate replace to={routes.allPages} />} />
      <Route path="/pages/:slug" element={<LegacyPageRedirect />} />
      <Route path="/auth/invitations/:token" element={<InvitationAccept />} />
      <Route path={LEGACY_SETUP_COMPLETE_PATH} element={<Navigate replace to={routes.onboarding.billing} />} />
      <Route path={routes.onboarding.billing} element={<BillingOnboarding />} />
      <Route path={routes.onboarding.billings} element={<BillingOnboarding />} />
      {pages.map((page) => (
        <Route key={page.id} path={pagePath(page.slug)} element={<PageRoute page={page} />} />
      ))}
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}