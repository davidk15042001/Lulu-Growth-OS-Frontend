import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Mail } from 'lucide-react';
import { navigateApp, pageLinkProps, routes } from '../../../../routing';
import { getFriendlyErrorMessage, requestApi } from '../../../../api/client';
import { setPendingEmail } from '../../../../api/session';
import { useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';
import '../../../../styles/lulu-auth-recovery.css';
export const LuluPasswordReset = () => {
  const t = useTranslation();
  const [e, setE] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  return <main className="lulu-auth-recovery">
    <div className="lulu-auth-recovery__atmosphere" aria-hidden="true" />
    <header className="lulu-auth-recovery__nav">
      <a {...pageLinkProps('brightly-door-5741')} className="lulu-auth-recovery__brand lulu-global-brand-host" data-lulu-no-translate="true" translate="no" aria-label="Lulu AI login">
        <img src="/branding/lulu-agentic-mark.svg" alt="" />
        <span>LULU AI</span>
        <small>OPERATING SYSTEM</small>
      </a>
      <button type="button" onClick={() => navigateApp(routes.auth.login)} className="lulu-auth-recovery__nav-action">{t('Back to sign in')}</button>
    </header>
    <section className="lulu-auth-recovery__layout">
      <aside className="lulu-auth-recovery__story" aria-labelledby="recovery-story-title">
        <span className="lulu-auth-recovery__eyebrow">{t('ACCOUNT RECOVERY')}</span>
        <Mail aria-hidden="true" className="lulu-auth-recovery__story-icon" size={28} />
        <h1 id="recovery-story-title">{t('Your workspace stays yours.')}</h1>
        <p>{t('A quick reset and you’re back to the context that moves your business forward.')}</p>
      </aside>
      <section className="lulu-auth-recovery__card" aria-labelledby="password-recovery-title">
        <header className="lulu-auth-recovery__card-header">
          <span className="lulu-auth-recovery__eyebrow">{t('ACCOUNT RECOVERY')}</span>
          <h2 id="password-recovery-title">{t('Reset your password.')}</h2>
          <p>{t('Enter your work email and we’ll send a secure reset code.')}</p>
        </header>
        {done ? <section className="lulu-auth-recovery__success" aria-live="polite">
            <span aria-hidden="true"><Check size={19} strokeWidth={3} /></span>
            <div><h3>{t('Check your inbox.')}</h3><p>{t('A reset code was sent to')} {e}.</p></div>
            <button type="button" onClick={() => navigateApp(routes.auth.resetPassword)} className="lulu-auth-recovery__primary-action">{t('Enter reset code')} <ArrowRight size={16} /></button>
          </section> : <form onSubmit={x => {
            x.preventDefault();
            if (!e || loading) return;
            setLoading(true);
            setError('');
            requestApi({ path: '/auth/forgot-password', method: 'POST', body: { email: e } })
              .then(() => {
                setPendingEmail(e);
                setDone(true);
              })
              .catch(cause => setError(getFriendlyErrorMessage(cause, t('We could not send the reset code. Please try again.'))))
              .finally(() => setLoading(false));
          }} className="lulu-auth-recovery__form">
            <label className="lulu-auth-recovery__field" htmlFor="recovery-email"><span>{t('Work email')}</span><input id="recovery-email" value={e} onChange={x => setE(x.target.value)} type="email" autoComplete="email" placeholder={t('you@company.com')} /></label>
            <button disabled={loading} className="lulu-auth-recovery__primary-action">{t(loading ? 'Sending…' : 'Send reset code')} <ArrowRight size={16} /></button>
            {error && <p role="alert" className="lulu-auth-recovery__error">{error}</p>}
          </form>}
        <button type="button" onClick={() => navigateApp(routes.auth.login)} className="lulu-auth-recovery__back"><ArrowLeft size={15} /> {t('Back to sign in')}</button>
      </section>
    </section>
    <footer className="lulu-auth-recovery__footer"><a href="/privacy.html">{t('Privacy')}</a><a href="/terms.html">{t('Terms')}</a><a href="/.well-known/security.txt">{t('Security')}</a></footer>
  </main>;
};
