import { useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Bell, Bot, BriefcaseBusiness, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Download, FileText, Filter, LayoutDashboard, MoreHorizontal, Plus, Search, Settings2, Sparkles, WalletCards, X, ArrowUpRight, AlertTriangle, CheckCircle2, Clock3, ShieldCheck, SlidersHorizontal, Receipt, CircleDollarSign } from 'lucide-react';
type Status = 'Paid' | 'Partially Paid' | 'Due' | 'Overdue' | 'Estimated' | 'Draft';
const records = [{
  type: 'VAT',
  country: 'Germany',
  period: 'Q3 2026',
  taxable: '€125,000',
  tax: '€23,750',
  paid: '€20,000',
  remaining: '€3,750',
  due: '31 Oct 2026',
  status: 'Partially Paid' as Status,
  updated: '08 Aug 2026'
}, {
  type: 'Corporate Tax',
  country: 'United Kingdom',
  period: 'FY 2026',
  taxable: '€280,000',
  tax: '€53,200',
  paid: '€53,200',
  remaining: '€0',
  due: '31 Jan 2027',
  status: 'Paid' as Status,
  updated: '05 Aug 2026'
}, {
  type: 'Withholding Tax',
  country: 'Germany',
  period: 'Q3 2026',
  taxable: '€45,000',
  tax: '€6,750',
  paid: '€0',
  remaining: '€6,750',
  due: '31 Oct 2026',
  status: 'Due' as Status,
  updated: '01 Aug 2026'
}, {
  type: 'VAT',
  country: 'France',
  period: 'Q2 2026',
  taxable: '€98,000',
  tax: '€19,600',
  paid: '€19,600',
  remaining: '€0',
  due: '31 Jul 2026',
  status: 'Overdue' as Status,
  updated: '12 Jul 2026'
}, {
  type: 'Local Business Tax',
  country: 'Germany',
  period: 'H1 2026',
  taxable: '€210,000',
  tax: '€4,200',
  paid: '€0',
  remaining: '€4,200',
  due: '15 Sep 2026',
  status: 'Estimated' as Status,
  updated: '03 Aug 2026'
}];
const deadlines = [{
  icon: '▦',
  type: 'VAT',
  country: 'Germany',
  period: 'Q3 2026',
  date: '31 Oct 2026',
  amount: '€3,750',
  status: 'Due',
  days: '84 days'
}, {
  icon: '◈',
  type: 'Withholding Tax',
  country: 'Germany',
  period: 'Q3 2026',
  date: '31 Oct 2026',
  amount: '€6,750',
  status: 'Due',
  days: '84 days'
}, {
  icon: '▤',
  type: 'Local Business Tax',
  country: 'Germany',
  period: 'H1 2026',
  date: '15 Sep 2026',
  amount: '€4,200',
  status: 'Estimated',
  days: '38 days'
}, {
  icon: '◇',
  type: 'Corporate Tax',
  country: 'France',
  period: 'FY 2026',
  date: '15 Dec 2026',
  amount: 'TBD',
  status: 'Draft',
  days: '130 days'
}];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const calendarDays = [27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6];
const expenses = [['Software & SaaS', '€18,200', '€3,458', 'Deductible', 'Classified', 'green'], ['Travel & Entertainment', '€12,400', '€2,356', 'Partially Deductible', 'Needs Review', 'amber'], ['Office Supplies', '€3,200', '€608', 'Deductible', 'Classified', 'green'], ['Contractor Payments', '€24,000', '€4,560', 'Deductible', 'Classified', 'green'], ['Miscellaneous', '€8,400', '—', '—', 'Unclassified', 'red']];
function StatusBadge({
  status
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    Paid: 'bg-chart-4/10 text-chart-4',
    'Partially Paid': 'bg-chart-1/10 text-chart-1',
    Due: 'bg-chart-1/10 text-chart-1',
    Overdue: 'bg-chart-5/10 text-chart-5',
    Estimated: 'bg-secondary text-foreground',
    Draft: 'bg-secondary text-muted-foreground',
    Filed: 'bg-secondary text-foreground'
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status] || 'bg-secondary text-muted-foreground'}`}>{status}</span>;
}
function Transparency({
  kind
}: {
  kind: 'Recorded' | 'Calculated' | 'Estimated' | 'AI Insight';
}) {
  const styles = {
    Recorded: 'bg-muted text-foreground',
    Calculated: 'border border-border text-foreground bg-secondary/40',
    Estimated: 'border border-border text-foreground bg-secondary/40',
    'AI Insight': 'bg-gradient-to-r from-primary to-primary text-foreground'
  };
  return <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${styles[kind]}`}>{kind}</span>;
}
function Section({
  title,
  eyebrow,
  children,
  action
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  action?: string;
}) {
  return <section className="rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,.03)]"><div className="flex items-center justify-between border-b border-border px-5 py-4"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-muted-foreground">{eyebrow}</p><h2 className="mt-0.5 text-[15px] font-bold text-foreground">{title}</h2></div>{action && <button className="text-xs font-semibold text-foreground hover:text-foreground">{action}</button>}</div>{children}</section>;
}
export function LuluTaxes() {
  const [activeNav, setActiveNav] = useState('Taxes');
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState('Current Quarter');
  const [calendarMode, setCalendarMode] = useState('Month');
  const [breakdown, setBreakdown] = useState('By Type');
  const [notice, setNotice] = useState('');
  const { items: liveTaxes, loading: liveLoading, error: liveError } = useLiveRecords('finance_taxes');
  const liveEmpty = !liveLoading && !liveError && liveTaxes.length === 0;
  const nav = [{
    label: 'Overview',
    icon: LayoutDashboard
  }, {
    label: 'Invoices',
    icon: Receipt
  }, {
    label: 'Offers & Quotes',
    icon: FileText
  }, {
    label: 'Income',
    icon: ArrowUpRight
  }, {
    label: 'Transactions',
    icon: WalletCards
  }, {
    label: 'Payments',
    icon: CircleDollarSign
  }, {
    label: 'Expenses',
    icon: BriefcaseBusiness
  }, {
    label: 'Cash Flow',
    icon: SlidersHorizontal
  }, {
    label: 'Taxes',
    icon: ShieldCheck
  }];
  const filteredRecords = records.filter(record => `${record.type} ${record.country} ${record.period}`.toLowerCase().includes(query.toLowerCase()));
  const toast = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2500);
  };
  return <div className="min-h-screen bg-[var(--background)] text-foreground">{liveLoading ? <div className="border-b border-border bg-secondary/30 px-4 py-3 text-xs text-muted-foreground">Loading live tax records…</div> : liveError ? <div className="border-b border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">{liveError}</div> : liveEmpty ? <div className="border-b border-dashed border-border bg-card px-4 py-3 text-xs text-muted-foreground">No live tax records are available yet. Add tax data or connect your finance platform to begin.</div> : null}
    <aside className="fixed inset-y-0 left-0 hidden w-[228px] flex-col border-r border-border bg-card lg:flex"><div className="flex h-16 items-center gap-3 border-b border-border px-5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--secondary)] text-sm font-black text-foreground">L</div><span className="text-[17px] font-extrabold tracking-tight">lulu <span className="font-normal text-muted-foreground">ai</span></span></div><div className="px-4 pt-6"><p className="px-2 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">Workspace</p><button className="mt-3 flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-left text-xs font-semibold"><span>Workspace finance</span><ChevronDown size={14} className="text-muted-foreground" /></button></div><LuluSectionNavigation activeId="sturdy-week-3372" /><div className="border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-xs text-foreground hover:bg-card"><Settings2 size={16} /><span>Settings</span></button><div className="mt-3 flex items-center gap-2 px-2"><div className="flex h-7 w-7 items-center justify-center rounded-full bg-sidebar text-[10px] font-bold">JD</div><div><p className="text-xs font-semibold">Workspace administrator</p><p className="text-[10px] text-muted-foreground">Admin</p></div></div></div></aside>
    <div className="lg:pl-[228px]"><header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-secondary px-5 backdrop-blur md:px-8"><div className="flex items-center gap-3"><span className="text-sm font-bold text-foreground">Finance</span><span className="text-foreground">/</span><span className="text-sm text-muted-foreground">Taxes</span></div><div className="flex items-center gap-2"><button aria-label="Help" className="hidden rounded-lg p-2 text-foreground hover:bg-card sm:block"><CircleHelp size={18} /></button><button aria-label="Notifications" className="rounded-lg p-2 text-foreground hover:bg-card"><Bell size={18} /></button><div className="ml-2 hidden h-7 w-px bg-secondary sm:block" /><div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--secondary)] text-[10px] font-bold text-foreground">JD</div></div></header>
      <main className="mx-auto max-w-[1500px] px-4 py-7 md:px-8 lg:px-10"><div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-2 text-xs font-semibold text-foreground">Finance / Taxes</p><h1 className="text-3xl font-extrabold tracking-[-.04em] text-foreground md:text-[38px]">Taxes</h1><p className="mt-2 text-sm text-muted-foreground">Monitor tax-related financial data, obligations, payments and deadlines in one place.</p></div><div className="flex flex-wrap items-end gap-2"><label className="text-[11px] font-semibold text-muted-foreground"><span className="mb-1 block">Tax Jurisdiction</span><button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold">🇩🇪 Germany · All regions <ChevronDown size={13} /></button></label><label className="text-[11px] font-semibold text-muted-foreground"><span className="mb-1 block">Tax Period</span><select value={period} onChange={e => setPeriod(e.target.value)} className="h-9 rounded-lg border border-border bg-card px-3 text-xs font-semibold outline-none"><option>Current Month</option><option>Previous Month</option><option>Current Quarter</option><option>Previous Quarter</option><option>Current Year</option><option>Previous Year</option><option>Custom</option></select></label></div></div><div className="mt-5 flex flex-wrap gap-2"><button onClick={() => toast('New tax record form opened')} className="flex h-9 items-center gap-2 rounded-lg bg-[var(--primary)] px-3.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary"><Plus size={15} /> Add Tax Record</button><button onClick={() => toast('Ask Lulu AI is ready')} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-xs font-bold text-foreground hover:bg-card"><Sparkles size={14} className="text-foreground" /> Ask Lulu AI</button><button onClick={() => toast('Export prepared')} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3.5 text-xs font-bold text-foreground hover:bg-card"><Download size={14} /> Export</button><button aria-label="More actions" className="flex h-9 items-center rounded-lg border border-border bg-card px-2.5 text-foreground hover:bg-card"><MoreHorizontal size={17} /></button></div>
        <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">{[['Estimated Tax Liability', '€47,320', 'Estimated', 'amber', '+8.4%'], ['Tax Paid', '€31,500', 'Recorded', 'green', '+12.1%'], ['Tax Due', '€15,820', 'Recorded', 'orange', '−4.2%'], ['Upcoming', '€8,200', 'Calculated', 'blue', '2 deadlines'], ['Overdue', '€3,750', 'Recorded', 'red', '1 record'], ['Taxable Revenue', '€312,400', 'Calculated', 'blue', '+11.8%'], ['Taxable Expenses', '€89,600', 'Calculated', 'blue', '+6.2%']].map(([label, value, tag, color, trend]) => <article key={label} className="rounded-xl border border-border bg-card p-4"><div className="flex items-start justify-between gap-1"><p className="text-[11px] font-medium leading-4 text-muted-foreground">{label}</p><span className={`h-2 w-2 shrink-0 rounded-full ${color === 'green' ? 'bg-chart-4' : color === 'red' ? 'bg-destructive' : color === 'amber' ? 'bg-chart-1' : color === 'orange' ? 'bg-chart-1' : 'bg-primary'}`} /></div><p className="mt-3 text-[21px] font-extrabold tracking-tight text-foreground">{value}</p><div className="mt-2 flex items-center justify-between gap-1"><Transparency kind={tag as 'Recorded' | 'Calculated' | 'Estimated'} /><span className="text-[10px] font-semibold text-muted-foreground">{trend}</span></div></article>)}</div>
        <div className="mt-7 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3"><div className="relative min-w-[210px] flex-1"><Search size={15} className="absolute left-3 top-2.5 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tax records..." className="h-9 w-full rounded-lg border border-border pl-9 pr-3 text-xs outline-none focus:border-border" /></div>{['Tax Type', 'Jurisdiction', 'Period', 'Status', 'Due Date'].map(filter => <button key={filter} className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-card"><Filter size={13} className="text-muted-foreground" />{filter}<ChevronDown size={13} /></button>)}<button onClick={() => setQuery('')} className="h-9 rounded-lg px-2 text-xs font-semibold text-foreground hover:text-foreground">Clear Filters</button><button onClick={() => toast('Filter saved')} className="h-9 rounded-lg bg-primary px-3 text-xs font-bold text-primary-foreground">Save Filter</button></div>
        <Section title={`Tax Records`} eyebrow={`${filteredRecords.length} records`} action="View all"><div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left text-xs"><thead className="bg-card/70 text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Tax Type', 'Jurisdiction', 'Period', 'Taxable Amount', 'Tax Amount', 'Paid', 'Remaining', 'Due Date', 'Status', 'Last Updated', ''].map(head => <th key={head} className="px-4 py-3 font-bold">{head}</th>)}</tr></thead><tbody className="divide-y divide-border">{filteredRecords.map(record => <tr key={`${record.type}-${record.country}-${record.period}`} className="hover:bg-secondary/30"><td className="px-4 py-3.5 font-bold text-foreground">{record.type}</td><td className="px-4 py-3.5 text-muted-foreground">{record.country}</td><td className="px-4 py-3.5 text-muted-foreground">{record.period}</td><td className="px-4 py-3.5 font-medium">{record.taxable}</td><td className="px-4 py-3.5 font-semibold">{record.tax}</td><td className="px-4 py-3.5 text-muted-foreground">{record.paid}</td><td className="px-4 py-3.5 font-semibold text-foreground">{record.remaining}</td><td className="px-4 py-3.5 text-muted-foreground">{record.due}</td><td className="px-4 py-3.5"><StatusBadge status={record.status} /></td><td className="px-4 py-3.5 text-muted-foreground">{record.updated}</td><td className="px-4 py-3.5"><button aria-label={`Actions for ${record.type}`} className="rounded p-1 text-foreground hover:bg-secondary"><MoreHorizontal size={16} /></button></td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground"><span>Showing 1–{filteredRecords.length} of 12 records</span><div className="flex items-center gap-1"><button className="rounded border border-border p-1.5"><ChevronLeft size={14} /></button><span className="rounded bg-primary px-2 py-1 font-bold text-primary-foreground">1</span><span className="px-1">2</span><span className="px-1">3</span><button className="rounded border border-border p-1.5"><ChevronRight size={14} /></button></div></div></Section>
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]"><Section title="Upcoming Tax Deadlines" eyebrow="Stay ahead of obligations"><div className="divide-y divide-border">{deadlines.map(item => <div key={item.type} className="flex flex-wrap items-center gap-3 px-5 py-3.5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-sm text-foreground">{item.icon}</div><div className="min-w-[130px] flex-1"><p className="text-xs font-bold">{item.type} <span className="font-normal text-muted-foreground">· {item.country}</span></p><p className="mt-1 text-[11px] text-muted-foreground">{item.period} · {item.date}</p></div><strong className="text-xs">{item.amount}</strong><StatusBadge status={item.status} /><span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-muted-foreground">{item.days}</span><button onClick={() => toast(`Opened ${item.type}`)} className="rounded border border-border px-2 py-1 text-[10px] font-bold text-foreground">Open</button><button onClick={() => toast('Reminder added')} className="hidden rounded border border-border px-2 py-1 text-[10px] font-bold text-foreground sm:block">Add Reminder</button></div>)}</div></Section><Section title="Tax Calendar" eyebrow="August 2026"><div className="flex items-center justify-between px-5 py-3"><button><ChevronLeft size={16} /></button><p className="text-xs font-bold">August 2026</p><button><ChevronRight size={16} /></button></div><div className="flex gap-1 px-5 pb-3">{['Month', 'Quarter', 'Year'].map(mode => <button key={mode} onClick={() => setCalendarMode(mode)} className={`rounded px-3 py-1.5 text-[10px] font-bold ${calendarMode === mode ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>{mode}</button>)}</div><div className="grid grid-cols-7 gap-y-2 border-t border-border p-4 text-center text-[10px]"><div className="contents text-muted-foreground">{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <span key={day} className="py-1 font-bold">{day}</span>)}</div>{calendarDays.map((day, index) => <button title={[15, 31].includes(day) ? 'Tax deadline: review record' : ''} key={`${day}-${index}`} className={`relative rounded py-1.5 ${index < 5 ? 'text-foreground' : 'text-muted-foreground'} ${day === 15 || day === 31 ? 'font-bold text-foreground' : ''}`}>{day}{(day === 15 || day === 31) && <span className="mx-auto mt-0.5 block h-1 w-1 rounded-full bg-primary text-primary-foreground" />}</button>)}</div></Section></div>
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]"><Section title="Tax Liability Trend" eyebrow="Liability over time"><div className="flex items-center justify-between px-5 pt-4"><div className="flex gap-1">{['Monthly', 'Quarterly', 'Annual'].map(mode => <button key={mode} className={`rounded px-2.5 py-1 text-[10px] font-bold ${mode === 'Monthly' ? 'bg-secondary text-foreground' : 'text-foreground'}`}>{mode}</button>)}</div><div className="flex gap-3 text-[10px] text-muted-foreground"><span>━ Recorded</span><span className="text-foreground">┄ Estimated</span></div></div><div className="px-5 pb-4 pt-2"><svg viewBox="0 0 700 220" className="h-[220px] w-full" role="img" aria-label="Tax liability trend from January to August 2026"><path d="M35 185 H680 M35 135 H680 M35 85 H680 M35 35 H680" stroke="var(--border)" /><path d="M35 180 C120 165 140 150 210 158 S300 100 370 123 S450 96 520 90 S600 55 680 66 L680 185 L35 185Z" fill="var(--border)" opacity=".7" /><path d="M35 180 C120 165 140 150 210 158 S300 100 370 123 S450 96 520 90 S600 55 680 66" fill="none" stroke="var(--chart-3)" strokeWidth="3" /><path d="M35 166 C120 154 140 140 210 148 S300 116 370 108 S450 82 520 75 S600 62 680 40" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeDasharray="6 6" />{months.map((month, index) => <text key={month} x={35 + index * 92} y="207" fill="var(--muted-foreground)" fontSize="11">{month}</text>)}</svg><p className="border-t border-border pt-3 text-[10px] text-muted-foreground">Estimated values are derived from available financial data.</p></div></Section><Section title="Tax Breakdown" eyebrow="Distribution"><div className="flex gap-1 px-5 pt-4">{['By Type', 'By Jurisdiction', 'By Period', 'By Entity'].map(tab => <button key={tab} onClick={() => setBreakdown(tab)} className={`rounded px-2 py-1.5 text-[10px] font-bold ${breakdown === tab ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>{tab}</button>)}</div><div className="flex items-center gap-5 p-5"><div className="h-32 w-32 rounded-full" style={{
                background: 'conic-gradient(var(--primary) 0 46%, var(--primary) 46% 72%, var(--primary) 72% 88%, var(--muted) 88% 100%)'
              }}><div className="m-7 flex h-[74px] w-[74px] items-center justify-center rounded-full bg-card text-center text-[10px] font-bold text-muted-foreground">€47,320<br /><span className="font-normal">total tax</span></div></div><div className="flex-1 space-y-2 text-[11px]"><div className="flex justify-between"><span>VAT</span><strong>46% · €23,750</strong></div><div className="flex justify-between"><span>Corporate Tax</span><strong>26% · €13,400</strong></div><div className="flex justify-between"><span>Withholding Tax</span><strong>16% · €6,750</strong></div><div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3 text-muted-foreground"><span>Taxable Amount <b className="block text-foreground">€312,400</b></span><span>Outstanding <b className="block text-foreground">€15,820</b></span></div></div></div></Section></div>
        <div className="mt-6 grid gap-6 xl:grid-cols-2"><Section title="Taxable Revenue" eyebrow="Revenue classification"><div className="grid gap-3 p-5">{[['Total Revenue', '€312,400', 'Source Data'], ['Taxable Revenue', '€289,000', 'Calculated'], ['Non-Taxable Revenue', '€23,400', 'Calculated'], ['Tax Amount', '€47,320', 'Calculated']].map(([label, value, tag]) => <div key={label} className="flex items-center justify-between border-b border-border pb-3 text-xs"><span className="text-muted-foreground">{label}</span><span className="flex items-center gap-3 font-bold">{value}<Transparency kind={tag === 'Source Data' ? 'Recorded' : 'Calculated'} /></span></div>)}<p className="text-[10px] leading-4 text-muted-foreground">Classification is calculated from connected revenue records and available tax treatment data.</p></div></Section><Section title="Tax-Relevant Expenses" eyebrow="Expense classification"><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-[11px]"><thead className="bg-card text-[10px] uppercase text-muted-foreground"><tr>{['Expense Category', 'Amount', 'Tax Amount', 'Tax Treatment', 'Status', ''].map(head => <th key={head} className="px-4 py-3">{head}</th>)}</tr></thead><tbody className="divide-y divide-border">{expenses.map(row => <tr key={row[0]}><td className="px-4 py-3 font-semibold">{row[0]}</td><td className="px-4 py-3">{row[1]}</td><td className="px-4 py-3">{row[2]}</td><td className="px-4 py-3 text-muted-foreground">{row[3]}</td><td className="px-4 py-3"><span className={`font-semibold ${row[5] === 'green' ? 'text-chart-4' : row[5] === 'amber' ? 'text-chart-1' : 'text-chart-5'}`}>{row[4]}</span></td><td className="px-4 py-3"><button onClick={() => toast(`Reviewing ${row[0]}`)} className="text-[10px] font-bold text-foreground">Review</button></td></tr>)}</tbody></table></div></Section></div>
        <div className="mt-6 grid gap-6 xl:grid-cols-2"><Section title="Tax Payments" eyebrow="Recorded payments"><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-[11px]"><thead className="bg-card text-[10px] uppercase text-muted-foreground"><tr>{['Date', 'Tax Type', 'Amount', 'Payment Account', 'Reference', 'Status'].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{[['15 Jul 2026', 'VAT (France)', '€19,600', 'Main Business Account', 'VAT-FR-Q2-2026'], ['10 Jul 2026', 'Corporate Tax (UK)', '€53,200', 'Main Business Account', 'CT-UK-FY2026'], ['05 Jun 2026', 'VAT (Germany)', '€20,000', 'Main Business Account', 'VAT-DE-Q2-2026']].map(row => <tr key={row[4]}>{row.map((cell, i) => <td key={cell} className={`px-4 py-3 ${i === 1 || i === 4 ? 'font-semibold' : ''}`}>{i === 5 ? <StatusBadge status="Paid" /> : cell}</td>)}</tr>)}</tbody></table></div><p className="border-t border-border px-5 py-3 text-[10px] text-muted-foreground">Payment initiation is not available from this page.</p></Section><Section title="Outstanding Tax" eyebrow="Open obligations"><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-[11px]"><thead className="bg-card text-[10px] uppercase text-muted-foreground"><tr>{['Tax Type', 'Period', 'Original', 'Paid', 'Remaining', 'Due Date', 'Status'].map(h => <th key={h} className="px-3 py-3">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{records.filter(r => r.remaining !== '€0').map(row => <tr key={row.type}><td className="px-3 py-3 font-semibold">{row.type}</td><td className="px-3 py-3">{row.period}</td><td className="px-3 py-3">{row.tax}</td><td className="px-3 py-3">{row.paid}</td><td className="px-3 py-3 font-bold">{row.remaining}</td><td className="px-3 py-3">{row.due}</td><td className="px-3 py-3"><StatusBadge status={row.status} /></td></tr>)}</tbody></table></div></Section></div>
        <Section title="Tax Documents" eyebrow="3 documents"><div className="grid gap-3 p-5 md:grid-cols-3">{[['VAT Return Q2 2026 (Germany)', 'Tax Report', 'Q2 2026', '31 Jul 2026', 'Attached'], ['Corporate Tax Filing FY2026 (UK)', 'Filing Confirmation', 'FY 2026', '05 Aug 2026', 'Attached'], ['Withholding Tax Statement Q3 2026', 'Tax Statement', 'Q3 2026', '—', 'Missing']].map(doc => <article key={doc[0]} className="rounded-lg border border-border p-4"><div className="flex items-start justify-between"><FileText size={18} className="text-foreground" /><span className={`text-[10px] font-bold ${doc[4] === 'Missing' ? 'text-chart-5' : 'text-foreground'}`}>{doc[4]}</span></div><h3 className="mt-3 text-xs font-bold leading-4">{doc[0]}</h3><p className="mt-2 text-[10px] text-muted-foreground">{doc[1]} · {doc[2]} · {doc[3]}</p><div className="mt-4 flex gap-3 text-[10px] font-bold text-foreground"><button>Open</button><button>{doc[4] === 'Missing' ? 'Attach' : 'Download'}</button></div></article>)}</div></Section>
        <div className="mt-6 grid gap-6 xl:grid-cols-2"><Section title="Tax Data Quality" eyebrow="Integrity checks"><div className="divide-y divide-border">{[['Missing tax classifications', 'Medium', '12 transactions', '06 Aug 2026', 'amber'], ['Missing documents', 'Low', '2 records', '03 Aug 2026', 'blue'], ['Unclassified expense transactions', 'High', '8 transactions', '01 Aug 2026', 'red'], ['Missing jurisdiction data', 'Medium', '1 record', '28 Jul 2026', 'amber']].map(issue => <div key={issue[0]} className="flex flex-wrap items-center gap-3 px-5 py-3"><AlertTriangle size={15} className={issue[4] === 'red' ? 'text-chart-5' : 'text-chart-1'} /><span className="flex-1 text-xs font-semibold">{issue[0]}<small className="ml-2 font-normal text-muted-foreground">{issue[2]} · Detected {issue[3]}</small></span><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${issue[4] === 'red' ? 'bg-chart-5/10 text-chart-5' : issue[4] === 'blue' ? 'bg-secondary text-foreground' : 'bg-secondary text-foreground'}`}>{issue[1]}</span><button className="text-[10px] font-bold text-foreground">Review</button><button className="hidden text-[10px] font-bold text-foreground sm:block">Fix</button></div>)}</div></Section><Section title="Tax Anomalies" eyebrow="AI-generated"><div className="space-y-3 p-5">{['Unusual tax amount change: VAT liability increased 18% vs previous quarter. Possible cause: higher taxable revenue.', 'Missing expected payment: Withholding Tax Q3 2026 (Germany) payment not yet recorded.', 'Unclassified transactions: 8 expense transactions have no tax treatment assigned.'].map(item => <div key={item} className="flex gap-3 rounded-lg bg-secondary/60 p-3 text-xs leading-5"><Sparkles size={15} className="mt-0.5 shrink-0 text-foreground" /><span className="flex-1">{item}</span><button className="font-bold text-foreground">Review</button></div>)}<p className="text-[10px] text-muted-foreground">AI-generated observations. Do not constitute tax advice or legal conclusions.</p></div></Section></div>
        <div className="mt-6 grid gap-6 xl:grid-cols-2"><Section title="AI Tax Insights" eyebrow="AI-generated"><div className="p-5"><div className="flex gap-3 rounded-lg bg-secondary p-4 text-xs leading-5"><Sparkles size={16} className="shrink-0 text-foreground" /><p>Recorded tax-related liabilities increased 12% compared with the previous period, primarily due to higher taxable revenue in the available financial data.</p></div><table className="mt-4 w-full text-xs"><tbody><tr className="border-b border-border"><td className="py-2 text-muted-foreground"></td><td className="py-2 font-semibold">Current Period</td><td className="py-2 font-semibold">Previous Period</td></tr><tr className="border-b border-border"><td className="py-2 text-muted-foreground">Taxable Amount</td><td className="py-2 font-bold">€312,400</td><td className="py-2">€279,200</td></tr><tr><td className="py-2 text-muted-foreground">Recorded Liability</td><td className="py-2 font-bold">€47,320</td><td className="py-2">€42,200</td></tr></tbody></table><p className="mt-4 text-[10px] text-muted-foreground">AI Insight — Based on recorded data. Not professional tax advice.</p></div></Section><Section title="AI Recommendations" eyebrow="AI Recommendation"><div className="divide-y divide-border">{[['High', 'Review 8 unclassified expense transactions to complete tax treatment classifications.'], ['Medium', 'Confirm upcoming Withholding Tax deadline (31 Oct 2026) and record payment plan.'], ['Medium', 'Attach missing Withholding Tax Statement for Q3 2026.'], ['Low', 'Reconcile VAT payments with financial records for Q3 2026.'], ['Low', 'Review Local Business Tax record — amount is estimated, not yet confirmed.']].map(rec => <div key={rec[1]} className="flex gap-3 px-5 py-3 text-xs"><span className={`mt-0.5 rounded px-2 py-1 text-[10px] font-bold ${rec[0] === 'High' ? 'bg-chart-5/10 text-chart-5' : rec[0] === 'Medium' ? 'bg-secondary text-foreground' : 'bg-secondary text-muted-foreground'}`}>{rec[0]}</span><span className="leading-5">{rec[1]}</span></div>)}<p className="px-5 py-3 text-[10px] text-muted-foreground">AI Recommendations — Lulu AI does not file taxes, submit legal declarations, or make tax payments.</p></div></Section></div>
        <Section title="Ask Lulu AI" eyebrow="Your finance co-pilot"><div className="p-5"><div className="flex items-center gap-3 rounded-xl border border-border bg-secondary px-4 py-2"><Bot size={19} className="text-muted-foreground" /><input placeholder="Ask Lulu AI about your tax data..." className="h-9 flex-1 bg-transparent text-xs outline-none" /><button onClick={() => toast('Lulu AI is thinking…')} className="rounded-lg bg-primary px-3 py-2 text-[11px] font-bold text-primary-foreground">Ask</button></div><div className="mt-4 flex gap-2 overflow-x-auto pb-1">{['What tax obligations are currently outstanding?', 'Which tax deadlines are coming up?', 'How much tax has been paid?', 'Which tax records are overdue?', 'Show our tax liabilities by period.', 'Which tax records need review?', 'Are there missing tax documents?', 'Which transactions are unclassified?', 'Compare tax amounts with the previous period.', 'Create a tax data report.'].map(prompt => <button key={prompt} onClick={() => toast(prompt)} className="whitespace-nowrap rounded-full border border-border bg-card px-3 py-2 text-[11px] font-medium text-foreground hover:border-border hover:text-foreground">{prompt}</button>)}</div><p className="mt-4 text-[10px] text-muted-foreground">Lulu AI responses are based on available financial data and do not constitute professional tax advice.</p></div></Section>
      </main></div>{notice && <div role="status" className="fixed bottom-5 right-5 flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-xs font-semibold text-primary-foreground shadow-xl"><CheckCircle2 size={15} className="text-foreground" />{notice}<button onClick={() => setNotice('')}><X size={14} /></button></div>}
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
