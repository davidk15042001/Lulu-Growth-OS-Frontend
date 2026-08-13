import { useState, type FormEvent } from 'react';
import { AlertCircle, Check, Eye, EyeOff, LoaderCircle, Sparkles } from 'lucide-react';
import { navigateApp, pageLinkProps, routes } from '../../../../routing';
const requirements = ['At least 8 characters', 'One uppercase letter', 'One lowercase letter', 'One number', 'One special character'];
const socialButtonClass = 'flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-[var(--border)] bg-[var(--card)] text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2';
export function LuluSignupPage() {
  const [email, setEmail] = useState('sarah@acmecorp.com');
  const [password, setPassword] = useState('LuluAI!2025');
  const [confirmPassword, setConfirmPassword] = useState('LuluAI!2025');
  const [accepted, setAccepted] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    window.setTimeout(() => navigateApp(routes.auth.verifyEmail), 700);
  }
  return <main className="grid min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] lg:grid-cols-2">
      <section className="flex items-start justify-center overflow-y-auto px-6 py-10">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-[var(--primary)] text-lg font-bold text-[var(--primary-foreground)]">L</span>
            <span className="text-xl font-bold tracking-[-0.02em]">Lulu AI</span>
          </div>

          <header className="mt-10 text-left">
            <h1 id="signup-title" className="text-3xl font-semibold tracking-[-0.03em]">Create your Lulu AI account</h1>
          </header>

          <div aria-hidden="true" className="invisible mt-4 flex h-0 items-start gap-2 overflow-hidden rounded-md border border-[var(--destructive)] bg-[var(--card)] px-3 py-2.5 text-[13px] text-[var(--destructive)]">
            <AlertCircle size={16} className="shrink-0" />
            <span>An account already exists with this email. Please sign in instead.</span>
          </div>

          <form className="mt-8" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="signup-email" className="mb-1 block text-[13px] font-medium">Email</label>
              <input id="signup-email" name="email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@company.com" className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm outline-none transition placeholder:text-[var(--muted-foreground)] focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)]" />
            </div>

            <div className="mt-4">
              <label htmlFor="signup-password" className="mb-1 block text-[13px] font-medium">Password</label>
              <span className="relative block">
                <input id="signup-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Create a password" className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 pr-11 text-sm outline-none transition placeholder:text-[var(--muted-foreground)] focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-0 top-0 grid h-11 w-11 place-items-center text-[var(--muted-foreground)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
              <div className="mt-2.5 flex items-center gap-1.5" aria-label="Password strength: Strong">
                <span className="h-1 flex-1 rounded-full bg-[var(--primary)]" />
                <span className="h-1 flex-1 rounded-full bg-[var(--primary)]" />
                <span className="h-1 flex-1 rounded-full bg-[var(--primary)]" />
                <span className="h-1 flex-1 rounded-full bg-[var(--primary)]" />
                <span className="ml-1 text-[11px] font-medium">Strong</span>
              </div>
              <ul className="mt-2 grid gap-1 sm:grid-cols-2" aria-label="Password requirements">
                {requirements.map(requirement => <li key={requirement} className="flex items-center gap-1.5 text-[11px] text-[var(--muted-foreground)]">
                    <Check size={11} strokeWidth={3} className="text-[var(--foreground)]" aria-hidden="true" />
                    <span>{requirement}</span>
                  </li>)}
              </ul>
            </div>

            <div className="mt-4">
              <label htmlFor="confirm-password" className="mb-1 block text-[13px] font-medium">Confirm password</label>
              <span className="relative block">
                <input id="confirm-password" name="confirmPassword" type={showConfirm ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder="Confirm your password" className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 pr-[68px] text-sm outline-none transition placeholder:text-[var(--muted-foreground)] focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)]" />
                <span className="absolute right-10 top-0 grid h-11 w-7 place-items-center text-[var(--chart-4)]" aria-label="Passwords match"><Check size={14} strokeWidth={3} /></span>
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? 'Hide confirmation password' : 'Show confirmation password'} className="absolute right-0 top-0 grid h-11 w-11 place-items-center text-[var(--muted-foreground)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
              <p className="mt-1 text-[11px] text-[var(--chart-4)]">Passwords match</p>
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-2 text-[13px] leading-5">
              <input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} className="peer sr-only" />
              <span aria-hidden="true" className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-[4px] border-[1.5px] border-[var(--border)] text-transparent transition peer-checked:bg-[var(--primary)] peer-checked:text-[var(--primary-foreground)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ring)]"><Check size={11} strokeWidth={3} /></span>
              <span>I agree to the <a href="https://lulu.ai/terms" target="_blank" rel="noreferrer" className="underline">Terms of Service</a> and <a href="https://lulu.ai/privacy" target="_blank" rel="noreferrer" className="underline">Privacy Policy</a>.</span>
            </label>

            <button type="submit" disabled={status === 'loading' || !accepted} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">
              {status === 'loading' && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}
              <span>{status === 'loading' ? 'Creating account...' : 'Create Account'}</span>
            </button>
          </form>

          <div className="my-5 flex items-center">
            <hr className="flex-1 border-0 border-t border-[var(--border)]" />
            <span className="px-3 text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--muted-foreground)]">Or continue with</span>
            <hr className="flex-1 border-0 border-t border-[var(--border)]" />
          </div>

          <div className="space-y-2.5">
            <button type="button" onClick={() => navigateApp(routes.auth.verifyEmail)} className={socialButtonClass}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path fill="var(--foreground)" d="M17.64 9.2c0-.63-.06-1.24-.16-1.82H9v3.44h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.58 2.68-3.9 2.68-6.6Z" /><path fill="var(--foreground)" d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.92-2.26c-.8.54-1.82.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 0 0 9 18Z" /><path fill="var(--foreground)" d="M3.97 10.7A5.4 5.4 0 0 1 3.69 9c0-.59.1-1.17.28-1.7V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.03l3.01-2.34Z" /><path fill="var(--foreground)" d="M9 3.58c1.32 0 2.5.45 3.43 1.34l2.57-2.57C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.97l3.01 2.34c.71-2.14 2.69-3.73 5.03-3.73Z" /></svg>
              <span>Continue with Google</span>
            </button>
            <button type="button" onClick={() => navigateApp(routes.auth.verifyEmail)} className={socialButtonClass}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path fill="var(--foreground)" d="M1 1h7.6v7.6H1z" /><path fill="var(--foreground)" d="M9.4 1H17v7.6H9.4z" /><path fill="var(--foreground)" d="M1 9.4h7.6V17H1z" /><path fill="var(--foreground)" d="M9.4 9.4H17V17H9.4z" /></svg>
              <span>Continue with Microsoft</span>
            </button>
            <button type="button" onClick={() => navigateApp(routes.auth.verifyEmail)} className={socialButtonClass}>
              <span aria-hidden="true" className="grid h-[18px] w-[18px] place-items-center rounded-[5px] bg-[var(--primary)] text-[11px] font-bold text-[var(--primary-foreground)]">••</span>
              <span>Continue with WeChat</span>
            </button>
          </div>

          <p className="mt-5 text-center text-[13px] text-[var(--muted-foreground)]">Already have a Lulu AI account? <a {...pageLinkProps('brightly-door-5741')} className="font-medium text-[var(--foreground)] hover:underline">Sign in</a></p>

          <nav aria-label="Legal links" className="mt-8 flex justify-center gap-5 text-xs text-[var(--muted-foreground)] lg:hidden">
            <a href="#privacy" className="transition hover:text-[var(--foreground)]">Privacy</a>
            <a href="#terms" className="transition hover:text-[var(--foreground)]">Terms</a>
            <a href="#security" className="transition hover:text-[var(--foreground)]">Security</a>
          </nav>
        </div>
      </section>

      <aside className="hidden border-l border-[var(--border)] bg-[var(--sidebar)] p-12 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between">
        <Sparkles size={42} />
        <div>
          <h2 className="max-w-xl text-5xl font-semibold leading-tight">Start building a smarter, more connected business with AI.</h2>
        </div>
        <nav aria-label="Legal links" className="flex gap-5 text-sm text-[var(--muted-foreground)]">
          <a href="#privacy" className="transition hover:text-[var(--foreground)]">Privacy</a>
          <a href="#terms" className="transition hover:text-[var(--foreground)]">Terms</a>
          <a href="#security" className="transition hover:text-[var(--foreground)]">Security</a>
        </nav>
      </aside>
    </main>;
}
