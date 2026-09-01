import { useState } from 'react';
import type { ReactNode } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertTriangle, Check, ChevronDown, CircleHelp, Clock3, Download, FileText, Globe2, Info, LayoutGrid, Menu, MoreHorizontal, RefreshCw, Search, Share2, SlidersHorizontal, Sparkles, Star, Target, Users } from 'lucide-react';
type Tone = 'red' | 'orange' | 'amber' | 'blue' | 'violet' | 'green' | 'slate' | 'teal';
type Row = {
  kpi: string;
  area: string;
  description: string;
  detected: string;
  magnitude: string;
  severity: Tone;
  confidence: string;
  status: string;
};
const categories = ['Revenue', 'Customer', 'Sales', 'Marketing', 'Advertising', 'Ecommerce', 'Finance', 'Operations'];
const suggestions = ['Revenue', 'Advertising Spend', 'Conversion', 'Customer Churn', 'ROAS', 'Traffic'];
const summary: Array<readonly [string, string, string]> = [];
const anomalies: Row[] = [];
const causes: any[][] = [];
const related: any[][] = [];
const sources: any[][] = [];
const history: any[][] = [];
const severityMeta: Record<Tone, {
  label: string;
  icon: string;
  className: string;
}> = {
  red: {
    label: 'Critical',
    icon: '●',
    className: 'bg-chart-5/10 text-chart-5'
  },
  orange: {
    label: 'High',
    icon: '▲',
    className: 'bg-secondary text-foreground'
  },
  amber: {
    label: 'Medium',
    icon: '◆',
    className: 'bg-secondary text-foreground'
  },
  blue: {
    label: 'Low',
    icon: '●',
    className: 'bg-secondary text-foreground'
  },
  violet: {
    label: 'AI',
    icon: '✦',
    className: 'bg-secondary text-foreground'
  },
  green: {
    label: 'Good',
    icon: '●',
    className: 'bg-secondary text-foreground'
  },
  slate: {
    label: 'Informational',
    icon: '●',
    className: 'bg-secondary text-muted-foreground'
  },
  teal: {
    label: 'Monitoring',
    icon: '●',
    className: 'bg-secondary text-foreground'
  }
};
const Badge = ({
  children,
  tone = 'slate',
  icon
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
}) => <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${severityMeta[tone].className}`}>{icon ?? severityMeta[tone].icon}{children}</span>;
const Section = ({
  title,
  subtitle,
  action,
  children,
  tone = 'slate'
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  tone?: Tone;
}) => <section className={`mb-5 rounded-xl border bg-card p-5 shadow-[0_3px_16px_rgba(0,0,0,.045)] ${tone === 'violet' ? 'border-border' : tone === 'red' ? 'border-chart-5/30' : tone === 'green' ? 'border-chart-4/30' : 'border-border'}`}><header className="mb-4 flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-[16px] font-semibold tracking-[-.015em] text-foreground">{title}</h2>{subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}</div>{action}</header>{children}</section>;
const LineChart = ({
  band = false
}: {
  band?: boolean;
}) => <svg viewBox="0 0 900 245" className="h-64 w-full" role="img" aria-label="Revenue timeline showing normal range and a sharp anomaly drop"><g stroke="var(--border)" strokeWidth="1"><line x1="45" x2="875" y1="40" y2="40" /><line x1="45" x2="875" y1="95" y2="95" /><line x1="45" x2="875" y1="150" y2="150" /><line x1="45" x2="875" y1="205" y2="205" /></g>{band && <path d="M45 70 C160 62 260 72 370 64 S590 70 700 62 S800 67 875 62 L875 122 C770 126 700 117 590 126 S370 120 260 128 S150 119 45 128 Z" fill="var(--border)" opacity=".34" />}<path d="M45 99 C155 87 260 105 370 91 S575 102 690 84 S790 99 875 92" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeDasharray="6 5" /><path d="M45 108 C150 100 250 110 370 103 S570 114 690 101 L760 108 L800 160 L875 194" fill="none" stroke="var(--chart-5)" strokeWidth="3" /><circle cx="875" cy="194" r="6" fill="var(--chart-5)" /><line x1="760" x2="760" y1="28" y2="215" stroke="var(--chart-5)" strokeDasharray="4 4" /><text x="745" y="22" fill="var(--chart-5)" fontSize="11">Anomaly Detected</text><g fill="var(--muted-foreground)" fontSize="11"><text x="4" y="44">—</text><text x="4" y="99">—</text><text x="4" y="154">—</text><text x="4" y="209">—</text><text x="42" y="237">6 days ago</text><text x="420" y="237">Yesterday</text><text x="800" y="237">Today</text></g></svg>;
const DeviationChart = () => <svg viewBox="0 0 900 170" className="h-48 w-full" role="img" aria-label="Expected versus observed revenue chart"><rect x="70" y="45" width="760" height="48" rx="8" fill="var(--border)" /><line x1="450" x2="450" y1="28" y2="112" stroke="var(--chart-3)" strokeWidth="4" /><circle cx="450" cy="69" r="7" fill="var(--chart-3)" /><rect x="155" y="55" width="115" height="28" rx="7" fill="var(--chart-5)" /><circle cx="155" cy="69" r="7" fill="var(--chart-5)" /><line x1="270" x2="450" y1="118" y2="118" stroke="var(--chart-5)" strokeWidth="2" strokeDasharray="5 4" /><g fill="var(--muted-foreground)" fontSize="11"><text x="70" y="39">Normal range · —–—</text><text x="425" y="25" fill="var(--chart-3)">Expected —</text><text x="115" y="145" fill="var(--chart-5)">Observed —</text><text x="308" y="145" fill="var(--chart-5)">Deviation: —</text></g></svg>;
export const LuluAnomalies = () => {
  const [activeCategory, setActiveCategory] = useState('Revenue');
  const [query, setQuery] = useState('');
  const [frequency, setFrequency] = useState('Hour');
  const [mobileNav, setMobileNav] = useState(false);
  const [taskOpen, setTaskOpen] = useState(true);
  const [methodOpen, setMethodOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState('Action Required');
  const { items: anomalyRecords, loading, error, refresh: refreshAnomalies } = useLiveRecords('anomalies');
  const refresh = () => {
    void refreshAnomalies();
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 700);
  };
  if (loading) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground">Loading live anomalies…</main>;
  if (error) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-destructive">{error}</main>;
  if (!loading && !error) return <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10"><div className="mx-auto max-w-6xl"><header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs uppercase tracking-[.18em] text-muted-foreground">Intelligence / Anomalies</p><h1 className="mt-2 text-3xl font-bold">Anomalies</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Verified anomaly records from connected workspace data. Severity, deviation and evidence appear only when returned by the backend.</p></div><span className="inline-flex items-center rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">Use Update in the navigation bar</span></header>{anomalyRecords.length === 0 ? <section className="rounded-2xl border border-dashed border-border bg-card p-10 text-center"><AlertTriangle className="mx-auto mb-4 text-muted-foreground" size={30} /><h2 className="text-xl font-semibold">No verified anomalies yet</h2><p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">Connect and analyze a verified data source before reviewing anomaly charts, causes or recommended actions.</p></section> : <section className="overflow-hidden rounded-2xl border border-border bg-card"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">Anomaly</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Stage</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Updated</th></tr></thead><tbody className="divide-y divide-border">{anomalyRecords.map(record => <tr key={record.id}><td className="px-4 py-3 font-medium">{record.name}</td><td className="px-4 py-3">{record.status}</td><td className="px-4 py-3 text-muted-foreground">{record.stage ?? '—'}</td><td className="max-w-md px-4 py-3 text-muted-foreground">{record.description ?? '—'}</td><td className="px-4 py-3 text-muted-foreground">{new Date(record.updatedAt).toLocaleString()}</td></tr>)}</tbody></table></div></section>}</div></main>;
  return <div className="min-h-screen bg-[var(--background)] font-sans text-foreground">
    <aside className={`${mobileNav ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-30 w-[68px] flex-col items-center border-r border-border bg-[var(--sidebar)] py-5 lg:flex`}><div className="mb-8 flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">L</div><LuluSectionNavigation activeId="sparklingly-light-7230" /><button className="rounded-lg p-3 text-foreground" aria-label="Help"><CircleHelp size={19} /></button><div className="mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-foreground">AM</div></aside>
    <main className="lg:ml-[68px]"><div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-8 lg:px-10">
      <header className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div><button onClick={() => setMobileNav(true)} className="mb-3 lg:hidden" aria-label="Open navigation"><Menu size={22} /></button><p className="mb-3 text-xs text-muted-foreground">Intelligence <span className="mx-2">/</span> Analytics <span className="mx-2">/</span> <span className="font-medium text-foreground">Anomalies</span></p><h1 className="text-3xl font-bold tracking-[-.045em] text-foreground sm:text-[38px]">Anomalies</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Automatically detect unusual business behavior, understand what changed, and identify what requires attention.</p></div><div className="flex flex-wrap gap-2"><button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-secondary px-3 text-xs font-medium text-foreground">Explore Anomalies</button><button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs text-foreground"><Download size={14} />Export</button><span className="inline-flex items-center rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">Use Update in the navigation bar</span></div></header>
      <section className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">{summary.map(([label, value, tone]) => <article key={label} className="rounded-xl border border-border bg-card px-4 py-4 shadow-[0_3px_12px_rgba(0,0,0,.035)]"><p className="text-[11px] leading-4 text-muted-foreground">{label}</p><div className="mt-2 flex items-end justify-between"><strong className="text-xl font-semibold tracking-[-.04em] text-foreground">{value}</strong><Badge tone={tone as Tone}>{label === 'Active Anomalies' ? 'Live' : label === 'Resolved' ? 'Today' : 'Now'}</Badge></div></article>)}</section>
      <section className="mb-5 rounded-xl border border-border bg-card p-4 shadow-[0_3px_12px_rgba(0,0,0,.035)]"><div className="flex items-center gap-3 rounded-lg border border-border bg-secondary px-4 py-3"><Search size={18} className="text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-muted-foreground outline-none" placeholder="Search revenue, customers, advertising, products..." aria-label="Search anomalies" /><kbd className="hidden rounded border border-border bg-card px-2 py-1 text-[10px] text-muted-foreground sm:block">⌘ K</kbd></div><div className="mt-3 flex gap-2 overflow-x-auto">{suggestions.map(chip => <button key={chip} onClick={() => setQuery(chip)} className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:border-border hover:text-foreground">{chip}</button>)}<span className="ml-auto hidden items-center gap-1 text-xs text-muted-foreground md:flex"><Clock3 size={13} /> Recent searches</span><span className="hidden items-center gap-1 text-xs text-muted-foreground md:flex"><Star size={13} /> Favorites</span></div>{query && <p className="mt-3 text-xs text-foreground">Suggestions for <strong>{query}</strong> · Revenue anomaly · Mobile Conversion · Related metrics</p>}</section>
      <nav className="mb-5 flex gap-1 overflow-x-auto border-b border-border" aria-label="Anomaly categories">{categories.map(category => <button key={category} onClick={() => setActiveCategory(category)} className={`shrink-0 border-b-2 px-4 py-3 text-xs font-medium ${activeCategory === category ? 'border-border text-foreground' : 'border-transparent text-foreground hover:text-foreground'}`}>{category}</button>)}</nav>
      <Section title="Anomaly Library" subtitle={`${activeCategory} · 12 active anomalies`} action={<div className="flex gap-2"><button className="rounded-lg border border-border p-2 text-foreground" aria-label="Filter anomalies"><SlidersHorizontal size={15} /></button><button className="rounded-lg border border-border p-2 text-foreground" aria-label="More anomaly options"><MoreHorizontal size={15} /></button></div>}><div className="overflow-x-auto"><table className="w-full min-w-[1200px] text-left text-xs"><caption className="sr-only">Anomaly library with severity, confidence and status</caption><thead className="border-b border-border text-[11px] text-muted-foreground"><tr>{['KPI', 'Business Area', 'Description', 'Detected', 'Magnitude', 'Severity', 'Confidence', 'Status', 'Last Updated', 'Actions'].map(head => <th key={head} className="pb-3 font-medium">{head}</th>)}</tr></thead><tbody>{anomalies.map(row => <tr key={row.kpi} className="border-b border-border hover:bg-card"><th scope="row" className="py-3.5 font-semibold text-foreground">{row.kpi}</th><td className="text-muted-foreground">{row.area}</td><td className="max-w-[220px] text-muted-foreground">{row.description}</td><td className="text-muted-foreground">{row.detected}</td><td className={`font-semibold ${row.magnitude.startsWith('-') ? 'text-chart-5' : 'text-foreground'}`}>{row.magnitude}</td><td><Badge tone={row.severity}>{severityMeta[row.severity].label}</Badge></td><td className="font-medium text-foreground">{row.confidence} <span className="text-[10px] text-muted-foreground">detected</span></td><td><Badge tone={row.status === 'New' ? 'violet' : row.status === 'Investigating' ? 'blue' : row.status === 'Monitoring' ? 'teal' : 'red'}>{row.status}</Badge></td><td className="text-muted-foreground">12 min ago</td><td><button className="text-foreground hover:underline">Open</button><button className="ml-3 text-foreground" aria-label={`Favorite ${row.kpi}`}><Star size={14} /></button></td></tr>)}</tbody></table></div><p className="mt-4 text-[11px] text-muted-foreground">Row actions: Open · Acknowledge · Investigate · Resolve · Dismiss · Favorite · Share · Showing 8 of 12 anomalies</p></Section>
      <Section title="Revenue Anomaly" subtitle="Revenue · Detected Today, 10:32" tone="orange" action={<div className="flex flex-wrap gap-2"><Badge tone="orange" icon={<AlertTriangle size={12} />}>High</Badge><select value={status} onChange={e => setStatus(e.target.value)} className="rounded-full border border-chart-5/30 bg-chart-5/10 px-2 py-1 text-[11px] font-medium text-chart-5"><option>Action Required</option><option>Acknowledged</option><option>Investigating</option><option>Resolved</option><option>Dismissed</option></select></div>}><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6"><div><p className="text-[11px] text-muted-foreground">Observed Value <span className="text-foreground">· Observed</span></p><strong className="mt-1 block text-2xl text-foreground">—</strong></div><div><p className="text-[11px] text-muted-foreground">Expected Range <span className="text-foreground">· Model-derived</span></p><strong className="mt-1 block text-sm text-foreground">— – —</strong><p className="text-[10px] text-muted-foreground">Model-derived expected range</p></div><div><p className="text-[11px] text-muted-foreground">Deviation</p><strong className="mt-1 block text-2xl text-chart-5">—</strong></div><div><p className="text-[11px] text-muted-foreground">Duration</p><strong className="mt-1 block text-sm text-foreground">Ongoing · 3h 28min</strong></div><div><p className="text-[11px] text-muted-foreground">Confidence</p><strong className="mt-1 block text-2xl text-foreground">—</strong><p className="text-[10px] text-muted-foreground">Detection confidence</p></div><div><p className="text-[11px] text-muted-foreground">Anomaly Type</p><strong className="mt-1 block text-sm text-foreground">Point Anomaly</strong><p className="text-[10px] text-muted-foreground">Specific point in time</p></div></div><div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4"><button className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Acknowledge</button><button className="rounded-lg border border-border px-3 py-2 text-xs">Investigate</button><button className="rounded-lg border border-border px-3 py-2 text-xs">Resolve</button><button className="rounded-lg border border-border px-3 py-2 text-xs">Dismiss</button><button onClick={() => setTaskOpen(true)} className="rounded-lg border border-border px-3 py-2 text-xs text-foreground">Create Task</button><button className="rounded-lg border border-border p-2" aria-label="Share anomaly"><Share2 size={14} /></button><button className="rounded-lg border border-border p-2" aria-label="Export anomaly"><Download size={14} /></button><button className="rounded-lg border border-border px-3 py-2 text-xs">Create Report</button></div></Section>
      <div className="grid gap-5 xl:grid-cols-2"><Section title="Expected vs Observed" subtitle="Expected range is model-derived from historical behavior. Not a forecast." action={<div className="flex gap-3 text-[11px] text-muted-foreground"><span className="text-muted-foreground">■ Normal Range</span><span className="text-foreground">● Expected</span><span className="text-chart-5">■ Observed</span></div>}><DeviationChart /></Section><Section title="Anomaly Timeline" subtitle="Revenue · Last 7 days" action={<div className="flex rounded-lg border border-border p-1">{['Hour', 'Day', 'Week', 'Month'].map(item => <button key={item} onClick={() => setFrequency(item)} className={`rounded-md px-2 py-1 text-[11px] ${frequency === item ? 'bg-secondary font-medium text-foreground' : 'text-foreground'}`}>{item}</button>)}</div>}><LineChart band /><div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground"><span>● Normal Behavior</span><span className="text-chart-5">● Anomaly Begins · Today 10:32</span><span className="text-chart-5">● Ongoing</span></div></Section></div>
      <div className="grid gap-5 md:grid-cols-3"><Section title="Magnitude" action={<span className="text-[11px] text-muted-foreground">Calculated</span>}><strong className="text-2xl text-chart-5">-—</strong><p className="mt-2 text-xs text-muted-foreground">Relative: — · Peak deviation: -31.4%</p></Section><Section title="Duration"><strong className="text-xl text-foreground">Ongoing</strong><p className="mt-2 text-xs text-muted-foreground">Started 3h 28min ago · First detected Today 10:32</p></Section><Section title="Detection Confidence" action={<Badge tone="violet" icon={<Sparkles size={12} />}>Calculated</Badge>}><strong className="text-2xl text-foreground">—</strong><p className="mt-2 text-xs text-muted-foreground">How strongly observed behavior differs from modeled normal.</p></Section></div>
      <div className="grid gap-5 xl:grid-cols-2"><Section title="Anomaly Type"><div className="rounded-lg bg-card p-4"><div className="flex items-center gap-2"><Target size={17} className="text-foreground" /><strong className="text-sm text-foreground">Point Anomaly</strong><Info size={14} className="text-muted-foreground" /></div><p className="mt-2 text-xs leading-5 text-muted-foreground">A single observed value that deviates significantly from the expected range at a specific point in time.</p></div><ul className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2"><li><strong className="text-foreground">Contextual Anomaly</strong> · unusual in context</li><li><strong className="text-foreground">Collective Anomaly</strong> · unusual sequence</li><li><strong className="text-foreground">Change-Point</strong> · behavior shifts</li><li><strong className="text-foreground">Data Quality Anomaly</strong> · source issue</li></ul></Section><Section title="Data Quality Anomalies" action={<Badge tone="amber" icon={<AlertTriangle size={12} />}>Data Anomaly</Badge>}><p className="rounded-lg border border-border bg-secondary p-3 text-xs text-foreground">Always distinguish business anomalies from data quality issues.</p><p className="mt-4 text-sm text-foreground"><Check size={15} className="mr-2 inline text-foreground" />No data quality issues detected for this anomaly.</p><div className="mt-4 rounded-lg border border-border p-3"><div className="flex items-center justify-between"><strong className="text-sm">Google Ads sync delayed</strong><Badge tone="amber">Data Anomaly</Badge></div><p className="mt-1 text-xs text-muted-foreground">Last updated 6h ago · Type: Broken Synchronization · Not Business Anomaly</p></div></Section></div>
      <Section title="Lulu AI Investigation" tone="violet" action={<Badge tone="violet" icon={<Sparkles size={12} />}>AI-generated</Badge>}><div className="border-l-2 border-border pl-4"><p className="max-w-5xl text-sm leading-7 text-muted-foreground">Revenue dropped significantly below its recent expected range beginning at 10:32 today. The deviation began shortly after a measurable decline in website conversion rate, and appears concentrated in mobile traffic. Desktop revenue remains within the expected range. The pattern does not match known seasonal behavior and no scheduled campaigns or promotions are recorded for this period. The anomaly is ongoing and has not shown signs of recovery.</p></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[['What changed', 'Revenue below range'], ['When', 'Today at 10:32'], ['How unusual', '94% confidence'], ['Areas affected', 'Mobile · Advertising']].map(item => <div key={item[0]} className="rounded-lg bg-secondary p-3"><p className="text-[11px] text-foreground">{item[0]}</p><strong className="mt-1 block text-sm text-foreground">{item[1]}</strong></div>)}</div><p className="mt-4 text-xs text-muted-foreground">Related metrics: Mobile Conversion, Advertising Spend, Traffic · AI interpretation; no chain-of-thought exposed.</p></Section>
      <div className="grid gap-5 xl:grid-cols-2"><Section title="Possible Causes" subtitle="Possible causes are AI-inferred from correlated patterns. Causation cannot be confirmed from correlation alone."><ol className="space-y-3">{causes.map((cause, index) => <li key={cause[0]} className="flex gap-3 border-b border-border pb-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-muted-foreground">{index + 1}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap justify-between gap-2"><strong className="text-sm text-foreground">{cause[0]}</strong><Badge tone={cause[2] === 'High' ? 'orange' : 'slate'}>{cause[2]}</Badge></div><p className="mt-1 text-xs text-muted-foreground">Evidence: {cause[1]}</p></div><span className="text-[11px] text-foreground">{cause[3]}</span></li>)}</ol><div className="mt-4 flex flex-wrap gap-2"><Badge tone="violet">Correlated</Badge><Badge tone="violet">AI Inferred</Badge><Badge tone="slate">Observed</Badge><Badge tone="slate">Checked</Badge></div></Section><Section title="Related Metrics" subtitle="Temporal correlation does not imply causation."><div className="space-y-2">{related.map(item => <div key={item[0]} className="flex items-center gap-3 rounded-lg border border-border p-3"><Activity size={15} className="text-muted-foreground" /><strong className="flex-1 text-sm text-foreground">{item[0]}</strong><span className={`text-sm font-semibold ${item[1].startsWith('↓') ? 'text-chart-5' : item[1].startsWith('↑') ? 'text-foreground' : 'text-muted-foreground'}`}>{item[1]}</span><Badge tone={item[2] === 'Correlated' ? 'violet' : 'slate'}>{item[2]}</Badge></div>)}</div></Section></div>
      <div className="grid gap-5 xl:grid-cols-2"><Section title="Affected Segments" subtitle="Only segments with sufficient data shown." action={<div className="flex gap-1 overflow-x-auto">{['Device', 'Country', 'Channel', 'Product', 'Customer Segment'].map((tab, index) => <button key={tab} className={`rounded-md px-2 py-1 text-[11px] ${index === 0 ? 'bg-secondary text-foreground' : 'text-foreground'}`}>{tab}</button>)}</div>}><div className="space-y-4">{[['Mobile', '-34.2%', 'bg-destructive', 88], ['Tablet', '-12.1%', 'bg-primary', 42], ['Desktop', '-9.1%', 'bg-muted', 30]].map(item => <div key={item[0]} className="flex items-center gap-3 text-xs"><span className="w-20 text-muted-foreground">{item[0]}</span><div className="h-2 flex-1 rounded-full bg-secondary"><div className={`h-2 rounded-full ${item[2]}`} style={{
                    width: `${item[3]}%`
                  }} /></div><strong className="w-14 text-right text-chart-5">{item[1]}</strong></div>)}</div></Section><Section title="Business Impact" action={<Badge tone="amber">Estimated</Badge>}><div className="grid gap-3 sm:grid-cols-2"><div><p className="text-xs text-muted-foreground">Revenue Impact · Estimated</p><strong className="text-xl text-chart-5">-—</strong><p className="text-[11px] text-muted-foreground">3.5h ongoing</p></div><div><p className="text-xs text-muted-foreground">Projected if unresolved 24h</p><strong className="text-xl text-chart-5">-—</strong><p className="text-[11px] text-muted-foreground">Estimated · Not a forecast</p></div><div><p className="text-xs text-muted-foreground">Conversion Impact</p><strong className="text-sm text-foreground">Mobile conversion loss</strong></div><div><p className="text-xs text-muted-foreground">Customer Impact</p><strong className="text-sm text-foreground">~2,400 sessions</strong></div></div><p className="mt-4 rounded-lg bg-secondary p-3 text-[11px] text-foreground">Impact figures are estimates based on current deviation rate. Actual impact may differ.</p></Section></div>
      <Section title="AI Impact Analysis" tone="violet" action={<Badge tone="violet" icon={<Sparkles size={12} />}>AI-generated</Badge>}><div className="border-l-2 border-border pl-4"><p className="max-w-5xl text-sm leading-7 text-muted-foreground">The ongoing revenue anomaly, if unresolved, could result in a significant single-day shortfall relative to the expected range. The concentration in mobile traffic suggests a mobile-specific experience or technical issue may be the primary driver. The simultaneous advertising spend increase without a corresponding conversion uplift may compound the financial impact. Urgent investigation of the mobile conversion path is recommended.</p></div><div className="mt-4 flex flex-wrap gap-2"><Badge tone="violet">Areas affected · Mobile</Badge><Badge tone="orange">Urgency · Urgent</Badge><Badge tone="amber">Potential consequences · Revenue loss</Badge></div></Section>
      <div className="grid gap-5 xl:grid-cols-2"><Section title="Anomaly Opportunities" tone="green" action={<Badge tone="green">Positive anomalies</Badge>}><div className="space-y-3">{[['SKU-4421 Product Demand Spike', 'Demand 46.3% above normal range', 'Potential to capitalize on unexpected demand', 'Medium'], ['Organic Traffic Surge', 'Traffic 38.7% above expected range', 'Investigate source; consider content expansion', 'Low']].map(item => <article key={item[0]} className="border-l-2 border-border pl-3"><div className="flex flex-wrap justify-between gap-2"><h3 className="text-sm font-semibold text-foreground">{item[0]}</h3><Badge tone="green">Impact: Medium</Badge></div><p className="mt-1 text-xs text-muted-foreground">{item[1]} · {item[2]} · Priority: {item[3]}</p><div className="mt-2 flex gap-3 text-xs"><button className="text-foreground">View Opportunity</button><button className="text-foreground">Create Task</button></div></article>)}</div><p className="mt-4 text-[11px] text-muted-foreground">Positive anomalies may represent opportunities. Context investigation required before acting.</p></Section><Section title="Anomaly Risks" tone="red"><div className="space-y-3">{[['Revenue drop ongoing', 'no recovery detected', 'High', 'High'], ['Advertising spend up 47% without conversion uplift', 'potential budget waste', 'Critical', 'High'], ['Customer churn spike', 'if sustained, long-term LTV impact', 'High', 'High']].map(item => <article key={item[0]} className="border-l-2 border-chart-5 pl-3"><div className="flex flex-wrap items-center gap-2"><AlertTriangle size={15} className="text-chart-5" /><h3 className="text-sm font-medium text-foreground">{item[0]}</h3><Badge tone={item[2] === 'Critical' ? 'red' : 'orange'}>{item[2]}</Badge></div><p className="mt-1 text-xs text-muted-foreground">{item[1]} · Impact: {item[3]}</p><div className="mt-2 flex gap-3 text-xs"><button className="text-chart-5">View Risk</button><button className="text-foreground">Create Task</button></div></article>)}</div></Section></div>
      <Section title="AI Recommendations" action={<Badge tone="violet" icon={<Sparkles size={12} />}>AI Recommended</Badge>}><div className="grid gap-3 md:grid-cols-2">{[['Investigate mobile conversion path immediately', 'Mobile conversion -31.2% coincides with revenue drop', 'Urgent', 'High'], ['Review active advertising campaigns', 'Spend +47.2% without conversion uplift', 'Urgent', 'High'], ['Verify mobile tracking and data integrity', 'Confirm anomaly is not data-quality related', 'High', 'Medium'], ['Capitalize on SKU-4421 demand spike', 'Demand 46% above normal; review inventory', 'Medium', 'Medium']].map((item, index) => <article key={item[0]} className="rounded-lg border border-border p-4"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-semibold text-foreground">{item[0]}</h3><Badge tone={item[2] === 'Urgent' ? 'red' : 'amber'}>{item[2]}</Badge></div><p className="mt-2 text-xs text-muted-foreground">Reason: {item[1]}</p><p className="mt-2 text-xs text-foreground">Expected impact: {item[3]} · Related anomaly</p><div className="mt-4 flex gap-3 text-xs"><button className="text-foreground">Review</button><button className="text-foreground">Create Task</button>{index === 0 && <button className="font-medium text-foreground">Execute with AI</button>}</div></article>)}</div></Section>
      <section className="mb-5 rounded-xl border border-border bg-card p-5 shadow-[0_3px_16px_rgba(0,0,0,.045)]"><button onClick={() => setTaskOpen(!taskOpen)} className="flex w-full items-center gap-2 text-left text-[16px] font-semibold text-foreground"><Target size={17} className="text-foreground" />Create Task from Anomaly <ChevronDown className={`ml-auto transition ${taskOpen ? 'rotate-180' : ''}`} size={16} /></button>{taskOpen && <div className="mt-4 grid gap-3 border-t border-border pt-4 md:grid-cols-2"><label className="text-xs text-muted-foreground">Task name<input defaultValue="Investigate Revenue Drop" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground" /></label><label className="text-xs text-muted-foreground">Owner<select className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"><option>Workspace member</option><option>Workspace member</option></select></label><label className="text-xs text-muted-foreground">Priority<select className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"><option>High</option><option>Medium</option></select></label><label className="text-xs text-muted-foreground">Due date<input type="date" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" /></label><label className="text-xs text-muted-foreground md:col-span-2">Description<textarea defaultValue="Investigate the mobile conversion path and document the root cause of the Revenue anomaly." className="mt-1 h-16 w-full rounded-lg border border-border px-3 py-2 text-sm" /></label><div className="md:col-span-2"><button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Create Task</button><button onClick={() => setTaskOpen(false)} className="ml-2 rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground">Cancel</button><span className="ml-3 text-[11px] text-muted-foreground">Confirmation required</span></div></div>}</section>
      
      <div className="grid gap-5 xl:grid-cols-2"><Section title="Saved Anomalies"><div className="space-y-2">{[['Revenue Drop', 'Revenue', 'High', 'Action Required', 'Today', '3h ago'], ['ROAS Collapse', 'Advertising', 'Critical', 'Investigating', 'Today', '2h ago'], ['Churn Spike', 'Customer', 'High', 'New', 'Yesterday', '1d ago']].map(item => <article key={item[0]} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3"><Star size={15} className="text-foreground" /><div className="flex-1"><h3 className="text-sm font-medium text-foreground">{item[0]}</h3><p className="mt-1 text-xs text-muted-foreground">{item[1]} · {item[2]} · {item[3]} · {item[4]} · Updated {item[5]}</p></div><div className="flex gap-3 text-xs"><button className="text-foreground">Open</button><button className="text-foreground">Edit</button><button className="text-muted-foreground">Delete</button></div></article>)}</div></Section><Section title="Data Sources"><div className="grid gap-2 sm:grid-cols-2">{sources.map(item => <article key={item[0]} className="rounded-lg border border-border p-3"><div className="flex items-center gap-2"><Globe2 size={15} className="text-foreground" /><h3 className="text-sm font-medium text-foreground">{item[0]}</h3><span className={`ml-auto h-2 w-2 rounded-full ${item[3] === 'amber' ? 'bg-chart-1' : 'bg-chart-4'}`} /></div><p className="mt-2 text-xs text-muted-foreground">Connected · Last sync: {item[1]}</p><Badge tone={item[3] === 'amber' ? 'amber' : 'green'}>{item[2]}</Badge></article>)}</div></Section></div>
      <div className="grid gap-5 xl:grid-cols-2"><Section title="Anomaly Detection Methodology" action={<button onClick={() => setMethodOpen(!methodOpen)} className="rounded-lg border border-border p-2 text-foreground" aria-label="Toggle methodology"><ChevronDown className={`transition ${methodOpen ? 'rotate-180' : ''}`} size={15} /></button>}><p className="text-sm text-muted-foreground">Statistical deviation from a rolling normal behavior model. Proprietary model internals are not exposed.</p>{methodOpen && <div className="mt-4 grid gap-3 border-t border-border pt-4 text-xs text-muted-foreground md:grid-cols-2"><p><strong>Data analyzed:</strong> All connected KPIs</p><p><strong>Historical period:</strong> 24 months</p><p><strong>Normal behavior:</strong> Rolling baseline adjusted for day-of-week and seasonality</p><p><strong>Thresholds:</strong> Adaptive per KPI volatility</p><p><strong>Seasonality:</strong> Incorporated into expected ranges</p><p><strong>Limitations:</strong> New KPIs under 30 days may be less reliable</p></div>}</Section><Section title="Anomaly Data Quality" action={<Badge tone="green">Overall: Good</Badge>}><div className="space-y-3">{[['Data Freshness', 'Updated 12 min ago', 'Excellent', 96], ['Historical Coverage', '24 months', 'Excellent', 96], ['Completeness', '91%', 'Good', 91], ['Synchronization Status', '4/5 sources synced', 'Good', 80], ['Source Reliability', 'High', 'Good', 90]].map(item => <div key={item[0]}><div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{item[0]}</span><span className="text-muted-foreground">{item[1]} · {item[2]}</span></div><div className="h-1.5 rounded-full bg-secondary"><div className="h-1.5 rounded-full bg-primary text-primary-foreground" style={{
                    width: `${item[3]}%`
                  }} /></div></div>)}</div></Section></div>
      <Section title="Anomaly History"><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-xs"><caption className="sr-only">Anomaly audit history</caption><thead className="border-b border-border text-muted-foreground"><tr><th className="pb-3 font-medium">Event</th><th className="font-medium">User</th><th className="font-medium">Timestamp</th></tr></thead><tbody>{history.map(item => <tr key={item[0]} className="border-b border-border"><td className="py-3 text-foreground"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />{item[0]}</td><td className="text-muted-foreground">{item[1]}</td><td className="text-muted-foreground">{item[2]}</td></tr>)}</tbody></table></div></Section>
      <section className="mb-5 grid gap-3 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground md:grid-cols-2"><p><strong className="text-foreground">Empty:</strong> No anomalies detected. Lulu AI has not identified any meaningful unusual behavior.</p><p><strong className="text-foreground">Insufficient Data:</strong> More historical data is required to reliably detect anomalies.</p><p><strong className="text-foreground">Data Quality Issue:</strong> The unusual result may be caused by incomplete source data.</p><p><strong className="text-foreground">Error:</strong> Anomaly analysis couldn't be loaded. <button className="font-medium text-foreground">Try Again</button></p><p><strong className="text-foreground">Restricted:</strong> You don't have permission to view this analysis.</p><p><strong className="text-foreground">Detection Unavailable:</strong> Missing data, unsupported KPI, or insufficient history.</p></section>
      <footer className="flex flex-wrap justify-between gap-3 border-t border-border py-6 text-[11px] text-muted-foreground"><span>Lulu AI Core Platform · Anomalies are based on connected business data.</span><span>Last updated 12 min ago · <button className="text-foreground">View in Reports →</button></span></footer>
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

