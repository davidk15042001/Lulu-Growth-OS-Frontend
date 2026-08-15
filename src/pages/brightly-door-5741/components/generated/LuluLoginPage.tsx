import { useState } from 'react';
import { ArrowRight, Check, Eye, EyeOff, LoaderCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { navigateApp, routes } from '../../../../routing';
import { ApiError, getFriendlyErrorMessage, requestApi } from '../../../../api/client';
import { useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';
import {
  clearPendingInvitation,
  getPendingInvitation,
  setPendingEmail,
  setSelectedWorkspaceId,
} from '../../../../api/session';
export const LuluLoginPage = () => {
  const t = useTranslation();
  const [e, setE] = useState('');
  const [p, setP] = useState('');
  const [s, setS] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submit = async (x: React.FormEvent) => {
    x.preventDefault();
    if (loading) return;
    if (!e.trim() || !p) {
      setError(t('missingCredentials'));
      return;
    }
    setLoading(true);
    setError('');
    setS(false);
    try {
      await requestApi({ path: '/auth/login', method: 'POST', body: { email: e, password: p } });
      const pendingInvitation = getPendingInvitation();
      let invitedWorkspaceId: string | null = null;
      if (pendingInvitation) {
        const invitation = await requestApi<{ workspaceId: string }>({
          path: `/workspaces/invitations/${encodeURIComponent(pendingInvitation)}/accept`,
          method: 'POST',
        });
        invitedWorkspaceId = invitation.data.workspaceId;
        clearPendingInvitation();
      }
      const workspaces = await requestApi<{ items: Array<{ id: string }> }>({ path: '/workspaces' });
      const workspace = workspaces.data.items.find(item => item.id === invitedWorkspaceId) ?? workspaces.data.items[0];
      setS(true);
      if (workspace) {
        setSelectedWorkspaceId(workspace.id);
        navigateApp(routes.app.dashboard);
      } else {
        navigateApp(routes.onboarding.welcome);
      }
    } catch (cause) {
      if (cause instanceof ApiError && cause.code === 'ACCOUNT_UNVERIFIED') {
        setPendingEmail(e);
        navigateApp(routes.auth.verifyEmail);
        return;
      }
      if (cause instanceof ApiError && cause.code === 'ACCOUNT_NOT_FOUND') setError(t('accountNotFound'));
      else if (cause instanceof ApiError && cause.code === 'INVALID_CREDENTIALS') setError(t('invalidCredentials'));
      else if (cause instanceof ApiError && cause.code === 'API_TIMEOUT') setError(t('timeout'));
      else setError(getFriendlyErrorMessage(cause, 'We could not sign you in. Please try again.'));
    } finally {
      setLoading(false);
    }
  };
  return <main className="auth-shell grid min-h-screen bg-[var(--background)] text-[var(--foreground)] lg:grid-cols-2">
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2">
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
            {error && <p role="alert" className="text-sm text-[var(--destructive)]">{error}</p>}
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
    </main>;
};
