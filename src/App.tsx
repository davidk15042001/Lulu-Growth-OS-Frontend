import { Suspense, lazy, useEffect, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { pages } from "./pages-manifest";
import { GlobalLanguageSwitcher, useTranslation } from "./i18n/GlobalLanguageSwitcher";
import { LEGACY_SETUP_COMPLETE_PATH, LULU_NAVIGATION_MESSAGE, isLuluNavigationMessage, isOfficePanelSurface, isPageAvailable, pagePath, routes } from "./routing";
import { ApiError, getFriendlyErrorMessage, installApiBroker, requestApi } from "./api/client";
import { authApi } from "./api/auth";
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
  setStoredUser,
} from "./api/session";
import { useLuluApp } from "./api/LuluAppContext";
import { BillingOnboarding } from "./components/BillingOnboarding";
import { Directory } from "./app/Directory";
import { PageRoute } from "./app/PageRoute";
import { availablePages } from "./app/page-registry";
import { PageErrorBoundary } from "./PageErrorBoundary";
import { WorkspaceSurfaceShell } from "./components/WorkspaceSurfaceShell";

const AdminBillingPage = lazy(() => import("./pages/admin-billing-overview-9901/App"));
const ProductsPage=lazy(()=>import("./pages/canonical-products/ProductsPage"));
const OrdersWorkspace=lazy(()=>import("./pages/canonical-commerce/OrdersWorkspace"));
const InventoryWorkspace=lazy(()=>import("./pages/canonical-commerce/InventoryWorkspace"));
const OmniChannelPage=lazy(()=>import("./pages/canonical-omnichannel/OmniChannelPage"));
const AdminOmniChannelPage=lazy(()=>import("./pages/admin-omnichannel/AdminOmniChannelPage"));
const CommercialDocumentsPage=lazy(()=>import("./pages/canonical-commercial/CommercialDocumentsPage"));
const AdminCommercialDocumentsPage=lazy(()=>import("./pages/admin-commercial/AdminCommercialDocumentsPage"));
const SupportPage=lazy(()=>import("./pages/support/SupportPage"));
const PublicCommercialDocumentPage=lazy(()=>import("./pages/public-commercial/PublicCommercialDocumentPage"));
const CrmWorkspacePage=lazy(()=>import("./pages/canonical-crm/CrmWorkspacePage"));
const WorkspaceRecordsPage=lazy(()=>import("./pages/canonical-records/WorkspaceRecordsPage"));
const ProfilePage=lazy(()=>import("./pages/canonical-profile/ProfilePage"));
const GrowthPage=lazy(()=>import("./pages/canonical-growth/GrowthPage"));
const FinancePage=lazy(()=>import("./pages/canonical-finance/FinanceTemplatesPage"));
const KnowledgePage=lazy(()=>import("./pages/canonical-knowledge/KnowledgePage"));
const CalendarMeetingPage=lazy(()=>import("./pages/calendar-meeting/CalendarMeetingPage"));
const EmailWorkspacePage=lazy(()=>import("./pages/lulu-email-portal-9013/App"));
const CalendarWorkspacePage=lazy(()=>import("./pages/lulu-calendar-portal-9014/App"));
const ManagedWebsitePage=lazy(()=>import("./pages/lulu-website-portal-9012/ManagedStorefrontApp"));
const VirtualOfficePage=lazy(()=>import("./pages/office/VirtualOfficePage"));
const SocialPublishingPage=lazy(()=>import("./pages/canonical-social/SocialPublishingPage"));
const ADMIN_BILLING_PATH = ADMIN_PANEL_PATH;
const FINANCE_RECORD_ROUTES = [
  ["cool-rain-6499", "finance_income", "Income"],
  ["richly-land-8084", "finance_transactions", "Transactions"],
  ["calm-tide-3752", "finance_payments", "Payments"],
  ["zesty-earth-3938", "finance_expenses", "Expenses"],
  ["bravely-bay-4544", "finance_customers", "Customers"],
  ["eager-minute-1586", "finance_vendors", "Vendors"],
  ["fair-bridge-8618", "finance_accounts", "Accounts"],
  ["soft-town-3284", "finance_cashflow", "Cash Flow"],
  ["wisely-gate-3183", "finance_budgets", "Budgets"],
  ["sharp-morning-7310", "finance_plans", "Financial Planning"],
  ["sparklingly-city-3338", "finance_reconciliations", "Reconciliation"],
  ["radiant-hour-5376", "finance_recurring_revenue", "Recurring Revenue"],
  ["lucky-park-8649", "finance_payouts", "Payouts"],
  ["vibrantly-second-9428", "finance_automations", "Financial Automation"],
  ["sturdy-week-3372", "finance_taxes", "Taxes"],
  ["boldly-field-4971", "finance_settings", "Finance Settings"],
] as const;

