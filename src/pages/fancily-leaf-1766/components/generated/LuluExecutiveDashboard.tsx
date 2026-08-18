import { useState } from 'react';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Bell, Check, ChevronDown, CircleHelp, Clock3, Cloud, Database, Eye, Gauge, GitBranch, Globe2, LayoutDashboard, LifeBuoy, LineChart, Mail, Megaphone, Menu, MoreHorizontal, Pause, RefreshCw, Search, Settings, ShoppingBag, Sparkles, Target, Users, X, Zap } from 'lucide-react';
type IconType = typeof LayoutDashboard;
type Metric = {
  label: string;
  value: string;
  trend?: string;
  tone?: 'good' | 'warn' | 'neutral' | 'bad';
};
type Task = {
  title: string;
  priority: string;
  due: string;
  owner: string;
  status: string;
  overdue?: boolean;
};
const navItems: {
  label: string;
  icon: IconType;
}[] = [{
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  label: 'Analytics',
  icon: LineChart
}, {
  label: 'Opportunities',
  icon: Sparkles
}, {
  label: 'Tasks',
  icon: Check
}, {
  label: 'Customers',
  icon: Users
}, {
  label: 'Marketing',
  icon: Megaphone
}, {
  label: 'Advertising',
  icon: Target
}, {
  label: 'Integrations',
  icon: GitBranch
}, {
  label: 'Settings',
  icon: Settings
}];
const ranges = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Year to Date', 'Previous Year', 'Custom Range'];
const priorities: { title: string; action: string; tone: string }[] = [];
const healthMetrics: Metric[] = [];
const growthMetrics: string[] = [];
const customerMetrics: string[] = [];
const marketingMetrics: string[] = [];
const channelRows: string[][] = [];
const adPlatforms: { name: string; icon: IconType; spend: string; impressions: string; clicks: string; cpa: string; roas: string }[] = [];
const opportunities: { title: string; category: string; score: string; confidence: string; level: string }[] = [];
const tasks: Task[] = [];
const activities = [['AI Opportunity detected', 'High-intent product visibility identified', '8 min ago', 'violet', Sparkles], ['Advertising ROAS changed', 'ROAS decreased 14% versus previous period', '24 min ago', 'amber', AlertTriangle], ['New integration connected', 'Microsoft Ads connection is now active', '1 hour ago', 'emerald', GitBranch], ['Task completed', 'Q4 audience review was completed', '2 hours ago', 'blue', Check], ['Business Health Score updated', 'Your score increased by 6 points', '3 hours ago', 'violet', Gauge], ['Revenue milestone reached', 'Monthly revenue passed €240,000', '5 hours ago', 'emerald', ArrowUpRight]] as const;
const integrations = [['Shopify', 'Connected', '2 min ago', ShoppingBag], ['Google Analytics', 'Connected', '5 min ago', BarChart3], ['Google Ads', 'Attention Required', '34 min ago', Target], ['Meta Ads', 'Connected', '12 min ago', Globe2], ['Mailchimp', 'Connected', '18 min ago', Mail], ['HubSpot', 'Connected', '8 min ago', Database], ['WooCommerce', 'Connected', '3 min ago', ShoppingBag], ['Microsoft Ads', 'Connected', '22 min ago', Target]] as const;
const Sparkline = ({
  color = 'var(--chart-2)',
  dashed = false
}: {
  color?: string;
  dashed?: boolean;
}) => <svg viewBox="0 0 180 48" className="h-12 w-full" role="img" aria-label="Trend chart">
    <path d="M2 38 C20 34 22 31 38 34 S60 22 75 27 S95 18 111 23 S130 12 146 16 S165 8 178 11" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={dashed ? '5 5' : undefined} />
  </svg>;
