import { useEffect, useState } from 'react';
import { ArrowRight, BarChart3, Check, Eye, EyeOff, LoaderCircle, LockKeyhole, Network, ShieldCheck, Sparkles, Target, UsersRound } from 'lucide-react';
import { navigateApp, routes } from '../../../../routing';
import { ApiError, getFriendlyErrorMessage, getTechnicalErrorDetails, requestApi, type ApiRequest } from '../../../../api/client';
import { switchLanguage, useLanguage, useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';
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
    title: 'One company memory.',
    text: 'Website, CRM, commerce, finance and conversations come together as one operating context.',
  },
  {
    icon: BarChart3,
    title: 'Signals become work.',
    text: 'Lulu reads the next commercial signal and turns it into a page, campaign, record or action.',
  },
  {
    icon: Sparkles,
    title: 'Agents move together.',
    text: 'Specialists plan, execute and verify outcomes without losing the audit trail.',
  },
] as const;

const operatingLayers = [
  {
    icon: Network,
    title: 'Connected workspace',
    text: 'Website, CRM, commerce, finance and communications share one company memory.',
  },
  {
    icon: UsersRound,
    title: 'Agent workforce',
    text: 'Specialists plan, create, execute and verify work without fragmenting the operating state.',
  },
  {
    icon: ShieldCheck,
    title: 'Guarded execution',
    text: 'Money, provider actions and customer data stay inside permissions, funding and audit boundaries.',
  },
] as const;

const promptSuggestions = [
  'Company memory',
  'Growth agents',
  'Guarded execution',
] as const;

const productColorways = [
  { name: 'Midnight', label: 'Operations', text: 'Keep every workspace action connected to the company record.' },
  { name: 'Starlight', label: 'Knowledge', text: 'Turn policies, files and context into usable operating memory.' },
  { name: 'Blue', label: 'Signals', text: 'Read revenue, search, customer and channel data in one place.' },
  { name: 'Violet', label: 'Agents', text: 'Assemble the smallest team needed for the strongest outcome.' },
  { name: 'Coral', label: 'Growth', text: 'Publish pages, campaigns and experiments with evidence attached.' },
] as const;

