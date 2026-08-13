import { useMemo, useState } from 'react';
import { Activity, AlertCircle, Bot, Check, ChevronDown, ChevronLeft, ChevronRight, Clipboard, Copy, Download, ExternalLink, Filter, HelpCircle, MoreHorizontal, Plus, RefreshCw, Search, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Store, Upload, X, Zap } from 'lucide-react';
type CouponStatus = 'Active' | 'Scheduled' | 'Expired' | 'Usage Limit Reached' | 'Paused' | 'Draft' | 'Disabled';
type Severity = 'Critical' | 'Warning' | 'Info';
interface Coupon {
  name: string;
  code: string;
  type: string;
  value: string;
  store: string;
  platform: string;
  conditions: string;
  usage: string;
  limit: string;
  start: string;
  end: string;
  status: CouponStatus;
  updated: string;
}
interface Attention {
  coupon: string;
  code: string;
  issue: string;
  store: string;
  severity: Severity;
  timestamp: string;
}
const coupons: Coupon[] = [{
  name: 'Summer Welcome',
  code: 'WELCOME20',
  type: 'Percentage',
  value: '20%',
  store: 'Lulu Store',
  platform: 'Shopify',
  conditions: 'Min. €50',
  usage: '142',
  limit: '500',
  start: '01 Aug',
  end: '31 Aug',
  status: 'Active',
  updated: '10 Aug'
}, {
  name: 'Free Shipping',
  code: 'FREESHIP50',
  type: 'Free Shipping',
  value: '—',
  store: 'Brand Store',
  platform: 'WooCommerce',
  conditions: 'Min. €50',
  usage: '89',
  limit: '200',
  start: '15 Jul',
  end: '15 Sep',
  status: 'Active',
  updated: '20 Aug'
}, {
  name: 'New Customer 10%',
  code: 'NEW10',
  type: 'Percentage',
  value: '10%',
  store: 'Lulu Store',
  platform: 'Shopify',
  conditions: 'New customers only',
  usage: '0',
  limit: 'Unlimited',
  start: '01 Jun',
  end: '—',
  status: 'Active',
  updated: '01 Jun'
}, {
  name: 'Back to School',
  code: 'SCHOOL25',
  type: 'Fixed Amount',
  value: '€25',
  store: 'Lulu Store',
  platform: 'Shopify',
  conditions: 'Min. €100',
  usage: '500',
  limit: '500',
  start: '01 Aug',
  end: '31 Aug',
  status: 'Usage Limit Reached',
  updated: '31 Aug'
}, {
  name: 'Summer VIP',
  code: 'VIP30',
  type: 'Percentage',
  value: '30%',
  store: 'Brand Store',
  platform: 'WooCommerce',
  conditions: 'VIP customers',
  usage: '0',
  limit: '100',
  start: '01 Aug',
  end: '31 Aug',
  status: 'Scheduled',
  updated: '05 Aug'
}, {
  name: 'July Flash Sale',
  code: 'FLASH15',
  type: 'Percentage',
  value: '15%',
  store: 'Lulu Store',
  platform: 'Shopify',
  conditions: '—',
  usage: '234',
  limit: '300',
  start: '01 Jul',
  end: '31 Jul',
  status: 'Expired',
  updated: '31 Jul'
}];
const attention: Attention[] = [{
  coupon: 'Summer Welcome',
  code: 'WELCOME20',
  issue: 'Expiring in 3 days',
  store: 'Lulu Store',
  severity: 'Warning',
  timestamp: 'Aug 28'
}, {
  coupon: 'FREESHIP50',
  code: 'FREESHIP50',
  issue: 'Duplicate coupon code',
  store: 'Brand Store',
  severity: 'Critical',
  timestamp: 'Aug 27'
}, {
  coupon: 'VIP2024',
  code: 'VIP2024',
  issue: 'Never used since activation',
  store: 'Lulu Store',
  severity: 'Info',
  timestamp: 'Aug 15'
}];
const metrics = [['Active Coupons', '18', 'green'], ['Scheduled', '4', 'blue'], ['Expiring Soon', '3', 'amber'], ['Expired', '7', 'gray'], ['Usage Limit Reached', '2', 'orange'], ['Unused', '5', 'purple'], ['Attention Required', '3', 'red']];
const prompts = ['Which coupons are expiring soon?', 'Which coupons have never been used?', 'Find duplicate coupon codes', 'Find configuration issues', 'Compare usage across stores', 'Summarize coupon activity'];
function Sidebar() {
  const nav = [{
    label: 'Overview',
    icon: Activity
  }, {
    label: 'Orders',
    icon: Clipboard
  }, {
    label: 'Products',
    icon: Store
  }];
  return <aside className="hidden w-[238px] shrink-0 flex-col bg-[var(--sidebar)] text-foreground lg:flex">
    <div className="flex h-[72px] items-center gap-3 border-b border-border px-6"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-black">L</div><span className="text-[17px] font-semibold tracking-tight text-foreground">LULU <span className="font-normal text-muted-foreground">AI</span></span></div>
    <div className="flex-1 px-3 py-6"><p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">Workspace</p>{nav.map(({
        label,
        icon: Icon
      }) => <button key={label} className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] hover:bg-secondary hover:text-foreground"><Icon size={16} /><span>{label}</span></button>)}
      <p className="px-3 pb-3 pt-7 text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">Ecommerce</p>
      <button className="mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[13px] text-foreground"><span className="flex items-center gap-3"><Store size={16} /><span>Stores</span></span><ChevronDown size={14} /></button>
      {['Products', 'Orders', 'Coupons', 'Customers'].map(item => <button key={item} className={`mb-1 flex w-full items-center gap-3 rounded-lg py-2 pl-12 pr-3 text-[13px] ${item === 'Coupons' ? 'bg-[var(--primary)] font-semibold text-[var(--primary-foreground)]' : 'hover:bg-secondary hover:text-primary-foreground'}`}><span className={`h-1.5 w-1.5 rounded-full ${item === 'Coupons' ? 'bg-[var(--primary)]' : 'bg-muted'}`} /><span>{item}</span></button>)}
      <p className="px-3 pb-3 pt-7 text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">System</p><button className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] hover:bg-secondary hover:text-foreground"><Settings2 size={16} /><span>Integrations</span></button><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] hover:bg-secondary hover:text-foreground"><HelpCircle size={16} /><span>Help center</span></button>
    </div><div className="border-t border-border p-4"><div className="flex items-center gap-3 rounded-lg p-2"><div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--secondary)] text-xs font-bold text-foreground">AM</div><div><p className="text-xs font-semibold text-foreground">Alex Morgan</p><p className="text-[11px] text-muted-foreground">Admin</p></div><MoreHorizontal className="ml-auto" size={16} /></div></div>
  </aside>;
}
function StatusBadge({
  status
}: {
  status: CouponStatus;
}) {
  const styles: Record<CouponStatus, string> = {
    Active: 'bg-chart-4/10 text-chart-4',
    Scheduled: 'bg-secondary text-foreground',
    Expired: 'bg-sidebar text-muted-foreground',
    'Usage Limit Reached': 'bg-secondary text-foreground',
    Paused: 'bg-secondary text-foreground',
    Draft: 'border border-border text-muted-foreground',
    Disabled: 'bg-muted text-foreground'
  };
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status]}`}>{status}</span>;
}
export function LuluCouponsPage() {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState('');
  const [store, setStore] = useState('All Stores');
  const filtered = useMemo(() => coupons.filter(coupon => `${coupon.name} ${coupon.code} ${coupon.store}`.toLowerCase().includes(query.toLowerCase()) && (store === 'All Stores' || coupon.store === store)), [query, store]);
  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(code);
    window.setTimeout(() => setCopied(''), 1400);
  };
  return <div className="flex min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)]"><Sidebar /><main className="min-w-0 flex-1 overflow-hidden"><header className="flex items-center justify-between border-b border-border bg-card px-5 py-4 lg:px-9"><div className="flex items-center gap-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--secondary)] text-sm font-bold text-[var(--foreground)] lg:hidden">L</div><div className="text-xs text-muted-foreground"><span>Ecommerce</span><span className="mx-2">/</span><strong className="text-foreground">Coupons</strong></div></div><div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="hidden sm:inline">Last synced 2 min ago</span><button className="rounded-lg p-2 hover:bg-secondary" aria-label="Refresh"><RefreshCw size={16} /></button><button className="rounded-lg p-2 hover:bg-secondary" aria-label="Export"><Download size={16} /></button><button className="rounded-lg p-2 hover:bg-secondary"><MoreHorizontal size={18} /></button></div></header>
      <div className="mx-auto max-w-[1600px] px-5 py-7 lg:px-9"><section className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">Ecommerce operations</p><h1 className="text-[30px] font-bold tracking-[-.04em] text-[var(--foreground)]">Coupons</h1><p className="mt-2 text-sm text-muted-foreground">Create, manage and monitor coupon codes across your connected ecommerce stores.</p></div><div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-[var(--primary)]"><Plus size={16} /> Create Coupon</button><button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-card"><Bot size={16} /> Ask Lulu AI</button></div></section>
        <section className="mt-7 flex items-center gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1.5 shadow-sm"><span className="px-3 text-xs font-semibold text-muted-foreground">STORE</span>{['All Stores', 'Lulu Store', 'Brand Store'].map(item => <button key={item} onClick={() => setStore(item)} className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold ${store === item ? 'bg-[var(--secondary)] text-[var(--foreground)]' : 'text-foreground hover:bg-card'}`}>{item === 'All Stores' ? <Store size={14} /> : <span className={`h-2 w-2 rounded-full ${item === 'Lulu Store' ? 'bg-[var(--primary)]' : 'bg-[var(--primary)]'}`} />}<span>{item}</span>{item !== 'All Stores' && <span className="text-[10px] font-medium text-muted-foreground">{item === 'Lulu Store' ? 'Shopify' : 'WooCommerce'}</span>}</button>)}</section>
        <section className="mt-5 flex gap-3 overflow-x-auto pb-1">{metrics.map(([label, value, tone]) => <div key={label} className="min-w-[145px] flex-1 rounded-xl border border-border bg-card px-4 py-3.5 shadow-sm"><div className="flex items-center justify-between gap-2"><p className="text-[11px] font-medium leading-4 text-muted-foreground">{label}</p>{label === 'Attention Required' && <AlertCircle size={14} className="text-chart-5" />}</div><div className="mt-2 flex items-end gap-2"><strong className="text-[23px] tracking-tight text-[var(--foreground)]">{value}</strong><span className={`mb-1 h-1.5 w-1.5 rounded-full ${tone === 'green' ? 'bg-chart-4' : tone === 'blue' ? 'bg-primary' : tone === 'amber' ? 'bg-chart-1' : tone === 'orange' ? 'bg-chart-1' : tone === 'purple' ? 'bg-primary' : tone === 'red' ? 'bg-destructive' : 'bg-muted'}`} /></div><span className="mt-1 block text-[10px] text-muted-foreground">Observed</span></div>)}</section>
        <section className="mt-6 flex flex-col gap-3 xl:flex-row xl:items-center"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><input value={query} onChange={event => setQuery(event.target.value)} className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-border" placeholder="Search coupon code, name or ID…" /></div><div className="flex flex-wrap gap-2"><button className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground"><Filter size={14} /> Filter <ChevronDown size={13} /></button><button className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground">Created / Used / Expiring <span className="text-muted-foreground">·</span> Last 30 Days <ChevronDown size={13} /></button><button className="h-10 rounded-lg px-3 text-xs font-semibold text-foreground hover:bg-card">Saved Filters</button><button onClick={() => {
              setQuery('');
              setStore('All Stores');
            }} className="h-10 rounded-lg px-3 text-xs font-semibold text-foreground hover:bg-card">Clear Filters</button></div></section>
        <section className="mt-7 rounded-xl border border-border bg-card shadow-sm"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 className="font-semibold text-[var(--foreground)]">Coupons Requiring Attention</h2><p className="mt-1 text-xs text-muted-foreground">Observed operational issues requiring review</p></div><button className="text-xs font-semibold text-foreground hover:text-foreground">View all <span aria-hidden="true">→</span></button></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-xs"><thead className="bg-card text-[10px] font-bold uppercase tracking-wider text-muted-foreground"><tr>{['Coupon', 'Code', 'Issue', 'Store', 'Severity', 'Timestamp', 'Actions'].map(head => <th key={head} className="px-5 py-3">{head}</th>)}</tr></thead><tbody className="divide-y divide-border">{attention.map(item => <tr key={item.code} className="hover:bg-card"><td className="px-5 py-3 font-semibold text-foreground">{item.coupon}</td><td className="px-5 py-3"><code className="rounded bg-secondary px-1.5 py-1 font-mono text-[11px] text-muted-foreground">{item.code}</code></td><td className="px-5 py-3 text-muted-foreground">{item.issue}</td><td className="px-5 py-3 text-muted-foreground">{item.store}</td><td className="px-5 py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${item.severity === 'Critical' ? 'bg-chart-5/10 text-chart-5' : item.severity === 'Warning' ? 'bg-chart-1/10 text-chart-1' : 'bg-secondary text-foreground'}`}>{item.severity}</span></td><td className="px-5 py-3 text-muted-foreground">{item.timestamp}</td><td className="px-5 py-3"><div className="flex gap-1"><button className="rounded px-2 py-1 font-semibold text-foreground hover:bg-secondary">Review</button><button className="rounded px-2 py-1 font-semibold text-foreground hover:bg-secondary">Open</button><button className="rounded px-2 py-1 font-semibold text-foreground hover:bg-secondary">Ask AI</button></div></td></tr>)}</tbody></table></div></section>
        <section className="mt-7 rounded-xl border border-border bg-card shadow-sm"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 className="font-semibold text-[var(--foreground)]">Coupons</h2><p className="mt-1 text-xs text-muted-foreground">39 coupons across connected stores · <span className="font-medium text-muted-foreground">Observed</span></p></div><button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-card"><SlidersHorizontal size={14} /> Columns</button></div><div className="overflow-x-auto"><table className="w-full min-w-[1250px] text-left text-xs"><thead className="bg-card text-[10px] font-bold uppercase tracking-wider text-muted-foreground"><tr>{['Coupon', 'Code', 'Type', 'Value', 'Store', 'Conditions', 'Usage', 'Limit', 'Start', 'End', 'Status', 'Updated', ''].map(head => <th key={head} className="whitespace-nowrap px-4 py-3">{head}<span className="ml-1 text-foreground">↕</span></th>)}</tr></thead><tbody className="divide-y divide-border">{filtered.map(coupon => <tr key={coupon.code} className="group hover:bg-[var(--card)]"><td className="px-4 py-3 font-semibold text-foreground">{coupon.name}</td><td className="px-4 py-3"><button onClick={() => copyCode(coupon.code)} className="inline-flex items-center gap-1.5 rounded bg-secondary px-2 py-1 font-mono text-[11px] text-foreground hover:bg-secondary"><span>{copied === coupon.code ? 'Copied' : coupon.code}</span>{copied === coupon.code ? <Check size={12} /> : <Copy size={12} />}</button></td><td className="px-4 py-3 text-muted-foreground">{coupon.type}</td><td className="px-4 py-3 font-semibold text-foreground">{coupon.value}</td><td className="px-4 py-3"><div className="whitespace-nowrap font-medium text-muted-foreground">{coupon.store}</div><div className="text-[10px] text-muted-foreground">{coupon.platform}</div></td><td className="px-4 py-3 text-muted-foreground">{coupon.conditions}</td><td className="px-4 py-3 font-medium text-foreground">{coupon.usage}</td><td className="px-4 py-3 text-muted-foreground">{coupon.limit}</td><td className="px-4 py-3 text-muted-foreground">{coupon.start}</td><td className="px-4 py-3 text-muted-foreground">{coupon.end}</td><td className="px-4 py-3"><StatusBadge status={coupon.status} /></td><td className="px-4 py-3 text-muted-foreground">{coupon.updated}</td><td className="px-4 py-3"><button className="rounded p-1.5 text-foreground opacity-60 hover:bg-secondary hover:text-foreground group-hover:opacity-100"><MoreHorizontal size={16} /></button></td></tr>)}</tbody></table></div><div className="flex flex-col gap-3 border-t border-border px-5 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>Showing 1–{filtered.length} of 39 coupons</span><div className="flex items-center gap-3"><span>Per page: <strong className="text-foreground">10</strong> <ChevronDown className="inline" size={12} /></span><button className="rounded border border-border p-1 hover:bg-card"><ChevronLeft size={14} /></button><span>1 / 4</span><button className="rounded border border-border p-1 hover:bg-card"><ChevronRight size={14} /></button></div></div></section>
        <section className="mt-7 grid gap-5 xl:grid-cols-2"><div className="rounded-xl border border-border bg-card shadow-sm"><div className="border-b border-border px-5 py-4"><h2 className="font-semibold">Expiring Soon</h2><p className="mt-1 text-xs text-muted-foreground">Calculated · next 30 days</p></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-xs"><thead className="text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Coupon', 'Code', 'Store', 'Value', 'Usage', 'End Date', 'Status', 'Actions'].map(head => <th key={head} className="px-5 py-3">{head}</th>)}</tr></thead><tbody><tr className="border-t border-border"><td className="px-5 py-3 font-semibold">Summer Welcome</td><td className="px-5 py-3 font-mono text-muted-foreground">WELCOME20</td><td className="px-5 py-3 text-muted-foreground">Lulu Store</td><td className="px-5 py-3">20%</td><td className="px-5 py-3">142/500</td><td className="px-5 py-3 text-muted-foreground">31 Aug 2024</td><td className="px-5 py-3"><StatusBadge status="Active" /></td><td className="px-5 py-3 whitespace-nowrap text-muted-foreground">Open · Edit · Ask AI</td></tr></tbody></table></div></div>
          <div className="rounded-xl border border-border bg-card shadow-sm"><div className="border-b border-border px-5 py-4"><h2 className="font-semibold">Unused Coupons</h2><p className="mt-1 text-xs text-muted-foreground">Active coupons with no recorded usage.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-xs"><thead className="text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Coupon', 'Code', 'Store', 'Value', 'Start', 'End', 'Usage', 'Status', 'Action'].map(head => <th key={head} className="px-5 py-3">{head}</th>)}</tr></thead><tbody><tr className="border-t border-border"><td className="px-5 py-3 font-semibold">New Customer 10%</td><td className="px-5 py-3 font-mono text-muted-foreground">NEW10</td><td className="px-5 py-3 text-muted-foreground">Lulu Store</td><td className="px-5 py-3">10%</td><td className="px-5 py-3 text-muted-foreground">01 Jun</td><td className="px-5 py-3 text-muted-foreground">—</td><td className="px-5 py-3">0/Unlimited</td><td className="px-5 py-3"><StatusBadge status="Active" /></td><td className="px-5 py-3 font-semibold text-muted-foreground">Ask Lulu AI</td></tr></tbody></table></div><p className="border-t border-border px-5 py-3 text-[11px] text-muted-foreground">AI may suggest possible operational reasons but cannot confirm causes.</p></div></section>
        <section className="mt-7 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--secondary)] px-2.5 py-1 text-[10px] font-bold text-[var(--chart-4)]"><Sparkles size={12} /> AI Insight · AI-generated</span><h2 className="mt-3 font-semibold">5 active coupons have no recorded usage during the selected period and may require review.</h2></div><button className="whitespace-nowrap rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-[var(--primary)]">View All Unused Coupons</button></div><div className="mt-4 grid gap-2 text-xs sm:grid-cols-5"><div className="font-semibold text-muted-foreground">Coupon · Store</div><div className="font-semibold text-muted-foreground">Start</div><div className="font-semibold text-muted-foreground">End</div><div className="font-semibold text-muted-foreground">Usage</div><div className="font-semibold text-muted-foreground">Status</div>{['NEW10 · Lulu Store', 'VIP30 · Brand Store', 'VIP2024 · Lulu Store'].map(row => <div key={row} className="contents"><div className="rounded bg-secondary p-2 font-medium">{row}</div><div className="p-2 text-muted-foreground">01 Jun</div><div className="p-2 text-muted-foreground">—</div><div className="p-2">0</div><div className="p-2"><StatusBadge status="Active" /></div></div>)}</div></section>
        <section className="mt-7 grid gap-5 xl:grid-cols-3"><div className="rounded-xl border border-border bg-card p-5 shadow-sm"><h2 className="font-semibold">Coupon Operations Health</h2><div className="mt-4 space-y-3">{[['Coupon Synchronization', 'Healthy', 'green'], ['Code Uniqueness', 'Attention Required', 'amber'], ['Configuration Integrity', 'Healthy', 'green'], ['Eligibility Integrity', 'Healthy', 'green'], ['Platform Connectivity', 'Healthy', 'green'], ['Data Completeness', 'Healthy', 'green']].map(([label, status, tone]) => <div key={label} className="flex items-start gap-2 text-xs"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${tone === 'green' ? 'bg-chart-4' : 'bg-primary'}`} /><div><p className="font-semibold text-foreground">{label}</p><p className={`${tone === 'green' ? 'text-chart-4' : 'text-foreground'}`}>{status}{label === 'Code Uniqueness' && ' · 1 duplicate code detected'}</p></div></div>)}</div></div><div className="rounded-xl border border-border bg-card p-5 shadow-sm"><h2 className="font-semibold">Coupon Synchronization</h2><div className="mt-4 space-y-4">{[['Lulu Store', 'Shopify', '2 min ago', '18 coupons'], ['Brand Store', 'WooCommerce', '5 min ago', '21 coupons']].map(([name, platform, time, count]) => <div key={name} className="border-b border-border pb-3"><div className="flex items-center justify-between"><p className="text-sm font-semibold">{name} <span className="ml-1 text-[10px] font-normal text-muted-foreground">({platform})</span></p><span className="text-[11px] font-semibold text-foreground">● Synced</span></div><p className="mt-1 text-xs text-muted-foreground">Last sync: {time} · {count}</p></div>)}</div><div className="mt-4 flex flex-wrap gap-2"><button className="text-[11px] font-semibold text-foreground">View Sync Details</button><button className="text-[11px] font-semibold text-foreground">Retry Sync</button><button className="text-[11px] font-semibold text-foreground">Open Integrations</button></div></div><div className="rounded-xl border border-border bg-card p-5 shadow-sm"><h2 className="font-semibold">Recent Coupon Activity</h2><ol className="mt-4 space-y-4 border-l border-border pl-4 text-xs">{['Coupon used · WELCOME20 · 2 min ago · Lulu Store', 'Coupon activated · VIP30 · 1 hr ago · Brand Store · by Admin', 'Coupon synchronized · All stores · 2 min ago · System', 'Usage limit reached · SCHOOL25 · Yesterday · Lulu Store', 'Coupon created · FLASH15 · 2 days ago · Admin'].map(item => <li key={item} className="relative text-muted-foreground before:absolute before:-left-[21px] before:top-1 before:h-2 before:w-2 before:rounded-full before:border-2 before:border-border before:bg-muted"><span>{item}</span></li>)}</ol></div></section>
        <section className="mt-7 rounded-xl bg-[var(--card)] p-6 text-foreground shadow-sm"><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]"><Bot size={17} /></div><div><h2 className="font-semibold">Ask Lulu AI</h2><p className="text-xs text-muted-foreground">Understand coupon performance and resolve operational issues.</p></div></div><div className="mt-5 flex rounded-lg bg-card p-1.5"><input className="min-w-0 flex-1 bg-transparent px-3 text-sm text-muted-foreground outline-none placeholder:text-muted-foreground" placeholder="Ask Lulu AI about your coupons…" /><button className="rounded-md bg-[var(--primary)] px-4 py-2 text-xs font-bold text-[var(--primary-foreground)] hover:bg-[var(--primary)]">Ask AI</button></div><div className="mt-4 flex flex-wrap gap-2">{prompts.map(prompt => <button key={prompt} className="rounded-full border border-border px-3 py-1.5 text-[11px] text-foreground hover:border-[var(--border)] hover:text-[var(--foreground)]">{prompt}</button>)}</div></section>
        <footer className="flex items-center justify-between py-7 text-[11px] text-muted-foreground"><span>LULU AI · Coupon operations workspace</span><span className="flex items-center gap-1"><Check size={13} className="text-foreground" /> All systems operational</span></footer>
      </div></main></div>;
}