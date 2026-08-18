import * as React from 'react';
import { Activity, Archive, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Bot, BrainCircuit, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Download, Ellipsis, FilePlus2, Filter, Layers3, LayoutDashboard, Lightbulb, ListFilter, Menu, MoreHorizontal, Plus, RefreshCw, Search, Settings, Sparkles, Target, Trash2, Upload, Users, X, Zap } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type SegmentStatus = 'Active' | 'Draft' | 'Paused' | 'Archived';
type SegmentType = 'Dynamic' | 'Static';
interface Segment {
  name: string;
  type: SegmentType;
  records: number;
  customers: number;
  prospects: number;
  value: string;
  growth: string;
  status: SegmentStatus;
  updated: string;
  owner: string;
  ai?: boolean;
}
const segments: Segment[] = [];
const nav = [{
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  label: 'AI Assistant',
  icon: Bot
}, {
  label: 'AI Agents',
  icon: BrainCircuit
}, {
  label: 'CRM',
  icon: Users
}, {
  label: 'Marketing',
  icon: Zap
}, {
  label: 'Sales',
  icon: Target
}, {
  label: 'Advertising',
  icon: Activity
}, {
  label: 'Finance',
  icon: BarChart3
}, {
  label: 'Reports',
  icon: Layers3
}, {
  label: 'Settings',
  icon: Settings
}];
const kpis: any[][] = [];
const recommendations: Array<readonly [string, string, string]> = [];
const aiDiscoveries: Array<readonly [string, string, string, string]> = [];
const examples: string[] = [];
export const CustomerSegments = () => {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [query, setQuery] = React.useState('');
  const [period, setPeriod] = React.useState('This Month');
  const [builder, setBuilder] = React.useState('');
  const { items: segmentRecords, loading: segmentsLoading, error: segmentsError } = useLiveRecords('sales_segments');
  const getSegmentField = (record: typeof segmentRecords[number], key: string) => String((record as unknown as Record<string, unknown>)[key] ?? '');
  const liveSegments: Segment[] = segmentRecords.map(record => ({ name: getSegmentField(record, 'name') || 'Customer segment', type: getSegmentField(record, 'type') === 'Static' ? 'Static' : 'Dynamic', records: Number(getSegmentField(record, 'records')) || 0, customers: Number(getSegmentField(record, 'customers')) || 0, prospects: Number(getSegmentField(record, 'prospects')) || 0, value: getSegmentField(record, 'value') || '—', growth: getSegmentField(record, 'growth') || '—', status: ['Active', 'Draft', 'Paused', 'Archived'].includes(getSegmentField(record, 'status')) ? getSegmentField(record, 'status') as SegmentStatus : 'Draft', updated: getSegmentField(record, 'updated') || record.updatedAt || '—', owner: getSegmentField(record, 'owner') || 'Workspace owner', ai: getSegmentField(record, 'ai') === 'true' }));
  const visibleSegments = segmentsLoading ? [] : liveSegments;
  const filtered = visibleSegments.filter(segment => segment.name.toLowerCase().includes(query.toLowerCase()));
  const toggleRow = (name: string) => setSelected(current => current.includes(name) ? current.filter(item => item !== name) : [...current, name]);
  const statusClass = (status: SegmentStatus) => ({
    Active: 'bg-chart-4/10 text-chart-4',
    Draft: 'bg-secondary text-foreground',
    Paused: 'bg-sidebar text-muted-foreground',
    Archived: 'bg-sidebar text-muted-foreground'
  })[status];
  const bars = [74, 92, 52, 34, 65];
  return <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[232px] flex-col bg-[var(--sidebar)] text-foreground lg:flex">
        <div className="flex h-[72px] items-center gap-3 border-b border-border px-6"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={17} /></div><strong className="text-[17px] tracking-tight text-foreground">lulu<span className="font-normal text-muted-foreground">.ai</span></strong></div>
        <div className="flex items-center gap-3 border-b border-border px-5 py-5"><div className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">AC</div><div><p className="text-sm font-medium text-foreground">Connected workspace</p><p className="text-xs text-muted-foreground">Core workspace</p></div><ChevronDown className="ml-auto" size={15} /></div>
        <LuluSectionNavigation activeId="sharp-cliff-6925" />
        <div className="mt-auto border-t border-border px-5 py-4 text-xs text-muted-foreground"><p className="mb-2 flex items-center gap-2 text-foreground"><span className="h-2 w-2 rounded-full bg-primary text-primary-foreground" />All systems operational</p><p>© 2025 Lulu AI</p></div>
      </aside>

      <section className="lg:ml-[232px]">
        <header className="flex min-h-[72px] items-center justify-between border-b border-border/80 bg-card px-5 sm:px-8"><button aria-label="Open menu" className="mr-3 rounded-md p-2 hover:bg-sidebar lg:hidden"><Menu size={20} /></button><div className="flex items-center gap-2 text-sm text-muted-foreground"><span>Sales</span><span className="text-foreground">/</span><strong className="text-foreground">Customer Segments</strong></div><div className="flex items-center gap-3"><button aria-label="Notifications" className="rounded-lg p-2 text-foreground hover:bg-secondary"><Bell size={18} /></button><div className="hidden h-8 w-px bg-secondary sm:block" /><div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--secondary)] text-xs font-bold text-foreground">JS</div></div></header>
        <div className="mx-auto max-w-[1400px] px-5 py-7 sm:px-8">{segmentsError && <div role="alert" className="mb-5 rounded-lg border border-chart-5/30 bg-chart-5/10 px-4 py-3 text-sm text-chart-5">Customer segment data could not be loaded. Check sales segment records and try again.</div>}{!segmentsLoading && !segmentsError && liveSegments.length === 0 && <div className="mb-5 rounded-lg border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground">No customer segments are available yet.</div>}
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-foreground">Sales workspace</p><h1 className="text-3xl font-bold tracking-[-.03em] text-foreground sm:text-[36px]">Customer Segments</h1><p className="mt-2 text-sm text-muted-foreground">Create intelligent customer groups for focused sales strategies and actions.</p></div><div className="flex flex-wrap items-center gap-2"><button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-black/10 hover:bg-primary"><Plus size={16} />Create Segment</button><button className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3.5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"><Sparkles size={15} />Ask Lulu AI</button><button className="flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-card"><Upload size={15} />Import</button><button aria-label="Export" className="rounded-lg border border-border bg-card p-2.5 text-foreground hover:bg-card"><Download size={16} /></button><button aria-label="More actions" className="rounded-lg border border-border bg-card p-2.5 text-foreground hover:bg-card"><Ellipsis size={17} /></button></div></div>

          <section aria-label="Segment metrics" className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">{(segmentsLoading ? [] : [['Total Segments', String(liveSegments.length), 'Active segments', 'Recorded'], ['Customers Segmented', String(liveSegments.reduce((sum, item) => sum + item.customers, 0)), 'Customer records in segments', 'Recorded'], ['Prospects Segmented', String(liveSegments.reduce((sum, item) => sum + item.prospects, 0)), 'Prospect records in segments', 'Calculated'], ['Largest Segment', liveSegments[0]?.name || '—', `${liveSegments[0]?.records ?? 0} records`, 'Rule-based'], ['High-Value Customers', '—', 'Meeting criteria', 'AI-generated'], ['At-Risk Customers', '—', 'Matching risk signals', 'Rule-based'], ['Recently Active', '—', 'With recent engagement', 'Calculated'], ['Unsegmented', '—', 'Records not in any segment', 'Recorded']]).map(([label, value, context, kind]) => <article key={label} className={`min-h-[112px] rounded-xl border bg-card p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] ${label === 'High-Value Customers' ? 'border-border ring-1 ring-ring' : 'border-border/80'}`}><div className="mb-3 flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${kind === 'AI-generated' ? 'bg-gradient-to-r from-primary to-primary' : kind === 'Calculated' ? 'bg-primary' : kind === 'Rule-based' ? 'bg-primary' : 'bg-primary'}`} /><span className="truncate text-[11px] font-medium text-muted-foreground">{label}</span></div><p className="truncate text-xl font-bold tracking-tight text-foreground">{value}</p><p className="mt-1 truncate text-[11px] text-muted-foreground">{context}</p></article>)}</section>

          <section className="mt-7 rounded-xl border border-border/80 bg-card p-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"><div className="flex flex-col gap-3 xl:flex-row xl:items-center"><div className="relative min-w-[240px] flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><input aria-label="Search segments" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search segments..." className="h-10 w-full rounded-lg border border-border bg-secondary/60 pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2" /></div><div className="flex flex-wrap items-center gap-2"><button className="filter-pill"><Filter size={14} />Type <ChevronDown size={13} /></button><button className="filter-pill">Status <ChevronDown size={13} /></button><button className="filter-pill">Owner <ChevronDown size={13} /></button><button className="filter-pill">Record Type <ChevronDown size={13} /></button><button className="filter-pill">Size <ChevronDown size={13} /></button><button className="filter-pill">Value <ChevronDown size={13} /></button><button className="filter-pill">Last Updated <ChevronDown size={13} /></button></div></div><div className="mt-3 flex items-center justify-between border-t border-border pt-3"><p className="text-xs text-muted-foreground"><ListFilter size={13} className="mr-1 inline" />Showing all segments</p><div className="flex gap-3"><button className="text-xs font-medium text-foreground hover:text-foreground">Clear Filters</button><button className="text-xs font-semibold text-foreground hover:text-foreground">Save Filter</button></div></div></section>

          <section aria-labelledby="workspace-heading" className="mt-5 overflow-hidden rounded-xl border border-border/80 bg-card shadow-[0_2px_10px_rgba(0,0,0,0.03)]"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4"><div><h2 id="workspace-heading" className="text-base font-bold text-foreground">All segments</h2><p className="mt-0.5 text-xs text-muted-foreground">Manage rules, records, and segment performance</p></div>{selected.length > 0 && <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-foreground"><span>{selected.length} selected</span><button>Activate</button><button>Archive</button><button>Export</button><button aria-label="Delete selected"><Trash2 size={14} /></button></div>}<button className="rounded-lg p-2 text-foreground hover:bg-secondary"><MoreHorizontal size={18} /></button></div><div className="overflow-x-auto"><table className="w-full min-w-[1080px] text-left text-xs"><thead className="bg-secondary/70 text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="w-10 px-5 py-3"><input aria-label="Select all segments" type="checkbox" className="accent-primary" onChange={event => setSelected(event.target.checked ? visibleSegments.map(segment => segment.name) : [])} /></th>{['Segment', 'Type', 'Records', 'Customers', 'Prospects', 'Value', 'Growth', 'Status', 'Last Updated', 'Owner', 'Actions'].map(heading => <th key={heading} className="px-3 py-3 font-semibold">{heading}{['Segment', 'Records', 'Value', 'Growth'].includes(heading) && <span className="ml-1 text-foreground">↕</span>}</th>)}</tr></thead><tbody className="divide-y divide-border">{filtered.map(segment => <tr key={segment.name} className="group transition hover:bg-secondary/35"><td className="px-5 py-3.5"><input aria-label={`Select ${segment.name}`} type="checkbox" checked={selected.includes(segment.name)} onChange={() => toggleRow(segment.name)} className="accent-primary" /></td><td className="px-3 py-3.5"><strong className="font-semibold text-foreground">{segment.name}</strong></td><td className="px-3 py-3.5"><span className={`rounded-full border px-2 py-1 text-[10px] font-medium ${segment.type === 'Dynamic' ? 'border-border bg-secondary text-foreground' : 'border-border bg-card text-muted-foreground'}`}>{segment.type}</span></td><td className="px-3 py-3.5 font-medium text-foreground">{segment.records}</td><td className="px-3 py-3.5 text-muted-foreground">{segment.customers}</td><td className="px-3 py-3.5 text-muted-foreground">{segment.prospects}</td><td className="px-3 py-3.5 font-semibold text-foreground">{segment.value}</td><td className={`px-3 py-3.5 font-semibold ${segment.growth.startsWith('+') ? 'text-chart-4' : 'text-chart-5'}`}>{segment.growth.startsWith('+') ? <ArrowUpRight size={13} className="mr-0.5 inline" /> : <ArrowDownRight size={13} className="mr-0.5 inline" />}{segment.growth}</td><td className="px-3 py-3.5"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusClass(segment.status)}`}>{segment.status}</span></td><td className="px-3 py-3.5 text-muted-foreground">{segment.updated}</td><td className="px-3 py-3.5 text-muted-foreground">{segment.ai ? <span className="font-medium text-foreground"><Sparkles size={12} className="mr-1 inline" />{segment.owner}</span> : segment.owner}</td><td className="px-3 py-3.5"><button aria-label={`Actions for ${segment.name}`} className="rounded p-1 text-foreground hover:bg-secondary hover:text-foreground"><Ellipsis size={16} /></button></td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground"><span>Showing 1–8 of 24 segments</span><div className="flex items-center gap-1"><button aria-label="Previous page" className="rounded border border-border p-1.5 hover:bg-card"><ChevronLeft size={14} /></button><button className="rounded bg-primary px-2.5 py-1.5 font-medium text-primary-foreground">1</button><button className="rounded px-2.5 py-1.5 hover:bg-secondary">2</button><button className="rounded px-2.5 py-1.5 hover:bg-secondary">3</button><button aria-label="Next page" className="rounded border border-border p-1.5 hover:bg-card"><ChevronRight size={14} /></button></div></div></section>

          <div className="mt-7 grid gap-5 xl:grid-cols-2"><section className="section-card"><div className="section-heading"><div><h2>High-Value Segments</h2><p>Top segments by commercial value</p></div><button className="text-xs font-semibold text-foreground">View all</button></div><div className="divide-y divide-border">{visibleSegments.slice(0, 4).map(segment => <div key={segment.name} className="flex items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-foreground">{segment.name}</p><p className="mt-1 text-xs text-muted-foreground"><span className="badge-blue">{segment.type}</span> · {segment.records} records · <strong className="text-muted-foreground">{segment.value}</strong></p></div><div className="flex shrink-0 items-center gap-2"><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-foreground">{[68, 74, 71, 42][visibleSegments.slice(0, 4).indexOf(segment)]}% win</span><button className="text-[11px] font-semibold text-foreground hover:text-foreground">Open</button></div></div>)}</div></section><section className="section-card"><div className="section-heading"><div><h2>At-Risk Segments</h2><p>Signals that need attention</p></div><span className="rounded-full bg-chart-1/10 px-2 py-1 text-[10px] font-semibold text-chart-1">4 signals</span></div><div className="divide-y divide-border">{[['At-Risk Enterprise', 'Revenue declining −19%', 'red'], ['Inactive Q3 Customers', 'No activity 45+ days', 'amber'], ['Churning SMBs', 'Reduced purchasing −31%', 'red'], ['Disengaged Contacts', 'Response rate dropped', 'amber']].map(([name, signal, tone]) => <div key={name} className="flex items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="text-sm font-semibold text-foreground"><span className={`mr-2 inline-block h-2 w-2 rounded-full ${tone === 'red' ? 'bg-destructive' : 'bg-primary'}`} />{name}</p><p className="mt-1 pl-4 text-xs text-muted-foreground">{signal}</p></div><div className="flex shrink-0 gap-2"><span className="text-[11px] font-semibold text-foreground">Review</span><Sparkles size={14} className="text-foreground" /></div></div>)}</div></section></div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2"><section className="section-card"><div className="section-heading"><div><h2>Segment Performance</h2><p>Calculated metric based on connected CRM deal data</p></div><div className="flex items-center gap-2"><select aria-label="Performance period" value={period} onChange={event => setPeriod(event.target.value)} className="rounded-md border border-border px-2 py-1.5 text-xs text-muted-foreground outline-none"><option>This Month</option><option>Last Quarter</option><option>This Year</option></select></div></div><div className="flex h-[154px] items-end gap-4 border-b border-l border-border px-5 pb-0 pt-5">{bars.map((height, index) => <div key={`bar-${height}`} className="flex h-full flex-1 flex-col justify-end gap-2"><div className="rounded-t-md bg-gradient-to-t from-primary to-primary transition hover:from-primary text-primary-foreground" style={{
                  height: `${height}%`
                }} /><span className="truncate text-center text-[10px] text-muted-foreground">{['Enterprise', 'High-value', 'DACH', 'Strategic', 'SMB'][index]}</span></div>)}</div><div className="mt-3 flex justify-between text-[10px] text-muted-foreground"><span>Revenue / Win rate</span><span className="text-foreground">● vs Org Average</span></div></section><section className="section-card"><div className="section-heading"><div><h2>Segment Overlap</h2><p>Where customer groups intersect</p></div><Layers3 size={18} className="text-foreground" /></div><div className="space-y-3">{[['Enterprise Customers', 'High-Value Accounts', '61 records overlap'], ['High-Value Accounts', 'Strategic Accounts 2025', '29 records overlap']].map(([first, second, count]) => <div key={first} className="rounded-lg bg-card p-3"><div className="flex items-center gap-2 text-xs font-semibold text-foreground"><span className="rounded-full bg-secondary px-2 py-1 text-foreground">{first}</span><span className="text-foreground">∩</span><span className="rounded-full bg-secondary px-2 py-1 text-foreground">{second}</span></div><div className="mt-2 flex items-center justify-between"><span className="text-xs text-muted-foreground">{count}</span><button className="text-[11px] font-semibold text-foreground">Compare · Open · Review</button></div></div>)}</div></section></div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><section className="section-card border-border bg-gradient-to-br from-white to-secondary/40"><div className="section-heading"><div className="flex items-start gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-foreground"><Sparkles size={17} /></div><div><h2>AI Segment Discovery</h2><p>Powered by Lulu AI</p></div></div><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-foreground">3 found</span></div><p className="mb-3 text-xs text-muted-foreground">Lulu AI has identified potentially useful customer groups based on your business data.</p><div className="space-y-3">{aiDiscoveries.map(([title, count, description, evidence]) => <article key={title} className="rounded-lg border border-border bg-card p-3"><div className="flex justify-between"><h3 className="text-sm font-semibold text-foreground">{title}</h3><span className="text-xs font-semibold text-foreground">{count}</span></div><p className="mt-1 text-xs text-muted-foreground">{description}</p><p className="mt-2 text-[11px] text-muted-foreground"><strong className="text-muted-foreground">Evidence:</strong> {evidence}</p><div className="mt-3 flex gap-3 text-[11px] font-semibold"><button className="text-foreground">Create Segment</button><button className="text-foreground">Review</button><button className="text-foreground">Ask Lulu AI</button></div></article>)}</div></section><section className="section-card"><div className="section-heading"><div className="flex items-center gap-2"><Sparkles size={17} className="text-foreground" /><div><h2>AI Recommendations</h2><p>Next best actions for your segments</p></div></div></div><div className="divide-y divide-border">{recommendations.map(([title, rationale, icon]) => <div key={title} className="flex gap-3 py-3"><div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-secondary text-muted-foreground"><Lightbulb size={14} /></div><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-foreground">{title}</p><p className="mt-1 text-xs text-muted-foreground">{rationale}</p></div><button className="self-center text-[11px] font-semibold text-foreground">Review</button></div>)}</div></section></div>

          <section className="mt-5 mb-10 rounded-xl bg-[var(--card)] p-6 text-foreground shadow-lg shadow-black/10 sm:p-8"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div><div className="flex items-center gap-2"><Sparkles size={18} className="text-foreground" /><h2 className="text-lg font-bold">Ask Lulu AI to Build a Segment</h2></div><p className="mt-2 text-sm text-muted-foreground">Describe the customer group you want to find and Lulu will turn it into transparent rules.</p></div><span className="text-xs text-muted-foreground">Powered by your connected CRM</span></div><div className="mt-6 flex flex-col gap-3 rounded-xl bg-secondary p-2 sm:flex-row"><input aria-label="Describe a segment" value={builder} onChange={event => setBuilder(event.target.value)} placeholder="Describe the customer group you want to find..." className="min-h-11 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground" /><button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold hover:bg-primary text-primary-foreground">Build Segment</button></div><div className="mt-4 flex flex-wrap gap-2">{examples.map(example => <button key={example} onClick={() => setBuilder(example)} className="rounded-full border border-border px-3 py-1.5 text-[11px] text-foreground transition hover:border-border hover:text-foreground">{example}</button>)}</div><div className="mt-7 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground"><span className="font-semibold text-foreground">Review Rules</span><span className="text-muted-foreground">→</span><span>Preview Segment</span><span className="text-muted-foreground">→</span><span>Activate Segment</span><span className="ml-auto">AI converts natural language into transparent segment rules. Review before activation.</span></div></section>
        </div>
      </section>
    </main>;
};

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