export const LuluLoginPage = () => {
  const t = useTranslation();
  const language = useLanguage();
  const isLandingLanguage = language === 'en' || language === 'zh-CN';
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
  const [userMfaRequired, setUserMfaRequired] = useState(false);
  const [userMfaChallengeId, setUserMfaChallengeId] = useState('');
  const [userMfaCode, setUserMfaCode] = useState('');

  useEffect(() => {
    if (!isLandingLanguage) switchLanguage('en');
  }, [isLandingLanguage]);

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
        : userMfaRequired
          ? await requestWithTimeout<{ token: string; user: unknown }>({ path: '/auth/mfa/verify', method: 'POST', body: { challengeId: userMfaChallengeId, code: userMfaCode } })
          : await requestWithTimeout<{ token?: string; mfaRequired?: boolean; email?: string; challengeId?: string; method?: string }>({ path: '/auth/login', method: 'POST', body: { email: e, password: p } });
      if (!adminMfaRequired && !userMfaRequired && 'mfaRequired' in loginResponse.data && loginResponse.data.mfaRequired) {
        if (loginResponse.data.method === 'totp' && loginResponse.data.challengeId) {
          setUserMfaRequired(true);
          setUserMfaChallengeId(loginResponse.data.challengeId);
          setStatusMessage(t('Enter your authenticator code or a recovery code.'));
        } else {
          setAdminMfaRequired(true);
          setStatusMessage(t('Enter the six-digit code sent to your administrator email.'));
        }
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

  if (!isLandingLanguage) return <main className="auth-shell lulu-executive-landing" aria-busy="true" />;

  return (
    <main data-deploy-rev="2026-09-22-airpods-inspired-lulu-login" className="auth-shell lulu-executive-landing">
      <header className="lulu-exec-nav">
        <a href="#top" className="lulu-exec-brand" aria-label="Lulu home" data-lulu-no-translate="true" translate="no">
          <img src="/branding/lulu-agentic-mark.svg" alt="" />
          <span>LULU</span>
          <small>Growth OS</small>
        </a>
        <nav className="lulu-exec-nav-links" aria-label={t('Primary navigation')}>
          <a href="#mission">{t('Capabilities')}</a>
          <a href="#operating-system">{t('How it works')}</a>
        </nav>
        <div className="lulu-exec-nav-actions">
          <div className="lulu-exec-language-switch" data-lulu-no-translate="true" translate="no">
            <button type="button" onClick={() => switchLanguage('en')} aria-pressed={language === 'en'} className={language === 'en' ? 'is-active' : ''}>EN</button>
            <button type="button" onClick={() => switchLanguage('zh-CN')} aria-pressed={language === 'zh-CN'} className={language === 'zh-CN' ? 'is-active' : ''}>中文</button>
          </div>
          <button type="button" onClick={() => navigateApp(routes.auth.signUp)} className="lulu-exec-nav-login">{t('Sign up for free')}</button>
        </div>
      </header>

      <section id="top" className="lulu-exec-hero" aria-labelledby="lulu-exec-title">
        <div className="lulu-exec-hero-overlay" aria-hidden="true" />
        <div className="lulu-exec-hero-content">
          <p className="lulu-exec-product-name" data-lulu-no-translate="true" translate="no">Lulu AI</p>
          <h1 id="lulu-exec-title">{t('Growth. Remastered.')}</h1>
          <p className="lulu-exec-hero-copy">{t('A complete operating system for company memory, growth agents and guarded execution.')}</p>
          <picture>
            <source
              type="image/webp"
              srcSet="/landing/lulu-growth-os-product-lineup-v1-900.webp 900w, /landing/lulu-growth-os-product-lineup-v1-1400.webp 1400w"
              sizes="(max-width: 560px) 112vw, min(1160px, 116vw)"
            />
            <img
              className="lulu-exec-hero-image"
              src="/landing/lulu-growth-os-product-lineup-v1.png"
              alt={t('Lulu AI product lineup')}
              decoding="async"
              loading="eager"
            />
          </picture>

          <form onSubmit={submit} className="lulu-exec-login-card" aria-label={t('Sign in form')}>
            <div className="lulu-exec-login-heading">
              <div>
                <p>{t('Sign in to Lulu')}</p>
                <span><LockKeyhole size={13} aria-hidden="true" /> {t('Protected workspace')}</span>
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
              {userMfaRequired ? (
                <Label htmlFor="login-user-mfa" className="lulu-exec-label">
                  {t('Authenticator or recovery code')}
                  <Input id="login-user-mfa" name="userMfaCode" inputMode="text" autoComplete="one-time-code" maxLength={20} value={userMfaCode} onChange={event => setUserMfaCode(event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20))} className="lulu-exec-input lulu-exec-mfa-input" />
                </Label>
              ) : null}
              <Button type="submit" disabled={loading} className="lulu-exec-submit">
                {loading ? <><LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> {t('signingIn')}</> : <>{t(adminMfaRequired ? 'Verify administrator' : userMfaRequired ? 'Verify authenticator' : 'signIn')} <ArrowRight size={16} /></>}
              </Button>
              {adminMfaRequired || userMfaRequired ? <button type="button" onClick={() => { setAdminMfaRequired(false); setAdminMfaCode(''); setUserMfaRequired(false); setUserMfaChallengeId(''); setUserMfaCode(''); setStatusMessage(''); setError(''); }} className="lulu-exec-back-button">{t('Back to password sign-in')}</button> : null}
              {statusMessage && <p role="status" className="lulu-exec-status">{statusMessage}</p>}
              {error && <div role="alert" className="lulu-exec-error"><p>{error}</p>{errorDetails && <p>{errorDetails}</p>}</div>}
              {s && <p className="lulu-exec-success"><Check size={15} /> {t('Signed in successfully.')}</p>}
            </div>
            <div className="lulu-exec-login-links">
              <button type="button" onClick={() => navigateApp(routes.auth.forgotPassword)}>{t('forgotPassword')}</button>
              <button type="button" onClick={() => navigateApp(routes.auth.signUp)}>{t('Sign up for free')}</button>
            </div>
          </form>

          <div className="lulu-exec-prompt-strip" aria-label={t('Example starts')}>
            {promptSuggestions.map(item => <button key={item} type="button" onClick={scrollToAccess}>{t(item)}</button>)}
          </div>
        </div>
        <a className="lulu-exec-scroll-cue" href="#mission">{t('See what Lulu can do')} <ArrowRight size={15} /></a>
      </section>

      <section id="mission" className="lulu-exec-mission" aria-labelledby="lulu-mission-title">
        <div className="lulu-exec-section-intro">
          <p className="lulu-exec-kicker">{t('The highlights.')}</p>
          <h2 id="lulu-mission-title">{t('A new way to run growth.')}</h2>
          <p>{t('Lulu turns commercial intent into coordinated work across records, agents and connected systems.')}</p>
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
          <p className="lulu-exec-kicker">{t('Take a closer look.')}</p>
          <h2 id="lulu-system-title">{t('Five surfaces. One operating system.')}</h2>
          <p>{t('Each surface reflects a core Lulu capability, tuned to the way modern companies move from context to execution.')}</p>
        </div>
        <div className="lulu-exec-colorways" aria-label={t('Lulu AI surfaces')}>
          {productColorways.map(item => (
            <article key={item.name} className="lulu-exec-colorway">
              <span className={`lulu-exec-swatch ${item.name.toLowerCase()}`} aria-hidden="true" />
              <p>{t(item.name)}</p>
              <h3>{t(item.label)}</h3>
              <span>{t(item.text)}</span>
            </article>
          ))}
        </div>
        <div className="lulu-exec-layer-grid">
          {operatingLayers.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className="lulu-exec-layer">
              <div className="lulu-exec-layer-head">
                <span>0{index + 1}</span>
                <Icon size={20} aria-hidden="true" />
              </div>
              <h3>{t(title)}</h3>
              <p>{t(text)}</p>
            </article>
          ))}
        </div>
        <p className="lulu-exec-system-footnote"><ShieldCheck size={16} /> {t('Every meaningful step is grounded in a workspace, a record, a permission and an audit trail.')}</p>
      </section>

      <section id="login-access" className="lulu-exec-access" aria-labelledby="lulu-access-title">
        <div className="lulu-exec-access-copy">
          <p className="lulu-exec-eyebrow"><ShieldCheck size={14} /> {t('New workspace')}</p>
          <h2 id="lulu-access-title">{t('Made for your company.')}</h2>
          <p>{t('Create a workspace, connect the first source of truth and let Lulu begin with a concrete growth request.')}</p>
          <button type="button" onClick={() => navigateApp(routes.auth.signUp)} className="lulu-exec-text-button">
            {t('Sign up for free')} <ArrowRight size={16} />
          </button>
        </div>
        <div className="lulu-exec-access-panel" aria-label={t('Workspace entry summary')}>
          <span>{t('Saved chats')}</span>
          <span>{t('Connected data')}</span>
          <span>{t('Autonomous work')}</span>
        </div>
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
