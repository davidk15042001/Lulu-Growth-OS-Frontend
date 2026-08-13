import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, ArrowUpDown, BarChart3, BookOpen, Brain, CheckCircle2, ChevronDown, ChevronRight, Clock3, Database, FileText, Globe, Heart, HelpCircle, LayoutDashboard, LayoutTemplate, LineChart, MessageSquare, MessagesSquare, MoreHorizontal, Plug, Plus, RefreshCw, Search, Settings, Settings2, ShieldCheck, ShoppingBag, Store, TrendingUp, Upload, X, Zap, Bot, Filter, Users, Sparkles, SlidersHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
type Knowledge = {
  id: string;
  name: string;
  type: string;
  source: string;
  status: string;
  updated: string;
  used: string;
  access: string;
};
type Source = {
  id: string;
  name: string;
  type: string;
  icon: LucideIcon;
  color: string;
  status: string;
  health: string;
  items: string;
  sync: string;
};
const mainNav = [{
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
const platformNav = [{
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
  label: 'Total Sources',
  value: '7',
  icon: Database,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.15)'
}, {
  label: 'Connected Sources',
  value: '5',
  sub: 'Active',
  icon: Plug,
  color: 'var(--chart-4)',
  bg: 'rgba(0,0,0,.12)'
}, {
  label: 'Documents',
  value: '43',
  icon: FileText,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.12)'
}, {
  label: 'Knowledge Items',
  value: '124',
  icon: BookOpen,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.12)'
}, {
  label: 'Recently Updated',
  value: '12',
  sub: 'Last 7 days',
  icon: RefreshCw,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.12)'
}, {
  label: 'Needs Attention',
  value: '6',
  icon: AlertTriangle,
  color: 'var(--chart-1)',
  bg: 'rgba(0,0,0,.12)'
}];
const sources: Source[] = [{
  id: 'shopify',
  name: 'Shopify',
  type: 'E-Commerce Platform',
  icon: ShoppingBag,
  color: 'var(--chart-4)',
  status: 'Connected',
  health: 'Healthy',
  items: '38 items',
  sync: 'Synced 2h ago'
}, {
  id: 'analytics',
  name: 'Google Analytics',
  type: 'Analytics Platform',
  icon: TrendingUp,
  color: 'var(--chart-1)',
  status: 'Connected',
  health: 'Healthy',
  items: '24 items',
  sync: 'Synced 4h ago'
}, {
  id: 'wordpress',
  name: 'WordPress',
  type: 'CMS Platform',
  icon: Globe,
  color: 'var(--chart-4)',
  status: 'Needs Attention',
  health: 'Needs Attention',
  items: '19 items',
  sync: 'Sync failed 1d ago'
}, {
  id: 'documents',
  name: 'Uploaded Documents',
  type: 'Document Library',
  icon: FileText,
  color: 'var(--foreground)',
  status: 'Active',
  health: 'Healthy',
  items: '43 documents',
  sync: 'Updated 3h ago'
}];
const knowledge: Knowledge[] = [{
  id: 'company',
  name: 'Company Information',
  type: 'Company',
  source: 'Internal Lulu AI',
  status: 'Active',
  updated: 'Today, 2:14 PM',
  used: 'AI Assistant, 3 Agents',
  access: 'Entire Business'
}, {
  id: 'product-catalog',
  name: 'Product Catalog',
  type: 'Products & Services',
  source: 'Shopify',
  status: 'Active',
  updated: 'Today, 11:30 AM',
  used: 'AI Assistant, 5 Agents',
  access: 'Entire Business'
}, {
  id: 'marketing',
  name: 'Marketing Guidelines',
  type: 'Policies',
  source: 'Uploaded',
  status: 'Active',
  updated: 'Yesterday',
  used: 'AI Recommendations',
  access: 'Selected Agents'
}, {
  id: 'description',
  name: 'Business Description',
  type: 'Business Description',
  source: 'Internal Lulu AI',
  status: 'Active',
  updated: 'Today, 2:14 PM',
  used: 'All AI Features',
  access: 'Entire Business'
}, {
  id: 'analytics-data',
  name: 'Analytics Data',
  type: 'Connected Sources',
  source: 'Google Analytics',
  status: 'Processing',
  updated: 'Syncing...',
  used: '—',
  access: '—'
}, {
  id: 'brand',
  name: 'Brand Guidelines',
  type: 'Brand',
  source: 'Uploaded',
  status: 'Needs Attention',
  updated: '5 days ago',
  used: 'AI Assistant',
  access: 'Restricted'
}];
const documents = [{
  name: 'Brand Guidelines v2.pdf',
  type: 'PDF',
  size: '2.4 MB',
  date: 'Jan 15, 2025',
  status: 'Needs Attention'
}, {
  name: 'Product Catalog Q1.xlsx',
  type: 'XLSX',
  size: '1.1 MB',
  date: 'Feb 3, 2025',
  status: 'Ready'
}, {
  name: 'Company Overview.docx',
  type: 'DOCX',
  size: '340 KB',
  date: 'Mar 1, 2025',
  status: 'Ready'
}, {
  name: 'Marketing Playbook.pdf',
  type: 'PDF',
  size: '5.7 MB',
  date: 'Mar 12, 2025',
  status: 'Processing'
}];
const usage = [{
  label: 'Used by AI Assistant',
  value: '124 items',
  width: '100%',
  color: 'var(--foreground)'
}, {
  label: 'Used by Agents',
  value: '76 items across 5 agents',
  width: '61%',
  color: 'var(--foreground)'
}, {
  label: 'Used by AI Recommendations',
  value: '89 items',
  width: '72%',
  color: 'var(--foreground)'
}, {
  label: 'Used by AI Tasks',
  value: '45 items',
  width: '36%',
  color: 'var(--chart-4)'
}, {
  label: 'Used by AI Analysis',
  value: '62 items',
  width: '50%',
  color: 'var(--chart-4)'
}];
const quality = [{
  label: 'Completeness',
  value: '87%',
  status: 'Healthy',
  color: 'var(--chart-4)',
  detail: 'Required business fields are populated.'
}, {
  label: 'Freshness',
  value: '74%',
  status: 'Good',
  color: 'var(--chart-4)',
  detail: 'Most knowledge was updated recently.'
}, {
  label: 'Source Health',
  value: '72%',
  status: 'Needs Attention',
  color: 'var(--chart-1)',
  detail: '1 failed source requires review.'
}, {
  label: 'Coverage',
  value: '91%',
  status: 'Healthy',
  color: 'var(--chart-4)',
  detail: 'Core business areas are represented.'
}];
const filterOptions = ['Knowledge Type', 'Source', 'Status', 'Freshness'];
const statusColor = (status: string) => status === 'Active' || status === 'Ready' || status === 'Connected' || status === 'Healthy' || status === 'Synced' ? 'var(--chart-4)' : status === 'Processing' ? 'var(--primary)' : status === 'Needs Attention' || status === 'Failed' ? 'var(--chart-1)' : 'var(--muted-foreground)';
export const LuluAIKnowledge = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypeFilter, setActiveTypeFilter] = useState('All');
  const [activeSourceFilter, setActiveSourceFilter] = useState('All');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [activeFreshnessFilter, setActiveFreshnessFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Recently Updated');
  const [selectedKnowledge, setSelectedKnowledge] = useState('product-catalog');
  const [showDrawer, setShowDrawer] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const visibleKnowledge = useMemo(() => knowledge.filter(item => `${item.name} ${item.type} ${item.source}`.toLowerCase().includes(searchQuery.toLowerCase()) && (activeTypeFilter === 'All' || item.type === activeTypeFilter) && (activeSourceFilter === 'All' || item.source === activeSourceFilter) && (activeStatusFilter === 'All' || item.status === activeStatusFilter)), [searchQuery, activeTypeFilter, activeSourceFilter, activeStatusFilter]);
  return <div className="lulu-shell">
  <aside className="lulu-sidebar" aria-label="Primary navigation"><div className="lulu-logo"><span className="sparkle">✦</span><span>Lulu AI</span></div><nav className="nav-scroll"><p className="nav-label">Main</p>{mainNav.map(item => {
          const Icon = item.icon;
          return <button className="nav-item" key={item.label}><Icon size={16} /><span>{item.label}</span></button>;
        })}<p className="nav-label platform-label">AI Platform</p>{platformNav.map(item => {
          const Icon = item.icon;
          const active = item.label === 'AI Knowledge';
          return <button className={`nav-item ${active ? 'nav-active' : ''}`} key={item.label}><Icon size={16} /><span>{item.label}</span>{active && <span className="nav-count">24</span>}</button>;
        })}</nav><div className="sidebar-bottom"><button className="nav-item"><Settings size={16} /><span>Settings</span></button><button className="nav-item"><HelpCircle size={16} /><span>Help</span></button><button className="profile-chip"><span className="avatar">SM</span><span><strong>Sarah Mitchell</strong><small>CEO</small></span><ChevronDown size={14} /></button></div></aside>
  <main className="lulu-main"><header className="page-header"><div className="breadcrumb"><span>AI Platform</span><ChevronRight size={13} /><strong>AI Knowledge</strong></div><div className="title-row"><div><h1>AI Knowledge</h1><p>Manage the business knowledge available to Lulu AI.</p><p className="supporting">Connect trusted information sources, organize business knowledge and control which AI experiences and Agents can use them.</p></div><div className="header-actions"><button className="ghost-button"><Settings2 size={15} />Knowledge Settings</button><button className="ghost-button" onClick={() => setShowConnectModal(true)}><Plug size={15} />Connect Source</button><button className="primary-button"><Plus size={15} />Add Knowledge</button></div></div></header>
   <div className="grounding-banner"><Brain size={15} /><span>Knowledge grounds Lulu AI with verified business information. It is not AI-generated output.</span></div>
   <section className="health-banner"><div><strong><ShieldCheck size={16} />Knowledge Health</strong><span className="health-summary"><i className="dot green" />18 Healthy <i className="dot amber" />4 Needs Update <i className="dot blue" />1 Connection Issue <i className="dot blue" />1 Processing</span></div><button className="ghost-button amber-button"><AlertTriangle size={14} />Review Issues</button><span className="overall-health"><i className="dot green pulse-dot" />Mostly Healthy</span></section>
   <section className="stats-grid" aria-label="Knowledge overview">{stats.map(stat => {
          const Icon = stat.icon;
          return <article className="stat-card" key={stat.label}><span className="stat-icon" style={{
              color: stat.color,
              background: stat.bg
            }}><Icon size={17} /></span><span><strong>{stat.value}</strong><small>{stat.sub ? <><i className="dot green" />{stat.sub}</> : stat.label}</small></span></article>;
        })}</section>
   <section className="filter-bar" role="search"><div className="search-wrap"><Search size={15} /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search knowledge, documents or sources..." aria-label="Search knowledge" /></div>{filterOptions.map(label => <button className="filter-button" key={label} onClick={() => {
          if (label === 'Knowledge Type') setActiveTypeFilter(activeTypeFilter === 'All' ? 'Company' : 'All');
          if (label === 'Source') setActiveSourceFilter(activeSourceFilter === 'All' ? 'Shopify' : 'All');
          if (label === 'Status') setActiveStatusFilter(activeStatusFilter === 'All' ? 'Active' : 'All');
          if (label === 'Freshness') setActiveFreshnessFilter(activeFreshnessFilter === 'All' ? 'Recently Updated' : 'All');
        }}><Filter size={13} /><span>{label === 'Knowledge Type' ? activeTypeFilter === 'All' ? label : activeTypeFilter : label === 'Source' ? activeSourceFilter === 'All' ? label : activeSourceFilter : label === 'Status' ? activeStatusFilter === 'All' ? label : activeStatusFilter : activeFreshnessFilter === 'All' ? label : activeFreshnessFilter}</span><ChevronDown size={13} /></button>)}<button className="filter-button sort-button" onClick={() => setSortBy(sortBy === 'Recently Updated' ? 'Name' : 'Recently Updated')}><ArrowUpDown size={14} /><span>Sort: {sortBy}</span><ChevronDown size={13} /></button></section>
   <section className="content-section"><div className="section-heading"><h2>Knowledge Sources</h2><span>7 sources</span></div><div className="source-grid">{sources.map(source => {
            const Icon = source.icon;
            return <article className="source-card" key={source.id}><div className="source-top"><span className="source-icon" style={{
                  color: source.color,
                  background: `${source.color}20`
                }}><Icon size={21} /></span><div className="source-title"><h3>{source.name}</h3><span className="type-pill">{source.type}</span></div><span className="status-badge" style={{
                  color: statusColor(source.status)
                }}><i className={source.status === 'Connected' ? 'pulse-dot' : ''} style={{
                    background: statusColor(source.status)
                  }} />{source.status}</span></div><div className="meta-strip"><span>{source.items}</span><span>·</span><span>{source.sync}</span><span className="health-pill" style={{
                  color: statusColor(source.health)
                }}><i className="dot" style={{
                    background: statusColor(source.health)
                  }} />{source.health}</span></div><div className="card-actions"><button className="small-action">Open</button><button className="small-action"><RefreshCw size={13} />Sync</button><button className="icon-button" aria-label={`More actions for ${source.name}`}><MoreHorizontal size={16} /></button></div></article>;
          })}</div></section>
   <section className="content-section"><div className="section-heading"><h2>Business Knowledge</h2><span>124 items <button className={`view-toggle ${viewMode === 'list' ? 'selected' : ''}`} onClick={() => setViewMode('list')} aria-label="List view">☷</button><button className={`view-toggle ${viewMode === 'grid' ? 'selected' : ''}`} onClick={() => setViewMode('grid')} aria-label="Grid view">▦</button></span></div><div className="recent-table knowledge-table" role="table"><div className="table-row table-header"><span>Name</span><span>Type</span><span>Source</span><span>Status</span><span>Last Updated</span><span>Used By</span><span>Access</span><span>Actions</span></div>{visibleKnowledge.map(item => <div className="table-row" key={item.id}><strong>{item.name}</strong><span>{item.type}</span><span>{item.source}</span><span className="table-status" style={{
              color: statusColor(item.status)
            }}><i className={item.status === 'Active' ? 'pulse-dot' : ''} style={{
                background: statusColor(item.status)
              }} />{item.status}</span><span>{item.updated}</span><span className="chip-text">{item.used}</span><span>{item.access}</span><span className="row-actions"><button className="table-open" onClick={() => {
                setSelectedKnowledge(item.id);
                setShowDrawer(true);
              }}>View</button><button className="icon-button" aria-label={`More actions for ${item.name}`}><MoreHorizontal size={15} /></button></span></div>)}</div></section>
   <section className="content-section"><div className="section-heading"><h2>Documents</h2><span>43 documents <button className="ghost-button compact"><Upload size={13} />Upload Document</button></span></div><div className="recent-table document-table"><div className="table-row table-header"><span>Document</span><span>File Type</span><span>Size</span><span>Uploaded</span><span>Status</span><span>Actions</span></div>{documents.map(doc => <div className="table-row" key={doc.name}><strong>{doc.name}</strong><span>{doc.type}</span><span>{doc.size}</span><span>{doc.date}</span><span className="table-status" style={{
              color: statusColor(doc.status)
            }}><i className={doc.status === 'Processing' ? 'pulse-dot' : ''} style={{
                background: statusColor(doc.status)
              }} />{doc.status}</span><span className="row-actions"><button className="table-open">Open</button><button className="table-open">Replace</button><button className="icon-button" aria-label={`More actions for ${doc.name}`}><MoreHorizontal size={15} /></button></span></div>)}</div></section>
   <section className="wide-card freshness"><h3><Clock3 size={16} />Knowledge Freshness</h3><div className="freshness-chips"><span className="fresh-green"><strong>Up to Date</strong><small>89 items</small></span><span className="fresh-cyan"><strong>Recently Updated</strong><small>23 items</small></span><span className="fresh-amber"><strong>Review Recommended</strong><small>8 items</small></span><span className="fresh-red"><strong>Outdated</strong><small>4 items</small></span></div><div className="progress"><span style={{
            width: '72%'
          }} /><span style={{
            width: '18%'
          }} /><span style={{
            width: '7%'
          }} /><span style={{
            width: '3%'
          }} /></div><p>Freshness indicates when the underlying knowledge was last updated or synchronized. Outdated information is not necessarily incorrect.</p></section>
   <section className="content-section"><div className="section-heading"><h2><RefreshCw size={15} />Synchronization</h2></div><div className="recent-table sync-table"><div className="table-row table-header"><span>Source</span><span>Last Sync</span><span>Status</span><span>Next Sync</span><span>Items Synced</span><span>Errors</span><span>Action</span></div>{[['Shopify', 'Today 2:10 PM', 'Synced', 'In 22h', '38', '0'], ['Google Analytics', 'Today 12:04 PM', 'Synced', 'In 12h', '24', '0'], ['WordPress', 'Yesterday 3:00 PM', 'Failed', 'Manual', '0', '3']].map(row => <div className="table-row" key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><span className="table-status" style={{
              color: statusColor(row[2])
            }}><i style={{
                background: statusColor(row[2])
              }} />{row[2]}</span><span>{row[3]}</span><span>{row[4]}</span><span>{row[5]}</span><button className="table-open">{row[2] === 'Failed' ? 'Retry Sync' : 'Sync Now'}</button></div>)}</div></section>
   <section className="usage-grid"><article className="wide-card usage-card"><h3>Knowledge Usage</h3>{usage.map(item => <div className="usage-row" key={item.label}><div><span>{item.label}</span><small>{item.value}</small></div><div className="usage-track"><span style={{
                width: item.width,
                background: item.color
              }} /></div></div>)}<p className="most-used"><strong>Most Used:</strong> Product Catalog · Company Information · Business Description</p></article><article className="wide-card agents-using"><h3>Agents Using Knowledge</h3>{[['Marketing Intelligence Agent', 'Entire Business', '5 min ago'], ['SEO Opportunity Agent', 'Selected', '1h ago'], ['Customer Retention Agent', 'Selected', '3h ago']].map(row => <div className="agent-using-row" key={row[0]}><span className="mini-avatar"><Bot size={14} /></span><div><strong>{row[0]}</strong><small>{row[1]} · {row[2]}</small></div><button className="table-open">Open Agent</button></div>)}</article></section>
   <section className="wide-card"><h3>AI Features Using Knowledge</h3><div className="feature-chips">{[['AI Assistant', MessageSquare, '124 items'], ['AI Recommendations', Sparkles, '89 items'], ['AI Tasks', Zap, '45 items'], ['AI Analysis', BarChart3, '62 items'], ['AI Agents', Bot, '76 items']].map(item => {
            const Icon = item[1] as LucideIcon;
            return <div className="feature-chip" key={item[0] as string}><Icon size={16} /><span><strong>{item[0] as string}</strong><small>{item[2] as string}</small></span><i className="dot green pulse-dot" /></div>;
          })}</div></section>
   <section className="wide-card quality-card"><div className="section-heading"><h2><BarChart3 size={15} />Knowledge Quality</h2><strong className="quality-overall">Good</strong></div><div className="quality-grid">{quality.map(item => <div key={item.label}><div className="quality-head"><span>{item.label}</span><strong style={{
                color: item.color
              }}>{item.value}</strong></div><div className="quality-bar"><span style={{
                width: item.value,
                background: item.color
              }} /></div><small style={{
              color: item.color
            }}>{item.status}</small><p>{item.detail}</p></div>)}</div></section>
   <section className="wide-card settings-card"><h3><Settings2 size={16} />Knowledge Settings</h3>{[['Allow AI Assistant to use Business Knowledge', 'Enabled', 'Ground responses using trusted business information.'], ['Allow Agents to use Business Knowledge', 'Enabled', 'Give selected Agents access to approved knowledge.'], ['Allow AI features to use connected knowledge', 'Enabled', 'Use synchronized source data across AI experiences.'], ['Enable automatic synchronization', 'Enabled', 'Keep connected sources fresh on their schedule.']].map(row => <div className="toggle-row" key={row[0]}><div><strong>{row[0]}</strong><small>{row[2]}</small></div><button className="toggle on" aria-label={`Toggle ${row[0]}`}><span /></button></div>)}</section>
  </main>
  {showDrawer && <aside className="detail-drawer" role="dialog" aria-modal="false" aria-labelledby="drawer-title"><div className="drawer-header"><div><span className="eyebrow">Knowledge Detail</span><h2 id="drawer-title">Product Catalog</h2></div><button className="icon-button" onClick={() => setShowDrawer(false)} aria-label="Close knowledge detail"><X size={17} /></button></div><div className="drawer-content"><span className="type-pill">Products & Services</span><div className="detail-source"><span className="source-icon shopify-icon"><ShoppingBag size={18} /></span><div><strong>Shopify</strong><small>Source</small></div><span className="status-badge" style={{
            color: 'var(--chart-4)'
          }}><i className="pulse-dot" />Active</span></div><p className="drawer-description">Complete product catalog synchronized from Shopify including product names, descriptions, pricing, categories and availability.</p><div className="metadata"><span><strong>2,847</strong> products</span><span><strong>12</strong> categories</span><span><strong>38 KB</strong></span></div><dl className="detail-list"><div><dt>Last Updated</dt><dd>Today, 11:30 AM</dd></div><div><dt>Last Synchronized</dt><dd>Today, 11:30 AM</dd></div><div><dt>Used by</dt><dd>AI Assistant, 5 AI Agents, AI Recommendations</dd></div><div><dt>Access Scope</dt><dd>Entire Business</dd></div><div><dt>Version</dt><dd>v14 (auto)</dd></div></dl><div className="drawer-section"><div className="drawer-section-head"><h3>Tags</h3><button className="table-open">+ Add Tag</button></div><div className="tags"><span>Product</span><span>Shopify</span><span>E-Commerce</span></div></div><div className="drawer-section"><h3>Agents using</h3>{['Marketing Intelligence Agent', 'SEO Opportunity Agent', 'Customer Retention Agent'].map(name => <div className="drawer-agent" key={name}><span className="mini-avatar"><Bot size={13} /></span><span>{name}</span><button className="table-open">Open Agent</button></div>)}</div><div className="drawer-section"><h3>AI Features</h3><div className="tags"><span>AI Assistant</span><span>AI Agents</span><span>Recommendations</span></div></div><div className="grounding-note"><Brain size={15} /><span>This knowledge grounds Lulu AI responses with verified business data from your Shopify store. It is not AI-generated output.</span></div></div><footer className="drawer-footer"><button className="ghost-button">Edit</button><button className="ghost-button">Sync</button><button className="ghost-button">Manage Access</button><button className="ghost-button amber-button" onClick={() => setShowDisableConfirm(true)}>Disable</button><button className="ghost-button danger-button" onClick={() => setShowDeleteConfirm(true)}>Delete</button></footer></aside>}
  {showConnectModal && <div className="modal-backdrop"><section className="create-modal" role="dialog" aria-modal="true"><button className="close-modal" onClick={() => setShowConnectModal(false)} aria-label="Close connect source dialog"><X size={18} /></button><h2>Connect Knowledge Source</h2><p>Choose a trusted platform to connect with Lulu AI.</p><div className="type-options"><button className="type-option"><ShoppingBag size={19} />Shopify</button><button className="type-option"><Globe size={19} />WordPress</button><button className="type-option"><TrendingUp size={19} />Google Analytics</button></div><div className="modal-footer"><button className="ghost-button" onClick={() => setShowConnectModal(false)}>Cancel</button><button className="primary-button" onClick={() => setShowConnectModal(false)}>Continue</button></div></section></div>}
  {showDisableConfirm && <div className="modal-backdrop"><section className="confirm-card" role="dialog"><h2>Disable Product Catalog?</h2><p>AI experiences will stop using this knowledge until it is enabled again.</p><div className="confirm-actions"><button className="ghost-button" onClick={() => setShowDisableConfirm(false)}>Cancel</button><button className="primary-button" onClick={() => setShowDisableConfirm(false)}>Disable</button></div></section></div>}{showDeleteConfirm && <div className="modal-backdrop"><section className="confirm-card" role="dialog"><h2>Delete this knowledge?</h2><p>This action cannot be undone.</p><div className="confirm-actions"><button className="ghost-button" onClick={() => setShowDeleteConfirm(false)}>Cancel</button><button className="danger-fill" onClick={() => setShowDeleteConfirm(false)}>Delete</button></div></section></div>}
 </div>;
};