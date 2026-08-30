import { useState } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Brain, Check, ChevronDown, ChevronRight, CircleHelp, Clock3, Command, Database, Gauge, Layers3, Lightbulb, LineChart, Menu, MessageSquare, MoreHorizontal, RefreshCw, Search, Send, Settings2, ShieldCheck, Sparkles, Target, TrendingUp, Users, WalletCards, X, Zap } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type Tone = 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'slate';
type Metric = {
  name: string;
  value: string;
  change: string;
  tone: Tone;
  note: string;
  icon: typeof Activity;
};
type Change = {
  name: string;
  previous: string;
  current: string;
  change: string;
  tone: Tone;
  impact: string;
  source: string;
};
type Detected = {
  title: string;
  impact: string;
  confidence: number;
  time: string;
  sources: string[];
  tone: Tone;
};
type Task = {
  task: string;
  source: string;
  priority: string;
  status: string;
  owner: string;
  due: string;
  ai: boolean;
};
const metrics: Metric[] = [];
const changes: Change[] = [];
const detected: Detected[] = [];
const tasks: Task[] = [];
const toneClass: Record<Tone, string> = {
  green: 'text-foreground bg-secondary border-border',
  amber: 'text-foreground bg-secondary border-border',
  red: 'text-chart-5 bg-chart-5/10 border-chart-5/30',
  blue: 'text-foreground bg-chart-3/10 border-chart-3/30',
  purple: 'text-chart-2 bg-chart-2/10 border-chart-2/30',
  slate: 'text-muted-foreground bg-card border-border'
};
const Sparkline = ({
  color = 'var(--chart-3)'
}: {
  color?: string;
}) => <svg viewBox="0 0 120 34" role="img" aria-label="Trend sparkline" className="h-9 w-28">
    <path d="M2 27 C14 26, 17 20, 28 22 S42 12, 52 16 S66 13, 75 17 S91 7, 101 11 S111 5, 118 7" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>;
