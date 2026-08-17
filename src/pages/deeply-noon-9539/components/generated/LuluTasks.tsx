import { useMemo, useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertTriangle, ArrowDown, ArrowUp, Bot, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Circle, Clock3, Filter, Gem, GripVertical, LayoutDashboard, ListFilter, Menu, MoreHorizontal, Plus, RefreshCcw, Search, Settings, Sparkles, Target, Users, X, Zap, UserRound, BriefcaseBusiness, SlidersHorizontal, CheckSquare2, Ban, CalendarClock, Trash2, Pencil, UserPlus, Download, ArrowRight, CircleDot, Link2, WandSparkles, PanelRight, MoveRight } from 'lucide-react';
type Task = {
  id: string;
  title: string;
  related: string;
  due: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  assignee: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Blocked' | 'Overdue';
  source: string;
  checked?: boolean;
};
const tasks: Task[] = [{
  id: 'anna',
  title: 'Follow up with Anna Weber',
  related: 'Enterprise Expansion · TechCorp GmbH',
  due: 'Today 14:30',
  priority: 'High',
  assignee: 'Workspace assignee',
  status: 'Not Started',
  source: 'Manual'
}, {
  id: 'bluewave',
  title: 'Send updated proposal to Bluewave',
  related: 'Marketing Platform',
  due: 'Today 16:00',
  priority: 'Medium',
  assignee: 'Workspace assignee',
  status: 'In Progress',
  source: 'Manual'
}, {
  id: 'datastream',
  title: 'Review pricing with DataStream AG',
  related: 'Cloud Migration Suite',
  due: 'Tomorrow',
  priority: 'High',
  assignee: 'Workspace assignee',
  status: 'Not Started',
  source: 'AI-generated'
}, {
  id: 'q4',
  title: 'Schedule Q4 review meeting',
  related: 'TechCorp GmbH',
  due: 'This Week',
  priority: 'Medium',
  assignee: 'Workspace assignee',
  status: 'Not Started',
  source: 'Automation'
}, {
  id: 'contract',
  title: 'Send contract to MicroSoft AG',
  related: 'Sales Automation',
  due: '2 days ago',
  priority: 'High',
  assignee: 'Workspace assignee',
  status: 'Overdue',
  source: 'Manual'
}, {
  id: 'zentrix',
  title: 'Call Zentrix Ltd',
  related: 'Automation Hub',
  due: '3 days ago',
  priority: 'Critical',
  assignee: 'Workspace assignee',
  status: 'Blocked',
  source: 'Manual'
}, {
  id: 'globaltech',
  title: 'Add decision maker to GlobalTech deal',
  related: 'Sales Automation',
  due: 'Next Week',
  priority: 'Low',
  assignee: 'Workspace assignee',
  status: 'Not Started',
  source: 'AI-generated'
}, {
  id: 'nexgen',
  title: 'Discovery call with NexGen Systems',
  related: 'CRM Integration',
  due: 'Completed',
  priority: 'Medium',
  assignee: 'Workspace assignee',
  status: 'Completed',
  source: 'Manual',
  checked: true
}, {
  id: 'probability',
  title: 'Update deal probability',
  related: 'Analytics Dashboard',
  due: 'Tomorrow',
  priority: 'Medium',
  assignee: 'Workspace assignee',
  status: 'Not Started',
  source: 'AI-generated'
}, {
  id: 'pinnacle',
  title: 'Send intro email',
  related: 'Pinnacle GmbH',
  due: 'Completed',
  priority: 'Low',
  assignee: 'Workspace assignee',
  status: 'Completed',
  source: 'Automation',
  checked: true
}, {
  id: 'vertex',
  title: 'Follow-up after demo',
  related: 'Vertex Corp',
  due: 'This Week',
  priority: 'High',
  assignee: 'Workspace assignee',
  status: 'In Progress',
  source: 'Manual'
}, {
  id: 'open-deals',
  title: 'Review open deals for Q4',
  related: '—',
  due: 'Next Week',
  priority: 'Medium',
  assignee: 'Workspace assignee',
  status: 'Not Started',
  source: 'Internal'
}];
const workload = [{
  name: 'Workspace assignee',
  open: 24,
  overdue: 3,
  high: 8,
  rate: 78
}, {
  name: 'Workspace assignee',
  open: 19,
  overdue: 5,
  high: 7,
  rate: 62
}, {
  name: 'Workspace assignee',
  open: 14,
  overdue: 2,
  high: 5,
  rate: 84
}, {
  name: 'Workspace assignee',
  open: 7,
  overdue: 1,
  high: 3,
  rate: 91
}];
const nav = [{
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  label: 'AI Insights',
  icon: Sparkles
}, {
  label: 'CRM',
  icon: BriefcaseBusiness
}, {
  label: 'AI Assistant',
  icon: Bot
}, {
  label: 'AI Agents',
  icon: WandSparkles
}, {
  label: 'Settings',
  icon: Settings
}];
const crmLinks = ['Overview', 'Contacts', 'Companies', 'Leads', 'Deals', 'Pipeline', 'Activities', 'Tasks'];
const aiPriority = [{
  level: 'Critical',
  title: 'Follow up with Enterprise Expansion',
  reason: 'High-value deal approaching close date with no recent activity',
  assignee: 'Workspace assignee'
}, {
  level: 'High',
  title: 'Send contract to MicroSoft AG',
  reason: 'Overdue 2 days; deal probability declining',
  assignee: 'Workspace assignee'
}, {
  level: 'High',
  title: 'Schedule Q4 review with DataStream AG',
  reason: 'No activity in 12 days on 128K EUR deal',
  assignee: 'Workspace assignee'
}];
function Priority({
  value
}: {
  value: Task['priority'];
}) {
  const Icon = value === 'Critical' ? Gem : value === 'High' ? ArrowUp : value === 'Medium' ? ArrowRight : ArrowDown;
  const color = value === 'Critical' || value === 'High' ? 'text-chart-5' : value === 'Medium' ? 'text-foreground' : 'text-foreground';
  return <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${color}`}><Icon size={14} strokeWidth={2.5} /><span>{value}</span></span>;
}
function Avatar({
  name
}: {
  name: string;
}) {
  return <span aria-label={name} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-gradient-to-br from-primary to-primary text-[10px] font-bold text-primary-foreground">{name.split(' ').map(part => part[0]).join('')}</span>;
}
function Status({
  value
}: {
  value: Task['status'];
}) {
  const styles: Record<string, string> = {
    'Not Started': 'bg-secondary text-foreground',
    'In Progress': 'bg-secondary/15 text-foreground',
    Completed: 'bg-chart-4/15 text-chart-4',
    Blocked: 'bg-chart-5/15 text-chart-5',
    Overdue: 'bg-chart-5/15 text-chart-5'
  };
  return <span className={`rounded-md px-2 py-1 text-[11px] font-medium ${styles[value]}`}>{value}</span>;
}
function Source({
  value
}: {
  value: string;
}) {
  const Icon = value === 'AI-generated' ? Sparkles : value === 'Automation' ? Zap : value === 'Integration' ? Link2 : CircleDot;
  return <span className={`inline-flex items-center gap-1 text-[11px] ${value === 'AI-generated' ? 'text-foreground' : 'text-muted-foreground'}`}><Icon size={13} />{value}</span>;
}
export function LuluTasks() {
  const [view, setView] = useState('List');
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [modal, setModal] = useState<'create' | 'complete' | 'reassign' | 'reschedule' | null>(null);
  const [toast, setToast] = useState('');
  const [expanded, setExpanded] = useState<string | null>('Overdue');
  const filteredTasks = useMemo(() => tasks.filter(task => task.title.toLowerCase().includes(query.toLowerCase())), [query]);
  const toggleTask = (id: string) => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const action = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };
  const { items: liveTasks, loading: liveLoading, error: liveError } = useLiveRecords('crm_tasks');
  const liveEmpty = !liveLoading && !liveError && liveTasks.length === 0;
  return <main className="min-h-screen bg-[var(--background)] text-foreground font-sans">{liveLoading ? <div className="border-b border-border bg-secondary/30 px-5 py-3 text-xs text-muted-foreground lg:pl-[244px]">Loading live CRM tasks…</div> : liveError ? <div className="border-b border-destructive/30 bg-destructive/5 px-5 py-3 text-xs text-destructive lg:pl-[244px]">{liveError}</div> : liveEmpty ? <div className="border-b border-dashed border-border bg-card px-5 py-3 text-xs text-muted-foreground lg:pl-[244px]">No live CRM tasks are available yet. Add a task or connect your CRM to begin.</div> : null}
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[224px] border-r border-border/[.07] bg-[var(--sidebar)] px-4 py-5 lg:flex lg:flex-col">
      <div className="mb-9 flex items-center gap-3 px-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-primary shadow-lg shadow-black/30 text-primary-foreground"><Gem size={18} fill="currentColor" /></span><strong className="text-[17px] tracking-tight">Lulu <span className="text-foreground">AI</span></strong></div>
      <LuluSectionNavigation activeId="deeply-noon-9539" />
      <div className="mt-auto border-t border-border/[.07] pt-4"><div className="flex items-center gap-3 rounded-lg px-2 py-2"><Avatar name="Workspace administrator" /><div><p className="text-xs font-medium">Workspace administrator</p><p className="text-[11px] text-muted-foreground">Workspace admin</p></div><MoreHorizontal size={16} className="ml-auto text-muted-foreground" /></div></div>
    </aside>
    <section className="lg:ml-[224px]">
      <header className="flex items-center justify-between border-b border-border/[.07] px-5 py-4 sm:px-8"><button className="rounded-lg p-2 text-foreground lg:hidden"><Menu size={20} /></button><div className="text-xs text-muted-foreground"><span>CRM</span><span className="mx-2 text-foreground">/</span><span className="text-foreground">Tasks</span></div><div className="flex gap-2"><button onClick={() => action('Filters opened')} className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary sm:flex"><Filter size={14} /> Filter</button><button onClick={() => setModal('create')} className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-lg shadow-black/40 hover:bg-primary"><Plus size={15} /> Create Task</button></div></header>
      <div className="mx-auto max-w-[1260px] px-5 py-7 sm:px-8">
        <div className="mb-7"><p className="mb-2 text-xs font-medium uppercase tracking-[.18em] text-foreground">CRM workspace</p><h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-[34px]">Tasks</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Organize your CRM work, prioritize important actions and keep your team moving forward.</p></div>
        <section aria-label="Task summary" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{[{
            l: 'Total Tasks',
            v: '428',
            i: CheckSquare2,
            c: 'text-foreground',
            t: '+12 this week'
          }, {
            l: 'My Tasks',
            v: '64',
            i: UserRound,
            c: 'text-foreground',
            t: '+8% vs last week'
          }, {
            l: 'Due Today',
            v: '18',
            i: Clock3,
            c: 'text-chart-1',
            t: '5 high priority'
          }, {
            l: 'Overdue',
            v: '11',
            i: AlertTriangle,
            c: 'text-chart-5',
            t: '3 critical'
          }, {
            l: 'Completed',
            v: '247',
            i: CheckCircle2,
            c: 'text-chart-4',
            t: '58% completion'
          }, {
            l: 'High Priority',
            v: '23',
            i: Target,
            c: 'text-foreground',
            t: '6 due this week'
          }].map(({
            l,
            v,
            i: Icon,
            c,
            t
          }) => <article key={l} className="rounded-xl border border-border/[.08] bg-[var(--card)] p-4"><div className="mb-4 flex items-center justify-between"><span className="text-xs text-muted-foreground">{l}</span><Icon size={17} className={c} /></div><strong className="block text-2xl tracking-tight text-foreground">{v}</strong><span className="mt-1 block text-[11px] text-muted-foreground">{t}</span></article>)}</section>
        <section className="mt-8 rounded-xl border border-border/[.08] bg-[var(--card)] p-4 sm:p-5"><div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"><div className="flex rounded-lg bg-[var(--secondary)] p-1">{['List', 'Board', 'Calendar'].map(item => <button key={item} onClick={() => setView(item)} className={`rounded-md px-4 py-2 text-xs font-semibold ${view === item ? 'bg-primary text-primary-foreground' : 'text-primary-foreground hover:text-primary-foreground'}`}>{item}</button>)}</div><div className="flex flex-1 flex-wrap items-center gap-2 xl:justify-end"><label className="flex min-w-[230px] flex-1 items-center gap-2 rounded-lg border border-border bg-[var(--card)] px-3 py-2 text-xs text-muted-foreground xl:max-w-[280px]"><Search size={15} /><input aria-label="Search tasks" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search tasks..." className="w-full bg-transparent outline-none placeholder:text-muted-foreground" /></label><button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-foreground"><SlidersHorizontal size={14} /> Filters <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">3</span></button><button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-foreground">My Tasks <ChevronDown size={14} /></button></div></div><div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/[.06] pt-4"><span className="text-[11px] text-muted-foreground">Active:</span>{['Priority: High', 'Due: This Week', 'Assignee: Workspace assignee'].map(chip => <button key={chip} className="inline-flex items-center gap-2 rounded-full border border-border/20 bg-secondary/10 px-2.5 py-1 text-[11px] text-foreground">{chip}<X size={12} /></button>)}<button className="text-[11px] font-medium text-foreground hover:text-foreground">Clear All</button></div></section>
        <section className="mt-8"><div className="mb-4 flex items-end justify-between"><div><h2 className="text-xl font-semibold text-foreground">My Tasks</h2><p className="mt-1 text-xs text-muted-foreground">Your highest-impact work, grouped by urgency</p></div><button className="text-xs text-foreground hover:text-foreground">View all my tasks <ArrowRight className="ml-1 inline" size={13} /></button></div><div className="grid gap-3 lg:grid-cols-2">{[{
              group: 'Overdue',
              count: 3,
              tasks: 'Follow up with Example GmbH · Send contract to MicroSoft AG · Call Zentrix Ltd'
            }, {
              group: 'Today',
              count: 5,
              tasks: 'Follow up with Anna Weber · Review Q4 proposal · + 3 more'
            }, {
              group: 'Tomorrow',
              count: 4,
              tasks: '4 tasks scheduled'
            }, {
              group: 'This Week',
              count: 12,
              tasks: '12 tasks scheduled'
            }, {
              group: 'Later',
              count: 45,
              tasks: '45 tasks scheduled'
            }].map(item => <button key={item.group} onClick={() => setExpanded(expanded === item.group ? null : item.group)} className={`flex items-center gap-4 rounded-xl border px-4 py-3 text-left transition ${item.group === 'Overdue' ? 'border-chart-5/20 bg-chart-5/[.05]' : 'border-border/[.07] bg-[var(--primary)] hover:border-border/30'} text-primary-foreground`}><span className={`grid h-8 w-8 place-items-center rounded-lg ${item.group === 'Overdue' ? 'bg-chart-5/15 text-chart-5' : 'bg-secondary text-muted-foreground'}`}><CalendarClock size={16} /></span><span className="min-w-0 flex-1"><strong className="block text-sm text-foreground">{item.group} <span className="ml-1 text-xs font-normal text-muted-foreground">({item.count})</span></strong><span className="mt-1 block truncate text-xs text-muted-foreground">{expanded === item.group ? item.tasks : `${item.count} tasks · click to expand`}</span></span><ChevronDown size={16} className={`text-muted-foreground transition ${expanded === item.group ? 'rotate-180' : ''}`} /></button>)}</div></section>
        {selected.length > 0 && <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-border/30 bg-secondary/10 p-3 text-xs"><strong>{selected.length} selected</strong><button className="rounded-md bg-secondary px-3 py-1.5">Assign</button><button className="rounded-md bg-secondary px-3 py-1.5">Change Status</button><button className="rounded-md bg-secondary px-3 py-1.5">Change Priority</button><button className="rounded-md bg-secondary px-3 py-1.5">Reschedule</button><button onClick={() => setModal('complete')} className="rounded-md bg-chart-4/20 px-3 py-1.5 text-chart-4">Mark Complete</button><button className="rounded-md bg-secondary px-3 py-1.5">Export</button><button className="rounded-md bg-chart-5/20 px-3 py-1.5 text-chart-5">Delete</button></div>}
        {view === 'List' && <section className="mt-5 overflow-hidden rounded-xl border border-border/[.08] bg-[var(--card)]"><div className="flex items-center justify-between border-b border-border/[.07] px-4 py-4"><div><h2 className="text-base font-semibold text-foreground">All Tasks</h2><p className="mt-1 text-xs text-muted-foreground">Operational queue · sorted by due date</p></div><button className="rounded-lg p-2 text-foreground hover:bg-secondary"><ListFilter size={17} /></button></div><div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[930px] text-left"><thead className="border-b border-border/[.06] bg-secondary text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="w-12 px-4 py-3"></th><th className="px-3 py-3">Title + Related Record</th><th className="px-3 py-3">Due Date</th><th className="px-3 py-3">Priority</th><th className="px-3 py-3">Assignee</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Source</th><th className="px-3 py-3"></th></tr></thead><tbody className="divide-y divide-white/[.05]">{filteredTasks.map(task => <tr key={task.id} className="group transition hover:bg-secondary/[.04]"><td className="px-4 py-3"><button aria-label={`Select ${task.title}`} onClick={() => toggleTask(task.id)} className={`grid h-4 w-4 place-items-center rounded border ${selected.includes(task.id) || task.checked ? 'border-border bg-primary text-primary-foreground' : 'border-border'} text-primary-foreground`}>{(selected.includes(task.id) || task.checked) && <Check size={11} />}</button></td><td className="px-3 py-3"><button onClick={() => setDrawer(true)} className="text-left"><strong className={`block text-xs font-medium ${task.status === 'Completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{task.title}</strong><span className="mt-1 block text-[11px] text-muted-foreground">{task.related}</span></button></td><td className={`px-3 py-3 text-xs ${task.status === 'Overdue' || task.status === 'Blocked' ? 'text-chart-5' : 'text-muted-foreground'}`}>{task.due}</td><td className="px-3 py-3"><Priority value={task.priority} /></td><td className="px-3 py-3"><span className="flex items-center gap-2 text-xs text-foreground"><Avatar name={task.assignee} />{task.assignee}</span></td><td className="px-3 py-3"><Status value={task.status} /></td><td className="px-3 py-3"><Source value={task.source} /></td><td className="px-3 py-3"><button aria-label="Task actions" onClick={() => action('Task actions opened')} className="rounded p-1 text-foreground opacity-0 transition hover:bg-secondary hover:text-foreground group-hover:opacity-100"><MoreHorizontal size={16} /></button></td></tr>)}</tbody></table></div><div className="space-y-3 p-3 md:hidden">{filteredTasks.map(task => <button key={task.id} onClick={() => setDrawer(true)} className="w-full rounded-lg border border-border/[.07] bg-[var(--primary)] p-3 text-left text-primary-foreground"><div className="flex items-start gap-3"><span className="mt-1 h-4 w-4 rounded border border-border" /><span className="flex-1"><strong className="block text-sm">{task.title}</strong><span className="mt-1 block text-xs text-muted-foreground">{task.related}</span><span className="mt-3 flex flex-wrap items-center gap-3"><Priority value={task.priority} /><Status value={task.status} /><span className="text-xs text-muted-foreground">{task.due}</span></span></span></div></button>)}</div><div className="flex flex-col gap-3 border-t border-border/[.07] px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>1–50 of 428 tasks</span><span>Items per page: <strong className="text-foreground">50</strong> <ChevronDown className="inline" size={13} /></span><span className="flex gap-1"><button className="rounded border border-border p-1"><ChevronLeft size={14} /></button><button className="rounded bg-primary px-2 py-1 text-primary-foreground">1</button><button className="rounded border border-border px-2 py-1">2</button><button className="rounded border border-border p-1"><ChevronRight size={14} /></button></span></div></section>}
        {view === 'Board' && <Board onOpen={() => setDrawer(true)} />}
        {view === 'Calendar' && <CalendarView />}
        <section className="mt-10"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-xl font-semibold text-foreground">Overdue Tasks <span className="ml-2 rounded-full bg-chart-5/15 px-2 py-1 text-xs text-chart-5">11</span></h2><p className="mt-1 text-xs text-muted-foreground">Needs attention before it impacts your pipeline</p></div><button className="text-xs text-foreground">View all 11 overdue tasks <ArrowRight className="ml-1 inline" size={13} /></button></div><div className="grid gap-3 lg:grid-cols-3">{[{
              title: 'Call Zentrix Ltd',
              detail: 'Blocked · Overdue 3 days',
              person: 'Workspace assignee',
              related: 'Automation Hub',
              level: 'Critical'
            }, {
              title: 'Send contract to MicroSoft AG',
              detail: 'Overdue 2 days',
              person: 'Workspace assignee',
              related: 'Sales Automation',
              level: 'High'
            }, {
              title: 'Follow up with Example GmbH',
              detail: 'Overdue 1 day',
              person: 'Workspace assignee',
              related: 'Enterprise Expansion',
              level: 'High'
            }].map(item => <article key={item.title} className="rounded-xl border border-border bg-[var(--card)] p-4"><div className="flex items-center justify-between"><Priority value={item.level as Task['priority']} /><button onClick={() => setDrawer(true)} className="rounded-md border border-border px-2.5 py-1 text-[11px] text-foreground">Review</button></div><h3 className="mt-4 text-sm font-semibold">{item.title}</h3><p className="mt-1 text-xs text-chart-5">{item.detail}</p><div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground"><span className="flex items-center gap-2"><Avatar name={item.person} />{item.person}</span><span>{item.related}</span></div></article>)}</div></section>
        <section className="mt-10 grid gap-8 xl:grid-cols-[1.05fr_.95fr]"><div><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-semibold">Team Workload</h2><button className="flex items-center gap-1 text-xs text-foreground">Sort by: Open Tasks <ChevronDown size={13} /></button></div><div className="overflow-hidden rounded-xl border border-border/[.08] bg-[var(--secondary)]"><table className="w-full text-left"><thead className="border-b border-border/[.06] text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">Owner</th><th className="px-2 py-3">Open</th><th className="px-2 py-3">Overdue</th><th className="px-2 py-3">High</th><th className="px-4 py-3">Completion</th></tr></thead><tbody className="divide-y divide-white/[.05]">{workload.map(person => <tr key={person.name}><td className="px-4 py-3"><span className="flex items-center gap-2 text-xs"><Avatar name={person.name} />{person.name}</span></td><td className="text-xs text-foreground">{person.open}</td><td className="text-xs text-chart-5">{person.overdue}</td><td className="text-xs text-chart-1">{person.high}</td><td className="px-4 py-3"><span className="flex items-center gap-2 text-xs"><span className="h-1.5 w-16 rounded-full bg-secondary"><span className="block h-full rounded-full bg-primary text-primary-foreground" style={{
                            width: `${person.rate}%`
                          }} /></span>{person.rate}%</span></td></tr>)}</tbody></table></div></div><div><div className="mb-4 flex items-center gap-2"><h2 className="text-xl font-semibold">Blocked Tasks</h2><span className="rounded-full bg-chart-5/15 px-2 py-1 text-xs text-chart-5">4</span></div><div className="space-y-3">{[{
                title: 'Call Zentrix Ltd',
                why: 'Waiting for contact confirmation',
                who: 'Workspace assignee',
                days: '3 days',
                p: 'Critical'
              }, {
                title: 'Contract review',
                why: 'Waiting for legal team',
                who: 'Workspace assignee',
                days: '5 days',
                p: 'High'
              }].map(item => <article key={item.title} className="flex items-center gap-3 rounded-xl border border-border/[.08] bg-[var(--card)] p-4"><span className="grid h-8 w-8 place-items-center rounded-lg bg-chart-5/10 text-chart-5"><Ban size={15} /></span><div className="min-w-0 flex-1"><h3 className="text-sm font-medium">{item.title}</h3><p className="mt-1 text-xs text-muted-foreground">{item.why} · {item.days}</p><p className="mt-2 text-[11px] text-muted-foreground">{item.who} · <Priority value={item.p as Task['priority']} /></p></div><button onClick={() => setDrawer(true)} className="rounded-md border border-border px-2.5 py-1 text-[11px]">Review</button></article>)}</div><button className="mt-3 text-xs text-foreground">View all 4 blocked tasks <ArrowRight className="ml-1 inline" size={13} /></button></div></section>
        <AiSections onAction={action} />
        <section className="mt-10 border-t border-border/[.07] pt-7"><button className="flex w-full items-center justify-between text-left"><span><h2 className="text-xl font-semibold">Automated Tasks</h2><span className="mt-1 block text-xs text-muted-foreground">Rules creating work automatically from your CRM signals</span></span><ChevronDown size={18} className="text-muted-foreground" /></button><div className="mt-4 grid gap-3 md:grid-cols-3">{[{
              icon: Zap,
              text: 'When a deal enters negotiation',
              date: 'Created Aug 12',
              person: 'Workspace assignee'
            }, {
              icon: Activity,
              text: 'After a meeting is completed',
              date: 'Created Aug 08',
              person: 'Workspace assignee'
            }, {
              icon: RefreshCcw,
              text: 'When lead score changes',
              date: 'Created Jul 29',
              person: 'Workspace assignee'
            }].map(({
              icon: Icon,
              text,
              date,
              person
            }) => <article key={text} className="rounded-xl border border-border/[.07] bg-[var(--card)] p-4"><Icon size={16} className="text-foreground" /><p className="mt-3 text-sm text-foreground">{text}</p><p className="mt-3 text-[11px] text-muted-foreground">{date} · {person}</p><Status value="In Progress" /></article>)}</div></section>
      </div>
    </section>
    {drawer && <aside className="fixed inset-y-0 right-0 z-30 w-full max-w-[400px] border-l border-border bg-[var(--sidebar)] p-6 shadow-2xl shadow-black/50"><div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-foreground">Task preview</span><button onClick={() => setDrawer(false)} className="rounded-lg p-2 text-foreground hover:bg-secondary"><X size={18} /></button></div><h2 className="mt-8 text-2xl font-bold">Follow up with Anna Weber</h2><p className="mt-2 text-sm text-muted-foreground">Enterprise Expansion / TechCorp GmbH / Anna Weber</p><div className="mt-6 flex gap-2"><Status value="Not Started" /><Priority value="High" /></div><dl className="mt-8 space-y-5 border-y border-border/[.08] py-6 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Assignee</dt><dd className="flex items-center gap-2"><Avatar name="Workspace assignee" /> Workspace assignee</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Due</dt><dd>Today 14:30</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Source</dt><dd>Manual</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Created by</dt><dd>Workspace assignee · 2 days ago</dd></div></dl><div className="mt-6 grid grid-cols-2 gap-2"><button className="rounded-lg bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground">Open</button><button onClick={() => setModal('complete')} className="rounded-lg border border-border px-3 py-2.5 text-xs">Mark Complete</button><button onClick={() => setModal('reassign')} className="rounded-lg border border-border px-3 py-2.5 text-xs">Reassign</button><button onClick={() => setModal('reschedule')} className="rounded-lg border border-border px-3 py-2.5 text-xs">Reschedule</button><button className="col-span-2 rounded-lg border border-chart-5/20 py-2.5 text-xs text-chart-5">Delete</button></div></aside>}
    {modal && <dialog open className="fixed inset-0 z-40 m-0 flex min-h-full w-full items-center justify-center bg-[var(--background)]/80 p-4"><div className="w-full max-w-[500px] rounded-2xl border border-border bg-[var(--secondary)] p-6 shadow-2xl shadow-black/60"><div className="flex items-start justify-between"><div><h2 className="text-xl font-semibold">{modal === 'create' ? 'Create Task' : modal === 'complete' ? 'Task Completed!' : modal === 'reassign' ? 'Reassign Task' : 'Reschedule Task'}</h2><p className="mt-1 text-xs text-muted-foreground">{modal === 'create' ? 'Capture a clear next action for your team.' : 'Update this task and keep the workflow moving.'}</p></div><button onClick={() => setModal(null)} className="text-foreground"><X size={18} /></button></div>{modal === 'create' ? <div className="mt-6 space-y-4"><label className="block text-xs text-muted-foreground">Task Title <em className="text-chart-5">*</em><input className="mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5 text-sm outline-none focus:border-border" placeholder="What needs to be done?" /></label><label className="block text-xs text-muted-foreground">Description<textarea className="mt-2 h-20 w-full resize-none rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5 text-sm outline-none" placeholder="Add context for the assignee..." /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs text-muted-foreground">Assignee <em className="text-chart-5">*</em><select className="mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5"><option>Workspace assignee</option><option>Workspace assignee</option><option>Workspace assignee</option></select></label><label className="block text-xs text-muted-foreground">Due Date <em className="text-chart-5">*</em><input type="date" className="mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5" /></label></div><div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs text-muted-foreground">Priority<select className="mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5"><option>High</option><option>Critical</option><option>Medium</option><option>Low</option></select></label><label className="block text-xs text-muted-foreground">Related Deal<input placeholder="Search records..." className="mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5" /></label></div></div> : modal === 'complete' ? <div className="mt-6 space-y-4"><label className="block text-xs text-muted-foreground">Completion Note<textarea className="mt-2 h-24 w-full rounded-lg border border-border bg-[var(--secondary)] p-3" placeholder="Optional note..." /></label><label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" className="accent-primary" /> Create follow-up task</label></div> : <div className="mt-6 space-y-4"><p className="text-sm text-muted-foreground">Current assignee: <strong className="text-foreground">Workspace assignee</strong></p><label className="block text-xs text-muted-foreground">{modal === 'reassign' ? 'New Assignee' : 'Due Date'}<select className="mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5"><option>{modal === 'reassign' ? 'Workspace assignee' : 'Tomorrow'}</option><option>Workspace assignee</option><option>Workspace assignee</option></select></label><label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" defaultChecked className="accent-primary" /> {modal === 'reassign' ? 'Notify assignee' : 'Keep existing due time'}</label></div>}<div className="mt-7 flex justify-end gap-2"><button onClick={() => setModal(null)} className="rounded-lg border border-border px-4 py-2.5 text-xs text-foreground">Cancel</button><button onClick={() => {
            setModal(null);
            action(modal === 'complete' ? 'Task marked complete' : 'Task updated');
          }} className="rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground">{modal === 'create' ? 'Create Task' : modal === 'complete' ? 'Done' : modal === 'reassign' ? 'Reassign' : 'Reschedule'}</button></div></div></dialog>}
    {toast && <div role="status" className="fixed bottom-6 right-6 z-50 rounded-lg border border-chart-4/20 bg-[var(--secondary)] px-4 py-3 text-xs text-chart-4">{toast}</div>}
  </main>;
}
function Board({
  onOpen
}: {
  onOpen: () => void;
}) {
  const columns = [{
    name: 'Not Started',
    count: 42,
    items: ['Follow up with Anna Weber', 'Review pricing with DataStream AG', 'Add decision maker to GlobalTech deal']
  }, {
    name: 'In Progress',
    count: 8,
    items: ['Send updated proposal to Bluewave', 'Follow-up after demo']
  }, {
    name: 'Blocked',
    count: 4,
    items: ['Call Zentrix Ltd']
  }, {
    name: 'Completed',
    count: 247,
    items: ['Discovery call with NexGen Systems', 'Send intro email']
  }];
  return <section className="mt-5 overflow-x-auto"><div className="grid min-w-[980px] grid-cols-4 gap-4">{columns.map(column => <div key={column.name} className="rounded-xl border border-border/[.08] bg-[var(--secondary)] p-3"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold">{column.name}</h2><span className="text-xs text-muted-foreground">{column.count}</span></div><div className="space-y-3">{column.items.map(title => <button key={title} onClick={onOpen} className="w-full rounded-lg border border-border/[.07] bg-[var(--primary)] p-3 text-left hover:border-border/40 text-primary-foreground"><strong className="text-xs font-medium">{title}</strong><p className="mt-3 text-[11px] text-muted-foreground">Today · Workspace assignee</p><Priority value="High" /></button>)}</div><button className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-border py-2 text-[11px] text-foreground"><MoveRight size={13} /> Move stage</button></div>)}</div></section>;
}
function CalendarView() {
  const dates = ['Mon 14', 'Tue 15', 'Wed 16', 'Thu 17', 'Fri 18'];
  const chips = ['Follow up · High', 'Proposal · Medium', 'Pricing · High', 'Q4 review · Medium', 'Contract · High'];
  return <section className="mt-5 rounded-xl border border-border/[.08] bg-[var(--card)] p-5"><div className="flex items-center justify-between"><div><h2 className="text-base font-semibold">Task calendar</h2><p className="mt-1 text-xs text-muted-foreground">September 14–18, 2025</p></div><div className="flex gap-2"><button className="rounded-lg border border-border p-2"><ChevronLeft size={15} /></button><button className="rounded-lg border border-border p-2"><ChevronRight size={15} /></button></div></div><div className="mt-6 grid grid-cols-5 gap-2">{dates.map((date, idx) => <div key={date} className="min-h-[180px] rounded-lg border border-border/[.07] bg-[var(--secondary)] p-3"><p className="text-xs font-semibold text-muted-foreground">{date}</p>{idx < 5 && <button className={`mt-4 w-full rounded-md p-2 text-left text-[11px] ${idx === 0 || idx === 2 || idx === 4 ? 'bg-chart-5/15 text-foreground' : 'bg-secondary/15 text-foreground'}`}>{chips[idx]}</button>}</div>)}</div><h3 className="mt-7 text-sm font-semibold">September 2025</h3><div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => <span key={day} className="py-2">{day}</span>)}{Array.from({
        length: 35
      }, (_, idx) => <span key={idx} className={`rounded-md py-2 ${idx === 14 ? 'bg-primary font-bold text-primary-foreground' : 'hover:bg-secondary'}`}>{idx + 1 <= 30 ? idx + 1 : ''}</span>)}</div></section>;
}
function AiSections({
  onAction
}: {
  onAction: (message: string) => void;
}) {
  return <section className="mt-10 grid gap-8 xl:grid-cols-2"><div><div className="mb-4 flex items-center gap-2"><h2 className="text-xl font-semibold">Lulu AI Task Prioritization</h2><span className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-2 py-1 text-[10px] text-foreground"><Sparkles size={11} /> AI</span></div><div className="space-y-3">{aiPriority.map(item => <article key={item.title} className="rounded-xl border border-border/15 bg-secondary/[.04] p-4"><div className="flex items-center justify-between"><Priority value={item.level as Task['priority']} /><span className="text-[10px] text-foreground">AI-generated · 8 min ago</span></div><h3 className="mt-3 text-sm font-semibold">{item.title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{item.reason}</p><div className="mt-4 flex items-center justify-between"><span className="flex items-center gap-2 text-[11px] text-muted-foreground"><Avatar name={item.assignee} />{item.assignee}</span><button onClick={() => onAction('Opening AI-prioritized task')} className="rounded-md bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground">Open Task</button></div></article>)}</div></div><div><div className="mb-4 flex items-center gap-2"><h2 className="text-xl font-semibold">AI Recommendations</h2><span className="rounded-full bg-secondary/15 px-2 py-1 text-[10px] text-foreground">AI</span></div><div className="space-y-3">{[{
          title: 'Create Follow-Up Task',
          body: 'Stalled high-value deal (Sales Automation) has no open tasks',
          impact: 'Re-engage deal',
          priority: 'High'
        }, {
          title: 'Reassign Overdue Tasks',
          body: 'Workspace assignee has 5 overdue tasks; consider rebalancing workload',
          impact: 'Balance capacity',
          priority: 'Medium'
        }, {
          title: 'Schedule Follow-Up',
          body: 'After completed meeting with Pinnacle GmbH, no follow-up task created',
          impact: 'Keep momentum',
          priority: 'Medium'
        }].map(item => <article key={item.title} className="rounded-xl border border-border/[.08] bg-[var(--card)] p-4"><div className="flex items-start gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary/10 text-foreground"><Sparkles size={15} /></span><div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">{item.title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{item.body}</p><p className="mt-3 text-[11px] text-muted-foreground">Priority: <span className="text-chart-1">{item.priority}</span> · Expected impact: {item.impact}</p></div><button onClick={() => onAction(`${item.title} opened`)} className="shrink-0 text-[11px] font-semibold text-foreground">{item.title === 'Reassign Overdue Tasks' ? 'Review' : 'Create Task'}</button></div></article>)}</div></div></section>;
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
