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
const campaigns: Campaign[] = [];
const kpis: Array<Record<string, any>> = [];
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
  return <div className="flex min-h-screen bg-[var(--background)]"><aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col overflow-hidden border-r border-border bg-[var(--sidebar)] p-4 lg:flex"><div className="mb-5 flex items-center gap-3 px-2 py-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">L</div><span className="font-semibold text-foreground">Lulu AI</span></div><LuluSectionNavigation activeId="wise-brook-1762" /></aside><div className="min-w-0 flex-1"><main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
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
        {selected && <aside aria-label="Campaign detail workspace" className="mt-5 overflow-hidden rounded-xl border border-[var(--border)] bg-card shadow-[0_4px_14px_rgba(0,0,0,.08)]"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--card)] px-5 py-4"><div><div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.1em] text-[var(--muted-foreground)]">Campaign overview <span className="rounded bg-[var(--secondary)] px-1.5 py-0.5 text-[10px] text-[var(--foreground)]">Observed</span></div><h2 className="text-xl font-bold tracking-[-.025em]">{selected.name}</h2></div><div className="flex flex-wrap gap-2"><button className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-card px-3 py-2 text-xs font-semibold"><Edit3 size={14} /> Edit</button><button className="flex items-center gap-1.5 rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground"><Pause size={14} /> Pause</button><button className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-xs font-semibold text-[var(--foreground)]"><Bot size={14} /> Ask Lulu AI</button></div></div><div className="grid gap-6 p-5 lg:grid-cols-[1.5fr_1fr]"><div><div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">{[['Platform', selected.platform], ['Status', selected.status], ['Objective', selected.objective], ['Owner', selected.owner], ['Start date', selected.start], ['End date', selected.end], ['Budget', `${selected.budget} · Lifetime`], ['Last updated', selected.updated]].map(([label, value]) => <div key={label}><span className="block text-[11px] font-semibold uppercase tracking-[.08em] text-[var(--muted-foreground)]">{label}</span><strong className="mt-1 block text-sm font-semibold text-[var(--foreground)]">{value}</strong></div>)}</div><div className="mt-7 border-t border-[var(--border)] pt-5"><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold">Budget management</h3><button className="text-xs font-semibold text-[var(--foreground)]">Edit budget</button></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-4"><div><span className="text-xs text-[var(--muted-foreground)]">Spend</span><strong className="mt-1 block text-lg">{selected.spend}</strong></div><div><span className="text-xs text-[var(--muted-foreground)]">Remaining</span><strong className="mt-1 block text-lg">—</strong></div><div><span className="text-xs text-[var(--muted-foreground)]">Utilization</span><strong className="mt-1 block text-lg">—</strong></div><div><span className="text-xs text-[var(--muted-foreground)]">Schedule</span><strong className="mt-1 block text-sm">{selected.start} — {selected.end}</strong></div></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--secondary)]"><div className="h-full w-[71%] rounded-full bg-[var(--primary)] text-primary-foreground" /></div></div></div><div className="rounded-lg border border-[var(--border)] bg-[var(--secondary)] p-4"><div className="flex items-center gap-2"><Sparkles size={16} className="text-[var(--foreground)]" /><h3 className="text-sm font-bold text-[var(--foreground)]">Lulu AI Recommendations</h3><span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">AI-generated</span></div><p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">CPA is trending — higher week-over-week while conversion volume remains stable. Review audience overlap before increasing spend.</p><div className="mt-3 flex items-center justify-between text-[11px] text-[var(--muted-foreground)]"><span>Evidence: 14-day platform data</span><span>Confidence —</span></div><div className="mt-4 flex gap-2"><button className="rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground">Review</button><button className="rounded-md border border-[var(--border)] bg-card px-3 py-2 text-xs font-semibold text-[var(--foreground)]">Create task</button></div></div></div></aside>}
        <div className="mt-5 flex items-center justify-between text-xs text-[var(--muted-foreground)]"><span>Last synced 12 minutes ago · Data from connected platforms only</span><button className="flex items-center gap-1 font-semibold text-[var(--foreground)]"><Settings2 size={14} /> Workspace settings</button></div>
      </div>
      {showCreate && <div role="dialog" aria-modal="true" aria-labelledby="create-title" className="fixed inset-0 z-10 flex items-center justify-center bg-[var(--background)]/30 p-4"><div className="w-full max-w-xl rounded-xl bg-card p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.12em] text-[var(--muted-foreground)]">Step 1 of 7</p><h2 id="create-title" className="mt-1 text-2xl font-bold">Create campaign</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">Choose a connected platform to get started.</p></div><button onClick={() => setShowCreate(false)} aria-label="Close create campaign dialog"><X size={19} /></button></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'Microsoft Advertising'].map(platform => <button key={platform} className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-4 text-left hover:border-[var(--border)] hover:bg-[var(--secondary)]"><span className="grid h-8 w-8 place-items-center rounded-md bg-[var(--secondary)] text-xs font-bold text-[var(--muted-foreground)]">{platform[0]}</span><span><strong className="block text-sm">{platform}</strong><small className="text-xs text-[var(--muted-foreground)]">Connected · Ready to use</small></span><Check className="ml-auto text-[var(--chart-4)]" size={16} /></button>)}</div><div className="mt-7 flex items-center justify-between border-t border-[var(--border)] pt-4"><span className="text-xs text-[var(--muted-foreground)]">You will review all details before creation.</span><button onClick={() => setShowCreate(false)} className="rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-primary-foreground">Continue</button></div></div></div>}
    </main></div></div>;
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
  }]
}, {
  "label": "Website",
  "pages": [{
    "id": "lulu-website-portal-9012",
    "label": "Website"
  }, {
    "id": "website-wordpress-jetpack-9013",
    "label": "WordPress / Jetpack"
  }, {
    "id": "website-webflow-9014",
    "label": "Webflow"
  }, {
    "id": "website-pages-cms-9015",
    "label": "Pages & CMS"
  }, {
    "id": "website-posts-9016",
    "label": "Posts"
  }, {
    "id": "website-media-assets-9017",
    "label": "Media & Assets"
  }, {
    "id": "website-domains-9018",
    "label": "Domains"
  }, {
    "id": "website-settings-9019",
    "label": "Website Settings"
  }]
}, {
  "label": "Settings",
  "pages": [{
    "id": "nicely-land-1864",
    "label": "Settings"
  }, {
    "id": "glad-coast-1428",
    "label": "Integrations"
  }, {
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
          <span data-lulu-section-soon={section.label !== "Website" && section.label !== "Settings" ? "true" : undefined}>{section.label}</span>
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
