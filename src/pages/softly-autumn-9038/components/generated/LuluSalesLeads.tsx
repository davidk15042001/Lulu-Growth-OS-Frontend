import { useMemo, useState } from 'react';
import { Activity, AlertCircle, ArrowUpRight, Bell, Building2, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock3, Columns3, Download, FileUp, Filter, GitBranch, Globe2, HelpCircle, LayoutDashboard, Megaphone, Menu, MoreHorizontal, Plus, Search, Send, Settings, Sparkles, TrendingUp, Upload, UserPlus, Users, X, XCircle, Zap } from 'lucide-react';
type Status = 'New' | 'Contacted' | 'Engaged' | 'Qualified' | 'Disqualified' | 'Converted' | 'Nurture' | 'Unresponsive';
type Lead = {
  id: string;
  name: string;
  initials: string;
  title: string;
  company: string;
  email: string;
  source: string;
  owner: string;
  ownerInitials: string;
  status: Status;
  score: number;
  priority: 'High' | 'Medium' | 'Low';
  activity: string;
  created: string;
  action: string;
};
const leads: Lead[] = [{
  id: '1',
  name: 'Maria Chen',
  initials: 'MC',
  title: 'VP Commerce',
  company: 'Nova Commerce',
  email: 'maria@novacommerce.com',
  source: 'Website',
  owner: 'David M.',
  ownerInitials: 'DM',
  status: 'Qualified',
  score: 87,
  priority: 'High',
  activity: '2 hours ago',
  created: '10 Aug 2026',
  action: 'Follow Up'
}, {
  id: '2',
  name: 'Marcus Johnson',
  initials: 'MJ',
  title: 'VP Sales',
  company: 'Quantum Dynamics',
  email: 'marcus@quantumdynamics.com',
  source: 'Google Ads',
  owner: 'Sarah K.',
  ownerInitials: 'SK',
  status: 'Qualified',
  score: 92,
  priority: 'High',
  activity: '1 day ago',
  created: '8 Aug 2026',
  action: 'Schedule Demo'
}, {
  id: '3',
  name: 'Lena Fischer',
  initials: 'LF',
  title: 'CEO',
  company: 'BrightPath GmbH',
  email: 'lena@brightpath.de',
  source: 'Organic Search',
  owner: 'Jordan D.',
  ownerInitials: 'JD',
  status: 'Engaged',
  score: 78,
  priority: 'High',
  activity: '3 hours ago',
  created: '7 Aug 2026',
  action: 'Send Proposal'
}, {
  id: '4',
  name: 'Anika Mehta',
  initials: 'AM',
  title: 'Founder',
  company: 'Indigo Labs',
  email: 'anika@indigolabs.io',
  source: 'Website',
  owner: 'Jordan D.',
  ownerInitials: 'JD',
  status: 'Qualified',
  score: 94,
  priority: 'High',
  activity: '2 hours ago',
  created: '6 Aug 2026',
  action: 'Close Deal'
}, {
  id: '5',
  name: 'Tom Bergmann',
  initials: 'TB',
  title: 'CTO',
  company: 'DataStream AG',
  email: 'tom@datastream.ag',
  source: 'Referral',
  owner: 'Mark R.',
  ownerInitials: 'MR',
  status: 'Contacted',
  score: 71,
  priority: 'Medium',
  activity: '5 days ago',
  created: '3 Aug 2026',
  action: 'Follow Up'
}, {
  id: '6',
  name: 'Carlos Vega',
  initials: 'CV',
  title: 'Head of Ops',
  company: 'PanAm Logistics',
  email: 'carlos@panamlogistics.com',
  source: 'Meta Ads',
  owner: 'Anna P.',
  ownerInitials: 'AP',
  status: 'New',
  score: 65,
  priority: 'Medium',
  activity: '8 days ago',
  created: '1 Aug 2026',
  action: 'Contact'
}, {
  id: '7',
  name: 'Sophie Kim',
  initials: 'SK',
  title: 'CFO',
  company: 'NovaTech',
  email: 'sophie@novatech.co',
  source: 'Social',
  owner: 'David M.',
  ownerInitials: 'DM',
  status: 'Contacted',
  score: 68,
  priority: 'Medium',
  activity: '4 days ago',
  created: '29 Jul 2026',
  action: 'Follow Up'
}, {
  id: '8',
  name: 'James Osei',
  initials: 'JO',
  title: 'Director',
  company: 'Accra Ventures',
  email: 'james@accraventures.com',
  source: 'Referral',
  owner: 'Sarah K.',
  ownerInitials: 'SK',
  status: 'Nurture',
  score: 55,
  priority: 'Low',
  activity: '2 days ago',
  created: '25 Jul 2026',
  action: 'Nurture'
}, {
  id: '9',
  name: 'Emil Larsen',
  initials: 'EL',
  title: 'Sales Manager',
  company: 'NordRetail',
  email: 'emil@nordretail.no',
  source: 'Organic Search',
  owner: 'Jordan D.',
  ownerInitials: 'JD',
  status: 'Qualified',
  score: 82,
  priority: 'High',
  activity: '6 hours ago',
  created: '20 Jul 2026',
  action: 'Close Deal'
}, {
  id: '10',
  name: 'Priya Nair',
  initials: 'PN',
  title: 'COO',
  company: 'TechBridge India',
  email: 'priya@techbridge.in',
  source: 'Website',
  owner: 'Anna P.',
  ownerInitials: 'AP',
  status: 'Disqualified',
  score: 32,
  priority: 'Low',
  activity: '12 days ago',
  created: '15 Jul 2026',
  action: 'Review'
}];
const nav = [{
  label: 'Sales Overview',
  icon: LayoutDashboard
}, {
  label: 'Leads',
  icon: UserPlus
}, {
  label: 'Opportunities',
  icon: GitBranch
}, {
  label: 'Deals',
  icon: Building2
}, {
  label: 'Pipeline',
  icon: TrendingUp
}, {
  label: 'Quotes',
  icon: FileUp
}, {
  label: 'Activities',
  icon: Activity
}, {
  label: 'Tasks',
  icon: CheckCircle2
}, {
  label: 'Sales Analytics',
  icon: Globe2
}];
const kpis = [['Total Leads', '428', 'Recorded', 'slate', UserPlus], ['New Leads', '84', '+18.4% vs last period', 'Recorded', TrendingUp, 'emerald'], ['Qualified Leads', '126', '29.4% of total', 'Recorded', CheckCircle2, 'emerald'], ['Unqualified Leads', '43', '10.0% of total', 'Recorded', XCircle, 'rose'], ['Leads to Contact', '37', 'Requires follow-up', 'Calculated', Bell, 'amber'], ['Conversion Rate', '24.6%', '+4.2% this month', 'Calculated', ArrowUpRight, 'violet'], ['Avg Lead Score', '73.2', 'Across all active leads', 'AI-generated', Zap, 'violet'], ['High-Priority Leads', '58', 'AI identified', 'AI-generated', AlertCircle, 'rose']] as const;
const statusStyles: Record<Status, string> = {
  New: 'bg-secondary/15 text-foreground',
  Contacted: 'bg-secondary/15 text-foreground',
  Engaged: 'bg-secondary/15 text-foreground',
  Qualified: 'bg-secondary/15 text-foreground',
  Disqualified: 'bg-chart-5/15 text-chart-5',
  Converted: 'bg-secondary/15 text-foreground',
  Nurture: 'bg-secondary/15 text-foreground',
  Unresponsive: 'bg-secondary/15 text-foreground'
};
const sources = [['Website', '98', '34', '34.7%', '81'], ['Referral', '76', '28', '36.8%', '84'], ['Organic Search', '68', '22', '32.4%', '77'], ['Google Ads', '54', '14', '25.9%', '71'], ['Social', '42', '10', '23.8%', '65'], ['Meta Ads', '38', '8', '21.1%', '62']];
const funnel = [['New', '428', '100%', '—', 'bg-secondary/50', '100%'], ['Contacted', '284', '66%', '34% drop-off', 'bg-secondary/60', '82%'], ['Engaged', '198', '46%', '30% drop-off', 'bg-secondary/60', '67%'], ['Qualified', '126', '29%', '36% drop-off', 'bg-secondary/60', '52%'], ['Converted', '105', '24%', '17% drop-off', 'bg-secondary/60', '43%']];
function Sidebar({
  open,
  close
}: {
  open: boolean;
  close: () => void;
}) {
  return <aside className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-border bg-[var(--sidebar)] p-4 transition-transform lg:static lg:translate-x-0`}><div className="flex items-center gap-3 px-2 py-2"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">L</div><strong className="text-lg tracking-tight text-foreground">Lulu AI</strong><button className="ml-auto text-foreground lg:hidden" onClick={close} aria-label="Close menu"><span><X size={18} /></span></button></div><p className="mb-2 mt-8 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Sales</p><LuluSectionNavigation activeId="softly-autumn-9038" /><div className="mt-auto space-y-1 border-t border-border pt-4"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary hover:text-foreground"><Settings size={17} /><span>Settings</span></button><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary hover:text-foreground"><HelpCircle size={17} /><span>Help center</span></button><div className="mt-3 flex items-center gap-3 border-t border-border px-2 pt-4"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/20 text-xs font-semibold text-foreground">JD</div><div><p className="text-sm font-medium text-foreground">Jordan Davis</p><p className="text-xs text-muted-foreground">Sales Manager</p></div></div></div></aside>;
}
export function LuluSalesLeads() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState('Last 30 Days');
  const [view, setView] = useState('Table');
  const [notice, setNotice] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const filtered = useMemo(() => leads.filter(lead => `${lead.name} ${lead.company} ${lead.email} ${lead.source}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const action = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2200);
  };
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(lead => lead.id));
  return <div className="min-h-screen bg-[var(--background)] font-sans text-foreground"><div className="flex min-h-screen"><Sidebar open={mobileOpen} close={() => setMobileOpen(false)} />{mobileOpen && <button className="fixed inset-0 z-20 bg-primary/60 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" />}<main className="min-w-0 flex-1 overflow-hidden"><header className="sticky top-0 z-10 border-b border-border bg-[var(--background)]/90 px-5 py-4 backdrop-blur-xl lg:px-8"><div className="flex items-start justify-between gap-5"><div><button className="mb-3 text-foreground lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><span><Menu size={21} /></span></button><div className="mb-3 hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span>Sales</span><ChevronRight size={13} /><span className="text-foreground">Leads</span></div><h1 className="text-3xl font-semibold tracking-tight text-foreground">Leads</h1><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Capture, qualify and prioritize potential customers before they enter the sales pipeline.</p></div><div className="flex flex-wrap items-center justify-end gap-2"><label className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-muted-foreground"><span className="hidden sm:inline">Reporting period</span><select value={period} onChange={e => setPeriod(e.target.value)} className="bg-transparent text-foreground outline-none"><option>Last 30 Days</option><option>Last 90 Days</option><option>This Year</option></select></label><button onClick={() => action('Lead created')} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary"><Plus size={16} /><span>Create Lead</span></button><button onClick={() => action('Import flow opened')} className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary sm:flex"><Upload size={16} /><span>Import Leads</span></button><button onClick={() => action('Lulu is ready')} className="hidden items-center gap-2 rounded-lg border border-border/25 px-3 py-2 text-sm text-foreground hover:bg-secondary/10 md:flex"><Sparkles size={16} /><span>Ask Lulu AI</span></button><button onClick={() => action('Export prepared')} className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary lg:flex"><Download size={16} /><span>Export</span></button><button onClick={() => action('More actions')} className="rounded-lg border border-border p-2 text-foreground hover:text-foreground" aria-label="More actions"><MoreHorizontal size={18} /></button></div></div></header><div className="space-y-5 p-5 lg:p-8"><section className="grid grid-cols-2 gap-3 xl:grid-cols-4">{kpis.map(([label, value, detail, type, Icon, color]) => <article key={label} className="rounded-xl border border-border bg-[var(--card)] p-5 transition hover:border-border"><div className="flex items-start justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{label}</p><p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{value}</p></div><span className={`rounded-lg p-2 ${color === 'emerald' ? 'bg-secondary/10 text-foreground' : color === 'rose' ? 'bg-chart-5/10 text-chart-5' : color === 'violet' ? 'bg-secondary/10 text-foreground' : color === 'amber' ? 'bg-chart-1/10 text-chart-1' : 'bg-secondary/10 text-muted-foreground'}`}><Icon size={18} /></span></div><div className="mt-3 flex items-end justify-between gap-2"><p className={`text-xs ${detail.startsWith('+') || detail.includes('total') ? 'text-foreground' : 'text-muted-foreground'}`}>{detail}</p><span className="whitespace-nowrap rounded-full bg-secondary px-2 py-1 text-[10px] text-muted-foreground">{type === 'AI-generated' && <Sparkles className="mr-1 inline text-foreground" size={11} />}{type}</span></div></article>)}</section>
<section className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-[var(--card)] p-3"><label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg bg-secondary px-3 py-2"><Search size={17} className="text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search leads..." className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" /></label>{['Status', 'Score', 'Priority', 'Source', 'Owner', 'Industry', 'Region'].map(filter => <button key={filter} onClick={() => action(`${filter} filter selected`)} className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary"><span>{filter}</span><ChevronDown size={13} /></button>)}<div className="flex items-center rounded-lg border border-border p-0.5"><button onClick={() => setView('Table')} className={`rounded-md px-2.5 py-1.5 text-xs ${view === 'Table' ? 'bg-secondary/20 text-foreground' : 'text-foreground'}`}>Table</button><button onClick={() => setView('Kanban')} className={`rounded-md px-2.5 py-1.5 text-xs ${view === 'Kanban' ? 'bg-secondary/20 text-foreground' : 'text-foreground'}`}>Kanban</button><button onClick={() => setView('List')} className={`rounded-md px-2.5 py-1.5 text-xs ${view === 'List' ? 'bg-secondary/20 text-foreground' : 'text-foreground'}`}>List</button></div><button onClick={() => action('Advanced filters')} className="rounded-lg border border-border p-2 text-foreground hover:text-foreground" aria-label="Advanced filters"><Filter size={16} /></button><button onClick={() => action('Columns menu')} className="rounded-lg border border-border p-2 text-foreground hover:text-foreground" aria-label="Columns"><Columns3 size={16} /></button></section>
<section className="overflow-hidden rounded-xl border border-border bg-[var(--card)]"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 className="font-medium text-foreground">All leads</h2><p className="mt-1 text-xs text-muted-foreground">{filtered.length} visible of 428 leads · {view} view</p></div><button onClick={() => action('Lead list refreshed')} className="text-xs text-foreground hover:text-foreground">Updated just now</button></div><div className="overflow-x-auto"><table className="w-full min-w-[1420px] text-left text-sm"><thead className="bg-secondary text-[11px] font-medium uppercase tracking-wider text-muted-foreground"><tr><th className="w-10 px-4 py-3"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} aria-label="Select all leads" /></th>{['Lead', 'Company', 'Email', 'Source', 'Owner', 'Status', 'Lead Score', 'Priority', 'Last Activity', 'Created', 'Next Action', ''].map(heading => <th key={heading || 'actions'} className="whitespace-nowrap px-3 py-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-white/[0.06]">{filtered.map(lead => <tr key={lead.id} className="transition hover:bg-secondary"><td className="px-4 py-3"><input type="checkbox" checked={selected.includes(lead.id)} onChange={() => setSelected(selected.includes(lead.id) ? selected.filter(id => id !== lead.id) : [...selected, lead.id])} aria-label={`Select ${lead.name}`} /></td><td className="px-3 py-3"><div className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary text-xs font-semibold text-primary-foreground">{lead.initials}</span><span className="min-w-0"><strong className="block whitespace-nowrap font-medium text-foreground">{lead.name}</strong><span className="block text-xs text-muted-foreground">{lead.title}</span></span></div></td><td className="max-w-[180px] truncate px-3 py-3 text-sm text-foreground">{lead.company}</td><td className="max-w-[220px] truncate px-3 py-3 text-sm text-muted-foreground">{lead.email}</td><td className="whitespace-nowrap px-3 py-3 text-xs text-foreground"><Globe2 size={14} className="mr-1.5 inline text-muted-foreground" />{lead.source}</td><td className="whitespace-nowrap px-3 py-3 text-xs text-foreground"><span className="mr-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary/15 text-[9px] text-foreground">{lead.ownerInitials}</span>{lead.owner}</td><td className="px-3 py-3"><span className={`whitespace-nowrap rounded-full px-2 py-1 text-xs ${statusStyles[lead.status]}`}>{lead.status}</span></td><td className="min-w-[120px] px-3 py-3"><strong className={`mr-2 ${lead.score >= 80 ? 'text-foreground' : lead.score >= 50 ? 'text-foreground' : 'text-chart-5'}`}>{lead.score}</strong><span className="inline-block h-1.5 w-16 rounded-full bg-secondary align-middle"><span className={`block h-1.5 rounded-full ${lead.score >= 80 ? 'bg-primary' : lead.score >= 50 ? 'bg-primary' : 'bg-destructive'}`} style={{
                          width: `${lead.score}%`
                        }} /></span></td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-xs ${lead.priority === 'High' ? 'bg-chart-5/15 text-chart-5' : lead.priority === 'Medium' ? 'bg-secondary/15 text-foreground' : 'bg-secondary/15 text-foreground'}`}>{lead.priority}</span></td><td className="whitespace-nowrap px-3 py-3 text-xs text-muted-foreground"><Clock3 size={13} className="mr-1 inline" />{lead.activity}</td><td className="whitespace-nowrap px-3 py-3 text-xs text-muted-foreground">{lead.created}</td><td className="px-3 py-3"><button onClick={() => action(`${lead.action} for ${lead.name}`)} className="whitespace-nowrap rounded-md bg-secondary/10 px-2 py-1 text-xs text-foreground hover:bg-secondary/20">{lead.action}</button></td><td className="px-3 py-3"><button onClick={() => action(`More actions for ${lead.name}`)} className="rounded-md p-1.5 text-foreground hover:bg-secondary hover:text-foreground" aria-label={`More actions for ${lead.name}`}><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div><footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-xs text-muted-foreground"><span>Showing 1–{filtered.length} of 428 leads</span><div className="flex items-center gap-1"><button className="rounded p-1.5 hover:bg-secondary" aria-label="Previous page"><ChevronLeft size={15} /></button><span className="rounded bg-secondary/20 px-2 py-1 text-foreground">1</span><button className="rounded p-1.5 hover:bg-secondary" aria-label="Next page"><ChevronRight size={15} /></button></div><label>Per page <select className="ml-1 rounded border border-border bg-transparent p-1 text-foreground"><option>10</option><option>25</option><option>50</option></select></label></footer></section>
<div className="grid gap-5 xl:grid-cols-3"><section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="mb-5 flex items-center gap-2"><GitBranch size={18} className="text-foreground" /><h2 className="font-medium text-foreground">Lead Funnel</h2></div><div className="space-y-3">{funnel.map(([name, count, pct, drop, color, width]) => <button key={name} onClick={() => action(`${name} stage selected`)} className="block w-full text-left"><div className="mb-1 flex items-center justify-between text-xs"><span className="text-foreground">{name}</span><span className="text-muted-foreground">{count} · {pct}</span></div><div className="h-7 rounded-md bg-secondary"><div className={`h-7 rounded-md ${color} transition hover:brightness-125`} style={{
                      width
                    }} /></div><p className="mt-1 text-[11px] text-muted-foreground">{drop}</p></button>)}</div></section><section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="mb-5 flex items-center gap-2"><Globe2 size={18} className="text-foreground" /><h2 className="font-medium text-foreground">Lead Sources</h2></div><div className="space-y-1">{sources.map(([source, count, qualified, rate, score]) => <div key={source} className="grid grid-cols-[1.4fr_.5fr_.7fr_.7fr_.5fr] items-center gap-2 rounded-md px-2 py-2 text-xs even:bg-secondary"><span className="flex items-center gap-2 truncate text-foreground"><span className="h-2 w-2 shrink-0 rounded-full bg-primary text-primary-foreground" />{source}</span><span className="text-muted-foreground">{count}</span><span className="text-muted-foreground">{qualified}</span><span className="text-foreground">{rate}</span><strong className="text-foreground">{score}</strong></div>)}</div><div className="mt-3 grid grid-cols-[1.4fr_.5fr_.7fr_.7fr_.5fr] px-2 text-[10px] uppercase tracking-wide text-muted-foreground"><span>Source</span><span>Leads</span><span>Qualified</span><span>Conv.</span><span>Score</span></div></section><section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="mb-4 flex items-center gap-2"><Bell size={18} className="text-foreground" /><h2 className="font-medium text-foreground">Leads to Contact</h2><span className="rounded-full bg-secondary/15 px-2 py-0.5 text-xs text-foreground">37</span></div><div className="space-y-2">{leads.filter(lead => ['Maria Chen', 'Carlos Vega', 'Tom Bergmann'].includes(lead.name)).map(lead => <article key={lead.id} className="rounded-lg bg-secondary p-3"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-[10px] text-foreground">{lead.initials}</span><div className="min-w-0 flex-1"><strong className="block truncate text-sm text-foreground">{lead.name}</strong><span className="block truncate text-xs text-muted-foreground">{lead.company}</span></div><span className="text-xs text-foreground">{lead.score}</span></div><p className="mt-2 text-[11px] text-muted-foreground">Last activity {lead.activity}</p><div className="mt-2 flex gap-2"><button onClick={() => action(`Contacting ${lead.name}`)} className="rounded-md bg-secondary/15 px-2 py-1 text-[11px] text-foreground hover:bg-secondary/25">Contact</button><button onClick={() => action('Task created')} className="rounded-md border border-border px-2 py-1 text-[11px] text-foreground hover:text-foreground">Create Task</button></div></article>)}</div><button onClick={() => action('Showing all leads to contact')} className="mt-4 text-xs text-foreground hover:text-foreground">View all 37 →</button></section></div>
<section className="rounded-xl border border-border/20 bg-[var(--card)] p-5"><div className="mb-5 flex flex-wrap items-center gap-2"><Sparkles size={18} className="text-foreground" /><h2 className="font-medium text-foreground">AI Recommendations</h2><span className="rounded-full bg-secondary/15 px-2 py-1 text-[10px] text-foreground">AI-generated</span><span className="text-xs text-muted-foreground">Last updated 5 min ago</span></div><div className="grid gap-3 lg:grid-cols-3">{[['⚡ Prioritize Anika Mehta', 'Strong company fit and recent engagement suggest high sales potential. Score: 94.', 'Open Lead'], ['📞 Follow Up: Nova Commerce', 'Maria Chen has not been contacted in 2 days. High-priority lead at risk of going cold.', 'Contact'], ['📊 Review Lead Source', 'Referral leads show 36.8% conversion rate — above your 24.6% average. Consider increasing referral investment.', 'Review']].map(([title, description, cta]) => <article key={title} className="rounded-xl border-l-2 border-border/50 bg-secondary p-4"><h3 className="font-medium text-foreground">{title}</h3><p className="mt-2 min-h-12 text-sm leading-5 text-muted-foreground">{description}</p><div className="mt-4 flex gap-2"><button onClick={() => action(`${cta} opened`)} className="rounded-md bg-secondary/15 px-3 py-1.5 text-xs text-foreground hover:bg-secondary/25">{cta}</button><button onClick={() => action('Task created')} className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:text-foreground">Create Task</button></div></article>)}</div></section>
<section className="rounded-xl border border-border/20 bg-gradient-to-br from-secondary/10 to-transparent p-6"><div className="flex items-center gap-2"><Sparkles size={19} className="text-muted-foreground" /><h2 className="font-medium text-foreground">Ask Lulu AI</h2></div><p className="mt-1 text-sm text-muted-foreground">Get instant insights about your leads, priorities, and pipeline opportunities.</p><div className="mt-4 flex gap-2"><input placeholder="Ask Lulu AI about your leads..." className="min-w-0 flex-1 rounded-xl bg-secondary px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" /><button onClick={() => action('Lulu is thinking...')} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary"><Send size={15} />Send</button></div><div className="mt-3 flex gap-2 overflow-x-auto pb-1">{['Which leads should I contact today?', 'Show me my highest-value leads.', 'Which leads are most likely to convert?', 'Why is this lead scored highly?', 'Which lead sources perform best?'].map(prompt => <button key={prompt} onClick={() => action(prompt)} className="whitespace-nowrap rounded-full bg-secondary px-3 py-1.5 text-xs text-foreground hover:bg-secondary hover:text-foreground">{prompt}</button>)}</div></section>
<div className="grid gap-5 lg:grid-cols-2"><section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex items-center justify-between"><h2 className="font-medium text-foreground">Data Quality</h2><strong className="text-2xl text-foreground">82<span className="text-sm text-muted-foreground">/100</span></strong></div><div className="mt-4 space-y-3">{[['Missing email', '3'], ['Missing owner', '7'], ['Duplicate records', '2'], ['Incomplete profiles', '12']].map(([issue, count]) => <div key={issue} className="flex items-center justify-between border-b border-border pb-2 text-sm"><span className="text-foreground">{issue} <span className="text-muted-foreground">({count})</span></span><button onClick={() => action(`Fixing ${issue}`)} className="text-xs text-foreground hover:text-foreground">Fix</button></div>)}</div></section><section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex items-center justify-between"><h2 className="font-medium text-foreground">Potential Duplicates</h2><span className="text-xs text-muted-foreground">2 pairs found</span></div><div className="mt-4 space-y-3">{[['Maria Chen', 'Maria C. · Nova Commerce'], ['Tom Bergmann', 'Thomas Bergmann · DataStream AG']].map(([name, match]) => <div key={name} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-secondary p-3"><div><strong className="block text-sm text-foreground">{name}</strong><span className="text-xs text-muted-foreground">Possible match: {match}</span></div><div className="flex gap-2"><button onClick={() => action('Merge review opened')} className="rounded-md bg-secondary/15 px-2.5 py-1 text-xs text-foreground">Merge</button><button onClick={() => action('Duplicate ignored')} className="rounded-md border border-border px-2.5 py-1 text-xs text-foreground">Ignore</button></div></div>)}</div></section></div>
<section className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="mb-5 flex items-center gap-2"><Clock3 size={18} className="text-foreground" /><h2 className="font-medium text-foreground">Recent Activity</h2></div><div className="grid gap-4 md:grid-cols-5">{[['Lead created', 'Anika Mehta', '2h ago', 'text-foreground'], ['Lead qualified', 'Marcus Johnson', '4h ago', 'text-foreground'], ['Score changed', 'Maria Chen 81→87', '6h ago', 'text-foreground'], ['Lead assigned', 'Emil Larsen → Jordan D.', '1d ago', 'text-foreground'], ['Lead converted', 'Carlos Vega → Opportunity', '2d ago', 'text-foreground']].map(([event, detail, time, color]) => <div key={event} className="border-l border-border pl-3"><span className={`text-xs ${color}`}>● {event}</span><strong className="mt-1 block text-sm text-foreground">{detail}</strong><span className="mt-1 block text-xs text-muted-foreground">{time}</span></div>)}</div></section></div></main></div>{notice && <div className="fixed bottom-5 right-5 z-50 rounded-lg border border-border/30 bg-[var(--secondary)] px-4 py-3 text-sm text-foreground shadow-2xl" role="status">{notice}</div>}</div>;
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
