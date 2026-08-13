import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, CalendarDays, Check, ChevronDown, ChevronRight, CircleHelp, Clock3, Download, ExternalLink, Filter, Flame, Layers3, LineChart, Menu, MoreHorizontal, PanelRight, Pause, Play, Plus, RefreshCw, Search, Settings2, ShieldAlert, SlidersHorizontal, Sparkles, Target, TrendingUp, UserRound, WalletCards, X, Zap } from 'lucide-react';
type CampaignStatus = 'Active' | 'Paused' | 'Draft' | 'Completed' | 'Scheduled' | 'Error';
type Campaign = {
  name: string;
  platform: string;
  status: CampaignStatus;
  objective: string;
  spend: string;
  impressions: string;
  clicks: string;
  ctr: string;
  cpc: string;
  conversions: string;
  cpa: string;
  revenue: string;
  roas: string;
  budget: string;
  trend: string;
  updated: string;
};
type Tone = 'green' | 'yellow' | 'red' | 'purple' | 'blue' | 'gray';
const campaigns: Campaign[] = [{
  name: 'Q4 Enterprise Expansion',
  platform: 'Google Ads',
  status: 'Active',
  objective: 'Sales',
  spend: '$84,240',
  impressions: '1.24M',
  clicks: '34,810',
  ctr: '2.81%',
  cpc: '$2.42',
  conversions: '842',
  cpa: '$100.05',
  revenue: '$284,910',
  roas: '3.38x',
  budget: '$100k',
  trend: '+18.4%',
  updated: '12 min ago'
}, {
  name: 'Winter Demand Gen',
  platform: 'Meta Ads',
  status: 'Active',
  objective: 'Leads',
  spend: '$51,680',
  impressions: '892k',
  clicks: '29,441',
  ctr: '3.30%',
  cpc: '$1.76',
  conversions: '1,104',
  cpa: '$46.81',
  revenue: '$168,520',
  roas: '3.26x',
  budget: '$60k',
  trend: '+12.1%',
  updated: '18 min ago'
}, {
  name: 'Product-Led Retargeting',
  platform: 'LinkedIn Ads',
  status: 'Paused',
  objective: 'Conversions',
  spend: '$28,450',
  impressions: '188k',
  clicks: '7,920',
  ctr: '4.21%',
  cpc: '$3.59',
  conversions: '318',
  cpa: '$89.47',
  revenue: '$72,110',
  roas: '2.53x',
  budget: '$35k',
  trend: '-4.7%',
  updated: '1 hr ago'
}, {
  name: 'Brand Search — Core',
  platform: 'Google Ads',
  status: 'Active',
  objective: 'Traffic',
  spend: '$19,860',
  impressions: '68k',
  clicks: '12,910',
  ctr: '18.98%',
  cpc: '$1.54',
  conversions: '522',
  cpa: '$38.05',
  revenue: '$94,600',
  roas: '4.76x',
  budget: '$22k',
  trend: '+9.8%',
  updated: '34 min ago'
}, {
  name: 'Partner Awareness Test',
  platform: 'Microsoft Advertising',
  status: 'Scheduled',
  objective: 'Awareness',
  spend: '$0',
  impressions: 'No Data',
  clicks: 'No Data',
  ctr: 'No Data',
  cpc: 'No Data',
  conversions: 'No Data',
  cpa: 'No Data',
  revenue: 'No Data',
  roas: 'No Data',
  budget: '$12k',
  trend: '—',
  updated: 'Yesterday'
}];
const platforms = [{
  name: 'Google Ads',
  initials: 'G',
  tone: 'bg-secondary text-foreground',
  spend: '$104,100',
  revenue: '$379,510',
  roas: '3.65x',
  conversions: '1,364',
  cpa: '$76.32',
  status: 'Healthy'
}, {
  name: 'Meta Ads',
  initials: 'M',
  tone: 'bg-secondary text-foreground',
  spend: '$51,680',
  revenue: '$168,520',
  roas: '3.26x',
  conversions: '1,104',
  cpa: '$46.81',
  status: 'Healthy'
}, {
  name: 'LinkedIn Ads',
  initials: 'in',
  tone: 'bg-secondary text-foreground',
  spend: '$28,450',
  revenue: '$72,110',
  roas: '2.53x',
  conversions: '318',
  cpa: '$89.47',
  status: 'Watch'
}];
const navItems = [{
  label: 'Overview',
  icon: BarChart3
}, {
  label: 'Advertising',
  icon: Target,
  active: true
}, {
  label: 'Audiences',
  icon: UserRound
}, {
  label: 'Creatives',
  icon: Layers3
}, {
  label: 'Attribution',
  icon: Activity
}];
const chartValues = [46, 51, 44, 58, 62, 57, 68, 73, 66, 79, 76, 86, 81, 93, 88, 97, 92, 105, 99, 112, 108, 118, 114, 126, 121, 132, 127, 141, 136, 150];
const statusStyles: Record<CampaignStatus, string> = {
  Active: 'bg-chart-4/10 text-chart-4 border-chart-4/30',
  Paused: 'bg-secondary text-foreground border-border',
  Draft: 'bg-secondary text-muted-foreground border-border',
  Completed: 'bg-secondary text-foreground border-border',
  Scheduled: 'bg-secondary text-foreground border-border',
  Error: 'bg-chart-5/10 text-chart-5 border-chart-5/30'
};
const toneDot: Record<Tone, string> = {
  green: 'bg-chart-4',
  yellow: 'bg-primary',
  red: 'bg-destructive',
  purple: 'bg-primary',
  blue: 'bg-primary',
  gray: 'bg-muted'
};
function StatusPill({
  status
}: {
  status: CampaignStatus;
}) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}><span className={`h-1.5 w-1.5 rounded-full ${status === 'Active' ? 'bg-chart-4' : status === 'Paused' ? 'bg-primary' : status === 'Error' ? 'bg-destructive' : 'bg-current'}`} />{status}</span>;
}
function SectionHeading({
  eyebrow,
  title,
  action
}: {
  eyebrow?: string;
  title: string;
  action?: string;
}) {
  return <div className="mb-5 flex items-end justify-between gap-3"><div>{eyebrow && <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-foreground">{eyebrow}</p>}<h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2></div>{action && <button className="text-sm font-semibold text-foreground hover:text-foreground">{action}<ChevronRight className="ml-1 inline h-4 w-4" /></button>}</div>;
}
function MetricCard({
  label,
  value,
  change,
  icon,
  tone = 'purple',
  note = 'Observed'
}: {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  tone?: Tone;
  note?: string;
}) {
  const positive = change.startsWith('+');
  return <article className="rounded-2xl border border-border bg-card p-4 shadow-[0_4px_18px_rgba(0,0,0,0.04)]"><div className="flex items-start justify-between"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">{icon}</div><span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{note}</span></div><p className="mt-4 text-xs font-medium text-muted-foreground">{label}</p><strong className="mt-1 block text-[25px] font-bold tracking-tight text-foreground">{value}</strong><div className="mt-2 flex items-center gap-1 text-xs font-semibold"><span className={positive ? 'text-chart-4' : 'text-chart-5'}>{positive ? <ArrowUpRight className="inline h-3.5 w-3.5" /> : <ArrowDownRight className="inline h-3.5 w-3.5" />}{change}</span><span className="text-muted-foreground">vs previous period</span></div></article>;
}
export function AdvertisingWorkspace() {
  const [range, setRange] = useState('Last 30 Days');
  const [platform, setPlatform] = useState('All Platforms');
  const [metric, setMetric] = useState('Spend');
  const [compare, setCompare] = useState('Previous Period');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [aiOpen, setAiOpen] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const filteredCampaigns = useMemo(() => campaigns.filter(campaign => (platform === 'All Platforms' || campaign.platform === platform) && campaign.name.toLowerCase().includes(query.toLowerCase())), [platform, query]);
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className={`fixed inset-y-0 left-0 z-30 flex w-[232px] flex-col bg-[var(--sidebar)] px-4 py-5 text-foreground transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}><div className="mb-10 flex items-center gap-2 px-2 text-foreground"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">L</div><span className="text-lg font-bold tracking-tight">LULU <em className="font-normal not-italic text-foreground">AI</em></span></div><p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Workspace</p><nav className="mt-3 space-y-1" aria-label="Workspace navigation">{navItems.map(item => {
          const Icon = item.icon;
          return <button key={item.label} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${item.active ? 'bg-secondary text-foreground' : 'hover:bg-secondary hover:text-foreground'}`}><Icon className={`h-4 w-4 ${item.active ? 'text-foreground' : 'text-muted-foreground'}`} /><span>{item.label}</span>{item.active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" />}</button>;
        })}</nav><div className="mt-auto rounded-2xl border border-border bg-secondary p-3"><div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-chart-4" /><span className="text-xs font-semibold text-foreground">3 platforms connected</span></div><p className="mt-2 text-xs leading-5 text-muted-foreground">Data last synced 12 minutes ago.</p><button onClick={() => setShowConnect(true)} className="mt-3 text-xs font-semibold text-foreground">Manage connections <ChevronRight className="inline h-3 w-3" /></button></div><div className="mt-4 flex items-center gap-3 border-t border-border pt-4"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">AM</div><div className="min-w-0"><p className="truncate text-xs font-semibold text-foreground">Ava Morgan</p><p className="text-[11px] text-muted-foreground">Admin workspace</p></div><Settings2 className="ml-auto h-4 w-4 text-muted-foreground" /></div></aside>
    <main className="min-h-screen lg:ml-[232px]"><header className="sticky top-0 z-20 border-b border-border bg-[var(--secondary)]/95 px-5 py-4 backdrop-blur-md sm:px-8"><div className="mx-auto flex max-w-[1550px] items-center justify-between gap-4"><div className="flex items-center gap-3"><button aria-label="Open navigation" onClick={() => setMobileNav(true)} className="rounded-lg p-2 hover:bg-card lg:hidden"><Menu className="h-5 w-5" /></button><div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span>Marketing</span><ChevronRight className="h-3.5 w-3.5" /><strong className="text-foreground">Advertising</strong></div></div><div className="flex items-center gap-2"><button onClick={() => setShowCreate(true)} className="hidden items-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary sm:flex"><Plus className="h-4 w-4" />Create Campaign</button><button onClick={() => setShowConnect(true)} className="hidden rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground hover:border-border sm:block">Connect Platform</button><button aria-label="Export" className="rounded-xl border border-border bg-card p-2.5 text-foreground hover:text-foreground"><Download className="h-4 w-4" /></button><button aria-label="Refresh data" className="rounded-xl border border-border bg-card p-2.5 text-foreground hover:text-foreground"><RefreshCw className="h-4 w-4" /></button><button onClick={() => setAiOpen(!aiOpen)} className="hidden items-center gap-2 rounded-xl border border-border bg-secondary px-3.5 py-2.5 text-sm font-bold text-foreground hover:bg-secondary md:flex"><Sparkles className="h-4 w-4" />Ask Lulu AI</button><Bell className="ml-2 hidden h-5 w-5 text-muted-foreground sm:block" /></div></div></header>
      <div className="mx-auto max-w-[1550px] px-5 py-7 sm:px-8"><div className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-2 text-sm font-semibold text-foreground">Marketing / Advertising</p><h1 className="text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">Advertising</h1><p className="mt-2 max-w-xl text-sm text-muted-foreground">Manage, monitor and optimize your paid advertising performance across connected platforms.</p></div><div className="flex flex-wrap items-center gap-2"><label className="sr-only" htmlFor="date-range">Date range</label><div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5"><CalendarDays className="h-4 w-4 text-muted-foreground" /><select id="date-range" value={range} onChange={e => setRange(e.target.value)} className="bg-transparent text-sm font-semibold text-foreground outline-none"><option>Today</option><option>Yesterday</option><option>Last 7 Days</option><option>Last 30 Days</option><option>Last 90 Days</option><option>Year to Date</option><option>Previous Year</option><option>Custom Range</option></select><span className="hidden border-l border-border pl-2 text-xs text-muted-foreground sm:inline">vs Previous Period</span></div><label className="sr-only" htmlFor="platform-filter">Platform filter</label><select id="platform-filter" value={platform} onChange={e => setPlatform(e.target.value)} className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground outline-none"><option>All Platforms</option><option>Google Ads</option><option>Meta Ads</option><option>Microsoft Advertising</option><option>LinkedIn Ads</option></select></div></div>
        <section aria-labelledby="kpi-title"><div className="mb-3 flex items-center justify-between"><h2 id="kpi-title" className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">Executive performance · {range}</h2><span className="text-xs text-muted-foreground">Updated 12 minutes ago</span></div><div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8"><MetricCard label="Advertising Spend" value="$184,230" change="+14.8%" icon={<WalletCards className="h-4 w-4" />} /><MetricCard label="Advertising Revenue" value="$620,140" change="+22.4%" icon={<TrendingUp className="h-4 w-4" />} /><MetricCard label="ROAS" value="3.37x" change="+6.6%" icon={<Zap className="h-4 w-4" />} /><MetricCard label="Conversions" value="2,786" change="+11.2%" icon={<Target className="h-4 w-4" />} /><MetricCard label="CPA / CAC" value="$66.11" change="-3.2%" icon={<CircleHelp className="h-4 w-4" />} /><MetricCard label="CTR" value="4.84%" change="+0.8%" icon={<Activity className="h-4 w-4" />} /><MetricCard label="CPC" value="$2.19" change="-5.1%" icon={<LineChart className="h-4 w-4" />} /><MetricCard label="Conversion Rate" value="8.01%" change="+1.4%" icon={<Sparkles className="h-4 w-4" />} /></div></section>
        <div className="mt-8 grid gap-6 2xl:grid-cols-[minmax(0,1fr)_350px]"><div className="min-w-0 space-y-8"><section className="rounded-2xl border border-border bg-card p-5 shadow-[0_4px_18px_rgba(0,0,0,0.04)] sm:p-6"><SectionHeading eyebrow="Observed performance" title="Advertising performance overview" action="View report" /><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-1 rounded-xl bg-secondary p-1">{['Spend', 'Revenue', 'ROAS', 'Conversions', 'CPA', 'CTR', 'CPC'].map(item => <button key={item} onClick={() => setMetric(item)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${metric === item ? 'bg-card text-foreground shadow-sm' : 'text-foreground hover:text-foreground'}`}>{item}</button>)}</div><div className="flex items-center gap-1 text-xs"><span className="text-muted-foreground">Compare</span>{['Previous Period', 'Previous Year'].map(item => <button key={item} onClick={() => setCompare(item)} className={`rounded-lg px-2.5 py-1.5 font-semibold ${compare === item ? 'bg-secondary text-foreground' : 'text-foreground'}`}>{item.replace('Previous ', 'Prev. ')}</button>)}</div></div><div className="flex h-[240px] items-end gap-1 border-b border-l border-border bg-[linear-gradient(to_bottom,transparent_24%,var(--secondary)_25%,transparent_26%,transparent_49%,var(--secondary)_50%,transparent_51%,transparent_74%,var(--background)_75%,transparent_76%)] px-2 pb-0 sm:gap-2">{chartValues.map((height, i) => <div key={`${height}-${i}`} title={`${metric} on ${i + 1} Jun: $${height * 100}`} className="group flex h-full flex-1 items-end"><div style={{
                    height: `${height / 1.5}%`
                  }} className="w-full rounded-t-[3px] bg-secondary/75 transition-all group-hover:bg-primary" /></div>)}</div><div className="mt-3 flex justify-between text-[11px] text-muted-foreground"><span>01 Jun</span><span>08 Jun</span><span>15 Jun</span><span>22 Jun</span><span>30 Jun</span></div><p className="mt-4 text-xs text-muted-foreground"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />{metric} · {compare} · Tooltip values are observed from connected platforms.</p></section>
          <section><SectionHeading eyebrow="Connected platforms" title="Platform performance" action="View all platforms" /><div className="grid gap-3 lg:grid-cols-3">{platforms.map(item => <article key={item.name} className="rounded-2xl border border-border bg-card p-4"><div className="flex items-center gap-3"><div className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${item.tone}`}>{item.initials}</div><div><h3 className="text-sm font-bold text-foreground">{item.name}</h3><p className="text-xs text-foreground"><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" />{item.status}</p></div><button className="ml-auto text-foreground"><MoreHorizontal className="h-4 w-4" /></button></div><div className="mt-5 grid grid-cols-2 gap-y-4"><div><p className="text-[11px] text-muted-foreground">Spend</p><strong className="text-sm">{item.spend}</strong></div><div><p className="text-[11px] text-muted-foreground">Revenue</p><strong className="text-sm">{item.revenue}</strong></div><div><p className="text-[11px] text-muted-foreground">ROAS</p><strong className="text-sm text-foreground">{item.roas}</strong></div><div><p className="text-[11px] text-muted-foreground">Conversions</p><strong className="text-sm">{item.conversions}</strong></div></div><div className="mt-5 flex gap-2 border-t border-border pt-3"><button className="flex-1 rounded-lg border border-border py-2 text-xs font-semibold">View Platform</button><button className="flex-1 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground">Campaigns</button></div></article>)}</div></section>
          <section className="rounded-2xl border border-border bg-card shadow-[0_4px_18px_rgba(0,0,0,0.04)]"><div className="p-5 pb-3 sm:p-6 sm:pb-3"><SectionHeading eyebrow="Enterprise view" title="Campaign performance" /><div className="flex flex-col gap-3 lg:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search campaigns" className="w-full rounded-xl border border-border py-2.5 pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2" /></div><button className="flex items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm font-semibold text-foreground"><Filter className="h-4 w-4" />Filters</button><button className="flex items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm font-semibold text-foreground"><SlidersHorizontal className="h-4 w-4" />Columns</button></div></div><div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[1120px] text-left text-xs"><thead className="border-y border-border bg-card text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Campaign', 'Platform', 'Status', 'Objective', 'Spend', 'CTR', 'Conversions', 'CPA', 'Revenue', 'ROAS', 'Budget', 'Trend', 'Updated', ''].map(head => <th key={head} className="whitespace-nowrap px-4 py-3 font-bold">{head}</th>)}</tr></thead><tbody>{filteredCampaigns.map(campaign => <tr key={campaign.name} className="border-b border-border last:border-0 hover:bg-secondary/30"><td className="px-4 py-4"><button onClick={() => setSelected(campaign)} className="text-left font-bold text-foreground hover:text-foreground">{campaign.name}<span className="mt-1 block text-[10px] font-normal text-muted-foreground">{campaign.objective} campaign</span></button></td><td className="whitespace-nowrap px-4 py-4 text-muted-foreground">{campaign.platform}</td><td className="px-4 py-4"><StatusPill status={campaign.status} /></td><td className="px-4 py-4 text-muted-foreground">{campaign.objective}</td><td className="px-4 py-4 font-semibold">{campaign.spend}</td><td className="px-4 py-4">{campaign.ctr}</td><td className="px-4 py-4">{campaign.conversions}</td><td className="px-4 py-4">{campaign.cpa}</td><td className="px-4 py-4">{campaign.revenue}</td><td className="px-4 py-4 font-bold text-foreground">{campaign.roas}</td><td className="px-4 py-4">{campaign.budget}</td><td className={`px-4 py-4 font-semibold ${campaign.trend.startsWith('+') ? 'text-chart-4' : 'text-chart-5'}`}>{campaign.trend}</td><td className="whitespace-nowrap px-4 py-4 text-muted-foreground">{campaign.updated}</td><td className="px-4 py-4"><button onClick={() => setSelected(campaign)} aria-label={`Open ${campaign.name}`} className="rounded-lg p-1.5 hover:bg-secondary"><ChevronRight className="h-4 w-4" /></button></td></tr>)}</tbody></table></div><div className="space-y-3 p-4 md:hidden">{filteredCampaigns.map(campaign => <button key={campaign.name} onClick={() => setSelected(campaign)} className="w-full rounded-xl border border-border p-4 text-left"><div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-bold">{campaign.name}</h3><p className="mt-1 text-xs text-muted-foreground">{campaign.platform} · {campaign.objective}</p></div><StatusPill status={campaign.status} /></div><div className="mt-4 grid grid-cols-3 gap-3"><div><p className="text-[10px] text-muted-foreground">Spend</p><strong className="text-sm">{campaign.spend}</strong></div><div><p className="text-[10px] text-muted-foreground">ROAS</p><strong className="text-sm text-foreground">{campaign.roas}</strong></div><div><p className="text-[10px] text-muted-foreground">CPA</p><strong className="text-sm">{campaign.cpa}</strong></div></div></button>)}</div></section>
          <section className="grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border border-border bg-card p-5"><SectionHeading eyebrow="Conversion path" title="Advertising funnel" /><div className="space-y-3">{[{
                    label: 'Impressions',
                    value: '2.31M',
                    rate: 'Observed'
                  }, {
                    label: 'Clicks',
                    value: '72,171',
                    rate: '3.12% of impressions'
                  }, {
                    label: 'Landing page visits',
                    value: '61,480',
                    rate: '85.2% of clicks'
                  }, {
                    label: 'Conversions',
                    value: '2,786',
                    rate: '4.53% of visits'
                  }, {
                    label: 'Revenue',
                    value: '$620,140',
                    rate: 'Observed attribution'
                  }].map((item, i) => <div key={item.label} className="flex items-center gap-3"><div className="h-9 rounded-lg bg-secondary" style={{
                      width: `${100 - i * 13}%`
                    }} /><div className="flex min-w-[145px] items-center justify-between gap-3"><span className="text-xs font-semibold text-foreground">{item.label}</span><strong className="text-xs">{item.value}</strong></div><span className="hidden text-[10px] text-muted-foreground sm:block">{item.rate}</span></div>)}</div></div><div className="rounded-2xl border border-border bg-card p-5"><SectionHeading eyebrow="Attribution" title="Advertising attribution" /><div className="rounded-xl bg-card p-4"><p className="text-xs text-muted-foreground">Attribution model</p><div className="mt-2 flex flex-wrap gap-2">{['Platform attribution', 'Last Click', 'First Click', 'Data-driven'].map((item, i) => <button key={item} className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${i === 0 ? 'border-border bg-secondary text-foreground' : 'border-border bg-card text-foreground'}`}>{item}</button>)}</div></div><div className="mt-5 grid grid-cols-2 gap-4"><div><p className="text-xs text-muted-foreground">Conversion source</p><strong className="text-sm">Connected platforms</strong></div><div><p className="text-xs text-muted-foreground">Attributed revenue</p><strong className="text-sm">$620,140</strong></div></div><p className="mt-5 text-xs leading-5 text-muted-foreground">Platform attribution may differ from your analytics or finance systems. Compare models before making decisions.</p></div></section>
          <section className="grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border border-border bg-card p-5"><SectionHeading eyebrow="AI Opportunity" title="Advertising opportunities" action="View all" />{[{
                  title: 'Scale Q4 Enterprise Expansion',
                  evidence: '3.38x ROAS · 18.4% weekly lift',
                  platform: 'Google Ads',
                  tone: 'green' as Tone
                }, {
                  title: 'High-converting audience has limited budget',
                  evidence: 'CPA 24% below account average',
                  platform: 'Meta Ads',
                  tone: 'purple' as Tone
                }].map(item => <div key={item.title} className="mb-3 rounded-xl border border-border p-3.5 last:mb-0"><div className="flex gap-3"><div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${toneDot[item.tone]}`} /><div className="min-w-0"><p className="text-sm font-bold">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.evidence}</p><p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-foreground">{item.platform} · AI Inferred</p></div><button className="ml-auto self-start text-xs font-bold text-foreground">Review</button></div></div>)}</div><div className="rounded-2xl border border-chart-5/30 bg-chart-5/40 p-5"><SectionHeading eyebrow="AI Risk" title="Advertising risks" action="View all" />{[{
                  title: 'Spend increased while conversions declined',
                  evidence: '+22% spend · -8% conversions',
                  tone: 'red' as Tone
                }, {
                  title: 'Budget limit approaching',
                  evidence: 'Product-Led Retargeting at 81% utilization',
                  tone: 'yellow' as Tone
                }].map(item => <div key={item.title} className="mb-3 rounded-xl border border-chart-5/30 bg-secondary p-3.5 last:mb-0"><div className="flex gap-3"><AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${item.tone === 'red' ? 'text-chart-5' : 'text-foreground'}`} /><div><p className="text-sm font-bold">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.evidence}</p><p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-chart-5">AI Detected · Review required</p></div><button className="ml-auto self-start text-xs font-bold text-foreground">Review</button></div></div>)}</div></section>
          <section className="rounded-2xl border border-border bg-[var(--card)] p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-foreground">AI-generated · Advertising insights</p><h2 className="text-lg font-bold text-foreground">Lulu AI Recommendations</h2><p className="mt-1 text-sm text-muted-foreground">Decision support grounded in your connected advertising data.</p></div><Sparkles className="h-6 w-6 text-foreground" /></div><div className="mt-5 grid gap-3 md:grid-cols-3">{['Review budget allocation for underperforming campaigns.', 'Consider increasing exposure for high-performing campaigns.', 'Test new creative variations against campaign average.'].map(item => <article key={item} className="rounded-xl border border-border bg-card p-4"><p className="text-sm font-semibold leading-5">{item}</p><p className="mt-2 text-[11px] text-muted-foreground">Observed data · Confidence 92% · 12 min ago</p><button className="mt-4 text-xs font-bold text-foreground">Review recommendation <ChevronRight className="inline h-3 w-3" /></button></article>)}</div><p className="mt-4 text-[11px] text-foreground">Lulu AI never modifies budgets or campaigns without your explicit authorization.</p></section>
        </div>
        <aside className={`${aiOpen ? 'block' : 'hidden'} rounded-2xl border border-border bg-card p-5 shadow-[0_4px_18px_rgba(0,0,0,0.04)] 2xl:block`}><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Sparkles className="h-5 w-5" /></div><div><h2 className="font-bold">Ask Lulu AI</h2><p className="text-xs text-muted-foreground">Advertising intelligence</p></div><button onClick={() => setAiOpen(false)} className="ml-auto rounded-lg p-1 text-foreground hover:bg-secondary 2xl:hidden"><X className="h-4 w-4" /></button></div><div className="mt-6 rounded-2xl bg-[var(--secondary)] p-4 text-foreground"><p className="text-sm font-semibold leading-6">Get a clear read on your advertising performance.</p><p className="mt-2 text-xs leading-5 text-foreground">I can analyze campaigns, budget efficiency, attribution, and creative performance.</p></div><p className="mt-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Suggested prompts</p><div className="mt-3 space-y-2">{['Which campaigns should I optimize first?', 'Where are we wasting budget?', 'Which campaign has best scaling potential?', 'Why did ROAS decline?', 'Which creatives should we replace?', 'How should I allocate the advertising budget?'].map(prompt => <button key={prompt} className="flex w-full items-center justify-between rounded-xl border border-border p-3 text-left text-xs font-semibold text-foreground hover:border-border hover:bg-secondary">{prompt}<ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" /></button>)}</div><div className="mt-6 flex items-center gap-2 rounded-xl border border-border px-3 py-2"><input aria-label="Ask Lulu AI a question" placeholder="Ask about your ads..." className="min-w-0 flex-1 text-xs outline-none" /><button aria-label="Send question" className="rounded-lg bg-primary p-2 text-primary-foreground"><Zap className="h-3.5 w-3.5" /></button></div><p className="mt-3 text-center text-[10px] text-muted-foreground">AI-generated responses · Always review before acting</p></aside></div>
      </div></main>
      {selected && <div className="fixed inset-0 z-40 flex justify-end bg-sidebar/30" role="dialog" aria-modal="true" aria-labelledby="detail-title"><aside className="h-full w-full max-w-[640px] overflow-y-auto bg-card p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-foreground">Campaign detail</p><h2 id="detail-title" className="mt-1 text-2xl font-bold tracking-tight">{selected.name}</h2><p className="mt-1 text-sm text-muted-foreground">{selected.platform} · {selected.objective}</p></div><button onClick={() => setSelected(null)} aria-label="Close campaign detail" className="rounded-xl border border-border p-2"><X className="h-5 w-5" /></button></div><div className="mt-5 flex flex-wrap gap-2"><StatusPill status={selected.status} /><button className="rounded-full border border-border px-3 py-1 text-xs font-semibold">Edit Campaign</button><button className="rounded-full border border-border px-3 py-1 text-xs font-semibold">{selected.status === 'Paused' ? 'Resume' : 'Pause'}</button><button className="rounded-full border border-border px-3 py-1 text-xs font-semibold">Duplicate</button></div><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">{[{
            l: 'Spend',
            v: selected.spend
          }, {
            l: 'Revenue',
            v: selected.revenue
          }, {
            l: 'ROAS',
            v: selected.roas
          }, {
            l: 'Conversions',
            v: selected.conversions
          }, {
            l: 'Impressions',
            v: selected.impressions
          }, {
            l: 'Reach',
            v: 'No Data'
          }, {
            l: 'CTR',
            v: selected.ctr
          }, {
            l: 'CPA',
            v: selected.cpa
          }].map(item => <div key={item.l} className="rounded-xl bg-card p-3"><p className="text-[11px] text-muted-foreground">{item.l}</p><strong className="mt-1 block text-sm">{item.v}</strong></div>)}</div><div className="mt-7"><SectionHeading title="Budget performance" /><div className="mb-3 flex justify-between text-xs"><span className="text-muted-foreground">{selected.spend} spent of {selected.budget}</span><strong className="text-chart-4">On track</strong></div><div className="h-2 rounded-full bg-secondary"><div className="h-2 w-[78%] rounded-full bg-primary text-primary-foreground" /></div><div className="mt-4 grid grid-cols-3 gap-3 text-xs"><div><p className="text-muted-foreground">Remaining</p><strong>$15,760</strong></div><div><p className="text-muted-foreground">Daily budget</p><strong>$3,333</strong></div><div><p className="text-muted-foreground">Projected spend</p><strong>$96,420</strong></div></div></div><div className="mt-7"><SectionHeading title="Ad set / ad group performance" /><div className="overflow-x-auto"><table className="w-full min-w-[430px] text-left text-xs"><thead className="border-b border-border text-[10px] uppercase text-muted-foreground"><tr><th className="py-2">Name</th><th>Audience</th><th>Spend</th><th>CPA</th><th>ROAS</th></tr></thead><tbody>{['Enterprise decision makers', 'High-intent visitors', 'Lookalike · 1%'].map((name, i) => <tr key={name} className="border-b border-border"><td className="py-3 font-semibold">{name}</td><td className="text-muted-foreground">B2B core</td><td>${[42210, 25140, 16890][i].toLocaleString()}</td><td>$ {[91, 108, 112][i]}</td><td className="font-bold text-foreground">{[3.8, 3.1, 2.9][i]}x</td></tr>)}</tbody></table></div></div><div className="mt-7 rounded-xl border border-border bg-secondary p-4"><p className="text-xs font-bold text-foreground">AI Advertising Insight · AI Inferred</p><p className="mt-1 text-sm font-semibold">This campaign has room to scale while remaining within its target CPA.</p><p className="mt-2 text-xs text-foreground">Data source: connected platform · Confidence 92% · 12 min ago</p><button onClick={() => setAiOpen(true)} className="mt-3 text-xs font-bold text-foreground">Ask Lulu AI about this campaign <ChevronRight className="inline h-3 w-3" /></button></div></aside></div>}
      {showCreate && <div className="fixed inset-0 z-50 flex items-center justify-center bg-sidebar/40 p-4" role="dialog" aria-modal="true" aria-labelledby="create-title"><div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-foreground">Step 1 of 6</p><h2 id="create-title" className="mt-1 text-xl font-bold">Create campaign</h2></div><button onClick={() => setShowCreate(false)} aria-label="Close create campaign dialog"><X className="h-5 w-5 text-muted-foreground" /></button></div><div className="mt-6 flex gap-1">{['Platform', 'Objective', 'Details', 'Audience', 'Creative', 'Review'].map((item, i) => <div key={item} className={`h-1.5 flex-1 rounded-full ${i === 0 ? 'bg-primary' : 'bg-secondary'}`} title={item} />)}</div><label className="mt-7 block text-sm font-semibold">Select connected platform<select className="mt-2 w-full rounded-xl border border-border p-3 text-sm outline-none"><option>Google Ads</option><option>Meta Ads</option><option>LinkedIn Ads</option></select></label><p className="mt-4 text-xs text-muted-foreground">Your campaign will be created as a draft for review before publishing.</p><div className="mt-7 flex justify-end gap-2"><button onClick={() => setShowCreate(false)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted-foreground">Cancel</button><button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">Continue <ChevronRight className="inline h-4 w-4" /></button></div></div></div>}
      {showConnect && <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4" role="dialog" aria-modal="true" aria-labelledby="connect-title"><div className="w-full max-w-2xl rounded-2xl bg-card p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-foreground">Connections</p><h2 id="connect-title" className="mt-1 text-xl font-bold">Connect advertising platform</h2><p className="mt-1 text-sm text-muted-foreground">Bring campaign performance into one trusted workspace.</p></div><button onClick={() => setShowConnect(false)} aria-label="Close connections dialog"><X className="h-5 w-5 text-muted-foreground" /></button></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{[{
            n: 'Google Ads',
            d: 'Search, Shopping and Display performance'
          }, {
            n: 'Meta Ads',
            d: 'Facebook and Instagram campaigns'
          }, {
            n: 'Microsoft Advertising',
            d: 'Search network performance'
          }, {
            n: 'LinkedIn Ads',
            d: 'B2B audience and lead campaigns'
          }, {
            n: 'TikTok Ads',
            d: 'Short-form video campaigns'
          }].map(item => <div key={item.n} className="flex items-center gap-3 rounded-xl border border-border p-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-foreground">{item.n[0]}</div><div className="min-w-0 flex-1"><p className="text-sm font-bold">{item.n}</p><p className="truncate text-xs text-muted-foreground">{item.d}</p></div><button className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold">Connect</button></div>)}</div></div></div>}
    </div>;
}