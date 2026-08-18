import * as React from 'react';
import { Activity, AlertTriangle, Archive, ArrowDownRight, ArrowUpRight, BarChart3, Check, ChevronDown, ChevronRight, Clock3, Copy, Database, Download, Edit3, FileBarChart, FileText, Filter, Grid2X2, Heart, History, List, MoreHorizontal, Pause, Pencil, Play, Plus, RefreshCw, Search, Share2, Sparkles, Star, Trash2, TrendingUp, Users, X } from 'lucide-react';
type Report = {
  name: string;
  type: string;
  description: string;
  status: 'Ready' | 'Draft' | 'Generating';
  updated: string;
  ai?: boolean;
  schedule?: string;
  starred?: boolean;
};
const reports: Report[] = [{
  name: 'Monthly Executive Report',
  type: 'Executive',
  description: 'Comprehensive overview of business performance, changes, opportunities and risks.',
  status: 'Ready',
  updated: '2h ago',
  ai: true,
  schedule: 'Monthly',
  starred: true
}, {
  name: 'Advertising Performance Report',
  type: 'Advertising',
  description: 'Channel efficiency, spend allocation and return on advertising investment.',
  status: 'Ready',
  updated: '1d ago',
  ai: true,
  starred: true
}, {
  name: 'Customer Retention Analysis',
  type: 'Customer',
  description: 'Retention health, cohort movement and the signals behind customer loyalty.',
  status: 'Ready',
  updated: '3d ago',
  schedule: 'Weekly',
  starred: true
}, {
  name: 'Q2 Business Review',
  type: 'Executive',
  description: 'Quarterly review of goals, outcomes and the decisions ahead.',
  status: 'Draft',
  updated: '5d ago',
  ai: true
}, {
  name: 'Marketing Performance',
  type: 'Marketing',
  description: 'Campaign performance across acquisition and lifecycle channels.',
  status: 'Ready',
  updated: '2d ago'
}, {
  name: 'Sales Pipeline Report',
  type: 'Sales',
  description: 'Pipeline coverage, movement and forecast-ready sales activity.',
  status: 'Ready',
  updated: '4h ago'
}, {
  name: 'Revenue Growth Analysis',
  type: 'Revenue',
  description: 'Revenue momentum, growth drivers and areas requiring attention.',
  status: 'Generating',
  updated: 'Updating status',
  ai: true
}, {
  name: 'AI Intelligence Report',
  type: 'AI',
  description: 'A living brief of important changes detected across the business.',
  status: 'Ready',
  updated: '6h ago',
  ai: true
}, {
  name: 'Ecommerce Performance',
  type: 'Ecommerce',
  description: 'Store performance, conversion health and customer value signals.',
  status: 'Ready',
  updated: '1d ago'
}];
const templates = [['Executive Overview', 'Executive', 'KPIs · Charts · AI Insights', 'Shopify · CRM'], ['Monthly Business Review', 'Executive', 'KPIs · Charts · Recommendations', 'Shopify · Analytics'], ['Advertising Performance', 'Advertising', 'KPIs · Charts · AI Insights', 'Google Ads · Meta Ads'], ['Customer Retention', 'Customer', 'KPIs · Charts · Risks', 'CRM · Shopify'], ['Sales Performance', 'Sales', 'KPIs · Charts · Opportunities', 'CRM'], ['Marketing Performance', 'Marketing', 'KPIs · Charts · AI Insights', 'Ads · Analytics'], ['AI Intelligence Report', 'AI', 'AI Insights · Recommendations', 'Connected sources'], ['Financial Performance', 'Finance', 'KPIs · Charts · Risks', 'Finance · Shopify']];
const navItems = ['KPI Explorer', 'Reports', 'Comparisons', 'Benchmarks', 'Forecasts', 'Trends', 'Anomalies', 'Attribution'];
const suggestions = ['Create my monthly executive report', 'Analyze my marketing performance', 'Create an advertising performance report', 'Show me what changed this month', 'Create a customer retention report'];
function Badge({
  children,
  kind = 'neutral',
  icon
}: {
  children: React.ReactNode;
  kind?: string;
  icon?: React.ReactNode;
}) {
  return <span className={`badge ${kind}`}>{icon}{children}</span>;
}
function Sidebar() {
  return <aside className="sidebar"><div className="brand"><span className="brand-mark">L</span><strong>LULU <em>AI</em></strong></div><div className="workspace"><span className="workspace-mark">N</span><span><strong>Northstar Commerce</strong><small>Enterprise workspace</small></span><ChevronDown size={14} /></div><LuluSectionNavigation activeId="friendly-ground-4157" /><div className="sidebar-bottom"><a><Database size={16} /> Settings</a><div className="user"><span className="avatar">AS</span><span><strong>Alex Smith</strong><small>Admin</small></span><MoreHorizontal size={16} /></div></div></aside>;
}
function Status({
  status
}: {
  status: Report['status'];
}) {
  const icon = status === 'Ready' ? <Check size={12} /> : status === 'Draft' ? <span className="square-icon" /> : <RefreshCw size={12} className="spin" />;
  return <Badge kind={status.toLowerCase()} icon={icon}>{status}</Badge>;
}
function TrendChart() {
  return <svg className="report-chart" viewBox="0 0 760 190" role="img" aria-label="April revenue line compared with March revenue"><path d="M35 155H740M35 110H740M35 65H740M35 20H740" stroke="var(--border)" /><path d="M35 155C90 148 116 143 160 135S230 128 265 112S340 123 380 98S450 101 490 82S550 87 600 59S680 65 740 36" fill="none" stroke="var(--chart-4)" strokeWidth="4" strokeLinecap="round" /><path d="M35 165C90 162 120 155 160 158S230 145 265 148S340 140 380 135S450 139 490 121S550 132 600 112S680 108 740 96" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="7 7" /><circle cx="600" cy="59" r="5" fill="var(--chart-4)" /><text x="35" y="180">Apr 1</text><text x="205" y="180">Apr 10</text><text x="380" y="180">Apr 20</text><text x="570" y="180">Apr 30</text></svg>;
}
function ReportCard({
  report,
  onOpen
}: {
  report: Report;
  onOpen: () => void;
}) {
  return <article className="report-card"><header><div><Badge kind="type">{report.type}</Badge>{report.ai && <Badge kind="ai" icon={<Sparkles size={11} />}>AI Generated</Badge>}</div><button aria-label={`Favorite ${report.name}`} className="star"><Star size={16} fill={report.starred ? 'var(--foreground)' : 'none'} color={report.starred ? 'var(--foreground)' : 'currentColor'} /></button></header><h3>{report.name}</h3><p>{report.description}</p><div className="card-meta"><Status status={report.status} />{report.schedule && <Badge kind="schedule" icon={<Clock3 size={11} />}>Scheduled {report.schedule}</Badge>}</div><footer><span>Created by {report.ai ? 'Lulu AI' : 'Alex Smith'}<small>Updated {report.updated}</small></span><button className="small-button" onClick={onOpen}>Open <ChevronRight size={13} /></button><button className="more" aria-label="Report actions"><MoreHorizontal size={17} /></button></footer></article>;
}
export function LuluReports() {
  const [search, setSearch] = React.useState('');
  const [favoritesOpen, setFavoritesOpen] = React.useState(true);
  const [grid, setGrid] = React.useState(true);
  const [generator, setGenerator] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const [prompt, setPrompt] = React.useState('Create a monthly executive report showing revenue, customer growth, advertising performance, major changes, opportunities and risks.');
  const visible = reports.filter(report => report.name.toLowerCase().includes(search.toLowerCase()) || report.type.toLowerCase().includes(search.toLowerCase()));
  return <div className="app-shell"><Sidebar /><main className="page"><header className="page-header"><div><div className="breadcrumbs"><span>Intelligence</span><ChevronRight size={13} /><span>Analytics</span><ChevronRight size={13} /><strong>Reports</strong></div><h1>Reports</h1><p>Create, analyze, automate and share intelligent business reports with Lulu AI.</p></div><div className="top-actions"><button className="button primary"><Sparkles size={15} /> Ask Lulu AI</button><button className="button accent" onClick={() => setGenerator(true)}><Plus size={15} /> Create Report</button><button className="icon-button" aria-label="Refresh reports"><RefreshCw size={16} /></button></div></header>
    <section className="stat-strip" aria-label="Report overview"><div><strong>24</strong><span>Total Reports</span></div><div><strong>6</strong><span>Scheduled</span></div><div><strong>9</strong><span>Recently Updated</span></div><div><strong>14</strong><span>AI-Generated</span></div><div><strong>8</strong><span>Shared</span></div></section>
    <section className="library-zone"><div className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports, KPIs, customers, campaigns" /><kbd>/</kbd></div><div className="tabs">{['All Reports', 'My Reports', 'Shared With Me', 'AI Generated', 'Scheduled', 'Favorites', 'Drafts', 'Archived'].map((tab, i) => <button key={tab} className={i === 0 ? 'tab active' : 'tab'}>{tab}</button>)}</div><div className="filter-row">{['Business Area', 'Report Type', 'Created By', 'Date', 'Status'].map(filter => <button key={filter} className="filter-button"><Filter size={12} /> {filter}<ChevronDown size={13} /></button>)}</div>
      <div className="entry-grid"><article className="entry-card"><span className="entry-icon"><Grid2X2 size={19} /></span><h3>Start from Template</h3><p>Choose from pre-built templates</p><button className="button secondary" onClick={() => document.getElementById('templates')?.scrollIntoView({
              behavior: 'smooth'
            })}>Browse Templates</button></article><article className="entry-card"><span className="entry-icon"><Pencil size={19} /></span><h3>Build Custom Report</h3><p>Design your own report</p><button className="button secondary" onClick={() => setGenerator(true)}>Build Report</button></article><article className="entry-card ai-entry"><span className="entry-icon"><Sparkles size={19} /></span><h3>Generate with Lulu AI</h3><p>Describe what you want and Lulu AI builds it</p><button className="button accent" onClick={() => setGenerator(true)}>Generate Report</button></article></div>
      <div className="section-heading collapsible"><div><Star size={17} fill="var(--foreground)" color="var(--foreground)" /><h2>Favorite Reports</h2><span className="muted">3 reports</span></div><button className="icon-button" onClick={() => setFavoritesOpen(!favoritesOpen)} aria-label="Toggle favorite reports">{favoritesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</button></div>{favoritesOpen && <div className="favorite-scroll">{reports.slice(0, 3).map(report => <article className="favorite-card" key={report.name}><div><Star size={15} fill="var(--foreground)" color="var(--foreground)" /><strong>{report.name}</strong></div><div><Badge kind="type">{report.type}</Badge><Status status={report.status} /></div><small>{report.updated}</small><button className="small-button" onClick={() => setOpen(true)}>Open</button></article>)}</div>}
      <div className="section-heading"><div><h2>Report Library</h2><span className="muted">{visible.length} of 24 reports</span></div><div className="heading-actions"><button className="filter-button">Recently updated <ChevronDown size={13} /></button><button className="icon-button" onClick={() => setGrid(true)} aria-label="Grid view"><Grid2X2 size={16} /></button><button className="icon-button" onClick={() => setGrid(false)} aria-label="List view"><List size={16} /></button></div></div><div className={grid ? 'report-grid' : 'report-list'}>{visible.map(report => <ReportCard key={report.name} report={report} onOpen={() => setOpen(true)} />)}</div>
    </section>
    <section className="scheduled-section"><div className="section-heading"><div><Clock3 size={17} /><h2>Scheduled Reports</h2></div><button className="button secondary">Manage schedules</button></div><div className="table-wrap"><table><thead><tr><th>Report</th><th>Schedule</th><th>Next Run</th><th>Recipients</th><th>Status</th><th>Actions</th></tr></thead><tbody><tr><td><strong>Monthly Executive Report</strong><small>Executive · Lulu AI</small></td><td>Monthly on 1st</td><td>May 1</td><td><span className="avatars"><i>CEO</i><i>BD</i></span> CEO Board</td><td><Badge kind="ready" icon={<Check size={12} />}>Active</Badge></td><td><button>Edit</button><button>Pause</button><button>Delete</button></td></tr><tr><td><strong>Advertising Performance</strong><small>Advertising · AI Generated</small></td><td>Weekly Monday</td><td>Next Monday</td><td><span className="avatars"><i>MK</i><i>+2</i></span> Marketing team</td><td><Badge kind="ready" icon={<Check size={12} />}>Active</Badge></td><td><button>Edit</button><button>Pause</button></td></tr><tr><td><strong>Customer Retention</strong><small>Customer · Observed</small></td><td>Weekly Friday</td><td>Next Friday</td><td><span className="avatars"><i>SX</i><i>+2</i></span> Sales CX</td><td><Badge kind="paused" icon={<Pause size={12} />}>Paused</Badge></td><td><button>Resume</button><button>Delete</button></td></tr></tbody></table></div></section>
    <section className="generator-section"><div className="section-heading"><div><Sparkles size={17} color="var(--primary)" /><h2>Create a Report with Lulu AI</h2></div><Badge kind="ai" icon={<Sparkles size={11} />}>AI-generated</Badge></div><textarea value={prompt} onChange={e => setPrompt(e.target.value)} aria-label="Describe your report" /> <div className="suggestions">{suggestions.map(item => <button key={item} onClick={() => setPrompt(item)}>{item}</button>)}</div><button className="button accent" onClick={() => setGenerator(true)}><Sparkles size={15} /> Generate Report</button><div className="config-grid"><label>Report title<input defaultValue="Monthly Executive Report" /></label><label>Date range<button className="input-button">April 1 – 30, 2025 <ChevronDown size={14} /></button></label><fieldset><legend>Comparison</legend><label className="toggle"><input type="checkbox" defaultChecked /> Compare with March 2025</label></fieldset><fieldset><legend>Business areas</legend><div className="chip-row"><Badge kind="selected">Revenue</Badge><Badge kind="selected">Customers</Badge><Badge kind="selected">Advertising</Badge></div></fieldset><fieldset><legend>KPIs</legend><div className="chip-row"><Badge kind="neutral">Revenue</Badge><Badge kind="neutral">Customers</Badge><Badge kind="neutral">ROAS</Badge><Badge kind="neutral">CAC</Badge></div></fieldset><fieldset><legend>Charts</legend><div className="chip-row"><Badge kind="selected">Line</Badge><Badge kind="neutral">Bar</Badge><Badge kind="neutral">Pie</Badge></div></fieldset><fieldset className="switches"><legend>AI sections</legend><label><input type="checkbox" defaultChecked /> AI Insights</label><label><input type="checkbox" defaultChecked /> Recommendations</label><label><input type="checkbox" defaultChecked /> Opportunities</label><label><input type="checkbox" defaultChecked /> Risks</label></fieldset></div><div className="generator-actions"><button className="button accent" onClick={() => setGenerator(true)}>Generate Report</button><button className="button secondary">Cancel</button></div></section>
    <section className="templates-section" id="templates"><div className="section-heading"><div><Grid2X2 size={17} /><h2>Report Templates</h2></div><span className="muted">Start with a proven structure</span></div><div className="template-grid">{templates.map(template => <article className="template-card" key={template[0]}><span className="template-icon"><FileText size={17} /></span><h3>{template[0]}</h3><Badge kind="type">{template[1]}</Badge><p>{template[2]}</p><small>Required data · {template[3]}</small><div><button className="small-button">Preview</button><button className="button accent compact" onClick={() => setGenerator(true)}>Use Template</button></div></article>)}</div></section>
    {open && <section className="open-report"><div className="report-toolbar"><button className="link-button" onClick={() => setOpen(false)}>← Back to Reports</button><div><h2>Monthly Executive Report</h2><span><Status status="Ready" /> Updated 2h ago · <b className="fresh">● Fresh</b></span></div><div className="top-actions"><button className="button secondary">Edit</button><button className="button primary"><Sparkles size={14} /> Ask Lulu AI</button><button className="icon-button"><Share2 size={16} /></button><button className="icon-button"><Download size={16} /></button><button className="icon-button"><MoreHorizontal size={17} /></button></div></div><div className="report-layout"><article className="document"><header><div className="eyebrow">NORTHSTAR COMMERCE · BUSINESS INTELLIGENCE</div><h1>Monthly Executive Report</h1><p>April 1 to 30, 2025 <span>vs March 2025</span></p><div><Badge kind="ai" icon={<Sparkles size={11} />}>AI-generated</Badge><span className="doc-meta">7 connected sources · Generated today</span></div></header><section className="doc-section"><div className="doc-heading"><h3>Executive Summary</h3><Badge kind="ai" icon={<Sparkles size={11} />}>AI-generated</Badge></div><p>The business performed strongly in April. Revenue grew 14.8 percent compared with March, driven by increased customer acquisition and a higher average order value. Advertising efficiency declined and requires attention. Lulu AI identified three high-impact opportunities and two significant risks.</p><div className="status-pills"><Badge kind="ready" icon={<Check size={12} />}>Business Strong</Badge><Badge kind="ready" icon={<ArrowUpRight size={12} />}>Revenue +14.8%</Badge><Badge kind="attention" icon={<AlertTriangle size={12} />}>Advertising Attention Needed</Badge><Badge kind="attention" icon={<AlertTriangle size={12} />}>Focus Review advertising efficiency</Badge></div></section><section className="doc-section"><div className="doc-heading"><h3>Key Performance Indicators</h3><span className="muted">Observed · April 2025</span></div><div className="kpi-grid">{[['Revenue', '248,400 EUR', '+14.8%', 'Healthy'], ['Customers', '4,821', '+11.4%', 'Healthy'], ['ROAS', '3.6', '-14%', 'Attention Needed'], ['Conversion Rate', '2.97%', '+6.2%', 'Healthy'], ['CAC', '87 EUR', '+8.8%', 'Attention Needed'], ['Pipeline', '842K EUR', '+9.4%', 'Healthy']].map(kpi => <article className="kpi-card" key={kpi[0]}><span>{kpi[0]}</span><strong>{kpi[1]}</strong><b className={kpi[2].startsWith('-') || kpi[0] === 'CAC' ? 'negative-text' : 'positive-text'}>{kpi[2]}</b><Status status={kpi[3] === 'Healthy' ? 'Ready' : 'Draft'} /><div className="sparkline" /><button>Open in KPI Explorer <ChevronRight size={12} /></button></article>)}</div></section><section className="doc-section"><div className="doc-heading"><h3>Revenue Performance</h3><div className="chart-legend"><span><i className="legend-green" /> April</span><span><i className="legend-gray" /> March</span></div></div><TrendChart /><div className="callout"><Sparkles size={15} /><span><Badge kind="inferred">AI Inferred</Badge> Revenue growth driven by new customer acquisition (+492) plus a 3.2 percent AOV increase.</span></div></section><section className="doc-section"><div className="doc-heading"><h3>Advertising Performance</h3><Badge kind="observed">Observed</Badge></div><div className="table-wrap"><table><thead><tr><th>Platform</th><th>Spend</th><th>Revenue</th><th>ROAS</th><th>CPA</th><th>vs Prev.</th></tr></thead><tbody><tr><td><strong>Google Ads</strong></td><td>18,200</td><td>87,360</td><td>4.8</td><td>74 EUR</td><td className="positive-text">+8%</td></tr><tr><td><strong>Meta Ads</strong></td><td>14,600</td><td>37,788</td><td>2.6</td><td>103 EUR</td><td className="negative-text">-18%</td></tr><tr><td><strong>LinkedIn Ads</strong></td><td>10,000</td><td>28,932</td><td>2.9</td><td>94 EUR</td><td className="attention-text">-5%</td></tr><tr className="total"><td><strong>Total</strong></td><td>42,800</td><td>154,080</td><td>3.6</td><td>86 EUR</td><td>—</td></tr></tbody></table></div><div className="callout"><Sparkles size={15} /><span><Badge kind="inferred">AI Inferred</Badge> Google Ads significantly outperforming Meta Ads. Budget reallocation toward Google Ads is recommended.</span></div></section><section className="doc-section"><div className="doc-heading"><h3>AI Insights</h3><Badge kind="ai" icon={<Sparkles size={11} />}>AI-generated</Badge></div><div className="insight-grid"><article><h4>Advertising efficiency declining despite stable conversion volume</h4><p>Evidence: ROAS -14% · spend +8%</p><Badge kind="high">Impact High</Badge></article><article><h4>Customer acquisition accelerating beyond forecast</h4><p>Evidence: 492 new vs 410 forecast</p><Badge kind="high">Impact High</Badge></article></div></section><section className="doc-section two-col"><div><div className="doc-heading"><h3>Opportunities</h3><Badge kind="ai">AI Detected</Badge></div><article className="compact-insight"><strong>Scale efficient Google Ads campaigns</strong><a>View Opportunity →</a></article><article className="compact-insight"><strong>Improve new customer onboarding</strong><a>View Opportunity →</a></article></div><div><div className="doc-heading"><h3>Risks</h3><Badge kind="ai">AI Detected</Badge></div><article className="compact-insight risk"><strong>Meta Ads efficiency is declining</strong><button className="small-button">Investigate</button></article><article className="compact-insight risk"><strong>Acquisition costs rising</strong><button className="small-button">Investigate</button></article></div></section><section className="doc-section"><div className="doc-heading"><h3>AI Recommendations</h3><Badge kind="ai">AI Recommended</Badge></div><div className="recommendation"><strong>Reallocate budget toward Google Ads while monitoring volume</strong><button className="small-button">Review</button><button className="small-button">Create Task</button></div><div className="recommendation"><strong>Review Meta Ads creative and audience efficiency this week</strong><button className="small-button">Review</button><button className="small-button">Create Task</button></div></section><footer className="document-footer"><div><Badge kind="ready" icon={<Check size={12} />}>Shopify Connected Fresh</Badge><Badge kind="ready" icon={<Check size={12} />}>GA Connected Fresh</Badge><Badge kind="ready" icon={<Check size={12} />}>Google Ads Connected Fresh</Badge><Badge kind="ready" icon={<Check size={12} />}>Meta Ads Connected Fresh</Badge><Badge kind="ready" icon={<Check size={12} />}>CRM Connected Fresh</Badge></div><p><strong>Data Quality Good · 94%</strong> · AI-generated content is clearly labeled. Observed data sourced from connected platforms.</p></footer></article><aside className="report-aside"><section><h3>Ask Lulu AI to Modify</h3><input placeholder="What would you like to change?" />{['Add revenue growth', 'Compare with last year', 'Add advertising performance', 'Create executive summary', 'Add risks'].map(item => <button className="aside-chip" key={item}>{item}</button>)}<div><button className="button secondary">Preview</button><button className="button primary">Apply</button></div></section><section><h3>Ask About This Report</h3>{['What is the most important finding', 'What changed', 'What to do next'].map(item => <button className="link-button aside-question" key={item}><Sparkles size={13} /> {item}</button>)}</section><section><h3><History size={15} /> Version History</h3>{['v3 · today · AI regenerated', 'v2 · yesterday · edited', 'v1 · 3 days ago · created'].map(item => <div className="history-row" key={item}><span>{item}</span><button>View</button></div>)}</section><section><h3>Comments <Badge kind="neutral">1</Badge></h3><p className="comment"><strong>Sarah M · 2h ago</strong>ROAS decline needs board attention.</p><button className="link-button">Reply</button><button className="link-button">Resolve</button><input placeholder="Add Comment" /></section><section><h3>Report Activity</h3><p className="activity-line"><Check size={13} /> Created</p><p className="activity-line"><Share2 size={13} /> Shared</p><p className="activity-line"><RefreshCw size={13} /> Refreshed</p><p className="activity-line"><Sparkles size={13} /> AI regenerated</p></section><section><h3>Data Sources</h3>{['Shopify', 'Google Analytics', 'Google Ads', 'Meta Ads', 'CRM'].map(source => <p className="source-line" key={source}><i />{source}<small>Connected · Fresh</small></p>)}</section></aside></div></section>}
    {generator && <div className="modal-backdrop" role="dialog" aria-modal="true"><section className="generator-modal"><header><div><Badge kind="ai" icon={<Sparkles size={12} />}>AI report builder</Badge><h2>Building Your Report</h2></div><button className="icon-button" onClick={() => setGenerator(false)} aria-label="Close generator"><X size={18} /></button></header><p>Lulu AI is preparing the requested report from connected sources.</p><ol>{['Collecting relevant data', 'Selecting KPIs', 'Analyzing trends', 'Identifying important changes', 'Generating AI insights', 'Building report sections'].map(stage => <li key={stage}><span className="stage-dot" />{stage}<RefreshCw size={13} className="spin" /></li>)}</ol><button className="button secondary" onClick={() => setGenerator(false)}>Close</button></section></div>}
  </main></div>;
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
