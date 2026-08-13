import { useMemo, useState } from 'react';
import { Activity, AlertCircle, Archive, ArrowDown, ArrowUp, BarChart3, Bell, Bot, BriefcaseBusiness, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, Columns3, Download, Ellipsis, FilePlus2, Filter, FolderKanban, Gauge, Globe2, Import, LayoutGrid, ListFilter, Menu, MoreHorizontal, PanelRight, Plus, Search, Settings, Sparkles, Target, Trash2, TrendingUp, UserRound, Users, X, Zap, CheckCircle2, SlidersHorizontal } from 'lucide-react';
type Stage = 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
type Status = 'Open' | 'Won' | 'Lost' | 'Archived';
type Deal = {
  id: string;
  name: string;
  company: string;
  contact: string;
  stage: Stage;
  value: number;
  probability: number;
  close: string;
  overdue?: boolean;
  owner: string;
  initials: string;
  last: string;
  status: Status;
};
const deals: Deal[] = [{
  id: 'enterprise-expansion',
  name: 'Enterprise Expansion',
  company: 'TechCorp GmbH',
  contact: 'Anna Weber',
  stage: 'Negotiation',
  value: 84000,
  probability: 72,
  close: '30 Sep 2026',
  owner: 'Sarah Chen',
  initials: 'SC',
  last: 'Yesterday',
  status: 'Open'
}, {
  id: 'marketing-platform',
  name: 'Marketing Platform',
  company: 'Bluewave Ltd',
  contact: 'James Park',
  stage: 'Proposal',
  value: 52000,
  probability: 55,
  close: '15 Oct 2026',
  owner: 'Marcus Hill',
  initials: 'MH',
  last: '3 days ago',
  status: 'Open'
}, {
  id: 'cloud-migration',
  name: 'Cloud Migration Suite',
  company: 'DataStream AG',
  contact: 'Lena Müller',
  stage: 'Qualified',
  value: 128000,
  probability: 40,
  close: '20 Nov 2026',
  owner: 'Sarah Chen',
  initials: 'SC',
  last: '2 days ago',
  status: 'Open'
}, {
  id: 'analytics-dashboard',
  name: 'Analytics Dashboard',
  company: 'Vertex Corp',
  contact: 'Tom Reyes',
  stage: 'Negotiation',
  value: 37500,
  probability: 80,
  close: '5 Oct 2026',
  owner: 'Priya Nair',
  initials: 'PN',
  last: 'Today',
  status: 'Open'
}, {
  id: 'crm-integration',
  name: 'CRM Integration',
  company: 'NexGen Systems',
  contact: 'Olivia Stone',
  stage: 'Proposal',
  value: 29000,
  probability: 60,
  close: '28 Sep 2026',
  overdue: true,
  owner: 'Marcus Hill',
  initials: 'MH',
  last: '7 days ago',
  status: 'Open'
}, {
  id: 'sales-automation',
  name: 'Sales Automation',
  company: 'GlobalTech Inc',
  contact: 'Ravi Singh',
  stage: 'New',
  value: 94000,
  probability: 20,
  close: '31 Dec 2026',
  owner: 'Sarah Chen',
  initials: 'SC',
  last: '5 days ago',
  status: 'Open'
}, {
  id: 'erp-connector',
  name: 'ERP Connector',
  company: 'Pinnacle GmbH',
  contact: 'Klaus Bauer',
  stage: 'Won',
  value: 46000,
  probability: 100,
  close: '—',
  owner: 'Priya Nair',
  initials: 'PN',
  last: '1 week ago',
  status: 'Won'
}, {
  id: 'bi-reporting',
  name: 'BI Reporting Suite',
  company: 'Altus Media',
  contact: 'Fiona Walsh',
  stage: 'Lost',
  value: 31000,
  probability: 0,
  close: '—',
  owner: 'Marcus Hill',
  initials: 'MH',
  last: '2 weeks ago',
  status: 'Lost'
}];
const stageMeta: Record<Stage, {
  tone: string;
  dot: string;
}> = {
  New: {
    tone: 'bg-secondary/15 text-foreground border-border/30',
    dot: 'bg-secondary'
  },
  Qualified: {
    tone: 'bg-secondary/15 text-foreground border-border/30',
    dot: 'bg-primary'
  },
  Proposal: {
    tone: 'bg-secondary/15 text-foreground border-border/30',
    dot: 'bg-primary'
  },
  Negotiation: {
    tone: 'bg-secondary/15 text-foreground border-border/30',
    dot: 'bg-primary'
  },
  Won: {
    tone: 'bg-secondary/15 text-foreground border-border/30',
    dot: 'bg-primary'
  },
  Lost: {
    tone: 'bg-chart-5/15 text-chart-5 border-chart-5/30',
    dot: 'bg-destructive'
  }
};
const stageFunnel = [{
  stage: 'New',
  count: 24,
  value: '€210K',
  share: '12%'
}, {
  stage: 'Qualified',
  count: 38,
  value: '€890K',
  share: '28%'
}, {
  stage: 'Proposal',
  count: 31,
  value: '€520K',
  share: '19%'
}, {
  stage: 'Negotiation',
  count: 22,
  value: '€340K',
  share: '16%'
}, {
  stage: 'Won',
  count: 67,
  value: '€184K',
  share: '25%'
}];
const attention = [{
  icon: AlertCircle,
  color: 'text-chart-5 bg-chart-5/10',
  name: 'Enterprise Expansion',
  reason: 'No activity for 16 days',
  severity: 'High',
  owner: 'Sarah Chen',
  initials: 'SC',
  action: 'Schedule follow-up call'
}, {
  icon: Clock3,
  color: 'text-chart-1 bg-chart-1/10',
  name: 'CRM Integration',
  reason: 'Close date in 2 days, no recent activity',
  severity: 'Medium',
  owner: 'Marcus Hill',
  initials: 'MH',
  action: 'Confirm close plan'
}, {
  icon: TrendingUp,
  color: 'text-chart-1 bg-chart-1/10',
  name: 'Analytics Dashboard',
  reason: 'Probability declined from 85% to 80%',
  severity: 'Medium',
  owner: 'Priya Nair',
  initials: 'PN',
  action: 'Review qualification'
}, {
  icon: Clock3,
  color: 'text-foreground bg-secondary/10',
  name: 'Cloud Migration Suite',
  reason: 'In Qualified stage for 34 days',
  severity: 'Low',
  owner: 'Sarah Chen',
  initials: 'SC',
  action: 'Schedule stage review'
}];
const formatEuro = (value: number) => `€${value.toLocaleString('en-US')}`;
function Sidebar() {
  return <aside className="hidden w-[220px] shrink-0 flex-col border-r border-border bg-[var(--sidebar)] px-3 py-5 lg:flex">
    <div className="flex items-center gap-3 px-3 pb-8"><div className="grid h-8 w-8 place-items-center rounded-xl bg-primary shadow-lg shadow-black/20 text-primary-foreground"><Sparkles size={16} /></div><strong className="text-[15px] tracking-tight text-foreground">lulu<span className="text-foreground">.</span>ai</strong></div>
    <LuluSectionNavigation activeId="smartly-shade-4619" />
    <div className="mt-auto border-t border-border pt-4"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-secondary"><div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-primary text-[11px] font-bold text-primary-foreground">JD</div><span><strong className="block text-xs text-foreground">Jordan Davis</strong><small className="text-[11px] text-muted-foreground">Admin workspace</small></span><MoreHorizontal size={16} className="ml-auto text-muted-foreground" /></button></div>
  </aside>;
}
function KpiCard({
  icon: Icon,
  label,
  value,
  trend,
  warning
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  trend: string;
  warning?: boolean;
}) {
  return <article className="min-w-0 rounded-xl border border-border bg-[var(--card)] px-4 py-4"><div className="mb-3 flex items-center justify-between"><div className={`grid h-8 w-8 place-items-center rounded-lg ${warning ? 'bg-chart-1/10 text-chart-1' : 'bg-secondary/10 text-foreground'}`}><Icon size={16} /></div><span className={`text-[11px] font-medium ${warning ? 'text-chart-1' : 'text-chart-4'}`}>{trend}</span></div><p className="text-xs text-muted-foreground">{label}</p><strong className="mt-1 block text-[21px] tracking-tight text-foreground">{value}</strong></article>;
}
export function LuluDealsPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [view, setView] = useState('Table');
  const [showCreate, setShowCreate] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const visibleDeals = useMemo(() => deals.filter(deal => `${deal.name} ${deal.company} ${deal.contact}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const toggleSelected = (id: string) => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const allSelected = selected.length === visibleDeals.length && visibleDeals.length > 0;
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1 bg-[var(--background)]">
        <header className="flex h-16 items-center justify-between border-b border-border px-5 md:px-8"><div className="flex items-center gap-3"><button className="lg:hidden"><Menu size={19} /></button><span className="text-xs text-muted-foreground">CRM</span><span className="text-foreground">/</span><strong className="text-xs text-foreground">Deals</strong></div><div className="flex items-center gap-4"><button className="relative text-foreground hover:text-foreground" aria-label="Notifications"><Bell size={18} /><span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /></button><span className="hidden text-xs text-muted-foreground sm:block">Last synced 2 min ago</span></div></header>
        <div className="mx-auto max-w-[1500px] px-5 py-7 md:px-8">
          <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">Revenue operations</p><h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground md:text-[34px]">Deals</h1><p className="mt-2 text-sm text-muted-foreground">Manage your sales opportunities, pipeline value and revenue potential.</p></div><div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-foreground hover:bg-secondary"><Import size={14} /> Import</button><button className="inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-foreground hover:bg-secondary"><Download size={14} /> Export</button><button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lg shadow-black/20 hover:bg-primary"><Plus size={15} /> Create Deal</button></div></section>
          <section className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6"><KpiCard icon={FolderKanban} label="Total Deals" value="186" trend="↑ 8.4%" /><KpiCard icon={Activity} label="Open Deals" value="142" trend="↑ 5.2%" /><KpiCard icon={BarChart3} label="Pipeline Value" value="€482,400" trend="↑ 12.0%" /><KpiCard icon={Target} label="Weighted Pipeline" value="€318,700" trend="↑ 9.6%" /><KpiCard icon={CheckCircle2} label="Won Revenue" value="€184,200" trend="↑ 18.4%" /><KpiCard icon={AlertCircle} label="Requiring Attention" value="18" trend="Needs review" warning /></section>
          <section className="mt-6 flex flex-col gap-3 xl:flex-row"><div className="relative min-w-0 flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} /><input value={query} onChange={event => setQuery(event.target.value)} className="h-11 w-full rounded-xl border border-border bg-[var(--secondary)] pl-10 pr-14 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-border/60" placeholder="Search deals..." /><kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">⌘K</kbd></div><div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 text-xs text-foreground"><Filter size={14} /> Filters <span className="grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">2</span></button><div className="relative"><button onClick={() => setSavedOpen(!savedOpen)} className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-3 text-xs text-foreground">Saved Filters <ChevronDown size={14} /></button>{savedOpen && <div className="absolute right-0 top-12 z-10 w-48 rounded-lg border border-border bg-[var(--secondary)] p-1 shadow-2xl">{['My Open Deals', 'High Value Deals', 'Closing This Month', 'Stalled Deals', 'At Risk Deals', 'Recently Won', 'Recently Lost'].map(item => <button key={item} className="block w-full rounded px-3 py-2 text-left text-xs text-foreground hover:bg-secondary hover:text-foreground">{item}</button>)}</div>}</div><div className="flex h-11 rounded-lg border border-border p-1">{['Table', 'Compact', 'Card'].map(item => <button key={item} onClick={() => setView(item)} className={`rounded px-3 text-xs ${view === item ? 'bg-primary text-primary-foreground' : 'text-primary-foreground hover:text-primary-foreground'}`}>{item}</button>)}</div><button className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-3 text-xs text-foreground"><Columns3 size={14} /> Columns</button></div></section>
          <div className="mt-4 flex flex-wrap items-center gap-2"><span className="text-[11px] text-muted-foreground">Active:</span>{['Stage: Negotiation', 'Owner: Sarah Chen'].map(chip => <button key={chip} className="inline-flex items-center gap-1.5 rounded-full border border-border/20 bg-secondary/10 px-2.5 py-1 text-[11px] text-foreground">{chip}<X size={12} /></button>)}<button className="text-[11px] text-foreground hover:text-foreground">Clear All</button></div>
          {selected.length > 0 && <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border/20 bg-secondary/10 px-4 py-3 text-xs"><strong className="text-foreground">{selected.length} selected</strong>{['Assign Owner', 'Change Stage', 'Add Tag', 'Create Task', 'Export', 'Archive', 'Delete'].map(item => <button key={item} className="rounded-md border border-border bg-[var(--primary)] px-2.5 py-1.5 text-primary-foreground hover:text-primary-foreground">{item}</button>)}</div>}
          <section className="mt-4 overflow-hidden rounded-xl border border-border bg-[var(--card)]" aria-label="Deals table">{view === 'Table' ? <div className="overflow-x-auto"><table className="w-full min-w-[1240px] border-collapse text-left"><thead className="border-b border-border bg-secondary"><tr className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted-foreground"><th className="w-10 px-4 py-3"><input type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? [] : visibleDeals.map(deal => deal.id))} aria-label="Select all deals" /></th>{['Deal', 'Stage', 'Value', 'Probability', 'Weighted Value', 'Expected Close', 'Owner', 'Last Activity', 'Status', ''].map(heading => <th key={heading} className="px-3 py-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-white/[0.055]">{visibleDeals.map(deal => <tr key={deal.id} className="group transition hover:bg-secondary"><td className="px-4 py-3"><input type="checkbox" checked={selected.includes(deal.id)} onChange={() => toggleSelected(deal.id)} aria-label={`Select ${deal.name}`} /></td><td className="px-3 py-3"><button className="text-left"><strong className="block text-[13px] font-medium text-foreground group-hover:text-foreground">{deal.name}</strong><span className="mt-1 block text-[11px] text-muted-foreground">{deal.company} · {deal.contact}</span></button></td><td className="px-3 py-3"><span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-medium ${stageMeta[deal.stage].tone}`}><span className={`h-1.5 w-1.5 rounded-full ${stageMeta[deal.stage].dot}`} />{deal.stage}</span></td><td className="px-3 py-3 text-xs font-medium text-foreground">{formatEuro(deal.value)}</td><td className="px-3 py-3"><div className="flex items-center gap-2 text-xs text-foreground"><span className="w-7">{deal.probability}%</span><span className="h-1.5 w-16 rounded-full bg-card"><span className="block h-full rounded-full bg-primary text-primary-foreground" style={{
                            width: `${deal.probability}%`
                          }} /></span></div></td><td className="px-3 py-3 text-xs text-muted-foreground">{formatEuro(deal.value * deal.probability / 100)}</td><td className={`px-3 py-3 text-xs ${deal.overdue ? 'font-medium text-chart-5' : 'text-muted-foreground'}`}>{deal.close}{deal.overdue && <span className="ml-1 text-[10px]">overdue</span>}</td><td className="px-3 py-3"><span className="flex items-center gap-2 text-xs text-foreground"><span className="grid h-6 w-6 place-items-center rounded-full bg-card text-[9px] font-semibold text-foreground">{deal.initials}</span>{deal.owner}</span></td><td className="px-3 py-3 text-xs text-muted-foreground">{deal.last}</td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-[10px] ${deal.status === 'Won' ? 'bg-secondary/10 text-foreground' : deal.status === 'Lost' ? 'bg-chart-5/10 text-chart-5' : 'bg-secondary/10 text-foreground'}`}>{deal.status}</span></td><td className="px-3"><button className="rounded p-1.5 text-foreground hover:bg-secondary hover:text-foreground" aria-label={`Actions for ${deal.name}`}><Ellipsis size={17} /></button></td></tr>)}</tbody></table></div> : <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">{visibleDeals.map(deal => <article key={deal.id} className="rounded-lg border border-border bg-[var(--card)] p-4"><div className="flex justify-between"><span className={`rounded-full border px-2 py-1 text-[10px] ${stageMeta[deal.stage].tone}`}>{deal.stage}</span><button><Ellipsis size={17} /></button></div><h3 className="mt-4 text-sm font-semibold text-foreground">{deal.name}</h3><p className="mt-1 text-xs text-muted-foreground">{deal.company} · {deal.contact}</p><div className="mt-5 flex justify-between text-xs"><span className="text-muted-foreground">Value <strong className="ml-1 text-foreground">{formatEuro(deal.value)}</strong></span><span className="text-foreground">{deal.probability}% likely</span></div></article>)}</div>}
          <div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>1–50 of 186 deals</span><span>Items per page: <strong className="text-foreground">50</strong> <ChevronDown className="inline" size={12} /></span><div className="flex items-center gap-1"><button className="rounded p-1.5 hover:bg-secondary"><ChevronLeft size={14} /></button>{['1', '2', '3', '4'].map(page => <button key={page} className={`grid h-7 w-7 place-items-center rounded ${page === '1' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>{page}</button>)}<button className="rounded p-1.5 hover:bg-secondary"><ChevronRight size={14} /></button></div></div></section>
          <section className="mt-8"><div className="mb-4 flex items-end justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground">Pipeline health</p><h2 className="mt-1 text-lg font-semibold text-foreground">Deal stages</h2></div><button className="text-xs font-medium text-foreground hover:text-foreground">Open Pipeline <span>→</span></button></div><div className="grid gap-2 md:grid-cols-5">{stageFunnel.map(item => <article key={item.stage} className="relative overflow-hidden rounded-xl border border-border bg-[var(--card)] p-4"><div className="absolute bottom-0 left-0 h-0.5 bg-primary text-primary-foreground" style={{
                  width: item.share
                }} /><span className="text-xs text-muted-foreground">{item.stage}</span><strong className="mt-3 block text-xl text-foreground">{item.count}</strong><span className="mt-1 block text-xs text-muted-foreground">{item.value} <span className="text-muted-foreground">· {item.share} pipeline</span></span></article>)}</div></section>
          <section className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_1fr]">
            <div className="rounded-xl border border-border bg-[var(--secondary)] p-5"><div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground">Performance</p><h2 className="mt-1 text-lg font-semibold text-foreground">Deal performance</h2></div><button className="flex items-center gap-1 text-xs text-foreground">Previous Period <ChevronDown size={13} /></button></div><div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">{[['Win Rate', '47%', 'vs 41% prev period', '↑'], ['Loss Rate', '23%', 'vs 27% prev period', '↓'], ['Avg Deal Value', '€34,200', 'per closed deal', ''], ['Avg Sales Cycle', '42 days', 'from first touch', ''], ['Revenue Won', '€184,200', 'this period', ''], ['Pipeline Growth', '+12%', 'month over month', '↑']].map(([label, value, note, arrow]) => <div key={label}><p className="text-xs text-muted-foreground">{label}</p><strong className="mt-1 block text-xl text-foreground">{value} <span className="text-sm text-chart-4">{arrow}</span></strong><span className="text-[11px] text-muted-foreground">{note}</span></div>)}</div></div>
            <div className="rounded-xl border border-border bg-[var(--secondary)] p-5"><div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-chart-1">Action queue</p><h2 className="mt-1 text-lg font-semibold text-foreground">Deals requiring attention <span className="text-sm font-normal text-muted-foreground">(18)</span></h2></div><button className="text-foreground hover:text-foreground"><SlidersHorizontal size={16} /></button></div><div className="mt-3 divide-y divide-white/[0.06]">{attention.slice(0, 3).map(item => {
                  const Icon = item.icon;
                  return <article key={item.name} className="flex gap-3 py-3"><div className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${item.color}`}><Icon size={14} /></div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><strong className="truncate text-xs text-foreground">{item.name}</strong><span className={`text-[10px] ${item.severity === 'High' ? 'text-chart-5' : item.severity === 'Medium' ? 'text-foreground' : 'text-foreground'}`}>{item.severity}</span></div><p className="mt-1 truncate text-[11px] text-muted-foreground">{item.reason} · {item.owner}</p><button className="mt-1.5 text-[11px] font-medium text-foreground">{item.action} <span>→</span></button></div></article>;
                })}</div></div>
          </section>
          <section className="mt-8"><div className="mb-4 flex items-center gap-2"><div className="grid h-7 w-7 place-items-center rounded-lg bg-secondary/15 text-foreground"><Sparkles size={14} /></div><div><h2 className="text-lg font-semibold text-foreground">Lulu AI Deal Insights</h2><span className="text-[10px] uppercase tracking-widest text-muted-foreground">AI-generated intelligence</span></div><span className="rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] font-medium text-foreground">AI</span></div><div className="grid gap-3 lg:grid-cols-3">{[['Deal Risk', 'Enterprise Expansion has had no recorded activity for 16 days. Win probability may be declining.', 'Review Deal', 'border-chart-5/20', 'text-chart-5'], ['Deal Opportunity', 'Analytics Dashboard account is showing increased email engagement. Probability may be higher than current estimate.', 'View Deal', 'border-chart-4/20', 'text-chart-4'], ['Close-Date Risk', '4 open deals are approaching expected close dates without recent activity.', 'Review Pipeline', 'border-chart-1/20', 'text-chart-1']].map(([type, text, action, border, tone]) => <article key={type} className={`rounded-xl border ${border} bg-[var(--card)] p-4`}><div className="flex items-center justify-between"><span className={`text-[10px] font-semibold uppercase tracking-wider ${tone}`}>{type}</span><Sparkles size={14} className={tone} /></div><p className="mt-3 text-xs leading-5 text-muted-foreground">{text}</p><button className="mt-4 text-xs font-medium text-foreground">{action} <span>→</span></button></article>)}</div></section>
          <section className="mt-8 mb-10"><div className="mb-4 flex items-center gap-2"><h2 className="text-lg font-semibold text-foreground">AI Recommendations</h2><span className="rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] font-medium text-foreground">AI</span></div><div className="grid gap-3 lg:grid-cols-3">{[['Follow Up', 'Contact Anna Weber re: Enterprise Expansion', 'High', 'High', 'Create Task'], ['Update Stage', 'CRM Integration should move from Proposal to Negotiation based on recent activity', 'Medium', 'Medium', 'Review Deal'], ['Add Decision Maker', 'GlobalTech Inc deal missing key stakeholder', 'Medium', 'Medium', 'Review Deal']].map(([action, reason, priority, impact, cta]) => <article key={action} className="rounded-xl border border-border bg-[var(--card)] p-4"><div className="flex items-center justify-between"><strong className="text-sm text-foreground">{action}</strong><span className={`rounded-full px-2 py-1 text-[10px] ${priority === 'High' ? 'bg-chart-5/10 text-chart-5' : 'bg-secondary/10 text-foreground'}`}>Priority: {priority}</span></div><p className="mt-3 text-xs leading-5 text-muted-foreground">{reason}</p><div className="mt-4 flex items-center justify-between"><span className="text-[11px] text-muted-foreground">Expected impact: <strong className="text-foreground">{impact}</strong></span><button className="text-xs font-medium text-foreground">{cta} →</button></div></article>)}</div></section>
        </div>
      </main>
      <aside className="hidden w-10 shrink-0 border-l border-border bg-[var(--sidebar)] xl:block"><button className="flex h-full w-full flex-col items-center gap-3 pt-8 text-foreground hover:text-foreground" aria-label="Open deal preview"><PanelRight size={17} /><span className="[writing-mode:vertical-rl] text-[10px] uppercase tracking-[0.18em]">Deal Preview</span></button></aside>
    </div>
    {showCreate && <div className="fixed inset-0 z-20 flex items-start justify-end bg-primary/50 p-4 pt-20 backdrop-blur-sm"><div className="w-full max-w-[480px] rounded-2xl border border-border bg-[var(--secondary)] p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-[10px] uppercase tracking-[0.18em] text-foreground">New opportunity</p><h2 className="mt-1 text-xl font-semibold text-foreground">Create Deal</h2></div><button onClick={() => setShowCreate(false)} className="text-foreground hover:text-foreground" aria-label="Close create deal"><X size={18} /></button></div><div className="mt-6 grid grid-cols-2 gap-3">{['Deal Name*', 'Company*', 'Primary Contact', 'Stage', 'Status', 'Value*', 'Currency*', 'Probability', 'Expected Close Date*', 'Owner', 'Products', 'Lead Source'].map(label => <label key={label} className="text-[11px] text-muted-foreground"><span className="mb-1.5 block">{label}</span><input className="h-9 w-full rounded-lg border border-border bg-[var(--secondary)] px-3 text-xs text-foreground outline-none focus:border-border" placeholder={label.replace('*', '')} /></label>)}</div><label className="mt-3 block text-[11px] text-muted-foreground">Notes<textarea className="mt-1.5 h-16 w-full resize-none rounded-lg border border-border bg-[var(--secondary)] p-3 text-xs text-foreground outline-none focus:border-border" placeholder="Add context for your team..." /></label><div className="mt-4 flex gap-2 rounded-lg border border-border/20 bg-secondary/5 p-3 text-[11px] text-foreground"><CircleHelp size={14} className="shrink-0" /><span>Duplicate detection will run against existing deals when you create this opportunity.</span></div><div className="mt-6 flex justify-end gap-2"><button onClick={() => setShowCreate(false)} className="rounded-lg border border-border px-4 py-2 text-xs text-foreground">Cancel</button><button onClick={() => setShowCreate(false)} className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Create Deal</button></div></div></div>}
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
