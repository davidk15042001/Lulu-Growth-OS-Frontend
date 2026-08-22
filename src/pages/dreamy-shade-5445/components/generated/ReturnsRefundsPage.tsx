import { useMemo, useState } from 'react';
import { Activity, AlertCircle, ArrowDown, ArrowUp, Bot, Check, ChevronDown, ChevronRight, CircleHelp, Clock3, Download, Ellipsis, Filter, MoreHorizontal, Package, Plus, RefreshCw, Search, Send, Settings2, ShoppingBag, SlidersHorizontal, Sparkles, Store, UserRound, X, Zap } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type ReturnItem = {
  id: string;
  order: string;
  customer: string;
  store: string;
  products: string;
  reason: string;
  refund: string;
  amount: string;
  status: string;
  date: string;
  refundTone: 'blue' | 'green' | 'red' | 'gray';
  statusTone: 'amber' | 'green' | 'red' | 'blue';
};
type AlertItem = {
  id: string;
  title: string;
  store: string;
  amount?: string;
  severity: 'Critical' | 'Warning' | 'Info';
};
type Tone = 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'gray';
const returns: ReturnItem[] = [];
const alerts: AlertItem[] = [];
const reasons: Array<Record<string, any>> = [];
const nav = [{
  label: 'Overview',
  icon: Activity
}, {
  label: 'Orders',
  icon: Package
}, {
  label: 'Products',
  icon: ShoppingBag
}, {
  label: 'Customers',
  icon: UserRound
}, {
  label: 'Ecommerce',
  icon: Store,
  children: ['Returns & Refunds', 'Store Performance']
}, {
  label: 'Analytics',
  icon: Zap
}, {
  label: 'Integrations',
  icon: Settings2
}];
const toneClasses: Record<Tone, string> = {
  green: 'text-foreground bg-secondary/10 border-border/20',
  amber: 'text-foreground bg-secondary/10 border-border/20',
  red: 'text-chart-5 bg-chart-5/10 border-chart-5/20',
  blue: 'text-foreground bg-secondary/10 border-border/20',
  purple: 'text-[var(--chart-3)] bg-[var(--chart-3)]/10 border-[var(--chart-3)]/25',
  gray: 'text-foreground bg-muted/10 border-border/20'
};
function Pill({
  children,
  tone
}: {
  children: string;
  tone: Tone;
}) {
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold ${toneClasses[tone]}`}><span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />{children}</span>;
}
function SectionTitle({
  title,
  subtitle,
  action
}: {
  title: string;
  subtitle?: string;
  action?: string;
}) {
  return <div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="text-[15px] font-extrabold tracking-tight text-foreground">{title}</h2>{subtitle && <p className="mt-1 text-xs text-[var(--muted-foreground)]">{subtitle}</p>}</div>{action && <button className="text-xs font-semibold text-[var(--foreground)] hover:text-foreground">{action} <ChevronRight className="inline h-3.5 w-3.5" /></button>}</div>;
}
export function ReturnsRefundsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [dateOpen, setDateOpen] = useState(false);
  const [date, setDate] = useState('Last 30 Days');
  const [activityOpen, setActivityOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const [aiText, setAiText] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const { items: returnRecords, loading, error, refresh: refreshReturns } = useLiveRecords('ecommerce_returns');
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => { void refreshReturns(); setRefreshing(true); window.setTimeout(() => setRefreshing(false), 700); };
  const filteredReturns = useMemo(() => returns.filter(item => `${item.id} ${item.order} ${item.customer} ${item.store} ${item.reason}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };
  const toggleRow = (id: string) => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const ask = (prompt = aiText) => {
    if (!prompt.trim()) return;
    setAiAnswer(`Lulu AI found 8 records matching “${prompt}”. Three failed refunds and five long-pending returns should be reviewed first.`);
    setAiText('');
  };
  if (loading) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground">Loading live return records…</main>;
  if (error) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-destructive">{error}</main>;
  if (!loading && !error) return <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10"><div className="mx-auto max-w-6xl"><header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs uppercase tracking-[.18em] text-muted-foreground">Ecommerce / Returns &amp; Refunds</p><h1 className="mt-2 text-3xl font-bold">Returns &amp; Refunds</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Verified return and refund records from connected stores. Customer, status and issue data appear only when returned by the backend.</p></div><button type="button" onClick={refresh} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-secondary"><RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /> Refresh</button></header>{returnRecords.length === 0 ? <section className="rounded-2xl border border-dashed border-border bg-card p-10 text-center"><Package className="mx-auto mb-4 text-muted-foreground" size={30} /><h2 className="text-xl font-semibold">No verified return records yet</h2><p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">Connect a store and synchronize returns before reviewing refunds, reasons or customer issues.</p></section> : <section className="overflow-hidden rounded-2xl border border-border bg-card"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">Return</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Stage</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Updated</th></tr></thead><tbody className="divide-y divide-border">{returnRecords.map(record => <tr key={record.id}><td className="px-4 py-3 font-medium">{record.name}</td><td className="px-4 py-3">{record.status}</td><td className="px-4 py-3 text-muted-foreground">{record.stage ?? '—'}</td><td className="max-w-md px-4 py-3 text-muted-foreground">{record.description ?? '—'}</td><td className="px-4 py-3 text-muted-foreground">{new Date(record.updatedAt).toLocaleString()}</td></tr>)}</tbody></table></div></section>}</div></main>;
  return <main className="min-h-screen bg-[var(--background)] text-foreground selection:bg-[var(--primary)]/30">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[236px] border-r border-[var(--muted-foreground)] bg-[var(--sidebar)] lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-[var(--muted-foreground)] px-6"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary)] text-lg font-black text-primary-foreground shadow-[0_0_20px_rgba(0,0,0,0.45)]">L</div><div><p className="font-extrabold tracking-tight text-foreground">Lulu AI</p><p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Command center</p></div></div>
      <LuluSectionNavigation activeId="dreamy-shade-5445" />
      <div className="border-t border-[var(--muted-foreground)] p-4"><div className="flex items-center gap-3 rounded-lg bg-secondary p-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] text-xs font-bold">JS</div><div className="min-w-0"><p className="truncate text-xs font-bold text-foreground">Jordan Smith</p><p className="text-[11px] text-[var(--muted-foreground)]">Administrator</p></div><MoreHorizontal className="ml-auto h-4 w-4 text-[var(--muted-foreground)]" /></div></div>
    </aside>
    <section className="lg:pl-[236px]"><header className="border-b border-[var(--border)]/30 bg-[var(--sidebar)] px-5 py-5 shadow-[0_1px_20px_rgba(0,0,0,0.08)] lg:px-8"><div className="mx-auto max-w-[1420px]"><div className="flex flex-wrap items-start justify-between gap-5"><div><div className="mb-3 flex items-center gap-2 text-xs text-[var(--muted-foreground)]"><span>Ecommerce</span><ChevronRight className="h-3 w-3" /><span className="text-[var(--foreground)]">Returns & Refunds</span></div><h1 className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">Returns & Refunds</h1><p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">Manage ecommerce returns, refund requests and refund activity across your connected stores.</p></div><div className="flex flex-wrap items-center gap-2"><button onClick={() => showToast('Return creation opened')} className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-3.5 py-2.5 text-xs font-bold text-primary-foreground shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:bg-[var(--primary)]"><Plus className="h-4 w-4" />Create Return</button><button onClick={() => document.getElementById('ai-card')?.scrollIntoView({
                behavior: 'smooth'
              })} className="flex items-center gap-2 rounded-lg border border-[var(--border)]/40 bg-[var(--primary)]/10 px-3.5 py-2.5 text-xs font-bold text-[var(--foreground)]"><Bot className="h-4 w-4" />Ask Lulu AI</button><button aria-label="Refresh" onClick={() => showToast('Returns refreshed just now')} className="rounded-lg border border-[var(--muted-foreground)] p-2.5 text-[var(--muted-foreground)] hover:bg-secondary"><RefreshCw className="h-4 w-4" /></button><button onClick={() => showToast('Export prepared')} className="hidden items-center gap-2 rounded-lg border border-[var(--muted-foreground)] px-3 py-2.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-foreground sm:flex"><Download className="h-4 w-4" />Export</button><button aria-label="More" className="rounded-lg border border-[var(--muted-foreground)] p-2.5 text-[var(--muted-foreground)]"><Ellipsis className="h-4 w-4" /></button></div></div></div></header>
      <div className="mx-auto max-w-[1420px] space-y-6 px-5 py-6 lg:px-8"><div className="flex flex-wrap items-center gap-2"><button className="flex items-center gap-2 rounded-lg border border-[var(--muted-foreground)] bg-[var(--primary)] px-3 py-2.5 text-xs font-semibold text-primary-foreground"><Store className="h-4 w-4 text-[var(--foreground)]" />All Stores<span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)] text-primary-foreground" /><ChevronDown className="h-3.5 w-3.5 text-[var(--muted-foreground)]" /></button><div className="relative"><button onClick={() => setDateOpen(!dateOpen)} className="flex items-center gap-2 rounded-lg border border-[var(--muted-foreground)] bg-[var(--primary)] px-3 py-2.5 text-xs font-semibold text-primary-foreground"><Clock3 className="h-4 w-4 text-[var(--muted-foreground)]" />{date}<ChevronDown className="h-3.5 w-3.5 text-[var(--muted-foreground)]" /></button>{dateOpen && <div className="absolute left-0 top-12 z-10 w-44 rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] p-1 shadow-2xl">{['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'YTD', 'Custom'].map(option => <button key={option} onClick={() => {
                setDate(option);
                setDateOpen(false);
              }} className="w-full rounded px-3 py-2 text-left text-xs text-[var(--foreground)] hover:bg-[var(--primary)]/15">{option}</button>)}</div>}</div><div className="relative min-w-[220px] flex-1 lg:max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" /><input value={query} onChange={e => setQuery(e.target.value)} aria-label="Search returns" placeholder="Search by return ID, order, customer, SKU..." className="w-full rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] py-2.5 pl-9 pr-3 text-xs text-foreground outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)]" /></div><button className="rounded-lg border border-[var(--muted-foreground)] p-2.5 text-[var(--muted-foreground)]"><SlidersHorizontal className="h-4 w-4" /></button><div className="flex w-full flex-wrap gap-2 lg:w-auto">{['Return Status', 'Refund Status', 'Return Reason', 'Store', 'Refund Amount'].map(chip => <button key={chip} className="rounded-full border border-[var(--muted-foreground)] bg-secondary px-3 py-2 text-xs text-[var(--muted-foreground)] hover:border-[var(--border)]/50 hover:text-foreground">{chip}<ChevronDown className="ml-1 inline h-3 w-3" /></button>)}</div><button className="text-xs font-semibold text-[var(--foreground)]">Saved Filters</button><button onClick={() => setQuery('')} className="text-xs text-[var(--muted-foreground)] hover:text-foreground">Clear Filters</button></div>
        <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{[['Open Returns', '34', 'amber', '+8.2%'], ['Pending Refunds', '18', 'blue', '+4.1%'], ['Completed Refunds', '247', 'green', '+12.6%'], ['Failed Refunds', '3', 'red', '-2.4%'], ['Returned Items', '89', 'purple', '+6.8%'], ['Attention Required', '11', 'amber', '+3.5%']].map(([label, value, tone, trend]) => <article key={label} className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-4 shadow-[inset_0_1px_0_rgba(0,0,0,0.03)]"><div className="mb-4 flex items-center gap-2 text-xs text-[var(--muted-foreground)]"><span className={`h-2 w-2 rounded-full bg-${tone}-400 shadow-[0_0_9px_currentColor]`}></span>{label}</div><div className="flex items-end justify-between"><strong className="text-2xl font-extrabold tracking-tight text-foreground">{value}</strong><span className={`text-[11px] ${trend.startsWith('-') ? 'text-chart-5' : 'text-chart-4'}`}>{trend.startsWith('-') ? <ArrowDown className="inline h-3 w-3" /> : <ArrowUp className="inline h-3 w-3" />}{trend.replace('+', '')}</span></div></article>)}</section>
        <section className="rounded-xl border border-[var(--chart-1)]/50 border-l-4 border-l-chart-1 bg-[var(--card)] p-4 shadow-[0_0_20px_rgba(0,0,0,0.07)]"><SectionTitle title="Returns Requiring Attention" subtitle="Resolve issues before they affect customer experience." action="View all 11" /><div className="space-y-2">{alerts.map(alert => <div key={alert.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--muted-foreground)] bg-primary/10 px-3 py-3 text-xs"><Pill tone={alert.severity === 'Critical' ? 'red' : alert.severity === 'Warning' ? 'amber' : 'blue'}>{alert.severity}</Pill><strong className="text-foreground">{alert.id}</strong><span className="font-semibold text-[var(--foreground)]">{alert.title}</span><span className="text-[var(--muted-foreground)]">{alert.store}</span>{alert.amount && <strong className="ml-auto text-foreground">{alert.amount}</strong>}<button onClick={() => showToast(`Reviewing ${alert.id}`)} className="rounded border border-[var(--muted-foreground)] px-2.5 py-1.5 font-semibold text-[var(--foreground)] hover:bg-[var(--primary)]/15">Review</button><button onClick={() => {
                setAiText(alert.title);
                document.getElementById('ai-card')?.scrollIntoView({
                  behavior: 'smooth'
                });
              }} className="rounded border border-[var(--muted-foreground)] px-2.5 py-1.5 font-semibold text-[var(--muted-foreground)] hover:text-foreground">Ask AI</button></div>)}</div></section>
        <section><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><SectionTitle title="Returns & Refunds" subtitle={`${filteredReturns.length} of 312 records`} /><div className="flex items-center gap-2">{selected.length > 0 && <div className="flex items-center gap-2 rounded-lg border border-[var(--border)]/30 bg-[var(--primary)]/10 px-3 py-2 text-xs"><span className="font-bold text-foreground">{selected.length} selected</span><button className="text-[var(--foreground)]" onClick={() => showToast('Export started')}>Export</button><button className="text-[var(--foreground)]" onClick={() => showToast('Refund processing started')}>Process Refund</button><button className="text-[var(--foreground)]" onClick={() => {
                  setAiText('selected returns');
                  document.getElementById('ai-card')?.scrollIntoView({
                    behavior: 'smooth'
                  });
                }}>Ask AI</button></div>}<button onClick={() => setSortAsc(!sortAsc)} className="flex items-center gap-2 rounded-lg border border-[var(--muted-foreground)] px-3 py-2 text-xs text-[var(--muted-foreground)]">Sort by date {sortAsc ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}</button></div></div><div className="overflow-x-auto rounded-xl border border-[var(--muted-foreground)] bg-[var(--secondary)]"><table className="w-full min-w-[1160px] text-left text-xs"><thead className="bg-[var(--background)] text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]"><tr><th className="w-10 px-4 py-3"><input type="checkbox" checked={selected.length === filteredReturns.length} onChange={e => setSelected(e.target.checked ? filteredReturns.map(item => item.id) : [])} aria-label="Select all" /></th>{['Return', 'Order', 'Customer', 'Store', 'Products', 'Return Reason', 'Refund Status', 'Amount', 'Status', 'Last Update', 'Actions'].map(head => <th key={head} className="border-l border-[var(--muted-foreground)] px-3 py-3 font-bold">{head}</th>)}</tr></thead><tbody>{filteredReturns.map(item => <tr key={item.id} className="border-t border-[var(--muted-foreground)] transition hover:bg-[var(--background)]"><td className="px-4 py-4"><input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleRow(item.id)} aria-label={`Select ${item.id}`} /></td><td className="border-l border-[var(--muted-foreground)] px-3 font-bold text-[var(--foreground)]">{item.id}</td><td className="border-l border-[var(--muted-foreground)] px-3 text-[var(--foreground)]">{item.order}</td><td className="border-l border-[var(--muted-foreground)] px-3 font-semibold text-foreground">{item.customer}</td><td className="border-l border-[var(--muted-foreground)] px-3 text-[var(--muted-foreground)]">{item.store}</td><td className="border-l border-[var(--muted-foreground)] px-3 text-[var(--muted-foreground)]">{item.products}</td><td className="border-l border-[var(--muted-foreground)] px-3 text-[var(--foreground)]">{item.reason}</td><td className="border-l border-[var(--muted-foreground)] px-3"><Pill tone={item.refundTone}>{item.refund}</Pill></td><td className="border-l border-[var(--muted-foreground)] px-3 font-bold text-foreground">{item.amount}</td><td className="border-l border-[var(--muted-foreground)] px-3"><Pill tone={item.statusTone}>{item.status}</Pill></td><td className="border-l border-[var(--muted-foreground)] px-3 text-[var(--muted-foreground)]">{item.date}</td><td className="border-l border-[var(--muted-foreground)] px-3"><button onClick={() => showToast(`Opened ${item.id}`)} className="font-semibold text-[var(--foreground)] hover:text-foreground">Open</button><button aria-label={`More actions for ${item.id}`} className="ml-3 text-[var(--muted-foreground)]"><MoreHorizontal className="h-4 w-4" /></button></td></tr>)}</tbody></table><div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--muted-foreground)] px-4 py-3 text-xs text-[var(--muted-foreground)]"><span>Showing 1–6 of 312 returns</span><div className="flex items-center gap-1"><button className="rounded bg-[var(--primary)]/20 px-2.5 py-1.5 font-bold text-[var(--foreground)]">1</button><button className="px-2.5 py-1.5 hover:text-foreground">2</button><button className="px-2.5 py-1.5 hover:text-foreground">3</button><span>…</span><button className="px-2.5 py-1.5 hover:text-foreground">52</button></div><button className="rounded border border-[var(--muted-foreground)] px-2.5 py-1.5">25 rows <ChevronDown className="inline h-3 w-3" /></button></div></div></section>
        <section className="grid gap-4 xl:grid-cols-3"><article className="rounded-xl border border-[var(--muted-foreground)] border-l-4 border-l-border bg-[var(--card)] p-4"><SectionTitle title="Pending Refunds" action="View All Pending Refunds →" /><div className="space-y-3">{returns.filter(item => item.refund === 'Pending').map(item => <div key={item.id} className="flex items-center gap-3 border-b border-[var(--muted-foreground)] pb-3 text-xs"><div className="min-w-0 flex-1"><strong className="text-[var(--foreground)]">{item.id}</strong><p className="mt-1 truncate text-[var(--muted-foreground)]">{item.customer} · {item.store}</p></div><strong className="text-foreground">{item.amount}</strong><button onClick={() => showToast(`Opened ${item.id}`)} className="text-[var(--foreground)]">Open</button><button className="text-[var(--muted-foreground)]">Ask AI</button></div>)}</div></article><article className="rounded-xl border border-[var(--muted-foreground)] border-l-4 border-l-chart-5 bg-[var(--card)] p-4"><SectionTitle title="Failed Refunds" action="View All Failed →" /><div className="space-y-3">{[{
                id: 'REF-9021',
                order: '#ORD-10468',
                customer: 'James Wilson',
                amount: '—',
                failure: 'Platform Error'
              }, {
                id: 'REF-9018',
                order: '#ORD-10452',
                customer: 'Nina Patel',
                amount: '—',
                failure: 'Payment Provider Issue'
              }, {
                id: 'REF-9011',
                order: '#ORD-10431',
                customer: 'Owen Reed',
                amount: '—',
                failure: 'Invalid Refund State'
              }].map(item => <div key={item.id} className="flex items-center gap-3 border-b border-[var(--muted-foreground)] pb-3 text-xs"><div className="min-w-0 flex-1"><strong className="text-chart-5">{item.id}</strong><p className="mt-1 text-[var(--muted-foreground)]">{item.customer} · {item.failure}</p></div><strong className="text-foreground">{item.amount}</strong><button onClick={() => showToast(`Retry started for ${item.id}`)} className="text-[var(--foreground)]">Retry</button><button className="text-[var(--muted-foreground)]">Ask AI</button></div>)}</div></article><article className="rounded-xl border border-[var(--muted-foreground)] border-l-4 border-l-[var(--border)] bg-[var(--card)] p-4"><SectionTitle title="Return Reasons" subtitle="Operational — not analytics" /><div className="space-y-3">{reasons.map(reason => <div key={reason.name} className="grid grid-cols-[104px_1fr_28px] items-center gap-2 text-xs"><span className="text-[var(--foreground)]">{reason.name}</span><div className="h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-[var(--primary)] shadow-[0_0_10px_rgba(0,0,0,.35)] text-primary-foreground" style={{
                    width: reason.width
                  }} /></div><span className="text-right text-[var(--muted-foreground)]">{reason.percent}</span></div>)}</div></article></section>
        <section className="grid gap-4 xl:grid-cols-3"><article className="rounded-xl border border-[var(--muted-foreground)] bg-secondary p-5 backdrop-blur-sm"><SectionTitle title="Returns Operations Health" /><div className="mb-5 flex items-center gap-6"><div className="grid h-24 w-24 place-items-center rounded-full border-[7px] border-chart-4/20 border-t-chart-4 border-r-chart-4 text-2xl font-extrabold text-foreground shadow-[0_0_20px_rgba(0,0,0,.12)]">—</div><p className="max-w-[150px] text-xs leading-5 text-[var(--muted-foreground)]">Strong operational health across connected stores.</p></div>{[['Return Synchronization', 'Healthy', 'green', '100%'], ['Refund Synchronization', 'Attention Required', 'amber', '66%'], ['Return Data Completeness', 'Healthy', 'green', '92%'], ['Platform Connectivity', 'Healthy', 'green', '97%'], ['Processing Issues', 'Attention Required', 'amber', '42%']].map(row => <div key={row[0]} className="mb-3 grid grid-cols-[1fr_auto] gap-2 text-xs"><span className="text-[var(--foreground)]">{row[0]}</span><span className={row[2] === 'green' ? 'text-chart-4' : 'text-chart-1'}>{row[1]}</span><div className="col-span-2 h-1 rounded bg-secondary"><div className={`h-full rounded bg-${row[2]}-400`} style={{
                  width: row[3]
                }} /></div></div>)}</article><article className="rounded-xl border border-[var(--muted-foreground)] bg-secondary p-5 backdrop-blur-sm"><SectionTitle title="Returns & Refunds Synchronization" /><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]"><tr>{['Store', 'Platform', 'Last Sync', 'Records', 'Failed', 'Status'].map(head => <th key={head} className="pb-3 pr-3">{head}</th>)}</tr></thead><tbody>{[['Connected store', 'Shopify', '2 min ago', '284', '0', 'Synced', 'green'], ['WooCommerce', 'WooCommerce', '8 min ago', '112', '2', 'Attention', 'amber'], ['Webflow Store', 'Webflow', '45 min ago', '31', '1', 'Delayed', 'amber']].map(store => <tr key={store[0]} className="border-t border-[var(--muted-foreground)]"><td className="py-3 pr-2 font-semibold text-foreground">{store[0]}</td><td className="pr-2 text-[var(--muted-foreground)]">{store[1]}</td><td className="pr-2 text-[var(--muted-foreground)]">{store[2]}</td><td className="pr-2 text-[var(--foreground)]">{store[3]}</td><td className="pr-2 text-[var(--foreground)]">{store[4]}</td><td className={store[6] === 'green' ? 'text-chart-4' : 'text-foreground'}><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />{store[5]}</td></tr>)}</tbody></table></div><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => showToast('Sync retry queued')} className="rounded border border-[var(--muted-foreground)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-secondary">Retry Sync</button><button className="rounded border border-[var(--muted-foreground)] px-3 py-2 text-xs font-semibold text-[var(--foreground)]">View Details</button><button className="rounded border border-[var(--muted-foreground)] px-3 py-2 text-xs font-semibold text-[var(--foreground)]">Open Integrations</button></div></article><article id="ai-card" className="rounded-xl border border-[var(--border)]/30 border-t-2 border-t-[var(--border)] bg-[var(--card)] p-5 shadow-[0_0_24px_rgba(0,0,0,.1)]"><SectionTitle title="Ask Lulu AI" subtitle="AI-generated interpretation" /><div className="flex rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] p-1"><input value={aiText} onChange={e => setAiText(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()} placeholder="Ask Lulu AI about returns and refunds..." className="min-w-0 flex-1 bg-transparent px-3 py-2 text-xs text-foreground outline-none placeholder:text-[var(--muted-foreground)]" /><button onClick={() => ask()} aria-label="Send question" className="rounded-md bg-[var(--primary)] p-2 text-primary-foreground shadow-[0_0_15px_rgba(0,0,0,.35)]"><Send className="h-3.5 w-3.5" /></button></div><div className="mt-3 flex flex-wrap gap-1.5">{['Which returns need attention?', 'Find failed refunds', 'Pending refunds', 'Sync problems', 'Today’s activity'].map(prompt => <button key={prompt} onClick={() => ask(prompt)} className="rounded-full border border-[var(--muted-foreground)] px-2.5 py-1.5 text-[11px] text-[var(--muted-foreground)] hover:border-[var(--border)]/50 hover:text-[var(--foreground)]">{prompt}</button>)}</div><div className="mt-4 rounded-lg border border-[var(--border)]/20 bg-[var(--primary)]/[0.07] p-3 text-xs leading-5 text-[var(--foreground)]"><div className="mb-1 flex items-center gap-2 font-bold text-[var(--foreground)]"><Sparkles className="h-3.5 w-3.5" />AI Insight</div>{aiAnswer || '8 return or refund records currently require review based on their status and sync data. 3 failed refunds and 5 long-pending returns identified.'}<button onClick={() => showToast('Attention queue opened')} className="mt-2 block font-semibold text-[var(--foreground)]">View Attention Required →</button></div></article></section>
        <section className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-4"><button onClick={() => setActivityOpen(!activityOpen)} className="flex w-full items-center justify-between text-left"><span className="flex items-center gap-2 text-sm font-extrabold text-foreground"><Activity className="h-4 w-4 text-[var(--foreground)]" />Return Activity</span>{activityOpen ? <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)]" /> : <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]" />}</button>{activityOpen && <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{[['Refund completed', 'RET-10479 · —', '2 hours ago', 'green'], ['Return received', 'RET-10476 · Connected store', '3 hours ago', 'purple'], ['Return requested', 'RET-10491 · WooCommerce', '5 hours ago', 'blue'], ['Refund failed', 'RET-10468 · Platform error', '6 hours ago', 'red']].map(event => <div key={event[0]} className="flex gap-3 rounded-lg bg-secondary p-3 text-xs"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full bg-${event[3]}-400 shadow-[0_0_9px_currentColor]`} /><div><strong className="text-foreground">{event[0]}</strong><p className="mt-1 text-[var(--muted-foreground)]">{event[1]}</p><time className="mt-2 block text-[var(--muted-foreground)]">{event[2]}</time></div></div>)}</div>}</section>
      </div></section>
    {modalOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-primary/70 p-5 backdrop-blur-sm"><section role="dialog" aria-modal="true" aria-labelledby="refund-title" className="w-full max-w-md rounded-2xl border border-[var(--muted-foreground)] bg-[var(--card)] p-6 shadow-[0_0_35px_rgba(0,0,0,.2)]"><div className="flex items-start justify-between"><div><h2 id="refund-title" className="text-xl font-extrabold tracking-tight text-foreground">Confirm Refund</h2><p className="mt-1 text-xs text-[var(--muted-foreground)]">Review the refund details before continuing.</p></div><button onClick={() => setModalOpen(false)} aria-label="Close modal" className="text-[var(--muted-foreground)] hover:text-foreground"><X className="h-5 w-5" /></button></div><dl className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-[var(--muted-foreground)] bg-[var(--background)] p-4 text-xs"><div><dt className="text-[var(--muted-foreground)]">Order</dt><dd className="mt-1 font-bold text-foreground">#ORD-10482</dd></div><div><dt className="text-[var(--muted-foreground)]">Customer</dt><dd className="mt-1 font-bold text-foreground">John Smith</dd></div><div><dt className="text-[var(--muted-foreground)]">Amount</dt><dd className="mt-1 font-bold text-foreground">—</dd></div><div><dt className="text-[var(--muted-foreground)]">Method</dt><dd className="mt-1 text-[var(--foreground)]">Original Payment</dd></div><div><dt className="text-[var(--muted-foreground)]">Store</dt><dd className="mt-1 text-[var(--foreground)]">Connected store</dd></div><div><dt className="text-[var(--muted-foreground)]">Products</dt><dd className="mt-1 text-[var(--foreground)]">2 items</dd></div></dl><div className="mt-4 flex gap-3 rounded-lg border border-border/20 bg-secondary/10 p-3 text-xs leading-5 text-foreground"><AlertCircle className="h-4 w-4 shrink-0" />This action will initiate a refund of — This cannot be undone.</div><div className="mt-6 flex justify-end gap-2"><button onClick={() => setModalOpen(false)} className="rounded-lg border border-[var(--muted-foreground)] px-4 py-2.5 text-xs font-bold text-[var(--muted-foreground)]">Cancel</button><button onClick={() => {
            setModalOpen(false);
            showToast('Refund confirmed for —');
          }} className="rounded-lg bg-destructive px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-[0_0_18px_rgba(0,0,0,.35)]">Confirm Refund</button></div></section></div>}
    {toast && <div role="status" className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-lg border border-[var(--border)]/40 bg-[var(--secondary)] px-4 py-3 text-xs font-semibold text-foreground shadow-2xl"><Check className="h-4 w-4 text-foreground" />{toast}</div>}
  </main>;
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
