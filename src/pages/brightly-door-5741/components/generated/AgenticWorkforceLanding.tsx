import { useMemo } from 'react';
import {
  Activity,
  ArrowRight,
  Bot,
  BrainCircuit,
  ChevronDown,
  Gauge,
  Network,
  Radar,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import { useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';
import { luluVisibleNavigationAgentSections } from '../../../../config/lulu-agent-registry';

const SYSTEM_AGENT_COUNT = 12;

const systemLayers = [
  { value: '1', title: 'Executive Orchestrator', text: 'Prioritizes opportunities, forms teams, delegates work and resolves conflicts.' },
  { value: '9', title: 'Domain Leads', text: 'Coordinate intelligence, brand, growth, content, revenue, finance, online presence, paid acquisition and localization.' },
  { value: '2', title: 'Independent Auditors', text: 'Security and outcome auditors can reject unsafe, unsupported or incomplete execution.' },
] as const;

const routingSignals = [
  'Connected systems',
  'Live business data',
  'Evidence freshness',
  'Recovery needs',
  'Verified performance',
  'Rotation pressure',
] as const;

const COMPETITIVE_SUFFIX = 'Compare against competitors and category leaders wherever relevant, close the highest-leverage gaps, and move the business toward becoming number one.';

function shortObjective(objective: string) {
  if (objective.endsWith(COMPETITIVE_SUFFIX)) return objective.slice(0, -COMPETITIVE_SUFFIX.length).trim();
  return objective;
}

export const AgenticWorkforceLanding = () => {
  const t = useTranslation();
  const sectionDisplayLabels: Record<string, string> = {
    AI: t('AI'),
    CRM: t('CRM'),
    Email: t('Communication'),
    Calendar: t('Calendar'),
    Marketing: t('Marketing and Social Media'),
    'Website & Commerce': t('Online Presence'),
    'Google Business': t('Reputation and Trust'),
    Finance: t('Finance and Bookkeeping'),
    Statistiken: t('Intelligence and Analytics'),
    Settings: t('Infrastructure and Controls'),
  };
  const totalSpecialists = useMemo(
    () => luluVisibleNavigationAgentSections.reduce((sum, section) => sum + section.pages.length, 0),
    [],
  );
  const totalAgents = totalSpecialists + SYSTEM_AGENT_COUNT;

  return (
    <section className="relative overflow-hidden bg-white text-slate-950" aria-labelledby="lulu-workforce-title">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-48 top-40 h-[34rem] w-[34rem] rounded-full bg-violet-100 blur-3xl" />
        <div className="absolute -left-48 top-[62rem] h-[30rem] w-[30rem] rounded-full bg-cyan-100 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_.46fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1.5 text-xs font-semibold text-violet-700">
              <Network size={14} />
              {t('The Lulu agent ecosystem')}
            </div>
            <h2 id="lulu-workforce-title" className="mt-7 max-w-5xl text-5xl font-semibold leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-8xl">
              <span className="bg-gradient-to-r from-violet-700 via-indigo-600 to-sky-500 bg-clip-text text-transparent">{totalAgents}</span> {t('registered agents. One coordinated company.')}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-slate-600 lg:pb-2">{t('Lulu does not unleash every agent at once. It selects the smallest team capable of creating the strongest verified outcome — then replaces weak paths automatically.')}</p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-4">
          {systemLayers.map(({ value, title, text }, index) => (
            <article key={title} className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
              <div className="flex items-center justify-between"><span className="text-4xl font-semibold tracking-tight text-slate-950">{value}</span><span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-violet-700 shadow-sm">{index === 0 ? <BrainCircuit size={19} /> : index === 1 ? <Network size={19} /> : <ShieldCheck size={19} />}</span></div>
              <h3 className="mt-6 text-base font-semibold">{t(title)}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t(text)}</p>
            </article>
          ))}
          <article className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-700 to-indigo-700 p-6 text-white shadow-xl shadow-violet-200/60">
            <div className="flex items-center justify-between"><span className="text-4xl font-semibold tracking-tight">{totalSpecialists}</span><span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-cyan-200"><Bot size={19} /></span></div>
            <h3 className="mt-6 text-base font-semibold">{t('Specialists')}</h3>
            <p className="mt-2 text-sm leading-6 text-violet-100">{t('Own focused capabilities across every operational area and execute bounded work in connected systems.')}</p>
          </article>
        </div>

        <div className="mt-20 overflow-hidden rounded-[2.25rem] bg-[#070914] text-white shadow-2xl shadow-slate-300/60">
          <div className="grid lg:grid-cols-[.8fr_1.2fr]">
            <div className="border-b border-white/10 p-8 sm:p-12 lg:border-b-0 lg:border-r">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100"><Activity size={14} />{t('Dynamic team formation')}</div>
              <h3 className="mt-6 text-3xl font-semibold tracking-[-.04em] sm:text-5xl">{t('Availability is scale. Selectivity is intelligence.')}</h3>
              <p className="mt-5 text-base leading-8 text-slate-300">{t('For every scheduled cycle, live event or recovery case, Lulu scores the full ecosystem and activates only the agents the business needs now.')}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {routingSignals.map((signal) => <span key={signal} className="rounded-full border border-white/10 bg-white/[.06] px-3 py-1.5 text-xs text-slate-300">{t(signal)}</span>)}
              </div>
            </div>

            <div className="relative overflow-hidden p-8 sm:p-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(124,58,237,.2),transparent_42%),radial-gradient(circle_at_20%_80%,rgba(36,228,243,.14),transparent_38%)]" aria-hidden="true" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4"><p className="text-xs font-semibold uppercase tracking-[.2em] text-slate-400">{t('Illustrative live selection')}</p><span className="inline-flex items-center gap-2 text-xs text-emerald-200"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />{t('Routing continuously')}</span></div>

                <div className="mt-7 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl border border-white/10 bg-white/[.05] p-4"><Radar size={18} className="mx-auto text-sky-300" /><p className="mt-2 text-xs font-semibold">{t('Signals')}</p><p className="mt-1 text-[10px] text-slate-500">{t('Observe')}</p></div>
                  <div className="rounded-2xl border border-violet-300/25 bg-violet-300/10 p-4"><BrainCircuit size={18} className="mx-auto text-violet-200" /><p className="mt-2 text-xs font-semibold">{t('Orchestrator')}</p><p className="mt-1 text-[10px] text-violet-300">{t('Decide')}</p></div>
                  <div className="rounded-2xl border border-white/10 bg-white/[.05] p-4"><Gauge size={18} className="mx-auto text-emerald-300" /><p className="mt-2 text-xs font-semibold">{t('Outcomes')}</p><p className="mt-1 text-[10px] text-slate-500">{t('Verify')}</p></div>
                </div>

                <div className="mx-auto h-8 w-px bg-gradient-to-b from-violet-300/70 to-cyan-300/20" />
                <div className="rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-violet-400/15 via-white/[.06] to-cyan-300/10 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-cyan-200">{t('Active autonomous team')}</p><p className="mt-1 text-xs text-slate-400">{t('Up to eight specialists plus required leads and auditors')}</p></div><Zap size={19} className="text-cyan-200" /></div>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {['Market Intelligence', 'Brand and Trust', 'Online Presence', 'Customer and Revenue', 'Content Distribution', 'Finance and Bookkeeping'].map((agent, index) => <div key={agent} className="flex items-center gap-2 rounded-xl border border-white/[.08] bg-black/15 px-3 py-2.5 text-xs text-slate-200"><span className={`h-2 w-2 rounded-full ${index < 4 ? 'bg-emerald-300' : 'bg-violet-300'}`} />{t(agent)}</div>)}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"><div className="flex items-center gap-2 text-xs text-slate-300"><RefreshCw size={14} className="text-violet-300" />{t('Every verified result improves the next team selection')}</div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-emerald-200">{t('Learning')}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1.5 text-xs font-semibold text-violet-700"><Bot size={14} />{t('Explore the specialist layer')}</div>
            <h3 className="mt-6 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">{t('Deep expertise, available on demand.')}</h3>
            <p className="mt-4 text-base leading-7 text-slate-600">{t('Every specialist has a defined purpose, capabilities, tools, triggers, permissions, KPIs, evaluation policy and recovery behavior.')}</p>
          </div>

          <div className="mt-10 grid gap-4">
            {luluVisibleNavigationAgentSections.map((section, sectionIndex) => {
              const label = sectionDisplayLabels[section.label] ?? section.label;
              return (
                <details key={section.label} open={sectionIndex === 0} className="group rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6 [&::-webkit-details-marker]:hidden">
                    <div className="flex items-center gap-3"><h4 className="text-base font-semibold text-slate-950">{label}</h4><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">{section.pages.length}</span></div>
                    <ChevronDown size={18} className="text-slate-400 transition group-open:rotate-180" />
                  </summary>
                  <div className="grid gap-3 border-t border-slate-100 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                    {section.pages.map((agent) => (
                      <article key={agent.pageId} className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-violet-300 hover:bg-white hover:shadow-md">
                        <h5 className="text-sm font-semibold text-slate-950">{t(agent.agentName)}</h5>
                        <p className="mt-1.5 text-[13px] leading-6 text-slate-600">{t(shortObjective(agent.objective))}</p>
                      </article>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </div>

        <div className="mt-24 overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 p-8 text-white shadow-2xl sm:p-12 lg:p-16">
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
            <div className="max-w-4xl"><div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-cyan-200"><Trophy size={15} />{t('Built for category leadership')}</div><h3 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-.045em] sm:text-6xl">{t('The company is no longer waiting for instructions.')}</h3><p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">{t('It is observing, deciding, executing and improving — continuously.')}</p></div>
            <a href="#login-access" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-cyan-100">{t('Connect once. Start operating.')}<ArrowRight size={16} /></a>
          </div>
        </div>

        <footer className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-slate-200 pt-8 text-xs text-slate-500 sm:flex-row">
          <div className="flex items-center gap-3" data-lulu-no-translate="true" translate="no"><img src="/branding/lulu-agentic-logo.svg" alt="Lulu" className="h-8 w-auto" /><span>© {new Date().getFullYear()}</span></div>
          <div className="flex items-center gap-2"><ShieldCheck size={14} />{t('Autonomous by design. Auditable by default.')}</div>
        </footer>
      </div>
    </section>
  );
};

export default AgenticWorkforceLanding;
