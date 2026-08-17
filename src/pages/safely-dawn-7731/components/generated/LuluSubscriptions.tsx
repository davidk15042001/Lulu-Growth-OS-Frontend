import { useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertTriangle, ArrowDownToLine, ArrowUpRight, Bell, Bot, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, CreditCard, Ellipsis, ExternalLink, Filter, LayoutDashboard, LifeBuoy, Menu, MoreHorizontal, Package, PanelLeft, Pause, RefreshCw, Search, Settings2, ShoppingBag, Sparkles, Store, Tags, Users, X, Zap } from 'lucide-react';
interface Subscription {
  customer: string;
  id: string;
  plan: string;
  store: string;
  platform: string;
  status: string;
  qty: string;
  billing: string;
  amount: string;
  renewal: string;
  payment: string;
  updated: string;
}
interface Attention {
  customer: string;
  id: string;
  issue: string;
  store: string;
  severity: string;
  time: string;
}
const subscriptions: Subscription[] = [{
  customer: 'Max Mustermann',
  id: 'SUB-10482',
  plan: 'Business Pro',
  store: 'Lulu Store',
  platform: 'Shopify',
  status: 'Active',
  qty: '2',
  billing: 'Monthly',
  amount: '€49.00',
  renewal: '01 Sep 2025',
  payment: 'Paid',
  updated: '10 Aug'
}, {
  customer: 'Sarah Chen',
  id: 'SUB-10471',
  plan: 'Starter Plan',
  store: 'Lulu WooCommerce',
  platform: 'WooCommerce',
  status: 'Past Due',
  qty: '1',
  billing: 'Monthly',
  amount: '€19.00',
  renewal: '28 Aug 2025',
  payment: 'Failed',
  updated: '09 Aug'
}, {
  customer: 'James Wilson',
  id: 'SUB-10459',
  plan: 'Business Pro',
  store: 'Lulu Store',
  platform: 'Shopify',
  status: 'Trial',
  qty: '1',
  billing: 'Monthly',
  amount: '€49.00',
  renewal: '30 Aug 2025',
  payment: 'Pending',
  updated: '08 Aug'
}, {
  customer: 'Emma Rossi',
  id: 'SUB-10445',
  plan: 'Enterprise',
  store: 'Lulu Store',
  platform: 'Shopify',
  status: 'Active',
  qty: '5',
  billing: 'Annual',
  amount: '€499.00',
  renewal: '15 Jan 2026',
  payment: 'Paid',
  updated: '07 Aug'
}, {
  customer: 'Lukas Bauer',
  id: 'SUB-10438',
  plan: 'Starter Plan',
  store: 'Lulu WooCommerce',
  platform: 'WooCommerce',
  status: 'Paused',
  qty: '1',
  billing: 'Monthly',
  amount: '€19.00',
  renewal: '—',
  payment: '—',
  updated: '06 Aug'
}, {
  customer: 'Amara Nwosu',
  id: 'SUB-10421',
  plan: 'Business Pro',
  store: 'Lulu Store',
  platform: 'Shopify',
  status: 'Active',
  qty: '3',
  billing: 'Quarterly',
  amount: '€129.00',
  renewal: '12 Sep 2025',
  payment: 'Paid',
  updated: '05 Aug'
}, {
  customer: 'Pierre Dubois',
  id: 'SUB-10410',
  plan: 'Starter Plan',
  store: 'Lulu Store',
  platform: 'Shopify',
  status: 'Cancelled',
  qty: '1',
  billing: 'Monthly',
  amount: '€19.00',
  renewal: '—',
  payment: '—',
  updated: '04 Aug'
}, {
  customer: 'Yuki Tanaka',
  id: 'SUB-10398',
  plan: 'Enterprise',
  store: 'Lulu WooCommerce',
  platform: 'WooCommerce',
  status: 'Active',
  qty: '2',
  billing: 'Annual',
  amount: '€998.00',
  renewal: '22 Dec 2025',
  payment: 'Paid',
  updated: '03 Aug'
}];
const attention: Attention[] = [{
  customer: 'Max Mustermann',
  id: 'SUB-10482',
  issue: 'Failed renewal',
  store: 'Lulu Store',
  severity: 'Critical',
  time: '2h ago'
}, {
  customer: 'Sarah Chen',
  id: 'SUB-10471',
  issue: 'Past due payment',
  store: 'Lulu WooCommerce',
  severity: 'High',
  time: '1d ago'
}, {
  customer: 'James Wilson',
  id: 'SUB-10459',
  issue: 'Trial ending soon (2 days)',
  store: 'Lulu Store',
  severity: 'Medium',
  time: '3d ago'
}, {
  customer: 'Emma Rossi',
  id: 'SUB-10445',
  issue: 'Sync failure',
  store: 'Lulu Store',
  severity: 'High',
  time: '4h ago'
}];
const metrics = [{
  label: 'Active Subscriptions',
  value: '1,284',
  note: '↑ 3.2%',
  tone: 'green'
}, {
  label: 'New Subscriptions',
  value: '47',
  note: 'this period',
  tone: 'neutral'
}, {
  label: 'Renewals',
  value: '312',
  note: 'successfully renewed',
  tone: 'neutral'
}, {
  label: 'Trials',
  value: '28',
  note: 'active trials',
  tone: 'blue'
}, {
  label: 'Paused',
  value: '19',
  note: '',
  tone: 'neutral'
}, {
  label: 'Cancelled',
  value: '34',
  note: 'this period',
  tone: 'red'
}, {
  label: 'Attention Required',
  value: '14',
  note: 'Review now',
  tone: 'amber'
}];
const upcoming = [{
  name: 'Noah Williams',
  id: 'SUB-10476',
  plan: 'Business Pro',
  date: '12 Aug 2025',
  amount: '€49.00'
}, {
  name: 'Olivia Smith',
  id: 'SUB-10463',
  plan: 'Starter Plan',
  date: '14 Aug 2025',
  amount: '€19.00'
}, {
  name: 'Liam Garcia',
  id: 'SUB-10456',
  plan: 'Enterprise',
  date: '16 Aug 2025',
  amount: '€499.00'
}];
const health = [{
  label: 'Subscription Synchronization',
  ok: true
}, {
  label: 'Billing Synchronization',
  ok: true
}, {
  label: 'Product/Plan Mapping',
  ok: false
}, {
  label: 'Customer Mapping',
  ok: true
}, {
  label: 'Payment Status Sync',
  ok: true
}, {
  label: 'Platform Connectivity',
  ok: true
}, {
  label: 'Data Completeness',
  ok: false
}];
const activity = [{
  id: 'SUB-10482',
  text: 'Subscription renewed',
  date: '10 Aug 2025',
  store: 'Lulu Store',
  who: 'System'
}, {
  id: 'SUB-10471',
  text: 'Payment failed',
  date: '09 Aug 2025',
  store: 'Lulu WooCommerce',
  who: 'System'
}, {
  id: 'SUB-10459',
  text: 'Trial started',
  date: '08 Aug 2025',
  store: 'Lulu Store',
  who: 'System'
}, {
  id: 'SUB-10421',
  text: 'Quantity changed (2 → 3)',
  date: '05 Aug 2025',
  store: 'Lulu Store',
  who: 'User'
}, {
  id: 'SUB-10410',
  text: 'Subscription cancelled',
  date: '04 Aug 2025',
  store: 'Lulu Store',
  who: 'User'
}];
function Badge({
  children,
  tone = 'neutral'
}: {
  children: string;
  tone?: string;
}) {
  const styles: Record<string, string> = {
    green: 'bg-secondary text-foreground ring-ring',
    amber: 'bg-secondary text-foreground ring-ring',
    red: 'bg-chart-5/10 text-chart-5 ring-chart-5',
    blue: 'bg-secondary text-foreground ring-ring',
    gray: 'bg-secondary text-muted-foreground ring-ring',
    purple: 'bg-secondary text-foreground ring-ring',
    neutral: 'bg-card text-muted-foreground ring-ring'
  };
  return <span className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold ring-1 ring-inset ${styles[tone] || styles.neutral}`}>{children}</span>;
}
function SectionTitle({
  children,
  action
}: {
  children: string;
  action?: string;
}) {
  return <div className="mb-3 flex items-center justify-between"><h2 className="text-[14px] font-bold tracking-[-0.01em] text-foreground">{children}</h2>{action && <button className="text-xs font-semibold text-foreground hover:text-foreground">{action}</button>}</div>;
}
export function LuluSubscriptions() {
  const [attentionOpen, setAttentionOpen] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const { items: liveSubscriptions, loading: liveLoading, error: liveError } = useLiveRecords('ecommerce_subscriptions');
  const liveEmpty = !liveLoading && !liveError && liveSubscriptions.length === 0;
  const toggle = (id: string) => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const filtered = subscriptions.filter(item => `${item.customer} ${item.id} ${item.plan} ${item.store}`.toLowerCase().includes(query.toLowerCase()));
  const nav = [{
    icon: LayoutDashboard,
    label: 'Overview'
  }, {
    icon: ShoppingBag,
    label: 'Ecommerce',
    open: true
  }, {
    icon: Users,
    label: 'Customers'
  }, {
    icon: Package,
    label: 'Products'
  }, {
    icon: CreditCard,
    label: 'Payments'
  }, {
    icon: Activity,
    label: 'Analytics'
  }];
  return <div className="flex min-h-screen bg-[var(--background)] text-foreground">{liveLoading ? <div className="fixed inset-x-0 top-0 z-50 border-b border-border bg-secondary px-4 py-3 text-xs text-muted-foreground">Loading live subscriptions…</div> : liveError ? <div className="fixed inset-x-0 top-0 z-50 border-b border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">{liveError}</div> : liveEmpty ? <div className="fixed inset-x-0 top-0 z-50 border-b border-dashed border-border bg-card px-4 py-3 text-xs text-muted-foreground">No live subscriptions are available yet. Connect your commerce platform or create a subscription to begin.</div> : null}
    <aside className="hidden w-[240px] shrink-0 flex-col bg-[var(--sidebar)] text-foreground lg:flex">
      <div className="flex h-[68px] items-center gap-3 border-b border-border px-6"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-sm font-black text-[var(--primary-foreground)]">L</div><strong className="text-[17px] tracking-tight text-foreground">LULU AI</strong></div>
      <div className="flex items-center gap-3 px-5 py-5"><div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary text-primary-foreground" /><div><p className="text-xs font-semibold text-foreground">Lulu workspace</p><p className="text-[11px] text-muted-foreground">Admin account</p></div><ChevronDown size={14} className="ml-auto" /></div>
      <LuluSectionNavigation activeId="safely-dawn-7731" />
      <div className="m-4 rounded-xl border border-border bg-secondary p-3"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground"><Zap size={14} className="text-[var(--chart-4)]" />Lulu AI is online</div><p className="text-[11px] leading-4 text-muted-foreground">Your connected stores are syncing normally.</p></div>
    </aside>
    <main className="min-w-0 flex-1"><header className="flex min-h-[68px] items-center justify-between border-b border-border bg-card px-5 py-3 lg:px-8"><div className="flex items-center gap-3"><button className="lg:hidden"><Menu size={20} /></button><div><div className="mb-1 flex items-center gap-2 text-[11px] font-medium text-muted-foreground"><span>Ecommerce</span><span>/</span><span className="text-muted-foreground">Subscriptions</span></div><h1 className="text-[22px] font-bold tracking-[-0.03em] text-foreground">Subscriptions</h1></div></div><div className="flex items-center gap-2"><button className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-card sm:flex"><Bot size={15} />Ask Lulu AI</button><button className="hidden rounded-lg border border-border p-2 text-foreground hover:bg-card sm:block" aria-label="Refresh"><RefreshCw size={16} /></button><button className="hidden rounded-lg border border-border p-2 text-foreground hover:bg-card sm:block" aria-label="Export"><ArrowDownToLine size={16} /></button><button className="rounded-lg border border-border p-2 text-foreground hover:bg-card" aria-label="More actions"><Ellipsis size={17} /></button></div></header>
      <div className="mx-auto max-w-[1640px] px-5 py-6 lg:px-8"><p className="mb-5 max-w-2xl text-sm text-muted-foreground">Monitor recurring purchases, renewals and subscription activity across your connected ecommerce stores.</p>
        <section className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground"><Store size={16} /></div><div><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Store scope</p><button className="flex items-center gap-2 text-sm font-semibold text-foreground">All Stores <ChevronDown size={14} /></button></div></div><div className="flex flex-wrap gap-2"><Badge tone="green">Shopify · Connected</Badge><Badge tone="purple">WooCommerce · Connected</Badge></div></section>
        <section className="mb-5 flex flex-wrap items-center gap-2"><div className="relative min-w-[260px] flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-border focus:ring-2 focus:ring-ring" placeholder="Search by customer, subscription ID, product, email..." /></div><button className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-card"><CalendarDays size={15} />Last 30 Days<ChevronDown size={13} /></button><button className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-card">Renewal: Next 30 Days<ChevronDown size={13} /></button><button className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-card"><Filter size={14} />More Filters</button></section>
        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">{metrics.map(metric => <article key={metric.label} className={`rounded-xl border bg-card p-4 shadow-sm ${metric.tone === 'amber' ? 'border-chart-1/30 bg-chart-1/30' : 'border-border'}`}><p className="min-h-[30px] text-[11px] font-medium leading-4 text-muted-foreground">{metric.label}</p><p className="mt-2 text-[22px] font-bold tracking-tight text-foreground">{metric.value}</p><p className={`mt-1 text-[11px] font-semibold ${metric.tone === 'green' ? 'text-chart-4' : metric.tone === 'red' ? 'text-chart-5' : metric.tone === 'amber' ? 'text-chart-1' : 'text-muted-foreground'}`}>{metric.note || ' '}</p></article>)}</section>
        <section className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm"><div className="mb-3 flex items-center gap-2"><h2 className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">Revenue context</h2><span className="text-[11px] text-muted-foreground">Observed platform data</span></div><div className="grid gap-4 sm:grid-cols-3"><div><p className="text-xs text-muted-foreground">Recurring Revenue</p><strong className="text-xl text-foreground">€62,890.00</strong></div><div><p className="text-xs text-muted-foreground">Upcoming Renewal Value</p><strong className="text-xl text-foreground">€18,340.00</strong></div><div><p className="text-xs text-muted-foreground">Failed Renewal Value</p><strong className="text-xl text-foreground">€2,180.00</strong></div></div></section>
        <section className="mb-6 rounded-xl border border-border bg-card shadow-sm"><button onClick={() => setAttentionOpen(!attentionOpen)} className="flex w-full items-center justify-between p-4 text-left"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1"><AlertTriangle size={16} /></div><div><h2 className="text-sm font-bold text-foreground">Subscriptions Requiring Attention</h2><p className="text-xs text-muted-foreground">14 issues need review across connected stores</p></div></div><ChevronDown size={17} className={`text-muted-foreground transition-transform ${attentionOpen ? '' : '-rotate-90'}`} /></button>{attentionOpen && <div className="border-t border-chart-1/30">{attention.map(item => <div key={item.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border px-4 py-3 last:border-0"><div className="min-w-[150px]"><p className="text-xs font-semibold text-foreground">{item.customer}</p><p className="text-[11px] text-muted-foreground">{item.id}</p></div><span className="min-w-[155px] text-xs text-muted-foreground">{item.issue}</span><span className="text-xs text-muted-foreground">{item.store}</span><Badge tone={item.severity === 'Critical' ? 'red' : item.severity === 'High' ? 'amber' : 'blue'}>{item.severity}</Badge><span className="text-xs text-muted-foreground">{item.time}</span><button className="ml-auto text-xs font-semibold text-foreground underline underline-offset-2">Review</button><button className="text-xs font-semibold text-foreground">Open</button></div>)}<div className="px-4 py-3 text-xs font-semibold text-muted-foreground">+ 10 more issues</div></div>}</section>
        <section className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-secondary/60 p-4"><Sparkles size={18} className="text-foreground" /><div className="min-w-[230px] flex-1"><p className="text-[11px] font-bold uppercase tracking-wider text-foreground">AI Insight <span className="font-normal">— AI-generated</span></p><p className="mt-1 text-sm font-medium text-foreground">14 subscriptions have renewal or payment issues that may require review.</p><p className="mt-1 text-[11px] text-muted-foreground">Supporting: Subscription count · Store · Renewal date · Payment status · Subscription status</p></div><button className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-muted">Find Subscription Issues</button><button className="p-2 text-foreground hover:text-foreground" aria-label="Dismiss insight"><X size={16} /></button></section>
        <section className="mb-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4"><div><SectionTitle>All subscriptions</SectionTitle><p className="-mt-2 text-xs text-muted-foreground">Operational workspace · 1,284 total</p></div><div className="flex flex-wrap gap-2"><button className="rounded-md border border-border px-2.5 py-1.5 text-[11px] font-semibold text-foreground">Status <ChevronDown size={12} className="ml-1 inline" /></button><button className="rounded-md border border-border px-2.5 py-1.5 text-[11px] font-semibold text-foreground">Store <ChevronDown size={12} className="ml-1 inline" /></button><button className="rounded-md border border-border px-2.5 py-1.5 text-[11px] font-semibold text-foreground">Plan <ChevronDown size={12} className="ml-1 inline" /></button><button className="rounded-md border border-border px-2.5 py-1.5 text-[11px] font-semibold text-foreground">Billing Frequency</button><button className="rounded-md border border-border px-2.5 py-1.5 text-[11px] font-semibold text-foreground">Saved Filters</button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left text-xs"><caption className="sr-only">Subscription records</caption><thead className="bg-secondary text-[10px] font-bold uppercase tracking-wider text-muted-foreground"><tr><th className="w-10 px-4 py-3"><input type="checkbox" aria-label="Select all subscriptions" /></th><th className="px-3 py-3">Customer</th><th className="px-3 py-3">Subscription</th><th className="px-3 py-3">Product / Plan</th><th className="px-3 py-3">Store</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Qty</th><th className="px-3 py-3">Billing</th><th className="px-3 py-3">Amount</th><th className="px-3 py-3">Next Renewal</th><th className="px-3 py-3">Payment</th><th className="px-3 py-3">Updated</th><th className="px-3 py-3">Actions</th></tr></thead><tbody className="divide-y divide-border">{filtered.map(item => <tr key={item.id} className="group hover:bg-secondary"><td className="px-4 py-3"><input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggle(item.id)} aria-label={`Select ${item.id}`} /></td><td className="whitespace-nowrap px-3 py-3"><p className="font-semibold text-foreground">{item.customer}</p></td><td className="px-3 py-3 font-medium text-muted-foreground">{item.id}</td><td className="whitespace-nowrap px-3 py-3 font-semibold text-foreground">{item.plan}</td><td className="whitespace-nowrap px-3 py-3"><p className="text-foreground">{item.store}</p><p className={`text-[10px] font-semibold ${item.platform === 'Shopify' ? 'text-chart-4' : 'text-foreground'}`}>{item.platform}</p></td><td className="px-3 py-3"><Badge tone={item.status === 'Active' ? 'green' : item.status === 'Past Due' ? 'amber' : item.status === 'Trial' ? 'blue' : item.status === 'Cancelled' ? 'red' : 'gray'}>{item.status}</Badge></td><td className="px-3 py-3">{item.qty}</td><td className="px-3 py-3">{item.billing}</td><td className="px-3 py-3 font-semibold text-foreground">{item.amount}</td><td className="whitespace-nowrap px-3 py-3">{item.renewal}</td><td className="px-3 py-3"><Badge tone={item.payment === 'Paid' ? 'green' : item.payment === 'Failed' ? 'red' : item.payment === 'Pending' ? 'gray' : 'neutral'}>{item.payment}</Badge></td><td className="px-3 py-3 text-muted-foreground">{item.updated}</td><td className="px-3 py-3"><div className="flex items-center gap-2 opacity-70 group-hover:opacity-100"><button className="font-semibold text-foreground hover:text-foreground">Open</button><button aria-label={`More actions for ${item.id}`}><MoreHorizontal size={15} /></button></div></td></tr>)}</tbody></table></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground"><span>Showing 1–8 of 1,284 subscriptions</span><div className="flex items-center gap-1"><button className="rounded border border-border p-1.5"><ChevronLeft size={14} /></button><button className="rounded bg-primary px-2.5 py-1.5 font-semibold text-primary-foreground">1</button><button className="rounded px-2.5 py-1.5 hover:bg-secondary">2</button><button className="rounded px-2.5 py-1.5 hover:bg-secondary">3</button><span>...</span><button className="rounded px-2.5 py-1.5">161</button><button className="rounded border border-border p-1.5"><ChevronRight size={14} /></button></div></div></section>
        <div className="mb-6 grid gap-5 xl:grid-cols-2"><section className="rounded-xl border border-border bg-card p-4 shadow-sm"><SectionTitle action="View all">Upcoming Renewals</SectionTitle><p className="mb-3 text-[11px] text-muted-foreground">Next 7 days · Do not automatically modify upcoming renewals</p>{upcoming.map(item => <div key={item.id} className="flex items-center gap-3 border-t border-border py-3"><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-foreground">{item.name} <span className="font-normal text-muted-foreground">· {item.id}</span></p><p className="text-[11px] text-muted-foreground">{item.plan} · {item.date}</p></div><strong className="text-xs text-foreground">{item.amount}</strong><Badge tone="green">Paid</Badge><button className="text-[11px] font-semibold text-foreground">Open</button></div>)}</section><section className="rounded-xl border border-border bg-card p-4 shadow-sm"><SectionTitle action="View all">Failed Renewals</SectionTitle><p className="mb-3 text-[11px] text-foreground">Payment issues requiring review</p>{subscriptions.filter(item => item.payment === 'Failed').map(item => <div key={item.id} className="flex items-center gap-3 border-t border-border py-3"><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-foreground">{item.customer} <span className="font-normal text-muted-foreground">· {item.id}</span></p><p className="text-[11px] text-muted-foreground">Renewal {item.renewal} · Updated {item.updated}</p></div><strong className="text-xs text-foreground">{item.amount}</strong><Badge tone="red">Failed</Badge><button className="rounded-md border border-border px-2 py-1 text-[11px] font-semibold text-foreground">Retry</button></div>)}</section></div>
        <div className="mb-6 grid gap-5 xl:grid-cols-[1.1fr_1fr_1fr]"><section className="rounded-xl border border-border bg-card p-4 shadow-sm"><SectionTitle>Subscription Operations Health</SectionTitle><div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">{health.map(item => <div key={item.label} className="flex items-center justify-between rounded-lg bg-card px-3 py-2 text-xs"><span>{item.label}</span><span className={`flex items-center gap-1 font-semibold ${item.ok ? 'text-chart-4' : 'text-chart-1'}`}><span className={`h-1.5 w-1.5 rounded-full ${item.ok ? 'bg-chart-4' : 'bg-chart-1'}`} />{item.ok ? 'Healthy' : 'Attention Required'}</span></div>)}</div></section><section className="rounded-xl border border-border bg-card p-4 shadow-sm"><SectionTitle>Subscription Synchronization</SectionTitle>{[{
              store: 'Lulu Store',
              sync: '2 min ago',
              records: '1,284',
              failed: '0',
              delayed: '0'
            }, {
              store: 'Lulu WooCommerce',
              sync: '5 min ago',
              records: '847',
              failed: '2',
              delayed: '1'
            }].map(item => <div key={item.store} className="border-t border-border py-3"><div className="flex justify-between text-xs font-semibold text-foreground"><span>{item.store}</span><Badge tone="green">Synced ✓</Badge></div><div className="mt-2 grid grid-cols-3 text-[10px] text-muted-foreground"><span>Last sync<br /><b className="font-semibold text-muted-foreground">{item.sync}</b></span><span>Records<br /><b className="font-semibold text-muted-foreground">{item.records}</b></span><span>Failed / delayed<br /><b className="font-semibold text-muted-foreground">{item.failed} / {item.delayed}</b></span></div></div>)}<button className="mt-2 text-[11px] font-semibold text-foreground underline underline-offset-2">View Sync Details</button></section><section className="rounded-xl border border-border bg-card p-4 shadow-sm"><SectionTitle action="View All Activity">Recent Subscription Activity</SectionTitle>{activity.map(item => <div key={item.id + item.text} className="flex gap-3 border-t border-border py-2.5"><div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary text-primary-foreground" /><div className="min-w-0"><p className="text-xs font-semibold text-foreground">{item.id} · {item.text}</p><p className="text-[10px] text-muted-foreground">{item.date} · {item.store} · {item.who}</p></div></div>)}</section></div>
        <section className="rounded-xl border border-border bg-[var(--card)] p-5 text-foreground shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="mb-2 flex items-center gap-2"><div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--primary)] text-[var(--primary-foreground)]"><Bot size={16} /></div><h2 className="text-sm font-bold">Ask Lulu AI</h2></div><p className="text-xs text-muted-foreground">Get answers about your subscription activity and operations.</p></div><Badge tone="green">AI Recommendation — AI-generated</Badge></div><div className="mt-4 flex flex-col gap-3 sm:flex-row"><input value={aiMessage} onChange={e => setAiMessage(e.target.value)} className="h-10 flex-1 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[var(--border)]" placeholder="Ask Lulu AI about subscriptions..." /><button className="rounded-lg bg-[var(--primary)] px-4 text-xs font-bold text-[var(--primary-foreground)] hover:bg-[var(--primary)]">Ask question</button></div><div className="mt-4 flex flex-wrap gap-2">{['Which subscriptions renew this week?', 'Which renewals failed?', 'Which trials are ending soon?', 'Find subscription issues', 'Summarize subscription activity'].map(prompt => <button key={prompt} onClick={() => setAiMessage(prompt)} className="rounded-full border border-border px-3 py-1.5 text-[11px] text-foreground hover:border-[var(--border)] hover:text-foreground">{prompt}</button>)}</div><p className="mt-4 border-t border-border pt-3 text-xs text-foreground"><strong className="text-[var(--foreground)]">Recommendation:</strong> Consider reviewing 3 trials ending within 48 hours to reduce potential churn.</p></section>
      </div></main>
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
