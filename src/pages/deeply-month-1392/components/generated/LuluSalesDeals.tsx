import { useMemo, useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import type { LucideIcon } from 'lucide-react';
import { Activity, AlertTriangle, Archive, ArrowDown, ArrowUp, BarChart3, Bell, Bot, CalendarDays, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock3, Columns3, Copy, DollarSign, Download, Ellipsis, Euro, FilePlus2, Filter, FolderKanban, Gauge, Import, LayoutGrid, List, LockKeyhole, Menu, MoreHorizontal, PanelRight, Plus, Search, Send, Settings, ShieldCheck, Sparkles, Target, TrendingUp, Users, X, XCircle } from 'lucide-react';
type Deal = {
  id: string;
  name: string;
  company: string;
  contact: string;
  owner: string;
  stage: string;
  status: string;
  value: string;
  probability: number;
  close: string;
  health: string;
  priority: string;
  last: string;
  next: string;
};
const deals: Deal[] = [];
const kpis: {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  tone: string;
  calculated?: boolean;
}[] = [];
const filters = ['Status', 'Stage', 'Value', 'Probability', 'Health', 'Priority', 'Owner', 'Expected Close'];
const prompts: string[] = [];
const buttonClass = 'rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-foreground transition hover:border-border/40 hover:bg-secondary hover:text-foreground';
const stageTone: Record<string, string> = {
  Negotiation: 'border-border/30 bg-secondary/10 text-foreground',
  Proposal: 'border-border/30 bg-secondary/10 text-foreground',
  Solution: 'border-border/30 bg-secondary/10 text-foreground',
  Discovery: 'border-border/30 bg-secondary/10 text-foreground',
  Commit: 'border-border/30 bg-secondary/10 text-foreground',
  'Closed Won': 'border-border/30 bg-secondary/10 text-foreground',
  'Closed Lost': 'border-chart-5/30 bg-chart-5/10 text-chart-5'
};
const statusTone: Record<string, string> = {
  Open: 'bg-secondary/10 text-foreground',
  Won: 'bg-secondary/10 text-foreground',
  Lost: 'bg-chart-5/10 text-chart-5'
};
function Sidebar() {
  const top = [['Dashboard', Gauge], ['AI Insights', Sparkles], ['AI Assistant', Bot], ['AI Agents', Activity]] as [string, LucideIcon][];
  const sales = ['Overview', 'Leads', 'Opportunities', 'Deals', 'Pipeline', 'Activities', 'Tasks', 'Forecast', 'Analytics'];
  return <aside className="hidden w-[220px] shrink-0 flex-col border-r border-border bg-[var(--sidebar)] px-3 py-5 lg:flex"><div className="flex items-center gap-3 px-3 pb-8"><div className="grid h-8 w-8 place-items-center rounded-xl bg-primary shadow-lg shadow-black/20 text-primary-foreground"><Sparkles size={16} /></div><strong className="text-[15px] tracking-tight text-foreground">lulu<span className="text-foreground">.</span>ai</strong></div><LuluSectionNavigation activeId="deeply-month-1392" /><div className="mt-auto space-y-4 border-t border-border pt-4"><button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-foreground"><Settings size={17} /><span>Settings</span></button><div className="flex items-center gap-3 px-2"><div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">JD</div><p><strong className="block text-xs text-foreground">Workspace member</strong><span className="text-[11px] text-muted-foreground">Admin workspace</span></p><MoreHorizontal size={16} className="ml-auto text-muted-foreground" /></div></div></aside>;
}
function AiBadge() {
  return <span className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] font-medium text-foreground"><Sparkles size={11} /> AI</span>;
}
function SectionTitle({
  eyebrow,
  title,
  badge
}: {
  eyebrow: string;
  title: string;
  badge?: boolean;
}) {
  return <div className="mb-4 flex items-end justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground">{eyebrow}</p><h2 className="mt-1 text-lg font-semibold text-foreground">{title}</h2></div>{badge && <AiBadge />}</div>;
}
function MiniRow({
  name,
  company,
  value,
  note,
  action
}: {
  name: string;
  company: string;
  value: string;
  note: string;
  action: string;
}) {
  return <article className="flex flex-col gap-3 border-b border-border py-3 last:border-0 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><strong className="block text-sm text-foreground">{name}</strong><span className="text-xs text-muted-foreground">{company} · {value}</span></div><span className="text-xs text-muted-foreground">{note}</span><button className="text-left text-xs font-medium text-foreground hover:text-foreground">{action} →</button></article>;
}
export function LuluSalesDeals() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [period, setPeriod] = useState('Quarter to Date');
  const [showCreate, setShowCreate] = useState(false);
  const [ask, setAsk] = useState('');
  const [answer, setAnswer] = useState('');
  const toggle = (id: string) => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const { items: liveDeals, loading: liveLoading, error: liveError } = useLiveRecords('sales_deals');
  const liveEmpty = !liveLoading && !liveError && liveDeals.length === 0;
  const liveDealRows: Deal[] = liveDeals.map(record => { const fields = record.data || {}; return { id: record.id, name: record.name, company: String(fields.company || '—'), contact: String(fields.contact || '—'), owner: String(fields.owner || '—'), stage: String(fields.stage || record.status || '—'), status: String(record.status || 'Open'), value: record.valueAmount || '—', probability: Number(fields.probability || 0), close: String(fields.closeDate || '—'), health: String(fields.health || 'Recorded'), priority: String(fields.priority || '—'), last: String(fields.lastActivity || '—'), next: String(fields.nextAction || '—') }; });
  const visibleDeals = useMemo(() => liveDealRows.filter(deal => `${deal.name} ${deal.company} ${deal.contact} ${deal.owner}`.toLowerCase().includes(query.toLowerCase())), [liveDealRows, query]);
  const allSelected = selected.length === visibleDeals.length && visibleDeals.length > 0;
  const liveValue = liveDealRows.reduce((sum, deal) => sum + (Number(String(deal.value).replace(/[^0-9.-]/g, '')) || 0), 0);
  const wonDeals = liveDealRows.filter(deal => /won|closed/i.test(deal.status));
  const liveKpis = kpis.map((item, index) => ({ ...item, value: [String(liveDealRows.length), String(liveDealRows.filter(deal => /open/i.test(deal.status)).length), String(wonDeals.length), String(liveDealRows.filter(deal => /lost/i.test(deal.status)).length), liveValue.toLocaleString(), wonDeals.reduce((sum, deal) => sum + (Number(String(deal.value).replace(/[^0-9.-]/g, '')) || 0), 0).toLocaleString(), liveDealRows.length ? Math.round(liveValue / liveDealRows.length).toLocaleString() : '—', liveDealRows.length ? `${(wonDeals.length / liveDealRows.length * 100).toFixed(1)}%` : '—', 'Not available'][index], trend: liveDealRows.length ? 'Live records' : 'No live data' }));
  return <div className="min-h-screen bg-[var(--background)] text-foreground"><div className="flex min-h-screen"><Sidebar /><main className="min-w-0 flex-1 bg-[var(--background)]">{liveLoading ? <div className="border-b border-border bg-secondary/30 px-5 py-3 text-xs text-muted-foreground md:px-8">Loading live sales deals…</div> : liveError ? <div className="border-b border-destructive/30 bg-destructive/5 px-5 py-3 text-xs text-destructive md:px-8">{liveError}</div> : liveEmpty ? <div className="border-b border-dashed border-border bg-card px-5 py-3 text-xs text-muted-foreground md:px-8">No live sales deals are available yet. Add a deal or connect your CRM to begin.</div> : null}<header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-[var(--background)]/95 px-5 backdrop-blur md:px-8"><div className="flex items-center gap-3"><button className="lg:hidden" aria-label="Open navigation"><Menu size={19} /></button><span className="text-xs text-muted-foreground">Sales</span><span className="text-foreground">/</span><strong className="text-xs text-foreground">Deals</strong></div><div className="flex items-center gap-4"><button className="relative text-foreground hover:text-foreground" aria-label="Notifications"><Bell size={18} /><span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /></button><span className="hidden text-xs text-muted-foreground sm:block">Last synced 2 min ago</span></div></header><div className="mx-auto max-w-[1500px] px-5 py-7 md:px-8"><section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground">Sales management</p><h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-[34px]">Deals</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Manage active sales deals, monitor progress and move opportunities toward successful close.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lg shadow-black/20 hover:bg-primary"><Plus size={14} /> Create Deal</button><button className={buttonClass}><Sparkles size={13} className="mr-1 inline text-foreground" /> Ask Lulu AI</button><button className={buttonClass}><Import size={14} className="mr-1 inline" /> Import</button><button className={buttonClass}><Download size={14} className="mr-1 inline" /> Export</button><button className={buttonClass}><Ellipsis size={14} /></button></div></section>
