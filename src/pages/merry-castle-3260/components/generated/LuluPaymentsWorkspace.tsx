import { useState, type ComponentType } from 'react';
import { Activity, AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, BarChart3, Bell, Check, ChevronDown, CircleCheck, CircleX, Clock3, CreditCard, Download, ExternalLink, Eye, Filter, Grid2X2, HeartPulse, LayoutDashboard, Menu, MoreHorizontal, Package, RefreshCw, Search, Send, Settings, ShoppingBag, ShoppingCart, Sparkles, Store, Truck, UserRound, Users, X, Zap } from 'lucide-react';
type IconType = ComponentType<{
  size?: number;
  className?: string;
  strokeWidth?: number;
}>;
type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded' | 'Partially Refunded' | 'Authorized' | 'Cancelled';
type Tone = 'green' | 'amber' | 'red' | 'blue' | 'violet' | 'slate';
type Payment = {
  id: string;
  order: string;
  customer: string;
  store: string;
  platform: string;
  provider: string;
  method: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  date: string;
  updated: string;
};
type Attention = {
  severity: string;
  id: string;
  issue: string;
  store: string;
  time: string;
};
const navItems: {
  label: string;
  icon: IconType;
}[] = [{
  label: 'Overview',
  icon: LayoutDashboard
}, {
  label: 'Stores',
  icon: Store
}, {
  label: 'Products',
  icon: Package
}, {
  label: 'Categories',
  icon: Grid2X2
}, {
  label: 'Orders',
  icon: ShoppingBag
}, {
  label: 'Customers',
  icon: Users
}, {
  label: 'Carts',
  icon: ShoppingCart
}, {
  label: 'Inventory',
  icon: Package
}, {
  label: 'Returns & Refunds',
  icon: ArrowDown
}, {
  label: 'Reviews',
  icon: Bell
}, {
  label: 'Discounts & Promotions',
  icon: Zap
}, {
  label: 'Shipping',
  icon: Truck
}, {
  label: 'Payments',
  icon: CreditCard
}];
const metrics = [{
  label: 'Payments',
  value: '1,284',
  detail: 'Total transactions',
  tone: 'slate' as Tone,
  icon: CreditCard
}, {
  label: 'Successful',
  value: '1,156',
  detail: '90.0% of payments',
  tone: 'green' as Tone,
  icon: CircleCheck
}, {
  label: 'Pending',
  value: '47',
  detail: 'Last 30 days',
  tone: 'amber' as Tone,
  icon: Clock3
}, {
  label: 'Failed',
  value: '23',
  detail: '1.8% of payments',
  tone: 'red' as Tone,
  icon: CircleX
}, {
  label: 'Refunded',
  value: '41',
  detail: 'Last 30 days',
  tone: 'blue' as Tone,
  icon: ArrowDown
}, {
  label: 'Attention Required',
  value: '17',
  detail: 'Needs review',
  tone: 'amber' as Tone,
  icon: AlertTriangle
}];
const attention: Attention[] = [{
  severity: 'Critical',
  id: 'PAY-10891',
  issue: 'Payment stuck in pending state (72h)',
  store: 'Lulu Store · Shopify',
  time: '3 days ago'
}, {
  severity: 'High',
  id: 'PAY-10847',
  issue: 'Provider synchronization failure',
  store: 'Fashion Hub · WooCommerce',
  time: '5h ago'
}, {
  severity: 'High',
  id: 'PAY-10823',
  issue: 'Status mismatch — provider Paid, platform Pending',
  store: 'Lulu Store · Shopify',
  time: '8h ago'
}, {
  severity: 'Medium',
  id: 'PAY-10801',
  issue: 'Refund mismatch detected',
  store: 'Tech Store · Webflow',
  time: '1 day ago'
}, {
  severity: 'Medium',
  id: 'PAY-10788',
  issue: 'Missing transaction data',
  store: 'Fashion Hub · WooCommerce',
  time: '2 days ago'
}];
const payments: Payment[] = [{
  id: 'PAY-10924',
  order: '#10924',
  customer: 'Sarah Johnson',
  store: 'Lulu Store',
  platform: 'Shopify',
  provider: 'Stripe',
  method: 'Visa ···4242',
  amount: '€349.00',
  currency: 'EUR',
  status: 'Paid',
  date: '12 Aug',
  updated: '12 Aug'
}, {
  id: 'PAY-10923',
  order: '#10923',
  customer: 'Marco Rossi',
  store: 'Fashion Hub',
  platform: 'WooCommerce',
  provider: 'PayPal',
  method: 'PayPal',
  amount: '$129.99',
  currency: 'USD',
  status: 'Paid',
  date: '12 Aug',
  updated: '12 Aug'
}, {
  id: 'PAY-10922',
  order: '#10922',
  customer: 'Emma Clarke',
  store: 'Tech Store',
  platform: 'Webflow',
  provider: 'Stripe',
  method: 'Mastercard ···8891',
  amount: '£89.00',
  currency: 'GBP',
  status: 'Pending',
  date: '12 Aug',
  updated: '12 Aug'
}, {
  id: 'PAY-10921',
  order: '#10921',
  customer: 'James Wilson',
  store: 'Lulu Store',
  platform: 'Shopify',
  provider: 'Stripe',
  method: 'Visa ···1234',
  amount: '€199.00',
  currency: 'EUR',
  status: 'Paid',
  date: '12 Aug',
  updated: '12 Aug'
}, {
  id: 'PAY-10920',
  order: '#10920',
  customer: 'Yuki Tanaka',
  store: 'Fashion Hub',
  platform: 'WooCommerce',
  provider: 'Stripe',
  method: 'Apple Pay',
  amount: '$59.99',
  currency: 'USD',
  status: 'Failed',
  date: '11 Aug',
  updated: '11 Aug'
}, {
  id: 'PAY-10919',
  order: '#10919',
  customer: 'Priya Patel',
  store: 'Lulu Store',
  platform: 'Shopify',
  provider: 'Mollie',
  method: 'iDEAL',
  amount: '€74.00',
  currency: 'EUR',
  status: 'Paid',
  date: '11 Aug',
  updated: '11 Aug'
}, {
  id: 'PAY-10918',
  order: '#10918',
  customer: 'Lucas Müller',
  store: 'Tech Store',
  platform: 'Webflow',
  provider: 'Stripe',
  method: 'Visa ···5567',
  amount: '£149.00',
  currency: 'GBP',
  status: 'Refunded',
  date: '11 Aug',
  updated: '11 Aug'
}, {
  id: 'PAY-10917',
  order: '#10917',
  customer: 'Ana Silva',
  store: 'Fashion Hub',
  platform: 'WooCommerce',
  provider: 'Stripe',
  method: 'Google Pay',
  amount: '$39.99',
  currency: 'USD',
  status: 'Partially Refunded',
  date: '11 Aug',
  updated: '11 Aug'
}, {
  id: 'PAY-10916',
  order: '#10916',
  customer: 'Tom Baker',
  store: 'Lulu Store',
  platform: 'Shopify',
  provider: 'PayPal',
  method: 'PayPal',
  amount: '€299.00',
  currency: 'EUR',
  status: 'Cancelled',
  date: '11 Aug',
  updated: '11 Aug'
}, {
  id: 'PAY-10915',
  order: '#10915',
  customer: 'Lisa Chen',
  store: 'Tech Store',
  platform: 'Webflow',
  provider: 'Stripe',
  method: 'Mastercard ···3321',
  amount: '£199.00',
  currency: 'GBP',
  status: 'Authorized',
  date: '10 Aug',
  updated: '10 Aug'
}];
const failed = [{
  id: 'PAY-10920',
  order: '#10920',
  customer: 'Yuki Tanaka',
  store: 'Fashion Hub',
  amount: '$59.99',
  reason: 'Card declined',
  time: '11 Aug'
}, {
  id: 'PAY-10891',
  order: '#10891',
  customer: 'David Kim',
  store: 'Lulu Store',
  amount: '€149.00',
  reason: 'Authentication required',
  time: '3 days ago'
}, {
  id: 'PAY-10877',
  order: '#10877',
  customer: 'Rachel Green',
  store: 'Tech Store',
  amount: '£279.00',
  reason: 'Payment provider error',
  time: '4 days ago'
}, {
  id: 'PAY-10856',
  order: '#10856',
  customer: 'Carlos Ruiz',
  store: 'Fashion Hub',
  amount: '$89.00',
  reason: 'Insufficient funds',
  time: '5 days ago'
}];
const pending = [{
  id: 'PAY-10922',
  order: '#10922',
  customer: 'Emma Clarke',
  amount: '£89.00',
  provider: 'Stripe',
  time: '2h ago'
}, {
  id: 'PAY-10911',
  order: '#10911',
  customer: 'Michael Scott',
  amount: '€129.00',
  provider: 'Mollie',
  time: '6h ago'
}, {
  id: 'PAY-10903',
  order: '#10903',
  customer: 'Nina Ross',
  amount: '$199.00',
  provider: 'PayPal',
  time: '12h ago'
}, {
  id: 'PAY-10898',
  order: '#10898',
  customer: 'Jake Liu',
  amount: '€449.00',
  provider: 'Stripe',
  time: '18h ago'
}];
const activity = [{
  color: 'bg-chart-4',
  text: 'PAY-10924 payment captured successfully',
  sub: 'Stripe',
  time: '3 min ago'
}, {
  color: 'bg-primary',
  text: 'PAY-10922 synchronization updated',
  sub: 'Stripe',
  time: '8 min ago'
}, {
  color: 'bg-destructive',
  text: 'PAY-10920 payment failed',
  sub: 'Card declined · Stripe',
  time: '1h ago'
}, {
  color: 'bg-primary',
  text: 'PAY-10918 refund processed',
  sub: '£149.00 · Stripe',
  time: '2h ago'
}, {
  color: 'bg-chart-1',
  text: 'PAY-10891 sync error',
  sub: 'Provider timeout',
  time: '3h ago'
}, {
  color: 'bg-chart-4',
  text: 'PAY-10919 payment captured',
  sub: 'Mollie',
  time: '4h ago'
}];
const statusClasses: Record<PaymentStatus, string> = {
  Paid: 'bg-chart-4 text-primary-foreground',
  Pending: 'bg-chart-1 text-foreground',
  Failed: 'bg-destructive text-primary-foreground',
  Refunded: 'bg-primary text-primary-foreground',
  'Partially Refunded': 'border border-border bg-secondary/10 text-foreground',
  Authorized: 'bg-primary text-primary-foreground',
  Cancelled: 'bg-secondary text-foreground'
};
const platformClasses: Record<string, string> = {
  Shopify: 'bg-primary',
  WooCommerce: 'bg-primary',
  Webflow: 'bg-primary'
};
function Badge({
  status
}: {
  status: PaymentStatus;
}) {
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-bold ${statusClasses[status]}`}><span aria-hidden="true">●</span>{status}</span>;
}
function Panel({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`rounded-xl border border-border bg-[var(--card)] shadow-[0_12px_28px_rgba(0,0,0,.12)] ${className}`}>{children}</section>;
}
function SectionHead({
  title,
  count,
  icon: Icon,
  action
}: {
  title: string;
  count?: string;
  icon?: IconType;
  action?: string;
}) {
  return <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4"><div className="flex items-center gap-2">{Icon && <Icon size={16} className="text-foreground" />}<h2 className="text-sm font-bold text-foreground">{title}</h2>{count && <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] font-bold text-foreground">{count}</span>}</div>{action && <button className="text-[11px] font-semibold text-foreground hover:text-foreground">{action} →</button>}</header>;
}
export function LuluPaymentsWorkspace() {
  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState('');
  const [assistant, setAssistant] = useState('');
  const [view, setView] = useState('table');
  const [range, setRange] = useState('Last 30 Days');
  const shown = payments.filter(row => `${row.id} ${row.customer} ${row.order} ${row.store}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="min-h-screen bg-[var(--background)] font-sans text-foreground">
    <aside className={`fixed inset-y-0 left-0 z-30 w-[232px] border-r border-border bg-[var(--sidebar)] transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex h-full flex-col"><div className="flex h-[72px] items-center gap-3 border-b border-border px-5"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-sm font-black text-primary-foreground">L</div><span className="text-lg font-bold tracking-tight text-foreground">LULU <span className="font-normal text-muted-foreground">AI</span></span><button onClick={() => setMobileNav(false)} className="ml-auto text-foreground lg:hidden" aria-label="Close navigation"><X size={18} /></button></div><nav className="flex-1 overflow-y-auto px-3 py-5"><p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">Ecommerce</p>{navItems.map(item => {
            const Icon = item.icon;
            const active = item.label === 'Payments';
            return <button key={item.label} className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[11px] font-medium transition ${active ? 'bg-primary text-primary-foreground shadow-lg shadow-black/30' : 'text-primary-foreground hover:bg-secondary hover:text-primary-foreground'}`}><Icon size={15} strokeWidth={1.8} /><span>{item.label}</span>{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-card" />}</button>;
          })}</nav><div className="border-t border-border p-4"><div className="flex items-center gap-3 rounded-lg bg-secondary p-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">JD</div><div><p className="text-xs font-semibold text-foreground">Jordan Davis</p><p className="text-[10px] text-muted-foreground">Administrator</p></div><MoreHorizontal size={16} className="ml-auto text-muted-foreground" /></div></div></div></aside>
    <div className="lg:pl-[232px]"><header className="flex min-h-[78px] items-center justify-between border-b border-border bg-[var(--card)]/95 px-5 backdrop-blur lg:px-8"><div className="flex items-center gap-3"><button onClick={() => setMobileNav(true)} className="rounded-md p-2 text-foreground hover:bg-secondary lg:hidden" aria-label="Open navigation"><Menu size={20} /></button><div><p className="text-[11px] text-muted-foreground">Ecommerce <span className="px-1">/</span> <span className="text-foreground">Payments</span></p><h1 className="mt-1 text-xl font-bold tracking-tight text-foreground">Payments</h1></div></div><div className="flex items-center gap-2"><button className="hidden items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-lg shadow-black/30 hover:bg-primary sm:flex"><Sparkles size={14} />Ask Lulu AI</button><button className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary sm:flex"><RefreshCw size={14} />Refresh</button><button className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary md:flex"><Download size={14} />Export</button><button className="rounded-lg border border-border p-2 text-foreground hover:bg-secondary" aria-label="More actions"><MoreHorizontal size={17} /></button></div></header>
      <main className="mx-auto max-w-[1500px] space-y-5 p-5 lg:p-7"><p className="-mt-2 text-sm text-muted-foreground">Monitor ecommerce payments, payment status and payment issues across your connected stores.</p>
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-[var(--secondary)] p-2 md:flex-row"><label className="flex min-w-[210px] items-center gap-2 rounded-lg border border-border bg-[var(--card)] px-3 py-2 text-xs font-semibold text-foreground"><Store size={15} className="text-foreground" /><select className="w-full bg-transparent outline-none" aria-label="Store selector"><option>All Stores</option><option>Lulu Store · Shopify</option><option>Fashion Hub · WooCommerce</option><option>Tech Store · Webflow</option></select><ChevronDown size={14} /></label><label className="flex items-center gap-2 rounded-lg border border-border bg-[var(--card)] px-3 py-2 text-xs font-semibold text-foreground"><Clock3 size={14} className="text-muted-foreground" /><select value={range} onChange={e => setRange(e.target.value)} className="bg-transparent outline-none" aria-label="Date range"><option>Last 30 Days</option><option>Today</option><option>Yesterday</option><option>Last 7 Days</option><option>Last 90 Days</option><option>Year to Date</option><option>Custom Range</option></select></label><label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-[var(--card)] px-3 py-2 text-xs text-muted-foreground"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground" placeholder="Search by Payment ID, Order, Customer, Email…" aria-label="Search payments" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}</label><button className="flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground"><Filter size={14} />Filter <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">2</span></button><div className="hidden items-center rounded-lg border border-border p-1 md:flex"><button onClick={() => setView('table')} className={`rounded p-1.5 ${view === 'table' ? 'bg-primary text-primary-foreground' : 'text-primary-foreground'}`} aria-label="Table view"><BarChart3 size={14} /></button><button onClick={() => setView('card')} className={`rounded p-1.5 ${view === 'card' ? 'bg-primary text-primary-foreground' : 'text-primary-foreground'}`} aria-label="Card view"><Grid2X2 size={14} /></button></div></div>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-6">{metrics.map(metric => {
            const Icon = metric.icon;
            const accent = {
              green: 'text-foreground',
              amber: 'text-foreground',
              red: 'text-chart-5',
              blue: 'text-foreground',
              violet: 'text-foreground',
              slate: 'text-muted-foreground'
            }[metric.tone];
            return <article key={metric.label} className={`rounded-xl border bg-[var(--card)] p-4 ${metric.label === 'Attention Required' ? 'border-chart-1/40' : 'border-border'}`}><div className="flex items-center justify-between"><p className="text-[11px] font-semibold text-muted-foreground">{metric.label}</p><Icon size={16} className={accent} /></div><p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{metric.value}</p><p className={`mt-1 text-[10px] font-medium ${accent}`}>{metric.detail}</p></article>;
          })}</div>
        <Panel><SectionHead title="Payments Requiring Attention" count="17" icon={AlertTriangle} action="Collapse" /><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-xs"><thead className="bg-secondary text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Severity', 'Payment ID', 'Issue description', 'Store', 'Timestamp', 'Actions'].map(h => <th key={h} className="px-5 py-3 font-bold">{h}</th>)}</tr></thead><tbody>{attention.map(row => <tr key={row.id} className="border-t border-border hover:bg-secondary"><td className="px-5 py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${row.severity === 'Critical' ? 'bg-chart-5/15 text-chart-5' : row.severity === 'High' ? 'bg-secondary/15 text-foreground' : 'bg-secondary/15 text-foreground'}`}>{row.severity}</span></td><td className="px-5 py-3 font-bold text-foreground">{row.id}</td><td className="px-5 py-3 text-foreground">{row.issue}</td><td className="px-5 py-3 text-muted-foreground">{row.store}</td><td className="whitespace-nowrap px-5 py-3 text-muted-foreground">{row.time}</td><td className="px-5 py-3"><button className="rounded-md border border-border/30 px-2 py-1 text-[10px] font-bold text-foreground hover:bg-secondary/10">Review</button></td></tr>)}</tbody></table></div></Panel>
        <Panel><SectionHead title="Payments" count="1,284" action="Showing 1–25 of 1,284" /><div className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-3"><span className="rounded-full border border-border bg-secondary px-3 py-1 text-[10px] text-foreground">Status: All <ChevronDown size={11} className="ml-1 inline" /></span><span className="rounded-full border border-border bg-secondary px-3 py-1 text-[10px] text-foreground">Method: All <ChevronDown size={11} className="ml-1 inline" /></span><button className="text-[10px] font-semibold text-foreground">Clear Filters</button></div><div className="overflow-x-auto"><table className="w-full min-w-[1180px] text-left text-xs"><thead className="bg-secondary text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Payment', 'Order', 'Customer', 'Store', 'Provider', 'Method', 'Amount', 'Currency', 'Status', 'Date', 'Updated', ''].map(h => <th key={h} className="px-4 py-3 font-bold">{h}</th>)}</tr></thead><tbody>{shown.map(row => <tr key={row.id} className="border-t border-border transition hover:bg-secondary/[0.05]"><td className="px-4 py-3 font-bold text-foreground">{row.id}</td><td className="px-4 py-3 font-semibold text-foreground">{row.order}</td><td className="px-4 py-3 font-medium text-foreground">{row.customer}</td><td className="px-4 py-3 whitespace-nowrap text-muted-foreground"><span className={`mr-2 inline-block h-2 w-2 rounded-full ${platformClasses[row.platform]}`} />{row.store}</td><td className="px-4 py-3 text-foreground">{row.provider}</td><td className="px-4 py-3 text-muted-foreground">{row.method}</td><td className="px-4 py-3 font-semibold text-foreground">{row.amount}</td><td className="px-4 py-3 text-muted-foreground">{row.currency}</td><td className="px-4 py-3"><Badge status={row.status} /></td><td className="px-4 py-3 text-muted-foreground">{row.date}</td><td className="px-4 py-3 text-muted-foreground">{row.updated}</td><td className="px-4 py-3"><button className="rounded p-1 text-foreground hover:bg-secondary hover:text-foreground" aria-label={`Actions for ${row.id}`}><MoreHorizontal size={16} /></button></td></tr>)}</tbody></table></div><footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4 text-[11px] text-muted-foreground"><div className="flex items-center gap-1"><button className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5"><ArrowLeft size={13} />Prev</button><button className="rounded-md bg-primary px-3 py-1.5 font-bold text-primary-foreground">1</button><button className="rounded-md border border-border px-3 py-1.5">2</button><button className="rounded-md border border-border px-3 py-1.5">3</button><span>…</span><button className="rounded-md border border-border px-2.5 py-1.5">52</button><button className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5">Next<ArrowRight size={13} /></button></div><span>Items per page: <strong className="text-foreground">25</strong></span></footer></Panel>
        <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]"><div className="space-y-5"><Panel><SectionHead title="Failed Payments" count="23" icon={CircleX} action="View All" /><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-[11px]"><thead className="text-[9px] uppercase tracking-wider text-muted-foreground"><tr>{['Payment', 'Order', 'Customer', 'Store', 'Amount', 'Failure Reason', 'Time', ''].map(h => <th key={h} className="px-4 py-2.5">{h}</th>)}</tr></thead><tbody>{failed.map(row => <tr key={row.id} className="border-t border-border hover:bg-secondary"><td className="px-4 py-2.5 font-bold text-foreground">{row.id}</td><td className="px-4 py-2.5">{row.order}</td><td className="px-4 py-2.5 font-medium text-foreground">{row.customer}</td><td className="px-4 py-2.5 text-muted-foreground">{row.store}</td><td className="px-4 py-2.5 text-foreground">{row.amount}</td><td className="px-4 py-2.5 text-chart-5">{row.reason}</td><td className="px-4 py-2.5 text-muted-foreground">{row.time}</td><td className="px-4 py-2.5"><button className="text-foreground">Open</button></td></tr>)}</tbody></table></div></Panel><Panel><SectionHead title="Pending Payments" count="47" icon={Clock3} action="View All" /><div className="divide-y divide-white/[0.06]">{pending.map(row => <div key={row.id} className="flex items-center gap-3 px-5 py-3 text-[11px]"><strong className="text-foreground">{row.id}</strong><span className="text-muted-foreground">{row.order}</span><span className="min-w-[110px] font-medium text-foreground">{row.customer}</span><span className="font-semibold text-foreground">{row.amount}</span><span className="text-muted-foreground">{row.provider}</span><Badge status="Pending" /><span className="ml-auto text-muted-foreground">{row.time}</span><button className="text-foreground">Open</button></div>)}</div></Panel></div>
          <div className="space-y-5"><Panel><SectionHead title="Payment Operations Health" icon={HeartPulse} /><div className="space-y-3 p-5 text-xs">{['Payment Synchronization — Healthy', 'Provider Data — Healthy', 'Payment Status Availability — Attention Required (1 store)', 'Failed Payments — Critical (23 failed)', 'Pending Payments — Attention Required (7 aged >24h)', 'Refund Synchronization — Healthy', 'Platform Connectivity — Healthy (3/3 stores connected)'].map(row => <p key={row} className="flex items-center gap-2"><span className={row.includes('Critical') ? 'text-chart-5' : row.includes('Attention') ? 'text-chart-1' : 'text-chart-4'}>{row.includes('Critical') ? '✕' : row.includes('Attention') ? '⚠' : '✓'}</span><span className="text-foreground">{row}</span></p>)}</div></Panel><Panel><SectionHead title="Payment Synchronization" icon={RefreshCw} action="Retry All" /><div className="divide-y divide-white/[0.06]">{[['Lulu Store', 'Shopify', 'Stripe', 'Synced', '2 min ago', '847', '0'], ['Fashion Hub', 'WooCommerce', 'PayPal', 'Syncing', 'Syncing…', '291', '2'], ['Tech Store', 'Webflow', 'Stripe', 'Delayed', '47 min ago', '146', '1']].map(row => <div key={row[0]} className="grid grid-cols-[1.2fr_.8fr_.8fr_.8fr] gap-2 px-5 py-3 text-[10px]"><span className="font-semibold text-foreground">{row[0]} <small className="block text-muted-foreground">{row[1]}</small></span><span className="text-muted-foreground">{row[2]}</span><span className={row[3] === 'Synced' ? 'text-foreground' : row[3] === 'Delayed' ? 'text-chart-1' : 'text-foreground'}>{row[3]}<small className="block text-muted-foreground">{row[4]}</small></span><span className="text-muted-foreground">{row[5]} synced<br />{row[6]} failed</span></div>)}</div></Panel><Panel><SectionHead title="Recent Payment Activity" icon={Activity} action="View All" /><div className="divide-y divide-white/[0.06] px-5">{activity.map(item => <div key={item.text} className="flex items-center gap-3 py-3 text-[11px]"><span className={`h-2 w-2 rounded-full ${item.color}`} /><span className="font-medium text-foreground">{item.text}<small className="ml-2 text-muted-foreground">{item.sub}</small></span><time className="ml-auto whitespace-nowrap text-muted-foreground">{item.time}</time></div>)}</div></Panel></div></div>
        <Panel className="overflow-hidden border-border/30"><div className="bg-gradient-to-r from-primary to-primary px-5 py-5 text-primary-foreground"><div className="flex items-center gap-2"><Sparkles size={18} className="text-foreground" /><h2 className="text-base font-bold text-foreground">Ask Lulu AI</h2><span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">Payment intelligence</span></div><div className="mt-4 flex gap-2"><input value={assistant} onChange={e => setAssistant(e.target.value)} className="min-w-0 flex-1 rounded-lg bg-card px-4 py-3 text-sm text-muted-foreground outline-none placeholder:text-muted-foreground" placeholder="Ask Lulu AI about payments…" aria-label="Ask Lulu AI about payments" /><button className="flex items-center gap-2 rounded-lg bg-background px-4 text-xs font-bold text-foreground hover:bg-card"><Send size={14} />Send</button></div><div className="mt-3 flex flex-wrap gap-2">{['Which payments failed?', 'Payments pending >24h', 'Why did PAY-10920 fail?', 'Find sync problems', 'Summarize today’s activity', 'Prioritize payment issues'].map(prompt => <button key={prompt} className="rounded-full border border-border px-3 py-1.5 text-[10px] text-foreground/90 hover:bg-secondary">{prompt}</button>)}</div></div><div className="border-t border-border/20 bg-[var(--card)] p-5"><div className="flex items-center gap-2"><span className="rounded-full bg-secondary/20 px-2 py-1 text-[10px] font-bold text-foreground">AI Insight</span><span className="text-[10px] text-muted-foreground">AI-generated from connected payment data</span></div><p className="mt-3 max-w-5xl text-sm leading-6 text-foreground">7 payment records have been in a pending state for more than 24 hours and may require review. These payments span 2 stores (Lulu Store and Fashion Hub) across 2 providers (Stripe and PayPal). The oldest pending payment is PAY-10891, which has been pending for 3 days. Current platform status does not confirm completion for any of these records.</p><div className="mt-3 flex flex-wrap gap-2">{['7 Pending Payments', '2 Stores', '2 Providers', 'Oldest: 3 days'].map(chip => <span key={chip} className="rounded-full border border-border/20 bg-secondary/10 px-3 py-1.5 text-[10px] font-semibold text-foreground">{chip}</span>)}</div></div></Panel>
      </main></div></div>;
}
export default LuluPaymentsWorkspace;