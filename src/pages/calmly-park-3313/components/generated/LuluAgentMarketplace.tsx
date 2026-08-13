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
  <aside className="market-sidebar" aria-label="Primary navigation"><div className="wordmark"><Sparkles size={18} /><span>Lulu AI</span></div><LuluSectionNavigation activeId="calmly-park-3313" /><div className="sidebar-bottom"><button className="market-nav"><Settings size={16} /><span>Settings</span></button><button className="market-nav"><HelpCircle size={16} /><span>Help</span></button><button className="profile"><span className="avatar">SM</span><span><strong>Sarah Mitchell</strong><small>CEO</small></span><ChevronDown size={14} /></button></div></aside>
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