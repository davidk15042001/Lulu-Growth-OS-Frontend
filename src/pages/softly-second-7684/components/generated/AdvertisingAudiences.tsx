import { useMemo, useState } from 'react';
import { Archive, ArrowDownUp, Bell, Brain, Check, ChevronDown, ChevronRight, CircleHelp, Columns3, Copy, Download, ExternalLink, Filter, Globe2, LayoutDashboard, ListFilter, MoreHorizontal, Plus, RefreshCw, Search, Settings2, SlidersHorizontal, Sparkles, Tags, Trash2, Upload, Users, X, Zap } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type Platform = 'Google Ads' | 'Meta Ads' | 'Microsoft Advertising' | 'LinkedIn Ads' | 'TikTok Ads';
type AudienceStatus = 'Active' | 'Processing' | 'Available' | 'Unavailable' | 'Error';
type Audience = {
  id: string;
  name: string;
  platform: Platform;
  type: string;
  status: AudienceStatus;
  size: string;
  campaigns: number;
  spend: string;
  conversions: string;
  cpa: string;
  roas: string;
  synced: string;
  updated: string;
  quality: string;
  tone: string;
};
type Modal = 'create' | 'sync' | 'duplicate' | 'archive' | 'connect' | 'export' | null;
type PlatformOption = {
  name: Platform;
  mark: string;
  description: string;
  connected: boolean;
};
const platforms: PlatformOption[] = [{
  name: 'Google Ads',
  mark: 'G',
  description: 'Search, YouTube and Display audiences',
  connected: true
}, {
  name: 'Meta Ads',
  mark: 'M',
  description: 'Facebook and Instagram audiences',
  connected: true
}, {
  name: 'Microsoft Advertising',
  mark: 'm',
  description: 'Bing and Microsoft network audiences',
  connected: false
}, {
  name: 'LinkedIn Ads',
  mark: 'in',
  description: 'Professional and company audiences',
  connected: false
}, {
  name: 'TikTok Ads',
  mark: '♪',
  description: 'TikTok engagement audiences',
  connected: false
}];
const audiences: Audience[] = [];
const performance: Array<Record<string, any>> = [];
const usage: Array<Record<string, any>> = [];
const statusStyles: Record<AudienceStatus, string> = {
  Active: 'bg-chart-4/10 text-chart-4 border-chart-4/30',
  Processing: 'bg-secondary text-foreground border-border',
  Available: 'bg-secondary text-foreground border-border',
  Unavailable: 'bg-secondary text-muted-foreground border-border',
  Error: 'bg-chart-5/10 text-chart-5 border-chart-5/30'
};
function PlatformMark({
  platform
}: {
  platform: Platform;
}) {
  const option = platforms.find(item => item.name === platform);
  return <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">{option?.mark}</span>;
}
function ModalPanel({
  modal,
  close,
  selected,
  setModal
}: {
  modal: Modal;
  close: () => void;
  selected: Audience;
  setModal: (modal: Modal) => void;
}) {
  if (!modal) return null;
  const titles: Record<Exclude<Modal, null>, string> = {
    create: 'Create audience',
    sync: 'Sync audience',
    duplicate: 'Duplicate audience',
    archive: 'Archive audience',
    connect: 'Connect a platform',
    export: 'Export audiences'
  };
  return <section className="fixed inset-0 z-30 flex items-end justify-center bg-primary/30 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl">
      <div className="mb-6 flex items-start justify-between"><div><p className="mb-1 text-xs font-semibold uppercase tracking-[.16em] text-foreground">Workspace action</p><h2 id="modal-title" className="text-2xl font-semibold tracking-tight text-foreground">{titles[modal]}</h2></div><button onClick={close} aria-label="Close dialog" className="rounded-lg p-2 text-foreground hover:bg-secondary hover:text-foreground"><X size={18} /></button></div>
      {modal === 'connect' && <div className="space-y-3">{platforms.map(item => <div key={item.name} className="flex items-center gap-3 rounded-xl border border-border p-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">{item.mark}</span><div className="min-w-0 flex-1"><p className="font-medium text-foreground">{item.name}</p><p className="text-sm text-muted-foreground">{item.description}</p></div><button className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground">{item.connected ? 'Connected' : 'Connect'}</button></div>)}</div>}
      {modal === 'create' && <div className="space-y-5"><div className="flex items-center gap-2">{['Platform', 'Type', 'Definition', 'Settings', 'Review'].map((step, i) => <div key={step} className="flex flex-1 items-center gap-2"><span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>{i + 1}</span><span className="hidden text-xs font-medium text-muted-foreground sm:block">{step}</span></div>)}</div><label className="block text-sm font-medium text-foreground">Platform<select className="mt-2 w-full rounded-lg border border-border p-3 text-sm"><option>Google Ads</option><option>Meta Ads</option></select></label><label className="block text-sm font-medium text-foreground">Audience type<select className="mt-2 w-full rounded-lg border border-border p-3 text-sm"><option>Customer List</option><option>Website Visitors</option><option>Lookalike</option><option>Remarketing</option></select></label><p className="rounded-lg bg-secondary p-3 text-sm text-foreground">The audience will show as Processing until the connected platform confirms availability.</p><button className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary">Continue to definition</button></div>}
      {modal === 'sync' && <div className="space-y-4"><div className="rounded-xl border border-border bg-card p-4"><div className="flex items-center gap-3"><PlatformMark platform={selected.platform} /><div><p className="font-semibold text-foreground">{selected.name}</p><p className="text-sm text-muted-foreground">Current status: {selected.status} · Last synchronization: {selected.synced}</p></div></div></div><p className="text-sm leading-6 text-muted-foreground">A sync requests the latest audience state from {selected.platform}. No progress is shown until the platform reports a result.</p><button className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground">Sync audience</button></div>}
      {(modal === 'duplicate' || modal === 'archive' || modal === 'export') && <div className="space-y-4"><p className="text-sm leading-6 text-muted-foreground">{modal === 'duplicate' ? `Copy supported settings from “${selected.name}”. The new audience will require platform confirmation before it can be used.` : modal === 'archive' ? 'The audience will be removed from the active Lulu AI audience workspace. Existing platform usage will not be changed unless explicitly supported and confirmed.' : 'Choose a format and scope for this export. Unsupported metrics will be labeled No Data.'}</p>{modal === 'duplicate' && <input aria-label="New audience name" className="w-full rounded-lg border border-border p-3 text-sm" defaultValue={`${selected.name} · Copy`} />}{modal === 'export' && <div className="flex gap-2">{['CSV', 'Excel', 'PDF'].map(format => <button key={format} className="flex-1 rounded-lg border border-border p-3 text-sm font-medium hover:border-border">{format}</button>)}</div>}<button onClick={close} className={`w-full rounded-lg px-4 py-3 font-semibold text-primary-foreground ${modal === 'archive' ? 'bg-primary' : 'bg-primary'}`}>{modal === 'archive' ? 'Archive audience' : modal === 'export' ? 'Export audiences' : 'Duplicate audience'}</button></div>}
    </div>
  </section>;
}
export function AdvertisingAudiences() {
  const [selectedId, setSelectedId] = useState('');
  const { items: audienceRecords, loading: audiencesLoading, error: audiencesError, refresh: refreshAudiences } = useLiveRecords('ad_audiences');
  const [platform, setPlatform] = useState<'All Platforms' | Platform>('All Platforms');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState<Modal>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const selected = audiences.find(item => item.id === selectedId) ?? audiences[0];
  const visibleAudiences = useMemo(() => audiences.filter(item => (platform === 'All Platforms' || item.platform === platform) && `${item.name} ${item.id} ${item.platform} ${item.type}`.toLowerCase().includes(query.toLowerCase())), [platform, query]);
  const toggleRow = (id: string) => setSelectedRows(rows => rows.includes(id) ? rows.filter(row => row !== id) : [...rows, id]);
  if (audiencesLoading) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground">Loading live audiences…</main>;
  if (audiencesError) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-destructive">{audiencesError}</main>;
  if (audienceRecords.length === 0) return <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10"><div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-border bg-card p-8 text-center"><Users className="mx-auto mb-4 text-muted-foreground" size={28} /><h1 className="text-2xl font-semibold">Audiences</h1><p className="mt-3 text-sm text-muted-foreground">No live advertising audiences are available yet. Connect a verified platform before creating audience records.</p><button type="button" onClick={() => void refreshAudiences()} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-secondary"><RefreshCw size={15} /> Refresh</button></div></main>;
  const liveAudiences = audienceRecords.filter(record => !query || `${record.name} ${record.description ?? ''} ${record.status}`.toLowerCase().includes(query.toLowerCase()));
  return <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10"><div className="mx-auto max-w-6xl"><header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs uppercase tracking-[.18em] text-muted-foreground">Advertising / Audiences</p><h1 className="mt-2 text-3xl font-bold">Audiences</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Verified audience records from the connected workspace. Platform metrics appear only when returned by the backend.</p></div><button type="button" onClick={() => void refreshAudiences()} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-secondary"><RefreshCw size={15} /> Refresh</button></header><section className="overflow-hidden rounded-2xl border border-border bg-card"><div className="border-b border-border p-4"><label className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2"><Search size={15} className="text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search live audiences" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label></div><div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">Audience</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Stage</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Updated</th></tr></thead><tbody className="divide-y divide-border">{liveAudiences.map(record => <tr key={record.id}><td className="px-4 py-3 font-medium">{record.name}</td><td className="px-4 py-3">{record.status}</td><td className="px-4 py-3 text-muted-foreground">{record.stage ?? '—'}</td><td className="max-w-md px-4 py-3 text-muted-foreground">{record.description ?? '—'}</td><td className="px-4 py-3 text-muted-foreground">{new Date(record.updatedAt).toLocaleString()}</td></tr>)}</tbody></table></div></section></div></main>;
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-[var(--sidebar)] px-5 py-6 text-foreground lg:flex"><div className="mb-12 flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-black text-primary-foreground">L</div><span className="text-lg font-semibold tracking-tight text-foreground">LULU AI</span></div><p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">Business OS</p><LuluSectionNavigation activeId="softly-second-7684" /><div className="mt-auto rounded-xl border border-border bg-secondary p-4"><div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"><Sparkles size={15} className="text-foreground" /> Ask Lulu</div><p className="text-xs leading-5 text-muted-foreground">Get a clear read on your advertising performance.</p><button className="mt-3 w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Open assistant</button></div></aside>
    <main className="lg:pl-64"><header className="flex min-h-20 items-center justify-between border-b border-border bg-card px-5 py-4 sm:px-8"><div><p className="text-xs font-medium text-muted-foreground">Advertising <span className="mx-1">/</span> <span className="text-muted-foreground">Audiences</span></p><h1 className="mt-1 text-xl font-semibold tracking-tight">Audiences</h1></div><div className="flex items-center gap-2"><button onClick={() => setModal('export')} className="hidden rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-card sm:flex"><Download size={16} /></button><button aria-label="Notifications" className="rounded-lg border border-border p-2 text-foreground"><Bell size={17} /></button><button onClick={() => setModal('connect')} className="hidden rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground sm:flex">Connect Platform</button><button onClick={() => setModal('create')} className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary"><Plus size={16} /> <span className="hidden sm:inline">Create Audience</span></button></div></header>
      <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8"><div className="mb-7 flex flex-col justify-between gap-4 xl:flex-row xl:items-end"><div><p className="max-w-xl text-sm text-muted-foreground">Manage and optimize the audiences used across your advertising campaigns.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => setModal('sync')} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground"><RefreshCw size={15} /> Sync Audiences</button><button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"><Sparkles size={15} /> Ask Lulu AI</button></div></div>
        <section aria-labelledby="summary-title"><div className="mb-3 flex items-center justify-between"><h2 id="summary-title" className="text-sm font-semibold text-foreground">Audience portfolio</h2><span className="text-xs text-muted-foreground">Connected data only · updated today</span></div><div className="grid grid-cols-2 gap-3 xl:grid-cols-5">{[['Total audiences', '5', 'Across No live data platforms', 'text-foreground'], ['Active audiences', '3', 'Available for delivery', 'text-chart-4'], ['Audiences in use', '4', 'Assigned to campaigns', 'text-foreground'], ['High performing', '3', 'Strong ROAS signals', 'text-foreground'], ['Attention required', '2', 'Errors or limited data', 'text-chart-5']].map(([label, value, note, color]) => <div key={label} className="rounded-xl border border-border bg-card p-4"><p className="text-xs font-medium text-muted-foreground">{label}</p><p className={`mt-2 text-2xl font-semibold tracking-tight ${color}`}>{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></div>)}</div></section>
        <section className="mt-7 rounded-xl border border-border bg-card p-4"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="relative min-w-0 flex-1 lg:max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search audiences..." aria-label="Search audiences" className="w-full rounded-lg border border-border py-2.5 pl-10 pr-4 text-sm outline-none ring-ring placeholder:text-muted-foreground focus:border-border focus:ring-4" /></div><div className="flex items-center gap-2 overflow-x-auto pb-1"><span className="mr-1 shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Platform</span>{['All Platforms', 'Google Ads', 'Meta Ads'].map(item => <button key={item} onClick={() => setPlatform(item as 'All Platforms' | Platform)} className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium ${platform === item ? 'bg-primary text-primary-foreground' : 'border border-border text-foreground hover:bg-card'}`}>{item}</button>)}<button onClick={() => setShowFilters(!showFilters)} className="flex shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground"><SlidersHorizontal size={15} /> Advanced filters</button></div></div>{showFilters && <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-3 lg:grid-cols-5"><label className="text-xs font-semibold text-muted-foreground">Audience type<select className="mt-1.5 w-full rounded-lg border border-border p-2 text-sm font-normal"><option>All types</option><option>Customer List</option><option>Website Visitors</option><option>Lookalike</option></select></label><label className="text-xs font-semibold text-muted-foreground">Status<select className="mt-1.5 w-full rounded-lg border border-border p-2 text-sm font-normal"><option>All statuses</option><option>Active</option><option>Processing</option><option>Error</option></select></label><label className="text-xs font-semibold text-muted-foreground">Usage<select className="mt-1.5 w-full rounded-lg border border-border p-2 text-sm font-normal"><option>All usage</option><option>In Use</option><option>Not Used</option></select></label><label className="text-xs font-semibold text-muted-foreground">Performance<select className="mt-1.5 w-full rounded-lg border border-border p-2 text-sm font-normal"><option>All signals</option><option>High Performing</option><option>Underperforming</option></select></label><div className="flex items-end gap-2"><button className="rounded-lg border border-border p-2 text-sm font-medium text-foreground">Clear</button><button className="rounded-lg bg-secondary p-2 text-sm font-medium text-foreground">Save filter</button></div></div>}</section>
        {selectedRows.length > 0 && <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-secondary px-4 py-3 text-sm"><strong>{selectedRows.length} selected</strong><button className="ml-auto text-foreground">Sync</button><button className="text-foreground">Add Tags</button><button className="text-foreground">Export</button><button className="text-foreground">Archive</button></div>}
        <section className="mt-4 overflow-hidden rounded-xl border border-border bg-card" aria-labelledby="table-title"><div className="flex items-center justify-between border-b border-border px-4 py-4"><div><h2 id="table-title" className="font-semibold">All audiences</h2><p className="mt-1 text-xs text-muted-foreground">{visibleAudiences.length} connected audience records</p></div><button aria-label="Customize columns" className="rounded-lg border border-border p-2 text-foreground"><Columns3 size={17} /></button></div><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="bg-secondary text-[11px] uppercase tracking-wider text-muted-foreground"><tr><th className="w-10 px-4 py-3"><input type="checkbox" aria-label="Select all audiences" onChange={e => setSelectedRows(e.target.checked ? visibleAudiences.map(item => item.id) : [])} /></th>{['Audience', 'Platform', 'Type', 'Status', 'Estimated size', 'Campaigns', 'Spend', 'Conversions', 'CPA', 'ROAS', 'Last synced', ''].map(heading => <th key={heading} className="whitespace-nowrap px-3 py-3 font-semibold">{heading || <span className="sr-only">Actions</span>}</th>)}</tr></thead><tbody className="divide-y divide-border">{visibleAudiences.map(item => <tr key={item.id} onClick={() => setSelectedId(item.id)} className={`cursor-pointer transition hover:bg-secondary/40 ${selectedId === item.id ? 'bg-secondary/60' : ''}`}><td className="px-4 py-4" onClick={e => e.stopPropagation()}><input type="checkbox" checked={selectedRows.includes(item.id)} onChange={() => toggleRow(item.id)} aria-label={`Select ${item.name}`} /></td><td className="px-3 py-4"><div className="flex items-center gap-3"><div className={`h-2 w-2 rounded-full bg-${item.tone}-500`} /><div><p className="whitespace-nowrap font-medium text-foreground">{item.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{item.id}</p></div></div></td><td className="px-3 py-4"><div className="flex items-center gap-2 whitespace-nowrap"><PlatformMark platform={item.platform} />{item.platform}</div></td><td className="whitespace-nowrap px-3 py-4 text-muted-foreground">{item.type}</td><td className="px-3 py-4"><span className={`rounded-full border px-2 py-1 text-xs font-medium ${statusStyles[item.status]}`}>{item.status}</span></td><td className="px-3 py-4 font-medium text-foreground">{item.size}</td><td className="px-3 py-4 text-muted-foreground">{item.campaigns || '—'}</td><td className="px-3 py-4 text-muted-foreground">{item.spend}</td><td className="px-3 py-4 text-muted-foreground">{item.conversions}</td><td className="px-3 py-4 text-muted-foreground">{item.cpa}</td><td className="px-3 py-4 font-semibold text-foreground">{item.roas}</td><td className="whitespace-nowrap px-3 py-4 text-xs text-muted-foreground">{item.synced}</td><td className="px-3 py-4"><button aria-label={`More actions for ${item.name}`} className="rounded p-1 text-foreground hover:bg-secondary"><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div>{visibleAudiences.length === 0 && <div className="p-12 text-center"><p className="font-semibold">No audiences found</p><p className="mt-1 text-sm text-muted-foreground">Try clearing your search or filters.</p><button onClick={() => {
              setQuery('');
              setPlatform('All Platforms');
            }} className="mt-4 text-sm font-semibold text-foreground">Clear filters</button></div>}<div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground"><span>Showing {visibleAudiences.length} of 5 audiences</span><div className="flex items-center gap-2"><button disabled className="rounded border border-border px-2 py-1 text-foreground">Previous</button><span className="rounded bg-primary px-2 py-1 text-primary-foreground">1</span><button className="rounded border border-border px-2 py-1">Next</button></div></div></section>
        <section className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><div className="rounded-xl border border-border bg-card p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div className="flex items-start gap-3"><PlatformMark platform={selected.platform} /><div><p className="text-xs font-medium text-muted-foreground">Selected audience</p><h2 className="mt-1 text-xl font-semibold tracking-tight">{selected.name}</h2><p className="mt-1 text-sm text-muted-foreground">{selected.platform} · {selected.type} · <span className="font-medium text-foreground">{selected.status}</span></p></div></div><div className="flex flex-wrap gap-2"><button onClick={() => setModal('sync')} className="rounded-lg border border-border px-3 py-2 text-sm font-medium">Sync</button><button onClick={() => setModal('duplicate')} className="rounded-lg border border-border px-3 py-2 text-sm font-medium">Duplicate</button><button onClick={() => setModal('archive')} className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground">Archive</button></div></div><div className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-4 sm:grid-cols-4"><div><p className="text-xs text-muted-foreground">Audience size</p><p className="mt-1 font-semibold">{selected.size}</p></div><div><p className="text-xs text-muted-foreground">Created date</p><p className="mt-1 font-semibold">Not available, 2025</p></div><div><p className="text-xs text-muted-foreground">Last synced</p><p className="mt-1 font-semibold">{selected.synced}</p></div><div><p className="text-xs text-muted-foreground">Last updated</p><p className="mt-1 font-semibold">{selected.updated}</p></div></div><div className="mt-5 flex items-center justify-between"><h3 className="font-semibold">Performance · last 30 days</h3><select className="rounded-lg border border-border px-2 py-1.5 text-xs"><option>All campaigns</option></select></div><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{performance.map(item => <div key={item.label} className="rounded-lg bg-secondary p-3"><p className="text-xs text-muted-foreground">{item.label}</p><p className="mt-1 text-lg font-semibold">{item.value}</p><p className="mt-1 text-[11px] text-muted-foreground">{item.note}</p></div>)}</div></div><div className="rounded-xl border border-border bg-card p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Audience quality</h2><p className="mt-1 text-xs text-muted-foreground">Platform-provided signals only</p></div><span className="rounded-full bg-secondary px-2 py-1 text-xs font-semibold text-foreground">{selected.quality}</span></div><div className="mt-5 space-y-4">{[['Audience size', selected.size], ['Match rate', selected.id === 'aud_7F2A91' ? '82%' : 'No Data'], ['Availability', selected.status], ['Data freshness', selected.synced], ['Conversion quality', selected.quality]].map(([label, value]) => <div key={label} className="flex items-center justify-between border-b border-border pb-3 text-sm"><span className="text-muted-foreground">{label}</span><strong className="text-foreground">{value}</strong></div>)}</div><div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">Retargeting</span><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">High Value</span><button className="rounded-full border border-dashed border-border px-2.5 py-1 text-xs font-medium text-foreground">+ Add tag</button></div></div></section>
        <section className="mt-6 grid gap-5 xl:grid-cols-3"><div className="rounded-xl border border-border bg-secondary/50 p-5 xl:col-span-2"><div className="flex items-start gap-3"><div className="rounded-lg bg-primary p-2 text-primary-foreground"><Brain size={18} /></div><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">Lulu AI Audience Analysis</h2><span className="rounded-full bg-card px-2 py-0.5 text-[11px] font-semibold text-foreground">AI-generated</span></div><p className="mt-1 text-xs text-muted-foreground">Observed + AI Inferred · connected advertising data · Today, 9:45 AM · Confidence: High</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-lg bg-card p-3"><p className="text-xs text-muted-foreground">Performance</p><p className="mt-2 text-sm font-semibold">Stronger ROAS than account average</p><p className="mt-2 text-xs text-chart-4">Observed · — vs account</p></div><div className="rounded-lg bg-card p-3"><p className="text-xs text-muted-foreground">Campaign usage</p><p className="mt-2 text-sm font-semibold">Used across 4 campaigns</p><p className="mt-2 text-xs text-muted-foreground">Observed · Google Ads</p></div><div className="rounded-lg bg-card p-3"><p className="text-xs text-muted-foreground">Opportunity</p><p className="mt-2 text-sm font-semibold">Test increased allocation</p><p className="mt-2 text-xs text-foreground">AI Inferred · no live changes</p></div></div></div><div className="rounded-xl border border-chart-5/30 bg-card p-5"><div className="flex items-center gap-2"><Bell size={17} className="text-chart-5" /><h2 className="font-semibold">Audience risks</h2></div><div className="mt-4 space-y-3"><div className="rounded-lg bg-chart-5/10 p-3"><div className="flex justify-between"><span className="text-sm font-medium text-chart-5">Sync failure</span><span className="text-xs font-semibold text-chart-5">High</span></div><p className="mt-1 text-xs leading-5 text-chart-5">Cart abandoners · 14d is unavailable. Meta Ads reported an error yesterday.</p><button onClick={() => setModal('sync')} className="mt-2 text-xs font-semibold text-chart-5">Review risk <ChevronRight className="inline" size={13} /></button></div><div className="rounded-lg bg-chart-1/10 p-3"><div className="flex justify-between"><span className="text-sm font-medium text-chart-1">Overlap detected</span><span className="text-xs font-semibold text-foreground">Medium</span></div><p className="mt-1 text-xs leading-5 text-foreground">No sufficient platform data to estimate overlap.</p></div></div></div></section>
        <section className="mt-6 rounded-xl border border-border bg-card p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Campaign usage</h2><p className="mt-1 text-xs text-muted-foreground">Campaigns currently using {selected.name}</p></div><button className="flex items-center gap-1 text-sm font-semibold text-foreground">View all <ExternalLink size={14} /></button></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="text-xs text-muted-foreground"><tr>{['Campaign', 'Platform', 'Status', 'Spend', 'Conversions', 'CPA', 'ROAS', ''].map(heading => <th key={heading} className="border-b border-border px-3 py-3 font-medium">{heading}</th>)}</tr></thead><tbody>{usage.map(item => <tr key={item.campaign} className="border-b border-border"><td className="px-3 py-3 font-medium">{item.campaign}</td><td className="px-3 py-3 text-muted-foreground">{item.platform}</td><td className="px-3 py-3"><span className="rounded-full bg-secondary px-2 py-1 text-xs text-foreground">{item.status}</span></td><td className="px-3 py-3 text-muted-foreground">{item.spend}</td><td className="px-3 py-3 text-muted-foreground">{item.conversions}</td><td className="px-3 py-3 text-muted-foreground">{item.cpa}</td><td className="px-3 py-3 font-semibold">{item.roas}</td><td className="px-3 py-3"><button className="text-xs font-semibold text-foreground">View campaign</button></td></tr>)}</tbody></table></div></section>
      </div>
    </main><ModalPanel modal={modal} close={() => setModal(null)} selected={selected} setModal={setModal} />
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
