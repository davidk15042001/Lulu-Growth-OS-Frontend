import * as React from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Brain, Check, ChevronDown, ChevronRight, CircleHelp, Database, Download, ExternalLink, Eye, Filter, Gauge, GitBranch, Heart, History, Layers3, LineChart, MoreHorizontal, Pause, Play, Plus, RefreshCw, Search, Settings2, Share2, Sparkles, Star, Target, Trash2, TrendingUp, Upload, Users, X, Zap } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type Kpi = {
  name: string;
  category: string;
  value: string;
  change: string;
  status: 'Healthy' | 'Excellent' | 'Stable' | 'Attention Needed';
  source: string;
  updated: string;
};
const kpis: Kpi[] = [];
const categories = ['Business', 'Revenue', 'Customers', 'Sales', 'Marketing', 'Advertising', 'Ecommerce', 'Finance', 'Operations', 'Products', 'AI'];
const recent: Array<Record<string, string>> = [];
const breakdown: Array<Record<string, string>> = [];
const segments: Array<Record<string, string>> = [];
const navAnalytics = ['KPI Explorer', 'Reports', 'Comparisons', 'Benchmarks', 'Forecasts', 'Trends', 'Anomalies', 'Attribution'];
function StatusBadge({
  status
}: {
  status: string;
}) {
  const Icon = status === 'Healthy' || status === 'Excellent' ? Check : status === 'Attention Needed' ? AlertTriangle : Activity;
  return <span className={`status status-${status.toLowerCase().replace(' ', '-')}`}><Icon size={12} /><span>{status}</span></span>;
}
function AiBadge({
  children = 'AI-generated'
}: {
  children?: string;
}) {
  return <span className="ai-badge"><Sparkles size={12} /><span>{children}</span></span>;
}
function Sidebar() {
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark">L</div><span>LULU <b>AI</b></span></div>
    <div className="workspace"><div className="workspace-icon">N</div><div><strong>Northstar Commerce</strong><small>Enterprise workspace</small></div><ChevronDown size={15} /></div>
    <LuluSectionNavigation activeId="swift-pool-5077" />
    <div className="sidebar-bottom"><a><Settings2 size={16} /><span>Settings</span></a><div className="user"><div className="avatar">AS</div><div><strong>Alex Smith</strong><small>Admin</small></div><MoreHorizontal size={16} /></div></div>
  </aside>;
}
function TrendChart({
  forecast = false
}: {
  forecast?: boolean;
}) {
  return <div className="chart-wrap"><div className="chart-legend"><span><i className="legend-green" /> Current period</span><span><i className="legend-gray" /> Previous period</span>{forecast && <span><i className="legend-blue" /> Forecast</span>}<span><i className="legend-target" /> Target —</span></div><svg className="trend-chart" viewBox="0 0 760 220" role="img" aria-label="Revenue Growth trend chart showing current period at 14.8 percent, previous period, target at 12 percent, and forecast">
    <path d="M40 184 H740 M40 140 H740 M40 96 H740 M40 52 H740" stroke="var(--border)" strokeWidth="1" /><path d="M40 140 H740" stroke="var(--border)" strokeDasharray="5 5" /><text x="10" y="144">—</text><text x="12" y="100">—</text><text x="12" y="56">—</text>
    <path d="M40 166 C85 157 100 148 126 151 S178 138 204 145 S260 126 286 134 S340 116 370 124 S420 102 446 113 S498 92 528 103 S570 76 602 91 S652 62 680 79 S716 56 740 66" fill="none" stroke="var(--chart-4)" strokeWidth="4" strokeLinecap="round" />
    <path d="M40 175 C90 170 112 168 146 171 S200 155 232 162 S280 148 315 155 S365 139 395 145 S450 131 480 139 S530 122 562 130 S615 110 650 121 S704 102 740 110" fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="7 7" />
    {forecast && <path d="M600 91 C640 77 670 80 700 64 S725 61 760 48" fill="none" stroke="var(--chart-3)" strokeWidth="3" strokeDasharray="6 6" />}
    <path d="M40 181 L740 181" stroke="var(--border)" strokeDasharray="3 5" />
    <circle cx="286" cy="134" r="5" fill="var(--chart-1)" /><circle cx="528" cy="103" r="5" fill="var(--chart-1)" />
    <text x="35" y="210">Not available</text><text x="188" y="210">Not available</text><text x="350" y="210">Not available</text><text x="510" y="210">Not available</text><text x="680" y="210">Not available</text>
  </svg></div>;
}
function KpiDetail({
  onCreateTask
}: {
  onCreateTask: () => void;
}) {
  const [tab, setTab] = React.useState('Daily');
  const [compare, setCompare] = React.useState(true);
  const [forecast, setForecast] = React.useState(false);
  const [selectedSegment, setSelectedSegment] = React.useState('New Customers');
  return <main className="detail-panel">
    <header className="detail-head"><div><div className="eyebrow">REVENUE / REVENUE INTELLIGENCE</div><h2>Revenue Growth</h2><div className="meta"><span>Category: Revenue</span><span>Source: Shopify</span><span>Updated 8 min ago</span><span className="fresh"><span />Fresh</span></div></div><div className="head-actions"><button className="icon-button" aria-label="Favorite"><Star size={17} /></button><button className="icon-button" aria-label="Share"><Share2 size={17} /></button><button className="icon-button" aria-label="Export"><Download size={17} /></button><button className="button primary"><Sparkles size={15} /> Ask Lulu AI</button><button className="icon-button"><MoreHorizontal size={18} /></button></div></header>
    <section className="value-strip"><div><strong className="hero-value">—</strong><span className="positive"><ArrowUpRight size={17} /> +5.6pp vs previous period</span></div><StatusBadge status="Healthy" /></section>
    <section className="card definition"><div className="section-title"><h3>What is this KPI?</h3><span className="tag">Calculated</span></div><p>Revenue Growth measures the percentage change in total revenue compared with the selected comparison period.</p><code>Revenue Growth = (Current Revenue - Previous Revenue) / Previous Revenue</code><div className="definition-grid"><span><b>Period</b>Last 30 Days</span><span><b>Unit</b>%</span><span><b>Directionality</b>Higher is better</span><span><b>Data source</b>Shopify</span></div><div className="tags"><span className="tag">Observed</span><span className="tag">Calculated</span></div></section>
    <section className="card performance"><div className="section-title"><h3>Current Performance</h3><span className="muted">Last 30 Days</span></div><div className="performance-grid"><div><small>Current</small><strong className="positive-text">—</strong></div><div><small>Previous</small><strong>—</strong></div><div><small>Change</small><strong className="positive-text">+5.6pp</strong></div><div><small>Status</small><StatusBadge status="Healthy" /></div></div><div className="target-row"><span>Target <b>—</b></span><span>Current <b>—</b></span><span className="positive"><Check size={15} /> Above Target</span></div></section>
    <section className="card chart-card"><div className="section-title"><div><h3>KPI Trend</h3><p className="muted">Revenue Growth over the last 30 days</p></div><div className="chart-controls"><button className={compare ? 'control active' : 'control'} onClick={() => setCompare(!compare)}>Compare Period</button><button className="control">Target</button><button className={forecast ? 'control active' : 'control'} onClick={() => setForecast(!forecast)}>Forecast</button></div></div><div className="tabs">{['Daily', 'Weekly', 'Monthly', 'Quarterly'].map(item => <button key={item} className={tab === item ? 'tab active' : 'tab'} onClick={() => setTab(item)}>{item}</button>)}</div><TrendChart forecast={forecast} /></section>
    <section className="card"><div className="section-title"><h3>Comparison</h3><span className="muted">Compare against</span></div><div className="tabs comparison-tabs">{['Previous Period', 'Previous Year', 'Target', 'Benchmark', 'Another KPI', 'Custom'].map(item => <button key={item} className={item === 'Previous Period' ? 'tab active' : 'tab'}>{item}</button>)}</div><div className="callout"><TrendingUp size={18} /><span>Revenue Growth <b>(—)</b> is outpacing Customer Growth <b>(—)</b> by <strong>3.4pp</strong></span></div></section>
    <section className="card"><div className="section-title"><h3>Breakdown</h3><button className="select-button">Channel <ChevronDown size={14} /></button></div><div className="bars">{breakdown.map(item => <div className="bar-row" key={item.name}><span>{item.name}</span><div className="bar-track"><div style={{
              width: item.width,
              background: item.color
            }} /></div><strong>{item.value}</strong><span className="change-badge">+{item.name === 'Direct' ? '4.2' : item.name === 'Organic' ? '3.8' : '2.1'}pp</span></div>)}</div></section>
    <section className="card"><div className="section-title"><h3>Segment Analysis</h3><div className="tabs">{['New Customers', 'Returning Customers', 'Enterprise', 'SMB'].map(item => <button key={item} className={selectedSegment === item ? 'tab active' : 'tab'} onClick={() => setSelectedSegment(item)}>{item}</button>)}</div></div><div className="table-wrap"><table><thead><tr><th>Segment</th><th>Revenue</th><th>Contribution</th><th>Growth</th><th>Share</th></tr></thead><tbody>{segments.map(item => <tr key={item.name}><td><strong>{item.name}</strong></td><td>{item.revenue}</td><td>{item.contribution}</td><td className="positive-text">{item.growth}</td><td>{item.share}</td></tr>)}</tbody></table></div></section>
    <section className="split-cards"><div className="card contribution"><div className="section-title"><h3>Contribution Analysis</h3><span className="tag">Observed</span></div><div className="donut"><div><strong>248K</strong><small>EUR revenue</small></div></div><div className="legend-list"><span><i style={{
              background: 'var(--chart-4)'
            }} />Google Ads <b>—</b></span><span><i style={{
              background: 'var(--chart-4)'
            }} />Organic <b>—</b></span><span><i style={{
              background: 'var(--primary)'
            }} />Direct <b>—</b></span><span><i style={{
              background: 'var(--muted)'
            }} />Meta Ads <b>—</b></span></div><p className="muted">Observed — Platform data</p></div><div className="card"><div className="section-title"><h3>Target Tracking</h3><span className="status status-healthy"><Check size={12} /> Above Target</span></div><div className="target-large"><strong>—</strong><span>vs Target —</span></div><div className="progress"><div /></div><div className="target-foot"><span>Variance <b className="positive-text">+2.8pp above</b></span><span className="tag">User defined</span></div></div></section>
    <section className="card drivers"><div className="section-title"><h3>KPI Drivers</h3><AiBadge /></div><div className="driver-columns"><div className="driver-column positive-border"><h4>Positive Drivers</h4>{[['Customer growth', 'High', '+11.4%', 'New Customers'], ['AOV', 'Medium', '+3.2%', 'Product Mix'], ['Conversion Rate', 'Medium', '+6.2%', 'Ecommerce']].map(d => <div className="driver" key={d[0]}><div><strong>{d[0]}</strong><span className="muted">Supporting KPI: {d[3]}</span></div><span className="impact">{d[1]}</span><b className="positive-text">{d[2]}</b><button className="link-button">Explore Driver <ExternalLink size={13} /></button></div>)}</div><div className="driver-column negative-border"><h4>Negative Drivers</h4>{[['Customer churn', 'Low', '3.2%', 'Retention'], ['Advertising efficiency', 'Medium', 'ROAS -14%', 'ROAS']].map(d => <div className="driver" key={d[0]}><div><strong>{d[0]}</strong><span className="muted">Supporting KPI: {d[3]}</span></div><span className="impact risk">{d[1]}</span><b className="negative-text">{d[2]}</b><button className="link-button">Explore Driver <ExternalLink size={13} /></button></div>)}</div></div></section>
    <section className="card"><div className="section-title"><h3>Driver Tree</h3><span className="muted">Click a node to explore</span></div><div className="driver-tree"><button className="tree-root">Revenue Growth <b>—</b></button><div className="tree-branches"><button>Customers <b>—</b><small>New · Returning</small></button><button>Conversion Rate <b>—</b><small>Correlation</small></button><button>AOV <b>—</b><small>Product Mix · Pricing</small></button></div></div><div className="tree-legend"><span><i className="solid-line" /> Known Driver</span><span><i className="dash-line" /> Correlation</span><span><i className="dot-line" /> AI Inference <AiBadge /></span></div></section>
    <section className="card"><div className="section-title"><h3>Related KPIs</h3><button className="link-button">View all <ChevronRight size={14} /></button></div><div className="related-row">{[['Customers', '4,821', 'Driver', '+11.4%'], ['Conversion Rate', '2.97%', 'Correlation', '+6.2%'], ['AOV', '51.53 EUR', 'Correlation', '+3.2%'], ['Ad Spend', '42.8K EUR', 'Correlation', '+8%'], ['ROAS', '3.6', 'Correlation', '-14%']].map(item => <article className="related-card" key={item[0]}><span className="tag">{item[2]}</span><strong>{item[0]}</strong><b>{item[1]}</b><span className={item[3].startsWith('-') ? 'negative-text' : 'positive-text'}>{item[3]}</span><button className="small-button">Open</button></article>)}</div></section>
    <section className="card ai-panel"><div className="section-title"><h3>Lulu AI KPI Analysis</h3><AiBadge /></div><p>Revenue growth accelerated during the selected period, primarily alongside increased customer acquisition and a higher average order value. Advertising spend increased, but ROAS declined, suggesting acquisition efficiency may face pressure.</p><div className="ai-grid"><div><b>Key drivers</b><span>Customer acquisition · AOV</span></div><div><b>Important changes</b><span>ROAS declined —</span></div><div><b>Risks</b><span>Acquisition efficiency pressure</span></div><div><b>Opportunities</b><span>Scale direct and organic</span></div></div></section>
    <section className="split-cards"><div className="card anomalies"><div className="section-title"><h3>AI-Detected Anomalies</h3><AiBadge>AI Detected</AiBadge></div>{[['Day 14', 'Revenue -18% below expected', '6,240 EUR vs 7,610 EUR', 'Medium', '89%', 'Weekend traffic pattern'], ['Day 22', 'Conversion spike +24%', 'Observed movement', 'Low', '84%', 'Promotional event']].map(a => <article className="anomaly" key={a[0]}><span className="date-badge">{a[0]}</span><div><strong>{a[1]}</strong><span className="muted">{a[2]} · {a[5]}</span><div className="anomaly-foot"><span className="impact risk">{a[3]}</span><span>Confidence {a[4]}</span><button className="link-button">Investigate</button></div></div></article>)}</div><div className="card forecast"><div className="section-title"><h3>KPI Forecast</h3><span className="forecast-badge"><Zap size={12} /> AI Forecast</span></div><div className="tabs">{['7 Days', '30 Days', '90 Days'].map(item => <button key={item} className={item === '30 Days' ? 'tab active' : 'tab'}>{item}</button>)}</div><TrendChart forecast /><strong className="forecast-value">—</strong><p className="muted">Range — to +15.6% · Estimated · 90 days history</p></div></section>
    <section className="card recommendations"><div className="section-title"><h3>AI Recommendations</h3><AiBadge>AI Recommended</AiBadge></div>{[['Increase investment in high-performing acquisition channels', 'High priority', '+492 new customers'], ['Optimize advertising budget allocation to protect revenue growth', 'High priority', 'ROAS -14%']].map(r => <article className="recommendation" key={r[0]}><div className="rec-icon"><Sparkles size={16} /></div><div><strong>{r[0]}</strong><span className="muted">Evidence: {r[2]}</span></div><span className="impact risk">{r[1]}</span><button className="small-button">Review</button><button className="small-button">Create Task</button><button className="button primary compact">Execute with AI</button></article>)}</section>
    <section className="card task-panel"><div className="section-title"><h3>Create Task from KPI</h3><button className="button secondary" onClick={onCreateTask}><Plus size={15} /> Create Task</button></div><p className="muted">Turn this KPI insight into an accountable action. Confirmation required.</p></section>
    <section className="lower-grid"><div className="card"><div className="section-title"><h3>KPI Alerts</h3><button className="link-button"><Plus size={14} /> Create Alert</button></div><div className="alert-row"><Bell size={16} /><span>Revenue Growth falls below —</span><span className="status status-healthy"><span />Active</span><button className="link-button">Edit</button><button className="link-button">Pause</button><button className="link-button"><Trash2 size={14} /></button></div></div><div className="card"><div className="section-title"><h3>KPI Watchlist</h3><button className="link-button"><Plus size={14} /> Add</button></div>{[['Revenue Growth', 'Healthy', '8 min'], ['ROAS', 'Attention Needed', '8 min'], ['CAC', 'Attention Needed', '8 min']].map(w => <div className="watch-row" key={w[0]}><Star size={14} fill="currentColor" /><strong>{w[0]}</strong><StatusBadge status={w[1]} /><span className="muted">{w[2]}</span><button className="link-button">Remove</button></div>)}</div></section>
    <section className="card"><div className="section-title"><h3>Data Sources & Quality</h3><span className="status status-healthy"><Check size={12} /> Good</span></div><div className="source-grid"><div><strong><Database size={15} /> Shopify</strong><span>Connected · 8 min · —</span><small>Primary contribution to KPI</small></div><div><strong><Database size={15} /> Google Analytics</strong><span>Connected · 15 min · —</span><small>Supporting data</small></div><div><strong><Database size={15} /> Google Ads</strong><span>Connected · 8 min · —</span><small>Advertising contribution</small></div></div><div className="quality-row"><span><b>Coverage</b>—</span><span><b>Freshness</b>Fresh</span><span><b>Completeness</b>—</span><span><b>Reliability</b>High</span><span><b>Missing</b>None</span></div></section>
    <section className="card"><div className="section-title"><h3>Historical Events</h3><span className="muted">Last 30 days</span></div><div className="timeline">{[['Day 8', 'Google Ads campaign launched', 'Revenue Growth · ROAS', 'Observed'], ['Day 15', 'Price adjustment -5% on Product B', 'AOV · Conversion', 'Observed'], ['Day 22', 'Promotional event', 'Conversion · Revenue', 'AI Inferred']].map(e => <div className="timeline-item" key={e[0]}><span className="timeline-dot" /><span className="date-badge">{e[0]}</span><div><strong>{e[1]}</strong><span className="muted">{e[2]}</span></div><span className="tag">{e[3]}</span></div>)}</div></section>
    <section className="card"><div className="section-title"><h3>KPI Relationships</h3><span className="muted">Navigate connected intelligence</span></div><div className="relationship-flow">{['Revenue Growth', 'Conversion Rate', 'Customers', 'AOV', 'Ad Spend', 'ROAS'].map((item, index) => <button key={item} className={index === 0 ? 'relationship active' : 'relationship'}>{item}{index < 5 && <ChevronRight size={14} />}</button>)}</div></section>
    <section className="ask-ai"><div className="ask-title"><div className="ai-orb"><Sparkles size={18} /></div><div><h3>Ask Lulu AI</h3><p>Explore this KPI with natural language.</p></div></div><div className="ask-input"><input aria-label="Ask anything about this KPI" placeholder="Ask anything about this KPI..." /><button aria-label="Send question"><ArrowUpRight size={17} /></button></div><div className="suggestions">{['Why did this KPI change?', 'What is driving it?', 'What should I do?', 'Is this significant?', 'What happens next?', 'Which KPIs should I investigate?'].map(s => <button key={s}>{s}</button>)}</div></section>
  </main>;
}
export function LuluKpiExplorer() {
  const [search, setSearch] = React.useState('');
  const [taskOpen, setTaskOpen] = React.useState(false);
  const [active, setActive] = React.useState('');
  const { items: kpiRecords, loading, error, refresh } = useLiveRecords('kpis');
  const filtered = kpis.filter(k => k.name.toLowerCase().includes(search.toLowerCase()));
  const filteredLive = kpiRecords.filter(record => !search || `${record.name} ${record.description ?? ''} ${record.status}`.toLowerCase().includes(search.toLowerCase()));
  if (loading) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground">Loading live KPIs…</main>;
  if (error) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-destructive">{error}</main>;
  if (!loading && !error) return <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10"><div className="mx-auto max-w-6xl"><header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs uppercase tracking-[.18em] text-muted-foreground">Intelligence / KPI Explorer</p><h1 className="mt-2 text-3xl font-bold">KPI Explorer</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Verified KPI definitions from the connected workspace. Values, changes and status appear only when returned by the backend.</p></div><button type="button" onClick={() => void refresh()} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-secondary"><RefreshCw size={15} /> Refresh</button></header>{kpiRecords.length === 0 ? <section className="rounded-2xl border border-dashed border-border bg-card p-10 text-center"><Gauge className="mx-auto mb-4 text-muted-foreground" size={30} /><h2 className="text-xl font-semibold">No verified KPIs yet</h2><p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">Connect and analyze a verified data source before reviewing KPI values, comparisons or forecasts.</p></section> : <section className="overflow-hidden rounded-2xl border border-border bg-card"><div className="border-b border-border p-4"><label className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2"><Search size={15} className="text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search live KPIs" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">KPI</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Updated</th></tr></thead><tbody className="divide-y divide-border">{filteredLive.map(record => <tr key={record.id}><td className="px-4 py-3 font-medium">{record.name}</td><td className="px-4 py-3">{record.status}</td><td className="px-4 py-3 text-muted-foreground">{record.stage ?? '—'}</td><td className="max-w-md px-4 py-3 text-muted-foreground">{record.description ?? '—'}</td><td className="px-4 py-3 text-muted-foreground">{new Date(record.updatedAt).toLocaleString()}</td></tr>)}</tbody></table></div></section>}</div></main>;
  return <div className="app-shell"><Sidebar /><div className="page"><header className="page-header"><div><div className="breadcrumbs"><span>Intelligence</span><ChevronRight size={13} /><span>Analytics</span><ChevronRight size={13} /><b>KPI Explorer</b></div><h1>KPI Explorer</h1><p>Explore, analyze and understand the metrics that drive your business.</p></div><div className="top-actions"><button className="button primary"><Sparkles size={15} /> Ask Lulu AI</button><button className="button secondary">Create Report</button><button className="button ghost"><Download size={15} /> Export</button><button className="icon-button"><RefreshCw size={16} /></button></div></header><div className="datebar"><button className="date-button">Last 30 Days <ChevronDown size={15} /></button><label className="toggle-label"><input type="checkbox" defaultChecked /> Compare</label><span className="date-divider" />{['Category', 'Data Source', 'Status', 'Trend', 'Favorite', 'AI Detected Change'].map(f => <button className="filter-chip" key={f}><Filter size={12} /> {f}</button>)}</div><div className="workspace"><aside className="discovery"><div className="panel-title"><div><span className="eyebrow">DISCOVER</span><h2>KPI Library</h2></div><button className="icon-button"><Upload size={16} /></button></div><div className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search revenue, customers, ROAS..." /><kbd>/</kbd></div><section className="discovery-section"><div className="section-title"><h3>Favorites</h3><span className="muted">3</span></div>{[['Revenue Growth', '+14.8%'], ['ROAS', '3.6'], ['Customer Retention', '87%']].map(f => <div className="favorite-row" key={f[0]}><Star size={15} fill="var(--foreground)" color="var(--foreground)" /><button onClick={() => setActive(f[0])}><strong>{f[0]}</strong><span className={f[0] === 'ROAS' ? 'negative-text' : 'positive-text'}>{f[1]}</span></button><button className="tiny-action" aria-label={`Remove ${f[0]}`}>×</button></div>)}</section><section className="discovery-section"><div className="section-title"><h3>Recently Viewed</h3><button className="link-button">Clear</button></div>{recent.map(r => <button className="recent-row" key={r.name} onClick={() => setActive(r.name)}><Eye size={14} /><span><strong>{r.name}</strong><small>{r.time}</small></span><b>{r.value}</b></button>)}</section><section className="discovery-section categories"><div className="section-title"><h3>KPI Categories</h3><button className="link-button">Expand</button></div>{categories.map((c, i) => <button className="category-row" key={c}><ChevronRight size={14} /><span>{c}</span><span className="count">{[42, 18, 24, 16, 20, 14, 19, 12, 16, 21, 8][i]}</span></button>)}</section><section className="library"><div className="section-title"><h3>KPI Library</h3><span className="muted">{filtered.length} metrics</span></div><div className="library-table"><div className="library-head"><span>KPI name</span><span>Value</span><span>Change</span></div>{filtered.map(k => <button className={active === k.name ? 'library-row selected' : 'library-row'} key={k.name} onClick={() => setActive(k.name)}><span><strong>{k.name}</strong><small>{k.category} · {k.source}</small></span><b>{k.value}</b><span className={k.change.startsWith('-') ? 'negative-text' : 'positive-text'}>{k.change}</span><StatusBadge status={k.status} /></button>)}</div></section></aside><KpiDetail onCreateTask={() => setTaskOpen(true)} /></div></div>{taskOpen && <div className="task-drawer"><div className="section-title"><h3>Create Task</h3><button className="icon-button" onClick={() => setTaskOpen(false)}><X size={17} /></button></div><label>Task name<input defaultValue="Review Revenue Growth drivers" /></label><label>Owner<input defaultValue="Alex Smith" /></label><label>Priority<select defaultValue="High"><option>High</option><option>Medium</option><option>Low</option></select></label><label>Description<textarea defaultValue="Review ad budget allocation based on ROAS decline and Revenue Growth performance." /></label><div className="drawer-actions"><button className="button secondary" onClick={() => setTaskOpen(false)}>Cancel</button><button className="button primary" onClick={() => setTaskOpen(false)}>Create Task</button></div></div>}</div>;
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
    "id": "sparklingly-moon-5114",
    "label": "SEO"
  }, {
    "id": "zealously-path-4224",
    "label": "GEO"
  }, {
    "id": "sunny-house-9595",
    "label": "AEO"
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