<section className="mt-7 flex flex-wrap items-center gap-2"><span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Reporting period</span>{['Today', 'Last 7 Days', 'Last 30 Days', 'Month to Date', 'Previous Month', 'Quarter to Date', 'Previous Quarter', 'Year to Date', 'Previous Year', 'Custom Range'].map(item => <button key={item} onClick={() => setPeriod(item)} className={`rounded-full border px-3 py-1.5 text-[11px] ${period === item ? 'border-border/40 bg-secondary/15 text-foreground' : 'border-border text-foreground hover:text-foreground'}`}>{item}</button>)}</section>
<section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">{liveKpis.map(item => {
              const Icon = item.icon;
              return <article key={item.label} className="min-w-0 rounded-xl border border-border bg-[var(--card)] px-4 py-4"><div className="mb-3 flex items-center justify-between"><div className={`grid h-8 w-8 place-items-center rounded-lg ${item.tone === 'emerald' ? 'bg-chart-4/10 text-chart-4' : 'bg-secondary/10 text-foreground'}`}><Icon size={16} /></div><span className={`text-[11px] font-medium ${item.trend.startsWith('↓') && item.label === 'Lost' ? 'text-chart-4' : item.tone === 'emerald' ? 'text-chart-4' : 'text-foreground'}`}>{item.trend}</span></div><p className="text-xs text-muted-foreground">{item.label}</p><strong className="mt-1 block truncate text-[20px] tracking-tight text-foreground">{item.value}</strong>{item.calculated && <span className="mt-2 inline-block rounded-full bg-card/50 px-1.5 py-0.5 text-[9px] text-muted-foreground">Calculated</span>}</article>;
            })}</section><div className="mt-3 flex flex-wrap gap-4 text-[10px] text-muted-foreground"><span>● Recorded</span><span className="text-foreground">● Calculated</span><span className="text-foreground">● AI-generated</span></div>
