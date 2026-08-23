import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { pages, type PageDefinition } from "./pages-manifest";
import { isPageAvailable, LEGACY_SETUP_COMPLETE_PATH, pagePath, routes } from "./routing";
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
import { conversationApi } from "./api/conversations";
import { usageApi, type WorkspaceCredits } from "./api/usage";
import { LuluWorkspaceRefreshButton } from "./components/LuluWorkspaceTopBar";
import { BillingOnboarding } from "./components/BillingOnboarding";
import AdminBillingPage from "./pages/admin-billing-overview-9901/App";

const WEBSITE_PORTAL_SLUG = "lulu-website-portal-9012";
const DEFAULT_WEBSITE_SECTION = "wordpress-jetpack-9013";
const availablePages = pages.filter((page) => isPageAvailable(page.slug) && page.slug !== WEBSITE_PORTAL_SLUG);

function Directory() {
  const [query, setQuery] = useState("");
  const visiblePages = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return availablePages;
    return availablePages.filter((page) => `${page.name} ${page.generatedName}`.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <>
      <main className="directory">
        <header className="directory__header">
          <div>
            <p className="eyebrow">Lulu AI application routes</p>
            <h1>Lulu AI</h1>
            <p>All {availablePages.length} pages are connected to the application router.</p>
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
  billing: routes.onboarding.billing,
  setup_complete: routes.onboarding.billing,
};

function PageRoute({ page }: { page: PageDefinition }) {
  const contract = getPageContract(page.slug);
  const location = useLocation();
  const { currentUser, selectedWorkspace, loading, error: workspaceError, refresh } = useLuluApp();
  const isAuthPath = location.pathname === routes.auth.login || location.pathname === routes.auth.signUp || location.pathname.startsWith("/auth/");
  const isPublic = contract?.kind === "public" || isAuthPath;
  const isOnboarding = contract?.kind === "onboarding";

  if (page.slug === WEBSITE_PORTAL_SLUG && !new URLSearchParams(location.search).get("section")) {
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

  if (!isPublic && !isOnboarding && currentUser && !selectedWorkspace) {
    if (workspaceError) return <main role="alert" className="page-frame grid min-h-screen place-items-center p-6"><div className="max-w-md rounded-2xl border border-border bg-card p-6 text-center"><h1 className="text-lg font-semibold">Workspace konnte nicht geladen werden</h1><p className="mt-2 text-sm text-muted-foreground">Deine Anmeldung ist noch vorhanden. Die Workspace-Daten konnten gerade nicht geladen werden.</p><button type="button" onClick={() => void refresh()} className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Erneut versuchen</button></div></main>;
    return <Navigate replace to={routes.onboarding.welcome} state={{ from: location.pathname }} />;
  }

  const oauthReturn = (() => {
    const params = new URLSearchParams(location.search);
    return params.has("connected") || params.has("oauthCode") || params.has("oauthError");
  })();

  if (!isPublic && !isOnboarding && !oauthReturn && currentUser && selectedWorkspace && !selectedWorkspace.onboardingCompletedAt) {
    const target = onboardingPathByStep[selectedWorkspace.onboardingStep] ?? routes.onboarding.companyInformation;
    if (location.pathname !== target) return <Navigate replace to={target} state={{ from: location.pathname }} />;
  }


  return <PageFrame page={page} isPublic={isPublic} isStandalone={isPublic || isOnboarding} />;
}

function AuthenticatedSearchBar() {
  const navigate = useNavigate();
  const { currentUser, selectedWorkspace } = useLuluApp();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [credits, setCredits] = useState<WorkspaceCredits | null>(null);
  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return availablePages.filter((item) => `${item.name} ${item.generatedName}`.toLowerCase().includes(normalized)).slice(0, 6);
  }, [query]);
  useEffect(() => {
    let cancelled = false;
    if (!selectedWorkspace) {
      setCredits(null);
      return () => { cancelled = true; };
    }
    usageApi.credits(selectedWorkspace.id)
      .then((response) => { if (!cancelled) setCredits(response.data); })
      .catch(() => { if (!cancelled) setCredits(null); });
    return () => { cancelled = true; };
  }, [selectedWorkspace]);
  if (!currentUser || !selectedWorkspace) return null;
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = query.trim();
    if (!text || busy) return;
    const target = matches[0];
    if (target) { navigate(pagePath(target.slug)); setQuery(""); setAnswer(null); setOpen(false); return; }
    setBusy(true); setOpen(true); setAnswer(null);
    try {
      const conversation = await conversationApi.create(selectedWorkspace.id, text.slice(0, 120));
      const response = await conversationApi.respond(selectedWorkspace.id, conversation.data.id, text);
      setAnswer(response.data.assistantMessage.content);
    } catch {
      setAnswer("Die Anfrage konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.");
    } finally { setBusy(false); }
  };
  return <div className="lulu-auth-search-wrap" data-lulu-auth-search="true">
    <div className="lulu-auth-logo" data-lulu-no-translate="true" translate="no"><img src="/branding/lulu-intelligence-logo.png" alt="Lulu AI" draggable={false} /></div>
    <form className="lulu-auth-search" role="search" onSubmit={submit}>
      <label className="sr-only" htmlFor="lulu-global-search">Search Lulu AI</label>
      <input id="lulu-global-search" value={query} onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} placeholder="Search Lulu AI" autoComplete="off" />
      <button type="submit" aria-label="Search" title="Search" className="lulu-auth-search-button"><Search aria-hidden="true" size={17} /></button>
      <LuluWorkspaceRefreshButton />
    </form>
    {credits && <div className="lulu-auth-credits" title="Credits" aria-label="Credits">
      <span className="lulu-auth-credits-label">Credits</span>
      <strong>{credits.creditsUsed.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
    </div>}
    {open && query.trim() && <div className="lulu-auth-search-results">{matches.length ? matches.map((item) => <button type="button" key={item.id} onClick={() => { navigate(pagePath(item.slug)); setQuery(""); setAnswer(null); setOpen(false); }}><strong>{item.name}</strong></button>) : busy ? <p>Working on your Lulu AI request…</p> : answer ? <p className="lulu-auth-search-answer">{answer}</p> : <p>Ask Lulu AI about your workspace or type a page name.</p>}</div>}
  </div>;
}

