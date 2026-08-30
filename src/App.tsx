import { useEffect, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { pages, type PageDefinition } from "./pages-manifest";
import { GlobalLanguageSwitcher } from "./i18n/GlobalLanguageSwitcher";
import { LEGACY_SETUP_COMPLETE_PATH, isPageAvailable, pagePath, routes } from "./routing";
import { ApiError, getFriendlyErrorMessage, installApiBroker, requestApi } from "./api/client";
import {
  ADMIN_PANEL_PATH,
  clearPendingInvitation,
  getAdminLandingPath,
  getAdminSurface,
  isAdminUser,
  prefersWorkspaceSurface,
  setPendingInvitation,
  setAdminSurface,
  setSelectedWorkspaceId,
} from "./api/session";
import { useLuluApp } from "./api/LuluAppContext";
import { BillingOnboarding } from "./components/BillingOnboarding";
import AdminBillingPage from "./pages/admin-billing-overview-9901/App";
import { Directory } from "./app/Directory";
import { PageRoute } from "./app/PageRoute";
import { availablePages } from "./app/page-registry";
import { PageErrorBoundary } from "./PageErrorBoundary";
const ADMIN_BILLING_PATH = ADMIN_PANEL_PATH;
const EMAIL_PAGE: PageDefinition = {
  id: "lulu-email-workspace",
  name: "Lulu AI — Email",
  slug: "lulu-email-portal-9013",
  generatedName: "lulu-email-portal-9013",
  selectedRevisionId: "local-email-workspace",
  previewImageUrl: null,
};
const CALENDAR_PAGE: PageDefinition = {
  id: "lulu-calendar-workspace",
  name: "Lulu AI — Calendar",
  slug: "lulu-calendar-portal-9014",
  generatedName: "lulu-calendar-portal-9014",
  selectedRevisionId: "local-calendar-workspace",
  previewImageUrl: null,
};

function AdminBillingRoute() {
  const { currentUser, loading } = useLuluApp();
  if (loading) return <main role="status" className="page-frame grid min-h-screen place-items-center">Loading your session…</main>;
  if (!currentUser) return <Navigate replace to={routes.auth.login} state={{ from: ADMIN_BILLING_PATH }} />;
  if (currentUser.role !== "admin" || currentUser.email.trim().toLowerCase() !== "lulu.ai.cn@gmail.com") return <Navigate replace to="/not-found" />;
  return (
    <PageErrorBoundary pageName="admin-billing-overview-9901">
      <AdminBillingPage />
    </PageErrorBoundary>
  );
}

function AdminOnlyAppRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useLuluApp();
  const location = useLocation();
  const isPublicAuthPath = location.pathname === routes.auth.login || location.pathname.startsWith("/auth/");
  if (isPublicAuthPath) return <>{children}</>;
  if (loading) return <main role="status" className="page-frame grid min-h-screen place-items-center">Loading your session…</main>;
  if (!currentUser) return <Navigate replace to={routes.auth.login} />;
  if (isAdminUser(currentUser) && !prefersWorkspaceSurface(currentUser)) return <Navigate replace to={ADMIN_PANEL_PATH} />;
  return <>{children}</>;
}

function PublicAuthRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useLuluApp();
  if (loading) return <main role="status" className="page-frame grid min-h-screen place-items-center">Loading your session…</main>;
  if (!currentUser) return <>{children}</>;
  return <Navigate replace to={isAdminUser(currentUser) ? getAdminLandingPath(routes.app.dashboard) : routes.app.dashboard} />;
}

function HomeOrAdminRoute() {
  const { currentUser, loading } = useLuluApp();
  if (loading) return <main role="status" className="page-frame grid min-h-screen place-items-center">Loading your session…</main>;
  if (currentUser && isAdminUser(currentUser)) return <Navigate replace to={getAdminLandingPath(routes.app.dashboard)} />;
  return <Navigate replace to={routes.auth.login} />;
}