function AdminBillingRoute() {
  const { currentUser, loading } = useLuluApp();
  if (loading) return <main role="status" className="page-frame grid min-h-screen place-items-center">Loading your session…</main>;
  if (!currentUser) return <Navigate replace to={routes.auth.login} state={{ from: ADMIN_BILLING_PATH }} />;
  if (!isAdminUser(currentUser)) return <Navigate replace to="/not-found" />;
  return (
    <PageErrorBoundary pageName="admin-billing-overview-9901">
      <Suspense fallback={<main role="status" className="page-frame grid min-h-screen place-items-center">Loading admin panel…</main>}>
        <AdminBillingPage />
      </Suspense>
    </PageErrorBoundary>
  );
}

function activationTarget(step: string) {
  if (step === "company_information") return routes.onboarding.companyInformation;
  if (step === "billing") return routes.onboarding.billing;
  if (step === "profile_completion") return routes.app.profile;
  if (step === "knowledge_base") return routes.app.knowledgeBase;
  return routes.onboarding.companyInformation;
}

function AdminOnlyAppRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, selectedWorkspace, loading } = useLuluApp();
  const location = useLocation();
  const isPublicAuthPath = location.pathname === routes.auth.login || location.pathname.startsWith("/auth/");
  if (isPublicAuthPath) return <>{children}</>;
  if (loading) return <main role="status" className="page-frame grid min-h-screen place-items-center">Loading your session…</main>;
  if (!currentUser) return <Navigate replace to={routes.auth.login} />;
  if (isAdminUser(currentUser) && !prefersWorkspaceSurface(currentUser)) return <Navigate replace to={ADMIN_PANEL_PATH} />;
  if (selectedWorkspace && !selectedWorkspace.onboardingCompletedAt) {
    const target = activationTarget(selectedWorkspace.onboardingStep);
    const onRequiredPage = location.pathname === target
      || (selectedWorkspace.onboardingStep === "billing" && location.pathname === routes.onboarding.billings);
    if (!onRequiredPage) return <Navigate replace to={target} />;
  }
  return <>{children}</>;
}

function WebsitePreviewRoute() {
  const location = useLocation();
  const standalone = new URLSearchParams(location.search).get("standalone") === "1";
  if (standalone) return <ManagedWebsitePage initialPanel="preview" />;
  return (
    <WorkspaceSurfaceShell activeSlug="lulu-website-preview-9012">
      <ManagedWebsitePage initialPanel="preview" />
    </WorkspaceSurfaceShell>
  );
}

function AdminOmniChannelRoute({ children }: { children?: React.ReactNode }) {
  const { currentUser, loading } = useLuluApp();
  if (loading) return <main role="status" className="page-frame grid min-h-screen place-items-center">Loading your session…</main>;
  if (!currentUser) return <Navigate replace to={routes.auth.login} />;
  if (!isAdminUser(currentUser)) return <Navigate replace to="/not-found" />;
  return children ?? <AdminOmniChannelPage />;
}

function BillingRoute() {
  return (
    <AdminOnlyAppRoute>
      <BillingOnboarding />
      <GlobalLanguageSwitcher />
    </AdminOnlyAppRoute>
  );
}

