import { useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, ChevronDown, Download, Ellipsis, FileText, HelpCircle, LayoutDashboard, Lightbulb, Menu, MoreHorizontal, Plus, Search, Settings, ShieldAlert, Sparkles, Target, TrendingUp, Users, X } from 'lucide-react';
type Tab = 'Daily' | 'Weekly' | 'Monthly';
const periods: string[] = [];
const horizons = ['30 Days', '60 Days', '90 Days', '6 Months', '12 Months'];
const kpis: any[][] = [];
const customers: any[][] = [];
const expansions: any[][] = [];
const contractions: any[][] = [];
const products: any[][] = [];
const segments: any[][] = [];
const channels: any[][] = [];
const cohortRows: any[][] = [];
const risks: any[][] = [];
const recs: string[] = [];
function Sidebar() {
  return <aside className="rr-sidebar"><div className="rr-logo"><span className="rr-logo-mark">L</span><span>Lulu <b>AI</b></span></div><div className="rr-workspace"><div className="rr-avatar">AC</div><div><strong>Workspace finance</strong><small>Finance workspace</small></div><ChevronDown size={14} /></div><LuluSectionNavigation activeId="radiant-hour-5376" /><div className="rr-sidebar-bottom"><div className="rr-help"><HelpCircle size={18} /><div><strong>Need help?</strong><small>Ask Lulu anything</small></div></div><div className="rr-user"><div className="rr-avatar purple">JS</div><div><strong>Workspace administrator</strong><small>Administrator</small></div><MoreHorizontal size={17} /></div></div></aside>;
}
function Header() {
  const [period, setPeriod] = useState('Current Month');
  const [horizon, setHorizon] = useState('90 Days');
  return <header className="rr-header"><div className="rr-breadcrumb"><span>Finance</span><span>/</span><strong>Recurring Revenue</strong></div><div className="rr-title-row"><div><h1>Recurring Revenue</h1><p>Monitor recurring revenue, growth, retention and the financial health of your subscription business.</p></div><div className="rr-actions"><button className="primary"><Plus size={16} />Create Revenue Report</button><button className="secondary"><Sparkles size={16} />Ask Lulu AI</button><button className="secondary"><Download size={15} />Export</button><button className="icon-button" aria-label="More actions"><Ellipsis size={18} /></button></div></div><div className="rr-control-row"><div className="pill-group" aria-label="Reporting period">{periods.map(item => <button key={item} className={period === item ? 'selected' : ''} onClick={() => setPeriod(item)}>{item}</button>)}</div><div className="horizon"><span>Forecast</span>{horizons.map(item => <button key={item} className={horizon === item ? 'selected' : ''} onClick={() => setHorizon(item)}>{item}</button>)}</div></div></header>;
}
function AreaChart({
  compact = false
}: {
  compact?: boolean;
}) {
  return <div className={compact ? 'chart compact-chart' : 'chart'}><div className="chart-legend"><span><i className="dot purple-dot" />MRR</span><span><i className="dot green-dot" />New MRR</span><span><i className="dot blue-dot" />Expansion MRR</span><span><i className="dot amber-dot" />Contraction</span><span><i className="dot red-dot" />Churned</span></div><svg viewBox="0 0 1000 250" role="img" aria-label="MRR rose steadily from 214 thousand dollars in July to 284 thousand dollars in June, with new and expansion revenue offset by contraction and churn"><defs><linearGradient id="mrrFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--chart-3)" stopOpacity=".22" /><stop offset="1" stopColor="var(--chart-3)" stopOpacity="0" /></linearGradient></defs><path d="M35 212 L120 202 L205 187 L290 181 L375 166 L460 155 L545 143 L630 127 L715 113 L800 97 L885 76 L970 55 L970 230 L35 230Z" fill="url(#mrrFill)" /><path d="M35 212 L120 202 L205 187 L290 181 L375 166 L460 155 L545 143 L630 127 L715 113 L800 97 L885 76 L970 55" fill="none" stroke="var(--chart-3)" strokeWidth="3" /><path d="M35 224 L120 215 L205 205 L290 199 L375 190 L460 180 L545 171 L630 161 L715 147 L800 136 L885 120 L970 105" fill="none" stroke="var(--chart-4)" strokeWidth="2" /><path d="M35 226 L120 222 L205 214 L290 211 L375 205 L460 198 L545 192 L630 185 L715 178 L800 168 L885 159 L970 148" fill="none" stroke="var(--chart-3)" strokeWidth="2" /><path d="M35 236 L120 239 L205 235 L290 241 L375 238 L460 244 L545 239 L630 245 L715 240 L800 244 L885 237 L970 242" fill="none" stroke="var(--chart-1)" strokeWidth="2" /><path d="M35 241 L120 245 L205 242 L290 247 L375 244 L460 248 L545 245 L630 249 L715 245 L800 248 L885 242 L970 246" fill="none" stroke="var(--chart-5)" strokeWidth="2" /><g className="axis">{['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => <text key={m} x={35 + i * 85} y="248">{m}</text>)}<text x="2" y="60">—</text><text x="2" y="135">—</text><text x="2" y="210">—</text></g></svg></div>;
}
function Table({
  title,
  total,
  headers,
  rows,
  note,
  moneyIndex = -1
}: {
  title: string;
  total?: string;
  headers: string[];
  rows: string[][];
  note?: string;
  moneyIndex?: number;
}) {
  return <section className="panel table-panel"><div className="section-head"><div><h2>{title}</h2>{note && <p className="note">{note}</p>}</div>{total && <strong className="section-total">{total}</strong>}<button className="icon-button" aria-label={`More ${title} actions`}><MoreHorizontal size={18} /></button></div><div className="table-wrap"><table><thead><tr>{headers.map(h => <th key={h}>{h}{['MRR', 'ARR', 'Growth'].includes(h) && <ChevronDown size={12} />}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row[0]}>{row.map((cell, i) => <td key={`${row[0]}-${i}`} className={i === moneyIndex || cell.startsWith('+') ? 'positive-cell' : cell.startsWith('-') ? 'negative-cell' : ''}>{cell}</td>)}<td><button className="row-action" aria-label={`Open ${row[0]}`}><ChevronDown size={14} /></button></td></tr>)}</tbody></table></div></section>;
}
export function RecurringRevenue() {
  const [granularity, setGranularity] = useState<Tab>('Monthly');
  const [cohort, setCohort] = useState('Monthly');
  const [churnTab, setChurnTab] = useState('By Product');
  const { items: liveRevenue, loading: liveLoading, error: liveError } = useLiveRecords('finance_recurring_revenue');
  const liveEmpty = !liveLoading && !liveError && liveRevenue.length === 0;
  return <div className="rr-shell">{liveLoading ? <div className="border-b border-border bg-secondary/30 px-4 py-3 text-xs text-muted-foreground">Loading live recurring revenue…</div> : liveError ? <div className="border-b border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">{liveError}</div> : liveEmpty ? <div className="border-b border-dashed border-border bg-card px-4 py-3 text-xs text-muted-foreground">No live recurring revenue records are available yet. Connect billing data or record revenue to begin.</div> : null}<Sidebar /><main className="rr-main"><Header /><div className="rr-content"><section className="kpi-scroll" aria-label="Recurring revenue summary">{kpis.map(([label, value, trend, period, badge]) => <article className={`kpi-card ${label.includes('Churn') || label.includes('Contraction') ? 'risk-kpi' : ''}`} key={label}><div className="kpi-top"><span>{label}</span><span className={badge === 'Calculated' ? 'badge calculated' : 'badge observed'}>{badge}</span></div><strong>{value}</strong><div><span className={trend.startsWith('↓') ? 'trend negative' : 'trend'}>{trend.startsWith('↓') ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />} {trend}</span><small>{period}</small></div></article>)}</section>
<section className="panel chart-panel"><div className="section-head"><div><h2>MRR Growth</h2><p className="note">Monthly recurring revenue movement · connected live data</p></div><div className="segmented">{(['Daily', 'Weekly', 'Monthly'] as Tab[]).map(item => <button key={item} className={granularity === item ? 'selected' : ''} onClick={() => setGranularity(item)}>{item}</button>)}</div></div><AreaChart /></section>
<div className="two-col"><section className="panel chart-panel"><div className="section-head"><div><h2>ARR Trend</h2><span className="badge calculated">Calculated</span></div><div className="segmented"><button className="selected">Monthly</button><button>Quarterly</button><button>Annual</button></div></div><div className="mini-bars"><div className="bar b1"><span>—</span></div><div className="bar b2"><span>—</span></div><div className="bar b3"><span>—</span></div><div className="bar b4"><span>—</span></div><div className="bar b5"><span>—</span></div></div><div className="bar-labels"><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div><p className="note chart-note">ARR is a calculated metric based on current MRR × 12</p></section><section className="panel bridge-panel"><div className="section-head"><div><h2>MRR Movement</h2><p className="note">Current month bridge</p></div><span className="badge observed">Observed</span></div><div className="bridge"><div className="bridge-item"><i className="bridge-neutral" style={{
                  height: '54%'
                }} /><span>Beginning<br /><b>—</b></span></div><div className="bridge-item"><i className="bridge-green" style={{
                  height: '78%'
                }} /><span>New<br /><b>+—</b></span></div><div className="bridge-item"><i className="bridge-blue" style={{
                  height: '61%'
                }} /><span>Expansion<br /><b>+—</b></span></div><div className="bridge-item"><i className="bridge-amber" style={{
                  height: '30%'
                }} /><span>Contraction<br /><b>−—</b></span></div><div className="bridge-item"><i className="bridge-red" style={{
                  height: '42%'
                }} /><span>Churned<br /><b>−—</b></span></div><div className="bridge-item"><i className="bridge-purple" style={{
                  height: '82%'
                }} /><span>Ending<br /><b>—</b></span></div></div></section></div>
<div className="two-col"><Table title="New MRR" total="New MRR: —" headers={['Customer', 'New recurring contract', 'New MRR', 'Date', 'Action']} rows={customers} /><Table title="Expansion MRR" total="Expansion MRR: —" headers={['Customer', 'Previous MRR', 'Current MRR', 'Expansion', 'Date', 'Cause']} rows={expansions} /></div>
<div className="two-col"><Table title="Contraction MRR" headers={['Customer', 'Previous MRR', 'Current MRR', 'Reduction', 'Date', 'Action']} rows={contractions} note="Cause not automatically classified without source data" /><section className="panel table-panel"><div className="section-head"><div><h2>Churned Revenue</h2><p className="note">7 customers · connected live data</p></div><span className="badge negative-badge">Revenue impact</span></div><div className="churn-stats"><div><b>7</b><small>Churned customers</small></div><div><b>—</b><small>Churned MRR</small></div><div><b>—</b><small>Churn rate</small></div></div><div className="tab-row">{['By Product', 'By Plan', 'By Segment', 'By Geography'].map(item => <button key={item} className={churnTab === item ? 'active-tab' : ''} onClick={() => setChurnTab(item)}>{item}</button>)}</div><table className="small-table"><thead><tr><th>{churnTab.replace('By ', '')}</th><th>Churned MRR</th><th>Customers</th></tr></thead><tbody>{[['Lulu Insights', '—', '3'], ['Growth plan', '—', '2'], ['Mid-Market', '—', '1']].map(r => <tr key={r[0]}><td>{r[0]}</td><td className="negative-cell">{r[1]}</td><td>{r[2]}</td></tr>)}</tbody></table></section></div>
<div className="two-col"><section className="panel retention"><div className="section-head"><div><h2>Revenue Retention</h2><p className="note">Retention health across the current period</p></div><span className="badge calculated">Calculated</span></div><div className="retention-grid"><div><span>Gross Revenue Retention</span><b className="good">—</b><small>Calculated</small></div><div><span>Net Revenue Retention</span><b className="purple-text">—</b><small>Calculated</small></div><div><span>Customer Retention</span><b>—</b><small>Calculated</small></div><div><span>Churn Rate</span><b>—</b><small>Calculated</small></div></div><p className="method">Methodology: retention metrics are calculated from observed recurring revenue records, expansion, contraction and churn movements.</p></section><Table title="Revenue by Product" headers={['Product', 'MRR', 'ARR', 'Growth', 'Customers', 'Churned MRR', 'Action']} rows={products} /></div>
<div className="two-col"><Table title="Revenue by Segment" headers={['Segment', 'MRR', 'ARR', 'Growth', 'Customers', 'Retention']} rows={segments} note="Only segments available in connected data are shown" /><Table title="Revenue by Acquisition Channel" headers={['Channel', 'New MRR', 'Total MRR', 'Growth', 'Customers']} rows={channels} note="Only channels supported by connected data" /></div>
<section className="panel concentration"><div className="section-head"><div><h2>Revenue Concentration <span className="badge calculated">Calculated</span></h2><p className="note">Customer-level concentration of current recurring revenue</p></div><button className="ghost">Collapse top 10 <ChevronDown size={14} /></button></div><div className="concentration-bar"><span>Top 10 customers · —</span><i /><span>Remaining · —</span></div><p className="callout">Top 10 customers represent <strong>— of current MRR</strong></p><table><thead><tr><th>Rank</th><th>Customer</th><th>MRR</th><th>% of Total MRR</th><th>Trend</th></tr></thead><tbody>{[['01', 'Northstar Labs', '—', '6.5%', '↑ 12.4%'], ['02', 'Aperture Health', '—', '5.9%', '↑ 8.1%'], ['03', 'Kite Systems', '—', '5.0%', '↑ 4.2%'], ['04', 'Morrow & Co.', '—', '4.4%', '→ 0.0%'], ['05', 'Juniper Health', '—', '3.7%', '↑ 6.8%']].map(r => <tr key={r[0]}>{r.map(c => <td key={c}>{c}</td>)}</tr>)}</tbody></table></section>
<section className="panel forecast"><div className="section-head"><div><h2>Recurring Revenue Forecast <span className="badge forecast-badge">Forecast</span></h2><p className="note">Projected recurring revenue based on observed trends</p></div><div className="segmented">{horizons.map(item => <button key={item} className={item === '90 Days' ? 'selected' : ''}>{item}</button>)}</div></div><div className="forecast-chart"><svg viewBox="0 0 1000 190" role="img" aria-label="Actual recurring revenue line transitions to a forecast line with a confidence band"><path d="M20 158 L130 148 L240 137 L350 122 L460 110 L570 96" fill="none" stroke="var(--chart-3)" strokeWidth="3" /><path d="M570 96 L680 82 L790 72 L900 55 L980 42" fill="none" stroke="var(--chart-3)" strokeWidth="3" strokeDasharray="8 7" /><path d="M570 96 L680 63 L790 58 L900 35 L980 24 L980 76 L900 87 L790 88 L680 102 L570 115Z" fill="var(--chart-3)" opacity=".12" /><line x1="570" y1="15" x2="570" y2="175" stroke="var(--border)" strokeDasharray="4 5" /><text x="585" y="25">Forecast begins</text></svg></div><div className="forecast-stats"><div><small>Forecast MRR</small><b>—</b><span>↑ —</span></div><div><small>Forecast ARR</small><b>—</b><span>↑ —</span></div><div><small>Expected growth</small><b>—</b><span>Next 90 days</span></div><div><small>Expected churn impact</small><b>-—</b><span className="negative-cell">Risk-adjusted</span></div></div><p className="source-note">Based on historical MRR, new customer acquisition, expansion, contraction, and churn trends</p><strong className="disclaimer">Forecast — Not actual revenue</strong></section>
<section className="panel cohort"><div className="section-head"><div><h2>Cohort Analysis <span className="badge calculated">Calculated</span></h2><p className="note">Recurring revenue retention by customer start month</p></div><div className="segmented"><button className={cohort === 'Monthly' ? 'selected' : ''} onClick={() => setCohort('Monthly')}>Monthly</button><button className={cohort === 'Quarterly' ? 'selected' : ''} onClick={() => setCohort('Quarterly')}>Quarterly</button></div></div><div className="cohort-wrap"><table className="cohort-table"><thead><tr><th>Cohort</th>{Array.from({
                    length: 12
                  }, (_, i) => <th key={i}>M{i}</th>)}</tr></thead><tbody>{cohortRows.map(row => <tr key={row[0]}>{row.map((cell, i) => <td key={`${row[0]}-${i}`} className={i === 0 ? '' : cell === '—' ? 'empty-cell' : `heat-${Math.min(5, Math.max(1, Math.ceil(parseInt(cell) / 20)))}`}>{cell}</td>)}</tr>)}</tbody><tfoot><tr><th>Average</th><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr></tfoot></table></div><p className="method">Cohorts group customers by their first recurring revenue month. Retention shows % of starting MRR retained each subsequent month.</p></section>
<div className="three-col"><section className="panel risk-panel"><div className="section-head"><h2>Revenue Risks</h2><ShieldAlert size={18} className="red-icon" /></div>{risks.map(r => <article className="risk-card" key={r[0]}><div><strong>{r[0]}</strong><span className={`severity ${r[1].toLowerCase()}`}>{r[1]}</span></div><small>Detected {r[2]} · {r[3]}</small><b>{r[4]} affected revenue</b><div><button className="tiny-btn">Investigate</button><button className="tiny-btn ghost">Ask Lulu AI</button></div></article>)}</section><section className="panel opportunities"><div className="section-head"><h2>Revenue Opportunities</h2><Lightbulb size={18} className="amber-icon" /></div>{[['Expansion opportunities in Enterprise', '38 accounts show usage above plan', '—'], ['Upsell potential for Lulu Assist', '64 customers have not added Assist', '—'], ['Referral channel acceleration', 'Referral retention is 99.1%', '—']].map(r => <article className="opportunity" key={r[0]}><div><strong>{r[0]}</strong><span className="badge ai-badge">AI-generated</span></div><p>{r[1]}</p><b>Potential MRR impact: {r[2]}</b></article>)}</section><section className="panel alerts"><div className="section-head"><h2>Revenue Alerts</h2><Bell size={18} /></div>{[['Churn rate crossed the 2.5% threshold', 'High'], ['12 renewals due within 30 days', 'Medium'], ['MRR growth is above quarterly average', 'Low']].map(r => <article className="alert-row" key={r[0]}><span className={`alert-dot ${r[1].toLowerCase()}`} /><div><strong>{r[0]}</strong><small>{r[1]} severity · Today</small></div><button aria-label={`Open alert: ${r[0]}`}><ChevronDown size={15} /></button></article>)}</section></div>
<div className="two-col ai-row"><section className="ai-panel"><div className="ai-heading"><Sparkles size={20} /><div><h2>AI Insights</h2><span className="badge ai-badge">AI-generated</span></div></div><p>MRR increased — compared with the previous month, primarily driven by new recurring revenue and customer expansion.</p><div className="mini-bridge"><span>—</span><i>+24.3k</i><i>+11.2k</i><i className="down">−4.8k</i><i className="down">−8.1k</i><b>—</b></div><small>Analysis will appear after connected records are available.</small></section><section className="panel recommendations"><div className="section-head"><div><h2>AI Recommendations</h2><p className="note">Prioritized next actions</p></div><Sparkles size={17} /></div>{recs.map(item => <div className="recommendation" key={item}><span className="number">→</span><span>{item}</span><button className="tiny-btn">Review</button></div>)}<p className="method">AI will not automatically modify subscriptions or customer contracts.</p></section></div>
<section className="ask-lulu"><div className="ask-title"><div className="sparkle-circle"><Sparkles size={19} /></div><div><h2>Ask Lulu AI</h2><p>Explore your recurring revenue with natural language.</p></div></div><div className="ask-input"><Search size={18} /><input aria-label="Ask Lulu AI" placeholder="Ask Lulu AI about recurring revenue..." /><button className="primary">Send <ArrowUpRight size={15} /></button></div><div className="suggestions">{['What is our current MRR?', 'What is our ARR?', 'Why did MRR change?', 'Which customers churned?', 'What is our churn rate?', 'What is our NRR?', 'Which products generate the most recurring revenue?', 'What is our recurring revenue forecast?'].map(item => <button key={item}>{item}</button>)}</div></section><div className="collapsed-states"><button>Empty state <ChevronDown size={14} /></button><button>Limited data <ChevronDown size={14} /></button><button>Errors & sync status <ChevronDown size={14} /></button></div></div></main></div>;
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
