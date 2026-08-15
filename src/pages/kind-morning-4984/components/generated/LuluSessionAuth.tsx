import { useState, type FormEvent } from 'react';
import { ArrowLeft, Check, Eye, EyeOff, LockKeyhole, LoaderCircle, ShieldCheck } from 'lucide-react';
import { navigateApp, routes } from '../../../../routing';
import { getFriendlyErrorMessage, requestApi } from '../../../../api/client';
import { setSelectedWorkspaceId } from '../../../../api/session';
type Screen = 'expired' | 'reauth' | 'password' | 'success' | 'failure' | 'invalidated';
type Status = 'idle' | 'loading';
const footerLinks = [{
  label: 'Privacy',
  href: '#privacy'
}, {
  label: 'Terms',
  href: '#terms'
}, {
  label: 'Security',
  href: '#security'
}];
export function LuluSessionAuth() {
  const [screen, setScreen] = useState<Screen>('expired');
  const [status, setStatus] = useState<Status>('idle');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  function beginSignIn() {
    setStatus('idle');
    setScreen('reauth');
  }
  async function handleReauth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !password) {
      setError('Enter your email and password to continue.');
      return;
    }
    setError('');
    setStatus('loading');
    try {
      await requestApi({ path: '/auth/login', method: 'POST', body: { email, password } });
      const workspaces = await requestApi<{ items: Array<{ id: string }> }>({ path: '/workspaces' });
      const workspace = workspaces.data.items[0];
      if (workspace) setSelectedWorkspaceId(workspace.id);
      setStatus('idle');
      setScreen('success');
      window.setTimeout(() => navigateApp(workspace ? routes.app.dashboard : routes.onboarding.welcome), 700);
    } catch (cause) {
      setStatus('idle');
      setError(getFriendlyErrorMessage(cause, 'We could not verify your sign-in. Please try again.'));
      setScreen('failure');
    }
  }
  function handlePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password) {
      setError('Enter your password to continue.');
      return;
    }
    setError('');
    setStatus('loading');
    window.setTimeout(() => {
      setStatus('idle');
      setScreen('success');
      window.setTimeout(() => navigateApp(routes.app.dashboard), 700);
    }, 900);
  }
  const isForm = screen === 'reauth' || screen === 'password';
  const title = screen === 'expired' ? 'Your session has expired' : screen === 'reauth' ? 'Please verify your identity' : screen === 'password' ? 'Confirm your password' : screen === 'invalidated' ? 'Please sign in again' : screen === 'failure' ? 'We couldn’t verify your identity' : 'You’re verified';
  const description = screen === 'expired' ? 'For your security, your session has ended. Please sign in again to continue.' : screen === 'reauth' ? 'For your security, please sign in again before continuing.' : screen === 'password' ? 'For your security, please enter your password to continue.' : screen === 'invalidated' ? 'Your previous session is no longer available. Sign in again to continue using Lulu AI.' : screen === 'failure' ? 'Please sign in again to continue.' : 'Continuing...';
  return <div className="auth-card-shell flex min-h-screen flex-col bg-[var(--background)] font-sans text-[var(--foreground)]">
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <section aria-labelledby="session-title" className="w-full max-w-md animate-[session-enter_0.45s_ease-out] rounded-xl border border-[var(--border)] bg-[var(--card)] p-7 shadow-[0_12px_32px_rgba(0,0,0,0.08)] sm:p-9">
          <header className="text-center">
            <div className="mb-7 flex items-center justify-center gap-2.5">
              <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-[var(--primary)] text-lg font-bold text-[var(--primary-foreground)]">L</span>
              <span className="text-[17px] font-bold tracking-[-0.02em] text-[var(--foreground)]">Lulu AI</span>
            </div>
            {screen === 'success' ? <div aria-hidden="true" className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full bg-[var(--secondary)] text-[var(--chart-4)] animate-[session-pop_0.35s_ease-out]"><Check size={25} strokeWidth={2.5} /></div> : screen === 'failure' ? <div aria-hidden="true" className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full bg-[var(--secondary)] text-[var(--destructive)]"><ShieldCheck size={24} strokeWidth={1.7} /></div> : <div aria-hidden="true" className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full bg-[var(--secondary)] text-[var(--muted-foreground)]"><LockKeyhole size={22} strokeWidth={1.7} /></div>}
            <h1 id="session-title" className="text-[22px] font-bold tracking-[-0.02em] text-[var(--foreground)]">{title}</h1>
            <p className="mx-auto mt-2 max-w-[310px] text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
            {screen === 'reauth' && <p className="mt-3 text-[13px] leading-5 text-[var(--foreground)]">You’re updating an important security setting.</p>}
          </header>

          {screen === 'success' ? <div className="mt-7" role="status" aria-live="polite"><div className="h-1 overflow-hidden rounded-full bg-[var(--primary)] text-primary-foreground"><div className="h-full w-2/3 rounded-full bg-[var(--chart-4)] animate-[session-progress_1.2s_ease-in-out_infinite]" /></div><p className="mt-3 text-center text-xs text-[var(--muted-foreground)]">Returning you to where you left off</p></div> : isForm ? <form className="mt-6" onSubmit={screen === 'reauth' ? handleReauth : handlePassword} noValidate>
            {screen === 'reauth' && <div><label htmlFor="reauth-email" className="mb-1 block text-[13px] font-medium text-[var(--foreground)]">Email</label><input id="reauth-email" name="email" type="email" autoComplete="email" value={email} onChange={event => {
              setEmail(event.target.value);
              setError('');
            }} placeholder="you@company.com" className={`h-11 w-full rounded-md border bg-[var(--secondary)] px-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)] ${error ? 'border-[var(--destructive)]' : 'border-[var(--border)]'}`} /></div>}
            <div className={screen === 'reauth' ? 'mt-3.5' : ''}><label htmlFor="reauth-password" className="mb-1 block text-[13px] font-medium text-[var(--foreground)]">Password</label><span className="relative block"><input id="reauth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={event => {
                setPassword(event.target.value);
                setError('');
              }} placeholder="Enter your password" aria-invalid={Boolean(error)} className={`h-11 w-full rounded-md border bg-[var(--secondary)] px-3 pr-11 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)] ${error ? 'border-[var(--destructive)]' : 'border-[var(--border)]'}`} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-0 top-0 grid h-11 w-11 place-items-center text-[var(--muted-foreground)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"><span aria-hidden="true">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</span></button></span></div>
            {error && <p role="alert" className="mt-2 text-[13px] text-[var(--destructive)]">{error}</p>}
            <button type="submit" disabled={status === 'loading'} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">{status === 'loading' && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}<span>{status === 'loading' ? 'Verifying...' : screen === 'reauth' ? 'Continue to Sign In' : 'Continue'}</span></button>
          </form> : screen === 'expired' || screen === 'invalidated' ? <div className="mt-7"><button type="button" onClick={beginSignIn} disabled={status === 'loading'} className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">{status === 'loading' && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}<span>{status === 'loading' ? 'Preparing...' : screen === 'expired' ? 'Sign In Again' : 'Sign In'}</span></button></div> : <div className="mt-7"><button type="button" onClick={() => setScreen('expired')} className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 active:scale-[0.99]">Return to Login</button></div>}

          {screen === 'expired' && <button type="button" onClick={() => setScreen('invalidated')} className="mt-5 flex w-full items-center justify-center gap-1 text-[13px] text-[var(--foreground)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]">Return to Lulu AI</button>}
          {isForm && <button type="button" onClick={() => {
          setError('');
          setScreen('expired');
        }} className="mt-5 flex w-full items-center justify-center gap-1 text-[13px] text-[var(--foreground)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]"><ArrowLeft size={13} aria-hidden="true" /><span>Cancel</span></button>}
          {screen === 'failure' && <button type="button" onClick={() => setScreen('expired')} className="mt-5 flex w-full items-center justify-center text-[13px] text-[var(--foreground)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]">Contact Support</button>}
          {screen === 'success' && <p className="sr-only">Verification successful. Redirecting.</p>}
        </section>
      </main>
      <footer className="flex min-h-[52px] items-center justify-center gap-5 px-4 pb-5 text-center text-xs text-[var(--muted-foreground)] sm:pb-0">{footerLinks.map(link => <a key={link.label} href={link.href} className="transition hover:text-[var(--foreground)]">{link.label}</a>)}</footer>
    </div>;
}