const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  action
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: string;
}) => <div className="mb-4 flex items-end justify-between gap-4">
    <div>
      {eyebrow && <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-foreground">{eyebrow}</p>}
      <h2 className="text-[19px] font-bold tracking-tight text-foreground">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
    {action && <button className="hidden items-center gap-1 text-sm font-semibold text-foreground hover:text-foreground sm:flex">{action}<ChevronRight size={15} /></button>}
  </div>;
export const LuluIntelligenceOverview = () => {
  const [navOpen, setNavOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'ready' | 'sent'>('ready');
  const { items: insightRecords, loading: insightsLoading, error: insightsError, refresh: refreshInsights } = useLiveRecords('ai_insights');
  const getInsightField = (record: typeof insightRecords[number], key: string) => String((record as unknown as Record<string, unknown>)[key] ?? record.data?.[key] ?? '');
  const liveDetected: Detected[] = insightRecords.map(record => ({ title: getInsightField(record, 'title') || getInsightField(record, 'name') || 'Intelligence signal', impact: getInsightField(record, 'impact') || 'Observed', confidence: Number(getInsightField(record, 'confidence')) || 0, time: getInsightField(record, 'time') || record.updatedAt || '—', sources: getInsightField(record, 'source') ? [getInsightField(record, 'source')] : ['Workspace data'], tone: ['green', 'amber', 'red', 'blue', 'purple', 'slate'].includes(getInsightField(record, 'tone')) ? getInsightField(record, 'tone') as Tone : 'slate' }));
  if (!insightsLoading && !insightsError) return <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10"><div className="mx-auto max-w-6xl"><header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs uppercase tracking-[.18em] text-muted-foreground">Intelligence / Overview</p><h1 className="mt-2 text-3xl font-bold">Intelligence Overview</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Verified intelligence records from the connected workspace. Scores, changes and recommendations appear only when returned by the backend.</p></div><button type="button" onClick={() => void refreshInsights()} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-secondary"><RefreshCw size={15} /> Refresh</button></header>{liveDetected.length === 0 ? <section className="rounded-2xl border border-dashed border-border bg-card p-10 text-center"><Brain className="mx-auto mb-4 text-muted-foreground" size={30} /><h2 className="text-xl font-semibold">No verified intelligence insights yet</h2><p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">Refresh after connected workspace data has been analyzed. No health score, trend or recommendation is inferred without a verified record.</p></section> : <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{liveDetected.map(item => <article key={item.title} className="rounded-2xl border border-border bg-card p-5"><div className="flex items-start justify-between gap-3"><span className="rounded-full bg-secondary px-2 py-1 text-xs font-semibold">{item.impact}</span><span className="text-xs text-muted-foreground">{item.time}</span></div><h2 className="mt-4 text-lg font-semibold">{item.title}</h2><p className="mt-3 text-sm text-muted-foreground">Confidence: {item.confidence}%</p><p className="mt-2 text-xs text-muted-foreground">Sources: {item.sources.join(', ')}</p></article>)}</section>}</div></main>;
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
      <aside className={`${mobileMenu ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 flex w-[248px] flex-col bg-[var(--sidebar)] text-foreground transition-transform lg:translate-x-0`}>
        <div className="flex h-[72px] items-center border-b border-border px-6"><div className="mr-3 flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles size={17} /></div><span className="text-lg font-bold tracking-tight text-foreground">LULU<span className="text-foreground">AI</span></span><button onClick={() => setMobileMenu(false)} className="ml-auto lg:hidden" aria-label="Close navigation"><X size={19} /></button></div>
        <div className="flex items-center gap-3 border-b border-border px-5 py-4"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary text-xs font-bold text-primary-foreground">AC</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-foreground">Connected workspace</p><p className="text-xs text-muted-foreground">Enterprise workspace</p></div><ChevronDown size={15} className="ml-auto text-muted-foreground" /></div>
        <LuluSectionNavigation activeId="serene-cloud-7079" />
        <div className="border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-secondary hover:text-foreground"><Settings2 size={17} />Settings</button><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-secondary hover:text-foreground"><CircleHelp size={17} />Help center</button></div>
      </aside>

      <main className="min-w-0 lg:ml-[248px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border bg-secondary px-4 backdrop-blur md:px-8"><button onClick={() => setMobileMenu(true)} className="mr-3 text-foreground lg:hidden" aria-label="Open navigation"><Menu size={21} /></button><div className="flex items-center gap-2 text-sm text-muted-foreground"><span>Intelligence</span><ChevronRight size={14} /><strong className="text-foreground">Overview</strong></div><div className="flex items-center gap-2"><button className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-card sm:flex">Last 30 Days <ChevronDown size={14} /></button><button className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-card md:flex">Compare <ChevronDown size={14} /></button><button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary"><MessageSquare size={14} /> <span className="hidden sm:inline">Ask Lulu AI</span></button><button className="rounded-lg border border-border p-2 text-foreground hover:bg-card" aria-label="Refresh data"><RefreshCw size={15} /></button><button className="rounded-lg p-2 text-foreground hover:bg-secondary" aria-label="Notifications"><Bell size={17} /></button></div></header>
        <div id="overview" className="mx-auto max-w-[1500px] px-4 py-7 md:px-8 lg:px-10">{insightsError && <div role="alert" className="mb-5 rounded-lg border border-chart-5/30 bg-chart-5/10 px-4 py-3 text-sm text-chart-5">Intelligence insights could not be loaded. Check AI insight records and try again.</div>}{!insightsLoading && !insightsError && liveDetected.length === 0 && <div className="mb-5 rounded-lg border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground">No intelligence insights are available yet.</div>}
          <div className="mb-7"><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-foreground">Business operating system</p><h1 className="text-3xl font-bold tracking-[-0.04em] text-foreground md:text-[38px]">Intelligence Overview</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">Understand what is happening across your business and discover what Lulu AI recommends you do next.</p></div>

          <section className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-border bg-gradient-to-r from-white via-white to-secondary/70 p-5 shadow-sm md:flex-row md:items-center md:p-6" aria-labelledby="status-title"><div className="flex gap-4"><div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground"><Brain size={20} /></div><div><div className="flex flex-wrap items-center gap-2"><h2 id="status-title" className="font-bold text-foreground">Lulu AI Intelligence</h2><span className="flex items-center gap-1.5 rounded-full bg-chart-4/10 px-2 py-1 text-[11px] font-bold text-chart-4"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-chart-4" />Monitoring your business</span></div><p className="mt-1 max-w-xl text-sm text-muted-foreground">Analyzing connected business data and identifying important changes, opportunities and risks.</p><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-md border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground">Last analyzed 8 minutes ago</span><span className="rounded-md border border-chart-4/30 bg-chart-4/10 px-2.5 py-1 text-[11px] font-medium text-chart-4">Data fresh</span><span className="rounded-md border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground">No live data sources</span><span className="rounded-md border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground">— coverage</span></div></div></div><div className="flex items-center gap-3 self-end md:self-center"><div className="text-right"><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Live activity</p><p className="text-xs text-muted-foreground">7 signals this hour</p></div><Sparkline color="var(--chart-2)" /></div></section>

          <section className="mb-9"><SectionHeader title="Business Intelligence Snapshot" subtitle="A live pulse across the areas that matter most." action="View full intelligence" /><div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">{metrics.map(metric => {
              const Icon = metric.icon;
              return <article key={metric.name} className="group rounded-xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-border hover:shadow-md"><div className="flex items-center justify-between"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-muted-foreground"><Icon size={14} /></span><span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${toneClass[metric.tone]}`}>{metric.note}</span></div><p className="mt-4 text-[11px] font-medium text-muted-foreground">{metric.name}</p><p className="mt-1 whitespace-nowrap text-xl font-bold tracking-tight text-foreground">{metric.value}</p><div className="mt-2 flex items-center justify-between"><span className={`flex items-center gap-0.5 text-xs font-bold ${metric.tone === 'amber' ? 'text-chart-1' : 'text-foreground'}`}><ArrowUpRight size={13} />{metric.change}</span><a href="#details" className="text-[10px] font-semibold text-foreground opacity-0 transition group-hover:opacity-100">View</a></div></article>;
            })}</div></section>

          <section className="mb-9" id="details"><SectionHeader title="What Changed" subtitle="Lulu AI identifies meaningful business changes." action="View all changes" /><div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"><div className="hidden grid-cols-[1.4fr_1fr_.6fr_.8fr_.8fr_.7fr] gap-4 border-b border-border bg-card/70 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground md:grid"><span>Metric</span><span>Previous → Current</span><span>Change</span><span>Period</span><span>Impact / Source</span><span /></div>{changes.map(item => <div key={item.name} className="grid gap-2 border-b border-border px-5 py-4 last:border-0 md:grid-cols-[1.4fr_1fr_.6fr_.8fr_.8fr_.7fr] md:items-center md:gap-4"><div className="font-semibold text-foreground">{item.name}</div><div className="text-sm text-muted-foreground">{item.previous} <span className="mx-1 text-foreground">→</span><strong className="text-foreground">{item.current}</strong></div><div className={`flex items-center gap-1 text-sm font-bold ${item.tone === 'red' ? 'text-chart-5' : item.tone === 'amber' ? 'text-chart-1' : 'text-foreground'}`}>{item.tone === 'red' ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}{item.change}</div><div className="text-xs text-muted-foreground">Last 30 days</div><div className="flex items-center gap-1.5"><span className={`rounded-full border px-2 py-1 text-[10px] font-bold ${toneClass[item.tone]}`}>{item.impact}</span><span className="text-[10px] text-muted-foreground">{item.source}</span></div><a href="#ai" className="text-xs font-semibold text-foreground hover:underline">View Analysis</a></div>)}</div></section>

          <section className="mb-9"><SectionHeader eyebrow="Signals" title="AI-Detected Changes" subtitle="Signals found across your connected business data." /><div className="grid gap-4 lg:grid-cols-3">{(insightsLoading ? [] : liveDetected).map(item => <article key={item.title} className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-start justify-between"><span className="flex items-center gap-1.5 rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-foreground"><Sparkles size={12} />AI Detected</span><span className="text-xs text-muted-foreground">{item.time}</span></div><h3 className="mt-4 font-bold text-foreground">{item.title}</h3><div className="mt-4 flex items-center justify-between text-xs"><span className={`rounded-full border px-2 py-1 font-bold ${toneClass[item.tone]}`}>{item.impact} impact</span><span className="text-muted-foreground">{item.confidence}% confidence</span></div><div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary"><div className={`h-full rounded-full ${item.tone === 'red' ? 'bg-destructive' : item.tone === 'amber' ? 'bg-chart-1' : 'bg-primary'}`} style={{
                  width: `${item.confidence}%`
                }} /></div><div className="mt-4 flex items-center justify-between"><div className="flex flex-wrap gap-1.5">{item.sources.map(source => <span key={source} className="rounded bg-secondary px-2 py-1 text-[10px] text-muted-foreground">{source}</span>)}</div><button className="text-xs font-bold text-foreground">View</button></div></article>)}</div></section>

          <section id="health" className="mb-9 grid gap-4 lg:grid-cols-2"><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><SectionHeader title="Business Health" subtitle="A balanced read of business momentum." /><div className="flex items-center gap-6"><div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full" style={{
                background: 'conic-gradient(var(--primary) 0 82%, var(--secondary) 82% 100%)'
              }}><div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-card"><strong className="text-2xl text-foreground">82</strong><span className="text-[10px] text-muted-foreground">/ 100</span></div></div><div><span className="rounded-full border px-2 py-1 text-xs font-bold text-chart-4 bg-chart-4/10 border-chart-4/30">Healthy · +6</span><p className="mt-3 text-xs font-bold text-muted-foreground">Positive drivers</p><p className="mt-1 text-sm text-foreground">Revenue growth · Customer growth · Conversion improvement</p><p className="mt-3 text-xs font-bold text-muted-foreground">Watch</p><p className="mt-1 text-sm text-foreground">Advertising efficiency</p></div></div><button className="mt-5 text-sm font-bold text-foreground">View Business Health <ChevronRight className="inline" size={15} /></button></article><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><SectionHeader title="Growth Intelligence" subtitle="Momentum is building across the funnel." /><div className="flex items-end justify-between"><div><p className="text-4xl font-bold tracking-tight text-foreground">91<span className="text-base font-medium text-muted-foreground">/100</span></p><p className="mt-1 text-sm font-semibold text-chart-4">↑ Growth score</p></div><Sparkline color="var(--chart-4)" /></div><div className="mt-5 grid grid-cols-2 gap-y-3 text-sm"><span className="text-muted-foreground">Revenue growth <strong className="float-right text-chart-4">—</strong></span><span className="text-muted-foreground">Customer growth <strong className="float-right text-chart-4">—</strong></span><span className="text-muted-foreground">Lead growth <strong className="float-right text-chart-4">—</strong></span><span className="text-muted-foreground">Conversion growth <strong className="float-right text-chart-4">—</strong></span></div><p className="mt-5 rounded-lg bg-chart-4/10 px-3 py-2.5 text-sm font-semibold text-chart-4">Customer acquisition is accelerating ahead of forecast</p><button className="mt-4 text-sm font-bold text-foreground">View Growth <ChevronRight className="inline" size={15} /></button></article></section>

          <section className="mb-9 grid gap-4 lg:grid-cols-2"><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><SectionHeader title="Revenue Intelligence" /><div className="flex items-end justify-between"><div><p className="text-3xl font-bold text-foreground">—</p><p className="mt-1 text-sm font-bold text-chart-4">— growth</p></div><Sparkline /></div><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-muted-foreground">Drivers</p><p className="mt-1 font-semibold">Direct sales · Recurring revenue</p></div><div><p className="text-xs text-muted-foreground">Forecast</p><p className="mt-1 font-semibold">— <span className="text-xs font-normal text-muted-foreground">estimated</span></p></div></div><p className="mt-4 text-sm text-chart-1">Advertising efficiency decline may impact acquisition revenue.</p><button className="mt-4 text-sm font-bold text-foreground">View Revenue <ChevronRight className="inline" size={15} /></button></article><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><SectionHeader title="Customer Intelligence" /><div className="flex items-end justify-between"><div><p className="text-3xl font-bold text-foreground">4,821</p><p className="mt-1 text-sm font-bold text-chart-4">— customer growth</p></div><Users className="text-foreground" size={30} /></div><div className="mt-5 grid grid-cols-2 gap-4 text-sm"><div><span className="text-muted-foreground">Retention</span><strong className="float-right">—</strong></div><div><span className="text-muted-foreground">Churn</span><strong className="float-right">—</strong></div><div><span className="text-muted-foreground">LTV avg.</span><strong className="float-right">—</strong></div><div><span className="text-muted-foreground">New this period</span><strong className="float-right">492</strong></div></div><p className="mt-4 rounded-lg bg-secondary px-3 py-2.5 text-sm font-semibold text-foreground">Retention has stabilized after 2 months of decline</p><button className="mt-4 text-sm font-bold text-foreground">View Customers <ChevronRight className="inline" size={15} /></button></article></section>

          <section className="mb-9 grid gap-4 lg:grid-cols-2"><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><SectionHeader title="Sales Intelligence" /><p className="text-3xl font-bold">— <span className="text-sm font-medium text-muted-foreground">pipeline</span></p><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><span className="text-muted-foreground">Open opportunities <strong className="float-right text-foreground">127</strong></span><span className="text-muted-foreground">Conversion rate <strong className="float-right text-foreground">—</strong></span><span className="text-muted-foreground">Win rate <strong className="float-right text-foreground">—</strong></span><span className="text-muted-foreground">Avg deal <strong className="float-right text-foreground">—</strong></span><span className="text-muted-foreground">Velocity <strong className="float-right text-foreground">18 days</strong></span></div><p className="mt-5 rounded-lg bg-chart-4/10 px-3 py-2.5 text-sm font-semibold text-chart-4">Pipeline value increased — vs previous period</p><button className="mt-4 text-sm font-bold text-foreground">View Sales <ChevronRight className="inline" size={15} /></button></article><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><SectionHeader title="Marketing Intelligence" /><div className="flex items-center justify-between"><div><p className="text-3xl font-bold">84<span className="text-sm font-medium text-muted-foreground">/100</span></p><p className="mt-1 text-sm font-bold text-chart-4">Good efficiency</p></div><BarChart3 className="text-foreground" size={30} /></div><div className="mt-5 grid grid-cols-2 gap-y-3 text-sm"><span className="text-muted-foreground">Lead generation <strong className="float-right text-chart-4">—</strong></span><span className="text-muted-foreground">Conversion <strong className="float-right text-chart-4">—</strong></span><span className="text-muted-foreground">SEO <strong className="float-right text-chart-4">Trending up</strong></span><span className="text-muted-foreground">GEO / AEO <strong className="float-right">Stable / Improving</strong></span></div><button className="mt-5 text-sm font-bold text-foreground">View Marketing <ChevronRight className="inline" size={15} /></button></article></section>

          <section className="mb-9 rounded-xl border border-border bg-card p-5 shadow-sm"><SectionHeader title="Advertising Intelligence" subtitle="Spend and efficiency across paid channels." /><div className="grid grid-cols-2 gap-5 md:grid-cols-5"><div><p className="text-xs text-muted-foreground">Spend</p><p className="mt-1 text-xl font-bold">—</p></div><div><p className="text-xs text-muted-foreground">Revenue</p><p className="mt-1 text-xl font-bold">—</p></div><div><p className="text-xs text-muted-foreground">ROAS</p><p className="mt-1 text-xl font-bold text-chart-5">3.6 <span className="text-xs font-medium">from 4.2</span></p></div><div><p className="text-xs text-muted-foreground">CPA</p><p className="mt-1 text-xl font-bold">—</p></div><div><p className="text-xs text-muted-foreground">Conversions</p><p className="mt-1 text-xl font-bold">492</p></div></div><div className="mt-5 grid gap-3 md:grid-cols-3"><div className="rounded-lg bg-secondary p-3 text-sm"><span className="font-bold text-foreground">Best platform</span><p className="mt-1 text-foreground">Google Ads · ROAS 4.8</p></div><div className="rounded-lg bg-chart-5/10 p-3 text-sm"><span className="font-bold text-chart-5">Weakest campaign</span><p className="mt-1 text-chart-5">Meta Remarketing · ROAS 2.1</p></div><div className="rounded-lg bg-secondary p-3 text-sm text-foreground"><span className="font-bold">AI opportunity</span><p className="mt-1">Reallocating — from Meta to Google Search could improve ROAS by ~0.4.</p></div></div><button className="mt-5 text-sm font-bold text-foreground">View Advertising <ChevronRight className="inline" size={15} /></button></section>

          <section className="mb-9 grid gap-4 lg:grid-cols-2"><div><SectionHeader eyebrow="Prioritized by Lulu" title="Opportunities" /><div className="space-y-3">{['Improve high-intent product visibility', 'Expand high-LTV customer segment', 'Optimize advertising budget allocation'].map((title, i) => <article key={title} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-border text-sm font-bold text-foreground">{[94, 88, 82][i]}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-foreground">AI Detected</span><span className="text-[10px] text-muted-foreground">Confidence {[89, 85, 91][i]}%</span></div><h3 className="mt-1 text-sm font-bold text-foreground">{title}</h3><p className="mt-1 text-xs text-muted-foreground">Potential: <strong className="text-foreground">{i === 2 ? 'Medium' : 'High'}</strong> · {['SEO / Advertising', 'CRM', 'Advertising'][i]}</p></div><button className="text-xs font-bold text-foreground">View</button></article>)}</div></div><div><SectionHeader eyebrow="Needs attention" title="Risks" /><div className="space-y-3">{['Customer acquisition cost increasing', 'Advertising ROAS declining', 'Margin compression detected'].map((title, i) => <article key={title} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chart-5/10 text-chart-5"><AlertTriangle size={18} /></div><div className="min-w-0 flex-1"><h3 className="text-sm font-bold text-foreground">{title}</h3><p className="mt-1 text-xs text-muted-foreground">Risk score: <strong className="text-chart-5">{[91, 87, 74][i]}</strong> · Severity: <strong>{i === 2 ? 'Medium' : 'High'}</strong></p></div><button className="text-xs font-bold text-foreground">Investigate</button></article>)}</div></div></section>

          <section id="ai" className="mb-9"><SectionHeader eyebrow="Your AI copilot" title="AI Insights" subtitle="Evidence-backed interpretations, not just metrics." /><div className="grid gap-4 lg:grid-cols-3">{['Advertising efficiency is declining despite stable conversion volume', 'Customer acquisition is accelerating beyond forecast', 'Revenue growth is increasingly driven by direct channels'].map((title, i) => <article key={title} className="rounded-xl border border-border bg-card p-5 shadow-sm"><span className="flex w-fit items-center gap-1.5 rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-foreground"><Sparkles size={12} />AI-generated</span><h3 className="mt-4 text-sm font-bold leading-5 text-foreground">“{title}”</h3><p className="mt-3 text-xs text-muted-foreground"><strong>Evidence:</strong> {['ROAS — while spend +8%', '492 new customers vs 410 forecast', 'Direct revenue share increased from 34% to 41%'][i]}</p><div className="mt-4 flex items-center justify-between text-xs"><span className={`rounded-full border px-2 py-1 font-bold ${toneClass[i === 2 ? 'amber' : 'green']}`}>{i === 2 ? 'Medium' : 'High'} impact</span><span className="text-muted-foreground">Confidence {[91, 94, 87][i]}%</span></div><button className="mt-4 text-xs font-bold text-foreground">View Insight <ChevronRight className="inline" size={14} /></button></article>)}</div></section>

          <section className="mb-9 grid gap-4 lg:grid-cols-2"><div><SectionHeader title="AI Recommendations" /><div className="space-y-3">{['Review declining advertising efficiency', 'Increase investment in high-performing campaigns', 'Investigate customer acquisition cost increase'].map((title, i) => <article key={title} className="rounded-xl border border-border bg-card p-4 shadow-sm"><div className="flex items-start justify-between"><h3 className="text-sm font-bold">{title}</h3><span className={`rounded-full border px-2 py-1 text-[10px] font-bold ${toneClass[i === 1 ? 'amber' : 'red']}`}>Priority: {i === 1 ? 'Medium' : 'High'}</span></div><p className="mt-2 text-xs text-muted-foreground">{['ROAS declined —, impacting CAC', 'Google Ads showing ROAS 4.8', 'CAC up 8% over 60 days'][i]}</p><div className="mt-3 flex gap-2"><button className="rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold">Review</button><button className="rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold">Create Task</button>{i === 0 && <button className="rounded-md bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground">Execute with AI</button>}</div></article>)}</div></div><div><SectionHeader title="AI Tasks" action="View all tasks" /><div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"><div className="divide-y divide-border">{tasks.map(task => <div key={task.task} className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-semibold">{task.task}</h3><p className="mt-1 text-xs text-muted-foreground">{task.source} · Owner: {task.owner} · Due: {task.due}</p></div><span className={`whitespace-nowrap rounded-full border px-2 py-1 text-[10px] font-bold ${task.priority === 'High' ? toneClass.red : toneClass.amber}`}>{task.priority}</span></div><div className="mt-3 flex items-center justify-between"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${task.status === 'In Progress' ? 'bg-secondary text-foreground' : 'bg-secondary text-muted-foreground'}`}>{task.status}</span>{task.ai && <button className="text-xs font-bold text-foreground">Execute</button>}</div></div>)}</div></div></div></section>

          <section className="mb-9 grid gap-4 lg:grid-cols-[.85fr_1.15fr]"><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><SectionHeader title="Recent AI Activity" action="View AI Activity" /><ol className="space-y-4 border-l border-border pl-5">{['Analyzed advertising performance', 'Detected revenue growth opportunity', 'Generated customer retention recommendation', 'Updated AI recommendation'].map((item, i) => <li key={item} className="relative"><span className="absolute -left-[25px] top-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-border bg-chart-4 text-foreground"><Check size={10} /></span><p className="text-sm font-semibold">{item}</p><p className="mt-1 text-xs text-muted-foreground">{['Advertising', 'Revenue', 'CRM', 'Advertising'][i]} · {['8 min ago', '2h ago', '3h ago', '5h ago'][i]} · Completed</p></li>)}</ol></article><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><SectionHeader title="Important Trends" action="Explore Trends" /><div className="space-y-3">{['Revenue', 'Customers', 'Advertising ROAS', 'Conversion rate', 'CAC'].map((item, i) => <div key={item} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"><span className="text-sm font-semibold">{item}</span><span className={`flex items-center gap-1 text-sm font-bold ${i === 2 ? 'text-chart-5' : i === 4 ? 'text-foreground' : 'text-chart-4'}`}>{i === 2 ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}{['—', '+11.4%', '-14%', '+6.2%', '+8%'][i]}</span><span className="hidden text-xs text-muted-foreground sm:inline">{i === 4 ? '60d' : '30d'} · {i === 3 || i === 4 ? 'Medium' : 'High'} impact</span></div>)}</div></article></section>

          <section className="mb-9 grid gap-4 xl:grid-cols-3"><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><SectionHeader title="Detected Anomalies" /><div className="space-y-3">{['Advertising spend +22% spike', 'Conversion rate drop weekend'].map((item, i) => <div key={item} className="rounded-lg bg-chart-5/70 p-3"><div className="flex items-center justify-between"><span className="flex items-center gap-1 text-[10px] font-bold text-foreground"><Sparkles size={12} />AI Detected</span><span className="text-xs font-bold text-chart-5">{i ? 'Medium' : 'High'}</span></div><p className="mt-2 text-sm font-bold text-foreground">{item}</p><p className="mt-1 text-xs text-muted-foreground">Expected: {i ? '±—' : 'stable'} · Observed: {i ? '-8.4%' : 'spike'} · Confidence: {i ? '—' : '93%'}</p><button className="mt-2 text-xs font-bold text-foreground">Investigate</button></div>)}</div></article><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><SectionHeader title="Business Forecast" /><div className="flex items-end justify-between"><div><p className="text-xs text-muted-foreground">Revenue · next 30 days</p><p className="mt-1 text-3xl font-bold">—</p><p className="mt-1 text-xs text-muted-foreground">Confidence range: —–—</p></div><LineChart className="text-foreground" size={28} /></div><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div><span className="text-muted-foreground">Customer forecast</span><strong className="float-right">5,100</strong></div><div><span className="text-muted-foreground">Sales forecast</span><strong className="float-right">—</strong></div></div><div className="mt-5 h-16 rounded-lg bg-secondary p-2"><svg viewBox="0 0 300 50" className="h-full w-full"><path d="M0 41 C25 38, 45 29, 65 32 S105 15, 130 22 S167 10, 188 17 S230 5, 255 12 S280 7, 300 8 L300 31 C275 26, 255 34, 230 28 S190 34, 165 28 S125 38, 100 32 S55 46, 0 48Z" fill="var(--background)" /><path d="M0 41 C25 38, 45 29, 65 32 S105 15, 130 22 S167 10, 188 17 S230 5, 255 12 S280 7, 300 8" fill="none" stroke="var(--foreground)" strokeWidth="2" /></svg></div><p className="mt-3 text-[11px] text-muted-foreground">AI Forecast · based on 90 days historical data</p></article><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><SectionHeader title="KPI Highlights" action="Explore KPIs" /><div className="flex flex-wrap gap-2">{['Revenue —', 'Revenue Growth +14.8%', 'Customers 4,821', 'Retention 87%', 'Conversion 2.97%', 'CAC —', 'ROAS 3.6', 'Pipeline —'].map(kpi => <span key={kpi} className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground">{kpi}</span>)}</div></article></section>

          <section className="mb-9 grid gap-4 lg:grid-cols-2"><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><SectionHeader title="Intelligence Data Quality" /><div className="mb-5 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-chart-4/10 text-chart-4"><Check size={18} /></span><div><strong className="text-chart-4">Good</strong><p className="text-xs text-muted-foreground">All connected data is syncing normally.</p></div></div><div className="space-y-3 text-sm">{[['Data coverage', '94%'], ['Data freshness', 'Fresh · updated 8 min ago'], ['Connected sources', '7'], ['Missing data', '2 sources not connected'], ['Sync status', 'All synced']].map(row => <div key={row[0]} className="flex justify-between border-b border-border pb-2 last:border-0"><span className="text-muted-foreground">{row[0]}</span><strong className={row[1].includes('Missing') ? 'text-chart-1' : 'text-foreground'}>{row[1]}</strong></div>)}</div></article><article className="rounded-xl border border-border bg-card p-5 shadow-sm"><SectionHeader title="Intelligence Data Sources" action="Manage sources" /><div className="space-y-2">{[['Shopify', '8 min ago', '100%', 'Fresh'], ['Google Analytics', '15 min ago', '97%', 'Fresh'], ['Google Ads', '8 min ago', '100%', 'Fresh'], ['Meta Ads', '22 min ago', '95%', 'Fresh'], ['CRM', '1h ago', '89%', 'Good'], ['Finance System', '4h ago', '82%', 'Good'], ['LinkedIn Ads', '—', '—', 'Not connected']].map(source => <div key={source[0]} className="flex items-center gap-3 border-b border-border py-2 last:border-0"><span className={`h-2 w-2 rounded-full ${source[3] === 'Not connected' ? 'bg-muted' : 'bg-chart-4'}`} /><span className="w-28 text-xs font-semibold">{source[0]}</span><span className="flex-1 text-xs text-muted-foreground">{source[1]}</span><span className="text-xs text-muted-foreground">{source[2]}</span>{source[3] === 'Not connected' ? <button className="text-xs font-bold text-foreground">Connect</button> : <span className="text-[10px] text-chart-4">{source[3]}</span>}</div>)}</div></article></section>

          <section className="rounded-2xl bg-gradient-to-br from-[var(--chart-3)] via-primary to-primary p-5 text-foreground shadow-lg md:p-8"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-start"><div><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary"><Command size={16} /></span><h2 className="text-2xl font-bold tracking-tight">Ask Lulu AI</h2></div><p className="mt-2 text-sm text-foreground">Turn your business question into a clear next step.</p></div><span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs text-foreground"><Activity size={13} /> Intelligence command interface</span></div><div className="mt-6 flex items-center gap-2 rounded-xl bg-card p-2"><Search size={18} className="ml-2 text-muted-foreground" /><input value={query} onChange={e => {
              setQuery(e.target.value);
              setStatus('ready');
            }} onKeyDown={e => {
              if (e.key === 'Enter' && query.trim()) setStatus('sent');
            }} className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-muted-foreground outline-none" placeholder="Ask Lulu AI about your business..." aria-label="Ask Lulu AI about your business" /><button onClick={() => query.trim() && setStatus('sent')} className="rounded-lg bg-primary p-3 text-primary-foreground hover:bg-primary" aria-label="Send question"><Send size={16} /></button></div><div className="mt-4 flex flex-wrap gap-2">{['Why did revenue change?', 'What is hurting my business?', 'What should I focus on today?', 'Which opportunity has the highest impact?', 'Which risk should I address first?', 'Why are my ads underperforming?'].map(question => <button key={question} onClick={() => {
              setQuery(question);
              setStatus('ready');
            }} className="rounded-full border border-border bg-secondary px-3 py-2 text-xs text-foreground transition hover:bg-secondary">{question}</button>)}</div>{status === 'sent' ? <div className="mt-5 rounded-xl bg-secondary p-4 text-sm text-foreground"><div className="flex items-center gap-2 font-semibold"><Sparkles size={15} />Lulu is analyzing your connected data…</div><p className="mt-1 text-xs text-foreground">Your answer will be grounded in observed data, platform data, and clearly labeled AI inference.</p></div> : <p className="mt-5 text-center text-xs text-foreground">Ask a question to see an evidence-backed response here.</p>}</section>
          <footer className="flex flex-col gap-2 py-8 text-xs text-muted-foreground sm:flex-row sm:justify-between"><span>Data states are clearly labeled: Observed Data · Platform Data · AI Inference · Estimated</span><span className="flex items-center gap-1"><Clock3 size={13} />Last analyzed 8 minutes ago</span></footer>
        </div>
      </main>
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
