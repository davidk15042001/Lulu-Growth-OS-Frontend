import { useState } from 'react';
import { ArrowRight, Check, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { navigateApp, routes } from '../../../../routing';
export const LuluLoginPage = () => {
  const [e, setE] = useState('');
  const [p, setP] = useState('');
  const [s, setS] = useState(false);
  const [show, setShow] = useState(false);
  const submit = (x: React.FormEvent) => {
    x.preventDefault();
    const isValid = Boolean(e && p);
    setS(isValid);
    if (isValid) window.setTimeout(() => navigateApp(routes.app.dashboard), 450);
  };
  return <main className="grid min-h-screen bg-[var(--background)] text-[var(--foreground)] lg:grid-cols-2">
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--primary)] font-bold text-[var(--primary-foreground)]">L</span>
            <b className="text-xl">Lulu AI</b>
          </div>
          <p className="mt-12 text-xs font-medium tracking-[.18em] text-[var(--foreground)]">WELCOME BACK</p>
          <h1 className="mt-2 text-3xl font-semibold">Your business context is waiting.</h1>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block text-sm text-[var(--muted-foreground)]">
              Work email
              <input value={e} onChange={x => setE(x.target.value)} type="email" placeholder="you@company.com" className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-[var(--foreground)] outline-none focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)]" />
            </label>
            <label className="block text-sm text-[var(--muted-foreground)]">
              Password
              <div className="relative">
                <input value={p} onChange={x => setP(x.target.value)} type={show ? 'text' : 'password'} className="mt-1 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 pr-10 text-[var(--foreground)] outline-none focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)]" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-4 text-[var(--muted-foreground)]">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </label>
            <button className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] font-semibold text-[var(--primary-foreground)] transition hover:opacity-90">Sign in <ArrowRight size={16} /></button>
            {s && <p className="flex items-center gap-2 text-sm text-[var(--chart-4)]"><Check size={15} /> Signed in successfully.</p>}
          </form>
          <div className="mt-8 flex justify-between text-sm">
            <button type="button" onClick={() => navigateApp(routes.auth.forgotPassword)} className="text-[var(--foreground)]">Forgot password?</button>
            <button type="button" onClick={() => navigateApp(routes.auth.signUp)} className="text-[var(--muted-foreground)]">Create account</button>
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