const AreaChart = ({
  secondary = false
}: {
  secondary?: boolean;
}) => <svg viewBox="0 0 760 250" className="h-64 w-full" role="img" aria-label="Revenue performance chart">
    <defs><linearGradient id="violetFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--chart-2)" stopOpacity=".28" /><stop offset="1" stopColor="var(--chart-2)" stopOpacity="0" /></linearGradient></defs>
    {[45, 92, 139, 186, 233].map(y => <line key={y} x1="48" x2="750" y1={y} y2={y} stroke="rgba(0,0,0,.07)" />)}
    <path d="M48 190 C105 172 110 178 160 154 S245 174 280 136 S356 145 400 111 S474 132 518 87 S590 101 635 67 S701 79 750 42 L750 233 L48 233 Z" fill="url(#violetFill)" />
    <path d="M48 190 C105 172 110 178 160 154 S245 174 280 136 S356 145 400 111 S474 132 518 87 S590 101 635 67 S701 79 750 42" fill="none" stroke="var(--chart-2)" strokeWidth="3" />
    <path d="M48 202 C115 194 130 180 174 188 S246 169 290 178 S355 155 405 161 S470 144 520 150 S585 123 635 139 S700 111 750 120" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeDasharray="6 7" />
    <g fill="var(--muted-foreground)" fontSize="11"><text x="6" y="48">€300k</text><text x="12" y="142">€200k</text><text x="18" y="237">€100k</text><text x="48" y="248">Nov 01</text><text x="220" y="248">Nov 10</text><text x="395" y="248">Nov 20</text><text x="570" y="248">Nov 25</text><text x="705" y="248">Nov 30</text></g>
    {secondary && <path d="M48 180 C115 175 150 155 190 165 S275 139 320 150 S390 112 440 132 S520 92 565 112 S655 77 750 90" fill="none" stroke="var(--chart-4)" strokeWidth="2.5" />}
  </svg>;
const MiniBars = () => <div className="flex h-20 items-end gap-1.5">{[35, 46, 40, 55, 49, 65, 58, 72, 68, 86, 77, 94].map((height, index) => <span key={height} className={`flex-1 rounded-t-sm ${index > 8 ? 'bg-primary' : 'bg-secondary/30'}`} style={{
    height: `${height}%`
  }} />)}</div>;
