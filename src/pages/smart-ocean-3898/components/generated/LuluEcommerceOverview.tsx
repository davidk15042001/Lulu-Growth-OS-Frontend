import { useMemo, useState, type ReactNode } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Box, ChevronDown, ChevronRight, CircleHelp, Clock3, CreditCard, Database, ExternalLink, Filter, Grid2X2, HeartPulse, LayoutDashboard, Menu, MoreHorizontal, PackageCheck, PanelLeft, Plus, RefreshCw, Search, Settings, ShoppingBag, ShoppingCart, Sparkles, Store, Truck, UserRound, Users, X, Zap } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type Tone = 'teal' | 'amber' | 'red' | 'violet' | 'blue' | 'slate';
type Order = {
  id: string;
  customer: string;
  products: string;
  total: string;
  payment: string;
  fulfillment: string;
  date: string;
  store: string;
  tone: Tone;
};
const navItems = [{
  label: 'Overview',
  icon: LayoutDashboard,
  active: true
}, {
  label: 'Stores',
  icon: Store
}, {
  label: 'Products',
  icon: Box
}, {
  label: 'Categories',
  icon: Grid2X2
}, {
  label: 'Orders',
  icon: ShoppingBag
}, {
  label: 'Customers',
  icon: Users
}, {
  label: 'Carts',
  icon: ShoppingCart
}, {
  label: 'Abandoned Carts',
  icon: ShoppingCart
}, {
  label: 'Discounts',
  icon: Zap
}, {
  label: 'Promotions',
  icon: Sparkles
}, {
  label: 'Returns',
  icon: ArrowDownRight
}, {
  label: 'Refunds',
  icon: CreditCard
}, {
  label: 'Shipping',
  icon: Truck
}, {
  label: 'Inventory',
  icon: PackageCheck
}, {
  label: 'Ecommerce Automation',
  icon: Zap
}, {
  label: 'Ecommerce Settings',
  icon: Settings
}];
const orders: Order[] = [];
const stages: Array<Record<string, any>> = [];
const inventoryRows: Array<Record<string, any>> = [];
const activity = ['New order #10847 from Connected customer — —', 'Order #10839 fulfilled and shipped', 'Payment received for order #10845', 'Refund issued for order #10821 — —', 'New customer Maria Garcia registered', 'Cart abandoned — —', 'Inventory updated: 50 units added to Cotton Tee', 'Store sync completed — Connected store'];
const toneClass: Record<Tone, string> = {
  teal: 'text-foreground bg-secondary',
  amber: 'text-foreground bg-secondary',
  red: 'text-chart-5 bg-chart-5/10',
  violet: 'text-chart-2 bg-chart-2/10',
  blue: 'text-chart-3 bg-chart-3/10',
  slate: 'text-muted-foreground bg-secondary'
};
function Sparkline({
  color = 'var(--chart-2)'
}: {
  color?: string;
}) {
  return <svg viewBox="0 0 100 28" className="h-7 w-24" role="img" aria-label="Upward trend sparkline"><polyline fill="none" stroke={color} strokeWidth="2.5" points="0,23 12,19 24,21 36,12 48,17 60,8 72,13 84,5 100,8" /><circle cx="100" cy="8" r="2.5" fill={color} /></svg>;
}
function Card({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`rounded-lg border border-border bg-card shadow-[0_2px_10px_rgba(0,0,0,0.04)] ${className}`}>{children}</section>;
}
function SectionTitle({
  title,
  badge,
  action
}: {
  title: string;
  badge?: string;
  action?: string;
}) {
  return <header className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-2"><h2 className="text-[15px] font-bold text-foreground">{title}</h2>{badge && <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-foreground">{badge}</span>}</div>{action && <button className="text-xs font-semibold text-foreground hover:text-foreground">{action} <span aria-hidden="true">→</span></button>}</header>;
}
function MiniMetric({
  label,
  value,
  detail,
  tone = 'slate'
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: Tone;
}) {
  return <div className="rounded-md border border-border bg-card/70 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-lg font-bold text-foreground">{value}</p>{detail && <p className={`mt-1 text-[11px] font-semibold ${toneClass[tone].split(' ')[0]}`}>{detail}</p>}</div>;
}
export function LuluEcommerceOverview() {
  const [mobileNav, setMobileNav] = useState(false);
  const [range, setRange] = useState('30 Days');
  const [chartRange, setChartRange] = useState('7 Days');
  const [store, setStore] = useState('All Stores');
  const [query, setQuery] = useState('');
  const { items: orderRecords, loading: ordersLoading, error: ordersError } = useLiveRecords('ecommerce_orders');
  const { items: customerRecords, loading: customersLoading, error: customersError } = useLiveRecords('ecommerce_customers');
  const { items: storeRecords, loading: storesLoading, error: storesError } = useLiveRecords('ecommerce_stores');
  const ecommerceLoading = ordersLoading || customersLoading || storesLoading;
  const ecommerceError = ordersError || customersError || storesError;
  const getEcommerceField = (record: typeof orderRecords[number], key: string) => String((record as unknown as Record<string, unknown>)[key] ?? '');
  const liveOrders: Order[] = orderRecords.map(record => ({ id: record.id, customer: getEcommerceField(record, 'customerName') || getEcommerceField(record, 'customer') || 'Connected customer', products: getEcommerceField(record, 'products') || '—', total: record.valueAmount || '—', payment: getEcommerceField(record, 'paymentStatus') || 'Recorded', fulfillment: getEcommerceField(record, 'fulfillmentStatus') || 'Recorded', date: record.updatedAt || '—', store: getEcommerceField(record, 'storeName') || 'Connected store', tone: 'slate' }));
  const liveSnapshot: Array<[string, string, string, Tone]> = [];
  const visibleOrders: Order[] = useMemo(() => (ecommerceLoading ? [] : liveOrders).filter(order => order.customer.toLowerCase().includes(query.toLowerCase()) || order.id.includes(query)), [ecommerceLoading, liveOrders, query]);
  return <div className="min-h-screen bg-[var(--background)] font-sans text-foreground">
    <aside className={`fixed inset-y-0 left-0 z-30 w-[246px] bg-[var(--sidebar)] text-foreground transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex h-full flex-col"><div className="flex h-[72px] items-center gap-3 border-b border-border px-6"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-sm font-black text-primary-foreground">L</div><span className="text-lg font-bold tracking-tight text-foreground">LULU <span className="font-normal text-muted-foreground">AI</span></span><button className="ml-auto text-foreground lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18} /></button></div><LuluSectionNavigation activeId="smart-ocean-3898" /><div className="border-t border-border p-4"><div className="flex items-center gap-3 rounded-md bg-secondary p-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">JD</div><div><p className="text-xs font-semibold text-foreground">Workspace owner</p><p className="text-[11px] text-muted-foreground">Administrator</p></div><MoreHorizontal size={16} className="ml-auto text-muted-foreground" /></div></div></div></aside>
    <div className="lg:pl-[246px]"><header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border bg-secondary px-5 backdrop-blur lg:px-8"><div className="flex items-center gap-3"><button className="rounded-md p-2 hover:bg-sidebar lg:hidden" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={20} /></button><div><p className="text-xs font-medium text-muted-foreground">Ecommerce <span className="px-1">/</span> <span className="text-foreground">Overview</span></p><h1 className="mt-1 text-xl font-bold tracking-tight text-foreground">Ecommerce Overview</h1></div></div><div className="flex items-center gap-2"><button className="hidden items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-xs font-bold text-foreground sm:flex"><Sparkles size={14} /> Ask Lulu AI</button><button className="rounded-md border border-border p-2 text-foreground hover:bg-card" aria-label="Refresh"><RefreshCw size={16} /></button><button className="hidden rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary sm:block">Create Report</button><button className="rounded-md border border-border p-2 text-foreground" aria-label="More actions"><MoreHorizontal size={17} /></button></div></header>
    <main className="mx-auto max-w-[1480px] space-y-7 p-5 lg:p-8">{ecommerceError && <div role="alert" className="rounded-lg border border-chart-5/30 bg-chart-5/10 px-4 py-3 text-sm text-chart-5">Ecommerce overview data could not be loaded. Check connected stores, orders and customers, then try again.</div>}{!ecommerceLoading && !ecommerceError && orderRecords.length === 0 && customerRecords.length === 0 && storeRecords.length === 0 && <></>}<p className="-mt-3 max-w-2xl text-sm text-muted-foreground">Monitor your ecommerce business, stores, orders, customers, products and operations from one place.</p>
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-secondary/70 px-4 py-3 text-xs text-foreground sm:flex-row sm:items-center"><span className="font-semibold">● All ecommerce systems operational</span><span className="text-foreground/80">Last sync: 2 minutes ago · 2 stores connected</span><button className="font-bold underline sm:ml-auto">View Integrations</button></div>
      <div className="flex flex-col justify-between gap-3 rounded-lg border border-border bg-card p-3 shadow-sm sm:flex-row"><label className="flex min-w-[220px] items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground"> <Store size={16} className="text-foreground" /><select value={store} onChange={e => setStore(e.target.value)} className="w-full bg-transparent outline-none"><option>All Stores · No live data</option><option>Connected store · Shopify ● Connected</option><option>Brand Store · WooCommerce ● Connected</option></select><ChevronDown size={15} /></label><label className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground"><Clock3 size={15} className="text-muted-foreground" /><select value={range} onChange={e => setRange(e.target.value)} className="bg-transparent font-semibold outline-none"><option>Last 30 Days</option><option>Last 7 Days</option><option>Today</option></select><ChevronDown size={15} /></label></div>
      <div><SectionTitle title="Ecommerce Snapshot" /><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{(ecommerceLoading ? [] : liveSnapshot).map(([label, value, detail, tone]) => <Card key={label} className="p-4"><div className="flex items-start justify-between"><p className="text-xs font-semibold text-muted-foreground">{label}</p><span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">All stores</span></div><p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{value}</p><div className="mt-2 flex items-center justify-between"><p className={`text-[11px] font-semibold ${toneClass[tone as Tone].split(' ')[0]}`}>{detail}</p>{label !== 'Customers' && label !== 'Pending Orders' && label !== 'Unfulfilled Orders' && <Sparkline color={tone === 'amber' ? 'var(--chart-1)' : 'var(--chart-2)'} />}</div>{label === 'Customers' && <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-secondary"><span className="w-[76%] bg-primary text-primary-foreground" /><span className="w-[24%] bg-primary text-primary-foreground" /></div>}</Card>)}</div></div>
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]"><Card className="p-5"><SectionTitle title="Revenue Activity" /><div className="mb-4 flex gap-1 rounded-md bg-secondary p-1 text-xs font-semibold w-fit">{['Today', '7 Days', '30 Days'].map(item => <button key={item} onClick={() => setChartRange(item)} className={`rounded px-3 py-1.5 ${chartRange === item ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}>{item}</button>)}</div><div className="relative h-48 border-b border-l border-border bg-[linear-gradient(to_bottom,transparent_24%,var(--secondary)_25%,transparent_26%,transparent_49%,var(--secondary)_50%,transparent_51%,transparent_74%,var(--background)_75%,transparent_76%)]"><svg viewBox="0 0 700 190" preserveAspectRatio="none" className="h-full w-full"><path d="M0 145 C80 128 90 140 150 112 S240 130 290 80 S380 120 430 70 S530 100 590 45 S650 75 700 22 L700 190 L0 190Z" fill="var(--chart-2)" fillOpacity=".13" /><path d="M0 145 C80 128 90 140 150 112 S240 130 290 80 S380 120 430 70 S530 100 590 45 S650 75 700 22" fill="none" stroke="var(--chart-2)" strokeWidth="3" /><path d="M0 158 C100 150 120 162 200 143 S310 150 380 123 S470 140 540 109 S630 116 700 92" fill="none" stroke="var(--foreground)" strokeWidth="2.5" /></svg></div><div className="mt-5 grid grid-cols-3 gap-3"><div><p className="text-[11px] text-muted-foreground">Total Revenue</p><p className="font-bold text-foreground">—</p></div><div><p className="text-[11px] text-muted-foreground">Total Orders</p><p className="font-bold text-foreground">1,842</p></div><div><p className="text-[11px] text-muted-foreground">Peak Hour</p><p className="font-bold text-foreground">12–1 PM</p></div></div><button className="mt-5 text-xs font-bold text-foreground">→ View Revenue Intelligence</button></Card><Card className="p-5"><SectionTitle title="Order Activity" /><div className="space-y-3">{[...stages, {
                name: 'Cancelled',
                count: 8,
                color: 'bg-secondary text-muted-foreground'
              }, {
                name: 'Refunded',
                count: 5,
                color: 'bg-chart-5/10 text-chart-5'
              }].map(stage => <div key={stage.name} className="flex items-center gap-3 text-xs"><span className="w-20 font-medium text-muted-foreground">{stage.name}</span><div className="h-2 flex-1 rounded-full bg-secondary"><div className={`h-2 rounded-full ${stage.name === 'Refunded' ? 'bg-destructive' : stage.name === 'Delivered' ? 'bg-primary' : stage.name === 'Fulfilled' ? 'bg-primary' : 'bg-primary'}`} style={{
                    width: `${Math.min(stage.count / 1.7, 100)}%`
                  }} /></div><strong className="w-7 text-right text-foreground">{stage.count}</strong></div>)}</div><div className="mt-5 flex items-center justify-between border-t border-border pt-4"><span className="text-xs text-muted-foreground">Total orders <strong className="text-foreground">403</strong></span><button className="rounded-md border border-border px-3 py-2 text-xs font-bold text-foreground">View Orders</button></div></Card></div>
      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]"><Card className="overflow-hidden"><div className="p-5 pb-3"><SectionTitle title="Recent Orders" action="View All Orders" /><div className="flex gap-2"><label className="flex flex-1 items-center gap-2 rounded-md border border-border px-3 py-2"><Search size={15} className="text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search orders or customers" className="w-full text-xs outline-none" aria-label="Search orders" /></label><button className="rounded-md border border-border px-3 text-xs font-semibold"><Filter size={14} className="mr-1 inline" /> Filter</button><button className="hidden rounded-md border border-border px-3 text-xs font-semibold sm:block">Sort: Recent</button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="border-y border-border bg-card text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Order ID', 'Customer', 'Products', 'Total', 'Payment', 'Fulfillment', 'Date', ''].map(x => <th key={x} className="px-5 py-3 font-bold">{x}</th>)}</tr></thead><tbody>{visibleOrders.map(order => <tr key={order.id} className="border-b border-border last:border-0 hover:bg-card"><td className="px-5 py-3 font-bold text-foreground">{order.id}<span className="mt-1 block text-[10px] font-normal text-muted-foreground">{order.store}</span></td><td className="px-5 py-3 font-semibold text-foreground">{order.customer}</td><td className="px-5 py-3 text-muted-foreground">{order.products}</td><td className="px-5 py-3 font-bold text-foreground">{order.total}</td><td className="px-5 py-3"><span className={order.payment === 'Paid' ? 'text-foreground' : 'text-foreground'}>● {order.payment}</span></td><td className="px-5 py-3"><span className={toneClass[order.tone].split(' ')[0]}>● {order.fulfillment}</span></td><td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{order.date}</td><td className="px-5 py-3"><button className="font-bold text-foreground">Open</button></td></tr>)}</tbody></table></div><p className="p-4 text-xs text-muted-foreground">Showing 1–6 of 247 orders</p></Card><Card className="p-5"><SectionTitle title="Order Status" /><div className="flex flex-wrap items-center gap-1">{stages.map((stage, idx) => <div key={stage.name} className="flex items-center gap-1"><div className={`min-w-[72px] rounded-md p-2.5 ${stage.color}`}><p className="text-[10px] font-semibold">{stage.name}</p><strong className="text-lg">{stage.count}</strong></div>{idx < stages.length - 1 && <ChevronRight size={14} className="text-foreground" />}</div>)}</div><div className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center text-xs"><div><strong className="block text-foreground">8</strong><span className="text-muted-foreground">Cancelled</span></div><div><strong className="block text-foreground">5</strong><span className="text-muted-foreground">Refunded</span></div><div><strong className="block text-foreground">2</strong><span className="text-muted-foreground">Failed</span></div></div></Card></div>
      <div className="grid gap-5 xl:grid-cols-2">{['Pending Orders', 'Unfulfilled Orders'].map((title, idx) => <Card key={title} className="p-5"><SectionTitle title={title} badge={idx ? '89' : '34'} /><div className="mb-3 flex gap-1 overflow-x-auto border-b border-border pb-2 text-xs font-semibold">{(idx ? ['All', '<24h', '24-48h', '>48h'] : ['Payment Pending (12)', 'Processing (18)', 'Fulfillment Pending (4)']).map(tab => <button key={tab} className="whitespace-nowrap rounded px-3 py-1.5 text-foreground hover:bg-secondary hover:text-foreground">{tab}</button>)}</div><div className="space-y-2">{(idx ? [['#10831', 'Olivia Martin', '3', '52h', 'Critical'], ['#10826', 'Noah Williams', '2', '31h', 'Attention'], ['#10819', 'Liam Davis', '1', '18h', 'Queued']] : [['#10844', 'Workspace contact', '—', 'Payment pending', '22m'], ['#10838', 'Ava Smith', '—', 'Address review', '1h'], ['#10831', 'Olivia Martin', '—', 'Payment pending', '2h']]).map(row => <div key={row[0]} className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 border-l-2 ${idx && row[3] === '52h' ? 'border-chart-5' : 'border-chart-1'} bg-card px-3 py-2.5 text-xs`}><strong className="text-foreground">{row[0]}</strong><span><b className="block text-foreground">{row[1]}</b><small className="text-muted-foreground">{idx ? `${row[2]} items · ${row[3]}` : row[3]}</small></span><strong className="text-foreground">{idx ? row[4] : row[2]}</strong></div>)}</div><button className="mt-4 rounded-md border border-border px-3 py-2 text-xs font-bold">View Orders</button></Card>)}</div>
      <div className="grid gap-5 xl:grid-cols-3"><Card className="p-5"><SectionTitle title="Customer Snapshot" /><div className="grid grid-cols-2 gap-2"><MiniMetric label="New Customers" value="189" detail="↑ 12%" tone="teal" /><MiniMetric label="Returning" value="58" detail="↑ 4%" tone="teal" /><MiniMetric label="Active This Month" value="1,247" /><MiniMetric label="With Recent Orders" value="892" /></div><div className="mt-4 flex gap-2"><button className="rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">View Customers</button><button className="rounded-md border border-border px-3 py-2 text-xs font-bold">Customer Intelligence ↗</button></div></Card><Card className="p-5"><SectionTitle title="Product Snapshot" /><div className="grid grid-cols-2 gap-2"><MiniMetric label="Total Products" value="1,247" /><MiniMetric label="Active" value="1,182" detail="94.8%" tone="teal" /><MiniMetric label="Out of Stock" value="23" detail="Needs attention" tone="red" /><MiniMetric label="Low Stock" value="41" detail="Monitor" tone="amber" /></div><p className="mt-4 text-xs text-muted-foreground">✦ <strong className="text-foreground">12 new products</strong> added this week</p><button className="mt-3 rounded-md border border-border px-3 py-2 text-xs font-bold">View Products</button></Card><Card className="p-5"><SectionTitle title="Inventory Status" /><div className="flex items-center gap-5"><div className="grid h-28 w-28 shrink-0 place-items-center rounded-full" style={{
                background: 'conic-gradient(var(--primary) 0 92%, var(--primary) 92% 97%, var(--destructive) 97% 100%)'
              }}><div className="grid h-20 w-20 place-items-center rounded-full bg-card text-center"><strong className="text-xl text-foreground">—</strong><span className="text-[10px] text-muted-foreground">in stock</span></div></div><div className="space-y-2 text-xs"><p><b className="text-foreground">●</b> In Stock: <strong>1,159</strong></p><p><b className="text-foreground">●</b> Low Stock: <strong>41</strong></p><p><b className="text-chart-5">●</b> Out of Stock: <strong>23</strong></p></div></div><button className="mt-4 rounded-md border border-border px-3 py-2 text-xs font-bold">View Inventory</button></Card></div>
      <div className="grid gap-5 xl:grid-cols-2">{['Low Stock', 'Out of Stock'].map((title, idx) => <Card key={title} className="p-5"><SectionTitle title={title} badge={idx ? '23' : '41'} /><div className="overflow-x-auto"><table className="w-full min-w-[500px] text-left text-xs"><thead className="text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{(idx ? ['Product', 'SKU', 'Store', 'Last Available'] : ['Product', 'SKU', 'Current Stock', 'Threshold', 'Store']).map(h => <th key={h} className="border-b border-border px-2 py-2 font-bold">{h}</th>)}</tr></thead><tbody>{(idx ? [['Premium Hoodie (Black/XL)', 'SKU-50291', 'Connected store', '2 days ago'], ['Phone Case Pro', 'SKU-60847', 'Brand Store', '5 days ago'], ['Yoga Mat', 'SKU-70124', 'Connected store', '1 day ago'], ['Canvas Backpack', 'SKU-80381', 'Brand Store', '3 days ago']] : inventoryRows.map(r => [r.product, r.sku, r.stock, r.threshold, r.store])).map(row => <tr key={row[0]} className={`border-b border-border ${idx ? 'border-l-2 border-l-chart-5/30' : ''}`}><td className="px-2 py-2.5 font-semibold text-foreground">{row[0]}</td>{row.slice(1).map((cell, cellIndex) => <td key={`${row[0]}-${cellIndex}`} className={`px-2 py-2.5 ${!idx && cellIndex === 1 ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>{cell}</td>)}</tr>)}</tbody></table></div><button className="mt-4 rounded-md border border-border px-3 py-2 text-xs font-bold">View Inventory</button></Card>)}</div>
      <div className="grid gap-5 xl:grid-cols-2"><Card className="p-5"><SectionTitle title="Cart Activity" /><div className="grid grid-cols-2 gap-2"><MiniMetric label="Active Carts" value="284" /><MiniMetric label="Abandoned Carts" value="891" tone="amber" /><MiniMetric label="Active Cart Value" value="—" /><MiniMetric label="Abandoned Value" value="—" tone="amber" /></div><div className="mt-4 space-y-2 text-xs text-muted-foreground"><p>🛒 <strong>Connected customer added Wireless Earbuds</strong> <span className="text-muted-foreground">2m ago</span></p><p>⚠ <strong>Cart abandoned — —</strong> <span className="text-muted-foreground">42m ago</span></p><p>↗ <strong>Checkout started by Workspace contact</strong> <span className="text-muted-foreground">1h ago</span></p></div><div className="mt-4 flex gap-2"><button className="rounded-md border border-border px-3 py-2 text-xs font-bold">View Carts</button><button className="rounded-md border border-border px-3 py-2 text-xs font-bold">View Abandoned Carts</button></div></Card><Card className="p-5"><SectionTitle title="Abandoned Carts" /><p className="text-3xl font-bold tracking-tight text-foreground">891 <span className="text-sm font-medium text-muted-foreground">abandoned</span></p><p className="mt-1 text-sm text-muted-foreground">— in cart value · <strong className="text-foreground">—</strong> abandonment rate</p><div className="mt-4 space-y-2 text-xs">{[['—', '3 items', '42 min ago', 'Connected store'], ['—', '2 items', '1h ago', 'Brand Store'], ['—', '1 item', '2h ago', 'Connected store']].map(row => <div key={row[0]} className="flex justify-between rounded bg-card px-3 py-2"><b>{row[0]}</b><span>{row[1]}</span><span className="text-muted-foreground">{row[2]}</span><span className="text-foreground">{row[3]}</span></div>)}</div><p className="mt-4 rounded-md bg-secondary px-3 py-2 text-xs font-semibold text-foreground">✨ AI Insight · Abandonment rate is — above baseline this week</p><button className="mt-4 rounded-md border border-border px-3 py-2 text-xs font-bold">View Abandoned Carts</button></Card></div>
      <div className="grid gap-5 md:grid-cols-2">{[['Returns', [['Return Requests', '12'], ['Processing', '7'], ['Completed', '43'], ['Refunds Pending', '8']], 'View Returns'], ['Refunds', [['Pending', '—'], ['Completed', '—'], ['Refund Value', '—'], ['Refund Rate', '2.1%']], 'View Refunds'], ['Shipping', [['Awaiting Shipment', '89'], ['In Transit', '234'], ['Delivered', '1,847'], ['Delayed', '12'], ['Failed', '3']], 'View Shipping'], ['Payment Status', [['Paid', '221'], ['Pending', '18'], ['Failed', '4'], ['Refunded', '5'], ['Partial', '2']], 'View Orders']].map(([title, metrics, action]) => <Card key={title as string} className="p-5"><SectionTitle title={title as string} /><div className="grid grid-cols-2 gap-2">{(metrics as string[][]).map(m => <MiniMetric key={m[0]} label={m[0]} value={m[1]} tone={m[0] === 'Failed' || m[0] === 'Delayed' || m[0] === 'Pending' ? 'amber' : 'slate'} />)}</div><button className="mt-4 rounded-md border border-border px-3 py-2 text-xs font-bold">{action as string}</button></Card>)}</div>
      <div><SectionTitle title="Store Status" /><div className="grid gap-5 md:grid-cols-2"><Card className="border-l-4 border-l-border p-5"><div className="flex justify-between"><div><h3 className="font-bold text-foreground">Connected store <span className="ml-2 rounded bg-secondary px-2 py-1 text-[10px] font-medium">Shopify</span></h3><p className="mt-2 text-xs text-foreground">● Connected <span className="ml-3 text-muted-foreground">● Synced 2 min ago</span></p></div><span className="rounded-full bg-secondary px-2 py-1 text-[11px] font-bold text-foreground">Operational</span></div><p className="mt-5 text-sm text-muted-foreground">Today: <strong className="text-foreground">— revenue</strong> · 142 orders</p><button className="mt-4 rounded-md border border-border px-3 py-2 text-xs font-bold">View Store</button></Card><Card className="border-l-4 border-l-border p-5"><div className="flex justify-between"><div><h3 className="font-bold text-foreground">Brand Store <span className="ml-2 rounded bg-secondary px-2 py-1 text-[10px] font-medium">WooCommerce</span></h3><p className="mt-2 text-xs text-foreground">● Connected <span className="ml-3 text-chart-1">⚠ Sync delayed — 18 min</span></p></div><span className="rounded-full bg-chart-1/10 px-2 py-1 text-[11px] font-bold text-chart-1">Attention Required</span></div><p className="mt-5 text-sm text-muted-foreground">Today: <strong className="text-foreground">— revenue</strong> · 105 orders</p><button className="mt-4 rounded-md border border-border px-3 py-2 text-xs font-bold">View Store</button></Card></div></div>
      <Card className="p-5"><SectionTitle title="Ecommerce Alerts" badge="3" action="View All Alerts" /><div className="space-y-3">{[['WARNING', 'Brand Store sync delayed (18 min)', '2 min ago', 'Brand Store'], ['WARNING', '12 orders unfulfilled beyond 48 hours', '15 min ago', 'Connected store'], ['INFO', 'Abandoned cart rate above baseline this week', '1h ago', 'All Stores']].map((a, i) => <div key={a[1]} className={`flex flex-col gap-2 border-l-4 ${i === 2 ? 'border-border' : 'border-chart-1'} bg-card px-4 py-3 text-xs sm:flex-row sm:items-center`}><span className={`font-bold ${i === 2 ? 'text-foreground' : 'text-chart-1'}`}>{i === 2 ? 'ℹ INFO' : '⚠ WARNING'}</span><strong className="text-foreground">{a[1]}</strong><span className="text-muted-foreground">{a[2]}</span><span className="text-foreground">{a[3]}</span><button className="font-bold text-foreground sm:ml-auto">View</button></div>)}</div></Card>
      <div><SectionTitle title="AI Ecommerce Insights" /><div className="grid gap-4 lg:grid-cols-3">{[['📦', 'Order Processing', 'Order volume increased 12% today compared to the 7-day average. 89 orders are awaiting fulfillment.', 'View Orders'], ['📍', 'Inventory', '23 products are currently out of stock across both stores. Wireless Earbuds Pro is at critical low stock.', 'View Inventory'], ['🔄', 'Abandoned Carts', 'Cart abandonment rate is 75.8%, 8% above recent baseline. — in recoverable cart value.', 'View Carts']].map(insight => <Card key={insight[1]} className="border-border bg-gradient-to-br from-white to-secondary/60 p-5"><div className="flex items-center justify-between"><span className="text-xl">{insight[0]}</span><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-foreground">AI Insight</span></div><h3 className="mt-4 font-bold text-foreground">{insight[1]}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{insight[2]}</p><button className="mt-4 text-xs font-bold text-foreground">{insight[3]} →</button></Card>)}</div><div className="mt-4 flex flex-wrap gap-2">{['Analyze Order Issues', 'Analyze Inventory Risk', 'Analyze Abandoned Carts', 'Analyze Returns', 'Analyze Store Performance', 'Find Ecommerce Opportunities'].map(action => <button key={action} className="rounded-md bg-secondary px-3 py-2 text-xs font-bold text-foreground hover:bg-secondary">{action}</button>)}</div><Card className="mt-5 overflow-hidden border-border"><div className="bg-gradient-to-r from-primary to-primary p-5 text-primary-foreground"><div className="flex items-center gap-2"><Sparkles size={18} /><h2 className="font-bold">Ask Lulu AI</h2><span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">Ecommerce context</span></div><div className="mt-4 flex gap-2"><input placeholder="Ask Lulu AI about your ecommerce business..." className="min-w-0 flex-1 rounded-md bg-card px-4 py-3 text-sm text-muted-foreground outline-none" /><button className="rounded-md bg-secondary px-4 text-xs font-bold">Ask</button></div><div className="mt-3 flex gap-2 overflow-x-auto pb-1">{['How is my ecommerce performing?', 'What needs attention?', 'Which orders need attention?', 'Are there inventory problems?', 'Why are orders being delayed?', 'What’s happening with returns?'].map(prompt => <button key={prompt} className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-[11px] text-foreground/90">{prompt}</button>)}</div></div></Card><p className="mt-3 text-center text-[11px] text-muted-foreground">Insights reference connected ecommerce data only</p></div>
      <div className="grid gap-5 xl:grid-cols-[.8fr_1.5fr]"><Card className="p-5"><SectionTitle title="Quick Actions" /><div className="grid grid-cols-2 gap-2">{['Add Product', 'View Orders', 'View Customers', 'View Inventory', 'View Abandoned Carts', 'Process Returns', 'View Shipping', 'View Stores', 'Create Report', 'Ask Lulu AI'].map((a, i) => <button key={a} className="flex items-center gap-2 rounded-md border border-border px-3 py-3 text-left text-xs font-semibold hover:border-border hover:bg-secondary"><Plus size={14} className={i === 0 ? 'text-foreground' : 'text-muted-foreground'} />{a}</button>)}</div></Card><Card className="p-5"><SectionTitle title="Recent Ecommerce Activity" /><div className="divide-y divide-border">{activity.map((item, i) => <div key={item} className="flex items-center gap-3 py-3 text-xs"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary">{['📦', '✅', '💳', '↩', '👤', '⚠', '📦', '🔄'][i]}</span><span className="font-medium text-foreground">{item}</span><span className="ml-auto whitespace-nowrap text-muted-foreground">{['2 min ago', '8 min ago', '15 min ago', '22 min ago', '35 min ago', '42 min ago', '1h ago', '2h ago'][i]}</span></div>)}</div></Card></div>
      <div className="grid gap-5 xl:grid-cols-3"><Card className="p-5"><SectionTitle title="Ecommerce Automation" /><p className="mb-3 text-sm font-semibold text-foreground">8 active automations</p>{['Order Confirmation · 247 runs today', 'Abandoned Cart Recovery · 89 runs today', 'Low Stock Alert · 41 triggers', 'Customer Welcome · 189 runs', 'Shipping Update · ⚠ 1 failed run'].map((a, i) => <p key={a} className="border-b border-border py-2 text-xs"><span className={i === 4 ? 'text-foreground' : 'text-foreground'}>●</span> <span className="ml-2">{a}</span></p>)}<button className="mt-4 rounded-md border border-border px-3 py-2 text-xs font-bold">View Ecommerce Automation</button></Card><Card className="p-5"><SectionTitle title="Operational Health" /><div className="space-y-2">{['Stores: Healthy', 'Orders: Attention Required', 'Payments: Healthy', 'Fulfillment: Attention Required', 'Inventory: Attention Required', 'Shipping: Healthy', 'Returns: Healthy', 'Synchronization: Attention Required'].map(row => <p key={row} className="flex justify-between text-xs"><span><b className={row.includes('Attention') ? 'text-chart-1' : 'text-foreground'}>●</b> <span className="ml-2">{row.split(':')[0]}</span></span><strong className={row.includes('Attention') ? 'text-chart-1' : 'text-foreground'}>{row.split(':')[1]}</strong></p>)}</div><p className="mt-4 rounded-md bg-chart-1/10 px-3 py-2 text-xs font-bold text-chart-1">Overall health: Attention Required</p></Card><Card className="p-5"><SectionTitle title="Ecommerce Data Sources" /><div className="space-y-3">{[['Connected store', 'Shopify', 'Synced 2 min ago', '100%'], ['Brand Store', 'WooCommerce', '⚠ Sync delayed 18 min', '94%']].map(s => <div key={s[0]} className="rounded-md border border-border p-3 text-xs"><p className="font-bold text-foreground">{s[0]} <span className="ml-2 font-normal text-muted-foreground">{s[1]}</span></p><p className="mt-1 text-foreground">● Connected · {s[2]}</p><p className="mt-1 text-muted-foreground">Coverage: <strong className="text-foreground">{s[3]}</strong></p></div>)}</div><button className="mt-4 rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">Open Integrations</button></Card></div>
    </main></div></div>;
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
