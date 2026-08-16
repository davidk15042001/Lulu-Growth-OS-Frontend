import { useState, type ReactNode } from 'react';
import { AlertCircle, AlertTriangle, ArrowRight, BarChart3, Bell, Calendar, Check, CheckCircle, ChevronDown, ChevronRight, Clock, Download, Eye, ExternalLink, Filter, Globe2, Image, Info, Lightbulb, Lock, Megaphone, MoreHorizontal, RefreshCw, Search, Shield, Sparkles, Target, TrendingDown, TrendingUp, Users, Video, X, Zap } from 'lucide-react';
type Modal = 'rec-detail' | 'action' | 'task' | 'run-analysis' | 'analysis-complete' | 'export' | null;
type PageState = 'main' | 'empty' | 'limited' | 'no-recs' | 'loading' | 'error' | 'permission';
const navItems = ['Dashboard', 'Campaigns', 'Content', 'SEO', 'GEO', 'AEO', 'Social', 'Advertising', 'Audiences', 'Automations', 'Analytics'];
const priorities = [{
  level: 'HIGH',
  title: 'Review Rising CPA — LinkedIn Ads',
  area: 'Budget + Audience',
  evidence: 'LinkedIn Ads CPA has increased 18% over the previous 14-day period, from €42 to €49.60. Audience frequency is elevated.',
  impact: 'High',
  confidence: '84%',
  updated: '2h ago'
}, {
  level: 'HIGH',
  title: 'Budget Exhaustion Risk — Summer Campaign',
  area: 'Budget',
  evidence: 'Summer Product Launch (Google Ads) is at 78% budget utilization with 8 days remaining. Current pace may exhaust the budget before period end.',
  impact: 'High',
  confidence: '91%',
  updated: '14 min ago'
}, {
  level: 'MEDIUM',
  title: 'Underspending — LinkedIn & TikTok Ads',
  area: 'Budget',
  evidence: 'LinkedIn Ads and TikTok Ads are collectively €6,340 below expected pacing. Consider reallocation or campaign delivery review.',
  impact: 'Medium',
  confidence: '78%',
  updated: '14 min ago'
}];
const opportunities = [{
  category: 'Campaign Scaling',
  title: 'Scale Summer Product Launch — Google Ads',
  evidence: 'CTR 2.41%, ROAS 3.82x, both above platform benchmarks. Creative is not showing fatigue signals.',
  meta: 'Summer Product Launch · Google Ads',
  impact: 'High',
  confidence: '88%',
  source: 'Observed',
  tone: 'blue'
}, {
  category: 'Budget Allocation',
  title: 'Reallocate LinkedIn Ads underspend to Meta Ads',
  evidence: 'LinkedIn Ads €4,720 remaining, underdelivering. Meta Ads showing 4.1x ROAS with remaining capacity.',
  meta: 'LinkedIn Ads → Meta Ads',
  impact: 'High',
  confidence: '82%',
  source: 'AI Inferred',
  tone: 'indigo'
}, {
  category: 'Creative Testing',
  title: 'Test video creative variant for Brand Awareness Drive',
  evidence: 'Video format outperforms image by avg 18% CTR on Meta Ads. Current creative is image-only.',
  meta: 'Brand Awareness Drive · Meta Ads',
  impact: 'Medium',
  confidence: '74%',
  source: 'AI Inferred',
  tone: 'purple'
}, {
  category: 'Audience Expansion',
  title: 'Expand 25–34 audience segment — Google Ads',
  evidence: '25–34 demographic converting 31% above avg CPA in Summer Product Launch. Audience headroom available.',
  meta: 'Summer Product Launch · Google Ads',
  impact: 'Medium',
  confidence: '79%',
  source: 'Observed',
  tone: 'teal'
}];
const risks = [{
  level: 'HIGH',
  title: 'Budget exhaustion before period end — Summer Product Launch',
  meta: 'Google Ads · Summer Product Launch',
  evidence: '78% utilized, day 22 of 30. Current pace: €648/day. Estimated exhaustion: Jun 29.',
  time: 'Updated 14 min ago',
  source: 'Observed'
}, {
  level: 'HIGH',
  title: 'Rising CPA reducing campaign efficiency — LinkedIn Ads',
  meta: 'LinkedIn Ads · Q3 Lead Generation',
  evidence: 'CPA increased from €42.00 to €49.60 (+18%) over past 14 days. Conversion rate declining.',
  time: 'Updated 2h ago',
  source: 'Observed'
}, {
  level: 'MEDIUM',
  title: 'Potential creative fatigue — TikTok UGC Launch',
  meta: 'TikTok Ads · TikTok UGC Launch',
  evidence: 'CTR declined 14% over 10 days. Frequency increasing. Possible creative fatigue signal.',
  time: 'Updated 6h ago',
  source: 'AI Detected'
}];
const breakdown = [['Performance', 84, 'good'], ['Efficiency', 76, 'good'], ['Budget', 71, 'warn'], ['Audience', 68, 'warn'], ['Creative', 72, 'good'], ['Platform', 80, 'good']];
const platforms = [['Google Ads', '€14,240', '€54,397', '3.82x', '€26.20', '543', 'Strong'], ['Meta Ads', '€10,260', '€42,066', '4.10x', '€24.40', '420', 'Strong'], ['LinkedIn Ads', '€5,280', '€14,784', '2.80x', '€49.60', '106', 'Declining'], ['TikTok Ads', '€1,380', '€2,898', '2.10x', '€34.50', '40', 'Weak']];
const campaigns = [['Q3 Lead Generation', 'LinkedIn Ads', 'Rising CPA', 'CPA +18% last 14d', 'Review audience targeting', 'High'], ['TikTok UGC Launch', 'TikTok Ads', 'Underspending', '46% utilized, day 22', 'Review delivery settings', 'Medium'], ['Summer Product Launch', 'Google Ads', 'Budget risk', '78% used, 8d remain', 'Monitor daily spend', 'High'], ['Brand Awareness Drive', 'Meta Ads', 'Creative test opportunity', 'Video outperforms image 18%', 'Test video variant', 'Medium'], ['New Market Expansion', 'Meta Ads', 'Stable', 'No issues detected', 'Continue monitoring', 'Low']];
const questions = ['Why is CPA increasing on LinkedIn?', 'Which campaign should I optimize first?', 'Where should I move budget?', 'Which creative should I scale?', 'What is causing TikTok underdelivery?', 'What are my biggest risks?'];
const roasData: Array<[string, number]> = [['Google Ads', 3.82], ['Meta Ads', 4.1], ['LinkedIn Ads', 2.8], ['TikTok Ads', 2.1]];
const Button = ({
  children,
  primary = false,
  onClick,
  icon
}: {
  children: ReactNode;
  primary?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
}) => <button className={primary ? 'btn primary' : 'btn'} onClick={onClick}>{icon}{children}</button>;
const Source = ({
  children
}: {
  children: string;
}) => <span className={'source ' + (children.includes('Observed') ? 'observed' : children.includes('Estimated') ? 'estimated' : children.includes('AI') ? 'inferred' : 'nodata')}><i />{children}</span>;
export function LuluAIOptimization() {
  const [activeModal, setActiveModal] = useState<Modal>(null);
  const [pageState, setPageState] = useState<PageState>('main');
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [oppCategory, setOppCategory] = useState('All');
  const [riskSeverity, setRiskSeverity] = useState('All');
  const [question, setQuestion] = useState('');
  const openReview = () => setActiveModal('rec-detail');
  const runAnalysis = () => {
    setAnalysisRunning(true);
    setActiveModal('run-analysis');
    setTimeout(() => {
      setAnalysisRunning(false);
      setActiveModal('analysis-complete');
    }, 1800);
  };
  return <div className="lulu"><style>{`*{box-sizing:border-box}button,input,select,textarea{font:inherit}.lulu{min-height:100vh;background:var(--sidebar);color:var(--foreground);font:12px Inter,system-ui,sans-serif;display:flex}.sidebar{width:240px;flex:0 0 240px;background:var(--sidebar);color:var(--muted-foreground);padding:22px 12px 14px;display:flex;flex-direction:column}.brand{display:flex;align-items:center;gap:9px;color:var(--foreground);font-size:18px;padding:0 12px 24px}.brand b{color:var(--foreground)}.mark{width:28px;height:28px;border-radius:8px;background:var(--primary);display:grid;place-items:center;color:var(--primary-foreground)}.workspace{display:flex;align-items:center;gap:8px;background:var(--background);border:1px solid var(--muted-foreground);border-radius:9px;padding:10px;margin-bottom:24px}.workspace-avatar,.avatar{width:28px;height:28px;border-radius:7px;background:var(--primary);color:var(--primary-foreground);display:grid;place-items:center;font-size:10px;font-weight:700}.workspace strong,.user strong{display:block;color:var(--foreground);font-size:11px}.workspace small,.user small{display:block;color:var(--muted-foreground);font-size:10px;margin-top:3px}.workspace svg,.user svg{margin-left:auto}.nav-caption,.eyebrow,.label{font-size:9px;letter-spacing:1.2px;font-weight:700;color:var(--muted-foreground)}.nav-caption{padding:0 12px;margin:0 0 8px}.nav-item{width:100%;display:flex;align-items:center;gap:11px;border:0;background:transparent;color:var(--muted-foreground);padding:9px 12px;border-radius:7px;text-align:left;margin:2px 0;font-size:12px}.nav-item:hover,.nav-item.active{background:var(--background);color:var(--foreground)}.nav-item.active{box-shadow:inset 3px 0 var(--foreground)}.subnav{padding:2px 0 7px 39px;border-left:1px solid var(--muted-foreground);margin-left:23px}.subnav button{display:block;border:0;background:none;color:var(--muted-foreground);padding:6px 0;font-size:10px}.subnav .active{color:var(--foreground);font-weight:700}.sidebar-bottom{margin-top:auto}.user{border-top:1px solid var(--muted-foreground);padding:16px 8px 0;margin-top:12px;display:flex;align-items:center;gap:8px}.main{min-width:0;flex:1}.topbar{height:58px;background:var(--card);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;padding:0 30px}.crumb{display:flex;gap:8px;align-items:center;color:var(--muted-foreground)}.crumb strong{color:var(--muted-foreground)}.top-actions{display:flex;gap:18px;align-items:center}.icon-btn{border:0;background:none;color:var(--muted-foreground);position:relative}.dot{position:absolute;right:0;top:0;width:5px;height:5px;border-radius:50%;background:var(--primary);color:var(--primary-foreground)}.content{max-width:1600px;margin:auto;padding:26px 30px 48px}.page-heading{display:flex;justify-content:space-between;gap:20px;align-items:flex-end;margin-bottom:21px}.page-heading h1{font-size:28px;letter-spacing:-.8px;margin:6px 0}.page-heading p{color:var(--muted-foreground);margin:0}.heading-actions{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.btn{border:1px solid var(--border);border-radius:7px;background:var(--card);color:var(--muted-foreground);padding:8px 10px;display:inline-flex;align-items:center;gap:6px;font-size:10px;font-weight:600;white-space:nowrap;cursor:pointer}.btn:hover{border-color:var(--foreground);color:var(--foreground)}.btn.primary{background:var(--primary);border-color:var(--primary-foreground);color:var(--primary-foreground);box-shadow:0 3px 8px var(--foreground)}.filters{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin-bottom:18px}.select{display:flex;align-items:center;gap:6px;border:1px solid var(--border);background:var(--card);border-radius:7px;padding:8px 10px;color:var(--muted-foreground);font-size:10px}.select select{border:0;background:transparent;color:inherit;outline:0}.clear,.link{border:0;background:transparent;color:var(--foreground);font-size:10px;margin-left:auto;cursor:pointer}.section{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px 22px;margin-bottom:18px}.section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:15px;gap:12px}.section-head h2{font-size:15px;margin:0;letter-spacing:-.2px}.ai-title{display:flex;align-items:center;gap:8px}.ai-title svg{color:var(--foreground)}.banner{display:flex;align-items:center;justify-content:space-between;gap:18px}.statusline{display:flex;align-items:center;gap:8px;color:var(--foreground);font-weight:700}.statusline i,.source i{width:6px;height:6px;border-radius:50%;background:currentColor;display:inline-block}.meta{display:flex;gap:18px;color:var(--muted-foreground);font-size:10px;margin-top:10px;flex-wrap:wrap}.ai-card{background:var(--card);border-color:var(--foreground)}.ai-head{display:flex;align-items:flex-start;gap:9px;color:var(--foreground)}.ai-head h2{font-size:15px;color:var(--foreground);margin:0 0 4px}.ai-head small{color:var(--muted-foreground);font-size:8px;letter-spacing:.7px}.confidence{margin-left:auto;font-weight:700}.summary-grid{display:grid;grid-template-columns:150px 1fr;gap:25px;margin-top:18px;align-items:center}.healthy{display:inline-flex;background:var(--secondary);color:var(--chart-4);border-radius:20px;padding:12px 20px;font-weight:800;font-size:18px}.summary{color:var(--muted-foreground);line-height:1.6;margin:0}.chips{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-top:18px}.chip{background:var(--card);border:1px solid var(--border);border-radius:7px;padding:10px}.chip span{display:block;color:var(--muted-foreground);font-size:9px}.chip strong{display:block;font-size:11px;margin-top:5px}.source{display:inline-flex;align-items:center;gap:5px;font-size:9px;margin-top:12px}.observed{color:var(--foreground)}.estimated{color:var(--foreground)}.inferred{color:var(--foreground)}.nodata{color:var(--muted-foreground)}.score-grid{display:grid;grid-template-columns:180px 1fr 260px;gap:28px;align-items:center}.ring{width:145px;height:145px;border-radius:50%;background:conic-gradient(var(--primary) 0 78%,var(--secondary) 78%);display:grid;place-items:center;margin:auto}.ring:after{content:'';width:112px;height:112px;background:var(--card);border-radius:50%}.ring-text{position:absolute;text-align:center}.ring-text strong{display:block;font-size:25px}.ring-text span{font-size:9px;color:var(--muted-foreground)}.breakdown{display:grid;gap:9px}.break-row{display:grid;grid-template-columns:90px 1fr 35px;gap:9px;align-items:center;font-size:10px}.progress{height:6px;background:var(--secondary);border-radius:6px;overflow:hidden}.progress i{display:block;height:100%;border-radius:6px}.good i{background:var(--primary);color:var(--primary-foreground)}.warn i{background:var(--chart-1)}.qualitative{color:var(--muted-foreground);line-height:1.5}.section-kicker{display:flex;align-items:center;gap:12px}.tabs{display:flex;gap:5px;flex-wrap:wrap}.tab{border:0;background:transparent;padding:6px 8px;color:var(--muted-foreground);font-size:10px;border-radius:6px;cursor:pointer}.tab.active{background:var(--secondary);color:var(--foreground);font-weight:700}.priority-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.priority-card,.opp-card,.risk-card{border:1px solid var(--border);border-radius:9px;padding:14px;background:var(--card);border-left:3px solid var(--border)}.priority-card.medium,.risk-card.medium{border-left-color:var(--chart-1)}.badge{display:inline-flex;border-radius:10px;padding:4px 7px;font-size:8px;font-weight:800}.badge.high{background:var(--secondary);color:var(--foreground)}.badge.medium{background:var(--secondary);color:var(--chart-1)}.priority-card h3,.opp-card h3,.risk-card h3{font-size:11px;line-height:1.45;margin:10px 0 7px}.card-copy{color:var(--muted-foreground);line-height:1.5;font-size:10px;margin:0 0 10px}.card-meta{display:flex;flex-wrap:wrap;gap:10px;color:var(--muted-foreground);font-size:9px}.card-actions{display:flex;gap:10px;margin-top:12px}.card-actions button{border:0;background:transparent;color:var(--foreground);font-size:9px;font-weight:700;padding:0;cursor:pointer}.opp-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.opp-card{border-left-color:var(--foreground)}.category{display:inline-flex;padding:4px 7px;border-radius:10px;background:var(--secondary);color:var(--foreground);font-size:8px;font-weight:700}.tone-purple{background:var(--secondary);color:var(--foreground)}.tone-teal{background:var(--secondary);color:var(--foreground)}.risk-list{display:grid;gap:8px}.risk-card{display:grid;grid-template-columns:1fr auto;gap:12px}.risk-card .card-actions{align-self:center}.table-wrap{overflow:auto}.data-table{width:100%;border-collapse:collapse;min-width:780px}.data-table th{text-align:left;color:var(--muted-foreground);font-size:9px;letter-spacing:.5px;padding:10px 9px;border-bottom:1px solid var(--border)}.data-table td{padding:12px 9px;border-bottom:1px solid var(--border);color:var(--muted-foreground);font-size:10px}.data-table td strong{color:var(--foreground)}.health-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.health{padding:12px;border:1px solid var(--border);border-radius:8px}.health strong{display:block;font-size:10px}.health span{display:block;margin:6px 0;color:var(--foreground);font-size:10px;font-weight:700}.health small{color:var(--muted-foreground);font-size:9px}.budget-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.insight{border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:8px}.insight p{margin:0;color:var(--muted-foreground);line-height:1.5;font-size:10px}.bar-chart{height:180px;display:flex;align-items:flex-end;gap:18px;padding:16px 25px;border-bottom:1px solid var(--border)}.bar-col{flex:1;text-align:center;color:var(--muted-foreground);font-size:9px}.bar-col i{display:block;background:var(--primary);border-radius:4px 4px 0 0;max-width:35px;margin:0 auto 7px;color:var(--primary-foreground)}.creative-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.creative{border:1px solid var(--border);border-radius:9px;padding:14px}.creative h3{font-size:11px;margin:10px 0 5px}.creative p{color:var(--muted-foreground);font-size:10px;line-height:1.5}.chat{background:var(--card);border-color:var(--foreground)}.chat textarea{width:100%;min-height:78px;border:1px solid var(--border);background:var(--card);border-radius:8px;padding:12px;resize:vertical;outline-color:var(--foreground)}.question-wrap{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0 14px}.question{border:1px solid var(--border);background:var(--card);color:var(--foreground);border-radius:14px;padding:7px 9px;font-size:9px;cursor:pointer}.modal-backdrop{position:fixed;inset:0;background:var(--background);display:grid;place-items:center;padding:20px;z-index:10}.modal{width:min(720px,100%);max-height:90vh;overflow:auto;background:var(--card);border-radius:12px;box-shadow:0 18px 60px var(--muted-foreground)}.modal header{display:flex;justify-content:space-between;padding:20px 24px 16px;border-bottom:1px solid var(--border)}.modal header h2{font-size:19px;margin:0}.modal header button{border:0;background:none;color:var(--muted-foreground);cursor:pointer}.modal-body{padding:20px 24px}.modal-body h3{font-size:12px;margin:18px 0 7px}.modal-body p,.modal-body li{font-size:11px;color:var(--muted-foreground);line-height:1.6}.modal-footer{display:flex;justify-content:flex-end;gap:8px;padding:14px 24px;background:var(--card);border-top:1px solid var(--border)}.warning{background:var(--secondary);color:var(--chart-1);padding:12px;border-radius:7px;font-size:10px;margin:15px 0}.empty{text-align:center;padding:90px 20px}.empty svg{color:var(--foreground)}.empty h2{font-size:18px}.empty p{color:var(--muted-foreground);max-width:440px;margin:0 auto 18px;line-height:1.5}.empty-actions{display:flex;justify-content:center;gap:8px}@media(max-width:1100px){.sidebar{width:210px;flex-basis:210px}.chips{grid-template-columns:repeat(3,1fr)}.health-grid{grid-template-columns:repeat(3,1fr)}.score-grid{grid-template-columns:150px 1fr}}@media(max-width:800px){.sidebar{display:none}.content{padding:20px 14px}.topbar{padding:0 15px}.page-heading{align-items:flex-start;flex-direction:column}.heading-actions{justify-content:flex-start}.summary-grid,.score-grid,.budget-grid{grid-template-columns:1fr}.priority-grid,.opp-grid,.creative-grid{grid-template-columns:1fr}.risk-card{grid-template-columns:1fr}.health-grid{grid-template-columns:repeat(2,1fr)}.chips{grid-template-columns:repeat(2,1fr)}}@media(max-width:480px){.content{padding:16px 10px}.section{padding:15px}.health-grid{grid-template-columns:1fr}.meta{gap:8px}.heading-actions{flex-wrap:nowrap;overflow:auto;width:100%}}`}</style>
    <aside className="sidebar"><div className="brand"><div className="mark"><Sparkles size={16} /></div><span>Lulu <b>AI</b></span></div><div className="workspace"><div className="workspace-avatar">AC</div><div><strong>Acme Corporation</strong><small>Business OS</small></div><ChevronDown size={14} /></div><LuluSectionNavigation activeId="zesty-grass-9196" /><div className="sidebar-bottom"><button className="nav-item"><Shield size={15} /><span>Settings</span></button><div className="user"><div className="avatar">JD</div><div><strong>Jordan Davis</strong><small>Administrator</small></div><MoreHorizontal size={16} /></div></div></aside>
    <main className="main"><header className="topbar"><div className="crumb"><span>Advertising</span><ChevronRight size={14} /><strong>AI Optimization</strong></div><div className="top-actions"><button className="icon-btn" aria-label="Notifications"><Bell size={18} /><i className="dot" /></button><div className="avatar">JD</div></div></header><section className="content"><div className="page-heading"><div><div className="eyebrow">ADVERTISING WORKSPACE</div><h1>AI Optimization</h1><p>Use AI to identify advertising opportunities, risks and optimization priorities across your connected campaigns.</p></div><div className="heading-actions"><Button primary icon={<Sparkles size={14} />} onClick={runAnalysis}>Run Analysis</Button><Button icon={<Sparkles size={14} />}>Ask Lulu AI</Button><Button icon={<Download size={14} />} onClick={() => setActiveModal('export')}>Export</Button><Button icon={<RefreshCw size={14} />}>Refresh</Button></div></div><div className="filters"><div className="select"><Filter size={13} /><select><option>All Platforms</option><option>Google Ads</option><option>Meta Ads</option></select></div><div className="select">Campaign <select><option>All Campaigns</option></select></div><div className="select">Priority <select><option>All Priorities</option></select></div><div className="select">Status <select><option>All Statuses</option></select></div><div className="select"><Calendar size={13} /><select><option>Last 30 Days</option></select></div><button className="clear">Clear Filters</button></div>
      {pageState !== 'main' ? <div className="section empty">{pageState === 'permission' ? <Lock size={38} /> : pageState === 'error' ? <AlertTriangle size={38} /> : <Sparkles size={38} />}<h2>{pageState === 'empty' ? 'No Advertising Optimization Insights Yet' : pageState === 'limited' ? 'Advertising Optimization Is Limited' : pageState === 'no-recs' ? 'No Optimization Recommendations' : pageState === 'error' ? "AI Optimization Couldn't Be Loaded" : pageState === 'loading' ? 'Loading advertising intelligence…' : 'AI Optimization Restricted'}</h2><p>{pageState === 'permission' ? "You don't have permission to view advertising optimization insights." : pageState === 'empty' ? 'Connect advertising platforms and collect sufficient performance data to allow Lulu AI to identify optimization opportunities.' : pageState === 'limited' ? 'Lulu AI does not currently have enough advertising data to generate reliable optimization recommendations.' : 'Advertising optimization analysis is temporarily unavailable.'}</p><div className="empty-actions"><Button primary onClick={() => setPageState('main')}>{pageState === 'error' ? 'Try Again' : pageState === 'permission' ? 'Review Connections' : 'Run Analysis'}</Button><Button>Connect Platform</Button></div></div> : <>
      <section className="section banner"><div><div className="statusline"><i />Analysis Up to Date</div><div className="meta"><span>Last Analysis: Today at 08:14</span><span>Data Freshness: 22 min ago</span><span>Connected Platforms: 4</span><span>Coverage: 14 campaigns</span></div></div><Button primary icon={<Sparkles size={13} />} onClick={runAnalysis}>Run Analysis</Button></section>
      <section className="section ai-card"><div className="ai-head"><Sparkles size={18} /><div><h2>Lulu AI Advertising Summary</h2><small>AI-GENERATED · UPDATED 14 MIN AGO</small></div><span className="confidence">Confidence: 86%</span></div><div className="summary-grid"><div><span className="healthy">Healthy</span></div><p className="summary">Advertising performance remains healthy overall, with strong campaign efficiency across Google Ads and Meta Ads. Emerging CPA pressure in LinkedIn Ads and underspending in TikTok Ads require attention. Budget utilization is on track at 65.1% with 8 days remaining in the period. Two anomalies detected in the last 48 hours.</p></div><div className="chips">{[['Performance', 'Strong'], ['Efficiency', 'Good'], ['Budget', 'On Track'], ['Audience', 'Stable'], ['Creative', '1 At Risk'], ['Platform', '4 Active']].map(item => <div className="chip" key={item[0]}><span>{item[0]}</span><strong>{item[1]}</strong></div>)}</div><Source>Platform APIs + Lulu AI · Observed + AI Inferred</Source></section>
      <section className="section"><div className="section-head"><h2>Optimization Priority Score</h2><Source>AI Inferred</Source></div><div className="score-grid"><div><div className="ring"><div className="ring-text"><strong>78 / 100</strong><span>Optimization Priority</span></div></div></div><div className="breakdown">{breakdown.map(item => <div className="break-row" key={item[0]}><span>{item[0]}</span><div className={'progress ' + item[2]}><i style={{
                      width: item[1] + '%'
                    }} /></div><strong>{item[1]}</strong></div>)}</div><div className="qualitative"><strong>Good</strong> — Moderate optimization opportunities detected.</div></div></section>
      <section className="section"><div className="section-head"><h2>Top Optimization Priorities</h2><button className="link">View All</button></div><div className="priority-grid">{priorities.map(item => <article className={'priority-card ' + (item.level === 'MEDIUM' ? 'medium' : '')} key={item.title}><span className={'badge ' + item.level.toLowerCase()}>{item.level}</span><h3>{item.title}</h3><div className="label">AREA · {item.area}</div><p className="card-copy">{item.evidence}</p><div className="card-meta"><span>Impact: {item.impact}</span><span>Confidence: {item.confidence}</span><span>{item.updated}</span></div><div className="card-actions"><button onClick={openReview}>Review</button><button onClick={() => setActiveModal('task')}>Create Task</button><button>Ask Lulu AI</button></div></article>)}</div></section>
      <section className="section"><div className="section-head"><div className="section-kicker"><h2>Advertising Opportunities</h2><div className="tabs">{['All', 'Campaign Scaling', 'Budget Allocation', 'Audience Expansion', 'Creative Testing', 'Platform Optimization', 'Conversion'].map(item => <button className={'tab ' + (oppCategory === item ? 'active' : '')} onClick={() => setOppCategory(item)} key={item}>{item}</button>)}</div></div></div><div className="opp-grid">{opportunities.filter(item => oppCategory === 'All' || item.category === oppCategory).map(item => <article className="opp-card" key={item.title}><span className={'category ' + (item.tone === 'purple' ? 'tone-purple' : item.tone === 'teal' ? 'tone-teal' : '')}>{item.category}</span><h3>{item.title}</h3><p className="card-copy">{item.evidence}</p><div className="card-meta"><span>{item.meta}</span><span>Impact: {item.impact}</span><span>Confidence: {item.confidence}</span></div><Source>{item.source}</Source><div className="card-actions"><button onClick={openReview}>Review</button><button onClick={() => setActiveModal('task')}>Create Task</button></div></article>)}</div></section>
      <section className="section"><div className="section-head"><div className="section-kicker"><h2>Advertising Risks</h2><div className="tabs">{['All', 'Critical', 'High', 'Medium', 'Low'].map(item => <button className={'tab ' + (riskSeverity === item ? 'active' : '')} onClick={() => setRiskSeverity(item)} key={item}>{item}</button>)}</div></div></div><div className="risk-list">{risks.filter(item => riskSeverity === 'All' || item.level === riskSeverity.toUpperCase()).map(item => <article className={'risk-card ' + (item.level === 'MEDIUM' ? 'medium' : '')} key={item.title}><div><span className={'badge ' + item.level.toLowerCase()}>{item.level}</span><h3>{item.title}</h3><div className="card-meta"><span>{item.meta}</span><span>{item.time}</span></div><p className="card-copy">{item.evidence}</p><Source>{item.source}</Source></div><div className="card-actions"><button onClick={openReview}>Review</button><button onClick={() => setActiveModal('task')}>Create Task</button></div></article>)}</div></section>
      <section className="section"><div className="section-head"><h2>Campaign Optimization</h2><button className="link">View Campaigns</button></div><div className="table-wrap"><table className="data-table"><thead><tr>{['Campaign', 'Platform', 'Issue', 'Evidence', 'Suggested Action', 'Priority', 'Action'].map(item => <th key={item}>{item}</th>)}</tr></thead><tbody>{campaigns.map(row => <tr key={row[0]}>{row.map((cell, index) => <td key={cell}>{index === 0 ? <strong>{cell}</strong> : index === 5 ? <span className={'badge ' + cell.toLowerCase()}>{cell}</span> : index === 6 ? <button className="link">View Campaign</button> : cell}</td>)}</tr>)}</tbody></table></div></section>
      <section className="section"><div className="section-head"><h2>Budget Optimization</h2><Source>Platform APIs · Observed</Source></div><div className="budget-grid"><div><div className="insight"><p>€4,720 remaining LinkedIn Ads budget is underutilized at day 22.</p><Source>Q3 Lead Gen · Observed</Source><div className="card-actions"><button onClick={openReview}>Review Budget</button><button onClick={() => setActiveModal('task')}>Create Task</button></div></div><div className="insight"><p>Summer Product Launch may exhaust budget 1–2 days early at current pace.</p><Source>Estimated</Source><div className="card-actions"><button onClick={openReview}>Review Budget</button></div></div><div className="insight"><p>Meta Ads is producing stronger ROAS relative to current spend allocation.</p><Source>AI Inferred</Source><div className="card-actions"><button onClick={openReview}>Review Budget</button><button onClick={() => setActiveModal('task')}>Create Task</button></div></div></div><div><div className="label">PLATFORM EFFICIENCY (ROAS) · OBSERVED</div><div className="bar-chart">{roasData.map(item => <div className="bar-col" key={item[0]}><i style={{
                      height: item[1] * 30 + 'px'
                    }} /><span>{item[1]}x</span><small>{item[0].replace(' Ads', '')}</small></div>)}</div></div></div></section>
      <section className="section"><div className="section-head"><h2>Audience Optimization</h2></div><div className="opp-grid">{[['Review underperforming 45–54 audience segment', 'LinkedIn Ads', 'CPA 38% above avg'], ['Test high-performing 25–34 segment on additional campaigns', 'Google Ads', '31% below avg CPA'], ['Investigate potential audience overlap across LinkedIn campaigns', 'LinkedIn Ads', 'AI Detected']].map(item => <article className="opp-card" key={item[0]}><h3>{item[0]}</h3><p className="card-copy">{item[1]} · {item[2]}</p><div className="card-actions"><button>View Audience</button><button onClick={() => setActiveModal('task')}>Create Task</button></div></article>)}</div></section>
      <section className="section"><div className="section-head"><h2>Creative Optimization</h2></div><div className="creative-grid">{[['Top Creative', 'Summer Sale — Hero Image', 'Google Ads', 'CTR: 2.41% · ROAS: 3.82x · No fatigue', 'Observed'], ['Requires Attention', 'TikTok UGC — Product Launch', 'TikTok Ads', 'CTR declining 14% · Possible fatigue', 'AI Detected'], ['Testing Opportunity', 'Video variant for Brand Awareness Drive', 'Meta Ads', 'Estimated 18% CTR uplift', 'AI Inferred']].map(item => <article className="creative" key={item[1]}><div className="label">{item[0]}</div><h3>{item[1]}</h3><p>{item[2]}<br />{item[3]}</p><Source>{item[4]}</Source><div className="card-actions"><button>View Creative</button><button onClick={() => setActiveModal('task')}>Create Task</button></div></article>)}</div></section>
      <section className="section"><div className="section-head"><h2>Platform Optimization</h2></div><div className="table-wrap"><table className="data-table"><thead><tr>{['Platform', 'Spend', 'Revenue', 'ROAS', 'CPA', 'Conversions', 'Efficiency', 'Status'].map(item => <th key={item}>{item}</th>)}</tr></thead><tbody>{platforms.map(row => <tr key={row[0]}>{row.map((cell, index) => <td key={cell}>{index === 0 ? <strong>{cell}</strong> : index === 6 ? <span className={'source ' + (cell === 'Strong' ? 'observed' : cell === 'Declining' ? 'inferred' : 'estimated')}><i />{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div><p className="card-copy"><InfoIcon /> Never recommend disconnecting a platform without sufficient evidence.</p></section>
      <section className="section"><div className="section-head"><div className="section-kicker"><h2>AI-Detected Advertising Anomalies</h2><span className="badge medium">AI DETECTED</span></div></div><div className="table-wrap"><table className="data-table"><thead><tr>{['Anomaly', 'Change', 'Severity', 'Campaign', 'Platform', 'Detected', 'Source', 'Action'].map(item => <th key={item}>{item}</th>)}</tr></thead><tbody>{[['CPA', '+18%', 'High', 'Q3 Lead Generation', 'LinkedIn Ads', 'Jun 22, 2025 14:02'], ['CTR decline', '-14% over 10d', 'Medium', 'TikTok UGC Launch', 'TikTok Ads', 'Jun 21, 2025 09:18'], ['Spend acceleration', '+22% vs avg', 'Medium', 'Summer Product Launch', 'Google Ads', 'Jun 20, 2025 17:45']].map(row => <tr key={row[0]}>{row.map(cell => <td key={cell}>{cell}</td>)}<td><button className="link" onClick={openReview}>Investigate</button></td></tr>)}</tbody></table></div></section>
      <section className="section"><div className="section-head"><h2>Advertising Data Health</h2><Button>Review Connections</Button></div><div className="health-grid">{[['Data Freshness', 'Healthy', 'Last sync 22 min ago'], ['Platform Coverage', 'Healthy', '4/4 platforms connected'], ['Conversion Tracking', 'Warning', 'LinkedIn conversion lag detected'], ['Attribution', 'Healthy', 'UTM parameters consistent'], ['Campaign Sync', 'Healthy', 'All 14 campaigns synced']].map(item => <div className="health" key={item[0]}><strong>{item[0]}</strong><span style={{
                  color: item[1] === 'Warning' ? 'var(--chart-1)' : 'var(--chart-4)'
                }}><i className="status-dot" /> {item[1]}</span><small>{item[2]}</small></div>)}</div></section>
      <section className="section chat"><div className="section-head"><div className="ai-title"><Sparkles size={18} /><h2>Ask Lulu AI about Advertising</h2></div></div><textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask Lulu AI about your advertising performance..." /><div className="question-wrap">{questions.map(item => <button className="question" onClick={() => setQuestion(item)} key={item}>{item}</button>)}</div><Button primary icon={<Sparkles size={14} />}>Ask Lulu AI</Button></section>
      <section className="section"><div className="section-head"><h2>Optimization History</h2></div><div className="table-wrap"><table className="data-table"><thead><tr>{['Analysis Date', 'Recommendation', 'Status', 'Action Taken', 'User', 'Result'].map(item => <th key={item}>{item}</th>)}</tr></thead><tbody>{[['Jun 22, 2025', 'Review LinkedIn CPA', 'New', '—', '—', '—'], ['Jun 18, 2025', 'Test video creative — Meta Ads', 'Reviewed', 'Created Task', 'Jordan Davis', 'Pending'], ['Jun 15, 2025', 'Reallocate TikTok budget', 'Accepted', 'Budget updated', 'Jordan Davis', '+€420 efficiency gain'], ['Jun 10, 2025', 'Expand 25–34 segment — Google', 'Completed', 'Audience expanded', 'Jordan Davis', 'CPA -8%'], ['Jun 5, 2025', 'Review creative fatigue', 'Dismissed', '—', 'Jordan Davis', '—']].map(row => <tr key={row[1]}>{row.map((cell, index) => <td key={cell}>{index === 2 ? <span className="badge medium">{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div></section>
      <section className="section"><div className="section-head"><h2>Optimization Impact</h2></div><div className="table-wrap"><table className="data-table"><thead><tr><th>Optimization</th><th>Date</th><th>Result</th><th>Evidence</th></tr></thead><tbody>{[['Audience expansion', 'Jun 10', 'CPA change: -8%', 'Observed'], ['Budget reallocation', 'Jun 15', 'Efficiency gain: +€420', 'Observed'], ['Creative pause', 'May 28', 'CTR improved 6%', 'Observed']].map(row => <tr key={row[0]}>{row.map((cell, index) => <td key={cell}>{index === 2 ? <strong className="observed">{cell}</strong> : index === 3 ? <Source>{cell}</Source> : cell}</td>)}</tr>)}</tbody></table></div><p className="card-copy">Observed results are directly measured. Lulu AI does not claim causation unless sufficient platform evidence exists.</p></section>
      </>}</section></main>
      {activeModal && <div className="modal-backdrop" role="presentation"><div className="modal" role="dialog" aria-modal="true"><header><h2>{activeModal === 'rec-detail' ? 'Review Rising CPA — LinkedIn Ads' : activeModal === 'task' ? 'Create Task' : activeModal === 'run-analysis' ? analysisRunning ? 'Analyzing Advertising Performance' : 'Analysis Complete' : activeModal === 'export' ? 'Export AI Optimization Report' : 'Review Before Applying'}</h2><button aria-label="Close" onClick={() => setActiveModal(null)}><X size={18} /></button></header><div className="modal-body">{activeModal === 'run-analysis' ? <><p>Analysis stages only update when data is retrieved. No fake progress.</p>{['Checking platform data', 'Reviewing campaign performance', 'Analyzing audiences', 'Analyzing creatives', 'Detecting anomalies', 'Generating recommendations'].map((item, index) => <p key={item} style={{
              color: index < 2 ? 'var(--chart-4)' : 'var(--muted-foreground)'
            }}><Check size={14} /> {item} {index === 1 && analysisRunning ? ' · active' : ''}</p>)}</> : activeModal === 'rec-detail' ? <><h3>What Lulu AI Recommends</h3><p>Review LinkedIn Ads Q3 Lead Generation campaign targeting and audience settings. CPA has increased 18% in the past 14 days. Consider refreshing the audience segment or reviewing the creative mix.</p><h3>Why</h3><ul><li>CPA increased from €42.00 to €49.60 (+18%) over 14 days</li><li>Conversion rate declined from 3.1% to 2.6%</li><li>Audience frequency elevated: 4.2 impressions/user avg</li></ul><Source>Observed · LinkedIn Ads API</Source><h3>Expected Impact</h3><p>Addressing audience saturation and CPA pressure could reduce CPA by an estimated 10–18%.</p><Source>Estimated</Source><h3>Affected Assets</h3><p>Platform: LinkedIn Ads · Campaign: Q3 Lead Generation · Audience: Enterprise Decision Makers 45–54</p><strong>Confidence: 84% · AI Inferred + Observed</strong></> : activeModal === 'task' ? <><label>Task Name<input defaultValue="Review Rising CPA — LinkedIn Ads" /></label><label>Description<textarea defaultValue="Review LinkedIn Ads campaign targeting and audience settings." /></label><label>Owner<select><option>Jordan Davis</option></select></label><label>Priority<select><option>High</option><option>Medium</option><option>Low</option></select></label></> : activeModal === 'export' ? <><p>Select the sections to include in your report.</p>{['Summary', 'Recommendations', 'Opportunities', 'Risks', 'Analysis History'].map(item => <label key={item}><input type="checkbox" defaultChecked /> {item}</label>)}<h3>Format</h3><div className="tabs"><button className="tab active">PDF</button><button className="tab">CSV</button><button className="tab">Excel</button></div></> : <><p>Current Budget: €10,000/month</p><p>Proposed Budget: €8,000/month (redirect €2,000 to Meta Ads)</p><div className="warning">This change will affect live advertising spend. Confirm only after careful review.</div></>}</div><div className="modal-footer"><Button onClick={() => setActiveModal(null)}>Close</Button><Button primary onClick={() => setActiveModal(null)}>{activeModal === 'task' ? 'Create Task' : activeModal === 'export' ? 'Export' : activeModal === 'action' ? 'Confirm Change' : activeModal === 'run-analysis' ? 'Review Recommendations' : 'Create Task'}</Button></div></div></div>}
    </div>;
}
function InfoIcon() {
  return <Info size={12} style={{
    verticalAlign: 'middle',
    marginRight: 4
  }} />;
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
  "label": "Website",
  "pages": [{
    "id": "lulu-website-portal-9012",
    "label": "Website"
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
            return <a key={page.id} {...pageLinkProps(page.id)} aria-current={isActivePage ? 'page' : undefined} className={`block rounded-md px-3 py-2 text-xs transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {page.label}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}
import { pageLinkProps } from '../../../../routing';
