import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Mail, Sparkles } from 'lucide-react';
import { navigateApp, routes } from '../../../../routing';
import { requestApi } from '../../../../api/client';
import { setPendingEmail } from '../../../../api/session';
export const LuluPasswordReset = () => {
  const [e, setE] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  return <main className="grid min-h-screen bg-[var(--background)] text-[var(--foreground)] lg:grid-cols-2">
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--primary)] font-bold text-[var(--primary-foreground)]">L</span>
            <b className="text-xl text-[var(--foreground)]">Lulu AI</b>
          </div>
          <p className="mt-12 text-xs font-medium tracking-[.18em] text-[var(--foreground)]">ACCOUNT RECOVERY</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">Reset your password.</h1>
          <p className="mt-3 text-[var(--muted-foreground)]">Enter your work email and we’ll send a secure reset code.</p>
          {done ? <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
              <Check className="text-[var(--chart-4)]" />
              <p className="mt-2 font-medium text-[var(--foreground)]">Check your inbox.</p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">A reset code was sent to {e}.</p>
              <button type="button" onClick={() => navigateApp(routes.auth.resetPassword)} className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)]">Enter reset code <ArrowRight size={16} /></button>
            </div> : <form onSubmit={x => {
          x.preventDefault();
          if (!e || loading) return;
          setLoading(true);
          setError('');
          requestApi({ path: '/auth/forgot-password', method: 'POST', body: { email: e } })
            .then(() => {
              setPendingEmail(e);
              setDone(true);
            })
            .catch(cause => setError(cause instanceof Error ? cause.message : 'Unable to send the reset code.'))
            .finally(() => setLoading(false));
        }} className="mt-8">
              <label className="text-sm text-[var(--muted-foreground)]">
                Work email
                <input value={e} onChange={x => setE(x.target.value)} type="email" placeholder="you@company.com" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)]" />
              </label>
              <button disabled={loading} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60">{loading ? 'Sending…' : 'Send reset code'} <ArrowRight size={16} /></button>
              {error && <p role="alert" className="mt-3 text-sm text-[var(--destructive)]">{error}</p>}
            </form>}
          <button type="button" onClick={() => navigateApp(routes.auth.login)} className="mt-8 flex items-center gap-2 text-sm text-[var(--foreground)]"><ArrowLeft size={15} /> Back to sign in</button>
        </div>
      </section>
      <aside className="hidden border-l border-[var(--border)] bg-[var(--sidebar)] p-12 text-[var(--foreground)] lg:flex lg:flex-col lg:justify-between">
        <Mail size={42} />
        <div>
          <Sparkles />
          <h2 className="mt-5 text-4xl font-semibold">Your workspace stays yours.</h2>
          <p className="mt-4 text-[var(--muted-foreground)]">A quick reset and you’re back to the context that moves your business forward.</p>
        </div>
      </aside>
    </main>;
};