function AdminSurfaceSwitcher() {
  const { currentUser, loading } = useLuluApp();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading || !isAdminUser(currentUser)) return null;
  if (location.pathname === routes.auth.login || location.pathname.startsWith("/auth/") || location.pathname === "/not-found") return null;

  const onAdminPanel = location.pathname === ADMIN_PANEL_PATH;
  const onWorkspaceApp = location.pathname.startsWith("/app/");
  const nextSurface = onAdminPanel ? "workspace" : "admin";
  const nextPath = onAdminPanel ? routes.app.dashboard : ADMIN_PANEL_PATH;
  const label = onAdminPanel ? "To Workspace Platform" : "To Admin Panel";
  const helper = onAdminPanel ? "Workspace Mode" : "Admin Mode";
  const className = onWorkspaceApp
    ? "fixed right-4 top-[78px] z-[70] inline-flex max-w-[calc(100vw-1.5rem)] items-center gap-2 rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_94%,transparent)] px-3 py-2 text-xs font-medium text-[var(--foreground)] shadow-[0_10px_26px_rgba(0,0,0,0.12)] backdrop-blur-sm transition hover:bg-[var(--secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:right-5 sm:top-[84px]"
    : "fixed right-4 top-4 z-[80] inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition hover:bg-[var(--secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

  return (
    <button
      type="button"
      onClick={() => {
        setAdminSurface(nextSurface);
        navigate(nextPath);
      }}
      className={className}
      aria-label={label}
      title={`${label} (${helper})`}
    >
      <ArrowLeftRight size={16} />
      <span>{label}</span>
    </button>
  );
}

function LegacyPageRedirect() {
  const { slug } = useParams();
  const page = availablePages.find((item) => item.slug === slug);
  return page ? <Navigate replace to={pagePath(page.slug)} /> : <Navigate replace to="/not-found" />;
}

function NotFound() {
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
  const [status, setStatus] = useState("Accepting your invitation...");

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
    <>
      <AdminSurfaceSwitcher />
      <Routes>
        <Route path="/" element={<HomeOrAdminRoute />} />
        <Route path={routes.allPages} element={<AdminOnlyAppRoute><Directory /></AdminOnlyAppRoute>} />
        <Route path="/pages" element={<Navigate replace to={routes.allPages} />} />
        <Route path="/pages/:slug" element={<LegacyPageRedirect />} />
        <Route path="/auth/invitations/:token" element={<InvitationAccept />} />
        <Route path="/auth/login" element={<Navigate replace to={routes.auth.login} />} />
        <Route path="/register" element={<Navigate replace to={routes.auth.signUp} />} />
        <Route path={routes.onboarding.welcome} element={<AdminOnlyAppRoute><Navigate replace to={routes.onboarding.companyInformation} /></AdminOnlyAppRoute>} />
        <Route path={LEGACY_SETUP_COMPLETE_PATH} element={<AdminOnlyAppRoute><Navigate replace to={routes.onboarding.billing} /></AdminOnlyAppRoute>} />
        <Route path={routes.onboarding.billing} element={<BillingOnboarding />} />
        <Route path={routes.onboarding.billings} element={<BillingOnboarding />} />
        <Route path={ADMIN_BILLING_PATH} element={<AdminBillingRoute />} />
        <Route path="/app/dashboard" element={<AdminOnlyAppRoute><Navigate replace to={routes.app.dashboard} /></AdminOnlyAppRoute>} />
        <Route path={routes.app.email} element={<AdminOnlyAppRoute><PageRoute page={EMAIL_PAGE} /></AdminOnlyAppRoute>} />
        <Route path={routes.app.calendar} element={<AdminOnlyAppRoute><PageRoute page={CALENDAR_PAGE} /></AdminOnlyAppRoute>} />
        {pages.map((page) => {
          if (!isPageAvailable(page.slug)) return null;
          const resolvedPath = pagePath(page.slug);
          const isAuthPage = resolvedPath === routes.auth.login
            || resolvedPath === routes.auth.signUp
            || resolvedPath === routes.auth.forgotPassword
            || resolvedPath === routes.auth.verificationEmail
            || resolvedPath === routes.auth.verifyEmail
            || resolvedPath === routes.auth.resetPassword
            || resolvedPath === routes.auth.sessionExpired
            || resolvedPath === routes.auth.signedOut;
          return <Route
            key={page.id}
            path={resolvedPath}
            element={isAuthPage ? <PublicAuthRoute><PageRoute page={page} /></PublicAuthRoute> : <AdminOnlyAppRoute><PageRoute page={page} /></AdminOnlyAppRoute>}
          />;
        })}
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
