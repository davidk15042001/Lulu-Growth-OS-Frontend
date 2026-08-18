import { useMemo, useState } from 'react';
import { Ban, Bell, CalendarDays, Check, ChevronDown, Clock3, Download, Eye, FileText, Filter, FolderKanban, Gauge, LayoutDashboard, Lightbulb, MoreHorizontal, Pencil, Plus, Search, Send, Settings, Sparkles, Square, Tag, TrendingUp, Upload, Users, WalletCards, X, Zap } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type OfferStatus = 'Sent' | 'Viewed' | 'Accepted' | 'Expired' | 'Draft' | 'Converted' | 'Rejected' | 'Cancelled';
type Offer = {
  id: string;
  customer: string;
  created: string;
  valid: string;
  amount: string;
  currency: string;
  status: OfferStatus;
  source: string;
  updated: string;
};
const offers: Offer[] = [{
  id: 'OFF-2026-00124',
  customer: 'Connected customer',
  created: '10 Aug 2026',
  valid: '24 Aug 2026',
  amount: '12,500',
  currency: 'EUR',
  status: 'Sent',
  source: 'CRM',
  updated: '10 Aug 2026'
}, {
  id: 'OFF-2026-00123',
  customer: 'TechVision Ltd',
  created: '09 Aug 2026',
  valid: '23 Aug 2026',
  amount: '8,750',
  currency: 'EUR',
  status: 'Viewed',
  source: 'Manual',
  updated: '09 Aug 2026'
}, {
  id: 'OFF-2026-00122',
  customer: 'Nexus Solutions',
  created: '08 Aug 2026',
  valid: '29 Aug 2026',
  amount: '34,200',
  currency: 'EUR',
  status: 'Accepted',
  source: 'AI-assisted',
  updated: '09 Aug 2026'
}, {
  id: 'OFF-2026-00121',
  customer: 'GlobalTech SA',
  created: '07 Aug 2026',
  valid: '21 Aug 2026',
  amount: '5,400',
  currency: 'USD',
  status: 'Expired',
  source: 'CRM',
  updated: '07 Aug 2026'
}, {
  id: 'OFF-2026-00120',
  customer: 'Meridian Corp',
  created: '06 Aug 2026',
  valid: '20 Aug 2026',
  amount: '22,100',
  currency: 'EUR',
  status: 'Draft',
  source: 'Manual',
  updated: '06 Aug 2026'
}, {
  id: 'OFF-2026-00119',
  customer: 'Alpine Systems',
  created: '05 Aug 2026',
  valid: '19 Aug 2026',
  amount: '15,800',
  currency: 'EUR',
  status: 'Converted',
  source: 'Ecommerce',
  updated: '06 Aug 2026'
}, {
  id: 'OFF-2026-00118',
  customer: 'DataCore AG',
  created: '04 Aug 2026',
  valid: '18 Aug 2026',
  amount: '9,300',
  currency: 'CHF',
  status: 'Rejected',
  source: 'Manual',
  updated: '04 Aug 2026'
}, {
  id: 'OFF-2026-00117',
  customer: 'Vertex Partners',
  created: '03 Aug 2026',
  valid: '17 Aug 2026',
  amount: '6,700',
  currency: 'EUR',
  status: 'Cancelled',
  source: 'CRM',
  updated: '03 Aug 2026'
}];
const navMain = [{
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  label: 'AI Assistant',
  icon: Sparkles
}, {
  label: 'AI Agents',
  icon: Zap
}, {
  label: 'CRM',
  icon: Users
}, {
  label: 'Marketing',
  icon: Tag
}, {
  label: 'Advertising',
  icon: TrendingUp
}];
const financeNav = ['Overview', 'Offers & Quotes', 'Invoices', 'Payments', 'Expenses', 'Income', 'Reports'];
const periods = ['Today', 'Last 7 Days', 'Last 30 Days', 'Month to Date', 'Previous Month', 'Quarter to Date', 'Year to Date', 'Previous Year', 'Custom Range'];
const kpis = [{
  label: 'Total Offers',
  value: '147',
  detail: '↑ 12% vs prev period',
  tone: 'violet',
  icon: FileText
}, {
  label: 'Total Value',
  value: '€284,500',
  detail: '↑ 8% vs prev period',
  tone: 'violet',
  icon: WalletCards
}, {
  label: 'Accepted Value',
  value: '€118,200',
  detail: '↑ 15% vs prev period',
  tone: 'green',
  icon: Check
}, {
  label: 'Pending Value',
  value: '€89,300',
  detail: '34 offers',
  tone: 'amber',
  icon: Clock3
}, {
  label: 'Expired Value',
  value: '€41,800',
  detail: '↓ 4% vs prev period',
  tone: 'red',
  icon: CalendarDays
}, {
  label: 'Conversion Rate',
  value: '41.5%',
  detail: '↑ 3.2pp vs prev period',
  tone: 'violet',
  icon: Gauge
}];
const recommendations = [['Follow up on stalled offers', '4 offers sent over 7 days ago have no customer activity.', Bell], ['Contact before expiration', '6 offers expire within 7 days totaling €28,400.', Clock3], ['Review rejected offers', '3 recent rejections share similar pricing patterns.', Lightbulb]];
const statusIcons = {
  Draft: Pencil,
  Sent: Send,
  Viewed: Eye,
  Accepted: Check,
  Rejected: X,
  Expired: Clock3,
  Cancelled: Ban,
  Converted: Zap
};
const statusStyles = {
  Draft: 'bg-secondary text-muted-foreground',
  Sent: 'bg-secondary text-foreground',
  Viewed: 'bg-secondary text-foreground',
  Accepted: 'bg-secondary text-foreground',
  Rejected: 'bg-chart-5/10 text-chart-5',
  Expired: 'bg-secondary text-foreground',
  Cancelled: 'bg-secondary text-muted-foreground',
  Converted: 'bg-secondary text-foreground'
};
function StatusBadge({
  status
}: {
  status: OfferStatus;
}) {
  const Icon = statusIcons[status];
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[status]}`}><Icon size={12} strokeWidth={2.5} /><span>{status}</span></span>;
}
function Sparkline({
  tone = 'violet'
}: {
  tone?: string;
}) {
  const stroke = tone === 'green' ? 'var(--chart-4)' : tone === 'amber' ? 'var(--chart-1)' : tone === 'red' ? 'var(--chart-5)' : 'var(--chart-2)';
  return <svg width="74" height="27" viewBox="0 0 74 27" aria-label="Trend sparkline" role="img"><path d="M1 22 C10 21 10 17 18 18 S28 22 34 15 S42 17 49 11 S60 14 73 3" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" /></svg>;
}
function Sidebar() {
  return <aside className="sticky top-0 flex h-screen w-[244px] shrink-0 flex-col bg-[var(--background)] px-4 py-5 text-foreground">
    <div className="mb-9 flex items-center gap-3 px-2"><div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles size={18} /></div><strong className="text-[17px] tracking-tight text-foreground">Lulu<span className="text-foreground"> AI</span></strong></div>
    <LuluSectionNavigation activeId="tender-creek-3139" />
    <div className="mt-6"><p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[.14em] text-muted-foreground">Finance</p><button className="mb-1 flex w-full items-center gap-3 rounded-lg bg-secondary/20 px-3 py-2.5 text-left text-[13px] font-semibold text-foreground"><WalletCards size={17} /><span>Finance</span><ChevronDown className="ml-auto" size={14} /></button><div className="ml-4 border-l border-border pl-3">{financeNav.map(label => <button key={label} className={`flex w-full items-center rounded-md px-3 py-2 text-left text-[12px] transition-colors ${label === 'Offers & Quotes' ? 'bg-secondary font-semibold text-foreground' : 'text-foreground hover:text-foreground'}`}>{label}</button>)}</div></div>
    <div className="mt-auto border-t border-border pt-4"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] hover:bg-secondary hover:text-foreground"><Settings size={17} /><span>Settings</span></button><div className="mt-4 flex items-center gap-3 rounded-lg bg-secondary p-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">JD</div><div><p className="text-xs font-semibold text-foreground">Workspace owner</p><p className="text-[10px] text-muted-foreground">Admin account</p></div><MoreHorizontal className="ml-auto text-muted-foreground" size={16} /></div></div>
  </aside>;
}
export function LuluOffersQuotes() {
  const [selected, setSelected] = useState<string[]>([]);
  const [period, setPeriod] = useState('Last 30 Days');
  const [query, setQuery] = useState('');
  const { items: quoteRecords, loading: quotesLoading, error: quotesError } = useLiveRecords('finance_quotes');
  const getQuoteField = (record: typeof quoteRecords[number], key: string) => String((record as unknown as Record<string, unknown>)[key] ?? '');
  const liveOffers: Offer[] = quoteRecords.map(record => ({ id: getQuoteField(record, 'id') || getQuoteField(record, 'quoteNumber') || 'QUOTE', customer: getQuoteField(record, 'customer') || getQuoteField(record, 'customerName') || 'Workspace customer', created: getQuoteField(record, 'created') || record.createdAt || '—', valid: getQuoteField(record, 'valid') || getQuoteField(record, 'validUntil') || '—', amount: getQuoteField(record, 'amount') || '—', currency: getQuoteField(record, 'currency') || 'EUR', status: ['Sent', 'Viewed', 'Accepted', 'Expired', 'Draft', 'Converted', 'Rejected', 'Cancelled'].includes(getQuoteField(record, 'status')) ? getQuoteField(record, 'status') as OfferStatus : 'Draft', source: getQuoteField(record, 'source') || 'Backend', updated: getQuoteField(record, 'updated') || record.updatedAt || '—' }));
  const visibleOffers = useMemo(() => (quotesLoading ? [] : liveOffers).filter(offer => `${offer.id} ${offer.customer} ${offer.amount}`.toLowerCase().includes(query.toLowerCase())), [query, quotesLoading, quoteRecords]);
  const toggleOffer = (id: string) => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  return <div className="flex min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)]">
    <Sidebar />
    <main className="min-w-0 flex-1">
      <header className="border-b border-border bg-card px-8 py-5"><div className="flex items-start justify-between gap-6"><div><p className="mb-3 text-xs font-medium text-muted-foreground">Finance <span className="px-1.5">/</span> <span className="text-muted-foreground">Offers &amp; Quotes</span></p><h1 className="text-[27px] font-bold tracking-[-.03em] text-foreground">Offers &amp; Quotes</h1><p className="mt-1 text-[13px] text-muted-foreground">Create, manage and track commercial offers and quotations.</p></div><div className="flex items-center gap-2 pt-7"><button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm shadow-black/10 transition hover:bg-primary"><Plus size={16} /><span>Create Offer</span></button><button className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary"><Sparkles size={15} /><span>Ask Lulu AI</span></button><button className="rounded-lg px-3 py-2.5 text-xs font-medium text-foreground hover:bg-primary"><span>Import</span></button><button className="rounded-lg px-3 py-2.5 text-xs font-medium text-foreground hover:bg-primary"><span>Export</span></button><button aria-label="More actions" className="grid h-9 w-9 place-items-center rounded-lg border border-border text-foreground hover:bg-primary"><MoreHorizontal size={17} /></button></div></div></header>
      <div className="space-y-5 px-8 py-6">{quotesError && <div role="alert" className="rounded-lg border border-chart-5/30 bg-chart-5/10 px-4 py-3 text-sm text-chart-5">Offer data could not be loaded. Check finance quote records and try again.</div>}{!quotesLoading && !quotesError && liveOffers.length === 0 && <div className="rounded-lg border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground">No offer records are available yet.</div>}
        <section aria-label="Offer summary" className="grid grid-cols-6 gap-3">{kpis.map(({
            label,
            value,
            detail,
            tone,
            icon: Icon
          }) => <article key={label} className="rounded-xl border border-border bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,.03)]"><div className="flex items-center justify-between"><p className="text-[11px] font-semibold text-muted-foreground">{label}</p><span className={`grid h-7 w-7 place-items-center rounded-lg ${tone === 'green' ? 'bg-chart-4/10 text-chart-4' : tone === 'amber' ? 'bg-chart-1/10 text-chart-1' : tone === 'red' ? 'bg-chart-5/10 text-chart-5' : 'bg-secondary text-foreground'}`}><Icon size={14} /></span></div><p className="mt-3 text-[22px] font-bold tracking-tight text-foreground">{value}</p><div className="mt-2 flex items-end justify-between"><div><p className="text-[10px] text-muted-foreground">Last 30 Days</p><p className={`mt-1 text-[10px] font-semibold ${tone === 'green' ? 'text-chart-4' : tone === 'amber' ? 'text-chart-1' : tone === 'red' ? 'text-chart-5' : 'text-chart-2'}`}>{detail}</p></div><Sparkline tone={tone} /></div></article>)}</section>
        <section className="flex items-center justify-between gap-4 overflow-x-auto rounded-xl border border-border bg-card px-4 py-3"><div className="flex min-w-max items-center gap-1">{periods.map(item => <button key={item} onClick={() => setPeriod(item)} className={`rounded-md px-3 py-1.5 text-[11px] font-medium ${period === item ? 'bg-primary text-primary-foreground shadow-sm' : 'text-primary-foreground hover:bg-primary'}`}>{item}</button>)}</div><button className="flex min-w-max items-center gap-2 border-l border-border pl-5 text-[11px] font-semibold text-foreground">vs Previous Period <ChevronDown size={13} /></button></section>
        <section className="flex items-center gap-3"><div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><input value={query} onChange={event => setQuery(event.target.value)} className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-xs outline-none placeholder:text-muted-foreground focus:border-border focus:ring-2 focus:ring-ring" placeholder="Search offers by number, customer, reference, amount..." /></div>{['Status', 'Customer', 'Date', 'Expiration', 'Amount', 'Currency', 'Source'].map(filter => <button key={filter} className="flex h-10 shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[11px] font-medium text-foreground hover:border-border"><Filter size={12} className="text-muted-foreground" /><span>{filter}</span><ChevronDown size={12} className="text-muted-foreground" /></button>)}<button className="shrink-0 text-[11px] font-semibold text-foreground hover:text-foreground">Clear Filters</button><button className="shrink-0 text-[11px] font-semibold text-foreground hover:text-foreground">Save Filter</button></section>
        {selected.length > 0 && <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary px-4 py-2.5 text-xs text-foreground"><strong>{selected.length} selected</strong><span className="h-4 w-px bg-secondary" /><button className="inline-flex items-center gap-1.5"><Upload size={13} /><span>Export</span></button><button className="inline-flex items-center gap-1.5"><Download size={13} /><span>Download</span></button><button className="inline-flex items-center gap-1.5"><Send size={13} /><span>Send</span></button><button className="inline-flex items-center gap-1.5"><Ban size={13} /><span>Cancel</span></button><button className="ml-auto inline-flex items-center gap-1.5 font-semibold text-chart-5"><X size={13} /><span>Delete</span></button></div>}
        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_2px_8px_rgba(0,0,0,.03)]"><div className="overflow-x-auto"><table className="w-full min-w-[1040px] border-collapse text-left"><thead className="sticky top-0 z-10 bg-secondary"><tr className="border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground"><th className="w-10 px-4 py-3"><button aria-label="Select all offers" onClick={() => setSelected(selected.length === visibleOffers.length ? [] : visibleOffers.map(offer => offer.id))}><Square size={15} /></button></th>{['Offer #', 'Customer', 'Created', 'Valid Until', 'Amount', 'Currency', 'Status', 'Source', 'Updated', 'Actions'].map(heading => <th key={heading} className="px-3 py-3 font-bold">{heading}</th>)}</tr></thead><tbody>{visibleOffers.map(offer => <tr key={offer.id} className="border-b border-border text-[11px] transition-colors last:border-0 hover:bg-secondary/40"><td className="px-4 py-3.5"><button aria-label={`Select ${offer.id}`} onClick={() => toggleOffer(offer.id)} className={selected.includes(offer.id) ? 'text-foreground' : 'text-foreground'}>{selected.includes(offer.id) ? <Check size={15} /> : <Square size={15} />}</button></td><td className="whitespace-nowrap px-3 py-3.5 font-semibold text-foreground">{offer.id}</td><td className="whitespace-nowrap px-3 py-3.5 font-semibold text-foreground">{offer.customer}</td><td className="whitespace-nowrap px-3 py-3.5 text-muted-foreground">{offer.created}</td><td className="whitespace-nowrap px-3 py-3.5 text-muted-foreground">{offer.valid}</td><td className="whitespace-nowrap px-3 py-3.5 text-right font-semibold text-foreground">€{offer.amount}</td><td className="px-3 py-3.5 text-muted-foreground">{offer.currency}</td><td className="px-3 py-3.5"><StatusBadge status={offer.status} /></td><td className="px-3 py-3.5 text-muted-foreground">{offer.source}</td><td className="whitespace-nowrap px-3 py-3.5 text-muted-foreground">{offer.updated}</td><td className="px-3 py-3.5"><button aria-label={`Actions for ${offer.id}`} className="grid h-7 w-7 place-items-center rounded-md text-foreground hover:bg-primary hover:text-foreground"><MoreHorizontal size={16} /></button></td></tr>)}</tbody></table></div><footer className="flex items-center justify-between border-t border-border px-4 py-3 text-[11px] text-muted-foreground"><span>Showing {visibleOffers.length} live offers</span><div className="flex items-center gap-1"><button className="rounded border border-border px-2 py-1 text-foreground">‹</button><button className="rounded bg-primary px-2.5 py-1 font-semibold text-primary-foreground">1</button><button className="rounded border border-border px-2 py-1">2</button><button className="rounded border border-border px-2 py-1">3</button><button className="rounded border border-border px-2 py-1">›</button></div><span>Rows per page <strong className="ml-2 rounded border border-border px-2 py-1 font-medium text-foreground">25⌄</strong></span></footer></section>
        <section className="grid grid-cols-[2fr_3fr] gap-5 pb-8"><article className="rounded-xl border border-border bg-card shadow-[0_2px_8px_rgba(0,0,0,.03)]"><div className="border-b border-border bg-secondary/70 px-5 py-4"><div className="flex items-center gap-2 text-sm font-bold text-foreground"><Sparkles size={16} className="text-foreground" /><span>Ask Lulu AI</span></div><p className="mt-1 text-[11px] text-foreground">Your intelligent offer co-pilot</p></div><div className="space-y-4 p-5"><div className="rounded-lg border border-border bg-secondary/60 p-3.5"><div className="mb-1 flex items-center justify-between"><p className="text-[11px] font-bold text-foreground">AI Insight</p><span className="rounded bg-card px-2 py-1 text-[9px] font-semibold text-foreground">AI-generated</span></div><p className="text-[11px] leading-5 text-foreground">€42,000 in offers are currently awaiting customer response, with 6 offers expiring within the next 7 days.</p></div><div className="relative"><input className="h-10 w-full rounded-lg border border-border pl-3 pr-10 text-[11px] outline-none placeholder:text-muted-foreground focus:border-border focus:ring-2 focus:ring-ring" placeholder="Ask Lulu AI about your offers..." /><button aria-label="Send question" className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded bg-primary text-primary-foreground"><Send size={12} /></button></div><div className="flex flex-wrap gap-2">{['Which offers are waiting for a response?', 'Which offers are about to expire?', 'What is my conversion rate?', 'Find stalled offers', 'Draft a follow-up message', 'Compare this month with last month'].map(prompt => <button key={prompt} className="rounded-full border border-border px-2.5 py-1.5 text-left text-[10px] text-foreground hover:border-border hover:text-foreground">{prompt}</button>)}</div><div><p className="mb-2 text-[11px] font-bold text-foreground">AI Recommendations</p><div className="space-y-2">{recommendations.map(([title, text, Icon]) => {
                    const RecommendationIcon = Icon as typeof Bell;
                    return <div key={title as string} className="flex gap-3 rounded-lg border border-border p-3"><span className="mt-0.5 text-foreground"><RecommendationIcon size={15} /></span><div><div className="flex flex-wrap items-center gap-2"><p className="text-[11px] font-semibold text-foreground">{title as string}</p><span className="text-[9px] font-semibold text-foreground">AI Recommendation</span></div><p className="mt-1 text-[10px] leading-4 text-muted-foreground">{text as string}</p></div></div>;
                  })}</div></div></div></article>
          <article className="rounded-xl border border-border bg-card shadow-[0_2px_8px_rgba(0,0,0,.03)]"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 className="text-sm font-bold text-foreground">⏰ Expiring Soon</h2><p className="mt-1 text-[10px] text-muted-foreground">Offers requiring attention</p></div><div className="flex gap-1 rounded-lg bg-primary p-1 text-primary-foreground">{['3 days', '7 days', '14 days', 'Custom'].map(item => <button key={item} className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${item === '7 days' ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}>{item}</button>)}</div></div><div className="p-5"><table className="w-full text-left"><thead><tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><th className="pb-3">Offer</th><th className="pb-3">Customer</th><th className="pb-3">Amount</th><th className="pb-3">Expiration</th><th className="pb-3">Status</th><th className="pb-3 text-right">Actions</th></tr></thead><tbody>{[['OFF-2026-00121', 'GlobalTech SA', '€5,400', 'Expires in 2 days', 'Sent'], ['OFF-2026-00120', 'Meridian Corp', '€22,100', 'Expires in 3 days', 'Draft'], ['OFF-2026-00118', 'DataCore AG', '€9,300', 'Expires in 5 days', 'Viewed'], ['OFF-2026-00117', 'Vertex Partners', '€6,700', 'Expires in 7 days', 'Sent']].map(([id, customer, amount, expiration, status]) => <tr key={id} className="border-b border-border text-[10px] last:border-0"><td className="py-3 font-semibold text-foreground">{id}</td><td className="py-3 font-medium text-foreground">{customer}</td><td className="py-3 font-semibold text-foreground">{amount}</td><td className="py-3 text-foreground">{expiration}</td><td className="py-3"><StatusBadge status={status as OfferStatus} /></td><td className="py-3 text-right"><button className="font-semibold text-foreground hover:text-foreground">Send Reminder</button></td></tr>)}</tbody></table><div className="mt-6 border-t border-border pt-4"><div className="mb-2 flex items-center justify-between"><div><h3 className="text-[12px] font-bold text-foreground">Offer Value Over Time</h3><p className="mt-0.5 text-[10px] text-muted-foreground">30-day trend <span className="ml-1 rounded bg-secondary px-1.5 py-0.5 text-[9px]">Observed data</span></p></div><div className="flex gap-3 text-[10px] text-muted-foreground"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Offer Value</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-chart-4" />Accepted Value</span></div></div><svg viewBox="0 0 650 105" className="h-[105px] w-full" role="img" aria-label="Offer value and accepted value 30-day trend"><path d="M0 85 L40 70 L80 76 L120 57 L160 62 L200 45 L240 54 L280 39 L320 46 L360 27 L400 35 L440 20 L480 29 L520 14 L560 22 L600 8 L650 15 L650 105 L0 105Z" fill="var(--chart-2)" opacity=".08" /><path d="M0 85 L40 70 L80 76 L120 57 L160 62 L200 45 L240 54 L280 39 L320 46 L360 27 L400 35 L440 20 L480 29 L520 14 L560 22 L600 8 L650 15" fill="none" stroke="var(--chart-2)" strokeWidth="2.5" /><path d="M0 98 L40 91 L80 94 L120 83 L160 88 L200 76 L240 80 L280 69 L320 73 L360 60 L400 67 L440 54 L480 61 L520 45 L560 52 L600 39 L650 45" fill="none" stroke="var(--foreground)" strokeWidth="2" strokeDasharray="5 4" /></svg></div></div></article></section>
      </div>
    </main>
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
