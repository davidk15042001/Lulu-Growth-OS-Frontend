import { useState } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Bell, Check, ChevronDown, ChevronRight, CircleHelp, Clock3, Database, Download, Edit3, FileText, Filter, Gauge, GitBranch, LayoutDashboard, LineChart, Menu, MoreHorizontal, Plus, RefreshCw, Search, Settings, ShieldAlert, Sparkles, Target, TrendingUp, Users, X, Zap } from 'lucide-react';
type Tone = 'violet' | 'emerald' | 'amber' | 'red' | 'blue' | 'slate';
const navGroups = [{
  label: 'WORKSPACE',
  items: [['Dashboard', LayoutDashboard], ['Company Profile', FileText]]
}, {
  label: 'INTELLIGENCE',
  items: [['Executive Dashboard', Gauge], ['Analytics', LineChart], ['KPI Explorer', BarChart3], ['Comparisons', ArrowRight], ['Benchmarks', Target], ['Forecasts', TrendingUp], ['Trends', Activity], ['Anomalies', AlertTriangle], ['Reports', FileText]]
}, {
  label: 'AI',
  items: [['AI Assistant', Sparkles], ['AI Agents', Zap], ['AI Knowledge', Database], ['AI Actions', Check], ['AI Conversations', Bell]]
}, {
  label: 'CRM',
  items: [['Contacts', Users], ['Companies', Database], ['Leads', TrendingUp], ['Deals', Target], ['Pipeline', GitBranch]]
}, {
  label: 'MARKETING',
  items: [['Campaigns', BarChart3], ['SEO', Search], ['GEO', GlobeIcon], ['AEO', Sparkles], ['Marketing Analytics', LineChart]]
}, {
  label: 'ADVERTISING',
  items: [['Ad Campaigns', Target], ['Advertising Analytics', BarChart3]]
}, {
  label: 'SETTINGS',
  items: [['Integrations', GitBranch], ['Team', Users]]
}] as const;
function GlobeIcon(props: {
  size?: number;
}) {
  return <span className="text-[13px]" aria-hidden="true">◎</span>;
}
const stats: any[][] = [] as const;
const filters = ['All', 'Revenue', 'Customers', 'Sales', 'Marketing', 'Advertising', 'Ecommerce', 'Finance', 'Products'];
const library: any[][] = [];
const drivers: any[][] = [];
const risks: any[][] = [];
const opportunities: any[][] = [];
const recommendations: any[][] = [];
const sources: any[][] = [];
const history: any[][] = [];
const saved: any[][] = [];
const scenarios: any[][] = [];
const cls = 'border border-border bg-secondary rounded-xl';
const Badge = ({
  children,
  tone = 'violet'
}: {
  children: React.ReactNode;
  tone?: Tone;
}) => <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-medium ${tone === 'violet' ? 'bg-secondary/15 text-foreground' : tone === 'emerald' ? 'bg-secondary/15 text-foreground' : tone === 'amber' ? 'bg-chart-1/15 text-chart-1' : tone === 'red' ? 'bg-chart-5/15 text-chart-5' : tone === 'blue' ? 'bg-secondary/15 text-foreground' : 'bg-secondary/15 text-foreground'}`}>{children}</span>;
const Section = ({
  title,
  badge,
  children,
  action,
  className = ''
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) => <section className={`${cls} ${className}`}><div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4"><div className="flex items-center gap-2"><h2 className="text-sm font-semibold text-foreground">{title}</h2>{badge && <Badge>{badge}</Badge>}</div>{action}</div><div className="p-5">{children}</div></section>;
const Button = ({
  children,
  primary = false,
  icon,
  onClick
}: {
  children: React.ReactNode;
  primary?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}) => <button onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-ring/70 ${primary ? 'bg-primary text-primary-foreground hover:bg-primary' : 'border border-border bg-secondary text-foreground hover:bg-secondary hover:text-primary-foreground'}`}>{icon}{children}</button>;
