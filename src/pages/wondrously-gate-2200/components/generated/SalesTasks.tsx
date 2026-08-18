import { useState } from 'react';
import { Activity, AlertTriangle, ArrowUpRight, Bell, Bot, CalendarDays, CheckSquare, ChevronDown, Clock, Filter, Gauge, KanbanSquare, LayoutDashboard, List, Menu, MoreHorizontal, Plus, Search, Settings2, Sparkles, Table2, Target, TrendingUp, Users, X, Zap, FileText, Mail, DollarSign, RefreshCw, Check, Calendar, SlidersHorizontal } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type Tone = 'positive' | 'negative' | 'warning' | 'neutral' | 'ai' | 'forecast';
type Task = {
  id: string;
  task: string;
  status: string;
  priority: string;
  due: string;
  owner: string;
  contact: string;
  company: string;
  opportunity: string;
  deal: string;
  activity: string;
  updated: string;
};
type Owner = {
  name: string;
  initials: string;
  open: number;
  progress: number;
  completed: number;
  overdue: number;
  rate: number;
  color: string;
};
const navGroups = [{
  label: 'Workspace',
  items: [['Overview', LayoutDashboard], ['Executive Dashboard', Gauge]]
}, {
  label: 'Sales',
  items: [['Leads', Users], ['Opportunities', KanbanSquare], ['Pipeline', TrendingUp], ['Deals', Target], ['Activities', Activity], ['Tasks', CheckSquare], ['Forecast', TrendingUp], ['Analytics', FileText]]
}, {
  label: 'Enablement',
  items: [['Automation', Zap], ['Playbooks', FileText], ['Sequences', Mail], ['Products & Pricing', DollarSign], ['Territories', Users], ['Commissions', Target]]
}] as const;
const periods = ['Today', 'Tomorrow', 'This Week', 'Next Week', 'This Month', 'Previous Month', 'Last 30 Days', 'Custom Range'];
const kpis = [['Total Tasks', '124', 'neutral'], ['Due Today', '18', 'warning'], ['Upcoming', '67', 'neutral'], ['Overdue', '9', 'negative'], ['Completed', '31', 'positive'], ['High Priority', '22', 'warning'], ['Unassigned', '5', 'warning'], ['Completion Rate', '72.4%', 'positive']] as const;
const dueToday = [['09:00', 'Call Maria Chen about renewal', 'High', 'Nova Commerce', 'Sales team member', 'Enterprise Platform'], ['10:30', 'Send enterprise proposal to Apex', 'Critical', 'Apex Global', 'Workspace owner', 'Apex Expansion'], ['11:00', 'Follow up on pricing objection', 'High', 'DataFlow Inc', 'Marcus R.', 'DataFlow SaaS'], ['14:00', 'Demo with RetailMax stakeholders', 'High', 'RetailMax', 'James P.', 'RetailMax Q3'], ['15:00', 'Follow up on enterprise proposal', 'High', 'Nova Commerce', 'Sales team member', 'Enterprise Platform']] as const;
const overdue = [['Reconnect with Apex decision maker', 'Sales team member', 'Apex Global', 'Apex Expansion', 'Apex Platform', '3 days ago', '3 days', 'Critical', 'Contact decision maker before close date'], ['Update deal timeline for TechVision', 'Sarah C.', 'TechVision', 'TechVision Renewal', 'TechVision Ent.', '5 days ago', '5 days', 'High', 'Update deal record and reschedule'], ['Send ROI analysis to DataFlow', 'Marcus R.', 'DataFlow Inc', 'DataFlow SaaS', 'DataFlow Ent.', '2 days ago', '2 days', 'High', 'Prepare and send analysis'], ['Confirm meeting with CloudBase exec', 'Emma W.', 'CloudBase', 'CloudBase Growth', 'CloudBase Pro', '1 day ago', '1 day', 'Medium', 'Confirm attendance']] as const;
const tasks: Task[] = [{
  id: 't1',
  task: 'Follow up on enterprise proposal',
  status: 'Open',
  priority: 'High',
  due: 'Today · 15:00',
  owner: 'Sales team member',
  contact: 'Maria Chen',
  company: 'Nova Commerce',
  opportunity: 'Enterprise Expansion',
  deal: 'Enterprise Platform',
  activity: 'Proposal Review',
  updated: 'Today'
}, {
  id: 't2',
  task: 'Schedule pricing review with Apex',
  status: 'In Progress',
  priority: 'Critical',
  due: 'Today · 09:00',
  owner: 'Workspace owner',
  contact: 'John Kim',
  company: 'Apex Global',
  opportunity: 'Apex Growth',
  deal: 'Apex Platform',
  activity: '—',
  updated: '2h ago'
}, {
  id: 't3',
  task: 'Send ROI analysis',
  status: 'Open',
  priority: 'High',
  due: 'Tomorrow',
  owner: 'Marcus R.',
  contact: 'Amy Torres',
  company: 'DataFlow Inc',
  opportunity: 'DataFlow SaaS',
  deal: 'DataFlow Ent.',
  activity: '—',
  updated: 'Yesterday'
}, {
  id: 't4',
  task: 'Confirm Q3 meeting',
  status: 'Open',
  priority: 'Medium',
  due: 'Thu',
  owner: 'James P.',
  contact: 'Peter White',
  company: 'RetailMax',
  opportunity: 'RetailMax Q3',
  deal: 'RetailMax Deal',
  activity: 'Meeting Request',
  updated: '2 days ago'
}, {
  id: 't5',
  task: 'Update deal notes',
  status: 'Completed',
  priority: 'Low',
  due: 'Yesterday',
  owner: 'Emma W.',
  contact: 'Susan Lake',
  company: 'CloudBase',
  opportunity: 'CloudBase Growth',
  deal: 'CloudBase Pro',
  activity: '—',
  updated: 'Yesterday'
}, {
  id: 't6',
  task: 'Request legal review',
  status: 'In Progress',
  priority: 'High',
  due: 'Fri',
  owner: 'Tom M.',
  contact: 'Derek Stone',
  company: 'TechVision',
  opportunity: 'TechVision Renewal',
  deal: 'TechVision Ent.',
  activity: 'Contract Draft',
  updated: '3 days ago'
}, {
  id: 't7',
  task: 'Prepare executive brief',
  status: 'Open',
  priority: 'Critical',
  due: 'Today · 11:00',
  owner: 'Workspace owner',
  contact: 'Amy Torres',
  company: 'Apex Global',
  opportunity: 'Apex Expansion',
  deal: 'Apex Platform',
  activity: '—',
  updated: '1h ago'
}, {
  id: 't8',
  task: 'Follow up post-demo',
  status: 'Overdue',
  priority: 'High',
  due: 'Mon · 3 days',
  owner: 'Sales team member',
  contact: 'Maria Chen',
  company: 'Nova Commerce',
  opportunity: 'Enterprise Expansion',
  deal: 'Enterprise Platform',
  activity: 'Demo Recording',
  updated: '3 days ago'
}];
const owners: Owner[] = [{
  name: 'Sales team member',
  initials: 'DL',
  open: 18,
  progress: 4,
  completed: 12,
  overdue: 3,
  rate: 71,
  color: 'var(--foreground)'
}, {
  name: 'Workspace owner',
  initials: 'SC',
  open: 22,
  progress: 3,
  completed: 15,
  overdue: 1,
  rate: 83,
  color: 'var(--chart-4)'
}, {
  name: 'Marcus Rodriguez',
  initials: 'MR',
  open: 16,
  progress: 5,
  completed: 9,
  overdue: 2,
  rate: 75,
  color: 'var(--chart-1)'
}, {
  name: 'James Park',
  initials: 'JP',
  open: 14,
  progress: 2,
  completed: 8,
  overdue: 2,
  rate: 71,
  color: 'var(--chart-4)'
}, {
  name: 'Emma Wilson',
  initials: 'EW',
  open: 19,
  progress: 3,
  completed: 11,
  overdue: 1,
  rate: 74,
  color: 'var(--foreground)'
}, {
  name: 'Tom Mitchell',
  initials: 'TM',
  open: 12,
  progress: 1,
  completed: 7,
  overdue: 0,
  rate: 88,
  color: 'var(--muted-foreground)'
}];
const upcomingGroups = [{
  label: 'Tomorrow',
  items: [['Send ROI analysis to DataFlow', 'Tomorrow · 10:00', 'High', 'MR', 'DataFlow Inc', 'DataFlow Ent.'], ['Confirm Q3 meeting', 'Tomorrow · 14:00', 'Medium', 'JP', 'RetailMax', 'RetailMax Deal']]
}, {
  label: 'This Week',
  items: [['Request legal review', 'Friday', 'High', 'TM', 'TechVision', 'TechVision Ent.'], ['Prepare account plan', 'Friday', 'Low', 'EW', 'CloudBase', 'CloudBase Pro']]
}, {
  label: 'Next Week',
  items: [['Schedule renewal check-in', 'Mon, 21 Oct', 'Medium', 'DL', 'Nova Commerce', 'Enterprise Platform'], ['Share customer story', 'Tue, 22 Oct', 'Low', 'SC', 'Apex Global', 'Apex Platform']]
}] as const;
const performance = [['Completed Tasks', '31'], ['Completion Rate', '72.4%'], ['Overdue Rate', '7.3%'], ['Avg Completion Time', '2.4 days'], ['Tasks per Owner', '24.8 avg'], ['High-Priority Completion', '68%'], ['Deferred Tasks', '12'], ['On-Time Rate', '84.2%']] as const;
const aiPriority = [['Critical Task', 'Follow up on Enterprise Platform before the expected close date.', 'Close date is 3 days away. No contact in 8 days.', 'red', 'Create Task', 'Open Deal'], ['High Priority', 'Contact Apex decision-maker — has not been reached in 14 days.', 'Decision-maker engagement dropped. Deal value: €320,000.', 'amber', 'Create Task', 'Ask Lulu AI'], ['Overdue Risk', 'Overdue task linked to high-value DataFlow deal (€180,000).', 'Task 5 days overdue. Deal close date approaching.', 'orange', 'Complete Task', 'Reschedule']] as const;
const recommendations = [['Schedule customer follow-up with Nova Commerce', 'High'], ['Contact decision maker at Apex Global', 'Critical'], ['Send proposal to RetailMax', 'High'], ['Review pricing with DataFlow', 'Medium'], ['Schedule meeting with CloudBase exec', 'High'], ['Complete overdue TechVision task', 'Critical']] as const;
const prompts = ['What should I do today?', 'Which tasks are most important?', 'What tasks are overdue?', 'Which tasks are linked to high-value deals?', 'What should I prioritize before Friday?', 'Which sales tasks can be postponed?', 'Show me all critical tasks.', 'Summarize my outstanding sales tasks.'];
function Badge({
  children,
  tone = 'neutral'
}: {
  children: string;
  tone?: Tone;
}) {
  const styles: Record<Tone, string> = {
    positive: 'bg-chart-4/10 text-chart-4',
    negative: 'bg-chart-5/10 text-chart-5',
    warning: 'bg-chart-1/10 text-chart-1',
    neutral: 'bg-secondary text-muted-foreground',
    ai: 'bg-secondary text-foreground',
    forecast: 'bg-secondary text-foreground'
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[.08em] ${styles[tone]}`}>{children}</span>;
}
function Card({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`rounded-xl border border-border bg-card shadow-[0_2px_12px_rgba(0,0,0,0.035)] ${className}`}>{children}</section>;
}
function Avatar({
  initials,
  color = 'var(--primary)'
}: {
  initials: string;
  color?: string;
}) {
  return <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-foreground" style={{
    backgroundColor: color
  }}>{initials}</span>;
}
export function SalesTasks() {
  const [activeView, setActiveView] = useState('List');
  const [period, setPeriod] = useState('This Week');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { items: taskRecords, loading: tasksLoading, error: tasksError } = useLiveRecords('sales_tasks');
  const getTaskField = (record: typeof taskRecords[number], key: string) => String((record as unknown as Record<string, unknown>)[key] ?? '');
  const liveTasks: Task[] = taskRecords.map(record => ({ id: record.id, task: getTaskField(record, 'task') || getTaskField(record, 'name') || 'Sales task', status: getTaskField(record, 'status') || 'Open', priority: getTaskField(record, 'priority') || 'Standard', due: getTaskField(record, 'dueDate') || '—', owner: getTaskField(record, 'ownerName') || 'Workspace owner', contact: getTaskField(record, 'contact') || '—', company: getTaskField(record, 'company') || '—', opportunity: getTaskField(record, 'opportunity') || '—', deal: getTaskField(record, 'deal') || '—', activity: getTaskField(record, 'activity') || '—', updated: record.updatedAt || '—' }));
  const effectiveTasks = tasksLoading ? [] : liveTasks;
  const liveKpis = [['Total Tasks', String(effectiveTasks.length), 'neutral'], ['Due Today', String(effectiveTasks.filter(task => task.due.toLowerCase().includes('today')).length), 'warning'], ['Upcoming', String(effectiveTasks.filter(task => task.status !== 'Completed').length), 'neutral'], ['Overdue', String(effectiveTasks.filter(task => task.status === 'Overdue').length), 'negative'], ['Completed', String(effectiveTasks.filter(task => task.status === 'Completed').length), 'positive'], ['High Priority', String(effectiveTasks.filter(task => ['High', 'Critical'].includes(task.priority)).length), 'warning'], ['Unassigned', String(effectiveTasks.filter(task => task.owner === 'Workspace owner').length), 'warning'], ['Completion Rate', effectiveTasks.length ? `${Math.round(effectiveTasks.filter(task => task.status === 'Completed').length / effectiveTasks.length * 100)}%` : '—', 'positive']] as const;
  const toggleRow = (id: string) => setSelectedRows(current => current.includes(id) ? current.filter(row => row !== id) : [...current, id]);
  const toneFor = (value: string): Tone => value === 'Critical' || value === 'Overdue' ? 'negative' : value === 'High' || value === 'Deferred' ? 'warning' : value === 'Completed' ? 'positive' : value === 'In Progress' ? 'forecast' : 'neutral';
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className={`fixed inset-y-0 left-0 z-30 w-[220px] border-r border-border bg-card transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-16 items-center gap-2 border-b border-border px-5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">L</div><span className="text-lg font-semibold tracking-tight">Lulu <span className="font-normal text-muted-foreground">AI</span></span><button className="ml-auto text-foreground lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18} /></button></div>
      <LuluSectionNavigation activeId="wondrously-gate-2200" />
      <div className="absolute bottom-0 w-full border-t border-border p-4"><button className="flex items-center gap-3 text-sm text-foreground hover:text-foreground"><Settings2 size={17} /><span>Settings</span></button><div className="mt-4 flex items-center gap-3"><Avatar initials="JD" color="var(--muted-foreground)" /><div><p className="text-xs font-semibold">Workspace owner</p><p className="text-[11px] text-muted-foreground">Administrator</p></div><MoreHorizontal className="ml-auto text-muted-foreground" size={17} /></div></div>
    </aside>
    <main className="lg:pl-[220px]"><header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-border bg-secondary px-5 backdrop-blur lg:px-8"><div className="flex items-center gap-3"><button onClick={() => setMobileNav(true)} className="text-foreground lg:hidden" aria-label="Open navigation"><Menu size={21} /></button><div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span>Sales</span><span>/</span><span className="font-medium text-foreground">Tasks</span></div></div><div className="flex items-center gap-3"><button className="hidden rounded-lg border border-border p-2 text-foreground hover:bg-card sm:block" aria-label="Search"><Search size={17} /></button><button className="relative rounded-lg border border-border p-2 text-foreground hover:bg-card" aria-label="Notifications"><Bell size={17} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /></button><Avatar initials="JD" /></div></header>
        <div className="mx-auto max-w-[1500px] px-5 py-7 lg:px-8">{tasksError && <div role="alert" className="mb-4 rounded-lg border border-chart-5/30 bg-chart-5/10 px-4 py-3 text-sm text-chart-5">Sales task data could not be loaded. Check task records and try again.</div>}{!tasksLoading && !tasksError && effectiveTasks.length === 0 && <div className="mb-4 rounded-lg border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground">No sales tasks are available yet.</div>}
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-2 text-xs font-medium text-muted-foreground">Sales / Tasks</p><h1 className="text-2xl font-bold tracking-[-.035em] text-foreground">Sales Tasks</h1><p className="mt-2 text-sm text-muted-foreground">Organize, prioritize and complete the actions that move your sales forward.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-black/20 hover:bg-primary"><Plus size={16} /> Create Task</button><button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"><Sparkles size={16} /> Ask Lulu AI</button><button className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground hover:bg-card sm:inline-flex"><CalendarDays size={16} /> Calendar</button><button className="hidden rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground sm:inline-flex">Import</button><button className="hidden rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground sm:inline-flex">Export</button><button className="rounded-lg border border-border bg-card px-3 py-2.5 text-foreground hover:bg-card" aria-label="More actions"><MoreHorizontal size={18} /></button></div></div>
        <div className="mt-7 flex flex-wrap items-center gap-3"><div className="relative"><button onClick={() => setPeriodOpen(!periodOpen)} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground shadow-sm" aria-expanded={periodOpen}><CalendarDays size={16} className="text-foreground" />{period}<ChevronDown size={15} className="text-muted-foreground" /></button>{periodOpen && <div className="absolute left-0 top-12 z-20 w-48 rounded-lg border border-border bg-card p-1.5 shadow-xl">{periods.map(item => <button key={item} onClick={() => {
                setPeriod(item);
                setPeriodOpen(false);
              }} className={`w-full rounded-md px-3 py-2 text-left text-xs ${period === item ? 'bg-secondary font-semibold text-foreground' : 'text-foreground hover:bg-card'}`}>{item}</button>)}</div>}</div><span className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex"><span className="h-2 w-2 rounded-full bg-primary text-primary-foreground" />Updated just now</span></div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">{(tasksLoading ? [] : liveKpis).map(([label, value, tone]) => <Card key={label} className="p-4"><div className="flex items-start justify-between gap-2"><p className="text-xs font-medium text-muted-foreground">{label}</p>{label === 'Completion Rate' && <Badge>Calculated</Badge>}</div><p className={`mt-3 text-xl font-bold tracking-[-.03em] ${label === 'Overdue' ? 'text-chart-5' : 'text-foreground'}`}>{value}</p><span className={`mt-2 inline-flex items-center gap-1 text-[11px] font-semibold ${tone === 'negative' ? 'text-chart-5' : tone === 'positive' ? 'text-chart-4' : tone === 'warning' ? 'text-chart-1' : 'text-muted-foreground'}`}>{tone === 'positive' ? <ArrowUpRight size={13} /> : tone === 'negative' ? <AlertTriangle size={13} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />} {label === 'Completion Rate' ? 'Calculated' : label === 'Overdue' ? 'Needs attention' : 'vs last period'}</span></Card>)}</div>
        <Card className="mt-5 p-4"><div className="flex flex-col gap-3 xl:flex-row xl:items-center"><div className="relative min-w-[240px] flex-1"><Search className="absolute left-3 top-2.5 text-muted-foreground" size={17} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search tasks..." aria-label="Search tasks" className="w-full rounded-lg border border-border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-border focus:ring-2 focus:ring-ring" /></div><div className="flex flex-wrap gap-2">{['Status', 'Priority', 'Owner', 'Contact', 'Company', 'Opportunity', 'Deal', 'Due Date'].map(filter => <div key={filter} className="relative"><button onClick={() => setFilterOpen(filterOpen === filter ? '' : filter)} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-xs font-medium text-foreground hover:border-border" aria-expanded={filterOpen === filter}><Filter size={13} className="text-muted-foreground" />{filter}<ChevronDown size={13} /></button>{filterOpen === filter && <div className="absolute left-0 top-11 z-10 w-40 rounded-lg border border-border bg-card p-2 text-xs shadow-xl"><button className="w-full rounded px-2 py-2 text-left hover:bg-card">All {filter}s</button><button className="w-full rounded px-2 py-2 text-left hover:bg-card">My {filter}s</button><button className="w-full rounded px-2 py-2 text-left hover:bg-card">Unassigned</button></div>}</div>)}</div><div className="flex shrink-0 gap-3 text-xs font-semibold"><button className="text-foreground hover:text-foreground">Clear Filters</button><button className="text-foreground">Save Filter</button></div></div></Card>
        <div className="mt-6 flex items-center justify-between border-b border-border"><div></div><div className="flex items-center gap-1"><button onClick={() => setActiveView('List')} className={`inline-flex items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold ${activeView === 'List' ? 'border-border text-foreground' : 'border-transparent text-foreground hover:text-foreground'}`}><List size={15} />List</button><button onClick={() => setActiveView('Board')} className={`inline-flex items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold ${activeView === 'Board' ? 'border-border text-foreground' : 'border-transparent text-foreground hover:text-foreground'}`}><KanbanSquare size={15} />Board</button><button onClick={() => setActiveView('Calendar')} className={`inline-flex items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold ${activeView === 'Calendar' ? 'border-border text-foreground' : 'border-transparent text-foreground hover:text-foreground'}`}><CalendarDays size={15} />Calendar</button><button onClick={() => setActiveView('Table')} className={`inline-flex items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold ${activeView === 'Table' ? 'border-border text-foreground' : 'border-transparent text-foreground hover:text-foreground'}`}><Table2 size={15} />Table</button></div></div>
        {activeView === 'List' ? <div>
          <Card className="mt-5 overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 p-5"><div><div className="flex items-center gap-2"><h2 className="font-semibold text-foreground">Due Today</h2><Badge tone="warning">18</Badge></div><p className="mt-1 text-xs text-muted-foreground">Tuesday, October 15, 2024</p></div><span className="text-xs text-muted-foreground">Recorded</span></div><div className="overflow-x-auto"><table className="w-full min-w-[920px] text-left text-xs" aria-label="Tasks due today"><thead className="border-y border-border bg-card/70 text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Time', 'Task', 'Priority', 'Customer', 'Owner', 'Related Deal', 'Actions'].map(head => <th key={head} className="whitespace-nowrap px-5 py-3 font-semibold">{head}</th>)}</tr></thead><tbody>{dueToday.map(row => <tr key={row[1]} className="border-b border-border bg-secondary/30 transition hover:bg-card"><td className="px-5 py-3 font-semibold text-foreground">{row[0]}</td><td className="px-5 py-3 font-medium text-foreground">{row[1]}</td><td className="px-5 py-3"><Badge tone={toneFor(row[2])}>{row[2]}</Badge></td><td className="px-5 py-3 text-muted-foreground">{row[3]}</td><td className="px-5 py-3">{row[4]}</td><td className="px-5 py-3 text-muted-foreground">{row[5]}</td><td className="px-5 py-3"><div className="flex gap-2"><button className="font-semibold text-foreground">Open</button><button className="font-semibold text-chart-4">Complete</button><button className="font-semibold text-foreground">Reschedule</button></div></td></tr>)}</tbody></table></div></Card>
          {!dismissed && <div className="mt-5 flex items-center gap-3 rounded-xl border border-chart-5/30 bg-chart-5/70 px-4 py-3 text-sm text-chart-5"><AlertTriangle size={18} /><span className="flex-1">9 overdue tasks require immediate attention — these may impact deal progression.</span><button onClick={() => setDismissed(true)} aria-label="Dismiss overdue warning"><X size={16} /></button></div>}
          <Card className="mt-5 overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 p-5"><div className="flex items-center gap-2"><h2 className="font-semibold text-foreground">Overdue Tasks</h2><Badge tone="negative">9</Badge></div><span className="text-xs text-muted-foreground">Recorded</span></div><div className="overflow-x-auto"><table className="w-full min-w-[1200px] text-left text-xs" aria-label="Overdue tasks"><thead className="border-y border-border bg-card/70 text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Task', 'Owner', 'Customer', 'Opportunity', 'Deal', 'Due Date', 'Days Overdue', 'Priority', 'Recommended Action', 'Actions'].map(head => <th key={head} className="whitespace-nowrap px-4 py-3 font-semibold">{head}</th>)}</tr></thead><tbody>{overdue.map(row => <tr key={row[0]} className="border-b border-border bg-chart-5/40 hover:bg-card"><td className="px-4 py-3 font-medium">{row[0]}</td><td className="px-4 py-3">{row[1]}</td><td className="px-4 py-3">{row[2]}</td><td className="px-4 py-3 text-muted-foreground">{row[3]}</td><td className="px-4 py-3 text-muted-foreground">{row[4]}</td><td className="px-4 py-3">{row[5]}</td><td className="px-4 py-3 font-semibold text-chart-5">{row[6]}</td><td className="px-4 py-3"><Badge tone={toneFor(row[7])}>{row[7]}</Badge></td><td className="max-w-[190px] px-4 py-3 text-muted-foreground">{row[8]}</td><td className="px-4 py-3"><div className="flex gap-2 whitespace-nowrap"><button className="font-semibold text-chart-4">Complete</button><button className="font-semibold text-foreground">Reschedule</button><button className="font-semibold text-foreground">Ask AI</button></div></td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs"><span className="text-muted-foreground">Showing 4 of 9 overdue tasks</span><button className="font-semibold text-foreground">View All Overdue Tasks →</button></div></Card>
          {selectedRows.length > 0 && <div className="sticky bottom-4 z-10 mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs text-primary-foreground shadow-xl"><strong>{selectedRows.length} selected</strong>{['Assign Owner', 'Change Status', 'Change Priority', 'Reschedule', 'Complete', 'Defer', 'Cancel', 'Export'].map(action => <button key={action} className="rounded-md bg-secondary px-2.5 py-1.5 hover:bg-secondary">{action}</button>)}<button className="ml-auto" onClick={() => setSelectedRows([])}><X size={16} /></button></div>}
          <Card className="mt-5 overflow-hidden"><div className="flex items-center justify-between p-5"><div className="flex items-center gap-2"><h2 className="font-semibold">All Tasks</h2><Badge>124</Badge></div><span className="text-xs text-muted-foreground">Recorded · List view</span></div><div className="overflow-x-auto"><table className="w-full min-w-[1400px] text-left text-xs" aria-label="All sales tasks"><thead className="border-y border-border bg-secondary/70 text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3"><input type="checkbox" aria-label="Select all tasks" onChange={event => setSelectedRows(event.target.checked ? effectiveTasks.map(task => task.id) : [])} /></th>{['Task', 'Status', 'Priority', 'Due Date', 'Owner', 'Contact', 'Company', 'Opportunity', 'Deal', 'Related Activity', 'Last Updated', 'Actions'].map(head => <th key={head} className="whitespace-nowrap px-4 py-3 font-semibold">{head}</th>)}</tr></thead><tbody>{effectiveTasks.filter(task => task.task.toLowerCase().includes(search.toLowerCase())).map(task => <tr key={task.id} className={`border-b border-border transition hover:bg-secondary ${task.status === 'Overdue' ? 'bg-chart-5/40' : task.due.startsWith('Today') ? 'bg-chart-1/30' : 'bg-card'}`}><td className="px-4 py-3"><input type="checkbox" aria-label={`Select ${task.task}`} checked={selectedRows.includes(task.id)} onChange={() => toggleRow(task.id)} /></td><td className="px-4 py-3 font-medium text-foreground">{task.task}</td><td className="px-4 py-3"><Badge tone={toneFor(task.status)}>{task.status}</Badge></td><td className="px-4 py-3 font-medium">{task.priority === 'Critical' ? <span className="text-chart-5">{task.due}</span> : task.due}</td><td className="px-4 py-3"><span className="flex items-center gap-2"><Avatar initials={task.owner.split(' ').map(part => part[0]).join('').slice(0, 2)} />{task.owner}</span></td><td className="px-4 py-3 text-muted-foreground">{task.contact}</td><td className="px-4 py-3 text-muted-foreground">{task.company}</td><td className="px-4 py-3 text-muted-foreground">{task.opportunity}</td><td className="px-4 py-3 text-muted-foreground">{task.deal}</td><td className="px-4 py-3 text-muted-foreground">{task.activity}</td><td className="px-4 py-3 text-muted-foreground">{task.updated}</td><td className="px-4 py-3"><button aria-label={`More actions for ${task.task}`} className="text-foreground hover:text-foreground"><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs"><span className="text-muted-foreground">1–8 of 124 tasks</span><div className="flex gap-2"><button className="rounded-md border border-border px-2 py-1 text-foreground">Previous</button><button className="rounded-md border border-border px-2 py-1 font-semibold text-foreground">Next</button></div></div></Card>
        </div> : <Card className="mt-5 p-10 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-foreground">{activeView === 'Board' ? <KanbanSquare /> : activeView === 'Calendar' ? <Calendar /> : <Table2 />}</div><h2 className="mt-4 font-semibold">{activeView} view</h2><p className="mt-1 text-sm text-muted-foreground">Your tasks are ready to explore in this view.</p></Card>}
        <div className="mt-5 grid gap-5 xl:grid-cols-3">{upcomingGroups.map(group => <Card key={group.label} className="p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">{group.label}</h2><Badge>{`${group.items.length} tasks`}</Badge></div><ul className="mt-4 space-y-3">{group.items.map(item => <li key={item[0]} className="border-b border-border pb-3 last:border-0"><div className="flex items-start justify-between gap-3"><p className="text-xs font-medium">{item[0]}</p><Badge tone={toneFor(item[2])}>{item[2]}</Badge></div><div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground"><Clock size={12} />{item[1]} · <Avatar initials={item[3]} />{item[4]} · {item[5]}</div></li>)}</ul></Card>)}</div>
        <Card className="mt-5 p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Task Performance</h2><p className="mt-1 text-xs text-muted-foreground">A clear view of execution health</p></div><Badge>Calculated</Badge></div><div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">{performance.map(item => <div key={item[0]} className="border-b border-border pb-3"><p className="text-xs text-muted-foreground">{item[0]}</p><p className="mt-1 text-xl font-bold">{item[1]}</p><p className="mt-1 text-[10px] text-muted-foreground">Calculated</p></div>)}</div></Card>
        <Card className="mt-5 overflow-hidden"><div className="flex items-center justify-between p-5"><div><h2 className="font-semibold">Tasks by Owner</h2><p className="mt-1 text-xs text-muted-foreground">Recorded team workload and completion</p></div><Users size={18} className="text-foreground" /></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-xs" aria-label="Tasks by owner"><thead className="border-y border-border bg-card/70 text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Owner', 'Open', 'In Progress', 'Completed', 'Overdue', 'Completion Rate', 'Progress'].map(head => <th key={head} className="px-5 py-3 font-semibold">{head}</th>)}</tr></thead><tbody>{owners.map(owner => <tr key={owner.name} className="border-b border-border hover:bg-card"><td className="px-5 py-3"><span className="flex items-center gap-2 font-semibold"><Avatar initials={owner.initials} color={owner.color} />{owner.name}</span></td><td className="px-5 py-3">{owner.open}</td><td className="px-5 py-3">{owner.progress}</td><td className="px-5 py-3 text-chart-4">{owner.completed}</td><td className="px-5 py-3 text-chart-5">{owner.overdue}</td><td className="px-5 py-3 font-semibold">{owner.rate}%</td><td className="px-5 py-3"><div className="h-2 w-32 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary text-primary-foreground" style={{
                        width: `${owner.rate}%`
                      }} /></div></td></tr>)}</tbody></table></div></Card>
        <Card className="mt-5 border-border bg-secondary/30 p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Sparkles size={18} className="text-foreground" /><h2 className="font-semibold text-foreground">AI Task Prioritization</h2><Badge tone="ai">AI-generated</Badge></div><span className="hidden text-xs text-muted-foreground sm:block">All actions require your confirmation.</span></div><p className="mt-2 text-sm text-muted-foreground">AI identifies critical tasks based on deal value, contact engagement, and close date proximity. All actions require your confirmation.</p><div className="mt-5 grid gap-3 lg:grid-cols-3">{aiPriority.map(item => <article key={item[0]} className={`rounded-lg border-l-4 bg-card p-4 shadow-sm ${item[3] === 'red' ? 'border-chart-5' : 'border-border'}`}><div className="flex items-center justify-between gap-2"><strong className="text-sm">{item[0]}</strong><Badge tone="ai">AI-generated</Badge></div><p className="mt-3 text-sm font-medium leading-relaxed">{item[1]}</p><p className="mt-2 text-xs text-muted-foreground">Signal: {item[2]}</p><div className="mt-4 flex gap-2"><button className="rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground">{item[4]}</button><button className="rounded-md border border-border px-2.5 py-1.5 text-[11px] font-semibold text-foreground">{item[5]}</button></div></article>)}</div></Card>
        <Card className="mt-5 border-border bg-secondary/30 p-5"><div className="flex items-center gap-2"><Sparkles size={18} className="text-foreground" /><h2 className="font-semibold text-foreground">AI Recommended Tasks</h2><Badge tone="ai">AI-generated</Badge></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{recommendations.map(item => <div key={item[0]} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"><Sparkles size={15} className="shrink-0 text-foreground" /><div className="min-w-0 flex-1"><p className="text-xs font-semibold">{item[0]}</p><p className="mt-1 text-[10px] text-muted-foreground">AI-generated · {item[1]}</p></div><button className="shrink-0 rounded-md border border-border px-2 py-1 text-[10px] font-semibold text-foreground">{item[1] === 'Critical' ? 'Complete Task' : 'Create Task'}</button></div>)}</div><p className="mt-4 text-[11px] text-muted-foreground">AI recommendations require your confirmation before creating or changing tasks.</p></Card>
        <Card className="mt-5 border-border bg-card p-5"><div className="flex items-center gap-2"><Bot size={19} className="text-foreground" /><h2 className="font-semibold">Ask Lulu AI</h2><Badge tone="ai">AI assistant</Badge></div><div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm"><input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Ask Lulu AI about your sales tasks..." aria-label="Ask Lulu AI about your sales tasks" /><button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Ask</button></div><div className="mt-4 flex flex-wrap gap-2">{prompts.map(prompt => <button key={prompt} className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-[11px] text-foreground hover:bg-secondary">{prompt}</button>)}</div></Card>
        <div className="mt-5 grid gap-5 lg:grid-cols-2"><Card className="p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Potential Duplicate Tasks</h2><Badge tone="warning">2 pairs</Badge></div><div className="mt-4 space-y-3">{[['Follow up on enterprise proposal', 'Follow up on Enterprise Platform proposal'], ['Confirm Q3 meeting', 'Confirm RetailMax stakeholder meeting']].map(pair => <div key={pair[0]} className="rounded-lg border border-border p-3"><p className="text-xs font-semibold">{pair[0]}</p><p className="mt-1 text-xs text-muted-foreground">Possible duplicate: {pair[1]}</p><div className="mt-3 flex gap-3 text-[11px] font-semibold"><button className="text-foreground">Review</button><button className="text-foreground">Merge</button><button className="text-foreground">Ignore</button></div></div>)}</div></Card><Card className="p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Task Data Quality Score</h2><Badge>Recorded</Badge></div><div className="mt-4 flex items-center gap-6"><div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[9px] border-border border-t-border border-r-border"><span className="text-2xl font-bold">84%</span></div><ul className="space-y-2 text-xs text-muted-foreground"><li>5 missing owners</li><li>3 missing due dates</li><li>2 missing priorities</li><li>1 duplicate</li></ul></div></Card></div>
        <details className="mt-5 mb-8 rounded-xl border border-border bg-card p-5"><summary className="cursor-pointer font-semibold">Empty and error states</summary><div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3"><div className="rounded-lg bg-card p-4"><strong className="text-foreground">No sales tasks yet</strong><p className="mt-1">Create your first sales task to get started.</p></div><div className="rounded-lg bg-card p-4"><strong className="text-foreground">You’re all caught up</strong><p className="mt-1">There are no overdue sales tasks based on current data.</p></div><div className="rounded-lg bg-card p-4"><strong className="text-foreground">Loading Error</strong><p className="mt-1">We couldn’t load task data. Try again.</p></div><div className="rounded-lg bg-card p-4">Save Error · Calendar Error · AI Error · Permission Error</div></div></details>
      </div>
    </main>
    {showCreate && <dialog open className="fixed right-5 top-20 z-40 m-0 w-[min(520px,calc(100vw-40px))] rounded-xl border border-border bg-card p-0 shadow-2xl"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 className="font-semibold">Create Task</h2><p className="mt-1 text-xs text-muted-foreground">Add a focused next action</p></div><button onClick={() => setShowCreate(false)} aria-label="Close create task"><X size={18} /></button></div><form className="max-h-[70vh] overflow-y-auto p-5" onSubmit={event => {
        event.preventDefault();
        setShowCreate(false);
      }}><label className="block text-xs font-semibold text-muted-foreground">Task Name<input required className="mt-2 w-full rounded-lg border border-border p-2.5 text-sm outline-none focus:border-border" placeholder="e.g. Follow up with customer" /></label><label className="mt-4 block text-xs font-semibold text-muted-foreground">Description<textarea className="mt-2 w-full rounded-lg border border-border p-2.5 text-sm outline-none focus:border-border" rows={3} placeholder="Add context for this task" /></label><div className="mt-4 grid grid-cols-2 gap-3"><label className="text-xs font-semibold text-muted-foreground">Status<select className="mt-2 w-full rounded-lg border border-border p-2.5 font-normal"><option>Open</option><option>In Progress</option><option>Deferred</option></select></label><label className="text-xs font-semibold text-foreground">Priority<select className="mt-2 w-full rounded-lg border border-border p-2.5 font-normal"><option>Medium</option><option>High</option><option>Critical</option><option>Low</option></select></label><label className="text-xs font-semibold text-foreground">Owner<select className="mt-2 w-full rounded-lg border border-border p-2.5 font-normal"><option>Unassigned</option><option>Sales team member</option><option>Workspace owner</option></select></label><label className="text-xs font-semibold text-foreground">Due Date<input type="date" className="mt-2 w-full rounded-lg border border-border p-2.5 font-normal" /></label></div><div className="mt-5 border-t border-border pt-4"><p className="text-xs font-semibold text-foreground">Related Records</p><div className="mt-3 grid grid-cols-2 gap-2">{['Contact', 'Company', 'Lead', 'Opportunity', 'Deal', 'Activity'].map(record => <button type="button" key={record} className="rounded-lg border border-border px-3 py-2 text-left text-xs text-foreground hover:border-border">{record}<span className="float-right text-muted-foreground">Select</span></button>)}</div></div><div className="mt-5 flex items-center gap-2"><input id="reminder" type="checkbox" /><label htmlFor="reminder" className="text-xs text-muted-foreground">Set a reminder</label></div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setShowCreate(false)} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground">Cancel</button><button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Create Task</button><button type="submit" className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground">Create & Add Another</button></div></form></dialog>}
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
          <span>{section.label}</span>
          <span aria-hidden="true" className="text-xs transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <div className="ml-3 mt-1 space-y-0.5 border-l border-border pl-2 pb-1">
          {section.pages.map(page => {
            const isActivePage = page.id === activeId;
            return <a key={page.id} {...pageLinkProps(page.id)} aria-current={isActivePage ? 'page' : undefined} className={`block rounded-md px-3 py-2 text-xs transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {page.label}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}
import { pageLinkProps } from '../../../../routing';
