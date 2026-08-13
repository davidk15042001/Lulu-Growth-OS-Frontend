import { useMemo, useState } from 'react';
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
const contacts: Contact[] = [{
  id: 1,
  name: 'Sarah Mitchell',
  initials: 'SM',
  color: 'var(--foreground)',
  type: 'Customer',
  status: 'Active',
  company: 'Nexus Solutions',
  title: 'CEO',
  email: 'sarah.mitchell@nexus.co',
  phone: '+1 (415) 555-0182',
  owner: 'Jordan Davis',
  ownerInitials: 'JD',
  activity: '2 hours ago',
  created: 'Mar 12, 2024',
  location: 'San Francisco, CA',
  tags: ['VIP', 'Enterprise']
}, {
  id: 2,
  name: 'Marcus Johnson',
  initials: 'MJ',
  color: 'var(--foreground)',
  type: 'Lead',
  status: 'Active',
  company: 'Quantum Dynamics',
  title: 'VP Sales',
  email: 'marcus.johnson@quantumd.com',
  phone: '+1 (212) 555-0144',
  owner: 'Ava Wilson',
  ownerInitials: 'AW',
  activity: '1 day ago',
  created: 'Apr 02, 2024',
  location: 'New York, NY',
  tags: ['High Value']
}, {
  id: 3,
  name: 'Elena Rodriguez',
  initials: 'ER',
  color: 'var(--foreground)',
  type: 'Prospect',
  status: 'Active',
  company: 'TechVision',
  title: 'Marketing Director',
  email: 'elena.rodriguez@techvision.io',
  phone: '+1 (305) 555-0121',
  owner: 'Jordan Davis',
  ownerInitials: 'JD',
  activity: '3 days ago',
  created: 'Apr 18, 2024',
  location: 'Miami, FL',
  tags: ['Newsletter']
}, {
  id: 4,
  name: 'James Park',
  initials: 'JP',
  color: 'var(--foreground)',
  type: 'Customer',
  status: 'Active',
  company: 'GlobalTech',
  title: 'CTO',
  email: 'james.park@globaltech.com',
  phone: '+1 (206) 555-0177',
  owner: 'Jordan Davis',
  ownerInitials: 'JD',
  activity: '5 hours ago',
  created: 'Feb 24, 2024',
  location: 'Seattle, WA',
  tags: ['Enterprise', 'New Customer']
}, {
  id: 5,
  name: 'Olivia Chen',
  initials: 'OC',
  color: 'var(--foreground)',
  type: 'Lead',
  status: 'Active',
  company: 'Synapse Labs',
  title: 'Founder',
  email: 'olivia.chen@synapselabs.ai',
  phone: '+1 (650) 555-0199',
  owner: 'Noah Brown',
  ownerInitials: 'NB',
  activity: '8 days ago',
  created: 'May 01, 2024',
  location: 'Palo Alto, CA',
  tags: ['High Value']
}, {
  id: 6,
  name: 'Daniel Weber',
  initials: 'DW',
  color: 'var(--muted-foreground)',
  type: 'Customer',
  status: 'Inactive',
  company: 'Acme Corp',
  title: 'Head of Operations',
  email: 'daniel.weber@acme.com',
  phone: '+49 30 555 0192',
  owner: 'Ava Wilson',
  ownerInitials: 'AW',
  activity: '2 weeks ago',
  created: 'Jan 08, 2024',
  location: 'Berlin, Germany',
  tags: ['At Risk']
}, {
  id: 7,
  name: 'Aisha Patel',
  initials: 'AP',
  color: 'var(--chart-4)',
  type: 'Partner',
  status: 'Active',
  company: 'InnovateCo',
  title: 'CFO',
  email: 'aisha.patel@innovateco.com',
  phone: '+1 (312) 555-0166',
  owner: 'Jordan Davis',
  ownerInitials: 'JD',
  activity: '1 day ago',
  created: 'Mar 28, 2024',
  location: 'Chicago, IL',
  tags: ['Partner', 'VIP']
}, {
  id: 8,
  name: 'Robert Kim',
  initials: 'RK',
  color: 'var(--foreground)',
  type: 'Prospect',
  status: 'Active',
  company: 'DataBridge',
  title: 'Director',
  email: 'robert.kim@databridge.co',
  phone: '+1 (617) 555-0103',
  owner: 'Noah Brown',
  ownerInitials: 'NB',
  activity: '4 days ago',
  created: 'Apr 11, 2024',
  location: 'Boston, MA',
  tags: ['Enterprise']
}, {
  id: 9,
  name: 'Sophie Laurent',
  initials: 'SL',
  color: 'var(--chart-5)',
  type: 'Lead',
  status: 'Active',
  company: 'EuroTech',
  title: 'Sales Manager',
  email: 'sophie.laurent@eurotech.fr',
  phone: '+33 1 55 55 01 88',
  owner: 'Jordan Davis',
  ownerInitials: 'JD',
  activity: '6 hours ago',
  created: 'May 06, 2024',
  location: 'Paris, France',
  tags: ['New Customer']
}, {
  id: 10,
  name: 'Carlos Rivera',
  initials: 'CR',
  color: 'var(--foreground)',
  type: 'Customer',
  status: 'Active',
  company: 'MexiGlobal',
  title: 'COO',
  email: 'carlos.rivera@mexiglobal.mx',
  phone: '+52 55 5555 0142',
  owner: 'Ava Wilson',
  ownerInitials: 'AW',
  activity: '3 hours ago',
  created: 'Feb 16, 2024',
  location: 'Mexico City, MX',
  tags: ['VIP']
}];
const navItems = [['CRM', LayoutDashboard], ['Contacts', Users], ['Companies', Building2], ['Leads', UserPlus], ['Deals', DollarSign], ['Pipeline', GitBranch], ['Activities', Activity], ['Tasks', CheckSquare], ['Customer Segments', Layers], ['Customer Intelligence', Brain]] as const;
const kpis = [{
  label: 'Total Contacts',
  value: '12,482'
}, {
  label: 'New Contacts',
  value: '428',
  trend: '+12.4%'
}, {
  label: 'Active Contacts',
  value: '8,942',
  tone: 'emerald'
}, {
  label: 'Customers',
  value: '6,284',
  tone: 'violet'
}, {
  label: 'Leads',
  value: '2,918',
  tone: 'amber'
}, {
  label: 'Requiring Attention',
  value: '124',
  tone: 'rose'
}];
const filters = ['Contact Type', 'Status', 'Company', 'Owner', 'Lead Source', 'Created Date', 'Last Activity', 'Tags'];
const columns = ['Company', 'Job Title', 'Email', 'Phone', 'Owner', 'Status', 'Last Activity', 'Created'];
function Sidebar() {
  return <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-[var(--sidebar)] px-3 py-5">
    <div className="flex items-center gap-2.5 px-3 mb-9"><span className="grid size-8 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">L</span><strong className="text-[17px] tracking-tight text-foreground">Lulu AI</strong></div>
    <p className="px-3 mb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">CRM</p>
    <nav className="space-y-0.5">{navItems.map(([label, Icon]) => <button key={label} className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] transition ${label === 'Contacts' ? 'bg-secondary/15 text-foreground' : 'text-foreground hover:bg-secondary hover:text-foreground'}`}><Icon size={16} className={label === 'Contacts' ? 'text-foreground' : ''} /><span>{label}</span></button>)}</nav>
    <div className="mt-5 border-t border-border pt-4"><button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] text-foreground hover:bg-secondary"><Settings size={16} /><span>Settings</span></button></div>
    <div className="mt-auto border-t border-border pt-4"><div className="flex items-center gap-3 px-2"><span className="grid size-9 place-items-center rounded-full bg-card text-xs font-semibold text-foreground">JD</span><div><p className="text-sm font-medium text-foreground">Jordan Davis</p><p className="text-xs text-muted-foreground">CRM Manager</p></div></div><div className="mt-4 flex items-center gap-2 px-2 text-xs text-chart-4"><span className="size-1.5 rounded-full bg-chart-4" />AI Active</div></div>
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
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [preview, setPreview] = useState<Contact | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [menu, setMenu] = useState<number | null>(null);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const filtered = useMemo(() => contacts.filter(c => (c.name + c.email + c.company + c.phone).toLowerCase().includes(query.toLowerCase()) && (statusFilter === 'All statuses' || c.status === statusFilter)), [query, statusFilter]);
  const allSelected = selected.length === filtered.length && filtered.length > 0;
  const toggle = (id: number) => setSelected(value => value.includes(id) ? value.filter(item => item !== id) : [...value, id]);
  const inputClass = 'w-full rounded-lg border border-border bg-[var(--background)] px-3 py-2.5 text-sm text-muted-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring';
  return <div className="flex min-h-screen bg-[var(--background)] font-sans text-muted-foreground"><Sidebar /><main className="min-w-0 flex-1 overflow-hidden"><header className="flex items-center justify-between border-b border-border px-5 py-4 lg:px-8"><div className="flex items-center gap-3"><button className="rounded-md p-2 text-foreground lg:hidden" aria-label="Open navigation"><Layers size={19} /></button><div><p className="text-xs text-muted-foreground">Lulu AI <span className="px-1">/</span> CRM <span className="px-1">/</span> Contacts</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">Contacts</h1><p className="mt-1 hidden text-sm text-muted-foreground sm:block">Manage and understand the people connected to your business.</p></div></div><div className="hidden items-center gap-2 sm:flex"><button onClick={() => setModal('import')} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:border-border hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"><Upload size={15} />Import</button><button onClick={() => setModal('export')} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary"><Download size={15} />Export</button><button onClick={() => setModal('create')} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary"><Plus size={16} />Create Contact</button></div></header>
    <div className="mx-auto max-w-[1600px] p-5 lg:p-8"><section aria-label="Contact summary" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{kpis.map(kpi => <article key={kpi.label} className="rounded-xl border border-border bg-[var(--card)] p-4 transition hover:-translate-y-0.5 hover:border-border"><p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{kpi.label}</p><div className="mt-3 flex items-center gap-2"><strong className="text-xl font-semibold text-foreground">{kpi.value}</strong>{kpi.trend && <span className="text-xs text-chart-4">{kpi.trend}</span>}{kpi.tone === 'emerald' && <span className="size-2 rounded-full bg-chart-4" />}{kpi.tone === 'violet' && <Sparkles size={14} className="text-foreground" />}{kpi.tone === 'amber' && <span className="size-2 rounded-full bg-chart-1" />}{kpi.tone === 'rose' && <AlertCircle size={14} className="text-chart-5" />}</div></article>)}</section>
      <section className="mt-6"><div className="relative"><Search className="pointer-events-none absolute left-3 top-3 text-muted-foreground" size={18} /><input className={`${inputClass} pl-10 pr-16`} value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setShowRecent(true)} placeholder="Search contacts... (Name, Email, Company, Phone, ID)" aria-label="Search contacts" /><kbd className="absolute right-3 top-2.5 rounded border border-border bg-secondary px-1.5 py-1 text-[11px] text-muted-foreground">⌘K</kbd>{showRecent && !query && <div className="absolute z-20 mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] p-2 shadow-xl"><p className="px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Recent searches</p>{['Acme Corp', 'john@example.com', 'VIP Enterprise'].map(item => <button key={item} onMouseDown={() => {
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
          }}>{preview.initials}</span><div><h2 className="text-xl font-semibold text-foreground">{preview.name}</h2><p className="mt-1 text-sm text-muted-foreground">{preview.title} · {preview.company}</p><div className="mt-2 flex gap-2"><span className="rounded-md bg-secondary/15 px-2 py-1 text-[10px] text-foreground">{preview.type}</span><span className="rounded-md bg-secondary/10 px-2 py-1 text-[10px] text-foreground">{preview.status}</span></div></div></div><div className="mt-8 space-y-6"><section><h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Contact Info</h3><dl className="mt-3 space-y-3 text-sm"><div><dt className="text-xs text-muted-foreground">Email</dt><dd className="mt-1 text-foreground">{preview.email}</dd></div><div><dt className="text-xs text-muted-foreground">Phone</dt><dd className="mt-1 text-foreground">{preview.phone}</dd></div><div><dt className="text-xs text-muted-foreground">Location</dt><dd className="mt-1 text-foreground">{preview.location}</dd></div></dl></section><section><h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">CRM</h3><dl className="mt-3 space-y-3 text-sm"><div className="flex justify-between"><dt className="text-muted-foreground">Owner</dt><dd className="text-foreground">{preview.owner}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Created</dt><dd className="text-foreground">{preview.created}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Last Activity</dt><dd className="text-foreground">{preview.activity}</dd></div></dl><div className="mt-3 flex flex-wrap gap-1.5">{preview.tags.map(tag => <span key={tag} className="rounded-md bg-secondary/10 px-2 py-1 text-[10px] text-foreground">{tag}</span>)}</div></section><section><div className="flex items-center justify-between"><h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Open Deals</h3><span className="text-[10px] text-foreground">AI Insight · 94%</span></div><div className="mt-3 space-y-2"><div className="rounded-lg bg-[var(--secondary)] p-3 text-sm text-foreground">Enterprise Expansion <strong className="float-right text-chart-4">$84,000</strong></div><div className="rounded-lg bg-[var(--secondary)] p-3 text-sm text-foreground">Growth Retainer <strong className="float-right text-chart-4">$32,500</strong></div></div></section><section><h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Recent Activity</h3>{['Email opened: Q2 expansion plan', 'Meeting completed with account team', 'Deal stage moved to Negotiation'].map((item, i) => <div key={item} className="mt-3 flex gap-3 text-sm"><span className="mt-0.5 text-foreground"><Activity size={14} /></span><div><p className="text-foreground">{item}</p><p className="mt-1 text-xs text-muted-foreground">{['2 hours ago', 'Yesterday', '4 days ago'][i]}</p></div></div>)}</section></div><div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-5"><button className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">Open Contact</button><button className="rounded-lg border border-border px-3 py-2 text-xs text-foreground">Add Task</button><button className="rounded-lg border border-border px-3 py-2 text-xs text-foreground">Add Note</button><button onClick={() => setModal('edit')} className="rounded-lg border border-border p-2 text-foreground" aria-label="Edit contact"><Edit3 size={14} /></button></div></aside>}
    {modal === 'create' && <ModalShell title="Create Contact" onClose={() => setModal(null)}><ContactForm onClose={() => setModal(null)} /></ModalShell>}
    {modal === 'edit' && <ModalShell title="Edit Contact · Sarah Mitchell" onClose={() => setModal(null)}><ContactForm edit onClose={() => setModal(null)} /></ModalShell>}
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
  }} className="p-6"><div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">{edit && <><span className="size-1.5 rounded-full bg-primary text-primary-foreground" />Unsaved changes</>}</div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{fields.map(field => <label key={field} className="text-xs font-medium text-muted-foreground">{field}<input required={field.includes('*')} placeholder={field.replace(' *', '')} defaultValue={edit && field === 'First Name *' ? 'Sarah' : edit && field === 'Last Name *' ? 'Mitchell' : ''} className="mt-1.5 w-full rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5 text-sm text-muted-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" /></label>)}</div><label className="mt-4 block text-xs font-medium text-muted-foreground">Notes<textarea rows={3} className="mt-1.5 w-full resize-none rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label><p className="mt-3 text-xs text-muted-foreground">Required fields are marked with <span className="text-foreground">*</span></p><footer className="mt-6 flex justify-end gap-2 border-t border-border pt-5"><button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground">{edit ? 'Discard' : 'Cancel'}</button><button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">{edit ? 'Save Changes' : 'Create Contact'}</button></footer></form>;
}