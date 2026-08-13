import { useMemo, useState } from 'react';
import { Activity, ArrowUpDown, BarChart3, BookOpen, Bot, Brain, Check, CheckCircle, ChevronDown, ChevronRight, DollarSign, Globe, Grid3X3, Heart, HelpCircle, Layers, LayoutDashboard, LayoutTemplate, LineChart, MapPin, MessageSquare, MessagesSquare, PenTool, Plug, Search, Settings, Settings2, ShieldCheck, ShoppingBag, Sparkles, Store, Target, TrendingUp, Users, X, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
type Agent = {
  id: string;
  name: string;
  publisher: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  category: string;
  rating: string;
  installs: string;
  capabilities: string[];
  integrations: string[];
  type: 'Official' | 'Partner' | 'Community';
  installed?: boolean;
  verified?: boolean;
};
type Category = {
  name: string;
  icon: LucideIcon;
  color: string;
  count: string;
};
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
const categories: Category[] = [{
  name: 'Marketing',
  icon: TrendingUp,
  color: 'var(--foreground)',
  count: '6 agents'
}, {
  name: 'SEO',
  icon: Globe,
  color: 'var(--foreground)',
  count: '4 agents'
}, {
  name: 'GEO',
  icon: MapPin,
  color: 'var(--foreground)',
  count: '2 agents'
}, {
  name: 'AEO',
  icon: Search,
  color: 'var(--foreground)',
  count: '2 agents'
}, {
  name: 'Advertising',
  icon: Target,
  color: 'var(--foreground)',
  count: '5 agents'
}, {
  name: 'Analytics',
  icon: BarChart3,
  color: 'var(--foreground)',
  count: '4 agents'
}, {
  name: 'Operations',
  icon: Settings2,
  color: 'var(--foreground)',
  count: '3 agents'
}, {
  name: 'E-commerce',
  icon: ShoppingBag,
  color: 'var(--foreground)',
  count: '5 agents'
}, {
  name: 'Content',
  icon: PenTool,
  color: 'var(--foreground)',
  count: '4 agents'
}, {
  name: 'Sales',
  icon: DollarSign,
  color: 'var(--foreground)',
  count: '3 agents'
}, {
  name: 'Business Intelligence',
  icon: Layers,
  color: 'var(--foreground)',
  count: '3 agents'
}, {
  name: 'Automation',
  icon: Zap,
  color: 'var(--foreground)',
  count: '4 agents'
}];
const agents: Agent[] = [{
  id: 'marketing',
  name: 'Marketing Intelligence Pro',
  publisher: 'Lulu AI',
  description: 'Comprehensive marketing analytics across all your connected advertising and analytics platforms.',
  icon: TrendingUp,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.15)',
  category: 'Marketing',
  rating: '4.9',
  installs: '1,240',
  capabilities: ['Marketing Analysis', 'ROAS Tracking', 'Campaign Reporting'],
  integrations: ['Google Analytics', 'Google Ads', 'Meta Ads'],
  type: 'Official',
  installed: true,
  verified: true
}, {
  id: 'seo',
  name: 'SEO Growth Engine',
  publisher: 'Lulu AI',
  description: 'Identifies, prioritizes and tracks SEO opportunities to drive organic growth.',
  icon: Globe,
  color: 'var(--chart-4)',
  bg: 'rgba(0,0,0,.12)',
  category: 'SEO',
  rating: '4.8',
  installs: '986',
  capabilities: ['Keyword Research', 'Content Gaps', 'Rank Tracking'],
  integrations: ['Google Analytics', 'WordPress (optional)'],
  type: 'Official',
  installed: true,
  verified: true
}, {
  id: 'ecommerce',
  name: 'E-Commerce Performance Agent',
  publisher: 'Lulu AI',
  description: 'Monitors and optimizes e-commerce performance across Shopify and WooCommerce.',
  icon: ShoppingBag,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.12)',
  category: 'E-commerce',
  rating: '4.7',
  installs: '847',
  capabilities: ['Revenue Tracking', 'Conversion Analysis', 'Product Insights'],
  integrations: ['Shopify or WooCommerce', 'Google Analytics'],
  type: 'Official',
  verified: true
}, {
  id: 'geo',
  name: 'GEO Visibility Agent',
  publisher: 'Lulu AI',
  description: 'Optimizes your presence in AI-powered geographic search results.',
  icon: MapPin,
  color: 'var(--chart-4)',
  bg: 'rgba(0,0,0,.12)',
  category: 'GEO',
  rating: '4.6',
  installs: '312',
  capabilities: ['GEO Analysis', 'Local Visibility', 'Listing Optimization'],
  integrations: ['Google Analytics'],
  type: 'Official',
  verified: true
}, {
  id: 'aeo',
  name: 'AEO Answer Engine Agent',
  publisher: 'Lulu AI',
  description: 'Optimizes content for AI answer engines and voice search results.',
  icon: Search,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.12)',
  category: 'AEO',
  rating: '4.5',
  installs: '234',
  capabilities: ['AEO Analysis', 'Schema Optimization', 'Featured Snippets'],
  integrations: ['Google Analytics', 'WordPress'],
  type: 'Official',
  verified: true
}, {
  id: 'roas',
  name: 'Advertising ROAS Optimizer',
  publisher: 'Lulu AI',
  description: 'Continuously monitors and optimizes advertising spend efficiency.',
  icon: Target,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.12)',
  category: 'Advertising',
  rating: '4.7',
  installs: '678',
  capabilities: ['ROAS Tracking', 'Budget Allocation', 'Campaign Alerts'],
  integrations: ['Google Ads', 'Meta Ads'],
  type: 'Official',
  verified: true
}, {
  id: 'ltv',
  name: 'Customer Lifetime Value Agent',
  publisher: 'GrowthLab',
  description: 'Predicts and tracks customer lifetime value to prioritize high-value segments.',
  icon: Users,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.12)',
  category: 'Sales',
  rating: '4.6',
  installs: '445',
  capabilities: ['CLV Analysis', 'Segmentation', 'Retention Signals'],
  integrations: ['Shopify', 'Google Analytics'],
  type: 'Partner',
  verified: true
}, {
  id: 'content',
  name: 'Content Strategy Pro',
  publisher: 'ContentIQ',
  description: 'AI-powered content planning, topic research and editorial calendar generation.',
  icon: PenTool,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.12)',
  category: 'Content',
  rating: '4.5',
  installs: '321',
  capabilities: ['Content Planning', 'Topic Research', 'Calendar'],
  integrations: ['WordPress', 'Google Analytics'],
  type: 'Partner',
  installed: true,
  verified: true
}, {
  id: 'ops',
  name: 'Operations Monitor',
  publisher: 'OpenAgents',
  description: 'Monitors key operational metrics and alerts on anomalies.',
  icon: Settings2,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.12)',
  category: 'Operations',
  rating: '4.2',
  installs: '178',
  capabilities: ['Ops Monitoring', 'Anomaly Detection', 'Reporting'],
  integrations: ['Internal Lulu AI'],
  type: 'Community'
}];
export const LuluAgentMarketplace = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[5]);
  const [showPanel, setShowPanel] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const [sortBy, setSortBy] = useState('Recommended');
  const filtered = useMemo(() => agents.filter(a => (activeCategory === 'All' || a.category === activeCategory) && `${a.name} ${a.description} ${a.category}`.toLowerCase().includes(query.toLowerCase())), [query, activeCategory]);
  const openDetails = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowPanel(true);
  };
  return <div className="market-shell">
  <aside className="market-sidebar" aria-label="Primary navigation"><div className="wordmark"><Sparkles size={18} /><span>Lulu AI</span></div><nav><p className="nav-section-label">Main</p>{navMain.map(item => {
          const Icon = item.icon;
          return <button className="market-nav" key={item.label}><Icon size={16} /><span>{item.label}</span></button>;
        })}<p className="nav-section-label platform">AI Platform</p>{navPlatform.map(item => {
          const Icon = item.icon;
          const active = item.label === 'Agent Marketplace';
          return <button className={`market-nav ${active ? 'active' : ''}`} key={item.label}><Icon size={16} /><span>{item.label}</span>{active && <span className="nav-count">24</span>}</button>;
        })}</nav><div className="sidebar-bottom"><button className="market-nav"><Settings size={16} /><span>Settings</span></button><button className="market-nav"><HelpCircle size={16} /><span>Help</span></button><button className="profile"><span className="avatar">SM</span><span><strong>Sarah Mitchell</strong><small>CEO</small></span><ChevronDown size={14} /></button></div></aside>
  <main className="market-main"><section className="market-hero"><div className="breadcrumb"><span>AI Platform</span><ChevronRight size={13} /><strong>Agent Marketplace</strong></div><div className="hero-center"><span className="eyebrow"><Sparkles size={12} />AGENT MARKETPLACE</span><h1>Find the right AI Agent<br /><em>for your business.</em></h1><p>Choose specialized agents for marketing, growth, analytics, operations and other supported business workflows.</p><form className="hero-search" role="search" aria-label="Search AI Agents" onSubmit={e => e.preventDefault()}><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search agents, capabilities or integrations..." aria-label="Search agents" /><button type="submit">Browse Agents</button></form><div className="hero-stats"><span>24+ Agents</span><i /><span>12 Categories</span><i /><span><ShieldCheck size={14} />Official &amp; Verified</span></div><div className="category-pills">{[{
              name: 'All'
            }, ...categories].map(item => <button key={item.name} className={activeCategory === item.name ? 'selected' : ''} onClick={() => setActiveCategory(item.name)} aria-pressed={activeCategory === item.name}>{item.name}</button>)}</div></div></section>
   <div className="content-wrap"><section><div className="section-head"><h2>Featured Agents</h2><button className="text-link">View all →</button></div><div className="featured-grid">{agents.slice(0, 3).map(agent => {
              const Icon = agent.icon;
              return <article className="featured-card" key={agent.id} style={{
                '--accent': agent.color
              } as React.CSSProperties}><div className="featured-top"><span className="big-icon" style={{
                    color: agent.color,
                    background: agent.bg
                  }}><Icon size={25} /><ShieldCheck className="verify" size={13} /></span><button className="more" aria-label={`More actions for ${agent.name}`}>•••</button></div><h3>{agent.name}</h3><p className="publisher">By {agent.publisher} <span className="official">Official</span></p><p className="description">{agent.description}</p><div className="rating"><span className="category-tag">{agent.category}</span><span aria-label={`Rated ${agent.rating} out of 5`}>★ {agent.rating} · {agent.installs} installs</span></div><div className="caps">{agent.capabilities.map(cap => <span key={cap}>{cap}</span>)}</div><p className="requires">Requires: {agent.integrations.join(' · ')}</p><div className="actions"><button className="ghost" onClick={() => openDetails(agent)}>View Details</button><button className="primary" onClick={() => {
                    setSelectedAgent(agent);
                    setShowModal(true);
                  }}>{agent.installed ? 'Open' : 'Install'}</button></div></article>;
            })}</div></section>
   <section className="category-section"><div className="section-head"><h2>Explore by Category</h2></div><div className="category-grid">{categories.map(category => {
              const Icon = category.icon;
              return <button className="category-card" key={category.name} onClick={() => setActiveCategory(category.name)}><Icon size={25} style={{
                  color: category.color
                }} /><span>{category.name}</span><small>{category.count}</small></button>;
            })}</div></section>
   <div className="filter-row"><label className="list-search"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search agents..." aria-label="Search all agents" /></label>{[['Category', Grid3X3], ['Type', Layers], ['Compatibility', Plug], ['Availability', CheckCircle]].map(([label, Icon]) => {
            const FilterIcon = Icon as LucideIcon;
            return <button className="filter" key={label as string}><FilterIcon size={14} /><span>{label === 'Category' ? 'All Categories' : label === 'Type' ? 'All Types' : label === 'Compatibility' ? 'Integrations' : 'All'}</span><ChevronDown size={13} /></button>;
          })}<button className="filter sort" onClick={() => setSortBy(sortBy === 'Recommended' ? 'Rating' : 'Recommended')}><ArrowUpDown size={14} /><span>Sort: {sortBy}</span></button></div>
   <section><div className="section-head"><h2>All Agents</h2><span className="count">{filtered.length ? '24 agents' : '0 agents'}</span></div><div className="agent-grid">{filtered.map(agent => {
              const Icon = agent.icon;
              return <article className="agent-card" key={agent.id}><div className="agent-card-head"><span className="agent-icon" style={{
                    color: agent.color,
                    background: agent.bg
                  }}><Icon size={21} />{agent.verified && <ShieldCheck className="verify" size={12} />}</span><span className="agent-names"><strong>{agent.name}</strong><small>By {agent.publisher}</small></span><span className={`type ${agent.type.toLowerCase()}`}>{agent.installed ? 'Installed' : agent.type}</span></div><div className="agent-meta"><span className="category-tag">{agent.category}</span><span aria-label={`Rated ${agent.rating} out of 5`}>★ {agent.rating} · {agent.installs}</span></div><p className="description">{agent.description}</p><div className="caps">{agent.capabilities.map(cap => <span key={cap}>{cap}</span>)}</div><p className="requires">Requires: {agent.integrations.join(' · ')}</p><div className="actions"><button className="ghost" onClick={() => openDetails(agent)} aria-label={`View details for ${agent.name}`}>View Details</button><button className={agent.installed ? 'open' : 'primary'} onClick={() => agent.installed ? openDetails(agent) : (setSelectedAgent(agent), setShowModal(true))}>{agent.installed ? 'Open' : 'Install'}</button></div></article>;
            })}</div>{filtered.length === 0 && <div className="empty"><Search size={30} /><h3>No Agents Found</h3><p>No AI Agents match your current search or filters.</p><div><button className="ghost" onClick={() => {
                setQuery('');
                setActiveCategory('All');
              }}>Clear Filters</button><button className="primary">Browse All Agents</button></div></div>}</section>
   <section className="lower-section"><div className="section-head"><h2>Already Installed</h2><button className="text-link">My Agents →</button></div><div className="compact-grid">{agents.filter(a => a.installed).map(agent => {
              const Icon = agent.icon;
              return <article className="compact-card" key={agent.id}><span className="small-icon" style={{
                  color: agent.color,
                  background: agent.bg
                }}><Icon size={17} /></span><span><strong>{agent.name}</strong><small>{agent.description}</small></span><button className="ghost" onClick={() => openDetails(agent)}>Open Agent</button></article>;
            })}</div></section>
   <section className="lower-section"><div className="section-head"><h2>Related Agents</h2></div><div className="compact-grid">{agents.slice(6, 9).map(agent => {
              const Icon = agent.icon;
              return <article className="compact-card" key={agent.id}><span className="small-icon" style={{
                  color: agent.color,
                  background: agent.bg
                }}><Icon size={17} /></span><span><strong>{agent.name}</strong><small>{agent.category} · {agent.integrations.join(' · ')}</small></span><button className="ghost" onClick={() => openDetails(agent)}>View Agent</button></article>;
            })}</div></section>
   </div></main>
   {showPanel && selectedAgent && <aside className="detail-panel" aria-label="Agent details"><div className="panel-scroll"><button className="close" onClick={() => setShowPanel(false)} aria-label="Close details"><X size={18} /></button><p className="panel-label">Agent Details</p><div className="identity"><span className="detail-icon" style={{
            color: selectedAgent.color,
            background: selectedAgent.bg
          }}><selectedAgent.icon size={28} /><ShieldCheck className="verify" size={14} /></span><h2>{selectedAgent.name}</h2><p>By {selectedAgent.publisher} <span className="official">Official</span></p><span className="panel-meta">{selectedAgent.category} · ★ {selectedAgent.rating} · {selectedAgent.installs} installs</span></div><p className="panel-description">{selectedAgent.id === 'roas' ? 'Continuously monitors and optimizes advertising spend efficiency across Google Ads and Meta Ads, surfacing actionable ROAS insights and budget recommendations.' : selectedAgent.description}</p><div className="detail-section"><h3>What this agent does</h3><p>Analyzes performance data, identifies opportunities and generates actionable recommendations across all connected business platforms.</p></div><div className="detail-section"><h3>Use cases</h3>{['Campaign ROAS Monitoring', 'Budget Optimization Alerts', 'Competitor Spend Analysis'].map((title, i) => <div className="use-case" key={title}><b>0{i + 1}</b><span><strong>{title}</strong><small>{['Continuously tracks return on ad spend across connected channels.', 'Alerts when allocation is underperforming and suggests reallocation.', 'Identifies shifts in the competitive landscape using available signals.'][i]}</small></span></div>)}</div><div className="detail-section"><h3>Capabilities</h3><div className="caps two">{['Analyze Ad Data', 'Monitor ROAS', 'Budget Alerts', 'Campaign Reporting', 'Recommendations', 'Create Tasks'].map(c => <span key={c}>{c}</span>)}</div></div><div className="detail-section"><h3>Required integrations</h3>{['Google Ads', 'Meta Ads', 'Google Analytics'].map((name, i) => <div className="integration" key={name}><Plug size={14} /><span>{name}<small>{i === 2 ? 'Recommended' : 'Required'}</small></span><em>Connected</em></div>)}</div><div className="detail-section"><h3>Required permissions</h3>{['Read advertising data', 'Read analytics data', 'Create tasks', 'Send alerts'].map((p, i) => <div className="permission" key={p}><span>{p}</span><small>{i < 2 ? 'Required' : 'Optional'}</small></div>)}</div><div className="detail-section"><h3>Knowledge requirements</h3><div className="permission"><span>Business Description</span><small>Recommended</small></div><div className="permission"><span>Products &amp; Services</span><small>Optional</small></div><p className="version">v2.4.1 · Updated Dec 12, 2024</p></div><div className="detail-section"><h3>Reviews</h3>{[['S.M.', 'This agent saved us hours of manual ROAS review each week. Highly recommended.'], ['J.K.', 'Great insights, would love more granular campaign-level breakdowns.']].map(review => <div className="review" key={review[0]}><b>{review[0]}</b><span><strong>★★★★★</strong><small>{review[1]}</small></span></div>)}</div></div><div className="panel-footer"><button className="ghost" onClick={() => setShowPanel(false)}>Cancel</button><button className="primary" onClick={() => setShowModal(true)}>Install Agent</button></div></aside>}
   {showModal && selectedAgent && <div className="modal-backdrop"><section className="install-modal" role="dialog" aria-modal="true" aria-labelledby="install-title"><button className="close" onClick={() => setShowModal(false)} aria-label="Close install dialog"><X size={18} /></button><Bot size={40} className="modal-bot" /><h2 id="install-title">Install {selectedAgent.name}?</h2><p className="modal-publisher">By {selectedAgent.publisher} · Official</p><div className="requirements"><h3>Capabilities</h3><div className="caps">{selectedAgent.capabilities.map(c => <span key={c}>{c}</span>)}</div><h3>Required integrations</h3>{['Google Ads', 'Meta Ads', 'Google Analytics'].map(n => <div className="integration" key={n}><Plug size={14} /><span>{n}</span><em>Connected</em></div>)}<h3>Required permissions</h3>{['Read advertising data', 'Read analytics data', 'Create tasks', 'Send alerts'].map((p, i) => <div className="permission" key={p}><span>{p}</span><small>{i < 2 ? 'Required' : 'Optional'}</small></div>)}<div className="amber-callout">This agent may trigger automated tasks and alerts based on configured rules.</div></div><div className="modal-actions"><button className="ghost" onClick={() => setShowModal(false)}>Cancel</button><button className="primary" onClick={() => setShowModal(false)}>Install Agent</button></div><small className="configure-note">You can configure this agent after installation.</small></section></div>}
 </div>;
};