import { useState } from 'react';
import { Activity, ArrowUpRight, BarChart3, Bell, Bot, BriefcaseBusiness, CalendarDays, ChevronDown, Download, Filter, GripVertical, LayoutDashboard, MoreHorizontal, Plus, RefreshCw, Search, Settings2, Sparkles } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type Deal = {
  name: string;
  company: string;
  owner: string;
  initials: string;
  value: string;
  probability: string;
  health: string;
  priority: string;
  close: string;
  action: string;
};
type Kpi = {
  label: string;
  value: string;
  note: string;
  delta: string;
  tone: string;
};
const kpis: Kpi[] = [];
const stages: Array<{ name: string; count?: string; total?: string; weighted?: string; deals: Deal[] }> = [];
const owners: any[][] = [];
const activity: any[][] = [];
const aging: any[][] = [];
const insights: any[][] = [];
function Badge({
  children,
  className = ''
}: {
  children: string;
  className?: string;
}) {
  return <span className={`inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-semibold tracking-wide ${className}`}>{children}</span>;
}
function SectionTitle({
  eyebrow,
  title,
  action
}: {
  eyebrow?: string;
  title: string;
  action?: string;
}) {
  return <div className="mb-4 flex items-end justify-between gap-4"><div>{eyebrow && <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>}<h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2></div>{action && <button className="text-xs font-medium text-foreground hover:text-foreground">{action} <span>→</span></button>}</div>;
}
export function LuluSalesPipeline() {
  const [period, setPeriod] = useState('Quarter to Date');
  const [query, setQuery] = useState('');
  const [view, setView] = useState('Kanban');
  const [selectedFilter, setSelectedFilter] = useState('Stage');
  const { items: dealRecords, loading: dealsLoading, error: dealsError } = useLiveRecords('sales_deals');
  const getDealField = (record: typeof dealRecords[number], key: string) => String((record as unknown as Record<string, unknown>)[key] ?? '');
  const liveDealValue = dealRecords.reduce((sum, record) => sum + (Number(getDealField(record, 'valueAmount').replace(/[^0-9.-]/g, '')) || 0), 0);
  const formatAmount = (value: number) => value ? value.toLocaleString() : '—';
  const liveKpis: Kpi[] = [];
  const liveStages = stages.map(stage => ({ ...stage, deals: dealRecords.filter(record => (getDealField(record, 'stage') || 'Discovery').toLowerCase() === stage.name.toLowerCase()).map(record => ({ name: getDealField(record, 'name') || record.id, company: getDealField(record, 'company') || 'Connected account', owner: getDealField(record, 'ownerName') || 'Workspace owner', initials: '—', value: getDealField(record, 'valueAmount') || '—', probability: getDealField(record, 'probability') ? `${getDealField(record, 'probability')}%` : '—', health: getDealField(record, 'health') || 'Unclassified', priority: getDealField(record, 'priority') || 'Standard', close: getDealField(record, 'closeDate') || '—', action: getDealField(record, 'nextAction') || 'Review deal details' })) }));
  const filteredStages = (dealsLoading ? [] : liveStages).map(stage => ({
    ...stage,
    deals: stage.deals.filter(deal => `${deal.name} ${deal.company} ${deal.owner}`.toLowerCase().includes(query.toLowerCase()))
  }));
  return <main className="min-h-screen bg-[var(--background)] text-foreground">
    <div className="flex min-h-screen">
      <aside className="hidden w-[232px] shrink-0 border-r border-border bg-[var(--sidebar)] px-4 py-5 lg:block">
        <div className="mb-9 flex items-center gap-3 px-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary text-sm font-black text-primary-foreground">L</div><div><p className="text-sm font-semibold text-foreground">LULU AI</p><p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Core Platform</p></div></div>
        <LuluSectionNavigation activeId="sweet-evening-7753" />
        <div className="mt-[260px] rounded-xl border border-border bg-secondary p-3"><div className="mb-2 flex items-center gap-2 text-xs font-medium text-foreground"><Bot size={15} className="text-foreground" /> Lulu AI</div><p className="text-[11px] leading-5 text-muted-foreground">Your revenue copilot is ready to help.</p><button className="mt-3 text-[11px] font-semibold text-foreground">Ask Lulu →</button></div>
      </aside>
      <section className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-[var(--background)]/95 px-5 backdrop-blur md:px-8"><div className="flex items-center gap-3 text-xs text-muted-foreground"><span>Sales</span><span>/</span><span className="text-foreground">Pipeline</span></div><div className="flex items-center gap-4"><button aria-label="Notifications" className="text-foreground hover:text-foreground"><Bell size={17} /></button><div className="flex items-center gap-2 border-l border-border pl-4"><div className="grid h-7 w-7 place-items-center rounded-full bg-secondary/20 text-[10px] font-bold text-foreground">SJ</div><span className="hidden text-xs text-foreground sm:block">Workspace owner</span><ChevronDown size={14} className="text-muted-foreground" /></div></div></header>
        <div className="space-y-8 px-5 py-7 md:px-8 lg:px-10">{dealsError && <div role="alert" className="rounded-lg border border-chart-5/30 bg-chart-5/10 px-4 py-3 text-sm text-chart-5">Sales pipeline data could not be loaded. Check sales deal records and try again.</div>}{!dealsLoading && !dealsError && dealRecords.length === 0 && <div className="rounded-lg border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground">No sales deals are available yet.</div>}
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground">Revenue intelligence</p><h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground md:text-4xl">Sales Pipeline</h1><p className="mt-2 text-sm text-muted-foreground">Visualize, manage and optimize your sales pipeline from opportunity to close.</p></div><div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/20 hover:bg-primary"><Plus size={16} /> Create Deal</button><button className="inline-flex items-center gap-2 rounded-lg border border-border/30 bg-secondary/10 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/20"><Bot size={15} /> Ask Lulu AI</button><button className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm text-foreground hover:bg-secondary md:inline-flex"><Settings2 size={15} /> Pipeline Settings</button><button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm text-foreground hover:bg-secondary"><Download size={15} /> Export</button><button aria-label="More actions" className="rounded-lg border border-border px-3 text-foreground hover:bg-secondary"><MoreHorizontal size={17} /></button></div></div>
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-[var(--secondary)] p-4 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pipeline</span><button className="flex min-w-[210px] items-center justify-between rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground">Default Sales Pipeline <ChevronDown size={15} className="text-muted-foreground" /></button></div><div className="h-px flex-1 bg-secondary" /><div className="flex gap-1 overflow-x-auto">{['Today', 'Last 7 Days', 'Last 30 Days', 'Month to Date', 'Previous Month', 'Quarter to Date', 'Previous Quarter', 'Year to Date', 'Previous Year'].map(item => <button key={item} onClick={() => setPeriod(item)} className={`whitespace-nowrap rounded-md px-2.5 py-2 text-[11px] ${period === item ? 'bg-secondary font-semibold text-foreground' : 'text-foreground hover:text-foreground'}`}>{item}</button>)}</div></div>
          <section aria-label="Pipeline summary" className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">{(dealsLoading ? [] : liveKpis).map(kpi => <article key={kpi.label} className="rounded-xl border border-border bg-[var(--card)] p-4"><div className="mb-4 flex items-start justify-between gap-2"><p className="text-[11px] leading-4 text-muted-foreground">{kpi.label}</p><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${kpi.tone === 'green' ? 'bg-chart-4' : kpi.tone === 'orange' ? 'bg-chart-1' : kpi.tone === 'amber' ? 'bg-chart-1' : kpi.tone === 'purple' ? 'bg-primary' : 'bg-primary'}`} /></div><p className="text-xl font-semibold tracking-tight text-foreground">{kpi.value}</p><div className="mt-3 flex flex-wrap items-center gap-1.5"><span className="text-[10px] text-chart-4">{kpi.delta}</span><Badge className="border-border bg-secondary text-muted-foreground">{kpi.note}</Badge></div></article>)}</section>
          <section><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><div className="relative"><Search size={15} className="absolute left-3 top-2.5 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search pipeline..." className="w-56 rounded-lg border border-border bg-[var(--secondary)] py-2 pl-9 pr-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-border/50" /></div><div className="hidden items-center gap-1 xl:flex">{['Stage', 'Owner', 'Team', 'Value', 'Probability', 'Health', 'Priority', 'Expected Close'].map(filter => <button key={filter} onClick={() => setSelectedFilter(filter)} className={`inline-flex items-center gap-1 rounded-md border px-2 py-2 text-[11px] ${selectedFilter === filter ? 'border-border/40 bg-secondary/10 text-foreground' : 'border-border text-foreground hover:text-foreground'}`}>{filter}<ChevronDown size={12} /></button>)}</div></div><div className="flex items-center gap-2"><button className="hidden items-center gap-1 text-xs text-foreground hover:text-foreground md:flex"><Filter size={14} /> Clear Filters</button><button className="hidden rounded-md border border-border px-2.5 py-2 text-xs text-foreground hover:text-foreground md:block">Save Filter</button><div className="flex rounded-lg border border-border p-0.5">{['Kanban', 'Table', 'Compact'].map(item => <button key={item} onClick={() => setView(item)} className={`rounded-md px-2.5 py-1.5 text-[11px] ${view === item ? 'bg-secondary text-foreground' : 'text-foreground'}`}>{item}</button>)}</div></div></div>
            <div className="mb-4 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{period}</p><h2 className="mt-1 text-lg font-semibold text-foreground">Pipeline board</h2></div><div className="flex items-center gap-2 text-[11px] text-muted-foreground"><RefreshCw size={13} /> Updated 4 min ago</div></div>
            <div className="overflow-x-auto rounded-xl border border-border bg-[var(--secondary)] p-3"><div className="flex min-w-[1120px] gap-3">{filteredStages.map(stage => <div key={stage.name} className={`flex w-[218px] shrink-0 flex-col rounded-lg ${stage.name === 'Closed Won' ? 'bg-secondary/[0.04]' : 'bg-secondary'} p-2`}><div className="mb-3 border-b border-border px-2 pb-3"><div className="flex items-center justify-between"><h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground">{stage.name}</h3><MoreHorizontal size={14} className="text-muted-foreground" /></div><p className="mt-2 text-[11px] text-muted-foreground">{stage.count} · {stage.total}</p>{stage.weighted && <p className="mt-1 text-[10px] text-foreground/70">{stage.weighted} weighted</p>}</div><div className="space-y-2">{stage.deals.map(deal => <article key={deal.name} className={`rounded-lg border p-3 shadow-lg shadow-black/10 ${stage.name === 'Closed Won' ? 'border-border/20 bg-secondary/[0.08]' : 'border-border bg-[var(--card)]'} hover:border-border/40`}><div className="mb-2 flex items-start justify-between gap-2"><div><h4 className="text-xs font-semibold leading-4 text-foreground">{deal.name}</h4><p className="mt-0.5 text-[10px] text-muted-foreground">{deal.company}</p></div><GripVertical size={14} className="shrink-0 text-muted-foreground" /></div><div className="mb-3 flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-secondary/15 text-[8px] font-bold text-foreground">{deal.initials}</span><span className="text-[10px] text-muted-foreground">{deal.owner}</span></div><div className="flex items-center justify-between text-xs"><strong className="text-foreground">{deal.value}</strong><span className="text-chart-4">{deal.probability}</span></div><div className="mt-2 flex flex-wrap gap-1"><Badge className={deal.health === 'Healthy' || deal.health === 'Won' ? 'border-chart-4/20 bg-chart-4/10 text-chart-4' : deal.health === 'At Risk' ? 'border-chart-1/20 bg-chart-1/10 text-chart-1' : 'border-chart-1/20 bg-chart-1/10 text-chart-1'}>{deal.health}</Badge><Badge className={deal.priority === 'High' ? 'border-chart-5/20 bg-chart-5/10 text-chart-5' : 'border-border text-muted-foreground'}>{deal.priority}</Badge></div><div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-[10px] text-muted-foreground"><span className="flex items-center gap-1"><CalendarDays size={11} />{deal.close}</span></div><p className="mt-2 truncate text-[10px] text-foreground/80">Next: {deal.action}</p></article>)}{stage.deals.length < 3 && <p className="px-2 py-2 text-[10px] text-muted-foreground">+{stage.name === 'Closed Won' ? '16' : stage.name === 'Negotiation' ? '2' : stage.name === 'Proposal' ? '5' : stage.name === 'Discovery' ? '7' : '9'} more</p>}</div><button className="mt-3 flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-border py-2 text-[11px] text-foreground hover:border-border/40 hover:text-foreground"><Plus size={13} /> Add Deal</button></div>)}</div></div>
          </section>
          <div className="grid gap-5 xl:grid-cols-2"><section className="rounded-xl border border-border bg-[var(--card)] p-5"><SectionTitle eyebrow="Portfolio view" title="Pipeline Value Breakdown" action="View report" /><div className="flex items-center gap-7"><div className="grid h-36 w-36 shrink-0 place-items-center rounded-full" style={{
                  background: 'conic-gradient(var(--primary) 0 48%, var(--primary) 48% 74%, var(--primary) 74% 89%, var(--primary) 89% 96%, var(--destructive) 96% 100%)'
                }}><div className="grid h-24 w-24 place-items-center rounded-full bg-[var(--secondary)]"><div className="text-center"><p className="text-xl font-semibold text-foreground">€3.24M</p><p className="text-[10px] text-muted-foreground">total value</p></div></div></div><div className="grid flex-1 grid-cols-2 gap-x-5 gap-y-3">{[['Open', '€3.24M', 'bg-primary'], ['Weighted', '€1.85M', 'bg-primary'], ['Won', '€1.19M', 'bg-primary'], ['At Risk', '€420K', 'bg-chart-1'], ['Stalled', '€186K', 'bg-chart-1'], ['Lost', '€84K', 'bg-destructive']].map(item => <div key={item[0]} className="flex items-center justify-between gap-2 text-xs"><span className="flex items-center gap-2 text-muted-foreground"><i className={`h-2 w-2 rounded-full ${item[2]}`} />{item[0]}</span><strong className="text-foreground">{item[1]}</strong></div>)}</div></div></section><section className="rounded-xl border border-border bg-[var(--card)] p-5"><SectionTitle eyebrow="Conversion" title="Pipeline Funnel" action="Click to filter" /><div className="space-y-2">{[['Qualified', '47 deals', '€3.24M', '—', 'w-full'], ['Discovery', '9 deals', '€240K', '76% conversion', 'w-[84%]'], ['Proposal', '7 deals', '€310K', '78% conversion', 'w-[68%]'], ['Negotiation', '4 deals', '€420K', '57% conversion', 'w-[51%]'], ['Won', '18 deals', '€1.19M', '34% win rate', 'w-[38%]']].map(row => <button key={row[0]} className="flex w-full items-center gap-3 text-left"><span className="w-24 text-xs font-medium text-foreground">{row[0]}</span><span className={`h-8 rounded-r-md bg-gradient-to-r from-secondary/80 to-secondary/50 ${row[4]}`} /><span className="ml-auto w-14 text-right text-[10px] text-muted-foreground">{row[1]}</span><span className="w-20 text-right text-xs font-semibold text-foreground">{row[2]}</span><span className="w-24 text-right text-[10px] text-muted-foreground">{row[3]}</span></button>)}</div></section></div>
          <section className="rounded-xl border border-border bg-[var(--card)] p-5"><SectionTitle eyebrow="Stage performance" title="Stage Conversion" /><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-xs"><thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Stage', 'Entered', 'Advanced', 'Won', 'Lost', 'Conversion Rate', 'Avg Time in Stage'].map(x => <th key={x} className="pb-3 font-semibold">{x}</th>)}</tr></thead><tbody>{[['Qualification', '18', '12', '—', '2', '66.7%', '14 days'], ['Discovery', '14', '9', '—', '1', '64.3%', '21 days'], ['Proposal', '9', '7', '—', '1', '77.8%', '18 days'], ['Negotiation', '7', '4', '2', '—', '57.1%', '34 days'], ['Closed Won', '18', '—', '18', '—', '34.2%', '—']].map(row => <tr key={row[0]} className="border-b border-border last:border-0"><td className="py-3 font-medium text-foreground">{row[0]}</td>{row.slice(1).map((cell, i) => <td key={`${row[0]}-${i}`} className="py-3 text-muted-foreground">{cell}{i === 4 && <span className="ml-2 text-foreground">↗ 2.1%</span>}</td>)}</tr>)}</tbody></table></div></section>
          <section><SectionTitle eyebrow="Velocity" title="Pipeline Velocity" /><div className="grid grid-cols-2 gap-3 md:grid-cols-5">{[['Avg Qualification to Close', '87 days'], ['Avg Stage Duration', '18 days'], ['Deals Progressing / Week', '4.2'], ['Avg Deal Value', '€68,936'], ['Win Rate', '34.2%']].map(item => <article key={item[0]} className="rounded-xl border border-border bg-[var(--card)] p-4"><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className="mt-3 text-xl font-semibold text-foreground">{item[1]}</p><p className="mt-2 text-[10px] text-foreground">↗ 4.8% <span className="text-muted-foreground">· Calculated</span></p></article>)}</div></section>
          <section><SectionTitle eyebrow="Time intelligence" title="Pipeline Aging" /><div className="grid gap-3 md:grid-cols-4">{aging.map(item => <article key={item[0]} className="rounded-xl border border-border bg-[var(--card)] p-4"><div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${item[5]}`} /><h3 className="text-sm font-semibold text-foreground">{item[0]}</h3><span className="text-[10px] text-muted-foreground">{item[1]}</span></div><p className="mt-4 text-xl font-semibold text-foreground">{item[3]}</p><p className="mt-1 text-xs text-muted-foreground">{item[2]} <span className="text-muted-foreground">· {item[4]} of pipeline</span></p><div className="mt-4 flex gap-2"><button className="rounded-md bg-secondary px-2.5 py-1.5 text-[10px] text-foreground hover:bg-secondary">Review Deals</button><button className="rounded-md px-2 py-1.5 text-[10px] text-foreground hover:bg-secondary/10">Ask Lulu AI</button></div></article>)}</div></section>
          <section className="rounded-xl border border-chart-1/15 bg-[var(--card)] p-5"><SectionTitle eyebrow="Requires attention" title="Stalled Deals" action="View all 5" /><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-xs"><thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Deal', 'Company', 'Stage', 'Value', 'Days in Stage', 'Last Activity', 'Expected Close', 'Risk', 'Recommended Action'].map(x => <th key={x} className="pb-3 font-semibold">{x}</th>)}</tr></thead><tbody>{[['Enterprise Expansion', 'Connected account', 'Negotiation', '€210K', '68 days', '12 days ago', 'Sep 25', 'High', 'Schedule follow-up'], ['Connected account', 'Clearpath', 'Discovery', '€38K', '45 days', '8 days ago', 'Sep 18', 'Medium', 'Re-engage champion']].map(row => <tr key={row[0]} className="border-b border-border last:border-0">{row.map((cell, i) => <td key={`${row[0]}-${i}`} className="py-3 text-muted-foreground">{i === 0 ? <strong className="text-foreground">{cell}</strong> : i === 7 ? <Badge className="border-chart-1/20 bg-chart-1/10 text-chart-1">{cell}</Badge> : cell}</td>)}</tr>)}</tbody></table></div></section>
          <section className="rounded-xl border border-chart-5/15 bg-[var(--card)] p-5"><SectionTitle eyebrow="AI monitored" title="At-Risk Pipeline" action="View all risks" /><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-xs"><thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Deal', 'Value', 'Stage', 'Probability', 'Health', 'Risk Signal', 'Expected Close', 'Actions'].map(x => <th key={x} className="pb-3 font-semibold">{x}</th>)}</tr></thead><tbody>{[['Enterprise Expansion', '€210K', 'Negotiation', '82%', 'At Risk', 'No recent activity (7+ days)', 'Sep 25'], ['Meridian Tech Suite', '€45K', 'Qualification', '55%', 'Needs Attention', 'Probability decline detected', 'Aug 22'], ['Connected account', '€38K', 'Discovery', '58%', 'Needs Attention', 'Stage aging threshold exceeded', 'Sep 18']].map(row => <tr key={row[0]} className="border-b border-border last:border-0">{row.map((cell, i) => <td key={`${row[0]}-${i}`} className="py-3 text-muted-foreground">{i === 0 ? <strong className="text-foreground">{cell}</strong> : i === 4 ? <Badge className="border-border/20 bg-secondary/10 text-foreground">{cell}</Badge> : i === 5 ? <span className="text-foreground">{cell}</span> : cell}</td>)}<td className="py-3"><button className="text-[11px] text-foreground hover:text-foreground">Open →</button></td></tr>)}</tbody></table></div></section>
          <section className="rounded-xl border border-border bg-[var(--card)] p-5"><SectionTitle eyebrow="Target health" title="Pipeline Coverage" /><div className="grid gap-5 md:grid-cols-3"><div><p className="text-[11px] text-muted-foreground">Revenue Target <span className="text-muted-foreground">· Configured</span></p><p className="mt-2 text-2xl font-semibold text-foreground">€1,000,000</p></div><div><p className="text-[11px] text-muted-foreground">Open Pipeline <span className="text-muted-foreground">· Recorded</span></p><p className="mt-2 text-2xl font-semibold text-foreground">€3,240,000</p></div><div><p className="text-[11px] text-muted-foreground">Weighted Pipeline <span className="text-muted-foreground">· Calculated</span></p><p className="mt-2 text-2xl font-semibold text-foreground">€1,847,500</p></div></div><div className="mt-6"><div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">Coverage ratio</span><strong className="text-foreground">3.2×</strong></div><div className="h-2 rounded-full bg-secondary"><div className="h-2 w-[80%] rounded-full bg-gradient-to-r from-primary to-primary text-primary-foreground" /></div><p className="mt-3 text-[11px] text-muted-foreground">Coverage does not guarantee revenue outcomes.</p></div></section>
          <section><SectionTitle eyebrow="Forecast horizon" title="Expected Close Distribution" /><div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{[['This Week', '3 deals', '€125K weighted'], ['Next Week', '5 deals', '€290K'], ['This Month', '9 deals', '€680K'], ['Next Month', '14 deals', '€1.1M'], ['Later', '12 deals', '€780K'], ['No Close Date', '4 deals', '€265K']].map(item => <button key={item[0]} className="rounded-xl border border-border bg-[var(--primary)] p-4 text-left hover:border-border/40 text-primary-foreground"><p className="text-xs font-medium text-foreground">{item[0]}</p><p className="mt-3 text-lg font-semibold text-foreground">{item[2]}</p><p className="mt-1 text-[11px] text-muted-foreground">{item[1]}</p></button>)}</div></section>
          <section className="rounded-xl border border-border bg-[var(--card)] p-5"><SectionTitle eyebrow="Performance" title="Pipeline by Owner" action="Sort columns" /><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-xs"><thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Owner', 'Open Deals', 'Pipeline Value', 'Weighted Pipeline', 'Won Value', 'At-Risk Value', 'Win Rate'].map(x => <th key={x} className="pb-3 font-semibold">{x} ↕</th>)}</tr></thead><tbody>{owners.map(row => <tr key={row[0]} className="border-b border-border last:border-0"><td className="flex items-center gap-2 py-3 font-medium text-foreground"><span className="grid h-6 w-6 place-items-center rounded-full bg-secondary/15 text-[9px] text-foreground">{row[1]}</span>{row[0]}</td>{row.slice(2).map((cell, i) => <td key={`${row[0]}-${i}`} className="py-3 text-muted-foreground">{cell}</td>)}</tr>)}</tbody></table></div></section>
          <section className="rounded-xl border border-border bg-[var(--card)] p-5"><SectionTitle eyebrow="Performance" title="Pipeline by Team" action="Sort columns" /><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-xs"><thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Team', 'Open Deals', 'Pipeline Value', 'Weighted Pipeline', 'Won Value', 'At-Risk Value', 'Win Rate'].map(x => <th key={x} className="pb-3 font-semibold">{x} ↕</th>)}</tr></thead><tbody>{[['Enterprise Sales', '18', '€1.42M', '€890K', '€480K', '€210K', '38.6%'], ['SMB Sales', '14', '€680K', '€390K', '€315K', '€82K', '32.1%'], ['Strategic Accounts', '9', '€760K', '€420K', '€275K', '€96K', '35.8%'], ['Partner Sales', '6', '€380K', '€147K', '€125K', '€32K', '28.4%']].map(row => <tr key={row[0]} className="border-b border-border last:border-0"><td className="py-3 font-medium text-foreground">{row[0]}</td>{row.slice(1).map((cell, i) => <td key={`${row[0]}-${i}`} className="py-3 text-muted-foreground">{cell}</td>)}</tr>)}</tbody></table></div></section>
          <section className="grid gap-3 md:grid-cols-3"><article className="rounded-xl border border-border bg-[var(--card)] p-4"><p className="text-xs font-semibold text-foreground">Your pipeline is empty</p><p className="mt-1 text-[11px] text-muted-foreground">Create or import deals to start building your forecast.</p><div className="mt-3 flex gap-2"><button className="rounded-md bg-primary px-2.5 py-1.5 text-[10px] text-primary-foreground">Create Deal</button><button className="rounded-md border border-border px-2.5 py-1.5 text-[10px] text-foreground">Import Deals</button><button className="px-2 py-1.5 text-[10px] text-foreground">Ask Lulu AI</button></div></article><article className="rounded-xl border border-border/15 bg-secondary/[0.04] p-4"><p className="text-xs font-semibold text-foreground">No significant pipeline risks detected</p><p className="mt-1 text-[11px] text-muted-foreground">AI will continue monitoring deal health and activity.</p></article><article className="rounded-xl border border-border bg-[var(--card)] p-4"><p className="text-xs font-semibold text-foreground">No stalled deals</p><p className="mt-1 text-[11px] text-muted-foreground">Deals exceeding stage thresholds will appear here.</p><button className="mt-3 inline-flex items-center gap-1 text-[10px] text-foreground"><RefreshCw size={12} /> Retry update</button></article></section>
          <section className="rounded-xl border border-chart-5/15 bg-chart-5/[0.03] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold text-chart-5">Some pipeline data could not be updated</p><p className="mt-1 text-[11px] text-muted-foreground">AI insights and stage health are temporarily unavailable. Your recorded data is safe.</p></div><button className="inline-flex items-center gap-2 rounded-md border border-border/20 px-3 py-2 text-[11px] text-foreground"><RefreshCw size={13} /> Retry</button></div></section>
          <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]"><div><SectionTitle eyebrow="AI-assisted" title="AI Pipeline Insights" /><div className="grid gap-3">{insights.map(item => <article key={item[0]} className="rounded-xl border border-border/20 bg-gradient-to-r from-secondary/[0.12] to-[var(--card)] p-4"><div className="flex items-start gap-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary/15 text-foreground"><Sparkles size={16} /></div><div><div className="flex items-center gap-2"><h3 className="text-sm font-semibold text-foreground">{item[0]}</h3><Badge className="border-border/25 bg-secondary/10 text-foreground">AI-generated</Badge></div><p className="mt-2 text-xs leading-5 text-muted-foreground">{item[1]}</p><div className="mt-3 flex gap-2"><button className="rounded-md bg-secondary/15 px-2.5 py-1.5 text-[10px] font-medium text-foreground">Review Deals</button><button className="rounded-md border border-border px-2.5 py-1.5 text-[10px] text-foreground">Ask Lulu AI</button></div></div></div></article>)}</div></div><div><SectionTitle eyebrow="Suggested next steps" title="AI Recommendations" /><div className="space-y-2">{['Prioritize Negotiation stalled deals · 2 deals, €305K value', 'Review expected close dates for Q3 · 5 deals with dates in the past', 'Update probabilities for aging Proposal deals', 'Schedule executive-level contacts for at-risk opportunities'].map(item => <article key={item} className="rounded-lg border border-border bg-[var(--card)] p-3"><div className="flex gap-2"><Sparkles size={14} className="mt-0.5 shrink-0 text-foreground" /><p className="text-xs leading-5 text-foreground">{item}</p></div><div className="mt-2 flex gap-2 pl-5"><button className="text-[10px] text-foreground">Review</button><button className="text-[10px] text-foreground">Create Task</button></div></article>)}</div><p className="mt-3 text-[10px] text-muted-foreground">AI does not automatically modify pipeline records.</p></div></section>
          <section className="grid gap-5 xl:grid-cols-2"><div className="rounded-xl border border-border bg-[var(--secondary)] p-5"><SectionTitle eyebrow="Live feed" title="Recent Pipeline Activity" action="View activity" /><div className="space-y-4">{activity.map(item => <div key={item[1]} className="flex gap-3"><div className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground"><Activity size={12} /></div><div className="min-w-0 flex-1"><p className="text-xs text-foreground"><strong>{item[0]}:</strong> {item[1]}</p><p className="mt-1 text-[10px] text-muted-foreground">{item[2]} · {item[3]}</p></div></div>)}</div></div><div className="rounded-xl border border-border/25 bg-gradient-to-br from-secondary/[0.12] to-[var(--secondary)] p-5"><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary/15 text-foreground"><Bot size={17} /></div><div><h2 className="text-lg font-semibold text-foreground">Ask Lulu AI</h2><p className="text-[11px] text-muted-foreground">Your sales intelligence copilot</p></div></div><div className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-primary/10 px-3 py-3"><input placeholder="Ask Lulu AI about your sales pipeline..." className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground" /><button aria-label="Send prompt" className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground"><ArrowUpRight size={14} /></button></div><div className="mt-4 flex flex-wrap gap-2">{['What should my team focus on today?', 'Where is my pipeline bottleneck?', 'Which deals are most likely to close?', 'Which deals are at risk?', 'What is my pipeline coverage?', 'Which deals are stalled?'].map(prompt => <button key={prompt} className="rounded-full border border-border px-2.5 py-1.5 text-[10px] text-foreground hover:border-border/30 hover:text-foreground">{prompt}</button>)}</div></div></section>
          <section className="rounded-xl border border-border bg-secondary p-4"><div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-muted-foreground"><span className="font-semibold text-muted-foreground">Data transparency</span><span>🔵 Recorded</span><span>🟣 Calculated</span><span>🟡 Rule-based</span><span>🤖 AI-generated</span><span>📈 Forecast</span><span>⚠️ Unavailable</span></div></section>
        </div>
      </section>
    </div>
  </main>;
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
