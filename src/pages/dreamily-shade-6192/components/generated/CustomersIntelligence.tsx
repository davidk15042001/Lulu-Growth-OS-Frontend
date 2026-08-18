import * as React from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Bot, CalendarDays, ChevronDown, ChevronRight, Download, FilePlus2, LineChart, Menu, MessageSquare, MoreHorizontal, RefreshCw, Search, Settings, Sparkles, Target, Users } from 'lucide-react';
type Metric = {
  label: string;
  value: string;
  prev: string;
  change: string;
  source: string;
  down?: boolean;
};
type Customer = {
  name: string;
  revenue: string;
  share: string;
  growth: string;
  previous: string;
  segment: string;
};
const overview: Metric[] = [{
  label: 'Total Customers',
  value: '1,068',
  prev: '980',
  change: '+9.0%',
  source: 'Observed'
}, {
  label: 'Active Customers',
  value: '892',
  prev: '801',
  change: '+11.4%',
  source: 'Observed'
}, {
  label: 'New Customers',
  value: '156',
  prev: '132',
  change: '+18.2%',
  source: 'Observed'
}, {
  label: 'Returning Customers',
  value: '736',
  prev: '668',
  change: '+10.2%',
  source: 'Observed'
}, {
  label: 'Retention Rate',
  value: '84.6%',
  prev: '82.1%',
  change: '+2.5pp',
  source: 'Calculated'
}, {
  label: 'Churn Rate',
  value: '5.8%',
  prev: '7.2%',
  change: '-1.4pp',
  source: 'Calculated',
  down: true
}];
const months = [{
  m: 'Apr',
  v: 48,
  n: 34,
  c: 8
}, {
  m: 'May',
  v: 52,
  n: 38,
  c: 7
}, {
  m: 'Jun',
  v: 55,
  n: 40,
  c: 8
}, {
  m: 'Jul',
  v: 59,
  n: 43,
  c: 7
}, {
  m: 'Aug',
  v: 63,
  n: 45,
  c: 6
}, {
  m: 'Sep',
  v: 67,
  n: 48,
  c: 7
}, {
  m: 'Oct',
  v: 71,
  n: 51,
  c: 6
}, {
  m: 'Nov',
  v: 76,
  n: 54,
  c: 6
}, {
  m: 'Dec',
  v: 80,
  n: 57,
  c: 5
}, {
  m: 'Jan',
  v: 85,
  n: 61,
  c: 5
}, {
  m: 'Feb',
  v: 91,
  n: 64,
  c: 4
}, {
  m: 'Mar',
  v: 98,
  n: 68,
  c: 4
}];
const customers: Customer[] = [{
  name: 'Connected customer',
  revenue: '€428,000',
  share: '10.0%',
  growth: '+18%',
  previous: '€362,700',
  segment: 'Enterprise'
}, {
  name: 'Meridian Group',
  revenue: '€312,000',
  share: '7.3%',
  growth: '+12%',
  previous: '€278,600',
  segment: 'Enterprise'
}, {
  name: 'BlueWave Ltd',
  revenue: '€264,000',
  share: '6.2%',
  growth: '+24%',
  previous: '€212,900',
  segment: 'Mid-Market'
}, {
  name: 'Vertex Systems',
  revenue: '€198,000',
  share: '4.6%',
  growth: '-3%',
  previous: '€204,100',
  segment: 'SMB'
}, {
  name: 'Orion Partners',
  revenue: '€176,000',
  share: '4.1%',
  growth: '+31%',
  previous: '€134,400',
  segment: 'Mid-Market'
}, {
  name: 'Summit Tech',
  revenue: '€148,000',
  share: '3.5%',
  growth: '+9%',
  previous: '€135,800',
  segment: 'Enterprise'
}, {
  name: 'Coastal Industries',
  revenue: '€124,000',
  share: '2.9%',
  growth: '-8%',
  previous: '€134,800',
  segment: 'SMB'
}, {
  name: 'Nova Analytics',
  revenue: '€116,000',
  share: '2.7%',
  growth: '+44%',
  previous: '€80,600',
  segment: 'Mid-Market'
}];
const channels = [['Direct Sales', '52', '33%', '+14%', '€320'], ['Organic Search', '36', '23%', '+31%', '€84'], ['Referral', '22', '14%', '+22%', '€148'], ['Paid Search', '18', '12%', '+6%', '€442'], ['Partner', '14', '9%', '+19%', '€268'], ['Email', '8', '5%', '+9%', '€124'], ['Other', '6', '4%', '+3%', 'varies']];
const segments = [['Enterprise', '52', '€1,712,000', '+16%', '96.2%', '1.8%', '€48,600'], ['Mid-Market', '156', '€1,284,000', '+22%', '88.4%', '4.2%', '€18,400'], ['SMB', '340', '€856,000', '+11%', '80.2%', '8.4%', '€6,240'], ['Startup', '520', '€428,000', '+18%', '74.6%', '12.8%', '€2,840']];
const geo = [['United Kingdom', '374', '35%', '+12%', '€1.5M'], ['Germany', '214', '20%', '+19%', '€856k'], ['United States', '160', '15%', '+24%', '€642k'], ['France', '107', '10%', '+8%', '€428k'], ['Netherlands', '85', '8%', '+28%', '€342k'], ['Other', '128', '12%', '+14%', '€512k']];
const sources = [['Organic Search', '228', '+31%', '€84', '86.4%', '€940,800', '€12,400'], ['Direct', '214', '+14%', '€320', '88.2%', '€856,000', '€14,800'], ['Referral', '128', '+22%', '€148', '91.4%', '€513,600', '€18,200'], ['Paid Search', '107', '+6%', '€442', '78.6%', '€428,000', '€8,400'], ['Partner', '96', '+19%', '€268', '89.6%', '€384,000', '€16,200'], ['Email', '64', '+9%', '€124', '84.2%', '€256,800', '€10,800'], ['Other', '231', '+8%', 'varies', '80.4%', '€900,800', 'varies']];
const cohort = ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024'];
function Spark({
  color = 'var(--primary)'
}: {
  color?: string;
}) {
  return <svg viewBox="0 0 100 30" className="h-8 w-24" role="img" aria-label="Upward trend"><polyline points="2,25 14,22 25,23 38,16 49,18 62,10 75,12 88,6 98,3" fill="none" stroke={color} strokeWidth="2.5" /><circle cx="98" cy="3" r="2.5" fill={color} /></svg>;
}
function Card({
  title,
  eyebrow,
  children,
  className = ''
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`rounded-2xl border border-border/[.08] bg-[var(--card)]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,.16)] ${className}`}><header className="mb-5 flex items-start justify-between gap-4"><div>{eyebrow && <p className="mb-1 text-[10px] font-semibold uppercase tracking-[.18em] text-foreground">{eyebrow}</p>}<h2 className="text-[17px] font-semibold tracking-tight text-foreground">{title}</h2></div><button className="rounded-lg p-1.5 text-foreground hover:bg-secondary hover:text-foreground" aria-label={`More options for ${title}`}><MoreHorizontal size={18} /></button></header>{children}</section>;
}
function Bars({
  color = 'bg-primary',
  negative = false
}: {
  color?: string;
  negative?: boolean;
}) {
  return <div className="flex h-40 items-end gap-2 border-b border-l border-border/[.08] bg-[linear-gradient(rgba(0,0,0,.035)_1px,transparent_1px)] bg-[length:100%_36px] px-3 pt-4">{months.map(item => <div key={item.m} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="flex w-full items-end justify-center gap-1"><div className={`w-2 rounded-t ${color}`} style={{
          height: `${item.v}%`
        }} /><div className={`w-1.5 rounded-t ${negative ? 'bg-chart-5/70' : 'bg-secondary/70'}`} style={{
          height: `${item.n}%`
        }} /></div><span className="text-[9px] text-muted-foreground">{item.m}</span></div>)}</div>;
}
function Sidebar() {
  return <aside className="hidden w-[236px] shrink-0 border-r border-border/[.07] bg-[var(--sidebar)] px-3 py-5 lg:block"><div className="flex items-center gap-3 px-3"><div className="grid h-8 w-8 place-items-center rounded-xl bg-primary shadow-lg shadow-black/30 text-primary-foreground"><Sparkles size={16} /></div><div><p className="text-sm font-bold text-foreground">Lulu <span className="text-foreground">AI</span></p><p className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">Business OS</p></div></div><div className="my-7 h-px bg-secondary" /><LuluSectionNavigation activeId="dreamily-shade-6192" /><div className="mt-10 rounded-xl border border-border/15 bg-secondary/[.07] p-3"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground"><Bot size={15} />Ask Lulu</div><p className="text-[11px] leading-relaxed text-muted-foreground">Get a clear answer from your business data.</p></div></aside>;
}
export function CustomersIntelligence() {
  const [dateOpen, setDateOpen] = React.useState(false);
  const [ask, setAsk] = React.useState('');
  const [period, setPeriod] = React.useState('Monthly');
  const [sort, setSort] = React.useState('Highest Revenue');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setAsk('');
  };
  const { items: liveCustomerInsights, loading: liveLoading, error: liveError } = useLiveRecords('crm_customer_insights');
  const liveEmpty = !liveLoading && !liveError && liveCustomerInsights.length === 0;
  const formatMoney = (amount: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: liveCustomerInsights[0]?.currency || 'EUR', maximumFractionDigits: 0 }).format(amount);
  const liveCustomers: Customer[] = liveCustomerInsights.map(record => { const revenue = Number(record.valueAmount || record.data?.revenue || 0); return { name: record.name, revenue: formatMoney(revenue), share: 'Live', growth: String(record.data?.growth || '—'), previous: String(record.data?.previousRevenue || '—'), segment: String(record.data?.segment || record.stage || 'Unclassified') }; });
  const liveRevenue = liveCustomers.reduce((sum, customer) => sum + Number(customer.revenue.replace(/[^0-9.-]/g, '') || 0), 0);
  const liveOverview: Metric[] = [{ label: 'Total Customers', value: String(liveCustomerInsights.length), prev: '—', change: 'Live records', source: 'Observed' }, { label: 'Active Customers', value: String(liveCustomerInsights.filter(record => !/inactive|churn/i.test(`${record.status} ${record.data?.status || ''}`)).length), prev: '—', change: 'Live status', source: 'Observed' }, { label: 'New Customers', value: String(liveCustomerInsights.filter(record => /new/i.test(`${record.status} ${record.stage || ''}`)).length), prev: '—', change: 'Live status', source: 'Observed' }, { label: 'Customer Revenue', value: formatMoney(liveRevenue), prev: '—', change: 'Live valueAmount', source: 'Observed' }, { label: 'Retention Rate', value: 'Not available', prev: '—', change: 'Needs retention events', source: 'Calculated' }, { label: 'Churn Rate', value: 'Not available', prev: '—', change: 'Needs churn events', source: 'Calculated' }];
  return <main className="min-h-screen bg-[var(--background)] text-foreground"><div className="flex min-h-screen"><Sidebar /><div className="min-w-0 flex-1">{liveLoading ? <div className="border-b border-border/[.07] bg-secondary/30 px-5 py-3 text-xs text-muted-foreground lg:px-8">Loading live customer intelligence…</div> : liveError ? <div className="border-b border-destructive/30 bg-destructive/5 px-5 py-3 text-xs text-destructive lg:px-8">{liveError}</div> : liveEmpty ? <div className="border-b border-dashed border-border bg-card px-5 py-3 text-xs text-muted-foreground lg:px-8">No live customer insight records are available yet. Connect your CRM or add customer activity to begin.</div> : null}<header className="sticky top-0 z-10 flex min-h-[70px] items-center justify-between border-b border-border/[.07] bg-[var(--background)]/95 px-5 backdrop-blur-xl lg:px-8"><div className="flex items-center gap-3"><button className="rounded-lg p-2 text-foreground lg:hidden" aria-label="Open navigation"><Menu size={19} /></button><p className="text-xs text-muted-foreground">Intelligence <span className="mx-1 text-foreground">/</span> Business Intelligence <span className="mx-1 text-foreground">/</span> <span className="text-foreground">Customers</span></p></div><div className="flex items-center gap-2"><button className="hidden rounded-lg border border-border p-2 text-foreground sm:block" aria-label="Search"><Search size={17} /></button><button className="rounded-lg border border-border p-2 text-foreground" aria-label="Notifications"><Bell size={17} /></button><div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-primary text-xs font-bold text-[var(--primary-foreground)]">LS</div></div></header><div className="mx-auto max-w-[1450px] px-5 py-7 lg:px-8"><div className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end"><div><div className="mb-3 flex items-center gap-2 text-xs font-medium text-foreground"><span className="h-1.5 w-1.5 rounded-full bg-chart-4" />Live intelligence</div><h1 className="text-4xl font-bold tracking-[-.04em] text-foreground sm:text-5xl">Customers</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Understand your customer base, customer growth, retention, value and behavior.</p></div><div className="flex flex-wrap items-center gap-2"><div className="relative"><button onClick={() => setDateOpen(!dateOpen)} className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground" aria-expanded={dateOpen}><CalendarDays size={14} className="text-foreground" />Last 12 Months<ChevronDown size={13} /></button>{dateOpen && <div className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-border bg-[var(--secondary)] p-1.5 shadow-2xl">{['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last 12 Months', 'Year to Date', 'Previous Year', 'Custom Range'].map(item => <button key={item} onClick={() => setDateOpen(false)} className="w-full rounded-lg px-3 py-2 text-left text-xs text-foreground hover:bg-secondary/15">{item}</button>)}</div>}</div><button className="hidden rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground md:block">Compare: Previous Year <ChevronDown size={13} className="ml-1 inline" /></button><button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"><Bot size={14} />Ask Lulu AI</button><button className="rounded-lg border border-border p-2 text-foreground" aria-label="Refresh data"><RefreshCw size={15} /></button><button className="hidden rounded-lg border border-border px-3 py-2 text-xs text-foreground md:block"><FilePlus2 size={14} className="mr-1 inline" />Create Report</button><button className="rounded-lg border border-border p-2 text-foreground" aria-label="Export data"><Download size={15} /></button></div></div><div className="mb-8 flex items-center justify-between border-y border-border/[.07] py-3"><div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Customer overview</p><p className="mt-1 text-xs text-muted-foreground">Last updated 2 minutes ago · All sources synced</p></div><span className="rounded-md bg-chart-4/10 px-2 py-1 text-[10px] text-chart-4">5 sources connected</span></div><div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">{liveOverview.map(metric => <article key={metric.label} className="rounded-2xl border border-border/[.08] bg-[var(--card)] p-4 transition hover:-translate-y-0.5 hover:border-border/30"><div className="flex items-start justify-between"><p className="text-xs text-muted-foreground">{metric.label}</p><span className={`rounded px-1.5 py-0.5 text-[9px] ${metric.source === 'Observed' ? 'bg-card/60 text-foreground' : 'bg-secondary/10 text-foreground'}`}>{metric.source}</span></div><p className="mt-4 text-xl font-semibold text-foreground">{metric.value}</p><p className="mt-1 text-[11px] text-muted-foreground">Prev. {metric.prev}</p><div className="mt-3 flex items-end justify-between"><span className={`flex items-center gap-1 text-xs font-semibold ${metric.down ? 'text-foreground' : 'text-chart-4'}`}>{metric.down ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />} {metric.change} {metric.down && '(improving)'}</span><Spark /></div></article>)}</div>
