import { useMemo, useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
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
const stores: string[] = [];
const tabs = ['Basic Info', 'Products', 'Rules', 'Media', 'SEO', 'Visibility'];
const collections: Collection[] = [];
const attention: Attention[] = [];
const activities: any[][] = [];
const health: any[][] = [];
const summary: any[][] = [];
export function LuluCollectionsPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [activeSummary, setActiveSummary] = useState('Total Collections');
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [tab, setTab] = useState('Basic Info');
  const [showFilters, setShowFilters] = useState(false);
  const { items: liveCollections, loading: liveLoading, error: liveError } = useLiveRecords('ecommerce_collections');
  const liveEmpty = !liveLoading && !liveError && liveCollections.length === 0;
  const filtered = useMemo(() => collections.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) && (activeSummary === 'Total Collections' || activeSummary === 'Active' ? activeSummary === 'Total Collections' || c.status === 'Published' : activeSummary === 'Draft' ? c.status === 'Draft' : activeSummary === 'Empty' ? c.products === 0 : activeSummary === 'Automated' ? c.type === 'Automated' : activeSummary === 'Manual' ? c.type === 'Manual' : c.sync !== 'Synced')), [query, activeSummary]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(c => c.id));
  return <main className="min-h-screen bg-[var(--background)] text-foreground">{liveLoading ? <div className="border-b border-border bg-secondary/30 px-5 py-3 text-xs text-muted-foreground lg:pl-[268px]">Loading live collections…</div> : liveError ? <div className="border-b border-destructive/30 bg-destructive/5 px-5 py-3 text-xs text-destructive lg:pl-[268px]">{liveError}</div> : liveEmpty ? <div className="border-b border-dashed border-border bg-card px-5 py-3 text-xs text-muted-foreground lg:pl-[268px]">No live collections are available yet. Add a collection or connect your commerce platform to begin.</div> : null}
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col bg-[var(--sidebar)] text-foreground lg:flex"><header className="flex h-20 items-center gap-3 border-b border-border px-6"><span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">L</span><div><p className="font-semibold tracking-tight text-foreground">LULU AI</p><p className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">Core platform</p></div></header><LuluSectionNavigation activeId="safely-air-9334" /><footer className="border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-secondary"><span className="grid h-8 w-8 place-items-center rounded-full bg-secondary/30 text-sm font-semibold text-foreground">AM</span><span className="flex-1 text-sm text-foreground">Workspace administrator<small className="block text-xs text-muted-foreground">Administrator</small></span><Settings2 className="h-4 w-4" /></button></footer></aside>
    <div><div className="mx-auto max-w-[1540px] px-5 py-5 sm:px-8 lg:px-10">
      <header className="mb-6 flex flex-col gap-5 border-b border-border pb-6 xl:flex-row xl:items-end xl:justify-between"><div><p className="mb-2 text-sm font-medium text-muted-foreground">Ecommerce <ChevronRight className="mx-1 inline h-3.5 w-3.5" /> Collections</p><h1 className="text-3xl font-bold tracking-[-.035em] text-foreground sm:text-4xl">Collections</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Organize and manage product collections across your connected ecommerce stores.</p></div><div className="flex flex-wrap gap-2"><button className="primary-btn"><Plus className="h-4 w-4" />Create Collection</button><button className="secondary-btn"><Download className="h-4 w-4" />Export</button><button aria-label="More actions" className="icon-btn"><MoreHorizontal className="h-4 w-4" /></button></div></header>
      <section className="mb-6 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-sm xl:flex-row"><button className="field flex w-full items-center gap-2 xl:w-56"><Store className="h-4 w-4 text-foreground" /><span className="flex-1 text-left text-sm">All Stores</span><ChevronDown className="h-4 w-4 text-muted-foreground" /></button><label className="field flex min-w-0 flex-1 items-center gap-2"><Search className="h-4 w-4 shrink-0 text-muted-foreground" /><input aria-label="Search collections" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by collection name, handle, ID, product, tag..." /></label><button className={`secondary-btn ${showFilters ? 'border-border bg-secondary text-foreground' : ''}`} onClick={() => setShowFilters(!showFilters)}><Filter className="h-4 w-4" />Filters<ChevronDown className="h-3.5 w-3.5" /></button><button className="field flex w-full items-center gap-2 xl:w-32"><ArrowDownAZ className="h-4 w-4" /><span className="flex-1 text-left text-sm">Updated</span></button>{selected.length > 0 ? <button className="secondary-btn whitespace-nowrap">Bulk Actions ({selected.length})</button> : null}<button className="secondary-btn"><Download className="h-4 w-4" />Export</button></section>
      {showFilters ? <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-secondary/60 p-4 text-sm"><strong className="text-foreground">Filter collections</strong><span className="filter-pill">Store: All Stores <X className="h-3 w-3" /></span><button className="text-foreground underline underline-offset-4">Clear all</button></div> : null}
      <section className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">{summary.map(item => <button key={item[0]} onClick={() => setActiveSummary(item[0])} className={`summary-card ${activeSummary === item[0] ? 'summary-active' : ''}`}><span className={`summary-icon ${item[2]}`}>{item[0] === 'Total Collections' ? <Layers3 className="h-4 w-4" /> : item[0] === 'Active' ? <CircleCheck className="h-4 w-4" /> : item[0] === 'Draft' ? <FileImage className="h-4 w-4" /> : item[0] === 'Automated' ? <Zap className="h-4 w-4" /> : item[0] === 'Manual' ? <Hand className="h-4 w-4" /> : item[0] === 'Empty' ? <Inbox className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}</span><span className="text-left"><span className="block text-xs font-medium text-muted-foreground">{item[0]}</span><strong className="mt-1 block text-xl tracking-tight text-foreground">{item[1]}</strong></span></button>)}</section>
      <section className="panel mb-7"><header className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="section-title">Collection Data Quality <span className="ai-badge">AI Generated</span></h2><p className="mt-1 text-sm text-muted-foreground">A quick view of the information quality across your collection catalog.</p></div><span className="severity medium">Attention Required</span></header><div className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-3">{[['Collections with descriptions', '1,147 (92%)', 'Healthy', 'teal'], ['Collections missing descriptions', '94 (8%)', 'Attention', 'amber'], ['Collections missing images', '61', 'Attention', 'amber'], ['Collections missing SEO metadata', '203 (16%)', 'Attention', 'amber'], ['Empty collections', '67', 'Attention', 'amber'], ['Invalid collection rules', '4', 'Critical', 'red'], ['Synchronization issues', '6', 'Critical', 'red'], ['Duplicate names', '11', 'Attention', 'amber']].map(item => <div key={item[0]} className="flex items-start gap-2"><span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-${item[3]}-500`} /><div><p className="text-sm font-semibold text-foreground">{item[0]}</p><p className="mt-1 text-sm text-muted-foreground">{item[1]} · <span className={item[3] === 'teal' ? 'text-foreground' : item[3] === 'red' ? 'text-chart-5' : 'text-foreground'}>{item[2]}</span></p></div></div>)}</div></section>
      <section className="panel mb-7 border-l-4 border-l-border"><header><h2 className="section-title">AI Insight <span className="ai-badge">AI Generated</span></h2><p className="mt-2 text-sm text-muted-foreground">38 collections contain incomplete descriptions, missing SEO metadata, or synchronization issues and may require review.</p></header><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-y border-border text-[11px] uppercase tracking-wider text-muted-foreground"><tr><th className="py-3">Collection</th><th>Store</th><th>Missing Field</th><th>Last Updated</th></tr></thead><tbody className="divide-y divide-border">{[['Summer Essentials', 'Connected store', 'SEO metadata', '15 Aug'], ['New Arrivals', 'Brand Store', 'Description', '12 Aug'], ['Clearance', 'International Store', 'Image + Description', '8 Aug'], ['Best Sellers', 'All Stores', 'SEO title', '5 Aug']].map(row => <tr key={row[0]}><td className="py-3 font-semibold">{row[0]}</td><td>{row[1]}</td><td className="text-foreground">{row[2]}</td><td className="text-muted-foreground">{row[3]}</td></tr>)}</tbody></table></div><p className="mt-3 text-xs text-muted-foreground">AI-generated · Not a performance claim</p></section>
      <section className="panel mb-7 border-l-4 border-l-chart-1"><header className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="section-title">Collections Requiring Attention <span className="count-badge amber">38</span></h2><p className="mt-1 text-sm text-muted-foreground">Resolve collection information and synchronization issues before they impact your store.</p></div><button className="text-sm font-semibold text-foreground">View All <ChevronRight className="inline h-4 w-4" /></button></header><div className="mt-5 divide-y divide-border">{attention.map(item => <div key={item.name} className="grid items-center gap-3 py-3 md:grid-cols-[minmax(180px,1.2fr)_minmax(180px,1.5fr)_80px_150px_120px]"><strong className="text-sm">{item.name}</strong><span className="text-sm text-muted-foreground">{item.issue}</span><span className={`severity ${item.severity.toLowerCase()}`}>{item.severity}</span><span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground"><Store className="h-3 w-3 text-foreground" />{item.store}</span><button className="secondary-btn text-xs">{item.action}</button></div>)}</div><button className="mt-3 w-full rounded-md border border-border py-2.5 text-sm font-semibold text-foreground hover:bg-card">View All 38 Collections Requiring Attention</button></section>
      <section className="panel mb-7"><header className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="section-title">Collections <span className="text-sm font-normal text-muted-foreground">1,284 collections</span></h2><div className="mt-3 flex items-center gap-2"><span className="filter-pill">Status: Active <X className="h-3 w-3" /></span><button className="text-sm font-semibold text-foreground">+ Add Filter</button></div></div><button className="text-sm font-semibold text-foreground">Manage columns</button></header><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[1100px] border-collapse text-left"><thead><tr className="border-y border-border text-[11px] uppercase tracking-wider text-muted-foreground"><th className="w-10 py-3"><input aria-label="Select all visible collections" type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></th><th>Collection</th><th>Type</th><th>Store</th><th>Products</th><th>Visibility</th><th>Status</th><th>Updated</th><th>Sync Status</th><th>Actions</th></tr></thead><tbody className="divide-y divide-border">{filtered.map(c => <tr key={c.id} className="group hover:bg-secondary/30"><td className="py-3"><input aria-label={`Select ${c.name}`} type="checkbox" checked={selected.includes(c.id)} onChange={() => setSelected(selected.includes(c.id) ? selected.filter(id => id !== c.id) : [...selected, c.id])} /></td><td className="py-3"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-foreground"><Layers3 className="h-4 w-4" /></span><div><strong className="block whitespace-nowrap text-sm text-foreground">{c.name}</strong><span className="text-xs text-muted-foreground">{c.handle}</span></div></div></td><td><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${c.type === 'Manual' ? 'bg-secondary text-foreground' : c.type === 'Automated' ? 'bg-secondary text-foreground' : c.type === 'Platform' ? 'bg-secondary text-muted-foreground' : 'bg-secondary text-muted-foreground'}`}>{c.type}</span></td><td><span className="inline-flex max-w-[145px] items-center gap-1.5 truncate rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground"><Store className="h-3 w-3 text-foreground" />{c.store}</span></td><td className="text-sm"><strong>{c.products}</strong> products {c.products === 0 ? <AlertCircle className="inline h-3.5 w-3.5 text-foreground" aria-label="Empty collection" /> : null}</td><td className="text-sm text-muted-foreground">{c.visibility}</td><td>{c.status === 'Published' ? <span className="status healthy"><CircleCheck className="h-3.5 w-3.5" />Published</span> : c.status === 'Draft' ? <span className="status draft"><Clock3 className="h-3.5 w-3.5" />Draft</span> : <span className="text-sm text-muted-foreground">Unknown</span>}</td><td className="text-xs text-muted-foreground">{c.updated}</td><td>{c.sync === 'Synced' ? <span className="status healthy"><CircleCheck className="h-3.5 w-3.5" />Synced</span> : c.sync === 'Syncing' ? <span className="status draft"><RefreshCw className="h-3.5 w-3.5" />Syncing</span> : c.sync === 'Delayed' ? <span className="status attention"><AlertCircle className="h-3.5 w-3.5" />Delayed</span> : <span className="status critical"><CircleX className="h-3.5 w-3.5" />Failed</span>}</td><td><div className="flex items-center gap-1"><button className="row-action">Open</button><button className="row-action">Edit</button><button aria-label={`More actions for ${c.name}`} className="icon-btn h-8 w-8"><MoreHorizontal className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div><footer className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground"><span>Showing 1–10 of 1,284 collections</span><div className="flex gap-2"><button aria-label="Previous page" className="icon-btn"><ArrowLeft className="h-4 w-4" /></button><button aria-label="Next page" className="icon-btn"><ArrowRight className="h-4 w-4" /></button></div></footer></section>
      <div className="grid gap-7 xl:grid-cols-[1.35fr_1fr]"><section className="panel"><header className="flex items-center justify-between"><h2 className="section-title">Collection Activity</h2><button className="text-sm font-semibold text-foreground">View All Activity</button></header><div className="mt-4 divide-y divide-border">{activities.map(item => <div key={item[1]} className="flex gap-3 py-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-sm">{item[0]}</span><div><p className="text-sm"><strong>{item[1]}</strong> <span className="text-muted-foreground">— {item[2]}</span></p><p className="mt-1 text-xs text-muted-foreground">{item[3]} · {item[4]}</p></div></div>)}</div></section><section className="panel"><header className="flex flex-wrap items-center justify-between gap-2"><h2 className="section-title">Collection Operations Health</h2><span className="severity high">⚠ Attention Required</span></header><div className="mt-4 divide-y divide-border">{health.map(item => <div key={item[0]} className="flex items-start gap-3 py-3"><span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-${item[3]}-500`} /><div><p className="text-sm font-semibold">{item[0]} <span className={item[3] === 'teal' ? 'text-foreground' : item[3] === 'red' ? 'text-chart-5' : 'text-foreground'}>· {item[1]}</span></p><p className="mt-1 text-xs text-muted-foreground">{item[2]}</p></div></div>)}</div><h3 className="mt-5 border-t border-border pt-5 text-sm font-bold">Collection Synchronization</h3>{stores.map((store, i) => <div key={store} className="mt-3 rounded-md bg-card p-3"><div className="flex items-center justify-between gap-2"><strong className="text-sm">{store}</strong><span className={i === 2 ? 'status critical' : i === 1 ? 'status draft' : 'status healthy'}>{i === 2 ? 'Failed' : i === 1 ? 'Syncing' : 'Synced'}</span></div><p className="mt-1 text-xs text-muted-foreground">{i === 0 ? 'Last sync: 2 min ago · 847 collections · 0 failed' : i === 1 ? 'Last sync: 14 min ago · 312 collections · 0 failed' : 'Last sync: 2h ago · 125 collections · 2 failed'}</p><div className="mt-2 flex gap-3"><button className="row-action">View Details</button><button className="row-action">Retry Sync</button></div></div>)}</section></div>
      
    </div></div>
    {drawerOpen ? <aside className="fixed inset-y-0 right-0 z-30 flex w-full max-w-[430px] flex-col border-l border-border bg-card shadow-2xl" aria-label="Create Collection panel"><header className="flex items-center justify-between border-b border-border px-6 py-5"><div><h2 className="text-xl font-bold">Create Collection</h2><p className="mt-1 text-xs text-muted-foreground">Create a collection across your connected stores</p></div><button aria-label="Close create collection panel" onClick={() => setDrawerOpen(false)} className="icon-btn"><X className="h-4 w-4" /></button></header><nav className="flex gap-5 overflow-x-auto border-b border-border px-6" aria-label="Collection creation tabs">{tabs.map(name => <button key={name} onClick={() => setTab(name)} className={`tab-btn ${tab === name ? 'active' : ''}`}>{name}</button>)}</nav><form className="flex-1 space-y-5 overflow-y-auto px-6 py-6"><label className="form-label">Collection Name<input className="form-input" placeholder="e.g. Summer Essentials" /></label><label className="form-label">Description<textarea className="form-input min-h-24 resize-none" placeholder="Describe this collection..." /></label><p className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-muted-foreground"><span className="ai-badge">AI Generated</span> Use the Update button in the navigation when you want Lulu AI to prepare collection suggestions.</p><label className="form-label">Collection Type<select className="form-input"><option>Manual Collection</option><option>Automated Collection</option></select></label><label className="form-label">Handle/Slug<input className="form-input" placeholder="/collections/summer-collection" /></label><fieldset><legend className="form-label">Store assignment</legend><div className="mt-2 space-y-2 rounded-lg border border-border p-3">{stores.map(store => <label key={store} className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked />{store}</label>)}</div></fieldset><label className="form-label">Visibility<select className="form-input"><option>Online Store</option><option>Hidden</option><option>Scheduled</option></select></label></form><footer className="flex gap-2 border-t border-border p-5"><button type="button" className="secondary-btn flex-1" onClick={() => setDrawerOpen(false)}>Cancel</button><button type="button" className="secondary-btn flex-1">Save as Draft</button><button type="button" className="primary-btn flex-1">Create Collection</button></footer></aside> : null}
  </main>;
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
