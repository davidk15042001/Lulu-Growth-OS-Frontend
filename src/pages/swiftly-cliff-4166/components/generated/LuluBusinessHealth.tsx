import { useMemo, useState } from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Bot, ChevronDown, ChevronRight, CircleHelp, Clock3, Database, Download, ExternalLink, Gauge, LayoutDashboard, LineChart, Menu, MoreHorizontal, Network, RefreshCw, Search, Settings, Sparkles, Store, Target, Users, WalletCards, X, Zap } from 'lucide-react';
interface Dimension {
  name: string;
  score: number;
  status: string;
  trend: string;
  kpis: [string, string, string][];
  color: string;
  points: number[];
}
interface Kpi {
  name: string;
  area: string;
  current: string;
  previous: string;
  change: string;
  trend: 'up' | 'down';
  kind: string;
}
const dimensions: Dimension[] = [{
  name: 'Revenue Health',
  score: 79,
  status: 'Stable',
  trend: 'Stable',
  color: 'var(--foreground)',
  kpis: [['Total Revenue', '$284K', '↓ -2.1%'], ['Revenue Growth', '-2.1%', '↓'], ['Revenue Stability', 'Moderate', '']],
  points: [42, 48, 45, 50, 47, 52, 49, 54, 51]
}, {
  name: 'Customer Health',
  score: 91,
  status: 'Excellent',
  trend: 'Improving',
  color: 'var(--chart-4)',
  kpis: [['Active Customers', '1,847', '↑ +4.2%'], ['Retention Rate', '87.2%', '↑ +1.1pp'], ['Churn Rate', '4.8%', '↓ concern']],
  points: [40, 44, 45, 50, 49, 56, 60, 62, 67]
}, {
  name: 'Financial Health',
  score: 88,
  status: 'Healthy',
  trend: 'Improving',
  color: 'var(--chart-4)',
  kpis: [['Gross Margin', '64.2%', '↑ +1.3pp'], ['Operating Expenses', '$98K', '→ Stable'], ['Net Profit', '$43K', '↑ +8.4%']],
  points: [46, 48, 47, 53, 56, 54, 60, 63, 68]
}, {
  name: 'Sales Health',
  score: 74,
  status: 'Stable',
  trend: 'Declining',
  color: 'var(--chart-1)',
  kpis: [['Pipeline Value', '$1.2M', '↓ -8.3%'], ['Win Rate', '28%', '↓ -2pp'], ['Conversion Rate', '3.4%', '↓ -0.6pp']],
  points: [66, 64, 62, 61, 58, 60, 56, 52, 50]
}, {
  name: 'Marketing Health',
  score: 80,
  status: 'Healthy',
  trend: 'Improving',
  color: 'var(--chart-4)',
  kpis: [['Organic Traffic', '42.8K', '↑ +12.4%'], ['Leads', '387', '↑ +6.2%'], ['Cost per Lead', '$24.80', '↓ Improving']],
  points: [44, 49, 47, 55, 57, 60, 64, 63, 70]
}, {
  name: 'Advertising Health',
  score: 69,
  status: 'Needs Attention',
  trend: 'Declining',
  color: 'var(--chart-1)',
  kpis: [['ROAS', '2.4x', '↓ -0.6x'], ['CPA', '$48', '↑ +$12'], ['Ad Spend', '$18.4K', '↑ +4.2%']],
  points: [70, 68, 65, 67, 61, 59, 57, 53, 48]
}, {
  name: 'Ecommerce Health',
  score: 85,
  status: 'Healthy',
  trend: 'Improving',
  color: 'var(--chart-4)',
  kpis: [['Orders', '1,284', '↑ +7.3%'], ['Conversion Rate', '3.8%', '↑ +0.4pp'], ['Average Order Value', '$221', '↑ +$14']],
  points: [42, 45, 49, 48, 56, 59, 63, 67, 72]
}, {
  name: 'Product Health',
  score: 83,
  status: 'Healthy',
  trend: 'Stable',
  color: 'var(--chart-4)',
  kpis: [['Product Revenue', '$194K', '↑ +3.1%'], ['Units Sold', '1,847', '↑ +5.4%'], ['Product Margin', '58.3%', '→ Stable']],
  points: [48, 50, 49, 56, 55, 60, 60, 64, 65]
}, {
  name: 'Operations Health',
  score: 77,
  status: 'Stable',
  trend: 'Stable',
  color: 'var(--foreground)',
  kpis: [['Completion Rate', '94.2%', '→ Stable'], ['Processing Time', '1.8 days avg', '→ Stable'], ['Automation Rate', '68%', '↑ +3pp']],
  points: [54, 54, 58, 57, 59, 61, 60, 64, 64]
}, {
  name: 'Growth Health',
  score: 81,
  status: 'Healthy',
  trend: 'Improving',
  color: 'var(--chart-4)',
  kpis: [['Revenue Growth', '-2.1% MoM', '↓'], ['Customer Growth', '+4.2% MoM', '↑'], ['Overall Growth Trend', 'Stable', '']],
  points: [44, 45, 49, 51, 53, 58, 59, 64, 67]
}];
const kpis: Kpi[] = [['Total Revenue', 'Revenue', '$284K', '$290K', '-2.1%', 'down', 'Observed'], ['Gross Margin', 'Finance', '64.2%', '62.9%', '+1.3pp', 'up', 'Calculated'], ['Customer Retention', 'Customers', '87.2%', '86.1%', '+1.1pp', 'up', 'Observed'], ['Churn Rate', 'Customers', '4.8%', '3.1%', '+1.7pp', 'down', 'Observed'], ['ROAS', 'Advertising', '2.4x', '3.0x', '-0.6x', 'down', 'Observed'], ['CPA', 'Advertising', '$48', '$36', '+$12', 'down', 'Observed'], ['Pipeline Value', 'Sales', '$1.2M', '$1.31M', '-8.3%', 'down', 'Observed'], ['Ecommerce CVR', 'Ecommerce', '3.8%', '3.4%', '+0.4pp', 'up', 'Observed'], ['Organic Traffic', 'Marketing', '42.8K', '38.1K', '+12.4%', 'up', 'Observed'], ['AOV', 'Ecommerce', '$221', '$207', '+$14', 'up', 'Observed'], ['Net Profit', 'Finance', '$43K', '$39.7K', '+8.4%', 'up', 'Observed'], ['Win Rate', 'Sales', '28%', '30%', '-2pp', 'down', 'Observed']].map(row => ({
  name: row[0],
  area: row[1],
  current: row[2],
  previous: row[3],
  change: row[4],
  trend: row[5] as 'up' | 'down',
  kind: row[6]
}));
const sources = [{
  name: 'Shopify',
  detail: 'Connected • Live',
  quality: 'Excellent'
}, {
  name: 'Google Analytics',
  detail: 'Connected • 2 min ago',
  quality: 'Good'
}, {
  name: 'Google Ads',
  detail: 'Connected • 5 min ago',
  quality: 'Good'
}, {
  name: 'Meta Ads',
  detail: 'Connected • 3 min ago',
  quality: 'Good'
}, {
  name: 'CRM',
  detail: 'Connected • 1 min ago',
  quality: 'Excellent'
}, {
  name: 'Finance',
  detail: 'Connected • 15 min ago',
  quality: 'Good'
}, {
  name: 'LinkedIn Ads',
  detail: 'Not Connected',
  quality: 'Available'
}, {
  name: 'TikTok Ads',
  detail: 'Not Connected',
  quality: 'Available'
}];
const trendPoints = [74, 75, 73, 76, 77, 76, 78, 78, 79, 80, 78, 80, 81, 80, 82];
const tabs = ['Overview', 'Business Health', 'Performance'];
function Sparkline({
  points,
  color = 'var(--chart-2)',
  large = false
}: {
  points: number[];
  color?: string;
  large?: boolean;
}) {
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${index * (large ? 25 : 12)} ${80 - point}`).join(' ');
  return <svg className={large ? 'h-40 w-full' : 'h-12 w-full'} viewBox={large ? '0 0 350 80' : '0 0 100 80'} preserveAspectRatio="none" role="img" aria-label="Trend sparkline"><path d={path} fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" /><path d={`${path} L ${large ? 350 : 100} 80 L 0 80 Z`} fill={color} opacity=".09" /></svg>;
}
export function LuluBusinessHealth() {
  const [period, setPeriod] = useState('Last 30 Days');
  const [compare, setCompare] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState('Financial Health');
  const [explain, setExplain] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [filter, setFilter] = useState('All');
  const visibleDimensions = useMemo(() => filter === 'All' ? dimensions : dimensions.filter(item => item.status === filter), [filter]);
  const statusClass = (status: string) => status === 'Needs Attention' ? 'border-chart-1/25 bg-chart-1/10 text-chart-1' : status === 'Excellent' ? 'border-chart-4/25 bg-chart-4/10 text-chart-4' : status === 'Healthy' ? 'border-chart-4/25 bg-chart-4/10 text-chart-4' : 'border-chart-1/25 bg-chart-1/10 text-foreground';
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/80 bg-[var(--card)]/95 px-5 backdrop-blur-xl lg:pl-72">
      <button className="rounded-lg p-2 text-foreground hover:bg-sidebar hover:text-foreground lg:hidden" onClick={() => setMobileNav(!mobileNav)} aria-label="Open navigation"><Menu size={20} /></button>
      <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex"><span>Intelligence</span><ChevronRight size={14} /><span>Business Intelligence</span><ChevronRight size={14} /><strong className="text-foreground">Business Health</strong></div>
      <div className="flex items-center gap-3"><button className="rounded-lg p-2 text-foreground hover:bg-card hover:text-foreground" aria-label="Search"><Search size={18} /></button><button className="relative rounded-lg p-2 text-foreground hover:bg-card hover:text-foreground" aria-label="Notifications"><Bell size={18} /><span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /></button><div className="hidden h-8 w-px bg-card sm:block" /><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-full bg-secondary/20 text-xs font-semibold text-foreground">JD</div><span className="hidden text-sm font-medium text-foreground sm:block">Jordan Davis</span><ChevronDown size={15} className="text-muted-foreground" /></div></div>
    </header>
    <aside className={`${mobileNav ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-border bg-[var(--sidebar)] p-4 lg:flex`}>
      <div className="mb-9 flex items-center gap-3 px-2"><div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-black/20"><Sparkles size={19} /></div><div><strong className="block text-lg tracking-tight">lulu<span className="text-foreground">.ai</span></strong><span className="text-[10px] uppercase tracking-[.22em] text-muted-foreground">Core Platform</span></div><button className="ml-auto text-foreground lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18} /></button></div>
      <LuluSectionNavigation activeId="swiftly-cliff-4166" />
      <div className="mt-2 border-l border-border/40 pl-3"><p className="mb-2 text-[10px] uppercase tracking-[.18em] text-muted-foreground">Business Intelligence</p>{['Business Health', 'Revenue', 'Customers', 'Sales', 'Marketing'].map(label => <button key={label} className={`mb-1 flex w-full items-center rounded-md px-3 py-2 text-left text-sm ${label === 'Business Health' ? 'bg-primary text-primary-foreground shadow-md shadow-black/30' : 'text-primary-foreground hover:text-primary-foreground'}`}><span>{label}</span>{label === 'Business Health' && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-card" />}</button>)}</div>
      <nav className="mt-auto space-y-1 border-t border-border pt-4"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:text-foreground"><Settings size={17} /><span>Settings</span></button><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:text-foreground"><CircleHelp size={17} /><span>Help center</span></button></nav>
    </aside>
    <main className="mx-auto max-w-[1440px] px-5 py-7 lg:ml-64 lg:px-10">
      <div className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><div className="mb-3 flex items-center gap-2 text-xs font-medium text-foreground"><Bot size={14} /><span>INTELLIGENCE / BUSINESS INTELLIGENCE</span></div><h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Business Health</h1><p className="mt-2 text-sm text-muted-foreground">Understand the current health, stability and performance of your business.</p></div><div className="flex flex-wrap items-center gap-2"><div className="relative"><button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"><Clock3 size={15} className="text-muted-foreground" /><span>{period}</span><ChevronDown size={14} /></button>{menuOpen && <div className="absolute right-0 top-11 z-10 w-44 rounded-xl border border-border bg-[var(--secondary)] p-1 shadow-2xl">{['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last 12 Months', 'Year to Date', 'Previous Year', 'Custom Range'].map(item => <button key={item} onClick={() => {
                setPeriod(item);
                setMenuOpen(false);
              }} className="w-full rounded-lg px-3 py-2 text-left text-xs text-foreground hover:bg-secondary/15 hover:text-foreground">{item}</button>)}</div>}</div><button onClick={() => setCompare(!compare)} className={`rounded-lg border px-3 py-2 text-sm ${compare ? 'border-border/40 bg-secondary/10 text-foreground' : 'border-border text-foreground'}`}>Compare <span className="text-muted-foreground">vs Previous Period</span></button><button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/40 hover:bg-primary"><Sparkles size={15} /> Ask Lulu AI</button><button className="rounded-lg border border-border p-2 text-foreground hover:text-foreground" aria-label="Refresh"><RefreshCw size={16} /></button><button className="hidden rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-card sm:block">Create Report</button><button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-card"><Download size={15} /> Export <ChevronDown size={14} /></button></div></div>
      <section className="mb-6 overflow-hidden rounded-2xl border border-border/80 bg-[var(--card)] shadow-2xl shadow-black/10" aria-labelledby="score-heading"><div className="flex flex-col gap-8 p-6 lg:flex-row lg:items-center lg:p-8"><div className="flex items-center gap-7 sm:gap-10"><div className="relative grid h-36 w-36 shrink-0 place-items-center rounded-full" style={{
              background: 'conic-gradient(var(--primary) 0deg 295deg, var(--secondary) 295deg 360deg)'
            }} aria-label="Business Health Score 82 out of 100"><div className="grid h-28 w-28 place-items-center rounded-full bg-[var(--secondary)]"><div className="text-center"><strong className="block text-4xl font-semibold text-foreground">82</strong><span className="text-xs text-muted-foreground">/ 100</span></div></div></div><div><div className="mb-2 flex items-center gap-2"><h2 id="score-heading" className="text-lg font-semibold text-foreground">Business Health Score</h2><span className="rounded-full border border-border/25 bg-secondary/10 px-2 py-0.5 text-[10px] font-medium text-foreground">CALCULATED</span></div><span className="inline-flex items-center gap-1.5 rounded-full border border-chart-4/25 bg-chart-4/10 px-2.5 py-1 text-xs font-medium text-chart-4"><span className="h-1.5 w-1.5 rounded-full bg-chart-4" />Healthy</span><p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">Most major business dimensions are stable or improving during the selected period.</p></div></div><div className="min-w-0 flex-1 border-l-0 border-border/60 lg:border-l lg:pl-10"><div className="mb-3 flex items-end justify-between"><div><p className="text-xs uppercase tracking-[.16em] text-muted-foreground">30 day score trend</p><p className="mt-1 text-sm font-medium text-chart-4">↑ +3 pts <span className="font-normal text-muted-foreground">vs previous period</span></p></div><LineChart size={18} className="text-chart-2" /></div><Sparkline points={trendPoints} large /><div className="flex justify-between text-[11px] text-muted-foreground"><span>30 days ago</span><span>Today</span></div></div></div><div className="border-t border-border/60 px-6 py-4 lg:px-8"><button onClick={() => setExplain(!explain)} className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-foreground"><ChevronRight size={15} className={explain ? 'rotate-90 transition-transform' : 'transition-transform'} /> How is this calculated?</button>{explain && <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground">Business Health combines measurable indicators across revenue, customers, sales, marketing, advertising, finance, ecommerce, products and operations. Missing data reduces score coverage. Last calculated: 2 minutes ago. <span className="ml-2 text-xs text-foreground">Calculated</span></p>}</div><div className="border-t border-border/60 px-6 py-5 lg:px-8"><div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold text-foreground">Health Score Breakdown</h3><span className="text-xs text-muted-foreground">10 dimensions · Calculated</span></div><div className="grid gap-x-8 gap-y-3 md:grid-cols-2">{dimensions.map(item => <div key={item.name} className="grid grid-cols-[130px_1fr_28px_92px] items-center gap-3 text-xs"><span className="truncate text-muted-foreground">{item.name.replace(' Health', '')}</span><div className="h-1.5 rounded-full bg-card"><div className="h-full rounded-full" style={{
                  width: `${item.score}%`,
                  backgroundColor: item.color
                }} /></div><strong className="text-right text-foreground">{item.score}</strong><span className={`rounded-full border px-2 py-1 text-center text-[10px] ${statusClass(item.status)}`}>{item.status}</span></div>)}</div></div></section>
      <div className="mb-6 grid gap-6 xl:grid-cols-[.8fr_1.2fr]"><section className="rounded-2xl border border-border/80 bg-[var(--card)] p-6"><div className="mb-6 flex items-center justify-between"><h2 className="font-semibold text-foreground">Current Business Status</h2><span className="rounded-full border border-border/20 bg-secondary/10 px-2 py-1 text-[10px] text-foreground">CALCULATED</span></div><div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full bg-chart-4 shadow-lg shadow-black/40" /><strong className="text-2xl text-foreground">Healthy</strong></div><p className="mt-3 text-sm leading-6 text-muted-foreground">Most major business dimensions are stable or improving during the selected period.</p><div className="mt-7 grid grid-cols-3 gap-2">{[['Improving', '3', 'text-chart-4'], ['Stable', '5', 'text-chart-1'], ['Needs Attention', '2', 'text-chart-1']].map(([label, count, color]) => <div key={label} className="rounded-xl border border-border/70 bg-background/50 p-3"><span className="block text-[11px] text-muted-foreground">{label}</span><strong className={`mt-1 block text-xl ${color}`}>{count}</strong><span className="text-[10px] text-muted-foreground">dimensions</span></div>)}</div></section><section className="rounded-2xl border border-border/80 bg-[var(--card)] p-6"><div className="mb-2 flex items-center justify-between"><div><h2 className="font-semibold text-foreground">Business Health Trend</h2><p className="mt-1 text-xs text-muted-foreground">Last 30 days · <span className="text-foreground">Calculated</span></p></div><button className="rounded-lg p-2 text-muted-foreground hover:bg-card hover:text-foreground" aria-label="More trend options"><MoreHorizontal size={18} /></button></div><Sparkline points={trendPoints} large /><div className="grid grid-cols-4 gap-3 border-t border-border pt-4 text-xs"><div><span className="block text-muted-foreground">Current</span><strong className="text-foreground">82</strong></div><div><span className="block text-muted-foreground">Previous</span><strong className="text-foreground">79</strong></div><div><span className="block text-muted-foreground">Change</span><strong className="text-chart-4">+3</strong></div><div><span className="block text-muted-foreground">Trend</span><strong className="text-chart-4">Improving ↑</strong></div></div></section></div>
      <section className="mb-7"><div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs uppercase tracking-[.18em] text-foreground">Business intelligence</p><h2 className="mt-1 text-xl font-semibold text-foreground">Health Dimensions</h2></div><div className="flex flex-wrap gap-2">{['All', 'Excellent', 'Healthy', 'Stable', 'Needs Attention'].map(item => <button key={item} onClick={() => setFilter(item)} className={`rounded-full border px-3 py-1.5 text-xs ${filter === item ? 'border-border/50 bg-secondary/15 text-foreground' : 'border-border text-foreground hover:text-foreground'}`}>{item}</button>)}</div></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visibleDimensions.map(item => <article key={item.name} className={`flex min-h-[276px] flex-col rounded-2xl border bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:border-border ${item.status === 'Needs Attention' ? 'border-chart-1/35 bg-chart-1/[.045]' : 'border-border/80'}`}><div className="mb-4 flex items-start justify-between"><div><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-card text-foreground"><Gauge size={16} /></div><h3 className="font-medium text-foreground">{item.name}</h3></div><span className="mt-2 block text-[10px] uppercase tracking-[.14em] text-muted-foreground">Calculated</span></div><div className="text-right"><strong className="block text-3xl font-semibold" style={{
                  color: item.color
                }}>{item.score}</strong><span className={`rounded-full border px-2 py-1 text-[10px] ${statusClass(item.status)}`}>{item.status}</span></div></div><div className="mb-3 flex items-center gap-2 text-xs"><span className={item.trend === 'Improving' ? 'text-chart-4' : item.trend === 'Declining' ? 'text-chart-1' : 'text-muted-foreground'}>{item.trend === 'Improving' ? '↑' : item.trend === 'Declining' ? '↓' : '→'} {item.trend}</span><span className="text-foreground">•</span><span className="text-muted-foreground">Current period</span></div><Sparkline points={item.points} color={item.color} /><dl className="mt-3 space-y-2">{item.kpis.map(([label, value, change]) => <div key={label} className="flex items-center justify-between text-xs"><dt className="text-muted-foreground">{label}</dt><dd className="flex items-center gap-2 text-right font-medium text-foreground">{value}<span className={change.startsWith('↑') ? 'text-foreground' : change.startsWith('↓') ? 'text-foreground' : 'text-muted-foreground'}>{change}</span></dd></div>)}</dl><button className="mt-auto flex items-center gap-1 pt-4 text-xs font-medium text-foreground hover:text-foreground">View Details <ExternalLink size={12} /></button></article>)}</div></section>
      <section className="mb-7 grid gap-6 xl:grid-cols-2"><div className="rounded-2xl border border-border/80 bg-[var(--secondary)] p-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold text-foreground">Strongest Business Areas</h2><span className="text-xs text-muted-foreground">Top 3 by score</span></div>{dimensions.slice(1, 3).concat(dimensions.slice(6, 7)).map((item, idx) => <div key={item.name} className="flex items-start gap-3 border-t border-border py-4"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-card text-xs text-muted-foreground">{idx + 1}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm text-foreground">{item.name}</strong><span className={`rounded-full border px-2 py-0.5 text-[10px] ${statusClass(item.status)}`}>{item.score} · {item.status}</span></div><p className="mt-1 text-xs leading-5 text-muted-foreground">{idx === 0 ? 'Retention increased 4.2% compared with the previous period.' : idx === 1 ? 'Gross margin improved 1.3pp.' : 'Order volume and conversion rate both increased.'}</p><span className="mt-1 block text-[10px] text-foreground">{idx === 1 ? 'Calculated' : 'Observed'} · View Details</span></div><ArrowUpRight className="text-chart-4" size={16} /></div>)}</div><div className="rounded-2xl border border-chart-1/20 bg-[var(--secondary)] p-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold text-foreground">Areas Requiring Attention</h2><span className="text-xs text-muted-foreground">Objective view</span></div>{[dimensions[5], dimensions[3]].map((item, idx) => <div key={item.name} className="flex items-start gap-3 border-t border-border py-4"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary/10 text-xs text-foreground">{idx + 1}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm text-foreground">{item.name}</strong><span className={`rounded-full border px-2 py-0.5 text-[10px] ${statusClass(item.status)}`}>{item.score} · {item.status}</span></div><p className="mt-1 text-xs leading-5 text-muted-foreground">{idx === 0 ? 'ROAS declined from 3.0x to 2.4x. CPA increased $12.' : 'Pipeline value decreased 8.3%. Win rate declined 2pp.'}</p><span className="mt-1 block text-[10px] text-foreground">{idx === 0 ? 'Observed' : 'Calculated'} · View Details</span></div><ArrowDownRight className="text-chart-1" size={16} /></div>)}<p className="mt-3 text-[11px] italic text-muted-foreground">Areas are ranked by measurable business condition, not AI recommendation.</p></div></section>
      <section className="mb-7 rounded-2xl border border-border/80 bg-[var(--card)] p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold text-foreground">Key KPI Movement</h2><p className="mt-1 text-xs text-muted-foreground">Observed and calculated performance signals</p></div><button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-foreground hover:bg-card">Open KPI Explorer <ExternalLink size={13} /></button></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead><tr className="border-b border-border text-[10px] uppercase tracking-[.12em] text-muted-foreground"><th className="pb-3 font-medium">KPI</th><th className="pb-3 font-medium">Business Area</th><th className="pb-3 font-medium">Current</th><th className="pb-3 font-medium">Previous</th><th className="pb-3 font-medium">Change</th><th className="pb-3 font-medium">Trend</th><th className="pb-3 font-medium">Source</th></tr></thead><tbody>{kpis.map(item => <tr key={item.name} className="border-b border-border/70 last:border-0"><td className="py-3 font-medium text-foreground">{item.name}</td><td className="py-3 text-muted-foreground">{item.area}</td><td className="py-3 text-foreground">{item.current}</td><td className="py-3 text-muted-foreground">{item.previous}</td><td className={`py-3 ${item.trend === 'up' ? 'text-chart-4' : 'text-chart-1'}`}>{item.change}</td><td className={`py-3 font-medium ${item.trend === 'up' ? 'text-chart-4' : 'text-chart-1'}`}>{item.trend === 'up' ? '↑ Improving' : '↓ Declining'}</td><td className="py-3 text-foreground">{item.kind}</td></tr>)}</tbody></table></div></section>
      <section className="mb-7 grid gap-6 xl:grid-cols-2"><div className="rounded-2xl border border-border/80 bg-[var(--secondary)] p-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold text-foreground">Business Health Comparison</h2><span className="text-xs text-foreground">Calculated</span></div><div className="space-y-3">{dimensions.map(item => <div key={item.name} className="grid grid-cols-[1.5fr_repeat(3,48px)_65px] items-center gap-2 text-xs"><span className="truncate text-muted-foreground">{item.name.replace(' Health', '')}</span><strong className="text-foreground">{item.score}</strong><span className="text-muted-foreground">{item.score - 3}</span><span className="text-muted-foreground">{item.score - 5}</span><span className="text-chart-4">↑ +3</span></div>)}</div><div className="mt-4 flex gap-4 border-t border-border pt-3 text-[10px] text-muted-foreground"><span>Current Period</span><span>Previous</span><span>Previous Year</span></div></div><div className="rounded-2xl border border-border/80 bg-[var(--secondary)] p-6"><div className="grid gap-8 sm:grid-cols-2"><div><h2 className="text-lg font-semibold text-foreground">Business Stability</h2><strong className="mt-3 block text-xl text-foreground">Moderately Stable</strong><p className="mt-1 text-xs text-foreground">Calculated</p><div className="mt-5 space-y-3">{[['Revenue', 'Moderate Volatility'], ['Customers', 'Stable'], ['Sales', 'Volatile'], ['Marketing', 'Stable'], ['Advertising', 'Volatile'], ['Ecommerce', 'Stable'], ['Finance', 'Stable'], ['Operations', 'Stable']].map(([label, status]) => <div key={label} className="flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><span className={status === 'Volatile' || status.startsWith('Moderate') ? 'text-foreground' : 'text-foreground'}>{status}</span></div>)}</div></div><div><h2 className="text-lg font-semibold text-foreground">Business Momentum</h2><strong className="mt-3 block text-xl text-chart-4">Growing Steadily</strong><p className="mt-1 text-xs text-foreground">Calculated from observed trends</p><div className="mt-5 space-y-3">{[['Revenue', 'Slowing'], ['Customers', 'Accelerating'], ['Sales', 'Slowing'], ['Marketing', 'Growing Steadily'], ['Advertising', 'Contracting'], ['Ecommerce', 'Accelerating'], ['Finance', 'Stable'], ['Growth', 'Growing Steadily']].map(([label, status]) => <div key={label} className="flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><span className={status === 'Slowing' || status === 'Contracting' ? 'text-foreground' : 'text-chart-4'}>{status}</span></div>)}</div></div></div></div></section>
      <section className="mb-7 rounded-2xl border border-border/80 bg-[var(--card)] p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold text-foreground">Data Health & Source Coverage</h2><p className="mt-1 text-sm text-muted-foreground">Good · 92% of Business Health metrics supported by current data</p></div><div className="flex gap-2 text-xs"><span className="rounded-full border border-border/20 bg-secondary/10 px-2 py-1 text-foreground">Freshness: Excellent</span><span className="hidden rounded-full border border-border px-2 py-1 text-muted-foreground sm:inline">Sync: Live</span></div></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{sources.map(source => <div key={source.name} className={`rounded-xl border p-4 ${source.quality === 'Available' ? 'border-border bg-background/30 opacity-55' : 'border-border/70 bg-background/55'}`}><div className="mb-3 flex items-center justify-between"><div className="grid h-8 w-8 place-items-center rounded-lg bg-card text-foreground"><Store size={15} /></div><span className={`text-[10px] ${source.quality === 'Available' ? 'text-muted-foreground' : 'text-foreground'}`}>{source.quality}</span></div><strong className="block text-sm text-foreground">{source.name}</strong><span className="mt-1 block text-[11px] text-muted-foreground">{source.detail}</span></div>)}</div></section>
      <section className="grid gap-6 pb-10 xl:grid-cols-2"><div className="rounded-2xl border border-border/25 bg-secondary/[.07] p-6"><div className="mb-4 flex items-start justify-between"><div><div className="mb-2 flex items-center gap-2"><Sparkles size={17} className="text-foreground" /><h2 className="text-lg font-semibold text-foreground">Explain This</h2><span className="rounded-full border border-border/30 bg-secondary/10 px-2 py-0.5 text-[10px] text-foreground">AI Explanation</span></div><p className="text-sm text-muted-foreground">Get a clear explanation of what moved your Business Health score.</p></div><button onClick={() => setExplain(!explain)} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary">Explain Score</button></div>{explain && <div className="border-t border-border/20 pt-4 text-sm leading-6 text-foreground"><p><strong className="text-foreground">What changed:</strong> Revenue slightly declined, Customer Health improved, and Advertising efficiency dropped.</p><p className="mt-2 text-xs text-muted-foreground">This is an AI-generated explanation based on available business data.</p></div>}<button className="mt-5 flex items-center gap-2 text-xs text-foreground">Open KPI Explorer <ExternalLink size={13} /></button></div><div className="rounded-2xl border border-border/80 bg-[var(--secondary)] p-6"><div className="mb-4 flex items-center gap-2"><Bot size={18} className="text-foreground" /><h2 className="text-lg font-semibold text-foreground">Ask Lulu AI</h2></div><div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-3"><input className="min-w-0 flex-1 bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground" placeholder="Ask Lulu AI about your business health..." aria-label="Ask Lulu AI" /><button className="rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary" aria-label="Send question"><ArrowUpRight size={16} /></button></div><div className="mt-4 flex flex-wrap gap-2">{['How healthy is my business?', 'Which areas are strongest?', 'Why did my score change?', 'How healthy is my advertising?'].map(prompt => <button key={prompt} className="rounded-full border border-border px-3 py-1.5 text-[11px] text-foreground hover:border-border/40 hover:text-foreground">{prompt}</button>)}</div></div></section>
    </main>
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
