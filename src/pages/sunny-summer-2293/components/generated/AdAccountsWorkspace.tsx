import { useState } from 'react';
import { Activity, AlertTriangle, ArrowRight, BarChart3, Bell, Bot, Check, ChevronDown, CircleHelp, Cloud, Database, DollarSign, Gauge, GitBranch, Globe2, Link2, LockKeyhole, Menu, MoreHorizontal, Network, Plus, RefreshCw, Search, Send, Settings2, ShieldCheck, Sparkles, User, Users, X, Zap } from 'lucide-react';
type Tone = 'success' | 'warning' | 'error' | 'info' | 'muted';
type PlatformKey = 'google' | 'meta' | 'linkedin' | 'tiktok';
const platformMeta: Record<PlatformKey, {
  name: string;
  short: string;
  color: string;
  bg: string;
}> = {
  google: {
    name: 'Google Ads',
    short: 'G',
    color: 'var(--primary-foreground)',
    bg: 'var(--primary)'
  },
  meta: {
    name: 'Meta Ads',
    short: 'f',
    color: 'var(--primary-foreground)',
    bg: 'var(--primary)'
  },
  linkedin: {
    name: 'LinkedIn Ads',
    short: 'In',
    color: 'var(--primary-foreground)',
    bg: 'var(--primary)'
  },
  tiktok: {
    name: 'TikTok Ads',
    short: 'T',
    color: 'var(--primary-foreground)',
    bg: 'var(--primary)'
  }
};
const accounts = [{
  key: 'google' as PlatformKey,
  account: 'Lulu AI Main Business',
  id: '123-456-7890',
  status: 'Active',
  connection: 'Healthy',
  sync: 'Healthy',
  health: 'Excellent',
  publish: 'Enabled',
  last: '5 min ago',
  active: true
}, {
  key: 'google' as PlatformKey,
  account: 'Lulu AI Germany',
  id: '123-456-7811',
  status: 'Active',
  connection: 'Healthy',
  sync: 'Healthy',
  health: 'Good',
  publish: 'Enabled',
  last: '12 min ago',
  active: false
}, {
  key: 'meta' as PlatformKey,
  account: 'Lulu AI Business',
  id: '987654321',
  status: 'Active',
  connection: 'Healthy',
  sync: 'Warning',
  health: 'Warning',
  publish: 'Enabled',
  last: '52 min ago',
  active: false
}, {
  key: 'linkedin' as PlatformKey,
  account: 'Lulu AI GmbH',
  id: '504123789',
  status: 'Active',
  connection: 'Healthy',
  sync: 'Healthy',
  health: 'Good',
  publish: 'Enabled',
  last: '18 min ago',
  active: false
}, {
  key: 'tiktok' as PlatformKey,
  account: 'Lulu AI Ads',
  id: 'TK-88291047',
  status: 'Active',
  connection: 'Connected',
  sync: 'Blocked',
  health: 'Critical',
  publish: 'Restricted',
  last: '3 hr ago',
  active: false
}];
const capabilities = [['Read Campaigns', 'Supported', 'Supported', 'Supported', 'Supported'], ['Create Campaigns', 'Supported', 'Supported', 'Supported', 'Requires Permission'], ['Edit Campaigns', 'Supported', 'Supported', 'Supported', 'Requires Permission'], ['Pause / Resume', 'Supported', 'Supported', 'Supported', 'Requires Permission'], ['Publish', 'Supported', 'Supported', 'Supported', 'Requires Permission'], ['Manage Audiences', 'Supported', 'Supported', 'Limited', 'Requires Permission'], ['Manage Creatives', 'Supported', 'Supported', 'Supported', 'Requires Permission'], ['Manage Budgets', 'Supported', 'Supported', 'Supported', 'Requires Permission'], ['Conversion Tracking', 'Supported', 'Limited', 'Supported', 'Supported'], ['Experiments', 'Supported', 'Supported', 'Limited', 'Supported'], ['AI Optimization', 'Supported', 'Supported', 'Supported', 'Blocked']];
const permissionsLeft = ['Read Account', 'Read Campaigns', 'Read Performance', 'Read Audiences', 'Read Creatives', 'Read Billing'];
const permissionsRight = ['Create Campaigns', 'Edit Campaigns', 'Pause Campaigns', 'Publish Campaigns', 'Manage Budgets', 'Manage Pixel'];
const activity = [['User', 'Switched active account to Google Ads — Main Business', '10 min ago'], ['Lulu AI', 'Sync delay detected — Meta Ads', '52 min ago'], ['Lulu AI', 'Permission error detected — TikTok Ads', '3 hr ago'], ['User', 'LinkedIn Campaign Manager connected', 'Jan 8'], ['Platform', 'Google Ads reauthorized', 'Jan 7'], ['User', 'Meta Ads account connected', 'Jan 6']];
function PlatformBadge({
  platform,
  large = false
}: {
  platform: PlatformKey;
  large?: boolean;
}) {
  const item = platformMeta[platform];
  return <span className={`platform-badge ${large ? 'large' : ''}`} style={{
    color: item.color,
    background: item.bg
  }} aria-label={item.name}>{item.short}</span>;
}
function StatusChip({
  children,
  tone = 'success'
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  const Icon = tone === 'success' ? Check : tone === 'warning' ? AlertTriangle : tone === 'error' ? X : tone === 'info' ? Zap : CircleHelp;
  return <span className={`status-chip ${tone}`}><Icon size={12} strokeWidth={2.6} /><span>{children}</span></span>;
}
function SectionHeader({
  title,
  count,
  subtitle,
  action
}: {
  title: string;
  count?: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return <header className="section-header"><div><h2>{title} {count && <span className="count">{count}</span>}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</header>;
}
export function AdAccountsWorkspace() {
  const [tab, setTab] = useState('All Platforms');
  const [detailTab, setDetailTab] = useState('Overview');
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState('');
  const [synced, setSynced] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const filteredAccounts = accounts.filter(item => `${item.account} ${platformMeta[item.key].name}`.toLowerCase().includes(query.toLowerCase()) && (tab === 'All Platforms' || platformMeta[item.key].name === tab));
  return <div className="workspace">
    <aside className={`rail ${mobileNav ? 'open' : ''}`}><div className="brand-mark"><Sparkles size={18} /></div><LuluSectionNavigation activeId="sunny-summer-2293" /><div className="rail-bottom"><button className="rail-item" aria-label="Notifications"><Bell size={18} /></button><button className="rail-item" aria-label="Settings"><Settings2 size={18} /></button><div className="avatar">LS</div></div></aside>
    <main className="main-shell"><div className="mobile-top"><button onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation"><Menu size={20} /></button><strong>LULU <span>AI</span></strong><button aria-label="Notifications"><Bell size={18} /></button></div>
      <header className="page-header"><div className="breadcrumb"><span>Advertising</span><ChevronDown size={13} /><strong>Ad Accounts &amp; Platforms</strong></div><div className="title-row"><div><h1><Link2 size={19} /> Ad Accounts &amp; Platforms</h1><p>Manage your advertising accounts, platform connections, permissions and publishing capabilities.</p></div><div className="header-actions"><button className="button primary"><Plus size={16} /> Connect Platform</button><button className="button outline"><Sparkles size={15} /> Ask Lulu AI</button><button className="icon-button" aria-label="Refresh"><RefreshCw size={17} /></button></div></div></header>
      <div className="active-account"><div><span className="eyebrow">ACTIVE ACCOUNT</span><strong><PlatformBadge platform="google" /> Google Ads — Lulu AI Main Business</strong></div><button className="switch-button">Switch Account <ChevronDown size={14} /></button></div>
      <div className="platform-tabs" role="tablist">{['All Platforms', 'google', 'meta', 'linkedin', 'tiktok'].map(value => {
          const label = value === 'All Platforms' ? value : platformMeta[value as PlatformKey].name;
          return <button key={value} role="tab" aria-selected={tab === label} className={tab === label ? 'selected' : ''} onClick={() => setTab(label)}>{value !== 'All Platforms' && <PlatformBadge platform={value as PlatformKey} />}<span>{label}</span>{value !== 'All Platforms' && <i className={`dot ${value === 'tiktok' ? 'red' : value === 'meta' ? 'amber' : 'green'}`} />}</button>;
        })}</div>
      <section className="overview-grid">{(['google', 'meta', 'linkedin', 'tiktok'] as PlatformKey[]).map(key => {
          const account = accounts.find(item => item.key === key)!;
          const warning = key === 'meta';
          const error = key === 'tiktok';
          return <article key={key} className={`platform-card ${warning ? 'warning-border' : error ? 'error-border' : 'success-border'}`}><div className="card-top"><div className="platform-name"><PlatformBadge platform={key} large /><div><strong>{platformMeta[key].name}</strong><span>{account.account}</span></div></div><StatusChip tone={error ? 'error' : warning ? 'warning' : 'success'}>{error ? 'Permission Required' : warning ? 'Sync Warning' : 'Connected'}</StatusChip></div><dl className="compact-details"><div><dt>{key === 'google' ? 'Customer ID' : key === 'meta' ? 'Business ID' : key === 'linkedin' ? 'Account ID' : 'Advertiser ID'}</dt><dd>{account.id}</dd></div><div><dt>Connection</dt><dd className="good">✓ {account.connection}</dd></div><div><dt>Sync</dt><dd className={warning ? 'warn' : error ? 'bad' : 'good'}>{warning ? '⚠ Warning · 52 min ago' : error ? '✕ Blocked · permission missing' : `✓ Healthy · Last: ${account.last}`}</dd></div><div><dt>Publishing</dt><dd className={error ? 'bad' : 'good'}>{error ? '✕ Restricted' : '✓ Enabled'}</dd></div><div><dt>Currency / timezone</dt><dd>EUR · Europe/Berlin</dd></div></dl><div className="card-actions"><button className="text-button">Manage</button>{key !== 'linkedin' && <button className={`text-button ${error ? 'danger' : ''}`} onClick={() => setSynced(true)}>{error ? 'Resolve →' : synced ? 'Synced ✓' : 'Sync Now'}</button>}</div></article>;
        })}</section>
      <div className="content-layout"><div className="center-column">
        <section className="surface"><SectionHeader title="Connected Accounts" count="(4)" action={<div className="table-tools"><label className="search"><Search size={15} /><input aria-label="Search accounts" placeholder="Search accounts..." value={query} onChange={event => setQuery(event.target.value)} /></label>{['Platform', 'Status', 'Publishing', 'Data Health'].map(filter => <button className="filter" key={filter}>{filter}<ChevronDown size={13} /></button>)}</div>} /><div className="table-wrap"><table><thead><tr>{['Platform', 'Account', 'Status', 'Connection', 'Sync', 'Data Health', 'Publishing', 'Currency', 'Last Sync', 'Actions'].map(head => <th key={head}>{head}</th>)}</tr></thead><tbody>{filteredAccounts.map(item => <tr key={item.id} className={item.active ? 'active-row' : ''}><td><span className="table-platform"><PlatformBadge platform={item.key} />{platformMeta[item.key].name.replace(' Ads', '')}</span></td><td><strong>{item.account}</strong><small>{item.id}</small>{item.active && <em>Active</em>}</td><td><StatusChip>{item.status}</StatusChip></td><td><StatusChip tone={item.connection === 'Connected' ? 'success' : 'success'}>{item.connection}</StatusChip></td><td><StatusChip tone={item.sync === 'Blocked' ? 'error' : item.sync === 'Warning' ? 'warning' : 'success'}>{item.sync}</StatusChip></td><td><StatusChip tone={item.health === 'Critical' ? 'error' : item.health === 'Warning' ? 'warning' : 'success'}>{item.health}</StatusChip></td><td><StatusChip tone={item.publish === 'Restricted' ? 'error' : 'success'}>{item.publish}</StatusChip></td><td>EUR</td><td>{item.last}</td><td><button className="row-action">Manage</button><button className="row-action">{item.key === 'tiktok' ? 'Resolve' : item.active ? 'Switch' : 'View Details →'}</button></td></tr>)}</tbody></table></div></section>
        <section className="surface detail-panel"><div className="detail-heading"><div><div className="eyebrow">ACCOUNT DETAIL</div><h2>Meta Ads — Lulu AI Business <StatusChip tone="warning">Sync Warning</StatusChip></h2></div><button className="icon-button" aria-label="Close detail"><X size={17} /></button></div><div className="detail-tabs">{['Overview', 'Permissions', 'Synchronization', 'Data Health', 'Billing', 'Activity'].map(item => <button key={item} className={detailTab === item ? 'active' : ''} onClick={() => setDetailTab(item)}>{item}</button>)}</div><div className="detail-grid"><dl className="detail-list">{[['Account Name', 'Lulu AI Business'], ['Business Manager', 'Lulu AI GmbH'], ['Ad Account ID', 'act_987654321'], ['Account Status', 'Active  · Observed'], ['Currency', 'EUR — Euro'], ['Time Zone', 'Europe/Berlin'], ['Connection Status', '✓ Healthy — OAuth active'], ['Last Successful Auth', 'Today, 09:14'], ['API Status', '✓ Operational']].map(([term, value]) => <div key={term}><dt>{term}</dt><dd className={value.includes('✓') ? 'good' : ''}>{value}</dd></div>)}</dl><dl className="detail-list">{[['Sync Status', '⚠ Warning — Sync delayed 52 min'], ['Last Sync', 'Today, 10:31'], ['Next Sync', 'Scheduled in 8 min'], ['Publishing', '✓ Enabled'], ['Billing Status', '✓ Active'], ['Account Balance', '€8,420 remaining · Observed'], ['Daily Spend Limit', '€2,000 · Platform'], ['AI Access', '✓ Enabled']].map(([term, value]) => <div key={term}><dt>{term}</dt><dd className={value.includes('⚠') ? 'warn' : value.includes('✓') ? 'good' : ''}>{value}</dd></div>)}</dl></div><div className="ai-box"><div className="ai-label"><span className="ai-badge"><Sparkles size={12} /> AI Inferred</span><span>ACCOUNT HEALTH</span></div><p>Meta Ads connection and publishing permissions are healthy. The current synchronization delay (52 minutes) is above the typical threshold. Lulu AI can continue analyzing this account but real-time performance data may be slightly delayed. Recommend triggering a manual sync.</p><small>Source: Meta Ads API · Observed · Updated 4 min ago</small><div><button className="button amber-outline" onClick={() => setSynced(true)}><RefreshCw size={14} /> {synced ? 'Sync Complete' : 'Sync Now'}</button><button className="text-button"><Sparkles size={14} /> Diagnose with AI</button></div></div><div className="subsection"><h3>Platform Permissions</h3><div className="permission-grid">{[...permissionsLeft, ...permissionsRight].map(permission => <div className="permission" key={permission}>{permission === 'Manage Pixel' ? <X className="bad" size={15} /> : <Check className="good" size={15} />}<span>{permission}</span><StatusChip tone={permission === 'Manage Pixel' ? 'error' : 'success'}>{permission === 'Manage Pixel' ? 'Not Granted' : 'Granted'}</StatusChip></div>)}</div><p className="note">✕ Pixel management requires additional Business Manager permission. This does not affect campaign publishing. <button className="link-button">Request Permission</button></p></div><div className="subsection"><h3>AI Access Permissions <button className="link-button">Edit AI Access</button></h3><div className="ai-permissions">{['AI Performance Analysis', 'AI Campaign Analysis', 'AI Audience Analysis', 'AI Creative Analysis', 'AI Budget Analysis', 'AI Optimization', 'AI Experiment Analysis', 'AI Recommendations'].map(item => <span key={item}><Check size={14} className="good" />{item}<em>Enabled</em></span>)}</div></div></section>
        <section className="surface error-panel"><div className="detail-heading"><div><h2>Platform Error — TikTok Ads <StatusChip tone="error">Permission Required</StatusChip></h2></div></div><div className="error-meta"><span><b>Category</b> Permissions</span><span><b>Severity</b> Critical</span><span><b>Detected</b> 3 hr ago</span></div><p><b>Description:</b> TikTok Ads publishing permission is not granted. Lulu AI can read campaign data but cannot create, edit or publish campaigns on TikTok.</p><p><b>Impact:</b> Campaign publishing, budget changes and AI optimization actions are blocked for TikTok Ads.</p><p><b>Recommended action:</b> Reconnect the TikTok Ads account and grant Campaign Management permissions during authorization.</p><div className="card-actions"><button className="button primary">Reconnect TikTok Ads</button><button className="button outline"><Sparkles size={14} /> Diagnose with AI</button><button className="text-button">Dismiss</button></div><div className="ai-box"><span className="ai-badge"><Sparkles size={12} /> AI Detected</span><p><strong>What happened:</strong> The TikTok Ads authorization does not include Campaign Management scope. This is a common issue when the account was initially connected with read-only permissions.</p><p><strong>Why it matters:</strong> Lulu AI cannot publish, pause or modify TikTok campaigns until this is resolved.</p><p><strong>What can be done:</strong> Reconnect the TikTok Ads account and ensure “Campaign Management” is selected when prompted during authorization.</p><small>AI Inferred · TikTok Ads API · Updated 3 hr ago</small></div></section>
        <section className="surface"><SectionHeader title="Platform Capabilities" subtitle="Capabilities currently available through each connected platform account. Observed from API and account permissions." /><div className="table-wrap capability-table"><table><thead><tr><th>Capability</th><th><PlatformBadge platform="google" /> Google</th><th><PlatformBadge platform="meta" /> Meta</th><th><PlatformBadge platform="linkedin" /> LinkedIn</th><th><PlatformBadge platform="tiktok" /> TikTok</th></tr></thead><tbody>{capabilities.map(row => <tr key={row[0]}><td><strong>{row[0]}</strong></td>{row.slice(1).map((value, index) => <td key={`${row[0]}-${index}`}><StatusChip tone={value === 'Supported' ? 'success' : value === 'Limited' ? 'warning' : 'error'}>{value}</StatusChip></td>)}</tr>)}</tbody></table></div><div className="legend"><StatusChip>Supported</StatusChip><StatusChip tone="warning">Limited</StatusChip><StatusChip tone="error">Requires Permission / Blocked</StatusChip><StatusChip tone="muted">Unknown</StatusChip></div></section>
        <section className="surface"><SectionHeader title="Synchronization" /><div className="sync-list">{accounts.slice(0, 4).map(item => <div className="sync-row" key={item.id}><PlatformBadge platform={item.key} large /><div className="sync-main"><strong>{platformMeta[item.key].name}</strong><span>Last sync: {item.last}</span></div><StatusChip tone={item.key === 'tiktok' ? 'error' : item.key === 'meta' ? 'warning' : 'success'}>{item.key === 'tiktok' ? 'Blocked — permission' : item.key === 'meta' ? 'Delayed' : 'Healthy'}</StatusChip><span className="sync-stats">{item.key === 'tiktok' ? 'Read-only data only' : item.key === 'google' ? 'Campaigns: 24 · Audiences: 18 · Creatives: 142' : item.key === 'meta' ? 'Campaigns: 11 · Audiences: 34 · Failed objects: 2' : 'Campaigns: 6 · Audiences: 8'}</span><button className="row-action">{item.key === 'tiktok' ? 'Resolve →' : 'Sync Now'}</button></div>)}</div></section>
        <section className="surface"><SectionHeader title="Account Spending Limits" subtitle="Limits observed from connected platform accounts. Platform limits are set by each advertising platform, not by Lulu AI." /><div className="spend-list">{[['google', 'Daily Limit: €5,000 (Platform)', 'Current spend today: €1,840', 'Remaining: €3,160'], ['meta', 'Daily Limit: €2,000 (Platform)', 'Current: €920', 'Remaining: €1,080 · Balance: €8,420'], ['linkedin', 'Daily Limit: No platform limit', 'Monthly budget: €3,000 (Campaign-level)', 'Spend: €1,240'], ['tiktok', 'Spending Limits: Unknown (permission error)', 'Unknown', 'Unknown']].map(([key, limit, spend, remain]) => <div className="spend-row" key={key}><PlatformBadge platform={key as PlatformKey} large /><strong>{platformMeta[key as PlatformKey].name}</strong><span>{limit}</span><span>{spend}</span><span className={key === 'tiktok' ? 'bad' : ''}>{remain}</span></div>)}</div><p className="note">All spending data: <b>Observed</b> from platform APIs. Estimates are labeled.</p></section>
        <section className="surface connect-card"><SectionHeader title="Connect an Advertising Platform" subtitle="Add a new advertising platform account to Lulu AI." /><div className="connect-grid">{(['google', 'meta', 'linkedin', 'tiktok'] as PlatformKey[]).map(key => <article key={key}><div className="platform-name"><PlatformBadge platform={key} large /><strong>{platformMeta[key].name}</strong></div><p>{key === 'google' ? 'Connect your Google Ads account to analyze campaigns, monitor performance and publish advertising where permitted.' : key === 'meta' ? 'Connect your Meta Business account to manage Facebook and Instagram advertising through Lulu AI.' : key === 'linkedin' ? 'Connect LinkedIn Campaign Manager to manage B2B advertising and lead generation campaigns.' : 'Connect your TikTok Ads account to reach and engage audiences with short-form video advertising.'}</p><small>Read · Create · Edit · Publish {key === 'tiktok' && '(requires permission)'}</small><button className="button outline">Connect {platformMeta[key].name}</button></article>)}</div><p className="note"><LockKeyhole size={14} /> Lulu AI uses secure OAuth authorization. No passwords or credentials are stored.</p></section>
      </div>
      <aside className="right-column"><section className="surface assistant"><div className="side-heading"><div><h2>Ask Lulu AI <Sparkles size={16} /></h2><p>Account context loaded</p></div><Bot size={19} className="violet" /></div><div className="chat-user">Can Lulu AI publish to my TikTok account?</div><div className="chat-ai"><span className="ai-badge"><Sparkles size={12} /> AI Inferred</span><p>No. The TikTok Ads account “Lulu AI Ads” is connected but does not have Campaign Management permission. Lulu AI can read campaign data but cannot create, edit, pause or publish campaigns on TikTok until the account is reconnected with the correct permissions. All other platforms currently support full publishing capabilities.</p><small>TikTok Ads API + Platform Permissions · Observed + AI Inferred · Updated 4 min ago</small></div><div className="suggestions">{['Which account has problems?', 'Why is Meta sync delayed?', 'Which platforms can AI optimize?', 'What permissions are missing?', 'Which account is currently active?'].map(question => <button key={question} onClick={() => setChat(question)}>{question}</button>)}</div><label className="chat-input"><input placeholder="Ask about your ad accounts..." value={chat} onChange={event => setChat(event.target.value)} /><button aria-label="Send question"><Send size={15} /></button></label></section>
        <section className="surface"><SectionHeader title="AI Recommendations" count="(3)" action={<span className="ai-badge"><Sparkles size={12} /> AI Recommended</span>} /><div className="recommendations"><article className="critical"><div><StatusChip tone="error">Critical</StatusChip><strong>Reconnect TikTok Ads with Campaign Management permission</strong></div><p>Publishing and optimization are blocked.</p><small>Impact: All TikTok campaign actions unavailable.</small><button className="link-button">Reconnect Now →</button></article><article><div><StatusChip tone="warning">Warning</StatusChip><strong>Investigate Meta Ads synchronization delay</strong></div><p>Sync has not completed in 52 minutes. 2 audience objects failed.</p><small>Impact: Performance data may be slightly stale.</small><button className="link-button">Sync Now</button></article><article><div><StatusChip tone="info">Info</StatusChip><strong>Enable Pixel management for Meta Ads</strong></div><p>Tracking configuration may require manual changes.</p><small>Priority: Low · Observed / AI Inferred</small><button className="link-button">Request Permission</button></article></div></section>
        <section className="surface"><SectionHeader title="Account Activity" /><div className="timeline">{activity.map(([actor, event, time]) => <div key={event}><span className={`actor ${actor === 'Lulu AI' ? 'ai' : ''}`}>{actor === 'User' ? <User size={14} /> : actor === 'Platform' ? <Globe2 size={14} /> : <Sparkles size={14} />}</span><p><strong>{actor}</strong> {event}<small>{time}</small></p></div>)}</div></section>
        <section className="surface disconnect"><SectionHeader title="Disconnect Advertising Account?" /><p className="muted">LinkedIn Campaign Manager — Lulu AI GmbH</p><ul>{['New data will stop synchronizing', 'Campaign updates will stop', 'AI optimization will stop for this account', 'Publishing will be unavailable', 'Tracking integrations may be affected', 'Historical data retained per your organization’s policy'].map(item => <li key={item}><X size={14} className={item.startsWith('Historical') ? 'muted' : 'bad'} />{item}</li>)}</ul><p className="note">This action requires Advertising Admin permission.</p><div className="card-actions"><button className="button outline">Cancel</button><button className="button danger-outline">Disconnect</button></div></section>
      </aside></div>
    </main>
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
  }, {
    "id": "nicely-land-1864",
    "label": "Settings"
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
            return <a key={page.id} href={`#${page.id}`} aria-current={isActivePage ? 'page' : undefined} className={`block rounded-md px-3 py-2 text-xs transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {page.label}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}