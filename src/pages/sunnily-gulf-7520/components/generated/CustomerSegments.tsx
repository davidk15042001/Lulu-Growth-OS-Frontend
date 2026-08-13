import { useMemo, useState } from 'react';
import { Archive, ArrowDown, ArrowUp, BarChart3, Bell, Check, ChevronDown, ChevronRight, CircleHelp, ClipboardList, Copy, Download, FileUp, Filter, Grid2X2, LayoutDashboard, List, MoreHorizontal, Pencil, Plus, RefreshCw, Search, Settings, Sparkles, Trash2, Users, X, Zap } from 'lucide-react';
type Segment = {
  id: string;
  name: string;
  type: 'Dynamic' | 'Static';
  customers: string;
  growth: string;
  engagement: 'High' | 'Medium' | 'Low';
  revenue: string;
  status: 'Active' | 'Archived';
  updated: string;
  owner: string;
};
type Suggestion = {
  name: string;
  description: string;
  estimate: string;
  opportunity: string;
  confidence: string;
};
const segments: Segment[] = [{
  id: 'high-value',
  name: 'High-Value Customers',
  type: 'Dynamic',
  customers: '1,284',
  growth: '+8.4%',
  engagement: 'High',
  revenue: '€482,400',
  status: 'Active',
  updated: '2h ago',
  owner: 'Sales Team'
}, {
  id: 'german-enterprise',
  name: 'German Enterprise',
  type: 'Dynamic',
  customers: '342',
  growth: '+3.1%',
  engagement: 'High',
  revenue: '€218,500',
  status: 'Active',
  updated: '1d ago',
  owner: 'Marketing'
}, {
  id: 'at-risk',
  name: 'At-Risk Accounts',
  type: 'Dynamic',
  customers: '198',
  growth: '-2.3%',
  engagement: 'Low',
  revenue: '€84,200',
  status: 'Active',
  updated: '3h ago',
  owner: 'CS Team'
}, {
  id: 'new-q2',
  name: 'New Acquisitions Q2',
  type: 'Static',
  customers: '567',
  growth: '+12.1%',
  engagement: 'Medium',
  revenue: '€134,800',
  status: 'Active',
  updated: '2d ago',
  owner: 'Growth'
}, {
  id: 'inactive',
  name: 'Inactive Contacts',
  type: 'Dynamic',
  customers: '892',
  growth: '-5.2%',
  engagement: 'Low',
  revenue: '€22,400',
  status: 'Active',
  updated: '5h ago',
  owner: 'Sales Team'
}, {
  id: 'partners',
  name: 'Strategic Partners',
  type: 'Static',
  customers: '43',
  growth: '+1.8%',
  engagement: 'High',
  revenue: '€641,000',
  status: 'Active',
  updated: '1w ago',
  owner: 'Leadership'
}, {
  id: 'smb-europe',
  name: 'SMB Europe',
  type: 'Dynamic',
  customers: '2,140',
  growth: '+6.3%',
  engagement: 'Medium',
  revenue: '€298,600',
  status: 'Active',
  updated: '4h ago',
  owner: 'Regional'
}, {
  id: 'trial',
  name: 'Trial Conversions',
  type: 'Dynamic',
  customers: '234',
  growth: '+18.7%',
  engagement: 'High',
  revenue: '€56,200',
  status: 'Active',
  updated: '30m ago',
  owner: 'Growth'
}];
const suggestions: Suggestion[] = [{
  name: 'High-Value Growing Customers',
  description: 'Customers showing revenue growth above 15% in the last 90 days',
  estimate: '312 customers',
  opportunity: 'High potential value',
  confidence: '94%'
}, {
  name: 'Customers with Declining Engagement',
  description: 'Contacts with no activity in 45+ days but historically high engagement',
  estimate: '198 customers',
  opportunity: 'Retention opportunity',
  confidence: '87%'
}, {
  name: 'Recently Acquired High-Conversion Customers',
  description: 'New customers acquired in last 60 days showing strong purchase signals',
  estimate: '156 customers',
  opportunity: 'Expansion opportunity',
  confidence: '91%'
}];
const savedFilters = ['Active Segments', 'High-Value Segments', 'Growing Segments', 'At-Risk Segments', 'Recently Created', 'AI-Discovered'];
const navItems = [{
  label: 'Overview',
  icon: LayoutDashboard
}, {
  label: 'Customers',
  icon: Users
}, {
  label: 'Segments',
  icon: BarChart3,
  active: true
}, {
  label: 'Activities',
  icon: ClipboardList
}];
const filters = ['Segment Type', 'Status', 'Customer Count', 'Owner', 'Created Date', 'Last Updated'];
export const CustomerSegments = () => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [compare, setCompare] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const visibleSegments = useMemo(() => segments.filter(segment => segment.name.toLowerCase().includes(query.toLowerCase())), [query]);
  const allSelected = visibleSegments.length > 0 && visibleSegments.every(segment => selected.includes(segment.id));
  const announce = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };
  return <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[236px] shrink-0 flex-col bg-[var(--sidebar)] text-foreground lg:flex">
          <div className="flex h-[76px] items-center gap-3 border-b border-border px-7">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary shadow-[0_8px_20px_rgba(0,0,0,.35)] text-primary-foreground"><Sparkles size={18} /></div>
            <div><p className="text-[15px] font-bold tracking-tight">lulu<span className="text-foreground">.ai</span></p><p className="mt-0.5 text-[10px] uppercase tracking-[.18em] text-muted-foreground">CRM workspace</p></div>
          </div>
          <div className="px-4 pt-7"><p className="px-3 text-[10px] font-bold uppercase tracking-[.2em] text-muted-foreground">Workspace</p><nav className="mt-3 space-y-1" aria-label="CRM navigation">
            {navItems.map(item => {
              const Icon = item.icon;
              return <button key={item.label} onClick={() => announce(`${item.label} selected`)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition ${item.active ? 'bg-secondary/15 font-semibold text-foreground ring-1 ring-ring/20' : 'text-foreground hover:bg-secondary hover:text-foreground'}`}><Icon size={17} strokeWidth={1.8} /><span>{item.label}</span>{item.active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /> : null}</button>;
            })}
          </nav></div>
          <div className="mt-8 px-4"><p className="px-3 text-[10px] font-bold uppercase tracking-[.2em] text-muted-foreground">Insights</p><button className="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] text-foreground hover:bg-secondary hover:text-foreground"><Zap size={17} /><span>Lulu AI</span><span className="ml-auto rounded bg-secondary/15 px-1.5 py-0.5 text-[9px] text-foreground">BETA</span></button></div>
          <div className="mt-auto border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] text-foreground hover:bg-secondary hover:text-foreground"><Settings size={17} /><span>Workspace settings</span></button><div className="mt-3 flex items-center gap-3 rounded-lg bg-secondary p-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--muted)] text-xs font-bold text-[var(--foreground)]">AM</div><div><p className="text-xs font-semibold">Ava Morgan</p><p className="text-[11px] text-muted-foreground">Administrator</p></div><ChevronDown className="ml-auto text-muted-foreground" size={15} /></div></div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex h-[76px] items-center justify-between border-b border-border bg-card px-6 sm:px-9"><div className="flex items-center gap-2 text-[12px] text-muted-foreground"><span>CRM</span><ChevronRight size={14} /><strong className="font-semibold text-foreground">Customer Segments</strong></div><div className="flex items-center gap-4"><button className="rounded-lg p-2 text-foreground hover:bg-secondary hover:text-foreground" aria-label="Notifications"><Bell size={18} /></button><div className="h-7 w-px bg-secondary" /><span className="hidden text-xs text-muted-foreground sm:inline">Last synced 2 min ago</span></div></header>

          <div className="mx-auto max-w-[1480px] px-6 py-8 sm:px-9">
            <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-foreground">Customer intelligence</p><h1 className="text-[32px] font-bold tracking-[-.04em] text-[var(--foreground)]">Customer Segments</h1><p className="mt-2 max-w-2xl text-[14px] leading-6 text-muted-foreground">Organize customers into meaningful groups to understand behavior, value and opportunities across your business.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => announce('Segments refreshed')} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-foreground shadow-sm hover:border-border hover:text-foreground"><RefreshCw size={15} /><span>Refresh</span></button><button onClick={() => announce('Import flow opened')} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-foreground shadow-sm hover:border-border hover:text-foreground"><FileUp size={15} /><span>Import Segment</span></button><button onClick={() => setDrawerOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-[0_6px_16px_rgba(0,0,0,.22)] hover:bg-primary"><Plus size={15} /><span>Create Segment</span></button></div></div>

            <section aria-label="Segment summary" className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-6">{[['Total Segments', '24', 'Across workspace'], ['Active Segments', '18', '75% of total'], ['Total Customers Segmented', '12,842', '+6.8% this month'], ['Dynamic Segments', '15', 'Rules-based'], ['Static Segments', '9', 'Manually curated'], ['Recently Updated', '6', 'In the last 7 days']].map(([label, value, detail]) => <article key={label} className="rounded-xl border border-border bg-card px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,.02)]"><p className="text-[11px] font-medium text-muted-foreground">{label}</p><p className="mt-2 text-[24px] font-bold tracking-[-.04em] text-[var(--foreground)]">{value}</p><p className="mt-1 text-[10px] text-muted-foreground">{detail}</p><div className="mt-3 h-1 overflow-hidden rounded-full bg-secondary"><div className="h-full w-2/3 animate-pulse rounded-full bg-secondary" /></div></article>)}</section>

            <section className="mt-7 rounded-xl border border-border bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,.02)]"><div className="flex flex-col gap-3 xl:flex-row xl:items-center"><label className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><input value={query} onChange={event => setQuery(event.target.value)} className="h-10 w-full rounded-lg border border-border bg-[var(--secondary)] pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-border focus:ring-2 focus:ring-ring" placeholder="Search segments..." aria-label="Search segments" /></label><div className="flex flex-wrap gap-2">{filters.map(filter => <button key={filter} onClick={() => setFilterOpen(filterOpen === filter ? null : filter)} className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition ${filterOpen === filter ? 'border-border bg-secondary text-foreground' : 'border-border bg-card text-foreground hover:border-border'}`}><Filter size={13} /><span>{filter}</span><ChevronDown size={13} /></button>)}<button onClick={() => {
                  setQuery('');
                  setFilterOpen(null);
                  announce('Filters cleared');
                }} className="h-10 px-2 text-xs font-semibold text-foreground hover:text-foreground">Clear Filters</button><button onClick={() => announce('Filter saved')} className="h-10 rounded-lg border border-border bg-secondary px-3 text-xs font-bold text-foreground hover:bg-secondary">Save Filter</button></div></div>{filterOpen ? <div className="mt-3 flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs text-foreground"><Filter size={14} /><span className="font-semibold">{filterOpen}</span><span className="text-foreground">Choose a value to refine your view</span><button onClick={() => setFilterOpen(null)} className="ml-auto" aria-label="Close filter"><X size={14} /></button></div> : null}<div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3"><span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Saved filters</span>{savedFilters.map(filter => <button key={filter} onClick={() => announce(`${filter} applied`)} className="rounded-full bg-card px-3 py-1.5 text-[11px] font-semibold text-foreground hover:bg-secondary hover:text-foreground">{filter}</button>)}<div className="ml-auto flex items-center gap-1 rounded-lg bg-secondary p-1"><button onClick={() => setView('table')} className={`rounded-md p-1.5 ${view === 'table' ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`} aria-label="Table view"><List size={16} /></button><button onClick={() => setView('cards')} className={`rounded-md p-1.5 ${view === 'cards' ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`} aria-label="Cards view"><Grid2X2 size={16} /></button></div></div></section>

            {selected.length > 0 ? <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2.5 text-xs text-foreground"><span className="font-bold">{selected.length} selected</span><span className="mx-1 h-4 w-px bg-secondary" /><button onClick={() => announce('Archive action queued')} className="rounded px-2 py-1 font-semibold hover:bg-card"><Archive size={13} className="mr-1 inline" />Archive</button><button onClick={() => announce('Export started')} className="rounded px-2 py-1 font-semibold hover:bg-card"><Download size={13} className="mr-1 inline" />Export</button><button onClick={() => announce('Owner assignment opened')} className="rounded px-2 py-1 font-semibold hover:bg-card">Assign Owner</button><button onClick={() => setSelected([])} className="ml-auto font-semibold text-foreground hover:text-foreground">Clear selection</button></div> : null}

            <section className="mt-5 rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,.02)]"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4"><div><h2 className="text-[15px] font-bold text-[var(--foreground)]">All segments <span className="ml-1 text-xs font-medium text-muted-foreground">24 total</span></h2><p className="mt-1 text-xs text-muted-foreground">Manage, compare and understand your customer groups</p></div><div className="flex items-center gap-2"><button onClick={() => setCompare(!compare)} className={`rounded-lg border px-3 py-2 text-xs font-bold ${compare ? 'border-border bg-secondary text-foreground' : 'border-border text-foreground hover:border-border'}`}><BarChart3 size={14} className="mr-1.5 inline" />Compare Segments</button><button className="rounded-lg border border-border p-2 text-foreground hover:text-foreground" aria-label="More table options"><MoreHorizontal size={16} /></button></div></div>{compare ? <div className="grid gap-3 border-b border-border bg-secondary/60 p-4 md:grid-cols-3"><div><p className="text-[10px] font-bold uppercase tracking-widest text-foreground">Selected comparison</p><p className="mt-1 text-sm font-bold">High-Value Customers <span className="font-normal text-muted-foreground">vs</span> German Enterprise</p></div><div><p className="text-[11px] text-muted-foreground">Customers</p><p className="mt-1 text-sm font-bold">1,284 <span className="mx-1 text-foreground">/</span> 342</p></div><div><p className="text-[11px] text-muted-foreground">Revenue · engagement</p><p className="mt-1 text-sm font-bold">€482.4k <span className="mx-1 text-foreground">/</span> €218.5k · High</p></div></div> : null}{view === 'table' ? <div className="overflow-x-auto"><table className="w-full min-w-[1080px] border-collapse text-left"><thead><tr className="border-b border-border bg-[var(--card)] text-[10px] font-bold uppercase tracking-[.1em] text-muted-foreground"><th className="w-12 px-5 py-3"><input type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? [] : visibleSegments.map(segment => segment.id))} className="accent-primary" aria-label="Select all segments" /></th>{['Segment Name', 'Type', 'Customers', 'Growth', 'Engagement', 'Revenue', 'Status', 'Last Updated', 'Owner', 'Actions'].map(heading => <th key={heading} className="px-3 py-3 font-bold">{heading}{heading === 'Customers' || heading === 'Revenue' ? <ArrowDown className="ml-1 inline text-foreground" size={12} /> : null}</th>)}</tr></thead><tbody>{visibleSegments.map(segment => <tr key={segment.id} className="group border-b border-border text-[12px] transition hover:bg-secondary/30"><td className="px-5 py-3.5"><input type="checkbox" checked={selected.includes(segment.id)} onChange={() => setSelected(selected.includes(segment.id) ? selected.filter(id => id !== segment.id) : [...selected, segment.id])} className="accent-primary" aria-label={`Select ${segment.name}`} /></td><td className="px-3 py-3.5"><button onClick={() => announce(`${segment.name} opened`)} className="font-bold text-[var(--foreground)] hover:text-foreground">{segment.name}</button><p className="mt-0.5 text-[10px] text-muted-foreground">Updated segment</p></td><td className="px-3 py-3.5"><span className={`rounded-md px-2 py-1 text-[10px] font-bold ${segment.type === 'Dynamic' ? 'bg-secondary text-foreground' : 'bg-secondary text-muted-foreground'}`}>{segment.type}</span></td><td className="px-3 py-3.5 font-semibold text-foreground">{segment.customers}</td><td className={`px-3 py-3.5 font-bold ${segment.growth.startsWith('+') ? 'text-chart-4' : 'text-chart-5'}`}>{segment.growth.startsWith('+') ? <ArrowUp size={13} className="mr-0.5 inline" /> : <ArrowDown size={13} className="mr-0.5 inline" />}{segment.growth}</td><td className="px-3 py-3.5"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${segment.engagement === 'High' ? 'bg-chart-4/10 text-chart-4' : segment.engagement === 'Medium' ? 'bg-secondary text-foreground' : 'bg-chart-5/10 text-chart-5'}`}>{segment.engagement}</span></td><td className="px-3 py-3.5 font-semibold text-foreground">{segment.revenue}</td><td className="px-3 py-3.5"><span className="inline-flex items-center gap-1.5 font-semibold text-foreground"><span className="h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" />{segment.status}</span></td><td className="px-3 py-3.5 text-muted-foreground">{segment.updated}</td><td className="px-3 py-3.5 text-muted-foreground">{segment.owner}</td><td className="relative px-3 py-3.5"><button onClick={() => setSelectedAction(selectedAction === segment.id ? null : segment.id)} className="rounded-md p-1 text-foreground hover:bg-secondary hover:text-foreground" aria-label={`Actions for ${segment.name}`}><MoreHorizontal size={17} /></button>{selectedAction === segment.id ? <div className="mt-2 w-32 rounded-lg border border-border bg-card p-1 shadow-lg"><button onClick={() => announce('Segment opened')} className="block w-full rounded px-2 py-1.5 text-left text-[11px] hover:bg-card">Open</button><button onClick={() => announce('Edit opened')} className="block w-full rounded px-2 py-1.5 text-left text-[11px] hover:bg-card">Edit</button><button onClick={() => announce('Segment duplicated')} className="block w-full rounded px-2 py-1.5 text-left text-[11px] hover:bg-card">Duplicate</button><button onClick={() => announce('Segment archived')} className="block w-full rounded px-2 py-1.5 text-left text-[11px] text-foreground hover:bg-secondary">Archive</button></div> : null}</td></tr>)}</tbody></table>{visibleSegments.length === 0 ? <div className="p-14 text-center"><Search className="mx-auto text-foreground" size={30} /><h3 className="mt-3 text-sm font-bold">No Segments Found</h3><p className="mt-1 text-xs text-muted-foreground">Clear Filters to see all customer segments.</p><button onClick={() => setQuery('')} className="mt-4 text-xs font-bold text-foreground">Clear Filters</button></div> : null}</div> : <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">{visibleSegments.map(segment => <article key={segment.id} className="rounded-lg border border-border p-4 hover:border-border"><div className="flex items-start justify-between"><h3 className="text-sm font-bold">{segment.name}</h3><span className="text-xs text-muted-foreground">{segment.type}</span></div><p className="mt-4 text-2xl font-bold">{segment.customers}</p><p className="text-xs text-muted-foreground">customers</p><div className="mt-4 flex justify-between text-xs"><span className="font-bold text-chart-4">{segment.growth}</span><span className="text-muted-foreground">{segment.revenue}</span></div></article>)}</div>}<div className="flex items-center justify-between border-t border-border px-5 py-3 text-[11px] text-muted-foreground"><span>Showing {visibleSegments.length} of 24 segments</span><div className="flex gap-1"><button className="rounded border border-border px-2 py-1 text-foreground">Previous</button><button className="rounded bg-primary px-2.5 py-1 font-bold text-primary-foreground">1</button><button className="rounded border border-border px-2 py-1 text-foreground">2</button><button className="rounded border border-border px-2 py-1 text-foreground">Next</button></div></div></section>

            <section className="mt-6 rounded-2xl border border-border bg-[linear-gradient(105deg,var(--card),var(--card)_55%,var(--secondary))] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-foreground"><Sparkles size={14} /><span>Powered by Lulu AI</span></p><h2 className="mt-2 text-lg font-bold tracking-tight text-[var(--foreground)]">Lulu AI Segment Discovery</h2><p className="mt-1 text-xs text-muted-foreground">Uncover meaningful customer groups before they become obvious.</p></div><button onClick={() => announce('AI discovery refreshed')} className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-bold text-foreground hover:bg-card"><RefreshCw size={14} className="mr-1.5 inline" />Find new segments</button></div><div className="mt-5 grid gap-3 xl:grid-cols-3">{suggestions.map(suggestion => <article key={suggestion.name} className="rounded-xl border border-border bg-secondary p-4 shadow-sm"><div className="flex items-center justify-between"><span className="rounded-full bg-secondary px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-foreground">AI-Generated</span><span className="text-xs font-bold text-foreground">{suggestion.confidence} confidence</span></div><h3 className="mt-3 text-sm font-bold text-[var(--foreground)]">{suggestion.name}</h3><p className="mt-1 min-h-9 text-[11px] leading-5 text-muted-foreground">{suggestion.description}</p><div className="mt-4 flex items-center justify-between border-t border-border pt-3"><div><p className="text-xs font-bold text-foreground">{suggestion.estimate}</p><p className="mt-0.5 text-[10px] text-foreground">{suggestion.opportunity}</p></div><button onClick={() => announce(`${suggestion.name} ready to create`)} className="rounded-lg bg-primary px-3 py-2 text-[11px] font-bold text-primary-foreground hover:bg-primary">Create Segment</button></div></article>)}</div></section>

            <section className="mt-6"><div className="flex items-center gap-2"><Sparkles size={16} className="text-foreground" /><h2 className="text-[15px] font-bold">Lulu AI Segment Insights</h2><span className="rounded bg-secondary px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-foreground">Live</span></div><div className="mt-3 grid gap-3 md:grid-cols-3">{['High-value customers are showing increased engagement this quarter.', 'A customer group with declining activity may require retention attention — 198 contacts identified.', 'Recently acquired customers show 23% higher conversion than the broader customer base.'].map(insight => <div key={insight} className="flex gap-3 rounded-xl border border-border bg-card p-4 text-xs leading-5 text-muted-foreground"><span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary text-primary-foreground" /><p>{insight}</p></div>)}</div></section>

            <section className="mt-7 grid gap-3 pb-8 md:grid-cols-2"><article className="rounded-xl border border-dashed border-border bg-card p-5"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Empty state preview</p><h2 className="mt-2 text-sm font-bold">No Customer Segments Yet</h2><p className="mt-1 text-xs text-muted-foreground">Start organizing your customer base into meaningful groups.</p><div className="mt-4 flex gap-2"><button onClick={() => setDrawerOpen(true)} className="rounded-lg bg-primary px-3 py-2 text-[11px] font-bold text-primary-foreground">Create Segment</button><button onClick={() => announce('Lulu AI is finding segments')} className="rounded-lg border border-border px-3 py-2 text-[11px] font-bold text-foreground">Let Lulu AI Find Segments</button></div></article><article className="rounded-xl border border-dashed border-border bg-card p-5"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Filtered empty state</p><h2 className="mt-2 text-sm font-bold">No Segments Found</h2><p className="mt-1 text-xs text-muted-foreground">Your current filters don't match any segments.</p><button onClick={() => setQuery('')} className="mt-4 rounded-lg border border-border px-3 py-2 text-[11px] font-bold text-foreground">Clear Filters</button></article></section>
          </div>
        </section>

        {drawerOpen ? <aside className="hidden w-[340px] shrink-0 border-l border-border bg-card xl:block"><div className="sticky top-0 h-screen overflow-y-auto"><div className="flex items-center justify-between border-b border-border px-5 py-5"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-foreground">New workspace object</p><h2 className="mt-1 text-lg font-bold tracking-tight">Create Segment</h2></div><button onClick={() => setDrawerOpen(false)} className="rounded-lg p-2 text-foreground hover:bg-secondary hover:text-foreground" aria-label="Close create segment panel"><X size={17} /></button></div><form onSubmit={event => {
            event.preventDefault();
            announce('Segment created');
          }} className="space-y-5 p-5"><label className="block"><span className="text-xs font-bold text-foreground">Segment Name</span><input className="mt-2 h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-border focus:ring-2 focus:ring-ring" defaultValue="High-Value Customers" /></label><label className="block"><span className="text-xs font-bold text-foreground">Description</span><textarea className="mt-2 h-20 w-full resize-none rounded-lg border border-border p-3 text-xs outline-none focus:border-chart-3 focus:ring-2 focus:ring-chart-3" defaultValue="Customers with strong value and engagement signals." /></label><fieldset><legend className="text-xs font-bold text-foreground">Segment Type</legend><div className="mt-2 grid grid-cols-2 gap-2"><button type="button" className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-bold text-foreground">Dynamic</button><button type="button" className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground">Static</button></div></fieldset><div><div className="flex items-center justify-between"><p className="text-xs font-bold text-foreground">Visual rule builder</p><button type="button" className="text-[11px] font-bold text-foreground">+ Add rule</button></div><div className="mt-2 space-y-2">{['Country = Germany', 'Revenue > €5,000', 'Last Purchase < 90 Days', 'Engagement = High'].map((rule, ruleIndex) => <div key={rule} className="flex items-center gap-2 rounded-lg border border-border bg-[var(--card)] px-3 py-2 text-[11px] font-semibold text-muted-foreground"><span className="grid h-5 w-5 place-items-center rounded bg-secondary text-[9px] font-bold text-foreground">{ruleIndex + 1}</span><span>{rule}</span>{ruleIndex < 3 ? <span className="ml-auto rounded bg-secondary px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">AND</span> : null}</div>)}</div></div><div className="rounded-xl border border-border bg-secondary/60 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-foreground">Estimated match</p><p className="mt-1 text-sm font-bold text-foreground">1,284 customers match these conditions</p></div><div><h3 className="text-xs font-bold text-foreground">Segment Preview</h3><div className="mt-2 grid grid-cols-2 gap-2">{[['Matching count', '1,284'], ['Revenue', '€482,400'], ['Avg. value', '€376'], ['Engagement', 'High']].map(([label, value]) => <div key={label} className="rounded-lg bg-card p-3"><p className="text-[10px] text-muted-foreground">{label}</p><p className="mt-1 text-xs font-bold text-foreground">{value}</p></div>)}</div><div className="mt-2 rounded-lg bg-card p-3"><p className="text-[10px] text-muted-foreground">Geo distribution</p><div className="mt-2 flex h-2 overflow-hidden rounded-full"><span className="w-[52%] bg-primary text-primary-foreground" /><span className="w-[28%] bg-primary text-primary-foreground" /><span className="w-[20%] bg-secondary" /></div><p className="mt-2 text-[10px] text-muted-foreground">Germany 52% · DACH 28% · Other 20%</p></div></div><button type="submit" className="w-full rounded-lg bg-primary py-3 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary">Create Segment</button><button type="button" onClick={() => announce('Static import option opened')} className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-xs font-semibold text-foreground hover:border-border hover:text-foreground"><Download size={14} />Import customers for static segment</button></form></div></aside> : <button onClick={() => setDrawerOpen(true)} className="fixed right-5 top-24 hidden rounded-full bg-primary p-3 text-primary-foreground shadow-lg xl:block" aria-label="Open create segment panel"><Pencil size={16} /></button>}
      </div>{toast ? <div role="status" className="fixed bottom-6 right-6 z-20 flex items-center gap-2 rounded-lg bg-[var(--secondary)] px-4 py-3 text-xs font-semibold text-foreground shadow-xl"><Check size={15} className="text-foreground" /><span>{toast}</span></div> : null}
    </main>;
};