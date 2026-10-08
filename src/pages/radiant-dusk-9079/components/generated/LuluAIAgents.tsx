import { useLiveRecords } from '../../../../api/useLiveRecords';
import type { WorkspaceRecord } from '../../../../api/records';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Activity, AlertTriangle, ArrowUpDown, ArrowUpRight, BarChart3, BookOpen, Brain, Check, CheckCircle, ChevronDown, ChevronRight, Clock3, DollarSign, FileEdit, Globe, Heart, HelpCircle, LayoutDashboard, LayoutTemplate, LineChart, MessageSquare, MessagesSquare, MoreHorizontal, Pause, PauseCircle, PenTool, Plus, Search, Settings, ShieldAlert, Sparkles, Store, Target, TrendingUp, Users, Wrench, X, Zap, Bot, Filter, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { agentApi, type AgentEcosystem, type AgentEcosystemDefinition } from '../../../../api/agents';
import { getFriendlyErrorMessage } from '../../../../api/client';
import { getSelectedWorkspaceId } from '../../../../api/session';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';
import { useLuluDialog } from '../../../../components/useLuluDialog';
import { AgentNativeWorkspace } from '../../../office/AgentNativeWorkspace';
interface Agent {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  iconBg: string;
  status: 'Active' | 'Paused' | 'Draft' | 'Needs Attention';
  type: 'Custom' | 'Template' | 'Marketplace';
  capabilities: string[];
  tools: number;
  sources: number;
  lastActive: string;
  tasks: number;
  performance: 'Healthy' | 'Needs Attention' | 'N/A';
}
const agents: Agent[] = [];
const navMain = [{
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  label: 'AI Insights Center',
  icon: LineChart
}, {
  label: 'Business Health',
  icon: Heart
}, {
  label: 'Growth Score',
  icon: TrendingUp
}, {
  label: 'KPI Explorer',
  icon: BarChart3
}];
const navPlatform: Array<Record<string, any>> = [];
const stats: Array<Record<string, any>> = [];
const chartBars: number[] = [];
const statusColor = (status: Agent['status']) => status === 'Active' ? 'var(--chart-4)' : status === 'Paused' ? 'var(--foreground)' : status === 'Draft' ? 'var(--primary)' : 'var(--foreground)';
type AgentHealthBucket = 'critical' | 'dangerous' | 'okay' | 'very_good';

type AgentHealthGroup = {
  id: AgentHealthBucket;
  label: string;
  description: string;
  badgeClassName: string;
  borderClassName: string;
  panelClassName: string;
};

const AGENT_HEALTH_GROUPS: AgentHealthGroup[] = [
  {
    id: 'critical',
    label: 'Kritisch',
    description: 'Diese Agenten brauchen sofort Aufmerksamkeit.',
    badgeClassName: 'bg-red-500/20 text-red-200 border-red-300/40',
    borderClassName: 'border-red-400/30',
    panelClassName: 'bg-red-950/20',
  },
  {
    id: 'dangerous',
    label: 'Gefaehrlich',
    description: 'Diese Agenten laufen nicht sauber oder wirken instabil.',
    badgeClassName: 'bg-orange-500/20 text-orange-100 border-orange-300/40',
    borderClassName: 'border-orange-400/30',
    panelClassName: 'bg-orange-950/20',
  },
  {
    id: 'okay',
    label: 'Okay',
    description: 'Diese Agenten sind vorhanden, aber noch nicht klar stark oder kritisch.',
    badgeClassName: 'bg-sky-500/14 text-sky-100 border-sky-300/30',
    borderClassName: 'border-border',
    panelClassName: 'bg-sky-950/10',
  },
  {
    id: 'very_good',
    label: 'Sehr gut',
    description: 'Diese Agenten wirken stabil und ohne erkennbare Warnsignale.',
    badgeClassName: 'bg-emerald-500/20 text-emerald-100 border-emerald-300/40',
    borderClassName: 'border-emerald-400/30',
    panelClassName: 'bg-emerald-950/20',
  },
];

function textValue(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

function agentInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'LU';
}

