import * as React from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Bot, CalendarDays, ChevronDown, ChevronRight, CircleHelp, Download, FilePlus2, Filter, LayoutDashboard, LineChart, Menu, MessageSquare, MoreHorizontal, PanelLeft, PieChart, RefreshCw, Search, Settings, Sparkles, Target, TrendingUp, Users, X } from 'lucide-react';
type Metric = {
  label: string;
  value: string;
  previous: string;
  change: string;
  source: 'Observed' | 'Calculated';
  tone?: 'up' | 'down';
};
type Row = {
  name: string;
  revenue: string;
  share: string;
  growth: string;
  previous: string;
  segment: string;
};
const metrics: Metric[] = [{
  label: 'Total Revenue',
  value: '€4,280,000',
  previous: '€3,710,000',
  change: '+15.4%',
  source: 'Observed'
}, {
  label: 'Revenue Growth',
  value: '+15.4%',
  previous: '+11.2%',
  change: 'Accelerating',
  source: 'Calculated'
}, {
  label: 'Net Revenue',
  value: '€3,940,000',
  previous: '€3,420,000',
  change: '+15.2%',
  source: 'Observed'
}, {
  label: 'Recurring Revenue',
  value: '€2,650,000',
  previous: '€2,180,000',
  change: '+21.6%',
  source: 'Observed'
}, {
  label: 'Average Revenue',
  value: '€356,667/mo',
  previous: '€309,167/mo',
  change: '+15.4%',
  source: 'Calculated'
}, {
  label: 'Revenue per Customer',
  value: '€8,240',
  previous: '€7,560',
  change: '+9.0%',
  source: 'Calculated'
}];
const customers: Row[] = [{
  name: 'Acme Corporation',
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
}];
const months = [{
  m: 'Apr',
  v: 44,
  p: 37
}, {
  m: 'May',
  v: 48,
  p: 39
}, {
  m: 'Jun',
  v: 51,
  p: 40
}, {
  m: 'Jul',
  v: 54,
  p: 42
}, {
  m: 'Aug',
  v: 57,
  p: 44
}, {
  m: 'Sep',
  v: 61,
  p: 46
}, {
  m: 'Oct',
  v: 64,
  p: 48
}, {
  m: 'Nov',
  v: 67,
  p: 51
}, {
  m: 'Dec',
  v: 70,
  p: 53
}, {
  m: 'Jan',
  v: 74,
  p: 55
}, {
  m: 'Feb',
  v: 78,
  p: 58
}, {
  m: 'Mar',
  v: 86,
  p: 61
}];
const composition = [{
  name: 'Subscriptions',
  amount: '€1,797,600',
  pct: 42,
  color: 'var(--foreground)',
  growth: '+22%'
}, {
  name: 'Contracts',
  amount: '€1,198,400',
  pct: 28,
  color: 'var(--foreground)',
  growth: '+16%'
}, {
  name: 'Products',
  amount: '€770,400',
  pct: 18,
  color: 'var(--foreground)',
  growth: '+12%'
}, {
  name: 'Services',
  amount: '€342,400',
  pct: 8,
  color: 'var(--foreground)',
  growth: '+8%'
}, {
  name: 'One-time',
  amount: '€171,200',
  pct: 4,
  color: 'var(--muted-foreground)',
  growth: '-2%'
}];
const products = [{
  name: 'Lulu AI Pro',
  revenue: '€1,284,000',
  units: '156',
  share: '30.0%',
  growth: '+22%',
  margin: '74%'
}, {
  name: 'Lulu AI Business',
  revenue: '€856,000',
  units: '214',
  share: '20.0%',
  growth: '+18%',
  margin: '68%'
}, {
  name: 'Lulu AI Enterprise',
  revenue: '€642,000',
  units: '48',
  share: '15.0%',
  growth: '+31%',
  margin: '81%'
}, {
  name: 'Professional Services',
  revenue: '€428,000',
  units: '92',
  share: '10.0%',
  growth: '+8%',
  margin: '52%'
}, {
  name: 'Add-ons & Integrations',
  revenue: '€342,400',
  units: '340',
  share: '8.0%',
  growth: '+14%',
  margin: '85%'
}];
const channels = [{
  name: 'Direct Sales',
  value: '€1,712,000',
  pct: 40,
  growth: '+12%'
}, {
  name: 'Organic',
  value: '€856,000',
  pct: 20,
  growth: '+28%'
}, {
  name: 'Referral',
  value: '€513,600',
  pct: 12,
  growth: '+19%'
}, {
  name: 'Paid Search',
  value: '€428,000',
  pct: 10,
  growth: '+6%'
}, {
  name: 'Partner',
  value: '€342,400',
  pct: 8,
  growth: '+22%'
}, {
  name: 'Email',
  value: '€256,800',
  pct: 6,
  growth: '+9%'
}, {
  name: 'Other',
  value: '€171,200',
  pct: 4,
  growth: '+3%'
}];
const geo = [{
  name: 'United Kingdom',
  value: '€1,498,000',
  pct: '35%',
  growth: '+14%'
}, {
  name: 'Germany',
  value: '€856,000',
  pct: '20%',
  growth: '+22%'
}, {
  name: 'United States',
  value: '€642,000',
  pct: '15%',
  growth: '+18%'
}, {
  name: 'France',
  value: '€428,000',
  pct: '10%',
  growth: '+9%'
}, {
  name: 'Netherlands',
  value: '€342,400',
  pct: '8%',
  growth: '+31%'
}];
function Sparkline({
  color = 'var(--chart-2)'
}: {
  color?: string;
}) {
  return <svg viewBox="0 0 100 28" className="h-8 w-24" aria-label="Upward trend sparkline" role="img"><polyline fill="none" stroke={color} strokeWidth="2.5" points="2,23 14,20 24,21 35,15 47,17 58,10 69,13 80,7 98,3" /><circle cx="98" cy="3" r="2.5" fill={color} /></svg>;
}
function SectionCard({
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
function Sidebar() {
  const links = [['Executive Dashboard', LayoutDashboard], ['Business Health', Activity], ['Growth', TrendingUp], ['CRM', Users], ['Marketing', BarChart3]] as const;
  return <aside className="hidden w-[236px] shrink-0 border-r border-border/[.07] bg-[var(--sidebar)] px-3 py-5 lg:block"><div className="flex items-center gap-3 px-3"><div className="grid h-8 w-8 place-items-center rounded-xl bg-primary shadow-lg shadow-black/30 text-primary-foreground"><Sparkles size={16} className="text-primary-foreground" /></div><div><p className="text-sm font-bold tracking-tight text-foreground">Lulu <span className="text-foreground">AI</span></p><p className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">Business OS</p></div></div><div className="my-7 h-px bg-secondary" /><nav aria-label="Primary navigation" className="space-y-1">{links.map(([label, Icon]) => <button key={label} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] text-foreground transition hover:bg-secondary hover:text-foreground"><Icon size={16} /><span>{label}</span></button>)}<div className="pt-4"><p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Intelligence</p><button className="flex w-full items-center justify-between rounded-xl bg-secondary/15 px-3 py-2.5 text-[13px] font-medium text-foreground"><span className="flex items-center gap-3"><LineChart size={16} /><span>Business Intelligence</span></span><ChevronDown size={14} /></button><div className="ml-7 mt-1 border-l border-border/30 pl-3"><button className="w-full rounded-lg border-l-2 border-border bg-secondary/10 px-3 py-2 text-left text-xs font-semibold text-foreground">Revenue</button><button className="w-full rounded-lg px-3 py-2 text-left text-xs text-foreground hover:text-foreground">Forecasts</button><button className="w-full rounded-lg px-3 py-2 text-left text-xs text-foreground hover:text-foreground">Anomalies</button></div></div>{[['Risk Center', AlertTriangle], ['AI Recommendations', Bot], ['Settings', Settings]].map(([label, Icon]) => <button key={label as string} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-foreground hover:bg-secondary hover:text-foreground"><Icon size={16} /><span>{label as string}</span></button>)}</nav><div className="mt-10 rounded-xl border border-border/15 bg-secondary/[.07] p-3"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground"><Bot size={15} /> Ask Lulu</div><p className="text-[11px] leading-relaxed text-muted-foreground">Get a clear answer from your business data.</p></div></aside>;
}
export function RevenueIntelligence() {
  const [period, setPeriod] = React.useState('Monthly');
  const [showAll, setShowAll] = React.useState(false);
  const [dateOpen, setDateOpen] = React.useState(false);
  const [ask, setAsk] = React.useState('');
  const [state, setState] = React.useState('Live');
  const askSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ask.trim()) setAsk('');
  };
  return <main className="min-h-screen bg-[var(--background)] text-foreground"><div className="flex min-h-screen"><Sidebar /><div className="min-w-0 flex-1"><header className="sticky top-0 z-10 flex min-h-[70px] items-center justify-between border-b border-border/[.07] bg-[var(--background)]/95 px-5 backdrop-blur-xl lg:px-8"><div className="flex items-center gap-3"><button className="rounded-lg p-2 text-foreground hover:bg-secondary lg:hidden" aria-label="Open navigation"><Menu size={19} /></button><div><p className="text-xs text-muted-foreground">Intelligence <span className="mx-1 text-foreground">/</span> Business Intelligence <span className="mx-1 text-foreground">/</span> <span className="text-foreground">Revenue</span></p></div></div><div className="flex items-center gap-2"><button className="hidden rounded-lg border border-border p-2 text-foreground hover:bg-secondary sm:block" aria-label="Search"><Search size={17} /></button><button className="rounded-lg border border-border p-2 text-foreground hover:bg-secondary" aria-label="Notifications"><Bell size={17} /></button><div className="ml-1 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-primary text-xs font-bold text-[var(--primary-foreground)]">LS</div></div></header><div className="mx-auto max-w-[1450px] px-5 py-7 lg:px-8"><div className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end"><div><div className="mb-3 flex items-center gap-2 text-xs font-medium text-foreground"><span className="h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" />Live intelligence</div><h1 className="text-4xl font-bold tracking-[-.04em] text-foreground sm:text-5xl">Revenue</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Understand where your revenue comes from, how it is changing, and how its composition affects your business.</p></div><div className="flex flex-wrap items-center gap-2"><div className="relative"><button onClick={() => setDateOpen(!dateOpen)} className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground hover:border-border/40" aria-expanded={dateOpen}><CalendarDays size={14} className="text-foreground" />Last 12 Months<ChevronDown size={13} /></button>{dateOpen && <div className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-border bg-[var(--secondary)] p-1.5 shadow-2xl">{['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last 12 Months', 'Year to Date', 'Previous Year', 'Custom Range'].map(item => <button key={item} onClick={() => setDateOpen(false)} className="w-full rounded-lg px-3 py-2 text-left text-xs text-foreground hover:bg-secondary/15 hover:text-foreground">{item}</button>)}</div>}</div><button className="hidden rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground hover:border-border/40 md:block">Compare: Previous Year <ChevronDown size={13} className="ml-1 inline" /></button><button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-lg shadow-black/20 hover:bg-primary"><Bot size={14} />Ask Lulu AI</button><button className="rounded-lg border border-border p-2 text-foreground hover:text-foreground" aria-label="Refresh data"><RefreshCw size={15} /></button><button className="hidden rounded-lg border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary md:block"><FilePlus2 size={14} className="mr-1 inline" />Create Report</button><button className="rounded-lg border border-border p-2 text-foreground hover:text-foreground" aria-label="Export data"><Download size={15} /></button></div></div>

<div className="mb-8 flex items-center justify-between border-y border-border/[.07] py-3"><div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Revenue overview</p><p className="mt-1 text-xs text-muted-foreground">Last updated 2 minutes ago · All sources synced</p></div><div className="hidden items-center gap-2 sm:flex"><span className="rounded-md bg-secondary px-2 py-1 text-[10px] text-muted-foreground">EUR</span><span className="rounded-md bg-chart-4/10 px-2 py-1 text-[10px] text-chart-4">5 sources connected</span></div></div><div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">{metrics.map(metric => <article key={metric.label} className="group rounded-2xl border border-border/[.08] bg-[var(--card)] p-4 transition hover:-translate-y-0.5 hover:border-border/30"><div className="flex items-start justify-between"><p className="text-xs text-muted-foreground">{metric.label}</p><span className={`rounded px-1.5 py-0.5 text-[9px] ${metric.source === 'Observed' ? 'bg-card/60 text-foreground' : 'bg-secondary/10 text-foreground'}`}>{metric.source}</span></div><p className="mt-4 text-xl font-semibold tracking-tight text-foreground">{metric.value}</p><p className="mt-1 text-[11px] text-muted-foreground">Prev. {metric.previous}</p><div className="mt-3 flex items-end justify-between"><span className="flex items-center gap-1 text-xs font-semibold text-chart-4"><ArrowUpRight size={13} />{metric.change}</span><Sparkline /></div></article>)}</div>

<div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]"><SectionCard title="Revenue Trend" eyebrow="12 month performance" className="xl:col-span-2"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex rounded-lg bg-secondary p-1">{['Revenue', 'Revenue Growth %', 'Cumulative Revenue'].map((tab, i) => <button key={tab} className={`rounded-md px-3 py-1.5 text-xs ${i === 0 ? 'bg-primary text-primary-foreground' : 'text-primary-foreground hover:text-primary-foreground'}`}>{tab}</button>)}</div><div className="flex items-center gap-1 rounded-lg border border-border/[.07] p-1">{['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'].map(item => <button key={item} onClick={() => setPeriod(item)} className={`rounded-md px-2.5 py-1 text-[11px] ${period === item ? 'bg-secondary text-foreground' : 'text-foreground'}`}>{item}</button>)}</div></div><div className="grid grid-cols-12 items-end gap-2 border-b border-l border-border/[.08] bg-[linear-gradient(rgba(0,0,0,.035)_1px,transparent_1px)] bg-[length:100%_38px] px-3 pt-8" style={{
                height: 250
              }}>{months.map(item => <div key={item.m} className="flex h-full flex-col items-center justify-end gap-2"><div className="flex w-full items-end justify-center gap-1" style={{
                    height: 'calc(100% - 22px)'
                  }}><div className="w-1/2 rounded-t bg-secondary/80 transition-all hover:bg-primary" style={{
                      height: `${item.v}%`
                    }} /><div className="w-1/3 rounded-t border border-dashed border-border bg-card/30" style={{
                      height: `${item.p}%`
                    }} /></div><span className="text-[10px] text-muted-foreground">{item.m}</span></div>)}</div><div className="mt-4 flex items-center gap-5 text-[11px] text-muted-foreground"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Current period</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full border border-dashed border-border" />Previous year</span><span className="ml-auto hidden text-muted-foreground sm:block">€0 <span className="mx-5">€2M</span> €4.3M</span></div></SectionCard>
<SectionCard title="Revenue Growth" eyebrow="Momentum"><div className="mb-4 flex items-center gap-2"><span className="rounded-full bg-chart-4/10 px-2.5 py-1 text-xs font-semibold text-chart-4">Accelerating</span><span className="text-xs text-muted-foreground">vs previous year</span></div><div className="grid grid-cols-2 gap-x-5 gap-y-4">{[['Current Growth', '+15.4%'], ['Previous Period Growth', '+11.2%'], ['Previous Year Growth', '+8.7%'], ['Absolute Growth', '+€570,000']].map(([label, value]) => <div key={label}><p className="text-[11px] text-muted-foreground">{label}</p><p className="mt-1 text-lg font-semibold text-foreground">{value}</p></div>)}</div><div className="mt-5 flex h-16 items-end gap-2">{[42, 56, 68, 84].map((h, i) => <div key={h} className="flex-1 rounded-t bg-gradient-to-t from-primary to-primary text-primary-foreground" style={{
                  height: `${h}%`
                }}><span className="sr-only">Period {i + 1} growth</span></div>)}</div></SectionCard>
<SectionCard title="Recurring Revenue" eyebrow="61.9% of total"><div className="flex items-end justify-between"><div><p className="text-[11px] text-muted-foreground">MRR</p><p className="text-2xl font-semibold text-foreground">€220,833</p></div><div className="text-right"><p className="text-[11px] text-muted-foreground">ARR</p><p className="text-lg font-semibold text-foreground">€2,650,000</p></div></div><div className="mt-5 grid grid-cols-2 gap-3">{[['New recurring', '+€148,000'], ['Expansion', '+€62,000'], ['Contraction', '-€18,000'], ['Churned', '-€24,000']].map(([label, value]) => <div key={label} className="border-l-2 border-border/50 pl-3"><p className="text-[11px] text-muted-foreground">{label}</p><p className={`mt-1 text-sm font-semibold ${value.startsWith('-') ? 'text-chart-5' : 'text-foreground'}`}>{value}</p></div>)}</div></SectionCard>
<SectionCard title="Revenue Composition" eyebrow="Mix by source"><div className="flex flex-col items-center gap-6 sm:flex-row"><div className="grid h-36 w-36 shrink-0 place-items-center rounded-full" style={{
                  background: 'conic-gradient(var(--primary) 0 42%, var(--primary) 42% 70%, var(--primary) 70% 88%, var(--primary) 88% 96%, var(--secondary) 96% 100%)'
                }}><div className="grid h-24 w-24 place-items-center rounded-full bg-[var(--secondary)]"><div className="text-center"><p className="text-lg font-semibold text-foreground">€4.28M</p><p className="text-[10px] text-muted-foreground">total</p></div></div></div><div className="w-full space-y-2">{composition.map(item => <div key={item.name} className="flex items-center gap-2 text-xs"><span className="h-2 w-2 rounded-full" style={{
                      background: item.color
                    }} /><span className="min-w-0 flex-1 text-foreground">{item.name}</span><span className="text-muted-foreground">{item.pct}%</span><strong className="w-24 text-right text-foreground">{item.amount}</strong><span className="w-10 text-right text-chart-4">{item.growth}</span></div>)}</div></div></SectionCard>
<SectionCard title="New vs Existing Revenue" eyebrow="Customer contribution"><div className="mb-4 flex h-11 overflow-hidden rounded-xl"><div className="grid place-items-center bg-primary text-xs font-semibold text-primary-foreground" style={{
                  width: '20%'
                }}>20%</div><div className="grid place-items-center bg-secondary/80 text-xs font-semibold text-[var(--foreground)]" style={{
                  width: '70%'
                }}>70%</div><div className="grid place-items-center bg-primary text-xs font-semibold text-[var(--primary-foreground)]" style={{
                  width: '10%'
                }}>10%</div></div><div className="grid grid-cols-3 gap-2 text-[11px]">{[['New Customer Revenue', '€856,000', 'bg-primary'], ['Existing Customer Revenue', '€2,996,000', 'bg-primary'], ['Expansion Revenue', '€428,000', 'bg-primary']].map(([label, value, color]) => <div key={label}><span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${color}`} /><span className="text-muted-foreground">{label}</span><p className="mt-1 font-semibold text-foreground">{value}</p></div>)}</div></SectionCard>
<SectionCard title="Revenue by Customer" eyebrow="Customer economics" className="xl:col-span-2"><div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Filter size={13} /> Sorted by <button className="text-foreground">Highest Revenue <ChevronDown size={12} className="inline" /></button></div><button onClick={() => setShowAll(!showAll)} className="text-xs font-medium text-foreground hover:text-foreground">{showAll ? 'Show top 5' : 'Show all'} <ChevronRight size={13} className="inline" /></button></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-xs"><thead className="border-b border-border/[.07] text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Customer', 'Revenue', 'Revenue Share', 'Growth', 'Previous Period', 'Segment'].map(h => <th key={h} className="pb-3 pr-4 font-medium">{h}</th>)}</tr></thead><tbody>{customers.slice(0, showAll ? 5 : 5).map(row => <tr key={row.name} className="border-b border-border/[.05] last:border-0"><td className="py-3 pr-4 font-medium text-foreground">{row.name}</td><td className="py-3 pr-4 text-foreground">{row.revenue}</td><td className="py-3 pr-4 text-muted-foreground">{row.share}</td><td className={`py-3 pr-4 ${row.growth.startsWith('-') ? 'text-chart-5' : 'text-chart-4'}`}>{row.growth}</td><td className="py-3 pr-4 text-muted-foreground">{row.previous}</td><td className="py-3"><span className="rounded bg-secondary px-2 py-1 text-[10px] text-muted-foreground">{row.segment}</span></td></tr>)}</tbody></table></div></SectionCard>
<SectionCard title="Revenue Concentration" eyebrow="Portfolio risk"><div className="space-y-3">{[['Top 1 customer', '€428,000', '10.0%', 14], ['Top 5 customers', '€1,378,000', '32.2%', 35], ['Top 10 customers', '€2,140,000', '50.0%', 52], ['Top 20 customers', '€2,996,000', '70.0%', 72], ['Remaining customers', '€1,284,000', '30.0%', 31]].map(([label, value, pct, width]) => <div key={label}><div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><span className="text-foreground">{value} · {pct}</span></div><div className="h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-gradient-to-r from-primary to-primary text-primary-foreground" style={{
                      width: `${width}%`
                    }} /></div></div>)}</div><p className="mt-5 text-[11px] leading-5 text-muted-foreground">Revenue concentration is an analytical measurement. Risk assessment is available in <span className="text-foreground">Risk Center</span>.</p></SectionCard>
<SectionCard title="Revenue by Product" eyebrow="Product mix" className="xl:col-span-2"><div className="mb-3 flex gap-1 rounded-lg bg-secondary p-1 w-fit">{['Product', 'Category', 'Brand'].map((tab, i) => <button key={tab} className={`rounded-md px-3 py-1.5 text-xs ${i === 0 ? 'bg-secondary text-foreground' : 'text-foreground'}`}>{tab}</button>)}</div><div className="overflow-x-auto"><table className="w-full min-w-[730px] text-left text-xs"><thead className="border-b border-border/[.07] text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Product', 'Revenue', 'Units', 'Revenue Share', 'Growth', 'Margin'].map(h => <th key={h} className="pb-3 pr-4 font-medium">{h}</th>)}</tr></thead><tbody>{products.map(p => <tr key={p.name} className="border-b border-border/[.05] last:border-0"><td className="py-3 font-medium text-foreground">{p.name}</td><td className="py-3 text-foreground">{p.revenue}</td><td className="py-3 text-muted-foreground">{p.units}</td><td className="py-3 text-muted-foreground">{p.share}</td><td className="py-3 text-chart-4">{p.growth}</td><td className="py-3 text-foreground">{p.margin}</td></tr>)}</tbody></table></div></SectionCard>
<SectionCard title="Revenue by Channel" eyebrow="Acquisition performance"><div className="space-y-3">{channels.map(channel => <div key={channel.name} className="flex items-center gap-3"><span className="w-20 text-xs text-muted-foreground">{channel.name}</span><div className="h-2 flex-1 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary text-primary-foreground" style={{
                      width: `${channel.pct * 2.5}%`
                    }} /></div><span className="w-20 text-right text-xs font-medium text-foreground">{channel.value}</span><span className="w-9 text-right text-[11px] text-chart-4">{channel.growth}</span></div>)}</div></SectionCard>
<SectionCard title="Revenue by Geography" eyebrow="Regional performance"><div className="grid gap-5 md:grid-cols-[1fr_1.2fr]"><div className="grid min-h-44 place-items-center rounded-xl border border-border/[.06] bg-[var(--secondary)] p-4"><div className="text-center"><div className="mb-3 text-5xl opacity-80">🌐</div><p className="text-xs text-muted-foreground">Revenue intensity map</p><p className="mt-1 text-[10px] text-foreground">Europe leads at 65%</p></div></div><div className="space-y-3">{geo.map((item, i) => <div key={item.name} className="flex items-center gap-3"><span className="w-4 text-[10px] text-muted-foreground">0{i + 1}</span><span className="flex-1 text-xs text-foreground">{item.name}</span><span className="text-xs text-foreground">{item.value}</span><span className="text-[11px] text-muted-foreground">{item.pct}</span><span className="text-[11px] text-chart-4">{item.growth}</span></div>)}</div></div></SectionCard>
<SectionCard title="Revenue by Customer Segment" eyebrow="Segmentation"><div className="mb-4 flex gap-1 overflow-x-auto border-b border-border/[.07]">{['B2B', 'B2C', 'Enterprise', 'SMB', 'Industry', 'Tier'].map((tab, i) => <button key={tab} className={`whitespace-nowrap border-b-2 px-3 pb-3 text-xs ${i === 0 ? 'border-border text-foreground' : 'border-transparent text-foreground'}`}>{tab}</button>)}</div><div className="grid gap-3 sm:grid-cols-2">{[['Enterprise', '€1,712,000', '40%', '52 customers', '+16%'], ['Mid-Market', '€1,284,000', '30%', '156 customers', '+22%'], ['SMB', '€856,000', '20%', '340 customers', '+11%'], ['Startup', '€428,000', '10%', '520 customers', '+18%']].map(item => <div key={item[0]} className="rounded-xl bg-secondary p-3"><div className="flex justify-between"><span className="text-xs text-foreground">{item[0]}</span><span className="text-xs text-foreground">{item[2]}</span></div><p className="mt-2 text-lg font-semibold text-foreground">{item[1]}</p><p className="mt-1 text-[11px] text-muted-foreground">{item[3]} <span className="ml-2 text-foreground">{item[4]}</span></p></div>)}</div></SectionCard>
<SectionCard title="Revenue Velocity" eyebrow="Calculated"><div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{[['Per Day', '€11,726'], ['Per Week', '€82,077'], ['Per Month', '€356,667'], ['Growth Velocity', '+€1,644/day']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className="mt-2 text-lg font-semibold text-foreground">{item[1]}</p></div>)}</div><div className="mt-5"><Sparkline color="var(--chart-3)" /></div></SectionCard>
<SectionCard title="Revenue Run Rate" eyebrow="Projection"><div className="flex items-center justify-between"><div><span className="rounded bg-secondary/10 px-2 py-1 text-[10px] text-foreground">Calculated</span><p className="mt-3 text-2xl font-semibold text-foreground">€4,280,000</p><p className="text-xs text-muted-foreground">annualized from last 30 days</p></div><div className="text-right"><p className="text-[11px] text-muted-foreground">Previous run rate</p><p className="mt-1 text-sm text-foreground">€3,710,000</p><p className="mt-2 text-xs font-semibold text-chart-4">+€570,000 · +15.4%</p></div></div><p className="mt-5 text-[11px] leading-5 text-muted-foreground">Run rate is a calculated projection based on recent performance. It is not a guarantee of future revenue.</p></SectionCard>
<SectionCard title="Revenue Predictability" eyebrow="Quality signal"><div className="mb-4 flex items-center gap-2"><span className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-foreground">High</span><span className="text-xs text-muted-foreground">analytical classification</span></div><div className="space-y-3 text-xs">{[['Revenue Variability', 'Low · 8.2% coefficient of variation'], ['Recurring Revenue Share', '61.9%'], ['Historical Consistency', '94% months within ±10%'], ['Forecast Accuracy', '96.2% · last 3 months']].map(item => <div key={item[0]} className="flex justify-between gap-4 border-b border-border/[.05] pb-2"><span className="text-muted-foreground">{item[0]}</span><strong className="text-right font-medium text-foreground">{item[1]}</strong></div>)}</div></SectionCard>
<SectionCard title="Revenue Waterfall" eyebrow="Period bridge" className="xl:col-span-2"><div className="grid grid-cols-6 items-end gap-2 border-b border-border/[.08] pb-2 pt-5" style={{
                height: 190
              }}>{[['Opening', '3.71M', 72, 'bg-secondary'], ['New', '+856k', 38, 'bg-chart-4'], ['Expansion', '+490k', 27, 'bg-chart-4'], ['Contraction', '-180k', 16, 'bg-destructive'], ['Churn', '-596k', 34, 'bg-destructive'], ['Closing', '4.28M', 84, 'bg-primary']].map(item => <div key={item[0]} className="flex h-full flex-col items-center justify-end gap-2"><span className="text-[10px] text-muted-foreground">{item[1]}</span><div className={`w-full rounded-t ${item[3]}`} style={{
                    height: `${item[2]}%`
                  }} /><span className="text-[10px] text-muted-foreground">{item[0]}</span></div>)}</div><p className="mt-4 text-[11px] text-muted-foreground">Adapted for subscription and non-subscription revenue components · Churn shown net.</p></SectionCard>
<SectionCard title="Revenue Targets" eyebrow="Organization-defined" className="xl:col-span-2"><div className="grid gap-3 md:grid-cols-3">{[['Monthly Target', '€380,000', '€400,000', '-€20,000', '95%', 'Behind', 'bg-secondary/10 text-foreground'], ['Quarterly Target', '€1,140,000', '€1,100,000', '+€40,000', '103.6%', 'Ahead', 'bg-chart-4/10 text-chart-4'], ['Annual Target', '€4,280,000', '€6,000,000', '€1,720,000', '71.3%', 'On Track', 'bg-secondary/10 text-foreground']].map(item => <div key={item[0]} className="rounded-xl border border-border/[.06] bg-secondary p-4"><div className="flex justify-between"><span className="text-xs text-muted-foreground">{item[0]}</span><span className={`rounded px-2 py-1 text-[10px] ${item[6]}`}>{item[5]}</span></div><p className="mt-4 text-xl font-semibold text-foreground">{item[1]}</p><p className="mt-1 text-[11px] text-muted-foreground">Target {item[2]} · Gap {item[3]}</p><div className="mt-3 h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary text-primary-foreground" style={{
                      width: item[4]
                    }} /></div><p className="mt-2 text-right text-xs font-semibold text-foreground">{item[4]}</p></div>)}</div><p className="mt-4 text-[11px] text-muted-foreground">Targets are organization-defined. No targets are created automatically.</p></SectionCard>
<SectionCard title="Revenue Comparison" eyebrow="Context"><div className="overflow-x-auto"><table className="w-full min-w-[580px] text-left text-xs"><thead className="border-b border-border/[.07] text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Period', 'Revenue', 'Absolute Change', '% Change'].map(h => <th key={h} className="pb-3 pr-4 font-medium">{h}</th>)}</tr></thead><tbody>{[['Current (Last 12M)', '€4,280,000', '—', '—'], ['Previous Period', '€3,710,000', '+€570,000', '+15.4%'], ['Previous Year', '€3,280,000', '+€1,000,000', '+30.5%'], ['Annual Target', '€6,000,000', '-€1,720,000', '-28.7%'], ['Benchmark', '€3,950,000', '+€330,000', '+8.4%']].map(row => <tr key={row[0]} className="border-b border-border/[.05] last:border-0"><td className="py-3 text-muted-foreground">{row[0]}</td><td className="py-3 font-medium text-foreground">{row[1]}</td><td className="py-3 text-muted-foreground">{row[2]}</td><td className={`py-3 ${row[3].startsWith('-') ? 'text-chart-5' : 'text-foreground'}`}>{row[3]}</td></tr>)}</tbody></table></div></SectionCard>
<SectionCard title="Revenue Forecast" eyebrow="Forecasts module"><div className="grid grid-cols-3 gap-3"><div><p className="text-[11px] text-muted-foreground">Current Actual</p><p className="mt-2 text-lg font-semibold text-foreground">€4,280,000</p></div><div><p className="text-[11px] text-muted-foreground">Forecast · FY2025</p><p className="mt-2 text-lg font-semibold text-foreground">€5,840,000</p></div><div><p className="text-[11px] text-muted-foreground">Range</p><p className="mt-2 text-sm font-semibold text-foreground">€5.2M — €6.4M</p></div></div><button className="mt-5 text-xs font-semibold text-foreground hover:text-foreground">View Forecast <ChevronRight size={14} className="inline" /></button><p className="mt-4 text-[11px] text-muted-foreground">Forecast data is provided by the Forecasts module.</p></SectionCard>
<SectionCard title="Revenue Anomalies" eyebrow="Attention needed"><div className="space-y-3 text-xs">{[['Daily Revenue', 'Mar 14', '€4,200', '€8,000–€14,000', '-€6,800 · unusual low'], ['Channel Revenue — Organic', 'Feb 28', '€142,000', '€60,000–€95,000', '+€47,000 · spike']].map(row => <div key={row[0]} className="grid grid-cols-[1.3fr_.6fr_.7fr_1fr_1.2fr] items-center gap-2 border-b border-border/[.05] pb-3"><span className="text-foreground">{row[0]}</span><span className="text-muted-foreground">{row[1]}</span><span>{row[2]}</span><span className="text-muted-foreground">{row[3]}</span><span className={row[4].startsWith('-') ? 'text-chart-5' : 'text-foreground'}>{row[4]}</span></div>)}</div><button className="mt-4 text-xs text-foreground">View All Anomalies <ChevronRight size={13} className="inline" /></button></SectionCard>
<SectionCard title="Explain Revenue" eyebrow="AI Explanation" className="xl:col-span-2"><div className="flex gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary text-[var(--primary-foreground)]"><Bot size={20} /></div><div><p className="text-sm leading-6 text-foreground">Revenue grew <strong className="text-foreground">15.4% year-over-year</strong> to €4,280,000, driven primarily by expansion in existing Enterprise accounts (+€428,000) and strong new customer acquisition (+€856,000). Recurring revenue now represents 61.9% of total revenue, up from 58.8% in the previous period. The Lulu AI Pro tier was the highest-contributing product at 30% of total revenue.</p><button className="mt-4 rounded-lg bg-secondary/15 px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary/25">View AI Recommendations <ChevronRight size={14} className="inline" /></button></div></div></SectionCard>
<SectionCard title="Ask Lulu AI" eyebrow="Explore your revenue" className="xl:col-span-2"><form onSubmit={askSubmit} className="flex gap-2"><div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-[var(--secondary)] px-4"><MessageSquare size={16} className="text-muted-foreground" /><input value={ask} onChange={e => setAsk(e.target.value)} placeholder="Ask Lulu AI about your revenue..." className="w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground" aria-label="Ask Lulu AI about revenue" /></div><button className="rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary" type="submit">Ask</button></form><div className="mt-4 flex flex-wrap gap-2">{['How much revenue did we generate?', 'Why did revenue change?', 'Which products generate the most revenue?', 'Which customers generate the most revenue?', 'How much is recurring?', 'How concentrated is our revenue?', 'Compare with last year'].map(prompt => <button key={prompt} onClick={() => setAsk(prompt)} className="rounded-full border border-border/[.08] px-3 py-1.5 text-[11px] text-foreground hover:border-border/40 hover:text-foreground">{prompt}</button>)}</div></SectionCard></div>
<div className="mt-6 rounded-2xl border border-border/[.08] bg-[var(--secondary)] p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-[17px] font-semibold text-foreground">Data Sources</h2><p className="mt-1 text-xs text-muted-foreground">Revenue intelligence is built from your connected business systems.</p></div><button className="text-xs text-foreground hover:text-foreground">Manage sources <ChevronRight size={13} className="inline" /></button></div><div className="mt-5 grid gap-2 sm:grid-cols-5">{[['CRM', 'Connected', 'text-chart-4'], ['Billing', 'Connected', 'text-chart-4'], ['Ecommerce', 'Connected', 'text-chart-4'], ['Marketing Analytics', 'Partial', 'text-foreground'], ['Finance', 'Connected', 'text-chart-4']].map(source => <div key={source[0]} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-3"><span className="text-xs text-foreground">{source[0]}</span><span className={`text-[10px] ${source[2]}`}>{source[1]}</span></div>)}</div></div><div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/[.07] pt-5 text-[11px] text-muted-foreground"><span>Revenue Intelligence · Lulu AI Business OS</span><span>Observed · Calculated · Forecast · Target · Benchmark</span></div></div></div></div></main>;
}