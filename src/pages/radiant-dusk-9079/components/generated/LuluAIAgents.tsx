import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, ArrowUpDown, BarChart3, BookOpen, Brain, Check, CheckCircle, ChevronDown, ChevronRight, Clock3, DollarSign, FileEdit, Globe, Heart, HelpCircle, LayoutDashboard, LayoutTemplate, LineChart, MessageSquare, MessagesSquare, MoreHorizontal, Pause, PauseCircle, PenTool, Plus, Search, Settings, ShieldAlert, Sparkles, Store, Target, TrendingUp, Users, Wrench, X, Zap, Bot, Filter, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
interface Agent {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  iconBg: string;
  status: 'Active' | 'Paused' | 'Draft' | 'Needs Attention';
  type: 'Custom' | 'Template' | 'Marketplace';
  capabilities: string[];
  tools: number;
  sources: number;
  lastActive: string;
  tasks: number;
  performance: 'Healthy' | 'Needs Attention' | 'N/A';
}
const agents: Agent[] = [{
  id: 'marketing',
  name: 'Marketing Intelligence Agent',
  description: 'Analyzes marketing performance across all connected platforms.',
  icon: TrendingUp,
  color: 'var(--foreground)',
  iconBg: 'rgba(0,0,0,0.15)',
  status: 'Active',
  type: 'Custom',
  capabilities: ['Marketing Analysis', 'ROAS Tracking', 'Campaign Insights', 'Reporting'],
  tools: 4,
  sources: 3,
  lastActive: '2 min ago',
  tasks: 142,
  performance: 'Healthy'
}, {
  id: 'seo',
  name: 'SEO Opportunity Agent',
  description: 'Identifies and prioritizes SEO opportunities from connected data.',
  icon: Globe,
  color: 'var(--chart-4)',
  iconBg: 'rgba(0,0,0,0.12)',
  status: 'Active',
  type: 'Template',
  capabilities: ['SEO Analysis', 'Keyword Research', 'Content Gaps', 'Competitor Insights'],
  tools: 3,
  sources: 2,
  lastActive: '15 min ago',
  tasks: 89,
  performance: 'Healthy'
}, {
  id: 'retention',
  name: 'Customer Retention Agent',
  description: 'Monitors customer behavior and identifies churn risk signals.',
  icon: Users,
  color: 'var(--foreground)',
  iconBg: 'rgba(0,0,0,0.12)',
  status: 'Active',
  type: 'Custom',
  capabilities: ['Churn Analysis', 'Segmentation', 'Retention Insights', 'Email Triggers'],
  tools: 3,
  sources: 4,
  lastActive: '1 hour ago',
  tasks: 67,
  performance: 'Healthy'
}, {
  id: 'risk',
  name: 'Risk Monitoring Agent',
  description: 'Continuously monitors business data for risk signals and anomalies.',
  icon: ShieldAlert,
  color: 'var(--chart-1)',
  iconBg: 'rgba(0,0,0,0.12)',
  status: 'Needs Attention',
  type: 'Custom',
  capabilities: ['Risk Detection', 'Anomaly Alerts', 'KPI Monitoring', 'Escalation'],
  tools: 2,
  sources: 2,
  lastActive: '3 hours ago',
  tasks: 203,
  performance: 'Needs Attention'
}, {
  id: 'financial',
  name: 'Financial Reporting Agent',
  description: 'Generates automated financial summaries and performance reports.',
  icon: DollarSign,
  color: 'var(--chart-4)',
  iconBg: 'rgba(0,0,0,0.12)',
  status: 'Paused',
  type: 'Custom',
  capabilities: ['Financial Analysis', 'Report Generation', 'Revenue Tracking'],
  tools: 2,
  sources: 3,
  lastActive: 'Yesterday',
  tasks: 45,
  performance: 'Healthy'
}, {
  id: 'content',
  name: 'Content Strategy Agent',
  description: 'Creates and prioritizes content recommendations based on business goals.',
  icon: PenTool,
  color: 'var(--foreground)',
  iconBg: 'rgba(0,0,0,0.12)',
  status: 'Active',
  type: 'Marketplace',
  capabilities: ['Content Planning', 'Topic Research', 'SEO Integration', 'Calendar'],
  tools: 3,
  sources: 5,
  lastActive: '30 min ago',
  tasks: 31,
  performance: 'Healthy'
}, {
  id: 'competitor',
  name: 'Competitor Analysis Agent',
  description: 'Tracks competitor activity and surfaces strategic opportunities.',
  icon: Target,
  color: 'var(--foreground)',
  iconBg: 'rgba(0,0,0,0.12)',
  status: 'Paused',
  type: 'Template',
  capabilities: ['Competitor Tracking', 'Market Intelligence', 'Gap Analysis'],
  tools: 2,
  sources: 2,
  lastActive: '2 days ago',
  tasks: 18,
  performance: 'Healthy'
}, {
  id: 'growth',
  name: 'Growth Opportunity Agent',
  description: 'Identifies and ranks growth opportunities across all business channels.',
  icon: Sparkles,
  color: 'var(--foreground)',
  iconBg: 'rgba(0,0,0,0.12)',
  status: 'Draft',
  type: 'Custom',
  capabilities: ['Growth Analysis', 'Opportunity Scoring'],
  tools: 0,
  sources: 1,
  lastActive: 'Never',
  tasks: 0,
  performance: 'N/A'
}];
const navMain = [{
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  label: 'AI Insights Center',
  icon: LineChart
}, {
  label: 'Business Health',
  icon: Heart
}, {
  label: 'Growth Score',
  icon: TrendingUp
}, {
  label: 'KPI Explorer',
  icon: BarChart3
}];
const navPlatform = [{
  label: 'AI Assistant',
  icon: MessageSquare
}, {
  label: 'AI Agents',
  icon: Bot
}, {
  label: 'Agent Marketplace',
  icon: Store
}, {
  label: 'Agent Templates',
  icon: LayoutTemplate
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
  icon: MessagesSquare
}, {
  label: 'AI Activity',
  icon: Activity
}];
const stats = [{
  label: 'Total Agents',
  value: '8',
  icon: Bot,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.15)'
}, {
  label: 'Active',
  value: '5',
  icon: CheckCircle,
  color: 'var(--chart-4)',
  bg: 'rgba(0,0,0,.12)',
  sub: 'Running'
}, {
  label: 'Paused',
  value: '2',
  icon: PauseCircle,
  color: 'var(--chart-1)',
  bg: 'rgba(0,0,0,.12)'
}, {
  label: 'Drafts',
  value: '1',
  icon: FileEdit,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.12)'
}, {
  label: 'Needs Attention',
  value: '1',
  icon: AlertTriangle,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.12)'
}, {
  label: 'Recently Active',
  value: '3',
  icon: Clock3,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.15)'
}];
const chartBars = [22, 38, 27, 45, 32, 52, 41, 34, 58, 40, 47, 31, 50, 55];
const statusColor = (status: Agent['status']) => status === 'Active' ? 'var(--chart-4)' : status === 'Paused' ? 'var(--foreground)' : status === 'Draft' ? 'var(--primary)' : 'var(--foreground)';
export const LuluAIAgents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Statuses');
  const [sortBy, setSortBy] = useState('Recently Active');
  const [showCreateModal, setShowCreateModal] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const visibleAgents = useMemo(() => agents.filter(agent => {
    const matchesSearch = `${agent.name} ${agent.description}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeFilter === 'All Statuses' || agent.status === activeFilter;
    return matchesSearch && matchesStatus;
  }), [activeFilter, searchQuery]);
  return <div className="lulu-shell">
      <aside className="lulu-sidebar" aria-label="Primary navigation">
        <div className="lulu-logo"><span className="sparkle">✦</span><span>Lulu AI</span></div>
        <LuluSectionNavigation activeId="radiant-dusk-9079" />
        <div className="sidebar-bottom">
          <button className="nav-item"><Settings size={16} /><span>Settings</span></button>
          <button className="nav-item"><HelpCircle size={16} /><span>Help</span></button>
          <button className="profile-chip"><span className="avatar">SM</span><span><strong>Sarah Mitchell</strong><small>CEO</small></span><ChevronDown size={14} /></button>
        </div>
      </aside>

      <main className="lulu-main">
        <header className="page-header">
          <div className="breadcrumb"><span>AI Platform</span><ChevronRight size={13} /><strong>AI Agents</strong></div>
          <div className="title-row"><div><h1>AI Agents</h1><p>Create and manage specialized AI agents for your business.</p></div><div className="header-actions"><button className="ghost-button"><LayoutTemplate size={15} />Agent Templates</button><button className="ghost-button"><Store size={15} />Agent Marketplace</button><button className="primary-button" onClick={() => setShowCreateModal(true)}><Plus size={15} />Create Agent</button></div></div>
        </header>

        <section className="stats-grid" aria-label="Agent overview">
          {stats.map(stat => {
          const Icon = stat.icon;
          return <article className="stat-card" key={stat.label}><span className="stat-icon" style={{
              color: stat.color,
              background: stat.bg
            }}><Icon size={17} /></span><span><strong>{stat.value}</strong><small>{stat.sub ? <span><i className="green-dot" />{stat.sub}</span> : stat.label}</small></span></article>;
        })}
        </section>

        <section className="filter-bar" aria-label="Agent filters">
          <div className="search-wrap" role="search" aria-label="Search agents"><Search size={15} /><input value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Search agents..." aria-label="Search agents" /></div>
          {[['Status', 'All Statuses', Filter], ['Agent Type', 'All Types', Layers], ['Activity', 'All Activity', Activity], ['Performance', 'All Health', Heart]].map(([label, value, Icon]) => {
          const FilterIcon = Icon as LucideIcon;
          return <button className="filter-button" key={label as string} aria-pressed={activeFilter === value} onClick={() => label === 'Status' && setActiveFilter(activeFilter === 'All Statuses' ? 'Active' : 'All Statuses')}><FilterIcon size={14} /><span>{activeFilter !== 'All Statuses' && label === 'Status' ? activeFilter : value as string}</span><ChevronDown size={13} /></button>;
        })}
          <button className="filter-button sort-button" onClick={() => setSortBy(sortBy === 'Recently Active' ? 'Name' : 'Recently Active')}><ArrowUpDown size={14} /><span>Sort: {sortBy}</span><ChevronDown size={13} /></button>
        </section>

        <section className="agents-section" aria-labelledby="your-agents-heading">
          <div className="section-heading"><h2 id="your-agents-heading">Your AI Agents</h2><span>8 agents</span></div>
          <div className="agent-grid">
            {visibleAgents.map(agent => {
            const Icon = agent.icon;
            const color = statusColor(agent.status);
            return <article className="agent-card" key={agent.id}><div className="agent-head"><span className="agent-icon" style={{
                  color: agent.color,
                  background: agent.iconBg
                }}><Icon size={24} /></span><div className="agent-title"><h3>{agent.name}</h3><p>{agent.description}</p></div><span className="status-badge" style={{
                  color
                }}><i className={agent.status === 'Active' ? 'pulse-dot' : ''} style={{
                    background: color
                  }} />{agent.status}</span></div><div className="meta-strip"><span className="type-pill">{agent.type}</span><span><Clock3 size={13} />{agent.lastActive}</span><span><CheckCircle size={13} />{agent.tasks} tasks</span></div><div className="capabilities">{agent.capabilities.map(capability => <span key={capability}>{capability}</span>)}{agent.status === 'Draft' && <em>Setup incomplete</em>}</div><div className="tool-row"><span><Wrench size={13} />{agent.tools ? `${agent.tools} Tools` : 'No tools connected'}</span><span><BookOpen size={13} />{agent.sources} Sources</span><span className={`health-pill ${agent.performance === 'Needs Attention' ? 'attention' : ''}`}>{agent.performance}</span></div><div className="card-actions"><button className="open-button" onClick={() => setSelectedAgent(agent)}>Open Agent</button><button className="small-action" onClick={() => setShowConfirmDialog(true)}>{agent.status === 'Active' ? <span><Pause size={13} />Pause</span> : <span><Check size={13} />Activate</span>}</button><button className="icon-button" aria-label={`More actions for ${agent.name}`}><MoreHorizontal size={17} /></button></div></article>;
          })}
          </div>
        </section>

        <section className="attention-section" aria-labelledby="attention-heading"><div className="section-heading"><h2 id="attention-heading"><AlertTriangle size={15} />Agents Needing Attention</h2></div><article className="attention-card"><span className="attention-icon"><ShieldAlert size={21} /></span><div><h3>Risk Monitoring Agent <span className="status-badge" style={{
                color: 'var(--chart-5)'
              }}><i style={{
                  background: 'var(--destructive)'
                }} />Needs Attention</span></h3><p><strong>Integration Issue</strong> — Google Analytics connection returned an error. Data may be incomplete.</p></div><button className="primary-button" onClick={() => setSelectedAgent(agents[3])}>Review Agent</button></article></section>

        <section className="recent-section" aria-labelledby="recent-heading"><div className="section-heading"><h2 id="recent-heading">Recently Active Agents</h2></div><div className="recent-table"><div className="table-row table-header"><span>Agent</span><span>Last Activity</span><span>Status</span><span>Recent Task</span><span>Result</span><span>Action</span></div>{[['Marketing Intelligence Agent', '2 min ago', 'Analyzed Meta Ads ROAS for December'], ['SEO Opportunity Agent', '15 min ago', 'Identified 12 new keyword opportunities'], ['Content Strategy Agent', '30 min ago', 'Generated content calendar for Q1 2025']].map(row => <div className="table-row" key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><span className="table-status"><i className="pulse-dot" />Active</span><span className="task-cell">{row[2]}</span><span className="success-text"><CheckCircle size={13} />Success</span><button className="table-open">Open Agent</button></div>)}</div></section>

        <section className="performance-section" aria-labelledby="performance-heading"><div className="section-heading"><h2 id="performance-heading">Performance Overview</h2><button className="violet-link">View Performance →</button></div><div className="performance-grid"><article className="performance-card"><h3>Task Volume — Last 14 Days</h3><svg className="bar-chart" viewBox="0 0 420 60" role="img" aria-label="Task volume bar chart"><path d="M0 52h420" stroke="rgba(0,0,0,.06)" />{chartBars.map((height, barIndex) => <rect key={`bar-${barIndex}`} x={barIndex * 30 + 3} y={60 - height} width="16" height={height} rx="4" fill={barIndex > 10 ? 'var(--chart-2)' : 'var(--chart-3)'} opacity={barIndex === 13 ? 1 : .78} />)}</svg><p>Total: 595 tasks <span className="success-text">· ↑12.3% vs prior period</span></p></article><article className="performance-card success-card"><h3>Success Rate</h3><strong className="success-rate">97.2%</strong><p>Across 595 tasks this period</p><dl><div><dt>Tasks Completed</dt><dd>595</dd></div><div><dt>Successful</dt><dd>578</dd></div><div><dt>Failed</dt><dd>17</dd></div><div><dt>Avg. Time</dt><dd>1.4s</dd></div></dl></article></div></section>
      </main>

      {showCreateModal && <div className="modal-backdrop"><section className="create-modal" role="dialog" aria-modal="true" aria-labelledby="create-title"><button className="close-modal" aria-label="Close create agent modal" onClick={() => setShowCreateModal(false)}><X size={18} /></button><h2 id="create-title">Create AI Agent</h2><p>Configure a new specialized AI agent for your business.</p><div className="steps"><span className="step-active"><b>1</b>Setup</span><span><b>2</b>Configure</span><span><b>3</b>Review</span></div><form onSubmit={event => {
          event.preventDefault();
          setShowCreateModal(false);
        }}><label>Agent Name <em>*</em><input placeholder="Enter agent name..." autoFocus /></label><label>Description<textarea rows={3} placeholder="Describe what this agent is responsible for..." /></label><fieldset><legend>Agent Type</legend><div className="type-options"><button type="button" className="type-option selected"><Bot size={17} />Custom Agent</button><button type="button" className="type-option"><LayoutTemplate size={17} />From Template</button><button type="button" className="type-option"><Store size={17} />From Marketplace</button></div></fieldset><label>Primary Purpose<input placeholder="Define the primary business function..." /></label><div className="modal-footer"><button type="button" className="ghost-button" onClick={() => setShowCreateModal(false)}>Cancel</button><button type="submit" className="primary-button">Continue →</button></div></form></section></div>}

      {showConfirmDialog && <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="activate-title"><button className="confirm-close" onClick={() => setShowConfirmDialog(false)} aria-label="Close confirmation"><X size={15} /></button><CheckCircle size={25} className="confirm-icon" /><h2 id="activate-title">Activate Agent?</h2><p>This will allow the agent to operate according to its configured instructions, permissions, tools and automations.</p><div className="confirm-actions"><button className="ghost-button" onClick={() => setShowConfirmDialog(false)}>Cancel</button><button className="activate-button" onClick={() => setShowConfirmDialog(false)}>Activate</button></div></section>}
      {selectedAgent && <div className="toast-note" role="status">Opening <strong>{selectedAgent.name}</strong><button onClick={() => setSelectedAgent(null)} aria-label="Dismiss"><X size={13} /></button></div>}
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