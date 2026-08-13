import * as React from 'react';
import { AlertTriangle, Archive, ArrowDownUp, ArrowRight, BarChart3, Bell, Bot, Boxes, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ClipboardList, Cloud, Download, Ellipsis, FileDown, Filter, LayoutDashboard, ListFilter, Menu, MoreHorizontal, Package, Plus, RefreshCw, Search, Settings, ShoppingBag, Sparkles, Store, Tags, Truck, Users, X, Zap } from 'lucide-react';
type InventoryItem = {
  product: string;
  variant: string;
  sku: string;
  store: string;
  location: string;
  available: number;
  reserved: number;
  incoming: number;
  total: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  sync: 'Synced' | 'Delayed' | 'Failed';
  updated: string;
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
  icon: BarChart3
}];
const ecommerceNav = ['Overview', 'Stores', 'Products', 'Categories', 'Orders', 'Customers', 'Carts', 'Inventory', 'Reviews', 'Merchandising', 'Automation'];
const rows: InventoryItem[] = [{
  product: 'Premium Hoodie',
  variant: 'Black / XL',
  sku: 'SKU-10082',
  store: 'Lulu Store',
  location: 'Main Warehouse',
  available: 42,
  reserved: 8,
  incoming: 20,
  total: 70,
  status: 'In Stock',
  sync: 'Synced',
  updated: '10 Aug'
}, {
  product: 'Classic Tee',
  variant: 'White / M',
  sku: 'SKU-10045',
  store: 'Lulu Store',
  location: 'Main Warehouse',
  available: 4,
  reserved: 2,
  incoming: 0,
  total: 6,
  status: 'Low Stock',
  sync: 'Synced',
  updated: '10 Aug'
}, {
  product: 'Yoga Pants',
  variant: 'Black / S',
  sku: 'SKU-20031',
  store: 'Webflow Store',
  location: '—',
  available: 0,
  reserved: 0,
  incoming: 10,
  total: 10,
  status: 'Out of Stock',
  sync: 'Delayed',
  updated: '9 Aug'
}, {
  product: 'Running Shoes',
  variant: 'Blue / 42',
  sku: 'SKU-30019',
  store: 'WooCommerce',
  location: 'Retail Store',
  available: 88,
  reserved: 12,
  incoming: 0,
  total: 100,
  status: 'In Stock',
  sync: 'Synced',
  updated: '10 Aug'
}, {
  product: 'Canvas Backpack',
  variant: '—',
  sku: 'SKU-40007',
  store: 'Lulu Store',
  location: 'Main Warehouse',
  available: 3,
  reserved: 1,
  incoming: 0,
  total: 4,
  status: 'Low Stock',
  sync: 'Synced',
  updated: '10 Aug'
}, {
  product: 'Denim Jacket',
  variant: 'Grey / L',
  sku: 'SKU-10091',
  store: 'Lulu Store',
  location: '—',
  available: 0,
  reserved: 0,
  incoming: 0,
  total: 0,
  status: 'Out of Stock',
  sync: 'Failed',
  updated: '8 Aug'
}];
const lowStock = [{
  product: 'Classic Tee',
  sku: 'SKU-10045',
  store: 'Lulu Store',
  available: '4',
  threshold: '8'
}, {
  product: 'Canvas Backpack',
  sku: 'SKU-40007',
  store: 'Lulu Store',
  available: '3',
  threshold: '6'
}, {
  product: 'Linen Shirt',
  sku: 'SKU-10221',
  store: 'Webflow Store',
  available: '5',
  threshold: '10'
}, {
  product: 'Wool Beanie',
  sku: 'SKU-10402',
  store: 'Lulu Store',
  available: '7',
  threshold: '12'
}, {
  product: 'Everyday Socks',
  sku: 'SKU-20311',
  store: 'WooCommerce',
  available: '8',
  threshold: '15'
}];
const outStock = [{
  product: 'Yoga Pants',
  sku: 'SKU-20031',
  store: 'Webflow Store',
  updated: '9 Aug'
}, {
  product: 'Denim Jacket',
  sku: 'SKU-10091',
  store: 'Lulu Store',
  updated: '8 Aug'
}, {
  product: 'Silk Scarf',
  sku: 'SKU-30112',
  store: 'WooCommerce',
  updated: '7 Aug'
}, {
  product: 'Travel Mug',
  sku: 'SKU-20403',
  store: 'Lulu Store',
  updated: '6 Aug'
}, {
  product: 'Merino Sweater',
  sku: 'SKU-10942',
  store: 'Webflow Store',
  updated: '5 Aug'
}];
const prompts = ['Which products are low in stock?', 'Find out of stock items', 'Detect inventory discrepancies', 'Show sync problems', 'Summarize today’s activity'];
const filters = ['Stock Status', 'Store', 'Category', 'Location', 'Sync Status', 'Quantity range'];
function StatusPill({
  children,
  tone
}: {
  children: React.ReactNode;
  tone: 'green' | 'amber' | 'red' | 'yellow' | 'purple' | 'slate';
}) {
  const tones = {
    green: 'border-border/25 bg-secondary/10 text-foreground',
    amber: 'border-border/25 bg-secondary/10 text-foreground',
    red: 'border-chart-5/25 bg-chart-5/10 text-chart-5',
    yellow: 'border-border/25 bg-secondary/10 text-foreground',
    purple: 'border-[var(--chart-3)]/30 bg-[var(--chart-3)]/10 text-[var(--chart-3)]',
    slate: 'border-border/40 bg-muted/10 text-foreground'
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-medium ${tones[tone]}`}><span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />{children}</span>;
}
export function LuluInventory() {
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [modal, setModal] = React.useState(false);
  const [cards, setCards] = React.useState(false);
  const [activeNav, setActiveNav] = React.useState('Inventory');
  const visibleRows = rows.filter(r => `${r.product} ${r.variant} ${r.sku} ${r.store}`.toLowerCase().includes(search.toLowerCase()));
  const toggle = (sku: string) => setSelected(s => s.includes(sku) ? s.filter(x => x !== sku) : [...s, sku]);
  return <main className="min-h-screen bg-[var(--background)] text-foreground selection:bg-[var(--primary)]/30">
  <aside className="fixed inset-y-0 left-0 z-20 hidden w-[232px] border-r border-[var(--muted-foreground)] bg-[var(--sidebar)] px-4 py-5 lg:block">
   <div className="mb-8 flex items-center gap-3 px-2"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary)] text-lg font-black text-primary-foreground shadow-[0_0_22px_rgba(0,0,0,.45)]">L</div><div><strong className="block text-[15px] text-foreground">Lulu AI</strong><span className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">Intelligence suite</span></div></div>
   <LuluSectionNavigation activeId="smart-village-1099" />
   <div className="mt-8"><p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Ecommerce</p>{ecommerceNav.map(label => <button key={label} onClick={() => setActiveNav(label)} className={`flex w-full items-center rounded-lg border-l-2 px-3 py-2 text-left text-[13px] transition ${activeNav === label ? 'border-[var(--border)] bg-[var(--primary)]/10 font-medium text-foreground shadow-[inset_12px_0_24px_rgba(0,0,0,.04)]' : 'border-transparent text-foreground hover:bg-secondary hover:text-foreground'}`}><span>{label}</span>{label === 'Inventory' && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)] text-primary-foreground" />}</button>)}</div>
   <div className="absolute bottom-5 left-4 right-4 border-t border-[var(--muted-foreground)] pt-4"><button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-foreground hover:text-foreground"><Settings size={16} /><span>Settings</span></button><button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-foreground hover:text-foreground"><CircleHelp size={16} /><span>Help center</span></button></div>
  </aside>
  <section className="ml-0 min-w-0 lg:ml-[232px]">
   <header className="border-b border-[var(--muted-foreground)] bg-[var(--sidebar)]/90 px-5 py-4 backdrop-blur-xl lg:px-8"><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><button className="lg:hidden text-foreground"><Menu size={20} /></button><div><div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground"><span>Ecommerce</span><ChevronRight size={13} /><span className="text-foreground">Inventory</span></div><h1 className="text-3xl font-extrabold tracking-[-.04em] text-foreground">Inventory</h1><p className="mt-1 text-sm text-muted-foreground">Monitor stock levels, availability and inventory issues across your ecommerce stores.</p></div></div><div className="flex flex-wrap items-center gap-2"><button onClick={() => setModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-3.5 py-2.5 text-xs font-semibold text-primary-foreground shadow-[0_0_22px_rgba(0,0,0,.32)] hover:bg-[var(--primary)]"><Plus size={15} />Adjust Inventory</button><button className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)]/40 bg-[var(--primary)]/10 px-3 py-2.5 text-xs font-medium text-[var(--foreground)]"><Bot size={15} />Ask Lulu AI</button><button className="rounded-lg border border-[var(--muted-foreground)] p-2.5 text-foreground hover:text-foreground" aria-label="Refresh"><RefreshCw size={15} /></button><button className="rounded-lg border border-[var(--muted-foreground)] p-2.5 text-foreground hover:text-foreground" aria-label="Export"><Download size={15} /></button><button className="rounded-lg border border-[var(--muted-foreground)] p-2.5 text-foreground hover:text-foreground" aria-label="More"><MoreHorizontal size={15} /></button></div></div></header>
   <div className="space-y-5 p-5 lg:p-8">
    <div className="flex flex-wrap items-center gap-3"><button className="flex h-10 items-center gap-2 rounded-lg border border-[var(--muted-foreground)] bg-[var(--primary)] px-3 text-sm text-primary-foreground"><Store size={16} className="text-[var(--foreground)]" /><span>All Stores</span><span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_7px_var(--primary)] text-primary-foreground" /><ChevronDown size={14} className="ml-2 text-muted-foreground" /></button><div className="relative min-w-[260px] flex-1"><Search size={16} className="absolute left-3 top-3 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} className="h-10 w-full rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[var(--border)]/60" placeholder="Search by product, SKU, variant, store..." /></div>{filters.map(f => <button key={f} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--muted-foreground)] bg-[var(--primary)] px-3 text-xs text-primary-foreground hover:border-[var(--border)]/50 hover:text-primary-foreground"><Filter size={13} />{f}<ChevronDown size={12} /></button>)}<div className="ml-auto flex items-center gap-1 rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] p-1"><button onClick={() => setCards(false)} className={`rounded px-2 py-1.5 text-xs ${!cards ? 'bg-[var(--primary)]/15 text-foreground' : 'text-foreground'}`}><ListFilter size={14} /></button><button onClick={() => setCards(true)} className={`rounded px-2 py-1.5 text-xs ${cards ? 'bg-[var(--primary)]/15 text-foreground' : 'text-foreground'}`}><Boxes size={14} /></button></div><button className="text-xs text-[var(--foreground)]">Saved Filters</button><button className="text-xs text-foreground hover:text-foreground">Clear Filters</button></div>
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-6">{[{
            label: 'Total SKUs',
            value: '1,284',
            hint: '↑ 4.8% vs last week',
            tone: 'slate'
          }, {
            label: 'In Stock',
            value: '1,098',
            hint: '85.5% of catalog',
            tone: 'green'
          }, {
            label: 'Low Stock',
            value: '47',
            hint: '↑ 8 items this week',
            tone: 'amber'
          }, {
            label: 'Out of Stock',
            value: '23',
            hint: '↓ 3 since yesterday',
            tone: 'red'
          }, {
            label: 'Attention Required',
            value: '31',
            hint: '12 new issues',
            tone: 'amber'
          }, {
            label: 'Sync Issues',
            value: '8',
            hint: '2 stores affected',
            tone: 'yellow'
          }].map(card => <article key={card.label} className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)]/90 p-4 shadow-[inset_0_1px_rgba(0,0,0,.025)]"><div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground"><span className={`h-2 w-2 rounded-full ${card.tone === 'green' ? 'bg-chart-4 shadow-[0_0_9px_var(--chart-4)]' : card.tone === 'red' ? 'bg-destructive shadow-[0_0_9px_var(--chart-5)]' : card.tone === 'amber' ? 'bg-chart-1 shadow-[0_0_9px_var(--chart-1)]' : card.tone === 'yellow' ? 'bg-chart-1/20 shadow-[0_0_9px_var(--chart-1)]' : 'bg-muted'}`} /><span>{card.label}</span></div><strong className="block text-2xl font-bold tracking-tight text-foreground">{card.value}</strong><span className="mt-1 block text-[11px] text-muted-foreground">{card.hint}</span></article>)}</div>
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/25 border-l-4 border-l-border bg-[var(--secondary)] px-4 py-3 shadow-[0_0_25px_rgba(0,0,0,.06)]"><AlertTriangle size={18} className="text-foreground" /><div className="flex flex-1 flex-wrap gap-2">{['Premium Hoodie — Black/XL — Out of Stock — Lulu Store', 'Sync Failure — WooCommerce — 3 records', 'Low Stock Alert — 12 SKUs below threshold'].map(alert => <span key={alert} className="rounded-md border border-border/15 bg-secondary/[.06] px-2.5 py-1.5 text-xs text-foreground">{alert}<button className="ml-2 text-foreground/70 hover:text-foreground"><X size={12} /></button></span>)}</div><button className="flex items-center gap-1 text-xs font-medium text-[var(--foreground)]">Ask Lulu AI <ArrowRight size={13} /></button></div>
    <section className="overflow-hidden rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)]/90"><div className="flex items-center justify-between border-b border-[var(--muted-foreground)] bg-[var(--background)] px-4 py-3"><div><h2 className="text-sm font-semibold text-foreground">Inventory records</h2><p className="mt-0.5 text-xs text-muted-foreground">Showing {visibleRows.length} of 1,284 SKUs</p></div><div className="flex items-center gap-2 text-xs text-muted-foreground"><ArrowDownUp size={14} /> Last updated <span className="text-foreground">just now</span></div></div>{cards ? <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">{visibleRows.map(row => <article key={row.sku} className="rounded-lg border border-[var(--muted-foreground)] bg-[var(--card)] p-4"><div className="flex justify-between"><div><h3 className="font-semibold text-foreground">{row.product}</h3><p className="text-xs text-muted-foreground">{row.variant} · {row.sku}</p></div><StatusPill tone={row.status === 'In Stock' ? 'green' : row.status === 'Low Stock' ? 'amber' : 'red'}>{row.status}</StatusPill></div><div className="mt-5 grid grid-cols-3 gap-2 text-center"><div><strong className="block text-lg text-foreground">{row.available}</strong><span className="text-[10px] text-muted-foreground">Available</span></div><div><strong className="block text-lg text-foreground">{row.reserved}</strong><span className="text-[10px] text-muted-foreground">Reserved</span></div><div><strong className="block text-lg text-foreground">{row.incoming}</strong><span className="text-[10px] text-muted-foreground">Incoming</span></div></div></article>)}</div> : <div className="overflow-x-auto"><table className="w-full min-w-[1160px] border-collapse text-left text-xs"><thead><tr className="border-b border-[var(--muted-foreground)] text-[10px] uppercase tracking-[.1em] text-muted-foreground"><th className="w-10 px-4 py-3"><input type="checkbox" aria-label="Select all" checked={selected.length === visibleRows.length} onChange={() => setSelected(selected.length === visibleRows.length ? [] : visibleRows.map(r => r.sku))} /></th>{['Product', 'Variant', 'SKU', 'Store', 'Location', 'Available', 'Reserved', 'Incoming', 'Total', 'Status', 'Sync', 'Last Updated', 'Actions'].map(head => <th key={head} className="whitespace-nowrap px-3 py-3 font-medium">{head}</th>)}</tr></thead><tbody>{visibleRows.map(row => <tr key={row.sku} className="border-b border-[var(--muted-foreground)]/70 transition hover:bg-[var(--primary)]/[.045]"><td className="px-4 py-3"><input type="checkbox" aria-label={`Select ${row.product}`} checked={selected.includes(row.sku)} onChange={() => toggle(row.sku)} /></td><td className="px-3 py-3"><strong className="block whitespace-nowrap text-sm font-medium text-foreground">{row.product}</strong><span className="text-[11px] text-muted-foreground">{row.variant}</span></td><td className="whitespace-nowrap px-3 py-3 text-foreground">{row.variant}</td><td className="whitespace-nowrap px-3 py-3 font-mono text-[11px] text-muted-foreground">{row.sku}</td><td className="whitespace-nowrap px-3 py-3 text-foreground">{row.store}</td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{row.location}</td><td className="px-3 py-3 font-semibold text-foreground">{row.available}</td><td className="px-3 py-3 text-muted-foreground">{row.reserved}</td><td className="px-3 py-3 text-muted-foreground">{row.incoming}</td><td className="px-3 py-3 font-semibold text-foreground">{row.total}</td><td className="px-3 py-3"><StatusPill tone={row.status === 'In Stock' ? 'green' : row.status === 'Low Stock' ? 'amber' : 'red'}>{row.status}</StatusPill></td><td className="px-3 py-3"><StatusPill tone={row.sync === 'Synced' ? 'green' : row.sync === 'Delayed' ? 'yellow' : 'red'}>{row.sync}</StatusPill></td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{row.updated}</td><td className="px-3 py-3"><div className="flex items-center gap-1"><button className="rounded border border-[var(--muted-foreground)] px-2 py-1 text-[11px] text-foreground hover:border-[var(--border)]">Open</button><button onClick={() => setModal(true)} className="rounded border border-[var(--muted-foreground)] px-2 py-1 text-[11px] text-foreground hover:border-[var(--border)]">Adjust</button><button className="p-1 text-foreground hover:text-foreground"><Ellipsis size={15} /></button></div></td></tr>)}</tbody></table></div>}<div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--muted-foreground)] px-4 py-3 text-xs text-muted-foreground"><span>Rows per page <strong className="ml-1 text-foreground">25</strong> <ChevronDown className="inline" size={12} /></span><div className="flex items-center gap-2"><span>1–6 of 1,284</span><button className="rounded border border-[var(--muted-foreground)] p-1 hover:text-foreground"><ChevronLeft size={14} /></button><button className="rounded border border-[var(--border)]/50 bg-[var(--primary)]/10 p-1 text-foreground">1</button><button className="rounded border border-[var(--muted-foreground)] p-1 hover:text-foreground">2</button><button className="rounded border border-[var(--muted-foreground)] p-1 hover:text-foreground"><ChevronRight size={14} /></button></div></div>{selected.length > 0 && <div className="flex items-center gap-3 border-t border-[var(--border)]/25 bg-[var(--primary)]/10 px-4 py-2 text-xs text-[var(--foreground)]"><CheckCircle2 size={15} />{selected.length} selected <button className="ml-3 rounded bg-[var(--primary)] px-2 py-1 text-primary-foreground" onClick={() => setModal(true)}>Adjust selected</button><button className="ml-auto" onClick={() => setSelected([])}>Clear</button></div>}</section>
    <div className="grid gap-5 xl:grid-cols-3"><section className="rounded-xl border border-border/25 border-l-4 border-l-border bg-[var(--card)] p-4"><h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground"><AlertTriangle size={16} className="text-foreground" />Low Stock <span className="ml-auto text-xs font-normal text-muted-foreground">Top 5</span></h2>{lowStock.map(item => <div key={item.sku} className="flex items-center gap-3 border-b border-[var(--muted-foreground)] py-2.5 last:border-0"><div className="min-w-0 flex-1"><strong className="block truncate text-xs text-foreground">{item.product}</strong><span className="text-[10px] text-muted-foreground">{item.sku} · {item.store}</span></div><span className="text-xs font-semibold text-foreground">{item.available}<small className="font-normal text-muted-foreground"> / {item.threshold}</small></span><button className="text-[11px] text-[var(--foreground)]">Adjust</button></div>)}</section><section className="rounded-xl border border-chart-5/25 border-l-4 border-l-chart-5 bg-[var(--card)] p-4"><h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground"><Archive size={16} className="text-chart-5" />Out of Stock <span className="ml-auto text-xs font-normal text-muted-foreground">Top 5</span></h2>{outStock.map(item => <div key={item.sku} className="flex items-center gap-3 border-b border-[var(--muted-foreground)] py-2.5 last:border-0"><div className="min-w-0 flex-1"><strong className="block truncate text-xs text-foreground">{item.product}</strong><span className="text-[10px] text-muted-foreground">{item.sku} · {item.store}</span></div><span className="text-[11px] text-muted-foreground">{item.updated}</span><button className="text-[11px] text-[var(--foreground)]">View</button></div>)}</section><section className="rounded-xl border border-[var(--border)]/25 border-l-4 border-l-[var(--border)] bg-[var(--card)] p-4"><h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground"><ArrowDownUp size={16} className="text-[var(--foreground)]" />Inventory Discrepancies</h2>{[['Premium Hoodie', 'SKU-10082', 'Lulu Store', '70', '68', '-2', 'Medium'], ['Classic Tee', 'SKU-10045', 'Lulu Store', '8', '6', '-2', 'High'], ['Yoga Pants', 'SKU-20031', 'Webflow Store', '10', '12', '+2', 'Low']].map(item => <div key={item[1]} className="flex items-center gap-2 border-b border-[var(--muted-foreground)] py-2.5 last:border-0"><div className="min-w-0 flex-1"><strong className="block truncate text-xs text-foreground">{item[0]}</strong><span className="text-[10px] text-muted-foreground">{item[1]} · {item[2]}</span></div><span className="text-[11px] text-muted-foreground">{item[3]} → {item[4]}</span><StatusPill tone={item[6] === 'High' ? 'red' : item[6] === 'Medium' ? 'amber' : 'purple'}>{item[6]}</StatusPill><button className="text-[11px] text-[var(--foreground)]">Review</button></div>)}</section></div>
    <div className="grid gap-5 xl:grid-cols-3"><section className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold text-foreground">Inventory Operations Health</h2><GaugeIcon /></div><div className="flex items-center gap-5 border-b border-[var(--muted-foreground)] pb-5"><div className="grid h-24 w-24 place-items-center rounded-full border-[7px] border-[var(--border)] text-2xl font-bold text-foreground shadow-[0_0_25px_rgba(0,0,0,.18)]">87%</div><p className="text-xs leading-5 text-muted-foreground">Your inventory is in good shape.<br /><span className="text-chart-4">↑ 3.2%</span> from last week</p></div>{[['Stock Availability', 'Healthy', '92%', 'bg-chart-4'], ['Data Completeness', 'Healthy', '98%', 'bg-chart-4'], ['Synchronization Health', 'Attention', '81%', 'bg-chart-1'], ['SKU Consistency', 'Healthy', '96%', 'bg-[var(--chart-3)]']].map(x => <div key={x[0]} className="mt-3 flex items-center gap-3 text-xs"><span className="w-36 text-muted-foreground">{x[0]}</span><div className="h-1.5 flex-1 rounded-full bg-muted"><div className={`h-full rounded-full ${x[3]}`} style={{
                  width: x[2]
                }} /></div><span className="w-8 text-right text-foreground">{x[2]}</span><span className={x[1] === 'Attention' ? 'text-chart-1' : 'text-foreground'}>{x[1]}</span></div>)}</section><section className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold text-foreground">Inventory Synchronization</h2><RefreshCw size={15} className="text-muted-foreground" /></div>{[['Lulu Store', 'Shopify', 'Just now', '1,284', '0', 'Synced', 'green'], ['Webflow Store', 'Webflow', '2 min ago', '482', '0', 'Syncing', 'blue'], ['WooCommerce', 'WooCommerce', '18 min ago', '726', '3', 'Delayed', 'amber'], ['Main Shop', 'Shopify', 'Yesterday', '310', '8', 'Failed', 'red']].map(x => <div key={x[0]} className="flex items-center gap-2 border-b border-[var(--muted-foreground)] py-3 text-xs last:border-0"><span className={`h-2 w-2 rounded-full bg-${x[6]}-400 shadow-[0_0_8px_currentColor]`} /><span className="w-24 font-medium text-foreground">{x[0]}</span><span className="w-20 text-muted-foreground">{x[1]}</span><span className="w-16 text-muted-foreground">{x[2]}</span><span className="text-muted-foreground">{x[3]} <span className="text-chart-5">({x[4]})</span></span><span className="ml-auto text-muted-foreground">{x[5]}</span></div>)}<button className="mt-3 text-xs text-[var(--foreground)]">View synchronization log <ArrowRight className="inline" size={13} /></button></section><section className="rounded-xl border border-[var(--border)]/30 bg-[var(--card)] p-5 shadow-[0_-3px_30px_rgba(0,0,0,.08)]"><div className="mb-3 flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--primary)]/15 text-[var(--foreground)]"><Bot size={17} /></div><div><h2 className="text-sm font-semibold text-foreground">Ask Lulu AI</h2><p className="text-[11px] text-muted-foreground">Inventory intelligence, on demand</p></div></div><div className="flex items-center rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] px-3 py-2"><input className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground" placeholder="Ask Lulu AI about your inventory..." /><button className="text-[var(--foreground)]"><ArrowRight size={16} /></button></div><div className="mt-3 flex flex-wrap gap-1.5">{prompts.map(p => <button key={p} className="rounded-md border border-[var(--muted-foreground)] px-2 py-1 text-[10px] text-foreground hover:border-[var(--border)]/60 hover:text-[var(--foreground)]">{p}</button>)}</div><div className="mt-4 rounded-lg border border-[var(--border)]/20 bg-[var(--primary)]/[.06] p-3"><p className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-[var(--foreground)]"><Sparkles size={12} />AI Insight</p><p className="text-xs leading-5 text-foreground">12 products are below their configured low-stock threshold across 2 stores.</p><button className="mt-2 text-xs text-[var(--foreground)]">View Low Stock <ArrowRight className="inline" size={12} /></button></div></section></div>
   </div>
  </section>
  {modal && <div role="dialog" aria-modal="true" aria-labelledby="adjust-title" className="fixed inset-0 z-50 grid place-items-center bg-primary/70 p-4 backdrop-blur-sm"><form onSubmit={e => {
        e.preventDefault();
        setModal(false);
      }} className="w-full max-w-xl rounded-2xl border border-[var(--muted-foreground)] bg-[var(--background)] p-6 shadow-[0_0_60px_rgba(0,0,0,.55)]"><div className="mb-5 flex items-start justify-between"><div><h2 id="adjust-title" className="text-xl font-bold text-foreground">Adjust inventory</h2><p className="mt-1 text-xs text-muted-foreground">Record a manual stock adjustment for a product.</p></div><button type="button" onClick={() => setModal(false)} className="text-foreground hover:text-foreground"><X size={18} /></button></div><div className="grid gap-4 sm:grid-cols-2">{[['Product', 'Premium Hoodie'], ['Variant', 'Black / XL'], ['SKU', 'SKU-10082'], ['Store', 'Lulu Store'], ['Location', 'Main Warehouse']].map(field => <label key={field[0]} className="text-xs text-muted-foreground">{field[0]}<input defaultValue={field[1]} readOnly={field[0] === 'SKU'} className="mt-1.5 w-full rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] px-3 py-2.5 text-sm text-foreground outline-none focus:border-[var(--border)]" /></label>)}<label className="text-xs text-muted-foreground">Current Qty<input value="42" readOnly className="mt-1.5 w-full rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] px-3 py-2.5 text-sm text-muted-foreground" /></label><label className="text-xs text-muted-foreground">Adjustment (±)<input defaultValue="0" type="number" className="mt-1.5 w-full rounded-lg border border-[var(--border)]/60 bg-[var(--secondary)] px-3 py-2.5 text-sm text-foreground outline-none" /></label><label className="text-xs text-muted-foreground">New Qty<input value="42" readOnly className="mt-1.5 w-full rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] px-3 py-2.5 text-sm font-semibold text-foreground" /></label><label className="text-xs text-muted-foreground">Reason<select className="mt-1.5 w-full rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] px-3 py-2.5 text-sm text-foreground"><option>Stock Count</option><option>Damage</option><option>Loss</option><option>Correction</option><option>Return</option><option>Manual</option></select></label><label className="text-xs text-muted-foreground sm:col-span-2">Notes<textarea rows={3} placeholder="Add context for this adjustment..." className="mt-1.5 w-full resize-none rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground" /></label></div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setModal(false)} className="rounded-lg border border-[var(--muted-foreground)] px-4 py-2.5 text-xs text-muted-foreground">Cancel</button><button type="submit" className="rounded-lg bg-[var(--primary)] px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-[0_0_18px_rgba(0,0,0,.3)]">Confirm Adjustment</button></div></form></div>}
 </main>;
}
function GaugeIcon() {
  return <Zap size={16} className="text-[var(--foreground)]" />;
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
            return <a key={page.id} {...pageLinkProps(page.id)} aria-current={isActivePage ? 'page' : undefined} className={`block rounded-md px-3 py-2 text-xs transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {page.label}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}
import { pageLinkProps } from '../../../../routing';
