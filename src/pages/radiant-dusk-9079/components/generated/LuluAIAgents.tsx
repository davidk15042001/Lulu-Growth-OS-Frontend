import { useLiveRecords } from '../../../../api/useLiveRecords';
import type { WorkspaceRecord } from '../../../../api/records';
import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, ArrowUpDown, BarChart3, BookOpen, Brain, Check, CheckCircle, ChevronDown, ChevronRight, Clock3, DollarSign, FileEdit, Globe, Heart, HelpCircle, LayoutDashboard, LayoutTemplate, LineChart, MessageSquare, MessagesSquare, MoreHorizontal, Pause, PauseCircle, PenTool, Plus, Search, Settings, ShieldAlert, Sparkles, Store, Target, TrendingUp, Users, Wrench, X, Zap, Bot, Filter, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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
  const { items, loading, error } = useLiveRecords('ai_agents');
  const groupedAgents = useMemo(() => {
    const grouped = {
      critical: [] as WorkspaceRecord[],
      dangerous: [] as WorkspaceRecord[],
      okay: [] as WorkspaceRecord[],
      very_good: [] as WorkspaceRecord[],
    };
    for (const record of items) {
      grouped[resolveAgentHealthBucket(record)].push(record);
    }
    return {
      critical: sortBySeverity(grouped.critical),
      dangerous: sortBySeverity(grouped.dangerous),
      okay: sortBySeverity(grouped.okay),
      very_good: sortBySeverity(grouped.very_good),
    };
  }, [items]);

  return <div className="lulu-shell"><aside className="lulu-sidebar" aria-label="Primary navigation"><div className="lulu-logo"><span className="sparkle">✦</span><span>Lulu AI</span></div><LuluSectionNavigation activeId="radiant-dusk-9079" /></aside><main className="lulu-main"><header className="page-header"><div className="breadcrumb"><span>AI Platform</span><ChevronRight size={13} /><strong>AI Agents</strong></div><div className="title-row"><div><h1>AI Agents</h1><p>Alle AI Agents nach Prioritaet sortiert, mit einfacher Einschaetzung und klarem Feedback.</p></div><div className="header-actions"><button className="ghost-button"><LayoutTemplate size={15} />Agent Templates</button><button className="ghost-button"><Store size={15} />Agent Marketplace</button><button type="button" className="primary-button" disabled aria-disabled="true" title="Create Agent coming soon" style={{ cursor: 'not-allowed', opacity: 0.55 }}><Plus size={15} />Create Agent <span aria-hidden="true">(soon)</span></button></div></div></header>{loading ? <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">Loading live AI agents…</div> : error ? <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-destructive">{error}</div> : !items.length ? <section className="flex min-h-[560px] items-center justify-center rounded-xl border border-dashed border-border bg-card p-10 text-center"><Bot className="mx-auto text-muted-foreground" size={38} /><h2 className="mt-4 text-xl font-semibold text-foreground">No AI agents available yet</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Configure an authorized AI agent or connect an agent source to populate this page. No example agent names, task counts, health values or performance statistics are displayed.</p></section> : <section className="content-section space-y-5"><div className="section-heading"><h2>Your AI Agents</h2><span>{items.length} live records</span></div>{AGENT_HEALTH_GROUPS.map(group => <section key={group.id} className={`rounded-2xl border bg-card p-4 sm:p-5 ${group.borderClassName} ${group.panelClassName}`}><div className="flex flex-col gap-2 border-b border-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-lg font-semibold text-foreground">{group.label}</h3><p className="text-sm text-muted-foreground">{group.description}</p></div><span className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold ${group.badgeClassName}`}>{groupedAgents[group.id].length} Agent{groupedAgents[group.id].length === 1 ? '' : 'en'}</span></div>{groupedAgents[group.id].length === 0 ? <p className="pt-4 text-sm text-muted-foreground">Aktuell keine Agenten in dieser Kategorie.</p> : <div className="grid gap-3 pt-4">{groupedAgents[group.id].map(record => <article key={record.id} className={`rounded-xl border p-4 ${group.borderClassName} bg-background/85`}><div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h4 className="text-base font-semibold text-foreground">{record.name}</h4><span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${group.badgeClassName}`}>{group.label}</span><span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">{textValue(record.status) || 'Recorded'}</span></div><p className="mt-2 text-sm leading-6 text-muted-foreground">{record.description || 'Live AI agent record'}</p><p className="mt-3 text-sm font-medium text-foreground">{simpleFeedback(record, group.id)}</p></div><div className="grid min-w-[220px] gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-1"><div><span className="font-medium text-foreground">Typ:</span> {textValue(record.data?.type) || 'Agent'}</div><div><span className="font-medium text-foreground">Tasks:</span> {textValue(record.data?.tasks) || '—'}</div><div><span className="font-medium text-foreground">Stage:</span> {textValue(record.stage) || textValue(record.data?.stage) || '—'}</div><div><span className="font-medium text-foreground">Aktualisiert:</span> {formatUpdatedAt(record.updatedAt)}</div></div></div></article>)}</div>}</section>)}</section>}</main></div>;
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
    "label": "Publishing & Approval Center"
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
    {luluDropdownNavigation.map(section => {
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
