import { useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bot, Check, ChevronDown, ChevronRight, CircleHelp, Edit3, Filter, GitBranch, Layers3, Menu, MoreHorizontal, Plus, RefreshCw, Search, Settings2, Sparkles, Target, TestTube2, Users, X } from 'lucide-react';
type ScoreTone = 'good' | 'warm' | 'bad';
type Status = 'Active' | 'Paused' | 'New' | 'Hot' | 'Resolved by priority' | 'Needs review';
const navItems = [{
  label: 'Overview',
  icon: Activity
}, {
  label: 'Leads',
  icon: Target
}, {
  label: 'Sales',
  icon: GitBranch
}, {
  label: 'Automation',
  icon: Layers3
}, {
  label: 'Analytics',
  icon: Activity
}];
const kpis = [['Total Leads', '1,247', 'leads processed this period', 'Recorded', 'neutral'], ['Assigned', '1,189', '+95.3%', 'Calculated', 'green'], ['Unassigned', '58', 'needs attention', 'Rule-based', 'amber'], ['Auto Assigned', '934', 'Rule-based', 'Rule-based', 'violet'], ['Manually Assigned', '255', 'Recorded', 'Recorded', 'neutral'], ['Assignment Success', '95.3%', 'healthy routing', 'Calculated', 'green'], ['Routing Conflicts', '12', 'review needed', 'Rule-based', 'amber'], ['Assignment Failures', '7', 'calculated', 'Calculated', 'red']];
const leads = [['Sarah Johnson', 'Bosch GmbH', 'Web Form', 'Manufacturing', 'Germany', '87', '2h ago', 'Workspace representative', 'New'], ['Marcus Weber', 'Siemens AG', 'LinkedIn', 'Technology', 'Germany', '92', '4h ago', 'Workspace representative', 'New'], ['Elena Rossi', 'Ferrari SpA', 'Referral', 'Automotive', 'Italy', '78', '5h ago', 'Workspace representative', 'New'], ['Thomas Berg', 'SAP SE', 'Demo Request', 'Software', 'Germany', '94', '6h ago', 'Workspace representative', 'Hot'], ['Claire Dubois', 'Airbus', 'Trade Show', 'Aerospace', 'France', '71', '1d ago', '—', 'New'], ['Raj Patel', 'Tata Consultancy', 'API', 'IT Services', 'India', '65', '1d ago', '—', 'New']];
const rules = [['Enterprise Germany', 'P1', 'Country=Germany, Size>250', 'Enterprise Germany Team', '324', '98.2%', 'Active', '2min ago'], ['Strategic Accounts', 'P2', 'Lead Score>90, Segment=Enterprise', 'Strategic Account Mgr', '89', '99.1%', 'Active', '15min ago'], ['Existing Customers', 'P3', 'Existing Customer=Yes', 'Account Owner', '156', '97.8%', 'Active', '1h ago'], ['SMB Germany', 'P4', 'Country=Germany, Size<50', 'SMB Germany Team', '201', '94.5%', 'Active', '2h ago'], ['Manufacturing EMEA', 'P5', 'Industry=Manufacturing, Region=EMEA', 'Industrial Sales Team', '143', '91.2%', 'Paused', '1d ago'], ['General Routing', 'P6', '(Fallback)', 'General Sales Queue', '432', '88.4%', 'Active', '5min ago']];
const reps = [['Workspace representative', '287', '34', '82.1', '85%', '24.1%'], ['Workspace representative', '312', '41', '79.4', '92%', '26.2%'], ['Workspace representative', '198', '22', '77.8', '72%', '16.6%'], ['Workspace representative', '245', '29', '80.2', '88%', '20.6%'], ['Workspace representative', '147', '18', '75.6', '61%', '12.3%']];
const teams = [['Enterprise Germany', '324', '67', '88.4', '78%', '27.2%'], ['Strategic Accounts', '89', '45', '91.2', '65%', '7.5%'], ['SMB Germany', '201', '18', '72.3', '84%', '16.9%'], ['Industrial Sales', '143', '23', '76.8', '71%', '12.0%'], ['General Sales Queue', '432', '54', '74.1', '91%', '36.3%']];
const history = [['Sarah Johnson', 'Unassigned', 'Workspace representative', 'Automatic', 'Enterprise Germany', 'System', '2h ago'], ['Thomas Berg', 'Unassigned', 'Workspace representative', 'Automatic', 'Strategic Accounts', 'System', '6h ago'], ['Marcus Weber', 'Workspace representative', 'Workspace representative', 'Manual', '—', 'Workspace administrator', '3h ago'], ['Elena Rossi', 'Unassigned', 'Workspace representative', 'AI-assisted', '—', 'Lulu AI', '5h ago']];
const chips = ['Route German enterprise leads to the enterprise team', 'Distribute new SMB leads equally across Germany team', 'Send existing customer leads to their account owner', 'Find routing conflicts'];
function Badge({
  children,
  tone = 'slate'
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  const tones: Record<string, string> = {
    slate: 'bg-card/60 text-foreground',
    green: 'bg-secondary/15 text-foreground',
    amber: 'bg-secondary/15 text-foreground',
    red: 'bg-chart-5/15 text-chart-5',
    violet: 'bg-secondary/15 text-foreground',
    blue: 'bg-secondary/15 text-foreground'
  };
  return <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold tracking-wide ${tones[tone] || tones.slate}`}>{children}</span>;
}
function SectionTitle({
  title,
  count,
  action
}: {
  title: string;
  count?: string;
  action?: React.ReactNode;
}) {
  return <header className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><h2 className="text-[15px] font-semibold text-foreground">{title}</h2>{count && <Badge tone="violet">{count}</Badge>}</div>{action}</header>;
}
function MiniTable({
  kind,
  rows
}: {
  kind: 'rep' | 'team';
  rows: string[][];
}) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[490px] text-left"><thead><tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><th className="pb-2 font-medium">{kind === 'rep' ? 'Representative' : 'Team'}</th><th className="pb-2 font-medium">Assigned</th><th className="pb-2 font-medium">High-Priority</th><th className="pb-2 font-medium">Avg Score</th><th className="pb-2 font-medium">Capacity</th><th className="pb-2 text-right font-medium">Dist%</th></tr></thead><tbody>{rows.map(row => <tr key={row[0]} className="border-b border-border text-[11px] text-foreground last:border-0 hover:bg-secondary"><td className="py-3 font-medium text-foreground">{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td><td><div className="flex items-center gap-2"><div className="h-1.5 w-14 rounded-full bg-card"><div className={`h-full rounded-full ${Number.parseInt(row[4]) > 90 ? 'bg-destructive' : Number.parseInt(row[4]) >= 80 ? 'bg-primary' : 'bg-primary'}`} style={{
                  width: row[4]
                }} /></div><span>{row[4]}</span></div></td><td className="text-right text-muted-foreground">{row[5]}</td></tr>)}</tbody></table><p className="mt-3 text-[10px] text-muted-foreground">Calculated</p></div>;
}
export function LeadAssignment() {
  const [selected, setSelected] = useState<string[]>([]);
  const [period, setPeriod] = useState('Current Month');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const { items: liveAssignments, loading: liveLoading, error: liveError } = useLiveRecords('sales_lead_assignments');
  const liveEmpty = !liveLoading && !liveError && liveAssignments.length === 0;
  const toggle = (name: string) => setSelected(items => items.includes(name) ? items.filter(item => item !== name) : [...items, name]);
  const filteredLeads = leads.filter(lead => lead.join(' ').toLowerCase().includes(query.toLowerCase()));
  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2400);
  };
  return <main className="min-h-screen bg-[var(--background)] text-foreground" style={{
    fontFamily: 'Inter, sans-serif'
  }}>{liveLoading ? <div className="border-b border-border bg-secondary/30 px-5 py-3 text-xs text-muted-foreground lg:pl-[244px]">Loading live lead assignments…</div> : liveError ? <div className="border-b border-destructive/30 bg-destructive/5 px-5 py-3 text-xs text-destructive lg:pl-[244px]">{liveError}</div> : liveEmpty ? <div className="border-b border-dashed border-border bg-card px-5 py-3 text-xs text-muted-foreground lg:pl-[244px]">No live lead assignments are available yet. Configure a routing rule or connect your CRM to begin.</div> : null}
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[224px] border-r border-border bg-[var(--sidebar)] px-4 py-5 lg:block"><div className="mb-9 flex items-center gap-2 px-2"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground">L</div><div><p className="text-sm font-bold tracking-tight text-foreground">LULU AI</p><p className="text-[9px] uppercase tracking-[.18em] text-muted-foreground">Core Platform</p></div></div><LuluSectionNavigation activeId="friendly-tower-1528" /><div className="mt-8 border-t border-border pt-5"><p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Workspace</p><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-foreground hover:bg-secondary"><Settings2 size={16} /><span>Settings</span></button><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-foreground hover:bg-secondary"><CircleHelp size={16} /><span>Help center</span></button></div><div className="absolute bottom-5 left-5 right-5 rounded-xl border border-border bg-secondary p-3"><div className="mb-2 flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-primary text-primary-foreground" /><div><p className="text-xs font-medium text-foreground">Workspace administrator</p><p className="text-[10px] text-muted-foreground">Sales admin</p></div></div><div className="flex items-center gap-1 text-[10px] text-foreground"><span className="h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" />All systems operational</div></div></aside>
    <div className="lg:pl-[224px]"><header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-[var(--card)]/90 px-5 backdrop-blur-md lg:px-8"><div className="flex items-center gap-3"><button className="rounded-md p-2 text-foreground lg:hidden"><Menu size={19} /></button><div className="text-xs text-muted-foreground">Sales <ChevronRight className="mx-1 inline" size={12} /><span className="text-foreground">Lead Assignment</span></div></div><div className="flex items-center gap-3"><button className="hidden rounded-lg border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary sm:block">Documentation</button><button className="rounded-full bg-card/60 p-2 text-foreground"><CircleHelp size={15} /></button><div className="h-7 w-7 rounded-full bg-secondary/80 text-center text-[11px] font-bold leading-7 text-foreground">JH</div></div></header>
      <div className="mx-auto max-w-[1400px] px-5 py-7 lg:px-8"><div className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[.2em] text-foreground">Sales / Operations</p><h1 className="text-3xl font-semibold tracking-tight text-foreground">Lead Assignment</h1><p className="mt-2 text-sm text-muted-foreground">Route every lead to the right sales owner, team or territory.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => notify('Assignment rule builder opened')} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-black/20 hover:bg-primary"><Plus size={15} />Create Assignment Rule</button><button onClick={() => notify('Select leads to assign')} className="rounded-lg border border-border px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary">Assign Leads</button><button onClick={() => notify('Lulu AI is ready')} className="inline-flex items-center gap-2 rounded-lg border border-border/30 px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary/10"><Sparkles size={14} />Ask Lulu AI</button><button onClick={() => notify('Rules test started')} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs text-foreground hover:bg-secondary"><TestTube2 size={14} />Test Rules</button><button className="rounded-lg border border-border px-3 py-2.5 text-foreground hover:bg-secondary"><MoreHorizontal size={16} /></button></div></div>
      <section className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">{kpis.map(kpi => <article key={kpi[0]} className="rounded-xl border border-border bg-[var(--card)] p-3.5"><div className="mb-3 flex items-start justify-between gap-1"><p className="text-[11px] leading-4 text-muted-foreground">{kpi[0]}</p>{kpi[4] === 'green' && <ArrowUpRight size={14} className="text-chart-4" />}{kpi[4] === 'amber' && <AlertTriangle size={13} className="text-chart-1" />}{kpi[4] === 'red' && <ArrowDownRight size={14} className="text-chart-5" />}</div><p className="text-xl font-semibold text-foreground">{kpi[1]}</p><p className={`mt-1 text-[9px] ${kpi[4] === 'green' ? 'text-chart-4' : kpi[4] === 'amber' ? 'text-chart-1' : kpi[4] === 'violet' ? 'text-foreground' : 'text-muted-foreground'}`}>{kpi[2]}</p><p className="mt-2 text-[9px] text-muted-foreground">{kpi[3]}</p></article>)}</section>
      <section className="mb-7 rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><SectionTitle title="Unassigned Leads" count="58" /></div><label className="flex items-center gap-3 text-xs text-muted-foreground">Assignment Period<select value={period} onChange={event => setPeriod(event.target.value)} className="rounded-lg border border-border bg-[var(--secondary)] px-3 py-2 text-xs text-foreground outline-none"><option>Today</option><option>Last 7 Days</option><option>Current Month</option><option>Previous Month</option><option>Current Quarter</option><option>Custom Period</option></select></label></div><div className="mb-4 flex flex-wrap items-center gap-2"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 text-muted-foreground" size={15} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search unassigned leads..." className="w-full rounded-lg border border-border bg-[var(--secondary)] py-2.5 pl-9 pr-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-border/60" /></div><button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-xs text-foreground hover:bg-secondary"><Filter size={14} />Filter</button><button disabled={!selected.length} onClick={() => notify(`${selected.length} leads queued for assignment`)} className="rounded-lg bg-primary px-3 py-2.5 text-xs font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40">Bulk Assign {selected.length ? `(${selected.length})` : ''}</button></div><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left"><thead><tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><th className="w-8 pb-3"><span className="sr-only">Select</span></th><th className="pb-3">Lead Name</th><th className="pb-3">Company</th><th className="pb-3">Source</th><th className="pb-3">Industry</th><th className="pb-3">Country</th><th className="pb-3">Lead Score</th><th className="pb-3">Created</th><th className="pb-3">Suggested Owner</th><th className="pb-3">Status</th><th className="pb-3 text-right">Actions</th></tr></thead><tbody>{filteredLeads.map(lead => <tr key={lead[0]} className="border-b border-border text-[11px] text-muted-foreground last:border-0 hover:bg-secondary"><td className="py-3"><input type="checkbox" checked={selected.includes(lead[0])} onChange={() => toggle(lead[0])} className="accent-primary" aria-label={`Select ${lead[0]}`} /></td><td className="font-medium text-foreground">{lead[0]}</td><td>{lead[1]}</td><td>{lead[2]}</td><td>{lead[3]}</td><td>{lead[4]}</td><td><Badge tone={Number(lead[5]) >= 90 ? 'green' : Number(lead[5]) >= 70 ? 'amber' : 'red'}>{lead[5]}</Badge></td><td>{lead[6]}</td><td>{lead[7] === '—' ? '—' : <span className="inline-flex items-center gap-1 text-foreground">{lead[7]}<span className="text-[9px] text-foreground" title="AI-generated suggestion">AI</span></span>}</td><td><Badge tone={lead[8] === 'Hot' ? 'red' : 'blue'}>{lead[8]}</Badge></td><td className="text-right"><button onClick={() => notify(`${lead[0]} ready to assign`)} className="mr-2 rounded-md border border-border/30 px-2 py-1 text-[10px] text-foreground hover:bg-secondary/10">Assign</button><button className="text-foreground hover:text-foreground"><MoreHorizontal size={15} /></button></td></tr>)}</tbody></table></div><p className="mt-3 text-[10px] text-muted-foreground">Recorded · Showing {filteredLeads.length} of 58 unassigned leads</p></section>
      <section className="mb-7 rounded-xl border border-border bg-[var(--card)] p-5"><SectionTitle title="Assignment Rules" action={<div className="flex gap-2"><button className="rounded-lg bg-primary px-3 py-2 text-[11px] font-medium text-primary-foreground"><Plus size={13} className="mr-1 inline" />Create Assignment Rule</button><button className="rounded-lg border border-border px-3 py-2 text-[11px] text-foreground">Reorder Rules</button></div>} /><div className="overflow-x-auto"><table className="w-full min-w-[920px] text-left"><thead><tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><th className="pb-3">Rule</th><th>Priority</th><th>Conditions</th><th>Assignment Target</th><th>Matches</th><th>Success Rate</th><th>Status</th><th>Last Triggered</th><th className="text-right">Actions</th></tr></thead><tbody>{rules.map(rule => <tr key={rule[0]} className="border-b border-border text-[11px] text-muted-foreground last:border-0 hover:bg-secondary"><td className="py-3 font-medium text-foreground">{rule[0]}</td><td><span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20 text-[10px] font-bold text-foreground">{rule[1]}</span></td><td>{rule[2]}</td><td className="text-foreground">{rule[3]}</td><td>{rule[4]}</td><td className="text-foreground">{rule[5]}</td><td><Badge tone={rule[6] === 'Paused' ? 'amber' : 'green'}>{rule[6]}</Badge></td><td>{rule[7]}</td><td className="text-right"><button className="mr-2 text-foreground hover:text-foreground">Edit</button><button className="mr-2 text-foreground hover:text-foreground">Test</button><MoreHorizontal size={15} className="inline text-muted-foreground" /></td></tr>)}</tbody></table></div><div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-[var(--secondary)] px-4 py-3"><div><p className="text-xs font-medium text-foreground">Fallback Assignment</p><p className="mt-1 text-[11px] text-muted-foreground">Assign to <span className="text-foreground">General Sales Queue</span></p></div><button className="rounded-md p-2 text-foreground hover:bg-secondary hover:text-foreground"><Edit3 size={15} /></button></div></section>
      <div className="mb-7 grid gap-4 xl:grid-cols-3"><article className="rounded-xl border border-border bg-[var(--card)] p-5"><SectionTitle title="Routing Performance" /><div className="mb-5 flex items-end gap-2"><p className="text-3xl font-semibold text-chart-4">95.3%</p><p className="pb-1 text-[11px] text-muted-foreground">Assignment Success Rate</p></div><div className="grid grid-cols-2 gap-y-4">{[['Avg Assignment Time', '1.4 min'], ['Auto Assignment Rate', '78.5%'], ['Manual Rate', '21.5%'], ['Unassigned Rate', '4.7%'], ['Conflict Rate', '1.0%'], ['Failure Rate', '0.6%']].map(item => <div key={item[0]}><p className="text-[10px] text-muted-foreground">{item[0]}</p><p className="mt-1 text-sm font-medium text-foreground">{item[1]}</p><p className="text-[9px] text-muted-foreground">Calculated</p></div>)}</div></article><article className="rounded-xl border border-border bg-[var(--card)] p-5 xl:col-span-1"><SectionTitle title="Lead Distribution · Rep" /><MiniTable kind="rep" rows={reps} /></article><article className="rounded-xl border border-border bg-[var(--card)] p-5 xl:col-span-1"><SectionTitle title="Lead Distribution · Team" /><MiniTable kind="team" rows={teams} /></article></div>
      <div className="mb-7 grid gap-4 xl:grid-cols-2"><article className="rounded-xl border border-border bg-[var(--card)] p-5"><SectionTitle title="Routing Conflicts" count="12" /><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-[11px]"><thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3">Lead</th><th>Conflicting Rules</th><th>Priority Rule</th><th>Status</th><th className="text-right">Actions</th></tr></thead><tbody>{[['Marcus Weber', 'Enterprise Germany + Strategic Accounts', 'P2 Strategic Accounts', 'Resolved by priority'], ['Elena Rossi', 'Manufacturing EMEA + General Routing', 'P5 Manufacturing', 'Needs review']].map(row => <tr key={row[0]} className="border-b border-border text-muted-foreground last:border-0 hover:bg-secondary"><td className="py-3 font-medium text-foreground">{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td><Badge tone={row[3] === 'Needs review' ? 'amber' : 'green'}>{row[3]}</Badge></td><td className="text-right"><button className="text-foreground">{row[3] === 'Needs review' ? 'Resolve' : 'Review'}</button></td></tr>)}</tbody></table></div></article><article className="rounded-xl border border-border bg-[var(--card)] p-5"><SectionTitle title="Assignment Failures" count="7" /><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-[11px]"><thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3">Lead</th><th>Failure Reason</th><th>Rule</th><th>Timestamp</th><th>Suggested Action</th></tr></thead><tbody>{[['Claire Dubois', 'No eligible owner in territory', 'Manufacturing EMEA', '1d ago', 'Reassign territory'], ['Raj Patel', 'No matching rule', '—', '1d ago', 'Create routing rule']].map(row => <tr key={row[0]} className="border-b border-border text-muted-foreground last:border-0 hover:bg-secondary"><td className="py-3 font-medium text-foreground">{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td><td><button className="text-foreground hover:text-foreground">{row[4]}</button></td></tr>)}</tbody></table></div><button className="mt-3 text-[11px] text-foreground hover:text-foreground">+5 more failures</button></article></div>
      <section className="mb-7 rounded-xl border border-border bg-[var(--card)] p-5"><SectionTitle title="Assignment History" action={<div className="flex gap-2"><button className="rounded-lg border border-border px-3 py-2 text-[11px] text-foreground">All Methods <ChevronDown size={13} className="ml-1 inline" /></button><button className="rounded-lg border border-border px-3 py-2 text-[11px] text-foreground">Date range <ChevronDown size={13} className="ml-1 inline" /></button></div>} /><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-[11px]"><thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3">Lead</th><th>Previous Owner</th><th>New Owner</th><th>Method</th><th>Rule</th><th>User</th><th>Timestamp</th></tr></thead><tbody>{history.map(row => <tr key={row[0]} className="border-b border-border text-muted-foreground last:border-0 hover:bg-secondary"><td className="py-3 font-medium text-foreground">{row[0]}</td><td>{row[1]}</td><td className="text-foreground">{row[2]}</td><td><Badge tone={row[3] === 'Automatic' ? 'blue' : row[3] === 'AI-assisted' ? 'violet' : 'slate'}>{row[3] === 'AI-assisted' && <Sparkles size={10} />} {row[3]}</Badge></td><td>{row[4]}</td><td>{row[5]}</td><td>{row[6]}</td></tr>)}</tbody></table></div></section>
      <div className="grid gap-4 pb-10 xl:grid-cols-2"><article className="rounded-xl border border-border/30 border-l-2 bg-[var(--card)] p-5"><SectionTitle title="AI Lead Routing Insights" action={<Badge tone="violet"><Sparkles size={11} />AI-generated</Badge>} /><div className="space-y-2">{[['Routing Opportunity', 'Several high-value leads (Lead Score >85) are being assigned manually and may benefit from automated routing. 23 leads affected.', 'View', 'amber'], ['Capacity Imbalance', 'Workspace representative is handling 26.2% of all leads. Consider rebalancing Round Robin weights. Calculated.', 'View', 'amber'], ['Rule Conflict', 'Two active rules overlap for enterprise leads in Germany: Enterprise Germany (P1) and Strategic Accounts (P2). Review recommended.', 'Resolve', 'red'], ['Unassigned Leads', '34 leads have remained unassigned for more than 24 hours. Immediate attention required.', 'Resolve', 'red']].map(item => <div key={item[0]} className={`flex items-start justify-between gap-3 rounded-lg border p-3 ${item[3] === 'red' ? 'border-chart-5/20 bg-chart-5/[.04]' : 'border-chart-1/20 bg-chart-1/[.04]'}`}><div><p className="text-xs font-semibold text-foreground">{item[0]}</p><p className="mt-1 max-w-[520px] text-[11px] leading-5 text-muted-foreground">{item[1]}</p></div><button onClick={() => notify(`${item[2]} action opened`)} className="shrink-0 rounded-md border border-border px-2 py-1 text-[10px] text-foreground hover:bg-secondary">{item[2]}</button></div>)}</div></article><article className="rounded-xl border border-border/30 border-l-2 bg-[var(--card)] p-5"><SectionTitle title="Ask Lulu AI to Create a Routing Rule" action={<Sparkles className="text-muted-foreground" size={18} />} /><p className="mb-3 text-[10px] text-muted-foreground">AI-generated · Describe a routing need and Lulu will draft the rule.</p><textarea placeholder="Describe how you want leads assigned..." className="h-24 w-full resize-none rounded-lg border border-border bg-[var(--secondary)] p-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-border/60" /><div className="mt-3 flex flex-wrap gap-2">{chips.map(chip => <button key={chip} onClick={() => notify('Example added to prompt')} className="rounded-full border border-border px-2.5 py-1.5 text-[10px] text-foreground hover:border-border/40 hover:text-foreground">{chip}</button>)}</div><button onClick={() => notify('Lulu AI is generating a draft rule')} className="mt-4 w-full rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary"><Sparkles size={14} className="mr-2 inline" />Generate Rule</button><p className="mt-3 text-center text-[10px] text-muted-foreground">AI-generated rules require review before activation.</p></article></div></div></div>{notice && <div role="status" className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-lg border border-border/30 bg-[var(--secondary)] px-4 py-3 text-xs text-foreground shadow-xl"><Check size={15} className="text-foreground" />{notice}<button onClick={() => setNotice('')}><X size={13} className="ml-2 text-muted-foreground" /></button></div>}</main>;
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
          <span>{section.label}</span>
          <span aria-hidden="true" className="text-xs transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <div className="ml-3 mt-1 space-y-0.5 border-l border-border pl-2 pb-1">
          {section.pages.map(page => {
            const isActivePage = page.id === activeId;
            return <a key={page.id} {...pageLinkProps(page.id)} aria-current={isActivePage ? 'page' : undefined} className={`block rounded-md px-3 py-2 text-xs transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {page.label}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}
import { pageLinkProps } from '../../../../routing';
