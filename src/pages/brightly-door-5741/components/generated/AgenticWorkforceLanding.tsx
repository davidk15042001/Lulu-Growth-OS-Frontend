import { useMemo } from 'react';
import { Bot, ChevronDown, Sparkles, Target, Trophy } from 'lucide-react';
import { useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';
import { luluVisibleNavigationAgentSections } from '../../../../config/lulu-agent-registry';

const competitors = [
  'Salesforce Agentforce',
  'Microsoft Copilot Studio',
  'HubSpot Agent Hub',
  'OpenAI Frontier',
  'Google Vertex AI Agent Builder',
  'Amazon Bedrock AgentCore',
  'Alibaba Cloud AgentRun',
  'ServiceNow AI Agents',
  'SAP Joule Agents',
  'Oracle AI Agent Studio',
];

const sectionDisplayLabels: Record<string, string> = {
  Statistiken: 'Intelligence & Analytics',
};

// The registry appends a shared competitive-suffix to most objectives. Strip it for
// the public landing page so each agent reads as a single, focused purpose.
const COMPETITIVE_SUFFIX = 'Compare against competitors and category leaders wherever relevant, close the highest-leverage gaps, and move the business toward becoming number one.';

function shortObjective(objective: string) {
  if (objective.endsWith(COMPETITIVE_SUFFIX)) {
    return objective.slice(0, -COMPETITIVE_SUFFIX.length).trim();
  }
  return objective;
}

export const AgenticWorkforceLanding = () => {
  const t = useTranslation();
  const totalAgents = useMemo(
    () => luluVisibleNavigationAgentSections.reduce((sum, section) => sum + section.pages.length, 0),
    [],
  );

  return (
    <section className="relative overflow-hidden border-t border-slate-200 bg-slate-50 text-slate-900" aria-labelledby="lulu-agentic-title">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-violet-200/50 blur-3xl" />
        <div className="absolute -left-32 bottom-40 h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        {/* Competitive positioning */}
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm">
              <Sparkles size={13} />
              {t('Fully agentic by design')}
            </div>
            <h2 id="lulu-agentic-title" className="mt-6 max-w-2xl text-3xl font-semibold tracking-[-.04em] text-slate-950 sm:text-4xl lg:text-5xl">
              {t('Lulu Growth OS is a fully agentic operating system powered by 131+ specialized AI agents.')}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {t('Users define their goals in natural language, while Lulu autonomously analyzes, plans, coordinates, and executes the work — without requiring technical or specialist experience.')}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-violet-700">{t('The ten most relevant global competitors')}</p>
            <ol className="mt-5 grid gap-2.5">
              {competitors.map((name, index) => (
                <li key={name} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700">{index + 1}</span>
                  <span className="text-sm font-medium text-slate-800">{name}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Differentiation */}
        <div className="mt-12 overflow-hidden rounded-3xl bg-[#0b1020] text-white shadow-2xl shadow-slate-300/50">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                <Target size={13} />
                {t('The space between the platforms')}
              </div>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl">
                {t("Most competitors provide agent-building infrastructure or agents tied to a CRM, cloud, or ERP ecosystem. Lulu's opportunity to dominate is the space between these platforms: a ready-to-use, ecosystem-independent AI workforce for SMEs that operates across the entire business.")}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <Trophy size={22} className="text-amber-300" />
              <p className="mt-4 max-w-xs text-base font-semibold leading-7 text-white">
                {t('Competitors give companies tools to build an AI workforce. Lulu is the AI workforce — moving autonomously from goal to decision to measurable execution.')}
              </p>
            </div>
          </div>
        </div>

        {/* Agents overview */}
        <div className="mt-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm">
              <Bot size={13} />
              {t('Meet the AI workforce')}
            </div>
            <h3 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {t('Specialized agents for every business function.')}
            </h3>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {t('Every agent owns a specific business function and moves autonomously from goal to decision to measurable execution.')}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-baseline gap-1 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">
              <span className="text-lg">{totalAgents}</span>
              <span>{t('agents')}</span>
            </span>
            <span className="text-sm text-slate-500">{t('across the whole business, grouped by function')}</span>
          </div>

          <div className="mt-8 grid gap-4">
            {luluVisibleNavigationAgentSections.map((section, sectionIndex) => {
              const label = sectionDisplayLabels[section.label] ?? section.label;
              return (
                <details key={section.label} open={sectionIndex === 0} className="group rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <h4 className="text-base font-semibold text-slate-950">{label}</h4>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">{section.pages.length}</span>
                    </div>
                    <ChevronDown size={18} className="text-slate-400 transition group-open:rotate-180" />
                  </summary>
                  <div className="grid gap-3 border-t border-slate-100 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                    {section.pages.map((agent) => (
                      <article key={agent.pageId} className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-violet-300 hover:bg-white">
                        <h5 className="text-sm font-semibold text-slate-950">{agent.agentName}</h5>
                        <p className="mt-1.5 text-[13px] leading-6 text-slate-600">{shortObjective(agent.objective)}</p>
                      </article>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgenticWorkforceLanding;