export const LuluExecutiveDashboard = () => {
  const { currentUser, selectedWorkspace } = useLuluApp();
  const accountName = currentUser?.firstName || currentUser?.email || 'Account';
  const accountInitial = accountName.charAt(0).toUpperCase();
  const [selectedDateRange, setSelectedDateRange] = useState('Last 30 Days');
  const [rangeOpen, setRangeOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState('Daily');
  const [adMetricToggle, setAdMetricToggle] = useState('Revenue');
  const [mobileNav, setMobileNav] = useState(false);
  const [isLoading] = useState(false);
  // Skeleton state available via isLoading state
  const refresh = () => {
    setIsRefreshing(true);
    window.setTimeout(() => setIsRefreshing(false), 900);
  };
  return <div className="min-h-screen bg-[var(--background)] text-foreground" style={{
    fontFamily: 'Inter, sans-serif'
  }}>
    <aside className={`${mobileNav ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-20 w-60 flex-col border-r border-border bg-[var(--sidebar)] p-5 lg:flex`}>
      <div className="mb-10 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground shadow-lg shadow-black/20">L</span><span className="text-lg font-semibold tracking-tight text-foreground">Lulu AI</span></div>
      <LuluSectionNavigation activeId="fancily-leaf-1766" />
      <div className="space-y-3 border-t border-border pt-4"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-xs font-semibold text-foreground">{accountInitial}</div><div><p className="text-sm font-medium text-foreground">{accountName}</p><p className="text-xs text-muted-foreground">{selectedWorkspace?.companyName ?? "Workspace account"}</p></div><MoreHorizontal className="ml-auto text-muted-foreground" size={16} /></div><div className="flex items-center gap-2 rounded-lg border border-chart-4/20 bg-chart-4/5 px-3 py-2 text-xs text-chart-4"><span className="h-2 w-2 rounded-full bg-chart-4" /> AI Active <span className="ml-auto text-muted-foreground">Live</span></div></div>
    </aside>
    {mobileNav && <button aria-label="Close navigation" className="fixed inset-0 z-10 bg-primary/50 lg:hidden" onClick={() => setMobileNav(false)} />}
    <main className="min-h-screen lg:ml-60"><div className="mx-auto max-w-[1400px] px-5 py-6 sm:px-8 sm:py-8">
      <header className="mb-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><button className="mb-5 lg:hidden" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu /></button><p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-foreground">Lulu AI / Overview</p><h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">Executive Dashboard</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Your real-time overview of business health, growth, performance and AI-driven priorities.</p></div><div className="flex flex-wrap items-center gap-2"><div className="relative"><button onClick={() => setRangeOpen(!rangeOpen)} className="flex h-10 items-center gap-2 rounded-lg border border-border bg-[var(--primary)] px-3 text-sm text-primary-foreground hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{selectedDateRange}<ChevronDown size={15} /></button>{rangeOpen && <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-border bg-[var(--secondary)] p-1 shadow-2xl">{ranges.map(range => <button key={range} className="block w-full rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-secondary/15 hover:text-foreground" onClick={() => {
                  setSelectedDateRange(range);
                  setRangeOpen(false);
                }}>{range}</button>)}</div>}</div><div className="relative"><button onClick={() => setCompareOpen(!compareOpen)} className={`h-10 rounded-lg border px-3 text-sm ${compareMode ? 'border-border/40 bg-secondary/15 text-primary-foreground' : 'border-border bg-[var(--primary)] text-primary-foreground'} hover:border-border text-primary-foreground`}>Compare</button>{compareOpen && <div className="absolute right-0 z-10 mt-2 w-44 rounded-lg border border-border bg-[var(--secondary)] p-1 shadow-2xl">{['Previous Period', 'Previous Year', 'Custom'].map(mode => <button key={mode} className="block w-full rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-secondary/15 hover:text-foreground" onClick={() => {
                  setCompareMode(true);
                  setCompareOpen(false);
                }}>{mode}</button>)}</div>}</div><button onClick={refresh} className="flex h-10 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground shadow-lg shadow-black/10 transition hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} /> Refresh Data</button></div></header>
      <section className="mb-5 flex flex-col justify-between gap-3 rounded-xl border border-border bg-[var(--card)] px-4 py-3 text-sm sm:flex-row sm:items-center"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-chart-4 shadow-[0_0_10px_rgba(0,0,0,.5)]" /><strong className="font-medium text-foreground">Business Status: Live</strong><span className="hidden text-muted-foreground sm:inline">— based on connected workspace data</span></div><div className="flex items-center gap-3 text-xs text-muted-foreground"><span>Updated from backend</span><button aria-label="Refresh status" onClick={refresh} className="rounded p-1 text-foreground hover:bg-secondary hover:text-foreground"><RefreshCw size={14} /></button></div></section>
      <section className="mb-7 rounded-xl border border-border border-l-2 border-l-border bg-secondary/[0.05] p-5"><div className="flex flex-col gap-4 sm:flex-row"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-xs font-bold text-foreground">AI</div><div><div className="mb-1 flex items-center gap-2"><h2 className="text-base font-semibold text-foreground">Lulu AI Executive Insight</h2><Sparkles size={15} className="text-foreground" /></div><p className="max-w-4xl text-sm leading-6 text-foreground">No AI insight has been generated from live workspace data yet.</p><div className="mt-3 flex gap-3 text-xs text-muted-foreground"><span>Live workspace insight</span><span>•</span><span>Updated from backend</span></div></div></div></section>
      <section className="mb-7"><div className="mb-3 flex items-center justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Focus now</p><h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">Today's Priorities</h2></div><button className="text-xs text-foreground hover:text-foreground">View all tasks <ArrowRight size={13} className="inline" /></button></div><div className="grid gap-2 md:grid-cols-3">{priorities.map((priority, index) => <article key={priority.title} className="flex items-center gap-3 rounded-lg border border-border bg-[var(--card)] px-4 py-3 transition hover:-translate-y-px hover:border-border"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs text-muted-foreground">{index + 1}</span><p className="flex-1 text-sm text-foreground">{priority.title}</p><button className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${priority.tone === 'danger' ? 'bg-chart-5/10 text-chart-5' : priority.tone === 'warn' ? 'bg-chart-1/10 text-chart-1' : 'bg-secondary/10 text-foreground'} hover:bg-secondary`}>{priority.action}</button></article>)}</div></section>
      <div className="grid gap-5 xl:grid-cols-2"><section className="rounded-xl border border-border bg-[var(--card)] p-5 transition hover:border-border"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Executive metric</p><h2 className="mt-1 text-lg font-semibold text-foreground">Business Health</h2></div><Gauge className="text-foreground" size={20} /></div><div className="mt-5 flex items-center gap-6"><div className="relative flex h-32 w-32 items-center justify-center"><svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label="No live business health score available"><circle cx="60" cy="60" r="49" fill="none" stroke="var(--muted-foreground)" strokeWidth="10" /><circle cx="60" cy="60" r="49" fill="none" stroke="var(--chart-2)" strokeWidth="10" strokeLinecap="round" strokeDasharray="308" strokeDashoffset="55" /></svg><span className="absolute text-center text-2xl font-bold text-foreground">—<small className="block text-[10px] font-normal text-muted-foreground">/ 100</small></span></div><div><p className="text-sm text-muted-foreground">Overall health</p><p className="mt-1 text-sm font-medium text-chart-4">No live comparison available <ArrowUpRight size={14} className="inline" /></p><p className="mt-2 text-xs text-muted-foreground">No live health summary is available yet.</p></div></div><div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3">{healthMetrics.map(metric => <div key={metric.label}><p className="text-xs text-muted-foreground">{metric.label}</p><p className="mt-1 font-semibold text-foreground">{metric.value} <span className={metric.tone === 'warn' ? 'text-chart-1' : metric.tone === 'good' ? 'text-chart-4' : 'text-muted-foreground'}>{metric.trend}</span></p></div>)}</div><div className="mt-6 border-l-2 border-chart-1 bg-chart-1/5 px-3 py-2.5"><p className="text-xs font-medium text-chart-1">Attention Required</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Advertising efficiency declined 12% compared with the previous period. <button className="text-foreground hover:underline">View Details</button></p></div></section>
      <section className="rounded-xl border border-border bg-[var(--card)] p-5 transition hover:border-border"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Momentum</p><h2 className="mt-1 text-lg font-semibold text-foreground">Growth Score</h2></div><ArrowUpRight className="text-chart-4" size={20} /></div><div className="mt-5 flex items-end justify-between"><div><p className="text-5xl font-bold tracking-[-0.05em] text-foreground">—<span className="text-xl text-muted-foreground"> / 100</span></p><p className="mt-2 text-sm text-chart-4">No live comparison available</p></div><div className="w-1/2"><div className="rounded-lg border border-dashed border-border px-3 py-5 text-center text-xs text-muted-foreground">No live growth series yet.</div></div></div><div className="mt-7 space-y-3">{growthMetrics.map((metric, index) => <div key={metric} className="flex items-center gap-3"><span className="w-36 text-xs text-muted-foreground">{metric}</span><span className="h-1.5 flex-1 rounded-full bg-secondary"><span className="block h-full rounded-full bg-primary text-primary-foreground" style={{
                    width: `${[91, 86, 82, 79, 88][index]}%`
                  }} /></span><span className="w-7 text-right text-xs text-foreground">{[91, 86, 82, 79, 88][index]}</span></div>)}</div><button className="mt-6 text-sm font-medium text-foreground hover:text-foreground">View Growth Score Details <ArrowRight size={14} className="inline" /></button></section></div>
      <section className="mt-5 rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Financial performance</p><h2 className="mt-1 text-lg font-semibold text-foreground">Revenue Overview</h2><div className="mt-4 flex items-end gap-3"><span className="text-4xl font-bold tracking-[-0.04em] text-foreground">—</span><span className="mb-1 rounded-full bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground">No live revenue</span></div><p className="mt-1 text-xs text-muted-foreground">vs previous period</p></div><div className="flex rounded-lg border border-border p-1">{['Daily', 'Weekly', 'Monthly'].map(tab => <button key={tab} onClick={() => setActiveChartTab(tab)} className={`rounded-md px-3 py-1.5 text-xs ${activeChartTab === tab ? 'bg-secondary/20 text-foreground' : 'text-foreground hover:text-foreground'}`}>{tab}</button>)}</div></div><div className="mt-5 grid gap-4 border-y border-border py-4 sm:grid-cols-4">{[['Average Order Value', '—'], ['Revenue Growth', '—'], ['Orders', '—'], ['Recurring Revenue', '—']].map(([label, value]) => <div key={label}><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold text-foreground">{value}</p></div>)}</div><div className="mt-5"><div className="mb-2 flex items-center gap-4 text-xs text-muted-foreground"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Current period</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-secondary" />Previous period</span></div><div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">No live revenue time series has been recorded.</div></div><div className="mt-4 flex flex-wrap items-center gap-4"><span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Revenue breakdown</span>{[['Product', '52%', 'bg-chart-2'], ['Subscription', '26%', 'bg-chart-4'], ['Services', '14%', 'bg-chart-1'], ['Other', '8%', 'bg-secondary']].map(([label, value, color]) => <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground"><span className={`h-2 w-2 rounded-full ${color}`} />{label} {value}</div>)}</div></section>
      <div className="mt-5 grid gap-5 xl:grid-cols-2"><section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Relationship health</p><h2 className="mt-1 text-lg font-semibold text-foreground">Customer Overview</h2></div><Users className="text-foreground" size={20} /></div><div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">{customerMetrics.map(item => {
                const [label, value] = item.split('|');
                return <div key={label}><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold text-foreground">{value}</p></div>;
              })}</div><div className="mt-5 rounded-lg border border-border bg-[var(--secondary)] p-3"><div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>Customer movement</span><span className="text-foreground">New / Returning</span></div><div className="flex h-24 items-end gap-1">{[42, 54, 47, 67, 59, 73, 62, 78, 70, 86, 81, 94].map((height, index) => <div key={height} className="flex flex-1 flex-col justify-end gap-0.5"><span className="rounded-t-sm bg-primary text-primary-foreground" style={{
                    height: `${height * .65}%`
                  }} /><span className="bg-secondary/60" style={{
                    height: `${height * .35}%`
                  }} /></div>)}</div></div><div className="mt-5 flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Customer Health</p><p className="mt-1 text-2xl font-bold text-foreground">79<span className="text-sm text-muted-foreground"> / 100</span></p></div><div className="grid grid-cols-2 gap-x-5 gap-y-2 text-xs text-muted-foreground">{['Retention 84', 'Acquisition 78', 'Engagement 76', 'Value 81'].map(item => <span key={item}>{item}</span>)}</div></div><button className="mt-5 text-sm font-medium text-foreground hover:text-foreground">View Customer Insights <ArrowRight size={14} className="inline" /></button></section>
      <section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Acquisition efficiency</p><h2 className="mt-1 text-lg font-semibold text-foreground">Marketing Performance</h2></div><Megaphone className="text-foreground" size={20} /></div><div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-5">{marketingMetrics.map(item => {
                const [label, value] = item.split('|');
                return <div key={label}><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold text-foreground">{value}</p></div>;
              })}</div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[520px] text-left text-xs"><thead className="border-b border-border text-muted-foreground"><tr>{['Channel', 'Traffic', 'Leads', 'Conversion', 'ROI', 'Trend'].map(head => <th key={head} className="pb-3 font-medium">{head}</th>)}</tr></thead><tbody>{channelRows.map(([channel, traffic, leads, conversion, roi, color]) => <tr key={channel} className="border-b border-border"><td className="py-3 text-foreground">{channel}</td><td className="py-3 text-muted-foreground">{traffic}</td><td className="py-3 text-muted-foreground">{leads}</td><td className="py-3 text-muted-foreground">{conversion}</td><td className="py-3 text-foreground">{roi}</td><td className="w-28"><Sparkline color={color === 'emerald' ? 'var(--chart-4)' : color === 'amber' ? 'var(--chart-1)' : 'var(--chart-2)'} /></td></tr>)}</tbody></table></div><button className="mt-5 text-sm font-medium text-foreground hover:text-foreground">Explore Marketing Performance <ArrowRight size={14} className="inline" /></button></section></div>
      <section className="mt-5 rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Paid acquisition</p><h2 className="mt-1 text-lg font-semibold text-foreground">Advertising Performance</h2></div><div className="flex items-center gap-2 rounded-lg border border-chart-1/20 bg-chart-1/5 px-3 py-2 text-xs text-chart-1"><AlertTriangle size={14} /> ROAS decreased 14% <button className="ml-2 font-medium text-chart-1 hover:underline">Investigate</button></div></div><div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-5">{[['Ad Spend', '€24,800'], ['ROAS', '5.2x'], ['CPA', '€31'], ['Conversions', '798'], ['Revenue from Ads', '€128,960']].map(([label, value]) => <div key={label}><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-lg font-semibold text-foreground">{value}</p></div>)}</div><div className="mt-5 grid gap-3 md:grid-cols-3">{adPlatforms.map(platform => {
              const PlatformIcon = platform.icon;
              return <article key={platform.name} className="rounded-lg border border-border bg-[var(--card)] p-4"><div className="flex items-center gap-2"><PlatformIcon size={16} className="text-foreground" /><h3 className="text-sm font-medium text-foreground">{platform.name}</h3><span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /></div><div className="mt-4 grid grid-cols-2 gap-3 text-xs"><span className="text-muted-foreground">Spend <b className="ml-1 text-foreground">{platform.spend}</b></span><span className="text-muted-foreground">Impressions <b className="ml-1 text-foreground">{platform.impressions}</b></span><span className="text-muted-foreground">Clicks <b className="ml-1 text-foreground">{platform.clicks}</b></span><span className="text-muted-foreground">CPA <b className="ml-1 text-foreground">{platform.cpa}</b></span></div><p className="mt-4 text-xs text-muted-foreground">ROAS <strong className="ml-1 text-foreground">{platform.roas}</strong></p></article>;
            })}</div><div className="mt-5 flex items-center justify-between"><p className="text-xs text-muted-foreground">Spend vs {adMetricToggle.toLowerCase()} over time</p><div className="flex rounded-md border border-border p-0.5">{['Revenue', 'Spend'].map(metric => <button key={metric} onClick={() => setAdMetricToggle(metric)} className={`rounded px-2 py-1 text-xs ${adMetricToggle === metric ? 'bg-secondary/20 text-foreground' : 'text-foreground'}`}>{metric}</button>)}</div></div><AreaChart secondary /></section>
      <div className="mt-5 grid gap-5 xl:grid-cols-2"><section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex items-center gap-2"><span className="rounded-full bg-secondary/10 px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-foreground">AI</span><h2 className="text-lg font-semibold text-foreground">AI Opportunities</h2></div><div className="mt-4 space-y-2">{opportunities.map(opportunity => <article key={opportunity.title} className="rounded-lg border border-border bg-[var(--card)] p-4 transition hover:border-border/30"><div className="flex gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-foreground"><Sparkles size={15} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap justify-between gap-2"><h3 className="text-sm font-medium text-foreground">{opportunity.title}</h3><span className="text-lg font-semibold text-foreground">{opportunity.score}</span></div><div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground"><span>{opportunity.category}</span><span>•</span><span className="text-foreground">{opportunity.level} impact</span><span>•</span><span>{opportunity.confidence} confidence</span></div><button className="mt-3 text-xs font-medium text-foreground hover:text-foreground">View Opportunity <ArrowRight size={13} className="inline" /></button></div></div></article>)}</div><button className="mt-5 text-sm font-medium text-foreground hover:text-foreground">View Opportunity Center <ArrowRight size={14} className="inline" /></button></section>
      <section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Execution queue</p><h2 className="mt-1 text-lg font-semibold text-foreground">Priority Tasks</h2></div><span className="rounded-full bg-chart-5/10 px-2 py-1 text-xs text-chart-5">1 overdue</span></div><div className="mt-4 space-y-1">{tasks.map(task => <article key={task.title} className={`flex items-start gap-3 rounded-lg p-3 ${task.overdue ? 'bg-chart-5/10' : 'hover:bg-secondary'}`}><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${task.priority === 'Critical' ? 'bg-destructive' : task.priority === 'High' ? 'bg-chart-1' : 'bg-secondary'}`} /><div className="min-w-0 flex-1"><h3 className="text-sm text-foreground">{task.title}</h3><p className="mt-1 text-xs text-muted-foreground">{task.priority} · Due: {task.due} · {task.owner}</p></div><span className={`shrink-0 rounded px-2 py-1 text-[11px] ${task.status === 'In Progress' ? 'bg-secondary/10 text-foreground' : task.priority === 'Critical' ? 'bg-chart-5/10 text-chart-5' : 'bg-secondary text-muted-foreground'}`}>{task.status}</span></article>)}</div><button className="mt-5 text-sm font-medium text-foreground hover:text-foreground">View AI Tasks <ArrowRight size={14} className="inline" /></button></section></div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2"><section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Live feed</p><h2 className="mt-1 text-lg font-semibold text-foreground">Recent Activity</h2></div><Activity className="text-muted-foreground" size={18} /></div><div className="mt-4 space-y-1">{activities.map(([title, desc, time, tone, ActivityIcon]) => <article key={title} className="flex gap-3 rounded-lg px-2 py-2.5 hover:bg-secondary"><span className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${tone === 'amber' ? 'bg-chart-1/10 text-chart-1' : tone === 'emerald' ? 'bg-secondary/10 text-foreground' : tone === 'blue' ? 'bg-secondary/10 text-foreground' : 'bg-secondary/10 text-foreground'}`}><ActivityIcon size={14} /></span><div className="flex-1"><h3 className="text-sm text-foreground">{title}</h3><p className="mt-0.5 text-xs text-muted-foreground">{desc}</p></div><time className="text-[11px] text-muted-foreground">{time}</time></article>)}</div><button className="mt-4 text-sm font-medium text-foreground hover:text-foreground">View Activity Timeline <ArrowRight size={14} className="inline" /></button></section>
      <section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">System connections</p><h2 className="mt-1 text-lg font-semibold text-foreground">Integration Health</h2></div><div className="text-right text-xs"><span className="text-foreground">8 Connected</span><span className="ml-2 text-chart-4">7 Healthy</span><span className="ml-2 text-chart-1">1 Attention</span></div></div><div className="mt-4 grid grid-cols-1 gap-1 sm:grid-cols-2">{integrations.map(([name, status, sync, IntegrationIcon]) => <div key={name} className={`flex items-center gap-2 rounded-md px-2 py-2 text-xs ${status !== 'Connected' ? 'bg-chart-1/5' : ''}`}><IntegrationIcon size={14} className="text-muted-foreground" /><span className="flex-1 text-foreground">{name}</span><span className={status === 'Connected' ? 'text-chart-4' : 'text-foreground'}>{status === 'Connected' ? '✓' : '⚠'}</span><span className="w-16 text-right text-muted-foreground">{sync}</span></div>)}</div><div className="mt-4 border-l-2 border-chart-1 bg-chart-1/5 px-3 py-2"><p className="text-xs text-chart-1">No live integration alert has been reported.</p><button className="mt-1 text-xs text-foreground hover:underline">View Integrations</button></div><button className="mt-4 text-sm font-medium text-foreground hover:text-foreground">Manage Integrations <ArrowRight size={14} className="inline" /></button></section></div>
      <section className="mt-5 flex flex-col justify-between gap-4 rounded-xl border border-border/20 bg-secondary/[0.06] p-5 sm:flex-row sm:items-center"><div><h2 className="text-lg font-semibold text-foreground">Explore Your KPIs</h2><p className="mt-1 text-sm text-muted-foreground">Explore, compare and analyze the metrics behind your business performance.</p></div><button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-black/10 transition hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Open KPI Explorer <ArrowRight size={15} /></button></section>
      {isLoading && <div className="mt-5 h-24 animate-pulse rounded-xl bg-card/50" aria-label="Loading dashboard" />}
    </div></main>
  </div>;
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
export function LuluSectionNavigation({
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
