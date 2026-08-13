import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Bell, Bot, CalendarDays, ChevronDown, ChevronRight, FileText, Filter, Gauge, KanbanSquare, LayoutDashboard, Mail, MoreHorizontal, Plus, Search, Settings2, ShieldAlert, Sparkles, Target, TrendingUp, Users, X, CheckCircle2, AlertTriangle, DollarSign, Menu, Activity, Zap } from 'lucide-react';
type Tone = 'positive' | 'negative' | 'warning' | 'neutral' | 'ai' | 'forecast';
interface Kpi {
  label: string;
  value: string;
  delta: string;
  tone: Tone;
  note?: string;
  points?: string;
}
interface Stage {
  name: string;
  value: string;
  opps: string;
  conversion: string;
  time: string;
  color: string;
}
interface Rep {
  name: string;
  initials: string;
  color: string;
  revenue: string;
  target: string;
  achievement: number;
  won: number;
  lost: number;
  pipeline: string;
  win: string;
  avg: string;
  cycle: string;
}
const navGroups = [{
  label: 'Workspace',
  items: [{
    icon: LayoutDashboard,
    label: 'Overview'
  }, {
    icon: Gauge,
    label: 'Sales Overview',
    active: true
  }]
}, {
  label: 'Sales',
  items: [{
    icon: Users,
    label: 'Leads'
  }, {
    icon: KanbanSquare,
    label: 'Opportunities'
  }, {
    icon: TrendingUp,
    label: 'Pipeline'
  }, {
    icon: CheckCircle2,
    label: 'Deals'
  }, {
    icon: Activity,
    label: 'Activities'
  }, {
    icon: Target,
    label: 'Forecast'
  }, {
    icon: FileText,
    label: 'Analytics'
  }]
}, {
  label: 'Enablement',
  items: [{
    icon: Zap,
    label: 'Automation'
  }, {
    icon: FileText,
    label: 'Playbooks'
  }, {
    icon: Mail,
    label: 'Sequences'
  }, {
    icon: DollarSign,
    label: 'Products & Pricing'
  }, {
    icon: Users,
    label: 'Territories'
  }, {
    icon: Target,
    label: 'Commissions'
  }]
}];
const kpis: Kpi[] = [{
  label: 'Revenue',
  value: '€1,240,000',
  delta: '12.4%',
  tone: 'positive',
  points: '18,24,20,32,35,40,44,51,49,62'
}, {
  label: 'New Revenue',
  value: '€380,000',
  delta: '8.1%',
  tone: 'positive',
  points: '16,19,17,23,28,25,33,36,39,42'
}, {
  label: 'Pipeline Value',
  value: '€4,820,000',
  delta: '5.3%',
  tone: 'positive',
  points: '30,28,35,32,42,39,48,51,55,60'
}, {
  label: 'Weighted Pipeline',
  value: '€2,140,000',
  delta: '2.1%',
  tone: 'negative',
  note: 'Calculated',
  points: '55,51,52,47,49,44,43,39,41,37'
}, {
  label: 'Won Deals',
  value: '47',
  delta: '6',
  tone: 'positive',
  points: '20,21,25,24,28,34,31,39,42,48'
}, {
  label: 'Lost Deals',
  value: '18',
  delta: '3',
  tone: 'negative',
  points: '46,44,42,40,39,37,34,33,30,28'
}, {
  label: 'Win Rate',
  value: '72.3%',
  delta: '4.2%',
  tone: 'positive',
  points: '38,41,40,47,50,49,57,60,65,72'
}, {
  label: 'Avg Deal Size',
  value: '€26,383',
  delta: '3.8%',
  tone: 'positive'
}, {
  label: 'Sales Cycle',
  value: '24 days',
  delta: '2 days',
  tone: 'positive'
}, {
  label: 'Target Achievement',
  value: '62%',
  delta: '5%',
  tone: 'positive',
  points: '32,36,38,41,44,47,53,55,58,62'
}];
const stages: Stage[] = [{
  name: 'Lead',
  value: '€120,000',
  opps: '34 opps',
  conversion: '100%',
  time: '4 days',
  color: 'var(--foreground)'
}, {
  name: 'Qualified',
  value: '€280,000',
  opps: '28 opps',
  conversion: '82%',
  time: '8 days',
  color: 'var(--foreground)'
}, {
  name: 'Proposal',
  value: '€450,000',
  opps: '22 opps',
  conversion: '79%',
  time: '11 days',
  color: 'var(--foreground)'
}, {
  name: 'Negotiation',
  value: '€310,000',
  opps: '15 opps',
  conversion: '68%',
  time: '16 days',
  color: 'var(--foreground)'
}, {
  name: 'Closed Won',
  value: '€520,000',
  opps: '47 opps',
  conversion: '72%',
  time: '24 days',
  color: 'var(--foreground)'
}];
const reps: Rep[] = [{
  name: 'Sarah Chen',
  initials: 'SC',
  color: 'var(--foreground)',
  revenue: '€340,000',
  target: '€400,000',
  achievement: 85,
  won: 14,
  lost: 3,
  pipeline: '€920,000',
  win: '82%',
  avg: '€24,286',
  cycle: '21d'
}, {
  name: 'Marcus Rodriguez',
  initials: 'MR',
  color: 'var(--foreground)',
  revenue: '€284,000',
  target: '€350,000',
  achievement: 81,
  won: 12,
  lost: 2,
  pipeline: '€760,000',
  win: '84%',
  avg: '€23,667',
  cycle: '19d'
}, {
  name: 'James Park',
  initials: 'JP',
  color: 'var(--foreground)',
  revenue: '€246,000',
  target: '€330,000',
  achievement: 75,
  won: 9,
  lost: 5,
  pipeline: '€680,000',
  win: '64%',
  avg: '€27,333',
  cycle: '29d'
}, {
  name: 'Emma Wilson',
  initials: 'EW',
  color: 'var(--foreground)',
  revenue: '€218,000',
  target: '€320,000',
  achievement: 68,
  won: 8,
  lost: 4,
  pipeline: '€1,240,000',
  win: '67%',
  avg: '€27,250',
  cycle: '25d'
}, {
  name: 'Tom Mitchell',
  initials: 'TM',
  color: 'var(--foreground)',
  revenue: '€152,000',
  target: '€300,000',
  achievement: 51,
  won: 4,
  lost: 4,
  pipeline: '€520,000',
  win: '50%',
  avg: '€38,000',
  cycle: '31d'
}];
const activities = [['Deal Won', 'Acme Corp', 'Sarah Chen', '2h ago', 'green'], ['Stage Changed', 'TechVision deal → Negotiation', 'Marcus R.', '3h ago', 'purple'], ['Meeting Completed', 'Discovery call with DataFlow', 'James P.', '4h ago', 'blue'], ['Deal Created', 'CloudBase · €45,000', 'Emma W.', '5h ago', 'violet'], ['Task Completed', 'Follow-up with RetailMax', 'Tom M.', '6h ago', 'amber'], ['Note Added', 'Opportunity updated', 'Sarah C.', '8h ago', 'slate']];
const periodOptions = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Month to Date', 'Previous Month', 'Quarter to Date', 'Previous Quarter', 'Year to Date', 'Previous Year', 'Custom Range'];
function Badge({
  children,
  tone = 'neutral'
}: {
  children: string;
  tone?: Tone;
}) {
  const styles: Record<Tone, string> = {
    positive: 'bg-chart-4/10 text-chart-4',
    negative: 'bg-chart-5/10 text-chart-5',
    warning: 'bg-chart-1/10 text-chart-1',
    neutral: 'bg-secondary text-muted-foreground',
    ai: 'bg-secondary text-foreground',
    forecast: 'bg-secondary text-foreground'
  };
  return <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-[.08em] ${styles[tone]}`}>{children}</span>;
}
function Card({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`rounded-xl border border-border bg-card shadow-[0_2px_12px_rgba(0,0,0,0.035)] ${className}`}>{children}</section>;
}
function Sparkline({
  points = '10,20,14,25,22,30,28,38,34,44',
  tone = 'positive'
}: {
  points?: string;
  tone?: Tone;
}) {
  const color = tone === 'negative' ? 'var(--chart-5)' : 'var(--border)';
  const coords = points.split(',').map((point, index) => `${index * 11},${62 - Number(point)}`).join(' ');
  return <svg viewBox="0 0 100 64" className="h-10 w-20" role="img" aria-label="Trend sparkline"><polyline points={coords} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function SalesOverview() {
  const [period, setPeriod] = useState('Last 30 Days');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('Weekly');
  const [search, setSearch] = useState('');
  const filteredTeams = useMemo(() => ['Entire Sales Team', 'Enterprise', 'Mid-Market', 'Commercial'].filter(team => team.toLowerCase().includes(search.toLowerCase())), [search]);
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className={`fixed inset-y-0 left-0 z-20 w-[244px] bg-[var(--sidebar)] text-foreground transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-16 items-center gap-3 border-b border-border px-5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">L</div><span className="text-lg font-semibold tracking-tight text-foreground">Lulu <span className="font-normal text-muted-foreground">AI</span></span><button className="ml-auto text-foreground lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18} /></button></div>
      <div className="px-3 py-5">{navGroups.map(group => <div key={group.label} className="mb-6"><p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[.16em] text-muted-foreground">{group.label}</p>{group.items.map(item => <button key={item.label} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition ${item.active ? 'bg-secondary/20 font-semibold text-foreground ring-1 ring-ring/30' : 'text-foreground hover:bg-secondary hover:text-foreground'}`}><item.icon size={16} strokeWidth={1.8} /><span>{item.label}</span>{item.active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" />}</button>)}</div>)}</div>
      <div className="absolute bottom-0 w-full border-t border-border p-4"><button className="flex w-full items-center gap-3 text-sm text-foreground hover:text-foreground"><Settings2 size={17} /><span>Settings</span></button><div className="mt-4 flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">JD</div><div><p className="text-xs font-semibold text-foreground">Jordan Davis</p><p className="text-[11px] text-muted-foreground">Administrator</p></div><MoreHorizontal className="ml-auto text-muted-foreground" size={17} /></div></div>
    </aside>
    <main className="lg:pl-[244px]"><header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-secondary px-5 backdrop-blur lg:px-8"><div className="flex items-center gap-3"><button onClick={() => setMobileNav(true)} className="text-foreground lg:hidden" aria-label="Open navigation"><Menu size={21} /></button><div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span>Sales</span><ChevronRight size={13} /><span className="font-medium text-foreground">Overview</span></div></div><div className="flex items-center gap-3"><button className="hidden rounded-lg border border-border p-2 text-foreground hover:bg-card sm:block" aria-label="Search"><Search size={17} /></button><button className="relative rounded-lg border border-border p-2 text-foreground hover:bg-card" aria-label="Notifications"><Bell size={17} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /></button><div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">JD</div></div></header>
      <div className="mx-auto max-w-[1480px] px-5 py-7 lg:px-8"><div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-2 text-xs font-medium text-muted-foreground">Sales / Overview</p><h1 className="text-3xl font-bold tracking-[-.04em] text-foreground">Sales Overview</h1><p className="mt-2 text-sm text-muted-foreground">Understand your sales performance, pipeline and revenue opportunities in one place.</p></div><div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-black/20 hover:bg-primary"><Plus size={16} /> Create Deal</button><button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground hover:bg-card"><Bot size={16} className="text-foreground" /> Ask Lulu AI</button><button className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground hover:bg-card sm:inline-flex"><FileText size={16} /> Create Report</button><button className="rounded-lg border border-border bg-card px-3 py-2.5 text-foreground hover:bg-card" aria-label="More options"><MoreHorizontal size={18} /></button></div></div>
        <div className="mt-7 flex flex-wrap items-center gap-3"><div className="relative"><button onClick={() => setPeriodOpen(!periodOpen)} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground shadow-sm"><CalendarDays size={16} className="text-foreground" />{period}<ChevronDown size={15} className="text-muted-foreground" /></button>{periodOpen && <div className="absolute left-0 top-12 z-10 w-48 rounded-lg border border-border bg-card p-1.5 shadow-xl">{periodOptions.map(option => <button key={option} onClick={() => {
                setPeriod(option);
                setPeriodOpen(false);
              }} className={`w-full rounded-md px-3 py-2 text-left text-xs ${period === option ? 'bg-secondary font-semibold text-foreground' : 'text-foreground hover:bg-card'}`}>{option}</button>)}</div>}</div><div className="relative"><button onClick={() => setTeamOpen(!teamOpen)} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground shadow-sm"><Users size={16} className="text-muted-foreground" />Entire Sales Team<ChevronDown size={15} className="text-muted-foreground" /></button>{teamOpen && <div className="absolute left-0 top-12 z-10 w-56 rounded-lg border border-border bg-card p-2 shadow-xl"><div className="mb-1 flex items-center gap-2 rounded-md border border-border px-2"><Search size={14} className="text-muted-foreground" /><input autoFocus value={search} onChange={event => setSearch(event.target.value)} placeholder="Search teams" className="w-full py-2 text-xs outline-none" /></div>{filteredTeams.map(team => <button key={team} onClick={() => setTeamOpen(false)} className="w-full rounded-md px-2 py-2 text-left text-xs text-foreground hover:bg-card">{team}</button>)}</div>}</div><span className="ml-auto hidden items-center gap-1.5 text-xs text-muted-foreground md:flex"><span className="h-2 w-2 rounded-full bg-primary text-primary-foreground" />Updated just now</span></div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">{kpis.map(kpi => <Card key={kpi.label} className="p-4"><div className="flex items-start justify-between gap-2"><p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>{kpi.note && <Badge tone="forecast">{kpi.note}</Badge>}</div><p className="mt-3 text-xl font-bold tracking-[-.03em] text-foreground">{kpi.value}</p><div className="mt-2 flex items-center justify-between"><span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${kpi.tone === 'negative' ? 'text-chart-5' : 'text-chart-4'}`}>{kpi.tone === 'negative' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}{kpi.delta} <span className="font-normal text-muted-foreground">vs prev</span></span>{kpi.points && <Sparkline points={kpi.points} tone={kpi.tone} />}</div>{kpi.label === 'Target Achievement' && <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full w-[62%] rounded-full bg-primary text-primary-foreground" /></div>}</Card>)}</div>
        <div className="mt-5 grid gap-5 xl:grid-cols-3"><Card className="p-5 xl:col-span-1"><div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><h2 className="font-semibold text-foreground">Sales Health Score</h2><Badge tone="ai">AI / Calculated</Badge></div><p className="mt-1 text-xs text-muted-foreground">A composite view of your sales engine</p></div><span className="rounded-full bg-chart-4/10 px-2.5 py-1 text-xs font-bold text-chart-4">Healthy</span></div><div className="mt-5 flex items-center gap-5"><div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[9px] border-border border-t-border"><div className="text-center"><p className="text-2xl font-bold text-foreground">84</p><p className="text-[10px] text-muted-foreground">/ 100</p></div></div><div className="w-full space-y-2.5">{[['Revenue Performance', 88], ['Pipeline Health', 79], ['Conversion', 85], ['Sales Velocity', 76], ['Forecast Accuracy', 91], ['Activity Level', 82]].map(([label, score]) => <div key={String(label)}><div className="mb-1 flex justify-between text-[11px]"><span className="text-muted-foreground">{label}</span><strong className="text-foreground">{score}</strong></div><div className="h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary text-primary-foreground" style={{
                      width: `${score}%`
                    }} /></div></div>)}</div></div></Card><Card className="p-5 xl:col-span-2"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2"><h2 className="font-semibold text-foreground">Revenue Performance</h2><Badge>Actual</Badge><Badge tone="forecast">Forecast</Badge></div><p className="mt-1 text-xs text-muted-foreground">Revenue against target and previous period</p></div><div className="flex rounded-lg bg-secondary p-1">{['Daily', 'Weekly', 'Monthly', 'Quarterly'].map(item => <button key={item} onClick={() => setChartPeriod(item)} className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium ${chartPeriod === item ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}>{item}</button>)}</div></div><div className="mt-5 h-[190px] w-full"><svg viewBox="0 0 700 190" className="h-full w-full" preserveAspectRatio="none" role="img" aria-label="Revenue performance chart"><defs><linearGradient id="purpleArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--chart-2)" stopOpacity=".28" /><stop offset="1" stopColor="var(--chart-2)" stopOpacity="0" /></linearGradient></defs><path d="M0 150 C70 135,80 130,140 138 S210 95,270 112 S350 78,410 96 S500 45,555 65 S640 31,700 42 V190 H0Z" fill="url(#purpleArea)" /><path d="M0 150 C70 135,80 130,140 138 S210 95,270 112 S350 78,410 96 S500 45,555 65 S640 31,700 42" fill="none" stroke="var(--chart-2)" strokeWidth="3" /><path d="M0 120 C85 112,115 108,180 116 S280 92,350 100 S480 70,550 82 S640 61,700 60" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="5 6" /><path d="M0 165 C90 148,120 150,190 142 S280 122,350 130 S470 105,540 112 S620 92,700 98" fill="none" stroke="var(--border)" strokeWidth="2" /><g className="fill-muted-foreground text-[10px]"><text x="0" y="188">01 Jun</text><text x="220" y="188">08 Jun</text><text x="440" y="188">15 Jun</text><text x="650" y="188">30 Jun</text></g></svg></div><div className="mt-1 flex gap-5 text-[11px] text-muted-foreground"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-primary text-primary-foreground" />Actual Revenue</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full border border-border" />Target Revenue</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-muted" />Previous Period</span></div></Card></div>
        <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Pipeline Overview</h2><p className="mt-1 text-xs text-muted-foreground">Movement across active opportunities</p></div><button className="text-xs font-semibold text-foreground">View pipeline <ChevronRight className="inline" size={14} /></button></div><div className="mt-5 space-y-3">{stages.map(stage => <button key={stage.name} className="group w-full text-left"><div className="mb-1 flex items-center justify-between text-xs"><span className="font-medium text-foreground">{stage.name} <span className="ml-1 text-muted-foreground">{stage.opps}</span></span><span className="font-semibold text-foreground">{stage.value}</span></div><div className="h-3 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full transition-all group-hover:brightness-110" style={{
                    width: `${Math.max(25, Number(stage.value.replace(/[^0-9]/g, '')) / 5200)}%`,
                    backgroundColor: stage.color
                  }} /></div><div className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span>{stage.conversion} conversion</span><span>{stage.time} avg. time</span></div></button>)}</div></Card><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Pipeline Health</h2><p className="mt-1 text-xs text-muted-foreground">Quality and coverage signals</p></div><Badge tone="ai">Calculated</Badge></div><div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">{[['Total Pipeline', '€4,820,000', ''], ['Weighted Pipeline', '€2,140,000', 'Calculated'], ['Pipeline Coverage', '3.4×', 'Calculated'], ['Pipeline Growth', '↑ 5.3%', 'positive'], ['Stalled Opportunities', '12', 'warning'], ['Aging Opportunities', '8', 'warning'], ['Opportunities w/o Activity', '5', 'negative']].map(([label, value, kind]) => <div key={label} className="border-b border-border pb-3"><p className="text-[11px] text-muted-foreground">{label}</p><p className={`mt-1 text-lg font-bold ${kind === 'warning' ? 'text-chart-1' : kind === 'negative' ? 'text-chart-5' : kind === 'positive' ? 'text-chart-4' : 'text-foreground'}`}>{value}</p>{kind === 'Calculated' && <span className="text-[10px] text-muted-foreground">Calculated</span>}</div>)}</div></Card></div>
        <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Sales Funnel</h2><p className="mt-1 text-xs text-muted-foreground">From first touch to closed won</p></div><Filter size={16} className="text-muted-foreground" /></div><div className="mt-5 space-y-2">{[['Leads', '284', '—', '—', ''], ['Qualified', '142', '€1,820,000', '50% conv', '50% drop-off'], ['Opportunities', '98', '€3,240,000', '69% conv', '31% drop-off'], ['Proposals', '64', '€2,180,000', '65% conv', '35% drop-off'], ['Negotiations', '31', '€1,420,000', '48% conv', '52% drop-off'], ['Won', '22', '€580,000', '71% conv', '29% drop-off']].map(([label, count, value, conv, drop], index) => <div key={label} className="flex items-center gap-3"><div className="flex h-9 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-bold text-foreground" style={{
                  width: `${96 - index * 8}px`
                }}>{count}</div><div className="min-w-0 flex-1"><div className="flex justify-between text-xs"><strong>{label}</strong><span className="text-muted-foreground">{value}</span></div><div className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span>{conv}</span><span>{drop}</span></div></div></div>)}</div></Card><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Sales Velocity</h2><p className="mt-1 text-xs text-muted-foreground">How quickly pipeline becomes revenue</p></div><Badge tone="forecast">Calculated</Badge></div><div className="mt-5 grid grid-cols-2 gap-4"><div><p className="text-[11px] text-muted-foreground">New Opportunities</p><p className="mt-1 text-xl font-bold">38</p></div><div><p className="text-[11px] text-muted-foreground">Win Rate</p><p className="mt-1 text-xl font-bold">72.3%</p></div><div><p className="text-[11px] text-muted-foreground">Avg Deal Size</p><p className="mt-1 text-xl font-bold">€26,383</p></div><div><p className="text-[11px] text-muted-foreground">Avg Sales Cycle</p><p className="mt-1 text-xl font-bold">24 days</p></div></div><div className="mt-5 flex items-end justify-between rounded-lg bg-secondary p-4"><div><p className="text-xs text-foreground">Sales Velocity</p><p className="mt-1 text-2xl font-bold text-foreground">€29,847<span className="text-sm font-medium"> / day</span></p><p className="mt-1 text-[10px] text-chart-2">(opportunities × win rate × avg. deal) ÷ cycle</p></div><Sparkline points="24,18,23,20,30,27,36,32,42,48" /></div></Card></div>
        <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Sales Forecast</h2><p className="mt-1 text-xs text-muted-foreground">Current quarter forecast scenarios</p></div><Badge tone="forecast">Forecast</Badge></div><div className="mt-5 space-y-4">{[['Target', '€1,000,000', 'w-3/5', 'bg-muted'], ['Closed Won', '€620,000', 'w-[62%]', 'bg-primary'], ['Commit', '€820,000', 'w-[82%]', 'bg-primary'], ['Best Case', '€940,000', 'w-[94%]', 'bg-primary'], ['Pipeline', '€1,420,000', 'w-full', 'bg-primary']].map(([label, value, width, color]) => <div key={label}><div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><strong>{value}</strong></div><div className="h-2 rounded-full bg-secondary"><div className={`h-full rounded-full ${width} ${color}`} /></div></div>)}</div><button className="mt-5 text-xs font-semibold text-foreground">Open Forecast <ChevronRight className="inline" size={14} /></button></Card><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Sales Target</h2><p className="mt-1 text-xs text-muted-foreground">Quarterly team target</p></div><Target size={18} className="text-foreground" /></div><div className="mt-5 flex items-center gap-6"><div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[11px] border-border border-t-border border-r-border"><span className="text-2xl font-bold">62%</span></div><div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs"><div><span className="text-muted-foreground">Target</span><strong className="mt-1 block">€1,000,000</strong></div><div><span className="text-muted-foreground">Actual</span><strong className="mt-1 block text-foreground">€620,000</strong></div><div><span className="text-muted-foreground">Remaining</span><strong className="mt-1 block">€380,000</strong></div><div><span className="text-muted-foreground">Forecasted</span><strong className="mt-1 block text-foreground">€880,000</strong></div></div></div><div className="mt-5 h-2 rounded-full bg-secondary"><div className="h-full w-[62%] rounded-full bg-primary text-primary-foreground" /></div><p className="mt-2 text-[11px] text-muted-foreground">8 days remaining in the period</p></Card></div>
        <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Deal Performance</h2><p className="mt-1 text-xs text-muted-foreground">A snapshot of your deal book</p></div><Badge tone="negative">12 at risk</Badge></div><div className="mt-5 grid grid-cols-2 gap-4">{[['Open Deals', '86', '€3,200,000'], ['Won Deals', '47', '€1,240,000'], ['Lost Deals', '18', '€420,000'], ['Avg Deal Value', '€26,383', ''], ['Largest Deal', '€185,000', ''], ['Avg Sales Cycle', '24 days', '']].map(([label, value, sub]) => <div key={label}><p className="text-[11px] text-muted-foreground">{label}</p><p className="mt-1 font-bold text-foreground">{value}</p>{sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}</div>)}</div><button className="mt-5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground">View Deals</button></Card><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Sales Activity</h2><p className="mt-1 text-xs text-muted-foreground">Activity volume this period</p></div><Sparkline points="24,30,22,36,34,42,37,48,44,56" /></div><div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-6">{[['Calls', '142', '↑ 12%'], ['Emails', '318', '↑ 8%'], ['Meetings', '67', '↑ 14%'], ['Tasks', '94', '↑ 5%'], ['Notes', '53', '↓ 2%'], ['Follow-ups', '89', '↑ 11%']].map(([label, value, delta]) => <div key={label} className="text-center"><p className="text-[11px] text-muted-foreground">{label}</p><p className="mt-1 text-lg font-bold">{value}</p><p className={`text-[10px] ${delta.startsWith('↓') ? 'text-chart-5' : 'text-chart-4'}`}>{delta}</p></div>)}</div></Card></div>
        <Card className="mt-5 overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 p-5"><div><h2 className="font-semibold">Sales Team Performance</h2><p className="mt-1 text-xs text-muted-foreground">Performance against individual targets</p></div><button className="flex items-center gap-1 text-xs font-semibold text-foreground">Export <ChevronDown size={14} /></button></div><div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left text-xs"><thead className="border-y border-border bg-card/70 text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Sales Representative', 'Revenue', 'Target', 'Achievement', 'Won', 'Lost', 'Pipeline', 'Win Rate', 'Avg Deal Size', 'Sales Cycle', 'Actions'].map(heading => <th key={heading} className="whitespace-nowrap px-4 py-3 font-semibold">{heading} {heading !== 'Actions' && <ChevronDown className="inline" size={11} />}</th>)}</tr></thead><tbody>{reps.map((rep, index) => <tr key={rep.name} className={index % 2 === 1 ? 'bg-card/40' : 'bg-card'}><td className="px-4 py-3"><button className="flex items-center gap-2 font-semibold text-foreground hover:text-foreground"><span className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-foreground" style={{
                        backgroundColor: rep.color
                      }}>{rep.initials}</span>{rep.name}</button></td><td className="px-4 py-3 font-semibold">{rep.revenue}</td><td className="px-4 py-3 text-muted-foreground">{rep.target}</td><td className="px-4 py-3"><div className="flex items-center gap-2"><div className="h-1.5 w-14 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary text-primary-foreground" style={{
                          width: `${rep.achievement}%`
                        }} /></div><span className="font-semibold">{rep.achievement}%</span></div></td><td className="px-4 py-3 text-foreground">{rep.won}</td><td className="px-4 py-3 text-chart-5">{rep.lost}</td><td className="px-4 py-3">{rep.pipeline}</td><td className="px-4 py-3">{rep.win}</td><td className="px-4 py-3">{rep.avg}</td><td className="px-4 py-3">{rep.cycle}</td><td className="px-4 py-3"><button className="whitespace-nowrap font-semibold text-foreground">View Performance</button></td></tr>)}</tbody></table></div></Card>
        <Card className="mt-5 p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Top Performers</h2><p className="mt-1 text-xs text-muted-foreground">Leading indicators across the team</p></div><Badge tone="positive">This period</Badge></div><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{[['Highest Revenue', 'Sarah Chen', '€340,000', 'SC', 'var(--primary)'], ['Highest Win Rate', 'Marcus Rodriguez', '84%', 'MR', 'var(--chart-4)'], ['Largest Deal', 'James Park', '€185,000', 'JP', 'var(--foreground)'], ['Highest Pipeline', 'Emma Wilson', '€1,240,000', 'EW', 'var(--chart-4)'], ['Most Improved', 'Tom Mitchell', '↑ 34%', 'TM', 'var(--primary)']].map(([label, name, value, initials, color]) => <div key={label} className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-bold text-foreground" style={{
                backgroundColor: color
              }}>{initials}</span><div className="min-w-0"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p><p className="truncate text-xs font-semibold">{name}</p><p className="text-sm font-bold text-foreground">{value}</p></div></div>)}</div></Card>
        <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Deals at Risk</h2><p className="mt-1 text-xs text-muted-foreground">Requires attention from the team</p></div><Badge tone="ai">AI assessed</Badge></div><div className="mt-4 space-y-3">{[['Acme Corp', 'Enterprise renewal', '€185,000', 'Negotiation', '14 days ago', 'No recent activity', 'red'], ['Northstar Health', 'Platform expansion', '€120,000', 'Proposal', '3 days ago', 'Probability decreasing', 'amber'], ['Brightline Co.', 'Annual contract', '€82,000', 'Qualified', '8 days ago', 'Close date approaching', 'amber'], ['Aperture Labs', 'Data package', '€64,000', 'Negotiation', '11 days ago', 'No recent activity', 'red']].map(([customer, deal, value, stage, last, reason, risk]) => <div key={customer} className="rounded-lg border border-border p-3"><div className="flex items-start gap-3"><span className={`mt-1 h-2 w-2 rounded-full ${risk === 'red' ? 'bg-destructive' : 'bg-chart-1'}`} /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><div><p className="text-xs font-semibold">{deal}</p><p className="text-[11px] text-muted-foreground">{customer} · {stage}</p></div><strong className="text-xs">{value}</strong></div><p className="mt-2 text-[11px] text-muted-foreground">{reason} · Last activity {last}</p><div className="mt-2 flex gap-3 text-[10px] font-semibold"><button className="text-foreground">Open Deal</button><button className="text-foreground">View AI Insight</button></div></div></div></div>)}</div></Card><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Sales Opportunities</h2><p className="mt-1 text-xs text-muted-foreground">Signals identified across your accounts</p></div><Badge tone="ai">AI-generated</Badge></div><div className="mt-4 space-y-2">{[['DataFlow', 'Upsell', '€78,000', '92%', 'Usage has increased 48%'], ['CloudBase', 'High-value open deal', '€64,000', '88%', 'Strong executive engagement'], ['RetailMax', 'Re-engagement', '€42,000', '81%', 'New buying signals detected'], ['TechVision', 'Cross-sell', '€36,000', '76%', 'Adjacent product fit'], ['Northstar Health', 'Dormant customer', '€28,000', '68%', 'Account activity resumed']].map(([customer, type, value, confidence, reason]) => <div key={customer} className="flex items-center gap-3 rounded-lg border border-border p-3"><Sparkles size={15} className="shrink-0 text-foreground" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><p className="text-xs font-semibold">{customer}</p><strong className="text-xs text-foreground">{value}</strong></div><p className="mt-1 text-[10px] text-muted-foreground">{type} · {reason}</p></div><span className="rounded bg-secondary px-2 py-1 text-[10px] font-bold text-foreground">{confidence}</span></div>)}</div></Card></div>
        <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="border-border bg-secondary/50 p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Bot size={18} className="text-foreground" /><h2 className="font-semibold text-foreground">AI Sales Insights</h2></div><Badge tone="ai">AI-generated</Badge></div><div className="mt-4 space-y-3">{[['Pipeline Risk', 'Several high-value opportunities have had no recent activity and may require follow-up.', '3 opportunities · €420,000 at risk', 'red'], ['Revenue Opportunity', 'Three existing customers show signals consistent with potential expansion opportunities.', 'Estimated upside · €180,000', 'green'], ['Forecast Risk', 'Current pipeline coverage may not be sufficient to reach the selected sales target.', '3.4× coverage vs 4.0× recommended', 'amber']].map(([title, body, evidence, tone]) => <div key={title} className="rounded-lg bg-secondary p-3"><div className="flex gap-3"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${tone === 'red' ? 'bg-destructive' : tone === 'green' ? 'bg-chart-4' : 'bg-primary'}`} /><div><p className="text-xs font-semibold text-foreground">{title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p><p className="mt-2 text-[10px] font-semibold text-foreground">{evidence}</p></div></div></div>)}</div></Card><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">AI Recommendations</h2><p className="mt-1 text-xs text-muted-foreground">Next best actions for your team</p></div><Badge tone="ai">AI-generated</Badge></div><div className="mt-4 space-y-3">{[['Follow up with 12 stalled deals', 'High priority'], ['Prioritize 3 high-value opportunities near close', 'High priority'], ['Improve pipeline coverage in Proposal stage', 'Medium priority'], ['Contact 5 dormant customers', 'Medium priority']].map(([recommendation, priority]) => <div key={recommendation} className="flex items-center gap-3 border-b border-border pb-3 last:border-0"><span className={`h-2 w-2 shrink-0 rounded-full ${priority.startsWith('High') ? 'bg-destructive' : 'bg-primary'}`} /><div className="min-w-0 flex-1"><p className="text-xs font-medium">{recommendation}</p><p className="mt-1 text-[10px] text-muted-foreground">{priority}</p></div><button className="hidden text-[11px] font-semibold text-foreground sm:block">Review</button><button className="rounded-md border border-border px-2 py-1 text-[10px] font-semibold text-foreground">Ask AI</button></div>)}</div><p className="mt-3 text-[10px] text-muted-foreground">AI recommendations do not automatically modify records.</p></Card></div>
        <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Sales Alerts</h2><button className="text-xs font-semibold text-foreground">View all</button></div><div className="mt-4 space-y-3">{[['High-value deal at risk', 'Acme Corp · €185,000 · no activity in 14 days', 'red'], ['Target behind schedule', '62% achieved with 8 days remaining', 'amber'], ['Pipeline coverage decreased', '3.4× down from 4.1×', 'amber'], ['Deal won', 'TechVision · €94,000 closed by Sarah Chen', 'blue']].map(([title, detail, tone]) => <div key={title} className="flex items-center gap-3"><span className={`flex h-7 w-7 items-center justify-center rounded-full ${tone === 'red' ? 'bg-chart-5/10 text-chart-5' : tone === 'amber' ? 'bg-chart-1/10 text-chart-1' : 'bg-secondary text-foreground'}`}>{tone === 'red' ? <ShieldAlert size={14} /> : tone === 'amber' ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}</span><div className="min-w-0 flex-1"><p className="text-xs font-semibold">{title}</p><p className="truncate text-[11px] text-muted-foreground">{detail}</p></div><button className="text-[10px] font-semibold text-foreground">Dismiss</button></div>)}</div></Card><Card className="p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Recent Activity</h2><button className="text-xs font-semibold text-foreground">View all</button></div><div className="mt-4 space-y-3">{activities.map(([action, record, user, time, color]) => <div key={action + record} className="flex items-center gap-3"><span className={`flex h-7 w-7 items-center justify-center rounded-full bg-${color}-50 text-${color}-600`}><Activity size={14} /></span><div className="min-w-0 flex-1"><p className="text-xs"><strong>{action}</strong> <span className="text-muted-foreground">· {record}</span></p><p className="text-[10px] text-muted-foreground">{user}</p></div><time className="text-[10px] text-muted-foreground">{time}</time></div>)}</div></Card></div>
        <div className="mt-5 flex flex-wrap gap-2"><p className="mr-2 flex items-center text-xs font-semibold text-muted-foreground">Quick actions</p>{['Create Deal', 'Create Lead', 'Create Task', 'Log Activity', 'Create Quote', 'Create Report', 'Ask Lulu AI'].map(action => <button key={action} className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:border-border hover:text-foreground">{action}</button>)}</div>
        <Card className="mt-5 mb-8 border-border bg-gradient-to-br from-secondary to-white p-5 sm:p-6"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Bot size={19} /></div><div><h2 className="font-semibold text-foreground">Ask Lulu AI</h2><p className="text-xs text-muted-foreground">Get answers grounded in your sales data</p></div><Badge tone="ai">AI assistant</Badge></div><div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm"><input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Ask Lulu AI about your sales..." aria-label="Ask Lulu AI about your sales" /><button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Ask</button></div><div className="mt-4 flex flex-wrap gap-2">{['How are sales performing this month?', 'Which deals are at risk?', 'Will we reach our sales target?', 'Which sales reps need attention?', 'What are our biggest opportunities?', 'Why is the pipeline changing?', 'Compare sales vs last month.', 'What should the team focus on today?'].map(prompt => <button key={prompt} className="rounded-full border border-border bg-card px-3 py-1.5 text-[11px] text-foreground hover:bg-secondary">{prompt}</button>)}</div></Card>
      </div></main>
  </div>;
}