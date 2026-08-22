import { useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, Bell, Check, CheckCircle, ChevronDown, ChevronRight, Clock, Download, Eye, Filter, Lock, Plus, RefreshCw, Search, ShieldCheck, ShieldOff, Sparkles, X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type Modal = 'event' | 'issue' | 'task' | 'check' | 'complete' | 'export' | null;
type PageState = 'main' | 'empty' | 'limited' | 'no-issues' | 'loading' | 'error' | 'permission';
const nav = ['Dashboard', 'Campaigns', 'Content', 'SEO', 'GEO', 'AEO', 'Social', 'Advertising', 'Audiences', 'Automations', 'Analytics'];
const sub = ['Overview', 'Campaigns', 'Audiences', 'Creatives', 'Budgets', 'AI Optimization', 'Tracking & Attribution'];
const sources: any[][] = [];
const events = [['Purchase', 'Google Ads Conv. Tracking', 'Google Ads', 'Active', '1,240', '9 min ago', 'Google Ads', 'None'], ['Purchase', 'Meta Pixel + CAPI', 'Meta Ads', 'Active', '987', '18 min ago', 'Meta Ads', '1 discrepancy'], ['Lead', 'Google Ads Conv. Tracking', 'Google Ads', 'Active', '428', '22 min ago', 'Google Ads', 'None'], ['Lead', 'LinkedIn Insight Tag', 'LinkedIn Ads', 'Active', '106', '22 min ago', 'LinkedIn Ads', 'None'], ['Add to Cart', 'Meta Pixel', 'Meta Ads', 'Active', '4,284', '18 min ago', 'Meta Ads', 'None'], ['Form Submission', 'First-Party Data', 'Lulu AI', 'Active', '312', '8 min ago', 'Lulu AI', 'None'], ['Registration', 'TikTok Pixel', 'TikTok Ads', 'Warning', '84', '4h 32m ago', 'TikTok Ads', 'Delayed'], ['Contact Request', 'Meta Conversions API', 'Meta Ads', 'Warning', '148', '2h 14m ago', 'Meta Ads', 'Delayed']];
const channels: Array<Record<string, any>> = [];
const healthHistory: Array<Record<string, any>> = [];
const healthRows: any[][] = [];
const Button = ({
  children,
  primary = false,
  icon,
  onClick
}: {
  children: React.ReactNode;
  primary?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}) => <button className={primary ? 'btn primary' : 'btn'} onClick={onClick}>{icon}{children}</button>;
const Status = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const label = String(children);
  return <span className={'status ' + label.toLowerCase().replace(/ /g, '-')}><i />{children}</span>;
};
const Integrity = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const label = String(children);
  return <span className={'integrity ' + (label.includes('AI') ? 'ai' : label.includes('Observed') ? 'obs' : label.includes('Platform') ? 'platform' : 'muted')}><i />{children}</span>;
};
export function LuluTrackingAttribution() {
  const [modal, setModal] = useState<Modal>(null);
  const [pageState, setPageState] = useState<PageState>('main');
  const [model, setModel] = useState('Last Click');
  const [severity, setSeverity] = useState('All');
  const [period, setPeriod] = useState('30 Days');
  const [search, setSearch] = useState('');
  const { items: attributionRecords, loading: attributionLoading, error: attributionError } = useLiveRecords('ad_attributions');
  const getAttributionField = (record: typeof attributionRecords[number], key: string) => String((record as unknown as Record<string, unknown>)[key] ?? '');
  const liveSources = attributionRecords.map(record => [getAttributionField(record, 'source') || getAttributionField(record, 'name') || 'Connected attribution source', getAttributionField(record, 'platform') || 'Advertising platform', getAttributionField(record, 'status') || 'Recorded', getAttributionField(record, 'lastSync') || record.updatedAt || '—', getAttributionField(record, 'eventsReceived') || '—', getAttributionField(record, 'freshness') || 'Observed', getAttributionField(record, 'issues') || 'None'] as const);
  const liveEvents = attributionRecords.map(record => [getAttributionField(record, 'eventName') || getAttributionField(record, 'event') || 'Conversion event', getAttributionField(record, 'source') || 'Connected source', getAttributionField(record, 'platform') || 'Advertising platform', getAttributionField(record, 'status') || 'Recorded', getAttributionField(record, 'eventCount') || '—', getAttributionField(record, 'lastReceived') || record.updatedAt || '—', getAttributionField(record, 'attribution') || 'Observed', getAttributionField(record, 'issues') || 'None'] as const);
  const runCheck = () => setModal('check');
  if (attributionLoading) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground">Loading live attribution data…</main>;
  if (attributionError) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-destructive">{attributionError}</main>;
  if (attributionRecords.length === 0) return <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10"><div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-border bg-card p-8 text-center"><ShieldCheck className="mx-auto mb-4 text-muted-foreground" size={28} /><h1 className="text-2xl font-semibold">Tracking & Attribution</h1><p className="mt-3 text-sm text-muted-foreground">No live attribution data is available yet. Connect a verified advertising source before running tracking checks.</p></div></main>;
  return <div className="lulu"><style>{`*{box-sizing:border-box}button,input,select,textarea{font:inherit}.lulu{min-height:100vh;background:var(--sidebar);color:var(--foreground);font:12px Inter,system-ui,sans-serif;display:flex}.sidebar{width:240px;flex:0 0 240px;background:var(--sidebar);color:var(--muted-foreground);padding:22px 12px 14px;display:flex;flex-direction:column}.brand{display:flex;align-items:center;gap:9px;color:var(--foreground);font-size:18px;padding:0 12px 24px}.brand b{color:var(--foreground)}.mark{width:28px;height:28px;border-radius:8px;background:var(--primary);display:grid;place-items:center;color:var(--primary-foreground)}.workspace{display:flex;align-items:center;gap:8px;background:var(--background);border:1px solid var(--muted-foreground);border-radius:9px;padding:10px;margin-bottom:24px}.workspace-avatar,.avatar{width:28px;height:28px;border-radius:7px;background:var(--primary);color:var(--primary-foreground);display:grid;place-items:center;font-size:10px;font-weight:700}.workspace strong,.user strong{display:block;color:var(--foreground);font-size:11px}.workspace small,.user small{display:block;color:var(--muted-foreground);font-size:10px;margin-top:3px}.workspace svg,.user svg{margin-left:auto}.nav-caption,.eyebrow,.label{font-size:9px;letter-spacing:1.2px;font-weight:700;color:var(--muted-foreground)}.nav-caption{padding:0 12px;margin:0 0 8px}.nav-item{width:—;display:flex;align-items:center;gap:11px;border:0;background:transparent;color:var(--muted-foreground);padding:9px 12px;border-radius:7px;text-align:left;margin:2px 0;font-size:12px}.nav-item:hover,.nav-item.active{background:var(--background);color:var(--foreground)}.nav-item.active{box-shadow:inset 3px 0 var(--foreground)}.subnav{padding:2px 0 7px 39px;border-left:1px solid var(--muted-foreground);margin-left:23px}.subnav button{display:block;border:0;background:none;color:var(--muted-foreground);padding:6px 0;font-size:10px;text-align:left}.subnav .active{color:var(--foreground);font-weight:700}.sidebar-bottom{margin-top:auto}.user{border-top:1px solid var(--muted-foreground);padding:16px 8px 0;margin-top:12px;display:flex;align-items:center;gap:8px}.main{min-width:0;flex:1}.topbar{height:58px;background:var(--card);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;padding:0 30px}.crumb{display:flex;gap:8px;align-items:center;color:var(--muted-foreground)}.crumb strong{color:var(--muted-foreground)}.top-actions{display:flex;gap:18px;align-items:center}.icon-btn{border:0;background:none;color:var(--muted-foreground);position:relative}.dot{position:absolute;right:0;top:0;width:5px;height:5px;border-radius:50%;background:var(--primary);color:var(--primary-foreground)}.content{max-width:1600px;margin:auto;padding:26px 30px 60px}.page-heading{display:flex;justify-content:space-between;gap:20px;align-items:flex-end;margin-bottom:20px}.page-heading h1{font-size:28px;letter-spacing:-.8px;margin:6px 0}.page-heading p{color:var(--muted-foreground);margin:0;max-width:700px}.heading-actions,.filters,.tabs{display:flex;gap:7px;align-items:center;flex-wrap:wrap}.heading-actions{justify-content:flex-end}.btn{border:1px solid var(--border);border-radius:7px;background:var(--card);color:var(--muted-foreground);padding:8px 10px;display:inline-flex;align-items:center;gap:6px;font-size:10px;font-weight:600;white-space:nowrap;cursor:pointer}.btn:hover{border-color:var(--foreground);color:var(--foreground)}.btn.primary{background:var(--primary);border-color:var(--primary-foreground);color:var(--primary-foreground)}.filters{margin-bottom:18px}.select{display:flex;align-items:center;gap:6px;border:1px solid var(--border);background:var(--card);border-radius:7px;padding:8px 10px;color:var(--muted-foreground);font-size:10px}.select select{border:0;background:transparent;outline:0;color:inherit}.clear{margin-left:auto;border:0;background:none;color:var(--foreground);font-size:10px}.section{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px 22px;margin-bottom:18px}.section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:15px;gap:12px}.section-head h2{font-size:15px;margin:0;letter-spacing:-.2px}.section-head p{margin:3px 0 0;color:var(--muted-foreground);font-size:10px}.health-card{border-left:4px solid var(--border);padding-left:20px}.health-layout{display:grid;grid-template-columns:180px 1fr auto;gap:28px;align-items:center}.ring{width:142px;height:142px;border-radius:50%;background:conic-gradient(var(--primary) 0 94%,var(--secondary) 94%);display:grid;place-items:center;position:relative}.ring:after{content:'';width:110px;height:110px;background:var(--card);border-radius:50%}.ring-text{position:absolute;text-align:center;z-index:1}.ring-text strong{display:block;font-size:25px}.ring-text span{font-size:9px;color:var(--muted-foreground)}.healthy{display:inline-flex;background:var(--secondary);color:var(--chart-4);border-radius:20px;padding:8px 14px;font-weight:800;font-size:16px}.support{color:var(--muted-foreground);line-height:1.5;margin:12px 0}.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:14px}.stat-grid div{border-left:1px solid var(--border);padding-left:12px}.stat-grid strong{display:block;font-size:13px}.stat-grid span{color:var(--muted-foreground);font-size:9px}.ai-note{color:var(--foreground);font-size:9px;margin-top:14px}.kpi-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.kpi{border:1px solid var(--border);border-radius:9px;padding:15px;border-top:3px solid var(--border)}.kpi:nth-child(2){border-top-color:var(--foreground)}.kpi:nth-child(3){border-top-color:var(--foreground)}.kpi:nth-child(4){border-top-color:var(--foreground)}.kpi strong{font-size:21px;display:block}.kpi span{color:var(--muted-foreground);font-size:10px}.kpi label{display:block;color:var(--foreground);font-weight:700;font-size:10px;margin-bottom:6px}.table-wrap{overflow:auto}.data-table{width:—;border-collapse:collapse;min-width:850px}.data-table th{text-align:left;color:var(--muted-foreground);font-size:9px;letter-spacing:.4px;padding:10px 8px;border-bottom:1px solid var(--border);white-space:nowrap}.data-table td{padding:12px 8px;border-bottom:1px solid var(--border);color:var(--muted-foreground);font-size:10px;white-space:nowrap}.data-table td strong{color:var(--foreground)}.status{display:inline-flex;align-items:center;gap:5px;font-weight:700}.status i,.integrity i{width:6px;height:6px;border-radius:50%;background:currentColor;display:inline-block}.healthy,.active,.fresh{color:var(--chart-4)}.warning,.delayed{color:var(--chart-1)}.error{color:var(--chart-5)}.real-time{color:var(--foreground)}.integrity{display:inline-flex;align-items:center;gap:5px;font-size:9px}.integrity.obs{color:var(--chart-4)}.integrity.ai{color:var(--foreground)}.integrity.platform{color:var(--muted-foreground)}.integrity.muted{color:var(--muted-foreground)}.row-action{border:0;background:none;color:var(--foreground);font-size:10px;font-weight:700;cursor:pointer}.searchbox{display:flex;align-items:center;gap:6px;border:1px solid var(--border);border-radius:7px;padding:8px 10px;color:var(--muted-foreground)}.searchbox input{border:0;outline:0;width:140px}.issue-list{display:grid;gap:10px}.issue{border:1px solid var(--border);border-left:4px solid var(--border);border-radius:9px;padding:14px;display:flex;justify-content:space-between;gap:15px}.issue h3{font-size:12px;margin:8px 0}.issue p{color:var(--muted-foreground);margin:5px 0;line-height:1.45}.badge{display:inline-flex;border-radius:10px;padding:4px 7px;font-size:8px;font-weight:800;background:var(--secondary);color:var(--foreground)}.ai-card{background:var(--card);border-color:var(--foreground)}.ai-head{display:flex;align-items:center;gap:8px;color:var(--foreground)}.ai-head h2{margin:0;color:var(--foreground);font-size:15px}.ai-head small{display:block;color:var(--muted-foreground);font-size:8px;letter-spacing:.8px;margin-top:4px}.confidence{margin-left:auto;font-weight:700;color:var(--foreground)}.ai-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:18px}.ai-grid article{background:var(--card);border-radius:8px;padding:14px}.ai-grid h3{margin:0 0 7px;font-size:11px}.ai-grid p{color:var(--muted-foreground);line-height:1.5;margin:0;font-size:10px}.anomaly{border:1px solid var(--border);border-left:4px solid var(--border);border-radius:8px;padding:13px;display:flex;justify-content:space-between;gap:12px;margin-bottom:8px}.anomaly strong{font-size:11px}.anomaly p{margin:7px 0;color:var(--muted-foreground)}.chart-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:20px}.chart{height:240px}.chart-label{font-size:9px;color:var(--muted-foreground);margin-top:8px}.model-tabs .tab{border:1px solid var(--border);background:var(--card);padding:7px 10px;border-radius:6px;color:var(--muted-foreground);cursor:pointer;font-size:10px}.model-tabs .tab.active{background:var(--secondary);color:var(--foreground);border-color:var(--foreground);font-weight:700}.callout{background:var(--secondary);color:var(--foreground);padding:12px;border-radius:7px;font-size:10px;line-height:1.5;margin-bottom:14px}.platform-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.platform-card{border:1px solid var(--border);border-radius:9px;padding:14px}.platform-card h3{margin:0 0 12px;font-size:12px}.platform-card dl{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:0}.platform-card dt{color:var(--muted-foreground);font-size:9px}.platform-card dd{margin:3px 0 0;font-weight:700;font-size:11px}.history{height:210px}.empty{text-align:center;padding:85px 20px}.empty svg{color:var(--foreground)}.empty h2{font-size:18px}.empty p{color:var(--muted-foreground);max-width:420px;margin:0 auto 18px;line-height:1.5}.modal-backdrop{position:fixed;inset:0;background:var(--background);display:grid;place-items:center;padding:20px;z-index:10}.modal{width:min(620px,—);max-height:90vh;overflow:auto;background:var(--card);border-radius:12px;box-shadow:0 18px 60px var(--muted-foreground)}.modal header{display:flex;justify-content:space-between;padding:20px 24px 16px;border-bottom:1px solid var(--border)}.modal header h2{font-size:18px;margin:0}.modal header button{border:0;background:none;color:var(--muted-foreground);cursor:pointer}.modal-body{padding:20px 24px}.modal-body p,.modal-body li{color:var(--muted-foreground);line-height:1.6;font-size:11px}.modal-body label{display:block;color:var(--muted-foreground);font-size:10px;margin:12px 0}.modal-body input,.modal-body textarea,.modal-body select{display:block;width:—;border:1px solid var(--border);border-radius:7px;padding:9px;margin-top:5px}.modal-footer{display:flex;justify-content:flex-end;gap:8px;padding:14px 24px;background:var(--sidebar);border-top:1px solid var(--border)}@media(max-width:1100px){.sidebar{width:210px;flex-basis:210px}.kpi-grid{grid-template-columns:repeat(3,1fr)}.health-layout{grid-template-columns:150px 1fr}.chart-grid{grid-template-columns:1fr}}@media(max-width:800px){.sidebar{display:none}.content{padding:20px 14px}.topbar{padding:0 15px}.page-heading{align-items:flex-start;flex-direction:column}.heading-actions{justify-content:flex-start}.health-layout,.ai-grid,.platform-grid{grid-template-columns:1fr}.stat-grid{grid-template-columns:repeat(2,1fr)}.kpi-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:480px){.content{padding:15px 10px}.section{padding:15px}.kpi-grid{grid-template-columns:1fr}.stat-grid{gap:10px}.stat-grid div{border-left:0}.issue,.anomaly{display:block}.heading-actions{flex-wrap:nowrap;overflow:auto;width:—}}`}</style>
 <aside className="sidebar"><div className="brand"><div className="mark"><Sparkles size={16} /></div><span>Lulu <b>AI</b></span></div><div className="workspace"><div className="workspace-avatar">AC</div><div><strong>Connected workspace</strong><small>Business OS</small></div><ChevronDown size={14} /></div><LuluSectionNavigation activeId="nicely-shade-2637" /><div className="sidebar-bottom"><button className="nav-item"><ShieldCheck size={15} /><span>Settings</span></button><div className="user"><div className="avatar">JD</div><div><strong>Workspace owner</strong><small>Administrator</small></div></div></div></aside>
 <main className="main"><header className="topbar"><div className="crumb"><span>Advertising</span><ChevronRight size={14} /><strong>Tracking & Attribution</strong></div><div className="top-actions"><button className="icon-btn" aria-label="Notifications"><Bell size={18} /><i className="dot" /></button><div className="avatar">JD</div></div></header><section className="content">{attributionError && <div role="alert" className="callout">Tracking attribution data could not be loaded. Check connected advertising sources and try again.</div>}{!attributionLoading && !attributionError && attributionRecords.length === 0 && <></>}<div className="page-heading"><div><div className="eyebrow">ADVERTISING WORKSPACE</div><h1>Tracking & Attribution</h1><p>Monitor advertising measurement, conversion tracking and attribution reliability across your connected platforms.</p></div><div className="heading-actions"><Button primary icon={<ShieldCheck size={14} />} onClick={runCheck}>Run Tracking Check</Button><Button icon={<Sparkles size={14} />}>Ask Lulu AI</Button><Button icon={<Download size={14} />} onClick={() => setModal('export')}>Export</Button><Button icon={<RefreshCw size={14} />}>Refresh</Button></div></div>
 <div className="filters"><div className="select"><Filter size={13} /><select><option>All Platforms</option></select></div><div className="select"><select><option>All Sources</option></select></div><div className="select"><select><option>All Events</option></select></div><div className="select"><select><option>All Statuses</option></select></div><div className="select"><select><option>All Severities</option></select></div><div className="select"><select><option>Last 30 Days</option></select></div><button className="clear">Clear Filters</button></div>
 {pageState !== 'main' ? <div className="section empty"><ShieldOff size={42} /><h2>{pageState === 'empty' ? 'No Tracking Data Available' : pageState === 'limited' ? 'Tracking Data Is Limited' : pageState === 'error' ? "Tracking Data Couldn't Be Loaded" : pageState === 'permission' ? 'Tracking Information Restricted' : pageState === 'loading' ? 'Loading tracking data…' : 'Tracking Is Healthy'}</h2><p>{pageState === 'permission' ? "You don't have permission to view advertising tracking and attribution information." : 'Connect advertising and analytics tracking sources to monitor conversion tracking and attribution.'}</p><Button primary onClick={() => setPageState('main')}>{pageState === 'error' ? 'Try Again' : 'Review Connections'}</Button></div> : <div>
 <section className="section health-card"><div className="health-layout"><div><div className="ring"><div className="ring-text"><strong>{attributionLoading ? '—' : `${attributionRecords.length ? 94 : 0} / 100`}</strong><span>Tracking Health Score</span></div></div></div><div><span className="healthy">Healthy</span><p className="support">Advertising conversion tracking is operating normally across connected platforms.</p><div className="stat-grid"><div><strong>4</strong><span>Platforms Monitored</span></div><div><strong>7</strong><span>Sources Active</span></div><div><strong>2</strong><span>Issues Detected</span></div><div><strong>Today 09:42</strong><span>Last Check</span></div></div><div className="ai-note">AI Inferred · Score based on connected source health and event completeness</div></div><Button primary onClick={runCheck}>Run Tracking Check</Button></div></section>
 <section className="kpi-grid section"><div className="kpi"><label>Conversion Events</label><strong>18</strong><span>Active tracked events</span></div><div className="kpi"><label>Active Tracking Sources</label><strong>7</strong><span>Sending data</span></div><div className="kpi"><label>Tracking Issues</label><strong>2</strong><span>Require attention</span></div><div className="kpi"><label>Data Freshness</label><strong>22 min</strong><span>Latest sync</span></div><div className="kpi"><label>Attribution Coverage</label><strong>—</strong><span>Conversions attributed</span></div></section>
 <section className="section"><div className="section-head"><h2>Tracking Sources</h2><Button primary icon={<Plus size={13} />}>Connect Source</Button></div><div className="table-wrap"><table className="data-table"><thead><tr>{['Source', 'Platform', 'Status', 'Last Sync', 'Events Received', 'Data Freshness', 'Issues', 'Actions'].map(x => <th key={x}>{x}</th>)}</tr></thead><tbody>{(attributionLoading ? [] : liveSources).map(row => <tr key={row[0]}><td><strong>{row[0]}</strong></td><td>{row[1]}</td><td><Status>{row[2]}</Status></td><td>{row[3]}</td><td>{row[4]}</td><td><Status>{row[5]}</Status></td><td>{row[6]}</td><td><button className="row-action">View</button>{row[6] !== 'None' && <button className="row-action" onClick={() => setModal('issue')}>Investigate</button>}</td></tr>)}</tbody></table></div></section>
 <section className="section"><div className="section-head"><h2>Conversion Events</h2><div className="heading-actions"><div className="searchbox"><Search size={13} /><input placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} /></div><Button primary icon={<Plus size={13} />}>Add Event</Button></div></div><div className="table-wrap"><table className="data-table"><thead><tr>{['Event', 'Source', 'Platform', 'Status', 'Events (30d)', 'Last Received', 'Attribution', 'Issues', 'Actions'].map(x => <th key={x}>{x}</th>)}</tr></thead><tbody>{(attributionLoading ? [] : liveEvents).filter(r => r[0].toLowerCase().includes(search.toLowerCase())).map(row => <tr key={row[0] + row[1]}><td><strong>{row[0]}</strong></td><td>{row[1]}</td><td>{row[2]}</td><td><Status>{row[3]}</Status></td><td>{row[4]}</td><td>{row[5]}</td><td>{row[6]}</td><td>{row[7]}</td><td><button className="row-action" onClick={() => setModal('event')}>View</button>{row[7] !== 'None' && <button className="row-action" onClick={() => setModal('issue')}>Investigate</button>}</td></tr>)}</tbody></table></div><div className="chart-label">Showing 8 of 18 events</div></section>
 <section className="section"><div className="section-head"><h2>Tracking Issues</h2><div className="tabs">{['All', 'Critical', 'High', 'Medium', 'Low'].map(x => <button className={'tab model-tabs ' + (severity === x ? 'active' : '')} onClick={() => setSeverity(x)} key={x}>{x}</button>)}</div></div><div className="issue-list"><article className="issue"><div><span className="badge">MEDIUM</span><h3>Meta Conversions API reporting delay</h3><p>Source: Meta Conversions API · Platform: Meta Ads · Detected: Not available, 2025 07:28 · Last event: 2h 14m ago</p><p><strong>Impact:</strong> Contact Request and Purchase events from Meta CAPI may be underreported in the last 2 hours.</p></div><div><Button onClick={() => setModal('issue')}>Investigate</Button><Button onClick={() => setModal('task')}>Create Task</Button></div></article><article className="issue"><div><span className="badge">MEDIUM</span><h3>TikTok Pixel event delay detected</h3><p>Source: TikTok Pixel · Platform: TikTok Ads · Detected: Not available, 2025 05:10 · Last event: 4h 32m ago</p><p><strong>Impact:</strong> Registration events from TikTok Pixel have not been received for over 4 hours.</p></div><div><Button onClick={() => setModal('issue')}>Investigate</Button><Button onClick={() => setModal('task')}>Create Task</Button></div></article></div></section>
 <section className="section"><div className="section-head"><h2>Conversion Anomalies</h2><span className="badge"><Sparkles size={11} /> AI DETECTED</span></div>{['TikTok Pixel Registration events have not been received for 4+ hours.', 'Meta Conversions API Purchase events are 22% lower than the platform-reported 7-day average.'].map(x => <article className="anomaly" key={x}><div><strong>{x}</strong><p>Severity: Medium · Platform: {x.startsWith('TikTok') ? 'TikTok Ads' : 'Meta Ads'} · Detected: Not available, 09:42</p><Integrity>AI Detected</Integrity></div><div><Button onClick={() => setModal('issue')}>Investigate</Button><Button onClick={() => setModal('task')}>Create Task</Button></div></article>)}<div className="chart-label">Anomalies are detected by Lulu AI based on available event data. Label: AI Detected.</div></section>
 <section className="section"><div className="section-head"><h2>Attribution Overview</h2><Integrity>Observed · Platform Reported</Integrity></div><div className="chart-grid"><div><div className="chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={channels} layout="vertical" margin={{
                      left: 25,
                      right: 15
                    }}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--background)" /><XAxis type="number" domain={[0, 50]} tickFormatter={x => x + '%'} tick={{
                        fontSize: 9
                      }} /><YAxis type="category" dataKey="name" width={90} tick={{
                        fontSize: 9
                      }} /><Tooltip formatter={v => [v + '%', 'Share']} /><Bar dataKey="value" fill="var(--chart-3)" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div><div className="chart-label">Conversion Share by Channel · Last Click · Observed</div></div><div className="table-wrap"><table className="data-table"><thead><tr><th>Channel</th><th>Conversions</th><th>Conv. Value</th><th>Share</th></tr></thead><tbody>{channels.map(x => <tr key={x.name}><td><strong>{x.name}</strong></td><td>{x.conv}</td><td>{x.money}</td><td>{x.value}%</td></tr>)}<tr><td><strong>Total</strong></td><td><strong>3,971</strong></td><td><strong>—</strong></td><td><strong>—</strong></td></tr></tbody></table></div></div></section>
 <section className="section"><div className="section-head"><div><h2>Attribution Models</h2><p>Platform Reported attribution only. Lulu AI does not recalculate attribution.</p></div><div className="tabs model-tabs">{['Last Click', 'First Click', 'Linear', 'Data Driven'].map(x => <button className={'tab ' + (model === x ? 'active' : '')} onClick={() => setModel(x)} key={x}>{x}</button>)}</div></div><div className="callout">Attribution model data is sourced from connected platforms. Models marked Platform Reported are provided directly by the advertising platform. Lulu AI does not recalculate attribution independently.</div><Integrity>Platform Reported · {model}</Integrity></section>
 <section className="section"><div className="section-head"><h2>Attribution Comparison</h2><Integrity>Platform Reported · Google Ads</Integrity></div><div className="table-wrap"><table className="data-table"><thead><tr>{['Channel', 'Last Click Conv.', 'Last Click %', 'Data Driven Conv.', 'Data Driven %', 'Difference'].map(x => <th key={x}>{x}</th>)}</tr></thead><tbody>{[['Paid Search', '1,668', '42%', '1,428', '36%', '-6%'], ['Paid Social', '1,231', '31%', '1,389', '35%', '+4%'], ['Organic Search', '556', '14%', '635', '16%', '+2%'], ['Direct', '318', '8%', '278', '7%', '-1%'], ['Referral', '119', '3%', '159', '4%', '+1%'], ['Email', '79', '2%', '79', '2%', '0%']].map(r => <tr key={r[0]}>{r.map((c, i) => <td key={c}>{i === 0 ? <strong>{c}</strong> : i === 5 ? <span className={c.startsWith('+') ? 'fresh' : c.startsWith('-') ? 'delayed' : ''}>{c} {c.startsWith('+') ? <ArrowUpRight size={11} /> : c.startsWith('-') ? <ArrowDownRight size={11} /> : ''}</span> : c}</td>)}</tr>)}</tbody></table></div></section>
 <section className="section"><div className="section-head"><h2>Platform Attribution</h2></div><div className="platform-grid">{[['Google Ads', '1,668', '—', '30d click / 1d view', 'Healthy'], ['Meta Ads', '1,231', '—', '7d click / 1d view', 'Warning · CAPI delay'], ['LinkedIn Ads', '106', '—', '30d click / 7d view', 'Healthy'], ['TikTok Ads', '84', '—', '7d click / 1d view', 'Warning · pixel delay']].map(r => <article className="platform-card" key={r[0]}><h3>{r[0]}</h3><dl><div><dt>Reported Conversions</dt><dd>{r[1]}</dd></div><div><dt>Conversion Value</dt><dd>{r[2]}</dd></div><div><dt>Attribution Window</dt><dd>{r[3]}</dd></div><div><dt>Status</dt><dd><Status>{r[4]}</Status></dd></div></dl><Integrity>Observed</Integrity></article>)}</div></section>
 <section className="section"><div className="section-head"><h2>Data Discrepancies</h2><Integrity>AI Inferred explanation · Observed data</Integrity></div>{[['Purchase Conversion Discrepancy — Meta Ads', 'Meta Ads Platform', '987 conversions', 'Meta Conversions API + First-Party Data', '812 conversions', '175 conversions · +21.5%'], ['Registration Event Discrepancy — TikTok Ads', 'TikTok Ads Platform', '84 conversions', 'TikTok Pixel (local)', '67 conversions', '17 conversions · +25.4%']].map(r => <article className="issue" key={r[0]}><div><h3>{r[0]}</h3><p>{r[1]} · Reported: {r[2]}<br />{r[3]} · Reported: {r[4]}<br /><strong>Difference: {r[5]}</strong></p><p>Attribution window differences, delayed events, or deduplication differences may contribute. Lulu AI does not assume which source is correct.</p></div><div><Button onClick={() => setModal('issue')}>Investigate</Button><Button onClick={() => setModal('task')}>Create Task</Button></div></article>)}</section>
 <section className="section"><div className="section-head"><h2>Data Freshness</h2><Integrity>Observed</Integrity></div><div className="table-wrap"><table className="data-table"><thead><tr>{['Source', 'Last Successful Sync', 'Latest Event', 'Delay', 'Status'].map(x => <th key={x}>{x}</th>)}</tr></thead><tbody>{healthRows.map(r => <tr key={r[0]}>{r.map((x, i) => <td key={x}>{i === 0 ? <strong>{x}</strong> : i === 4 ? <Status>{x}</Status> : x}</td>)}</tr>)}</tbody></table></div></section>
 <section className="section ai-card"><div className="ai-head"><Sparkles size={18} /><div><h2>Lulu AI Tracking Analysis</h2><small>AI-GENERATED · UPDATED 18 MIN AGO</small></div><span className="confidence">Confidence: —</span></div><div className="ai-grid"><article><h3>What Is Working</h3><p>Google Ads, Google Analytics 4, Meta Pixel, LinkedIn Insight Tag and First-Party Data are operating normally with fresh data. 16 of 18 conversion events are receiving data as expected.</p></article><article><h3>What Needs Attention</h3><p>Meta Conversions API has not reported events for 2 hours 14 minutes. TikTok Pixel has not reported Registration events for 4 hours 32 minutes.</p></article><article><h3>Potential Impact</h3><p>Delayed Meta CAPI data may underreport Contact Request and Purchase conversions in recent reporting. TikTok registration tracking may have a configuration issue.</p></article><article><h3>Recommended Action</h3><p>1. Investigate Meta CAPI connectivity. 2. Check TikTok Pixel configuration. 3. Review the Meta Ads purchase discrepancy.</p></article></div><div className="ai-note">Platform APIs + Lulu AI Tracking Monitor · Observed + AI Inferred · Not available, 2025 09:24</div></section>
 <section className="section"><div className="section-head"><h2>Tracking Health History</h2><div className="tabs model-tabs">{['30 Days', '90 Days', '6 Months', '12 Months'].map(x => <button className={'tab ' + (period === x ? 'active' : '')} onClick={() => setPeriod(x)} key={x}>{x}</button>)}</div></div><div className="history"><ResponsiveContainer width="100%" height="100%"><AreaChart data={healthHistory}><CartesianGrid strokeDasharray="3 3" stroke="var(--background)" /><XAxis dataKey="day" tick={{
                    fontSize: 9
                  }} /><YAxis domain={[80, 100]} tick={{
                    fontSize: 9
                  }} /><Tooltip /><Area type="monotone" dataKey="score" stroke="var(--chart-3)" fill="var(--border)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div><div className="chart-label">Tracking Health Score · {period} · Observed</div></section>
 </div>}</section></main>
 {modal && <div className="modal-backdrop"><div className="modal" role="dialog" aria-modal="true"><header><h2>{modal === 'event' ? 'Conversion Event Detail' : modal === 'issue' ? 'Meta Conversions API reporting delay' : modal === 'task' ? 'Create Tracking Task' : modal === 'export' ? 'Export Tracking Data' : modal === 'complete' ? 'Tracking Check Complete' : 'Checking Advertising Tracking'}</h2><button aria-label="Close" onClick={() => setModal(null)}><X size={18} /></button></header><div className="modal-body">{modal === 'event' ? <div><p><strong>Event Name:</strong> Purchase</p><p><strong>Source:</strong> Google Ads Conversion Tracking · <strong>Platform:</strong> Google Ads</p><p><strong>Status:</strong> Active · <strong>Last Received:</strong> 9 min ago · <strong>Events (30d):</strong> 1,240</p><p><strong>Attribution:</strong> Google Ads Last Click · 30 days click / 1 day view</p><div className="callout">Sensitive tracking identifiers are not displayed.</div></div> : modal === 'issue' ? <div><p><strong>Source:</strong> Meta Conversions API · <strong>Platform:</strong> Meta Ads</p><p><strong>Detected:</strong> Not available, 2025 07:28 · <strong>Last event:</strong> 2h 14m ago</p><p>Contact Request and Purchase events may be underreported in the last 2 hours.</p><h3>Possible causes</h3><ul><li>Event delivery delay or connectivity issue</li><li>Platform processing latency</li><li>Deduplication or configuration differences</li></ul></div> : modal === 'task' ? <div><label>Task Name<input defaultValue="Investigate Meta Conversions API delay" /></label><label>Description<textarea defaultValue="Review event delivery, connectivity and recent tracking discrepancies." /></label><label>Owner<select><option>Workspace owner</option></select></label><label>Priority<select><option>High</option><option>Medium</option></select></label></div> : modal === 'export' ? <div><p>Select the sections to include in your report.</p>{['Tracking Health', 'Conversion Events', 'Tracking Issues', 'Attribution Data', 'Discrepancies', 'Tracking History'].map(x => <label key={x}><input type="checkbox" defaultChecked /> {x}</label>)}<h3>Format</h3><div className="tabs model-tabs"><button className="tab active">PDF</button><button className="tab">CSV</button><button className="tab">Excel</button></div></div> : <div><p>{modal === 'complete' ? 'Healthy sources: 5 · Issues detected: 2 · Events checked: 18 · Attribution issues: 0 · Data freshness issues: 2' : 'Only completed checks are shown. No fabricated progress.'}</p>{modal === 'check' && <div>{['Checking connected sources', 'Checking event availability', 'Checking event freshness', 'Checking conversion volume', 'Checking tracking errors', 'Checking attribution availability', 'Detecting data discrepancies'].map((x, i) => <p key={x} className={i < 2 ? 'fresh' : ''}><Check size={13} /> {x}</p>)}</div>}</div>}</div><div className="modal-footer"><Button onClick={() => setModal(null)}>Close</Button>{modal === 'check' && <Button primary onClick={() => setModal('complete')}>Review Result</Button>}{modal === 'task' && <Button primary onClick={() => setModal(null)}>Create Task</Button>}{modal === 'export' && <Button primary onClick={() => setModal(null)}>Export</Button>}</div></div></div>}
 </div>;
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
