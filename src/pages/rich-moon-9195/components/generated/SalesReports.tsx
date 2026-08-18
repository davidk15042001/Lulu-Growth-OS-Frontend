import { useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, Archive, ArrowDownToLine, ArrowUpRight, BarChart3, Bell, Box, CalendarDays, Check, CheckCircle2, CheckSquare2, ChevronDown, CircleHelp, Clock3, Copy, Download, Ellipsis, FileBarChart, Filter, Filter as Funnel, FolderOpen, Gauge, KanbanSquare, LayoutDashboard, ListFilter, Map, Menu, MoreHorizontal, Package, Pencil, Pin, Plus, Search, Settings, Share2, ShieldCheck, SlidersHorizontal, Sparkles, Target, TrendingUp, Users, UsersRound, X, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
type Report = {
  name: string;
  category: string;
  owner: string;
  updated: string;
  schedule: string;
  shared: string;
  status: 'Active' | 'Draft' | 'Archived';
  views: number;
  ai?: boolean;
};
type Category = {
  label: string;
  count: number;
  icon: LucideIcon;
  tone: string;
};
type ActivityItem = {
  person: string;
  action: string;
  report: string;
  detail?: string;
  time: string;
  ai?: boolean;
};
const reports: Report[] = [];
const categories: Category[] = [];
const activities: ActivityItem[] = [];
const navGroups = [{
  label: 'Workspace',
  items: [['Overview', LayoutDashboard], ['Executive Dashboard', Gauge]]
}, {
  label: 'Sales',
  items: [['Leads', Users], ['Opportunities', Target], ['Pipeline', KanbanSquare], ['Deals', CheckCircle2], ['Activities', Activity], ['Forecast', BarChart3], ['Analytics', FileBarChart], ['Sales Reports', FileBarChart], ['Automation', Zap], ['Playbooks', FolderOpen]]
}];
function Sparkline({
  reverse = false
}: {
  reverse?: boolean;
}) {
  return <svg viewBox="0 0 92 28" aria-hidden="true" className="h-7 w-24"><path d={reverse ? 'M1 7 C15 10, 19 5, 29 13 S45 19, 56 12 S73 18, 91 22' : 'M1 22 C13 20, 18 17, 27 19 S44 11, 54 14 S72 4, 91 6'} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
}
function Badge({
  children,
  tone = 'default'
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  const styles = tone === 'active' ? 'border-[color:var(--success-border)] bg-[var(--success-bg)] text-[var(--success)]' : tone === 'draft' ? 'border-border bg-muted text-muted-foreground' : tone === 'archived' ? 'border-border bg-background text-muted-foreground' : tone === 'ai' ? 'border-[color:var(--ai-border)] bg-[var(--ai-bg)] text-[var(--ai)]' : 'border-border bg-muted/60 text-muted-foreground';
  return <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium ${styles}`}>{children}</span>;
}
function Sidebar({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  return <aside className={`${open ? 'w-[244px]' : 'w-[72px]'} shrink-0 border-r border-border bg-card px-3 py-4 transition-all duration-200 max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-20 ${open ? 'max-md:w-[244px]' : 'max-md:-translate-x-full'}`}>
    <div className="mb-8 flex items-center justify-between px-2"><div className="flex items-center gap-2.5"><div className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={17} /></div>{open && <strong className="text-lg tracking-tight">lulu<span className="text-foreground">.</span></strong>}</div><button onClick={() => setOpen(!open)} aria-label="Collapse sidebar" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted max-md:hidden"><Menu size={17} /></button></div>
    <LuluSectionNavigation activeId="rich-moon-9195" />
    {open && <div className="absolute inset-x-3 bottom-4 border-t border-border pt-4"><button className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-muted"><span className="grid size-8 place-items-center rounded-full bg-[var(--sidebar-accent)] text-xs font-semibold text-[var(--sidebar-foreground)]">DC</span><span><strong className="block text-sm">—</strong><span className="text-xs text-muted-foreground">Admin</span></span><ChevronDown size={15} className="ml-auto text-muted-foreground" /></button></div>}
  </aside>;
}
export function SalesReports() {
  const { items: liveReports, loading: liveLoading, error: liveError } = useLiveRecords('sales_reports');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const liveReportRows: Report[] = liveReports.map((record) => {
    const fields = record as unknown as Record<string, unknown>;
    return {
      name: String(record.name ?? fields.title ?? 'Untitled report'),
      category: String(fields.category ?? 'Uncategorized'),
      owner: String(fields.owner ?? '—'),
      updated: String(record.updatedAt ?? fields.updated_at ?? '—'),
      schedule: String(fields.schedule ?? '—'),
      shared: String(fields.shared ?? '—'),
      status: record.status === 'Draft' || record.status === 'Archived' ? record.status : 'Active',
      views: Number(fields.views ?? 0),
      ai: Boolean(fields.ai),
    };
  });

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [favorite, setFavorite] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const filteredReports = liveReportRows.filter(report => report.name.toLowerCase().includes(query.toLowerCase()));
  return <div className="flex min-h-screen bg-background text-foreground"><Sidebar open={sidebarOpen} setOpen={setSidebarOpen} /><main className="min-w-0 flex-1"><header className="sticky top-0 z-10 border-b border-border bg-background/95 px-5 py-4 backdrop-blur md:px-8"><div className="mx-auto flex max-w-[1440px] items-start justify-between gap-4"><div className="flex items-start gap-3"><button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle navigation" className="mt-1 rounded-md p-1.5 text-muted-foreground hover:bg-muted md:hidden"><Menu size={20} /></button><div><div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground"><span>Sales</span><span>/</span><span className="text-foreground">Sales Reports</span></div><h1 className="text-2xl font-bold tracking-tight md:text-3xl">Sales Reports</h1><p className="mt-1 text-sm text-muted-foreground">Build, analyze and share structured reports across your sales organization.</p></div></div><div className="flex shrink-0 flex-wrap justify-end gap-2"><button className="hidden items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-semibold text-foreground sm:flex"><Sparkles size={16} />Ask Lulu AI</button><button className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted sm:flex"><ArrowDownToLine size={16} />Import</button><button className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted lg:flex"><Download size={16} />Export</button><button aria-label="More actions" className="rounded-lg border border-border bg-card p-2 hover:bg-muted"><MoreHorizontal size={18} /></button><button className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"><Plus size={16} />Create Report</button></div></div></header>
  <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-6 md:px-8">
    <section aria-label="Report summary" className="flex gap-3 overflow-x-auto pb-1">{[['Total Reports', String(liveReportRows.length), 'Recorded'], ['Scheduled Reports', String(liveReportRows.filter(report => report.schedule !== '—' && report.schedule !== 'None').length), 'Active schedules'], ['Shared Reports', String(liveReportRows.filter(report => report.shared !== '—').length), 'Shared'], ['Recently Updated', String(liveReportRows.length), 'Recorded'], ['Most Viewed', liveReportRows.length ? String(Math.max(...liveReportRows.map(report => report.views))) : '—', 'Views'], ['AI Reports', String(liveReportRows.filter(report => report.ai).length), 'AI-generated']].map(([label, value, sub], index) => <article key={label} className="min-w-[178px] flex-1 rounded-xl border border-border bg-card p-4 shadow-sm"><div className="flex items-start justify-between"><p className="text-xs font-medium text-muted-foreground">{label}</p>{index === 5 ? <Sparkles size={15} className="text-foreground" /> : <span className="text-xs text-[var(--success)]">{liveReportRows.length > 0 && index < 4 ? 'Live' : ''}</span>}</div><strong className={`${index === 4 ? 'mt-3 text-base' : 'mt-2 text-2xl'} block tracking-tight`}>{value}</strong><div className="mt-2 flex items-center justify-between text-xs text-muted-foreground"><span>{sub}</span>{index < 4 && <Sparkline reverse={index === 3} />}</div></article>)}</section>
    {liveError && <div className="mb-4 rounded-lg border border-chart-5/30 bg-chart-5/5 px-4 py-3 text-sm text-chart-5">{liveError}</div>}
    {!liveLoading && liveReportRows.length === 0 && <div className="mb-4 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No live sales reports have been created yet.</div>}
    <section className="rounded-xl border border-border bg-card p-3 shadow-sm"><div className="flex flex-wrap items-center gap-2"><label className="relative min-w-[220px] flex-1"><Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search reports..." aria-label="Search reports" className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 ring-ring" /></label>{['Category', 'Owner', 'Status', 'Schedule', 'Shared', 'Last Updated'].map(filter => <button key={filter} onClick={() => setActiveFilter(activeFilter === filter ? '' : filter)} className={`flex h-9 items-center gap-2 rounded-lg border px-3 text-sm ${activeFilter === filter ? 'border-border bg-secondary text-foreground' : 'border-input text-muted-foreground hover:bg-muted'}`}>{filter}<ChevronDown size={14} /></button>)}<button onClick={() => {
              setQuery('');
              setActiveFilter('');
            }} className="h-9 px-2 text-sm text-muted-foreground hover:text-foreground">Clear Filters</button><button className="h-9 rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted">Save Filter</button></div></section>
    <section><div className="mb-3 flex items-center gap-2"><Pin size={16} className="text-foreground" /><h2 className="text-base font-semibold">Favorites</h2><span className="text-xs text-muted-foreground">{Math.min(liveReportRows.length, 3)} pinned reports</span></div><div className="grid gap-3 md:grid-cols-3">{liveReportRows.slice(0, 3).map(report => <article key={report.name} className="group rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-border"><div className="flex items-start justify-between"><div><h3 className="font-semibold">{report.name}</h3><div className="mt-2"><Badge>{report.category}</Badge></div></div><button onClick={() => setFavorite(favorite === report.name ? null : report.name)} aria-label={`Unpin ${report.name}`} className={`rounded-md p-1.5 ${favorite === report.name ? 'text-foreground' : 'text-muted-foreground'} hover:bg-muted`}><Pin size={15} fill={favorite === report.name ? 'currentColor' : 'none'} /></button></div><div className="mt-5 flex items-center justify-between text-xs text-muted-foreground"><span className="flex items-center gap-2"><span className="grid size-6 place-items-center rounded-full bg-[var(--sidebar-accent)] text-[10px] font-semibold">{report.owner.split(' ').map(part => part[0]).join('')}</span>{report.owner} · {report.updated}</span><span className="flex gap-1 opacity-0 transition group-hover:opacity-100"><button aria-label="Open report" className="rounded p-1 hover:bg-muted"><ArrowUpRight size={15} /></button><button aria-label="Export report" className="rounded p-1 hover:bg-muted"><Download size={15} /></button><button aria-label="Share report" className="rounded p-1 hover:bg-muted"><Share2 size={15} /></button></span></div></article>)}</div></section>
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 className="font-semibold">All reports</h2><p className="mt-0.5 text-xs text-muted-foreground">{filteredReports.length} of {liveReportRows.length} reports</p></div><button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted"><Filter size={15} />Filters</button></div><div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left text-sm"><thead className="bg-muted/40 text-xs text-muted-foreground"><tr>{['Report', 'Category', 'Owner', 'Last Updated', 'Schedule', 'Shared With', 'Status', 'Views', 'Actions'].map(heading => <th key={heading} scope="col" className="whitespace-nowrap px-5 py-3 font-medium">{heading}{heading === 'Last Updated' && <ChevronDown size={13} className="ml-1 inline" />}</th>)}</tr></thead><tbody className="divide-y divide-border">{filteredReports.map(report => <tr key={report.name} className="group hover:bg-muted/30"><td className="px-5 py-3.5"><div className="flex items-center gap-2 font-medium">{report.ai && <Sparkles size={14} className="text-foreground" />}{report.name}</div></td><td className="px-5 py-3.5"><Badge>{report.category}</Badge></td><td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">{report.owner}</td><td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">{report.updated}</td><td className="px-5 py-3.5">{report.schedule !== 'None' ? <span className="flex items-center gap-1.5 text-foreground"><CalendarDays size={14} className="text-[var(--info)]" />{report.schedule}</span> : <span className="text-muted-foreground">None</span>}</td><td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">{report.shared}</td><td className="px-5 py-3.5"><Badge tone={report.status.toLowerCase()}>{report.status}</Badge></td><td className="px-5 py-3.5 text-muted-foreground">{report.views}</td><td className="px-5 py-3.5"><button aria-label={`Actions for ${report.name}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Ellipsis size={17} /></button></td></tr>)}</tbody></table></div></section>
    <section><div className="mb-3 flex items-center justify-between"><div><h2 className="font-semibold">Report categories</h2><p className="mt-0.5 text-xs text-muted-foreground">Explore your reporting library by team need.</p></div><button className="text-sm font-medium text-foreground hover:underline">View all</button></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">{(liveLoading ? [] : categories).map(category => <button key={category.label} className="rounded-xl border border-border bg-card p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-border"><span className="mb-4 grid size-8 place-items-center rounded-lg" style={{
                color: category.tone,
                backgroundColor: 'var(--muted)'
              }}><category.icon size={16} /></span><strong className="block text-sm leading-tight">{category.label}</strong><span className="mt-1 block text-xs text-muted-foreground">{category.count} reports</span>{category.label === 'Custom Reports' && <Badge tone="ai"><Sparkles size={11} />AI</Badge>}</button>)}</div></section>
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]"><section className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="mb-5 flex items-center gap-2"><Activity size={17} className="text-muted-foreground" /><h2 className="font-semibold">Recent Activity</h2></div><div className="space-y-4">{(liveLoading ? [] : activities).map(item => <div key={`${item.person}-${item.report}`} className="flex items-start gap-3"><span className={`grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${item.ai ? 'bg-secondary text-foreground' : 'bg-[var(--sidebar-accent)]'}`}>{item.ai ? <Sparkles size={14} /> : item.person}</span><p className="min-w-0 flex-1 text-sm leading-5"><span className="font-medium">{item.ai ? 'AI' : ({
                      DC: '—',
                      SK: '—',
                      EV: '—',
                      MR: '—'
                    } as Record<string, string>)[item.person]}</span>{' '}{item.action}{' '}<strong>{item.report}</strong>{item.detail && <span className="text-muted-foreground"> {item.detail}</span>}<span className="ml-2 whitespace-nowrap text-xs text-muted-foreground">{item.time}</span></p></div>)}</div></section><section className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-start justify-between"><div className="flex items-center gap-2"><ShieldCheck size={18} className="text-[var(--success)]" /><h2 className="font-semibold">Report Data Quality</h2></div><button aria-label="Data quality help" className="text-muted-foreground"><CircleHelp size={16} /></button></div><div className="mt-5 flex items-center gap-5"><div className="grid size-24 place-items-center rounded-full" style={{
                background: 'conic-gradient(var(--success) 84%, var(--muted) 0)'
              }}><div className="grid size-[76px] place-items-center rounded-full bg-card"><strong className="text-xl">84</strong><span className="-mt-2 text-[10px] text-muted-foreground">/100</span></div></div><div><p className="text-sm font-semibold">Good data health</p><p className="mt-1 text-xs text-muted-foreground">4 areas need attention</p></div></div><ul className="mt-5 space-y-2.5 text-sm">{['Missing close dates: 12 deals', 'Incomplete company records: 8 entries', 'Missing owners: 5 leads', 'Duplicate contacts: 3 detected'].map(issue => <li key={issue} className="flex items-center gap-2 text-muted-foreground"><span className="size-1.5 rounded-full bg-[var(--warning)]" />{issue}</li>)}</ul><p className="mt-5 text-[11px] leading-4 text-muted-foreground">Data quality score reflects CRM completeness. A higher score does not guarantee report accuracy.</p><button className="mt-4 w-full rounded-lg border border-border py-2 text-sm font-semibold hover:bg-muted">Review Data Issues</button></section></div>
    <section className="rounded-xl border border-border bg-secondary p-5 shadow-sm md:p-6"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><Sparkles size={18} className="text-foreground" /><h2 className="font-semibold">Ask Lulu AI</h2></div><p className="mt-1 text-sm text-muted-foreground">Ask Lulu AI about your sales reports or generate a new report with AI.</p></div><Badge tone="ai">AI assistant</Badge></div><div className="mt-5 flex gap-2 rounded-xl border border-border bg-card p-2"><input value={aiPrompt} onChange={event => setAiPrompt(event.target.value)} placeholder="Ask Lulu AI about this report or describe a report to generate..." className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" aria-label="Ask Lulu AI" /><button aria-label="Send prompt" className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground hover:opacity-90"><ArrowUpRight size={17} /></button></div><div className="mt-3 flex flex-wrap gap-2">{['Explain this report', 'What changed this quarter?', 'Show revenue by rep', 'Compare to last period', 'Summarize for management', 'Generate a report'].map(prompt => <button key={prompt} onClick={() => setAiPrompt(prompt)} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">{prompt}</button>)}</div><p className="mt-5 flex items-center gap-1.5 text-[11px] text-muted-foreground"><Check size={13} className="text-[var(--success)]" />AI-generated · Lulu AI uses actual report data</p></section>
  </div></main></div>;
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
          <span data-lulu-section-soon={section.label !== "Website" ? "true" : undefined}>{section.label}</span>
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
