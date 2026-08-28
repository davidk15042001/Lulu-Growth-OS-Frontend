import { useState } from 'react';
import { ArrowRight, Check, Eye, EyeOff, LoaderCircle, ShieldCheck, Sparkles } from 'lucide-react';
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
    setStatusMessage('Checking your account…');
    setS(false);
    try {
      await requestWithTimeout({ path: '/auth/login', method: 'POST', body: { email: e, password: p } });
      setStatusMessage('Loading your profile…');
      const meResp = await requestWithTimeout<{ id: string; email: string; firstName: string | null; lastName: string | null; role: string }>({ path: '/auth/me' });
      const currentUser = meResp.data;
      setStoredUser(currentUser);
      if (isAdminUser(currentUser)) {
        setS(true);
        setStatusMessage('Signed in as admin.');
        navigateApp(getAdminLandingPath(routes.app.dashboard), { replace: true });
        return;
      }
      const pendingInvitation = getPendingInvitation();
      let invitedWorkspaceId: string | null = null;
      if (pendingInvitation) {
        setStatusMessage('Accepting your workspace invitation…');
        const invitation = await requestWithTimeout<{ workspaceId: string }>({
          path: `/workspaces/invitations/${encodeURIComponent(pendingInvitation)}/accept`,
          method: 'POST',
        });
        invitedWorkspaceId = invitation.data.workspaceId;
        clearPendingInvitation();
      }
      setStatusMessage('Loading your workspace…');
      const workspaces = await requestWithTimeout<{ items: Array<{ id: string }> }>({ path: '/workspaces' });
      const workspace = workspaces.data.items.find(item => item.id === invitedWorkspaceId) ?? workspaces.data.items[0];
      setS(true);
      setStatusMessage('Signed in successfully.');
      if (workspace) {
        setSelectedWorkspaceId(workspace.id);
        navigateApp(routes.app.dashboard);
      } else {
        navigateApp(routes.onboarding.companyInformation);
      }
    } catch (cause) {
      setStatusMessage('');
      if (cause instanceof DOMException && cause.name === 'AbortError') {
        setError('The login request timed out. Please try again.');
        setErrorDetails('Code: API_TIMEOUT · The server did not respond within 15 seconds.');
      } else if (cause instanceof ApiError && cause.code === 'ACCOUNT_UNVERIFIED') {
        setError('This account uses an outdated verification state. Please try signing in again after the latest deployment. Email OTP is no longer required for registration.');
      } else if (cause instanceof ApiError && cause.code === 'ACCOUNT_NOT_FOUND') setError(t('accountNotFound'));
      else if (cause instanceof ApiError && cause.code === 'INVALID_CREDENTIALS') setError(t('invalidCredentials'));
      else if (cause instanceof ApiError && cause.code === 'API_TIMEOUT') setError(t('timeout'));
      else setError(getFriendlyErrorMessage(cause, 'We could not sign you in. Please try again.'));
      if (!(cause instanceof DOMException && cause.name === 'AbortError')) setErrorDetails(getTechnicalErrorDetails(cause));
    } finally {
      setLoading(false);
    }
  };
  return <main data-deploy-rev="2026-08-27-login-refresh-1" className="auth-shell min-h-screen bg-[var(--background)] text-[var(--foreground)]"><div className="grid min-h-screen lg:grid-cols-2">
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lulu-global-brand-host flex items-center gap-2" data-lulu-no-translate="true" translate="no">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--primary)] font-bold text-[var(--primary-foreground)]">L</span>
            <b className="text-xl">Lulu AI</b>
          </div>
          <p className="mt-12 text-xs font-medium tracking-[.18em] text-[var(--foreground)]">{t('welcome')}</p>
          <h1 className="mt-2 text-3xl font-semibold">{t('headline')}</h1>
          <form onSubmit={submit} className="mt-8 space-y-4" aria-label="Sign in form">
            <label htmlFor="login-email" className="block text-sm text-[var(--muted-foreground)]">
              {t('email')}
              <input id="login-email" name="email" autoComplete="email" value={e} onChange={x => setE(x.target.value)} type="email" placeholder="you@company.com" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)]" />
            </label>
            <label htmlFor="login-password" className="block text-sm text-[var(--muted-foreground)]">
              {t('password')}
              <div className="relative">
                <input id="login-password" name="password" autoComplete="current-password" value={p} onChange={x => setP(x.target.value)} type={show ? 'text' : 'password'} className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 pr-10 text-[var(--foreground)] outline-none focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)]" />
                <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-4 text-[var(--muted-foreground)]">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </label>
            <button disabled={loading} className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60">{loading ? <><LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> {t('signingIn')}</> : <>{t('signIn')} <ArrowRight size={16} /></>}</button>
            {statusMessage && <p role="status" className="text-sm text-[var(--muted-foreground)]">{statusMessage}</p>}
            {error && <div role="alert" className="space-y-1 text-sm text-[var(--destructive)]"><p>{error}</p>{errorDetails && <p className="break-words text-xs opacity-80">{errorDetails}</p>}</div>}
            {s && <p className="flex items-center gap-2 text-sm text-[var(--chart-4)]"><Check size={15} /> Signed in successfully.</p>}
          </form>
          <div className="mt-8 flex justify-between text-sm">
            <button type="button" onClick={() => navigateApp(routes.auth.forgotPassword)} className="text-[var(--foreground)]">{t('forgotPassword')}</button>
            <button type="button" onClick={() => navigateApp(routes.auth.signUp)} className="text-[var(--muted-foreground)]">{t('createAccount')}</button>
          </div>
        </div>
      </section>
      <aside className="hidden border-l border-[var(--border)] bg-[var(--sidebar)] p-12 text-[var(--foreground)] lg:flex lg:flex-col lg:justify-between">
        <Sparkles size={42} />
        <div>
          <h2 className="text-5xl font-semibold leading-tight text-[var(--foreground)]">Make every decision more informed.</h2>
          <p className="mt-5 max-w-md text-lg text-[var(--muted-foreground)]">Lulu connects your company’s real-world signal so every team can move with confidence.</p>
        </div>
        <p className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]"><ShieldCheck size={18} /> Secure workspace access</p>
      </aside>
    </div><LoginFeaturesLanding /></main>;
};
