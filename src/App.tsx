import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { pages, type PageDefinition } from "./pages-manifest";
import { GlobalLanguageSwitcher } from "./i18n/GlobalLanguageSwitcher";
import { LEGACY_SETUP_COMPLETE_PATH, isPageAvailable, pagePath, routes } from "./routing";
import { ApiError, getFriendlyErrorMessage, installApiBroker, requestApi } from "./api/client";
import {
  ADMIN_PANEL_PATH,
  clearPendingInvitation,
  isAdminUser,
  setPendingInvitation,
  setSelectedWorkspaceId,
} from "./api/session";
import { useLuluApp } from "./api/LuluAppContext";
import { BillingOnboarding } from "./components/BillingOnboarding";
import AdminBillingPage from "./pages/admin-billing-overview-9901/App";
import { Directory } from "./app/Directory";
import { PageRoute } from "./app/PageRoute";
import { availablePages } from "./app/page-registry";
const ADMIN_BILLING_PATH = ADMIN_PANEL_PATH;
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

function AdminOnlyAppRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useLuluApp();
  if (loading) return <main role="status" className="page-frame grid min-h-screen place-items-center">Loading your session…</main>;
  if (!currentUser) return <Navigate replace to={routes.auth.login} />;
  if (isAdminUser(currentUser)) return <Navigate replace to={ADMIN_PANEL_PATH} />;
  return <>{children}</>;
}

function HomeOrAdminRoute() {
  const { currentUser, loading } = useLuluApp();
  if (loading) return <main role="status" className="page-frame grid min-h-screen place-items-center">Loading your session…</main>;
  if (currentUser && isAdminUser(currentUser)) return <Navigate replace to={ADMIN_PANEL_PATH} />;
  return <Navigate replace to={routes.auth.login} />;
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
      {pages.map((page) => (
        isPageAvailable(page.slug) ? <Route key={page.id} path={pagePath(page.slug)} element={<AdminOnlyAppRoute><PageRoute page={page} /></AdminOnlyAppRoute>} /> : null
      ))}
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
