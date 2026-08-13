import { useState } from 'react';
import { Check, Mail, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { navigateApp, routes } from '../../../../routing';
export const LuluVerificationPage = () => {
  const [verified, setVerified] = useState(false);
  const [resent, setResent] = useState(false);
  const handleVerified = () => {
    setVerified(true);
    window.setTimeout(() => navigateApp(routes.onboarding.welcome), 650);
  };
  return <main className="grid min-h-screen bg-[var(--background)] text-[var(--foreground)] lg:grid-cols-2">
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--primary)] text-xl font-bold text-[var(--primary-foreground)]">L</div>
          <p className="mt-10 text-xs font-medium tracking-[.18em] text-[var(--foreground)]">ONE LAST STEP</p>
          <h1 className="mt-2 text-3xl font-semibold">Verify your email.</h1>
          <p className="mt-3 text-[var(--muted-foreground)]">We sent a verification link to <b className="text-[var(--foreground)]">you@company.com</b>.</p>
          <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
            {verified ? <>
                <Check className="mx-auto text-[var(--chart-4)]" size={34} />
                <h2 className="mt-3 text-lg font-semibold">Email verified</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">Your Lulu workspace is ready.</p>
              </> : <>
                <Mail className="mx-auto text-[var(--foreground)]" size={34} />
                <p className="mt-3 text-sm text-[var(--muted-foreground)]">Open the link in your inbox, then continue here.</p>
                <button onClick={handleVerified} className="mt-5 h-10 w-full rounded-md bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90">I’ve verified my email</button>
              </>}
          </div>
          <button onClick={() => setResent(true)} className="mx-auto mt-5 flex items-center gap-2 text-sm text-[var(--foreground)]"><RefreshCw size={14} /> {resent ? 'Verification email resent' : 'Resend email'}</button>
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
