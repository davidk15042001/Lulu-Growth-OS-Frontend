import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, Archive, ArrowDownUp, Bot, Brain, BookOpen, CheckCircle2, ChevronDown, ChevronRight, Clock3, Cloud, Database, Download, FileJson, FileSpreadsheet, FileText, Filter, HelpCircle, History, LayoutDashboard, Link2, ListFilter, MessageSquare, MoreHorizontal, Network, PauseCircle, PlayCircle, Search, Settings, ShieldCheck, Sparkles, Terminal, User, Users, X, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
type EventStatus = 'Successful' | 'Completed' | 'Failed' | 'Warning' | 'Pending' | 'Blocked' | 'Active' | 'Approved';
type ActivityEvent = {
  id: string;
  time: string;
  name: string;
  description: string;
  initiated: string;
  type: string;
  icon: LucideIcon;
  color: string;
  objectLabel?: string;
  objectValue?: string;
  object2Label?: string;
  object2Value?: string;
  status: EventStatus;
};
type Metric = {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: string;
  note?: string;
};
type SectionRow = {
  id: string;
  primary: string;
  event: string;
  third?: string;
  fourth?: string;
  status?: string;
  time: string;
};
const platformNav = [{
  label: 'AI Assistant',
  icon: MessageSquare
}, {
  label: 'AI Agents',
  icon: Bot
}, {
  label: 'Agent Marketplace',
  icon: Network
}, {
  label: 'Agent Templates',
  icon: Archive
}, {
  label: 'AI Memory',
  icon: Brain
}, {
  label: 'AI Knowledge',
  icon: BookOpen
}, {
  label: 'AI Actions',
  icon: Zap
}, {
  label: 'AI Conversations',
  icon: MessageSquare
}, {
  label: 'AI Activity',
  icon: Activity
}];
const metrics: Metric[] = [{
  label: 'Total Events',
  value: '1,284',
  icon: History,
  tone: 'violet'
}, {
  label: 'Today',
  value: '47',
  icon: Activity,
  tone: 'blue',
  note: '+12% vs yesterday'
}, {
  label: 'AI Actions',
  value: '31',
  icon: Zap,
  tone: 'green'
}, {
  label: 'Agent Events',
  value: '89',
  icon: Bot,
  tone: 'purple'
}, {
  label: 'Knowledge Events',
  value: '24',
  icon: BookOpen,
  tone: 'cyan'
}, {
  label: 'Warnings',
  value: '3',
  icon: AlertTriangle,
  tone: 'amber'
}];
const events: ActivityEvent[] = [{
  id: 'evt-001',
  time: '14:47',
  name: 'AI Agent executed action',
  description: 'Growth Scout Agent paused underperforming ad campaign',
  initiated: 'Growth Scout Agent',
  type: 'Agent',
  icon: Bot,
  color: 'var(--foreground)',
  objectLabel: 'Action',
  objectValue: 'Pause Ad Campaign',
  object2Label: 'Integration',
  object2Value: 'Google Ads',
  status: 'Completed'
}, {
  id: 'evt-002',
  time: '14:32',
  name: 'Knowledge accessed',
  description: 'Product Catalog accessed during conversation',
  initiated: 'AI Assistant',
  type: 'Knowledge',
  icon: BookOpen,
  color: 'var(--chart-4)',
  objectLabel: 'Conversation',
  objectValue: 'Q4 Marketing Strategy Review',
  object2Label: 'Knowledge',
  object2Value: 'Product Catalog',
  status: 'Successful'
}, {
  id: 'evt-003',
  time: '14:15',
  name: 'Conversation started',
  description: 'New conversation initiated by user',
  initiated: 'User',
  type: 'Conversation',
  icon: MessageSquare,
  color: 'var(--foreground)',
  objectLabel: 'Conversation',
  objectValue: 'Product Launch Brief',
  status: 'Active'
}, {
  id: 'evt-004',
  time: '13:58',
  name: 'Action failed',
  description: 'Update inventory action failed due to Shopify timeout',
  initiated: 'SEO Analyst Agent',
  type: 'Action',
  icon: Zap,
  color: 'var(--chart-5)',
  objectLabel: 'Action',
  objectValue: 'Update Inventory',
  object2Label: 'Integration',
  object2Value: 'Shopify',
  status: 'Failed'
}, {
  id: 'evt-005',
  time: '13:45',
  name: 'Memory updated',
  description: 'Brand voice preference updated by AI Assistant',
  initiated: 'AI Assistant',
  type: 'Memory',
  icon: Brain,
  color: 'var(--foreground)',
  objectLabel: 'Memory',
  objectValue: 'Brand Voice Settings',
  status: 'Successful'
}, {
  id: 'evt-006',
  time: '13:22',
  name: 'Integration synchronized',
  description: 'Google Analytics data sync completed',
  initiated: 'System',
  type: 'Integration',
  icon: Cloud,
  color: 'var(--muted-foreground)',
  objectLabel: 'Integration',
  objectValue: 'Google Analytics',
  status: 'Successful'
}, {
  id: 'evt-007',
  time: '13:10',
  name: 'Agent activity',
  description: 'SEO Analyst Agent completed keyword research task',
  initiated: 'SEO Analyst Agent',
  type: 'Agent',
  icon: Bot,
  color: 'var(--foreground)',
  status: 'Completed'
}, {
  id: 'evt-008',
  time: '12:55',
  name: 'Knowledge updated',
  description: 'Q4 Marketing Report uploaded and indexed',
  initiated: 'User',
  type: 'Knowledge',
  icon: BookOpen,
  color: 'var(--chart-4)',
  objectLabel: 'Knowledge',
  objectValue: 'Marketing Analytics Report Q4',
  status: 'Successful'
}, {
  id: 'evt-009',
  time: '12:30',
  name: 'Automation triggered',
  description: 'Weekly analytics report automation started',
  initiated: 'Automation',
  type: 'Automation',
  icon: PlayCircle,
  color: 'var(--chart-1)',
  objectLabel: 'Agent',
  objectValue: 'Analytics Agent',
  status: 'Completed'
}, {
  id: 'evt-010',
  time: '12:14',
  name: 'Warning',
  description: 'Knowledge sync delay detected for Shopify product catalog',
  initiated: 'System',
  type: 'System',
  icon: AlertTriangle,
  color: 'var(--chart-1)',
  status: 'Warning'
}, {
  id: 'evt-011',
  time: '11:45',
  name: 'Action approval',
  description: 'User approved Pause Ad Campaign action',
  initiated: 'User',
  type: 'User',
  icon: CheckCircle2,
  color: 'var(--chart-4)',
  objectLabel: 'Action',
  objectValue: 'Pause Ad Campaign',
  status: 'Approved'
}, {
  id: 'evt-012',
  time: '11:20',
  name: 'Agent created',
  description: 'New agent Growth Scout configured by user',
  initiated: 'User',
  type: 'User',
  icon: Bot,
  color: 'var(--chart-4)',
  objectLabel: 'Agent',
  objectValue: 'Growth Scout',
  status: 'Successful'
}];
const filterOptions = {
  type: ['All event types', 'Agent', 'Action', 'Conversation', 'Knowledge', 'Memory', 'Integration', 'Automation', 'User', 'System'],
  status: ['All statuses', 'Successful', 'Failed', 'Warning', 'Blocked', 'Pending'],
  initiated: ['Everyone', 'User', 'AI Assistant', 'AI Agent', 'Automation', 'System'],
  date: ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Custom Range']
};
const sectionData: {
  title: string;
  icon: LucideIcon;
  columns: string[];
  rows: SectionRow[];
}[] = [{
  title: 'Agent Activity',
  icon: Bot,
  columns: ['Agent', 'Event', 'Action', 'Status', 'Timestamp'],
  rows: [{
    id: 'a1',
    primary: 'Growth Scout Agent',
    event: 'Action executed',
    third: 'Pause Ad Campaign',
    status: 'Completed',
    time: '14:47'
  }, {
    id: 'a2',
    primary: 'SEO Analyst Agent',
    event: 'Task completed',
    third: 'Keyword research',
    status: 'Completed',
    time: '13:10'
  }, {
    id: 'a3',
    primary: 'Analytics Agent',
    event: 'Automation started',
    third: 'Weekly report',
    status: 'Running',
    time: '12:30'
  }]
}, {
  title: 'Action Activity',
  icon: Zap,
  columns: ['Action', 'Initiated By', 'Target', 'Integration', 'Result', 'Timestamp'],
  rows: [{
    id: 'x1',
    primary: 'Pause Ad Campaign',
    event: 'Growth Scout Agent',
    third: 'Underperforming campaign',
    fourth: 'Google Ads',
    status: 'Completed',
    time: '14:47'
  }, {
    id: 'x2',
    primary: 'Update Inventory',
    event: 'SEO Analyst Agent',
    third: 'Product catalog',
    fourth: 'Shopify',
    status: 'Failed',
    time: '13:58'
  }, {
    id: 'x3',
    primary: 'Export analytics',
    event: 'User',
    third: 'Q4 report',
    fourth: 'Google Analytics',
    status: 'Successful',
    time: '10:05'
  }]
}, {
  title: 'Knowledge Activity',
  icon: BookOpen,
  columns: ['Knowledge source', 'Event type', 'Timestamp'],
  rows: [{
    id: 'k1',
    primary: 'Product Catalog',
    event: 'Accessed',
    time: '14:32'
  }, {
    id: 'k2',
    primary: 'Marketing Analytics Report Q4',
    event: 'Added and indexed',
    time: '12:55'
  }, {
    id: 'k3',
    primary: 'Brand Guidelines',
    event: 'Synchronized',
    time: '09:40'
  }]
}, {
  title: 'Memory Activity',
  icon: Brain,
  columns: ['Memory item', 'Event', 'Timestamp'],
  rows: [{
    id: 'm1',
    primary: 'Brand Voice Settings',
    event: 'Updated',
    time: '13:45'
  }, {
    id: 'm2',
    primary: 'Company Context',
    event: 'Used in conversation',
    time: '11:08'
  }]
}, {
  title: 'Conversation Activity',
  icon: MessageSquare,
  columns: ['Conversation title', 'Event', 'Agent', 'Timestamp'],
  rows: [{
    id: 'c1',
    primary: 'Q4 Marketing Strategy Review',
    event: 'Knowledge accessed',
    third: 'AI Assistant',
    time: '14:32'
  }, {
    id: 'c2',
    primary: 'Product Launch Brief',
    event: 'Started by user',
    third: '—',
    time: '14:15'
  }, {
    id: 'c3',
    primary: 'Weekly Growth Review',
    event: 'Action executed',
    third: 'Growth Scout Agent',
    time: '10:22'
  }]
}, {
  title: 'Integration Activity',
  icon: Link2,
  columns: ['Integration', 'Event', 'Status', 'Timestamp'],
  rows: [{
    id: 'i1',
    primary: 'Google Analytics',
    event: 'Sync completed',
    status: 'Successful',
    time: '13:22'
  }, {
    id: 'i2',
    primary: 'Shopify',
    event: 'Sync delayed',
    status: 'Warning',
    time: '12:14'
  }, {
    id: 'i3',
    primary: 'Google Ads',
    event: 'Connected',
    status: 'Successful',
    time: '08:15'
  }]
}, {
  title: 'Automation Activity',
  icon: PlayCircle,
  columns: ['Automation', 'Event', 'Status', 'Timestamp'],
  rows: [{
    id: 'o1',
    primary: 'Weekly analytics report',
    event: 'Triggered',
    status: 'Running',
    time: '12:30'
  }, {
    id: 'o2',
    primary: 'Low inventory alert',
    event: 'Completed',
    status: 'Successful',
    time: '09:12'
  }]
}, {
  title: 'User Activity',
  icon: User,
  columns: ['User', 'Event', 'Timestamp', 'Status'],
  rows: [{
    id: 'u1',
    primary: 'Sarah Mitchell',
    event: 'Agent created · Growth Scout',
    status: 'Successful',
    time: '11:20'
  }, {
    id: 'u2',
    primary: 'Sarah Mitchell',
    event: 'Action approved · Pause Ad Campaign',
    status: 'Approved',
    time: '11:45'
  }, {
    id: 'u3',
    primary: 'Marcus Lee',
    event: 'Knowledge updated',
    status: 'Successful',
    time: '10:40'
  }]
}];
const statusClass = (status: string) => status.toLowerCase().replace(' ', '-');
export const LuluAIActivity = () => {
  const [selected, setSelected] = useState<ActivityEvent>(events[0]);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All event types');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [openSections, setOpenSections] = useState<string[]>(['Agent Activity', 'Action Activity']);
  const filteredEvents = useMemo(() => events.filter(event => `${event.name} ${event.description} ${event.initiated} ${event.objectValue ?? ''}`.toLowerCase().includes(query.toLowerCase()) && (typeFilter === 'All event types' || event.type === typeFilter) && (statusFilter === 'All statuses' || event.status === statusFilter)), [query, typeFilter, statusFilter]);
  const toggleSection = (title: string) => setOpenSections(value => value.includes(title) ? value.filter(item => item !== title) : [...value, title]);
  return <div className="activity-shell">
    <aside className="activity-sidebar" aria-label="Primary navigation">
      <div className="activity-wordmark"><Sparkles size={18} /><span>Lulu AI</span></div>
      <LuluSectionNavigation activeId="sparkling-cave-8456" />
      <div className="sidebar-bottom"><button className="activity-nav"><Settings size={16} /><span>Settings</span></button><button className="activity-nav"><HelpCircle size={16} /><span>Help</span></button><button className="profile"><span className="avatar">SM</span><span><strong>Sarah Mitchell</strong><small>CEO</small></span><ChevronDown size={14} /></button></div>
    </aside>
    <main className="activity-main">
      <header className="activity-topbar"><div className="crumb"><span>AI Platform</span><ChevronRight size={13} /><strong>AI Activity</strong></div><div className="top-actions"><span className="live-dot">Live monitoring</span><button className="icon-button" aria-label="Activity notifications"><AlertTriangle size={16} /></button><button className="avatar small-avatar" aria-label="Open profile">SM</button></div></header>
      <div className="activity-content">
        <section className="page-heading"><div><p className="eyebrow"><Activity size={13} /> PLATFORM MONITORING</p><h1>AI Activity</h1><p className="subtitle">Monitor everything happening across your AI Platform.</p><p className="supporting">Review AI activity, system events, actions, knowledge access, Agent activity and important changes from one centralized timeline.</p></div><div className="heading-actions"><button className="secondary-button"><Settings size={15} />Activity Settings</button><button className="primary-button"><Download size={15} />Export Activity</button></div></section>
        <section className="health-strip" aria-label="Activity health"><div className="health-current"><span className="health-pulse" /> <strong>Healthy</strong><small>All systems operational</small></div><div className="health-states"><span>Normal</span><span>Attention Required</span><span>Errors</span><span>Warnings</span></div></section>
        <section className="metric-grid" aria-label="Activity overview">{metrics.map(metric => {
            const Icon = metric.icon;
            return <article className={`metric-card ${metric.tone}`} key={metric.label}><span className="metric-icon"><Icon size={17} /></span><div><p>{metric.label}</p><strong>{metric.value}</strong>{metric.note && <small>{metric.note}</small>}</div></article>;
          })}</section>
        <section className="filters-panel"><label className="search-field"><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search activity, Agents, actions or events" aria-label="Search activity" />{query && <button className="clear-search" onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}</label><div className="filter-controls"><span className="filter-caption"><Filter size={14} />Filters</span>{[['Event Type', typeFilter, setTypeFilter, filterOptions.type], ['Status', statusFilter, setStatusFilter, filterOptions.status]].map(item => {
              const label = item[0] as string;
              const value = item[1] as string;
              const setter = item[2] as (value: string) => void;
              const options = item[3] as string[];
              return <label className="select-wrap" key={label}><span>{label}</span><select value={value} onChange={event => setter(event.target.value)} aria-label={label}>{options.map(option => <option value={option} key={option}>{option}</option>)}</select><ChevronDown size={13} /></label>;
            })}<label className="select-wrap"><span>Initiated By</span><select aria-label="Initiated By">{filterOptions.initiated.map(option => <option key={option}>{option}</option>)}</select><ChevronDown size={13} /></label><label className="select-wrap"><span>Date</span><select aria-label="Date">{filterOptions.date.map(option => <option key={option}>{option}</option>)}</select><ChevronDown size={13} /></label><button className="sort-button"><ArrowDownUp size={14} />Newest First</button></div></section>
        <div className="activity-columns"><section className="timeline-panel"><div className="section-title"><div><p className="section-kicker">CENTRALIZED TIMELINE</p><h2>Recent activity</h2></div><span className="result-count">{filteredEvents.length} events today</span></div>{filteredEvents.length === 0 ? <div className="empty-state"><Search size={28} /><h3>No Activity Found</h3><p>Try changing your search or clearing your filters.</p><button className="secondary-button" onClick={() => {
                setQuery('');
                setTypeFilter('All event types');
                setStatusFilter('All statuses');
              }}>Clear Filters</button></div> : <div className="timeline">{filteredEvents.map(event => {
                const Icon = event.icon;
                return <article className={`timeline-event ${event.status === 'Failed' ? 'failed-event' : ''}`} key={event.id} tabIndex={0} aria-label={`${event.name}, ${event.description}, status ${event.status}`} onClick={() => {
                  setSelected(event);
                  setDrawerOpen(true);
                }} onKeyDown={keyboardEvent => {
                  if (keyboardEvent.key === 'Enter') {
                    setSelected(event);
                    setDrawerOpen(true);
                  }
                }}><span className="timeline-dot" style={{
                    background: event.color,
                    boxShadow: `0 0 0 4px ${event.color}22`
                  }} /><div className="event-icon" style={{
                    color: event.color,
                    background: `${event.color}18`
                  }}><Icon size={16} /></div><div className="event-copy"><div className="event-heading"><h3>{event.name}</h3><time>{event.time}</time></div><p>{event.description}</p><div className="event-meta"><span className="initiator"><User size={12} /> <strong>Initiated by</strong> {event.initiated}</span>{event.objectValue && <span className="object-chip"><span>{event.objectLabel}</span>{event.objectValue}</span>}{event.object2Value && <span className="object-chip"><span>{event.object2Label}</span>{event.object2Value}</span>}<span className={`status-badge ${statusClass(event.status)}`}>{event.status}</span></div></div></article>;
              })}</div>}
          <div className="timeline-footer"><button className="secondary-button">Load older activity</button><span>Showing authoritative records · Last updated just now</span></div>
          {sectionData.map(section => {
              const Icon = section.icon;
              const isOpen = openSections.includes(section.title);
              return <section className={`category-section ${isOpen ? 'expanded' : ''}`} key={section.title}><button className="category-header" onClick={() => toggleSection(section.title)} aria-expanded={isOpen}><span className="category-title"><Icon size={15} /><strong>{section.title}</strong><small>{section.rows.length} events</small></span><ChevronDown size={16} /></button>{isOpen && <div className="table-wrap"><table><thead><tr>{section.columns.map(column => <th key={column}>{column}</th>)}<th aria-label="Open" /></tr></thead><tbody>{section.rows.map(row => <tr key={row.id}><td><strong>{row.primary}</strong></td><td>{row.event}</td>{section.columns.length > 3 && <td>{row.third ?? '—'}</td>}{section.columns.length > 4 && <td>{row.fourth ?? '—'}</td>}{section.columns.length > 3 && <td>{row.status && <span className={`status-badge ${statusClass(row.status)}`}>{row.status}</span>}</td>}<td>{row.time}</td><td><button className="table-link">Open <ChevronRight size={12} /></button></td></tr>)}</tbody></table></div>}</section>;
            })}
          <section className="lower-grid"><div className="alert-section warning-section"><div className="section-title"><div><p className="section-kicker amber">ATTENTION</p><h2>Warnings</h2></div><span className="count-badge amber-count">3 active</span></div>{[{
                  title: 'Knowledge sync delay detected',
                  detail: 'Shopify product catalog · System',
                  time: '12:14'
                }, {
                  title: 'Agent approval pending',
                  detail: 'Growth Scout Agent · Action review',
                  time: '09:48'
                }, {
                  title: 'Integration token expires soon',
                  detail: 'Google Ads · in 14 days',
                  time: 'Yesterday'
                }].map(warning => <article className="alert-card warning-card" key={warning.title}><span className="alert-icon"><AlertTriangle size={16} /></span><div><h3>{warning.title}</h3><p>{warning.detail}</p><time>{warning.time}</time></div><button className="table-link">Review <ChevronRight size={12} /></button></article>)}</div><div className="alert-section error-section"><div className="section-title"><div><p className="section-kicker red">FAILED EXECUTIONS</p><h2>AI Errors</h2></div><span className="count-badge red-count">1 unresolved</span></div><article className="alert-card error-card"><span className="alert-icon"><X size={16} /></span><div><h3>Action execution failed</h3><p>Shopify · SEO Analyst Agent · Update Inventory</p><time>Today, 13:58</time></div><button className="table-link">View details <ChevronRight size={12} /></button></article><article className="alert-card error-card"><span className="alert-icon"><Terminal size={16} /></span><div><h3>Integration request timeout</h3><p>Shopify API · Inventory endpoint</p><time>Yesterday, 17:22</time></div><button className="table-link">View details <ChevronRight size={12} /></button></article></div></section>
          <section className="settings-grid"><article className="settings-card"><div className="section-title"><div><p className="section-kicker">GOVERNANCE</p><h2>Activity Settings</h2></div><Settings size={17} /></div>{['Record AI Activity', 'Record Agent Activity', 'Record Action Activity', 'Record Knowledge Activity', 'Record Integration Activity'].map((label, index) => <label className="toggle-row" key={label}><span>{label}<small>{index === 0 ? 'Conversation and assistant events' : 'Keep an auditable record'}</small></span><input type="checkbox" defaultChecked /><i /></label>)}</article><article className="settings-card retention-card"><div className="section-title"><div><p className="section-kicker">DATA POLICY</p><h2>Activity Retention</h2></div><ShieldCheck size={17} /></div><div className="retention-stat"><strong>12 months</strong><span>Current retention period</span></div><p>All agent, action, knowledge, integration and system events are retained securely for audit and operational review.</p><button className="secondary-button">Retention Settings <ChevronRight size={14} /></button></article></section>
          <section className="export-panel"><div className="section-title"><div><p className="section-kicker">AUDIT EXPORT</p><h2>Export Activity</h2></div><Download size={17} /></div><div className="export-controls"><label><span>Date range</span><select><option>Today</option><option>Last 7 Days</option><option>Last 30 Days</option><option>Custom range</option></select></label><label><span>Event types</span><select><option>All event types</option><option>Agents and actions</option><option>Knowledge and memory</option></select></label><label><span>Status</span><select><option>All statuses</option><option>Successful only</option><option>Failed and warnings</option></select></label><label><span>Agent</span><select><option>All agents</option><option>Growth Scout Agent</option><option>SEO Analyst Agent</option></select></label><label><span>Integration</span><select><option>All integrations</option><option>Google Ads</option><option>Shopify</option></select></label></div><div className="format-row"><span>Format</span><button className="format active"><FileSpreadsheet size={15} />CSV</button><button className="format"><FileJson size={15} />JSON</button><button className="format"><FileText size={15} />PDF</button><button className="primary-button export-button"><Download size={15} />Export Activity</button></div></section>
        </section>
        </div>
        {drawerOpen && <aside className="event-drawer" aria-label="Event details"><div className="drawer-header"><div><p className="section-kicker">SELECTED RECORD</p><h2>Event Details</h2></div><button className="icon-button" onClick={() => setDrawerOpen(false)} aria-label="Collapse event details"><X size={16} /></button></div><div className="drawer-body"><div className="drawer-event-title"><span className="event-icon" style={{
                color: selected.color,
                background: `${selected.color}18`
              }}><selected.icon size={18} /></span><div><h3>{selected.name}</h3><p>{selected.description}</p></div></div><section className="drawer-section"><h4>Overview</h4><dl><div><dt>Event type</dt><dd>{selected.type}</dd></div><div><dt>Status</dt><dd><span className={`status-badge ${statusClass(selected.status)}`}>{selected.status}</span></dd></div><div><dt>Timestamp</dt><dd>Today, {selected.time} · UTC−05:00</dd></div></dl></section><section className="drawer-section"><h4>Initiator</h4><div className="initiator-card"><span className="mini-avatar">{selected.initiated === 'User' ? 'SM' : selected.initiated === 'System' ? 'SY' : 'AI'}</span><div><strong>{selected.initiated}</strong><small>{selected.initiated === 'User' ? 'Human user' : selected.initiated}</small></div><ChevronRight size={14} /></div></section><section className="drawer-section"><h4>Related Objects</h4>{[selected.objectLabel && `${selected.objectLabel}: ${selected.objectValue}`, selected.object2Label && `${selected.object2Label}: ${selected.object2Value}`].filter(Boolean).map(object => <button className="related-link" key={object as string}><Link2 size={13} /><span>{object}</span><ChevronRight size={13} /></button>)}{!selected.objectValue && <p className="muted-copy">No linked objects for this event.</p>}</section><section className="drawer-section"><h4>Execution</h4><ol className="execution-list"><li><span>01</span><div><strong>Event received</strong><small>Activity record created</small></div><CheckCircle2 size={14} /></li><li><span>02</span><div><strong>Operation processed</strong><small>Validated by Lulu AI</small></div><CheckCircle2 size={14} /></li><li><span>03</span><div><strong>Result recorded</strong><small>{selected.status} · {selected.time}</small></div><CheckCircle2 size={14} /></li></ol></section><section className="drawer-section"><h4>Result</h4><p className="result-copy">{selected.status === 'Failed' ? 'The operation did not complete. The originating system reported a timeout and requires review.' : 'The event completed successfully and was recorded as an authoritative activity record.'}</p></section><details className="metadata"><summary>Metadata <ChevronDown size={14} /></summary><p>Event ID <code>{selected.id}</code></p><p>Source <code>activity.stream.v2</code></p><p>Trace <code>lulu-{selected.id.slice(-3)}-prod</code></p></details></div><div className="drawer-footer"><button className="secondary-button" onClick={() => setDrawerOpen(false)}>Collapse drawer</button><button className="primary-button">Open record <ChevronRight size={14} /></button></div></aside>}
      </div>
    </main>
    <style>{`*{box-sizing:border-box}button,input,select{font:inherit}button{cursor:pointer}button:focus-visible,input:focus-visible,select:focus-visible,[tabindex]:focus-visible{outline:2px solid var(--border);outline-offset:2px}.activity-shell{height:100vh;display:flex;overflow:hidden;background:var(--sidebar);color:var(--foreground);font:13px Inter,system-ui,sans-serif}.activity-sidebar{width:240px;flex:none;padding:22px 12px 14px;background:var(--sidebar);border-right:1px solid rgba(0,0,0,.06);display:flex;flex-direction:column}.activity-wordmark{display:flex;align-items:center;gap:8px;padding:0 12px 27px;font-size:16px;font-weight:700;color:var(--foreground)}.activity-wordmark svg{color:var(--foreground)}.nav-label{margin:0;padding:0 12px 8px;color:var(--muted-foreground);font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.platform-label{margin-top:23px}.activity-sidebar nav{overflow:auto}.activity-nav{width:100%;display:flex;align-items:center;gap:11px;margin-bottom:2px;padding:9px 12px;border:0;border-radius:7px;color:var(--muted-foreground);background:transparent;text-align:left;font-size:13px}.activity-nav:hover{color:var(--foreground);background:rgba(0,0,0,.04)}.activity-nav.active{padding-left:9px;border-left:3px solid var(--border);color:var(--foreground);background:rgba(0,0,0,.15)}.activity-nav .nav-count{margin-left:auto;padding:2px 6px;border-radius:10px;color:var(--foreground);background:rgba(0,0,0,.25);font-size:10px}.sidebar-bottom{margin-top:auto;padding-top:15px;border-top:1px solid rgba(0,0,0,.06)}.profile{width:100%;display:flex;align-items:center;gap:9px;margin-top:10px;padding:8px 9px;border:1px solid transparent;border-radius:8px;color:var(--muted-foreground);background:transparent;text-align:left}.profile:hover{background:rgba(0,0,0,.04);border-color:rgba(0,0,0,.06)}.profile>span:nth-child(2){display:flex;flex:1;flex-direction:column;gap:2px}.profile strong{color:var(--foreground);font-size:12px;font-weight:500}.profile small{color:var(--muted-foreground);font-size:11px}.avatar{width:32px;height:32px;display:grid;place-items:center;border-radius:50%;color:white;background:var(--primary);font-size:11px;font-weight:600}.activity-main{flex:1;min-width:0;overflow-y:auto}.activity-topbar{height:62px;display:flex;align-items:center;justify-content:space-between;padding:0 34px;border-bottom:1px solid rgba(0,0,0,.06);background:var(--background)}.crumb,.top-actions,.crumb{display:flex;align-items:center;gap:8px}.crumb{color:var(--muted-foreground);font-size:12px}.crumb strong{color:var(--muted-foreground);font-weight:500}.top-actions{gap:13px}.live-dot{color:var(--muted-foreground);font-size:11px}.live-dot:before{content:'';display:inline-block;width:6px;height:6px;margin-right:6px;border-radius:50%;background:var(--primary);box-shadow:0 0 0 3px var(--primary);color:var(--primary-foreground)}.icon-button{display:grid;place-items:center;width:31px;height:31px;border:1px solid rgba(0,0,0,.07);border-radius:8px;color:var(--muted-foreground);background:var(--background)}.small-avatar{width:28px;height:28px;border:0}.activity-content{padding:30px 34px 70px}.page-heading{display:flex;justify-content:space-between;gap:22px;padding-bottom:26px}.eyebrow{display:inline-flex;align-items:center;gap:6px;margin:0;color:var(--foreground);font-size:10px;font-weight:600;letter-spacing:.1em}.page-heading h1{margin:10px 0 6px;font-size:31px;letter-spacing:-.04em}.subtitle{margin:0;color:var(--foreground);font-size:15px}.supporting{max-width:670px;margin:9px 0 0;color:var(--muted-foreground);font-size:12px;line-height:1.55}.heading-actions{display:flex;align-items:flex-start;gap:8px;padding-top:14px}.primary-button,.secondary-button{display:inline-flex;align-items:center;justify-content:center;gap:7px;border-radius:8px;padding:9px 13px;font-size:12px;white-space:nowrap}.primary-button{border:1px solid var(--border);color:white;background:var(--primary)}.primary-button:hover{background:var(--primary);color:var(--primary-foreground)}.secondary-button{border:1px solid rgba(0,0,0,.1);color:var(--foreground);background:var(--background)}.secondary-button:hover{border-color:rgba(0,0,0,.5);color:white}.health-strip{display:flex;align-items:center;justify-content:space-between;min-height:57px;padding:10px 15px;border:1px solid rgba(0,0,0,.07);border-radius:10px;background:var(--background)}.health-current{display:flex;align-items:center;gap:8px}.health-current strong{color:var(--foreground);font-size:13px}.health-current small{margin-left:5px;color:var(--muted-foreground)}.health-pulse{width:8px;height:8px;border-radius:50%;background:var(--primary);box-shadow:0 0 0 4px var(--primary);color:var(--primary-foreground)}.health-states{display:flex;gap:7px}.health-states span{padding:6px 9px;border-radius:6px;color:var(--muted-foreground);background:var(--background);font-size:11px}.metric-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-top:12px}.metric-card{display:flex;align-items:center;gap:11px;min-height:86px;padding:15px;border:1px solid rgba(0,0,0,.07);border-radius:10px;background:var(--background)}.metric-icon{display:grid;place-items:center;width:33px;height:33px;border-radius:8px}.metric-card p{margin:0 0 4px;color:var(--muted-foreground);font-size:11px}.metric-card strong{display:block;font-size:20px;letter-spacing:-.03em}.metric-card small{display:block;margin-top:3px;color:var(--foreground);font-size:10px}.metric-card.violet .metric-icon{color:var(--primary-foreground);background:var(--primary)}.metric-card.blue .metric-icon{color:var(--primary-foreground);background:var(--primary)}.metric-card.green .metric-icon{color:var(--primary-foreground);background:var(--primary)}.metric-card.purple .metric-icon{color:var(--primary-foreground);background:var(--primary)}.metric-card.cyan .metric-icon{color:var(--primary-foreground);background:var(--primary)}.metric-card.amber .metric-icon{color:var(--primary-foreground);background:var(--primary)}.metric-card.amber strong{color:var(--foreground)}.filters-panel{margin-top:22px;padding:14px;border:1px solid rgba(0,0,0,.07);border-radius:10px;background:var(--background)}.search-field{display:flex;align-items:center;gap:9px;height:39px;padding:0 12px;border:1px solid rgba(0,0,0,.08);border-radius:7px;color:var(--muted-foreground);background:var(--background)}.search-field:focus-within{border-color:var(--muted-foreground)}.search-field input{width:100%;border:0;outline:0;color:var(--foreground);background:transparent;font-size:12px}.search-field input::placeholder{color:var(--muted-foreground)}.clear-search{border:0;color:var(--muted-foreground);background:transparent}.filter-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:11px}.filter-caption{display:flex;align-items:center;gap:5px;margin-right:2px;color:var(--muted-foreground);font-size:11px}.select-wrap{position:relative;display:flex;align-items:center;gap:6px;padding:8px 26px 8px 10px;border:1px solid rgba(0,0,0,.07);border-radius:7px;color:var(--muted-foreground);background:var(--background);font-size:11px}.select-wrap span{color:var(--muted-foreground)}.select-wrap select{max-width:135px;border:0;outline:0;color:var(--foreground);background:transparent;font-size:11px;appearance:none}.select-wrap svg{position:absolute;right:9px;pointer-events:none;color:var(--muted-foreground)}.sort-button{display:flex;align-items:center;gap:6px;margin-left:auto;padding:8px 10px;border:1px solid rgba(0,0,0,.07);border-radius:7px;color:var(--muted-foreground);background:var(--background);font-size:11px}.activity-columns{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:18px;margin-top:22px;align-items:start}.timeline-panel{min-width:0}.section-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px}.section-kicker{margin:0 0 5px;color:var(--muted-foreground);font-size:10px;font-weight:600;letter-spacing:.1em}.section-kicker.amber{color:var(--foreground)}.section-kicker.red{color:var(--foreground)}.section-title h2{margin:0;font-size:16px;letter-spacing:-.02em}.result-count{color:var(--muted-foreground);font-size:11px}.timeline{position:relative;padding:2px 0 2px 37px}.timeline:before{content:'';position:absolute;top:13px;bottom:14px;left:11px;width:1px;background:rgba(0,0,0,.1)}.timeline-event{position:relative;display:flex;gap:12px;min-height:89px;padding:14px 13px 14px 0;border-bottom:1px solid rgba(0,0,0,.05);cursor:pointer;transition:.18s}.timeline-event:hover,.timeline-event:focus{padding-left:10px;border-radius:8px;background:var(--background)}.timeline-dot{position:absolute;left:-30px;top:22px;width:9px;height:9px;border-radius:50%}.event-icon{display:grid;place-items:center;flex:none;width:31px;height:31px;border-radius:8px}.event-copy{min-width:0;flex:1}.event-heading{display:flex;align-items:baseline;justify-content:space-between;gap:10px}.event-heading h3{margin:0;color:var(--foreground);font-size:13px;font-weight:600}.event-heading time{color:var(--muted-foreground);font-size:11px}.event-copy>p{margin:4px 0 9px;color:var(--muted-foreground);font-size:12px;line-height:1.4}.event-meta{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.initiator{display:inline-flex;align-items:center;gap:4px;color:var(--muted-foreground);font-size:10px}.initiator strong{color:var(--muted-foreground);font-weight:500}.object-chip{display:inline-flex;gap:4px;max-width:180px;padding:4px 7px;border:1px solid rgba(0,0,0,.06);border-radius:5px;overflow:hidden;color:var(--foreground);background:var(--background);font-size:10px;text-overflow:ellipsis;white-space:nowrap}.object-chip span{color:var(--muted-foreground)}.status-badge{display:inline-flex;padding:4px 7px;border-radius:5px;font-size:10px;font-weight:500}.status-badge.successful,.status-badge.completed,.status-badge.approved{color:var(--chart-4);background:var(--chart-4)}.status-badge.failed{color:var(--chart-5);background:var(--destructive)}.status-badge.warning{color:var(--chart-1);background:var(--chart-1)}.status-badge.pending,.status-badge.active,.status-badge.running{color:var(--primary-foreground);background:var(--primary)}.status-badge.blocked{color:var(--muted-foreground);background:var(--muted)}.timeline-footer{display:flex;align-items:center;justify-content:space-between;margin:17px 0 27px;color:var(--muted-foreground);font-size:10px}.category-section{margin-top:11px;border:1px solid rgba(0,0,0,.07);border-radius:9px;background:var(--background);overflow:hidden}.category-header{display:flex;align-items:center;justify-content:space-between;width:100%;padding:13px 15px;border:0;color:var(--muted-foreground);background:transparent}.category-title{display:flex;align-items:center;gap:9px}.category-title svg{color:var(--foreground)}.category-title strong{color:var(--foreground);font-size:12px}.category-title small{color:var(--muted-foreground);font-size:10px}.category-section.expanded .category-header>svg{transform:rotate(180deg)}.table-wrap{overflow-x:auto;border-top:1px solid rgba(0,0,0,.06)}table{width:100%;border-collapse:collapse;text-align:left}th{padding:9px 12px;color:var(--muted-foreground);background:var(--background);font-size:9px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}td{padding:11px 12px;border-top:1px solid rgba(0,0,0,.04);color:var(--muted-foreground);font-size:11px;white-space:nowrap}td strong{color:var(--foreground);font-weight:500}.table-link{display:inline-flex;align-items:center;gap:3px;border:0;color:var(--foreground);background:transparent;font-size:10px}.table-link:hover{color:var(--foreground)}.lower-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:27px}.alert-section{min-width:0}.count-badge{padding:4px 7px;border-radius:5px;font-size:10px}.amber-count{color:var(--primary-foreground);background:var(--primary)}.red-count{color:var(--primary-foreground);background:var(--primary)}.alert-card{display:flex;align-items:center;gap:10px;margin-top:8px;padding:12px;border:1px solid rgba(0,0,0,.07);border-radius:8px;background:var(--background)}.alert-icon{display:grid;place-items:center;width:29px;height:29px;border-radius:7px}.warning-card{border-left:2px solid var(--chart-1)}.warning-card .alert-icon{color:var(--chart-1);background:var(--chart-1)}.error-card{border-left:2px solid var(--chart-5)}.error-card .alert-icon{color:var(--chart-5);background:var(--destructive)}.alert-card div{min-width:0;flex:1}.alert-card h3{margin:0;color:var(--foreground);font-size:11px}.alert-card p{margin:3px 0;color:var(--muted-foreground);font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.alert-card time{color:var(--muted-foreground);font-size:10px}.settings-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:14px;margin-top:27px}.settings-card,.export-panel{padding:17px;border:1px solid rgba(0,0,0,.07);border-radius:9px;background:var(--background)}.toggle-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:11px 0;border-top:1px solid rgba(0,0,0,.05);color:var(--foreground);font-size:12px}.toggle-row span{display:flex;flex-direction:column;gap:3px}.toggle-row small{color:var(--muted-foreground);font-size:10px}.toggle-row input{display:none}.toggle-row i{position:relative;width:31px;height:18px;border-radius:10px;background:var(--muted)}.toggle-row i:after{content:'';position:absolute;top:3px;left:3px;width:12px;height:12px;border-radius:50%;background:var(--muted);transition:.2s}.toggle-row input:checked+i{background:var(--primary);color:var(--primary-foreground)}.toggle-row input:checked+i:after{left:16px;background:white}.retention-stat{display:flex;align-items:baseline;gap:8px;padding:11px 0 13px;border-bottom:1px solid rgba(0,0,0,.05)}.retention-stat strong{font-size:23px;letter-spacing:-.04em}.retention-stat span{color:var(--muted-foreground);font-size:10px}.retention-card>p{margin:14px 0 17px;color:var(--muted-foreground);font-size:11px;line-height:1.5}.export-panel{margin-top:14px}.export-controls{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.export-controls label{display:flex;flex-direction:column;gap:6px;color:var(--muted-foreground);font-size:10px}.export-controls select{padding:8px;border:1px solid rgba(0,0,0,.07);border-radius:6px;outline:0;color:var(--foreground);background:var(--background);font-size:11px}.format-row{display:flex;align-items:center;gap:8px;margin-top:14px;color:var(--muted-foreground);font-size:11px}.format{display:inline-flex;align-items:center;gap:5px;padding:7px 9px;border:1px solid rgba(0,0,0,.07);border-radius:6px;color:var(--muted-foreground);background:var(--background);font-size:11px}.format.active{border-color:var(--primary-foreground);color:var(--primary-foreground);background:var(--primary)}.export-button{margin-left:auto}.empty-state{display:flex;align-items:center;flex-direction:column;padding:70px 20px;border:1px solid rgba(0,0,0,.07);border-radius:9px;color:var(--muted-foreground);background:var(--background);text-align:center}.empty-state h3{margin:12px 0 5px;color:var(--foreground);font-size:15px}.empty-state p{margin:0 0 18px}.event-drawer{position:sticky;top:0;display:flex;flex-direction:column;height:calc(100vh - 114px);min-width:0;border:1px solid rgba(0,0,0,.08);border-radius:10px;background:var(--background);box-shadow:0 18px 40px rgba(0,0,0,.18);animation:drawerIn .25s ease-out}.drawer-header{display:flex;align-items:flex-start;justify-content:space-between;padding:18px 18px 15px;border-bottom:1px solid rgba(0,0,0,.07)}.drawer-header h2{margin:0;font-size:16px}.drawer-body{overflow:auto;padding:18px}.drawer-event-title{display:flex;gap:10px}.drawer-event-title h3{margin:1px 0 5px;font-size:13px}.drawer-event-title p{margin:0;color:var(--muted-foreground);font-size:11px;line-height:1.45}.drawer-section{margin-top:22px}.drawer-section h4{margin:0 0 10px;color:var(--muted-foreground);font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.drawer-section dl{margin:0}.drawer-section dl div{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid rgba(0,0,0,.04)}dt{color:var(--muted-foreground);font-size:11px}dd{margin:0;color:var(--foreground);font-size:11px;text-align:right}.initiator-card{display:flex;align-items:center;gap:9px;padding:9px;border:1px solid rgba(0,0,0,.06);border-radius:7px;color:var(--foreground);background:var(--background)}.initiator-card div{display:flex;flex:1;flex-direction:column;gap:3px}.initiator-card small{color:var(--muted-foreground);font-size:10px}.mini-avatar{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;color:var(--primary-foreground);background:var(--primary);font-size:9px;font-weight:600}.related-link{display:flex;align-items:center;gap:7px;width:100%;padding:8px 0;border:0;border-bottom:1px solid rgba(0,0,0,.04);color:var(--foreground);background:transparent;text-align:left;font-size:11px}.related-link span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.muted-copy{margin:0;color:var(--muted-foreground);font-size:11px}.execution-list{list-style:none;margin:0;padding:0}.execution-list li{display:flex;align-items:center;gap:8px;padding:8px 0}.execution-list li>span{color:var(--muted-foreground);font-size:10px}.execution-list li div{display:flex;flex:1;flex-direction:column;gap:2px}.execution-list strong{color:var(--foreground);font-size:11px;font-weight:500}.execution-list small{color:var(--muted-foreground);font-size:10px}.execution-list svg{color:var(--foreground)}.result-copy{margin:0;padding:10px;border-left:2px solid var(--border);color:var(--muted-foreground);background:var(--primary);font-size:11px;line-height:1.5}.metadata{margin-top:22px;padding-top:13px;border-top:1px solid rgba(0,0,0,.06);color:var(--muted-foreground);font-size:10px}.metadata summary{display:flex;align-items:center;justify-content:space-between;cursor:pointer}.metadata p{display:flex;justify-content:space-between;margin:9px 0 0}.metadata code{color:var(--muted-foreground)}.drawer-footer{display:flex;gap:7px;padding:13px 18px;border-top:1px solid rgba(0,0,0,.07)}.drawer-footer>*{flex:1}.drawer-footer .primary-button{padding:8px 6px}@keyframes drawerIn{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}@media(max-width:1240px){.activity-content{padding-left:25px;padding-right:25px}.activity-columns{grid-template-columns:minmax(0,1fr) 300px}.metric-grid{grid-template-columns:repeat(3,1fr)}.export-controls{grid-template-columns:repeat(3,1fr)}}@media(max-width:980px){.activity-sidebar{width:68px;padding-left:8px;padding-right:8px}.activity-wordmark span,.nav-label,.activity-nav span,.activity-nav .nav-count,.profile>span:nth-child(2),.profile>svg{display:none}.activity-nav{justify-content:center;padding:10px}.activity-nav.active{padding-left:7px}.profile{justify-content:center}.activity-columns{display:block}.event-drawer{position:fixed;z-index:5;top:62px;right:15px;width:min(360px,calc(100vw - 30px));height:calc(100vh - 77px)}.timeline-panel{max-width:none}.settings-grid{grid-template-columns:1fr}.metric-grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:640px){.activity-topbar{padding:0 15px}.activity-content{padding:21px 14px 45px}.page-heading{display:block}.heading-actions{padding-top:17px}.health-strip{display:block}.health-states{margin-top:10px;overflow:auto}.metric-grid{grid-template-columns:repeat(2,1fr)}.metric-card{padding:12px}.filter-controls{align-items:stretch}.filter-caption{width:100%}.select-wrap{flex:1;min-width:132px}.sort-button{margin-left:0}.lower-grid{grid-template-columns:1fr}.export-controls{grid-template-columns:repeat(2,1fr)}.format-row{flex-wrap:wrap}.export-button{width:100%;margin-left:0}.activity-wordmark{padding-bottom:20px}.timeline{padding-left:30px}.timeline-dot{left:-24px}.event-meta{align-items:flex-start}.object-chip{max-width:145px}}`}</style>
  </div>;
};
export default LuluAIActivity;

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
            return <a key={page.id} href={`#${page.id}`} aria-current={isActivePage ? 'page' : undefined} className={`block rounded-md px-3 py-2 text-xs transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {page.label}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}