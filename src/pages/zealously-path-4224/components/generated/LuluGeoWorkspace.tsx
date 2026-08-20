import { useState } from 'react';
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Bell, Bot, Check, ChevronDown, ChevronLeft, CircleHelp, Download, ExternalLink, Filter, Globe2, Layers3, Menu, Plus, RefreshCw, Search, Settings2, ShieldAlert, Sparkles, Target, X, Zap } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type ModalName = 'analysis' | 'complete' | 'prompt' | 'competitor' | 'task' | 'answer' | 'topic' | 'optimize' | 'export' | 'refresh' | null;
type DetailType = 'prompt' | 'competitor' | null;
const nav = ['Dashboard', 'Campaigns', 'Content', 'SEO', 'GEO', 'AEO', 'Social', 'Advertising', 'Audiences', 'Automations', 'Analytics'];
const chartData: Array<Record<string, any>> = [];
const prompts: string[][] = [];
const competitors: any[][] = [];
const sources: any[][] = [];
const topics: any[][] = [];
const opportunities: any[][] = [];
const insights: any[][] = [];
const recommendations: any[][] = [];
function Sidebar({
  collapsed,
  setCollapsed
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {
  return <aside className={collapsed ? 'sidebar collapsed' : 'sidebar'}><div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><strong>LULU<span>AI</span></strong><button aria-label="Collapse sidebar" onClick={() => setCollapsed(!collapsed)}><ChevronLeft size={15} /></button></div><button className="workspace"><span className="workspace-icon">L</span><span className="workspace-name">Connected workspace</span><ChevronDown size={14} /></button><p className="nav-label">MARKETING</p><LuluSectionNavigation activeId="zealously-path-4224" /><div className="sidebar-bottom"><button className="nav-item"><Settings2 size={15} /><span>Settings</span></button><div className="user-small"><span className="avatar">WS</span><span><strong>Workspace owner</strong><small>Admin</small></span></div></div></aside>;
}
function Ring({
  score,
  color,
  size = 120
}: {
  score: number;
  color: string;
  size?: number;
}) {
  const r = 45;
  const c = 2 * Math.PI * r;
  return <div className="ring" style={{
    width: size,
    height: size
  }}><svg viewBox="0 0 110 110" aria-label={`${score} out of 100`}><circle cx="55" cy="55" r={r} fill="none" stroke="var(--border)" strokeWidth="8" /><circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="8" strokeDasharray={`${c * score / 100} ${c}`} strokeLinecap="round" transform="rotate(-90 55 55)" /></svg><strong>{score}</strong></div>;
}
function Modal({
  modal,
  close,
  open
}: {
  modal: ModalName;
  close: () => void;
  open: (m: ModalName) => void;
}) {
  if (!modal) return null;
  const titles: Record<string, string> = {
    analysis: 'Run GEO Analysis',
    complete: 'GEO Analysis Complete',
    prompt: 'Add Prompt',
    competitor: 'Add Competitor',
    task: 'Create GEO Task',
    answer: 'View AI Answer',
    topic: 'Add Topic',
    optimize: 'Optimize with AI',
    export: 'Export GEO Data',
    refresh: 'Refresh GEO Data'
  };
  return <dialog open className="modal-dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-card"><button className="modal-close" aria-label="Close dialog" onClick={close}><X size={17} /></button><div className="modal-kicker"><Sparkles size={15} /> AI WORKSPACE</div><h2 id="modal-title">{titles[modal]}</h2>{modal === 'analysis' && <div><p className="modal-copy">Select the surfaces Lulu AI should inspect. Existing data will be preserved.</p><div className="check-grid">{['AI visibility', 'Prompts', 'AI answers', 'Brand entity', 'Sources', 'Citations', 'Competitors', 'Opportunities', 'Risks'].map(x => <label key={x}><input type="checkbox" defaultChecked />{x}</label>)}</div><p className="status-note"><Check size={15} /> No live GEO analysis has been completed yet.</p></div>}{modal === 'complete' && <div className="complete"><Check size={28} /><p>No live GEO analysis result is available yet.</p><div className="result-grid"><b>— <small>Visibility</small></b><b>— <small>AI mentions</small></b><b>— <small>Opportunities</small></b><b>— <small>Entity issues</small></b></div></div>}{modal === 'answer' && <div><p className="modal-copy">No live AI answer is available for the selected prompt yet.</p><div className="answer-box">Connect GEO data and run an analysis to populate this view.</div><p className="integrity"><ShieldAlert size={14} /> Captured answers are shown only after live GEO data is retrieved.</p></div>}{['prompt', 'competitor', 'task', 'topic'].includes(modal) && <form className="form-grid"><label>{modal === 'prompt' ? 'Prompt text' : modal === 'competitor' ? 'Competitor name' : modal === 'task' ? 'Task name' : 'Topic name'}<input placeholder={modal === 'prompt' ? 'Enter a tracked AI search prompt' : 'Enter a name'} /></label><label>{modal === 'competitor' ? 'Website URL' : modal === 'topic' ? 'Description' : modal === 'task' ? 'Description' : 'Topic'}<input placeholder="Add details" /></label>{modal === 'prompt' && <label>Intent<select><option>Commercial</option><option>Informational</option><option>Transactional</option></select></label>}</form>}{modal === 'optimize' && <div className="modal-copy"><p>Apply an authorized optimization to product descriptions and entity profiles.</p><p className="status-note"><AlertTriangle size={15} /> Changes require your authorization before publishing.</p></div>}{modal === 'export' && <div className="check-grid">{['Summary', 'Prompt Explorer', 'Sources', 'Topics', 'Competitors', 'Opportunities & Risks'].map(x => <label key={x}><input type="checkbox" defaultChecked />{x}</label>)}</div>}{modal === 'refresh' && <p className="modal-copy">Refresh GEO data from connected sources? This may take several minutes and will not change your configuration.</p>}<div className="modal-actions"><button className="ghost" onClick={close}>Cancel</button><button className="primary" onClick={() => modal === 'analysis' ? open('complete') : close()}>{modal === 'analysis' ? 'Start Analysis' : modal === 'refresh' ? 'Refresh' : modal === 'export' ? 'Export' : modal === 'optimize' ? 'Apply Optimization' : modal === 'complete' ? 'Review Results' : `Add ${modal === 'task' ? 'Task' : modal.charAt(0).toUpperCase() + modal.slice(1)}`}</button></div></div></dialog>;
}
export function LuluGeoWorkspace() {
  const [collapsed, setCollapsed] = useState(false);
  const [modal, setModal] = useState<ModalName>(null);
  const [detailType, setDetailType] = useState<DetailType>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [activeMetric, setActiveMetric] = useState('GEO Visibility');
  const { items: geoRecords, loading: geoLoading, error: geoError } = useLiveRecords('marketing_geo_items');
  const getGeoField = (record: typeof geoRecords[number], key: string) => String((record as unknown as Record<string, unknown>)[key] ?? '');
  const livePrompts = geoRecords.map(record => [getGeoField(record, 'prompt') || getGeoField(record, 'title') || 'Tracked GEO prompt', getGeoField(record, 'topic') || 'General', getGeoField(record, 'intent') || 'Informational', getGeoField(record, 'mention') || 'Not Mentioned', getGeoField(record, 'competitors') || '—', getGeoField(record, 'citation') || 'Not Cited', getGeoField(record, 'status') || 'Tracked', getGeoField(record, 'lastChecked') || record.updatedAt || '—', getGeoField(record, 'change') || '—']);
  const displayPrompts = geoLoading ? [] : livePrompts;
  const [activeState] = useState('loaded');
  const open = (m: ModalName) => setModal(m);
  return <div className="app-shell"><style>{styles}</style><Sidebar collapsed={collapsed} setCollapsed={setCollapsed} /><main className="main"><header className="topbar"><button className="mobile-menu" aria-label="Open navigation" onClick={() => setCollapsed(!collapsed)}><Menu size={18} /></button><div className="crumb"><span>Marketing</span><ChevronDown size={13} /><strong>GEO</strong></div><div className="top-actions"><button aria-label="Notifications" className="icon-btn"><Bell size={17} /><i /></button><span className="avatar">WS</span></div></header><div className="page"><div className="page-head"><div><p className="eyebrow">MARKETING / GEO</p><h1>GEO</h1><p className="subtitle">Understand and improve how your business appears across AI-powered search and generative answer systems.</p></div><div className="controls"><select value={dateRange} onChange={e => setDateRange(e.target.value)} aria-label="Date range"><option>Today</option><option>Yesterday</option><option>Last 7 Days</option><option>Last 30 Days</option><option>Last 90 Days</option><option>Last 6 Months</option><option>Year to Date</option></select><button className="ghost"><Filter size={14} /> Filter</button><button className="ghost" onClick={() => open('export')}><Download size={14} /> Export</button><button className="ghost" onClick={() => open('refresh')}><RefreshCw size={14} /></button><button className="primary" onClick={() => open('analysis')}><Zap size={14} /> Run GEO Analysis</button><button className="ask" onClick={() => open('answer')}><Sparkles size={14} /> Ask Lulu AI</button></div></div>{geoError && <div role="alert" className="live-status error">GEO data could not be loaded. Check marketing GEO records and try again.</div>}{!geoLoading && !geoError && geoRecords.length === 0 && <div className="live-status empty">No GEO records are available yet.</div>}<section className="kpi-grid">{([] as string[][]).map(k => <article className="kpi" key={k[1]}><span className={`dot ${k[3]}`} /><p>{k[1]}</p><strong>{k[0]}</strong><small>{k[2]}</small></article>)}</section><div className="search-wrap"><Search size={17} /><input aria-label="Search GEO data" placeholder="Search prompts, topics, sources..." /> <kbd>⌘ K</kbd></div><div className="chips">{['High-Intent Prompts', 'Missing Brand Mentions', 'Competitor Dominated', 'Citation Opportunities', 'Entity Issues', 'High-Impact Opportunities', 'Critical Risks', 'My GEO Tasks'].map(x => <button key={x}>{x}</button>)}</div>{activeState === 'loaded' && <div className={detailType ? 'content-layout has-detail' : 'content-layout'}><div className="sections"><section className="card performance"><div className="section-head"><div><p className="eyebrow">SIGNAL OVER TIME</p><h2>AI Visibility Performance</h2></div><select value={activeMetric} onChange={e => setActiveMetric(e.target.value)} aria-label="Metric"><option>GEO Visibility</option><option>Prompt Coverage</option><option>AI Mentions</option><option>Citation Coverage</option><option>Competitor Visibility</option></select></div><div className="chart"><ResponsiveContainer width="100%" height={220}><AreaChart data={chartData}><defs><linearGradient id="geoFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.26} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} /></linearGradient></defs><XAxis dataKey="week" tick={{
                      fontSize: 10
                    }} axisLine={false} tickLine={false} /><YAxis domain={[0, 100]} tick={{
                      fontSize: 10
                    }} axisLine={false} tickLine={false} /><Tooltip /><Area type="monotone" dataKey="value" stroke="var(--foreground)" strokeWidth={2.5} fill="url(#geoFill)" /></AreaChart></ResponsiveContainer></div><div className="stat-pills">{([] as string[]).map(x => <span key={x}>{x}</span>)}</div></section><section className="card"><div className="section-head"><div><p className="eyebrow">GENERATIVE SIGNAL</p><h2>AI Visibility</h2></div><span className="ai-label"><Sparkles size={12} /> AI-GENERATED · AWAITING LIVE DATA</span></div><div className="visibility-grid"><div className="score-block"><Ring score={0} color="var(--border)" size={155} /><strong>GEO Visibility Score</strong><span className="trend"><ArrowUpRight size={14} /> Awaiting comparison</span></div><div className="metric-list">{([] as string[][]).map(m => <div className="metric-row" key={m[0]}><span>{m[0]}</span><strong>{m[1]}</strong></div>)}<div className="explanation"><Sparkles size={16} /><p>Your score reflects how often AI systems mention, cite, and recommend your business across tracked prompts. Data sources include public AI answer systems, website content, editorial sources, and review profiles.</p></div></div></div></section><section className="card"><div className="section-head"><div><p className="eyebrow">ANSWER SPACE</p><h2>AI Answer Coverage</h2></div><button className="ghost" onClick={() => open('prompt')}><Plus size={14} /> Add Prompt</button></div><div className="mini-stats">{([] as string[][]).map(s => <div key={s[0]}><strong>{s[1]}</strong><span>{s[0]}</span></div>)}</div><div className="table-scroll"><table><thead><tr>{['Prompt', 'AI System', 'Business Mention', 'Competitor Mentions', 'Timestamp'].map(x => <th scope="col" key={x}>{x}</th>)}</tr></thead><tbody>{displayPrompts.slice(0, 5).map(p => <tr key={p[0]} onClick={() => {
                      setDetailType('prompt');
                    }}><td><strong>{p[0]}</strong></td><td>ChatGPT</td><td><span className={p[3] === 'Mentioned' ? 'badge good' : 'badge bad'}>{p[3] === 'Mentioned' ? <Check size={12} /> : <X size={12} />}{p[3]}</span></td><td>{p[5]}</td><td>{p[7]}</td></tr>)}</tbody></table></div></section><section className="card"><div className="section-head"><div><p className="eyebrow">TRACKED QUESTIONS</p><h2>Prompt Explorer</h2></div><button className="ghost" onClick={() => open('prompt')}><Plus size={14} /> Add Prompt</button></div><div className="filter-line">{['Topic', 'Intent', 'Mentioned', 'Not Mentioned', 'Competitor Present', 'Citation Present', 'Date'].map(x => <button key={x}>{x}<ChevronDown size={12} /></button>)}</div>{selectedRows.length > 0 && <div className="bulk"><strong>{selectedRows.length} selected</strong><button>Create Tasks</button><button>Assign Owner</button><button>Change Status</button><button>Export</button><button>Archive</button></div>}<div className="table-scroll"><table className="prompt-table"><thead><tr><th scope="col"><input type="checkbox" aria-label="Select all prompts" /></th>{['Prompt', 'Topic', 'Intent', 'Mention', 'Position', 'Competitors', 'Citation', 'Last Checked', 'Change'].map(x => <th scope="col" key={x}>{x}</th>)}</tr></thead><tbody>{displayPrompts.map(p => <tr key={p[0]} onClick={() => setDetailType('prompt')}><td><input type="checkbox" aria-label={`Select ${p[0]}`} checked={selectedRows.includes(p[0])} onChange={() => setSelectedRows(selectedRows.includes(p[0]) ? selectedRows.filter(x => x !== p[0]) : [...selectedRows, p[0]])} onClick={e => e.stopPropagation()} /></td><td><strong>{p[0]}</strong></td><td><span className="topic-badge">{p[1]}</span></td><td>{p[2]}</td><td>{p[3] === 'Mentioned' ? <Check className="green" size={16} /> : <X className="red" size={16} />}</td><td>{p[4]}</td><td>{p[5]}</td><td><span className={p[6] === 'Cited' ? 'badge good' : 'badge bad'}>{p[6]}</span></td><td>{p[7]}</td><td className={p[8].startsWith('+') ? 'green' : 'red'}>{p[8]}</td></tr>)}</tbody></table></div></section><section className="card"><div className="section-head"><h2>Brand Entity</h2><span className="ai-label"><Sparkles size={12} /> AI-GENERATED</span></div><div className="entity-grid"><div className="entity-info">{([] as string[][]).map(x => <div key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong></div>)}</div><div className="entity-score"><Ring score={0} color="var(--border)" size={130} /><strong>Entity Strength</strong><div className="alert"><AlertTriangle size={15} /><span>No live entity signals available</span></div><button className="link-btn">Review recommended actions <ExternalLink size={13} /></button></div></div></section><section className="card"><div className="section-head"><h2>Entity Clarity</h2><button className="ghost">View all signals</button></div><div className="table-scroll"><table><thead><tr>{['Signal', 'Status', 'Issue', 'Impact', 'Recommended Action'].map(x => <th scope="col" key={x}>{x}</th>)}</tr></thead><tbody>{([] as string[][]).map(x => <tr key={x[0]}><td><strong>{x[0]}</strong></td><td><span className={`status ${x[1].toLowerCase()}`}><CircleHelp size={12} />{x[1]}</span></td><td>{x[2]}</td><td>{x[3]}</td><td><button className="link-btn">{x[4]}</button></td></tr>)}</tbody></table></div></section><section className="card"><div className="section-head"><h2>AI Source Analysis</h2><span className="muted">No live sources monitored yet</span></div><div className="table-scroll"><table><thead><tr>{['Category', 'Source', 'Mentions', 'Citation Frequency', 'Relevance', 'Last Observed', 'Status'].map(x => <th scope="col" key={x}>{x}</th>)}</tr></thead><tbody>{sources.map(s => <tr key={s[1]}><td>{s[0]}</td><td><strong>{s[1]}</strong></td><td>{s[2]}</td><td>{s[3]}</td><td><span className="topic-badge">{s[4]}</span></td><td>{s[5]}</td><td><span className={`status ${s[6] === 'Healthy' ? 'good' : 'warning'}`}><CircleHelp size={12} />{s[6]}</span></td></tr>)}</tbody></table></div></section><section className="card"><div className="section-head"><h2>Citation Coverage</h2><span className="muted">Awaiting connected prompt data</span></div><div className="bars">{([] as string[][]).map(x => <div className="bar-row" key={x[0]}><div><span>{x[0]}</span><strong>{x[1]} <em>{x[2]}</em></strong></div><div className="bar"><i style={{
                      width: x[1]
                    }} /></div></div>)}</div><div className="opportunity-strip"><Target size={16} /><strong>Missing citation opportunities</strong><span>No live citation opportunities available yet.</span></div></section><section className="card"><div className="section-head"><h2>AI Search Topics</h2><button className="ghost" onClick={() => open('topic')}><Plus size={14} /> Add Topic</button></div><div className="topic-grid">{topics.map(t => <article className="topic-card" key={t[0]}><div><strong>{t[0]}</strong><span>{t[1]} prompts</span></div><Ring score={Number(t[2])} color="var(--border)" size={54} /><div className="topic-footer"><span>Mention rate <b>{t[3]}</b></span><span>Competitors <b>{t[4]}</b></span><span className="opportunity">{t[5]} opportunity</span></div></article>)}</div></section><section className="card"><div className="section-head"><div><p className="eyebrow">MARKET CONTEXT</p><h2>Competitor GEO Visibility</h2></div><div><button className="ghost" onClick={() => open('competitor')}><Plus size={14} /> Add Competitor</button><button className="primary compact" onClick={() => open('competitor')}>Analyze Competitor</button></div></div><div className="table-scroll"><table><thead><tr>{['Competitor', 'AI Visibility', 'Prompt Coverage', 'Mention Frequency', 'Citation Presence', 'Topic Visibility', ''].map(x => <th scope="col" key={x}>{x}</th>)}</tr></thead><tbody>{competitors.map(c => <tr key={c[0]} onClick={() => setDetailType('competitor')}><td><strong>{c[0]}</strong></td><td><b>{c[1]}</b> / 100</td><td>{c[2]}</td><td>{c[3]}</td><td>{c[4]}</td><td>{c[5]}</td><td><button className="link-btn">Compare</button></td></tr>)}</tbody></table></div></section><section className="card"><div className="section-head"><h2>GEO Opportunities</h2><span className="muted">Prioritized by impact and effort</span></div><div className="opportunity-grid">{opportunities.map(o => <article className="opportunity-card" key={o[0]}><div className="opp-head"><span className="score">{o[1]}</span><span className="impact">{o[2]}</span></div><h3>{o[0]}</h3><p>{o[3]}</p><div className="tags"><span>{o[4]}</span><span>{o[5]}</span></div><div className="card-actions"><button className="ghost">View Opportunity</button><button className="link-btn" onClick={() => open('task')}>Create Task</button><button className="link-btn" onClick={() => open('optimize')}>Optimize</button></div></article>)}</div></section><section className="card"><div className="section-head"><h2>GEO Risks</h2><span className="muted">No live risks available</span></div><div className="risk-grid">{([] as string[][]).map(r => <article className="risk-card" key={r[1]}><div className={`severity ${r[0].toLowerCase()}`}><ShieldAlert size={14} />{r[0]}</div><h3>{r[1]}</h3><p>{r[2]}</p><small>{r[3]}</small><button className="ghost">View Risk</button></article>)}</div></section><section className="ai-card"><div className="section-head"><div><span className="ai-label"><Sparkles size={13} /> AI-GENERATED</span><h2>Lulu AI GEO Insights</h2></div><Bot size={22} className="violet" /></div><div className="insight-grid">{insights.map(i => <article key={i[0]}><div className="insight-meta"><span>{i[1]}</span><b>{i[2]}</b></div><h3>{i[0]}</h3><p>{i[3]}</p><small>Updated 12 min ago</small></article>)}</div></section><section className="ai-card"><div className="section-head"><div><span className="ai-label"><Sparkles size={13} /> AI-GENERATED</span><h2>Lulu AI GEO Recommendations</h2></div><button className="primary compact" onClick={() => open('optimize')}>Review all</button></div><div className="recommend-grid">{recommendations.map(r => <article key={r[0]}><div className="rec-top"><span className={`priority ${r[1].toLowerCase()}`}>{r[1]}</span><span>{r[2]}</span></div><h3>{r[0]}</h3><p>{r[3]}</p><div className="card-actions"><button className="ghost">Review</button><button className="link-btn" onClick={() => open('task')}>Create Task</button><button className="link-btn" onClick={() => open('optimize')}>Apply Optimization</button></div></article>)}</div></section><section className="card"><div className="section-head"><h2>Content Supporting GEO Visibility</h2><button className="ghost">View Content</button></div>{([] as string[][]).map(x => <div className="content-row" key={x[0]}><span className="content-icon"><Layers3 size={16} /></span><div><strong>{x[0]}</strong><small>{x[1]}</small></div><span className="topic-badge">{x[2]}</span><span className="status good"><Check size={12} />{x[3]}</span><button className="link-btn">Open Content</button><button className="link-btn" onClick={() => open('optimize')}>Optimize with AI</button><button className="link-btn">Create Content</button></div>)}</section><section className="card"><div className="section-head"><h2>Recommended Actions</h2><span className="muted">Your next best moves</span></div><div className="action-grid">{([] as string[][]).map(a => <article key={a[0]}><span className={`priority ${a[2].toLowerCase()}`}>{a[2]}</span><h3>{a[0]}</h3><p>{a[1]}</p><div className="card-actions"><button className="primary compact" onClick={() => open('task')}>Create Task</button><button className="ghost">Review</button><button className="link-btn" onClick={() => open('optimize')}>Optimize with AI</button></div></article>)}</div></section></div>{detailType && <aside className="detail-panel"><div className="detail-head"><div><p className="eyebrow">{detailType === 'prompt' ? 'PROMPT DETAIL' : 'COMPETITOR OVERVIEW'}</p><h2>{detailType === 'prompt' ? 'Selected live prompt' : 'Connected competitor'}</h2></div><button aria-label="Close detail panel" className="icon-btn" onClick={() => setDetailType(null)}><X size={16} /></button></div>{detailType === 'prompt' ? <div><div className="detail-section"><h3>AI Answer</h3><div className="answer-box">No live AI answer is available for this prompt yet.</div><small><ShieldAlert size={12} /> Shown only after live GEO data is retrieved.</small></div><div className="detail-section"><h3>Competitor Mentions</h3><p>No live competitor mentions are available yet.</p></div><div className="detail-section"><h3>Sources & Citations</h3><p>No live sources or citations are available yet.</p></div><div className="detail-chart"><h3>Answer History</h3><ResponsiveContainer width="100%" height={110}><LineChart data={chartData.slice(0, 7)}><Line type="monotone" dataKey="value" stroke="var(--chart-3)" strokeWidth={2} dot={false} /><XAxis dataKey="week" hide /><YAxis hide /></LineChart></ResponsiveContainer></div></div> : <div><div className="competitor-hero"><Ring score={0} color="var(--border)" size={120} /><p>AI Visibility Score</p></div><div className="detail-metrics"><b>—<small>Mentions</small></b><b>—<small>Coverage</small></b><b>—<small>Citations</small></b><b>—<small>Topics</small></b></div><div className="detail-section"><h3>Top Prompts</h3><p>No live competitor prompts are available yet.</p></div><div className="detail-section"><h3>Top Sources</h3><p>No live competitor sources are available yet.</p></div></div>}<div className="detail-actions"><button className="primary" onClick={() => open('task')}>Create Task</button><button className="ghost" onClick={() => open('optimize')}>Optimize with AI</button><button className="ghost" onClick={() => open('export')}>Export</button></div></aside>}</div>}{activeState !== 'loaded' && <div className="empty-state"><Globe2 size={42} /><h2>GEO Data Not Available</h2><p>Connect a data source to begin monitoring your AI visibility.</p><button className="primary">Connect Integration</button></div>}</div></main><Modal modal={modal} close={() => setModal(null)} open={open} /></div>;
}
const styles = `
:root{font-family:Inter,Arial,sans-serif;color:var(--foreground);background:var(--secondary);font-size:12px}*{box-sizing:border-box}button,input,select{font:inherit}button{cursor:pointer;border:0}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--border);outline-offset:2px}.app-shell{display:flex;min-height:100vh;background:var(--sidebar)}.sidebar{width:230px;flex:none;background:var(--sidebar);color:var(--muted-foreground);padding:19px 12px;display:flex;flex-direction:column}.sidebar.collapsed{width:68px}.sidebar.collapsed .workspace-name,.sidebar.collapsed .nav-item span:not(.nav-symbol),.sidebar.collapsed .nav-label,.sidebar.collapsed .user-small strong,.sidebar.collapsed .user-small small,.sidebar.collapsed .brand strong{display:none}.brand{height:30px;display:flex;align-items:center;gap:9px;color:var(--foreground);padding:0 9px;margin-bottom:22px}.brand strong{font-size:14px;letter-spacing:-.5px}.brand strong span{color:var(--foreground)}.brand button{margin-left:auto;background:transparent;color:var(--muted-foreground)}.brand-mark{width:24px;height:24px;border-radius:7px;background:var(--primary);color:var(--primary-foreground);display:grid;place-items:center}.workspace{width:100%;display:flex;align-items:center;gap:8px;color:var(--foreground);background:var(--background);padding:9px;border-radius:7px;text-align:left}.workspace-icon{display:grid;place-items:center;background:var(--primary);color:var(--primary-foreground);border-radius:5px;width:24px;height:24px;font-weight:700}.workspace svg{margin-left:auto}.nav-label,.eyebrow{font-size:9px;letter-spacing:.14em;font-weight:700;color:var(--muted-foreground);margin:23px 9px 9px}.nav-item{position:relative;display:flex;align-items:center;gap:10px;width:100%;padding:9px;border-radius:6px;color:var(--muted-foreground);background:transparent;text-align:left}.nav-item:hover,.nav-item.active{background:var(--background);color:var(--foreground)}.nav-item.active{color:var(--foreground)}.nav-symbol{width:16px;display:grid;place-items:center}.active-line{height:18px;width:2px;background:var(--primary);position:absolute;right:0;color:var(--primary-foreground)}.sidebar-bottom{margin-top:auto}.user-small{display:flex;gap:8px;align-items:center;padding:15px 8px 3px;border-top:1px solid var(--muted-foreground);margin-top:14px}.user-small small,.user-small strong{display:block}.user-small strong{color:var(--foreground);font-size:11px}.user-small small{font-size:10px;color:var(--muted-foreground);margin-top:2px}.avatar{background:var(--secondary);color:var(--foreground);border-radius:50%;height:28px;width:28px;display:grid;place-items:center;font-weight:700;font-size:10px}.main{flex:1;min-width:0}.topbar{height:58px;background:var(--card);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 28px}.crumb{display:flex;align-items:center;gap:8px;color:var(--muted-foreground)}.crumb strong{color:var(--foreground)}.top-actions{display:flex;align-items:center;gap:18px}.icon-btn{background:transparent;color:var(--muted-foreground);position:relative;padding:5px}.icon-btn i{position:absolute;top:3px;right:3px;width:5px;height:5px;background:var(--primary);border-radius:50%;color:var(--primary-foreground)}.mobile-menu{display:none;background:transparent}.page{max-width:1600px;margin:0 auto;padding:27px 30px 70px}.page-head{display:flex;justify-content:space-between;gap:25px;margin-bottom:23px}.page-head h1{font-size:28px;letter-spacing:-1.5px;margin:3px 0 5px}.page-head .eyebrow{margin:0;color:var(--foreground)}.subtitle{color:var(--muted-foreground);margin:0;max-width:620px;font-size:13px}.controls{display:flex;gap:7px;align-items:center;flex-wrap:wrap;justify-content:flex-end}.controls select,select{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:8px 25px 8px 10px;color:var(--muted-foreground)}.primary,.ghost,.ask{display:inline-flex;align-items:center;gap:6px;border-radius:6px;padding:8px 11px;font-weight:600;white-space:nowrap}.primary{background:var(--primary);color:var(--primary-foreground)}.primary:hover{background:var(--primary);color:var(--primary-foreground)}.ghost{background:var(--card);color:var(--muted-foreground);border:1px solid var(--border)}.ask{background:var(--card);color:var(--foreground);border:1px solid var(--border)}.compact{padding:7px 10px;margin-left:5px}.kpi-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:10px;margin-bottom:17px}.kpi{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:14px 14px 13px;min-width:0}.kpi p{color:var(--muted-foreground);margin:0 0 12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kpi strong{display:block;font-size:23px;letter-spacing:-1px;color:var(--foreground)}.kpi small{display:block;color:var(--muted-foreground);margin-top:4px;white-space:nowrap}.dot{display:block;width:7px;height:7px;border-radius:50%;margin-bottom:10px}.amber{background:var(--primary);color:var(--primary-foreground)}.green{color:var(--foreground)}.dot.green{background:var(--primary);color:var(--primary-foreground)}.blue{background:var(--primary);color:var(--primary-foreground)}.violet{background:var(--primary);color:var(--primary-foreground)}.red{color:var(--foreground)}.search-wrap{display:flex;align-items:center;gap:10px;background:var(--card);border:1px solid var(--border);border-radius:7px;padding:0 12px;height:38px}.search-wrap svg{color:var(--muted-foreground)}.search-wrap input{border:0;outline:0;flex:1;color:var(--foreground)}.search-wrap kbd{color:var(--muted-foreground);background:var(--secondary);border:1px solid var(--border);border-radius:4px;padding:3px 6px;font-size:10px}.chips,.filter-line{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0 20px}.chips button,.filter-line button{border:1px solid var(--border);background:var(--card);border-radius:15px;padding:6px 10px;color:var(--muted-foreground);font-size:11px}.filter-line button{display:flex;align-items:center;gap:7px;border-radius:6px}.content-layout{display:block}.content-layout.has-detail{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:16px;align-items:start}.sections{min-width:0;display:flex;flex-direction:column;gap:15px}.card,.ai-card{background:var(--card);border:1px solid var(--border);border-radius:9px;padding:20px}.section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:15px;margin-bottom:18px}.section-head h2{font-size:16px;letter-spacing:-.4px;margin:3px 0 0}.section-head .eyebrow{margin:0}.muted{color:var(--muted-foreground)}.ai-label{display:inline-flex;align-items:center;gap:5px;color:var(--chart-3);font-size:9px;letter-spacing:.08em;font-weight:700}.chart{margin:0 -4px}.stat-pills,.mini-stats{display:flex;gap:8px;flex-wrap:wrap}.stat-pills span,.topic-badge,.tags span{background:var(--secondary);color:var(--chart-3);border-radius:4px;padding:5px 8px;font-size:10px}.visibility-grid,.entity-grid{display:grid;grid-template-columns:250px 1fr;gap:35px}.score-block{display:flex;align-items:center;flex-direction:column;gap:7px;padding:8px}.score-block>strong,.entity-score>strong{font-size:11px}.ring{position:relative;display:grid;place-items:center;flex:none}.ring svg{position:absolute;inset:0;width:100%;height:100%}.ring strong{font-size:22px;letter-spacing:-1px}.trend{display:flex;align-items:center;font-size:11px}.metric-list{display:grid;grid-template-columns:1fr 1fr;gap:10px}.metric-row{padding:11px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between}.metric-row span{color:var(--muted-foreground)}.metric-row strong{color:var(--foreground)}.explanation{grid-column:1/-1;display:flex;gap:10px;background:var(--card);color:var(--muted-foreground);padding:13px;border-radius:6px;line-height:1.55}.explanation svg{color:var(--foreground);flex:none}.explanation p{margin:0}.mini-stats{margin-bottom:18px}.mini-stats div{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:9px 12px;min-width:105px}.mini-stats strong,.mini-stats span{display:block}.mini-stats strong{font-size:16px}.mini-stats span{font-size:10px;color:var(--muted-foreground);margin-top:3px}table{border-collapse:collapse;width:100%;min-width:700px}th{text-align:left;background:var(--card);color:var(--muted-foreground);font-size:9px;letter-spacing:.11em;text-transform:uppercase;font-weight:700;padding:10px 10px}td{padding:12px 10px;border-top:1px solid var(--border);color:var(--muted-foreground);white-space:nowrap}td strong{color:var(--foreground);font-weight:600}tbody tr:hover{background:var(--card);cursor:pointer}.table-scroll{overflow-x:auto}.badge,.status{display:inline-flex;align-items:center;gap:4px;border-radius:12px;padding:4px 7px;font-size:10px}.badge.good,.status.good{background:var(--secondary);color:var(--foreground)}.badge.bad,.status.critical{background:var(--secondary);color:var(--chart-5)}.status.warning{background:var(--secondary);color:var(--chart-1)}.status.issue{background:var(--secondary);color:var(--chart-1)}.status{font-weight:600}.green{color:var(--foreground)}.red{color:var(--chart-5)}.filter-line{margin:0 0 13px}.bulk{display:flex;align-items:center;gap:12px;background:var(--card);padding:9px 12px;margin-bottom:10px;border-radius:6px;color:var(--foreground)}.bulk button{background:transparent;color:var(--foreground)}.entity-info div{display:flex;padding:9px 0;border-bottom:1px solid var(--border)}.entity-info span{width:135px;color:var(--muted-foreground)}.entity-info strong{font-weight:500}.entity-score{display:flex;align-items:center;flex-direction:column;justify-content:center;gap:8px}.alert{display:flex;align-items:center;gap:6px;background:var(--secondary);color:var(--foreground);border-radius:5px;padding:8px 12px}.link-btn{background:transparent;color:var(--foreground);font-size:11px;display:inline-flex;align-items:center;gap:4px}.bars{display:grid;grid-template-columns:1fr 1fr;gap:18px 35px}.bar-row>div:first-child{display:flex;justify-content:space-between;margin-bottom:7px}.bar-row span{color:var(--muted-foreground)}.bar-row strong{font-size:12px}.bar-row em{font-style:normal;color:var(--foreground);font-size:10px;margin-left:4px}.bar{height:7px;background:var(--secondary);border-radius:9px}.bar i{display:block;height:100%;background:var(--primary);border-radius:9px;color:var(--primary-foreground)}.opportunity-strip{display:flex;align-items:center;gap:9px;background:var(--card);color:var(--foreground);margin-top:20px;padding:11px;border-radius:5px}.opportunity-strip span{color:var(--muted-foreground)}.topic-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.topic-card{border:1px solid var(--border);border-radius:7px;padding:12px;display:grid;grid-template-columns:1fr auto;gap:8px}.topic-card>div:first-child strong,.topic-card>div:first-child span{display:block}.topic-card>div:first-child span{color:var(--muted-foreground);margin-top:4px}.topic-card .ring strong{font-size:11px}.topic-footer{grid-column:1/-1;display:flex;gap:10px;flex-wrap:wrap;color:var(--muted-foreground);font-size:10px}.topic-footer b{color:var(--muted-foreground)}.opportunity{color:var(--chart-1)!important}.opportunity-grid,.risk-grid,.insight-grid,.recommend-grid,.action-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px}.opportunity-card,.risk-card,.ai-card article,.action-grid article{border:1px solid var(--border);border-radius:7px;padding:14px}.opp-head,.rec-top,.insight-meta{display:flex;justify-content:space-between;align-items:center}.score{background:var(--secondary);color:var(--foreground);border-radius:5px;padding:5px 8px;font-weight:700}.impact{color:var(--chart-1);font-size:10px}.opportunity-card h3,.risk-card h3,.ai-card article h3,.action-grid h3{font-size:13px;line-height:1.4;margin:11px 0 6px}.opportunity-card p,.risk-card p,.ai-card article p,.action-grid p{color:var(--muted-foreground);line-height:1.5;margin:0}.tags{display:flex;gap:5px;margin:12px 0}.card-actions{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin-top:14px}.card-actions .ghost{padding:6px 8px;font-size:10px}.risk-card{position:relative}.severity,.priority{display:inline-flex;align-items:center;gap:5px;border-radius:4px;padding:4px 7px;font-size:10px;font-weight:700}.severity.critical,.priority.critical{background:var(--secondary);color:var(--chart-5)}.severity.high,.priority.high{background:var(--secondary);color:var(--chart-1)}.severity.medium,.priority.medium{background:var(--secondary);color:var(--foreground)}.risk-card small{display:block;color:var(--muted-foreground);margin-top:10px}.risk-card .ghost{margin-top:12px}.ai-card{background:var(--card);border-color:var(--foreground)}.ai-card .section-head h2{margin-top:8px}.ai-card .violet{color:var(--foreground)}.insight-meta span{color:var(--foreground);font-size:10px;font-weight:700}.insight-meta b{color:var(--muted-foreground);font-size:10px}.ai-card article{background:rgba(0,0,0,.62);border-color:var(--foreground)}.ai-card article small{color:var(--muted-foreground)}.recommend-grid article h3{margin-top:12px}.rec-top>span:last-child{color:var(--foreground);font-size:10px}.content-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-top:1px solid var(--border)}.content-row>div{flex:1}.content-row strong,.content-row small{display:block}.content-row small{color:var(--muted-foreground);margin-top:4px}.content-icon{width:30px;height:30px;display:grid;place-items:center;background:var(--secondary);color:var(--foreground);border-radius:6px}.action-grid article{background:var(--card)}.detail-panel{position:sticky;top:15px;background:var(--card);border:1px solid var(--border);border-radius:9px;padding:18px;min-width:0}.detail-head{display:flex;justify-content:space-between;align-items:start;border-bottom:1px solid var(--border);padding-bottom:14px}.detail-head h2{font-size:15px;line-height:1.35;margin:5px 0}.detail-section{padding:15px 0;border-bottom:1px solid var(--border)}.detail-section h3,.detail-chart h3{font-size:11px;margin:0 0 9px}.detail-section p{color:var(--muted-foreground);line-height:1.5;margin:0}.answer-box{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:11px;color:var(--muted-foreground);line-height:1.6}.answer-box mark{background:var(--secondary);color:var(--chart-3)}.detail-section small,.integrity{display:flex;gap:5px;color:var(--muted-foreground);font-size:10px;margin-top:9px}.detail-chart{padding:16px 0}.detail-metrics{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--secondary);margin:15px 0}.detail-metrics b{background:var(--card);padding:10px;font-size:15px}.detail-metrics small{display:block;color:var(--muted-foreground);font-size:10px;font-weight:400;margin-top:3px}.competitor-hero{display:flex;flex-direction:column;align-items:center;padding:18px}.competitor-hero p{color:var(--muted-foreground);margin:8px 0 0}.detail-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:15px}.modal-dialog{position:fixed;inset:0;width:100%;height:100%;max-width:none;max-height:none;margin:0;padding:22px;background:rgba(0,0,0,.58);display:grid;place-items:center;border:0;z-index:5}.modal-card{position:relative;background:var(--card);border-radius:10px;width:min(520px,100%);padding:25px;box-shadow:0 18px 55px rgba(0,0,0,.2)}.modal-close{position:absolute;right:14px;top:14px;background:var(--secondary);border-radius:5px;padding:5px;color:var(--muted-foreground)}.modal-kicker{display:flex;align-items:center;gap:6px;color:var(--foreground);font-size:9px;letter-spacing:.13em;font-weight:700}.modal-card h2{font-size:20px;margin:10px 0 13px;letter-spacing:-.5px}.modal-copy{color:var(--muted-foreground);line-height:1.6}.check-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;padding:10px 0}.check-grid label{display:flex;align-items:center;gap:7px;color:var(--muted-foreground)}.status-note,.integrity{display:flex;align-items:center;gap:7px;background:var(--card);color:var(--foreground);padding:10px;border-radius:5px}.form-grid{display:grid;gap:12px}.form-grid label{display:grid;gap:6px;color:var(--muted-foreground);font-weight:600}.form-grid input,.form-grid select{width:100%;border:1px solid var(--border);border-radius:6px;padding:10px;outline:0}.complete{text-align:center;color:var(--muted-foreground)}.complete>svg{color:var(--chart-4);background:var(--secondary);border-radius:50%;padding:6px;box-sizing:content-box}.result-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:15px}.result-grid b{background:var(--card);padding:12px;color:var(--muted-foreground);font-size:17px}.result-grid small{display:block;color:var(--muted-foreground);font-size:10px;font-weight:400;margin-top:3px}.modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:22px}.empty-state{display:grid;place-items:center;text-align:center;min-height:400px;color:var(--muted-foreground)}.empty-state h2{color:var(--muted-foreground);margin:12px 0 5px}.empty-state p{margin:0 0 14px}
@media(max-width:1100px){.kpi-grid{grid-template-columns:repeat(4,1fr)}.page-head{display:block}.controls{justify-content:flex-start;margin-top:18px}.content-layout.has-detail{grid-template-columns:1fr}.detail-panel{position:relative;top:auto}.sidebar{width:210px}}
@media(max-width:850px){.sidebar{width:68px}.sidebar .workspace-name,.sidebar .nav-item span:not(.nav-symbol),.sidebar .nav-label,.sidebar .user-small strong,.sidebar .user-small small,.sidebar .brand strong{display:none}.sidebar .workspace{justify-content:center}.sidebar .workspace svg{display:none}.sidebar .brand button{display:none}.mobile-menu{display:block}.topbar{padding:0 15px}.page{padding:22px 15px 55px}}
@media(max-width:560px){.kpi-grid{grid-template-columns:1fr 1fr}.kpi:last-child{grid-column:1/-1}.page-head h1{font-size:24px}.subtitle{font-size:12px}.controls{gap:5px}.controls select{width:100%}.controls .primary,.controls .ask{flex:1;justify-content:center}.visibility-grid,.entity-grid,.metric-list{grid-template-columns:1fr}.metric-list{display:grid}.bars,.topic-grid,.opportunity-grid,.risk-grid,.insight-grid,.recommend-grid,.action-grid{grid-template-columns:1fr}.card,.ai-card{padding:15px}.section-head{display:block}.section-head>select,.section-head>button,.section-head>div+button{margin-top:12px}.content-row{align-items:flex-start;flex-wrap:wrap}.content-row>div{min-width:calc(— - 50px)}.content-row .link-btn{font-size:10px}.check-grid{grid-template-columns:1fr 1fr}.top-actions{gap:8px}}
`;

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
