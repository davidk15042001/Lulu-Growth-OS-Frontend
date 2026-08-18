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
const stats = [['Active Forecasts', '8', 'blue', 'Live library'], ['Forecasts Improving', '5', 'emerald', '↑ 2 this week'], ['Forecasts Declining', '2', 'red', '↓ 1 this week'], ['Forecast Risks', '3', 'amber', 'Needs attention'], ['Forecast Opportunities', '4', 'violet', 'AI identified']] as const;
const filters = ['All', 'Revenue', 'Customers', 'Sales', 'Marketing', 'Advertising', 'Ecommerce', 'Finance', 'Products'];
const library = [['Revenue Forecast', 'Revenue', '30-day horizon', 'Next 30 Days', '+12.4% projected', 'High confidence', '2 min ago', true], ['Customer Growth Forecast', 'Customers', '90-day horizon', 'Customers', '+8.1% projected', 'Medium confidence', '1 hour ago', false], ['Sales Pipeline Forecast', 'Pipeline', '30-day horizon', 'Pipeline', '€890K projected', 'High confidence', '30 min ago', true], ['Advertising ROAS Forecast', 'ROAS', '30-day horizon', 'ROAS', '4.1x projected', 'Medium confidence', '4 hours ago', false], ['Churn Forecast', 'Churn Rate', '90-day horizon', 'Churn Rate', '2.3% projected', 'Medium confidence', '3 hours ago', false], ['Product Demand Forecast', 'Orders', '30-day horizon', 'Orders', '+18.2% projected', 'Limited confidence', '6 hours ago', false]] as const;
const drivers = [['Historical Revenue Growth', 'Observed', '+11.2% avg monthly growth trend', 'Positive influence', '↑', 'High', TrendingUp, 'emerald'], ['Customer Growth Rate', 'Observed', '+8.4% new customers this month', 'Positive influence', '↑', 'Medium', Users, 'blue'], ['Seasonal Pattern', 'AI Inferred', 'Q1 historically shows moderate uplift', 'Moderate positive influence', '↑', 'Medium', Activity, 'violet'], ['Advertising Performance', 'Correlated', 'ROAS stable at 4.2x', 'Stable influence', '→', 'Low', BarChart3, 'amber'], ['Conversion Rate', 'Observed', '4.8% (slight decline from 5.1%)', 'Slight negative influence', '↓', 'Medium', ArrowDownRight, 'red']] as const;
const risks = [['Conversion Rate Decline Risk', 'Conversion rate has declined from 5.1% to 4.8% over the past 30 days. If this trend continues, the revenue forecast could miss the expected range.', 'High', 'Medium (amber)', 'Observed (30-day trend)'], ['Target Gap Risk', 'Current forecast projects €8,000 below the €150K target. Without intervention, the gap may persist or widen if advertising performance softens.', 'Medium', 'Medium (amber)', 'Calculated'], ['Advertising Dependency Risk', 'Revenue forecast relies significantly on stable advertising ROAS. Any deterioration in platform performance would negatively impact projected outcomes.', 'High', 'High (red)', 'Correlated']];
const opportunities = [['Conversion Rate Recovery', 'Recovering conversion rate from 4.8% back to 5.1% could add approximately €4,200 to the projected revenue outcome.', 'High', 'High', 'Calculated', 'Revenue Forecast'], ['Advertising Spend Optimization', 'Reallocating 15% of Meta Ads spend to Google Ads based on ROAS differential could improve overall advertising revenue projection.', 'Medium', 'High', 'AI Inferred', 'Advertising Forecast'], ['Seasonal Demand Capture', 'Historical Q1 seasonality indicates a window for higher product demand. Increasing inventory and promotional activity may amplify the upside scenario.', 'Medium', 'Medium', 'AI Inferred', 'Product Demand Forecast'], ['Customer Retention Uplift', 'Reducing churn from 2.3% to 2.0% could add approximately €6,800 in projected customer lifetime value over the 90-day horizon.', 'Medium', 'Medium', 'Calculated', 'Customer Forecast']];
const recommendations = [['Address Conversion Rate Decline', 'Conversion has dropped 0.3pp in 30 days. Addressing this is the highest-leverage action to close the target gap.', 'Observed trend', '+€3K–€5K revenue', 'High'], ['Protect Advertising ROAS', 'Revenue forecast relies on stable ROAS. Monitoring and optimizing campaign performance reduces downside risk.', 'Correlated driver', 'Risk reduction', 'Medium'], ['Activate Q1 Seasonal Strategy', 'Seasonality model indicates a Q1 uplift window. Acting early could push revenue toward the optimistic scenario.', 'AI Inferred', '+€8K–€16K', 'Medium']];
const sources = [['Google Analytics', '3 min ago', 'Excellent freshness'], ['Shopify', '8 min ago', 'Good freshness'], ['Google Ads', '2 min ago', 'Excellent freshness'], ['Meta Ads', '5 min ago', 'Good freshness'], ['CRM', '15 min ago', 'Good freshness']];
const history = [['Forecast created', 'Anna M.', 'Created Revenue Forecast (30-day)', 'Today 09:12'], ['Configuration changed', 'Anna M.', 'Changed horizon to 30 days', 'Today 09:14'], ['Forecast updated', 'System', 'Auto-refresh on new data', 'Today 09:41'], ['Scenario created', 'Anna M.', 'Created Optimistic scenario', 'Today 09:48'], ['Shared', 'Anna M.', 'Shared via internal link', 'Today 10:02'], ['Report created', 'Anna M.', 'Created report from forecast', 'Today 10:15']];
const saved = [['Revenue Forecast', 'Revenue', 'All Channels', '30 Days', 'Improving', '2 min ago', true], ['Customer Growth Forecast', 'Customers', 'All Segments', '90 Days', 'Stable', '1 hr ago', false], ['Sales Pipeline Forecast', 'Pipeline', 'Sales Team', '30 Days', 'Improving', '30 min ago', true], ['Advertising ROAS Forecast', 'ROAS', 'Google Ads + Meta', '30 Days', 'Watch', '4 hrs ago', false], ['Churn Forecast', 'Churn Rate', 'All Customers', '90 Days', 'Risk', '3 hrs ago', false]];
const scenarios = [['Base Case', '€142K', '+12.4%', 'High'], ['Optimistic', '€158K', '+25.0%', 'Medium'], ['Conservative', '€128K', '+1.2%', 'Medium']];
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
const Chart = () => <div className="overflow-hidden rounded-lg border border-border bg-[var(--secondary)] p-3"><svg viewBox="0 0 900 320" className="h-[300px] w-full" role="img" aria-label="Revenue forecast chart showing actual revenue, a forecast range, target, and forecast start"><defs><linearGradient id="range" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--chart-2)" stopOpacity=".28" /><stop offset="1" stopColor="var(--chart-2)" stopOpacity=".04" /></linearGradient></defs>{[45, 105, 165, 225, 285].map(y => <line key={y} x1="58" x2="875" y1={y} y2={y} stroke="rgba(0,0,0,.07)" />)}<path d="M58 232 C110 222 112 190 170 204 S244 165 292 178 S358 135 408 150 S475 114 527 132 S590 92 645 112 L645 143 C590 125 550 157 527 152 S475 139 408 176 S360 158 292 203 S230 191 170 230 S110 249 58 250Z" fill="url(#range)" /><path d="M58 232 C110 222 112 190 170 204 S244 165 292 178 S358 135 408 150 S475 114 527 132 S590 92 645 112" fill="none" stroke="var(--chart-2)" strokeWidth="3" /><path d="M645 112 C704 97 748 125 790 86 S838 73 875 48" fill="none" stroke="var(--chart-3)" strokeWidth="3" strokeDasharray="8 7" /><line x1="645" x2="645" y1="25" y2="285" stroke="var(--chart-2)" strokeDasharray="4 6" /><line x1="58" x2="875" y1="76" y2="76" stroke="var(--chart-1)" strokeDasharray="7 6" /><line x1="645" x2="645" y1="25" y2="285" stroke="var(--border)" strokeDasharray="2 5" opacity=".55" /><g fill="var(--muted-foreground)" fontSize="12"><text x="8" y="48">€160K</text><text x="16" y="168">€130K</text><text x="20" y="288">€100K</text>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', '30d'].map((m, i) => <text key={m} x={58 + i * 68} y="307">{m}</text>)}</g><text x="654" y="40" fill="var(--chart-2)" fontSize="11">Forecast Start</text><text x="760" y="68" fill="var(--chart-1)" fontSize="11">Target €150K</text></svg><div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground"><span className="text-foreground">● Actual</span><span className="text-foreground">┄ Forecast</span><span>▰ Forecast Range</span><span className="text-foreground">— Target</span><span className="ml-auto">Date · value · range · vs target</span></div></div>;
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
  }}><aside className={`${mobileNav ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-30 w-60 flex-col border-r border-border bg-[var(--sidebar)] p-4 lg:flex`}><div className="mb-7 flex items-center gap-3 px-2"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground shadow-lg shadow-black/20">L</span><span className="text-lg font-semibold tracking-tight text-foreground">Lulu AI</span><button onClick={() => setMobileNav(false)} className="ml-auto lg:hidden"><X size={17} /></button></div><LuluSectionNavigation activeId="wispy-current-7490" /><div className="mt-4 border-t border-border pt-4"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/30 text-xs font-semibold text-foreground">AM</div><div><p className="text-xs font-medium text-foreground">Anna M.</p><p className="text-[11px] text-muted-foreground">Analyst</p></div><MoreHorizontal size={16} className="ml-auto text-muted-foreground" /></div></div></aside><main className="min-h-screen lg:pl-60"><div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8"><header className="mb-7"><div className="mb-4 flex items-center gap-3"><button onClick={() => setMobileNav(true)} className="rounded-md p-2 text-foreground hover:bg-secondary lg:hidden" aria-label="Open navigation"><Menu size={18} /></button><p className="text-xs text-muted-foreground">Intelligence <span className="mx-2 text-foreground">/</span> Analytics <span className="mx-2 text-foreground">/</span> <span className="text-foreground">Forecasts</span></p></div><div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Forecasts</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Use AI-powered forecasting to understand where your business may be heading and prepare for what comes next.</p></div><div className="flex flex-wrap gap-2"><Button primary icon={<Sparkles size={14} />}>Ask Lulu AI</Button><Button primary icon={<Plus size={14} />}>Create Forecast</Button><Button icon={<Download size={14} />}>Export</Button><button onClick={refresh} className="rounded-lg border border-border bg-secondary p-2 text-foreground hover:text-foreground" aria-label="Refresh forecasts"><RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /></button></div></div></header>
