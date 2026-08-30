import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, Archive, ArrowDownToLine, ArrowLeft, ArrowRight, Bot, Check, ChevronDown, ChevronRight, CircleHelp, ClipboardList, Copy, Ellipsis, ExternalLink, Filter, Grid2X2, Image, LayoutDashboard, Leaf, List, Mail, Menu, MoreHorizontal, Package, Pencil, Plus, RefreshCw, Search, Settings, ShieldCheck, Sparkles, Store, Tag, UserRound, Users, WandSparkles, X, Zap } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
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
}[] = [];
const ecommerceNav = ['Overview', 'Stores', 'Products', 'Categories', 'Orders', 'Customers', 'Inventory', 'Reviews', 'Merchandising', 'Automation'];
const customers: Customer[] = [];
const metrics: Array<Record<string, any>> = [];
const attentionRows: Array<Record<string, any>> = [];
const issueChips: string[] = [];
const activities: Array<Record<string, any>> = [];
const healthRows: [string, string, string, boolean][] = [];
function PlatformChip({
  platform
}: {
  platform: Platform;
}) {
  const styles = platform === 'Shopify' ? 'bg-[var(--secondary)] text-[var(--chart-4)]' : platform === 'WooCommerce' ? 'bg-[var(--secondary)] text-[var(--foreground)]' : 'bg-[var(--secondary)] text-[var(--foreground)]';
  return <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-semibold ${styles}`}><span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />{platform}</span>;
}
export function LuluCustomers() {
  const { items: liveCustomerRecords } = useLiveRecords('ecommerce_customers');
  const liveCustomers = liveCustomerRecords as unknown as Customer[];
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [showAttention, setShowAttention] = useState(true);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [storeOpen, setStoreOpen] = useState(false);
  const filtered = useMemo(() => liveCustomers.filter(customer => `${customer.name} ${customer.email} ${customer.id}`.toLowerCase().includes(search.toLowerCase())), [search]);
  const toggleSelection = (id: string) => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  return <div className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)]">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[238px] flex-col bg-[var(--sidebar)] text-muted-foreground lg:flex">
      <div className="flex h-[74px] items-center gap-3 border-b border-border px-6"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--primary)] text-primary-foreground"><Sparkles size={16} /></div><strong className="text-[17px] tracking-[-0.03em] text-foreground">Lulu AI</strong></div>
      <LuluSectionNavigation activeId="fancy-ground-8040" />
      <div className="border-t border-border p-4"><div className="flex items-center gap-3 rounded-lg px-2 py-2"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--secondary)] text-xs font-bold text-[var(--foreground)]">AK</div><div className="min-w-0"><p className="truncate text-xs font-semibold text-foreground">Workspace account</p><p className="truncate text-[11px] text-muted-foreground">Connected workspace</p></div><MoreHorizontal size={16} className="ml-auto" /></div></div>
    </aside>
    <main className="lg:ml-[238px]">
      <header className="flex min-h-[74px] items-center justify-between border-b border-[var(--border)] bg-card px-5 py-4 sm:px-8"><div className="flex items-center gap-3"><button className="rounded-md p-2 hover:bg-sidebar lg:hidden" aria-label="Open navigation"><Menu size={19} /></button><div><div className="mb-1 flex items-center gap-2 text-[11px] font-medium text-[var(--muted-foreground)]"><span>Ecommerce</span><ChevronRight size={12} /><span className="text-[var(--muted-foreground)]">Customers</span></div><h1 className="text-[24px] font-bold tracking-[-0.035em]">Customers</h1><p className="mt-1 hidden text-[13px] text-[var(--muted-foreground)] sm:block">Manage and monitor customers across your connected ecommerce stores.</p></div></div><div className="flex items-center gap-2"><button className="hidden items-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm shadow-black/10 transition hover:bg-[var(--primary)] sm:flex"><Sparkles size={14} />Ask Lulu AI</button><button className="rounded-lg border border-[var(--border)] bg-card p-2 text-[var(--muted-foreground)] hover:bg-card" aria-label="Refresh customers"><RefreshCw size={16} /></button><button className="hidden items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)] hover:bg-card sm:flex"><ArrowDownToLine size={14} />Export</button><button className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted-foreground)] hover:bg-card" aria-label="More actions"><Ellipsis size={17} /></button></div></header>
      <div className="space-y-5 p-5 sm:p-8">
        <section className="flex flex-col gap-3 xl:flex-row xl:items-center" aria-label="Customer filters"><div className="relative"><button onClick={() => setStoreOpen(!storeOpen)} className="flex w-full items-center justify-between gap-10 rounded-lg border border-[var(--border)] bg-card px-3 py-2.5 text-xs font-semibold text-[var(--muted-foreground)] shadow-sm xl:w-auto"><span className="flex items-center gap-2"><Store size={15} className="text-[var(--foreground)]" />All Stores</span><ChevronDown size={14} /></button>{storeOpen && <div className="absolute left-0 top-12 z-10 w-52 rounded-lg border border-border bg-card p-1.5 shadow-xl"><button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs hover:bg-card"><span>All Stores</span><span className="h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /></button><button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs hover:bg-card"><PlatformChip platform="Shopify" />Connected store</button><button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs hover:bg-card"><PlatformChip platform="WooCommerce" />Lulu Shop</button><button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs hover:bg-card"><PlatformChip platform="Webflow" />Connected store</button></div>}</div><button className="flex items-center justify-between gap-5 rounded-lg border border-[var(--border)] bg-card px-3 py-2.5 text-xs font-semibold text-[var(--muted-foreground)] shadow-sm">Last 30 Days <ChevronDown size={14} /></button><div className="relative min-w-0 flex-1"><Search size={15} className="absolute left-3 top-3 text-[var(--muted-foreground)]" /><input value={search} onChange={event => setSearch(event.target.value)} aria-label="Search customers" className="w-full rounded-lg border border-[var(--border)] bg-card py-2.5 pl-9 pr-3 text-xs outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)] focus:ring-2 focus:ring-[var(--border)]/15" placeholder="Search by name, email, phone, customer ID, or order ID..." /></div><button className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-card px-3 py-2.5 text-xs font-semibold text-[var(--muted-foreground)] shadow-sm"><Filter size={14} />Filters <span className="rounded-full bg-[var(--primary)] px-1.5 py-0.5 text-[10px] text-primary-foreground">3</span></button><div className="flex rounded-lg border border-[var(--border)] bg-card p-1"><button onClick={() => setView('table')} className={`rounded-md p-1.5 ${view === 'table' ? 'bg-[var(--secondary)] text-[var(--foreground)]' : 'text-foreground'}`} aria-label="Table view"><List size={15} /></button><button onClick={() => setView('grid')} className={`rounded-md p-1.5 ${view === 'grid' ? 'bg-[var(--secondary)] text-[var(--foreground)]' : 'text-foreground'}`} aria-label="Grid view"><Grid2X2 size={15} /></button></div></section>
        <section className="grid grid-cols-2 gap-3 xl:grid-cols-6">{metrics.map(metric => {
            const Icon = metric.icon;
            return <article key={metric.label} className="rounded-xl border border-[var(--border)] bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><div className="flex items-start justify-between"><div><p className="text-[11px] font-medium text-[var(--muted-foreground)]">{metric.label}</p><p className="mt-2 text-[22px] font-bold tracking-[-0.04em] text-[var(--foreground)]">{metric.value}</p><p className="mt-1 text-[10px] text-[var(--muted-foreground)]">{metric.note}</p></div><span className={`rounded-lg p-2 ${metric.bg} ${metric.tone}`}><Icon size={16} /></span></div></article>;
          })}</section>
        <section className="rounded-xl border border-[var(--border)] border-l-[3px] border-l-[var(--border)] bg-card shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"><button onClick={() => setShowAttention(!showAttention)} className="flex items-center gap-2 text-left"><ChevronDown size={16} className={`text-[var(--chart-1)] transition ${showAttention ? '' : '-rotate-90'}`} /><h2 className="text-[14px] font-bold">Customers Requiring Attention</h2><span className="rounded-full bg-[var(--secondary)] px-2 py-0.5 text-[10px] font-bold text-[var(--chart-1)]">0</span></button><div className="flex flex-wrap gap-1.5">{issueChips.map(chip => <button key={chip} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-[10px] font-semibold text-[var(--foreground)] hover:bg-[var(--secondary)]">{chip}</button>)}</div></div>{showAttention && <div className="border-t border-[var(--border)] px-5 pb-3">{attentionRows.map(row => <div key={row.name} className="grid items-center gap-3 border-b border-[var(--border)] py-3 last:border-0 sm:grid-cols-[28px_1.2fr_1.1fr_1fr_auto]"><div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--secondary)] text-[10px] font-bold text-[var(--foreground)]" aria-label={`${row.name} avatar`}>{row.initials}</div><div><p className="text-xs font-semibold text-[var(--foreground)]">{row.name}</p><p className="text-[10px] text-[var(--muted-foreground)]">{row.detail}</p></div><span className="text-[11px] text-[var(--muted-foreground)]">{row.detail}</span><span className="w-fit rounded-md bg-[var(--secondary)] px-2 py-1 text-[10px] font-semibold text-[var(--muted-foreground)]">{row.store}</span><div className="flex gap-2"><button className="text-[11px] font-semibold text-[var(--foreground)] hover:underline">Open Customer</button><button className="rounded-md border border-[var(--border)] px-2 py-1 text-[10px] font-semibold text-[var(--muted-foreground)]">Review</button></div></div>)}</div>}<div className="border-t border-[var(--border)] px-5 py-2.5"><button className="text-xs font-bold text-[var(--foreground)]">View All <ArrowRight size={13} className="ml-1 inline" /></button></div></section>
        <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-card shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-4"><div className="flex items-center gap-2"><h2 className="text-[14px] font-bold">All Customers</h2><span className="rounded-full bg-[var(--secondary)] px-2 py-0.5 text-[10px] font-bold text-[var(--foreground)]">{filtered.length}</span></div>{selected.length > 0 ? <div className="flex items-center gap-3 text-xs"><strong>{selected.length} customers selected</strong><button className="font-semibold text-[var(--foreground)]">Export</button><button className="font-semibold text-[var(--foreground)]">Add Note</button><button className="font-semibold text-[var(--foreground)]">View Activity</button><button onClick={() => setSelected([])} className="text-[var(--muted-foreground)]">Clear selection <X size={13} className="inline" /></button></div> : <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">Updated recently <button className="rounded-md border border-[var(--border)] px-2 py-1 font-semibold text-[var(--muted-foreground)]">Sort: Recent <ChevronDown size={12} className="ml-1 inline" /></button></div>}</div><div className="flex flex-wrap gap-2 border-b border-[var(--border)] px-5 py-3"><span className="text-[11px] font-medium text-[var(--muted-foreground)]">Active filters:</span><span className="flex items-center gap-1 rounded-full bg-[var(--secondary)] px-2.5 py-1 text-[10px] font-semibold text-[var(--foreground)]">All stores <X size={11} /></span><span className="flex items-center gap-1 rounded-full bg-[var(--secondary)] px-2.5 py-1 text-[10px] font-semibold text-[var(--foreground)]">Last 30 days <X size={11} /></span></div>{view === 'table' ? <div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left"><thead className="sticky top-0 z-10 bg-[var(--card)]"><tr className="border-b border-[var(--border)] text-[10px] font-bold uppercase tracking-[0.04em] text-[var(--muted-foreground)]"><th scope="col" className="w-10 px-5 py-3"><input type="checkbox" aria-label="Select all customers" /></th><th scope="col" className="px-2 py-3">Customer</th><th scope="col" className="px-2 py-3">Email</th><th scope="col" className="px-2 py-3">Store</th><th scope="col" className="px-2 py-3">Orders</th><th scope="col" className="px-2 py-3">Total Spend</th><th scope="col" className="px-2 py-3">Last Order</th><th scope="col" className="px-2 py-3">Customer Type</th><th scope="col" className="px-2 py-3">Profile Status</th><th scope="col" className="px-2 py-3">Updated</th><th scope="col" className="px-2 py-3">Actions</th></tr></thead><tbody>{filtered.map(customer => <tr key={customer.id} className={`border-b border-[var(--border)] text-[11px] transition hover:bg-[var(--card)] ${customer.amber ? 'bg-[var(--card)]' : ''}`}><td className="px-5 py-3"><input type="checkbox" checked={selected.includes(customer.id)} onChange={() => toggleSelection(customer.id)} aria-label={`Select ${customer.name}`} /></td><td className="px-2 py-3"><div className="flex items-center gap-2.5"><div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${customer.guest ? 'bg-secondary text-muted-foreground' : 'bg-[var(--secondary)] text-[var(--foreground)]'}`} aria-label={`${customer.name} avatar`}>{customer.guest ? <UserRound size={14} /> : customer.initials}</div><strong className="whitespace-nowrap text-[var(--muted-foreground)]">{customer.name}</strong></div></td><td className="px-2 py-3 text-[var(--muted-foreground)]">{customer.email}</td><td className="px-2 py-3"><div className="flex items-center gap-1">{customer.platforms.map(platform => <PlatformChip key={`${customer.id}-${platform}`} platform={platform} />)}</div></td><td className="px-2 py-3 font-semibold">{customer.orders}</td><td className="px-2 py-3 font-semibold">{customer.spend}</td><td className="px-2 py-3 text-[var(--muted-foreground)]">{customer.lastOrder}</td><td className="px-2 py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${customer.type === 'Returning' ? 'bg-[var(--secondary)] text-[var(--foreground)]' : customer.type === 'New' ? 'bg-[var(--secondary)] text-[var(--foreground)]' : 'bg-[var(--secondary)] text-[var(--muted-foreground)]'}`}>{customer.type}</span></td><td className="px-2 py-3"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${customer.status === 'Complete' ? 'bg-[var(--secondary)] text-[var(--chart-4)]' : customer.status === 'Incomplete' ? 'bg-[var(--secondary)] text-[var(--muted-foreground)]' : 'bg-[var(--secondary)] text-[var(--chart-1)]'}`}>{customer.status === 'Complete' && <Check size={11} />}{customer.status}</span></td><td className="px-2 py-3 whitespace-nowrap text-[var(--muted-foreground)]">{customer.updated}</td><td className="px-2 py-3"><button className="font-semibold text-[var(--foreground)] hover:underline">Open</button><button className="ml-3 text-[var(--muted-foreground)]" aria-label={`More actions for ${customer.name}`}><Ellipsis size={15} /></button></td></tr>)}</tbody></table></div> : <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">{filtered.map(customer => <article key={customer.id} className="rounded-lg border border-border p-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--secondary)] text-xs font-bold text-[var(--foreground)]">{customer.guest ? <UserRound size={15} /> : customer.initials}</div><div><h3 className="text-sm font-bold">{customer.name}</h3><p className="text-[11px] text-muted-foreground">{customer.email}</p></div></div><div className="mt-4 flex justify-between text-xs"><span>{customer.orders} orders</span><strong>{customer.spend}</strong></div><div className="mt-3 flex justify-between"><PlatformChip platform={customer.platforms[0]} /><span className="text-xs font-semibold text-[var(--foreground)]">Open</span></div></article>)}</div>}<div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-[11px] text-[var(--muted-foreground)]"><span>Showing {filtered.length} connected customers</span><div className="flex items-center gap-1"><button className="rounded-md border border-[var(--border)] p-1.5"><ArrowLeft size={13} /></button>{([] as string[]).map(page => <button key={page} className={`h-7 min-w-7 rounded-md px-2 ${page === '1' ? 'bg-[var(--primary)] font-bold text-primary-foreground' : 'hover:bg-secondary'}`}>{page}</button>)}<button className="rounded-md border border-[var(--border)] p-1.5"><ArrowRight size={13} /></button></div></div></section>
        <section className="rounded-xl border border-[var(--border)] border-l-[3px] border-l-[var(--border)] bg-card shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><div className="flex items-center justify-between px-5 py-4"><div className="flex items-center gap-2"><Copy size={16} className="text-[var(--foreground)]" /><h2 className="text-[14px] font-bold">Possible Duplicate Customers</h2><span className="rounded-full bg-[var(--secondary)] px-2 py-0.5 text-[10px] font-bold text-[var(--foreground)]">0</span></div><button className="text-[var(--muted-foreground)]" aria-label="Collapse duplicate customers"><ChevronDown size={16} /></button></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-[11px]"><thead className="border-y border-[var(--border)] bg-[var(--card)] text-[10px] font-bold uppercase text-[var(--muted-foreground)]"><tr><th scope="col" className="px-5 py-2.5">Customer A</th><th scope="col" className="px-2 py-2.5">Customer B</th><th scope="col" className="px-2 py-2.5">Matching Fields</th><th scope="col" className="px-2 py-2.5">Store</th><th scope="col" className="px-2 py-2.5">Actions</th></tr></thead><tbody>{([] as string[][]).map(row => <tr key={row[0]} className="border-b border-[var(--border)]"><td className="px-5 py-3 font-semibold">{row[0]}</td><td className="px-2 py-3 font-semibold">{row[1]}</td><td className="px-2 py-3 text-[var(--muted-foreground)]">{row[2]}</td><td className="px-2 py-3 text-[var(--muted-foreground)]">{row[3]}</td><td className="px-2 py-3"><button className="font-semibold text-[var(--foreground)]">Review</button><button className="ml-4 font-semibold text-[var(--muted-foreground)]">Open Both</button></td></tr>)}</tbody></table></div><p className="px-5 py-3 text-[11px] text-[var(--muted-foreground)]">Merging requires review and confirmation. Records are never merged automatically.</p></section>
        <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]"><section className="rounded-xl border border-[var(--border)] bg-card shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><div className="border-b border-[var(--border)] px-5 py-4"><h2 className="text-[14px] font-bold">Recent Customer Activity</h2></div><div className="divide-y divide-[var(--foreground)] px-5">{activities.map(activity => {
                const Icon = activity.icon;
                return <div key={`${activity.text}-${activity.time}`} className="flex items-center gap-3 py-3"><span className={`rounded-lg p-2 ${activity.color}`}><Icon size={14} /></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-[var(--muted-foreground)]">{activity.text} <span className="font-normal text-[var(--muted-foreground)]">— {activity.person}</span></p><p className="mt-0.5 text-[10px] text-[var(--muted-foreground)]">{activity.time} · <span className="font-medium text-[var(--muted-foreground)]">{activity.source}</span></p></div><span className="hidden rounded-md bg-[var(--secondary)] px-2 py-1 text-[10px] font-semibold text-[var(--muted-foreground)] sm:inline">{activity.store}</span></div>;
              })}</div></section><section className="rounded-xl border border-[var(--border)] bg-card shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><div className="border-b border-[var(--border)] px-5 py-4"><h2 className="text-[14px] font-bold">Customer Data Health</h2></div><div className="px-5">{healthRows.map(row => <div key={row[0]} className="flex items-center justify-between border-b border-[var(--border)] py-3"><div><p className="text-xs font-semibold text-[var(--muted-foreground)]">{row[0]}</p><p className={`mt-1 text-[10px] font-semibold ${row[3] ? 'text-[var(--foreground)]' : 'text-[var(--foreground)]'}`}><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />{row[1]}</p></div><span className="text-right text-[10px] text-[var(--muted-foreground)]">{row[2]}</span></div>)}</div><div className="px-5 py-3"><button className="text-xs font-bold text-[var(--foreground)]">View All Issues <ArrowRight size={13} className="ml-1 inline" /></button></div></section></div>
        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"><div className="flex items-center gap-2"><Sparkles size={17} className="text-[var(--muted-foreground)]" /><h2 className="text-[14px] font-bold">Ask Lulu AI</h2></div><div className="mt-4 flex gap-2 rounded-lg border border-[var(--border)] bg-card p-2"><input className="min-w-0 flex-1 px-2 text-xs outline-none placeholder:text-[var(--muted-foreground)]" placeholder="Ask Lulu AI about your customers..." aria-label="Ask Lulu AI" /><button className="rounded-md bg-[var(--primary)] px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-[var(--primary)]">Ask</button></div><div className="mt-3 flex flex-wrap gap-2">{([] as string[]).map(prompt => <button key={prompt} className="rounded-full border border-[var(--border)] bg-card px-3 py-1.5 text-[10px] font-semibold text-[var(--muted-foreground)] hover:border-[var(--border)] hover:text-[var(--foreground)]">{prompt}</button>)}</div><div className="mt-4 flex flex-col justify-between gap-3 rounded-lg border border-[var(--border)] bg-card px-4 py-3 sm:flex-row sm:items-center"><p className="text-xs text-[var(--muted-foreground)]"><Zap size={14} className="mr-2 inline text-[var(--foreground)]" /><strong>AI Insight:</strong> 7 customers appear across multiple stores with matching email addresses. Review recommended before any manual record merging.</p><button className="whitespace-nowrap rounded-md border border-[var(--border)] px-3 py-2 text-[11px] font-bold text-[var(--foreground)]">Review Duplicates</button></div></section>
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