function agentTierLabel(tier: AgentEcosystemDefinition['tier']) {
  if (tier === 'executive') return 'Executive Orchestrator';
  if (tier === 'domain_lead') return 'Domain Leads';
  if (tier === 'auditor') return 'Independent Auditors';
  return 'Specialists';
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function lowerSignals(record: WorkspaceRecord) {
  return [
    record.status,
    record.stage,
    textValue(record.data?.health),
    textValue(record.data?.state),
    textValue(record.data?.severity),
    textValue(record.data?.runStatus),
    textValue(record.data?.syncStatus),
    textValue(record.data?.warning),
    textValue(record.data?.error),
    textValue(record.data?.summary),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function resolveAgentHealthBucket(record: WorkspaceRecord): AgentHealthBucket {
  const signals = lowerSignals(record);
  if (
    signals.includes('failed') ||
    signals.includes('error') ||
    signals.includes('critical') ||
    signals.includes('degraded') ||
    signals.includes('blocked') ||
    signals.includes('offline')
  ) {
    return 'critical';
  }
  if (
    signals.includes('danger') ||
    signals.includes('warning') ||
    signals.includes('running') ||
    signals.includes('queued') ||
    signals.includes('pending') ||
    signals.includes('review') ||
    signals.includes('paused') ||
    signals.includes('waiting')
  ) {
    return 'dangerous';
  }
  if (
    signals.includes('completed') ||
    signals.includes('healthy') ||
    signals.includes('active') ||
    signals.includes('ready') ||
    signals.includes('stable') ||
    signals.includes('success')
  ) {
    return 'very_good';
  }
  return 'okay';
}

function severityScore(record: WorkspaceRecord, bucket: AgentHealthBucket) {
  const signals = lowerSignals(record);
  let score = bucket === 'critical' ? 100 : bucket === 'dangerous' ? 70 : bucket === 'okay' ? 40 : 10;

  const weightedSignals: Array<[string, number]> = [
    ['failed', 40],
    ['error', 32],
    ['critical', 30],
    ['degraded', 28],
    ['blocked', 28],
    ['offline', 26],
    ['warning', 18],
    ['danger', 18],
    ['review', 12],
    ['paused', 10],
    ['waiting', 8],
    ['queued', 7],
    ['pending', 6],
    ['running', 5],
    ['healthy', -12],
    ['completed', -14],
    ['active', -10],
    ['ready', -12],
    ['stable', -16],
    ['success', -18],
  ];

  for (const [keyword, weight] of weightedSignals) {
    if (signals.includes(keyword)) score += weight;
  }

  const tasks = Number(textValue(record.data?.tasks) || 0);
  if (Number.isFinite(tasks) && tasks > 0) {
    score += Math.min(tasks, 20);
  }

  return score;
}

function simpleFeedback(record: WorkspaceRecord, bucket: AgentHealthBucket) {
  const status = textValue(record.status) || 'Unbekannt';
  if (bucket === 'critical') {
    return `Sofort pruefen: Dieser Agent ist aktuell ${status.toLowerCase()} und braucht direkte Aufmerksamkeit.`;
  }
  if (bucket === 'dangerous') {
    return `Bitte beobachten: Dieser Agent ist aktuell ${status.toLowerCase()} und noch nicht stabil abgeschlossen.`;
  }
  if (bucket === 'very_good') {
    return `Laeuft gut: Dieser Agent ist aktuell ${status.toLowerCase()} und zeigt keine offensichtlichen Warnsignale.`;
  }
  return `Grundsaetzlich okay: Dieser Agent ist aktuell ${status.toLowerCase()}, aber die Lage ist noch nicht eindeutig positiv oder kritisch.`;
}

function sortBySeverity(items: WorkspaceRecord[]) {
  return [...items].sort((left, right) => {
    const leftBucket = resolveAgentHealthBucket(left);
    const rightBucket = resolveAgentHealthBucket(right);
    const leftSeverity = severityScore(left, leftBucket);
    const rightSeverity = severityScore(right, rightBucket);
    if (rightSeverity !== leftSeverity) return rightSeverity - leftSeverity;
    const leftTime = new Date(left.updatedAt).getTime();
    const rightTime = new Date(right.updatedAt).getTime();
    return rightTime - leftTime;
  });
}

export const LuluAIAgents = () => {
  const workspaceId = getSelectedWorkspaceId();
  const { hasCapability } = useLuluApp();
  const t = useTranslation();
  const [ecosystem, setEcosystem] = useState<AgentEcosystem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AgentEcosystemDefinition | null>(null);
  const agentDialogRef = useLuluDialog<HTMLElement>({ open: Boolean(selectedAgent), onClose: () => setSelectedAgent(null) });

  useEffect(() => {
    let mounted = true;
    if (!workspaceId) {
      setError('Kein Workspace ausgewählt.');
      setLoading(false);
      return () => { mounted = false; };
    }
    void agentApi.ecosystem(workspaceId)
      .then((response) => {
        if (!mounted) return;
        setEcosystem(response.data);
        setError('');
      })
      .catch((cause) => {
        if (mounted) setError(getFriendlyErrorMessage(cause, 'Das Agenten-Ökosystem konnte nicht geladen werden.'));
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [workspaceId]);

  const activeIds = useMemo(() => new Set(ecosystem?.activeTeam.map((agent) => agent.id) ?? []), [ecosystem]);
  const filteredDefinitions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const definitions = ecosystem?.definitions ?? [];
    if (!needle) return definitions;
    return definitions.filter((agent) => `${agent.name} ${agent.domain} ${agent.module} ${agent.purpose}`.toLowerCase().includes(needle));
  }, [ecosystem, query]);
  const openAgent = (agentId: string) => {
    const definition = ecosystem?.definitions.find((candidate) => candidate.id === agentId);
    if (definition) setSelectedAgent(definition);
  };
  const tiers = [
    { id: 'executive', label: 'Executive Orchestrator' },
    { id: 'domain_lead', label: 'Domain Leads' },
    { id: 'auditor', label: 'Independent Auditors' },
    { id: 'specialist', label: 'Specialists' },
  ] as const;

  return <div className="lulu-shell">
    <aside className="lulu-sidebar" aria-label="Primary navigation"><div className="lulu-logo"><span className="sparkle">✦</span><span>Lulu AI</span></div><LuluSectionNavigation activeId="radiant-dusk-9079" /></aside>
    <main className="lulu-main">
      <header className="page-header">
        <div className="breadcrumb"><span>{t("AI Platform")}</span><ChevronRight size={13} /><strong>{t("Agent Ecosystem")}</strong></div>
        <div className="title-row"><div><h1>{t("Agent Ecosystem")}</h1><p>{t("Lulu stellt für jede Situation automatisch das kleinste wirksame Team zusammen.")}</p></div><span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" />{t("Fully agentic")}</span></div>
      </header>
      {loading ? <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">{t("Agenten-Ökosystem wird geladen …")}</div> : error ? <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-destructive">{error}</div> : ecosystem ? <section className="content-section space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">{t("Registered Agents")}</p><p className="mt-2 text-3xl font-semibold">{ecosystem.summary.registeredAgents}</p><p className="mt-1 text-xs text-muted-foreground">{ecosystem.summary.pageSpecialists} {t("specialists +")} {ecosystem.summary.systemAgents} {t("system agents")}</p></div>
          <div className="rounded-2xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">{t("Current Team")}</p><p className="mt-2 text-3xl font-semibold">{ecosystem.summary.activeTeamSize}</p><p className="mt-1 text-xs text-muted-foreground">{ecosystem.summary.activeSpecialists} {t("dynamically selected specialists")}</p></div>
          <div className="rounded-2xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">{t("Connected Systems")}</p><p className="mt-2 text-3xl font-semibold">{ecosystem.summary.connectedPlatformCount}</p><p className="mt-1 text-xs text-muted-foreground">{ecosystem.summary.liveResourceTypeCount} {t("live data domains")}</p></div>
          <div className="rounded-2xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">{t("Human Approvals")}</p><p className="mt-2 text-2xl font-semibold">{ecosystem.autonomy.routineHumanApproval ? t("Approval required") : t("Fully agentic")}</p><p className="mt-1 text-xs text-muted-foreground">{t("Only new ad-spend funding is customer controlled")}</p></div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"><Target size={15} />{t("Permanent North Star")}</div><p className="mt-3 max-w-4xl text-base font-medium leading-7 text-foreground">{ecosystem.northStar}</p></div>
        <div className="rounded-2xl border border-border bg-card p-5"><div className="section-heading"><h2>{t("Active autonomous team")}</h2><span>{ecosystem.activeTeam.length} {t("selected now")}</span></div><div className="mt-4 grid gap-3 md:grid-cols-2">{ecosystem.activeTeam.map((agent) => <button type="button" key={agent.id} onClick={() => openAgent(agent.id)} className="group rounded-xl border border-border bg-background/85 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-foreground">{agent.name}</h3><p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{t(agentTierLabel(agent.tier))} · {agent.domain}</p></div><span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">{t("Active")} <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span></div><p className="mt-3 text-sm leading-6 text-muted-foreground">{agent.purpose}</p><p className="mt-3 text-xs text-muted-foreground">{t("Selected because:")} {agent.selectionReasons.join(' · ')}</p></button>)}</div></div>
        <div className="relative"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("Search all agents …")} aria-label={t("Search all agents …")} className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring" /></div>
        {tiers.map((tier) => {
          const members = filteredDefinitions.filter((agent) => agent.tier === tier.id);
          if (!members.length) return null;
          return <details key={tier.id} open={tier.id !== 'specialist'} className="rounded-2xl border border-border bg-card p-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold [&::-webkit-details-marker]:hidden"><span>{t(tier.label)}</span><span className="text-xs font-normal text-muted-foreground">{members.length} {t("agents")}</span></summary><div className="mt-4 grid gap-2 md:grid-cols-2">{members.map((agent) => <button type="button" key={agent.id} onClick={() => openAgent(agent.id)} className="group rounded-xl border border-border bg-background/70 p-3 text-left transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-semibold">{agent.name}</p><span className="inline-flex items-center gap-2"><span className={`h-2.5 w-2.5 shrink-0 rounded-full ${activeIds.has(agent.id) ? 'bg-emerald-500' : 'bg-muted-foreground/25'}`} title={activeIds.has(agent.id) ? t('Selected for the current team') : t('Available on demand')} /><ArrowUpRight size={14} className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span></div><p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{agent.purpose}</p><div className="mt-2 flex flex-wrap gap-1">{agent.capabilities.slice(0, 3).map((capability) => <span key={capability} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">{capability.replaceAll('_', ' ')}</span>)}</div><span className="mt-3 block text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">{t("Open native workspace")}</span></button>)}</div></details>;
        })}
      </section> : null}
    </main>
    {selectedAgent ? createPortal(<div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/75 p-3 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedAgent(null); }}><section ref={agentDialogRef} role="dialog" aria-modal="true" aria-labelledby="agent-ecosystem-dialog-title" className="flex max-h-[calc(100dvh-24px)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl"><header className="flex items-start gap-4 border-b border-slate-800 px-5 py-4 sm:px-7"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-violet-400/30 bg-violet-400/10 text-sm font-bold text-violet-200">{agentInitials(selectedAgent.name)}</div><div className="min-w-0 flex-1"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">{t("Native agent workspace")}</span><h2 id="agent-ecosystem-dialog-title" className="mt-1 truncate text-xl font-semibold tracking-tight">{selectedAgent.name}</h2><p className="mt-1 text-xs text-slate-400">{selectedAgent.tier.replaceAll('_', ' ')} · {selectedAgent.domain} · {activeIds.has(selectedAgent.id) ? t('Selected for the current team') : t('Available on demand')}</p></div><button type="button" onClick={() => setSelectedAgent(null)} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-700 text-slate-400 transition hover:border-slate-500 hover:text-white" aria-label={t("Close agent workspace")}><X size={17} /></button></header><div className="min-h-0 overflow-y-auto p-4 sm:p-6"><AgentNativeWorkspace workspaceId={workspaceId ?? ''} catalogAgent={selectedAgent} canManageOmnichannel={hasCapability("omnichannel.manage")} canReplyOmnichannel={hasCapability("omnichannel.reply")} /></div></section></div>, document.body) : null}
  </div>;
};
const luluDropdownNavigation = [{
  "label": "Dashboard",
  "pages": [{
    "id": "fancily-leaf-1766",
    "label": "Executive Dashboard"
  }]
}, {
  "label": "AI",
  "pages": [{
    "id": "fresh-moon-5374",
    "label": "Assistant"
  }, {
    "id": "radiant-dusk-9079",
    "label": "Agents"
  }, {
    "id": "calmly-park-3313",
    "label": "Agent Marketplace"
  }, {
    "id": "rich-field-1880",
    "label": "Knowledge"
  }, {
    "id": "wondrously-second-5656",
    "label": "Actions"
  }, {
    "id": "sunny-moon-6307",
    "label": "Conversations"
  }, {
    "id": "sparkling-cave-8456",
    "label": "Activity"
  }]
}, {
  "label": "CRM",
  "pages": [{
    "id": "bright-meadow-7537",
    "label": "Overview"
  }, {
    "id": "sturdy-month-1562",
    "label": "Contacts"
  }, {
    "id": "kindly-pool-8785",
    "label": "Companies"
  }, {
    "id": "swift-hour-7844",
    "label": "Leads"
  }, {
    "id": "smartly-shade-4619",
    "label": "Deals"
  }, {
    "id": "calmly-cloud-9988",
    "label": "Pipeline"
  }, {
    "id": "cosmic-pool-1616",
    "label": "Activities"
  }, {
    "id": "deeply-noon-9539",
    "label": "Tasks"
  }, {
    "id": "sunnily-gulf-7520",
    "label": "Customer Segments"
  }, {
    "id": "gracefully-storm-2649",
    "label": "Customer Intelligence"
  }]
}, {
  "label": "Marketing",
  "pages": [{
    "id": "dreamily-soil-9290",
    "label": "Campaigns"
  }, {
    "id": "wondrous-cloud-1355",
    "label": "Content"
  }, {
    "id": "sparklingly-home-7386",
    "label": "Strategy"
  }, {
    "id": "gently-shade-2476",
    "label": "Campaigns"
  }, {
    "id": "kind-time-4492",
    "label": "Keywords"
  }, {
    "id": "smartly-shore-1468",
    "label": "Competitors"
  }, {
    "id": "breezily-wood-5980",
    "label": "Audiences"
  }, {
    "id": "breezy-shore-6734",
    "label": "Analytics"
  }]
}, {
  "label": "Advertising",
  "pages": [{
    "id": "finely-garden-9221",
    "label": "Overview"
  }, {
    "id": "friendly-path-8200",
    "label": "Analytics"
  }, {
    "id": "wise-brook-1762",
    "label": "Campaigns"
  }, {
    "id": "softly-second-7684",
    "label": "Audiences"
  }, {
    "id": "happily-storm-2690",
    "label": "Creatives"
  }, {
    "id": "sunny-minute-1092",
    "label": "Budgets"
  }, {
    "id": "zesty-grass-9196",
    "label": "AI Optimization"
  }, {
    "id": "nicely-shade-2637",
    "label": "Tracking & Attribution"
  }, {
    "id": "nice-moon-2056",
    "label": "AI Campaign & Ad Builder"
  }, {
    "id": "sunnily-peak-7188",
    "label": "Autonomous Publishing Center"
  }, {
    "id": "solid-sand-5563",
    "label": "AI Experiments & A/B Testing"
  }, {
    "id": "sunny-summer-2293",
    "label": "Ad Accounts & Platform Management"
  }]
}, {
  "label": "Intelligence",
  "pages": [{
    "id": "serene-cloud-7079",
    "label": "Intelligence Overview"
  }, {
    "id": "tender-water-4095",
    "label": "Executive Overview"
  }, {
    "id": "swiftly-cliff-4166",
    "label": "Business Health"
  }, {
    "id": "sharp-current-9677",
    "label": "Growth"
  }, {
    "id": "proudly-river-8017",
    "label": "Revenue"
  }, {
    "id": "dreamily-shade-6192",
    "label": "Customers"
  }, {
    "id": "nicely-hour-4035",
    "label": "Sales"
  }, {
    "id": "eagerly-winter-3152",
    "label": "Marketing"
  }, {
    "id": "sharply-wood-4560",
    "label": "Advertising Intelligence"
  }, {
    "id": "bold-ocean-5847",
    "label": "Ecommerce Intelligence"
  }, {
    "id": "cozily-path-5612",
    "label": "Finance Intelligence"
  }, {
    "id": "gently-light-6089",
    "label": "Operations Intelligence"
  }, {
    "id": "cool-town-1727",
    "label": "Products Intelligence"
  }, {
    "id": "swift-pool-5077",
    "label": "KPI Explorer"
  }, {
    "id": "friendly-ground-4157",
    "label": "Reports"
  }, {
    "id": "brave-stream-5322",
    "label": "Comparisons"
  }, {
    "id": "sparkling-time-5280",
    "label": "Comparisons"
  }, {
    "id": "wispy-current-7490",
    "label": "Forecasts"
  }, {
    "id": "kindly-year-8981",
    "label": "Benchmarks"
  }, {
    "id": "serenely-creek-1765",
    "label": "Trends"
  }, {
    "id": "sparklingly-light-7230",
    "label": "Anomalies"
  }, {
    "id": "clever-soil-5964",
    "label": "Attribution"
  }, {
    "id": "serenely-week-1771",
    "label": "AI Insights"
  }, {
    "id": "daring-home-4179",
    "label": "AI Recommendations"
  }, {
    "id": "wispy-leaf-3778",
    "label": "AI Tasks"
  }, {
    "id": "happily-brook-7061",
    "label": "Opportunities"
  }, {
    "id": "radiant-cave-9340",
    "label": "Decisions"
  }, {
    "id": "boldly-time-5189",
    "label": "Risk Center"
  }, {
    "id": "proud-rain-4772",
    "label": "Activity Timeline"
  }]
}, {
  "label": "Finance",
  "pages": [{
    "id": "quietly-stone-4158",
    "label": "Overview"
  }, {
    "id": "breezy-soil-2475",
    "label": "Invoices"
  }, {
    "id": "tender-creek-3139",
    "label": "Offers & Quotes"
  }, {
    "id": "cool-rain-6499",
    "label": "Income"
  }, {
    "id": "richly-land-8084",
    "label": "Transactions"
  }, {
    "id": "calm-tide-3752",
    "label": "Payments"
  }, {
    "id": "zesty-earth-3938",
    "label": "Expenses"
  }, {
    "id": "bravely-bay-4544",
    "label": "Customers"
  }, {
    "id": "eager-minute-1586",
    "label": "Vendors"
  }, {
    "id": "fair-bridge-8618",
    "label": "Accounts"
  }, {
    "id": "soft-town-3284",
    "label": "Cash Flow"
  }, {
    "id": "wisely-gate-3183",
    "label": "Budgets"
  }, {
    "id": "sharp-morning-7310",
    "label": "Financial Planning"
  }, {
    "id": "sparklingly-city-3338",
    "label": "Reconciliation"
  }, {
    "id": "radiant-hour-5376",
    "label": "Recurring Revenue"
  }, {
    "id": "lucky-park-8649",
    "label": "Payouts"
  }, {
    "id": "vibrantly-second-9428",
    "label": "Financial Automation"
  }, {
    "id": "sturdy-week-3372",
    "label": "Taxes"
  }, {
    "id": "boldly-field-4971",
    "label": "Finance Settings"
  }]
}, {
  "label": "Sales",
  "pages": [{
    "id": "fine-park-8079",
    "label": "Overview"
  }, {
    "id": "softly-autumn-9038",
    "label": "Leads"
  }, {
    "id": "wildly-sun-6424",
    "label": "Opportunities"
  }, {
    "id": "deeply-month-1392",
    "label": "Deals"
  }, {
    "id": "sweet-evening-7753",
    "label": "Pipeline"
  }, {
    "id": "warmly-road-3804",
    "label": "Activities"
  }, {
    "id": "wondrously-gate-2200",
    "label": "Tasks"
  }, {
    "id": "sharp-cliff-6925",
    "label": "Customer Segments"
  }, {
    "id": "lovingly-shore-4782",
    "label": "Forecast"
  }, {
    "id": "rich-moon-9195",
    "label": "Reports"
  }, {
    "id": "lively-house-6788",
    "label": "Commissions"
  }, {
    "id": "gentle-cliff-7133",
    "label": "Goals"
  }, {
    "id": "kindly-morning-7115",
    "label": "Territories"
  }, {
    "id": "friendly-tower-1528",
    "label": "Lead Assignment"
  }]
}, {
  "label": "Website & Commerce",
  "pages": [{
    "id": "lulu-website-portal-9012",
    "label": "Website"
  }, {
    "id": "website-wordpress-jetpack-9013",
    "label": "WordPress / Jetpack"
  }, {
    "id": "website-webflow-9014",
    "label": "Webflow"
  }, {
    "id": "website-pages-cms-9015",
    "label": "Pages & CMS"
  }, {
    "id": "website-posts-9016",
    "label": "Posts"
  }, {
    "id": "website-media-assets-9017",
    "label": "Media & Assets"
  }, {
    "id": "website-domains-9018",
    "label": "Domains"
  }, {
    "id": "sparklingly-moon-5114",
    "label": "SEO"
  }, {
    "id": "zealously-path-4224",
    "label": "GEO"
  }, {
    "id": "sunny-house-9595",
    "label": "AEO"
  }, {
    "id": "daring-brook-9034",
    "label": "Reviews"
  }, {
    "id": "smart-ocean-3898",
    "label": "Overview"
  }, {
    "id": "nice-year-6253",
    "label": "Stores"
  }, {
    "id": "nicely-ocean-1051",
    "label": "Products"
  }, {
    "id": "richly-forest-5832",
    "label": "Categories"
  }, {
    "id": "mightily-shore-7108",
    "label": "Orders"
  }, {
    "id": "fancy-ground-8040",
    "label": "Customers"
  }, {
    "id": "serenely-sand-9226",
    "label": "Carts"
  }, {
    "id": "smart-village-1099",
    "label": "Inventory"
  }, {
    "id": "dreamy-shade-5445",
    "label": "Returns & Refunds"
  }, {
    "id": "sharply-sky-4161",
    "label": "Discounts & Promotions"
  }, {
    "id": "wildly-time-4260",
    "label": "Carts & Abandoned Carts"
  }, {
    "id": "quietly-moon-4186",
    "label": "Shipping"
  }, {
    "id": "merry-castle-3260",
    "label": "Payments"
  }, {
    "id": "merry-cliff-8846",
    "label": "Coupons"
  }, {
    "id": "safely-dawn-7731",
    "label": "Subscriptions"
  }, {
    "id": "purely-dusk-2409",
    "label": "Shipping & Fulfillment"
  }, {
    "id": "soft-hill-4757",
    "label": "Taxes"
  }, {
    "id": "safely-air-9334",
    "label": "Collections"
  }, {
    "id": "merry-land-6169",
    "label": "Store Performance"
  }]
}, {
  "label": "Settings",
  "pages": [{
    "id": "nicely-land-1864",
    "label": "Settings"
  }, {
    "id": "glad-coast-1428",
    "label": "Integrations"
  }, {
    "id": "pure-minute-5446",
    "label": "Billing"
  }]
}] as const;
function LuluSectionNavigation({
  activeId
}: {
  activeId: string;
}) {
  return <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1" aria-label="Lulu AI sections">
    {luluDropdownNavigation.map(section => ({ ...section, pages: section.pages.filter(page => page.id !== "website-wordpress-jetpack-9013" && page.id !== "website-webflow-9014") })).map(section => {
      const isActiveSection = section.pages.some(page => page.id === activeId);
      return <details key={section.label} open={isActiveSection} className="group rounded-lg">
        <summary className={`flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2.5 text-sm transition [&::-webkit-details-marker]:hidden ${isActiveSection ? 'bg-secondary/15 font-medium text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
          <span data-lulu-section-soon={section.label !== "Website & Commerce" && section.label !== "Settings" ? "true" : undefined}>{section.label}</span>
          <span aria-hidden="true" className="text-xs transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <div className="ml-3 mt-1 space-y-0.5 border-l border-border pl-2 pb-1">
          {section.pages.map(page => {
            const isActivePage = page.id === activeId;
            return <a key={page.id} {...pageLinkProps(page.id)} aria-current={isActivePage ? 'page' : undefined} className={`block rounded-md px-3 py-2 text-xs transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {page.label}
              {!pageLinkProps(page.id)["data-lulu-soon"] ? null : null}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}
import { pageLinkProps } from '../../../../routing';
