import { useMemo, useState } from 'react';
import { Activity, AlertCircle, Archive, ArrowDownToLine, ArrowRight, Bell, Boxes, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ClipboardList, Clock3, Cloud, CreditCard, Ellipsis, ExternalLink, Eye, Filter, Globe2, LayoutDashboard, ListFilter, Menu, MoreHorizontal, Package, PanelLeft, RefreshCw, Search, Settings, ShoppingBag, Sparkles, Store, Truck, UserRound, Users, X, Zap } from 'lucide-react';
type Order = {
  id: string;
  date: string;
  store: string;
  platform: 'Shopify' | 'WooCommerce' | 'Webflow';
  customer: string;
  products: string;
  total: string;
  payment: string;
  fulfillment: string;
  shipping: string;
  status: string;
  updated: string;
  tone: string;
  attention?: boolean;
};
const orders: Order[] = [{
  id: '#10482',
  date: 'Aug 10',
  store: 'Lulu Store',
  platform: 'Shopify',
  customer: 'John Smith',
  products: '3 items',
  total: '€249.00',
  payment: 'Paid ✓',
  fulfillment: 'Fulfillment Pending ⚠',
  shipping: 'Not Shipped',
  status: 'Processing',
  updated: '2h ago',
  tone: 'blue',
  attention: true
}, {
  id: '#10481',
  date: 'Aug 10',
  store: 'Main Shop',
  platform: 'WooCommerce',
  customer: 'Sarah Lee',
  products: '1 item',
  total: '€89.00',
  payment: 'Paid ✓',
  fulfillment: 'Fulfilled ✓',
  shipping: 'In Transit',
  status: 'Shipped',
  updated: '4h ago',
  tone: 'teal'
}, {
  id: '#10480',
  date: 'Aug 9',
  store: 'Lulu Store',
  platform: 'Shopify',
  customer: 'Mike Johnson',
  products: '2 items',
  total: '€312.00',
  payment: 'Failed ✗',
  fulfillment: 'Unfulfilled',
  shipping: 'Not Shipped',
  status: 'Attention',
  updated: '6h ago',
  tone: 'amber',
  attention: true
}, {
  id: '#10479',
  date: 'Aug 9',
  store: 'Main Shop',
  platform: 'WooCommerce',
  customer: 'Emma Davis',
  products: '5 items',
  total: '€527.50',
  payment: 'Paid ✓',
  fulfillment: 'Fulfilled ✓',
  shipping: 'Delivered ✓',
  status: 'Delivered',
  updated: '1d ago',
  tone: 'green'
}, {
  id: '#10478',
  date: 'Aug 8',
  store: 'Webflow Store',
  platform: 'Webflow',
  customer: 'Tom Wilson',
  products: '1 item',
  total: '€45.00',
  payment: 'Pending ⚠',
  fulfillment: 'Unfulfilled',
  shipping: 'Not Shipped',
  status: 'Attention',
  updated: '2d ago',
  tone: 'amber',
  attention: true
}, {
  id: '#10477',
  date: 'Aug 8',
  store: 'Lulu Store',
  platform: 'Shopify',
  customer: 'Alice Brown',
  products: '4 items',
  total: '€198.00',
  payment: 'Refunded',
  fulfillment: '—',
  shipping: '—',
  status: 'Refunded',
  updated: '2d ago',
  tone: 'gray'
}, {
  id: '#10476',
  date: 'Aug 7',
  store: 'Main Shop',
  platform: 'WooCommerce',
  customer: 'David Clark',
  products: '2 items',
  total: '€156.00',
  payment: 'Paid ✓',
  fulfillment: 'Partially Fulfilled',
  shipping: 'Shipped',
  status: 'Processing',
  updated: '3d ago',
  tone: 'blue'
}];
const summary = [{
  label: 'Total Orders',
  value: '1,284',
  sub: 'This period',
  tone: 'purple'
}, {
  label: 'New',
  value: '47',
  sub: 'since yesterday',
  tone: 'blue'
}, {
  label: 'Processing',
  value: '183',
  sub: '14% of orders',
  tone: 'blue'
}, {
  label: 'Fulfillment Pending',
  value: '96',
  sub: '7.5% of orders',
  tone: 'amber'
}, {
  label: 'Shipped',
  value: '312',
  sub: '24.3% of orders',
  tone: 'teal'
}, {
  label: 'Delivered',
  value: '589',
  sub: '45.9% of orders',
  tone: 'green'
}, {
  label: 'Cancelled',
  value: '38',
  sub: '2.9% of orders',
  tone: 'gray'
}, {
  label: 'Refunded',
  value: '19',
  sub: '1.5% of orders',
  tone: 'orange'
}];
const attention = [{
  label: 'Payment Failed',
  count: 3
}, {
  label: 'Payment Pending',
  count: 5
}, {
  label: 'Fulfillment Delayed',
  count: 2
}, {
  label: 'Shipping Delayed',
  count: 2
}, {
  label: 'Address Issues',
  count: 1
}, {
  label: 'Sync Error',
  count: 1
}];
const nav = [{
  icon: LayoutDashboard,
  label: 'Dashboard'
}, {
  icon: Zap,
  label: 'AI Platform'
}, {
  icon: Users,
  label: 'CRM'
}, {
  icon: Activity,
  label: 'Marketing'
}, {
  icon: Globe2,
  label: 'Advertising'
}];
const ecommerce = ['Overview', 'Stores', 'Products', 'Categories', 'Orders', 'Inventory', 'Reviews', 'Merchandising', 'Automation'];
const pillTone: Record<string, string> = {
  blue: 'bg-secondary text-foreground',
  teal: 'bg-secondary text-foreground',
  green: 'bg-secondary text-foreground',
  amber: 'bg-secondary text-foreground',
  gray: 'bg-secondary text-muted-foreground',
  orange: 'bg-secondary text-foreground',
  purple: 'bg-secondary text-foreground'
};
function PlatformIcon({
  platform
}: {
  platform: string;
}) {
  return <span className={`inline-flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold ${platform === 'Shopify' ? 'bg-[var(--secondary)] text-[var(--foreground)]' : platform === 'WooCommerce' ? 'bg-[var(--secondary)] text-[var(--foreground)]' : 'bg-[var(--secondary)] text-[var(--foreground)]'}`}>{platform === 'Shopify' ? 'S' : platform === 'WooCommerce' ? 'W' : 'Wf'}</span>;
}
function SectionTitle({
  icon,
  title,
  count,
  tone = 'amber'
}: {
  icon: React.ReactNode;
  title: string;
  count?: string;
  tone?: string;
}) {
  return <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><span className={`rounded-lg p-1.5 ${tone === 'red' ? 'bg-chart-5/10 text-chart-5' : 'bg-secondary text-foreground'}`}>{icon}</span><h2 className="text-[15px] font-bold tracking-[-.01em] text-foreground">{title}</h2>{count && <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-muted-foreground">{count}</span>}</div><button className="text-xs font-semibold text-foreground hover:text-foreground">View All <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></button></div>;
}
export function LuluOrders() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [mobileNav, setMobileNav] = useState(false);
  const visible = useMemo(() => orders.filter(o => `${o.id} ${o.customer} ${o.store} ${o.platform}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const toggle = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
  <aside className={`fixed inset-y-0 left-0 z-30 flex w-[246px] flex-col bg-[var(--sidebar)] text-muted-foreground transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
   <div className="flex h-[74px] items-center gap-3 border-b border-border/[.07] px-6"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_22px_rgba(0,0,0,.45)]"><Sparkles className="h-4 w-4" /></div><span className="text-[17px] font-bold tracking-[-.03em] text-foreground">Lulu <span className="font-normal text-muted-foreground">AI</span></span></div>
   <LuluSectionNavigation activeId="mightily-shore-7108" /><div className="border-t border-border/[.07] p-4"><div className="flex items-center gap-3 rounded-xl p-2 hover:bg-secondary"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">JD</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-foreground">Jamie Davis</p><p className="truncate text-[11px] text-muted-foreground">Administrator</p></div><MoreHorizontal className="h-4 w-4" /></div></div>
  </aside>
  <main className="lg:ml-[246px]"><header className="border-b border-border/80 bg-card px-5 py-5 sm:px-8"><div className="flex items-start justify-between gap-4"><div className="flex items-start gap-3"><button onClick={() => setMobileNav(true)} className="mt-1 rounded-lg p-1.5 hover:bg-sidebar lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button><div><p className="mb-2 text-xs font-medium text-muted-foreground">Ecommerce <span className="px-1 text-foreground">/</span> <span className="text-muted-foreground">Orders</span></p><h1 className="text-[27px] font-bold tracking-[-.045em] text-foreground">Orders</h1><p className="mt-1 text-[13px] text-muted-foreground">Manage and monitor orders across all connected ecommerce stores.</p></div></div><div className="hidden items-center gap-2 sm:flex"><button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary"><Sparkles className="h-3.5 w-3.5" />Ask Lulu AI</button><button aria-label="Refresh" className="rounded-lg border border-border p-2 text-foreground hover:bg-card"><RefreshCw className="h-4 w-4" /></button><button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-card"><ArrowDownToLine className="h-3.5 w-3.5" />Export</button><button aria-label="More actions" className="rounded-lg border border-border p-2 text-foreground"><Ellipsis className="h-4 w-4" /></button></div></div></header>
   <div className="space-y-5 p-5 sm:p-8"><section className="flex flex-wrap items-center gap-2"><button className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-sm"><Store className="h-4 w-4 text-foreground" />All Stores<ChevronDown className="ml-2 h-3.5 w-3.5 text-muted-foreground" /></button><button className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-sm"><Clock3 className="h-4 w-4 text-muted-foreground" />Last 30 Days<ChevronDown className="ml-2 h-3.5 w-3.5 text-muted-foreground" /></button><div className="relative min-w-[220px] flex-1 sm:max-w-[360px]"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-xs outline-none ring-ring placeholder:text-muted-foreground focus:ring-2" placeholder="Search by order ID, customer, SKU, tracking number..." /></div><button className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-sm"><Filter className="h-4 w-4" />Filters <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] text-foreground">2</span></button><div className="flex gap-2"><span className="rounded-full border border-border bg-secondary px-3 py-1.5 text-[11px] font-semibold text-foreground">Needs attention <X className="ml-1 inline h-3 w-3" /></span><span className="hidden rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-muted-foreground sm:inline-flex">All channels</span></div></section>
   <section className="grid auto-cols-[160px] grid-flow-col gap-3 overflow-x-auto pb-1 sm:grid-flow-row sm:grid-cols-4 xl:grid-cols-8">{summary.map(item => <article key={item.label} className="min-h-[100px] rounded-xl border border-border/80 bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,.025)]"><div className="mb-3 flex items-center justify-between"><span className={`h-2 w-2 rounded-full ${item.tone === 'amber' ? 'bg-chart-1' : item.tone === 'green' ? 'bg-chart-4' : item.tone === 'teal' ? 'bg-primary' : item.tone === 'orange' ? 'bg-chart-1' : item.tone === 'gray' ? 'bg-muted' : item.tone === 'purple' ? 'bg-primary' : 'bg-primary'}`} /><span className="text-[10px] text-muted-foreground">{item.sub}</span></div><p className="text-xl font-bold tracking-[-.03em] text-foreground">{item.value}</p><p className="mt-1 whitespace-nowrap text-[11px] font-medium text-muted-foreground">{item.label}</p></article>)}</section>
   <section className="rounded-xl border border-chart-1/80 border-l-4 border-l-chart-1 bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,.025)]"><SectionTitle icon={<AlertCircle className="h-4 w-4" />} title="Orders Requiring Attention" count="14" /> <div className="mt-4 flex gap-2 overflow-x-auto">{attention.map(item => <button key={item.label} className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:border-border hover:bg-secondary"><span>{item.label}</span><b className="rounded-full bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground">{item.count}</b></button>)}</div></section>
   <section className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-[0_2px_8px_rgba(0,0,0,.025)]"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4"><div className="flex items-center gap-2"><h2 className="text-[15px] font-bold text-foreground">All Orders</h2><span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-muted-foreground">1,284</span></div>{selected.length > 0 ? <div className="flex items-center gap-2 text-xs"><span className="font-semibold text-muted-foreground">{selected.length} orders selected</span><button className="rounded-md bg-primary px-2.5 py-1.5 font-semibold text-primary-foreground">Mark as Fulfilled</button><button className="rounded-md border border-border px-2.5 py-1.5 font-semibold">Export</button><button onClick={() => setSelected([])} className="text-foreground underline">Clear</button></div> : <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground"><ListFilter className="h-4 w-4" />Manage columns</button>}</div><div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left text-xs"><thead className="sticky top-0 z-10 bg-secondary/95 text-[10px] uppercase tracking-[.08em] text-muted-foreground"><tr><th className="w-10 px-5 py-3"><input type="checkbox" aria-label="Select all orders" checked={selected.length === visible.length && visible.length > 0} onChange={e => setSelected(e.target.checked ? visible.map(o => o.id) : [])} /></th>{['Order', 'Date', 'Store', 'Customer', 'Products', 'Total', 'Payment', 'Fulfillment', 'Shipping', 'Status', 'Updated', 'Actions'].map(label => <th key={label} className="whitespace-nowrap px-3 py-3 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-border">{visible.map(order => <tr key={order.id} className={`transition-colors hover:bg-secondary/40 ${order.attention ? 'bg-chart-1/35' : ''}`}><td className="px-5 py-3.5"><input type="checkbox" aria-label={`Select ${order.id}`} checked={selected.includes(order.id)} onChange={() => toggle(order.id)} /></td><td className="px-3 py-3.5 font-bold text-foreground">{order.id}</td><td className="whitespace-nowrap px-3 py-3.5 text-muted-foreground">{order.date}</td><td className="px-3 py-3.5"><span className="flex items-center gap-2 whitespace-nowrap"><PlatformIcon platform={order.platform} /><span><b className="block text-[11px] font-semibold text-foreground">{order.platform}</b><small className="text-[10px] text-muted-foreground">{order.store}</small></span></span></td><td className="whitespace-nowrap px-3 py-3.5 font-medium text-foreground">{order.customer}</td><td className="whitespace-nowrap px-3 py-3.5 text-muted-foreground">{order.products}</td><td className="whitespace-nowrap px-3 py-3.5 font-semibold text-foreground">{order.total}</td><td className="px-3 py-3.5"><span className={`whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-semibold ${order.payment.startsWith('Failed') ? 'bg-chart-5/10 text-chart-5' : order.payment.startsWith('Pending') ? 'bg-chart-1/10 text-chart-1' : order.payment === 'Refunded' ? 'bg-secondary text-muted-foreground' : 'bg-secondary text-foreground'}`}>{order.payment}</span></td><td className="whitespace-nowrap px-3 py-3.5 text-[11px] text-muted-foreground">{order.fulfillment}</td><td className="whitespace-nowrap px-3 py-3.5 text-[11px] text-muted-foreground">{order.shipping}</td><td className="px-3 py-3.5"><span className={`whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-bold ${pillTone[order.tone]}`}>{order.status}</span></td><td className="whitespace-nowrap px-3 py-3.5 text-[11px] text-muted-foreground">{order.updated}</td><td className="px-3 py-3.5"><button className="mr-2 rounded-md border border-border px-2 py-1 text-[10px] font-semibold text-foreground hover:bg-card">Open</button><button aria-label={`More actions for ${order.id}`}><MoreHorizontal className="inline h-4 w-4 text-muted-foreground" /></button></td></tr>)}</tbody></table></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-xs text-muted-foreground"><span>Showing <b>1–25</b> of <b>1,284</b> orders</span><div className="flex items-center gap-1"><button className="rounded p-1 hover:bg-secondary"><ChevronLeft className="h-4 w-4" /></button><button className="rounded bg-primary px-2 py-1 font-bold text-primary-foreground">1</button><button className="rounded px-2 py-1 hover:bg-secondary">2</button><button className="rounded px-2 py-1 hover:bg-secondary">3</button><span>...</span><button className="rounded px-2 py-1 hover:bg-secondary">52</button><button className="rounded p-1 hover:bg-secondary"><ChevronRight className="h-4 w-4" /></button></div></div></section>
   <section className="rounded-xl border border-chart-5/80 border-l-4 border-l-chart-5 bg-card p-5"><SectionTitle icon={<X className="h-4 w-4" />} title="Failed Orders" count="3" tone="red" /><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Order #', 'Customer', 'Store', 'Issue', 'Time', 'Actions'].map(x => <th key={x} className="pb-2 font-semibold">{x}</th>)}</tr></thead><tbody className="divide-y divide-border"><tr><td className="py-3 font-bold text-foreground">#10480</td><td>Mike Johnson</td><td><span className="flex items-center gap-1.5"><PlatformIcon platform="Shopify" />Shopify</span></td><td><span className="rounded-full bg-chart-5/10 px-2 py-1 text-[10px] font-semibold text-chart-5">Payment Failed</span></td><td className="text-muted-foreground">6h ago</td><td><button className="font-semibold text-foreground">Open Order</button><button className="ml-3 font-semibold text-foreground">Resolve</button></td></tr><tr><td className="py-3 font-bold text-foreground">#10471</td><td>Carl Peters</td><td><span className="flex items-center gap-1.5"><PlatformIcon platform="WooCommerce" />WooCommerce</span></td><td><span className="rounded-full bg-chart-5/10 px-2 py-1 text-[10px] font-semibold text-chart-5">Platform Sync Error</span></td><td className="text-muted-foreground">1d ago</td><td><button className="font-semibold text-foreground">Open Order</button><button className="ml-3 font-semibold text-foreground">Resolve</button></td></tr><tr><td className="py-3 font-bold text-foreground">#10465</td><td>Anna White</td><td><span className="flex items-center gap-1.5"><PlatformIcon platform="Shopify" />Shopify</span></td><td><span className="rounded-full bg-chart-5/10 px-2 py-1 text-[10px] font-semibold text-chart-5">Inventory Unavailable</span></td><td className="text-muted-foreground">2d ago</td><td><button className="font-semibold text-foreground">Open Order</button><button className="ml-3 font-semibold text-foreground">Resolve</button></td></tr></tbody></table></div></section>
   <section className="grid gap-5 xl:grid-cols-3">{[{
            title: 'Payment Issues',
            icon: <CreditCard className="h-4 w-4" />,
            count: '5',
            items: ['Payment Pending · #10478 · #10469', 'Partial Payment · #10455', 'Refund Pending · #10461 · #10458']
          }, {
            title: 'Fulfillment Issues',
            icon: <Package className="h-4 w-4" />,
            count: '4',
            items: ['Aging unfulfilled · #10482 · 2d', 'Aging unfulfilled · #10474 · 3d', 'Missing location · #10467', 'Fulfillment failure · #10463']
          }, {
            title: 'Shipping Issues',
            icon: <Truck className="h-4 w-4" />,
            count: '2',
            items: ['Delayed shipment · #10471 — Carrier delay reported', 'Failed delivery · #10459 — Address issue']
          }].map(item => <article key={item.title} className="rounded-xl border border-border/80 bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,.025)]"><div className="flex items-center gap-2"><span className="rounded-lg bg-secondary p-1.5 text-foreground">{item.icon}</span><h2 className="text-[15px] font-bold text-foreground">{item.title}</h2><span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-foreground">{item.count}</span></div><ul className="mt-3 divide-y divide-border">{item.items.map(line => <li key={line} className="flex items-center justify-between gap-2 py-3 text-[11px] text-muted-foreground"><span>{line}</span><button className="shrink-0 font-semibold text-foreground">Open</button></li>)}</ul></article>)}</section>
   <section className="grid gap-5 xl:grid-cols-3"><article className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex items-center gap-2"><span className="rounded-lg bg-secondary p-1.5 text-foreground"><Sparkles className="h-4 w-4" /></span><h2 className="text-[15px] font-bold text-muted-foreground">Ask Lulu AI</h2></div><div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-card p-2"><input className="min-w-0 flex-1 bg-transparent px-2 text-xs outline-none" placeholder="Ask Lulu AI about your orders..." /><button aria-label="Ask Lulu AI" className="rounded-md bg-primary p-2 text-primary-foreground"><ArrowRight className="h-3.5 w-3.5" /></button></div><div className="mt-3 flex flex-wrap gap-1.5">{['Which orders need attention?', 'Find delayed orders', 'Payment issues today', 'Prioritize unfulfilled orders'].map(x => <button key={x} className="rounded-full border border-border bg-card px-2.5 py-1.5 text-[10px] font-medium text-foreground">{x}</button>)}</div><div className="mt-4 rounded-lg border border-border bg-card p-3"><p className="text-[11px] font-semibold text-foreground">⚡ AI Priority: Order #10482</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">Payment confirmed but fulfillment has not started. This order has exceeded the expected processing window.</p><button className="mt-2 text-[11px] font-bold text-foreground">Open Order</button></div></article><article className="rounded-xl border border-border/80 bg-card p-5"><h2 className="text-[15px] font-bold text-foreground">Order Operations Health</h2><ul className="mt-3 divide-y divide-border">{['Payment Health|Healthy|98.5% success rate', 'Fulfillment Health|Attention Required|7.5% pending >48h', 'Shipping Health|Healthy|On schedule', 'Sync Health|Healthy|Last sync 4 min ago', 'Cancellation Health|Healthy|2.9% of orders', 'Refund Health|Attention|2 pending'].map(line => {
                const [a, b, c] = line.split('|');
                return <li key={a} className="flex items-center justify-between py-2.5 text-[11px]"><span className="font-medium text-muted-foreground">{a}</span><span className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${b === 'Healthy' ? 'bg-chart-4' : 'bg-primary'}`} /><b className={b === 'Healthy' ? 'text-chart-4' : 'text-foreground'}>{b}</b><span className="hidden text-muted-foreground sm:inline">— {c}</span></span></li>;
              })}</ul></article><article className="rounded-xl border border-border/80 bg-card p-5"><h2 className="text-[15px] font-bold text-foreground">Recent Order Activity</h2><ul className="mt-3 divide-y divide-border">{['🔵 New order #10483 · James Park · 2 min ago', '✅ #10479 delivered · System · 1h ago', '⚡ AI prioritized 3 orders · 2h ago', '💳 Payment received #10481 · 4h ago', '📦 #10476 partially fulfilled · 5h ago', '↩ Refund issued #10466 · 1d ago', '❌ #10480 payment failed · 6h ago'].map(line => <li key={line} className="py-2 text-[11px] leading-snug text-muted-foreground">{line}</li>)}</ul></article></section>
   <section className="rounded-xl border border-border/80 bg-card p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><Cloud className="h-4 w-4 text-foreground" /><h2 className="text-[15px] font-bold text-foreground">Order Synchronization</h2></div><button className="text-xs font-semibold text-foreground">View Sync Details <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></button></div><div className="mt-4 grid gap-3 md:grid-cols-3">{['Lulu Store (Shopify): Synced ✓ — last sync 4 min ago', 'Main Shop (WooCommerce): Synced ✓ — last sync 4 min ago', 'Webflow Store: Syncing ↻ — last sync 8 min ago'].map((x, i) => <div key={x} className="rounded-lg bg-card px-3 py-2.5 text-[11px] font-medium text-muted-foreground"><span className={`mr-2 inline-block h-2 w-2 rounded-full ${i === 2 ? 'bg-primary' : 'bg-primary'}`} />{x}</div>)}</div></section>
  </div></main>{mobileNav && <button onClick={() => setMobileNav(false)} className="fixed inset-0 z-20 bg-sidebar/40 lg:hidden" aria-label="Close navigation" />}
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