<div className="grid gap-5 xl:grid-cols-2"><Card title="Customer Growth" eyebrow="12 month performance"><div className="mb-4 flex items-center gap-2"><span className="rounded-full bg-chart-4/10 px-2.5 py-1 text-xs font-semibold text-chart-4">Growing</span><span className="text-xs text-muted-foreground">vs previous year</span></div><div className="grid grid-cols-2 gap-4">{[['Customer Growth Rate', '+9.0%'], ['New Customer Growth', '+18.2%'], ['Active Customer Growth', '+11.4%'], ['Returning Customer Growth', '+10.2%']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className="mt-1 text-lg font-semibold text-foreground">{item[1]}</p></div>)}</div><Bars /></Card><Card title="Customer Retention" eyebrow="Calculated"><div className="flex items-center gap-6"><div className="grid h-32 w-32 shrink-0 place-items-center rounded-full" style={{
                  background: 'conic-gradient(var(--primary) 0 84.6%, var(--secondary) 84.6% 100%)'
                }}><div className="grid h-24 w-24 place-items-center rounded-full bg-[var(--secondary)]"><strong className="text-2xl text-foreground">84.6%</strong></div></div><div className="grid flex-1 grid-cols-2 gap-4">{[['Returning Customer Rate', '82.6%'], ['Repeat Purchase Rate', '68.4%'], ['Retained Customers', '736'], ['Previous Period', '668']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className="mt-1 text-lg font-semibold text-foreground">{item[1]}</p></div>)}</div></div><div className="mt-5"><Spark color="var(--foreground)" /></div></Card><Card title="Customer Base Trend" eyebrow="Observed" className="xl:col-span-2"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div className="flex gap-4 text-[11px] text-muted-foreground"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Total Customers</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />New Customers</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-destructive" />Churned</span></div><div className="flex rounded-lg bg-secondary p-1">{['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'].map(item => <button key={item} onClick={() => setPeriod(item)} className={`rounded-md px-2.5 py-1 text-[11px] ${period === item ? 'bg-primary text-primary-foreground' : 'text-primary-foreground'}`}>{item}</button>)}</div></div><Bars /><div className="mt-3 flex justify-between text-[10px] text-muted-foreground"><span>Apr</span><span>Mar</span></div></Card><Card title="Customer Acquisition" eyebrow="Observed"><div className="mb-5 grid grid-cols-3 gap-3">{[['New Customers', '156'], ['Acquisition Rate', '+18.2%'], ['CAC', '€284']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className="mt-1 text-xl font-semibold text-foreground">{item[1]}</p></div>)}</div><div className="space-y-3">{channels.map(item => <div key={item[0]} className="flex items-center gap-3"><span className="w-24 text-xs text-muted-foreground">{item[0]}</span><div className="h-2 flex-1 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary text-primary-foreground" style={{
                      width: `${Number(item[1]) * 1.8}%`
                    }} /></div><span className="w-8 text-right text-xs text-foreground">{item[1]}</span><span className="w-10 text-right text-[11px] text-foreground">{item[3]}</span></div>)}</div></Card><Card title="Customer Acquisition Cost" eyebrow="Calculated"><div className="flex items-end justify-between"><div><p className="text-[11px] text-muted-foreground">CAC = Acquisition Spend / New Customers</p><p className="mt-2 text-3xl font-semibold text-foreground">€284</p></div><div className="text-right"><p className="text-[11px] text-muted-foreground">Previous</p><p className="text-sm text-foreground">€312</p><p className="text-xs font-semibold text-foreground">-9.0% ↓ improving</p></div></div><div className="mt-5 grid grid-cols-2 gap-3 text-xs">{channels.slice(0, 6).map(item => <div key={item[0]} className="flex justify-between border-b border-border/[.05] pb-2"><span className="text-muted-foreground">{item[0]}</span><strong className="text-foreground">{item[4]}</strong></div>)}</div><div className="mt-5"><Spark color="var(--foreground)" /></div></Card><Card title="Customer Churn" eyebrow="Calculated"><div className="grid grid-cols-2 gap-4">{[['Churned Customers', '68', 'Prev. 84'], ['Churn Rate', '5.8%', 'Prev. 7.2%']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className="mt-1 text-2xl font-semibold text-foreground">{item[1]}</p><p className="text-xs text-foreground">-19.0% ↓ improving</p></div>)}</div><div className="mt-5 space-y-3">{[['SMB', '8.4%'], ['Mid-Market', '4.2%'], ['Enterprise', '1.8%']].map(item => <div key={item[0]} className="flex items-center gap-3 text-xs"><span className="w-24 text-muted-foreground">{item[0]}</span><div className="h-2 flex-1 rounded-full bg-secondary"><div className="h-full rounded-full bg-destructive" style={{
                      width: item[1]
                    }} /></div><strong>{item[1]}</strong></div>)}</div><p className="mt-5 text-[11px] leading-5 text-muted-foreground">Churn is an analytical measurement. Risk assessment is available in <span className="text-foreground">Risk Center</span>.</p></Card><Card title="Customer Lifetime Value" eyebrow="Calculated / Estimated"><div className="flex justify-between"><div><p className="text-[11px] text-muted-foreground">Average CLV</p><p className="mt-1 text-3xl font-semibold text-foreground">€14,280</p><p className="text-xs text-chart-4">+8.8% ↑ from €13,120</p></div><div className="text-right"><p className="text-[11px] text-muted-foreground">Median CLV</p><p className="mt-1 text-xl font-semibold text-foreground">€9,840</p></div></div><div className="mt-5 grid grid-cols-3 gap-2">{[['Enterprise', '€48,600', 'Calculated'], ['Mid-Market', '€18,400', 'Calculated'], ['SMB', '€6,240', 'Estimated']].map(item => <div key={item[0]} className="rounded-lg bg-secondary p-3"><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className="mt-2 font-semibold text-foreground">{item[1]}</p><span className="text-[9px] text-foreground">{item[2]}</span></div>)}</div><Spark color="var(--foreground)" /></Card><Card title="Revenue per Customer" eyebrow="Calculated"><div className="grid grid-cols-2 gap-4"><div><p className="text-[11px] text-muted-foreground">Average Revenue per Customer</p><p className="mt-1 text-2xl font-semibold text-foreground">€8,240</p><p className="text-xs text-chart-4">+9.0% from €7,560</p></div><div><p className="text-[11px] text-muted-foreground">Median</p><p className="mt-1 text-xl font-semibold text-foreground">€5,640</p></div></div><Bars color="bg-secondary/70" /></Card><Card title="Purchase Frequency" eyebrow="Observed"><div className="grid grid-cols-2 gap-4"><div><p className="text-[11px] text-muted-foreground">Average Purchases per Customer</p><p className="mt-1 text-2xl font-semibold text-foreground">4.2/year</p><p className="text-xs text-chart-4">+10.5% from 3.8</p></div><div><p className="text-[11px] text-muted-foreground">Repeat Purchase Rate</p><p className="mt-1 text-2xl font-semibold text-foreground">68.4%</p></div></div><div className="mt-5 grid grid-cols-3 gap-2 text-xs">{[['Enterprise', '8.4/year'], ['Mid-Market', '4.8/year'], ['SMB', '2.4/year']].map(item => <div key={item[0]}><p className="text-muted-foreground">{item[0]}</p><strong className="text-foreground">{item[1]}</strong></div>)}</div></Card><Card title="Customer Revenue" eyebrow="Sortable · Permissions gated" className="xl:col-span-2"><div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">Sort by <select value={sort} onChange={e => setSort(e.target.value)} className="rounded bg-secondary px-2 py-1 text-foreground" aria-label="Sort customer revenue"><option>Highest Revenue</option><option>Fastest Growth</option><option>Largest Decline</option><option>Revenue Share</option></select></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="border-b border-border/[.07] text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Customer', 'Revenue', 'Revenue Share', 'Growth', 'Previous Period', 'Segment', 'Action'].map(h => <th key={h} className="pb-3 pr-4 font-medium">{h}</th>)}</tr></thead><tbody>{liveCustomers.map(customer => <tr key={customer.name} className="border-b border-border/[.05] last:border-0"><td className="py-3 pr-4 font-medium text-foreground">{customer.name}</td><td className="py-3 pr-4 text-foreground">{customer.revenue}</td><td className="py-3 pr-4 text-muted-foreground">{customer.share}</td><td className={`py-3 pr-4 ${customer.growth.startsWith('-') ? 'text-chart-5' : 'text-chart-4'}`}>{customer.growth}</td><td className="py-3 pr-4 text-muted-foreground">{customer.previous}</td><td className="py-3 pr-4"><span className="rounded bg-secondary px-2 py-1 text-[10px] text-muted-foreground">{customer.segment}</span></td><td><button className="text-foreground" aria-label={`View ${customer.name}`}>↗</button></td></tr>)}</tbody></table></div></Card><Card title="Customer Revenue Concentration" eyebrow="Analytical measurement"><div className="space-y-3">{[['Top 1 customer', '€428,000', '10.0%', 14], ['Top 5 customers', '€1,378,000', '32.2%', 32], ['Top 10 customers', '€2,140,000', '50.0%', 50], ['Top 20 customers', '€2,996,000', '70.0%', 70], ['Remaining customers', '€1,284,000', '30.0%', 30]].map(item => <div key={item[0]}><div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{item[0]}</span><span className="text-foreground">{item[1]} · {item[2]}</span></div><div className="h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-gradient-to-r from-primary to-primary text-primary-foreground" style={{
                      width: `${item[3]}%`
                    }} /></div></div>)}</div><p className="mt-5 text-[11px] text-muted-foreground">Concentration is an analytical measurement. Risk assessment is available in Risk Center.</p></Card><Card title="Customer Segments" eyebrow="Customer Type"><div className="mb-4 flex gap-1 overflow-x-auto border-b border-border/[.07]">{['Customer Type', 'Industry', 'Geography', 'Revenue Tier', 'Acquisition Source'].map((item, i) => <button key={item} className={`whitespace-nowrap border-b-2 px-3 pb-3 text-xs ${i === 0 ? 'border-border text-foreground' : 'border-transparent text-foreground'}`}>{item}</button>)}</div><div className="grid gap-3 sm:grid-cols-2">{segments.map(item => <div key={item[0]} className="rounded-xl bg-secondary p-3"><div className="flex justify-between"><span className="text-xs text-foreground">{item[0]}</span><span className="text-xs text-foreground">{item[1]} customers</span></div><p className="mt-2 text-lg font-semibold text-foreground">{item[2]}</p><p className="mt-1 text-[11px] text-chart-4">{item[3]} growth · {item[4]} retention</p><p className="mt-1 text-[11px] text-muted-foreground">{item[5]} churn · CLV {item[6]}</p></div>)}</div></Card><Card title="Customers by Geography" eyebrow="Map · Ranking"><div className="grid gap-5 md:grid-cols-[.8fr_1.2fr]"><div className="grid min-h-48 place-items-center rounded-xl border border-border/[.06] bg-[var(--secondary)]"><div className="text-center"><div className="mb-3 text-5xl opacity-80">🌐</div><p className="text-xs text-muted-foreground">Customer density heatmap</p><p className="mt-1 text-[10px] text-foreground">United Kingdom leads at 35%</p></div></div><div className="space-y-3">{geo.map((item, i) => <div key={item[0]} className="flex items-center gap-3 text-xs"><span className="w-4 text-muted-foreground">0{i + 1}</span><span className="flex-1 text-foreground">{item[0]}</span><span className="text-foreground">{item[1]}</span><span className="text-muted-foreground">{item[2]}</span><span className="text-foreground">{item[3]}</span></div>)}</div></div></Card><Card title="Customers by Industry" eyebrow="B2B analysis" className="xl:col-span-2"><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-xs"><thead className="border-b border-border/[.07] text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Industry', 'Customers', 'Revenue', 'Growth', 'Retention', 'CLV'].map(h => <th key={h} className="pb-3 pr-4 font-medium">{h}</th>)}</tr></thead><tbody>{[['Financial Services', '214', '€856,000', '+18%', '87.2%', '€12,400'], ['Technology', '192', '€770,400', '+24%', '89.6%', '€14,800'], ['Retail & Ecommerce', '160', '€642,000', '+12%', '82.4%', '€9,600'], ['Healthcare', '128', '€513,600', '+31%', '91.2%', '€18,200'], ['Manufacturing', '107', '€428,000', '+8%', '84.8%', '€11,600'], ['Other', '267', '€1,069,000', '+14%', '80.4%', '€8,200']].map(row => <tr key={row[0]} className="border-b border-border/[.05]">{row.map((cell, i) => <td key={`${row[0]}-${i}`} className={`py-3 pr-4 ${i === 0 ? 'text-foreground' : 'text-foreground'}`}>{cell}</td>)}</tr>)}</tbody></table></div></Card><Card title="Customers by Acquisition Source" eyebrow="Source performance" className="xl:col-span-2"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="border-b border-border/[.07] text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Source', 'Customers', 'Growth', 'CAC', 'Retention', 'Revenue', 'CLV'].map(h => <th key={h} className="pb-3 pr-4 font-medium">{h}</th>)}</tr></thead><tbody>{sources.map(row => <tr key={row[0]} className="border-b border-border/[.05]">{row.map((cell, i) => <td key={`${row[0]}-${i}`} className="py-3 pr-4 text-foreground">{cell}</td>)}</tr>)}</tbody></table></div></Card><Card title="Customer Cohorts" eyebrow="Month acquired" className="xl:col-span-2"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-xs"><thead className="border-b border-border/[.07] text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Cohort', 'Customers', 'Retention', 'Revenue', 'Repeat Purchases', 'CLV'].map(h => <th key={h} className="pb-3 pr-5 font-medium">{h}</th>)}</tr></thead><tbody>{cohort.map((month, i) => <tr key={month}><td className="py-2.5 text-foreground">{month}</td><td className="py-2.5">{42 + i % 5 * 2}</td><td className="py-2.5 text-foreground">{(88.1 - i * .4).toFixed(1)}%</td><td className="py-2.5 text-foreground">€{(346080 + i * 8400).toLocaleString()}</td><td className="py-2.5 text-muted-foreground">{(3.8 - i * .04).toFixed(1)} avg</td><td className="py-2.5">€8,240</td></tr>)}</tbody></table></div></Card><Card title="Retention Cohort" eyebrow="Heatmap"><div className="mb-4 flex gap-2">{['Customer Retention', 'Revenue Retention', 'Purchase Retention'].map((item, i) => <button key={item} className={`rounded-lg px-3 py-2 text-xs ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary-foreground'}`}>{item}</button>)}</div><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-center text-[11px]"><thead><tr><th className="p-2 text-left text-muted-foreground">Cohort</th>{['Month 0', 'Month 1', 'Month 2', 'Month 3', 'Month 6', 'Month 12'].map(h => <th key={h} className="p-2 text-muted-foreground">{h}</th>)}</tr></thead><tbody>{cohort.map((month, r) => <tr key={month}><td className="p-2 text-left text-muted-foreground">{month}</td>{[100, 92 - r * .3, 88 - r * .5, 85 - r * .55, 82 - r * .62, 78 - r * .7].map((v, c) => <td key={`${month}-${c}`} className="rounded p-2 text-foreground" style={{
                        background: `rgba(52,211,153,${Math.max(.18, 1 - r * .06)})`
                      }}>{Math.max(68, v).toFixed(0)}%</td>)}</tr>)}</tbody></table></div></Card>
<Card title="Customer Quality" eyebrow="Analytical measurement"><div className="grid gap-3 sm:grid-cols-2">{[['Retention', '84.6%', 'Strong', 'Calculated'], ['Revenue Contribution (Top 20)', '70%', 'Concentrated', 'Calculated'], ['Average CLV', '€14,280', 'Calculated', 'Calculated'], ['Purchase Frequency', '4.2/year', 'Moderate', 'Observed'], ['Revenue Growth', '+9.0%', 'Positive', 'Calculated'], ['Repeat Purchase Behavior', '68.4%', 'Strong', 'Calculated']].map(item => <div key={item[0]} className="flex items-center justify-between rounded-lg bg-secondary p-3"><div><p className="text-xs text-muted-foreground">{item[0]}</p><p className="mt-1 font-semibold text-foreground">{item[1]}</p></div><div className="text-right"><span className="block text-xs text-foreground">{item[2]}</span><span className="text-[9px] text-muted-foreground">{item[3]}</span></div></div>)}</div><p className="mt-5 text-[11px] text-muted-foreground">Customer quality is an analytical measurement, not a risk assessment.</p></Card><Card title="Customer Engagement" eyebrow="Connected product analytics"><div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{[['Active Users', '892'], ['Sessions / Customer', '24.6/mo'], ['Feature Adoption', '72.4%'], ['Engagement Trend', '+8.2%']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className="mt-1 text-xl font-semibold text-foreground">{item[1]}</p></div>)}</div><Bars color="bg-secondary/70" /></Card><Card title="Customer Activity" eyebrow="Aggregate Business Intelligence"><div className="grid grid-cols-2 gap-4 sm:grid-cols-5">{[['Total Purchases', '4,486'], ['Total Orders', '4,486'], ['Sessions', '22,048'], ['Support Interactions', '312'], ['Usage Events', '186,420']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className="mt-1 text-lg font-semibold text-foreground">{item[1]}</p></div>)}</div><p className="mt-5 text-[11px] text-muted-foreground">This is aggregate Business Intelligence. For individual customer activity, see CRM.</p></Card><Card title="Customer Value Distribution" eyebrow="Annual revenue tiers"><div className="flex h-40 items-end gap-4 border-b border-l border-border/[.08] px-6">{[['Low Value', '48.7%', 'bg-secondary', 70], ['Medium Value', '31.8%', 'bg-primary', 52], ['High Value', '14.6%', 'bg-primary', 32], ['Enterprise', '4.9%', 'bg-primary', 18]].map(item => <div key={item[0]} className="flex flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] text-muted-foreground">{item[1]}</span><div className={`w-full rounded-t ${item[2]}`} style={{
                    height: `${item[3]}%`
                  }} /><span className="text-[10px] text-center text-muted-foreground">{item[0]}</span></div>)}</div><p className="mt-4 text-[11px] text-muted-foreground">Value tiers are configurable. Current definitions are based on annual revenue.</p></Card><Card title="New vs Returning Customers" eyebrow="Revenue contribution"><div className="mb-4 flex h-11 overflow-hidden rounded-xl"><div className="grid place-items-center bg-primary text-xs font-semibold text-primary-foreground" style={{
                  width: '20%'
                }}>20%</div><div className="grid place-items-center bg-secondary/80 text-xs font-semibold text-[var(--foreground)]" style={{
                  width: '80%'
                }}>80%</div></div><div className="grid grid-cols-3 gap-3 text-xs">{[['New Customers', '156 · +18.2%'], ['Returning Customers', '736 · +10.2%'], ['Reactivated', '28 · +16.7%']].map(item => <div key={item[0]}><p className="text-muted-foreground">{item[0]}</p><strong className="text-foreground">{item[1]}</strong></div>)}</div><p className="mt-4 text-[11px] text-muted-foreground">New revenue €856,000 (20%) · Returning revenue €3,424,000 (80%).</p></Card><Card title="Customer Movement" eyebrow="Period bridge"><div className="grid grid-cols-6 items-end gap-2 border-b border-border/[.08] pb-2" style={{
                height: 170
              }}>{[['Opening Base', '980', 65, 'bg-secondary'], ['New', '+156', 42, 'bg-chart-4'], ['Reactivated', '+28', 24, 'bg-chart-4'], ['Churned', '-68', 20, 'bg-destructive'], ['Inactive', '-28', 14, 'bg-destructive'], ['Closing Base', '1,068', 76, 'bg-primary']].map(item => <div key={item[0]} className="flex h-full flex-col items-center justify-end gap-2"><span className="text-[10px] text-muted-foreground">{item[1]}</span><div className={`w-full rounded-t ${item[3]}`} style={{
                    height: `${item[2]}%`
                  }} /><span className="text-center text-[9px] text-muted-foreground">{item[0]}</span></div>)}</div><p className="mt-4 text-xs text-chart-4">Net Change: +88 (+9.0%)</p></Card><Card title="Retention Trend" eyebrow="12-month comparison"><div className="grid grid-cols-3 gap-3 text-xs">{[['Retention Rate', '84.6% · 82.1% · 79.4%'], ['Repeat Purchase Rate', '68.4% · 64.2% · 58.8%'], ['Returning Customer Rate', '82.6% · 80.2% · 76.4%']].map(item => <div key={item[0]}><p className="text-muted-foreground">{item[0]}</p><p className="mt-2 text-foreground">{item[1]}</p></div>)}</div><Bars color="bg-chart-4/70" /></Card><Card title="Churn Trend" eyebrow="Improvement signal"><div className="grid grid-cols-2 gap-4"><div><p className="text-[11px] text-muted-foreground">Churn Rate</p><p className="mt-1 text-2xl font-semibold text-foreground">5.8%</p><p className="text-xs text-chart-4">Prev. 7.2% · Prev Year 9.4%</p></div><div><p className="text-[11px] text-muted-foreground">Churned / month</p><p className="mt-1 text-2xl font-semibold text-foreground">5.7</p><p className="text-xs text-foreground">Prev. 7.0</p></div></div><Bars color="bg-chart-5/70" negative /></Card><Card title="Customer Benchmark" eyebrow="Actual · Benchmark · Target" className="xl:col-span-2"><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="border-b border-border/[.07] text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Metric', 'Actual', 'Benchmark', 'Target', 'Readout'].map(h => <th key={h} className="pb-3 pr-5">{h}</th>)}</tr></thead><tbody>{[['Customer Growth', '9.0%', '12%', '15%', 'Below benchmark'], ['Retention Rate', '84.6%', '80%', '88%', 'Above benchmark'], ['Churn Rate', '5.8%', '8%', '5%', 'Below benchmark'], ['CLV', '€14,280', '€10,800', '€16,000', 'Strong'], ['CAC', '€284', '€320', '€240', 'Efficient']].map(row => <tr key={row[0]} className="border-b border-border/[.05]"><td className="py-3 text-foreground">{row[0]}</td><td className="py-3 font-semibold text-foreground">{row[1]}</td><td className="py-3 text-foreground">{row[2]}</td><td className="py-3 text-foreground">{row[3]}</td><td className="py-3 text-muted-foreground">{row[4]}</td></tr>)}</tbody></table></div><p className="mt-4 text-[11px] text-muted-foreground">Benchmark data is sourced from industry comparisons. Actual, Benchmark, and Target are clearly separated.</p></Card><Card title="Customer Targets" eyebrow="Organization-defined"><div className="space-y-3">{[['Acquisition Target', '156 / 180', '-24', '86.7%', 'Behind', 'text-foreground'], ['Retention Target', '84.6% / 88%', '-3.4pp', '96.1%', 'On Track', 'text-foreground'], ['Customer Growth Target', '+9.0% / +15%', '-6.0pp', '60%', 'Behind', 'text-foreground'], ['Revenue / Customer', '€8,240 / €9,000', '-€760', '91.6%', 'On Track', 'text-foreground']].map(item => <div key={item[0]} className="rounded-xl border border-border/[.06] bg-secondary p-3"><div className="flex justify-between"><span className="text-xs text-muted-foreground">{item[0]}</span><span className={`text-xs ${item[5]}`}>{item[4]}</span></div><p className="mt-2 font-semibold text-foreground">{item[1]}</p><p className="text-[11px] text-muted-foreground">Gap {item[2]} · {item[3]}</p><div className="mt-2 h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary text-primary-foreground" style={{
                      width: item[3]
                    }} /></div></div>)}</div><p className="mt-4 text-[11px] text-muted-foreground">Targets are organization-defined. No targets are created automatically.</p></Card><Card title="Customer Gap" eyebrow="Annual acquisition target"><div className="flex items-center gap-6"><div className="grid h-32 w-32 place-items-center rounded-full" style={{
                  background: 'conic-gradient(var(--primary) 0 86.7%, var(--secondary) 86.7% 100%)'
                }}><div className="grid h-24 w-24 place-items-center rounded-full bg-[var(--secondary)]"><strong className="text-2xl text-foreground">86.7%</strong></div></div><div><p className="text-xs text-muted-foreground">Target · 180 new customers</p><p className="mt-2 text-xl font-semibold text-foreground">156 actual</p><p className="mt-1 text-sm text-foreground">Gap: -24 customers · Behind</p><p className="mt-3 text-xs text-muted-foreground">Retention gap: -3.4pp</p></div></div></Card><Card title="Customer Comparison" eyebrow="Context" className="xl:col-span-2"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-xs"><thead className="border-b border-border/[.07] text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Metric', 'Current', 'Prev Period', 'Prev Year', 'Target', 'Benchmark'].map(h => <th key={h} className="pb-3 pr-5">{h}</th>)}</tr></thead><tbody>{[['Total Customers', '1,068', '980', '872', '1,200', '—'], ['New Customers', '156', '132', '108', '180', '—'], ['Retention Rate', '84.6%', '82.1%', '79.4%', '88%', '80%'], ['Churn Rate', '5.8%', '7.2%', '9.4%', '5%', '8%'], ['CLV', '€14,280', '€13,120', '€11,640', '€16,000', '€10,800'], ['Revenue / Customer', '€8,240', '€7,560', '€6,840', '€9,000', '—']].map(row => <tr key={row[0]} className="border-b border-border/[.05]">{row.map((cell, i) => <td key={`${row[0]}-${i}`} className={`py-3 pr-5 ${i === 0 ? 'text-foreground' : 'text-foreground'}`}>{cell}</td>)}</tr>)}</tbody></table></div></Card><Card title="Customer Anomalies" eyebrow="Attention needed"><div className="space-y-3 text-xs">{[['Daily New Customers', 'Mar 18', '0', '3–8', '-5 · unusual gap'], ['SMB Churn', 'Feb week 3', '14', '2–6', '+8 · spike'], ['Enterprise Retention', 'Jan', '100%', '92–97%', '+3pp · positive spike']].map(row => <div key={row[0]} className="grid grid-cols-[1.3fr_.8fr_.5fr_.8fr_1.2fr] gap-2 border-b border-border/[.05] pb-3"><span className="text-foreground">{row[0]}</span><span className="text-muted-foreground">{row[1]}</span><span>{row[2]}</span><span className="text-muted-foreground">{row[3]}</span><span className="text-foreground">{row[4]}</span></div>)}</div><button className="mt-4 text-xs text-foreground">View All Anomalies <ChevronRight size={13} className="inline" /></button></Card><Card title="Key Customer KPIs" eyebrow="Performance index" className="xl:col-span-2"><div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">{[...overview, {
                  label: 'CLV',
                  value: '€14,280',
                  prev: '€13,120',
                  change: '+8.8%',
                  source: 'Estimated'
                }, {
                  label: 'CAC',
                  value: '€284',
                  prev: '€312',
                  change: '-9.0%',
                  source: 'Calculated'
                }, {
                  label: 'Revenue / Customer',
                  value: '€8,240',
                  prev: '€7,560',
                  change: '+9.0%',
                  source: 'Calculated'
                }, {
                  label: 'Purchase Frequency',
                  value: '4.2/year',
                  prev: '3.8',
                  change: '+10.5%',
                  source: 'Observed'
                }, {
                  label: 'Repeat Purchase Rate',
                  value: '68.4%',
                  prev: '64.2%',
                  change: '+4.2pp',
                  source: 'Calculated'
                }].map(item => <div key={item.label} className="rounded-xl bg-secondary p-3"><div className="flex justify-between"><p className="text-[11px] text-muted-foreground">{item.label}</p><span className="text-[9px] text-foreground">{item.source}</span></div><p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p><p className="text-[11px] text-foreground">{item.change} · prev {item.prev}</p><Spark /></div>)}</div><button className="mt-5 rounded-lg bg-secondary/15 px-3 py-2 text-xs font-semibold text-foreground">Open KPI Explorer <ChevronRight size={14} className="inline" /></button></Card><Card title="Explain Customer Performance" eyebrow="AI Explanation" className="xl:col-span-2"><div className="flex gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary text-[var(--primary-foreground)]"><Bot size={20} /></div><div><p className="text-sm leading-6 text-foreground">The customer base grew <strong className="text-foreground">9.0% to 1,068 customers</strong> over the last 12 months. Retention improved to 84.6%, driven primarily by stronger Enterprise and Mid-Market retention. New customer acquisition increased 18.2%, with Organic Search showing the strongest growth at +31%. Churn declined to 5.8%, with SMB churn improving the most.</p><button className="mt-4 rounded-lg bg-secondary/15 px-3 py-2 text-xs font-semibold text-foreground">View AI Recommendations <ChevronRight size={14} className="inline" /></button></div></div></Card><Card title="Ask Lulu AI" eyebrow="Explore your customers" className="xl:col-span-2"><form onSubmit={submit} className="flex gap-2"><div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-[var(--secondary)] px-4"><MessageSquare size={16} className="text-muted-foreground" /><input value={ask} onChange={e => setAsk(e.target.value)} placeholder="Ask Lulu AI about your customers..." className="w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground" aria-label="Ask Lulu AI about customers" /></div><button className="rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground" type="submit">Ask</button></form><div className="mt-4 flex flex-wrap gap-2">{['How many customers do we have?', 'What is our retention rate?', 'What is our churn rate?', 'Which segments are growing fastest?', 'What is our average CLV?', 'What is our CAC?', 'Which acquisition channels generate the best customers?', 'Compare our customer base with last year.'].map(prompt => <button key={prompt} onClick={() => setAsk(prompt)} className="rounded-full border border-border/[.08] px-3 py-1.5 text-[11px] text-foreground hover:border-border/40 hover:text-foreground">{prompt}</button>)}</div></Card></div><div className="mt-6 rounded-2xl border border-border/[.08] bg-[var(--secondary)] p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-[17px] font-semibold text-foreground">Data Sources</h2><p className="mt-1 text-xs text-muted-foreground">Customer intelligence is built from your connected business systems.</p></div><button className="text-xs text-foreground">Manage sources <ChevronRight size={13} className="inline" /></button></div><div className="mt-5 grid gap-2 sm:grid-cols-5">{[['CRM', 'Connected', 'text-chart-4'], ['Billing', 'Connected', 'text-chart-4'], ['Ecommerce', 'Partial', 'text-foreground'], ['Marketing Analytics', 'Connected', 'text-chart-4'], ['Finance', 'Connected', 'text-chart-4']].map(source => <div key={source[0]} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-3"><span className="text-xs text-foreground">{source[0]}</span><span className={`text-[10px] ${source[2]}`}>{source[1]}</span></div>)}</div></div><div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/[.07] pt-5 text-[11px] text-muted-foreground"><span>Lulu AI Customers Intelligence · Business OS</span><span>Observed · Calculated · Estimated · Target · Benchmark · AI Explanation</span></div></div></div></div></main>;
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
