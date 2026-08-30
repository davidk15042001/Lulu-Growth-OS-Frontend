import { useState, type ReactNode } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Brain, Check, ChevronDown, ChevronRight, CircleHelp, Database, Gauge, Layers3, Menu, MessageSquare, RefreshCw, Search, Send, Settings2, ShieldCheck, Sparkles, Target, TrendingUp, Users, WalletCards, X } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type Tone = 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'slate';
type Kpi = {
  name: string;
  value: string;
  previous: string;
  change: string;
  tone: Tone;
  icon: typeof Activity;
};
type Row = {
  name: string;
  previous: string;
  current: string;
  change: string;
  tone: Tone;
  impact: string;
  source: string;
};
const tone: Record<Tone, string> = {
  green: 'border-border bg-secondary text-foreground',
  amber: 'border-border bg-secondary text-foreground',
  red: 'border-chart-5/30 bg-chart-5/10 text-chart-5',
  blue: 'border-border bg-secondary text-foreground',
  purple: 'border-border bg-secondary text-foreground',
  slate: 'border-border bg-card text-muted-foreground'
};
const kpis: Kpi[] = [];
const changes: Row[] = [];
const opportunities: Array<Record<string, any>> = [];
const risks: Array<Record<string, any>> = [];
const questions = ['How is my business performing?', 'What changed this month?', 'What should I focus on?', 'What is the biggest risk?', 'What is my biggest opportunity?', 'Why is revenue changing?', 'What decisions should I make?'];
const Sparkline = ({
  color = 'var(--chart-3)'
}: {
  color?: string;
}) => <svg viewBox="0 0 120 30" className="h-8 w-24" role="img" aria-label="Trend sparkline"><path d="M2 24 C15 22 18 16 30 20 S44 9 55 14 S70 12 78 16 S94 5 104 10 S112 4 118 6" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" /></svg>;
const Badge = ({
  children,
  kind = 'slate'
}: {
  children: ReactNode;
  kind?: Tone;
}) => <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold ${tone[kind]}`}>{children}</span>;
const Header = ({
  title,
  subtitle,
  action
}: {
  title: string;
  subtitle?: string;
  action?: string;
}) => <div className="mb-4 flex items-end justify-between gap-4"><div><h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>{subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}</div>{action && <button className="hidden items-center gap-1 text-xs font-bold text-foreground sm:flex">{action}<ChevronRight size={14} /></button>}</div>;
const Button = ({
  children,
  primary = false
}: {
  children: ReactNode;
  primary?: boolean;
}) => <button className={`rounded-lg px-3 py-2 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-ring ${primary ? 'bg-primary text-primary-foreground hover:bg-primary' : 'border border-border bg-card text-foreground hover:bg-card'}`}>{children}</button>;
export const LuluExecutiveOverview = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [navOpen, setNavOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [sent, setSent] = useState(false);
  const { items: incomeRecords, loading: incomeLoading, error: incomeError } = useLiveRecords('finance_income');
  const { items: customerRecords, loading: customersLoading, error: customersError } = useLiveRecords('finance_customers');
  const { items: dealRecords, loading: dealsLoading, error: dealsError } = useLiveRecords('sales_deals');
  const getExecutiveField = (record: typeof incomeRecords[number], key: string) => String((record as unknown as Record<string, unknown>)[key] ?? '');
  const totalIncome = incomeRecords.reduce((sum, record) => sum + (Number(getExecutiveField(record, 'amount')) || Number(getExecutiveField(record, 'revenue')) || 0), 0);
  const liveKpis: Kpi[] = [];
  const executiveLoading = incomeLoading || customersLoading || dealsLoading;
  const executiveError = incomeError || customersError || dealsError;
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
  <aside className={`${mobileMenu ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 flex w-[248px] flex-col bg-[var(--sidebar)] text-foreground transition-transform lg:translate-x-0`}><div className="flex h-[72px] items-center border-b border-border px-6"><div className="mr-3 flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles size={17} /></div><strong className="text-lg text-foreground">LULU<span className="text-foreground">AI</span></strong><button onClick={() => setMobileMenu(false)} className="ml-auto lg:hidden" aria-label="Close navigation"><X size={18} /></button></div><div className="flex items-center gap-3 border-b border-border px-5 py-4"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary text-xs font-bold text-primary-foreground">AC</div><div><p className="text-sm font-semibold text-foreground">Connected workspace</p><p className="text-xs text-muted-foreground">Enterprise workspace</p></div><ChevronDown size={15} className="ml-auto" /></div><LuluSectionNavigation activeId="tender-water-4095" /><div className="border-t border-border p-4"><button className="flex w-full gap-3 px-3 py-2 text-sm text-foreground"><Settings2 size={17} />Settings</button><button className="flex w-full gap-3 px-3 py-2 text-sm text-foreground"><CircleHelp size={17} />Help center</button></div></aside>
  <main className="min-w-0 lg:ml-[248px]"><header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border bg-secondary px-4 backdrop-blur md:px-8"><button onClick={() => setMobileMenu(true)} className="mr-3 lg:hidden" aria-label="Open navigation"><Menu size={21} /></button><div className="flex items-center gap-2 text-sm text-muted-foreground"><span>Intelligence</span><ChevronRight size={14} /><strong className="text-foreground">Executive Overview</strong></div><div className="flex items-center gap-2"><Button>Last 30 Days <ChevronDown className="ml-1 inline" size={13} /></Button><Button>Compare <ChevronDown className="ml-1 inline" size={13} /></Button><Button primary><MessageSquare className="mr-1 inline" size={14} />Ask Lulu AI</Button><button className="rounded-lg border border-border p-2" aria-label="Refresh data"><RefreshCw size={15} /></button><button className="rounded-lg p-2" aria-label="Notifications"><Bell size={17} /></button></div></header>
  <div id="overview" className="mx-auto max-w-[1500px] px-4 py-7 md:px-8 lg:px-10">{executiveError && <div role="alert" className="mb-5 rounded-lg border border-chart-5/30 bg-chart-5/10 px-4 py-3 text-sm text-chart-5">Executive data could not be loaded. Check income, customer and deal records and try again.</div>}{!executiveLoading && !executiveError && liveKpis.length === 0 && <></>}<div className="mb-7"><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-foreground">Business operating system</p><h1 className="text-3xl font-bold tracking-[-.04em] text-foreground md:text-[38px]">Executive Overview</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">Get a clear view of your business performance, major changes, opportunities, risks and the decisions that matter most.</p></div>
  <section className="mb-8 rounded-2xl border border-border bg-gradient-to-r from-white via-white to-secondary/70 p-5 shadow-sm md:p-6"><div className="flex gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground"><Brain size={20} /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-foreground">Executive Summary</h2><Badge kind="purple"><Sparkles size={11} />AI-generated</Badge></div><p className="mt-3 max-w-5xl text-base leading-7 text-foreground">Your business is performing strongly overall. Revenue and customer growth improved during the selected period, while advertising efficiency declined and requires attention. Lulu AI identified three high-impact opportunities and two risks that may affect near-term growth.</p><div className="mt-4 flex flex-wrap gap-2"><Badge kind="green">Business Status: Strong</Badge><Badge kind="green">Major Positive: Revenue — ↑</Badge><Badge kind="red">Major Negative: Advertising ROAS — ↓</Badge><Badge kind="amber">Most Important Action: Review advertising efficiency</Badge></div></div></div></section>
  <section id="health" className="mb-9 grid gap-4 lg:grid-cols-[.85fr_2fr]"><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><Header title="Business Health" subtitle="Overall business performance remains positive." /><div className="flex items-center gap-5"><div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full" style={{
                background: 'conic-gradient(var(--chart-4) 0 82%,var(--secondary) 82% 100%)'
              }}><div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-card"><strong className="text-2xl">82</strong><span className="text-[10px] text-muted-foreground">/ 100</span></div></div><div><Badge kind="green">Healthy · +6 ↑</Badge><p className="mt-3 text-xs text-muted-foreground">Positive business momentum</p></div></div><div className="mt-5 space-y-2 text-sm">{['Revenue', 'Customers', 'Growth', 'Marketing', 'Advertising', 'Operations'].map(item => <div key={item} className="flex items-center justify-between"><span className="flex items-center gap-2 text-muted-foreground"><span className={`h-2 w-2 rounded-full ${item === 'Advertising' ? 'bg-chart-1' : 'bg-chart-4'}`} />{item}</span><strong className={item === 'Advertising' ? 'text-chart-1' : 'text-chart-4'}>{item === 'Advertising' ? 'Attention Needed' : item === 'Operations' ? 'Stable' : item === 'Growth' ? 'Strong' : item === 'Marketing' ? 'Good' : 'Positive'}</strong></div>)}</div><button className="mt-5 text-sm font-bold text-foreground">View Business Health <ChevronRight className="inline" size={14} /></button></article><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><Header title="Executive KPI Snapshot" subtitle="Observed performance across the metrics that matter most." /><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">{(executiveLoading ? [] : liveKpis).map(item => {
                const Icon = item.icon;
                return <article key={item.name} className="rounded-lg border border-border p-3 transition hover:border-border hover:shadow-sm"><div className="flex items-center justify-between"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-muted-foreground"><Icon size={14} /></span><Badge kind="slate">Observed</Badge></div><p className="mt-3 text-[11px] text-muted-foreground">{item.name}</p><strong className="mt-1 block text-lg tracking-tight">{item.value}</strong><div className="mt-1 flex items-center justify-between"><span className={`text-xs font-bold ${item.tone === 'red' ? 'text-chart-5' : item.tone === 'amber' ? 'text-chart-1' : 'text-chart-4'}`}>{item.change} {item.tone === 'red' ? '↓' : '↑'}</span><span className="text-[10px] text-muted-foreground">prev {item.previous}</span></div><Sparkline color={item.tone === 'red' ? 'var(--chart-5)' : item.tone === 'amber' ? 'var(--chart-1)' : 'var(--chart-4)'} /></article>;
              })}</div></article></section>
  <section className="mb-9 rounded-xl border border-border bg-card p-5 shadow-sm"><Header title="Revenue & Growth" subtitle="Momentum, forecast and the drivers behind revenue performance." /><div className="grid gap-6 md:grid-cols-2"><div><p className="text-4xl font-bold tracking-tight">—</p><Badge kind="green">— growth ↑</Badge><p className="mt-5 text-xs text-muted-foreground">Revenue forecast · next 30 days</p><p className="mt-1 text-2xl font-bold">— <Badge kind="purple"><Sparkles size={10} />AI Forecast · Estimated</Badge></p><p className="mt-3 text-sm text-muted-foreground">Revenue increased primarily due to stronger customer acquisition and higher average order value.</p></div><div className="flex items-center justify-between rounded-xl bg-card p-5"><div><p className="text-xs text-muted-foreground">Growth score</p><p className="text-4xl font-bold">91<span className="text-sm font-normal text-muted-foreground">/100</span></p><p className="mt-2 text-sm font-bold text-chart-4">Customer growth —</p><p className="mt-1 text-sm font-bold text-chart-4">Sales growth —</p></div><div className="flex h-24 w-24 items-center justify-center rounded-full" style={{
                background: 'conic-gradient(var(--chart-4) 0 91%,var(--secondary) 91% 100%)'
              }}><div className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-lg font-bold">91</div></div></div></div><div className="mt-6 rounded-lg bg-card p-3"><svg viewBox="0 0 800 170" className="h-40 w-full" role="img" aria-label="Revenue over time chart"><path d="M10 140 C90 128 120 100 180 112 S280 80 340 95 S430 45 500 68 S590 28 660 48 S730 20 790 30 L790 155 L10 155Z" fill="var(--border)" /><path d="M10 140 C90 128 120 100 180 112 S280 80 340 95 S430 45 500 68 S590 28 660 48 S730 20 790 30" fill="none" stroke="var(--chart-3)" strokeWidth="3" /><path d="M10 145 C120 130 190 125 280 110 S440 102 530 91 S680 74 790 62" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeDasharray="7 7" /></svg><div className="flex justify-between text-[10px] text-muted-foreground"><span>1 Jun</span><span>15 Jun</span><span>30 Jun</span></div></div><div className="mt-4 flex flex-wrap items-center gap-2"><Badge kind="purple"><Sparkles size={11} />AI Inferred</Badge><span className="rounded-md bg-card px-2 py-1 text-xs text-muted-foreground">AOV —</span><span className="rounded-md bg-card px-2 py-1 text-xs text-muted-foreground">New customers +492</span><Button>View Revenue</Button><Button>View Growth</Button></div></section>
  <section className="mb-9 grid gap-4 lg:grid-cols-2"><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><Header title="Customers & Sales" /><div className="grid grid-cols-2 gap-4"><div><p className="text-3xl font-bold">4,821</p><Badge kind="green">—</Badge><dl className="mt-5 space-y-2 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">New this period</dt><dd className="font-bold">492</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Retention</dt><dd className="font-bold">—</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Churn</dt><dd className="font-bold">—</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">LTV avg.</dt><dd className="font-bold">—</dd></div></dl></div><div><p className="text-3xl font-bold">—</p><p className="text-xs text-muted-foreground">Pipeline</p><dl className="mt-5 space-y-2 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Open deals</dt><dd className="font-bold">127</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Win rate</dt><dd className="font-bold">—</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Avg deal</dt><dd className="font-bold">—</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Velocity</dt><dd className="font-bold">18 days</dd></div></dl></div></div><p className="mt-5 rounded-lg bg-chart-4/10 p-3 text-sm font-semibold text-chart-4">AI Inferred · Customer growth increased — while retention remained stable.</p></article><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><Header title="Marketing & Advertising" /><div className="grid grid-cols-2 gap-4"><div><p className="text-3xl font-bold">84<span className="text-sm font-normal text-muted-foreground">/100</span></p><Badge kind="green">Good</Badge><p className="mt-5 text-sm text-muted-foreground">Lead gen <strong className="float-right text-chart-4">—</strong></p><p className="mt-2 text-sm text-muted-foreground">Conversion <strong className="float-right text-chart-4">—</strong></p><p className="mt-2 text-sm text-muted-foreground">Best channel <strong className="float-right">Google Ads</strong></p></div><div><p className="text-sm text-muted-foreground">Spend <strong className="float-right">—</strong></p><p className="mt-2 text-sm text-muted-foreground">Revenue <strong className="float-right">—</strong></p><p className="mt-4 text-3xl font-bold">3.6 <Badge kind="red">— ↓</Badge></p><p className="mt-1 text-xs text-muted-foreground">ROAS · previous 4.2</p></div></div><div className="mt-5 grid gap-2 sm:grid-cols-2"><span className="rounded-lg bg-secondary p-3 text-sm text-foreground"><strong>Best platform</strong><br />Google Ads · ROAS 4.8</span><span className="rounded-lg bg-chart-5/10 p-3 text-sm text-chart-5"><strong>Weakest</strong><br />Meta Remarketing · ROAS 2.1</span></div><p className="mt-4 text-sm text-muted-foreground">AI Inferred · Google Ads generated the strongest return, while Meta advertising efficiency declined.</p></article></section>
  <section className="mb-9 rounded-xl border border-border bg-card p-5 shadow-sm"><Header title="Financial Performance" /><div className="grid grid-cols-2 gap-5 md:grid-cols-4">{[['Revenue', '—'], ['Gross Profit', '—'], ['Gross Margin', '42.8%'], ['Previous period', '—']].map(row => <div key={row[0]}><p className="text-xs text-muted-foreground">{row[0]}</p><p className="mt-1 text-xl font-bold">{row[1]}</p><p className="text-xs text-foreground">↑ Observed</p></div>)}</div><p className="mt-5 text-xs text-muted-foreground">Observed data from Finance System</p></section>
  <section className="mb-9 grid gap-4 lg:grid-cols-2"><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><Header title="Operational Performance" /><div className="grid grid-cols-2 gap-4 text-sm"><p className="text-muted-foreground">Efficiency <strong className="float-right text-foreground">Good</strong></p><p className="text-muted-foreground">Fulfillment <strong className="float-right">—</strong></p><p className="text-muted-foreground">Avg processing <strong className="float-right">1.4 days</strong></p><p className="text-muted-foreground">Support volume <strong className="float-right">Stable</strong></p></div></article><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><Header title="Product Performance" action="View Products" /><div className="space-y-3 text-sm">{[['Product A', '—', '+18%', 'Top product'], ['Product B', '—', '+28%', 'Fastest growing'], ['Product C', '—', '-12%', 'Attention']].map(row => <div key={row[0]} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-border pb-2 last:border-0"><strong>{row[0]}</strong><span>{row[1]}</span><span className={row[2].startsWith('-') ? 'text-chart-1' : 'text-foreground'}>{row[2]} · {row[3]}</span></div>)}</div></article></section>
  <section className="mb-9"><Header title="What Changed" subtitle="The most important business changes during the selected period, prioritized by impact." /><div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm"><div className="min-w-[820px]">{changes.map(item => <div key={item.name} className="grid grid-cols-[1.2fr_1fr_.7fr_.8fr_1fr_auto] items-center gap-4 border-b border-border px-5 py-4 last:border-0"><strong className="text-sm">{item.name}</strong><span className="text-xs text-muted-foreground">{item.previous} → <b className="text-foreground">{item.current}</b></span><span className={`text-sm font-bold ${item.tone === 'red' ? 'text-chart-5' : 'text-foreground'}`}>{item.tone === 'red' ? <ArrowDownRight className="inline" size={14} /> : <ArrowUpRight className="inline" size={14} />} {item.change}</span><span className="text-xs text-muted-foreground">Last 30 days</span><div><Badge kind={item.tone}>{item.impact}</Badge><p className="mt-1 text-[10px] text-muted-foreground">{item.source}</p></div><button className="text-xs font-bold text-foreground">View Analysis</button></div>)}</div></div></section>
  <section className="mb-9 grid gap-4 lg:grid-cols-2"><div><Header title="Top Opportunities" subtitle="Prioritized by potential business impact." /><div className="space-y-3">{opportunities.map(item => <article key={item.title} className="rounded-xl border border-border bg-card p-4 shadow-sm"><div className="flex gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-border text-sm font-bold text-foreground">{item.score}</div><div className="min-w-0 flex-1"><Badge kind="purple"><Sparkles size={10} />AI Detected</Badge><Badge kind={item.impact === 'High' ? 'green' : 'amber'}>{item.impact} impact</Badge><h3 className="mt-2 text-sm font-bold">{item.title}</h3><p className="mt-1 text-xs text-muted-foreground">{item.evidence}</p><p className="mt-2 text-[11px] text-muted-foreground">{item.area} · {item.confidence}% confidence</p><div className="mt-3 flex gap-2"><Button>View Opportunity</Button><Button>Review Recommendation</Button></div></div></div></article>)}</div></div><div><Header title="Top Risks" subtitle="Signals that may affect near-term growth." /><div className="space-y-3">{risks.map(item => <article key={item.title} className="rounded-xl border border-border bg-card p-4 shadow-sm"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-5/10 text-chart-5"><AlertTriangle size={18} /></div><div className="flex-1"><div className="flex justify-between"><h3 className="text-sm font-bold">{item.title}</h3><Badge kind="purple"><Sparkles size={10} />AI Detected</Badge></div><p className="mt-2 text-xs text-muted-foreground">Risk score <strong className="text-chart-5">{item.score}</strong> · {item.area}</p><p className="mt-1 text-xs text-muted-foreground">{item.evidence}</p><button className="mt-3 text-xs font-bold text-foreground">Investigate <ChevronRight className="inline" size={13} /></button></div></div></article>)}</div></div></section>
  <section className="mb-9"><Header title="Decisions Requiring Attention" /><div className="grid gap-4 lg:grid-cols-2">{[['Reallocate Advertising Budget', 'Meta Ads efficiency declined while Google Ads is outperforming current allocation.', 'Shift a portion of budget toward Google Ads.', 'ROAS improvement ~+0.4'], ['Increase Retention Investment', 'CAC increasing while retention recently stabilized.', 'Allocate budget to retention programs for high-LTV segments.', '2–3pp retention improvement, lower CAC']].map(item => <article key={item[0]} className="rounded-xl border border-border bg-card p-5 shadow-sm"><h3 className="text-base font-bold">{item[0]}</h3><p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted-foreground">Current situation</p><p className="mt-1 text-sm text-muted-foreground">{item[1]}</p><p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Recommended decision</p><p className="mt-1 text-sm text-foreground">{item[2]}</p><p className="mt-3 text-sm font-semibold text-chart-4">Expected impact: {item[3]} · Risk: Low</p><div className="mt-4 flex flex-wrap gap-2"><Button>Review</Button><Button>Approve</Button><Button>Modify</Button><Button>Reject</Button>{item[0].startsWith('Reallocate') && <Button primary>Execute with AI</Button>}</div><p className="mt-3 text-[11px] text-muted-foreground">Consequential actions require approval before execution.</p></article>)}</div></section>
  <section className="mb-9"><Header title="AI Recommendations" subtitle="Highest priority recommendations" /><div className="grid gap-3 lg:grid-cols-3">{[['Investigate rising customer acquisition costs', 'High', 'CAC +8.8% over 60 days'], ['Increase investment in high-performing campaigns', 'Medium', 'Google Ads ROAS 4.8 outperforming average'], ['Improve retention for high-value customer segments', 'High', 'LTV — avg, retention programs underfunded']].map(item => <article key={item[0]} className="rounded-xl border border-border bg-card p-4 shadow-sm"><div className="flex justify-between gap-2"><Badge kind="purple"><Sparkles size={10} />AI Recommended</Badge><Badge kind={item[1] === 'High' ? 'red' : 'amber'}>{item[1]} priority</Badge></div><h3 className="mt-3 text-sm font-bold">{item[0]}</h3><p className="mt-2 text-xs text-muted-foreground">Reason: {item[2]}</p><div className="mt-4 flex gap-2"><Button>Review</Button><Button>Create Task</Button></div></article>)}</div></section>
  <section className="mb-9"><Header title="Priority AI Tasks" action="View AI Tasks" /><div className="overflow-x-auto rounded-xl border border-border bg-card"><table className="min-w-[850px] w-full text-left text-xs"><thead className="bg-card text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Task', 'Priority', 'Status', 'Owner', 'Source', 'Due', 'AI Action'].map(x => <th key={x} className="px-4 py-3">{x}</th>)}</tr></thead><tbody>{[['Audit Meta Ads campaign performance', 'High', 'Pending Approval', '—', 'AI Recommendation', 'Today'], ['Analyze high-LTV customer segment', 'Medium', 'Suggested', '—', 'AI Insight', '—'], ['Review advertising budget allocation', 'High', 'In Progress', 'Marketing', 'AI Decision', 'Tomorrow'], ['Investigate CAC increase', 'High', 'Suggested', '—', 'AI Recommendation', '—']].map(row => <tr key={row[0]} className="border-t border-border"><td className="px-4 py-3 font-semibold">{row[0]}</td><td className="px-4 py-3"><Badge kind={row[1] === 'High' ? 'red' : 'amber'}>{row[1]}</Badge></td><td className="px-4 py-3"><Badge kind={row[2] === 'In Progress' ? 'blue' : 'slate'}>{row[2]}</Badge></td>{row.slice(3).map((cell, i) => <td key={`${row[0]}-${i}`} className="px-4 py-3 text-muted-foreground">{cell}{i === 3 && cell !== '—' ? '' : null}</td>)}<td className="px-4 py-3"><button className="font-bold text-foreground">{row[2] === 'In Progress' ? '—' : 'Execute'}</button></td></tr>)}</tbody></table></div></section>
  <section className="mb-9 grid gap-4 xl:grid-cols-3"><article className="rounded-xl border border-border bg-card p-5"><Header title="Business Outlook" /><Badge kind="purple"><Sparkles size={10} />AI Forecast</Badge><p className="mt-4 text-xs text-muted-foreground">Revenue forecast · next 30d</p><p className="text-3xl font-bold">—</p><p className="text-xs text-muted-foreground">Confidence range: —–—</p><p className="mt-3 text-sm text-muted-foreground">Revenue is projected to continue growing over the next 30 days.</p><Sparkline color="var(--chart-2)" /><p className="mt-2 text-[11px] text-muted-foreground">Based on 90 days historical data. Estimated.</p></article><article className="rounded-xl border border-border bg-card p-5"><Header title="Important Trends" /><div className="space-y-3">{[['Revenue growth', '+14.8%', 'green'], ['Customer acquisition', '+11.4%', 'green'], ['Advertising ROAS', '-14%', 'red'], ['CAC', '+8.8%', 'amber']].map(row => <div key={row[0]} className="flex justify-between border-b border-border pb-2 text-sm"><span className="font-semibold">{row[0]}</span><strong className={`text-${row[2] === 'red' ? 'rose' : row[2] === 'amber' ? 'amber' : 'emerald'}-700`}>{row[1]}</strong><span className="text-xs text-muted-foreground">30d</span></div>)}</div><button className="mt-4 text-xs font-bold text-foreground">Explore Trends</button></article><article className="rounded-xl border border-border bg-card p-5"><Header title="Executive Alerts" /><div className="space-y-3">{[['CRITICAL', 'Customer acquisition cost increased significantly.', 'red'], ['WARNING', 'Advertising efficiency declined 14%.', 'amber'], ['POSITIVE', 'Revenue growth exceeded the previous period.', 'green'], ['INFO', '7 data sources connected and healthy.', 'blue']].map(row => <div key={row[0]} className={`border-l-4 pl-3 text-sm ${row[2] === 'red' ? 'border-chart-5' : row[2] === 'amber' ? 'border-chart-1' : row[2] === 'green' ? 'border-chart-4' : 'border-border'}`}><strong className="text-[10px] tracking-wider">{row[0]}</strong><p className="mt-1 text-muted-foreground">{row[1]}</p></div>)}</div></article></section>
  <section className="mb-9 rounded-2xl bg-gradient-to-br from-[var(--primary)] via-primary to-primary p-6 text-foreground shadow-lg md:p-8"><div className="flex items-center gap-2"><Sparkles size={20} /><h2 className="text-2xl font-bold">Lulu AI Business Outlook</h2><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold">AI-generated</span></div><p className="mt-4 max-w-4xl text-base leading-7 text-foreground">The business is currently positioned for continued growth, but advertising efficiency and acquisition costs should be monitored closely. Revenue and customer metrics are moving positively, and high-performing acquisition channels present a near-term investment opportunity.</p><div className="mt-6 grid gap-4 md:grid-cols-3"><div><h3 className="font-bold">Growth Drivers</h3><p className="mt-2 text-sm text-foreground">Revenue momentum ↑ · Customer acquisition ↑ · Direct channel growth ↑</p></div><div><h3 className="font-bold">Main Risks</h3><p className="mt-2 text-sm text-foreground">Advertising ROAS decline · CAC increase</p></div><div><h3 className="font-bold">Recommended Focus</h3><p className="mt-2 text-sm text-foreground">Advertising budget reallocation · Retention investment</p></div></div></section>
  <section className="mb-9 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-primary p-5 text-foreground md:p-7"><div className="flex items-center gap-2"><Sparkles size={19} /><h2 className="text-xl font-bold">Ask Lulu AI</h2></div><p className="mt-1 text-sm text-foreground">Turn your business question into a clear next step.</p><div className="mt-5 flex items-center gap-2 rounded-xl bg-card p-2"><Search className="ml-2 text-muted-foreground" size={18} /><input value={query} onChange={e => {
              setQuery(e.target.value);
              setSent(false);
            }} onKeyDown={e => {
              if (e.key === 'Enter' && query.trim()) setSent(true);
            }} className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-muted-foreground outline-none" placeholder="Ask Lulu AI about your business..." aria-label="Ask Lulu AI about your business" /><button onClick={() => query.trim() && setSent(true)} className="rounded-lg bg-primary p-3 text-primary-foreground" aria-label="Send question"><Send size={16} /></button></div><div className="mt-4 flex flex-wrap gap-2">{questions.map(q => <button key={q} onClick={() => {
              setQuery(q);
              setSent(false);
            }} className="rounded-full border border-border bg-secondary px-3 py-2 text-xs hover:bg-secondary">{q}</button>)}</div>{sent ? <div className="mt-5 rounded-xl bg-secondary p-4 text-sm"><Sparkles className="mr-2 inline" size={14} />Lulu is analyzing your connected data…</div> : <p className="mt-5 text-center text-xs text-foreground">Ask a question to see an evidence-backed response here.</p>}</section>
  <section className="mb-9 rounded-xl border border-border bg-card p-5 shadow-sm"><Header title="Data Coverage" /><div className="grid gap-4 md:grid-cols-4"><div><p className="text-xs text-muted-foreground">Connected sources</p><p className="text-xl font-bold">7</p></div><div><p className="text-xs text-muted-foreground">Data freshness</p><p className="text-sm font-bold text-chart-4">Fresh · updated 8 min ago</p></div><div><p className="text-xs text-muted-foreground">Coverage</p><p className="text-xl font-bold">—</p></div><div><p className="text-xs text-muted-foreground">Sync status</p><p className="text-sm font-bold text-chart-4">● All synced</p></div></div><p className="mt-4 text-xs text-chart-1">Missing: LinkedIn Ads, TikTok Ads not connected · <button className="font-bold underline">Connect</button></p><div className="mt-4 flex flex-wrap gap-2">{['Shopify', 'Google Analytics', 'Google Ads', 'Meta Ads', 'CRM', 'Finance System', 'LinkedIn Ads'].map((source, i) => <span key={source} className={`rounded-full border px-3 py-1 text-xs ${i === 6 ? 'border-border bg-card text-muted-foreground' : 'border-border bg-secondary text-foreground'}`}>{source}</span>)}</div></section>
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
  "label": "Website & Commerce",
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
    "id": "sparklingly-moon-5114",
    "label": "SEO"
  }, {
    "id": "zealously-path-4224",
    "label": "GEO"
  }, {
    "id": "sunny-house-9595",
    "label": "AEO"
  }, {
    "id": "daring-brook-9034",
    "label": "Reviews"
  }, {
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
          <span data-lulu-section-soon={section.label !== "Website & Commerce" && section.label !== "Settings" ? "true" : undefined}>{section.label}</span>
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
