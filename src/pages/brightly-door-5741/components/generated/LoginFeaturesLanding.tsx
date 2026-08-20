import { ArrowRight, BarChart3, Check, Globe2, Link2, LockKeyhole, Sparkles, Workflow, Zap } from 'lucide-react';
import { useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';

const features = [
  { icon: Sparkles, title: 'AI business analysis', text: 'Build a structured business knowledge base from your company, products, customers and documents.' },
  { icon: BarChart3, title: 'Live intelligence', text: 'Separate verified live metrics from hypotheses and unavailable data so decisions stay grounded.' },
  { icon: Globe2, title: 'SEO, GEO and AEO', text: 'Create practical search, generative search and answer-engine foundations for your business.' },
  { icon: Workflow, title: 'Website generation', text: 'Generate website plans, content and metadata for connected WordPress and Webflow workflows.' },
  { icon: Link2, title: 'Connected workspace', text: 'Connect supported business platforms and keep their status visible in one central workspace.' },
  { icon: LockKeyhole, title: 'Secure by design', text: 'Keep provider keys server-side and show real data states without fabricated demo metrics.' },
] as const;

const integrationNames = ['WordPress', 'Webflow', 'HubSpot', 'Google Analytics', 'Shopify'];

export const LoginFeaturesLanding = () => {
  const t = useTranslation();
  return (
    <section className="relative overflow-hidden border-t border-[var(--border)] bg-[#0c0d12] text-white" aria-labelledby="lulu-platform-title">
      <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute right-0 top-[42rem] h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_.98fr] lg:gap-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-3 py-1.5 text-xs font-medium text-white/75"><Sparkles size={13} className="text-violet-300" /> {t('Lulu AI platform')}</div>
            <h2 id="lulu-platform-title" className="mt-7 max-w-2xl text-4xl font-semibold tracking-[-.04em] text-white sm:text-5xl lg:text-6xl">{t('Turn business signals into confident action.')}</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/60 sm:text-lg">{t('Lulu AI brings your business context, connected data and intelligent analysis together in one workspace.')}</p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/75"><span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-3 py-2"><Zap size={14} className="text-amber-300" /> {t('AI-first workspace')}</span><span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-3 py-2"><LockKeyhole size={14} className="text-emerald-300" /> {t('Server-side by design')}</span></div>
            <div className="mt-10 flex items-center gap-4 text-sm text-white/55"><span className="flex -space-x-2"><span data-lulu-no-translate="true" translate="no" className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#0c0d12] bg-violet-500 text-xs font-semibold">{t('AI')}</span><span data-lulu-no-translate="true" translate="no" className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#0c0d12] bg-blue-500 text-xs font-semibold">{t('BI')}</span><span data-lulu-no-translate="true" translate="no" className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#0c0d12] bg-emerald-500 text-xs font-semibold">{t('OS')}</span></span><span>{t('Connect your business context.')} · {t('Let AI structure and analyze it.')}</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:mx-0">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-violet-500/20 via-blue-500/10 to-transparent blur-2xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#15171f] shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></div><span className="text-[11px] text-white/35">{t('Lulu Intelligence / Overview')}</span></div>
              <div className="grid gap-5 p-5 sm:grid-cols-[.8fr_1.2fr]">
                <div className="rounded-xl border border-white/10 bg-white/[.04] p-4"><div className="flex items-center gap-2 text-xs text-white/50"><span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/20 text-violet-300"><Sparkles size={14} /></span> {t('Intelligence score')}</div><p className="mt-5 text-4xl font-semibold">—</p><p className="mt-1 text-xs text-white/40">{t('Separate verified live metrics from hypotheses and unavailable data so decisions stay grounded.')}</p><div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/5 rounded-full bg-gradient-to-r from-violet-400 to-blue-400" /></div></div>
                <div className="rounded-xl border border-white/10 bg-white/[.04] p-4"><div className="flex items-center justify-between"><span className="text-xs text-white/50">{t('Business signals')}</span><span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] text-emerald-300">{t('Live-ready')}</span></div><div className="mt-5 flex h-28 items-end gap-2">{[34,52,41,68,58,79,64,88,72,94].map((height, index) => <span key={index} className="flex-1 rounded-t bg-gradient-to-t from-violet-500/60 to-blue-400/80" style={{ height: `${height}%` }} />)}</div><div className="mt-4 flex items-center justify-between text-[11px] text-white/35"><span>{t('Connected data')}</span><span>{t('Awaiting verified metrics')}</span></div></div>
              </div>
              <div className="mx-5 mb-5 rounded-xl border border-white/10 bg-gradient-to-r from-violet-500/10 to-blue-500/10 p-4"><div className="flex items-start gap-3"><span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-400/15 text-violet-200"><Sparkles size={15} /></span><div><p className="text-sm font-medium text-white">{t('AI analysis context')}</p><p className="mt-1 text-xs leading-5 text-white/50">{t('Build a structured business knowledge base from your company, products, customers and documents.')}</p></div></div></div>
            </div>
          </div>
        </div>

        <div className="mt-24 border-y border-white/10 py-7"><p className="text-center text-[11px] font-semibold uppercase tracking-[.2em] text-white/35">{t('Built to connect the systems behind your business')}</p><div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-white/55">{integrationNames.map((name) => <span key={name} className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-violet-300/80" />{name}</span>)}</div></div>

        <div className="mt-24"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-violet-300">{t('Lulu AI platform')}</p><h3 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t('A clearer operating system for growth.')}</h3></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <article key={title} className="group rounded-2xl border border-white/10 bg-white/[.045] p-6 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[.07]"><span className={`grid h-11 w-11 place-items-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg`}><Icon size={20} /></span><h4 className="mt-6 text-base font-semibold text-white">{t(title)}</h4><p className="mt-3 text-sm leading-6 text-white/55">{t(text)}</p><span className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-white/40">{t('Move forward with clearer actions.')} <ArrowRight size={13} /></span></article>)}</div></div>

        <div className="mt-24 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-violet-600/25 via-blue-600/15 to-transparent p-8 sm:p-12"><div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]"><div><h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{t('Turn business signals into confident action.')}</h3><p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">{t('Lulu AI brings your business context, connected data and intelligent analysis together in one workspace.')}</p></div><div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white"><Check size={16} className="text-emerald-300" /> {t('Move forward with clearer actions.')}</div></div></div>
      </div>
    </section>
  );
};

export default LoginFeaturesLanding;
