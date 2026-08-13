import { useMemo, useState } from 'react';
import { BarChart3, Bell, Bot, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Download, ExternalLink, Filter, Grid2X2, Inbox, LayoutDashboard, List, MoreHorizontal, PanelLeft, RefreshCw, Search, Send, Settings, ShoppingBag, Sparkles, X, Zap } from 'lucide-react';
interface Review {
  id: string;
  title: string;
  text: string;
  rating: number;
  product: string;
  customer: string;
  store: string;
  date: string;
  response: string;
  classification: string;
  tone: 'positive' | 'negative' | 'mixed';
  rowTone?: 'red' | 'amber';
}
const navItems = [{
  label: 'Overview',
  icon: LayoutDashboard
}, {
  label: 'Ecommerce',
  icon: ShoppingBag,
  active: true
}, {
  label: 'Campaigns',
  icon: BarChart3
}, {
  label: 'Inbox',
  icon: Inbox
}, {
  label: 'Automations',
  icon: Zap
}];
const reviews: Review[] = [{
  id: '1842',
  title: 'Love the fit and feel',
  text: 'The fabric is so soft and it fits perfectly. Will be ordering another color.',
  rating: 5,
  product: 'Premium Hoodie',
  customer: 'Sarah Johnson',
  store: 'Lulu Store',
  date: 'Aug 12, 2024',
  response: 'Responded',
  classification: 'Positive',
  tone: 'positive'
}, {
  id: '1901',
  title: 'Great quality',
  text: 'Really happy with this purchase, arrived quickly and looks exactly like the photos.',
  rating: 4,
  product: 'Canvas Tote Bag',
  customer: 'Michael Chen',
  store: 'Style and Co',
  date: 'Aug 11, 2024',
  response: 'Unanswered',
  classification: 'Positive',
  tone: 'positive'
}, {
  id: '1798',
  title: 'The zipper broke after one week',
  text: 'Disappointed. The zipper broke after only a few wears and support has not replied.',
  rating: 1,
  product: 'Premium Hoodie',
  customer: 'Emma Wilson',
  store: 'Lulu Store',
  date: 'Aug 10, 2024',
  response: 'AI Draft Ready',
  classification: 'Negative',
  tone: 'negative',
  rowTone: 'red'
}, {
  id: '1887',
  title: 'Beautiful scarf',
  text: 'The colors are even better in person. A lovely lightweight scarf for summer.',
  rating: 5,
  product: 'Silk Scarf',
  customer: 'Priya Patel',
  store: 'Lulu Store',
  date: 'Aug 10, 2024',
  response: 'Unanswered',
  classification: 'Positive',
  tone: 'positive'
}, {
  id: '1764',
  title: 'Shipping took too long',
  text: 'The bag is nice, but it arrived two weeks late with no updates along the way.',
  rating: 2,
  product: 'Canvas Tote Bag',
  customer: 'David Lee',
  store: 'Style and Co',
  date: 'Aug 9, 2024',
  response: 'AI Draft Ready',
  classification: 'Negative',
  tone: 'negative',
  rowTone: 'amber'
}, {
  id: '1721',
  title: 'Good, but size runs small',
  text: 'The material is great. I would recommend sizing up for a more relaxed fit.',
  rating: 3,
  product: 'Slim Fit Chino',
  customer: 'Alex Torres',
  store: 'Lulu Store',
  date: 'Aug 8, 2024',
  response: 'Unanswered',
  classification: 'Mixed',
  tone: 'mixed'
}];
const prompts = ['Which reviews need attention', 'Show unanswered reviews', 'Draft today responses', 'Find shipping complaints', 'Find product issues', 'Summarize feedback'];
const attentionRows = [{
  title: 'The zipper broke after one week',
  product: 'Premium Hoodie',
  store: 'Lulu Store',
  issue: 'Product Quality',
  rating: 1,
  severity: 'Critical',
  status: 'Unanswered',
  actions: ['Generate Response', 'Open Product', 'Ask AI']
}, {
  title: 'Shipping took too long',
  product: 'Canvas Tote Bag',
  store: 'Style and Co',
  issue: 'Shipping Delay',
  rating: 2,
  severity: 'High',
  status: 'AI Draft Ready',
  actions: ['Approve Draft', 'Edit', 'Ask AI']
}, {
  title: 'Wrong size received',
  product: 'Slim Fit Chino',
  store: 'Lulu Store',
  issue: 'Wrong Item',
  rating: 2,
  severity: 'High',
  status: 'Response Pending',
  actions: ['Publish', 'Edit', 'Ask AI']
}];
function Stars({
  rating
}: {
  rating: number;
}) {
  return <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map(star => <span key={star} className={star <= rating ? 'text-foreground' : 'text-foreground'} aria-hidden="true">★</span>)}</span>;
}
function Badge({
  children,
  tone = 'gray',
  ai = false
}: {
  children: string;
  tone?: string;
  ai?: boolean;
}) {
  const tones: Record<string, string> = {
    green: 'bg-secondary text-foreground',
    amber: 'bg-secondary text-foreground',
    violet: 'bg-secondary text-foreground',
    blue: 'bg-secondary text-foreground',
    red: 'bg-chart-5/10 text-chart-5',
    orange: 'bg-secondary text-foreground',
    emerald: 'bg-secondary text-foreground',
    gray: 'bg-secondary text-muted-foreground'
  };
  return <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${tones[tone] ?? tones.gray}`}>{ai && <span className="rounded bg-secondary px-1 text-[9px] font-bold tracking-wide">AI</span>}{children}</span>;
}
export function LuluReviewsPage() {
  const [attentionOpen, setAttentionOpen] = useState(true);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [query, setQuery] = useState('');
  const [chips, setChips] = useState(['Rating: 4-5 Stars', 'Status: Unanswered']);
  const [prompt, setPrompt] = useState('');
  const visibleReviews = useMemo(() => reviews.filter(review => `${review.title} ${review.product} ${review.customer}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <main className="min-h-screen bg-[var(--background)] text-foreground" style={{
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
  }}>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[72px] flex-col items-center border-r border-border bg-[var(--sidebar)] py-5 md:flex" aria-label="Primary navigation">
        <div className="mb-8 flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles size={18} /></div>
        <LuluSectionNavigation activeId="daring-brook-9034" />
        <div className="mt-auto flex flex-col gap-3"><button className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground hover:bg-secondary hover:text-foreground" aria-label="Help"><CircleHelp size={19} /></button><button className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground hover:bg-secondary hover:text-foreground" aria-label="Settings"><Settings size={19} /></button><div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar text-xs font-bold text-foreground">JD</div></div>
      </aside>
      <section className="min-h-screen md:pl-[72px]">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-5 md:px-8"><div className="flex items-center gap-3"><button className="text-foreground md:hidden" aria-label="Open navigation"><PanelLeft size={20} /></button><div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">Ecommerce</span><ChevronRight size={14} className="text-foreground" /><span className="font-semibold">Reviews</span></div></div><div className="flex items-center gap-4"><button aria-label="Notifications" className="text-foreground hover:text-foreground"><Bell size={19} /></button><span className="hidden text-sm text-muted-foreground sm:inline">Jordan Davis</span><div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">JD</div></div></header>
        <div className="mx-auto max-w-[1600px] px-5 py-7 md:px-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">Customer voice</p><h1 className="text-3xl font-bold tracking-tight">Reviews</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Manage customer reviews, responses and review activity across your connected ecommerce stores.</p></div><div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary focus:outline-none focus:ring-2 focus:ring-ring"><Sparkles size={16} />Ask Lulu AI</button><button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-card focus:outline-none focus:ring-2 focus:ring-ring"><RefreshCw size={15} />Refresh</button><button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-card"><Download size={15} />Export</button><button className="rounded-lg px-3 py-2.5 text-foreground hover:bg-card" aria-label="More actions"><MoreHorizontal size={19} /></button></div></div>

          <section className="mt-7 rounded-lg border border-border bg-card p-4" aria-label="Review toolbar"><div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between"><div className="flex flex-wrap gap-2"><label className="relative"><span className="sr-only">Store selector</span><select className="h-10 appearance-none rounded-lg border border-border bg-card py-2 pl-3 pr-9 text-sm font-medium outline-none focus:ring-2 focus:ring-ring"><option>All Stores</option><option>Lulu Store · Shopify · Connected</option><option>Style and Co · WooCommerce · Connected</option><option>Webflow Shop · Webflow · Pending</option></select><ChevronDown size={15} className="pointer-events-none absolute right-3 top-3 text-muted-foreground" /></label><label className="relative"><span className="sr-only">Date range selector</span><select className="h-10 appearance-none rounded-lg border border-border bg-card py-2 pl-3 pr-9 text-sm font-medium outline-none focus:ring-2 focus:ring-ring"><option>Last 30 Days</option><option>Today</option><option>Yesterday</option><option>Last 7 Days</option><option>Last 90 Days</option><option>Year to Date</option><option>Custom Range</option></select><ChevronDown size={15} className="pointer-events-none absolute right-3 top-3 text-muted-foreground" /></label></div><div className="flex flex-col gap-2 sm:flex-row"><label className="relative"><Search size={16} className="absolute left-3 top-3 text-muted-foreground" /><span className="sr-only">Search reviews products customers</span><input value={query} onChange={event => setQuery(event.target.value)} className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring sm:w-72" placeholder="Search reviews products customers" /></label><button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm font-semibold text-foreground hover:bg-card"><Filter size={15} />Filters <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] text-foreground">2</span></button></div></div><div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">{chips.map(chip => <span key={chip} className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground">{chip}<button onClick={() => setChips(chips.filter(item => item !== chip))} aria-label={`Remove ${chip} filter`}><X size={13} /></button></span>)}<button onClick={() => setChips([])} className="text-xs font-semibold text-foreground hover:text-foreground">Clear all</button></div></section>

          <section className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-6">{[['Total Reviews', '2,847', 'Across all stores', 'border-border'], ['New Reviews', '34', 'Last 30 days', 'border-border'], ['Unanswered', '127', 'Require response', 'border-chart-1'], ['Negative Reviews', '43', 'One to two star ratings', 'border-chart-5'], ['Needs Attention', '18', 'Action required', 'border-chart-1'], ['AI Response Ready', '89', 'Drafts prepared', 'border-border']].map(([label, value, detail, accent]) => <article key={label} className={`rounded-lg border border-border border-l-4 ${accent} bg-card p-4 ${label === 'AI Response Ready' ? 'bg-secondary/50' : ''}`}><div className="flex items-center justify-between"><p className="text-xs font-semibold text-muted-foreground">{label}</p>{label === 'AI Response Ready' && <Sparkles size={15} className="text-foreground" />}</div><p className="mt-2 text-2xl font-bold tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></article>)}</section>

          <section className="mt-7 rounded-lg border border-border bg-card" aria-labelledby="attention-heading"><button onClick={() => setAttentionOpen(!attentionOpen)} className="flex w-full items-center justify-between px-5 py-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring"><span className="flex items-center gap-3"><h2 id="attention-heading" className="text-base font-bold">Reviews Requiring Attention</h2><span className="rounded-full bg-chart-5/10 px-2 py-0.5 text-xs font-bold text-chart-5">18</span></span><ChevronDown size={18} className={`text-muted-foreground transition-transform ${attentionOpen ? '' : '-rotate-90'}`} /></button>{attentionOpen && <div className="overflow-x-auto border-t border-border"><table className="w-full min-w-[940px] text-left text-xs"><thead className="bg-card text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Review', 'Product', 'Store', 'Issue', 'Severity', 'Status', 'Actions'].map(head => <th key={head} scope="col" className="px-5 py-3 font-semibold">{head}</th>)}</tr></thead><tbody>{attentionRows.map(row => <tr key={row.title} className="border-t border-border transition hover:bg-card"><td className="max-w-[240px] px-5 py-4 font-semibold text-foreground"><div>{row.title}</div><div className="mt-1 flex items-center gap-2"><Stars rating={row.rating} /><span className="rounded bg-secondary px-1 text-[9px] font-bold text-muted-foreground">AI</span></div></td><td className="px-5 py-4 text-muted-foreground">{row.product}</td><td className="px-5 py-4 text-muted-foreground">{row.store}</td><td className="px-5 py-4 text-muted-foreground">{row.issue}</td><td className="px-5 py-4"><Badge tone={row.severity === 'Critical' ? 'red' : 'orange'}>{row.severity}</Badge></td><td className="px-5 py-4"><Badge tone={row.status === 'Unanswered' ? 'amber' : row.status === 'AI Draft Ready' ? 'violet' : 'blue'} ai={row.status === 'AI Draft Ready'}>{row.status}</Badge></td><td className="px-5 py-4"><div className="flex gap-1.5">{row.actions.map(action => <button key={action} className="rounded-md border border-border px-2 py-1.5 font-semibold text-foreground hover:border-border hover:text-foreground">{action}</button>)}</div></td></tr>)}</tbody></table></div>}</section>

          <section className="mt-7 rounded-lg border border-border bg-card" aria-labelledby="reviews-heading"><div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><h2 id="reviews-heading" className="text-base font-bold">Reviews</h2><span className="text-sm text-muted-foreground">2,847 total</span></div><div className="flex items-center gap-3"><span className="text-xs text-muted-foreground">Sort: <strong className="text-muted-foreground">Newest</strong></span><div className="flex rounded-md border border-border p-0.5"><button onClick={() => setView('table')} className={`rounded p-1.5 ${view === 'table' ? 'bg-secondary text-foreground' : 'text-foreground'}`} aria-label="Table view"><List size={15} /></button><button onClick={() => setView('grid')} className={`rounded p-1.5 ${view === 'grid' ? 'bg-secondary text-foreground' : 'text-foreground'}`} aria-label="Grid view"><Grid2X2 size={15} /></button></div></div></div>{view === 'table' ? <div className="overflow-x-auto"><table className="w-full min-w-[1200px] text-left text-xs"><thead className="bg-secondary text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th scope="col" className="px-5 py-3"><input type="checkbox" aria-label="Select all reviews" /></th>{['Review', 'Rating', 'Product', 'Customer', 'Store', 'Date', 'Response', 'Status', 'AI Classification', 'Updated', 'Actions'].map(head => <th key={head} scope="col" className="px-3 py-3 font-semibold">{head}{['Rating', 'Date', 'Updated'].includes(head) && <span className="ml-1">↕</span>}</th>)}</tr></thead><tbody>{visibleReviews.map(review => <tr key={review.id} className={`border-t border-border transition hover:bg-secondary/30 ${review.rowTone === 'red' ? 'bg-chart-5/60' : review.rowTone === 'amber' ? 'bg-chart-1/60' : ''}`}><td className="px-5 py-4"><input type="checkbox" aria-label={`Select review ${review.id}`} /></td><td className="max-w-[260px] px-3 py-4"><p className="font-semibold text-foreground">{review.title}</p><p className="mt-1 truncate text-muted-foreground">{review.text}</p><p className="mt-1 text-[10px] text-muted-foreground">Review #{review.id}</p></td><td className="px-3 py-4"><Stars rating={review.rating} /></td><td className="px-3 py-4 font-medium text-foreground">{review.product}</td><td className="px-3 py-4 text-muted-foreground">{review.customer}</td><td className="px-3 py-4 text-muted-foreground">{review.store}</td><td className="whitespace-nowrap px-3 py-4 text-muted-foreground">{review.date.replace(', 2024', '')}</td><td className="px-3 py-4"><Badge tone={review.response === 'Responded' ? 'green' : review.response === 'AI Draft Ready' ? 'violet' : 'amber'} ai={review.response === 'AI Draft Ready'}>{review.response}</Badge></td><td className="px-3 py-4"><Badge tone="gray">Published</Badge></td><td className="px-3 py-4"><Badge tone={review.tone === 'positive' ? 'emerald' : review.tone === 'negative' ? 'red' : 'amber'} ai>{review.classification}</Badge></td><td className="whitespace-nowrap px-3 py-4 text-muted-foreground">{review.date.replace('Aug ', 'Aug ').replace(', 2024', '')}</td><td className="px-3 py-4"><button aria-label={`More actions for review ${review.id}`} className="rounded p-1.5 text-foreground hover:bg-secondary hover:text-foreground"><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div> : <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">{visibleReviews.map(review => <article key={review.id} className="rounded-lg border border-border p-4"><div className="flex justify-between"><Stars rating={review.rating} /><Badge tone={review.tone === 'positive' ? 'emerald' : review.tone === 'negative' ? 'red' : 'amber'} ai>{review.classification}</Badge></div><h3 className="mt-3 font-semibold">{review.title}</h3><p className="mt-1 text-sm text-muted-foreground">{review.text}</p><p className="mt-4 text-xs text-muted-foreground">{review.customer} · {review.product}</p><div className="mt-3"><Badge tone={review.response === 'Responded' ? 'green' : review.response === 'AI Draft Ready' ? 'violet' : 'amber'} ai={review.response === 'AI Draft Ready'}>{review.response}</Badge></div></article>)}</div>}<div className="flex flex-col gap-3 border-t border-border px-5 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>Showing 1–25 of 2,847</span><div className="flex items-center gap-1"><button aria-label="Previous page" className="rounded p-1.5 hover:bg-secondary"><ChevronLeft size={15} /></button>{[1, 2, 3, 4, 5, 24].map(page => <button key={page} className={`h-7 min-w-7 rounded px-2 ${page === 1 ? 'bg-primary font-semibold text-primary-foreground' : 'hover:bg-secondary'}`}>{page}</button>)}<button aria-label="Next page" className="rounded p-1.5 hover:bg-secondary"><ChevronRight size={15} /></button><select className="ml-3 rounded border border-border bg-card px-2 py-1.5" aria-label="Reviews per page"><option>25 / page</option><option>50 / page</option><option>100 / page</option></select></div></div></section>

          <section className="mt-7 grid gap-5 xl:grid-cols-3">
            <article className="rounded-lg border border-border border-l-4 border-l-border bg-card p-5"><div className="flex items-center gap-2"><Sparkles size={17} className="text-foreground" /><h2 className="font-bold">Ask Lulu AI</h2></div><div className="mt-4 rounded-lg bg-secondary p-4"><div className="flex items-start gap-3"><Bot size={18} className="mt-0.5 text-foreground" /><div><h3 className="text-sm font-bold text-foreground">Shipping delays are trending</h3><p className="mt-1 text-xs leading-5 text-foreground">8 reviews mention shipping delays across 2 stores and 3 products. Reviews var(--chart-4), var(--chart-4) and var(--chart-4) may need follow-up.</p><p className="mt-2 text-[10px] text-foreground">AI-generated analysis · Not verified</p><button className="mt-3 rounded-md bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-sm hover:bg-secondary">View Reviews</button></div></div></div><div className="mt-4 flex gap-2 overflow-x-auto pb-1">{prompts.map(item => <button key={item} onClick={() => setPrompt(item)} className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-[11px] text-foreground hover:border-border hover:text-foreground">{item}</button>)}</div><div className="mt-4 flex items-center gap-2 rounded-lg border border-border p-2"><input value={prompt} onChange={event => setPrompt(event.target.value)} className="min-w-0 flex-1 bg-transparent px-2 text-xs outline-none" placeholder="Ask Lulu AI about your reviews" /><button aria-label="Send prompt" className="rounded-md bg-primary p-2 text-primary-foreground hover:bg-primary"><Send size={14} /></button></div></article>
            <article className="rounded-lg border border-border bg-card p-5"><div className="flex items-center justify-between"><h2 className="font-bold">Review Operations Health</h2><button aria-label="Health details" className="text-foreground"><MoreHorizontal size={18} /></button></div><div className="mt-4 grid grid-cols-2 gap-2">{['Review Synchronization', 'Unanswered Reviews', 'Response Publishing', 'Moderation', 'AI Response Generation', 'Platform Connectivity'].map(label => <div key={label} className="rounded-lg bg-card p-3"><div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground"><span className={`h-2 w-2 rounded-full ${label === 'Unanswered Reviews' ? 'bg-chart-1' : 'bg-chart-4'}`} />{label}</div><p className={`mt-1 text-[10px] font-bold ${label === 'Unanswered Reviews' ? 'text-chart-1' : 'text-chart-4'}`}>{label === 'Unanswered Reviews' ? 'Attention Required' : 'Healthy'}</p></div>)}</div><div className="my-4 border-t border-border" /><h3 className="text-xs font-bold">Review Synchronization</h3><div className="mt-2 space-y-2">{[['Lulu Store', 'Synced', '2 min ago', '8 new'], ['Style and Co', 'Synced', '5 min ago', '4 new'], ['Webflow Shop', 'Delayed', '2 hours ago', '1 delayed']].map(([store, status, time, count]) => <div key={store} className="flex items-center justify-between text-xs"><span className="font-medium text-foreground">{store}</span><span className={status === 'Delayed' ? 'text-chart-1' : 'text-foreground'}>{status}</span><span className="text-muted-foreground">{time}</span><span className="text-muted-foreground">{count}</span></div>)}</div><div className="mt-4 flex items-center justify-between"><button className="text-xs font-semibold text-foreground hover:text-foreground">Open Integrations <ExternalLink className="ml-1 inline" size={12} /></button><button className="text-xs font-semibold text-foreground hover:text-foreground">Retry Sync</button></div></article>
            <article className="rounded-lg border border-border bg-card p-5"><div className="flex items-center justify-between"><h2 className="font-bold">Recent Review Activity</h2><button aria-label="Activity options" className="text-foreground"><MoreHorizontal size={18} /></button></div><ol className="mt-5 space-y-4">{[['AI response generated for review 1842', 'Lulu AI', '2 min ago', 'violet'], ['Review 1901 synchronized', 'System', '5 min ago', 'gray'], ['Response approved for review 1798', 'Admin', '12 min ago', 'gray'], ['Review 1887 flagged', 'Admin', '1 hour ago', 'gray'], ['AI classification generated for 12 reviews', 'Lulu AI', '2 hours ago', 'violet']].map(([event, by, time, tone]) => <li key={event} className="flex gap-3"><span className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${tone === 'violet' ? 'bg-secondary text-foreground' : 'bg-secondary text-muted-foreground'}`}>{tone === 'violet' ? <Sparkles size={12} /> : <Check size={12} />}</span><div className="min-w-0"><p className="text-xs font-semibold text-foreground">{event}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{by} · {time}</p></div></li>)}</ol><button className="mt-5 text-xs font-semibold text-foreground hover:text-foreground">View All Activity <ChevronRight className="ml-1 inline" size={13} /></button></article>
          </section>
        </div>
      </section>
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
            return <a key={page.id} href={`#${page.id}`} aria-current={isActivePage ? 'page' : undefined} className={`block rounded-md px-3 py-2 text-xs transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {page.label}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}