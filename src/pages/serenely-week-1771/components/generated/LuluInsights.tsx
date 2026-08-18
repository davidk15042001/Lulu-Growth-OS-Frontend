import { useState } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Check, ChevronDown, CircleHelp, Clock3, Download, FileText, Globe2, LayoutGrid, Menu, RefreshCw, Search, Share2, ShieldAlert, SlidersHorizontal, Sparkles, Star, Target, Users, X, Zap } from 'lucide-react';
type Tone = 'violet' | 'orange' | 'amber' | 'red' | 'green' | 'slate' | 'blue';
const toneClasses: Record<Tone, string> = {
  violet: 'bg-secondary text-foreground',
  orange: 'bg-secondary text-foreground',
  amber: 'bg-secondary text-foreground',
  red: 'bg-chart-5/10 text-chart-5',
  green: 'bg-secondary text-foreground',
  slate: 'bg-secondary text-muted-foreground',
  blue: 'bg-secondary text-foreground'
};
const importanceBorder: Record<string, string> = {
  Critical: 'border-l-chart-5',
  High: 'border-l-chart-1',
  Medium: 'border-l-chart-1',
  Low: 'border-l-border'
};
const insights = [['Customer Acquisition Efficiency Is Declining', 'Cross-Business', 'High', 'Today 09:42', '5 evidence', 'Action Required', 'Paid acquisition costs increased while conversion stayed stable.'], ['Organic Search Is Growing Faster Than Paid Channels', 'Marketing', 'High', 'Today 08:15', '4 evidence', 'New', 'Organic traffic +31% over 8 weeks while paid efficiency declined.'], ['Enterprise Segment Growing Significantly Faster Than SMB', 'Customer', 'High', 'Yesterday', '6 evidence', 'Reviewed', 'Enterprise +24.1% vs SMB +1.2%, with higher LTV.'], ['Average Order Value Increased Across All Segments', 'Revenue', 'Medium', 'Yesterday', '4 evidence', 'New', 'AOV +8.3%, led by Enterprise at +14.2%.'], ['Email Shows High Contribution to High-Value Conversions', 'Marketing', 'Medium', '2 days ago', '3 evidence', 'Saved', 'Attribution context shows email assisting 62% of journeys.'], ['Customer Retention Began Declining After Stability', 'Customer', 'High', '2 days ago', '4 evidence', 'Action Required', 'Retention shifted after three months of stability.'], ['UK Market Diverging From Other European Markets', 'Market', 'Medium', '3 days ago', '5 evidence', 'Reviewed', 'UK -4% while other European markets grew.'], ['Product SKU-4421 Demand Spike: Emerging Signal', 'Product', 'Medium', '3 days ago', '2 evidence', 'New', 'Early signal with limited confidence.']] as const;
const filters = ['Business Area', 'Insight Type', 'Importance', 'Confidence', 'Status', 'Last 30 Days', 'Source'];
const changed = [['Customer Acquisition Cost', '42 EUR', '57 EUR', '+15 EUR (+35.7%)', 'Last 14 days', 'Observed'], ['Conversion Rate', '3.8%', '3.7%', '-0.1pp', 'Last 14 days', 'Observed'], ['Advertising Spend', '18000 EUR', '24000 EUR', '+6000 EUR (+33.3%)', 'Last 14 days', 'Observed'], ['ROAS', '4.2', '3.1', '-1.1 (-26.2%)', 'Last 14 days', 'Calculated'], ['New Customers Acquired', '428', '421', '-7 (-1.6%)', 'Last 14 days', 'Observed']] as const;
const evidence = [['Advertising CAC Trend', 'Advertising Intelligence', 'CAC 42 → 57 EUR · +35.7% over 14 days', 'Observed'], ['ROAS Anomaly', 'Anomaly Detection', 'ROAS 26.2% below expected range', 'AI Detected'], ['Advertising Spend Attribution', 'Attribution', 'Spend share increased without proportional conversion uplift', 'Modeled'], ['New Customer Acquisition', 'Customer Intelligence', '-1.6% despite +33% spend', 'Observed'], ['Revenue vs Spend', 'Revenue Intelligence', 'Revenue +12% vs spend +33%', 'Calculated']] as const;
const sources = [['Shopify', '20 min ago', 'Excellent'], ['Google Analytics', '45 min ago', 'Good'], ['Google Ads', '1h ago', 'Good'], ['Meta Ads', '2h ago', 'Good'], ['CRM', '30 min ago', 'Excellent'], ['Email Platform', '3h ago', 'Good'], ['LinkedIn Ads', '8h ago', 'Limited']] as const;
const related = [['Related Insight', 'Organic Search Growing Faster Than Paid', 'Open'], ['Related Anomaly', 'ROAS Anomaly · High · Action Required', 'Open'], ['Related Trend', 'Advertising CAC · Increasing / Strong', 'Open'], ['Related Recommendation', 'Investigate rising CAC · Urgent', 'View'], ['Related Risk', 'Rising CAC compressing margin · High', 'View'], ['Related Task', 'Review advertising campaigns · James K.', 'View']] as const;
function Badge({
  children,
  tone = 'slate',
  icon
}: {
  children: React.ReactNode;
  tone?: Tone;
  icon?: React.ReactNode;
}) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${toneClasses[tone]}`}>{icon}{children}</span>;
}
function Section({
  title,
  subtitle,
  action,
  children,
  className = ''
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`mb-5 rounded-xl border border-border bg-card p-5 shadow-[0_4px_18px_rgba(0,0,0,.045)] ${className}`}><header className="mb-4 flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-[16px] font-semibold tracking-[-.02em] text-foreground">{title}</h2>{subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}</div>{action}</header>{children}</section>;
}
function Sidebar() {
  return <aside className="fixed inset-y-0 left-0 z-20 hidden w-[68px] flex-col items-center border-r border-border bg-[var(--sidebar)] py-5 lg:flex"><div className="mb-8 flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">L</div><LuluSectionNavigation activeId="serenely-week-1771" /><button className="rounded-lg p-3 text-foreground" aria-label="Help"><CircleHelp size={19} /></button><div className="mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-foreground">AM</div></aside>;
}
export const LuluInsights = () => {
  const [saved, setSaved] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 700);
  };
  return <div className="min-h-screen bg-[var(--background)] font-sans text-foreground"><Sidebar />{mobileNav && <div className="fixed inset-0 z-30 bg-[var(--background)] p-5 text-foreground lg:hidden"><button onClick={() => setMobileNav(false)} aria-label="Close navigation"><X /></button><p className="mt-8 text-sm text-foreground">AI Intelligence</p><p className="mt-4 font-semibold">AI Insights</p></div>}<main className="lg:ml-[68px]"><div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-8 lg:px-10">
    <header className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div><button onClick={() => setMobileNav(true)} className="mb-3 lg:hidden" aria-label="Open navigation"><Menu size={22} /></button><p className="mb-3 text-xs text-muted-foreground">Intelligence <span className="mx-2">/</span> AI Intelligence <span className="mx-2">/</span> <span className="font-medium text-foreground">AI Insights</span></p><h1 className="text-3xl font-bold tracking-[-.045em] text-foreground sm:text-[38px]">AI <span className="text-foreground">Insights</span></h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Understand the most important patterns, changes and discoveries Lulu AI has identified across your business.</p></div><div className="flex flex-wrap gap-2"><button className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary"><Sparkles size={14} />Ask Lulu AI</button><button onClick={refresh} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs text-foreground"><RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />Refresh Insights</button><button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs text-foreground"><FileText size={14} />Create Report</button><button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs text-foreground"><Download size={14} />Export</button></div></header>
    <section className="mb-5 rounded-xl border border-border bg-secondary/70 p-4"><div className="flex flex-wrap items-center gap-x-6 gap-y-3"><div><p className="text-[11px] text-foreground">Insights Analyzed</p><strong className="text-lg text-foreground">14 <span className="text-xs font-normal text-muted-foreground">business areas</span></strong></div><div><p className="text-[11px] text-foreground">Active Insights</p><strong className="text-lg text-foreground">8</strong></div><div><p className="text-[11px] text-foreground">New Insights</p><strong className="text-lg text-foreground">3</strong></div><Badge tone="orange" icon={<AlertTriangle size={12} />}>4 High-Impact</Badge><div className="text-xs text-muted-foreground"><Clock3 className="mr-1 inline" size={13} />Last analysis 47 min ago</div><div className="text-xs text-foreground"><Check className="mr-1 inline" size={13} />Data freshness: Good</div><div className="text-xs text-muted-foreground">7 sources analyzed</div><Badge tone="violet" icon={<Sparkles size={12} />}>AI-generated</Badge></div><p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">Lulu AI analyzed 14 business areas across 7 connected data sources and identified 8 significant insights.</p></section>
    <Section title="Featured Insight" action={<div className="flex flex-wrap gap-2"><Badge tone="amber">Featured</Badge><Badge tone="orange">High Importance</Badge><Badge tone="violet">Cross-Business Insight</Badge><Badge tone="violet" icon={<Sparkles size={12} />}>AI-generated</Badge><span className="text-[11px] text-muted-foreground">Detected: Today 09:42</span></div>} className="overflow-hidden border-l-4 border-l-border bg-gradient-to-r from-secondary/70 via-white to-white"><div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between"><div className="max-w-3xl"><h2 className="text-2xl font-bold tracking-[-.035em] text-foreground">Customer Acquisition Efficiency Is Declining</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Paid acquisition costs increased significantly while conversion rates remained stable, meaning the same conversion efficiency is achieved at materially higher cost. This reduces the return on advertising investment without a corresponding improvement in customer quality.</p></div><div className="flex shrink-0 flex-wrap gap-2"><Badge tone="orange" icon={<AlertTriangle size={12} />}>High impact</Badge><Badge tone="green" icon={<Check size={12} />}>High confidence</Badge></div></div><div className="mt-5 grid gap-2 border-y border-border py-4 sm:grid-cols-2 xl:grid-cols-4">{[['CAC', '42 EUR → 57 EUR', '+35.7%'], ['Conversion Rate', '3.8% → 3.7%', 'Stable'], ['Ad Spend', '18000 → 24000 EUR', '+33.3%'], ['ROAS', '4.2 → 3.1', '-26.2%']].map(item => <div key={item[0]} className="rounded-lg bg-secondary p-3"><p className="text-[11px] text-muted-foreground">{item[0]}</p><strong className="mt-1 block text-sm text-foreground">{item[1]}</strong><span className={`text-xs font-semibold ${item[2] === 'Stable' ? 'text-muted-foreground' : item[2].startsWith('-') ? 'text-chart-5' : 'text-foreground'}`}>{item[2]} · <span className="font-normal text-muted-foreground">Observed</span></span></div>)}</div><div className="flex flex-wrap items-center gap-3 pt-1 text-xs"><span>Business area: <strong>Advertising + Revenue</strong></span><span>Impact: <strong className="text-foreground">High</strong></span><span>Evidence: <strong>Strong</strong></span><div className="ml-auto flex flex-wrap gap-2"><button className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Explore Insight</button><button className="rounded-lg border border-border px-3 py-2">Ask Lulu AI</button><button className="rounded-lg border border-border px-3 py-2">View Evidence</button><button onClick={() => setSaved(!saved)} className="rounded-lg border border-border p-2" aria-label="Save insight"><Star size={15} fill={saved ? 'var(--foreground)' : 'none'} className={saved ? 'text-foreground' : ''} /></button><button className="rounded-lg border border-border p-2" aria-label="Share"><Share2 size={15} /></button><button onClick={() => setTaskOpen(true)} className="rounded-lg border border-border px-3 py-2">Create Task</button></div></div></Section>
    <section className="mb-5 rounded-xl border border-border bg-card p-3 shadow-sm"><div className="flex flex-wrap gap-2">{filters.map(filter => <select key={filter} aria-label={filter} className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground"><option>{filter}</option><option>All</option></select>)}<span className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-secondary px-3 text-xs text-foreground">Saved <X size={12} /></span><span className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-secondary px-3 text-xs text-foreground">New <X size={12} /></span></div></section>
    <Section title="Latest Insights" subtitle="Sorted by relevance and recency" action={<div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">8 insights</span><button className="rounded-lg border border-border p-2" aria-label="Filter insights"><SlidersHorizontal size={15} /></button></div>}><div className="grid gap-3 xl:grid-cols-2">{insights.map((item, index) => <article key={item[0]} tabIndex={0} className={`rounded-lg border border-border border-l-4 ${importanceBorder[item[2]]} p-4 transition hover:-translate-y-0.5 hover:shadow-md`}><div className="flex items-start gap-3"><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2"><Badge tone={item[1] === 'Cross-Business' ? 'violet' : 'slate'}>{item[1]}</Badge><Badge tone={item[2] === 'High' ? 'orange' : 'amber'} icon={item[2] === 'High' ? <AlertTriangle size={11} /> : undefined}>{item[2]}</Badge><span className="text-[11px] text-muted-foreground">{item[3]}</span></div><h3 className="text-[15px] font-semibold leading-5 text-foreground">{item[0]}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{item[6]}</p></div><button onClick={() => setSaved(!saved)} aria-label={`Save ${item[0]}`} className="text-foreground hover:text-foreground"><Star size={16} /></button></div><div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3"><Badge tone="slate" icon={<BarChart3 size={11} />}>{item[4]}</Badge>{index === 4 && <Badge tone="violet">Attribution Context</Badge>}{index === 5 && <Badge tone="red">Action Required</Badge>}{index === 7 && <Badge tone="amber">Limited Confidence</Badge>}<Badge tone={item[5] === 'Action Required' ? 'red' : item[5] === 'Reviewed' ? 'slate' : item[5] === 'Saved' ? 'amber' : 'violet'}>{item[5]}</Badge><div className="ml-auto flex gap-3 text-xs"><button className="font-medium text-foreground">Open</button><button className="text-foreground">Share</button><button onClick={() => setTaskOpen(true)} className="text-foreground">Create Task</button></div></div></article>)}</div></Section>
    <Section title="Insight Detail" subtitle="Cross-Business · Advertising + Revenue · Detected Today 09:42" action={<div className="flex flex-wrap gap-2"><Badge tone="orange">High importance</Badge><Badge tone="green">High confidence</Badge><select className="rounded-full border border-border bg-card px-3 py-1 text-[11px]"><option>Action Required</option><option>Reviewed</option><option>Resolved</option></select></div>}><div className="flex flex-wrap gap-2 border-b border-border pb-4"><button className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Ask Lulu AI</button><button className="rounded-lg border border-border px-3 py-2 text-xs">View Evidence</button><button onClick={() => setSaved(!saved)} className="rounded-lg border border-border px-3 py-2 text-xs">{saved ? 'Unsave' : 'Save'}</button><button className="rounded-lg border border-border px-3 py-2 text-xs">Favorite</button><button className="rounded-lg border border-border px-3 py-2 text-xs">Share</button><button onClick={() => setTaskOpen(true)} className="rounded-lg border border-border px-3 py-2 text-xs">Create Task</button><button className="rounded-lg border border-border px-3 py-2 text-xs">Create Report</button></div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]"><div><Section title="What Changed" subtitle="Previous / current comparison · Last 14 days"><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-xs"><caption className="sr-only">Insight metric changes</caption><thead className="border-b border-border text-[11px] text-muted-foreground"><tr>{['Metric', 'Previous', 'Current', 'Change', 'Period', 'Label'].map(head => <th key={head} className="pb-3 font-medium">{head}</th>)}</tr></thead><tbody>{changed.map(row => <tr key={row[0]} className="border-b border-border"><th scope="row" className="py-3 font-medium text-foreground">{row[0]}</th><td>{row[1]}</td><td className="font-semibold text-foreground">{row[2]}</td><td className={row[3].startsWith('-') ? 'font-semibold text-chart-5' : 'font-semibold text-foreground'}>{row[3]}</td><td className="text-muted-foreground">{row[4]}</td><td><Badge tone={row[5] === 'Calculated' ? 'violet' : 'green'}>{row[5]}</Badge></td></tr>)}</tbody></table></div></Section><Section title="Supporting Evidence" action={<div className="flex items-center gap-2"><span className="text-xs font-semibold text-foreground">Strong</span><span className="flex gap-1">{[1, 2, 3, 4].map(segment => <i key={segment} className="h-2 w-8 rounded-full bg-primary text-primary-foreground" />)}</span></div>}><div className="space-y-2">{evidence.map(row => <article key={row[0]} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3"><div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-foreground"><Activity size={14} /></div><div className="min-w-[180px] flex-1"><h3 className="text-xs font-semibold text-foreground">{row[0]}</h3><p className="mt-1 text-xs text-muted-foreground">{row[1]} · {row[2]}</p></div><Badge tone={row[3] === 'Observed' ? 'green' : 'violet'}>{row[3]}</Badge><button className="text-xs text-foreground">Open</button></article>)}</div><p className="mt-3 text-[11px] text-muted-foreground">Five independent data sources confirm consistent changes over the same period. Evidence strength is distinct from AI confidence.</p></Section></div><div><Section title="Why This Matters" action={<Badge tone="violet" icon={<Sparkles size={12} />}>AI-generated</Badge>} className="border-l-2 border-l-border"><p className="text-sm leading-7 text-muted-foreground">Advertising spend increased by 33.3% while the number of customers acquired declined slightly. The additional spend is not producing proportionally more customers — acquisition cost has risen 35.7% per customer. Since conversion rates remained stable, the efficiency loss is concentrated in the cost of reaching potential customers, not in the conversion process itself.</p><p className="mt-3 text-[11px] text-muted-foreground">Interpretation is based on observed data. It does not constitute causal proof.</p></Section><Section title="Related Metrics"><div className="space-y-2">{[['Revenue', 'up 12%', 'Observed'], ['Advertising Spend', 'up 33.3%', 'Observed'], ['CAC', 'up 35.7%', 'Observed'], ['Conversion Rate', 'stable -0.1pp', 'Observed'], ['ROAS', 'down 26.2%', 'Calculated'], ['Organic Traffic', 'up 31%', 'Correlated']].map(row => <div key={row[0]} className="flex items-center gap-2 border-b border-border py-2 text-xs"><span className="w-32 text-muted-foreground">{row[0]}</span><strong className={row[1].startsWith('down') ? 'text-chart-5' : 'text-foreground'}>{row[1]}</strong><span className="ml-auto"><Badge tone={row[2] === 'Observed' ? 'green' : row[2] === 'Calculated' ? 'violet' : 'slate'}>{row[2]}</Badge></span></div>)}</div><p className="mt-3 text-[11px] italic text-muted-foreground">Correlation does not imply causation.</p></Section></div></div>
    </Section>
    <Section title="Cross-Module Evidence" subtitle="Pattern analysis across connected intelligence modules"><div className="mx-auto max-w-2xl">{[['Advertising Intelligence', 'Spend increased +33%', 'Observed'], ['Marketing Intelligence', 'Traffic increased +28%', 'Observed'], ['Ecommerce Intelligence', 'Conversion remained stable -0.1pp', 'Observed'], ['Revenue Intelligence', 'Revenue grew +12% (less than spend)', 'Calculated'], ['AI Insight', 'Advertising efficiency is declining', 'AI-generated']].map((node, index) => <div key={node[0]} className="flex items-center gap-3"><div className="flex flex-1 items-center gap-3 rounded-lg border border-border bg-card p-3"><div className={`h-2.5 w-2.5 rounded-full ${index === 4 ? 'bg-primary' : 'bg-muted'}`} /><div className="flex-1"><strong className="text-sm text-foreground">{node[0]}</strong><p className="mt-1 text-xs text-muted-foreground">{node[1]}</p></div><Badge tone={node[2] === 'Observed' ? 'green' : 'violet'}>{node[2]}</Badge></div>{index < 4 && <ArrowDownRight size={16} className="text-foreground" />}</div>)}</div><p className="mt-4 text-center text-[11px] italic text-muted-foreground">AI Insight is generated from cross-module pattern analysis. It does not constitute a causal claim.</p></Section>
    <div className="grid gap-5 xl:grid-cols-2"><Section title="Trend Context" action={<button className="text-xs font-medium text-foreground">View in Trends →</button>}><div className="flex items-end gap-1 border-b border-border pb-3 pt-2" aria-label="CAC sparkline"><svg viewBox="0 0 300 65" className="h-16 w-full" role="img" aria-label="CAC stable then rising sharply"><path d="M4 48 C45 47 72 49 102 47 S154 50 180 46 S210 38 226 24 S260 18 296 7" fill="none" stroke="var(--chart-2)" strokeWidth="3" /><path d="M4 48 C45 47 72 49 102 47 S154 50 180 46 S210 38 226 24 S260 18 296 7 L296 64 L4 64Z" fill="var(--background)" /></svg></div><div className="mt-3 flex justify-between text-xs"><span>Historical: <strong>Stable</strong></span><span>Current: <strong className="text-foreground">Increasing</strong></span><span>42 EUR → 57 EUR · Observed</span></div></Section><Section title="Anomaly Context" action={<button className="text-xs font-medium text-foreground">View Anomaly →</button>}><div className="flex items-center gap-3 rounded-lg bg-chart-5/10 p-4"><ShieldAlert className="text-chart-5" /><div><h3 className="text-sm font-semibold text-foreground">ROAS Anomaly</h3><p className="mt-1 text-xs text-muted-foreground">Today 09:45 · Deviation <strong className="text-chart-5">-26.2%</strong> · Status: Action Required</p><Badge tone="violet">AI Detected</Badge></div></div></Section><Section title="Forecast Context" action={<button className="text-xs font-medium text-foreground">View Forecast →</button>}><p className="text-sm text-muted-foreground">If CAC trend continues, forecast range is <strong>68–74 EUR</strong> at 30 days vs expected 43–47 EUR.</p><div className="mt-3 flex gap-2"><Badge tone="violet">Forecast</Badge><Badge tone="violet">Predictive</Badge><span className="text-[11px] text-muted-foreground">Not observed</span></div></Section><Section title="Benchmark Context" action={<button className="text-xs font-medium text-foreground">View Benchmarks →</button>}><p className="text-sm text-muted-foreground">Business CAC: <strong>57 EUR</strong> vs industry benchmark <strong>38–48 EUR</strong>.</p><p className="mt-2 text-xs text-foreground">+9 to +19 EUR above benchmark · External Benchmark Data</p></Section><Section title="Attribution Context" action={<button className="text-xs font-medium text-foreground">View Attribution →</button>}><p className="text-sm leading-6 text-muted-foreground">Data-Driven Attribution: Meta Ads 28% last-touch · Google 32% first-touch · Email 62% of high-value journeys as assist.</p><Badge tone="violet">Modeled · Data-Driven Attribution</Badge></Section><Section title="Customer Context"><p className="text-sm text-muted-foreground"><strong>Enterprise +24.1%</strong> · Avg LTV 2840 EUR<br /><strong>SMB +1.2%</strong> · Avg new customer LTV 1920 EUR</p><p className="mt-3 text-[11px] text-muted-foreground">No personally identifiable information displayed. · Observed</p></Section></div>
    <Section title="Lulu AI Interpretation" action={<Badge tone="violet" icon={<Sparkles size={12} />}>AI-generated</Badge>} className="border-l-2 border-l-border"><div className="grid gap-4 md:grid-cols-2">{[['What happened', 'Advertising spend increased 33% while customers acquired declined slightly, raising per-customer cost 35.7%.'], ['Why it matters', 'Each new customer costs significantly more without improved conversion efficiency or customer value.'], ['What evidence supports it', '5 independent sources confirm CAC increase, ROAS decline, stable conversion and spend increase over 14 days.'], ['What may explain it', 'Rising platform CPMs, audience saturation, creative performance decline or changing traffic mix. None confirmed.']].map(item => <div key={item[0]} className="rounded-lg bg-secondary/60 p-4"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">{item[0]}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item[1]}</p></div>)}</div><p className="mt-4 text-[11px] text-muted-foreground">Interpretation is based on observed data. It does not constitute causal proof.</p></Section>
    <div className="grid gap-5 xl:grid-cols-2"><Section title="Possible Explanations"><div className="space-y-2">{[['Rising ad platform CPMs', 'Medium', 'AI Inferred'], ['Audience saturation in current targeting', 'Medium', 'AI Inferred'], ['Creative performance decline', 'Medium', 'Correlated'], ['Seasonal demand shift', 'Low', 'AI Inferred'], ['Data source change', 'Very Low', 'Checked']].map(row => <div key={row[0]} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3 text-xs"><Zap size={14} className="text-foreground" /><span className="flex-1 font-medium text-foreground">{row[0]}</span><span className="text-muted-foreground">Confidence: {row[1]}</span><Badge tone={row[2] === 'Checked' ? 'green' : row[2] === 'Correlated' ? 'slate' : 'violet'}>{row[2]}</Badge></div>)}</div><p className="mt-3 text-[11px] italic text-muted-foreground">Possible explanations are AI-inferred. Causation cannot be confirmed from correlation alone.</p></Section><Section title="Related Intelligence"><div className="space-y-2">{related.map(row => <div key={row[1]} className="flex items-center gap-3 rounded-lg border border-border p-3"><div className="rounded-lg bg-secondary p-2 text-foreground"><ArrowRight size={14} /></div><div className="flex-1"><p className="text-xs font-medium text-foreground">{row[0]}</p><p className="mt-1 text-xs text-muted-foreground">{row[1]}</p></div><button className="text-xs font-medium text-foreground">{row[2]}</button></div>)}</div></Section></div>
    <div className="grid gap-5 xl:grid-cols-2"><Section title="Recommendation Handoff" action={<button className="text-xs text-foreground">View Recommendation →</button>}><p className="text-sm text-foreground">Investigate the cause of rising Advertising CAC before reallocating budget.</p><p className="mt-3 text-xs text-muted-foreground">Priority: <strong className="text-chart-5">Urgent</strong> · Impact: High</p></Section><Section title="Opportunity Handoff" action={<button className="text-xs text-foreground">View Opportunity →</button>} className="border-l-2 border-l-chart-4 bg-chart-4/30"><p className="text-sm text-foreground">Organic Search efficiency improving as paid costs rise. Expanding content may improve blended acquisition efficiency.</p><p className="mt-3 text-xs text-muted-foreground">Impact: <strong className="text-chart-4">High</strong> · Priority: Medium</p></Section><Section title="Risk Handoff" action={<button className="text-xs text-foreground">View Risk →</button>} className="border-l-2 border-l-chart-5"><p className="text-sm text-foreground">Rising CAC without corresponding LTV increase compresses acquisition ROI.</p><p className="mt-3 text-xs text-muted-foreground">Severity: <strong className="text-chart-5">High</strong> · Impact: High</p></Section><Section title="Decision Handoff" action={<button className="text-xs text-foreground">Review Decision →</button>}><p className="text-sm text-foreground">Review advertising budget allocation given current CAC and ROAS trajectory.</p><p className="mt-3 text-xs text-muted-foreground">Options: Maintain · Shift to organic · Reduce paid · Investigate and hold</p></Section></div>
    {taskOpen && <section className="mb-5 rounded-xl border border-border bg-card p-5 shadow-lg"><div className="flex items-center justify-between"><h2 className="text-base font-semibold text-foreground">Create Task from Insight</h2><button onClick={() => setTaskOpen(false)} aria-label="Close task form"><X size={17} /></button></div><div className="mt-4 grid gap-3 border-t border-border pt-4 md:grid-cols-2"><label className="text-xs text-muted-foreground">Task name<input defaultValue="Investigate rising CAC" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" /></label><label className="text-xs text-muted-foreground">Owner<select className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"><option>James K.</option><option>Sarah M.</option></select></label><label className="text-xs text-muted-foreground">Priority<select className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"><option>High</option><option>Medium</option></select></label><label className="text-xs text-muted-foreground">Due date<input type="date" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" /></label><label className="text-xs text-muted-foreground md:col-span-2">Description<textarea defaultValue="Review evidence and investigate rising advertising CAC before reallocating budget." className="mt-1 h-16 w-full rounded-lg border border-border px-3 py-2 text-sm" /></label><div className="md:col-span-2"><button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Create Task</button><button onClick={() => setTaskOpen(false)} className="ml-2 rounded-lg border border-border px-4 py-2 text-xs">Cancel</button><span className="ml-3 text-[11px] text-muted-foreground">Confirmation required</span></div></div></section>}
    <Section title="Ask Lulu AI" action={<Sparkles className="text-foreground" size={18} />} className="border-border bg-secondary/30"><div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"><Search size={17} className="text-muted-foreground" /><input value={query} onChange={event => setQuery(event.target.value)} className="flex-1 bg-transparent text-sm outline-none" placeholder="Ask Lulu AI about this insight..." /><button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Ask</button></div><div className="mt-3 flex flex-wrap gap-2">{['Why is this important?', 'What changed?', 'Show me the evidence', 'What caused this?', 'Is this temporary or structural?', 'Which business areas are affected?', 'Is this a risk?', 'Is this an opportunity?', 'What should I do?', 'Create a task'].map(question => <button key={question} onClick={() => setQuery(question)} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground hover:bg-secondary">{question}</button>)}</div>{query && <p className="mt-4 rounded-lg bg-card p-3 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">Lulu AI:</strong> This insight matters because acquisition efficiency is declining despite stable conversion. I can show the evidence or explore possible explanations.</p>}</Section>
    <div className="grid gap-5 xl:grid-cols-2"><Section title="Saved Insights"><div className="space-y-2">{[['Customer Acquisition Efficiency', 'High · Action Required', 'Today'], ['Enterprise Segment Growth', 'High · Reviewed', 'Yesterday'], ['Organic Search Growth', 'Medium · New', 'Today']].map(row => <div key={row[0]} className="flex items-center gap-3 border-b border-border py-3"><Star size={15} className="text-foreground" fill="var(--foreground)" /><div className="flex-1"><h3 className="text-xs font-medium text-foreground">{row[0]}</h3><p className="mt-1 text-xs text-muted-foreground">{row[1]} · {row[2]}</p></div><button className="text-xs text-foreground">Open</button></div>)}</div></Section><Section title="Insight Sources" action={<Badge tone="green">Overall: Good</Badge>}><div className="grid gap-2 sm:grid-cols-2">{sources.map(row => <div key={row[0]} className="rounded-lg border border-border p-3"><div className="flex items-center gap-2"><Globe2 size={14} className="text-foreground" /><strong className="text-xs text-foreground">{row[0]}</strong><i className={`ml-auto h-2 w-2 rounded-full ${row[2] === 'Limited' ? 'bg-chart-1' : 'bg-primary'}`} /></div><p className="mt-1 text-[11px] text-muted-foreground">Synced {row[1]} · {row[2]}</p></div>)}</div><p className="mt-3 text-[11px] text-muted-foreground">LinkedIn Ads delayed 8h. Advertising Intelligence insights may have limited freshness.</p></Section></div>
    <Section title="Insight Data Quality" action={<Badge tone="green" icon={<Check size={12} />}>Good</Badge>}><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{[['Freshness', '47 min ago'], ['Completeness', '91%'], ['Coverage', '14 business areas'], ['Synchronization', '6/7 sources synced'], ['Source Health', 'Good']].map(row => <div key={row[0]} className="rounded-lg bg-card p-3"><p className="text-[11px] text-muted-foreground">{row[0]}</p><strong className="mt-1 block text-sm text-foreground">{row[1]}</strong><div className="mt-3 h-1 rounded-full bg-chart-4" /></div>)}</div></Section>
    <footer className="flex flex-wrap justify-between gap-3 border-t border-border py-6 text-[11px] text-muted-foreground"><span>Lulu AI Core Platform · Insights are based on connected business intelligence.</span><span>Last updated 47 min ago · <button className="text-foreground">View in Reports →</button></span></footer>
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
