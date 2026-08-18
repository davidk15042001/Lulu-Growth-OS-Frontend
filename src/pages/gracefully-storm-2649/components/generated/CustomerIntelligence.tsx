import { useMemo, useState, type ReactNode } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Brain, Building2, CalendarDays, Check, CheckCircle2, ChevronDown, CircleDollarSign, Clock3, Filter, Gauge, Layers3, Menu, RefreshCw, Search, Settings, ShieldAlert, Sparkles, Target, UserRound, Users, X } from 'lucide-react';
type Tone = 'green' | 'blue' | 'amber' | 'red' | 'gray' | 'purple';
type IconType = typeof Users;
const navItems: {
  label: string;
  icon: IconType;
}[] = [{
  label: 'CRM',
  icon: Users
}, {
  label: 'Contacts',
  icon: UserRound
}, {
  label: 'Companies',
  icon: Building2
}, {
  label: 'Leads',
  icon: Target
}, {
  label: 'Deals',
  icon: CircleDollarSign
}, {
  label: 'Pipeline',
  icon: BarChart3
}, {
  label: 'Activities',
  icon: Activity
}, {
  label: 'Tasks',
  icon: CheckCircle2
}, {
  label: 'Customer Segments',
  icon: Layers3
}, {
  label: 'Customer Intelligence',
  icon: Brain
}];
const kpis: any[][] = [];
const health: any[][] = [];
const values: any[][] = [];
const lifecycle: any[][] = [];
const topCustomers: any[][] = [];
const growing: any[][] = [];
const attention: any[][] = [];
const insights: any[][] = [];
const opportunities: any[][] = [];
const risks: any[][] = [];
const movement: any[][] = [];
const cohorts: [string, string[]][] = [];
function toneClass(tone: string, text = false) {
  const map: Record<string, string> = {
    green: 'emerald',
    blue: 'blue',
    amber: 'amber',
    red: 'rose',
    gray: 'slate',
    purple: 'indigo'
  };
  return `${text ? 'text' : 'bg'}-${map[tone] ?? 'slate'}-${text ? '600' : '500'}`;
}
function Panel({
  title,
  eyebrow,
  children,
  className = '',
  tint = false
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  tint?: boolean;
}) {
  return <section className={`rounded-2xl border p-5 shadow-[0_1px_2px_rgba(0,0,0,.03)] ${tint ? 'border-border bg-[var(--card)]' : 'border-border bg-card'} ${className}`}><header className="mb-5 flex items-start justify-between gap-4"><div>{eyebrow && <p className="text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">{eyebrow}</p>}<h2 className="mt-1 text-[17px] font-bold tracking-[-.02em] text-foreground">{title}</h2></div></header>{children}</section>;
}
function MiniLine({
  color = 'var(--foreground)',
  points = ''
}: {
  color?: string;
  points?: string;
}) {
  return <svg viewBox="0 0 168 50" className="h-14 w-full" role="img" aria-label="Trend chart"><path d="M0 46H168" stroke="var(--border)" /><polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Sidebar({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  return <aside className={`${open ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-30 w-[248px] flex-col bg-[var(--sidebar)] px-4 py-5 lg:flex`}><div className="flex items-center justify-between px-2"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-lg font-extrabold text-primary-foreground">L</div><strong className="text-[15px] text-foreground">Lulu AI</strong></div><button className="text-foreground lg:hidden" onClick={onClose} aria-label="Close navigation"><X size={18} /></button></div><div className="mt-9 px-2 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">Workspace</div><LuluSectionNavigation activeId="gracefully-storm-2649" /><div className="my-5 border-t border-border" /><button className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-foreground hover:text-foreground"><Settings size={16} /><span>Settings</span></button><div className="mt-auto border-t border-border pt-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-muted text-xs font-semibold text-foreground">JD</div><div><p className="text-[13px] font-semibold text-foreground">Workspace member</p><p className="text-[11px] text-muted-foreground">CRM Manager</p></div></div><p className="mt-4 flex items-center gap-2 text-[11px] text-chart-4"><span className="h-2 w-2 rounded-full bg-chart-4" />AI Active</p></div></aside>;
}
export function CustomerIntelligence() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [date, setDate] = useState('Last 30 Days');
  const [compare, setCompare] = useState('Previous Period');
  const [growthView, setGrowthView] = useState('Daily');
  const [rank, setRank] = useState('Revenue');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [refreshed, setRefreshed] = useState(false);
  const filteredCustomers = useMemo(() => topCustomers.filter(row => row[0].toLowerCase().includes(query.toLowerCase())), [query]);
  const selectClass = 'rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground outline-none focus:ring-2 focus:ring-ring';
  return <div className="min-h-screen bg-[var(--background)] text-foreground"><Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} /><main className="lg:ml-[248px]"><div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8"><div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground"><button onClick={() => setMenuOpen(true)} className="mr-2 rounded-lg border border-border bg-card p-2 lg:hidden" aria-label="Open navigation"><Menu size={17} /></button><span>CRM</span><span>/</span><strong className="text-muted-foreground">Customer Intelligence</strong></div><header className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">Connected customer analytics</p><h1 className="text-3xl font-extrabold tracking-[-.04em] text-muted-foreground sm:text-[38px]">Customer Intelligence</h1><p className="mt-2 max-w-2xl text-[14px] leading-6 text-muted-foreground">Understand your customers, identify important patterns and discover opportunities and risks across your customer base.</p></div><div className="flex flex-wrap items-center gap-2"><select className={selectClass} value={date} onChange={e => setDate(e.target.value)} aria-label="Date range"><option>Today</option><option>Last 7 Days</option><option>Last 30 Days</option><option>Last 90 Days</option><option>Last 12 Months</option><option>Year to Date</option><option>Custom Range</option></select><select className={selectClass} value={compare} onChange={e => setCompare(e.target.value)} aria-label="Compare period"><option>Previous Period</option><option>Previous Year</option><option>Custom</option></select><button onClick={() => {
              setRefreshed(true);
              setTimeout(() => setRefreshed(false), 1600);
            }} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:border-border focus:ring-2 focus:ring-ring" aria-label="Refresh data"><RefreshCw size={14} className={refreshed ? 'animate-spin' : ''} />{refreshed ? 'Updated' : 'Refresh'}</button></div></header><div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{kpis.map(([label, value, support, tone]) => <article key={label} className="rounded-xl border border-border bg-card p-4"><p className="min-h-8 text-[10px] font-bold uppercase leading-4 tracking-[.12em] text-muted-foreground">{label}</p><p className="mt-2 text-[23px] font-extrabold tracking-[-.04em] text-foreground">{value}</p><p className={`mt-1 text-[11px] ${toneClass(tone, true)}`}>{support}</p></article>)}</div><div className="mb-6 grid gap-6 xl:grid-cols-[1.35fr_.65fr]"><Panel title="Customer Intelligence Score" eyebrow="Executive signal" className="overflow-hidden"><div className="flex flex-col gap-6 md:flex-row md:items-center"><div className="relative grid h-36 w-36 shrink-0 place-items-center"><svg className="col-start-1 row-start-1 h-full w-full -rotate-90" viewBox="0 0 120 120"><circle cx="60" cy="60" r="49" fill="none" stroke="var(--border)" strokeWidth="9" /><circle cx="60" cy="60" r="49" fill="none" stroke="var(--chart-3)" strokeWidth="9" strokeDasharray="0 308" strokeLinecap="round" /></svg><div className="col-start-1 row-start-1 text-center"><strong className="block text-3xl font-extrabold">—</strong><span className="text-xs text-muted-foreground">/ 100</span></div></div><div className="flex-1"><div className="flex items-center gap-2"><span className="rounded-full bg-chart-4/10 px-2.5 py-1 text-xs font-bold text-chart-4">Strong</span><span className="text-xs text-muted-foreground">Awaiting connected data</span></div><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Customer growth, engagement and retention signals are currently strong, while a smaller group of customers shows declining activity.</p><div className="mt-5 flex flex-wrap gap-8 border-t border-border pt-4"><div><span className="block text-[11px] text-muted-foreground">Previous score</span><strong className="text-lg">—</strong></div><div><span className="block text-[11px] text-muted-foreground">Change</span><strong className="text-lg text-muted-foreground">—</strong></div><div><span className="block text-[11px] text-muted-foreground">Status</span><strong className="text-lg text-muted-foreground">No live score</strong></div></div></div></div></Panel><Panel title="Saved filters" eyebrow="Quick access"><div className="flex flex-wrap gap-2">{['High-Value Customers', 'Growing Customers', 'At-Risk Customers', 'Inactive Customers', 'High Engagement', 'Revenue Concentration', 'Recent Customers'].map(item => <button key={item} className="rounded-full border border-border bg-secondary px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary">{item}</button>)}</div><button onClick={() => setFiltersOpen(!filtersOpen)} className="mt-5 flex items-center gap-2 text-xs font-bold text-foreground">{filtersOpen ? 'Hide' : 'Show'} advanced filters <ChevronDown size={14} className={filtersOpen ? 'rotate-180' : ''} /></button>{filtersOpen && <div className="mt-4 space-y-3 border-t border-border pt-4"><label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground"><Search size={14} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Customer search" className="w-full outline-none" /></label><div className="grid grid-cols-2 gap-2"><select className={selectClass} aria-label="Segment"><option>All segments</option><option>High Value</option><option>At Risk</option></select><select className={selectClass} aria-label="Health"><option>All health</option><option>Healthy</option><option>At Risk</option></select></div><button className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">Save Filter</button><button className="ml-2 text-xs text-foreground">Clear Filters</button></div>}</Panel></div><div className="mb-6 grid gap-6 xl:grid-cols-2"><Panel title="Customer Health" eyebrow="Who are our customers?"><div className="space-y-4">{health.map(([label, count, percent, revenue, trend, tone]) => <div key={label}><div className="mb-1 flex items-center justify-between text-xs"><span className="flex items-center gap-2 font-semibold text-foreground"><span className={`h-2.5 w-2.5 rounded-full ${toneClass(tone)}`} />{label}</span><span className="text-muted-foreground">{count} · {percent}</span></div><div className="h-2 rounded-full bg-secondary"><div className={`h-full rounded-full ${toneClass(tone)}`} style={{
                    width: percent
                  }} /></div><div className="mt-1 flex justify-between text-[11px] text-muted-foreground"><span>Revenue contribution {revenue}</span><span className={trend.startsWith('+') ? 'text-chart-4' : 'text-foreground'}>{trend} <ArrowUpRight size={12} className="inline" /></span></div></div>)}</div></Panel><Panel title="Customer Value" eyebrow="What are they worth?"><div className="mb-5 flex h-3 overflow-hidden rounded-full">{values.map(([,,,, percent, tone]) => <span key={tone} className={toneClass(tone)} style={{
                width: percent
              }} />)}</div><div className="space-y-4">{values.map(([label, count, revenue, avg, percent, tone]) => <div key={label} className="grid grid-cols-[1fr_auto] gap-2 border-b border-border pb-3 last:border-0"><div><p className="text-xs font-bold text-foreground">{label}</p><p className="mt-1 text-[11px] text-muted-foreground">{count} customers · {avg} avg</p></div><div className="text-right"><p className="text-xs font-bold text-foreground">{revenue}</p><p className="mt-1 text-[11px] text-foreground">{percent} of revenue</p></div></div>)}</div></Panel></div><Panel title="Customer Lifecycle" eyebrow="How are they changing?" className="mb-6"><div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-7">{lifecycle.map(([stage, count, percent, change, tone]) => <div key={stage} className="border-l-2 border-border pl-3"><span className={`text-[10px] font-bold uppercase tracking-wider ${toneClass(tone, true)}`}>{stage}</span><strong className="mt-2 block text-lg">{count}</strong><span className="text-[11px] text-muted-foreground">{percent}</span><p className={`mt-2 text-[11px] font-semibold ${change.startsWith('+') ? 'text-chart-4' : 'text-chart-5'}`}>{change} vs prior</p></div>)}</div></Panel><div className="mb-6 grid gap-6 xl:grid-cols-2"><Panel title="Customer Engagement" eyebrow="How active are they?"><div className="grid grid-cols-[1fr_120px] items-center gap-5"><div className="space-y-3">{([] as string[][]).map(([label, count, percent, tone]) => <div key={label}><div className="flex justify-between text-xs"><span className="font-semibold">{label}</span><span className="text-muted-foreground">{count} · {percent}</span></div><div className="mt-1 h-1.5 rounded bg-secondary"><div className={`h-full rounded ${toneClass(tone)}`} style={{
                      width: percent
                    }} /></div></div>)}</div><div className="space-y-3 text-right"><div><span className="block text-[11px] text-muted-foreground">Recent activities</span><strong>—</strong></div><div><span className="block text-[11px] text-muted-foreground">Purchases</span><strong>—</strong></div><div><span className="block text-[11px] text-muted-foreground">Meetings</span><strong>—</strong></div></div></div></Panel><Panel title="Customer Growth" eyebrow="New, returning and declining"><div className="mb-2 flex items-center justify-between"><div><strong className="text-2xl">—</strong><span className="ml-2 text-xs text-muted-foreground">Awaiting comparison</span></div><div className="flex rounded-lg bg-secondary p-1">{['Daily', 'Weekly', 'Monthly'].map(view => <button key={view} onClick={() => setGrowthView(view)} className={`rounded px-2 py-1 text-[10px] ${growthView === view ? 'bg-card font-bold text-foreground shadow-sm' : 'text-foreground'}`}>{view}</button>)}</div></div><MiniLine /><div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-5">{([] as string[][]).map(([label, value, tone]) => <div key={label}><span className="block text-muted-foreground">{label}</span><strong className={toneClass(tone, true)}>{value}</strong></div>)}</div></Panel></div><div className="mb-6 grid gap-6 xl:grid-cols-2"><Panel title="Customer Retention" eyebrow="Are we keeping them?"><div className="flex items-end justify-between"><div><strong className="text-3xl text-muted-foreground">—</strong><p className="mt-1 text-xs text-muted-foreground">Retention rate · <span className="text-foreground">8.8% churn</span></p></div><span className="text-xs text-muted-foreground">Awaiting comparison</span></div><MiniLine color="var(--chart-4)" points="" /><div className="flex justify-between text-xs text-muted-foreground"><span>Returning customer rate <strong className="text-foreground">—</strong></span><span>Current vs previous</span></div></Panel><Panel title="Customer Revenue" eyebrow="What is the commercial outcome?"><div className="grid grid-cols-2 gap-4 sm:grid-cols-4"><div><span className="text-[11px] text-muted-foreground">Total</span><strong className="mt-1 block text-lg">—</strong></div><div><span className="text-[11px] text-muted-foreground">Growth</span><strong className="mt-1 block text-lg text-muted-foreground">—</strong></div><div><span className="text-[11px] text-muted-foreground">Per customer</span><strong className="mt-1 block text-lg">—</strong></div><div><span className="text-[11px] text-muted-foreground">Avg value</span><strong className="mt-1 block text-lg">—</strong></div></div><div className="mt-3 flex h-12 items-end gap-1">{([] as number[]).map((height, month) => <span key={month} className="flex-1 rounded-t bg-secondary" style={{
                height: `${height}%`
              }} />)}</div></Panel></div><Panel title="Revenue Concentration" eyebrow="Portfolio exposure" className="mb-6"><div className="grid items-center gap-6 lg:grid-cols-[.8fr_1.2fr]"><div className="space-y-4">{([] as string[][]).map(([label, value]) => <div key={label} className="flex items-center justify-between border-b border-border pb-3"><span className="text-xs text-muted-foreground">{label}</span><strong className="text-sm text-foreground">{value}</strong></div>)}</div><div><svg viewBox="0 0 520 150" className="h-36 w-full" role="img" aria-label="Revenue concentration curve"><path d="M18 134H510M18 134C110 98 155 83 224 64S355 25 510 14" fill="none" stroke="var(--chart-3)" strokeWidth="3" /><path d="M18 134L510 14" fill="none" stroke="var(--border)" strokeDasharray="5 5" /><circle cx="224" cy="64" r="5" fill="var(--chart-3)" /><circle cx="355" cy="35" r="5" fill="var(--foreground)" /><text x="18" y="148" fill="var(--muted-foreground)" fontSize="11">Customer rank</text><text x="440" y="148" fill="var(--muted-foreground)" fontSize="11">Revenue share</text></svg></div></div></Panel><div className="mb-6 grid gap-6 xl:grid-cols-2"><Panel title="Top Customers" eyebrow="Rank by"><div className="mb-4 flex items-center justify-between"><p className="text-xs text-muted-foreground">No live customer accounts available</p><select className={selectClass} value={rank} onChange={e => setRank(e.target.value)} aria-label="Rank top customers"><option>Revenue</option><option>Customer Value</option><option>Growth</option><option>Engagement</option><option>Purchase Frequency</option></select></div><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3">Customer</th><th className="pb-3">Revenue</th><th className="pb-3">Growth</th><th className="pb-3">Engagement</th><th className="pb-3">Last active</th><th className="pb-3 text-right"> </th></tr></thead><tbody>{filteredCustomers.map(row => <tr key={row[0]} className="border-b border-border last:border-0"><td className="py-3 font-semibold text-foreground">{row[0]}</td><td className="py-3">{row[1]}</td><td className={row[2].startsWith('+') ? 'py-3 text-foreground' : 'py-3 text-chart-5'}>{row[2]}</td><td className="py-3"><span className="rounded-full bg-secondary px-2 py-1 text-[10px]">{row[3]}</span></td><td className="py-3 text-muted-foreground">{row[5]}</td><td className="py-3 text-right"><button className="font-bold text-foreground">Open</button></td></tr>)}</tbody></table></div></Panel><Panel title="Fastest-Growing Customers" eyebrow="Momentum"><div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-xs"><thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3">Customer</th><th className="pb-3">Growth</th><th className="pb-3">Previous</th><th className="pb-3">Current</th><th className="pb-3 text-right"> </th></tr></thead><tbody>{growing.map(row => <tr key={row[0]} className="border-b border-border last:border-0"><td className="py-3 font-semibold">{row[0]}</td><td className="py-3 font-bold text-chart-4">{row[1]}</td><td className="py-3 text-muted-foreground">{row[2]}</td><td className="py-3">{row[3]}</td><td className="py-3 text-right"><button className="font-bold text-foreground">Open</button></td></tr>)}</tbody></table></div></Panel></div><Panel title="Customers Requiring Attention" eyebrow="Action queue" className="mb-6"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-xs"><thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3">Customer</th><th className="pb-3">Signal</th><th className="pb-3">Severity</th><th className="pb-3">Last seen</th><th className="pb-3">Owner</th><th className="pb-3 text-right"> </th></tr></thead><tbody>{attention.map(row => <tr key={row[0]} className="border-b border-border last:border-0"><td className="py-3 font-semibold">{row[0]}</td><td className="py-3 text-muted-foreground">{row[1]}</td><td className="py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${row[2] === 'High' ? 'bg-chart-5/10 text-chart-5' : row[2] === 'Medium' ? 'bg-secondary text-foreground' : 'bg-secondary text-muted-foreground'}`}>{row[2]}</span></td><td className="py-3 text-muted-foreground">{row[3]}</td><td className="py-3 text-muted-foreground">{row[4]}</td><td className="py-3 text-right"><button className="font-bold text-foreground">Review</button></td></tr>)}</tbody></table></div></Panel><Panel title="Lulu AI Customer Insights" eyebrow="AI-powered guidance" tint className="mb-6"><div className="mb-4 flex items-center gap-2"><Sparkles size={18} className="text-foreground" /><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-foreground">AI-Generated</span><span className="text-xs text-muted-foreground">Updated 2h ago</span></div><div className="grid gap-3 md:grid-cols-3">{insights.map(([title, impact, supported, confidence, tone]) => <article key={title} className="rounded-xl border border-border bg-secondary p-4"><div className="flex items-center justify-between"><span className={`text-xs font-bold ${toneClass(tone, true)}`}>{impact}</span><span className="text-[11px] text-muted-foreground">{confidence} confidence</span></div><h3 className="mt-3 text-sm font-bold leading-5">{title}</h3><p className="mt-3 text-[11px] text-muted-foreground">Supported by: {supported}</p><button className="mt-4 flex items-center gap-1 text-xs font-bold text-foreground">Explore insight <ArrowRight size={13} /></button></article>)}</div></Panel><div className="mb-6 grid gap-6 xl:grid-cols-2"><Panel title="AI Customer Opportunities" eyebrow="AI-generated"><div className="space-y-3">{opportunities.map(([group, opp, desc, potential, priority]) => <article key={group} className="rounded-xl border border-border p-4"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-foreground">{group}</p><h3 className="mt-1 text-sm font-bold">{opp}</h3></div><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${priority === 'High' ? 'bg-secondary text-foreground' : 'bg-secondary text-muted-foreground'}`}>{priority}</span></div><p className="mt-2 text-xs text-muted-foreground">{desc}</p><div className="mt-3 flex items-center justify-between"><strong className="text-sm">Potential: {potential}</strong><button className="text-xs font-bold text-foreground">View Opportunity</button></div></article>)}</div></Panel><Panel title="AI Customer Risks" eyebrow="AI monitoring"><div className="space-y-3">{risks.map(([title, risk, severity, signal]) => <article key={title} className="rounded-xl border border-border p-4"><div className="flex items-start gap-3"><ShieldAlert size={17} className={severity === 'High' ? 'text-chart-5' : 'text-chart-1'} /><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><h3 className="text-sm font-bold">{title}</h3><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${severity === 'High' ? 'bg-chart-5/10 text-chart-5' : 'bg-chart-1/10 text-chart-1'}`}>{severity}</span></div><p className="mt-1 text-xs text-muted-foreground">{risk} · Signal: {signal}</p><button className="mt-3 text-xs font-bold text-foreground">View Risk</button></div></div></article>)}</div></Panel></div><div className="mb-6 grid gap-6 xl:grid-cols-2"><Panel title="Customer Movement" eyebrow="Current period"><div className="space-y-3">{movement.map(([from, to, count, percent, tone]) => <div key={from + to} className="flex items-center gap-3 rounded-lg bg-card p-3 text-xs"><span className="font-semibold">{from}</span><ArrowRight size={14} className={toneClass(tone, true)} /><span className="font-semibold">{to}</span><span className="ml-auto text-muted-foreground">{count} · {percent}</span></div>)}</div></Panel><Panel title="Customer Cohort Analysis" eyebrow="Compare by: Retention"><div className="overflow-x-auto"><table className="w-full min-w-[430px] text-center text-xs"><thead><tr className="text-[10px] uppercase text-muted-foreground"><th className="pb-3 text-left">Cohort</th>{['M0', 'M1', 'M2', 'M3', 'M4', 'M5'].map(month => <th key={month} className="pb-3">{month}</th>)}</tr></thead><tbody>{cohorts.map(([month, vals]) => <tr key={month} className="border-t border-border"><td className="py-2 text-left font-bold">{month}</td>{vals.map((value, index) => <td key={`${month}-${index}`} className={`p-2 ${value === '—' ? 'text-foreground' : value.startsWith('9') ? 'bg-secondary text-foreground' : value.startsWith('8') ? 'bg-chart-4/10 text-chart-4' : 'bg-secondary text-foreground'}`}>{value}</td>)}</tr>)}</tbody></table></div></Panel></div><div className="mb-6 grid gap-6 md:grid-cols-3"><Panel title="Customer Segments" eyebrow="Connected view"><div className="space-y-3 text-xs">{[['High-Value Customers', '1,284', '€482,400', '+8.4%'], ['At-Risk Accounts', '198', '€84,200', '-2.3%'], ['New Acquisitions Q2', '567', '€134,800', '+12.1%']].map(([name, count, revenue, change]) => <div key={name} className="flex items-center justify-between border-b border-border pb-3"><div><strong>{name}</strong><p className="mt-1 text-muted-foreground">{count} · {revenue}</p></div><span className={change.startsWith('+') ? 'text-chart-4' : 'text-chart-5'}>{change}</span></div>)}</div><button className="mt-4 text-xs font-bold text-foreground">View All Segments <ArrowRight size={13} className="inline" /></button></Panel><Panel title="Customer Activity" eyebrow="Connected view"><strong className="text-2xl">1,842</strong><span className="ml-2 text-xs text-chart-4">+12%</span><p className="mt-2 text-xs text-muted-foreground">Most active: Müller & Partners · No recent activity: 284 customers</p><div className="mt-4 flex h-2 overflow-hidden rounded-full"><span className="w-[42%] bg-primary text-primary-foreground" /><span className="w-[28%] bg-primary text-primary-foreground" /><span className="w-[18%] bg-primary text-primary-foreground" /><span className="w-[12%] bg-muted" /></div><p className="mt-2 text-[11px] text-muted-foreground">Calls 42% · Meetings 28% · Emails 18% · Tasks 12%</p><button className="mt-4 text-xs font-bold text-foreground">Open Activities <ArrowRight size={13} className="inline" /></button></Panel><Panel title="Customer Follow-Up" eyebrow="Connected view"><div className="grid grid-cols-3 gap-2 text-center"><div><strong className="block text-xl">384</strong><span className="text-[11px] text-muted-foreground">Open</span></div><div><strong className="block text-xl text-chart-1">48</strong><span className="text-[11px] text-muted-foreground">Overdue</span></div><div><strong className="block text-xl text-chart-4">1,240</strong><span className="text-[11px] text-muted-foreground">Completed</span></div></div><button className="mt-6 text-xs font-bold text-foreground">Open Tasks <ArrowRight size={13} className="inline" /></button></Panel></div><div className="mb-6 grid gap-6 xl:grid-cols-[1.5fr_.5fr]"><Panel title="Intelligence Data Sources" eyebrow="Connected systems"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[['CRM', '5 min ago'], ['Shopify', '1h ago'], ['Google Analytics', '4h ago'], ['Marketing Platform', '2h ago']].map(([source, sync]) => <article key={source} className="rounded-xl border border-border p-4"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-chart-4" /><strong className="text-sm">{source}</strong></div><p className="mt-3 text-[11px] text-muted-foreground">Last sync: {sync}</p><p className="mt-1 text-[11px] font-bold text-chart-4">Connected · Fresh</p></article>)}</div></Panel><Panel title="Customer Intelligence Data Quality" eyebrow="Trust signal"><div className="flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded-full border-[6px] border-chart-4/30 text-lg font-extrabold text-chart-4">94%</div><div><strong className="text-sm">Excellent</strong><p className="mt-1 text-xs text-muted-foreground">Missing data: Minor</p><p className="mt-1 text-xs text-muted-foreground">All major sources active</p></div></div></Panel></div><footer className="pb-10 text-center text-[11px] text-muted-foreground">Only connected workspace data is displayed.</footer></div></main></div>;
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
          <span data-lulu-section-soon={section.label !== "Website" && section.label !== "Settings" ? "true" : undefined}>{section.label}</span>
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
