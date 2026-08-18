import { useMemo, useState, type ReactNode } from 'react';
import { Activity, AlertCircle, ArrowDownUp, ArrowRight, Bell, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, Download, ExternalLink, Filter, Info, LayoutDashboard, LifeBuoy, ListFilter, MoreHorizontal, Package, PanelLeft, Plus, RefreshCw, Search, Send, Settings, Sparkles, Store, Truck, UserRound, X, Zap } from 'lucide-react';
type ShipmentStatus = 'In Transit' | 'Delivered' | 'Out for Delivery' | 'Label Created' | 'Delayed' | 'Unfulfilled';
type IconType = typeof Truck;
interface Shipment {
  id: string;
  order: string;
  customer: string;
  store: string;
  provider: string;
  tracking: string;
  items: string;
  method: string;
  status: ShipmentStatus;
  last: string;
  expected: string;
}
interface Attention {
  id: string;
  issue: string;
  provider: string;
  store: string;
  severity: 'Critical' | 'High' | 'Medium';
  time: string;
}
const shipments: Shipment[] = [{
  id: 'SHP-10284',
  order: '#10284',
  customer: 'J. Smith',
  store: 'Lulu Store',
  provider: 'DHL',
  tracking: '003404…',
  items: '3 items',
  method: 'Express',
  status: 'In Transit',
  last: '10 Aug',
  expected: '12 Aug'
}, {
  id: 'SHP-10283',
  order: '#10283',
  customer: 'M. Johnson',
  store: 'Lulu WooCommerce',
  provider: 'UPS',
  tracking: '1Z8…',
  items: '1 item',
  method: 'Standard',
  status: 'Delivered',
  last: '9 Aug',
  expected: '9 Aug'
}, {
  id: 'SHP-10280',
  order: '#10280',
  customer: 'A. Williams',
  store: 'Lulu Store',
  provider: 'FedEx',
  tracking: '7489…',
  items: '2 items',
  method: 'Overnight',
  status: 'Out for Delivery',
  last: '11 Aug',
  expected: '11 Aug'
}, {
  id: 'SHP-10277',
  order: '#10277',
  customer: 'R. Brown',
  store: 'Lulu Store',
  provider: 'DHL',
  tracking: '—',
  items: '1 item',
  method: 'Standard',
  status: 'Label Created',
  last: '8 Aug',
  expected: '14 Aug'
}, {
  id: 'SHP-10271',
  order: '#10271',
  customer: 'S. Davis',
  store: 'Lulu WooCommerce',
  provider: 'UPS',
  tracking: '1Z4…',
  items: '4 items',
  method: 'Express',
  status: 'Delayed',
  last: '6 Aug',
  expected: '8 Aug'
}, {
  id: 'SHP-10265',
  order: '#10265',
  customer: 'E. Wilson',
  store: 'Lulu Store',
  provider: '—',
  tracking: '—',
  items: '2 items',
  method: 'Standard',
  status: 'Unfulfilled',
  last: '5 Aug',
  expected: '—'
}];
const attention: Attention[] = [{
  id: 'SHP-10291',
  issue: 'Delivery exception — address undeliverable',
  provider: 'DHL',
  store: 'Lulu Store',
  severity: 'Critical',
  time: '2 hrs ago'
}, {
  id: 'SHP-10287',
  issue: 'Tracking not updating — 4 days since last scan',
  provider: 'UPS',
  store: 'Lulu WooCommerce',
  severity: 'High',
  time: '4 days ago'
}, {
  id: 'SHP-10275',
  issue: 'Missing tracking number',
  provider: 'FedEx',
  store: 'Lulu Store',
  severity: 'Medium',
  time: '1 day ago'
}];
const metrics = [{
  label: 'Unfulfilled',
  value: '47',
  delta: '+3 today',
  color: 'bg-chart-1',
  text: 'text-chart-1'
}, {
  label: 'Processing',
  value: '23',
  delta: '+5 today',
  color: 'bg-primary',
  text: 'text-foreground'
}, {
  label: 'Shipped',
  value: '184',
  delta: '+18 today',
  color: 'bg-primary',
  text: 'text-foreground'
}, {
  label: 'In Transit',
  value: '96',
  delta: '+8 today',
  color: 'bg-primary',
  text: 'text-foreground'
}, {
  label: 'Delivered',
  value: '1,247',
  delta: '+62 today',
  color: 'bg-chart-4',
  text: 'text-chart-4'
}, {
  label: 'Delayed',
  value: '12',
  delta: '-2 today',
  color: 'bg-chart-1',
  text: 'text-chart-1'
}, {
  label: 'Exceptions',
  value: '8',
  delta: '+1 today',
  color: 'bg-destructive',
  text: 'text-chart-5'
}];
const activity = [{
  icon: Truck,
  text: 'Shipment SHP-10284 entered transit',
  source: 'DHL · Carrier',
  time: '10 min ago'
}, {
  icon: Check,
  text: 'SHP-10283 delivered',
  source: 'UPS · Carrier',
  time: '1 hr ago'
}, {
  icon: Package,
  text: 'Label generated for SHP-10277',
  source: 'System',
  time: '3 hrs ago'
}, {
  icon: AlertCircle,
  text: 'Exception on SHP-10291',
  source: 'DHL · Carrier',
  time: '2 hrs ago'
}, {
  icon: Plus,
  text: 'Fulfillment created for Order #10291',
  source: 'System',
  time: '5 hrs ago'
}, {
  icon: RefreshCw,
  text: 'Sync completed — Lulu Store / DHL',
  source: 'System',
  time: '12 min ago'
}];
const promptChips = ['Which shipments are delayed?', 'Which shipments require attention?', 'Show unfulfilled orders', 'Find delivery exceptions', 'Find shipments without tracking updates', "Summarize today's shipping activity"];
const statusClasses: Record<string, string> = {
  'In Transit': 'bg-secondary text-foreground ring-ring',
  Delivered: 'bg-secondary text-foreground ring-ring',
  'Out for Delivery': 'bg-secondary text-foreground ring-ring',
  'Label Created': 'bg-secondary text-muted-foreground ring-ring',
  Delayed: 'bg-chart-1/10 text-chart-1 ring-chart-1',
  Unfulfilled: 'bg-chart-1/10 text-chart-1 ring-chart-1'
};
function StatusBadge({
  status
}: {
  status: string;
}) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${statusClasses[status] ?? 'bg-secondary text-muted-foreground ring-ring'}`}>{status}</span>;
}
function Button({
  children,
  kind = 'secondary',
  className = '',
  onClick,
  ariaLabel
}: {
  children: ReactNode;
  kind?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const styles = kind === 'primary' ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary' : kind === 'ghost' ? 'text-muted-foreground hover:bg-secondary' : 'border border-border bg-card text-foreground shadow-sm hover:bg-card';
  return <button aria-label={ariaLabel} onClick={onClick} className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold transition-colors ${styles} ${className}`}>{children}</button>;
}
export function ShippingFulfillment() {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('');
  const [showAttention, setShowAttention] = useState(true);
  const [aiQuery, setAiQuery] = useState('');
  const filtered = useMemo(() => shipments.filter(s => !query || Object.values(s).join(' ').toLowerCase().includes(query.toLowerCase())).filter(s => !selectedMetric || s.status === selectedMetric), [query, selectedMetric]);
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <div className="flex min-h-screen">
      <aside className="hidden w-[236px] shrink-0 flex-col bg-[var(--sidebar)] text-foreground lg:flex">
        <div className="flex h-[72px] items-center gap-3 border-b border-border px-6"><div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles size={18} /></div><div><strong className="block text-[15px] tracking-tight text-foreground">Lulu AI</strong><span className="text-[10px] text-muted-foreground">CORE PLATFORM</span></div></div>
        <div className="px-4 pt-7"><p className="px-3 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">Workspace</p><LuluSectionNavigation activeId="purely-dusk-2409" /><p className="mt-8 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">Manage</p><nav className="mt-3 space-y-1"><a className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-secondary" href="#"><Activity size={17} /> Analytics</a><a className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-secondary" href="#"><LifeBuoy size={17} /> Support</a><a className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-secondary" href="#"><Settings size={17} /> Settings</a></nav></div>
        <div className="mt-auto m-4 rounded-xl border border-border bg-secondary p-4"><div className="flex items-center gap-2 text-xs font-semibold text-foreground"><span className="h-2 w-2 rounded-full bg-primary text-primary-foreground" />All systems operational</div><p className="mt-2 text-[11px] leading-4 text-muted-foreground">Last checked just now</p></div>
      </aside>
      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-border bg-secondary px-5 backdrop-blur lg:px-8"><div className="flex items-center gap-3"><button className="text-foreground lg:hidden"><PanelLeft size={20} /></button><span className="text-sm font-semibold text-foreground">Operations</span><span className="text-foreground">/</span><span className="text-sm text-muted-foreground">Shipping & Fulfillment</span></div><div className="flex items-center gap-2"><button className="relative rounded-lg p-2 text-foreground hover:bg-secondary"><Bell size={18} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" /></button><div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">AL</div></div></header>
        <div className="mx-auto max-w-[1500px] px-5 py-7 lg:px-8">
          <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-2 text-xs font-semibold text-foreground">Ecommerce / Shipping & Fulfillment</p><h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-[34px]">Shipping &amp; Fulfillment</h1><p className="mt-2 text-sm text-muted-foreground">Monitor fulfillment, shipments and delivery activity across your connected ecommerce stores.</p></div><div className="flex flex-wrap items-center gap-2"><Button kind="primary"><Plus size={15} />Create Shipment</Button><Button><Sparkles size={15} className="text-foreground" />Ask Lulu AI</Button><Button className="w-9 px-0" ariaLabel="Refresh"><RefreshCw size={15} /></Button><Button className="w-9 px-0" ariaLabel="Export"><Download size={15} /></Button><Button className="w-9 px-0" ariaLabel="More"><MoreHorizontal size={17} /></Button></div></section>
          <section className="mt-7 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-sm"><Button className="min-w-[190px] justify-between"><span className="flex items-center gap-2"><Store size={15} className="text-foreground" />All Stores</span><ChevronDown size={14} /></Button><Button className="min-w-[145px] justify-between"><span>All Providers</span><ChevronDown size={14} /></Button><Button className="min-w-[185px] justify-between"><span>Last 7 Days <span className="font-normal text-muted-foreground">· Shipment Date</span></span><ChevronDown size={14} /></Button><div className="relative min-w-[230px] flex-1"><Search size={15} className="absolute left-3 top-2.5 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} className="h-9 w-full rounded-lg border border-border pl-9 pr-8 text-xs outline-none ring-ring focus:ring-2" placeholder="Search by shipment, order, customer, tracking…" />{query && <button onClick={() => setQuery('')} className="absolute right-2 top-2 text-foreground"><X size={15} /></button>}</div><Button onClick={() => setShowFilters(true)}><Filter size={15} />Filters <span className="grid h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 text-[10px] text-foreground">2</span></Button></section>
          <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">{metrics.map(metric => <button key={metric.label} onClick={() => setSelectedMetric(selectedMetric === metric.label ? '' : metric.label)} className={`group relative overflow-hidden rounded-xl border bg-card p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${selectedMetric === metric.label ? 'border-border ring-2 ring-ring' : 'border-border'}`}><span className="text-xs font-medium text-muted-foreground">{metric.label}</span><strong className="mt-1 block text-2xl tracking-tight text-foreground">{metric.value}</strong><span className={`mt-1 block text-[11px] font-semibold ${metric.text}`}>{metric.delta}</span><span className={`absolute inset-x-0 bottom-0 h-1 ${metric.color}`} /></button>)}</section>
          <section className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm"><button onClick={() => setShowAttention(!showAttention)} className="flex w-full items-center justify-between border-b border-chart-1/30 bg-chart-1/70 px-5 py-3.5 text-left"><span className="flex items-center gap-2 text-sm font-bold text-foreground"><AlertCircle size={17} className="text-chart-1" />Shipments Requiring Attention <span className="rounded-full bg-chart-1/10 px-2 py-0.5 text-[11px] text-chart-1">8</span></span><ChevronDown className={`text-muted-foreground transition ${showAttention ? 'rotate-180' : ''}`} size={17} /></button>{showAttention && <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-xs"><thead className="text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-3">Shipment ID</th><th>Issue</th><th>Provider</th><th>Store</th><th>Severity</th><th>Timestamp</th><th /></tr></thead><tbody>{attention.map(item => <tr key={item.id} className="border-t border-border"><td className="px-5 py-3 font-semibold text-foreground">{item.id}</td><td className="font-medium text-foreground">{item.issue}</td><td>{item.provider}</td><td>{item.store}</td><td><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${item.severity === 'Critical' ? 'bg-chart-5/10 text-chart-5' : item.severity === 'High' ? 'bg-secondary text-foreground' : 'bg-secondary text-foreground'}`}>{item.severity}</span></td><td className="text-muted-foreground">{item.time}</td><td className="pr-5"><div className="flex gap-1"><Button className="h-7 px-2 text-[10px]">Review</Button><Button className="h-7 px-2 text-[10px]">Track</Button><Button className="h-7 px-2 text-[10px] text-foreground"><Sparkles size={12} />Ask AI</Button></div></td></tr>)}</tbody></table></div>}</section>
          <section className="mt-6 rounded-xl border border-border bg-card shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4"><div><h2 className="text-base font-bold text-foreground">Shipments <span className="ml-1 rounded-full bg-secondary px-2 py-1 text-[11px] text-muted-foreground">1,615</span></h2><p className="mt-1 text-xs text-muted-foreground">All shipment activity across connected stores</p></div><div className="flex items-center gap-2 text-xs text-muted-foreground"><span>Sort by: Last update</span><ArrowDownUp size={14} /><Button className="h-8">50 per page <ChevronDown size={13} /></Button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[1180px] text-left text-xs"><thead className="bg-card text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['#', 'Shipment', 'Order', 'Customer', 'Store', 'Provider', 'Tracking', 'Items', 'Method', 'Status', 'Last Update', 'Expected Delivery', ''].map(heading => <th key={heading} className="whitespace-nowrap px-4 py-3 font-semibold">{heading || 'Actions'} {heading && heading !== '#' && <ArrowDownUp size={11} className="ml-1 inline" />}</th>)}</tr></thead><tbody>{filtered.map((item, i) => <tr key={item.id} className="group border-t border-border transition hover:bg-secondary/30"><td className="px-4 py-3 text-muted-foreground">{i + 1}</td><td className="font-semibold text-foreground">{item.id}</td><td className="font-medium text-foreground">{item.order}</td><td>{item.customer}</td><td className="whitespace-nowrap">{item.store}</td><td>{item.provider}</td><td className="font-mono text-muted-foreground">{item.tracking}</td><td>{item.items}</td><td>{item.method}</td><td><StatusBadge status={item.status} /></td><td className="whitespace-nowrap text-muted-foreground">{item.last}</td><td className="whitespace-nowrap text-muted-foreground">{item.expected}</td><td><button className="rounded p-1 text-foreground hover:bg-secondary hover:text-foreground"><MoreHorizontal size={16} /></button></td></tr>)}</tbody></table></div><footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-xs text-muted-foreground"><span>Showing 1–50 of 1,615 shipments</span><div className="flex items-center gap-1"><button className="rounded border border-border p-1.5"><ChevronLeft size={14} /></button><span className="rounded bg-primary px-2.5 py-1.5 font-semibold text-primary-foreground">1</span><span className="px-1">of 33</span><button className="rounded border border-border p-1.5"><ChevronRight size={14} /></button></div></footer></section>
          <section className="mt-6 grid gap-6 xl:grid-cols-2"><div className="rounded-xl border border-chart-1/30 bg-card shadow-sm"><div className="flex items-center justify-between border-b border-border px-5 py-4"><h2 className="font-bold">Delayed Shipments <span className="ml-1 rounded-full bg-chart-1/10 px-2 py-1 text-[11px] text-chart-1">12</span></h2><ArrowRight size={16} className="text-chart-1" /></div>{shipments.filter(s => s.status === 'Delayed').map(s => <div key={s.id} className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-3 text-xs"><strong className="text-foreground">{s.id}</strong><span>{s.order}</span><span>{s.customer}</span><span>{s.provider}</span><span className="font-mono text-muted-foreground">{s.tracking}</span><StatusBadge status="Delayed" /><span className="ml-auto text-muted-foreground">{s.last}</span></div>)}</div><div className="rounded-xl border border-chart-1/30 bg-card shadow-sm"><div className="flex items-center justify-between border-b border-border px-5 py-4"><h2 className="font-bold">Unfulfilled Orders <span className="ml-1 rounded-full bg-secondary px-2 py-1 text-[11px] text-foreground">47</span></h2><ArrowRight size={16} className="text-foreground" /></div>{['#10265 · E. Wilson · Lulu Store · 2 items', '#10261 · C. Moore · Lulu WooCommerce · 1 item', '#10258 · T. Garcia · Lulu Store · 3 items'].map(row => <div key={row} className="flex items-center justify-between border-b border-border px-5 py-3 text-xs"><span className="font-medium">{row}</span><Button className="h-7 px-2 text-[10px]">Fulfill</Button></div>)}</div></section>
          <section className="mt-6 grid gap-6 xl:grid-cols-3"><div className="rounded-xl border border-border bg-card p-5 shadow-sm"><h2 className="font-bold">Shipping Operations Health</h2>{[['Fulfillment Synchronization', 'Healthy', 'green'], ['Tracking Availability', 'Healthy', 'green'], ['Carrier Connectivity', 'Attention Required', 'amber'], ['Shipment Data Completeness', 'Healthy', 'green'], ['Delivery Status Availability', 'Healthy', 'green'], ['Synchronization Failures', '2 failures', 'red']].map(([label, value, color]) => <div key={label} className="flex items-center justify-between border-b border-border py-3 text-xs last:border-0"><span className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${color === 'green' ? 'bg-chart-4' : color === 'amber' ? 'bg-chart-1' : 'bg-destructive'}`} />{label}</span><span className={color === 'green' ? 'text-chart-4' : color === 'amber' ? 'text-chart-1' : 'text-chart-5'}>{value} {color === 'green' ? '✓' : '⚠'}</span></div>)}</div><div className="rounded-xl border border-border bg-card p-5 shadow-sm"><h2 className="font-bold">Shipping Synchronization</h2>{[['Lulu Store / DHL', 'Synced', '2 min ago', '1,247 shipments'], ['Lulu WooCommerce / UPS', 'Syncing', 'running', '—'], ['Lulu Store / FedEx', 'Delayed', '45 min ago', '368 shipments']].map(([name, state, time, count]) => <div key={name} className="border-b border-border py-3 last:border-0"><div className="flex justify-between text-xs font-semibold"><span>{name}</span><span className={state === 'Synced' ? 'text-foreground' : state === 'Delayed' ? 'text-chart-1' : 'text-foreground'}>{state}</span></div><div className="mt-1 flex justify-between text-[11px] text-muted-foreground"><span>Last sync: {time}</span><span>{count}</span></div></div>)}</div><div className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-bold">Shipping Activity</h2><button className="text-xs font-semibold text-foreground">View All</button></div>{activity.map(event => {
                const EventIcon: IconType = event.icon;
                return <div key={event.text} className="flex gap-3 border-b border-border py-3 last:border-0"><div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-secondary text-foreground"><EventIcon size={14} /></div><div className="min-w-0 text-xs"><p className="font-medium text-foreground">{event.text}</p><span className="text-[11px] text-muted-foreground">{event.source} · {event.time}</span></div></div>;
              })}</div></section>
          <section className="mt-6 rounded-2xl bg-[var(--card)] p-5 text-foreground shadow-lg lg:p-7"><div className="flex items-center gap-2"><div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles size={18} /></div><div><h2 className="font-bold">Ask Lulu AI</h2><p className="text-[11px] text-muted-foreground">Shipping intelligence, grounded in your connected data</p></div></div><div className="mt-5 rounded-xl border border-border/20 bg-secondary p-4"><p className="text-xs font-semibold text-foreground"><Sparkles size={13} className="mr-1 inline" />AI Insight <em className="font-normal text-muted-foreground">· AI-generated</em></p><p className="mt-2 max-w-4xl text-sm leading-6 text-foreground">12 shipments currently require review based on available delivery and fulfillment status information from your connected stores and carriers. 8 exceptions detected across DHL and FedEx. 4 shipments have had no tracking update in over 72 hours.</p><div className="mt-3 flex flex-wrap gap-2">{['12 flagged', 'DHL: 6', 'FedEx: 4', 'UPS: 2', 'Last updated: just now'].map(chip => <span key={chip} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] text-foreground">{chip}</span>)}</div></div><div className="mt-4 flex gap-2"><div className="relative flex-1"><Sparkles size={16} className="absolute left-3 top-3 text-muted-foreground" /><input value={aiQuery} onChange={e => setAiQuery(e.target.value)} className="h-11 w-full rounded-lg border border-border bg-secondary pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-border" placeholder="Ask Lulu AI about shipping and fulfillment…" /></div><button className="grid h-11 w-11 place-items-center rounded-lg bg-primary hover:bg-primary text-primary-foreground"><Send size={16} /></button></div><div className="mt-4 flex gap-2 overflow-x-auto pb-1">{promptChips.map(chip => <button key={chip} onClick={() => setAiQuery(chip)} className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-[11px] text-foreground hover:border-border hover:text-foreground">{chip}</button>)}</div><div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-4">{['Find Delayed Shipments', 'Find Delivery Exceptions', 'Find Unfulfilled Orders', 'Find Missing Tracking', 'Prioritize Shipping Issues', 'Summarize Shipping Activity'].map(action => <button key={action} className="rounded-lg bg-secondary px-3 py-2 text-[11px] font-semibold text-foreground hover:bg-secondary">{action}</button>)}</div></section>
        </div>
      </main>
      {showFilters && <aside className="fixed inset-y-0 right-0 z-30 w-full max-w-[390px] overflow-y-auto border-l border-border bg-card p-5 shadow-2xl"><div className="flex items-center justify-between border-b border-border pb-4"><div><h2 className="text-lg font-bold">Filters</h2><p className="mt-1 text-xs text-muted-foreground">Refine your shipping workspace</p></div><button onClick={() => setShowFilters(false)} className="rounded-lg p-2 text-foreground hover:bg-secondary"><X size={18} /></button></div>{[['Fulfillment Status', ['Unfulfilled', 'Processing', 'Fulfilled', 'Partially Fulfilled', 'Cancelled', 'Unknown']], ['Shipment Status', ['Label Created', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Delayed', 'Exception', 'Returned', 'Cancelled', 'Unknown']], ['Shipping Provider', ['DHL', 'UPS', 'FedEx', 'DPD']], ['Shipping Method', ['Standard', 'Express', 'Overnight', 'Pickup', 'Other']], ['Store', ['All Stores', 'Lulu Store', 'Lulu WooCommerce']], ['Delivery Status', ['On Time', 'Delayed', 'Delivered', 'Exception']]].map(([title, options]) => <fieldset key={title as string} className="border-b border-border py-4"><legend className="mb-3 text-xs font-bold text-foreground">{title as string}</legend>{(options as string[]).map(option => <label key={option} className="flex items-center gap-2 py-1.5 text-xs text-muted-foreground"><input type="checkbox" className="h-3.5 w-3.5 rounded border-border text-foreground" />{option}</label>)}</fieldset>)}<div className="flex gap-2 pt-5"><Button className="flex-1">Clear All Filters</Button><Button kind="primary" className="flex-1" onClick={() => setShowFilters(false)}>Apply Filters</Button></div></aside>}
    </div>
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
