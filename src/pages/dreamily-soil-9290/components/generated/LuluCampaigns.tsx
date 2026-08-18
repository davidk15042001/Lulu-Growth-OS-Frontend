import { useState } from 'react';
import { Activity, Archive, ArrowDownRight, ArrowUpRight, Bell, Bot, Check, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, Clock3, Ellipsis, FileText, Filter, Gauge, Globe2, LayoutGrid, Mail, Menu, Pause, Pencil, Play, Plus, Search, Settings2, ShieldAlert, Sparkles, Target, Users, WandSparkles, X, Zap } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type CampaignStatus = 'Active' | 'Scheduled' | 'Paused' | 'Completed' | 'Draft';
interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  type: string;
  channels: string;
  audience: string;
  goal: string;
  revenue: string;
  leads: string;
  customers: string;
  roi: string;
  owner: string;
  dates: string;
}
const campaigns: Campaign[] = [{
  id: 'summer',
  name: 'Summer Product Launch',
  status: 'Active',
  type: 'Product Launch',
  channels: 'Email · SEO · Social · Paid',
  audience: 'High-Value Customers',
  goal: 'Revenue',
  revenue: '€42,800',
  leads: '1,284',
  customers: '184',
  roi: '4.8x',
  owner: 'Marketing Team',
  dates: 'Jun 01 → Jul 15'
}, {
  id: 'q4',
  name: 'Q4 Enterprise Acquisition',
  status: 'Active',
  type: 'Customer Acquisition',
  channels: 'Email · Content · CRM · SEO',
  audience: 'Enterprise Prospects',
  goal: 'Leads',
  revenue: '€28,600',
  leads: '847',
  customers: '96',
  roi: '3.9x',
  owner: 'Marketing team member',
  dates: 'Jul 01 → Sep 30'
}, {
  id: 'holiday',
  name: 'Holiday Retention Campaign',
  status: 'Scheduled',
  type: 'Customer Retention',
  channels: 'Email · Social · Automation',
  audience: 'Loyal Customers',
  goal: 'Retention',
  revenue: '—',
  leads: '—',
  customers: '—',
  roi: '—',
  owner: 'Emma Davis',
  dates: 'Dec 01 → Jan 15'
}, {
  id: 'brand',
  name: 'Brand Awareness Q3',
  status: 'Active',
  type: 'Brand Awareness',
  channels: 'SEO · GEO · Content · Social',
  audience: 'All Segments',
  goal: 'Awareness',
  revenue: '€12,400',
  leads: '394',
  customers: '—',
  roi: '—',
  owner: 'Marketing Team',
  dates: 'Jul 15 → Sep 15'
}, {
  id: 'webinar',
  name: 'Lead Gen Webinar Series',
  status: 'Paused',
  type: 'Lead Generation',
  channels: 'Email · Content · Social',
  audience: 'SMB Leaders',
  goal: 'Leads',
  revenue: '€8,200',
  leads: '312',
  customers: '44',
  roi: '2.1x',
  owner: 'James Liu',
  dates: 'Jun 15 → Aug 30'
}, {
  id: 'spring',
  name: 'Spring Promotion',
  status: 'Completed',
  type: 'Promotion',
  channels: 'Email · Paid · Social',
  audience: 'All Customers',
  goal: 'Revenue',
  revenue: '€64,200',
  leads: '2,108',
  customers: '312',
  roi: '6.2x',
  owner: 'Marketing Team',
  dates: 'Mar 01 → Apr 30'
}, {
  id: 'feature',
  name: 'New Feature Launch',
  status: 'Draft',
  type: 'Product Launch',
  channels: 'Email · Content · SEO',
  audience: 'Current Users',
  goal: 'Engagement',
  revenue: '—',
  leads: '—',
  customers: '—',
  roi: '—',
  owner: 'Marketing team member',
  dates: 'TBD'
}];
const navItems = ['Campaigns', 'Content', 'SEO', 'GEO', 'AEO', 'Audiences', 'Analytics', 'Automations'];
const filterItems = ['Status', 'Campaign Type', 'Channel', 'Owner', 'Audience', 'Goal', 'Date'];
const savedFilters = ['Active Campaigns', 'My Campaigns', 'High ROI', 'Underperforming', 'Scheduled', 'Completed', 'AI Optimizations', 'Requires Attention'];
const channels = [{
  name: 'Email',
  icon: Mail,
  revenue: '€14,800',
  leads: '482',
  conversion: '8.2%',
  tone: 'violet'
}, {
  name: 'SEO',
  icon: Globe2,
  revenue: '€12,400',
  leads: '394',
  conversion: '7.1%',
  tone: 'emerald'
}, {
  name: 'Organic Social',
  icon: Users,
  revenue: '€6,800',
  leads: '234',
  conversion: '4.8%',
  tone: 'blue'
}, {
  name: 'Paid Advertising',
  icon: Target,
  revenue: '€9,800',
  leads: '302',
  conversion: '3.9x ROI',
  tone: 'amber'
}];
const funnel = [{
  label: 'Audience',
  value: '8,400',
  detail: 'contacts'
}, {
  label: 'Reach',
  value: '62,400',
  detail: '+18% vs target'
}, {
  label: 'Engagement',
  value: '18,200',
  detail: '29.2% conversion'
}, {
  label: 'Leads',
  value: '1,284',
  detail: '7.1% conversion'
}, {
  label: 'Qualified Leads',
  value: '847',
  detail: '66% conversion'
}, {
  label: 'Customers',
  value: '184',
  detail: '21.7% conversion'
}, {
  label: 'Revenue',
  value: '€42,800',
  detail: '86% of target'
}];
const insightCards = [{
  title: 'Email is the highest-converting channel',
  body: '8.2% vs 5.4% campaign average',
  impact: 'High',
  color: 'violet'
}, {
  title: 'Organic search is gaining momentum',
  body: 'Increasing traffic at a lower acquisition cost',
  impact: 'Medium',
  color: 'blue'
}, {
  title: 'Paid advertising performance is declining',
  body: 'Review recommended versus campaign start',
  impact: 'Critical',
  color: 'red'
}];
function statusIcon(status: CampaignStatus) {
  if (status === 'Active') return <Play size={11} fill="currentColor" />;
  if (status === 'Scheduled') return <Clock3 size={12} />;
  if (status === 'Paused') return <Pause size={12} fill="currentColor" />;
  if (status === 'Completed') return <Check size={12} />;
  return <Pencil size={12} />;
}
function statusClass(status: CampaignStatus) {
  return status === 'Active' ? 'border-chart-4/25 bg-chart-4/10 text-chart-4' : status === 'Scheduled' ? 'border-border/25 bg-secondary/10 text-foreground' : status === 'Paused' ? 'border-border/25 bg-secondary/10 text-foreground' : 'border-border/30 bg-secondary/10 text-foreground';
}
export function LuluCampaigns() {
  const [selectedId, setSelectedId] = useState('summer');
  const [query, setQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [mobileNav, setMobileNav] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [toast, setToast] = useState('');
  const { items: campaignRecords, loading: campaignsLoading, error: campaignsError } = useLiveRecords('marketing_campaigns');
  const getCampaignField = (record: typeof campaignRecords[number], key: string) => String((record as unknown as Record<string, unknown>)[key] ?? '');
  const liveCampaigns: Campaign[] = campaignRecords.map(record => ({ id: record.id, name: getCampaignField(record, 'name') || 'Marketing campaign', status: (getCampaignField(record, 'status') || 'Draft') as CampaignStatus, type: getCampaignField(record, 'type') || 'Campaign', channels: getCampaignField(record, 'channels') || 'Connected channels', audience: getCampaignField(record, 'audience') || 'Connected audience', goal: getCampaignField(record, 'goal') || '—', revenue: record.valueAmount || '—', leads: getCampaignField(record, 'leads') || '—', customers: getCampaignField(record, 'customers') || '—', roi: getCampaignField(record, 'roi') || '—', owner: getCampaignField(record, 'ownerName') || 'Workspace owner', dates: getCampaignField(record, 'dates') || record.updatedAt || '—' }));
  const visible = (campaignsLoading ? [] : liveCampaigns).filter(campaign => campaign.name.toLowerCase().includes(query.toLowerCase()));
  const liveMetrics = [{ label: 'Active Campaigns', value: String(liveCampaigns.filter(campaign => campaign.status === 'Active').length), icon: Play, trend: 'Live records', color: 'emerald' }, { label: 'Scheduled', value: String(liveCampaigns.filter(campaign => campaign.status === 'Scheduled').length), icon: Clock3, trend: 'Live records', color: 'blue' }, { label: 'Completed', value: String(liveCampaigns.filter(campaign => campaign.status === 'Completed').length), icon: Check, trend: 'Live records', color: 'slate' }, { label: 'Total Campaign Revenue', value: liveCampaigns.length ? liveCampaigns.map(campaign => campaign.revenue).join(', ') : '—', icon: ArrowUpRight, trend: 'Live records', color: 'emerald' }, { label: 'Campaign ROI', value: '—', icon: Gauge, trend: 'Analytics contract required', color: 'emerald' }, { label: 'Needs Attention', value: String(liveCampaigns.filter(campaign => campaign.status === 'Paused').length), icon: CircleAlert, trend: 'Calculated', color: 'amber' }];
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };
  return <main className="min-h-screen bg-[var(--background)] text-foreground font-sans">
      <header className="h-[68px] border-b border-border bg-[var(--card)]/95 px-5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3"><button className="lg:hidden p-2 text-foreground" aria-label="Open navigation" onClick={() => setMobileNav(!mobileNav)}><Menu size={20} /></button><div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary grid place-items-center shadow-lg shadow-black/30 text-primary-foreground"><Sparkles size={19} /></div><div><strong className="tracking-tight text-[17px]">lulu<span className="text-foreground">.</span>ai</strong><span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Business OS</span></div></div>
        <div className="flex items-center gap-5"><button aria-label="Notifications" className="relative text-foreground hover:text-foreground"><Bell size={18} /><span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" /></button><div className="h-8 w-8 rounded-full bg-gradient-to-br from-secondary to-primary grid place-items-center text-xs font-bold text-foreground">MC</div><div className="hidden sm:block text-xs"><strong className="block font-medium">Workspace owner</strong><span className="text-muted-foreground">Growth Team</span></div><ChevronDown size={14} className="text-muted-foreground" /></div>
      </header>
      <div className="flex">{campaignsError && <div role="alert" className="fixed left-1/2 top-20 z-40 -translate-x-1/2 rounded-lg border border-chart-5/30 bg-chart-5/10 px-4 py-3 text-sm text-chart-5">Campaign data could not be loaded. Check marketing campaign records and try again.</div>}{!campaignsLoading && !campaignsError && liveCampaigns.length === 0 && <div className="fixed left-1/2 top-20 z-40 -translate-x-1/2 rounded-lg border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground">No marketing campaigns are available yet.</div>}
        <aside className={`${mobileNav ? 'flex' : 'hidden'} lg:flex fixed lg:sticky top-[68px] z-10 lg:z-0 h-[calc(100vh-68px)] w-[244px] shrink-0 flex-col border-r border-border bg-[var(--sidebar)] px-3 py-5`}>
          <div className="px-3 mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Core Platform</div>
          <LuluSectionNavigation activeId="dreamily-soil-9290" />
          <div className="mt-auto border-t border-border pt-4"><button className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary"><Settings2 size={16} /><span>Workspace settings</span></button></div>
        </aside>
        <section className="min-w-0 flex-1 px-4 py-6 sm:px-7 lg:px-9">
          <div className="mx-auto max-w-[1420px]">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div><div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground"><span>Marketing</span><ChevronRight size={13} /><span className="text-foreground">Campaigns</span></div><h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Campaigns</h1><p className="mt-2 text-sm text-muted-foreground">Create, manage and optimize multi-channel marketing campaigns from one workspace.</p></div><div className="flex gap-2"><button onClick={() => notify('Filters are ready to customize')} className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground hover:bg-secondary"><Filter size={15} /><span>Filter</span></button><button onClick={() => notify('Campaign report exported')} className="hidden items-center gap-2 rounded-lg border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground hover:bg-secondary sm:flex"><Archive size={15} /><span>Export</span></button><button onClick={() => setCreateOpen(true)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/25 hover:from-primary hover:to-primary"><Plus size={16} /><span>Create Campaign</span></button></div></div>
            <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{(campaignsLoading ? [] : liveMetrics).map(metric => <article key={metric.label} className="rounded-xl border border-border bg-secondary p-4"><div className="flex items-center justify-between"><span className={`grid h-7 w-7 place-items-center rounded-lg bg-${metric.color}-400/10 text-${metric.color}-300`}><metric.icon size={15} /></span><span className={`text-[11px] ${metric.color === 'amber' ? 'text-chart-1' : 'text-muted-foreground'}`}>{metric.trend}</span></div><strong className="mt-4 block text-xl font-semibold tracking-tight text-foreground">{metric.value}</strong><span className="mt-1 block text-xs text-muted-foreground">{metric.label}</span></article>)}</div>
            <div className="mt-6 rounded-xl border border-border bg-secondary p-3"><div className="flex flex-col gap-3 lg:flex-row lg:items-center"><label className="flex flex-1 items-center gap-3 rounded-lg border border-border bg-[var(--card)] px-3 text-sm text-muted-foreground"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search campaigns..." className="w-full bg-transparent py-2.5 outline-none placeholder:text-muted-foreground" /></label><div className="flex gap-2 overflow-x-auto pb-1">{filterItems.map(filter => <button key={filter} className="flex shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-foreground hover:border-border/30 hover:text-foreground"><span>{filter}</span><ChevronDown size={12} /></button>)}<button className="flex shrink-0 items-center gap-2 rounded-lg border border-border/20 bg-secondary/10 px-3 py-2 text-xs text-foreground">Saved Filters <ChevronDown size={12} /></button><button onClick={() => setQuery('')} className="shrink-0 px-2 text-xs text-foreground hover:text-foreground">Clear</button></div></div></div>
            <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.85fr)_minmax(320px,1fr)]">
              <div className="min-w-0"><div className="mb-3 flex items-center justify-between"><div><h2 className="text-sm font-semibold text-foreground">Campaign workspace</h2><p className="mt-1 text-xs text-muted-foreground">57 strategic initiatives across your marketing engine</p></div>{selectedRows.length > 0 && <div className="flex items-center gap-2 rounded-lg border border-border/20 bg-secondary/10 px-3 py-2 text-xs text-foreground">{selectedRows.length} selected · <button onClick={() => notify('Bulk action menu opened')} className="font-semibold">Actions</button></div>}</div><div className="overflow-hidden rounded-xl border border-border bg-secondary"><div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-left text-xs"><thead className="border-b border-border bg-secondary text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><tr><th className="px-4 py-3"><input type="checkbox" aria-label="Select all campaigns" checked={selectedRows.length === liveCampaigns.length} onChange={event => setSelectedRows(event.target.checked ? liveCampaigns.map(campaign => campaign.id) : [])} /></th><th className="px-2 py-3">Campaign</th><th className="px-2 py-3">Status</th><th className="px-2 py-3">Type</th><th className="px-2 py-3">Channels</th><th className="px-2 py-3">Audience</th><th className="px-2 py-3">Revenue</th><th className="px-2 py-3">Leads</th><th className="px-2 py-3">ROI</th><th className="px-2 py-3">Owner</th><th className="px-2 py-3">Dates</th><th className="px-3 py-3" /></tr></thead><tbody className="divide-y divide-white/[0.06]">{visible.map(campaign => <tr key={campaign.id} onClick={() => setSelectedId(campaign.id)} className={`group cursor-pointer transition hover:bg-secondary/[0.05] ${selectedId === campaign.id ? 'bg-secondary/[0.07]' : ''}`}><td className="px-4 py-3.5" onClick={event => event.stopPropagation()}><input type="checkbox" aria-label={`Select ${campaign.name}`} checked={selectedRows.includes(campaign.id)} onChange={event => setSelectedRows(event.target.checked ? [...selectedRows, campaign.id] : selectedRows.filter(id => id !== campaign.id))} /></td><td className="px-2 py-3.5"><strong className="block whitespace-nowrap font-medium text-foreground">{campaign.name}</strong><span className="mt-1 block text-[10px] text-muted-foreground">{campaign.goal} goal</span></td><td className="px-2 py-3.5"><span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 text-[10px] font-medium ${statusClass(campaign.status)}`}>{statusIcon(campaign.status)}<span>{campaign.status}</span></span></td><td className="px-2 py-3.5 whitespace-nowrap text-muted-foreground">{campaign.type}</td><td className="max-w-[145px] px-2 py-3.5 text-muted-foreground">{campaign.channels}</td><td className="whitespace-nowrap px-2 py-3.5 text-muted-foreground">{campaign.audience}</td><td className="whitespace-nowrap px-2 py-3.5 font-medium text-foreground">{campaign.revenue}</td><td className="whitespace-nowrap px-2 py-3.5 text-foreground">{campaign.leads}</td><td className="whitespace-nowrap px-2 py-3.5 text-foreground">{campaign.roi}</td><td className="whitespace-nowrap px-2 py-3.5 text-muted-foreground">{campaign.owner}</td><td className="whitespace-nowrap px-2 py-3.5 text-muted-foreground">{campaign.dates}</td><td className="px-3 py-3.5"><button aria-label={`More actions for ${campaign.name}`} onClick={event => {
                            event.stopPropagation();
                            notify('Campaign actions opened');
                          }} className="rounded p-1 text-foreground hover:bg-secondary hover:text-foreground"><Ellipsis size={16} /></button></td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground"><span>Showing 1–{visible.length} of 57 campaigns</span><div className="flex gap-1"><button className="rounded border border-border p-1.5 hover:bg-secondary"><ChevronLeft size={14} /></button><button className="rounded border border-border p-1.5 hover:bg-secondary"><ChevronRight size={14} /></button></div></div></div>
                <div className="mt-5 overflow-x-auto pb-2"><div className="flex min-w-max items-center gap-2"><span className="mr-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Saved</span>{savedFilters.map(filter => <button key={filter} onClick={() => notify(`${filter} filter applied`)} className="rounded-full border border-border bg-secondary px-3 py-1.5 text-[11px] text-foreground hover:border-border/30 hover:text-foreground">{filter}</button>)}<button onClick={() => notify('Filter builder opened')} className="flex items-center gap-1 rounded-full border border-dashed border-border/35 px-3 py-1.5 text-[11px] text-foreground"><Plus size={13} /> Create Filter</button></div></div>
                <article className="mt-5 rounded-xl border border-border bg-secondary p-5"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-start"><div><div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-semibold text-foreground">Summer Product Launch</h2><span className="inline-flex items-center gap-1.5 rounded-full border border-chart-4/25 bg-chart-4/10 px-2.5 py-1 text-[10px] font-medium text-chart-4"><Play size={10} fill="currentColor" /> Active</span></div><p className="mt-2 text-xs text-muted-foreground">Multi-channel product launch targeting high-value customers across digital channels</p></div><div className="flex flex-wrap gap-2"><button onClick={() => notify('Edit mode opened')} className="rounded-lg border border-border px-2.5 py-2 text-xs text-foreground"><Pencil size={13} className="mr-1.5 inline" />Edit</button><button onClick={() => notify('Campaign paused')} className="rounded-lg border border-border/20 px-2.5 py-2 text-xs text-foreground"><Pause size={13} className="mr-1.5 inline" />Pause</button><button onClick={() => notify('Lulu AI is reviewing the campaign')} className="rounded-lg bg-secondary/15 px-2.5 py-2 text-xs text-foreground"><Bot size={13} className="mr-1.5 inline" />Ask Lulu AI</button></div></div><div className="mt-5 flex items-center gap-2 rounded-lg border border-chart-1/20 bg-chart-1/[0.07] px-3 py-2.5 text-xs text-chart-1"><ShieldAlert size={15} /><span><strong>Paid advertising efficiency has declined 12%</strong> — Review recommended</span></div><div className="mt-5 flex gap-1 overflow-x-auto border-b border-border">{['Overview', 'Performance', 'Funnel', 'Channels', 'Content', 'Audience', 'Timeline', 'AI Insights', 'Activity'].map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 border-b-2 px-3 py-3 text-xs transition ${activeTab === tab ? 'border-border text-foreground' : 'border-transparent text-foreground hover:text-foreground'}`}>{tab}</button>)}</div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">{[{
                    label: 'Owner',
                    value: 'Marketing Team'
                  }, {
                    label: 'Type',
                    value: 'Product Launch'
                  }, {
                    label: 'Primary Goal',
                    value: 'Revenue · €50,000 target'
                  }, {
                    label: 'Secondary Goal',
                    value: 'Leads · 1,500 target'
                  }, {
                    label: 'Audience',
                    value: 'High-Value Customers · 8,400 contacts'
                  }, {
                    label: 'Channels',
                    value: 'Email · SEO · Organic Social · Paid Advertising'
                  }, {
                    label: 'Schedule',
                    value: 'June 1, 2025 → July 15, 2025'
                  }, {
                    label: 'Budget',
                    value: '€18,000 · Day 32 of 44'
                  }].map(item => <div key={item.label} className="rounded-lg border border-border bg-[var(--secondary)]/70 p-3"><span className="block text-[10px] uppercase tracking-[0.13em] text-muted-foreground">{item.label}</span><strong className="mt-2 block text-xs font-medium text-foreground">{item.value}</strong></div>)}</div>
                  <div className="mt-6"><div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold text-foreground">Performance over time</h3><p className="mt-1 text-xs text-muted-foreground">Campaign Period · live performance against target</p></div><div className="flex gap-1 rounded-lg border border-border p-1"><button className="rounded bg-secondary px-2 py-1.5 text-[10px] text-foreground">Campaign Period</button><button className="hidden px-2 py-1.5 text-[10px] text-foreground sm:block">vs Target</button></div></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">{[{
                      label: 'Revenue',
                      value: '€42,800',
                      sub: '86% target'
                    }, {
                      label: 'Leads',
                      value: '1,284',
                      sub: '86% target'
                    }, {
                      label: 'Customers',
                      value: '184',
                      sub: '+22%'
                    }, {
                      label: 'Conversion',
                      value: '14.3%',
                      sub: '+2.1%'
                    }, {
                      label: 'ROI',
                      value: '4.8x',
                      sub: 'Strong'
                    }].map(metric => <div key={metric.label}><span className="text-[10px] text-muted-foreground">{metric.label}</span><strong className="mt-1 block text-sm text-foreground">{metric.value}</strong><span className="text-[10px] text-muted-foreground">{metric.sub}</span></div>)}</div><div className="mt-4 rounded-lg border border-border bg-[var(--secondary)] p-3"><svg viewBox="0 0 760 170" className="h-[170px] w-full" role="img" aria-label="Revenue and leads performance chart"><path d="M20 140 H740 M20 100 H740 M20 60 H740 M20 20 H740" stroke="var(--muted-foreground)" strokeWidth="1" /><path d="M20 133 C100 128,105 118,160 120 S245 90,300 98 S385 75,450 78 S540 48,600 55 S690 30,740 34" fill="none" stroke="var(--chart-2)" strokeWidth="3" /><path d="M20 148 C80 146,120 139,170 141 S260 126,315 130 S390 112,450 117 S540 100,600 102 S690 78,740 82" fill="none" stroke="var(--chart-4)" strokeWidth="3" /><circle cx="740" cy="34" r="4" fill="var(--chart-2)" /><circle cx="740" cy="82" r="4" fill="var(--chart-4)" /><text x="20" y="164" fill="var(--muted-foreground)" fontSize="10">Jun 01</text><text x="350" y="164" fill="var(--muted-foreground)" fontSize="10">Jun 23</text><text x="690" y="164" fill="var(--muted-foreground)" fontSize="10">Jul 15</text></svg><div className="flex justify-center gap-5 text-[10px] text-muted-foreground"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Revenue</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Leads</span></div></div></div>
                  <div className="mt-6"><h3 className="text-sm font-semibold text-foreground">Channel performance</h3><div className="mt-3 grid gap-3 sm:grid-cols-2">{channels.map(channel => <div key={channel.name} className="rounded-lg border border-border bg-[var(--secondary)]/70 p-3"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs font-medium text-foreground"><span className={`grid h-7 w-7 place-items-center rounded-lg bg-${channel.tone}-400/10 text-${channel.tone}-300`}><channel.icon size={14} /></span>{channel.name}</span>{channel.name === 'Paid Advertising' && <span className="text-[10px] text-chart-1">⚠ Declining</span>}</div><div className="mt-3 grid grid-cols-3 gap-2"><div><span className="block text-[10px] text-muted-foreground">Revenue</span><strong className="text-xs text-chart-4">{channel.revenue}</strong></div><div><span className="block text-[10px] text-muted-foreground">Leads</span><strong className="text-xs text-foreground">{channel.leads}</strong></div><div><span className="block text-[10px] text-muted-foreground">{channel.name === 'Paid Advertising' ? 'ROI' : 'Conversion'}</span><strong className="text-xs text-foreground">{channel.conversion}</strong></div></div></div>)}</div></div>
                  <div className="mt-6"><h3 className="text-sm font-semibold text-foreground">Campaign funnel</h3><div className="mt-3 flex flex-col gap-1.5">{funnel.map((stage, funnelIndex) => <div key={stage.label} className="flex items-center gap-3"><span className="w-[105px] shrink-0 text-[11px] text-muted-foreground">{stage.label}</span><div className="h-7 flex-1 overflow-hidden rounded-r-md bg-gradient-to-r from-secondary/50 to-secondary/20" style={{
                        width: `${100 - funnelIndex * 8}%`
                      }}><span className="flex h-full items-center px-3 text-[11px] font-medium text-foreground">{stage.value}</span></div><span className="w-[105px] text-right text-[10px] text-muted-foreground">{stage.detail}</span></div>)}</div></div>
                </article>
              </div>
              <aside className="space-y-4"><section className="overflow-hidden rounded-xl border border-border/20 bg-[var(--card)]"><div className="border-b border-border/15 bg-gradient-to-r from-secondary/25 to-secondary/10 p-4"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-sm font-semibold text-foreground"><Bot size={17} className="text-foreground" />Lulu AI campaign insights</h2><Sparkles size={16} className="text-foreground" /></div><span className="mt-2 block text-[10px] text-foreground/70">AI-generated · Updated 4 min ago</span></div><div className="space-y-2 p-3">{insightCards.map(insight => <article key={insight.title} className="rounded-lg border border-border bg-secondary p-3"><div className="flex items-start justify-between gap-3"><div><h3 className="text-xs font-medium leading-5 text-foreground">{insight.title}</h3><p className="mt-1 text-[11px] leading-4 text-muted-foreground">{insight.body}</p></div><span className={`shrink-0 rounded-full bg-${insight.color}-400/10 px-2 py-1 text-[9px] text-${insight.color}-300`}>{insight.impact}</span></div><button onClick={() => notify('Insight details opened')} className="mt-3 text-[10px] font-medium text-foreground hover:text-foreground">View insight →</button></article>)}</div></section><section className="rounded-xl border border-border bg-secondary p-4"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-foreground">AI campaign optimization</h2><WandSparkles size={16} className="text-foreground" /></div><div className="mt-3 space-y-3">{['Reallocate 15% of paid budget to email — projected +€3,200 revenue', 'Expand audience to “Growth Leaders” segment — high affinity match', 'Refresh landing page CTA — conversion below email benchmark'].map((recommendation, recommendationIndex) => <article key={recommendation} className="border-b border-border pb-3 last:border-0 last:pb-0"><span className="mb-2 inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-1 text-[9px] text-foreground"><Sparkles size={10} /> AI recommendation · {recommendationIndex === 0 ? 'High' : 'Medium'}</span><p className="text-xs leading-5 text-foreground">{recommendation}</p><div className="mt-2 flex gap-3"><button onClick={() => notify('Recommendation applied')} className="text-[10px] font-semibold text-foreground">{recommendationIndex === 2 ? 'Create Task' : 'Apply'}</button><button onClick={() => notify('Review opened')} className="text-[10px] text-foreground">Review</button></div></article>)}</div></section><section className="rounded-xl border border-border bg-secondary p-4"><h2 className="text-sm font-semibold text-foreground">Campaign risks</h2><div className="mt-3 space-y-2"><div className="rounded-lg border border-chart-1/20 bg-chart-1/[0.06] p-3"><div className="flex gap-2"><CircleAlert size={15} className="shrink-0 text-chart-1" /><p className="text-xs leading-5 text-chart-1">Paid advertising efficiency declined 18% in past 7 days</p></div><span className="mt-2 block text-[10px] text-chart-1/70">High severity · €4,200 projected loss</span></div><div className="rounded-lg border border-chart-5/15 bg-chart-5/[0.05] p-3"><div className="flex gap-2"><ArrowDownRight size={15} className="shrink-0 text-chart-5" /><p className="text-xs leading-5 text-chart-5">Campaign conversion is 14% below initial target</p></div><span className="mt-2 block text-[10px] text-chart-5/70">Medium severity</span></div></div></section><section className="rounded-xl border border-border bg-secondary p-4"><h2 className="text-sm font-semibold text-foreground">Recent campaign alerts</h2><div className="mt-3 space-y-3 text-xs"><p className="flex gap-2 text-foreground"><CircleAlert size={14} className="shrink-0" /><span>Conversion rate decreased 12% <small className="block mt-1 text-[10px] text-muted-foreground">Jul 5, 2025</small></span></p><p className="flex gap-2 text-foreground"><Check size={14} className="shrink-0" /><span>Revenue exceeded 85% of target <small className="block mt-1 text-[10px] text-muted-foreground">Jul 3, 2025</small></span></p></div></section></aside>
            </div>
          </div>
        </section>
      </div>
      {createOpen && <aside className="fixed right-0 top-0 z-40 flex h-full w-full max-w-[520px] flex-col border-l border-border bg-[var(--sidebar)] shadow-2xl shadow-black/50"><div className="flex items-center justify-between border-b border-border p-5"><div><span className="text-[10px] uppercase tracking-[0.18em] text-foreground">Campaign builder</span><h2 className="mt-1 text-xl font-semibold text-foreground">Create campaign</h2></div><button onClick={() => setCreateOpen(false)} className="rounded-lg p-2 text-foreground hover:bg-secondary hover:text-foreground" aria-label="Close drawer"><X size={19} /></button></div><div className="border-b border-border p-5"><div className="flex items-center justify-between">{['Info', 'Goal', 'Audience', 'Channels', 'Schedule', 'Budget', 'Review'].map((step, stepIndex) => <div key={step} className="flex flex-col items-center gap-2"><span className={`grid h-7 w-7 place-items-center rounded-full text-[10px] ${stepIndex === 0 ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground'}`}>{stepIndex + 1}</span><span className="hidden text-[9px] text-muted-foreground sm:block">{step}</span></div>)}</div></div><div className="flex-1 space-y-5 overflow-y-auto p-5"><div><label className="mb-2 block text-xs font-medium text-foreground">Campaign name</label><input defaultValue="Summer Product Launch" className="w-full rounded-lg border border-border bg-[var(--secondary)] px-3 py-3 text-sm text-foreground outline-none focus:border-border/60" /></div><div><label className="mb-2 block text-xs font-medium text-foreground">Description</label><textarea defaultValue="Multi-channel product launch targeting high-value customers across digital channels" className="h-24 w-full resize-none rounded-lg border border-border bg-[var(--secondary)] px-3 py-3 text-sm text-foreground outline-none focus:border-border/60" /></div><div><label className="mb-2 block text-xs font-medium text-foreground">Campaign type</label><button className="flex w-full items-center justify-between rounded-lg border border-border bg-[var(--primary)] px-3 py-3 text-sm text-primary-foreground">Product Launch <ChevronDown size={15} className="text-muted-foreground" /></button></div><div><label className="mb-2 block text-xs font-medium text-foreground">Channels</label><div className="grid grid-cols-2 gap-2">{['Email', 'Content', 'SEO', 'GEO', 'AEO', 'Organic Social', 'Paid Advertising', 'CRM', 'Automation'].map(channel => <button key={channel} className={`flex items-center gap-2 rounded-lg border px-3 py-3 text-xs ${['Email', 'Content', 'Organic Social', 'Paid Advertising'].includes(channel) ? 'border-border/35 bg-secondary/10 text-primary-foreground' : 'border-border bg-[var(--primary)] text-muted-foreground'} text-primary-foreground`}><span className="grid h-4 w-4 place-items-center rounded border border-current">{['Email', 'Content', 'Organic Social', 'Paid Advertising'].includes(channel) && <Check size={11} />}</span>{channel}</button>)}</div></div></div><div className="flex gap-2 border-t border-border p-5"><button onClick={() => {
          setCreateOpen(false);
          notify('Campaign saved as draft');
        }} className="flex-1 rounded-lg border border-border px-4 py-3 text-sm text-foreground">Save Draft</button><button onClick={() => {
          setCreateOpen(false);
          notify('Campaign created successfully');
        }} className="flex-1 rounded-lg bg-gradient-to-r from-primary to-primary px-4 py-3 text-sm font-semibold text-primary-foreground">Create Campaign</button></div></aside>}
      {toast && <div role="status" className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-border/25 bg-[var(--secondary)] px-4 py-3 text-sm text-foreground shadow-xl"><Check size={15} className="text-foreground" />{toast}</div>}
    </main>;
}
export default LuluCampaigns;

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
