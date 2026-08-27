import { useMemo, useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertCircle, AlertTriangle, Bookmark, Brain, Building2, BriefcaseBusiness, CheckSquare, ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, CircleDollarSign, Download, ExternalLink, FileSpreadsheet, Globe2, GitBranch, Layers, LayoutDashboard, MoreHorizontal, Plus, Search, SearchX, Settings, SlidersHorizontal, Sparkles, Upload, UserPlus, Users, X, Zap, CloudUpload, Menu, TrendingUp, Pencil } from 'lucide-react';
type Company = {
  id: number;
  name: string;
  industry: string;
  city: string;
  country: string;
  contacts: number;
  deals: number;
  revenue: string;
  owner: string;
  initials: string;
  type: 'Customer' | 'Prospect' | 'Partner' | 'Supplier';
  status: 'Active' | 'Inactive' | 'Archived';
  activity: string;
  color: string;
  domain: string;
};
const companies: Company[] = [];
const navItems = [['CRM', LayoutDashboard], ['Contacts', Users], ['Companies', Building2], ['Leads', UserPlus], ['Deals', CircleDollarSign], ['Pipeline', GitBranch], ['Activities', Activity], ['Tasks', CheckSquare], ['Customer Segments', Layers], ['Customer Intelligence', Brain]] as const;
const filters = ['Company Type', 'Status', 'Industry', 'Owner', 'Revenue Range', 'Company Size', 'Location', 'Created Date', 'Last Activity', 'Tags'];
const savedFilters = ['My Companies', 'Enterprise Customers', 'At Risk Accounts', 'High Revenue'];
const typeClass: Record<string, string> = {
  Customer: 'text-foreground bg-secondary/15',
  Prospect: 'text-chart-1 bg-chart-1/15',
  Partner: 'text-foreground bg-secondary/15',
  Supplier: 'text-foreground bg-secondary/15'
};
type KpiItem = {
  label: string;
  value: string;
  Icon: typeof Building2;
  trend: string;
};
const kpis: KpiItem[] = [];
export const LuluCompanies = () => {
  const { items: liveRecords, loading: liveLoading, error: liveError } = useLiveRecords('crm_companies');
  const liveCompanies: Company[] = liveRecords.map((record, index) => {
    const fields = record as unknown as Record<string, unknown>;
    const name = record.name || String(fields.companyName ?? 'Unnamed company');
    const initials = name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
    return { id: index + 1, name, industry: String(fields.industry ?? '—'), city: String(fields.city ?? '—'), country: String(fields.country ?? '—'), contacts: Number(fields.contacts ?? 0), deals: Number(fields.deals ?? 0), revenue: record.valueAmount ?? '—', owner: String(fields.owner ?? '—'), initials, type: (String(fields.type ?? 'Prospect') as Company['type']), status: (String(record.status ?? 'Active') as Company['status']), activity: String(fields.activity ?? '—'), color: 'var(--foreground)', domain: String(fields.domain ?? '—') };
  });
  const companiesForView = liveLoading ? [] : liveCompanies;
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [preview, setPreview] = useState<Company | null>(null);
  const [modal, setModal] = useState<'create' | 'edit' | 'delete' | 'import' | 'export' | null>(null);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [view, setView] = useState<'table' | 'compact' | 'cards'>('table');
  const [showSearch, setShowSearch] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const filtered = useMemo(() => companiesForView.filter(c => `${c.name} ${c.domain} ${c.industry} ${c.city}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const allSelected = selected.length === filtered.length && filtered.length > 0;
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map(c => c.id));
  const toggleRow = (id: number) => setSelected(items => items.includes(id) ? items.filter(item => item !== id) : [...items, id]);
  return <div className="min-h-screen bg-[var(--background)] text-foreground font-sans selection:bg-secondary/30">
      <a href="#companies-content" className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:m-3 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2">Skip to content</a>
      <aside className={`${mobileNav ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-[var(--sidebar)] transition-transform duration-150`}>
        <div className="flex h-20 items-center gap-3 px-5"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground shadow-lg shadow-black/20">L</div><span className="text-lg font-semibold tracking-tight text-foreground">Lulu AI</span></div>
        <div className="px-3"><div className="mb-3 flex items-center gap-3 px-3"><span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">CRM</span><span className="h-px flex-1 bg-secondary" /></div>
          <LuluSectionNavigation activeId="kindly-pool-8785" />
          <div className="my-5 flex items-center gap-3 px-3"><span className="h-px flex-1 bg-secondary" /><span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Workspace</span></div><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary hover:text-foreground"><Settings size={17} className="text-muted-foreground" /><span>Settings</span></button>
        </div><div className="mt-auto border-t border-border p-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-xs font-semibold text-foreground">JD</div><div className="min-w-0"><p className="truncate text-sm font-medium text-foreground">Workspace member</p><p className="text-xs text-muted-foreground">CRM Manager</p></div><span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-chart-4" /></div><p className="mt-3 pl-12 text-[11px] text-chart-4">AI Active</p></div>
      </aside>
      <main id="companies-content" className="lg:pl-60">
    {liveError && <div className="mx-5 mt-4 rounded-lg border border-chart-5/30 bg-chart-5/5 px-4 py-3 text-sm text-chart-5">{liveError}</div>}
    {!liveLoading && liveCompanies.length === 0 && <></>}<header className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6 lg:hidden"><button onClick={() => setMobileNav(true)} aria-label="Open navigation" className="rounded-md p-2 text-foreground hover:bg-secondary"><Menu size={20} /></button><span className="font-semibold text-foreground">Companies</span><button onClick={() => setModal('create')} aria-label="Create company" className="rounded-md bg-primary p-2 text-primary-foreground"><Plus size={18} /></button></header>
        <div className="mx-auto max-w-[1600px] px-4 py-7 sm:px-6 lg:px-8"><div className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground"><span>Lulu AI</span><ChevronRight size={13} /><span>CRM</span><ChevronRight size={13} /><span className="text-muted-foreground">Companies</span></div><h1 className="text-3xl font-semibold tracking-tight text-foreground">Companies</h1><p className="mt-2 text-sm text-muted-foreground">Manage the organizations, accounts and business relationships connected to your company.</p></div><div className="flex gap-2"><button onClick={() => setModal('import')} className="flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm text-foreground transition-colors duration-150 hover:border-border hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Upload size={16} />Import</button><button onClick={() => setModal('export')} className="flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm text-foreground transition-colors duration-150 hover:border-border hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Download size={16} />Export</button><button onClick={() => setModal('create')} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Plus size={17} />Create Company</button></div></div>
          <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{(liveLoading ? [] : kpis).map(({
            label,
            value,
            Icon,
            trend
          }) => <div key={String(label)} className="rounded-xl border border-border bg-[var(--secondary)] px-4 py-4 transition-colors duration-150 hover:border-border"><div className="flex items-center justify-between"><p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p><Icon size={16} className={label === 'Requiring Attention' ? 'text-chart-5' : label === 'Customers' ? 'text-foreground' : 'text-muted-foreground'} /></div><p className="mt-2 text-2xl font-semibold text-foreground">{value}</p><p className={`mt-1 text-xs ${label === 'New Companies' ? 'text-chart-4' : label === 'Active Companies' ? 'text-chart-4' : label === 'Prospects' ? 'text-chart-1' : label === 'Requiring Attention' ? 'text-chart-5' : 'text-muted-foreground'}`}>{label === 'Active Companies' ? '● Active' : trend || ' '}</p></div>)}</section>
          <div className="relative mb-4"><Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} /><input value={query} onFocus={() => setShowSearch(true)} onChange={e => setQuery(e.target.value)} placeholder="Search companies... (Name, Domain, Industry, Location, ID)" className="h-12 w-full rounded-xl border border-border bg-[var(--secondary)] pl-11 pr-16 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-border/60 focus:ring-2 focus:ring-ring/20" /><kbd className="absolute right-4 top-3 rounded-md bg-card/60 px-2 py-1 text-[11px] text-muted-foreground">⌘K</kbd>{showSearch && !query && <div className="absolute left-0 right-0 top-14 z-20 rounded-xl border border-border bg-[var(--secondary)] p-4 shadow-2xl"><p className="mb-2 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Recent searches</p><div className="flex gap-2">{([] as string[]).map(item => <button key={item} onClick={() => {
                setQuery(item);
                setShowSearch(false);
              }} className="rounded-md bg-secondary px-3 py-2 text-xs text-foreground hover:bg-secondary/15">{item}</button>)}</div><p className="mb-2 mt-4 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Suggestions</p><button onClick={() => {
              setQuery('Nexus');
              setShowSearch(false);
            }} className="flex items-center gap-3 text-sm text-foreground"><Building2 size={16} className="text-foreground" /><span>No recent company result</span></button></div>}</div>
          <div className="mb-5 flex flex-wrap items-center gap-2"><button className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground hover:bg-secondary"><SlidersHorizontal size={16} />Filters</button>{filters.map(item => <button key={item} onClick={() => setFilter(filter === item ? null : item)} className={`flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs transition-colors duration-150 ${filter === item ? 'border-border/40 bg-secondary/20 text-foreground' : 'border-border text-foreground hover:border-border hover:text-foreground'}`}>{item}<ChevronDown size={13} /></button>)}{filter && <button onClick={() => setFilter(null)} className="text-xs text-foreground hover:text-foreground">Clear Filters</button>}<button className="ml-auto flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-foreground hover:text-foreground"><Bookmark size={14} />Save Filter</button></div>
          <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-border pb-4"><span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Saved</span>{savedFilters.map(item => <button key={item} className="rounded-md bg-secondary px-2.5 py-1.5 text-xs text-foreground hover:bg-secondary/10 hover:text-foreground">{item}</button>)}<div className="ml-auto flex items-center gap-2"><div className="flex rounded-lg border border-border p-0.5">{[['table', FileSpreadsheet], ['compact', ChevronsUpDown], ['cards', Layers]].map(([key, Icon]) => <button key={String(key)} onClick={() => setView(key as typeof view)} aria-label={`${key} view`} className={`rounded-md p-1.5 ${view === key ? 'bg-secondary/20 text-foreground' : 'text-foreground hover:text-foreground'}`}><Icon size={15} /></button>)}</div><button className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-foreground"><SlidersHorizontal size={14} />Columns</button></div></div>
          <div className="relative overflow-hidden rounded-xl border border-border bg-[var(--secondary)]">{selected.length > 0 && <div className="flex flex-wrap items-center gap-3 border-b border-border/30 bg-[var(--card)] px-4 py-3 text-xs"><span className="font-medium text-foreground">{selected.length} companies selected</span><button onClick={() => setSelected([])} aria-label="Deselect all" className="text-foreground hover:text-foreground"><X size={14} /></button>{['Assign Owner', 'Add Tag', 'Change Status', 'Add to Segment', 'Export', 'Archive'].map(item => <button key={item} className="rounded-md px-2 py-1 text-foreground hover:bg-secondary hover:text-foreground">{item}</button>)}<button onClick={() => setModal('delete')} className="ml-auto rounded-md px-2 py-1 text-chart-5 hover:bg-chart-5/10">Delete</button></div>}
            {view === 'cards' ? <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(company => <article key={company.id} onClick={() => setPreview(company)} className="cursor-pointer rounded-xl border border-border bg-[var(--card)] p-4 hover:border-border"><div className="flex items-start gap-3"><div style={{
                  backgroundColor: company.color
                }} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-lg font-semibold text-foreground">{company.name[0]}</div><div className="min-w-0"><h3 className="truncate font-semibold text-foreground">{company.name}</h3><p className="mt-1 text-xs text-muted-foreground">{company.industry} · {company.city}</p></div></div><div className="mt-5 flex items-center justify-between text-xs"><span className="text-muted-foreground"><Users size={13} className="mr-1 inline" />{company.contacts} contacts</span><span className="font-medium text-foreground">{company.revenue}</span></div><div className="mt-4 flex items-center justify-between"><span className={`rounded-md px-2 py-1 text-[11px] ${typeClass[company.type]}`}>{company.type}</span><span className="text-xs text-foreground">● {company.status}</span></div><p className="mt-3 text-xs text-muted-foreground">Last activity: {company.activity}</p></article>)}</div> : <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="bg-[var(--card)] text-[10px] uppercase tracking-[0.1em] text-muted-foreground"><tr><th scope="col" className="w-10 px-4 py-3"><input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all companies" className="accent-primary" /></th>{[['Company', true], ['Industry', false], ['Location', false], ['Contacts', false], ['Open Deals', false], ['Revenue', false], ['Owner', false], ['Status', false], ['Last Activity', false]].map(([label, active]) => <th key={String(label)} scope="col" aria-sort={active ? 'ascending' : 'none'} className={`whitespace-nowrap px-3 py-3 ${label === 'Contacts' || label === 'Open Deals' ? 'text-center' : ''} ${label === 'Revenue' ? 'text-right' : ''}`}>{label} <ChevronsUpDown size={12} className={active ? 'ml-1 inline text-foreground' : 'ml-1 inline text-foreground'} /></th>)}<th scope="col" className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-white/[0.05]">{filtered.map(company => <tr key={company.id} onClick={() => setPreview(company)} className={`cursor-pointer transition-colors duration-150 hover:bg-secondary ${selected.includes(company.id) ? 'bg-secondary/[0.08]' : ''}`}><td className="px-4 py-3"><input type="checkbox" checked={selected.includes(company.id)} onClick={e => e.stopPropagation()} onChange={() => toggleRow(company.id)} aria-label={`Select ${company.name}`} className="accent-primary" /></td><td className="px-3 py-3"><div className="flex items-center gap-3"><div style={{
                        backgroundColor: company.color
                      }} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-foreground">{company.name[0]}</div><div className="min-w-0"><p className="truncate font-medium text-foreground">{company.name}</p><span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] ${typeClass[company.type]}`}>{company.type}</span></div></div></td><td className="whitespace-nowrap px-3 py-3 text-xs text-foreground">{company.industry}</td><td className="whitespace-nowrap px-3 py-3 text-xs text-muted-foreground"><Globe2 size={13} className="mr-1 inline text-muted-foreground" />{company.city}, {company.country}</td><td className="px-3 py-3 text-center"><span className="inline-flex items-center gap-1 text-foreground"><Users size={13} className="text-muted-foreground" />{company.contacts}</span></td><td className="px-3 py-3 text-center"><span className={`inline-flex items-center gap-1 ${company.deals === 0 ? 'text-chart-5' : 'text-foreground'}`}><BriefcaseBusiness size={13} className="text-muted-foreground" />{company.deals}</span></td><td className="whitespace-nowrap px-3 py-3 text-right font-medium text-foreground">{company.revenue || '—'}</td><td className="px-3 py-3"><span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-card text-[9px] text-foreground">{company.initials}</span>{company.owner}</span></td><td className="px-3 py-3"><span className={`inline-flex items-center gap-1.5 text-xs ${company.status === 'Active' ? 'text-chart-4' : company.status === 'Inactive' ? 'text-foreground' : 'text-muted-foreground'}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{company.status}</span></td><td className="whitespace-nowrap px-3 py-3 text-xs text-muted-foreground">{company.activity}</td><td className="relative px-4 py-3 text-right"><button onClick={e => {
                      e.stopPropagation();
                      setMenuId(menuId === company.id ? null : company.id);
                    }} aria-label={`Actions for ${company.name}`} className="rounded-md p-1.5 text-foreground hover:bg-secondary hover:text-foreground"><MoreHorizontal size={17} /></button>{menuId === company.id && <div className="absolute right-4 top-11 z-30 w-44 rounded-lg border border-border bg-[var(--secondary)] p-1 text-left shadow-xl">{['Open', 'Edit', 'Add Contact', 'Add Deal', 'Add Activity', 'Add Task', 'Archive', 'Delete'].map(item => <button key={item} onClick={() => {
                        if (item === 'Open') setPreview(company);
                        if (item === 'Edit') setModal('edit');
                        if (item === 'Delete') setModal('delete');
                        setMenuId(null);
                      }} className={`block w-full rounded-md px-3 py-2 text-xs hover:bg-secondary ${item === 'Delete' ? 'text-chart-5' : 'text-foreground'}`}>{item}</button>)}</div>}</td></tr>)}</tbody></table></div>}
            {filtered.length === 0 && <div className="p-16 text-center"><SearchX className="mx-auto text-muted-foreground" size={34} /><h2 className="mt-4 text-lg font-semibold text-foreground">No Companies Found</h2><p className="mt-2 text-sm text-muted-foreground">No companies match your current filters.</p><button onClick={() => setQuery('')} className="mt-5 rounded-lg border border-border/30 px-4 py-2 text-sm text-foreground">Clear Filters</button></div>}
            <div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>{filtered.length === 0 ? 'No live companies available' : `1–${filtered.length} live companies`}</span><nav aria-label="Pagination" className="flex items-center gap-1"><button aria-label="Previous page" className="rounded-md p-1.5 hover:bg-secondary"><ChevronLeft size={15} /></button>{['1', '2', '3', '…', '26'].map(page => <button key={page} aria-current={page === '1' ? 'page' : undefined} className={`h-7 min-w-7 rounded-md px-2 ${page === '1' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>{page}</button>)}<button aria-label="Next page" className="rounded-md p-1.5 hover:bg-secondary"><ChevronRight size={15} /></button></nav><label className="flex items-center gap-2">Items per page <select className="rounded-md border border-border bg-[var(--secondary)] px-2 py-1 text-foreground"><option>50</option><option>25</option><option>100</option></select></label></div>
          </div>
        </div>
      </main>
      {preview && <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[390px] flex-col overflow-y-auto border-l border-border bg-[var(--sidebar)] shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-[var(--background)]/95 px-5 py-4 backdrop-blur"><div><p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Company preview</p><h2 className="mt-1 font-semibold text-foreground">{preview.name}</h2></div><button onClick={() => setPreview(null)} aria-label="Close preview" className="rounded-md p-2 text-foreground hover:bg-secondary hover:text-foreground"><X size={18} /></button></div><div className="p-5"><div className="flex h-[72px] w-[72px] items-center justify-center rounded-xl text-3xl font-semibold text-foreground" style={{
          backgroundColor: preview.color
        }}>{preview.name[0]}</div><h2 className="mt-4 text-2xl font-semibold text-foreground">{preview.name}</h2><p className="mt-1 text-sm text-muted-foreground">{preview.industry} · {preview.city}, {preview.country}</p><a href="#website" className="mt-3 inline-flex items-center gap-1 text-sm text-foreground hover:text-foreground">{preview.domain}<ExternalLink size={13} /></a><div className="mt-4 flex items-center gap-3"><span className={`rounded-md px-2 py-1 text-xs ${typeClass[preview.type]}`}>{preview.type}</span><span className="text-xs text-foreground">● {preview.status}</span><span className="text-xs text-muted-foreground">Owner {preview.owner}</span></div><div className="my-6 border-t border-border pt-5"><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Key Metrics</p><div className="mt-3 grid grid-cols-2 gap-2">{[['Contacts', String(preview.contacts)], ['Open Deals', String(preview.deals)], ['Total Revenue', preview.revenue], ['Revenue This Period', '—']].map(([label, value]) => <div key={label} className="rounded-lg bg-[var(--secondary)] p-3"><p className="text-[11px] text-muted-foreground">{label}</p><p className="mt-1 font-semibold text-foreground">{value}</p></div>)}</div></div><div className="border-t border-border pt-5"><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Relationships</p><div className="mt-3 flex flex-wrap gap-2">{[`${preview.contacts} Contacts →`, `${preview.deals} Open Deals →`, 'View Revenue →'].map(item => <button key={item} className="rounded-md border border-border bg-secondary px-2.5 py-2 text-xs text-foreground hover:border-border/40 hover:text-foreground">{item}</button>)}</div></div><div className="mt-6 border-t border-border pt-5"><div className="flex items-center justify-between"><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Recent Activity</p><Activity size={15} className="text-muted-foreground" /></div>{[['Deal updated', 'Expansion opportunity moved to review', '2h ago'], ['Contact added', 'New decision maker identified', 'Yesterday'], ['Revenue logged', 'Quarterly purchasing activity recorded', '3d ago']].map(([title, desc, time]) => <div key={title} className="mt-4 flex gap-3"><div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/15"><Zap size={13} className="text-foreground" /></div><div><p className="text-xs font-medium text-foreground">{title}</p><p className="mt-0.5 text-xs text-muted-foreground">{desc}</p><p className="mt-1 text-[11px] text-muted-foreground">{time}</p></div></div>)}</div><div className="mt-6 rounded-xl border border-border/25 bg-secondary/[0.08] p-4"><div className="flex items-center gap-2 text-foreground"><Sparkles size={15} /><span className="text-xs font-medium">AI Company Intelligence</span><span className="ml-auto rounded bg-secondary/20 px-1.5 py-0.5 text-[10px]">AI Insight</span></div><p className="mt-3 text-sm leading-6 text-foreground">Expansion opportunity detected based on recent purchasing increase.</p><div className="mt-3 flex justify-between text-[11px] text-muted-foreground"><span>Based on available CRM data</span><span className="text-foreground">— confidence</span></div></div><div className="mt-6 border-t border-border pt-5"><p className="text-xs font-medium uppercase tracking-[0.12em] text-chart-5">Risk Signals</p><div className="mt-3 space-y-3"><p className="text-xs text-foreground"><span className="mr-2 text-chart-1">●</span>Deal inactivity 14 days <span className="float-right text-muted-foreground">Medium</span></p><p className="text-xs text-foreground"><span className="mr-2 text-chart-5">●</span>No recent activity <span className="float-right text-muted-foreground">High</span></p></div></div><div className="mt-6 flex flex-wrap gap-2"><button className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary">Open Company</button><button className="rounded-lg border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary">Add Contact</button><button className="rounded-lg border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary">Create Deal</button><button onClick={() => setModal('edit')} className="rounded-lg border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary"><Pencil size={12} className="mr-1 inline" />Edit</button></div></div></aside>}
      {modal && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-primary/70 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className={`w-full ${modal === 'delete' ? 'max-w-md' : 'max-w-2xl'} max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-[var(--secondary)] shadow-2xl`}><div className="flex items-center justify-between border-b border-border px-6 py-5"><div><h2 id="modal-title" className="text-lg font-semibold text-foreground">{modal === 'delete' ? 'Delete Companies?' : modal === 'import' ? 'Import Companies' : modal === 'export' ? 'Export Companies' : modal === 'edit' ? 'Edit Company' : 'Create Company'}</h2>{modal === 'edit' && <p className="mt-1 text-xs text-foreground">● Unsaved changes</p>}</div><button onClick={() => setModal(null)} aria-label="Close dialog" className="rounded-md p-2 text-foreground hover:bg-secondary"><X size={18} /></button></div>{modal === 'delete' ? <div className="p-6"><div className="flex gap-3"><div className="rounded-full bg-chart-5/15 p-3 text-chart-5"><AlertTriangle size={22} /></div><p className="text-sm leading-6 text-foreground">You are about to permanently delete the selected companies. This action may also affect associated contacts, deals, and activities.</p></div><div className="mt-6 flex justify-end gap-2"><button onClick={() => setModal(null)} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-secondary">Cancel</button><button onClick={() => {
              setSelected([]);
              setModal(null);
            }} className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-destructive">Delete Companies</button></div></div> : modal === 'import' ? <div className="p-6"><div className="mb-6 flex items-center justify-between">{['Upload', 'Map Fields', 'Validate', 'Review', 'Import', 'Results'].map((step, i) => <div key={step} className="flex items-center gap-2"><span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>{i === 0 ? '1' : i + 1}</span><span className="hidden text-[11px] text-muted-foreground sm:inline">{step}</span>{i < 5 && <span className="hidden h-px w-5 bg-secondary sm:block" />}</div>)}</div><div className="rounded-xl border border-dashed border-border bg-secondary p-12 text-center"><CloudUpload className="mx-auto text-foreground" size={38} /><h3 className="mt-4 font-medium text-foreground">Drag CSV or Excel file here</h3><p className="mt-2 text-sm text-muted-foreground">Accepted formats: .csv, .xlsx</p><button className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary">Browse files</button></div><p className="mt-5 flex items-center gap-2 text-xs text-foreground"><AlertTriangle size={14} />Existing company records will not be overwritten without your confirmation.</p></div> : modal === 'export' ? <div className="p-6"><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Export scope</p><div className="mt-3 space-y-3 text-sm text-foreground">{['All live companies', 'Current Filter', 'Selected Companies'].map((item, i) => <label key={item} className="flex items-center gap-3"><input type="radio" name="scope" defaultChecked={i === 0} className="accent-primary" />{item}</label>)}</div><p className="mt-6 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Format</p><div className="mt-3 flex gap-4 text-sm text-foreground"><label><input type="radio" name="format" defaultChecked className="mr-2 accent-primary" />CSV</label><label><input type="radio" name="format" className="mr-2 accent-primary" />Excel</label></div><p className="mt-6 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Data fields</p><div className="mt-3 grid grid-cols-2 gap-3 text-xs text-foreground">{['Company name', 'Domain', 'Industry', 'Contacts', 'Revenue', 'Owner', 'Status', 'Last activity'].map(item => <label key={item}><input type="checkbox" defaultChecked className="mr-2 accent-primary" />{item}</label>)}</div><div className="mt-7 flex justify-end gap-2"><button onClick={() => setModal(null)} className="rounded-lg px-4 py-2 text-sm text-muted-foreground">Cancel</button><button onClick={() => setModal(null)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Export</button></div></div> : <div className="p-6"><div className="grid gap-4 sm:grid-cols-2">{['Company Name *', 'Legal Name', 'Domain', 'Industry *', 'Company Type *', 'Status *', 'Owner', 'Email', 'Phone', 'Website', 'Country', 'Region', 'City', 'Postal Code', 'Company Size', 'Annual Revenue'].map(field => <label key={field} className="text-xs text-muted-foreground">{field}<input defaultValue={''} placeholder={field.replace(' *', '')} className="mt-2 h-10 w-full rounded-lg border border-border bg-[var(--secondary)] px-3 text-sm text-foreground outline-none focus:border-border/60 focus:ring-2 focus:ring-ring/20" /></label>)}</div><label className="mt-4 block text-xs text-muted-foreground">Tags <input placeholder="Add tags" className="mt-2 h-10 w-full rounded-lg border border-border bg-[var(--secondary)] px-3 text-sm text-foreground outline-none focus:border-border/60" /></label><label className="mt-4 block text-xs text-muted-foreground">Notes<textarea rows={3} className="mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] p-3 text-sm text-foreground outline-none focus:border-border/60" /></label><div className="mt-6 flex justify-end gap-2 border-t border-border pt-5"><button onClick={() => setModal(null)} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-secondary">{modal === 'edit' ? 'Discard' : 'Cancel'}</button><button onClick={() => setModal(null)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary">{modal === 'edit' ? 'Save Changes' : 'Create Company'}</button></div></div>}</div></div>}
      <button onClick={() => setModal('create')} aria-label="Create company" className="fixed bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-black/30 lg:hidden"><Plus size={24} /></button>
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
    "id": "sparklingly-moon-5114",
    "label": "SEO"
  }, {
    "id": "zealously-path-4224",
    "label": "GEO"
  }, {
    "id": "sunny-house-9595",
    "label": "AEO"
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
