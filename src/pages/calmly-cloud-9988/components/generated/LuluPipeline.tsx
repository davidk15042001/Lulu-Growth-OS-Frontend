import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, AlertTriangle, ArrowDownRight, ArrowRight, Bot, BriefcaseBusiness, Building2, CalendarDays, Check, ChevronDown, CircleHelp, Clock3, Command, Filter, Gauge, GripVertical, LayoutDashboard, ListTodo, Menu, MoreHorizontal, PanelRight, Plus, RefreshCcw, Search, Settings, SlidersHorizontal, Sparkles, Target, Trophy, UserRound, Users, X, Zap } from 'lucide-react';
type Deal = {
  name: string;
  company: string;
  contact: string;
  value: string;
  probability?: number;
  close: string;
  owner: string;
  initials: string;
  last: string;
  overdue?: boolean;
  risk?: string;
  won?: boolean;
};
type Stage = {
  name: string;
  count: string;
  total: string;
  conversion: string;
  tone: string;
  deals: Deal[];
  more: string;
};
const navGroups = [{
  label: 'Workspace',
  items: [{
    icon: LayoutDashboard,
    label: 'Dashboard'
  }, {
    icon: Sparkles,
    label: 'AI Insights'
  }]
}, {
  label: 'CRM',
  items: [{
    icon: Gauge,
    label: 'Overview'
  }, {
    icon: Users,
    label: 'Contacts'
  }, {
    icon: Building2,
    label: 'Companies'
  }, {
    icon: Target,
    label: 'Leads'
  }, {
    icon: BriefcaseBusiness,
    label: 'Deals'
  }, {
    icon: Activity,
    label: 'Pipeline',
    active: true
  }, {
    icon: Clock3,
    label: 'Activities'
  }, {
    icon: ListTodo,
    label: 'Tasks'
  }]
}, {
  label: 'Intelligence',
  items: [{
    icon: Bot,
    label: 'AI Assistant'
  }, {
    icon: Zap,
    label: 'AI Agents'
  }]
}];
const stages: Stage[] = [{
  name: 'New',
  count: '18 Deals',
  total: '€42,800',
  conversion: '68%',
  tone: 'violet',
  more: '16 more deals',
  deals: [{
    name: 'Sales Automation',
    company: 'GlobalTech Inc',
    contact: 'Ravi Singh',
    value: '€94,000',
    probability: 20,
    close: '31 Dec 2026',
    owner: 'Sarah Chen',
    initials: 'SC',
    last: '5 days ago'
  }, {
    name: 'SaaS Starter Pack',
    company: 'MicroSoft AG',
    contact: 'Dana Lee',
    value: '€12,400',
    probability: 15,
    close: '15 Jan 2027',
    owner: 'Marcus Hill',
    initials: 'MH',
    last: '1 week ago'
  }]
}, {
  name: 'Qualified',
  count: '28 Deals',
  total: '€94,200',
  conversion: '47%',
  tone: 'blue',
  more: '26 more deals',
  deals: [{
    name: 'Cloud Migration Suite',
    company: 'DataStream AG',
    contact: 'Lena Müller',
    value: '€128,000',
    probability: 40,
    close: '20 Nov 2026',
    owner: 'Sarah Chen',
    initials: 'SC',
    last: '2 days ago'
  }, {
    name: 'Automation Hub',
    company: 'Zentrix Ltd',
    contact: 'Mia Torres',
    value: '€47,500',
    probability: 35,
    close: '5 Dec 2026',
    owner: 'Priya Nair',
    initials: 'PN',
    last: '4 days ago'
  }, {
    name: 'Security Retainer',
    company: 'Northstar',
    contact: 'Eli Stone',
    value: '€31,800',
    probability: 45,
    close: '12 Dec 2026',
    owner: 'Noah Kim',
    initials: 'NK',
    last: 'Yesterday'
  }]
}, {
  name: 'Proposal',
  count: '34 Deals',
  total: '€128,000',
  conversion: '31%',
  tone: 'amber',
  more: '32 more deals',
  deals: [{
    name: 'Marketing Platform',
    company: 'Bluewave Ltd',
    contact: 'James Park',
    value: '€52,000',
    probability: 55,
    close: '15 Oct 2026',
    owner: 'Marcus Hill',
    initials: 'MH',
    last: '3 days ago'
  }, {
    name: 'CRM Integration',
    company: 'NexGen Systems',
    contact: 'Olivia Stone',
    value: '€29,000',
    probability: 60,
    close: '28 Sep 2026',
    owner: 'Marcus Hill',
    initials: 'MH',
    last: '7 days ago',
    overdue: true,
    risk: 'Attention'
  }, {
    name: 'Customer 360',
    company: 'Orbit Labs',
    contact: 'Jules Martin',
    value: '€18,900',
    probability: 50,
    close: '22 Oct 2026',
    owner: 'Sarah Chen',
    initials: 'SC',
    last: 'Today'
  }]
}, {
  name: 'Negotiation',
  count: '22 Deals',
  total: '€146,200',
  conversion: '18%',
  tone: 'orange',
  more: '20 more deals',
  deals: [{
    name: 'Enterprise Expansion',
    company: 'TechCorp GmbH',
    contact: 'Anna Weber',
    value: '€84,000',
    probability: 72,
    close: '30 Sep 2026',
    owner: 'Sarah Chen',
    initials: 'SC',
    last: 'Yesterday',
    risk: 'No activity 16d'
  }, {
    name: 'Analytics Dashboard',
    company: 'Vertex Corp',
    contact: 'Tom Reyes',
    value: '€37,500',
    probability: 80,
    close: '5 Oct 2026',
    owner: 'Priya Nair',
    initials: 'PN',
    last: 'Today'
  }, {
    name: 'Global Rollout',
    company: 'Aperture',
    contact: 'Nina Shah',
    value: '€24,700',
    probability: 65,
    close: '18 Oct 2026',
    owner: 'Noah Kim',
    initials: 'NK',
    last: '2 days ago'
  }]
}, {
  name: 'Won',
  count: '40 Deals',
  total: '€184,200',
  conversion: '',
  tone: 'green',
  more: '38 more deals',
  deals: [{
    name: 'ERP Connector',
    company: 'Pinnacle GmbH',
    contact: 'Klaus Bauer',
    value: '€46,000',
    close: '15 Sep 2026',
    owner: 'Priya Nair',
    initials: 'PN',
    last: 'Won',
    won: true
  }, {
    name: 'Data Analytics',
    company: 'TechCorp',
    contact: 'Ravi Singh',
    value: '€38,200',
    close: '10 Sep 2026',
    owner: 'Sarah Chen',
    initials: 'SC',
    last: 'Won',
    won: true
  }]
}];
const kpis = [['Open Deals', '142', '↑ 8.4%', 'violet'], ['Pipeline Value', '€482,400', '↑ 12%', 'blue'], ['Weighted Pipeline', '€318,700', '↑ 6.2%', 'cyan'], ['Expected Revenue', '€341,200', '↑ 9.1%', 'emerald'], ['Win Rate', '32.4%', '↑ 2.8%', 'amber'], ['Avg Deal Value', '€3,398', '↑ 4.6%', 'pink']];
function Logo() {
  return <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-primary shadow-lg shadow-black/40 text-primary-foreground"><Sparkles size={18} className="text-primary-foreground" /></div><span className="text-[15px] font-semibold tracking-tight text-foreground">lulu<span className="text-foreground">.</span>ai</span></div>;
}
function DealCard({
  deal,
  onSelect
}: {
  deal: Deal;
  onSelect: (deal: Deal) => void;
}) {
  return <button onClick={() => onSelect(deal)} className="group relative w-full rounded-xl border border-border bg-[var(--primary)] p-3 text-left transition-all hover:-translate-y-0.5 hover:border-border/50 hover:bg-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-ring/60 text-primary-foreground">
    <GripVertical size={13} className="absolute -left-1 top-4 text-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    <div className="flex items-start justify-between gap-2"><div><h4 className="text-[13px] font-semibold text-foreground">{deal.name}</h4><p className="mt-1 text-[11px] text-muted-foreground">{deal.company} · {deal.contact}</p></div><MoreHorizontal size={16} className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100" /></div>
    <div className="mt-3 flex items-center justify-between"><strong className="text-[14px] font-semibold text-foreground">{deal.value}</strong>{deal.won ? <span className="rounded-md bg-secondary/10 px-2 py-1 text-[10px] font-bold text-foreground">WON</span> : <span className="rounded-md bg-secondary px-2 py-1 text-[10px] font-semibold text-foreground">{deal.probability}%</span>}</div>
    {!deal.won && <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary text-primary-foreground" style={{
        width: `${deal.probability}%`
      }} /></div>}
    <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground"><span className={deal.overdue ? 'font-medium text-chart-5' : ''}><CalendarDays size={11} className="mr-1 inline" />{deal.close}{deal.overdue && ' · OVERDUE'}</span><span className="flex items-center gap-1"><span className="grid h-4 w-4 place-items-center rounded-full bg-secondary/20 text-[8px] font-bold text-foreground">{deal.initials}</span>{deal.owner}</span></div>
    <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-[10px] text-muted-foreground"><span>Last activity: {deal.last}</span>{deal.risk && <span className="flex items-center gap-1 text-chart-5"><AlertTriangle size={11} />{deal.risk}</span>}</div>
  </button>;
}
function PipelineBoard({
  onSelect
}: {
  onSelect: (deal: Deal) => void;
}) {
  return <section className="rounded-2xl border border-border bg-[var(--card)] p-3 shadow-2xl shadow-black/20"><div className="mb-3 flex items-center justify-between px-1"><div><h2 className="text-sm font-semibold text-foreground">Sales pipeline</h2><p className="mt-0.5 text-[11px] text-muted-foreground">Drag deals to update their stage</p></div><button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[11px] font-medium text-foreground hover:bg-secondary"><SlidersHorizontal size={13} />Board view</button></div><div className="flex gap-3 overflow-x-auto pb-2">{stages.map(stage => <div key={stage.name} className="min-w-[222px] flex-1 rounded-xl bg-[var(--secondary)] p-2"><div className="mb-2 flex items-start justify-between"><div><div className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full bg-${stage.tone === 'violet' ? 'violet' : stage.tone === 'blue' ? 'sky' : stage.tone === 'amber' ? 'amber' : stage.tone === 'orange' ? 'orange' : 'emerald'}-400`} /><h3 className="text-[12px] font-bold text-foreground">{stage.name}</h3>{stage.name === 'Proposal' && <span className="rounded bg-chart-1/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-foreground">Bottleneck</span>}{stage.name === 'Won' && <Trophy size={12} className="text-foreground" />}</div><p className="mt-1 text-[10px] text-muted-foreground">{stage.count} · {stage.total}</p></div><MoreHorizontal size={16} className="text-muted-foreground" /></div>{stage.conversion && <p className="mb-2 text-[10px] text-muted-foreground">Conversion <span className="font-semibold text-muted-foreground">{stage.conversion}</span> <ArrowRight size={11} className="inline text-muted-foreground" /></p>}<div className="space-y-2">{stage.deals.map(deal => <DealCard key={deal.name} deal={deal} onSelect={onSelect} />)}</div><button className="mt-2 w-full rounded-lg border border-dashed border-border py-2 text-[10px] font-medium text-foreground transition hover:border-border/40 hover:text-foreground">+ {stage.more} · Load more</button></div>)}</div></section>;
}
export function LuluPipeline() {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMove, setShowMove] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState('');
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className={`fixed inset-y-0 left-0 z-40 w-[220px] border-r border-border bg-[var(--sidebar)] px-3 py-5 transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}><div className="px-3"><Logo /></div><LuluSectionNavigation activeId="calmly-cloud-9988" /><div className="absolute bottom-5 left-4 right-4 border-t border-border pt-4"><div className="flex items-center gap-2.5 px-2"><div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-primary text-[11px] font-bold text-primary-foreground">SC</div><div><p className="text-[11px] font-semibold text-foreground">Sarah Chen</p><p className="text-[10px] text-muted-foreground">Admin</p></div><MoreHorizontal size={15} className="ml-auto text-muted-foreground" /></div></div></aside>
    <main className="lg:ml-[220px]"><header className="flex h-16 items-center justify-between border-b border-border px-5 md:px-8"><div className="flex items-center gap-3"><button onClick={() => setMobileNav(true)} className="text-foreground lg:hidden"><Menu size={20} /></button><span className="text-xs text-muted-foreground">CRM</span><span className="text-foreground">/</span><span className="text-xs font-medium text-foreground">Pipeline</span></div><div className="flex items-center gap-2 text-muted-foreground"><button className="hidden rounded-lg border border-border p-2 hover:text-foreground md:block"><Command size={14} /></button><div className="h-5 w-px bg-secondary" /><CircleHelp size={16} /><div className="h-7 w-7 rounded-full bg-secondary/20" /></div></header>
      <div className="mx-auto max-w-[1480px] px-5 py-7 md:px-8"><div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-foreground"><Sparkles size={13} />AI-POWERED REVENUE OPERATIONS</div><h1 className="text-3xl font-bold tracking-[-0.04em] text-foreground md:text-[34px]">Pipeline</h1><p className="mt-2 max-w-2xl text-[13px] text-muted-foreground">Visualize, manage and optimize your sales pipeline from first qualification to closed revenue.</p></div><div className="flex flex-wrap gap-2"><button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-[11px] font-semibold text-foreground hover:bg-secondary"><RefreshCcw size={13} />Refresh</button><button onClick={() => setShowSettings(true)} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-[11px] font-semibold text-foreground hover:bg-secondary"><Settings size={13} />Pipeline Settings</button><button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-primary-foreground shadow-lg shadow-black/40 hover:bg-primary"><Plus size={14} />Create Deal</button></div></div>
        <div className="mt-7 flex flex-wrap items-center gap-2 border-y border-border py-3"><span className="mr-1 text-[11px] font-semibold text-muted-foreground">Pipeline</span>{['Default Sales Pipeline', 'This Quarter', 'My Pipeline'].map(item => <button key={item} className="flex items-center gap-2 rounded-lg border border-border bg-[var(--primary)] px-3 py-2 text-[11px] text-primary-foreground">{item}<ChevronDown size={13} className="text-muted-foreground" /></button>)}<button className="ml-auto text-[11px] font-medium text-foreground hover:text-foreground">Manage Pipelines</button></div>
        <div className="grid grid-cols-2 gap-2 py-4 md:grid-cols-3 xl:grid-cols-6">{kpis.map(kpi => <div key={kpi[0]} className="rounded-xl border border-border bg-[var(--secondary)] px-3 py-2.5"><p className="text-[10px] text-muted-foreground">{kpi[0]}</p><div className="mt-1 flex items-end justify-between gap-2"><strong className="text-sm font-bold text-foreground">{kpi[1]}</strong><span className={`text-[9px] font-semibold ${kpi[3] === 'amber' ? 'text-chart-1' : 'text-foreground'}`}>{kpi[2]}</span></div></div>)}</div>
        <div className="mb-4 flex flex-wrap items-center gap-2"><div className="relative min-w-[220px] flex-1 md:max-w-[310px]"><Search size={15} className="absolute left-3 top-2.5 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search pipeline..." className="h-9 w-full rounded-lg border border-border bg-[var(--secondary)] pl-9 pr-3 text-[11px] text-muted-foreground outline-none placeholder:text-muted-foreground focus:border-border/60" /></div><button className="flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-[11px] text-foreground hover:bg-secondary"><Filter size={13} />Filter <span className="grid h-4 w-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">2</span></button><span className="rounded-md bg-secondary/10 px-2 py-1.5 text-[10px] text-foreground">Owner: Sarah Chen <X size={11} className="ml-1 inline" /></span><span className="rounded-md bg-secondary/10 px-2 py-1.5 text-[10px] text-foreground">Closing: This Month <X size={11} className="ml-1 inline" /></span><button className="text-[10px] text-foreground hover:text-foreground">Clear All</button></div>
        <PipelineBoard onSelect={deal => setSelectedDeal(deal)} />
        <section className="mt-7"><div className="mb-3 flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-chart-1">Attention needed</p><h2 className="mt-1 text-lg font-bold text-foreground">Pipeline Bottlenecks</h2></div><button className="text-[11px] text-foreground">View all insights <ArrowRight size={12} className="inline" /></button></div><div className="grid gap-3 md:grid-cols-2"><div className="rounded-xl border border-border/20 bg-secondary/[0.06] p-4"><div className="flex items-start justify-between"><div><h3 className="text-sm font-semibold text-foreground">⚠️ Proposal Stage</h3><p className="mt-2 text-[12px] text-muted-foreground">14 deals have remained in this stage longer than the 21-day average.</p></div><span className="rounded-md bg-chart-5/15 px-2 py-1 text-[9px] font-bold uppercase text-chart-5">High</span></div><div className="mt-4 flex items-center justify-between"><span className="text-[11px] text-muted-foreground">Potential impact <strong className="ml-1 text-chart-1">€182,000 at risk</strong></span><button className="text-[11px] font-semibold text-foreground">Review Stage <ArrowRight size={12} className="inline" /></button></div></div><div className="rounded-xl border border-chart-1/20 bg-chart-1/[0.05] p-4"><div className="flex items-start justify-between"><div><h3 className="text-sm font-semibold text-foreground">⚠️ Negotiation Stage</h3><p className="mt-2 text-[12px] text-muted-foreground">High-value deals experiencing reduced activity over the past 10 days.</p></div><span className="rounded-md bg-secondary/15 px-2 py-1 text-[9px] font-bold uppercase text-foreground">Medium</span></div><div className="mt-4 flex items-center justify-between"><span className="text-[11px] text-muted-foreground">Potential impact <strong className="ml-1 text-foreground">€84,000</strong></span><button className="text-[11px] font-semibold text-foreground">Review Stage <ArrowRight size={12} className="inline" /></button></div></div></div></section>
        <section className="mt-7 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]"><div className="rounded-2xl border border-border bg-[var(--secondary)] p-5"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Revenue intelligence</p><h2 className="mt-1 text-lg font-bold text-foreground">Pipeline Velocity</h2></div><button className="flex items-center gap-1 text-[10px] text-foreground">Previous Period <ChevronDown size={12} /></button></div><div className="mt-5 grid grid-cols-3 gap-4"><div><p className="text-[10px] text-muted-foreground">Avg Time in Stage</p><strong className="mt-1 block text-lg text-foreground">18d</strong><p className="mt-1 text-[10px] text-foreground">Proposal</p></div><div><p className="text-[10px] text-muted-foreground">Avg Sales Cycle</p><strong className="mt-1 block text-lg text-foreground">42 days</strong><p className="mt-1 text-[10px] text-foreground">↓ 6d vs prev period</p></div><div><p className="text-[10px] text-muted-foreground">Deal Movement</p><strong className="mt-1 block text-lg text-foreground">12</strong><p className="mt-1 text-[10px] text-foreground">deals this week</p></div></div><div className="mt-6 flex h-20 items-end gap-2 border-b border-border">{[26, 38, 31, 55, 48, 72, 64, 88, 76, 96].map((height, i) => <div key={`bar-${height}`} className="flex-1 rounded-t bg-secondary/60" style={{
                height: `${height}%`
              }} />)}</div><div className="mt-3 flex justify-between text-[10px] text-muted-foreground"><span>Stage conversion</span><span className="text-chart-4">Pipeline growth +12% MoM</span></div></div><div className="rounded-2xl border border-border bg-[var(--secondary)] p-5"><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-foreground">Pipeline Conversion</h2><span className="text-[10px] text-muted-foreground">Funnel view</span></div><div className="mt-5 space-y-2">{[['New', '100%', '100'], ['Qualified', '68%', '82'], ['Proposal', '47%', '65'], ['Negotiation', '31%', '48'], ['Won', '18%', '31']].map(row => <div key={row[0]} className="flex items-center gap-3"><span className="w-20 text-[10px] text-muted-foreground">{row[0]}</span><div className="h-6 flex-1 overflow-hidden rounded bg-secondary/10"><div className="flex h-full items-center rounded bg-secondary/70 px-2 text-[10px] font-bold text-foreground" style={{
                    width: `${row[2]}%`
                  }}>{row[1]}</div></div></div>)}</div></div></section>
        <section className="mt-7 rounded-2xl border border-border bg-[var(--card)] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-foreground"><Sparkles size={12} />Lulu AI Pipeline Insights <span className="rounded bg-secondary/20 px-1.5 py-0.5 text-[8px] tracking-normal">AI</span></p><h2 className="mt-1 text-lg font-bold text-foreground">Signals worth acting on</h2></div><span className="text-[10px] text-muted-foreground">Updated 4 minutes ago</span></div><div className="mt-5 grid gap-3 lg:grid-cols-3"><div className="rounded-xl border border-chart-5/20 bg-chart-5/[0.05] p-4"><span className="text-[10px] font-bold uppercase text-chart-5">🔴 Pipeline Risk</span><p className="mt-2 text-[12px] leading-5 text-foreground">Several high-value deals in Negotiation have had no recent activity. Win probability may be declining.</p><button className="mt-4 text-[11px] font-semibold text-foreground">Review Deals <ArrowRight size={12} className="inline" /></button></div><div className="rounded-xl border border-chart-1/20 bg-chart-1/[0.05] p-4"><span className="text-[10px] font-bold uppercase text-foreground">⚠️ Bottleneck Detected</span><p className="mt-2 text-[12px] leading-5 text-foreground">Proposal is taking 18 days on average vs the 14-day benchmark.</p><button className="mt-4 text-[11px] font-semibold text-foreground">Review Stage <ArrowRight size={12} className="inline" /></button></div><div className="rounded-xl border border-chart-4/20 bg-chart-4/[0.05] p-4"><span className="text-[10px] font-bold uppercase text-chart-4">🟢 Revenue Opportunity</span><p className="mt-2 text-[12px] leading-5 text-foreground">Pipeline volume increased 12% while conversion rates remain stable.</p><button className="mt-4 text-[11px] font-semibold text-foreground">Analyze Pipeline <ArrowRight size={12} className="inline" /></button></div></div></section>
        <section className="mt-7 pb-10"><div className="mb-3 flex items-center gap-2"><h2 className="text-lg font-bold text-foreground">AI Recommendations</h2><span className="rounded bg-secondary/20 px-1.5 py-0.5 text-[8px] font-bold text-foreground">AI</span></div><div className="grid gap-3 lg:grid-cols-3"><div className="rounded-xl border border-border bg-[var(--secondary)] p-4"><div className="flex justify-between"><span className="text-sm font-semibold text-foreground">Follow Up</span><span className="text-[10px] font-bold text-chart-5">HIGH PRIORITY</span></div><p className="mt-2 text-[12px] text-muted-foreground">Contact Anna Weber regarding Enterprise Expansion.</p><p className="mt-3 text-[10px] text-foreground">Expected impact: Prevent deal loss</p><button className="mt-4 text-[11px] font-semibold text-foreground">Create Task <ArrowRight size={12} className="inline" /></button></div><div className="rounded-xl border border-border bg-[var(--secondary)] p-4"><div className="flex justify-between"><span className="text-sm font-semibold text-foreground">Review Stage Assignments</span><span className="text-[10px] font-bold text-foreground">MEDIUM</span></div><p className="mt-2 text-[12px] text-muted-foreground">8 deals in Proposal may be ready to advance.</p><button className="mt-7 text-[11px] font-semibold text-foreground">Review <ArrowRight size={12} className="inline" /></button></div><div className="rounded-xl border border-border bg-[var(--secondary)] p-4"><div className="flex justify-between"><span className="text-sm font-semibold text-foreground">Update Probabilities</span><span className="text-[10px] font-bold text-muted-foreground">LOW</span></div><p className="mt-2 text-[12px] text-muted-foreground">Several deals have stale probability scores.</p><button className="mt-7 text-[11px] font-semibold text-foreground">Review <ArrowRight size={12} className="inline" /></button></div></div></section>
      </div>
    </main>
    <AnimatePresence>{selectedDeal && <motion.aside initial={{
        x: 380
      }} animate={{
        x: 0
      }} exit={{
        x: 380
      }} className="fixed right-0 top-0 z-50 flex h-full w-[min(380px,100vw)] flex-col border-l border-border bg-[var(--card)] p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground">Deal Preview</p><h2 className="mt-1 text-xl font-bold text-foreground">{selectedDeal.name}</h2></div><button onClick={() => setSelectedDeal(null)} className="rounded-lg p-2 text-foreground hover:bg-secondary hover:text-foreground"><X size={18} /></button></div><div className="mt-8 space-y-5"><div><p className="text-[10px] text-muted-foreground">Company</p><p className="mt-1 text-sm text-foreground">{selectedDeal.company}</p></div><div><p className="text-[10px] text-muted-foreground">Value</p><p className="mt-1 text-2xl font-bold text-foreground">{selectedDeal.value}</p></div><div className="grid grid-cols-2 gap-4"><div><p className="text-[10px] text-muted-foreground">Contact</p><p className="mt-1 text-sm text-foreground">{selectedDeal.contact}</p></div><div><p className="text-[10px] text-muted-foreground">Owner</p><p className="mt-1 text-sm text-foreground">{selectedDeal.owner}</p></div></div><div className="rounded-xl border border-border bg-secondary p-4"><p className="text-[10px] text-muted-foreground">Next best action</p><p className="mt-2 text-sm leading-5 text-foreground">Re-engage the buying committee and confirm the decision timeline.</p></div><button onClick={() => setShowMove(true)} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground">Move deal <ArrowRight size={14} /></button></div></motion.aside>}</AnimatePresence>
    <AnimatePresence>{(showCreate || showSettings || showMove) && <div className="fixed inset-0 z-[60] grid place-items-center bg-primary/60 p-4 backdrop-blur-sm"><motion.div initial={{
          opacity: 0,
          y: 12
        }} animate={{
          opacity: 1,
          y: 0
        }} className="w-full max-w-lg rounded-2xl border border-border bg-[var(--card)] p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground">{showCreate ? 'New opportunity' : showSettings ? 'Workspace configuration' : 'Move Deal'}</p><h2 className="mt-1 text-xl font-bold text-foreground">{showCreate ? 'Create Deal' : showSettings ? 'Pipeline Settings' : 'Move Deal'}</h2></div><button onClick={() => {
              setShowCreate(false);
              setShowSettings(false);
              setShowMove(false);
            }} className="text-foreground hover:text-foreground"><X size={18} /></button></div>{showCreate ? <div className="mt-6 grid grid-cols-2 gap-3">{['Deal Name *', 'Company *', 'Primary Contact', 'Pipeline', 'Stage', 'Value *', 'Currency *', 'Expected Close Date *', 'Owner', 'Lead Source'].map(label => <label key={label} className="text-[10px] text-muted-foreground">{label}<input className="mt-1 h-9 w-full rounded-lg border border-border bg-[var(--secondary)] px-3 text-xs text-foreground outline-none focus:border-border" placeholder={label.replace(' *', '')} /></label>)}</div> : showSettings ? <div className="mt-6 space-y-3">{['Pipeline name', 'Stage names & order', 'Stage probabilities', 'Required fields', 'Won / Lost stage', 'Permissions'].map(setting => <button key={setting} className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary px-4 py-3 text-left text-sm text-foreground">{setting}<ArrowRight size={14} className="text-muted-foreground" /></button>)}</div> : <div className="mt-6 space-y-4"><div className="rounded-xl bg-secondary p-4 text-sm text-foreground"><p>Current stage <strong className="float-right text-foreground">Proposal</strong></p><p className="mt-3">New stage <strong className="float-right text-foreground">Negotiation</strong></p><p className="mt-3">Deal <strong className="float-right text-foreground">CRM Integration</strong></p></div><label className="block text-[10px] text-muted-foreground">Note (optional)<textarea className="mt-1 h-20 w-full resize-none rounded-lg border border-border bg-[var(--secondary)] p-3 text-xs text-foreground outline-none" placeholder="Add context for your team..." /></label></div>}<div className="mt-6 flex justify-end gap-2"><button onClick={() => {
              setShowCreate(false);
              setShowSettings(false);
              setShowMove(false);
            }} className="rounded-lg px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary">Cancel</button><button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary">{showCreate ? 'Create Deal' : showSettings ? 'Save changes' : 'Move Deal'}</button></div></motion.div></div>}</AnimatePresence>
  </div>;
}

/* Lulu dropdown navigation — intentionally isolated from page content. */
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
    "id": "sparklingly-moon-5114",
    "label": "SEO"
  }, {
    "id": "zealously-path-4224",
    "label": "GEO"
  }, {
    "id": "sunny-house-9595",
    "label": "AEO"
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
  "label": "Ecommerce",
  "pages": [{
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
    "id": "daring-brook-9034",
    "label": "Reviews"
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
  }, {
    "id": "nicely-land-1864",
    "label": "Settings"
  }]
}, {
  "label": "Integrations",
  "pages": [{
    "id": "glad-coast-1428",
    "label": "Integrations"
  }]
}, {
  "label": "Billing",
  "pages": [{
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
          <span>{section.label}</span>
          <span aria-hidden="true" className="text-xs transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <div className="ml-3 mt-1 space-y-0.5 border-l border-border pl-2 pb-1">
          {section.pages.map(page => {
            const isActivePage = page.id === activeId;
            return <a key={page.id} {...pageLinkProps(page.id)} aria-current={isActivePage ? 'page' : undefined} className={`block rounded-md px-3 py-2 text-xs transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {page.label}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}
import { pageLinkProps } from '../../../../routing';
