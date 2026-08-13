import { useMemo, useState } from 'react';
import { ArrowDownUp, Archive, BarChart3, Bell, Bot, CalendarDays, Check, ChevronDown, ChevronRight, CircleAlert, ClipboardList, Columns3, Copy, Download, Edit3, ExternalLink, Filter, HelpCircle, MoreHorizontal, Pause, Play, Plus, RefreshCw, Search, Settings2, SlidersHorizontal, Sparkles, Tags, Upload, Users, X } from 'lucide-react';
type Campaign = {
  id: string;
  name: string;
  platform: string;
  mark: string;
  tone: string;
  status: string;
  objective: string;
  budget: string;
  spend: string;
  impressions: string;
  clicks: string;
  ctr: string;
  conversions: string;
  cpa: string;
  revenue: string;
  roas: string;
  start: string;
  end: string;
  owner: string;
  updated: string;
  alert?: string;
  tag: string;
};
const campaigns: Campaign[] = [{
  id: 'LULU-0428',
  name: 'Spring product launch',
  platform: 'Meta Ads',
  mark: 'M',
  tone: 'bg-[var(--secondary)] text-[var(--foreground)]',
  status: 'Active',
  objective: 'Sales',
  budget: '$18,000',
  spend: '$12,840',
  impressions: '1.24M',
  clicks: '24,910',
  ctr: '2.01%',
  conversions: '684',
  cpa: '$18.77',
  revenue: '$61,240',
  roas: '4.77x',
  start: 'Mar 01, 2025',
  end: 'Apr 30, 2025',
  owner: 'Olivia Chen',
  updated: '12 min ago',
  tag: 'Product Launch'
}, {
  id: 'LULU-0417',
  name: 'Brand awareness — US',
  platform: 'Google Ads',
  mark: 'G',
  tone: 'bg-[var(--secondary)] text-[var(--foreground)]',
  status: 'Active',
  objective: 'Awareness',
  budget: '$9,500',
  spend: '$6,120',
  impressions: '842K',
  clicks: '11,204',
  ctr: '1.33%',
  conversions: 'No data',
  cpa: 'No data',
  revenue: 'No data',
  roas: 'No data',
  start: 'Feb 15, 2025',
  end: 'May 15, 2025',
  owner: 'Marcus Ito',
  updated: '38 min ago',
  tag: 'Brand'
}, {
  id: 'LULU-0398',
  name: 'Retargeting / high intent',
  platform: 'Meta Ads',
  mark: 'M',
  tone: 'bg-[var(--secondary)] text-[var(--foreground)]',
  status: 'Paused',
  objective: 'Conversions',
  budget: '$7,200',
  spend: '$7,010',
  impressions: '294K',
  clicks: '9,844',
  ctr: '3.35%',
  conversions: '318',
  cpa: '$22.04',
  revenue: '$28,410',
  roas: '4.05x',
  start: 'Jan 08, 2025',
  end: 'Mar 31, 2025',
  owner: 'Olivia Chen',
  updated: '2 hr ago',
  alert: 'CPA rising',
  tag: 'Retargeting'
}, {
  id: 'LULU-0436',
  name: 'Q2 lead generation',
  platform: 'LinkedIn Ads',
  mark: 'in',
  tone: 'bg-[var(--secondary)] text-[var(--foreground)]',
  status: 'Draft',
  objective: 'Leads',
  budget: '$12,000',
  spend: 'No data',
  impressions: 'No data',
  clicks: 'No data',
  ctr: 'No data',
  conversions: 'No data',
  cpa: 'No data',
  revenue: 'No data',
  roas: 'No data',
  start: 'Apr 01, 2025',
  end: 'Jun 30, 2025',
  owner: 'Priya Shah',
  updated: 'Yesterday',
  tag: 'Lead Generation'
}, {
  id: 'LULU-0372',
  name: 'Holiday conversion push',
  platform: 'Google Ads',
  mark: 'G',
  tone: 'bg-[var(--secondary)] text-[var(--foreground)]',
  status: 'Completed',
  objective: 'Sales',
  budget: '$24,000',
  spend: '$23,880',
  impressions: '1.88M',
  clicks: '42,201',
  ctr: '2.24%',
  conversions: '1,092',
  cpa: '$21.87',
  revenue: '$96,340',
  roas: '4.03x',
  start: 'Nov 01, 2024',
  end: 'Dec 31, 2024',
  owner: 'Marcus Ito',
  updated: 'Jan 02, 2025',
  tag: 'Seasonal'
}];
const kpis = [{
  label: 'Total campaigns',
  value: '18',
  note: 'Across 3 connected platforms',
  icon: BarChart3
}, {
  label: 'Active campaigns',
  value: '9',
  note: 'Currently delivering',
  icon: Play
}, {
  label: 'Paused campaigns',
  value: '4',
  note: 'Temporarily stopped',
  icon: Pause
}, {
  label: 'Draft campaigns',
  value: '3',
  note: 'Not yet activated',
  icon: Edit3
}, {
  label: 'Requires attention',
  value: '2',
  note: 'Warnings or performance issues',
  icon: CircleAlert
}];
const filters = ['Platform', 'Status', 'Objective', 'Performance', 'Budget', 'Owner', 'Date'];
export function CampaignsWorkspace() {
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState('Last 30 Days');
  const [selected, setSelected] = useState<Campaign | null>(campaigns[0]);
  const [view, setView] = useState('Campaigns');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const filtered = useMemo(() => campaigns.filter(campaign => `${campaign.name} ${campaign.id} ${campaign.platform} ${campaign.objective} ${campaign.status} ${campaign.tag}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <header className="border-b border-[var(--border)] bg-card px-5 py-3 lg:px-8">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div className="flex items-center gap-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--secondary)] text-sm font-bold text-foreground">L</div><strong className="tracking-[-0.02em]">LULU <span className="font-normal text-[var(--muted-foreground)]">AI</span></strong><span className="hidden h-5 w-px bg-[var(--secondary)] sm:block" /><span className="hidden text-sm text-[var(--muted-foreground)] sm:block">Advertising workspace</span></div>
          <div className="flex items-center gap-2"><button aria-label="Notifications" className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"><Bell size={18} /></button><button aria-label="Help" className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"><HelpCircle size={18} /></button><div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--primary)] text-xs font-bold text-[var(--chart-5)] text-primary-foreground">OC</div></div>
        </div>
      </header>
      <div className="mx-auto max-w-[1600px] px-5 py-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5"><div><nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]"><span>Advertising</span><ChevronRight size={13} /><span className="text-[var(--muted-foreground)]">Campaigns</span></nav><h1 className="text-[32px] font-bold tracking-[-0.04em] text-[var(--foreground)]">Campaigns</h1><p className="mt-1 text-[15px] text-[var(--muted-foreground)]">Create, manage and monitor your advertising campaigns across connected platforms.</p></div><div className="flex flex-wrap items-center gap-2"><button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-[var(--primary)]"><Plus size={16} /> Create Campaign</button><button className="hidden items-center gap-2 rounded-lg border border-[var(--border)] bg-card px-3 py-2.5 text-sm font-semibold text-[var(--muted-foreground)] hover:bg-[var(--secondary)] sm:flex"><ExternalLink size={15} /> Connect Platform</button><button className="rounded-lg border border-[var(--border)] bg-card p-2.5 text-[var(--muted-foreground)] hover:bg-[var(--secondary)]" aria-label="Import"><Upload size={16} /></button><button className="rounded-lg border border-[var(--border)] bg-card p-2.5 text-[var(--muted-foreground)] hover:bg-[var(--secondary)]" aria-label="Export"><Download size={16} /></button><button className="rounded-lg border border-[var(--border)] bg-card p-2.5 text-[var(--muted-foreground)] hover:bg-[var(--secondary)]" aria-label="Refresh"><RefreshCw size={16} /></button><button className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--secondary)]"><Bot size={16} /> <span className="hidden sm:inline">Ask Lulu AI</span></button></div></div>
        <section aria-label="Campaign portfolio summary" className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">{kpis.map(({
          label,
          value,
          note,
          icon: Icon
        }) => <article key={label} className="rounded-xl border border-[var(--border)] bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,.03)]"><div className="mb-4 flex items-center justify-between"><span className="text-[13px] font-medium text-[var(--muted-foreground)]">{label}</span><Icon size={17} className={label === 'Requires attention' ? 'text-[var(--chart-1)]' : 'text-[var(--muted-foreground)'} /></div><strong className="block text-[27px] tracking-[-0.04em]">{value}</strong><span className="mt-1 block text-xs text-[var(--muted-foreground)]">{note}</span></article>)}</section>
        <section className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="relative min-w-[260px] flex-1 lg:max-w-[560px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search campaigns..." aria-label="Search campaigns by name, ID, platform, objective, status or tags" className="w-full rounded-lg border border-[var(--border)] bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--muted-foreground)] focus:ring-2 focus:ring-[var(--border)]" /></div><div className="flex items-center gap-2"><label className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-card px-3 py-2.5 text-sm text-[var(--muted-foreground)]"><CalendarDays size={16} className="text-[var(--muted-foreground)]" /><select value={period} onChange={e => setPeriod(e.target.value)} className="bg-transparent font-medium outline-none"><option>Last 30 Days</option><option>Today</option><option>Yesterday</option><option>Last 7 Days</option><option>Last 90 Days</option><option>Year to Date</option><option>Previous Year</option><option>Custom Range</option></select></label><button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold ${showFilters ? 'border-[var(--muted-foreground)] bg-[var(--secondary)] text-[var(--foreground)]' : 'border-[var(--border)] bg-card text-[var(--muted-foreground)]'}`}><SlidersHorizontal size={16} /> Filters <span className="rounded-full bg-[var(--secondary)] px-1.5 text-xs">0</span></button></div></section>
        {showFilters && <section aria-label="Advanced filters" className="mb-5 rounded-xl border border-[var(--border)] bg-card p-4"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-bold">Advanced filters</h2><button onClick={() => setShowFilters(false)} aria-label="Close filters"><X size={17} /></button></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{filters.map(filter => <label key={filter} className="text-xs font-semibold text-[var(--muted-foreground)]">{filter}<select className="mt-1.5 w-full rounded-md border border-[var(--border)] bg-card px-2.5 py-2 text-sm font-normal text-[var(--muted-foreground)]"><option>{filter === 'Platform' ? 'All Platforms' : `All ${filter}s`}</option><option>Active</option><option>Underperforming</option></select></label>)}</div><div className="mt-4 flex gap-2"><button className="rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground">Save Filter</button><button className="rounded-md border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)]">Clear Filters</button></div></section>}
        <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-1 rounded-lg bg-[var(--secondary)] p-1" role="tablist" aria-label="Campaign assets">{['Campaigns', 'Ad groups / sets', 'Ads', 'Creatives'].map(item => <button key={item} onClick={() => setView(item)} role="tab" aria-selected={view === item} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${view === item ? 'bg-card text-[var(--foreground)] shadow-sm' : 'text-[var(--muted-foreground)]'}`}>{item}</button>)}</div><button className="hidden items-center gap-2 rounded-md border border-[var(--border)] bg-card px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)] sm:flex"><Columns3 size={15} /> Customize columns</button></div>
        <div className="rounded-xl border border-[var(--border)] bg-card shadow-[0_2px_8px_rgba(0,0,0,.03)]"><div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3"><div><h2 className="text-sm font-bold">Campaign portfolio</h2><p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{filtered.length} of 18 campaigns · Metrics: {period.toLowerCase()}</p></div><div className="flex items-center gap-2"><button className="rounded-md p-2 text-[var(--muted-foreground)] hover:bg-[var(--secondary)]" aria-label="Filter table"><Filter size={16} /></button><button onClick={() => setShowMore(!showMore)} className="rounded-md p-2 text-[var(--muted-foreground)] hover:bg-[var(--secondary)]" aria-label="More table actions"><MoreHorizontal size={17} /></button></div></div><div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[1220px] border-collapse text-left"><thead><tr className="border-b border-[var(--border)] text-[11px] uppercase tracking-[0.08em] text-[var(--muted-foreground)]">{['Campaign', 'Platform', 'Status', 'Objective', 'Budget', 'Spend', 'Impressions', 'Clicks', 'CTR', 'Conversions', 'CPA', 'Revenue', 'ROAS', 'Updated', ''].map(heading => <th key={heading} className="whitespace-nowrap px-4 py-3 font-semibold">{heading || <span className="sr-only">Actions</span>}{heading && <ArrowDownUp size={12} className="ml-1 inline" />}</th>)}</tr></thead><tbody>{filtered.map(campaign => <tr key={campaign.id} onClick={() => setSelected(campaign)} className={`cursor-pointer border-b border-[var(--border)] text-[13px] hover:bg-[var(--card)] ${selected?.id === campaign.id ? 'bg-[var(--secondary)]' : ''}`}><td className="px-4 py-3"><div className="flex items-center gap-2.5"><span className={`grid h-7 w-7 place-items-center rounded-md text-xs font-bold ${campaign.tone}`}>{campaign.mark}</span><div><strong className="block font-semibold text-[var(--foreground)]">{campaign.name}</strong><span className="text-[11px] text-[var(--muted-foreground)]">{campaign.id} · {campaign.tag}</span></div></div></td><td className="px-4 py-3 text-[var(--muted-foreground)]">{campaign.platform}</td><td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold ${campaign.status === 'Active' ? 'bg-[var(--secondary)] text-[var(--chart-4)]' : campaign.status === 'Paused' ? 'bg-[var(--secondary)] text-[var(--foreground)]' : campaign.status === 'Error' ? 'bg-[var(--secondary)] text-[var(--chart-5)]' : 'bg-[var(--secondary)] text-[var(--muted-foreground)]'}`}><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />{campaign.status}</span></td><td className="px-4 py-3 text-[var(--muted-foreground)]">{campaign.objective}</td>{[campaign.budget, campaign.spend, campaign.impressions, campaign.clicks, campaign.ctr, campaign.conversions, campaign.cpa, campaign.revenue, campaign.roas].map((metric, metricIndex) => <td key={`${campaign.id}-${metricIndex}`} className={`whitespace-nowrap px-4 py-3 ${metric === 'No data' ? 'text-[var(--muted-foreground)]' : 'text-[var(--muted-foreground)]'}`}>{metric}</td>)}<td className="whitespace-nowrap px-4 py-3 text-[var(--muted-foreground)]">{campaign.updated}</td><td className="px-4 py-3"><button aria-label={`Open actions for ${campaign.name}`} className="rounded-md p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"><MoreHorizontal size={16} /></button></td></tr>)}</tbody></table></div><div className="divide-y divide-[var(--background)] md:hidden">{filtered.map(campaign => <button key={campaign.id} onClick={() => setSelected(campaign)} className="w-full p-4 text-left"><div className="flex items-start justify-between"><div className="flex gap-2.5"><span className={`grid h-8 w-8 place-items-center rounded-md text-xs font-bold ${campaign.tone}`}>{campaign.mark}</span><div><strong className="block text-sm">{campaign.name}</strong><span className="text-xs text-[var(--muted-foreground)]">{campaign.platform} · {campaign.objective}</span></div></div><span className="rounded-full bg-[var(--secondary)] px-2 py-1 text-xs font-semibold text-[var(--foreground)]">{campaign.status}</span></div><div className="mt-4 grid grid-cols-3 gap-3 text-xs"><span><em className="not-italic text-[var(--muted-foreground)]">Spend</em><strong className="mt-1 block">{campaign.spend}</strong></span><span><em className="not-italic text-[var(--muted-foreground)]">Conversions</em><strong className="mt-1 block">{campaign.conversions}</strong></span><span><em className="not-italic text-[var(--muted-foreground)]">ROAS</em><strong className="mt-1 block">{campaign.roas}</strong></span></div></button>)}</div></div>
        {selected && <aside aria-label="Campaign detail workspace" className="mt-5 overflow-hidden rounded-xl border border-[var(--border)] bg-card shadow-[0_4px_14px_rgba(0,0,0,.08)]"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--card)] px-5 py-4"><div><div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.1em] text-[var(--muted-foreground)]">Campaign overview <span className="rounded bg-[var(--secondary)] px-1.5 py-0.5 text-[10px] text-[var(--foreground)]">Observed</span></div><h2 className="text-xl font-bold tracking-[-.025em]">{selected.name}</h2></div><div className="flex flex-wrap gap-2"><button className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-card px-3 py-2 text-xs font-semibold"><Edit3 size={14} /> Edit</button><button className="flex items-center gap-1.5 rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground"><Pause size={14} /> Pause</button><button className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-xs font-semibold text-[var(--foreground)]"><Bot size={14} /> Ask Lulu AI</button></div></div><div className="grid gap-6 p-5 lg:grid-cols-[1.5fr_1fr]"><div><div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">{[['Platform', selected.platform], ['Status', selected.status], ['Objective', selected.objective], ['Owner', selected.owner], ['Start date', selected.start], ['End date', selected.end], ['Budget', `${selected.budget} · Lifetime`], ['Last updated', selected.updated]].map(([label, value]) => <div key={label}><span className="block text-[11px] font-semibold uppercase tracking-[.08em] text-[var(--muted-foreground)]">{label}</span><strong className="mt-1 block text-sm font-semibold text-[var(--foreground)]">{value}</strong></div>)}</div><div className="mt-7 border-t border-[var(--border)] pt-5"><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold">Budget management</h3><button className="text-xs font-semibold text-[var(--foreground)]">Edit budget</button></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-4"><div><span className="text-xs text-[var(--muted-foreground)]">Spend</span><strong className="mt-1 block text-lg">{selected.spend}</strong></div><div><span className="text-xs text-[var(--muted-foreground)]">Remaining</span><strong className="mt-1 block text-lg">$5,160</strong></div><div><span className="text-xs text-[var(--muted-foreground)]">Utilization</span><strong className="mt-1 block text-lg">71.3%</strong></div><div><span className="text-xs text-[var(--muted-foreground)]">Schedule</span><strong className="mt-1 block text-sm">{selected.start} — {selected.end}</strong></div></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--secondary)]"><div className="h-full w-[71%] rounded-full bg-[var(--primary)] text-primary-foreground" /></div></div></div><div className="rounded-lg border border-[var(--border)] bg-[var(--secondary)] p-4"><div className="flex items-center gap-2"><Sparkles size={16} className="text-[var(--foreground)]" /><h3 className="text-sm font-bold text-[var(--foreground)]">Lulu AI Recommendations</h3><span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">AI-generated</span></div><p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">CPA is trending 12% higher week-over-week while conversion volume remains stable. Review audience overlap before increasing spend.</p><div className="mt-3 flex items-center justify-between text-[11px] text-[var(--muted-foreground)]"><span>Evidence: 14-day platform data</span><span>Confidence 86%</span></div><div className="mt-4 flex gap-2"><button className="rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground">Review</button><button className="rounded-md border border-[var(--border)] bg-card px-3 py-2 text-xs font-semibold text-[var(--foreground)]">Create task</button></div></div></div></aside>}
        <div className="mt-5 flex items-center justify-between text-xs text-[var(--muted-foreground)]"><span>Last synced 12 minutes ago · Data from connected platforms only</span><button className="flex items-center gap-1 font-semibold text-[var(--foreground)]"><Settings2 size={14} /> Workspace settings</button></div>
      </div>
      {showCreate && <div role="dialog" aria-modal="true" aria-labelledby="create-title" className="fixed inset-0 z-10 flex items-center justify-center bg-[var(--background)]/30 p-4"><div className="w-full max-w-xl rounded-xl bg-card p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.12em] text-[var(--muted-foreground)]">Step 1 of 7</p><h2 id="create-title" className="mt-1 text-2xl font-bold">Create campaign</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">Choose a connected platform to get started.</p></div><button onClick={() => setShowCreate(false)} aria-label="Close create campaign dialog"><X size={19} /></button></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'Microsoft Advertising'].map(platform => <button key={platform} className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-4 text-left hover:border-[var(--border)] hover:bg-[var(--secondary)]"><span className="grid h-8 w-8 place-items-center rounded-md bg-[var(--secondary)] text-xs font-bold text-[var(--muted-foreground)]">{platform[0]}</span><span><strong className="block text-sm">{platform}</strong><small className="text-xs text-[var(--muted-foreground)]">Connected · Ready to use</small></span><Check className="ml-auto text-[var(--chart-4)]" size={16} /></button>)}</div><div className="mt-7 flex items-center justify-between border-t border-[var(--border)] pt-4"><span className="text-xs text-[var(--muted-foreground)]">You will review all details before creation.</span><button onClick={() => setShowCreate(false)} className="rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-primary-foreground">Continue</button></div></div></div>}
    </main>;
}