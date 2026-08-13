import { useState, type ElementType } from 'react';
import { AlertTriangle, ArrowDownToLine, ArrowLeft, ArrowRight, Bot, CalendarClock, Check, CheckCircle, ChevronDown, CircleDollarSign, Clock3, CreditCard, Download, ExternalLink, Filter, MoreHorizontal, RefreshCw, Search, Settings2, Sparkles, TrendingUp, X, XCircle } from 'lucide-react';
type PayoutStatus = 'Completed' | 'Pending' | 'In Transit' | 'Delayed' | 'Failed';
type Reconciliation = 'Matched' | 'Unmatched' | 'Not Reviewed';
interface Payout {
  id: string;
  source: string;
  destination: string;
  created: string;
  expected: string;
  actual: string;
  gross: string;
  fees: string;
  net: string;
  status: PayoutStatus;
  reconciliation: Reconciliation;
}
const financeNav = ['Overview', 'Invoices', 'Offers & Quotes', 'Payments', 'Expenses', 'Income', 'Transactions', 'Payouts', 'Reconciliation', 'Banking'];
const payouts: Payout[] = [{
  id: 'PO-10482',
  source: 'Stripe',
  destination: 'Business Account',
  created: '08 Aug 2026',
  expected: '10 Aug 2026',
  actual: '10 Aug 2026',
  gross: 'EUR 12,500',
  fees: 'EUR 225',
  net: 'EUR 12,275',
  status: 'Completed',
  reconciliation: 'Matched'
}, {
  id: 'PO-10481',
  source: 'Shopify',
  destination: 'Business Account',
  created: '08 Aug 2026',
  expected: '11 Aug 2026',
  actual: '—',
  gross: 'EUR 8,340',
  fees: 'EUR 167',
  net: 'EUR 8,173',
  status: 'Pending',
  reconciliation: 'Not Reviewed'
}, {
  id: 'PO-10480',
  source: 'PayPal',
  destination: 'Business Account',
  created: '07 Aug 2026',
  expected: '09 Aug 2026',
  actual: '—',
  gross: 'EUR 4,190',
  fees: 'EUR 84',
  net: 'EUR 4,106',
  status: 'In Transit',
  reconciliation: 'Not Reviewed'
}, {
  id: 'PO-10479',
  source: 'Stripe',
  destination: 'Business Account',
  created: '07 Aug 2026',
  expected: '09 Aug 2026',
  actual: '11 Aug 2026',
  gross: 'EUR 15,600',
  fees: 'EUR 281',
  net: 'EUR 15,319',
  status: 'Delayed',
  reconciliation: 'Unmatched'
}, {
  id: 'PO-10478',
  source: 'Marketplace',
  destination: 'Business Account',
  created: '06 Aug 2026',
  expected: '08 Aug 2026',
  actual: '08 Aug 2026',
  gross: 'EUR 3,210',
  fees: 'EUR 64',
  net: 'EUR 3,146',
  status: 'Completed',
  reconciliation: 'Matched'
}, {
  id: 'PO-10477',
  source: 'PayPal',
  destination: 'Business Account',
  created: '06 Aug 2026',
  expected: '08 Aug 2026',
  actual: '—',
  gross: 'EUR 2,100',
  fees: '—',
  net: '—',
  status: 'Failed',
  reconciliation: 'Not Reviewed'
}, {
  id: 'PO-10476',
  source: 'Stripe',
  destination: 'Business Account',
  created: '05 Aug 2026',
  expected: '07 Aug 2026',
  actual: '07 Aug 2026',
  gross: 'EUR 18,920',
  fees: 'EUR 340',
  net: 'EUR 18,580',
  status: 'Completed',
  reconciliation: 'Matched'
}];
const kpis: Array<[string, string, string, string, ElementType]> = [['Total Payouts', 'EUR 248,450', '+14.2%', 'violet', CircleDollarSign], ['Completed', 'EUR 231,820', '+15.1%', 'green', CheckCircle], ['Pending', 'EUR 9,840', '+2.4%', 'amber', Clock3], ['Failed', 'EUR 3,190', '+8.6%', 'red', XCircle], ['Delayed', '4 payouts', '+1', 'orange', AlertTriangle], ['Total Fees', 'EUR 4,420', '+12.1%', 'slate', CreditCard], ['Net Payouts', 'EUR 244,030', '+14.0%', 'violet', TrendingUp], ['Expected Upcoming', 'EUR 38,500', 'Expected', 'blue', CalendarClock]];
const sourceRows = [['Stripe', 'EUR 136,420', 'EUR 2,420', 'EUR 134,000', '42', '1.5d'], ['Shopify', 'EUR 54,820', 'EUR 1,040', 'EUR 53,780', '28', '2.4d'], ['PayPal', 'EUR 38,210', 'EUR 810', 'EUR 37,400', '21', '2.1d'], ['Marketplace', 'EUR 14,600', 'EUR 280', 'EUR 14,320', '9', '3.1d'], ['Other', 'EUR 4,400', 'EUR 70', 'EUR 4,330', '5', '2.0d']];
const timing = [['Stripe', '1.5d', '42%'], ['PayPal', '2.1d', '58%'], ['Shopify', '2.4d', '67%'], ['Marketplace', '3.1d', '82%']];
const upcoming = [['Stripe', '12 Aug 2026', 'EUR 14,200', 'Business Account'], ['Shopify', '13 Aug 2026', 'EUR 8,340', 'Business Account'], ['PayPal', '14 Aug 2026', 'EUR 6,120', 'Business Account'], ['Marketplace', '15 Aug 2026', 'EUR 9,840', 'Reserve Account']];
const history = [['12 Aug 2026, 09:42', 'Sync completed', 'PO-10482', 'Stripe', 'System', 'Pending', 'Completed'], ['11 Aug 2026, 16:20', 'Status changed', 'PO-10479', 'Stripe', 'System', 'In Transit', 'Delayed'], ['10 Aug 2026, 12:08', 'Reconciliation matched', 'PO-10478', 'Marketplace', 'Jordan Davis', 'Unmatched', 'Matched'], ['10 Aug 2026, 08:30', 'Payout received', 'PO-10482', 'Stripe', 'System', '—', 'EUR 12,275'], ['09 Aug 2026, 17:45', 'Sync completed', 'PO-10480', 'PayPal', 'System', '—', 'In Transit']];
const statusClass = (value: string) => ({
  Completed: 'bg-chart-4/10 text-chart-4 border-chart-4/30',
  Pending: 'bg-chart-1/10 text-chart-1 border-chart-1/30',
  'In Transit': 'bg-secondary text-foreground border-border',
  Delayed: 'bg-chart-1/10 text-chart-1 border-chart-1/30',
  Failed: 'bg-chart-5/10 text-chart-5 border-chart-5/30',
  Matched: 'bg-secondary text-foreground border-border',
  Unmatched: 'bg-chart-5/10 text-chart-5 border-chart-5/30',
  'Not Reviewed': 'bg-secondary text-muted-foreground border-border'
})[value] || 'bg-secondary text-foreground border-border';
const Badge = ({
  children
}: {
  children: string;
}) => <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold whitespace-nowrap ${statusClass(children)}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{children}</span>;
const SectionHeader = ({
  eyebrow,
  title,
  icon
}: {
  eyebrow?: string;
  title: string;
  icon?: React.ElementType;
}) => {
  const Icon = icon;
  return <header className="mb-4 flex items-start justify-between"><div>{eyebrow && <p className="mb-1 text-[11px] font-bold uppercase tracking-[.12em] text-foreground">{eyebrow}</p>}<h2 className="text-[15px] font-bold tracking-[-.01em] text-foreground">{title}</h2></div>{Icon && <Icon className="h-5 w-5 text-foreground" />}</header>;
};
export const LuluPayouts = () => {
  const [activeNav, setActiveNav] = useState('Payouts');
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState('Last 30 Days');
  const filtered = payouts.filter(p => `${p.id} ${p.source} ${p.status}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="min-h-screen bg-[var(--background)] font-sans text-foreground">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[220px] flex-col bg-[var(--sidebar)] text-foreground lg:flex"><div className="flex h-[70px] items-center gap-2 px-6 text-foreground"><Sparkles className="h-6 w-6 text-foreground" fill="currentColor" /><span className="text-xl font-bold tracking-[-.06em]">lulu.</span></div><div className="px-3"><p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">Workspace</p><button className="mb-6 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium hover:bg-secondary"><div className="grid h-7 w-7 place-items-center rounded-md bg-secondary/20 text-foreground">JD</div><span>Jordan Davis</span><ChevronDown className="ml-auto h-3.5 w-3.5" /></button><p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">Finance</p><LuluSectionNavigation activeId="lucky-park-8649" /></div><div className="mt-auto border-t border-border p-5"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">JD</div><div><p className="text-xs font-semibold text-foreground">Jordan Davis</p><p className="text-[11px] text-muted-foreground">Administrator</p></div><Settings2 className="ml-auto h-4 w-4 text-muted-foreground" /></div></div></aside>
    <main className="lg:ml-[220px]"><div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 xl:px-10">
      <header className="mb-6 flex flex-col gap-5 border-b border-border/80 pb-6 xl:flex-row xl:items-end xl:justify-between"><div><p className="mb-3 text-xs font-medium text-muted-foreground">Finance <span className="px-1 text-foreground">/</span> <span className="text-foreground">Payouts</span></p><h1 className="text-[28px] font-bold tracking-[-.035em] text-foreground">Payouts</h1><p className="mt-1 text-sm text-muted-foreground">Monitor incoming payouts from connected platforms and payment providers.</p></div><div className="flex flex-wrap gap-2"><button className="tool-btn !border-0 !bg-primary !text-primary-foreground shadow-sm shadow-black/10 hover:!bg-primary"><RefreshCw className="h-3.5 w-3.5" />Sync Payouts</button><button className="tool-btn"><Sparkles className="h-3.5 w-3.5 text-foreground" />Ask Lulu AI</button><button className="tool-btn"><Download className="h-3.5 w-3.5" />Export</button><button className="tool-btn px-2.5"><MoreHorizontal className="h-4 w-4" /></button></div></header>
      <div className="mb-5 flex flex-wrap gap-2"><button className="select-btn" onClick={() => setPeriod(period === 'Last 30 Days' ? 'This Quarter' : 'Last 30 Days')}><span>Date:</span><strong>{period}</strong><ChevronDown className="h-3 w-3" /></button>{['Source: All Sources', 'Destination: All Accounts', 'Status: All', 'Reconciliation: All'].map(item => <button key={item} className="select-btn"><span>{item.split(':')[0]}:</span><strong>{item.split(': ')[1]}</strong><ChevronDown className="h-3 w-3" /></button>)}</div>
      <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">{kpis.map(([label, value, change, color, Icon]) => <article key={label} className="rounded-xl border border-border/80 bg-card p-3.5 shadow-[0_2px_8px_rgba(0,0,0,.03)]"><div className="mb-3 flex items-center justify-between"><span className={`grid h-8 w-8 place-items-center rounded-lg bg-${color}-50 text-${color}-600`}><Icon className="h-4 w-4" /></span>{label === 'Expected Upcoming' ? <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-foreground">Expected</span> : <span className="text-[10px] font-semibold text-foreground">{change}</span>}</div><p className="text-[11px] font-medium text-muted-foreground">{label}</p><p className="mt-1 text-[17px] font-bold tracking-[-.03em] text-foreground">{value}</p></article>)}</section>
      <section className="panel mb-6 overflow-hidden !p-0"><div className="flex flex-col gap-3 border-b border-border p-[18px] sm:flex-row sm:items-center sm:justify-between"><div><p className="mb-1 text-[11px] font-bold uppercase tracking-[.12em] text-foreground">Monitoring</p><h2 className="text-[15px] font-bold text-foreground">Payout List <span className="ml-1 text-xs font-medium text-muted-foreground">312 total</span></h2></div><div className="relative w-full sm:w-64"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search payouts..." className="h-9 w-full rounded-lg border border-border pl-9 pr-8 text-xs outline-none focus:border-border focus:ring-2 focus:ring-ring" />{query && <button onClick={() => setQuery('')} className="absolute right-2 top-2"><X className="h-4 w-4 text-muted-foreground" /></button>}</div></div><div className="flex flex-wrap gap-2 border-b border-border p-3"><button className="filter-chip"><Filter className="h-3 w-3" /><b>Status</b><ChevronDown className="h-3 w-3" /></button>{['Source', 'Destination', 'Date', 'Reconciliation', 'Amount'].map(item => <button key={item} className="filter-chip"><b>{item}</b><ChevronDown className="h-3 w-3" /></button>)}<button className="px-2 text-[11px] font-semibold text-foreground hover:text-foreground">Clear Filters</button><button className="ml-auto tool-btn !py-2"><Check className="h-3.5 w-3.5" />Save Filter</button></div><div className="overflow-x-auto"><table className="w-full min-w-[1400px] text-left"><thead className="bg-card/80 text-[10px] font-bold uppercase tracking-[.08em] text-muted-foreground"><tr>{['Payout ID', 'Source', 'Destination', 'Created', 'Expected Date', 'Actual Date', 'Gross Amount', 'Fees', 'Net Amount', 'Status', 'Reconciliation', 'Actions'].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{filtered.map(p => <tr key={p.id} className="hover:bg-secondary/30"><td className="px-4 py-3 text-xs font-bold text-foreground">{p.id}</td><td className="px-4 py-3 text-xs font-semibold text-foreground">{p.source}</td><td className="px-4 py-3 text-xs text-muted-foreground">{p.destination}</td><td className="px-4 py-3 text-xs text-muted-foreground">{p.created}</td><td className="px-4 py-3 text-xs text-muted-foreground">{p.expected}</td><td className="px-4 py-3 text-xs text-muted-foreground">{p.actual}</td><td className="px-4 py-3 text-xs font-semibold text-foreground">{p.gross}</td><td className="px-4 py-3 text-xs text-muted-foreground">{p.fees}</td><td className="px-4 py-3 text-xs font-semibold text-foreground">{p.net}</td><td className="px-4 py-3"><Badge>{p.status}</Badge></td><td className="px-4 py-3"><Badge>{p.reconciliation}</Badge></td><td className="px-4 py-3"><button aria-label={`Actions for ${p.id}`} className="rounded p-1 hover:bg-secondary"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button></td></tr>)}</tbody></table></div><footer className="flex flex-wrap items-center justify-between gap-3 p-3 text-[11px] text-muted-foreground"><span>Showing 1–7 of 312</span><div className="flex items-center gap-1"><button className="page-btn"><ArrowLeft className="h-3 w-3" /></button><button className="page-btn active">1</button><button className="page-btn">2</button><button className="page-btn">3</button><span className="px-1">...</span><button className="page-btn">45</button><button className="page-btn"><ArrowRight className="h-3 w-3" /></button></div><span>Rows per page <strong className="ml-1 text-foreground">25 <ChevronDown className="inline h-3 w-3" /></strong></span></footer></section>
      <div className="grid gap-6 xl:grid-cols-[3fr_2fr]"><section className="panel"><SectionHeader eyebrow="Analysis" title="Expected vs Actual Payouts" /><div className="mb-4 grid grid-cols-3 divide-x rounded-lg bg-card px-3 py-3 text-xs"><div><p className="text-muted-foreground">Expected</p><strong>EUR 248,450</strong></div><div className="pl-3"><p className="text-muted-foreground">Actual</p><strong>EUR 231,820</strong></div><div className="pl-3"><p className="text-muted-foreground">Difference</p><strong className="text-chart-5">−EUR 16,630</strong></div></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-xs"><thead className="text-[10px] uppercase tracking-[.08em] text-muted-foreground"><tr>{['Payout', 'Expected Date', 'Expected Amt', 'Actual Date', 'Actual Amt', 'Difference', 'Status'].map(h => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{[['PO-10479', '09 Aug', 'EUR 15,600', '11 Aug', 'EUR 15,319', '−EUR 281', 'Delayed'], ['PO-10482', '10 Aug', 'EUR 12,500', '10 Aug', 'EUR 12,275', '−EUR 225', 'Matched'], ['PO-10478', '08 Aug', 'EUR 3,210', '08 Aug', 'EUR 3,146', '−EUR 64', 'Matched'], ['PO-10476', '07 Aug', 'EUR 18,920', '07 Aug', 'EUR 18,580', '−EUR 340', 'Matched'], ['PO-10474', '06 Aug', 'EUR 12,200', '07 Aug', 'EUR 12,200', 'EUR 0', 'Matched']].map(r => <tr key={r[0]}><td className="px-2 py-2.5 font-bold text-foreground">{r[0]}</td>{r.slice(1, 5).map((v, i) => <td key={`${r[0]}-${i}`} className="px-2 py-2.5 text-muted-foreground">{v}</td>)}<td className={`px-2 py-2.5 font-semibold ${r[5].startsWith('−') ? 'text-chart-5' : 'text-foreground'}`}>{r[5]}</td><td className="px-2 py-2.5"><Badge>{r[6]}</Badge></td></tr>)}</tbody></table></div><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-foreground">Processing fee</span><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-foreground">Settlement timing</span><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-foreground">Provider variance</span></div></section><section className="panel"><SectionHeader eyebrow="Analysis" title="Payout Timing" /><div className="mb-5 grid grid-cols-2 gap-3">{[['Avg Settlement', '1.8 days'], ['Expected Settlement', '2.0 days'], ['Delayed Payouts', '4'], ['Avg Delay', '+2.3 days']].map(([a, b]) => <div key={a} className="rounded-lg bg-card p-3"><p className="text-[11px] text-muted-foreground">{a}</p><strong className={`mt-1 block text-lg ${a === 'Avg Delay' ? 'text-chart-1' : 'text-foreground'}`}>{b}</strong></div>)}</div><div className="space-y-4">{timing.map(([provider, days, width]) => <div key={provider} className="flex items-center gap-3 text-xs"><span className="w-20 font-semibold text-muted-foreground">{provider}</span><div className="h-2 flex-1 rounded-full bg-secondary"><div className="h-2 rounded-full bg-primary text-primary-foreground" style={{
                    width
                  }} /></div><strong className="w-8 text-right text-foreground">{days}</strong></div>)}</div></section></div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2"><section className="panel"><SectionHeader eyebrow="Sources" title="Payouts by Source" /><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-xs"><thead className="table-head"><tr>{['Source', 'Gross', 'Fees', 'Net', 'Count', 'Avg Payout'].map(h => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{sourceRows.map(r => <tr key={r[0]} className="hover:bg-secondary/30"><td className="px-2 py-3 font-semibold"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />{r[0]}</td>{r.slice(1).map((v, i) => <td key={`${r[0]}-${i}`} className="px-2 py-3 text-muted-foreground">{v}</td>)}</tr>)}</tbody></table></div></section><section className="panel"><SectionHeader eyebrow="Destinations" title="Payouts by Destination" /><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-xs"><thead className="table-head"><tr>{['Account', 'Provider', 'Count', 'Gross', 'Fees', 'Net', 'Last Payout', 'Actions'].map(h => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{[['Business Account (Main)', 'Stripe', '42', 'EUR 136,420', 'EUR 2,420', 'EUR 134,000', '10 Aug'], ['Business Account (USD)', 'PayPal', '18', 'EUR 38,210', 'EUR 810', 'EUR 37,400', '09 Aug'], ['Reserve Account', 'Marketplace', '9', 'EUR 14,600', 'EUR 280', 'EUR 14,320', '08 Aug']].map(r => <tr key={r[0]} className="hover:bg-secondary/30">{r.map((v, i) => <td key={`${r[0]}-${i}`} className={`px-2 py-3 ${i === 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{v}</td>)}<td className="px-2 py-3"><button className="text-[11px] font-bold text-foreground hover:text-foreground">Open Account</button></td></tr>)}</tbody></table></div></section></div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2"><section className="panel"><SectionHeader eyebrow="Expected" title="Upcoming Payouts" icon={CalendarClock} /><div className="space-y-1">{upcoming.map(r => <div key={r[0] + r[1]} className="grid grid-cols-[1fr_1fr_1.2fr_1fr_auto] items-center gap-3 border-b border-border py-3 text-xs last:border-0"><strong>{r[0]}</strong><span className="text-muted-foreground">{r[1]}</span><span><b className="block text-foreground">{r[2]}</b><em className="not-italic text-[10px] font-semibold text-foreground">Expected</em></span><span className="text-muted-foreground">{r[3]}</span><Badge>Pending</Badge></div>)}</div></section><section className="panel"><SectionHeader eyebrow="Attention required" title="Delayed Payouts" icon={AlertTriangle} /><div className="space-y-2">{[['PO-10479', 'Stripe', '09 Aug 2026', '+2 days', 'EUR 15,600'], ['PO-10474', 'Stripe', '10 Aug 2026', '+1 day', 'EUR 12,200'], ['PO-10469', 'Stripe', '08 Aug 2026', '+3 days', 'EUR 8,220'], ['PO-10461', 'PayPal', '07 Aug 2026', '+2 days', 'EUR 4,190']].map(r => <div key={r[0]} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 p-3"><div><p className="text-xs font-bold text-foreground">{r[0]} <span className="font-normal text-muted-foreground">· {r[1]}</span></p><p className="mt-1 text-[11px] text-muted-foreground">Expected {r[2]} · <strong className="text-chart-1">{r[3]}</strong></p></div><div className="text-right"><b className="text-xs text-foreground">{r[4]}</b><button className="mt-1 block text-[10px] font-bold text-foreground">Investigate</button></div></div>)}</div></section></div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[3fr_2fr]"><section className="panel"><SectionHeader eyebrow="Exceptions" title="Payout Discrepancies" /><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-xs"><thead className="table-head"><tr>{['Payout', 'Issue', 'Amount Diff', 'Detected', 'Status', 'Actions'].map(h => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{[['PO-10479', 'Expected amount differs', '−EUR 281', '11 Aug', 'High'], ['PO-10474', 'Partial payout received', '−EUR 120', '10 Aug', 'Medium'], ['PO-10469', 'Settlement date mismatch', '+2 days', '09 Aug', 'Medium']].map(r => <tr key={r[0]}><td className="px-2 py-3 font-bold text-foreground">{r[0]}</td><td className="px-2 py-3 text-muted-foreground">{r[1]}</td><td className="px-2 py-3 font-semibold text-chart-5">{r[2]}</td><td className="px-2 py-3 text-muted-foreground">{r[3]}</td><td className="px-2 py-3"><span className="rounded-full bg-chart-5/10 px-2 py-1 text-[10px] font-bold text-chart-5">{r[4]}</span></td><td className="px-2 py-3"><button className="text-[10px] font-bold text-foreground">Investigate</button><button className="ml-2 text-[10px] font-bold text-foreground">Open Reconciliation</button></td></tr>)}</tbody></table></div></section><section className="panel"><SectionHeader eyebrow="Monitoring" title="Payout Alerts" />{[['red', 'Payout delayed', 'PO-10479 exceeded expected settlement by 2 days'], ['amber', 'Reconciliation mismatch', 'PO-10479 is unmatched'], ['blue', 'Expected payout approaching', 'EUR 8,340 expected from Shopify on 11 Aug']].map(r => <article key={r[1]} className="mb-3 rounded-lg border border-border p-3 last:mb-0"><div className="flex gap-2"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full bg-${r[0]}-500`} /><div><p className="text-xs font-bold text-foreground">{r[1]}</p><p className="mt-1 text-[11px] text-muted-foreground">{r[2]}</p><div className="mt-2 flex gap-3 text-[10px] font-bold text-foreground"><button>Open</button><button>Investigate</button><button>Ask Lulu AI</button></div></div></div></article>)}</section></div>
      <section className="panel mt-6"><SectionHeader eyebrow="Audit Trail" title="Payout History" /><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-xs"><thead className="table-head"><tr>{['Date', 'Event', 'Payout', 'Source', 'User/System', 'Previous Value', 'New Value'].map(h => <th key={h} className="px-2 py-2">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{history.map(r => <tr key={r.join('-')} className="hover:bg-secondary/30">{r.map((v, i) => <td key={`${r[0]}-${i}`} className={`px-2 py-3 ${i === 1 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{v}</td>)}</tr>)}</tbody></table></div></section>
      <div className="mt-6 grid gap-6 xl:grid-cols-2"><section className="panel border-l-4 border-l-border"><SectionHeader eyebrow="AI Monitoring" title="AI Insights" />{[['Three payouts from Stripe are currently delayed beyond their recorded expected settlement dates. Total affected: EUR 36,020.', 'PO-10479 · EUR 15,600 · Delayed 2 days', 'PO-10474 · EUR 12,200 · Delayed 1 day', 'PO-10469 · EUR 8,220 · Delayed 3 days'], ['Payout fees from PayPal this period are 1.8x higher than the previous 30-day average.']].map((r, i) => <article key={r[0]} className="mb-4 last:mb-0"><p className="text-xs leading-5 text-foreground">{r[0]}</p>{r.slice(1).map(tag => <span key={tag} className="mr-1 mt-2 inline-block rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-foreground">{tag}</span>)}</article>)}<p className="mt-5 text-[10px] text-muted-foreground">AI-generated · Not a verified financial statement.</p></section><section className="panel"><SectionHeader eyebrow="AI Monitoring" title="AI Recommendations" />{[['Review 4 delayed payouts', 'total EUR 36,020 pending beyond settlement'], ['Reconcile 1 unmatched payout', 'PO-10479 · EUR 15,600'], ['Check PayPal payout fees', 'unusually high this period']].map(r => <article key={r[0]} className="mb-3 flex items-center justify-between gap-3 rounded-lg border-l-4 border-l-chart-1 bg-secondary/50 p-3"><div><p className="text-xs font-bold text-foreground">{r[0]}</p><p className="mt-1 text-[11px] text-muted-foreground">{r[1]}</p></div><button className="shrink-0 rounded-md bg-card px-2.5 py-1.5 text-[10px] font-bold text-foreground shadow-sm">Investigate</button></article>)}<p className="mt-4 text-[10px] text-muted-foreground">AI Recommendation · AI does not initiate transfers or modify payout settings.</p></section></div>
      <section className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-[0_2px_8px_rgba(0,0,0,.03)]"><div className="flex items-center gap-2 bg-primary px-5 py-3.5 text-primary-foreground"><Sparkles className="h-4 w-4" fill="currentColor" /><h2 className="text-sm font-bold">Ask Lulu AI</h2><span className="ml-auto rounded-full bg-secondary/60 px-2.5 py-1 text-[10px] font-semibold">Payouts intelligence</span></div><div className="grid gap-5 p-5 xl:grid-cols-[1fr_320px]"><div><div className="flex rounded-lg border border-border bg-card"><Bot className="m-3 h-4 w-4 text-muted-foreground" /><input aria-label="Ask Lulu AI about your payouts" placeholder="Ask Lulu AI about your payouts..." className="w-full text-xs outline-none" /></div><div className="mt-4 flex flex-wrap gap-2">{['What payouts are pending?', 'Which payouts are delayed?', 'What payouts are expected this week?', 'Why is a payout different from expected?', 'Which providers have highest fees?', 'How much paid out this month?', 'Which payouts are unmatched?', 'Are any expected payouts missing?'].map(prompt => <button key={prompt} className="rounded-full border border-border bg-secondary px-3 py-2 text-[10px] font-semibold text-foreground hover:bg-secondary">{prompt}</button>)}</div><p className="mt-4 text-[10px] text-muted-foreground">AI-generated · Not a verified financial statement.</p></div><div className="space-y-3"><article className="rounded-lg border border-border bg-secondary/50 p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-foreground">AI Insight</p><p className="mt-1 text-xs leading-5 text-foreground">Stripe delays represent 61% of your current delayed payout value.</p></article><article className="rounded-lg border border-border bg-secondary p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-chart-1">AI Recommendation</p><p className="mt-1 text-xs leading-5 text-foreground">Review PO-10479 before the next reconciliation run.</p></article></div></div></section>
    </div></main><style>{`.tool-btn{display:flex;align-items:center;gap:7px;border:1px solid var(--border);border-radius:8px;background:var(--card);padding:10px 12px;font-size:12px;font-weight:600;color:var(--muted-foreground)}.tool-btn:hover{border-color:var(--foreground);color:var(--foreground)}.select-btn{display:flex;align-items:center;gap:12px;white-space:nowrap;border:1px solid var(--border);border-radius:8px;background:var(--card);padding:9px 12px;font-size:11px;color:var(--muted-foreground)}.select-btn strong{color:var(--muted-foreground)}.filter-chip{display:flex;align-items:center;gap:7px;white-space:nowrap;border:1px solid var(--border);border-radius:8px;background:var(--card);padding:8px 10px;font-size:11px;color:var(--muted-foreground)}.filter-chip b{color:var(--muted-foreground)}.page-btn{display:flex;height:27px;min-width:27px;align-items:center;justify-content:center;border-radius:6px;color:var(--muted-foreground)}.page-btn:hover{background:var(--card);color:var(--foreground)}.page-btn.active{background:var(--primary);color:var(--primary-foreground)}.panel{border:1px solid var(--border);border-radius:12px;background:var(--card);padding:18px;box-shadow:0 2px 8px rgba(0,0,0,.03)}.table-head{background:rgba(0,0,0,.8);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted-foreground)}`}</style></div>;
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
  }, {
    "id": "nicely-land-1864",
    "label": "Settings"
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
            return <a key={page.id} href={`#${page.id}`} aria-current={isActivePage ? 'page' : undefined} className={`block rounded-md px-3 py-2 text-xs transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {page.label}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}