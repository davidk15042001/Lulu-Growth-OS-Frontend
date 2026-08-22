import { useState } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, Bell, ChevronDown, ChevronRight, CircleHelp, Download, FileText, LayoutDashboard, Menu, MoreHorizontal, Package, RefreshCw, Search, Settings, Sparkles, Target, Users, WalletCards, X } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type Tone = 'up' | 'down' | 'neutral';
const kpis: Array<Record<string, any>> = [];
const trend: Array<Record<string, any>> = [];
const contributions: Array<Record<string, any>> = [];
const channels: Array<Record<string, any>> = [];
const funnel: Array<Record<string, any>> = [];
const segments: Array<Record<string, any>> = [];
const tableKpis: Array<Record<string, any>> = [];
const accordionData: Array<{ title: string; summary: string; items: string[] }> = [];
const nav = [{
  label: 'Overview',
  icon: LayoutDashboard
}, {
  label: 'Business Intelligence',
  icon: BarChart3,
  active: true
}, {
  label: 'Customers',
  icon: Users
}, {
  label: 'Products',
  icon: Package
}, {
  label: 'Finance',
  icon: WalletCards
}];
function ToneIcon({
  tone
}: {
  tone: Tone;
}) {
  return tone === 'down' ? <ArrowDownRight size={14} /> : tone === 'up' ? <ArrowUpRight size={14} /> : <Activity size={14} />;
}
function Tag({
  children,
  kind = 'calc'
}: {
  children: string;
  kind?: string;
}) {
  return <span className={`tag ${kind}`}>{children}</span>;
}
export const LuluGrowth = () => {
  const { items: growthRecords, loading: growthLoading, error: growthError } = useLiveRecords('business_growth');
  const [mobileNav, setMobileNav] = useState(false);
  const [expanded, setExpanded] = useState<string[]>(['Revenue Growth', 'Customer Growth']);
  const [granularity, setGranularity] = useState('Daily');
  const [explain, setExplain] = useState(false);
  const [segment, setSegment] = useState('Channel');
  const toggle = (title: string) => setExpanded(prev => prev.includes(title) ? prev.filter(x => x !== title) : [...prev, title]);
  if (growthLoading) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground">Loading live growth data…</main>;
  if (growthError) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-destructive">{growthError}</main>;
  if (growthRecords.length === 0) return <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10"><div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-border bg-card p-8 text-center"><TrendingUp className="mx-auto mb-4 text-muted-foreground" size={28} /><h1 className="text-2xl font-semibold">Growth</h1><p className="mt-3 text-sm text-muted-foreground">No live growth data is available yet. Connect verified CRM, commerce or marketing sources before reviewing growth metrics.</p></div></main>;
  return <main className="app-shell">
  <aside className={mobileNav ? 'sidebar mobile-open' : 'sidebar'}><div className="brand"><div className="brand-mark">✦</div><span>Lulu AI</span><strong>GROWTH</strong><button className="close-nav" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18} /></button></div><p className="workspace">WORKSPACE</p><LuluSectionNavigation activeId="sharp-current-9677" /><div className="sidebar-bottom"><button className="nav-item"><Settings size={17} /><span>Settings</span></button><div className="profile"><div className="avatar">AR</div><div><strong>Alex Rivera</strong><small>Administrator</small></div><MoreHorizontal size={17} /></div></div></aside>
  <section className="main-content"><header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumbs"><span>Intelligence</span><ChevronRight size={14} /><span>Business Intelligence</span><ChevronRight size={14} /><strong>Growth</strong></div><div className="top-actions"><button className="icon-btn" aria-label="Search"><Search size={18} /></button><button className="icon-btn" aria-label="Notifications"><Bell size={18} /><i></i></button><div className="top-avatar">AR</div></div></header>
  <div className="page-wrap"><div className="page-heading"><div><p className="eyebrow">BUSINESS INTELLIGENCE</p><h1>Growth</h1><p className="subtitle">Understand how your business is growing, where growth comes from, and how efficiently it is being generated.</p></div><div className="header-buttons"><button className="select-btn">Last 30 Days <ChevronDown size={15} /></button><button className="select-btn">vs Previous Period <ChevronDown size={15} /></button><button className="primary-btn"><Sparkles size={16} />Ask Lulu AI</button><button className="ghost-btn"><RefreshCw size={16} />Refresh</button><button className="ghost-btn"><FileText size={16} />Create Report</button><button className="ghost-btn"><Download size={16} />Export <ChevronDown size={14} /></button></div></div>
   <section><SectionTitle title="Growth Overview" label="Measured business performance" /><div className="kpi-grid">{kpis.map(k => <article className="kpi-card" key={k.name}><div className="card-top"><span>{k.name}</span><Tag kind={k.label === 'Observed' ? 'observed' : 'calc'}>{k.label}</Tag></div><div className="kpi-value">{k.value}</div><div className={k.tone === 'down' ? 'trend down' : k.tone === 'up' ? 'trend up' : 'trend neutral'}><ToneIcon tone={k.tone as Tone} /><span>{k.trend}</span></div><p className="muted">{k.detail}</p></article>)}</div></section>
   <section className="three-col"><article className="panel rate-panel"><SectionTitle title="Overall Growth Rate" label="Observed" /><div className="hero-number">—</div><strong className="label-text">Revenue Growth</strong><div className="stat-list"><span>Previous Period <b>—</b></span><span>Previous Year <b>—</b></span><span>Absolute Change <b>+—</b></span></div><p className="note">Revenue growth is the primary growth indicator for the selected period.</p></article><article className="panel chart-panel"><div className="panel-heading"><div><h2>Growth Trend</h2><p>Revenue growth rate over time</p></div><Tag>Calculated</Tag></div><div className="chart-tabs">{['Daily', 'Weekly', 'Monthly'].map(x => <button key={x} className={granularity === x ? 'selected' : ''} onClick={() => setGranularity(x)}>{x}</button>)}</div><div className="chart-wrap" aria-label="Growth trend chart showing current, previous period and previous year growth"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend}><defs><linearGradient id="violetFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={.42} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="var(--foreground)" vertical={false} /><XAxis dataKey="day" stroke="var(--muted-foreground)" tick={{
                    fontSize: 11
                  }} /><YAxis stroke="var(--muted-foreground)" tick={{
                    fontSize: 11
                  }} unit="%" /><Tooltip contentStyle={{
                    background: 'var(--background)',
                    border: '1px solid var(--muted-foreground)',
                    borderRadius: 8
                  }} /><Area type="monotone" dataKey="current" stroke="var(--foreground)" fill="url(#violetFill)" strokeWidth={2.5} /><Line type="monotone" dataKey="previous" stroke="var(--muted-foreground)" strokeDasharray="5 5" /><Line type="monotone" dataKey="last" stroke="var(--muted-foreground)" strokeDasharray="2 4" /></AreaChart></ResponsiveContainer></div><div className="chart-legend"><span><i className="dot violet" />Current period</span><span><i className="dot gray" />Previous period</span><span><i className="dot slate" />Previous year</span><b className="status up">↑ Accelerating</b></div></article><article className="panel momentum"><div className="panel-heading"><div><h2>Growth Momentum</h2><p>Calculated from observed trends</p></div><Tag kind="observed">Calculated</Tag></div><div className="momentum-status">Accelerating <ArrowUpRight size={20} /></div><div className="momentum-stats"><span>Current growth rate <b>—</b></span><span>Previous growth rate <b>—</b></span><span>Change in growth rate <b className="positive">+7.2pp ↑</b></span></div><div className="momentum-bar"><span></span></div><p className="note">Revenue growth increased from — to 18.4% compared with the previous period.</p></article></section>
   <section className="panel contribution"><SectionTitle title="Growth Contribution" label="Calculated" /><div className="contribution-layout"><div><div className="stacked-bar">{contributions.map(c => <span key={c.name} style={{
                  width: c.share,
                  background: c.color
                }} title={`${c.name}: ${c.share}`}></span>)}</div><div className="contribution-list">{contributions.map(c => <div className="contribution-row" key={c.name}><span className="legend-name"><i style={{
                      background: c.color
                    }}></i>{c.name}</span><b>{c.amount}</b><span>{c.share} of growth</span><span className="positive">{c.rate} ↑</span></div>)}</div></div><div className="donut"><ResponsiveContainer width="100%" height={150}><PieChart><Pie data={contributions} dataKey="share" nameKey="name" innerRadius={43} outerRadius={60} paddingAngle={3}>{contributions.map(c => <Cell key={c.name} fill={c.color} />)}</Pie></PieChart></ResponsiveContainer><strong>+—</strong><small>Total growth</small></div></div></section>
   <section><SectionTitle title="Growth Dimensions" label="Measurement by business area" /><div className="accordions">{accordionData.map(a => <article className={expanded.includes(a.title) ? 'accordion open' : 'accordion'} key={a.title}><button className="accordion-head" onClick={() => toggle(a.title)} aria-expanded={expanded.includes(a.title)}><span className="accordion-title"><ChevronRight size={17} /><strong>{a.title}</strong></span><span className="accordion-summary">{a.summary}</span><Tag kind={a.title === 'Sales Growth' ? 'partial' : 'observed'}>{a.title === 'Sales Growth' ? 'Partial data' : 'Observed'}</Tag></button>{expanded.includes(a.title) ? <div className="accordion-body">{a.items.map(item => <div className="dimension-item" key={item}><span>{item.split('  ')[0]}</span><strong>{item.split('  ').slice(1).join('  ')}</strong></div>)}{a.title === 'Revenue Growth' ? <div className="mini-bars"><span style={{
                    width: '84%'
                  }}>Core Bundle <b>—</b></span><span style={{
                    width: '63%'
                  }}>Pro Plan <b>—</b></span><span style={{
                    width: '48%'
                  }}>Starter <b>—</b></span></div> : null}</div> : null}</article>)}</div></section>
   <section className="panel"><SectionTitle title="Channel Growth" label="Observed" /><DataTable headers={['Channel', 'Revenue', 'Customers', 'Leads', 'Conversion', 'Growth Rate']} rows={channels.map(c => [c.name, c.rev, c.customers, c.leads, c.conversion, c.growth])} /></section>
   <section className="three-col lower-cards"><article className="panel"><div className="panel-heading"><h2>Growth Quality</h2><Tag>Calculated</Tag></div><div className="quality-score">High Quality Growth <span>◎</span></div>{['Recurring vs One-Time|52% recurring ↑|Positive', 'New vs Existing Customer|40% new / 60% existing|Balanced', 'Organic vs Paid|54% organic ↑|Improving', 'Margin Impact|Positive (+1.3pp)|Positive', 'Retention-Supported Growth|Yes (87.2% retention)|Strong'].map(row => {
              const p = row.split('|');
              return <div className="quality-row" key={p[0]}><span>{p[0]}</span><b>{p[1]}</b><em>{p[2]}</em></div>;
            })}<p className="note">Growth quality is an analytical classification based on measured dimensions.</p></article><article className="panel"><div className="panel-heading"><h2>Growth Efficiency</h2><Tag>Calculated</Tag></div>{['Revenue per —arketing Spend|—|+14.2%', 'Revenue per — Ad Spend|—|-20%', 'Customer Growth per — CAC|20.8 customers|+8.4%', 'Profit per — Operating Cost|—|+3.1%'].map(row => {
              const p = row.split('|');
              return <div className="eff-row" key={p[0]}><span>{p[0]}<small>Formula shown in metric detail</small></span><b>{p[1]}</b><em className={p[2].startsWith('-') ? 'negative' : 'positive'}>{p[2]}</em></div>;
            })}<p className="note">Each efficiency metric formula is shown above.</p></article><article className="panel"><div className="panel-heading"><h2>Growth Concentration</h2><Tag>Calculated</Tag></div>{['Customer Concentration|Top 10 customers = 28% of revenue|Moderate', 'Product Concentration|Top product = 34% of revenue|Moderate', 'Channel Concentration|Organic = 33%|Balanced', 'Geographic Concentration|Top market = 61%|Moderate-High', 'Platform Dependency|Google Ads 58% of paid spend|High'].map(row => {
              const p = row.split('|');
              return <div className="quality-row" key={p[0]}><span>{p[0]}</span><b>{p[1]}</b><em>{p[2]}</em></div>;
            })}</article></section>
   <section className="two-col"><article className="panel"><SectionTitle title="New vs Existing Growth" label="Observed / Calculated" /><div className="split-metrics"><div><strong>—</strong><span>New customer revenue <b>—</b></span></div><div><strong>—</strong><span>Existing customer revenue <b>—</b></span></div></div><div className="compare-bars"><span className="new" style={{
                width: '28%'
              }}>New</span><span className="existing" style={{
                width: '72%'
              }}>Existing</span></div><p className="muted">Expansion revenue <strong>—</strong> · upsell from existing</p></article><article className="panel"><SectionTitle title="Organic vs Paid Growth" label="Observed" />{['Organic Traffic|23.1K|+18.2%', 'Paid Traffic|19.7K|+2.4%', 'Organic Revenue|—|+21.4%', 'Paid Revenue|—|-0.8%', 'Organic Customers|1,120|+8.1%'].map(row => {
              const p = row.split('|');
              return <div className="metric-bar" key={p[0]}><span>{p[0]}</span><b>{p[1]}</b><em className={p[2].startsWith('-') ? 'negative' : 'positive'}>{p[2]} ↑</em><i style={{
                  width: p[2].startsWith('-') ? '20%' : '76%'
                }}></i></div>;
            })}</article></section>
   <section className="panel funnel-panel"><SectionTitle title="Growth Funnel" label="Observed / Calculated" /><div className="funnel">{funnel.map((f, i) => <div className="funnel-stage" key={f.title}><span className="stage-number">{i + 1}</span><div className="stage-shape" style={{
                width: `${100 - i * 7}%`
              }}><strong>{f.title}</strong><span>{f.value}</span>{f.change ? <em>{f.change}</em> : null}</div>{i < funnel.length - 1 ? <small>{i === 0 ? '—' : '70.5%'} conversion</small> : null}</div>)}</div></section>
   <section className="panel"><SectionTitle title="Growth by Segment" label="Observed" /><div className="segment-tabs">{['Customer Type', 'Product', 'Geography', 'Channel', 'Acquisition Source'].map(s => <button key={s} className={segment === s ? 'active' : ''} onClick={() => setSegment(s)}>{s}</button>)}</div><DataTable headers={['Segment', 'Revenue', 'Customers', 'Growth %', 'Contribution']} rows={segments.map(s => [s.name, s.rev, s.customers, s.growth, s.share])} /></section>
   <section className="panel"><SectionTitle title="Growth Cohorts" label="Calculated" /><p className="muted">Retention by monthly cohort · Cohort analysis requires connected CRM or ecommerce data.</p><div className="cohort"><div></div>{['Month 0', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5'].map(x => <b key={x}>{x}</b>)}{['Jan cohort', 'Feb cohort', 'Mar cohort', 'Apr cohort', 'May cohort'].map((r, ri) => <div className="cohort-row" key={r}><span>{r}</span>{[100, 82 - ri * 2, 73 - ri * 3, 64 - ri * 2, 57 - ri, 49 - ri].map((v, ci) => <strong key={`${r}-${ci}`} style={{
                background: `rgba(139,92,246,${Math.max(.18, v / 130)})`
              }}>{ci <= ri ? '—' : `${v}%`}</strong>)}</div>)}</div></section>
   <section className="two-col"><article className="panel"><SectionTitle title="Growth Targets" label="Target" /><TargetRow title="Annual Revenue Target" current="—" target="—" progress="71%" /><TargetRow title="Customer Growth Target" current="1,847" target="2,400" progress="77%" /><p className="note">Only targets configured by your organization are displayed.</p></article><article className="panel"><SectionTitle title="Growth Gap" label="Calculated" />{['Revenue|On Track|+— remaining · 26 weeks', 'Customer|On Track|+553 customers remaining', 'Sales Pipeline|Behind|Current trajectory insufficient', 'Advertising ROI|Behind|Efficiency declining'].map(r => {
              const p = r.split('|');
              return <div className="gap-row" key={p[0]}><strong>{p[0]}</strong><span className={p[1] === 'Behind' ? 'status down' : 'status up'}>{p[1]}</span><small>{p[2]}</small></div>;
            })}</article></section>
   <section className="panel"><SectionTitle title="Growth Comparison" label="Calculated" /><DataTable headers={['Dimension', 'Current Period', 'Previous Period', 'Previous Year', 'vs Prev', 'vs Year']} rows={[['Revenue Growth', '+18.4%', '+11.2%', '+9.8%', '+7.2pp', '+8.6pp'], ['Customer Growth', '+4.2%', '+2.8%', '+6.1%', '+1.4pp', '-1.9pp'], ['Profit Growth', '+12.1%', '+8.4%', '+4.2%', '+3.7pp', '+7.9pp'], ['Order Growth', '+7.3%', '+5.1%', '+8.9%', '+2.2pp', '-1.6pp'], ['Marketing Growth', '+6.2%', '+3.8%', '+4.1%', '+2.4pp', '+2.1pp']]} /></section>
   <section className="two-col"><article className="panel"><SectionTitle title="Growth Stability" label="Calculated from historical variance" /><div className="stability-status">Moderately Volatile</div>{['Revenue|Moderate Volatility|72%', 'Customers|Stable|28%', 'Sales|Volatile|88%', 'Marketing|Stable|34%', 'Ecommerce|Stable|30%'].map(r => {
              const p = r.split('|');
              return <div className="stability-row" key={p[0]}><span>{p[0]}</span><b>{p[1]}</b><i><em style={{
                    width: p[2]
                  }}></em></i></div>;
            })}</article><article className="panel"><SectionTitle title="Growth Benchmark" label="Observed / Benchmark / Target" /><div className="benchmark-grid"><span>Current Growth<strong>—</strong><Tag kind="observed">Observed</Tag></span><span>Historical Average<strong>—</strong><Tag>Benchmark</Tag></span><span>Industry Benchmark<strong>Not connected</strong><Tag kind="partial">Benchmark</Tag></span><span>Internal Target<strong>—</strong><Tag kind="target">Target</Tag></span></div><p className="note">External benchmarks are not available. Historical benchmark is based on your own data.</p></article></section>
   <section className="panel"><SectionTitle title="Key Growth KPIs" label="Observed / Calculated" /><DataTable headers={['KPI', 'Current', 'Previous', 'Change', 'Trend']} rows={tableKpis.map(x => [x.kpi, x.current, x.prev, x.change, x.tone === 'up' ? '↑ Increasing' : '↓ Declining'])} /><button className="secondary-btn">Open KPI Explorer <ChevronRight size={15} /></button></section>
   <section className="panel explain"><div className="panel-heading"><div><h2>Explain Growth</h2><p>Understand the story behind your performance</p></div><Tag kind="ai">AI Explanation</Tag></div><button className="explain-button" onClick={() => setExplain(!explain)}><Sparkles size={17} />{explain ? 'Hide Growth Explanation' : 'Explain Growth Performance'}<ChevronDown size={16} /></button>{explain ? <div className="explanation"><p><strong>What changed:</strong> Revenue and Orders grew strongly while the Sales pipeline declined.</p><p><strong>Key contributors:</strong> Organic traffic —, new customer acquisition +14.7%, and AOV +6.8%.</p><p><strong>Concern areas:</strong> Advertising ROAS declined and the Sales pipeline is weaker.</p><p><strong>Data sources:</strong> Shopify, Google Analytics, Google Ads, Meta Ads, CRM.</p><small>This is an AI-generated explanation based on available business data. Not a prediction or recommendation.</small></div> : null}</section>
   <section className="ask panel"><div className="ask-icon"><Sparkles size={20} /></div><div><h2>Ask Lulu AI</h2><p>Explore your business growth in plain language.</p><div className="ask-input"><input aria-label="Ask Lulu AI about your business growth" placeholder="Ask Lulu AI about your business growth..." /><button aria-label="Submit question"><ArrowUpRight size={18} /></button></div><div className="prompt-chips">{['How fast is my business growing?', 'What is driving my growth?', 'Which products are growing fastest?', 'Is growth accelerating?', 'How diversified is my growth?'].map(x => <button key={x}>{x}</button>)}</div></div></section>
  </div></section>
 </main>;
};
function SectionTitle({
  title,
  label
}: {
  title: string;
  label: string;
}) {
  return <div className="section-title"><h2>{title}</h2><span>{label}</span></div>;
}
function DataTable({
  headers,
  rows
}: {
  headers: string[];
  rows: string[][];
}) {
  return <div className="table-scroll"><table><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r, ri) => <tr key={r[0]}>{r.map((cell, ci) => <td key={`${r[0]}-${headers[ci]}`} className={cell.startsWith('-') ? 'negative' : cell.startsWith('+') || cell.includes('↑') ? 'positive' : ''}>{cell}{headers[ci] === 'Growth Rate' || headers[ci] === 'Trend' ? <span className="trend-word">{cell.startsWith('-') ? ' ↓ Declining' : ' ↑ Increasing'}</span> : null}</td>)}</tr>)}</tbody></table></div>;
}
function TargetRow({
  title,
  current,
  target,
  progress
}: {
  title: string;
  current: string;
  target: string;
  progress: string;
}) {
  return <div className="target-row"><div><strong>{title}</strong><span>{current} <small>of {target}</small></span></div><div className="progress"><i style={{
        width: progress
      }}></i></div><b>{progress}</b></div>;
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
