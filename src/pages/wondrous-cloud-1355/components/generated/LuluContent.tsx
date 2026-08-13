import { useState } from 'react';
import { AlertTriangle, Bell, CalendarDays, ChevronDown, ChevronRight, FileText, LayoutGrid, List, Menu, Plus, Search, Sparkles, X } from 'lucide-react';
type Item = {
  title: string;
  type: string;
  status: string;
  campaign: string;
  audience: string;
  score: string;
  updated: string;
};
const items: Item[] = [{
  title: 'Ultimate Guide to E-Commerce Growth',
  type: 'Blog Article',
  status: 'Published',
  campaign: 'Summer Growth Campaign',
  audience: 'High-Value Customers',
  score: '92',
  updated: 'Today'
}, {
  title: 'Q4 Product Launch Landing Page',
  type: 'Landing Page',
  status: 'Scheduled',
  campaign: 'Product Launch Q4',
  audience: 'All Users',
  score: '85',
  updated: 'Yesterday'
}, {
  title: 'Customer Success Story — Acme Corp',
  type: 'Case Study',
  status: 'Review',
  campaign: 'Brand Awareness',
  audience: 'Enterprise',
  score: '—',
  updated: '2 days ago'
}, {
  title: '10 Ways AI Transforms Operations',
  type: 'Blog Article',
  status: 'Draft',
  campaign: '—',
  audience: 'SMB Leaders',
  score: '—',
  updated: '3 days ago'
}, {
  title: 'Holiday Campaign Email Series',
  type: 'Email',
  status: 'Approved',
  campaign: 'Holiday Campaign',
  audience: 'Loyal Customers',
  score: '71',
  updated: '1 week ago'
}, {
  title: 'LinkedIn Thought Leadership Post',
  type: 'Social Post',
  status: 'Published',
  campaign: 'Brand Q4',
  audience: 'Executives',
  score: '88',
  updated: '5 days ago'
}];
const nav = ['Campaigns', 'Content', 'SEO', 'GEO', 'AEO', 'Audiences', 'Analytics', 'Automations'];
const filterItems = ['Status', 'Content Type', 'Channel', 'Campaign', 'Audience', 'Content Score', 'SEO Status', 'GEO Status', 'AEO Status', 'Date'];
const insights = ['This article generates 3.2× more qualified traffic than similar content', 'Landing page has strong traffic but 23% below-average conversion rate', "Content around 'AI automation' is gaining significant search visibility"];
const tabs = [{
  name: 'List'
}, {
  name: 'Grid'
}, {
  name: 'Calendar'
}];
function Pill({
  value
}: {
  value: string;
}) {
  return <span className="rounded-full border border-chart-4/20 bg-chart-4/10 px-2 py-1 text-[10px] text-foreground">● {value}</span>;
}
function Side({
  open,
  close
}: {
  open: boolean;
  close: () => void;
}) {
  return <aside className={`${open ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-20 w-64 flex-col border-r border-border/[.08] bg-[var(--sidebar)] lg:static lg:flex`}><div className="flex h-[68px] items-center gap-3 border-b border-border/[.08] px-5"><div className="rounded-lg bg-gradient-to-br from-primary to-primary p-2 text-primary-foreground"><Sparkles size={16} /></div><strong className="text-lg text-foreground">lulu<span className="text-foreground">.ai</span></strong><button className="ml-auto lg:hidden" onClick={close}><X size={18} /></button></div><nav className="p-4"><p className="mb-4 text-[10px] uppercase tracking-widest text-muted-foreground">Marketing</p>{nav.map(item => <button key={item} className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs ${item === 'Content' ? 'bg-secondary/10 text-foreground' : 'text-foreground'}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{item}</button>)}</nav><div className="mt-auto m-3 rounded-xl border border-border/15 bg-secondary/[.08] p-4"><p className="text-xs font-semibold text-foreground"><Sparkles size={14} className="mr-2 inline" />Lulu Intelligence</p><p className="mt-2 text-[11px] leading-5 text-muted-foreground">Your content ecosystem is 86% healthy this week.</p></div></aside>;
}
export function LuluContent() {
  const [view, setView] = useState('List');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const filtered = items.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
  return <div className="min-h-screen bg-[var(--background)] text-foreground"><div className="flex min-h-screen"><Side open={open} close={() => setOpen(false)} /><main className="min-w-0 flex-1"><header className="flex h-[68px] items-center justify-between border-b border-border/[.08] px-5"><button className="lg:hidden" onClick={() => setOpen(true)}><Menu size={20} /></button><span className="hidden text-sm text-muted-foreground sm:block">Marketing <ChevronRight size={14} className="inline" /> <b className="text-foreground">Content</b></span><div className="flex items-center gap-4"><Bell size={18} className="text-muted-foreground" /><span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">SC</span></div></header><div className="p-5 sm:p-7"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs text-foreground">Marketing / Content</p><h1 className="text-4xl font-bold tracking-tight text-foreground">Content</h1><p className="mt-2 text-sm text-muted-foreground">Create, manage and optimize content across your marketing ecosystem with AI.</p></div><button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground"><Plus size={15} />Create Content</button></div><div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{[['Total Content', '847'], ['Published', '312'], ['Drafts', '89'], ['Scheduled', '47'], ['Content Score', '78/100'], ['Needs Attention', '23']].map(metric => <article key={metric[0]} className="rounded-xl border border-border/[.08] bg-secondary p-4"><Sparkles size={15} className="mb-3 text-foreground" /><p className="text-2xl font-semibold text-foreground">{metric[1]}</p><p className="mt-1 text-[11px] text-muted-foreground">{metric[0]}</p></article>)}</div><div className="mb-4 rounded-xl border border-border/[.08] bg-[var(--secondary)] p-3"><div className="flex gap-3"><div className="relative flex-1"><Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search content..." className="w-full rounded-lg border border-border bg-primary/10 py-2 pl-9 text-xs text-foreground outline-none" /></div><button className="rounded-lg border border-border px-3 text-xs text-foreground">Saved Filters <ChevronDown size={13} className="inline" /></button></div><div className="mt-3 flex gap-2 overflow-x-auto">{filterItems.map(filter => <button key={filter} className="shrink-0 rounded-full border border-border px-3 py-1.5 text-[11px] text-foreground">{filter}</button>)}</div></div><div className="mb-4 flex gap-1 border-b border-border">{tabs.map(tab => <button key={tab.name} onClick={() => setView(tab.name)} className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs ${view === tab.name ? 'border-border text-foreground' : 'border-transparent text-foreground'}`}>{tab.name}</button>)}]</div><div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]"><section className="overflow-x-auto rounded-xl border border-border/[.08] bg-secondary">{view === 'List' ? <table className="w-full min-w-[850px] text-left"><thead className="border-b border-border text-[10px] uppercase text-muted-foreground"><tr><th className="p-4">Content</th><th>Status</th><th>Campaign</th><th>Audience</th><th>Performance</th><th>Updated</th></tr></thead><tbody className="divide-y divide-white/[.06]">{filtered.map(item => <tr key={item.title} className="hover:bg-secondary/[.05]"><td className="p-4"><div className="flex items-center gap-3"><FileText size={17} className="text-foreground" /><div><p className="text-xs font-medium text-foreground">{item.title}</p><p className="mt-1 text-[10px] text-muted-foreground">{item.type}</p></div></div></td><td><Pill value={item.status} /></td><td className="text-[11px] text-muted-foreground">{item.campaign}</td><td className="text-[11px] text-muted-foreground">{item.audience}</td><td className="text-sm font-semibold text-foreground">{item.score}</td><td className="text-[11px] text-muted-foreground">{item.updated}</td></tr>)}</tbody></table> : <div className="flex min-h-[450px] flex-col items-center justify-center text-center"><LayoutGrid size={32} className="mb-3 text-foreground" /><h2 className="text-sm font-semibold text-foreground">{view} workspace</h2><p className="mt-2 text-xs text-muted-foreground">Your content planning workspace is ready.</p></div>}</section><aside className="space-y-4"><section className="rounded-xl border border-border/15 bg-secondary/[.08] p-4"><h2 className="text-sm font-semibold text-foreground"><Sparkles size={15} className="mr-2 inline text-foreground" />AI Content Insights</h2><p className="mt-2 text-[10px] text-muted-foreground">AI-generated · Updated 2 min ago</p>{insights.map(insight => <div key={insight} className="border-t border-border/[.07] py-4 text-xs leading-5 text-foreground">{insight}<button className="mt-2 block text-[10px] text-foreground">View <ChevronRight size={11} className="inline" /></button></div>)}</section><section className="rounded-xl border border-border bg-secondary p-4"><h2 className="mb-3 text-sm font-semibold text-foreground">Content Opportunities</h2>{['Create content around enterprise AI', 'Repurpose top case study', 'Expand FAQ coverage'].map(item => <div key={item} className="border-t border-border/[.07] py-3 text-[11px] text-foreground">{item}<button className="mt-2 block text-foreground">Create Content</button></div>)}</section><section className="rounded-xl border border-border/15 bg-chart-1/[.04] p-4"><h2 className="text-sm font-semibold text-foreground"><AlertTriangle size={15} className="mr-2 inline text-chart-1" />Content Risks</h2><p className="mt-3 text-[11px] leading-5 text-chart-1/75">Traffic to “Q3 Product Guide” declined 41% in 30 days</p><p className="mt-3 border-t border-chart-1/10 pt-3 text-[11px] text-chart-1/75">7 high-value pages contain outdated product information</p></section></aside></div></div></main></div></div>;
}