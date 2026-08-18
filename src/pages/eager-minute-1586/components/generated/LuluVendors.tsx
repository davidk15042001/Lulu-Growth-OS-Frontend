import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Archive, ArrowDownToLine, ArrowUpRight, BarChart3, Bell, BookOpen, BriefcaseBusiness, ChevronDown, ChevronRight, CircleHelp, CreditCard, Download, Ellipsis, FileText, Filter, GitCompareArrows, HandCoins, LayoutDashboard, Menu, MessageCircle, MoreHorizontal, PanelLeft, Plus, Search, Settings, SlidersHorizontal, Sparkles, Tags, Upload, Users, WalletCards, X, Zap } from 'lucide-react';
type Vendor = {
  name: string;
  type: string;
  spend: string;
  current: string;
  outstanding: string;
  recurring: string;
  expenses: string;
  invoices: string;
  payment: string;
  status: 'Active' | 'Inactive' | 'Archived';
};
const vendors: Vendor[] = [];
const chartData: Array<Record<string, any>> = [];
const expenses: any[][] = [];
const invoices: any[][] = [];
const payments: any[][] = [];
const categories: Array<readonly [string, string, string, string, string]> = [];
const nav = [{
  label: 'Overview',
  icon: LayoutDashboard
}, {
  label: 'Inbox',
  icon: MessageCircle
}, {
  label: 'Finance',
  icon: WalletCards,
  open: true
}, {
  label: 'Expenses',
  icon: FileText
}, {
  label: 'Payments',
  icon: CreditCard
}, {
  label: 'Reports',
  icon: BarChart3
}, {
  label: 'Settings',
  icon: Settings
}];
const filters = ['Status', 'Vendor Type', 'Spend', 'Outstanding', 'Recurring', 'Activity', 'Category', 'Date', 'Currency'];
function Badge({
  children,
  tone = 'slate'
}: {
  children: string;
  tone?: 'green' | 'amber' | 'red' | 'slate' | 'blue';
}) {
  const colors = {
    green: 'bg-secondary text-foreground ring-ring',
    amber: 'bg-secondary text-foreground ring-ring',
    red: 'bg-chart-5/10 text-chart-5 ring-chart-5',
    slate: 'bg-secondary text-muted-foreground ring-ring',
    blue: 'bg-secondary text-foreground ring-ring'
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${colors[tone]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />{children}</span>;
}
function SectionLabel({
  children,
  right
}: {
  children: string;
  right?: string;
}) {
  return <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-bold text-foreground">{children}</h2>{right && <span className="text-[11px] font-medium text-muted-foreground">{right}</span>}</div>;
}
export function LuluVendors() {
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState('Daily');
  const [drawer, setDrawer] = useState<Vendor | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const filtered = useMemo(() => vendors.filter(v => v.name.toLowerCase().includes(query.toLowerCase())), [query]);
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[226px] border-r border-border/80 bg-card lg:flex lg:flex-col"><div className="mb-5 flex items-center gap-3 px-2 py-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">L</div><span className="font-semibold text-foreground">Lulu AI</span></div><LuluSectionNavigation activeId="eager-minute-1586" /></aside>
    <main className="lg:pl-[226px]"><header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-border/80 bg-secondary px-5 backdrop-blur lg:px-8"><div className="flex items-center gap-3"><button className="rounded-lg p-2 text-foreground lg:hidden"><Menu size={19} /></button><div className="flex items-center gap-2 text-xs text-muted-foreground"><span>Finance</span><ChevronRight size={13} /><strong className="font-semibold text-foreground">Vendors</strong></div></div><div className="flex items-center gap-4"><button aria-label="Help" className="text-foreground hover:text-foreground"><CircleHelp size={18} /></button><button aria-label="Notifications" className="relative text-foreground hover:text-foreground"><Bell size={18} /><span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /></button><div className="hidden h-7 w-px bg-secondary sm:block" /><button className="flex items-center gap-2 text-xs font-semibold text-foreground"><span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--primary)] text-[10px] text-primary-foreground">JD</span><span className="hidden sm:block">Workspace member</span><ChevronDown size={13} /></button></div></header>
      <div className="mx-auto max-w-[1320px] px-5 py-7 lg:px-8"><div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start"><div><div className="mb-2 flex items-center gap-2"><span className="rounded bg-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-foreground">Finance workspace</span><span className="text-[10px] font-medium text-muted-foreground">Observed data</span></div><h1 className="text-[30px] font-bold tracking-[-.04em] text-[var(--foreground)]">Vendors</h1><p className="mt-1 text-sm text-muted-foreground">Manage and understand your supplier spending and financial relationships.</p></div><div className="flex flex-wrap items-center gap-2"><button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm shadow-black/10 transition hover:bg-primary"><Plus size={15} />Add Vendor</button><button className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary"><Sparkles size={14} />Ask Lulu AI</button><button className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-xs font-semibold text-foreground hover:bg-card"><Upload size={14} />Import</button><button className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-xs font-semibold text-foreground hover:bg-card"><Download size={14} />Export</button><button aria-label="More actions" className="rounded-lg border border-border bg-card p-2.5 text-foreground"><MoreHorizontal size={16} /></button></div></div>
      <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">{([] as string[][]).map(([label, value, trend]) => <article key={label} className="rounded-xl border border-border/80 bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,.02)]"><p className="text-[11px] font-medium leading-4 text-muted-foreground">{label}</p><p className="mt-2 whitespace-nowrap text-[18px] font-bold tracking-tight text-[var(--chart-3)]">{value}</p><p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-chart-4"><ArrowUpRight size={12} />{trend}<span className="font-normal text-muted-foreground">vs previous</span></p></article>)}</div>
      <div className="mt-6 flex flex-col justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-center"><div className="flex items-center gap-2"><span className="text-xs font-semibold text-muted-foreground">Period</span><button className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground">Last 30 Days<ChevronDown size={14} /></button><span className="hidden text-xs text-muted-foreground sm:block">Compared with <strong className="font-semibold text-muted-foreground">Previous Period</strong></span></div><span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><span className="h-2 w-2 rounded-full bg-primary text-primary-foreground" />Values and sync status come from connected records</span></div>
      <section className="mt-5 rounded-xl border border-border/80 bg-card shadow-[0_1px_3px_rgba(0,0,0,.03)]"><div className="flex flex-col gap-3 border-b border-border p-4 xl:flex-row xl:items-center"><div className="relative min-w-[230px] flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><input aria-label="Search vendors" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search vendors" className="w-full rounded-lg border border-border bg-secondary py-2.5 pl-9 pr-3 text-xs outline-none ring-ring transition placeholder:text-muted-foreground focus:bg-card focus:ring-2" /></div><div className="flex flex-wrap items-center gap-2"><button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground"><Filter size={14} />Filters</button>{filters.map(filter => <button key={filter} className="hidden items-center gap-1 rounded-full border border-border px-3 py-1.5 text-[11px] font-medium text-foreground hover:border-border hover:text-foreground sm:flex">{filter}<ChevronDown size={11} /></button>)}<button className="px-2 text-[11px] font-semibold text-foreground hover:text-foreground">Clear Filters</button><button className="rounded-lg bg-secondary px-3 py-2 text-[11px] font-semibold text-foreground hover:bg-secondary">Save Filter</button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left text-xs"><thead className="sticky top-[72px] z-[1] border-b border-border bg-card/95 text-[10px] uppercase tracking-[.06em] text-muted-foreground"><tr>{['Vendor', 'Type', 'Total Spend', 'Current Period', 'Outstanding', 'Recurring Spend', 'Expenses', 'Invoices', 'Last Payment', 'Status', ''].map(head => <th key={head} className="whitespace-nowrap px-4 py-3 font-bold">{head}</th>)}</tr></thead><tbody>{filtered.map(v => <tr key={v.name} className="border-b border-border last:border-0 hover:bg-secondary/30"><td className="px-4 py-3.5"><button onClick={() => setDrawer(v)} className="font-bold text-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring">{v.name}</button><span className="mt-1 block text-[10px] text-muted-foreground">Observed</span></td><td className="px-4 py-3.5 text-muted-foreground">{v.type}</td><td className="px-4 py-3.5 font-semibold text-foreground">{v.spend}</td><td className="px-4 py-3.5 text-muted-foreground">{v.current}</td><td className="px-4 py-3.5 text-muted-foreground">{v.outstanding}</td><td className="px-4 py-3.5 text-muted-foreground">{v.recurring}</td><td className="px-4 py-3.5 text-muted-foreground">{v.expenses}</td><td className="px-4 py-3.5 text-muted-foreground">{v.invoices}</td><td className="px-4 py-3.5 text-muted-foreground">{v.payment}</td><td className="px-4 py-3.5"><Badge tone={v.status === 'Active' ? 'green' : 'slate'}>{v.status}</Badge></td><td className="relative px-4 py-3.5"><button onClick={() => setActiveMenu(activeMenu === v.name ? null : v.name)} aria-label={`Actions for ${v.name}`} className="rounded p-1 text-foreground hover:bg-secondary hover:text-foreground"><Ellipsis size={17} /></button>{activeMenu === v.name && <div className="absolute right-4 top-11 z-10 w-48 rounded-lg border border-border bg-card p-1.5 text-[11px] shadow-xl">{['Open Financial Profile', 'Edit', 'View Expenses', 'View Invoices', 'View Payments', 'View Transactions', 'Ask Lulu AI', 'Export', 'Archive'].map(action => <button key={action} onClick={() => setActiveMenu(null)} className="block w-full rounded px-2.5 py-2 text-left text-foreground hover:bg-card hover:text-foreground">{action}</button>)}</div>}</td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-border px-4 py-3 text-[11px] text-muted-foreground"><span>Showing {filtered.length} connected vendors · Connected values</span><div className="flex gap-1"><button className="rounded border border-border px-2 py-1">Previous</button><button className="rounded bg-primary px-2.5 py-1 font-semibold text-primary-foreground">1</button><button className="rounded border border-border px-2 py-1">2</button><button className="rounded border border-border px-2 py-1">Next</button></div></div></section>
      <section className="mt-6 rounded-xl border border-border/80 bg-card p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><SectionLabel right="Observed · Calculated">Vendor Spend</SectionLabel><p className="-mt-2 text-xs text-muted-foreground">Total, recurring, and one-time spend over the selected period</p></div><div className="flex rounded-lg bg-secondary p-1">{['Daily', 'Weekly', 'Monthly'].map(item => <button key={item} onClick={() => setPeriod(item)} className={`rounded-md px-3 py-1.5 text-[11px] font-semibold ${period === item ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}>{item}</button>)}</div></div><div className="mt-5 flex flex-wrap gap-5 text-[11px] font-medium text-muted-foreground"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Total Spend <strong className="ml-1 text-foreground">—</strong></span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Recurring Spend</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />One-time Spend</span><span className="text-muted-foreground">Dashed line: previous period</span></div><div className="mt-3 h-[245px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{
                top: 12,
                right: 12,
                left: -18,
                bottom: 0
              }}><defs><linearGradient id="vendorBlue" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={.18} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="var(--background)" vertical={false} /><XAxis dataKey="day" tick={{
                  fontSize: 10,
                  fill: 'var(--muted-foreground)'
                }} axisLine={false} tickLine={false} /><YAxis tick={{
                  fontSize: 10,
                  fill: 'var(--muted-foreground)'
                }} axisLine={false} tickLine={false} tickFormatter={value => `${value / 1000}k`} /><Tooltip contentStyle={{
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 11
                }} /><Area type="monotone" dataKey="total" stroke="var(--foreground)" strokeWidth={2.5} fill="url(#vendorBlue)" /><Area type="monotone" dataKey="recurring" stroke="var(--foreground)" strokeWidth={1.8} fill="none" /><Area type="monotone" dataKey="oneTime" stroke="var(--foreground)" strokeWidth={1.8} fill="none" /><Area type="monotone" dataKey="compare" stroke="var(--muted-foreground)" strokeDasharray="5 5" strokeWidth={1.5} fill="none" /></AreaChart></ResponsiveContainer></div></section>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">{[["Vendor Expenses", ['Expense', 'Date', 'Category', 'Amount', 'Account', 'Status'], expenses], ["Vendor Invoices", ['Invoice number', 'Invoice Date', 'Due Date', 'Amount', 'Status', 'Payment Status'], invoices], ["Vendor Payments", ['Payment', 'Date', 'Amount', 'Account', 'Method', 'Status'], payments]].map(([title, headers, rows]) => <section key={title as string} className="rounded-xl border border-border/80 bg-card p-5"><SectionLabel right="Observed">{title as string}</SectionLabel><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-[11px]"><thead className="border-y border-border text-[10px] uppercase tracking-wide text-muted-foreground"><tr>{(headers as string[]).map(h => <th key={h} className="py-2.5 pr-4 font-bold">{h}</th>)}<th className="py-2.5 text-right">Open</th></tr></thead><tbody>{(rows as string[][]).map(row => <tr key={row[0]} className="border-b border-border last:border-0"><td className="py-3 pr-4 font-semibold text-foreground">{row[0]}</td>{row.slice(1).map((cell, i) => <td key={`${row[0]}-${i}`} className="whitespace-nowrap py-3 pr-4 text-muted-foreground">{cell}</td>)}<td className="py-3 text-right"><button className="font-semibold text-foreground hover:text-foreground">Open</button></td></tr>)}</tbody></table></div></section>)}</div>
      <section className="mt-6 grid gap-6 xl:grid-cols-2"><div className="rounded-xl border border-border/80 bg-card p-5"><SectionLabel right="Calculated">Recurring Costs</SectionLabel><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-[11px]"><thead className="border-y border-border text-[10px] uppercase tracking-wide text-muted-foreground"><tr>{['Vendor', 'Description', 'Amount', 'Frequency', 'Next Expected', 'Annualized Cost', 'Status', 'Actions'].map(h => <th key={h} className="py-2.5 pr-3 font-bold">{h}</th>)}</tr></thead><tbody><tr><td className="py-3 font-semibold">Adobe</td><td className="py-3 text-muted-foreground">Creative Cloud</td><td className="py-3">1,250 EUR</td><td className="py-3 text-muted-foreground">Monthly</td><td className="py-3 text-muted-foreground">01 Sep 2026</td><td className="py-3">15,000 EUR</td><td className="py-3"><Badge tone="green">Active</Badge></td><td className="py-3 text-foreground">Open · Edit · Pause</td></tr></tbody></table></div></div><div className="rounded-xl border border-border/80 bg-card p-5"><SectionLabel right="Calculated metric">Vendor Concentration</SectionLabel><p className="mb-4 text-xs leading-5 text-muted-foreground">Top 10 vendors represent <strong className="text-foreground">46%</strong> of recorded vendor spending.</p>{[['Adobe', '18,450 EUR', '15%'], ['Salesforce', '14,200 EUR', '11%'], ['DHL Express', '9,640 EUR', '8%'], ['Vodafone', '3,960 EUR', '3%']].map(([name, amount, pct]) => <div key={name} className="mb-3 flex items-center gap-3"><span className="w-24 text-[11px] font-semibold text-foreground">{name}</span><div className="h-2 flex-1 rounded-full bg-secondary"><div className="h-2 rounded-full bg-primary text-primary-foreground" style={{
                  width: pct
                }} /></div><span className="w-20 text-right text-[11px] text-muted-foreground">{amount} · {pct}</span></div>)}</div></section>
      <div className="mt-6 grid gap-6 xl:grid-cols-2"><section className="rounded-xl border border-border/80 bg-card p-5"><SectionLabel right="Observed · Calculated">Spend by Category</SectionLabel><div className="grid gap-4 sm:grid-cols-[1fr_140px]"><table className="w-full text-left text-[11px]"><thead className="border-y border-border text-[10px] uppercase tracking-wide text-muted-foreground"><tr>{['Category', 'Spend', '%', 'Growth', 'Count'].map(h => <th key={h} className="py-2 font-bold">{h}</th>)}</tr></thead><tbody>{categories.map(row => <tr key={row[0]} className="border-b border-border last:border-0"><td className="py-2.5 font-semibold">{row[0]}</td>{row.slice(1).map((x, i) => <td key={`${row[0]}-${i}`} className="py-2.5 text-muted-foreground">{x}</td>)}</tr>)}</tbody></table><div className="flex flex-col items-center justify-center"><div className="grid h-28 w-28 place-items-center rounded-full" style={{
                  background: 'conic-gradient(var(--primary) 0 39%, var(--primary) 39% 65%, var(--primary) 65% 85%, var(--primary) 85% 95%, var(--muted) 95%)'
                }}><div className="grid h-16 w-16 place-items-center rounded-full bg-card text-center text-[10px] font-bold text-muted-foreground">Vendor<br />Spend</div></div><p className="mt-2 text-[10px] text-muted-foreground">by category</p></div></div></section><section className="rounded-xl border border-border/80 bg-card p-5"><SectionLabel right="Calculated metric">Highest Vendor Spend</SectionLabel>{vendors.slice(0, 4).map((v, i) => <div key={v.name} className="flex items-center gap-3 border-b border-border py-3 last:border-0"><span className="w-4 text-xs font-bold text-muted-foreground">0{i + 1}</span><div className="flex-1"><p className="text-xs font-bold">{v.name}</p><p className="mt-1 text-[10px] text-muted-foreground">{v.current} current · {v.recurring} recurring</p></div><div className="text-right"><p className="text-xs font-bold">{v.spend}</p><p className="text-[10px] font-semibold text-foreground">+{i + 4}%</p></div><button onClick={() => setDrawer(v)} className="rounded-md border border-border px-2 py-1 text-[10px] font-semibold text-foreground">Open Vendor</button></div>)}</section></div>
      <section className="mt-6 grid gap-6 xl:grid-cols-2"><div className="rounded-xl border border-border/80 bg-card p-5"><SectionLabel right="AI Assessment">Vendor Anomalies</SectionLabel>{[['Adobe', 'Spend increased 34% vs previous period', 'Medium', 'A large one-time license renewal was recorded.', 'amber'], ['Unknown Vendor LLC', 'Possible duplicate detected', 'High', 'Name and bank reference resemble an existing supplier.', 'red']].map(([name, reason, severity, evidence, tone]) => <article key={name} className="mb-3 rounded-lg border border-border bg-card/60 p-3.5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold">{name}</p><p className="mt-1 text-xs text-muted-foreground">{reason}</p></div><Badge tone={tone as 'amber' | 'red'}>{severity}</Badge></div><p className="mt-2 text-[11px] text-muted-foreground">Detected 09 Aug 2026 · Evidence: {evidence}</p><div className="mt-3 flex gap-2"><button className="rounded-md bg-card px-2.5 py-1.5 text-[10px] font-semibold text-foreground ring-1 ring-ring">Investigate</button><button className="rounded-md bg-card px-2.5 py-1.5 text-[10px] font-semibold text-foreground ring-1 ring-ring">Ask Lulu AI</button></div></article>)}</div><div className="rounded-xl border border-border/80 bg-card p-5"><SectionLabel right="Unavailable: source data incomplete">Possible Duplicate Vendors</SectionLabel><p className="mb-3 text-xs text-muted-foreground">Potential matches require explicit confirmation. Lulu never auto-merges records.</p>{[['Unknown Vendor LLC', 'Adobe Europe', 'Name similarity · 82%'], ['DHL Express GmbH', 'DHL Express', 'Address similarity · 76%']].map(pair => <div key={pair[0]} className="flex flex-wrap items-center gap-2 border-b border-border py-3 text-xs last:border-0"><strong>{pair[0]}</strong><GitCompareArrows size={14} className="text-muted-foreground" /><strong>{pair[1]}</strong><span className="text-[10px] text-muted-foreground">{pair[2]}</span><div className="ml-auto flex gap-2"><button className="text-[10px] font-semibold text-foreground">Compare</button><button className="text-[10px] font-semibold text-foreground">Keep Separate</button><button className="text-[10px] font-semibold text-foreground">Merge</button></div></div>)}</div></section>
      <section className="mt-6 grid gap-6 xl:grid-cols-2"><div className="rounded-xl border border-border bg-secondary/45 p-5"><SectionLabel right="AI-generated">AI Vendor Insights</SectionLabel><div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-[10px] font-bold text-foreground ring-1 ring-ring"><Sparkles size={12} />AI Insight</div><p className="text-sm font-semibold leading-6 text-foreground">Vendor spending increased 11% compared with the previous period. The largest increase came from software providers.</p><div className="mt-4 flex flex-wrap gap-2">{['Current spend', 'Previous spend', 'Category contribution', 'Vendor contribution'].map(chip => <span key={chip} className="rounded-full bg-card px-2.5 py-1.5 text-[10px] font-medium text-foreground ring-1 ring-ring">{chip}</span>)}</div></div><div className="rounded-xl border border-border/80 bg-card p-5"><SectionLabel right="AI does not modify records automatically">AI Recommendations</SectionLabel>{[['Review significant vendor spend increases', 'Adobe +34%.'], ['Investigate possible duplicate vendors', '2 detected.'], ['Review recurring costs for inactive vendors', '1 recurring relationship.']].map(([title, detail]) => <button key={title} className="mb-2 flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left hover:border-border hover:bg-secondary/30"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-secondary text-foreground"><Zap size={14} /></span><span className="flex-1"><strong className="block text-xs text-foreground">{title}</strong><span className="text-[11px] text-muted-foreground">{detail}</span></span><Badge tone="blue">AI Recommendation</Badge></button>)}</div></section>
      <section className="mt-6 rounded-xl border border-[var(--border)] bg-card p-5"><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={15} /></div><div><h2 className="text-sm font-bold text-foreground">Ask Lulu AI</h2><p className="text-[11px] text-muted-foreground">Explore your vendor relationships with natural language</p></div><span className="ml-auto hidden text-[10px] text-muted-foreground sm:block">AI-generated responses are clearly labeled</span></div><div className="mt-4 flex gap-2 overflow-x-auto pb-1">{['Which vendors cost us the most', 'Which vendors have outstanding balances', 'Find unusual vendor spending', 'Find possible duplicate vendors', 'Compare vendor spending with last month', 'Show inactive high-spend vendors'].map(prompt => <button key={prompt} onClick={() => setQuestion(prompt)} className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-[10px] font-medium text-foreground hover:border-border hover:text-foreground">{prompt}</button>)}</div><div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-secondary p-2 focus-within:border-border"><MessageCircle size={16} className="ml-2 text-muted-foreground" /><input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask Lulu AI about vendors" className="flex-1 bg-transparent px-2 py-2 text-xs outline-none" /><button className="rounded-md bg-primary px-3 py-2 text-[11px] font-bold text-primary-foreground hover:bg-primary">Ask</button></div></section>
      <footer className="py-8 text-center text-[10px] text-muted-foreground">Observed, calculated, and AI-generated information is labeled throughout</footer></div></main>
    {drawer && <div className="fixed inset-0 z-30 flex justify-end bg-sidebar/20" onClick={() => setDrawer(null)}><aside role="dialog" aria-label={`${drawer.name} financial profile`} className="h-full w-full max-w-md overflow-y-auto border-l border-border bg-card p-6 shadow-2xl" onClick={e => e.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-foreground">Financial profile</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)]">{drawer.name}</h2><p className="mt-1 text-xs text-muted-foreground">{drawer.type} · <span className="text-foreground">{drawer.status}</span></p></div><button aria-label="Close profile" onClick={() => setDrawer(null)} className="rounded-lg p-2 text-foreground hover:bg-secondary"><X size={18} /></button></div><div className="mt-7 grid grid-cols-2 gap-3">{[['Total spend', drawer.spend], ['Current period', drawer.current], ['Outstanding', drawer.outstanding], ['Recurring', drawer.recurring]].map(([label, value]) => <div key={label} className="rounded-lg bg-card p-3"><p className="text-[10px] text-muted-foreground">{label}</p><p className="mt-1 text-sm font-bold text-foreground">{value}</p></div>)}</div><div className="mt-7 border-t border-border pt-5"><h3 className="text-xs font-bold text-foreground">Activity summary</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{drawer.expenses} expenses and {drawer.invoices} invoices recorded. Last payment was {drawer.payment}.</p><p className="mt-4 text-[10px] text-muted-foreground">Observed data · Connected vendor profile</p></div><button className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-bold text-primary-foreground"><Sparkles size={14} />Ask Lulu AI about {drawer.name}</button></aside></div>}
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
