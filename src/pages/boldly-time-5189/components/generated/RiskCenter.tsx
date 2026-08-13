import { useState } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Bot, BrainCircuit, ChevronDown, ChevronRight, CircleHelp, Clock3, Download, FileText, Filter, LayoutDashboard, Menu, MoreHorizontal, PanelRightClose, Plus, RefreshCw, Search, Settings, ShieldAlert, Sparkles, Target, TrendingUp, Users, X, Zap } from 'lucide-react';
type Risk = {
  title: string;
  type: string;
  area: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  probability: string;
  exposure: string;
  trend: string;
  status: string;
  owner: string;
  initials: string;
  color: string;
  detected: string;
};
const risks: Risk[] = [{
  title: 'Customer Churn Risk',
  type: 'Customer Risk',
  area: 'Customers / Revenue',
  severity: 'High',
  probability: 'Medium',
  exposure: '$48K–$92K',
  trend: 'Increasing ↑',
  status: 'Under Monitoring',
  owner: 'Sarah Chen',
  initials: 'SC',
  color: 'var(--foreground)',
  detected: '2 hours ago'
}, {
  title: 'Advertising Efficiency Decline',
  type: 'Advertising Risk',
  area: 'Advertising',
  severity: 'High',
  probability: 'High',
  exposure: '$22K–$41K',
  trend: 'Increasing ↑',
  status: 'Mitigating',
  owner: 'James Park',
  initials: 'JP',
  color: 'var(--chart-1)',
  detected: '4 hours ago'
}, {
  title: 'Sales Pipeline Deterioration',
  type: 'Sales Risk',
  area: 'Sales',
  severity: 'Medium',
  probability: 'Medium',
  exposure: '$31K–$67K',
  trend: 'Stable →',
  status: 'Under Review',
  owner: 'Maria Lopez',
  initials: 'ML',
  color: 'var(--foreground)',
  detected: 'Yesterday'
}, {
  title: 'Margin Compression',
  type: 'Finance Risk',
  area: 'Finance',
  severity: 'High',
  probability: 'Medium',
  exposure: '$15K–$28K',
  trend: 'Increasing ↑',
  status: 'Detected',
  owner: 'David Kim',
  initials: 'DK',
  color: 'var(--foreground)',
  detected: 'Yesterday'
}, {
  title: 'Google Ads Platform Dependency',
  type: 'Advertising Risk',
  area: 'Advertising',
  severity: 'Medium',
  probability: 'Low',
  exposure: '$18K–$35K',
  trend: 'Stable →',
  status: 'Monitoring',
  owner: 'James Park',
  initials: 'JP',
  color: 'var(--chart-1)',
  detected: 'Jun 2, 2025'
}, {
  title: 'Inventory Shortage Risk',
  type: 'Ecommerce Risk',
  area: 'Ecommerce / Operations',
  severity: 'Medium',
  probability: 'Medium',
  exposure: '$9K–$18K',
  trend: 'Newly Detected',
  status: 'Detected',
  owner: 'Unassigned',
  initials: '—',
  color: 'var(--muted-foreground)',
  detected: 'Today, 08:42'
}];
const nav = [{
  label: 'Overview',
  icon: LayoutDashboard
}, {
  label: 'AI Intelligence',
  icon: BrainCircuit
}, {
  label: 'Risk Center',
  icon: ShieldAlert
}, {
  label: 'Decisions',
  icon: Target
}, {
  label: 'Tasks',
  icon: Activity
}, {
  label: 'Reports',
  icon: FileText
}];
const evidence = [{
  source: 'CRM',
  metric: 'Churn Rate',
  value: '4.8%',
  change: '↑ +1.7pp'
}, {
  source: 'CRM',
  metric: 'Retention Rate',
  value: '87.2%',
  change: '↓ -3.1pp'
}, {
  source: 'Revenue',
  metric: 'Recurring Revenue',
  value: '$284K',
  change: '↓ -8.2%'
}, {
  source: 'CRM',
  metric: 'Customer LTV',
  value: '$1,240',
  change: '↓ -12%'
}];
const sources = [{
  name: 'Shopify',
  sync: 'Live',
  quality: 'Excellent'
}, {
  name: 'Google Analytics',
  sync: '2 min ago',
  quality: 'Good'
}, {
  name: 'Google Ads',
  sync: '5 min ago',
  quality: 'Good'
}, {
  name: 'Meta Ads',
  sync: '3 min ago',
  quality: 'Good'
}, {
  name: 'CRM',
  sync: '1 min ago',
  quality: 'Excellent'
}, {
  name: 'Finance',
  sync: '15 min ago',
  quality: 'Good'
}];
const priority = ['Customer Churn Risk', 'Advertising Efficiency Decline', 'Margin Compression', 'Sales Pipeline Deterioration', 'Inventory Shortage Risk'];
function Sidebar() {
  return <aside className="sidebar"><div className="brand"><span className="brand-mark"><Sparkles size={17} /></span><strong>Lulu AI</strong><span className="brand-tag">CORE</span></div><div className="workspace"><span className="workspace-dot" /> Northstar Commerce <ChevronDown size={14} /></div><p className="nav-label">WORKSPACE</p><LuluSectionNavigation activeId="boldly-time-5189" /><p className="nav-label intelligence">INTELLIGENCE</p><button className="nav-item"><BarChart3 size={17} /><span>Performance</span></button><button className="nav-item"><Users size={17} /><span>Customers</span></button><div className="sidebar-bottom"><button className="nav-item"><Settings size={17} /><span>Settings</span></button><div className="profile"><span className="avatar">AC</span><span><strong>Alex Carter</strong><small>Administrator</small></span><MoreHorizontal size={17} /></div></div></aside>;
}
function RiskCard({
  risk,
  onOpen
}: {
  risk: Risk;
  onOpen: () => void;
}) {
  const sev = risk.severity === 'High' ? 'high' : risk.severity.toLowerCase();
  return <article className={`risk-card ${risk.severity === 'High' ? 'critical-pulse' : ''}`}><div className="risk-top"><span className="type-badge">{risk.type}</span><button aria-label={`More actions for ${risk.title}`}><MoreHorizontal size={17} /></button></div><h3>{risk.title}</h3><span className="area">{risk.area}</span><div className="risk-facts"><span><i className={`severity-dot ${sev}`} /><strong>Severity</strong> {risk.severity}</span><span><strong>Probability</strong> {risk.probability}</span></div><div className="exposure"><small>Estimated {risk.title.includes('Margin') ? 'Profit' : 'Revenue'} Exposure</small><strong>{risk.exposure}</strong></div><div className="trend-row"><span className={risk.trend.includes('Increasing') ? 'trend-up' : risk.trend.includes('New') ? 'trend-new' : 'trend-stable'}>{risk.trend.includes('Increasing') ? <ArrowUpRight size={15} /> : risk.trend.includes('Stable') ? <ArrowRightIcon /> : <Zap size={15} />} {risk.trend}</span><span className="status-chip">{risk.status}</span></div><div className="risk-footer"><span className="owner"><span className="mini-avatar" style={{
          background: risk.color
        }}>{risk.initials}</span>{risk.owner}</span><small>Detected {risk.detected}</small></div><div className="card-actions"><button onClick={onOpen}>Open</button><button>Review</button><button className="mitigate">Mitigate</button></div></article>;
}
function ArrowRightIcon() {
  return <span aria-hidden="true">→</span>;
}
function DetailPanel({
  onClose
}: {
  onClose: () => void;
}) {
  return <section className="detail-panel"><div className="detail-head"><div><span className="eyebrow">CUSTOMER RISK · CUSTOMERS / REVENUE</span><h2>Customer Churn Risk</h2><div className="detail-meta"><span><i className="severity-dot high" /> High severity</span><span>Probability: Medium</span><span className="trend-up">Increasing ↑</span><span className="status-chip">Under Monitoring</span></div></div><button className="close-detail" onClick={onClose} aria-label="Close risk detail"><PanelRightClose size={18} /></button></div><div className="detail-actions"><button className="purple"><Sparkles size={15} /> Create AI Task</button><button>Create Decision</button><button>Accept Risk</button><button>Resolve Risk</button><button>Request Review</button></div><DetailSection title="Risk"><div className="description-grid"><div><label>Observed Condition</label><p>Sustained increase in customer churn within high-value segments.</p></div><div><label>AI Interpretation</label><p>Continued churn may reduce recurring revenue and increase customer acquisition pressure.</p></div></div><div className="why"><div className="section-title"><Sparkles size={16} /> Why Lulu AI identified this risk <span className="ai-badge">AI-generated</span></div><ul><li><strong>Trigger:</strong> Customer churn increased during the selected period.</li><li><strong>Pattern:</strong> Increase is concentrated within high-value customer segment.</li><li><strong>Historical comparison:</strong> Churn rate 4.8% vs prior period 3.1%</li><li><strong>Relevant KPI changes:</strong> Retention Rate ↓ · CLV ↓ · Repeat Purchase Rate ↓</li><li><strong>Potential consequence:</strong> Future recurring revenue may be affected if trend continues.</li></ul></div></DetailSection><DetailSection title="Supporting Evidence"><div className="table-wrap"><table><thead><tr><th>Source</th><th>Metric</th><th>Value</th><th>Period</th><th>Change</th></tr></thead><tbody>{evidence.map(row => <tr key={row.metric}><td>{row.source}</td><td>{row.metric}</td><td><strong>{row.value}</strong></td><td>Last 30 days</td><td className="trend-up">{row.change}</td></tr>)}</tbody></table></div></DetailSection><DetailSection title="Related Metrics"><div className="metric-list"><span>Customer Churn Rate <strong>4.8% ↑</strong><small>Observed</small></span><span>Retention Rate <strong>87.2% ↓</strong><small>Observed</small></span><span>Customer LTV <strong>$1,240 ↓</strong><small>Calculated</small></span><span>Repeat Purchase Rate <strong>34% ↓</strong><small>Observed</small></span></div></DetailSection><DetailSection title="Cross-Module Signals"><div className="signal-flow"><span>Customers <b>→</b> Churn increasing</span><span>Revenue <b>→</b> Recurring revenue exposure increasing</span><span>Sales <b>→</b> Replacement pipeline insufficient</span><span className="ai-line">AI Intelligence <b>→</b> Customer retention risk detected <small>AI-identified risk</small></span></div></DetailSection><div className="split-sections"><DetailSection title="Potential Impact"><div className="impact-grid">{['Revenue|High', 'Profit|High', 'Customers|Critical', 'Sales|Medium', 'Marketing|Medium', 'Strategy|Medium'].map(item => {
            const [a, b] = item.split('|');
            return <span key={a}><strong>{a}</strong><small className={b.toLowerCase()}>{b}</small></span>;
          })}</div><p className="big-exposure">$48K–$92K <small>Estimated Exposure</small></p></DetailSection><DetailSection title="Risk Window"><p><label>Detection Date</label> May 28, 2025</p><p><label>Expected Escalation Window</label> 4–6 weeks</p><p><label>Potential Deadline</label> Jul 15, 2025</p></DetailSection></div><DetailSection title="Mitigation"><div className="mitigation"><p><label>Recommended</label>Activate targeted retention strategy for high-value segment</p><p><label>Current Mitigation</label>Retention email sequence initiated</p><p><label>Expected Effect</label>Reduce churn to &lt;3.5% within 45 days</p><span className="in-progress">In Progress</span></div></DetailSection><div className="recommendation"><div className="section-title"><Sparkles size={16} /> Lulu AI Mitigation Recommendation <span className="ai-badge">AI Recommendation</span></div><p>Lulu AI recommends reviewing the affected customer segment and activating a targeted retention strategy focused on high-LTV customers showing early churn signals.</p><div className="recommendation-stats"><span>Expected Impact <strong>Medium–High</strong></span><span>Effort <strong>Medium</strong></span><span>Confidence <strong>Medium</strong></span></div><button className="purple">Create AI Task from Recommendation</button></div><DetailSection title="Create AI Task"><div className="task-form"><input aria-label="Suggested action" value="Activate targeted retention strategy" readOnly /><input aria-label="Priority" value="High priority · Evidence linked" readOnly /><button className="purple">Create Task</button></div></DetailSection><DetailSection title="Risk Scenarios"><div className="scenario-grid"><div className="scenario best"><strong>Best Case</strong><span>Churn returns to 3.1%</span><b>$12K–$18K</b><small>Estimated Scenario</small></div><div className="scenario expected"><strong>Expected Case</strong><span>Churn stabilizes at 4.8%</span><b>$48K–$92K</b><small>Estimated Scenario</small></div><div className="scenario worst"><strong>Worst Case</strong><span>Churn reaches 7%+</span><b>$110K–$180K</b><small>Estimated Scenario</small></div></div></DetailSection><DetailSection title="Risk Monitoring"><div className="sparkline"><span>Severity trend <b>↗</b></span><div className="line-chart">╱╲__╱╱╲___╱╱</div><span>Probability trend <b>↗</b></span><div className="line-chart muted">__╱╲___╱╲__</div><strong className="worsening">Status: Worsening</strong></div></DetailSection><DetailSection title="Risk Dependencies"><div className="dependency-list"><span>Related Systems <b>CRM, Revenue Analytics</b></span><span>Integrations <b>Shopify, CRM</b></span><span>Processes <b>Customer Success</b></span><span>Related Risks <b>Sales Pipeline Deterioration</b></span></div></DetailSection><DetailSection title="Risk History"><ol className="timeline"><li><b>Detected</b><span>Jun 1 · Lulu AI</span></li><li><b>Severity escalated Medium → High</b><span>Jun 2 · David Kim</span></li><li><b>Mitigation created</b><span>Jun 3 · Sarah Chen</span></li><li><b>Owner assigned</b><span>Jun 4 · Alex Carter</span></li></ol></DetailSection></section>;
}
function DetailSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return <section className="detail-section"><h3>{title}</h3>{children}</section>;
}
export function RiskCenter() {
  const [detailOpen, setDetailOpen] = useState(true);
  const [modal, setModal] = useState(false);
  const [tab, setTab] = useState('All Risks');
  return <main className="app-shell"><Sidebar /><div className="content"><header className="topbar"><div className="breadcrumbs">Intelligence <ChevronRight size={13} /> AI Intelligence <ChevronRight size={13} /> <strong>Risk Center</strong></div><div className="header-tools"><button className="icon-btn"><Bell size={17} /></button><span className="top-avatar">AC</span></div></header><div className="page-header"><div><p className="eyebrow">AI INTELLIGENCE / RISK CENTER</p><h1>Risk Center</h1><p className="subtitle">Detect, understand and prioritize the risks that could impact your business.</p></div><div className="page-actions"><button className="purple"><Sparkles size={16} /> Ask Lulu AI</button><button><RefreshCw size={15} /> Refresh Risk Analysis</button><button onClick={() => setModal(true)}><Plus size={15} /> Create Report</button><button><Download size={15} /> Export <ChevronDown size={14} /></button></div></div><div className="search-row"><Search size={18} /><input placeholder="Search risks, customers, KPIs, products..." aria-label="Search risks" /><span>⌘ K</span></div><section className="status-section"><div className="status-tiles">{[['12', 'Active Risks'], ['3', 'Critical Risks'], ['4', 'High Risks'], ['5', 'Increasing'], ['2', 'New Today'], ['3', 'Under Mitigation'], ['7', 'Resolved'], ['3', 'Require Attention']].map(([value, label]) => <div key={label} className={label === 'Require Attention' ? 'attention' : ''}><strong>{value}</strong><span>{label}</span></div>)}<div className="analysis-meta"><span>Last Analysis <b>2 minutes ago</b></span><span>Data Freshness <b className="live"><i /> Live</b></span></div></div><div className="ai-banner"><Sparkles size={16} /><span>Lulu AI is currently monitoring <strong>12 active business risks.</strong> 3 require immediate attention.</span></div></section><section className="summary"><div className="section-title"><Sparkles size={18} /> AI Risk Summary <span className="ai-badge">AI-generated</span></div><p>Customer retention and advertising efficiency represent the two most significant current risks. Customer churn risk has increased over the last reporting period, while advertising risk is concentrated in one acquisition channel. Finance margin pressure is emerging as a secondary concern.</p><small>AI interpretation based on available business data. Not a guarantee of outcome.</small></section><div className="workspace-grid"><section className="risk-workspace"><div className="workspace-heading"><div><p className="eyebrow">MONITORING OVERVIEW</p><h2>Active Risks <span>12 total</span></h2></div><button className="create-risk" onClick={() => setModal(true)}><Plus size={16} /> Create Risk</button></div><div className="tabs">{['All Risks', 'Critical', 'High', 'Medium', 'Low', 'Increasing', 'Under Mitigation', 'Resolved'].map(item => <button key={item} className={tab === item ? 'selected' : ''} onClick={() => setTab(item)}>{item}</button>)}</div><button className="filter-bar"><Filter size={15} /> Filters <span>Risk Type · Business Area · Severity · Probability · Exposure · Trend · Status · Owner · Source · Created Date</span><ChevronDown size={15} /></button><div className="risk-grid">{risks.map(risk => <RiskCard key={risk.title} risk={risk} onOpen={() => setDetailOpen(true)} />)}</div><section className="bottom-grid"><div className="bottom-card"><div className="section-title"><Target size={17} /> AI Risk Prioritization <span className="ai-badge">AI-generated</span></div>{priority.map((item, index) => <div className="priority-row" key={item}><b>{String(index + 1).padStart(2, '0')}</b><span><strong>{item}</strong><small>Severity · Probability · Exposure · Urgency · Trend</small></span><em>{index < 2 ? '92' : index === 2 ? '78' : '64'}</em></div>)}</div><div className="bottom-card ask-card"><div className="section-title"><Bot size={17} /> Ask Lulu AI</div><div className="ask-input"><input placeholder="Ask Lulu AI about your business risks..." /><button><ArrowUpRight size={16} /></button></div><div className="prompt-chips">{['What are my biggest business risks?', 'Which risks require immediate attention?', 'Which risks are increasing?', 'What is my biggest financial risk?'].map(item => <button key={item}>{item}</button>)}</div></div></section><section className="sources bottom-card"><div className="section-title"><Activity size={17} /> Risk Data Sources <span className="freshness">All systems healthy</span></div><table><thead><tr><th>Source</th><th>Last Sync</th><th>Freshness</th><th>Status</th></tr></thead><tbody>{sources.map(source => <tr key={source.name}><td><strong>{source.name}</strong></td><td>{source.sync}</td><td>{source.quality}</td><td><span className="online"><i /> Connected</span></td></tr>)}</tbody></table></section></section>{detailOpen && <DetailPanel onClose={() => setDetailOpen(false)} />}</div></div>{modal && <div className="modal-backdrop"><section className="create-modal" role="dialog" aria-modal="true" aria-labelledby="create-title"><div className="modal-head"><div><p className="eyebrow">RISK MANAGEMENT</p><h2 id="create-title">Create Risk</h2></div><button onClick={() => setModal(false)} aria-label="Close create risk"><X size={19} /></button></div><div className="modal-tabs"><button className="selected">Define manually</button><button><Sparkles size={14} /> Create with Lulu AI</button></div><label>Risk title<input placeholder="e.g. Customer concentration risk" /></label><label>Risk description<textarea placeholder="Describe the observed condition and potential impact..." /></label><div className="form-two"><label>Business area<select><option>Customers / Revenue</option><option>Finance</option><option>Advertising</option></select></label><label>Risk type<select><option>Customer Risk</option><option>Finance Risk</option><option>Operational Risk</option></select></label></div><div className="form-two"><label>Severity<select><option>High</option><option>Critical</option><option>Medium</option></select></label><label>Time horizon<select><option>Short Term</option><option>Medium Term</option></select></label></div><label>Mitigation<textarea placeholder="Optional mitigation plan..." /></label><div className="modal-actions"><button onClick={() => setModal(false)}>Cancel</button><button className="purple" onClick={() => setModal(false)}>Create Risk</button></div></section></div>}</main>;
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