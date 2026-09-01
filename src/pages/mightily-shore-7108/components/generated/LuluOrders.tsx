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
const orders: Order[] = [];
const summary: Array<Record<string, any>> = [];
const attention: Array<Record<string, any>> = [];
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
  <main className="lg:ml-[246px]"><header className="border-b border-border/80 bg-card px-5 py-5 sm:px-8"><div className="flex items-start justify-between gap-4"><div className="flex items-start gap-3"><button onClick={() => setMobileNav(true)} className="mt-1 rounded-lg p-1.5 hover:bg-sidebar lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button><div><p className="mb-2 text-xs font-medium text-muted-foreground">Ecommerce <span className="px-1 text-foreground">/</span> <span className="text-muted-foreground">Orders</span></p><h1 className="text-[27px] font-bold tracking-[-.045em] text-foreground">Orders</h1><p className="mt-1 text-[13px] text-muted-foreground">Manage and monitor orders across all connected ecommerce stores.</p></div></div><div className="hidden items-center gap-2 sm:flex"><button aria-label="Refresh" className="rounded-lg border border-border p-2 text-foreground hover:bg-card"><RefreshCw className="h-4 w-4" /></button><button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-card"><ArrowDownToLine className="h-3.5 w-3.5" />Export</button><button aria-label="More actions" className="rounded-lg border border-border p-2 text-foreground"><Ellipsis className="h-4 w-4" /></button></div></div></header>
   <div className="space-y-5 p-5 sm:p-8"><section className="flex flex-wrap items-center gap-2"><button className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-sm"><Store className="h-4 w-4 text-foreground" />All Stores<ChevronDown className="ml-2 h-3.5 w-3.5 text-muted-foreground" /></button><button className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-sm"><Clock3 className="h-4 w-4 text-muted-foreground" />Last 30 Days<ChevronDown className="ml-2 h-3.5 w-3.5 text-muted-foreground" /></button><div className="relative min-w-[220px] flex-1 sm:max-w-[360px]"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-xs outline-none ring-ring placeholder:text-muted-foreground focus:ring-2" placeholder="Search by order ID, customer, SKU, tracking number..." /></div><button className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-sm"><Filter className="h-4 w-4" />Filters <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] text-foreground">Live</span></button><div className="flex gap-2"><span className="rounded-full border border-border bg-secondary px-3 py-1.5 text-[11px] font-semibold text-foreground">Needs attention <X className="ml-1 inline h-3 w-3" /></span><span className="hidden rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-muted-foreground sm:inline-flex">All channels</span></div></section>
   <section className="grid auto-cols-[160px] grid-flow-col gap-3 overflow-x-auto pb-1 sm:grid-flow-row sm:grid-cols-4 xl:grid-cols-8">{summary.map(item => <article key={item.label} className="min-h-[100px] rounded-xl border border-border/80 bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,.025)]"><div className="mb-3 flex items-center justify-between"><span className={`h-2 w-2 rounded-full ${item.tone === 'amber' ? 'bg-chart-1' : item.tone === 'green' ? 'bg-chart-4' : item.tone === 'teal' ? 'bg-primary' : item.tone === 'orange' ? 'bg-chart-1' : item.tone === 'gray' ? 'bg-muted' : item.tone === 'purple' ? 'bg-primary' : 'bg-primary'}`} /><span className="text-[10px] text-muted-foreground">{item.sub}</span></div><p className="text-xl font-bold tracking-[-.03em] text-foreground">{item.value}</p><p className="mt-1 whitespace-nowrap text-[11px] font-medium text-muted-foreground">{item.label}</p></article>)}</section>
   <section className="rounded-xl border border-chart-1/80 border-l-4 border-l-chart-1 bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,.025)]"><SectionTitle icon={<AlertCircle className="h-4 w-4" />} title="Orders Requiring Attention" count={String(attention.length)} /> <div className="mt-4 flex gap-2 overflow-x-auto">{attention.map(item => <button key={item.label} className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:border-border hover:bg-secondary"><span>{item.label}</span><b className="rounded-full bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground">{item.count}</b></button>)}</div></section>
   <section className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-[0_2px_8px_rgba(0,0,0,.025)]"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4"><div className="flex items-center gap-2"><h2 className="text-[15px] font-bold text-foreground">All Orders</h2><span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-muted-foreground">{orders.length}</span></div>{selected.length > 0 ? <div className="flex items-center gap-2 text-xs"><span className="font-semibold text-muted-foreground">{selected.length} orders selected</span><button className="rounded-md bg-primary px-2.5 py-1.5 font-semibold text-primary-foreground">Mark as Fulfilled</button><button className="rounded-md border border-border px-2.5 py-1.5 font-semibold">Export</button><button onClick={() => setSelected([])} className="text-foreground underline">Clear</button></div> : <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground"><ListFilter className="h-4 w-4" />Manage columns</button>}</div><div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left text-xs"><thead className="sticky top-0 z-10 bg-secondary/95 text-[10px] uppercase tracking-[.08em] text-muted-foreground"><tr><th className="w-10 px-5 py-3"><input type="checkbox" aria-label="Select all orders" checked={selected.length === visible.length && visible.length > 0} onChange={e => setSelected(e.target.checked ? visible.map(o => o.id) : [])} /></th>{['Order', 'Date', 'Store', 'Customer', 'Products', 'Total', 'Payment', 'Fulfillment', 'Shipping', 'Status', 'Updated', 'Actions'].map(label => <th key={label} className="whitespace-nowrap px-3 py-3 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-border">{visible.map(order => <tr key={order.id} className={`transition-colors hover:bg-secondary/40 ${order.attention ? 'bg-chart-1/35' : ''}`}><td className="px-5 py-3.5"><input type="checkbox" aria-label={`Select ${order.id}`} checked={selected.includes(order.id)} onChange={() => toggle(order.id)} /></td><td className="px-3 py-3.5 font-bold text-foreground">{order.id}</td><td className="whitespace-nowrap px-3 py-3.5 text-muted-foreground">{order.date}</td><td className="px-3 py-3.5"><span className="flex items-center gap-2 whitespace-nowrap"><PlatformIcon platform={order.platform} /><span><b className="block text-[11px] font-semibold text-foreground">{order.platform}</b><small className="text-[10px] text-muted-foreground">{order.store}</small></span></span></td><td className="whitespace-nowrap px-3 py-3.5 font-medium text-foreground">{order.customer}</td><td className="whitespace-nowrap px-3 py-3.5 text-muted-foreground">{order.products}</td><td className="whitespace-nowrap px-3 py-3.5 font-semibold text-foreground">{order.total}</td><td className="px-3 py-3.5"><span className={`whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-semibold ${order.payment.startsWith('Failed') ? 'bg-chart-5/10 text-chart-5' : order.payment.startsWith('Pending') ? 'bg-chart-1/10 text-chart-1' : order.payment === 'Refunded' ? 'bg-secondary text-muted-foreground' : 'bg-secondary text-foreground'}`}>{order.payment}</span></td><td className="whitespace-nowrap px-3 py-3.5 text-[11px] text-muted-foreground">{order.fulfillment}</td><td className="whitespace-nowrap px-3 py-3.5 text-[11px] text-muted-foreground">{order.shipping}</td><td className="px-3 py-3.5"><span className={`whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-bold ${pillTone[order.tone]}`}>{order.status}</span></td><td className="whitespace-nowrap px-3 py-3.5 text-[11px] text-muted-foreground">{order.updated}</td><td className="px-3 py-3.5"><button className="mr-2 rounded-md border border-border px-2 py-1 text-[10px] font-semibold text-foreground hover:bg-card">Open</button><button aria-label={`More actions for ${order.id}`}><MoreHorizontal className="inline h-4 w-4 text-muted-foreground" /></button></td></tr>)}</tbody></table></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-xs text-muted-foreground"><span>Showing {visible.length} live orders</span><div className="text-xs text-muted-foreground">Additional pages appear when live records are available.</div></div></section>
   <section className="rounded-xl border border-chart-5/80 border-l-4 border-l-chart-5 bg-card p-5"><SectionTitle icon={<X className="h-4 w-4" />} title="Failed Orders" count={String(0)} tone="red" /><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Order #', 'Customer', 'Store', 'Issue', 'Time', 'Actions'].map(x => <th key={x} className="pb-2 font-semibold">{x}</th>)}</tr></thead><tbody className="divide-y divide-border"></tbody></table></div></section>
   <section className="grid gap-5 xl:grid-cols-3">{([] as Array<{title: string; icon: React.ReactNode; count: string; items: string[]}>).map(item => <article key={item.title} className="rounded-xl border border-border/80 bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,.025)]"><div className="flex items-center gap-2"><span className="rounded-lg bg-secondary p-1.5 text-foreground">{item.icon}</span><h2 className="text-[15px] font-bold text-foreground">{item.title}</h2><span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-foreground">{item.count}</span></div><ul className="mt-3 divide-y divide-border">{item.items.map(line => <li key={line} className="flex items-center justify-between gap-2 py-3 text-[11px] text-muted-foreground"><span>{line}</span><button className="shrink-0 font-semibold text-foreground">Open</button></li>)}</ul></article>)}</section>
   
   <section className="rounded-xl border border-border/80 bg-card p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><Cloud className="h-4 w-4 text-foreground" /><h2 className="text-[15px] font-bold text-foreground">Order Synchronization</h2></div><button className="text-xs font-semibold text-foreground">View Sync Details <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></button></div><div className="mt-4 grid gap-3 md:grid-cols-3"></div></section>
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
