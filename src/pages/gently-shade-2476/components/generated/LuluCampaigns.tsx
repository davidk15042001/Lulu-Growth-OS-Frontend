import { useMemo, useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, Archive, ArrowDownUp, ArrowLeft, ArrowRight, BarChart3, Bell, CalendarDays, Check, ChevronDown, ChevronRight, CircleHelp, ClipboardList, Copy, Edit3, Ellipsis, FileText, Filter, Gauge, Globe2, Layers3, LayoutDashboard, Megaphone, Menu, MoreHorizontal, Pause, Plus, Search, Send, Settings2, Share2, Sparkles, Target, Trash2, Users, X, Zap } from 'lucide-react';
type Status = 'Active' | 'Scheduled' | 'Completed' | 'Paused' | 'Draft' | 'Cancelled' | 'Archived';
type Campaign = {
  name: string;
  type: string;
  status: Status;
  channels: string[];
  audience: string;
  goal: string;
  revenue: string;
  leads: string;
  customers: string;
  roi: string;
  owner: string;
  dates: string;
};
const navItems = [{
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  label: 'Campaigns',
  icon: BarChart3
}, {
  label: 'Content',
  icon: FileText
}, {
  label: 'SEO',
  icon: Search
}, {
  label: 'GEO',
  icon: Globe2
}, {
  label: 'AEO',
  icon: Target
}, {
  label: 'Social',
  icon: Share2
}, {
  label: 'Advertising',
  icon: Megaphone
}, {
  label: 'Audiences',
  icon: Users
}, {
  label: 'Automations',
  icon: Zap
}, {
  label: 'Analytics',
  icon: Activity
}];
const campaigns: Campaign[] = [];
const chartData: Array<Record<string, any>> = [];
const channelIcons: Record<string, typeof Send> = {
  Email: Send,
  SEO: Search,
  Social: Share2,
  Ads: Megaphone,
  Content: FileText,
  CRM: Users,
  GEO: Globe2
};
const statusClass: Record<Status, string> = {
  Active: 'status-active',
  Scheduled: 'status-scheduled',
  Completed: 'status-completed',
  Paused: 'status-paused',
  Draft: 'status-draft',
  Cancelled: 'status-cancelled',
  Archived: 'status-archived'
};
export function LuluCampaigns() {
  const [selected, setSelected] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [modal, setModal] = useState<'create' | 'pause' | 'duplicate' | 'archive' | null>(null);
  const [step, setStep] = useState(1);
  const { items: liveCampaigns, loading: liveLoading, error: liveError } = useLiveRecords('marketing_campaigns');
  const liveEmpty = !liveLoading && !liveError && liveCampaigns.length === 0;
  const filtered = useMemo(() => campaigns.filter(c => c.name.toLowerCase().includes(query.toLowerCase())), [query]);
  const current = campaigns[selected];
  return <div className="lulu-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Sparkles size={17} /></div><span>Lulu <b>AI</b></span></div>
      <div className="workspace"><div className="workspace-avatar">AC</div><div><strong>Workspace campaigns</strong><small>Business OS</small></div><ChevronDown size={15} /></div>
      <LuluSectionNavigation activeId="gently-shade-2476" />
      <div className="sidebar-bottom"><button className="nav-item"><Settings2 size={17} /><span>Settings</span></button><div className="user"><div className="user-avatar">JD</div><div><strong>Workspace member</strong><small>Administrator</small></div><MoreHorizontal size={16} /></div></div>
    </aside>
    <main className="main-content">{liveLoading ? <div className="border-b border-border bg-secondary/30 px-4 py-3 text-xs text-muted-foreground">Loading live campaigns…</div> : liveError ? <div className="border-b border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">{liveError}</div> : liveEmpty ? <div className="border-b border-dashed border-border bg-card px-4 py-3 text-xs text-muted-foreground">No live marketing campaigns are available yet. Create or connect a campaign to begin.</div> : null}
      <header className="topbar"><button className="mobile-menu" aria-label="Open menu"><Menu size={19} /></button><div className="crumb"><span>Marketing</span><ChevronRight size={14} /><strong>Campaigns</strong></div><div className="top-actions"><button aria-label="Notifications" className="icon-button"><Bell size={18} /><i></i></button><div className="top-avatar">JD</div></div></header>
      <section className="page-content">
        <div className="page-heading"><div><div className="eyebrow">MARKETING WORKSPACE</div><h1>Campaigns</h1><p>Create, manage and optimize multi-channel marketing campaigns from one workspace.</p></div><div className="heading-actions"><button className="ghost-button"><Filter size={16} /><span>Filter</span></button><button className="ghost-button"><ArrowDownUp size={16} /><span>Export</span></button><button className="primary-button" onClick={() => {
              setModal('create');
              setStep(1);
            }}><Plus size={17} /><span>Create Campaign</span></button></div></div>
        <div className="kpi-grid">{[{
            label: 'Active Campaigns',
            value: '12',
            tone: 'green',
            sub: 'Live now'
          }, {
            label: 'Scheduled',
            value: '7',
            tone: 'blue',
            sub: 'Upcoming'
          }, {
            label: 'Completed',
            value: '38',
            tone: 'gray',
            sub: 'All time'
          }, {
            label: 'Total Campaign Revenue',
            value: '€482,400',
            tone: 'purple',
            sub: '+18.4% vs last period'
          }, {
            label: 'Campaign ROI',
            value: '4.8x',
            tone: 'green',
            sub: '+0.6x vs last period'
          }, {
            label: 'Requiring Attention',
            value: '3',
            tone: 'amber',
            sub: 'Needs review',
            alert: true
          }].map(k => <article className="kpi-card" key={k.label}><div className={'kpi-dot ' + k.tone}>{k.alert ? <Bell size={12} /> : ''}</div><span>{k.label}</span><strong>{k.value}</strong><small>{k.sub}</small></article>)}</div>
        <div className="workspace-grid">
          <section className="campaign-list" aria-label="Campaign list">
            <div className="list-toolbar"><div className="search-box"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search campaigns..." aria-label="Search campaigns" /></div><div className="quick-chips">{['Active Campaigns', 'My Campaigns', 'High ROI', 'Underperforming', 'Scheduled', 'Requires Attention'].map(chip => <button key={chip} className="quick-chip">{chip}</button>)}</div></div>
            <div className="filter-row">{['Status', 'Campaign Type', 'Channel', 'Owner', 'Goal', 'Date range'].map((f, i) => <button className="select-control" key={f}><span>{f}</span><ChevronDown size={14} /></button>)}<button className="clear-button">Clear Filters</button><button className="save-button"><Check size={14} /> Save Filter</button></div>
            {selectedRows.length > 0 && <div className="bulk-bar"><strong>{selectedRows.length} selected</strong><button>Archive</button><button>Pause</button><button>Assign Owner</button><button>Export</button><button>Duplicate</button></div>}
            <div className="table-wrap"><table><thead><tr><th className="check-col"><input type="checkbox" checked={selectedRows.length === filtered.length} onChange={e => setSelectedRows(e.target.checked ? filtered.map(c => c.name) : [])} /></th><th>CAMPAIGN <ArrowDownUp size={12} /></th><th>STATUS <ArrowDownUp size={12} /></th><th>CHANNELS</th><th>AUDIENCE</th><th>GOAL</th><th>REVENUE</th><th>LEADS</th><th>CUSTOMERS</th><th>ROI</th><th>OWNER</th><th>DATES</th><th></th></tr></thead><tbody>{filtered.map(campaign => <tr key={campaign.name} className={selected === campaigns.indexOf(campaign) ? 'selected-row' : ''} onClick={() => setSelected(campaigns.indexOf(campaign))}><td onClick={e => e.stopPropagation()}><input type="checkbox" checked={selectedRows.includes(campaign.name)} onChange={e => setSelectedRows(e.target.checked ? [...selectedRows, campaign.name] : selectedRows.filter(n => n !== campaign.name))} /></td><td><strong className="campaign-name">{campaign.name}</strong><span className="type-tag">{campaign.type}</span></td><td><span className={'status-badge ' + statusClass[campaign.status]}><i></i>{campaign.status}</span></td><td><div className="channel-pills">{campaign.channels.map(channel => {
                          const Icon = channelIcons[channel] || Layers3;
                          return <span key={channel} title={channel}><Icon size={13} /></span>;
                        })}</div></td><td>{campaign.audience}</td><td>{campaign.goal}</td><td><strong>{campaign.revenue}</strong></td><td>{campaign.leads}</td><td>{campaign.customers}</td><td><strong className={campaign.roi !== '—' ? 'roi' : ''}>{campaign.roi}</strong></td><td>{campaign.owner}</td><td className="date-cell">{campaign.dates}</td><td><button className="row-more" aria-label={'Actions for ' + campaign.name}><Ellipsis size={16} /></button></td></tr>)}</tbody></table></div>
            <div className="table-footer"><span>Showing {filtered.length} of 57 campaigns</span><div><button className="pagination"><ArrowLeft size={14} /></button><button className="pagination current-page">1</button><button className="pagination">2</button><button className="pagination">3</button><button className="pagination"><ArrowRight size={14} /></button></div></div>
          </section>
          <aside className="detail-panel" aria-label="Campaign details"><div className="detail-top"><div><span className="panel-label">SELECTED CAMPAIGN</span><h2>{current.name}</h2><span className="status-badge status-active"><i></i>Active</span></div><button className="close-detail" aria-label="Close detail"><X size={17} /></button></div><div className="detail-actions"><button><Edit3 size={14} /> Edit</button><button onClick={() => setModal('pause')}><Pause size={14} /> Pause</button><button onClick={() => setModal('duplicate')}><Copy size={14} /> Duplicate</button><button onClick={() => setModal('archive')}><Archive size={14} /> Archive</button><button className="ai-button"><Sparkles size={14} /> Ask Lulu AI</button></div>
            <div className="detail-scroll"><section className="overview"><p>Multi-channel summer campaign targeting high-value customers to drive product revenue</p><dl><div><dt>Owner</dt><dd>Marketing Team</dd></div><div><dt>Type</dt><dd>Product Launch</dd></div><div><dt>Goal</dt><dd>Revenue <small>€50,000 target</small></dd></div><div><dt>Audience</dt><dd>High-Value Customers <small>1,284 contacts</small></dd></div><div><dt>Channels</dt><dd>Email, SEO, Organic Social, Google Ads</dd></div><div><dt>Schedule</dt><dd>Jun 01, 2025 → Jul 15, 2025</dd></div><div><dt>Budget</dt><dd>€12,000</dd></div></dl></section>
              <section className="panel-section"><div className="section-title"><h3>Campaign Performance</h3><button className="mini-select">Revenue <ChevronDown size={12} /></button></div><div className="performance-grid">{[['Revenue', '€42,800', '85.6% target'], ['Leads', '1,284', '+12.4%'], ['Customers', '184', '+8.6%'], ['ROI', '4.8x', '+0.6x']].map(([label, value, sub]) => <div className="performance-stat" key={label}><span>{label}</span><strong>{value}</strong><small>{sub}</small></div>)}</div><div className="chart"><ResponsiveContainer width="100%" height={125}><AreaChart data={chartData}><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={.22} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs><Tooltip contentStyle={{
                        fontSize: 11,
                        borderRadius: 8,
                        border: '1px solid var(--border)'
                      }} /><Area type="monotone" dataKey="value" stroke="var(--chart-3)" strokeWidth={2.5} fill="url(#revenueFill)" /></AreaChart></ResponsiveContainer><div className="chart-labels"><span>Jun 10</span><span>Jun 20</span><span>Jun 30</span><span>Jul 08</span></div></div></section>
              <section className="panel-section"><div className="section-title"><h3>Campaign Funnel</h3><span className="muted-label">CONVERSION</span></div><div className="funnel">{[['Audience', '1,284', '—', '100%'], ['Reach', '1,106', '86.1%', '+4.2%'], ['Engagement', '542', '49.0%', '+8.1%'], ['Leads', '284', '52.4%', '+2.6%'], ['Qualified Leads', '196', '69.0%', '+5.4%'], ['Customers', '184', '93.9%', '+3.8%'], ['Revenue', '€42,800', '—', '+12.4%']].map(([name, value, rate, change], i) => <div className="funnel-row" key={name}><span className={'funnel-bar bar-' + i}></span><strong>{name}</strong><b>{value}</b><small>{rate}</small><em>{change}</em></div>)}</div></section>
              <section className="panel-section"><div className="section-title"><h3>Channel Performance</h3><button className="text-link">View all</button></div><div className="channel-grid">{[['Email', '€14,800', '482 leads', '8.2% conversion', Send], ['SEO', '€12,400', '394 leads', '7.1% conversion', Search], ['Organic Social', '€8,200', '242 leads', '5.8% conversion', Share2], ['Paid Advertising', '€9,800', '302 leads', '3.9x ROI', Megaphone]].map(([name, rev, leads, metric, Icon]) => <div className="channel-card" key={String(name)}><div className="channel-head"><span className="channel-icon"><Icon size={14} /></span><strong>{String(name)}</strong><button className="text-link">View</button></div><b>{String(rev)}</b><small>{String(leads)} · {String(metric)}</small></div>)}</div></section>
              <section className="alert-stack"><div className="alert warning"><Bell size={15} /><span>Campaign conversion rate decreased 12% in the last 7 days. Paid advertising efficiency declining.</span></div><div className="alert positive"><Check size={15} /><span>Campaign revenue exceeded 85% of target with 12 days remaining.</span></div></section>
              <section className="ai-section"><div className="ai-heading"><Sparkles size={17} /><div><h3>Lulu AI Insights</h3><small>AI-GENERATED · UPDATED 4 MIN AGO</small></div></div>{['Email is currently the highest-converting campaign channel.', 'Organic search is generating increasing traffic with lower acquisition cost.', 'Paid advertising performance has declined 18% compared with campaign start.'].map((insight, i) => <div className="insight" key={insight}><span>{insight}</span><small className={i === 2 ? 'warning-text' : 'positive-text'}>{i === 2 ? 'Warning' : 'Positive'} · {94 - i * 5}% confidence</small></div>)}</section>
              <section className="ai-section optimization"><div className="ai-heading"><Sparkles size={17} /><div><h3>Lulu AI Optimization</h3><small>RECOMMENDED NEXT STEPS</small></div></div>{[['Reallocate 20% of paid ad budget to email', 'Email is outperforming paid 2.1x', '+€4,200 revenue', 'High'], ['Create additional content around top-performing SEO topic', 'SEO traffic growing +24%', '', 'Medium'], ['Extend campaign end date by 14 days', 'Strong conversion trajectory', '', 'Medium']].map(([title, reason, expected, priority]) => <div className="recommendation" key={title}><div><strong>{title}</strong><small>Reason: {reason}{expected && <b> · Expected {expected}</b>}</small></div><span className={priority === 'High' ? 'priority-high' : 'priority-medium'}>{priority}</span><div className="rec-actions"><button>{priority === 'High' ? 'Apply' : 'Create Task'}</button><button>Review</button></div></div>)}</section>
              <section className="panel-section"><div className="section-title"><h3>Campaign Timeline</h3><button className="text-link">View full</button></div><ol className="timeline">{[['Jun 01', 'Campaign launched', 'Marketing Team'], ['Jun 03', 'Email sequence activated', 'System'], ['Jun 08', 'SEO content published (3 articles)', 'Content Team'], ['Jun 15', 'AI optimization applied (email timing)', 'Lulu AI'], ['Jun 22', 'Revenue target 50% reached', 'System'], ['Jul 01', 'Paid advertising performance alert', 'Lulu AI'], ['Jul 08', 'Campaign 85% of revenue target', 'System']].map(([date, event, by]) => <li key={date + event}><time>{date}</time><div><strong>{event}</strong><small>{by}</small></div></li>)}</ol></section>
            </div><div className="quick-actions">{[['Edit Campaign', Edit3], ['Pause Campaign', Pause], ['Duplicate', Copy], ['Create Task', ClipboardList], ['Create Content', FileText], ['Ask Lulu AI', Sparkles], ['Export', ArrowDownUp]].map(([label, Icon]) => <button key={String(label)} title={String(label)}><Icon size={15} /><span>{String(label)}</span></button>)}</div>
          </aside>
        </div>
      </section>
    </main>
    {modal && <div className="modal-backdrop" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">{modal === 'create' ? <><div className="modal-header"><div><span className="eyebrow">CAMPAIGN SETUP</span><h2 id="modal-title">Create Campaign</h2></div><button onClick={() => setModal(null)} aria-label="Close"><X size={18} /></button></div><div className="steps">{['Information', 'Goal', 'Audience', 'Channels', 'Schedule', 'Budget', 'Review'].map((s, i) => <div className={step > i + 1 ? 'done' : step === i + 1 ? 'current' : ''} key={s}><span>{step > i + 1 ? <Check size={12} /> : i + 1}</span><small>{s}</small></div>)}</div><div className="modal-body"><label>Campaign Name<input placeholder="e.g. Summer Product Launch" /></label><label>Description<textarea placeholder="What is this campaign designed to achieve?" /></label><div className="two-fields"><label>Campaign Type<select><option>Product Launch</option><option>Lead Generation</option><option>Customer Acquisition</option><option>Retention</option><option>Promotion</option><option>Brand Awareness</option></select></label><label>Owner<select><option>Marketing Team</option><option>Workspace member</option><option>Growth</option></select></label></div><p className="validation"><CircleHelp size={14} /> You can update these details at any time.</p></div><div className="modal-footer"><button className="ghost-button" onClick={() => setModal(null)}>Cancel</button><div><button className="save-button">Save Draft</button><button className="primary-button" onClick={() => step < 7 ? setStep(step + 1) : setModal(null)}>{step < 7 ? 'Continue' : 'Create Campaign'} <ArrowRight size={15} /></button></div></div></> : <><div className="modal-header"><div><span className="eyebrow">CAMPAIGN ACTION</span><h2 id="modal-title">{modal === 'pause' ? 'Pause Campaign?' : modal === 'archive' ? 'Archive Campaign?' : 'Duplicate Campaign'}</h2></div><button onClick={() => setModal(null)} aria-label="Close"><X size={18} /></button></div><div className="confirm-body">{modal === 'pause' && <p>Pausing this campaign may stop or suspend connected campaign activities.</p>}{modal === 'archive' && <p>This campaign will be removed from active campaign views.</p>}{modal === 'duplicate' && <>{['Copy configuration', 'Copy audience', 'Copy channels', 'Copy content references', 'Copy schedule'].map(o => <label className="toggle-row" key={o}><span>{o}</span><input type="checkbox" defaultChecked /></label>)}<p className="muted-label">Default status: Draft</p></>}</div><div className="modal-footer"><button className="ghost-button" onClick={() => setModal(null)}>Cancel</button><button className={modal === 'pause' ? 'warning-button' : 'primary-button'} onClick={() => setModal(null)}>{modal === 'pause' ? 'Pause Campaign' : modal === 'archive' ? 'Archive' : 'Duplicate'} </button></div></>}</div></div>}
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
