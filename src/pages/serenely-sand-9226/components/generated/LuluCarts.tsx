import * as React from 'react';
import { AlertCircle, Archive, ArrowDownUp, Bell, Bot, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock3, Cloud, Download, Ellipsis, FileBarChart, Filter, Gauge, LayoutDashboard, LifeBuoy, Menu, MoreHorizontal, RefreshCw, Search, Settings, ShoppingBag, ShoppingCart, Sparkles, Store, Tags, Users, X, Zap } from 'lucide-react';
type CartStatus = 'Abandoned' | 'Converted' | 'Active' | 'Attention';
type Platform = 'Shopify' | 'WooCommerce' | 'Webflow';
type Cart = {
  id: string;
  created: string;
  store: string;
  platform: Platform;
  customer: string;
  products: string;
  items: string;
  value: string;
  checkout: 'Started' | 'Completed' | 'Not Started' | 'Failed';
  status: CartStatus;
  activity: string;
};
type EcommerceNavItem = {
  label: string;
};
type SimpleActionItem = {
  label: 'Reports' | 'Settings';
};
type SavedFilter = {
  label: string;
};
type StatCard = {
  label: string;
  value: string;
  hint: string;
  color: string;
  glow: string;
  icon: typeof ShoppingCart;
};
type PageNumber = {
  label: string;
};
type IssueRow = {
  id: string;
  issue: string;
  platform: Platform;
  time: string;
  severity: 'High' | 'Medium';
};
type HealthRow = {
  label: string;
  status: string;
  metric: string;
  healthy: boolean;
};
type SyncRow = {
  name: string;
  platform: Platform;
  status: string;
  time: string;
  syncing: boolean;
};
type PromptItem = {
  label: string;
};
const navPrimary = [{
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  label: 'AI Platform',
  icon: Sparkles
}, {
  label: 'CRM',
  icon: Users
}, {
  label: 'Marketing',
  icon: Tags
}, {
  label: 'Advertising',
  icon: Gauge
}];
const ecommerceNav = ['Overview', 'Stores', 'Products', 'Categories', 'Orders', 'Customers', 'Carts', 'Inventory', 'Reviews', 'Merchandising', 'Automation'];
const carts: Cart[] = [{
  id: 'C-10482',
  created: 'Aug 10',
  store: 'Lulu Store',
  platform: 'Shopify',
  customer: 'John Smith',
  products: '3 products',
  items: '5 items',
  value: '€249.00',
  checkout: 'Started',
  status: 'Abandoned',
  activity: '2h ago'
}, {
  id: 'C-10480',
  created: 'Aug 10',
  store: 'Main Shop',
  platform: 'WooCommerce',
  customer: 'Sarah Lee',
  products: '1 product',
  items: '2 items',
  value: '€89.00',
  checkout: 'Completed',
  status: 'Converted',
  activity: '4h ago'
}, {
  id: 'C-10479',
  created: 'Aug 9',
  store: 'Lulu Store',
  platform: 'Shopify',
  customer: 'Guest',
  products: '4 products',
  items: '4 items',
  value: '€412.50',
  checkout: 'Not Started',
  status: 'Active',
  activity: '30 min ago'
}, {
  id: 'C-10476',
  created: 'Aug 9',
  store: 'Main Shop',
  platform: 'WooCommerce',
  customer: 'guest_2847',
  products: '2 products',
  items: '3 items',
  value: '€67.00',
  checkout: 'Started',
  status: 'Attention',
  activity: '3h ago'
}, {
  id: 'C-10474',
  created: 'Aug 8',
  store: 'Webflow Store',
  platform: 'Webflow',
  customer: 'Emma Davis',
  products: '1 product',
  items: '1 item',
  value: '€145.00',
  checkout: 'Not Started',
  status: 'Abandoned',
  activity: '1d ago'
}, {
  id: 'C-10471',
  created: 'Aug 8',
  store: 'Lulu Store',
  platform: 'Shopify',
  customer: 'Tom Wilson',
  products: '6 products',
  items: '8 items',
  value: '€728.00',
  checkout: 'Started',
  status: 'Abandoned',
  activity: '14h ago'
}, {
  id: 'C-10468',
  created: 'Aug 7',
  store: 'Lulu Store',
  platform: 'Shopify',
  customer: 'Mike J.',
  products: '2 products',
  items: '2 items',
  value: '€92.00',
  checkout: 'Completed',
  status: 'Converted',
  activity: '2d ago'
}];
const attention = [{
  id: 'C-10481',
  customer: 'John Smith',
  issue: 'Checkout failed — payment error',
  platform: 'Shopify',
  time: '1h ago'
}, {
  id: 'C-10476',
  customer: 'guest_2847',
  issue: 'Product became unavailable',
  platform: 'WooCommerce',
  time: '3h ago'
}, {
  id: 'C-10469',
  customer: 'Sarah Lee',
  issue: 'Sync error — data incomplete',
  platform: 'Shopify',
  time: '5h ago'
}];
const activity = [{
  icon: ShoppingCart,
  text: 'New cart created',
  person: 'Emma Thompson',
  time: '8 min ago',
  platform: 'Shopify'
}, {
  icon: CheckCircle2,
  text: 'Cart C-10480 converted to order',
  person: 'System',
  time: '4h ago',
  platform: 'WooCommerce'
}, {
  icon: AlertCircle,
  text: 'Cart C-10481 checkout failed',
  person: 'System',
  time: '1h ago',
  platform: 'Shopify'
}, {
  icon: Zap,
  text: 'AI identified high-value abandoned cart',
  person: 'Lulu AI',
  time: '2h ago',
  platform: 'All Stores'
}, {
  icon: ShoppingCart,
  text: 'Cart C-10479 · product added',
  person: 'Guest',
  time: '30 min ago',
  platform: 'Shopify'
}, {
  icon: RefreshCw,
  text: 'Cart sync completed',
  person: 'System',
  time: '3 min ago',
  platform: 'WooCommerce'
}, {
  icon: Clock3,
  text: 'Cart C-10460 marked abandoned',
  person: 'System',
  time: '6h ago',
  platform: 'Webflow'
}];
const ecommerceNavItems: EcommerceNavItem[] = ecommerceNav.map(label => ({
  label
}));
const secondaryNavItems: SimpleActionItem[] = [{
  label: 'Reports'
}, {
  label: 'Settings'
}];
const dateOptions: SavedFilter[] = [{
  label: 'Today'
}, {
  label: 'Yesterday'
}, {
  label: 'Last 7 Days'
}, {
  label: 'Last 30 Days'
}, {
  label: 'Last 90 Days'
}, {
  label: 'Custom Range'
}];
const savedFilters: SavedFilter[] = [{
  label: 'Needs attention'
}, {
  label: 'High value'
}, {
  label: 'Recently active'
}];
const tableHeads: SavedFilter[] = [{
  label: 'Cart'
}, {
  label: 'Created'
}, {
  label: 'Store'
}, {
  label: 'Customer'
}, {
  label: 'Products'
}, {
  label: 'Items'
}, {
  label: 'Cart Value'
}, {
  label: 'Checkout'
}, {
  label: 'Status'
}, {
  label: 'Last Activity'
}, {
  label: 'Actions'
}];
const abandonedHeads: SavedFilter[] = [{
  label: 'Cart'
}, {
  label: 'Customer'
}, {
  label: 'Store'
}, {
  label: 'Cart Value'
}, {
  label: 'Last Activity'
}, {
  label: 'Time Since'
}, {
  label: 'Checkout Status'
}, {
  label: 'Actions'
}];
const checkoutHeads: SavedFilter[] = [{
  label: 'Cart'
}, {
  label: 'Issue'
}, {
  label: 'Store'
}, {
  label: 'Time'
}, {
  label: 'Severity'
}, {
  label: 'Actions'
}];
const pageNumbers: PageNumber[] = [{
  label: '1'
}, {
  label: '2'
}, {
  label: '3'
}, {
  label: '…'
}, {
  label: '22'
}];
const statCards: StatCard[] = [{
  label: 'Active Carts',
  value: '312',
  hint: 'Currently active',
  color: 'text-[var(--foreground)]',
  glow: 'shadow-[0_0_24px_rgba(0,0,0,.20)]',
  icon: ShoppingCart
}, {
  label: 'Abandoned Carts',
  value: '87',
  hint: 'Need review',
  color: 'text-[var(--foreground)]',
  glow: 'shadow-[0_0_24px_rgba(0,0,0,.18)]',
  icon: Clock3
}, {
  label: 'Checkout Started',
  value: '134',
  hint: 'In progress',
  color: 'text-[var(--chart-4)]',
  glow: 'shadow-[0_0_24px_rgba(0,0,0,.16)]',
  icon: ArrowDownUp
}, {
  label: 'Checkout Completed',
  value: '98',
  hint: 'Converted',
  color: 'text-[var(--chart-4)]',
  glow: 'shadow-[0_0_24px_rgba(0,0,0,.16)]',
  icon: CheckCircle2
}, {
  label: 'Cart Value',
  value: '€24,840',
  hint: 'Active cart value',
  color: 'text-[var(--foreground)]',
  glow: 'shadow-[0_0_24px_rgba(0,0,0,.16)]',
  icon: Archive
}, {
  label: 'Attention Required',
  value: '11',
  hint: 'Operational issues',
  color: 'text-[var(--chart-5)]',
  glow: 'shadow-[0_0_24px_rgba(0,0,0,.18)]',
  icon: AlertCircle
}];
const checkoutIssues: IssueRow[] = [{
  id: 'C-10481',
  issue: 'Payment failed — card declined',
  platform: 'Shopify',
  time: '1h ago',
  severity: 'High'
}, {
  id: 'C-10476',
  issue: 'Product unavailable at checkout',
  platform: 'WooCommerce',
  time: '3h ago',
  severity: 'Medium'
}, {
  id: 'C-10459',
  issue: 'Shipping calculation error',
  platform: 'Shopify',
  time: '1d ago',
  severity: 'Medium'
}];
const healthRows: HealthRow[] = [{
  label: 'Cart Synchronization',
  status: 'Healthy',
  metric: 'last sync 3 min ago',
  healthy: true
}, {
  label: 'Checkout Health',
  status: 'Attention',
  metric: '3 checkout failures',
  healthy: false
}, {
  label: 'Product Availability',
  status: 'Attention',
  metric: '2 items unavailable in carts',
  healthy: false
}, {
  label: 'Data Completeness',
  status: 'Healthy',
  metric: '99.2% complete',
  healthy: true
}, {
  label: 'Platform Connectivity',
  status: 'Healthy',
  metric: 'all stores connected',
  healthy: true
}];
const aiPrompts: PromptItem[] = [{
  label: 'Which carts require attention?'
}, {
  label: 'Find checkout failures'
}, {
  label: 'High-value abandoned carts'
}, {
  label: "Summarize today's cart activity"
}];
const syncRows: SyncRow[] = [{
  name: 'Lulu Store',
  platform: 'Shopify',
  status: 'Synced',
  time: '3 min ago',
  syncing: false
}, {
  name: 'Main Shop',
  platform: 'WooCommerce',
  status: 'Synced',
  time: '3 min ago',
  syncing: false
}, {
  name: 'Webflow Store',
  platform: 'Webflow',
  status: 'Syncing',
  time: 'last sync 9 min ago',
  syncing: true
}];
const abandonedCarts: Cart[] = [carts[0], carts[4], carts[5], {
  ...carts[0],
  id: 'C-10463',
  customer: 'Guest',
  store: 'Main Shop',
  platform: 'WooCommerce',
  value: '€34.00',
  activity: '2d ago',
  checkout: 'Not Started' as const
}];
const platformStyles: Record<Platform, string> = {
  Shopify: 'text-[var(--foreground)] bg-[var(--card)] border-[var(--border)] shadow-[0_0_16px_rgba(0,0,0,.10)]',
  WooCommerce: 'text-[var(--foreground)] bg-[var(--card)] border-[var(--border)] shadow-[0_0_16px_rgba(0,0,0,.10)]',
  Webflow: 'text-[var(--foreground)] bg-[var(--card)] border-[var(--border)] shadow-[0_0_16px_rgba(0,0,0,.10)]'
};
const statusStyles: Record<CartStatus, string> = {
  Abandoned: 'text-[var(--chart-1)] bg-[var(--card)] border-[var(--chart-1)]',
  Converted: 'text-[var(--chart-4)] bg-[var(--card)] border-[var(--chart-4)]',
  Active: 'text-[var(--foreground)] bg-[var(--card)] border-[var(--border)]',
  Attention: 'text-[var(--foreground)] bg-[var(--card)] border-[var(--border)]'
};
const statusDotStyles: Record<CartStatus, string> = {
  Abandoned: 'bg-[var(--chart-1)] shadow-[0_0_12px_rgba(0,0,0,.85)]',
  Converted: 'bg-[var(--chart-4)] shadow-[0_0_12px_rgba(0,0,0,.85)]',
  Active: 'bg-[var(--primary)] shadow-[0_0_12px_rgba(0,0,0,.85)]',
  Attention: 'bg-[var(--primary)] shadow-[0_0_12px_rgba(0,0,0,.85)]'
};
const checkoutStyles: Record<Cart['checkout'], string> = {
  Started: 'text-[var(--chart-4)] bg-[var(--card)] border-[var(--border)]',
  Completed: 'text-[var(--chart-4)] bg-[var(--card)] border-[var(--chart-4)]',
  'Not Started': 'text-[var(--muted-foreground)] bg-[var(--card)] border-[var(--muted-foreground)]',
  Failed: 'text-[var(--chart-5)] bg-[var(--card)] border-[var(--chart-5)]'
};
const checkoutDotStyles: Record<Cart['checkout'], string> = {
  Started: 'bg-[var(--chart-4)] shadow-[0_0_12px_rgba(0,0,0,.85)]',
  Completed: 'bg-[var(--chart-4)] shadow-[0_0_12px_rgba(0,0,0,.85)]',
  'Not Started': 'bg-[var(--secondary)] shadow-[0_0_12px_rgba(0,0,0,.55)]',
  Failed: 'bg-[var(--destructive)] shadow-[0_0_12px_rgba(0,0,0,.85)]'
};
function PlatformChip({
  platform,
  store
}: {
  platform: Platform | 'All Stores';
  store?: string;
}) {
  const style = platform === 'All Stores' ? 'text-[var(--foreground)] bg-secondary border-border shadow-[0_0_14px_rgba(0,0,0,.08)]' : platformStyles[platform];
  return <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-bold ${style}`}><span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]" /><span>{store ?? platform}</span></span>;
}
function StatusPill({
  status
}: {
  status: CartStatus;
}) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusStyles[status]}`}><span className={`h-1.5 w-1.5 rounded-full ${statusDotStyles[status]}`} /><span>{status}</span></span>;
}
function CheckoutPill({
  status
}: {
  status: Cart['checkout'];
}) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${checkoutStyles[status]}`}><span className={`h-1.5 w-1.5 rounded-full ${checkoutDotStyles[status]}`} /><span>{status}</span></span>;
}
export function LuluCarts() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [attentionOpen, setAttentionOpen] = React.useState(true);
  const [abandonedOpen, setAbandonedOpen] = React.useState(true);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [query, setQuery] = React.useState('');
  const [dateOpen, setDateOpen] = React.useState(false);
  const [date, setDate] = React.useState('Last 7 Days');
  const [aiPrompt, setAiPrompt] = React.useState('');
  const filteredCarts = carts.filter(cart => `${cart.id} ${cart.customer} ${cart.store}`.toLowerCase().includes(query.toLowerCase()));
  const toggleSelected = (id: string) => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  return <div className="min-h-screen bg-[var(--background)] text-[var(--primary-foreground)] antialiased lg:flex">
      <aside className={`fixed inset-y-0 left-0 z-30 flex w-[246px] flex-col bg-[var(--sidebar)] text-foreground shadow-[20px_0_60px_rgba(0,0,0,.34)] transition-transform lg:sticky lg:top-0 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[74px] items-center gap-3 border-b border-border px-6"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--primary)] shadow-[0_0_24px_rgba(0,0,0,.45)] text-primary-foreground"><Sparkles size={17} /></div><span className="text-[18px] font-black tracking-[-.05em]">lulu<span className="font-medium text-foreground/55">.ai</span></span></div>
        <LuluSectionNavigation activeId="serenely-sand-9226" />
        <div className="border-t border-border p-4"><div className="flex items-center gap-3 rounded-xl border border-border bg-secondary p-2"><div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--primary)]/25 text-xs font-black text-[var(--foreground)] ring-1 ring-[var(--border)]/40">JD</div><div className="min-w-0"><p className="truncate text-xs font-bold text-foreground">Jordan Davis</p><p className="truncate text-[11px] text-muted-foreground">Admin workspace</p></div><MoreHorizontal size={16} className="ml-auto text-muted-foreground" /></div></div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="border-b border-[var(--muted-foreground)] bg-[var(--card)] px-5 py-4 shadow-[0_1px_0_rgba(0,0,0,.35)] sm:px-8 lg:px-10"><div className="flex items-start gap-4"><button aria-label="Open navigation" onClick={() => setSidebarOpen(true)} className="mt-1 rounded-md border border-border p-2 text-foreground hover:bg-secondary lg:hidden"><Menu size={19} /></button><div className="min-w-0 flex-1"><div className="mb-3 flex items-center gap-2 text-[12px] font-semibold text-[var(--muted-foreground)]"><span>Ecommerce</span><ChevronRight size={13} /><span className="text-[var(--foreground)]">Carts</span></div><h1 className="text-[32px] font-black tracking-[-.05em] text-foreground sm:text-[38px]">Carts</h1><p className="mt-1 max-w-2xl text-[13px] leading-6 text-[var(--muted-foreground)]">Monitor shopping carts, abandoned carts and checkout activity across your ecommerce stores.</p></div><div className="hidden items-center gap-2 sm:flex"><button className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-3.5 py-2 text-xs font-extrabold text-primary-foreground shadow-[0_0_20px_rgba(0,0,0,.4)] hover:bg-[var(--primary)]"><Sparkles size={14} /><span>Ask Lulu AI</span></button><button aria-label="Refresh carts" className="rounded-lg border border-border bg-secondary p-2 text-[var(--muted-foreground)] hover:bg-secondary"><RefreshCw size={16} /></button><button className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-bold text-[var(--foreground)] hover:bg-secondary"><Download size={14} /><span>Export</span></button><button aria-label="More actions" className="rounded-lg border border-border bg-secondary p-2 text-[var(--muted-foreground)] hover:bg-secondary"><Ellipsis size={16} /></button></div></div></header>

        <div className="mx-auto max-w-[1440px] space-y-5 p-5 sm:p-8 lg:p-10">
          <section className="flex flex-col gap-3 rounded-2xl border border-border bg-secondary p-3 shadow-[0_18px_70px_rgba(0,0,0,.28)] backdrop-blur-sm xl:flex-row xl:items-center"><button className="flex min-w-[178px] items-center gap-2 rounded-lg border border-border bg-[var(--primary)]/70 px-3 py-2 text-left text-xs font-bold text-[var(--foreground)]"><Store size={15} className="text-[var(--muted-foreground)]" /><span className="flex-1">All Stores</span><ChevronDown size={14} className="text-[var(--muted-foreground)]" /></button><div className="flex flex-wrap items-center gap-2"><div className="relative"><button onClick={() => setDateOpen(!dateOpen)} className="flex items-center gap-2 rounded-lg border border-border bg-[var(--primary)]/70 px-3 py-2 text-xs font-bold text-[var(--foreground)]"><span>{date}</span><ChevronDown size={14} className="text-[var(--muted-foreground)]" /></button>{dateOpen && <div className="absolute left-0 top-11 z-20 min-w-[160px] rounded-lg border border-border bg-[var(--secondary)] p-1 shadow-[0_20px_60px_rgba(0,0,0,.45)]">{dateOptions.map(item => <button key={item.label} onClick={() => {
                  setDate(item.label);
                  setDateOpen(false);
                }} className="block w-full rounded px-3 py-2 text-left text-xs font-semibold text-[var(--foreground)] hover:bg-secondary"><span>{item.label}</span></button>)}</div>}</div><PlatformChip platform="Shopify" store="Shopify" /><PlatformChip platform="WooCommerce" store="WooCommerce" /><PlatformChip platform="Webflow" store="Webflow" /></div><div className="relative min-w-0 flex-1 xl:ml-3"><Search size={15} className="absolute left-3 top-2.5 text-[var(--muted-foreground)]" /><input value={query} onChange={event => setQuery(event.target.value)} className="w-full rounded-lg border border-border bg-[var(--secondary)]/70 py-2 pl-9 pr-3 text-xs text-[var(--primary-foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)] focus:ring-2 focus:ring-[var(--border)]/25" placeholder="Search by cart ID, customer, email, product, or SKU..." /></div><button className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-[var(--primary)]/70 px-3 py-2 text-xs font-bold text-[var(--foreground)]"><Filter size={14} /><span>Filters</span><span className="grid h-4 w-4 place-items-center rounded-full bg-[var(--primary)] text-[10px] text-primary-foreground shadow-[0_0_14px_rgba(0,0,0,.45)]">3</span></button></section>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--muted-foreground)]"><span className="font-bold text-[var(--foreground)]">Saved filters</span>{savedFilters.map(item => <button key={item.label} className="rounded-full border border-border bg-secondary px-2.5 py-1 font-semibold hover:border-[var(--border)]/70 hover:text-foreground"><span>{item.label}</span><X size={11} className="ml-1 inline" /></button>)}</div>

          <section><div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{statCards.map(({
              label,
              value,
              hint,
              color,
              glow,
              icon: Icon
            }) => <article key={label} className={`rounded-2xl border border-border bg-secondary p-4 backdrop-blur-sm ${glow}`}><div className="mb-4 flex items-center justify-between"><span className="text-[11px] font-bold text-[var(--muted-foreground)]">{label}</span><span className={color}><Icon size={17} /></span></div><p className="text-[24px] font-black tracking-[-.05em] text-foreground">{value}</p><p className="mt-1 text-[11px] text-[var(--muted-foreground)]">{hint}</p></article>)}</div><p className="mt-3 text-[11px] text-[var(--muted-foreground)]">Operational summary only. Deep conversion analytics available in Intelligence.</p></section>

          <section className="overflow-hidden rounded-2xl border border-[var(--muted-foreground)] border-l-4 border-l-border bg-[var(--card)]/90 shadow-[-10px_0_28px_rgba(0,0,0,.18),0_22px_70px_rgba(0,0,0,.32)] backdrop-blur-sm"><button onClick={() => setAttentionOpen(!attentionOpen)} className="flex w-full items-center gap-2 border-b border-border px-5 py-4 text-left"><AlertCircle size={17} className="text-chart-1 drop-shadow-[0_0_8px_rgba(0,0,0,.65)]" /><h2 className="text-sm font-extrabold text-foreground">Carts Requiring Attention</h2><span className="rounded-full border border-chart-1/25 bg-chart-1/15 px-2 py-0.5 text-[11px] font-black text-chart-1">11</span><ChevronDown size={16} className={`ml-auto text-[var(--muted-foreground)] transition ${attentionOpen ? '' : '-rotate-90'}`} /></button>{attentionOpen && <div className="divide-y divide-white/10">{attention.map(item => <div key={item.id} className="flex flex-wrap items-center gap-3 px-5 py-3 text-xs hover:bg-chart-1/5"><ShoppingCart size={16} className="text-chart-1" /><a href="#cart-table" className="font-black text-[var(--foreground)] hover:text-foreground">{item.id}</a><span className="w-24 text-[var(--foreground)]">{item.customer}</span><span className="min-w-[220px] flex-1 text-[var(--muted-foreground)]">{item.issue}</span><PlatformChip platform={item.platform as Platform} /><span className="text-[var(--muted-foreground)]">{item.time}</span><button className="rounded-md border border-border bg-secondary px-2.5 py-1.5 text-[11px] font-bold text-[var(--foreground)] hover:bg-secondary">Open Cart</button><button className="px-1 py-1.5 font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)]">View Details</button></div>)}<div className="px-5 py-3"><button className="text-xs font-black text-[var(--foreground)] hover:text-foreground">View All (11) <ChevronRight size={13} className="inline" /></button></div></div>}</section>

          <section id="cart-table" className="overflow-hidden rounded-2xl border border-border bg-secondary shadow-[0_22px_70px_rgba(0,0,0,.32)] backdrop-blur-sm"><div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4"><h2 className="text-sm font-extrabold text-foreground">All Carts</h2><span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[11px] font-black text-[var(--foreground)]">533</span>{selected.length > 0 && <div className="ml-auto flex items-center gap-2 text-xs text-[var(--foreground)]"><strong className="font-black text-foreground">{selected.length} carts selected</strong><button className="rounded-md border border-border bg-secondary px-2.5 py-1.5 font-bold"><Download size={13} className="mr-1 inline" />Export</button><button className="rounded-md border border-border bg-secondary px-2.5 py-1.5 font-bold">Create Report</button><button className="rounded-md border border-border bg-secondary px-2.5 py-1.5 font-bold">More <ChevronDown size={12} className="inline" /></button><button onClick={() => setSelected([])} className="ml-1 text-[var(--muted-foreground)] hover:text-foreground">Clear selection</button></div>}<button className="ml-auto rounded-md p-1.5 text-[var(--muted-foreground)] hover:bg-secondary"><MoreHorizontal size={18} /></button></div><div className="flex flex-wrap gap-2 border-b border-border px-5 py-3"><span className="rounded-full border border-[var(--border)]/25 bg-[var(--primary)]/15 px-2.5 py-1 text-[11px] font-bold text-[var(--foreground)]">All stores <X size={11} className="ml-1 inline" /></span><span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-bold text-[var(--foreground)]">Last 7 Days <X size={11} className="ml-1 inline" /></span></div><div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-left text-xs"><thead className="sticky top-0 z-10 bg-[var(--card)] text-[10px] uppercase tracking-[.08em] text-[var(--muted-foreground)]"><tr><th scope="col" className="w-10 border-r border-border px-5 py-3"><input aria-label="Select all carts" type="checkbox" onChange={event => setSelected(event.target.checked ? filteredCarts.map(cart => cart.id) : [])} /></th>{tableHeads.map(head => <th scope="col" key={head.label} className="border-r border-border px-3 py-3 font-black last:border-r-0">{head.label}</th>)}</tr></thead><tbody className="divide-y divide-white/10">{filteredCarts.map(cart => <tr key={cart.id} className={`transition hover:bg-[var(--card)] ${cart.status === 'Attention' ? 'bg-chart-1/[.06]' : cart.status === 'Converted' ? 'bg-secondary/[.035]' : cart.id === filteredCarts[0]?.id ? 'bg-secondary' : 'bg-transparent'}`}><td className="px-5 py-3"><input aria-label={`Select ${cart.id}`} type="checkbox" checked={selected.includes(cart.id)} onChange={() => toggleSelected(cart.id)} /></td><td className="px-3 py-3"><a href="#cart-table" className="inline-flex items-center gap-2 font-black text-[var(--foreground)] hover:text-foreground"><ShoppingCart size={14} className="text-[var(--muted-foreground)]" />{cart.id}</a></td><td className="whitespace-nowrap px-3 py-3 text-[var(--muted-foreground)]">{cart.created}</td><td className="px-3 py-3"><PlatformChip platform={cart.platform} store={cart.store} /></td><td className="px-3 py-3 font-semibold text-[var(--foreground)]">{cart.customer === 'Guest' || cart.customer.startsWith('guest') ? <span className="inline-flex items-center gap-1.5"><Users size={13} className="text-[var(--muted-foreground)]" />{cart.customer}</span> : <span className="inline-flex items-center gap-1.5"><span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--primary)]/20 text-[9px] font-black text-[var(--foreground)] ring-1 ring-[var(--border)]/30">{cart.customer.split(' ').map(part => part[0]).join('')}</span>{cart.customer}</span>}</td><td className="whitespace-nowrap px-3 py-3 text-[var(--muted-foreground)]">{cart.products}</td><td className="whitespace-nowrap px-3 py-3 text-[var(--muted-foreground)]">{cart.items}</td><td className="whitespace-nowrap px-3 py-3 font-black text-foreground">{cart.value}</td><td className="px-3 py-3"><CheckoutPill status={cart.checkout} /></td><td className="px-3 py-3"><StatusPill status={cart.status} /></td><td className="whitespace-nowrap px-3 py-3 text-[var(--muted-foreground)]">{cart.activity}</td><td className="px-3 py-3"><div className="flex items-center gap-2"><button className="rounded-md border border-border bg-secondary px-2 py-1.5 text-[11px] font-bold text-[var(--foreground)] hover:bg-secondary">Open</button><button aria-label={`More actions for ${cart.id}`} className="rounded p-1.5 text-[var(--muted-foreground)] hover:bg-secondary"><Ellipsis size={15} /></button></div></td></tr>)}</tbody></table></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-[11px] text-[var(--muted-foreground)]"><span>Showing 1–25 of 533</span><div className="flex items-center gap-1"><button aria-label="Previous page" className="rounded border border-border bg-secondary p-1.5 hover:bg-secondary"><ChevronLeft size={14} /></button>{pageNumbers.map(page => <button key={page.label} className={`h-7 min-w-7 rounded px-2 font-bold ${page.label === '1' ? 'bg-[var(--primary)] text-primary-foreground shadow-[0_0_16px_rgba(0,0,0,.4)]' : 'hover:bg-secondary'}`}>{page.label}</button>)}<button aria-label="Next page" className="rounded border border-border bg-secondary p-1.5 hover:bg-secondary"><ChevronRight size={14} /></button></div></div></section>

          <section className="overflow-hidden rounded-2xl border border-[var(--muted-foreground)] border-l-4 border-l-[var(--border)] bg-[var(--card)]/95 shadow-[-10px_0_26px_rgba(0,0,0,.13),0_22px_70px_rgba(0,0,0,.30)] backdrop-blur-sm"><button onClick={() => setAbandonedOpen(!abandonedOpen)} className="flex w-full items-center gap-2 border-b border-border px-5 py-4 text-left"><Clock3 size={17} className="text-foreground drop-shadow-[0_0_8px_rgba(0,0,0,.65)]" /><h2 className="text-sm font-extrabold text-foreground">Abandoned Carts</h2><span className="rounded-full border border-border/25 bg-secondary/15 px-2 py-0.5 text-[11px] font-black text-foreground">87</span><ChevronDown size={16} className={`ml-auto text-[var(--muted-foreground)] ${abandonedOpen ? '' : '-rotate-90'}`} /></button>{abandonedOpen && <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-xs"><thead className="bg-[var(--card)] text-[10px] uppercase tracking-[.08em] text-[var(--foreground)]"><tr>{abandonedHeads.map(head => <th scope="col" key={head.label} className="border-r border-border px-5 py-3 font-black last:border-r-0">{head.label}</th>)}</tr></thead><tbody className="divide-y divide-white/10">{abandonedCarts.map(cart => <tr key={cart.id} className="hover:bg-secondary/5"><td className="px-5 py-3 font-black text-[var(--foreground)]">{cart.id}</td><td className="px-5 py-3 font-semibold text-[var(--foreground)]">{cart.customer}</td><td className="px-5 py-3"><PlatformChip platform={cart.platform as Platform} /></td><td className="px-5 py-3 font-black text-foreground">{cart.value}{cart.id === 'C-10471' && <span className="ml-2 rounded-full border border-border/25 bg-secondary/15 px-2 py-1 text-[10px] font-black text-foreground">⚡ High Value</span>}</td><td className="px-5 py-3 text-[var(--muted-foreground)]">{cart.activity}</td><td className="px-5 py-3 text-[var(--muted-foreground)]">{cart.activity.replace(' ago', '')}</td><td className="px-5 py-3"><CheckoutPill status={cart.checkout} /></td><td className="px-5 py-3"><button className="font-black text-[var(--foreground)] hover:text-foreground">Open Cart</button><button className="ml-3 font-bold text-[var(--muted-foreground)] hover:text-foreground">View Customer</button></td></tr>)}</tbody></table><div className="mx-5 my-3 flex items-start gap-3 rounded-lg border border-[var(--border)]/20 bg-[var(--primary)]/10 p-3 text-xs text-[var(--foreground)]" role="note" aria-label="AI insight"><Sparkles size={16} className="mt-0.5 shrink-0 text-[var(--foreground)]" /><p><em className="font-bold text-[var(--foreground)]">AI Insight:</em> Cart C-10471 (€728) was abandoned after checkout began. Checkout status: Started. Likely cause: Unknown — platform did not provide a reason.</p></div><div className="px-5 pb-4"><button className="text-xs font-black text-[var(--foreground)] hover:text-foreground">View All Abandoned (87) <ChevronRight size={13} className="inline" /></button></div></div>}</section>

          <section className="overflow-hidden rounded-2xl border border-border bg-secondary shadow-[0_22px_70px_rgba(0,0,0,.30)] backdrop-blur-sm"><div className="flex items-center gap-2 border-b border-border px-5 py-4"><AlertCircle size={17} className="text-chart-5 drop-shadow-[0_0_8px_rgba(0,0,0,.55)]" /><h2 className="text-sm font-extrabold text-foreground">Checkout Issues</h2><span className="rounded-full border border-chart-5/25 bg-chart-5/15 px-2 py-0.5 text-[11px] font-black text-chart-5">3</span></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-xs"><thead className="bg-[var(--card)] text-[10px] uppercase tracking-[.08em] text-[var(--muted-foreground)]"><tr>{checkoutHeads.map(head => <th scope="col" key={head.label} className="border-r border-border px-5 py-3 font-black last:border-r-0">{head.label}</th>)}</tr></thead><tbody className="divide-y divide-white/10">{checkoutIssues.map(({
                  id,
                  issue,
                  platform,
                  time,
                  severity
                }) => <tr key={id} className="hover:bg-[var(--card)]"><td className="px-5 py-3 font-black text-[var(--foreground)]">{id}</td><td className="px-5 py-3 font-semibold text-[var(--foreground)]">{issue}</td><td className="px-5 py-3"><PlatformChip platform={platform} /></td><td className="px-5 py-3 text-[var(--muted-foreground)]">{time}</td><td className="px-5 py-3"><span className={`rounded-full border px-2 py-1 text-[11px] font-black ${severity === 'High' ? 'border-chart-5/25 bg-chart-5/15 text-chart-5' : 'border-border/25 bg-secondary/15 text-foreground'}`}>{severity}</span></td><td className="px-5 py-3"><button className="font-black text-[var(--foreground)] hover:text-foreground">Open Cart</button><button className="ml-3 font-bold text-[var(--muted-foreground)] hover:text-foreground">View Details</button></td></tr>)}</tbody></table></div></section>

          <section className="grid gap-5 xl:grid-cols-3"><article className="rounded-2xl border border-border bg-secondary p-5 shadow-[0_22px_70px_rgba(0,0,0,.28)] backdrop-blur-sm"><div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-extrabold text-foreground">Cart Operations Health</h2><LifeBuoy size={16} className="text-[var(--muted-foreground)]" /></div>{healthRows.map(item => <div key={item.label} className="flex items-center gap-3 border-b border-border py-3 last:border-0"><span className={`h-2 w-2 rounded-full ${item.healthy ? 'bg-[var(--chart-4)] shadow-[0_0_12px_rgba(0,0,0,.75)]' : 'bg-[var(--primary)] shadow-[0_0_12px_rgba(0,0,0,.75)]'}`} /><span className="flex-1 text-xs font-semibold text-[var(--foreground)]">{item.label}</span><span className={`text-[11px] font-black ${item.healthy ? 'text-[var(--chart-4)]' : 'text-[var(--foreground)]'}`}>{item.status}</span><span className="text-[10px] text-[var(--muted-foreground)]">{item.metric}</span></div>)}<button className="mt-4 text-xs font-black text-[var(--foreground)] hover:text-foreground">View Details <ChevronRight size={13} className="inline" /></button></article><article className="rounded-2xl border border-border bg-secondary p-5 shadow-[0_22px_70px_rgba(0,0,0,.28)] backdrop-blur-sm"><div className="mb-2 flex items-center justify-between"><h2 className="text-sm font-extrabold text-foreground">Recent Cart Activity</h2><Bell size={16} className="text-[var(--muted-foreground)]" /></div><div className="divide-y divide-white/10">{activity.map(({
                icon: Icon,
                text,
                person,
                time,
                platform
              }) => <div key={`${text}-${time}`} className="flex gap-3 py-2.5"><Icon size={15} className="mt-0.5 shrink-0 text-[var(--foreground)] drop-shadow-[0_0_8px_rgba(0,0,0,.45)]" /><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-[var(--foreground)]">{text}</p><div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-[var(--muted-foreground)]"><span>{person}</span><span>·</span><span>{time}</span><span className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[var(--muted-foreground)]">{platform}</span></div></div></div>)}</div></article><article className="rounded-2xl border border-[var(--border)]/30 bg-secondary p-5 shadow-[0_-2px_0_rgba(0,0,0,.85),0_0_42px_rgba(0,0,0,.16),0_22px_70px_rgba(0,0,0,.28)] backdrop-blur-sm"><div className="mb-4 flex items-center gap-2"><Sparkles size={17} className="text-[var(--foreground)] drop-shadow-[0_0_10px_rgba(0,0,0,.75)]" /><h2 className="text-sm font-extrabold text-foreground">Ask Lulu AI</h2></div><div className="relative"><Bot size={15} className="absolute left-3 top-3 text-[var(--muted-foreground)]" /><input value={aiPrompt} onChange={event => setAiPrompt(event.target.value)} placeholder="Ask Lulu AI about your carts..." className="w-full rounded-lg border border-border bg-[var(--secondary)]/70 py-2.5 pl-9 pr-3 text-xs text-[var(--primary-foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)] focus:ring-2 focus:ring-[var(--border)]/25" /></div><div className="mt-3 flex flex-wrap gap-2">{aiPrompts.map(prompt => <button key={prompt.label} onClick={() => setAiPrompt(prompt.label)} className="rounded-full border border-border bg-secondary px-2.5 py-1.5 text-[10px] font-semibold text-[var(--muted-foreground)] hover:border-[var(--border)]/70 hover:text-foreground">{prompt.label}</button>)}</div><div className="mt-4 rounded-lg border border-[var(--border)]/20 bg-[var(--primary)]/10 p-3 text-xs text-[var(--foreground)]" role="note" aria-label="Proactive AI insight"><p><Sparkles size={13} className="mr-1 inline text-[var(--foreground)]" /><em className="font-bold text-[var(--foreground)]">AI Insight:</em> 3 carts were abandoned after checkout started in the last 24h, representing €1,069 in combined value. 2 involved payment stage failures.</p><button className="mt-3 rounded-md bg-[var(--primary)] px-3 py-1.5 text-[11px] font-black text-primary-foreground shadow-[0_0_18px_rgba(0,0,0,.4)] hover:bg-[var(--primary)]">Review Checkout Issues</button></div></article></section>

          <section className="rounded-2xl border border-border bg-secondary px-5 py-4 shadow-[0_22px_70px_rgba(0,0,0,.28)] backdrop-blur-sm"><div className="flex flex-wrap items-center gap-4"><div className="flex items-center gap-2"><Cloud size={17} className="text-[var(--foreground)] drop-shadow-[0_0_8px_rgba(0,0,0,.45)]" /><h2 className="text-sm font-extrabold text-foreground">Cart Synchronization</h2></div><div className="grid flex-1 gap-3 md:grid-cols-3">{syncRows.map(item => <div key={item.name} className="flex items-center gap-2 text-xs"><span className={`h-2 w-2 rounded-full ${item.syncing ? 'animate-pulse bg-[var(--primary)] shadow-[0_0_14px_rgba(0,0,0,.75)]' : 'animate-pulse bg-[var(--primary)] shadow-[0_0_14px_rgba(0,0,0,.75)]'} text-primary-foreground`} /><span className="font-black text-[var(--foreground)]">{item.name}</span><span className="text-[var(--muted-foreground)]">({item.platform})</span><span className={`font-black ${item.syncing ? 'text-[var(--foreground)]' : 'text-[var(--foreground)]'}`}>{item.status} {item.syncing ? '↻' : '✓'}</span><span className="text-[10px] text-[var(--muted-foreground)]">— {item.time}</span></div>)}</div><button className="text-xs font-black text-[var(--foreground)] hover:text-foreground">View Sync Details <ChevronRight size={13} className="inline" /></button></div></section>
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
