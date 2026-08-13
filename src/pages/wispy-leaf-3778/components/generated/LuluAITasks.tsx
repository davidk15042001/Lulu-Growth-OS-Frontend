import { useState } from 'react';
import { Activity, AlertCircle, Archive, ArrowRight, BarChart3, Bell, Bot, Check, ChevronDown, ChevronRight, CircleHelp, Clock3, Cloud, Database, Download, FileText, Filter, Flag, Gauge, GitBranch, Heart, History, Inbox, Info, LayoutDashboard, LifeBuoy, ListChecks, Menu, MessageSquare, MoreHorizontal, Pause, Play, Plus, RefreshCw, Search, Settings, Share2, ShieldCheck, Sparkles, Target, Trash2, UserRound, Users, X, Zap } from 'lucide-react';
type ModalKind = 'approve' | 'reject' | 'pause' | 'cancel' | 'retry' | 'create' | null;
type Tone = 'gray' | 'amber' | 'green' | 'red' | 'orange' | 'blue' | 'indigo' | 'purple' | 'teal';
interface Task {
  id: string;
  name: string;
  source: string;
  area: string;
  priority: string;
  status: string;
  owner: string;
  mode: string;
  due: string;
  progress?: number;
}
const stats = [['18', 'Active Tasks', 'blue'], ['4', 'Pending Approval', 'amber'], ['3', 'Executing', 'green'], ['11', 'Completed Today', 'green'], ['1', 'Failed', 'red'], ['6', 'Scheduled', 'indigo'], ['2', 'Blocked', 'orange']];
const tabs = ['All Tasks (18)', 'My Tasks (5)', 'AI Tasks (13)', 'Human Tasks (5)', 'Pending Approval (4)', 'Executing (3)', 'Scheduled (6)', 'Completed (11)', 'Failed (1)', 'Blocked (2)', 'Archived'];
const filters = ['Status', 'Priority', 'Business Area', 'Owner', 'AI / Human', 'Source', 'Platform', 'Due Date', 'Requires Approval', 'Execution Capability'];
const approvals = [['Optimize underperforming Google Ads campaigns', 'AI Recommendation', 'Advertising', 'High', 'Pause 3 campaigns, reallocate $4,200 budget', 'Estimated +$1,800/mo', 'Low', 'Google Ads write access'], ['Adjust Meta Ads audience targeting', 'AI Insight', 'Advertising', 'High', 'Update audience segments', 'Estimated +12% efficiency', 'Low', 'Authorized'], ['Identify high-value customers at churn risk', 'AI Recommendation', 'Customers', 'High', 'Run churn risk analysis', 'Estimated retain 8 accounts', 'None', 'CRM read access'], ['Generate SEO content recommendations', 'Scheduled Workflow', 'Marketing', 'Medium', 'Analyze top 20 keywords', '—', 'None', 'Search Console access']];
const tasks: Task[] = [{
  id: 'conversion',
  name: 'Analyze declining conversion rates',
  source: 'AI Insight',
  area: 'Ecommerce',
  priority: 'High',
  status: 'In Progress',
  owner: 'Lulu AI',
  mode: 'AI',
  due: 'Today',
  progress: 60
}, {
  id: 'opportunities',
  name: 'Review stalled sales opportunities',
  source: 'AI Recommendation',
  area: 'Sales',
  priority: 'High',
  status: 'Approved',
  owner: 'Lulu AI + User',
  mode: 'AI+Human',
  due: 'Tomorrow'
}, {
  id: 'cac',
  name: 'Monitor customer acquisition cost',
  source: 'Monitoring',
  area: 'Marketing',
  priority: 'Medium',
  status: 'Executing',
  owner: 'Lulu AI',
  mode: 'AI',
  due: 'Ongoing'
}, {
  id: 'anomaly',
  name: 'Investigate revenue anomaly',
  source: 'Anomaly',
  area: 'Finance',
  priority: 'Critical',
  status: 'Awaiting Approval',
  owner: 'User',
  mode: 'Human+AI',
  due: 'Today'
}, {
  id: 'data',
  name: 'Validate missing ecommerce data',
  source: 'AI Insight',
  area: 'Ecommerce',
  priority: 'Medium',
  status: 'Blocked',
  owner: 'Lulu AI',
  mode: 'AI',
  due: 'Yesterday · overdue'
}, {
  id: 'report',
  name: 'Create monthly executive report',
  source: 'Scheduled Workflow',
  area: 'Operations',
  priority: 'Low',
  status: 'Scheduled',
  owner: 'Lulu AI',
  mode: 'AI',
  due: 'Fri'
}, {
  id: 'ads',
  name: 'Analyze Google Ads campaign efficiency',
  source: 'AI Recommendation',
  area: 'Advertising',
  priority: 'High',
  status: 'In Progress',
  owner: 'Lulu AI',
  mode: 'AI',
  due: 'Today',
  progress: 40
}, {
  id: 'bottlenecks',
  name: 'Identify process bottlenecks',
  source: 'User',
  area: 'Operations',
  priority: 'Medium',
  status: 'New',
  owner: 'Unassigned',
  mode: 'Human',
  due: 'Next Week'
}];
const logs = [['09:28', 'Identified 3 underperforming campaigns', 'Google Ads', 'Completed'], ['09:31', 'Analyzed attribution and conversion data', 'GA4', 'Completed'], ['09:35', 'Compared audience performance', 'Google Ads', 'Completed'], ['09:42', 'Generated optimization proposal', 'Internal', 'Completed'], ['09:44', 'Sent approval request', 'System', 'Sent']];
const sources = [['Google Ads', '2 min', 'Ready'], ['Meta Ads', '5 min', 'Ready'], ['GA4', '8 min', 'Ready'], ['Shopify', '12 min', 'Ready'], ['CRM', '22 min', 'Ready'], ['Finance', '4 hrs', 'Limited']];
const toneClass: Record<Tone, string> = {
  gray: 'bg-card/50 text-foreground border-border',
  amber: 'bg-secondary/10 text-foreground border-border/30',
  green: 'bg-secondary/10 text-foreground border-border/30',
  red: 'bg-chart-5/10 text-chart-5 border-chart-5/30',
  orange: 'bg-secondary/10 text-foreground border-border/30',
  blue: 'bg-secondary/10 text-foreground border-border/30',
  indigo: 'bg-secondary/10 text-foreground border-border/30',
  purple: 'bg-secondary/10 text-foreground border-border/30',
  teal: 'bg-secondary/10 text-foreground border-border/30'
};
function Badge({
  children,
  tone = 'gray',
  pulse = false
}: {
  children: string;
  tone?: Tone;
  pulse?: boolean;
}) {
  return <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold whitespace-nowrap ${toneClass[tone]}`}>{pulse && <i className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse text-primary-foreground" />}<span>{children}</span></span>;
}
function statusTone(status: string): Tone {
  if (status === 'Executing') return 'green';
  if (status === 'Awaiting Approval') return 'amber';
  if (status === 'Blocked') return 'orange';
  if (status === 'In Progress') return 'indigo';
  if (status === 'Approved') return 'blue';
  if (status === 'Failed') return 'red';
  return 'gray';
}
function priorityTone(priority: string): Tone {
  return priority === 'Critical' ? 'red' : priority === 'High' ? 'amber' : priority === 'Medium' ? 'blue' : 'gray';
}
export function LuluAITasks() {
  const [activeTab, setActiveTab] = useState('All Tasks (18)');
  const [modal, setModal] = useState<ModalKind>(null);
  const [selected, setSelected] = useState('Optimize underperforming Google Ads campaigns');
  const [query, setQuery] = useState('');
  const [showDetail, setShowDetail] = useState(true);
  const [toast, setToast] = useState('');
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };
  const action = (message: string) => {
    setModal(null);
    notify(message);
  };
  return <main className="min-h-screen bg-[var(--background)] text-foreground flex font-sans">
    <aside className="hidden lg:flex w-[248px] shrink-0 border-r border-border bg-[var(--background)] flex-col p-4 sticky top-0 h-screen">
      <div className="flex items-center gap-3 px-3 py-4 mb-5"><div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary flex items-center justify-center shadow-lg shadow-black/20 text-primary-foreground"><Sparkles size={18} className="text-foreground" /></div><div><strong className="text-foreground tracking-tight">lulu<span className="text-foreground">.</span>ai</strong><p className="text-[10px] text-muted-foreground mt-0.5">BUSINESS OS</p></div></div>
      <LuluSectionNavigation activeId="wispy-leaf-3778" />
      <div className="mt-auto border-t border-border pt-4"><div className="flex items-center gap-3 px-2"><div className="h-8 w-8 rounded-full bg-gradient-to-br from-secondary to-card flex items-center justify-center text-xs font-bold">JD</div><div className="min-w-0"><p className="text-xs text-foreground">Jordan Davis</p><p className="text-[10px] text-muted-foreground truncate">Operations lead</p></div><MoreHorizontal size={16} className="ml-auto text-muted-foreground" /></div></div>
    </aside>
    <section className="flex-1 min-w-0">
      <header className="h-16 border-b border-border bg-[var(--card)]/90 px-5 lg:px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md"><button className="lg:hidden text-foreground" aria-label="Open navigation"><Menu /></button><div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground"><span>Intelligence</span><ChevronRight size={13} /><span>AI Intelligence</span><ChevronRight size={13} /><span className="text-foreground">AI Tasks</span></div><div className="flex items-center gap-2"><button onClick={() => notify('No new notifications')} className="p-2 text-foreground hover:text-foreground" aria-label="Notifications"><Bell size={17} /></button><button onClick={() => notify('Help center opened')} className="p-2 text-foreground hover:text-foreground" aria-label="Help"><CircleHelp size={17} /></button></div></header>
      <div className="p-5 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5"><div><p className="text-xs text-foreground mb-2 flex items-center gap-2"><Bot size={14} />AI INTELLIGENCE / EXECUTION CENTER</p><h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">AI Tasks</h1><p className="text-sm text-muted-foreground mt-2 max-w-xl">Manage, approve and monitor the actions Lulu AI has identified or is executing across your business.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => setModal('create')} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/20 hover:brightness-110"><Plus size={15} />Create Task</button><button onClick={() => notify('Lulu AI is listening...')} className="inline-flex items-center gap-2 rounded-lg border border-border/30 bg-secondary/10 px-3 py-2 text-sm text-foreground hover:bg-secondary/20"><MessageSquare size={15} />Ask Lulu AI</button><button onClick={() => notify('Tasks refreshed just now')} className="p-2.5 rounded-lg border border-border text-foreground hover:bg-secondary" aria-label="Refresh tasks"><RefreshCw size={16} /></button><button onClick={() => notify('Report creation started')} className="hidden md:inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary"><FileText size={15} />Create Report</button><button onClick={() => notify('Export ready')} className="hidden md:inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary"><Download size={15} />Export</button></div></div>
        <div className="relative max-w-2xl"><Search size={17} className="absolute left-3.5 top-3 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} className="w-full rounded-lg border border-border bg-[var(--secondary)] py-2.5 pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-border/60 focus:ring-2 focus:ring-ring/10" placeholder="Search tasks, recommendations, campaigns, customers..." /></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">{stats.map(([value, label, color]) => <div key={label} className="rounded-xl border border-border bg-[var(--secondary)] px-4 py-3.5"><div className="flex items-center gap-2"><strong className="text-2xl text-foreground">{value}</strong>{<i className={`h-2 w-2 rounded-full ${color === 'amber' ? 'bg-chart-1' : color === 'green' ? 'bg-chart-4 animate-pulse' : color === 'red' ? 'bg-destructive' : color === 'orange' ? 'bg-chart-1' : 'bg-primary'}`} />}</div><p className="text-[11px] text-muted-foreground mt-1 whitespace-nowrap">{label}</p></div>)}</div>
        <div className="rounded-lg border border-border/15 bg-secondary/[0.07] px-4 py-3 flex items-center gap-3 text-sm"><Sparkles size={16} className="text-foreground" /><span>Lulu AI is currently managing <strong className="text-foreground">18 active tasks</strong> across your business.</span><span className="ml-auto hidden sm:block text-xs text-foreground">Live system status <i className="inline-block ml-1 h-1.5 w-1.5 rounded-full bg-chart-4" /></span></div>
        <section className="rounded-xl border border-border/20 bg-gradient-to-r from-secondary/[0.10] to-transparent p-5 border-l-4 border-l-border"><div className="flex items-start gap-3"><div className="rounded-lg bg-secondary/15 p-2 text-foreground"><Sparkles size={18} /></div><div><div className="flex items-center gap-3"><h2 className="font-semibold text-foreground">AI Task Summary</h2><Badge tone="purple">✦ AI-generated</Badge></div><p className="mt-2 text-sm leading-6 text-muted-foreground">Four high-priority tasks require approval, while three AI tasks are currently executing. Two completed tasks produced measurable improvements and one task requires attention because the connected platform returned an error.</p></div></div></section>
        <div className="overflow-x-auto border-b border-border"><div className="flex gap-1 min-w-max">{tabs.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-3 text-xs font-medium border-b-2 ${activeTab === tab ? 'border-border text-foreground' : 'border-transparent text-foreground hover:text-foreground'}`}>{tab}</button>)}</div></div>
        <div className="flex flex-col xl:flex-row gap-3 justify-between"><div className="flex gap-2 flex-wrap">{filters.map(filter => <button key={filter} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-[var(--primary)] px-2.5 py-2 text-xs text-primary-foreground hover:border-border/40 hover:text-primary-foreground"><Filter size={12} />{filter}<ChevronDown size={12} /></button>)}</div><label className="flex items-center gap-2 text-xs text-muted-foreground">Sort by <select className="rounded-md border border-border bg-[var(--secondary)] px-2 py-2 text-foreground outline-none"><option>Priority</option><option>Due Date</option><option>Impact</option><option>Urgency</option></select></label></div>

        <section><div className="flex items-center gap-3 mb-3"><h2 className="text-lg font-semibold text-foreground">Pending Approval</h2><Badge tone="amber">4</Badge><span className="text-xs text-muted-foreground">Human review required before Lulu AI can execute</span></div><div className="rounded-xl border border-border bg-[var(--secondary)] overflow-x-auto"><table className="w-full min-w-[980px] text-left"><thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">Task</th><th>Source / Area</th><th>Priority</th><th>Proposed action</th><th>Impact / Risk</th><th className="pr-4">Actions</th></tr></thead><tbody>{approvals.map(row => <tr key={row[0]} className="border-b border-border last:border-0 hover:bg-secondary"><td className="px-4 py-4"><button onClick={() => {
                      setSelected(row[0]);
                      setShowDetail(true);
                    }} className="text-sm font-medium text-foreground hover:text-foreground text-left">{row[0]}</button><p className="text-[11px] text-muted-foreground mt-1">Permissions: {row[7]}</p></td><td><Badge tone={row[1] === 'AI Insight' ? 'indigo' : 'purple'}>{row[1]}</Badge><p className="text-xs text-muted-foreground mt-1">{row[2]}</p></td><td><Badge tone={priorityTone(row[3])}>{row[3]}</Badge></td><td className="text-xs text-muted-foreground max-w-[190px]">{row[4]}</td><td className="text-xs"><span className="text-chart-4">{row[5]}</span><p className="text-muted-foreground mt-1">Risk: {row[6]}</p></td><td className="pr-4"><div className="flex gap-1.5"><button onClick={() => setModal('approve')} className="rounded-md bg-chart-4/15 px-2.5 py-1.5 text-xs font-semibold text-chart-4 hover:bg-chart-4/25">Approve</button><button onClick={() => setModal('reject')} className="rounded-md border border-border px-2 py-1.5 text-xs text-muted-foreground">Reject</button><button onClick={() => {
                        setSelected(row[0]);
                        setShowDetail(true);
                      }} className="rounded-md border border-border px-2 py-1.5 text-xs text-foreground">Review</button></div></td></tr>)}</tbody></table></div></section>

        <section><div className="flex items-center justify-between mb-3"><div><h2 className="text-lg font-semibold text-foreground">Active Tasks</h2><p className="text-xs text-muted-foreground mt-1">Tasks currently being managed across your business</p></div><button className="text-xs text-foreground hover:text-foreground">View all tasks <ArrowRight size={13} className="inline ml-1" /></button></div><div className="rounded-xl border border-border bg-[var(--secondary)] overflow-x-auto"><table className="w-full min-w-[1100px] text-left"><thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">Task</th><th>Source</th><th>Business Area</th><th>Priority</th><th>Status</th><th>Owner</th><th>AI / Human</th><th>Due</th><th>Progress</th><th>Actions</th></tr></thead><tbody>{tasks.map(task => <tr key={task.id} className={`border-b border-border last:border-0 hover:bg-secondary ${task.due.includes('overdue') ? 'border-l-2 border-l-chart-5' : ''}`}><td className="px-4 py-3.5"><button onClick={() => {
                      setSelected(task.name);
                      setShowDetail(task.id === 'ads' || task.id === 'conversion');
                    }} className="text-sm text-foreground hover:text-foreground text-left">{task.name}</button></td><td><Badge tone={task.source.includes('Recommendation') ? 'purple' : task.source === 'AI Insight' ? 'indigo' : 'teal'}>{task.source}</Badge></td><td className="text-xs text-muted-foreground">{task.area}</td><td><Badge tone={priorityTone(task.priority)}>{task.priority}</Badge></td><td><Badge tone={statusTone(task.status)} pulse={task.status === 'Executing'}>{task.status}</Badge></td><td className="text-xs text-muted-foreground">{task.owner}</td><td className="text-xs text-muted-foreground">{task.mode}</td><td className={`text-xs ${task.due.includes('overdue') ? 'text-chart-5' : 'text-muted-foreground'}`}>{task.due}</td><td className="w-28">{task.progress ? <div className="flex items-center gap-2"><div className="h-1.5 flex-1 rounded-full bg-card"><div className="h-full rounded-full bg-primary text-primary-foreground" style={{
                          width: `${task.progress}%`
                        }} /></div><span className="text-[10px] text-muted-foreground">{task.progress}%</span></div> : task.status === 'Executing' ? <span className="text-[11px] text-foreground">Live</span> : <span className="text-muted-foreground">—</span>}</td><td><div className="flex gap-1"><button onClick={() => notify(`Opened ${task.name}`)} className="text-xs text-foreground hover:text-foreground">Open</button>{task.status === 'Awaiting Approval' ? <button onClick={() => setModal('approve')} className="text-xs text-chart-4">Approve</button> : task.status === 'Executing' || task.status === 'In Progress' ? <button onClick={() => setModal('pause')} className="text-xs text-foreground">Pause</button> : <button onClick={() => notify('Task action menu opened')} aria-label="More task actions"><MoreHorizontal size={15} className="text-muted-foreground" /></button>}</div></td></tr>)}</tbody></table></div></section>

        {showDetail && <section className="rounded-xl border border-border/20 bg-[var(--card)] overflow-hidden"><div className="p-5 border-b border-border flex flex-col md:flex-row md:items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2 mb-2"><Badge tone="purple">AI Recommendation</Badge><Badge tone="amber">High</Badge><Badge tone="amber">Awaiting Approval</Badge></div><h2 className="text-xl font-semibold text-foreground">{selected === 'Optimize underperforming Google Ads campaigns' ? selected : 'Optimize Underperforming Advertising Campaigns'}</h2><p className="text-xs text-muted-foreground mt-2">Advertising · Owner: Lulu AI · Created today at 08:44</p></div><button onClick={() => setShowDetail(false)} className="text-foreground hover:text-foreground" aria-label="Collapse detail"><X size={18} /></button></div><div className="p-5 space-y-6"><div><p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Execution Responsibility</p><div className="flex flex-wrap items-center gap-2"><Badge tone="purple">AI Analyzes</Badge><ArrowRight size={14} className="text-muted-foreground" /><Badge tone="amber">Human Approves</Badge><ArrowRight size={14} className="text-muted-foreground" /><Badge tone="green">AI Executes</Badge></div></div><div className="grid lg:grid-cols-[1.25fr_1fr] gap-8"><div className="space-y-5"><div><h3 className="text-sm font-semibold text-foreground mb-2">Description</h3><p className="text-sm leading-6 text-muted-foreground">Lulu AI identified 3 Google Ads campaigns with declining ROAS and increasing CPA over the past 6 weeks. This task will analyze campaign performance, generate an optimization proposal, and — upon approval — apply the recommended budget changes.</p></div><div><h3 className="text-sm font-semibold text-foreground mb-2">Objective</h3><p className="text-sm text-muted-foreground">Reduce inefficient advertising spend while preserving conversion volume.</p><p className="text-xs text-foreground mt-2">Related business goal: Reduce Costs · Improve Marketing Performance</p></div><div><h3 className="text-sm font-semibold text-foreground mb-3">Success Criteria</h3><ul className="space-y-2 text-sm text-muted-foreground">{[['Reduce CPA by ≥15%', 'Target — not yet Observed'], ['Maintain conversion volume within ±5%', 'Target — not yet Observed'], ['Improve ROAS from 1.8x to ≥2.4x', 'Target — not yet Observed'], ['Apply changes within approved budget', 'Target — not yet Observed']].map(item => <li key={item[0]} className="flex items-center justify-between gap-3 border-b border-border pb-2"><span>{item[0]}</span><Badge tone="amber">{item[1]}</Badge></li>)}</ul></div></div><div className="space-y-5"><div><h3 className="text-sm font-semibold text-foreground mb-3">AI Action Plan</h3><ol className="space-y-2.5">{[['01', 'Identify underperforming campaigns', 'Completed'], ['02', 'Analyze attribution and conversion data', 'Completed'], ['03', 'Compare audience performance', 'Completed'], ['04', 'Generate optimization proposal', 'Completed'], ['05', 'Request approval', 'Awaiting Approval'], ['06', 'Apply approved changes', 'Pending'], ['07', 'Monitor results (7 days)', 'Pending']].map(step => <li key={step[0]} className="flex items-center gap-3 text-xs"><span className="font-mono text-muted-foreground">{step[0]}</span><span className={step[2] === 'Completed' ? 'text-foreground' : step[2] === 'Awaiting Approval' ? 'text-chart-1' : 'text-muted-foreground'}>{step[1]}</span><span className="ml-auto">{step[2] === 'Completed' ? <Check size={14} className="text-chart-4" /> : step[2] === 'Awaiting Approval' ? '⏳' : '○'}</span></li>)}</ol></div><div><h3 className="text-sm font-semibold text-foreground mb-3">Dependencies</h3><div className="space-y-2 text-xs text-muted-foreground"><p><Check size={13} className="inline text-chart-4 mr-2" />Google Ads API connection: Connected</p><p><Check size={13} className="inline text-chart-4 mr-2" />Write permissions: Authorized</p><p><Check size={13} className="inline text-chart-4 mr-2" />Budget approval policy: Active</p><p className="text-foreground">Related Recommendation: Reduce Inefficient Paid Acquisition Spend ↗</p></div></div><p className="text-xs text-muted-foreground">Schedule: <span className="text-foreground">Immediate upon approval</span></p></div></div></div></section>}

        <section><div className="flex items-center justify-between mb-3"><div><h2 className="text-lg font-semibold text-foreground">AI Execution</h2><p className="text-xs text-muted-foreground mt-1">Live view of tasks actively executing</p></div><Badge tone="green" pulse>3 live</Badge></div><div className="grid lg:grid-cols-3 gap-3">{[['Monitor Customer Acquisition Cost', 'Monitoring advertising + CRM data', 'Google Ads + CRM', '09:15', 'Continuous monitoring'], ['Analyze Google Ads Campaign Efficiency', 'Processing campaign performance data', 'Google Ads', '09:42', 'Comparing attribution data'], ['Analyze Declining Conversion Rates', 'Cross-referencing ecommerce + analytics', 'Shopify + GA4', '09:28', 'Generating analysis report']].map((card, n) => <article key={card[0]} className="rounded-xl border border-border bg-[var(--card)] p-4"><div className="flex justify-between gap-2"><h3 className="text-sm font-medium text-foreground">{card[0]}</h3><Badge tone={n === 0 ? 'green' : 'indigo'} pulse={n === 0}>{n === 0 ? 'Executing' : 'In Progress'}</Badge></div><p className="text-xs text-muted-foreground mt-3">{card[1]}</p><div className="mt-4 grid grid-cols-2 gap-3 text-xs"><span className="text-muted-foreground">Platform <strong className="block text-foreground font-normal mt-1">{card[2]}</strong></span><span className="text-muted-foreground">Started <strong className="block text-foreground font-normal mt-1">{card[3]}</strong></span></div>{n > 0 && <div className="mt-4"><div className="flex justify-between text-[11px] text-muted-foreground mb-1"><span>Progress</span><span>{n === 1 ? '40%' : '60%'}</span></div><div className="h-1.5 rounded-full bg-card"><div className="h-full rounded-full bg-primary text-primary-foreground" style={{
                    width: n === 1 ? '40%' : '60%'
                  }} /></div></div>}<p className="mt-4 text-[11px] text-foreground">{card[4]}</p></article>)}</div></section>

        <div className="grid xl:grid-cols-2 gap-5"><section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex justify-between items-center mb-5"><h2 className="text-lg font-semibold text-foreground">Execution Log</h2><History size={16} className="text-muted-foreground" /></div><div className="space-y-4">{logs.map(log => <div key={log[0]} className="flex gap-3"><div className="flex flex-col items-center"><div className="h-2 w-2 rounded-full bg-primary mt-1.5 text-primary-foreground" /><div className="w-px h-full bg-secondary mt-1" /></div><div className="flex-1 pb-1"><div className="flex flex-wrap gap-x-3 text-xs"><time className="text-muted-foreground">{log[0]}</time><Badge tone="purple">Lulu AI</Badge><span className="text-foreground">{log[1]}</span></div><p className="text-[11px] text-muted-foreground mt-1">{log[2]} · <span className="text-foreground">✓ {log[3]}</span></p></div></div>)}</div><p className="text-xs text-foreground mt-3 pl-5">[Awaiting user approval]</p></section><section className="rounded-xl border border-border bg-[var(--card)] p-5"><h2 className="text-lg font-semibold text-foreground mb-5">Execution Result</h2><div className="flex justify-between items-start gap-3"><div><p className="text-sm text-foreground">Paused 3 campaigns, reallocated budget</p><p className="text-xs text-muted-foreground mt-1">Google Ads · Yesterday 14:22</p></div><Badge tone="green">✓ AI Executed</Badge></div><div className="mt-5 rounded-lg border border-border overflow-hidden"><div className="grid grid-cols-3 bg-secondary px-3 py-2 text-[10px] uppercase text-muted-foreground"><span>Metric</span><span>Before → After</span><span>Result</span></div>{[['CPA', '$42.10 → $31.80', 'Observed Result'], ['ROAS', '1.8x → 2.3x', 'Observed Result'], ['Est. Monthly Savings', '$1,800', 'Estimated Result']].map(result => <div key={result[0]} className="grid grid-cols-3 px-3 py-3 text-xs border-t border-border items-center"><span className="text-muted-foreground">{result[0]}</span><span className="text-foreground">{result[1]}</span><Badge tone={result[2] === 'Observed Result' ? 'teal' : 'amber'}>{result[2]}</Badge></div>)}</div><div className="mt-4 rounded-lg bg-secondary/[0.07] p-3 text-xs text-foreground">Changes made: Budget shifted from Campaign A / B / C → Campaign D</div></section></div>

        <section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex items-center justify-between mb-5"><div><h2 className="text-lg font-semibold text-foreground">AI Task Prioritization</h2><p className="text-xs text-muted-foreground mt-1">Focus the team on the work with the clearest path to impact.</p></div><select className="rounded-md border border-border bg-[var(--secondary)] px-2 py-2 text-xs text-foreground"><option>Highest Impact</option><option>Highest Urgency</option><option>Lowest Effort</option><option>Deadline</option><option>Strategic Relevance</option><option>Execution Readiness</option></select></div><div className="flex gap-2 flex-wrap mb-4">{['Highest Impact', 'Highest Urgency', 'Lowest Effort', 'Deadline', 'Strategic Relevance', 'Execution Readiness'].map(item => <button key={item} onClick={() => notify(`Sorted by ${item}`)} className="rounded-md border border-border px-3 py-2 text-xs text-foreground hover:text-foreground hover:border-border/40">{item}</button>)}</div><p className="border-l-2 border-border pl-3 text-sm text-foreground"><Sparkles size={14} className="inline text-foreground mr-2" />Task A should be prioritized because it has high expected business impact and requires minimal implementation effort.</p><p className="text-[11px] text-muted-foreground mt-3">Prioritization is based on business impact, urgency, execution readiness, and strategic alignment.</p></section>

        <div className="grid xl:grid-cols-2 gap-5"><section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-foreground">Automated Task Rules</h2><button onClick={() => setModal('create')} className="text-xs text-foreground"><Plus size={13} className="inline mr-1" />Add rule</button></div>{[['CAC exceeds $50 threshold', 'Create investigation task', 'Daily check'], ['Revenue anomaly detected', 'Create analysis task', 'Real-time'], ['Campaign ROAS drops below 1.5x', 'Create optimization task', 'Every 6 hrs']].map(rule => <div key={rule[0]} className="grid grid-cols-[1.2fr_1fr_auto] gap-3 items-center border-t border-border py-3 text-xs"><span className="text-foreground">When <strong className="text-foreground">{rule[0]}</strong></span><span className="text-muted-foreground">{rule[1]}<small className="block text-muted-foreground mt-1">{rule[2]}</small></span><Badge tone="green">Active</Badge></div>)}</section><section className="rounded-xl border border-border bg-[var(--card)] p-5"><h2 className="text-lg font-semibold text-foreground mb-4">Task Outcome</h2><div className="flex items-center justify-between gap-1 text-[10px] text-muted-foreground">{['Execution', 'Business Result', 'KPI Change', 'Outcome', 'Evaluation Period'].map((label, i) => <div key={label} className="flex items-center gap-1"><div><div className={`h-7 w-7 rounded-full flex items-center justify-center ${i < 4 ? 'bg-secondary/15 text-foreground' : 'bg-secondary/15 text-foreground'}`}>{i < 4 ? <Check size={13} /> : <Clock3 size={13} />}</div><span className="block mt-2">{label}</span></div>{i < 4 && <ArrowRight size={12} className="text-foreground mb-5" />}</div>)}</div><div className="mt-5 flex items-center justify-between rounded-lg bg-chart-4/[0.07] px-3 py-2 text-xs"><span className="text-chart-4">Outcome status: Positive</span><span className="text-muted-foreground">7-day monitoring period</span></div><p className="text-[11px] text-muted-foreground mt-3">Correlation observed. Causality not confirmed.</p></section></div>

        <section className="rounded-xl border border-border/20 bg-gradient-to-br from-secondary/10 to-[var(--card)] p-6"><div className="flex items-start gap-3"><div className="rounded-xl bg-secondary/15 p-3 text-foreground"><MessageSquare size={20} /></div><div className="flex-1"><h2 className="text-xl font-semibold text-foreground">Ask Lulu AI</h2><p className="text-xs text-muted-foreground mt-1">Get a clear answer or turn a business question into an executable task.</p><div className="relative mt-4"><input onKeyDown={e => e.key === 'Enter' && notify('Lulu AI is preparing an answer')} className="w-full rounded-lg border border-border bg-[var(--secondary)] py-3 pl-4 pr-12 text-sm outline-none placeholder:text-muted-foreground focus:border-border/60" placeholder="Ask Lulu AI about your tasks..." /><button onClick={() => notify('Lulu AI is preparing an answer')} className="absolute right-2 top-2 rounded-md bg-primary p-1.5 text-primary-foreground"><ArrowRight size={16} /></button></div><div className="flex gap-2 flex-wrap mt-3">{['What tasks need my attention?', 'Which tasks should I approve?', 'What is Lulu AI executing?', 'Which tasks are blocked?', 'What did Lulu AI complete today?', 'Create a task to analyze revenue decline'].map(prompt => <button key={prompt} onClick={() => notify(prompt)} className="rounded-full border border-border px-3 py-1.5 text-[11px] text-foreground hover:border-border/40 hover:text-foreground">{prompt}</button>)}</div></div></div></section>

        <div className="grid xl:grid-cols-2 gap-5"><section className="rounded-xl border border-border bg-[var(--card)] p-5"><h2 className="text-lg font-semibold text-foreground mb-4">Task Sources</h2>{sources.map(source => <div key={source[0]} className="flex items-center justify-between border-t border-border py-2.5 text-xs"><span className="flex items-center gap-2 text-foreground"><Cloud size={13} className="text-muted-foreground" />{source[0]}</span><span className="text-muted-foreground">Last sync: {source[1]}</span><Badge tone={source[2] === 'Ready' ? 'green' : 'amber'}>{source[2] === 'Ready' ? '✓ Ready' : '⚠ Limited'}</Badge></div>)}</section><section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex justify-between items-center mb-4"><h2 className="text-lg font-semibold text-foreground">Task Execution Health</h2><Badge tone="green">✓ Ready</Badge></div>{[['Integration Status', 'Ready'], ['API Status', 'Ready'], ['Permissions', 'Authorized'], ['Data Freshness', 'Good'], ['Platform Availability', 'Online'], ['AI Execution Permissions', 'Active']].map(item => <div key={item[0]} className="flex items-center justify-between border-t border-border py-2 text-xs"><span className="text-muted-foreground">{item[0]}</span><span className="text-chart-4"><i className="inline-block h-1.5 w-1.5 rounded-full bg-primary mr-2 text-primary-foreground" />{item[1]}</span></div>)}<p className="mt-3 text-[11px] text-chart-1">1 warning · Finance data freshness</p></section></div>

        <section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex justify-between items-center mb-4"><h2 className="text-lg font-semibold text-foreground">Saved Tasks</h2><button className="text-xs text-foreground">View all</button></div><div className="flex flex-wrap gap-3"><article className="rounded-lg border border-border bg-[var(--card)] p-3 min-w-[250px]"><p className="text-sm text-foreground">Monitor advertising efficiency for 7 days</p><div className="flex gap-3 mt-3 text-xs text-muted-foreground"><button onClick={() => notify('Task opened')}>Open</button><button onClick={() => notify('Added to favorites')}><Heart size={13} className="inline mr-1" />Favorite</button><button onClick={() => notify('Share link copied')}><Share2 size={13} className="inline mr-1" />Share</button></div></article><article className="rounded-lg border border-border bg-[var(--card)] p-3 min-w-[250px]"><p className="text-sm text-foreground">Create monthly executive report</p><div className="flex gap-3 mt-3 text-xs text-muted-foreground"><button onClick={() => notify('Task opened')}>Open</button><button onClick={() => notify('Removed from saved tasks')}><Trash2 size={13} className="inline mr-1" />Remove</button></div></article></div></section>
      </div>
    </section>
    {toast && <div role="status" className="fixed bottom-5 right-5 z-50 rounded-lg border border-border/30 bg-[var(--secondary)] px-4 py-3 text-sm text-foreground shadow-2xl">{toast}</div>}
    {modal && <div className="fixed inset-0 z-40 bg-primary/60 flex items-center justify-center p-4" role="presentation"><div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-[var(--secondary)] shadow-2xl"><div className="flex items-center justify-between border-b border-border px-5 py-4"><h2 id="modal-title" className="text-lg font-semibold text-foreground">{modal === 'approve' ? 'Approve AI Task' : modal === 'reject' ? 'Reject AI Task' : modal === 'pause' ? 'Pause Task' : modal === 'cancel' ? 'Cancel Task' : modal === 'retry' ? 'Retry Task' : 'Create AI Task'}</h2><button onClick={() => setModal(null)} aria-label="Close dialog" className="text-foreground hover:text-foreground"><X size={18} /></button></div><div className="p-5 space-y-4">{modal === 'create' ? <div className="space-y-4"><div className="flex gap-1 rounded-lg bg-[var(--secondary)] p-1"><button className="flex-1 rounded-md bg-secondary/20 py-2 text-xs text-foreground">Create task</button><button className="flex-1 py-2 text-xs text-foreground">Create with Lulu AI</button></div>{['Task name', 'Description', 'Business area', 'Source', 'Priority', 'Owner', 'Due date', 'Success Criteria'].map(field => <label key={field} className="block text-xs text-muted-foreground">{field}<input className="mt-1.5 w-full rounded-md border border-border bg-[var(--secondary)] px-3 py-2.5 text-sm text-foreground outline-none focus:border-border/60" placeholder={field === 'Description' ? 'Describe the desired outcome...' : `Enter ${field.toLowerCase()}`} /></label>)}<div className="flex items-center justify-between rounded-lg border border-border px-3 py-3 text-xs"><span>AI execution permission</span><div className="h-5 w-9 rounded-full bg-primary p-0.5 text-primary-foreground"><div className="h-4 w-4 ml-4 rounded-full bg-card" /></div></div></div> : modal === 'reject' ? <div><p className="text-sm text-foreground mb-4">Why are you rejecting this task?</p><div className="grid sm:grid-cols-2 gap-2">{['Not relevant', 'Incorrect', 'Already completed', 'Not feasible', 'Too risky', 'Not a priority', 'Other'].map(reason => <label key={reason} className="flex gap-2 rounded-md border border-border p-2.5 text-xs text-muted-foreground"><input type="radio" name="reason" />{reason}</label>)}</div><textarea className="mt-4 min-h-24 w-full rounded-md border border-border bg-[var(--secondary)] p-3 text-sm outline-none" placeholder="Add comment (optional)" /></div> : modal === 'pause' ? <p className="text-sm leading-6 text-muted-foreground">AI execution will stop until the task is resumed.</p> : modal === 'cancel' ? <div className="space-y-3 text-sm text-muted-foreground"><p>Current status: <span className="text-foreground">In Progress</span></p><p>Potential consequences: Active monitoring and scheduled steps will stop.</p><p>Dependencies affected: Google Ads connection and the 7-day outcome tracker.</p></div> : modal === 'retry' ? <div className="space-y-3 text-sm text-muted-foreground"><p>Failure Reason: <span className="text-chart-5">API rate limit exceeded — Google Ads</span></p><p>Connected System: Google Ads</p><p>Last Attempt: Today 07:12</p><p>Recommended Fix: Wait 15 min then retry</p></div> : <div className="space-y-3 text-sm text-muted-foreground"><p>Task: <span className="text-foreground">Optimize Underperforming Advertising Campaigns</span></p><p>Proposed Action: Pause 3 campaigns, reallocate $4,200 to top-performing campaigns</p><p>Target: Google Ads — 3 campaigns</p><p>Expected Impact: <span className="text-chart-4">Estimated -$1,800/mo CPA · +0.6x ROAS improvement</span></p><p>Potential Risks: Low — no budget increase, approved reallocation only</p><p>Permissions: <span className="text-chart-4">Google Ads Campaign Management — Authorized</span></p><p className="text-foreground">Related Recommendation ↗</p></div>}<div className="flex justify-end gap-2 pt-3 border-t border-border"><button onClick={() => setModal(null)} className="rounded-lg border border-border px-4 py-2.5 text-sm text-foreground">{modal === 'pause' ? 'Cancel' : modal === 'cancel' ? 'Keep Task' : modal === 'retry' ? 'Edit Task' : 'Cancel'}</button><button onClick={() => action(modal === 'approve' ? 'Task approved and queued for execution' : modal === 'reject' ? 'Task rejected' : modal === 'pause' ? 'Task paused' : modal === 'cancel' ? 'Task cancelled' : modal === 'retry' ? 'Retry scheduled' : 'Task created successfully')} className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground ${modal === 'reject' || modal === 'cancel' ? 'bg-destructive hover:bg-destructive' : modal === 'pause' ? 'bg-primary hover:bg-primary' : 'bg-gradient-to-r from-primary to-primary hover:brightness-110'}`}>{modal === 'approve' ? 'Approve Task' : modal === 'reject' ? 'Reject Task' : modal === 'pause' ? 'Pause' : modal === 'cancel' ? 'Cancel Task' : modal === 'retry' ? 'Retry' : 'Create Task'}</button></div></div></div></div>}
  </main>;
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
