import { useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, Bot, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Download, Ellipsis, FileDown, Filter, LayoutGrid, Menu, MoreHorizontal, Plus, RefreshCw, Search, Send, Settings, Sparkles, Upload, Users, X, Zap } from 'lucide-react';
type Invoice = {
  id: string;
  customer: string;
  date: string;
  due: string;
  amount: string;
  currency: string;
  payment: string;
  status: string;
  source: string;
  overdue?: boolean;
};
type Overdue = {
  id: string;
  customer: string;
  amount: string;
  due: string;
  days: string;
  reminder: string;
};
const invoices: Invoice[] = [{
  id: 'INV-2026-00124',
  customer: 'Acme GmbH',
  date: '10 Aug 2026',
  due: '24 Aug 2026',
  amount: '€4,850.00',
  currency: 'EUR',
  payment: 'PAID',
  status: 'COMPLETED',
  source: 'Manual'
}, {
  id: 'INV-2026-00123',
  customer: 'TechVision Ltd',
  date: '08 Aug 2026',
  due: '22 Aug 2026',
  amount: '€12,400.00',
  currency: 'EUR',
  payment: 'OVERDUE',
  status: 'SENT',
  source: 'CRM',
  overdue: true
}, {
  id: 'INV-2026-00122',
  customer: 'Nordic Solutions',
  date: '07 Aug 2026',
  due: '21 Aug 2026',
  amount: '€2,750.00',
  currency: 'SEK',
  payment: 'PARTIALLY PAID',
  status: 'SENT',
  source: 'Manual'
}, {
  id: 'INV-2026-00121',
  customer: 'Global Commerce Inc',
  date: '05 Aug 2026',
  due: '19 Aug 2026',
  amount: '€8,920.00',
  currency: 'USD',
  payment: 'PAID',
  status: 'COMPLETED',
  source: 'Ecommerce'
}, {
  id: 'INV-2026-00120',
  customer: 'Meridian Partners',
  date: '04 Aug 2026',
  due: '18 Aug 2026',
  amount: '€1,200.00',
  currency: 'EUR',
  payment: 'UNPAID',
  status: 'DRAFT',
  source: 'AI-assisted'
}, {
  id: 'INV-2026-00119',
  customer: 'Stark Industries',
  date: '02 Aug 2026',
  due: '16 Aug 2026',
  amount: '€34,500.00',
  currency: 'EUR',
  payment: 'OVERDUE',
  status: 'VIEWED',
  source: 'Manual',
  overdue: true
}, {
  id: 'INV-2026-00118',
  customer: 'Bright Future GmbH',
  date: '01 Aug 2026',
  due: '15 Aug 2026',
  amount: '€5,600.00',
  currency: 'EUR',
  payment: 'PAID',
  status: 'COMPLETED',
  source: 'Automation'
}, {
  id: 'INV-2026-00117',
  customer: 'Quantum Dynamics',
  date: '30 Jul 2026',
  due: '13 Aug 2026',
  amount: '€9,800.00',
  currency: 'GBP',
  payment: 'OVERDUE',
  status: 'SENT',
  source: 'CRM',
  overdue: true
}, {
  id: 'INV-2026-00116',
  customer: 'Sunrise Ventures',
  date: '28 Jul 2026',
  due: '11 Aug 2026',
  amount: '€3,100.00',
  currency: 'EUR',
  payment: 'PAID',
  status: 'COMPLETED',
  source: 'Ecommerce'
}, {
  id: 'INV-2026-00115',
  customer: 'Atlantic Corp',
  date: '25 Jul 2026',
  due: '08 Aug 2026',
  amount: '€7,250.00',
  currency: 'USD',
  payment: 'PARTIALLY PAID',
  status: 'SENT',
  source: 'Import'
}, {
  id: 'INV-2026-00114',
  customer: 'Pacific Holdings',
  date: '22 Jul 2026',
  due: '05 Aug 2026',
  amount: '€15,000.00',
  currency: 'EUR',
  payment: 'OVERDUE',
  status: 'VIEWED',
  source: 'Manual',
  overdue: true
}, {
  id: 'INV-2026-00113',
  customer: 'Euro Freight Ltd',
  date: '20 Jul 2026',
  due: '03 Aug 2026',
  amount: '€2,400.00',
  currency: 'EUR',
  payment: 'PAID',
  status: 'COMPLETED',
  source: 'AI-assisted'
}];
const overdue: Overdue[] = [{
  id: 'INV-2026-00123',
  customer: 'TechVision Ltd',
  amount: '€12,400.00',
  due: '22 Aug 2026',
  days: '8 days',
  reminder: 'Yesterday'
}, {
  id: 'INV-2026-00119',
  customer: 'Stark Industries',
  amount: '€34,500.00',
  due: '16 Aug 2026',
  days: '14 days',
  reminder: '5 days ago'
}, {
  id: 'INV-2026-00117',
  customer: 'Quantum Dynamics',
  amount: '€9,800.00',
  due: '13 Aug 2026',
  days: '17 days',
  reminder: 'Never'
}, {
  id: 'INV-2026-00114',
  customer: 'Pacific Holdings',
  amount: '€15,000.00',
  due: '05 Aug 2026',
  days: '25 days',
  reminder: '12 days ago'
}];
const chartData = [{
  month: 'Mar',
  total: 58,
  paid: 46,
  overdue: 7
}, {
  month: 'Apr',
  total: 72,
  paid: 61,
  overdue: 6
}, {
  month: 'May',
  total: 64,
  paid: 52,
  overdue: 9
}, {
  month: 'Jun',
  total: 84,
  paid: 70,
  overdue: 8
}, {
  month: 'Jul',
  total: 76,
  paid: 62,
  overdue: 11
}, {
  month: 'Aug',
  total: 92,
  paid: 74,
  overdue: 10
}];
const customers = [{
  name: 'Acme GmbH',
  invoices: '28',
  total: '€46,820',
  paid: '€42,100',
  outstanding: '€4,720',
  overdue: '€0',
  avg: '8.2 days'
}, {
  name: 'Stark Industries',
  invoices: '16',
  total: '€41,200',
  paid: '€6,700',
  outstanding: '€34,500',
  overdue: '€34,500',
  avg: '21.4 days'
}, {
  name: 'TechVision Ltd',
  invoices: '24',
  total: '€38,450',
  paid: '€26,050',
  outstanding: '€12,400',
  overdue: '€12,400',
  avg: '15.8 days'
}, {
  name: 'Nordic Solutions',
  invoices: '19',
  total: '€31,180',
  paid: '€27,940',
  outstanding: '€3,240',
  overdue: '€1,100',
  avg: '11.1 days'
}, {
  name: 'Global Commerce Inc',
  invoices: '14',
  total: '€28,640',
  paid: '€28,640',
  outstanding: '€0',
  overdue: '€0',
  avg: '6.7 days'
}];
const recurring = [{
  schedule: 'INV-REC-0042',
  customer: 'Acme GmbH',
  amount: '€4,850.00',
  frequency: 'Monthly',
  next: '01 Sep 2026',
  status: 'ACTIVE'
}, {
  schedule: 'INV-REC-0038',
  customer: 'Bright Future GmbH',
  amount: '€5,600.00',
  frequency: 'Monthly',
  next: '01 Sep 2026',
  status: 'ACTIVE'
}, {
  schedule: 'INV-REC-0021',
  customer: 'Meridian Partners',
  amount: '€1,200.00',
  frequency: 'Quarterly',
  next: '01 Oct 2026',
  status: 'PAUSED'
}];
const dateRanges = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Month to Date', 'Previous Month', 'Quarter to Date', 'Year to Date', 'Previous Year', 'Custom Range'];
const navSections = [{
  label: 'AI Platform',
  icon: Sparkles
}, {
  label: 'CRM',
  icon: Users
}, {
  label: 'Marketing',
  icon: Zap
}, {
  label: 'Advertising',
  icon: LayoutGrid
}];
const financeNav = ['Overview', 'Invoices', 'Offers & Quotes', 'Payments', 'Expenses', 'Customers', 'Transactions', 'Accounts', 'Reports'];
const filterNames = ['Status', 'Customer', 'Date', 'Due Date', 'Amount', 'Currency', 'Payment Status', 'Source'];
function Badge({
  value
}: {
  value: string;
}) {
  const styles: Record<string, string> = {
    PAID: 'bg-chart-4 text-primary-foreground',
    OVERDUE: 'bg-destructive text-primary-foreground',
    'PARTIALLY PAID': 'bg-chart-1 text-primary-foreground',
    UNPAID: 'bg-secondary text-foreground',
    DRAFT: 'border border-border text-muted-foreground',
    SENT: 'bg-primary text-primary-foreground',
    VIEWED: 'bg-primary text-primary-foreground',
    COMPLETED: 'border border-border text-foreground',
    ACTIVE: 'bg-chart-4/10 text-chart-4',
    PAUSED: 'border border-border text-muted-foreground'
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold tracking-wide ${styles[value] ?? 'border border-border text-muted-foreground'}`}>{value === 'OVERDUE' && <AlertTriangle size={11} className="mr-1" />}{value}</span>;
}
export function LuluInvoices() {
  const [selected, setSelected] = useState<string[]>([]);
  const [range, setRange] = useState('Last 30 Days');
  const [search, setSearch] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const visibleInvoices = useMemo(() => invoices.filter(invoice => invoice.id.toLowerCase().includes(search.toLowerCase()) || invoice.customer.toLowerCase().includes(search.toLowerCase())), [search]);
  const toggle = (id: string) => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[224px] flex-col bg-[var(--sidebar)] text-foreground lg:flex">
      <div className="flex h-[72px] items-center gap-3 border-b border-border px-6"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--primary)] text-primary-foreground"><Sparkles size={17} /></div><strong className="text-[17px] tracking-tight text-foreground">lulu<span className="text-[var(--foreground)]">.ai</span></strong></div>
      <nav className="flex-1 overflow-y-auto px-3 py-5"><p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.15em] text-muted-foreground">Workspace</p>{navSections.map(({
          label: item,
          icon: Icon
        }) => <button key={item} className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium hover:bg-secondary hover:text-foreground"><Icon size={16} /><span>{item}</span></button>)}<button className="mb-1 flex w-full items-center justify-between rounded-lg bg-secondary px-3 py-2.5 text-[13px] font-semibold text-foreground"><span className="flex items-center gap-3"><LayoutGrid size={16} /><span>Finance</span></span><ChevronDown size={14} /></button><div className="ml-4 border-l border-border pl-3">{financeNav.map(item => <button key={item} className={`mb-0.5 flex w-full items-center rounded-md px-3 py-2 text-[12px] ${item === 'Invoices' ? 'bg-[var(--primary)] font-semibold text-primary-foreground shadow-[0_6px_14px_rgba(0,0,0,.22)]' : 'text-foreground hover:bg-secondary hover:text-primary-foreground'}`}>{item}</button>)}</div><div className="my-5 border-t border-border" />{['Operations', 'Settings'].map(item => <button key={item} className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium hover:bg-secondary hover:text-foreground">{item === 'Settings' ? <Settings size={16} /> : <LayoutGrid size={16} />}<span>{item}</span></button>)}</nav>
      <div className="border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-secondary"><div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--primary)] text-xs font-bold text-[var(--primary-foreground)]">JS</div><div className="min-w-0"><p className="truncate text-xs font-semibold text-foreground">Jordan Smith</p><p className="truncate text-[11px] text-muted-foreground">Admin account</p></div><MoreHorizontal size={15} className="ml-auto" /></button></div>
    </aside>
    <main className="lg:ml-[224px]">
      <header className="border-b border-border bg-card px-5 py-5 sm:px-8"><div className="flex flex-wrap items-end justify-between gap-5"><div><div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground"><span>Finance</span><ChevronRight size={13} /><strong className="font-medium text-muted-foreground">Invoices</strong></div><h1 className="text-3xl font-bold tracking-[-.04em] text-foreground">Invoices</h1><p className="mt-1 text-sm text-muted-foreground">Create, manage and track your customer invoices.</p></div><div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-[var(--primary)]"><Plus size={15} />Create Invoice</button><button className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--secondary)]"><Sparkles size={14} />Ask Lulu AI</button><button className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-foreground hover:bg-secondary"><Upload size={14} />Import</button><button className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-foreground hover:bg-secondary"><Download size={14} />Export</button><button className="rounded-lg px-2.5 py-2.5 text-foreground hover:bg-secondary"><Ellipsis size={17} /></button></div></div></header>
      <div className="space-y-5 p-5 sm:p-8">
        <section className="flex flex-wrap items-center justify-between gap-3"><div className="flex max-w-full gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">{dateRanges.map(item => <button key={item} onClick={() => setRange(item)} className={`whitespace-nowrap rounded-md px-3 py-2 text-[11px] font-medium ${range === item ? 'bg-[var(--secondary)] text-[var(--foreground)]' : 'text-foreground hover:bg-card'}`}>{item}</button>)}</div><div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 text-[11px]"><span className="px-2 text-muted-foreground">Compare:</span>{['Previous Period', 'Previous Year', 'None'].map(item => <button key={item} className={`rounded-md px-2.5 py-1.5 ${item === 'Previous Period' ? 'bg-secondary font-semibold text-foreground' : 'text-foreground'}`}>{item}</button>)}</div></section>
        <section className="grid grid-cols-2 gap-3 xl:grid-cols-6">{[{
            label: 'Total Invoiced',
            value: '€124,850.00',
            note: '↗ 12.4%',
            tone: 'text-[var(--chart-3)]'
          }, {
            label: 'Paid',
            value: '€98,420.00',
            note: '↗ 8.6%',
            tone: 'text-chart-4'
          }, {
            label: 'Outstanding',
            value: '€18,420.00',
            note: '→ 2.1%',
            tone: 'text-chart-1'
          }, {
            label: 'Overdue',
            value: '€8,010.00',
            note: '⚠ 5 invoices',
            tone: 'text-chart-5'
          }, {
            label: 'Draft',
            value: '€12,350.00',
            note: '• 14 drafts',
            tone: 'text-muted-foreground'
          }, {
            label: 'Payment Rate',
            value: '78.8%',
            note: '↗ 4.2%',
            tone: 'text-foreground',
            progress: true
          }].map(card => <article key={card.label} className="rounded-xl border border-border bg-card p-4"><p className="text-[11px] font-medium text-muted-foreground">{card.label}</p><p className="mt-2 text-[20px] font-bold tracking-[-.03em] text-foreground">{card.value}</p><div className="mt-2 flex items-center justify-between"><span className="text-[10px] text-muted-foreground">Last 30 days</span><span className={`text-[10px] font-semibold ${card.tone}`}>{card.note}</span></div>{card.progress && <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full w-[78.8%] rounded-full bg-primary text-primary-foreground" /></div>}</article>)}</section>
        {!dismissed && <section className="flex items-start gap-3 rounded-xl border border-border bg-[var(--secondary)] px-4 py-3"><div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-secondary text-foreground"><Sparkles size={15} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="rounded bg-chart-1/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-chart-1">AI Insight</span><p className="text-xs leading-5 text-chart-1">5 invoices are currently overdue, representing €8,010 in outstanding receivables. 3 customers account for 74% of overdue balances. Consider sending payment reminders.</p></div><div className="mt-2 flex gap-2"><button className="rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground hover:bg-primary">Send Reminders</button><button className="rounded-md px-2.5 py-1.5 text-[11px] font-semibold text-chart-1 hover:bg-chart-1/10">View Overdue</button></div></div><button aria-label="Dismiss insight" onClick={() => setDismissed(true)} className="text-foreground hover:text-foreground"><X size={15} /></button></section>}
        <section className="rounded-xl border border-border bg-card"><div className="border-b border-border p-4"><div className="relative"><Search size={16} className="absolute left-3 top-3 text-muted-foreground" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search invoices..." className="h-10 w-full rounded-lg border border-border pl-9 pr-9 text-sm outline-none ring-[var(--border)] placeholder:text-muted-foreground focus:ring-2" />{search && <button onClick={() => setSearch('')} aria-label="Clear search" className="absolute right-3 top-3 text-foreground"><X size={15} /></button>}</div><p className="mt-2 text-[11px] text-muted-foreground">Search by invoice number, customer, email, amount, or reference</p><div className="mt-3 flex flex-wrap items-center gap-2"><Filter size={14} className="mr-1 text-muted-foreground" />{filterNames.map(item => <button key={item} className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:border-[var(--border)] hover:text-[var(--foreground)]">{item}<ChevronDown size={12} /></button>)}<button className="ml-auto text-[11px] font-semibold text-foreground hover:text-[var(--foreground)]">Clear Filters</button><button className="text-[11px] font-semibold text-[var(--foreground)]">Save Filter</button></div></div><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3"><span className="text-xs text-muted-foreground">Showing <strong className="text-foreground">{visibleInvoices.length} of 847</strong> invoices</span><div className="flex items-center gap-3 text-muted-foreground"><button aria-label="Select columns" className="hover:text-foreground"><LayoutGrid size={15} /></button><button aria-label="Change density" className="text-[11px] font-semibold hover:text-foreground">Density</button><button aria-label="Refresh invoices" className="hover:text-foreground"><RefreshCw size={15} /></button></div></div>{selected.length > 0 && <div className="flex flex-wrap items-center gap-2 bg-[var(--card)] px-4 py-2.5 text-xs"><strong>{selected.length} selected</strong><button className="ml-3 inline-flex items-center gap-1 rounded-md bg-card px-2 py-1.5 font-medium"><Send size={13} />Send</button><button className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-1.5 font-medium"><FileDown size={13} />Download</button><button className="rounded-md bg-card px-2 py-1.5 font-medium">Export</button><button className="rounded-md bg-card px-2 py-1.5 font-medium">Mark as Paid</button><button className="rounded-md bg-card px-2 py-1.5 font-medium text-chart-5">Delete</button><button onClick={() => setSelected([])} className="ml-auto text-foreground">✕ Clear</button></div>}<div className="overflow-x-auto"><table className="w-full min-w-[1080px] text-left text-xs"><thead className="sticky top-0 z-10 bg-secondary text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="w-10 px-4 py-3"><input type="checkbox" aria-label="Select all invoices" onChange={event => setSelected(event.target.checked ? invoices.map(invoice => invoice.id) : [])} /></th>{['Invoice', 'Customer', 'Invoice Date', 'Due Date', 'Amount', 'Currency', 'Payment Status', 'Status', 'Source', 'Created', ''].map(head => <th key={head || 'actions'} className={`whitespace-nowrap px-3 py-3 font-semibold ${head === 'Amount' ? 'text-right' : ''}`}>{head}</th>)}</tr></thead><tbody className="divide-y divide-border">{visibleInvoices.map(invoice => <tr key={invoice.id} className={`group transition-colors hover:bg-secondary ${invoice.overdue ? 'border-l-2 border-l-chart-5 bg-chart-5/35' : ''}`}><td className="px-4 py-3"><input type="checkbox" checked={selected.includes(invoice.id)} onChange={() => toggle(invoice.id)} aria-label={`Select ${invoice.id}`} /></td><td className="whitespace-nowrap px-3 py-3 font-semibold text-[var(--foreground)]">{invoice.id}</td><td className="whitespace-nowrap px-3 py-3 font-medium text-foreground">{invoice.customer}</td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{invoice.date}</td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{invoice.due}</td><td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-foreground">{invoice.amount}</td><td className="px-3 py-3 text-muted-foreground">{invoice.currency}</td><td className="px-3 py-3"><Badge value={invoice.payment} /></td><td className="px-3 py-3"><Badge value={invoice.status} /></td><td className="px-3 py-3 text-muted-foreground">{invoice.source}</td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{invoice.date}</td><td className="px-3 py-3"><button aria-label={`More actions for ${invoice.id}`} className="rounded p-1 text-foreground hover:bg-secondary"><Ellipsis size={16} /></button></td></tr>)}</tbody></table></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs"><div className="flex items-center gap-1"><button className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-foreground"><ChevronLeft size={13} />Previous</button>{['1', '2', '3', '…', '36'].map(item => <button key={item} className={`h-7 min-w-7 rounded-md px-2 ${item === '1' ? 'bg-[var(--primary)] font-semibold text-primary-foreground' : 'text-foreground hover:bg-secondary'}`}>{item}</button>)}<button className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-foreground">Next<ChevronRight size={13} /></button></div><div className="flex items-center gap-4 text-muted-foreground"><span>Rows per page: <strong className="text-muted-foreground">25⌄</strong></span><span>847 invoices total</span></div></div></section>
        <section className="rounded-xl border border-chart-5/30 bg-card"><div className="flex items-center justify-between border-b border-border px-5 py-4"><h2 className="text-base font-bold text-foreground">Overdue Invoices <span className="ml-2 rounded-full bg-chart-5/10 px-2 py-1 text-[10px] text-chart-5">5</span></h2><button className="text-xs font-semibold text-[var(--chart-3)]">View all overdue <ChevronRight size={13} className="inline" /></button></div><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-xs"><thead className="bg-[var(--card)] text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Invoice', 'Customer', 'Amount', 'Due Date', 'Days Overdue', 'Last Reminder', 'Actions'].map(head => <th key={head} className="px-5 py-3 font-semibold">{head}</th>)}</tr></thead><tbody className="divide-y divide-border">{overdue.map(item => <tr key={item.id} className="hover:bg-chart-5/30"><td className="px-5 py-3 font-semibold text-[var(--chart-3)]">{item.id}</td><td className="px-5 py-3 font-medium">{item.customer}</td><td className="px-5 py-3 font-semibold">{item.amount}</td><td className="px-5 py-3 text-muted-foreground">{item.due}</td><td className="px-5 py-3 font-bold text-chart-5">{item.days}</td><td className="px-5 py-3 text-muted-foreground">{item.reminder}</td><td className="px-5 py-3"><button className="mr-2 rounded-md border border-border px-2 py-1.5 text-[11px] font-semibold text-foreground">Send Reminder</button><button className="rounded-md border border-border px-2 py-1.5 text-[11px] font-semibold text-foreground">Record Payment</button></td></tr>)}</tbody></table></div></section>
        <section className="rounded-xl border border-border bg-card p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-base font-bold text-foreground">Invoice Performance</h2><p className="mt-1 text-xs text-muted-foreground">Invoice Value Over Time</p></div><div className="flex rounded-lg bg-secondary p-1">{['Overview', 'By Customer', 'Recurring'].map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-md px-3 py-1.5 text-xs ${activeTab === tab ? 'bg-card font-semibold text-foreground shadow-sm' : 'text-foreground'}`}>{tab}</button>)}</div><select className="rounded-md border border-border px-2 py-1.5 text-xs text-muted-foreground"><option>Last 6 months</option><option>Last 12 months</option></select></div><div className="mt-4 h-[235px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} barGap={5}><CartesianGrid vertical={false} stroke="var(--background)" /><XAxis dataKey="month" tick={{
                  fontSize: 11,
                  fill: 'var(--muted-foreground)'
                }} axisLine={false} tickLine={false} /><YAxis tick={{
                  fontSize: 10,
                  fill: 'var(--muted-foreground)'
                }} axisLine={false} tickLine={false} tickFormatter={value => `€${value}k`} /><Tooltip contentStyle={{
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 11
                }} /><Bar dataKey="total" name="Total Invoiced" fill="var(--foreground)" radius={[4, 4, 0, 0]} /><Bar dataKey="paid" name="Paid" fill="var(--chart-4)" radius={[4, 4, 0, 0]} /><Area type="monotone" dataKey="overdue" name="Overdue" stroke="var(--chart-5)" fill="transparent" strokeWidth={2} /></BarChart></ResponsiveContainer></div><div className="grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-4">{[['Avg Invoice Value', '€1,247'], ['Avg Payment Time', '12.4 days'], ['Invoice Volume', '847'], ['Payment Rate', '78.8%']].map(([label, value]) => <div key={label}><p className="text-[11px] text-muted-foreground">{label}</p><p className="mt-1 text-lg font-bold text-foreground">{value}</p></div>)}</div></section>
        <section className="rounded-xl border border-border bg-card"><div className="flex items-center justify-between border-b border-border px-5 py-4"><h2 className="text-base font-bold text-foreground">Customer Invoice Performance</h2><button className="text-xs font-semibold text-[var(--foreground)]">View All Customers <ChevronRight size={13} className="inline" /></button></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-xs"><thead className="bg-card text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Customer', 'Invoices', 'Total Invoiced', 'Paid', 'Outstanding', 'Overdue', 'Avg Payment Time', 'Actions'].map(head => <th key={head} className="px-5 py-3 font-semibold">{head}</th>)}</tr></thead><tbody className="divide-y divide-border">{customers.map(customer => <tr key={customer.name} className="hover:bg-card"><td className="px-5 py-3 font-semibold text-foreground">{customer.name}</td><td className="px-5 py-3 text-muted-foreground">{customer.invoices}</td><td className="px-5 py-3 font-semibold">{customer.total}</td><td className="px-5 py-3 text-chart-4">{customer.paid}</td><td className="px-5 py-3 text-chart-1">{customer.outstanding}</td><td className="px-5 py-3 text-chart-5">{customer.overdue}</td><td className="px-5 py-3 text-muted-foreground">{customer.avg}</td><td className="px-5 py-3"><button className="text-foreground hover:text-[var(--foreground)]"><Ellipsis size={16} /></button></td></tr>)}</tbody></table></div></section>
        <section className="rounded-xl border border-border bg-card"><div className="flex items-center justify-between border-b border-border px-5 py-4"><h2 className="text-base font-bold text-foreground">Recurring Invoices <span className="ml-2 rounded-full bg-secondary px-2 py-1 text-[10px] text-foreground">3</span></h2><button className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground"><Plus size={14} />Create Recurring Invoice</button></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-xs"><thead className="bg-card text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Schedule', 'Customer', 'Amount', 'Frequency', 'Next Invoice', 'Status', 'Actions'].map(head => <th key={head} className="px-5 py-3 font-semibold">{head}</th>)}</tr></thead><tbody className="divide-y divide-border">{recurring.map(item => <tr key={item.schedule} className="hover:bg-card"><td className="px-5 py-3 font-semibold text-[var(--foreground)]">{item.schedule}</td><td className="px-5 py-3 font-medium">{item.customer}</td><td className="px-5 py-3 font-semibold">{item.amount}</td><td className="px-5 py-3 text-muted-foreground">{item.frequency}</td><td className="px-5 py-3 text-muted-foreground">{item.next}</td><td className="px-5 py-3"><Badge value={item.status} /></td><td className="px-5 py-3"><button className="text-foreground"><Ellipsis size={16} /></button></td></tr>)}</tbody></table></div></section>
        <section className="rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--card)] to-white p-5"><div className="flex items-start gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary)] text-primary-foreground"><Bot size={19} /></div><div><h2 className="text-base font-bold text-foreground">Ask Lulu AI</h2><p className="mt-0.5 text-xs text-muted-foreground">Get quick answers and take action across your invoice data.</p></div></div><div className="mt-4 flex items-center gap-2 rounded-lg border border-[var(--border)] bg-card px-3 py-2.5"><Sparkles size={15} className="text-[var(--muted-foreground)]" /><input placeholder="Ask Lulu AI about your invoices..." className="min-w-0 flex-1 text-sm outline-none placeholder:text-muted-foreground" /><button className="rounded-md bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-primary-foreground">Ask</button></div><div className="mt-3 flex flex-wrap gap-2">{['Which invoices are overdue?', 'Who owes us the most?', 'Which invoices are due this week?', 'Show unpaid invoices.', 'Draft a payment reminder.', 'Summarize invoice performance.'].map(prompt => <button key={prompt} className="rounded-full border border-[var(--border)] bg-card px-3 py-1.5 text-[11px] text-[var(--foreground)] hover:bg-[var(--secondary)]">{prompt}</button>)}</div></section>
      </div>
    </main>
  </div>;
}