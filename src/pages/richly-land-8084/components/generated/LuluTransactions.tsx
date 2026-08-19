import { useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { ArrowDown, ArrowUp, BarChart3, Bell, Bot, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Download, Ellipsis, FileText, Filter, LayoutDashboard, Link2, Menu, MoreHorizontal, Plus, RefreshCw, Search, Settings, ShieldAlert, SlidersHorizontal, Sparkles, Tag, Upload, UserRound, WalletCards, X, Zap } from 'lucide-react';
type Transaction = {
  id: string;
  date: string;
  description: string;
  account: string;
  direction: 'in' | 'out';
  category: string;
  amount: string;
  status: 'Completed' | 'Pending';
  source: string;
  classification: 'Categorized' | 'Uncategorized' | 'AI Suggested: Office' | 'Needs Review';
  record: string;
};
type NavItem = {
  label: string;
  icon: typeof LayoutDashboard;
  active?: boolean;
};
const navItems: NavItem[] = [{
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  label: 'AI Assistant',
  icon: Bot
}, {
  label: 'AI Agents',
  icon: Zap
}, {
  label: 'CRM',
  icon: UserRound
}, {
  label: 'Marketing',
  icon: BarChart3
}];
const financeItems = ['Overview', 'Transactions', 'Invoices', 'Offers & Quotes', 'Payments', 'Income', 'Expenses', 'Accounts', 'Cash Flow', 'Reconciliation', 'Payouts'];
const transactions: Transaction[] = [];
const chips = ['Direction', 'Status', 'Category', 'Account', 'Source', 'Date', 'Amount', 'Currency', 'Classification', 'Related Record'];
const categories: { name: string; count: string; in: string; out: string; net: string; pct: string }[] = [];
const accounts: { name: string; count: string; in: string; out: string; net: string; pending: string; uncategorized: string }[] = [];
const reviewItems: { id: string; desc: string; amount: string; category: string; confidence: string }[] = [];
function Badge({
  children,
  tone = 'neutral'
}: {
  children: React.ReactNode;
  tone?: 'green' | 'red' | 'amber' | 'blue' | 'purple' | 'neutral';
}) {
  const tones = {
    green: 'bg-secondary text-foreground',
    red: 'bg-chart-5/10 text-chart-5',
    amber: 'bg-secondary text-foreground',
    blue: 'bg-secondary text-foreground',
    purple: 'bg-secondary text-foreground',
    neutral: 'bg-sidebar text-muted-foreground'
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold whitespace-nowrap ${tones[tone]}`}>{children}</span>;
}
function Sidebar() {
  return <aside className="fixed inset-y-0 left-0 z-20 hidden w-[226px] flex-col bg-[var(--sidebar)] text-foreground lg:flex">
  <div className="flex h-[76px] items-center gap-3 border-b border-border px-6"><div className="grid h-8 w-8 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-lg shadow-black/30"><Sparkles size={17} fill="currentColor" /></div><span className="text-[18px] font-bold tracking-[-.03em] text-foreground">Lulu <span className="font-normal text-foreground">AI</span></span></div>
  <LuluSectionNavigation activeId="richly-land-8084" /><div className="border-t border-border p-4"><div className="mb-3 flex items-center gap-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">AM</div><div><p className="text-xs font-semibold text-foreground">—</p><p className="text-[11px] text-muted-foreground">Admin</p></div><MoreHorizontal size={15} className="ml-auto text-muted-foreground" /></div><div className="flex gap-4 px-1 text-[11px] text-muted-foreground"><span className="flex items-center gap-1"><Settings size={12} />Settings</span><span className="flex items-center gap-1"><CircleHelp size={12} />Help</span></div></div>
</aside>;
}
export function LuluTransactions() {
  const { items: liveRecords, loading: liveLoading, error: liveError } = useLiveRecords('finance_transactions');
  const liveTransactions: Transaction[] = liveRecords.map((record) => {
    const fields = record as unknown as Record<string, unknown>;
    const direction = String(fields.direction ?? 'in').toLowerCase() === 'out' ? 'out' : 'in';
    return { id: record.id, date: record.updatedAt, description: record.name, account: String(fields.account ?? '—'), direction, category: String(fields.category ?? '—'), amount: record.valueAmount ?? '—', status: record.status === 'Pending' ? 'Pending' : 'Completed', source: String(fields.source ?? 'Live record'), classification: String(fields.classification ?? 'Categorized') as Transaction['classification'], record: String(fields.relatedRecord ?? '—') };
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [range, setRange] = useState('Last 30 Days');
  const toggle = (id: string) => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
 <Sidebar />{liveError && <div className="fixed left-0 right-0 top-0 z-30 lg:left-[226px] border-b border-chart-5/30 bg-chart-5/5 px-4 py-3 text-sm text-chart-5">{liveError}</div>} {!liveLoading && liveTransactions.length === 0 && <div className="fixed left-0 right-0 top-[76px] z-20 lg:left-[226px] mx-8 rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">No transaction records are available yet. Connect a finance platform or import the first transaction.</div>}<main className="min-w-0 lg:ml-[226px]"><header className="flex h-[76px] items-center justify-between border-b border-border bg-card px-4 sm:px-6 lg:px-8"><div className="flex items-center gap-3 text-[12px] text-muted-foreground"><span>Finance</span><ChevronRight size={13} /><strong className="text-foreground">Transactions</strong></div><div className="flex items-center gap-5"><button className="relative text-foreground"><Bell size={18} /><span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /></button><div className="h-7 w-px bg-secondary" /><div className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">AM</div></div></header>
 <div className="px-4 py-6 sm:px-6 sm:py-7 lg:px-8"><section className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-start"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[.12em] text-foreground">Finance / Transactions</p><h1 className="text-[30px] font-bold tracking-[-.04em] text-foreground">Transactions</h1><p className="mt-1.5 text-sm text-muted-foreground">Review and organize detailed financial activity across your connected accounts.</p></div><div className="flex w-full flex-wrap items-center gap-2 sm:w-auto"><button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm shadow-black/10 hover:bg-primary"><Upload size={14} />Import Transactions</button><button className="rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:border-border">Ask Lulu AI</button><button className="flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-foreground"><Download size={14} />Export</button><button className="rounded-lg border border-border bg-card p-2.5 text-foreground"><MoreHorizontal size={16} /></button></div></section>
 <div className="mt-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center"><div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground"><span className="h-2 w-2 animate-pulse rounded-full bg-primary text-primary-foreground" />Live synchronization status unavailable · <button className="font-semibold text-foreground">Refresh ↻</button></div><div className="flex items-center gap-2 text-xs text-muted-foreground"><span>Comparison:</span><button className="font-semibold text-foreground">Previous Period <ChevronDown size={13} className="inline" /></button></div></div>
 <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 shadow-sm"><div className="flex items-center gap-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-foreground"><WalletCards size={16} /></div><div><p className="text-xs font-bold text-foreground">All Accounts <ChevronDown size={13} className="ml-1 inline" /></p><p className="mt-0.5 text-[11px] text-muted-foreground">No connected accounts yet</p></div></div><div className="flex items-center gap-2"><CalendarDays size={15} className="text-muted-foreground" /><select value={range} onChange={event => setRange(event.target.value)} className="rounded-md border-0 bg-secondary px-3 py-2 text-xs font-semibold text-foreground outline-none"><option>Last 30 Days</option><option>Last 90 Days</option><option>This Year</option></select></div></div>
 <div className="mt-4 grid grid-cols-7 gap-3"><div className="col-span-7 rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">Live transaction KPIs will appear here when transaction records are available.</div></div>
 <section className="mt-5 rounded-xl border border-border bg-card shadow-sm"><div className="flex items-center gap-3 border-b border-border p-3"><div className="relative flex-1"><Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" /><input className="h-9 w-full rounded-lg border border-border bg-secondary pl-9 pr-3 text-xs outline-none placeholder:text-muted-foreground focus:border-border" placeholder="Search transactions by ID, description, merchant, amount, account..." /></div><button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground"><SlidersHorizontal size={14} />Filters</button></div><div className="flex items-center gap-2 overflow-x-auto px-3 py-3"><Filter size={14} className="shrink-0 text-muted-foreground" />{chips.map(chip => <button key={chip} className="flex shrink-0 items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:border-border">{chip}<ChevronDown size={11} /></button>)}<button className="ml-auto shrink-0 text-[11px] font-semibold text-foreground">Clear Filters</button><button className="shrink-0 rounded-md bg-secondary px-2.5 py-1.5 text-[11px] font-bold text-foreground">Save Filter</button></div>
 {selected.length > 0 && <div className="flex items-center gap-3 border-y border-border bg-secondary px-4 py-2 text-xs text-foreground"><strong>{selected.length} selected</strong><button className="rounded bg-card px-2 py-1 font-semibold">Categorize</button><button className="rounded bg-card px-2 py-1 font-semibold">Assign Account</button><button className="rounded bg-card px-2 py-1 font-semibold">Link Record</button><button className="rounded bg-card px-2 py-1 font-semibold">Export</button><button className="rounded bg-card px-2 py-1 font-semibold">Mark Reviewed</button><button className="ml-auto" onClick={() => setSelected([])}><X size={15} /></button></div>}
 <div className="overflow-x-auto"><table className="w-full min-w-[1120px] border-collapse text-left"><thead className="bg-secondary"><tr className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground"><th className="w-10 px-4 py-3"><input type="checkbox" aria-label="Select all transactions" onChange={event => setSelected(event.target.checked ? liveTransactions.map(item => item.id) : [])} /></th>{['Transaction', 'Date', 'Description', 'Account', 'Direction', 'Category', 'Amount', 'Status', 'Source', 'Classification', 'Related Record', ''].map(label => <th key={label} className="whitespace-nowrap px-2 py-3">{label}<ChevronDown size={11} className="ml-1 inline text-foreground" /></th>)}</tr></thead><tbody>{(liveLoading ? [] : liveTransactions).map(item => <tr key={item.id} className="border-t border-border text-xs odd:bg-card even:bg-secondary/50 hover:bg-secondary/40"><td className="px-4 py-3"><input type="checkbox" aria-label={`Select ${item.id}`} checked={selected.includes(item.id)} onChange={() => toggle(item.id)} /></td><td className="whitespace-nowrap px-2 py-3 font-mono text-[11px] font-semibold text-foreground">{item.id}</td><td className="whitespace-nowrap px-2 py-3 text-muted-foreground">{item.date}</td><td className="whitespace-nowrap px-2 py-3 font-semibold text-foreground">{item.description}</td><td className="whitespace-nowrap px-2 py-3 text-muted-foreground">{item.account}</td><td className="px-2 py-3"><Badge tone={item.direction === 'in' ? 'green' : 'red'}>{item.direction === 'in' ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {item.direction === 'in' ? 'Money In' : 'Money Out'}</Badge></td><td className={`whitespace-nowrap px-2 py-3 text-right font-mono font-bold ${item.direction === 'in' ? 'text-foreground' : 'text-chart-5'}`}>{item.amount}</td><td className="px-2 py-3"><Badge tone={item.status === 'Pending' ? 'blue' : 'green'}>{item.status === 'Pending' ? '⏳' : '●'} {item.status}</Badge></td><td className="whitespace-nowrap px-2 py-3 text-muted-foreground">{item.source}</td><td className="px-2 py-3"><Badge tone={item.classification === 'Categorized' ? 'green' : item.classification === 'Uncategorized' ? 'amber' : item.classification === 'Needs Review' ? 'red' : 'purple'}>{item.classification === 'Categorized' ? <Check size={11} /> : item.classification === 'AI Suggested: Office' ? <Bot size={11} /> : item.classification === 'Uncategorized' ? '⚠' : '⚠'} {item.classification}</Badge></td><td className="whitespace-nowrap px-2 py-3 font-mono text-[11px] text-foreground">{item.record}</td><td className="px-2 py-3 text-muted-foreground"><button aria-label={`Actions for ${item.id}`}><Ellipsis size={16} /></button></td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-border px-4 py-3 text-[11px] text-muted-foreground"><span>No live transaction pagination available yet</span><div className="flex items-center gap-1"><button className="flex items-center gap-1 rounded border border-border px-2 py-1"><ChevronLeft size={12} />Prev</button><button className="rounded bg-primary px-2.5 py-1 font-bold text-primary-foreground">1</button>{['2', '3', '…', '160'].map(page => <button key={page} className="rounded px-2 py-1 hover:bg-secondary">{page}</button>)}<button className="flex items-center gap-1 rounded border border-border px-2 py-1">Next<ChevronRight size={12} /></button></div></div></section>
 <section className="mt-5 rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-sm font-bold">Transaction Activity</h2><p className="mt-1 text-[11px] text-muted-foreground">Money movement across all connected accounts</p></div><div className="flex items-center gap-4"><div className="flex rounded-md bg-secondary p-0.5 text-[11px] font-semibold"><button className="px-3 py-1 text-foreground">Daily</button><button className="rounded bg-card px-3 py-1 text-foreground shadow-sm">Weekly</button><button className="px-3 py-1 text-foreground">Monthly</button></div><label className="flex items-center gap-2 text-[11px] text-muted-foreground"><input type="checkbox" defaultChecked />Compare period</label></div></div><div className="mt-4 flex h-36 items-end gap-2 border-b border-l border-border px-4 pb-0 pt-3">{([] as number[]).map((height, i) => <div key={`bar-${height}-${i}`} className="group flex h-full flex-1 items-end gap-px"><span className="w-1/2 rounded-t bg-secondary" style={{
                height: `${height * .75}%`
              }} /><span className="w-1/2 rounded-t bg-chart-5/20" style={{
                height: `${height * .48}%`
              }} /></div>)}</div><div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground"><span>Oct 1</span><span>Oct 8</span><span>Oct 15</span><span>Oct 22</span><span>Oct 30</span></div><div className="mt-3 flex gap-5 text-[11px] text-muted-foreground"><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Money In</span><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-destructive" />Money Out</span><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Net Movement</span></div></section>
 <div className="mt-5 grid grid-cols-2 gap-5"><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><h2 className="text-sm font-bold">Transaction Categories</h2><table className="mt-4 w-full text-left text-[11px]"><thead className="border-b border-border text-[10px] uppercase text-muted-foreground"><tr><th className="pb-2">Category</th><th>Count</th><th>Money In</th><th>Money Out</th><th>Net</th><th>%</th></tr></thead><tbody>{(liveLoading ? [] : categories).map(row => <tr key={row.name} className="border-b border-border"><td className="py-2 font-semibold">{row.name}</td><td>{row.count}</td><td className="text-foreground">{row.in}</td><td className="text-chart-5">{row.out}</td><td className="font-semibold">{row.net}</td><td className="text-muted-foreground">{row.pct}</td></tr>)}</tbody></table></article><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">Account Activity</h2><button className="text-[11px] font-semibold text-foreground">Open Account</button></div><table className="mt-4 w-full text-left text-[11px]"><thead className="border-b border-border text-[10px] uppercase text-muted-foreground"><tr><th className="pb-2">Account</th><th>Count</th><th>Money In</th><th>Money Out</th><th>Net</th><th>Pending</th><th>Uncat.</th></tr></thead><tbody>{(liveLoading ? [] : accounts).map(row => <tr key={row.name} className="border-b border-border"><td className="py-2 font-semibold">{row.name}</td><td>{row.count}</td><td className="text-foreground">{row.in}</td><td className="text-chart-5">{row.out}</td><td className="font-semibold">{row.net}</td><td className="text-foreground">{row.pending}</td><td className="text-chart-1">{row.uncategorized}</td></tr>)}</tbody></table></article></div>
 <div className="mt-5 grid grid-cols-3 gap-5"><article className="rounded-xl border border-chart-1/30 bg-card p-5 shadow-sm"><h2 className="text-sm font-bold">⚠ Needs Review <span className="text-chart-1">—</span></h2>{(liveLoading ? [] : reviewItems).map(row => <div key={row.id} className="mt-4 border-b border-border pb-3 last:border-0"><div className="flex justify-between"><div><p className="font-mono text-[10px] text-foreground">{row.id}</p><p className="mt-0.5 text-xs font-semibold">{row.desc}</p></div><strong className="font-mono text-xs text-foreground">{row.amount}</strong></div><p className="mt-2 text-[10px] text-muted-foreground"><Bot size={11} className="mr-1 inline text-foreground" />Suggested: <b>{row.category}</b> · {row.confidence}</p><div className="mt-1 h-1 rounded bg-secondary"><div className="h-1 rounded bg-primary text-primary-foreground" style={{
                  width: row.confidence
                }} /></div><div className="mt-2 flex gap-1.5"><button className="rounded bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground">Accept</button><button className="rounded border border-border px-2 py-1 text-[10px]">Categorize</button><button className="rounded border border-border px-2 py-1 text-[10px]">Ignore</button></div></div>)}</article><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><h2 className="text-sm font-bold">🔍 Possible Duplicates <span className="text-foreground">—</span></h2><div className="mt-4 rounded-lg bg-card p-3"><div className="flex justify-between text-[11px]"><span className="font-mono font-semibold">—</span><span className="font-mono">—</span></div><p className="mt-1 text-xs font-semibold">—</p><div className="my-3 border-t border-dashed border-border" /><div className="flex justify-between text-[11px]"><span className="font-mono font-semibold">—</span><span className="font-mono">—</span></div><p className="mt-1 text-xs font-semibold">—</p><p className="mt-3 text-[10px] text-muted-foreground">No live duplicate data available yet.</p></div><div className="mt-3 flex gap-2"><button className="rounded border border-border px-2.5 py-1.5 text-[10px] font-semibold">Compare</button><button className="rounded border border-border px-2.5 py-1.5 text-[10px] font-semibold">Keep Both</button><button className="rounded bg-primary px-2.5 py-1.5 text-[10px] font-semibold text-primary-foreground">Resolve</button></div></article><article className="rounded-xl border border-chart-5/30 bg-card p-5 shadow-sm"><h2 className="text-sm font-bold">🚨 Transaction Anomalies <span className="text-chart-5">—</span></h2>{([] as { id: string; name: string; value: string; severity: string }[]).map(row => <div key={row.id} className="mt-4 flex items-start justify-between border-b border-border pb-3"><div><p className="font-mono text-[10px] text-muted-foreground">{row.id}</p><p className="text-xs font-semibold">{row.name} · <span className="font-mono">{row.value}</span></p></div><div className="text-right"><Badge tone={row.severity === 'High' ? 'red' : row.severity === 'Medium' ? 'amber' : 'blue'}>{row.severity}</Badge><button className="mt-1 block text-[10px] font-semibold text-foreground">Investigate</button></div></div>)}</article></div>
 <div className="mt-5 grid grid-cols-[1.35fr_1fr] gap-5"><article className="rounded-xl border border-border bg-secondary/40 p-5"><h2 className="text-sm font-bold">AI Insights <Badge tone="purple"><Bot size={11} />AI-generated</Badge></h2><p className="mt-3 max-w-xl text-sm leading-6 text-foreground">No live transaction insight is available for the selected period yet.</p><p className="mt-3 text-[10px] text-foreground">AI-generated · Based on transaction data</p><div className="mt-4 flex h-12 items-end gap-1">{([] as number[]).map((h, i) => <div key={`insight-${i}-${h}`} className="flex flex-1 items-end gap-0.5"><span className="w-1/2 rounded-t bg-primary text-primary-foreground" style={{
                  height: `${h}%`
                }} /><span className="w-1/2 rounded-t bg-muted" style={{
                  height: `${h * .7}%`
                }} /></div>)}</div><div className="mt-2 text-[10px] text-muted-foreground">Current period <span className="ml-4">Previous period</span></div></article><article className="rounded-xl border border-border bg-card p-5"><h2 className="text-sm font-bold">AI Recommendations <Badge tone="purple"><Bot size={11} />AI</Badge></h2>{([] as string[]).map((text, i) => <div key={text} className="mt-3 flex items-center justify-between border-b border-border pb-2 text-xs"><span><Bot size={12} className="mr-2 inline text-foreground" />{text}<small className="ml-2 text-[10px] text-muted-foreground">AI Recommendation</small></span><button className="text-[11px] font-bold text-foreground">{i === 0 ? 'Review' : i === 1 ? 'Investigate' : i === 2 ? 'Review Duplicates' : 'View'}</button></div>)}</article></div>
 <section className="mt-5 mb-8 rounded-xl bg-[var(--card)] p-6 text-foreground shadow-lg"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Bot size={18} /></div><div><h2 className="text-sm font-bold">Ask Lulu AI about your transactions</h2><p className="mt-0.5 text-[11px] text-muted-foreground">Get instant answers and uncover what matters in your financial activity.</p></div></div><div className="mt-5 flex rounded-lg bg-card p-1"><input className="flex-1 bg-transparent px-3 text-xs text-muted-foreground outline-none placeholder:text-muted-foreground" placeholder="Ask Lulu AI about your transactions..." /><button className="rounded-md bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">Ask Lulu <ArrowUp size={13} className="ml-1 inline" /></button></div><div className="mt-3 flex flex-wrap gap-2">{['What changed this month?', 'Show largest transactions', 'Which categories increased?', 'Find unusual transactions', 'Show uncategorized', 'Compare money in and out'].map(prompt => <button key={prompt} className="rounded-full border border-border px-3 py-1.5 text-[11px] text-foreground hover:bg-secondary">{prompt}</button>)}</div></section>
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
