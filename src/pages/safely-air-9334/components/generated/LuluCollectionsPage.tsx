import { useMemo, useState } from 'react';
import { Activity, AlertCircle, ArrowDownAZ, ArrowLeft, ArrowRight, Bot, ChevronDown, ChevronRight, CircleCheck, CircleX, Clock3, Download, Edit3, FileImage, Filter, Hand, Inbox, Layers3, MoreHorizontal, Package, Plus, RefreshCw, Search, Settings2, Sparkles, Store, X, Zap, Users2 } from 'lucide-react';
type Collection = {
  id: string;
  name: string;
  type: string;
  store: string;
  products: number;
  visibility: string;
  status: string;
  updated: string;
  sync: string;
  handle: string;
};
type Attention = {
  name: string;
  issue: string;
  severity: string;
  store: string;
  action: string;
};
const navItems = ['Overview', 'Stores', 'Products', 'Collections', 'Categories', 'Orders', 'Customers', 'Carts', 'Abandoned Carts', 'Returns', 'Shipping', 'Inventory', 'Reviews', 'Discounts & Promotions', 'Analytics', 'Settings'];
const stores = ['Lulu Store', 'Brand Store', 'International Store'];
const tabs = ['Basic Info', 'Products', 'Rules', 'Media', 'SEO', 'Visibility'];
const collections: Collection[] = [{
  id: 'c1',
  name: 'Summer Collection',
  type: 'Manual',
  store: 'Lulu Store',
  products: 24,
  visibility: 'Online Store',
  status: 'Published',
  updated: '10 Aug',
  sync: 'Synced',
  handle: '#summer-collection'
}, {
  id: 'c2',
  name: 'New Arrivals',
  type: 'Automated',
  store: 'Brand Store',
  products: 67,
  visibility: 'Online Store',
  status: 'Published',
  updated: '9 Aug',
  sync: 'Synced',
  handle: '#new-arrivals'
}, {
  id: 'c3',
  name: 'Flash Sale',
  type: 'Manual',
  store: 'All Stores',
  products: 0,
  visibility: 'Hidden',
  status: 'Draft',
  updated: '8 Aug',
  sync: 'Syncing',
  handle: '#flash-sale'
}, {
  id: 'c4',
  name: 'Best Sellers',
  type: 'Automated',
  store: 'Lulu Store',
  products: 142,
  visibility: 'Online Store',
  status: 'Published',
  updated: '7 Aug',
  sync: 'Synced',
  handle: '#best-sellers'
}, {
  id: 'c5',
  name: 'Clearance Items',
  type: 'Manual',
  store: 'International Store',
  products: 18,
  visibility: 'Online Store',
  status: 'Published',
  updated: '6 Aug',
  sync: 'Failed',
  handle: '#clearance-items'
}, {
  id: 'c6',
  name: 'Spring Collection',
  type: 'Manual',
  store: 'Brand Store',
  products: 31,
  visibility: 'Online Store',
  status: 'Published',
  updated: '5 Aug',
  sync: 'Synced',
  handle: '#spring-collection'
}, {
  id: 'c7',
  name: 'Winter Essentials',
  type: 'Automated',
  store: 'Lulu Store',
  products: 89,
  visibility: 'Hidden',
  status: 'Draft',
  updated: '4 Aug',
  sync: 'Delayed',
  handle: '#winter-essentials'
}, {
  id: 'c8',
  name: 'VIP Members Only',
  type: 'Platform',
  store: 'Brand Store',
  products: 12,
  visibility: 'Hidden',
  status: 'Published',
  updated: '3 Aug',
  sync: 'Synced',
  handle: '#vip-members-only'
}, {
  id: 'c9',
  name: 'Accessories Bundle',
  type: 'Manual',
  store: 'All Stores',
  products: 5,
  visibility: 'Online Store',
  status: 'Draft',
  updated: '2 Aug',
  sync: 'Synced',
  handle: 'var(--muted-foreground)ssories-bundle'
}, {
  id: 'c10',
  name: 'Limited Edition',
  type: 'Unknown',
  store: 'International Store',
  products: 0,
  visibility: 'Unknown',
  status: 'Unknown',
  updated: '1 Aug',
  sync: 'Failed',
  handle: '#limited-edition'
}];
const attention: Attention[] = [{
  name: 'Summer Essentials',
  issue: 'Missing SEO metadata',
  severity: 'Medium',
  store: 'Lulu Store',
  action: 'Edit'
}, {
  name: 'Flash Sale',
  issue: 'Empty collection — no products',
  severity: 'High',
  store: 'Brand Store',
  action: 'Add Products'
}, {
  name: 'Winter Clearance',
  issue: 'Sync failed — rule mismatch',
  severity: 'High',
  store: 'International Store',
  action: 'View Details'
}, {
  name: 'Spring Collection',
  issue: 'Duplicate name across stores',
  severity: 'Medium',
  store: 'All Stores',
  action: 'Review'
}];
const activities = [['📝', 'Collection updated', 'Summer Collection description edited', 'Admin · 1h ago', 'Lulu Store'], ['➕', 'Collection created', 'Holiday Gift Guide', 'Admin · 3h ago', 'Brand Store'], ['✅', 'Collection published', 'Spring Collection — Draft → Published', 'Admin · 5h ago', 'Brand Store'], ['🚫', 'Collection unpublished', 'Flash Sale', 'Admin · 8h ago', 'All Stores'], ['🔄', 'Sync completed', '1,284 collections synchronized', 'System · 1d ago', 'All Stores'], ['⚠️', 'Sync failed', 'Winter Clearance — rule mismatch', 'System · 1d ago', 'International Store'], ['📦', 'Product added', '12 products added to Best Sellers', 'Admin · 2d ago', 'Lulu Store'], ['🗑️', 'Product removed', '3 products removed from Clearance Items', 'Admin · 2d ago', 'International Store']];
const health = [['Collection Synchronization', 'Attention Required', '2 stores with sync issues', 'amber'], ['Product Membership Sync', 'Healthy', 'All product assignments synchronized', 'teal'], ['Collection Rules', 'Critical', '4 automated collection rules require review', 'red'], ['Media Synchronization', 'Healthy', 'Collection images synchronized', 'teal'], ['Visibility Synchronization', 'Healthy', 'Visibility consistent across stores', 'teal'], ['SEO Metadata', 'Attention Required', '203 collections missing SEO metadata', 'amber'], ['Platform Connectivity', 'Healthy', 'All 3 platforms connected', 'teal']];
const summary = [['Total Collections', '1,284', 'neutral'], ['Active', '1,041', 'green'], ['Draft', '143', 'blue'], ['Automated', '387', 'purple'], ['Manual', '754', 'blue'], ['Empty', '67', 'amber'], ['Attention Required', '38', 'red']];
export function LuluCollectionsPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [activeSummary, setActiveSummary] = useState('Total Collections');
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [tab, setTab] = useState('Basic Info');
  const [showFilters, setShowFilters] = useState(false);
  const filtered = useMemo(() => collections.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) && (activeSummary === 'Total Collections' || activeSummary === 'Active' ? activeSummary === 'Total Collections' || c.status === 'Published' : activeSummary === 'Draft' ? c.status === 'Draft' : activeSummary === 'Empty' ? c.products === 0 : activeSummary === 'Automated' ? c.type === 'Automated' : activeSummary === 'Manual' ? c.type === 'Manual' : c.sync !== 'Synced')), [query, activeSummary]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(c => c.id));
  return <main className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col bg-[var(--sidebar)] text-foreground lg:flex"><header className="flex h-20 items-center gap-3 border-b border-border px-6"><span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">L</span><div><p className="font-semibold tracking-tight text-foreground">LULU AI</p><p className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">Core platform</p></div></header><nav className="flex-1 overflow-y-auto px-3 py-6" aria-label="Primary navigation"><p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Ecommerce</p>{navItems.map(item => <button key={item} className={`nav-item ${item === 'Collections' ? 'active' : ''}`}><span>{item}</span>{item === 'Collections' ? <span className="h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /> : null}</button>)}</nav><footer className="border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-secondary"><span className="grid h-8 w-8 place-items-center rounded-full bg-secondary/30 text-sm font-semibold text-foreground">AM</span><span className="flex-1 text-sm text-foreground">Alex Morgan<small className="block text-xs text-muted-foreground">Administrator</small></span><Settings2 className="h-4 w-4" /></button></footer></aside>
    <div className="lg:pl-[248px]"><div className="mx-auto max-w-[1540px] px-5 py-5 sm:px-8 lg:px-10">
      <header className="mb-6 flex flex-col gap-5 border-b border-border pb-6 xl:flex-row xl:items-end xl:justify-between"><div><p className="mb-2 text-sm font-medium text-muted-foreground">Ecommerce <ChevronRight className="mx-1 inline h-3.5 w-3.5" /> Collections</p><h1 className="text-3xl font-bold tracking-[-.035em] text-foreground sm:text-4xl">Collections</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Organize and manage product collections across your connected ecommerce stores.</p></div><div className="flex flex-wrap gap-2"><button className="primary-btn"><Plus className="h-4 w-4" />Create Collection</button><button className="secondary-btn"><Bot className="h-4 w-4 text-foreground" />Ask Lulu AI</button><button aria-label="Refresh collections" className="icon-btn"><RefreshCw className="h-4 w-4" /></button><button className="secondary-btn"><Download className="h-4 w-4" />Export</button><button aria-label="More actions" className="icon-btn"><MoreHorizontal className="h-4 w-4" /></button></div></header>
      <section className="mb-6 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-sm xl:flex-row"><button className="field flex w-full items-center gap-2 xl:w-56"><Store className="h-4 w-4 text-foreground" /><span className="flex-1 text-left text-sm">All Stores</span><ChevronDown className="h-4 w-4 text-muted-foreground" /></button><label className="field flex min-w-0 flex-1 items-center gap-2"><Search className="h-4 w-4 shrink-0 text-muted-foreground" /><input aria-label="Search collections" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by collection name, handle, ID, product, tag..." /></label><button className={`secondary-btn ${showFilters ? 'border-border bg-secondary text-foreground' : ''}`} onClick={() => setShowFilters(!showFilters)}><Filter className="h-4 w-4" />Filters<ChevronDown className="h-3.5 w-3.5" /></button><button className="field flex w-full items-center gap-2 xl:w-32"><ArrowDownAZ className="h-4 w-4" /><span className="flex-1 text-left text-sm">Updated</span></button>{selected.length > 0 ? <button className="secondary-btn whitespace-nowrap">Bulk Actions ({selected.length})</button> : null}<button className="secondary-btn"><Download className="h-4 w-4" />Export</button></section>
      {showFilters ? <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-secondary/60 p-4 text-sm"><strong className="text-foreground">Filter collections</strong><span className="filter-pill">Store: All Stores <X className="h-3 w-3" /></span><button className="text-foreground underline underline-offset-4">Clear all</button></div> : null}
      <section className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">{summary.map(item => <button key={item[0]} onClick={() => setActiveSummary(item[0])} className={`summary-card ${activeSummary === item[0] ? 'summary-active' : ''}`}><span className={`summary-icon ${item[2]}`}>{item[0] === 'Total Collections' ? <Layers3 className="h-4 w-4" /> : item[0] === 'Active' ? <CircleCheck className="h-4 w-4" /> : item[0] === 'Draft' ? <FileImage className="h-4 w-4" /> : item[0] === 'Automated' ? <Zap className="h-4 w-4" /> : item[0] === 'Manual' ? <Hand className="h-4 w-4" /> : item[0] === 'Empty' ? <Inbox className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}</span><span className="text-left"><span className="block text-xs font-medium text-muted-foreground">{item[0]}</span><strong className="mt-1 block text-xl tracking-tight text-foreground">{item[1]}</strong></span></button>)}</section>
      <section className="panel mb-7"><header className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="section-title">Collection Data Quality <span className="ai-badge">AI Generated</span></h2><p className="mt-1 text-sm text-muted-foreground">A quick view of the information quality across your collection catalog.</p></div><span className="severity medium">Attention Required</span></header><div className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-3">{[['Collections with descriptions', '1,147 (92%)', 'Healthy', 'teal'], ['Collections missing descriptions', '94 (8%)', 'Attention', 'amber'], ['Collections missing images', '61', 'Attention', 'amber'], ['Collections missing SEO metadata', '203 (16%)', 'Attention', 'amber'], ['Empty collections', '67', 'Attention', 'amber'], ['Invalid collection rules', '4', 'Critical', 'red'], ['Synchronization issues', '6', 'Critical', 'red'], ['Duplicate names', '11', 'Attention', 'amber']].map(item => <div key={item[0]} className="flex items-start gap-2"><span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-${item[3]}-500`} /><div><p className="text-sm font-semibold text-foreground">{item[0]}</p><p className="mt-1 text-sm text-muted-foreground">{item[1]} · <span className={item[3] === 'teal' ? 'text-foreground' : item[3] === 'red' ? 'text-chart-5' : 'text-foreground'}>{item[2]}</span></p></div></div>)}</div></section>
      <section className="panel mb-7 border-l-4 border-l-border"><header><h2 className="section-title">AI Insight <span className="ai-badge">AI Generated</span></h2><p className="mt-2 text-sm text-muted-foreground">38 collections contain incomplete descriptions, missing SEO metadata, or synchronization issues and may require review.</p></header><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-y border-border text-[11px] uppercase tracking-wider text-muted-foreground"><tr><th className="py-3">Collection</th><th>Store</th><th>Missing Field</th><th>Last Updated</th></tr></thead><tbody className="divide-y divide-border">{[['Summer Essentials', 'Lulu Store', 'SEO metadata', '15 Aug'], ['New Arrivals', 'Brand Store', 'Description', '12 Aug'], ['Clearance', 'International Store', 'Image + Description', '8 Aug'], ['Best Sellers', 'All Stores', 'SEO title', '5 Aug']].map(row => <tr key={row[0]}><td className="py-3 font-semibold">{row[0]}</td><td>{row[1]}</td><td className="text-foreground">{row[2]}</td><td className="text-muted-foreground">{row[3]}</td></tr>)}</tbody></table></div><p className="mt-3 text-xs text-muted-foreground">AI-generated · Not a performance claim</p></section>
      <section className="panel mb-7 border-l-4 border-l-chart-1"><header className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="section-title">Collections Requiring Attention <span className="count-badge amber">38</span></h2><p className="mt-1 text-sm text-muted-foreground">Resolve collection information and synchronization issues before they impact your store.</p></div><button className="text-sm font-semibold text-foreground">View All <ChevronRight className="inline h-4 w-4" /></button></header><div className="mt-5 divide-y divide-border">{attention.map(item => <div key={item.name} className="grid items-center gap-3 py-3 md:grid-cols-[minmax(180px,1.2fr)_minmax(180px,1.5fr)_80px_150px_120px]"><strong className="text-sm">{item.name}</strong><span className="text-sm text-muted-foreground">{item.issue}</span><span className={`severity ${item.severity.toLowerCase()}`}>{item.severity}</span><span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground"><Store className="h-3 w-3 text-foreground" />{item.store}</span><button className="secondary-btn text-xs">{item.action}</button></div>)}</div><button className="mt-3 w-full rounded-md border border-border py-2.5 text-sm font-semibold text-foreground hover:bg-card">View All 38 Collections Requiring Attention</button></section>
      <section className="panel mb-7"><header className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="section-title">Collections <span className="text-sm font-normal text-muted-foreground">1,284 collections</span></h2><div className="mt-3 flex items-center gap-2"><span className="filter-pill">Status: Active <X className="h-3 w-3" /></span><button className="text-sm font-semibold text-foreground">+ Add Filter</button></div></div><button className="text-sm font-semibold text-foreground">Manage columns</button></header><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[1100px] border-collapse text-left"><thead><tr className="border-y border-border text-[11px] uppercase tracking-wider text-muted-foreground"><th className="w-10 py-3"><input aria-label="Select all visible collections" type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></th><th>Collection</th><th>Type</th><th>Store</th><th>Products</th><th>Visibility</th><th>Status</th><th>Updated</th><th>Sync Status</th><th>Actions</th></tr></thead><tbody className="divide-y divide-border">{filtered.map(c => <tr key={c.id} className="group hover:bg-secondary/30"><td className="py-3"><input aria-label={`Select ${c.name}`} type="checkbox" checked={selected.includes(c.id)} onChange={() => setSelected(selected.includes(c.id) ? selected.filter(id => id !== c.id) : [...selected, c.id])} /></td><td className="py-3"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-foreground"><Layers3 className="h-4 w-4" /></span><div><strong className="block whitespace-nowrap text-sm text-foreground">{c.name}</strong><span className="text-xs text-muted-foreground">{c.handle}</span></div></div></td><td><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${c.type === 'Manual' ? 'bg-secondary text-foreground' : c.type === 'Automated' ? 'bg-secondary text-foreground' : c.type === 'Platform' ? 'bg-secondary text-muted-foreground' : 'bg-secondary text-muted-foreground'}`}>{c.type}</span></td><td><span className="inline-flex max-w-[145px] items-center gap-1.5 truncate rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground"><Store className="h-3 w-3 text-foreground" />{c.store}</span></td><td className="text-sm"><strong>{c.products}</strong> products {c.products === 0 ? <AlertCircle className="inline h-3.5 w-3.5 text-foreground" aria-label="Empty collection" /> : null}</td><td className="text-sm text-muted-foreground">{c.visibility}</td><td>{c.status === 'Published' ? <span className="status healthy"><CircleCheck className="h-3.5 w-3.5" />Published</span> : c.status === 'Draft' ? <span className="status draft"><Clock3 className="h-3.5 w-3.5" />Draft</span> : <span className="text-sm text-muted-foreground">Unknown</span>}</td><td className="text-xs text-muted-foreground">{c.updated}</td><td>{c.sync === 'Synced' ? <span className="status healthy"><CircleCheck className="h-3.5 w-3.5" />Synced</span> : c.sync === 'Syncing' ? <span className="status draft"><RefreshCw className="h-3.5 w-3.5" />Syncing</span> : c.sync === 'Delayed' ? <span className="status attention"><AlertCircle className="h-3.5 w-3.5" />Delayed</span> : <span className="status critical"><CircleX className="h-3.5 w-3.5" />Failed</span>}</td><td><div className="flex items-center gap-1"><button className="row-action">Open</button><button className="row-action">Edit</button><button aria-label={`More actions for ${c.name}`} className="icon-btn h-8 w-8"><MoreHorizontal className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div><footer className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground"><span>Showing 1–10 of 1,284 collections</span><div className="flex gap-2"><button aria-label="Previous page" className="icon-btn"><ArrowLeft className="h-4 w-4" /></button><button aria-label="Next page" className="icon-btn"><ArrowRight className="h-4 w-4" /></button></div></footer></section>
      <div className="grid gap-7 xl:grid-cols-[1.35fr_1fr]"><section className="panel"><header className="flex items-center justify-between"><h2 className="section-title">Collection Activity</h2><button className="text-sm font-semibold text-foreground">View All Activity</button></header><div className="mt-4 divide-y divide-border">{activities.map(item => <div key={item[1]} className="flex gap-3 py-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-sm">{item[0]}</span><div><p className="text-sm"><strong>{item[1]}</strong> <span className="text-muted-foreground">— {item[2]}</span></p><p className="mt-1 text-xs text-muted-foreground">{item[3]} · {item[4]}</p></div></div>)}</div></section><section className="panel"><header className="flex flex-wrap items-center justify-between gap-2"><h2 className="section-title">Collection Operations Health</h2><span className="severity high">⚠ Attention Required</span></header><div className="mt-4 divide-y divide-border">{health.map(item => <div key={item[0]} className="flex items-start gap-3 py-3"><span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-${item[3]}-500`} /><div><p className="text-sm font-semibold">{item[0]} <span className={item[3] === 'teal' ? 'text-foreground' : item[3] === 'red' ? 'text-chart-5' : 'text-foreground'}>· {item[1]}</span></p><p className="mt-1 text-xs text-muted-foreground">{item[2]}</p></div></div>)}</div><h3 className="mt-5 border-t border-border pt-5 text-sm font-bold">Collection Synchronization</h3>{stores.map((store, i) => <div key={store} className="mt-3 rounded-md bg-card p-3"><div className="flex items-center justify-between gap-2"><strong className="text-sm">{store}</strong><span className={i === 2 ? 'status critical' : i === 1 ? 'status draft' : 'status healthy'}>{i === 2 ? 'Failed' : i === 1 ? 'Syncing' : 'Synced'}</span></div><p className="mt-1 text-xs text-muted-foreground">{i === 0 ? 'Last sync: 2 min ago · 847 collections · 0 failed' : i === 1 ? 'Last sync: 14 min ago · 312 collections · 0 failed' : 'Last sync: 2h ago · 125 collections · 2 failed'}</p><div className="mt-2 flex gap-3"><button className="row-action">View Details</button><button className="row-action">Retry Sync</button></div></div>)}</section></div>
      <section className="ai-panel mt-7"><div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary"><Sparkles className="h-5 w-5" /></span><div className="flex-1"><h2 className="text-xl font-bold">Ask Lulu AI</h2><p className="mt-1 text-sm text-foreground">Analyze, improve and manage your collections with AI.</p><label className="mt-5 flex items-center gap-3 rounded-lg bg-card p-3 text-muted-foreground"><Bot className="h-5 w-5 text-muted-foreground" /><input className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Ask Lulu AI about this collection..." /><button type="button" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Ask</button></label><div className="mt-4 flex flex-wrap gap-2">{['Improve this collection description', 'Generate an SEO title', 'Find empty collections', 'Find collections with incomplete information', 'Find duplicate collections', 'Find outdated collections', 'Compare collections across stores', "Explain this collection's rules"].map(prompt => <button key={prompt} className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-foreground hover:bg-secondary">{prompt}</button>)}</div><div className="mt-5 flex flex-wrap gap-2">{['Find Empty Collections', 'Find Duplicate Collections', 'Generate Collection SEO Metadata', 'Improve Collection Descriptions', 'Find Outdated Collections', 'Create Collection Report', 'Review Collection Rules'].map(action => <button key={action} className="rounded-md bg-card px-3 py-2 text-xs font-semibold text-foreground">{action}</button>)}</div><p className="mt-4 text-xs text-foreground">AI suggestions require user review before saving or publishing. <span className="ai-badge">AI Generated</span></p></div></div></section>
    </div></div>
    {drawerOpen ? <aside className="fixed inset-y-0 right-0 z-30 flex w-full max-w-[430px] flex-col border-l border-border bg-card shadow-2xl" aria-label="Create Collection panel"><header className="flex items-center justify-between border-b border-border px-6 py-5"><div><h2 className="text-xl font-bold">Create Collection</h2><p className="mt-1 text-xs text-muted-foreground">Create a collection across your connected stores</p></div><button aria-label="Close create collection panel" onClick={() => setDrawerOpen(false)} className="icon-btn"><X className="h-4 w-4" /></button></header><nav className="flex gap-5 overflow-x-auto border-b border-border px-6" aria-label="Collection creation tabs">{tabs.map(name => <button key={name} onClick={() => setTab(name)} className={`tab-btn ${tab === name ? 'active' : ''}`}>{name}</button>)}</nav><form className="flex-1 space-y-5 overflow-y-auto px-6 py-6"><label className="form-label">Collection Name<input className="form-input" placeholder="e.g. Summer Essentials" /></label><label className="form-label">Description<textarea className="form-input min-h-24 resize-none" placeholder="Describe this collection..." /></label><button type="button" className="ai-create"><Sparkles className="h-4 w-4" />Create with AI ✨</button><p className="-mt-2 text-xs text-muted-foreground"><span className="ai-badge">AI Generated</span> Lulu AI can suggest name, description, SEO metadata and handle.</p><label className="form-label">Collection Type<select className="form-input"><option>Manual Collection</option><option>Automated Collection</option></select></label><label className="form-label">Handle/Slug<input className="form-input" placeholder="/collections/summer-collection" /></label><fieldset><legend className="form-label">Store assignment</legend><div className="mt-2 space-y-2 rounded-lg border border-border p-3">{stores.map(store => <label key={store} className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked />{store}</label>)}</div></fieldset><label className="form-label">Visibility<select className="form-input"><option>Online Store</option><option>Hidden</option><option>Scheduled</option></select></label></form><footer className="flex gap-2 border-t border-border p-5"><button type="button" className="secondary-btn flex-1" onClick={() => setDrawerOpen(false)}>Cancel</button><button type="button" className="secondary-btn flex-1">Save as Draft</button><button type="button" className="primary-btn flex-1">Create Collection</button></footer></aside> : null}
  </main>;
}