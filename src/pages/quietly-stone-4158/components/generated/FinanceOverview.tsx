import { useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bot, BriefcaseBusiness, Calculator, ChevronDown, CircleDollarSign, CreditCard, FileText, Landmark, MoreHorizontal, PanelLeft, Plus, Receipt, RefreshCw, Search, Send, Settings2, Sparkles, WalletCards, X } from 'lucide-react';
const purple = 'var(--primary)';
type Tone = 'violet' | 'green' | 'amber' | 'red' | 'blue' | 'slate';
const navItems = ['Finance Overview', 'Invoices', 'Offers & Quotes', 'Payments', 'Expenses', 'Income', 'Transactions', 'Accounts', 'Cash Flow', 'Budgets', 'Financial Planning', 'Taxes', 'Payouts', 'Reconciliation', 'Financial Automation', 'Finance Settings'];
const kpis: string[][] = [];
const accounts: string[][] = [];
const aging: string[][] = [];
const activities: string[][] = [];
const transactions: string[][] = [];
function Badge({
  children,
  tone = 'slate'
}: {
  children: string;
  tone?: Tone;
}) {
  const styles: Record<Tone, string> = {
    violet: 'bg-secondary text-foreground border-border',
    green: 'bg-secondary text-foreground border-border',
    amber: 'bg-secondary text-foreground border-border',
    red: 'bg-chart-5/10 text-chart-5 border-chart-5/30',
    blue: 'bg-secondary text-foreground border-border',
    slate: 'bg-card text-muted-foreground border-border'
  };
  return <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold ${styles[tone]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{children}</span>;
}
function Card({
  title,
  subtitle,
  children,
  action
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: string;
}) {
  return <section className="rounded-xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><header className="mb-5 flex items-start justify-between gap-3"><div><h2 className="text-[15px] font-bold tracking-[-0.01em] text-foreground">{title}</h2>{subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}</div>{action && <button className="text-xs font-semibold text-foreground hover:text-foreground">{action}</button>}</header>{children}</section>;
}
function Sparkline({
  color = purple,
  bars = false
}: {
  color?: string;
  bars?: boolean;
}) {
  return <svg viewBox="0 0 220 58" className="h-14 w-full" role="img" aria-label="Trend chart"><path d="M2 48 C22 42 25 45 42 34 S67 41 82 27 S108 36 123 22 S148 30 163 18 S191 23 218 7" fill="none" stroke={color} strokeWidth="2.5" />{bars && <path d="M4 50h12V31H4zm21 0h12V38H25zm21 0h12V24H46zm21 0h12V33H67zm21 0h12V17H88zm21 0h12V27H109zm21 0h12V11H130zm21 0h12V20H151zm21 0h12V7H172zm21 0h12V14H193z" fill={color} opacity=".16" />}</svg>;
}
export function FinanceOverview() {
  const { items: liveAccounts, loading: accountsLoading, error: accountsError } = useLiveRecords('finance_accounts');
  const { items: liveExpenses, loading: expensesLoading, error: expensesError } = useLiveRecords('finance_expenses');
  const { items: liveInvoices, loading: invoicesLoading, error: invoicesError } = useLiveRecords('finance_invoices');
  const financeLoading = accountsLoading || expensesLoading || invoicesLoading;
  const financeError = accountsError || expensesError || invoicesError;
  const hasLiveFinanceData = liveAccounts.length + liveExpenses.length + liveInvoices.length > 0;
  const [activeMetric, setActiveMetric] = useState('Revenue');
  const [query, setQuery] = useState('');
  const liveAccountRows = liveAccounts.map((record) => [record.name, record.description ?? 'Finance account', record.currency ?? '—', record.valueAmount ?? '—', record.updatedAt]);
  const metrics = ['Revenue', 'Expenses', 'Net Income', 'Cash Flow'];
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className="fixed inset-y-0 left-0 hidden w-[244px] flex-col bg-[var(--sidebar)] text-foreground lg:flex"><div className="flex h-16 items-center gap-3 border-b border-border px-6"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={17} /></div><strong className="text-lg tracking-tight text-foreground">LULU <span className="font-normal text-foreground">AI</span></strong></div><div className="px-4 py-5"><div className="mb-3 flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground"><span>Workspace</span><Plus size={13} /></div><LuluSectionNavigation activeId="quietly-stone-4158" /></div><div className="mt-auto border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-foreground hover:bg-secondary"><Settings2 size={15} />Workspace settings</button><div className="mt-3 flex items-center gap-3 rounded-lg bg-secondary p-3"><div className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">AM</div><div><p className="text-xs font-semibold text-foreground">—</p><p className="text-[10px] text-muted-foreground">Admin</p></div><MoreHorizontal size={15} className="ml-auto" /></div></div></aside>
    <main className="lg:ml-[244px]"><div className="flex h-16 items-center justify-between border-b border-border bg-card px-5 lg:px-8"><div className="flex items-center gap-3"><PanelLeft size={18} className="text-muted-foreground lg:hidden" /><span className="text-xs text-muted-foreground">Business /</span><span className="text-xs font-semibold text-foreground">Finance</span></div><div className="flex items-center gap-3"><div className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 md:flex"><Search size={14} className="text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search finance..." className="w-40 bg-transparent text-xs outline-none placeholder:text-muted-foreground" /></div><button className="rounded-lg p-2 text-foreground hover:bg-secondary" aria-label="Notifications"><Activity size={17} /></button><div className="h-7 w-7 rounded-full bg-secondary text-center text-[10px] font-bold leading-7 text-muted-foreground">AM</div></div></div>
      <div className="mx-auto max-w-[1440px] px-5 py-7 lg:px-8"><div className="mb-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-3 text-xs font-medium text-muted-foreground">Finance <span className="mx-1">/</span> Finance Overview</p><h1 className="text-3xl font-bold tracking-[-0.04em] text-foreground">Finance Overview</h1><p className="mt-2 text-sm text-muted-foreground">Understand your financial performance, cash flow and financial position in one place.</p></div><div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary"><Bot size={15} />Ask Lulu AI</button>{['Create Invoice', 'Create Offer', 'Record Expense', 'Record Income', 'Export'].map(item => <button key={item} className="rounded-lg border border-border bg-card px-3 py-2.5 text-xs font-semibold text-foreground hover:border-border hover:text-foreground">{item}</button>)}<button className="rounded-lg border border-border bg-card p-2.5 text-foreground hover:bg-card" aria-label="More actions"><MoreHorizontal size={16} /></button></div></div>
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"><span className="text-xs font-semibold text-muted-foreground">Reporting period</span>{['EUR', 'Year to Date', 'Previous Year'].map((item, i) => <button key={item} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-bold text-foreground hover:border-border">{i === 0 ? 'Reporting Currency' : i === 1 ? 'Date Range' : 'Compare With'} <span className="text-foreground">{item}</span><ChevronDown size={13} className="text-muted-foreground" /></button>)}</div>
        {financeError && <div className="mb-4 rounded-lg border border-chart-5/30 bg-chart-5/5 px-4 py-3 text-sm text-chart-5">{financeError}</div>}
        {financeLoading && <div className="mb-4 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Loading live finance data…</div>}
        {!financeLoading && !hasLiveFinanceData && <div className="mb-4 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No live finance data is available yet. Connect a finance platform or add records to begin.</div>}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{(financeLoading ? [] : kpis).map(([name, value, change, period, label, time, tone]) => <article key={name} className="rounded-xl border border-border bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><div className="flex items-start justify-between"><p className="text-xs font-semibold text-muted-foreground">{name}</p><Badge tone={tone as Tone}>{label}</Badge></div><p className="mt-4 text-[22px] font-bold tracking-[-0.04em] text-foreground">{value}</p><p className={`mt-1 flex items-center gap-1 text-xs font-bold ${change.startsWith('+') ? 'text-foreground' : 'text-foreground'}`}>{change.startsWith('+') && <ArrowUpRight size={13} />}{change} <span className="font-normal text-muted-foreground">{period}</span></p><p className="mt-3 text-[11px] text-muted-foreground">{time}</p></article>)}</div>
        <Card title="Financial Performance" subtitle="Monthly view · EUR · current period compared with previous year" action="View report"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex gap-1 rounded-lg bg-secondary p-1">{metrics.map(metric => <button key={metric} onClick={() => setActiveMetric(metric)} className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${activeMetric === metric ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}>{metric}</button>)}</div><div className="flex items-center gap-4 text-[11px] text-muted-foreground"><span className="flex items-center gap-2"><i className="h-0.5 w-5 bg-primary text-primary-foreground" />This year</span><span className="flex items-center gap-2"><i className="w-5 border-t border-dashed border-border" />Previous year</span></div></div><div className="rounded-lg bg-card/60 p-3"><svg viewBox="0 0 900 250" className="h-[260px] w-full" role="img" aria-label={`${activeMetric} performance line chart`}><g stroke="var(--border)" strokeDasharray="3 5"><path d="M30 35H880M30 90H880M30 145H880M30 200H880" /></g><path d="M30 194 C85 175 102 180 145 156 S205 167 250 128 S306 140 350 118 S405 133 450 99 S506 120 550 74 S605 96 650 67 S710 80 755 45 S823 57 880 27" fill="none" stroke="var(--chart-2)" strokeWidth="3" /><path d="M30 205 C85 190 110 198 145 177 S210 186 250 163 S305 174 350 151 S405 158 450 136 S505 145 550 116 S605 130 650 104 S710 119 755 89 S823 98 880 72" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeDasharray="7 6" /><path d="M30 194 C85 175 102 180 145 156 S205 167 250 128 S306 140 350 118 S405 133 450 99 S506 120 550 74 S605 96 650 67 S710 80 755 45 S823 57 880 27 L880 220 L30 220Z" fill="var(--chart-2)" opacity=".08" /><g fill="var(--border)" fontSize="10"><text x="30" y="240">—</text><text x="180" y="240">—</text><text x="330" y="240">—</text><text x="480" y="240">—</text><text x="630" y="240">—</text><text x="780" y="240">—</text></g></svg></div></Card>
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3"><Card title="Income" subtitle="Income over time · YTD"><div className="flex items-end justify-between"><div><p className="text-2xl font-bold">—</p><p className="mt-1 text-xs text-chart-4">↑ —</p></div><Sparkline bars /></div><div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4 text-xs"><div><p className="text-muted-foreground">Paid</p><strong>—</strong></div><div><p className="text-muted-foreground">Outstanding</p><strong>—</strong></div><div><p className="text-muted-foreground">Overdue</p><strong className="text-chart-5">—</strong></div></div><p className="mt-4 text-[11px] font-semibold text-muted-foreground">Income by source</p><div className="mt-2 flex h-2 overflow-hidden rounded-full"><span className="w-[5—] bg-primary text-primary-foreground" /><span className="w-[2—] bg-primary text-primary-foreground" /><span className="w-[—] bg-primary text-primary-foreground" /><span className="w-[—] bg-muted" /></div><p className="mt-2 text-[11px] text-muted-foreground">Services 5— · Products 2— · Subscriptions — · Other —</p></Card><Card title="Expenses" subtitle="Expenses over time · YTD"><div className="flex items-end justify-between"><div><p className="text-2xl font-bold">—</p><p className="mt-1 text-xs text-chart-1">↑ —</p></div><Sparkline color="var(--chart-1)" bars /></div><div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs"><div><p className="text-muted-foreground">Recurring</p><strong>—</strong></div><div><p className="text-muted-foreground">One-time</p><strong>—</strong></div></div><p className="mt-4 text-[11px] font-semibold text-muted-foreground">Top categories</p><p className="mt-2 text-xs text-muted-foreground">Software <b>—</b> · Payroll <b>—</b> · —keting <b>—</b> · Operations <b>—</b></p></Card><Card title="Net Income" subtitle="Profitability at a glance"><div className="rounded-lg bg-secondary p-3 text-xs text-foreground">— <span className="text-foreground">−</span> — <strong className="float-right">= —</strong></div><div className="mt-5 flex items-end justify-between"><div><p className="text-2xl font-bold">—</p><p className="mt-1 text-xs font-bold text-chart-4">↑ —</p></div><Sparkline color="var(--chart-4)" /></div><p className="mt-5 text-[11px] text-muted-foreground"><Badge tone="violet">Calculated</Badge> Based on recorded income and expenses</p></Card></div>
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><Card title="Cash Flow" subtitle="Movement across all connected accounts"><div className="grid grid-cols-2 gap-y-3 text-xs sm:grid-cols-5"><div><p className="text-muted-foreground">Opening</p><strong>—</strong></div><div><p className="text-muted-foreground">Inflows</p><strong className="text-chart-4">+—</strong></div><div><p className="text-muted-foreground">Outflows</p><strong>−—</strong></div><div><p className="text-muted-foreground">Net flow</p><strong className="text-chart-2">+—</strong></div><div><p className="text-muted-foreground">Closing</p><strong>—</strong></div></div><div className="mt-5"><Sparkline color="var(--chart-4)" bars /></div><p className="text-[11px] text-muted-foreground">Operating 8— · Investing — · Financing —</p></Card><Card title="Cash Position" subtitle="— · Values converted to EUR"><div className="divide-y divide-border">{(financeLoading ? [] : liveAccountRows).map(([name, institution, currency, balance, sync]) => <div key={name} className="flex items-center gap-3 py-3 first:pt-0"><div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-muted-foreground"><Landmark size={15} /></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{name}</p><p className="text-[11px] text-muted-foreground">{institution} · {currency} · Synced {sync}</p></div><strong className="text-xs">{balance}</strong><Badge tone="green">Active</Badge></div>)}</div></Card></div>
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><Card title="Accounts Receivable" subtitle="Total outstanding · —"><div className="flex items-center justify-between"><p className="text-2xl font-bold">—</p><Badge tone="amber">— overdue</Badge></div><div className="mt-5 h-3 overflow-hidden rounded-full bg-secondary"><span className="block h-full w-[6—] bg-primary text-primary-foreground" /></div><div className="mt-4 space-y-2">{aging.map(([label, value, percent]) => <div key={label} className="flex justify-between text-xs"><span className="text-muted-foreground">{label}</span><strong>{value} <span className="ml-2 font-normal text-muted-foreground">{percent}</span></strong></div>)}</div><div className="mt-5 flex flex-wrap gap-2"><button className="btn-secondary">View Invoices</button><button className="btn-secondary">View Overdue</button><button className="btn-primary">Ask Lulu AI</button></div></Card><Card title="Accounts Payable" subtitle="Total payable · —"><p className="text-2xl font-bold">—</p><div className="mt-5 grid grid-cols-3 gap-3 text-xs"><div><p className="text-muted-foreground">Due soon</p><strong>—</strong></div><div><p className="text-muted-foreground">Overdue</p><strong className="text-chart-5">—</strong></div><div><p className="text-muted-foreground">Paid period</p><strong>—</strong></div></div><p className="mt-5 text-[11px] font-bold text-muted-foreground">Top vendors</p><div className="mt-2 space-y-2 text-xs"><div className="flex justify-between"><span>—</span><strong>—</strong></div><div className="flex justify-between"><span>—</span><strong>—</strong></div><div className="flex justify-between"><span>—</span><strong>—</strong></div></div><div className="mt-5 flex gap-2"><button className="btn-secondary">View Expenses</button><button className="btn-secondary">View Vendors</button><button className="btn-primary">Ask Lulu AI</button></div></Card></div>
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3"><Card title="Invoices" subtitle="—"><div className="flex flex-wrap gap-1.5">{['Draft 12', 'Sent 48', 'Paid 196', 'Partially Paid 14', 'Overdue 14'].map(x => <Badge key={x} tone={x.includes('Overdue') ? 'red' : x.includes('Paid') ? 'green' : 'slate'}>{x}</Badge>)}</div><div className="mt-5 space-y-2 text-xs"><div className="flex justify-between"><span>Invoice value</span><strong>—</strong></div><div className="flex justify-between"><span>Paid</span><strong>—</strong></div><div className="flex justify-between"><span>Outstanding</span><strong>—</strong></div><div className="flex justify-between"><span>Overdue</span><strong className="text-chart-5">—</strong></div></div><p className="mt-4 text-[11px] text-muted-foreground">Invoice Status Distribution · Paid 69% · Sent 1— · Other —</p></Card><Card title="Payments" subtitle="—"><div className="grid grid-cols-2 gap-3 text-xs"><div><p className="text-muted-foreground">Successful</p><strong>864</strong></div><div><p className="text-muted-foreground">Pending</p><strong>18</strong></div><div><p className="text-muted-foreground">Failed</p><strong>6</strong></div><div><p className="text-muted-foreground">Refunded</p><strong>4</strong></div></div><div className="mt-5 border-t border-border pt-4 text-xs"><div className="flex justify-between"><span>Processing fees</span><strong>—</strong></div><div className="mt-2 flex justify-between"><span>Net payout</span><strong>—</strong></div></div><p className="mt-4 text-[11px] text-muted-foreground">Card 7— · Bank Transfer 21% · Other —</p></Card><Card title="Offers & Quotes" subtitle="Conversion pipeline"><div className="flex flex-wrap gap-1.5">{['Draft 8', 'Sent 24', 'Accepted 31', 'Rejected 6', 'Expired 3', 'Converted 28'].map(x => <Badge key={x} tone={x.includes('Accepted') ? 'green' : 'slate'}>{x}</Badge>)}</div><div className="mt-5 space-y-2 text-xs"><div className="flex justify-between"><span>Total offer value</span><strong>—</strong></div><div className="flex justify-between"><span>Accepted</span><strong>—</strong></div><div className="flex justify-between"><span>Conversion rate</span><strong className="text-foreground">62.—</strong></div></div><div className="mt-5 flex gap-2"><button className="btn-primary">Create Offer</button><button className="btn-secondary">View Offers</button></div></Card></div>
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3"><Card title="Recurring Revenue" subtitle="Calculated · Subscription data"><div className="flex justify-between"><div><p className="text-xs text-muted-foreground">MRR</p><p className="text-2xl font-bold">—</p></div><div className="text-right"><p className="text-xs text-muted-foreground">ARR</p><p className="text-lg font-bold">—</p></div></div><div className="mt-5 grid grid-cols-2 gap-2 text-xs"><span>New MRR <b className="text-foreground">+—</b></span><span>Churned <b className="text-chart-5">−—</b></span><span>Expansion <b className="text-chart-4">+—</b></span><span>Contraction <b>−—</b></span></div><p className="mt-5 rounded-lg bg-chart-4/10 p-3 text-xs font-bold text-chart-4">Net MRR growth +— · +10.—</p></Card><Card title="Budget Performance" action="View Budgets"><div className="space-y-3 text-xs"><div className="grid grid-cols-4 gap-2 border-b pb-2 font-semibold text-muted-foreground"><span>Category</span><span>Budget</span><span>Actual</span><span>Variance</span></div>{[['—keting', '—', '—', '−— ✓'], ['Software', '—', '—', '+— ⚠'], ['Operations', '—', '—', '−— ✓'], ['Sales', '—', '—', '−— ✓']].map(([a, b, c, d]) => <div key={a} className="grid grid-cols-4 gap-2"><span className="font-semibold">{a}</span><span>{b}</span><span>{c}</span><span className={d.includes('⚠') ? 'font-bold text-chart-5' : 'font-bold text-foreground'}>{d}</span></div>)}</div></Card><Card title="Financial Planning" subtitle="Next 6 months"><Badge tone="violet">AI Forecast</Badge><div className="mt-4 space-y-2 text-xs"><div className="flex justify-between"><span>Forecast Revenue</span><strong>—</strong></div><div className="flex justify-between"><span>Forecast Expenses</span><strong>—</strong></div><div className="flex justify-between"><span>Forecast Net Income</span><strong>—</strong></div><div className="flex justify-between"><span>Forecast Cash Balance</span><strong>—</strong></div></div><div className="mt-4 flex items-center justify-between rounded-lg bg-secondary p-3 text-xs"><span>Confidence</span><strong className="text-foreground">78%</strong></div><p className="mt-3 text-[11px] italic text-muted-foreground">AI Forecast — Never guaranteed outcomes</p></Card></div>
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><Card title="Financial Anomalies" subtitle="Detected across connected data"><div className="space-y-3">{([] as string[][]).map(([title, desc, severity, tone]) => <div key={title} className="flex gap-3 rounded-lg border border-border p-3"><div className="mt-0.5 text-chart-1"><AlertTriangle size={17} /></div><div className="flex-1"><p className="text-xs font-bold">{title}</p><p className="mt-1 text-[11px] text-muted-foreground">{desc}</p></div><div className="text-right"><Badge tone={tone as Tone}>{severity}</Badge><button className="mt-2 block text-[11px] font-bold text-foreground">Investigate</button></div></div>)}</div></Card><Card title="Attention Required" subtitle="4 items need your review"><div className="space-y-3 text-xs">{([] as string[][]).map(([icon, title, desc, action]) => <div key={title} className="flex items-center gap-3 border-b border-border pb-3 last:border-0 last:pb-0"><span className="text-sm">{icon}</span><div className="flex-1"><strong>{title}</strong><p className="mt-1 text-[11px] text-muted-foreground">{desc}</p></div><button className="font-bold text-foreground">{action}</button></div>)}</div></Card></div>
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3"><Card title="Financial Accounts" subtitle="Manage and reconcile accounts"><div className="space-y-3">{accounts.slice(0, 3).map(([name, institution, currency, balance, sync]) => <div key={name} className="rounded-lg border border-border p-3"><div className="flex justify-between"><strong className="text-xs">{name}</strong><Badge tone="green">Active</Badge></div><p className="mt-1 text-[11px] text-muted-foreground">{institution} · {currency} · {balance}</p><p className="mt-2 text-[11px] text-muted-foreground">Last sync {sync}</p><div className="mt-3 flex gap-3 text-[11px] font-bold text-foreground"><button>Open Account</button><button>Reconcile</button><button>Transactions</button></div></div>)}</div></Card><Card title="Recent Transactions" subtitle="Last 8 transactions" action="View all"><div className="overflow-x-auto"><table className="w-full text-left text-[11px]"><thead className="text-muted-foreground"><tr><th className="pb-2">Date</th><th className="pb-2">Description</th><th className="pb-2">Category</th><th className="pb-2 text-right">Amount</th></tr></thead><tbody className="divide-y divide-border">{(financeLoading ? [] : transactions).map(([date, desc, account, category, amount, status]) => <tr key={`${date}-${desc}`}><td className="py-2 text-muted-foreground">{date}</td><td className="max-w-[150px] truncate py-2 font-semibold">{desc}<span className="block font-normal text-muted-foreground">{account} · {status}</span></td><td className="py-2 text-muted-foreground">{category}</td><td className={`py-2 text-right font-bold ${amount.startsWith('+') ? 'text-foreground' : ''}`}>{amount}</td></tr>)}</tbody></table></div></Card><Card title="Reconciliation" subtitle="Reconciliation health"><div className="grid grid-cols-2 gap-3 text-xs"><div className="rounded-lg bg-secondary p-3"><p className="text-foreground">Reconciled</p><strong className="text-lg text-foreground">1,847</strong></div><div className="rounded-lg bg-chart-1/10 p-3"><p className="text-chart-1">Unreconciled</p><strong className="text-lg text-chart-1">24</strong></div><div><p className="text-muted-foreground">Exceptions</p><strong>3</strong></div><div><p className="text-muted-foreground">Needs attention</p><strong>1 account</strong></div></div><p className="mt-5 text-xs text-muted-foreground">Last reconciliation: <strong>Today 09:14</strong></p><div className="mt-5 flex gap-2"><button className="btn-primary">Open Reconciliation</button><button className="btn-secondary">Review Exceptions</button></div></Card></div>
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><Card title="Taxes" subtitle="—"><div className="grid grid-cols-3 gap-3 text-xs"><div><p className="text-muted-foreground">Tax collected</p><strong>—</strong></div><div><p className="text-muted-foreground">Tax paid</p><strong>—</strong></div><div><p className="text-muted-foreground">Liabilities</p><strong>—</strong></div></div><div className="mt-5 flex items-center justify-between"><span className="text-xs text-muted-foreground">Filing status</span><Badge tone="amber">In Progress</Badge></div><p className="mt-4 text-[11px] text-muted-foreground">Tax information based on connected financial data. Verify with an appropriate tax professional.</p><button className="btn-primary mt-4">Open Taxes</button></Card><Card title="Payouts" subtitle="Provider · —"><div className="space-y-3 text-xs"><div className="flex justify-between"><span>Pending · —</span><strong>—</strong></div><div className="flex justify-between"><span>Completed · —</span><strong className="text-chart-4">—</strong></div><div className="flex justify-between"><span>Failed · —</span><strong className="text-chart-5">—</strong></div></div><div className="mt-5 flex gap-2"><button className="btn-primary">View Payouts</button><button className="btn-secondary">Open Payment Provider</button></div></Card></div>
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><Card title="AI Insights" subtitle="AI-generated · Evidence-backed"><div className="space-y-3">{[].map(text => <div key={text} className="rounded-lg border border-border bg-secondary/50 p-3"><p className="text-xs font-semibold leading-5 text-foreground">{text}</p><p className="mt-2 text-[11px] text-foreground">Evidence · Software +— · Suppliers +—</p></div>)}</div></Card><Card title="AI Recommendations" subtitle="AI Recommendation"><div className="space-y-3">{[].map((text, i) => <button key={text} className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left hover:border-border"><span className="grid h-6 w-6 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">{i + 1}</span><span className="text-xs font-semibold">{text}</span><ChevronDown size={14} className="ml-auto -rotate-90 text-muted-foreground" /></button>)}</div></Card></div>
        <Card title="Finance Activity" subtitle="Recent activity across your workspace"><div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">{(financeLoading ? [] : activities).map(([event, detail, time, tone]) => <div key={event} className="flex items-center gap-3 py-3 md:px-4 first:pt-0 md:first:pl-0"><div className={`grid h-8 w-8 place-items-center rounded-full ${tone === 'violet' ? 'bg-secondary text-foreground' : tone === 'green' ? 'bg-chart-4/10 text-chart-4' : 'bg-secondary text-muted-foreground'}`}><Activity size={14} /></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{event}</p><p className="truncate text-[11px] text-muted-foreground">{detail}</p></div><time className="text-[11px] text-muted-foreground">{time}</time></div>)}</div></Card>
        <section className="mt-6 rounded-xl border border-border bg-gradient-to-br from-secondary via-white to-secondary p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)]"><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Bot size={17} /></div><div><h2 className="text-base font-bold">Ask Lulu AI</h2><p className="text-xs text-muted-foreground">Your financial intelligence, ready when you are.</p></div></div><div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-card p-2 shadow-sm"><input placeholder="Ask Lulu AI about your finances..." className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground" aria-label="Ask Lulu AI about your finances" /><button className="rounded-lg bg-primary p-2.5 text-primary-foreground hover:bg-primary" aria-label="Send question"><Send size={16} /></button></div><div className="mt-4 flex gap-2 overflow-x-auto pb-1">{['How is my financial performance?', 'Why did expenses increase?', 'What is affecting my cash flow?', 'Which invoices are overdue?', 'Forecast my cash flow', 'Compare this month with last month', 'Find unusual financial activity', 'Create a financial report'].map(prompt => <button key={prompt} className="shrink-0 rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary">{prompt}</button>)}</div></section>
      </div></main>
    <style>{`.btn-primary{border-radius:0.5rem;background:var(--primary);padding:.55rem .75rem;font-size:.7rem;font-weight:700;color:white}.btn-primary:hover{background:var(--primary);color:var(--primary-foreground)}.btn-secondary{border-radius:.5rem;border:1px solid var(--border);background:white;padding:.55rem .75rem;font-size:.7rem;font-weight:700;color:var(--muted-foreground)}.btn-secondary:hover{border-color:var(--foreground);color:var(--foreground)}`}</style>
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
    "label": "Agent —ketplace"
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
  "label": "—keting",
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
    "label": "—keting"
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
