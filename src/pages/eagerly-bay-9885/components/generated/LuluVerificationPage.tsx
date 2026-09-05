import { useEffect, useState } from 'react';
import { Check, Mail, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { navigateApp, routes } from '../../../../routing';
import { ApiError, getFriendlyErrorMessage, requestApi } from '../../../../api/client';
import { useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';
import { clearPendingEmail, getPendingEmail } from '../../../../api/session';
export const LuluVerificationPage = () => {
  const t = useTranslation();
  const [email, setEmail] = useState(getPendingEmail());
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState(new URLSearchParams(window.location.search).get('delivery') === 'failed' ? 'Your account was created, but the verification email could not be sent. Please request a new code.' : '');
  useEffect(() => { if (!cooldown) return; const timer = window.setTimeout(() => setCooldown(value => value - 1), 1000); return () => window.clearTimeout(timer); }, [cooldown]);
  const handleVerified = async () => {
    if (!email || code.length !== 6 || loading) return;
    setLoading(true);
    setError('');
    try {
      await requestApi({ path: '/auth/verify-otp', method: 'POST', body: { email, code } });
      clearPendingEmail();
      setVerified(true);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'We could not confirm this code. Please try again.'));
    } finally {
      setLoading(false);
    }
  };
  const resend = async () => {
    if (!email || loading || cooldown || verified) return;
    setLoading(true);
    setError('');
    try {
      await requestApi({ path: '/auth/resend-otp', method: 'POST', body: { email, purpose: 'verify' } });
      setResent(true);
      setCooldown(60);
      setCode('');
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 429) setCooldown(60);
      setError(getFriendlyErrorMessage(cause, 'We could not send a new code. Please try again.'));
    } finally {
      setLoading(false);
    }
  };
  return <main className="auth-shell grid min-h-screen bg-[var(--background)] text-[var(--foreground)] lg:grid-cols-2">
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--primary)] text-xl font-bold text-[var(--primary-foreground)]">L</div>
          <p className="mt-10 text-xs font-medium tracking-[.18em] text-[var(--foreground)]">ONE LAST STEP</p>
          <h1 className="mt-2 text-3xl font-semibold">Verify your email.</h1>
          <p className="mt-3 text-[var(--muted-foreground)]">Enter the six-digit code from your verification email.</p>
          <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
            {verified ? <>
                <Check className="mx-auto text-[var(--chart-4)]" size={34} />
                <h2 className="mt-3 text-lg font-semibold">Email verified</h2>
                <button className="mt-3 rounded-md bg-[var(--primary)] px-4 py-2 text-[var(--primary-foreground)]" onClick={() => navigateApp(routes.auth.login)}>Continue to sign in</button>
              </> : <>
                <Mail className="mx-auto text-[var(--foreground)]" size={34} />
                <label className="mt-4 block text-left text-sm text-[var(--muted-foreground)]">Email<input value={email} onChange={event => setEmail(event.target.value)} type="email" autoComplete="email" className="mt-1 h-10 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none" /></label>
                <label className="mt-3 block text-left text-sm text-[var(--muted-foreground)]">Verification code<input value={code} onChange={event => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" className="mt-1 h-10 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-center font-mono text-lg tracking-[.35em] text-[var(--foreground)] outline-none" /></label>
                <button disabled={loading || code.length !== 6} onClick={handleVerified} className="mt-5 h-10 w-full rounded-md bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Verifying…' : 'Verify email'}</button>
                {error && <p role="alert" className="mt-3 text-sm text-[var(--destructive)]">{t(error)}</p>}
              </>}
          </div>
          {!verified && <button disabled={loading || !email || cooldown > 0} onClick={resend} className="mx-auto mt-5 flex items-center gap-2 text-sm text-[var(--foreground)] disabled:opacity-50"><RefreshCw size={14} /> {cooldown ? t('Resend available in {{0}} seconds').replace('{{0}}',String(cooldown)) : loading ? t('Sending…') : resent ? t('Verification code resent') : t('Resend code')}</button>}
        </div>
      </section>
      <aside className="hidden border-l border-[var(--border)] bg-[var(--sidebar)] p-12 text-[var(--foreground)] lg:flex lg:flex-col lg:justify-between">
        <Sparkles size={42} />
        <div>
          <h2 className="text-5xl font-semibold">Your connected company, in context.</h2>
          <p className="mt-5 text-lg text-[var(--muted-foreground)]">Verification helps keep every Lulu workspace secure and trusted.</p>
        </div>
        <p className="flex items-center gap-2 font-medium"><ShieldCheck size={18} /> Protected by Lulu AI</p>
      </aside>
    </main>;
};