const Chart = () => <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-border bg-[var(--secondary)] p-6 text-center text-sm text-muted-foreground" role="status">Forecast visualization appears after connected historical records are available.</div>;
export const LuluForecasts = () => {
  const [mobileNav, setMobileNav] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All');
  const [configOpen, setConfigOpen] = useState(true);
  const [methodOpen, setMethodOpen] = useState(true);
  const [scenarioOpen, setScenarioOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 800);
  };
  return <div className="min-h-screen bg-[var(--background)] text-foreground" style={{
    fontFamily: 'Inter, sans-serif'
  }}><aside className={`${mobileNav ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-30 w-60 flex-col border-r border-border bg-[var(--sidebar)] p-4 lg:flex`}><div className="mb-7 flex items-center gap-3 px-2"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground shadow-lg shadow-black/20">L</span><span className="text-lg font-semibold tracking-tight text-foreground">Lulu AI</span><button onClick={() => setMobileNav(false)} className="ml-auto lg:hidden"><X size={17} /></button></div><LuluSectionNavigation activeId="wispy-current-7490" /><div className="mt-4 border-t border-border pt-4"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/30 text-xs font-semibold text-foreground">AM</div><div><p className="text-xs font-medium text-foreground">Workspace member</p><p className="text-[11px] text-muted-foreground">Analyst</p></div><MoreHorizontal size={16} className="ml-auto text-muted-foreground" /></div></div></aside><main className="min-h-screen lg:pl-60"><div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8"><header className="mb-7"><div className="mb-4 flex items-center gap-3"><button onClick={() => setMobileNav(true)} className="rounded-md p-2 text-foreground hover:bg-secondary lg:hidden" aria-label="Open navigation"><Menu size={18} /></button><p className="text-xs text-muted-foreground">Intelligence <span className="mx-2 text-foreground">/</span> Analytics <span className="mx-2 text-foreground">/</span> <span className="text-foreground">Forecasts</span></p></div><div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Forecasts</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Use AI-powered forecasting to understand where your business may be heading and prepare for what comes next.</p></div><div className="flex flex-wrap gap-2"><Button primary icon={<Sparkles size={14} />}>Ask Lulu AI</Button><Button primary icon={<Plus size={14} />}>Create Forecast</Button><Button icon={<Download size={14} />}>Export</Button><button onClick={refresh} className="rounded-lg border border-border bg-secondary p-2 text-foreground hover:text-foreground" aria-label="Refresh forecasts"><RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /></button></div></div></header>