<section className="mt-6"><div className="flex flex-col gap-3 xl:flex-row"><div className="relative min-w-0 flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} /><input value={query} onChange={event => setQuery(event.target.value)} className="h-11 w-full rounded-xl border border-border bg-[var(--secondary)] pl-10 pr-14 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-border/60" placeholder="Search deals..." aria-label="Search deals" /><kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">⌘K</kbd></div><div className="flex rounded-lg border border-border p-1"><button className="rounded bg-primary px-3 text-xs text-primary-foreground">Table</button><button className="rounded px-3 text-xs text-foreground">Kanban</button><button className="rounded px-3 text-xs text-foreground">List</button></div></div><div className="mt-3 flex gap-2 overflow-x-auto pb-1">{filters.map(item => <button key={item} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-foreground">{item}<ChevronDown size={13} /></button>)}<button className="shrink-0 px-2 text-xs text-foreground">Clear Filters</button><button className="shrink-0 rounded-lg border border-border/30 px-3 py-2 text-xs text-foreground">Save Filter</button></div><div className="mt-3 flex flex-wrap items-center gap-2"><span className="text-[11px] text-muted-foreground">Active:</span>{['Stage: Negotiation', 'Owner: Workspace owner'].map(chip => <button key={chip} className="inline-flex items-center gap-1.5 rounded-full border border-border/20 bg-secondary/10 px-2.5 py-1 text-[11px] text-foreground">{chip}<X size={12} /></button>)}<button className="text-[11px] text-foreground">Clear all</button></div></section>
{selected.length > 0 && <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-border/20 bg-secondary/10 px-4 py-3 text-xs"><strong className="mr-2 text-foreground">{selected.length} selected</strong>{['Assign Owner', 'Change Stage', 'Change Status', 'Change Priority', 'Update Probability', 'Create Task', 'Export', 'Archive'].map(action => <button key={action} className="rounded-md border border-border bg-[var(--primary)] px-2.5 py-1.5 text-primary-foreground">{action}</button>)}</div>}
<section className="mt-4 overflow-hidden rounded-xl border border-border bg-[var(--card)]" aria-label="Deals table"><div className="overflow-x-auto"><table className="w-full min-w-[1500px] border-collapse text-left"><thead className="border-b border-border bg-secondary"><tr className="text-[10px] uppercase tracking-[0.13em] text-muted-foreground"><th className="px-4 py-3"><input type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? [] : visibleDeals.map(deal => deal.id))} aria-label="Select all deals" /></th>{['Deal', 'Company', 'Contact', 'Owner', 'Stage', 'Status', 'Value', 'Probability', 'Expected Close', 'Health', 'Priority', 'Last Activity', 'Next Action', ''].map(head => <th key={head} className="px-3 py-3">{head}</th>)}</tr></thead><tbody className="divide-y divide-white/[0.055]">{visibleDeals.map(deal => <tr key={deal.id} className="group transition hover:bg-secondary"><td className="px-4 py-3"><input type="checkbox" checked={selected.includes(deal.id)} onChange={() => toggle(deal.id)} aria-label={`Select ${deal.name}`} /></td><td className="px-3 py-3"><button className="text-left"><strong className="block text-[13px] font-medium text-foreground group-hover:text-foreground">{deal.name}</strong></button></td><td className="px-3 py-3 text-xs text-muted-foreground">{deal.company}</td><td className="px-3 py-3 text-xs text-muted-foreground">{deal.contact}</td><td className="px-3 py-3 text-xs text-foreground">{deal.owner}</td><td className="px-3 py-3"><span className={`rounded-full border px-2 py-1 text-[10px] ${stageTone[deal.stage]}`}>{deal.stage}</span></td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-[10px] ${statusTone[deal.status]}`}>{deal.status}</span></td><td className="px-3 py-3 text-xs font-medium text-foreground">{deal.value}</td><td className="px-3 py-3"><div className="flex items-center gap-2 text-xs text-foreground"><span>{deal.probability}%</span><span className="h-1.5 w-14 rounded-full bg-card"><span className="block h-full rounded-full bg-primary text-primary-foreground" style={{
                            width: `${deal.probability}%`
                          }} /></span></div></td><td className={`px-3 py-3 text-xs ${deal.name === 'Security Suite' ? 'text-chart-5' : 'text-muted-foreground'}`}>{deal.close}</td><td className="px-3 py-3 text-xs"><span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${deal.health === 'Healthy' ? 'bg-chart-4' : deal.health === 'At Risk' ? 'bg-destructive' : 'bg-chart-1'}`} />{deal.health}</td><td className="px-3 py-3 text-xs text-foreground">{deal.priority}</td><td className="px-3 py-3 text-xs text-muted-foreground">{deal.last}</td><td className="px-3 py-3 text-xs text-muted-foreground">{deal.next}</td><td className="px-3"><button aria-label={`Actions for ${deal.name}`} className="text-foreground hover:text-foreground"><Ellipsis size={17} /></button></td></tr>)}</tbody></table></div><div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>1–50 of 312 deals</span><span>Items per page: <strong className="text-foreground">50</strong> <ChevronDown className="inline" size={12} /></span><div className="flex items-center gap-1"><button aria-label="Previous page"><ChevronLeft size={14} /></button><button className="grid h-7 w-7 place-items-center rounded bg-primary text-primary-foreground">1</button><button className="grid h-7 w-7 place-items-center rounded">2</button><button className="grid h-7 w-7 place-items-center rounded">3</button><button aria-label="Next page"><ChevronRight size={14} /></button></div></div></section>
