import { useState } from 'react';
import { Activity, AlertTriangle, BarChart3, Bell, Bot, CalendarDays, Check, ChevronDown, ChevronRight, CircleHelp, Download, FileText, Filter, Gauge, KanbanSquare, LayoutDashboard, Menu, MoreHorizontal, Search, Settings2, ShieldAlert, Sparkles, Target, TrendingUp, Users, X, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
type Tone = 'neutral' | 'forecast' | 'positive' | 'warning' | 'danger' | 'ai';
interface Row {
  name: string;
  target: string;
  actual: string;
  commit: string;
  best: string;
  upside: string;
  gap: string;
  coverage: string;
  risk: string;
}
const nav: {
  label: string;
  items: [string, LucideIcon][];
}[] = [{
  label: 'Workspace',
  items: [['Overview', LayoutDashboard], ['Sales Overview', Gauge]]
}, {
  label: 'Sales',
  items: [['Leads', Users], ['Opportunities', KanbanSquare], ['Pipeline', TrendingUp], ['Deals', Check], ['Activities', Activity], ['Forecast', Target], ['Analytics', BarChart3]]
}, {
  label: 'Enablement',
  items: [['Automation', Zap], ['Playbooks', FileText], ['Sequences', FileText], ['Products & Pricing', Target], ['Territories', Users]]
}];
const kpis = [['Revenue Target', '€1,000,000', 'Configured', ''], ['Actual Revenue', '€420,000', 'Recorded', '+€38K vs last month'], ['Current Forecast', '€820,000', 'Forecast', ''], ['Commit', '€690,000', 'Forecast', 'High confidence'], ['Best Case', '€840,000', 'Forecast', ''], ['Upside', '€1,020,000', 'Forecast', ''], ['Forecast Gap', '€180,000', 'Calculated', 'Below target'], ['Forecast Coverage', '82%', 'Calculated', '']];
const categories = [['Closed Won', '18', '€420K', '51%', '—', 'bg-primary'], ['Commit', '24', '€270K', '33%', '+€42K', 'bg-primary'], ['Best Case', '11', '€150K', '18%', '+€18K', 'bg-primary'], ['Upside', '9', '€180K', '22%', '+€36K', 'bg-primary'], ['Omitted', '7', '€95K', '12%', '−€12K', 'bg-muted'], ['At Risk', '6', '€95K', '12%', '−€25K', 'bg-destructive']];
const owners: Row[] = [{
  name: 'Sarah Chen',
  target: '€240K',
  actual: '€112K',
  commit: '€190K',
  best: '€220K',
  upside: '€260K',
  gap: '−€20K',
  coverage: '92%',
  risk: '€18K'
}, {
  name: 'Marcus Webb',
  target: '€220K',
  actual: '€96K',
  commit: '€160K',
  best: '€198K',
  upside: '€225K',
  gap: '−€22K',
  coverage: '90%',
  risk: '€24K'
}, {
  name: 'Priya Patel',
  target: '€210K',
  actual: '€88K',
  commit: '€144K',
  best: '€170K',
  upside: '€208K',
  gap: '−€40K',
  coverage: '81%',
  risk: '€12K'
}, {
  name: 'David Torres',
  target: '€180K',
  actual: '€72K',
  commit: '€110K',
  best: '€145K',
  upside: '€177K',
  gap: '−€35K',
  coverage: '80%',
  risk: '€29K'
}, {
  name: 'Emma Liu',
  target: '€150K',
  actual: '€52K',
  commit: '€86K',
  best: '€107K',
  upside: '€150K',
  gap: '—',
  coverage: '71%',
  risk: '€12K'
}];
const teams = [['Enterprise', '€410K', '€168K', '€295K', '€360K', '€440K', '−€50K', '88%', '€42K'], ['Mid-Market', '€280K', '€121K', '€205K', '€245K', '€294K', '−€35K', '87%', '€25K'], ['SMB', '€190K', '€82K', '€130K', '€160K', '€190K', '—', '84%', '€18K'], ['Partnerships', '€120K', '€49K', '€60K', '€75K', '€96K', '−€24K', '80%', '€10K']];
const changes = [['Enterprise renewal', 'Stage changed', '€180K → €205K', '+€25K', '14 min ago', 'Sarah Chen', 'blue'], ['Northstar expansion', 'Value changed', '€92K → €120K', '+€28K', '1h ago', 'Marcus Webb', 'orange'], ['CloudBase platform', 'Deal Won', '€64K → €64K', '+€64K', '3h ago', 'Priya Patel', 'green'], ['Aperture Labs', 'Close Date Changed', 'Aug 12 → Sep 04', '—', '5h ago', 'David Torres', 'yellow'], ['RetailMax renewal', 'Deal Lost', '€48K → €0', '−€48K', 'Yesterday', 'Emma Liu', 'red']];
const risks = [['No recent activity', '3 deals'], ['Aging deal', '2 deals'], ['Close date approaching', '4 deals'], ['Probability decline', '2 deals'], ['Large single-deal dependency', '1 deal'], ['Missing next activity', '5 deals']];
const products = [['Lulu AI Platform', '€410K', '€340K', '€390K', '€460K', '€210K', '−€50K'], ['Professional Services', '€180K', '€125K', '€160K', '€195K', '€72K', '−€20K'], ['Add-ons', '€140K', '€105K', '€128K', '€155K', '€64K', '−€12K'], ['Enterprise License', '€90K', '€68K', '€82K', '€96K', '€40K', '−€8K']];
const regions = [['EMEA', '€420K', '€175K', '€350K', '€295K', '€380K', '−€40K'], ['North America', '€330K', '€145K', '€290K', '€240K', '€315K', '−€15K'], ['APAC', '€170K', '€66K', '€125K', '€150K', '€175K', '−€5K'], ['LATAM', '€80K', '€34K', '€55K', '€68K', '€82K', '—']];
const accuracy = [['Q2 2026', '€780K', '€745K', '−€35K', '95%'], ['Q1 2026', '€690K', '€710K', '+€20K', '97%'], ['Q4 2025', '€620K', '€598K', '−€22K', '96%'], ['Q3 2025', '€560K', '€575K', '+€15K', '97%']];
function Card({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`rounded-xl border border-border bg-card shadow-[0_2px_12px_rgba(0,0,0,.035)] ${className}`}>{children}</section>;
}
function Badge({
  children,
  tone = 'neutral'
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  const colors = {
    neutral: 'bg-secondary text-muted-foreground',
    forecast: 'bg-secondary text-foreground',
    positive: 'bg-chart-4/10 text-chart-4',
    warning: 'bg-chart-1/10 text-chart-1',
    danger: 'bg-chart-5/10 text-chart-5',
    ai: 'bg-secondary text-foreground'
  };
  return <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-[.08em] ${colors[tone]}`}>{children}</span>;
}
function MiniTable({
  headings,
  rows
}: {
  headings: string[];
  rows: string[][];
}) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="border-y border-border bg-card/70 text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{headings.map(heading => <th key={heading} className="whitespace-nowrap px-3 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row[0]} className="border-b border-border last:border-0 hover:bg-card/50">{row.map((cell, cellIndex) => <td key={`${row[0]}-${headings[cellIndex]}`} className={`whitespace-nowrap px-3 py-3 ${cellIndex === 0 ? 'font-semibold text-foreground' : cell.includes('−') ? 'text-chart-5' : 'text-muted-foreground'}`}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
export function SalesForecast() {
  const [mobileNav, setMobileNav] = useState(false);
  const [period, setPeriod] = useState('Current Quarter');
  const [aggregation, setAggregation] = useState('Weekly');
  const [submitted, setSubmitted] = useState(false);
  const [question, setQuestion] = useState('');
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
  <aside className={`fixed inset-y-0 left-0 z-30 w-[244px] bg-[var(--sidebar)] text-foreground transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex h-16 items-center gap-3 border-b border-border px-5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">L</div><span className="text-lg font-semibold text-foreground">Lulu <span className="font-normal text-muted-foreground">AI</span></span><button className="ml-auto lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18} /></button></div><LuluSectionNavigation activeId="lovingly-shore-4782" /><div className="absolute bottom-0 w-full border-t border-border p-4"><button className="flex items-center gap-3 text-sm text-foreground"><Settings2 size={17} /><span>Settings</span></button><div className="mt-4 flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">JD</div><div><p className="text-xs font-semibold text-foreground">Jordan Davis</p><p className="text-[11px] text-muted-foreground">Administrator</p></div><MoreHorizontal className="ml-auto text-muted-foreground" size={17} /></div></div></aside>
  <main className="lg:pl-[244px]"><header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-secondary px-5 backdrop-blur lg:px-8"><div className="flex items-center gap-3"><button className="text-foreground lg:hidden" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={21} /></button><div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span>Sales</span><ChevronRight size={13} /><strong className="text-foreground">Forecast</strong></div></div><div className="flex items-center gap-3"><button aria-label="Search" className="rounded-lg border border-border p-2 text-foreground"><Search size={17} /></button><button aria-label="Notifications" className="relative rounded-lg border border-border p-2 text-foreground"><Bell size={17} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /></button><div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">JD</div></div></header>
   <div className="mx-auto max-w-[1480px] px-5 py-7 lg:px-8"><div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-2 text-xs font-medium text-muted-foreground">Sales / Forecast</p><h1 className="text-3xl font-bold tracking-[-.04em] text-foreground">Sales Forecast</h1><p className="mt-2 text-sm text-muted-foreground">Understand expected sales outcomes, forecast confidence and revenue gaps.</p></div><div className="flex flex-wrap gap-2"><button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary">Update Forecast</button><button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground"><Bot size={16} className="text-foreground" />Ask Lulu AI</button><button className="hidden rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground sm:block">Forecast Settings</button><button aria-label="Export" className="rounded-lg border border-border bg-card p-2.5 text-foreground"><Download size={16} /></button><button aria-label="More options" className="rounded-lg border border-border bg-card p-2.5 text-foreground"><MoreHorizontal size={18} /></button></div></div>
    <div className="mt-7 rounded-xl border border-border bg-card p-2 shadow-sm"><div className="flex flex-wrap items-center gap-1">{['Current Month', 'Next Month', 'Current Quarter', 'Next Quarter', 'Current Year', 'Next Year', 'Custom Period'].map(item => <button key={item} onClick={() => setPeriod(item)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${period === item ? 'bg-primary text-primary-foreground' : 'text-primary-foreground hover:bg-card'}`}>{item}</button>)}<span className="ml-auto flex items-center gap-2 px-3 text-xs font-medium text-muted-foreground"><CalendarDays size={15} className="text-foreground" />01 Jul 2026 – 30 Sep 2026</span></div></div>
    <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{kpis.map(([label, value, note, extra]) => <Card key={label} className="p-4"><div className="flex items-start justify-between gap-2"><p className="text-xs font-medium text-muted-foreground">{label}</p><Badge tone={note === 'Calculated' ? 'neutral' : note === 'Recorded' ? 'positive' : 'forecast'}>{note}</Badge></div><p className={`mt-3 text-xl font-bold tracking-[-.03em] ${label === 'Forecast Gap' ? 'text-chart-5' : 'text-foreground'}`}>{value}</p><div className="mt-2 flex items-center justify-between"><span className={`text-[11px] font-semibold ${label === 'Forecast Gap' ? 'text-foreground' : extra.includes('High') || extra.includes('+') ? 'text-foreground' : 'text-muted-foreground'}`}>{extra || 'Forecast value'}</span>{label === 'Forecast Coverage' && <div className="flex h-9 w-9 items-center justify-center rounded-full border-4 border-border border-t-border text-[9px] font-bold">82%</div>}</div></Card>)}</div>
    <Card className="mt-5 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold">Forecast vs Target</h2><p className="mt-1 text-xs text-muted-foreground">Scenario range for the selected period · Forecast values are projections, not guaranteed revenue.</p></div><Badge tone="forecast">Forecast</Badge></div><div className="mt-6"><div className="relative h-14 rounded-lg bg-secondary"><div className="absolute left-[42%] top-0 h-full border-l-2 border-dashed border-border"><span className="absolute -top-5 -left-8 whitespace-nowrap text-[10px] font-semibold text-muted-foreground">Target €1M</span></div><div className="absolute left-0 top-3 h-8 w-[42%] rounded-l-lg bg-primary text-primary-foreground" /><div className="absolute left-[42%] top-3 h-8 w-[27%] bg-primary text-primary-foreground" /><div className="absolute left-[69%] top-3 h-8 w-[15%] bg-primary text-primary-foreground" /><div className="absolute left-[84%] top-3 h-8 w-[16%] rounded-r-lg bg-primary text-primary-foreground" /></div><div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-muted-foreground"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Actual (Closed Won) €420K</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Commit €690K</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Best Case €840K</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Upside €1.02M</span></div></div></Card>
    <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="overflow-hidden"><div className="p-5"><h2 className="font-semibold">Forecast Categories</h2><p className="mt-1 text-xs text-muted-foreground">Calculated by category · clickable rows filter deals</p></div><MiniTable headings={['Category', 'Deals', 'Value', '% of Forecast', 'Δ vs Previous']} rows={categories.map(([a, b, c, d, e]) => [a, b, c, d, e])} /></Card><Card className="p-5"><div className="flex items-start justify-between"><div><h2 className="font-semibold">Forecast Breakdown</h2><p className="mt-1 text-xs text-muted-foreground">Click a segment to filter deals</p></div><Filter size={16} className="text-muted-foreground" /></div><div className="mt-6 flex items-center gap-8"><div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full" style={{
                background: 'conic-gradient(var(--primary) 0 42%, var(--primary) 42% 68%, var(--primary) 68% 83%, var(--primary) 83% 91%, var(--destructive) 91% 96%, var(--background) 96% 100%)'
              }}><div className="flex h-24 w-24 items-center justify-center rounded-full bg-card text-center"><span><strong className="block text-lg">€1.02M</strong><small className="text-[10px] text-muted-foreground">total upside</small></span></div></div><div className="grid gap-2 text-[11px] text-muted-foreground">{['Closed Won', 'Open Commit', 'Open Best Case', 'Upside', 'At Risk', 'Uncommitted'].map((item, index) => <button key={item} className="flex items-center gap-2 text-left hover:text-foreground"><i className={`h-2 w-2 rounded-full ${['bg-primary', 'bg-primary', 'bg-primary', 'bg-primary', 'bg-destructive', 'bg-muted'][index]}`} />{item}</button>)}</div></div></Card></div>
    <div className="mt-5 grid gap-5 xl:grid-cols-3"><Card className="p-5 xl:col-span-2"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-semibold">Forecast Trend</h2><p className="mt-1 text-xs text-muted-foreground">Weekly movement across the current quarter · textual summary: current forecast rises from €690K to €820K.</p></div><div className="flex rounded-lg bg-secondary p-1">{['Daily', 'Weekly', 'Monthly'].map(item => <button key={item} onClick={() => setAggregation(item)} className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium ${aggregation === item ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>{item}</button>)}</div></div><svg role="img" aria-label="Forecast trend line chart" viewBox="0 0 760 190" className="mt-5 h-[190px] w-full"><path d="M0 145 C100 132 110 150 190 112 S300 130 380 88 S500 92 580 56 S670 70 760 32" fill="none" stroke="var(--chart-2)" strokeWidth="3" /><path d="M0 158 C100 150 120 160 190 140 S300 145 380 122 S500 128 580 102 S670 110 760 88" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="5 5" /><path d="M0 174 L760 174" stroke="var(--border)" /><g fill="var(--border)" fontSize="10"><text x="0" y="188">01 Jul</text><text x="180" y="188">15 Jul</text><text x="370" y="188">01 Aug</text><text x="560" y="188">15 Aug</text><text x="700" y="188">Sep</text></g></svg><div className="mt-2 flex flex-wrap gap-4 text-[11px] text-muted-foreground"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Current Forecast</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-muted" />Previous Forecast</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Actual Revenue</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full border border-border" />Target</span></div></Card><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Forecast Changes</h2><p className="mt-1 text-xs text-muted-foreground">Latest recorded movements</p></div><Activity size={17} className="text-foreground" /></div><div className="mt-4 space-y-3">{changes.map(([deal, type, value, delta, time, user, tone]) => <div key={deal} className="border-b border-border pb-3 last:border-0"><div className="flex items-start justify-between gap-2"><p className="text-xs font-semibold">{deal}</p><span className={`rounded px-2 py-1 text-[10px] font-semibold ${tone === 'green' ? 'bg-chart-4/10 text-chart-4' : tone === 'red' ? 'bg-chart-5/10 text-chart-5' : tone === 'orange' ? 'bg-secondary text-foreground' : tone === 'yellow' ? 'bg-secondary text-foreground' : 'bg-secondary text-foreground'}`}>{type}</span></div><p className="mt-1 text-[11px] text-muted-foreground">{value} <strong className="text-foreground">{delta}</strong></p><p className="mt-1 text-[10px] text-muted-foreground">{time} · {user}</p></div>)}</div></Card></div>
    <Card className="mt-5 overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 p-5"><div><h2 className="font-semibold">Forecast by Owner</h2><p className="mt-1 text-xs text-muted-foreground">Forecast values are projections · sortable columns</p></div><div className="flex gap-2"><button className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground"><Filter size={14} className="mr-1 inline" />Filter</button><button className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground">All owners <ChevronDown size={13} className="inline" /></button></div></div><MiniTable headings={['Owner', 'Target', 'Actual', 'Commit', 'Best Case', 'Upside', 'Gap', 'Coverage', 'At Risk']} rows={owners.map(owner => [owner.name, owner.target, owner.actual, owner.commit, owner.best, owner.upside, owner.gap, owner.coverage, owner.risk])} /><p className="px-5 py-4 text-[10px] text-muted-foreground">Permissions note: owners only see forecast data for teams and pipelines granted to them.</p></Card>
    <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="overflow-hidden"><div className="flex items-center justify-between p-5"><div><h2 className="font-semibold">Forecast by Team</h2><p className="mt-1 text-xs text-muted-foreground">Period comparison: current quarter</p></div><button className="rounded-lg bg-secondary px-3 py-2 text-[11px] font-semibold text-foreground">vs Previous</button></div><MiniTable headings={['Team', 'Target', 'Actual', 'Commit', 'Best Case', 'Upside', 'Gap', 'Coverage', 'At Risk']} rows={teams} /></Card><Card className="overflow-hidden"><div className="p-5"><h2 className="font-semibold">Forecast by Pipeline</h2><p className="mt-1 text-xs text-muted-foreground">Pipeline value is calculated from open deals</p></div><MiniTable headings={['Pipeline', 'Open Deals', 'Pipeline Value', 'Weighted', 'Commit', 'Best Case', 'Upside', 'Forecast', 'Gap']} rows={[['Enterprise Pipeline', '34', '€1.4M', '€680K', '€480K', '€600K', '€720K', '€590K', '−€30K'], ['SMB Pipeline', '28', '€520K', '€250K', '€170K', '€230K', '€290K', '€215K', '−€15K'], ['Renewal Pipeline', '16', '€180K', '€96K', '€40K', '€80K', '€110K', '€85K', '—']]} /></Card></div>
    <div className="mt-5 grid gap-5 xl:grid-cols-3"><Card className="p-5"><h2 className="font-semibold">Expected Close Distribution</h2><p className="mt-1 text-xs text-muted-foreground">Forecast timing · Recorded deals</p><div className="mt-4 grid grid-cols-2 gap-2">{[['This Week', '3 deals', '€45K'], ['Next Week', '7 deals', '€120K'], ['This Month', '12 deals', '€280K'], ['Next Month', '8 deals', '€195K'], ['Later', '5 deals', '€180K'], ['Missing Close Date', '2 deals', '€40K']].map(([label, count, value]) => <div key={label} className={`rounded-lg border p-3 ${label === 'Missing Close Date' ? 'border-chart-1/30 bg-chart-1/50' : 'border-border'}`}><p className="text-[11px] text-muted-foreground">{label}</p><strong className="mt-1 block text-sm">{value}</strong><span className="text-[10px] text-muted-foreground">{count}</span></div>)}</div></Card><Card className="p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Forecast Confidence</h2><Badge tone="warning">Medium</Badge></div><div className="mt-5 flex items-center gap-4"><div className="flex h-24 w-24 items-center justify-center rounded-full border-[10px] border-chart-1/30 border-t-chart-1 border-r-chart-1"><span className="text-lg font-bold">68%</span></div><div className="space-y-2 text-[11px] text-muted-foreground">{['Historical Conversion 72% ✓', 'Stage Duration Normal ✓', 'Recent Activity Active ✓', 'Close Date Risk ⚠', 'Deal Value Stability Normal ✓'].map(item => <p key={item}>{item}</p>)}</div></div><p className="mt-5 text-[10px] text-muted-foreground">Confidence indicators are not mathematical guarantees.</p></Card><Card className="p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Forecast Risk</h2><Badge tone="warning">€95,000 at risk</Badge></div><div className="mt-4 space-y-3">{risks.map(([label, count]) => <div key={label} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-muted-foreground"><AlertTriangle size={13} className="text-chart-1" />{label}</span><span className="rounded bg-secondary px-2 py-1 text-[10px] font-semibold text-foreground">{count}</span></div>)}</div><p className="mt-5 text-[10px] text-foreground"><Sparkles size={12} className="mr-1 inline" />AI-derived risks</p></Card></div>
    <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="p-5"><h2 className="font-semibold">Forecast Gap Analysis</h2><p className="mt-1 text-xs text-muted-foreground">Calculated using scenario values</p><div className="mt-5 grid grid-cols-2 gap-5">{[['Target', '€1,000,000'], ['Current Forecast', '€820,000'], ['Gap', '€180,000'], ['Additional Pipeline Needed', '€300,000']].map(([label, value]) => <div key={label}><p className="text-xs text-muted-foreground">{label}</p><strong className={`mt-1 block text-xl ${label === 'Gap' ? 'text-chart-5' : ''}`}>{value}</strong></div>)}</div><p className="mt-5 text-[10px] text-muted-foreground">Calculated using 1.7× pipeline coverage assumption.</p></Card><Card className="p-5"><div className="flex items-start justify-between"><div><h2 className="font-semibold">Pipeline Coverage</h2><p className="mt-1 text-xs text-muted-foreground">Calculated coverage indicators</p></div><Badge tone="warning">Below 3× target</Badge></div><div className="mt-5 grid grid-cols-2 gap-5">{[['Target', '€1,000,000'], ['Open Pipeline', '€2,100,000'], ['Weighted Pipeline', '€840,000'], ['Forecast', '€820,000'], ['Coverage Ratio', '2.1×']].map(([label, value]) => <div key={label}><p className="text-xs text-muted-foreground">{label}</p><strong className="mt-1 block text-lg">{value}</strong></div>)}</div><button className="mt-5 text-xs font-semibold text-foreground">Configure assumptions <ChevronRight size={14} className="inline" /></button></Card></div>
    <Card className="mt-5 overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 p-5"><div><h2 className="font-semibold">Forecast Accuracy</h2><p className="mt-1 text-xs text-muted-foreground">Historical forecast vs actual · chart summary: accuracy has held between 95–97%.</p></div><div className="flex rounded-lg bg-secondary p-1">{['Month', 'Quarter', 'Year'].map(item => <button key={item} className={`rounded-md px-3 py-1.5 text-[11px] ${item === 'Quarter' ? 'bg-card font-semibold shadow-sm' : 'text-foreground'}`}>{item}</button>)}</div></div><MiniTable headings={['Period', 'Forecast', 'Actual', 'Variance', 'Accuracy']} rows={accuracy} /><svg role="img" aria-label="Historical forecast accuracy chart" viewBox="0 0 900 130" className="m-5 h-28 w-[calc(100%-40px)]"><path d="M0 92 L200 58 L400 75 L600 40 L800 54" fill="none" stroke="var(--chart-2)" strokeWidth="3" /><path d="M0 102 L200 48 L400 84 L600 32 L800 44" fill="none" stroke="var(--foreground)" strokeWidth="2" /><text x="0" y="125" fontSize="10" fill="var(--muted-foreground)">Q3 2025</text><text x="700" y="125" fontSize="10" fill="var(--muted-foreground)">Q2 2026</text></svg></Card>
    <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="overflow-hidden"><div className="p-5"><h2 className="font-semibold">Forecast by Product/Service</h2><p className="mt-1 text-xs text-muted-foreground">Forecast values are projections</p></div><MiniTable headings={['Product/Service', 'Forecast', 'Commit', 'Best Case', 'Upside', 'Won', 'Gap']} rows={products} /></Card><Card className="overflow-hidden"><div className="p-5"><h2 className="font-semibold">Forecast by Region</h2><p className="mt-1 text-xs text-muted-foreground">Forecast values are projections</p></div><MiniTable headings={['Region', 'Target', 'Actual', 'Forecast', 'Commit', 'Best Case', 'Gap']} rows={regions} /><p className="px-5 py-4 text-[10px] text-muted-foreground">Only displayed when geographic data is available.</p></Card></div>
    <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="border-border bg-gradient-to-br from-secondary/70 to-white p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Sparkles size={17} className="text-foreground" /><h2 className="font-semibold text-foreground">AI Forecast Insights</h2></div><Badge tone="ai">AI-generated</Badge></div><div className="mt-4 space-y-3">{[['Forecast Risk', 'A significant portion of the current forecast depends on a small number of high-value opportunities.', '3 deals · €420K concentration', 'warning'], ['Forecast Gap', 'The current forecast is below target. Additional pipeline or improved conversion may be required.', '€180K below target', 'danger'], ['Positive Signal', 'Several opportunities are progressing faster than historical stage-duration patterns.', '7 deals ahead of pattern', 'positive']].map(([title, body, evidence, tone]) => <div key={title} className="rounded-lg bg-secondary p-3"><div className="flex gap-3"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${tone === 'positive' ? 'bg-chart-4' : tone === 'danger' ? 'bg-destructive' : 'bg-primary'}`} /><div><h3 className="text-xs font-semibold">{title}</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p><p className="mt-2 text-[10px] font-semibold text-foreground">Supporting evidence · {evidence}</p></div></div></div>)}</div></Card><Card className="p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">AI Recommendations</h2><Badge tone="ai"><Sparkles size={11} />AI-generated</Badge></div><div className="mt-4 space-y-3">{[['Review at-risk deals', 'Review'], ['Validate expected close dates', 'Open Deals'], ['Reassess forecast categories', 'Review'], ['Increase follow-up activity', 'Create Task'], ['Review pipeline coverage', 'Review'], ['Investigate forecast concentration', 'Ask Lulu AI']].map(([text, action]) => <div key={text} className="flex items-center gap-3 border-b border-border pb-3 last:border-0"><span className="h-2 w-2 rounded-full bg-primary text-primary-foreground" /><p className="flex-1 text-xs font-medium">{text}</p><button className="rounded-md border border-border px-2 py-1 text-[10px] font-semibold text-foreground">{action}</button></div>)}</div><p className="mt-3 text-[10px] text-muted-foreground">AI does not automatically modify forecasts.</p></Card></div>
    <div className="mt-5 grid gap-5 xl:grid-cols-3"><Card className="p-5"><h2 className="font-semibold">Forecast Submission</h2><p className="mt-1 text-xs text-muted-foreground">Submit a forecast for manager review</p><div className="mt-4 grid grid-cols-3 gap-2">{['Commit', 'Best Case', 'Upside'].map(label => <label key={label} className="text-[10px] text-muted-foreground">{label}<input defaultValue={label === 'Commit' ? '690000' : label === 'Best Case' ? '840000' : '1020000'} className="mt-1 w-full rounded-md border border-border px-2 py-2 text-xs" type="number" /></label>)}</div><textarea className="mt-3 w-full rounded-md border border-border p-2 text-xs" rows={2} placeholder="Notes, risks and assumptions" aria-label="Forecast notes" /><select className="mt-2 w-full rounded-md border border-border p-2 text-xs" aria-label="Confidence"><option>Medium confidence</option><option>High confidence</option><option>Low confidence</option></select><button onClick={() => setSubmitted(true)} className="mt-3 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">{submitted ? 'Forecast Submitted' : 'Submit Forecast'}</button><p className="mt-3 text-[10px] text-muted-foreground">Last submitted 2 days ago by Sarah Chen</p></Card><Card className="p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Forecast Approval</h2><Badge tone="warning">Under Review</Badge></div><div className="mt-5 flex flex-wrap gap-2">{['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Revised'].map(item => <span key={item} className={`rounded-md px-2 py-1 text-[10px] font-semibold ${item === 'Under Review' ? 'bg-secondary text-foreground' : 'bg-secondary text-muted-foreground'}`}>{item}</span>)}</div><div className="mt-5 space-y-3 text-xs"><p><span className="text-muted-foreground">Submitted by</span><strong className="ml-2">Marcus Webb</strong><span className="ml-2 text-muted-foreground">3 days ago</span></p><p><span className="text-muted-foreground">Manager review</span><strong className="ml-2 text-chart-1">Pending</strong></p><div className="rounded-lg bg-card p-3"><p className="font-semibold">Marcus Webb</p><p className="mt-1 text-muted-foreground">Please validate the renewal close dates before approval.</p></div></div></Card><Card className="p-5"><h2 className="font-semibold">Forecast Snapshots</h2><p className="mt-1 text-xs text-muted-foreground">Previous submitted versions</p><div className="mt-4 space-y-4">{[['Jul 25, 2026', '€810K', '€670K', '−€190K'], ['Jul 18, 2026', '€790K', '€640K', '−€210K'], ['Jul 11, 2026', '€745K', '€610K', '−€255K']].map(([date, total, commit, gap]) => <div key={date} className="flex items-center gap-3 border-b border-border pb-3 last:border-0"><div className="flex-1"><p className="text-xs font-semibold">{date}</p><p className="mt-1 text-[10px] text-muted-foreground">{total} · Commit {commit} · vs Target {gap}</p></div><button className="text-[10px] font-semibold text-foreground">Compare</button><button className="text-[10px] font-semibold text-foreground">Open</button></div>)}</div></Card></div>
    <Card className="mt-5 mb-8 border-border bg-gradient-to-br from-secondary to-white p-5 sm:p-6"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Bot size={19} /></div><div><h2 className="font-semibold text-foreground">Ask Lulu AI</h2><p className="text-xs text-muted-foreground">Get answers grounded in your forecast data</p></div><Badge tone="ai">AI assistant</Badge></div><div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm"><input value={question} onChange={event => setQuestion(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Ask Lulu AI about your sales forecast..." aria-label="Ask Lulu AI about your sales forecast" /><button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Ask</button></div><div className="mt-4 flex flex-wrap gap-2">{['What is our expected revenue this quarter?', 'Are we on track to hit target?', 'What is causing the forecast gap?', 'Which deals are at risk?', 'What is our commit?', 'How reliable has our forecast been historically?'].map(prompt => <button key={prompt} onClick={() => setQuestion(prompt)} className="rounded-full border border-border bg-card px-3 py-1.5 text-[11px] text-foreground hover:bg-secondary">{prompt}</button>)}</div></Card>
   </div></main></div>;
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
            return <a key={page.id} href={`#${page.id}`} aria-current={isActivePage ? 'page' : undefined} className={`block rounded-md px-3 py-2 text-xs transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {page.label}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}