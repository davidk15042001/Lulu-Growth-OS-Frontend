import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
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
const kpis: Kpi[] = [];

const stages: Stage[] = [];

const reps: Rep[] = [];

const activities: string[][] = [];

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
const periodOptions = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last 12 Months', 'Year to Date'];

export function SalesOverview() {
  const [period, setPeriod] = useState('Last 30 Days');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('Weekly');
  const [search, setSearch] = useState('');
  const { items: liveDeals, loading: liveLoading, error: liveError } = useLiveRecords('sales_deals');
  const liveEmpty = !liveLoading && !liveError && liveDeals.length === 0;
  const formatMoney = (amount: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: liveDeals[0]?.currency || 'EUR', maximumFractionDigits: 0 }).format(amount);
  const liveValues = liveDeals.map(record => Number(record.valueAmount || record.data?.value || 0)).filter(Number.isFinite);
  const totalPipeline = liveValues.reduce((sum, amount) => sum + amount, 0);
  const wonDeals = liveDeals.filter(record => /won|closed/i.test(`${record.status} ${record.stage || ''}`));
  const liveKpis: Kpi[] = [{ label: 'Total Pipeline', value: formatMoney(totalPipeline), delta: `${liveDeals.length} live deals`, tone: 'positive', note: 'Observed' }, { label: 'Weighted Pipeline', value: formatMoney(liveDeals.reduce((sum, record) => sum + Number(record.valueAmount || record.data?.value || 0) * Number(record.data?.probability || 0) / 100, 0)), delta: 'Calculated from probability', tone: 'positive', note: 'Calculated' }, { label: 'Won Revenue', value: formatMoney(wonDeals.reduce((sum, record) => sum + Number(record.valueAmount || record.data?.value || 0), 0)), delta: `${wonDeals.length} won`, tone: 'positive', note: 'Observed' }, { label: 'Open Deals', value: String(liveDeals.filter(record => !/won|lost|closed/i.test(`${record.status} ${record.stage || ''}`)).length), delta: 'Current workspace', tone: 'positive', note: 'Observed' }, { label: 'Average Deal', value: formatMoney(liveValues.length ? totalPipeline / liveValues.length : 0), delta: 'Across live records', tone: 'positive', note: 'Calculated' }];
  const stageNames = ['Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'];
  const liveStages: Stage[] = stageNames.map((name, index) => { const records = liveDeals.filter(record => `${record.stage || record.status || ''}`.toLowerCase().includes(name.toLowerCase().split(' ')[0])); const value = records.reduce((sum, record) => sum + Number(record.valueAmount || record.data?.value || 0), 0); return { name, value: formatMoney(value), opps: String(records.length), conversion: records.length ? `${Math.round(records.length / Math.max(liveDeals.length, 1) * 100)}% share` : 'No live records', time: 'Live data', color: ['var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-1)', 'var(--chart-5)'][index] }; });
  const filteredTeams = useMemo(() => ['Entire Sales Team', 'Enterprise', 'Mid-Market', 'Commercial'].filter(team => team.toLowerCase().includes(search.toLowerCase())), [search]);
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className={`fixed inset-y-0 left-0 z-20 w-[244px] bg-[var(--sidebar)] text-foreground transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}><div className="mb-5 flex items-center gap-3 px-2 py-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">L</div><span className="font-semibold text-foreground">Lulu AI</span></div><LuluSectionNavigation activeId="fine-park-8079" /></aside>
    <main className="lg:pl-[244px]"><header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-secondary px-5 backdrop-blur lg:px-8"><div className="flex items-center gap-3"><button onClick={() => setMobileNav(true)} className="text-foreground lg:hidden" aria-label="Open navigation"><Menu size={21} /></button><div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span>Sales</span><ChevronRight size={13} /><span className="font-medium text-foreground">Overview</span></div></div><div className="flex items-center gap-3"><button className="hidden rounded-lg border border-border p-2 text-foreground hover:bg-card sm:block" aria-label="Search"><Search size={17} /></button><button className="relative rounded-lg border border-border p-2 text-foreground hover:bg-card" aria-label="Notifications"><Bell size={17} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /></button><div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">JD</div></div></header>
      <div className="mx-auto max-w-[1480px] px-5 py-7 lg:px-8"><div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-2 text-xs font-medium text-muted-foreground">Sales / Overview</p><h1 className="text-3xl font-bold tracking-[-.04em] text-foreground">Sales Overview</h1><p className="mt-2 text-sm text-muted-foreground">Understand your sales performance, pipeline and revenue opportunities in one place.</p></div><div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-black/20 hover:bg-primary"><Plus size={16} /> Create Deal</button><button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground hover:bg-card"><Bot size={16} className="text-foreground" /> Ask Lulu AI</button><button className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground hover:bg-card sm:inline-flex"><FileText size={16} /> Create Report</button><button className="rounded-lg border border-border bg-card px-3 py-2.5 text-foreground hover:bg-card" aria-label="More options"><MoreHorizontal size={18} /></button></div></div>
        <div className="mt-7 flex flex-wrap items-center gap-3"><div className="relative"><button onClick={() => setPeriodOpen(!periodOpen)} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground shadow-sm"><CalendarDays size={16} className="text-foreground" />{period}<ChevronDown size={15} className="text-muted-foreground" /></button>{periodOpen && <div className="absolute left-0 top-12 z-10 w-48 rounded-lg border border-border bg-card p-1.5 shadow-xl">{periodOptions.map(option => <button key={option} onClick={() => {
                setPeriod(option);
                setPeriodOpen(false);
              }} className={`w-full rounded-md px-3 py-2 text-left text-xs ${period === option ? 'bg-secondary font-semibold text-foreground' : 'text-foreground hover:bg-card'}`}>{option}</button>)}</div>}</div><div className="relative"><button onClick={() => setTeamOpen(!teamOpen)} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground shadow-sm"><Users size={16} className="text-muted-foreground" />Entire Sales Team<ChevronDown size={15} className="text-muted-foreground" /></button>{teamOpen && <div className="absolute left-0 top-12 z-10 w-56 rounded-lg border border-border bg-card p-2 shadow-xl"><div className="mb-1 flex items-center gap-2 rounded-md border border-border px-2"><Search size={14} className="text-muted-foreground" /><input autoFocus value={search} onChange={event => setSearch(event.target.value)} placeholder="Search teams" className="w-full py-2 text-xs outline-none" /></div>{filteredTeams.map(team => <button key={team} onClick={() => setTeamOpen(false)} className="w-full rounded-md px-2 py-2 text-left text-xs text-foreground hover:bg-card">{team}</button>)}</div>}</div><span className="ml-auto hidden items-center gap-1.5 text-xs text-muted-foreground md:flex"><span className="h-2 w-2 rounded-full bg-primary text-primary-foreground" />Updated just now</span></div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">{liveLoading ? <div className="col-span-full rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading live sales overview…</div> : liveError ? <div className="col-span-full rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">{liveError}</div> : liveEmpty ? <div className="col-span-full rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">No live sales records are available yet. Connect a CRM platform or add deals to begin.</div> : liveKpis.map(kpi => <Card key={kpi.label} className="p-4"><div className="flex items-start justify-between gap-2"><p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>{kpi.note && <Badge tone="forecast">{kpi.note}</Badge>}</div><p className="mt-3 text-xl font-bold tracking-[-.03em] text-foreground">{kpi.value}</p><div className="mt-2 flex items-center justify-between"><span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${kpi.tone === 'negative' ? 'text-chart-5' : 'text-chart-4'}`}>{kpi.tone === 'negative' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}{kpi.delta}<span className="font-normal text-muted-foreground">vs prev</span></span>{kpi.points && <Sparkline points={kpi.points} tone={kpi.tone} />}</div></Card>)}</div>
        <div className="mt-5 grid gap-5 xl:grid-cols-3"><Card className="p-5 xl:col-span-1"><div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><h2 className="font-semibold text-foreground">Sales Health Score</h2><Badge tone="ai">AI / Calculated</Badge></div><p className="mt-1 text-xs text-muted-foreground">A composite view of your sales engine</p></div><span className="rounded-full bg-chart-4/10 px-2.5 py-1 text-xs font-bold text-chart-4">Healthy</span></div><div className="mt-5 flex items-center gap-5"><div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[9px] border-border border-t-border"><div className="text-center"><p className="text-2xl font-bold text-foreground">84</p><p className="text-[10px] text-muted-foreground">/ 100</p></div></div><div className="w-full space-y-2.5">{[['Revenue Performance', 88], ['Pipeline Health', 79], ['Conversion', 85], ['Sales Velocity', 76], ['Forecast Accuracy', 91], ['Activity Level', 82]].map(([label, score]) => <div key={String(label)}><div className="mb-1 flex justify-between text-[11px]"><span className="text-muted-foreground">{label}</span><strong className="text-foreground">{score}</strong></div><div className="h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary text-primary-foreground" style={{
                      width: `${score}%`
                    }} /></div></div>)}</div></div></Card><Card className="p-5 xl:col-span-2"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2"><h2 className="font-semibold text-foreground">Revenue Performance</h2><Badge>Actual</Badge><Badge tone="forecast">Forecast</Badge></div><p className="mt-1 text-xs text-muted-foreground">Revenue against target and previous period</p></div><div className="flex rounded-lg bg-secondary p-1">{['Daily', 'Weekly', 'Monthly', 'Quarterly'].map(item => <button key={item} onClick={() => setChartPeriod(item)} className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium ${chartPeriod === item ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}>{item}</button>)}</div></div><div className="mt-5 h-[190px] w-full"><svg viewBox="0 0 700 190" className="h-full w-full" preserveAspectRatio="none" role="img" aria-label="Revenue performance chart"><defs><linearGradient id="purpleArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--chart-2)" stopOpacity=".28" /><stop offset="1" stopColor="var(--chart-2)" stopOpacity="0" /></linearGradient></defs><path d="M0 150 C70 135,80 130,140 138 S210 95,270 112 S350 78,410 96 S500 45,555 65 S640 31,700 42 V190 H0Z" fill="url(#purpleArea)" /><path d="M0 150 C70 135,80 130,140 138 S210 95,270 112 S350 78,410 96 S500 45,555 65 S640 31,700 42" fill="none" stroke="var(--chart-2)" strokeWidth="3" /><path d="M0 120 C85 112,115 108,180 116 S280 92,350 100 S480 70,550 82 S640 61,700 60" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="5 6" /><path d="M0 165 C90 148,120 150,190 142 S280 122,350 130 S470 105,540 112 S620 92,700 98" fill="none" stroke="var(--border)" strokeWidth="2" /><g className="fill-muted-foreground text-[10px]"><text x="0" y="188">01 Jun</text><text x="220" y="188">08 Jun</text><text x="440" y="188">15 Jun</text><text x="650" y="188">30 Jun</text></g></svg></div><div className="mt-1 flex gap-5 text-[11px] text-muted-foreground"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-primary text-primary-foreground" />Actual Revenue</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full border border-border" />Target Revenue</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-muted" />Previous Period</span></div></Card></div>
        <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Pipeline Overview</h2><p className="mt-1 text-xs text-muted-foreground">Movement across active opportunities</p></div><button className="text-xs font-semibold text-foreground">View pipeline <ChevronRight className="inline" size={14} /></button></div><div className="mt-5 space-y-3">{liveStages.map(stage => <button key={stage.name} className="group w-full text-left"><div className="mb-1 flex items-center justify-between text-xs"><span className="font-medium text-foreground">{stage.name} <span className="ml-1 text-muted-foreground">{stage.opps}</span></span><span className="font-semibold text-foreground">{stage.value}</span></div><div className="h-3 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full transition-all group-hover:brightness-110" style={{
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
        <Card className="mt-5 p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Top Performers</h2><p className="mt-1 text-xs text-muted-foreground">Leading indicators across the team</p></div><Badge tone="positive">This period</Badge></div><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{[['Highest Revenue', 'Connected customer', '€340,000', 'SC', 'var(--primary)'], ['Highest Win Rate', 'Marcus Rodriguez', '84%', 'MR', 'var(--chart-4)'], ['Largest Deal', 'James Park', '€185,000', 'JP', 'var(--foreground)'], ['Highest Pipeline', 'Emma Wilson', '€1,240,000', 'EW', 'var(--chart-4)'], ['Most Improved', 'Tom Mitchell', '↑ 34%', 'TM', 'var(--primary)']].map(([label, name, value, initials, color]) => <div key={label} className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-bold text-foreground" style={{
                backgroundColor: color
              }}>{initials}</span><div className="min-w-0"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p><p className="truncate text-xs font-semibold">{name}</p><p className="text-sm font-bold text-foreground">{value}</p></div></div>)}</div></Card>
        <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Deals at Risk</h2><p className="mt-1 text-xs text-muted-foreground">Requires attention from the team</p></div><Badge tone="ai">AI assessed</Badge></div><div className="mt-4 space-y-3">{[['Connected customer Corp', 'Enterprise renewal', '€185,000', 'Negotiation', '14 days ago', 'No recent activity', 'red'], ['Northstar Health', 'Platform expansion', '€120,000', 'Proposal', '3 days ago', 'Probability decreasing', 'amber'], ['Brightline Co.', 'Annual contract', '€82,000', 'Qualified', '8 days ago', 'Close date approaching', 'amber'], ['Aperture Labs', 'Data package', '€64,000', 'Negotiation', '11 days ago', 'No recent activity', 'red']].map(([customer, deal, value, stage, last, reason, risk]) => <div key={customer} className="rounded-lg border border-border p-3"><div className="flex items-start gap-3"><span className={`mt-1 h-2 w-2 rounded-full ${risk === 'red' ? 'bg-destructive' : 'bg-chart-1'}`} /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><div><p className="text-xs font-semibold">{deal}</p><p className="text-[11px] text-muted-foreground">{customer} · {stage}</p></div><strong className="text-xs">{value}</strong></div><p className="mt-2 text-[11px] text-muted-foreground">{reason} · Last activity {last}</p><div className="mt-2 flex gap-3 text-[10px] font-semibold"><button className="text-foreground">Open Deal</button><button className="text-foreground">View AI Insight</button></div></div></div></div>)}</div></Card><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Sales Opportunities</h2><p className="mt-1 text-xs text-muted-foreground">Signals identified across your accounts</p></div><Badge tone="ai">AI-generated</Badge></div><div className="mt-4 space-y-2">{[['DataFlow', 'Upsell', '€78,000', '92%', 'Usage has increased 48%'], ['CloudBase', 'High-value open deal', '€64,000', '88%', 'Strong executive engagement'], ['RetailMax', 'Re-engagement', '€42,000', '81%', 'New buying signals detected'], ['TechVision', 'Cross-sell', '€36,000', '76%', 'Adjacent product fit'], ['Northstar Health', 'Dormant customer', '€28,000', '68%', 'Account activity resumed']].map(([customer, type, value, confidence, reason]) => <div key={customer} className="flex items-center gap-3 rounded-lg border border-border p-3"><Sparkles size={15} className="shrink-0 text-foreground" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><p className="text-xs font-semibold">{customer}</p><strong className="text-xs text-foreground">{value}</strong></div><p className="mt-1 text-[10px] text-muted-foreground">{type} · {reason}</p></div><span className="rounded bg-secondary px-2 py-1 text-[10px] font-bold text-foreground">{confidence}</span></div>)}</div></Card></div>
        <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="border-border bg-secondary/50 p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Bot size={18} className="text-foreground" /><h2 className="font-semibold text-foreground">AI Sales Insights</h2></div><Badge tone="ai">AI-generated</Badge></div><div className="mt-4 space-y-3">{[['Pipeline Risk', 'Several high-value opportunities have had no recent activity and may require follow-up.', '3 opportunities · €420,000 at risk', 'red'], ['Revenue Opportunity', 'Three existing customers show signals consistent with potential expansion opportunities.', 'Estimated upside · €180,000', 'green'], ['Forecast Risk', 'Current pipeline coverage may not be sufficient to reach the selected sales target.', '3.4× coverage vs 4.0× recommended', 'amber']].map(([title, body, evidence, tone]) => <div key={title} className="rounded-lg bg-secondary p-3"><div className="flex gap-3"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${tone === 'red' ? 'bg-destructive' : tone === 'green' ? 'bg-chart-4' : 'bg-primary'}`} /><div><p className="text-xs font-semibold text-foreground">{title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p><p className="mt-2 text-[10px] font-semibold text-foreground">{evidence}</p></div></div></div>)}</div></Card><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">AI Recommendations</h2><p className="mt-1 text-xs text-muted-foreground">Next best actions for your team</p></div><Badge tone="ai">AI-generated</Badge></div><div className="mt-4 space-y-3">{[['Follow up with 12 stalled deals', 'High priority'], ['Prioritize 3 high-value opportunities near close', 'High priority'], ['Improve pipeline coverage in Proposal stage', 'Medium priority'], ['Contact 5 dormant customers', 'Medium priority']].map(([recommendation, priority]) => <div key={recommendation} className="flex items-center gap-3 border-b border-border pb-3 last:border-0"><span className={`h-2 w-2 shrink-0 rounded-full ${priority.startsWith('High') ? 'bg-destructive' : 'bg-primary'}`} /><div className="min-w-0 flex-1"><p className="text-xs font-medium">{recommendation}</p><p className="mt-1 text-[10px] text-muted-foreground">{priority}</p></div><button className="hidden text-[11px] font-semibold text-foreground sm:block">Review</button><button className="rounded-md border border-border px-2 py-1 text-[10px] font-semibold text-foreground">Ask AI</button></div>)}</div><p className="mt-3 text-[10px] text-muted-foreground">AI recommendations do not automatically modify records.</p></Card></div>
        <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Sales Alerts</h2><button className="text-xs font-semibold text-foreground">View all</button></div><div className="mt-4 space-y-3">{[['High-value deal at risk', 'Connected customer Corp · €185,000 · no activity in 14 days', 'red'], ['Target behind schedule', '62% achieved with 8 days remaining', 'amber'], ['Pipeline coverage decreased', '3.4× down from 4.1×', 'amber'], ['Deal won', 'TechVision · €94,000 closed by Connected customer', 'blue']].map(([title, detail, tone]) => <div key={title} className="flex items-center gap-3"><span className={`flex h-7 w-7 items-center justify-center rounded-full ${tone === 'red' ? 'bg-chart-5/10 text-chart-5' : tone === 'amber' ? 'bg-chart-1/10 text-chart-1' : 'bg-secondary text-foreground'}`}>{tone === 'red' ? <ShieldAlert size={14} /> : tone === 'amber' ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}</span><div className="min-w-0 flex-1"><p className="text-xs font-semibold">{title}</p><p className="truncate text-[11px] text-muted-foreground">{detail}</p></div><button className="text-[10px] font-semibold text-foreground">Dismiss</button></div>)}</div></Card><Card className="p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Recent Activity</h2><button className="text-xs font-semibold text-foreground">View all</button></div><div className="mt-4 space-y-3">{activities.map(([action, record, user, time, color]) => <div key={action + record} className="flex items-center gap-3"><span className={`flex h-7 w-7 items-center justify-center rounded-full bg-${color}-50 text-${color}-600`}><Activity size={14} /></span><div className="min-w-0 flex-1"><p className="text-xs"><strong>{action}</strong> <span className="text-muted-foreground">· {record}</span></p><p className="text-[10px] text-muted-foreground">{user}</p></div><time className="text-[10px] text-muted-foreground">{time}</time></div>)}</div></Card></div>
        <div className="mt-5 flex flex-wrap gap-2"><p className="mr-2 flex items-center text-xs font-semibold text-muted-foreground">Quick actions</p>{['Create Deal', 'Create Lead', 'Create Task', 'Log Activity', 'Create Quote', 'Create Report', 'Ask Lulu AI'].map(action => <button key={action} className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:border-border hover:text-foreground">{action}</button>)}</div>
        <Card className="mt-5 mb-8 border-border bg-gradient-to-br from-secondary to-white p-5 sm:p-6"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Bot size={19} /></div><div><h2 className="font-semibold text-foreground">Ask Lulu AI</h2><p className="text-xs text-muted-foreground">Get answers grounded in your sales data</p></div><Badge tone="ai">AI assistant</Badge></div><div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm"><input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Ask Lulu AI about your sales..." aria-label="Ask Lulu AI about your sales" /><button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Ask</button></div><div className="mt-4 flex flex-wrap gap-2">{['How are sales performing this month?', 'Which deals are at risk?', 'Will we reach our sales target?', 'Which sales reps need attention?', 'What are our biggest opportunities?', 'Why is the pipeline changing?', 'Compare sales vs last month.', 'What should the team focus on today?'].map(prompt => <button key={prompt} className="rounded-full border border-border bg-card px-3 py-1.5 text-[11px] text-foreground hover:bg-secondary">{prompt}</button>)}</div></Card>
      </div></main>
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
  "label": "Website",
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
    "id": "website-settings-9019",
    "label": "Website Settings"
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
          <span data-lulu-section-soon={section.label !== "Website" ? "true" : undefined}>{section.label}</span>
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
