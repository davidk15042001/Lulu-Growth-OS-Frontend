import { useState } from 'react';
import { Check, CircleAlert, Eye, EyeOff, LoaderCircle, X } from 'lucide-react';
import { navigateApp, routes } from '../../../../routing';
import { getFriendlyErrorMessage, requestApi } from '../../../../api/client';
import { clearPendingEmail, getPendingEmail } from '../../../../api/session';
const requirements = [
  { id: 'length', label: 'At least 12 characters', test: (value: string) => value.length >= 12 },
  { id: 'uppercase', label: 'One uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
  { id: 'lowercase', label: 'One lowercase letter', test: (value: string) => /[a-z]/.test(value) },
  { id: 'number', label: 'One number', test: (value: string) => /[0-9]/.test(value) },
  { id: 'special', label: 'One special character', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];
type StateKind = 'success' | 'expired' | 'invalid' | 'loading';
type StateCardProps = {
  kind: StateKind;
  title: string;
  description: string;
  primaryAction?: string;
  secondaryAction?: string;
  note?: string;
};
function LuluLogo({
  compact = false
}: {
  compact?: boolean;
}) {
  return <div className={`flex items-center justify-center ${compact ? 'gap-2' : 'gap-2.5'}`}>
    <span aria-hidden="true" className={`${compact ? 'h-8 w-8 text-base' : 'h-9 w-9 text-lg'} grid place-items-center rounded-full bg-[var(--primary)] font-bold text-[var(--primary-foreground)]`}>L</span>
    <span className={`${compact ? 'text-[15px]' : 'text-base'} font-bold tracking-[-0.02em] text-[var(--foreground)]`}>Lulu AI</span>
  </div>;
}
function StatusIcon({
  kind
}: {
  kind: StateKind;
}) {
  if (kind === 'loading') {
    return <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--secondary)] text-[var(--foreground)]">
      <LoaderCircle size={22} strokeWidth={2.5} className="animate-spin" aria-label="Resetting" />
    </div>;
  }
  if (kind === 'success') {
    return <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--chart-4)] text-white">
      <Check size={23} strokeWidth={3} aria-hidden="true" />
    </div>;
  }
  if (kind === 'expired') {
    return <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--chart-1)] text-[var(--foreground)]">
      <CircleAlert size={22} strokeWidth={2.5} aria-hidden="true" />
    </div>;
  }
  return <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--destructive)] text-white">
    <X size={23} strokeWidth={3} aria-hidden="true" />
  </div>;
}
function StateCard({
  kind,
  title,
  description,
  primaryAction,
  secondaryAction,
  note
}: StateCardProps) {
  return <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-7 shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
    <header>
      <LuluLogo compact />
    </header>
    <div className="mt-7 flex flex-col items-center text-center">
      <StatusIcon kind={kind} />
      <h3 className="mt-4 text-[18px] font-bold tracking-[-0.02em] text-[var(--foreground)]">{title}</h3>
      <p className="mt-1.5 max-w-[292px] text-[13px] leading-5 text-[var(--muted-foreground)]">{description}</p>
      {primaryAction && <button type="button" onClick={() => navigateApp(primaryAction === 'Request New Link' ? routes.auth.forgotPassword : routes.auth.login)} className="mt-4 flex h-10 w-full items-center justify-center rounded-md bg-[var(--primary)] px-3 text-[13px] font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2">
        <span>{primaryAction}</span>
      </button>}
      {secondaryAction && <button type="button" onClick={() => navigateApp(routes.auth.login)} className="mt-2.5 flex h-10 w-full items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] px-3 text-[13px] font-medium text-[var(--foreground)] transition hover:bg-[var(--secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2">
        <span>{secondaryAction}</span>
      </button>}
      {note && <p className="mt-2.5 text-[11px] text-[var(--muted-foreground)]">{note}</p>}
    </div>
  </article>;
}
export function LuluResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [email, setEmail] = useState(getPendingEmail());
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const passwordResults = requirements.map(requirement => ({ ...requirement, passed: requirement.test(password) }));
  const passedRequirements = passwordResults.filter(requirement => requirement.passed).length;
  const strengthSegments = password ? Math.max(1, Math.ceil((passedRequirements / requirements.length) * 4)) : 0;
  const passwordIsStrong = passedRequirements === requirements.length;
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    if (!email || code.length !== 6) {
      setError('Enter your email and six-digit reset code.');
      return;
    }
    if (!passwordIsStrong) {
      setError('Use at least 12 characters with uppercase, lowercase, number and special character.');
      return;
    }
    if (password !== confirmation) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await requestApi({ path: '/auth/reset-password', method: 'POST', body: { email, code, password } });
      clearPendingEmail();
      navigateApp(routes.auth.login);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'We could not reset your password. Please try again.'));
    } finally {
      setLoading(false);
    }
  };
  return <div className="auth-card-shell min-h-screen w-full bg-[var(--background)] font-sans text-[var(--foreground)]">
    <main className="flex flex-col items-center px-4 pb-10 pt-9 sm:px-6">
      <section aria-labelledby="reset-password-title" className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-7 shadow-[0_12px_32px_rgba(0,0,0,0.08)] sm:p-9">
        <header className="text-center">
          <div className="mb-6">
            <LuluLogo />
          </div>
          <h1 id="reset-password-title" className="text-[22px] font-bold tracking-[-0.02em] text-[var(--foreground)]">Reset your password</h1>
          <p className="mb-6 mt-1.5 text-sm leading-5 text-[var(--muted-foreground)]">Create a new password for your Lulu AI account. Your new password must be different from your previous one.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Reset password form">
          <div>
            <label htmlFor="reset-email" className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Email</label>
            <input id="reset-email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm text-[var(--foreground)] outline-none" />
          </div>
          <div>
            <label htmlFor="reset-code" className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Reset code</label>
            <input id="reset-code" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={event => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-center font-mono text-lg tracking-[.35em] text-[var(--foreground)] outline-none" />
          </div>
          <div>
            <label htmlFor="new-password" className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">New password</label>
            <div className="relative">
              <input id="new-password" name="new-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Create a new password" value={password} onChange={event => setPassword(event.target.value)} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 pr-10 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)]" />
              <button type="button" className="absolute right-3 top-1/2 grid -translate-y-1/2 place-items-center text-[var(--muted-foreground)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide new password' : 'Show new password'}>
                {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
              </button>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5" aria-label={`Password strength ${passwordIsStrong ? 'strong' : 'incomplete'}`}>
              {[0, 1, 2, 3].map(segment => <span key={segment} className={`h-1 flex-1 rounded-full ${segment < strengthSegments ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`} aria-hidden="true" />)}
            </div>
            <p className="mt-1.5 text-right text-[11px] font-medium text-[var(--foreground)]">{passwordIsStrong ? 'Strong' : 'Complete all requirements'}</p>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5" aria-label="Password requirements">
              {passwordResults.map(requirement => <p key={requirement.id} className={`flex items-center gap-1.5 text-[11px] leading-4 ${requirement.passed ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}>
                {requirement.passed ? <Check size={12} strokeWidth={3} aria-hidden="true" /> : <X size={12} aria-hidden="true" />}
                <span>{requirement.label}</span>
              </p>)}
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Confirm new password</label>
            <div className="relative">
              <input id="confirm-password" name="confirm-password" type={showConfirmation ? 'text' : 'password'} autoComplete="new-password" placeholder="Confirm your new password" value={confirmation} onChange={event => setConfirmation(event.target.value)} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 pr-16 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)]" aria-describedby="password-match-message" />
              <button type="button" className="absolute right-9 top-1/2 grid -translate-y-1/2 place-items-center text-[var(--muted-foreground)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]" onClick={() => setShowConfirmation(value => !value)} aria-label={showConfirmation ? 'Hide confirmation password' : 'Show confirmation password'}>
                {showConfirmation ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
              </button>
              <Check size={16} strokeWidth={3} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground)]" aria-hidden="true" />
            </div>
            <p id="password-match-message" className="mt-1.5 text-[11px] font-medium text-[var(--foreground)]">Passwords match</p>
          </div>

          {error && <p role="alert" className="text-[13px] text-[var(--destructive)]">{error}</p>}
          <button type="submit" disabled={loading} className="flex h-11 w-full items-center justify-center rounded-md bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2">
            <span>{loading ? 'Resetting…' : 'Reset Password'}</span>
          </button>
          <button type="button" onClick={() => navigateApp(routes.auth.login)} className="flex h-11 w-full items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2">
            <span>Back to Login</span>
          </button>
        </form>
        <p className="mt-5 text-center text-[11px] text-[var(--foreground)]">Step 3 of 3 · Password Reset</p>
      </section>

      <h2 className="py-16 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground)]">State reference</h2>
      <section aria-label="Reset password state reference" className="grid w-full max-w-[800px] grid-cols-1 gap-5 sm:grid-cols-2">
        <StateCard kind="success" title="Password reset" description="Your password has been successfully reset. You can now sign in with your new password." primaryAction="Sign In to Lulu AI" note="Redirecting you to login in 5 seconds..." />
        <StateCard kind="expired" title="Reset link expired" description="This password reset link has expired. Request a new one to continue." primaryAction="Request New Link" secondaryAction="Back to Login" />
        <StateCard kind="invalid" title="Invalid reset link" description="This reset link is no longer valid or has already been used." primaryAction="Request New Link" secondaryAction="Back to Login" />
        <StateCard kind="loading" title="Resetting your password" description="Please wait while we update your password." />
      </section>
    </main>
    <footer className="flex items-center justify-center gap-5 pb-6 text-center text-xs text-[var(--muted-foreground)]">
      <a href="#privacy" className="transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]">Privacy</a>
      <a href="#terms" className="transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]">Terms</a>
      <a href="#security" className="transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]">Security</a>
    </footer>
  </div>;
}
