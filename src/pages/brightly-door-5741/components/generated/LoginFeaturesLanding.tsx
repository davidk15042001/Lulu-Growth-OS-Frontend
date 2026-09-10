import {
  ArrowRight,
  BookOpenCheck,
  Bot,
  Check,
  CircleDollarSign,
  Globe2,
  Link2,
  MessageCircle,
  Radar,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingUp,
  WalletCards,
  Zap,
} from 'lucide-react';
import { useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';

const executionLoop = [
  { icon: Link2, index: '01', title: 'Connect', text: 'Link the online presence, CRM, social media, communication and bookkeeping systems once.' },
  { icon: Radar, index: '02', title: 'Understand', text: 'Lulu turns live business signals into one continuously updated operating context.' },
  { icon: Bot, index: '03', title: 'Assemble', text: 'The Executive Orchestrator selects the smallest effective team for the situation.' },
  { icon: Zap, index: '04', title: 'Execute', text: 'Specialists make decisions and complete authorized work directly in connected systems.' },
  { icon: RefreshCw, index: '05', title: 'Verify and learn', text: 'Independent auditors validate outcomes and performance improves future routing.' },
] as const;

const operatingDomains = [
  { icon: Globe2, title: 'Online Presence', text: 'Website, shop, SEO, GEO, AEO and conversion performance operate as one system.', wash: 'from-violet-500/15 to-indigo-500/5', iconClass: 'text-violet-700' },
  { icon: Sparkles, title: 'Content and Social', text: 'Content, organic distribution, social media and brand consistency compound continuously.', wash: 'from-fuchsia-500/15 to-violet-500/5', iconClass: 'text-fuchsia-700' },
  { icon: TrendingUp, title: 'CRM and Revenue', text: 'Opportunities, pipeline, follow-ups, sales activity and retention move forward automatically.', wash: 'from-sky-500/15 to-cyan-500/5', iconClass: 'text-sky-700' },
  { icon: MessageCircle, title: 'Communication and Support', text: 'Customer conversations, inquiries and service workflows stay responsive across channels.', wash: 'from-cyan-500/15 to-emerald-500/5', iconClass: 'text-cyan-700' },
  { icon: BookOpenCheck, title: 'Finance and Bookkeeping', text: 'Financial operations, reconciliation and bookkeeping remain accurate and continuously current.', wash: 'from-emerald-500/15 to-lime-500/5', iconClass: 'text-emerald-700' },
  { icon: CircleDollarSign, title: 'Paid Acquisition', text: 'Campaigns launch and optimize autonomously inside the settled prepaid ad-spend balance.', wash: 'from-amber-500/15 to-orange-500/5', iconClass: 'text-amber-700' },
] as const;

export const LoginFeaturesLanding = () => {
  const t = useTranslation();

  return (
    <>
      <section className="relative overflow-hidden bg-[#070914] text-white" aria-labelledby="lulu-execution-title">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-[-12rem] top-20 h-[34rem] w-[34rem] rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="absolute right-[-10rem] top-[26rem] h-[30rem] w-[30rem] rounded-full bg-cyan-400/15 blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-100">
              <Sparkles size={14} />
              {t('The end of software operation')}
            </div>
            <h2 id="lulu-execution-title" className="mt-7 text-5xl font-semibold leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-8xl">
              {t('Software gave companies tools.')}<br />
              <span className="bg-gradient-to-r from-violet-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent">{t('Lulu gives them execution.')}</span>
            </h2>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              {t('Lulu is not another copilot waiting for prompts. It is the autonomous execution layer that understands the business, decides what matters and gets the work done.')}
            </p>
          </div>

          <div className="mt-16 grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.045] backdrop-blur-xl lg:grid-cols-[.78fr_1.22fr]">
            <div className="flex flex-col justify-between border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-r">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.2em] text-violet-300">{t('One permanent mission')}</p>
                <div className="mt-5 flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-violet-300/20 bg-violet-300/10 text-violet-200"><Target size={22} /></span>
                  <p className="text-xl font-medium leading-8 text-white sm:text-2xl">{t('Build a trusted global brand at maximum sustainable speed — and become the number-one choice worldwide.')}</p>
                </div>
              </div>
              <div className="mt-10 border-t border-white/10 pt-6">
                <p className="text-sm leading-6 text-slate-400">{t('The customer provides business context and access. Lulu owns the continuous execution toward the North Star.')}</p>
              </div>
            </div>

            <div className="p-7 sm:p-10">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan-200">{t('The autonomous execution loop')}</p>
                <span className="inline-flex items-center gap-2 text-xs text-emerald-200"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />{t('Always running')}</span>
              </div>
              <div className="mt-7 grid gap-3">
                {executionLoop.map(({ icon: Icon, index, title, text }) => (
                  <article key={title} className="group grid gap-4 rounded-2xl border border-white/[.08] bg-black/15 p-4 transition hover:border-cyan-300/25 hover:bg-white/[.06] sm:grid-cols-[auto_1fr] sm:items-center">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/[.08] text-cyan-200"><Icon size={19} /></span>
                    <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">{index}</p><h3 className="mt-1 text-sm font-semibold text-white">{t(title)}</h3><p className="mt-1 text-xs leading-5 text-slate-400">{t(text)}</p></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-50 text-slate-950" aria-labelledby="lulu-company-title">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-violet-200/55 blur-3xl" />
          <div className="absolute -right-40 bottom-40 h-96 w-96 rounded-full bg-cyan-200/55 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_.55fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-violet-700">{t('One system. The entire company.')}</p>
              <h2 id="lulu-company-title" className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.04] tracking-[-.045em] sm:text-5xl lg:text-7xl">{t('Every business function moves toward the same outcome.')}</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-600 lg:pb-2">{t('No fragmented copilots. No manual handoffs. Lulu coordinates intelligence, growth, customer operations, finance and digital execution as one company-wide system.')}</p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {operatingDomains.map(({ icon: Icon, title, text, wash, iconClass }) => (
              <article key={title} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-100/70">
                <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${wash} opacity-80`} aria-hidden="true" />
                <div className="relative"><span className={`grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-sm ${iconClass}`}><Icon size={20} /></span><h3 className="mt-8 text-lg font-semibold tracking-tight">{t(title)}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{t(text)}</p></div>
              </article>
            ))}
          </div>

          <div className="mt-16 overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-700 via-indigo-700 to-slate-950 text-white shadow-2xl shadow-indigo-300/40">
            <div className="grid lg:grid-cols-[1fr_.9fr]">
              <div className="p-8 sm:p-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold"><ShieldCheck size={14} />{t('Autonomy without approval theater')}</div>
                <h3 className="mt-6 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">{t('Humans do not approve the work. They fund the boundary.')}</h3>
                <p className="mt-4 max-w-2xl text-base leading-7 text-indigo-100">{t('Routine decisions and actions run autonomously. Only new paid-media budget requires the customer to add funds. Once the balance is settled, Lulu starts and optimizes campaigns automatically.')}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/25 bg-emerald-200/10 px-4 py-2 text-sm font-semibold text-emerald-100"><Check size={15} />{t('Zero routine approvals')}</span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.07] px-4 py-2 text-sm font-semibold"><WalletCards size={15} />{t('Prepaid budget guard')}</span>
                </div>
              </div>
              <div className="border-t border-white/10 bg-black/20 p-8 sm:p-12 lg:border-l lg:border-t-0">
                <p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan-200">{t('Transparent paid-media funding')}</p>
                <div className="mt-7 grid grid-cols-3 items-center gap-2 text-center sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
                  <div className="rounded-2xl border border-white/10 bg-white/[.07] p-3 sm:p-4"><p className="whitespace-nowrap text-2xl font-semibold">100</p><p className="mt-1 text-[9px] uppercase tracking-wide text-slate-400 sm:text-[10px]">RMB {t('budget')}</p></div>
                  <ArrowRight size={16} className="hidden text-slate-500 sm:block" />
                  <div className="rounded-2xl border border-white/10 bg-white/[.07] p-3 sm:p-4"><p className="whitespace-nowrap text-2xl font-semibold">+4%</p><p className="mt-1 text-[9px] uppercase tracking-wide text-slate-400 sm:text-[10px]">{t('Lulu fee')}</p></div>
                  <ArrowRight size={16} className="hidden text-slate-500 sm:block" />
                  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 sm:p-4"><p className="whitespace-nowrap text-2xl font-semibold text-emerald-100">104</p><p className="mt-1 text-[9px] uppercase tracking-wide text-emerald-200 sm:text-[10px]">RMB {t('charged')}</p></div>
                </div>
                <p className="mt-5 text-sm leading-6 text-slate-300">{t('The full 100 RMB remains available for campaign spend. Card, Alipay and WeChat QR payments are supported.')}</p>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-y border-slate-200 py-8 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3"><ShoppingBag size={19} className="text-violet-700" /><p className="text-sm font-semibold">{t('One connection layer for the systems behind the business')}</p></div>
            <a href="#login-access" className="lulu-login-entry-link inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-700">{t('Enter Lulu')}<ArrowRight size={15} /></a>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginFeaturesLanding;
