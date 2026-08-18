import { useState } from 'react';
import { Activity, BarChart3, Bell, CheckCircle2, CheckSquare, ChevronDown, CircleDollarSign, Download, FileText, Filter, LayoutDashboard, KanbanSquare, MoreHorizontal, Search, Settings2, Sparkles, Target, TrendingUp, Upload, Users, X, Zap } from 'lucide-react';
type BadgeKind = 'target' | 'recorded' | 'calculated' | 'ai';
type GoalStatus = 'On Track' | 'At Risk' | 'Exceeded' | 'Draft';
const navItems = [['Overview', LayoutDashboard], ['Sales Goals', Target], ['Pipeline', KanbanSquare], ['Leads', Users], ['Deals', CheckCircle2], ['Forecast', TrendingUp], ['Activities', Activity], ['Tasks', CheckSquare], ['Commissions', CircleDollarSign], ['Reports', FileText], ['Analytics', BarChart3]] as const;
const goals = [['Quarterly Revenue', 'Revenue', 'Maria Chen', '€250,000', '€184,000', '73.6%', '€66,000', 'On Track', 'Today'], ['New Customers', 'New Customer', 'James Park', '50', '34', '68.0%', '16', 'At Risk', 'Yesterday'], ['Pipeline Value', 'Pipeline', 'David Torres', '€800,000', '€620,000', '77.5%', '€180,000', 'On Track', '2 days ago'], ['DACH Revenue', 'Revenue', 'Sarah Johnson', '€150,000', '€162,000', '108.0%', '—', 'Exceeded', 'Today'], ['Enterprise Deals', 'Deal', 'Maria Chen', '12', '7', '58.3%', '5', 'At Risk', '3 days ago'], ['Product A Revenue', 'Product', 'James Park', '€80,000', '€55,000', '68.8%', '€25,000', 'At Risk', 'Yesterday'], ['Team Alpha Target', 'Revenue', 'Team Alpha', '€300,000', '€228,000', '76.0%', '€72,000', 'On Track', 'Today'], ['Activity Goal', 'Activity', 'David Torres', '200', '168', '84.0%', '32', 'On Track', 'Today'], ['Retention Goal', 'Retention', 'Sarah Johnson', '95%', '96.2%', '101.3%', '—', 'Exceeded', 'Today'], ['UK Region', 'Revenue', 'Tom Wilson', '€120,000', '—', '—', '—', 'Draft', '1 week ago']] as const;
const teams = [['Team Alpha', '€300,000', '€228,000', '76.0%', '€72,000', '3', '1'], ['Team Beta', '€250,000', '€178,000', '71.2%', '€72,000', '2', '2'], ['Team DACH', '€200,000', '€216,000', '108.0%', '—', '2', '0']] as const;
const reps = [['Maria Chen', '€250,000', '€184,000', '73.6%', '€66,000', '€420,000', '€238,000', 'On Track'], ['James Park', '€200,000', '€142,000', '71.0%', '€58,000', '€310,000', '€195,000', 'At Risk'], ['David Torres', '€180,000', '€148,000', '82.2%', '€32,000', '€260,000', '€182,000', 'On Track'], ['Sarah Johnson', '€150,000', '€162,000', '108.0%', '—', '€210,000', '€165,000', 'Exceeded'], ['Tom Wilson', '€120,000', '€84,000', '70.0%', '€36,000', '€190,000', '€118,000', 'At Risk']] as const;
function Badge({
  kind
}: {
  kind: BadgeKind;
}) {
  const labels = {
    target: 'Target',
    recorded: 'Recorded',
    calculated: 'Calculated',
    ai: 'AI-generated'
  };
  const styles = {
    target: 'bg-secondary text-muted-foreground',
    recorded: 'bg-secondary text-foreground',
    calculated: 'bg-secondary text-foreground',
    ai: 'bg-secondary text-foreground'
  };
  return <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${styles[kind]}`}>{kind === 'ai' && <Sparkles size={11} />}<span>{labels[kind]}</span></span>;
}
function StatusPill({
  status
}: {
  status: GoalStatus;
}) {
  const style = {
    'On Track': 'bg-chart-4/10 text-chart-4',
    'At Risk': 'bg-chart-1/10 text-chart-1',
    Exceeded: 'bg-secondary text-foreground',
    Draft: 'bg-secondary text-muted-foreground'
  }[status];
  const dot = {
    'On Track': 'bg-chart-4',
    'At Risk': 'bg-chart-1',
    Exceeded: 'bg-primary',
    Draft: 'bg-muted'
  }[status];
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}><span className={`h-1.5 w-1.5 rounded-full ${dot}`} />{status}</span>;
}
function SectionHeader({
  eyebrow,
  title,
  action
}: {
  eyebrow?: string;
  title: string;
  action?: string;
}) {
  return <div className="mb-4 flex items-end justify-between gap-4"><div>{eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-[0.13em] text-foreground">{eyebrow}</p>}<h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2></div>{action && <button className="text-sm font-semibold text-foreground hover:text-foreground">{action}</button>}</div>;
}
export function SalesGoals() {
  const [period, setPeriod] = useState('Current Quarter');
  const [trend, setTrend] = useState('Weekly');
  const [query, setQuery] = useState('');
  const [dismissed, setDismissed] = useState<string[]>([]);
  const periods = ['Current Month', 'Current Quarter', 'Current Year', 'Custom'];
  const filteredGoals = goals.filter(goal => goal.join(' ').toLowerCase().includes(query.toLowerCase()));
  const kpis = [['Total Target', '€1,000,000', 'target', ''], ['Actual', '€720,000', 'recorded', '72.0%'], ['Achievement', '72.0%', 'calculated', 'progress'], ['Remaining', '€280,000', 'calculated', ''], ['On Track', '8 goals', '', 'green'], ['At Risk', '3 goals', '', 'amber'], ['Exceeded', '2 goals', '', 'check'], ['Unassigned', '1 goal', '', 'gray']] as const;
  const recommendations = [['risk', '⚠️ At-Risk Goal', 'Enterprise Deals goal is tracking below expected trajectory. At current pace, 9 deals will be closed vs. target of 12. Recommended action: accelerate pipeline qualification.', '58.3% achievement at 66% of period elapsed.'], ['growth', '💡 Growth Opportunity', 'DACH Region has exceeded its Q3 target by 8%. Historical trend and current pipeline support a higher target for Q4.', '€162,000 actual vs €150,000 target.'], ['adjust', '📊 Target Adjustment', 'Team Beta target of €250,000 is above the 12-month historical average of €198,000 for this team. Consider adjusting or redistributing.', 'Rolling 12-month average: €198,000.']] as const;
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[238px] flex-col bg-[var(--sidebar)] text-foreground lg:flex"><div className="flex h-[76px] items-center border-b border-border px-6"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">L</div><span className="ml-3 text-lg font-bold tracking-tight text-foreground">lulu<span className="text-foreground">.ai</span></span></div><div className="px-4 pt-7"><p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Sales</p><LuluSectionNavigation activeId="gentle-cliff-7133" /></div><div className="mt-auto border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary hover:text-foreground"><Settings2 size={17} /><span>Workspace settings</span></button><div className="mt-3 flex items-center gap-3 rounded-lg bg-secondary p-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">MC</div><div><p className="text-xs font-semibold text-foreground">Maria Chen</p><p className="text-[11px] text-muted-foreground">Admin</p></div><ChevronDown className="ml-auto text-muted-foreground" size={15} /></div></div></aside>
    <main className="lg:pl-[238px]"><header className="sticky top-0 z-10 flex min-h-[76px] flex-wrap items-center justify-between gap-4 border-b border-border bg-secondary px-5 py-4 backdrop-blur md:px-8"><div><div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground"><span>Sales</span><span>/</span><span className="text-muted-foreground">Sales Goals</span></div><h1 className="text-xl font-bold tracking-tight text-foreground">Sales Goals</h1></div><div className="flex flex-wrap items-center gap-2"><button className="hidden items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-semibold text-foreground sm:flex"><Sparkles size={15} /> Ask Lulu AI</button><button className="hidden rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-card md:block"><Upload size={14} className="mr-1.5 inline" />Import</button><button className="hidden rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-card md:block"><Download size={14} className="mr-1.5 inline" />Export</button><button aria-label="More actions" className="rounded-lg border border-border p-2 text-foreground"><MoreHorizontal size={18} /></button><button className="rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-black/10 hover:bg-primary"><span>+ Create Goal</span></button></div></header><div className="mx-auto max-w-[1440px] px-5 py-7 md:px-8">
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">Set measurable sales targets and monitor progress across your organization.</p>
      <section className="mb-7 flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center"><div className="flex flex-wrap gap-1 rounded-lg bg-secondary p-1">{periods.map(item => <button key={item} onClick={() => setPeriod(item)} className={`rounded-md px-3 py-2 text-xs font-semibold transition ${period === item ? 'bg-card text-foreground shadow-sm' : 'text-foreground hover:text-foreground'}`}>{item}</button>)}</div><div className="text-left sm:text-right"><p className="text-sm font-bold text-foreground">01 Jul 2026 – 30 Sep 2026 · Q3 2026</p><p className="mt-1 text-xs text-muted-foreground">Showing {period.toLowerCase()}</p></div></section>
      <section className="mb-9 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">{kpis.map(([label, value, kind, meta]) => <article key={label} className="rounded-xl border border-border bg-card p-4 shadow-sm"><div className="mb-3 flex min-h-[22px] items-start justify-between gap-1"><p className="text-xs font-semibold text-muted-foreground">{label}</p>{kind && <Badge kind={kind as BadgeKind} />}{!kind && meta === 'green' && <span className="h-2 w-2 rounded-full bg-chart-4" />}{!kind && meta === 'amber' && <span className="h-2 w-2 rounded-full bg-chart-1" />}{!kind && meta === 'check' && <CheckCircle2 size={15} className="text-foreground" />}{!kind && meta === 'gray' && <span className="h-2 w-2 rounded-full bg-muted" />}</div><p className="text-xl font-bold tracking-tight text-foreground">{value}</p>{kind === 'recorded' && <p className="mt-1 text-xs font-semibold text-foreground">↑ {meta}</p>}{kind === 'calculated' && label === 'Achievement' && <div className="mt-3 h-1.5 w-full rounded-full bg-secondary"><div className="h-1.5 rounded-full bg-primary text-primary-foreground" style={{
                width: '72%'
              }} /></div>}</article>)}</section>
      <section className="mb-10"><SectionHeader eyebrow="Goals overview" title="Sales Goals · Q3 2026" action="View all goals" /><div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"><div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row"><label className="relative flex-1"><Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" /><input aria-label="Search goals" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search goals, owners, or types..." className="h-9 w-full rounded-lg border border-border pl-9 pr-3 text-sm outline-none focus:border-border focus:ring-2 focus:ring-ring" /></label><button className="rounded-lg border border-border px-3 text-sm font-medium text-foreground"><Filter size={14} className="mr-2 inline" />Filter</button><button className="rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground">+ Create Goal</button></div><div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-left text-sm"><thead className="sticky top-0 bg-card text-[11px] uppercase tracking-wide text-muted-foreground"><tr>{['Goal', 'Type', 'Owner', 'Period', 'Target', 'Actual', 'Achievement', 'Remaining', 'Status', 'Last Updated', ''].map(head => <th key={head} className="whitespace-nowrap px-4 py-3 font-bold">{head}</th>)}</tr></thead><tbody className="divide-y divide-border">{filteredGoals.map(goal => <tr key={goal[0]} className={`${goal[7] === 'At Risk' ? 'border-l-2 border-l-chart-1 bg-chart-1/20' : goal[7] === 'Exceeded' ? 'bg-secondary/20' : ''} hover:bg-card`}><td className="px-4 py-3.5 font-semibold text-foreground">{goal[0]}</td><td className="px-4 py-3.5 text-muted-foreground">{goal[1]}</td><td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">{goal[2]}</td><td className="px-4 py-3.5 text-muted-foreground">Q3 2026</td><td className="px-4 py-3.5 font-medium">{goal[3]}</td><td className="px-4 py-3.5 font-medium">{goal[4]}</td><td className="px-4 py-3.5"><span className="font-semibold">{goal[5]}</span>{goal[5] !== '—' && <div className="mt-1 h-1 w-16 rounded-full bg-secondary"><div className={`h-1 rounded-full ${goal[7] === 'Exceeded' ? 'bg-primary' : 'bg-primary'}`} style={{
                          width: `${Math.min(parseFloat(goal[5]), 100)}%`
                        }} /></div>}</td><td className="px-4 py-3.5 text-muted-foreground">{goal[6]}</td><td className="px-4 py-3.5"><StatusPill status={goal[7]} /></td><td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">{goal[8]}</td><td className="px-4 py-3.5"><button aria-label={`Actions for ${goal[0]}`} className="rounded p-1 text-foreground hover:bg-secondary hover:text-foreground"><MoreHorizontal size={18} /></button></td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground"><span>Showing 1–10 of 14 goals</span><div className="flex gap-1"><button className="rounded border border-border px-2 py-1">Previous</button><button className="rounded bg-primary px-2 py-1 font-semibold text-primary-foreground">1</button><button className="rounded border border-border px-2 py-1">2</button><button className="rounded border border-border px-2 py-1">Next</button></div></div></div></section>
      <section className="mb-10 grid gap-8 xl:grid-cols-2"><div><SectionHeader title="Team Goals · Q3 2026" /><div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-card text-[11px] uppercase tracking-wide text-muted-foreground"><tr>{['Team', 'Target', 'Actual', 'Achievement', 'Remaining', 'On Track', 'At Risk', ''].map(h => <th key={h} className="px-4 py-3 font-bold">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{teams.map(row => <tr key={row[0]} className="hover:bg-card"><td className="px-4 py-3.5 font-semibold">{row[0]}</td>{row.slice(1).map((cell, cellIndex) => <td key={`${row[0]}-${cellIndex}`} className="px-4 py-3.5 text-muted-foreground">{cell}</td>)}<td className="px-4 py-3.5"><button className="whitespace-nowrap font-semibold text-foreground">View Team ›</button></td></tr>)}</tbody></table></div></div><div><SectionHeader title="Individual Goals · Q3 2026" /><div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-card text-[11px] uppercase tracking-wide text-muted-foreground"><tr>{['Representative', 'Target', 'Actual', 'Achievement', 'Remaining', 'Pipeline', 'Forecast', 'Status'].map(h => <th key={h} className="px-4 py-3 font-bold">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{reps.map(row => <tr key={row[0]} className="hover:bg-card"><td className="px-4 py-3.5 font-semibold">{row[0]}</td>{row.slice(1, 7).map((cell, cellIndex) => <td key={`${row[0]}-${cellIndex}`} className="px-4 py-3.5 text-muted-foreground">{cell}</td>)}<td className="px-4 py-3.5"><StatusPill status={row[7]} /></td></tr>)}</tbody></table></div></div></section>
      <section className="mb-10 rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><SectionHeader eyebrow="Performance" title="Goal Progress Trend · Q3 2026" /><div className="flex rounded-lg bg-secondary p-1">{['Daily', 'Weekly', 'Monthly'].map(item => <button key={item} onClick={() => setTrend(item)} className={`rounded px-3 py-1.5 text-xs font-semibold ${trend === item ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}>{item}</button>)}</div></div><div className="relative h-[250px] w-full overflow-hidden rounded-lg bg-card/70 p-4"><svg viewBox="0 0 900 220" className="h-full w-full" role="img" aria-label="Goal progress trend chart"><line x1="45" y1="190" x2="870" y2="190" stroke="var(--border)" /><line x1="45" y1="145" x2="870" y2="145" stroke="var(--border)" /><line x1="45" y1="100" x2="870" y2="100" stroke="var(--border)" /><line x1="45" y1="55" x2="870" y2="55" stroke="var(--border)" /><path d="M45 190 L180 165 L315 140 L450 112 L585 87 L720 65 L870 38" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="7 6" /><path d="M45 190 L180 177 L315 155 L450 135 L585 115 L720 93 L870 78" fill="none" stroke="var(--chart-2)" strokeWidth="4" strokeLinecap="round" /><path d="M45 190 L180 175 L315 145 L450 110 L585 78 L720 48 L870 30" fill="none" stroke="var(--chart-2)" strokeWidth="2.5" strokeDasharray="5 5" /><circle cx="585" cy="115" r="5" fill="var(--chart-2)" stroke="white" strokeWidth="3" /><text x="45" y="211" fontSize="11" fill="var(--muted-foreground)">Jul 1</text><text x="300" y="211" fontSize="11" fill="var(--muted-foreground)">Aug 1</text><text x="575" y="211" fontSize="11" fill="var(--muted-foreground)">Sep 1</text><text x="825" y="211" fontSize="11" fill="var(--muted-foreground)">Sep 30</text><text x="10" y="59" fontSize="11" fill="var(--muted-foreground)">100%</text><text x="19" y="193" fontSize="11" fill="var(--muted-foreground)">0%</text></svg></div><div className="mt-4 flex flex-wrap gap-5 text-xs text-muted-foreground"><span><i className="mr-2 inline-block w-6 border-t-2 border-dashed border-border" />Target</span><span><i className="mr-2 inline-block w-6 border-t-[3px] border-border" />Actual</span><span><i className="mr-2 inline-block w-6 border-t-2 border-dashed border-border" />Forecast <Badge kind="ai" /></span><span className="ml-auto text-muted-foreground">Forecast is AI-generated and does not guarantee future performance.</span></div></section>
      <section className="mb-10"><SectionHeader title="Goal Gap Analysis" /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[['Target', '€1,000,000', 'target'], ['Actual', '€720,000', 'recorded'], ['Remaining', '€280,000', 'calculated'], ['Required Run Rate', '€93,333 / month', 'calculated']].map(([label, value, kind]) => <article key={label} className="rounded-xl border border-border bg-card p-4 shadow-sm"><p className="mb-3 text-sm font-semibold text-muted-foreground">{label}</p><p className="mb-3 text-xl font-bold">{value}</p><Badge kind={kind as BadgeKind} /></article>)}</div><p className="mt-3 text-xs text-muted-foreground">Required run rate is calculated and does not guarantee target achievement. Based on remaining 3 weeks in the period.</p></section>
      <section className="mb-10"><SectionHeader title="AI Goal Recommendations" action="View AI history" /><div className="mb-3 flex items-center gap-2"><Badge kind="ai" /><span className="text-xs text-muted-foreground">Personalized from your goals and available sales data</span></div><div className="grid gap-4 xl:grid-cols-3">{recommendations.map(rec => !dismissed.includes(rec[0]) && <article key={rec[0]} className="border-l-4 border-border rounded-xl border border-border bg-card p-5 shadow-sm"><div className="mb-3 flex items-start justify-between"><h3 className="text-sm font-bold">{rec[1]}</h3><button aria-label="Dismiss recommendation" onClick={() => setDismissed([...dismissed, rec[0]])} className="text-foreground hover:text-foreground"><X size={16} /></button></div><p className="text-sm leading-6 text-muted-foreground">{rec[2]}</p><p className="mt-4 border-t border-border pt-3 text-xs font-medium text-muted-foreground">Supporting evidence: {rec[3]}</p><button className="mt-4 rounded-lg border border-border px-3 py-2 text-xs font-bold text-foreground hover:bg-secondary">Apply Recommendation</button></article>)}</div><p className="mt-3 text-xs text-muted-foreground">Recommendations are AI-generated based on available data and do not guarantee outcomes.</p></section>
      <section className="mb-10 rounded-xl border border-border bg-gradient-to-br from-secondary/80 to-white p-6 shadow-sm"><div className="flex items-center gap-2"><div className="rounded-lg bg-primary p-2 text-primary-foreground"><Sparkles size={18} /></div><div><h2 className="text-lg font-bold">Ask Lulu AI to Create a Goal</h2><p className="text-sm text-muted-foreground">Turn a plain-language intention into a measurable target.</p></div></div><textarea aria-label="Describe the sales goal" placeholder="Describe the sales goal you want to create..." className="mt-5 min-h-[108px] w-full resize-y rounded-xl border border-border bg-card p-4 text-sm outline-none focus:ring-2 focus:ring-ring" /><div className="mt-3 flex flex-wrap gap-2">{['Create a quarterly revenue goal of €1 million', 'Set individual targets for the sales team', 'Create a goal for 50 new customers this quarter', 'Recommend realistic targets for each sales representative'].map(chip => <button key={chip} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary">{chip}</button>)}</div><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-muted-foreground">AI-generated goals must be reviewed and confirmed before activation.</p><button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary"><Sparkles size={15} className="mr-2 inline" />Generate Goal</button></div></section>
      <section className="mb-8"><SectionHeader title="Goal Alerts" action="Manage alerts" /><div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">{[['🔴', 'Enterprise Deals goal is below trajectory', '3 days ago'], ['🟡', 'Team Beta Q3 target has 3 weeks remaining with 28.8% gap', 'Today'], ['🟢', 'DACH Region goal exceeded', 'Today']].map(alert => <div key={alert[1]} className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4 last:border-0"><span className="text-base" aria-hidden="true">{alert[0]}</span><span className="flex-1 text-sm font-semibold text-foreground">{alert[1]}{alert[1].includes('exceeded') && <span className="ml-2 text-xs font-normal text-muted-foreground">Milestone: 100% reached</span>}</span><span className="text-xs text-muted-foreground">{alert[2]}</span><button className="text-xs font-bold text-foreground">View Goal</button></div>)}</div><div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Notifications:</span><button className="rounded-full bg-primary px-3 py-1.5 font-semibold text-primary-foreground">In-app</button><button className="font-medium hover:text-foreground">Email</button><button className="ml-auto text-foreground hover:underline">Manage alerts</button></div></section>
    </div></main>
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