<Section title="Forecast Overview" className="mb-5"><div className="grid grid-cols-2 gap-3 xl:grid-cols-5">{stats.map(([label, value, tone, change]) => <div key={label} className="rounded-lg border border-border bg-[var(--secondary)] p-4"><div className="mb-4 flex items-center justify-between"><span className={`h-2 w-2 rounded-full ${tone === 'emerald' ? 'bg-primary' : tone === 'red' ? 'bg-destructive' : tone === 'amber' ? 'bg-chart-1' : tone === 'violet' ? 'bg-primary' : 'bg-primary'}`} /><span className="text-[10px] text-muted-foreground">{change}</span></div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold text-foreground">{value}</p></div>)}</div></Section>
<Section title="Forecast Library" action={<Button primary icon={<Plus size={13} />}>Create Forecast</Button>} className="mb-5"><div className="relative mb-4"><Search size={15} className="absolute left-3 top-2.5 text-muted-foreground" /><input className="w-full rounded-lg border border-border bg-[var(--secondary)] py-2.5 pl-9 pr-3 text-xs text-muted-foreground outline-none focus:border-border" placeholder="Search revenue, customers, sales, products..." /></div><div className="mb-5 flex gap-2 overflow-x-auto pb-1">{filters.map(item => <button key={item} onClick={() => setFilter(item)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] ${filter === item ? 'bg-secondary/20 text-foreground' : 'bg-secondary text-foreground hover:text-foreground'}`}>{item}</button>)}</div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{library.map(([name, kpi, horizon, category, value, confidence, updated, fav]) => <article key={name} className="group rounded-lg border border-border bg-[var(--card)] p-4 transition hover:border-border/40"><div className="flex items-start justify-between gap-2"><div><h3 className="text-sm font-semibold text-foreground">{name}</h3><div className="mt-2 flex gap-1.5"><Badge tone="blue">{kpi}</Badge><Badge tone="slate">{horizon}</Badge></div></div><button className={fav ? 'text-foreground' : 'text-muted-foreground'} aria-label={fav ? 'Remove favorite' : 'Add favorite'}>{fav ? '★' : '☆'}</button></div><p className="mt-5 text-2xl font-semibold text-foreground">{value}</p><div className="mt-3 flex items-center justify-between text-[11px]"><Badge tone={confidence === 'High confidence' ? 'emerald' : confidence === 'Limited confidence' ? 'amber' : 'blue'}>{confidence}</Badge><span className="text-muted-foreground">Updated {updated}</span></div><div className="mt-4 flex gap-2 border-t border-border pt-3"><Button>Open</Button><Button icon={<Edit3 size={12} />}>Edit</Button><button className="ml-auto rounded-md p-2 text-foreground hover:bg-secondary hover:text-foreground" aria-label={`More actions for ${name}`}><MoreHorizontal size={15} /></button></div></article>)}</div></Section>
<Section title="Configure Forecast" action={<button onClick={() => setConfigOpen(!configOpen)} aria-label="Toggle configuration"><ChevronDown size={17} className={`text-muted-foreground transition ${configOpen ? '' : '-rotate-90'}`} /></button>} className="mb-5">{configOpen && <div><div className="grid gap-5 lg:grid-cols-2"><div className="space-y-4">{[['KPI selector', 'Revenue'], ['Business Area', 'Overall Business'], ['Entity', 'All Channels']].map(([label, value]) => <label key={label} className="block"><span className="mb-1.5 block text-xs text-muted-foreground">{label}</span><select className="w-full rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring/50" defaultValue={value}><option>{value}</option><option>Revenue Growth</option><option>Customers</option><option>Orders</option><option>Conversion Rate</option><option>Pipeline</option><option>ROAS</option><option>Profit</option></select></label>)}</div><div className="space-y-4"><div><p className="mb-2 text-xs text-muted-foreground">Historical Period</p><div className="flex flex-wrap gap-1 rounded-lg bg-[var(--secondary)] p-1">{['Last 30D', 'Last 90D', 'Last 6M', 'Last 12M', 'Last 24M', 'Custom'].map(x => <button key={x} className={`rounded-md px-2.5 py-2 text-[11px] ${x === 'Last 12M' ? 'bg-primary text-primary-foreground' : 'text-primary-foreground hover:text-primary-foreground'}`}>{x}</button>)}</div></div><div><p className="mb-2 text-xs text-muted-foreground">Forecast Horizon</p><div className="flex flex-wrap gap-1 rounded-lg bg-[var(--secondary)] p-1">{['7 Days', '30 Days', '90 Days', '6 Months', '12 Months', 'Custom'].map(x => <button key={x} className={`rounded-md px-2.5 py-2 text-[11px] ${x === '30 Days' ? 'bg-primary text-primary-foreground' : 'text-primary-foreground hover:text-primary-foreground'}`}>{x}</button>)}</div></div><label className="block"><span className="mb-1.5 block text-xs text-muted-foreground">Forecast Method</span><select className="w-full rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5 text-xs text-foreground" defaultValue="Auto (Recommended)"><option>Auto (Recommended)</option><option>Trend-based</option><option>Seasonality-adjusted</option><option>Conservative</option></select></label></div></div><button className="mt-5 w-full rounded-lg bg-primary py-3 text-xs font-semibold text-primary-foreground hover:bg-primary">Generate Forecast</button><p className="mt-2 text-center text-[11px] text-muted-foreground">Forecast will be generated based on connected data sources. Results are projections, not guarantees.</p><div className="mt-5 rounded-lg border border-border/20 bg-secondary/[0.06] p-4"><div className="flex items-center justify-between"><p className="text-sm font-medium text-foreground">Building Forecast...</p><span className="text-[10px] text-foreground">In progress</span></div><div className="mt-3 grid gap-2 text-xs">{['Collecting historical data', 'Evaluating data quality', 'Detecting historical patterns', 'Evaluating seasonality', 'Calculating forecast', 'Generating uncertainty range', 'Preparing AI interpretation'].map((step, i) => <div key={step} className="flex items-center gap-2 text-muted-foreground"><span className={i < 3 ? 'text-foreground' : i === 3 ? 'animate-spin text-foreground' : 'text-muted-foreground'}>{i < 3 ? '✓' : i === 3 ? '⟳' : '○'}</span>{step}</div>)}</div></div></div>}</Section>
<Section title="Revenue Forecast" badge="Forecast" className="mb-5"><div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Revenue forecasts appear after connected historical records are available.</div></Section>
<Section title="Forecast Details" className="mb-5"><div className="rounded-lg border border-dashed border-border bg-[var(--card)] p-6 text-center text-sm text-muted-foreground">Forecast range, confidence and accuracy will appear after connected historical records are available.</div></Section>
<Section title="Forecast Drivers" badge="AI Inferred" className="mb-5"><p className="-mt-2 mb-4 text-xs text-muted-foreground">Factors associated with the revenue forecast. Correlation identified; causal relationships are not confirmed.</p><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">{drivers.map(([name, type, desc, influence, arrow, magnitude, Icon, tone]) => <article key={name} className="rounded-lg border border-border bg-[var(--card)] p-4"><Icon size={17} className={`text-${tone}-300`} /><h3 className="mt-3 text-xs font-semibold text-foreground">{name}</h3><Badge tone={type === 'AI Inferred' ? 'violet' : type === 'Correlated' ? 'amber' : 'blue'}>{type}</Badge><p className="mt-3 text-xs leading-5 text-muted-foreground">{desc}</p><div className="mt-4 flex items-center justify-between text-xs"><span className={arrow === '↓' ? 'text-chart-5' : arrow === '↑' ? 'text-foreground' : 'text-foreground'}>{arrow} {influence}</span><span className="text-muted-foreground">{magnitude}</span></div></article>)}</div><p className="mt-5 text-xs italic text-muted-foreground">Drivers are identified through pattern analysis. Correlation does not imply causation. AI Inferred factors are model interpretations.</p></Section>
<Section title="Lulu AI Forecast Analysis" badge="AI-generated" className="mb-5 border-border/20 bg-secondary/[0.05]"><p className="text-sm text-muted-foreground">AI forecast analysis appears after live historical records are available.</p></Section>
<Section title="Forecast Scenarios" badge="Scenario" className="mb-5"><p className="text-sm text-muted-foreground">Scenario projections will appear after a live forecast has been generated.</p></Section>
<Section title="Forecast Risks" badge="3" className="mb-5">{risks.map(([title, desc, impact, severity, evidence]) => <article key={title} className="border-b border-border py-4 first:pt-0 last:border-0 last:pb-0"><div className="flex flex-col justify-between gap-3 lg:flex-row"><div><h3 className="text-sm font-semibold text-foreground">{title}</h3><p className="mt-1 max-w-4xl text-xs leading-5 text-muted-foreground">{desc}</p><div className="mt-3 flex flex-wrap gap-2"><Badge tone={severity.includes('High') ? 'red' : 'amber'}>Severity: {severity}</Badge><Badge>Impact: {impact}</Badge><Badge tone="slate">Evidence: {evidence}</Badge></div></div><div className="flex shrink-0 gap-2"><Button>View Risk</Button><Button icon={<Plus size={12} />}>Create Task</Button></div></div></article>)}</Section>
<Section title="Forecast Opportunities" badge="4" className="mb-5">{opportunities.map(([title, desc, impact, priority, evidence, forecast]) => <article key={title} className="border-b border-border py-4 first:pt-0 last:border-0 last:pb-0"><div className="flex flex-col justify-between gap-3 lg:flex-row"><div><h3 className="text-sm font-semibold text-foreground">{title}</h3><p className="mt-1 max-w-4xl text-xs leading-5 text-muted-foreground">{desc}</p><div className="mt-3 flex flex-wrap gap-2"><Badge tone={priority === 'High' ? 'violet' : 'blue'}>Priority: {priority}</Badge><Badge tone="emerald">Impact: {impact}</Badge><Badge tone="slate">{evidence} · {forecast}</Badge></div></div><div className="flex shrink-0 gap-2"><Button>View Opportunity</Button><Button icon={<Plus size={12} />}>Create Task</Button></div></div></article>)}</Section>
<Section title="AI Recommendations" className="mb-5"><div className="grid gap-3 lg:grid-cols-3">{recommendations.map(([title, reason, evidence, impact, priority], i) => <article key={title} className="rounded-lg border border-border bg-[var(--card)] p-4"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-foreground">0{i + 1}</span><Badge tone={priority === 'High' ? 'red' : 'amber'}>{priority} priority</Badge></div><h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{reason}</p><div className="mt-4 flex flex-wrap gap-2"><Badge tone="blue">{evidence}</Badge><Badge tone="emerald">{impact}</Badge></div><div className="mt-4 flex flex-wrap gap-2"><Button>Review</Button><Button>Create Task</Button>{i === 0 && <Button primary>Execute with AI</Button>}</div></article>)}</div></Section>
<Section title="Create Task from Forecast Finding" action={<button onClick={() => setTaskOpen(!taskOpen)} className="text-foreground" aria-label="Toggle create task panel"><Plus size={17} /></button>} className="mb-5">{taskOpen ? <div className="grid gap-4 md:grid-cols-2"><label className="text-xs text-muted-foreground">Task Name<input className="mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-xs text-foreground" defaultValue="" /></label><label className="text-xs text-muted-foreground">Owner<select className="mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-xs text-foreground"><option>Unassigned</option><option>Workspace member</option></select></label><label className="text-xs text-muted-foreground">Priority<select className="mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-xs text-foreground"><option>High</option><option>Medium</option></select></label><label className="text-xs text-muted-foreground">Due Date<input type="date" className="mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-xs text-foreground" /></label><label className="text-xs text-muted-foreground md:col-span-2">Description<textarea className="mt-2 min-h-20 w-full rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-xs text-foreground" defaultValue="" /></label><div className="md:col-span-2 flex gap-2"><Button primary>Create Task</Button><Button onClick={() => setTaskOpen(false)}>Cancel</Button></div><p className="text-[11px] text-muted-foreground md:col-span-2">This action requires confirmation before task creation.</p></div> : <p className="text-xs text-muted-foreground">Create a follow-up task directly from a forecast risk or opportunity.</p>}</Section>
<Section title="Ask Lulu AI" className="mb-5 border-border/20 bg-secondary/[0.05]"><div className="flex items-center gap-2"><Sparkles size={18} className="text-foreground" /><h3 className="text-sm font-semibold text-foreground">Explore this forecast with Lulu</h3></div><div className="relative mt-4"><input value={question} onChange={e => setQuestion(e.target.value)} className="w-full rounded-lg border border-border/20 bg-[var(--secondary)] px-4 py-3 text-sm text-muted-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40" placeholder="Ask about this forecast..." /><button className="absolute right-2 top-2 rounded-md bg-primary p-1.5 text-primary-foreground" aria-label="Ask question"><ArrowRight size={16} /></button></div><div className="mt-3 flex flex-wrap gap-2">{['Why is revenue expected to change?', 'How reliable is this forecast?', 'What could cause the forecast to miss?', 'What should I do to improve the outcome?', 'What happens if advertising spend increases by 20%?', 'Are there any risks I should be aware of?'].map(x => <button key={x} onClick={() => setQuestion(x)} className="rounded-full border border-border/15 px-3 py-1.5 text-[11px] text-foreground hover:bg-secondary/10">{x}</button>)}</div><div className="mt-5 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">AI responses appear after a forecast question is submitted against live records.</div></Section>
<Section title="Saved Forecasts" className="mb-5"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Name', 'KPI', 'Entity', 'Horizon', 'Status', 'Last Updated', 'Actions'].map(x => <th key={x} className="px-3 pb-3 font-medium">{x}</th>)}</tr></thead><tbody>{saved.map(([name, kpi, entity, horizon, status, updated, fav]) => <tr key={String(name)} className="border-t border-border"><td className="px-3 py-3 font-medium text-foreground">{name}</td><td className="px-3 py-3 text-muted-foreground">{kpi}</td><td className="px-3 py-3 text-muted-foreground">{entity}</td><td className="px-3 py-3 text-muted-foreground">{horizon}</td><td className="px-3 py-3"><Badge tone={status === 'Improving' ? 'emerald' : status === 'Risk' ? 'red' : status === 'Watch' ? 'amber' : 'blue'}>● {status}</Badge></td><td className="px-3 py-3 text-muted-foreground">{updated}</td><td className="px-3 py-3 text-muted-foreground">Open · Edit · Duplicate · Delete · <span className="text-chart-1">{fav ? '★' : '☆'}</span></td></tr>)}</tbody></table></div></Section>
<div className="mb-5 grid gap-5 xl:grid-cols-2"><Section title="Data Sources"><div className="space-y-3">{sources.map(([name, sync, fresh]) => <div key={name} className="flex items-center gap-3 rounded-lg bg-[var(--secondary)] p-3"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-foreground"><Database size={14} /></span><div className="min-w-0 flex-1"><p className="text-xs font-medium text-foreground">{name}</p><p className="text-[11px] text-muted-foreground">Last sync: {sync}</p></div><Badge tone="emerald">● Connected</Badge><span className="hidden text-[10px] text-muted-foreground sm:block">{fresh}</span></div>)}</div></Section><Section title="Forecast Data Quality"><div className="rounded-lg border border-dashed border-border p-5 text-center text-sm text-muted-foreground">Data quality metrics appear after live source records are connected.</div></Section></div>
<Section title="Forecast History" className="mb-5"><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-xs"><thead className="text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Event', 'User', 'Action', 'Timestamp'].map(x => <th key={x} className="px-3 pb-3 font-medium">{x}</th>)}</tr></thead><tbody>{history.map(([event, user, action, time]) => <tr key={event + time} className="border-t border-border"><td className="px-3 py-3 text-foreground">{event}</td><td className="px-3 py-3 text-muted-foreground">{user}</td><td className="px-3 py-3 text-muted-foreground">{action}</td><td className="px-3 py-3 text-muted-foreground">{time}</td></tr>)}</tbody></table></div></Section>
<Section title="Reference States" className="mb-8"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><div className="rounded-lg border border-dashed border-border p-4"><TrendingUp size={22} className="text-muted-foreground" /><h3 className="mt-3 text-sm font-medium">Create your first forecast</h3><p className="mt-1 text-xs text-muted-foreground">Select a supported KPI and forecast horizon to begin predicting future performance.</p><Button primary> Create Forecast</Button></div><div className="rounded-lg border border-border p-4"><ShieldAlert size={18} className="text-foreground" /><h3 className="mt-3 text-sm font-medium">Insufficient Historical Data</h3><p className="mt-1 text-xs text-muted-foreground">At least 90 days of daily data is required for the selected KPI.</p><div className="mt-3 flex gap-2"><Button>Adjust Configuration</Button><Button>Connect Data</Button></div></div><div className="rounded-lg border border-border p-4"><CircleHelp size={18} className="text-muted-foreground" /><h3 className="mt-3 text-sm font-medium">Forecast Unavailable</h3><p className="mt-1 text-xs text-muted-foreground">The selected KPI or horizon is not currently supported.</p><Button>Try Again</Button></div><div className="rounded-lg border border-chart-5/15 p-4"><X size={18} className="text-chart-5" /><h3 className="mt-3 text-sm font-medium">Forecast Cannot Be Generated</h3><p className="mt-1 text-xs text-muted-foreground">Insufficient historical data · Data gaps exceed 20%.</p></div><div className="rounded-lg border border-border p-4"><span className="text-lg">🔒</span><h3 className="mt-3 text-sm font-medium">Forecast Access Restricted</h3><p className="mt-1 text-xs text-muted-foreground">You do not have permission to view this forecast.</p></div></div></Section>
</div></main></div>;
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
