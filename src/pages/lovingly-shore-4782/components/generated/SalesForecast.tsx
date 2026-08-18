import { useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
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
const kpis: any[][] = [];
const categories = [['Closed Won', '0', '—', '0%', '—', 'bg-primary'], ['Commit', '0', '—', '0%', '—', 'bg-primary'], ['Best Case', '0', '—', '0%', '—', 'bg-primary'], ['Upside', '0', '—', '0%', '—', 'bg-primary'], ['Omitted', '0', '—', '0%', '—', 'bg-muted'], ['At Risk', '0', '—', '0%', '—', 'bg-destructive']];
const owners: Row[] = [];
const teams: string[][] = [];
const changes: string[][] = [];
const risks: string[][] = [];
const products: string[][] = [];
const regions: string[][] = [];
const accuracy: string[][] = [];
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
  const { items: liveForecasts, loading: liveLoading, error: liveError } = useLiveRecords('sales_forecasts');
  const [mobileNav, setMobileNav] = useState(false);
  const [period, setPeriod] = useState('Current Quarter');
  const [aggregation, setAggregation] = useState('Weekly');
  const [submitted, setSubmitted] = useState(false);
  const [question, setQuestion] = useState('');
  const formatMoney = (amount: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: liveForecasts[0]?.currency || 'EUR', maximumFractionDigits: 0 }).format(amount);
  const forecastAmounts = liveForecasts.map(record => Number(record.valueAmount || record.data?.value || 0)).filter(Number.isFinite);
  const actualRevenue = liveForecasts.filter(record => /won|closed/i.test(`${record.status} ${record.stage || ''}`)).reduce((sum, record) => sum + Number(record.valueAmount || record.data?.value || 0), 0);
  const totalForecast = forecastAmounts.reduce((sum, amount) => sum + amount, 0);
  const liveKpis: any[][] = [];
  const liveCategories = ['Closed Won', 'Commit', 'Best Case', 'Upside', 'At Risk'].map(category => { const records = liveForecasts.filter(record => `${record.stage || record.status || ''}`.toLowerCase().includes(category.toLowerCase().split(' ')[0])); const amount = records.reduce((sum, record) => sum + Number(record.valueAmount || record.data?.value || 0), 0); return [category, String(records.length), formatMoney(amount), totalForecast ? `${Math.round(amount / totalForecast * 100)}%` : '0%', 'Live records', category === 'At Risk' ? 'bg-destructive' : 'bg-primary']; });
  const liveOwners: Row[] = liveForecasts.length ? [{ name: 'Workspace pipeline', target: 'Not configured', actual: formatMoney(actualRevenue), commit: formatMoney(totalForecast), best: formatMoney(totalForecast), upside: formatMoney(totalForecast), gap: formatMoney(Math.max(0, totalForecast - actualRevenue)), coverage: actualRevenue ? `${Math.round(totalForecast / actualRevenue * 100)}%` : 'N/A', risk: 'Live data' }] : [];
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
  <aside className={`fixed inset-y-0 left-0 z-30 w-[244px] bg-[var(--sidebar)] text-foreground transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex h-16 items-center gap-3 border-b border-border px-5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">L</div><span className="text-lg font-semibold text-foreground">Lulu <span className="font-normal text-muted-foreground">AI</span></span><button className="ml-auto lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18} /></button></div><LuluSectionNavigation activeId="lovingly-shore-4782" /><div className="absolute bottom-0 w-full border-t border-border p-4"><button className="flex items-center gap-3 text-sm text-foreground"><Settings2 size={17} /><span>Settings</span></button><div className="mt-4 flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">—</div><div><p className="text-xs font-semibold text-foreground">Workspace user</p><p className="text-[11px] text-muted-foreground">Administrator</p></div><MoreHorizontal className="ml-auto text-muted-foreground" size={17} /></div></div></aside>
  <main className="lg:pl-[244px]"><header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-secondary px-5 backdrop-blur lg:px-8"><div className="flex items-center gap-3"><button className="text-foreground lg:hidden" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={21} /></button><div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span>Sales</span><ChevronRight size={13} /><strong className="text-foreground">Forecast</strong></div></div><div className="flex items-center gap-3"><button aria-label="Search" className="rounded-lg border border-border p-2 text-foreground"><Search size={17} /></button><button aria-label="Notifications" className="relative rounded-lg border border-border p-2 text-foreground"><Bell size={17} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /></button><div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">—</div></div></header>
   <div className="mx-auto max-w-[1480px] px-5 py-7 lg:px-8"><div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-2 text-xs font-medium text-muted-foreground">Sales / Forecast</p><h1 className="text-3xl font-bold tracking-[-.04em] text-foreground">Sales Forecast</h1><p className="mt-2 text-sm text-muted-foreground">Understand expected sales outcomes, forecast confidence and revenue gaps.</p></div><div className="flex flex-wrap gap-2"><button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary">Update Forecast</button><button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground"><Bot size={16} className="text-foreground" />Ask Lulu AI</button><button className="hidden rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground sm:block">Forecast Settings</button><button aria-label="Export" className="rounded-lg border border-border bg-card p-2.5 text-foreground"><Download size={16} /></button><button aria-label="More options" className="rounded-lg border border-border bg-card p-2.5 text-foreground"><MoreHorizontal size={18} /></button></div></div>
    <div className="mt-7 rounded-xl border border-border bg-card p-2 shadow-sm"><div className="flex flex-wrap items-center gap-1">{['Current Month', 'Next Month', 'Current Quarter', 'Next Quarter', 'Current Year', 'Next Year', 'Custom Period'].map(item => <button key={item} onClick={() => setPeriod(item)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${period === item ? 'bg-primary text-primary-foreground' : 'text-primary-foreground hover:bg-card'}`}>{item}</button>)}<span className="ml-auto flex items-center gap-2 px-3 text-xs font-medium text-muted-foreground"><CalendarDays size={15} className="text-foreground" />Selected live period</span></div></div>
    {liveError && <div className="mt-5 rounded-lg border border-chart-5/30 bg-chart-5/5 px-4 py-3 text-sm text-chart-5">{liveError}</div>}
    {liveLoading && <div className="mt-5 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Loading live sales forecasts…</div>}
    {!liveLoading && liveForecasts.length === 0 && <div className="mt-5 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No live sales forecasts have been recorded yet.</div>}
    <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{liveLoading ? [] : liveKpis.map(([label, value, note, extra]) => <Card key={label} className="p-4"><div className="flex items-start justify-between gap-2"><p className="text-xs font-medium text-muted-foreground">{label}</p><Badge tone={note === 'Calculated' ? 'neutral' : note === 'Recorded' ? 'positive' : 'forecast'}>{note}</Badge></div><p className={`mt-3 text-xl font-bold tracking-[-.03em] ${label === 'Forecast Gap' ? 'text-chart-5' : 'text-foreground'}`}>{value}</p><div className="mt-2 flex items-center justify-between"><span className={`text-[11px] font-semibold ${label === 'Forecast Gap' ? 'text-foreground' : extra.includes('High') || extra.includes('+') ? 'text-foreground' : 'text-muted-foreground'}`}>{extra || 'Forecast value'}</span>{label === 'Forecast Coverage' && <div className="flex h-9 w-9 items-center justify-center rounded-full border-4 border-border border-t-border text-[9px] font-bold">82%</div>}</div></Card>)}</div>
    <Card className="mt-5 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold">Forecast vs Target</h2><p className="mt-1 text-xs text-muted-foreground">Scenario range for the selected period · Forecast values are projections, not guaranteed revenue.</p></div><Badge tone="forecast">Forecast</Badge></div><div className="mt-6"><div className="relative h-14 rounded-lg bg-secondary"><div className="absolute left-[42%] top-0 h-full border-l-2 border-dashed border-border"><span className="absolute -top-5 -left-8 whitespace-nowrap text-[10px] font-semibold text-muted-foreground">Target —</span></div><div className="absolute left-0 top-3 h-8 w-[42%] rounded-l-lg bg-primary text-primary-foreground" /><div className="absolute left-[42%] top-3 h-8 w-[27%] bg-primary text-primary-foreground" /><div className="absolute left-[69%] top-3 h-8 w-[15%] bg-primary text-primary-foreground" /><div className="absolute left-[84%] top-3 h-8 w-[16%] rounded-r-lg bg-primary text-primary-foreground" /></div><div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-muted-foreground"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Actual (Closed Won) —</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Commit —</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Best Case €840K</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Upside —</span></div></div></Card>
    <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="overflow-hidden"><div className="p-5"><h2 className="font-semibold">Forecast Categories</h2><p className="mt-1 text-xs text-muted-foreground">Calculated by category · clickable rows filter deals</p></div><MiniTable headings={['Category', 'Deals', 'Value', '% of Forecast', 'Δ vs Previous']} rows={liveLoading ? [] : liveCategories.map(([a, b, c, d, e]) => [a, b, c, d, e])} /></Card><Card className="p-5"><div className="flex items-start justify-between"><div><h2 className="font-semibold">Forecast Breakdown</h2><p className="mt-1 text-xs text-muted-foreground">Click a segment to filter deals</p></div><Filter size={16} className="text-muted-foreground" /></div><div className="mt-6 flex items-center gap-8"><div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full" style={{
                background: 'conic-gradient(var(--primary) 0 42%, var(--primary) 42% —, var(--primary) — 83%, var(--primary) 83% 91%, var(--destructive) 91% 96%, var(--background) 96% 100%)'
              }}><div className="flex h-24 w-24 items-center justify-center rounded-full bg-card text-center"><span><strong className="block text-lg">—</strong><small className="text-[10px] text-muted-foreground">total upside</small></span></div></div><div className="grid gap-2 text-[11px] text-muted-foreground">{['Closed Won', 'Open Commit', 'Open Best Case', 'Upside', 'At Risk', 'Uncommitted'].map((item, index) => <button key={item} className="flex items-center gap-2 text-left hover:text-foreground"><i className={`h-2 w-2 rounded-full ${['bg-primary', 'bg-primary', 'bg-primary', 'bg-primary', 'bg-destructive', 'bg-muted'][index]}`} />{item}</button>)}</div></div></Card></div>
    <div className="mt-5 grid gap-5 xl:grid-cols-3"><Card className="p-5 xl:col-span-2"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-semibold">Forecast Trend</h2><p className="mt-1 text-xs text-muted-foreground">Live trend history will appear after forecast records are available.</p></div></div><div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No live forecast trend is available yet.</div></Card><Card className="p-5"><h2 className="font-semibold">Forecast Changes</h2><p className="mt-1 text-xs text-muted-foreground">Latest recorded movements</p><div className="mt-6 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No live forecast changes are available yet.</div></Card></div>
    <Card className="mt-5 overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 p-5"><div><h2 className="font-semibold">Forecast by Owner</h2><p className="mt-1 text-xs text-muted-foreground">Forecast values are projections · sortable columns</p></div><div className="flex gap-2"><button className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground"><Filter size={14} className="mr-1 inline" />Filter</button><button className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground">All owners <ChevronDown size={13} className="inline" /></button></div></div><MiniTable headings={['Owner', 'Target', 'Actual', 'Commit', 'Best Case', 'Upside', 'Gap', 'Coverage', 'At Risk']} rows={liveLoading ? [] : liveOwners.map(owner => [owner.name, owner.target, owner.actual, owner.commit, owner.best, owner.upside, owner.gap, owner.coverage, owner.risk])} /><p className="px-5 py-4 text-[10px] text-muted-foreground">Permissions note: owners only see forecast data for teams and pipelines granted to them.</p></Card>
    <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="overflow-hidden"><div className="flex items-center justify-between p-5"><div><h2 className="font-semibold">Forecast by Team</h2><p className="mt-1 text-xs text-muted-foreground">Period comparison: current quarter</p></div><button className="rounded-lg bg-secondary px-3 py-2 text-[11px] font-semibold text-foreground">vs Previous</button></div><MiniTable headings={['Team', 'Target', 'Actual', 'Commit', 'Best Case', 'Upside', 'Gap', 'Coverage', 'At Risk']} rows={teams} /></Card><Card className="overflow-hidden"><div className="p-5"><h2 className="font-semibold">Forecast by Pipeline</h2><p className="mt-1 text-xs text-muted-foreground">Pipeline value is calculated from open deals</p></div><MiniTable headings={['Pipeline', 'Open Deals', 'Pipeline Value', 'Weighted', 'Commit', 'Best Case', 'Upside', 'Forecast', 'Gap']} rows={[]} /></Card></div>
    <div className="mt-5 grid gap-5 xl:grid-cols-3"><Card className="p-5"><h2 className="font-semibold">Expected Close Distribution</h2><p className="mt-1 text-xs text-muted-foreground">Forecast timing from live deal dates</p><div className="mt-5 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Close timing will appear after live deal dates are available.</div></Card><Card className="p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Forecast Confidence</h2><Badge tone="warning">Awaiting live data</Badge></div><div className="mt-5 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Confidence indicators will appear after live forecast history is available.</div></Card><Card className="p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Forecast Risk</h2><Badge tone="warning">Awaiting live data</Badge></div><div className="mt-5 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No live forecast risk data is available yet.</div></Card></div>
    <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="p-5"><h2 className="font-semibold">Forecast Gap Analysis</h2><p className="mt-1 text-xs text-muted-foreground">Calculated from live target and forecast values.</p><div className="mt-5 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No live gap analysis is available yet.</div></Card><Card className="p-5"><h2 className="font-semibold">Pipeline Coverage</h2><p className="mt-1 text-xs text-muted-foreground">Coverage will be calculated from live pipeline records.</p><div className="mt-5 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No live pipeline coverage is available yet.</div></Card></div>
    <Card className="mt-5 overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 p-5"><div><h2 className="font-semibold">Forecast Accuracy</h2><p className="mt-1 text-xs text-muted-foreground">Historical forecast vs actual · chart summary: accuracy has held between —.</p></div><div className="flex rounded-lg bg-secondary p-1">{['Month', 'Quarter', 'Year'].map(item => <button key={item} className={`rounded-md px-3 py-1.5 text-[11px] ${item === 'Quarter' ? 'bg-card font-semibold shadow-sm' : 'text-foreground'}`}>{item}</button>)}</div></div><MiniTable headings={['Period', 'Forecast', 'Actual', 'Variance', 'Accuracy']} rows={accuracy} /><div className="mt-5 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Historical accuracy will appear after live forecast history is available.</div></Card>
    <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="overflow-hidden"><div className="p-5"><h2 className="font-semibold">Forecast by Product/Service</h2><p className="mt-1 text-xs text-muted-foreground">Forecast values are projections</p></div><MiniTable headings={['Product/Service', 'Forecast', 'Commit', 'Best Case', 'Upside', 'Won', 'Gap']} rows={products} /></Card><Card className="overflow-hidden"><div className="p-5"><h2 className="font-semibold">Forecast by Region</h2><p className="mt-1 text-xs text-muted-foreground">Forecast values are projections</p></div><MiniTable headings={['Region', 'Target', 'Actual', 'Forecast', 'Commit', 'Best Case', 'Gap']} rows={regions} /><p className="px-5 py-4 text-[10px] text-muted-foreground">Only displayed when geographic data is available.</p></Card></div>
    <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="border-border bg-gradient-to-br from-secondary/70 to-white p-5"><div className="flex items-center justify-between"><h2 className="font-semibold text-foreground">AI Forecast Insights</h2><Badge tone="ai">AI-generated</Badge></div><div className="mt-4 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">AI insights will appear after live forecast analysis is available.</div></Card><Card className="p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">AI Recommendations</h2><Badge tone="ai">AI-generated</Badge></div><div className="mt-4 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">AI recommendations will appear after live forecast analysis is available.</div><p className="mt-3 text-[10px] text-muted-foreground">AI does not automatically modify forecasts.</p></Card></div>
    <div className="mt-5 grid gap-5 xl:grid-cols-3"><Card className="p-5"><h2 className="font-semibold">Forecast Submission</h2><p className="mt-1 text-xs text-muted-foreground">Submit a forecast for manager review</p><div className="mt-5 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Submission inputs will be enabled when live forecast configuration is available.</div><button onClick={() => setSubmitted(true)} className="mt-4 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">{submitted ? "Forecast Submitted" : "Submit Forecast"}</button></Card><Card className="p-5"><h2 className="font-semibold">Forecast Approval</h2><p className="mt-1 text-xs text-muted-foreground">Approval history will appear after a live forecast is submitted.</p><div className="mt-5 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No live approval record is available yet.</div></Card><Card className="p-5"><h2 className="font-semibold">Forecast Snapshots</h2><p className="mt-1 text-xs text-muted-foreground">Previous submitted versions</p><div className="mt-5 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No live forecast snapshots are available yet.</div></Card></div>
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
