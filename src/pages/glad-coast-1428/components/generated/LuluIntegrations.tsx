import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GoogleBusinessIntegrationsPanel } from '../../../../api/panels/GoogleBusinessIntegrationsPanel';
import { getSelectedWorkspaceId } from '../../../../api/session';
import { Activity, AlertCircle, AlertTriangle, ArrowDownUp, BarChart3, Bot, Check, CheckCircle2, ChevronDown, CircleDot, Clock3, Database, ExternalLink, Eye, FileWarning, Gauge, History, KeyRound, LayoutDashboard, Link2, LockKeyhole, MoreHorizontal, PlugZap, RefreshCw, Search, ServerCog, Settings, ShieldCheck, Sparkles, Table2, Webhook, X, Zap } from 'lucide-react';
type StatusKind = 'healthy' | 'warning' | 'error' | 'auth' | 'syncing' | 'limited' | 'completed' | 'active' | 'resolved';
type ViewMode = 'table' | 'card';
type DataLabel = 'Recorded' | 'Calculated' | 'AI-generated' | 'System-generated';
type IntegrationRow = {
  id: string;
  app: string;
  category: string;
  connection: string;
  status: StatusKind;
  statusLabel: string;
  providerAccount: string;
  sources: string;
  sync: string;
  lastSync: string;
  health: number;
  owner: string;
  action: string;
  objects: string[];
};
type KpiCard = {
  id: string;
  label: string;
  value: string;
  comparison: string;
  timestamp: string;
  dataLabel: DataLabel;
  status: StatusKind;
};
type HealthSegment = {
  id: StatusKind;
  label: string;
  value: number;
  color: string;
  icon: 'check' | 'warning' | 'error' | 'auth';
};
type AlertItem = {
  id: string;
  title: string;
  description: string;
  action: string;
  status: StatusKind;
};
type Recommendation = {
  id: string;
  name: string;
  reason: string;
};
type MonitorInsight = {
  id: string;
  title: string;
  tone: 'amber' | 'red';
  description: string;
  evidence: string;
  action: string;
};
type PermissionRow = {
  id: string;
  permission: string;
  scope: string;
  accessType: string;
  purpose: string;
  required: string;
};
type ErrorRow = {
  id: string;
  error: string;
  integration: string;
  category: string;
  severity: string;
  firstSeen: string;
  lastSeen: string;
  frequency: string;
  affected: string;
  status: StatusKind;
};
type SyncRow = {
  id: string;
  integration: string;
  started: string;
  completed: string;
  duration: string;
  objects: string;
  records: string;
  created: string;
  updated: string;
  failed: string;
  status: StatusKind;
  statusLabel: string;
};
type HealthCard = {
  id: string;
  app: string;
  score: number;
  status: StatusKind;
  auth: string;
  api: string;
  sync: string;
  webhooks: string;
};
type ActivityEvent = {
  id: string;
  time: string;
  event: string;
  actor: string;
  detail: string;
  dataLabel: DataLabel;
};
type WebhookRow = {
  id: string;
  name: string;
  source: string;
  event: string;
  endpoint: string;
  status: StatusKind;
  statusLabel: string;
  lastDelivery: string;
  successRate: string;
  failed: string;
};
type DataObject = {
  id: string;
  name: string;
  records: string;
  imported: string;
  updated: string;
  failed: string;
  status: StatusKind;
  statusLabel: string;
};
const navGroups = [{
  id: 'overview',
  items: [{
    id: 'integration-overview',
    label: 'Integration Overview',
    active: true
  }, {
    id: 'connected-apps',
    label: 'Connected Apps',
    active: false
  }, {
    id: 'available-apps',
    label: 'Available Apps',
    active: false
  }, {
    id: 'recommended-integrations',
    label: 'Recommended Integrations',
    active: false
  }, {
    id: 'categories',
    label: 'Categories',
    active: false
  }]
}, {
  id: 'infrastructure',
  items: [{
    id: 'api-connections',
    label: 'API Connections',
    active: false
  }, {
    id: 'webhooks',
    label: 'Webhooks',
    active: false
  }, {
    id: 'data-sync',
    label: 'Data Sync',
    active: false
  }, {
    id: 'sync-history',
    label: 'Sync History',
    active: false
  }]
}, {
  id: 'security',
  items: [{
    id: 'connection-health',
    label: 'Connection Health',
    active: false
  }, {
    id: 'permissions',
    label: 'Permissions',
    active: false
  }, {
    id: 'authentication',
    label: 'Authentication',
    active: false
  }]
}, {
  id: 'audit',
  items: [{
    id: 'integration-activity',
    label: 'Integration Activity',
    active: false
  }, {
    id: 'integration-errors',
    label: 'Integration Errors',
    active: false
  }, {
    id: 'integration-settings',
    label: 'Integration Settings',
    active: false
  }]
}];
const kpiCards: KpiCard[] = [];
const healthSegments: HealthSegment[] = [];
const attentionItems: AlertItem[] = [];
const integrations: IntegrationRow[] = [];
const recommendations: Recommendation[] = [];
const monitorInsights: MonitorInsight[] = [];
const wizardSteps: Array<Record<string, any>> = [];
const permissionRows: PermissionRow[] = [];
const healthBreakdown: Array<Record<string, any>> = [];
const dataFlow: Array<Record<string, any>> = [];
const dataObjects: DataObject[] = [];
const syncProgress: Array<Record<string, any>> = [];
const errorRows: ErrorRow[] = [];
const syncRows: SyncRow[] = [];
const healthCards: HealthCard[] = [];
const activityEvents: ActivityEvent[] = [];
const webhookRows: WebhookRow[] = [];
const statusStyles: Record<StatusKind, string> = {
  healthy: 'border-chart-4/30 bg-chart-4/10 text-chart-4',
  warning: 'border-chart-1/30 bg-chart-1/10 text-chart-1',
  error: 'border-chart-5/30 bg-chart-5/10 text-chart-5',
  auth: 'border-chart-1/30 bg-chart-1/10 text-chart-1',
  syncing: 'border-border bg-secondary text-foreground',
  limited: 'border-chart-1/30 bg-chart-1/10 text-chart-1',
  completed: 'border-chart-4/30 bg-chart-4/10 text-chart-4',
  active: 'border-chart-5/30 bg-chart-5/10 text-chart-5',
  resolved: 'border-border bg-secondary text-foreground'
};
const statusDots: Record<StatusKind, string> = {
  healthy: 'bg-chart-4',
  warning: 'bg-chart-1',
  error: 'bg-destructive',
  auth: 'bg-chart-1',
  syncing: 'bg-primary',
  limited: 'bg-chart-1',
  completed: 'bg-chart-4',
  active: 'bg-destructive',
  resolved: 'bg-secondary'
};
const labelStyles: Record<DataLabel, string> = {
  Recorded: 'border-border bg-card text-muted-foreground',
  Calculated: 'border-border bg-secondary text-foreground',
  'AI-generated': 'border-border bg-secondary text-foreground',
  'System-generated': 'border-border bg-secondary text-foreground'
};
export function LuluIntegrations() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [healthFilter, setHealthFilter] = useState<StatusKind | 'all'>('all');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [toast, setToast] = useState('');
  const workspaceId = getSelectedWorkspaceId();
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const filteredIntegrations = useMemo(() => {
    if (healthFilter === 'all') return integrations;
    if (healthFilter === 'warning') return integrations.filter(item => item.status === 'warning' || item.status === 'limited');
    return integrations.filter(item => item.status === healthFilter);
  }, [healthFilter]);
  if (workspaceId) return <main className="min-h-screen bg-[var(--background)]" />;
  const showAuthenticationRequired = healthFilter === 'auth';
  if (loading) {
    return <main className="min-h-screen bg-sidebar text-foreground"><div className="flex min-h-screen"><aside className="hidden w-72 shrink-0 border-r border-border bg-[var(--sidebar)] p-5 lg:block"><div className="h-10 w-32 animate-pulse rounded-xl bg-secondary" /><div className="mt-10 space-y-3">{navGroups[0].items.map(item => <div key={item.id} className="h-8 animate-pulse rounded-lg bg-secondary" />)}</div></aside><section className="flex-1 bg-sidebar p-5 md:p-8"><div className="animate-pulse"><div className="h-10 w-56 rounded-xl bg-sidebar" /><div className="mt-4 h-5 w-96 max-w-full rounded bg-sidebar" /><div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{kpiCards.map(card => <div key={card.id} className="h-36 rounded-2xl bg-card shadow-sm" />)}</div><div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]"><div className="h-96 rounded-3xl bg-card" /><div className="h-96 rounded-3xl bg-card" /></div><div className="mt-6 h-96 rounded-3xl bg-card" /></div></section></div></main>;
  }
  if (loadError) {
    return <main className="grid min-h-screen place-items-center bg-secondary p-6 text-center"><section className="max-w-md rounded-3xl border border-border bg-card p-8 shadow-sm"><AlertTriangle className="mx-auto text-foreground" size={44} aria-hidden="true" /><h1 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-foreground">Integrations couldn't be loaded</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Lulu AI could not retrieve the integration control plane. Try again to reload recorded and calculated connection data.</p><button type="button" onClick={() => {
          setLoadError(false);
          setLoading(true);
          window.setTimeout(() => setLoading(false), 650);
        }} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-background px-4 py-2.5 text-sm font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"><RefreshCw size={16} aria-hidden="true" /><span>Try Again</span></button></section></main>;
  }
  return <main className="min-h-screen bg-sidebar text-foreground selection:bg-secondary"><div className="flex min-h-screen"><aside className="hidden w-72 shrink-0 flex-col border-r border-border bg-[var(--sidebar)] text-foreground lg:flex"><div className="border-b border-border p-5"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-card text-sm font-black tracking-[-0.06em] text-[var(--foreground)]">LU</div><div><p className="text-sm font-semibold tracking-[-0.02em] text-foreground">LULU AI</p><p className="text-xs text-muted-foreground">Business OS</p></div></div></div><LuluSectionNavigation activeId="glad-coast-1428" /><div className="border-t border-border p-4"><div className="rounded-2xl border border-border bg-secondary p-3"><p className="text-xs font-medium text-foreground">Sensitive credentials</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Secrets and OAuth tokens are masked as ••••••••.</p></div></div></aside><section className="min-w-0 flex-1"><header id="integration-overview" className="border-b border-border bg-card"><div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8"><div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">Enterprise integration infrastructure</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-foreground md:text-5xl">Integrations</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">Connect, monitor and manage the systems that power your business.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setWizardOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-background px-4 py-3 text-sm font-medium text-foreground shadow-sm transition hover:bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"><PlugZap size={16} aria-hidden="true" /><span>Connect Integration</span></button><button type="button" onClick={() => setToast('Explore Apps opened')} className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">Explore Apps</button><button type="button" onClick={() => setToast('Lulu AI is reviewing integration signals')} className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Bot size={16} aria-hidden="true" /><span>Ask Lulu AI</span></button><button type="button" className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">API Connections</button><button type="button" className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">View Sync History</button><button type="button" aria-label="More integration actions" className="rounded-xl border border-border bg-card px-3 py-3 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"><MoreHorizontal size={18} aria-hidden="true" /></button></div></div></div></header><div className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8"><section aria-labelledby="kpi-title"><h2 id="kpi-title" className="sr-only">Integration KPI cards</h2><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">{kpiCards.map(card => {
                const Icon = card.status === 'healthy' ? CheckCircle2 : card.status === 'error' ? AlertCircle : card.status === 'syncing' ? RefreshCw : card.status === 'limited' ? Zap : AlertTriangle;
                return <article key={card.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{card.label}</p><span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium ${statusStyles[card.status]}`}><Icon size={12} aria-hidden="true" /><span>{card.status === 'syncing' ? 'Syncing' : card.status === 'limited' ? 'Limited' : card.status === 'error' ? 'Error' : card.status === 'warning' ? 'Warning' : 'Healthy'}</span></span></div><p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground">{card.value}</p><p className="mt-2 text-xs text-muted-foreground">{card.comparison}</p><div className="mt-4 flex items-center justify-between gap-2"><span className={`rounded-full border px-2 py-1 text-[11px] font-medium ${labelStyles[card.dataLabel]}`}>{card.dataLabel}</span><time className="text-[11px] text-muted-foreground">{card.timestamp}</time></div></article>;
              })}</div></section><section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]"><article className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><div className="flex items-center gap-2"><Gauge className="text-foreground" size={20} aria-hidden="true" /><h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">Integration Health</h2><span className={`rounded-full border px-2 py-1 text-[11px] font-medium ${labelStyles.Calculated}`}>Calculated</span></div><p className="mt-2 text-sm text-muted-foreground">Click a health segment to filter connected applications.</p></div><button type="button" onClick={() => setHealthFilter('all')} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">Clear filter</button></div><div className="mt-6 grid gap-6 md:grid-cols-[260px_1fr] md:items-center"><button type="button" aria-label="Live integration health is not available until workspace integrations are connected" onClick={() => setHealthFilter('healthy')} className="mx-auto grid h-56 w-56 place-items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" style={{
                  background: 'conic-gradient(var(--border) 0deg 360deg)'
                }}><span className="grid h-36 w-36 place-items-center rounded-full bg-card text-center shadow-inner"><span><strong className="block text-4xl tracking-[-0.05em] text-foreground">—</strong><span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Overall</span></span></span></button><div className="grid gap-3 sm:grid-cols-2">{healthSegments.map(segment => {
                    const Icon = segment.id === 'healthy' ? CheckCircle2 : segment.id === 'error' ? AlertCircle : segment.id === 'auth' ? KeyRound : AlertTriangle;
                    return <button key={segment.id} type="button" onClick={() => setHealthFilter(segment.id)} className={`rounded-2xl border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${healthFilter === segment.id ? 'border-border bg-primary' : 'border-border bg-card hover:border-border'}`}><span className="flex items-center justify-between gap-3"><span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground"><Icon size={16} style={{
                            color: segment.color
                          }} aria-hidden="true" /><span>{segment.label}</span></span><span className="text-2xl font-semibold tracking-[-0.04em] text-foreground">{segment.value}%</span></span><span className="mt-3 block h-2 rounded-full bg-primary text-primary-foreground"><span className="block h-2 rounded-full" style={{
                          width: `${segment.value}%`,
                          backgroundColor: segment.color
                        }} /></span></button>;
                  })}</div></div></article><article className="rounded-3xl border border-border bg-secondary/70 p-5 shadow-sm md:p-6"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-2"><AlertTriangle className="text-chart-1" size={20} aria-hidden="true" /><h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">Attention Required</h2></div><span className={`rounded-full border px-2 py-1 text-[11px] font-medium ${labelStyles.Recorded}`}>Recorded</span></div><ul className="mt-5 space-y-3">{attentionItems.map(item => {
                  const Icon = item.status === 'auth' ? KeyRound : item.status === 'error' ? AlertCircle : AlertTriangle;
                  return <li key={item.id} className="rounded-2xl border border-border bg-card p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl ${item.status === 'error' ? 'bg-chart-5/10 text-chart-5' : item.status === 'auth' ? 'bg-secondary text-foreground' : 'bg-secondary text-foreground'}`}><Icon size={16} aria-hidden="true" /></span><div><h3 className="text-sm font-semibold text-foreground">{item.title}</h3><p className="mt-1 text-sm text-muted-foreground">{item.description}</p></div></div><button type="button" onClick={() => item.action === 'Reconnect' ? setWizardOpen(true) : setToast(`${item.action} opened`)} className="rounded-xl bg-background px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">{item.action}</button></div></li>;
                })}</ul></article></section>{showAuthenticationRequired ? <section className="rounded-3xl border border-border bg-secondary p-5"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex gap-3"><KeyRound className="mt-1 text-foreground" size={22} aria-hidden="true" /><div><h2 className="text-lg font-semibold text-foreground">Authentication required</h2><p className="mt-1 text-sm text-foreground">One or more provider accounts require secure reauthentication before Lulu AI can resume imports.</p></div></div><button type="button" onClick={() => setWizardOpen(true)} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">Reconnect</button></div></section> : null}<section id="connected-apps" className="rounded-3xl border border-border bg-card shadow-sm"><div className="flex flex-col gap-4 border-b border-border p-5 md:flex-row md:items-center md:justify-between"><div><div className="flex items-center gap-2"><h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">Connected Apps</h2><span className={`rounded-full border px-2 py-1 text-[11px] font-medium ${labelStyles.Recorded}`}>Recorded</span></div><p className="mt-2 text-sm text-muted-foreground">Enterprise systems currently powering Lulu AI modules.</p></div><div className="inline-flex rounded-xl border border-border bg-primary p-1 text-primary-foreground"><button type="button" onClick={() => setViewMode('table')} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${viewMode === 'table' ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}><Table2 size={15} aria-hidden="true" /><span>Table View</span></button><button type="button" onClick={() => setViewMode('card')} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${viewMode === 'card' ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}><LayoutDashboard size={15} aria-hidden="true" /><span>Card View</span></button></div></div>{filteredIntegrations.length === 0 ? <section className="p-10 text-center"><PlugZap className="mx-auto text-foreground" size={36} aria-hidden="true" /><h3 className="mt-4 text-lg font-semibold text-foreground">Connect your first application to bring your business data into Lulu AI.</h3><div className="mt-5 flex justify-center gap-2"><button type="button" className="rounded-xl bg-background px-4 py-2.5 text-sm font-medium text-foreground">Explore Apps</button><button type="button" className="rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-foreground">Ask Lulu AI</button></div></section> : viewMode === 'table' ? <div className="overflow-x-auto"><table className="w-full min-w-[1180px] border-collapse text-left text-sm"><caption className="sr-only">Connected applications with status, sync and owner details</caption><thead className="bg-secondary text-xs uppercase tracking-[0.12em] text-muted-foreground"><tr><th scope="col" className="px-5 py-3 font-semibold">Application</th><th scope="col" className="px-5 py-3 font-semibold">Category</th><th scope="col" className="px-5 py-3 font-semibold">Connection</th><th scope="col" className="px-5 py-3 font-semibold">Status</th><th scope="col" className="px-5 py-3 font-semibold">Provider Account</th><th scope="col" className="px-5 py-3 font-semibold">Data Sources</th><th scope="col" className="px-5 py-3 font-semibold">Sync</th><th scope="col" className="px-5 py-3 font-semibold">Last Sync</th><th scope="col" className="px-5 py-3 font-semibold">Health</th><th scope="col" className="px-5 py-3 font-semibold">Owner</th><th scope="col" className="px-5 py-3 font-semibold">Actions</th></tr></thead><tbody className="divide-y divide-border">{filteredIntegrations.map(item => {
                    const Icon = item.status === 'healthy' ? CheckCircle2 : item.status === 'auth' ? KeyRound : item.status === 'limited' ? Zap : item.status === 'error' ? AlertCircle : AlertTriangle;
                    return <tr key={item.id} className="hover:bg-secondary/70"><th scope="row" className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-secondary text-xs font-bold text-foreground">{item.app.slice(0, 2).toUpperCase()}</span><span className="font-semibold text-foreground">{item.app}</span></div></th><td className="px-5 py-4 text-muted-foreground">{item.category}</td><td className="px-5 py-4 text-foreground">{item.connection}</td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[item.status]}`} aria-label={`Status: ${item.statusLabel}`}><Icon size={13} aria-hidden="true" /><span>{item.statusLabel}</span></span></td><td className="px-5 py-4 text-muted-foreground">{item.providerAccount}</td><td className="px-5 py-4 text-muted-foreground">{item.sources}</td><td className="px-5 py-4 text-muted-foreground">{item.sync}</td><td className="px-5 py-4 text-muted-foreground">{item.lastSync}</td><td className="px-5 py-4"><span className="font-semibold text-foreground">{item.health}/100</span></td><td className="px-5 py-4 text-muted-foreground">{item.owner}</td><td className="px-5 py-4"><div className="flex items-center gap-2"><button type="button" onClick={() => item.id === 'shopify' ? setToast('Connected platform details visible below') : item.status === 'auth' ? setWizardOpen(true) : setToast(`${item.action} opened`)} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">{item.action}</button><button type="button" aria-label={`More actions for ${item.app}`} className="rounded-lg border border-border p-1.5 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"><MoreHorizontal size={15} aria-hidden="true" /></button></div></td></tr>;
                  })}</tbody></table></div> : <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">{filteredIntegrations.map(item => {
                const Icon = item.status === 'healthy' ? CheckCircle2 : item.status === 'auth' ? KeyRound : item.status === 'limited' ? Zap : item.status === 'error' ? AlertCircle : AlertTriangle;
                return <article key={item.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-secondary text-sm font-black text-foreground">{item.app.slice(0, 2).toUpperCase()}</span><div><h3 className="font-semibold text-foreground">{item.app}</h3><span className="mt-1 inline-block rounded-full bg-secondary px-2 py-1 text-xs text-muted-foreground">{item.category}</span></div></div><span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${statusStyles[item.status]}`}><Icon size={13} aria-hidden="true" /><span>{item.statusLabel}</span></span></div><p className="mt-4 text-sm text-muted-foreground">Account: <span className="font-medium text-foreground">{item.providerAccount}</span></p><ul className="mt-4 flex flex-wrap gap-2">{item.objects.map(object => <li key={object} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{object}</li>)}</ul><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><p><span className="block text-xs text-muted-foreground">Last sync</span><span className="font-medium text-foreground">{item.lastSync}</span></p><p><span className="block text-xs text-muted-foreground">Sync direction</span><span className="font-medium text-foreground">{item.sync}</span></p></div><button type="button" className="mt-5 w-full rounded-xl bg-background px-4 py-2.5 text-sm font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">Open</button></article>;
              })}</div>}</section><section id="recommended-integrations" className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]"><article className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6"><div className="flex items-center gap-2"><Sparkles className="text-foreground" size={20} aria-hidden="true" /><h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">Recommended Integrations</h2><span className={`rounded-full border px-2 py-1 text-[11px] font-medium ${labelStyles['AI-generated']}`}>AI-generated</span></div><ul className="mt-5 space-y-3">{recommendations.map(item => <li key={item.id} className="rounded-2xl border border-border p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-sm font-semibold text-foreground">{item.name}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{item.reason}</p></div><button type="button" onClick={() => setWizardOpen(true)} className="rounded-xl bg-background px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">Connect</button></div></li>)}</ul></article><article className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6"><div className="flex flex-wrap items-center gap-2"><Bot className="text-foreground" size={20} aria-hidden="true" /><h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">AI Integration Monitor</h2><span className={`rounded-full border px-2 py-1 text-[11px] font-medium ${labelStyles['AI-generated']}`}>AI-generated</span></div><p className="mt-2 text-sm text-muted-foreground">Lulu AI continuously analyzes integration signals.</p><div className="mt-5 grid gap-3 md:grid-cols-2">{monitorInsights.map(item => {
                  const Icon = item.tone === 'red' ? AlertCircle : AlertTriangle;
                  return <article key={item.id} className={`rounded-2xl border p-4 ${item.tone === 'red' ? 'border-chart-5/30 bg-chart-5/10' : 'border-border bg-secondary'}`}><div className="flex items-center gap-2"><Icon size={16} className={item.tone === 'red' ? 'text-chart-5' : 'text-foreground'} aria-hidden="true" /><h3 className="text-sm font-semibold text-foreground">{item.title}</h3></div><p className="mt-2 text-sm leading-6 text-foreground">{item.description}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{item.evidence}</p><button type="button" onClick={() => setToast(`${item.action} opened`)} className="mt-4 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">{item.action}</button></article>;
                })}</div></article></section><section className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-sm font-black text-primary-foreground">SH</span><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">Connected platform</h2><span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">Ecommerce</span><span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles.healthy}`}><CheckCircle2 size={13} aria-hidden="true" /><span>Healthy</span></span></div><p className="mt-1 text-sm text-muted-foreground">Integration detail — Overview tab shown</p></div></div><div className="flex flex-wrap gap-2"><button type="button" className="rounded-xl bg-background px-3 py-2 text-sm font-medium text-foreground">Sync Now</button><button type="button" className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">Settings</button><button type="button" onClick={() => setWizardOpen(true)} className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground">Reconnect</button><button type="button" aria-label="More Connected platform actions" className="rounded-xl border border-border px-3 py-2 text-foreground"><MoreHorizontal size={16} aria-hidden="true" /></button></div></div><div className="mt-6 overflow-x-auto"><div role="tablist" aria-label="Connected platform integration detail tabs" className="flex min-w-max gap-2 border-b border-border">{['Overview', 'Connection', 'Permissions', 'Data', 'Sync', 'Sync History', 'Errors', 'API', 'Webhooks', 'Activity', 'Disconnect'].map(tab => <button key={tab} role="tab" aria-selected={tab === 'Overview'} type="button" onClick={() => tab === 'Disconnect' ? setDisconnectOpen(true) : setToast(`${tab} tab available`)} className={`border-b-2 px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${tab === 'Overview' ? 'border-border text-foreground' : 'border-transparent text-foreground hover:text-foreground'}`}>{tab}</button>)}</div></div><div className="mt-6 grid gap-6 xl:grid-cols-[0.75fr_1.25fr]"><article className="rounded-2xl border border-border p-5"><div className="flex items-center justify-between"><div><h3 className="font-semibold text-foreground">Connection Health</h3><span className={`mt-2 inline-block rounded-full border px-2 py-1 text-[11px] font-medium ${labelStyles.Calculated}`}>Calculated</span></div><p className="text-4xl font-semibold tracking-[-0.05em] text-foreground">—</p></div><div className="mt-5 space-y-3">{healthBreakdown.map(item => <div key={item.id}><div className="flex justify-between text-sm"><span className="text-muted-foreground">{item.label}</span><span className="font-medium text-foreground">{item.value}</span></div><div className="mt-1 h-2 rounded-full bg-secondary"><div className="h-2 rounded-full bg-primary text-primary-foreground" style={{
                        width: `${item.value}%`
                      }} /></div></div>)}</div></article><article className="rounded-2xl border border-border p-5"><div className="grid gap-3 sm:grid-cols-3"><p><span className="block text-xs text-muted-foreground">Last Sync</span><span className="font-semibold text-foreground">Not available</span></p><p><span className="block text-xs text-muted-foreground">Next Sync</span><span className="font-semibold text-foreground">Not scheduled</span></p><p><span className="block text-xs text-muted-foreground">Active Errors</span><span className="font-semibold text-foreground">—</span></p></div><div className="mt-5 rounded-2xl bg-secondary p-4"><h3 className="text-sm font-semibold text-foreground">Lulu AI Dependencies</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Used by: Affected modules will be loaded from live workspace data.</p></div><div className="mt-5"><h3 className="text-sm font-semibold text-foreground">Data Flow</h3><ul className="mt-3 grid gap-2 md:grid-cols-2">{dataFlow.map(flow => <li key={flow.id} className="rounded-xl border border-border p-3 text-sm text-foreground"><span className="font-medium text-foreground">{flow.source}</span><span> → {flow.object} → </span><span className="font-medium text-foreground">{flow.target}</span><span> → {flow.outputs}</span></li>)}</ul></div></article></div><div className="mt-6 grid gap-6 xl:grid-cols-2"><article className="rounded-2xl border border-border p-5"><h3 className="font-semibold text-foreground">Data tab summary</h3><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><caption className="sr-only">Connected platform data object import status</caption><thead className="text-xs uppercase tracking-[0.12em] text-muted-foreground"><tr><th scope="col" className="py-2 font-semibold">Object</th><th scope="col" className="py-2 font-semibold">Imported</th><th scope="col" className="py-2 font-semibold">Updated</th><th scope="col" className="py-2 font-semibold">Failed</th><th scope="col" className="py-2 font-semibold">Status</th></tr></thead><tbody className="divide-y divide-border">{dataObjects.map(item => {
                        const Icon = item.status === 'healthy' ? CheckCircle2 : AlertTriangle;
                        return <tr key={item.id}><th scope="row" className="py-3"><span className="block font-medium text-foreground">{item.name}</span><span className="text-xs text-muted-foreground">{item.records}</span></th><td className="py-3 text-muted-foreground">{item.imported}</td><td className="py-3 text-muted-foreground">{item.updated}</td><td className="py-3 text-muted-foreground">{item.failed}</td><td className="py-3"><span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${statusStyles[item.status]}`}><Icon size={13} aria-hidden="true" /><span>{item.statusLabel}</span></span></td></tr>;
                      })}</tbody></table></div></article><article className="rounded-2xl border border-border bg-secondary p-5"><div className="flex items-center gap-2"><RefreshCw className="animate-spin text-foreground" size={18} aria-hidden="true" /><h3 className="font-semibold text-foreground">Synchronizing Connected platform...</h3></div><div className="mt-5 space-y-4">{syncProgress.map(item => <div key={item.id}><div className="flex justify-between gap-3 text-sm"><span className="font-medium text-foreground">{item.label}</span><span className="text-foreground">{item.value}% — {item.count}</span></div><div className="mt-2 h-3 rounded-full bg-card"><div className="h-3 rounded-full bg-primary text-primary-foreground" style={{
                        width: `${item.value}%`
                      }} /></div></div>)}</div></article></div></section><section id="integration-errors" className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">Integration Errors</h2><p className="mt-2 text-sm text-muted-foreground">No secrets are displayed. Credentials are masked as •••••••• in diagnostics.</p></div><div className="flex flex-wrap gap-2">{['Integration', 'Category', 'Severity', 'Status', 'Date'].map(filter => <button key={filter} type="button" className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-sm text-foreground"><span>{filter}</span><ChevronDown size={14} aria-hidden="true" /></button>)}</div></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm"><caption className="sr-only">Integration error register</caption><thead className="bg-primary text-xs uppercase tracking-[0.12em] text-muted-foreground text-primary-foreground"><tr><th scope="col" className="px-4 py-3 font-semibold">Error</th><th scope="col" className="px-4 py-3 font-semibold">Integration</th><th scope="col" className="px-4 py-3 font-semibold">Category</th><th scope="col" className="px-4 py-3 font-semibold">Severity</th><th scope="col" className="px-4 py-3 font-semibold">First Seen</th><th scope="col" className="px-4 py-3 font-semibold">Last Seen</th><th scope="col" className="px-4 py-3 font-semibold">Frequency</th><th scope="col" className="px-4 py-3 font-semibold">Affected Records</th><th scope="col" className="px-4 py-3 font-semibold">Status</th></tr></thead><tbody className="divide-y divide-border">{errorRows.map(row => {
                    const Icon = row.status === 'resolved' ? CheckCircle2 : AlertCircle;
                    return <tr key={row.id}><th scope="row" className="px-4 py-3 font-medium text-foreground">{row.error}</th><td className="px-4 py-3 text-muted-foreground">{row.integration}</td><td className="px-4 py-3 text-muted-foreground">{row.category}</td><td className="px-4 py-3 text-muted-foreground">{row.severity}</td><td className="px-4 py-3 text-muted-foreground">{row.firstSeen}</td><td className="px-4 py-3 text-muted-foreground">{row.lastSeen}</td><td className="px-4 py-3 text-muted-foreground">{row.frequency}</td><td className="px-4 py-3 text-muted-foreground">{row.affected}</td><td className="px-4 py-3"><span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${statusStyles[row.status]}`}><Icon size={13} aria-hidden="true" /><span>{row.status === 'resolved' ? 'Resolved' : 'Active'}</span></span></td></tr>;
                  })}</tbody></table></div><aside className="mt-5 rounded-2xl border border-chart-5/30 bg-chart-5/10 p-5"><h3 className="text-base font-semibold text-foreground">Error Detail: OAuth token expired</h3><div className="mt-4 grid gap-4 md:grid-cols-2"><div><h4 className="text-sm font-semibold text-foreground">What Happened</h4><p className="mt-1 text-sm leading-6 text-foreground">Google Ads OAuth access token has expired. Lulu AI can no longer retrieve advertising performance data.</p></div><div><h4 className="text-sm font-semibold text-foreground">Impact</h4><p className="mt-1 text-sm leading-6 text-foreground">Advertising data has not been updated for 2 hours. Campaigns, Analytics, and Reports modules are affected.</p></div><div><h4 className="text-sm font-semibold text-foreground">Suggested Resolution</h4><p className="mt-1 text-sm leading-6 text-foreground">Click Reconnect to reauthenticate with Google Ads. This will restore the connection and resume data sync.</p></div><div><h4 className="text-sm font-semibold text-foreground">Technical Details</h4><button type="button" className="mt-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground">Show — Admin Only</button><button type="button" className="ml-2 mt-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground">Ask Lulu AI about this error</button></div></div></aside><section className="mt-5 rounded-2xl border border-border bg-secondary p-5"><CheckCircle2 className="text-foreground" size={22} aria-hidden="true" /><h3 className="mt-2 text-base font-semibold text-foreground">No integration errors detected. All connections are operating normally.</h3><p className="mt-1 text-sm text-muted-foreground">Empty state preview for filtered error views.</p></section></section><section id="sync-history" className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6"><div className="flex items-center gap-2"><History className="text-foreground" size={20} aria-hidden="true" /><h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">Sync History</h2><span className={`rounded-full border px-2 py-1 text-[11px] font-medium ${labelStyles['System-generated']}`}>System-generated</span></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[1100px] text-left text-sm"><caption className="sr-only">Historical sync runs</caption><thead className="bg-secondary text-xs uppercase tracking-[0.12em] text-muted-foreground"><tr>{['Sync ID', 'Integration', 'Started', 'Completed', 'Duration', 'Objects', 'Records', 'Created', 'Updated', 'Failed', 'Status'].map(column => <th key={column} scope="col" className="px-4 py-3 font-semibold">{column}</th>)}</tr></thead><tbody className="divide-y divide-border">{syncRows.map(row => {
                    const Icon = row.status === 'completed' ? CheckCircle2 : row.status === 'warning' ? AlertTriangle : AlertCircle;
                    return <tr key={row.id}><th scope="row" className="px-4 py-3 font-medium text-foreground">{row.id}</th><td className="px-4 py-3 text-muted-foreground">{row.integration}</td><td className="px-4 py-3 text-muted-foreground">{row.started}</td><td className="px-4 py-3 text-muted-foreground">{row.completed}</td><td className="px-4 py-3 text-muted-foreground">{row.duration}</td><td className="px-4 py-3 text-muted-foreground">{row.objects}</td><td className="px-4 py-3 text-muted-foreground">{row.records}</td><td className="px-4 py-3 text-muted-foreground">{row.created}</td><td className="px-4 py-3 text-muted-foreground">{row.updated}</td><td className="px-4 py-3 text-muted-foreground">{row.failed}</td><td className="px-4 py-3"><span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${statusStyles[row.status]}`}><Icon size={13} aria-hidden="true" /><span>{row.statusLabel}</span></span></td></tr>;
                  })}</tbody></table></div></section><section id="connection-health" className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">Connection Health</h2><p className="mt-2 text-sm text-muted-foreground">Overall Health Score: <strong>87/100</strong> <span className={`ml-2 rounded-full border px-2 py-1 text-[11px] font-medium ${labelStyles.Calculated}`}>Calculated</span></p></div><div className="flex h-24 items-end gap-2 rounded-2xl border border-border bg-secondary px-4 py-3" aria-label="Last 7 days health timeline chart">{[82, 85, 84, 89, 88, 86, 87].map((value, position) => <span key={`day-${value}-${position + 1}`} className="w-7 rounded-t bg-chart-3" style={{
                  height: `${value}%`
                }} title={`Day ${position + 1}: ${value}/100`} />)}</div></div><div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">{healthCards.map(card => {
                const Icon = card.status === 'healthy' ? CheckCircle2 : card.status === 'error' ? AlertCircle : AlertTriangle;
                return <article key={card.id} className="rounded-2xl border border-border p-4"><div className="flex items-center justify-between"><h3 className="font-semibold text-foreground">{card.app}</h3><Icon size={16} className={card.status === 'healthy' ? 'text-chart-4' : card.status === 'error' ? 'text-chart-5' : 'text-foreground'} aria-hidden="true" /></div><p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">{card.score}/100</p><dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground"><div><dt>Auth</dt><dd className="font-medium text-foreground">{card.auth}</dd></div><div><dt>API</dt><dd className="font-medium text-foreground">{card.api}</dd></div><div><dt>Sync</dt><dd className="font-medium text-foreground">{card.sync}</dd></div><div><dt>Webhooks</dt><dd className="font-medium text-foreground">{card.webhooks}</dd></div></dl></article>;
              })}</div></section><section id="integration-activity" className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6"><div className="flex items-center gap-2"><Activity className="text-foreground" size={20} aria-hidden="true" /><h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">Integration Activity</h2></div><ol className="mt-5 space-y-3">{activityEvents.map(event => <li key={event.id} className="rounded-2xl border border-border p-4"><div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"><div><time className="text-xs font-medium text-muted-foreground">{event.time}</time><h3 className="mt-1 text-sm font-semibold text-foreground">{event.event}</h3><p className="mt-1 text-sm text-muted-foreground">{event.actor} · {event.detail}</p></div><span className={`w-fit rounded-full border px-2 py-1 text-[11px] font-medium ${labelStyles[event.dataLabel]}`}>{event.dataLabel}</span></div></li>)}</ol></section><section id="webhooks" className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-2"><Webhook className="text-foreground" size={20} aria-hidden="true" /><h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">Webhooks</h2></div><button type="button" className="rounded-xl bg-background px-4 py-2.5 text-sm font-medium text-foreground">Create Webhook</button></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[1060px] text-left text-sm"><caption className="sr-only">Webhook delivery status</caption><thead className="bg-primary text-xs uppercase tracking-[0.12em] text-muted-foreground text-primary-foreground"><tr>{['Name', 'Source', 'Event', 'Endpoint', 'Status', 'Last Delivery', 'Success Rate', 'Failed', 'Actions'].map(column => <th key={column} scope="col" className="px-4 py-3 font-semibold">{column}</th>)}</tr></thead><tbody className="divide-y divide-border">{webhookRows.map(row => {
                    const Icon = row.status === 'active' ? CheckCircle2 : Zap;
                    return <tr key={row.id}><th scope="row" className="px-4 py-3 font-medium text-foreground">{row.name}</th><td className="px-4 py-3 text-muted-foreground">{row.source}</td><td className="px-4 py-3 text-muted-foreground">{row.event}</td><td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.endpoint}</td><td className="px-4 py-3"><span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${statusStyles[row.status]}`}><Icon size={13} aria-hidden="true" /><span>{row.statusLabel}</span></span></td><td className="px-4 py-3 text-muted-foreground">{row.lastDelivery}</td><td className="px-4 py-3 text-muted-foreground">{row.successRate}</td><td className="px-4 py-3 text-muted-foreground">{row.failed}</td><td className="px-4 py-3"><div className="flex gap-2"><button type="button" className="rounded-lg border border-border px-2 py-1 text-xs">{row.status === 'limited' ? 'View Error' : 'Edit'}</button>{row.status === 'limited' ? null : <button type="button" className="rounded-lg border border-border px-2 py-1 text-xs">Test</button>}<button type="button" aria-label={`More actions for ${row.name}`} className="rounded-lg border border-border p-1"><MoreHorizontal size={14} aria-hidden="true" /></button></div></td></tr>;
                  })}</tbody></table></div></section></div></section></div><AnimatePresence>{wizardOpen ? <motion.section className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-background/70 p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}><motion.div role="dialog" aria-modal="true" aria-labelledby="wizard-title" className="w-full max-w-5xl rounded-3xl border border-border bg-card p-5 shadow-2xl md:p-6" initial={{
          y: 20,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} exit={{
          y: 20,
          opacity: 0
        }}><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">Connection Wizard</p><h2 id="wizard-title" className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">Requested Permissions</h2><p className="mt-2 text-sm text-muted-foreground">Step 04 — Permissions for the selected provider integration.</p></div><button type="button" aria-label="Close connection wizard" onClick={() => setWizardOpen(false)} className="rounded-xl border border-border p-2 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"><X size={18} aria-hidden="true" /></button></div><ol className="mt-6 grid gap-2 sm:grid-cols-5 lg:grid-cols-10">{wizardSteps.map(step => <li key={step.id} className={`rounded-xl border p-2 text-center ${step.id === '04' ? 'border-border bg-secondary text-foreground' : Number(step.id) < 4 ? 'border-border bg-secondary text-foreground' : 'border-border bg-secondary text-muted-foreground'}`}><span className="block text-xs font-bold">{step.id}</span><span className="block truncate text-[11px]">{step.label}</span></li>)}</ol><div className="mt-6 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><caption className="sr-only">Requested permissions and access type</caption><thead className="bg-secondary text-xs uppercase tracking-[0.12em] text-muted-foreground"><tr>{['Permission', 'Scope', 'Access Type', 'Purpose', 'Required/Optional'].map(column => <th key={column} scope="col" className="px-4 py-3 font-semibold">{column}</th>)}</tr></thead><tbody className="divide-y divide-border">{permissionRows.map(row => <tr key={row.id}><th scope="row" className="px-4 py-3 font-medium text-foreground">{row.permission}</th><td className="px-4 py-3 text-muted-foreground">{row.scope}</td><td className="px-4 py-3 text-muted-foreground">{row.accessType}</td><td className="px-4 py-3 text-muted-foreground">{row.purpose}</td><td className="px-4 py-3 text-muted-foreground">{row.required}</td></tr>)}</tbody></table></div><div className="mt-5 rounded-2xl border border-border bg-secondary p-4"><div className="flex gap-3"><LockKeyhole className="mt-0.5 text-foreground" size={18} aria-hidden="true" /><div><p className="text-sm font-semibold text-foreground">This permission allows Lulu AI to modify data in the connected application. <span className="ml-2 rounded-full bg-primary px-2 py-1 text-[11px] font-bold text-primary-foreground">WRITE ACCESS</span></p><p className="mt-1 text-sm text-foreground">Secrets and refresh tokens remain masked and are never shown in this interface.</p></div></div></div><div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground">Back</button><button type="button" className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground">Save Progress</button><button type="button" onClick={() => setWizardOpen(false)} className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground">Cancel</button><button type="button" onClick={() => {
              setWizardOpen(false);
              setToast('Connection progress saved');
            }} className="rounded-xl bg-background px-4 py-2.5 text-sm font-medium text-foreground">Continue</button></div></motion.div></motion.section> : null}</AnimatePresence><AnimatePresence>{disconnectOpen ? <motion.section className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}><motion.div role="dialog" aria-modal="true" aria-labelledby="disconnect-title" className="w-full max-w-xl rounded-3xl border border-chart-5/30 bg-card p-6 shadow-2xl" initial={{
          scale: 0.97,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.97,
          opacity: 0
        }}><div className="flex items-start gap-3"><AlertTriangle className="mt-1 text-chart-5" size={24} aria-hidden="true" /><div><h2 id="disconnect-title" className="text-2xl font-semibold tracking-[-0.04em] text-foreground">Integration Dependency Warning</h2><p className="mt-3 text-sm leading-6 text-foreground">Disconnecting this integration may affect connected workspace modules:</p></div></div><p className="mt-4 rounded-2xl bg-secondary p-4 text-sm leading-6 text-foreground">Affected modules will be loaded from live workspace data.</p><p className="mt-4 text-sm leading-6 text-chart-5">Active synchronizations will stop. Synchronized historical data will be retained unless you choose to remove it.</p><fieldset className="mt-5"><legend className="text-sm font-semibold text-foreground">Data Policy</legend><div className="mt-3 space-y-2"><label className="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="data-policy" defaultChecked className="accent-primary" /><span>Keep synchronized data</span></label><label className="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="data-policy" className="accent-primary" /><span>Archive synchronized data</span></label><label className="flex items-center gap-2 text-sm text-foreground"><input type="radio" name="data-policy" className="accent-primary" /><span>Remove synchronized data</span></label></div></fieldset><div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setDisconnectOpen(false)} className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground">Cancel</button><button type="button" onClick={() => {
              setDisconnectOpen(false);
              setToast('Disconnect workflow requires final admin approval');
            }} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Continue Disconnect</button></div></motion.div></motion.section> : null}</AnimatePresence>{toast ? <div role="status" className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-xl"><Check size={15} className="text-foreground" aria-hidden="true" /><span>{toast}</span></div> : null}</main>;
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
  "label": "Website & Commerce",
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
    "id": "sparklingly-moon-5114",
    "label": "SEO"
  }, {
    "id": "zealously-path-4224",
    "label": "GEO"
  }, {
    "id": "sunny-house-9595",
    "label": "AEO"
  }, {
    "id": "daring-brook-9034",
    "label": "Reviews"
  }, {
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
          <span data-lulu-section-soon={section.label !== "Website & Commerce" && section.label !== "Settings" ? "true" : undefined}>{section.label}</span>
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
