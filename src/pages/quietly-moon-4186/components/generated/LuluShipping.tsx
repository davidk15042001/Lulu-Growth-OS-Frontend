import { useMemo, useState } from 'react';
import { AlertCircle, AlertTriangle, ArrowUpDown, BarChart3, CheckCircle2, ChevronDown, ChevronRight, ChevronUp, Clock3, Download, FileText, LayoutDashboard, MoreHorizontal, Package, PackageCheck, PackageX, RotateCcw, Search, Settings, ShoppingBag, SlidersHorizontal, Sparkles, Truck, Users, X, XCircle, Megaphone, TrendingUp, Send, ExternalLink } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
const shipments: Array<Record<string, any>> = [];
const attention = [['SHP-10501', 'Failed delivery attempt - address issue', 'DHL', 'Connected store', 'Critical', '1 hour ago', 'red'], ['SHP-10488', 'Carrier exception - customs hold', 'FedEx', 'Connected store', 'High', '3 hours ago', 'orange'], ['SHP-10476', 'Long delay - last update 6 days ago', 'DPD', 'Connected store', 'High', '6 days ago', 'orange'], ['SHP-10465', 'Missing tracking information', 'Unknown', 'Connected store', 'Medium', '2 days ago', 'amber'], ['SHP-10451', 'Shipment returned to sender', 'UPS', 'Connected store', 'High', '1 day ago', 'orange']];
const delayed = [['SHP-10488', 'Priya Patel', 'Connected store', 'FedEx', 'FX-135792468', '4 Aug'], ['SHP-10476', 'David Lee', 'Connected store', 'DPD', 'DPD-112233', '4 Aug ago'], ['SHP-10463', 'Lisa Brown', 'Connected store', 'UPS', '1Z-888BB20', '5 Aug'], ['SHP-10449', 'Tom Green', 'Connected store', 'DHL', 'DE-654321', '3 Aug']];
const failed: any[][] = [];
const nav = [LayoutDashboard, Sparkles, Users, Megaphone, TrendingUp, ShoppingBag, BarChart3, FileText, Settings];
const statusIcons: Record<string, typeof CheckCircle2> = {
  Delivered: CheckCircle2,
  Failed: XCircle,
  Delayed: Clock3,
  'Out for Delivery': Truck,
  Returned: RotateCcw
};
const toneClasses: Record<string, string> = {
  blue: 'bg-secondary text-foreground',
  emerald: 'bg-secondary text-foreground',
  red: 'bg-chart-5/10 text-chart-5',
  amber: 'bg-chart-1/10 text-chart-1',
  teal: 'bg-secondary text-foreground',
  gray: 'bg-secondary text-muted-foreground',
  sky: 'bg-secondary text-foreground',
  slate: 'bg-secondary text-muted-foreground'
};
export const LuluShipping = () => {
  const [search, setSearch] = useState('');
  const [attentionOpen, setAttentionOpen] = useState(true);
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [store, setStore] = useState('All Stores');
  const [date, setDate] = useState('Last 30 Days');
  const { items: shippingRecords, loading, error, refresh: refreshShipping } = useLiveRecords('ecommerce_shipping');
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => { void refreshShipping(); setRefreshing(true); window.setTimeout(() => setRefreshing(false), 700); };
  const filtered = useMemo(() => shipments.filter(s => `${s.id} ${s.order} ${s.customer} ${s.carrier}`.toLowerCase().includes(search.toLowerCase())), [search]);
  if (loading) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground">Loading live shipping records…</main>;
  if (error) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-destructive">{error}</main>;
  if (!loading && !error) return <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10"><div className="mx-auto max-w-6xl"><header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs uppercase tracking-[.18em] text-muted-foreground">Ecommerce / Shipping</p><h1 className="mt-2 text-3xl font-bold">Shipping</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Verified shipping and fulfillment records from connected stores. Delivery status and exceptions appear only when returned by the backend.</p></div><button type="button" onClick={refresh} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-secondary"><RotateCcw size={15} className={refreshing ? 'animate-spin' : ''} /> Refresh</button></header>{shippingRecords.length === 0 ? <section className="rounded-2xl border border-dashed border-border bg-card p-10 text-center"><Truck className="mx-auto mb-4 text-muted-foreground" size={30} /><h2 className="text-xl font-semibold">No verified shipping records yet</h2><p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">Connect a store and synchronize fulfillment data before reviewing delivery performance or exceptions.</p></section> : <section className="overflow-hidden rounded-2xl border border-border bg-card"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">Shipment</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Stage</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Updated</th></tr></thead><tbody className="divide-y divide-border">{shippingRecords.map(record => <tr key={record.id}><td className="px-4 py-3 font-medium">{record.name}</td><td className="px-4 py-3">{record.status}</td><td className="px-4 py-3 text-muted-foreground">{record.stage ?? '—'}</td><td className="max-w-md px-4 py-3 text-muted-foreground">{record.description ?? '—'}</td><td className="px-4 py-3 text-muted-foreground">{new Date(record.updatedAt).toLocaleString()}</td></tr>)}</tbody></table></div></section>}</div></main>;
  return <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
    <aside className="fixed inset-y-0 left-0 z-20 flex w-14 flex-col items-center bg-[var(--sidebar)] py-4 text-muted-foreground" aria-label="Primary navigation">
      <div className="mb-8 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">L</div>
      <LuluSectionNavigation activeId="quietly-moon-4186" />
      <button aria-label="Settings" className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-secondary hover:text-foreground"><Settings size={18} /></button>
    </aside>
    <main className="ml-14 min-w-0 px-6 py-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div><div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground"><span>Ecommerce</span><ChevronRight size={14} /><span className="text-foreground">Shipping</span></div><h1 className="text-2xl font-bold tracking-tight">Shipping</h1><p className="mt-1 text-sm text-muted-foreground">Monitor shipments, deliveries and shipping issues across your ecommerce stores.</p></div>
        <div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Sparkles size={16} />Ask Lulu AI</button><button className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm hover:bg-card"><RotateCcw size={15} />Refresh</button><button className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm hover:bg-card"><Download size={15} />Export</button><button aria-label="More actions" className="rounded-lg border bg-card p-2 hover:bg-secondary"><MoreHorizontal size={17} /></button></div>
      </header>
      <section className="mb-4" aria-label="Shipment filters"><div className="flex flex-col gap-3 xl:flex-row xl:items-center"><div className="flex flex-wrap gap-3"><select value={store} onChange={e => setStore(e.target.value)} className="rounded-lg border bg-card px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option>All Stores</option><option>Connected store · Connected</option><option>Connected store · Connected</option><option>Connected store · Pending</option></select><select value={date} onChange={e => setDate(e.target.value)} className="rounded-lg border bg-card px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option>Today</option><option>Yesterday</option><option>Last 7 Days</option><option>Last 30 Days</option><option>Last 90 Days</option><option>Year to Date</option><option>Custom Range</option></select></div><div className="flex flex-1 justify-end gap-2"><label className="relative block w-full max-w-md"><Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by tracking number, order, customer, carrier" className="w-full rounded-lg border bg-card py-2 pl-9 pr-9 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />{search && <button aria-label="Clear search" onClick={() => setSearch('')} className="absolute right-2 top-2 rounded p-0.5 text-foreground hover:text-foreground"><X size={15} /></button>}</label><button className="relative inline-flex shrink-0 items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm hover:bg-card"><SlidersHorizontal size={15} />Filters<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-xs text-foreground">1</span></button></div></div><div className="mt-2 flex items-center gap-2"><span className="rounded-full border bg-card px-2.5 py-1 text-xs text-foreground">Status: Delayed <button aria-label="Remove delayed filter" className="ml-1 text-muted-foreground">×</button></span><button className="text-xs text-foreground hover:underline">Clear all</button></div></section>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6" aria-label="Shipment summary">{[['Active Shipments', '1,284', 'In transit or active', Package, 'border-l-border'], ['Delivered', '3,421', 'Last 30 days', PackageCheck, 'border-l-chart-4'], ['In Transit', '847', 'Moving through network', Truck, 'border-l-border'], ['Delayed', '38', 'Exceeding expected timing', Clock3, 'border-l-chart-1'], ['Failed Delivery', '12', 'Require review', PackageX, 'border-l-chart-5'], ['Attention Required', '17', 'Action needed', AlertCircle, 'border-l-chart-1 bg-chart-5/30']].map(([label, num, desc, Icon, border]) => <article key={String(label)} className={`rounded-lg border border-l-4 bg-card p-4 shadow-sm ${String(border)}`}><div className="flex justify-between"><p className="text-sm text-muted-foreground">{String(label)}</p><Icon size={18} className="text-muted-foreground" /></div><strong className="mt-2 block text-3xl tracking-tight">{String(num)}</strong><p className="mt-1 text-xs text-muted-foreground">{String(desc)}</p></article>)}</section>
      <section className="mt-6"><div className="mb-3 flex items-center gap-2"><h2 className="text-lg font-semibold">Shipments Requiring Attention</h2><span className="rounded-full bg-chart-1/10 px-2 py-0.5 text-xs font-semibold text-chart-1">17</span><button aria-label="Collapse attention shipments" onClick={() => setAttentionOpen(!attentionOpen)} className="ml-auto rounded p-1 hover:bg-secondary">{attentionOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button></div>{attentionOpen && <div className="overflow-x-auto rounded-lg border bg-card shadow-sm"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-card text-[11px] uppercase tracking-wider text-muted-foreground"><tr>{['Shipment', 'Issue', 'Carrier', 'Store', 'Severity', 'Timestamp', 'Actions'].map(h => <th scope="col" key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead><tbody className="divide-y">{attention.map(r => <tr key={r[0]} className="transition-colors hover:bg-card"><td className="px-4 py-3 font-medium">{r[0]}</td><td className="px-4 py-3">{r[1]}</td><td className="px-4 py-3">{r[2]}</td><td className="px-4 py-3"><span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />{r[3]}</td><td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-medium ${r[6] === 'red' ? 'bg-chart-5/10 text-chart-5' : r[6] === 'orange' ? 'bg-secondary text-foreground' : 'bg-secondary text-foreground'}`}>{r[4]}</span></td><td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{r[5]}</td><td className="px-4 py-3"><div className="flex gap-1"><button className="rounded border px-2 py-1 text-xs hover:bg-card">Review</button><button className="px-2 py-1 text-xs text-foreground hover:underline">Open</button><button className="px-2 py-1 text-xs text-foreground hover:underline">Ask AI</button></div></td></tr>)}</tbody></table></div>}</section>
      <section className="mt-6"><div className="mb-3 flex items-center gap-3"><h2 className="text-lg font-semibold">Shipments <span className="font-normal text-muted-foreground">4,705</span></h2><div className="ml-auto flex rounded-lg border bg-card p-0.5 text-xs"><button onClick={() => setView('table')} className={`rounded-md px-3 py-1.5 ${view === 'table' ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>Table</button><button onClick={() => setView('cards')} className={`rounded-md px-3 py-1.5 ${view === 'cards' ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>Cards</button></div></div>{view === 'table' ? <div className="overflow-x-auto rounded-lg border bg-card shadow-sm"><table className="w-full min-w-[1250px] text-left text-sm"><thead className="bg-card text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['', 'Shipment', 'Order', 'Customer', 'Store', 'Carrier', 'Tracking', 'Method', 'Status', 'Destination', 'Last Update', 'Actions'].map((h, i) => <th scope="col" key={h || 'checkbox'} className="px-3 py-3 font-medium">{i === 0 ? <input aria-label="Select all shipments" type="checkbox" /> : <span className="inline-flex items-center gap-1">{h}<ArrowUpDown size={12} /></span>}</th>)}</tr></thead><tbody className="divide-y">{filtered.map(s => {
                const StatusIcon = statusIcons[s.status];
                return <tr key={s.id} className={`transition-colors hover:bg-secondary ${s.status === 'Failed' ? 'border-l-2 border-chart-5 bg-chart-5/20' : s.status === 'Delayed' ? 'bg-chart-1/20' : ''}`}><td className="px-3 py-3"><input aria-label={`Select ${s.id}`} type="checkbox" /></td><td className="px-3 py-3 font-medium">{s.id}</td><td className="px-3 py-3 text-foreground underline underline-offset-2">{s.order}</td><td className="px-3 py-3 whitespace-nowrap">{s.customer}</td><td className="px-3 py-3 whitespace-nowrap"><span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${s.dot}`} />{s.store}</td><td className="px-3 py-3">{s.carrier}</td><td className="px-3 py-3">{s.tracking === 'Not available' ? <em className="text-xs text-muted-foreground">Not available</em> : <code className="rounded border bg-secondary px-1.5 py-1 text-xs text-foreground">{s.tracking}</code>}</td><td className="px-3 py-3">{s.method}</td><td className="px-3 py-3"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${toneClasses[s.tone]}`}>{StatusIcon && <StatusIcon size={12} />} {s.status}</span></td><td className="px-3 py-3">{s.destination}</td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{s.updated}</td><td className="px-3 py-3"><div className="flex items-center gap-1"><button aria-label={`Open shipment ${s.id}`} className="rounded border px-2 py-1 text-xs hover:bg-card">Open</button>{s.status !== 'Pending' && <button aria-label={`Track shipment ${s.id}`} className="px-1 text-xs text-foreground hover:underline">Track</button>}<button className="px-1 text-xs text-foreground hover:underline">More</button></div></td></tr>;
              })}</tbody></table><div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-xs text-muted-foreground"><span>Showing 1-25 of 4,705 shipments</span><div className="flex items-center gap-1"><button className="rounded border px-2 py-1">Prev</button><button className="rounded bg-primary px-2 py-1 text-primary-foreground">1</button><button className="rounded border px-2 py-1">2</button><button className="rounded border px-2 py-1">3</button><span>...</span><button className="rounded border px-2 py-1">189</button><button className="rounded border px-2 py-1">Next</button><span className="ml-3">Per page <strong className="ml-1 font-medium text-foreground">25</strong></span></div></div></div> : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(s => <article key={s.id} className="rounded-lg border bg-card p-4 shadow-sm"><div className="flex justify-between"><strong>{s.id}</strong><span className={`rounded-full px-2 py-1 text-xs ${toneClasses[s.tone]}`}>{s.status}</span></div><p className="mt-3 font-medium">{s.customer}</p><p className="text-sm text-muted-foreground">{s.carrier} · {s.destination}</p><code className="mt-3 block text-xs text-muted-foreground">{s.tracking}</code></article>)}</div>}</section>
      <div className="mt-4 grid gap-4 lg:grid-cols-2"><section className="rounded-lg border bg-card p-4"><div className="mb-2 flex items-center gap-2"><h2 className="font-semibold">Delayed Shipments</h2><span className="rounded-full bg-chart-1/10 px-2 py-0.5 text-xs text-chart-1">38</span></div>{delayed.map(r => <div key={r[0]} className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b py-3 text-sm last:border-0"><strong>{r[0]}</strong><span>{r[1]}</span><span className="text-muted-foreground">{r[2]} · {r[3]}</span><code className="text-xs text-muted-foreground">{r[4]}</code><span className="rounded-full bg-chart-1/10 px-2 py-0.5 text-xs text-chart-1">Delayed</span><span className="text-xs text-muted-foreground">Last: {r[5]}</span><span className="ml-auto flex gap-2 text-xs"><button className="text-foreground">Open</button><button className="text-foreground">Track</button></span></div>)}<p className="mt-2 text-xs italic text-muted-foreground">Delivery estimates unavailable where carrier data is insufficient.</p><button className="mt-3 text-sm text-foreground hover:underline">View all 38 delayed</button></section><section className="rounded-lg border bg-card p-4"><div className="mb-2 flex items-center gap-2"><h2 className="font-semibold">Failed Deliveries</h2><span className="rounded-full bg-chart-5/10 px-2 py-0.5 text-xs text-chart-5">12</span></div>{failed.map(r => <div key={r[0]} className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b py-3 text-sm last:border-0"><strong>{r[0]}</strong><span>{r[1]}</span><span className="text-muted-foreground">{r[2]}</span><code className="text-xs text-muted-foreground">{r[3]}</code><span className="rounded-full bg-chart-5/10 px-2 py-0.5 text-xs text-chart-5">Failed</span><span className="text-xs text-muted-foreground">{r[4]} · {r[5]}</span><span className="ml-auto flex gap-2 text-xs"><button className="text-foreground">Open</button><button className="text-foreground">Track</button></span></div>)}<button className="mt-3 text-sm text-foreground hover:underline">View all 12 failed</button></section></div>
      <section className="mt-4 rounded-lg border bg-card p-4"><div className="mb-3 flex items-center gap-2"><h2 className="font-semibold">Delivery Issues</h2><span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-foreground">17</span></div><div className="overflow-x-auto rounded-lg border"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-card text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Shipment', 'Issue', 'Carrier', 'Store', 'Timestamp', 'Severity', 'Actions'].map(h => <th scope="col" key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr></thead><tbody className="divide-y">{attention.map(r => <tr key={`issue-${r[0]}`} className="hover:bg-card"><td className="px-3 py-3 font-medium">{r[0]}</td><td className="px-3 py-3">{r[1]}</td><td className="px-3 py-3">{r[2]}</td><td className="px-3 py-3">{r[3]}</td><td className="px-3 py-3 text-muted-foreground">{r[5]}</td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-xs ${r[6] === 'red' ? 'bg-chart-5/10 text-chart-5' : 'bg-secondary text-foreground'}`}>{r[4]}</span></td><td className="px-3 py-3"><button className="mr-2 rounded border px-2 py-1 text-xs">Review</button><button className="text-xs text-foreground">Open</button></td></tr>)}</tbody></table></div></section>
      <section className="mt-4 grid gap-4 xl:grid-cols-3"><article className="rounded-lg border border-l-4 border-l-border bg-card p-4"><div className="flex items-center gap-2"><Sparkles className="text-foreground" size={18} /><h3 className="font-semibold text-foreground">Ask Lulu AI</h3><button aria-label="Collapse AI assistant" className="ml-auto"><ChevronDown size={17} /></button></div><p className="mt-1 text-xs text-muted-foreground">Powered by Lulu AI</p><div className="mt-3 rounded-lg border border-border bg-secondary p-3"><div className="flex items-center gap-2"><Sparkles size={15} className="text-foreground" /><strong className="text-sm">AI Insight</strong><span className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] text-foreground">AI Generated</span></div><p className="mt-2 text-sm">14 shipments currently show delivery-related exceptions across two connected stores.</p><p className="mt-2 text-xs text-muted-foreground">9 at Connected store (Shopify) + 5 at Connected store (WooCommerce) · Carriers: DHL, FedEx, DPD</p><p className="mt-2 text-xs italic text-muted-foreground">AI-generated interpretation based on available shipping data. Not carrier-confirmed.</p><button className="mt-2 rounded border border-border bg-card px-2 py-1 text-xs text-foreground">View Affected Shipments</button></div><div className="mt-3 flex gap-2 overflow-x-auto pb-1 text-xs text-muted-foreground"><span className="whitespace-nowrap rounded-full border px-2 py-1">Which shipments need attention</span><span className="whitespace-nowrap rounded-full border px-2 py-1">Find delayed shipments</span><span className="whitespace-nowrap rounded-full border px-2 py-1">Find missing tracking</span></div><div className="mt-3 flex flex-wrap gap-2">{['Find Delayed', 'Find Failed', 'Missing Tracking', 'Carrier Exceptions', 'Create Report'].map(x => <button key={x} className="rounded border px-2 py-1 text-xs hover:bg-secondary">{x}</button>)}</div><label className="relative mt-3 block"><input placeholder="Ask Lulu AI about shipping..." className="w-full rounded-lg border py-2 pl-3 pr-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /><Send size={15} className="absolute right-3 top-2.5 text-muted-foreground" /></label></article><article className="rounded-lg border bg-card p-4"><h3 className="font-semibold">Shipping Operations Health</h3><div className="mt-3 grid grid-cols-2 gap-3 text-sm">{[['Shipment Tracking', 'Healthy', 'good'], ['Delivery Status', 'Attention Required', 'warn'], ['Carrier Data', 'Attention Required', 'warn'], ['Synchronization', 'Healthy', 'good'], ['Missing Tracking', 'Critical (4 shipments)', 'bad'], ['Platform Connectivity', 'Healthy', 'good']].map(r => <div key={r[0]} className="flex items-start gap-2"><span className="mt-0.5">{r[2] === 'good' ? <CheckCircle2 size={16} className="text-chart-4" /> : r[2] === 'bad' ? <AlertCircle size={16} className="text-chart-5" /> : <AlertTriangle size={16} className="text-foreground" />}</span><span><strong className="block font-medium">{r[0]}</strong><span className="text-xs text-muted-foreground">{r[1]}</span></span></div>)}</div><hr className="my-4" /><h3 className="font-semibold">Shipping Synchronization</h3><div className="mt-3 space-y-3 text-sm">{[['Connected store', 'Shopify', '2 min ago', '18 updated', 'Synced', 'emerald'], ['Connected store', 'WooCommerce', '6 min ago', '9 updated', 'Synced', 'emerald'], ['Connected store', 'Webflow', '2 hours ago', '1 delayed', 'Delayed', 'amber']].map(r => <div key={r[0]} className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${r[5] === 'emerald' ? 'bg-primary' : 'bg-primary'}`} /><span className="min-w-24 font-medium">{r[0]}</span><span className="text-xs text-muted-foreground">{r[1]}</span><span className={`ml-auto text-xs ${r[5] === 'emerald' ? 'text-foreground' : 'text-foreground'}`}>{r[4]} · {r[2]} · {r[3]}</span></div>)}</div><button className="mt-4 text-sm text-foreground hover:text-foreground">Open Integrations</button></article><article className="rounded-lg border bg-card p-4"><h3 className="font-semibold">Recent Tracking Activity</h3><div className="mt-4 space-y-4">{[['violet', 'AI identified 14 shipments with delivery exceptions', 'AI', '3 min ago'], ['red', 'SHP-10501 delivery failed - address issue (DHL, Germany)', 'System', '1 hour ago'], ['teal', 'SHP-10495 out for delivery - FedEx France', 'System', '2 hours ago'], ['emerald', 'SHP-10498 delivered successfully - Royal Mail UK', 'System', '2 hours ago'], ['amber', 'SHP-10488 customs exception flagged - FedEx US', 'System', '3 hours ago'], ['blue', 'Shipping sync completed - 27 shipments updated', 'System', '4 hours ago']].map(r => <div key={r[1]} className="flex gap-3 text-sm"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full bg-${r[0]}-500`} /><p className="leading-snug">{r[1]} <span className="ml-1 rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">{r[2]}</span><span className="mt-1 block text-xs text-muted-foreground">{r[3]}</span></p></div>)}</div><button className="mt-4 text-sm text-foreground hover:text-foreground">View All Tracking Activity</button></article></section>
    </main>
  </div>;
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
  "label": "Website & Commerce",
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
    "id": "sparklingly-moon-5114",
    "label": "SEO"
  }, {
    "id": "zealously-path-4224",
    "label": "GEO"
  }, {
    "id": "sunny-house-9595",
    "label": "AEO"
  }, {
    "id": "daring-brook-9034",
    "label": "Reviews"
  }, {
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
          <span data-lulu-section-soon={section.label !== "Website & Commerce" && section.label !== "Settings" ? "true" : undefined}>{section.label}</span>
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
