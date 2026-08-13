import { useMemo, useState } from 'react';
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
const campaigns: Campaign[] = [{
  name: 'Summer Product Launch',
  type: 'Product Launch',
  status: 'Active',
  channels: ['Email', 'SEO', 'Social', 'Ads'],
  audience: 'High-Value Customers',
  goal: 'Revenue',
  revenue: '€42,800',
  leads: '1,284',
  customers: '184',
  roi: '4.8x',
  owner: 'Marketing Team',
  dates: 'Jun 01 → Jul 15'
}, {
  name: 'Q3 Lead Generation',
  type: 'Lead Generation',
  status: 'Active',
  channels: ['Email', 'Content', 'SEO'],
  audience: 'SMB Europe',
  goal: 'Leads',
  revenue: '€28,400',
  leads: '892',
  customers: '124',
  roi: '3.9x',
  owner: 'Growth',
  dates: 'Jul 01 → Sep 30'
}, {
  name: 'Customer Retention Q2',
  type: 'Retention',
  status: 'Active',
  channels: ['Email', 'CRM'],
  audience: 'At-Risk Accounts',
  goal: 'Retention',
  revenue: '€18,200',
  leads: '—',
  customers: '48',
  roi: '5.2x',
  owner: 'CS Team',
  dates: 'May 15 → Jul 31'
}, {
  name: 'Brand Awareness Drive',
  type: 'Brand Awareness',
  status: 'Paused',
  channels: ['Social', 'Content', 'Ads'],
  audience: 'Broad Audience',
  goal: 'Awareness',
  revenue: '€8,400',
  leads: '342',
  customers: '28',
  roi: '2.1x',
  owner: 'Marketing',
  dates: 'Jun 10 → Aug 01'
}, {
  name: 'New Market Expansion',
  type: 'Customer Acquisition',
  status: 'Scheduled',
  channels: ['Email', 'SEO', 'GEO'],
  audience: 'New Markets',
  goal: 'Customers',
  revenue: '—',
  leads: '—',
  customers: '—',
  roi: '—',
  owner: 'Regional',
  dates: 'Aug 01 → Oct 31'
}, {
  name: 'Product Feature Launch',
  type: 'Product Launch',
  status: 'Scheduled',
  channels: ['Email', 'Social', 'Content'],
  audience: 'Existing Customers',
  goal: 'Engagement',
  revenue: '—',
  leads: '—',
  customers: '—',
  roi: '—',
  owner: 'Product',
  dates: 'Aug 15 → Sep 15'
}, {
  name: 'Spring Promotion',
  type: 'Promotion',
  status: 'Completed',
  channels: ['Email', 'Social', 'Ads'],
  audience: 'All Customers',
  goal: 'Revenue',
  revenue: '€84,200',
  leads: '2,140',
  customers: '342',
  roi: '6.1x',
  owner: 'Marketing',
  dates: 'Apr 01 → May 31'
}, {
  name: 'Partner Referral Program',
  type: 'Lead Generation',
  status: 'Active',
  channels: ['CRM', 'Email'],
  audience: 'Strategic Partners',
  goal: 'Leads',
  revenue: '€12,800',
  leads: '184',
  customers: '32',
  roi: '7.4x',
  owner: 'Sales',
  dates: 'Jun 15 → Sep 30'
}];
const chartData = [{
  day: 'Jun 10',
  value: 12
}, {
  day: 'Jun 15',
  value: 20
}, {
  day: 'Jun 20',
  value: 28
}, {
  day: 'Jun 25',
  value: 27
}, {
  day: 'Jun 30',
  value: 36
}, {
  day: 'Jul 05',
  value: 39
}, {
  day: 'Jul 08',
  value: 43
}];
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
  const filtered = useMemo(() => campaigns.filter(c => c.name.toLowerCase().includes(query.toLowerCase())), [query]);
  const current = campaigns[selected];
  return <div className="lulu-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Sparkles size={17} /></div><span>Lulu <b>AI</b></span></div>
      <div className="workspace"><div className="workspace-avatar">AC</div><div><strong>Acme Corporation</strong><small>Business OS</small></div><ChevronDown size={15} /></div>
      <nav aria-label="Marketing navigation"><p className="nav-caption">MARKETING</p>{navItems.map(({
          label,
          icon: Icon
        }) => <button key={label} className={'nav-item ' + (label === 'Campaigns' ? 'active' : '')}><Icon size={17} /><span>{label}</span>{label === 'Campaigns' && <span className="nav-count">12</span>}</button>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item"><Settings2 size={17} /><span>Settings</span></button><div className="user"><div className="user-avatar">JD</div><div><strong>Jordan Davis</strong><small>Administrator</small></div><MoreHorizontal size={16} /></div></div>
    </aside>
    <main className="main-content">
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
    {modal && <div className="modal-backdrop" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">{modal === 'create' ? <><div className="modal-header"><div><span className="eyebrow">CAMPAIGN SETUP</span><h2 id="modal-title">Create Campaign</h2></div><button onClick={() => setModal(null)} aria-label="Close"><X size={18} /></button></div><div className="steps">{['Information', 'Goal', 'Audience', 'Channels', 'Schedule', 'Budget', 'Review'].map((s, i) => <div className={step > i + 1 ? 'done' : step === i + 1 ? 'current' : ''} key={s}><span>{step > i + 1 ? <Check size={12} /> : i + 1}</span><small>{s}</small></div>)}</div><div className="modal-body"><label>Campaign Name<input placeholder="e.g. Summer Product Launch" /></label><label>Description<textarea placeholder="What is this campaign designed to achieve?" /></label><div className="two-fields"><label>Campaign Type<select><option>Product Launch</option><option>Lead Generation</option><option>Customer Acquisition</option><option>Retention</option><option>Promotion</option><option>Brand Awareness</option></select></label><label>Owner<select><option>Marketing Team</option><option>Jordan Davis</option><option>Growth</option></select></label></div><p className="validation"><CircleHelp size={14} /> You can update these details at any time.</p></div><div className="modal-footer"><button className="ghost-button" onClick={() => setModal(null)}>Cancel</button><div><button className="save-button">Save Draft</button><button className="primary-button" onClick={() => step < 7 ? setStep(step + 1) : setModal(null)}>{step < 7 ? 'Continue' : 'Create Campaign'} <ArrowRight size={15} /></button></div></div></> : <><div className="modal-header"><div><span className="eyebrow">CAMPAIGN ACTION</span><h2 id="modal-title">{modal === 'pause' ? 'Pause Campaign?' : modal === 'archive' ? 'Archive Campaign?' : 'Duplicate Campaign'}</h2></div><button onClick={() => setModal(null)} aria-label="Close"><X size={18} /></button></div><div className="confirm-body">{modal === 'pause' && <p>Pausing this campaign may stop or suspend connected campaign activities.</p>}{modal === 'archive' && <p>This campaign will be removed from active campaign views.</p>}{modal === 'duplicate' && <>{['Copy configuration', 'Copy audience', 'Copy channels', 'Copy content references', 'Copy schedule'].map(o => <label className="toggle-row" key={o}><span>{o}</span><input type="checkbox" defaultChecked /></label>)}<p className="muted-label">Default status: Draft</p></>}</div><div className="modal-footer"><button className="ghost-button" onClick={() => setModal(null)}>Cancel</button><button className={modal === 'pause' ? 'warning-button' : 'primary-button'} onClick={() => setModal(null)}>{modal === 'pause' ? 'Pause Campaign' : modal === 'archive' ? 'Archive' : 'Duplicate'} </button></div></>}</div></div>}
  </div>;
}