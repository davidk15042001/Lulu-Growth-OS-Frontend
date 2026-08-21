import { useState } from 'react';
import { Activity, AlertTriangle, ArrowUpRight, Bell, Bot, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronRight, CircleDot, Clock3, Download, FileDown, Filter, LayoutDashboard, Mail, Menu, MoreHorizontal, Paperclip, Phone, Plus, Search, Settings2, Sparkles, Target, Users, X, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
const navGroups: {
  label: string;
  items: {
    label: string;
    icon: LucideIcon;
  }[];
}[] = [{
  label: 'Workspace',
  items: [{
    label: 'Overview',
    icon: LayoutDashboard
  }, {
    label: 'Sales Overview',
    icon: Target
  }]
}, {
  label: 'Sales',
  items: [{
    label: 'Leads',
    icon: Users
  }, {
    label: 'Opportunities',
    icon: Activity
  }, {
    label: 'Pipeline',
    icon: Target
  }, {
    label: 'Deals',
    icon: CheckCircle2
  }, {
    label: 'Activities',
    icon: CalendarDays
  }, {
    label: 'Forecast',
    icon: ArrowUpRight
  }, {
    label: 'Analytics',
    icon: LayoutDashboard
  }]
}, {
  label: 'Enablement',
  items: [{
    label: 'Automation',
    icon: Zap
  }, {
    label: 'Playbooks',
    icon: FileDown
  }, {
    label: 'Sequences',
    icon: Mail
  }, {
    label: 'Products & Pricing',
    icon: Target
  }, {
    label: 'Territories',
    icon: Users
  }, {
    label: 'Commissions',
    icon: Activity
  }]
}];
const periods: string[] = [];
const kpis: any[][] = [];
const activities: any[][] = [];
const overdue: any[][] = [];
const owners: any[][] = [];
const upcoming: any[][] = [];
const insights: any[][] = [];
const recommendations: {
  title: string;
  detail: string;
  icon: LucideIcon;
}[] = [];
function Card({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`rounded-xl border border-border bg-card shadow-[0_2px_12px_rgba(0,0,0,0.035)] ${className}`}>{children}</section>;
}
function Label({
  children,
  calculated = false
}: {
  children: React.ReactNode;
  calculated?: boolean;
}) {
  return <span className={`inline-flex rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[.08em] ${calculated ? 'border border-border text-muted-foreground' : 'bg-secondary text-muted-foreground'}`}>{children}</span>;
}
export function SalesActivities() {
  const [mobileNav, setMobileNav] = useState(false);
  const [period, setPeriod] = useState('This Week');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('List');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const { items: activityRecords, loading: activitiesLoading, error: activitiesError } = useLiveRecords('sales_activities');
  const getActivityField = (record: typeof activityRecords[number], key: string) => String((record as unknown as Record<string, unknown>)[key] ?? '');
  const liveActivities = activityRecords.map(record => [getActivityField(record, 'name') || getActivityField(record, 'activity') || 'Sales activity', getActivityField(record, 'type') || 'Activity', getActivityField(record, 'status') || 'Recorded', getActivityField(record, 'dueDate') || record.updatedAt || '—', getActivityField(record, 'ownerName') || 'Workspace owner', getActivityField(record, 'contact') || '—', getActivityField(record, 'company') || '—', getActivityField(record, 'opportunity') || '—', getActivityField(record, 'deal') || '—', getActivityField(record, 'priority') || 'Standard', getActivityField(record, 'outcome') || '—'] as const);
  const liveKpis = [['Total Activities', String(activityRecords.length), 'Live records', 'Observed', 'neutral'], ['Upcoming', String(liveActivities.filter(row => !['Completed', 'Overdue'].includes(row[2])).length), 'Calculated', 'Calculated', 'neutral'], ['Due Today', String(liveActivities.filter(row => row[3].toLowerCase().includes('today')).length), 'Calculated', 'Calculated', 'warning'], ['Overdue', String(liveActivities.filter(row => row[2] === 'Overdue').length), 'Calculated', 'Calculated', 'danger'], ['Completed', String(liveActivities.filter(row => row[2] === 'Completed').length), 'Calculated', 'Recorded', 'success'], ['Calls', String(liveActivities.filter(row => row[1] === 'Call').length), 'Calculated', 'Recorded', 'neutral'], ['Meetings', String(liveActivities.filter(row => row[1] === 'Meeting').length), 'Calculated', 'Recorded', 'neutral'], ['Follow-ups', String(liveActivities.filter(row => row[1] === 'Follow-up').length), 'Calculated', 'Recorded', 'neutral']] as const;
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className={`fixed inset-y-0 left-0 z-30 w-[244px] bg-[var(--sidebar)] text-foreground transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-16 items-center gap-3 border-b border-border px-5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">L</div><span className="text-lg font-semibold tracking-tight text-foreground">Lulu <span className="font-normal text-muted-foreground">AI</span></span><button className="ml-auto lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18} /></button></div>
      <LuluSectionNavigation activeId="warmly-road-3804" />
      <div className="absolute bottom-0 w-full border-t border-border p-4"><button className="flex items-center gap-3 text-sm text-foreground hover:text-foreground"><Settings2 size={17} /><span>Settings</span></button><div className="mt-4 flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">JD</div><div><p className="text-xs font-semibold text-foreground">Workspace owner</p><p className="text-[11px] text-muted-foreground">Administrator</p></div><MoreHorizontal className="ml-auto text-muted-foreground" size={17} /></div></div>
    </aside>
    <main className="lg:pl-[244px]"><header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-secondary px-5 backdrop-blur lg:px-8"><div className="flex items-center gap-3"><button className="text-foreground lg:hidden" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={21} /></button><div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span>Sales</span><ChevronRight size={13} /><span className="font-medium text-foreground">Activities</span></div></div><div className="flex items-center gap-3"><button className="hidden rounded-lg border border-border p-2 text-foreground sm:block" aria-label="Search"><Search size={17} /></button><button className="relative rounded-lg border border-border p-2 text-foreground" aria-label="Notifications"><Bell size={17} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /></button><div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">JD</div></div></header>
      <div className="mx-auto max-w-[1500px] px-5 py-7 lg:px-8">{activitiesError && <div role="alert" className="mb-4 rounded-lg border border-chart-5/30 bg-chart-5/10 px-4 py-3 text-sm text-chart-5">Sales activity data could not be loaded. Check activity records and try again.</div>}{!activitiesLoading && !activitiesError && liveActivities.length === 0 && <></>}<div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-2 text-xs font-medium text-muted-foreground">Sales / Activities</p><h1 className="text-3xl font-bold tracking-[-.04em] text-foreground">Sales Activities</h1><p className="mt-2 text-sm text-muted-foreground">Plan, manage and track every sales interaction from one workspace.</p></div><div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-black/20 hover:bg-primary"><Plus size={16} />Create Activity</button>{[['Ask Lulu AI', Bot], ['Calendar', CalendarDays], ['Import', Paperclip], ['Export', Download]].map(([label, Icon]) => <button key={String(label)} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground hover:bg-card"><Icon size={15} className={label === 'Ask Lulu AI' ? 'text-foreground' : 'text-muted-foreground'} /><span>{String(label)}</span></button>)}<button className="rounded-lg border border-border bg-card px-3 py-2.5 text-foreground" aria-label="More actions"><MoreHorizontal size={18} /></button></div></div>
        <div className="mt-7 flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1.5 shadow-sm">{periods.map(item => <button key={item} onClick={() => setPeriod(item)} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${period === item ? 'bg-primary text-primary-foreground shadow-sm' : 'text-primary-foreground hover:bg-card hover:text-primary-foreground'}`}>{item}</button>)}</div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">{(activitiesLoading ? [] : liveKpis).map(([label, value, trend, type, tone]) => <Card key={label} className={`p-3.5 ${tone === 'danger' ? 'border-chart-5/30 bg-chart-5/40' : tone === 'warning' ? 'border-chart-1/30 bg-chart-1/30' : ''}`}><div className="flex items-start justify-between gap-1"><p className="text-[11px] font-medium leading-4 text-muted-foreground">{label}</p><Label calculated={type === 'Calculated'}>{type}</Label></div><p className={`mt-2 text-xl font-bold tracking-[-.03em] ${tone === 'danger' ? 'text-chart-5' : tone === 'warning' ? 'text-chart-1' : 'text-foreground'}`}>{value}</p><p className={`mt-1 flex items-center gap-1 text-[10px] font-semibold ${tone === 'danger' ? 'text-chart-5' : 'text-chart-4'}`}><ArrowUpRight size={12} />{trend}<span className="font-normal text-muted-foreground">vs prev</span></p></Card>)}</div>
        <div className="mt-5 flex flex-col gap-3 xl:flex-row"><div className="relative min-w-[230px] flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><input value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-12 text-sm outline-none ring-ring placeholder:text-muted-foreground focus:ring-2" placeholder="Search activities..." aria-label="Search activities" /><kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">⌘ K</kbd></div><div className="flex flex-wrap gap-2">{['Type', 'Status', 'Owner', 'Contact', 'Company', 'Opportunity', 'Deal', 'Priority', 'Date'].map(item => <button key={item} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-medium text-foreground hover:border-border"><Filter size={12} className="text-muted-foreground" />{item}<ChevronDown size={12} className="text-muted-foreground" /></button>)}<button className="px-2 text-xs font-semibold text-foreground hover:text-foreground">Clear Filters</button><button className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground">Save Filter</button></div></div>
        <div className="mt-5 flex items-center justify-between"><p className="text-xs text-muted-foreground">{activitiesLoading ? 'Loading activities' : `${liveActivities.length} activities`} <span className="mx-2">·</span> Updated just now</p><div className="flex rounded-lg border border-border bg-card p-1">{['List', 'Calendar', 'Timeline', 'Table'].map(item => <button key={item} onClick={() => setView(item)} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${view === item ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-card'}`}>{item}</button>)}</div></div>
        <Card className="mt-3 overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[1420px] text-left text-xs"><thead className="sticky top-16 z-10 border-b border-border bg-card text-[10px] uppercase tracking-[.09em] text-muted-foreground"><tr>{['Activity', 'Type', 'Status', 'Date / Time', 'Owner', 'Contact', 'Company', 'Opportunity', 'Deal', 'Priority', 'Outcome', 'Actions'].map(heading => <th key={heading} className="whitespace-nowrap px-3 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody>{(activitiesLoading ? [] : liveActivities).filter(row => row.join(' ').toLowerCase().includes(search.toLowerCase())).map((row, index) => <tr key={row[0]} className={`border-b border-border transition hover:bg-secondary/50 ${index % 2 ? 'bg-secondary/35' : 'bg-card'}`}><td className="px-3 py-3"><div className="flex items-center gap-2"><input type="checkbox" aria-label={`Select ${row[0]}`} className="accent-primary" /><strong className="whitespace-nowrap text-foreground">{row[0]}</strong></div></td><td className="px-3 py-3"><span className="inline-flex items-center gap-1.5 text-muted-foreground"><CircleDot size={13} className="text-foreground" />{row[1]}</span></td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${row[2] === 'Completed' ? 'bg-chart-4/10 text-chart-4' : row[2] === 'Overdue' ? 'bg-chart-5/10 text-chart-5' : row[2] === 'In Progress' ? 'bg-secondary text-foreground' : row[2] === 'Sent' ? 'bg-secondary text-muted-foreground' : 'bg-secondary text-foreground'}`}>{row[2]}</span></td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{row[3]}</td><td className="whitespace-nowrap px-3 py-3 font-medium">{row[4]}</td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{row[5]}</td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{row[6]}</td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{row[7]}</td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{row[8]}</td><td className="px-3 py-3"><span className="inline-flex items-center gap-1.5"><i className={`h-2 w-2 rounded-full ${row[9] === 'High' ? 'bg-destructive' : row[9] === 'Medium' ? 'bg-primary' : 'bg-muted'}`} />{row[9]}</span></td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{row[10] ?? '—'}</td><td className="px-3 py-3"><button className="rounded-md p-1 text-foreground hover:bg-secondary hover:text-foreground" aria-label={`Actions for ${row[0]}`}><MoreHorizontal size={16} /></button></td></tr>)}</tbody></table></div></Card>
        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,.9fr)]"><div className="space-y-5"><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Upcoming Activities</h2><p className="mt-1 text-xs text-muted-foreground">Your next customer moments, organized by day.</p></div><button className="text-xs font-semibold text-foreground">View calendar <ChevronRight className="inline" size={14} /></button></div><div className="mt-4 grid gap-5 md:grid-cols-2"><div><h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Today · 3 items</h3>{upcoming.slice(0, 3).map(item => <div key={item[1]} className="border-b border-border py-3 last:border-0"><div className="flex gap-3"><time className="w-10 text-xs font-semibold text-foreground">{item[0]}</time><div className="min-w-0 flex-1"><p className="text-xs font-semibold">{item[1]}</p><p className="mt-1 text-[11px] text-muted-foreground">{item[2]} · {item[3]}</p><span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${item[4] === 'High' ? 'bg-chart-5/10 text-chart-5' : item[4] === 'Medium' ? 'bg-secondary text-foreground' : 'bg-secondary text-muted-foreground'}`}>{item[4]} priority</span></div><div className="flex gap-1"><button className="rounded border border-border px-2 py-1 text-[10px] font-semibold">Open</button><button className="rounded bg-chart-4/10 px-2 py-1 text-[10px] font-semibold text-chart-4">Complete</button></div></div></div>)}</div><div><h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tomorrow · 2 items</h3>{upcoming.slice(3).map(item => <div key={item[1]} className="border-b border-border py-3 last:border-0"><div className="flex gap-3"><time className="w-10 text-xs font-semibold text-foreground">{item[0]}</time><div className="min-w-0 flex-1"><p className="text-xs font-semibold">{item[1]}</p><p className="mt-1 text-[11px] text-muted-foreground">{item[2]} · {item[3]}</p><span className="mt-2 inline-flex rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{item[4]} priority</span></div><button className="rounded border border-border px-2 py-1 text-[10px] font-semibold">Open</button></div></div>)}<div className="mt-3 flex items-center justify-between rounded-lg bg-card px-3 py-2"><span className="text-xs font-semibold text-muted-foreground">This Week</span><span className="text-xs font-bold text-foreground">12 activities <ChevronRight className="inline" size={13} /></span></div></div></div></Card>
          <Card className="overflow-hidden"><div className="border-l-4 border-chart-5 bg-chart-5/60 p-4"><div className="flex items-center gap-2"><AlertTriangle className="text-chart-5" size={17} /><h2 className="font-semibold text-chart-5">Overdue Activities</h2></div><p className="mt-1 text-xs text-chart-5">3 activities need attention today. Prioritize customer-facing work first.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-xs"><thead className="border-b border-border bg-card text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Activity', 'Owner', 'Customer', 'Related Deal', 'Due Date', 'Days Overdue', 'Priority', 'Recommended Action'].map(x => <th key={x} className="px-4 py-3 font-semibold">{x}</th>)}</tr></thead><tbody>{overdue.map(row => <tr key={row[0]} className="border-b border-border"><td className="px-4 py-3 font-semibold">{row[0]}</td><td className="px-4 py-3">{row[1]}</td><td className="px-4 py-3 text-muted-foreground">{row[2]}</td><td className="px-4 py-3 text-muted-foreground">{row[3]}</td><td className="px-4 py-3 text-chart-5">{row[4]}</td><td className="px-4 py-3 font-semibold text-chart-5">{row[5]}</td><td className="px-4 py-3">{row[6]}</td><td className="whitespace-nowrap px-4 py-3"><button className="mr-2 text-[10px] font-semibold text-foreground">Complete</button><button className="text-[10px] font-semibold text-foreground">Reschedule</button></td></tr>)}</tbody></table></div></Card>
          <Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Recent Activity Timeline</h2><p className="mt-1 text-xs text-muted-foreground">A chronological view of your team’s work.</p></div><Clock3 size={17} className="text-muted-foreground" /></div><div className="mt-5 ml-2 border-l border-border">{[['10:15', 'Call completed', 'Connected account', 'bg-primary'], ['11:30', 'Proposal follow-up scheduled', 'Connected account', 'bg-primary'], ['14:00', 'Meeting completed', 'Global Retail', 'bg-chart-4'], ['16:20', 'Deal activity recorded', 'Enterprise Platform', 'bg-chart-1']].map(item => <div key={item[0]} className="relative pb-5 pl-6 last:pb-0"><span className={`absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full ring-4 ring-white ${item[3]}`} /><button onClick={() => setExpanded(expanded === item[0] ? null : item[0])} className="flex w-full items-start justify-between text-left"><div><time className="text-[11px] font-semibold text-muted-foreground">{item[0]}</time><p className="mt-1 text-xs font-semibold">{item[1]} <span className="font-normal text-muted-foreground">· {item[2]}</span></p>{expanded === item[0] && <p className="mt-1 text-[11px] text-muted-foreground">Activity details are available from the connected sales record.</p>}</div><ChevronDown size={14} className={`text-muted-foreground transition ${expanded === item[0] ? 'rotate-180' : ''}`} /></button></div>)}</div></Card>
        </div><div className="space-y-5"><Card className="p-5"><div className="flex items-start justify-between"><div><h2 className="font-semibold">Activity Performance</h2><p className="mt-1 text-xs text-muted-foreground">Selected period efficiency</p></div><Label calculated>Calculated</Label></div><div className="mt-5 grid grid-cols-2 gap-4">{[['Activities Completed', '189'], ['Completion Rate', '76%'], ['Overdue Rate', '5%'], ['Avg per Owner', '62']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className="mt-1 text-lg font-bold">{item[1]}</p></div>)}</div><div className="mt-5 space-y-2">{[['Call', 87, 'bg-primary'], ['Meeting', 43, 'bg-primary'], ['Email', 32, 'bg-primary'], ['Follow-up', 61, 'bg-chart-1'], ['Workspace', 18, 'bg-primary'], ['Other', 7, 'bg-muted']].map(item => <div key={item[0]} className="flex items-center gap-2 text-[11px]"><span className="w-14 text-muted-foreground">{item[0]}</span><div className="h-2 flex-1 rounded-full bg-secondary"><div className={`h-full rounded-full ${item[2]}`} style={{
                      width: `${Number(item[1]) / 87 * 100}%`
                    }} /></div><strong className="w-6 text-right">{item[1]}</strong></div>)}</div></Card>
        <Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Activity by Owner</h2><p className="mt-1 text-xs text-muted-foreground">No automatic ranking</p></div><Users size={17} className="text-muted-foreground" /></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[370px] text-left text-[11px]"><thead className="border-b border-border text-[9px] uppercase tracking-wider text-muted-foreground"><tr>{['Owner', 'Total', 'Completed', 'Upcoming', 'Overdue', 'Rate'].map(x => <th key={x} className="pb-2 font-semibold">{x}</th>)}</tr></thead><tbody>{owners.map(row => <tr key={row[0]} className="border-b border-border last:border-0"><td className="py-2.5 font-semibold">{row[0]}</td><td>{row[1]}</td><td className="text-foreground">{row[2]}</td><td>{row[3]}</td><td className="text-chart-5">{row[4]}</td><td className="font-semibold">{row[5]}</td></tr>)}</tbody></table></div></Card>
        <Card className="border-border bg-secondary/50 p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Sparkles size={17} className="text-foreground" /><h2 className="font-semibold text-foreground">AI Activity Insights</h2></div><Label>AI-generated</Label></div><div className="mt-4 space-y-2">{insights.map(item => <div key={item[0]} className="rounded-lg bg-secondary p-3"><div className="flex gap-3"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item[3] === 'red' ? 'bg-destructive' : item[3] === 'amber' ? 'bg-chart-1' : 'bg-primary'}`} /><div><p className="text-xs font-semibold">{item[0]} <span className="ml-1 text-[9px] font-medium uppercase text-foreground">AI-generated</span></p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{item[1]}</p><button className="mt-2 text-[10px] font-semibold text-foreground">{item[2]} →</button></div></div></div>)}</div></Card>
        <Card className="p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Bot size={17} className="text-foreground" /><h2 className="font-semibold">AI Recommended Actions</h2></div><Label>AI-generated</Label></div><div className="mt-4 space-y-3">{recommendations.map(item => {
                  const Icon = item.icon;
                  return <div key={item.title} className="flex gap-3 border-b border-border pb-3 last:border-0"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground"><Icon size={14} /></span><div className="min-w-0 flex-1"><p className="text-xs font-semibold">{item.title}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{item.detail}</p><div className="mt-2 flex flex-wrap gap-2 text-[10px] font-semibold"><button className="text-foreground">Create Activity</button><button className="text-foreground">Create Task</button><button className="text-foreground">Open Deal</button><button className="text-foreground">Ask Lulu AI</button></div></div></div>;
                })}</div><p className="mt-3 text-[10px] text-muted-foreground">AI recommendations do not automatically create activities.</p></Card></div></div>
        <div className="mt-5 grid gap-5 xl:grid-cols-2"><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Potential Duplicate Activities</h2><p className="mt-1 text-xs text-muted-foreground">Review suggested matches before taking action.</p></div><button className="text-foreground" aria-label="Collapse duplicate activities"><ChevronDown size={17} /></button></div><div className="mt-4 space-y-3">{[['Executive Follow-up', 'Maria Chen', 'Connected account', 'Today · 14:30'], ['Contract Review Meeting', 'Maria Chen', 'Connected account', '24 Jun · 09:00']].map(item => <div key={item[0]} className="flex flex-wrap items-center gap-3 rounded-lg border border-chart-1/30 bg-chart-1/50 p-3"><div className="min-w-[150px] flex-1"><p className="text-xs font-semibold">{item[0]}</p><p className="mt-1 text-[10px] text-muted-foreground">{item[1]} · {item[2]} · {item[3]}</p></div><button className="text-[10px] font-semibold text-foreground">Review</button><button className="text-[10px] font-semibold text-foreground">Merge</button><button className="text-[10px] font-semibold text-foreground">Ignore</button></div>)}</div><p className="mt-3 text-[10px] font-medium text-foreground">Never automatically merge activities.</p></Card><Card className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Activity Data Quality</h2><p className="mt-1 text-xs text-muted-foreground">Keep your activity records useful and complete.</p></div><div className="flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-chart-4/30 border-t-chart-4 text-sm font-bold text-chart-4">—</div></div><div className="mt-4 space-y-2">{[['Missing outcome', '8'], ['Missing related record', '4'], ['Missing activity type', '2'], ['Duplicate activities', '1']].map(item => <div key={item[0]} className="flex items-center justify-between border-b border-border pb-2 text-xs last:border-0"><span className="text-muted-foreground">{item[0]}</span><span className="font-bold text-foreground">{item[1]} <button className="ml-3 text-[10px] font-semibold text-foreground">{item[0] === 'Missing outcome' ? 'Fix' : 'Review'}</button></span></div>)}</div></Card></div>
        <Card className="mt-5 mb-8 border-border bg-gradient-to-br from-secondary to-white p-5 sm:p-6"><div className="flex flex-wrap items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Bot size={19} /></div><div><h2 className="font-semibold text-foreground">Ask Lulu AI</h2><p className="text-xs text-muted-foreground">AI-generated · Uses connected data</p></div><Label>AI-generated</Label></div><div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm"><input value={prompt} onChange={e => setPrompt(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Ask Lulu AI about your sales activities..." aria-label="Ask Lulu AI about your sales activities" /><button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Send</button></div><div className="mt-4 flex flex-wrap gap-2">{['What activities are overdue?', 'What should I do today?', 'Which deals have no follow-up?', 'Which customers have been contacted recently?', 'Show me today’s sales activities.'].map(item => <button key={item} onClick={() => setPrompt(item)} className="rounded-full border border-border bg-card px-3 py-1.5 text-[11px] text-foreground hover:bg-secondary">{item}</button>)}</div></Card>
      </div></main>
  </div>;
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
