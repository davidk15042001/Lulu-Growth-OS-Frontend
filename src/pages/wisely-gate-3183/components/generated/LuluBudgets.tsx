import { useState } from 'react';
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
const budgets = [{
  name: '2026 Operating Budget',
  period: 'Jan–Dec 2026',
  planned: '€500,000',
  actual: '€312,450',
  remaining: '€187,550',
  util: 62,
  variance: '−€12,450',
  status: 'On Track',
  tone: 'green',
  updated: '08 Aug 2026'
}, {
  name: 'Marketing Budget Q3',
  period: 'Jul–Sep 2026',
  planned: '€80,000',
  actual: '€61,800',
  remaining: '€18,200',
  util: 77,
  variance: '−€1,800',
  status: 'Near Limit',
  tone: 'amber',
  updated: '07 Aug 2026'
}, {
  name: 'Technology Budget',
  period: 'Jan–Dec 2026',
  planned: '€120,000',
  actual: '€134,200',
  remaining: '−€14,200',
  util: 112,
  variance: '+€14,200',
  status: 'Over Budget',
  tone: 'red',
  updated: '06 Aug 2026'
}, {
  name: 'Sales Budget 2026',
  period: 'Jan–Dec 2026',
  planned: '€50,000',
  actual: '€34,100',
  remaining: '€15,900',
  util: 68,
  variance: '−€15,900',
  status: 'Under Budget',
  tone: 'blue',
  updated: '05 Aug 2026'
}, {
  name: 'Events Budget H2',
  period: 'Jul–Dec 2026',
  planned: '€25,000',
  actual: '€4,200',
  remaining: '€20,800',
  util: 17,
  variance: '−€20,800',
  status: 'Under Budget',
  tone: 'blue',
  updated: '04 Aug 2026'
}, {
  name: 'Product Development',
  period: 'Jan–Dec 2026',
  planned: '€200,000',
  actual: '—',
  remaining: '—',
  util: null,
  variance: '—',
  status: 'Draft',
  tone: 'slate',
  updated: '01 Aug 2026'
}];
const categoryData = [{
  name: 'Marketing',
  budget: '€80,000',
  actual: '€62,000',
  remaining: '€18,000',
  pct: 77.5,
  tone: 'amber'
}, {
  name: 'Operations',
  budget: '€100,000',
  actual: '€91,000',
  remaining: '€9,000',
  pct: 91,
  tone: 'red'
}, {
  name: 'Sales',
  budget: '€50,000',
  actual: '€34,000',
  remaining: '€16,000',
  pct: 68,
  tone: 'green'
}, {
  name: 'Technology',
  budget: '€120,000',
  actual: '€134,200',
  remaining: '−€14,200',
  pct: 112,
  tone: 'red'
}, {
  name: 'Events',
  budget: '€25,000',
  actual: '€4,200',
  remaining: '€20,800',
  pct: 17,
  tone: 'slate'
}, {
  name: 'People',
  budget: '€125,000',
  actual: '€82,000',
  remaining: '€43,000',
  pct: 65.6,
  tone: 'green'
}];
const chartData = [{
  month: 'Jan',
  budget: 41666,
  actual: 35000
}, {
  month: 'Feb',
  budget: 41666,
  actual: 38200
}, {
  month: 'Mar',
  budget: 41666,
  actual: 45100
}, {
  month: 'Apr',
  budget: 41666,
  actual: 36500
}, {
  month: 'May',
  budget: 41666,
  actual: 39800
}, {
  month: 'Jun',
  budget: 41666,
  actual: 42700
}, {
  month: 'Jul',
  budget: 41666,
  actual: 44500
}, {
  month: 'Aug',
  budget: 41666,
  actual: 30650
}];
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
  const [period, setPeriod] = useState('Monthly');
  const [activeTab, setActiveTab] = useState('Monthly');
  const [query, setQuery] = useState('');
  const [compare, setCompare] = useState(false);
  const filteredBudgets = budgets.filter(budget => budget.name.toLowerCase().includes(query.toLowerCase()));
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-[238px] flex-col bg-[var(--sidebar)] text-muted-foreground">
        <div className="flex h-[76px] items-center gap-2 border-b border-border px-5"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={17} fill="currentColor" /></span><strong className="text-lg tracking-tight text-foreground">lulu<span className="text-foreground">.ai</span></strong></div>
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {navGroups.map(group => <section key={group.label} className="mb-6"><h2 className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-muted-foreground">{group.label}</h2>{group.items.map(item => {
            const label = item[0];
            const Icon = item[1];
            return <button key={label} className={`mb-0.5 flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs transition ${label === 'Budgets' ? 'bg-secondary/15 font-semibold text-foreground ring-1 ring-ring/20' : 'hover:bg-secondary hover:text-foreground'}`}><Icon size={15} strokeWidth={1.8} /><span>{label}</span>{label === 'Budgets' && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" />}</button>;
          })}</section>)}
        </nav>
        <div className="border-t border-border p-4"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-[var(--primary-foreground)]">MC</span><div><p className="text-xs font-semibold text-foreground">Maya Collins</p><p className="mt-0.5 text-[10px] text-muted-foreground">Administrator</p></div><MoreHorizontal size={16} className="ml-auto text-muted-foreground" /></div></div>
      </aside>
      <main className="ml-[238px] min-h-screen overflow-x-hidden">
        <header className="flex min-h-[76px] items-center justify-between border-b border-border bg-card px-9"><div><div className="mb-1 flex items-center gap-1.5 text-[11px] text-muted-foreground"><span>Finance</span><ChevronRight size={12} /><span className="text-muted-foreground">Budgets</span></div><h1 className="text-[22px] font-bold tracking-[-.03em]">Budgets</h1></div><div className="flex items-center gap-2"><button className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary"><Plus size={14} />Create Budget</button><button className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-2 text-xs font-semibold text-foreground"><Sparkles size={14} />Ask Lulu AI</button><button className="hidden items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground sm:flex"><Download size={14} />Export</button><button aria-label="More actions" className="rounded-md border border-border p-2 text-foreground"><MoreHorizontal size={16} /></button></div></header>
        <div className="border-b border-border bg-card px-9 py-3"><div className="flex flex-wrap items-center gap-3"><div className="flex rounded-md border border-border p-0.5">{['Monthly', 'Quarterly', 'Annual', 'Custom'].map(item => <button key={item} onClick={() => setPeriod(item)} className={`rounded px-3 py-1.5 text-[11px] font-medium ${period === item ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-card'}`}>{item}</button>)}</div><div className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-[11px] font-medium text-foreground"><CalendarDays size={14} className="text-muted-foreground" />August 2026<ChevronDown size={13} /></div><button onClick={() => setCompare(!compare)} className="flex items-center gap-2 text-[11px] text-foreground"><span className={`h-4 w-7 rounded-full p-0.5 ${compare ? 'bg-primary' : 'bg-secondary'}`}><span className={`block h-3 w-3 rounded-full bg-card transition ${compare ? 'translate-x-3' : ''}`} /></span>Compare</button><button className="ml-auto flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-[11px] text-foreground">Status: All<ChevronDown size={13} /></button><button className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-[11px] text-foreground">2026 Operating Budget<ChevronDown size={13} /></button></div></div>
        <div className="space-y-5 p-9">
          <p className="-mt-3 text-xs text-muted-foreground">Plan your financial targets and monitor how actual performance compares with your budget.</p>
          <section className="grid grid-cols-2 gap-3 xl:grid-cols-7">{[['Total Budget', '€500,000', 'Annual 2026', 'Budget', ''], ['Actual Spend', '€312,450', 'Recorded', 'Observed', '↑'], ['Remaining', '€187,550', 'Calculated', 'Calculated', ''], ['Budget Utilization', '62.5%', 'of total budget', 'Calculated', ''], ['Variance', '−€12,450', 'Calculated', 'Calculated', ''], ['Income Target', '€280,000', 'Annual target', 'Budget', ''], ['Actual Income', '€241,200', '86.1% of target', 'Observed', '']].map(([label, value, sub, tag, arrow]) => <article key={label} className="rounded-lg border border-border bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,.03)]"><div className="flex items-start justify-between"><span className="text-[11px] font-medium text-muted-foreground">{label}</span>{arrow && <TrendingUp size={13} className="text-foreground" />}</div><strong className="mt-2 block text-lg tracking-tight text-foreground">{value}</strong><div className="mt-1 flex items-center justify-between"><span className="text-[10px] text-muted-foreground">{sub}</span><span className="rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">{tag}</span></div>{label === 'Budget Utilization' && <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full w-[62.5%] rounded-full bg-chart-4" /></div>}</article>)}</section>
          <section className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-4 py-3">{[['On Track', '4 budgets', 'green'], ['Near Limit', '2 budgets', 'amber'], ['Over Budget', '1 budget', 'red'], ['Under Budget', '2 budgets', 'blue'], ['Draft', '1 budget', 'slate'], ['Archived', '3 budgets', 'slate']].map(([label, count, tone]) => <button key={label} className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold ${toneStyles[tone as Tone].badge}`}><span className={`h-1.5 w-1.5 rounded-full ${toneStyles[tone as Tone].dot}`} />{label}<span className="font-normal opacity-70">{count}</span></button>)}</section>
          <section className="flex flex-wrap items-center gap-2"><div className="relative"><Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search budgets..." className="h-9 w-56 rounded-md border border-border bg-card pl-9 pr-8 text-xs outline-none ring-ring focus:ring-2" />{query && <button aria-label="Clear search" onClick={() => setQuery('')} className="absolute right-2 top-2 text-foreground"><X size={14} /></button>}</div>{['Status', 'Period', 'Category', 'Owner', 'Variance'].map(filter => <button key={filter} className="flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-[11px] text-foreground"><Filter size={12} className="text-muted-foreground" />{filter}<ChevronDown size={12} /></button>)}<button className="ml-auto text-[11px] font-semibold text-foreground hover:text-foreground">Clear Filters</button><button className="text-[11px] font-semibold text-foreground">Save Filter</button></section>
          <section className="rounded-lg border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,.03)]"><div className="flex items-center justify-between p-5 pb-4"><div><h2 className="text-sm font-bold">Budget List</h2><p className="mt-1 text-[10px] text-muted-foreground">Track plans, actuals, and variance across your organization</p></div><button className="text-foreground"><SlidersHorizontal size={16} /></button></div><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-[11px]"><thead className="bg-card text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Budget', 'Period', 'Planned', 'Actual', 'Remaining', 'Utilization', 'Variance', 'Status', 'Last Updated', 'Actions'].map(head => <th key={head} className="px-4 py-3 font-semibold">{head}</th>)}</tr></thead><tbody className="divide-y divide-border">{filteredBudgets.map(budget => {
                  const Icon = statusIcon(budget.status);
                  return <tr key={budget.name} className="hover:bg-card/70"><td className="px-4 py-3 font-semibold text-foreground">{budget.name}</td><td className="px-4 py-3 text-muted-foreground">{budget.period}</td><td className="px-4 py-3 font-medium">{budget.planned}</td><td className="px-4 py-3">{budget.actual}</td><td className={`px-4 py-3 ${budget.remaining.startsWith('−') ? 'text-chart-5' : ''}`}>{budget.remaining}</td><td className="px-4 py-3">{budget.util !== null && <div className="flex items-center gap-2"><div className="h-1.5 w-20 rounded-full bg-secondary"><div className={`h-full rounded-full ${toneStyles[budget.tone as Tone].bar}`} style={{
                            width: `${Math.min(budget.util, 100)}%`
                          }} /></div><span className="text-muted-foreground">{budget.util}%</span></div>}</td><td className={`px-4 py-3 font-medium ${budget.variance.startsWith('+') ? 'text-chart-5' : 'text-foreground'}`}>{money(budget.variance)}</td><td className="px-4 py-3"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${toneStyles[budget.tone as Tone].badge}`}><Icon size={11} /><span>{budget.status}</span></span></td><td className="px-4 py-3 text-muted-foreground">{budget.updated}</td><td className="px-4 py-3"><button aria-label={`Actions for ${budget.name}`}><MoreHorizontal size={15} className="text-muted-foreground" /></button></td></tr>;
                })}</tbody></table></div><div className="flex items-center justify-between border-t border-border px-5 py-3 text-[11px] text-muted-foreground"><span>Showing 1–6 of 10 budgets</span><div className="flex items-center gap-3"><span>Rows per page <strong className="text-foreground">10</strong> <ChevronDown size={12} className="inline" /></span><button aria-label="Previous page" className="rounded border border-border p-1"><ChevronRight size={14} className="rotate-180" /></button><button aria-label="Next page" className="rounded border border-border p-1"><ChevronRight size={14} /></button></div></div></section>
          <section className="rounded-lg border border-border bg-card p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-bold">Actual vs Budget</h2><p className="mt-1 text-[10px] text-muted-foreground">Monthly view · 2026 Operating Budget · Jan–Aug 2026</p></div><div className="flex rounded-md border border-border p-0.5">{['Monthly', 'Quarterly', 'Annual'].map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded px-3 py-1.5 text-[11px] font-semibold ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-primary-foreground'}`}>{tab}</button>)}</div></div><div className="mt-5 h-[260px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} barGap={4}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--background)" /><XAxis dataKey="month" tick={{
                  fontSize: 10,
                  fill: 'var(--muted-foreground)'
                }} axisLine={false} tickLine={false} /><YAxis tick={{
                  fontSize: 10,
                  fill: 'var(--muted-foreground)'
                }} axisLine={false} tickLine={false} tickFormatter={v => `€${v / 1000}k`} domain={[0, 50000]} /><Tooltip formatter={value => `€${Number(value).toLocaleString()}`} /><Legend verticalAlign="bottom" iconType="square" wrapperStyle={{
                  fontSize: '11px',
                  paddingTop: '16px'
                }} /><Bar dataKey="budget" name="Budget" fill="var(--foreground)" radius={[3, 3, 0, 0]} /><Bar dataKey="actual" name="Actual" fill="var(--muted-foreground)" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div><div className="mt-3 grid grid-cols-2 gap-4 border-t border-border pt-4 text-[11px] sm:grid-cols-4"><span>Budget total <strong className="ml-1 text-foreground">€500,000</strong></span><span>Actual YTD <strong className="ml-1 text-foreground">€312,450</strong></span><span>Variance <strong className="ml-1 text-foreground">−€12,450</strong></span><span>Utilization <strong className="ml-1 text-foreground">62.5%</strong></span></div></section>
          <div className="grid gap-5 xl:grid-cols-2"><section className="rounded-lg border border-border bg-card p-5"><h2 className="text-sm font-bold">Budget Utilization</h2><p className="mt-1 text-[10px] text-muted-foreground">By category · August 2026</p><div className="mt-5 space-y-4">{categoryData.map(item => <div key={item.name}><div className="mb-1.5 flex justify-between text-[11px]"><span className="font-medium text-foreground">{item.name}</span><span className="text-muted-foreground">{item.actual} / {item.budget} <strong className="ml-2 text-foreground">{item.pct}%</strong></span></div><div className="h-2 rounded-full bg-secondary"><div className={`h-full rounded-full ${toneStyles[item.tone as Tone].bar}`} style={{
                    width: `${Math.min(item.pct, 100)}%`
                  }} /></div></div>)}</div></section><section className="rounded-lg border border-border bg-card p-5"><h2 className="text-sm font-bold">Budget Variance</h2><p className="mt-1 text-[10px] text-muted-foreground">Category breakdown · Calculated</p><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[570px] text-left text-[11px]"><thead className="text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Category', 'Budget', 'Actual', 'Variance', 'Variance %', 'Status'].map(head => <th key={head} className="border-b border-border pb-2 font-semibold">{head}</th>)}</tr></thead><tbody className="divide-y divide-border">{categoryData.map(item => <tr key={item.name}><td className="py-2.5 font-medium">{item.name}</td><td className="py-2.5">{item.budget}</td><td className="py-2.5">{item.actual}</td><td className={`py-2.5 font-medium ${item.pct > 100 ? 'text-chart-5' : 'text-foreground'}`}>{item.pct > 100 ? '+' : '−'}{item.pct > 100 ? item.actual.replace('€', '€') : item.remaining}</td><td className="py-2.5">{item.pct > 100 ? `+${(item.pct - 100).toFixed(1)}%` : `−${(100 - item.pct).toFixed(1)}%`}</td><td className="py-2.5"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${toneStyles[item.pct > 100 ? 'red' : item.pct > 75 ? 'amber' : 'green'].badge}`}>{item.pct > 100 ? 'Over Budget' : item.pct > 75 ? 'Near Limit' : 'Under Budget'}</span></td></tr>)}</tbody></table></div><p className="mt-4 text-[10px] text-muted-foreground">Negative variance = under budget (remaining). Positive variance = over budget (exceeded).</p></section></div>
          <div className="grid gap-5 xl:grid-cols-2"><section className="rounded-lg border border-border bg-card p-5"><div className="flex items-center gap-2"><h2 className="text-sm font-bold">Over-Budget Categories</h2><span className="rounded-full bg-chart-5/10 px-2 py-1 text-[10px] font-bold text-chart-5">2</span></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[570px] text-left text-[11px]"><thead className="text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Category', 'Budget', 'Actual', 'Over Budget', '% Over', 'Trend', 'Actions'].map(h => <th key={h} className="border-b border-border pb-2">{h}</th>)}</tr></thead><tbody>{[['Technology', '€120,000', '€134,200', '+€14,200', '+11.8%'], ['Marketing Advertising', '€32,000', '€37,400', '+€5,400', '+16.9%']].map(row => <tr key={row[0]} className="border-b border-border"><td className="py-3 font-semibold">{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td className="font-semibold text-chart-5">{row[3]}</td><td className="text-chart-5">{row[4]}</td><td><TrendingUp size={14} className="text-chart-5" /></td><td><button className="text-[10px] font-semibold text-foreground">Open</button><button className="ml-2 text-[10px] font-semibold text-foreground">Ask AI</button></td></tr>)}</tbody></table></div></section><section className="rounded-lg border border-border bg-card p-5"><h2 className="text-sm font-bold">Under-Budget Categories</h2><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[480px] text-left text-[11px]"><thead className="text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Category', 'Budget', 'Actual', 'Remaining', 'Utilization'].map(h => <th key={h} className="border-b border-border pb-2">{h}</th>)}</tr></thead><tbody>{categoryData.filter(item => ['Events', 'Sales', 'People'].includes(item.name)).map(item => <tr key={item.name} className="border-b border-border"><td className="py-3 font-semibold">{item.name}</td><td>{item.budget}</td><td>{item.actual}</td><td className="text-foreground">{item.remaining}</td><td>{item.pct}%</td></tr>)}</tbody></table></div><p className="mt-4 text-[10px] text-muted-foreground">Review whether lower spending is planned or unexpected.</p></section></div>
          <div className="grid gap-5 xl:grid-cols-2"><section className="rounded-lg border border-border bg-gradient-to-br from-secondary to-white p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-bold">Budget Forecast</h2><p className="mt-1 text-[10px] text-muted-foreground">Projected year-end performance · 2026 Operating Budget</p></div><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-foreground"><Sparkles size={11} className="mr-1 inline" />AI Forecast</span></div><div className="mt-5 grid grid-cols-3 gap-3">{[['Forecast Final Spend', '€498,200'], ['Forecast Variance', '−€1,800'], ['Forecast Utilization', '99.6%']].map(([label, value]) => <div key={label}><p className="text-[10px] text-muted-foreground">{label}</p><strong className="mt-1 block text-base">{value}</strong></div>)}</div><div className="mt-5 h-12"><ResponsiveContainer width="100%" height="100%"><LineChart data={[{
                  v: 38
                }, {
                  v: 42
                }, {
                  v: 40
                }, {
                  v: 47
                }, {
                  v: 44
                }, {
                  v: 49
                }, {
                  v: 48
                }, {
                  v: 50
                }]}><Line type="monotone" dataKey="v" stroke="var(--foreground)" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div><p className="mt-3 text-[10px] text-muted-foreground">Forecast generated from 8 months of actuals and historical patterns.</p><p className="mt-2 text-[10px] italic text-muted-foreground">AI Forecast — Projected estimate, not actual. Subject to change.</p></section><section className="rounded-lg border border-border bg-card p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-bold">Budget Alerts</h2><p className="mt-1 text-[10px] text-muted-foreground">Items that need your attention</p></div><span className="rounded-full bg-chart-5/10 px-2 py-1 text-[10px] font-semibold text-chart-5"><Bell size={11} className="mr-1 inline" />3</span></div><div className="mt-4 space-y-3">{[['Technology budget exceeded limit', '+11.8% over', 'Technology Budget', '06 Aug 2026', '112%', 'red'], ['Marketing budget reached 80%', 'Marketing Q3', '07 Aug 2026', 'Threshold: 80%', '77.5%', 'amber'], ['Operating budget trending above target', 'Annual forecast €498,200', '08 Aug 2026', 'Threshold: 95%', '99.6% forecast', 'blue']].map(alert => <div key={alert[0]} className="rounded-md border border-border p-3"><div className="flex items-start gap-2"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${toneStyles[alert[5] as Tone].dot}`} /><div className="min-w-0 flex-1"><p className="text-[11px] font-semibold">{alert[0]} <span className="font-normal text-muted-foreground">— {alert[1]}</span></p><p className="mt-1 text-[10px] text-muted-foreground">{alert[2]} · {alert[3]} · Current: {alert[4]}</p><div className="mt-2 flex gap-3"><button className="text-[10px] font-semibold text-foreground">Open Budget</button><button className="text-[10px] font-semibold text-foreground">Ask Lulu AI</button></div></div></div></div>)}</div></section></div>
          <section className="rounded-lg border border-border bg-card p-5"><h2 className="text-sm font-bold">Budget History</h2><p className="mt-1 text-[10px] text-muted-foreground">A transparent audit trail of budget changes</p><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-[11px]"><thead className="bg-card text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Date', 'User', 'Action', 'Previous Value', 'New Value'].map(h => <th key={h} className="px-3 py-2.5">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{[['08 Aug 2026', 'Maya Collins', 'Budget category updated', 'Marketing: €75,000', 'Marketing: €80,000'], ['07 Aug 2026', 'System', 'Threshold alert triggered', '—', 'Marketing reached 77.5%'], ['06 Aug 2026', 'Alex Patel', 'Budget activated', 'Draft', 'Active'], ['04 Aug 2026', 'Maya Collins', 'Category added', '—', 'Events: €25,000'], ['01 Aug 2026', 'Maya Collins', 'Budget created', '—', '2026 Operating Budget']].map(row => <tr key={`${row[0]}-${row[2]}`}>{row.map((value, i) => <td key={`${row[0]}-${i}`} className="px-3 py-3 text-muted-foreground">{value}</td>)}</tr>)}</tbody></table></div></section>
          <div className="grid gap-5 xl:grid-cols-2"><section className="rounded-lg border border-border bg-gradient-to-br from-secondary to-white p-5"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">AI Insights</h2><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-foreground"><Sparkles size={11} className="mr-1 inline" />AI-generated</span></div><div className="mt-4 space-y-3">{[['Technology spending is currently 112% of the annual budget. Software subscriptions and infrastructure costs represent the largest portion of recorded spend and are trending above the previous period.', ['Budget €120,000', 'Actual €134,200', 'Utilization 112%', 'Variance +11.8%']], ['Marketing budget utilization is at 77.5% with two months remaining in Q3. Advertising campaigns account for 60% of recorded spend.', ['Budget €80,000', 'Actual €62,000', 'Remaining €18,000']]].map(([text, tags]) => <article key={text as string} className="rounded-md border border-border bg-secondary p-3"><p className="text-[11px] leading-5 text-foreground">{text}</p><div className="mt-3 flex flex-wrap gap-1.5">{(tags as string[]).map(tag => <span key={tag} className="rounded bg-secondary px-2 py-1 text-[9px] font-semibold text-foreground">{tag}</span>)}</div></article>)}</div></section><section className="rounded-lg border border-border bg-gradient-to-br from-secondary to-white p-5"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">AI Recommendations</h2><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-foreground"><Sparkles size={11} className="mr-1 inline" />AI Recommendation</span></div><ol className="mt-4 space-y-3">{['Review Technology budget allocation — actual spend exceeds planned by 11.8%', 'Investigate advertising campaigns exceeding sub-category limits', 'Review consistently underutilized Events budget — 17% utilized', 'Reforecast Q4 budgets using 8-month actuals'].map((item, i) => <li key={item} className="flex items-start gap-3 text-[11px]"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{i + 1}</span><span className="flex-1 leading-5">{item}</span><button className="text-[10px] font-semibold text-foreground">View Budget</button><button className="text-[10px] font-semibold text-foreground">Ask AI</button></li>)}</ol><p className="mt-4 text-[10px] italic text-muted-foreground">AI does not automatically modify budgets.</p></section></div>
          <section className="rounded-lg border border-border bg-gradient-to-br from-secondary via-white to-secondary p-6"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={16} /></span><div><h2 className="text-sm font-bold">Ask Lulu AI</h2><p className="text-[10px] text-muted-foreground">Your budget intelligence assistant</p></div></div><div className="mt-5 flex gap-2"><input placeholder="Ask Lulu AI about your budgets..." className="h-10 flex-1 rounded-md border border-border bg-card px-3 text-xs outline-none focus:ring-2 focus:ring-ring" /><button aria-label="Send question" className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground"><Send size={15} /></button></div><div className="mt-4 flex gap-2 overflow-x-auto pb-1">{['Which categories are over budget?', 'Where are we spending more than planned?', 'Which budgets are approaching their limits?', 'Which categories are consistently under budget?', 'What is driving our budget variance?', 'Forecast our final spending.', 'Compare this budget with last year.', 'Are we on track for the annual budget?', 'Create a budget performance report.'].map(prompt => <button key={prompt} className="whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-[10px] text-foreground hover:bg-secondary">{prompt}</button>)}</div><p className="mt-4 text-[10px] text-muted-foreground">Lulu AI uses actual budget and financial data. <span className="font-semibold text-foreground">AI Insight · AI-generated</span></p></section>
        </div>
      </main>
    </div>;
};