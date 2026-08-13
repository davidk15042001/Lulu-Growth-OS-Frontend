import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, BarChart3, Bell, BookOpen, Bot, Check, CheckCircle, ChevronDown, ChevronRight, Clock3, FileText, Filter, Globe, HelpCircle, KeyRound, LayoutDashboard, LockKeyhole, Mail, MessageSquare, MessagesSquare, MoreHorizontal, Package, PenTool, Play, Plus, RefreshCw, Search, Settings, Settings2, Shield, ShieldAlert, ShieldCheck, ShoppingBag, Sparkles, Store, Target, TrendingUp, UserRound, Users, WandSparkles, Webhook, X, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
type Action = {
  id: string;
  name: string;
  description: string;
  category: string;
  integration: string;
  status: 'Enabled' | 'Requires Approval' | 'Blocked';
  permission: 'Read' | 'Write' | 'External';
  approval: string;
  lastUsed: string;
  icon: LucideIcon;
  color: string;
  enabled: boolean;
};
type Metric = {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
};
type Approval = {
  id: string;
  action: string;
  requestedBy: string;
  agent: string;
  target: string;
  time: string;
  impact: string;
};
type Recent = {
  action: string;
  initiator: string;
  integration: string;
  result: string;
  time: string;
};
type Failed = {
  action: string;
  error: string;
  integration: string;
  time: string;
};
type AgentAccess = {
  id: string;
  name: string;
  initials: string;
  color: string;
  count: string;
  permission: string;
  last: string;
};
const navMain = [{
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  label: 'AI Insights Center',
  icon: BarChart3
}, {
  label: 'Business Health',
  icon: Activity
}, {
  label: 'Growth Score',
  icon: TrendingUp
}, {
  label: 'KPI Explorer',
  icon: Target
}];
const navPlatform = [{
  label: 'AI Assistant',
  icon: MessageSquare
}, {
  label: 'AI Agents',
  icon: Bot
}, {
  label: 'Agent Marketplace',
  icon: Store
}, {
  label: 'Agent Templates',
  icon: FileText
}, {
  label: 'AI Memory',
  icon: WandSparkles
}, {
  label: 'AI Knowledge',
  icon: BookOpen
}, {
  label: 'AI Actions',
  icon: Zap
}, {
  label: 'AI Conversations',
  icon: MessagesSquare
}, {
  label: 'AI Activity',
  icon: Activity
}];
const metrics: Metric[] = [{
  label: 'Available Actions',
  value: '47',
  icon: Zap,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.15)'
}, {
  label: 'Enabled',
  value: '31',
  icon: CheckCircle,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.12)'
}, {
  label: 'Approval Required',
  value: '8',
  icon: Shield,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.12)'
}, {
  label: 'Executed Today',
  value: '14',
  icon: Play,
  color: 'var(--foreground)',
  bg: 'rgba(0,0,0,.13)'
}, {
  label: 'Failed',
  value: '2',
  icon: AlertTriangle,
  color: 'var(--chart-5)',
  bg: 'rgba(0,0,0,.12)'
}, {
  label: 'Blocked',
  value: '1',
  icon: LockKeyhole,
  color: 'var(--chart-5)',
  bg: 'rgba(0,0,0,.1)'
}];
const actions: Action[] = [{
  id: 'publish-blog',
  name: 'Publish Blog Post',
  description: 'Publish approved content to your WordPress site.',
  category: 'Content',
  integration: 'WordPress',
  status: 'Requires Approval',
  permission: 'Write',
  approval: 'Approval Required',
  lastUsed: 'Yesterday, 4:32 PM',
  icon: PenTool,
  color: 'var(--foreground)',
  enabled: true
}, {
  id: 'update-price',
  name: 'Update Product Price',
  description: 'Change product pricing in your connected catalog.',
  category: 'E-commerce',
  integration: 'Shopify',
  status: 'Requires Approval',
  permission: 'Write',
  approval: 'User Confirmation',
  lastUsed: '2 hours ago',
  icon: ShoppingBag,
  color: 'var(--foreground)',
  enabled: true
}, {
  id: 'pause-campaign',
  name: 'Pause Ad Campaign',
  description: 'Pause an active campaign and stop its advertising spend.',
  category: 'Advertising',
  integration: 'Google Ads',
  status: 'Requires Approval',
  permission: 'External',
  approval: 'Admin Approval',
  lastUsed: '2 hours ago',
  icon: Target,
  color: 'var(--foreground)',
  enabled: true
}, {
  id: 'seo-report',
  name: 'Generate SEO Report',
  description: 'Create a performance report from search analytics data.',
  category: 'SEO',
  integration: 'Google Analytics',
  status: 'Enabled',
  permission: 'Read',
  approval: 'No Approval',
  lastUsed: '2 min ago',
  icon: BarChart3,
  color: 'var(--foreground)',
  enabled: true
}, {
  id: 'customer-email',
  name: 'Send Customer Email',
  description: 'Send a personalized message to a customer segment.',
  category: 'Customer Management',
  integration: 'Shopify',
  status: 'Requires Approval',
  permission: 'External',
  approval: 'Approval Required',
  lastUsed: 'Never',
  icon: Mail,
  color: 'var(--foreground)',
  enabled: false
}, {
  id: 'inventory',
  name: 'Update Inventory',
  description: 'Adjust inventory quantities across connected products.',
  category: 'E-commerce',
  integration: 'Shopify',
  status: 'Requires Approval',
  permission: 'Write',
  approval: 'User Confirmation',
  lastUsed: 'Today, 9:14 AM',
  icon: Package,
  color: 'var(--foreground)',
  enabled: true
}, {
  id: 'social-draft',
  name: 'Create Social Post Draft',
  description: 'Draft a social post for review by your marketing team.',
  category: 'Marketing',
  integration: 'Meta Ads',
  status: 'Enabled',
  permission: 'Write',
  approval: 'No Approval',
  lastUsed: 'Today, 8:48 AM',
  icon: MessageSquare,
  color: 'var(--foreground)',
  enabled: true
}, {
  id: 'sync-analytics',
  name: 'Sync Analytics Data',
  description: 'Refresh analytics data from connected reporting platforms.',
  category: 'Analytics',
  integration: 'Google Analytics',
  status: 'Enabled',
  permission: 'Read',
  approval: 'No Approval',
  lastUsed: '15 min ago',
  icon: RefreshCw,
  color: 'var(--foreground)',
  enabled: true
}, {
  id: 'discount',
  name: 'Apply Discount Code',
  description: 'Apply a discount code to an eligible customer order.',
  category: 'E-commerce',
  integration: 'Shopify',
  status: 'Blocked',
  permission: 'Write',
  approval: 'User Confirmation',
  lastUsed: 'Never',
  icon: KeyRound,
  color: 'var(--chart-5)',
  enabled: false
}];
const approvals: Approval[] = [{
  id: 'ap-1',
  action: 'Pause Ad Campaign',
  requestedBy: 'Sarah Mitchell',
  agent: 'Growth Scout',
  target: 'Holiday Retargeting',
  time: '4 min ago',
  impact: 'High'
}, {
  id: 'ap-2',
  action: 'Publish Blog Post',
  requestedBy: 'Content Team',
  agent: 'SEO Opportunity Agent',
  target: '10 Ways to Grow',
  time: '18 min ago',
  impact: 'Medium'
}, {
  id: 'ap-3',
  action: 'Update Product Price',
  requestedBy: 'Sarah Mitchell',
  agent: 'E-commerce Agent',
  target: '12 products',
  time: '42 min ago',
  impact: 'Medium'
}];
const recent: Recent[] = [{
  action: 'Generate SEO Report',
  initiator: 'AI Assistant',
  integration: 'Google Analytics',
  result: 'Completed',
  time: '2 min ago'
}, {
  action: 'Sync Analytics Data',
  initiator: 'Automation',
  integration: 'Google Analytics',
  result: 'Completed',
  time: '15 min ago'
}, {
  action: 'Update Product Price',
  initiator: 'AI Agent Growth Scout',
  integration: 'Shopify',
  result: 'Completed',
  time: '1 hr ago'
}, {
  action: 'Pause Ad Campaign',
  initiator: 'AI Agent',
  integration: 'Google Ads',
  result: 'Failed',
  time: '2 hr ago'
}];
const failed: Failed[] = [{
  action: 'Pause Ad Campaign',
  error: 'Permission denied by Google Ads account policy.',
  integration: 'Google Ads',
  time: '2 hours ago'
}, {
  action: 'Apply Discount Code',
  error: 'Action blocked: discount scope is not approved for this workspace.',
  integration: 'Shopify',
  time: 'Yesterday, 6:18 PM'
}];
const access: AgentAccess[] = [{
  id: 'growth',
  name: 'Growth Scout',
  initials: 'GS',
  color: 'var(--foreground)',
  count: '12 actions',
  permission: 'Managed',
  last: '4 min ago'
}, {
  id: 'seo',
  name: 'SEO Opportunity Agent',
  initials: 'SO',
  color: 'var(--chart-4)',
  count: '8 actions',
  permission: 'Managed',
  last: '2 min ago'
}, {
  id: 'assistant',
  name: 'AI Assistant',
  initials: 'AI',
  color: 'var(--foreground)',
  count: '24 actions',
  permission: 'Restricted',
  last: '15 min ago'
}, {
  id: 'commerce',
  name: 'E-commerce Agent',
  initials: 'EC',
  color: 'var(--foreground)',
  count: '15 actions',
  permission: 'Managed',
  last: '1 hr ago'
}];
const categories = [{
  name: 'Marketing',
  count: 8
}, {
  name: 'Advertising',
  count: 6
}, {
  name: 'SEO',
  count: 5
}, {
  name: 'Content',
  count: 7
}, {
  name: 'E-commerce',
  count: 9
}, {
  name: 'Analytics',
  count: 6
}, {
  name: 'Operations',
  count: 4
}, {
  name: 'Automation',
  count: 2
}];
const systems = [{
  name: 'Shopify',
  icon: ShoppingBag
}, {
  name: 'WordPress',
  icon: Globe
}, {
  name: 'Google Ads',
  icon: Target
}, {
  name: 'Meta Ads',
  icon: MessageSquare
}, {
  name: 'Google Analytics',
  icon: BarChart3
}, {
  name: 'Webflow',
  icon: Webhook
}];
const settings = ['Allow AI Assistant to execute approved actions', 'Allow Agents to execute approved actions', 'Require confirmation for external actions', 'Require approval for high-impact actions', 'Allow automated execution'];
export const LuluAIActions = () => {
  const [query, setQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<Action | null>(actions[2]);
  const [panelOpen, setPanelOpen] = useState(true);
  const [dialog, setDialog] = useState<'confirm' | 'success' | 'failure' | 'blocked' | 'enable' | 'disable' | null>(null);
  const [enabledIds, setEnabledIds] = useState<string[]>(actions.filter(action => action.enabled).map(action => action.id));
  const filteredActions = useMemo(() => actions.filter(action => `${action.name} ${action.description} ${action.category} ${action.integration}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const openAction = (action: Action) => {
    setSelectedAction(action);
    setPanelOpen(true);
  };
  return <div className="actions-shell">
    <aside className="actions-sidebar" aria-label="Primary navigation"><div className="actions-wordmark"><Sparkles size={18} /><span>Lulu AI</span></div><LuluSectionNavigation activeId="wondrously-second-5656" /><div className="sidebar-bottom"><button className="nav-item"><Settings size={16} /><span>Settings</span></button><button className="nav-item"><HelpCircle size={16} /><span>Help</span></button><button className="profile-chip"><span className="avatar">SM</span><span><strong>Sarah Mitchell</strong><small>CEO</small></span><ChevronDown size={14} /></button></div></aside>
    <main className="actions-main"><header className="actions-header"><div className="breadcrumb"><span>AI Platform</span><ChevronRight size={13} /><strong>AI Actions</strong></div><div className="title-row"><div><h1>AI Actions</h1><p>Control what AI can do across your connected business systems.</p><span className="header-description">Review actions, manage permissions and approvals, and monitor every execution from one secure control center.</span></div><div className="header-actions"><button className="ghost-button"><Settings2 size={15} />Action Settings</button><button className="primary-button"><Activity size={15} />View Activity</button></div></div></header>
      <div className="actions-content"><section className="health-row" aria-label="Action health"><div><span className="health-dot" /> <strong>Healthy</strong><small>All systems operational</small></div>{['Needs Attention', 'Permission Issue', 'Integration Issue', 'Blocked', 'Error'].map(status => <span className="health-muted" key={status}><i />{status}</span>)}</section>
      <section className="metric-grid" aria-label="Action overview">{metrics.map(metric => {
            const Icon = metric.icon;
            return <article className="metric-card" key={metric.label}><span className="metric-icon" style={{
                color: metric.color,
                background: metric.bg
              }}><Icon size={17} /></span><span><strong>{metric.value}</strong><small>{metric.label}</small></span></article>;
          })}</section>
      <section className="filter-bar" aria-label="Search and filter actions"><label className="action-search"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search actions tools or integrations" aria-label="Search actions tools or integrations" /></label>{[['Category', GridIcon], ['Status', ShieldCheck], ['Execution', Play], ['Source', Webhook]].map(([label, Icon]) => {
            const FilterIcon = Icon as LucideIcon;
            return <button className="filter-button" key={label as string}><FilterIcon size={14} /><span>{label as string}</span><ChevronDown size={13} /></button>;
          })}<button className="filter-button sort-button"><MoreHorizontal size={14} /><span>Most Used</span><ChevronDown size={13} /></button></section>
      <section aria-labelledby="catalog-title"><div className="section-heading"><div><h2 id="catalog-title">Action Catalog</h2><p>Manage capabilities available to your AI platform.</p></div><span className="section-count">{filteredActions.length} of 47 actions</span></div><div className="action-grid">{filteredActions.map(action => {
              const Icon = action.icon;
              const isEnabled = enabledIds.includes(action.id);
              return <article className={`action-card ${action.id === 'pause-campaign' ? 'high-impact-card' : ''}`} key={action.id}><div className="action-card-top"><span className="action-icon" style={{
                    color: action.color,
                    background: `${action.color}1f`
                  }}><Icon size={20} /></span><button className="more-button" aria-label={`More options for ${action.name}`}><MoreHorizontal size={17} /></button></div><h3>{action.name}</h3><p>{action.description}</p><div className="tag-row"><span className="category-tag">{action.category}</span><span className="integration-tag"><PlugIcon />{action.integration}</span></div><div className="state-row"><span className={`status-tag ${action.status === 'Enabled' ? 'green' : action.status === 'Blocked' ? 'red' : 'amber'}`}><i />{action.status}</span><span className="permission-tag"><LockKeyhole size={12} />{action.permission}</span></div><div className="approval-row"><span><Shield size={13} />{action.approval}</span><span className="last-used">Last used {action.lastUsed}</span></div><div className="card-footer"><button className="view-action" onClick={() => openAction(action)}>View Action</button><button className={`toggle ${isEnabled ? 'on' : ''}`} aria-label={`${isEnabled ? 'Disable' : 'Enable'} ${action.name}`} onClick={() => {
                    setSelectedAction(action);
                    setDialog(isEnabled ? 'disable' : 'enable');
                  }}><span /></button></div></article>;
            })}</div></section>
      <section className="impact-section" aria-labelledby="impact-title"><div className="section-heading"><div><h2 id="impact-title">High-Impact Actions</h2><p>These actions require stronger authorization due to significant external effects.</p></div><ShieldAlert size={18} className="amber-icon" /></div><div className="impact-grid">{['Pause Ad Campaign', 'Send Customer Communications', 'Modify Product Catalog', 'Publish Content'].map((name, index) => <article className="impact-card" key={name}><div><ShieldAlert size={16} /><strong>{name}</strong></div><span className="impact-level">{index === 0 ? 'Critical impact' : index === 1 ? 'High impact' : 'Medium impact'}</span><small>{index === 0 ? 'Admin Approval' : 'Approval Required'}</small></article>)}</div></section>
      <section className="approvals-section" aria-labelledby="approvals-title"><div className="section-heading"><div><h2 id="approvals-title">Pending Approvals</h2><p>Review consequential action requests before they execute.</p></div><span className="amber-count">3 awaiting review</span></div><div className="approval-table"><div className="table-head"><span>Action</span><span>Requested By</span><span>Agent</span><span>Target</span><span>Time</span><span>Impact</span><span>Review</span></div>{approvals.map(item => <div className="table-row" key={item.id}><strong>{item.action}</strong><span>{item.requestedBy}</span><span>{item.agent}</span><span>{item.target}</span><span>{item.time}</span><span className="impact-text">{item.impact}</span><span className="review-actions"><button onClick={() => {
                  setSelectedAction(actions.find(action => action.name === item.action) ?? actions[0]);
                  setDialog('confirm');
                }}>Approve</button><button onClick={() => setDialog('failure')}>Reject</button></span></div>)}</div></section>
      <div className="two-column"><section className="panel-section"><div className="section-heading"><h2>Recent Actions</h2><button className="violet-link">View Activity →</button></div><div className="activity-list">{recent.map(item => <div className="activity-row" key={`${item.action}-${item.time}`}><span className={`activity-icon ${item.result === 'Failed' ? 'failed' : ''}`}><CheckCircle size={14} /></span><span className="activity-copy"><strong>{item.action}</strong><small>{item.initiator} · {item.integration}</small></span><span className={`result ${item.result === 'Failed' ? 'failed-text' : ''}`}>{item.result}</span><time>{item.time}</time></div>)}</div></section><section className="panel-section failed-panel"><div className="section-heading"><h2><AlertTriangle size={15} />Failed Actions</h2><span className="red-count">2 errors</span></div>{failed.map(item => <article className="failed-row" key={item.action}><div><strong>{item.action}</strong><p>{item.error}</p><small>{item.integration} · {item.time}</small></div><button className="review-button" onClick={() => setDialog('failure')}>Review</button></article>)}</section></div>
      <section className="access-section"><div className="section-heading"><div><h2>Agents With Action Access</h2><p>Every agent is scoped to an explicit set of capabilities.</p></div><button className="violet-link">Manage Access →</button></div><div className="access-grid">{access.map(agent => <article className="access-card" key={agent.id}><div className="agent-avatar" style={{
                background: `${agent.color}30`,
                color: agent.color
              }}>{agent.initials}</div><div><strong>{agent.name}</strong><span>{agent.count} · last execution {agent.last}</span></div><em className={agent.permission === 'Restricted' ? 'restricted' : ''}>{agent.permission}</em><button className="open-agent">Open Agent</button></article>)}</div></section>
      <div className="two-column lower-columns"><section className="panel-section"><div className="section-heading"><h2>Action Audit Trail</h2><button className="violet-link">View Full Activity →</button></div><div className="timeline">{[['Requested', 'Pause Ad Campaign', 'Growth Scout', '4 min ago', 'Pending'], ['Approved', 'Generate SEO Report', 'Sarah Mitchell', '12 min ago', 'Approved'], ['Executed', 'Sync Analytics Data', 'Automation', '15 min ago', 'Completed'], ['Failed', 'Pause Ad Campaign', 'AI Agent', '2 hr ago', 'Failed']].map(entry => <div className="timeline-entry" key={`${entry[0]}-${entry[1]}`}><span className={`timeline-dot ${entry[4].toLowerCase()}`} /><div><strong>{entry[1]}</strong><small>{entry[0]} by {entry[2]} · {entry[3]}</small></div><em className={`result ${entry[4] === 'Failed' ? 'failed-text' : ''}`}>{entry[4]}</em></div>)}</div></section><section className="panel-section"><div className="section-heading"><h2>Connected Systems</h2></div><div className="system-chips">{systems.map(system => {
                const Icon = system.icon;
                return <span key={system.name}><Icon size={15} />{system.name}</span>;
              })}</div><div className="category-heading"><h2>Action Categories</h2><p>Filter the catalog by operational domain.</p></div><div className="category-pills">{categories.map(category => <button key={category.name}>{category.name}<b>{category.count}</b></button>)}</div></section></div>
      <section className="settings-card"><div><span className="settings-icon"><Settings2 size={19} /></span><div><h2>Action Settings</h2><p>Set workspace-wide guardrails for AI action execution.</p></div></div><div className="settings-list">{settings.map((setting, index) => <label key={setting}><span>{setting}</span><button className={`toggle ${index < 4 ? 'on' : ''}`} aria-label={setting}><span /></button></label>)}</div></section>
      </div></main>
    {panelOpen && selectedAction && <aside className="action-panel" aria-label="Action details"><div className="panel-content"><button className="close-panel" onClick={() => setPanelOpen(false)} aria-label="Close action details"><X size={18} /></button><span className="panel-kicker">Action Detail</span><span className="panel-detail-icon" style={{
          color: selectedAction.color,
          background: `${selectedAction.color}1f`
        }}><selectedAction.icon size={25} /></span><h2>{selectedAction.name}</h2><p>{selectedAction.description}</p><span className={`status-tag ${selectedAction.status === 'Enabled' ? 'green' : selectedAction.status === 'Blocked' ? 'red' : 'amber'}`}><i />{selectedAction.status}</span><div className="detail-block"><h3>Permissions breakdown</h3><div><LockKeyhole size={14} />{selectedAction.permission} access <small>Granted by workspace policy</small></div><div><Shield size={14} />{selectedAction.approval} <small>Every consequential operation is logged</small></div><div><Webhook size={14} />{selectedAction.integration} <small>Connected and healthy</small></div></div><div className="detail-block"><h3>Supported agents</h3>{access.slice(0, 3).map(agent => <div className="support-agent" key={agent.id}><span className="mini-avatar" style={{
              color: agent.color,
              background: `${agent.color}30`
            }}>{agent.initials}</span><span>{agent.name}<small>{agent.permission} access</small></span><Check size={14} /></div>)}</div><div className="detail-block"><h3>Execution history</h3><div className="history-line"><span /><div><strong>Last execution {selectedAction.lastUsed}</strong><small>Initiated by AI Assistant · Completed</small></div></div><div className="history-line"><span /><div><strong>2 executions this week</strong><small>All activity retained in audit trail</small></div></div></div></div><div className="panel-actions"><button className="ghost-button" onClick={() => setPanelOpen(false)}>Close</button><button className="primary-button" onClick={() => setDialog(selectedAction.status === 'Blocked' ? 'blocked' : 'confirm')}>Run Action</button></div></aside>}
    {dialog && <section className="action-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><button className="dialog-close" onClick={() => setDialog(null)} aria-label="Close dialog"><X size={17} /></button>{dialog === 'success' ? <><CheckCircle className="dialog-success" size={34} /><h2 id="dialog-title">Action Executed</h2><p>{selectedAction?.name} completed successfully. The result has been added to your audit trail.</p><button className="primary-button full" onClick={() => setDialog(null)}>Done</button></> : dialog === 'failure' ? <><AlertTriangle className="dialog-failure" size={34} /><h2 id="dialog-title">Action Needs Review</h2><p>The action could not execute because the integration permission was denied. Review the connection and try again.</p><div className="dialog-buttons"><button className="ghost-button" onClick={() => setDialog(null)}>Cancel</button><button className="primary-button" onClick={() => setDialog(null)}>Review Integration</button></div></> : dialog === 'blocked' ? <><LockKeyhole className="dialog-failure" size={34} /><h2 id="dialog-title">Action Blocked</h2><p>This action is blocked because the required external permission has not been granted for this workspace.</p><button className="primary-button full" onClick={() => setDialog(null)}>Review Requirements</button></> : <><ShieldCheck className="dialog-shield" size={32} /><h2 id="dialog-title">{dialog === 'enable' ? 'Enable Action?' : dialog === 'disable' ? 'Disable Action?' : 'Confirm Action'}</h2><p>{dialog === 'enable' ? 'Enable this action for approved agents and workflows.' : dialog === 'disable' ? 'Disabling this action will stop new executions while preserving history.' : `Confirm ${selectedAction?.name} for ${selectedAction?.integration}.`}</p>{dialog === 'confirm' && <dl className="confirm-details"><div><dt>Target</dt><dd>Connected business system</dd></div><div><dt>Scope</dt><dd>{selectedAction?.permission} permissions</dd></div><div><dt>Expected effect</dt><dd>Execution will be logged and monitored</dd></div></dl>}<div className="dialog-buttons"><button className="ghost-button" onClick={() => setDialog(null)}>Cancel</button><button className="primary-button" onClick={() => {
            if (selectedAction && (dialog === 'enable' || dialog === 'disable')) setEnabledIds(ids => dialog === 'enable' ? [...ids, selectedAction.id] : ids.filter(id => id !== selectedAction.id));
            setDialog(dialog === 'confirm' ? 'success' : null);
          }}>{dialog === 'confirm' ? 'Confirm & Execute' : dialog === 'enable' ? 'Enable Action' : 'Disable Action'}</button></div></>}</section>}
  </div>;
};
const GridIcon = Filter;
const PlugIcon = () => <Webhook size={12} />;

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