function RemovedOnboardingRoute() {
  const { selectedWorkspace, loading } = useLuluApp();
  if (loading) return <main role="status" className="page-frame grid min-h-screen place-items-center">Loading your workspace…</main>;
  if (!selectedWorkspace) return <Navigate replace to={routes.onboarding.companyInformation} />;
  if (selectedWorkspace.onboardingCompletedAt) return <Navigate replace to={routes.app.dashboard} />;
  return <Navigate replace to={activationTarget(selectedWorkspace.onboardingStep)} />;
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

  const standaloneWebsitePreview = location.pathname === "/app/website-preview"
    && new URLSearchParams(location.search).get("standalone") === "1";
  if (loading || !isAdminUser(currentUser) || isOfficePanelSurface(location.search) || standaloneWebsitePreview) return null;
  if (location.pathname === routes.auth.login || location.pathname.startsWith("/auth/") || location.pathname.startsWith("/calendar/meeting/") || location.pathname === "/not-found") return null;

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

/**
 * An impersonated customer session intentionally is no longer an admin user,
 * so the regular admin/workspace switcher is hidden.  Keep a persistent,
 * reachable return control on that customer view; otherwise an administrator
 * can get stranded in the customer account until they clear the session.
 */
function AdminImpersonationSwitcher() {
  const { currentUser, refresh } = useLuluApp();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!currentUser?.impersonation?.active) return null;

  const returnToAdmin = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await authApi.stopImpersonation();
      setStoredUser(response.data.user);
      await refresh();
      setAdminSurface("admin");
      navigate(ADMIN_PANEL_PATH, { replace: true });
    } catch {
      setError("Returning to the admin panel failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <aside className="fixed bottom-4 right-4 z-[90] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_96%,transparent)] px-4 py-3 text-xs shadow-[0_16px_44px_rgba(0,0,0,0.16)] backdrop-blur-md">
      <div className="min-w-0">
        <p className="font-semibold text-[var(--foreground)]">Admin view active in user account</p>
        <p className="truncate text-[var(--muted-foreground)]">You are viewing this Workspace as a user.</p>
        {error && <p className="mt-1 text-[var(--destructive)]">{error}</p>}
      </div>
      <button type="button" disabled={busy} onClick={() => void returnToAdmin()} className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-2 font-medium text-[var(--foreground)] transition hover:bg-[var(--secondary)] disabled:cursor-wait disabled:opacity-60">
        {busy ? "Returning…" : "Return to Admin Panel"}
      </button>
    </aside>
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
  const t = useTranslation();
  const { currentUser } = useLuluApp();
  const location = useLocation();
  const navigate = useNavigate();
  const isPublicMeeting = location.pathname.startsWith("/calendar/meeting/");
  const officePanel = isOfficePanelSurface(location.search);
  const standaloneWebsitePreview = location.pathname === "/app/website-preview"
    && new URLSearchParams(location.search).get("standalone") === "1";

  useEffect(() => installApiBroker(), []);
  useEffect(() => {
    const onRouteEvent = (event: Event) => {
      const navigation = (event as CustomEvent<unknown>).detail;
      if (!isLuluNavigationMessage(navigation)) return;
      event.preventDefault();
      navigate(navigation.to, { replace: navigation.replace });
    };
    const onRouteMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || !isLuluNavigationMessage(event.data)) return;
      navigate(event.data.to, { replace: event.data.replace });
    };
    window.addEventListener(LULU_NAVIGATION_MESSAGE, onRouteEvent);
    window.addEventListener("message", onRouteMessage);
    return () => {
      window.removeEventListener(LULU_NAVIGATION_MESSAGE, onRouteEvent);
      window.removeEventListener("message", onRouteMessage);
    };
  }, [navigate]);

  return (
    <>
      <AdminImpersonationSwitcher />
      <AdminSurfaceSwitcher />
      <Suspense fallback={<main role="status" className="page-frame grid min-h-screen place-items-center">Loading Lulu AI…</main>}>
      <Routes>
        <Route path="/" element={<HomeOrAdminRoute />} />
        <Route path={routes.allPages} element={<AdminOmniChannelRoute><Directory /></AdminOmniChannelRoute>} />
        <Route path="/pages" element={<Navigate replace to={routes.allPages} />} />
        <Route path="/pages/:slug" element={<LegacyPageRedirect />} />
        <Route path="/auth/invitations/:token" element={<InvitationAccept />} />
        <Route path="/auth/login" element={<Navigate replace to={routes.auth.login} />} />
        <Route path="/register" element={<Navigate replace to={routes.auth.signUp} />} />
        <Route path={routes.onboarding.welcome} element={<AdminOnlyAppRoute><RemovedOnboardingRoute /></AdminOnlyAppRoute>} />
        <Route path={LEGACY_SETUP_COMPLETE_PATH} element={<AdminOnlyAppRoute><RemovedOnboardingRoute /></AdminOnlyAppRoute>} />
        <Route path={routes.onboarding.businessDescription} element={<AdminOnlyAppRoute><RemovedOnboardingRoute /></AdminOnlyAppRoute>} />
        <Route path={routes.onboarding.productsServices} element={<AdminOnlyAppRoute><RemovedOnboardingRoute /></AdminOnlyAppRoute>} />
        <Route path={routes.onboarding.existingPlatforms} element={<AdminOnlyAppRoute><RemovedOnboardingRoute /></AdminOnlyAppRoute>} />
        <Route path={routes.onboarding.billing} element={<BillingRoute />} />
        <Route path={routes.onboarding.billings} element={<BillingRoute />} />
        <Route path="/documents/commercial/:token" element={<PublicCommercialDocumentPage />} />
        <Route path="/calendar/meeting/:token" element={<CalendarMeetingPage />} />
        <Route path={ADMIN_BILLING_PATH} element={<AdminBillingRoute />} />
        <Route path="/admin/omnichannel" element={<AdminOmniChannelRoute />} />
        <Route path="/admin/support" element={<AdminOmniChannelRoute><SupportPage admin /></AdminOmniChannelRoute>} />
        <Route path="/app/support" element={<AdminOnlyAppRoute><SupportPage /></AdminOnlyAppRoute>} />
        <Route path="/app/profile" element={<AdminOnlyAppRoute><ProfilePage /></AdminOnlyAppRoute>} />
        <Route path="/admin/quotes" element={<AdminOmniChannelRoute><AdminCommercialDocumentsPage kind="quotes" /></AdminOmniChannelRoute>} />
        <Route path="/admin/invoices" element={<AdminOmniChannelRoute><AdminCommercialDocumentsPage kind="invoices" /></AdminOmniChannelRoute>} />
        <Route path="/app/dashboard" element={<AdminOnlyAppRoute><Navigate replace to={routes.app.dashboard} /></AdminOnlyAppRoute>} />
        <Route path={routes.app.office} element={<AdminOnlyAppRoute><VirtualOfficePage /></AdminOnlyAppRoute>} />
        <Route path={routes.app.email} element={<AdminOnlyAppRoute><WorkspaceSurfaceShell activeSlug="lulu-email-portal-9013"><EmailWorkspacePage /></WorkspaceSurfaceShell></AdminOnlyAppRoute>} />
        <Route path={routes.app.calendar} element={<AdminOnlyAppRoute><WorkspaceSurfaceShell activeSlug="lulu-calendar-portal-9014"><CalendarWorkspacePage /></WorkspaceSurfaceShell></AdminOnlyAppRoute>} />
        <Route path="/app/website" element={<AdminOnlyAppRoute><Navigate replace to="/app/website-editor" /></AdminOnlyAppRoute>} />
        <Route path="/app/online-presence" element={<AdminOnlyAppRoute><Navigate replace to="/app/website-editor" /></AdminOnlyAppRoute>} />
        <Route path="/app/website-editor" element={<AdminOnlyAppRoute><WorkspaceSurfaceShell activeSlug="lulu-website-editor-9012"><ManagedWebsitePage initialPanel="builder" /></WorkspaceSurfaceShell></AdminOnlyAppRoute>} />
        <Route path="/app/website-preview" element={<AdminOnlyAppRoute><WebsitePreviewRoute /></AdminOnlyAppRoute>} />
        <Route path="/app/website-media" element={<AdminOnlyAppRoute><WorkspaceSurfaceShell activeSlug="lulu-website-media-9017"><ManagedWebsitePage initialPanel="media" /></WorkspaceSurfaceShell></AdminOnlyAppRoute>} />
        <Route path="/app/website-domains" element={<AdminOnlyAppRoute><WorkspaceSurfaceShell activeSlug="lulu-website-domains-9018"><ManagedWebsitePage initialPanel="domains" /></WorkspaceSurfaceShell></AdminOnlyAppRoute>} />
        <Route path={routes.app.communications} element={<AdminOnlyAppRoute><Navigate replace to={routes.app.omnichannel} /></AdminOnlyAppRoute>} />
        <Route path={routes.app.growth} element={<AdminOnlyAppRoute><GrowthPage /></AdminOnlyAppRoute>} />
        <Route path={routes.app.finance} element={<AdminOnlyAppRoute><FinancePage /></AdminOnlyAppRoute>} />
        <Route path={routes.app.knowledgeBase} element={<AdminOnlyAppRoute><KnowledgePage /></AdminOnlyAppRoute>} />
        <Route path={routes.app.products} element={<AdminOnlyAppRoute><WorkspaceSurfaceShell activeSlug="nicely-ocean-1051"><ProductsPage /></WorkspaceSurfaceShell></AdminOnlyAppRoute>} />
        <Route path="/app/nicely-ocean-1051" element={<AdminOnlyAppRoute><WorkspaceSurfaceShell activeSlug="nicely-ocean-1051"><ProductsPage /></WorkspaceSurfaceShell></AdminOnlyAppRoute>} />
        <Route path={routes.app.orders} element={<AdminOnlyAppRoute><WorkspaceSurfaceShell activeSlug="mightily-shore-7108"><OrdersWorkspace /></WorkspaceSurfaceShell></AdminOnlyAppRoute>} />
        <Route path="/app/mightily-shore-7108" element={<AdminOnlyAppRoute><Navigate replace to={{ pathname: routes.app.orders, search: location.search }} /></AdminOnlyAppRoute>} />
        <Route path={routes.app.inventory} element={<AdminOnlyAppRoute><WorkspaceSurfaceShell activeSlug="smart-village-1099"><InventoryWorkspace /></WorkspaceSurfaceShell></AdminOnlyAppRoute>} />
        <Route path="/app/smart-village-1099" element={<AdminOnlyAppRoute><Navigate replace to={{ pathname: routes.app.inventory, search: location.search }} /></AdminOnlyAppRoute>} />
        <Route path={routes.app.omnichannel} element={<AdminOnlyAppRoute><OmniChannelPage /></AdminOnlyAppRoute>} />
        <Route path="/app/sturdy-month-1562" element={<AdminOnlyAppRoute><CrmWorkspacePage kind="companies" showEntitySwitcher={false} /></AdminOnlyAppRoute>} />
        <Route path="/app/kindly-pool-8785" element={<AdminOnlyAppRoute><Navigate replace to="/app/sturdy-month-1562" /></AdminOnlyAppRoute>} />
        <Route path="/app/cosmic-pool-1616" element={<AdminOnlyAppRoute><CrmWorkspacePage kind="activities" /></AdminOnlyAppRoute>} />
        <Route path="/app/deeply-noon-9539" element={<AdminOnlyAppRoute><CrmWorkspacePage kind="tasks" /></AdminOnlyAppRoute>} />
        <Route path="/app/breezy-soil-2475" element={<AdminOnlyAppRoute><CommercialDocumentsPage kind="invoices" /></AdminOnlyAppRoute>} />
        <Route path="/app/tender-creek-3139" element={<AdminOnlyAppRoute><CommercialDocumentsPage kind="quotes" /></AdminOnlyAppRoute>} />
        <Route path="/app/wondrous-cloud-1355" element={<AdminOnlyAppRoute><SocialPublishingPage /></AdminOnlyAppRoute>} />
        <Route path="/app/quietly-stone-4158" element={<AdminOnlyAppRoute><FinancePage /></AdminOnlyAppRoute>} />
        {FINANCE_RECORD_ROUTES.map(([slug, resourceType, title]) => <Route key={slug} path={`/app/${slug}`} element={<AdminOnlyAppRoute><WorkspaceRecordsPage activeSlug={slug} resourceType={resourceType} title={title} /></AdminOnlyAppRoute>} />)}
        <Route path={routes.app.quotesNew} element={<AdminOnlyAppRoute><CommercialDocumentsPage kind="quotes" create /></AdminOnlyAppRoute>} />
        <Route path={routes.app.quotes} element={<AdminOnlyAppRoute><CommercialDocumentsPage kind="quotes" /></AdminOnlyAppRoute>} />
        <Route path={routes.app.invoicesNew} element={<AdminOnlyAppRoute><CommercialDocumentsPage kind="invoices" create /></AdminOnlyAppRoute>} />
        <Route path={routes.app.invoices} element={<AdminOnlyAppRoute><CommercialDocumentsPage kind="invoices" /></AdminOnlyAppRoute>} />
        {pages.map((page) => {
          if (!isPageAvailable(page.slug)) return null;
          if (page.slug === "quiet-garden-9477") return null;
          if (page.slug === "keen-morning-6353") return null;
          if (page.slug === "nicely-ocean-1051") return null;
          if (page.slug === "mightily-shore-7108") return null;
          if (page.slug === "smart-village-1099") return null;
          if (page.slug === "nicely-land-1864") return null;
          if (page.slug === "rich-field-1880") return null;
          if (page.slug === "lulu-email-portal-9013") return null;
          if (page.slug === "lulu-calendar-portal-9014") return null;
          if (page.slug === "wondrous-cloud-1355") return null;
          const resolvedPath = pagePath(page.slug);
          const isAuthPage = resolvedPath === routes.auth.login
            || resolvedPath === routes.auth.signUp
            || resolvedPath === routes.auth.forgotPassword
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
      </Suspense>
    </>
  );
}
