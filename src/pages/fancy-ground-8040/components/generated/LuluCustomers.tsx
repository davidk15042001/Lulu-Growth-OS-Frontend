import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, Archive, ArrowDownToLine, ArrowLeft, ArrowRight, Bot, Check, ChevronDown, ChevronRight, CircleHelp, ClipboardList, Copy, Ellipsis, ExternalLink, Filter, Grid2X2, Image, LayoutDashboard, Leaf, List, Mail, Menu, MoreHorizontal, Package, Pencil, Plus, RefreshCw, Search, Settings, ShieldCheck, Sparkles, Store, Tag, UserRound, Users, WandSparkles, X, Zap } from 'lucide-react';
type Platform = 'Shopify' | 'WooCommerce' | 'Webflow';
type Customer = {
  id: string;
  initials?: string;
  name: string;
  email: string;
  store: string;
  platforms: Platform[];
  orders: string;
  spend: string;
  lastOrder: string;
  type: 'New' | 'Returning' | 'Guest';
  status: 'Complete' | 'Incomplete' | 'Attention' | 'Duplicate';
  updated: string;
  amber?: boolean;
  guest?: boolean;
};
type IconType = typeof Users;
const primaryNav: {
  label: string;
  icon: IconType;
}[] = [{
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  label: 'AI Platform',
  icon: WandSparkles
}, {
  label: 'CRM',
  icon: Users
}, {
  label: 'Marketing',
  icon: Mail
}, {
  label: 'Advertising',
  icon: Image
}, {
  label: 'Ecommerce',
  icon: Store
}, {
  label: 'Reports',
  icon: Activity
}, {
  label: 'Settings',
  icon: Settings
}];
const ecommerceNav = ['Overview', 'Stores', 'Products', 'Categories', 'Orders', 'Customers', 'Inventory', 'Reviews', 'Merchandising', 'Automation'];
const customers: Customer[] = [{
  id: 'john',
  initials: 'JS',
  name: 'John Smith',
  email: 'john@example.com',
  store: 'Lulu Store',
  platforms: ['Shopify'],
  orders: '12',
  spend: '€1,840.00',
  lastOrder: '08 Aug',
  type: 'Returning',
  status: 'Complete',
  updated: '2h ago'
}, {
  id: 'sarah',
  initials: 'SL',
  name: 'Sarah Lee',
  email: 'sarah.lee@email.com',
  store: 'Lulu Shop',
  platforms: ['WooCommerce'],
  orders: '3',
  spend: '€389.00',
  lastOrder: '07 Aug',
  type: 'Returning',
  status: 'Complete',
  updated: '1d ago'
}, {
  id: 'mike',
  initials: 'MJ',
  name: 'Mike Johnson',
  email: 'mike.j@work.com',
  store: 'Connected stores',
  platforms: ['Shopify', 'WooCommerce'],
  orders: '7',
  spend: '€924.50',
  lastOrder: '06 Aug',
  type: 'Returning',
  status: 'Duplicate',
  updated: '1d ago',
  amber: true
}, {
  id: 'guest',
  name: 'Guest',
  email: 'guest_29471@noreply',
  store: 'Webflow Shop',
  platforms: ['Webflow'],
  orders: '1',
  spend: '€45.00',
  lastOrder: '05 Aug',
  type: 'Guest',
  status: 'Incomplete',
  updated: '2d ago',
  guest: true
}, {
  id: 'emma',
  initials: 'ED',
  name: 'Emma Davis',
  email: 'emma.d@email.com',
  store: 'Lulu Store',
  platforms: ['Shopify'],
  orders: '28',
  spend: '€4,220.00',
  lastOrder: '04 Aug',
  type: 'Returning',
  status: 'Complete',
  updated: '3d ago'
}, {
  id: 'tom',
  initials: 'TW',
  name: 'Tom Wilson',
  email: 'tom@brand.com',
  store: 'Lulu Shop',
  platforms: ['WooCommerce'],
  orders: '2',
  spend: '€178.00',
  lastOrder: '03 Aug',
  type: 'New',
  status: 'Complete',
  updated: '3d ago'
}, {
  id: 'unknown',
  name: 'Unknown customer',
  email: '— Missing —',
  store: 'Lulu Shop',
  platforms: ['WooCommerce'],
  orders: '1',
  spend: '€62.00',
  lastOrder: '02 Aug',
  type: 'Guest',
  status: 'Attention',
  updated: '4d ago',
  amber: true
}];
const metrics = [{
  label: 'Total Customers',
  value: '3,847',
  note: 'Across all stores',
  icon: Users,
  tone: 'text-[var(--foreground)]',
  bg: 'bg-[var(--secondary)]'
}, {
  label: 'New Customers',
  value: '124',
  note: 'This period',
  icon: Plus,
  tone: 'text-[var(--foreground)]',
  bg: 'bg-[var(--secondary)]'
}, {
  label: 'Returning Customers',
  value: '2,291',
  note: '59.6% of total',
  icon: RefreshCw,
  tone: 'text-[var(--foreground)]',
  bg: 'bg-[var(--secondary)]'
}, {
  label: 'Attention Required',
  value: '18',
  note: 'Needs review',
  icon: AlertTriangle,
  tone: 'text-[var(--chart-1)]',
  bg: 'bg-[var(--secondary)]'
}, {
  label: 'Duplicate Candidates',
  value: '7',
  note: 'Pending review',
  icon: Copy,
  tone: 'text-[var(--chart-1)]',
  bg: 'bg-[var(--secondary)]'
}, {
  label: 'Incomplete Profiles',
  value: '43',
  note: '1.1% of total',
  icon: CircleHelp,
  tone: 'text-[var(--muted-foreground)]',
  bg: 'bg-[var(--secondary)]'
}];
const attentionRows = [{
  initials: 'UC',
  name: 'Unknown Customer',
  detail: 'Missing name and email',
  store: 'WooCommerce',
  action: 'Missing Email'
}, {
  initials: 'G',
  name: 'guest_10482@...',
  detail: 'Sync failure',
  store: 'Shopify · Lulu Store',
  action: 'Sync Failed'
}, {
  initials: 'MK',
  name: 'Maria K.',
  detail: 'Duplicate candidate',
  store: 'Shopify + WooCommerce',
  action: 'Duplicate'
}];
const issueChips = ['Missing Email: 5', 'Missing Name: 3', 'Sync Failed: 4', 'Invalid Data: 2', 'Store Conflict: 2', 'Incomplete Profile: 2'];
const activities = [{
  icon: UserRound,
  color: 'text-foreground bg-secondary',
  text: 'New customer registered',
  person: 'Emma Thompson',
  time: '15 min ago',
  source: 'Admin',
  store: 'Shopify'
}, {
  icon: RefreshCw,
  color: 'text-foreground bg-secondary',
  text: 'Returning customer order',
  person: 'John Smith',
  time: '2h ago',
  source: 'System',
  store: 'Shopify'
}, {
  icon: Sparkles,
  color: 'text-foreground bg-secondary',
  text: 'AI found 2 duplicate candidates',
  person: 'Lulu AI',
  time: '3h ago',
  source: 'Lulu AI',
  store: 'All Stores'
}, {
  icon: RefreshCw,
  color: 'text-foreground bg-secondary',
  text: 'Customer sync completed',
  person: 'System',
  time: '4h ago',
  source: 'System',
  store: 'WooCommerce'
}, {
  icon: Pencil,
  color: 'text-foreground bg-secondary',
  text: 'Profile updated',
  person: 'Sarah Lee',
  time: '5h ago',
  source: 'Admin',
  store: 'WooCommerce'
}, {
  icon: ArrowDownToLine,
  color: 'text-muted-foreground bg-secondary',
  text: 'Refund processed',
  person: 'guest_29471',
  time: '1d ago',
  source: 'System',
  store: 'Webflow'
}, {
  icon: AlertTriangle,
  color: 'text-chart-1 bg-chart-1/10',
  text: 'Sync failed for 2 records',
  person: 'System',
  time: '1d ago',
  source: 'System',
  store: 'WooCommerce'
}];
const healthRows: [string, string, string, boolean][] = [['Profile Completeness', 'Attention', '43 incomplete (98.9%)', false], ['Store Synchronization', 'Healthy', 'Last sync 6 min ago', true], ['Duplicate Status', 'Attention', '7 candidates pending review', false], ['Email Coverage', 'Healthy', '99.1% have email', true], ['Order Relationships', 'Healthy', 'All relationships mapped', true], ['Contact Information', 'Attention', '8 missing phone', false]];
function PlatformChip({
  platform
}: {
  platform: Platform;
}) {
  const styles = platform === 'Shopify' ? 'bg-[var(--secondary)] text-[var(--chart-4)]' : platform === 'WooCommerce' ? 'bg-[var(--secondary)] text-[var(--foreground)]' : 'bg-[var(--secondary)] text-[var(--foreground)]';
  return <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-semibold ${styles}`}><span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />{platform}</span>;
}
export function LuluCustomers() {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [showAttention, setShowAttention] = useState(true);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [storeOpen, setStoreOpen] = useState(false);
  const filtered = useMemo(() => customers.filter(customer => `${customer.name} ${customer.email} ${customer.id}`.toLowerCase().includes(search.toLowerCase())), [search]);
  const toggleSelection = (id: string) => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  return <div className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)]">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[238px] flex-col bg-[var(--sidebar)] text-muted-foreground lg:flex">
      <div className="flex h-[74px] items-center gap-3 border-b border-border px-6"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--primary)] text-primary-foreground"><Sparkles size={16} /></div><strong className="text-[17px] tracking-[-0.03em] text-foreground">Lulu AI</strong></div>
      <nav className="flex-1 px-3 py-5"><p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>{primaryNav.map(item => {
          const Icon = item.icon;
          return <div key={item.label}><button className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition hover:bg-secondary hover:text-foreground ${item.label === 'Ecommerce' ? 'bg-secondary text-foreground' : ''}`}><Icon size={16} strokeWidth={1.8} /><span>{item.label}</span>{item.label === 'Ecommerce' && <ChevronDown size={14} className="ml-auto" />}</button>{item.label === 'Ecommerce' && <div className="ml-[23px] border-l border-border py-1 pl-4">{ecommerceNav.map(item => <button key={item} className={`block w-full rounded-md px-3 py-1.5 text-left text-[12px] transition hover:text-foreground ${item === 'Customers' ? 'font-semibold text-[var(--foreground)]' : 'text-foreground'}`}>{item}</button>)}</div>}</div>;
        })}</nav>
      <div className="border-t border-border p-4"><div className="flex items-center gap-3 rounded-lg px-2 py-2"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--secondary)] text-xs font-bold text-[var(--foreground)]">AK</div><div className="min-w-0"><p className="truncate text-xs font-semibold text-foreground">Alex Kim</p><p className="truncate text-[11px] text-muted-foreground">Admin workspace</p></div><MoreHorizontal size={16} className="ml-auto" /></div></div>
    </aside>
    <main className="lg:ml-[238px]">
      <header className="flex min-h-[74px] items-center justify-between border-b border-[var(--border)] bg-card px-5 py-4 sm:px-8"><div className="flex items-center gap-3"><button className="rounded-md p-2 hover:bg-sidebar lg:hidden" aria-label="Open navigation"><Menu size={19} /></button><div><div className="mb-1 flex items-center gap-2 text-[11px] font-medium text-[var(--muted-foreground)]"><span>Ecommerce</span><ChevronRight size={12} /><span className="text-[var(--muted-foreground)]">Customers</span></div><h1 className="text-[24px] font-bold tracking-[-0.035em]">Customers</h1><p className="mt-1 hidden text-[13px] text-[var(--muted-foreground)] sm:block">Manage and monitor customers across your connected ecommerce stores.</p></div></div><div className="flex items-center gap-2"><button className="hidden items-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm shadow-black/10 transition hover:bg-[var(--primary)] sm:flex"><Sparkles size={14} />Ask Lulu AI</button><button className="rounded-lg border border-[var(--border)] bg-card p-2 text-[var(--muted-foreground)] hover:bg-card" aria-label="Refresh customers"><RefreshCw size={16} /></button><button className="hidden items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)] hover:bg-card sm:flex"><ArrowDownToLine size={14} />Export</button><button className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted-foreground)] hover:bg-card" aria-label="More actions"><Ellipsis size={17} /></button></div></header>
      <div className="space-y-5 p-5 sm:p-8">
        <section className="flex flex-col gap-3 xl:flex-row xl:items-center" aria-label="Customer filters"><div className="relative"><button onClick={() => setStoreOpen(!storeOpen)} className="flex w-full items-center justify-between gap-10 rounded-lg border border-[var(--border)] bg-card px-3 py-2.5 text-xs font-semibold text-[var(--muted-foreground)] shadow-sm xl:w-auto"><span className="flex items-center gap-2"><Store size={15} className="text-[var(--foreground)]" />All Stores</span><ChevronDown size={14} /></button>{storeOpen && <div className="absolute left-0 top-12 z-10 w-52 rounded-lg border border-border bg-card p-1.5 shadow-xl"><button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs hover:bg-card"><span>All Stores</span><span className="h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /></button><button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs hover:bg-card"><PlatformChip platform="Shopify" />Lulu Store</button><button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs hover:bg-card"><PlatformChip platform="WooCommerce" />Lulu Shop</button><button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs hover:bg-card"><PlatformChip platform="Webflow" />Webflow Shop</button></div>}</div><button className="flex items-center justify-between gap-5 rounded-lg border border-[var(--border)] bg-card px-3 py-2.5 text-xs font-semibold text-[var(--muted-foreground)] shadow-sm">Last 30 Days <ChevronDown size={14} /></button><div className="relative min-w-0 flex-1"><Search size={15} className="absolute left-3 top-3 text-[var(--muted-foreground)]" /><input value={search} onChange={event => setSearch(event.target.value)} aria-label="Search customers" className="w-full rounded-lg border border-[var(--border)] bg-card py-2.5 pl-9 pr-3 text-xs outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)] focus:ring-2 focus:ring-[var(--border)]/15" placeholder="Search by name, email, phone, customer ID, or order ID..." /></div><button className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-card px-3 py-2.5 text-xs font-semibold text-[var(--muted-foreground)] shadow-sm"><Filter size={14} />Filters <span className="rounded-full bg-[var(--primary)] px-1.5 py-0.5 text-[10px] text-primary-foreground">3</span></button><div className="flex rounded-lg border border-[var(--border)] bg-card p-1"><button onClick={() => setView('table')} className={`rounded-md p-1.5 ${view === 'table' ? 'bg-[var(--secondary)] text-[var(--foreground)]' : 'text-foreground'}`} aria-label="Table view"><List size={15} /></button><button onClick={() => setView('grid')} className={`rounded-md p-1.5 ${view === 'grid' ? 'bg-[var(--secondary)] text-[var(--foreground)]' : 'text-foreground'}`} aria-label="Grid view"><Grid2X2 size={15} /></button></div></section>
        <section className="grid grid-cols-2 gap-3 xl:grid-cols-6">{metrics.map(metric => {
            const Icon = metric.icon;
            return <article key={metric.label} className="rounded-xl border border-[var(--border)] bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><div className="flex items-start justify-between"><div><p className="text-[11px] font-medium text-[var(--muted-foreground)]">{metric.label}</p><p className="mt-2 text-[22px] font-bold tracking-[-0.04em] text-[var(--foreground)]">{metric.value}</p><p className="mt-1 text-[10px] text-[var(--muted-foreground)]">{metric.note}</p></div><span className={`rounded-lg p-2 ${metric.bg} ${metric.tone}`}><Icon size={16} /></span></div></article>;
          })}</section>
        <section className="rounded-xl border border-[var(--border)] border-l-[3px] border-l-[var(--border)] bg-card shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"><button onClick={() => setShowAttention(!showAttention)} className="flex items-center gap-2 text-left"><ChevronDown size={16} className={`text-[var(--chart-1)] transition ${showAttention ? '' : '-rotate-90'}`} /><h2 className="text-[14px] font-bold">Customers Requiring Attention</h2><span className="rounded-full bg-[var(--secondary)] px-2 py-0.5 text-[10px] font-bold text-[var(--chart-1)]">18</span></button><div className="flex flex-wrap gap-1.5">{issueChips.map(chip => <button key={chip} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-[10px] font-semibold text-[var(--foreground)] hover:bg-[var(--secondary)]">{chip}</button>)}</div></div>{showAttention && <div className="border-t border-[var(--border)] px-5 pb-3">{attentionRows.map(row => <div key={row.name} className="grid items-center gap-3 border-b border-[var(--border)] py-3 last:border-0 sm:grid-cols-[28px_1.2fr_1.1fr_1fr_auto]"><div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--secondary)] text-[10px] font-bold text-[var(--foreground)]" aria-label={`${row.name} avatar`}>{row.initials}</div><div><p className="text-xs font-semibold text-[var(--foreground)]">{row.name}</p><p className="text-[10px] text-[var(--muted-foreground)]">{row.detail}</p></div><span className="text-[11px] text-[var(--muted-foreground)]">{row.detail}</span><span className="w-fit rounded-md bg-[var(--secondary)] px-2 py-1 text-[10px] font-semibold text-[var(--muted-foreground)]">{row.store}</span><div className="flex gap-2"><button className="text-[11px] font-semibold text-[var(--foreground)] hover:underline">Open Customer</button><button className="rounded-md border border-[var(--border)] px-2 py-1 text-[10px] font-semibold text-[var(--muted-foreground)]">Review</button></div></div>)}</div>}<div className="border-t border-[var(--border)] px-5 py-2.5"><button className="text-xs font-bold text-[var(--foreground)]">View All (18) <ArrowRight size={13} className="ml-1 inline" /></button></div></section>
        <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-card shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4"><div className="flex items-center gap-2"><h2 className="text-[14px] font-bold">All Customers</h2><span className="rounded-full bg-[var(--secondary)] px-2 py-0.5 text-[10px] font-bold text-[var(--foreground)]">3,847</span></div>{selected.length > 0 ? <div className="flex items-center gap-3 text-xs"><strong>{selected.length} customers selected</strong><button className="font-semibold text-[var(--foreground)]">Export</button><button className="font-semibold text-[var(--foreground)]">Add Note</button><button className="font-semibold text-[var(--foreground)]">View Activity</button><button onClick={() => setSelected([])} className="text-[var(--muted-foreground)]">Clear selection <X size={13} className="inline" /></button></div> : <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">Updated recently <button className="rounded-md border border-[var(--border)] px-2 py-1 font-semibold text-[var(--muted-foreground)]">Sort: Recent <ChevronDown size={12} className="ml-1 inline" /></button></div>}</div><div className="flex flex-wrap gap-2 border-b border-[var(--border)] px-5 py-3"><span className="text-[11px] font-medium text-[var(--muted-foreground)]">Active filters:</span><span className="flex items-center gap-1 rounded-full bg-[var(--secondary)] px-2.5 py-1 text-[10px] font-semibold text-[var(--foreground)]">All stores <X size={11} /></span><span className="flex items-center gap-1 rounded-full bg-[var(--secondary)] px-2.5 py-1 text-[10px] font-semibold text-[var(--foreground)]">Last 30 days <X size={11} /></span></div>{view === 'table' ? <div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left"><thead className="sticky top-0 z-10 bg-[var(--card)]"><tr className="border-b border-[var(--border)] text-[10px] font-bold uppercase tracking-[0.04em] text-[var(--muted-foreground)]"><th scope="col" className="w-10 px-5 py-3"><input type="checkbox" aria-label="Select all customers" /></th><th scope="col" className="px-2 py-3">Customer</th><th scope="col" className="px-2 py-3">Email</th><th scope="col" className="px-2 py-3">Store</th><th scope="col" className="px-2 py-3">Orders</th><th scope="col" className="px-2 py-3">Total Spend</th><th scope="col" className="px-2 py-3">Last Order</th><th scope="col" className="px-2 py-3">Customer Type</th><th scope="col" className="px-2 py-3">Profile Status</th><th scope="col" className="px-2 py-3">Updated</th><th scope="col" className="px-2 py-3">Actions</th></tr></thead><tbody>{filtered.map(customer => <tr key={customer.id} className={`border-b border-[var(--border)] text-[11px] transition hover:bg-[var(--card)] ${customer.amber ? 'bg-[var(--card)]' : ''}`}><td className="px-5 py-3"><input type="checkbox" checked={selected.includes(customer.id)} onChange={() => toggleSelection(customer.id)} aria-label={`Select ${customer.name}`} /></td><td className="px-2 py-3"><div className="flex items-center gap-2.5"><div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${customer.guest ? 'bg-secondary text-muted-foreground' : 'bg-[var(--secondary)] text-[var(--foreground)]'}`} aria-label={`${customer.name} avatar`}>{customer.guest ? <UserRound size={14} /> : customer.initials}</div><strong className="whitespace-nowrap text-[var(--muted-foreground)]">{customer.name}</strong></div></td><td className="px-2 py-3 text-[var(--muted-foreground)]">{customer.email}</td><td className="px-2 py-3"><div className="flex items-center gap-1">{customer.platforms.map(platform => <PlatformChip key={`${customer.id}-${platform}`} platform={platform} />)}</div></td><td className="px-2 py-3 font-semibold">{customer.orders}</td><td className="px-2 py-3 font-semibold">{customer.spend}</td><td className="px-2 py-3 text-[var(--muted-foreground)]">{customer.lastOrder}</td><td className="px-2 py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${customer.type === 'Returning' ? 'bg-[var(--secondary)] text-[var(--foreground)]' : customer.type === 'New' ? 'bg-[var(--secondary)] text-[var(--foreground)]' : 'bg-[var(--secondary)] text-[var(--muted-foreground)]'}`}>{customer.type}</span></td><td className="px-2 py-3"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${customer.status === 'Complete' ? 'bg-[var(--secondary)] text-[var(--chart-4)]' : customer.status === 'Incomplete' ? 'bg-[var(--secondary)] text-[var(--muted-foreground)]' : 'bg-[var(--secondary)] text-[var(--chart-1)]'}`}>{customer.status === 'Complete' && <Check size={11} />}{customer.status}</span></td><td className="px-2 py-3 whitespace-nowrap text-[var(--muted-foreground)]">{customer.updated}</td><td className="px-2 py-3"><button className="font-semibold text-[var(--foreground)] hover:underline">Open</button><button className="ml-3 text-[var(--muted-foreground)]" aria-label={`More actions for ${customer.name}`}><Ellipsis size={15} /></button></td></tr>)}</tbody></table></div> : <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">{filtered.map(customer => <article key={customer.id} className="rounded-lg border border-border p-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--secondary)] text-xs font-bold text-[var(--foreground)]">{customer.guest ? <UserRound size={15} /> : customer.initials}</div><div><h3 className="text-sm font-bold">{customer.name}</h3><p className="text-[11px] text-muted-foreground">{customer.email}</p></div></div><div className="mt-4 flex justify-between text-xs"><span>{customer.orders} orders</span><strong>{customer.spend}</strong></div><div className="mt-3 flex justify-between"><PlatformChip platform={customer.platforms[0]} /><span className="text-xs font-semibold text-[var(--foreground)]">Open</span></div></article>)}</div>}<div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-[11px] text-[var(--muted-foreground)]"><span>Showing 1–25 of 3,847</span><div className="flex items-center gap-1"><button className="rounded-md border border-[var(--border)] p-1.5"><ArrowLeft size={13} /></button>{['1', '2', '3', '…', '154'].map(page => <button key={page} className={`h-7 min-w-7 rounded-md px-2 ${page === '1' ? 'bg-[var(--primary)] font-bold text-primary-foreground' : 'hover:bg-secondary'}`}>{page}</button>)}<button className="rounded-md border border-[var(--border)] p-1.5"><ArrowRight size={13} /></button></div></div></section>
        <section className="rounded-xl border border-[var(--border)] border-l-[3px] border-l-[var(--border)] bg-card shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><div className="flex items-center justify-between px-5 py-4"><div className="flex items-center gap-2"><Copy size={16} className="text-[var(--foreground)]" /><h2 className="text-[14px] font-bold">Possible Duplicate Customers</h2><span className="rounded-full bg-[var(--secondary)] px-2 py-0.5 text-[10px] font-bold text-[var(--foreground)]">7</span></div><button className="text-[var(--muted-foreground)]" aria-label="Collapse duplicate customers"><ChevronDown size={16} /></button></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-[11px]"><thead className="border-y border-[var(--border)] bg-[var(--card)] text-[10px] font-bold uppercase text-[var(--muted-foreground)]"><tr><th scope="col" className="px-5 py-2.5">Customer A</th><th scope="col" className="px-2 py-2.5">Customer B</th><th scope="col" className="px-2 py-2.5">Matching Fields</th><th scope="col" className="px-2 py-2.5">Store</th><th scope="col" className="px-2 py-2.5">Actions</th></tr></thead><tbody>{[['Mike Johnson (Shopify)', 'Mike Johnson (WooCommerce)', 'Email + Name', 'Shopify + WooCommerce'], ['Sarah Lee', 'S. Lee', 'Name + Phone', 'Shopify'], ['Emma D', 'Emma Davis', 'Email', 'WooCommerce']].map(row => <tr key={row[0]} className="border-b border-[var(--border)]"><td className="px-5 py-3 font-semibold">{row[0]}</td><td className="px-2 py-3 font-semibold">{row[1]}</td><td className="px-2 py-3 text-[var(--muted-foreground)]">{row[2]}</td><td className="px-2 py-3 text-[var(--muted-foreground)]">{row[3]}</td><td className="px-2 py-3"><button className="font-semibold text-[var(--foreground)]">Review</button><button className="ml-4 font-semibold text-[var(--muted-foreground)]">Open Both</button></td></tr>)}</tbody></table></div><p className="px-5 py-3 text-[11px] text-[var(--muted-foreground)]">Merging requires review and confirmation. Records are never merged automatically.</p></section>
        <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]"><section className="rounded-xl border border-[var(--border)] bg-card shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><div className="border-b border-[var(--border)] px-5 py-4"><h2 className="text-[14px] font-bold">Recent Customer Activity</h2></div><div className="divide-y divide-[var(--foreground)] px-5">{activities.map(activity => {
                const Icon = activity.icon;
                return <div key={`${activity.text}-${activity.time}`} className="flex items-center gap-3 py-3"><span className={`rounded-lg p-2 ${activity.color}`}><Icon size={14} /></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-[var(--muted-foreground)]">{activity.text} <span className="font-normal text-[var(--muted-foreground)]">— {activity.person}</span></p><p className="mt-0.5 text-[10px] text-[var(--muted-foreground)]">{activity.time} · <span className="font-medium text-[var(--muted-foreground)]">{activity.source}</span></p></div><span className="hidden rounded-md bg-[var(--secondary)] px-2 py-1 text-[10px] font-semibold text-[var(--muted-foreground)] sm:inline">{activity.store}</span></div>;
              })}</div></section><section className="rounded-xl border border-[var(--border)] bg-card shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><div className="border-b border-[var(--border)] px-5 py-4"><h2 className="text-[14px] font-bold">Customer Data Health</h2></div><div className="px-5">{healthRows.map(row => <div key={row[0]} className="flex items-center justify-between border-b border-[var(--border)] py-3"><div><p className="text-xs font-semibold text-[var(--muted-foreground)]">{row[0]}</p><p className={`mt-1 text-[10px] font-semibold ${row[3] ? 'text-[var(--foreground)]' : 'text-[var(--foreground)]'}`}><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />{row[1]}</p></div><span className="text-right text-[10px] text-[var(--muted-foreground)]">{row[2]}</span></div>)}</div><div className="px-5 py-3"><button className="text-xs font-bold text-[var(--foreground)]">View All Issues <ArrowRight size={13} className="ml-1 inline" /></button></div></section></div>
        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"><div className="flex items-center gap-2"><Sparkles size={17} className="text-[var(--muted-foreground)]" /><h2 className="text-[14px] font-bold">Ask Lulu AI</h2></div><div className="mt-4 flex gap-2 rounded-lg border border-[var(--border)] bg-card p-2"><input className="min-w-0 flex-1 px-2 text-xs outline-none placeholder:text-[var(--muted-foreground)]" placeholder="Ask Lulu AI about your customers..." aria-label="Ask Lulu AI" /><button className="rounded-md bg-[var(--primary)] px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-[var(--primary)]">Ask</button></div><div className="mt-3 flex flex-wrap gap-2">{['Find duplicate records', 'Customers with incomplete profiles', 'Which customers need attention?', 'Summarize new customers this week'].map(prompt => <button key={prompt} className="rounded-full border border-[var(--border)] bg-card px-3 py-1.5 text-[10px] font-semibold text-[var(--muted-foreground)] hover:border-[var(--border)] hover:text-[var(--foreground)]">{prompt}</button>)}</div><div className="mt-4 flex flex-col justify-between gap-3 rounded-lg border border-[var(--border)] bg-card px-4 py-3 sm:flex-row sm:items-center"><p className="text-xs text-[var(--muted-foreground)]"><Zap size={14} className="mr-2 inline text-[var(--foreground)]" /><strong>AI Insight:</strong> 7 customers appear across multiple stores with matching email addresses. Review recommended before any manual record merging.</p><button className="whitespace-nowrap rounded-md border border-[var(--border)] px-3 py-2 text-[11px] font-bold text-[var(--foreground)]">Review Duplicates</button></div></section>
      </div>
    </main>
  </div>;
}