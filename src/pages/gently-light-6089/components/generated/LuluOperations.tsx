import { useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, Download, Plus, RefreshCw, Search, Send, Sparkles, X } from 'lucide-react';
type Tone = 'teal' | 'orange' | 'amber' | 'red';
type Process = {
  name: string;
  executions: string;
  successful: string;
  failed: string;
  success: string;
  cycle: string;
  sla: string;
  automation: string;
};
type Metric = {
  label: string;
  value: string;
  prev: string;
  delta: string;
  tone: Tone;
  direction: 'up' | 'down';
};
const metrics: Metric[] = [{
  label: 'Operational Efficiency',
  value: '84/100',
  prev: '79/100 prev.',
  delta: '+5  +6.3%',
  tone: 'teal',
  direction: 'up'
}, {
  label: 'Process Volume',
  value: '284,720',
  prev: '261,480 prev.',
  delta: '+23,240  +8.9%',
  tone: 'teal',
  direction: 'up'
}, {
  label: 'Completed Processes',
  value: '271,840',
  prev: '247,940 prev.',
  delta: '+23,900  +9.6%',
  tone: 'teal',
  direction: 'up'
}, {
  label: 'Success Rate',
  value: '95.5%',
  prev: '94.8% prev.',
  delta: '+0.7pp  +0.7%',
  tone: 'teal',
  direction: 'up'
}, {
  label: 'Avg Cycle Time',
  value: '4.2 min',
  prev: '4.8 min prev.',
  delta: '-0.6 min  -12.5%',
  tone: 'teal',
  direction: 'down'
}, {
  label: 'Automation Rate',
  value: '68.4%',
  prev: '62.1% prev.',
  delta: '+6.3pp  +10.1%',
  tone: 'orange',
  direction: 'up'
}, {
  label: 'Error Rate',
  value: '4.5%',
  prev: '5.2% prev.',
  delta: '-0.7pp  -13.5%',
  tone: 'teal',
  direction: 'down'
}, {
  label: 'SLA Compliance',
  value: '91.2%',
  prev: '89.4% prev.',
  delta: '+1.8pp  +2.0%',
  tone: 'teal',
  direction: 'up'
}];
const processes: Process[] = [{
  name: 'Customer Onboarding',
  executions: '12,840',
  successful: '12,584',
  failed: '256',
  success: '98.0%',
  cycle: '8.4 min',
  sla: '94.2%',
  automation: '82.4%'
}, {
  name: 'Order Processing',
  executions: '48,200',
  successful: '47,240',
  failed: '960',
  success: '98.0%',
  cycle: '2.1 min',
  sla: '99.2%',
  automation: '96.8%'
}, {
  name: 'Invoice Generation',
  executions: '18,420',
  successful: '18,236',
  failed: '184',
  success: '99.0%',
  cycle: '0.8 min',
  sla: '99.8%',
  automation: '98.4%'
}, {
  name: 'Lead Qualification',
  executions: '8,284',
  successful: '7,704',
  failed: '580',
  success: '93.0%',
  cycle: '14.2 min',
  sla: '84.8%',
  automation: '48.2%'
}, {
  name: 'Support Ticket Routing',
  executions: '22,640',
  successful: '21,284',
  failed: '1,356',
  success: '94.0%',
  cycle: '3.6 min',
  sla: '88.4%',
  automation: '74.6%'
}, {
  name: 'Data Sync — CRM→ERP',
  executions: '82,400',
  successful: '74,160',
  failed: '8,240',
  success: '90.0%',
  cycle: '1.4 min',
  sla: '96.2%',
  automation: '100%'
}, {
  name: 'Payroll Processing',
  executions: '2,840',
  successful: '2,840',
  failed: '0',
  success: '100%',
  cycle: '12.8 min',
  sla: '100%',
  automation: '62.4%'
}, {
  name: 'Compliance Reporting',
  executions: '1,284',
  successful: '1,156',
  failed: '128',
  success: '90.0%',
  cycle: '28.4 min',
  sla: '72.4%',
  automation: '28.4%'
}];
const departments = [{
  n: 'Operations',
  v: '84,200',
  w: 100
}, {
  n: 'Sales',
  v: '62,400',
  w: 74
}, {
  n: 'Finance',
  v: '48,200',
  w: 57
}, {
  n: 'Marketing',
  v: '38,400',
  w: 46
}, {
  n: 'HR',
  v: '28,200',
  w: 34
}, {
  n: 'Support',
  v: '23,320',
  w: 28
}];
const workflows = [['New Customer Onboarding Flow', '4,284', '97.2%', '2.8%', '42 min', '94.2%', '68.4%'], ['Order-to-Cash', '18,420', '99.1%', '0.9%', '8.4 min', '99.4%', '94.2%'], ['Lead-to-Opportunity', '3,284', '89.4%', '10.6%', '84 min', '72.4%', '42.8%'], ['Support Resolution', '8,420', '94.8%', '5.2%', '28.4 min', '88.2%', '62.4%'], ['Compliance & Reporting', '428', '91.2%', '8.8%', '124 min', '74.2%', '28.4%'], ['Invoice-to-Payment', '6,284', '99.4%', '0.6%', '4.2 min', '99.8%', '98.4%']];
const bottlenecks = [['Lead Qualification', 'Manual Review Step', '2,840', '8.4 min', '14.2 min total', '15.2% SLA breach', 'High'], ['Data Sync CRM→ERP', 'API Rate Limit', '8,240', '2.8 min', '1.4 min avg', '3.8% SLA breach', 'Medium'], ['Compliance Reporting', 'Document Assembly', '284', '12.4 min', '28.4 min total', '27.6% SLA breach', 'High'], ['Support Ticket Routing', 'Classification Step', '1,840', '4.2 min', '3.6 min avg', '11.6% SLA breach', 'Medium']];
const automation = [['Order Processing Bot', '48,200', '99.4%', '289', '~2,408 hrs', '0.6%'], ['Invoice Generator', '18,420', '99.0%', '184', '~614 hrs', '1.0%'], ['CRM Data Sync', '82,400', '90.0%', '8,240', '~1,373 hrs', '10.0%'], ['Lead Scorer', '4,284', '94.2%', '249', '~429 hrs', '5.8%'], ['Email Dispatch', '124,800', '99.8%', '250', '~1,040 hrs', '0.2%']];
const manual = [['Lead Qualification', '2,840', '14.2 min', '672 hrs', '↑'], ['Support Routing', '1,840', '3.6 min', '110 hrs', '→'], ['CRM Sync', '2,400', '1.4 min', '56 hrs', '↑'], ['Compliance Reporting', '1,204', '28.4 min', '570 hrs', '→'], ['Other Processes', '81,844', '2.1 min', '2,864 hrs', '↓']];
const aiBullets = ['Process volume grew +8.9% to 284,720 executions; completion rate up to 95.5%', 'Average cycle time improved from 4.8 → 4.2 min (-12.5%), driven by automation rate increase from 62.1% → 68.4%', 'CRM Data Sync is primary failure source: 8,240 failures (64.0% of all errors), API rate limiting identified as root cause', 'Compliance Reporting bottleneck: 28.4 min avg cycle vs 15 min SLA — document assembly step is largest delay', 'Support Team operating at 91.8% capacity — near-limit state; workload growth trend +4.2%/week', 'Lead-to-Opportunity workflow: 10.6% failure rate, 72.4% SLA compliance — lowest performing workflow', 'Automation time savings estimated at ~5,864 hrs/month (Estimated — based on configured manual durations)'];
const toneColor = (tone: Tone) => ({
  teal: 'var(--chart-3)',
  orange: 'var(--chart-1)',
  amber: 'var(--chart-1)',
  red: 'var(--chart-5)'
})[tone];
const Sparkline = ({
  tone = 'teal'
}: {
  tone?: Tone;
}) => <svg width="40" height="24" viewBox="0 0 40 24" aria-hidden="true"><path d="M1 19 L7 16 L12 18 L17 10 L22 13 L28 7 L34 11 L39 3" fill="none" stroke={toneColor(tone)} strokeWidth="2" /></svg>;
const Donut = ({
  value,
  tone = 'teal'
}: {
  value: number;
  tone?: Tone;
}) => <svg width="112" height="112" viewBox="0 0 42 42" aria-label={`${value}%`}><circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--muted-foreground)" strokeWidth="5" /><circle cx="21" cy="21" r="15.9" fill="none" stroke={toneColor(tone)} strokeWidth="5" strokeDasharray={`${value} ${100 - value}`} strokeDashoffset="25" strokeLinecap="round" /></svg>;
const Section = ({
  title,
  children,
  className = ''
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => <section className={`section ${className}`}><div className="section-title"><h2>{title}</h2></div>{children}</section>;
export const LuluOperations = () => {
  const [activeTrend, setActiveTrend] = useState('Volume');
  const [query, setQuery] = useState('');
  const [ask, setAsk] = useState('');
  const [notice, setNotice] = useState(true);
  const filtered = processes.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  return <div className="flex min-h-screen bg-[var(--background)]"><aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-[var(--sidebar)] p-4 lg:flex"><div className="mb-5 flex items-center gap-3 px-2 py-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">L</div><span className="font-semibold text-foreground">Lulu AI</span></div><LuluSectionNavigation activeId="gently-light-6089" /></aside><div className="min-w-0 flex-1"><main className="ops-page">
    <header className="page-header">
      <p className="breadcrumb">Intelligence <span>/</span> Business Intelligence <span>/</span> Operations</p>
      <div className="header-row"><div><h1>Operations</h1><p className="subtitle">Understand operational efficiency, processes, workflows, automation and business execution across your organization.</p></div><nav className="actions" aria-label="Page actions"><button className="btn primary"><Sparkles size={15} /> <span>Ask Lulu AI</span></button><button className="btn"><RefreshCw size={15} /> <span>Refresh</span></button><button className="btn"><Plus size={15} /> <span>Create Report</span></button><button className="btn"><Download size={15} /> <span>Export</span></button></nav></div>
    </header>
    {notice && <div className="warning-banner"><span>⚠ Operations analysis is based on partial data — ERP System missing March 20–22. Some metrics may be incomplete.</span><button aria-label="Dismiss warning" onClick={() => setNotice(false)}><X size={15} /></button></div>}
    <div className="filters"><button>Date Range <strong>Last 30 Days</strong> <ChevronDown size={14} /></button><span className="vs">vs</span><button><strong>Previous Period</strong> <ChevronDown size={14} /></button><span className="divider" /><span className="sync"><i />Last synced 1 min ago · <b>8 sources connected</b></span></div>

    <Section title="OPERATIONS OVERVIEW"><div className="kpi-grid">{metrics.map(m => <article className="card kpi" key={m.label}><div className="kpi-top"><p>{m.label}</p><Sparkline tone={m.tone} /></div>{m.label === 'Operational Efficiency' && <span className="ai-pill">✦ AI Assessment</span>}<strong className="kpi-value">{m.value}</strong><span className="prev">{m.prev}</span><span className={`delta ${m.tone}`}><span>{m.direction === 'up' ? '↑' : '↓'}</span> {m.delta}</span></article>)}</div></Section>

    <Section title="OPERATIONS PERFORMANCE TREND"><div className="two-col trend-layout"><article className="card chart-card wide"><div className="card-head"><div><h3>Operations Performance Trend</h3><p>30 day operational signal</p></div><div className="chip-row">{['Volume', 'Success Rate', 'Cycle Time', 'Automation Rate', 'Error Rate'].map(x => <button key={x} className={activeTrend === x ? 'chip active' : 'chip'} onClick={() => setActiveTrend(x)}>{x}{activeTrend === x && ' ✓'}</button>)}</div></div><svg className="big-chart" viewBox="0 0 680 210" role="img" aria-label="Operations performance trend chart"><path d="M0 168 C70 145 86 150 140 120 S220 140 275 105 S350 120 405 76 S495 94 548 52 S620 72 680 25 L680 210 L0 210Z" fill="var(--chart-3)" opacity=".12" /><path d="M0 168 C70 145 86 150 140 120 S220 140 275 105 S350 120 405 76 S495 94 548 52 S620 72 680 25" fill="none" stroke="var(--chart-3)" strokeWidth="3" /><path d="M0 142 C80 138 112 125 170 130 S270 115 335 118 S450 88 510 96 S610 63 680 58" fill="none" stroke="var(--chart-1)" strokeWidth="2" /><path d="M0 155 C80 145 120 141 180 144 S290 132 350 136 S470 108 530 116 S620 92 680 80" fill="none" stroke="var(--chart-1)" strokeWidth="2" strokeDasharray="6 5" />{[42, 105, 168].map(y => <line key={y} x1="0" y1={y} x2="680" y2={y} stroke="var(--muted-foreground)" />)}</svg><div className="chart-foot"><span>Mar 01</span><span>Mar 08</span><span>Mar 15</span><span>Mar 22</span><span>Mar 30</span><div className="time-toggle"><button className="active">Daily</button><button>Weekly</button><button>Monthly</button></div></div></article><aside className="card summary"><h3>Performance Summary</h3>{metrics.slice(1, 6).map(m => <div className="summary-row" key={m.label}><span>{m.label}</span><strong>{m.value}</strong><em className={m.tone}>{m.direction === 'up' ? '↑' : '↓'} {m.delta.split('  ')[1] ?? m.delta}</em></div>)}</aside></div></Section>

    <Section title="PROCESS PERFORMANCE"><div className="toolbar"><label className="search"><Search size={16} /><input aria-label="Search processes" placeholder="Search processes" value={query} onChange={e => setQuery(e.target.value)} /></label><button className="select">Department <ChevronDown size={14} /></button><button className="select">Status <ChevronDown size={14} /></button><button className="select">Sort: Success Rate <ChevronDown size={14} /></button></div><div className="table-wrap"><table><thead><tr>{['Process', 'Executions', 'Successful', 'Failed', 'Success Rate', 'Avg Cycle Time', 'SLA Compliance', 'Automation Rate'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{filtered.map(p => <tr key={p.name}><td><strong>{p.name}</strong></td><td>{p.executions}</td><td>{p.successful}</td><td className={p.failed !== '0' ? 'red-text' : ''}>{p.failed}</td><td className={p.success === '90.0%' ? 'amber-text' : ''}>{p.success}</td><td>{p.cycle}</td><td className={p.sla === '72.4%' || p.sla === '84.8%' ? 'amber-text' : ''}>{p.sla}</td><td>{p.automation}</td></tr>)}</tbody></table></div><p className="caption">1–8 of 42 processes</p></Section>

    <Section title="PROCESS ANALYTICS"><div className="four-col"><article className="card panel"><h3>Process Volume by Department</h3>{departments.map(d => <div className="bar-row" key={d.n}><span>{d.n}</span><div className="bar"><i style={{
                    width: `${d.w}%`
                  }} /></div><b>{d.v}</b></div>)}</article><article className="card panel donut-panel"><h3>Process Success Rate</h3><div className="donut-line"><Donut value={95.5} /><strong>95.5%<small>Overall</small></strong></div><p className="caption">Success Rate = Completed ÷ Total Executions.</p><p className="mini-stat"><span>Successful</span><b className="teal-text">271,840</b></p><p className="mini-stat"><span>Failed</span><b className="red-text">12,880</b></p></article><article className="card panel"><h3>Process Failures</h3><strong className="big-number">12,880</strong><p className="caption">Total failures · 30 day trend</p>{[['CRM→ERP Sync', '8,240', '64.0%'], ['Support Routing', '1,356', '10.5%'], ['Lead Qualification', '580', '4.5%']].map(x => <div className="failure-row" key={x[0]}><span>{x[0]}</span><b>{x[1]}</b><em>{x[2]}</em></div>)}<svg className="micro-chart" viewBox="0 0 220 42"><path d="M0 34 L30 30 L65 32 L94 18 L122 25 L150 12 L180 18 L220 4" fill="none" stroke="var(--chart-5)" strokeWidth="2" /></svg></article><article className="card panel"><h3>Avg Cycle Time</h3><strong className="big-number">4.2 min</strong><p className="caption">Overall average</p>{[['Compliance Reporting', '28.4 min', 100], ['Lead Qualification', '14.2 min', 50], ['Customer Onboarding', '8.4 min', 30], ['Invoice Gen', '0.8 min', 8]].map(x => <div className="bar-row" key={x[0]}><span>{x[0]}</span><div className="bar"><i className={x[0] === 'Compliance Reporting' ? 'amber-fill' : ''} style={{
                    width: `${x[2]}%`
                  }} /></div><b>{x[1]}</b></div>)}<p className="caption">Avg ≠ Median. Median: 3.1 min.</p></article></div></Section>

    <Section title="OPERATIONAL BOTTLENECKS" className="bottleneck"><div className="section-title"><span className="badge orange">4 identified</span></div><div className="table-wrap"><table><thead><tr>{['Process', 'Bottleneck Stage', 'Volume', 'Avg Wait Time', 'Avg Processing Time', 'SLA Impact', 'Severity'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{bottlenecks.map(r => <tr key={r[0]}>{r.map((v, i) => <td key={`${r[0]}-${i}`} className={i === 6 ? `severity ${v.toLowerCase()}` : ''}>{v}</td>)}</tr>)}</tbody></table></div><p className="caption">Bottlenecks identified from cycle time + queue + SLA breach data. Process changes belong in Operations module.</p></Section>

    <Section title="QUEUE PERFORMANCE"><div className="two-col"><article className="card panel"><div className="panel-head"><h3>Queue Volume by Process</h3><strong>8,284 <small>Total queued</small></strong></div>{[['Lead Qual', '2,840', 100], ['CRM Sync', '2,400', 85], ['Support Routing', '1,840', 65], ['Other', '1,204', 42]].map(r => <div className="bar-row" key={r[0]}><span>{r[0]}</span><div className="bar"><i className="orange-fill" style={{
                    width: `${r[2]}%`
                  }} /></div><b>{r[1]}</b></div>)}</article><article className="card panel"><h3>Queue Detail</h3><div className="table-wrap"><table><thead><tr><th>Process</th><th>Queue Volume</th><th>Avg Wait</th><th>Longest Wait</th><th>Trend</th></tr></thead><tbody>{[['Lead Qualification', '2,840', '8.4 min', '42 min', '↑'], ['Support Routing', '1,840', '4.2 min', '28 min', '→'], ['CRM Sync', '2,400', '2.8 min', '18 min', '↑'], ['Other', '1,204', '1.2 min', '12 min', '↓']].map(r => <tr key={r[0]}>{r.map(v => <td key={v}>{v}</td>)}</tr>)}</tbody></table></div></article></div></Section>

    <Section title="WORKFLOW PERFORMANCE"><div className="table-wrap"><table><thead><tr>{['Workflow', 'Executions', 'Success Rate', 'Failure Rate', 'Cycle Time', 'SLA Compliance', 'Automation Rate'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{workflows.map(r => <tr key={r[0]} className={r[0].includes('Lead-to') || r[0].includes('Compliance') ? 'warning-row' : ''}>{r.map((v, i) => <td key={`${r[0]}-${i}`}>{v}</td>)}</tr>)}</tbody></table></div><h3 className="subheading">Workflow Failures</h3><div className="failure-grid">{[['API rate limit', 'CRM→ERP', '8,240', '↑'], ['Classification timeout', 'Support', '1,356', '→'], ['Manual review delay', 'Lead Qual', '580', '↑']].map(r => <div className="failure-card" key={r[0]}><strong>{r[0]}</strong><span>{r[1]}</span><b>{r[2]} failures</b><em>{r[3]}</em></div>)}</div></Section>

    <Section title="AUTOMATION PERFORMANCE"><div className="three-col"><article className="card panel table-panel"><div className="panel-head"><h3>Automation Performance</h3><span className="estimated">Estimated</span></div><div className="table-wrap"><table><thead><tr><th>Automation</th><th>Executions</th><th>Success</th><th>Failed</th><th>Time Saved</th><th>Fallback</th></tr></thead><tbody>{automation.map(r => <tr key={r[0]}>{r.map((v, i) => <td key={`${r[0]}-${i}`} className={i === 5 && v === '10.0%' ? 'amber-text' : ''}>{v}</td>)}</tr>)}</tbody></table></div><p className="caption">Time Saved = Estimated based on average manual processing time per task.</p></article><article className="card panel donut-panel"><h3>Automation Coverage</h3><div className="donut-line"><Donut value={68.4} tone="orange" /><strong>68.4%<small>Automated</small></strong></div>{departments.slice(0, 4).map((d, i) => <div className="bar-row" key={d.n}><span>{d.n}</span><div className="bar"><i className="orange-fill" style={{
                    width: `${[82, 74, 68, 52][i]}%`
                  }} /></div><b>{[82, 74, 68, 52][i]}%</b></div>)}<p className="caption">Coverage ≠ Success Rate.</p></article><article className="card panel"><h3>Automation Time Savings</h3><strong className="big-number">~5,864 hrs<small>/ month</small></strong><span className="estimated">Estimated</span>{[['Order Processing', '2,408 hrs', 90], ['Email Dispatch', '1,040 hrs', 62], ['CRM Sync', '1,373 hrs', 72], ['Invoice Gen', '614 hrs', 38]].map(r => <div className="bar-row" key={r[0]}><span>{r[0]}</span><div className="bar"><i className="orange-fill" style={{
                    width: `${r[2]}%`
                  }} /></div><b>{r[1]}</b></div>)}<p className="caption">Not an accounting metric.</p></article></div></Section>

    <Section title="MANUAL WORKLOAD"><div className="two-col"><article className="card panel"><h3>Manual Task Volume</h3><strong className="big-number">90,128 <small>executions · 31.6%</small></strong>{departments.slice(0, 5).map((d, i) => <div className="bar-row" key={d.n}><span>{d.n}</span><div className="bar"><i className="amber-fill" style={{
                    width: `${[88, 68, 52, 42, 30][i]}%`
                  }} /></div><b>{['32,480', '20,840', '14,220', '10,840', '6,420'][i]}</b></div>)}</article><article className="card panel"><h3>Manual Workload by Process</h3><div className="table-wrap"><table><thead><tr><th>Process</th><th>Manual Volume</th><th>Avg Manual Time</th><th>Total Manual Time</th><th>Trend</th></tr></thead><tbody>{manual.map(r => <tr key={r[0]}>{r.map(v => <td key={v}>{v}</td>)}</tr>)}</tbody></table></div></article></div></Section>

    <Section title="TEAM & DEPARTMENT OPERATIONS"><div className="two-col"><article className="card panel"><h3>Team Operational Performance</h3><div className="table-wrap"><table><thead><tr><th>Team</th><th>Process Volume</th><th>Completed</th><th>Cycle Time</th><th>SLA</th><th>Error Rate</th><th>Manual %</th></tr></thead><tbody>{[['Operations Team', '84,200', '80,412', '4.8 min', '92.4%', '4.5%', '22.4%'], ['Sales Ops', '62,400', '59,280', '6.2 min', '89.4%', '5.2%', '38.4%'], ['Finance Ops', '48,200', '46,754', '2.1 min', '98.2%', '2.8%', '18.4%'], ['Marketing Ops', '38,400', '36,864', '3.8 min', '94.8%', '3.6%', '28.4%'], ['Support Team', '23,320', '21,452', '5.4 min', '86.2%', '6.8%', '42.8%']].map(r => <tr key={r[0]}>{r.map(v => <td key={v}>{v}</td>)}</tr>)}</tbody></table></div><p className="caption">Focus on process-level performance. Not individual employee surveillance.</p></article><article className="card panel"><h3>Department Operations</h3><div className="table-wrap"><table><thead><tr><th>Department</th><th>Volume</th><th>Success</th><th>Cycle</th><th>SLA</th><th>Automation</th></tr></thead><tbody>{departments.slice(0, 5).map((d, i) => <tr key={d.n}><td>{d.n}</td><td>{d.v}</td><td className={i === 4 ? 'amber-text' : ''}>{['96.2%', '95.4%', '98.4%', '94.8%', '91.2%'][i]}</td><td>{['4.8 min', '6.2 min', '2.1 min', '3.8 min', '5.4 min'][i]}</td><td className={i === 4 ? 'amber-text' : ''}>{['92.4%', '89.4%', '98.2%', '94.8%', '86.2%'][i]}</td><td>{['77.6%', '61.6%', '81.6%', '71.6%', '57.2%'][i]}</td></tr>)}</tbody></table></div></article></div></Section>

    <Section title="SLA PERFORMANCE"><div className="two-col"><article className="card panel donut-panel"><h3>SLA Performance</h3><div className="donut-line"><Donut value={91.2} /><strong>91.2%<small>Compliance</small></strong></div>{[['Order Processing', 99], ['Invoice Generation', 99], ['Lead Qualification', 85], ['Compliance Reporting', 72], ['Support Routing', 88]].map(r => <div className="bar-row" key={r[0]}><span>{r[0]}</span><div className="bar"><i className={Number(r[1]) < 85 ? 'red-fill' : Number(r[1]) < 90 ? 'amber-fill' : ''} style={{
                    width: `${r[1]}%`
                  }} /></div><b>{r[1]}%</b></div>)}<p className="caption">SLA Compliance = Executions within SLA ÷ Total Executions.</p></article><article className="card panel"><h3>SLA Breaches</h3><div className="table-wrap"><table><thead><tr><th>Process</th><th>SLA</th><th>Actual</th><th>Variance</th><th>Date</th><th>Team</th><th>Severity</th></tr></thead><tbody>{[['Compliance Reporting', '15 min', '28.4 min', '+13.4 min', 'Mar 21', 'Finance', 'Critical'], ['Lead Qualification', '30 min', '42 min', '+12 min', 'Mar 24', 'Sales', 'High'], ['Lead Qualification', '30 min', '38 min', '+8 min', 'Mar 26', 'Sales', 'High'], ['Support Routing', '10 min', '18 min', '+8 min', 'Mar 27', 'Support', 'Medium'], ['CRM Sync', '5 min', '8 min', '+3 min', 'Mar 28', 'Operations', 'Medium']].map(r => <tr key={`${r[0]}-${r[3]}`}>{r.map((v, i) => <td key={`${r[0]}-${i}`} className={i === 6 ? `severity ${v.toLowerCase()}` : ''}>{v}</td>)}</tr>)}</tbody></table></div><p className="caption">SLA configuration belongs in Operations module.</p></article></div></Section>

    <Section title="ERROR ANALYSIS"><div className="two-col"><article className="card panel donut-panel"><h3>Operational Errors</h3><strong className="big-number">12,880 <small>errors · Error rate 4.5%</small></strong><div className="error-donut"><Donut value={38.4} tone="red" /><ul><li><i className="dot red" />API Errors <b>38.4%</b></li><li><i className="dot orange" />Timeout <b>24.2%</b></li><li><i className="dot amber" />Data Validation <b>18.4%</b></li><li><i className="dot teal" />Auth Failure <b>12.8%</b></li></ul></div></article><article className="card panel"><h3>Error Concentration</h3><p className="caption">Top 3 processes responsible for 84.2% of all errors.</p>{[['CRM Data Sync', '8,240', '64.0%', 100], ['Support Routing', '1,356', '10.5%', 42], ['Lead Qual', '580', '4.5%', 24], ['Other', '2,704', '21.0%', 34]].map(r => <div className="pareto" key={r[0]}><span>{r[0]}</span><div className="bar"><i className="red-fill" style={{
                    width: `${r[3]}%`
                  }} /></div><b>{r[1]}</b><em>{r[2]}</em></div>)}<p className="caption">Fix the top 1 process to eliminate 64% of all errors.</p></article></div></Section>

    <Section title="OPERATIONAL COST"><div className="two-col"><article className="card panel"><h3>Operational Cost</h3><strong className="big-number">$284,200<small>/ month</small></strong><span className="estimated">Observed + Estimated</span><div className="cost-grid"><div><b>$1.00</b><span>Cost / execution</span></div><div><b>$1.05</b><span>Cost / completed</span></div><div><b>$0.42</b><span>Cost / automation</span></div></div><p className="caption">Estimated values are clearly labeled where applicable.</p></article><article className="card panel"><h3>Operational Cost Efficiency</h3>{[['Cost / Execution', '$1.00', '→ stable', 'teal'], ['Cost / Completed Process', '$1.05', '↓ 4.2%', 'teal'], ['Cost / Automation', '$0.42', '↓ 8.4%', 'teal'], ['Cost / Manual Task', '$3.84', '↑ 4x costlier', 'amber']].map(r => <div className="eff-row" key={r[0]}><span>{r[0]}</span><strong>{r[1]}</strong><em className={r[3]}>{r[2]}</em></div>)}<p className="caption">Estimated Cost clearly labeled where applicable.</p></article></div></Section>

    <Section title="OPERATIONAL CAPACITY"><div className="three-col"><article className="card panel"><h3>Capacity Overview</h3><div className="capacity-stats"><span>Available <b>100%</b></span><span>Used <b>72.4%</b></span><span>Remaining <b>27.6%</b></span></div><div className="capacity"><i style={{
                  width: '72.4%'
                }} /><b /></div><span className="badge teal">Balanced</span></article><article className="card panel"><h3>Capacity by Team</h3>{[['Operations Team', '84.2%', 'amber'], ['Finance Ops', '68.4%', 'teal'], ['Support Team', '91.8%', 'red'], ['Sales Ops', '62.4%', 'teal'], ['Marketing Ops', '58.2%', 'teal']].map(r => <div className="capacity-row" key={r[0]}><span>{r[0]}</span><div className="bar"><i className={`${r[2]}-fill`} style={{
                    width: r[1]
                  }} /></div><b>{r[1]}</b></div>)}</article><article className="card panel"><h3>Workload Distribution</h3><div className="table-wrap"><table><thead><tr><th>Team</th><th>Volume</th><th>Est. Effort</th><th>Util.</th></tr></thead><tbody>{[['Operations', '84,200', '2,840 hrs', '84.2%'], ['Finance', '48,200', '1,420 hrs', '68.4%'], ['Support', '23,320', '1,840 hrs', '91.8%'], ['Sales', '62,400', '2,120 hrs', '62.4%']].map(r => <tr key={r[0]}>{r.map(v => <td key={v}>{v}</td>)}</tr>)}</tbody></table></div><p className="caption">Thresholds based on organization-configured capacity settings.</p></article></div></Section>

    <Section title="OPERATIONAL DEPENDENCIES"><div className="card dependency"><svg viewBox="0 0 900 220" role="img" aria-label="Operational dependency network"><g stroke="var(--chart-3)" strokeWidth="2" opacity=".8"><line x1="120" y1="110" x2="330" y2="62" /><line x1="120" y1="110" x2="330" y2="166" /><line x1="330" y1="62" x2="550" y2="110" /><line x1="330" y1="166" x2="550" y2="110" /><line x1="550" y1="110" x2="760" y2="62" /><line x1="550" y1="110" x2="760" y2="166" /></g><g fill="var(--muted-foreground)" stroke="var(--chart-3)" strokeWidth="3"><circle cx="120" cy="110" r="34" /><circle cx="330" cy="62" r="28" /><circle cx="330" cy="166" r="28" /><circle cx="550" cy="110" r="42" stroke="var(--chart-1)" /><circle cx="760" cy="62" r="28" /><circle cx="760" cy="166" r="28" stroke="var(--chart-5)" /></g><g fill="var(--border)" fontSize="12" textAnchor="middle"><text x="120" y="114">Orders</text><text x="330" y="66">CRM</text><text x="330" y="170">Support</text><text x="550" y="114">CRM Sync</text><text x="760" y="66">ERP</text><text x="760" y="170">Billing</text></g></svg><div className="table-wrap"><table><thead><tr><th>Process</th><th>Dependencies</th><th>Systems</th><th>Dependency Risk</th><th>SPF Risk</th></tr></thead><tbody>{[['CRM Data Sync', '4', 'CRM, ERP', 'High', 'SPF'], ['Order Processing', '3', 'ERP, Billing', 'Medium', 'SPF'], ['Support Routing', '2', 'CRM, Support', 'Medium', 'Low'], ['Invoice Generation', '2', 'ERP, Billing', 'Low', 'Low']].map(r => <tr key={r[0]}>{r.map((v, i) => <td key={v} className={i === 4 && v === 'SPF' ? 'severity critical' : ''}>{v}</td>)}</tr>)}</tbody></table></div></div></Section>

    <Section title="SYSTEM PERFORMANCE & INTEGRATION IMPACT"><div className="two-col"><article className="card panel"><h3>Operational Systems</h3><div className="table-wrap"><table><thead><tr><th>System</th><th>Executions</th><th>Success</th><th>Failure</th><th>Integration Errors</th><th>Response</th></tr></thead><tbody>{[['CRM', '82,400', '90.0%', '10.0%', '8,240', '2.8 min'], ['ERP', '74,200', '96.4%', '3.6%', '1,120', '1.4 min'], ['Billing', '24,800', '99.2%', '0.8%', '184', '0.8 min'], ['Support Platform', '22,640', '94.0%', '6.0%', '1,356', '3.6 min'], ['Email System', '124,800', '99.8%', '0.2%', '250', '0.2 min'], ['Payment Gateway', '18,420', '99.4%', '0.6%', '110', '0.4 min']].map(r => <tr key={r[0]} className={r[0] === 'CRM' ? 'warning-row' : ''}>{r.map(v => <td key={v}>{v}</td>)}</tr>)}</tbody></table></div><a href="#integrations">→ View in Integrations</a></article><article className="card panel"><h3>Integration Impact</h3><div className="impact-number"><strong>8,240</strong><span>process failures caused by integrations<br /><b>64.0% of all failures</b></span></div><div className="cost-grid"><div><b>2.8 min</b><span>Avg sync delay</span></div><div><b>3</b><span>Systems with recurring errors</span></div></div><h4 className="subheading">Top integration issues</h4><p className="caption">CRM → ERP · API rate limit · 8,240 failures</p><a href="#integrations">→ View in Integrations</a></article></div></Section>

    <Section title="PROCESS VALUE"><div className="card panel"><div className="table-wrap"><table><thead><tr><th>Process</th><th>Volume</th><th>Revenue Impact</th><th>Cost Impact</th><th>Time Impact</th><th>Customer Impact</th><th>Strategic</th></tr></thead><tbody>{[['Order Processing', '48,200', '$2,184,700 revenue linked', '-$48,200', '2.1 min avg', '18,420 customers', 'Core'], ['Customer Onboarding', '12,840', '$428,500 attributed', '-$24,200', '8.4 min', '12,584 customers', 'Strategic']].map(r => <tr key={r[0]}>{r.map(v => <td key={v}>{v}</td>)}</tr>)}</tbody></table></div><p className="caption">Revenue/Cost impact shown only where measurable. Estimated values labeled. Do not infer financial value from operational data alone.</p></div></Section>

    <section className="section efficiency"><div className="section-title"><h2>OPERATIONAL EFFICIENCY SUMMARY</h2></div><div className="efficiency-grid">{[['Success Rate', '95.5%', '↑'], ['Cycle Time', '4.2 min', '↓ better'], ['Automation Rate', '68.4%', '↑'], ['Error Rate', '4.5%', '↓ better'], ['SLA Compliance', '91.2%', '↑'], ['Cost / Execution', '$1.00', '→ stable']].map(r => <div key={r[0]}><span>{r[0]}</span><strong>{r[1]}</strong><em>{r[2]}</em></div>)}</div></section>

    <Section title="TARGETS, GAP & BENCHMARK"><div className="three-col"><article className="card panel"><h3>Operational Targets</h3>{[['Cycle Time', '3.0 min', '4.2 min', 'Behind', 'red'], ['Success Rate', '97%', '95.5%', 'Behind', 'amber'], ['Automation Rate', '80%', '68.4%', 'Behind', 'amber'], ['Error Rate', '<2%', '4.5%', 'Behind', 'red'], ['SLA Compliance', '95%', '91.2%', 'Behind', 'amber']].map(r => <div className="target" key={r[0]}><span>{r[0]}</span><b>{r[2]} <small>/ {r[1]}</small></b><em className={r[4]}>{r[3]}</em></div>)}<p className="caption">Targets are organization-defined. Never set automatically.</p></article><article className="card panel"><h3>Operational Gap</h3>{[['Cycle Time', '3.0 min', '4.2 min', '+1.2 min'], ['Success Rate', '97%', '95.5%', '-1.5pp'], ['Automation', '80%', '68.4%', '-11.6pp'], ['Error Rate', '<2%', '4.5%', '+2.5pp'], ['SLA', '95%', '91.2%', '-3.8pp']].map(r => <div className="gap-row" key={r[0]}><span>{r[0]}</span><b>{r[1]}</b><b>{r[2]}</b><em>{r[3]}</em></div>)}</article><article className="card panel"><h3>Operational Benchmark</h3>{[['Success Rate', '95.5%', '94.2%', '93.8%'], ['Cycle Time', '4.2 min', '5.1 min', '6.4 min'], ['Error Rate', '4.5%', '5.1%', '6.2%'], ['Automation', '68.4%', '58.2%', '52.4%'], ['SLA', '91.2%', '89.4%', '87.2%']].map(r => <div className="benchmark" key={r[0]}><span>{r[0]}</span><b>{r[1]}</b><small>{r[2]} internal · {r[3]} industry</small><em className="teal">Ahead</em></div>)}</article></div></Section>

    <Section title="OPERATIONAL TRENDS"><div className="trend-chips">{['Process Volume', 'Success Rate', 'Cycle Time', 'Automation Rate', 'Error Rate', 'SLA Compliance', 'Cost', 'Capacity'].map(x => <button key={x} className={x === 'Process Volume' ? 'chip active' : 'chip'}>{x}{x === 'Process Volume' && ' ✓'}</button>)}</div><div className="card panel"><svg className="wide-chart" viewBox="0 0 1100 190" role="img" aria-label="Twelve month operational trends"><path d="M0 150 C120 136 160 145 250 116 S400 136 500 98 S650 112 750 68 S900 86 1100 20 L1100 190 L0 190Z" fill="var(--chart-3)" opacity=".15" /><path d="M0 150 C120 136 160 145 250 116 S400 136 500 98 S650 112 750 68 S900 86 1100 20" fill="none" stroke="var(--chart-3)" strokeWidth="3" /><path d="M0 158 C120 145 180 152 260 132 S420 145 520 115 S680 130 770 88 S940 105 1100 48" fill="none" stroke="var(--muted-foreground)" strokeDasharray="7 7" strokeWidth="2" /></svg></div></Section>

    <Section title="OPERATIONAL ANOMALIES"><div className="card panel"><div className="table-wrap"><table><thead><tr><th>Metric</th><th>Process</th><th>System</th><th>Date</th><th>Observed</th><th>Expected</th><th>Difference</th><th></th></tr></thead><tbody>{[['Error Rate', 'CRM Data Sync', 'CRM API', 'Mar 18', '28.4%', '2–5%', '+23.4pp', 'red'], ['Cycle Time', 'Compliance Reporting', 'Internal', 'Mar 21', '124 min', '25–35 min', '+89 min', 'amber'], ['Process Volume', 'Order Processing', 'ERP', 'Mar 24', '840 orders', '4,800–6,200', '-4,200', 'red'], ['SLA Breach', 'Lead Qualification', 'CRM', 'Mar 26', '42% breach', '5–10%', '+32pp', 'red']].map(r => <tr key={r[1]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td><td>{r[5]}</td><td className={`${r[7]}-text`}>{r[6]}</td><td><button className="text-btn">View</button></td></tr>)}</tbody></table></div><a href="#anomalies">→ View all anomalies in Anomalies module</a></div></Section>

    <Section title="OPERATIONS DATA HEALTH"><div className="health-grid">{[['Lulu AI Automation Engine', 'Connected ✓', '1 min ago', 'Full coverage', 'teal'], ['CRM (Salesforce)', 'Connected ✓', '2 min ago', 'Missing: None', 'teal'], ['ERP System', 'Partial ⚠', '4 hrs ago', 'Missing: Mar 20–22', 'amber'], ['Support Platform', 'Connected ✓', '5 min ago', 'Metrics: all', 'teal'], ['Project Management', 'Connected ✓', '8 min ago', 'Metrics: all', 'teal']].map(r => <article className="card health" key={r[0]}><strong>{r[0]}</strong><span className={r[4]}>{r[1]}</span><small>Sync: {r[2]}</small><small>{r[3]}</small></article>)}</div><p className="caption">To manage operational data connections, open Integrations →</p></Section>

    <Section title="KEY OPERATIONS KPIs"><a className="explorer" href="#explorer">→ Open KPI Explorer</a><div className="kpi-grid compact">{metrics.concat([{
              label: 'Manual Workload',
              value: '90,128',
              prev: '86,420 prev.',
              delta: '+4.2%',
              tone: 'amber',
              direction: 'up'
            }, {
              label: 'Capacity Utilization',
              value: '72.4%',
              prev: '68.8% prev.',
              delta: '+3.6%',
              tone: 'amber',
              direction: 'up'
            }]).map(m => <article className="card kpi" key={m.label}><div className="kpi-top"><p>{m.label}</p><Sparkline tone={m.tone} /></div><strong className="kpi-value">{m.value}</strong><span className="prev">{m.prev}</span><span className={`delta ${m.tone}`}>{m.direction === 'up' ? '↑' : '↓'} {m.delta}</span></article>)}</div></Section>

    <section className="section ai-panel"><div className="section-title"><h2>EXPLAIN OPERATIONAL PERFORMANCE</h2><span className="ai-pill">✦ AI Assessment</span></div><p className="caption">Based on connected operational data. Not operational system configuration.</p><ul>{aiBullets.map(b => <li key={b}>{b}</li>)}</ul><a href="#recommendations">Want to act on these findings? → View AI Recommendations</a></section>

    <section className="ask-panel"><p className="eyebrow">ASK LULU AI</p><h2>Make sense of your operations.</h2><div className="ask-input"><input value={ask} onChange={e => setAsk(e.target.value)} placeholder="Ask Lulu AI about your operational performance..." aria-label="Ask Lulu AI" /><button aria-label="Send question"><Send size={17} /></button></div><div className="prompt-grid">{['Which processes are slowest?', 'Where are our biggest bottlenecks?', 'What is our automation rate?', 'Where are SLA breaches?', 'Which workflows fail most?', 'How much time are automations saving?', 'Which systems cause failures?', 'Where are we over capacity?'].map(p => <button key={p} onClick={() => setAsk(p)}>{p}</button>)}</div></section>
    <footer>Data Sources: Lulu AI Automation, CRM, ERP (Partial), Support Platform, Project Mgmt <span>Last updated: 1 min ago · Period: Last 30 Days</span></footer>
  </main></div></div>;
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
          <span data-lulu-section-soon={section.label !== "Website" ? "true" : undefined}>{section.label}</span>
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
