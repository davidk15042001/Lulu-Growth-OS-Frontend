import { useEffect, useState } from 'react';
import { BarChart3, Check, ChevronDown, CircleHelp, Database, LockKeyhole, Network, X } from 'lucide-react';
import { HOME_PAGE_SLUG, navigateApp, pageLinkProps, routes } from '../../../../routing';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { getAdminLandingPath, isAdminUser, prefersWorkspaceSurface } from '../../../../api/session';
type FeaturePill = {
  id: string;
  label: string;
  value: string;
};
type SetupStep = {
  number: string;
  title: string;
  description: string;
  icon: 'database' | 'network' | 'chart';
};
type ProgressStep = {
  id: string;
  label: string;
  current: boolean;
};
const featurePills: FeaturePill[] = [{
  id: 'connected',
  label: 'Connected intelligence',
  value: 'All systems in one layer'
}, {
  id: 'setup',
  label: 'Guided setup',
  value: 'Ready in minutes'
}, {
  id: 'control',
  label: 'Private by design',
  value: 'Permissions stay yours'
}];
const setupSteps: SetupStep[] = [{
  number: '01',
  title: 'Profile your business',
  description: 'Company details, offers and operating context.',
  icon: 'database'
}, {
  number: '02',
  title: 'Connect key platforms',
  description: 'Website, store, analytics and marketing sources.',
  icon: 'network'
}, {
  number: '03',
  title: 'Generate your foundation',
  description: 'Lulu AI turns your inputs into growth intelligence.',
  icon: 'chart'
}];
const progressSteps: ProgressStep[] = [{
  id: 'welcome',
  label: 'Welcome',
  current: true
}, {
  id: 'company',
  label: 'Company Setup',
  current: false
}, {
  id: 'analysis',
  label: 'AI Analysis',
  current: false
}, {
  id: 'dashboard',
  label: 'Dashboard',
  current: false
}];
export function LuluWelcomeScreen() {
  const { currentUser, loading } = useLuluApp();
  const admin = isAdminUser(currentUser);
  const [isSkipOpen, setIsSkipOpen] = useState(false);
  const displayName = [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ').trim();
  // Do not expose a stale or unverified profile name in onboarding. The authenticated
  // session is still used for authorization; the welcome UI stays neutral until the
  // current account identity has been explicitly confirmed by the active session.
  const accountLabel = 'Account';
  const greetingName = '';
  const accountInitial = 'A';
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    document.body.style.background = 'var(--background)';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.background = '';
      document.body.style.overflow = '';
    };
  }, []);
  useEffect(() => {
    if (loading || !admin || prefersWorkspaceSurface(currentUser)) return;
    navigateApp(getAdminLandingPath(routes.app.dashboard), { replace: true });
  }, [loading, admin, currentUser]);
  function handleGetStarted() {
    setStarted(true);
    const target = admin ? getAdminLandingPath(routes.onboarding.companyInformation) : routes.onboarding.companyInformation;
    window.setTimeout(() => navigateApp(target, { replace: true }), 220);
  }
  return <div className="lulu-welcome relative flex h-screen max-h-[1024px] min-h-screen w-full flex-col overflow-hidden bg-[var(--background)] font-sans text-[var(--foreground)]">
      <style>{`
        .lulu-welcome { --blue: var(--foreground); --ink: var(--foreground); --muted: var(--muted-foreground); --line: var(--border); isolation: isolate; }
        .lulu-welcome::before { content: ''; position: fixed; inset: 0; z-index: -2; pointer-events: none; background: var(--background); }
        .lulu-welcome::after { content: ''; position: fixed; inset: 0; z-index: -1; pointer-events: none; opacity: .32; background-image: linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.06) 1px, transparent 1px); background-size: 44px 44px; }
        .lulu-welcome * { box-sizing: border-box; }
        .lulu-welcome .welcome-enter { animation: welcome-enter .55s cubic-bezier(.22,1,.36,1) both; }
        .lulu-welcome .welcome-delay-1 { animation-delay: .06s; }
        .lulu-welcome .welcome-delay-2 { animation-delay: .12s; }
        .lulu-welcome .welcome-delay-3 { animation-delay: .18s; }
        .lulu-welcome .welcome-delay-4 { animation-delay: .24s; }
        @keyframes welcome-enter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .lulu-welcome .welcome-enter { animation: none; } .lulu-welcome *, .lulu-welcome *::before, .lulu-welcome *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; } }
      `}</style>

      <header className="mx-auto flex h-14 w-full max-w-[1280px] shrink-0 items-center justify-between px-5 sm:px-8 lg:px-10">
        <a {...pageLinkProps(HOME_PAGE_SLUG)} aria-label="Lulu AI home" className="welcome-enter flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--border)]">
          <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-[var(--primary)] text-base font-bold text-[var(--primary-foreground)]">
            <span>L</span>
          </span>
          <span className="text-[15px] font-bold tracking-[-0.02em] text-[var(--foreground)]">Lulu AI</span>
        </a>

        <nav aria-label="Account options" className="welcome-enter welcome-delay-1 flex items-center gap-1.5">
          <button type="button" aria-label="Get help" className="grid h-9 w-9 place-items-center rounded-lg text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]">
            <CircleHelp size={17} strokeWidth={1.8} />
          </button>
          <div className="relative">
            <button type="button" aria-expanded={isAccountOpen} aria-haspopup="menu" onClick={() => setIsAccountOpen(!isAccountOpen)} className="flex h-9 items-center gap-2 rounded-lg px-2 text-left transition hover:bg-[var(--secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]">
              <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-[var(--secondary)] text-xs font-semibold text-[var(--foreground)]">
                <span>{accountInitial}</span>
              </span>
              <ChevronDown size={14} className={`text-[var(--muted-foreground)] transition ${isAccountOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {isAccountOpen && <div role="menu" className="absolute right-0 top-11 z-20 w-44 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1.5 shadow-[0_12px_32px_rgba(0,0,0,.12)]">
                <p className="px-3 py-2 text-xs text-[var(--muted-foreground)]">{accountLabel}</p>
                <button type="button" role="menuitem" onClick={() => setIsAccountOpen(false)} className="w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--foreground)] transition hover:bg-[var(--secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]">
                  <span>Account settings</span>
                </button>
                <button type="button" role="menuitem" onClick={() => navigateApp(routes.auth.signedOut)} className="w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--foreground)] transition hover:bg-[var(--secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]">
                  <span>Sign out</span>
                </button>
              </div>}
          </div>
        </nav>
      </header>

      <main className={`mx-auto flex w-full max-w-[1180px] flex-1 items-center px-5 py-4 transition-[padding] duration-200 sm:px-8 lg:px-10 ${isAccountOpen ? 'pt-[220px] sm:pt-4' : ''}`}>
        <section aria-labelledby="welcome-title" className="grid w-full items-center gap-7 lg:grid-cols-[1.03fr_.97fr] lg:gap-10">
          <div className="text-center lg:text-left">
            <p className="welcome-enter welcome-delay-1 text-[13px] font-semibold tracking-[.08em] text-[var(--foreground)]">
              <span>WELCOME{greetingName}</span>
            </p>
            <h1 id="welcome-title" className="welcome-enter welcome-delay-2 mx-auto mt-3 max-w-[720px] text-[38px] font-bold leading-[.96] tracking-[-.06em] text-[var(--foreground)] sm:text-[56px] lg:mx-0 lg:text-[72px]">
              <span>Put Lulu AI to work for your business.</span>
            </h1>
            <p className="welcome-enter welcome-delay-3 mx-auto mt-4 max-w-[610px] text-[15px] leading-6 text-[var(--muted-foreground)] sm:text-[17px] lg:mx-0">
              <span>Your AI Business Growth Operating System starts here. Configure one connected intelligence layer around your company, tools and growth priorities.</span>
            </p>

            <div className="welcome-enter welcome-delay-4 mt-5 flex flex-col items-center gap-2.5 sm:flex-row lg:items-start">
              <button type="button" onClick={handleGetStarted} className="flex h-11 w-full max-w-[230px] items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-6 text-[14px] font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 active:scale-[.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 sm:w-auto">
                {started ? <Check size={17} strokeWidth={2.5} aria-hidden="true" /> : null}
                <span>{started ? 'Company Setup' : 'Get Started'}</span>
              </button>
            </div>

            <ul className="welcome-enter welcome-delay-4 mx-auto mt-6 grid max-w-[620px] gap-2 sm:grid-cols-3 lg:mx-0" aria-label="Lulu AI setup benefits">
              {featurePills.map(pill => <li key={pill.id} className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-left">
                  <strong className="block text-[11px] font-semibold text-[var(--foreground)]">{pill.label}</strong>
                  <span className="mt-0.5 block text-[11px] leading-4 text-[var(--muted-foreground)]">{pill.value}</span>
                </li>)}
            </ul>
          </div>

          <div className="welcome-enter welcome-delay-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_12px_32px_rgba(0,0,0,.08)] sm:p-5 lg:p-6">
            <section aria-labelledby="steps-title" className="mt-3">
              <h2 id="steps-title" className="sr-only">Setup steps</h2>
              <div className="grid gap-2.5">
                {setupSteps.map(step => <article key={step.number} className="rounded-lg border border-[var(--border)] bg-[var(--secondary)] p-3.5 transition hover:bg-[var(--card)] sm:p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-[12px] font-semibold tracking-[.08em] text-[var(--foreground)]">{step.number}</span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[14px] font-semibold leading-5 text-[var(--foreground)]">{step.title}</h3>
                        <p className="mt-0.5 text-[12px] leading-5 text-[var(--muted-foreground)]">{step.description}</p>
                      </div>
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--card)] text-[var(--foreground)]" aria-hidden="true">
                        {step.icon === 'database' ? <Database size={16} strokeWidth={1.7} /> : null}
                        {step.icon === 'network' ? <Network size={16} strokeWidth={1.7} /> : null}
                        {step.icon === 'chart' ? <BarChart3 size={16} strokeWidth={1.7} /> : null}
                      </span>
                    </div>
                  </article>)}
              </div>
            </section>

            <section aria-label="Setup progress" className="mt-4">
              <ol className="flex items-start justify-between">
                {progressSteps.map(step => <li key={step.id} className="flex flex-1 flex-col items-center gap-2 text-center">
                    <span className={`h-2.5 w-2.5 rounded-full border ${step.current ? 'border-[var(--border)] bg-[var(--primary)] shadow-[0_0_0_4px_rgba(0,0,0,.22)]' : 'border-[var(--border)] bg-[var(--card)]'} text-primary-foreground`} />
                    <span className={`text-[10px] leading-3 ${step.current ? 'font-semibold text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}>{step.label}</span>
                  </li>)}
              </ol>
            </section>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex h-12 w-full max-w-[1180px] shrink-0 items-center justify-center border-t border-[var(--border)] px-5 text-center sm:px-8 lg:px-10">
        <p className="flex items-center justify-center gap-2 text-[11px] leading-4 text-[var(--muted-foreground)]">
          <LockKeyhole size={13} strokeWidth={1.8} aria-hidden="true" />
          <span>
            <strong className="font-medium text-[var(--foreground)]">Your data stays under your control.</strong> Permissions and integrations can be managed anytime.
          </span>
        </p>
      </footer>

      {isSkipOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/40 px-5 backdrop-blur-sm" role="presentation" onMouseDown={() => setIsSkipOpen(false)}>
          <section role="dialog" aria-modal="true" aria-labelledby="skip-title" onMouseDown={event => event.stopPropagation()} className="w-full max-w-[410px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--foreground)] shadow-[0_8px_40px_rgba(0,0,0,.18)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="skip-title" className="text-[22px] font-bold tracking-[-.025em] text-[var(--foreground)]">
                  <span>Skip Setup?</span>
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                  <span>You can complete your company setup later, but Lulu AI will have less information available for personalized recommendations and analysis.</span>
                </p>
              </div>
              <button type="button" aria-label="Close dialog" onClick={() => setIsSkipOpen(false)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]">
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setIsSkipOpen(false)} className="h-11 rounded-lg border border-[var(--border)] px-4 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]">
                <span>Continue Setup</span>
              </button>
              <button type="button" onClick={() => {
            setIsSkipOpen(false);
            navigateApp(admin ? getAdminLandingPath(routes.app.dashboard) : routes.app.dashboard, { replace: true });
          }} className="h-11 rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:bg-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]">
                <span>Skip Setup</span>
              </button>
            </div>
          </section>
        </div>}
    </div>;
}
