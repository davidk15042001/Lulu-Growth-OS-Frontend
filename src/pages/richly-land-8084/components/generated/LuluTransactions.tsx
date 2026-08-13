import { useState } from 'react';
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
const transactions: Transaction[] = [{
  id: 'TXN-2026-004821',
  date: '10 Aug',
  description: 'Stripe payout',
  account: 'Business Account',
  direction: 'in',
  category: 'Sales',
  amount: '+€4,850.00',
  status: 'Completed',
  source: 'Payment Provider',
  classification: 'Categorized',
  record: 'PAY-2026-00421'
}, {
  id: 'TXN-2026-004820',
  date: '10 Aug',
  description: 'AWS invoice',
  account: 'Business Account',
  direction: 'out',
  category: 'Software',
  amount: '−€2,340.00',
  status: 'Completed',
  source: 'Bank',
  classification: 'Categorized',
  record: 'EXP-2026-00218'
}, {
  id: 'TXN-2026-004819',
  date: '09 Aug',
  description: 'Client deposit',
  account: 'Business Account',
  direction: 'in',
  category: 'Services',
  amount: '+€12,000.00',
  status: 'Completed',
  source: 'Bank',
  classification: 'Categorized',
  record: 'INV-2026-00934'
}, {
  id: 'TXN-2026-004818',
  date: '09 Aug',
  description: 'Google Ads',
  account: 'Business Account',
  direction: 'out',
  category: 'Marketing',
  amount: '−€1,200.00',
  status: 'Completed',
  source: 'Bank',
  classification: 'Categorized',
  record: '—'
}, {
  id: 'TXN-2026-004817',
  date: '08 Aug',
  description: 'PayPal transfer',
  account: 'PayPal Business',
  direction: 'in',
  category: '—',
  amount: '+€780.00',
  status: 'Pending',
  source: 'Payment Provider',
  classification: 'Uncategorized',
  record: '—'
}, {
  id: 'TXN-2026-004816',
  date: '08 Aug',
  description: 'Office supplies',
  account: 'Business Account',
  direction: 'out',
  category: '—',
  amount: '−€345.00',
  status: 'Completed',
  source: 'Bank',
  classification: 'AI Suggested: Office',
  record: '—'
}, {
  id: 'TXN-2026-004815',
  date: '07 Aug',
  description: 'Shopify payout',
  account: 'Shopify Payments',
  direction: 'in',
  category: 'Ecommerce',
  amount: '+€3,210.00',
  status: 'Completed',
  source: 'Ecommerce',
  classification: 'Categorized',
  record: '—'
}, {
  id: 'TXN-2026-004814',
  date: '07 Aug',
  description: 'Unusual vendor',
  account: 'Business Account',
  direction: 'out',
  category: '—',
  amount: '−€8,900.00',
  status: 'Completed',
  source: 'Bank',
  classification: 'Needs Review',
  record: '—'
}];
const chips = ['Direction', 'Status', 'Category', 'Account', 'Source', 'Date', 'Amount', 'Currency', 'Classification', 'Related Record'];
const categories = [{
  name: 'Sales',
  count: '342',
  in: '€48K',
  out: '—',
  net: '+€48K',
  pct: '38%'
}, {
  name: 'Software',
  count: '86',
  in: '—',
  out: '−€12K',
  net: '−€12K',
  pct: '10%'
}, {
  name: 'Services',
  count: '124',
  in: '€32K',
  out: '—',
  net: '+€32K',
  pct: '25%'
}, {
  name: 'Marketing',
  count: '56',
  in: '—',
  out: '−€8K',
  net: '−€8K',
  pct: '7%'
}, {
  name: 'Office',
  count: '41',
  in: '—',
  out: '−€4K',
  net: '−€4K',
  pct: '3%'
}, {
  name: 'Other',
  count: '635',
  in: '€48K',
  out: '−€70K',
  net: '−€22K',
  pct: '17%'
}];
const accounts = [{
  name: 'Business Account',
  count: '862',
  in: '€84K',
  out: '−€72K',
  net: '+€12K',
  pending: '5',
  uncategorized: '21'
}, {
  name: 'Stripe',
  count: '184',
  in: '€26K',
  out: '−€4K',
  net: '+€22K',
  pending: '2',
  uncategorized: '4'
}, {
  name: 'PayPal Business',
  count: '142',
  in: '€11K',
  out: '−€8K',
  net: '+€3K',
  pending: '4',
  uncategorized: '8'
}, {
  name: 'Shopify Payments',
  count: '96',
  in: '€7K',
  out: '−€10K',
  net: '−€3K',
  pending: '1',
  uncategorized: '4'
}];
const reviewItems = [{
  id: 'TXN-004817',
  desc: 'PayPal transfer',
  amount: '+€780',
  category: 'Transfer',
  confidence: '91%'
}, {
  id: 'TXN-004816',
  desc: 'Office supplies',
  amount: '−€345',
  category: 'Office',
  confidence: '87%'
}, {
  id: 'TXN-004801',
  desc: 'Notion subscription',
  amount: '−€180',
  category: 'Software',
  confidence: '82%'
}];
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
  return <aside className="fixed inset-y-0 left-0 z-20 flex w-[226px] flex-col bg-[var(--sidebar)] text-foreground">
  <div className="flex h-[76px] items-center gap-3 border-b border-border px-6"><div className="grid h-8 w-8 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-lg shadow-black/30"><Sparkles size={17} fill="currentColor" /></div><span className="text-[18px] font-bold tracking-[-.03em] text-foreground">Lulu <span className="font-normal text-foreground">AI</span></span></div>
  <nav className="flex-1 overflow-y-auto px-3 py-5"><p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.14em] text-muted-foreground">Workspace</p>{navItems.map(({
        label,
        icon: Icon
      }) => <button key={label} className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium hover:bg-secondary hover:text-foreground"><Icon size={16} /><span>{label}</span></button>)}
    <div className="mt-4"><button className="flex w-full items-center justify-between rounded-lg bg-secondary px-3 py-2.5 text-[13px] font-semibold text-foreground"><span className="flex items-center gap-3"><WalletCards size={16} className="text-foreground" />Finance</span><ChevronDown size={14} /></button><div className="ml-4 border-l border-border pl-3 pt-1">{financeItems.map(item => <button key={item} className={`mb-0.5 flex w-full items-center rounded-md px-3 py-1.5 text-left text-[12px] ${item === 'Transactions' ? 'bg-secondary/20 font-semibold text-foreground' : 'text-foreground hover:text-foreground'}`}>{item}</button>)}</div></div>
    {['Projects', 'Inventory', 'HR', 'Settings'].map(item => <button key={item} className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium hover:bg-secondary hover:text-foreground"><span className="h-1.5 w-1.5 rounded-full bg-muted" />{item}</button>)}
  </nav><div className="border-t border-border p-4"><div className="mb-3 flex items-center gap-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">AM</div><div><p className="text-xs font-semibold text-foreground">Alex Morgan</p><p className="text-[11px] text-muted-foreground">Admin</p></div><MoreHorizontal size={15} className="ml-auto text-muted-foreground" /></div><div className="flex gap-4 px-1 text-[11px] text-muted-foreground"><span className="flex items-center gap-1"><Settings size={12} />Settings</span><span className="flex items-center gap-1"><CircleHelp size={12} />Help</span></div></div>
</aside>;
}
export function LuluTransactions() {
  const [selected, setSelected] = useState<string[]>([]);
  const [range, setRange] = useState('Last 30 Days');
  const toggle = (id: string) => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
 <Sidebar /><main className="ml-[226px] min-w-[1120px]"><header className="flex h-[76px] items-center justify-between border-b border-border bg-card px-8"><div className="flex items-center gap-3 text-[12px] text-muted-foreground"><span>Finance</span><ChevronRight size={13} /><strong className="text-foreground">Transactions</strong></div><div className="flex items-center gap-5"><button className="relative text-foreground"><Bell size={18} /><span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /></button><div className="h-7 w-px bg-secondary" /><div className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">AM</div></div></header>
 <div className="px-8 py-7"><section className="flex items-start justify-between"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[.12em] text-foreground">Finance / Transactions</p><h1 className="text-[30px] font-bold tracking-[-.04em] text-foreground">Transactions</h1><p className="mt-1.5 text-sm text-muted-foreground">Review and organize detailed financial activity across your connected accounts.</p></div><div className="flex items-center gap-2"><button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm shadow-black/10 hover:bg-primary"><Upload size={14} />Import Transactions</button><button className="rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:border-border">Ask Lulu AI</button><button className="flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-foreground"><Download size={14} />Export</button><button className="rounded-lg border border-border bg-card p-2.5 text-foreground"><MoreHorizontal size={16} /></button></div></section>
 <div className="mt-4 flex items-center justify-between"><div className="flex items-center gap-2 text-[11px] text-muted-foreground"><span className="h-2 w-2 animate-pulse rounded-full bg-primary text-primary-foreground" />Last synchronized 4 minutes ago · <button className="font-semibold text-foreground">Refresh ↻</button></div><div className="flex items-center gap-2 text-xs text-muted-foreground"><span>Comparison:</span><button className="font-semibold text-foreground">Previous Period <ChevronDown size={13} className="inline" /></button></div></div>
 <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 shadow-sm"><div className="flex items-center gap-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-foreground"><WalletCards size={16} /></div><div><p className="text-xs font-bold text-foreground">All Accounts <ChevronDown size={13} className="ml-1 inline" /></p><p className="mt-0.5 text-[11px] text-muted-foreground">Stripe, Business Checking, PayPal</p></div></div><div className="flex items-center gap-2"><CalendarDays size={15} className="text-muted-foreground" /><select value={range} onChange={event => setRange(event.target.value)} className="rounded-md border-0 bg-secondary px-3 py-2 text-xs font-semibold text-foreground outline-none"><option>Last 30 Days</option><option>Last 90 Days</option><option>This Year</option></select></div></div>
 <div className="mt-4 grid grid-cols-7 gap-3">{[{
            label: 'Transactions',
            value: '1,284',
            sub: 'Oct 1–30',
            tone: 'text-foreground'
          }, {
            label: 'Money In',
            value: '€128,450.00',
            sub: 'Oct 1–30',
            tone: 'text-foreground',
            icon: 'up'
          }, {
            label: 'Money Out',
            value: '€94,320.00',
            sub: 'Oct 1–30',
            tone: 'text-chart-5',
            icon: 'down'
          }, {
            label: 'Net Movement',
            value: '+€34,130.00',
            sub: 'Oct 1–30',
            tone: 'text-foreground'
          }, {
            label: 'Uncategorized',
            value: '37',
            sub: 'Needs attention',
            tone: 'text-chart-1',
            badge: 'warning'
          }, {
            label: 'Pending',
            value: '12',
            sub: 'Awaiting settlement',
            tone: 'text-foreground',
            badge: 'pending'
          }, {
            label: 'Anomalies',
            value: '5',
            sub: 'Flagged for review',
            tone: 'text-chart-5',
            badge: 'alert'
          }].map(card => <article key={card.label} className="min-h-[92px] rounded-xl border border-border bg-card p-3.5 shadow-sm"><div className="flex items-center justify-between"><p className="text-[11px] font-semibold text-muted-foreground">{card.label}</p>{card.badge && <span className={`h-2 w-2 rounded-full ${card.badge === 'warning' ? 'bg-chart-1' : card.badge === 'pending' ? 'bg-primary' : 'bg-destructive'}`} />}</div><p className={`mt-2 font-mono text-[17px] font-bold tracking-tight ${card.tone}`}>{card.icon === 'up' && <ArrowUp size={14} className="mr-1 inline" />}{card.icon === 'down' && <ArrowDown size={14} className="mr-1 inline" />}{card.value}</p><p className="mt-1 text-[10px] text-muted-foreground">{card.sub}</p></article>)}</div>
 <section className="mt-5 rounded-xl border border-border bg-card shadow-sm"><div className="flex items-center gap-3 border-b border-border p-3"><div className="relative flex-1"><Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" /><input className="h-9 w-full rounded-lg border border-border bg-secondary pl-9 pr-3 text-xs outline-none placeholder:text-muted-foreground focus:border-border" placeholder="Search transactions by ID, description, merchant, amount, account..." /></div><button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground"><SlidersHorizontal size={14} />Filters</button></div><div className="flex items-center gap-2 overflow-hidden px-3 py-3"><Filter size={14} className="shrink-0 text-muted-foreground" />{chips.map(chip => <button key={chip} className="flex shrink-0 items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:border-border">{chip}<ChevronDown size={11} /></button>)}<button className="ml-auto shrink-0 text-[11px] font-semibold text-foreground">Clear Filters</button><button className="shrink-0 rounded-md bg-secondary px-2.5 py-1.5 text-[11px] font-bold text-foreground">Save Filter</button></div>
 {selected.length > 0 && <div className="flex items-center gap-3 border-y border-border bg-secondary px-4 py-2 text-xs text-foreground"><strong>{selected.length} selected</strong><button className="rounded bg-card px-2 py-1 font-semibold">Categorize</button><button className="rounded bg-card px-2 py-1 font-semibold">Assign Account</button><button className="rounded bg-card px-2 py-1 font-semibold">Link Record</button><button className="rounded bg-card px-2 py-1 font-semibold">Export</button><button className="rounded bg-card px-2 py-1 font-semibold">Mark Reviewed</button><button className="ml-auto" onClick={() => setSelected([])}><X size={15} /></button></div>}
 <div className="overflow-hidden"><table className="w-full border-collapse text-left"><thead className="bg-secondary"><tr className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground"><th className="w-10 px-4 py-3"><input type="checkbox" aria-label="Select all transactions" onChange={event => setSelected(event.target.checked ? transactions.map(item => item.id) : [])} /></th>{['Transaction', 'Date', 'Description', 'Account', 'Direction', 'Category', 'Amount', 'Status', 'Source', 'Classification', 'Related Record', ''].map(label => <th key={label} className="whitespace-nowrap px-2 py-3">{label}<ChevronDown size={11} className="ml-1 inline text-foreground" /></th>)}</tr></thead><tbody>{transactions.map(item => <tr key={item.id} className="border-t border-border text-xs odd:bg-card even:bg-secondary/50 hover:bg-secondary/40"><td className="px-4 py-3"><input type="checkbox" aria-label={`Select ${item.id}`} checked={selected.includes(item.id)} onChange={() => toggle(item.id)} /></td><td className="whitespace-nowrap px-2 py-3 font-mono text-[11px] font-semibold text-foreground">{item.id}</td><td className="whitespace-nowrap px-2 py-3 text-muted-foreground">{item.date}</td><td className="whitespace-nowrap px-2 py-3 font-semibold text-foreground">{item.description}</td><td className="whitespace-nowrap px-2 py-3 text-muted-foreground">{item.account}</td><td className="px-2 py-3"><Badge tone={item.direction === 'in' ? 'green' : 'red'}>{item.direction === 'in' ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {item.direction === 'in' ? 'Money In' : 'Money Out'}</Badge></td><td className={`whitespace-nowrap px-2 py-3 text-right font-mono font-bold ${item.direction === 'in' ? 'text-foreground' : 'text-chart-5'}`}>{item.amount}</td><td className="px-2 py-3"><Badge tone={item.status === 'Pending' ? 'blue' : 'green'}>{item.status === 'Pending' ? '⏳' : '●'} {item.status}</Badge></td><td className="whitespace-nowrap px-2 py-3 text-muted-foreground">{item.source}</td><td className="px-2 py-3"><Badge tone={item.classification === 'Categorized' ? 'green' : item.classification === 'Uncategorized' ? 'amber' : item.classification === 'Needs Review' ? 'red' : 'purple'}>{item.classification === 'Categorized' ? <Check size={11} /> : item.classification === 'AI Suggested: Office' ? <Bot size={11} /> : item.classification === 'Uncategorized' ? '⚠' : '⚠'} {item.classification}</Badge></td><td className="whitespace-nowrap px-2 py-3 font-mono text-[11px] text-foreground">{item.record}</td><td className="px-2 py-3 text-muted-foreground"><button aria-label={`Actions for ${item.id}`}><Ellipsis size={16} /></button></td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-border px-4 py-3 text-[11px] text-muted-foreground"><span>Showing <strong className="text-foreground">1–8</strong> of 1,284</span><div className="flex items-center gap-1"><button className="flex items-center gap-1 rounded border border-border px-2 py-1"><ChevronLeft size={12} />Prev</button><button className="rounded bg-primary px-2.5 py-1 font-bold text-primary-foreground">1</button>{['2', '3', '…', '160'].map(page => <button key={page} className="rounded px-2 py-1 hover:bg-secondary">{page}</button>)}<button className="flex items-center gap-1 rounded border border-border px-2 py-1">Next<ChevronRight size={12} /></button></div></div></section>
 <section className="mt-5 rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="text-sm font-bold">Transaction Activity</h2><p className="mt-1 text-[11px] text-muted-foreground">Money movement across all connected accounts</p></div><div className="flex items-center gap-4"><div className="flex rounded-md bg-secondary p-0.5 text-[11px] font-semibold"><button className="px-3 py-1 text-foreground">Daily</button><button className="rounded bg-card px-3 py-1 text-foreground shadow-sm">Weekly</button><button className="px-3 py-1 text-foreground">Monthly</button></div><label className="flex items-center gap-2 text-[11px] text-muted-foreground"><input type="checkbox" defaultChecked />Compare period</label></div></div><div className="mt-4 flex h-36 items-end gap-2 border-b border-l border-border px-4 pb-0 pt-3">{[42, 60, 48, 70, 54, 82, 64, 78, 92, 67, 88, 75, 98, 80, 91, 72, 84, 68, 77, 95, 73, 86, 79, 100, 87, 96, 82, 92, 80, 105].map((height, i) => <div key={`bar-${height}-${i}`} className="group flex h-full flex-1 items-end gap-px"><span className="w-1/2 rounded-t bg-secondary" style={{
                height: `${height * .75}%`
              }} /><span className="w-1/2 rounded-t bg-chart-5/20" style={{
                height: `${height * .48}%`
              }} /></div>)}</div><div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground"><span>Oct 1</span><span>Oct 8</span><span>Oct 15</span><span>Oct 22</span><span>Oct 30</span></div><div className="mt-3 flex gap-5 text-[11px] text-muted-foreground"><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Money In</span><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-destructive" />Money Out</span><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Net Movement</span></div></section>
 <div className="mt-5 grid grid-cols-2 gap-5"><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><h2 className="text-sm font-bold">Transaction Categories</h2><table className="mt-4 w-full text-left text-[11px]"><thead className="border-b border-border text-[10px] uppercase text-muted-foreground"><tr><th className="pb-2">Category</th><th>Count</th><th>Money In</th><th>Money Out</th><th>Net</th><th>%</th></tr></thead><tbody>{categories.map(row => <tr key={row.name} className="border-b border-border"><td className="py-2 font-semibold">{row.name}</td><td>{row.count}</td><td className="text-foreground">{row.in}</td><td className="text-chart-5">{row.out}</td><td className="font-semibold">{row.net}</td><td className="text-muted-foreground">{row.pct}</td></tr>)}</tbody></table></article><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">Account Activity</h2><button className="text-[11px] font-semibold text-foreground">Open Account</button></div><table className="mt-4 w-full text-left text-[11px]"><thead className="border-b border-border text-[10px] uppercase text-muted-foreground"><tr><th className="pb-2">Account</th><th>Count</th><th>Money In</th><th>Money Out</th><th>Net</th><th>Pending</th><th>Uncat.</th></tr></thead><tbody>{accounts.map(row => <tr key={row.name} className="border-b border-border"><td className="py-2 font-semibold">{row.name}</td><td>{row.count}</td><td className="text-foreground">{row.in}</td><td className="text-chart-5">{row.out}</td><td className="font-semibold">{row.net}</td><td className="text-foreground">{row.pending}</td><td className="text-chart-1">{row.uncategorized}</td></tr>)}</tbody></table></article></div>
 <div className="mt-5 grid grid-cols-3 gap-5"><article className="rounded-xl border border-chart-1/30 bg-card p-5 shadow-sm"><h2 className="text-sm font-bold">⚠ Needs Review <span className="text-chart-1">(37)</span></h2>{reviewItems.map(row => <div key={row.id} className="mt-4 border-b border-border pb-3 last:border-0"><div className="flex justify-between"><div><p className="font-mono text-[10px] text-foreground">{row.id}</p><p className="mt-0.5 text-xs font-semibold">{row.desc}</p></div><strong className="font-mono text-xs text-foreground">{row.amount}</strong></div><p className="mt-2 text-[10px] text-muted-foreground"><Bot size={11} className="mr-1 inline text-foreground" />Suggested: <b>{row.category}</b> · {row.confidence}</p><div className="mt-1 h-1 rounded bg-secondary"><div className="h-1 rounded bg-primary text-primary-foreground" style={{
                  width: row.confidence
                }} /></div><div className="mt-2 flex gap-1.5"><button className="rounded bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground">Accept</button><button className="rounded border border-border px-2 py-1 text-[10px]">Categorize</button><button className="rounded border border-border px-2 py-1 text-[10px]">Ignore</button></div></div>)}</article><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><h2 className="text-sm font-bold">🔍 Possible Duplicates <span className="text-foreground">(3)</span></h2><div className="mt-4 rounded-lg bg-card p-3"><div className="flex justify-between text-[11px]"><span className="font-mono font-semibold">TXN-004801</span><span className="font-mono">−€180.00</span></div><p className="mt-1 text-xs font-semibold">Notion subscription</p><div className="my-3 border-t border-dashed border-border" /><div className="flex justify-between text-[11px]"><span className="font-mono font-semibold">TXN-004802</span><span className="font-mono">−€180.00</span></div><p className="mt-1 text-xs font-semibold">Notion Labs Inc.</p><p className="mt-3 text-[10px] text-muted-foreground">92% similar · same date, amount, and merchant</p></div><div className="mt-3 flex gap-2"><button className="rounded border border-border px-2.5 py-1.5 text-[10px] font-semibold">Compare</button><button className="rounded border border-border px-2.5 py-1.5 text-[10px] font-semibold">Keep Both</button><button className="rounded bg-primary px-2.5 py-1.5 text-[10px] font-semibold text-primary-foreground">Resolve</button></div></article><article className="rounded-xl border border-chart-5/30 bg-card p-5 shadow-sm"><h2 className="text-sm font-bold">🚨 Transaction Anomalies <span className="text-chart-5">(5)</span></h2>{[{
              id: 'TXN-004814',
              name: 'Unusual vendor',
              value: '€8,900',
              severity: 'High'
            }, {
              id: 'TXN-004790',
              name: 'Amount above normal',
              value: '€4,200',
              severity: 'Medium'
            }, {
              id: 'TXN-004771',
              name: 'New country detected',
              value: '€960',
              severity: 'Low'
            }].map(row => <div key={row.id} className="mt-4 flex items-start justify-between border-b border-border pb-3"><div><p className="font-mono text-[10px] text-muted-foreground">{row.id}</p><p className="text-xs font-semibold">{row.name} · <span className="font-mono">{row.value}</span></p></div><div className="text-right"><Badge tone={row.severity === 'High' ? 'red' : row.severity === 'Medium' ? 'amber' : 'blue'}>{row.severity}</Badge><button className="mt-1 block text-[10px] font-semibold text-foreground">Investigate</button></div></div>)}</article></div>
 <div className="mt-5 grid grid-cols-[1.35fr_1fr] gap-5"><article className="rounded-xl border border-border bg-secondary/40 p-5"><h2 className="text-sm font-bold">AI Insights <Badge tone="purple"><Bot size={11} />AI-generated</Badge></h2><p className="mt-3 max-w-xl text-sm leading-6 text-foreground">Money out increased <strong>14%</strong> compared with the previous period, primarily driven by higher activity in Software and Marketing categories.</p><p className="mt-3 text-[10px] text-foreground">AI-generated · Based on transaction data</p><div className="mt-4 flex h-12 items-end gap-1">{[28, 36, 33, 46, 40, 55, 48, 62, 58, 70, 65, 78].map((h, i) => <div key={`insight-${i}-${h}`} className="flex flex-1 items-end gap-0.5"><span className="w-1/2 rounded-t bg-primary text-primary-foreground" style={{
                  height: `${h}%`
                }} /><span className="w-1/2 rounded-t bg-muted" style={{
                  height: `${h * .7}%`
                }} /></div>)}</div><div className="mt-2 text-[10px] text-muted-foreground">Current period <span className="ml-4">Previous period</span></div></article><article className="rounded-xl border border-border bg-card p-5"><h2 className="text-sm font-bold">AI Recommendations <Badge tone="purple"><Bot size={11} />AI</Badge></h2>{['Review 37 uncategorized transactions', 'Investigate 5 unusual transactions', '3 possible duplicate transactions detected', '2 large outgoing transactions above normal'].map((text, i) => <div key={text} className="mt-3 flex items-center justify-between border-b border-border pb-2 text-xs"><span><Bot size={12} className="mr-2 inline text-foreground" />{text}<small className="ml-2 text-[10px] text-muted-foreground">AI Recommendation</small></span><button className="text-[11px] font-bold text-foreground">{i === 0 ? 'Review' : i === 1 ? 'Investigate' : i === 2 ? 'Review Duplicates' : 'View'}</button></div>)}</article></div>
 <section className="mt-5 mb-8 rounded-xl bg-[var(--card)] p-6 text-foreground shadow-lg"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Bot size={18} /></div><div><h2 className="text-sm font-bold">Ask Lulu AI about your transactions</h2><p className="mt-0.5 text-[11px] text-muted-foreground">Get instant answers and uncover what matters in your financial activity.</p></div></div><div className="mt-5 flex rounded-lg bg-card p-1"><input className="flex-1 bg-transparent px-3 text-xs text-muted-foreground outline-none placeholder:text-muted-foreground" placeholder="Ask Lulu AI about your transactions..." /><button className="rounded-md bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">Ask Lulu <ArrowUp size={13} className="ml-1 inline" /></button></div><div className="mt-3 flex flex-wrap gap-2">{['What changed this month?', 'Show largest transactions', 'Which categories increased?', 'Find unusual transactions', 'Show uncategorized', 'Compare money in and out'].map(prompt => <button key={prompt} className="rounded-full border border-border px-3 py-1.5 text-[11px] text-foreground hover:bg-secondary">{prompt}</button>)}</div></section>
 </div></main></div>;
}