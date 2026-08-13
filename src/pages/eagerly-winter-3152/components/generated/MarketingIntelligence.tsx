import * as React from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Bot, CalendarDays, ChevronDown, ChevronRight, Download, FilePlus2, Filter, Gauge, Globe2, LayoutDashboard, LineChart, Menu, MessageSquare, RefreshCw, Search, Settings, Sparkles, Target, TrendingUp, Users } from 'lucide-react';
type BadgeKind = 'Observed' | 'Calculated' | 'Estimated' | 'Attributed' | 'Target' | 'Benchmark' | 'Forecast' | 'AI Explanation';
type Kpi = {
  label: string;
  value: string;
  previous: string;
  change: string;
  kind: BadgeKind;
  down?: boolean;
};
type Funnel = {
  label: string;
  value: string;
  rate: string;
  change: string;
  width: string;
};
type Channel = {
  name: string;
  traffic: string;
  leads: string;
  customers: string;
  revenue: string;
  spend: string;
  cac: string;
  roi: string;
  conv: string;
};
const kpis: Kpi[] = [{
  label: 'Marketing Revenue',
  value: '€2,996,000',
  previous: '€2,440,000',
  change: '+22.8%',
  kind: 'Attributed'
}, {
  label: 'Marketing Spend',
  value: '€428,000',
  previous: '€392,000',
  change: '+9.2%',
  kind: 'Observed'
}, {
  label: 'Marketing ROI',
  value: '600%',
  previous: '522%',
  change: '+78pp',
  kind: 'Calculated'
}, {
  label: 'Leads',
  value: '4,840',
  previous: '3,920',
  change: '+23.5%',
  kind: 'Observed'
}, {
  label: 'Customers Acquired',
  value: '156',
  previous: '132',
  change: '+18.2%',
  kind: 'Attributed'
}, {
  label: 'Conversion Rate',
  value: '3.2%',
  previous: '3.4%',
  change: '-0.2pp',
  kind: 'Calculated',
  down: true
}];
const months = [{
  m: 'Apr',
  revenue: 56,
  spend: 30,
  leads: 42
}, {
  m: 'May',
  revenue: 61,
  spend: 35,
  leads: 48
}, {
  m: 'Jun',
  revenue: 64,
  spend: 38,
  leads: 52
}, {
  m: 'Jul',
  revenue: 66,
  spend: 42,
  leads: 56
}, {
  m: 'Aug',
  revenue: 70,
  spend: 43,
  leads: 60
}, {
  m: 'Sep',
  revenue: 75,
  spend: 47,
  leads: 64
}, {
  m: 'Oct',
  revenue: 78,
  spend: 51,
  leads: 68
}, {
  m: 'Nov',
  revenue: 82,
  spend: 54,
  leads: 73
}, {
  m: 'Dec',
  revenue: 85,
  spend: 58,
  leads: 77
}, {
  m: 'Jan',
  revenue: 88,
  spend: 61,
  leads: 82
}, {
  m: 'Feb',
  revenue: 94,
  spend: 63,
  leads: 88
}, {
  m: 'Mar',
  revenue: 100,
  spend: 66,
  leads: 94
}];
const funnel: Funnel[] = [{
  label: 'Reach / Impressions',
  value: '2,840,000',
  rate: '100%',
  change: '+28%',
  width: '100%'
}, {
  label: 'Visits / Sessions',
  value: '148,400',
  rate: '5.2% of reach',
  change: '+31.6%',
  width: '82%'
}, {
  label: 'Engagement',
  value: '82,060',
  rate: '55.3% of visits',
  change: '+29%',
  width: '67%'
}, {
  label: 'Leads',
  value: '4,840',
  rate: '5.9% of visits',
  change: '+23.5%',
  width: '52%'
}, {
  label: 'Qualified Leads (MQL)',
  value: '1,936',
  rate: '40.0% of leads',
  change: '+23.5%',
  width: '38%'
}, {
  label: 'Customers',
  value: '156',
  rate: '8.1% of MQLs',
  change: '+18.2%',
  width: '25%'
}, {
  label: 'Revenue',
  value: '€2,996,000',
  rate: '€19,205 / customer',
  change: '+22.8%',
  width: '16%'
}];
const traffic = [{
  name: 'Organic Search',
  value: '58,200',
  pct: '39.2%',
  growth: '+42%'
}, {
  name: 'Direct',
  value: '26,700',
  pct: '18.0%',
  growth: '+18%'
}, {
  name: 'Paid Search',
  value: '22,260',
  pct: '15.0%',
  growth: '+12%'
}, {
  name: 'Referral',
  value: '17,800',
  pct: '12.0%',
  growth: '+28%'
}, {
  name: 'Paid Social',
  value: '11,870',
  pct: '8.0%',
  growth: '+22%'
}, {
  name: 'Email',
  value: '7,420',
  pct: '5.0%',
  growth: '+8%'
}, {
  name: 'Other',
  value: '2,150',
  pct: '1.5%',
  growth: '+4%'
}];
const leads = [{
  name: 'Organic Search',
  value: '1,694',
  pct: 35
}, {
  name: 'Paid Search',
  value: '726',
  pct: 15
}, {
  name: 'Referral',
  value: '581',
  pct: 12
}, {
  name: 'Direct',
  value: '484',
  pct: 10
}, {
  name: 'Paid Social',
  value: '436',
  pct: 9
}, {
  name: 'Email',
  value: '388',
  pct: 8
}, {
  name: 'Content',
  value: '291',
  pct: 6
}, {
  name: 'Other',
  value: '240',
  pct: 5
}];
const channels: Channel[] = [{
  name: 'Organic Search',
  traffic: '58,200',
  leads: '1,694',
  customers: '52',
  revenue: '€1,174,000',
  spend: '€24,800',
  cac: '€84',
  roi: '1,296%',
  conv: '3.2%'
}, {
  name: 'Paid Search',
  traffic: '22,260',
  leads: '726',
  customers: '20',
  revenue: '€508,000',
  spend: '€89,600',
  cac: '€442',
  roi: '185%',
  conv: '2.8%'
}, {
  name: 'Direct',
  traffic: '26,700',
  leads: '484',
  customers: '18',
  revenue: '€328,000',
  spend: '€0',
  cac: '€320*',
  roi: 'n/a',
  conv: '1.8%'
}, {
  name: 'Referral',
  traffic: '17,800',
  leads: '581',
  customers: '24',
  revenue: '€388,000',
  spend: '€14,400',
  cac: '€148',
  roi: '562%',
  conv: '3.4%'
}, {
  name: 'Paid Social',
  traffic: '11,870',
  leads: '436',
  customers: '16',
  revenue: '€268,000',
  spend: '€106,600',
  cac: '€384',
  roi: '142%',
  conv: '3.8%'
}, {
  name: 'Email',
  traffic: '7,420',
  leads: '388',
  customers: '14',
  revenue: '€208,000',
  spend: '€9,800',
  cac: '€124',
  roi: '390%',
  conv: '5.2%'
}, {
  name: 'Content',
  traffic: '4,150',
  leads: '291',
  customers: '12',
  revenue: '€122,000',
  spend: '€23,600',
  cac: '€196',
  roi: '522%',
  conv: '7.0%'
}];
const campaigns = [{
  name: 'Q4 Enterprise Launch',
  reach: '248,000',
  traffic: '14,400',
  leads: '484',
  customers: '28',
  revenue: '€484,000',
  roi: '476%'
}, {
  name: 'Organic SEO (always-on)',
  reach: '1,200,000',
  traffic: '58,200',
  leads: '1,694',
  customers: '52',
  revenue: '€428,000',
  roi: '1,296%'
}, {
  name: 'Spring Mid-Market',
  reach: '186,000',
  traffic: '11,200',
  leads: '312',
  customers: '18',
  revenue: '€312,000',
  roi: '403%'
}, {
  name: 'Referral Program',
  reach: '0',
  traffic: '17,800',
  leads: '581',
  customers: '24',
  revenue: '€268,000',
  roi: '562%'
}, {
  name: 'Email Nurture Series',
  reach: '124,000',
  traffic: '7,420',
  leads: '388',
  customers: '14',
  revenue: '€208,000',
  roi: '390%'
}];
const prompts = ['Which channels generate the most revenue?', 'What is our marketing ROI?', 'What is our ROAS?', 'Which campaigns perform best?', 'What is our CAC by channel?', 'How has marketing changed over 90 days?', 'Which attribution model is active?', 'Compare marketing with last year.'];
const sources = ['GA4', 'Google Search Console', 'Google Ads', 'Meta Ads', 'LinkedIn Ads', 'TikTok Ads', 'CRM', 'Email Platform', 'Billing'];
function Badge({
  kind
}: {
  kind: BadgeKind;
}) {
  const styles: Record<BadgeKind, string> = {
    Observed: 'bg-card/60 text-foreground',
    Calculated: 'bg-secondary/10 text-foreground',
    Estimated: 'bg-secondary/10 text-foreground',
    Attributed: 'bg-secondary/15 text-foreground',
    Target: 'bg-secondary/15 text-foreground',
    Benchmark: 'bg-secondary/10 text-foreground',
    Forecast: 'bg-secondary/15 text-foreground',
    'AI Explanation': 'bg-gradient-to-r from-secondary/20 to-chart-3/20 text-chart-2'
  };
  return <span className={`rounded-md px-2 py-1 text-[10px] font-medium ${styles[kind]}`}>{kind}</span>;
}
function Sparkline({
  color = 'var(--chart-2)'
}: {
  color?: string;
}) {
  return <svg viewBox="0 0 100 28" className="h-7 w-24" role="img" aria-label="Upward trend"><polyline fill="none" stroke={color} strokeWidth="2.5" points="2,24 15,21 27,22 39,16 51,18 64,11 76,13 88,7 98,3" /><circle cx="98" cy="3" r="2.5" fill={color} /></svg>;
}
function Card({
  title,
  eyebrow,
  children,
  wide = false
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return <section className={`rounded-2xl border border-border/[.08] bg-[var(--card)]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,.16)] ${wide ? 'xl:col-span-2' : ''}`}><header className="mb-5 flex items-start justify-between gap-4"><div>{eyebrow && <p className="mb-1 text-[10px] font-semibold uppercase tracking-[.18em] text-foreground">{eyebrow}</p>}<h2 className="text-[17px] font-semibold tracking-tight text-foreground">{title}</h2></div><button className="rounded-lg p-1.5 text-foreground hover:bg-secondary hover:text-foreground" aria-label={`More options for ${title}`}>•••</button></header>{children}</section>;
}
function Sidebar() {
  return <aside className="hidden w-[236px] shrink-0 border-r border-border/[.07] bg-[var(--sidebar)] px-3 py-5 lg:block"><div className="flex items-center gap-3 px-3"><div className="grid h-8 w-8 place-items-center rounded-xl bg-primary shadow-lg shadow-black/30 text-primary-foreground"><Sparkles size={16} /></div><div><p className="text-sm font-bold text-foreground">Lulu <span className="text-foreground">AI</span></p><p className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">Business OS</p></div></div><div className="my-7 h-px bg-secondary" /><nav aria-label="Primary navigation" className="space-y-1">{([['Executive Dashboard', LayoutDashboard], ['Business Health', Activity], ['Growth', TrendingUp], ['CRM', Users]] as const).map(([label, Icon]) => <button key={label} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] text-foreground hover:bg-secondary hover:text-foreground"><Icon size={16} /><span>{label}</span></button>)}<div className="pt-4"><p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Intelligence</p><button className="flex w-full items-center justify-between rounded-xl bg-secondary/15 px-3 py-2.5 text-[13px] font-medium text-foreground"><span className="flex items-center gap-3"><LineChart size={16} /><span>Business Intelligence</span></span><ChevronDown size={14} /></button><div className="ml-7 mt-1 border-l border-border/30 pl-3"><button className="w-full rounded-lg px-3 py-2 text-left text-xs text-foreground hover:text-foreground">Revenue</button><button className="w-full rounded-lg border-l-2 border-border bg-secondary/10 px-3 py-2 text-left text-xs font-semibold text-foreground">Marketing</button><button className="w-full rounded-lg px-3 py-2 text-left text-xs text-foreground hover:text-foreground">Customers</button><button className="w-full rounded-lg px-3 py-2 text-left text-xs text-foreground hover:text-foreground">Sales</button></div></div>{([['Risk Center', Gauge], ['AI Recommendations', Bot], ['Settings', Settings]] as const).map(([label, Icon]) => <button key={label} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-foreground hover:bg-secondary hover:text-foreground"><Icon size={16} /><span>{label}</span></button>)}</nav><div className="mt-10 rounded-xl border border-border/15 bg-secondary/[.07] p-3"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground"><Bot size={15} /> Ask Lulu</div><p className="text-[11px] leading-relaxed text-muted-foreground">Get a clear answer from your business data.</p></div></aside>;
}
export function MarketingIntelligence() {
  const [period, setPeriod] = React.useState('Monthly');
  const [ask, setAsk] = React.useState('');
  const [model, setModel] = React.useState('Last Touch');
  const [sort, setSort] = React.useState('Revenue');
  return <main className="min-h-screen bg-[var(--background)] text-foreground"><div className="flex min-h-screen"><Sidebar /><div className="min-w-0 flex-1"><header className="sticky top-0 z-10 flex min-h-[70px] items-center justify-between border-b border-border/[.07] bg-[var(--background)]/95 px-5 backdrop-blur-xl lg:px-8"><div className="flex items-center gap-3"><button className="rounded-lg p-2 text-foreground lg:hidden" aria-label="Open navigation"><Menu size={19} /></button><p className="text-xs text-muted-foreground">Intelligence <span className="mx-1 text-foreground">/</span> Business Intelligence <span className="mx-1 text-foreground">/</span> <span className="text-foreground">Marketing</span></p></div><div className="flex items-center gap-2"><button className="hidden rounded-lg border border-border p-2 text-foreground sm:block" aria-label="Search"><Search size={17} /></button><button className="rounded-lg border border-border p-2 text-foreground" aria-label="Notifications"><Bell size={17} /></button><div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-primary text-xs font-bold text-[var(--primary-foreground)]">LS</div></div></header><div className="mx-auto max-w-[1450px] px-5 py-7 lg:px-8"><div className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end"><div><div className="mb-3 flex items-center gap-2 text-xs font-medium text-foreground"><span className="h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" />Live intelligence</div><h1 className="text-4xl font-bold tracking-[-.04em] text-foreground sm:text-5xl">Marketing</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Understand how your marketing generates attention, customers and revenue across every connected channel.</p></div><div className="flex flex-wrap items-center gap-2"><details className="relative"><summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground"><CalendarDays size={14} className="text-foreground" />Last 12 Months<ChevronDown size={13} /></summary><div className="absolute left-0 top-11 z-20 w-48 rounded-xl border border-border bg-[var(--secondary)] p-1.5 shadow-2xl">{['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last 12 Months', 'Year to Date', 'Previous Year', 'Custom Range'].map(item => <button key={item} className="block w-full rounded-lg px-3 py-2 text-left text-xs text-foreground hover:bg-secondary/15">{item}</button>)}</div></details><button className="hidden rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground md:block">Compare: Previous Year <ChevronDown size={13} className="ml-1 inline" /></button><button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-lg shadow-black/20 hover:bg-primary"><Bot size={14} />Ask Lulu AI</button><button className="rounded-lg border border-border p-2 text-foreground" aria-label="Refresh data"><RefreshCw size={15} /></button><button className="hidden rounded-lg border border-border px-3 py-2 text-xs text-foreground md:block"><FilePlus2 size={14} className="mr-1 inline" />Create Report</button><button className="rounded-lg border border-border p-2 text-foreground" aria-label="Export data"><Download size={15} /></button></div></div><div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-y border-border/[.07] py-3"><div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Marketing overview</p><p className="mt-1 text-xs text-muted-foreground">Last updated 2 minutes ago · All sources synced</p></div><div className="flex items-center gap-2"><span className="rounded-md bg-secondary/15 px-2 py-1 text-[10px] text-foreground">Last Touch Attribution</span><span className="rounded-md bg-chart-4/10 px-2 py-1 text-[10px] text-chart-4">9 sources connected</span></div></div><div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">{kpis.map(metric => <article key={metric.label} className="group rounded-2xl border border-border/[.08] bg-[var(--card)] p-4 transition hover:-translate-y-0.5 hover:border-border/30"><div className="flex items-start justify-between gap-2"><p className="text-xs text-muted-foreground">{metric.label}</p><Badge kind={metric.kind} /></div><p className="mt-4 text-xl font-semibold tracking-tight text-foreground">{metric.value}</p><p className="mt-1 text-[11px] text-muted-foreground">Prev. {metric.previous}</p><div className="mt-3 flex items-end justify-between"><span className={`flex items-center gap-1 text-xs font-semibold ${metric.down ? 'text-chart-1' : 'text-chart-4'}`}>{metric.down ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}{metric.change}</span><Sparkline color={metric.down ? 'var(--chart-1)' : 'var(--chart-2)'} /></div></article>)}</div>

<div className="grid gap-5 xl:grid-cols-2"><Card title="Marketing Performance Trend" eyebrow="12 month performance" wide><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-4 text-[11px] text-muted-foreground"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Revenue</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Leads</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Spend</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full border border-dashed border-border" />Previous year</span></div><div className="flex rounded-lg bg-secondary p-1">{['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'].map(item => <button key={item} onClick={() => setPeriod(item)} className={`rounded-md px-2.5 py-1 text-[11px] ${period === item ? 'bg-primary text-primary-foreground' : 'text-primary-foreground'}`}>{item}</button>)}</div></div><div className="grid h-64 grid-cols-12 items-end gap-2 border-b border-l border-border/[.08] bg-[linear-gradient(rgba(0,0,0,.035)_1px,transparent_1px)] bg-[length:100%_42px] px-3 pt-6">{months.map(item => <div key={item.m} className="flex h-full flex-col items-center justify-end gap-2"><div className="flex w-full items-end justify-center gap-1" style={{
                    height: 'calc(100% - 22px)'
                  }}><div className="w-1/2 rounded-t bg-secondary/80 transition-all hover:bg-primary" style={{
                      height: `${item.revenue}%`
                    }} /><div className="w-1/3 rounded-t bg-secondary/65" style={{
                      height: `${item.spend}%`
                    }} /></div><span className="text-[10px] text-muted-foreground">{item.m}</span></div>)}</div></Card><Card title="Marketing Growth" eyebrow="Momentum"><div className="mb-5 flex items-center gap-2"><span className="rounded-full bg-chart-4/10 px-2.5 py-1 text-xs font-semibold text-chart-4">Growing</span><span className="text-xs text-muted-foreground">vs previous year</span></div><div className="grid grid-cols-2 gap-5">{[['Revenue Growth', '+22.8%'], ['Lead Growth', '+23.5%'], ['Customer Growth', '+18.2%'], ['Traffic Growth', '+31.4%'], ['Conversion Growth', '-0.2pp'], ['Spend Growth', '+9.2%']].map(item => <div key={item[0]} className="border-l-2 border-border/50 pl-3"><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className={`mt-1 text-lg font-semibold ${item[1].startsWith('-') ? 'text-chart-1' : 'text-foreground'}`}>{item[1]}</p><Sparkline color={item[1].startsWith('-') ? 'var(--chart-1)' : 'var(--chart-4)'} /></div>)}</div></Card><Card title="Marketing Funnel" eyebrow="Only connected analytics and CRM stages shown" wide><div className="space-y-3">{funnel.map(stage => <div key={stage.label} className="flex items-center gap-3"><span className="w-36 shrink-0 text-xs text-muted-foreground">{stage.label}</span><div className="h-9 flex-1 rounded-r-lg bg-secondary"><div className="flex h-full items-center rounded-r-lg bg-gradient-to-r from-primary to-secondary/70 px-3 text-xs font-semibold text-foreground transition-all duration-700" style={{
                      width: stage.width
                    }}>{stage.value}</div></div><span className="hidden w-28 text-[11px] text-muted-foreground sm:block">{stage.rate}</span><span className="w-16 text-right text-[11px] text-chart-4">{stage.change}</span></div>)}</div></Card><Card title="Traffic" eyebrow="Google Analytics 4 · Connected"><div className="grid gap-5 md:grid-cols-[.8fr_1.2fr]"><div className="grid place-items-center"><div className="grid h-40 w-40 place-items-center rounded-full" style={{
                    background: 'conic-gradient(var(--primary) 0 39%, var(--chart-4) 39% 57%, var(--chart-4) 57% 72%, var(--primary) 72% 84%, var(--secondary) 84% 100%)'
                  }}><div className="grid h-28 w-28 place-items-center rounded-full bg-[var(--secondary)]"><div className="text-center"><p className="text-xl font-semibold text-foreground">148,400</p><p className="text-[10px] text-muted-foreground">sessions</p></div></div></div><p className="mt-3 text-xs text-chart-4">+31.6% vs previous</p></div><div className="space-y-2">{traffic.map((item, index) => <div key={item.name} className="flex items-center gap-2 text-xs"><span className={`h-2 w-2 rounded-full ${index % 3 === 0 ? 'bg-primary' : index % 3 === 1 ? 'bg-primary' : 'bg-primary'}`} /><span className="min-w-0 flex-1 text-foreground">{item.name}</span><span className="text-foreground">{item.value}</span><span className="w-12 text-right text-muted-foreground">{item.pct}</span><span className="w-12 text-right text-chart-4">{item.growth}</span></div>)}</div></div><div className="mt-5 grid grid-cols-3 gap-3 border-t border-border/[.06] pt-4 text-xs"><div><p className="text-muted-foreground">Unique Visitors</p><strong className="text-foreground">98,400</strong></div><div><p className="text-muted-foreground">Page Views</p><strong className="text-foreground">446,200</strong></div><div><p className="text-muted-foreground">Prev. Sessions</p><strong className="text-foreground">112,800</strong></div></div></Card><Card title="Organic Traffic" eyebrow="GA4 + Search Console"><div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{[['Organic Sessions', '58,200'], ['Organic Users', '38,600'], ['Organic Growth', '+41.9%'], ['Conversions', '1,940']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className="mt-2 text-lg font-semibold text-foreground">{item[1]}</p></div>)}</div><div className="mt-6 flex items-end gap-2 border-b border-border/[.07]">{[35, 42, 40, 49, 56, 62, 67, 72, 78, 84, 90, 100].map((height, index) => <div key={`${height}-${index}`} className="flex-1 rounded-t bg-secondary/70" style={{
                  height: `${height * .9}px`
                }} />)}</div><p className="mt-3 text-xs text-chart-4">Organic Revenue (attributed): €1,174,000 · +42.6% conversions</p></Card><Card title="Paid Traffic" eyebrow="Only connected platforms shown"><div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{[['Impressions', '1,240,000'], ['Clicks', '24,800'], ['CTR', '2.0%'], ['Paid Sessions', '34,130']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className="mt-2 text-lg font-semibold text-foreground">{item[1]}</p></div>)}</div><div className="mt-5 space-y-3">{[['Google Ads', '14,880 sessions', '€428,000', '4.8×'], ['Meta Ads', '11,870 sessions', '€298,000', '3.2×'], ['LinkedIn Ads', '5,940 sessions', '€148,000', '2.6×'], ['TikTok Ads', '1,440 sessions', '€24,000', '1.8×']].map(item => <div key={item[0]} className="flex items-center gap-3 border-b border-border/[.05] pb-2 text-xs"><span className="flex-1 text-foreground">{item[0]}</span><span className="text-muted-foreground">{item[1]}</span><span className="text-foreground">{item[2]}</span><strong className="text-foreground">ROAS {item[3]}</strong></div>)}</div></Card><Card title="Lead Generation" eyebrow="By connected channel"><div className="mb-5 grid grid-cols-3 gap-3">{[['Total Leads', '4,840'], ['MQLs', '1,936'], ['SQLs', '624']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className="mt-1 text-xl font-semibold text-foreground">{item[1]}</p><p className="text-[11px] text-chart-4">+23.5%</p></div>)}</div><div className="space-y-3">{leads.map(item => <div key={item.name} className="flex items-center gap-3 text-xs"><span className="w-24 text-muted-foreground">{item.name}</span><div className="h-2 flex-1 rounded-full bg-secondary"><div className="h-full rounded-full bg-gradient-to-r from-primary to-primary text-primary-foreground" style={{
                      width: `${item.pct * 2.5}%`
                    }} /></div><span className="w-10 text-right text-foreground">{item.value}</span><span className="w-8 text-right text-muted-foreground">{item.pct}%</span></div>)}</div></Card><Card title="Marketing Customer Acquisition" eyebrow="Attributed"><div className="mb-5 flex items-end justify-between"><div><p className="text-3xl font-semibold text-foreground">156</p><p className="text-xs text-muted-foreground">new customers · prev 132</p></div><span className="text-sm font-semibold text-chart-4">+18.2%</span></div><div className="grid grid-cols-2 gap-3">{[['Organic Search', '52', 'CAC €84'], ['Referral', '24', 'CAC €148'], ['Paid Search', '20', 'CAC €442'], ['Direct', '18', 'CAC €320'], ['Paid Social', '16', 'CAC €384'], ['Email', '14', 'CAC €124']].map(item => <div key={item[0]} className="rounded-xl bg-secondary p-3"><p className="text-xs text-muted-foreground">{item[0]}</p><p className="mt-1 text-lg font-semibold text-foreground">{item[1]}</p><p className="text-[11px] text-foreground">{item[2]}</p></div>)}</div></Card><Card title="Marketing CAC" eyebrow="Calculated — CAC = Marketing Acquisition Spend / New Customers"><div className="flex items-end justify-between"><div><Badge kind="Calculated" /><p className="mt-3 text-3xl font-semibold text-foreground">€2,744</p><p className="text-xs text-muted-foreground">previous €2,970</p></div><span className="text-sm font-semibold text-chart-4">-7.6% improving</span></div><div className="mt-6"><Sparkline color="var(--chart-4)" /></div><div className="mt-4 grid grid-cols-4 gap-2 text-xs text-muted-foreground"><span>Organic €84</span><span>Referral €148</span><span>Paid €442</span><span>Email €124</span></div></Card><Card title="Customer Lifetime Value" eyebrow="Calculated / Estimated"><div className="flex items-end justify-between"><div><p className="text-3xl font-semibold text-foreground">€14,280</p><p className="text-xs text-muted-foreground">average CLV · median €9,840</p></div><span className="text-sm font-semibold text-chart-4">+8.8%</span></div><div className="mt-5 grid grid-cols-2 gap-3 text-xs">{[['Organic', '€18,400'], ['Referral', '€22,600'], ['Enterprise', '€48,600'], ['SMB', '€6,240']].map(item => <div key={item[0]} className="flex justify-between border-b border-border/[.05] pb-2"><span className="text-muted-foreground">{item[0]}</span><strong className="text-foreground">{item[1]}</strong></div>)}</div><div className="mt-4"><Sparkline color="var(--chart-2)" /></div></Card><Card title="Marketing Revenue" eyebrow="Attributed (Last Touch)" wide><div className="mb-5 flex items-end justify-between"><div><p className="text-3xl font-semibold text-foreground">€2,996,000</p><p className="text-xs text-muted-foreground">prev €2,440,000 · attributed share 70.0%</p></div><span className="text-sm font-semibold text-chart-4">+22.8%</span></div><div className="space-y-3">{[['Organic Search', '€1,174,000', 39, '+42%'], ['Paid Search', '€508,000', 17, '+12%'], ['Referral', '€388,000', 13, '+28%'], ['Direct', '€328,000', 11, '+18%'], ['Paid Social', '€268,000', 9, '+22%'], ['Email', '€208,000', 7, '+8%'], ['Content', '€122,000', 4, '+34%']].map(item => <div key={item[0]} className="flex items-center gap-3 text-xs"><span className="w-24 text-muted-foreground">{item[0]}</span><div className="h-2 flex-1 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary text-primary-foreground" style={{
                      width: `${Number(item[2]) * 2.1}%`
                    }} /></div><span className="w-24 text-right text-foreground">{item[1]}</span><span className="w-10 text-right text-foreground">{item[3]}</span></div>)}</div><div className="mt-5 flex flex-wrap gap-2">{['Q4 Enterprise Launch · €484k', 'Organic SEO · €428k', 'Spring Mid-Market · €312k', 'Referral Program · €268k', 'Email Nurture · €208k'].map(item => <span key={item} className="rounded-lg bg-secondary px-3 py-2 text-[11px] text-foreground">{item}</span>)}</div></Card><Card title="Marketing ROI" eyebrow="ROI = (Attributed Revenue − Marketing Spend) / Marketing Spend × 100"><div className="flex items-end justify-between"><div><Badge kind="Calculated" /><p className="mt-3 text-3xl font-semibold text-foreground">600%</p><p className="text-xs text-muted-foreground">previous 522%</p></div><span className="text-sm font-semibold text-chart-4">+78pp</span></div><div className="mt-5 grid grid-cols-2 gap-3 text-xs">{[['Organic', '1,296%'], ['Referral', '562%'], ['Email', '390%'], ['Content', '522%'], ['Paid Search', '185%'], ['Paid Social', '142%']].map(item => <div key={item[0]} className="flex justify-between rounded-lg bg-secondary p-3"><span className="text-muted-foreground">{item[0]}</span><strong className="text-foreground">{item[1]}</strong></div>)}</div><p className="mt-4 text-[11px] text-muted-foreground">ROI values use Last Touch attribution. Different models may produce different values.</p></Card><Card title="Marketing ROAS" eyebrow="Calculated — ROAS = Attributed Revenue / Ad Spend"><div className="flex items-end justify-between"><div><p className="text-3xl font-semibold text-foreground">3.4×</p><p className="text-xs text-muted-foreground">paid overall · previous 3.1×</p></div><span className="text-sm text-chart-4">+0.3×</span></div><div className="mt-5 space-y-3">{[['Google Ads', '4.8×', '€89,600', '€428,000'], ['Meta Ads', '3.2×', '€93,200', '€298,000'], ['LinkedIn Ads', '2.6×', '€57,000', '€148,000'], ['TikTok Ads', '1.8×', '€13,400', '€24,000']].map(item => <div key={item[0]} className="grid grid-cols-[1fr_.5fr_.8fr_.8fr] gap-2 border-b border-border/[.05] pb-2 text-xs"><span className="text-foreground">{item[0]}</span><strong className="text-foreground">{item[1]}</strong><span className="text-muted-foreground">{item[2]}</span><span className="text-foreground">{item[3]}</span></div>)}</div></Card>

<Card title="Marketing Channel Performance" eyebrow="Sortable · filterable" wide><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><span className="flex items-center gap-2 text-xs text-muted-foreground"><Filter size={13} /> 7 connected channels</span><label className="text-xs text-muted-foreground">Sort by <select value={sort} onChange={e => setSort(e.target.value)} className="ml-1 rounded-lg border border-border bg-[var(--secondary)] px-2 py-1 text-foreground" aria-label="Sort channels"><option>Revenue</option><option>Leads</option><option>ROI</option><option>CAC</option></select></label></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-xs"><thead className="border-b border-border/[.07] text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Channel', 'Traffic', 'Leads', 'Customers', 'Revenue', 'Spend', 'CAC', 'ROI', 'Conv Rate'].map(h => <th key={h} className="pb-3 pr-4 font-medium">{h}</th>)}</tr></thead><tbody>{channels.map(row => <tr key={row.name} className="border-b border-border/[.05] last:border-0"><td className="py-3 pr-4 font-medium text-foreground">{row.name}</td><td className="py-3 pr-4 text-muted-foreground">{row.traffic}</td><td className="py-3 pr-4 text-foreground">{row.leads}</td><td className="py-3 pr-4 text-foreground">{row.customers}</td><td className="py-3 pr-4 text-foreground">{row.revenue}</td><td className="py-3 pr-4 text-muted-foreground">{row.spend}</td><td className="py-3 pr-4 text-foreground">{row.cac}</td><td className="py-3 pr-4 text-foreground">{row.roi}</td><td className="py-3 text-foreground">{row.conv}</td></tr>)}</tbody></table></div></Card><Card title="Campaign Performance" eyebrow="Sort: Revenue · Leads · ROI · Customers · CAC" wide><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-xs"><thead className="border-b border-border/[.07] text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Campaign', 'Reach', 'Traffic', 'Leads', 'Customers', 'Revenue', 'Spend', 'CAC', 'ROI', 'Conv'].map(h => <th key={h} className="pb-3 pr-4 font-medium">{h}</th>)}</tr></thead><tbody>{campaigns.map(row => <tr key={row.name} className="border-b border-border/[.05] last:border-0"><td className="py-3 pr-4 font-medium text-foreground">{row.name}</td><td className="py-3 pr-4 text-muted-foreground">{row.reach}</td><td className="py-3 pr-4 text-muted-foreground">{row.traffic}</td><td className="py-3 pr-4 text-foreground">{row.leads}</td><td className="py-3 pr-4 text-foreground">{row.customers}</td><td className="py-3 pr-4 text-foreground">{row.revenue}</td><td className="py-3 pr-4 text-muted-foreground">€84,000</td><td className="py-3 pr-4 text-foreground">€3,000</td><td className="py-3 pr-4 text-foreground">{row.roi}</td><td className="py-3 text-foreground">3.4%</td></tr>)}</tbody></table></div><p className="mt-4 text-[11px] text-muted-foreground">Campaign editing is available in the Campaigns module.</p></Card><Card title="Marketing Attribution" eyebrow="Credit allocation, not causal certainty"><div className="mb-5 flex flex-wrap items-center gap-2"><span className="text-xs text-muted-foreground">Active model:</span><strong className="rounded-md bg-secondary/15 px-2 py-1 text-xs text-foreground">{model}</strong>{['First Touch', 'Last Touch', 'Linear', 'Position Based', 'Time Decay', 'Data-Driven'].map(item => <button key={item} onClick={() => setModel(item)} className={`rounded-lg border px-2.5 py-1.5 text-[11px] ${model === item ? 'border-border/50 bg-secondary/15 text-foreground' : 'border-border/[.07] text-foreground'}`}>{item}</button>)}</div><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-xs"><thead className="border-b border-border/[.07] text-[10px] uppercase text-muted-foreground"><tr>{['Channel', 'First Touch', 'Last Touch', 'Linear', 'Position Based'].map(h => <th key={h} className="pb-3 pr-5">{h}</th>)}</tr></thead><tbody>{[['Organic Search', '€1,484,000', '€1,174,000', '€1,316,000', '€1,398,000'], ['Paid Search', '€328,000', '€508,000', '€442,000', '€418,000'], ['Referral', '€484,000', '€388,000', '€428,000', '€452,000']].map(row => <tr key={row[0]} className="border-b border-border/[.05]">{row.map((cell, index) => <td key={cell} className={`py-3 pr-5 ${index === 0 ? 'text-foreground' : 'text-foreground'}`}>{cell}</td>)}</tr>)}</tbody></table></div><p className="mt-4 text-[11px] leading-5 text-muted-foreground">Attribution assigns credit according to the selected model. No attribution model represents causal certainty.</p></Card><Card title="Marketing Budget & Targets" eyebrow="Organization-defined"><div className="grid grid-cols-2 gap-4">{[['Annual Budget', '€480,000'], ['Actual Spend YTD', '€428,000'], ['Remaining', '€52,000'], ['Utilization', '89.2%']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className="mt-2 text-xl font-semibold text-foreground">{item[1]}</p></div>)}</div><div className="mt-5 h-2 rounded-full bg-secondary"><div className="h-full w-[89.2%] rounded-full bg-chart-4" /></div><div className="mt-5 space-y-3">{[['Revenue Target', '€2,996,000 / €3,200,000', '93.6%', 'On Track'], ['Leads Target', '4,840 / 5,000', '96.8%', 'On Track'], ['Customers Target', '156 / 180', '86.7%', 'Behind'], ['ROI Target', '600% / 550%', '109.1%', 'Ahead']].map(item => <div key={item[0]} className="flex items-center gap-3 text-xs"><span className="flex-1 text-muted-foreground">{item[0]}</span><span className="text-foreground">{item[1]}</span><span className="text-foreground">{item[2]}</span><span className={`rounded px-2 py-1 ${item[3] === 'Behind' ? 'bg-secondary/10 text-foreground' : item[3] === 'Ahead' ? 'bg-secondary/10 text-foreground' : 'bg-secondary/10 text-foreground'}`}>{item[3]}</span></div>)}</div><p className="mt-4 text-[11px] text-muted-foreground">Targets and budgets are organization-defined. No targets are created automatically.</p></Card><Card title="Marketing Benchmark" eyebrow="Actual · Benchmark · Target" wide><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{[['Marketing ROI', '600%', '280%', '550%'], ['CAC', '€2,744', '€3,200', '€2,500'], ['CLV / CAC', '5.2×', '3.0×', '5.0×'], ['Conversion Rate', '3.3%', '2.8%', '4.0%'], ['Email CTR', '4.8%', '3.4%', '5.0%']].map(item => <div key={item[0]} className="rounded-xl border border-border/[.06] bg-secondary p-4"><p className="text-xs text-muted-foreground">{item[0]}</p><p className="mt-3 text-2xl font-semibold text-foreground">{item[1]}</p><div className="mt-3 flex justify-between text-[10px] text-muted-foreground"><span>Benchmark {item[2]}</span><span>Target {item[3]}</span></div></div>)}</div></Card><Card title="Marketing by Geography" eyebrow="Map · Ranking · Comparison"><div className="grid gap-5 md:grid-cols-[.8fr_1.2fr]"><div className="grid min-h-48 place-items-center rounded-xl border border-border/[.06] bg-[var(--secondary)]"><div className="text-center"><Globe2 size={70} className="mx-auto text-foreground/70" /><p className="mt-3 text-xs text-muted-foreground">Marketing intensity map</p><p className="mt-1 text-[10px] text-foreground">United Kingdom leads at €1.174M</p></div></div><div className="space-y-3">{[['United Kingdom', '58,200', '52', '€1,174,000', '724%'], ['Germany', '29,700', '28', '€598,000', '612%'], ['United States', '22,260', '20', '€448,000', '540%'], ['France', '14,840', '14', '€298,000', '482%'], ['Netherlands', '11,870', '12', '€248,000', '434%']].map((item, index) => <div key={item[0]} className="grid grid-cols-[20px_1fr_.6fr_.6fr_.8fr] gap-2 text-xs"><span className="text-muted-foreground">0{index + 1}</span><span className="text-foreground">{item[0]}</span><span className="text-muted-foreground">{item[1]}</span><span className="text-muted-foreground">{item[2]} cust.</span><strong className="text-foreground">{item[3]}</strong></div>)}</div></div></Card><Card title="Marketing Conversion" eyebrow="Downstream quality"><div className="space-y-4">{[['Visitor → Lead', '3.3%', '3.5%', '-0.2pp'], ['Lead → MQL', '40.0%', '38.2%', '+1.8pp'], ['MQL → Customer', '8.1%', '7.4%', '+0.7pp'], ['Visitor → Customer', '0.11%', '0.10%', '+0.01pp']].map(item => <div key={item[0]} className="flex items-center gap-3 border-b border-border/[.05] pb-3 text-xs"><span className="w-32 text-muted-foreground">{item[0]}</span><strong className="w-16 text-foreground">{item[1]}</strong><span className="w-16 text-muted-foreground">Prev {item[2]}</span><span className={item[3].startsWith('-') ? 'text-chart-1' : 'text-chart-4'}>{item[3]}</span><Sparkline color={item[3].startsWith('-') ? 'var(--chart-1)' : 'var(--chart-3)'} /></div>)}</div><p className="mt-4 text-[11px] text-muted-foreground">Visitor-to-lead declined slightly due to volume growth; downstream conversions improved.</p></Card><Card title="Marketing Contribution" eyebrow="Attributed share"><div className="mb-5 h-10 overflow-hidden rounded-xl"><div className="flex h-full items-center bg-primary px-4 text-xs font-semibold text-primary-foreground" style={{
                  width: '70%'
                }}>Marketing-attributed 70%</div></div><div className="grid grid-cols-3 gap-3 text-xs">{[['Leads', '4,840 / 4,840', '100%'], ['Customers', '156 / 268', '58.2%'], ['Revenue', '€2,996,000 / €4.28M', '70.0%']].map(item => <div key={item[0]}><p className="text-muted-foreground">{item[0]}</p><strong className="mt-1 block text-foreground">{item[1]}</strong><span className="text-foreground">{item[2]}</span></div>)}</div></Card><Card title="Explain Marketing Performance" eyebrow="AI Explanation" wide><div className="flex gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary text-[var(--primary-foreground)]"><Bot size={20} /></div><div><p className="text-sm leading-6 text-foreground">Marketing attributed revenue grew <strong className="text-foreground">22.8%</strong> to €2,996,000 using Last Touch attribution. Organic Search led at €1,174,000 (39.2%), driven by a 42% increase in organic sessions. Spend grew only 9.2% while revenue grew 22.8%, improving overall efficiency. Visitor-to-lead declined 0.2pp due to higher awareness volume, while MQL-to-customer improved +0.7pp.</p><button className="mt-4 rounded-lg bg-secondary/15 px-3 py-2 text-xs font-semibold text-foreground">View AI Recommendations <ChevronRight size={14} className="inline" /></button></div></div></Card><Card title="Ask Lulu AI" eyebrow="Explore your marketing"><form onSubmit={e => {
                e.preventDefault();
                setAsk('');
              }} className="flex gap-2"><div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-[var(--secondary)] px-4"><MessageSquare size={16} className="text-muted-foreground" /><input value={ask} onChange={e => setAsk(e.target.value)} placeholder="Ask Lulu AI about your marketing performance..." className="w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground" aria-label="Ask Lulu AI about marketing" /></div><button className="rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground" type="submit">Ask</button></form><div className="mt-4 flex flex-wrap gap-2">{prompts.map(prompt => <button key={prompt} onClick={() => setAsk(prompt)} className="rounded-full border border-border/[.08] px-3 py-1.5 text-[11px] text-foreground hover:border-border/40 hover:text-foreground">{prompt}</button>)}</div></Card></div><div className="mt-6 rounded-2xl border border-border/[.08] bg-[var(--secondary)] p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-[17px] font-semibold text-foreground">Data Sources</h2><p className="mt-1 text-xs text-muted-foreground">Marketing intelligence is built from your connected business systems.</p></div><button className="text-xs text-foreground">Manage sources <ChevronRight size={13} className="inline" /></button></div><div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">{sources.map(source => <div key={source} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-3"><span className="text-xs text-foreground">{source}</span><span className={`text-[10px] ${source === 'Billing' ? 'text-foreground' : 'text-chart-4'}`}>{source === 'Billing' ? 'Partial' : 'Connected'}</span></div>)}</div></div><div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/[.07] pt-5 text-[11px] text-muted-foreground"><span>Marketing Intelligence · Lulu AI Business OS</span><span>Observed · Calculated · Estimated · Attributed · Target · Benchmark · Forecast · AI Explanation</span></div></div></div></div></main>;
}