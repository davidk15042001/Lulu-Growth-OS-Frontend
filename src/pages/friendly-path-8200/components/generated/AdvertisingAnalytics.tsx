import { useMemo, useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Bot, ChevronDown, ChevronRight, CircleHelp, Download, Filter, LayoutDashboard, Menu, RefreshCw, Search, Settings, Sparkles, Target, Users, X } from 'lucide-react';
type MetricKey = 'Spend' | 'Revenue' | 'ROAS' | 'Conversions' | 'CPA' | 'CTR';
type Campaign = {
  name: string;
  platform: string;
  spend: string;
  revenue: string;
  roas: string;
  cpa: string;
  trend: 'up' | 'down';
  status: string;
};
type Kpi = {
  label: string;
  value: string;
  previous: string;
  change: string;
  positive: boolean;
  note: string;
};
const kpis: Kpi[] = [{
  label: 'Advertising Spend',
  value: '$84,290',
  previous: '$78,440',
  change: '+7.5%',
  positive: false,
  note: 'Observed · Previous period'
}, {
  label: 'Advertising Revenue',
  value: '$312,840',
  previous: '$286,100',
  change: '+9.3%',
  positive: true,
  note: 'Attributed · Previous period'
}, {
  label: 'ROAS',
  value: '3.71x',
  previous: '3.65x',
  change: '+1.6%',
  positive: true,
  note: 'Observed · Previous period'
}, {
  label: 'Conversions',
  value: '4,286',
  previous: '4,010',
  change: '+6.9%',
  positive: true,
  note: 'Observed · Previous period'
}, {
  label: 'CPA',
  value: '$19.68',
  previous: '$19.56',
  change: '+0.6%',
  positive: false,
  note: 'Observed · Previous period'
}, {
  label: 'CTR',
  value: '2.84%',
  previous: '2.72%',
  change: '+4.4%',
  positive: true,
  note: 'Observed · Previous period'
}, {
  label: 'CPC',
  value: '$1.34',
  previous: '$1.29',
  change: '+3.9%',
  positive: false,
  note: 'Observed · Previous period'
}, {
  label: 'Conversion Rate',
  value: '5.12%',
  previous: '4.94%',
  change: '+3.6%',
  positive: true,
  note: 'Observed · Previous period'
}];
const platforms = [{
  name: 'Google Ads',
  spend: '$42,180',
  revenue: '$175,420',
  roas: '4.16x',
  conversions: '2,140',
  cpa: '$19.71',
  ctr: '3.20%',
  cpc: '$1.18',
  color: 'var(--foreground)',
  share: 50
}, {
  name: 'Meta Ads',
  spend: '$29,540',
  revenue: '$102,680',
  roas: '3.47x',
  conversions: '1,568',
  cpa: '$18.84',
  ctr: '2.64%',
  cpc: '$1.27',
  color: 'var(--foreground)',
  share: 35
}, {
  name: 'LinkedIn Ads',
  spend: '$8,430',
  revenue: '$23,950',
  roas: '2.84x',
  conversions: '308',
  cpa: '$27.37',
  ctr: '1.48%',
  cpc: '$2.31',
  color: 'var(--foreground)',
  share: 10
}, {
  name: 'Microsoft Advertising',
  spend: '$4,140',
  revenue: '$10,790',
  roas: '2.61x',
  conversions: '270',
  cpa: '$15.33',
  ctr: '2.06%',
  cpc: '$0.94',
  color: 'var(--foreground)',
  share: 5
}];
const campaigns: Campaign[] = [{
  name: 'Brand — Core Terms',
  platform: 'Google Ads',
  spend: '$18,420',
  revenue: '$92,640',
  roas: '5.03x',
  cpa: '$14.98',
  trend: 'up',
  status: 'Healthy'
}, {
  name: 'Spring Collection Prospecting',
  platform: 'Meta Ads',
  spend: '$12,880',
  revenue: '$48,220',
  roas: '3.74x',
  cpa: '$16.42',
  trend: 'up',
  status: 'Scaling'
}, {
  name: 'High Intent — Nonbrand',
  platform: 'Google Ads',
  spend: '$9,760',
  revenue: '$34,870',
  roas: '3.57x',
  cpa: '$21.04',
  trend: 'up',
  status: 'Healthy'
}, {
  name: 'Enterprise Demand Gen',
  platform: 'LinkedIn Ads',
  spend: '$6,230',
  revenue: '$14,260',
  roas: '2.29x',
  cpa: '$31.15',
  trend: 'down',
  status: 'Review'
}];
const channels = [{
  name: 'Search',
  spend: '$48,680',
  revenue: '$203,120',
  roas: '4.17x',
  conversions: '2,510',
  cpa: '$19.39',
  width: '82%'
}, {
  name: 'Social',
  spend: '$25,820',
  revenue: '$83,540',
  roas: '3.24x',
  conversions: '1,340',
  cpa: '$19.27',
  width: '58%'
}, {
  name: 'Display',
  spend: '$5,480',
  revenue: '$14,880',
  roas: '2.72x',
  conversions: '286',
  cpa: '$19.16',
  width: '23%'
}, {
  name: 'Video',
  spend: '$4,310',
  revenue: '$11,300',
  roas: '2.62x',
  conversions: '150',
  cpa: '$28.73',
  width: '18%'
}];
const trendPoints = [34, 38, 31, 46, 43, 56, 52, 60, 56, 69, 64, 78, 74, 87, 82, 92, 88, 96, 90, 100];
const alertItems = [{
  category: 'Warning',
  title: 'ROAS decreased significantly',
  detail: 'Enterprise Demand Gen · -18.4% over 7 days',
  icon: AlertTriangle
}, {
  category: 'Opportunity',
  title: 'Search efficiency is improving',
  detail: 'Brand — Core Terms · +12.6% ROAS over 14 days',
  icon: Sparkles
}, {
  category: 'Positive',
  title: 'Conversions increased strongly',
  detail: 'All platforms · +6.9% vs previous period',
  icon: ArrowUpRight
}];
function SectionHeader({
  eyebrow,
  title,
  action
}: {
  eyebrow?: string;
  title: string;
  action?: string;
}) {
  return <header className="flex items-end justify-between gap-3 mb-5"><div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--foreground)]">{eyebrow}</p><h2 className="text-[19px] font-semibold tracking-[-0.02em] text-[var(--foreground)]">{title}</h2></div>{action && <button className="text-xs font-semibold text-[var(--foreground)] hover:text-[var(--foreground)]">{action}<ChevronRight size={14} className="inline ml-1" /></button>}</header>;
}
function MiniBars({
  values,
  color = 'var(--primary)'
}: {
  values: number[];
  color?: string;
}) {
  return <div className="flex h-9 items-end gap-1" aria-label="Trend visualization">{values.map((value, index) => <span key={`${value}-${index}`} className="flex-1 rounded-t-sm" style={{
      height: `${value}%`,
      background: color,
      opacity: 0.35 + index / values.length * 0.55
    }} />)}</div>;
}
export function AdvertisingAnalytics() {
  const [range, setRange] = useState('Last 30 Days');
  const [platform, setPlatform] = useState('All Platforms');
  const [metric, setMetric] = useState<MetricKey>('Revenue');
  const [comparison, setComparison] = useState('Previous Period');
  const [exportOpen, setExportOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [sortDesc, setSortDesc] = useState(true);
  const sortedCampaigns = useMemo(() => [...campaigns].sort((a, b) => sortDesc ? Number.parseFloat(b.roas) - Number.parseFloat(a.roas) : Number.parseFloat(a.roas) - Number.parseFloat(b.roas)), [sortDesc]);
  const { items: liveCampaigns, loading: liveLoading, error: liveError } = useLiveRecords('ad_campaigns');
  const liveEmpty = !liveLoading && !liveError && liveCampaigns.length === 0;
  return <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] lg:flex">
    <aside className={`${mobileNav ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-20 w-[258px] flex-col bg-[var(--sidebar)] text-foreground lg:sticky lg:flex`} aria-label="Primary navigation">
      <div className="flex h-[78px] items-center gap-3 border-b border-border px-6"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary)] shadow-[0_0_22px_rgba(0,0,0,.3)] text-primary-foreground"><Sparkles size={18} /></div><span className="text-[17px] font-bold tracking-tight">LULU <span className="font-light text-[var(--foreground)]">AI</span></span><button onClick={() => setMobileNav(false)} className="ml-auto lg:hidden" aria-label="Close navigation"><X size={18} /></button></div>
      <div className="px-4 py-6"><p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[var(--muted-foreground)]">Workspace</p><LuluSectionNavigation activeId="friendly-path-8200" /></div>
      <div className="mt-auto border-t border-border px-4 py-5"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--muted-foreground)] hover:bg-secondary"><Settings size={17} />Workspace settings</button><div className="mt-4 flex items-center gap-3 rounded-xl bg-secondary p-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--secondary)] text-xs font-bold text-[var(--foreground)]">AM</div><div><p className="text-xs font-semibold">Workspace administrator</p><p className="text-[11px] text-[var(--muted-foreground)]">Admin</p></div><ChevronDown size={15} className="ml-auto text-[var(--muted-foreground)]" /></div></div>
    </aside>
    {mobileNav && <button className="fixed inset-0 z-10 bg-[var(--sidebar)]/50 lg:hidden" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
    <main className="min-w-0 flex-1">{liveLoading ? <div className="border-b border-border bg-secondary/30 px-4 py-3 text-xs text-muted-foreground sm:px-7 lg:px-10">Loading live advertising data…</div> : liveError ? <div className="border-b border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive sm:px-7 lg:px-10">{liveError}</div> : liveEmpty ? <div className="border-b border-dashed border-border bg-card px-4 py-3 text-xs text-muted-foreground sm:px-7 lg:px-10">No live advertising campaigns are available yet. Connect an advertising platform or add a campaign to begin.</div> : null}
      <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--secondary)]/95 px-4 py-3 backdrop-blur-md sm:px-7 lg:px-10"><div className="mx-auto flex max-w-[1480px] items-center justify-between gap-3"><div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]"><button onClick={() => setMobileNav(true)} className="lg:hidden" aria-label="Open navigation"><Menu size={21} /></button><span>Advertising</span><ChevronRight size={14} /><strong className="text-[var(--muted-foreground)]">Analytics</strong></div><div className="flex items-center gap-2"><button className="hidden items-center gap-2 rounded-lg bg-[var(--primary)] px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-[0_5px_14px_rgba(0,0,0,.22)] hover:bg-[var(--primary)] sm:flex"><Bot size={15} />Ask Lulu AI</button><button onClick={() => setExportOpen(true)} className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-card px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)] hover:border-[var(--border)]"><Download size={15} /> <span className="hidden sm:inline">Export</span></button><button className="rounded-lg border border-[var(--border)] bg-card p-2 text-[var(--muted-foreground)] hover:border-[var(--border)]" aria-label="Refresh analytics"><RefreshCw size={15} /></button></div></div></div>
      <div className="mx-auto max-w-[1480px] px-4 py-7 sm:px-7 lg:px-10 lg:py-9"><header className="mb-7"><p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-[var(--foreground)]">Performance intelligence</p><h1 className="text-[30px] font-bold tracking-[-.04em] text-[var(--foreground)] sm:text-[38px]">Advertising Analytics</h1><p className="mt-2 max-w-xl text-sm text-[var(--muted-foreground)]">Understand advertising performance, efficiency and return across your connected channels.</p></header>
        <section className="mb-7 flex flex-wrap items-center gap-3 rounded-xl border border-[var(--border)] bg-card p-3 shadow-[0_3px_15px_rgba(0,0,0,.03)]" aria-label="Analytics filters"><div className="flex items-center gap-2 border-r border-[var(--border)] pr-3"><Filter size={16} className="text-[var(--foreground)]" /><label className="sr-only" htmlFor="range">Date range</label><select id="range" value={range} onChange={e => setRange(e.target.value)} className="bg-transparent text-sm font-semibold outline-none"><option>Today</option><option>Yesterday</option><option>Last 7 Days</option><option>Last 30 Days</option><option>Last 90 Days</option><option>6 Months</option><option>Year to Date</option><option>Previous Year</option><option>Custom Range</option></select></div><div className="flex items-center gap-2"><span className="text-xs text-[var(--muted-foreground)]">Compare</span><label className="sr-only" htmlFor="compare">Comparison period</label><select id="compare" value={comparison} onChange={e => setComparison(e.target.value)} className="bg-transparent text-sm font-semibold outline-none"><option>Previous Period</option><option>Previous Year</option><option>Custom</option></select></div><div className="ml-auto flex items-center gap-2"><span className="text-xs text-[var(--muted-foreground)]">Platform</span><label className="sr-only" htmlFor="platform">Platform filter</label><select id="platform" value={platform} onChange={e => setPlatform(e.target.value)} className="rounded-md bg-[var(--secondary)] px-3 py-2 text-sm font-semibold outline-none"><option>All Platforms</option><option>Google Ads</option><option>Meta Ads</option><option>Microsoft Advertising</option><option>LinkedIn Ads</option><option>TikTok Ads</option></select></div></section>
        <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8" aria-label="Analytics KPI summary">{kpis.map(kpi => <article key={kpi.label} className="rounded-xl border border-[var(--border)] bg-card p-4 shadow-[0_3px_15px_rgba(0,0,0,.025)]"><div className="flex items-start justify-between gap-1"><p className="text-[11px] font-semibold leading-4 text-[var(--muted-foreground)]">{kpi.label}</p><span className={`mt-0.5 h-2 w-2 rounded-full ${kpi.positive ? 'bg-[var(--chart-4)]' : 'bg-[var(--primary)]'}`} aria-label={kpi.positive ? 'positive trend' : 'watch trend'} /></div><p className="mt-3 text-xl font-bold tracking-[-.04em] text-[var(--foreground)]">{kpi.value}</p><p className={`mt-1 flex items-center gap-1 text-[11px] font-bold ${kpi.positive ? 'text-[var(--chart-4)]' : 'text-[var(--foreground)]'}`}>{kpi.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{kpi.change}</p><p className="mt-2 text-[10px] text-[var(--muted-foreground)]">{kpi.note}</p></article>)}</section>
        <section className="mb-8 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(310px,.8fr)]"><article className="rounded-2xl border border-[var(--border)] bg-card p-5 sm:p-6"><SectionHeader eyebrow="Performance overview" title="Advertising Performance Over Time" action="View report" /><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-1 rounded-lg bg-[var(--secondary)] p-1">{(['Spend', 'Revenue', 'ROAS', 'Conversions', 'CPA', 'CTR'] as MetricKey[]).map(item => <button key={item} onClick={() => setMetric(item)} className={`rounded-md px-2.5 py-1.5 text-[11px] font-semibold ${metric === item ? 'bg-card text-[var(--foreground)] shadow-sm' : 'text-[var(--muted-foreground)]'}`}>{item}</button>)}</div><div className="flex items-center gap-2 text-[11px] text-[var(--muted-foreground)]"><span className="h-2 w-2 rounded-full bg-[var(--primary)] text-primary-foreground" />Current <span className="ml-2 h-2 w-2 rounded-full bg-[var(--muted)]" />{comparison}</div></div><div className="flex h-[235px] items-end gap-2 border-b border-l border-[var(--border)] px-3 pb-0 pt-4 sm:h-[275px]" role="img" aria-label={`${metric} chart showing a rising trend over the selected period`}><div className="flex h-full flex-1 items-end gap-1 sm:gap-2">{trendPoints.map((point, index) => <div key={`${point}-${index}`} className="flex h-full flex-1 items-end gap-0.5"><span className="w-1/2 rounded-t-sm bg-[var(--primary)] opacity-80 text-primary-foreground" style={{
                    height: `${point}%`
                  }} /><span className="w-1/2 rounded-t-sm bg-[var(--secondary)]" style={{
                    height: `${Math.max(20, point - index % 4 * 7)}%`
                  }} /></div>)}</div></div><div className="mt-3 flex justify-between pl-3 text-[10px] font-medium text-[var(--muted-foreground)]"><span>Jun 01</span><span>Jun 08</span><span>Jun 15</span><span>Jun 22</span><span>Jun 30</span></div></article><article className="rounded-2xl border border-[var(--border)] bg-card p-5 sm:p-6"><SectionHeader eyebrow="Spend analysis" title="Spend by Platform" action="Breakdown" /><div className="flex items-center gap-7"><div className="relative grid h-32 w-32 shrink-0 place-items-center rounded-full" style={{
                background: 'conic-gradient(var(--primary) 0 50%, var(--primary) 50% 85%, var(--primary) 85% 95%, var(--secondary) 95% 100%)'
              }}><div className="grid h-[82px] w-[82px] place-items-center rounded-full bg-card text-center"><strong className="text-lg">$84.3k</strong><span className="text-[10px] text-[var(--muted-foreground)]">total spend</span></div></div><div className="w-full space-y-3">{platforms.map(item => <div key={item.name} className="flex items-center gap-2 text-xs"><span className="h-2 w-2 rounded-full" style={{
                    background: item.color
                  }} /><span className="min-w-0 flex-1 truncate text-[var(--muted-foreground)]">{item.name}</span><strong>{item.share}%</strong></div>)}</div></div><div className="mt-7 border-t border-[var(--border)] pt-4"><p className="mb-3 text-xs font-semibold text-[var(--muted-foreground)]">Spend allocation</p><MiniBars values={[44, 52, 47, 64, 58, 69, 63, 77, 70, 82, 75, 88]} /></div></article></section>
        <section className="mb-8 grid gap-5 xl:grid-cols-[1.25fr_.75fr]"><article className="rounded-2xl border border-[var(--border)] bg-card p-5 sm:p-6"><SectionHeader eyebrow="Revenue analysis" title="Attributed Revenue" action="See attribution" /><div className="grid grid-cols-2 gap-6 sm:grid-cols-3"><div><p className="text-xs text-[var(--muted-foreground)]">Attributed revenue</p><p className="mt-1 text-2xl font-bold">$312,840</p><p className="mt-1 text-xs font-semibold text-[var(--chart-4)]">+9.3% vs previous</p></div><div><p className="text-xs text-[var(--muted-foreground)]">Revenue contribution</p><p className="mt-1 text-2xl font-bold">28.4%</p><p className="mt-1 text-xs text-[var(--muted-foreground)]">of tracked revenue</p></div><div className="col-span-2 sm:col-span-1"><p className="text-xs text-[var(--muted-foreground)]">Best platform</p><p className="mt-1 text-2xl font-bold">Google Ads</p><p className="mt-1 text-xs text-[var(--muted-foreground)]">56.1% of attributed revenue</p></div></div><div className="mt-7 space-y-3">{platforms.slice(0, 3).map(item => <div key={item.name} className="flex items-center gap-3"><span className="w-[112px] truncate text-xs font-semibold text-[var(--muted-foreground)]">{item.name}</span><div className="h-2 flex-1 rounded-full bg-[var(--secondary)]"><div className="h-full rounded-full bg-[var(--primary)] text-primary-foreground" style={{
                    width: `${item.share + 35}%`
                  }} /></div><span className="w-16 text-right text-xs font-bold">{item.revenue}</span></div>)}</div><p className="mt-5 text-[11px] text-[var(--muted-foreground)]">Attributed revenue is platform-reported and may differ from total company revenue.</p></article><article className="rounded-2xl border border-[var(--border)] bg-card p-5 sm:p-6"><SectionHeader eyebrow="Advertising efficiency" title="ROAS & CPA" /><div className="mb-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-[var(--secondary)] p-3"><p className="text-xs text-[var(--muted-foreground)]">Overall ROAS</p><p className="mt-1 text-2xl font-bold">3.71x</p><p className="text-[11px] font-semibold text-[var(--chart-4)]">+1.6% improving</p></div><div className="rounded-xl bg-[var(--secondary)] p-3"><p className="text-xs text-[var(--muted-foreground)]">Blended CPA</p><p className="mt-1 text-2xl font-bold">$19.68</p><p className="text-[11px] font-semibold text-[var(--foreground)]">+0.6% watch</p></div></div><MiniBars values={[56, 49, 62, 58, 69, 72, 66, 78, 75, 84, 81, 91]} color="var(--primary)" /><div className="mt-3 flex justify-between text-[11px] text-[var(--muted-foreground)]"><span>Efficiency trend · 30 days</span><span className="font-semibold text-[var(--chart-4)]">Improving</span></div></article></section>
        <section className="mb-8 rounded-2xl border border-[var(--border)] bg-card p-5 sm:p-6"><SectionHeader eyebrow="Platform comparison" title="Connected Channel Performance" action="Manage connections" /><div className="overflow-x-auto"><table className="w-full min-w-[800px] border-collapse text-left text-xs"><thead><tr className="border-b border-[var(--border)] text-[10px] uppercase tracking-[.12em] text-[var(--muted-foreground)]"><th className="pb-3 font-bold">Platform</th><th className="pb-3 font-bold">Spend</th><th className="pb-3 font-bold">Revenue</th><th className="pb-3 font-bold">ROAS</th><th className="pb-3 font-bold">Conversions</th><th className="pb-3 font-bold">CPA</th><th className="pb-3 font-bold">CTR</th><th className="pb-3 font-bold">CPC</th></tr></thead><tbody>{platforms.map(item => <tr key={item.name} className="border-b border-[var(--border)] last:border-0"><td className="py-4 font-semibold"><span className="mr-2 inline-block h-2 w-2 rounded-full" style={{
                      background: item.color
                    }} />{item.name}</td><td className="py-4">{item.spend}</td><td className="py-4">{item.revenue}</td><td className="py-4 font-bold text-[var(--foreground)]">{item.roas}</td><td className="py-4">{item.conversions}</td><td className="py-4">{item.cpa}</td><td className="py-4">{item.ctr}</td><td className="py-4">{item.cpc}</td></tr>)}</tbody></table></div></section>
        <section className="mb-8 grid gap-5 xl:grid-cols-[1.35fr_.65fr]"><article className="rounded-2xl border border-[var(--border)] bg-card p-5 sm:p-6"><SectionHeader eyebrow="Campaign performance" title="Top Campaigns" action="View all campaigns" /><div className="mb-4 flex items-center gap-2"><span className="text-xs text-[var(--muted-foreground)]">Rank by</span><button onClick={() => setSortDesc(!sortDesc)} className="flex items-center gap-1 rounded-md bg-[var(--secondary)] px-2.5 py-1.5 text-xs font-semibold">ROAS <ChevronDown size={13} /></button><span className="ml-auto text-[11px] text-[var(--muted-foreground)]">{sortDesc ? 'Highest first' : 'Lowest first'}</span></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-xs"><thead className="border-b border-[var(--border)] text-[10px] uppercase tracking-[.1em] text-[var(--muted-foreground)]"><tr><th className="pb-3">Campaign</th><th className="pb-3">Spend</th><th className="pb-3">Revenue</th><th className="pb-3">ROAS</th><th className="pb-3">CPA</th><th className="pb-3">Status</th><th /></tr></thead><tbody>{sortedCampaigns.map(campaign => <tr key={campaign.name} className="border-b border-[var(--border)] last:border-0"><td className="py-4"><strong className="block">{campaign.name}</strong><span className="text-[11px] text-[var(--muted-foreground)]">{campaign.platform}</span></td><td>{campaign.spend}</td><td>{campaign.revenue}</td><td className="font-bold text-[var(--foreground)]">{campaign.roas}</td><td>{campaign.cpa}</td><td><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${campaign.status === 'Review' ? 'bg-[var(--secondary)] text-[var(--foreground)]' : 'bg-[var(--secondary)] text-[var(--foreground)]'}`}>{campaign.status}</span></td><td><button className="font-semibold text-[var(--foreground)]">View</button></td></tr>)}</tbody></table></div></article><article className="rounded-2xl border border-[var(--border)] bg-card p-5 sm:p-6"><SectionHeader eyebrow="Channel analysis" title="Spend by Channel" /><div className="space-y-5">{channels.map(channel => <div key={channel.name}><div className="mb-2 flex items-center justify-between text-xs"><span className="font-semibold">{channel.name}</span><span className="text-[var(--muted-foreground)]">{channel.spend} · {channel.roas}</span></div><div className="h-2 rounded-full bg-[var(--secondary)]"><div className="h-full rounded-full bg-[var(--primary)] text-primary-foreground" style={{
                    width: channel.width
                  }} /></div><div className="mt-1 flex justify-between text-[10px] text-[var(--muted-foreground)]"><span>{channel.conversions} conversions</span><span>CPA {channel.cpa}</span></div></div>)}</div></article></section>
        <section className="mb-8 grid gap-5 lg:grid-cols-2"><article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6"><div className="mb-4 flex items-start gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary)] text-primary-foreground"><Bot size={18} /></div><div><p className="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--foreground)]">AI Advertising Analysis · AI-generated</p><h2 className="text-lg font-bold">Lulu AI readout</h2></div></div><div className="space-y-4 text-sm"><div><h3 className="mb-1 font-bold">What happened</h3><p className="leading-6 text-[var(--muted-foreground)]">Attributed revenue grew faster than spend this period, led by Brand Search and Spring Collection Prospecting.</p></div><div><h3 className="mb-1 font-bold">Why it matters</h3><p className="leading-6 text-[var(--muted-foreground)]">Efficiency is improving overall, but Enterprise Demand Gen is pulling blended CPA upward and merits review.</p></div><div><h3 className="mb-1 font-bold">Recommended priorities</h3><p className="leading-6 text-[var(--muted-foreground)]">Review budget distribution across Search and LinkedIn; investigate the CPA trend before scaling.</p></div></div><div className="mt-5 flex flex-wrap gap-3 border-t border-[var(--border)] pt-4 text-[10px] text-[var(--muted-foreground)]"><span>Data sources: Google, Meta, LinkedIn</span><span>Updated Jun 30, 2024 · Confidence: Supported</span></div></article><article className="rounded-2xl border border-[var(--border)] bg-card p-5 sm:p-6"><SectionHeader eyebrow="AI Detected" title="Advertising Alerts" action="See all" /><div className="space-y-3">{alertItems.map(alert => {
                const Icon = alert.icon;
                return <div key={alert.title} className="flex gap-3 rounded-xl border border-[var(--border)] p-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--secondary)] text-[var(--foreground)]"><Icon size={15} /></div><div className="min-w-0"><div className="flex items-center gap-2"><h3 className="truncate text-xs font-bold">{alert.title}</h3><span className="rounded-full bg-[var(--secondary)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--foreground)]">{alert.category}</span></div><p className="mt-1 text-[11px] text-[var(--muted-foreground)]">{alert.detail}</p></div></div>;
              })}</div></article></section>
        <section className="mb-6 grid gap-5 lg:grid-cols-2"><article className="rounded-2xl border border-[var(--border)] bg-card p-5 sm:p-6"><SectionHeader eyebrow="Conversion analysis" title="Advertising Funnel" /><div className="flex items-center justify-between gap-2" aria-label="Advertising funnel from impressions to revenue">{[{
                label: 'Impressions',
                value: '1.24M'
              }, {
                label: 'Clicks',
                value: '43.8k'
              }, {
                label: 'Visits',
                value: '22.6k'
              }, {
                label: 'Conversions',
                value: '4,286'
              }, {
                label: 'Revenue',
                value: '$312.8k'
              }].map((stage, index) => <div key={stage.label} className="flex min-w-0 flex-1 items-center gap-2"><div className="min-w-0 flex-1"><p className="truncate text-[10px] text-[var(--muted-foreground)]">{stage.label}</p><p className="mt-1 truncate text-sm font-bold">{stage.value}</p><div className="mt-2 h-1.5 rounded-full bg-[var(--primary)] text-primary-foreground" style={{
                    opacity: 1 - index * .12
                  }} /></div>{index < 4 && <ChevronRight size={14} className="shrink-0 text-[var(--muted-foreground)]" />}</div>)}</div><p className="mt-5 text-[11px] text-[var(--muted-foreground)]">Volumes are observed across connected platforms. Conversion rates between stages vary by source.</p></article><article className="rounded-2xl border border-[var(--border)] bg-card p-5 sm:p-6"><SectionHeader eyebrow="What requires attention" title="AI Opportunities" /><div className="space-y-4"><div className="border-l-2 border-[var(--border)] pl-3"><h3 className="text-sm font-bold">Scale high-efficiency Search</h3><p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">Brand campaigns deliver 5.03x ROAS at 22% of spend. Review capacity before increasing investment.</p><button className="mt-2 text-xs font-bold text-[var(--foreground)]">Review opportunity</button></div><div className="border-l-2 border-[var(--border)] pl-3"><h3 className="text-sm font-bold">Investigate LinkedIn CPA</h3><p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">CPA is 39% above blended average. Compare audience and geography performance.</p><button className="mt-2 text-xs font-bold text-[var(--foreground)]">Ask Lulu AI</button></div></div></article></section>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] py-5 text-[11px] text-[var(--muted-foreground)]"><span>Data refresh: Jun 30, 2024 at 09:42 UTC · Connected sources: 4</span><span className="flex items-center gap-1"><CircleHelp size={13} /> Attribution methodologies may differ across platforms.</span></footer>
      </div>
    </main>
    {exportOpen && <div className="fixed inset-0 z-30 flex items-center justify-center bg-[var(--background)]/40 p-4" role="dialog" aria-modal="true" aria-labelledby="export-title"><div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[.15em] text-[var(--foreground)]">Export Analytics</p><h2 id="export-title" className="mt-1 text-xl font-bold">Choose your report</h2></div><button onClick={() => setExportOpen(false)} aria-label="Close export dialog"><X size={19} /></button></div><div className="mt-6 space-y-3"><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] p-4"><input type="radio" name="format" defaultChecked /> <span><strong className="block text-sm">CSV</strong><small className="text-xs text-[var(--muted-foreground)]">Best for data analysis</small></span></label><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] p-4"><input type="radio" name="format" /> <span><strong className="block text-sm">Excel</strong><small className="text-xs text-[var(--muted-foreground)]">Formatted workbook</small></span></label><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] p-4"><input type="radio" name="format" /> <span><strong className="block text-sm">PDF</strong><small className="text-xs text-[var(--muted-foreground)]">Executive summary</small></span></label></div><div className="mt-6 flex justify-end gap-2"><button onClick={() => setExportOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)]">Cancel</button><button onClick={() => setExportOpen(false)} className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-bold text-primary-foreground">Export report</button></div></div></div>}
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