<section className="mt-8"><SectionTitle eyebrow="Pipeline health" title="Deal Aging" /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[['Avg Deal Age', '28 days'], ['Oldest Open Deal', '142 days'], ['Deals Exceeding Stage Duration', '24'], ['Deals Without Recent Activity', '18']].map(([label, value]) => <article key={label} className="rounded-xl border border-border bg-[var(--card)] p-4"><p className="text-xs text-muted-foreground">{label}</p><strong className="mt-2 block text-2xl text-foreground">{value}</strong></article>)}</div><div className="mt-3 rounded-xl border border-border bg-[var(--secondary)] p-4"><div className="grid grid-cols-2 gap-3 text-[10px] uppercase tracking-wider text-muted-foreground sm:grid-cols-5"><span>Deal</span><span>Company</span><span>Stage</span><span>Age</span><span>Last activity</span></div>{[['Security Suite', 'GlobalNet Inc', 'Commit', '142 days', '12 days ago'], ['Marketing Platform', 'TechFlow AG', 'Discovery', '96 days', '8 days ago'], ['Cloud AI Suite', 'Meridian Group', 'Proposal', '74 days', '3 days ago'], ['Enterprise Platform', 'Connected account', 'Negotiation', '61 days', 'Today'], ['CRM Integration Pro', 'BlueWave Ltd', 'Solution', '49 days', '2 days ago']].map(row => <div key={row[0]} className="grid grid-cols-2 gap-3 border-t border-border py-3 text-xs text-foreground sm:grid-cols-5">{row.map((cell, index) => <span key={`${row[0]}-${cell}`} className={index === 0 ? 'font-medium text-foreground' : ''}>{cell}</span>)}</div>)}</div></section>
<section className="mt-8 rounded-xl border border-border bg-[var(--card)] p-5"><SectionTitle eyebrow="Pipeline attention" title="Deals at Risk" badge /><div className="divide-y divide-white/[0.06]">{[['Security Suite', 'GlobalNet Inc', '—', 'No activity for 12 days', 'Confirm sign-off'], ['Cloud AI Suite', 'Meridian Group', '—', 'Close date approaching, no next step', 'Send revised proposal'], ['Data Analytics Hub', 'Vertex Corp', '—', 'Probability declined 15pp', 'Schedule workspace'], ['Marketing Platform', 'TechFlow AG', '—', 'No decision maker identified', 'Schedule discovery call']].map((row, index) => <article key={row[0]} className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center"><div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${index < 2 ? 'bg-chart-5/10 text-chart-5' : 'bg-secondary/10 text-foreground'}`}><AlertTriangle size={15} /></div><div className="min-w-0 flex-1"><strong className="text-sm text-foreground">{row[0]}</strong><p className="text-xs text-muted-foreground">{row[1]} · {row[2]}</p></div><span className="text-xs text-foreground">{row[3]}</span><span className="text-xs text-muted-foreground">Last activity: {index === 0 ? '12 days ago' : '3 days ago'}</span><span className="text-xs text-foreground">{row[4]}</span><button className={buttonClass}>Review</button><button className={buttonClass}>Create Task</button></article>)}</div></section>
<section className="mt-8"><SectionTitle eyebrow="AI-generated intelligence" title="Next Best Actions" badge /><div className="grid gap-3 lg:grid-cols-3">{[['Schedule follow-up', 'Enterprise Platform', 'Connected account', 'High priority'], ['Send proposal', 'Cloud AI Suite', 'Meridian Group', 'High priority'], ['Re-engage customer', 'Marketing Platform', 'TechFlow AG', 'Medium priority']].map(row => <article key={row[0]} className="rounded-xl border border-border bg-[var(--card)] p-4"><div className="flex items-start justify-between"><div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary/10 text-foreground"><CalendarDays size={16} /></div><span className="rounded-full bg-chart-5/10 px-2 py-1 text-[10px] text-chart-5">{row[3]}</span></div><h3 className="mt-4 text-sm font-semibold text-foreground">{row[0]}</h3><p className="mt-1 text-xs text-muted-foreground">{row[1]} · {row[2]}</p><div className="mt-4 flex gap-2"><button className={buttonClass}>Create Task</button><button className={buttonClass}>{row[0] === 'Re-engage customer' ? 'Ask Lulu AI' : 'Open Deal'}</button></div></article>)}</div></section>
<section className="mt-8 grid gap-5 xl:grid-cols-2"><div className="rounded-xl border border-border/15 bg-[var(--secondary)] p-5"><SectionTitle eyebrow="Recently closed" title="Recently Won" /><MiniRow name="Analytics Dashboard" company="Altus Media" value="—" note="25 Aug · 32 day cycle" action="View Deal" /><MiniRow name="Security Suite" company="GlobalNet Inc" value="—" note="18 Aug · 47 day cycle" action="View Deal" /><MiniRow name="BI Reporting" company="Northstar Labs" value="—" note="12 Aug · 29 day cycle" action="View Customer" /></div><div className="rounded-xl border border-chart-5/15 bg-[var(--secondary)] p-5"><SectionTitle eyebrow="Closed without revenue" title="Recently Lost" /><MiniRow name="ERP Connector" company="Pinnacle GmbH" value="—" note="Price · 21 Aug" action="View Deal" /><MiniRow name="Legacy System Upgrade" company="Arc Systems" value="—" note="Competitor · 14 Aug" action="View Deal" /><MiniRow name="AI Tools Bundle" company="Brightside Co" value="—" note="No Budget · 09 Aug" action="View Deal" /></div></section>
<section className="mt-8"><SectionTitle eyebrow="AI-generated intelligence" title="AI Deal Insights" badge /><div className="grid gap-3 lg:grid-cols-3">{[['Closing Risk', 'Security Suite has remained in Commit stage for 18 days without customer confirmation. Win probability may be declining.', 'Review Deal', 'border-chart-5/20', 'text-chart-5'], ['Momentum Increase', 'Data Analytics Hub shows increased email engagement and meeting acceptance. Probability may be higher than current estimate.', 'View Deal', 'border-chart-4/20', 'text-chart-4'], ['Value Opportunity', 'Connected account may have expansion potential based on recent CRM activity and increased platform usage signals.', 'View Deal', 'border-border/20', 'text-foreground']].map(row => <article key={row[0]} className={`rounded-xl border ${row[3]} bg-[var(--card)] p-4`}><div className="flex justify-between"><span className={`text-[10px] font-semibold uppercase tracking-wider ${row[4]}`}>{row[0]}</span><Sparkles size={14} className={row[4]} /></div><p className="mt-3 text-xs leading-5 text-muted-foreground">{row[1]}</p><button className="mt-4 text-xs font-medium text-foreground">{row[2]} →</button></article>)}</div><p className="mt-3 text-[10px] text-muted-foreground">• AI-generated · Supporting evidence where available · Does not modify deals automatically</p></section>
<section className="mt-8"><SectionTitle eyebrow="Prioritized guidance" title="AI Recommendations" badge /><div className="grid gap-3 lg:grid-cols-3">{[['Prioritize Deal', 'Security Suite', 'High priority, near close date', '—'], ['Schedule Follow-up', 'Enterprise Platform', 'No activity for 12 days', '72% probability'], ['Contact Decision Maker', 'Cloud AI Suite', 'Missing key stakeholder', '—']].map(row => <article key={row[0]} className="rounded-xl border border-border bg-[var(--card)] p-4"><div className="flex items-center justify-between"><strong className="text-sm text-foreground">{row[0]}</strong><span className="rounded-full bg-chart-5/10 px-2 py-1 text-[10px] text-chart-5">High priority</span></div><p className="mt-3 text-xs text-muted-foreground">{row[1]}</p><p className="mt-1 text-xs text-muted-foreground">{row[2]}</p><div className="mt-4 flex items-center justify-between"><span className="text-[11px] text-foreground">Impact {row[3]}</span><button className="text-xs text-foreground">Review →</button></div></article>)}</div></section>
<section className="mt-8 grid gap-5 xl:grid-cols-2"><article className="rounded-xl border border-border/20 bg-[var(--card)] p-5"><SectionTitle eyebrow="AI-assisted forecast" title="Deal Probability" badge /><div className="flex items-end gap-8"><div><span className="text-xs text-muted-foreground">Current</span><strong className="mt-1 block text-3xl text-foreground">—</strong></div><div><span className="text-xs text-muted-foreground">Stage probability</span><strong className="mt-1 block text-xl text-foreground">—</strong></div><div><span className="text-xs text-foreground">AI Recommended</span><strong className="mt-1 block text-xl text-foreground">—</strong></div></div><div className="mt-5 h-2 rounded-full bg-card"><span className="block h-full w-[72%] rounded-full bg-primary text-primary-foreground" /></div><p className="mt-4 text-xs leading-5 text-muted-foreground">Enterprise Platform · Recent customer engagement and stage progression indicate stronger deal momentum.</p></article><article className="rounded-xl border border-border bg-[var(--card)] p-5"><SectionTitle eyebrow="Signal monitoring" title="Deal Health Monitor" /><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{[['Healthy', '142', 'bg-chart-4/10 text-chart-4'], ['Needs Attention', '28', 'bg-chart-1/10 text-chart-1'], ['At Risk', '14', 'bg-chart-5/10 text-chart-5'], ['Critical', '2', 'bg-chart-5/10 text-chart-5']].map(row => <div key={row[0]} className={`rounded-lg p-3 ${row[2]}`}><span className="block text-[10px]">{row[0]}</span><strong className="text-xl">{row[1]}</strong></div>)}</div><p className="mt-5 text-xs text-muted-foreground">Signals: Recent activity · Stage duration · Close date · Probability changes · Customer engagement</p></article></section>
<section className="mt-8 grid gap-5 xl:grid-cols-2"><article className="rounded-xl border border-border/15 bg-[var(--card)] p-5"><SectionTitle eyebrow="Review before action" title="Potential Duplicates" /><p className="mb-3 text-xs text-foreground">⚠ Never automatically merge deals.</p><MiniRow name="Enterprise Platform" company="Connected account · Maria Chen · —" value="David Liu" note="Possible match" action="Review / Merge" /><MiniRow name="Cloud AI Suite" company="Meridian Group · Tom Reyes · —" value="Workspace owner" note="Possible match" action="Review / Ignore" /></article><article className="rounded-xl border border-border bg-[var(--card)] p-5"><SectionTitle eyebrow="Data quality" title="Deal Data Quality" /><div className="mb-4 flex items-center gap-3"><strong className="rounded-lg bg-secondary/10 px-3 py-2 text-xl text-foreground">84/100</strong><span className="text-xs text-muted-foreground">Good quality</span></div>{[['Missing probability', '12 deals'], ['Missing next action', '18 deals'], ['Missing expected close', '6 deals'], ['Potential duplicates', '2']].map(row => <div key={row[0]} className="flex items-center justify-between border-t border-border py-2.5 text-xs"><span className="text-muted-foreground">{row[0]} <strong className="text-foreground">({row[1]})</strong></span><button className="text-foreground">Fix</button></div>)}</article></section>
<section className="mt-8 grid gap-5 xl:grid-cols-2"><article className="rounded-xl border border-border bg-[var(--card)] p-5"><SectionTitle eyebrow="Recorded activity" title="Recent Activity" />{[['Calls', 'Today · David Liu', 'Executive meeting logged for Enterprise Platform', 'text-foreground'], ['Emails', 'Yesterday · Workspace owner', 'Revised proposal sent to Meridian Group', 'text-foreground'], ['Meetings', '2 days ago · Workspace member', 'Workspace accepted by Vertex Corp', 'text-foreground'], ['Stage change', '3 days ago · Workspace member', 'CRM Integration Pro moved to Solution', 'text-foreground'], ['Value update', '4 days ago · David Liu', 'Enterprise Platform value updated', 'text-foreground']].map(row => <div key={row[2]} className="flex gap-3 border-t border-border py-3"><Activity size={15} className={row[3]} /><div><strong className="text-xs text-foreground">{row[0]}</strong><p className="text-[11px] text-muted-foreground">{row[1]} · {row[2]}</p></div></div>)}</article><article className="rounded-xl border border-border bg-[var(--card)] p-5"><SectionTitle eyebrow="Enterprise Platform" title="Deal Timeline" />{['Deal Created', 'Qualification Completed', 'Proposal Sent', 'Meeting Completed', 'Stage Changed', 'Negotiation Started'].map((event, index) => <div key={event} className="relative flex gap-3 pb-4 last:pb-0"><div className="relative flex w-4 justify-center"><span className={`z-[1] mt-1.5 h-2 w-2 rounded-full ${index === 5 ? 'bg-primary' : 'bg-secondary'}`} />{index < 5 && <span className="absolute top-3 h-full w-px bg-secondary" />}</div><div><strong className="text-xs text-foreground">{event}</strong><p className="text-[11px] text-muted-foreground">{index === 5 ? 'Today' : `${index + 1} weeks ago`}</p></div></div>)}</article></section>
<section className="mt-8 rounded-2xl border border-border/20 bg-gradient-to-r from-secondary/20 via-[var(--card)] to-secondary/10 p-5 md:p-6"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary/20 text-foreground"><Bot size={18} /></div><div><h2 className="text-lg font-semibold text-foreground">Ask Lulu AI</h2><p className="text-xs text-muted-foreground">Explore your pipeline with natural language.</p></div><AiBadge /></div><div className="mt-5 flex gap-2"><input value={ask} onChange={event => setAsk(event.target.value)} onKeyDown={event => {
                if (event.key === 'Enter') setAnswer(`Lulu is reviewing ${ask || 'your deals'} and will surface the strongest next steps.`);
              }} className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-[var(--secondary)]/80 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground" placeholder="Ask Lulu AI about your deals..." /><button onClick={() => setAnswer(`Lulu is reviewing ${ask || 'your deals'} and will surface the strongest next steps.`)} className="rounded-lg bg-primary px-4 text-primary-foreground"><Send size={16} /></button></div>{answer && <p className="mt-3 rounded-lg bg-[var(--background)]/60 p-3 text-xs text-foreground">{answer}</p>}<div className="mt-4 flex flex-wrap gap-2">{prompts.map(prompt => <button key={prompt} onClick={() => setAsk(prompt)} className="rounded-full border border-border px-3 py-1.5 text-[11px] text-foreground hover:border-border/40 hover:text-foreground">{prompt}</button>)}</div></section><footer className="mt-8 flex flex-col gap-3 border-t border-border py-6 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>Recorded · Calculated · Rule-based · AI-generated · Forecast · Unavailable</span><span>Sales — Deals · Lulu AI Business OS</span></footer></div></main><aside className="hidden w-10 shrink-0 border-l border-border bg-[var(--sidebar)] xl:block"><button className="flex h-full w-full flex-col items-center gap-3 pt-8 text-foreground hover:text-foreground" aria-label="Open deal preview"><PanelRight size={17} /><span className="[writing-mode:vertical-rl] text-[10px] uppercase tracking-[0.18em]">Deal Preview</span></button></aside></div>{showCreate && <section className="fixed right-0 top-0 z-20 h-full w-full max-w-[520px] overflow-y-auto border-l border-border bg-[var(--card)] p-6 shadow-2xl" aria-label="Create deal form"><div className="flex items-start justify-between"><div><p className="text-[10px] uppercase tracking-[0.18em] text-foreground">New opportunity</p><h2 className="mt-1 text-xl font-semibold text-foreground">Create Deal</h2></div><button onClick={() => setShowCreate(false)} aria-label="Close create deal" className="text-foreground hover:text-foreground"><X size={18} /></button></div><div className="mt-6 grid grid-cols-2 gap-3">{['Deal Name*', 'Description', 'Type', 'Stage', 'Status', 'Owner', 'Priority', 'Company*', 'Primary Contact', 'Value*', 'Currency', 'Probability', 'Expected Close Date*', 'Source', 'Territory', 'Tags'].map(label => <label key={label} className="text-[11px] text-muted-foreground"><span className="mb-1.5 block">{label}</span><input className="h-9 w-full rounded-lg border border-border bg-[var(--secondary)] px-3 text-xs text-foreground outline-none focus:border-border" placeholder={label.replace('*', '')} /></label>)}</div><label className="mt-3 block text-[11px] text-muted-foreground"><span className="mb-1.5 block">Notes</span><textarea className="h-20 w-full resize-none rounded-lg border border-border bg-[var(--secondary)] p-3 text-xs text-foreground outline-none focus:border-border" /></label><p className="mt-4 rounded-lg border border-border/20 bg-secondary/5 p-3 text-[11px] text-foreground">Duplicate detection will run against existing deals when you create this opportunity.</p><div className="mt-6 flex justify-end gap-2"><button onClick={() => setShowCreate(false)} className={buttonClass}>Cancel</button><button onClick={() => setShowCreate(false)} className={buttonClass}>Create &amp; Add Another</button><button onClick={() => setShowCreate(false)} className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Create Deal</button></div></section>}</div>;
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
  "label": "Website & Commerce",
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
    "id": "sparklingly-moon-5114",
    "label": "SEO"
  }, {
    "id": "zealously-path-4224",
    "label": "GEO"
  }, {
    "id": "sunny-house-9595",
    "label": "AEO"
  }, {
    "id": "daring-brook-9034",
    "label": "Reviews"
  }, {
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
          <span data-lulu-section-soon={section.label !== "Website & Commerce" && section.label !== "Settings" ? "true" : undefined}>{section.label}</span>
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
