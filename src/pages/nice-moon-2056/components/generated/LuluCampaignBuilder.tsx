import { useState } from 'react';
import { Activity, ArrowLeft, ArrowRight, BarChart3, Bell, Bot, Check, ChevronDown, CircleHelp, Clock3, FileText, Gauge, Globe2, HelpCircle, History, LayoutDashboard, Lightbulb, Link2, ListChecks, Menu, MoreHorizontal, Pencil, Plus, RefreshCw, Search, Settings2, ShieldCheck, Sparkles, Target, ToggleLeft, User, Users, WalletCards, X, Zap } from 'lucide-react';
type Platform = {
  name: string;
  letter: string;
  color: string;
  status: string;
  reason: string;
  confidence: number;
  note: string;
  selected: boolean;
};
type Audience = {
  title: string;
  type: string;
  platform: string;
  size: string;
  reason: string;
  role: string;
  confidence: string;
};
const steps = ['Goal', 'Brief', 'Strategy', 'Platforms', 'Audience', 'Budget', 'Tracking', 'Creative', 'Structure', 'Config', 'Validate', 'Review', 'Publish', 'Monitor'];
const platforms: Platform[] = [{
  name: 'Google Ads',
  letter: 'G',
  color: 'var(--foreground)',
  status: 'Recommended',
  reason: 'High purchase intent, strong historical conversion. CPL €42 average.',
  confidence: 94,
  note: 'Observed · 6 mo. data',
  selected: true
}, {
  name: 'Meta Ads',
  letter: 'M',
  color: 'var(--foreground)',
  status: 'Recommended',
  reason: 'Strong reach and retargeting. Lookalike audiences from CRM available.',
  confidence: 81,
  note: 'Observed · 4 mo. data',
  selected: true
}, {
  name: 'LinkedIn Ads',
  letter: 'in',
  color: 'var(--foreground)',
  status: 'Optional',
  reason: 'Relevant for B2B but CPA historically 2.4x higher than Google.',
  confidence: 52,
  note: 'Observed · 3 mo. data',
  selected: false
}, {
  name: 'TikTok Ads',
  letter: 'T',
  color: 'var(--foreground)',
  status: 'Not Recommended',
  reason: 'Insufficient audience data and no historical conversion signals for this objective.',
  confidence: 18,
  note: 'AI inferred',
  selected: false
}];
const audiences: Audience[] = [{
  title: 'High-Intent Website Visitors',
  type: 'Retargeting',
  platform: 'Meta Ads',
  size: '~12,400',
  reason: 'Visited /pricing or /demo pages, did not convert. Last 30 days.',
  role: 'Bottom-funnel conversion',
  confidence: 'High'
}, {
  title: 'CRM Lookalike — Top Customers',
  type: 'Lookalike',
  platform: 'Meta Ads + Google Ads',
  size: '~890,000',
  reason: '1% lookalike of 340 top customers from CRM. Strong income and firmographic match.',
  role: 'Prospecting',
  confidence: 'High'
}, {
  title: 'Enterprise Decision-Makers — DACH',
  type: 'Interest + Demographic',
  platform: 'LinkedIn Ads',
  size: '~67,000',
  reason: 'Operations/Finance/Tech titles, company size 50–500, DACH geo.',
  role: 'Awareness + Lead Gen',
  confidence: 'Medium'
}];
const briefFields = [['Objective', 'Generate qualified leads for consulting business'], ['Business Goal', 'Increase MQL volume by 40% in Q1'], ['Target Market', 'Enterprise B2B, 50–500 employees'], ['Audience', 'Decision-makers in operations, finance, technology'], ['Geography', 'Germany, Austria, Switzerland'], ['Language', 'German, English'], ['Offer', 'Free AI Business Audit consultation'], ['Budget', '€5,000/month'], ['Expected Outcome', '80–120 qualified leads/month'], ['Primary Tracking', 'Lead form submission'], ['Recommended Platforms', 'Google Ads (Primary), Meta Ads (Secondary)']];
const strategyItems = [['Platform Strategy', 'Google Ads for high-intent search, Meta for retargeting and awareness. Estimated 70/30 budget split.'], ['Audience Strategy', 'Prospecting via intent keywords + lookalike audiences from CRM. Retarget site visitors 30 days.'], ['Budget Strategy', 'Front-load first 2 weeks for learning phase. Daily cap €167. Increase after 50 conversions.'], ['Creative Strategy', '3 messaging angles: Efficiency, Growth, Data Intelligence. A/B test headlines.'], ['Conversion Strategy', 'Primary: Lead form. Secondary: Demo booking. Attribution: 30-day click, 1-day view.'], ['Measurement Strategy', 'ROAS, CPL, MQL rate tracked weekly. AI anomaly detection enabled.']];
const AIBadge = ({
  children = 'AI Generated'
}: {
  children?: string;
}) => <span className="ai-badge"><Sparkles size={11} />{children}</span>;
const PlatformIcon = ({
  letter,
  color
}: {
  letter: string;
  color: string;
}) => <span className="platform-icon" style={{
  background: color
}}>{letter}</span>;
function Sidebar() {
  const nav = [{
    icon: LayoutDashboard,
    label: 'Overview'
  }, {
    icon: Activity,
    label: 'Operations'
  }, {
    icon: BarChart3,
    label: 'Analytics'
  }, {
    icon: MegaphoneIcon,
    label: 'Advertising',
    active: true
  }, {
    icon: Users,
    label: 'Customers'
  }, {
    icon: WalletCards,
    label: 'Finance'
  }];
  return <aside className="sidebar"><div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><strong>LULU</strong><span className="brand-ai">AI</span></div><div className="workspace-label">WORKSPACE</div><nav aria-label="Primary navigation">{nav.map(({
        icon: Icon,
        label,
        active
      }) => <button key={label} className={`nav-item ${active ? 'active' : ''}`} aria-current={active ? 'page' : undefined}><Icon size={18} /><span>{label}</span></button>)}</nav><div className="sidebar-bottom"><button className="nav-item"><Settings2 size={18} /><span>Settings</span></button><div className="user-mini"><span className="avatar">ES</span><span><strong>Elena Schmidt</strong><small>Admin</small></span><MoreHorizontal size={16} /></div></div></aside>;
}
const MegaphoneIcon = () => <span className="nav-mega">✦</span>;
function LuluCampaignBuilder() {
  const [selectedPlatforms, setSelectedPlatforms] = useState(platforms.map(item => item.selected));
  const [acceptedBrief, setAcceptedBrief] = useState(false);
  const [acceptedStrategy, setAcceptedStrategy] = useState(false);
  const [showChat, setShowChat] = useState(false);
  return <div className="app-shell"><Sidebar /><main className="main-area"><header className="topbar"><div><div className="breadcrumb"><span>Advertising</span><ChevronDown size={12} /><span>Campaigns</span><ChevronDown size={12} /><strong>Create Campaign</strong></div><div className="title-row"><h1><Sparkles size={21} />AI Campaign &amp; Ad Builder</h1><span className="status-pill">Draft — Step 3 of 14</span></div></div><div className="header-actions"><button className="btn outline">Save Draft</button><button className="text-btn"><History size={15} /> Version History</button><button className="icon-btn" aria-label="Help"><CircleHelp size={18} /></button></div></header><div className="progress-wrap"><div className="step-line" />{steps.map((step, index) => <div key={step} className={`step ${index < 2 ? 'done' : index === 2 ? 'current' : ''}`}><span className="step-dot">{index < 2 ? <Check size={12} /> : index + 1}</span><small>{step}</small></div>)}</div><div className="workspace"><aside className="context-column"><section className="panel context-panel"><div className="panel-heading"><h2>Campaign Context</h2><MoreHorizontal size={17} /></div><label className="field-label">CAMPAIGN NAME<input defaultValue="Q1 Lead Generation — Google + Meta" /></label><span className="draft-chip">Draft</span><div className="context-row"><span>Platforms</span><div><span className="tiny-platform violet">G</span><span className="tiny-platform blue">M</span></div></div><div className="context-row"><span>Objective</span><span className="value-with-ai">Lead Generation <AIBadge>AI Recommended</AIBadge></span></div><div className="context-row"><span>Budget</span><strong>€5,000 / month</strong></div><div className="context-row"><span>Start Date</span><strong>Jan 6, 2025</strong></div><div className="confidence"><div className="ring">87<span>%</span></div><div><strong>AI Confidence</strong><small>Strong recommendation</small></div></div><div className="subsection"><h3>Business Context Used</h3><ul className="context-list"><li><Check size={14} className="success" /><span>Company Profile</span><small>Connected</small></li><li><Check size={14} className="success" /><span>Shopify</span><small>Synced 8 min ago</small></li><li><Check size={14} className="success" /><span>Google Analytics</span><small>Synced 12 min ago</small></li><li><Check size={14} className="success" /><span>Google Ads</span><small>Synced 5 min ago</small></li><li><Clock3 size={14} className="warning" /><span>Meta Ads</span><small>Synced 45 min ago</small></li><li><X size={14} className="error" /><span>LinkedIn</span><small>Not connected</small></li></ul></div><div className="ask-lulu"><div className="ask-heading"><Bot size={15} /><strong>Ask Lulu AI</strong></div><button className="chat-input" onClick={() => setShowChat(!showChat)}>Why did you choose this strategy? <ArrowRight size={14} /></button>{showChat && <p className="chat-answer">I prioritized high-intent channels based on observed CPL and your DACH audience fit.</p>}<div className="question-chips"><button>Why Google over TikTok?</button><button>Best bidding strategy?</button><button>Increase budget impact?</button></div></div></section></aside><section className="center-column"><section className="panel"><div className="panel-heading"><div><h2>AI Campaign Brief</h2><p>Structured from your business context</p></div><div className="heading-actions"><AIBadge /><button className="small-btn"><RefreshCw size={13} /> Regenerate</button></div></div><div className="brief-grid">{briefFields.map(([label, value]) => <div className="brief-field" key={label}><label>{label}<span className="ai-dot" /><Pencil size={12} /></label><p>{value}</p></div>)}</div><div className="card-actions"><button className={`btn primary ${acceptedBrief ? 'accepted' : ''}`} onClick={() => setAcceptedBrief(true)}>{acceptedBrief ? <><Check size={15} /> Brief Accepted</> : 'Accept Brief'}</button><button className="btn outline">Edit Brief</button><button className="btn ghost"><RefreshCw size={14} /> Regenerate</button></div></section><section className="panel"><div className="panel-heading"><div><h2>AI Campaign Strategy</h2><p>Recommended execution plan</p></div><AIBadge /></div><div className="stat-grid"><div><span>Primary Platform</span><strong>Google Ads</strong></div><div><span>Objective</span><strong>Lead Gen</strong></div><div><span>Budget</span><strong>€5K/mo</strong></div><div><span>Confidence</span><strong className="violet-text">87%</strong></div></div><div className="strategy-grid">{strategyItems.map(([title, text]) => <article className="strategy-item" key={title}><div className="strategy-icon"><Lightbulb size={15} /></div><div><h3>{title}</h3><p>{text}</p></div></article>)}</div><div className="card-actions"><button className={`btn primary ${acceptedStrategy ? 'accepted' : ''}`} onClick={() => setAcceptedStrategy(true)}>{acceptedStrategy ? <><Check size={15} /> Strategy Accepted</> : 'Accept Strategy'}</button><button className="btn outline">Edit</button><button className="btn ghost"><RefreshCw size={14} /> Regenerate</button></div></section><section className="panel"><div className="panel-heading"><div><h2>Recommended Advertising Platforms</h2><p>AI-ranked from observed account performance</p></div><AIBadge>AI Recommended</AIBadge></div><div className="platform-list">{platforms.map((item, index) => <div className={`platform-row ${selectedPlatforms[index] ? 'selected' : ''}`} key={item.name}><button className={`check-toggle ${selectedPlatforms[index] ? 'checked' : ''}`} onClick={() => setSelectedPlatforms(selectedPlatforms.map((value, itemIndex) => itemIndex === index ? !value : value))} aria-label={`Include ${item.name}`}>{selectedPlatforms[index] && <Check size={13} />}</button><PlatformIcon letter={item.letter} color={item.color} /><div className="platform-main"><div className="platform-title"><strong>{item.name}</strong><span className={`suitability ${item.status.toLowerCase().replace(/ /g, '-')}`}>{item.status}</span></div><p>{item.reason}</p><small>{item.note}</small></div><div className="confidence-bar"><span>{item.confidence}%</span><div><i style={{
                      width: `${item.confidence}%`
                    }} /></div><small>Confidence</small></div></div>)}</div></section><section className="panel"><div className="panel-heading"><div><h2>AI Audience Strategy</h2><p>Three audiences ready for activation</p></div><AIBadge /></div><div className="audience-list">{audiences.map(item => <article className="audience-card" key={item.title}><div className="audience-top"><div><h3>{item.title}</h3><div className="tag-row"><span>{item.type}</span><span>{item.platform}</span></div></div><span className="audience-size">{item.size}<small>Estimated size</small></span></div><p>{item.reason}</p><div className="audience-bottom"><span><strong>Role</strong>{item.role}</span><span><strong>Confidence</strong><em className={item.confidence === 'Medium' ? 'medium' : ''}>{item.confidence}</em></span><div className="inline-actions"><button>Include</button><button>Edit</button><button>Remove</button></div></div></article>)}</div><button className="add-link"><Plus size={15} /> Add Custom Audience</button></section><section className="panel"><div className="panel-heading"><div><h2>AI Budget Strategy</h2><p>Monthly allocation based on historical CPL</p></div><AIBadge>AI Recommended Allocation</AIBadge></div><div className="budget-stats"><div><span>Total Budget</span><strong>€10,000</strong></div><div><span>Period</span><strong>Monthly</strong></div><div><span>Daily Cap</span><strong>€334</strong></div><label className="toggle-label">Adjust Manually <button className="switch" aria-label="Adjust manually"><i /></button></label></div><div className="allocation"><div className="allocation-bar"><i className="google" /><i className="meta" /><i className="linkedin" /></div><div className="allocation-legend"><span><i className="dot google" />Google Ads <strong>60% · €6,000</strong></span><span><i className="dot meta" />Meta Ads <strong>30% · €3,000</strong></span><span><i className="dot linkedin" />LinkedIn <strong>10% · €1,000</strong></span></div></div><div className="allocation-inputs"><label>Google Ads<input defaultValue="€6,000" /></label><label>Meta Ads<input defaultValue="€3,000" /></label><label>LinkedIn<input defaultValue="€1,000" /></label></div><p className="disclaimer">Budget estimates are AI-inferred based on historical CPL and audience size. Not guaranteed results. Estimates.</p></section><section className="panel tracking"><div className="panel-heading"><div><h2>Tracking Readiness</h2><p>Conversion measurement status</p></div><span className="ready-badge"><Check size={13} /> Ready</span></div><ul className="tracking-list"><li><Check size={15} /><span>Google Ads Conversion Tag</span><small>Active · Lead Form</small></li><li><Check size={15} /><span>Google Analytics 4</span><small>Connected · Event tracking active</small></li><li><Check size={15} /><span>Meta Pixel</span><small>Active · Standard events configured</small></li><li><Check size={15} /><span>Conversion API</span><small>Meta CAPI · Connected</small></li><li className="warn"><Clock3 size={15} /><span>LinkedIn Insight Tag</span><small>Installed but not verified</small></li></ul><div className="tracking-footer"><p>All critical tracking is ready. LinkedIn verification recommended before enabling LinkedIn ads.</p><button className="btn warning-btn">Fix LinkedIn Tracking</button></div></section></section><aside className="right-column"><section className="panel intelligence"><div className="panel-heading"><div><h2>Lulu AI Campaign Intelligence</h2><p>Updated just now</p></div><Bot size={19} className="violet-text" /></div><div className="strategy-ready"><span /><strong>Strategy Ready</strong></div><div className="insight-box">Based on your business context, CRM data, and historical advertising performance, Lulu AI has built a two-platform strategy targeting high-intent decision-makers in DACH markets. Google Ads will capture bottom-funnel search intent while Meta retargets engaged visitors. Estimated CPL range: €38–€55 based on observed data.</div><span className="estimate-label">Estimates · AI Inferred · Not guaranteed</span><div className="key-metrics"><div><span>Est. Monthly Leads</span><strong>91–133</strong></div><div><span>Est. CPL</span><strong>€38–€55</strong><small>Estimated</small></div><div><span>Platforms</span><strong>2 Active</strong></div><div><span>Audiences</span><strong>3 Ready</strong></div></div><div className="opportunity"><strong><Zap size={14} /> Biggest Opportunity</strong><p>CRM lookalike audiences are untested in paid. High potential.</p></div><div className="risk"><strong><ShieldCheck size={14} /> Biggest Risk</strong><p>LinkedIn tracking not fully verified. Enable after fix.</p></div><div className="next-step"><span>Recommended Next</span><strong>Review audience strategy, then proceed to Budget.</strong></div></section><section className="panel validation"><div className="panel-heading"><h2>Campaign Validation</h2><span className="score">8/10</span></div><div className="needs-attention"><span />Needs Attention</div><div className="validation-counts"><span className="critical"><strong>0</strong> Critical</span><span className="warning"><strong>2</strong> Warning</span><span className="info"><strong>1</strong> Info</span></div><ul className="validation-list"><li><span>⚠</span><p>LinkedIn Insight Tag not verified<small>Fix before enabling LinkedIn</small></p></li><li><span>⚠</span><p>No creative assets uploaded<small>AI can generate draft creative in step 8</small></p></li><li className="info"><span>ℹ</span><p>Landing page not yet analyzed<small>Add URL in step 10</small></p></li></ul><button className="btn warning-btn full">Fix Issues</button><button className="btn primary full">Continue to Platforms</button></section><section className="panel activity"><div className="panel-heading"><h2>Campaign Activity</h2><MoreHorizontal size={17} /></div><ol>{[['Campaign created', 'You', 'Just now', User], ['AI generated campaign brief', 'Lulu AI', 'Just now', Sparkles], ['Business context analyzed', 'Lulu AI', '2 min ago', Bot]].map(([title, actor, time, Icon]) => <li key={String(title)}><span className="timeline-icon"><Icon size={13} /></span><div><strong>{String(title)}</strong><small>{String(actor)} · {String(time)}</small></div></li>)}</ol></section><section className="panel skeleton-card"><div className="skeleton-line wide" /><div className="skeleton-line" /><div className="skeleton-line short" /><span>AI analysis updating…</span></section></aside></div><footer className="bottom-bar"><button className="text-btn"><ArrowLeft size={15} /> Back: Campaign Brief</button><strong>Step 3 of 14 — AI Campaign Strategy</strong><button className="btn primary">Continue: Platform Selection <ArrowRight size={15} /></button></footer></main></div>;
}
export { LuluCampaignBuilder };