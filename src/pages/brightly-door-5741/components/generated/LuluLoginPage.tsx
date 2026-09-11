import { useState } from 'react';
import { Activity, ArrowRight, Check, ChevronDown, Eye, EyeOff, Globe2, Layers3, LoaderCircle, Network, Radar, ShieldCheck, Sparkles, Target, Zap } from 'lucide-react';
import { navigateApp, routes } from '../../../../routing';
import { ApiError, getFriendlyErrorMessage, getTechnicalErrorDetails, requestApi, type ApiRequest } from '../../../../api/client';
import { switchLanguage, useLanguage, useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';
import { getLanguage, isAvailableLanguageCode, languages } from '../../../../i18n/languages';
import { LoginFeaturesLanding } from './LoginFeaturesLanding';
import { AgenticWorkforceLanding } from './AgenticWorkforceLanding';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import {
  clearPendingInvitation,
  getAdminLandingPath,
  getPendingInvitation,
  isAdminUser,
  clearSelectedWorkspaceId,
  setStoredUser,
  setSelectedWorkspaceId,
} from '../../../../api/session';

async function requestWithTimeout<T>(request: ApiRequest, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await requestApi<T>({ ...request, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

const loginStyles = `
@keyframes luluFadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes luluFadeIn{from{opacity:0}to{opacity:1}}
@keyframes luluFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
@keyframes luluPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.9)}}
@keyframes luluGradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes luluGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes luluScan{0%{transform:translateY(-140%);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateY(680%);opacity:0}}
@keyframes luluSignal{0%,100%{box-shadow:0 0 0 0 rgba(36,228,243,.15)}50%{box-shadow:0 0 0 11px rgba(36,228,243,0)}}
.lulu-login-orb{position:absolute;border-radius:9999px;filter:blur(90px);pointer-events:none;will-change:transform}
.lulu-login-orb--violet{background:radial-gradient(circle,rgba(124,58,237,.42),transparent 70%);animation:luluFloat 9s ease-in-out infinite}
.lulu-login-orb--sky{background:radial-gradient(circle,rgba(14,165,233,.4),transparent 70%);animation:luluFloat 12s ease-in-out infinite reverse}
.lulu-login-orb--emerald{background:radial-gradient(circle,rgba(16,185,129,.34),transparent 70%);animation:luluFloat 11s ease-in-out infinite}
.lulu-login-fade-up{animation:luluFadeUp .8s cubic-bezier(.16,1,.3,1) both}
.lulu-login-fade-in{animation:luluFadeIn 1s ease both}
.lulu-login-d1{animation-delay:.06s}.lulu-login-d2{animation-delay:.14s}.lulu-login-d3{animation-delay:.22s}.lulu-login-d4{animation-delay:.3s}.lulu-login-d5{animation-delay:.38s}.lulu-login-d6{animation-delay:.46s}
.lulu-login-gradient-text{background:linear-gradient(100deg,#7c3aed,#2563eb 45%,#0ea5e9 70%,#10b981);background-size:200% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:luluGradient 9s ease infinite}
.lulu-login-live-dot{position:relative;display:inline-block;height:8px;width:8px;border-radius:9999px;background:#10b981}
.lulu-login-live-dot::after{content:"";position:absolute;inset:0;border-radius:9999px;background:#10b981;animation:luluPulse 1.8s ease-out infinite}
.lulu-login-bar{transform-origin:bottom;animation:luluGrow 1s cubic-bezier(.16,1,.3,1) both}
.lulu-login-glass{background:linear-gradient(180deg,rgba(255,255,255,.9),rgba(255,255,255,.74));backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
.lulu-login-entry-link{color:#fff!important}
.lulu-runtime-scan{animation:luluScan 5s linear infinite}
.lulu-runtime-signal{animation:luluSignal 2.6s ease-in-out infinite}
`;

const runtimeSteps = [
  { icon: Radar, label: 'Observe', text: 'Live signals across every connected system' },
  { icon: Network, label: 'Orchestrate', text: 'The smallest effective agent team is assembled' },
  { icon: Zap, label: 'Execute', text: 'Work is completed across the business' },
  { icon: ShieldCheck, label: 'Verify', text: 'Independent auditors validate every outcome' },
] as const;

export const LuluLoginPage = () => {
  const t = useTranslation();
  const language = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const currentLanguage = getLanguage(language);
  const [e, setE] = useState('');
  const [p, setP] = useState('');
  const [s, setS] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const operatingDomains = ['Online Presence', 'CRM', 'Social Media', 'Communication', 'Bookkeeping', 'Paid Ads'];
  const submit = async (x: React.FormEvent) => {
    x.preventDefault();
    if (loading) return;
    if (!e.trim() || !p) {
      setError(t('missingCredentials'));
      return;
    }
    setLoading(true);
    setError('');
    setErrorDetails('');
    setStatusMessage(t('Checking your account…'));
    setS(false);
    try {
      await requestWithTimeout({ path: '/auth/login', method: 'POST', body: { email: e, password: p } });
      setStatusMessage(t('Loading your profile…'));
      const meResp = await requestWithTimeout<{ id: string; email: string; firstName: string | null; lastName: string | null; role: string }>({ path: '/auth/me' });
      const currentUser = meResp.data;
      setStoredUser(currentUser);
      if (isAdminUser(currentUser)) {
        setS(true);
        setStatusMessage(t('Signed in as admin.'));
        navigateApp(getAdminLandingPath(routes.app.dashboard), { replace: true });
        return;
      }
      const pendingInvitation = getPendingInvitation();
      let invitedWorkspaceId: string | null = null;
      if (pendingInvitation) {
        setStatusMessage(t('Accepting your workspace invitation…'));
        const invitation = await requestWithTimeout<{ workspaceId: string }>({
          path: `/workspaces/invitations/${encodeURIComponent(pendingInvitation)}/accept`,
          method: 'POST',
        });
        invitedWorkspaceId = invitation.data.workspaceId;
        clearPendingInvitation();
      }
      setStatusMessage(t('Loading your workspace…'));
      const workspaces = await requestWithTimeout<{ items: Array<{ id: string; onboardingStep: string; onboardingCompletedAt: string | null }> }>({ path: '/workspaces' });
      const workspace = workspaces.data.items.find(item => item.id === invitedWorkspaceId) ?? workspaces.data.items[0];
      setS(true);
      setStatusMessage(t('Signed in successfully.'));
      if (workspace) {
        setSelectedWorkspaceId(workspace.id);
        navigateApp(workspace.onboardingCompletedAt ? routes.app.dashboard
          : workspace.onboardingStep === 'company_information' ? routes.onboarding.companyInformation
          : workspace.onboardingStep === 'billing' ? routes.onboarding.billing
          : workspace.onboardingStep === 'profile_completion' ? routes.app.profile
          : routes.app.knowledgeBase);
      } else {
        clearSelectedWorkspaceId();
        navigateApp(routes.onboarding.companyInformation);
      }
    } catch (cause) {
      setStatusMessage('');
      if (cause instanceof DOMException && cause.name === 'AbortError') {
        setError(t('The login request timed out. Please try again.'));
        setErrorDetails(t('Code: API_TIMEOUT · The server did not respond within 15 seconds.'));
      } else if (cause instanceof ApiError && cause.code === 'ACCOUNT_UNVERIFIED') setError(t('This account uses an outdated verification state. Please try signing in again after the latest deployment. Email OTP is no longer required for registration.'));
      else if (cause instanceof ApiError && cause.code === 'ACCOUNT_NOT_FOUND') setError(t('accountNotFound'));
      else if (cause instanceof ApiError && cause.code === 'INVALID_CREDENTIALS') setError(t('invalidCredentials'));
      else if (cause instanceof ApiError && cause.code === 'API_TIMEOUT') setError(t('timeout'));
      else setError(getFriendlyErrorMessage(cause, t('We could not sign you in. Please try again.')));
      if (!(cause instanceof DOMException && cause.name === 'AbortError')) setErrorDetails(getTechnicalErrorDetails(cause));
    } finally {
      setLoading(false);
    }
  };
  return <main data-deploy-rev="2026-09-10-agentic-landing-1" className="auth-shell relative min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="fixed right-4 top-4 z-30 w-fit" data-lulu-no-translate="true" translate="no">
        <button type="button" onClick={() => setLangOpen((v) => !v)} aria-haspopup="menu" aria-expanded={langOpen} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white">
          <Globe2 size={14} />
          <span>{currentLanguage.shortCode}</span>
          <ChevronDown size={13} className={`transition ${langOpen ? 'rotate-180' : ''}`} />
        </button>
        {langOpen && (
          <div role="menu" className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
            {languages.filter((option) => isAvailableLanguageCode(option.code)).map((option) => (
              <button key={option.code} type="button" role="menuitemradio" aria-checked={option.code === language} onClick={() => { switchLanguage(option.code); setLangOpen(false); }} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition hover:bg-slate-100 ${option.code === language ? 'font-semibold text-indigo-600' : 'text-slate-700'}`}>
                <span>{option.nativeName}</span>
                {option.code === language && <Check size={14} />}
              </button>
            ))}
          </div>
        )}
      </div>
      <style>{loginStyles}</style>
      <div className="auth-login-stage grid min-h-screen xl:grid-cols-[minmax(0,560px)_minmax(0,1fr)]">
        <section className="relative flex items-center justify-center overflow-hidden px-6 py-12 sm:px-8 lg:px-12">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="lulu-login-orb lulu-login-orb--violet -left-24 top-[-6rem] h-96 w-96" />
            <div className="lulu-login-orb lulu-login-orb--sky right-[-4rem] top-1/3 h-80 w-80" />
            <div className="lulu-login-orb lulu-login-orb--emerald -bottom-24 left-1/3 h-80 w-80" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.04)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
          </div>

          <div className="relative w-full max-w-md">
            <div className="lulu-login-fade-up flex items-center gap-2.5" data-lulu-no-translate="true" translate="no">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-500 font-bold text-white shadow-lg shadow-indigo-500/25">L</span>
              <b className="text-xl tracking-tight">Lulu AI</b>
            </div>

            <div className="lulu-login-fade-up lulu-login-d1 mt-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-white/70 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-indigo-700 shadow-sm">
                <Sparkles size={13} />
                {t('The autonomous operating system')}
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-.04em] leading-[1.05] text-[var(--foreground)] sm:text-5xl">
                {t('Your company does not need more software. It needs execution.')}
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-7 text-[var(--muted-foreground)]">
                {t('Connect once. Lulu runs the company — autonomously, continuously and inside clear boundaries.')}
              </p>
            </div>

            <form id="login-access" onSubmit={submit} className="lulu-login-fade-up lulu-login-d2 mt-8 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-transparent to-emerald-500/20 p-px shadow-2xl shadow-indigo-500/10" aria-label={t('Sign in form')}>
              <div className="lulu-login-glass rounded-3xl p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{t('signIn')}</p>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--muted-foreground)]">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    {t('Server-side by design')}
                  </span>
                </div>
                <div className="mt-5 space-y-4">
                  <Label htmlFor="login-email" className="block text-sm text-[var(--muted-foreground)]">
                    {t('email')}
                    <Input id="login-email" name="email" autoComplete="email" value={e} onChange={x => setE(x.target.value)} type="email" placeholder={t('you@company.com')} className="mt-1.5 h-12 w-full rounded-xl border-[var(--border)] bg-white/80 px-3.5 text-[15px] text-[var(--foreground)] focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-500/15" />
                  </Label>
                  <Label htmlFor="login-password" className="block text-sm text-[var(--muted-foreground)]">
                    {t('password')}
                    <div className="relative">
                      <Input id="login-password" name="password" autoComplete="current-password" value={p} onChange={x => setP(x.target.value)} type={show ? 'text' : 'password'} className="mt-1.5 h-12 w-full rounded-xl border-[var(--border)] bg-white/80 px-3.5 pr-11 text-[15px] text-[var(--foreground)] focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-500/15" />
                      <button type="button" onClick={() => setShow(!show)} aria-label={show ? t('Hide password') : t('Show password')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]">{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                    </div>
                  </Label>
                  <Button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
                    {loading ? <><LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> {t('signingIn')}</> : <>{t('signIn')} <ArrowRight size={16} /></>}
                  </Button>
                  {statusMessage && <p role="status" className="text-sm text-[var(--muted-foreground)]">{statusMessage}</p>}
                  {error && <div role="alert" className="space-y-1 text-sm text-[var(--destructive)]"><p>{error}</p>{errorDetails && <p className="break-words text-xs opacity-80">{errorDetails}</p>}</div>}
                  {s && <p className="flex items-center gap-2 text-sm text-[var(--chart-4)]"><Check size={15} /> {t('Signed in successfully.')}</p>}
                </div>
                <div className="mt-6 flex items-center justify-between text-sm">
                  <button type="button" onClick={() => navigateApp(routes.auth.forgotPassword)} className="font-medium text-[var(--foreground)] transition hover:opacity-70">{t('forgotPassword')}</button>
                  <button type="button" onClick={() => navigateApp(routes.auth.signUp)} className="font-medium text-indigo-600 transition hover:opacity-70">{t('createAccount')}</button>
                </div>
              </div>
            </form>

            <div className="lulu-login-fade-up lulu-login-d3 mt-6 grid grid-cols-2 divide-x divide-slate-200 rounded-2xl border border-slate-200/80 bg-white/60 py-3 text-center shadow-sm backdrop-blur">
              <div><b className="block text-sm text-slate-950">24/7</b><span className="text-[10px] uppercase tracking-wide text-slate-500">{t('Execution')}</span></div>
              <div><b className="block text-sm text-slate-950">0</b><span className="text-[10px] uppercase tracking-wide text-slate-500">{t('Routine approvals')}</span></div>
            </div>
          </div>
        </section>

        <aside className="relative hidden overflow-hidden bg-[#070914] text-white xl:flex xl:flex-col xl:justify-center">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="lulu-login-orb lulu-login-orb--violet -right-20 top-[-6rem] h-[28rem] w-[28rem]" />
            <div className="lulu-login-orb lulu-login-orb--sky -left-24 bottom-[-8rem] h-[26rem] w-[26rem]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-emerald-500/10" />
          </div>

          <div className="relative mx-auto w-full max-w-3xl px-12 py-16 2xl:px-16">
            <h2 className="lulu-login-fade-up lulu-login-d1 text-5xl font-semibold tracking-[-.05em] leading-[1.02] 2xl:text-6xl">
              {t('Connect once.')} <span className="lulu-login-gradient-text">{t('Lulu runs the company.')}</span>
            </h2>
            <p className="lulu-login-fade-up lulu-login-d2 mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              {t('Specialized AI agents understand the business, choose the right team, make decisions, execute the work and learn from every verified outcome.')}
            </p>

            <div className="lulu-login-fade-up lulu-login-d3 relative mt-9 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.055] p-6 shadow-2xl shadow-violet-950/50 backdrop-blur-xl">
              <div className="lulu-runtime-scan pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-transparent via-cyan-300/[.08] to-transparent" aria-hidden="true" />
              <div className="relative flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <span className="lulu-runtime-signal grid h-11 w-11 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10"><img src="/branding/lulu-agentic-mark.svg" alt="" className="h-7 w-7 object-contain" /></span>
                  <div><p className="text-sm font-semibold">{t('Lulu Agentic Runtime')}</p><p className="text-xs text-slate-400">{t('Continuous autonomous operation')}</p></div>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-emerald-200"><Activity size={12} />{t('Operating')}</span>
              </div>

              <div className="relative mt-5 rounded-2xl border border-violet-300/15 bg-gradient-to-br from-violet-400/10 via-white/[.035] to-cyan-300/[.08] p-5">
                <div className="flex items-start gap-3"><Target size={18} className="mt-0.5 shrink-0 text-cyan-300" /><div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-slate-400">{t('Permanent North Star')}</p><p className="mt-2 text-sm font-medium leading-6 text-white">{t('Build a trusted global brand at maximum sustainable speed — and become the number-one choice worldwide.')}</p></div></div>
              </div>

              <div className="relative mt-4 grid gap-2 sm:grid-cols-2">
                {runtimeSteps.map(({ icon: Icon, label, text }, index) => (
                  <div key={label} className="group rounded-2xl border border-white/[.08] bg-black/15 p-4 transition hover:border-cyan-300/25 hover:bg-white/[.07]">
                    <div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-cyan-200"><Icon size={14} /></span><span className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-300">0{index + 1} · {t(label)}</span></div>
                    <p className="mt-3 text-xs leading-5 text-slate-400">{t(text)}</p>
                  </div>
                ))}
              </div>

              <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-200"><ShieldCheck size={14} />{t('No human approval queue')}</div>
                <div className="flex items-center gap-2 text-xs text-slate-400"><Layers3 size={14} />{t('Budget is the only routine customer boundary')}</div>
              </div>
            </div>

            <div className="lulu-login-fade-up lulu-login-d5 mt-7">
              <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-slate-500">{t('One operating system across the entire company')}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {operatingDomains.map(name => <span key={name} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">{t(name)}</span>)}
              </div>
            </div>
          </div>
        </aside>
      </div>
      <div className="lulu-login-story">
        <LoginFeaturesLanding />
        <AgenticWorkforceLanding />
      </div>
    </main>;
};
