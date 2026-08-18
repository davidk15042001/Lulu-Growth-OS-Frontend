import { useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, Archive, ArrowDown, ArrowUp, BarChart3, Bell, Bot, ChevronDown, CircleAlert, CircleHelp, Download, Ellipsis, FileText, Filter, Gauge, Grid2X2, LayoutDashboard, List, Menu, MoreHorizontal, Plus, RefreshCw, Search, Settings, Sparkles, Target, Users, X, Zap } from 'lucide-react';
type Audience = {
  name: string;
  description: string;
  type: string;
  members: string;
  growth: string;
  value: string;
  engagement: number;
  conversion: string;
  revenue: string;
  campaigns: string;
  source: string;
  updated: string;
  tone: string;
  ai?: boolean;
  risk?: boolean;
  archived?: boolean;
};
const audiences: Audience[] = [];
const navGroups = [{
  label: 'WORKSPACE',
  items: [['Dashboard', LayoutDashboard], ['Company Profile', FileText]]
}, {
  label: 'MARKETING',
  items: [['Campaigns', Target], ['Content', FileText], ['Audiences', Users], ['SEO', Activity], ['GEO', GlobeIcon], ['AEO', Zap]]
}, {
  label: 'AI',
  items: [['AI Assistant', Bot], ['AI Agents', Sparkles], ['AI Insights', Gauge]]
}, {
  label: 'CRM',
  items: [['Contacts', Users], ['Companies', Users], ['Leads', Target], ['Deals', BarChart3]]
}, {
  label: 'SETTINGS',
  items: [['Integrations', Zap], ['Team', Users], ['Billing', FileText]]
}];
function GlobeIcon({
  size = 16
}: {
  size?: number;
}) {
  return <span style={{
    fontSize: size
  }}>◎</span>;
}
const filters = ['Type', 'Lifecycle', 'Value', 'Growth', 'Source', 'Campaign'];
const detailTabs = ['Overview', 'Growth', 'Value', 'Engagement', 'Conversion', 'Composition', 'Behavior', 'AI Insights', 'Opportunities', 'Risks', 'Campaigns', 'Content', 'Activation', 'Members'];
const health: any[][] = [];
export const LuluAudiencesWorkspace = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [activeView, setActiveView] = useState('List');
  const [detailTab, setDetailTab] = useState('Overview');
  const [refreshing, setRefreshing] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [saved, setSaved] = useState('High-Value Audiences');
  const shown = audiences.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));
  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 700);
  };
  const { items: liveAudiences, loading: liveLoading, error: liveError } = useLiveRecords('marketing_audiences');
  const liveEmpty = !liveLoading && !liveError && liveAudiences.length === 0;
  return <div className="min-h-screen bg-card text-[var(--foreground)]" style={{
    fontFamily: 'Inter, sans-serif'
  }}>
  <aside className={`${mobileNav ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-20 w-[220px] flex-col bg-[var(--sidebar)] px-3 py-5 lg:flex`}>
   <div className="mb-8 flex items-center gap-2 px-2"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--primary)] text-sm font-bold text-[var(--primary-foreground)]">L</span><strong className="text-[16px] text-foreground">Lulu AI</strong></div>
   <LuluSectionNavigation activeId="breezily-wood-5980" />
   <div className="flex items-center gap-2 border-t border-[var(--muted-foreground)] pt-4"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] text-xs font-semibold text-foreground">DM</span><div><p className="text-xs font-medium text-foreground">Workspace owner</p><p className="text-[11px] text-[var(--muted-foreground)]">Growth operator</p></div><MoreHorizontal size={15} className="ml-auto text-[var(--muted-foreground)]" /></div>
  </aside>
  {mobileNav && <button aria-label="Close navigation" className="fixed inset-0 z-10 bg-primary/40 lg:hidden" onClick={() => setMobileNav(false)} />} 
  <main className="min-h-screen lg:ml-[220px]">{liveLoading ? <div className="border-b border-border bg-secondary/30 px-4 py-3 text-xs text-muted-foreground sm:px-8">Loading live audiences…</div> : liveError ? <div className="border-b border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive sm:px-8">{liveError}</div> : liveEmpty ? <div className="border-b border-dashed border-border bg-card px-4 py-3 text-xs text-muted-foreground sm:px-8">No live audiences are available yet. Connect your marketing platform or create an audience to begin.</div> : null}
   <header className="flex h-14 items-center justify-between border-b border-[var(--muted-foreground)] bg-[var(--sidebar)] px-4 text-foreground sm:px-7"><div className="flex items-center gap-3"><button className="lg:hidden" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={19} /></button><span className="text-[13px] text-[var(--muted-foreground)]">Marketing</span><span className="text-[var(--muted-foreground)]">/</span><span className="text-[13px] text-foreground">Audiences</span></div><div className="flex items-center gap-2"><button onClick={refresh} aria-label="Refresh" className="rounded p-2 text-[var(--primary-foreground)] hover:bg-[var(--primary)] hover:text-primary-foreground"><RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /></button><button className="hidden px-2 text-[13px] text-[var(--foreground)] sm:block"><Download size={14} className="mr-1 inline" />Export</button><button className="hidden px-2 text-[13px] text-[var(--foreground)] sm:block"><Filter size={14} className="mr-1 inline" />Filter</button><button className="hidden px-2 text-[13px] text-[var(--foreground)] md:block"><Sparkles size={14} className="mr-1 inline" />Discover with Lulu AI</button><button className="rounded-md bg-[var(--primary)] px-3 py-2 text-[13px] font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary)]"><Plus size={14} className="mr-1 inline" />Create Audience</button><Bell size={17} className="ml-2 text-[var(--muted-foreground)]" /><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] text-xs font-semibold">DM</span></div></header>
   <div className="px-4 py-6 sm:px-8">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-bold tracking-tight">Audiences</h1><p className="mt-1 text-sm text-[var(--muted-foreground)]">Understand, segment and activate the audiences that matter most to your business.</p></div><time className="text-xs text-[var(--muted-foreground)]">Last refreshed 14 minutes ago</time></div>
    <section className="grid grid-cols-2 divide-x divide-[var(--background)] rounded-xl border border-[var(--border)] bg-card md:grid-cols-3 xl:grid-cols-6">{[['Total Audiences', '24', 'amber', ''], ['Total Members', '847,340', 'green', '+8.4%'], ['High-Value', '12,840', 'amber', 'Customers'], ['Growing', '9', 'green', '↑'], ['At-Risk', '3', 'red', '!'], ['Active in Campaigns', '16', 'amber', 'Running']].map(([label, value, tone, sub]) => <article key={label} className="px-4 py-3"><p className="text-[11px] uppercase tracking-[.05em] text-[var(--muted-foreground)]">{label}</p><div className="mt-1 flex items-end gap-2"><strong className={`text-[28px] leading-none ${tone === 'amber' ? 'text-[var(--foreground)]' : tone === 'green' ? 'text-[var(--chart-4)]' : tone === 'red' ? 'text-[var(--chart-5)]' : 'text-[var(--foreground)]'}`}>{value}</strong>{sub && <span className={`mb-0.5 rounded-full px-1.5 py-0.5 text-[10px] ${tone === 'red' ? 'bg-chart-5/10 text-[var(--chart-5)]' : tone === 'green' ? 'bg-chart-4/10 text-[var(--chart-4)]' : 'bg-secondary text-[var(--chart-1)]'}`}>{sub}</span>}</div></article>)}</section>
    <div className="my-4 flex items-center gap-3"><span className="text-[11px] font-medium uppercase tracking-[.05em] text-[var(--muted-foreground)]">Audience health</span><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--secondary)]"><span className="block h-full w-[78%] rounded-full bg-[var(--primary)] text-primary-foreground" /></span><span className="text-[11px] text-[var(--muted-foreground)]">78%</span></div>
    <section className="space-y-2"><div className="flex flex-col gap-2 xl:flex-row"><label className="relative flex-1"><Search size={16} className="absolute left-3 top-3 text-[var(--muted-foreground)]" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search audiences..." className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] pl-10 pr-3 text-sm outline-none focus:border-[var(--border)]" /></label><div className="flex flex-wrap gap-1.5">{filters.map(f => <button key={f} className="flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] bg-card px-3 text-xs text-[var(--muted-foreground)] hover:border-[var(--border)]">{f}<ChevronDown size={13} /></button>)}<button className="h-10 rounded-lg border border-dashed border-[var(--border)] px-3 text-xs text-[var(--muted-foreground)]"><Plus size={13} className="mr-1 inline" />More Filters</button></div></div><div className="flex flex-wrap gap-2">{['High-Value Audiences', 'Growing Audiences', 'At-Risk Audiences', 'AI-Generated', 'Not Activated'].map(p => <button key={p} onClick={() => setSaved(p)} className={`rounded-full border px-3 py-1 text-xs ${saved === p ? 'border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)]' : 'border-[var(--border)] text-[var(--muted-foreground)]'}`}>{p}{saved === p && <X size={12} className="ml-1 inline" />}</button>)}</div></section>
    <div className="mt-5 flex items-center gap-5 border-b border-[var(--border)]">{[['List', List], ['Grid', Grid2X2], ['Insights', Sparkles], ['Comparison', BarChart3]].map(([label, Icon]) => <button key={label as string} onClick={() => setActiveView(label as string)} className={`flex items-center gap-1.5 border-b-2 px-1 pb-2 text-[13px] font-medium ${activeView === label ? 'border-[var(--border)] text-[var(--foreground)]' : 'border-transparent text-[var(--muted-foreground)]'}`}><Icon size={14} />{label as string}</button>)}</div>
    <div className="mt-4 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
     <section className="min-w-0 overflow-hidden rounded-xl border border-[var(--border)]">{selected.length > 0 && <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-xs"><strong className="rounded-full bg-[var(--primary)] px-2 py-1 text-primary-foreground">{selected.length} audiences selected</strong>{['Activate', 'Archive', 'Add Campaign', 'Export', 'Duplicate'].map(x => <button key={x} className="rounded border border-[var(--border)] bg-card px-2 py-1 text-[var(--muted-foreground)]">{x}</button>)}<button className="ml-auto text-[var(--foreground)]" onClick={() => setSelected([])}>Deselect all</button></div>}<div className="overflow-x-auto"><table className="w-full min-w-[1260px] text-left"><thead className="bg-[var(--card)] text-[11px] uppercase tracking-[.05em] text-[var(--muted-foreground)]"><tr>{['', 'Audience name', 'Type', 'Members', 'Growth', 'Value', 'Engagement', 'Conversion', 'Revenue', 'Campaigns', 'Source', 'Updated', ''].map((h, i) => <th key={h + i} className={`h-10 px-3 font-medium ${i === 1 ? 'w-[240px]' : ''}`}>{i === 0 ? <input type="checkbox" aria-label="Select all" /> : h}</th>)}</tr></thead><tbody>{shown.map(a => <tr key={a.name} className={`h-14 border-t border-[var(--border)] text-[12px] hover:bg-[var(--card)] ${a.risk ? 'border-l-2 border-l-[var(--chart-5)]' : ''}`}><td className="px-3"><input type="checkbox" checked={selected.includes(a.name)} onChange={() => setSelected(selected.includes(a.name) ? selected.filter(x => x !== a.name) : [...selected, a.name])} aria-label={`Select ${a.name}`} /></td><td className="px-3"><div className="flex items-center gap-1.5"><div><p className="font-semibold text-[var(--foreground)]">{a.name}</p><p className="text-[11px] text-[var(--muted-foreground)]">{a.description}</p></div>{a.ai && <Sparkles size={13} className="text-[var(--chart-1)]" />}{a.risk && <CircleAlert size={13} className="text-[var(--chart-5)]" />}{a.archived && <Archive size={13} className="text-[var(--muted-foreground)]" />}</div></td><td className="px-3"><span className={`rounded px-2 py-1 text-[11px] ${a.tone === 'blue' ? 'bg-secondary text-foreground' : a.tone === 'teal' ? 'bg-secondary text-foreground' : a.tone === 'purple' ? 'bg-secondary text-foreground' : a.tone === 'green' ? 'bg-chart-4/10 text-chart-4' : a.tone === 'orange' ? 'bg-secondary text-foreground' : a.tone === 'indigo' ? 'bg-secondary text-foreground' : 'bg-secondary text-muted-foreground'}`}>{a.type}</span></td><td className="px-3 font-medium">{a.members}</td><td className={`px-3 font-medium ${a.growth.startsWith('-') ? 'text-[var(--chart-5)]' : 'text-[var(--chart-4)]'}`}>{a.growth.startsWith('-') ? <ArrowDown size={12} className="mr-0.5 inline" /> : <ArrowUp size={12} className="mr-0.5 inline" />}{a.growth}</td><td className="px-3"><span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${a.value === 'High' ? 'bg-[var(--chart-4)]' : a.value === 'Medium' ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'}`} />{a.value}</td><td className="px-3"><span className="mr-2 inline-block h-1.5 w-14 rounded-full bg-[var(--secondary)]"><span className={`block h-full rounded-full ${a.engagement < 20 ? 'bg-[var(--destructive)]' : 'bg-[var(--primary)]'}`} style={{
                          width: `${a.engagement}%`
                        }} /></span>{a.engagement}</td><td className="px-3">{a.conversion}</td><td className="px-3 font-medium">{a.revenue}</td><td className="px-3">{a.campaigns}</td><td className="px-3 text-[var(--muted-foreground)]">{a.source}</td><td className="px-3 text-[var(--muted-foreground)]">{a.updated}</td><td className="px-3"><button aria-label={`Actions for ${a.name}`}><Ellipsis size={16} className="text-[var(--muted-foreground)]" /></button></td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3 text-xs text-[var(--muted-foreground)]"><span>1–8 of 24 audiences</span><div className="flex items-center gap-2"><span>Rows per page 8</span><button className="rounded border border-[var(--border)] px-2 py-1">Prev</button><button className="rounded border border-[var(--border)] px-2 py-1 text-[var(--foreground)]">Next</button></div></div></section>
     <aside className="rounded-xl bg-[var(--sidebar)] p-4 text-foreground"><div className="flex items-center justify-between"><h2 className="text-[13px] font-semibold">AI Context</h2><button aria-label="Refresh AI context" className="text-[var(--muted-foreground)]" onClick={refresh}><RefreshCw size={14} /></button></div><div className="mt-5 space-y-5"><div><p className="mb-2 text-[10px] font-medium uppercase tracking-[.08em] text-[var(--foreground)]">Catalog summary</p><p className="text-xs leading-5 text-[var(--foreground)]">Your catalog contains 24 audiences reaching 847,340 members. Value is concentrated in a small group of high-intent customers.</p></div><div><p className="mb-2 text-[10px] font-medium uppercase tracking-[.08em] text-[var(--foreground)]">AI opportunities</p>{['High-value customers underrepresented in active campaigns', 'Growing high-intent visitor segment ready for activation', 'Repeat buyers show strong upsell opportunity'].map((x, i) => <div key={x} className="mb-2 flex gap-2 text-xs"><Sparkles size={13} className="mt-0.5 shrink-0 text-[var(--chart-1)]" /><span>{x}<small className="mt-0.5 block text-[10px] text-[var(--muted-foreground)]">{i + 1}h ago</small></span></div>)}</div><div><p className="mb-2 text-[10px] font-medium uppercase tracking-[.08em] text-[var(--chart-5)]">At-risk audiences</p>{['At-Risk Customers: -8.4% engagement decline', 'Churned Customers: 180d+ inactivity', 'Subscribers: open rate declining'].map(x => <p key={x} className="mb-2 text-xs text-[var(--foreground)]"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--destructive)]" />{x}</p>)}</div><div><p className="mb-2 text-[10px] font-medium uppercase tracking-[.08em] text-[var(--chart-1)]">AI recommendations</p>{['Launch retention campaign for At-Risk Customers', 'Activate High-Intent Visitors in paid campaigns', 'Reactivation flow for Churned Customers'].map((x, i) => <p key={x} className="mb-2 text-xs"><strong className="mr-2 text-[var(--chart-1)]">0{i + 1}</strong>{x}</p>)}</div><div><p className="mb-3 text-[10px] font-medium uppercase tracking-[.08em] text-[var(--muted-foreground)]">Audience health</p>{health.map(([name, value, color]) => <div key={name as string} className="mb-2 flex items-center gap-2 text-[11px] text-[var(--foreground)]"><span className="w-16">{name as string}</span><span className="h-1.5 flex-1 rounded-full bg-[var(--background)]"><span className="block h-full rounded-full" style={{
                      width: `${value}%`,
                      background: color as string
                    }} /></span><span className="w-7 text-right text-[var(--muted-foreground)]">{value}%</span></div>)}</div><div><p className="mb-2 text-[10px] font-medium uppercase tracking-[.08em] text-[var(--foreground)]">AI discovery</p><div className="rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] p-3"><p className="text-xs leading-5"><Sparkles size={14} className="mr-2 inline text-[var(--foreground)]" />Lulu AI has discovered 3 new audience segments based on your CRM data.</p><button className="mt-3 rounded bg-[var(--primary)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--primary-foreground)]">Discover Now</button></div></div></div><p className="mt-6 text-[11px] text-[var(--muted-foreground)]">Validated 14 minutes ago</p></aside>
    </div>
    <section className="mt-7 border-t border-[var(--border)] pt-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2"><h2 className="text-lg font-bold">Audience Detail</h2><span className="text-xs text-[var(--muted-foreground)]">Audiences / High-Value Customers</span></div></div><button aria-label="Close audience detail" className="text-[var(--muted-foreground)]"><X size={18} /></button></div><div className="mt-4 flex gap-5 overflow-x-auto border-b border-[var(--border)]">{detailTabs.map(tab => <button key={tab} onClick={() => setDetailTab(tab)} className={`shrink-0 pb-2 text-[12px] ${detailTab === tab ? 'border-b-2 border-[var(--border)] font-semibold text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}>{tab}</button>)}</div>
     <div className="mt-5 grid gap-4 xl:grid-cols-3"><article className="rounded-xl border border-[var(--border)] p-4"><p className="text-[11px] uppercase tracking-[.05em] text-[var(--muted-foreground)]">Members</p><div className="mt-2 flex items-end gap-2"><strong className="text-[32px] leading-none text-[var(--chart-1)]">12,840</strong><span className="rounded-full bg-chart-4/10 px-2 py-1 text-[11px] text-[var(--chart-4)]">+14.2%</span></div><svg className="mt-4 h-10 w-full" viewBox="0 0 300 40" role="img" aria-label="Member growth sparkline"><path d="M0 35 C35 32 50 27 78 30 S110 14 140 22 S180 8 207 16 S245 6 300 3" fill="none" stroke="var(--chart-1)" strokeWidth="2.5" /></svg><div className="mt-3 flex justify-between text-xs"><span>Engagement <strong className="text-[var(--foreground)]">82/100</strong></span><span>Conversion <strong>11.4%</strong></span></div></article><article className="rounded-xl border border-[var(--border)] p-4"><p className="text-[11px] uppercase tracking-[.05em] text-[var(--muted-foreground)]">Value</p><strong className="mt-2 block text-2xl text-[var(--foreground)]">€428,000</strong><div className="mt-5 grid grid-cols-3 gap-3 text-xs"><span className="text-[var(--muted-foreground)]">Avg/member <b className="mt-1 block text-[var(--foreground)]">€33.30</b></span><span className="text-[var(--muted-foreground)]">Avg order <b className="mt-1 block text-[var(--foreground)]">€148</b></span><span className="text-[var(--muted-foreground)]">Frequency <b className="mt-1 block text-[var(--foreground)]">2.4x/yr</b></span></div></article><article className="rounded-xl bg-[var(--card)] p-4 text-foreground"><p className="text-[10px] font-medium uppercase tracking-[.08em] text-[var(--foreground)]"><Sparkles size={13} className="mr-1 inline" />AI Insights</p>{['This audience generates 3.4x average revenue per customer', 'Engagement has increased 12% over 30 days', 'Strong product affinity detected in Category A'].map(x => <p key={x} className="mt-3 flex gap-2 text-xs leading-4"><span className="flex-1">{x}</span><span className="h-fit rounded bg-[var(--primary)]/15 px-1.5 py-0.5 text-[10px] text-[var(--foreground)]">High</span></p>)}</article></div>
     <article className="mt-4 rounded-xl border border-[var(--border)] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="text-sm font-semibold">Audience Growth</h3><p className="text-xs text-[var(--muted-foreground)]">Members over time</p></div><div className="flex gap-1">{['7D', '30D', '90D', '6M', '12M'].map(x => <button key={x} className={`px-2 py-1 text-xs ${x === '90D' ? 'border-b-2 border-[var(--chart-1)] text-[var(--chart-1)]' : 'text-[var(--muted-foreground)]'}`}>{x}</button>)}</div></div><svg className="mt-4 h-56 w-full" viewBox="0 0 900 220" role="img" aria-label="Audience growth chart from 11200 to 12840 members"><path d="M35 185 H875 M35 135 H875 M35 85 H875 M35 35 H875" stroke="var(--border)" /><path d="M35 185 C150 178 180 160 270 165 S390 125 470 135 S600 92 680 105 S780 50 875 25 L875 185 L35 185Z" fill="var(--chart-1)" fillOpacity=".12" /><path d="M35 185 C150 178 180 160 270 165 S390 125 470 135 S600 92 680 105 S780 50 875 25" fill="none" stroke="var(--chart-1)" strokeWidth="3" /><g fill="var(--muted-foreground)" fontSize="11"><text x="5" y="189">11.2k</text><text x="5" y="139">11.8k</text><text x="5" y="89">12.4k</text><text x="5" y="39">12.8k</text><text x="35" y="207">Apr 01</text><text x="300" y="207">Apr 30</text><text x="575" y="207">May 30</text><text x="820" y="207">Jun 30</text></g></svg></article>
     <div className="mt-4 grid gap-4 xl:grid-cols-2"><article className="rounded-xl border border-[var(--border)] p-4"><h3 className="text-sm font-semibold">Audience Composition</h3><div className="mt-4 flex items-center gap-5"><svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-90" role="img" aria-label="Geography composition donut"><circle cx="60" cy="60" r="42" fill="none" stroke="var(--chart-1)" strokeWidth="18" strokeDasharray="111 153" /><circle cx="60" cy="60" r="42" fill="none" stroke="var(--chart-3)" strokeWidth="18" strokeDasharray="74 190" strokeDashoffset="-111" /><circle cx="60" cy="60" r="42" fill="none" stroke="var(--chart-4)" strokeWidth="18" strokeDasharray="48 216" strokeDashoffset="-185" /><circle cx="60" cy="60" r="42" fill="none" stroke="var(--background)" strokeWidth="18" strokeDasharray="32 232" strokeDashoffset="-233" /></svg><div className="space-y-2 text-xs">{[['DE', '42%', 'var(--foreground)'], ['AT', '28%', 'var(--foreground)'], ['CH', '18%', 'var(--foreground)'], ['Other', '12%', 'var(--foreground)']].map(([x, v, c]) => <p key={x}><span className="mr-2 inline-block h-2 w-2 rounded-full" style={{
                      background: c
                    }} />{x} <strong className="ml-4">{v}</strong></p>)}</div></div><p className="mt-4 text-[11px] uppercase tracking-[.05em] text-[var(--muted-foreground)]">Industry breakdown</p>{[['Technology', 78], ['Retail', 52], ['Services', 36]].map(([x, v]) => <div key={x} className="mt-2 flex items-center gap-2 text-xs"><span className="w-20">{x}</span><span className="h-1.5 flex-1 rounded-full bg-[var(--secondary)]"><span className="block h-full rounded-full bg-[var(--primary)] text-primary-foreground" style={{
                    width: `${v}%`
                  }} /></span></div>)}</article><article className="rounded-xl border border-[var(--border)] p-4"><h3 className="text-sm font-semibold">Audience Activation</h3>{[['Marketing Campaigns', 'Active', 'Synced 2h ago', 'Sync'], ['Advertising', 'Pending', 'Not synced', 'Activate'], ['Analytics', 'Active', 'Synced 1h ago', 'Sync']].map(([name, status, time, action]) => <div key={name} className="flex items-center gap-3 border-b border-[var(--border)] py-4 last:border-0"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--card)]"><Target size={15} className="text-[var(--muted-foreground)]" /></span><div className="flex-1"><p className="text-[13px] font-medium">{name}</p><p className="text-xs text-[var(--muted-foreground)]">{time}</p></div><span className={`rounded-full px-2 py-1 text-[10px] ${status === 'Active' ? 'bg-chart-4/10 text-[var(--chart-4)]' : 'bg-secondary text-[var(--chart-1)]'}`}>{status}</span><button className="rounded border border-[var(--border)] px-2 py-1 text-[11px]">{action}</button></div>)}</article></div>
    </section>
    <footer className="mt-6 flex flex-wrap justify-between gap-2 border-t border-[var(--border)] py-4 text-[11px] text-[var(--muted-foreground)]"><span>Last data refresh: 14 minutes ago</span><span>Data sources: CRM, Shopify, Google Analytics, Website</span></footer>
   </div>
  </main>
 </div>;
};

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
