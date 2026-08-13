import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Banknote, BarChart3, Bot, Check, ChevronDown, CircleDollarSign, CreditCard, FileDown, Landmark, MoreHorizontal, PanelLeft, Plus, RefreshCw, Search, Send, Settings2, ShieldCheck, Sparkles, WalletCards, X } from 'lucide-react';
type Tone = 'violet' | 'green' | 'amber' | 'red' | 'blue' | 'slate';
type Account = {
  name: string;
  institution: string;
  type: string;
  number: string;
  balance: string;
  available?: string;
  currency: string;
  sync: string;
  reconciliation: string;
  status: string;
  tone: Tone;
  icon: string;
  iconTone: string;
};
const navItems = ['Finance Overview', 'Invoices', 'Offers & Quotes', 'Payments', 'Expenses', 'Income', 'Transactions', 'Accounts', 'Cash Flow', 'Budgets', 'Financial Planning', 'Taxes', 'Payouts', 'Reconciliation', 'Financial Automation', 'Finance Settings'];
const kpis = [['Total Balance', '€141,590', 'Combined balance', 'EUR reporting currency', 'slate'], ['Available Balance', '€138,470', 'Immediately available', 'Across 6 accounts', 'slate'], ['Money In', '€28,340', '↑ 12.8%', 'vs previous period', 'green'], ['Money Out', '€14,820', '↓ 4.2%', 'vs previous period', 'red'], ['Net Movement', '+€13,520', '↑ 18.4%', 'vs previous period', 'green'], ['Accounts Connected', '6', 'All accounts', 'Last sync 2m ago', 'violet'], ['Needs Attention', '2', 'Review required', 'Across 6 accounts', 'amber']];
const accounts: Account[] = [{
  name: 'Business Checking',
  institution: 'Deutsche Bank',
  type: 'Bank Account',
  number: '••••4821',
  balance: '€42,850',
  available: '€42,850',
  currency: 'EUR',
  sync: '2 min ago',
  reconciliation: 'Reconciled',
  status: 'Connected',
  tone: 'green',
  icon: 'DB',
  iconTone: 'bg-chart-5/10 text-chart-5'
}, {
  name: 'Business Savings',
  institution: 'Deutsche Bank',
  type: 'Bank Account',
  number: '••••7203',
  balance: '€86,200',
  available: '€86,200',
  currency: 'EUR',
  sync: '5 min ago',
  reconciliation: 'Reconciled',
  status: 'Connected',
  tone: 'green',
  icon: 'DB',
  iconTone: 'bg-chart-5/10 text-chart-5'
}, {
  name: 'Stripe',
  institution: 'Stripe',
  type: 'Payment Account',
  number: '••••stripe',
  balance: '€8,420',
  currency: 'EUR',
  sync: '1 min ago',
  reconciliation: 'Needs Review',
  status: 'Connected',
  tone: 'green',
  icon: 'S',
  iconTone: 'bg-secondary text-foreground'
}, {
  name: 'PayPal',
  institution: 'PayPal',
  type: 'Payment Account',
  number: '••••paypal',
  balance: '€3,120',
  currency: 'EUR',
  sync: 'Sync delayed',
  reconciliation: 'Needs Review',
  status: 'Sync Delayed',
  tone: 'amber',
  icon: 'P',
  iconTone: 'bg-secondary text-foreground'
}, {
  name: 'Corporate Visa',
  institution: 'Commerzbank',
  type: 'Credit Card',
  number: '••••9944',
  balance: '-€4,180',
  currency: 'EUR',
  sync: '10 min ago',
  reconciliation: 'Reconciled',
  status: 'Connected',
  tone: 'green',
  icon: 'V',
  iconTone: 'bg-secondary text-foreground'
}, {
  name: 'Petty Cash',
  institution: 'Manual',
  type: 'Cash Account',
  number: '—',
  balance: '€980',
  currency: 'EUR',
  sync: 'Manual',
  reconciliation: 'Not Available',
  status: 'Manual',
  tone: 'blue',
  icon: '€',
  iconTone: 'bg-secondary text-foreground'
}];
const transactions = [['Today', 'Client receipt · INV-2847', 'In', '+€4,200', 'Services', 'Settled'], ['Today', 'Supplier payment · Acme GmbH', 'Out', '−€1,840', 'Suppliers', 'Reconciled'], ['Yesterday', 'Corporate card charge', 'Out', '−€249', 'Software', 'Reconciled'], ['Mar 18', 'Client receipt · INV-2842', 'In', '+€8,400', 'Services', 'Settled'], ['Mar 17', 'Google Ads', 'Out', '−€1,240', 'Marketing', 'Pending']];
const activity = [['Account synchronized', 'Business Checking · System', '2 min ago', 'Completed', 'green'], ['Sync error detected', 'PayPal · System', '2h ago', 'Attention', 'amber'], ['Reconciliation completed', 'Business Savings · Alex Morgan', 'Today 09:14', 'Completed', 'green'], ['Account connected', 'Stripe · Alex Morgan', 'Yesterday', 'Completed', 'violet'], ['Balance updated', 'Corporate Visa · System', 'Yesterday', 'Completed', 'blue']];
const anomalies = [['PayPal', 'Sync Delayed', 'Synchronization has not completed within the expected timeframe', 'Detected 2h ago', 'Medium', 'amber'], ['Stripe', 'Needs Review', 'Unusual incoming activity detected', 'Detected today', 'Low', 'blue'], ['Business Checking', 'Unexpected balance change', 'Balance changed by >5% overnight', 'Detected 6h ago', 'High', 'red']];
const recommendations = ['Reconnect PayPal account experiencing sync delays', 'Reconcile Stripe account with 4 unmatched transactions', 'Review unusual incoming activity on Stripe account'];
const filters = ['Account Type', 'Status', 'Currency', 'Institution', 'Reconciliation', 'Activity'];
function Badge({
  children,
  tone = 'slate'
}: {
  children: string;
  tone?: Tone;
}) {
  const styles: Record<Tone, string> = {
    violet: 'border-border bg-secondary text-foreground',
    green: 'border-border bg-secondary text-foreground',
    amber: 'border-border bg-secondary text-foreground',
    red: 'border-chart-5/30 bg-chart-5/10 text-chart-5',
    blue: 'border-border bg-secondary text-foreground',
    slate: 'border-border bg-card text-muted-foreground'
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-semibold ${styles[tone]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{children}</span>;
}
function Panel({
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
  return <section className="rounded-xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.035)]"><header className="mb-5 flex items-start justify-between gap-3"><div><h2 className="text-[15px] font-bold tracking-[-.015em] text-foreground">{title}</h2>{subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}</div>{action && <button className="text-xs font-bold text-foreground hover:text-foreground">{action}</button>}</header>{children}</section>;
}
export function FinanceAccounts() {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [period, setPeriod] = useState('Monthly');
  const [selected, setSelected] = useState<Account | null>(null);
  const [question, setQuestion] = useState('');
  const [sent, setSent] = useState(false);
  const visibleAccounts = useMemo(() => accounts.filter(account => account.name.toLowerCase().includes(query.toLowerCase()) || account.institution.toLowerCase().includes(query.toLowerCase())), [query]);
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className="fixed inset-y-0 left-0 hidden w-[244px] flex-col bg-[var(--sidebar)] text-foreground lg:flex"><div className="flex h-16 items-center gap-3 border-b border-border px-6"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={17} /></div><strong className="text-lg tracking-tight text-foreground">LULU <span className="font-normal text-foreground">AI</span></strong></div><div className="px-4 py-5"><div className="mb-3 flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground"><span>Workspace</span><Plus size={13} /></div><LuluSectionNavigation activeId="fair-bridge-8618" /></div><div className="mt-auto border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-foreground hover:bg-secondary"><Settings2 size={15} />Workspace settings</button><div className="mt-3 flex items-center gap-3 rounded-lg bg-secondary p-3"><div className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">AM</div><div><p className="text-xs font-semibold text-foreground">Alex Morgan</p><p className="text-[10px] text-muted-foreground">Admin</p></div><MoreHorizontal size={15} className="ml-auto" /></div></div></aside>
    <main className="lg:ml-[244px]"><header className="flex h-16 items-center justify-between border-b border-border bg-card px-5 lg:px-8"><div className="flex items-center gap-3"><PanelLeft size={18} className="text-muted-foreground lg:hidden" /><span className="text-xs text-muted-foreground">Business /</span><span className="text-xs font-semibold text-muted-foreground">Finance</span></div><div className="flex items-center gap-3"><div className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 md:flex"><Search size={14} className="text-muted-foreground" /><input placeholder="Search finance..." className="w-40 bg-transparent text-xs outline-none placeholder:text-muted-foreground" /></div><Activity size={17} className="text-muted-foreground" /><div className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-[10px] font-bold text-muted-foreground">AM</div></div></header>
      <div className="mx-auto max-w-[1500px] px-5 py-7 lg:px-8"><div className="mb-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-3 text-xs font-medium text-muted-foreground">Finance <span className="mx-1">/</span> Accounts</p><h1 className="text-3xl font-bold tracking-[-.045em] text-foreground">Accounts</h1><p className="mt-2 text-sm text-muted-foreground">Monitor balances, activity and connected financial accounts in one place.</p></div><div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary"><Plus size={15} />Add Account</button><button className="btn-secondary">Connect Account</button><button className="btn-primary"><Bot size={14} />Ask Lulu AI</button><button className="btn-secondary"><FileDown size={14} />Export</button><button className="btn-secondary px-2.5" aria-label="More actions"><MoreHorizontal size={16} /></button></div></div>
        <div className="mb-2 flex items-center justify-end text-[11px] text-muted-foreground">Reporting currency: <strong className="ml-1 font-semibold text-muted-foreground">EUR</strong><span className="mx-1">·</span>Rates as of today</div><div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">{kpis.map(([label, value, meta, detail, tone]) => <article key={label} className="rounded-xl border border-border bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><div className="flex items-start justify-between gap-2"><p className="text-xs font-semibold text-muted-foreground">{label}</p>{label === 'Needs Attention' ? <AlertTriangle size={15} className="text-chart-1" /> : label === 'Money In' ? <ArrowUpRight size={15} className="text-chart-4" /> : label === 'Money Out' ? <ArrowDownRight size={15} className="text-chart-5" /> : null}</div><p className="mt-4 text-[22px] font-bold tracking-[-.045em] text-foreground">{value}</p><p className={`mt-1 text-xs font-bold ${tone === 'green' ? 'text-chart-4' : tone === 'red' ? 'text-chart-5' : tone === 'amber' ? 'text-chart-1' : 'text-muted-foreground'}`}>{meta}</p><p className="mt-3 text-[11px] text-muted-foreground">{detail}</p></article>)}</div>
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3"><div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-border px-3 py-2"><Search size={14} className="text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search accounts..." className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground" aria-label="Search accounts" /></div>{filters.map(filter => <button key={filter} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:border-border hover:text-foreground">{filter}<ChevronDown size={13} className="text-muted-foreground" /></button>)}<div className="flex items-center gap-1 rounded-lg bg-secondary p-1"><button onClick={() => setView('cards')} className={`rounded-md px-2.5 py-1.5 text-xs font-bold ${view === 'cards' ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}>Cards</button><button onClick={() => setView('table')} className={`rounded-md px-2.5 py-1.5 text-xs font-bold ${view === 'table' ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}>Table</button></div><button onClick={() => setQuery('')} className="text-xs font-semibold text-foreground hover:text-foreground">Clear Filters</button><button className="text-xs font-semibold text-foreground">Save Filter</button></div>
        {view === 'cards' ? <div className="space-y-6">{[['Bank Accounts', visibleAccounts.filter(a => a.type === 'Bank Account')], ['Payment Accounts', visibleAccounts.filter(a => a.type === 'Payment Account')], ['Credit Cards', visibleAccounts.filter(a => a.type === 'Credit Card')], ['Cash Accounts', visibleAccounts.filter(a => a.type === 'Cash Account')]].map(([group, groupAccounts]) => <section key={group as string}><div className="mb-3 flex items-center gap-3"><h2 className="text-sm font-bold text-foreground">{group as string}</h2><span className="h-px flex-1 bg-secondary" /><span className="text-[11px] text-muted-foreground">{(groupAccounts as Account[]).length} accounts</span></div><div className="grid grid-cols-1 gap-4 xl:grid-cols-2">{(groupAccounts as Account[]).map(account => <article key={account.name} className="rounded-xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.035)] transition hover:-translate-y-0.5 hover:border-border hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"><div className="flex items-start gap-3"><div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-bold ${account.iconTone}`}>{account.icon}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-bold text-foreground">{account.name}</h3><Badge tone={account.tone}>{account.status}</Badge></div><p className="mt-1 text-xs text-muted-foreground">{account.institution} <span className="mx-1 text-foreground">·</span>{account.type} <span className="mx-1 text-foreground">·</span>{account.number}</p></div><button aria-label={`More actions for ${account.name}`} className="text-foreground hover:text-foreground"><MoreHorizontal size={17} /></button></div><div className="mt-5 flex items-end justify-between"><div><p className="text-[11px] text-muted-foreground">Balance <span className="ml-1 rounded bg-secondary px-1.5 py-0.5 text-[10px]">Observed</span></p><p className={`mt-1 text-2xl font-bold tracking-[-.04em] ${account.balance.startsWith('-') ? 'text-chart-5' : 'text-foreground'}`}>{account.balance}</p></div><div className="text-right"><p className="text-[11px] text-muted-foreground">{account.available ? 'Available' : 'Currency'}</p><p className="mt-1 text-xs font-bold text-foreground">{account.available || account.currency}</p></div></div><div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-3 text-[11px] text-muted-foreground"><span className="inline-flex items-center gap-1"><RefreshCw size={12} />Last sync: {account.sync}</span><span className="text-foreground">·</span><span className={account.reconciliation === 'Reconciled' ? 'font-semibold text-foreground' : account.reconciliation === 'Needs Review' ? 'font-semibold text-chart-1' : 'text-muted-foreground'}>{account.reconciliation === 'Reconciled' ? '✓ ' : account.reconciliation === 'Needs Review' ? '⚠ ' : '— '}{account.reconciliation}</span></div><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => setSelected(account)} className="btn-primary">Open</button><button className="btn-secondary">Transactions</button><button className="btn-secondary">{account.reconciliation === 'Reconciled' ? 'Reconcile' : 'Review'}</button></div></article>)}</div></section>)}</div> : <div className="overflow-x-auto rounded-xl border border-border bg-card"><table className="w-full min-w-[800px] text-left text-xs"><thead className="border-b border-border bg-card text-[11px] uppercase tracking-wide text-muted-foreground"><tr>{['Account', 'Type', 'Balance', 'Available', 'Status', 'Reconciliation', 'Last sync'].map(head => <th key={head} className="px-5 py-3 font-bold">{head}</th>)}</tr></thead><tbody className="divide-y divide-border">{visibleAccounts.map(account => <tr key={account.name} className="hover:bg-secondary/30"><td className="px-5 py-4 font-bold">{account.name}<span className="block mt-1 text-[11px] font-normal text-muted-foreground">{account.institution} · {account.number}</span></td><td className="px-5 py-4 text-muted-foreground">{account.type}</td><td className="px-5 py-4 font-bold">{account.balance}</td><td className="px-5 py-4">{account.available || '—'}</td><td className="px-5 py-4"><Badge tone={account.tone}>{account.status}</Badge></td><td className="px-5 py-4">{account.reconciliation}</td><td className="px-5 py-4 text-muted-foreground">{account.sync}</td></tr>)}</tbody></table></div>}
        <Panel title="Balance History" subtitle="Closing balance trend · EUR · selected period" action="View report"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex gap-1 rounded-lg bg-secondary p-1">{['Daily', 'Weekly', 'Monthly'].map(item => <button key={item} onClick={() => setPeriod(item)} className={`rounded-md px-3 py-1.5 text-xs font-bold ${period === item ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}>{item}</button>)}</div><div className="flex items-center gap-4 text-[11px] text-muted-foreground"><span className="flex items-center gap-2"><i className="h-0.5 w-5 bg-primary text-primary-foreground" />Closing Balance</span><span className="flex items-center gap-2"><i className="h-0.5 w-5 bg-muted" />Available Balance</span><Badge tone="green">+8% vs previous period</Badge></div></div><div className="rounded-lg bg-card/70 p-3"><svg viewBox="0 0 900 260" className="h-[260px] w-full" role="img" aria-label="Balance history line chart from January to June 2025"><g stroke="var(--border)" strokeDasharray="3 5"><path d="M38 35H870M38 88H870M38 141H870M38 194H870" /></g><g fill="var(--border)" fontSize="11"><text x="4" y="39">€150k</text><text x="4" y="92">€125k</text><text x="4" y="145">€100k</text><text x="4" y="198">€75k</text><text x="40" y="235">Jan</text><text x="200" y="235">Feb</text><text x="360" y="235">Mar</text><text x="520" y="235">Apr</text><text x="680" y="235">May</text><text x="830" y="235">Jun</text></g><path d="M40 174 C95 162 138 169 200 142 S290 153 360 116 S438 126 520 98 S600 107 680 74 S770 91 860 48 L860 215 L40 215Z" fill="var(--chart-2)" opacity=".08" /><path d="M40 174 C95 162 138 169 200 142 S290 153 360 116 S438 126 520 98 S600 107 680 74 S770 91 860 48" fill="none" stroke="var(--chart-2)" strokeWidth="3" /><path d="M40 188 C95 178 138 184 200 160 S290 171 360 137 S438 147 520 119 S600 128 680 96 S770 111 860 70" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeDasharray="7 6" /><circle cx="860" cy="48" r="4" fill="var(--foreground)" /></svg></div></Panel>
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]"><Panel title="Account Cash Flow" subtitle="Monthly movement across connected accounts"><div className="flex flex-wrap gap-6 text-xs"><div><p className="text-muted-foreground">Money In</p><strong className="text-chart-4">€28,340</strong></div><div><p className="text-muted-foreground">Money Out</p><strong className="text-chart-5">€14,820</strong></div><div><p className="text-muted-foreground">Net</p><strong className="text-foreground">+€13,520</strong></div></div><div className="mt-5 flex h-40 items-end justify-around gap-4 border-b border-l border-border px-4 pb-0 pt-5">{[['Jan', '54', '32'], ['Feb', '68', '38'], ['Mar', '48', '26'], ['Apr', '78', '34'], ['May', '62', '30'], ['Jun', '88', '42']].map(([month, incoming, outgoing]) => <div key={month} className="flex h-full flex-1 items-end justify-center gap-1"><div className="w-3 rounded-t bg-primary text-primary-foreground" style={{
                  height: `${incoming}%`
                }} /><div className="w-3 rounded-t bg-chart-5/20" style={{
                  height: `${outgoing}%`
                }} /><span className="absolute mt-44 text-[10px] text-muted-foreground">{month}</span></div>)}</div><div className="mt-7 flex items-center justify-between"><div className="flex gap-4 text-[11px] text-muted-foreground"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-primary text-primary-foreground" />Money In</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-chart-5/20" />Money Out</span></div><button className="text-xs font-bold text-foreground">Open Cash Flow →</button></div></Panel><Panel title="Recent Transactions" subtitle="Latest account activity" action="View all"><div className="overflow-x-auto"><table className="w-full text-left text-[11px]"><thead className="text-muted-foreground"><tr>{['Date', 'Description', 'Direction', 'Amount'].map(head => <th key={head} className="pb-2 font-semibold">{head}</th>)}</tr></thead><tbody className="divide-y divide-border">{transactions.map(row => <tr key={`${row[0]}-${row[1]}`}><td className="py-2.5 text-muted-foreground">{row[0]}</td><td className="max-w-[150px] truncate py-2.5 font-semibold">{row[1]}<span className="block font-normal text-muted-foreground">{row[4]} · {row[5]}</span></td><td className={`py-2.5 ${row[2] === 'In' ? 'text-foreground' : 'text-chart-5'}`}>{row[2]}</td><td className="py-2.5 text-right font-bold">{row[3]}</td></tr>)}</tbody></table></div></Panel></div>
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><Panel title="Reconciliation" subtitle="Account reconciliation health"><div className="grid grid-cols-3 gap-3 text-xs"><div className="rounded-lg bg-secondary p-3"><p className="text-foreground">Reconciled</p><strong className="mt-1 block text-lg text-foreground">€138,450</strong></div><div className="rounded-lg bg-chart-1/10 p-3"><p className="text-chart-1">Needs Review</p><strong className="mt-1 block text-lg text-chart-1">€2,860</strong></div><div className="rounded-lg bg-card p-3"><p className="text-muted-foreground">Unmatched</p><strong className="mt-1 block text-lg text-foreground">4 items</strong></div></div><p className="mt-5 text-xs text-muted-foreground">Last Reconciliation: <strong className="text-foreground">Today 09:14</strong></p><div className="mt-4 flex gap-2"><button className="btn-primary">Reconcile Account</button><button className="btn-secondary">View Reconciliation</button></div></Panel><Panel title="Account Activity" subtitle="System and user events"><div className="divide-y divide-border">{activity.map(([event, source, time, status, tone]) => <div key={event} className="flex items-center gap-3 py-3 first:pt-0"><div className={`grid h-7 w-7 place-items-center rounded-full ${tone === 'green' ? 'bg-chart-4/10 text-chart-4' : tone === 'amber' ? 'bg-chart-1/10 text-chart-1' : 'bg-secondary text-foreground'}`}><Activity size={13} /></div><div className="min-w-0 flex-1"><p className="text-xs font-bold">{event}</p><p className="text-[11px] text-muted-foreground">{source} · {time}</p></div><Badge tone={tone as Tone}>{status}</Badge></div>)}</div></Panel></div>
        <Panel title="Account Anomalies · AI-monitored" subtitle="Automated detection across connected financial data"><div className="grid grid-cols-1 gap-3 xl:grid-cols-3">{anomalies.map(([name, title, description, detected, severity, tone]) => <article key={title} className="rounded-lg border border-border p-4"><div className="flex items-start gap-3"><AlertTriangle size={17} className={tone === 'red' ? 'text-chart-5' : 'text-foreground'} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-xs font-bold">{name} — {title}</h3><Badge tone={tone as Tone}>{severity}</Badge></div><p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p><p className="mt-2 text-[11px] text-muted-foreground">{detected}</p><div className="mt-3 flex gap-3"><button className="text-[11px] font-bold text-foreground">Investigate</button><button className="text-[11px] font-bold text-foreground">{name === 'Business Checking' ? 'Open Account' : 'Ask Lulu AI'}</button></div></div></div></article>)}</div></Panel>
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_1fr]"><Panel title="AI Insights" subtitle="Evidence-backed account intelligence"><div className="rounded-lg border border-border bg-secondary/60 p-4"><div className="flex items-center gap-2"><Sparkles size={15} className="text-foreground" /><Badge tone="violet">AI Insight</Badge></div><p className="mt-3 text-sm font-semibold leading-6 text-foreground">The combined balance across connected EUR accounts increased 8% during the selected period.</p><div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs sm:grid-cols-4"><div><p className="text-muted-foreground">Previous Balance</p><strong>€130,990</strong></div><div><p className="text-muted-foreground">Current Balance</p><strong>€141,590</strong></div><div><p className="text-muted-foreground">Change</p><strong className="text-foreground">+€10,600</strong></div><div><p className="text-muted-foreground">Contributing</p><strong>2 accounts</strong></div></div></div></Panel><Panel title="AI Recommendations" subtitle="Prioritized next best actions"><div className="space-y-2">{recommendations.map((recommendation, i) => <button key={recommendation} className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left hover:border-border"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">{i + 1}</span><span className="text-xs font-semibold">{recommendation}</span><ChevronDown size={14} className="ml-auto -rotate-90 text-muted-foreground" /></button>)}</div></Panel></div>
        <section className="mt-6 rounded-xl border border-border bg-gradient-to-br from-secondary via-white to-secondary p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)]"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Bot size={18} /></div><div><h2 className="text-base font-bold">Ask Lulu AI</h2><p className="text-xs text-muted-foreground">Your financial intelligence, ready when you are.</p></div></div><div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-sm"><input value={question} onChange={e => {
              setQuestion(e.target.value);
              setSent(false);
            }} onKeyDown={e => e.key === 'Enter' && setSent(true)} placeholder="Ask Lulu AI about your financial accounts..." className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground" aria-label="Ask Lulu AI about your financial accounts" /><button onClick={() => setSent(true)} className="rounded-lg bg-primary p-2.5 text-primary-foreground hover:bg-primary" aria-label="Send question"><Send size={16} /></button></div>{sent && <p className="mt-2 text-xs text-foreground">Lulu AI is preparing an evidence-backed answer{question ? ` about “${question}”` : ''}.</p>}<div className="mt-4 flex gap-2 overflow-x-auto pb-1">{['What is our current total balance?', 'Which accounts need attention?', 'Which accounts have sync issues?', 'Compare activity with last month', 'Show largest outgoing activity'].map(prompt => <button key={prompt} onClick={() => setQuestion(prompt)} className="shrink-0 rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary">{prompt}</button>)}</div></section>
      </div></main>
    {selected && <div className="fixed inset-0 z-20 bg-sidebar/20" onClick={() => setSelected(null)}><aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-card p-6 shadow-2xl" onClick={e => e.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-xs font-semibold text-foreground">Account panel</p><h2 className="mt-1 text-xl font-bold">{selected.name}</h2><p className="mt-1 text-sm text-muted-foreground">{selected.institution} · {selected.number}</p></div><button onClick={() => setSelected(null)} aria-label="Close account panel" className="rounded-lg p-2 text-foreground hover:bg-secondary"><X size={18} /></button></div><div className="mt-7 rounded-xl bg-card p-5"><p className="text-xs text-muted-foreground">Current balance</p><p className="mt-2 text-3xl font-bold tracking-tight">{selected.balance}</p><div className="mt-3 flex gap-2"><Badge tone={selected.tone}>{selected.status}</Badge><Badge tone={selected.reconciliation === 'Reconciled' ? 'green' : 'amber'}>{selected.reconciliation}</Badge></div></div><div className="mt-6 space-y-4"><div className="flex justify-between border-b border-border pb-3 text-sm"><span className="text-muted-foreground">Account type</span><strong>{selected.type}</strong></div><div className="flex justify-between border-b border-border pb-3 text-sm"><span className="text-muted-foreground">Currency</span><strong>{selected.currency}</strong></div><div className="flex justify-between border-b border-border pb-3 text-sm"><span className="text-muted-foreground">Last synchronized</span><strong>{selected.sync}</strong></div></div><div className="mt-7 grid grid-cols-2 gap-2"><button className="btn-primary justify-center">Transactions</button><button className="btn-secondary justify-center">Reconcile</button></div><p className="mt-6 text-xs leading-5 text-muted-foreground">Account data is synchronized from your connected institution. No credentials or sensitive tokens are stored in this view.</p></aside></div>}
    <style>{`.btn-primary{display:inline-flex;align-items:center;gap:.4rem;border-radius:.5rem;background:var(--primary);padding:.58rem .75rem;font-size:.7rem;font-weight:700;color:var(--primary-foreground)}.btn-primary:hover{background:var(--primary);color:var(--primary-foreground)}.btn-secondary{display:inline-flex;align-items:center;gap:.4rem;border-radius:.5rem;border:1px solid var(--border);background:var(--card);padding:.58rem .75rem;font-size:.7rem;font-weight:700;color:var(--muted-foreground)}.btn-secondary:hover{border-color:var(--foreground);color:var(--foreground)}`}</style>
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
  }, {
    "id": "nicely-land-1864",
    "label": "Settings"
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
            return <a key={page.id} href={`#${page.id}`} aria-current={isActivePage ? 'page' : undefined} className={`block rounded-md px-3 py-2 text-xs transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {page.label}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}