import { useState } from 'react';
import { Activity, AlertTriangle, BarChart3, Bell, Check, ChevronDown, CircleHelp, Download, Gauge, GitCompare, Lock, Menu, MoreHorizontal, Plus, RefreshCw, Search, Settings, Share2, Sparkles, Target, TrendingDown, TrendingUp, Users, X } from 'lucide-react';
type Tone = 'above' | 'near' | 'below';
type BenchmarkRow = {
  kpi: string;
  type: string;
  ref: string;
  yours: string;
  benchmark: string;
  gap: string;
  status: Tone;
  updated: string;
  favorite?: boolean;
};
type NavGroup = [string, string[]];
const navGroups: NavGroup[] = [['WORKSPACE', ['Dashboard', 'Company Profile']], ['INTELLIGENCE', ['Executive Dashboard', 'Analytics', 'KPI Explorer', 'Comparisons', 'Benchmarks', 'Forecasts', 'Trends', 'Anomalies', 'Reports']], ['AI', ['AI Assistant', 'AI Agents', 'AI Knowledge', 'AI Actions', 'AI Conversations']], ['CRM', ['Contacts', 'Companies', 'Leads', 'Deals', 'Pipeline']], ['MARKETING', ['Campaigns', 'SEO', 'GEO', 'AEO', 'Marketing Analytics']], ['ADVERTISING', ['Ad Campaigns', 'Advertising Analytics']], ['SETTINGS', ['Integrations', 'Team']]];
const rows: BenchmarkRow[] = [];
const countries: Array<readonly [string, string, string, string, string, Tone]> = [];
const months: string[] = [];
const deepTabs = ['Industry', 'Peer', 'Historical', 'Internal', 'Segment', 'Platform', 'Business Size'];
const statCards: string[][] = [];
const insights: any[][] = [];
const gapItems: any[][] = [];
const opportunities: any[][] = [];
const saved: string[][] = [];
const sources: any[][] = [];
const history: any[][] = [];
const statusLabel = (tone: Tone) => tone === 'above' ? '▲ Above' : tone === 'below' ? '▼ Below' : '≈ Near';
const statusClass = (tone: Tone) => tone === 'above' ? 'bg-secondary/10 text-foreground' : tone === 'below' ? 'bg-chart-5/10 text-chart-5' : 'bg-secondary/10 text-foreground';
export const LuluBenchmarks = () => {
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Industry');
  const [configOpen, setConfigOpen] = useState(true);
  const [methodOpen, setMethodOpen] = useState(true);
  const [taskOpen, setTaskOpen] = useState(false);
  const [responseOpen, setResponseOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All');
  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 900);
  };
  return <div className="min-h-screen bg-[var(--background)] text-foreground" style={{
    fontFamily: 'Poppins'
  }}>
    <aside className={`${mobileNav ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-30 w-60 flex-col border-r border-border/[.07] bg-[var(--sidebar)] p-4 lg:flex`}>
      <div className="mb-7 flex items-center gap-3 px-2"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">L</span><strong className="text-lg text-foreground">Lulu AI</strong></div>
      <LuluSectionNavigation activeId="kindly-year-8981" />
      <div className="border-t border-border/[.07] pt-4"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/30 text-xs text-foreground">L</span><div><p className="text-xs font-medium text-foreground">Workspace account</p><p className="text-[11px] text-muted-foreground">Connected account</p></div><MoreHorizontal className="ml-auto text-muted-foreground" size={15} /></div></div>
    </aside>
    {mobileNav && <button aria-label="Close navigation" className="fixed inset-0 z-20 bg-primary/60 lg:hidden" onClick={() => setMobileNav(false)} />}
    <main className="min-h-screen lg:ml-60"><div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-7 lg:px-9 lg:py-8">
      <header className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div><button className="mb-4 lg:hidden" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu /></button><p className="mb-2 text-xs text-foreground">Intelligence / Analytics / Benchmarks</p><h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Benchmarks</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Understand how your business performs against relevant industry, historical and internal benchmarks.</p></div><div className="flex flex-wrap gap-2"><button className="flex items-center gap-2 rounded-lg border border-border/30 bg-secondary/15 px-3 py-2 text-sm text-foreground"><Sparkles size={15} /> Ask Lulu AI</button><button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"><Plus size={15} /> Create Benchmark</button><button className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground"><Download size={15} /> Export</button><button aria-label="Refresh" onClick={refresh} className="rounded-lg border border-border bg-secondary p-2 text-foreground"><RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /></button></div></header>
      <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{statCards.map(([label, value, sub, color]) => <article key={label} className="rounded-xl border border-border/[.07] bg-secondary p-4"><div className={`mb-3 flex items-center justify-between text-xs ${color === 'emerald' ? 'text-foreground' : color === 'amber' ? 'text-chart-1' : color === 'red' ? 'text-chart-5' : 'text-foreground'}`}><span>{label}</span><span>{label === 'Above Benchmark' ? '✓' : label === 'Near Benchmark' ? '−' : label === 'Critical Gaps' ? '!' : '◈'}</span></div><p className="text-2xl font-semibold text-foreground">{value}</p><p className="mt-1 text-[11px] text-muted-foreground">{sub}</p></article>)}</section>
      <section className="mb-6 rounded-xl border border-border/[.07] bg-secondary p-4 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-[.14em] text-muted-foreground">Library</p><h2 className="mt-1 text-lg font-semibold text-foreground">Benchmark Library</h2></div><button className="rounded-lg border border-border/30 px-3 py-2 text-xs text-foreground"><Plus size={14} className="mr-1 inline" /> Create Benchmark</button></div><label className="mt-4 flex items-center gap-2 rounded-lg border border-border/[.08] bg-[var(--card)] px-3 py-2.5"><Search size={16} className="text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" placeholder="Search revenue growth, ROAS, conversion rate, retention..." /></label><div className="mt-4 flex gap-1 overflow-x-auto pb-1">{['All', 'Industry', 'Peer', 'Historical', 'Internal', 'Segment', 'Platform', 'Business Size'].map(item => <button key={item} onClick={() => setFilter(item)} className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs ${filter === item ? 'bg-secondary/20 text-foreground' : 'text-foreground hover:text-foreground'}`}>{item}</button>)}</div><div className="mt-4 flex flex-wrap items-center gap-2 text-xs"><strong className="text-foreground">★ Favorites</strong><span className="text-muted-foreground">Saved benchmarks appear after live data is available.</span></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[950px] text-left text-xs"><thead className="border-b border-border/[.08] text-muted-foreground"><tr>{['KPI', 'Benchmark Type', 'Reference Group', 'Your Value', 'Benchmark', 'Gap', 'Status', 'Last Updated', 'Actions'].map(h => <th key={h} className="pb-3 pr-4 font-medium">{h}</th>)}</tr></thead><tbody>{rows.filter(r => (!search || r.kpi.toLowerCase().includes(search.toLowerCase())) && (filter === 'All' || r.type === filter)).map(row => <tr key={row.kpi} className="border-b border-border/[.05] hover:bg-secondary"><td className="py-3 pr-4 font-medium text-foreground">{row.kpi}</td><td className="py-3 pr-4 text-muted-foreground">{row.type}</td><td className="py-3 pr-4 text-muted-foreground">{row.ref}</td><td className="py-3 pr-4 text-foreground">{row.yours}</td><td className="py-3 pr-4 text-muted-foreground">{row.benchmark}</td><td className={`py-3 pr-4 ${row.status === 'above' ? 'text-foreground' : row.status === 'near' ? 'text-foreground' : 'text-chart-5'}`}>{row.gap}</td><td className="py-3 pr-4"><span className={`rounded-full px-2 py-1 ${statusClass(row.status)}`}>{statusLabel(row.status)}</span></td><td className="py-3 pr-4 text-muted-foreground">{row.updated}</td><td className="py-3"><button className="text-foreground">Open</button><button className="ml-2 text-foreground">{row.favorite ? '★' : '☆'}</button><Share2 size={13} className="ml-2 inline text-muted-foreground" /></td></tr>)}</tbody></table></div><p className="mt-4 text-xs text-muted-foreground">Showing live benchmarks <button className="ml-2 text-foreground">Load more →</button></p></section>
      <section className="mb-6 rounded-xl border border-border/[.07] bg-secondary p-5"><button onClick={() => setConfigOpen(!configOpen)} className="flex w-full items-center justify-between text-left"><span><span className="text-xs uppercase tracking-[.14em] text-muted-foreground">Setup</span><h2 className="mt-1 text-lg font-semibold text-foreground">Configure Benchmark</h2></span><ChevronDown className={configOpen ? '' : '-rotate-90'} size={18} /></button>{configOpen && <div className="mt-5 grid gap-4 md:grid-cols-2"><div className="space-y-3">{[['KPI', 'Conversion Rate'], ['Benchmark Type', 'Industry Benchmark'], ['Industry', 'E-commerce'], ['Geography', 'DACH (Germany, Austria, Switzerland)']].map(([l, v]) => <label key={l} className="block text-xs text-muted-foreground">{l}<select className="mt-1 w-full rounded-lg border border-border/[.08] bg-[var(--secondary)] px-3 py-2.5 text-sm text-foreground"><option>{v}</option></select></label>)}</div><div className="space-y-3">{[['Business Size', 'SMB (10-250 employees)'], ['Segment', 'All Customers']].map(([l, v]) => <label key={l} className="block text-xs text-muted-foreground">{l}<select className="mt-1 w-full rounded-lg border border-border/[.08] bg-[var(--secondary)] px-3 py-2.5 text-sm text-foreground"><option>{v}</option></select></label>)}<div><p className="text-xs text-muted-foreground">Date Range</p><div className="mt-1 flex flex-wrap gap-1">{['Last 30D', 'Last 90D', 'Last 6M', 'Last 12M'].map((x, i) => <button key={x} className={`rounded px-2.5 py-2 text-xs ${i === 0 ? 'bg-secondary/20 text-foreground' : 'bg-secondary text-foreground'}`}>{x}</button>)}</div></div><div><p className="text-xs text-muted-foreground">Comparison Basis</p><div className="mt-2 flex flex-wrap gap-4 text-xs text-foreground">{['Absolute', 'Percentage', 'Percentile', 'Index'].map(x => <label key={x}><input type="radio" defaultChecked={x === 'Percentage'} name="basis" className="mr-1 accent-primary" />{x}</label>)}</div></div></div><div className="md:col-span-2 flex flex-col items-end border-t border-border/[.07] pt-4"><button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Calculate Benchmark</button><p className="mt-2 text-right text-[11px] text-muted-foreground">Benchmark calculations use available reference data. Methodology is disclosed below.</p></div></div>}</section>
      <section className="mb-6 rounded-xl border border-border/20 bg-secondary p-5"><div className="flex flex-wrap items-center gap-3"><div><p className="text-xs uppercase tracking-[.14em] text-muted-foreground">Active benchmark</p><h2 className="mt-1 text-xl font-semibold text-foreground">Conversion Rate</h2></div><span className="rounded-full bg-secondary/15 px-2.5 py-1 text-xs text-foreground">Live reference</span><span className="text-xs text-muted-foreground">Reference group appears after live benchmark data is available.</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{([] as string[][]).map(([a, b, c, d]) => <div key={a} className="rounded-lg bg-[var(--secondary)] p-4"><p className="text-xs text-muted-foreground">{a}</p><p className={`mt-2 text-xl font-semibold ${d}`}>{b}</p><p className="mt-1 text-[11px] text-muted-foreground">{c}</p></div>)}</div><div className="mt-5 rounded-lg border border-border/[.06] bg-[var(--secondary)] p-4"><div className="relative h-16"><div className="absolute left-0 right-0 top-7 h-2 rounded-full bg-gradient-to-r from-chart-5/50 via-secondary/60 to-secondary/70" /><div className="absolute left-[55%] top-3 h-10 border-l border-border" /><div className="absolute left-[70%] top-2 flex flex-col items-center"><span className="h-4 w-4 rounded-full border-4 border-border bg-primary shadow-[0_0_16px_var(--primary)] text-primary-foreground" /><span className="mt-1 whitespace-nowrap text-[11px] text-foreground">Workspace position</span></div></div><div className="flex justify-between text-[10px] text-muted-foreground"><span>Significantly Below</span><span>Below</span><span>Benchmark position</span><span>Above</span><span>Significantly Above</span></div><p className="mt-4 text-xs italic text-muted-foreground">Position appears after live reference data is available.</p></div><div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-lg border border-border/[.06] p-4"><h3 className="text-sm font-medium text-foreground">Benchmark Gap</h3><dl className="mt-3 space-y-2 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Absolute gap</dt><dd className="text-chart-4">—</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Relative gap</dt><dd className="text-chart-4">—</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Direction</dt><dd className="text-chart-4">Outperforming ↑</dd></div></dl></div><div className="rounded-lg border border-chart-4/20 bg-chart-4/[.05] p-4"><p className="text-xs text-muted-foreground">Relative Difference · Calculated</p><p className="mt-2 text-3xl font-bold text-chart-4">—</p><p className="mt-1 text-xs text-muted-foreground">Benchmark comparison appears after live reference data is available.</p></div></div></section>
      <section className="mb-6 rounded-xl border border-border/[.07] bg-secondary p-5"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs uppercase tracking-[.14em] text-muted-foreground">Historical performance</p><h2 className="mt-1 text-lg font-semibold text-foreground">Benchmark Trend</h2><p className="mt-1 text-xs text-muted-foreground">Historical comparison appears after live benchmark data is available.</p></div><div className="flex gap-1 rounded-lg border border-border/[.08] p-1">{['Daily', 'Weekly', 'Monthly', 'Quarterly'].map(x => <button key={x} className={`rounded px-2 py-1 text-xs ${x === 'Monthly' ? 'bg-secondary/20 text-chart-2' : 'text-muted-foreground'}`}>{x}</button>)}</div></div><svg viewBox="0 0 900 270" className="mt-5 h-64 w-full" role="img" aria-label="Dual line chart showing conversion rate versus industry benchmark"><path d="" fill="var(--chart-4)" fillOpacity=".10" /><path d="" fill="none" stroke="var(--chart-2)" strokeWidth="3" /><path d="" fill="none" stroke="var(--chart-1)" strokeWidth="2" strokeDasharray="7 6" />{[45, 210, 370, 530, 690, 850].map(x => <line key={x} x1={x} x2={x} y1="30" y2="220" stroke="white" strokeOpacity=".05" />)}<g fill="var(--muted-foreground)" fontSize="11">{months.map((m, i) => <text key={m} x={35 + i * 74} y="245">{m}</text>)}</g></svg><div className="flex flex-wrap gap-5 text-xs text-muted-foreground"><span>Live performance</span><span>Live benchmark</span><span className="text-foreground">Live gap</span></div><p className="mt-4 text-xs italic text-muted-foreground">Historical benchmark values appear only when live reference data is available.</p></section>
      <section className="mb-6 rounded-xl border border-border/[.07] bg-secondary p-5"><div className="flex items-end justify-between"><div><h2 className="text-lg font-semibold text-foreground">Benchmark Breakdown</h2><p className="mt-1 text-xs text-muted-foreground">Live benchmark breakdown by selected dimension.</p></div><select className="rounded-lg border border-border/[.08] bg-[var(--secondary)] px-3 py-2 text-xs text-foreground"><option>Country</option><option>Region</option><option>Product</option><option>Channel</option></select></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="border-b border-border/[.07] text-muted-foreground"><tr>{['Country', 'Your Value', 'Benchmark', 'Gap', 'Status'].map(x => <th key={x} className="pb-3 font-medium">{x}</th>)}</tr></thead><tbody>{countries.map(([flag, name, y, b, g, tone]) => <tr key={name} className="border-b border-border/[.05]"><td className="py-3 text-foreground">{flag} {name}</td><td className="py-3 text-foreground">{y}</td><td className="py-3 text-muted-foreground">{b}</td><td className={`py-3 ${tone === 'above' ? 'text-foreground' : tone === 'below' ? 'text-chart-5' : 'text-foreground'}`}>{g}</td><td className="py-3"><span className={`rounded-full px-2 py-1 ${statusClass(tone)}`}>{statusLabel(tone)}</span></td></tr>)}</tbody></table></div></section>
      <section className="mb-6 rounded-xl border border-border/[.07] bg-secondary p-5"><div className="flex gap-1 overflow-x-auto border-b border-border/[.07] pb-2">{deepTabs.map(x => <button key={x} onClick={() => setActiveTab(x)} className={`whitespace-nowrap rounded-md px-3 py-2 text-xs ${activeTab === x ? 'bg-secondary/20 text-foreground' : 'text-foreground'}`}>{x}</button>)}</div><div className="mt-5"><h2 className="text-lg font-semibold text-foreground">{activeTab} Benchmark</h2><p className="mt-2 text-sm text-muted-foreground">{activeTab} comparison appears after live benchmark data is available.</p><div className="mt-5 grid gap-3 sm:grid-cols-3"></div><p className="mt-4 text-xs text-muted-foreground">Benchmark details appear after live reference data is available. <button className="text-foreground">View Full Methodology →</button></p></div></section>
      <section className="mb-6 rounded-xl border border-border/[.07] bg-secondary p-5"><h2 className="text-lg font-semibold text-foreground">Benchmark Distribution</h2><p className="mt-1 text-xs text-muted-foreground">Distribution appears after live benchmark reference data is available.</p><svg viewBox="0 0 900 190" className="mt-5 h-44 w-full" role="img" aria-label="Bell curve benchmark distribution with your position"><path d="" fill="var(--chart-2)" fillOpacity=".16" /><path d="" fill="none" stroke="var(--chart-2)" strokeWidth="3" /><line x1="0" x2="0" y1="0" y2="0" stroke="transparent" /><text x="630" y="68" fill="var(--foreground)" fontSize="12">Workspace position</text><text x="485" y="180" fill="var(--foreground)" fontSize="11">Benchmark position</text><g fill="var(--muted-foreground)" fontSize="10"><text x="40" y="175">Live distribution</text></g></svg><div className="grid grid-cols-2 gap-4 border-t border-border/[.07] pt-4 sm:grid-cols-5">{([] as string[][]).map(([a, b]) => <div key={a}><p className="text-xs text-muted-foreground">{a}</p><p className="mt-1 text-sm font-medium text-foreground">{b}</p></div>)}</div><p className="mt-4 text-xs italic text-muted-foreground">Distribution appears only when live reference data is available.</p></section>
      <section className="mb-6 rounded-xl border border-border/20 bg-secondary/[.07] p-5"><div className="flex items-center gap-2"><Sparkles size={17} className="text-foreground" /><h2 className="text-lg font-semibold text-foreground">Lulu AI Benchmark Analysis</h2><span className="rounded-full bg-secondary/20 px-2 py-1 text-[10px] text-foreground">AI-generated</span></div><p className="mt-4 max-w-5xl text-sm leading-6 text-foreground">Benchmark analysis appears after live workspace metrics and reference data are available.</p><div className="mt-5 grid gap-3 md:grid-cols-3">{insights.map(([title, body, tone]) => <article key={title} className="rounded-lg border border-border/[.07] bg-[var(--card)]/70 p-4"><h3 className={`text-sm font-semibold ${tone === 'emerald' ? 'text-foreground' : tone === 'amber' ? 'text-chart-1' : 'text-foreground'}`}>{title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></article>)}</div><div className="mt-4 flex flex-wrap gap-3 text-xs"><span className="rounded-lg bg-chart-1/10 px-3 py-2 text-chart-1">AI-detected gaps appear after live benchmark data is available.</span><span className="rounded-lg bg-secondary/10 px-3 py-2 text-foreground">Opportunities appear after live benchmark data is available.</span></div><p className="mt-4 text-[11px] text-muted-foreground">Insights appear after connected data and benchmark references are available.</p></section>
      <section className="mb-6 rounded-xl border border-border/[.07] bg-secondary p-5"><div className="flex items-center gap-2"><h2 className="text-lg font-semibold text-foreground">AI-Detected Benchmark Gaps</h2><span className="rounded-full bg-secondary/15 px-2 py-1 text-[10px] text-foreground">AI Detected</span></div><div className="mt-4 space-y-2">{gapItems.map(([title, metric, yours, bench, gap, severity, evidence, color]) => <article key={title} className="flex flex-col gap-3 rounded-lg border border-border/[.06] bg-[var(--card)] p-4 lg:flex-row lg:items-center"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color === 'red' ? 'bg-chart-5/10 text-chart-5' : 'bg-secondary/10 text-foreground'}`}><AlertTriangle size={15} /></span><div className="min-w-0 flex-1"><h3 className="text-sm font-medium text-foreground">{title}</h3><p className="mt-1 text-xs text-muted-foreground">{metric} · Your {yours} vs benchmark {bench} · <strong className={color === 'red' ? 'text-chart-5' : 'text-foreground'}>{gap}</strong></p></div><span className={`rounded-full px-2 py-1 text-xs ${color === 'red' ? 'bg-chart-5/10 text-chart-5' : 'bg-chart-1/10 text-chart-1'}`}>{severity}</span><span className="text-xs text-muted-foreground">{evidence} · Just now</span><button className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground">Investigate</button></article>)}</div></section>
      <section className="mb-6 grid gap-5 xl:grid-cols-2"><div className="rounded-xl border border-border/[.07] bg-secondary p-5"><div className="flex justify-between"><h2 className="text-lg font-semibold text-foreground">Benchmark Opportunities</h2><span className="text-foreground">3</span></div><div className="mt-4 space-y-4">{opportunities.map(([title, desc, evidence, impact]) => <article key={title} className="border-b border-border/[.06] pb-4 last:border-0"><h3 className="text-sm font-medium text-foreground">{title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{desc}</p><p className="mt-2 text-[11px] text-muted-foreground">Evidence: {evidence} · Impact: {impact} · Priority: {impact}</p><div className="mt-3 flex gap-2"><button className="text-xs text-foreground">View Opportunity</button><button className="rounded border border-border px-2 py-1 text-xs text-foreground">Create Task</button></div></article>)}</div></div><div className="rounded-xl border border-border/[.07] bg-secondary p-5"><div className="flex justify-between"><h2 className="text-lg font-semibold text-foreground">Benchmark Risks</h2><span className="text-chart-5">{gapItems.length}</span></div>{([] as string[][]).map(([title, desc, gap, severity]) => <article key={title} className="mt-4 border-b border-border/[.06] pb-4"><h3 className="text-sm font-medium text-foreground">{title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{desc}</p><p className="mt-2 text-xs text-chart-5">Gap: {gap} · Severity: {severity} · Historical [Calculated]</p><button className="mt-3 text-xs text-foreground">View Risk</button><button className="ml-4 text-xs text-foreground">Create Task</button></article>)}</div></section>
      <section className="mb-6 rounded-xl border border-border/[.07] bg-secondary p-5"><h2 className="text-lg font-semibold text-foreground">AI Recommendations</h2><div className="mt-4 grid gap-3 md:grid-cols-3">{[['Reduce CAC to benchmark level', 'CAC is — above industry benchmark. Optimizing channel mix and bidding strategy is the highest-leverage action.', 'High'], ['Improve customer retention program', 'Retention 3pp below peer benchmark. Targeted post-purchase engagement can close this gap.', 'Medium'], ['Accelerate revenue growth strategy', 'Growth -5.8pp below historical benchmark. Expanding into high-converting regions may restore momentum.', 'Medium']].map(([title, reason, priority], i) => <article key={title} className="rounded-lg border border-border/[.07] bg-[var(--card)] p-4"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20 text-xs text-foreground">{i + 1}</span><h3 className="mt-3 text-sm font-medium text-foreground">{title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{reason}</p><p className="mt-3 text-[11px] text-muted-foreground">Evidence: AI Detected · Expected Impact: {priority === 'High' ? 'Reduce CAC by —–—' : 'Improve by 2–3pp'} · Priority: {priority}</p><div className="mt-4 flex flex-wrap gap-2"><button className="text-xs text-foreground">Review</button><button className="text-xs text-foreground">Create Task</button>{i === 0 && <button className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">Execute with AI</button>}</div></article>)}</div></section>
      <section className="mb-6 rounded-xl border border-border/[.07] bg-secondary p-5"><button onClick={() => setTaskOpen(!taskOpen)} className="flex items-center gap-2 text-sm font-medium text-foreground"><Plus size={16} /> Create Task from Benchmark Finding</button>{taskOpen && <div className="mt-4 grid gap-3 md:grid-cols-2"><label className="text-xs text-muted-foreground">Task Name<input className="mt-1 w-full rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-sm text-foreground" defaultValue="" /></label><label className="text-xs text-muted-foreground">Owner<select className="mt-1 w-full rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-sm text-foreground"><option>Select owner</option></select></label><label className="text-xs text-muted-foreground">Priority<select className="mt-1 w-full rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-sm text-foreground"><option>Select priority</option></select></label><label className="text-xs text-muted-foreground">Due Date<input type="date" className="mt-1 w-full rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-sm text-foreground" /></label><label className="text-xs text-muted-foreground md:col-span-2">Description<textarea className="mt-1 h-20 w-full rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-sm text-foreground" defaultValue="" /></label><div className="md:col-span-2"><button className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground">Create Task</button><button onClick={() => setTaskOpen(false)} className="ml-2 px-4 py-2 text-sm text-muted-foreground">Cancel</button><p className="mt-2 text-[11px] text-muted-foreground">Requires confirmation before task creation.</p></div></div>}</section>
      <section className="mb-6 rounded-xl border border-border/20 bg-secondary/[.07] p-5"><div className="flex items-center gap-2"><Sparkles size={17} className="text-foreground" /><h2 className="text-lg font-semibold text-foreground">Ask Lulu AI</h2></div><div className="mt-4 flex gap-2 rounded-lg border border-border bg-[var(--secondary)] p-2"><input className="flex-1 bg-transparent px-2 text-sm text-foreground outline-none" placeholder="Ask about this benchmark..." /><button className="rounded bg-primary px-3 py-2 text-xs text-primary-foreground">Ask</button></div><div className="mt-3 flex flex-wrap gap-2">{['Why are we below benchmark on retention?', 'What is causing the CAC gap?', 'Which segments are strongest?', 'What should we improve first?', 'How can we outperform this benchmark?', 'Create a report from this benchmark'].map(q => <button key={q} className="rounded-full border border-border/20 px-3 py-1.5 text-xs text-foreground">{q}</button>)}</div><button onClick={() => setResponseOpen(!responseOpen)} className="mt-5 w-full rounded-lg border border-border/[.07] bg-[var(--primary)] p-4 text-left text-primary-foreground"><p className="text-xs text-foreground">◉ AI Response · Just now</p><p className={`mt-2 text-sm leading-6 text-foreground ${responseOpen ? '' : 'line-clamp-2'}`}>The CAC benchmark gap of — above the industry reference is the highest-priority area based on both gap magnitude and revenue impact. This gap is likely associated with current channel allocation — Meta Ads CAC is running — higher than Google Ads CAC. Reallocating budget toward higher-efficiency channels could reduce blended CAC toward the benchmark. I recommend starting with a channel-level CAC breakdown in the Comparisons module.</p><span className="mt-2 block text-xs text-foreground">{responseOpen ? 'Show Less ↑' : 'Show Full Response ↓'}</span></button></section>
      <section className="mb-6 rounded-xl border border-border/[.07] bg-secondary p-5"><h2 className="text-lg font-semibold text-foreground">Saved Benchmarks</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{saved.map(([name, type, ref, date, updated]) => <article key={name} className="rounded-lg border border-border/[.07] bg-[var(--card)] p-4"><div className="flex justify-between"><h3 className="text-sm font-medium text-foreground">{name}</h3><span className="text-foreground">★</span></div><p className="mt-3 text-xs text-foreground">{type}</p><p className="mt-2 text-xs text-muted-foreground">{ref}</p><p className="mt-2 text-[11px] text-muted-foreground">{date} · Updated: {updated}</p><div className="mt-4 flex gap-2 text-xs"><button className="text-foreground">Open</button><button className="text-foreground">Edit</button><button className="text-foreground">Duplicate</button></div></article>)}</div></section>
      <section className="mb-6 grid gap-5 lg:grid-cols-2"><div className="rounded-xl border border-border/[.07] bg-secondary p-5"><h2 className="text-lg font-semibold text-foreground">Data Sources</h2>{sources.map(([name, quality, sync]) => <div key={name} className="flex items-center gap-3 border-b border-border/[.05] py-3 text-xs"><span className="h-2 w-2 rounded-full bg-chart-4" /><span className="flex-1 text-foreground">{name}</span><span className="text-chart-4">● Connected</span><span className="text-muted-foreground">{sync}</span><span className="text-muted-foreground">{quality}</span></div>)}</div><div className="rounded-xl border border-border/[.07] bg-secondary p-5"><h2 className="text-lg font-semibold text-foreground">Benchmark Data Quality</h2>{([] as string[][]).map(([label, value]) => <div key={label} className="mt-4"><div className="flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><span className="text-foreground">{value} · Excellent</span></div><div className="mt-2 h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary text-primary-foreground" style={{
                  width: value
                }} /></div></div>)}<p className="mt-4 text-xs text-muted-foreground">Overall: <span className="text-foreground">Good</span>. Peer benchmark data has limited source coverage for some segments.</p></div></section>
      <section className="mb-6 rounded-xl border border-border/[.07] bg-secondary p-5"><button onClick={() => setMethodOpen(!methodOpen)} className="flex w-full items-center justify-between text-left"><h2 className="text-lg font-semibold text-foreground">Benchmark Methodology</h2><ChevronDown className={methodOpen ? '' : '-rotate-90'} size={18} /></button>{methodOpen && <div className="mt-5 grid gap-3 text-sm text-muted-foreground md:grid-cols-2"><p><strong className="text-foreground">Benchmark Source:</strong> Available reference data aggregated for selected industry, geography and business size. No individual company data is disclosed.</p><p><strong className="text-foreground">Reference Population:</strong> Live reference population appears after benchmark data is connected.</p><p><strong className="text-foreground">Industry Classification:</strong> Workspace classification appears after onboarding data is available.</p><p><strong className="text-foreground">Date Period:</strong> Selected period appears after live data is available.</p><p><strong className="text-foreground">Calculation Method:</strong> Connected KPI values are compared against available reference values for the selected group.</p><p><strong className="text-foreground">Data Coverage:</strong> Coverage appears after live reference data is available.</p><p><strong className="text-foreground">Update Frequency:</strong> Reference values update periodically; business data updates continuously.</p><div className="md:col-span-2 rounded-lg border border-border/30 bg-secondary/[.06] p-4 text-xs text-foreground"><AlertTriangle size={15} className="mr-2 inline" />Benchmark values are reference points derived from available data, not guaranteed to represent the exact market. Never fabricated. If a reliable benchmark cannot be found, “Benchmark Unavailable” is shown instead.</div><button className="text-left text-foreground">View Full Methodology →</button></div>}</section>
      <section className="mb-6 rounded-xl border border-border/[.07] bg-secondary p-5"><h2 className="text-lg font-semibold text-foreground">Benchmark History</h2><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-xs"><thead className="border-b border-border/[.07] text-muted-foreground"><tr>{['Event', 'User', 'Action', 'Timestamp'].map(x => <th key={x} className="pb-3 font-medium">{x}</th>)}</tr></thead><tbody>{history.map(([event, user, action, time]) => <tr key={event} className="border-b border-border/[.05]"><td className="py-3 text-foreground">{event}</td><td className="py-3 text-muted-foreground">{user}</td><td className="py-3 text-muted-foreground">{action}</td><td className="py-3 text-muted-foreground">{time}</td></tr>)}</tbody></table></div></section>
      <section className="grid gap-3 pb-8 sm:grid-cols-2 xl:grid-cols-5">{[['No benchmarks available', 'Connect relevant data or select a supported benchmark source to begin.'], ['Insufficient Data', 'Additional business or benchmark data is required for a reliable comparison.'], ['Benchmark Unavailable', 'A reliable benchmark could not be found for the selected KPI and reference group.'], ["Benchmark couldn't be loaded", 'Try again to reload this benchmark.'], ['Benchmark Access Restricted', 'You do not have permission to view this benchmark.']].map(([title, desc]) => <article key={title} className="rounded-xl border border-border/[.07] bg-secondary p-4"><Gauge size={20} className="text-muted-foreground" /><h3 className="mt-3 text-sm font-medium text-foreground">{title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{desc}</p><button className="mt-3 text-xs text-foreground">{title.includes('loaded') ? 'Try Again' : 'Configure Benchmark'}</button></article>)}</section>
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
