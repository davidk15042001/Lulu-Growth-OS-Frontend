import { useState } from 'react';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import { navigateApp, pageLinkProps, routes } from '../../../../routing';
import { getFriendlyErrorMessage, requestApi } from '../../../../api/client';
import { clearPendingEmail, getPendingEmail } from '../../../../api/session';
import '../../../../styles/lulu-auth-recovery.css';
const requirements = [
  { id: 'length', label: 'At least 12 characters', test: (value: string) => value.length >= 12 },
  { id: 'uppercase', label: 'One uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
  { id: 'lowercase', label: 'One lowercase letter', test: (value: string) => /[a-z]/.test(value) },
  { id: 'number', label: 'One number', test: (value: string) => /[0-9]/.test(value) },
  { id: 'special', label: 'One special character', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];
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
  const passwordsMatch = Boolean(confirmation) && password === confirmation;
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
  return <main className="lulu-auth-recovery lulu-auth-recovery--compact">
    <div className="lulu-auth-recovery__atmosphere" aria-hidden="true" />
    <header className="lulu-auth-recovery__nav">
      <a {...pageLinkProps('brightly-door-5741')} className="lulu-auth-recovery__brand lulu-global-brand-host" data-lulu-no-translate="true" translate="no" aria-label="Lulu AI login">
        <img src="/branding/lulu-agentic-mark.svg" alt="" />
        <span>LULU AI</span>
        <small>OPERATING SYSTEM</small>
      </a>
      <button type="button" onClick={() => navigateApp(routes.auth.login)} className="lulu-auth-recovery__nav-action">Back to sign in</button>
    </header>
    <section className="lulu-auth-recovery__compact-content">
      <section aria-labelledby="reset-password-title" className="lulu-auth-recovery__card">
        <header className="text-center">
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
            {password && <>
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
            </>}
          </div>

          <div>
            <label htmlFor="confirm-password" className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]">Confirm new password</label>
            <div className="relative">
              <input id="confirm-password" name="confirm-password" type={showConfirmation ? 'text' : 'password'} autoComplete="new-password" placeholder="Confirm your new password" value={confirmation} onChange={event => setConfirmation(event.target.value)} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 pr-16 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)]" aria-describedby={confirmation ? 'password-match-message' : undefined} />
              <button type="button" className="absolute right-9 top-1/2 grid -translate-y-1/2 place-items-center text-[var(--muted-foreground)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]" onClick={() => setShowConfirmation(value => !value)} aria-label={showConfirmation ? 'Hide confirmation password' : 'Show confirmation password'}>
                {showConfirmation ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
              </button>
              {passwordsMatch && <Check size={16} strokeWidth={3} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--chart-4)]" aria-hidden="true" />}
            </div>
            {confirmation && <p id="password-match-message" className={`mt-1.5 text-[11px] font-medium ${passwordsMatch ? 'text-[var(--chart-4)]' : 'text-[var(--destructive)]'}`}>{passwordsMatch ? 'Passwords match' : 'Passwords do not match yet'}</p>}
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

    </section>
    <footer className="lulu-auth-recovery__footer"><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/.well-known/security.txt">Security</a></footer>
  </main>;
}
