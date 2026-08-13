import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Mail, Sparkles } from 'lucide-react';
import { navigateApp, routes } from '../../../../routing';
export const LuluPasswordReset = () => {
  const [e, setE] = useState('');
  const [done, setDone] = useState(false);
  return <main className="grid min-h-screen bg-[var(--background)] text-[var(--foreground)] lg:grid-cols-2">
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--primary)] font-bold text-[var(--primary-foreground)]">L</span>
            <b className="text-xl text-[var(--foreground)]">Lulu AI</b>
          </div>
          <p className="mt-12 text-xs font-medium tracking-[.18em] text-[var(--foreground)]">ACCOUNT RECOVERY</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">Reset your password.</h1>
          <p className="mt-3 text-[var(--muted-foreground)]">Enter your work email and we’ll send a secure reset link.</p>
          {done ? <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
              <Check className="text-[var(--chart-4)]" />
              <p className="mt-2 font-medium text-[var(--foreground)]">Check your inbox.</p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">A reset link was sent to {e}.</p>
            </div> : <form onSubmit={x => {
          x.preventDefault();
          if (e) setDone(true);
        }} className="mt-8">
              <label className="text-sm text-[var(--muted-foreground)]">
                Work email
                <input value={e} onChange={x => setE(x.target.value)} type="email" placeholder="you@company.com" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)]" />
              </label>
              <button className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] font-semibold text-[var(--primary-foreground)] transition hover:opacity-90">Send reset link <ArrowRight size={16} /></button>
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
