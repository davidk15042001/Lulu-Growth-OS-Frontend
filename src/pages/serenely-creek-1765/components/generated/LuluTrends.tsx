import { useState } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Bell, CalendarDays, Check, ChevronDown, CircleHelp, Clock3, Download, FileText, Gauge, Globe2, Heart, LayoutGrid, Menu, MoreHorizontal, RefreshCw, Search, Share2, ShieldAlert, SlidersHorizontal, Sparkles, Star, Target, TrendingDown, TrendingUp, Users, Zap } from 'lucide-react';
type Tone = 'green' | 'red' | 'amber' | 'violet' | 'slate';
const categories = ['Business', 'Customer', 'Sales', 'Marketing', 'Advertising', 'Ecommerce', 'Finance', 'Product'];
const chips = ['Revenue', 'Customers', 'Conversion', 'Advertising', 'Retention', 'Pipeline'];
const trends = [['Revenue', 'Business', 'Increasing', 'Strong', '+12.4%', 'Last 90 days', 'Active', 'green'], ['Customer Retention', 'Customer', 'Declining', 'Moderate', '-3.1%', 'Last 60 days', 'Significant', 'red'], ['Conversion Rate', 'Sales', 'Stable', 'Weak', '+0.2%', 'Last 30 days', 'Stable', 'slate'], ['Advertising CAC', 'Advertising', 'Increasing', 'Strong', '+18.7%', 'Last 14 days', 'Significant', 'red'], ['Organic Traffic', 'Marketing', 'Increasing', 'Very Strong', '+31.2%', 'Last 8 weeks', 'Emerging', 'violet'], ['Average Order Value', 'Ecommerce', 'Increasing', 'Moderate', '+8.3%', 'Last 45 days', 'Active', 'green'], ['Sales Pipeline', 'Sales', 'Declining', 'Moderate', '-7.4%', 'Last 30 days', 'Active', 'red'], ['Customer LTV', 'Customer', 'Increasing', 'Moderate', '+5.9%', 'Last 90 days', 'Active', 'green']] as const;
const summary = [['Active Trends', '47', 'slate'], ['Increasing', '18', 'green'], ['Declining', '9', 'red'], ['Stable', '14', 'slate'], ['Accelerating', '6', 'violet'], ['Decelerating', '4', 'amber'], ['Significant Changes', '5', 'amber']] as const;
const sources = [['Shopify', '15 min ago', 'Excellent', 'green'], ['Google Analytics', '1h ago', 'Good', 'green'], ['Google Ads', '2h ago', 'Good', 'green'], ['Meta Ads', '6h ago', 'Limited', 'amber'], ['CRM', '30 min ago', 'Excellent', 'green']] as const;
const history = [['Revenue trend detected', 'System', '90 days ago'], ['Revenue trend updated', 'System', '2h ago'], ['Trend shared', 'Sarah M.', '1 day ago'], ['Report created', 'James K.', '3 days ago']] as const;
const toneClass: Record<Tone, string> = {
  green: 'bg-chart-4/10 text-chart-4',
  red: 'bg-chart-5/10 text-chart-5',
  amber: 'bg-secondary text-foreground',
  violet: 'bg-secondary text-foreground',
  slate: 'bg-secondary text-muted-foreground'
};
const borderTone: Record<Tone, string> = {
  green: 'border-border',
  red: 'border-chart-5/30',
  amber: 'border-border',
  violet: 'border-border',
  slate: 'border-border'
};
const Badge = ({
  children,
  tone = 'slate',
  icon
}: {
  children: React.ReactNode;
  tone?: Tone;
  icon?: React.ReactNode;
}) => <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${toneClass[tone]}`}>{icon}{children}</span>;
const Section = ({
  title,
  subtitle,
  action,
  children,
  tone = 'slate'
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  tone?: Tone;
}) => <section className={`mb-5 rounded-xl border bg-card p-5 shadow-[0_3px_16px_rgba(0,0,0,.045)] ${borderTone[tone]}`}><header className="mb-4 flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-[16px] font-semibold tracking-[-.015em] text-foreground">{title}</h2>{subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}</div>{action}</header>{children}</section>;
const TrendChart = ({
  small = false
}: {
  small?: boolean;
}) => <svg viewBox="0 0 900 245" className={small ? 'h-20 w-full' : 'h-64 w-full'} role="img" aria-label="Revenue trend line chart showing an upward trend over the last 90 days"><defs><linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--chart-2)" stopOpacity=".20" /><stop offset="1" stopColor="var(--chart-2)" stopOpacity="0" /></linearGradient></defs>{!small && <g stroke="var(--border)" strokeWidth="1">{[35, 80, 125, 170, 215].map(y => <line key={y} x1="50" x2="875" y1={y} y2={y} />)}</g>}<path d="M50 194 C105 180 118 187 160 165 S230 178 270 148 S338 141 380 128 S444 139 486 106 S552 120 600 91 S676 101 714 70 S786 76 850 37 L850 215 L50 215 Z" fill="url(#trendFill)" /><path d="M50 194 C105 180 118 187 160 165 S230 178 270 148 S338 141 380 128 S444 139 486 106 S552 120 600 91 S676 101 714 70 S786 76 850 37" fill="none" stroke="var(--chart-2)" strokeWidth="3" /><path d="M50 202 C135 184 205 175 270 159 S398 132 486 117 S610 97 714 81 S795 65 850 54" fill="none" stroke="var(--chart-3)" strokeWidth="2" strokeDasharray="7 7" />{!small && <g fill="var(--muted-foreground)" fontSize="11"><text x="6" y="39">€150K</text><text x="10" y="130">€125K</text><text x="15" y="220">€100K</text><text x="45" y="238">Nov 01</text><text x="245" y="238">Nov 24</text><text x="450" y="238">Dec 18</text><text x="650" y="238">Jan 11</text><text x="812" y="238">Jan 30</text></g>}</svg>;
export const LuluTrends = () => {
  const [activeCategory, setActiveCategory] = useState('Business');
  const [frequency, setFrequency] = useState('Daily');
  const [mobileNav, setMobileNav] = useState(false);
  const [taskOpen, setTaskOpen] = useState(true);
  const [methodOpen, setMethodOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 700);
  };
  const direction = (value: string) => value === 'Increasing' ? <ArrowUpRight size={14} /> : value === 'Declining' ? <ArrowDownRight size={14} /> : <ArrowRight size={14} />;
  return <div className="min-h-screen bg-[var(--background)] font-sans text-foreground">
    <aside className={`${mobileNav ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-30 w-[68px] flex-col items-center border-r border-border bg-[var(--sidebar)] py-5 lg:flex`}><div className="mb-8 flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">L</div><LuluSectionNavigation activeId="serenely-creek-1765" /><button className="rounded-lg p-3 text-foreground" aria-label="Help"><CircleHelp size={19} /></button><div className="mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-foreground">AM</div></aside>
    <main className="lg:ml-[68px]"><div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-8 lg:px-10">
      <header className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div><button onClick={() => setMobileNav(true)} className="mb-3 lg:hidden" aria-label="Open navigation"><Menu size={22} /></button><p className="mb-3 text-xs text-muted-foreground">Intelligence <span className="mx-2">/</span> Analytics <span className="mx-2">/</span> <span className="font-medium text-foreground">Trends</span></p><h1 className="text-3xl font-bold tracking-[-.045em] text-foreground sm:text-[38px]">Trends</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Discover the changes shaping your business and understand what is moving, accelerating, slowing or remaining stable.</p></div><div className="flex flex-wrap gap-2"><button className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary"><Sparkles size={14} />Ask Lulu AI</button><button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-secondary px-3 text-xs font-medium text-foreground">Explore Trends</button><button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs text-foreground"><Download size={14} />Export</button><button onClick={refresh} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground" aria-label="Refresh trends"><RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /></button></div></header>
      <section className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">{summary.map(([label, value, tone]) => <article key={label} className="rounded-xl border border-border bg-card px-4 py-4 shadow-[0_3px_12px_rgba(0,0,0,.035)]"><p className="text-[11px] leading-4 text-muted-foreground">{label}</p><div className="mt-2 flex items-end justify-between"><strong className="text-2xl font-semibold tracking-[-.04em] text-foreground">{value}</strong><span className={`${tone === 'green' ? 'text-chart-4' : tone === 'red' ? 'text-chart-5' : tone === 'amber' ? 'text-chart-1' : tone === 'violet' ? 'text-foreground' : 'text-muted-foreground'}`}>{label === 'Increasing' || label === 'Accelerating' ? '↑' : label === 'Declining' ? '↓' : label === 'Stable' ? '→' : label === 'Decelerating' ? '↘' : label === 'Significant Changes' ? '!' : '•'}</span></div>{label === 'Significant Changes' && <p className="mt-2 text-[10px] font-medium text-foreground">AI Detected</p>}</article>)}</section>
      <section className="mb-5 rounded-xl border border-border bg-card p-4 shadow-[0_3px_12px_rgba(0,0,0,.035)]"><div className="flex items-center gap-3 rounded-lg border border-border bg-secondary px-4 py-3"><Search size={18} className="text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-muted-foreground outline-none" placeholder="Search revenue, customers, conversion, advertising..." aria-label="Search trends" /><kbd className="hidden rounded border border-border bg-card px-2 py-1 text-[10px] text-muted-foreground sm:block">⌘ K</kbd></div><div className="mt-3 flex gap-2 overflow-x-auto">{chips.map(chip => <button key={chip} onClick={() => setQuery(chip)} className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:border-border hover:text-foreground">{chip}</button>)}<span className="ml-auto hidden items-center gap-1 text-xs text-muted-foreground md:flex"><Clock3 size={13} /> Recent searches</span><span className="hidden items-center gap-1 text-xs text-muted-foreground md:flex"><Star size={13} /> Favorites</span></div>{query && <p className="mt-3 text-xs text-foreground">Suggestions for <strong>{query}</strong> · Revenue · Customer LTV · Conversion Rate</p>}</section>
      <nav className="mb-5 flex gap-1 overflow-x-auto border-b border-border" aria-label="Trend categories">{categories.map(category => <button key={category} onClick={() => setActiveCategory(category)} className={`shrink-0 border-b-2 px-4 py-3 text-xs font-medium ${activeCategory === category ? 'border-border text-foreground' : 'border-transparent text-foreground hover:text-foreground'}`}>{category}</button>)}</nav>
      <Section title="Trend Library" subtitle={`${activeCategory} · 47 active trends`} action={<div className="flex gap-2"><button className="rounded-lg border border-border p-2 text-foreground"><SlidersHorizontal size={15} /></button><button className="rounded-lg border border-border p-2 text-foreground"><MoreHorizontal size={15} /></button></div>}><div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-xs"><caption className="sr-only">Trend library with KPI direction and status</caption><thead className="border-b border-border text-[11px] text-muted-foreground"><tr>{['KPI', 'Business Area', 'Direction', 'Strength', 'Change', 'Time Period', 'Last Updated', 'Status', 'Actions'].map(head => <th key={head} className="pb-3 font-medium">{head}</th>)}</tr></thead><tbody>{trends.map(row => <tr key={row[0]} className="border-b border-border hover:bg-card"><th scope="row" className="py-3.5 font-semibold text-foreground">{row[0]}</th><td className="text-muted-foreground">{row[1]}</td><td><span className={`inline-flex items-center gap-1 font-medium ${row[2] === 'Declining' ? 'text-chart-5' : row[2] === 'Increasing' ? 'text-foreground' : 'text-muted-foreground'}`}>{direction(row[2])}{row[2]}</span></td><td><span className="flex gap-0.5">{[1, 2, 3, 4].map(dot => <i key={dot} className={`h-1.5 w-5 rounded-full ${dot <= (row[3] === 'Very Strong' ? 4 : row[3] === 'Strong' ? 3 : row[3] === 'Moderate' ? 2 : 1) ? 'bg-primary' : 'bg-secondary'}`} />)}</span></td><td className={`font-semibold ${row[7] === 'red' ? 'text-chart-5' : 'text-chart-4'}`}>{row[4]}</td><td className="text-muted-foreground">{row[5]}</td><td className="text-muted-foreground">2h ago</td><td><Badge tone={row[7] === 'violet' ? 'violet' : row[7] === 'red' ? 'red' : row[7] === 'green' ? 'green' : 'slate'}>{row[6]}</Badge></td><td><button className="text-foreground hover:underline">Open</button><button className="ml-3 text-foreground" aria-label={`Favorite ${row[0]}`}><Star size={14} /></button></td></tr>)}</tbody></table></div><div className="mt-4 flex flex-wrap gap-3 text-[11px] text-muted-foreground"><span>Row actions: Open · Favorite · Share · Export · Create Task · Create Report</span><span className="ml-auto">Showing 8 of 47 trends</span></div></Section>
      <Section title="Revenue Trend" subtitle="Business · Last 90 days" action={<div className="flex flex-wrap items-center gap-2"><Badge tone="green" icon={<ArrowUpRight size={13} />}>+12.4%</Badge><Badge tone="violet" icon={<Sparkles size={12} />}>AI Detected</Badge></div>}><div className="grid gap-5 border-b border-border pb-5 md:grid-cols-[1fr_auto]"><div><p className="text-xs text-muted-foreground">Current</p><p className="mt-1 text-3xl font-bold tracking-[-.04em] text-foreground">€142,000</p><div className="mt-2 flex flex-wrap gap-4 text-xs"><span className="flex items-center gap-1 text-foreground"><ArrowUpRight size={14} />Increasing</span><span className="text-muted-foreground">Strong · <span className="inline-flex gap-0.5 align-middle">{[1, 2, 3, 4].map(i => <i key={i} className="h-1.5 w-5 rounded-full bg-primary text-primary-foreground" />)}</span> 4/4</span><span className="text-muted-foreground">Updated 2h ago</span></div></div><div className="flex gap-2"><button className="rounded-lg border border-border p-2 text-foreground"><Share2 size={15} /></button><button className="rounded-lg border border-border p-2 text-foreground"><Bell size={15} /></button></div></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div className="flex rounded-lg border border-border p-1">{['Daily', 'Weekly', 'Monthly'].map(item => <button key={item} onClick={() => setFrequency(item)} className={`rounded-md px-3 py-1.5 text-xs ${frequency === item ? 'bg-secondary font-medium text-foreground' : 'text-foreground'}`}>{item}</button>)}</div><div className="flex gap-2"><button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-foreground"><CalendarDays size={14} />Last 90 days</button><button className="rounded-lg border border-border px-3 py-2 text-xs text-foreground">Smoothing <span className="ml-2 inline-block h-4 w-7 rounded-full bg-primary align-middle text-primary-foreground"><span className="ml-3 mt-0.5 block h-3 w-3 rounded-full bg-card" /></span></button><select className="rounded-lg border border-border bg-card px-3 text-xs text-muted-foreground"><option>Breakdown</option><option>Country</option><option>Product</option></select></div></div><div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground"><span className="text-chart-2">● Revenue</span><span className="text-chart-2">╌ Trend line</span></div><TrendChart /><div className="grid grid-cols-2 gap-3 border-t border-border pt-4 md:grid-cols-4"><div><p className="text-[11px] text-muted-foreground">Start</p><strong className="text-lg text-foreground">€118K</strong></div><div><p className="text-[11px] text-muted-foreground">Current</p><strong className="text-lg text-foreground">€142K</strong></div><div><p className="text-[11px] text-muted-foreground">Change</p><strong className="text-lg text-chart-4">+€24K</strong></div><div><p className="text-[11px] text-muted-foreground">Relative Change</p><strong className="text-lg text-chart-4">+20.3%</strong></div></div><p className="mt-3 text-[11px] text-muted-foreground">Rate of change: +0.22% per day · Period analyzed: 90 days</p></Section>
      <div className="grid gap-5 xl:grid-cols-2"><Section title="Momentum" action={<Badge tone="amber">Decelerating</Badge>}><p className="text-sm leading-6 text-muted-foreground">Revenue is increasing and growth remains strong, but the rate of increase has slowed over the most recent two-week period.</p><TrendChart small /><div className="mt-3 flex justify-between text-xs"><span className="text-muted-foreground">Previous trend <strong className="text-foreground">steeper slope</strong></span><span className="text-foreground">Current trend <strong>shallower slope</strong></span></div><p className="mt-3 text-xs text-foreground">Acceleration / Deceleration: -0.08% per day · Calculated</p></Section><Section title="Trend Reversals" action={<Badge tone="green"><Check size={12} />No reversal</Badge>}><p className="text-sm text-muted-foreground">No reversal detected for Revenue.</p><div className="mt-4 rounded-lg bg-card p-3 text-xs"><p className="font-medium text-foreground">Example · Conversion Rate</p><div className="mt-2 flex flex-wrap items-center gap-2 text-muted-foreground"><span>Increasing</span><ArrowRight size={13} /><span className="text-chart-1">Peak · Week 6</span><ArrowRight size={13} /><span className="text-chart-5">Declining</span></div><p className="mt-2 text-muted-foreground">Previous direction: Increasing · Magnitude: Not available</p></div></Section></div>
      <div className="grid gap-5 xl:grid-cols-2"><Section title="Emerging Trends" tone="violet" action={<Badge tone="violet" icon={<Sparkles size={12} />}>AI Detected</Badge>}><div className="space-y-3">{[['Organic Traffic', '+31.2%', '8 consecutive weeks', 'Strong evidence'], ['New Customer Acquisition · Enterprise', 'Accelerating', 'Last 3 weeks', 'Observed'], ['TikTok Ads ROAS', 'Early momentum', 'Limited data', 'Weak signal — not yet confirmed']].map(item => <article key={item[0]} className="flex flex-wrap items-center gap-3 rounded-lg bg-secondary/60 p-3"><span className={item[2] === 'Limited data' ? 'text-foreground' : 'text-foreground'}>●</span><div className="min-w-[180px] flex-1"><h3 className="text-sm font-medium text-foreground">{item[0]}</h3><p className="mt-1 text-xs text-muted-foreground">{item[1]} · {item[2]}</p></div><span className="text-[11px] text-foreground">{item[3]}</span><button className="text-xs font-medium text-foreground">View</button></article>)}</div></Section><Section title="Declining Trends" tone="red"><div className="space-y-3">{[['Customer Retention', '-3.1%', '60 days', 'Moderate'], ['Sales Pipeline', '-7.4%', '30 days', 'Moderate'], ['Advertising CAC', '+18.7% worsening', '14 days', 'High']].map(item => <article key={item[0]} className="border-l-2 border-border pl-3"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-medium text-foreground">{item[0]}</h3><Badge tone={item[3] === 'High' ? 'red' : 'amber'}>{item[3]}</Badge><span className="ml-auto text-sm font-semibold text-chart-5">{item[1]}</span></div><p className="mt-1 text-xs text-muted-foreground">{item[2]} · Evidence: observed history</p><div className="mt-2 flex gap-3 text-xs"><button className="text-foreground">View</button><button className="text-foreground">Create Task</button><button className="text-chart-5">View Risk</button></div></article>)}</div></Section></div>
      <div className="grid gap-5 xl:grid-cols-2"><Section title="Stable Trends"><div className="space-y-3">{[['Conversion Rate', '3.2%', '±0.2%', '30 days'], ['Email Open Rate', '24.1%', '±0.8%', '45 days']].map(item => <article key={item[0]} className="flex items-center gap-3 rounded-lg border border-border p-3"><div className="h-2 w-2 rounded-full bg-muted" /><div className="flex-1"><h3 className="text-sm font-medium text-foreground">{item[0]}</h3><p className="mt-1 text-xs text-muted-foreground">Current value {item[1]} · Historical range {item[2]}</p></div><span className="text-xs text-muted-foreground">Stable {item[3]}</span></article>)}</div></Section><Section title="Volatility" action={<span className="text-[11px] text-muted-foreground">Calculated</span>}><div className="space-y-3">{[['Daily Revenue', 'High', '€3,200–€9,800', '41%'], ['Advertising Spend', 'Moderate', '€1,100–€4,200', 'Not available']].map(item => <article key={item[0]} className="flex flex-wrap items-center gap-3 rounded-lg bg-card p-3"><Activity size={17} className="text-foreground" /><div className="flex-1"><h3 className="text-sm font-medium text-foreground">{item[0]}</h3><p className="mt-1 text-xs text-muted-foreground">Range: {item[2]} · Coefficient of variation: {item[3]}</p></div><Badge tone={item[1] === 'High' ? 'red' : 'amber'}>{item[1]}</Badge></article>)}</div></Section></div>
      <div className="grid gap-5 xl:grid-cols-2"><Section title="Trend Breakdown" subtitle="Revenue Trend · Country" action={<select className="rounded-lg border border-border bg-card px-3 py-2 text-xs"><option>Country</option><option>Product</option><option>Customer Segment</option><option>Channel</option><option>Campaign</option></select>}><div className="space-y-3">{[['Germany', '+18%', 90, 'green'], ['Netherlands', '+12%', 60, 'green'], ['France', '+7%', 38, 'green'], ['UK', '-4%', 21, 'red'], ['Belgium', '+3%', 18, 'amber']].map(item => <div key={item[0]} className="flex items-center gap-3 text-xs"><span className="w-24 text-muted-foreground">{item[0]}</span><div className="h-2 flex-1 rounded-full bg-secondary"><div className={`h-2 rounded-full ${item[3] === 'red' ? 'bg-destructive' : item[3] === 'amber' ? 'bg-chart-1' : 'bg-primary'}`} style={{
                    width: `${item[2]}%`
                  }} /></div><strong className={item[3] === 'red' ? 'w-12 text-right text-chart-5' : 'w-12 text-right text-foreground'}>{item[1]}</strong></div>)}</div></Section><Section title="Segment Trends" subtitle="Customer Segments"><div className="mb-4 flex gap-3 overflow-x-auto border-b border-border">{['Customer Segments', 'Products', 'Geography', 'Business Units'].map((tab, i) => <button key={tab} className={`shrink-0 border-b-2 pb-2 text-xs ${i === 0 ? 'border-border text-foreground' : 'border-transparent text-foreground'}`}>{tab}</button>)}</div><div className="space-y-3">{[['Enterprise', '+24.1%', 'Fastest Growing', 'green'], ['Mid-Market', '+8.3%', 'Growing', 'green'], ['SMB', '+1.2%', 'Stable', 'amber'], ['Startup', '-5.4%', 'Declining', 'red']].map(item => <div key={item[0]} className="flex items-center gap-3 text-xs"><Users size={14} className="text-muted-foreground" /><span className="w-24 text-foreground">{item[0]}</span><strong className={item[3] === 'red' ? 'text-chart-5' : item[3] === 'amber' ? 'text-chart-1' : 'text-foreground'}>{item[1]}</strong><span className="ml-auto text-muted-foreground">{item[2]}</span></div>)}</div></Section></div>
      <Section title="Related Trends" subtitle="Metrics moving alongside Revenue (Correlated — not causal)"><div className="grid gap-3 md:grid-cols-4">{[['Revenue', '↑ +12.4%'], ['Customers', '↑ +9.8%'], ['Conversion Rate', '→ +0.2%'], ['Average Order Value', '↑ +8.3%']].map(item => <article key={item[0]} className="rounded-lg border border-border p-3"><div className="flex justify-between"><h3 className="text-sm font-medium text-foreground">{item[0]}</h3><Badge tone="violet">Correlated</Badge></div><p className="mt-3 text-lg font-semibold text-foreground">{item[1]}</p></article>)}</div><p className="mt-4 text-[11px] italic text-muted-foreground">Correlation does not imply causation.</p></Section>
      <Section title="Lulu AI Trend Analysis" tone="violet" action={<Badge tone="violet" icon={<Sparkles size={12} />}>AI-generated</Badge>}><div className="border-l-2 border-border pl-4"><p className="max-w-5xl text-sm leading-7 text-muted-foreground">Revenue has increased steadily over the last 90 days, driven by consistent customer growth and rising average order value. The trend remains strong with a +20.3% change over the period. Growth has slowed slightly during the most recent two weeks, though the overall direction remains positive. Customer retention shows a diverging pattern and warrants attention.</p></div><div className="mt-5 grid gap-3 md:grid-cols-4">{[['Key trend', 'Revenue growth'], ['Direction', 'Increasing'], ['Magnitude', '+20.3%'], ['Duration', '90 days']].map(item => <div key={item[0]} className="rounded-lg bg-secondary p-3"><p className="text-[11px] text-foreground">{item[0]}</p><strong className="mt-1 block text-sm text-foreground">{item[1]}</strong></div>)}</div><p className="mt-4 text-xs text-muted-foreground">Related metrics: Customers, Average Order Value, Customer Retention · Based on observed historical data.</p></Section>
      <Section title="What Is Driving This Trend?" subtitle="Revenue Growth" action={<Badge tone="violet">AI Inferred</Badge>}><div className="mx-auto max-w-2xl space-y-2 text-center"><div className="rounded-lg border border-border bg-secondary p-3 font-semibold text-foreground">Revenue Growth <span className="text-chart-4">+20.3%</span></div>{[['Customer Growth', '+9.8%', 'Observed'], ['Higher AOV', '+8.3%', 'Calculated'], ['Improved Conversion', 'Correlated', 'Correlated'], ['Enterprise Segment Expansion', 'Pattern detected', 'AI Inferred']].map(item => <div key={item[0]}><div className="py-1 text-foreground">↓</div><div className="flex flex-wrap items-center justify-between rounded-lg border border-border p-3 text-left"><span className="text-sm text-foreground">{item[0]} <strong className="text-foreground">({item[1]})</strong></span><span className="text-[11px] text-foreground">{item[2]}</span></div></div>)}</div><div className="mt-4 flex flex-wrap justify-center gap-2"><Badge tone="green">Observed</Badge><Badge tone="slate">Calculated</Badge><Badge tone="violet">Correlated</Badge><Badge tone="violet">AI Inferred</Badge><Badge tone="slate">Known Driver</Badge></div><p className="mt-4 text-center text-[11px] italic text-muted-foreground">Correlation does not imply causation.</p></Section>
      <div className="grid gap-5 xl:grid-cols-2"><Section title="Significant Changes" tone="violet" action={<Badge tone="violet" icon={<Sparkles size={12} />}>AI Detected</Badge>}><div className="space-y-2">{[['Advertising CAC increased significantly over the last 14 days', '+18.7%', 'High', 'red'], ['Customer churn began increasing after remaining stable for three months', 'New pattern', 'Moderate', 'amber'], ['Sales pipeline value declined for the second consecutive week', 'Declining', 'Moderate', 'amber']].map(item => <article key={item[0]} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3"><AlertTriangle size={16} className={item[3] === 'red' ? 'text-chart-5' : 'text-chart-1'} /><p className="min-w-[210px] flex-1 text-sm text-foreground">{item[0]} <strong className="text-foreground">({item[1]})</strong></p><Badge tone={item[3] === 'red' ? 'red' : 'amber'}>Severity: {item[2]}</Badge><button className="text-xs text-foreground">View</button><button className="text-xs text-foreground">Create Task</button></article>)}</div></Section><Section title="Trend Opportunities" tone="green"><div className="space-y-3">{[['Organic traffic has increased consistently for eight weeks. Consider expanding content in the strongest-performing topic cluster.', '+31.2%', '8 weeks', 'High', 'High'], ['Enterprise customer acquisition is accelerating. Sales capacity may benefit from scaling.', '+24.1%', '3 weeks', 'Medium', 'Medium']].map(item => <article key={item[0]} className="border-l-2 border-border pl-3"><p className="text-sm leading-6 text-foreground">{item[0]}</p><p className="mt-2 text-xs text-muted-foreground">Evidence: {item[1]} · Duration: {item[2]} · Impact: {item[3]} · Priority: {item[4]}</p><div className="mt-2 flex gap-3 text-xs"><button className="text-foreground">View Opportunity</button><button className="text-foreground">Create Task</button></div></article>)}</div></Section></div>
      <Section title="Trend Risks" tone="red"><div className="grid gap-3 md:grid-cols-2">{[['Customer retention has declined for four consecutive periods.', 'Retention ↓', '60 days', 'Moderate'], ['Advertising CAC continues rising, compressing margin.', 'CAC ↑', '14 days', 'High']].map(item => <article key={item[0]} className="border-l-2 border-chart-5 bg-chart-5/40 p-4 pl-4"><p className="text-sm text-foreground">{item[0]}</p><p className="mt-2 text-xs text-muted-foreground">Trend: {item[1]} · Duration: {item[2]} · Severity: {item[3]}</p><div className="mt-3 flex gap-3 text-xs"><button className="text-chart-5">View Risk</button><button className="text-foreground">Create Task</button></div></article>)}</div></Section>
      <Section title="AI Recommendations" action={<Badge tone="violet" icon={<Sparkles size={12} />}>AI Recommended</Badge>}><div className="grid gap-3 md:grid-cols-2">{[['Investigate rising Advertising CAC', 'CAC increased 18.7% in 14 days', 'High', 'Urgent'], ['Address declining customer retention', '4 consecutive periods of decline', 'High', 'High'], ['Expand organic content strategy', '8-week traffic growth', 'Medium', 'Medium'], ['Investigate UK revenue decline', 'Only region showing negative trend', 'Medium', 'Medium']].map((item, i) => <article key={item[0]} className="rounded-lg border border-border p-4"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-semibold text-foreground">{item[0]}</h3><Badge tone={i < 2 ? 'red' : 'amber'}>{item[3]}</Badge></div><p className="mt-2 text-xs text-muted-foreground">Reason: {item[1]}</p><p className="mt-2 text-xs text-foreground">Expected impact: {item[2]}</p><div className="mt-4 flex gap-3 text-xs"><button className="text-foreground">Review</button><button className="text-foreground">Create Task</button>{i === 0 && <button className="font-medium text-foreground">Execute with AI</button>}</div></article>)}</div></Section>
      <section className="mb-5 rounded-xl border border-border bg-card p-5 shadow-[0_3px_16px_rgba(0,0,0,.045)]"><button onClick={() => setTaskOpen(!taskOpen)} className="flex w-full items-center gap-2 text-left text-[16px] font-semibold text-foreground"><Target size={17} className="text-foreground" />Create Task from Trend <ChevronDown className={`ml-auto transition ${taskOpen ? 'rotate-180' : ''}`} size={16} /></button>{taskOpen && <div className="mt-4 grid gap-3 border-t border-border pt-4 md:grid-cols-2"><label className="text-xs text-muted-foreground">Task name<input defaultValue="Investigate revenue trend and CAC risk" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground" /></label><label className="text-xs text-muted-foreground">Owner<select className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"><option>Anna Morgan</option><option>David Chen</option></select></label><label className="text-xs text-muted-foreground">Priority<select className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"><option>High</option><option>Medium</option></select></label><label className="text-xs text-muted-foreground">Due date<input type="date" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" /></label><label className="text-xs text-muted-foreground md:col-span-2">Description<textarea defaultValue="Review the Revenue trend, investigate rising Advertising CAC, and document next actions." className="mt-1 h-16 w-full rounded-lg border border-border px-3 py-2 text-sm" /></label><div className="md:col-span-2"><button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Create Task</button><button onClick={() => setTaskOpen(false)} className="ml-2 rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground">Cancel</button><span className="ml-3 text-[11px] text-muted-foreground">Confirmation required</span></div></div>}</section>
      <Section title="Ask Lulu AI" tone="violet" action={<Sparkles size={18} className="text-muted-foreground" />}><div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-4 py-3"><Search size={17} className="text-muted-foreground" /><input className="flex-1 bg-transparent text-sm outline-none" placeholder="Ask about this trend..." /><button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Ask</button></div><div className="mt-3 flex flex-wrap gap-2">{['What is changing?', 'Why is this trend happening?', 'How strong is this trend?', 'When did it start?', 'Is the trend accelerating?', 'Which segments are driving it?', 'What should I do next?', 'Create a report from this trend'].map(q => <button key={q} className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:bg-secondary">{q}</button>)}</div></Section>
      <div className="grid gap-5 xl:grid-cols-2"><Section title="Saved Trends"><div className="space-y-2">{[['Revenue', 'Increasing', 'Business', 'Last 90 days', '2h ago'], ['CAC Trend', 'Increasing', 'Advertising', 'Last 14 days', 'Today'], ['Organic Traffic', 'Emerging', 'Marketing', 'Last 8 weeks', '1h ago']].map(item => <article key={item[0]} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3"><Star size={15} className="text-foreground" /><div className="flex-1"><h3 className="text-sm font-medium text-foreground">{item[0]}</h3><p className="mt-1 text-xs text-muted-foreground">{item[1]} · {item[2]} · {item[3]} · Updated {item[4]}</p></div><div className="flex gap-3 text-xs"><button className="text-foreground">Open</button><button className="text-foreground">Edit</button><button className="text-foreground">Duplicate</button><button className="text-muted-foreground">Delete</button></div></article>)}</div></Section><Section title="Data Sources"><div className="grid gap-2 sm:grid-cols-2">{sources.map(item => <article key={item[0]} className="rounded-lg border border-border p-3"><div className="flex items-center gap-2"><Globe2 size={15} className="text-foreground" /><h3 className="text-sm font-medium text-foreground">{item[0]}</h3><span className={`ml-auto h-2 w-2 rounded-full ${item[3] === 'amber' ? 'bg-chart-1' : 'bg-chart-4'}`} /></div><p className="mt-2 text-xs text-muted-foreground">Connected · Last sync: {item[1]}</p><Badge tone={item[3] === 'amber' ? 'amber' : 'green'}>{item[2]}</Badge></article>)}</div></Section></div>
      <div className="grid gap-5 xl:grid-cols-2"><Section title="Trend Data Quality" action={<Badge tone="green">Overall: Good</Badge>}><div className="space-y-3">{[['Historical Coverage', '24 months', 'Excellent', 96], ['Freshness', 'Updated 15 min ago', 'Excellent', 94], ['Completeness', '94%', 'Good', 94], ['Frequency', 'Daily', 'Good', 90], ['Reliability', 'High', 'Excellent', 96]].map(item => <div key={item[0]}><div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{item[0]}</span><span className="text-muted-foreground">{item[1]} · {item[2]}</span></div><div className="h-1.5 rounded-full bg-secondary"><div className="h-1.5 rounded-full bg-chart-4" style={{
                    width: `${item[3]}%`
                  }} /></div></div>)}</div></Section><Section title="Trend Methodology" action={<button onClick={() => setMethodOpen(!methodOpen)} className="rounded-lg border border-border p-2 text-foreground" aria-label="Toggle methodology"><ChevronDown className={`transition ${methodOpen ? 'rotate-180' : ''}`} size={15} /></button>}><p className="text-sm text-muted-foreground">Observed historical data only. Not predictive.</p>{methodOpen && <div className="mt-4 grid gap-3 border-t border-border pt-4 text-xs text-muted-foreground md:grid-cols-2"><p><strong>Data period:</strong> 24 months historical</p><p><strong>Analysis frequency:</strong> Daily</p><p><strong>Trend detection:</strong> Moving average analysis with change-point detection</p><p><strong>Smoothing:</strong> Applied where noted; raw data preserved in detail view</p><p><strong>Change detection:</strong> Minimum 3-period consistent directional movement</p><p><strong>Limitations:</strong> Trends reflect observed historical data only. Not predictive.</p></div>}<p className="mt-3 text-[11px] text-muted-foreground">Proprietary model details not exposed.</p></Section></div>
      <Section title="Trend History"><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-xs"><thead className="border-b border-border text-muted-foreground"><tr><th className="pb-3 font-medium">Event</th><th className="font-medium">User</th><th className="font-medium">Timestamp</th></tr></thead><tbody>{history.map(item => <tr key={item[0]} className="border-b border-border"><td className="py-3 text-foreground">{item[0]}</td><td className="text-muted-foreground">{item[1]}</td><td className="text-muted-foreground">{item[2]}</td></tr>)}</tbody></table></div></Section>
      <section className="mb-5 grid gap-3 rounded-xl border border-border bg-secondary p-4 text-xs text-muted-foreground md:grid-cols-2"><p><strong className="text-foreground">Empty:</strong> No trends available. Connect relevant data or select a supported KPI.</p><p><strong className="text-foreground">Insufficient data:</strong> Not enough historical data. More historical data is required to reliably identify this trend.</p><p><strong className="text-foreground">Unavailable:</strong> Trend analysis unavailable for selected KPI or time range.</p><p><strong className="text-foreground">Error:</strong> Trend analysis couldn't be loaded. <button className="font-medium text-foreground">Try Again</button></p><p className="md:col-span-2"><strong className="text-foreground">Restricted:</strong> Trend access restricted. You don't have permission to view this analysis.</p></section>
      <footer className="flex flex-wrap justify-between gap-3 border-t border-border py-6 text-[11px] text-muted-foreground"><span>Lulu AI Core Platform · Trends are based on connected historical data.</span><span>Last updated 2h ago · <button className="text-foreground">View in Reports →</button></span></footer>
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
