import { useState } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Check, ChevronDown, CircleHelp, Clock3, Download, FileText, Filter, Globe2, LayoutDashboard, Lock, Menu, MoreHorizontal, Plus, RefreshCw, Search, Settings, Share2, ShieldAlert, Sparkles, Target, TrendingUp, Users, X, Zap } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type Tone = 'green' | 'blue' | 'amber' | 'red' | 'slate' | 'violet';
type ScoreRow = {
  kpi: string;
  a: string;
  b: string;
  diff: string;
  change: string;
  better: 'A' | 'B';
  tone: Tone;
};
const navGroups = [['WORKSPACE', ['Dashboard', 'Company Profile']], ['INTELLIGENCE', ['Executive Dashboard', 'Analytics', 'Comparisons', 'KPI Explorer', 'Benchmarks', 'Reports', 'Trends', 'Anomalies', 'Forecasts']], ['AI', ['AI Assistant', 'AI Agents', 'AI Knowledge', 'AI Actions', 'AI Conversations']], ['CRM', ['Contacts', 'Companies', 'Leads', 'Deals', 'Pipeline']], ['MARKETING', ['Campaigns', 'SEO', 'GEO', 'AEO', 'Marketing Analytics']], ['ADVERTISING', ['Ad Campaigns', 'Advertising Analytics']], ['SETTINGS', ['Integrations', 'Team']]] as const;
const metrics: string[] = [];
const scoreRows: ScoreRow[] = [];
const countries = [['🇩🇪', 'Germany', '—', '—', '+—', '34.5%'], ['🇦🇹', 'Austria', '—', '—', '+—', '22.1%'], ['🇨🇭', 'Switzerland', '—', '—', '+—', '18.0%'], ['🇬🇧', 'United Kingdom', '—', '—', '+—', '14.8%'], ['🇳🇱', 'Netherlands', '—', '—', '+—', '10.7%']];
const campaigns: any[][] = [];
const history: any[][] = [];
const sources = [['Google Ads', '2 min ago', 'Excellent', Search], ['Meta Ads', '5 min ago', 'Good', Globe2], ['Google Analytics', '3 min ago', 'Excellent', BarChart3], ['Shopify', '8 min ago', 'Good', Target]] as const;
const toneClasses: Record<Tone, string> = {
  green: 'bg-secondary/10 text-foreground',
  blue: 'bg-secondary/10 text-foreground',
  amber: 'bg-secondary/10 text-chart-1',
  red: 'bg-chart-5/10 text-chart-5',
  slate: 'bg-secondary text-foreground',
  violet: 'bg-chart-2/10 text-chart-2'
};
const Sparkline = ({
  color = 'var(--chart-2)'
}: {
  color?: string;
}) => <svg viewBox="0 0 150 40" className="h-10 w-full" role="img" aria-label="Six month trend"><path d="M2 31 C20 28 26 21 40 26 S62 14 77 20 S98 8 113 15 S132 7 148 9" fill="none" stroke={color} strokeWidth="2.5" /></svg>;
const Section = ({
  title,
  subtitle,
  children,
  action
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => <section className="mb-5 rounded-xl border border-border bg-[var(--card)] p-5 shadow-[0_14px_40px_rgba(0,0,0,.12)]"><div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>{subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}</div>{action}</div>{children}</section>;
const AIBadge = ({
  label = 'AI-generated'
}: {
  label?: string;
}) => <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-1 text-[10px] font-medium text-foreground"><Sparkles size={11} />{label}</span>;
export const LuluComparisons = () => {
  const [mobileNav, setMobileNav] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTrend, setActiveTrend] = useState('Daily');
  const [activeTab, setActiveTab] = useState('Campaign');
  const [taskOpen, setTaskOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const { items: kpiRecords, loading, error, refresh: refreshKpis } = useLiveRecords('kpis');
  const refresh = () => {
    void refreshKpis();
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 800);
  };
  if (loading) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground">Loading live comparisons…</main>;
  if (error) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-destructive">{error}</main>;
  return <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10"><div className="mx-auto max-w-6xl"><header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs uppercase tracking-[.18em] text-muted-foreground">Intelligence / Comparisons</p><h1 className="mt-2 text-3xl font-bold">Comparisons</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Verified KPI records available for comparison. Results appear only after the backend returns compatible comparison data.</p></div><span className="inline-flex items-center rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">Use Update in the navigation bar</span></header>{kpiRecords.length < 2 ? <section className="rounded-2xl border border-dashed border-border bg-card p-10 text-center"><BarChart3 size={30} className="mx-auto text-muted-foreground" /><h2 className="mt-4 text-xl font-semibold">No compatible comparison data yet</h2><p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">At least two compatible verified KPI records are required. No differences, scores or trends are inferred without backend data.</p></section> : <section className="overflow-hidden rounded-2xl border border-border bg-card"><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">KPI</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Stage</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Updated</th></tr></thead><tbody className="divide-y divide-border">{kpiRecords.map(record => <tr key={record.id}><td className="px-4 py-3 font-medium">{record.name}</td><td className="px-4 py-3">{record.status}</td><td className="px-4 py-3 text-muted-foreground">{record.stage ?? '—'}</td><td className="max-w-md px-4 py-3 text-muted-foreground">{record.description ?? '—'}</td><td className="px-4 py-3 text-muted-foreground">{new Date(record.updatedAt).toLocaleString()}</td></tr>)}</tbody></table></div></section>}</div></main>;
  return <div className="min-h-screen bg-[var(--background)] text-foreground" style={{
    fontFamily: 'Poppins'
  }}>
    <aside className={`${mobileNav ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-20 w-60 flex-col border-r border-border bg-[var(--sidebar)] p-4 lg:flex`}>
      <div className="mb-7 flex items-center gap-3 px-2"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">L</span><span className="text-lg font-semibold text-foreground">Lulu AI</span></div>
      <LuluSectionNavigation activeId="sparkling-time-5280" />
      <div className="border-t border-border/[.07] pt-4"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/30 text-xs font-semibold text-foreground">AM</div><div><p className="text-xs font-medium text-foreground">Anna Morgan</p><p className="text-[11px] text-muted-foreground">Executive account</p></div><MoreHorizontal className="ml-auto text-muted-foreground" size={16} /></div></div>
    </aside>
    <main className="min-h-screen lg:ml-60"><div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-7 sm:py-7">
      <header className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div><button className="mb-4 lg:hidden" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu /></button><p className="mb-3 text-xs text-muted-foreground">Intelligence <span className="mx-2">/</span> Analytics <span className="mx-2">/</span> <span className="text-foreground">Comparisons</span></p><h1 className="text-3xl font-bold tracking-[-.04em] text-foreground sm:text-4xl">Comparisons</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Compare business performance, identify meaningful differences and understand what is driving them.</p></div><div className="flex flex-wrap gap-2"><button className="flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary"><Sparkles size={14} />Ask Lulu AI</button><button className="flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary"><Plus size={14} />Create Comparison</button><button className="flex h-9 items-center gap-2 rounded-md border border-border bg-secondary px-3 text-xs text-foreground hover:bg-secondary"><Download size={14} />Export</button><span className="inline-flex items-center rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">Use Update in the navigation bar</span></div></header>

      <Section title="Create a Comparison" subtitle="Configure the entities, periods and metrics you want to analyze." action={<span className="rounded-full bg-secondary/10 px-2 py-1 text-[10px] text-foreground">Configuration valid</span>}>
        <div className="grid gap-4 md:grid-cols-2"><label className="text-xs text-muted-foreground">Comparison Type<select className="mt-2 w-full rounded-md border border-border bg-[var(--secondary)] px-3 py-2.5 text-sm text-foreground"><option>Marketing Channel</option><option>Time Period</option><option>Product</option><option>Customer Segment</option><option>Advertising Platform</option><option>Country</option><option>Custom Dimension</option></select></label><label className="text-xs text-muted-foreground">Date Range<select className="mt-2 w-full rounded-md border border-border bg-[var(--secondary)] px-3 py-2.5 text-sm text-foreground"><option>Last 30 Days</option><option>Last 7 Days</option><option>Last 90 Days</option><option>Last 12 Months</option><option>Year to Date</option><option>Custom</option></select></label></div>
        <div className="my-5 grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]"><label className="rounded-lg border border-border/20 bg-secondary/[.04] p-4 text-xs text-muted-foreground">Compare A<select className="mt-2 w-full border-0 bg-transparent p-0 text-base font-medium text-foreground outline-none"><option>Google Ads</option><option>Google Analytics</option></select><span className="mt-2 block text-[11px] text-chart-4">Connected · observed data</span></label><span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-border bg-[var(--background)] text-[11px] font-bold text-muted-foreground">VS</span><label className="rounded-lg border border-border/20 bg-secondary/[.04] p-4 text-xs text-muted-foreground">Compare B<select className="mt-2 w-full border-0 bg-transparent p-0 text-base font-medium text-foreground outline-none"><option>Meta Ads</option><option>LinkedIn Ads</option></select><span className="mt-2 block text-[11px] text-chart-4">Connected · observed data</span></label></div>
        <div className="mb-4 flex flex-wrap items-center gap-2"><span className="mr-1 text-xs text-muted-foreground">Compare period:</span>{['Previous Period', 'Previous Year', 'Custom Period'].map(item => <button key={item} className={`rounded-md border px-2.5 py-1.5 text-xs ${item === 'Previous Period' ? 'border-border/30 bg-secondary/10 text-foreground' : 'border-border text-foreground'}`}>{item}</button>)}</div>
        <div><div className="mb-2 flex items-center justify-between"><span className="text-xs text-muted-foreground">Metrics / KPIs</span><button className="text-xs text-foreground">+ Add KPI</button></div><div className="flex gap-2 overflow-x-auto pb-1">{metrics.map(metric => <button key={metric} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs ${['Revenue', 'ROAS', 'CAC', 'Customers', 'Conversion Rate'].includes(metric) ? 'border-border/30 bg-secondary/10 text-foreground' : 'border-border text-foreground'}`}>{['Revenue', 'ROAS', 'CAC', 'Customers', 'Conversion Rate'].includes(metric) && <Check size={12} className="mr-1 inline" />}{metric}</button>)}</div></div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row"><button className="flex flex-1 items-center gap-2 rounded-md border border-border bg-[var(--primary)] px-3 py-2.5 text-left text-xs text-primary-foreground"><Filter size={14} />Optional filters <span className="ml-auto">None selected</span></button><button className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary">Run Comparison <ArrowRight className="ml-1 inline" size={14} /></button></div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'TikTok Ads'].map((platform, index) => <div key={platform} className="flex items-center gap-2 rounded-md border border-border/[.07] bg-secondary px-3 py-2 text-xs text-foreground"><span className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-primary' : index === 1 ? 'bg-primary' : index === 2 ? 'bg-primary' : 'bg-primary'}`} />{platform}<button className="ml-auto text-foreground"><X size={12} /></button></div>)}</div>
      </Section>

      <section className="mb-5 rounded-xl border border-border/15 bg-secondary/[.05] p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-[.14em] text-foreground">Active comparison</p><h2 className="mt-1 text-xl font-semibold text-foreground">Google Ads <span className="px-2 text-muted-foreground">vs</span> Meta Ads</h2><p className="mt-1 text-xs text-muted-foreground">Last 30 Days · Revenue, ROAS, CAC, Customers, Conversion Rate</p></div><div className="flex items-center gap-3"><div className="text-right"><strong className="text-2xl text-foreground">4/5</strong><p className="text-[11px] text-muted-foreground">KPIs won by A</p></div><div className="h-10 w-px bg-secondary" /><div className="text-right"><strong className="text-2xl text-foreground">1/5</strong><p className="text-[11px] text-muted-foreground">KPIs won by B</p></div></div></div></section>

      <Section title="Comparison Scorecard" action={<div className="flex gap-2"><button className="rounded-md border border-border p-2 text-foreground"><Activity size={14} /></button><button className="rounded-md border border-border p-2 text-foreground"><Filter size={14} /></button><button className="rounded-md bg-secondary/10 px-3 py-2 text-xs text-foreground">+ Add KPI</button></div>}><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-xs"><caption className="sr-only">Comparison scorecard for Google Ads and Meta Ads</caption><thead className="border-b border-border/[.08] text-muted-foreground"><tr>{['KPI', 'Google Ads (A)', 'Meta Ads (B)', 'Difference', '% Change', 'Better'].map(head => <th key={head} className="pb-3 font-medium">{head}</th>)}</tr></thead><tbody>{scoreRows.map(row => <tr key={row.kpi} className="border-b border-border/[.05]"><th scope="row" className="py-4 font-medium text-foreground"><BarChart3 className="mr-2 inline text-muted-foreground" size={14} />{row.kpi}</th><td className="py-4 font-medium text-foreground">{row.a}</td><td className="py-4 text-foreground">{row.b}</td><td className="py-4 text-foreground">{row.diff} <ArrowUpRight className="inline" size={13} /></td><td className="py-4 text-foreground">{row.change}</td><td className="py-4"><span className={`rounded-full px-2 py-1 ${toneClasses[row.tone]}`}>{row.better} · {row.better === 'A' ? 'Google' : 'Meta'}</span></td></tr>)}</tbody></table></div><p className="mt-4 text-[11px] italic text-muted-foreground">Lower CAC and CPC are treated as improvements. <span className="ml-2">Observed and calculated from connected sources.</span></p></Section>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]"><Section title="Performance Difference" subtitle="Relative improvement by KPI"><div className="space-y-4">{[['Revenue', '+15.7%', 52, 'A'], ['ROAS', '+16.7%', 56, 'A'], ['CAC', '+12.5%', 43, 'A'], ['Conversion', '−5.9%', 22, 'B'], ['Customers', '+29.6%', 78, 'A']].map(([label, value, width, side]) => <div key={label as string}><div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><strong className={side === 'A' ? 'text-chart-4' : 'text-foreground'}>{value} · {side} better</strong></div><div className="h-2 rounded-full bg-secondary"><div className={`h-2 rounded-full ${side === 'A' ? 'bg-primary' : 'bg-primary'}`} style={{
                    width: `${width}%`
                  }} /></div></div>)}</div></Section><Section title="Overall Winner"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-foreground"><TrendingUp /></div><div><h3 className="font-semibold text-foreground">Google Ads</h3><p className="text-xs text-muted-foreground">Outperformed in 4 of 5 KPIs</p></div></div><div className="mt-5 space-y-3 text-sm text-foreground"><p><strong className="text-foreground">Largest advantage:</strong> Customers <span className="text-chart-4">(—)</span></p><p><strong className="text-foreground">Smallest advantage:</strong> CAC <span className="text-chart-4">(−—)</span></p><p><strong className="text-foreground">Only B advantage:</strong> Conversion Rate <span className="text-foreground">(—)</span></p></div></Section></div>

      <Section title="Comparison Over Time" subtitle="Google Ads vs Meta Ads · Revenue · Last 30 Days" action={<div className="flex rounded-md border border-border p-1">{['Daily', 'Weekly', 'Monthly', 'Quarterly'].map(tab => <button key={tab} onClick={() => setActiveTrend(tab)} className={`rounded px-3 py-1.5 text-xs ${activeTrend === tab ? 'bg-secondary/20 text-foreground' : 'text-foreground'}`}>{tab}</button>)}</div>}><div className="mb-4 flex gap-4 text-xs"><span className="text-foreground">● Google Ads</span><span className="text-foreground">○ Meta Ads</span><span className="text-muted-foreground">Peak gap · Not available</span></div><div className="overflow-x-auto"><svg viewBox="0 0 900 260" className="min-w-[680px] w-full" role="img" aria-label="Dual line chart comparing Google Ads and Meta Ads revenue over thirty days"><g stroke="rgba(0,0,0,.08)">{[45, 90, 135, 180, 225].map(y => <line key={y} x1="60" x2="870" y1={y} y2={y} />)}</g><line x1="645" x2="645" y1="22" y2="225" stroke="var(--chart-2)" strokeDasharray="4 5" /><path d="M60 190 C130 175 150 182 205 156 S300 174 350 130 S440 142 485 108 S575 126 625 84 S710 96 760 60 S820 69 870 42" fill="none" stroke="var(--chart-2)" strokeWidth="3" /><path d="M60 205 C130 198 150 193 205 184 S300 190 350 163 S440 178 485 145 S575 164 625 132 S710 144 760 108 S820 126 870 96" fill="none" stroke="var(--chart-1)" strokeWidth="2.5" strokeDasharray="7 6" /><g fill="var(--muted-foreground)" fontSize="11"><text x="8" y="48">—</text><text x="15" y="140">—</text><text x="20" y="228">—</text><text x="58" y="248">Not available</text><text x="255" y="248">Not available</text><text x="450" y="248">Not available</text><text x="635" y="248">Not available</text><text x="820" y="248">Not available</text></g></svg></div><div className="mt-4 flex flex-wrap gap-2">{['Revenue', 'ROAS', 'CAC', 'Customers', 'Conversion Rate'].map((item, index) => <button key={item} className={`rounded-full border px-3 py-1.5 text-xs ${index === 0 ? 'border-border/30 bg-secondary/10 text-foreground' : 'border-border text-foreground'}`}>{item}</button>)}</div></Section>

      <Section title="KPI Comparison" subtitle="Selected KPI: Revenue"><div className="grid items-center gap-5 lg:grid-cols-[1fr_auto_1fr]"><div className="rounded-lg border border-border/15 bg-secondary/[.04] p-4"><p className="text-xs text-muted-foreground">Google Ads · A</p><p className="mt-2 text-3xl font-bold text-foreground">—</p><p className="mt-1 text-xs text-chart-4">↑ — · Positive trend</p><Sparkline /></div><div className="text-center"><p className="text-2xl font-semibold text-chart-4">+—</p><p className="text-xs text-chart-4">— difference</p></div><div className="rounded-lg border border-border/15 bg-secondary/[.04] p-4"><p className="text-xs text-muted-foreground">Meta Ads · B</p><p className="mt-2 text-3xl font-bold text-foreground">—</p><p className="mt-1 text-xs text-muted-foreground">↑ — · Positive trend</p><Sparkline color="var(--chart-1)" /></div></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-xs"><thead className="border-b border-border text-muted-foreground"><tr><th className="pb-2">Period</th><th>Google Ads</th><th>Meta Ads</th><th>Difference</th></tr></thead><tbody>{[['Jan', '—', '—', '+—'], ['Dec', '—', '—', '+—'], ['Nov', '—', '—', '+—'], ['Oct', '—', '—', '+—'], ['Sep', '—', '—', '+—'], ['Aug', '—', '—', '+—']].map(row => <tr key={row[0]} className="border-b border-border/[.05]"><td className="py-2.5 text-muted-foreground">{row[0]}</td><td className="text-foreground">{row[1]}</td><td className="text-foreground">{row[2]}</td><td className="text-foreground">{row[3]}</td></tr>)}</tbody></table></div><button className="mt-4 text-xs text-foreground">Explore in KPI Explorer <ArrowRight className="inline" size={13} /></button></Section>

      <Section title="Breakdown Comparison" subtitle="Google Ads vs Meta Ads · Breakdown by Country" action={<select className="rounded-md border border-border bg-[var(--secondary)] px-3 py-2 text-xs text-foreground"><option>Country</option><option>Product</option><option>Device</option><option>Age Group</option><option>Campaign Type</option></select>}><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-xs"><thead className="border-b border-border text-muted-foreground"><tr>{['Country', 'Google Ads Revenue', 'Meta Ads Revenue', 'Difference', 'Contribution'].map(head => <th key={head} className="pb-3 font-medium">{head}</th>)}</tr></thead><tbody>{countries.map(row => <tr key={row[1]} className="border-b border-border/[.05]"><th scope="row" className="py-3 font-medium text-foreground">{row[0]} {row[1]}</th><td className="text-foreground">{row[2]}</td><td className="text-foreground">{row[3]}</td><td className="text-foreground">{row[4]}</td><td className="text-muted-foreground">{row[5]}</td></tr>)}</tbody></table></div></Section>

      <Section title="Campaign Comparison" subtitle="Side-by-side performance by campaign"><div className="mb-4 flex gap-1 overflow-x-auto border-b border-border/[.08]">{['Segment', 'Channel', 'Campaign', 'Product', 'Geographic', 'Sales'].map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 border-b-2 px-3 py-2 text-xs ${activeTab === tab ? 'border-border text-foreground' : 'border-transparent text-foreground'}`}>{tab}</button>)}</div><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-xs"><thead className="border-b border-border text-muted-foreground"><tr>{['Campaign A', 'Campaign B', 'Spend A/B', 'ROAS A', 'ROAS B', 'Winner'].map(head => <th key={head} className="pb-3 font-medium">{head}</th>)}</tr></thead><tbody>{campaigns.map(row => <tr key={row[0]} className="border-b border-border/[.05]"><td className="py-3 text-foreground">{row[0]}</td><td className="text-foreground">{row[1]}</td><td className="text-muted-foreground">{row[2]} <span className="text-muted-foreground">/</span> {row[3]}</td><td className="text-foreground">{row[4]}</td><td className="text-foreground">{row[5]}</td><td><span className={`rounded-full px-2 py-1 ${row[6].startsWith('A') ? toneClasses.green : toneClasses.blue}`}>{row[6]}</span></td></tr>)}</tbody></table></div></Section>

      <Section title="Lulu AI Comparison Analysis" action={<div className="flex items-center gap-2"><AIBadge /><span className="text-[10px] text-muted-foreground">AI-generated · Observed + Calculated</span></div>}><div className="border-l-2 border-border pl-4"><p className="max-w-5xl text-sm leading-7 text-foreground">Google Ads generated — more revenue than Meta Ads during the selected 30-day period. The performance difference was primarily driven by a higher ROAS (4.2x vs 3.6x) and significantly lower customer acquisition cost (— vs —). While Meta Ads maintained a slightly higher conversion rate (5.1% vs 4.8%), the overall volume and efficiency favored Google Ads. The customer volume difference (+29.6%) suggests Google Ads reached a broader qualified audience in this period.</p></div><div className="mt-5 grid gap-3 md:grid-cols-3">{[['Key Differences', 'Revenue +15.7% · ROAS +16.7% · Customers +29.6%', 'Calculated'], ['Positive Findings', 'Google Ads is more efficient, has lower CAC and broader reach.', 'AI Inferred'], ['Areas of Concern', 'Meta conversion advantage, possible audience overlap, concentration risk.', 'AI Detected']].map(item => <article key={item[0]} className="rounded-lg border border-border/[.07] bg-secondary p-4"><h3 className="text-sm font-medium text-foreground">{item[0]}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{item[1]}</p><span className="mt-3 inline-block text-[10px] text-foreground">{item[2]}</span></article>)}</div><div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-lg bg-secondary/10 p-3 text-sm text-foreground">Opportunities: <strong>2 detected</strong> <button className="float-right text-xs underline">View All</button></div><div className="rounded-lg bg-secondary/10 p-3 text-sm text-foreground">Risks: <strong>1 detected</strong> <button className="float-right text-xs underline">View All</button></div></div><p className="mt-4 text-[11px] text-muted-foreground">AI-generated · Based on connected data sources · Last updated just now</p></Section>

      <Section title="AI-Detected Differences" action={<AIBadge label="AI Detected" />}><div className="space-y-1">{[['Zap', 'Revenue from Google Ads is significantly higher than Meta Ads (+15.7%)', 'High Severity', 'just now', 'red'], ['Users', 'Customer acquisition volume is substantially greater for Google Ads (+29.6%)', 'High Severity', 'just now', 'red'], ['Trending', 'Meta Ads shows higher conversion rate (+0.3pp)', 'Low Severity', 'just now', 'slate'], ['Wallet', 'CAC difference suggests different audience quality or targeting efficiency', 'Medium Severity', '2 min ago', 'amber']].map(item => <article key={item[1]} className="flex flex-wrap items-center gap-3 rounded-lg px-3 py-3 hover:bg-secondary"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground">{item[0] === 'Zap' ? <Zap size={15} /> : item[0] === 'Users' ? <Users size={15} /> : item[0] === 'Trending' ? <TrendingUp size={15} /> : <Target size={15} />}</span><p className="min-w-[240px] flex-1 text-sm text-foreground">{item[1]}</p><span className={`rounded-full px-2 py-1 text-[10px] ${item[4] === 'red' ? toneClasses.red : item[4] === 'amber' ? toneClasses.amber : toneClasses.slate}`}>{item[2]}</span><time className="text-[11px] text-muted-foreground">Detected {item[3]}</time><button className="text-xs text-foreground">Investigate</button></article>)}</div></Section>

      <Section title="Why Are They Different?" subtitle="AI-identified factors explaining the revenue difference between Google Ads and Meta Ads." action={<AIBadge label="AI Inferred" />}><div className="mx-auto max-w-3xl space-y-2"><div className="rounded-lg border border-border/20 bg-secondary/[.05] p-4 text-center"><h3 className="font-semibold text-foreground">Revenue Difference <span className="text-foreground">+—</span></h3><span className="text-[10px] text-foreground">Calculated</span></div><div className="text-center text-muted-foreground">↓</div><div className="rounded-lg border border-border/[.08] bg-secondary p-4 text-center"><h3 className="font-medium text-foreground">Customer Volume <span className="text-chart-4">— via Google Ads</span></h3><span className="text-[10px] text-chart-4">Observed</span></div><div className="text-center text-muted-foreground">↓</div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-lg border border-border/15 bg-secondary/[.04] p-4"><h3 className="font-medium text-foreground">Conversion Rate</h3><p className="mt-1 text-xs text-muted-foreground">Meta slightly higher: — vs 4.8%</p><span className="text-[10px] text-foreground">Observed</span></div><div className="rounded-lg border border-border/[.08] bg-secondary p-4"><h3 className="font-medium text-foreground">Traffic Quality</h3><p className="mt-1 text-xs text-muted-foreground">Google Ads higher-intent search traffic</p><span className="text-[10px] text-foreground">AI Inferred</span></div></div><div className="text-center text-muted-foreground">↓</div><div className="rounded-lg border border-border/[.08] bg-secondary p-4 text-center"><h3 className="font-medium text-foreground">Average Order Value <span className="text-foreground">— vs —</span></h3><p className="text-xs text-muted-foreground">Product Mix: similar distribution, no significant skew detected.</p><span className="text-[10px] text-muted-foreground">Correlated</span></div></div><p className="mt-5 text-center text-xs italic text-muted-foreground">Correlation identified. Causal relationship not confirmed. AI Inferred factors are based on pattern analysis.</p></Section>

      <Section title="Comparison Opportunities"><div className="space-y-3">{[['Test Google Ads creative strategy within Meta Ads', 'Meta Ads has lower ROAS but a slightly higher conversion rate. Applying Google Ads high-performing creative approach may improve overall ROAS.', 'High', 'ROAS gap 16.7%', 'ROAS'], ['Expand Google Ads budget to capture Meta Ads audience gap', 'Google Ads reached 29.6% more customers. Incremental budget allocation may yield proportional revenue growth.', 'Medium', 'Customer volume gap', 'Revenue, Customers']].map(item => <article key={item[0]} className="rounded-lg border border-border/[.07] bg-secondary p-4"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="font-medium text-foreground">{item[0]}</h3><p className="mt-2 max-w-4xl text-xs leading-5 text-muted-foreground">{item[1]}</p></div><span className={`h-fit rounded-full px-2 py-1 text-[10px] ${item[2] === 'High' ? toneClasses.red : toneClasses.amber}`}>{item[2]} impact</span></div><div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground"><span>Evidence: {item[3]}</span><span>Related KPI: {item[4]}</span><span className="text-foreground">Priority: {item[2]}</span><button className="ml-auto text-foreground">View Opportunity</button><button className="text-foreground">Create Task</button>{item[2] === 'High' && <button className="text-foreground">Execute with AI</button>}</div></article>)}</div></Section>
      <Section title="Comparison Risks"><article className="rounded-lg border border-border/15 bg-secondary/[.04] p-4"><div className="flex gap-3"><ShieldAlert className="mt-1 text-foreground" size={18} /><div className="flex-1"><h3 className="font-medium text-foreground">Revenue concentration in single channel</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">Google Ads accounts for a disproportionate share of attributed revenue. Over-dependence creates vulnerability to platform changes, auction shifts, or policy updates.</p><div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground"><span>Impact: High</span><span>Severity: Medium</span><span>Evidence: — vs — revenue split</span><button className="ml-auto text-foreground">View Risk</button><button className="text-foreground">Create Task</button></div></div></div></article></Section>

      <Section title="AI Recommendations" action={<AIBadge label="AI Recommended" />}><div className="grid gap-3 lg:grid-cols-3">{[['Increase investment in Google Ads', 'Outperforms Meta across 4/5 KPIs', '+12–18% revenue', 'High'], ['Investigate Meta Ads conversion advantage', 'Higher conversion rate may indicate audience quality', 'Optimization opportunity', 'Medium'], ['Replicate high-ROAS campaign structure', 'Google Ads Brand Search campaign delivers 8.2x ROAS', 'Potential ROAS improvement across Meta', 'Medium']].map(item => <article key={item[0]} className="rounded-lg border border-border/[.07] bg-secondary p-4"><h3 className="font-medium text-foreground">{item[0]}</h3><p className="mt-3 text-xs text-muted-foreground">Reason: {item[1]}</p><p className="mt-2 text-xs text-foreground">Expected Impact: {item[2]}</p><p className="mt-2 text-[11px] text-muted-foreground">Priority: {item[3]}</p><div className="mt-4 flex gap-3 text-xs"><button className="text-foreground">Review</button><button className="text-foreground">Create Task</button>{item[3] === 'High' && <button className="text-foreground">Execute with AI</button>}</div></article>)}</div></Section>

      <section className="mb-5 rounded-xl border border-border/[.08] bg-[var(--card)] p-4"><button onClick={() => setTaskOpen(!taskOpen)} className="flex w-full items-center gap-2 text-sm font-medium text-foreground"><Plus size={16} />Create Task from Finding <ChevronDown className={`ml-auto transition ${taskOpen ? 'rotate-180' : ''}`} size={15} /></button>{taskOpen && <div className="mt-4 grid gap-3 border-t border-border/[.08] pt-4 md:grid-cols-2"><label className="text-xs text-muted-foreground">Task Name<input defaultValue="Investigate Google Ads vs Meta Ads performance gap" className="mt-1 w-full rounded-md border border-border bg-[var(--secondary)] px-3 py-2 text-sm text-foreground" /></label><label className="text-xs text-muted-foreground">Owner<select className="mt-1 w-full rounded-md border border-border bg-[var(--secondary)] px-3 py-2 text-sm text-foreground"><option>Anna Morgan</option><option>David Chen</option></select></label><label className="text-xs text-muted-foreground">Priority<select className="mt-1 w-full rounded-md border border-border bg-[var(--secondary)] px-3 py-2 text-sm text-foreground"><option>High</option><option>Medium</option></select></label><label className="text-xs text-muted-foreground">Due Date<input type="date" className="mt-1 w-full rounded-md border border-border bg-[var(--secondary)] px-3 py-2 text-sm text-foreground" /></label><label className="text-xs text-muted-foreground md:col-span-2">Description<textarea defaultValue="Review the performance gap and identify actionable changes for Meta Ads." className="mt-1 h-20 w-full rounded-md border border-border bg-[var(--secondary)] px-3 py-2 text-sm text-foreground" /></label><div className="md:col-span-2"><button className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">Create Task</button><button onClick={() => setTaskOpen(false)} className="ml-2 rounded-md border border-border px-4 py-2 text-xs text-muted-foreground">Cancel</button><span className="ml-3 text-[11px] text-muted-foreground">Requires confirmation before creation</span></div></div>}</section>

      <Section title="Saved Comparisons"><div className="grid gap-3 lg:grid-cols-3">{[['Google vs Meta Performance', 'Marketing Channel', 'Revenue, ROAS, CAC', 'Last 30 Days', 'Today', '★'], ['Monthly Revenue Comparison', 'Time Period', 'Revenue, GP, Margin', 'This Month vs Last Month', '2 days ago', '☆'], ['New vs Returning Customers', 'Customer Segment', 'Revenue, LTV, Churn, CAC', 'Last 90 Days', '1 week ago', '☆']].map(item => <article key={item[0]} className="rounded-lg border border-border/[.07] bg-secondary p-4"><div className="flex justify-between"><h3 className="text-sm font-medium text-foreground">{item[0]}</h3><span className="text-foreground">{item[5]}</span></div><p className="mt-3 text-xs text-foreground">{item[1]}</p><p className="mt-1 text-xs text-muted-foreground">{item[2]}</p><p className="mt-2 text-xs text-muted-foreground">{item[3]} · Updated {item[4]}</p><div className="mt-4 flex gap-3 text-[11px] text-muted-foreground"><button className="text-foreground">Open</button><button>Edit</button><button>Duplicate</button><button>Delete</button></div></article>)}</div></Section>

      <Section title="Ask Lulu AI" action={<Sparkles className="text-foreground" size={18} />}><div className="flex items-center gap-3 rounded-lg border border-border/20 bg-[var(--secondary)] px-4 py-3"><Search size={17} className="text-muted-foreground" /><input className="flex-1 bg-transparent text-sm text-foreground outline-none" placeholder="Ask why these results are different..." /><button className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground">Ask</button></div><div className="mt-3 flex flex-wrap gap-2">{['Why is Google Ads performing better than Meta Ads?', 'What is driving the revenue difference?', 'Is this difference statistically significant?', 'Which KPI explains the most variation?', 'What should I do next?', 'Can you create a report from this comparison?'].map(q => <button key={q} className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:border-border/30 hover:text-foreground">{q}</button>)}</div><button onClick={() => setAiOpen(!aiOpen)} className="mt-5 flex w-full items-center gap-2 rounded-lg border border-border/[.07] bg-secondary p-3 text-left text-xs text-foreground"><span className="text-foreground">● AI Response · Just now</span><ChevronDown className={`ml-auto ${aiOpen ? 'rotate-180' : ''}`} size={14} /></button>{aiOpen && <p className="border-x border-b border-border/[.07] p-4 text-sm leading-6 text-muted-foreground">The revenue difference is primarily driven by customer volume, with Google Ads acquiring — more customers at a 12.5% lower acquisition cost. While Meta Ads shows a marginally higher conversion rate, the volume gap is the dominant factor. I recommend reviewing the prospecting campaign structure on Meta Ads, as this is where the largest volume gap exists.</p>}</Section>

      <div className="grid gap-5 xl:grid-cols-2"><Section title="Data Sources"><div className="grid gap-2 sm:grid-cols-2">{sources.map(([name, sync, quality, Icon]) => <article key={name} className="rounded-lg border border-border/[.07] bg-secondary p-3"><div className="flex items-center gap-2"><Icon size={15} className="text-foreground" /><h3 className="text-sm text-foreground">{name}</h3><span className="ml-auto h-2 w-2 rounded-full bg-chart-4" /></div><p className="mt-3 text-xs text-muted-foreground">Connected · Last sync: {sync}</p><span className="mt-2 inline-block rounded-full bg-chart-4/10 px-2 py-1 text-[10px] text-chart-4">{quality}</span></article>)}</div></Section><Section title="Comparison Data Quality"><div className="space-y-4">{[['Coverage', '96%', 96, 'Excellent'], ['Freshness', 'Excellent', 92, 'Healthy'], ['Completeness', '94%', 94, 'Good'], ['Reliability', 'High', 96, 'High']].map(item => <div key={item[0]}><div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{item[0]}</span><span className="text-foreground">{item[1]}</span></div><div className="h-1.5 rounded-full bg-secondary"><div className="h-1.5 rounded-full bg-primary text-primary-foreground" style={{
                    width: `${item[2]}%`
                  }} /></div></div>)}</div><p className="mt-4 text-xs text-muted-foreground">No missing data detected for selected date range and metrics.</p></Section></div>
      <Section title="Comparison History"><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="border-b border-border text-muted-foreground"><tr>{['Event', 'User', 'Action', 'Timestamp'].map(head => <th key={head} className="pb-3 font-medium">{head}</th>)}</tr></thead><tbody>{history.map(row => <tr key={row[0]} className="border-b border-border/[.05]"><td className="py-3 text-foreground">{row[0]}</td><td className="text-muted-foreground">{row[1]}</td><td className="text-foreground">{row[2]}</td><td className="text-muted-foreground">{row[3]}</td></tr>)}</tbody></table></div></Section>
      <Section title="Start Another Comparison" subtitle="Select two periods, entities or segments to begin analyzing differences."><div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary py-8 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-foreground"><ArrowRight size={22} /></div><h3 className="mt-3 font-medium text-foreground">Create your first comparison</h3><p className="mt-1 text-xs text-muted-foreground">Your current comparison is active. Start another configuration when ready.</p><button className="mt-4 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">Create Comparison</button></div></Section>
      <footer className="flex flex-wrap justify-between gap-3 border-t border-border/[.07] py-6 text-[11px] text-muted-foreground"><span>Lulu AI Core Platform · Comparison data is based on connected sources.</span><span>Last updated just now · <button className="text-foreground">View in Reports →</button></span></footer>
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

