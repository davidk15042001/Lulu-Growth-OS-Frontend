import { useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { AlertTriangle, Archive, ArrowDownRight, ArrowLeftRight, ArrowUpRight, BarChart2, Bell, BrainCircuit, CalendarDays, CheckCircle2, ChevronDown, ChevronRight, Clock3, Copy, Download, Edit2, Eye, FileText, Filter, LayoutDashboard, Megaphone, MoreHorizontal, PieChart, Plus, Receipt, Search, Send, Settings, ShoppingCart, SlidersHorizontal, Sparkles, Target, TrendingDown, TrendingUp, Users, X, XCircle, Zap, BadgeDollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
type Tone = 'green' | 'amber' | 'red' | 'blue' | 'slate';
const navGroups = [{
  label: 'Workspace',
  items: [['Dashboard', LayoutDashboard], ['AI Platform', BrainCircuit], ['CRM', Users], ['Marketing', Megaphone]]
}, {
  label: 'Finance',
  items: [['Overview', PieChart], ['Invoices', Receipt], ['Offers & Quotes', FileText], ['Payments', BadgeDollarSign], ['Expenses', ArrowDownRight], ['Income', ArrowUpRight], ['Transactions', ArrowLeftRight], ['Vendors', ShoppingCart], ['Budgets', Target], ['Reports', BarChart2]]
}, {
  label: 'Manage',
  items: [['Sales', TrendingUp], ['Operations', Settings], ['Settings', SlidersHorizontal]]
}] as const;
const budgets: { name: string; period: string; planned: string; actual: string; remaining: string; util: number | null; variance: string; status: string; tone: Tone; updated: string }[] = [];
const categoryData: { name: string; budget: string; actual: string; remaining: string; pct: number; tone: Tone }[] = [];
const chartData: { month: string; budget: number; actual: number }[] = [];
const toneStyles: Record<Tone, {
  badge: string;
  dot: string;
  bar: string;
}> = {
  green: {
    badge: 'bg-secondary text-foreground',
    dot: 'bg-primary',
    bar: 'bg-primary'
  },
  amber: {
    badge: 'bg-secondary text-foreground',
    dot: 'bg-primary',
    bar: 'bg-primary'
  },
  red: {
    badge: 'bg-chart-5/10 text-chart-5',
    dot: 'bg-destructive',
    bar: 'bg-destructive'
  },
  blue: {
    badge: 'bg-secondary text-foreground',
    dot: 'bg-primary',
    bar: 'bg-primary'
  },
  slate: {
    badge: 'bg-secondary text-muted-foreground',
    dot: 'bg-muted',
    bar: 'bg-muted'
  }
};
const statusIcon = (status: string) => status === 'On Track' ? CheckCircle2 : status === 'Near Limit' ? AlertTriangle : status === 'Over Budget' ? XCircle : status === 'Draft' ? Clock3 : ArrowDownRight;
const money = (value: string) => value.replace('−', '−');
export const LuluBudgets = () => {
  const { items: liveRecords, loading: liveLoading, error: liveError } = useLiveRecords('finance_budgets');
  const liveBudgets = liveRecords.map((record) => {
    const fields = record as unknown as Record<string, unknown>;
    const util = Number(fields.utilization ?? fields.util ?? 0);
    return { name: record.name, period: String(fields.period ?? '—'), planned: record.valueAmount ?? '—', actual: String(fields.actual ?? '—'), remaining: String(fields.remaining ?? '—'), util: Number.isFinite(util) && util > 0 ? util : null, variance: String(fields.variance ?? '—'), status: record.status || 'Recorded', tone: (String(fields.tone ?? 'slate') as Tone), updated: record.updatedAt };
  });
  const totalPlanned = liveBudgets.reduce((sum, budget) => sum + (Number(String(budget.planned).replace(/[^0-9.-]/g, '')) || 0), 0);
  const totalActual = liveBudgets.reduce((sum, budget) => sum + (Number(String(budget.actual).replace(/[^0-9.-]/g, '')) || 0), 0);
  const totalRemaining = liveBudgets.reduce((sum, budget) => sum + (Number(String(budget.remaining).replace(/[^0-9.-]/g, '')) || 0), 0);
  const liveCategoryData: typeof categoryData = liveBudgets.map(budget => ({ name: budget.name, budget: budget.planned, actual: budget.actual, remaining: budget.remaining, pct: budget.util ?? 0, tone: budget.tone }));
  const liveChartData: typeof chartData = liveBudgets.map(budget => ({ month: budget.period, budget: Number(String(budget.planned).replace(/[^0-9.-]/g, '')) || 0, actual: Number(String(budget.actual).replace(/[^0-9.-]/g, '')) || 0 }));
  const liveKpis = liveBudgets.length ? [['Total Budget', totalPlanned.toLocaleString(), 'Live records'], ['Actual Spend', totalActual.toLocaleString(), 'Live records'], ['Remaining', totalRemaining.toLocaleString(), 'Calculated'], ['Utilization', `${totalPlanned ? Math.round(totalActual / totalPlanned * 100) : 0}%`, 'Calculated'], ['Budgets', String(liveBudgets.length), 'Live records'], ['Needs Review', String(liveBudgets.filter(budget => /over|review|near/i.test(budget.status)).length), 'Live records'], ['Last Updated', liveBudgets[0].updated, 'Recorded']] : [];

  const [period, setPeriod] = useState('Monthly');
  const [activeTab, setActiveTab] = useState('Monthly');
  const [query, setQuery] = useState('');
  const [compare, setCompare] = useState(false);
  const filteredBudgets = liveBudgets.filter(budget => budget.name.toLowerCase().includes(query.toLowerCase()));
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-[238px] flex-col bg-[var(--sidebar)] text-muted-foreground">
        <div className="flex h-[76px] items-center gap-2 border-b border-border px-5"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={17} fill="currentColor" /></span><strong className="text-lg tracking-tight text-foreground">lulu<span className="text-foreground">.ai</span></strong></div>
        <LuluSectionNavigation activeId="wisely-gate-3183" />
        <div className="border-t border-border p-4"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-[var(--primary-foreground)]">—</span><div><p className="text-xs font-semibold text-foreground">—</p><p className="mt-0.5 text-[10px] text-muted-foreground">Administrator</p></div><MoreHorizontal size={16} className="ml-auto text-muted-foreground" /></div></div>
      </aside>
      <main className="ml-[238px] min-h-screen overflow-x-hidden">
    {liveError && <div className="mx-5 mt-4 rounded-lg border border-chart-5/30 bg-chart-5/5 px-4 py-3 text-sm text-chart-5">{liveError}</div>}
    {!liveLoading && liveBudgets.length === 0 && <div className="mx-5 mt-4 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No budget records are available yet. Add a budget or connect a finance platform.</div>}
        <header className="flex min-h-[76px] items-center justify-between border-b border-border bg-card px-9"><div><div className="mb-1 flex items-center gap-1.5 text-[11px] text-muted-foreground"><span>Finance</span><ChevronRight size={12} /><span className="text-muted-foreground">Budgets</span></div><h1 className="text-[22px] font-bold tracking-[-.03em]">Budgets</h1></div><div className="flex items-center gap-2"><button className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary"><Plus size={14} />Create Budget</button><button className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-2 text-xs font-semibold text-foreground"><Sparkles size={14} />Ask Lulu AI</button><button className="hidden items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground sm:flex"><Download size={14} />Export</button><button aria-label="More actions" className="rounded-md border border-border p-2 text-foreground"><MoreHorizontal size={16} /></button></div></header>
        <div className="border-b border-border bg-card px-9 py-3"><div className="flex flex-wrap items-center gap-3"><div className="flex rounded-md border border-border p-0.5">{['Monthly', 'Quarterly', 'Annual', 'Custom'].map(item => <button key={item} onClick={() => setPeriod(item)} className={`rounded px-3 py-1.5 text-[11px] font-medium ${period === item ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-card'}`}>{item}</button>)}</div><div className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-[11px] font-medium text-foreground"><CalendarDays size={14} className="text-muted-foreground" />Selected period<ChevronDown size={13} /></div><button onClick={() => setCompare(!compare)} className="flex items-center gap-2 text-[11px] text-foreground"><span className={`h-4 w-7 rounded-full p-0.5 ${compare ? 'bg-primary' : 'bg-secondary'}`}><span className={`block h-3 w-3 rounded-full bg-card transition ${compare ? 'translate-x-3' : ''}`} /></span>Compare</button><button className="ml-auto flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-[11px] text-foreground">Status: All<ChevronDown size={13} /></button><button className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-[11px] text-foreground">No active budget selected<ChevronDown size={13} /></button></div></div>
        <div className="space-y-5 p-9">
          <p className="-mt-3 text-xs text-muted-foreground">Plan your financial targets and monitor how actual performance compares with your budget.</p>
          <section className="grid grid-cols-2 gap-3 xl:grid-cols-7">{liveKpis.map(([label, value, source]) => <div key={label} className="rounded-lg border border-border bg-card p-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><strong className="mt-2 block truncate text-lg text-foreground">{value}</strong><span className="mt-1 block text-[10px] text-muted-foreground">{source}</span></div>)}</section>
          <section className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-4 py-3">{([] as string[][]).map(([label, count, tone]) => <button key={label} className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold ${toneStyles[tone as Tone].badge}`}><span className={`h-1.5 w-1.5 rounded-full ${toneStyles[tone as Tone].dot}`} />{label}<span className="font-normal opacity-70">{count}</span></button>)}</section>
          <section className="flex flex-wrap items-center gap-2"><div className="relative"><Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search budgets..." className="h-9 w-56 rounded-md border border-border bg-card pl-9 pr-8 text-xs outline-none ring-ring focus:ring-2" />{query && <button aria-label="Clear search" onClick={() => setQuery('')} className="absolute right-2 top-2 text-foreground"><X size={14} /></button>}</div>{['Status', 'Period', 'Category', 'Owner', 'Variance'].map(filter => <button key={filter} className="flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-[11px] text-foreground"><Filter size={12} className="text-muted-foreground" />{filter}<ChevronDown size={12} /></button>)}<button className="ml-auto text-[11px] font-semibold text-foreground hover:text-foreground">Clear Filters</button><button className="text-[11px] font-semibold text-foreground">Save Filter</button></section>
          <section className="rounded-lg border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,.03)]"><div className="flex items-center justify-between p-5 pb-4"><div><h2 className="text-sm font-bold">Budget List</h2><p className="mt-1 text-[10px] text-muted-foreground">Track plans, actuals, and variance across your organization</p></div><button className="text-foreground"><SlidersHorizontal size={16} /></button></div><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-[11px]"><thead className="bg-card text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Budget', 'Period', 'Planned', 'Actual', 'Remaining', 'Utilization', 'Variance', 'Status', 'Last Updated', 'Actions'].map(head => <th key={head} className="px-4 py-3 font-semibold">{head}</th>)}</tr></thead><tbody className="divide-y divide-border">{filteredBudgets.map(budget => {
                  const Icon = statusIcon(budget.status);
                  return <tr key={budget.name} className="hover:bg-card/70"><td className="px-4 py-3 font-semibold text-foreground">{budget.name}</td><td className="px-4 py-3 text-muted-foreground">{budget.period}</td><td className="px-4 py-3 font-medium">{budget.planned}</td><td className="px-4 py-3">{budget.actual}</td><td className={`px-4 py-3 ${budget.remaining.startsWith('−') ? 'text-chart-5' : ''}`}>{budget.remaining}</td><td className="px-4 py-3">{budget.util !== null && <div className="flex items-center gap-2"><div className="h-1.5 w-20 rounded-full bg-secondary"><div className={`h-full rounded-full ${toneStyles[budget.tone as Tone].bar}`} style={{
                            width: `${Math.min(budget.util, 100)}%`
                          }} /></div><span className="text-muted-foreground">{budget.util}%</span></div>}</td><td className={`px-4 py-3 font-medium ${budget.variance.startsWith('+') ? 'text-chart-5' : 'text-foreground'}`}>{money(budget.variance)}</td><td className="px-4 py-3"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${toneStyles[budget.tone as Tone].badge}`}><Icon size={11} /><span>{budget.status}</span></span></td><td className="px-4 py-3 text-muted-foreground">{budget.updated}</td><td className="px-4 py-3"><button aria-label={`Actions for ${budget.name}`}><MoreHorizontal size={15} className="text-muted-foreground" /></button></td></tr>;
                })}</tbody></table></div><div className="flex items-center justify-between border-t border-border px-5 py-3 text-[11px] text-muted-foreground"><span>No live budget pagination available yet</span><div className="flex items-center gap-3"><span>Rows per page <strong className="text-foreground">10</strong> <ChevronDown size={12} className="inline" /></span><button aria-label="Previous page" className="rounded border border-border p-1"><ChevronRight size={14} className="rotate-180" /></button><button aria-label="Next page" className="rounded border border-border p-1"><ChevronRight size={14} /></button></div></div></section>
          <section className="rounded-lg border border-border bg-card p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-bold">Actual vs Budget</h2><p className="mt-1 text-[10px] text-muted-foreground">Monthly view · No active budget selected · Selected period</p></div><div className="flex rounded-md border border-border p-0.5">{['Monthly', 'Quarterly', 'Annual'].map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded px-3 py-1.5 text-[11px] font-semibold ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-primary-foreground'}`}>{tab}</button>)}</div></div><div className="mt-5 h-[260px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={liveLoading ? [] : liveChartData} barGap={4}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--background)" /><XAxis dataKey="month" tick={{
                  fontSize: 10,
                  fill: 'var(--muted-foreground)'
                }} axisLine={false} tickLine={false} /><YAxis tick={{
                  fontSize: 10,
                  fill: 'var(--muted-foreground)'
                }} axisLine={false} tickLine={false} tickFormatter={v => `€${v / 1000}k`} /><Tooltip formatter={value => `€${Number(value).toLocaleString()}`} /><Legend verticalAlign="bottom" iconType="square" wrapperStyle={{
                  fontSize: '11px',
                  paddingTop: '16px'
                }} /><Bar dataKey="budget" name="Budget" fill="var(--foreground)" radius={[3, 3, 0, 0]} /><Bar dataKey="actual" name="Actual" fill="var(--muted-foreground)" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div><div className="mt-3 grid grid-cols-2 gap-4 border-t border-border pt-4 text-[11px] sm:grid-cols-4"><span>Budget total <strong className="ml-1 text-foreground">—</strong></span><span>Actual YTD <strong className="ml-1 text-foreground">—</strong></span><span>Variance <strong className="ml-1 text-foreground">—</strong></span><span>Utilization <strong className="ml-1 text-foreground">—</strong></span></div></section>
          <div className="grid gap-5 xl:grid-cols-2"><section className="rounded-lg border border-border bg-card p-5"><h2 className="text-sm font-bold">Budget Utilization</h2><p className="mt-1 text-[10px] text-muted-foreground">By category · Selected period</p><div className="mt-5 space-y-4">{(liveLoading ? [] : liveCategoryData).map(item => <div key={item.name}><div className="mb-1.5 flex justify-between text-[11px]"><span className="font-medium text-foreground">{item.name}</span><span className="text-muted-foreground">{item.actual} / {item.budget} <strong className="ml-2 text-foreground">{item.pct}%</strong></span></div><div className="h-2 rounded-full bg-secondary"><div className={`h-full rounded-full ${toneStyles[item.tone as Tone].bar}`} style={{
                    width: `${Math.min(item.pct, 100)}%`
                  }} /></div></div>)}</div></section><section className="rounded-lg border border-border bg-card p-5"><h2 className="text-sm font-bold">Budget Variance</h2><p className="mt-1 text-[10px] text-muted-foreground">Category breakdown · Calculated</p><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[570px] text-left text-[11px]"><thead className="text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Category', 'Budget', 'Actual', 'Variance', 'Variance %', 'Status'].map(head => <th key={head} className="border-b border-border pb-2 font-semibold">{head}</th>)}</tr></thead><tbody className="divide-y divide-border">{(liveLoading ? [] : liveCategoryData).map(item => <tr key={item.name}><td className="py-2.5 font-medium">{item.name}</td><td className="py-2.5">{item.budget}</td><td className="py-2.5">{item.actual}</td><td className={`py-2.5 font-medium ${item.pct > 100 ? 'text-chart-5' : 'text-foreground'}`}>{item.pct > 100 ? '+' : '−'}{item.pct > 100 ? item.actual.replace('€', '€') : item.remaining}</td><td className="py-2.5">{item.pct > 100 ? `+${(item.pct - 100).toFixed(1)}%` : `−${(100 - item.pct).toFixed(1)}%`}</td><td className="py-2.5"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${toneStyles[item.pct > 100 ? 'red' : item.pct > 75 ? 'amber' : 'green'].badge}`}>{item.pct > 100 ? 'Over Budget' : item.pct > 75 ? 'Near Limit' : 'Under Budget'}</span></td></tr>)}</tbody></table></div><p className="mt-4 text-[10px] text-muted-foreground">Negative variance = under budget (remaining). Positive variance = over budget (exceeded).</p></section></div>
          <div className="grid gap-5 xl:grid-cols-2"><section className="rounded-lg border border-border bg-card p-5"><div className="flex items-center gap-2"><h2 className="text-sm font-bold">Over-Budget Categories</h2><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-muted-foreground">—</span></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[570px] text-left text-[11px]"><thead className="text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Category', 'Budget', 'Actual', 'Over Budget', '% Over', 'Trend', 'Actions'].map(h => <th key={h} className="border-b border-border pb-2">{h}</th>)}</tr></thead><tbody>{([] as string[][]).map(row => <tr key={row[0]} className="border-b border-border"><td className="py-3 font-semibold">{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td className="font-semibold text-chart-5">{row[3]}</td><td className="text-chart-5">{row[4]}</td><td><TrendingUp size={14} className="text-chart-5" /></td><td><button className="text-[10px] font-semibold text-foreground">Open</button><button className="ml-2 text-[10px] font-semibold text-foreground">Ask AI</button></td></tr>)}</tbody></table></div></section><section className="rounded-lg border border-border bg-card p-5"><h2 className="text-sm font-bold">Under-Budget Categories</h2><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[480px] text-left text-[11px]"><thead className="text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Category', 'Budget', 'Actual', 'Remaining', 'Utilization'].map(h => <th key={h} className="border-b border-border pb-2">{h}</th>)}</tr></thead><tbody>{liveCategoryData.filter(item => item.pct < 100).map(item => <tr key={item.name} className="border-b border-border"><td className="py-3 font-semibold">{item.name}</td><td>{item.budget}</td><td>{item.actual}</td><td className="text-foreground">{item.remaining}</td><td>{item.pct}%</td></tr>)}</tbody></table></div><p className="mt-4 text-[10px] text-muted-foreground">Review whether lower spending is planned or unexpected.</p></section></div>
          <div className="grid gap-5 xl:grid-cols-2"><section className="rounded-lg border border-border bg-gradient-to-br from-secondary to-white p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-bold">Budget Forecast</h2><p className="mt-1 text-[10px] text-muted-foreground">Projected year-end performance · No active budget selected</p></div><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-foreground"><Sparkles size={11} className="mr-1 inline" />AI Forecast</span></div><div className="mt-5 grid grid-cols-3 gap-3">{([] as string[][]).map(([label, value]) => <div key={label}><p className="text-[10px] text-muted-foreground">{label}</p><strong className="mt-1 block text-base">{value}</strong></div>)}</div><div className="mt-5 h-12"><ResponsiveContainer width="100%" height="100%"><LineChart data={liveLoading ? [] : liveChartData}><Line type="monotone" dataKey="actual" stroke="var(--foreground)" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div><p className="mt-3 text-[10px] text-muted-foreground">Forecast will appear after live budget history is available.</p><p className="mt-2 text-[10px] italic text-muted-foreground">AI forecast is unavailable until live budget history is connected.</p></section><section className="rounded-lg border border-border bg-card p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-bold">Budget Alerts</h2><p className="mt-1 text-[10px] text-muted-foreground">Items that need your attention</p></div><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-muted-foreground"><Bell size={11} className="mr-1 inline" />—</span></div><div className="mt-4 space-y-3">{([] as string[][]).map(alert => <div key={alert[0]} className="rounded-md border border-border p-3"><div className="flex items-start gap-2"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${toneStyles[alert[5] as Tone].dot}`} /><div className="min-w-0 flex-1"><p className="text-[11px] font-semibold">{alert[0]} <span className="font-normal text-muted-foreground">— {alert[1]}</span></p><p className="mt-1 text-[10px] text-muted-foreground">{alert[2]} · {alert[3]} · Current: {alert[4]}</p><div className="mt-2 flex gap-3"><button className="text-[10px] font-semibold text-foreground">Open Budget</button><button className="text-[10px] font-semibold text-foreground">Ask Lulu AI</button></div></div></div></div>)}</div></section></div>
          <section className="rounded-lg border border-border bg-card p-5"><h2 className="text-sm font-bold">Budget History</h2><p className="mt-1 text-[10px] text-muted-foreground">A transparent audit trail of budget changes</p><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-[11px]"><thead className="bg-card text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Date', 'User', 'Action', 'Previous Value', 'New Value'].map(h => <th key={h} className="px-3 py-2.5">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{([] as string[][]).map(row => <tr key={`${row[0]}-${row[2]}`}>{row.map((value, i) => <td key={`${row[0]}-${i}`} className="px-3 py-3 text-muted-foreground">{value}</td>)}</tr>)}</tbody></table></div></section>
          <div className="grid gap-5 xl:grid-cols-2"><section className="rounded-lg border border-border bg-gradient-to-br from-secondary to-white p-5"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">AI Insights</h2><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-foreground"><Sparkles size={11} className="mr-1 inline" />AI-generated</span></div><div className="mt-4 space-y-3">{([] as [string, string[]][]).map(([text, tags]) => <article key={text as string} className="rounded-md border border-border bg-secondary p-3"><p className="text-[11px] leading-5 text-foreground">{text}</p><div className="mt-3 flex flex-wrap gap-1.5">{(tags as string[]).map(tag => <span key={tag} className="rounded bg-secondary px-2 py-1 text-[9px] font-semibold text-foreground">{tag}</span>)}</div></article>)}</div></section><section className="rounded-lg border border-border bg-gradient-to-br from-secondary to-white p-5"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">AI Recommendations</h2><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-foreground"><Sparkles size={11} className="mr-1 inline" />AI Recommendation</span></div><ol className="mt-4 space-y-3">{([] as string[]).map((item, i) => <li key={item} className="flex items-start gap-3 text-[11px]"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{i + 1}</span><span className="flex-1 leading-5">{item}</span><button className="text-[10px] font-semibold text-foreground">View Budget</button><button className="text-[10px] font-semibold text-foreground">Ask AI</button></li>)}</ol><p className="mt-4 text-[10px] italic text-muted-foreground">AI does not automatically modify budgets.</p></section></div>
          <section className="rounded-lg border border-border bg-gradient-to-br from-secondary via-white to-secondary p-6"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={16} /></span><div><h2 className="text-sm font-bold">Ask Lulu AI</h2><p className="text-[10px] text-muted-foreground">Your budget intelligence assistant</p></div></div><div className="mt-5 flex gap-2"><input placeholder="Ask Lulu AI about your budgets..." className="h-10 flex-1 rounded-md border border-border bg-card px-3 text-xs outline-none focus:ring-2 focus:ring-ring" /><button aria-label="Send question" className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground"><Send size={15} /></button></div><div className="mt-4 flex gap-2 overflow-x-auto pb-1">{['Which categories are over budget?', 'Where are we spending more than planned?', 'Which budgets are approaching their limits?', 'Which categories are consistently under budget?', 'What is driving our budget variance?', 'Forecast our final spending.', 'Compare this budget with last year.', 'Are we on track for the annual budget?', 'Create a budget performance report.'].map(prompt => <button key={prompt} className="whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-[10px] text-foreground hover:bg-secondary">{prompt}</button>)}</div><p className="mt-4 text-[10px] text-muted-foreground">Lulu AI uses actual budget and financial data. <span className="font-semibold text-foreground">AI Insight · AI-generated</span></p></section>
        </div>
      </main>
    </div>;
};

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