<Section title="Forecast Overview" className="mb-5"><div className="grid grid-cols-2 gap-3 xl:grid-cols-5">{stats.map(([label, value, tone, change]) => <div key={label} className="rounded-lg border border-border bg-[var(--secondary)] p-4"><div className="mb-4 flex items-center justify-between"><span className={`h-2 w-2 rounded-full ${tone === 'emerald' ? 'bg-primary' : tone === 'red' ? 'bg-destructive' : tone === 'amber' ? 'bg-chart-1' : tone === 'violet' ? 'bg-primary' : 'bg-primary'}`} /><span className="text-[10px] text-muted-foreground">{change}</span></div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold text-foreground">{value}</p></div>)}</div></Section>
<Section title="Forecast Library" action={<Button primary icon={<Plus size={13} />}>Create Forecast</Button>} className="mb-5"><div className="relative mb-4"><Search size={15} className="absolute left-3 top-2.5 text-muted-foreground" /><input className="w-full rounded-lg border border-border bg-[var(--secondary)] py-2.5 pl-9 pr-3 text-xs text-muted-foreground outline-none focus:border-border" placeholder="Search revenue, customers, sales, products..." /></div><div className="mb-5 flex gap-2 overflow-x-auto pb-1">{filters.map(item => <button key={item} onClick={() => setFilter(item)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] ${filter === item ? 'bg-secondary/20 text-foreground' : 'bg-secondary text-foreground hover:text-foreground'}`}>{item}</button>)}</div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{library.map(([name, kpi, horizon, category, value, confidence, updated, fav]) => <article key={name} className="group rounded-lg border border-border bg-[var(--card)] p-4 transition hover:border-border/40"><div className="flex items-start justify-between gap-2"><div><h3 className="text-sm font-semibold text-foreground">{name}</h3><div className="mt-2 flex gap-1.5"><Badge tone="blue">{kpi}</Badge><Badge tone="slate">{horizon}</Badge></div></div><button className={fav ? 'text-foreground' : 'text-muted-foreground'} aria-label={fav ? 'Remove favorite' : 'Add favorite'}>{fav ? '★' : '☆'}</button></div><p className="mt-5 text-2xl font-semibold text-foreground">{value}</p><div className="mt-3 flex items-center justify-between text-[11px]"><Badge tone={confidence === 'High confidence' ? 'emerald' : confidence === 'Limited confidence' ? 'amber' : 'blue'}>{confidence}</Badge><span className="text-muted-foreground">Updated {updated}</span></div><div className="mt-4 flex gap-2 border-t border-border pt-3"><Button>Open</Button><Button icon={<Edit3 size={12} />}>Edit</Button><button className="ml-auto rounded-md p-2 text-foreground hover:bg-secondary hover:text-foreground" aria-label={`More actions for ${name}`}><MoreHorizontal size={15} /></button></div></article>)}</div></Section>
<Section title="Configure Forecast" action={<button onClick={() => setConfigOpen(!configOpen)} aria-label="Toggle configuration"><ChevronDown size={17} className={`text-muted-foreground transition ${configOpen ? '' : '-rotate-90'}`} /></button>} className="mb-5">{configOpen && <div><div className="grid gap-5 lg:grid-cols-2"><div className="space-y-4">{[['KPI selector', 'Revenue'], ['Business Area', 'Overall Business'], ['Entity', 'All Channels']].map(([label, value]) => <label key={label} className="block"><span className="mb-1.5 block text-xs text-muted-foreground">{label}</span><select className="w-full rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring/50" defaultValue={value}><option>{value}</option><option>Revenue Growth</option><option>Customers</option><option>Orders</option><option>Conversion Rate</option><option>Pipeline</option><option>ROAS</option><option>Profit</option></select></label>)}</div><div className="space-y-4"><div><p className="mb-2 text-xs text-muted-foreground">Historical Period</p><div className="flex flex-wrap gap-1 rounded-lg bg-[var(--secondary)] p-1">{['Last 30D', 'Last 90D', 'Last 6M', 'Last 12M', 'Last 24M', 'Custom'].map(x => <button key={x} className={`rounded-md px-2.5 py-2 text-[11px] ${x === 'Last 12M' ? 'bg-primary text-primary-foreground' : 'text-primary-foreground hover:text-primary-foreground'}`}>{x}</button>)}</div></div><div><p className="mb-2 text-xs text-muted-foreground">Forecast Horizon</p><div className="flex flex-wrap gap-1 rounded-lg bg-[var(--secondary)] p-1">{['7 Days', '30 Days', '90 Days', '6 Months', '12 Months', 'Custom'].map(x => <button key={x} className={`rounded-md px-2.5 py-2 text-[11px] ${x === '30 Days' ? 'bg-primary text-primary-foreground' : 'text-primary-foreground hover:text-primary-foreground'}`}>{x}</button>)}</div></div><label className="block"><span className="mb-1.5 block text-xs text-muted-foreground">Forecast Method</span><select className="w-full rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5 text-xs text-foreground" defaultValue="Auto (Recommended)"><option>Auto (Recommended)</option><option>Trend-based</option><option>Seasonality-adjusted</option><option>Conservative</option></select></label></div></div><button className="mt-5 w-full rounded-lg bg-primary py-3 text-xs font-semibold text-primary-foreground hover:bg-primary">Generate Forecast</button><p className="mt-2 text-center text-[11px] text-muted-foreground">Forecast will be generated based on connected data sources. Results are projections, not guarantees.</p><div className="mt-5 rounded-lg border border-border/20 bg-secondary/[0.06] p-4"><div className="flex items-center justify-between"><p className="text-sm font-medium text-foreground">Building Forecast...</p><span className="text-[10px] text-foreground">In progress</span></div><div className="mt-3 grid gap-2 text-xs">{['Collecting historical data', 'Evaluating data quality', 'Detecting historical patterns', 'Evaluating seasonality', 'Calculating forecast', 'Generating uncertainty range', 'Preparing AI interpretation'].map((step, i) => <div key={step} className="flex items-center gap-2 text-muted-foreground"><span className={i < 3 ? 'text-foreground' : i === 3 ? 'animate-spin text-foreground' : 'text-muted-foreground'}>{i < 3 ? '✓' : i === 3 ? '⟳' : '○'}</span>{step}</div>)}</div></div></div>}</Section>
<Section title="Revenue Forecast" badge="Forecast" action={<span className="text-xs text-muted-foreground">Next 30 Days</span>} className="mb-5"><p className="-mt-2 mb-5 text-xs text-muted-foreground">Based on last 12 months of historical data · Auto forecast method · Updated 2 min ago</p><div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{[['Projected Revenue', '€142,000', 'Forecast'], ['Expected Change', '+12.4%', 'Calculated'], ['Forecast Range', '€131K – €153K', 'Forecast'], ['Confidence', 'High', 'Calculated']].map(([label, value, tag]) => <div key={label} className="rounded-lg border border-border bg-[var(--secondary)] p-3"><p className="text-[11px] text-muted-foreground">{label}</p><p className="mt-1 text-lg font-semibold text-foreground">{value}</p><Badge tone={tag === 'Forecast' ? 'violet' : 'emerald'}>{tag}</Badge></div>)}</div><div className="mb-3 flex items-center justify-between"><div className="flex gap-1"><button className="rounded-md px-3 py-1.5 text-[11px] text-foreground">Daily</button><button className="rounded-md px-3 py-1.5 text-[11px] text-foreground">Weekly</button><button className="rounded-md bg-secondary/15 px-3 py-1.5 text-[11px] text-foreground">Monthly</button></div><div className="flex gap-1"><button className="rounded-md p-1.5 text-foreground hover:bg-secondary" aria-label="Zoom out">−</button><button className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary" aria-label="Zoom in">+</button></div></div><Chart /></Section>
<Section title="Forecast Details" className="mb-5"><div className="grid gap-3 lg:grid-cols-3"><div className={`${cls} bg-[var(--card)] p-5`}><div className="flex justify-between"><h3 className="text-sm font-medium">Forecast Range</h3><Badge>Forecast</Badge></div><p className="mt-6 text-center text-3xl font-semibold text-foreground">€142,000</p><div className="my-6"><div className="relative h-2 rounded-full bg-card"><span className="absolute left-[12%] right-[16%] h-2 rounded-full bg-secondary/40" /><span className="absolute left-[51%] top-[-4px] h-4 w-1 rounded bg-primary text-primary-foreground" /></div><div className="mt-2 flex justify-between text-[10px] text-muted-foreground"><span>€131K</span><span>Expected</span><span>€153K</span></div></div><p className="text-xs leading-5 text-muted-foreground">Range reflects uncertainty in the forecast model based on historical data variability.</p></div><div className={`${cls} bg-[var(--card)] p-5`}><div className="flex justify-between"><h3 className="text-sm font-medium">Forecast Confidence</h3><Badge tone="emerald">Calculated</Badge></div><div className="my-5 text-center"><span className="inline-flex rounded-full bg-secondary/15 px-5 py-2 text-xl font-semibold text-foreground">HIGH</span></div><p className="text-xs leading-5 text-muted-foreground">Confidence reflects the quality and stability of the available historical data and forecast model.</p><ul className="mt-4 space-y-2 text-xs text-foreground">{['Historical data: 12 months', 'Data frequency: Daily', 'Seasonality detected: Yes', 'Trend stability: Stable'].map(x => <li key={x} className="flex justify-between"><span>{x}</span><Check size={14} className="text-chart-4" /></li>)}</ul></div><div className={`${cls} bg-[var(--card)] p-5`}><div className="flex justify-between"><h3 className="text-sm font-medium">Forecast Accuracy</h3><Badge tone="emerald">Excellent</Badge></div><p className="mt-2 text-xs text-muted-foreground">Based on backtesting against previous forecasts</p><div className="mt-5 space-y-2 text-xs"><p>Previous Forecast <strong className="float-right text-foreground">€127,000</strong></p><p>Actual <strong className="float-right text-foreground">€129,400</strong></p><p>Error <strong className="float-right text-chart-4">+€2,400 (+1.9%)</strong></p><p>MAPE <strong className="float-right text-chart-4">2.1% · excellent</strong></p><p>MAE <strong className="float-right text-foreground">€2,400</strong></p></div><svg viewBox="0 0 280 50" className="mt-4 h-10 w-full"><path d="M2 38 C30 30 40 34 62 27 S90 30 112 19 S142 25 160 15 S195 20 218 10 S250 15 278 5" fill="none" stroke="var(--foreground)" strokeWidth="2" /></svg></div></div></Section>
<Section title="Target vs Forecast" className="mb-5"><div className="grid gap-5 lg:grid-cols-[1fr_220px_1.4fr] lg:items-center"><div><div className="mb-3 flex justify-between text-xs"><span>Target <strong className="text-foreground">€150K</strong></span><span className="text-foreground">Forecast €142K</span></div><div className="relative h-3 rounded-full bg-card"><span className="absolute inset-y-0 left-0 w-[83%] rounded-full bg-primary text-primary-foreground" /><span className="absolute right-[13%] top-[-5px] h-5 w-0.5 bg-primary text-primary-foreground" /></div><p className="mt-2 text-[11px] text-muted-foreground">83% of target projected</p></div><div className="rounded-lg border border-border/20 bg-secondary/[0.06] p-4 text-center"><AlertTriangle size={17} className="mx-auto mb-2 text-foreground" /><p className="text-xl font-semibold text-foreground">-€8,000</p><p className="text-xs text-foreground/70">-5.3% below target</p></div><div><Badge tone="violet">AI Inferred</Badge><p className="mt-2 text-sm leading-6 text-foreground">On current trajectory, revenue is forecast to fall €8,000 short of target. Increasing conversion rate or advertising efficiency could close this gap.</p></div></div><p className="mt-5 text-xs italic text-muted-foreground">Target attainment probability is not provided. This gap reflects the model projection only.</p></Section>
<Section title="Forecast Drivers" badge="AI Inferred" className="mb-5"><p className="-mt-2 mb-4 text-xs text-muted-foreground">Factors associated with the revenue forecast. Correlation identified; causal relationships are not confirmed.</p><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">{drivers.map(([name, type, desc, influence, arrow, magnitude, Icon, tone]) => <article key={name} className="rounded-lg border border-border bg-[var(--card)] p-4"><Icon size={17} className={`text-${tone}-300`} /><h3 className="mt-3 text-xs font-semibold text-foreground">{name}</h3><Badge tone={type === 'AI Inferred' ? 'violet' : type === 'Correlated' ? 'amber' : 'blue'}>{type}</Badge><p className="mt-3 text-xs leading-5 text-muted-foreground">{desc}</p><div className="mt-4 flex items-center justify-between text-xs"><span className={arrow === '↓' ? 'text-chart-5' : arrow === '↑' ? 'text-foreground' : 'text-foreground'}>{arrow} {influence}</span><span className="text-muted-foreground">{magnitude}</span></div></article>)}</div><p className="mt-5 text-xs italic text-muted-foreground">Drivers are identified through pattern analysis. Correlation does not imply causation. AI Inferred factors are model interpretations.</p></Section>
<Section title="Lulu AI Forecast Analysis" badge="AI-generated" className="mb-5 border-border/20 bg-secondary/[0.05]"><div className="flex items-start gap-3"><Sparkles className="mt-1 shrink-0 text-foreground" size={18} /><p className="text-sm leading-6 text-foreground">Revenue is currently projected to increase by 12.4% over the next 30 days, reaching approximately €142,000. The forecast is supported by consistent revenue momentum over the past 12 months and steady customer growth. Recent advertising efficiency has remained stable, contributing positively to the projection. However, a slight decline in conversion rate (from 5.1% to 4.8%) introduces modest downside risk. The forecast range of €131K–€153K reflects normal variability in the model given available historical data.</p></div><div className="mt-5 grid gap-3 lg:grid-cols-3">{[['Key Forecast Signals', ['Revenue trend: upward (+11.2%)', 'Customer growth: positive (+8.4%)', 'Seasonality: moderate Q1 uplift expected']], ['Positive Factors', ['Consistent revenue momentum', 'Stable advertising ROAS', 'Customer base growth', 'Strong historical accuracy (MAPE 2.1%)']], ['Risk Factors', ['Conversion rate decline', '€8K gap to target', 'Reliance on current advertising performance']]].map(([title, items]) => <div key={String(title)} className="rounded-lg border border-border/10 bg-primary/10 p-4"><h3 className="text-xs font-semibold text-foreground">{title}</h3><ul className="mt-3 space-y-2 text-xs text-muted-foreground">{(items as string[]).map(x => <li key={x} className="flex gap-2"><span className="text-foreground">•</span>{x}</li>)}</ul></div>)}</div><div className="mt-4 flex flex-wrap gap-2"><Badge tone="amber">Risks Identified: 3 · View All →</Badge><Badge>Opportunities: 4 · View All →</Badge></div><p className="mt-4 text-[11px] text-muted-foreground">AI-generated · Based on connected data sources · Model: Auto (Seasonality-adjusted) · Last updated just now</p></Section>
<Section title="Forecast Scenarios" badge="Scenario" className="mb-5"><p className="-mt-2 mb-4 text-xs text-muted-foreground">Scenario projections are hypothetical. They are not predictions.</p><div className="mb-4 flex gap-1 overflow-x-auto border-b border-border">{['Base Case', 'Optimistic', 'Conservative', 'Custom Scenario'].map((x, i) => <button key={x} className={`whitespace-nowrap px-3 py-2 text-xs ${i === 0 ? 'border-b-2 border-border text-foreground' : 'text-foreground'}`}>{x}</button>)}</div><p className="max-w-2xl text-sm text-foreground">Current trajectory maintained. No major changes to advertising, conversion, or customer growth.</p><div className="mt-4 grid gap-3 md:grid-cols-3">{scenarios.map(([name, revenue, change, confidence]) => <div key={name} className="rounded-lg border border-border bg-[var(--secondary)] p-4"><div className="flex justify-between"><span className="text-xs text-muted-foreground">{name}</span><Badge tone={name === 'Optimistic' ? 'violet' : 'blue'}>{confidence}</Badge></div><p className="mt-3 text-xl font-semibold text-foreground">{revenue}</p><p className="mt-1 text-xs text-foreground">{change}</p></div>)}</div><button onClick={() => setScenarioOpen(!scenarioOpen)} className="mt-5 flex items-center gap-2 text-xs text-foreground hover:text-foreground"><ChevronRight size={14} className={scenarioOpen ? 'rotate-90' : ''} />Build Custom Scenario</button>{scenarioOpen && <div className="mt-4 grid gap-3 rounded-lg border border-border bg-[var(--secondary)] p-4 md:grid-cols-2">{[['Revenue Growth Rate', '+11.2%'], ['Conversion Rate', '4.8%'], ['Advertising Spend', '€42K'], ['ROAS', '4.2x'], ['Customer Growth', '+8.4%'], ['Churn Rate', '2.3%'], ['AOV', '€44.80']].map(([label, value]) => <label key={label} className="text-xs text-muted-foreground">{label}<div className="mt-2 flex items-center gap-3"><input type="range" className="w-full accent-primary" /><span className="w-14 text-right text-foreground">{value}</span></div></label>)}<div className="md:col-span-2 mt-2 flex flex-wrap items-center justify-between rounded-lg bg-secondary/[0.06] p-3 text-xs"><span>Base Case: €142,000</span><span>Scenario: <strong className="text-foreground">€158,000</strong></span><span>Impact: <strong className="text-foreground">+€16,000</strong></span></div><div className="md:col-span-2 flex gap-2"><Button primary>Save Scenario</Button><Button>Reset to Base Case</Button></div></div>}<div className="mt-5"><h3 className="mb-3 text-xs font-semibold text-foreground">Scenario Impact</h3><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">{[['Revenue', '€142K → €158K', '+11.3%'], ['Customers', '1,840 → 2,050', '+11.4%'], ['Gross Profit', '€64K → €72K', '+12.5%'], ['Marketing Efficiency', '4.2x → 4.6x', ''], ['Sales Pipeline', '€890K → €940K', '+5.6%']].map(([x, y, z]) => <div key={x} className="rounded-lg border border-border p-3"><p className="text-[11px] text-muted-foreground">{x}</p><p className="mt-2 text-xs text-foreground">{y}</p><p className="mt-1 text-[11px] text-chart-4">{z}</p><Badge>Scenario</Badge></div>)}</div></div></Section>
<Section title="Forecast Risks" badge="3" className="mb-5">{risks.map(([title, desc, impact, severity, evidence]) => <article key={title} className="border-b border-border py-4 first:pt-0 last:border-0 last:pb-0"><div className="flex flex-col justify-between gap-3 lg:flex-row"><div><h3 className="text-sm font-semibold text-foreground">{title}</h3><p className="mt-1 max-w-4xl text-xs leading-5 text-muted-foreground">{desc}</p><div className="mt-3 flex flex-wrap gap-2"><Badge tone={severity.includes('High') ? 'red' : 'amber'}>Severity: {severity}</Badge><Badge>Impact: {impact}</Badge><Badge tone="slate">Evidence: {evidence}</Badge></div></div><div className="flex shrink-0 gap-2"><Button>View Risk</Button><Button icon={<Plus size={12} />}>Create Task</Button></div></div></article>)}</Section>
<Section title="Forecast Opportunities" badge="4" className="mb-5">{opportunities.map(([title, desc, impact, priority, evidence, forecast]) => <article key={title} className="border-b border-border py-4 first:pt-0 last:border-0 last:pb-0"><div className="flex flex-col justify-between gap-3 lg:flex-row"><div><h3 className="text-sm font-semibold text-foreground">{title}</h3><p className="mt-1 max-w-4xl text-xs leading-5 text-muted-foreground">{desc}</p><div className="mt-3 flex flex-wrap gap-2"><Badge tone={priority === 'High' ? 'violet' : 'blue'}>Priority: {priority}</Badge><Badge tone="emerald">Impact: {impact}</Badge><Badge tone="slate">{evidence} · {forecast}</Badge></div></div><div className="flex shrink-0 gap-2"><Button>View Opportunity</Button><Button icon={<Plus size={12} />}>Create Task</Button></div></div></article>)}</Section>
<Section title="AI Recommendations" className="mb-5"><div className="grid gap-3 lg:grid-cols-3">{recommendations.map(([title, reason, evidence, impact, priority], i) => <article key={title} className="rounded-lg border border-border bg-[var(--card)] p-4"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-foreground">0{i + 1}</span><Badge tone={priority === 'High' ? 'red' : 'amber'}>{priority} priority</Badge></div><h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{reason}</p><div className="mt-4 flex flex-wrap gap-2"><Badge tone="blue">{evidence}</Badge><Badge tone="emerald">{impact}</Badge></div><div className="mt-4 flex flex-wrap gap-2"><Button>Review</Button><Button>Create Task</Button>{i === 0 && <Button primary>Execute with AI</Button>}</div></article>)}</div></Section>
<Section title="Create Task from Forecast Finding" action={<button onClick={() => setTaskOpen(!taskOpen)} className="text-foreground" aria-label="Toggle create task panel"><Plus size={17} /></button>} className="mb-5">{taskOpen ? <div className="grid gap-4 md:grid-cols-2"><label className="text-xs text-muted-foreground">Task Name<input className="mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-xs text-foreground" defaultValue="Investigate conversion rate decline — Revenue Forecast" /></label><label className="text-xs text-muted-foreground">Owner<select className="mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-xs text-foreground"><option>Unassigned</option><option>Anna M.</option></select></label><label className="text-xs text-muted-foreground">Priority<select className="mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-xs text-foreground"><option>High</option><option>Medium</option></select></label><label className="text-xs text-muted-foreground">Due Date<input type="date" className="mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-xs text-foreground" /></label><label className="text-xs text-muted-foreground md:col-span-2">Description<textarea className="mt-2 min-h-20 w-full rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-xs text-foreground" defaultValue="Review the recent conversion rate decline and its impact on the Revenue Forecast." /></label><div className="md:col-span-2 flex gap-2"><Button primary>Create Task</Button><Button onClick={() => setTaskOpen(false)}>Cancel</Button></div><p className="text-[11px] text-muted-foreground md:col-span-2">This action requires confirmation before task creation.</p></div> : <p className="text-xs text-muted-foreground">Create a follow-up task directly from a forecast risk or opportunity.</p>}</Section>
<Section title="Ask Lulu AI" className="mb-5 border-border/20 bg-secondary/[0.05]"><div className="flex items-center gap-2"><Sparkles size={18} className="text-foreground" /><h3 className="text-sm font-semibold text-foreground">Explore this forecast with Lulu</h3></div><div className="relative mt-4"><input value={question} onChange={e => setQuestion(e.target.value)} className="w-full rounded-lg border border-border/20 bg-[var(--secondary)] px-4 py-3 text-sm text-muted-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40" placeholder="Ask about this forecast..." /><button className="absolute right-2 top-2 rounded-md bg-primary p-1.5 text-primary-foreground" aria-label="Ask question"><ArrowRight size={16} /></button></div><div className="mt-3 flex flex-wrap gap-2">{['Why is revenue expected to change?', 'How reliable is this forecast?', 'What could cause the forecast to miss?', 'What should I do to improve the outcome?', 'What happens if advertising spend increases by 20%?', 'Are there any risks I should be aware of?'].map(x => <button key={x} onClick={() => setQuestion(x)} className="rounded-full border border-border/15 px-3 py-1.5 text-[11px] text-foreground hover:bg-secondary/10">{x}</button>)}</div><div className="mt-5 rounded-lg border border-border/10 bg-primary/10 p-4"><p className="text-xs font-semibold text-foreground">◉ AI Response · Just now</p><p className="mt-3 text-sm leading-6 text-foreground">The 12.4% revenue growth projection is driven primarily by consistent historical momentum and stable advertising performance. The main risk to this forecast is the recent conversion rate decline. If conversion recovers to 5.1%, the expected outcome could reach approximately €146,000, narrowing the target gap to €4,000. I recommend prioritizing conversion rate analysis as the highest-impact lever available within the forecast period.</p><button className="mt-3 text-xs text-foreground">Show Full Response ↓</button></div></Section>
<Section title="Saved Forecasts" className="mb-5"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Name', 'KPI', 'Entity', 'Horizon', 'Status', 'Last Updated', 'Actions'].map(x => <th key={x} className="px-3 pb-3 font-medium">{x}</th>)}</tr></thead><tbody>{saved.map(([name, kpi, entity, horizon, status, updated, fav]) => <tr key={String(name)} className="border-t border-border"><td className="px-3 py-3 font-medium text-foreground">{name}</td><td className="px-3 py-3 text-muted-foreground">{kpi}</td><td className="px-3 py-3 text-muted-foreground">{entity}</td><td className="px-3 py-3 text-muted-foreground">{horizon}</td><td className="px-3 py-3"><Badge tone={status === 'Improving' ? 'emerald' : status === 'Risk' ? 'red' : status === 'Watch' ? 'amber' : 'blue'}>● {status}</Badge></td><td className="px-3 py-3 text-muted-foreground">{updated}</td><td className="px-3 py-3 text-muted-foreground">Open · Edit · Duplicate · Delete · <span className="text-chart-1">{fav ? '★' : '☆'}</span></td></tr>)}</tbody></table></div></Section>
<div className="mb-5 grid gap-5 xl:grid-cols-2"><Section title="Data Sources"><div className="space-y-3">{sources.map(([name, sync, fresh]) => <div key={name} className="flex items-center gap-3 rounded-lg bg-[var(--secondary)] p-3"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-foreground"><Database size={14} /></span><div className="min-w-0 flex-1"><p className="text-xs font-medium text-foreground">{name}</p><p className="text-[11px] text-muted-foreground">Last sync: {sync}</p></div><Badge tone="emerald">● Connected</Badge><span className="hidden text-[10px] text-muted-foreground sm:block">{fresh}</span></div>)}</div></Section><Section title="Forecast Data Quality"><div className="space-y-4">{[['Historical Coverage', '96%', 'Excellent'], ['Data Freshness', '98%', 'Excellent'], ['Completeness', '94%', 'Good'], ['Stability', '91%', 'Good']].map(([label, value, status]) => <div key={label}><div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><span className="text-foreground">{value} · {status}</span></div><div className="h-1.5 rounded-full bg-card"><div className={`h-1.5 rounded-full ${status === 'Excellent' ? 'bg-primary' : 'bg-primary'}`} style={{
                    width: value
                  }} /></div></div>)}<div className="flex flex-wrap gap-2 pt-2"><Badge tone="emerald">Excellent overall</Badge><Badge tone="emerald">Daily ✓</Badge><Badge tone="emerald">No missing data ✓</Badge></div><p className="text-[11px] text-muted-foreground">Data quality assessment is based on connected sources for the selected KPI and period.</p></div></Section></div>
<Section title="Forecast Methodology" action={<button onClick={() => setMethodOpen(!methodOpen)} aria-label="Toggle methodology"><ChevronDown size={17} className={`text-muted-foreground ${methodOpen ? '' : '-rotate-90'}`} /></button>} className="mb-5">{methodOpen && <div className="grid gap-x-8 gap-y-3 text-xs sm:grid-cols-2"><p><span className="text-muted-foreground">Data Period Used</span><strong className="ml-3 text-foreground">Last 12 months (Jan 2024 – Dec 2024)</strong></p><p><span className="text-muted-foreground">Forecast Horizon</span><strong className="ml-3 text-foreground">30 days</strong></p><p><span className="text-muted-foreground">Data Sources</span><strong className="ml-3 text-foreground">Google Analytics, Shopify, Ads, CRM</strong></p><p><span className="text-muted-foreground">Update Frequency</span><strong className="ml-3 text-foreground">Continuous</strong></p><p><span className="text-muted-foreground">Forecasting Approach</span><strong className="ml-3 text-foreground">Seasonality-adjusted trend model</strong></p><p><span className="text-muted-foreground">Relevant Assumptions</span><strong className="ml-3 text-foreground">Stable environment; current strategy maintained</strong></p><p className="sm:col-span-2"><span className="text-muted-foreground">Known Limitations</span><strong className="ml-3 text-foreground">Accuracy decreases beyond 60 days; cannot account for unforeseen events; does not infer causation</strong></p><p className="text-muted-foreground italic sm:col-span-2">Forecast methodology details are provided for transparency. Proprietary model internals are not disclosed.</p></div>}</Section>
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
  }, {
    "id": "nicely-land-1864",
    "label": "Settings"
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
          <span data-lulu-section-soon={section.label !== "Website" ? "true" : undefined}>{section.label}</span>
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
