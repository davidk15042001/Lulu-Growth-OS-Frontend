import { ArrowRight, BarChart3, Bot, Check, FileText, Globe2, Link2, LockKeyhole, Quote, Search, Settings2, Sparkles, Store, TrendingUp, Users, Workflow, Zap } from 'lucide-react';
import { useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';

const featureGroups = [
  {
    label: 'Intelligence',
    items: [
      { icon: Sparkles, title: 'AI business analysis', text: 'Analyze company information, products, customers and documents automatically after onboarding.' },
      { icon: BarChart3, title: 'Business intelligence', text: 'Turn verified business signals into structured insights, metrics, trends and reports.' },
      { icon: Zap, title: 'AI recommendations', text: 'Surface clear recommendations and next steps based on your real workspace context.' },
      { icon: Search, title: 'Analytics and statistics', text: 'Keep analytics, KPIs, charts and statistics connected to live sources instead of demo values.' },
    ],
  },
  {
    label: 'Growth and visibility',
    items: [
      { icon: Globe2, title: 'SEO, GEO and AEO', text: 'Improve visibility across traditional search, generative search and answer engines.' },
      { icon: FileText, title: 'Content suggestions', text: 'Create structured content ideas and metadata for marketing, SEO, GEO and AEO workflows.' },
      { icon: Users, title: 'Customer and product insights', text: 'Understand customers, products, segments, revenue signals and opportunities in one place.' },
      { icon: Workflow, title: 'Growth actions', text: 'Review suggested actions and manage approval and publishing permissions with control.' },
    ],
  },
  {
    label: 'Websites and integrations',
    items: [
      { icon: Globe2, title: 'Website generation', text: 'Generate page plans, content and SEO metadata for connected WordPress and Webflow workflows.' },
      { icon: Store, title: 'Shop and commerce workflows', text: 'Prepare connected commerce workflows for Shopify and other supported platforms.' },
      { icon: Link2, title: 'Business integrations', text: 'Connect supported CRM, analytics, marketing, website and commerce providers centrally.' },
      { icon: Settings2, title: 'Integration management', text: 'Add, review, reconnect and disconnect providers while keeping their live status visible.' },
    ],
  },
  {
    label: 'Workspace and security',
    items: [
      { icon: FileText, title: 'Business documents', text: 'Upload and preserve company documents as part of the persistent analysis context.' },
      { icon: Settings2, title: 'Workspace settings', text: 'Manage language, account, integrations, billing and workspace preferences.' },
      { icon: LockKeyhole, title: 'Server-side security', text: 'Keep provider credentials and API keys on the server and out of the browser.' },
      { icon: BarChart3, title: 'Billing and plans', text: 'Manage subscriptions, plan access, usage and billing status from one protected area.' },
    ],
  },
] as const;

const integrationNames = ['WordPress', 'Webflow', 'HubSpot', 'Google Analytics', 'Shopify', 'Salesforce', 'Pipedrive'];

const landingStats = [
  { icon: Bot, value: '131+', label: 'Autonomous AI agents' },
  { icon: TrendingUp, value: '10+', label: 'Business integrations' },
  { icon: Globe2, value: '3', label: 'Native languages' },
  { icon: LockKeyhole, value: '24/7', label: 'Server-side security' },
] as const;

export const LoginFeaturesLanding = () => {
  const t = useTranslation();
  return (
    <section className="relative overflow-hidden border-t border-slate-200 bg-slate-50 text-slate-900" aria-labelledby="lulu-platform-title">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-violet-200/60 blur-3xl" />
        <div className="absolute right-0 top-[42rem] h-96 w-96 rounded-full bg-sky-200/60 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_.98fr] lg:gap-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm"><Sparkles size={13} /> {t('Lulu AI platform')}</div>
            <h2 id="lulu-platform-title" className="mt-7 max-w-3xl text-4xl font-semibold tracking-[-.04em] sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">{t('Turn business signals into confident action.')}</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">{t('Lulu AI brings your business context, connected data and intelligent analysis together in one workspace.')}</p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-medium text-slate-700"><span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-2 shadow-sm"><Zap size={14} className="text-violet-600" /> {t('AI-first workspace')}</span><span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-2 shadow-sm"><LockKeyhole size={14} className="text-emerald-600" /> {t('Server-side by design')}</span></div>
            <div className="mt-10 flex items-center gap-4 text-sm text-slate-500"><span className="flex -space-x-2"><span data-lulu-no-translate="true" translate="no" className="grid h-8 w-8 place-items-center rounded-full border-2 border-slate-50 bg-violet-600 text-xs font-semibold text-white">AI</span><span data-lulu-no-translate="true" translate="no" className="grid h-8 w-8 place-items-center rounded-full border-2 border-slate-50 bg-sky-600 text-xs font-semibold text-white">BI</span><span data-lulu-no-translate="true" translate="no" className="grid h-8 w-8 place-items-center rounded-full border-2 border-slate-50 bg-emerald-600 text-xs font-semibold text-white">OS</span></span><span>{t('Connect your business context.')} · {t('Let AI structure and analyze it.')}</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:mx-0">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-violet-300/50 via-sky-200/60 to-transparent blur-2xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/60">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /></div><span className="text-[11px] font-medium text-slate-400">{t('Lulu Intelligence / Overview')}</span></div>
              <div className="grid gap-5 p-5 sm:grid-cols-[.8fr_1.2fr]">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center gap-2 text-xs font-medium text-slate-500"><span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-100 text-violet-700"><Sparkles size={14} /></span> {t('Intelligence score')}</div><p className="mt-5 text-4xl font-semibold text-slate-950">94</p><p className="mt-1 text-xs leading-5 text-slate-500">{t('Separate verified live metrics from hypotheses and unavailable data so decisions stay grounded.')}</p><div className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full w-[94%] rounded-full bg-gradient-to-r from-violet-500 to-sky-500" /></div></div>
                <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">{t('Business signals')}</span><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">{t('Live-ready')}</span></div><div className="mt-5 flex h-28 items-end gap-2">{[34,52,41,68,58,79,64,88,72,94].map((height, index) => <span key={index} className="flex-1 rounded-t bg-gradient-to-t from-violet-500 to-sky-400" style={{ height: `${height}%` }} />)}</div><div className="mt-4 flex items-center justify-between text-[11px] text-slate-400"><span>{t('Connected data')}</span><span>{t('Awaiting verified metrics')}</span></div></div>
              </div>
              <div className="mx-5 mb-5 rounded-xl border border-violet-100 bg-violet-50 p-4"><div className="flex items-start gap-3"><span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-100 text-violet-700"><Sparkles size={15} /></span><div><p className="text-sm font-semibold text-slate-900">{t('AI analysis context')}</p><p className="mt-1 text-xs leading-5 text-slate-600">{t('Build a structured business knowledge base from your company, products, customers and documents.')}</p></div></div></div>
            </div>
          </div>
        </div>

        <div className="mt-20 overflow-hidden rounded-3xl bg-[#0b1020] p-8 text-white shadow-2xl shadow-indigo-900/20 sm:p-12">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true" />
          <p className="text-center text-xs font-semibold uppercase tracking-[.2em] text-indigo-300">{t('The growth operating system')}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {landingStats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
                <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white"><Icon size={20} /></span>
                <p className="mt-4 text-4xl font-semibold tracking-tight">{value}</p>
                <p className="mt-1.5 text-sm text-slate-300">{t(label)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 border-y border-slate-200 py-7"><p className="text-center text-[11px] font-semibold uppercase tracking-[.2em] text-slate-400">{t('Built to connect the systems behind your business')}</p><div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-slate-500">{integrationNames.map((name) => <span key={name} className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-violet-500" />{name}</span>)}</div></div>

        <div className="mt-20"><div className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-violet-700">{t('Lulu AI platform')}</p><h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{t('Everything your growth workspace needs.')}</h3><p className="mt-4 text-base leading-7 text-slate-600">{t('All available functions, organized from intelligence and growth to websites, integrations, workspace controls and billing.')}</p></div><div className="mt-10 grid gap-10 md:grid-cols-2">{featureGroups.map((group) => <div key={group.label}><h4 className="mb-4 text-sm font-bold uppercase tracking-[.14em] text-slate-500">{t(group.label)}</h4><div className="grid gap-4">{group.items.map(({ icon: Icon, title, text }) => <article key={title} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700"><Icon size={19} /></span><h5 className="mt-5 text-base font-semibold text-slate-950">{t(title)}</h5><p className="mt-2 text-sm leading-6 text-slate-600">{t(text)}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-violet-700">{t('Learn more')} <ArrowRight size={13} /></span></article>)}</div></div>)}</div></div>

        <figure className="mt-20 overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <Quote size={36} className="text-violet-200" aria-hidden="true" />
          <blockquote className="mt-6 max-w-3xl text-2xl font-medium leading-9 tracking-tight text-slate-900 sm:text-3xl">
            {t('It feels like an entire growth team, running quietly in the background of our business.')}
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-sky-500 text-sm font-semibold text-white" data-lulu-no-translate="true" translate="no">GM</span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{t('Growth lead, scaling an agency')}</p>
              <p className="text-xs text-slate-500">{t('Using Lulu AI across CRM, SEO and billing')}</p>
            </div>
          </figcaption>
        </figure>

        <div className="mt-20 overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-r from-violet-100 via-sky-50 to-white p-8 shadow-sm sm:p-12"><div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]"><div><h3 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{t('Turn business signals into confident action.')}</h3><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{t('Lulu AI brings your business context, connected data and intelligent analysis together in one workspace.')}</p></div><div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-sm"><Check size={16} /> {t('Move forward with clearer actions.')}</div></div></div>
      </div>
    </section>
  );
};

export default LoginFeaturesLanding;
