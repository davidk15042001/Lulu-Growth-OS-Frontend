import { useMemo, useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertCircle, AlertTriangle, Archive, ArrowDownToLine, ArrowUpDown, Brain, Building2, Check, CheckSquare, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Columns3, DollarSign, Download, Edit3, GitBranch, Layers, LayoutDashboard, Lock, MoreHorizontal, Plus, Search, Settings, SlidersHorizontal, Sparkles, Trash2, Upload, UserPlus, Users, X, Zap } from 'lucide-react';
type ContactType = 'Customer' | 'Lead' | 'Prospect' | 'Partner';
type Status = 'Active' | 'Inactive' | 'Archived';
type Contact = {
  id: number;
  name: string;
  initials: string;
  color: string;
  type: ContactType;
  status: Status;
  company: string;
  title: string;
  email: string;
  phone: string;
  owner: string;
  ownerInitials: string;
  activity: string;
  created: string;
  location: string;
  tags: string[];
};
type Modal = 'create' | 'edit' | 'delete' | 'import' | 'export' | null;
const contacts: Contact[] = [];
const navItems = [['CRM', LayoutDashboard], ['Contacts', Users], ['Companies', Building2], ['Leads', UserPlus], ['Deals', DollarSign], ['Pipeline', GitBranch], ['Activities', Activity], ['Tasks', CheckSquare], ['Customer Segments', Layers], ['Customer Intelligence', Brain]] as const;
const kpis: { label: string; value: string; trend?: string; tone?: string }[] = [];
const filters = ['Contact Type', 'Status', 'Company', 'Owner', 'Lead Source', 'Created Date', 'Last Activity', 'Tags'];
const columns = ['Company', 'Job Title', 'Email', 'Phone', 'Owner', 'Status', 'Last Activity', 'Created'];
function Sidebar() {
  return <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-[var(--sidebar)] px-3 py-5">
    <div className="flex items-center gap-2.5 px-3 mb-9"><span className="grid size-8 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">L</span><strong className="text-[17px] tracking-tight text-foreground">Lulu AI</strong></div>
    <p className="px-3 mb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">CRM</p>
    <LuluSectionNavigation activeId="sturdy-month-1562" />
    <div className="mt-5 border-t border-border pt-4"><button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] text-foreground hover:bg-secondary"><Settings size={16} /><span>Settings</span></button></div>
    <div className="mt-auto border-t border-border pt-4"><div className="flex items-center gap-3 px-2"><span className="grid size-9 place-items-center rounded-full bg-card text-xs font-semibold text-foreground">—</span><div><p className="text-sm font-medium text-foreground">Workspace user</p><p className="text-xs text-muted-foreground">CRM access</p></div></div><div className="mt-4 flex items-center gap-2 px-2 text-xs text-chart-4"><span className="size-1.5 rounded-full bg-chart-4" />AI Active</div></div>
  </aside>;
}
function ModalShell({
  title,
  children,
  onClose
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-primary/70 p-4" role="dialog" aria-modal="true" aria-label={title}><div className="w-full max-w-2xl rounded-2xl border border-border bg-[var(--secondary)] shadow-2xl"><header className="flex items-center justify-between border-b border-border px-6 py-5"><h2 className="text-lg font-semibold text-foreground">{title}</h2><button onClick={onClose} aria-label="Close dialog" className="rounded-md p-1.5 text-foreground hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"><X size={18} /></button></header>{children}</div></div>;
}
export function LuluContacts() {
  const { items: liveRecords, loading: liveLoading, error: liveError } = useLiveRecords('crm_contacts');
  const liveContacts: Contact[] = liveRecords.map((record, index) => {
    const fields = record as unknown as Record<string, unknown>;
    const name = record.name || String(fields.fullName ?? 'Unnamed contact');
    const parts = name.split(' ');
    return { id: index + 1, name, initials: parts.map(part => part[0]).join('').slice(0, 2).toUpperCase(), color: 'var(--foreground)', type: (String(fields.type ?? 'Prospect') as ContactType), status: (String(record.status ?? 'Active') as Status), company: String(fields.company ?? '—'), title: String(fields.title ?? '—'), email: String(fields.email ?? '—'), phone: String(fields.phone ?? '—'), owner: String(fields.owner ?? '—'), ownerInitials: '—', activity: String(fields.activity ?? '—'), created: record.createdAt, location: String(fields.location ?? '—'), tags: Array.isArray(fields.tags) ? fields.tags.map(String) : [] };
  });
  const contactsForView = liveLoading ? [] : liveContacts;
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [preview, setPreview] = useState<Contact | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [menu, setMenu] = useState<number | null>(null);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const filtered = useMemo(() => contactsForView.filter(c => (c.name + c.email + c.company + c.phone).toLowerCase().includes(query.toLowerCase()) && (statusFilter === 'All statuses' || c.status === statusFilter)), [query, statusFilter]);
  const allSelected = selected.length === filtered.length && filtered.length > 0;
  const toggle = (id: number) => setSelected(value => value.includes(id) ? value.filter(item => item !== id) : [...value, id]);
  const inputClass = 'w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2.5 text-sm text-muted-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring';
  return <div className="flex min-h-screen bg-[var(--background)] font-sans text-muted-foreground"><Sidebar /><main className="min-w-0 flex-1 overflow-hidden">
    {liveError && <div className="mx-5 mt-4 rounded-lg border border-chart-5/30 bg-chart-5/5 px-4 py-3 text-sm text-chart-5">{liveError}</div>}
    {!liveLoading && liveContacts.length === 0 && <></>}<header className="flex items-center justify-between border-b border-border px-5 py-4 lg:px-8"><div className="flex items-center gap-3"><button className="rounded-md p-2 text-foreground lg:hidden" aria-label="Open navigation"><Layers size={19} /></button><div><p className="text-xs text-muted-foreground">Lulu AI <span className="px-1">/</span> CRM <span className="px-1">/</span> Contacts</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">Contacts</h1><p className="mt-1 hidden text-sm text-muted-foreground sm:block">Manage and understand the people connected to your business.</p></div></div><div className="hidden items-center gap-2 sm:flex"><button onClick={() => setModal('import')} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:border-border hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"><Upload size={15} />Import</button><button onClick={() => setModal('export')} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary"><Download size={15} />Export</button><button onClick={() => setModal('create')} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary"><Plus size={16} />Create Contact</button></div></header>
    <div className="mx-auto max-w-[1600px] p-5 lg:p-8"><section aria-label="Contact summary" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{(liveLoading ? [] : kpis).map(kpi => <article key={kpi.label} className="rounded-xl border border-border bg-[var(--card)] p-4 transition hover:-translate-y-0.5 hover:border-border"><p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{kpi.label}</p><div className="mt-3 flex items-center gap-2"><strong className="text-xl font-semibold text-foreground">{kpi.value}</strong>{kpi.trend && <span className="text-xs text-chart-4">{kpi.trend}</span>}{kpi.tone === 'emerald' && <span className="size-2 rounded-full bg-chart-4" />}{kpi.tone === 'violet' && <Sparkles size={14} className="text-foreground" />}{kpi.tone === 'amber' && <span className="size-2 rounded-full bg-chart-1" />}{kpi.tone === 'rose' && <AlertCircle size={14} className="text-chart-5" />}</div></article>)}</section>
      <section className="mt-6"><div className="relative"><Search className="pointer-events-none absolute left-3 top-3 text-muted-foreground" size={18} /><input className={`${inputClass} pl-10 pr-16`} value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setShowRecent(true)} placeholder="Search contacts... (Name, Email, Company, Phone, ID)" aria-label="Search contacts" /><kbd className="absolute right-3 top-2.5 rounded border border-border bg-secondary px-1.5 py-1 text-[11px] text-muted-foreground">⌘K</kbd>{showRecent && !query && <div className="absolute z-20 mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] p-2 shadow-xl"><p className="px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Recent searches</p>{([] as string[]).map(item => <button key={item} onMouseDown={() => {
                setQuery(item);
                setShowRecent(false);
              }} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-foreground hover:bg-secondary"><Search size={14} className="text-muted-foreground" />{item}</button>)}</div>}</div><div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1"><button className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary"><SlidersHorizontal size={15} />Filters</button>{filters.map(filter => <button key={filter} className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-2 text-xs ${filter === 'Status' && statusFilter !== 'All statuses' ? 'border-border/40 bg-secondary/15 text-foreground' : 'border-border text-foreground hover:border-border'}`} onClick={() => filter === 'Status' && setStatusFilter(statusFilter === 'All statuses' ? 'Active' : 'All statuses')}>{filter}<ChevronDown size={13} /></button>)}{statusFilter !== 'All statuses' && <button onClick={() => setStatusFilter('All statuses')} className="shrink-0 px-2 text-xs text-foreground">Clear Filters</button>}<button className="ml-auto hidden shrink-0 text-xs text-foreground hover:text-foreground md:block">Save Filter</button></div></section>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3"><div className="flex items-center gap-3 text-xs text-muted-foreground"><span>Saved Filters</span><button className="text-foreground">My Leads</button><button>VIP Customers</button><button>Inactive</button></div><div className="flex items-center gap-2"><div className="hidden rounded-md border border-border p-0.5 sm:flex"><button className="rounded bg-secondary p-1.5 text-foreground" aria-label="Table view"><Columns3 size={15} /></button><button className="p-1.5 text-foreground" aria-label="Compact view"><Layers size={15} /></button></div><div className="relative"><button onClick={() => setColumnsOpen(!columnsOpen)} className="inline-flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs text-foreground"><Columns3 size={14} />Columns</button>{columnsOpen && <div className="absolute right-0 z-30 mt-2 w-48 rounded-lg border border-border bg-[var(--secondary)] p-3 shadow-xl">{columns.map(column => <label key={column} className="flex items-center gap-2 py-1.5 text-xs text-foreground"><input type="checkbox" defaultChecked className="accent-primary" />{column}</label>)}<button className="mt-2 w-full border-t border-border pt-2 text-left text-xs text-foreground">Reset to Default</button></div>}</div></div></div>
      {selected.length > 0 && <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-border/30 bg-[var(--secondary)] px-4 py-3 text-sm"><strong className="mr-2 text-foreground">{selected.length} contacts selected</strong>{['Assign Owner', 'Add Tag', 'Change Status', 'Add to Segment', 'Export', 'Archive'].map(action => <button key={action} className="rounded-md border border-border px-2.5 py-1.5 text-xs text-foreground hover:bg-secondary">{action}</button>)}<button onClick={() => setModal('delete')} className="rounded-md px-2.5 py-1.5 text-xs text-chart-5 hover:bg-chart-5/10">Delete</button><button onClick={() => setSelected([])} className="ml-auto rounded p-1 text-foreground hover:text-foreground" aria-label="Deselect all"><X size={16} /></button></div>}
      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-[var(--secondary)]"><table className="w-full min-w-[1120px] text-left text-xs"><thead className="bg-secondary/30 text-[10px] uppercase tracking-[0.1em] text-muted-foreground"><tr><th scope="col" className="w-10 px-4 py-3"><input type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? [] : filtered.map(c => c.id))} aria-label="Select all contacts" className="accent-primary" /></th>{['Contact', 'Company', 'Job Title', 'Email', 'Phone', 'Owner', 'Status', 'Last Activity', 'Created'].map((head, i) => <th key={head} scope="col" aria-sort={i === 0 ? 'ascending' : 'none'} className="whitespace-nowrap px-3 py-3 font-medium">{head} <span className={i === 0 ? 'text-foreground' : 'text-muted-foreground'}>{i === 0 ? '↑' : '↕'}</span></th>)}<th scope="col" className="px-3 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-white/[0.06]">{filtered.map(contact => <tr key={contact.id} onClick={e => {
                if ((e.target as HTMLElement).closest('button,input')) return;
                setPreview(contact);
              }} className={`group cursor-pointer transition hover:bg-secondary ${selected.includes(contact.id) ? 'border-l-2 border-l-border bg-secondary/10' : ''}`}><td className="px-4 py-3"><input type="checkbox" checked={selected.includes(contact.id)} onChange={() => toggle(contact.id)} aria-label={`Select ${contact.name}`} className={`accent-primary ${selected.length === 0 ? 'opacity-0 group-hover:opacity-100' : ''}`} /></td><td className="px-3 py-3"><div className="flex items-center gap-2.5"><span className="grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-foreground" style={{
                      backgroundColor: contact.color
                    }}>{contact.initials}</span><div><p className="font-semibold text-foreground">{contact.name}</p><span className="mt-1 inline-flex rounded-md bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">{contact.type}</span></div></div></td><td className="px-3 text-foreground"><span className="flex items-center gap-1.5"><Building2 size={13} className="text-muted-foreground" />{contact.company}</span></td><td className="px-3 text-muted-foreground">{contact.title}</td><td className="max-w-[190px] truncate px-3 text-foreground">{contact.email}</td><td className="whitespace-nowrap px-3 text-muted-foreground">{contact.phone}</td><td className="px-3"><span className="flex items-center gap-1.5 text-foreground"><span className="grid size-5 place-items-center rounded-full bg-card text-[8px]">{contact.ownerInitials}</span>{contact.owner}</span></td><td className="px-3"><span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 ${contact.status === 'Active' ? 'bg-chart-4/10 text-chart-4' : contact.status === 'Inactive' ? 'bg-secondary/10 text-foreground' : 'bg-secondary/10 text-muted-foreground'}`}><span className="size-1.5 rounded-full bg-current" />{contact.status}</span></td><td className="whitespace-nowrap px-3 text-muted-foreground">{contact.activity}</td><td className="whitespace-nowrap px-3 text-muted-foreground">{contact.created}</td><td className="relative px-3 text-right"><button onClick={() => setMenu(menu === contact.id ? null : contact.id)} aria-label={`Actions for ${contact.name}`} className="rounded-md p-1.5 text-foreground hover:bg-secondary hover:text-foreground"><MoreHorizontal size={17} /></button>{menu === contact.id && <div className="absolute right-3 top-10 z-20 w-44 rounded-lg border border-border bg-[var(--secondary)] p-1.5 text-left shadow-xl">{['Open', 'Edit', 'Add Activity', 'Add Task', 'Add Note', 'Analyze Contact', 'Archive', 'Delete'].map(action => <button key={action} onClick={() => {
                      setMenu(null);
                      if (action === 'Open') setPreview(contact);
                      if (action === 'Edit') setModal('edit');
                      if (action === 'Delete') {
                        setSelected([contact.id]);
                        setModal('delete');
                      }
                    }} className={`block w-full rounded px-2 py-1.5 text-xs ${action === 'Delete' ? 'text-chart-5' : action === 'Analyze Contact' ? 'text-foreground' : 'text-foreground'} hover:bg-secondary`}>{action}</button>)}</div>}</td></tr>)}</tbody></table></div>
      <footer className="flex flex-wrap items-center justify-between gap-3 py-4 text-xs text-muted-foreground"><span>1–50 of 12,482 contacts</span><div className="flex items-center gap-1"><button aria-label="Previous page" className="rounded p-1.5 hover:bg-secondary"><ChevronLeft size={15} /></button>{['1', '2', '3', '…', '250'].map(page => <button key={page} className={`rounded px-2 py-1.5 ${page === '1' ? 'bg-secondary/20 text-foreground' : 'hover:bg-secondary'}`}>{page}</button>)}<button aria-label="Next page" className="rounded p-1.5 hover:bg-secondary"><ChevronRight size={15} /></button></div><label className="flex items-center gap-2">Items per page <select className="rounded border border-border bg-[var(--secondary)] px-2 py-1.5 text-foreground"><option>50</option><option>25</option><option>100</option></select></label></footer>
    </div>
    <button onClick={() => setModal('create')} className="fixed bottom-5 right-5 grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg sm:hidden" aria-label="Create contact"><Plus /></button>
    {preview && <aside className="fixed inset-y-0 right-0 z-40 w-full max-w-sm overflow-y-auto border-l border-border bg-[var(--sidebar)] p-6 shadow-2xl"><div className="flex items-center justify-between"><p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Contact preview</p><button onClick={() => setPreview(null)} aria-label="Close preview" className="rounded p-1.5 text-foreground hover:bg-secondary"><X size={18} /></button></div><div className="mt-8 flex items-center gap-4"><span className="grid size-[72px] place-items-center rounded-full text-xl font-semibold text-foreground" style={{
            backgroundColor: preview.color
          }}>{preview.initials}</span><div><h2 className="text-xl font-semibold text-foreground">{preview.name}</h2><p className="mt-1 text-sm text-muted-foreground">{preview.title} · {preview.company}</p><div className="mt-2 flex gap-2"><span className="rounded-md bg-secondary/15 px-2 py-1 text-[10px] text-foreground">{preview.type}</span><span className="rounded-md bg-secondary/10 px-2 py-1 text-[10px] text-foreground">{preview.status}</span></div></div></div><div className="mt-8 space-y-6"><section><h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Contact Info</h3><dl className="mt-3 space-y-3 text-sm"><div><dt className="text-xs text-muted-foreground">Email</dt><dd className="mt-1 text-foreground">{preview.email}</dd></div><div><dt className="text-xs text-muted-foreground">Phone</dt><dd className="mt-1 text-foreground">{preview.phone}</dd></div><div><dt className="text-xs text-muted-foreground">Location</dt><dd className="mt-1 text-foreground">{preview.location}</dd></div></dl></section><section><h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">CRM</h3><dl className="mt-3 space-y-3 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Owner</dt><dd className="text-foreground">{preview.owner}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Created</dt><dd className="text-foreground">{preview.created}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Last Activity</dt><dd className="text-foreground">{preview.activity}</dd></div></dl><div className="mt-3 flex flex-wrap gap-1.5">{preview.tags.map(tag => <span key={tag} className="rounded-md bg-secondary/10 px-2 py-1 text-[10px] text-foreground">{tag}</span>)}</div></section><section><div className="flex items-center justify-between"><h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Open Deals</h3><span className="text-[10px] text-foreground">AI Insight · —</span></div><div className="mt-3 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">No live deals are available for this contact yet.</div></section><section><h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Recent Activity</h3>{([] as string[]).map((item, i) => <div key={item} className="mt-3 flex gap-3 text-sm"><span className="mt-0.5 text-foreground"><Activity size={14} /></span><div><p className="text-foreground">{item}</p><p className="mt-1 text-xs text-muted-foreground">{['2 hours ago', 'Yesterday', '4 days ago'][i]}</p></div></div>)}</section></div><div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-5"><button className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">Open Contact</button><button className="rounded-lg border border-border px-3 py-2 text-xs text-foreground">Add Task</button><button className="rounded-lg border border-border px-3 py-2 text-xs text-foreground">Add Note</button><button onClick={() => setModal('edit')} className="rounded-lg border border-border p-2 text-foreground" aria-label="Edit contact"><Edit3 size={14} /></button></div></aside>}
    {modal === 'create' && <ModalShell title="Create Contact" onClose={() => setModal(null)}><ContactForm onClose={() => setModal(null)} /></ModalShell>}
    {modal === 'edit' && <ModalShell title="Edit Contact" onClose={() => setModal(null)}><ContactForm edit onClose={() => setModal(null)} /></ModalShell>}
    {modal === 'delete' && <ModalShell title="Delete Contacts?" onClose={() => setModal(null)}><div className="p-6"><div className="flex gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-chart-5/15 text-chart-5"><AlertTriangle size={20} /></span><p className="text-sm leading-6 text-foreground">You are about to permanently delete the selected contacts. This action may affect related CRM records.</p></div><div className="mt-6 flex justify-end gap-2"><button onClick={() => setModal(null)} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground">Cancel</button><button onClick={() => {
              setSelected([]);
              setModal(null);
            }} className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-primary-foreground">Delete Contacts</button></div></div></ModalShell>}
    {modal === 'import' && <ModalShell title="Import Contacts" onClose={() => setModal(null)}><div className="p-6"><div className="mb-7 flex items-center justify-between text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{['Upload', 'Map Fields', 'Validate', 'Review', 'Import', 'Results'].map((step, i) => <div key={step} className={`flex items-center gap-1.5 ${i === 0 ? 'text-foreground' : ''}`}><span className={`grid size-6 place-items-center rounded-full border ${i === 0 ? 'border-border bg-secondary/20' : 'border-border'}`}>{i + 1}</span><span className="hidden sm:inline">{step}</span></div>)}</div><div className="rounded-xl border border-dashed border-border/40 bg-secondary/[0.04] p-10 text-center"><Upload className="mx-auto text-foreground" size={28} /><h3 className="mt-3 font-medium text-foreground">Drag CSV or Excel file here</h3><p className="mt-1 text-sm text-muted-foreground">or</p><button className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">Browse files</button><p className="mt-4 text-xs text-muted-foreground">Accepted: .csv, .xlsx</p></div><p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><Lock size={13} className="text-foreground" />Never silently overwrite existing records.</p></div></ModalShell>}
    {modal === 'export' && <ModalShell title="Export Contacts" onClose={() => setModal(null)}><div className="space-y-6 p-6"><fieldset><legend className="text-sm font-medium text-foreground">Export scope</legend><div className="mt-3 space-y-2">{['All Contacts', 'Current Filter', 'Selected Contacts'].map((item, i) => <label key={item} className="flex items-center gap-3 text-sm text-foreground"><input type="radio" name="scope" defaultChecked={i === 0} className="accent-chart-2" />{item}</label>)}</div></fieldset><fieldset><legend className="text-sm font-medium text-foreground">Format</legend><div className="mt-3 flex gap-6"><label className="flex gap-2 text-sm text-foreground"><input type="radio" name="format" defaultChecked className="accent-chart-2" />CSV</label><label className="flex gap-2 text-sm text-foreground"><input type="radio" name="format" className="accent-primary" />Excel</label></div></fieldset><div className="flex justify-end gap-2"><button onClick={() => setModal(null)} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground">Cancel</button><button onClick={() => setModal(null)} className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">Export</button></div></div></ModalShell>}
  </main></div>;
}
function ContactForm({
  edit,
  onClose
}: {
  edit?: boolean;
  onClose: () => void;
}) {
  const fields = ['First Name *', 'Last Name *', 'Email *', 'Phone', 'Company', 'Job Title', 'Contact Type', 'Status', 'Owner', 'Tags', 'Country', 'City'];
  return <form onSubmit={e => {
    e.preventDefault();
    onClose();
  }} className="p-6"><div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">{edit && <><span className="size-1.5 rounded-full bg-primary text-primary-foreground" />Unsaved changes</>}</div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{fields.map(field => <label key={field} className="text-xs font-medium text-muted-foreground">{field}<input required={field.includes('*')} placeholder={field.replace(' *', '')} defaultValue={''} className="mt-1.5 w-full rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5 text-sm text-muted-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" /></label>)}</div><label className="mt-4 block text-xs font-medium text-muted-foreground">Notes<textarea rows={3} className="mt-1.5 w-full resize-none rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label><p className="mt-3 text-xs text-muted-foreground">Required fields are marked with <span className="text-foreground">*</span></p><footer className="mt-6 flex justify-end gap-2 border-t border-border pt-5"><button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground">{edit ? 'Discard' : 'Cancel'}</button><button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">{edit ? 'Save Changes' : 'Create Contact'}</button></footer></form>;
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
