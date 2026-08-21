import { useMemo, useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertCircle, AlertTriangle, ArrowDown, ArrowUpRight, BarChart3, Bell, Bookmark, Brain, Building2, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign, Clock3, Columns3, Download, Edit3, FileSpreadsheet, Filter, GitBranch, Globe2, Layers3, LayoutDashboard, Link2, Lock, Megaphone, MoreHorizontal, Phone, Plus, Search, SearchX, Settings, SlidersHorizontal, Sparkles, Tag, TrendingDown, TrendingUp, Upload, UserPlus, Users, X, Zap } from 'lucide-react';
type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Nurturing' | 'Converted' | 'Lost';
type Lead = {
  id: string;
  name: string;
  initials: string;
  title: string;
  company: string;
  score: number;
  status: LeadStatus;
  source: string;
  owner: string;
  ownerInitials: string;
  activity: string;
  days: number;
  created: string;
  value: string;
  priority: 'High' | 'Medium' | 'Monitor';
  email: string;
  phone: string;
  location: string;
};
const leads: Lead[] = [];
const nav = [{
  label: 'CRM',
  icon: LayoutDashboard
}, {
  label: 'Contacts',
  icon: Users
}, {
  label: 'Companies',
  icon: Building2
}, {
  label: 'Leads',
  icon: UserPlus
}, {
  label: 'Deals',
  icon: CircleDollarSign
}, {
  label: 'Pipeline',
  icon: GitBranch
}, {
  label: 'Activities',
  icon: Activity
}, {
  label: 'Tasks',
  icon: CheckCircle2
}, {
  label: 'Customer Segments',
  icon: Layers3
}, {
  label: 'Customer Intelligence',
  icon: Brain
}];
const kpis: { label: string; value: string; detail?: string; icon: typeof UserPlus; color?: string }[] = [];
const sourceIcon = (_source: string) => Globe2;
const statusClass = (status: LeadStatus) => ({
  New: 'text-foreground bg-secondary/15',
  Contacted: 'text-foreground bg-secondary/15',
  Qualified: 'text-foreground bg-secondary/15',
  Nurturing: 'text-foreground bg-secondary/15',
  Converted: 'text-foreground bg-secondary/15',
  Lost: 'text-chart-5 bg-chart-5/15'
})[status];
function Sidebar({
  mobileOpen,
  setMobileOpen
}: {
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}) {
  return <aside className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-[var(--sidebar)] p-4 transition-transform lg:static lg:translate-x-0`}>
  <div className="flex items-center gap-3 px-2 py-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">L</div><strong className="text-lg tracking-tight text-foreground">Lulu AI</strong><button className="ml-auto text-foreground lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button></div>
  <p className="mb-2 mt-7 px-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">CRM</p>
  <LuluSectionNavigation activeId="swift-hour-7844" />
  <div className="my-5 border-t border-border" /><button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary hover:text-foreground"><Settings size={17} /><span>Settings</span></button>
  <div className="mt-auto flex items-center gap-3 border-t border-border px-2 pt-4"><div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-secondary/20 text-xs font-semibold text-foreground">—<span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--muted-foreground)] bg-primary text-primary-foreground" /></div><div><p className="text-sm font-medium text-foreground">Workspace user</p><p className="text-xs text-muted-foreground">CRM Manager</p></div></div>
 </aside>;
}
export function LuluLeads() {
  const { items: liveRecords, loading: liveLoading, error: liveError } = useLiveRecords('crm_leads');
  const liveLeads: Lead[] = liveRecords.map((record, index) => {
    const fields = record as unknown as Record<string, unknown>;
    const name = record.name || String(fields.fullName ?? 'Unnamed lead');
    const initials = name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
    return { id: record.id || `lead-${index + 1}`, name, initials, title: String(fields.title ?? '—'), company: String(fields.company ?? '—'), score: Number(fields.score ?? 0), status: (String(record.status ?? 'New') as LeadStatus), source: String(fields.source ?? '—'), owner: String(fields.owner ?? '—'), ownerInitials: '—', activity: String(fields.activity ?? '—'), days: Number(fields.days ?? 0), created: record.createdAt, value: record.valueAmount ?? '—', priority: (String(fields.priority ?? 'Monitor') as Lead['priority']), email: String(fields.email ?? '—'), phone: String(fields.phone ?? '—'), location: String(fields.location ?? '—') };
  });
  const leadsForView = liveLoading ? [] : liveLeads;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [modal, setModal] = useState<'create' | 'qualify' | 'convert' | 'import' | 'export' | null>(null);
  const [query, setQuery] = useState('');
  const [showColumns, setShowColumns] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState('50');
  const filtered = useMemo(() => leadsForView.filter(l => `${l.name} ${l.company} ${l.source} ${l.id}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const toggle = (id: string) => setSelected(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id]);
  return <div className="min-h-screen bg-[var(--background)] font-sans text-foreground"><div className="flex min-h-screen"><Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />{mobileOpen && <button className="fixed inset-0 z-30 bg-primary/60 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" />}
 <main className="min-w-0 flex-1 overflow-hidden">
    {liveError && <div className="mx-5 mt-4 rounded-lg border border-chart-5/30 bg-chart-5/5 px-4 py-3 text-sm text-chart-5">{liveError}</div>}
    {!liveLoading && liveLeads.length === 0 && <></>}<header className="border-b border-border px-4 py-4 sm:px-6 lg:px-8"><div className="flex items-start justify-between gap-4"><div><button className="mb-3 text-foreground lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><LayoutDashboard size={21} /></button><div className="mb-3 hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span>Lulu AI</span><ChevronRight size={13} /><span>CRM</span><ChevronRight size={13} /><span className="text-foreground">Leads</span></div><h1 className="text-3xl font-semibold tracking-tight text-foreground">Leads</h1><p className="mt-1 text-sm text-muted-foreground">Capture, qualify and prioritize prospects to improve your sales pipeline.</p></div><div className="flex shrink-0 gap-2"><button onClick={() => setModal('import')} className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:border-border sm:flex"><Upload size={16} />Import</button><button onClick={() => setModal('export')} className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:border-border md:flex"><Download size={16} />Export</button><button onClick={() => setModal('create')} className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-black/10 hover:bg-primary"><Plus size={16} />Create Lead</button></div></div></header>
 <div className="space-y-6 p-4 sm:p-6 lg:p-8"><section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{(liveLoading ? [] : kpis).map(({
              label,
              value,
              detail,
              icon: Icon,
              color
            }) => <article key={label} className="rounded-xl border border-border bg-[var(--card)] px-4 py-4 transition hover:border-border"><div className="flex items-center justify-between"><p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{label}</p><Icon size={16} className={color === 'violet' ? 'text-foreground' : color === 'emerald' ? 'text-foreground' : color === 'rose' ? 'text-chart-5' : color === 'blue' ? 'text-foreground' : 'text-muted-foreground'} /></div><p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>{detail && <p className={`mt-1 text-xs ${color === 'rose' ? 'text-chart-5' : color === 'emerald' ? 'text-foreground' : color === 'violet' ? 'text-foreground' : 'text-muted-foreground'}`}>{detail}</p>}</article>)}</section>
 <section className="space-y-3"><div className="relative"><Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search leads... (Name, Email, Company, Source, ID)" className="w-full rounded-xl border border-border bg-[var(--secondary)] py-3 pl-11 pr-16 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" /><kbd className="absolute right-4 top-3 rounded bg-secondary px-2 py-1 text-[11px] text-muted-foreground">⌘K</kbd></div><div className="flex flex-wrap items-center gap-2"><button onClick={() => setActiveFilter(activeFilter ? '' : 'Lead Status')} className={`flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm ${activeFilter ? 'bg-secondary/20 text-foreground' : 'text-foreground'}`}><SlidersHorizontal size={15} />Filters</button>{['Lead Status', 'Lead Score', 'Lead Source', 'Owner', 'Industry', 'Company', 'Location', 'Created Date', 'Last Activity', 'Tags'].map(x => <button key={x} onClick={() => setActiveFilter(activeFilter === x ? null : x)} className={`rounded-md px-2.5 py-1.5 text-xs ${activeFilter === x ? 'bg-secondary/20 text-foreground' : 'text-foreground hover:bg-secondary hover:text-foreground'}`}>{x}<ChevronDown className="ml-1 inline" size={12} /></button>)}<button onClick={() => setSaved(!saved)} className="ml-auto flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-foreground hover:text-foreground"><Bookmark size={14} />{saved ? 'Saved' : 'Save Filter'}</button></div><div className="flex flex-wrap gap-2"><span className="text-xs text-muted-foreground">Saved:</span>{([] as string[]).map(x => <button key={x} className="rounded-md border border-border px-2.5 py-1 text-xs text-foreground hover:border-border/40 hover:text-foreground">{x}</button>)}{activeFilter && <button onClick={() => setActiveFilter(null)} className="text-xs text-foreground">Clear Filters</button>}</div></section>
 <section className="overflow-hidden rounded-xl border border-border bg-[var(--card)]"><div className="flex items-center justify-between border-b border-border px-4 py-3"><div><h2 className="font-medium text-foreground">All leads</h2><p className="text-xs text-muted-foreground">{filtered.length} of live prospects</p></div><div className="relative"><button onClick={() => setShowColumns(!showColumns)} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-foreground hover:text-foreground"><Columns3 size={15} />Columns</button>{showColumns && <div className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-border bg-[var(--secondary)] p-3 shadow-2xl"><p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Show columns</p>{['Lead', 'Company', 'Score', 'Status', 'Source', 'Owner', 'Last Activity', 'Created', 'Potential Value'].map(x => <label key={x} className="flex items-center gap-2 py-1.5 text-xs text-foreground"><input type="checkbox" defaultChecked className="accent-primary" />{x}</label>)}<button className="mt-2 text-xs text-foreground">Reset to Default</button></div>}</div></div><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="border-b border-border bg-[var(--card)] text-xs text-muted-foreground"><tr><th scope="col" className="w-10 px-4 py-3"><input type="checkbox" checked={selected.length === leadsForView.length} onChange={e => setSelected(e.target.checked ? leadsForView.map(l => l.id) : [])} className="accent-primary" aria-label="Select all leads" /></th>{['Lead', 'Company', 'Lead Score', 'Status', 'Source', 'Owner', 'Last Activity', 'Created', 'Potential Value', ''].map((x, i) => <th scope="col" key={x || 'actions'} aria-sort={i === 0 ? 'descending' : 'none'} className="whitespace-nowrap px-3 py-3 font-medium">{x}{i < 3 && <ChevronDown className="ml-1 inline text-foreground" size={13} />}</th>)}</tr></thead><tbody className="divide-y divide-white/[0.06]">{filtered.map(lead => {
                    const SourceIcon = sourceIcon(lead.source);
                    return <tr key={lead.id} onClick={() => setActiveLead(lead)} className={`cursor-pointer transition hover:bg-secondary ${selected.includes(lead.id) ? 'border-l-2 border-l-border bg-secondary/[0.08]' : ''} ${lead.days > 7 ? 'bg-chart-5/[0.025]' : ''}`}><td className="px-4 py-3" onClick={e => e.stopPropagation()}><input type="checkbox" checked={selected.includes(lead.id)} onChange={() => toggle(lead.id)} className="accent-primary" aria-label={`Select ${lead.name}`} /></td><td className="px-3 py-3"><div className="flex items-center gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-[11px] font-semibold text-foreground">{lead.initials}</div><div><strong className="block font-medium text-foreground">{lead.name}</strong><span className="text-xs text-muted-foreground">{lead.title}</span></div></div></td><td className="px-3 py-3 text-foreground"><Building2 size={14} className="mr-2 inline text-muted-foreground" />{lead.company}</td><td className="px-3 py-3"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${lead.score >= 85 ? 'bg-secondary/20 text-foreground' : lead.score >= 65 ? 'bg-secondary/15 text-foreground' : 'bg-secondary/15 text-foreground'}`}>{lead.score}</span><span className="ml-2 text-xs text-muted-foreground">{lead.score >= 85 ? 'High' : lead.score >= 65 ? 'Medium' : 'Low'}</span></td><td className="px-3 py-3"><span className={`whitespace-nowrap rounded-full px-2 py-1 text-xs ${statusClass(lead.status)}`}><span className="mr-1">●</span>{lead.status}</span></td><td className="px-3 py-3 whitespace-nowrap text-xs text-foreground"><SourceIcon size={14} className="mr-1.5 inline text-muted-foreground" />{lead.source}</td><td className="px-3 py-3 whitespace-nowrap text-xs text-foreground"><span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-secondary/15 text-[9px] text-foreground">{lead.ownerInitials}</span>{lead.owner}</td><td className={`px-3 py-3 whitespace-nowrap text-xs ${lead.days > 7 ? 'text-chart-5' : 'text-muted-foreground'}`}>{lead.activity}</td><td className="px-3 py-3 whitespace-nowrap text-xs text-muted-foreground">{lead.created}</td><td className="px-3 py-3 text-right font-medium text-foreground">{lead.value}</td><td className="px-3 py-3"><button onClick={e => e.stopPropagation()} aria-label={`More actions for ${lead.name}`} className="rounded-md p-1.5 text-foreground hover:bg-secondary hover:text-foreground"><MoreHorizontal size={17} /></button></td></tr>;
                  })}</tbody></table></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground"><span>{filtered.length === 0 ? 'No live leads available' : `1–${filtered.length} live leads`}</span><div className="flex items-center gap-1"><button className="rounded p-1.5 hover:bg-secondary" aria-label="Previous page"><ChevronLeft size={15} /></button>{['1', '2', '3', '…', '9'].map(x => <button key={x} className={`rounded px-2 py-1 ${x === '1' ? 'bg-secondary/20 text-foreground' : 'hover:bg-secondary'}`}>{x}</button>)}<button className="rounded p-1.5 hover:bg-secondary" aria-label="Next page"><ChevronRight size={15} /></button></div><label>Rows <select value={pageSize} onChange={e => setPageSize(e.target.value)} className="ml-1 rounded border border-border bg-transparent p-1 text-foreground"><option>25</option><option>50</option><option>100</option></select></label></div></section>
 {selected.length > 0 && <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-2 rounded-xl border border-border/30 bg-[var(--secondary)] p-3 shadow-2xl"><strong className="mr-2 text-sm text-foreground">{selected.length} leads selected</strong><button onClick={() => setSelected([])} aria-label="Deselect leads" className="mr-2 text-foreground"><X size={16} /></button>{['Assign Owner', 'Change Status', 'Add Tag', 'Create Task', 'Export', 'Archive', 'Delete'].map(x => <button key={x} className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-foreground hover:bg-secondary">{x}</button>)}<button className="ml-auto rounded-lg border border-border/30 px-3 py-1.5 text-xs text-foreground">Bulk Qualify</button></div>}
 <Funnel /><Sources /><Attention /><Insights />
 </div></main></div>{activeLead && <Preview lead={activeLead} close={() => setActiveLead(null)} qualify={() => setModal('qualify')} convert={() => setModal('convert')} />} {modal && <Modal kind={modal} close={() => setModal(null)} lead={activeLead} />}<button onClick={() => setModal('create')} className="fixed bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-black/30 lg:hidden" aria-label="Create lead"><Plus /></button></div>;
}
function Funnel() {
  const stages: string[][] = [];
  return <section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="mb-5 flex items-center gap-2"><TrendingDown size={18} className="text-foreground" /><h2 className="font-medium text-foreground">Lead Funnel</h2></div><div role="img" aria-label="Lead funnel progression from New to Converted" className="flex flex-col gap-3 md:flex-row md:items-end md:gap-2">{stages.map(([name, count, pct, color]) => <div key={name} className="flex-1"><div className={`flex h-16 items-center justify-between rounded-lg bg-${color}-500/20 px-4 text-sm`}><span className="font-medium text-foreground">{name}</span><strong className="rounded-md bg-primary/20 px-2 py-1 text-xs text-foreground">{count}</strong></div><p className="mt-2 text-xs text-muted-foreground">{pct} <span className="text-muted-foreground">from total</span></p></div>)}</div><p className="mt-5 text-xs text-muted-foreground">Funnel shows progression, not a linear sequence. Converted leads may skip stages.</p></section>;
}
function Sources() {
  const data: string[][] = [];
  return <section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="mb-5 flex items-center gap-2"><Globe2 size={18} className="text-foreground" /><h2 className="font-medium text-foreground">Lead Sources</h2></div><div className="grid gap-8 lg:grid-cols-2"><div className="space-y-4">{data.map(([name, count, qualified, rate]) => <div key={name}><div className="mb-1 flex justify-between text-xs"><span className="text-foreground">{name}</span><span className="text-muted-foreground">{count} leads · {qualified} qualified</span></div><div className="h-2 rounded-full bg-secondary"><div className="h-2 rounded-full bg-primary" style={{
              width: `${Math.min(100, Number(count) / 1.24)}%`
            }} /></div><span className="mt-1 block text-[11px] text-muted-foreground">{rate} conversion</span></div>)}</div><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="text-muted-foreground"><tr><th className="pb-3">Source</th><th className="pb-3">Leads</th><th className="pb-3">Qualified</th><th className="pb-3">Conversion</th></tr></thead><tbody className="divide-y divide-white/[0.06]">{data.map(([name, count, qualified, rate]) => <tr key={name}><td className="py-2 text-foreground">{name}</td><td className="py-2 text-muted-foreground">{count}</td><td className="py-2 text-muted-foreground">{qualified}</td><td className="py-2 text-foreground">{rate}</td></tr>)}</tbody></table><button className="mt-4 text-xs text-foreground hover:text-foreground">View Source Performance →</button></div></div></section>;
}
function Attention() {
  const items: string[][] = [];
  return <section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-chart-1" /><h2 className="font-medium text-foreground">Leads Requiring Attention</h2></div><div className="divide-y divide-white/[0.06]">{items.map(([name, reason, priority, owner, action]) => <div key={name} className="grid gap-2 py-3 text-sm md:grid-cols-[1fr_2fr_110px_110px_100px] md:items-center"><strong className="text-foreground">{name}</strong><span className="text-muted-foreground">{reason}</span><span className={priority === 'High' ? 'text-chart-5' : 'text-foreground'}>● {priority}</span><span className="text-xs text-muted-foreground">{owner}</span><button className="w-fit rounded-lg border border-border px-3 py-1.5 text-xs text-foreground hover:border-border/40 hover:text-foreground">{action}</button></div>)}</div></section>;
}
function Insights() {
  const cards: string[][] = [];
  return <section className="rounded-xl border border-border/20 bg-[var(--card)] p-5"><div className="mb-5 flex items-center gap-2"><Sparkles size={18} className="text-foreground" /><h2 className="font-medium text-foreground">Lulu AI Lead Insights</h2><span className="rounded-full bg-secondary/15 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground">AI Insight</span></div><div className="grid gap-3 lg:grid-cols-3">{cards.map(([title, desc, confidence, color, cta]) => <article key={title} className="rounded-lg border border-border bg-[var(--card)] p-4"><span className="text-[10px] uppercase tracking-wider text-foreground">AI Insight</span><h3 className="mt-3 font-medium text-foreground">{title}</h3><p className="mt-2 min-h-12 text-xs leading-5 text-muted-foreground">{desc}</p><div className="mt-4 flex items-center justify-between text-xs"><span className={`text-${color}-300`}>Confidence {confidence}</span><span className="text-muted-foreground">2h ago</span></div><button className="mt-4 w-full rounded-lg border border-border py-2 text-xs text-foreground hover:border-border/40 hover:text-foreground">{cta}</button></article>)}</div><p className="mt-4 text-[11px] text-muted-foreground">Based on available CRM data · Lulu AI never exposes private reasoning</p></section>;
}
function Preview({
  lead,
  close,
  qualify,
  convert
}: {
  lead: Lead;
  close: () => void;
  qualify: () => void;
  convert: () => void;
}) {
  return <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-[var(--sidebar)] shadow-2xl"><div className="flex items-center justify-between border-b border-border p-5"><div><p className="text-xs uppercase tracking-wider text-muted-foreground">Lead preview</p><h2 className="mt-1 text-lg font-semibold text-foreground">{lead.name}</h2></div><button onClick={close} aria-label="Close lead preview" className="rounded-lg p-2 text-foreground hover:bg-secondary hover:text-foreground"><X size={18} /></button></div><div className="flex-1 space-y-6 overflow-y-auto p-5"><div className="flex items-center gap-4"><div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-secondary/20 text-xl font-semibold text-foreground">{lead.initials}</div><div><h3 className="text-xl font-semibold text-foreground">{lead.name}</h3><p className="text-sm text-muted-foreground">{lead.title} · {lead.company}</p><div className="mt-2 flex gap-2"><span className="rounded-md bg-secondary/20 px-2 py-1 text-xs text-foreground">{lead.score} High</span><span className={`rounded-full px-2 py-1 text-xs ${statusClass(lead.status)}`}>{lead.status}</span></div></div></div><div><h3 className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Lead Details</h3><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-xs text-muted-foreground">Email</p><p className="mt-1 truncate text-foreground">{lead.email}</p></div><div><p className="text-xs text-muted-foreground">Phone</p><p className="mt-1 text-foreground">{lead.phone}</p></div><div><p className="text-xs text-muted-foreground">Location</p><p className="mt-1 text-foreground">{lead.location}</p></div><div><p className="text-xs text-muted-foreground">Created</p><p className="mt-1 text-foreground">{lead.created}</p></div></div></div><div className="rounded-xl border border-border/20 bg-secondary/[0.06] p-4"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm font-medium text-foreground"><Sparkles size={15} />AI Prioritization</span><span className="rounded-full bg-secondary/20 px-2 py-1 text-[10px] text-muted-foreground">Unavailable</span></div><p className="mt-3 text-sm text-muted-foreground">AI prioritization will appear when live lead history is available.</p><div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>Confidence unavailable</span><span>Live data required</span></div></div><div><h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Lead Score</h3><div className="mt-3 flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-border text-lg font-semibold text-foreground">{lead.score}</div><div><p className="font-medium text-foreground">Live score interpretation</p><p className="text-xs text-muted-foreground">Available when connected lead signals are present.</p></div></div></div><div><h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Potential Value</h3><p className="mt-2 text-3xl font-semibold text-foreground">{lead.value}</p></div><div><h3 className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Recent Activity</h3>{([] as string[]).map((x, i) => <div key={x} className="flex items-center gap-3 py-2 text-xs text-foreground"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-foreground"><Activity size={13} /></span>{x}<span className="ml-auto text-muted-foreground">{i + 1}h ago</span></div>)}</div></div><div className="grid grid-cols-2 gap-2 border-t border-border p-4"><button onClick={qualify} className="rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary">Qualify</button><button onClick={convert} className="rounded-lg border border-border/30 py-2 text-sm text-foreground hover:bg-secondary/10">Convert</button><button className="rounded-lg border border-border py-2 text-xs text-foreground">Open Contact</button><button className="rounded-lg border border-border py-2 text-xs text-foreground">Add Task</button></div></aside>;
}
function Modal({
  kind,
  close,
  lead
}: {
  kind: 'create' | 'qualify' | 'convert' | 'import' | 'export';
  close: () => void;
  lead: Lead | null;
}) {
  const title = kind === 'create' ? 'Create Lead' : kind === 'qualify' ? 'Qualify Lead' : kind === 'convert' ? 'Convert Lead' : kind === 'import' ? 'Import Leads' : 'Export Leads';
  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-primary/70 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-[var(--secondary)] shadow-2xl"><div className="flex items-center justify-between border-b border-border p-5"><h2 id="modal-title" className="flex items-center gap-2 text-lg font-semibold text-foreground">{kind === 'qualify' && <CheckCircle2 className="text-foreground" size={19} />} {title}</h2><button onClick={close} aria-label="Close dialog" className="text-foreground hover:text-foreground"><X size={19} /></button></div><div className="space-y-5 p-5">{kind === 'import' ? <><div className="flex items-center gap-2 text-xs text-muted-foreground">{['Upload', 'Map Fields', 'Validate', 'Review', 'Import', 'Results'].map((x, i) => <span key={x} className={i === 0 ? 'text-foreground' : ''}>{i + 1}. {x}{i < 5 && <ChevronRight className="mx-1 inline" size={12} />}</span>)}</div><div className="rounded-xl border border-dashed border-border/40 bg-secondary/[0.04] p-12 text-center"><FileSpreadsheet className="mx-auto text-foreground" size={34} /><h3 className="mt-3 font-medium text-foreground">Drop your lead file here</h3><p className="mt-1 text-sm text-muted-foreground">CSV or XLSX up to 25MB</p><button className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">Choose file</button></div><p className="flex items-center gap-2 text-xs text-foreground"><Lock size={14} />Existing records will not be overwritten without your confirmation.</p></> : kind === 'export' ? <><div className="space-y-3">{['All live leads', 'Current Filter', 'Selected Leads'].map((x, i) => <label key={x} className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm text-foreground"><input type="radio" name="scope" defaultChecked={i === 0} className="accent-primary" />{x}</label>)}</div><div><p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Format</p><div className="flex gap-2"><button className="rounded-lg bg-secondary/20 px-4 py-2 text-sm text-foreground">CSV</button><button className="rounded-lg border border-border px-4 py-2 text-sm text-foreground">Excel</button></div></div><div className="grid grid-cols-2 gap-2 text-sm text-foreground">{['Lead', 'Company', 'Score', 'Status', 'Source', 'Owner', 'Potential Value'].map(x => <label key={x} className="flex gap-2"><input type="checkbox" defaultChecked className="accent-primary" />{x}</label>)}</div></> : kind === 'convert' ? <><div className="rounded-lg border border-border/20 bg-secondary/[0.06] p-4"><strong className="text-foreground">{lead?.name || 'No live lead selected'}</strong><p className="mt-1 text-sm text-muted-foreground">{lead?.company || 'No live company'} → Contact + Company + Deal</p></div><div className="space-y-3"><label className="flex items-center gap-3 rounded-lg border border-border p-4 text-sm text-foreground"><input type="checkbox" defaultChecked className="accent-primary" />Create new contact</label><label className="flex items-center gap-3 rounded-lg border border-border p-4 text-sm text-foreground"><input type="checkbox" defaultChecked className="accent-primary" />Create new company</label><label className="flex items-center gap-3 rounded-lg border border-border p-4 text-sm text-foreground"><input type="checkbox" defaultChecked className="accent-primary" />Create deal · {lead?.value || '—'}</label></div><p className="text-xs text-foreground">No duplicate records will be created silently.</p></> : <><div className="grid gap-4 sm:grid-cols-2">{['First Name *', 'Last Name *', 'Email *', 'Phone · Optional', 'Company · Optional', 'Job Title · Optional', 'Lead Source *', 'Lead Status *', 'Owner · Optional', 'Industry · Optional', 'Country · Optional', 'City · Optional', 'Potential Value · Optional', 'Tags · Optional'].map(x => <label key={x} className="text-xs text-muted-foreground">{x}<input className="mt-1.5 w-full rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label>)}</div>{kind === 'qualify' && <><label className="block text-xs text-muted-foreground">Need<textarea className="mt-1.5 h-20 w-full rounded-lg border border-border bg-[var(--secondary)] p-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs text-muted-foreground">Authority<select className="mt-1.5 w-full rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-sm text-foreground"><option>Decision Maker</option><option>Influencer</option><option>User</option><option>Unknown</option></select></label><label className="text-xs text-muted-foreground">Timing<select className="mt-1.5 w-full rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-sm text-foreground"><option>Immediate</option><option>1-3 months</option><option>3-6 months</option><option>6+ months</option></select></label></div></>}</>}</div><div className="flex justify-end gap-2 border-t border-border p-4"><button onClick={close} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button><button onClick={close} className={`rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground ${kind === 'convert' ? 'bg-primary hover:bg-primary' : 'bg-primary hover:bg-primary'}`}>{kind === 'qualify' ? 'Qualify Lead' : kind === 'convert' ? 'Convert Lead' : kind === 'import' ? 'Continue' : kind === 'export' ? 'Export' : kind === 'create' ? 'Create Lead' : 'Save Changes'}</button></div></div></div>;
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
