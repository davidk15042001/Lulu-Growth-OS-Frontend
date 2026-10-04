import { useState, type FormEvent } from 'react';
import { AlertCircle, Check, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { navigateApp, pageLinkProps, routes } from '../../../../routing';
import { ApiError, getFriendlyErrorMessage, requestApi } from '../../../../api/client';
import { clearPendingEmail, clearSelectedWorkspaceId, getPendingVerificationEmail, setPendingVerificationEmail } from '../../../../api/session';
import { useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';
import '../../signup.css';
const LEGAL_ENTITY_NAME = 'Hong Kong Lulu Development Limited';
const passwordRules: Array<{ label: string; test: (value: string) => boolean }> = [{ label: 'At least 12 characters', test: value => value.length >= 12 }, { label: 'One uppercase letter', test: value => /[A-Z]/.test(value) }, { label: 'One lowercase letter', test: value => /[a-z]/.test(value) }, { label: 'One number', test: value => /\d/.test(value) }, { label: 'One special character', test: value => /[^A-Za-z0-9]/.test(value) }];

export function LuluSignupPage() {
  const t = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(() => getPendingVerificationEmail());
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [verificationStep, setVerificationStep] = useState(() => Boolean(getPendingVerificationEmail()));
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'resending'>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [error, setError] = useState('');
  const passwordResults = passwordRules.map(rule => ({ ...rule, passed: rule.test(password) }));
  const passedRules = passwordResults.filter(rule => rule.passed).length;
  const strengthSegments = password ? Math.max(1, Math.ceil((passedRules / passwordRules.length) * 4)) : 0;
  const strengthLabel = t(passedRules <= 1 ? 'Weak' : passedRules <= 3 ? 'Fair' : passedRules === 4 ? 'Good' : 'Strong');
  const passwordsMatch = Boolean(confirmPassword) && password === confirmPassword;
  async function verifyEmail() {
    if (verificationStatus !== 'idle' || !/^\d{6}$/.test(verificationCode)) {
      if (!/^\d{6}$/.test(verificationCode)) setVerificationMessage(t('Enter the six-digit code from your email.'));
      return;
    }
    setVerificationStatus('loading');
    setVerificationMessage('');
    try {
      await requestApi({ path: '/auth/verify-otp', method: 'POST', body: { email: email.trim(), code: verificationCode } });
      clearPendingEmail();
      navigateApp(routes.auth.login, { replace: true });
    } catch (cause) {
      setVerificationMessage(getFriendlyErrorMessage(cause, t('We could not verify your email. Please try again.')));
      setVerificationStatus('idle');
    }
  }
  async function resendVerificationCode() {
    if (verificationStatus !== 'idle') return;
    setVerificationStatus('resending');
    setVerificationMessage('');
    try {
      await requestApi({ path: '/auth/resend-otp', method: 'POST', body: { email: email.trim(), purpose: 'verify' } });
      setVerificationMessage(t('A new verification code was sent.'));
    } catch (cause) {
      setVerificationMessage(getFriendlyErrorMessage(cause, t('We could not send a new code yet.')));
    } finally {
      setVerificationStatus('idle');
    }
  }
  function useAnotherEmail() {
    clearPendingEmail();
    setEmail('');
    setVerificationCode('');
    setVerificationMessage('');
    setError('');
    setVerificationStep(false);
  }
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
      setError(t('Please accept the Terms of Service and Privacy Policy to create your account.'));
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setError(t('Please enter your first and last name.'));
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError(t('Please enter a valid email address.'));
      return;
    }
    if (!passwordResults.every(rule => rule.passed)) {
      setError(t('Please complete all password requirements shown below.'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('Passwords do not match.'));
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
        setPendingVerificationEmail(email.trim());
        setVerificationStep(true);
        setVerificationMessage(t('We sent a six-digit verification code to your email.'));
        setStatus('idle');
        return;
      }
      clearPendingEmail();
      navigateApp(routes.auth.login, { replace: true });
    } catch (cause) {
      if (cause instanceof ApiError && cause.code === 'EMAIL_IN_USE') {
        setError(t('An account already exists for this email address. Sign in or use a different email address.'));
      } else if (cause instanceof ApiError && cause.code === 'VALIDATION_ERROR') {
        setError(validationErrorMessage(cause));
      } else {
        setError(getFriendlyErrorMessage(cause, 'We could not create your account. Please try again.'));
      }
      setStatus('idle');
    }
  }
  return <main className="lulu-signup">
    <div className="lulu-signup__atmosphere" aria-hidden="true" />
    <header className="lulu-signup__nav">
      <a {...pageLinkProps('brightly-door-5741')} className="lulu-signup__brand lulu-global-brand-host" data-lulu-no-translate="true" translate="no" aria-label="Lulu AI login">
        <img src="/branding/lulu-agentic-mark.svg" alt="" />
        <span>LULU AI</span>
        <small>OPERATING SYSTEM</small>
      </a>
      <a {...pageLinkProps('brightly-door-5741')} className="lulu-signup__sign-in-link">{t('Already have an account?')} <strong>{t('Sign in')}</strong></a>
    </header>

    <section className="lulu-signup__layout">
      <section className="lulu-signup__story" aria-labelledby="signup-title">
        <p className="lulu-signup__eyebrow">{t('YOUR COMPANY, ONE OPERATING SYSTEM')}</p>
        <h1 id="signup-title">{t('Create your Lulu AI account')}</h1>
        <p className="lulu-signup__lede">{t('Set up the workspace where your company memory, connected systems and governed execution come together.')}</p>
        <div className="lulu-signup__principles" aria-label={t('What your Lulu workspace includes')}>
          <div><span aria-hidden="true">01</span><p><strong>{t('One trusted workspace')}</strong> {t('for the context your company needs to operate.')}</p></div>
          <div><span aria-hidden="true">02</span><p><strong>{t('Connected when you are ready')}</strong> {t('— keep your existing tools and data in control.')}</p></div>
          <div><span aria-hidden="true">03</span><p><strong>{t('Clear, governed execution')}</strong> {t('with controls that remain visible to your team.')}</p></div>
        </div>
      </section>

      <section className="lulu-signup__form-card" aria-labelledby="signup-form-title">
        <header className="lulu-signup__form-header">
          <span className="lulu-signup__step">{t('ACCOUNT SETUP')}</span>
          <h2 id="signup-form-title">{t('Start your workspace')}</h2>
          <p>{t('Use your work email. You can invite the rest of your team after setup.')}</p>
        </header>

        {verificationStep && <section className="lulu-signup__verification" aria-labelledby="verify-signup-title">
          <h3 id="verify-signup-title">{t('Confirm your email')}</h3>
          <p>{t('Enter the six-digit code sent to')} <strong>{email}</strong>.</p>
          <label htmlFor="signup-verification-code" className="lulu-signup__field">
            <span>{t('Verification code')}</span>
            <input id="signup-verification-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={verificationCode} onChange={event => setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))} className="lulu-signup__input lulu-signup__verification-code" />
          </label>
          <button type="button" onClick={() => void verifyEmail()} disabled={verificationStatus !== 'idle'} className="lulu-signup__submit">{verificationStatus === 'loading' && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}{t('Verify email')}</button>
          <button type="button" onClick={() => void resendVerificationCode()} disabled={verificationStatus !== 'idle'} className="lulu-signup__secondary-action">{t(verificationStatus === 'resending' ? 'Sending…' : 'Send a new code')}</button>
          <button type="button" onClick={useAnotherEmail} disabled={verificationStatus !== 'idle'} className="lulu-signup__secondary-action">{t('Use another email')}</button>
          {verificationMessage && <p role="status" className="lulu-signup__notice">{verificationMessage}</p>}
        </section>}

        {!verificationStep && <form className="lulu-signup__form" onSubmit={handleSubmit} noValidate>
          <div className="lulu-signup__name-fields">
            <label htmlFor="signup-first-name" className="lulu-signup__field">
              <span>{t('First name')}</span>
              <input id="signup-first-name" name="firstName" autoComplete="given-name" value={firstName} onChange={event => setFirstName(event.target.value)} className="lulu-signup__input" />
            </label>
            <label htmlFor="signup-last-name" className="lulu-signup__field">
              <span>{t('Last name')}</span>
              <input id="signup-last-name" name="lastName" autoComplete="family-name" value={lastName} onChange={event => setLastName(event.target.value)} className="lulu-signup__input" />
            </label>
          </div>
          <label htmlFor="signup-email" className="lulu-signup__field">
            <span>{t('Email')}</span>
            <input id="signup-email" name="email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder={t('you@company.com')} className="lulu-signup__input" />
          </label>

          <label htmlFor="signup-password" className="lulu-signup__field">
            <span>{t('Password')}</span>
            <span className="lulu-signup__password-field">
              <input id="signup-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} placeholder={t('Create a password')} className="lulu-signup__input" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={t(showPassword ? 'Hide password' : 'Show password')} className="lulu-signup__password-toggle">
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>
          {password && <section className="lulu-signup__password-status" aria-label={t(`Password strength: ${strengthLabel}`)}>
            <div className="lulu-signup__strength"><span className="lulu-signup__strength-bars" aria-hidden="true">{[1, 2, 3, 4].map(segment => <i key={segment} className={segment <= strengthSegments ? 'is-active' : ''} />)}</span><strong>{strengthLabel}</strong></div>
            <ul aria-label={t('Password requirements')}>
              {passwordResults.map(rule => <li key={rule.label} className={rule.passed ? 'is-passed' : ''}><span aria-hidden="true">{rule.passed ? <Check size={11} strokeWidth={3} /> : '·'}</span>{t(rule.label)}</li>)}
            </ul>
          </section>}

          <label htmlFor="confirm-password" className="lulu-signup__field">
            <span>{t('Confirm password')}</span>
            <span className="lulu-signup__password-field">
              <input id="confirm-password" name="confirmPassword" type={showConfirm ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder={t('Confirm your password')} className="lulu-signup__input" />
              {passwordsMatch && <span className="lulu-signup__password-match" aria-label={t('Passwords match')}><Check size={14} strokeWidth={3} /></span>}
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} aria-label={t(showConfirm ? 'Hide confirmation password' : 'Show confirmation password')} className="lulu-signup__password-toggle">
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>
          {confirmPassword && <p className={`lulu-signup__match-note ${passwordsMatch ? 'is-matched' : 'is-unmatched'}`}>{t(passwordsMatch ? 'Passwords match' : 'Passwords do not match yet')}</p>}

          <label className="lulu-signup__terms">
            <input id="signup-accept-terms" name="acceptTerms" type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} autoComplete="off" required />
            <span>{t('I agree to the')} <a href="/terms.html" target="_blank" rel="noreferrer">{t('Terms of Service')}</a> {t('and')} <a href="/privacy.html" target="_blank" rel="noreferrer">{t('Privacy Policy')}</a>.</span>
          </label>

          <button type="submit" disabled={status === 'loading'} className="lulu-signup__submit">
            {status === 'loading' && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}
            <span>{t(status === 'loading' ? 'Creating account...' : 'Create Account')}</span>
          </button>
          {error && <p role="alert" className="lulu-signup__notice lulu-signup__notice--error"><AlertCircle size={16} aria-hidden="true" />{error}</p>}
        </form>}

        <p className="lulu-signup__form-footer">{t('Already have a Lulu AI account?')} <a {...pageLinkProps('brightly-door-5741')}>{t('Sign in')}</a></p>
      </section>
    </section>

    <footer className="lulu-signup__footer">
      <nav aria-label={t('Legal links')}><a href="/privacy.html">{t('Privacy')}</a><a href="/terms.html">{t('Terms')}</a><a href="/.well-known/security.txt">{t('Security')}</a></nav>
      <p>{LEGAL_ENTITY_NAME}</p>
    </footer>
  </main>;
}
