import { useMemo, useState } from 'react';
import { AlertCircle, AlertTriangle, ArrowUpDown, Ban, CheckCircle2, ChevronDown, ChevronRight, ChevronUp, Clock, Download, ExternalLink, Eye, Filter, MoreHorizontal, PauseCircle, Plus, RefreshCcw, Search, Send, Settings, SlidersHorizontal, Sparkles, X, XCircle, LayoutDashboard, Bot, Users, Megaphone, BarChart3, FileText, ShoppingBag, Pencil, Play, RotateCcw } from 'lucide-react';
const navItems = [{
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  label: 'AI Assistant',
  icon: Bot
}, {
  label: 'CRM',
  icon: Users
}, {
  label: 'Marketing',
  icon: Megaphone
}, {
  label: 'Advertising',
  icon: BarChart3
}, {
  label: 'Ecommerce',
  icon: ShoppingBag
}, {
  label: 'Intelligence',
  icon: Sparkles
}, {
  label: 'Reports',
  icon: FileText
}, {
  label: 'Settings',
  icon: Settings
}];
const stores = [{
  name: 'All Stores',
  platform: '',
  color: ''
}, {
  name: 'Lulu Store',
  platform: 'Shopify Connected',
  color: 'bg-chart-4'
}, {
  name: 'Style and Co',
  platform: 'WooCommerce Connected',
  color: 'bg-primary'
}, {
  name: 'Webflow Shop',
  platform: 'Webflow Pending',
  color: 'bg-primary'
}];
const attentionRows = [['FLASH50', 'Summer Flash Sale', 'Lulu Store', 'Shopify', 'Activation failure - platform returned error 422', 'Critical', 'Failed', '2 hours ago'], ['NEWCUST15', 'New Customer Welcome', 'Style and Co', 'WooCommerce', 'Duplicate discount code detected on platform', 'High', 'Draft', '5 hours ago'], ['FREESHIP', 'Free Shipping Summer', 'Lulu Store', 'Shopify', 'Usage limit reached - 500 of 500 used', 'Medium', 'Usage Limit Reached', '1 day ago'], ['WINTER30', '', 'Webflow Shop', 'Webflow', 'Synchronization delayed - platform not responding', 'High', 'Delayed', '3 hours ago']];
const discounts = [{
  name: 'Summer Promotion',
  code: 'SUMMER20',
  store: 'Lulu Store',
  platform: 'Shopify',
  type: 'Percentage',
  value: '20%',
  applies: 'Entire Store',
  start: '01 Aug',
  end: '31 Aug',
  usage: '142/500',
  pct: 28,
  status: 'Active'
}, {
  name: 'New Customer Welcome',
  code: 'NEWCUST15',
  store: 'Style and Co',
  platform: 'WooCommerce',
  type: 'Percentage',
  value: '15%',
  applies: 'First-time customers',
  start: '15 Jul',
  end: 'No expiry',
  usage: '89/Unlimited',
  pct: 0,
  status: 'Active'
}, {
  name: 'Free Shipping Summer',
  code: 'FREESHIP',
  store: 'Lulu Store',
  platform: 'Shopify',
  type: 'Free Shipping',
  value: 'Free',
  applies: 'Orders over 50 EUR',
  start: '01 Aug',
  end: '31 Aug',
  usage: '500/500',
  pct: 100,
  status: 'Usage Limit Reached'
}, {
  name: 'Black Friday Teaser',
  code: 'BF2024',
  store: 'Lulu Store',
  platform: 'Shopify',
  type: 'Percentage',
  value: '30%',
  applies: 'Entire Store',
  start: '25 Nov',
  end: '30 Nov',
  usage: '0/1000',
  pct: 0,
  status: 'Scheduled'
}, {
  name: 'Loyal Customer Reward',
  code: 'LOYAL10',
  store: 'Style and Co',
  platform: 'WooCommerce',
  type: 'Fixed Amount',
  value: '10 EUR',
  applies: 'Loyalty segment',
  start: '01 Jul',
  end: '31 Dec',
  usage: '234/Unlimited',
  pct: 0,
  status: 'Active'
}, {
  name: 'End of Season Sale',
  code: 'SEASON25',
  store: 'Lulu Store',
  platform: 'Shopify',
  type: 'Percentage',
  value: '25%',
  applies: 'Collections: Sale',
  start: '01 Aug',
  end: '10 Aug',
  usage: '78/200',
  pct: 78,
  status: 'Expiring Soon'
}, {
  name: 'Buy 2 Get 1 Free',
  code: 'B2G1',
  store: 'Lulu Store',
  platform: 'Shopify',
  type: 'Buy X Get Y',
  value: 'B2G1',
  applies: 'Selected products',
  start: '05 Aug',
  end: '20 Aug',
  usage: '45/300',
  pct: 15,
  status: 'Active'
}, {
  name: 'Flash Sale 50pct Off',
  code: 'FLASH50',
  store: 'Lulu Store',
  platform: 'Shopify',
  type: 'Percentage',
  value: '50%',
  applies: 'Selected products',
  start: '12 Aug',
  end: '12 Aug',
  usage: '0/100',
  pct: 0,
  status: 'Failed'
}];
const expiring = [['SEASON25', 'End of Season Sale', 'Lulu Store', 'Expires in 1 day', '78/200 used', 'Extend'], ['SUMMERSALE', 'Summer Flash', 'Lulu Store', 'Expires in 3 days', '142/500 used', 'Edit'], ['B2G1', 'Buy 2 Get 1', 'Lulu Store', 'Expires in 8 days', '45/300', 'Edit'], ['WELCOME', 'Welcome Discount', 'Style and Co', 'Expires in 12 days', '234/Unlimited', 'Edit'], ['LOYAL', 'Loyalty Reward', 'Style and Co', 'Expires in 14 days', '89/200', 'Edit']];
const prompts = ['Which discounts are active', 'Which expire soon', 'Find usage limit issues', 'Find duplicate codes', 'Create a new discount', 'Show unused discounts', 'Summarize today activity'];
const health = [['Discount Synchronization', 'Healthy', 'check'], ['Active Discount Validity', 'Attention Required', 'warn'], ['Configuration Integrity', 'Healthy', 'check'], ['Platform Connectivity', 'Critical · Webflow', 'bad'], ['Usage Data', 'Healthy', 'check'], ['Expiration Monitoring', 'Attention Required', 'warn']];
function PlatformDot({
  platform
}: {
  platform: string;
}) {
  const color = platform === 'Shopify' ? 'bg-chart-4' : platform === 'WooCommerce' ? 'bg-primary' : 'bg-primary';
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${color}`} aria-label={platform} />;
}
function StatusBadge({
  status
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    Active: 'bg-chart-4/10 text-chart-4',
    Scheduled: 'bg-secondary text-foreground',
    Failed: 'bg-chart-5/10 text-chart-5',
    'Usage Limit Reached': 'bg-chart-1/10 text-chart-1',
    'Expiring Soon': 'bg-chart-1/10 text-chart-1',
    Draft: 'bg-chart-1/10 text-chart-1 border border-chart-1/30',
    Delayed: 'bg-chart-1/10 text-chart-1'
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${styles[status] || 'bg-secondary text-muted-foreground'}`}>{status === 'Expiring Soon' && <Clock size={11} />}{status}</span>;
}
function Usage({
  usage,
  pct
}: {
  usage: string;
  pct: number;
}) {
  const fill = pct >= 90 ? 'bg-destructive' : pct >= 75 ? 'bg-chart-1' : 'bg-primary';
  return <div className="min-w-[92px]"><div className="h-1.5 w-full rounded-full bg-sidebar"><div className={`h-1.5 rounded-full ${fill}`} style={{
        width: `${pct}%`
      }} /></div><span className="mt-1 block text-xs text-muted-foreground">{usage}</span></div>;
}
function Sidebar() {
  return <aside className="fixed inset-y-0 left-0 z-20 flex w-14 flex-col items-center bg-[var(--sidebar)] py-4 text-muted-foreground"><div className="mb-7 flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">L</div><LuluSectionNavigation activeId="sharply-sky-4161" /><div className="h-8 w-8 rounded-full bg-sidebar text-center text-xs leading-8 text-foreground">JD</div></aside>;
}
export function DiscountsPromotions() {
  const [query, setQuery] = useState('');
  const [store, setStore] = useState('All Stores');
  const [attentionOpen, setAttentionOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState(true);
  const [aiMessage, setAiMessage] = useState('');
  const [view, setView] = useState<'table' | 'cards'>('table');
  const visibleDiscounts = useMemo(() => discounts.filter(d => `${d.name} ${d.code} ${d.store}`.toLowerCase().includes(query.toLowerCase()) && (store === 'All Stores' || d.store === store)), [query, store]);
  return <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans"><Sidebar /><main className="ml-14 min-h-screen px-5 py-6 lg:px-8"><header className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end"><div><nav className="mb-3 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><span>Ecommerce</span><ChevronRight size={14} /><span>Discounts and Promotions</span></nav><h1 className="text-2xl font-bold tracking-tight">Discounts and Promotions</h1><p className="mt-1 text-sm text-muted-foreground">Create and manage discounts and promotional offers across your ecommerce stores.</p></div><div className="flex flex-wrap items-center gap-2"><button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Plus size={16} />Create Discount</button><button className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3.5 py-2 text-sm font-medium text-foreground hover:bg-secondary focus-visible:ring-2"><Sparkles size={16} />Ask Lulu AI</button><button aria-label="Refresh" className="rounded-lg border border-border bg-card p-2 text-foreground hover:bg-card"><RotateCcw size={16} /></button><button aria-label="Export" className="rounded-lg border border-border bg-card p-2 text-foreground hover:bg-card"><Download size={16} /></button><button aria-label="More options" className="rounded-lg border border-border bg-card p-2 text-foreground hover:bg-secondary"><MoreHorizontal size={16} /></button></div></header>
      <section aria-label="Discount filters" className="mb-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-center"><div className="flex flex-wrap gap-3"><select value={store} onChange={e => setStore(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">{stores.map(s => <option key={s.name}>{s.name}{s.platform ? ` · ${s.platform}` : ''}</option>)}</select><select className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"><option>Last 30 Days</option><option>Today</option><option>Last 7 Days</option><option>Last 90 Days</option><option>Custom Range</option></select></div><div className="flex gap-2 lg:ml-auto"><label className="relative"><Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search discounts codes promotions" className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring lg:w-72" />{query && <button onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-2 top-2 text-foreground"><X size={16} /></button>}</label><button className="relative inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-card"><SlidersHorizontal size={16} />Filters{activeFilter && <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">1</span>}</button></div></div><div className="mt-2 flex gap-2">{activeFilter && <button onClick={() => setActiveFilter(false)} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground">Status: Active <X size={13} /></button>}{activeFilter && <button onClick={() => setActiveFilter(false)} className="px-1 text-xs font-medium text-foreground hover:underline">Clear all filters</button>}</div></section>
      <section className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-6">{[['Active Discounts', '24', 'Currently active', CheckCircle2, 'border-chart-4'], ['Scheduled', '7', 'Future activation', Clock, 'border-border'], ['Expiring Soon', '5', 'Within 7 days', AlertTriangle, 'border-chart-1'], ['Usage Limit Reached', '3', 'Limit exhausted', Ban, 'border-chart-1'], ['Inactive', '12', 'Paused or expired', PauseCircle, 'border-border'], ['Attention Required', '4', 'Action needed', AlertCircle, 'border-chart-5']].map(([label, num, desc, Icon, border]) => <article key={String(label)} className={`rounded-lg border border-border border-l-4 ${border} bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,.03)] ${label === 'Attention Required' ? 'bg-chart-5/50' : ''}`}><div className="flex justify-between"><span className="text-sm font-medium text-muted-foreground">{String(label)}</span><Icon size={18} className="text-muted-foreground" /></div><strong className="mt-2 block text-3xl font-bold">{String(num)}</strong><p className="mt-1 text-xs text-muted-foreground">{String(desc)}</p></article>)}</section>
      <section className="mb-6"><div className="mb-3 flex items-center gap-2"><h2 className="text-lg font-semibold">Discounts Requiring Attention</h2><span className="rounded-full bg-chart-5/10 px-2 py-0.5 text-xs font-semibold text-chart-5">4</span><button onClick={() => setAttentionOpen(!attentionOpen)} aria-label="Collapse attention section" className="ml-1 rounded p-1 text-muted-foreground hover:bg-secondary">{attentionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button></div>{attentionOpen && <div className="overflow-x-auto rounded-lg border border-border bg-card"><table className="w-full min-w-[1000px] text-left text-sm"><thead className="bg-card/80 text-[11px] uppercase tracking-wide text-muted-foreground"><tr>{['Discount', 'Store', 'Issue', 'Severity', 'Status', 'Timestamp', 'Actions'].map(h => <th scope="col" key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{attentionRows.map(row => <tr key={row[0]} className="hover:bg-card"><td className="px-4 py-3"><span className="font-mono font-semibold">{row[0]}</span><span className="block text-xs text-muted-foreground">{row[1]}</span></td><td className="px-4 py-3"><span className="inline-flex items-center gap-1.5"> <PlatformDot platform={row[3]} />{row[2]}</span><span className="block text-[11px] text-muted-foreground">{row[3]}</span></td><td className="max-w-[270px] px-4 py-3 text-muted-foreground">{row[4]}</td><td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs ${row[5] === 'Critical' ? 'bg-chart-5/10 text-chart-5' : row[5] === 'High' ? 'bg-secondary text-foreground' : 'bg-secondary text-foreground'}`}>{row[5]}</span></td><td className="px-4 py-3"><StatusBadge status={row[6]} /></td><td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">{row[7]}</td><td className="px-4 py-3"><div className="flex gap-1.5"><button className="rounded border border-border px-2 py-1 text-xs hover:bg-card">Review</button><button className="rounded px-2 py-1 text-xs text-foreground hover:bg-secondary">{row[0] === 'WINTER30' ? 'Retry Sync' : 'Edit'}</button><button className="rounded bg-secondary px-2 py-1 text-xs text-foreground hover:bg-secondary"><Sparkles size={12} className="mr-1 inline" />Ask AI</button></div></td></tr>)}</tbody></table></div>}</section>
      <section className="mb-6"><div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><h2 className="text-lg font-semibold">Discounts</h2><span className="text-sm text-muted-foreground">46</span></div><div className="flex rounded-lg border border-border bg-card p-0.5 text-xs"><button onClick={() => setView('table')} className={`rounded-md px-3 py-1.5 ${view === 'table' ? 'bg-secondary font-medium' : 'text-foreground'}`}>Table</button><button onClick={() => setView('cards')} className={`rounded-md px-3 py-1.5 ${view === 'cards' ? 'bg-secondary font-medium' : 'text-foreground'}`}>Cards</button></div></div>{view === 'table' ? <div className="overflow-x-auto rounded-lg border border-border bg-card"><table className="w-full min-w-[1250px] text-left text-sm"><thead className="bg-card/80 text-[11px] uppercase tracking-wide text-muted-foreground"><tr>{['', 'Discount', 'Code', 'Store', 'Type', 'Value', 'Applies To', 'Start', 'End', 'Usage', 'Status', 'Actions'].map((h, i) => <th scope="col" key={h || 'check'} className="px-3 py-3 font-semibold">{i === 0 ? <input type="checkbox" aria-label="Select all discounts" /> : <span className="inline-flex items-center gap-1">{h}<ArrowUpDown size={12} /></span>}</th>)}</tr></thead><tbody className="divide-y divide-border">{visibleDiscounts.map(d => <tr key={d.code} className={`${d.status === 'Expiring Soon' ? 'bg-chart-1/70' : ''} hover:bg-secondary`}><td className="px-3 py-3"><input type="checkbox" defaultChecked={d.code === 'SUMMER20'} aria-label={`Select ${d.code}`} /></td><td className="whitespace-nowrap px-3 py-3 font-medium">{d.name}</td><td className="px-3 py-3"><code className="rounded border border-border bg-secondary px-1.5 py-1 font-mono text-xs text-foreground">{d.code}</code></td><td className="whitespace-nowrap px-3 py-3"><span className="inline-flex items-center gap-1.5"><PlatformDot platform={d.platform} />{d.store}</span></td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{d.type}</td><td className="px-3 py-3 font-medium">{d.value}</td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{d.applies}</td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{d.start}</td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{d.end}</td><td className="px-3 py-3"><Usage usage={d.usage} pct={d.pct} /></td><td className="px-3 py-3"><StatusBadge status={d.status} /></td><td className="px-3 py-3"><div className="flex items-center gap-1 text-xs"><button className="rounded border border-border px-2 py-1 hover:bg-card">{d.status === 'Failed' ? 'Review' : 'Open'}</button><button aria-label={`Edit ${d.code}`} className="rounded p-1.5 text-foreground hover:bg-secondary"><Pencil size={14} /></button>{d.status !== 'Usage Limit Reached' && d.status !== 'Failed' && <button aria-label={`Pause ${d.code}`} className="rounded p-1.5 text-foreground hover:bg-secondary"><PauseCircle size={14} /></button>}<button aria-label={`More actions for ${d.code}`} className="rounded p-1.5 text-foreground hover:bg-secondary"><MoreHorizontal size={14} /></button></div></td></tr>)}</tbody></table></div> : <div className="grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2 xl:grid-cols-4">{visibleDiscounts.map(d => <article key={d.code} className="rounded-lg border border-border p-4"><div className="flex justify-between"><strong>{d.name}</strong><StatusBadge status={d.status} /></div><code className="mt-2 inline-block rounded bg-secondary px-1.5 py-1 font-mono text-xs">{d.code}</code><p className="mt-3 text-sm text-muted-foreground">{d.store} · {d.type}</p><p className="mt-1 text-sm font-medium">{d.value} · {d.usage}</p></article>)}</div>}<div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-3 text-sm text-muted-foreground sm:flex-row"><span>Showing 1-{visibleDiscounts.length || 0} of 46 discounts</span><div className="flex gap-1"><button className="rounded border border-border bg-card px-3 py-1.5">Prev</button><button className="rounded bg-primary px-3 py-1.5 text-primary-foreground">1</button><button className="rounded border border-border bg-card px-3 py-1.5">2</button><button className="rounded border border-border bg-card px-3 py-1.5">Next</button></div><span>Per page <button className="ml-1 rounded border border-border bg-card px-2 py-1">25 <ChevronDown size={13} className="inline" /></button></span></div></section>
      <section className="rounded-lg border border-border bg-card p-4"><div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><h2 className="text-lg font-semibold">Expiring Soon</h2><span className="rounded-full bg-chart-1/10 px-2 py-0.5 text-xs font-semibold text-chart-1">5</span></div><button className="inline-flex items-center gap-1 text-sm text-foreground hover:text-foreground">See all <ChevronRight size={15} /></button></div><div className="flex gap-3 overflow-x-auto pb-1">{expiring.map(e => <article key={e[0]} className="min-w-[210px] flex-1 rounded-lg border border-border border-l-4 border-l-chart-1 p-3 transition-shadow hover:shadow-md"><div className="flex items-start justify-between gap-2"><div><code className="font-mono text-xs font-semibold">{e[0]}</code><h3 className="mt-1 text-sm font-medium">{e[1]}</h3></div><StatusBadge status="Active" /></div><p className="mt-3 text-xs text-muted-foreground">{e[2]} · {e[3]}</p><p className="mt-1 text-xs text-muted-foreground">{e[4]}</p><div className="mt-3 flex gap-1.5"><button className="rounded border border-border px-2 py-1 text-xs">Open</button><button className="rounded border border-border px-2 py-1 text-xs">{e[5]}</button>{e[0] === 'SEASON25' && <button className="rounded bg-secondary px-2 py-1 text-xs text-foreground">Ask AI</button>}</div></article>)}</div></section>
      <section className="mt-4 grid gap-4 xl:grid-cols-3"><article className="rounded-lg border border-border border-l-4 border-l-border bg-card p-4"><div className="flex items-center justify-between"><h3 className="flex items-center gap-2 font-semibold text-foreground"><Sparkles size={17} className="text-foreground" />Ask Lulu AI</h3><button aria-label="Collapse AI assistant"><ChevronDown size={16} /></button></div><p className="mt-1 text-xs text-muted-foreground">Powered by Lulu AI</p><div className="mt-3 rounded-lg border border-border bg-secondary p-3"><div className="flex items-center justify-between gap-2"><strong className="flex items-center gap-1.5 text-sm"><Sparkles size={14} className="text-foreground" />AI Draft Ready</strong><span className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-foreground">AI Generated Draft - Not Published</span></div><dl className="mt-3 grid grid-cols-2 gap-y-1 text-xs"><dt className="text-muted-foreground">Discount Name</dt><dd>Welcome Back 10%</dd><dt className="text-muted-foreground">Code</dt><dd className="font-mono">WLCMBACK10</dd><dt className="text-muted-foreground">Type / Value</dt><dd>Percentage · 10%</dd><dt className="text-muted-foreground">Applies To</dt><dd>Returning customers</dd><dt className="text-muted-foreground">Schedule</dt><dd>Immediate · No expiry</dd><dt className="text-muted-foreground">Usage</dt><dd>Unlimited</dd></dl><p className="mt-3 text-[11px] italic text-muted-foreground">AI Generated Draft - Not Published</p><div className="mt-3 flex gap-1.5"><button className="rounded border border-border bg-card px-2.5 py-1.5 text-xs">Edit</button><button className="rounded bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground">Approve and Create</button><button className="rounded px-2.5 py-1.5 text-xs text-foreground">Discard</button></div></div><div className="mt-3 flex gap-2 overflow-x-auto pb-1">{prompts.map(prompt => <button key={prompt} onClick={() => setAiMessage(prompt)} className="whitespace-nowrap rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-foreground">{prompt}</button>)}</div><div className="mt-2 flex gap-2"><input value={aiMessage} onChange={e => setAiMessage(e.target.value)} placeholder="Ask Lulu AI about your discounts..." className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-ring" /><button aria-label="Send message" className="rounded-lg p-2 text-foreground hover:bg-secondary"><Send size={16} /></button></div></article>
        <article className="rounded-lg border border-border bg-card p-4"><h3 className="font-semibold">Discount Operations Health</h3><div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">{health.map(([name, state, kind]) => <div key={name} className="flex items-start gap-2 text-sm">{kind === 'check' ? <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-foreground" /> : kind === 'warn' ? <AlertTriangle size={17} className="mt-0.5 shrink-0 text-chart-1" /> : <XCircle size={17} className="mt-0.5 shrink-0 text-chart-5" />}<span>{name}<strong className={`block text-xs ${kind === 'check' ? 'text-foreground' : kind === 'warn' ? 'text-chart-1' : 'text-chart-5'}`}>{state}</strong></span></div>)}</div><div className="my-4 border-t border-border" /><h3 className="text-sm font-semibold">Discount Synchronization</h3><div className="mt-3 space-y-2 text-xs"><div className="grid grid-cols-[1fr_auto_auto] items-center gap-2"><span><PlatformDot platform="Shopify" /> Lulu Store</span><strong className="text-foreground">✓ Synced</strong><span className="text-muted-foreground">Last: 3 min ago · 2 updated</span></div><div className="grid grid-cols-[1fr_auto_auto] items-center gap-2"><span><PlatformDot platform="WooCommerce" /> Style and Co</span><strong className="text-foreground">✓ Synced</strong><span className="text-muted-foreground">Last: 8 min ago · 1 updated</span></div><div className="grid grid-cols-[1fr_auto_auto] items-center gap-2"><span><PlatformDot platform="Webflow" /> Webflow Shop</span><strong className="text-chart-5">× Failed</strong><span className="text-muted-foreground">Last: 4 hours ago · 3 failed</span></div></div><button className="mt-3 inline-flex items-center gap-1 text-sm text-foreground hover:text-foreground">Open Integrations <ExternalLink size={13} /></button></article>
        <article className="rounded-lg border border-border bg-card p-4"><h3 className="font-semibold">Recent Discount Activity</h3><ol className="mt-4 space-y-3 text-sm">{[['bg-primary', 'AI Draft created for Welcome Back 10%', 'AI', '5 min ago'], ['bg-primary', 'Discount SUMMER20 activated on Lulu Store', 'System', '12 min ago'], ['bg-primary', 'New discount NEWCUST15 created', 'Admin', '1 hour ago'], ['bg-chart-1', 'SEASON25 expiring in 1 day flagged for review', 'System', '2 hours ago'], ['bg-destructive', 'FLASH50 activation failed on Lulu Store', 'System', '2 hours ago'], ['bg-muted', 'Discount synchronization completed for Style and Co', 'System', '3 hours ago']].map(([color, text, tag, time]) => <li key={text} className="flex gap-2.5"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${color}`} /><span className="min-w-0 flex-1"><span>{text}</span><span className="mt-0.5 block text-xs text-muted-foreground"><strong className={tag === 'AI' ? 'text-foreground' : tag === 'Admin' ? 'text-foreground' : ''}>{tag}</strong> · {time}</span></span></li>)}</ol><button className="mt-3 text-sm text-foreground hover:text-foreground">View All Activity</button></article></section>
    </main></div>;
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
  "label": "Website",
  "pages": [{
    "id": "lulu-website-portal-9012",
    "label": "Website"
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
