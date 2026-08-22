import { useState } from 'react';
import type { ReactNode } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertTriangle, ArrowRight, Bell, Bot, Check, ChevronDown, ChevronRight, Clock3, FileCheck2, Filter, HelpCircle, History, LayoutGrid, Link2, Megaphone, MoreHorizontal, Pause, Play, Plus, RefreshCw, Search, Send, Settings2, ShieldCheck, Sparkles, Tag, TrendingUp, Upload, Users, X, Zap } from 'lucide-react';
type Risk = 'High' | 'Medium' | 'Low';
type Platform = 'Google' | 'Meta' | 'LinkedIn' | 'TikTok';
const approvals: Array<Record<string, any>> = [];
const operations = [['Brand Awareness — DE', 'Google', 'Create Campaign', 'Publishing', 'Lulu AI', 'Workspace member', '2 min ago'], ['Retargeting — DACH', 'Meta', 'Budget Update', 'Published', 'Lulu AI', 'Workspace member', '18 min ago'], ['B2B Enterprise', 'LinkedIn', 'Create Campaign', 'Failed', 'Lulu AI', 'Tom K.', '1 hr ago'], ['Summer Collection', 'TikTok', 'Create Campaign', 'Scheduled', 'User', 'Workspace member', 'Not available, 09:00'], ['Q4 Performance Max', 'Google', 'Activate Campaign', 'Published', 'User', 'Auto-Policy', 'Yesterday']];
const history: any[][] = [];
const platformInfo: Record<Platform, {
  label: string;
  className: string;
}> = {
  Google: {
    label: 'G',
    className: 'google'
  },
  Meta: {
    label: 'M',
    className: 'meta'
  },
  LinkedIn: {
    label: 'In',
    className: 'linkedin'
  },
  TikTok: {
    label: 'T',
    className: 'tiktok'
  }
};
function PlatformBadge({
  platform
}: {
  platform: Platform;
}) {
  const p = platformInfo[platform];
  return <span className={`platform ${p.className}`} aria-label={`${platform} Ads`}>{p.label}</span>;
}
function Status({
  value
}: {
  value: string;
}) {
  const icons: Record<string, ReactNode> = {
    Publishing: <span className="pulse" />,
    Published: <Check size={12} />,
    Failed: <AlertTriangle size={12} />,
    Scheduled: <Clock3 size={12} />
  };
  return <span className={`status status-${value.toLowerCase()}`}>{icons[value]}<span>{value}</span></span>;
}
function AiBadge({
  children = 'AI Recommended'
}: {
  children?: string;
}) {
  return <span className="ai-badge"><Sparkles size={11} />{children}</span>;
}
function SectionTitle({
  title,
  count,
  action
}: {
  title: string;
  count?: string;
  action?: string;
}) {
  return <div className="section-title"><h2>{title} {count && <span className="count">{count}</span>}</h2>{action && <button className="text-link">{action} <ArrowRight size={13} /></button>}</div>;
}
export function LuluPublishingCenter() {
  const { items: publishingRecords, loading: publishingLoading, error: publishingError } = useLiveRecords('publishing_operations');
  const [expanded, setExpanded] = useState('');
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };
  if (publishingLoading) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground">Loading live publishing data…</main>;
  if (publishingError) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-destructive">{publishingError}</main>;
  if (publishingRecords.length === 0) return <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10"><div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-border bg-card p-8 text-center"><Upload className="mx-auto mb-4 text-muted-foreground" size={28} /><h1 className="text-2xl font-semibold">Publishing Center</h1><p className="mt-3 text-sm text-muted-foreground">No live publishing operations are available yet. Connect and verify an advertising platform before reviewing or publishing campaigns.</p></div></main>;
  return <div className="lulu-app">
    <style>{styles}</style>
    <aside className="rail"><div className="brand-mark">L</div><span className="brand-name">LULU <em>AI</em></span><LuluSectionNavigation activeId="sunnily-peak-7188" /><div className="rail-bottom"><button className="rail-btn"><Settings2 size={18} /><span>Settings</span></button><div className="avatar">SM</div></div></aside>
    <main className="main">
      <header className="page-header"><div><div className="crumb">Advertising <ChevronRight size={13} /> <strong>Publishing Center</strong></div><h1>Publishing Center <Upload size={20} /></h1><p>Review, approve, schedule and publish AI-powered advertising campaigns across your connected platforms.</p></div><div className="header-actions"><button className="outline-btn" onClick={() => notify('Publishing data refreshed')}><RefreshCw size={15} /> Refresh</button><button className="violet-outline" onClick={() => notify('Lulu AI context is ready')}><Sparkles size={15} /> Ask Lulu AI</button><button className="text-link">View Activity <ArrowRight size={14} /></button></div></header>
      <section className="kpis">{[['Pending Approval', '4', 'Requires your review', 'amber'], ['Ready to Publish', '2', '2 campaigns validated', 'green'], ['Scheduled', '3', 'Next: Not available, 09:00 CET', 'blue'], ['Publishing', '1', 'Google Ads · In progress', 'violet'], ['Published Today', '7', 'Across 3 platforms', 'green'], ['Failed', '1', 'Requires attention', 'red']].map(([label, num, sub, color]) => <article className={`kpi ${color}`} key={label}><strong>{num}</strong><div><h3>{label}</h3><p>{sub}</p></div></article>)}</section>
      <div className="workspace"><div className="left-col">
        <section><SectionTitle title="Pending Approvals" count="4" /><div className="filters"><button>All Platforms <ChevronDown size={13} /></button><button>All Types <ChevronDown size={13} /></button><button>Risk <ChevronDown size={13} /></button><button className="amber-outline" onClick={() => notify('Bulk approve requires confirmation')}><Check size={14} /> Bulk Approve</button></div>
          {approvals.map(item => <article className={`approval ${item.risk.toLowerCase()}`} key={item.id}><div className="approval-top"><PlatformBadge platform={item.platform} /><h3>{item.title}</h3><span className="type-chip">{item.type}</span><span className={`risk ${item.risk.toLowerCase()}`}>{item.risk}</span><strong className="impact">{item.impact}</strong><button className="more"><MoreHorizontal size={17} /></button></div><p className="approval-meta"><AiBadge /> <span>{item.meta}</span></p><p className="summary"><strong><Sparkles size={13} /> AI Change</strong><span>{item.summary}</span></p>{item.evidence && <p className="evidence"><ShieldCheck size={13} /> {item.evidence}</p>}<div className="approval-actions"><button className="review" onClick={() => setExpanded(expanded === item.id ? '' : item.id)}>Review <ArrowRight size={14} /></button>{item.id !== 'summer' && <button onClick={() => notify(`${item.title} approved`)}><Check size={14} /> Approve</button>}<button onClick={() => notify(`${item.title} rejected`)}><X size={14} /> Reject</button></div></article>)}
          {expanded === 'lead-gen' && <article className="detail"><div className="detail-head"><div><span className="eyebrow">REVIEW ADVERTISING CHANGE</span><h3>Q1 Lead Generation Campaign</h3></div><button className="icon-btn" onClick={() => setExpanded('')}><X size={17} /></button></div><div className="diff-head"><span>Current Configuration</span><span>Proposed Configuration <AiBadge>AI Change</AiBadge></span></div>{[['Campaign Name', '—', 'Q1 Lead Gen — DACH — Google + Meta'], ['Platform', '—', 'Google Ads + Meta Ads'], ['Objective', '—', 'Lead Generation'], ['Budget', '—', '—/mo Google + —/mo Meta'], ['Audience', '—', '3 audiences · High-Intent Visitors, CRM Lookalike, DACH Interests'], ['Schedule', '—', 'Not available, 2025 → Ongoing'], ['Tracking', '—', 'Google Tag + Meta Pixel + CAPI ✓'], ['Ads', '—', '8 creatives · AI Generated']].map(([a, b, c]) => <div className="diff-row" key={a}><span>{a}</span><span>{b}</span><span>{c}<small>Change</small></span></div>)}<div className="reason"><AiBadge>AI Inferred</AiBadge><p>Lulu AI built this campaign based on your stated Q1 business goal, CRM data, historical Google Ads performance (CPL: — avg), and available Meta retargeting audiences. Strategy prioritizes high-intent bottom-funnel search traffic on Google and retargeting on Meta.</p></div><div className="detail-notes"><p><strong>Data Sources</strong> Company Profile · CRM · Google Analytics · Google Ads (Synced 5 min ago) · Meta Ads (Synced 45 min ago) · <span className="observed">Observed Data</span></p><p><strong>Potential Impact</strong> <span className="estimated">Estimated</span> 91–133 leads/month at CPL —–— Not guaranteed.</p><p><strong>Risk level</strong> <span className="risk high">High</span> — New campaign + financial commitment. Requires Marketing Manager approval.</p></div><div className="steps"><span>Lulu AI Recommendation</span><b>1</b><strong>Marketing Manager (You)</strong><b>2</b><span>Finance Approval</span><ArrowRight size={15} /><span>Publish</span></div><div className="detail-actions"><button onClick={() => notify('Change request sent')}>Request Changes</button><button onClick={() => notify('Change rejected')}>Reject Change</button><button className="primary" onClick={() => notify('Forwarded to Finance')}>Approve & Forward to Finance <ArrowRight size={15} /></button></div></article>}
        </section>
        <section><SectionTitle title="Publishing Operations" /><div className="table-tools"><button><Filter size={14} /> Filter</button><label><Search size={14} /><input placeholder="Search operations..." value={query} onChange={e => setQuery(e.target.value)} /></label></div><div className="data-table"><div className="table-head"><span>Campaign</span><span>Platform</span><span>Operation</span><span>Status</span><span>Initiated By</span><span>Approved By</span><span>Updated</span><span /></div>{operations.filter(row => row.join(' ').toLowerCase().includes(query.toLowerCase())).map(row => <div className="table-row" key={row[0]}>{row.map((cell, i) => i === 1 ? <span key={cell}><PlatformBadge platform={cell === 'Google' ? 'Google' : cell as Platform} /></span> : i === 3 ? <Status key={cell} value={cell} /> : <span key={`${cell}-${i}`}>{cell}</span>)}<button className="view">View <ArrowRight size={12} /></button></div>)}</div></section>
        <section><SectionTitle title="Multi-Platform Publishing — Brand Awareness DE" /><p className="section-sub">Campaign is publishing to 4 platforms. Each platform has an independent status.</p><div className="platform-status">{[['Google', 'Creating Ad Groups...', 'Publishing', '60%'], ['Meta', 'Complete', 'Published', '100%'], ['LinkedIn', 'Failed — Creative rejected by platform', 'Failed', '0%'], ['TikTok', 'Queued', 'Scheduled', '12%']].map(row => <div className="platform-row" key={row[0]}><PlatformBadge platform={row[0] as Platform} /><strong>{row[0]} Ads</strong><span>{row[1]}</span><Status value={row[2]} /><div className="progress"><i style={{
                    width: row[3]
                  }} /></div></div>)}</div><div className="warning-banner"><AlertTriangle size={16} /> 1 of 4 platforms failed. Review LinkedIn error before retrying.</div><div className="button-row"><button onClick={() => notify('LinkedIn retry queued')}>Retry LinkedIn</button><button>View Error Details</button><button>Continue Monitoring</button></div></section>
        <section><SectionTitle title="Publishing Errors" count="1" /><article className="error-card"><PlatformBadge platform="LinkedIn" /><div><h3>B2B Enterprise Campaign — Creative Rejected</h3><p>LinkedIn rejected the uploaded creative. The image dimensions do not meet LinkedIn's required 1200×627px specification for sponsored content.</p><div className="error-meta"><span className="risk critical">Critical</span> First Detected: 1 hr ago · Last Attempt: 45 min ago</div><div className="button-row"><button className="primary-red">Fix Creative <ArrowRight size={14} /></button><button>Retry</button><button>Save as Draft</button></div><small>LinkedIn platform message: Image aspect ratio invalid. No API credentials or tokens shown.</small></div></article></section>
        <section><SectionTitle title="Publishing History" action="View All" /><div className="history-list">{history.map(row => <div className="history-row" key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><span>{row[2]}</span><span>{row[3]}</span><span>{row[4]}</span><Status value={row[5] === 'Rejected' ? 'Failed' : 'Published'} /><span>{row[6]}</span></div>)}</div><button className="text-link bottom-link">View Full History <ArrowRight size={13} /></button></section>
        <section className="split-cards"><article className="card"><SectionTitle title="Version Comparison — DACH Retargeting" /><div className="tabs"><button className="selected">Version 3 — Published</button><button>Version 2 — Previous</button></div>{[['Budget', '— → —', 'AI Change'], ['Audience', '2 segments → 3 segments', 'AI Change'], ['Creative', 'Creative A → Creative B', 'AI Change'], ['Bidding', 'Manual CPC → Target CPA', 'User Change'], ['Tracking', 'Same', '—']].map(row => <div className="mini-diff" key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><small className={row[2] === 'AI Change' ? 'ai-text' : ''}>{row[2]}</small></div>)}<p className="legend"><span className="ai-text">AI Change</span> · User Change · <span className="blue-text">Platform Change</span></p></article><article className="card schedule"><SectionTitle title="Schedule Publication" /><div className="form-grid">{[['Campaign', 'Summer Collection — TikTok'], ['Platform', 'TikTok Ads'], ['Date', 'Not available, 2025'], ['Time', '09:00'], ['Time Zone', 'CET (Europe/Berlin)']].map(row => <label key={row[0]}>{row[0]}<button>{row[1]} <ChevronDown size={13} /></button></label>)}</div><p className="preview">Scheduled for September 12, 2025 · 09:00 CET</p><div className="button-row"><button>Cancel</button><button className="primary" onClick={() => notify('Publication scheduled')}>Schedule Publication</button></div></article></section>
        <article className="empty"><div><h3>Nothing Is Waiting for Approval</h3><p>There are currently no advertising campaigns or changes requiring your approval.</p></div><button className="primary"><Plus size={15} /> Create Campaign with AI</button></article>
      </div><aside className="right-col">
        <article className="side-card assistant"><div className="side-head"><div><h2><Sparkles size={17} /> Ask Lulu AI</h2><p>Publishing context loaded</p></div><Bot size={22} /></div><div className="chat"><p className="user-msg">Is the Q1 Lead Gen campaign ready to publish?</p><div className="ai-msg"><AiBadge>AI Inferred</AiBadge><p>The Q1 Lead Generation campaign has passed AI validation with a score of 8/10. Two warnings remain: LinkedIn Insight Tag not verified and no uploaded creative assets — AI-generated drafts are available. Tracking is ready on Google and Meta. The campaign is awaiting Finance approval before it can be published. Estimated financial exposure: —/month across both platforms.</p><small>Campaign context · Updated just now</small></div></div><div className="suggestions">{['What will this campaign spend?', 'Which platform to publish first?', 'What risks should I review?', 'What changed since v2?'].map(q => <button key={q} onClick={() => notify('Question added to Lulu AI')}>{q}</button>)}</div><label className="chat-input"><input placeholder="Ask about this campaign..." /><button aria-label="Send"><Send size={15} /></button></label></article>
        <article className="side-card"><div className="side-head"><div><h2>Advertising Automation Policy</h2><p>Current Policy <span className="policy">Recommend Changes</span></p></div><button className="text-link">Edit Policy</button></div><div className="policy-level">{['Notify Only', 'Recommend Changes (ACTIVE)', 'Auto-Apply Approved Rules', 'Fully Automated'].map((x, i) => <p key={x}><span className={i === 1 ? 'radio on' : 'radio'} />{x}</p>)}</div><h3 className="subhead">Financial Safeguards</h3><ul className="safeguards"><li>Max budget change: <strong>— per action</strong></li><li>Max daily spend increase: <strong>—</strong></li><li>Allowed platforms: Google Ads, Meta Ads</li><li>Requires approval: New campaigns, Budget changes, Audience changes</li><li>Required roles: Marketing Manager + Finance (&gt;—)</li></ul><small className="muted-note">Automation cannot exceed these organization-configured limits. Changes require Admin access to modify.</small></article>
        <article className="side-card"><div className="side-head"><h2>AI Alerts <span className="alert-count">2</span></h2><Bell size={16} /></div><div className="alert amber"><h3><AlertTriangle size={14} /> DACH Retargeting — CPA Increased</h3><p>CPA increased — over the last 72 hours since budget change was published.</p><small>Observed · Meta Ads · Updated 4 min ago</small><div><button>Review</button><button>Ask Lulu AI</button></div></div><div className="alert blue"><h3><HelpCircle size={14} /> Brand Awareness — Learning Phase</h3><p>Campaign entered learning phase on Google Ads. Expect performance fluctuation for 7–10 days. No action required.</p><small>Observed · Google Ads · Updated 2 min ago</small><div><button>Dismiss</button></div></div></article>
        <article className="side-card"><div className="side-head"><div><h2><Sparkles size={16} /> Lulu AI Change Summary</h2><p>DACH Retargeting — Version 3</p></div></div><p className="change-intro">Lulu AI proposed 4 changes before this publication:</p><ol className="change-list"><li>Budget increased — (— → —) <AiBadge /></li><li>New CRM lookalike audience added <AiBadge /></li><li>Creative B selected over Creative A (CTR —) <AiBadge /></li><li>Conversion optimization changed to Target CPA <AiBadge /></li></ol><small>Approved by: Workspace member · Published: Today 11:42 CET</small></article>
        <article className="side-card monitoring"><div className="side-head"><h2><span className="green-dot" /> Post-Publish Monitoring</h2></div><p>Active campaigns being monitored: <strong>3</strong></p>{[['DACH Retargeting · Meta', 'ROAS 3.2 · CPL — · Spend —', 'Healthy'], ['Q4 Perf Max · Google', 'ROAS 4.1 · CPL — · Spend —', 'Healthy'], ['Brand Awareness · Google', 'CTR 2.8% · Reach 48K', 'Learning']].map(row => <div className="monitor-row" key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><em>{row[2]}</em></div>)}<button className="outline-btn full">Monitor All Campaigns <ArrowRight size={14} /></button></article>
      </aside></div>
    </main><div className="sticky"><span><strong>1 campaign</strong> selected for review</span><div><button onClick={() => notify('Change rejected')}>Reject <X size={14} /></button><button>Request Changes</button><button className="primary" onClick={() => notify('Approval advanced to Finance')}>Approve & Advance <ArrowRight size={14} /></button></div><span>Finance approval required for budgets over —</span></div>{toast && <div className="toast"><Check size={15} /> {toast}</div>}
  </div>;
}
const styles = `
:root{font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:var(--foreground);background:var(--background)}*{box-sizing:border-box}.lulu-app{min-height:100vh;background:var(--background);color:var(--foreground);font-size:13px;padding-bottom:72px}.rail{position:fixed;inset:0 auto 0 0;width:64px;background:var(--background);border-right:1px solid rgba(0,0,0,.07);display:flex;flex-direction:column;align-items:center;z-index:3}.brand-mark{margin-top:17px;width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,var(--primary),var(--primary));display:grid;place-items:center;font-weight:800;font-size:17px;color:var(--primary-foreground)}.brand-name{font-size:8px;font-weight:800;letter-spacing:.12em;color:var(--muted-foreground);margin:7px 0 27px;writing-mode:vertical-rl;transform:rotate(180deg)}.brand-name em{color:var(--foreground);font-style:normal}.rail nav{display:flex;flex-direction:column;gap:8px}.rail-btn{border:0;background:none;color:var(--muted-foreground);width:48px;height:46px;border-radius:10px;display:grid;place-items:center;cursor:pointer;position:relative}.rail-btn span{position:absolute;left:57px;white-space:nowrap;background:var(--background);border:1px solid var(--muted-foreground);padding:5px 8px;border-radius:5px;font-size:11px;display:none}.rail-btn:hover span{display:block}.rail-btn.active{color:var(--foreground);background:var(--background)}.rail-bottom{margin-top:auto;margin-bottom:18px;display:grid;gap:14px;place-items:center}.avatar{width:28px;height:28px;border-radius:50%;background:var(--background);color:var(--foreground);display:grid;place-items:center;font-size:10px;font-weight:700}.main{margin-left:64px;padding:30px 32px 100px;max-width:1600px}.page-header{display:flex;justify-content:space-between;gap:30px;margin-bottom:26px}.crumb{display:flex;align-items:center;gap:7px;color:var(--muted-foreground);font-size:12px;margin-bottom:12px}.crumb strong{color:var(--muted-foreground);font-weight:500}.page-header h1{font-size:26px;letter-spacing:-.04em;margin:0;display:flex;align-items:center;gap:9px}.page-header h1 svg{color:var(--foreground)}.page-header p,.section-sub{color:var(--muted-foreground);margin:7px 0 0}.header-actions{display:flex;align-items:center;gap:10px;padding-top:25px}.button-row,.filters,.table-tools,.approval-actions,.detail-actions{display:flex;align-items:center;gap:8px}.outline-btn,.violet-outline,.filters button,.table-tools button,.table-tools label,.approval-actions button,.button-row button,.detail-actions button,.empty button,.sticky button,.alert button,.form-grid button,.monitoring .outline-btn{border:1px solid rgba(0,0,0,.11);background:var(--background);color:var(--foreground);border-radius:7px;padding:8px 11px;display:inline-flex;align-items:center;gap:6px;cursor:pointer;font:inherit;white-space:nowrap}.violet-outline{border-color:var(--foreground);color:var(--foreground)}.text-link{color:var(--foreground);border:0;background:none;cursor:pointer;display:inline-flex;align-items:center;gap:5px;padding:5px;font:inherit}.kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:30px}.kpi{height:90px;background:var(--background);border:1px solid rgba(0,0,0,.07);border-left:3px solid;display:flex;align-items:center;gap:13px;padding:15px;border-radius:9px}.kpi strong{font-size:28px;letter-spacing:-.04em}.kpi h3{font-size:12px;margin:0;font-weight:600}.kpi p{font-size:11px;color:var(--muted-foreground);margin:6px 0 0;white-space:nowrap}.amber{border-color:var(--foreground)}.green{border-color:var(--foreground)}.blue{border-color:var(--foreground)}.violet{border-color:var(--foreground)}.red{border-color:var(--foreground)}.workspace{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:24px;align-items:start}.left-col,.right-col{min-width:0}.left-col>section{margin-bottom:28px}.section-title{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(0,0,0,.06);padding-bottom:11px;margin-bottom:12px}.section-title h2{font-size:16px;margin:0;letter-spacing:-.02em}.count,.alert-count{font-size:11px;color:var(--foreground);background:var(--background);padding:3px 7px;border-radius:99px;margin-left:5px}.filters{margin-bottom:10px}.filters button{padding:7px 10px;font-size:12px}.filters .amber-outline{margin-left:auto;border-color:var(--foreground);color:var(--foreground)}.approval{background:var(--background);border:1px solid rgba(0,0,0,.07);border-left:3px solid var(--border);border-radius:10px;padding:15px 16px 12px;margin:9px 0;transition:.2s}.approval:hover,.card:hover,.side-card:hover,.error-card:hover{background:var(--background)}.approval.high{border-left-color:var(--chart-5)}.approval.medium{border-left-color:var(--foreground)}.approval-top{display:flex;align-items:center;gap:9px;min-width:0}.approval-top h3{font-size:14px;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.platform{width:24px;height:24px;border-radius:6px;display:inline-grid;place-items:center;font-size:11px;font-weight:800;flex:none}.google{background:var(--primary);color:var(--primary-foreground)}.meta{background:var(--primary);color:var(--primary-foreground)}.linkedin{background:var(--primary);color:var(--primary-foreground)}.tiktok{background:var(--background);border:1px solid var(--muted-foreground);color:var(--foreground)}.type-chip,.risk{border-radius:5px;font-size:10px;padding:4px 7px;white-space:nowrap}.type-chip{color:var(--muted-foreground);border:1px solid rgba(0,0,0,.1)}.risk{font-weight:700}.risk.high,.risk.critical{background:var(--background);color:var(--chart-5)}.risk.medium{background:var(--chart-1);color:var(--chart-1)}.risk.low{background:var(--background);color:var(--foreground)}.impact{font-size:11px;color:var(--foreground);margin-left:auto;white-space:nowrap}.more{border:0;background:none;color:var(--muted-foreground);margin-left:3px}.approval-meta{display:flex;align-items:center;gap:7px;color:var(--muted-foreground);font-size:11px;margin:11px 0 8px}.ai-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 7px;border-radius:99px;background:linear-gradient(100deg,var(--primary),var(--background));border:1px solid var(--border);color:var(--foreground);font-size:10px;white-space:nowrap}.summary{display:flex;gap:8px;color:var(--muted-foreground);font-size:12px;margin:0;line-height:1.55}.summary strong{display:inline-flex;align-items:center;gap:4px;color:var(--foreground);white-space:nowrap}.evidence{color:var(--muted-foreground);font-size:11px;margin:8px 0 0;display:flex;align-items:center;gap:5px}.approval-actions{justify-content:flex-end;margin-top:11px}.approval-actions button{padding:6px 9px;font-size:11px}.approval-actions .review{border-color:var(--foreground);color:var(--foreground)}.detail{background:var(--background);border:1px solid rgba(0,0,0,.34);border-radius:10px;padding:19px;margin:10px 0 25px}.detail-head{display:flex;justify-content:space-between}.eyebrow{font-size:10px;letter-spacing:.11em;color:var(--foreground)}.detail h3{font-size:17px;margin:5px 0 17px}.icon-btn{border:0;background:none;color:var(--muted-foreground);cursor:pointer}.diff-head,.diff-row{display:grid;grid-template-columns:1.15fr .65fr 1.6fr;gap:12px}.diff-head{color:var(--foreground);font-size:11px;border-bottom:1px solid rgba(0,0,0,.07);padding:9px 10px}.diff-head span:first-child{color:var(--muted-foreground)}.diff-row{padding:9px 10px;border-bottom:1px solid rgba(0,0,0,.05);font-size:12px;color:var(--muted-foreground)}.diff-row span:last-child{color:var(--foreground);border-right:2px solid var(--border);padding-right:8px}.diff-row small{font-size:9px;color:var(--foreground);background:var(--background);border-radius:4px;padding:3px 5px;margin-left:7px}.reason{border:1px solid rgba(0,0,0,.4);background:var(--background);border-radius:8px;padding:12px;margin-top:14px}.reason p{color:var(--foreground);line-height:1.55;margin:8px 0 0;font-size:12px}.detail-notes{color:var(--muted-foreground);font-size:11px;line-height:1.5}.detail-notes p{margin:12px 0}.detail-notes strong{color:var(--foreground);margin-right:6px}.observed{color:var(--foreground)}.estimated{color:var(--foreground)}.steps{display:flex;align-items:center;gap:8px;font-size:10px;color:var(--muted-foreground);margin:15px 0;flex-wrap:wrap}.steps b{background:var(--primary);color:white;border-radius:50%;width:21px;height:21px;display:grid;place-items:center}.steps strong{color:var(--foreground)}.detail-actions{justify-content:flex-end;border-top:1px solid rgba(0,0,0,.06);padding-top:14px}.primary{background:var(--primary)!important;border-color:var(--primary-foreground)!important;color:var(--primary-foreground)!important;box-shadow:0 0 18px rgba(0,0,0,.22)}.table-tools{justify-content:flex-end;margin-bottom:10px}.table-tools label{padding:6px 9px;color:var(--muted-foreground)}.table-tools input{background:none;border:0;outline:0;color:white;font:inherit;width:150px}.data-table{border:1px solid rgba(0,0,0,.07);border-radius:9px;overflow:auto}.table-head,.table-row{display:grid;grid-template-columns:1.55fr .7fr 1.1fr .9fr .8fr .8fr .8fr 50px;align-items:center;gap:9px;padding:11px 12px;min-width:850px}.table-head{font-size:10px;color:var(--muted-foreground);text-transform:uppercase;letter-spacing:.06em;background:var(--background)}.table-row{border-top:1px solid rgba(0,0,0,.05);font-size:11px;color:var(--muted-foreground)}.table-row:hover{background:var(--background)}.status{display:inline-flex;align-items:center;gap:5px;border-radius:99px;padding:4px 7px;font-size:10px;white-space:nowrap}.status-publishing{color:var(--foreground);background:var(--background)}.status-published{color:var(--foreground);background:var(--background)}.status-failed{color:var(--chart-5);background:var(--background)}.status-scheduled{color:var(--primary-foreground);background:var(--primary)}.pulse{width:7px;height:7px;background:var(--primary);border-radius:50%;box-shadow:0 0 0 3px var(--border);color:var(--primary-foreground)}.view{border:0;background:none;color:var(--foreground);font:inherit;font-size:11px;display:flex;gap:3px;align-items:center}.platform-status{border:1px solid rgba(0,0,0,.07);border-radius:9px;overflow:hidden}.platform-row{display:grid;grid-template-columns:28px 90px 1fr 90px 100px;align-items:center;gap:9px;padding:12px;border-top:1px solid rgba(0,0,0,.05);font-size:11px}.platform-row:first-child{border-top:0}.platform-row>span:nth-child(3){color:var(--muted-foreground)}.progress{height:4px;background:var(--background);border-radius:10px;overflow:hidden}.progress i{height:100%;background:var(--primary);display:block;color:var(--primary-foreground)}.warning-banner{background:var(--background);color:var(--chart-1);padding:11px 13px;margin-top:11px;border-radius:7px;display:flex;gap:8px;align-items:center;font-size:12px}.error-card{display:flex;gap:13px;background:var(--background);border:1px solid rgba(0,0,0,.07);border-left:3px solid var(--chart-5);border-radius:9px;padding:16px}.error-card h3{font-size:14px;margin:0 0 7px}.error-card p{color:var(--foreground);line-height:1.5;margin:0}.error-meta{color:var(--muted-foreground);font-size:11px;margin:10px 0}.primary-red{color:var(--primary-foreground)!important;border-color:var(--primary)!important}.error-card small{color:var(--muted-foreground);display:block;margin-top:11px}.history-list{border:1px solid rgba(0,0,0,.07);border-radius:9px;overflow:hidden}.history-row{display:grid;grid-template-columns:1.25fr .8fr 1fr .8fr .8fr .8fr .7fr;gap:10px;padding:11px 12px;align-items:center;border-top:1px solid rgba(0,0,0,.05);font-size:11px;color:var(--muted-foreground)}.history-row:first-child{border-top:0}.history-row:hover{background:var(--background)}.history-row strong{color:var(--foreground)}.bottom-link{margin-top:10px}.split-cards{display:grid;grid-template-columns:1fr 1fr;gap:14px}.card{background:var(--background);border:1px solid rgba(0,0,0,.07);border-radius:10px;padding:15px}.tabs{display:flex;gap:4px;border-bottom:1px solid rgba(0,0,0,.06);margin-bottom:7px}.tabs button{background:none;border:0;color:var(--muted-foreground);padding:7px;font:inherit;font-size:11px}.tabs .selected{color:var(--foreground);border-bottom:2px solid var(--border)}.mini-diff{display:grid;grid-template-columns:.7fr 1.5fr auto;gap:7px;align-items:center;padding:8px 0;border-bottom:1px solid rgba(0,0,0,.05);font-size:11px}.mini-diff span{color:var(--foreground)}.mini-diff small{color:var(--muted-foreground)}.ai-text{color:var(--chart-3)!important}.blue-text{color:var(--chart-3)}.legend{font-size:10px;color:var(--muted-foreground)}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.form-grid label{color:var(--muted-foreground);font-size:10px}.form-grid label:last-child{grid-column:span 2}.form-grid button{margin-top:4px;width:100%;justify-content:space-between;font-size:11px;color:var(--foreground)}.preview{color:var(--foreground);background:var(--background);padding:9px;border-radius:6px;font-size:11px}.empty{border:1px dashed var(--muted-foreground);border-radius:9px;padding:17px 19px;display:flex;justify-content:space-between;align-items:center}.empty h3{font-size:14px;margin:0}.empty p{color:var(--muted-foreground);margin:5px 0 0}.right-col{display:flex;flex-direction:column;gap:14px}.side-card{background:var(--background);border:1px solid rgba(0,0,0,.07);border-radius:10px;padding:16px}.side-head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;border-bottom:1px solid rgba(0,0,0,.06);padding-bottom:12px;margin-bottom:12px}.side-head h2{font-size:14px;margin:0;display:flex;align-items:center;gap:6px}.side-head h2 svg{color:var(--foreground)}.side-head p{color:var(--muted-foreground);font-size:11px;margin:6px 0 0}.chat{display:flex;flex-direction:column;gap:11px}.user-msg{align-self:flex-end;background:var(--background);border-radius:8px 8px 2px 8px;padding:9px 10px;margin:0;color:var(--foreground);font-size:12px;max-width:90%}.ai-msg{border-left:2px solid var(--border);background:var(--background);padding:10px;border-radius:3px 8px 8px 3px}.ai-msg p{color:var(--foreground);line-height:1.5;font-size:11px;margin:8px 0}.ai-msg small{color:var(--foreground);font-size:10px}.suggestions{display:flex;gap:5px;flex-wrap:wrap;margin:12px 0}.suggestions button{border:1px solid rgba(0,0,0,.3);background:var(--background);color:var(--foreground);border-radius:99px;padding:6px 8px;font-size:10px;cursor:pointer}.chat-input{display:flex;border:1px solid rgba(0,0,0,.1);border-radius:7px;padding:3px 4px 3px 9px}.chat-input input{flex:1;min-width:0;border:0;outline:0;background:none;color:white;font:inherit;font-size:11px}.chat-input button{background:var(--primary);color:white;border:0;border-radius:5px;width:29px;display:grid;place-items:center}.policy{color:var(--foreground);background:var(--background);padding:4px 6px;border-radius:99px;margin-left:4px}.policy-level{color:var(--muted-foreground);font-size:11px}.policy-level p{margin:9px 0;display:flex;gap:8px;align-items:center}.radio{width:11px;height:11px;border:1px solid var(--muted-foreground);border-radius:50%;display:inline-block}.radio.on{border:3px solid var(--border)}.subhead{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--foreground);margin:17px 0 8px}.safeguards{padding-left:16px;color:var(--muted-foreground);line-height:1.8;font-size:11px}.safeguards strong{color:var(--foreground)}.muted-note{display:block;color:var(--muted-foreground);line-height:1.45}.alert{border-left:2px solid;padding:10px 0 10px 10px;margin:10px 0}.alert.amber{border-color:var(--foreground)}.alert.blue{border-color:var(--foreground)}.alert h3{font-size:12px;margin:0;display:flex;gap:6px;align-items:center}.alert p{color:var(--muted-foreground);font-size:11px;line-height:1.45;margin:6px 0}.alert small{color:var(--muted-foreground);font-size:10px}.alert div{display:flex;gap:7px;margin-top:8px}.alert button{padding:4px 7px;font-size:10px}.change-intro{color:var(--muted-foreground);font-size:11px}.change-list{padding-left:22px;color:var(--foreground);font-size:11px;line-height:2.4}.change-list li{padding-left:3px}.change-list .ai-badge{margin-left:3px}.green-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--primary);box-shadow:0 0 8px var(--primary);color:var(--primary-foreground)}.monitoring>p{color:var(--muted-foreground);font-size:11px}.monitor-row{padding:9px 0;border-top:1px solid rgba(0,0,0,.05);display:grid;gap:3px}.monitor-row strong{font-size:11px}.monitor-row span{font-size:10px;color:var(--muted-foreground)}.monitor-row em{color:var(--foreground);font-size:10px;font-style:normal}.monitoring .full{width:100%;justify-content:center;margin-top:10px}.sticky{position:fixed;bottom:0;left:64px;right:0;height:61px;background:var(--background);border-top:1px solid rgba(0,0,0,.25);display:flex;align-items:center;justify-content:space-between;padding:0 28px;z-index:2;font-size:11px;color:var(--muted-foreground)}.sticky strong{color:var(--foreground)}.sticky button{padding:7px 10px;font-size:11px}.toast{position:fixed;right:24px;bottom:78px;background:var(--background);border:1px solid var(--border);color:var(--foreground);border-radius:8px;padding:10px 14px;display:flex;gap:8px;align-items:center;z-index:5;font-size:12px}
@media(max-width:1150px){.kpis{grid-template-columns:repeat(3,1fr)}.workspace{grid-template-columns:1fr}.right-col{display:grid;grid-template-columns:repeat(2,1fr)}.assistant{grid-column:span 2}.sticky{height:auto;min-height:61px;gap:12px;flex-wrap:wrap;padding:10px 20px}.sticky>span:last-child{display:none}}
@media(max-width:720px){.rail{width:50px}.brand-name{display:none}.main{margin-left:50px;padding:20px 14px 120px}.page-header{display:block}.header-actions{padding-top:16px;flex-wrap:wrap}.page-header h1{font-size:23px}.kpis{grid-template-columns:repeat(2,1fr)}.kpi{height:78px;padding:10px}.kpi strong{font-size:24px}.kpi p{white-space:normal}.right-col{display:flex}.assistant{grid-column:auto}.approval-top{flex-wrap:wrap}.approval-top h3{width:calc(100% - 40px);order:2}.impact{margin-left:0}.diff-head,.diff-row{grid-template-columns:.9fr .45fr 1.2fr;font-size:10px}.platform-row{grid-template-columns:28px 70px 1fr;gap:7px}.platform-row .status,.platform-row .progress{grid-column:span 2}.split-cards{grid-template-columns:1fr}.history-list{overflow:auto}.history-row{min-width:700px}.empty{display:block}.empty button{margin-top:12px}.sticky{left:50px;justify-content:center}.sticky>span:first-child{display:none}.sticky>div{display:flex;flex-wrap:wrap;justify-content:center}}
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