function PageFrame({ page, isPublic, isStandalone }: { page: PageDefinition; isPublic: boolean; isStandalone: boolean }) {
  useEffect(() => {
    document.title = page.name;
  }, [page]);
  const isAuthPage = isStandalone;
  return (
    <>
      {!isStandalone && <AuthenticatedSearchBar />}
      <main
        className={`page-frame${isAuthPage ? " page-frame--auth" : ""}`}
        style={isAuthPage ? { height: "auto", minHeight: "100vh", overflow: "visible" } : undefined}
      >
        <NativePage slug={page.slug} />
      </main>
    </>
  );
}
const ADMIN_BILLING_PATH = "/app/admin-billing-overview-9901";
const EMAIL_PAGE: PageDefinition = {
  id: "lulu-email-workspace",
  name: "Lulu AI — Email",
  slug: "lulu-email-portal-9013",
  generatedName: "lulu-email-portal-9013",
  selectedRevisionId: "local-email-workspace",
  previewImageUrl: null,
};

function AdminBillingRoute() {
  const { currentUser, loading } = useLuluApp();
  if (loading) return <main role="status" className="page-frame grid min-h-screen place-items-center">Loading your session…</main>;
  if (!currentUser) return <Navigate replace to={routes.auth.login} state={{ from: ADMIN_BILLING_PATH }} />;
  if (currentUser.role !== "admin" || currentUser.email.trim().toLowerCase() !== "lulu.ai.cn@gmail.com") return <Navigate replace to="/not-found" />;
  return <AdminBillingPage />;
}

function LegacyPageRedirect() {
  const { slug } = useParams();
  const page = availablePages.find((item) => item.slug === slug);
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
      <Route path="/auth/login" element={<Navigate replace to={routes.auth.login} />} />
      <Route path="/register" element={<Navigate replace to={routes.auth.signUp} />} />
      <Route path={LEGACY_SETUP_COMPLETE_PATH} element={<Navigate replace to={routes.onboarding.billing} />} />
      <Route path={routes.onboarding.billing} element={<BillingOnboarding />} />
      <Route path={routes.onboarding.billings} element={<BillingOnboarding />} />
      <Route path={ADMIN_BILLING_PATH} element={<AdminBillingRoute />} />
      <Route path="/app/dashboard" element={<Navigate replace to={routes.app.dashboard} />} />
      <Route path={routes.app.email} element={<PageRoute page={EMAIL_PAGE} />} />
      {pages.map((page) => (
        isPageAvailable(page.slug) ? <Route key={page.id} path={pagePath(page.slug)} element={<PageRoute page={page} />} /> : null
      ))}
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
