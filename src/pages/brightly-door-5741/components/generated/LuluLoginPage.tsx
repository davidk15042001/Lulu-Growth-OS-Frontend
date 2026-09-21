import { useState } from 'react';
import { Activity, ArrowRight, BarChart3, BriefcaseBusiness, Check, ChevronDown, Eye, EyeOff, Globe2, LoaderCircle, Network, ShieldCheck, Sparkles, Target, UsersRound } from 'lucide-react';
import { navigateApp, routes } from '../../../../routing';
import { ApiError, getFriendlyErrorMessage, getTechnicalErrorDetails, requestApi, type ApiRequest } from '../../../../api/client';
import { switchLanguage, useLanguage, useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';
import { getLanguage, isAvailableLanguageCode, languages } from '../../../../i18n/languages';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import {
  clearPendingInvitation,
  getAdminLandingPath,
  getPendingInvitation,
  isAdminUser,
  clearSelectedWorkspaceId,
  setPendingEmail,
  setStoredUser,
  setSelectedWorkspaceId,
} from '../../../../api/session';

async function requestWithTimeout<T>(request: ApiRequest, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await requestApi<T>({ ...request, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

const missionPillars = [
  {
    icon: Target,
    title: 'See the real company',
    text: 'Unify customer, financial, operating and knowledge signals into one company state.',
  },
  {
    icon: BarChart3,
    title: 'Decide from evidence',
    text: 'Executive cycles surface risks, forecasts, scenarios and plan proposals with their sources and assumptions.',
  },
  {
    icon: Sparkles,
    title: 'Move work forward',
    text: 'Specialized Digital Employees work through persisted tasks, domain services and auditable events.',
  },
] as const;

const operatingLayers = [
  {
    index: '01',
    icon: Activity,
    title: 'Executive loop',
    text: "Daily and weekly cycles turn the company's current state into accountable priorities, forecasts and proposed decisions.",
  },
  {
    index: '02',
    icon: Network,
    title: 'Shared company memory',
    text: 'Zep carries conversations, relevant context and organization knowledge across the work that follows.',
  },
  {
    index: '03',
    icon: UsersRound,
    title: 'Digital workforce',
    text: 'Digital Employees coordinate only through durable work, domain records and recorded outcomes.',
  },
  {
    index: '04',
    icon: BriefcaseBusiness,
    title: 'Controlled execution',
    text: 'Finance, CRM and provider actions follow permissions, policy, funding and compliance checks.',
  },
] as const;

const governancePillars = [
  {
    icon: ShieldCheck,
    title: 'Plan before impact',
    text: 'Executive proposals remain plans until an authorized decision turns them into action.',
  },
  {
    icon: BarChart3,
    title: 'Evidence before claims',
    text: 'Forecasts and recommendations expose their assumptions, sources and confidence.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Business truth before automation',
    text: 'Money, customer data and provider activity stay inside their canonical services and audit trail.',
  },
] as const;

export const LuluLoginPage = () => {
  const t = useTranslation();
  const language = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const currentLanguage = getLanguage(language);
  const [e, setE] = useState('');
  const [p, setP] = useState('');
  const [s, setS] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [adminMfaRequired, setAdminMfaRequired] = useState(false);
  const [adminMfaCode, setAdminMfaCode] = useState('');

  const reloadAuthenticatedRoute = (path: string) => {
    // The provider owns the authenticated session state. A full document
    // reload lets it restore the token and workspace before route guards run.
    window.location.replace(path);
  };

  const scrollToAccess = () => {
    document.getElementById('login-access')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submit = async (x: React.FormEvent) => {
    x.preventDefault();
    if (loading) return;
    if (!e.trim() || !p) {
      setError(t('missingCredentials'));
      return;
    }
    setLoading(true);
    setError('');
    setErrorDetails('');
    setStatusMessage(t('Checking your account…'));
    setS(false);
    try {
      const loginResponse = adminMfaRequired
        ? await requestWithTimeout<{ token: string; user: unknown }>({ path: '/auth/admin-mfa', method: 'POST', body: { email: e, code: adminMfaCode } })
        : await requestWithTimeout<{ token?: string; mfaRequired?: boolean; email?: string }>({ path: '/auth/login', method: 'POST', body: { email: e, password: p } });
      if (!adminMfaRequired && 'mfaRequired' in loginResponse.data && loginResponse.data.mfaRequired) {
        setAdminMfaRequired(true);
        setStatusMessage(t('Enter the six-digit code sent to your administrator email.'));
        setLoading(false);
        return;
      }
      setStatusMessage(t('Loading your profile…'));
      const meResp = await requestWithTimeout<{ id: string; email: string; firstName: string | null; lastName: string | null; role: string }>({ path: '/auth/me' });
      const currentUser = meResp.data;
      setStoredUser(currentUser);
      if (isAdminUser(currentUser)) {
        setS(true);
        setStatusMessage(t('Signed in as admin.'));
        reloadAuthenticatedRoute(getAdminLandingPath(routes.app.dashboard));
        return;
      }
      const pendingInvitation = getPendingInvitation();
      let invitedWorkspaceId: string | null = null;
      if (pendingInvitation) {
        setStatusMessage(t('Accepting your workspace invitation…'));
        const invitation = await requestWithTimeout<{ workspaceId: string }>({
          path: '/workspaces/invitations/' + encodeURIComponent(pendingInvitation) + '/accept',
          method: 'POST',
        });
        invitedWorkspaceId = invitation.data.workspaceId;
        clearPendingInvitation();
      }
      setStatusMessage(t('Loading your workspace…'));
      const workspaces = await requestWithTimeout<{ items: Array<{ id: string; onboardingStep: string; onboardingCompletedAt: string | null }> }>({ path: '/workspaces' });
      const workspace = workspaces.data.items.find(item => item.id === invitedWorkspaceId) ?? workspaces.data.items[0];
      setS(true);
      setStatusMessage(t('Signed in successfully.'));
      if (workspace) {
        setSelectedWorkspaceId(workspace.id);
        reloadAuthenticatedRoute(workspace.onboardingCompletedAt ? routes.app.dashboard
          : workspace.onboardingStep === 'company_information' ? routes.onboarding.companyInformation
            : workspace.onboardingStep === 'billing' ? routes.onboarding.billing
              : workspace.onboardingStep === 'profile_completion' ? routes.app.profile
                : routes.app.knowledgeBase);
      } else {
        clearSelectedWorkspaceId();
        reloadAuthenticatedRoute(routes.onboarding.companyInformation);
      }
    } catch (cause) {
      setStatusMessage('');
      if (cause instanceof DOMException && cause.name === 'AbortError') {
        setError(t('The login request timed out. Please try again.'));
        setErrorDetails(t('Code: API_TIMEOUT · The server did not respond within 15 seconds.'));
      } else if (cause instanceof ApiError && cause.code === 'ACCOUNT_UNVERIFIED') {
        setPendingEmail(e);
        navigateApp(routes.auth.signUp);
      } else if (cause instanceof ApiError && cause.code === 'ACCOUNT_NOT_FOUND') {
        setError(t('accountNotFound'));
      } else if (cause instanceof ApiError && cause.code === 'INVALID_CREDENTIALS') {
        setError(t('invalidCredentials'));
      } else if (cause instanceof ApiError && cause.code === 'API_TIMEOUT') {
        setError(t('timeout'));
      } else if (cause instanceof ApiError && cause.status >= 500) {
        setError(t('The login service is temporarily unavailable. Please try again shortly.'));
      } else {
        setError(getFriendlyErrorMessage(cause, t('We could not sign you in. Please try again.')));
      }
      if (!(cause instanceof DOMException && cause.name === 'AbortError')) setErrorDetails(getTechnicalErrorDetails(cause));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main data-deploy-rev="2026-09-21-executive-os-landing" className="auth-shell lulu-executive-landing">
      <header className="lulu-exec-nav">
        <a href="#top" className="lulu-exec-brand" aria-label="Lulu home" data-lulu-no-translate="true" translate="no">
          <img src="/branding/lulu-agentic-mark.svg" alt="" />
          <span>LULU</span>
          <small>EXECUTIVE OS</small>
        </a>
        <nav className="lulu-exec-nav-links" aria-label={t('Primary navigation')}>
          <a href="#operating-system">{t('The system')}</a>
          <a href="#governance">{t('Governance')}</a>
        </nav>
        <div className="lulu-exec-nav-actions">
          <div className="lulu-exec-language-wrap" data-lulu-no-translate="true" translate="no">
            <button type="button" onClick={() => setLangOpen((v) => !v)} aria-haspopup="menu" aria-expanded={langOpen} className="lulu-exec-language">
              <Globe2 size={14} />
              <span>{currentLanguage.shortCode}</span>
              <ChevronDown size={13} className={langOpen ? 'rotate-180' : ''} />
            </button>
            {langOpen && (
              <div role="menu" className="lulu-exec-language-menu">
                {languages.filter((option) => isAvailableLanguageCode(option.code)).map((option) => (
                  <button key={option.code} type="button" role="menuitemradio" aria-checked={option.code === language} onClick={() => { switchLanguage(option.code); setLangOpen(false); }}>
                    <span>{option.nativeName}</span>
                    {option.code === language && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button type="button" onClick={scrollToAccess} className="lulu-exec-nav-login">{t('Enter Lulu')}</button>
        </div>
      </header>

      <section id="top" className="lulu-exec-hero" aria-labelledby="lulu-exec-title">
        <img className="lulu-exec-hero-image" src="/landing/lulu-executive-constellation-v1.png" alt="" aria-hidden="true" />
        <div className="lulu-exec-hero-overlay" aria-hidden="true" />
        <div className="lulu-exec-hero-content">
          <p className="lulu-exec-eyebrow"><Activity size={14} /> {t('Autonomous company operating system')}</p>
          <h1 id="lulu-exec-title">{t('Lulu Executive OS')}</h1>
          <p className="lulu-exec-hero-statement">{t('A company that sees, decides and moves.')}</p>
          <p className="lulu-exec-hero-copy">{t('Lulu turns your verified business state into daily decisions, coordinated work and a memory that becomes more useful with every confirmed outcome.')}</p>
          <div className="lulu-exec-hero-actions">
            <button type="button" className="lulu-exec-primary-button" onClick={() => navigateApp(routes.auth.signUp)}>
              {t('Build your operating system')} <ArrowRight size={17} />
            </button>
            <button type="button" className="lulu-exec-secondary-button" onClick={scrollToAccess}>
              {t('Enter Lulu')} <ArrowRight size={17} />
            </button>
          </div>
          <div className="lulu-exec-hero-proof" aria-label={t('Lulu operating principles')}>
            <span>{t('Daily and weekly executive loops')}</span>
            <span>{t('One company memory, not scattered chats')}</span>
            <span>{t('Work through real records and controls')}</span>
          </div>
        </div>
        <a className="lulu-exec-scroll-cue" href="#mission">{t('The mission')} <ArrowRight size={15} /></a>
      </section>

      <section id="mission" className="lulu-exec-mission" aria-labelledby="lulu-mission-title">
        <div className="lulu-exec-section-intro">
          <p className="lulu-exec-kicker">{t('Mission')}</p>
          <h2 id="lulu-mission-title">{t("Build the world's most trusted autonomous company.")}</h2>
          <p>{t('Not another chat window. A company that can observe, reason, coordinate and improve with its people still in control.')}</p>
        </div>
        <div className="lulu-exec-mission-grid">
          {missionPillars.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className="lulu-exec-mission-pillar">
              <span className="lulu-exec-index">0{index + 1}</span>
              <Icon size={22} aria-hidden="true" />
              <h3>{t(title)}</h3>
              <p>{t(text)}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="operating-system" className="lulu-exec-system" aria-labelledby="lulu-system-title">
        <div className="lulu-exec-system-intro">
          <p className="lulu-exec-kicker">{t('The system')}</p>
          <h2 id="lulu-system-title">{t('One operational state. Every team.')}</h2>
          <p>{t('Lulu connects the context, decisions and work that usually disappear between tools, meetings and handoffs.')}</p>
        </div>
        <div className="lulu-exec-layer-grid">
          {operatingLayers.map(({ index, icon: Icon, title, text }) => (
            <article key={title} className="lulu-exec-layer">
              <div className="lulu-exec-layer-head">
                <span>{index}</span>
                <Icon size={20} aria-hidden="true" />
              </div>
              <h3>{t(title)}</h3>
              <p>{t(text)}</p>
            </article>
          ))}
        </div>
        <p className="lulu-exec-system-footnote"><ShieldCheck size={16} /> {t('Every meaningful step is grounded in a workspace, a record, a permission and an audit trail.')}</p>
      </section>

      <section id="governance" className="lulu-exec-governance" aria-labelledby="lulu-governance-title">
        <div className="lulu-exec-section-intro">
          <p className="lulu-exec-kicker">{t('Governance')}</p>
          <h2 id="lulu-governance-title">{t('Built for momentum. Governed for trust.')}</h2>
          <p>{t('The highest-leverage work moves quickly. The consequential work stays legible, attributable and under the right authority.')}</p>
        </div>
        <div className="lulu-exec-governance-grid">
          {governancePillars.map(({ icon: Icon, title, text }) => (
            <article key={title} className="lulu-exec-governance-pillar">
              <Icon size={20} aria-hidden="true" />
              <h3>{t(title)}</h3>
              <p>{t(text)}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="login-access" className="lulu-exec-access" aria-labelledby="lulu-access-title">
        <div className="lulu-exec-access-copy">
          <p className="lulu-exec-eyebrow"><ShieldCheck size={14} /> {t('Protected workspace access')}</p>
          <h2 id="lulu-access-title">{t('Enter the operating system.')}</h2>
          <p>{t('Your first step is secure. The work that follows is connected.')}</p>
          <button type="button" onClick={() => navigateApp(routes.auth.signUp)} className="lulu-exec-text-button">
            {t('Start with Lulu')} <ArrowRight size={16} />
          </button>
        </div>

        <form onSubmit={submit} className="lulu-exec-login-card" aria-label={t('Sign in form')}>
          <div className="lulu-exec-login-heading">
            <div>
              <p>{t('Access the system')}</p>
              <span>{t('Protected access')}</span>
            </div>
            <img src="/branding/lulu-agentic-mark.svg" alt="" aria-hidden="true" />
          </div>
          <div className="lulu-exec-fields">
            <Label htmlFor="login-email" className="lulu-exec-label">
              {t('email')}
              <Input id="login-email" name="email" autoComplete="email" value={e} onChange={x => setE(x.target.value)} type="email" placeholder={t('you@company.com')} className="lulu-exec-input" />
            </Label>
            <Label htmlFor="login-password" className="lulu-exec-label">
              {t('password')}
              <span className="lulu-exec-password-field">
                <Input id="login-password" name="password" autoComplete="current-password" value={p} onChange={x => setP(x.target.value)} type={show ? 'text' : 'password'} className="lulu-exec-input" />
                <button type="button" onClick={() => setShow(!show)} aria-label={show ? t('Hide password') : t('Show password')} className="lulu-exec-password-toggle">{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              </span>
            </Label>
            {adminMfaRequired ? (
              <Label htmlFor="login-admin-mfa" className="lulu-exec-label">
                {t('Administrator verification code')}
                <Input id="login-admin-mfa" name="adminMfaCode" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={adminMfaCode} onChange={event => setAdminMfaCode(event.target.value.replace(/\D/g, '').slice(0, 6))} className="lulu-exec-input lulu-exec-mfa-input" />
              </Label>
            ) : null}
            <Button type="submit" disabled={loading} className="lulu-exec-submit">
              {loading ? <><LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> {t('signingIn')}</> : <>{t(adminMfaRequired ? 'Verify administrator' : 'signIn')} <ArrowRight size={16} /></>}
            </Button>
            {adminMfaRequired ? <button type="button" onClick={() => { setAdminMfaRequired(false); setAdminMfaCode(''); setStatusMessage(''); setError(''); }} className="lulu-exec-back-button">{t('Back to password sign-in')}</button> : null}
            {statusMessage && <p role="status" className="lulu-exec-status">{statusMessage}</p>}
            {error && <div role="alert" className="lulu-exec-error"><p>{error}</p>{errorDetails && <p>{errorDetails}</p>}</div>}
            {s && <p className="lulu-exec-success"><Check size={15} /> {t('Signed in successfully.')}</p>}
          </div>
          <div className="lulu-exec-login-links">
            <button type="button" onClick={() => navigateApp(routes.auth.forgotPassword)}>{t('forgotPassword')}</button>
            <button type="button" onClick={() => navigateApp(routes.auth.signUp)}>{t('createAccount')}</button>
          </div>
        </form>
      </section>

      <footer className="lulu-exec-footer">
        <span data-lulu-no-translate="true" translate="no">© Lulu AI</span>
        <div>
          <a href="/privacy.html">{t('Privacy')}</a>
          <a href="/terms.html">{t('Terms')}</a>
        </div>
      </footer>
    </main>
  );
};
