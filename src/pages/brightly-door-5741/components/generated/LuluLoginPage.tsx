import { useState } from 'react';
import { ArrowRight, BarChart3, Check, Eye, EyeOff, Globe2, LoaderCircle, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { navigateApp, routes } from '../../../../routing';
import { ApiError, getFriendlyErrorMessage, getTechnicalErrorDetails, requestApi, type ApiRequest } from '../../../../api/client';
import { useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';
import { LoginFeaturesLanding } from './LoginFeaturesLanding';
import {
  clearPendingInvitation,
  getAdminLandingPath,
  getPendingInvitation,
  isAdminUser,
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

export const LuluLoginPage = () => {
  const t = useTranslation();
  const [e, setE] = useState('');
  const [p, setP] = useState('');
  const [s, setS] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const quickHighlights = [
    {
      icon: Globe2,
      title: t('Connected business context'),
      text: t('Bring company, product, audience and website signals into one workspace.'),
    },
    {
      icon: BarChart3,
      title: t('Verified live signals'),
      text: t('Keep decisions grounded in connected data, metrics and operational visibility.'),
    },
    {
      icon: Workflow,
      title: t('Actionable AI guidance'),
      text: t('Move from analysis to recommended next steps, approvals and execution.'),
    },
  ];
  const heroCards = [
    {
      title: t('Audience intelligence'),
      text: t('Discover who to prioritize, why they matter and how to reach them with clearer positioning.'),
    },
    {
      title: t('Website and commerce'),
      text: t('Coordinate SEO, GEO, AEO, websites, shops and business integrations from one operating system.'),
    },
    {
      title: t('Workspace operations'),
      text: t('Manage billing, permissions, reviews, files and AI workflows without losing context.'),
    },
  ];
  const integrationNames = ['WordPress', 'Webflow', 'Google Business', 'Google Analytics', 'HubSpot', 'Shopify'];
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
      await requestWithTimeout({ path: '/auth/login', method: 'POST', body: { email: e, password: p } });
      setStatusMessage(t('Loading your profile…'));
      const meResp = await requestWithTimeout<{ id: string; email: string; firstName: string | null; lastName: string | null; role: string }>({ path: '/auth/me' });
      const currentUser = meResp.data;
      setStoredUser(currentUser);
      if (isAdminUser(currentUser)) {
        setS(true);
        setStatusMessage(t('Signed in as admin.'));
        navigateApp(getAdminLandingPath(routes.app.dashboard), { replace: true });
        return;
      }
      const pendingInvitation = getPendingInvitation();
      let invitedWorkspaceId: string | null = null;
      if (pendingInvitation) {
        setStatusMessage(t('Accepting your workspace invitation…'));
        const invitation = await requestWithTimeout<{ workspaceId: string }>({
          path: `/workspaces/invitations/${encodeURIComponent(pendingInvitation)}/accept`,
          method: 'POST',
        });
        invitedWorkspaceId = invitation.data.workspaceId;
        clearPendingInvitation();
      }
      setStatusMessage(t('Loading your workspace…'));
      const workspaces = await requestWithTimeout<{ items: Array<{ id: string }> }>({ path: '/workspaces' });
      const workspace = workspaces.data.items.find(item => item.id === invitedWorkspaceId) ?? workspaces.data.items[0];
      setS(true);
      setStatusMessage(t('Signed in successfully.'));
      if (workspace) {
        setSelectedWorkspaceId(workspace.id);
        navigateApp(routes.app.dashboard);
      } else {
        navigateApp(routes.onboarding.companyInformation);
      }
    } catch (cause) {
      setStatusMessage('');
      if (cause instanceof DOMException && cause.name === 'AbortError') {
        setError(t('The login request timed out. Please try again.'));
        setErrorDetails(t('Code: API_TIMEOUT · The server did not respond within 15 seconds.'));
      } else if (cause instanceof ApiError && cause.code === 'ACCOUNT_UNVERIFIED') {
        setError(t('This account uses an outdated verification state. Please try signing in again after the latest deployment. Email OTP is no longer required for registration.'));
      } else if (cause instanceof ApiError && cause.code === 'ACCOUNT_NOT_FOUND') setError(t('accountNotFound'));
      else if (cause instanceof ApiError && cause.code === 'INVALID_CREDENTIALS') setError(t('invalidCredentials'));
      else if (cause instanceof ApiError && cause.code === 'API_TIMEOUT') setError(t('timeout'));
      else setError(getFriendlyErrorMessage(cause, t('We could not sign you in. Please try again.')));
      if (!(cause instanceof DOMException && cause.name === 'AbortError')) setErrorDetails(getTechnicalErrorDetails(cause));
    } finally {
      setLoading(false);
    }
  };
  return <main data-deploy-rev="2026-08-30-login-landing-refresh-1" className="auth-shell min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="grid min-h-screen xl:grid-cols-[minmax(0,540px)_minmax(0,1fr)]">
        <section className="relative flex items-center justify-center overflow-hidden bg-[linear-gradient(180deg,rgba(99,102,241,.08),transparent_30%),linear-gradient(0deg,rgba(148,163,184,.08),transparent_32%)] p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(99,102,241,.18),transparent_70%)]" aria-hidden="true" />
          <div className="relative w-full max-w-lg">
            <div className="lulu-global-brand-host flex items-center gap-2" data-lulu-no-translate="true" translate="no">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--primary)] font-bold text-[var(--primary-foreground)]">L</span>
              <b className="text-xl">Lulu AI</b>
            </div>
            <div className="mt-10">
              <p className="text-xs font-semibold tracking-[.18em] text-[var(--foreground)]/80">{t('welcome')}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-.04em] text-[var(--foreground)] sm:text-5xl">{t('Sign in to your live growth workspace.')}</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted-foreground)]">{t('Access your connected business context, verified signals and next best actions in one place.')}</p>
            </div>

            <div className="mt-8 grid gap-3">
              {quickHighlights.map(({ icon: Icon, title, text }) => <div key={title} className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)]/90 p-4 shadow-sm backdrop-blur">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--secondary)] text-[var(--foreground)]">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">{text}</p>
                  </div>
                </div>)}
            </div>

            <form onSubmit={submit} className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl shadow-black/5 sm:p-7" aria-label={t('Sign in form')}>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[var(--muted-foreground)]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3 py-1.5"><ShieldCheck size={13} /> {t('Secure workspace access')}</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3 py-1.5"><Sparkles size={13} /> {t('AI-first workspace')}</span>
              </div>
              <div className="mt-5 space-y-4">
                <label htmlFor="login-email" className="block text-sm text-[var(--muted-foreground)]">
                  {t('email')}
                  <input id="login-email" name="email" autoComplete="email" value={e} onChange={x => setE(x.target.value)} type="email" placeholder={t('you@company.com')} className="mt-1 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)]" />
                </label>
                <label htmlFor="login-password" className="block text-sm text-[var(--muted-foreground)]">
                  {t('password')}
                  <div className="relative">
                    <input id="login-password" name="password" autoComplete="current-password" value={p} onChange={x => setP(x.target.value)} type={show ? 'text' : 'password'} className="mt-1 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--secondary)] px-3 pr-10 text-[var(--foreground)] outline-none focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)]" />
                    <button type="button" onClick={() => setShow(!show)} aria-label={show ? t('Hide password') : t('Show password')} className="absolute right-3 top-4 text-[var(--muted-foreground)]">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                </label>
                <button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60">{loading ? <><LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> {t('signingIn')}</> : <>{t('signIn')} <ArrowRight size={16} /></>}</button>
                {statusMessage && <p role="status" className="text-sm text-[var(--muted-foreground)]">{statusMessage}</p>}
                {error && <div role="alert" className="space-y-1 text-sm text-[var(--destructive)]"><p>{error}</p>{errorDetails && <p className="break-words text-xs opacity-80">{errorDetails}</p>}</div>}
                {s && <p className="flex items-center gap-2 text-sm text-[var(--chart-4)]"><Check size={15} /> {t('Signed in successfully.')}</p>}
              </div>
              <div className="mt-6 flex justify-between gap-4 text-sm">
                <button type="button" onClick={() => navigateApp(routes.auth.forgotPassword)} className="text-[var(--foreground)]">{t('forgotPassword')}</button>
                <button type="button" onClick={() => navigateApp(routes.auth.signUp)} className="text-[var(--muted-foreground)]">{t('createAccount')}</button>
              </div>
            </form>
          </div>
        </section>

        <aside className="hidden border-l border-[var(--border)] bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_48%,#ffffff_100%)] px-10 py-12 text-slate-900 xl:flex xl:flex-col">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm">
            <Sparkles size={13} />
            {t('Lulu AI platform')}
          </div>
          <div className="mt-8 max-w-3xl">
            <h2 className="text-5xl font-semibold tracking-[-.05em] text-slate-950">{t('One login for your whole business context.')}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{t('From onboarding and audience intelligence to websites, CRM, reviews and billing, Lulu keeps teams aligned around verified signals and AI-supported next steps.')}</p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {heroCards.map(({ title, text }, index) => <article key={title} className={`rounded-3xl border p-5 shadow-sm ${index === 0 ? 'border-violet-200 bg-violet-50' : index === 1 ? 'border-sky-200 bg-sky-50' : 'border-emerald-200 bg-emerald-50'}`}>
                <p className="text-sm font-semibold text-slate-950">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </article>)}
          </div>

          <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.18em] text-slate-400">{t('Lulu Intelligence / Overview')}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{t('Turn business signals into confident action.')}</h3>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <ShieldCheck size={13} />
                {t('Server-side by design')}
              </span>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">{t('What you get after login')}</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-500" />
                    <p className="text-sm leading-6 text-slate-600">{t('Analyze your company, product, audience and performance context in one connected workspace.')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
                    <p className="text-sm leading-6 text-slate-600">{t('Review verified signals, AI hypotheses and recommended actions without losing the source context.')}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <p className="text-sm leading-6 text-slate-600">{t('Coordinate website, commerce, CRM, reviews, billing and workspace operations from one place.')}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">{t('Built to connect the systems behind your business')}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                  {integrationNames.map((name) => <span key={name} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium">{name}</span>)}
                </div>
                <p className="mt-5 text-sm leading-6 text-slate-500">{t('Connect your business context.')} {t('Let AI structure and analyze it.')}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <LoginFeaturesLanding />
    </main>;
};
