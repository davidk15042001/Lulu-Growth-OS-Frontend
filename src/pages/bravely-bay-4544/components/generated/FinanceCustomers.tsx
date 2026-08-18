import { useMemo, useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertTriangle, Bot, ChevronDown, CircleDollarSign, CreditCard, FileText, Landmark, MoreHorizontal, PanelLeft, Search, Send, Settings2, Sparkles, Users, WalletCards } from 'lucide-react';
type Tone = 'green' | 'amber' | 'red' | 'purple' | 'blue' | 'slate';
type Customer = {
  name: string;
  revenue: string;
  paid: string;
  outstanding: string;
  overdue: string;
  invoices: string;
  payments: string;
  last: string;
  behavior: string;
  behaviorTone: Tone;
  value: string;
  valueTone: Tone;
};
const customers: Customer[] = [{
  name: 'Connected customer',
  revenue: '€84,500',
  paid: '€72,000',
  outstanding: '€12,500',
  overdue: '€4,200',
  invoices: '18',
  payments: '16',
  last: '08 Aug 2026',
  behavior: 'Mostly On Time',
  behaviorTone: 'green',
  value: 'High',
  valueTone: 'purple'
}, {
  name: 'Bright Solutions Ltd',
  revenue: '€61,200',
  paid: '€61,200',
  outstanding: '—',
  overdue: '—',
  invoices: '12',
  payments: '12',
  last: '15 Aug 2026',
  behavior: 'On Time',
  behaviorTone: 'green',
  value: 'High',
  valueTone: 'purple'
}, {
  name: 'Nova Tech Inc',
  revenue: '€45,800',
  paid: '€38,600',
  outstanding: '€7,200',
  overdue: '€7,200',
  invoices: '9',
  payments: '7',
  last: '22 Jul 2026',
  behavior: 'Frequently Late',
  behaviorTone: 'amber',
  value: 'Medium',
  valueTone: 'blue'
}, {
  name: 'Stellar Corp',
  revenue: '€38,400',
  paid: '€35,000',
  outstanding: '€3,400',
  overdue: '—',
  invoices: '14',
  payments: '13',
  last: '01 Aug 2026',
  behavior: 'On Time',
  behaviorTone: 'green',
  value: 'Medium',
  valueTone: 'blue'
}, {
  name: 'Horizon Partners',
  revenue: '€29,100',
  paid: '€21,000',
  outstanding: '€8,100',
  overdue: '€8,100',
  invoices: '7',
  payments: '5',
  last: '10 Jun 2026',
  behavior: 'Overdue',
  behaviorTone: 'red',
  value: 'Medium',
  valueTone: 'blue'
}, {
  name: 'Alpine Ventures',
  revenue: '€22,700',
  paid: '€22,700',
  outstanding: '—',
  overdue: '—',
  invoices: '6',
  payments: '6',
  last: '28 Jul 2026',
  behavior: 'On Time',
  behaviorTone: 'green',
  value: 'Low',
  valueTone: 'slate'
}, {
  name: 'Meridian Group',
  revenue: '€18,500',
  paid: '€14,200',
  outstanding: '€4,300',
  overdue: '€1,800',
  invoices: '5',
  payments: '4',
  last: '03 Jul 2026',
  behavior: 'Frequently Late',
  behaviorTone: 'amber',
  value: 'Low',
  valueTone: 'slate'
}, {
  name: 'Crestwood Ltd',
  revenue: '€12,400',
  paid: '€12,400',
  outstanding: '—',
  overdue: '—',
  invoices: '4',
  payments: '4',
  last: '12 Aug 2026',
  behavior: 'On Time',
  behaviorTone: 'green',
  value: 'Low',
  valueTone: 'slate'
}];
const filters = ['Customer Type', 'Financial Status', 'Revenue', 'Outstanding', 'Payment Behavior', 'Customer Value', 'Date', 'Currency'];
const invoices = [['INV-2847', '15 Aug 2026', '€4,200', '29 Aug 2026', 'Paid', 'Paid', 'green'], ['INV-2844', '08 Aug 2026', '€8,400', '22 Aug 2026', 'Outstanding', 'Pending', 'amber'], ['INV-2839', '22 Jul 2026', '€7,200', '05 Aug 2026', 'Overdue', 'Overdue', 'red'], ['INV-2836', '01 Aug 2026', '€3,400', '15 Aug 2026', 'Outstanding', 'Pending', 'amber'], ['INV-2829', '10 Jun 2026', '€8,100', '24 Jun 2026', 'Overdue', 'Overdue', 'red']];
const payments = [['PAY-9918', '15 Aug 2026', '€4,200', 'Card', 'Stripe', 'Successful', 'green'], ['PAY-9902', '08 Aug 2026', '€8,400', 'Bank transfer', 'Wise', 'Pending', 'amber'], ['PAY-9864', '28 Jul 2026', '€22,700', 'Card', 'Stripe', 'Successful', 'green'], ['PAY-9811', '22 Jul 2026', '€1,800', 'Card', 'Stripe', 'Failed', 'red'], ['PAY-9788', '03 Jul 2026', '€14,200', 'Bank transfer', 'Adyen', 'Successful', 'green']];
const prompts = ['Which customers generate the most revenue?', 'Which customers have outstanding balances?', 'Which customers are overdue?', 'Which customers pay late most often?', 'Show my top customers by revenue', 'Compare customer revenue this month with last month', 'Create a customer finance report'];
function Badge({
  children,
  tone = 'slate',
  dot = true
}: {
  children: string;
  tone?: Tone;
  dot?: boolean;
}) {
  const styles: Record<Tone, string> = {
    green: 'border-border bg-secondary text-foreground',
    amber: 'border-border bg-secondary text-foreground',
    red: 'border-chart-5/30 bg-chart-5/10 text-chart-5',
    purple: 'border-border bg-secondary text-foreground',
    blue: 'border-border bg-secondary text-foreground',
    slate: 'border-border bg-card text-muted-foreground'
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-bold ${styles[tone]}`}>{dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}{children}</span>;
}
function Card({
  title,
  subtitle,
  children,
  action
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: string;
}) {
  return <section className="rounded-xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><header className="mb-5 flex items-start justify-between gap-3"><div><h2 className="text-[15px] font-bold tracking-[-0.02em] text-foreground">{title}</h2>{subtitle && <p className="mt-1 text-[11px] text-muted-foreground">{subtitle}</p>}</div>{action && <button className="text-[11px] font-bold text-foreground hover:text-foreground">{action}</button>}</header>{children}</section>;
}
export function FinanceCustomers() {
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState('Last 30D');
  const [chartPeriod, setChartPeriod] = useState('Daily');
  const [selected, setSelected] = useState<string[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const toggle = (name: string) => setSelected(current => current.includes(name) ? current.filter(item => item !== name) : [...current, name]);
  const { items: liveCustomers, loading: liveLoading, error: liveError } = useLiveRecords('finance_customers');
  const liveEmpty = !liveLoading && !liveError && liveCustomers.length === 0;
  const liveCustomerRows: Customer[] = liveCustomers.map(record => { const tone = /overdue|late/i.test(`${record.status} ${record.data?.behavior || ''}`) ? 'red' : 'green'; const revenue = Number(record.valueAmount || record.data?.revenue || 0); return { name: record.name, revenue: new Intl.NumberFormat(undefined, { style: 'currency', currency: record.currency || 'EUR', maximumFractionDigits: 0 }).format(revenue), paid: String(record.data?.paid || '—'), outstanding: String(record.data?.outstanding || '—'), overdue: String(record.data?.overdue || '—'), invoices: String(record.data?.invoices || '—'), payments: String(record.data?.payments || '—'), last: String(record.data?.lastPayment || record.updatedAt || '—'), behavior: String(record.data?.behavior || record.status || 'Recorded'), behaviorTone: tone as Tone, value: String(record.data?.valueTier || 'Recorded'), valueTone: 'slate' as Tone }; });
  const visibleCustomers = useMemo(() => liveCustomerRows.filter(customer => customer.name.toLowerCase().includes(query.toLowerCase())), [liveCustomerRows, query]);
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[244px] flex-col bg-[var(--sidebar)] text-foreground lg:flex"><div className="flex h-16 items-center gap-3 border-b border-border px-6"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={17} /></div><strong className="text-lg tracking-tight text-foreground">LULU <span className="font-normal text-foreground">AI</span></strong></div><LuluSectionNavigation activeId="bravely-bay-4544" /><div className="border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-foreground hover:bg-secondary"><Settings2 size={15} />Workspace settings</button><div className="mt-3 flex items-center gap-3 rounded-lg bg-secondary p-3"><div className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">AM</div><div><p className="text-xs font-semibold text-foreground">Workspace customer</p><p className="text-[10px] text-muted-foreground">Admin</p></div><MoreHorizontal size={15} className="ml-auto" /></div></div></aside>
    <main className="lg:ml-[244px]">{liveLoading ? <div className="border-b border-border bg-secondary/30 px-5 py-3 text-xs text-muted-foreground lg:px-8">Loading live finance customers…</div> : liveError ? <div className="border-b border-destructive/30 bg-destructive/5 px-5 py-3 text-xs text-destructive lg:px-8">{liveError}</div> : liveEmpty ? <div className="border-b border-dashed border-border bg-card px-5 py-3 text-xs text-muted-foreground lg:px-8">No live finance customer records are available yet. Add customers or connect your finance system to begin.</div> : null}<div className="flex h-16 items-center justify-between border-b border-border bg-card px-5 lg:px-8"><div className="flex items-center gap-3"><PanelLeft size={18} className="text-muted-foreground lg:hidden" /><span className="text-xs text-muted-foreground">Finance /</span><span className="text-xs font-semibold text-muted-foreground">Customers</span></div><div className="flex items-center gap-3"><div className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 md:flex"><Search size={14} className="text-muted-foreground" /><input placeholder="Search finance..." className="w-40 bg-transparent text-xs outline-none placeholder:text-muted-foreground" /></div><Activity size={17} className="text-muted-foreground" /><div className="h-7 w-7 rounded-full bg-secondary text-center text-[10px] font-bold leading-7 text-muted-foreground">AM</div></div></div>
      <div className="mx-auto max-w-[1480px] px-5 py-7 lg:px-8"><header className="mb-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-3 text-xs font-medium text-muted-foreground">Finance <span className="mx-1">/</span> Customers</p><h1 className="text-3xl font-bold tracking-[-0.05em] text-foreground">Customers</h1><p className="mt-2 text-sm text-muted-foreground">Understand the financial performance and payment activity of your customers.</p></div><div className="flex flex-wrap gap-2"><button className="rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs font-bold text-foreground hover:border-border hover:text-foreground">Open CRM Customers</button><button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary"><Bot size={15} />Ask Lulu AI</button><button className="rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-foreground">Export</button><button aria-label="More actions" className="rounded-lg border border-border bg-card p-2.5 text-foreground"><MoreHorizontal size={16} /></button></div></header>
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-7">{[['Total Customers', '1,284', 'With financial records', 'slate'], ['Customer Revenue', '€2,847,500', 'Total revenue this period', 'green'], ['Paid', '€2,391,200', 'Successfully collected', 'green'], ['Outstanding', '€312,800', 'Awaiting payment', 'amber'], ['Average Customer Value', '€2,217', 'Per customer this period', 'slate'], ['High-Value Customers', '47', 'Above threshold', 'purple'], ['Overdue Customers', '23', 'With overdue balances', 'red']].map(([name, value, sub, tone]) => <article key={name} className="rounded-xl border border-border bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><div className="flex items-start justify-between"><p className="text-[11px] font-semibold leading-4 text-muted-foreground">{name}</p><span className={`h-2 w-2 rounded-full ${tone === 'green' ? 'bg-chart-4' : tone === 'amber' ? 'bg-chart-1' : tone === 'red' ? 'bg-destructive' : tone === 'purple' ? 'bg-primary' : 'bg-muted'}`} /></div><p className="mt-4 text-[20px] font-bold tracking-[-0.04em] text-foreground">{value}</p><p className="mt-1 text-[10px] text-muted-foreground">{sub}</p>{tone === 'green' && <p className="mt-2 text-[10px] font-bold text-chart-4">↑ 12.4% vs previous</p>}</article>)}</div>
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3"><span className="mr-1 text-[11px] font-bold text-muted-foreground">Period</span>{['Today', 'Last 7D', 'Last 30D', 'MTD', 'This Quarter', 'YTD', 'Custom'].map(item => <button key={item} onClick={() => setPeriod(item)} className={`rounded-md px-3 py-2 text-[11px] font-bold ${period === item ? 'bg-primary text-primary-foreground' : 'text-primary-foreground hover:bg-secondary'}`}>{item}</button>)}<label className="ml-auto flex items-center gap-2 text-[11px] font-semibold text-muted-foreground"><input type="checkbox" defaultChecked className="accent-primary" />vs Previous Period</label></div>
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-3 xl:flex-row xl:items-center"><div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-lg border border-border px-3 py-2.5"><Search size={15} className="text-muted-foreground" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search customers..." className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground" /></div><div className="flex flex-1 flex-wrap gap-1.5">{filters.map(filter => <button key={filter} className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-2 text-[10px] font-semibold text-foreground hover:border-border">{filter}<ChevronDown size={12} /></button>)}</div><div className="flex gap-2"><button className="text-[10px] font-bold text-foreground">Clear Filters</button><button className="rounded-md border border-border px-2.5 py-2 text-[10px] font-bold text-foreground">Save Filter</button></div></div>
        <Card title="Customer Financial Activity" subtitle="Illustrative customer financial records · EUR · selected period" action="View all"><div className="overflow-x-auto"><table className="w-full min-w-[1160px] text-left text-[11px]"><thead className="border-b border-border text-[10px] font-bold text-muted-foreground"><tr><th className="w-8 pb-3"><input type="checkbox" className="accent-primary" /></th>{['Customer', 'Revenue', 'Paid', 'Outstanding', 'Overdue', 'Invoices', 'Payments', 'Last Payment', 'Payment Behavior', 'Customer Value', ''].map(header => <th key={header} className="pb-3 pr-4">{header}{header && <span className="ml-1 text-foreground">↕</span>}</th>)}</tr></thead><tbody className="divide-y divide-border">{visibleCustomers.map(customer => <tr key={customer.name} className="group hover:bg-secondary/30"><td className="py-3"><input type="checkbox" checked={selected.includes(customer.name)} onChange={() => toggle(customer.name)} className="accent-primary" /></td><td className="whitespace-nowrap py-3 pr-4 font-bold text-foreground">{customer.name}</td><td className="py-3 pr-4 font-semibold">{customer.revenue}</td><td className="py-3 pr-4">{customer.paid}</td><td className="py-3 pr-4">{customer.outstanding}</td><td className="py-3 pr-4 text-chart-5">{customer.overdue}</td><td className="py-3 pr-4">{customer.invoices}</td><td className="py-3 pr-4">{customer.payments}</td><td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">{customer.last}</td><td className="py-3 pr-4"><Badge tone={customer.behaviorTone}>{customer.behavior}</Badge></td><td className="py-3 pr-4"><Badge tone={customer.valueTone}>{customer.value}</Badge></td><td className="relative py-3"><button onClick={() => setOpenMenu(openMenu === customer.name ? null : customer.name)} aria-label={`Actions for ${customer.name}`} className="rounded p-1 text-foreground hover:bg-secondary hover:text-foreground"><MoreHorizontal size={16} /></button>{openMenu === customer.name && <div className="absolute right-0 top-9 z-10 w-48 rounded-lg border border-border bg-card p-1.5 text-[11px] shadow-xl">{['Open Financial Profile', 'Open CRM Profile', 'View Invoices', 'View Payments', 'View Transactions', 'Ask Lulu AI', 'Export'].map(action => <button key={action} className="block w-full rounded px-2.5 py-2 text-left font-semibold text-foreground hover:bg-secondary hover:text-foreground">{action}</button>)}</div>}</td></tr>)}</tbody></table></div><footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-[11px] text-muted-foreground"><span>Showing 1–8 of 1,284 customers</span><span>Rows per page: <strong className="text-foreground">25</strong> <ChevronDown className="inline" size={12} /></span><div className="flex gap-1"><button className="rounded border px-2 py-1">‹</button><button className="rounded bg-primary px-2 py-1 font-bold text-primary-foreground">1</button><button className="rounded border px-2 py-1">2</button><button className="rounded border px-2 py-1">›</button></div></footer></Card>
        <Card title="Customer Revenue" subtitle="Revenue, collection and outstanding balance over the selected period"><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div className="flex rounded-lg bg-secondary p-1">{['Daily', 'Weekly', 'Monthly'].map(item => <button key={item} onClick={() => setChartPeriod(item)} className={`rounded-md px-3 py-1.5 text-[11px] font-bold ${chartPeriod === item ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}>{item}</button>)}</div><div className="flex gap-4 text-[10px] text-muted-foreground"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Revenue</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-chart-4" />Paid</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Outstanding</span><span><i className="mr-1 inline-block w-4 border-t border-dashed border-border" />Previous</span></div></div><svg viewBox="0 0 1000 220" className="h-[220px] w-full" role="img" aria-label="Customer revenue trend chart"><g stroke="var(--border)" strokeDasharray="3 5"><path d="M35 30H975M35 78H975M35 126H975M35 174H975" /></g><path d="M35 158 C115 148 125 130 185 142 S260 112 315 125 S390 78 450 98 S520 65 585 83 S660 42 720 62 S800 28 860 45 S925 25 975 32" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="7 6" /><path d="M35 166 C105 150 125 152 185 134 S260 139 315 108 S390 121 450 92 S520 105 585 68 S660 78 720 52 S800 67 860 34 S925 45 975 20 L975 190 L35 190Z" fill="var(--chart-2)" opacity=".10" /><path d="M35 166 C105 150 125 152 185 134 S260 139 315 108 S390 121 450 92 S520 105 585 68 S660 78 720 52 S800 67 860 34 S925 45 975 20" fill="none" stroke="var(--chart-2)" strokeWidth="3" /><path d="M35 180 C105 174 125 163 185 169 S260 158 315 148 S390 153 450 130 S520 141 585 110 S660 123 720 101 S800 114 860 84 S925 90 975 76" fill="none" stroke="var(--chart-4)" strokeWidth="2.5" /><path d="M35 188 C105 185 125 181 185 180 S260 177 315 169 S390 176 450 160 S520 169 585 149 S660 158 720 140 S800 152 860 126 S925 130 975 116" fill="none" stroke="var(--chart-1)" strokeWidth="2.5" /><g fill="var(--border)" fontSize="10"><text x="35" y="210">01 Aug</text><text x="230" y="210">08 Aug</text><text x="450" y="210">15 Aug</text><text x="670" y="210">22 Aug</text><text x="900" y="210">30 Aug</text></g></svg></Card>
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><Card title="Invoice Activity" subtitle="Recent illustrative invoice records"><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-[10px]"><thead className="border-b border-border text-muted-foreground"><tr>{['Invoice #', 'Date', 'Amount', 'Due Date', 'Status', 'Payment Status', ''].map(item => <th key={item} className="pb-2 pr-3">{item}</th>)}</tr></thead><tbody className="divide-y divide-border">{invoices.map(row => <tr key={row[0]}><td className="py-2.5 font-bold text-foreground">{row[0]}</td><td>{row[1]}</td><td className="font-semibold">{row[2]}</td><td>{row[3]}</td><td><Badge tone={row[6] as Tone}>{row[4]}</Badge></td><td><Badge tone={row[6] as Tone}>{row[5]}</Badge></td><td><button className="font-bold text-foreground">Open Invoice</button></td></tr>)}</tbody></table></div></Card><Card title="Payment Activity" subtitle="Recent illustrative payment records"><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-[10px]"><thead className="border-b border-border text-muted-foreground"><tr>{['Payment', 'Date', 'Amount', 'Method', 'Provider', 'Status', ''].map(item => <th key={item} className="pb-2 pr-3">{item}</th>)}</tr></thead><tbody className="divide-y divide-border">{payments.map(row => <tr key={row[0]}><td className="py-2.5 font-bold text-foreground">{row[0]}</td><td>{row[1]}</td><td className="font-semibold">{row[2]}</td><td>{row[3]}</td><td>{row[4]}</td><td><Badge tone={row[6] as Tone}>{row[5]}</Badge></td><td><button className="font-bold text-foreground">Open Payment</button></td></tr>)}</tbody></table></div></Card></div>
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><Card title="Outstanding Balance" subtitle="Aging of customer balances"><div className="flex items-end justify-between"><div><p className="text-[28px] font-bold tracking-[-0.05em]">€312,800</p><p className="text-[11px] text-muted-foreground">Total Outstanding</p></div><Badge tone="amber">23 overdue customers</Badge></div><div className="mt-6 flex h-3 overflow-hidden rounded-full"><span className="w-[40%] bg-primary text-primary-foreground" /><span className="w-[31%] bg-chart-1" /><span className="w-[17%] bg-chart-1" /><span className="w-[12%] bg-destructive" /></div><div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">{[['0–30 days', '€124,500', 'text-foreground'], ['31–60 days', '€98,200', 'text-foreground'], ['61–90 days', '€54,100', 'text-foreground'], ['90+ days', '€36,000', 'text-chart-5']].map(item => <div key={item[0]} className="flex justify-between"><span className="text-muted-foreground">{item[0]}</span><strong className={item[2]}>{item[1]}</strong></div>)}</div><p className="mt-5 text-[10px] italic text-muted-foreground">Do not use this data as professional financial advice.</p></Card><Card title="Customer Value" subtitle="Segment distribution across financial records"><div className="flex items-center gap-7"><div className="relative grid h-32 w-32 shrink-0 place-items-center rounded-full" style={{
                background: 'conic-gradient(var(--primary) 0 4%, var(--primary) 4% 28%, var(--muted) 28% 100%)'
              }}><div className="grid h-20 w-20 place-items-center rounded-full bg-card text-center"><strong className="text-xl">1,284</strong><span className="text-[9px] text-muted-foreground">customers</span></div></div><div className="space-y-2 text-[11px]"><p><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />High Value <strong>47</strong></p><p><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Medium <strong>312</strong></p><p><i className="mr-2 inline-block h-2 w-2 rounded-full bg-muted" />Low <strong>925</strong></p></div></div><div className="mt-5 grid grid-cols-4 gap-3 border-t border-border pt-4 text-[10px]">{[['Total Revenue', '€2.84m'], ['Avg Revenue', '€2,217'], ['Revenue Growth', '+12.4%'], ['Contribution to total', '68%']].map(item => <div key={item[0]}><p className="text-muted-foreground">{item[0]}</p><strong className="mt-1 block">{item[1]}</strong><em className="text-[9px] text-muted-foreground">Calculated</em></div>)}</div></Card></div>
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><Card title="High-Value Customers" subtitle="Top illustrative customers by revenue" action="View all"><div className="divide-y divide-border">{customers.slice(0, 5).map(customer => <div key={customer.name} className="flex items-center gap-3 py-3 first:pt-0"><strong className="w-32 truncate text-[11px]">{customer.name}</strong><span className="w-20 text-[11px] font-bold">{customer.revenue}</span><span className="text-[10px] font-bold text-foreground">+{[24, 18, 15, 11, 8][customers.indexOf(customer)]}%</span><span className="ml-auto text-[10px] text-muted-foreground">{customer.outstanding}</span><Badge tone={customer.behaviorTone}>{customer.behavior}</Badge><button className="text-[10px] font-bold text-foreground">Open</button></div>)}</div></Card><Card title="Financial Anomalies" subtitle="AI Assessment · detected across connected data"><div className="space-y-3">{[['High', 'Connected customer', 'Sudden outstanding balance increase', '18 Aug 2026', 'Balance rose 42% in the selected period', 'red'], ['Medium', 'Nova Tech Inc', 'Repeated payment timing changes', '16 Aug 2026', 'Three late payments in recent records', 'amber'], ['Low', 'Meridian Group', 'Revenue concentration shift', '12 Aug 2026', 'Lower recurring activity than prior period', 'blue']].map(item => <div key={item[1]} className="rounded-lg border border-border p-3"><div className="flex items-start gap-3"><AlertTriangle size={16} className="mt-0.5 text-foreground" /><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><Badge tone={item[5] as Tone}>{item[0]}</Badge><strong className="text-[11px]">{item[1]}</strong></div><p className="mt-1 text-[11px] font-semibold">{item[2]}</p><p className="mt-1 text-[10px] text-muted-foreground">{item[3]} · {item[4]}</p><div className="mt-2 flex gap-3"><button className="text-[10px] font-bold text-foreground">Investigate</button><button className="text-[10px] font-bold text-foreground">Ask Lulu AI</button></div></div></div></div>)}</div></Card></div>
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><Card title="AI Insights"><div className="mb-3"><Badge tone="purple">AI-generated</Badge></div><p className="text-sm font-semibold leading-6 text-foreground">The top 10 customers generated 58% of recorded customer revenue during the selected period. Three of these customers currently have outstanding balances.</p><div className="mt-4 flex flex-wrap gap-2"><Badge tone="purple" dot={false}>Top 10 · 58%</Badge><Badge tone="amber" dot={false}>3 outstanding</Badge><Badge tone="slate" dot={false}>Selected period</Badge></div><p className="mt-4 text-[10px] text-muted-foreground">Based on available financial data</p></Card><Card title="AI Recommendations"><div className="mb-3"><Badge tone="purple" dot={false}>AI Recommendation</Badge></div><div className="space-y-2">{['Review customers with increasing overdue balances', 'Investigate unusual payment failures', 'Review high-value customers with declining revenue', 'Analyze customer revenue concentration'].map(item => <div key={item} className="flex items-center gap-3 rounded-lg border border-border p-3"><Sparkles size={15} className="text-foreground" /><span className="flex-1 text-[11px] font-semibold">{item}</span><button className="text-[10px] font-bold text-foreground">Action</button></div>)}</div><p className="mt-4 text-[10px] text-muted-foreground">AI must not automatically contact customers or initiate financial actions without explicit authorization.</p></Card></div>
        <section className="mt-6 rounded-xl border border-border bg-gradient-to-br from-secondary via-white to-secondary p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)]"><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Bot size={17} /></div><div><h2 className="text-base font-bold">Ask Lulu AI</h2><p className="text-xs text-muted-foreground">Customer financial intelligence, ready when you are.</p></div></div><div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-card p-2 shadow-sm"><input value={question} onChange={event => setQuestion(event.target.value)} placeholder="Ask Lulu AI about customer finances..." className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground" aria-label="Ask Lulu AI about customer finances" /><button className="rounded-lg bg-primary p-2.5 text-primary-foreground hover:bg-primary" aria-label="Send question"><Send size={16} /></button></div><div className="mt-4 flex gap-2 overflow-x-auto pb-1">{prompts.map(prompt => <button key={prompt} onClick={() => setQuestion(prompt)} className="shrink-0 rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary">{prompt}</button>)}</div></section>
      </div></main>
  </div>;
}
void Users;
void CreditCard;
void FileText;
void Landmark;
void WalletCards;

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
  "label": "Website",
  "pages": [{
    "id": "lulu-website-portal-9012",
    "label": "Website"
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
            return <a key={page.id} {...pageLinkProps(page.id)} aria-current={isActivePage ? 'page' : undefined} className={`block rounded-md px-3 py-2 text-xs transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {page.label}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}
import { pageLinkProps } from '../../../../routing';
