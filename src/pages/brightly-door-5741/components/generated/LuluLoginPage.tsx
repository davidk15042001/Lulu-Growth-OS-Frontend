import { useState } from "react";
import { ArrowRight, Check, Eye, EyeOff, LoaderCircle, LockKeyhole, Network, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { navigateApp, routes } from "../../../../routing";
import { ApiError, requestApi, type ApiRequest } from "../../../../api/client";
import { switchLanguage, useLanguage, useTranslation } from "../../../../i18n/GlobalLanguageSwitcher";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  clearPendingInvitation,
  getAdminLandingPath,
  getPendingInvitation,
  isAdminUser,
  clearSelectedWorkspaceId,
  setPendingVerificationEmail,
  setStoredUser,
  setSelectedWorkspaceId,
} from "../../../../api/session";

async function requestWithTimeout<T>(request: ApiRequest, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await requestApi<T>({ ...request, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

const operatingLayers = [
  {
    icon: Network,
    title: "Connected workspace",
    text: "Website, CRM, commerce, finance and communications share one company memory.",
  },
  {
    icon: UsersRound,
    title: "Agent workforce",
    text: "Specialists plan, create, execute and verify work without fragmenting the operating state.",
  },
  {
    icon: ShieldCheck,
    title: "Guarded execution",
    text: "Money, provider actions and customer data stay inside permissions, funding and audit boundaries.",
  },
] as const;

const LEGAL_ENTITY_NAME = "Hong Kong Lulu Development Limited";

export const LuluLoginPage = () => {
  const t = useTranslation();
  const language = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const reloadAuthenticatedRoute = (path: string) => {
    // The provider owns the authenticated session state. A full document
    // reload lets it restore the token and workspace before route guards run.
    window.location.replace(path);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;
    if (!email.trim() || !password) {
      setError(t("missingCredentials"));
      return;
    }
    setLoading(true);
    setError("");
    setStatusMessage(t("Checking your account…"));
    setSignedIn(false);
    try {
      await requestWithTimeout<{ token?: string; user?: unknown }>({ path: "/auth/login", method: "POST", body: { email, password } });
      setStatusMessage(t("Loading your profile…"));
      const meResponse = await requestWithTimeout<{ id: string; email: string; firstName: string | null; lastName: string | null; role: string }>({ path: "/auth/me" });
      const currentUser = meResponse.data;
      setStoredUser(currentUser);
      if (isAdminUser(currentUser)) {
        setSignedIn(true);
        setStatusMessage(t("Signed in as admin."));
        reloadAuthenticatedRoute(getAdminLandingPath(routes.app.dashboard));
        return;
      }
      const pendingInvitation = getPendingInvitation();
      let invitedWorkspaceId: string | null = null;
      if (pendingInvitation) {
        setStatusMessage(t("Accepting your workspace invitation…"));
        const invitation = await requestWithTimeout<{ workspaceId: string }>({
          path: `/workspaces/invitations/${encodeURIComponent(pendingInvitation)}/accept`,
          method: "POST",
        });
        invitedWorkspaceId = invitation.data.workspaceId;
        clearPendingInvitation();
      }
      setStatusMessage(t("Loading your workspace…"));
      const workspaces = await requestWithTimeout<{ items: Array<{ id: string; onboardingStep: string; onboardingCompletedAt: string | null }> }>({ path: "/workspaces" });
      const workspace = workspaces.data.items.find((item) => item.id === invitedWorkspaceId) ?? workspaces.data.items[0];
      setSignedIn(true);
      setStatusMessage(t("Signed in successfully."));
      if (workspace) {
        setSelectedWorkspaceId(workspace.id);
        reloadAuthenticatedRoute(workspace.onboardingCompletedAt ? routes.app.dashboard
          : workspace.onboardingStep === "company_information" ? routes.onboarding.companyInformation
            : workspace.onboardingStep === "billing" ? routes.onboarding.billing
              : workspace.onboardingStep === "profile_completion" ? routes.app.profile
                : routes.app.knowledgeBase);
      } else {
        clearSelectedWorkspaceId();
        reloadAuthenticatedRoute(routes.onboarding.companyInformation);
      }
    } catch (cause) {
      setStatusMessage("");
      if (cause instanceof DOMException && cause.name === "AbortError") {
        setError(t("The login request timed out. Please try again."));
      } else if (cause instanceof ApiError && cause.code === "ACCOUNT_UNVERIFIED") {
        setPendingVerificationEmail(email);
        navigateApp(routes.auth.signUp);
      } else if (cause instanceof ApiError && cause.code === "ACCOUNT_NOT_FOUND") {
        setError(t("accountNotFound"));
      } else if (cause instanceof ApiError && cause.code === "INVALID_CREDENTIALS") {
        setError(t("invalidCredentials"));
      } else if (cause instanceof ApiError && cause.code === "API_TIMEOUT") {
        setError(t("timeout"));
      } else if (cause instanceof ApiError && cause.status >= 500) {
        setError(t("The login service is temporarily unavailable. Please try again shortly."));
      } else {
        setError(t("We could not sign you in. Please try again."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main data-deploy-rev="2026-10-04-lulu-entry-redesign" className="auth-shell lulu-entry">
      <header className="lulu-entry__nav">
        <a href="/" className="lulu-entry__brand" aria-label="Lulu home" data-lulu-no-translate="true" translate="no">
          <img src="/branding/lulu-agentic-mark.svg" alt="" />
          <span>LULU</span>
          <small>Growth OS</small>
        </a>
        <div className="lulu-entry__nav-actions">
          <div className="lulu-entry__language-switch" aria-label={t("Language")} data-lulu-no-translate="true" translate="no">
            <button type="button" onClick={() => switchLanguage("en")} aria-pressed={language === "en"} className={language === "en" ? "is-active" : ""}>EN</button>
            <button type="button" onClick={() => switchLanguage("de")} aria-pressed={language === "de"} className={language === "de" ? "is-active" : ""}>DE</button>
            <button type="button" onClick={() => switchLanguage("zh-CN")} aria-pressed={language === "zh-CN"} className={language === "zh-CN" ? "is-active" : ""}>中文</button>
          </div>
          <button type="button" onClick={() => navigateApp(routes.auth.signUp)} className="lulu-entry__signup">{t("Sign up for free")}</button>
        </div>
      </header>

      <section className="lulu-entry__stage" aria-labelledby="lulu-entry-title">
        <div className="lulu-entry__hero">
          <p className="lulu-entry__eyebrow" data-lulu-local-brand="true" data-lulu-no-translate="true" translate="no"><span />Lulu AI</p>
          <h1 id="lulu-entry-title">{t("Growth. Remastered.")}</h1>
          <p className="lulu-entry__lede">{t("A complete operating system for company memory, growth agents and guarded execution.")}</p>

          <div className="lulu-entry__proof-grid" aria-label={t("Lulu AI surfaces")}>
            {operatingLayers.map(({ icon: Icon, title, text }) => (
              <article key={title} className="lulu-entry__proof">
                <span><Icon size={17} aria-hidden="true" /></span>
                <div><strong>{t(title)}</strong><p>{t(text)}</p></div>
              </article>
            ))}
          </div>

          <div className="lulu-entry__signal-panel" aria-label={t("Company Brain")}>
            <div className="lulu-entry__signal-header"><span><Sparkles size={14} /> {t("Company Brain")}</span><small><i /> {t("Workspace-scoped")}</small></div>
            <div className="lulu-entry__signal-core"><span className="lulu-entry__signal-orbit lulu-entry__signal-orbit--outer" /><span className="lulu-entry__signal-orbit lulu-entry__signal-orbit--inner" /><Sparkles size={22} /></div>
            <div className="lulu-entry__signal-nodes"><span>{t("Connected data")}</span><span>{t("Autonomous work")}</span><span>{t("Guarded execution")}</span></div>
          </div>
        </div>

        <aside className="lulu-entry__access" aria-label={t("Sign in form")}>
          <form onSubmit={submit} className="lulu-entry__card">
            <div className="lulu-entry__card-heading">
              <div><p>{t("Sign in to Lulu")}</p><span><LockKeyhole size={13} aria-hidden="true" /> {t("Protected workspace")}</span></div>
              <img src="/branding/lulu-agentic-mark.svg" alt="" aria-hidden="true" />
            </div>
            <div className="lulu-entry__fields">
              <Label htmlFor="login-email" className="lulu-entry__label">
                {t("email")}
                <Input id="login-email" name="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder={t("you@company.com")} className="lulu-entry__input" />
              </Label>
              <Label htmlFor="login-password" className="lulu-entry__label">
                {t("password")}
                <span className="lulu-entry__password-field">
                  <Input id="login-password" name="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} className="lulu-entry__input" />
                  <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? t("Hide password") : t("Show password")} className="lulu-entry__password-toggle">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                </span>
              </Label>
              <Button type="submit" disabled={loading} className="lulu-entry__submit">
                {loading ? <><LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> {t("signingIn")}</> : <>{t("signIn")} <ArrowRight size={16} /></>}
              </Button>
              {statusMessage && <p role="status" className="lulu-entry__status">{statusMessage}</p>}
              {error && <div role="alert" className="lulu-entry__error"><p>{error}</p></div>}
              {signedIn && <p className="lulu-entry__success"><Check size={15} /> {t("Signed in successfully.")}</p>}
            </div>
            <div className="lulu-entry__card-links">
              <button type="button" onClick={() => navigateApp(routes.auth.forgotPassword)}>{t("forgotPassword")}</button>
              <button type="button" onClick={() => navigateApp(routes.auth.signUp)}>{t("Sign up for free")}</button>
            </div>
          </form>
          <p className="lulu-entry__access-note"><ShieldCheck size={15} /> {t("Every meaningful step is grounded in a workspace, a record, a permission and an audit trail.")}</p>
        </aside>
      </section>

      <footer className="lulu-entry__footer">
        <span data-lulu-no-translate="true" translate="no">© Lulu AI</span>
        <small>{LEGAL_ENTITY_NAME}</small>
        <div><a href="/privacy.html">{t("Privacy")}</a><a href="/terms.html">{t("Terms")}</a></div>
      </footer>
    </main>
  );
};
