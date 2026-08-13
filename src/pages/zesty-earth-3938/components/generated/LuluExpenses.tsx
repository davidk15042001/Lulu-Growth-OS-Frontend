import { useState } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, ChevronDown, ChevronRight, MoreHorizontal, Plus, Sparkles, Download, Upload, CalendarDays, SlidersHorizontal, ArrowUpRight, ArrowDownRight, Check, Clock3, FileText, RotateCcw, X, LayoutDashboard, BrainCircuit, Users, Megaphone, BadgeDollarSign, ShoppingCart, Settings, Zap, Receipt, CircleAlert, ArrowLeftRight, Eye, Pencil, Copy, Trash2, Send, Filter, SlidersHorizontal as Tune, CheckCircle2 } from 'lucide-react';
const navGroups = [{
  label: 'Workspace',
  items: [{
    icon: LayoutDashboard,
    label: 'Dashboard'
  }, {
    icon: BrainCircuit,
    label: 'AI Platform'
  }, {
    icon: Users,
    label: 'CRM'
  }, {
    icon: Megaphone,
    label: 'Marketing'
  }, {
    icon: BadgeDollarSign,
    label: 'Advertising'
  }]
}, {
  label: 'Finance',
  items: [{
    icon: Receipt,
    label: 'Overview'
  }, {
    icon: FileText,
    label: 'Invoices'
  }, {
    icon: FileText,
    label: 'Offers & Quotes'
  }, {
    icon: Receipt,
    label: 'Expenses',
    active: true
  }, {
    icon: ArrowLeftRight,
    label: 'Payments'
  }, {
    icon: ArrowUpRight,
    label: 'Income'
  }, {
    icon: ArrowLeftRight,
    label: 'Transactions'
  }, {
    icon: Users,
    label: 'Vendors'
  }, {
    icon: FileText,
    label: 'Budgets'
  }, {
    icon: LayoutDashboard,
    label: 'Reports'
  }]
}, {
  label: 'Manage',
  items: [{
    icon: ShoppingCart,
    label: 'Sales'
  }, {
    icon: Zap,
    label: 'Operations'
  }, {
    icon: Settings,
    label: 'Settings'
  }]
}];
const expenses = [['EXP-2026-00124', '10 Aug 2026', 'Adobe', 'Software', '€129.00', 'Paid', 'Business Account', 'Not Reimbursable', 'Imported'], ['EXP-2026-00123', '09 Aug 2026', 'Google Ads', 'Advertising', '€2,450.00', 'Paid', 'Marketing Account', 'Not Reimbursable', 'Imported'], ['EXP-2026-00122', '09 Aug 2026', 'WeWork', 'Rent', '€3,200.00', 'Recorded', 'Business Account', 'Not Reimbursable', 'Manual'], ['EXP-2026-00121', '08 Aug 2026', 'Slack', 'Software', '€87.50', 'Pending', 'Business Account', 'Not Reimbursable', 'AI-assisted'], ['EXP-2026-00120', '08 Aug 2026', 'John Smith', 'Travel', '€340.00', 'Reimbursable', 'Operations Account', 'Reimbursable', 'Manual'], ['EXP-2026-00119', '07 Aug 2026', 'AWS', 'Software', '€1,240.00', 'Paid', 'Tech Account', 'Not Reimbursable', 'Imported'], ['EXP-2026-00118', '07 Aug 2026', 'HubSpot', 'Software', '€450.00', 'Draft', 'Marketing Account', 'Not Reimbursable', 'Manual'], ['EXP-2026-00117', '06 Aug 2026', 'UPS', 'Shipping', '€89.00', 'Paid', 'Business Account', 'Not Reimbursable', 'Imported']];
const categories = [['Software', '€8,240', '17.1%', '↑ 18%', '42'], ['Advertising', '€12,450', '25.8%', '↑ 22%', '8'], ['Rent', '€6,400', '13.2%', '—', '2'], ['Travel', '€4,210', '8.7%', '↓ 5%', '18'], ['Professional Services', '€5,800', '12.0%', '↑ 8%', '6'], ['Office', '€2,100', '4.3%', '↓ 3%', '14'], ['Other', '€9,120', '18.9%', '—', '34']];
const vendors = [['Google Ads', '8', '€12,450', '€1,556', 'Yes', '09 Aug', '↑ 22%'], ['WeWork', '2', '€6,400', '€3,200', 'Yes', '09 Aug', '—'], ['AWS', '4', '€4,960', '€1,240', 'Yes', '07 Aug', '↑ 12%'], ['HubSpot', '1', '€450', '€450', 'Yes', '07 Aug', '—'], ['Adobe', '2', '€258', '€129', 'Yes', '10 Aug', '↑ 5%']];
const trend = [{
  d: '01 Aug',
  total: 1200,
  recurring: 700,
  one: 500,
  prev: 980
}, {
  d: '03 Aug',
  total: 3400,
  recurring: 1500,
  one: 1900,
  prev: 2800
}, {
  d: '05 Aug',
  total: 5200,
  recurring: 2900,
  one: 2300,
  prev: 4100
}, {
  d: '07 Aug',
  total: 7600,
  recurring: 4300,
  one: 3300,
  prev: 6100
}, {
  d: '09 Aug',
  total: 11600,
  recurring: 6200,
  one: 5400,
  prev: 9200
}, {
  d: '10 Aug',
  total: 14300,
  recurring: 7800,
  one: 6500,
  prev: 11100
}];
const recurring = [['AWS', 'Cloud infrastructure', '€1,240.00', 'Monthly', '01 Sep 2026', '€14,880', 'Active'], ['HubSpot', 'CRM platform', '€450.00', 'Monthly', '01 Sep 2026', '€5,400', 'Active'], ['Adobe', 'Creative Suite', '€129.00', 'Monthly', '10 Sep 2026', '€1,548', 'Active'], ['Google Workspace', 'Productivity', '€87.00', 'Monthly', '15 Sep 2026', '€1,044', 'Active'], ['Slack', 'Team comms', '€87.50', 'Monthly', '08 Sep 2026', '€1,050', 'Pending']];
const reimbursements = [['John Smith', 'EXP-2026-00120', '€340.00', '08 Aug 2026', 'Pending', '—'], ['Sarah Chen', 'EXP-2026-00115', '€520.00', '05 Aug 2026', 'Approved', '—'], ['Mark Davis', 'EXP-2026-00108', '€180.00', '01 Aug 2026', 'Reimbursed', '06 Aug 2026']];
const filters = ['Status', 'Category', 'Vendor', 'Account', 'Date', 'Amount', 'Currency', 'Recurring', 'Reimbursement', 'Source'];
const statusIcon = (status: string) => status === 'Pending' ? Clock3 : status === 'Reimbursable' ? RotateCcw : status === 'Draft' ? FileText : status === 'Recorded' ? Check : status === 'Paid' ? CheckCircle2 : X;
const statusClass = (status: string) => ({
  Paid: 'bg-chart-4/10 text-chart-4',
  Recorded: 'bg-secondary text-foreground',
  Pending: 'bg-chart-1/10 text-chart-1',
  Reimbursable: 'bg-secondary text-foreground',
  Draft: 'bg-secondary text-muted-foreground'
})[status] || 'bg-secondary text-muted-foreground';
export const LuluExpenses = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState('Month to Date');
  const [detail, setDetail] = useState<string | null>(null);
  const toggle = (id: string) => setSelected(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  return <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
    <aside className="fixed inset-y-0 left-0 z-20 flex w-[238px] flex-col bg-[var(--sidebar)] text-foreground">
      <div className="flex h-[76px] items-center gap-3 border-b border-border px-6"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={17} /></div><strong className="text-[17px] tracking-tight text-foreground">lulu<span className="text-foreground">.ai</span></strong></div>
      <nav className="flex-1 overflow-y-auto px-3 py-5">{navGroups.map(group => <section key={group.label} className="mb-6"><h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">{group.label}</h2><ul>{group.items.map(item => {
              const Icon = item.icon;
              return <li key={item.label}><button className={`mb-0.5 flex w-full items-center gap-3 rounded-md px-3 py-2 text-[12px] transition ${item.active ? 'bg-secondary/15 font-semibold text-foreground ring-1 ring-ring/20' : 'text-foreground hover:bg-secondary hover:text-foreground'}`}><Icon size={15} strokeWidth={1.8} /><span>{item.label}</span>{item.active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" />}</button></li>;
            })}</ul></section>)}</nav>
      <div className="border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-secondary"><div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--primary)] text-xs font-bold text-[var(--primary-foreground)]">MC</div><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-foreground">Maya Collins</strong><small className="text-[10px] text-muted-foreground">Administrator</small></span><Settings size={14} /></button></div>
    </aside>
    <div className="ml-[238px] min-w-[980px]
    ">
      <header className="flex h-[76px] items-center justify-between border-b border-border bg-card px-9"><div><div className="mb-1 flex items-center gap-2 text-[11px] text-muted-foreground"><span>Finance</span><ChevronRight size={12} /><span className="text-foreground">Expenses</span></div><h1 className="text-[22px] font-bold tracking-[-.03em]">Expenses</h1></div><div className="flex items-center gap-2"><button className="flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary"><Plus size={15} />Record Expense</button><button className="flex h-9 items-center gap-2 rounded-md border border-border bg-secondary px-3 text-xs font-semibold text-foreground hover:bg-secondary"><Sparkles size={14} />Ask Lulu AI</button><button className="flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-medium hover:bg-card"><Upload size={14} />Import</button><button className="flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-medium hover:bg-card"><Download size={14} />Export</button><button className="grid h-9 w-9 place-items-center rounded-md border border-border hover:bg-card"><MoreHorizontal size={17} /></button></div></header>
      <div className="px-9 py-6"><div className="mb-5 flex items-end justify-between"><div><p className="text-[13px] text-muted-foreground">Track, categorize and understand your business expenses.</p><p className="mt-1 text-[11px] text-muted-foreground">Last synced 10 Aug 2026, 09:42 · <span className="text-chart-4">● Connected accounts</span></p></div><div className="flex items-center gap-2"><button className="flex h-9 items-center gap-3 rounded-md border border-border bg-card px-3 text-xs font-semibold shadow-sm"><CalendarDays size={14} className="text-muted-foreground" /><span>{period}</span><ChevronDown size={13} /></button><button className="flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs font-medium shadow-sm">vs Previous Period<ChevronDown size={13} /></button></div></div>
      <section className="mb-6 grid grid-cols-7 gap-3">{[['Total Expenses', '€48,320.00', 'Month to Date', '↑ 12.4%'], ['Recurring Expenses', '€18,640.00', 'Month to Date', '↑ 6.2%'], ['One-Time Expenses', '€29,680.00', 'Month to Date', '↑ 18.1%'], ['Outstanding', '€4,210.00', 'Unpaid', '↑ 3.8%'], ['Reimbursable', '€1,850.00', 'Pending reimbursement', '↓ 5.1%'], ['Average Expense', '€387.20', 'Per expense', '↑ 4.7%'], ['Expense Growth', '+12.4%', 'vs Previous Period', 'trend']].map(card => <article key={card[0]} className="rounded-lg border border-border bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,.03)]"><p className="text-[10px] font-semibold text-muted-foreground">{card[0]}</p><strong className="mt-2 block text-[19px] tracking-[-.03em]">{card[1]}</strong><p className="mt-1 text-[10px] text-muted-foreground">{card[2]}</p><span className={`mt-3 inline-flex items-center gap-1 text-[10px] font-semibold ${card[3].startsWith('↓') ? 'text-chart-4' : 'text-chart-5'}`}>{card[3] === 'trend' ? <span className="flex items-end gap-0.5"><i className="h-2 w-1 bg-primary text-primary-foreground" /><i className="h-3 w-1 bg-primary text-primary-foreground" /><i className="h-4 w-1 bg-primary text-primary-foreground" /><i className="h-5 w-1 bg-primary text-primary-foreground" /></span> : card[3]} {card[3] !== 'trend' && <span className="font-normal text-muted-foreground">vs prev.</span>}</span></article>)}</section>
      <section className="mb-5 rounded-lg border border-border bg-card p-4"><div className="flex items-center gap-3"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 text-muted-foreground" size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search expenses..." className="h-9 w-full rounded-md border border-border pl-9 pr-9 text-xs outline-none focus:border-border" />{query && <button onClick={() => setQuery('')} className="absolute right-3 top-2.5 text-foreground"><X size={14} /></button>}</div><button className="flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-semibold"><Tune size={14} />Filters <span className="grid h-4 w-4 place-items-center rounded-full bg-secondary text-[10px] text-foreground">3</span></button><button className="h-9 rounded-md border border-border px-3 text-xs font-medium">Save Filter</button></div><p className="mt-2 pl-1 text-[10px] text-muted-foreground">Search by Expense ID, Description, Vendor, Category, Amount, Reference</p><div className="mt-3 flex items-center gap-2 overflow-hidden">{filters.map(filter => <button key={filter} className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[10px] font-medium text-foreground hover:border-border hover:text-foreground">{filter}<ChevronDown size={11} /></button>)}<button className="shrink-0 text-[11px] font-semibold text-foreground hover:text-foreground">Clear filters</button></div></section>
      {selected.length > 0 && <div className="mb-2 flex items-center gap-3 rounded-lg border border-border bg-secondary px-4 py-2 text-xs"><strong>{selected.length} selected</strong><button>Categorize</button><button>Assign Account</button><button>Mark as Paid</button><button>Mark reimbursable</button><button>Export</button><button className="text-chart-5">Delete</button></div>}
      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,.03)]"><div className="flex items-center justify-between border-b border-border px-5 py-3"><div><h2 className="text-sm font-bold">All expenses</h2><p className="text-[10px] text-muted-foreground">124 records · Updated moments ago</p></div><button className="flex items-center gap-2 text-xs font-medium text-foreground"><SlidersHorizontal size={14} />Columns</button></div><div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-left text-[11px]"><thead className="bg-secondary text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="w-10 px-4 py-3"><input type="checkbox" aria-label="Select all expenses" onChange={e => setSelected(e.target.checked ? expenses.map(x => x[0]) : [])} /></th>{['Expense ID', 'Date', 'Vendor', 'Category', 'Amount', 'Currency', 'Status', 'Account', 'Reimbursement', 'Source', 'Created', 'Actions'].map(h => <th key={h} className={`px-3 py-3 font-semibold ${h === 'Amount' ? 'text-right' : ''}`}>{h}<ChevronDown size={10} className="ml-1 inline" /></th>)}</tr></thead><tbody className="divide-y divide-border">{expenses.map(row => {
                  const Icon = statusIcon(row[5]);
                  return <tr key={row[0]} onClick={() => setDetail(row[0])} className="cursor-pointer transition hover:bg-secondary/40"><td className="px-4 py-3" onClick={e => e.stopPropagation()}><input type="checkbox" checked={selected.includes(row[0])} onChange={() => toggle(row[0])} aria-label={`Select ${row[0]}`} /></td><td className="px-3 py-3 font-semibold text-foreground">{row[0]}</td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{row[1]}</td><td className="px-3 py-3 font-semibold">{row[2]}</td><td className="px-3 py-3 text-right font-semibold">{row[4]}</td><td className="px-3 py-3 text-muted-foreground">EUR</td><td className="px-3 py-3"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${statusClass(row[5])}`}><Icon size={11} />{row[5]}</span></td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{row[6]}</td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{row[7]}</td><td className="px-3 py-3 text-muted-foreground">{row[8]}</td><td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{row[1]}</td><td className="px-3 py-3"><button aria-label={`Actions for ${row[0]}`} onClick={e => e.stopPropagation()} className="rounded p-1 hover:bg-secondary"><MoreHorizontal size={16} /></button></td></tr>;
                })}</tbody></table></div><div className="flex items-center justify-between border-t border-border px-5 py-3 text-[11px] text-muted-foreground"><span>Showing <strong className="text-foreground">1–10</strong> of 124 expenses</span><div className="flex items-center gap-2"><span>Rows per page</span><button className="flex items-center gap-2 rounded border border-border px-2 py-1">10<ChevronDown size={11} /></button><button className="rounded border border-border p-1.5 opacity-50"><ChevronRight size={13} className="rotate-180" /></button><button className="rounded border border-border p-1.5 hover:bg-card"><ChevronRight size={13} /></button></div></div></section>
      <section className="mt-6 rounded-lg border border-border bg-card p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-base font-bold">Expense Trend</h2><p className="text-[10px] text-muted-foreground">Daily view · Month to Date</p></div><div className="flex rounded-md border border-border p-0.5 text-[10px] font-semibold"><button className="rounded bg-secondary px-3 py-1.5 text-foreground">Daily</button><button className="px-3 py-1.5 text-foreground">Weekly</button><button className="px-3 py-1.5 text-foreground">Monthly</button></div></div><div className="h-[245px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend}><defs><linearGradient id="violetFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={.25} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="var(--background)" vertical={false} /><XAxis dataKey="d" tick={{
                  fontSize: 10,
                  fill: 'var(--muted-foreground)'
                }} axisLine={false} tickLine={false} /><YAxis tick={{
                  fontSize: 10,
                  fill: 'var(--muted-foreground)'
                }} axisLine={false} tickLine={false} tickFormatter={v => `€${v / 1000}k`} /><Tooltip /><Area type="monotone" dataKey="total" stroke="var(--foreground)" fill="url(#violetFill)" strokeWidth={2} /><Line type="monotone" dataKey="recurring" stroke="var(--foreground)" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="one" stroke="var(--muted-foreground)" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="prev" stroke="var(--background)" strokeDasharray="5 5" dot={false} /></AreaChart></ResponsiveContainer></div><div className="mt-2 flex justify-center gap-5 text-[10px] text-muted-foreground"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Total Expenses</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Recurring</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-muted" />One-Time</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full border border-border" />Previous period</span></div></section>
      <div className="mt-5 grid grid-cols-2 gap-5"><section className="rounded-lg border border-border bg-card p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-bold">Expense Categories</h2><p className="text-[10px] text-muted-foreground">Where your money goes</p></div><button className="rounded border border-border px-2 py-1 text-[10px]">Current <ChevronDown size={11} className="ml-1 inline" /></button></div><div className="mb-5 flex h-2 overflow-hidden rounded-full">{categories.map((c, i) => <span key={c[0]} style={{
                width: c[2]
              }} className={`bg-${['violet', 'indigo', 'slate', 'sky', 'purple', 'blue', 'gray'][i]}-500`} />)}</div><table className="w-full text-[10px]"><thead className="border-b border-border text-left text-muted-foreground"><tr>{['Category', 'Total Spend', '% of Expenses', 'Change', '# Expenses'].map(h => <th key={h} className="pb-2 font-semibold">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{categories.map(c => <tr key={c[0]}><td className="py-2 font-semibold">{c[0]}</td><td className="py-2 font-semibold">{c[1]}</td><td className="py-2 text-muted-foreground">{c[2]}</td><td className={`py-2 ${c[3].startsWith('↓') ? 'text-foreground' : 'text-chart-5'}`}>{c[3]}</td><td className="py-2 text-muted-foreground">{c[4]}</td></tr>)}</tbody></table></section><section className="rounded-lg border border-border bg-card p-5"><h2 className="text-sm font-bold">Vendor Expenses</h2><p className="mb-4 text-[10px] text-muted-foreground">Top vendors by total spend</p><table className="w-full text-[10px]"><thead className="border-b border-border text-left text-muted-foreground"><tr>{['Vendor', 'Expenses', 'Total Spend', 'Avg', 'Recurring', 'Last Expense', 'Growth'].map(h => <th key={h} className="pb-2 font-semibold">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{vendors.map(v => <tr key={v[0]}><td className="py-2 font-semibold">{v[0]}</td><td className="py-2">{v[1]}</td><td className="py-2 font-semibold">{v[2]}</td><td className="py-2 text-muted-foreground">{v[3]}</td><td className="py-2 text-foreground">{v[4]}</td><td className="py-2 text-muted-foreground">{v[5]}</td><td className="py-2 text-chart-5">{v[6]}</td></tr>)}</tbody></table></section></div>
      <div className="mt-5 grid grid-cols-2 gap-5"><section className="rounded-lg border border-border bg-card p-5"><h2 className="text-sm font-bold">Recurring Expenses</h2><p className="mb-4 text-[10px] text-muted-foreground">Active subscriptions and scheduled payments</p><table className="w-full text-[10px]"><thead className="border-b border-border text-left text-muted-foreground"><tr>{['Vendor', 'Description', 'Amount', 'Frequency', 'Next Occurrence', 'Annual Cost', 'Status'].map(h => <th key={h} className="pb-2 font-semibold">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{recurring.map(r => <tr key={r[0]}><td className="py-2 font-semibold">{r[0]}</td><td className="py-2 text-muted-foreground">{r[1]}</td><td className="py-2 font-semibold">{r[2]}</td><td className="py-2">{r[3]}</td><td className="py-2 text-muted-foreground">{r[4]}</td><td className="py-2">{r[5]}</td><td className="py-2"><span className={`rounded-full px-2 py-1 ${r[6] === 'Pending' ? 'bg-chart-1/10 text-chart-1' : 'bg-secondary text-foreground'}`}>{r[6]}</span></td></tr>)}</tbody></table></section><section className="rounded-lg border border-border bg-card p-5"><h2 className="text-sm font-bold">Reimbursements</h2><p className="mb-4 text-[10px] text-muted-foreground">Employee expenses awaiting action</p><table className="w-full text-[10px]"><thead className="border-b border-border text-left text-muted-foreground"><tr>{['Employee', 'Expense', 'Amount', 'Date', 'Status', 'Reimbursement Date'].map(h => <th key={h} className="pb-2 font-semibold">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{reimbursements.map(r => <tr key={r[1]}><td className="py-2 font-semibold">{r[0]}</td><td className="py-2 text-foreground">{r[1]}</td><td className="py-2 font-semibold">{r[2]}</td><td className="py-2 text-muted-foreground">{r[3]}</td><td className="py-2"><span className={`rounded-full px-2 py-1 ${r[4] === 'Pending' ? 'bg-chart-1/10 text-chart-1' : r[4] === 'Approved' ? 'bg-secondary text-foreground' : 'bg-chart-4/10 text-chart-4'}`}>{r[4]}</span></td><td className="py-2 text-muted-foreground">{r[5]}</td></tr>)}</tbody></table></section></div>
      <div className="mt-5 grid grid-cols-[1.2fr_.8fr] gap-5"><section className="rounded-lg border border-border bg-card p-5"><h2 className="text-sm font-bold">Budget Impact</h2><p className="mb-4 text-[10px] text-muted-foreground">Connected budget periods · <span className="text-foreground">Calculated</span></p><table className="w-full text-[10px]"><thead className="border-b border-border text-left text-muted-foreground"><tr>{['Category', 'Budget', 'Actual', 'Remaining', 'Variance', 'Action'].map(h => <th key={h} className="pb-2 font-semibold">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{[['Software', '€10,000', '€8,240', '€1,760', '-17.6% (under)'], ['Advertising', '€10,000', '€12,450', '-€2,450', '+24.5% (over)'], ['Travel', '€5,000', '€4,210', '€790', '-15.8%'], ['Rent', '€6,400', '€6,400', '€0', '0%']].map(r => <tr key={r[0]} className={r[0] === 'Advertising' ? 'bg-secondary/60' : ''}><td className="py-2 font-semibold">{r[0]}</td><td className="py-2">{r[1]}</td><td className="py-2 font-semibold">{r[2]}</td><td className="py-2">{r[3]}</td><td className={r[0] === 'Advertising' ? 'py-2 font-semibold text-chart-5' : 'py-2 text-foreground'}>{r[4]}</td><td className="py-2 font-semibold text-foreground">View Budget</td></tr>)}</tbody></table><button className="mt-4 text-[11px] font-semibold text-foreground">View all budgets <ArrowUpRight size={12} className="inline" /></button></section><section className="rounded-lg border border-border bg-card p-5"><div className="mb-4 flex items-center gap-2"><h2 className="text-sm font-bold">Expense Anomalies</h2><span className="rounded-full bg-chart-5/10 px-2 py-0.5 text-[10px] font-bold text-chart-5">3</span></div>{[['High', 'EXP-2026-00119', 'Advertising spend 24.5% over budget', 'Detected 2h ago', 'New'], ['Medium', 'EXP-2026-00121', 'Duplicate-looking expense: Slack', 'Detected 4h ago', 'New'], ['Medium', 'Professional Services', 'Unusual one-time expense ↑ 45%', 'Detected 1d ago', 'Investigating']].map(a => <article key={a[1]} className={`mb-3 border-l-2 ${a[0] === 'High' ? 'border-chart-5' : 'border-border'} bg-card p-3`}><div className="flex items-start gap-2"><CircleAlert size={14} className={a[0] === 'High' ? 'text-chart-5' : 'text-foreground'} /><div className="min-w-0 flex-1"><div className="flex justify-between"><strong className="text-[10px]">{a[1]}</strong><span className="text-[9px] text-muted-foreground">{a[3]}</span></div><p className="mt-1 text-[10px] text-muted-foreground">{a[2]}</p><div className="mt-2 flex items-center justify-between"><span className="rounded-full bg-card px-2 py-1 text-[9px] text-muted-foreground">{a[4]}</span><div className="flex gap-2 text-[9px] font-semibold text-foreground"><button>Investigate</button><button>Ask Lulu AI</button></div></div></div></div></article>)}</section></div>
      <section className="mt-5 rounded-lg border border-border bg-gradient-to-br from-secondary to-white p-5"><div className="mb-4 flex items-center gap-2"><Sparkles size={17} className="text-foreground" /><h2 className="text-base font-bold">AI Expense Insights</h2><span className="rounded-full bg-secondary px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-foreground">AI-generated</span></div><div className="grid grid-cols-2 gap-4">{[['Software expenses increased 18% compared with the previous period, primarily due to newly recorded recurring subscriptions.', 'Software', '€8,240', '€6,983', '↑ 18.0%'], ['Advertising spend has exceeded its monthly budget by €2,450. Three Google Ads campaigns account for 94% of this category.', 'Advertising', '€12,450', '€10,000', '↑ 24.5%']].map(insight => <article key={insight[1]} className="rounded-lg border border-border bg-card p-4"><p className="text-xs leading-5 text-foreground">{insight[0]}</p><table className="my-3 w-full text-[10px]"><tbody><tr className="border-y border-border"><td className="py-2 font-semibold">{insight[1]}</td><td className="py-2">Current {insight[2]}</td><td className="py-2">Previous {insight[3]}</td><td className="py-2 font-semibold text-chart-5">{insight[4]}</td></tr></tbody></table><div className="flex justify-between text-[10px] font-semibold"><button className="text-foreground">View related records <ArrowUpRight size={11} className="inline" /></button><span className="font-normal text-muted-foreground">AI Insight · 9:42 AM</span></div></article>)}</div></section>
      <section className="mt-5"><div className="mb-3 flex items-center gap-2"><Sparkles size={16} className="text-foreground" /><h2 className="text-base font-bold">AI Recommendations</h2><span className="rounded-full bg-secondary px-2 py-1 text-[9px] font-bold uppercase text-foreground">AI Recommendation</span></div><div className="grid grid-cols-3 gap-4">{[['Review advertising budget allocation', 'Advertising exceeded monthly budget by €2,450. Consider reviewing campaign spend or adjusting the budget.'], ['Review Slack subscription status', 'Slack expense shows Pending status. Confirm payment to avoid service interruption.'], ['Investigate duplicate expense', 'EXP-2026-00121 and EXP-2026-00105 appear similar. Review to avoid double-recording.']].map(r => <article key={r[0]} className="rounded-lg border border-border bg-card p-4"><div className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-secondary text-foreground">💡</span><div><h3 className="text-xs font-bold">{r[0]}</h3><p className="mt-1 text-[10px] leading-4 text-muted-foreground">{r[1]}</p><div className="mt-3 flex items-center gap-3 text-[10px] font-semibold"><button className="text-foreground">View Expense</button><button className="flex items-center gap-1 text-foreground"><Sparkles size={11} />Ask Lulu AI</button></div></div></div></article>)}</div></section>
      <section className="my-6 rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-foreground"><Sparkles size={16} /></div><div><h2 className="text-sm font-bold">Ask Lulu AI</h2><p className="text-[10px] text-muted-foreground">Your expense assistant · AI-powered answers from connected data</p></div></div><div className="mt-4 flex h-12 items-center rounded-lg border border-border px-4"><input className="flex-1 text-sm outline-none" placeholder="Ask Lulu AI about your expenses..." /><button className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground hover:bg-primary"><Send size={14} /></button></div><div className="mt-3 flex gap-2 overflow-hidden">{['How much did we spend this month?', 'Which categories cost the most?', 'Which vendors cost us the most?', 'Why did expenses increase?', 'Find unusual expenses.', 'Show recurring expenses.', 'Compare expenses with last month.'].map(prompt => <button key={prompt} className="shrink-0 rounded-full border border-border px-3 py-1.5 text-[10px] text-foreground hover:border-border hover:text-foreground">{prompt}</button>)}</div><p className="mt-4 text-[10px] text-muted-foreground">Lulu AI uses actual financial data from connected accounts and records. <span className="font-semibold text-foreground">Calculated · AI Insight</span></p></section>
      </div>
    </div>
    {detail && <aside className="fixed right-0 top-0 z-30 h-full w-[390px] border-l border-border bg-card p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Expense detail</p><h2 className="mt-1 text-lg font-bold">{detail}</h2></div><button onClick={() => setDetail(null)} className="rounded p-2 hover:bg-secondary"><X size={18} /></button></div><div className="mt-8 rounded-lg bg-card p-4"><p className="text-[10px] text-muted-foreground">Total amount</p><strong className="mt-1 block text-3xl">€340.00</strong><span className="mt-2 inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-foreground"><RotateCcw size={11} />Reimbursable</span></div><dl className="mt-6 space-y-4 text-xs"><div className="flex justify-between"><dt className="text-muted-foreground">Vendor</dt><dd className="font-semibold">John Smith</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Category</dt><dd className="font-semibold">Travel</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Date</dt><dd className="font-semibold">08 Aug 2026</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Account</dt><dd className="font-semibold">Operations Account</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Source</dt><dd className="font-semibold">Manual · Confirmed</dd></div></dl><div className="mt-8 flex gap-2"><button className="flex-1 rounded-md bg-primary py-2.5 text-xs font-semibold text-primary-foreground">Edit expense</button><button className="rounded-md border border-border px-4 py-2.5 text-xs font-semibold">Export</button></div></aside>}
  </main>;
};