import { useMemo, useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertCircle, AlertTriangle, ArrowDownToLine, ArrowUpRight, BarChart3, Bell, Bot, Building2, Check, ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign, Clock3, CreditCard, Download, Ellipsis, FileText, Filter, HelpCircle, Layers3, Menu, MoreHorizontal, PackageOpen, RefreshCw, Search, Settings, ShieldCheck, Sparkles, Wallet, X, XCircle, Zap, type LucideIcon } from 'lucide-react';
interface Payment {
  id: string;
  date: string;
  customer: string;
  invoice: string;
  amount: string;
  status: string;
  method: string;
  provider: string;
  fees: string;
  net: string;
  reference: string;
}
interface StatusStyle {
  icon: LucideIcon;
  className: string;
}
const payments: Payment[] = [{
  id: 'PAY-2026-00421',
  date: '10 Aug 2026',
  customer: 'Workspace customer',
  invoice: 'INV-2026-00124',
  amount: '4,850.00',
  status: 'Successful',
  method: 'Visa 4242',
  provider: 'Stripe',
  fees: '96.50',
  net: '4,753.50',
  reference: 'ch_masked'
}, {
  id: 'PAY-2026-00420',
  date: '10 Aug 2026',
  customer: 'TechNova Ltd',
  invoice: 'INV-2026-00123',
  amount: '1,200.00',
  status: 'Pending',
  method: 'Bank Transfer',
  provider: 'SEPA',
  fees: '—',
  net: '—',
  reference: 'REF_masked'
}, {
  id: 'PAY-2026-00419',
  date: '09 Aug 2026',
  customer: 'Global Retail AG',
  invoice: 'INV-2026-00122',
  amount: '7,320.00',
  status: 'Failed',
  method: 'Card',
  provider: 'PayPal',
  fees: '—',
  net: '—',
  reference: 'pp_masked'
}, {
  id: 'PAY-2026-00418',
  date: '09 Aug 2026',
  customer: 'Meridian Corp',
  invoice: 'INV-2026-00121',
  amount: '2,100.00',
  status: 'Refunded',
  method: 'Visa 1234',
  provider: 'Stripe',
  fees: '41.80',
  net: '—',
  reference: 'ch_masked'
}, {
  id: 'PAY-2026-00417',
  date: '08 Aug 2026',
  customer: 'Apex Solutions',
  invoice: 'INV-2026-00120',
  amount: '9,500.00',
  status: 'Successful',
  method: 'Bank Transfer',
  provider: 'SEPA',
  fees: '0.00',
  net: '9,500.00',
  reference: 'REF_masked'
}, {
  id: 'PAY-2026-00416',
  date: '08 Aug 2026',
  customer: 'Nova Systems',
  invoice: 'INV-2026-00119',
  amount: '3,600.00',
  status: 'Partially Refunded',
  method: 'PayPal',
  provider: 'PayPal',
  fees: '72.00',
  net: '3,450.00',
  reference: 'pp_masked'
}, {
  id: 'PAY-2026-00415',
  date: '07 Aug 2026',
  customer: 'Sunrise Tech',
  invoice: '—',
  amount: '650.00',
  status: 'Cancelled',
  method: 'Card',
  provider: 'Stripe',
  fees: '—',
  net: '—',
  reference: 'ch_masked'
}];
const kpis = [['Total Payments', '1,247', '+8.3%', 'Activity', 'violet'], ['Payment Volume', 'EUR 892,450', '+12.1%', 'CircleDollarSign', 'violet'], ['Successful', 'EUR 841,280', '+11.4%', 'Check', 'green'], ['Pending', 'EUR 23,640', '+0.2%', 'Clock3', 'amber'], ['Failed', 'EUR 18,730', '+9.1%', 'XCircle', 'red'], ['Refunded', 'EUR 8,800', '-3.2%', 'RefreshCw', 'orange'], ['Success Rate', '94.2%', '+0.8pp', 'ShieldCheck', 'green'], ['Processing Fees', 'EUR 12,490', '+11.8%', 'CreditCard', 'muted']];
const navFinance = ['Overview', 'Invoices', 'Offers & Quotes', 'Payments', 'Expenses', 'Income', 'Transactions', 'Payouts', 'Reconciliation', 'Banking'];
const methods = [['Card', '784', 'EUR 534,200', '96.1%', '21', '12', 'EUR 8,420'], ['Bank Transfer', '286', 'EUR 241,800', '99.3%', '2', '3', 'EUR 1,120'], ['PayPal', '132', 'EUR 91,450', '88.4%', '12', '18', 'EUR 2,740'], ['Wallet', '45', 'EUR 25,000', '93.3%', '3', '2', 'EUR 210']];
const customers = [['Workspace customer', '38', 'EUR 42,850', '1', '2', 'EUR 1,127', '10 Aug 2026'], ['Apex Solutions', '24', 'EUR 38,200', '0', '0', 'EUR 1,592', '08 Aug 2026'], ['Global Retail AG', '21', 'EUR 31,600', '3', '1', 'EUR 1,505', '09 Aug 2026'], ['Meridian Corp', '18', 'EUR 26,400', '0', '2', 'EUR 1,466', '09 Aug 2026'], ['TechNova Ltd', '16', 'EUR 22,100', '1', '0', 'EUR 1,381', '10 Aug 2026']];
const providerRows = [['Stripe', 'EUR 486,200', 'EUR 465,420', '8', '13', 'EUR 5,420', '95.8%'], ['SEPA', 'EUR 241,800', 'EUR 240,110', '2', '4', 'EUR 1,120', '99.3%'], ['PayPal', 'EUR 91,450', 'EUR 80,330', '12', '6', 'EUR 2,740', '88.4%']];
const chartPoints = [34, 42, 38, 55, 49, 62, 58, 72, 67, 78, 74, 88, 82, 91, 86, 96, 92, 100];
const statusStyles: Record<string, StatusStyle> = {
  Successful: {
    icon: Check,
    className: 'text-chart-4 bg-chart-4/10 border-chart-4/30'
  },
  Pending: {
    icon: Clock3,
    className: 'text-chart-1 bg-chart-1/10 border-chart-1/30'
  },
  Failed: {
    icon: XCircle,
    className: 'text-chart-5 bg-chart-5/10 border-chart-5/30'
  },
  Refunded: {
    icon: RefreshCw,
    className: 'text-chart-1 bg-chart-1/10 border-border'
  },
  'Partially Refunded': {
    icon: RefreshCw,
    className: 'text-foreground bg-chart-1/10 border-chart-1/30'
  },
  Cancelled: {
    icon: X,
    className: 'text-muted-foreground bg-secondary border-border'
  }
};
function StatusBadge({
  status
}: {
  status: string;
}) {
  const style = statusStyles[status] || statusStyles.Pending;
  const Icon = style.icon;
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold whitespace-nowrap ${style.className}`}><Icon size={12} strokeWidth={2.5} /><span>{status}</span></span>;
}
function SectionHeader({
  title,
  eyebrow,
  action
}: {
  title: string;
  eyebrow?: string;
  action?: string;
}) {
  return <header className="mb-4 flex items-end justify-between gap-3"><div>{eyebrow && <p className="mb-1 text-[11px] font-bold uppercase tracking-[.12em] text-foreground">{eyebrow}</p>}<h2 className="text-[15px] font-bold tracking-[-.01em] text-foreground">{title}</h2></div>{action && <button className="text-xs font-semibold text-foreground hover:text-foreground">{action} <ArrowUpRight className="ml-1 inline" size={13} /></button>}</header>;
}
export function PaymentsPage() {
  const [query, setQuery] = useState('');
  const [activeNav, setActiveNav] = useState('Payments');
  const [period, setPeriod] = useState('Daily');
  const { items: livePayments, loading: liveLoading, error: liveError } = useLiveRecords('finance_payments');
  const liveEmpty = !liveLoading && !liveError && livePayments.length === 0;
  const filtered = useMemo(() => payments.filter(p => `${p.id} ${p.customer} ${p.invoice}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <div className="min-h-screen bg-[var(--background)] text-foreground" style={{
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
  }}>
    <div className="flex min-h-screen">
      <aside className="hidden w-[220px] shrink-0 flex-col bg-[var(--sidebar)] text-foreground lg:flex">
        <div className="flex h-[72px] items-center gap-3 border-b border-border px-5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={17} /></div><span className="text-[17px] font-bold tracking-tight text-foreground">lulu<span className="text-foreground">.</span></span></div>
        <LuluSectionNavigation activeId="calm-tide-3752" />
        <div className="border-t border-border p-3"><button className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-secondary"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">JD</span><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-foreground">Workspace administrator</strong><span className="block text-[10px] text-muted-foreground">Administrator</span></span><Settings size={16} className="text-muted-foreground" /></button></div>
      </aside>
      <main className="min-w-0 flex-1 overflow-hidden">{liveLoading ? <div className="border-b border-border bg-secondary/30 px-5 py-3 text-xs text-muted-foreground">Loading live finance payments…</div> : liveError ? <div className="border-b border-destructive/30 bg-destructive/5 px-5 py-3 text-xs text-destructive">{liveError}</div> : liveEmpty ? <div className="border-b border-dashed border-border bg-card px-5 py-3 text-xs text-muted-foreground">No live finance payments are available yet. Connect your payment provider or record a payment to begin.</div> : null}<div className="mx-auto max-w-[1700px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-start justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground"><span>Finance</span><span>/</span><span className="text-foreground">Payments</span></div><h1 className="text-[28px] font-bold tracking-[-.035em] text-foreground">Payments</h1><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Monitor incoming payments, payment status and payment activity across your connected systems.</p></div><div className="hidden items-center gap-2 md:flex"><button className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm shadow-black/10 hover:bg-primary"><Sparkles size={15} /><span>Ask Lulu AI</span></button><button className="tool-btn"><Download size={15} /><span>Import</span></button><button className="tool-btn"><ArrowDownToLine size={15} /><span>Export</span></button><button className="tool-btn px-2"><MoreHorizontal size={17} /></button></div></div>
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1"><button className="select-btn"><span>Payment Source: <strong>All Sources</strong></span><ChevronDown size={14} /></button><button className="select-btn"><span>Date: <strong>Last 30 days</strong></span><ChevronDown size={14} /></button><button className="select-btn"><span>Comparison: <strong>Previous Period</strong></span><ChevronDown size={14} /></button><button className="select-btn"><span>Currency: <strong>EUR — Reporting</strong></span><ChevronDown size={14} /></button></div>
        <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">{kpis.map(([label, value, trend, icon, tone]) => {
              const icons: Record<string, LucideIcon> = {
                Activity,
                CircleDollarSign,
                Check,
                Clock3,
                XCircle,
                RefreshCw,
                ShieldCheck,
                CreditCard
              };
              const Icon = icons[icon];
              return <article key={label} className="rounded-xl border border-border/80 bg-card p-3.5 shadow-[0_2px_8px_rgba(0,0,0,.03)]"><div className="mb-3 flex items-center justify-between"><span className="text-[11px] font-semibold leading-4 text-muted-foreground">{label}</span><Icon size={16} className={tone === 'green' ? 'text-chart-4' : tone === 'amber' ? 'text-chart-1' : tone === 'red' ? 'text-chart-5' : tone === 'orange' ? 'text-chart-1' : tone === 'muted' ? 'text-muted-foreground' : 'text-foreground'} /></div><strong className="block whitespace-nowrap text-[18px] tracking-[-.03em] text-foreground">{value}</strong><span className={`mt-2 inline-flex rounded px-1.5 py-0.5 text-[10px] font-bold ${tone === 'red' ? 'bg-chart-5/10 text-chart-5' : tone === 'amber' ? 'bg-chart-1/10 text-chart-1' : tone === 'orange' ? 'bg-chart-1/10 text-chart-1' : tone === 'green' ? 'bg-chart-4/10 text-chart-4' : 'bg-secondary text-foreground'}`}>{trend}</span></article>;
            })}</section>
        <section className="mb-6 rounded-xl border border-border/80 bg-card shadow-[0_2px_8px_rgba(0,0,0,.03)]"><div className="flex flex-col gap-3 border-b border-border p-4 xl:flex-row xl:items-center"><div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search payments..." aria-label="Search payments" className="h-9 w-full rounded-lg border border-border bg-secondary pl-9 pr-9 text-xs outline-none transition focus:border-border focus:ring-2 focus:ring-ring" />{query && <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-3 top-2.5 text-foreground hover:text-foreground"><X size={15} /></button>}</div><div className="flex gap-2 overflow-x-auto"><button className="filter-chip"><span>Status: <b>All</b></span><ChevronDown size={13} /></button><button className="filter-chip"><span>Provider: <b>All</b></span><ChevronDown size={13} /></button><button className="filter-chip"><span>Method: <b>All</b></span><ChevronDown size={13} /></button>{['Customer', 'Invoice', 'Currency', 'Amount', 'Date'].map(x => <button key={x} className="filter-chip"><span>{x}</span><ChevronDown size={13} /></button>)}<button className="text-xs font-semibold text-foreground hover:text-foreground">Clear Filters</button><button className="rounded-lg border border-border px-3 py-2 text-xs font-bold text-foreground hover:bg-secondary">Save Filter</button></div></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[1250px] text-left text-xs"><thead className="bg-card/80 text-[10px] font-bold uppercase tracking-[.08em] text-muted-foreground"><tr>{['Payment', 'Date', 'Customer', 'Invoice', 'Amount', 'Currency', 'Status', 'Method', 'Provider', 'Fees', 'Net Amount', 'Reference', ''].map(h => <th key={h} className="whitespace-nowrap px-4 py-3">{h && <button className="inline-flex items-center gap-1 hover:text-foreground">{h}<ChevronDown size={11} /></button>}</th>)}</tr></thead><tbody className="divide-y divide-border">{filtered.map(p => <tr key={p.id} className="group hover:bg-secondary/30"><td className="px-4 py-3 font-bold text-foreground">{p.id}</td><td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.date}</td><td className="whitespace-nowrap px-4 py-3 font-semibold text-foreground">{p.customer}</td><td className="px-4 py-3 text-muted-foreground">{p.invoice}</td><td className="whitespace-nowrap px-4 py-3 font-bold text-foreground">EUR {p.amount}</td><td className="px-4 py-3 text-muted-foreground">EUR</td><td className="px-4 py-3"><StatusBadge status={p.status} /></td><td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.method}</td><td className="px-4 py-3 font-medium text-foreground">{p.provider}</td><td className="px-4 py-3 text-muted-foreground">{p.fees === '—' ? '—' : `EUR ${p.fees}`}</td><td className="px-4 py-3 font-semibold text-foreground">{p.net === '—' ? '—' : `EUR ${p.net}`}</td><td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{p.reference.replace('masked', '••••')}</td><td className="px-4 py-3"><button aria-label={`Actions for ${p.id}`} className="rounded p-1 text-foreground hover:bg-card hover:text-foreground"><Ellipsis size={16} /></button></td></tr>)}</tbody></table></div><footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground"><span>Showing 1–7 of 1,247</span><div className="flex items-center gap-1"><button className="page-btn"><ChevronLeft size={14} /></button><button className="page-btn active">1</button><button className="page-btn">2</button><button className="page-btn">3</button><span className="px-1">...</span><button className="page-btn">178</button><button className="page-btn"><ChevronRight size={14} /></button></div><span>Rows per page <strong className="text-foreground">25</strong> <ChevronDown className="ml-1 inline" size={12} /></span></footer></section>
        <div className="mb-6 grid gap-5 xl:grid-cols-[3fr_2fr]"><section className="panel"><SectionHeader title="Payment Performance" eyebrow="Overview" /><div className="mb-3 flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Payment Volume Over Time</p><strong className="text-2xl tracking-tight text-foreground">EUR 892,450</strong></div><div className="flex rounded-lg bg-secondary p-0.5">{['Daily', 'Weekly', 'Monthly'].map(x => <button key={x} onClick={() => setPeriod(x)} className={`rounded-md px-2.5 py-1.5 text-[11px] font-semibold ${period === x ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}>{x}</button>)}</div></div><div className="relative h-[175px] overflow-hidden rounded-lg border border-border bg-[var(--card)] px-2 pt-3"><div className="absolute inset-0 flex flex-col justify-between px-3 py-4">{['EUR 100k', 'EUR 75k', 'EUR 50k', 'EUR 25k', 'EUR 0'].map(x => <div key={x} className="border-t border-dashed border-border text-[9px] text-muted-foreground">{x}</div>)}</div><svg viewBox="0 0 700 150" className="relative h-full w-full" preserveAspectRatio="none" aria-label="Payment volume chart"><polyline points={chartPoints.map((v, i) => `${i * 42},${145 - v}`).join(' ')} fill="none" stroke="var(--chart-2)" strokeWidth="3" /><polyline points={chartPoints.map((v, i) => `${i * 42},${150 - v * .86}`).join(' ')} fill="none" stroke="var(--chart-4)" strokeWidth="2.5" /><polyline points={`0,145 ${chartPoints.map((v, i) => `${i * 42},${145 - v}`).join(' ')} 714,145`} fill="url(#area)" opacity=".22" /><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop stopColor="var(--primary)" /><stop offset="1" stopColor="var(--background)" stopOpacity="0" /></linearGradient></defs></svg></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{[['Total volume', 'EUR 892,450'], ['Successful', 'EUR 841,280'], ['Avg. payment', 'EUR 715.36'], ['vs previous', '+12.1%']].map(([a, b]) => <div key={a} className="rounded-lg bg-card px-3 py-2"><p className="text-[10px] text-muted-foreground">{a}</p><strong className="text-xs text-foreground">{b}</strong></div>)}</div></section><section className="panel"><SectionHeader title="Payment Method Performance" action="View report" /><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><th className="pb-3">Method</th><th className="pb-3">Count</th><th className="pb-3">Volume</th><th className="pb-3">Success rate</th><th className="pb-3">Failed</th><th className="pb-3">Refunds</th></tr></thead><tbody className="divide-y divide-border">{methods.map(r => <tr key={r[0]}><td className="py-3 font-semibold text-foreground">{r[0]}</td><td className="py-3 text-muted-foreground">{r[1]}</td><td className="py-3 whitespace-nowrap text-muted-foreground">{r[2]}</td><td className="py-3"><span className="font-semibold text-foreground">{r[3]}</span><div className="mt-1 h-1 w-16 rounded-full bg-secondary"><div className="h-1 rounded-full bg-primary text-primary-foreground" style={{
                            width: r[3]
                          }} /></div></td><td className="py-3 text-muted-foreground">{r[4]}</td><td className="py-3 text-muted-foreground">{r[5]}</td></tr>)}</tbody></table></div></section></div>
        <div className="mb-6 grid gap-5 xl:grid-cols-2"><section className="panel"><SectionHeader title="Provider Performance" action="Open provider" /><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-xs"><thead><tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">{['Provider', 'Volume', 'Successful', 'Failed', 'Pending', 'Refunds', 'Fees', 'Success rate', ''].map(x => <th key={x} className="pb-3">{x}</th>)}</tr></thead><tbody className="divide-y divide-border">{providerRows.map(r => <tr key={r[0]}><td className="py-3 font-bold text-foreground">{r[0]}</td>{r.slice(1).map((x, i) => <td key={`${r[0]}-${i}`} className={`py-3 ${i === 6 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{x}</td>)}<td className="py-3"><button className="text-foreground"><MoreHorizontal size={16} /></button></td></tr>)}</tbody></table></div></section><section className="panel"><SectionHeader title="Customer Payment Activity" action="View all" /><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-xs"><thead><tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">{['Customer', 'Count', 'Volume', 'Failed', 'Refunds', 'Avg.', 'Last Payment', ''].map(x => <th key={x} className="pb-3">{x}</th>)}</tr></thead><tbody className="divide-y divide-border">{customers.map(r => <tr key={r[0]}><td className="py-3 font-semibold text-foreground">{r[0]}</td>{r.slice(1).map((x, i) => <td key={`${r[0]}-${i}`} className="py-3 text-muted-foreground">{x}</td>)}<td className="py-3"><MoreHorizontal size={16} className="text-muted-foreground" /></td></tr>)}</tbody></table></div></section></div>
        <div className="mb-6 grid gap-5 xl:grid-cols-3">{[['Failed Payments', ['PAY-00419 · Global Retail AG · EUR 7,320', 'PAY-00409 · Horizon Works · EUR 2,410', 'PAY-00398 · Nova Systems · EUR 1,850'], 'View All'], ['Pending Payments', ['PAY-00420 · TechNova Ltd · EUR 1,200', 'PAY-00411 · Workspace customer · EUR 4,850', 'PAY-00402 · Northstar Inc · EUR 950'], 'View All'], ['Refund Activity', ['PAY-00418 · Meridian Corp · EUR 2,100', 'PAY-00416 · Nova Systems · EUR 150', 'PAY-00391 · Workspace customer · EUR 480'], 'View All']].map(([title, rows, action]) => <section key={title as string} className="panel"><SectionHeader title={title as string} action={action as string} /><div className="space-y-3">{(rows as string[]).map(r => <div key={r} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"><div className="min-w-0"><strong className="block truncate text-xs text-foreground">{r.split(' · ')[0]}</strong><span className="block truncate text-[11px] text-muted-foreground">{r.split(' · ')[1]}</span></div><span className="whitespace-nowrap text-xs font-bold text-foreground">{r.split(' · ')[2]}</span></div>)}</div><button className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-foreground"><span>{title === 'Failed Payments' ? 'Open Payment' : title === 'Pending Payments' ? 'Refresh Status' : 'Open Invoice'}</span><ArrowUpRight size={12} /></button></section>)}</div>
        <div className="mb-6 grid gap-5 xl:grid-cols-2"><section className="panel"><SectionHeader title="Payment Anomalies" eyebrow="AI monitoring" /><div className="space-y-3">{[['High', 'Unusual increase in failed payments', '+9.1% vs previous period', '5 min ago', 'red'], ['Medium', 'Elevated refund volume on PayPal', '+23% this week', '42 min ago', 'amber'], ['Medium', 'Provider performance degradation', 'Stripe latency above baseline', '1 hr ago', 'amber']].map(r => <article key={r[1]} className="rounded-lg border border-border p-3"><div className="flex gap-3"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${r[4] === 'red' ? 'bg-destructive' : 'bg-primary'}`} /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><strong className="text-xs text-foreground">{r[1]}</strong><span className="text-[10px] text-muted-foreground">{r[3]}</span></div><p className="mt-1 text-xs text-muted-foreground">{r[2]}</p><div className="mt-3 flex gap-2"><button className="rounded-md bg-secondary px-2 py-1 text-[10px] font-bold text-foreground">Investigate</button><button className="rounded-md border border-border px-2 py-1 text-[10px] font-bold text-foreground">Ask Lulu AI</button></div></div></div></article>)}</div></section><section className="panel"><SectionHeader title="Attention Required" /><div className="space-y-3">{[['Critical', 'High payment failure rate', '3 PayPal failures last hour', 'red'], ['Warning', 'Large pending payment volume', 'EUR 23,640 pending >48h', 'amber'], ['Info', 'Provider sync delay', 'SEPA — last sync 2h ago', 'blue']].map(r => <article key={r[1]} className="flex items-start gap-3 rounded-lg bg-card p-3"><div className={`rounded-lg p-2 ${r[3] === 'red' ? 'bg-chart-5/10 text-chart-5' : r[3] === 'amber' ? 'bg-chart-1/10 text-chart-1' : 'bg-secondary text-foreground'}`}>{r[3] === 'red' ? <AlertCircle size={16} /> : r[3] === 'amber' ? <AlertTriangle size={16} /> : <Bell size={16} />}</div><div><strong className="block text-xs text-foreground">{r[1]}</strong><span className="text-xs text-muted-foreground">{r[2]}</span></div><button className="ml-auto text-foreground"><MoreHorizontal size={16} /></button></article>)}</div></section></div>
        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_4px_18px_rgba(0,0,0,.08)]"><div className="flex items-center gap-2 bg-primary px-5 py-3.5 text-primary-foreground"><Sparkles size={17} /><h2 className="text-sm font-bold">Ask Lulu AI</h2><span className="ml-auto rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold">Payments intelligence</span></div><div className="grid gap-6 p-5 xl:grid-cols-[1.3fr_1fr]"><div><div className="relative"><Bot className="absolute left-3 top-3 text-muted-foreground" size={17} /><input aria-label="Ask Lulu AI about payments" placeholder="Ask Lulu AI about payments..." className="h-11 w-full rounded-lg border border-border bg-secondary/40 pl-10 pr-4 text-sm outline-none focus:border-border focus:ring-2 focus:ring-ring" /></div><p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Suggested prompts</p><div className="mt-2 flex flex-wrap gap-2">{['How are my payments performing?', 'Why are payment failures increasing?', 'Which provider performs best?', 'Which methods have highest success rate?', 'How much refunded this month?', 'Show pending payments.', 'Compare with last month.', 'Find unusual activity.'].map(x => <button key={x} className="rounded-full border border-border px-3 py-1.5 text-[11px] font-medium text-foreground hover:border-border hover:bg-secondary hover:text-foreground">{x}</button>)}</div></div><div className="space-y-3"><article className="rounded-lg border border-border border-l-4 border-l-border bg-card p-3.5"><div className="mb-1 flex items-center gap-2"><Sparkles size={14} className="text-foreground" /><strong className="text-xs text-foreground">AI Insight</strong></div><p className="text-xs leading-5 text-muted-foreground">Payment failures increased 9% vs previous period, most failed through PayPal.</p><div className="mt-3 flex flex-wrap gap-1.5">{['Failure count 18', 'Provider PayPal', 'Method Card', 'Comparison Previous 30 days'].map(x => <span key={x} className="rounded bg-secondary px-2 py-1 text-[10px] font-semibold text-foreground">{x}</span>)}</div><small className="mt-3 block text-[10px] text-muted-foreground">AI-generated · Not a verified financial statement.</small></article><article className="rounded-lg border border-border border-l-4 border-l-border bg-card p-3.5"><div className="mb-1 flex items-center gap-2"><Zap size={14} className="text-foreground" /><strong className="text-xs text-foreground">AI Recommendation</strong></div><p className="text-xs leading-5 text-muted-foreground">Review PayPal failure rate — 12 failures this month are unusual.</p><small className="mt-3 block text-[10px] text-muted-foreground">AI Recommendation · AI does not initiate financial transactions.</small></article></div></div></section>
      </div></main>
    </div>
    <style>{`.tool-btn{display:flex;align-items:center;gap:7px;border:1px solid var(--border);border-radius:8px;background:var(--card);padding:10px 12px;font-size:12px;font-weight:600;color:var(--muted-foreground)}.tool-btn:hover{border-color:var(--foreground);color:var(--foreground)}.select-btn{display:flex;align-items:center;gap:12px;white-space:nowrap;border:1px solid var(--border);border-radius:8px;background:var(--card);padding:9px 12px;font-size:11px;color:var(--muted-foreground)}.select-btn strong{color:var(--muted-foreground)}.filter-chip{display:flex;align-items:center;gap:7px;white-space:nowrap;border:1px solid var(--border);border-radius:8px;background:var(--card);padding:8px 10px;font-size:11px;color:var(--muted-foreground)}.filter-chip b{color:var(--muted-foreground)}.page-btn{display:flex;height:27px;min-width:27px;align-items:center;justify-content:center;border-radius:6px;color:var(--muted-foreground)}.page-btn:hover{background:var(--card);color:var(--foreground)}.page-btn.active{background:var(--primary);color:var(--primary-foreground)}.panel{border:1px solid var(--border);border-radius:12px;background:var(--card);padding:18px;box-shadow:0 2px 8px rgba(0,0,0,.03)}`}</style>
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
          <span data-lulu-section-soon={section.label !== "Website" ? "true" : undefined}>{section.label}</span>
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
