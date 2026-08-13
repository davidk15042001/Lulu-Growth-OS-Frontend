import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, ArrowDown, ArrowUp, BarChart3, Bell, Bot, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp, Clock3, Database, Download, FileText, Filter, Gauge, GitBranch, Lightbulb, Link2, ListFilter, Menu, MoreHorizontal, Plus, RefreshCw, Search, Settings2, ShieldAlert, Sparkles, Target, TrendingUp, User, Users, X, Zap } from 'lucide-react';
type EventType = 'insight' | 'risk' | 'recommendation' | 'decision' | 'task' | 'automation' | 'data' | 'opportunity' | 'anomaly' | 'forecast' | 'user';
type Significance = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
interface ActivityEvent {
  id: string;
  time: string;
  type: EventType;
  label: string;
  title: string;
  description?: string;
  actor: string;
  area: string;
  source?: string;
  significance: Significance;
  status?: string;
  impact?: string;
  ai?: string;
}
const events: ActivityEvent[] = [{
  id: 'churn',
  time: '10:42',
  type: 'insight',
  label: 'AI Insight',
  title: 'Customer churn increased by 8.4%',
  description: 'Lulu AI detected a significant increase in customer churn within the high-value segment.',
  actor: 'Lulu AI',
  area: 'Customers',
  source: 'CRM',
  significance: 'High',
  impact: 'Est. Revenue Impact: $48K–$92K',
  ai: 'AI Detected'
}, {
  id: 'risk-escalated',
  time: '10:15',
  type: 'risk',
  label: 'Risk Escalated',
  title: 'Customer Retention Risk escalated from Medium to High',
  description: 'Sustained deterioration across multiple periods triggered escalation.',
  actor: 'Lulu AI',
  area: 'Customers / Revenue',
  source: 'AI Intelligence',
  significance: 'Critical',
  ai: 'AI Detected'
}, {
  id: 'retention-rec',
  time: '09:47',
  type: 'recommendation',
  label: 'AI Recommendation',
  title: 'Retention strategy recommended for high-value customer segment',
  description: 'Lulu AI recommends activating a targeted retention strategy for at-risk high-LTV customers.',
  actor: 'Lulu AI',
  area: 'Customers',
  significance: 'High',
  ai: 'AI Generated'
}, {
  id: 'decision',
  time: '09:31',
  type: 'decision',
  label: 'Decision Created',
  title: 'Decision created: Activate retention program for high-value segment?',
  description: 'User created a decision based on the retention recommendation.',
  actor: 'Sarah Chen',
  area: 'Customers',
  significance: 'Medium',
  ai: 'User Action'
}, {
  id: 'task',
  time: '09:12',
  type: 'task',
  label: 'AI Task Completed',
  title: 'Retention analysis task completed',
  description: 'AI agent completed the customer retention segment analysis.',
  actor: 'AI Customer Agent',
  area: 'Customers',
  significance: 'Medium',
  status: 'Completed',
  ai: 'AI Executed'
}, {
  id: 'ads-auto',
  time: '08:47',
  type: 'automation',
  label: 'Automation Executed',
  title: 'Google Ads budget optimization automation executed successfully',
  description: 'Budget reallocation completed across 3 ad groups.',
  actor: 'Google Ads Integration',
  area: 'Advertising',
  significance: 'Info',
  status: 'Completed',
  ai: 'Automation'
}, {
  id: 'shopify',
  time: '08:20',
  type: 'data',
  label: 'Data Synchronized',
  title: 'Shopify data synchronized',
  description: 'Ecommerce data refreshed. 1,247 records updated.',
  actor: 'Shopify Integration',
  area: 'Ecommerce',
  source: 'Shopify',
  significance: 'Info',
  status: 'Success'
}, {
  id: 'roas',
  time: '08:05',
  type: 'insight',
  label: 'AI Insight',
  title: 'Advertising ROAS declined 12% across Meta Ads campaigns',
  actor: 'Lulu AI',
  area: 'Advertising',
  source: 'Meta Ads',
  significance: 'Medium',
  ai: 'AI Detected'
}, {
  id: 'opportunity',
  time: '17:33',
  type: 'opportunity',
  label: 'Opportunity Detected',
  title: 'Expansion opportunity detected in Enterprise customer segment',
  actor: 'Lulu AI',
  area: 'Revenue / Customers',
  significance: 'High',
  ai: 'AI Detected'
}, {
  id: 'export',
  time: '16:21',
  type: 'user',
  label: 'User Action',
  title: 'Report exported by David Kim',
  actor: 'David Kim · CFO',
  area: 'Finance',
  significance: 'Info',
  ai: 'User Action'
}, {
  id: 'forecast',
  time: '14:45',
  type: 'forecast',
  label: 'AI Forecast',
  title: 'Revenue forecast updated for Q3 2025',
  actor: 'Lulu AI',
  area: 'Revenue',
  significance: 'Medium',
  ai: 'AI Generated'
}, {
  id: 'anomaly',
  time: '11:20',
  type: 'anomaly',
  label: 'Anomaly Detected',
  title: 'Revenue anomaly detected — single-day drop of 14.2%',
  actor: 'Lulu AI',
  area: 'Revenue',
  source: 'Shopify / Finance',
  significance: 'High',
  ai: 'AI Detected'
}, {
  id: 'inventory',
  time: '15:10',
  type: 'risk',
  label: 'Risk Detected',
  title: 'Inventory shortage risk detected for top 3 SKUs',
  actor: 'Lulu AI',
  area: 'Ecommerce / Operations',
  significance: 'Medium',
  ai: 'AI Detected'
}, {
  id: 'budget',
  time: '09:30',
  type: 'decision',
  label: 'Decision Made',
  title: 'Decision approved: Increase Google Ads budget by 15%',
  actor: 'James Park',
  area: 'Advertising',
  significance: 'Medium',
  ai: 'User Action'
}];
const typeStyles: Record<EventType, {
  color: string;
  bg: string;
}> = {
  insight: {
    color: 'var(--foreground)',
    bg: 'var(--foreground)'
  },
  risk: {
    color: 'var(--foreground)',
    bg: 'var(--foreground)'
  },
  recommendation: {
    color: 'var(--foreground)',
    bg: 'var(--foreground)'
  },
  decision: {
    color: 'var(--foreground)',
    bg: 'var(--foreground)'
  },
  task: {
    color: 'var(--foreground)',
    bg: 'var(--foreground)'
  },
  automation: {
    color: 'var(--muted-foreground)',
    bg: 'var(--foreground)'
  },
  data: {
    color: 'var(--foreground)',
    bg: 'var(--foreground)'
  },
  opportunity: {
    color: 'var(--foreground)',
    bg: 'var(--foreground)'
  },
  anomaly: {
    color: 'var(--chart-1)',
    bg: 'var(--foreground)'
  },
  forecast: {
    color: 'var(--foreground)',
    bg: 'var(--foreground)'
  },
  user: {
    color: 'var(--muted-foreground)',
    bg: 'var(--foreground)'
  }
};
const typeIcons: Record<EventType, typeof Sparkles> = {
  insight: Sparkles,
  risk: ShieldAlert,
  recommendation: Lightbulb,
  decision: GitBranch,
  task: CheckCircle2,
  automation: Zap,
  data: Database,
  opportunity: TrendingUp,
  anomaly: AlertTriangle,
  forecast: BarChart3,
  user: User
};
const filterGroups = [['Time', 'Today'], ['Activity Type', 'All types'], ['Business Area', 'All areas'], ['Significance', 'All levels'], ['Actor', 'All actors'], ['Source', 'All sources']];
const watchTopics = ['KPI changes', 'Revenue events', 'Customer events', 'Advertising events', 'Risk events', 'Opportunity events', 'AI task events'];
const impactRows = [['Churn Rate', '4.8%', 'Last 30d', '↑ +1.7pp'], ['Retention Rate', '87.2%', 'Last 30d', '↓ -3.1pp'], ['Revenue at Risk', '$48K–$92K', 'Last 30d', 'Estimated']];
export const ActivityTimeline = () => {
  const [selectedId, setSelectedId] = useState('churn');
  const [query, setQuery] = useState('');
  const [view, setView] = useState('Timeline');
  const [exportOpen, setExportOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [watched, setWatched] = useState<string[]>(['Revenue events', 'Risk events']);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [ask, setAsk] = useState('');
  const filteredEvents = useMemo(() => events.filter(event => `${event.title} ${event.description ?? ''} ${event.label}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const selected = events.find(event => event.id === selectedId) ?? events[0];
  const SelectedIcon = typeIcons[selected.type];
  return <main className="min-h-screen bg-[var(--background)] text-foreground font-sans">
      <style>{`@keyframes softPulse{0%,100%{opacity:.55}50%{opacity:1}} .ai-pulse{animation:softPulse 2.4s ease-in-out infinite} @media(prefers-reduced-motion:reduce){.ai-pulse{animation:none}}`}</style>
      <div className="flex min-h-screen">
        <aside className="hidden w-[246px] shrink-0 border-r border-border/[.07] bg-[var(--sidebar)] px-4 py-5 lg:block">
          <div className="mb-8 flex items-center gap-3 px-2"><div className="grid h-9 w-9 place-items-center rounded-xl bg-primary shadow-lg shadow-black/30 text-primary-foreground"><Sparkles size={19} /></div><span className="text-[17px] font-semibold tracking-tight">Lulu <span className="text-foreground">AI</span></span></div>
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Workspace</p>
          <nav aria-label="Primary navigation" className="space-y-1">
            {[['Overview', Gauge], ['Intelligence', Activity], ['Business Areas', Target], ['Automations', Zap], ['Reports', FileText]].map(([label, Icon]) => <button key={String(label)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] text-foreground hover:bg-secondary hover:text-foreground"><Icon size={16} /><span>{String(label)}</span></button>)}
          </nav>
          <div className="mt-8"><p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Intelligence</p><button className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] text-foreground"><Bot size={16} /><span>AI Intelligence</span><ChevronDown className="ml-auto" size={14} /></button><button className="flex w-full items-center gap-3 rounded-lg border border-border/20 bg-secondary/10 px-3 py-2.5 text-left text-[13px] font-medium text-foreground"><span className="ml-1 h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /><span>Activity Timeline</span></button><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] text-foreground hover:bg-secondary"><span className="ml-1 h-1.5 w-1.5 rounded-full bg-secondary" /><span>Insights</span></button></div>
          <div className="mt-auto pt-32"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-foreground hover:bg-secondary"><Settings2 size={16} /><span>Settings</span></button><div className="mt-4 flex items-center gap-3 border-t border-border/[.07] px-2 pt-4"><div className="grid h-8 w-8 place-items-center rounded-full bg-sidebar text-xs font-semibold">SC</div><div><p className="text-xs font-medium">Sarah Chen</p><p className="text-[11px] text-muted-foreground">Administrator</p></div><MoreHorizontal className="ml-auto text-muted-foreground" size={16} /></div></div>
        </aside>
        <section className="min-w-0 flex-1">
          <header className="border-b border-border/[.07] bg-[var(--card)] px-5 py-5 sm:px-8 lg:px-10"><div className="flex items-start justify-between gap-4"><div><div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground"><Menu className="lg:hidden" size={17} /><span>Intelligence</span><ChevronRight size={13} /><span>AI Intelligence</span><ChevronRight size={13} /><span className="text-foreground">Activity Timeline</span></div><h1 className="text-2xl font-semibold tracking-[-.03em] sm:text-[30px]">Activity Timeline</h1><p className="mt-1 text-sm text-muted-foreground">See what changed across your business, what Lulu AI detected, and what actions followed.</p></div><div className="hidden items-center gap-2 md:flex"><button className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-sm font-semibold shadow-lg shadow-black/30 hover:bg-primary text-primary-foreground"><Sparkles size={16} />Ask Lulu AI</button><button className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground hover:bg-secondary"><RefreshCw size={15} />Refresh</button><button className="rounded-lg border border-border px-3.5 py-2.5 text-sm text-foreground hover:bg-secondary">Create Report</button><div className="relative"><button onClick={() => setExportOpen(!exportOpen)} className="flex items-center gap-2 rounded-lg border border-border px-3.5 py-2.5 text-sm text-foreground"><Download size={15} />Export<ChevronDown size={14} /></button>{exportOpen && <div className="absolute right-0 top-12 z-10 w-32 rounded-lg border border-border bg-[var(--secondary)] p-1 shadow-xl"><button className="w-full rounded px-3 py-2 text-left text-xs hover:bg-secondary">PDF</button><button className="w-full rounded px-3 py-2 text-left text-xs hover:bg-secondary">CSV</button><button className="w-full rounded px-3 py-2 text-left text-xs hover:bg-secondary">XLSX</button></div>}</div></div></div><label className="mt-6 flex items-center gap-3 rounded-lg border border-border bg-[var(--card)] px-3.5 py-3 text-sm text-muted-foreground"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} className="w-full bg-transparent text-muted-foreground outline-none placeholder:text-muted-foreground" placeholder="Search activity, insights, decisions, tasks..." aria-label="Search activity" /></label></header>
          <div className="space-y-6 px-5 py-6 sm:px-8 lg:px-10">
            <section className="rounded-xl border border-border/20 bg-[linear-gradient(110deg,var(--card),var(--card))] p-5 shadow-xl shadow-black/10"><div className="flex items-start gap-4"><div className="ai-pulse grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary/15 text-foreground"><Sparkles size={20} /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-semibold">AI Activity Summary</h2><span className="rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] font-semibold text-foreground">AI-generated</span></div><p className="mt-2 max-w-4xl text-sm leading-6 text-foreground">Lulu AI detected 8 significant business events today. Three generated recommendations, one created a new opportunity, and two AI tasks were executed automatically.</p><p className="mt-2 text-[11px] text-muted-foreground">AI interpretation based on available business data. Not a guarantee of outcome.</p></div></div></section>
            <section aria-labelledby="overview-heading"><div className="mb-3 flex items-center justify-between"><h2 id="overview-heading" className="text-sm font-semibold">Activity Overview</h2><span className="text-xs text-muted-foreground">June 10, 2025 · Live</span></div><div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{[['47', 'Total Activity', 'text-foreground'], ['18', 'AI Activity', 'text-foreground'], ['12', 'Business Events', 'text-foreground'], ['9', 'User Activity', 'text-foreground'], ['6', 'Automated Activity', 'text-foreground'], ['3', 'Significant Events', 'text-foreground']].map(([value, label, color]) => <div key={label} className="rounded-xl border border-border/[.08] bg-[var(--secondary)] p-4"><p className={`text-2xl font-semibold ${color}`}>{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>)}</div></section>
            <section className="rounded-xl border border-border/[.08] bg-[var(--card)] p-4"><div className="flex items-center justify-between"><button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-2 text-sm font-semibold"><Filter size={15} className="text-foreground" />Filters<ChevronDown size={14} className={filtersOpen ? '' : '-rotate-90'} /></button><span className="text-xs text-muted-foreground">14 events</span></div>{filtersOpen && <div className="mt-4 flex flex-wrap gap-2">{filterGroups.map(([name, value]) => <button key={name} className="flex items-center gap-2 rounded-lg border border-border bg-[var(--primary)] px-3 py-2 text-xs text-primary-foreground hover:border-border/40"><span className="text-muted-foreground">{name}</span><span>{value}</span><ChevronDown size={13} className="text-muted-foreground" /></button>)}<button className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-foreground hover:bg-secondary/10"><X size={13} />Clear all</button></div>}</section>
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">Activity stream</h2><p className="mt-1 text-xs text-muted-foreground">Newest first · Chronological intelligence history</p></div><div className="flex rounded-lg border border-border bg-[var(--secondary)] p-1">{['Timeline', 'Grouped', 'Impact', 'AI View'].map(item => <button key={item} onClick={() => setView(item)} className={`rounded-md px-3 py-1.5 text-xs ${view === item ? 'bg-secondary/15 font-medium text-foreground' : 'text-foreground hover:text-foreground'}`}>{item}</button>)}</div></div>
            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.62fr)_minmax(340px,.9fr)]"><section aria-label="Activity timeline"><div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.16em] text-muted-foreground"><Clock3 size={14} />Today · June 10, 2025</div><ol className="timeline-list space-y-3">{filteredEvents.map((event, eventIndex) => {
                  const Icon = typeIcons[event.type];
                  const style = typeStyles[event.type];
                  const isYesterday = eventIndex === 8;
                  const isWeek = eventIndex === 12;
                  return <li key={event.id} className="timeline-item relative pl-8"><div className="timeline-node" style={{
                      backgroundColor: style.color
                    }} /><div className={`rounded-xl border border-border/[.08] border-l-2 bg-[var(--secondary)] p-4 transition hover:border-border hover:bg-[var(--secondary)] ${event.type === 'risk' ? 'border-l-chart-5' : ''}`} style={{
                      borderLeftColor: style.color
                    }}><div className="flex gap-3"><div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{
                          backgroundColor: style.bg,
                          color: style.color
                        }}><Icon size={16} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground"><time>{event.time}</time><span>—</span><span className="font-medium" style={{
                              color: style.color
                            }}>{event.label}</span><span className={`ml-auto flex items-center gap-1 ${event.significance === 'Critical' ? 'text-chart-5' : event.significance === 'High' ? 'text-foreground' : event.significance === 'Medium' ? 'text-foreground' : 'text-muted-foreground'}`}><span className={`h-1.5 w-1.5 rounded-full border ${event.significance === 'Info' ? 'border-border' : 'border-current bg-current'}`} />{event.significance}</span></div><h3 className="mt-1.5 text-sm font-semibold leading-5 text-foreground">{event.title}</h3>{event.description && <p className="mt-1 text-xs leading-5 text-muted-foreground">{event.description}</p>}<div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground"><span className="flex items-center gap-1.5"><span className="grid h-4 w-4 place-items-center rounded-full bg-card text-[8px]">{event.actor === 'Lulu AI' ? <Sparkles size={9} /> : <User size={9} />}</span>{event.actor}</span><span>• {event.area}</span>{event.source && <span>• {event.source}</span>}{event.ai && <span className="rounded-full border border-border/20 bg-secondary/10 px-2 py-0.5 text-foreground">{event.ai}</span>}{event.status && <span className="flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-foreground"><Check size={10} />{event.status}</span>}</div>{event.impact && <p className="mt-3 text-xs font-medium text-foreground">{event.impact} <span className="font-normal text-muted-foreground">· Estimated</span></p>}<div className="mt-3 flex flex-wrap gap-2"><button onClick={() => setSelectedId(event.id)} className="rounded-md border border-border px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:border-border/50 hover:text-foreground">View {event.type === 'insight' ? 'Insight' : event.type === 'risk' ? 'Risk' : event.type === 'task' ? 'Task' : 'Detail'}</button>{event.type === 'recommendation' && <button className="rounded-md border border-border px-2.5 py-1.5 text-[11px] text-foreground">Create Task</button>}</div></div></div></div>{(isYesterday || isWeek) && <div className="date-divider"><span>{isYesterday ? 'Yesterday · June 9, 2025' : 'This week · June 8, 2025'}</span></div>}</li>;
                })}</ol></section>
              <aside className="sticky top-5 rounded-xl border border-border/20 bg-[var(--sidebar)] shadow-2xl shadow-black/20" aria-label="Selected event detail"><div className="border-b border-border/[.08] p-5"><div className="flex items-start justify-between gap-3"><div className="flex gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg" style={{
                      backgroundColor: typeStyles[selected.type].bg,
                      color: typeStyles[selected.type].color
                    }}><SelectedIcon size={18} /></div><div><span className="text-[11px] font-medium" style={{
                        color: typeStyles[selected.type].color
                      }}>{selected.label}</span><h2 className="mt-1 text-base font-semibold leading-5">{selected.title}</h2></div></div><button className="text-foreground hover:text-foreground" aria-label="Close event detail"><X size={17} /></button></div><div className="mt-3 flex items-center gap-2 text-xs"><span className="rounded-full bg-secondary/10 px-2 py-1 text-foreground">● High</span><span className="rounded-full bg-secondary/10 px-2 py-1 text-foreground">AI Detected</span></div></div><div className="space-y-5 p-5"><dl className="grid grid-cols-2 gap-y-3 text-xs"><div><dt className="text-muted-foreground">Timestamp</dt><dd className="mt-1 text-foreground">June 10, 2025<br />at 10:42 AM</dd></div><div><dt className="text-muted-foreground">Actor</dt><dd className="mt-1 flex items-center gap-1 text-foreground"><Sparkles size={12} className="text-foreground" />Lulu AI</dd></div><div><dt className="text-muted-foreground">Source</dt><dd className="mt-1 text-foreground">CRM</dd></div><div><dt className="text-muted-foreground">Business Area</dt><dd className="mt-1 text-foreground">Customers / Revenue</dd></div></dl><div><h3 className="mb-2 text-xs font-semibold">Description</h3><p className="text-xs leading-5 text-muted-foreground">Lulu AI detected a statistically significant increase in customer churn within the high-value segment during the last 30-day period. Churn rate moved from 3.1% to 4.8%.</p></div><div><h3 className="mb-2 text-xs font-semibold">Evidence <span className="font-normal text-muted-foreground">· Observed Event</span></h3><div className="overflow-hidden rounded-lg border border-border/[.08]"><table className="w-full text-left text-[11px]"><thead className="bg-secondary text-muted-foreground"><tr><th className="p-2 font-medium">Metric</th><th className="p-2 font-medium">Value</th><th className="p-2 font-medium">Change</th></tr></thead><tbody>{impactRows.map(row => <tr key={row[0]} className="border-t border-border/[.06]"><td className="p-2 text-muted-foreground">{row[0]}</td><td className="p-2 text-foreground">{row[1]}</td><td className="p-2 text-foreground">{row[3]}</td></tr>)}</tbody></table></div></div><div><h3 className="mb-3 text-xs font-semibold">Activity Chain</h3><div className="space-y-0 border-l border-border/30 pl-4 text-[11px] text-muted-foreground">{['Revenue anomaly detected', 'AI analyzed churn data', 'AI Insight created', 'Risk escalated', 'Recommendation generated', 'Decision created', 'AI Task created', 'Analysis completed'].map(chainItem => <button key={chainItem} className={`relative block w-full py-1 text-left hover:text-foreground ${chainItem === 'AI Insight created' ? 'font-semibold text-foreground' : ''}`}><span className="absolute -left-[21px] top-2 h-2 w-2 rounded-full border-2 border-[var(--muted-foreground)] bg-primary text-primary-foreground" />{chainItem}</button>)}</div><p className="mt-3 text-[10px] leading-4 text-muted-foreground">AI-identified event chain — relationships based on available data. Causality not confirmed.</p></div><div className="rounded-lg border border-border/[.07] bg-secondary p-3"><h3 className="text-xs font-semibold">Impact <span className="font-normal text-muted-foreground">· Estimated</span></h3><div className="mt-2 grid grid-cols-3 gap-2 text-[11px]"><div><p className="text-muted-foreground">Revenue</p><p className="mt-1 text-foreground">$48K–$92K</p></div><div><p className="text-muted-foreground">Customer</p><p className="mt-1 text-foreground">High</p></div><div><p className="text-muted-foreground">Strategic</p><p className="mt-1 text-foreground">Medium</p></div></div></div><div className="grid grid-cols-2 gap-2"><button className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold hover:bg-primary text-primary-foreground">View Full Insight</button><button className="rounded-lg border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary">View Related Risk</button></div><div><label htmlFor="annotation" className="mb-2 block text-xs font-medium">User Annotation</label><textarea id="annotation" value={note} onChange={e => {
                    setNote(e.target.value);
                    setSaved(false);
                  }} className="h-16 w-full resize-none rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-xs outline-none focus:border-border" placeholder="Add a note about this event..." /><button onClick={() => setSaved(true)} className="mt-2 text-xs font-medium text-foreground hover:text-foreground">{saved ? 'Saved' : 'Save annotation'}</button></div></div></aside></div>
            <div className="grid gap-5 lg:grid-cols-2"><section className="rounded-xl border border-border/[.08] bg-[var(--card)] p-5"><div className="flex items-center gap-2"><ShieldAlert size={17} className="text-chart-1" /><h2 className="text-sm font-semibold">AI Priority Activity</h2><span className="ml-auto rounded-full bg-chart-1/10 px-2 py-1 text-[10px] text-chart-1">3 require attention</span></div><p className="mt-2 text-xs leading-5 text-muted-foreground">These events indicate a potential revenue risk.</p><ul className="mt-4 space-y-3">{[['Customer churn increased by 8.4%', 'High-value segment deterioration'], ['Revenue anomaly detected', 'Single-day drop of 14.2%'], ['Retention Risk escalated', 'Sustained multi-period decline']].map(([title, reason]) => <li key={title} className="flex items-start gap-3 border-t border-border/[.06] pt-3"><span className="mt-1 h-2 w-2 rounded-full bg-chart-1" /><div><p className="text-xs font-medium">{title}</p><p className="mt-1 text-[11px] text-muted-foreground">{reason}</p></div><ChevronRight className="ml-auto text-muted-foreground" size={15} /></li>)}</ul></section><section className="rounded-xl border border-border/[.08] bg-[var(--card)] p-5"><div className="flex items-center gap-2"><Sparkles size={17} className="text-foreground" /><h2 className="text-sm font-semibold">Ask Lulu AI</h2></div><div className="mt-4 flex gap-2 rounded-lg border border-border bg-[var(--secondary)] px-3 py-2"><input value={ask} onChange={e => setAsk(e.target.value)} className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground" placeholder="Ask Lulu AI about your business activity..." /><button className="text-foreground" aria-label="Ask Lulu AI"><ArrowUp size={16} /></button></div><div className="mt-3 flex flex-wrap gap-2">{['What changed today?', 'What risks emerged?', 'What decisions were made?', 'Summarize the last 30 days'].map(prompt => <button key={prompt} onClick={() => setAsk(prompt)} className="rounded-full border border-border px-2.5 py-1.5 text-[11px] text-foreground hover:border-border/30 hover:text-foreground">{prompt}</button>)}</div></section></div>
            <section className="rounded-xl border border-border/[.08] bg-[var(--card)] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-semibold">Activity Watch</h2><p className="mt-1 text-xs text-muted-foreground">Choose the topics you want Lulu AI to surface first.</p></div><button className="flex items-center gap-2 text-xs text-foreground"><Plus size={14} />Manage topics</button></div><div className="mt-4 flex flex-wrap gap-2">{watchTopics.map(topic => {
                const isWatched = watched.includes(topic);
                return <button key={topic} onClick={() => setWatched(isWatched ? watched.filter(item => item !== topic) : [...watched, topic])} className={`rounded-lg border px-3 py-2 text-xs ${isWatched ? 'border-border/30 bg-secondary/10 text-foreground' : 'border-border text-foreground hover:text-foreground'}`}>{isWatched ? 'Watching' : 'Watch'} · {topic}</button>;
              })}</div></section>
            <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/[.08] bg-[var(--card)] p-4 text-xs"><div className="flex flex-wrap items-center gap-5"><span className="font-semibold">Activity Data Quality</span><span className="text-chart-4">Freshness: Excellent</span><span className="text-chart-4">Coverage: Good</span><span className="text-foreground">Synchronization: Live</span><span className="text-muted-foreground">Source Coverage: 8/10 connected</span></div><p className="text-muted-foreground">Activity history may be incomplete because one or more data sources are unavailable.</p></section>
          </div>
        </section>
      </div>
    </main>;
};