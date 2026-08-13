import { useState } from 'react';
import { AlertCircle, AlertTriangle, ArrowUpDown, BarChart3, Bot, Check, CheckCircle2, ChevronDown, ChevronRight, ChevronUp, CircleHelp, Download, FileText, Filter, LayoutDashboard, Megaphone, MoreHorizontal, RefreshCw, RotateCcw, Search, Send, Settings, ShoppingBag, ShoppingCart, SlidersHorizontal, Sparkles, Target, TrendingUp, Users, X, XCircle } from 'lucide-react';
type Tone = 'blue' | 'amber' | 'violet' | 'emerald' | 'orange' | 'red' | 'gray';
type Status = 'Abandoned' | 'Active' | 'Converted';
interface CartRow {
  id: string;
  customer: string;
  store: string;
  platform: string;
  items: string;
  value: string;
  created: string;
  last: string;
  status: Status;
  recovery: string;
  tint?: boolean;
}
interface Opportunity {
  id: string;
  customer: string;
  store: string;
  platform: string;
  value: string;
  age: string;
  recovery: string;
}
interface Attention {
  id: string;
  issue: string;
  store: string;
  platform: string;
  severity: string;
  timestamp: string;
}
const navItems = [{
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  label: 'Sparkles AI',
  icon: Sparkles
}, {
  label: 'Users CRM',
  icon: Users
}, {
  label: 'Megaphone Marketing',
  icon: Megaphone
}, {
  label: 'TrendingUp Advertising',
  icon: TrendingUp
}, {
  label: 'ShoppingBag Ecommerce',
  icon: ShoppingBag,
  active: true
}, {
  label: 'BarChart3 Intelligence',
  icon: BarChart3
}, {
  label: 'FileText Reports',
  icon: FileText
}, {
  label: 'Settings',
  icon: Settings
}];
const opportunities: Opportunity[] = [{
  id: 'CRT-10282',
  customer: 'Sarah Johnson',
  store: 'Lulu Store',
  platform: 'Shopify',
  value: '349.00 EUR',
  age: '2 hours ago',
  recovery: 'Eligible'
}, {
  id: 'CRT-10271',
  customer: 'Michael Chen',
  store: 'Style and Co',
  platform: 'WooCommerce',
  value: '287.50 EUR',
  age: '4 hours ago',
  recovery: 'Eligible'
}, {
  id: 'CRT-10265',
  customer: 'Emma Wilson',
  store: 'Lulu Store',
  platform: 'Shopify',
  value: '224.00 EUR',
  age: '6 hours ago',
  recovery: 'Recovery Sent'
}, {
  id: 'CRT-10259',
  customer: 'Guest',
  store: 'Lulu Store',
  platform: 'Shopify',
  value: '198.00 EUR',
  age: '1 day ago',
  recovery: 'Eligible'
}, {
  id: 'CRT-10244',
  customer: 'Priya Patel',
  store: 'Style and Co',
  platform: 'WooCommerce',
  value: '176.50 EUR',
  age: '1 day ago',
  recovery: 'Recovery Pending'
}];
const attention: Attention[] = [{
  id: 'CRT-10301',
  issue: 'Recovery action failed - platform returned timeout',
  store: 'Lulu Store',
  platform: 'Shopify',
  severity: 'High',
  timestamp: '30 min ago'
}, {
  id: 'CRT-10288',
  issue: 'Missing customer information - guest checkout data unavailable',
  store: 'Style and Co',
  platform: 'WooCommerce',
  severity: 'Medium',
  timestamp: '1 hour ago'
}, {
  id: 'CRT-10275',
  issue: 'Cart synchronization failed - duplicate cart ID detected',
  store: 'Lulu Store',
  platform: 'Shopify',
  severity: 'Medium',
  timestamp: '2 hours ago'
}, {
  id: 'CRT-10264',
  issue: 'Product information incomplete - SKU not matched',
  store: 'Lulu Store',
  platform: 'Shopify',
  severity: 'Low',
  timestamp: '3 hours ago'
}];
const carts: CartRow[] = [{
  id: 'CRT-10302',
  customer: 'Sarah Johnson',
  store: 'Lulu Store',
  platform: 'Shopify',
  items: '3 items',
  value: '349.00 EUR',
  created: '10 Aug 14:20',
  last: '10 Aug 14:48',
  status: 'Abandoned',
  recovery: 'Eligible'
}, {
  id: 'CRT-10299',
  customer: 'James Miller',
  store: 'Style and Co',
  platform: 'WooCommerce',
  items: '1 item',
  value: '89.00 EUR',
  created: '10 Aug 13:15',
  last: '10 Aug 13:15',
  status: 'Active',
  recovery: 'Not Eligible'
}, {
  id: 'CRT-10295',
  customer: 'Michael Chen',
  store: 'Style and Co',
  platform: 'WooCommerce',
  items: '5 items',
  value: '287.50 EUR',
  created: '10 Aug 11:30',
  last: '10 Aug 12:45',
  status: 'Abandoned',
  recovery: 'Eligible',
  tint: true
}, {
  id: 'CRT-10290',
  customer: 'Emma Wilson',
  store: 'Lulu Store',
  platform: 'Shopify',
  items: '2 items',
  value: '224.00 EUR',
  created: '10 Aug 10:00',
  last: '10 Aug 10:22',
  status: 'Abandoned',
  recovery: 'Recovery Sent'
}, {
  id: 'CRT-10285',
  customer: 'Guest',
  store: 'Lulu Store',
  platform: 'Shopify',
  items: '4 items',
  value: '198.00 EUR',
  created: '9 Aug 18:30',
  last: '9 Aug 19:05',
  status: 'Abandoned',
  recovery: 'Eligible'
}, {
  id: 'CRT-10278',
  customer: 'Alex Torres',
  store: 'Lulu Store',
  platform: 'Shopify',
  items: '1 item',
  value: '45.00 EUR',
  created: '9 Aug 16:00',
  last: '9 Aug 16:00',
  status: 'Converted',
  recovery: 'Recovered'
}, {
  id: 'CRT-10271',
  customer: 'Priya Patel',
  store: 'Style and Co',
  platform: 'WooCommerce',
  items: '3 items',
  value: '176.50 EUR',
  created: '9 Aug 14:10',
  last: '9 Aug 15:30',
  status: 'Abandoned',
  recovery: 'Recovery Pending'
}, {
  id: 'CRT-10262',
  customer: 'David Lee',
  store: 'Lulu Store',
  platform: 'Shopify',
  items: '2 items',
  value: '312.00 EUR',
  created: '8 Aug 20:00',
  last: '8 Aug 20:15',
  status: 'Abandoned',
  recovery: 'Failed'
}];
const activity = [['violet', 'AI', 'Recovery message drafted for CRT-10282', '5 min ago'], ['amber', 'System', 'Cart CRT-10302 identified as abandoned by Lulu Store', '8 min ago'], ['blue', 'System', 'Recovery action sent for CRT-10290 via email', '22 min ago'], ['emerald', 'System', 'Cart CRT-10278 recovered - order placed', '1 hour ago'], ['red', 'System', 'Recovery action failed for CRT-10262 - platform timeout', '2 hours ago'], ['gray', 'System', 'Cart synchronization completed - 234 carts updated', '3 hours ago']];
const prompts = ['Why was this cart abandoned', 'Which carts need attention', 'Find high-value abandoned', 'Draft recovery message', 'Prioritize my carts', 'Which carts are eligible'];
const platformColor: Record<string, string> = {
  Shopify: 'bg-primary',
  WooCommerce: 'bg-primary',
  Webflow: 'bg-primary'
};
function Badge({
  children,
  tone = 'gray',
  icon
}: {
  children: string;
  tone?: Tone;
  icon?: boolean;
}) {
  const tones: Record<Tone, string> = {
    blue: 'bg-secondary text-foreground',
    amber: 'bg-secondary text-foreground',
    violet: 'bg-secondary text-foreground',
    emerald: 'bg-secondary text-foreground',
    orange: 'bg-secondary text-foreground',
    red: 'bg-chart-5/10 text-chart-5',
    gray: 'bg-secondary text-muted-foreground'
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{icon && tone === 'emerald' && <CheckCircle2 size={12} />} {icon && tone === 'violet' && <Target size={12} />}<span>{children}</span></span>;
}
function Platform({
  store,
  platform
}: {
  store: string;
  platform: string;
}) {
  return <span className="inline-flex items-center gap-2 whitespace-nowrap"><span className={`h-2 w-2 rounded-full ${platformColor[platform]}`} aria-hidden="true" /><span>{store}</span></span>;
}
function SectionTitle({
  children,
  count,
  tone = 'gray'
}: {
  children: string;
  count?: string;
  tone?: Tone;
}) {
  return <div className="mb-3 flex items-center gap-2"><h2 className="text-base font-bold text-foreground">{children}</h2>{count && <Badge tone={tone}>{count}</Badge>}<button className="ml-auto rounded p-1 text-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring" aria-label={`Collapse ${children}`}><ChevronUp size={16} /></button></div>;
}
export function LuluCartsPage() {
  const [search, setSearch] = useState('');
  const [storeOpen, setStoreOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [chat, setChat] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [draftState, setDraftState] = useState('draft');
  const shownCarts = carts.filter(cart => `${cart.id} ${cart.customer} ${cart.store}`.toLowerCase().includes(search.toLowerCase()));
  const toneForRecovery = (recovery: string): Tone => recovery === 'Eligible' ? 'violet' : recovery === 'Recovery Sent' || recovery === 'Recovered' ? 'blue' : recovery === 'Recovery Pending' ? 'amber' : recovery === 'Failed' ? 'red' : 'gray';
  const toneForStatus = (status: Status): Tone => status === 'Abandoned' ? 'amber' : status === 'Active' ? 'blue' : 'emerald';
  return <div className="min-h-screen bg-card text-foreground">
    <aside className="fixed inset-y-0 left-0 z-20 flex w-14 flex-col items-center bg-[var(--sidebar)] py-4 text-muted-foreground" aria-label="Primary navigation">
      <div className="mb-8 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">L</div>
      <nav className="flex flex-1 flex-col items-center gap-3">{navItems.map(({
          label,
          icon: Icon,
          active
        }) => <button key={label} title={label} aria-label={label} className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${active ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary hover:text-primary-foreground'}`}><Icon size={18} /></button>)}</nav>
      <button aria-label="Help and support" className="rounded-lg p-2 hover:bg-secondary hover:text-foreground"><CircleHelp size={18} /></button>
    </aside>
    <main className="ml-14 min-w-0 px-5 py-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><div><div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"><span>Ecommerce</span><ChevronRight size={14} /><span>Carts</span></div><h1 className="text-2xl font-bold tracking-tight">Carts and Abandoned Carts</h1><p className="mt-1 text-sm text-muted-foreground">Monitor shopping carts, abandoned carts and recovery activity across your ecommerce stores.</p></div><div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring"><Sparkles size={16} /><span>Ask Lulu AI</span></button><button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-card focus:outline-none focus:ring-2 focus:ring-ring"><RotateCcw size={16} /><span>Refresh</span></button><button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-card focus:outline-none focus:ring-2 focus:ring-ring"><Download size={16} /><span>Export</span></button><button aria-label="More page actions" className="rounded-lg border border-border p-2 text-foreground hover:bg-card focus:outline-none focus:ring-2 focus:ring-ring"><MoreHorizontal size={17} /></button></div></header>
      <section className="mb-5 flex flex-col gap-3" aria-label="Cart filters"><div className="flex flex-col gap-3 xl:flex-row xl:items-center"><div className="flex flex-wrap gap-3"><div className="relative"><button onClick={() => setStoreOpen(!storeOpen)} className="inline-flex min-w-48 items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm hover:bg-card focus:outline-none focus:ring-2 focus:ring-ring"><span className="flex items-center gap-2"><span className="flex -space-x-1"><i className="h-2 w-2 rounded-full border border-border bg-primary text-primary-foreground" /><i className="h-2 w-2 rounded-full border border-border bg-primary text-primary-foreground" /><i className="h-2 w-2 rounded-full border border-border bg-primary text-primary-foreground" /></span><span>All Stores</span></span><ChevronDown size={15} /></button>{storeOpen && <div className="absolute left-0 top-11 z-10 w-56 rounded-lg border border-border bg-card p-1 text-sm shadow-lg"><button className="flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-card"><Check size={14} className="text-foreground" /><span>All Stores</span></button><button className="flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-card"><i className="h-2 w-2 rounded-full bg-chart-4" /><span>Lulu Store</span><small className="ml-auto text-chart-4">Connected</small></button><button className="flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-card"><i className="h-2 w-2 rounded-full bg-primary text-primary-foreground" /><span>Style and Co</span><small className="ml-auto text-chart-4">Connected</small></button><button className="flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-card"><i className="h-2 w-2 rounded-full bg-primary text-primary-foreground" /><span>Webflow Shop</span><small className="ml-auto text-chart-1">Pending</small></button></div>}</div><div className="relative"><button onClick={() => setDateOpen(!dateOpen)} className="inline-flex min-w-40 items-center justify-between gap-4 rounded-lg border border-border px-3 py-2 text-sm hover:bg-card focus:outline-none focus:ring-2 focus:ring-ring"><span>Last 7 Days</span><ChevronDown size={15} /></button>{dateOpen && <div className="absolute left-0 top-11 z-10 w-44 rounded-lg border border-border bg-card p-1 text-sm shadow-lg">{['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Year to Date', 'Custom Range'].map(item => <button key={item} className="block w-full rounded px-3 py-2 text-left hover:bg-secondary">{item}</button>)}</div>}</div></div><div className="flex flex-1 items-center gap-2 xl:ml-auto xl:justify-end"><label className="relative w-full max-w-sm"><Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by cart ID, customer, product, SKU" className="h-9 w-full rounded-lg border border-border pl-9 pr-9 text-sm outline-none placeholder:text-muted-foreground focus:border-border focus:ring-2 focus:ring-ring" />{search && <button onClick={() => setSearch('')} aria-label="Clear search" className="absolute right-2 top-2 rounded text-foreground hover:text-foreground"><X size={15} /></button>}</label><button className="relative inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-card focus:outline-none focus:ring-2 focus:ring-ring"><SlidersHorizontal size={16} /><span>Filters</span><b className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">2</b></button></div></div><div className="flex items-center gap-2"><Badge tone="amber">Status: Abandoned ×</Badge><Badge tone="violet">Value: Over 100 EUR ×</Badge><button className="text-xs font-medium text-foreground hover:text-foreground">Clear all</button></div></section>
      <section className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{[['Active Carts', '847', 'Currently active', ShoppingCart, 'blue'], ['Abandoned Carts', '234', 'Identified by platform', ShoppingCart, 'amber'], ['Recovery Opportunities', '89', 'Eligible for recovery', Target, 'violet'], ['Recovered', '23', 'Last 7 days', CheckCircle2, 'emerald'], ['High-Value Abandoned', '31', 'Over 200 EUR', TrendingUp, 'orange'], ['Attention Required', '7', 'Operational review', AlertCircle, 'red']].map(([label, value, note, Icon, color]) => <article key={label as string} className={`rounded-lg border border-border border-l-4 bg-card p-4 shadow-sm ${color === 'blue' ? 'border-l-border' : color === 'amber' ? 'border-l-chart-1' : color === 'violet' ? 'border-l-border bg-secondary/30' : color === 'emerald' ? 'border-l-border' : color === 'orange' ? 'border-l-chart-1' : 'border-l-chart-5 bg-chart-5/30'}`}><div className="flex justify-between text-muted-foreground"><span className="text-sm font-medium text-muted-foreground">{label as string}</span><Icon size={18} /></div><strong className="mt-3 block text-3xl font-bold tracking-tight">{value as string}</strong><span className="text-xs text-muted-foreground">{note as string}</span></article>)}</section>
      <section className="mb-5 rounded-lg border border-border border-t-2 border-t-border bg-card p-4 shadow-sm"><div className="flex items-center gap-2"><Sparkles size={18} className="text-foreground" /><h2 className="text-base font-bold">AI Recovery Opportunities</h2><span className="rounded border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-foreground">AI Generated</span><button aria-label="Collapse AI Recovery Opportunities" className="ml-auto text-foreground"><ChevronUp size={16} /></button></div><p className="mt-2 text-sm text-muted-foreground">Lulu AI identified 12 abandoned carts that may warrant review based on available cart value, recency and recovery eligibility.</p><p className="mt-1 text-xs italic text-muted-foreground">AI-generated prioritization based on observed cart data. Not a guaranteed conversion prediction.</p><div className="mt-3 overflow-x-auto rounded-lg border border-border"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-card text-xs uppercase tracking-wide text-muted-foreground"><tr>{['Cart', 'Customer', 'Store', 'Value', 'Age', 'Recovery Status', 'Actions'].map(head => <th key={head} scope="col" className="px-3 py-2.5 font-semibold">{head}</th>)}</tr></thead><tbody>{opportunities.map(row => <tr key={row.id} className="border-t border-border transition-colors hover:bg-card"><td className="px-3 py-2.5 font-semibold">{row.id}</td><td className="px-3 py-2.5">{row.customer === 'Guest' ? <em className="text-muted-foreground">Guest</em> : row.customer}</td><td className="px-3 py-2.5"><Platform store={row.store} platform={row.platform} /></td><td className="px-3 py-2.5 font-medium">{row.value}</td><td className="whitespace-nowrap px-3 py-2.5 text-muted-foreground">{row.age}</td><td className="px-3 py-2.5"><Badge tone={toneForRecovery(row.recovery)} icon={row.recovery === 'Eligible'}>{row.recovery}</Badge></td><td className="px-3 py-2.5"><div className="flex items-center gap-1"><button className="rounded border border-border px-2 py-1 text-xs font-medium text-foreground hover:bg-secondary">{row.recovery === 'Eligible' ? 'Recover' : 'View'}</button><button className="rounded px-2 py-1 text-xs text-foreground hover:bg-secondary">{row.recovery === 'Recovery Sent' ? 'View Activity' : 'View'}</button><button className="rounded px-2 py-1 text-xs text-foreground hover:bg-secondary">Ask AI</button></div></td></tr>)}</tbody></table></div><a href="var(--muted)ndoned" className="mt-2 inline-block text-sm font-medium text-foreground hover:underline">View All Recovery Opportunities</a></section>
      <section className="mb-5"><SectionTitle count="7" tone="red">Carts Requiring Attention</SectionTitle><div className="overflow-x-auto rounded-lg border border-border"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-card/80 text-xs uppercase tracking-wide text-muted-foreground"><tr>{['Cart', 'Issue', 'Store', 'Severity', 'Timestamp', 'Actions'].map(head => <th key={head} scope="col" className="px-3 py-2.5 font-semibold">{head}</th>)}</tr></thead><tbody>{attention.map(row => <tr key={row.id} className="border-t border-border hover:bg-card"><td className="px-3 py-3 font-semibold">{row.id}</td><td className="px-3 py-3 text-muted-foreground">{row.issue}</td><td className="px-3 py-3"><Platform store={row.store} platform={row.platform} /></td><td className="px-3 py-3"><Badge tone={row.severity === 'High' ? 'orange' : row.severity === 'Medium' ? 'amber' : 'gray'}>{row.severity}</Badge></td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{row.timestamp}</td><td className="px-3 py-3"><button className="rounded border border-border px-2 py-1 text-xs font-medium hover:bg-card">Review</button><button className="px-2 py-1 text-xs text-foreground hover:underline">Open</button><button className="px-2 py-1 text-xs text-foreground hover:underline">Ask AI</button></td></tr>)}</tbody></table></div></section>
      <section className="mb-5"><div className="mb-3 flex items-center gap-2"><h2 className="text-base font-bold">Carts</h2><span className="text-sm text-muted-foreground">1,081</span><div className="ml-auto flex rounded-lg border border-border p-0.5"><button className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium">Table</button><button className="px-2.5 py-1 text-xs text-foreground">Cards</button></div></div><div className="overflow-x-auto rounded-lg border border-border"><table className="w-full min-w-[1200px] text-left text-sm"><thead className="bg-secondary/80 text-xs uppercase tracking-wide text-muted-foreground"><tr><th scope="col" className="w-9 px-3 py-2.5"><input type="checkbox" aria-label="Select all carts" /></th>{['Cart', 'Customer', 'Store', 'Items', 'Cart Value', 'Created', 'Last Activity', 'Status', 'Recovery', 'Actions'].map(head => <th key={head} scope="col" className="px-3 py-2.5 font-semibold"><span className="inline-flex items-center gap-1">{head}{head !== 'Actions' && <ArrowUpDown size={12} />}</span></th>)}</tr></thead><tbody>{shownCarts.map(row => <tr key={row.id} className={`border-t border-border transition-colors hover:bg-secondary ${row.tint ? 'bg-secondary/20' : ''}`}><td className="px-3 py-3"><input type="checkbox" aria-label={`Select ${row.id}`} /></td><td className="px-3 py-3 font-semibold">{row.id}</td><td className="px-3 py-3">{row.customer === 'Guest' ? <em className="text-muted-foreground">Guest</em> : row.customer}</td><td className="px-3 py-3"><Platform store={row.store} platform={row.platform} /></td><td className="px-3 py-3 text-muted-foreground">{row.items}</td><td className="px-3 py-3 font-medium">{row.value}</td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{row.created}</td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{row.last}</td><td className="px-3 py-3"><Badge tone={toneForStatus(row.status)}>{row.status}</Badge></td><td className="px-3 py-3"><Badge tone={toneForRecovery(row.recovery)} icon={row.recovery === 'Eligible' || row.recovery === 'Recovered'}>{row.recovery}</Badge></td><td className="px-3 py-3"><div className="flex items-center gap-1 whitespace-nowrap"><button className="rounded border border-border px-2 py-1 text-xs hover:bg-card">Open</button>{row.recovery === 'Eligible' && <button className="rounded px-2 py-1 text-xs text-foreground hover:bg-secondary">Recover</button>}<button className="rounded px-2 py-1 text-xs text-foreground hover:bg-secondary">Ask AI</button><button aria-label={`More actions for ${row.id}`} className="rounded p-1 text-foreground hover:bg-secondary"><MoreHorizontal size={15} /></button></div></td></tr>)}</tbody></table></div><div className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs text-muted-foreground"><span>Showing 1-25 of 1,081 carts</span><div className="flex items-center gap-1"><button className="rounded border border-border px-2 py-1">Prev</button><button className="rounded bg-primary px-2.5 py-1 text-primary-foreground">1</button><button className="rounded border border-border px-2 py-1">2</button><button className="rounded border border-border px-2 py-1">3</button><span className="px-1">...</span><button className="rounded border border-border px-2 py-1">44</button><button className="rounded border border-border px-2 py-1">Next</button></div><span>Per page <strong className="ml-1 text-foreground">25</strong></span></div></section>
      <section id="abandoned" className="mb-5"><div className="flex items-center gap-2"><h2 className="text-base font-bold">Abandoned Carts</h2><Badge tone="amber">234</Badge><a href="var(--muted-foreground)ndoned" className="ml-auto text-sm font-medium text-foreground hover:underline">View All</a></div><p className="mt-1 text-sm text-muted-foreground">Carts identified as abandoned by connected platforms. Recovery eligibility depends on available platform support.</p><div className="mt-3 grid gap-3 lg:grid-cols-3">{[{
            title: 'High Value + Eligible',
            tone: 'violet',
            entries: [['CRT-10302', 'Sarah J', '349.00 EUR', '2hrs ago', 'Eligible'], ['CRT-10295', 'Michael C', '287.50 EUR', '4hrs ago', 'Eligible'], ['CRT-10285', 'Guest', '198.00 EUR', '1 day ago', 'Eligible']],
            link: 'View all 31 high-value'
          }, {
            title: 'Recovery Sent',
            tone: 'blue',
            entries: [['CRT-10290', 'Emma W', '224.00 EUR', 'Sent 2hrs ago', 'Recovery Sent'], ['CRT-10271', 'Priya P', '176.50 EUR', 'Sent 4hrs ago', 'Recovery Pending']],
            link: 'View all 23'
          }, {
            title: 'Older Abandoned',
            tone: 'gray',
            entries: [['CRT-10244', 'Guest', '92.00 EUR', '3 days ago', 'Not Eligible'], ['CRT-10238', 'Guest', '67.00 EUR', '4 days ago', 'Unknown']],
            link: 'View all 180'
          }].map(group => <article key={group.title} className={`rounded-lg border border-border border-l-4 ${group.tone === 'violet' ? 'border-l-border' : group.tone === 'blue' ? 'border-l-border' : 'border-l-border'} bg-card p-3`}><h3 className="mb-2 text-sm font-semibold">{group.title}</h3><div className="space-y-2">{group.entries.map(entry => <div key={entry[0]} className="flex items-center gap-2 rounded-md bg-card px-2 py-2 text-xs"><strong>{entry[0]}</strong><span className="min-w-0 flex-1 truncate text-muted-foreground">{entry[1]}</span><span className="font-medium">{entry[2]}</span><span className="text-muted-foreground">{entry[3]}</span><Badge tone={entry[4] === 'Eligible' ? 'violet' : entry[4] === 'Recovery Sent' ? 'blue' : entry[4] === 'Recovery Pending' ? 'amber' : 'gray'}>{entry[4]}</Badge>{entry[4] === 'Eligible' && <button className="rounded bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground hover:bg-primary">Recover</button>}</div>)}</div><a href="var(--muted)ndoned" className="mt-3 inline-block text-xs font-medium text-foreground hover:underline">{group.link}</a></article>)}</div></section>
      <section className="grid gap-4 xl:grid-cols-3"><article className="rounded-lg border border-border border-l-4 border-l-border bg-card p-4"><div className="flex items-center gap-2 text-foreground"><Sparkles size={17} /><h3 className="font-bold">Ask Lulu AI</h3><button aria-label="Collapse AI assistant" className="ml-auto text-foreground"><ChevronDown size={16} /></button></div><span className="text-xs text-muted-foreground">Powered by Lulu AI</span>{draftState === 'draft' ? <div className="mt-3 rounded-lg border border-border bg-secondary p-3"><div className="flex items-start gap-2"><Sparkles size={15} className="mt-0.5 text-foreground" /><strong className="text-sm">AI Suggested Recovery Message</strong><span className="ml-auto whitespace-nowrap rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-foreground">AI Generated - Not Sent</span></div><p className="mt-2 text-xs text-muted-foreground">CRT-10282 · Sarah Johnson · 349.00 EUR · 3 items</p><hr className="my-2 border-border" /><p className="rounded border border-border bg-card p-2 text-sm italic text-foreground">Hi Sarah, you left some great items in your cart. Your Premium Hoodie and 2 other items are still waiting for you. Complete your order today.</p><p className="mt-1 text-xs italic text-muted-foreground">AI Generated - Not Sent</p><div className="mt-3 flex flex-wrap gap-1"><button className="rounded px-2 py-1 text-xs text-foreground hover:bg-card">Regenerate</button><button className="rounded border border-border px-2 py-1 text-xs hover:bg-card">Edit</button><button onClick={() => setDraftState('approved')} className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary">Approve</button><button onClick={() => setDraftState('discarded')} className="rounded px-2 py-1 text-xs text-foreground hover:bg-card">Discard</button></div></div> : <div className="mt-3 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">{draftState === 'approved' ? 'Draft approved for review. It has not been sent.' : 'Draft discarded. Ask Lulu AI for another recovery message.'}</div>}<div className="mt-3 flex gap-2 overflow-x-auto pb-1">{prompts.map(prompt => <button key={prompt} onClick={() => setSelectedPrompt(prompt)} className="whitespace-nowrap rounded-full border border-border px-2.5 py-1 text-xs text-foreground hover:border-border hover:text-foreground">{prompt}</button>)}</div><form onSubmit={event => event.preventDefault()} className="mt-3 flex items-center gap-2 rounded-lg border border-border px-3 py-1"><input value={chat || selectedPrompt} onChange={event => {
              setChat(event.target.value);
              setSelectedPrompt('');
            }} placeholder="Ask Lulu AI how to recover this cart..." className="min-w-0 flex-1 bg-transparent py-1.5 text-sm outline-none" aria-label="Ask Lulu AI" /><button aria-label="Send question" className="text-foreground hover:text-foreground"><Send size={16} /></button></form></article>
      <article className="rounded-lg border border-border bg-card p-4"><h3 className="font-bold">Cart Operations Health</h3><div className="mt-3 grid grid-cols-2 gap-3 text-sm">{[['emerald', 'Cart Synchronization', 'Healthy'], ['emerald', 'Abandoned Cart Detection', 'Healthy'], ['amber', 'Recovery Availability', 'Attention Required'], ['emerald', 'Recovery Processing', 'Healthy'], ['red', 'Platform Connectivity', 'Critical · Webflow Shop'], ['amber', 'Data Completeness', 'Attention Required']].map(([color, label, state]) => <div key={label} className="flex items-start gap-2"><span className={`${color === 'emerald' ? 'text-chart-4' : color === 'amber' ? 'text-chart-1' : 'text-chart-5'}`}>{color === 'emerald' ? <CheckCircle2 size={16} /> : color === 'amber' ? <AlertTriangle size={16} /> : <AlertCircle size={16} />}</span><span><strong className="block text-xs font-medium">{label}</strong><small className={`${color === 'emerald' ? 'text-foreground' : color === 'amber' ? 'text-chart-1' : 'text-chart-5'}`}>{state}</small></span></div>)}</div><hr className="my-4 border-border" /><h3 className="text-sm font-bold">Cart Synchronization</h3><div className="mt-2 space-y-2 text-xs">{[['Lulu Store', 'Shopify', '1 min ago', '12 new carts', true], ['Style and Co', 'WooCommerce', '4 min ago', '8 new carts', true], ['Webflow Shop', 'Webflow', '3 hours ago', '-', false]].map(([store, platform, time, count, synced]) => <div key={store as string} className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${platformColor[platform as string]}`} /><span className="font-medium">{store as string}</span><span className="text-muted-foreground">{platform as string}</span><span className={`ml-auto ${synced ? 'text-foreground' : 'text-chart-5'}`}>{synced ? '✓ Synced' : '× Failed'}</span><span className="text-muted-foreground">{time as string}</span><span className="hidden text-muted-foreground sm:inline">{count as string}</span></div>)}</div><a href="#integrations" className="mt-3 inline-flex items-center gap-1 text-sm text-foreground hover:text-foreground">Open Integrations <ChevronRight size={14} /></a></article>
      <article className="rounded-lg border border-border bg-card p-4"><h3 className="font-bold">Recent Cart Activity</h3><ol className="mt-3 space-y-3">{activity.map(([color, type, text, time]) => <li key={text} className="flex gap-2"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${color === 'violet' ? 'bg-primary' : color === 'amber' ? 'bg-chart-1' : color === 'blue' ? 'bg-primary' : color === 'emerald' ? 'bg-primary' : color === 'red' ? 'bg-destructive' : 'bg-muted'}`} /><div className="min-w-0 flex-1"><p className="text-sm leading-5">{text}</p><div className="mt-0.5 flex items-center gap-2"><span className={`rounded px-1.5 py-0.5 text-[10px] ${type === 'AI' ? 'bg-secondary text-foreground' : 'bg-secondary text-muted-foreground'}`}>{type}</span><span className="text-xs text-muted-foreground">{time}</span></div></div></li>)}</ol><a href="#activity" className="mt-3 inline-block text-sm text-foreground hover:text-foreground">View All Activity</a></article></section>
    </main>
  </div>;
}