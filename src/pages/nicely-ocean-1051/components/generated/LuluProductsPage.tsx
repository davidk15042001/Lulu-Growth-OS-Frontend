import { useMemo, useState } from 'react';
import { Activity, AlertCircle, Archive, ArrowDownAZ, ArrowLeft, ArrowRight, Bot, Boxes, ChevronDown, ChevronRight, CircleCheck, CircleX, Clock3, Copy, Download, Edit3, ExternalLink, FileImage, Filter, Grid2X2, HelpCircle, ImagePlus, Layers3, List, MoreHorizontal, Package, Plus, RefreshCw, Search, Settings2, Sparkles, Store, Tag, Trash2, Upload, X, Zap } from 'lucide-react';
type Product = {
  id: string;
  name: string;
  sku: string;
  store: string;
  category: string;
  price: string;
  inventory: number;
  variants: number;
  status: 'Active' | 'Draft';
  updated: string;
  operational: 'Healthy' | 'Attention' | 'Critical';
  image: string;
};
const products: Product[] = [{
  id: 'p1',
  name: 'Premium Wireless Headphones',
  sku: 'SKU-10291',
  store: 'Lulu Store',
  category: 'Electronics',
  price: '$149.99',
  inventory: 284,
  variants: 3,
  status: 'Active',
  updated: '2h ago',
  operational: 'Healthy',
  image: 'headphones'
}, {
  id: 'p2',
  name: 'Smart Home Hub',
  sku: 'SKU-20847',
  store: 'Lulu Store + Brand Store',
  category: 'Smart Home',
  price: '$89.99',
  inventory: 156,
  variants: 1,
  status: 'Active',
  updated: '4h ago',
  operational: 'Healthy',
  image: 'hub'
}, {
  id: 'p3',
  name: 'Cotton Tee — Classic',
  sku: 'SKU-30124',
  store: 'Brand Store',
  category: 'Apparel',
  price: '$34.99',
  inventory: 8,
  variants: 12,
  status: 'Active',
  updated: '1d ago',
  operational: 'Attention',
  image: 'tee'
}, {
  id: 'p4',
  name: 'Yoga Mat Pro',
  sku: 'SKU-40381',
  store: 'International Store',
  category: 'Fitness',
  price: '$79.99',
  inventory: 0,
  variants: 2,
  status: 'Active',
  updated: '2d ago',
  operational: 'Critical',
  image: 'mat'
}, {
  id: 'p5',
  name: 'Phone Case — Series X',
  sku: 'SKU-50219',
  store: 'All Stores',
  category: 'Accessories',
  price: '$24.99',
  inventory: 412,
  variants: 8,
  status: 'Active',
  updated: '3h ago',
  operational: 'Healthy',
  image: 'case'
}, {
  id: 'p6',
  name: 'Insulated Water Bottle',
  sku: 'SKU-60847',
  store: 'Lulu Store',
  category: 'Lifestyle',
  price: '$39.99',
  inventory: 67,
  variants: 4,
  status: 'Active',
  updated: '5h ago',
  operational: 'Healthy',
  image: 'bottle'
}, {
  id: 'p7',
  name: 'Running Shorts — Pro',
  sku: 'SKU-70124',
  store: 'Brand Store',
  category: 'Apparel',
  price: '$59.99',
  inventory: 23,
  variants: 6,
  status: 'Active',
  updated: '1d ago',
  operational: 'Attention',
  image: 'shorts'
}, {
  id: 'p8',
  name: 'Leather Wallet',
  sku: 'SKU-80381',
  store: 'Lulu Store',
  category: 'Accessories',
  price: '$69.99',
  inventory: 189,
  variants: 3,
  status: 'Active',
  updated: '6h ago',
  operational: 'Healthy',
  image: 'wallet'
}, {
  id: 'p9',
  name: 'Wireless Charger Pad',
  sku: 'SKU-90219',
  store: 'All Stores',
  category: 'Electronics',
  price: '$44.99',
  inventory: 0,
  variants: 2,
  status: 'Draft',
  updated: '2d ago',
  operational: 'Attention',
  image: 'charger'
}, {
  id: 'p10',
  name: 'Canvas Backpack',
  sku: 'SKU-100847',
  store: 'International Store',
  category: 'Bags',
  price: '$129.99',
  inventory: 34,
  variants: 5,
  status: 'Active',
  updated: 'Sync Failed',
  operational: 'Critical',
  image: 'backpack'
}];
const attentionItems = [{
  name: 'Running Shorts (Black)',
  issue: 'Missing product image',
  severity: 'Medium',
  store: 'Lulu Store',
  action: 'Edit',
  image: 'shorts'
}, {
  name: 'Smart Watch Band — S/M',
  issue: 'Out of stock — no inventory',
  severity: 'High',
  store: 'Brand Store',
  action: 'View Inventory',
  image: 'watch'
}, {
  name: 'Premium Hoodie',
  issue: 'Price missing on variant (XL)',
  severity: 'High',
  store: 'All Stores',
  action: 'Edit',
  image: 'hoodie'
}, {
  name: 'Canvas Backpack (Blue)',
  issue: 'Sync failed — product mismatch',
  severity: 'High',
  store: 'International Store',
  action: 'View Details',
  image: 'backpack'
}];
const activities = [['Product updated', 'Premium Wireless Headphones — description edited', 'Admin', '2h ago', 'Lulu Store', '✏️'], ['New product created', 'Ceramic Coffee Mug', 'Admin', '4h ago', 'Brand Store', '📦'], ['Price changed', 'Smart Home Hub — $99.99 → $89.99', 'Admin', '6h ago', 'All Stores', '💰'], ['Product published', 'Running Shorts Pro — Draft → Active', 'Admin', '1d ago', 'Brand Store', '✅'], ['Sync completed', '1,247 products synchronized', 'System', '1d ago', 'All Stores', '🔄'], ['Sync failed', 'Canvas Backpack — product mismatch', 'System', '1d ago', 'International Store', '⚠'], ['Images updated', 'Yoga Mat Pro — 3 images added', 'Admin', '2d ago', 'International Store', '📸'], ['Variant added', 'Leather Wallet — Brown / Large', 'Admin', '2d ago', 'Lulu Store', '📦']];
function Thumbnail({
  kind,
  large = false
}: {
  kind: string;
  large?: boolean;
}) {
  const palette: Record<string, string> = {
    headphones: 'from-secondary to-card',
    hub: 'from-secondary to-white',
    tee: 'from-secondary to-white',
    mat: 'from-secondary to-white',
    case: 'from-secondary to-white',
    bottle: 'from-secondary to-white',
    shorts: 'from-chart-5/10 to-white',
    wallet: 'from-secondary to-white',
    charger: 'from-secondary to-white',
    backpack: 'from-secondary to-white',
    watch: 'from-secondary to-white',
    hoodie: 'from-secondary to-white'
  };
  return <div className={`flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${palette[kind] || 'from-secondary to-white'} ${large ? 'h-20 w-20' : 'h-11 w-11'} border border-border`}><Package className={`${large ? 'h-8 w-8' : 'h-5 w-5'} text-muted-foreground`} /></div>;
}
function StoreBadge({
  store
}: {
  store: string;
}) {
  return <span className="inline-flex max-w-[150px] items-center gap-1.5 truncate rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground"><Store className="h-3 w-3 text-foreground" />{store}</span>;
}
export function LuluProductsPage() {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [query, setQuery] = useState('');
  const [activeSummary, setActiveSummary] = useState('Total Products');
  const [selected, setSelected] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [detailTab, setDetailTab] = useState('Overview');
  const [showFilters, setShowFilters] = useState(false);
  const filteredProducts = useMemo(() => products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()) && (activeSummary === 'Total Products' || activeSummary === 'Active' ? product.status === 'Active' || activeSummary === 'Total Products' : activeSummary === 'Draft' ? product.status === 'Draft' : activeSummary === 'Out of Stock' ? product.inventory === 0 : activeSummary === 'Low Stock' ? product.inventory > 0 && product.inventory < 30 : product.operational !== 'Healthy')), [query, activeSummary]);
  const toggleAll = () => setSelected(selected.length === filteredProducts.length ? [] : filteredProducts.map(product => product.id));
  const status = (value: string) => value === 'Active' ? <span className="status healthy"><CircleCheck className="h-3.5 w-3.5" />Active</span> : <span className="status draft"><Clock3 className="h-3.5 w-3.5" />Draft</span>;
  const inventory = (value: number) => value === 0 ? <span className="status critical"><CircleX className="h-3.5 w-3.5" />0 units · Out of Stock</span> : value < 30 ? <span className="status attention"><AlertCircle className="h-3.5 w-3.5" />{value} units · Low Stock</span> : <span className="status healthy"><CircleCheck className="h-3.5 w-3.5" />{value} units · In Stock</span>;
  const operational = (value: Product['operational']) => value === 'Healthy' ? <span className="status healthy"><CircleCheck className="h-3.5 w-3.5" />Healthy</span> : value === 'Attention' ? <span className="status attention"><AlertCircle className="h-3.5 w-3.5" />Attention</span> : <span className="status critical"><CircleX className="h-3.5 w-3.5" />Critical</span>;
  return <main className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col bg-[var(--sidebar)] text-foreground lg:flex">
      <header className="flex h-20 items-center gap-3 border-b border-border px-6"><div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">L</div><div><p className="font-semibold tracking-tight text-foreground">LULU AI</p><p className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">Core platform</p></div></header>
      <nav className="flex-1 overflow-y-auto px-3 py-6" aria-label="Primary navigation"><p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Ecommerce</p>{['Overview', 'Stores', 'Products', 'Categories', 'Orders', 'Customers', 'Carts', 'Abandoned Carts', 'Returns', 'Refunds', 'Shipping', 'Inventory', 'Product Reviews', 'Merchandising', 'Ecommerce Automation', 'Ecommerce Settings'].map(item => <button key={item} className={`nav-item ${item === 'Products' ? 'active' : ''}`}><span>{item}</span>{item === 'Products' ? <span className="h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /> : null}</button>)}</nav>
      <footer className="border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-secondary"><div className="grid h-8 w-8 place-items-center rounded-full bg-secondary/30 text-sm font-semibold text-foreground">AM</div><span className="flex-1 text-sm text-foreground">Alex Morgan<small className="block text-xs text-muted-foreground">Administrator</small></span><Settings2 className="h-4 w-4" /></button></footer>
    </aside>

    <div className="lg:pl-[248px]"><div className="mx-auto max-w-[1540px] px-5 py-5 sm:px-8 lg:px-10">
      <header className="mb-6 flex flex-col gap-5 border-b border-border pb-6 xl:flex-row xl:items-end xl:justify-between"><div><p className="mb-2 text-sm font-medium text-muted-foreground">Ecommerce <ChevronRight className="mx-1 inline h-3.5 w-3.5" /> Products</p><h1 className="text-3xl font-bold tracking-[-.035em] text-foreground sm:text-4xl">Products</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Manage your ecommerce products, variants, pricing, availability and product information.</p></div><div className="flex flex-wrap gap-2"><button className="primary-btn"><Plus className="h-4 w-4" />Add Product</button><button className="secondary-btn"><Bot className="h-4 w-4 text-foreground" />Ask Lulu AI</button><button aria-label="Refresh products" className="icon-btn"><RefreshCw className="h-4 w-4" /></button><button aria-label="More actions" className="icon-btn"><MoreHorizontal className="h-4 w-4" /></button></div></header>

      <section className="mb-6 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-sm xl:flex-row"><button className="field flex w-full items-center gap-2 xl:w-48"><Store className="h-4 w-4 text-foreground" /><span className="flex-1 text-left text-sm">All Stores</span><ChevronDown className="h-4 w-4 text-muted-foreground" /></button><label className="field flex min-w-0 flex-1 items-center gap-2"><Search className="h-4 w-4 shrink-0 text-muted-foreground" /><input aria-label="Search products" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by product name, SKU, category, brand..." /></label><button className={`secondary-btn ${showFilters ? 'border-border bg-secondary text-foreground' : ''}`} onClick={() => setShowFilters(!showFilters)}><Filter className="h-4 w-4" />Filters<ChevronDown className="h-3.5 w-3.5" /></button><div className="flex items-center rounded-md border border-border p-1"><button aria-label="List view" onClick={() => setView('list')} className={`view-btn ${view === 'list' ? 'selected' : ''}`}><List className="h-4 w-4" /></button><button aria-label="Grid view" onClick={() => setView('grid')} className={`view-btn ${view === 'grid' ? 'selected' : ''}`}><Grid2X2 className="h-4 w-4" /></button></div><button className="field w-full gap-2 xl:w-32"><ArrowDownAZ className="h-4 w-4" /><span className="flex-1 text-left text-sm">Updated</span><ChevronDown className="h-4 w-4 text-muted-foreground" /></button>{selected.length > 0 ? <button className="secondary-btn whitespace-nowrap">Bulk Actions ({selected.length})<ChevronDown className="h-3.5 w-3.5" /></button> : null}<button className="secondary-btn"><Upload className="h-4 w-4" />Import</button><button className="secondary-btn"><Download className="h-4 w-4" />Export</button></section>
      {showFilters ? <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-secondary/60 p-4 text-sm"><strong className="text-foreground">Filter products</strong><button className="filter-pill">Status: Active <X className="h-3 w-3" /></button><button className="filter-pill">Store: All <X className="h-3 w-3" /></button><button className="text-foreground underline underline-offset-4">Clear all</button></div> : null}

      <section className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{[['Total Products', '3,624', 'Boxes', 'neutral'], ['Active', '3,241', 'CircleCheck', 'green'], ['Draft', '183', 'FileImage', 'blue'], ['Out of Stock', '87', 'CircleX', 'red'], ['Low Stock', '124', 'AlertCircle', 'amber'], ['Attention Required', '43', 'AlertCircle', 'amber']].map(([label, count, icon, color]) => <button key={label} onClick={() => setActiveSummary(label)} className={`summary-card ${activeSummary === label ? 'summary-active' : ''}`}><span className={`summary-icon ${color}`}>{icon === 'Boxes' ? <Boxes className="h-4 w-4" /> : icon === 'CircleCheck' ? <CircleCheck className="h-4 w-4" /> : icon === 'FileImage' ? <FileImage className="h-4 w-4" /> : icon === 'CircleX' ? <CircleX className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}</span><span className="text-left"><span className="block text-xs font-medium text-muted-foreground">{label}</span><strong className="mt-1 block text-xl tracking-tight text-foreground">{count}</strong></span></button>)}</section>

      <section className="panel mb-7 border-l-4 border-l-chart-1"><header className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="section-title">Products Requiring Attention <span className="count-badge amber">43</span></h2><p className="mt-1 text-sm text-muted-foreground">Resolve product information and operational issues before they impact customers.</p></div><button className="text-sm font-semibold text-foreground hover:text-foreground">View All <ChevronRight className="inline h-4 w-4" /></button></header><div className="mt-5 divide-y divide-border">{attentionItems.map(item => <div key={item.name} className="grid items-center gap-3 py-3 md:grid-cols-[minmax(220px,1.5fr)_minmax(180px,2fr)_90px_150px_130px]"><div className="flex items-center gap-3"><Thumbnail kind={item.image} /><strong className="text-sm">{item.name}</strong></div><span className="text-sm text-muted-foreground">{item.issue}</span><span className={`severity ${item.severity.toLowerCase()}`}>{item.severity}</span><StoreBadge store={item.store} /><button className="secondary-btn justify-center text-xs">{item.action}</button></div>)}</div><button className="mt-3 w-full rounded-md border border-border py-2.5 text-sm font-semibold text-foreground hover:bg-card">View All 43 Products Requiring Attention</button></section>

      <section className="panel mb-7"><header className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="section-title">Products <span className="text-sm font-normal text-muted-foreground">3,624 products</span></h2><div className="mt-3 flex items-center gap-2"><span className="filter-pill">Status: Active <X className="h-3 w-3" /></span><button className="text-sm font-semibold text-foreground">+ Add Filter</button></div></div><button className="text-sm font-semibold text-foreground">Manage columns</button></header>
        {view === 'list' ? <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[1120px] border-collapse text-left"><thead><tr className="border-y border-border text-[11px] uppercase tracking-wider text-muted-foreground"><th className="w-10 py-3"><input aria-label="Select all visible products" type="checkbox" checked={selected.length === filteredProducts.length && filteredProducts.length > 0} onChange={toggleAll} /></th><th className="py-3">Product</th><th>Store</th><th>Category</th><th>Price</th><th>Inventory</th><th>Variants</th><th>Status</th><th>Updated</th><th>Operational Status</th><th>Actions</th></tr></thead><tbody className="divide-y divide-border">{filteredProducts.map(product => <tr key={product.id} className="group hover:bg-secondary/30"><td className="py-3"><input aria-label={`Select ${product.name}`} type="checkbox" checked={selected.includes(product.id)} onChange={() => setSelected(selected.includes(product.id) ? selected.filter(id => id !== product.id) : [...selected, product.id])} /></td><td className="py-3"><div className="flex items-center gap-3"><Thumbnail kind={product.image} /><div><strong className="block whitespace-nowrap text-sm text-foreground">{product.name}</strong><span className="text-xs text-muted-foreground">{product.sku}</span></div></div></td><td><StoreBadge store={product.store} /></td><td className="text-sm text-muted-foreground">{product.category}</td><td className="text-sm font-semibold">{product.price}</td><td className="text-xs">{inventory(product.inventory)}</td><td className="text-sm text-muted-foreground">{product.variants} variants</td><td>{status(product.status)}</td><td className="text-xs text-muted-foreground">{product.updated}</td><td>{operational(product.operational)}</td><td><div className="flex items-center gap-1"><button className="row-action">Edit</button><button aria-label={`More actions for ${product.name}`} className="icon-btn h-8 w-8"><MoreHorizontal className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div> : <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{filteredProducts.map(product => <article key={product.id} className="product-card"><Thumbnail kind={product.image} large /><div className="mt-4"><h3 className="font-semibold">{product.name}</h3><p className="mt-1 text-xs text-muted-foreground">{product.sku}</p><div className="mt-3"><StoreBadge store={product.store} /></div><div className="mt-4 flex items-center justify-between"><strong>{product.price}</strong><span className="text-xs text-muted-foreground">{product.variants} variants</span></div><div className="mt-2 text-xs">{inventory(product.inventory)}</div><div className="mt-2">{status(product.status)}</div><p className="mt-3 text-xs text-muted-foreground">Updated {product.updated}</p></div><footer className="mt-4 flex gap-2 border-t border-border pt-3"><button className="secondary-btn flex-1 justify-center text-xs">Open</button><button className="secondary-btn flex-1 justify-center text-xs">Edit</button><button className="icon-btn h-8 w-8"><MoreHorizontal className="h-4 w-4" /></button></footer></article>)}</div>}
        <footer className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground"><span>Showing 1–{filteredProducts.length} of 3,624 products</span><div className="flex gap-2"><button className="icon-btn"><ArrowLeft className="h-4 w-4" /></button><button className="icon-btn"><ArrowRight className="h-4 w-4" /></button></div></footer>
      </section>

      <section className="panel mb-7"><header className="flex flex-wrap items-center justify-between"><h2 className="section-title">Product Detail <span className="observed-badge">Observed</span></h2><button className="secondary-btn">Close detail <X className="h-4 w-4" /></button></header><nav className="mt-4 flex gap-5 overflow-x-auto border-b border-border" aria-label="Product detail tabs">{['Overview', 'Product Information', 'Variants', 'Pricing', 'Inventory', 'Orders', 'Customers', 'Revenue', 'Performance', 'Reviews', 'AI Insights', 'Operational'].map(tab => <button key={tab} onClick={() => setDetailTab(tab)} className={`tab-btn ${detailTab === tab ? 'active' : ''}`}>{tab}</button>)}</nav>{detailTab === 'Variants' ? <div className="pt-5"><div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Variants <span className="text-sm font-normal text-muted-foreground">4 variants</span></h3><button className="primary-btn"><Plus className="h-4 w-4" />Add Variant</button></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="border-y border-border text-xs uppercase text-muted-foreground"><tr><th className="py-3">Variant</th><th>SKU</th><th>Price</th><th>Inventory</th><th>Image</th><th>Status</th><th>Actions</th></tr></thead><tbody className="divide-y divide-border">{[['Color: Black / Size: S', 'SKU-10291-BS', '94', 'Active', 'headphones'], ['Color: Black / Size: M', 'SKU-10291-BM', '67', 'Active', 'headphones'], ['Color: White / Size: S', 'SKU-10291-WS', '23', 'Active', 'headphones'], ['Color: White / Size: M', 'SKU-10291-WM', '0', 'Out of Stock', 'headphones']].map(variant => <tr key={variant[1]}><td className="py-3 font-medium">{variant[0]}</td><td className="text-muted-foreground">{variant[1]}</td><td>$149.99</td><td>{variant[2]} {variant[2] === '0' ? '❌' : variant[2] === '23' ? '⚠' : ''}</td><td><Thumbnail kind={variant[4]} /></td><td>{variant[3] === 'Active' ? status('Active') : <span className="status critical"><CircleX className="h-3.5 w-3.5" />Out of Stock</span>}</td><td><button className="row-action">Edit</button> <MoreHorizontal className="inline h-4 w-4 text-muted-foreground" /></td></tr>)}</tbody></table></div></div> : <div className="pt-5"><div className="flex flex-wrap items-center gap-4"><Thumbnail kind="headphones" large /><div><h3 className="text-xl font-bold">Premium Wireless Headphones <span className="observed-badge">Observed</span></h3><p className="mt-1 text-sm text-muted-foreground">SKU-10291 · {status('Active')}</p><div className="mt-2 flex flex-wrap gap-2"><StoreBadge store="Lulu Store" /><StoreBadge store="Brand Store" /></div></div></div><div className="mt-6 grid gap-3 sm:grid-cols-4">{[['Orders', '247'], ['Units Sold', '1,284'], ['Revenue', '$186,247'], ['Inventory', '284 units']].map(([label, value]) => <div key={label} className="rounded-lg border border-border bg-card p-4"><p className="text-xs text-muted-foreground">{label}</p><strong className="mt-1 block text-xl">{value}</strong>{label === 'Revenue' ? <span className="mt-1 block text-[11px] text-muted-foreground">View in Intelligence for full analytics</span> : null}</div>)}</div><div className="mt-6 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><caption className="mb-3 text-left text-base font-semibold">Store availability</caption><thead className="border-y border-border text-xs uppercase text-muted-foreground"><tr><th className="py-3">Store</th><th>Availability</th><th>Price</th><th>Inventory</th><th>Sync</th></tr></thead><tbody className="divide-y divide-border">{[['Lulu Store', 'Active', '$149.99', '184 units'], ['Brand Store', 'Active', '$149.99', '67 units'], ['International Store', 'Draft', '£119.99', '33 units']].map(store => <tr key={store[0]}><td className="py-3"><StoreBadge store={store[0]} /></td><td>{status(store[1])}</td><td>{store[2]}</td><td>{store[3]}</td><td><span className="status healthy"><CircleCheck className="h-3.5 w-3.5" />Synced</span></td></tr>)}</tbody></table></div><button className="secondary-btn mt-4">Manage Store Availability</button></div>}</section>

      <div className="grid gap-7 xl:grid-cols-[1.35fr_1fr]"><section className="panel"><header className="flex items-center justify-between"><h2 className="section-title">Recent Product Activity</h2><button className="text-sm font-semibold text-foreground">View All Activity</button></header><div className="mt-4 divide-y divide-border">{activities.map(activity => <div key={`${activity[0]}-${activity[1]}`} className="flex gap-3 py-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-sm">{activity[5]}</span><div className="min-w-0 flex-1"><p className="text-sm"><strong>{activity[0]}</strong> <span className="text-muted-foreground">— {activity[1]}</span></p><p className="mt-1 text-xs text-muted-foreground">{activity[2]} · {activity[3]} · <StoreBadge store={activity[4]} /></p></div></div>)}</div></section><section className="panel"><header className="flex items-center justify-between"><h2 className="section-title">Product Operational Health</h2><span className="severity high">⚠ Attention Required</span></header><div className="mt-4 divide-y divide-border">{[['Data Quality', 'Attention Required', '43 products have missing or incomplete information'], ['Synchronization', 'Attention Required', '1 product sync failure in International Store'], ['Availability', 'Healthy', 'Products active and available across stores'], ['Inventory', 'Attention Required', '87 out of stock, 124 low stock'], ['Store Consistency', 'Healthy', 'Pricing and availability consistent across stores'], ['Variant Integrity', 'Healthy', 'No critical variant issues detected']].map(health => <div key={health[0]} className="flex items-start gap-3 py-3"><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${health[1] === 'Healthy' ? 'bg-primary' : 'bg-primary'}`} /><div><p className="text-sm font-semibold">{health[0]} <span className={health[1] === 'Healthy' ? 'text-foreground' : 'text-foreground'}>· {health[1]}</span></p><p className="mt-1 text-xs text-muted-foreground">{health[2]}</p></div></div>)}</div></section></div>

      <section className="ai-panel mt-7"><div className="flex items-start gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary"><Sparkles className="h-5 w-5" /></div><div className="flex-1"><h2 className="text-xl font-bold">Ask Lulu AI</h2><p className="mt-1 text-sm text-foreground">Turn product operations into your next clear action.</p><label className="mt-5 flex items-center gap-3 rounded-lg bg-card p-3 text-muted-foreground"><Bot className="h-5 w-5 text-muted-foreground" /><input className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Ask Lulu AI about your products..." /><button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Ask</button></label><div className="mt-4 flex flex-wrap gap-2">{['Improve this product description', 'Generate SEO metadata', 'Identify missing product info', 'Check product data quality', 'Find out of stock products', 'Compare products across stores'].map(prompt => <button key={prompt} className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-foreground hover:bg-secondary">{prompt}</button>)}</div><div className="mt-5 flex flex-wrap gap-2">{['Improve Product Description', 'Generate SEO Metadata', 'Generate Alt Text', 'Check Product Quality', 'Find Missing Information', 'Prepare for Publishing'].map(action => <button key={action} className="rounded-md bg-card px-3 py-2 text-xs font-semibold text-foreground">{action}</button>)}</div><p className="mt-4 text-xs text-foreground">AI suggestions require user review before saving. <span className="ai-badge">AI Generated</span></p></div></div></section>
    </div></div>

    {drawerOpen ? <aside className="fixed inset-y-0 right-0 z-30 flex w-full max-w-[430px] flex-col border-l border-border bg-card shadow-2xl" aria-label="Add Product panel"><header className="flex items-center justify-between border-b border-border px-6 py-5"><div><h2 className="text-xl font-bold">Add Product</h2><p className="mt-1 text-xs text-muted-foreground">Create a product across your connected stores</p></div><button aria-label="Close add product panel" onClick={() => setDrawerOpen(false)} className="icon-btn"><X className="h-4 w-4" /></button></header><nav className="flex gap-5 overflow-x-auto border-b border-border px-6" aria-label="Add product tabs">{['Basic Info', 'Media', 'Pricing', 'Inventory', 'Variants', 'Availability'].map((tab, index) => <button key={tab} className={`tab-btn whitespace-nowrap ${index === 0 ? 'active' : ''}`}>{tab}</button>)}</nav><form className="flex-1 space-y-5 overflow-y-auto px-6 py-6"><label className="form-label">Product Name<input className="form-input" placeholder="e.g. Premium Wireless Headphones" /></label><label className="form-label">Description<textarea className="form-input min-h-24 resize-none" placeholder="Describe your product..." /></label><button type="button" className="ai-create"><Sparkles className="h-4 w-4" />Create with AI ✨</button><p className="-mt-2 text-xs text-muted-foreground"><span className="ai-badge">AI Generated</span> Lulu AI can suggest title, description, tags, category, SEO metadata and alt text.</p><div className="grid gap-4 sm:grid-cols-2"><label className="form-label">Product Type<select className="form-input"><option>Physical product</option><option>Digital product</option></select></label><label className="form-label">Brand<input className="form-input" placeholder="Brand name" /></label></div><label className="form-label">Category<div className="form-input flex items-center"><Search className="mr-2 h-4 w-4 text-muted-foreground" /><input className="min-w-0 flex-1 outline-none" placeholder="Search categories" /></div><button type="button" className="mt-2 text-xs font-semibold text-foreground">Manage Categories</button></label><label className="form-label">Collections<div className="form-input flex flex-wrap gap-2"><span className="filter-pill">Summer 2025 <X className="h-3 w-3" /></span><span className="text-sm text-muted-foreground">Add collection…</span></div></label><label className="form-label">Tags<input className="form-input" placeholder="Add tags" /></label><fieldset><legend className="form-label">Store assignment</legend><div className="space-y-2 rounded-lg border border-border p-3">{['Lulu Store', 'Brand Store', 'International Store'].map(store => <label key={store} className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked />{store}</label>)}</div></fieldset></form><footer className="flex gap-3 border-t border-border p-5"><button className="secondary-btn flex-1 justify-center" onClick={() => setDrawerOpen(false)}>Cancel</button><button className="secondary-btn flex-1 justify-center">Save as Draft</button><button className="primary-btn flex-1 justify-center">Publish</button></footer></aside> : null}
  </main>;
}