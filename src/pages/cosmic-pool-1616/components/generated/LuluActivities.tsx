import { useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, ArrowDown, ArrowUp, Bell, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, Download, Filter, List, Mail, MoreHorizontal, PanelRight, Phone, Plus, Search, Settings, Sparkles, Tag, Target, Trash2, UserRound, Users, X, Zap, StickyNote, RefreshCw, SlidersHorizontal } from 'lucide-react';
type ActivityKind = 'Call' | 'Meeting' | 'Email' | 'Note' | 'Follow-up';
type ActivityStatus = 'Scheduled' | 'Completed' | 'Overdue';
type ActivityRow = {
  id: string;
  kind: ActivityKind;
  title: string;
  record: string;
  date: string;
  owner: string;
  priority: 'High' | 'Medium' | 'Low' | '—';
  status: ActivityStatus;
};
const activityRows: ActivityRow[] = [{
  id: 'a1',
  kind: 'Call',
  title: 'Follow up with Anna Weber',
  record: 'TechCorp GmbH · Enterprise Expansion',
  date: 'Today 14:30',
  owner: 'Workspace owner',
  priority: 'High',
  status: 'Scheduled'
}, {
  id: 'a2',
  kind: 'Meeting',
  title: 'Q4 Business Review',
  record: 'DataStream AG · Cloud Migration',
  date: 'Tomorrow 10:00',
  owner: 'Priya Nair',
  priority: 'High',
  status: 'Scheduled'
}, {
  id: 'a3',
  kind: 'Email',
  title: 'Send updated proposal',
  record: 'Bluewave Ltd · Marketing Platform',
  date: 'Today 16:00',
  owner: 'Marcus Hill',
  priority: 'Medium',
  status: 'Scheduled'
}, {
  id: 'a4',
  kind: 'Note',
  title: 'Discovery call notes',
  record: 'NexGen Systems · CRM Integration',
  date: 'Yesterday 11:00',
  owner: 'Marcus Hill',
  priority: '—',
  status: 'Completed'
}, {
  id: 'a5',
  kind: 'Follow-up',
  title: 'Check in after demo',
  record: 'Vertex Corp · Analytics Dashboard',
  date: 'Tomorrow 09:00',
  owner: 'Priya Nair',
  priority: 'Medium',
  status: 'Scheduled'
}, {
  id: 'a6',
  kind: 'Call',
  title: 'Pricing discussion',
  record: 'GlobalTech Inc · Sales Automation',
  date: '2 days ago 15:00',
  owner: 'Workspace owner',
  priority: 'High',
  status: 'Overdue'
}, {
  id: 'a7',
  kind: 'Meeting',
  title: 'Partnership alignment',
  record: 'Pinnacle GmbH',
  date: '3 days ago 14:00',
  owner: 'Priya Nair',
  priority: 'Medium',
  status: 'Completed'
}, {
  id: 'a8',
  kind: 'Email',
  title: 'Contract follow-up',
  record: 'MicroSoft AG',
  date: 'Today 09:15',
  owner: 'Marcus Hill',
  priority: 'High',
  status: 'Overdue'
}, {
  id: 'a9',
  kind: 'Call',
  title: 'Re-engagement call',
  record: 'Zentrix Ltd',
  date: 'This Week',
  owner: 'Workspace owner',
  priority: 'Low',
  status: 'Scheduled'
}, {
  id: 'a10',
  kind: 'Note',
  title: 'Post-meeting summary',
  record: 'Altus Media',
  date: 'Yesterday',
  owner: 'Marcus Hill',
  priority: '—',
  status: 'Completed'
}];
const kpis = [{
  label: 'Total Activities',
  value: '1,284',
  delta: '+12.4%',
  icon: Activity,
  tone: 'violet'
}, {
  label: 'Completed',
  value: '842',
  delta: '+18.0%',
  icon: Check,
  tone: 'green'
}, {
  label: 'Upcoming',
  value: '286',
  delta: '+6.2%',
  icon: CalendarDays,
  tone: 'blue'
}, {
  label: 'Overdue',
  value: '54',
  delta: '-8.1%',
  icon: Clock3,
  tone: 'red'
}, {
  label: 'Today',
  value: '38',
  delta: '8 remaining',
  icon: Zap,
  tone: 'violet'
}, {
  label: 'No Follow-Up',
  value: '64',
  delta: 'Needs attention',
  icon: Bell,
  tone: 'amber'
}];
const upcoming = [{
  kind: 'Call',
  title: 'Follow up with Anna Weber',
  when: 'Today · 14:30',
  company: 'TechCorp GmbH',
  owner: 'Workspace owner'
}, {
  kind: 'Meeting',
  title: 'Q4 Business Review',
  when: 'Tomorrow · 10:00',
  company: 'DataStream AG',
  owner: 'Priya Nair'
}, {
  kind: 'Email',
  title: 'Send proposal to Bluewave Ltd',
  when: 'Today · 16:00',
  company: 'Bluewave Ltd',
  owner: 'Marcus Hill'
}, {
  kind: 'Follow-up',
  title: 'Check in after demo',
  when: 'Tomorrow · 09:00',
  company: 'NexGen Systems',
  owner: 'Marcus Hill'
}];
const iconFor = (kind: string) => kind === 'Call' ? Phone : kind === 'Meeting' ? CalendarDays : kind === 'Email' ? Mail : kind === 'Note' ? StickyNote : RefreshCw;
const toneFor = (kind: string) => kind === 'Call' ? 'text-foreground bg-secondary/15' : kind === 'Meeting' ? 'text-foreground bg-secondary/15' : kind === 'Email' ? 'text-foreground bg-secondary/15' : kind === 'Note' ? 'text-foreground bg-secondary/15' : 'text-foreground bg-secondary/15';
function Sidebar({
  active,
  setActive
}: {
  active: string;
  setActive: (v: string) => void;
}) {
  const main = [{
    name: 'Dashboard',
    icon: Activity
  }, {
    name: 'AI Insights',
    icon: Sparkles
  }];
  const crm = ['Overview', 'Contacts', 'Companies', 'Leads', 'Deals', 'Pipeline', 'Activities', 'Tasks'];
  return <aside className="w-[220px] shrink-0 border-r border-border/[.07] bg-[var(--background)] px-3 py-5 flex flex-col min-h-screen">
    <div className="flex items-center gap-2.5 px-3 mb-9"><div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_22px_rgba(0,0,0,.35)] text-primary-foreground"><Sparkles size={17} /></div><strong className="text-[15px] tracking-tight">Lulu <span className="text-foreground">AI</span></strong></div>
    <LuluSectionNavigation activeId="cosmic-pool-1616" />
    <button className="mt-auto flex items-center gap-3 border-t border-border/[.07] pt-4 px-3 text-left"><div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary flex items-center justify-center text-xs font-bold text-primary-foreground">SC</div><div><p className="text-xs font-medium">Workspace owner</p><p className="text-[11px] text-muted-foreground">Administrator</p></div><ChevronDown size={14} className="ml-auto text-muted-foreground" /></button>
  </aside>;
}
function ActivityTable({
  selected,
  setSelected,
  setDrawer
}: {
  selected: string[];
  setSelected: (v: string[]) => void;
  setDrawer: (v: boolean) => void;
}) {
  const toggle = (id: string) => setSelected(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  return <section className="rounded-xl border border-border/[.08] bg-[var(--card)] overflow-hidden" aria-label="Activity list">
    {selected.length > 0 && <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/10 border-b border-border/20 text-xs"><span className="text-foreground font-medium">{selected.length} selected</span><button className="ml-3 text-foreground hover:text-foreground">Assign Owner</button><button className="text-foreground hover:text-foreground">Change Status</button><button className="text-foreground hover:text-foreground">Reschedule</button><button className="text-foreground hover:text-foreground">Mark Complete</button><button className="text-foreground hover:text-foreground">Export</button><button className="text-foreground hover:text-foreground ml-auto"><Trash2 size={14} /></button></div>}
    <div className="grid grid-cols-[34px_105px_minmax(240px,1.6fr)_150px_125px_90px_108px_36px] gap-3 px-4 py-3 border-b border-border/[.07] text-[10px] uppercase tracking-[.13em] text-muted-foreground"><input type="checkbox" aria-label="Select all activities" checked={selected.length === activityRows.length} onChange={() => setSelected(selected.length === activityRows.length ? [] : activityRows.map(row => row.id))} /><span>Type</span><span>Title + Record</span><span>Date / Time</span><span>Owner</span><span>Priority</span><span>Status</span><span /></div>
    {activityRows.map(row => {
      const Icon = iconFor(row.kind);
      return <div key={row.id} onClick={() => setDrawer(true)} className="group grid grid-cols-[34px_105px_minmax(240px,1.6fr)_150px_125px_90px_108px_36px] gap-3 items-center px-4 py-3 border-b border-border/[.045] text-xs hover:bg-secondary cursor-pointer transition-colors"><input type="checkbox" aria-label={`Select ${row.title}`} checked={selected.includes(row.id)} onChange={e => {
          e.stopPropagation();
          toggle(row.id);
        }} /><span className="flex items-center gap-2 text-foreground"><span className={`p-1.5 rounded-md ${toneFor(row.kind)}`}><Icon size={14} /></span>{row.kind}</span><span className="min-w-0"><strong className="block text-foreground font-medium truncate">{row.title}</strong><span className="block text-[11px] text-muted-foreground truncate mt-0.5">{row.record}</span></span><span className="text-muted-foreground">{row.date}</span><span className="text-foreground flex items-center gap-2"><span className="h-5 w-5 rounded-full bg-card text-[9px] flex items-center justify-center">{row.owner.split(' ').map(x => x[0]).join('')}</span>{row.owner}</span><span className="flex items-center gap-2 text-muted-foreground">{row.priority !== '—' && <i className={`h-2 w-2 rounded-full ${row.priority === 'High' ? 'bg-destructive' : row.priority === 'Medium' ? 'bg-chart-1' : 'bg-chart-4'}`} />}{row.priority}</span><span className={`w-fit rounded-full px-2 py-1 text-[10px] ${row.status === 'Completed' ? 'bg-chart-4/10 text-chart-4' : row.status === 'Overdue' ? 'bg-chart-5/10 text-chart-5' : 'bg-secondary/10 text-foreground'}`}>{row.status}{row.status === 'Completed' ? ' ✓' : row.status === 'Overdue' ? ' ⚠' : ''}</span><button aria-label="More actions" className="text-foreground group-hover:text-foreground"><MoreHorizontal size={16} /></button></div>;
    })}
    <div className="flex items-center justify-between px-4 py-3 text-xs text-muted-foreground"><span>1–50 of 1,284 activities</span><span className="flex items-center gap-3">Items per page: <button className="text-foreground">50 <ChevronDown size={13} className="inline" /></button><button><ChevronLeft size={14} /></button><strong className="text-foreground">1</strong><button>2</button><button>3</button><span>…</span><button>26</button><button><ChevronRight size={14} /></button></span></div>
  </section>;
}
function ActivityDrawer({
  onClose
}: {
  onClose: () => void;
}) {
  return <aside className="fixed right-0 top-0 h-screen w-[365px] bg-[var(--background)] border-l border-border shadow-2xl z-30 p-6 overflow-auto" aria-label="Activity quick preview"><div className="flex items-center justify-between mb-8"><div><p className="text-[10px] text-foreground uppercase tracking-[.16em] font-semibold">Quick preview</p><h2 className="text-xl font-semibold mt-1">Follow up with Anna Weber</h2></div><button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary"><X size={18} /></button></div><div className="flex gap-2 items-center text-xs text-foreground mb-6"><span className="p-2 rounded-lg bg-secondary/15"><Phone size={16} /></span> Call <span className="text-muted-foreground">·</span> Scheduled</div><dl className="space-y-4 text-sm">{[['Contact', 'Anna Weber'], ['Company', 'TechCorp GmbH'], ['Deal', 'Enterprise Expansion'], ['Owner', 'Workspace owner'], ['Date', 'Today · 14:30'], ['Priority', 'High']].map(([term, value]) => <div key={term}><dt className="text-[11px] text-muted-foreground mb-1">{term}</dt><dd className="text-foreground">{value}</dd></div>)}</dl><div className="border-t border-border/[.08] mt-7 pt-6"><p className="text-[11px] text-muted-foreground mb-2">Description</p><p className="text-sm leading-6 text-foreground">Follow up on revised pricing proposal and confirm next steps for the expansion.</p></div><div className="mt-8 grid grid-cols-2 gap-2"><button className="rounded-lg bg-primary hover:bg-primary py-2.5 text-xs font-medium text-primary-foreground">Open Record</button><button className="rounded-lg border border-border hover:bg-secondary py-2.5 text-xs">Edit</button><button className="rounded-lg border border-border hover:bg-secondary py-2.5 text-xs">Mark Complete</button><button className="rounded-lg border border-border hover:bg-secondary py-2.5 text-xs">Reschedule</button><button className="col-span-2 text-xs text-chart-5 py-2 hover:bg-chart-5/10 rounded-lg">Cancel activity</button></div><p className="text-[11px] text-muted-foreground mt-8">Created 3 days ago</p></aside>;
}
export function LuluActivities() {
  const [active, setActive] = useState('Activities');
  const [tab, setTab] = useState('List');
  const [selected, setSelected] = useState<string[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [modal, setModal] = useState(false);
  const [query, setQuery] = useState('');
  const [performance, setPerformance] = useState(true);
  const { items: liveActivities, loading: liveLoading, error: liveError } = useLiveRecords('crm_activities');
  const liveEmpty = !liveLoading && !liveError && liveActivities.length === 0;
  const countBy = (pattern: RegExp) => liveActivities.filter(record => pattern.test(`${record.status} ${record.data?.type || ''} ${record.data?.kind || ''}`)).length;
  const liveKpis = kpis.map((item, index) => ({ ...item, value: String([liveActivities.length, countBy(/completed/i), countBy(/scheduled|upcoming/i), countBy(/overdue/i), countBy(/today/i), countBy(/follow.?up|no.?follow/i)][index] || 0), delta: liveActivities.length ? 'Live records' : 'No live data' }));
  return <div className="min-h-screen bg-[var(--background)] text-foreground flex text-sm font-sans"><Sidebar active={active} setActive={setActive} /><main className="flex-1 min-w-0 px-8 py-7 overflow-hidden">{liveLoading ? <div className="mb-5 rounded-lg border border-border bg-secondary/30 px-4 py-3 text-xs text-muted-foreground">Loading live CRM activities…</div> : liveError ? <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">{liveError}</div> : liveEmpty ? <div className="mb-5 rounded-lg border border-dashed border-border bg-card px-4 py-3 text-xs text-muted-foreground">No live CRM activities are available yet. Add an activity or connect your CRM to begin.</div> : null}<header className="flex items-start justify-between mb-7"><div><p className="text-xs text-muted-foreground mb-3">CRM <span className="mx-2 text-foreground">/</span> Activities</p><h1 className="text-[30px] leading-none font-semibold tracking-tight">Activities</h1><p className="text-sm text-muted-foreground mt-3">Track every important interaction, follow-up and customer activity across your CRM.</p></div><div className="flex items-center gap-2"><button className="border border-border rounded-lg px-3 py-2 text-xs text-foreground hover:bg-secondary"><Filter size={14} className="inline mr-2" />Filter</button><button className="border border-border rounded-lg px-3 py-2 text-xs text-foreground hover:bg-secondary"><CalendarDays size={14} className="inline mr-2" />Calendar</button><button onClick={() => setModal(true)} className="bg-primary hover:bg-primary rounded-lg px-4 py-2 text-xs font-semibold shadow-lg shadow-black/20 text-primary-foreground"><Plus size={14} className="inline mr-1" />Create Activity</button></div></header>
    <section className="grid grid-cols-6 gap-3 mb-6">{liveKpis.map(({
          label,
          value,
          delta,
          icon: Icon,
          tone
        }) => <article key={label} className="rounded-xl bg-[var(--card)] border border-border/[.07] p-4"><div className="flex justify-between items-start"><span className={`p-2 rounded-lg ${tone === 'green' ? 'bg-chart-4/10 text-chart-4' : tone === 'blue' ? 'bg-secondary/10 text-foreground' : tone === 'red' ? 'bg-chart-5/10 text-chart-5' : tone === 'amber' ? 'bg-chart-1/10 text-chart-1' : 'bg-secondary/10 text-foreground'}`}><Icon size={16} /></span><span className="text-[10px] text-muted-foreground">{delta}</span></div><p className="text-[11px] text-muted-foreground mt-4">{label}</p><p className="text-2xl font-semibold mt-1 tracking-tight">{value}</p></article>)}</section>
    <div className="flex items-center gap-4 border-b border-border/[.08] pb-3 mb-4"><div className="flex gap-1">{['List', 'Calendar', 'Timeline'].map(name => <button key={name} onClick={() => setTab(name)} className={`px-3 py-2 rounded-md text-xs ${tab === name ? 'bg-secondary text-foreground' : 'text-foreground hover:text-foreground'}`}>{name === 'List' && <List size={14} className="inline mr-2" />}{name === 'Calendar' && <CalendarDays size={14} className="inline mr-2" />}{name === 'Timeline' && <Activity size={14} className="inline mr-2" />}{name}</button>)}</div><div className="ml-auto flex items-center gap-2"><div className="flex items-center border border-border rounded-lg bg-[var(--secondary)] px-3 w-56"><Search size={14} className="text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search activities..." className="bg-transparent outline-none px-2 py-2 text-xs w-full placeholder:text-muted-foreground" /><kbd className="text-[10px] text-muted-foreground">⌘K</kbd></div><button className="border border-border rounded-lg px-3 py-2 text-xs text-foreground"><SlidersHorizontal size={14} className="inline mr-2" />Filters <span className="ml-1 rounded-full bg-secondary/20 text-foreground px-1.5">2</span></button><button className="border border-border rounded-lg px-3 py-2 text-xs text-foreground">My Activities <ChevronDown size={13} className="inline ml-2" /></button></div></div>
    <div className="flex gap-2 items-center mb-5 text-[11px]"><span className="text-muted-foreground">Active filters:</span><span className="rounded-md bg-secondary/10 text-foreground px-2 py-1">Type: Call, Meeting <X size={12} className="inline ml-1" /></span><span className="rounded-md bg-chart-5/10 text-chart-5 px-2 py-1">Status: Overdue <X size={12} className="inline ml-1" /></span><button className="text-foreground hover:text-foreground">Clear All</button></div>
    <section className="mb-6"><div className="flex items-center justify-between mb-3"><h2 className="font-semibold">Upcoming Activities</h2><button className="text-xs text-foreground">View calendar <ChevronRight size={13} className="inline" /></button></div><div className="grid grid-cols-4 gap-3">{upcoming.map(item => {
            const Icon = iconFor(item.kind);
            return <article key={item.title} className="rounded-xl border border-border/[.07] bg-[var(--card)] p-3.5 hover:border-border/30 transition-colors"><div className="flex items-center gap-2 text-xs text-foreground"><span className={`p-1.5 rounded-md ${toneFor(item.kind)}`}><Icon size={14} /></span>{item.kind}<span className="ml-auto text-muted-foreground">{item.when}</span></div><h3 className="font-medium text-xs mt-3 truncate">{item.title}</h3><p className="text-[11px] text-muted-foreground mt-1">{item.company} · {item.owner}</p><button className="text-[11px] text-foreground mt-3">Open <ChevronRight size={12} className="inline" /></button></article>;
          })}</div></section>
    {tab === 'List' && <><ActivityTable selected={selected} setSelected={setSelected} setDrawer={setDrawer} /><section className="mt-6 rounded-xl border border-chart-5/15 bg-[var(--card)] p-5"><div className="flex items-center justify-between mb-4"><h2 className="font-semibold">Overdue Activities <span className="ml-2 rounded-full bg-chart-5/15 text-chart-5 px-2 py-1 text-[10px]">54</span></h2><button className="text-xs text-foreground">View All 54 Overdue <ChevronRight size={13} className="inline" /></button></div><div className="grid grid-cols-3 gap-3">{[['Follow-up with GlobalTech Inc', 'Overdue by 2 days', 'Workspace owner', 'Sales Automation'], ['Contract follow-up email', 'Overdue by 1 day', 'Marcus Hill', 'MicroSoft AG'], ['Customer meeting not completed', 'Overdue by 3 days', 'Priya Nair', 'Zentrix Ltd']].map(([title, due, owner, related]) => <article key={title} className="border border-border/[.07] rounded-lg p-3 bg-[var(--card)]"><div className="flex gap-2"><span className="text-chart-5">⚠</span><div><h3 className="text-xs font-medium">{title}</h3><p className="text-[11px] text-chart-5 mt-1">{due}</p><p className="text-[11px] text-muted-foreground mt-2">Owner: {owner} · Related: {related}</p></div><button className="ml-auto self-end text-[11px] text-foreground">Review</button></div></article>)}</div></section></>}
    {tab === 'Calendar' && <section className="rounded-xl border border-border/[.08] bg-[var(--card)] p-5"><h2 className="font-semibold mb-5">This Week · October 21–27, 2024</h2><div className="grid grid-cols-7 border-t border-l border-border/[.07]">{['Mon 21', 'Tue 22', 'Wed 23', 'Thu 24', 'Fri 25', 'Sat 26', 'Sun 27'].map((day, dayIndex) => <div key={day} className="min-h-[360px] border-r border-b border-border/[.07]"><div className="p-3 text-xs font-medium border-b border-border/[.07] text-muted-foreground">{day}</div><div className="p-2 space-y-2">{(dayIndex === 1 ? ['Follow up with Anna Weber'] : dayIndex === 2 ? ['Q4 Business Review', 'Send proposal'] : dayIndex === 4 ? ['Pricing discussion'] : []).map((event, eventIndex) => <button key={event} className={`w-full text-left rounded-md p-2 text-[10px] ${eventIndex % 2 ? 'bg-secondary/15 text-foreground' : 'bg-secondary/15 text-foreground'}`}><Clock3 size={11} className="inline mr-1" />{event}<span className="block text-[9px] text-muted-foreground mt-1">{eventIndex ? '16:00' : '14:30'}</span></button>)}</div></div>)}</div></section>}
    {tab === 'Timeline' && <section className="rounded-xl border border-border/[.08] bg-[var(--card)] p-6"><h2 className="font-semibold mb-6">Activity Timeline</h2>{[['Today', ['Follow up with Anna Weber', 'Send updated proposal', 'Contract follow-up']], ['Yesterday', ['Discovery call notes', 'Post-meeting summary', 'Partnership alignment', 'Team handoff']], ['This Week', ['Check in after demo', 'Pricing discussion', 'Q4 Business Review']]].map(([group, events]) => <div key={group as string} className="mb-7"><h3 className="text-xs uppercase tracking-[.14em] text-foreground mb-3">{group as string}</h3>{(events as string[]).map(event => <div key={event} className="flex items-center gap-4 border-l border-border/30 pl-4 py-3"><span className="h-2 w-2 rounded-full bg-primary -ml-[21px] text-primary-foreground" /><span className="text-xs text-foreground">{event}</span><span className="text-[11px] text-muted-foreground ml-auto">Workspace owner · Scheduled</span></div>)}</div>)}<button className="text-xs text-foreground">Earlier · Load more</button></section>}
    <section className="mt-6 border-t border-border/[.07] pt-5"><button onClick={() => setPerformance(!performance)} className="flex items-center gap-2 font-semibold"><ChevronDown size={16} className={performance ? '' : '-rotate-90'} />Activity Performance</button>{performance && <div className="grid grid-cols-6 gap-3 mt-4">{[['Activities Completed', '842', 'vs 716 prev ↑ 18%'], ['Completion Rate', '65.6%', 'vs 58% prev ↑'], ['Overdue Rate', '4.2%', 'vs 6.1% prev ↓ good'], ['Avg Activities / Owner', '38.4', 'per week'], ['Follow-Up Completion', '71%', 'steady'], ['Meetings Completed', '124', 'this month']].map(([a, b, c]) => <article key={a} className="rounded-lg border border-border/[.07] p-3"><p className="text-[11px] text-muted-foreground">{a}</p><p className="text-xl font-semibold mt-2">{b}</p><p className="text-[10px] text-chart-4 mt-1">{c}</p></article>)}</div>}<div className="mt-3 text-right text-[11px] text-muted-foreground">Period: <button className="text-foreground ml-1">Previous Period</button> · <button className="text-foreground">Previous Year</button></div></section>
    <section className="mt-8 grid grid-cols-2 gap-5"><div><h2 className="font-semibold mb-3">Customer Engagement</h2>{[['High Engagement', 'TechCorp GmbH', '12 interactions this month', 'bg-primary'], ['Stable Engagement', 'DataStream AG', '6 interactions this month', 'bg-primary'], ['Low Engagement', 'GlobalTech Inc', '2 interactions · Last activity: 14 days ago', 'bg-destructive'], ['No Recent Activity', 'Altus Media', 'Last activity: 32 days ago', 'bg-secondary']].map(([a, b, c, d]) => <article key={b} className="flex items-center gap-3 border-b border-border/[.06] py-3"><span className={`h-2.5 w-2.5 rounded-full ${d}`} /><div><h3 className="text-xs font-medium">{a} <span className="text-muted-foreground font-normal">— {b}</span></h3><p className="text-[11px] text-muted-foreground mt-1">{c}</p></div></article>)}</div><div><h2 className="font-semibold mb-3">Relationships Requiring Attention</h2>{[['No activity with GlobalTech Inc (high-value) for 14 days', 'Workspace owner', 'High'], ['High-potential lead NexGen Systems has no follow-up scheduled', 'Marcus Hill', 'High'], ['Open deal (Analytics Dashboard) has no customer interaction in 8 days', 'Priya Nair', 'Medium']].map(([a, b, c]) => <article key={a} className="border border-border/[.07] rounded-lg p-3 mb-2"><h3 className="text-xs font-medium"><span className="text-foreground mr-2">⚠</span>{a}</h3><p className="text-[11px] text-muted-foreground mt-2">Owner: {b} · Priority: <span className={c === 'High' ? 'text-chart-5' : 'text-foreground'}>{c}</span><button className="float-right text-foreground">Review</button></p></article>)}</div></section>
    <section className="mt-8 pb-10"><div className="flex items-center gap-2 mb-3"><h2 className="font-semibold">Lulu AI Activity Insights</h2><span className="rounded-full bg-secondary/15 text-foreground px-2 py-1 text-[10px]"><Sparkles size={11} className="inline mr-1" />AI-generated</span></div><div className="grid grid-cols-3 gap-3">{[['Follow-up Risk', 'Several high-value opportunities have overdue follow-up activities. Win probability may be affected.', 'High', '87%'], ['Declining Engagement', 'Activity with GlobalTech Inc has dropped 60% over the past 30 days.', 'Medium', '—'], ['Repeated Delay Pattern', '3 follow-up activities with Zentrix Ltd have been rescheduled multiple times.', 'Medium', '—']].map(([a, b, c, d]) => <article key={a} className="rounded-xl border border-border/15 bg-secondary/[.05] p-4"><p className="text-xs text-foreground">{a}</p><p className="text-xs text-foreground leading-5 mt-3">{b}</p><p className="text-[10px] text-muted-foreground mt-4">Impact: <span className="text-foreground">{c}</span> · Confidence: {d} <button className="float-right text-foreground">Review →</button></p></article>)}</div><div className="flex items-center gap-2 mt-6 mb-3"><h2 className="font-semibold">AI Recommendations</h2><span className="rounded-full bg-secondary/15 text-foreground px-2 py-1 text-[10px]"><Sparkles size={11} className="inline mr-1" />AI-generated</span></div><div className="grid grid-cols-3 gap-3">{[['Create Follow-Up Tasks', 'Overdue follow-ups on 3 high-value deals require immediate action', 'High', 'Create Task'], ['Schedule Meeting', "Inactive strategic account GlobalTech Inc hasn't had a meeting in 14 days", 'High', 'Create Task'], ['Review Repeated Delays', 'Zentrix Ltd follow-ups have been deferred 3 times', 'Medium', 'Review']].map(([a, b, c, d]) => <article key={a} className="rounded-xl border border-border/[.08] bg-[var(--card)] p-4"><h3 className="text-xs font-medium">{a}</h3><p className="text-[11px] text-muted-foreground mt-2 leading-5">{b}</p><p className="text-[10px] mt-4 text-muted-foreground">Priority: <span className="text-foreground">{c}</span><button className="float-right text-foreground">{d} →</button></p></article>)}</div></section>
  </main>{drawer && <ActivityDrawer onClose={() => setDrawer(false)} />}{modal && <dialog open className="fixed z-40 m-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] rounded-2xl border border-border bg-[var(--card)] text-foreground p-0 shadow-2xl"><form method="dialog" onSubmit={() => setModal(false)}><div className="flex items-center justify-between px-6 py-5 border-b border-border/[.08]"><div><p className="text-[10px] uppercase tracking-[.15em] text-foreground">CRM activity</p><h2 className="text-lg font-semibold mt-1">Create Activity</h2></div><button type="button" onClick={() => setModal(false)} className="text-foreground hover:text-foreground"><X size={18} /></button></div><div className="grid grid-cols-2 gap-4 p-6 max-h-[65vh] overflow-auto"><label className="text-xs text-muted-foreground">Activity Type<select className="field"><option>Call</option><option>Meeting</option><option>Email</option><option>Note</option><option>Follow-up</option><option>Other</option></select></label><label className="text-xs text-muted-foreground">Title *<input required className="field" placeholder="What needs to happen?" /></label><label className="text-xs text-muted-foreground">Related Contact<input className="field" placeholder="Search contacts" /></label><label className="text-xs text-muted-foreground">Related Company<input className="field" placeholder="Search companies" /></label><label className="text-xs text-muted-foreground">Owner<select className="field"><option>Workspace owner</option><option>Marcus Hill</option><option>Priya Nair</option></select></label><label className="text-xs text-muted-foreground">Date *<input required type="date" className="field" /></label><label className="text-xs text-muted-foreground">Time<input type="time" className="field" /></label><label className="text-xs text-muted-foreground">Duration<select className="field"><option>30 minutes</option><option>60 minutes</option><option>90 minutes</option></select></label><label className="text-xs text-muted-foreground">Priority<select className="field"><option>High</option><option>Medium</option><option>Low</option></select></label><label className="col-span-2 text-xs text-muted-foreground">Description / Notes<textarea className="field min-h-20" placeholder="Add context for your team..." /></label></div><div className="flex justify-end gap-2 px-6 py-4 border-t border-border/[.08]"><button type="button" onClick={() => setModal(false)} className="px-4 py-2 rounded-lg border border-border text-xs">Cancel</button><button className="px-4 py-2 rounded-lg bg-primary text-xs font-semibold text-primary-foreground">Create Activity</button></div></form></dialog>}</div>;
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
