import { useMemo, useState } from 'react';
import { Activity, AlertCircle, AlertTriangle, ArrowDown, ArrowUp, BarChart3, Bell, Bot, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp, ClipboardCheck, Clock3, Download, ExternalLink, Eye, Filter, Gauge, Info, KeyRound, Layers3, Link2, ListFilter, Menu, MoreHorizontal, Play, Plus, RefreshCw, Search, Settings2, ShieldAlert, Sparkles, Target, TrendingDown, TrendingUp, Users, X, Zap } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type ModalType = 'analysis' | 'keyword' | 'competitor' | 'task' | 'ignore' | 'export' | null;
type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
interface Keyword {
  id: string;
  keyword: string;
  intent: string;
  position: string;
  prev: string;
  change: string;
  volume: string;
  difficulty: string;
  url: string;
  traffic: string;
  conv: string;
  status: string;
}
interface Issue {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
  pages: string;
  action: string;
}
interface PageRow {
  page: string;
  traffic: string;
  impressions: string;
  clicks?: string;
  ctr: string;
  position: string;
  conv: string;
  revenue: string;
}
const nav = [{
  label: 'Overview',
  icon: Gauge
}, {
  label: 'Strategy',
  icon: Target
}, {
  label: 'Marketing',
  icon: BarChart3,
  open: true
}, {
  label: 'SEO',
  icon: Search,
  child: true,
  active: true
}, {
  label: 'Content',
  icon: Layers3,
  child: true
}, {
  label: 'Campaigns',
  icon: Zap,
  child: true
}, {
  label: 'Sales',
  icon: TrendingUp
}, {
  label: 'Customers',
  icon: Users
}, {
  label: 'Reports',
  icon: ClipboardCheck
}];
const metrics: any[][] = [];
const keywords: Keyword[] = [];
const issues: Issue[] = [];
const pages: PageRow[] = [];
const health: any[][] = [];
const clusters: string[][] = [];
const intent: string[][] = [];
const gaps: any[][] = [];
const recommendations: any[][] = [];
function tone(value: string) {
  return value === 'Critical' || value === 'red' ? 'text-chart-5 bg-chart-5/10 border-chart-5/25' : value === 'High' || value === 'amber' ? 'text-chart-1 bg-chart-1/10 border-chart-1/25' : value === 'green' || value === 'Excellent' || value === 'Healthy' ? 'text-chart-4 bg-chart-4/10 border-chart-4/25' : 'text-foreground bg-secondary/10 border-border/25';
}
function SeverityBadge({
  value
}: {
  value: Severity;
}) {
  const Icon = value === 'Critical' ? ShieldAlert : value === 'High' ? AlertTriangle : value === 'Medium' ? Info : CircleHelp;
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold ${tone(value)}`}><Icon size={11} /><span>{value}</span></span>;
}
function SectionTitle({
  title,
  eyebrow,
  action
}: {
  title: string;
  eyebrow?: string;
  action?: string;
}) {
  return <div className="mb-4 flex items-end justify-between gap-3"><div><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-foreground/70">{eyebrow}</p><h2 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h2></div>{action && <button className="text-xs font-medium text-foreground transition hover:text-foreground">{action} <ChevronRight size={13} className="inline" /></button>}</div>;
}
function Ring({
  score,
  color = 'violet',
  small = false
}: {
  score: string;
  color?: string;
  small?: boolean;
}) {
  const size = small ? 42 : 56;
  return <div className={`relative shrink-0 ${small ? 'h-[42px] w-[42px]' : 'h-14 w-14'}`}><svg width={size} height={size} viewBox="0 0 64 64" className="-rotate-90"><circle cx="32" cy="32" r="26" fill="none" stroke="var(--muted-foreground)" strokeWidth="5" /><circle cx="32" cy="32" r="26" fill="none" stroke={color === 'amber' ? 'var(--chart-1)' : color === 'red' ? 'var(--chart-5)' : 'var(--chart-2)'} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${Number(score) * 1.63} 200`} /></svg><strong className="absolute inset-0 flex items-center justify-center text-xs text-foreground">{score}</strong></div>;
}
function MiniChart() {
  const points = '';
  return <div className="relative h-52 overflow-hidden rounded-xl border border-border bg-[var(--secondary)] p-3"><div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-3 py-5"><span className="border-t border-dashed border-border/50" /><span className="border-t border-dashed border-border/50" /><span className="border-t border-dashed border-border/50" /><span className="border-t border-dashed border-border/50" /></div><svg viewBox="0 0 608 110" preserveAspectRatio="none" className="relative h-full w-full"><polyline points={points} fill="none" stroke="var(--chart-2)" strokeWidth="2.5" /><polyline points="" fill="none" stroke="var(--chart-4)" strokeWidth="2" /><polyline points="" fill="none" stroke="var(--chart-3)" strokeWidth="1.8" /><polyline points="" fill="none" stroke="var(--chart-1)" strokeWidth="1.8" /></svg><div className="absolute bottom-2 left-4 right-4 flex justify-center text-[10px] text-muted-foreground"><span>Live time range appears after data is available.</span></div></div>;
}
export function LuluSeoWorkspace() {
  const { items: seoRecords, loading: seoLoading, error: seoError, refresh: refreshSeo } = useLiveRecords('marketing_seo_items');
  const [modal, setModal] = useState<ModalType>(null);
  const [query, setQuery] = useState('');
  const [metric, setMetric] = useState('Overview');
  const [selected, setSelected] = useState<string[]>([]);
  const [issueFilter, setIssueFilter] = useState('All');
  const filteredKeywords = useMemo(() => keywords.filter(item => item.keyword.toLowerCase().includes(query.toLowerCase()) || item.url.includes(query.toLowerCase())), [query]);
  if (seoLoading) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground">Loading live SEO data…</main>;
  if (seoError) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-destructive">{seoError}</main>;
  return <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10"><div className="mx-auto max-w-6xl"><header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs uppercase tracking-[.18em] text-muted-foreground">Website / SEO</p><h1 className="mt-2 text-3xl font-bold">SEO Workspace</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Verified SEO records from the connected workspace. Rankings, issues and recommendations appear only after the backend provides them.</p></div><button type="button" onClick={() => void refreshSeo()} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-secondary"><RefreshCw size={15} /> Refresh</button></header>{seoRecords.length === 0 ? <section className="rounded-2xl border border-dashed border-border bg-card p-10 text-center"><Search className="mx-auto mb-4 text-muted-foreground" size={28} /><h2 className="text-xl font-semibold">No verified SEO data yet</h2><p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">Connect a verified SEO or Search Console source, or add SEO records through the workspace API before reviewing keyword performance.</p></section> : <section className="overflow-hidden rounded-2xl border border-border bg-card"><div className="border-b border-border p-4"><label className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2"><Search size={15} className="text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search live SEO records" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Stage</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Updated</th></tr></thead><tbody className="divide-y divide-border">{seoRecords.filter(record => !query || `${record.name} ${record.description ?? ''} ${record.status}`.toLowerCase().includes(query.toLowerCase())).map(record => <tr key={record.id}><td className="px-4 py-3 font-medium">{record.name}</td><td className="px-4 py-3">{record.status}</td><td className="px-4 py-3 text-muted-foreground">{record.stage ?? '—'}</td><td className="max-w-md px-4 py-3 text-muted-foreground">{record.description ?? '—'}</td><td className="px-4 py-3 text-muted-foreground">{new Date(record.updatedAt).toLocaleString()}</td></tr>)}</tbody></table></div></section>}</div></main>;
  return <main className="min-h-screen bg-[var(--background)] text-foreground selection:bg-secondary/30">
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-[var(--card)]/95 px-5 backdrop-blur"><div className="flex items-center gap-4"><button className="rounded-lg p-2 text-foreground hover:bg-secondary lg:hidden" aria-label="Open navigation"><Menu size={19} /></button><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary shadow-lg shadow-black/40 text-primary-foreground"><Sparkles size={16} className="text-foreground" /></div><strong className="text-sm tracking-wide text-foreground">LULU <span className="font-normal text-muted-foreground">AI</span></strong></div><span className="hidden h-5 w-px bg-secondary sm:block" /><span className="hidden text-xs text-muted-foreground sm:block">Business Operating System</span></div><div className="flex items-center gap-3"><button className="rounded-lg p-2 text-foreground hover:bg-secondary" aria-label="Notifications"><Bell size={17} /></button><button className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 text-xs text-foreground hover:bg-secondary"><span className="grid h-6 w-6 place-items-center rounded-full bg-secondary/20 text-[10px] font-bold text-foreground">—</span><span className="hidden sm:block">Workspace member</span><ChevronDown size={13} /></button></div></header>
    <div className="flex"><aside className="hidden w-60 shrink-0 border-r border-border bg-[var(--sidebar)] px-3 py-5 lg:block"><p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Workspace</p><LuluSectionNavigation activeId="sparklingly-moon-5114" /><div className="mt-8 border-t border-border pt-5"><p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Workspace</p><button className="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary"><Settings2 size={16} /><span>Settings</span></button><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary"><CircleHelp size={16} /><span>Help center</span></button></div><div className="mt-10 rounded-xl border border-border/15 bg-gradient-to-br from-secondary/10 to-secondary/5 p-3"><div className="mb-2 flex items-center gap-2 text-foreground"><Bot size={15} /><span className="text-xs font-semibold">Lulu AI</span></div><p className="text-[11px] leading-5 text-muted-foreground">Your growth intelligence is ready.</p><button className="mt-3 text-[11px] font-semibold text-foreground hover:text-foreground" onClick={() => setModal('analysis')}>Run analysis <ArrowUp size={12} className="inline" /></button></div></aside>
    <section className="min-w-0 flex-1 px-4 py-6 sm:px-6 xl:px-8"><div className="mx-auto max-w-[1440px]"><div className="mb-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground"><span>Website</span><ChevronRight size={13} /><span className="text-foreground">SEO</span></div><h1 className="text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">SEO</h1><p className="mt-2 max-w-xl text-sm text-muted-foreground">Understand, monitor and improve your organic search performance with AI-powered SEO intelligence.</p></div><div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground"><Clock3 size={14} />Last 30 Days<ChevronDown size={12} /></button><button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-foreground"><Filter size={14} />Filter</button><button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-foreground"><Download size={14} />Export</button><button className="rounded-lg border border-border p-2 text-foreground"><RefreshCw size={15} /></button><button onClick={() => setModal('analysis')} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-lg shadow-black/30"><Play size={13} />Run SEO Analysis</button><button onClick={() => setModal('analysis')} className="inline-flex items-center gap-2 rounded-lg border border-border/25 bg-secondary/10 px-3 py-2 text-xs font-semibold text-foreground"><Bot size={14} />Ask Lulu AI</button></div></div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">{metrics.map(([label, value, delta, color]) => <article key={label} className="rounded-xl border border-border bg-secondary p-3.5"><div className="mb-3 flex items-center justify-between"><span className="text-[11px] text-muted-foreground">{label}</span>{label === 'SEO Health' ? <Activity size={14} className="text-foreground" /> : <TrendingUp size={14} className={color === 'green' ? 'text-chart-4' : color === 'blue' ? 'text-foreground' : 'text-foreground'} />}</div><div className="flex items-end gap-2">{label === 'SEO Health' ? <Ring score={value} color="amber" small /> : <strong className="text-xl tracking-tight text-foreground">{value}</strong>}<span className={`mb-0.5 text-[10px] font-semibold ${color === 'amber' ? 'text-chart-1' : color === 'green' ? 'text-chart-4' : color === 'blue' ? 'text-foreground' : 'text-foreground'}`}>{delta}</span></div></article>)}</div>
      <div className="mt-5 flex flex-col gap-3 md:flex-row"><label className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search keywords, pages, issues" className="h-10 w-full rounded-lg border border-border bg-secondary pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-border/60" /></label><div className="flex flex-wrap gap-2"><button className="filter-chip">Keyword Status <ChevronDown size={12} /></button><button className="filter-chip">Issue Type <ChevronDown size={12} /></button><button className="filter-chip">Page <ChevronDown size={12} /></button><button className="filter-chip">Intent <ChevronDown size={12} /></button><button className="filter-chip text-foreground">Saved Filters <ChevronDown size={12} /></button><button className="px-2 text-xs text-foreground hover:text-foreground">Clear</button></div></div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.85fr)_minmax(310px,1fr)]"><div className="min-w-0 space-y-6"><section><SectionTitle eyebrow="Organic performance" title="SEO Performance" action="View report" /><div className="rounded-xl border border-border bg-secondary p-4"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex gap-1 rounded-lg bg-primary/20 p-1">{['Overview', 'Traffic', 'Conversions', 'Visibility', 'Avg Position'].map(item => <button key={item} onClick={() => setMetric(item)} className={`rounded-md px-3 py-1.5 text-xs ${metric === item ? 'bg-secondary/20 text-foreground' : 'text-foreground hover:text-foreground'}`}>{item}</button>)}</div><label className="flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" className="accent-primary" /> Compare period</label></div><MiniChart /><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">{([] as string[][]).map(([label, value, color]) => <div key={label}><p className="text-[10px] text-muted-foreground">{label}</p><strong className={`text-sm ${color === 'green' ? 'text-chart-4' : color === 'amber' ? 'text-chart-1' : 'text-foreground'}`}>{value}</strong></div>)}</div></div></section>
        <section><SectionTitle eyebrow="Signal breakdown" title="SEO Health" action="View health report" /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{health.map(([name, score, status, count, trend, color]) => <article key={name} className="rounded-xl border border-border bg-secondary p-4"><div className="flex items-center gap-3"><Ring score={score} color={color} small /><div><h3 className="text-xs font-semibold text-foreground">{name}</h3><span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] ${tone(color)}`}>{status}</span></div></div><div className="mt-4 flex items-center justify-between text-[11px]"><span className={trend.includes('down') ? 'text-chart-5' : 'text-chart-4'}>{trend.includes('down') ? <ArrowDown size={12} className="mr-1 inline" /> : <ArrowUp size={12} className="mr-1 inline" />}{trend}</span><span className="text-muted-foreground">{count}</span></div><button className="mt-3 text-[11px] text-foreground hover:text-foreground">View details <ChevronRight size={12} className="inline" /></button></article>)}</div></section>
        <section><SectionTitle eyebrow="Search demand" title="Keyword Performance" action="View all keywords" /><div className="mb-3 flex flex-wrap gap-2">{([] as string[][]).map(([a, b]) => <span key={a} className="rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-[11px] text-muted-foreground">{a} <strong className={a === 'Improved' ? 'text-chart-4' : a === 'Declined' ? 'text-chart-5' : 'text-foreground'}>{b}</strong></span>)}</div>{selected.length > 0 && <div className="mb-2 flex items-center gap-3 rounded-lg border border-border/20 bg-secondary/10 px-3 py-2 text-xs text-foreground"><span>{selected.length} selected</span><button>Create Tasks</button><button>Change Status</button><button>Ignore</button><button>Export</button></div>}<div className="overflow-x-auto rounded-xl border border-border bg-secondary"><table className="w-full min-w-[930px] text-left text-[11px]"><thead className="border-b border-border bg-secondary text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['', 'Keyword', 'Intent', 'Position', 'Prev', 'Change', 'Volume', 'Difficulty', 'URL', 'Traffic', 'Conv', 'Status'].map((h, i) => <th key={h || 'check'} className="px-3 py-3">{i === 0 ? <input type="checkbox" className="accent-primary" /> : h}</th>)}</tr></thead><tbody>{filteredKeywords.map(row => <tr key={row.id} className="border-b border-border text-foreground hover:bg-secondary"><td className="px-3 py-3"><input type="checkbox" checked={selected.includes(row.id)} onChange={() => setSelected(selected.includes(row.id) ? selected.filter(x => x !== row.id) : [...selected, row.id])} className="accent-primary" /></td><td className="whitespace-nowrap px-3 py-3 font-semibold text-foreground">{row.keyword}</td><td className="px-3 py-3 text-muted-foreground">{row.intent}</td><td className="px-3 py-3 font-semibold text-foreground">{row.position}</td><td className="px-3 py-3 text-muted-foreground">{row.prev}</td><td className={`px-3 py-3 font-semibold ${row.change.startsWith('-') ? 'text-chart-5' : row.change === '0' ? 'text-muted-foreground' : 'text-foreground'}`}>{row.change === '0' ? '—' : row.change.startsWith('-') ? <ArrowDown size={12} className="inline" /> : <ArrowUp size={12} className="inline" />}{row.change !== '0' && Math.abs(Number(row.change))}</td><td className="px-3 py-3">{row.volume}</td><td className="px-3 py-3 text-muted-foreground">{row.difficulty}</td><td className="px-3 py-3 text-foreground">{row.url}</td><td className="px-3 py-3">{row.traffic}</td><td className="px-3 py-3">{row.conv}</td><td className="px-3 py-3"><span className={`whitespace-nowrap rounded-full border px-2 py-1 text-[10px] ${row.status === 'Declining' ? 'text-chart-5 bg-chart-5/10 border-chart-5/20' : row.status === 'Stable' ? 'text-muted-foreground bg-secondary border-border' : 'text-foreground bg-secondary/10 border-border/20'}`}>{row.status}</span></td></tr>)}</tbody></table><div className="flex items-center justify-between px-4 py-3 text-xs text-muted-foreground"><span>Showing {filteredKeywords.length} live keywords</span><div className="text-xs text-muted-foreground">Additional pages appear after live keyword data is available.</div></div></div></section>
        <section><SectionTitle eyebrow="Themes" title="Keyword Clusters" /><div className="overflow-x-auto rounded-xl border border-border bg-secondary"><table className="w-full min-w-[620px] text-left text-xs"><thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Topic', 'Keywords', 'Avg Position', 'Traffic', 'Conversions', 'Opportunity', ''].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead><tbody>{clusters.map(row => <tr key={row[0]} className="border-b border-border hover:bg-secondary"><td className="px-4 py-3 font-semibold text-foreground">{row[0]}</td><td className="px-4 py-3">{row[1]}</td><td className="px-4 py-3">{row[2]}</td><td className="px-4 py-3">{row[3]}</td><td className="px-4 py-3">{row[4]}</td><td className="px-4 py-3 text-foreground">{row[5]}</td><td className="px-4 py-3 text-right text-foreground">Open Cluster <ChevronRight size={12} className="inline" /></td></tr>)}</tbody></table></div></section>
        <section><SectionTitle eyebrow="Intent intelligence" title="Search Intent" /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{intent.map(row => <article key={row[0]} className="rounded-xl border border-border bg-secondary p-4"><div className="flex items-start justify-between"><h3 className="text-xs font-semibold text-foreground">{row[0]}</h3><span className="rounded bg-secondary/10 px-1.5 py-1 text-[9px] text-foreground">AI classified</span></div><strong className="mt-4 block text-xl text-foreground">{row[1]}</strong><p className="text-[10px] text-muted-foreground">keywords</p><div className="mt-4 flex justify-between text-[11px]"><span className="text-muted-foreground">Traffic <b className="text-foreground">{row[2]}</b></span><span className="text-muted-foreground">Conv <b className="text-foreground">{row[3]}</b></span></div></article>)}</div></section>
        <section><SectionTitle eyebrow="Landing pages" title="Top Organic Pages" /><div className="overflow-x-auto rounded-xl border border-border bg-secondary"><table className="w-full min-w-[760px] text-left text-xs"><thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Page', 'Organic Traffic', 'Impressions', 'Clicks', 'CTR', 'Avg Position', 'Conversions', 'Revenue'].map(h => <th key={h} className="px-3 py-3">{h}</th>)}</tr></thead><tbody>{pages.map(row => <tr key={row.page} className="border-b border-border hover:bg-secondary"><td className="px-3 py-3 font-semibold text-foreground">{row.page}</td><td className="px-3 py-3 text-foreground">{row.traffic}</td><td className="px-3 py-3">{row.impressions}</td><td className="px-3 py-3">{row.clicks}</td><td className="px-3 py-3">{row.ctr}</td><td className="px-3 py-3">{row.position}</td><td className="px-3 py-3 text-foreground">{row.conv}</td><td className="px-3 py-3">{row.revenue}</td></tr>)}</tbody></table></div></section>
        <section><SectionTitle eyebrow="Crawl & indexation" title="Technical SEO Issues" /><div className="mb-3 flex flex-wrap gap-2">{['Critical', 'High', 'Medium', 'Low', 'All'].map(item => <button key={item} onClick={() => setIssueFilter(item)} className={`rounded-full border px-3 py-1 text-[11px] ${issueFilter === item ? 'border-border/30 bg-secondary/15 text-foreground' : 'border-border text-foreground'}`}>{item}</button>)}<button className="filter-chip ml-auto">Status: Open <ChevronDown size={12} /></button></div><div className="divide-y divide-white/5 rounded-xl border border-border bg-secondary">{issues.filter(item => issueFilter === 'All' || item.severity === issueFilter).map(item => <div key={item.id} className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center"><SeverityBadge value={item.severity} /><div className="min-w-0 flex-1"><h3 className="text-xs font-semibold text-foreground">{item.title}</h3><p className="mt-1 text-[11px] text-muted-foreground">{item.detail} · {item.pages}</p></div><div className="flex gap-3 text-[11px]"><button className="text-foreground hover:text-foreground">View</button><button onClick={() => setModal(item.action.includes('Fix') ? 'analysis' : 'task')} className="font-semibold text-foreground hover:text-foreground">{item.action}</button></div></div>)}</div></section>
        <section><SectionTitle eyebrow="Content intelligence" title="Content SEO" action="View content workspace" /><div className="grid gap-3 md:grid-cols-3">{[['AI Automation Guide', 'Missing keyword coverage', 'Traffic declining', 'Optimize with AI'], ['Enterprise CRM Page', 'Search intent mismatch', 'Open', 'Optimize with AI'], ['Business Analytics Overview', 'Outdated content signals', 'Open', 'Create Content']].map(row => <article key={row[0]} className="rounded-xl border border-border bg-secondary p-4"><div className="flex items-center gap-2 text-foreground"><FileTextIcon /><h3 className="text-xs font-semibold text-foreground">{row[0]}</h3></div><p className="mt-3 text-xs text-muted-foreground">{row[1]}</p><p className="mt-1 text-[11px] text-foreground">{row[2]}</p><button className="mt-4 text-[11px] font-semibold text-foreground">{row[3]} <ChevronRight size={12} className="inline" /></button></article>)}</div><div className="mt-3 flex items-center justify-between rounded-xl border border-border/15 bg-secondary/10 px-4 py-3 text-xs"><span><strong className="text-foreground">Content Gaps</strong><span className="ml-2 text-muted-foreground">3 high-intent topics detected</span></span><button className="text-foreground">View Gaps <ChevronRight size={12} className="inline" /></button></div></section>
        <section><SectionTitle eyebrow="Competitive landscape" title="Competitor SEO" /><div className="overflow-x-auto rounded-xl border border-border bg-secondary"><table className="w-full min-w-[660px] text-left text-xs"><thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Competitor', 'Visibility', 'Ranking Keywords', 'Keyword Overlap', 'Est Traffic', 'Change', ''].map(h => <th key={h} className="px-3 py-3">{h}</th>)}</tr></thead><tbody>{[['competitor-a.com', '41.2%', '3,840', '612 shared', '72,400', 'up 2.4%'], ['competitor-b.com', '38.4%', '3,120', '484 shared', '58,200', 'stable'], ['competitor-c.com', '28.4%', '2,240', '312 shared', '42,100', 'down 1.2%']].map(row => <tr key={row[0]} className="border-b border-border"><td className="px-3 py-3 font-semibold text-foreground">{row[0]}</td>{row.slice(1).map((x, i) => <td key={x} className={`px-3 py-3 ${i === 4 ? x.startsWith('up') ? 'text-foreground' : x.startsWith('down') ? 'text-chart-5' : 'text-muted-foreground' : ''}`}>{x}</td>)}<td className="whitespace-nowrap px-3 py-3 text-right text-foreground">Analyze · Gaps</td></tr>)}</tbody></table></div><button onClick={() => setModal('competitor')} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border/25 px-3 py-2 text-xs font-semibold text-foreground"><Plus size={14} />Add Competitor</button></section>
        <section><SectionTitle eyebrow="Demand capture" title="SEO Content Gaps" /><div className="grid gap-3 sm:grid-cols-2">{gaps.map(row => <article key={row[0]} className="rounded-xl border border-border bg-secondary p-4"><div className="flex items-start justify-between"><div><h3 className="text-xs font-semibold text-foreground">{row[0]}</h3><p className="mt-1 text-[11px] text-muted-foreground">{row[1] || 'Untapped demand'}</p></div><span className={`rounded-full border px-2 py-1 text-[10px] ${row[3] === 'High' ? 'text-foreground bg-secondary/10 border-border/20' : 'text-foreground bg-secondary/10 border-border/20'}`}>{row[3]}</span></div><div className="mt-4 flex items-end justify-between"><div><p className="text-[10px] text-muted-foreground">Monthly volume</p><strong className="text-sm text-foreground">{row[2]}</strong></div><button className="text-[11px] text-foreground">{row[3] === 'High' ? 'Create Content' : 'View'} <ChevronRight size={12} className="inline" /></button></div></article>)}</div></section>
      </div>
      <aside className="min-w-0 space-y-6"><section className="overflow-hidden rounded-xl border border-border/20 bg-secondary"><div className="bg-gradient-to-r from-secondary/80 to-secondary/70 p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Bot size={18} className="text-foreground" /><h2 className="text-sm font-semibold text-foreground">Lulu AI SEO Insights</h2></div><span className="rounded-full bg-secondary px-2 py-1 text-[9px] font-semibold text-foreground">AI-generated</span></div><p className="mt-2 text-[11px] text-foreground/70">Updated 4 min ago</p></div><div className="divide-y divide-white/5">{[['Organic visibility increased 2.1pp', 'Driven by CRM and automation keyword clusters', 'Positive · Confidence High'], ['3 high-value pages losing rankings', 'Technical indexation issues likely cause', 'Critical · View'], ['Commercial keyword cluster shows strong growth potential', '5 keywords moving to page 1', 'High · View']].map(row => <article key={row[0]} className="p-4"><div className="mb-2 flex items-start gap-2"><Sparkles size={14} className="mt-0.5 shrink-0 text-foreground" /><h3 className="text-xs font-semibold leading-5 text-foreground">{row[0]}</h3></div><p className="pl-6 text-[11px] leading-5 text-muted-foreground">{row[1]}</p><div className="mt-3 flex items-center justify-between pl-6"><span className="text-[10px] text-foreground">{row[2]}</span><button className="text-[11px] text-foreground">View <ChevronRight size={11} className="inline" /></button></div></article>)}</div></section>
        <section><SectionTitle eyebrow="AI playbook" title="Lulu AI Recommendations" /><div className="space-y-3">{recommendations.map(row => <article key={row[0]} className="rounded-xl border border-border bg-secondary p-4"><div className="flex gap-2"><span className="mt-0.5 rounded bg-secondary/15 px-1.5 py-1 text-[9px] font-bold text-foreground">AI</span><div className="min-w-0"><h3 className="text-xs font-semibold text-foreground">{row[0]}</h3><p className="mt-1 text-[11px] text-muted-foreground">{row[1]}</p></div></div><div className="mt-3 flex items-center justify-between"><span className={`text-[10px] font-semibold ${row[2] === 'Critical' ? 'text-chart-5' : row[2] === 'High' ? 'text-foreground' : 'text-foreground'}`}>Priority {row[2]}</span><button onClick={() => setModal('task')} className="text-[10px] text-foreground hover:text-foreground">{row[3]}</button></div></article>)}</div></section>
        <section><SectionTitle eyebrow="Next best moves" title="SEO Opportunities" /><div className="space-y-2">{[['Page 2 Opportunity', 'automate business processes · pos 19', '92'], ['Content Gap', 'AI workflow automation · 8,400 monthly searches', '88'], ['Internal Linking', 'AI Automation cluster', '74'], ['Technical Fix', 'Structured data rich snippet eligibility', '71']].map(row => <div key={row[0]} className="flex items-center gap-3 rounded-lg border border-border bg-secondary p-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary/15 text-xs font-bold text-foreground">{row[2]}</div><div className="min-w-0 flex-1"><p className="text-[10px] text-foreground">{row[0]}</p><p className="truncate text-xs text-foreground">{row[1]}</p></div><button className="text-[10px] text-foreground">{row[0] === 'Content Gap' ? 'Create Content' : 'Create Task'}</button></div>)}</div></section>
        <section><SectionTitle eyebrow="Watchlist" title="SEO Risks" /><div className="space-y-2">{[['Organic traffic to /insights declined 18% in 30 days', 'High', '840 sessions/mo'], ['Critical indexation errors affecting 4 strategic pages', 'Critical', ''], ['Competitor A gained 2.4% visibility in core keyword clusters', 'Medium', '']].map(row => <article key={row[0]} className="rounded-lg border border-border bg-secondary p-3"><div className="flex gap-2"><AlertCircle size={14} className={row[1] === 'Critical' ? 'text-chart-5' : row[1] === 'High' ? 'text-foreground' : 'text-foreground'} /><div><p className="text-xs leading-5 text-foreground">{row[0]}</p><div className="mt-2 flex items-center justify-between text-[10px]"><span className={row[1] === 'Critical' ? 'text-chart-5' : 'text-foreground'}>{row[1]} severity</span><span className="text-muted-foreground">{row[2]}</span></div></div></div></article>)}</div></section>
        <section><SectionTitle eyebrow="Action queue" title="Recommended Actions" /><div className="rounded-xl border border-border bg-secondary p-3">{[['Fix critical indexation errors', 'Create Task · Apply AI'], ['Optimize declining insights page', 'Create Task · Apply AI'], ['Create content for top keyword gap', 'Create Content'], ['Improve internal linking automation cluster', 'Create Task']].map(row => <button key={row[0]} onClick={() => setModal('task')} className="flex w-full items-center gap-3 border-b border-border py-3 text-left last:border-0"><CheckCircle2 size={14} className="text-foreground" /><span className="flex-1 text-xs text-foreground">{row[0]}<small className="mt-1 block text-[10px] text-muted-foreground">{row[1]}</small></span><ChevronRight size={13} className="text-muted-foreground" /></button>)}</div></section></aside></div></div></section></div>
    {modal && <dialog open className="fixed inset-0 z-30 m-auto w-[min(520px,calc(100%-32px))] rounded-2xl border border-border/25 bg-[var(--card)] p-0 text-foreground shadow-2xl shadow-black/60"><div className="flex items-center justify-between border-b border-border p-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground">Lulu AI workspace</p><h2 className="mt-1 text-lg font-semibold text-foreground">{modal === 'analysis' ? 'Run SEO Analysis' : modal === 'keyword' ? 'Add Keyword' : modal === 'competitor' ? 'Add Competitor' : modal === 'export' ? 'Export SEO data' : modal === 'ignore' ? 'Ignore Issue' : 'Create SEO Task'}</h2></div><button onClick={() => setModal(null)} className="rounded-lg p-2 text-foreground hover:bg-secondary" aria-label="Close dialog"><X size={17} /></button></div><div className="space-y-4 p-5">{modal === 'analysis' ? <><p className="text-sm text-muted-foreground">Choose the intelligence layers Lulu should inspect.</p><div className="grid grid-cols-2 gap-2">{['Technical SEO', 'Keywords', 'Content', 'Search Visibility', 'Competitors', 'Opportunities'].map(x => <label key={x} className="flex items-center gap-2 rounded-lg border border-border p-3 text-xs"><input type="checkbox" defaultChecked className="accent-primary" />{x}</label>)}</div><div className="rounded-lg bg-primary/20 p-3 text-xs text-muted-foreground"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-chart-4" />Ready to analyze your connected search data.</div></> : modal === 'competitor' ? <Field label="Competitor domain" placeholder="competitor.com" /> : modal === 'keyword' ? <><Field label="Keyword" placeholder="e.g. AI revenue operations" /><Field label="Target URL" placeholder="/platform" /></> : modal === 'ignore' ? <Field label="Reason" placeholder="Tell us why this issue can be ignored" /> : <><Field label="Task name" placeholder="Resolve indexation errors" /><Field label="Description" placeholder="What should be done?" /><div className="grid grid-cols-2 gap-3"><Field label="Owner" placeholder="Assign owner" /><Field label="Due date" placeholder="Select date" /></div></>}<div className="flex justify-end gap-2 pt-2"><button onClick={() => setModal(null)} className="rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground">Cancel</button><button onClick={() => setModal(null)} className="rounded-lg bg-gradient-to-r from-primary to-primary px-4 py-2 text-xs font-semibold text-primary-foreground">{modal === 'analysis' ? 'Start Analysis' : modal === 'competitor' ? 'Add Competitor' : modal === 'keyword' ? 'Add Keyword' : 'Create Task'}</button></div></div></dialog>}
  </main>;
}
function Field({
  label,
  placeholder
}: {
  label: string;
  placeholder: string;
}) {
  return <label className="block"><span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span><input placeholder={placeholder} className="w-full rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-border/60" /></label>;
}
function FileTextIcon() {
  return <span className="grid h-6 w-6 place-items-center rounded-md bg-secondary/15"><Layers3 size={13} /></span>;
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
    "id": "sparklingly-moon-5114",
    "label": "SEO"
  }, {
    "id": "zealously-path-4224",
    "label": "GEO"
  }, {
    "id": "sunny-house-9595",
    "label": "AEO"
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
