import { useState, type FormEvent } from 'react';
import { AlertCircle, Check, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { navigateApp, pageLinkProps, routes } from '../../../../routing';
import { ApiError, getFriendlyErrorMessage, requestApi } from '../../../../api/client';
import { clearPendingEmail, clearSelectedWorkspaceId } from '../../../../api/session';
const passwordRules: Array<{ label: string; test: (value: string) => boolean }> = [{ label: 'At least 12 characters', test: value => value.length >= 12 }, { label: 'One uppercase letter', test: value => /[A-Z]/.test(value) }, { label: 'One lowercase letter', test: value => /[a-z]/.test(value) }, { label: 'One number', test: value => /\d/.test(value) }, { label: 'One special character', test: value => /[^A-Za-z0-9]/.test(value) }];

export function LuluSignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [error, setError] = useState('');
  // Email ownership verification is intentionally not part of registration.
  // Keep the legacy challenge renderer reachable only for old API responses;
  // the current registration endpoint always returns verificationRequired:false.
  const [verificationMode, setVerificationMode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const passwordResults = passwordRules.map(rule => ({ ...rule, passed: rule.test(password) }));
  const passedRules = passwordResults.filter(rule => rule.passed).length;
  const strengthSegments = password ? Math.max(1, Math.ceil((passedRules / passwordRules.length) * 4)) : 0;
  const strengthLabel = passedRules <= 1 ? 'Weak' : passedRules <= 3 ? 'Fair' : passedRules === 4 ? 'Good' : 'Strong';
  const passwordsMatch = Boolean(confirmPassword) && password === confirmPassword;
  function validationErrorMessage(cause: ApiError) {
    const details = Array.isArray(cause.details) ? cause.details : [];
    const messages = details
      .map((detail) => {
        if (!detail || typeof detail !== 'object') return '';
        const item = detail as { path?: unknown; message?: unknown };
        const path = Array.isArray(item.path) ? item.path.join('.') : String(item.path ?? '');
        const message = String(item.message ?? '').trim();
        return path && message ? `${path}: ${message}` : message;
      })
      .filter(Boolean);
    return messages.length ? `Please check: ${messages.join(' ')}` : cause.message;
  }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'loading') return;
    if (!accepted) {
      setError('Please accept the Terms of Service and Privacy Policy to create your account.');
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your first and last name.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!passwordResults.every(rule => rule.passed)) {
      setError('Please complete all password requirements shown below.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setStatus('loading');
    setError('');
    clearSelectedWorkspaceId();
    try {
      const response = await requestApi<{ verificationRequired: boolean }>({
        path: '/auth/register',
        method: 'POST',
        body: { email, password, first_name: firstName, last_name: lastName },
      });
      if (response.data.verificationRequired) {
        setVerificationMode(true);
        setStatus('idle');
      } else {
        clearPendingEmail();
        navigateApp(routes.auth.login, { replace: true });
      }
    } catch (cause) {
      if (cause instanceof ApiError && cause.code === 'EMAIL_IN_USE') {
        setError('An account already exists for this email address. Sign in or use a different email address.');
      } else if (cause instanceof ApiError && cause.code === 'VALIDATION_ERROR') {
        setError(validationErrorMessage(cause));
      } else {
        setError(getFriendlyErrorMessage(cause, 'We could not create your account. Please try again.'));
      }
      setStatus('idle');
    }
  }
  async function verifyAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6}$/.test(verificationCode) || status === 'loading') {
      setError('Enter the six-digit code from your email.');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      await requestApi({path:'/auth/verify-otp',method:'POST',body:{email,code:verificationCode}});
      clearPendingEmail();
      navigateApp(routes.auth.login,{replace:true});
    } catch(cause) {
      setError(getFriendlyErrorMessage(cause,'We could not verify this code. Request a new code and try again.'));
      setStatus('idle');
    }
  }
  async function resendVerification() {
    if(status==='loading')return;
    setStatus('loading');setError('');setResendMessage('');
    try {
      await requestApi({path:'/auth/resend-otp',method:'POST',body:{email,purpose:'verify'}});
      setResendMessage('A new verification code was sent.');
    } catch(cause) {
      setError(getFriendlyErrorMessage(cause,'We could not send a new code. Please try again.'));
    } finally { setStatus('idle'); }
  }
  return <main className="auth-shell grid min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] lg:grid-cols-1">
      <section className="flex items-start justify-center overflow-y-auto px-6 py-10">
        <div className="w-full max-w-md">
          <div className="lulu-global-brand-host flex items-center gap-2" data-lulu-no-translate="true" translate="no">
            <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-[var(--primary)] text-lg font-bold text-[var(--primary-foreground)]">L</span>
            <span className="text-xl font-bold tracking-[-0.02em]">Lulu AI</span>
          </div>

          <header className="mt-10 text-left">
            <h1 id="signup-title" className="text-3xl font-semibold tracking-[-0.03em]">{verificationMode?'Verify your email':'Create your Lulu AI account'}</h1>
            {verificationMode?<p className="mt-2 text-sm text-[var(--muted-foreground)]">We sent a six-digit verification code to <strong>{email}</strong>.</p>:null}
          </header>

          {verificationMode?<form className="mt-8" onSubmit={verifyAccount} noValidate>
            <label htmlFor="verification-code" className="mb-1 block text-[13px] font-medium">Verification code</label>
            <input id="verification-code" name="verificationCode" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={verificationCode} onChange={event=>setVerificationCode(event.target.value.replace(/\D/g,'').slice(0,6))} className="h-12 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-center text-xl tracking-[.35em] outline-none focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)]" />
            <button type="submit" disabled={status==='loading'} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-50">{status==='loading'?<LoaderCircle size={16} className="animate-spin"/>:null}Verify account</button>
            <button type="button" onClick={()=>void resendVerification()} disabled={status==='loading'} className="mt-3 h-10 w-full text-sm font-medium underline disabled:opacity-50">Send a new code</button>
            <button type="button" onClick={()=>{clearPendingEmail();setVerificationMode(false);setVerificationCode('');setError('');}} className="h-10 w-full text-sm text-[var(--muted-foreground)]">Use another email</button>
            {resendMessage?<p role="status" className="mt-2 text-sm text-[var(--chart-4)]">{resendMessage}</p>:null}
            {error?<p role="alert" className="mt-3 flex items-start gap-2 text-[13px] text-[var(--destructive)]"><AlertCircle size={16} className="mt-0.5 shrink-0" />{error}</p>:null}
          </form>:<form className="mt-8" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="signup-first-name" className="mb-1 block text-[13px] font-medium">First name</label>
                <input id="signup-first-name" name="firstName" autoComplete="given-name" value={firstName} onChange={event => setFirstName(event.target.value)} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm outline-none transition placeholder:text-[var(--muted-foreground)] focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)]" />
              </div>
              <div>
                <label htmlFor="signup-last-name" className="mb-1 block text-[13px] font-medium">Last name</label>
                <input id="signup-last-name" name="lastName" autoComplete="family-name" value={lastName} onChange={event => setLastName(event.target.value)} className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm outline-none transition placeholder:text-[var(--muted-foreground)] focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)]" />
              </div>
            </div>
            <div>
              <label htmlFor="signup-email" className="mb-1 mt-4 block text-[13px] font-medium">Email</label>
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
              {password && <>
                <div className="mt-2.5 flex items-center gap-1.5" aria-label={`Password strength: ${strengthLabel}`}>
                  {[1, 2, 3, 4].map(segment => <span key={segment} className={`h-1 flex-1 rounded-full ${segment <= strengthSegments ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`} />)}
                  <span className="ml-1 text-[11px] font-medium">{strengthLabel}</span>
                </div>
                <ul className="mt-2 grid gap-1 sm:grid-cols-2" aria-label="Password requirements">
                  {passwordResults.map(rule => <li key={rule.label} className="flex items-center gap-1.5 text-[11px] text-[var(--muted-foreground)]">
                      <span aria-hidden="true" className={`grid h-3 w-3 place-items-center rounded-full ${rule.passed ? 'text-[var(--chart-4)]' : 'text-[var(--muted-foreground)]'}`}>
                        {rule.passed ? <Check size={11} strokeWidth={3} /> : '·'}
                      </span>
                      <span>{rule.label}</span>
                    </li>)}
                </ul>
              </>}
            </div>

            <div className="mt-4">
              <label htmlFor="confirm-password" className="mb-1 block text-[13px] font-medium">Confirm password</label>
              <span className="relative block">
                <input id="confirm-password" name="confirmPassword" type={showConfirm ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder="Confirm your password" className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 pr-[68px] text-sm outline-none transition placeholder:text-[var(--muted-foreground)] focus:ring-[3px] focus:ring-[rgba(0,0,0,0.10)]" />
                {passwordsMatch && <span className="absolute right-10 top-0 grid h-11 w-7 place-items-center text-[var(--chart-4)]" aria-label="Passwords match"><Check size={14} strokeWidth={3} /></span>}
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? 'Hide confirmation password' : 'Show confirmation password'} className="absolute right-0 top-0 grid h-11 w-11 place-items-center text-[var(--muted-foreground)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
              {confirmPassword && <p className={`mt-1 text-[11px] ${passwordsMatch ? 'text-[var(--chart-4)]' : 'text-[var(--destructive)]'}`}>
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match yet'}
              </p>}
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-2 text-[13px] leading-5">
              <input id="signup-accept-terms" name="acceptTerms" type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} autoComplete="off" required className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--primary)]" />
              <span>I agree to the <a href="/terms.html" target="_blank" rel="noreferrer" className="underline">Terms of Service</a> and <a href="/privacy.html" target="_blank" rel="noreferrer" className="underline">Privacy Policy</a>.</span>
            </label>

            <button type="submit" disabled={status === 'loading'} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">
              {status === 'loading' && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}
              <span>{status === 'loading' ? 'Creating account...' : 'Create Account'}</span>
            </button>
            {error && <p role="alert" className="mt-3 flex items-start gap-2 text-[13px] text-[var(--destructive)]"><AlertCircle size={16} className="mt-0.5 shrink-0" />{error}</p>}
          </form>}

          <p className="mt-5 text-center text-[13px] text-[var(--muted-foreground)]">Already have a Lulu AI account? <a {...pageLinkProps('brightly-door-5741')} className="font-medium text-[var(--foreground)] hover:underline">Sign in</a></p>

          <nav aria-label="Legal links" className="mt-8 flex justify-center gap-5 text-xs text-[var(--muted-foreground)] lg:hidden">
            <a href="/privacy.html" className="transition hover:text-[var(--foreground)]">Privacy</a>
            <a href="/terms.html" className="transition hover:text-[var(--foreground)]">Terms</a>
            <a href="/.well-known/security.txt" className="transition hover:text-[var(--foreground)]">Security</a>
          </nav>
        </div>
      </section>

    </main>;
}
