import { useState, type ReactNode } from 'react';
import { Activity, ArrowRight, Brain, Building2, Check, CheckSquare, ChevronDown, CircleDollarSign, Download, GitBranch, Layers, Menu, Plus, Search, Settings, Sparkles, Upload, User, UserPlus, Users, X } from 'lucide-react';
type IconType = typeof Users;
type TaskItem = {
  title: string;
  entity: string;
  owner: string;
  due: string;
  status: string;
  priority: 'critical' | 'high' | 'medium';
};
const navigation: {
  label: string;
  icon: IconType;
}[] = [{
  label: 'CRM',
  icon: Users
}, {
  label: 'Contacts',
  icon: User
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
  icon: CheckSquare
}, {
  label: 'Customer Segments',
  icon: Layers
}, {
  label: 'Customer Intelligence',
  icon: Brain
}];
const stages = [{
  name: 'New',
  deals: 42,
  value: '€128,400',
  width: '70%',
  color: 'bg-primary'
}, {
  name: 'Qualified',
  deals: 38,
  value: '€96,200',
  width: '56%',
  color: 'bg-primary'
}, {
  name: 'Proposal',
  deals: 31,
  value: '€124,800',
  width: '67%',
  color: 'bg-primary'
}, {
  name: 'Negotiation',
  deals: 22,
  value: '€94,600',
  width: '51%',
  color: 'bg-primary'
}, {
  name: 'Won',
  deals: 18,
  value: '€184,200',
  width: '88%',
  color: 'bg-primary'
}, {
  name: 'Lost',
  deals: 12,
  value: '€38,400',
  width: '34%',
  color: 'bg-destructive'
}];
const activities = [{
  title: 'Contact created',
  desc: 'Maria Santos added',
  time: '5 min ago',
  color: 'violet',
  icon: UserPlus
}, {
  title: 'Deal stage changed',
  desc: 'Acme Corp deal moved to Negotiation',
  time: '14 min ago',
  color: 'amber',
  icon: GitBranch
}, {
  title: 'Meeting completed',
  desc: 'Discovery call with TechVision logged',
  time: '32 min ago',
  color: 'emerald',
  icon: Check
}, {
  title: 'Lead created',
  desc: 'New lead from website form',
  time: '1 hour ago',
  color: 'violet',
  icon: UserPlus
}, {
  title: 'Email logged',
  desc: 'Follow-up sent to GlobalTech',
  time: '2 hours ago',
  color: 'blue',
  icon: Activity
}, {
  title: 'Task completed',
  desc: 'Contract review finished',
  time: '3 hours ago',
  color: 'emerald',
  icon: Check
}];
const tasks: TaskItem[] = [{
  title: 'Review Acme expansion proposal',
  entity: 'Acme Corp',
  owner: 'SJ',
  due: 'Today, 10:00',
  status: 'Overdue',
  priority: 'critical'
}, {
  title: 'Follow up with TechVision',
  entity: 'TechVision Inc',
  owner: 'MK',
  due: 'Today, 14:30',
  status: 'Due today',
  priority: 'high'
}, {
  title: 'Send renewal brief',
  entity: 'GlobalTech',
  owner: 'DR',
  due: 'Today, 16:00',
  status: 'Due today',
  priority: 'high'
}, {
  title: 'Prepare Q4 account review',
  entity: 'Northstar',
  owner: 'JD',
  due: 'Tomorrow',
  status: 'Upcoming',
  priority: 'medium'
}, {
  title: 'Update lead qualification notes',
  entity: 'Lumen Labs',
  owner: 'AN',
  due: 'Tomorrow',
  status: 'Upcoming',
  priority: 'medium'
}];
const segments = [['High Value Customers', '284', '€2.4M', 'up'], ['New Customers', '428', '€184K', 'up'], ['Returning Customers', '1,842', '', 'up'], ['At Risk', '94', '', 'down'], ['Dormant', '186', '', 'flat'], ['Enterprise', '42', '€1.2M', 'up'], ['High Growth Potential', '128', '', 'ai']];
const insights = [{
  title: 'High-Value Customer Opportunity',
  text: 'Four accounts have reached the engagement threshold for an expansion conversation.',
  confidence: '89%',
  time: '12 min ago',
  action: 'View Opportunity',
  tone: 'violet'
}, {
  title: 'Pipeline Risk',
  text: '3 deals have no recorded activity for more than 14 days and may need an intervention.',
  confidence: '94%',
  time: '28 min ago',
  action: 'Review Deals',
  tone: 'amber'
}, {
  title: 'Lead Conversion Signal',
  text: 'Organic search leads are converting 34% better than the current channel average.',
  confidence: '82%',
  time: '1 hour ago',
  action: 'View Leads',
  tone: 'violet'
}];
const priorityRows = [['Critical', 'Deal: Acme Corp Expansion (€84K)', 'No activity 18 days', 'Sarah', 'Review Deal'], ['High', 'Lead: TechVision Inc', 'Score 94, not contacted', 'Mark', 'Contact Now'], ['High', 'Customer: GlobalTech Solutions', 'Declining engagement', 'David', 'Review Account'], ['Medium', 'Task: Q4 contract renewals', 'Due today', 'Anna', 'Open Task'], ['Medium', 'Deal: Innovation Labs (€42K)', 'Proposal overdue', 'James', 'Send Follow-up']];
function Sidebar({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  return <aside className={`${open ? 'flex' : 'hidden'} lg:flex fixed z-20 inset-y-0 left-0 w-60 flex-col border-r border-border bg-[var(--sidebar)] p-4`}>
    <div className="flex items-center justify-between px-2 py-3"><div className="flex items-center gap-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">L</div><span className="font-semibold text-foreground">Lulu AI</span></div><button onClick={onClose} className="lg:hidden text-foreground" aria-label="Close navigation"><X size={18} /></button></div>
    <p className="mb-3 mt-8 px-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Workspace</p>
    <LuluSectionNavigation activeId="bright-meadow-7537" />
    <div className="my-5 border-t border-border" /><button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:text-foreground"><Settings size={17} /><span>Settings</span></button>
    <div className="mt-auto border-t border-border pt-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-card text-xs font-semibold text-foreground">JD</div><div><p className="text-sm font-medium text-foreground">Jordan Davis</p><p className="text-xs text-muted-foreground">CRM Manager</p></div></div><div className="mt-4 flex items-center gap-2 text-xs text-chart-4"><span className="h-2 w-2 rounded-full bg-chart-4" />AI Active</div></div>
  </aside>;
}
function Panel({
  title,
  eyebrow,
  children,
  className = ''
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}) {
  return <section className={`rounded-xl border border-border bg-[var(--card)] p-5 transition hover:border-border ${className}`}><div className="mb-5 flex items-start justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{eyebrow}</p><h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">{title}</h2></div></div>{children}</section>;
}
export function LuluCrmPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);
  const [tab, setTab] = useState('Due Today');
  const [isLoading] = useState(false);
  const [isEmpty] = useState(false);
  const [hasError] = useState(false);
  const toggleFilter = (filter: string) => setFilters(filters.includes(filter) ? filters.filter(item => item !== filter) : [...filters, filter]);
  const filterLabels = ['Owner', 'Status', 'Stage', 'Date Range', 'Segment', 'Lead Source'];
  return <div className="min-h-screen bg-[var(--background)] font-sans text-foreground">
    <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
    <main className="lg:ml-60"><div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
      <header className="mb-8"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground">Lulu AI / CRM</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">CRM</h1><p className="mt-2 max-w-xl text-sm text-muted-foreground">Manage your customer relationships, sales pipeline and customer intelligence in one place.</p></div><div className="flex items-center gap-2"><button onClick={() => setMenuOpen(true)} className="rounded-lg border border-border p-2 text-foreground lg:hidden" aria-label="Open navigation"><Menu size={20} /></button><button className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground transition hover:border-border hover:text-foreground sm:flex"><Upload size={16} />Import</button><button className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground transition hover:border-border hover:text-foreground md:flex"><Download size={16} />Export</button><div className="relative"><button onClick={() => setCreateOpen(!createOpen)} className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Plus size={16} />Create<ChevronDown size={15} /></button>{createOpen && <div className="mt-2 w-48 rounded-lg border border-border bg-[var(--secondary)] p-1 shadow-2xl">{['New Contact', 'New Company', 'New Lead', 'New Deal', 'New Task', 'New Activity'].map(item => <button key={item} onClick={() => setCreateOpen(false)} className="block w-full rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-secondary/15 hover:text-foreground">{item}</button>)}</div>}</div></div></div><div className="mt-7 flex items-center gap-3 rounded-xl border border-border bg-[var(--secondary)] px-4 py-3"><Search size={18} className="text-muted-foreground" /><input aria-label="Search CRM" placeholder="Search CRM... (Contacts, Companies, Leads, Deals, Tasks)" className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" /></div><div className="mt-3 flex flex-wrap gap-2">{filterLabels.map(filter => <button key={filter} onClick={() => toggleFilter(filter)} className={`rounded-md border px-3 py-1.5 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${filters.includes(filter) ? 'border-border/50 bg-secondary/15 text-foreground' : 'border-border text-foreground hover:border-border hover:text-foreground'}`}>{filter}<ChevronDown size={12} className="ml-1 inline" /></button>)}</div></header>
      {isLoading ? <div className="grid grid-cols-2 gap-3 xl:grid-cols-6">{[1, 2, 3, 4, 5, 6].map(item => <div key={item} className="h-28 animate-pulse rounded-xl bg-[var(--secondary)]" />)}</div> : hasError ? <div className="rounded-xl border border-chart-5/20 bg-chart-5/10 p-12 text-center"><h2 className="text-xl font-semibold text-foreground">CRM Couldn't Be Loaded</h2><button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">Try Again</button></div> : isEmpty ? <div className="rounded-xl border border-border p-16 text-center"><h2 className="text-xl font-semibold text-foreground">Your CRM Is Ready</h2><p className="mt-2 text-muted-foreground">Create your first contact or import your customer data to get started.</p></div> : <div>
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">{[['Total Contacts', '12,482', '+8.4% vs previous period', 'emerald'], ['Companies', '1,284', '+4.2%', 'emerald'], ['Open Leads', '428', '+12.1%', 'emerald'], ['Open Deals', '186', '€482,400 pipeline value', 'violet'], ['Won Revenue', '€184,200', '+14.6%', 'emerald'], ['Tasks Due', '24', '7 overdue', 'rose']].map(([label, value, support, tone]) => <article key={label} className="rounded-xl border border-border bg-[var(--card)] p-4 transition hover:-translate-y-0.5 hover:border-border"><p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p><p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{value}</p><p className={`mt-1 text-xs ${tone === 'emerald' ? 'text-foreground' : tone === 'rose' ? 'text-chart-5' : 'text-foreground'}`}>{support}</p></article>)}</div>
        <div className="grid gap-6 xl:grid-cols-2"><Panel eyebrow="Overview" title="CRM Health"><div className="flex flex-col items-center gap-6 sm:flex-row"><div className="relative grid h-36 w-36 shrink-0 place-items-center"><svg className="col-start-1 row-start-1 h-full w-full -rotate-90" viewBox="0 0 120 120"><circle cx="60" cy="60" r="48" fill="none" stroke="var(--muted-foreground)" strokeWidth="10" /><circle cx="60" cy="60" r="48" fill="none" stroke="var(--chart-2)" strokeWidth="10" strokeDasharray="260 302" strokeLinecap="round" /></svg><div className="col-start-1 row-start-1 self-center text-center"><strong className="block text-3xl text-foreground">86</strong><span className="text-xs text-muted-foreground">/ 100</span></div></div><div className="w-full"><span className="inline-flex rounded-md bg-chart-4/10 px-2 py-1 text-xs text-chart-4">Healthy</span><p className="mt-3 text-xs text-muted-foreground">AI-calculated · Updated 4 min ago</p></div></div><div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4">{[['Contact Data Quality', '91', 'up'], ['Lead Activity', '84', 'up'], ['Pipeline Health', '88', 'up'], ['Deal Velocity', '79', 'flat'], ['Customer Engagement', '82', 'up'], ['Task Completion', '76', 'down']].map(([label, value, direction]) => <div key={label} className="flex items-center justify-between border-b border-border pb-2"><span className="text-xs text-muted-foreground">{label}</span><span className={`text-xs ${direction === 'down' ? 'text-foreground' : direction === 'flat' ? 'text-foreground' : 'text-foreground'}`}>{value} {direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→'}</span></div>)}</div></Panel>
          <Panel eyebrow="Sales performance" title="Pipeline Snapshot"><div className="space-y-4">{stages.map(stage => <div key={stage.name}><div className="mb-1.5 flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-foreground"><span className={`h-2 w-2 rounded-full ${stage.color}`} />{stage.name}<span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">{stage.deals}</span></span><span className="text-muted-foreground">{stage.value}</span></div><div className="h-1.5 rounded-full bg-secondary"><div className={`h-full rounded-full ${stage.color}`} style={{
                      width: stage.width
                    }} /></div></div>)}</div><button className="mt-6 flex items-center gap-2 text-sm font-medium text-foreground hover:text-foreground">Open Pipeline <ArrowRight size={15} /></button></Panel></div>
        <div className="mt-6 grid gap-6 xl:grid-cols-2"><Panel eyebrow="Lead performance" title="Lead Overview"><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[['New Leads', '94'], ['Qualified', '68'], ['Conversion Rate', '18.4%'], ['Requiring Attention', '24']].map(([label, value]) => <div key={label}><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold text-foreground">{value}</p></div>)}</div><div className="mt-6 space-y-3">{[['New', '94', '80%'], ['Contacted', '78', '66%'], ['Qualified', '68', '57%'], ['Nurturing', '52', '44%'], ['Converted', '84', '71%'], ['Lost', '52', '44%']].map(([label, value, width]) => <div key={label} className="flex items-center gap-3 text-xs"><span className="w-20 text-muted-foreground">{label}</span><div className="h-2 flex-1 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary text-primary-foreground" style={{
                      width
                    }} /></div><span className="w-6 text-right text-foreground">{value}</span></div>)}</div><button className="mt-5 text-sm font-medium text-foreground">View Leads <ArrowRight size={15} className="ml-1 inline" /></button></Panel>
          <Panel eyebrow="Revenue performance" title="Deal Overview"><div className="grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-3">{[['Open Deals', '186'], ['Pipeline Value', '€482,400'], ['Won Deals', '18 / €184,200'], ['Lost Deals', '12 / €38,400'], ['Avg Deal Value', '€26,800'], ['Avg Sales Cycle', '24 days']].map(([label, value], index) => <div key={label}><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-lg font-semibold text-foreground">{value}</p><div className="mt-2 flex items-end gap-0.5">{[3, 5, 4, 7, 6, 8, 9].map((height, bar) => <span key={bar} className={`w-1 rounded-t bg-violet-${index % 2 ? '400' : '500'}`} style={{
                      height: `${height * 2}px`
                    }} />)}</div></div>)}</div><button className="mt-5 text-sm font-medium text-foreground">View Deals <ArrowRight size={15} className="ml-1 inline" /></button></Panel></div>
        <div className="mt-6 grid gap-6 xl:grid-cols-2"><Panel eyebrow="Live feed" title="Recent Activity"><div className="space-y-4">{activities.map(item => {
                  const ActivityIcon = item.icon;
                  return <div key={item.title + item.time} className="flex gap-3"><div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-${item.color}-400/10 text-${item.color}-400`}><ActivityIcon size={15} /></div><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><p className="text-sm font-medium text-foreground">{item.title}</p><time className="shrink-0 text-xs text-muted-foreground">{item.time}</time></div><p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p></div></div>;
                })}</div><button className="mt-5 text-sm font-medium text-foreground">View All Activities <ArrowRight size={15} className="ml-1 inline" /></button></Panel>
          <Panel eyebrow="Your queue" title="Tasks"><div className="mb-4 flex gap-1 border-b border-border">{['Due Today (8)', 'Upcoming (16)', 'Overdue (7)', 'Completed'].map(label => <button key={label} onClick={() => setTab(label.split(' ')[0])} className={`border-b-2 px-2 pb-2 text-xs ${tab === label.split(' ')[0] ? 'border-border text-foreground' : 'border-transparent text-foreground'}`}>{label}</button>)}</div><div className="space-y-2">{tasks.map(task => <div key={task.title} className={`flex items-center gap-3 rounded-lg p-2.5 ${task.priority === 'critical' ? 'bg-chart-5/[0.07]' : 'bg-[var(--secondary)]'}`}><span className={`h-2 w-2 rounded-full ${task.priority === 'critical' ? 'bg-destructive' : task.priority === 'high' ? 'bg-primary' : 'bg-secondary'}`} /><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-foreground">{task.title}</p><span className="text-[11px] text-muted-foreground">{task.entity} · {task.owner}</span></div><time className="hidden text-[11px] text-muted-foreground sm:block">{task.due}</time><span className={`rounded-md px-2 py-1 text-[10px] ${task.status === 'Overdue' ? 'bg-chart-5/10 text-chart-5' : 'bg-secondary text-muted-foreground'}`}>{task.status}</span></div>)}</div><button className="mt-5 text-sm font-medium text-foreground">View All Tasks <ArrowRight size={15} className="ml-1 inline" /></button></Panel></div>
        <div className="mt-6 grid gap-6 xl:grid-cols-2"><Panel eyebrow="Audience" title="Customer Segments"><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{segments.map(([name, count, value, direction]) => <article key={name} className="rounded-lg border border-border bg-[var(--card)] p-3 transition hover:border-border"><p className="text-xs font-medium text-foreground">{name}</p><p className="mt-3 text-xl font-semibold text-foreground">{count}</p><p className="mt-1 text-[11px] text-muted-foreground">{value || 'Active segment'} <span className={direction === 'down' ? 'text-foreground' : direction === 'ai' ? 'text-foreground' : 'text-chart-4'}>{direction === 'down' ? '↓' : direction === 'flat' ? '→' : '↑'}</span></p></article>)}</div><button className="mt-5 text-sm font-medium text-foreground">View Segments <ArrowRight size={15} className="ml-1 inline" /></button></Panel>
          <Panel eyebrow="Customer intelligence" title="Customer Intelligence"><span className="inline-flex items-center gap-1 rounded-md bg-secondary/15 px-2 py-1 text-xs text-foreground"><Sparkles size={12} />AI Active</span><div className="mt-5 grid grid-cols-2 gap-4"><div><p className="text-xs text-muted-foreground">Customer Health</p><strong className="text-xl text-foreground">81/100</strong></div><div><p className="text-xs text-muted-foreground">Retention</p><strong className="text-xl text-foreground">84%</strong></div><div><p className="text-xs text-muted-foreground">Engagement</p><strong className="text-xl text-foreground">76%</strong></div><div><p className="text-xs text-muted-foreground">Churn Risk</p><strong className="text-xl text-chart-1">94 customers</strong></div></div><div className="mt-5 space-y-3">{[['28 customers showing increased engagement', 'AI Detected', '12 min ago', '91%'], ['12 enterprise accounts with declining activity', 'AI Insight', '35 min ago', '88%'], ['3 high-value expansion opportunities', 'AI Recommendation', '1 hr ago', '86%']].map(([text, badge, time, confidence]) => <div key={text} className="border-l-2 border-border/50 pl-3"><p className="text-sm text-foreground">{text}</p><p className="mt-1 text-[11px] text-muted-foreground"><span className="mr-2 rounded-md bg-secondary/15 px-1.5 py-0.5 text-foreground">{badge}</span>{time} · {confidence} confidence</p></div>)}</div><button className="mt-5 text-sm font-medium text-foreground">Open Customer Intelligence <ArrowRight size={15} className="ml-1 inline" /></button></Panel></div>
        <Panel eyebrow="AI-powered guidance" title="Lulu AI CRM Insights" className="mt-6"><div className="mb-4 flex items-center gap-2 text-foreground"><Sparkles size={18} /><span className="rounded-md bg-secondary/15 px-2 py-1 text-xs">AI Insight</span></div><div className="grid gap-3 md:grid-cols-3">{insights.map(insight => <article key={insight.title} className="rounded-lg border border-border bg-[var(--card)] p-4 transition hover:border-border"><div className="flex items-center justify-between"><span className="rounded-md bg-secondary/15 px-2 py-1 text-[10px] text-foreground">AI Insight</span><span className="text-xs text-muted-foreground">{insight.confidence}</span></div><h3 className="mt-4 text-sm font-semibold text-foreground">{insight.title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{insight.text}</p><div className="mt-4 flex items-center justify-between"><span className="text-[11px] text-muted-foreground">{insight.time}</span><button className={`text-xs font-medium ${insight.tone === 'amber' ? 'text-foreground' : 'text-foreground'}`}>{insight.action} <ArrowRight size={13} className="ml-1 inline" /></button></div></article>)}</div></Panel>
        <Panel eyebrow="Needs attention" title="Priority CRM Items" className="mt-6"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead><tr className="border-b border-border text-xs uppercase tracking-[0.12em] text-muted-foreground"><th className="pb-3 font-medium">Priority</th><th className="pb-3 font-medium">Entity</th><th className="pb-3 font-medium">Reason</th><th className="pb-3 font-medium">Owner</th><th className="pb-3 text-right font-medium">Action</th></tr></thead><tbody>{priorityRows.map(row => <tr key={row[1]} className="border-b border-border last:border-0"><td className="py-4"><span className={`rounded-md px-2 py-1 text-xs ${row[0] === 'Critical' ? 'bg-chart-5/10 text-chart-5' : row[0] === 'High' ? 'bg-secondary/10 text-foreground' : 'bg-secondary text-muted-foreground'}`}>{row[0]}</span></td><td className="py-4 font-medium text-foreground">{row[1]}</td><td className="py-4 text-muted-foreground">{row[2]}</td><td className="py-4 text-muted-foreground">{row[3]}</td><td className="py-4 text-right"><button className="text-xs font-medium text-foreground hover:text-foreground">{row[4]}</button></td></tr>)}</tbody></table></div></Panel>
        <Panel eyebrow="Data integrity" title="CRM Data Quality" className="mt-6 mb-10"><div className="flex flex-col gap-6 md:flex-row md:items-center"><div className="relative grid h-32 w-32 shrink-0 place-items-center"><svg className="col-start-1 row-start-1 h-full w-full -rotate-90" viewBox="0 0 120 120"><circle cx="60" cy="60" r="48" fill="none" stroke="var(--muted-foreground)" strokeWidth="10" /><circle cx="60" cy="60" r="48" fill="none" stroke="var(--foreground)" strokeWidth="10" strokeDasharray="278 302" strokeLinecap="round" /></svg><div className="col-start-1 row-start-1 self-center text-center"><strong className="block text-2xl text-foreground">92</strong><span className="text-xs text-muted-foreground">/ 100</span></div></div><div className="grid flex-1 gap-x-8 gap-y-3 sm:grid-cols-2">{[['Duplicate Records', '14', 'amber'], ['Missing Information', '284 contacts', 'amber'], ['Invalid Contact Information', '8', 'rose'], ['Incomplete Company Records', '42', 'amber'], ['Unassigned Leads', '18', 'amber'], ['Deals Without Activity', '24', 'amber']].map(([label, value, tone]) => <div key={label} className="flex justify-between border-b border-border pb-2 text-xs"><span className="text-muted-foreground">{label}</span><span className={tone === 'rose' ? 'text-chart-5' : 'text-foreground'}>{value}</span></div>)}</div><button className="flex shrink-0 items-center gap-2 text-sm font-medium text-foreground">Review Data Quality <ArrowRight size={15} /></button></div></Panel>
      </div>}
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
