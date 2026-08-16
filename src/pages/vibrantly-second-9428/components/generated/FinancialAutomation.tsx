import { useState } from 'react';
import { Activity, AlertTriangle, ArrowDown, Bot, Check, ChevronDown, Clock3, Copy, Edit3, FileText, Filter, History, MoreHorizontal, PanelLeft, Play, Plus, Search, Send, Settings2, Sparkles, Trash2, X, Zap } from 'lucide-react';
type Tone = 'violet' | 'green' | 'amber' | 'red' | 'orange' | 'blue' | 'slate';
const navItems = ['Finance Overview', 'Invoices', 'Offers & Quotes', 'Payments', 'Expenses', 'Income', 'Transactions', 'Accounts', 'Cash Flow', 'Budgets', 'Financial Planning', 'Taxes', 'Payouts', 'Reconciliation', 'Financial Automation', 'Finance Settings'];
const automations = [['Invoice Reminder', 'Invoice becomes overdue', 'Send notification, Create task', 'Active', '08 Aug 2026', '09 Aug 2026', '124', '98.4%', 'Finance Team'], ['High-Value Expense Flag', 'Expense exceeds €5,000', 'Flag transaction, Request approval', 'Active', '07 Aug 2026', 'On trigger', '89', '100%', 'CFO'], ['Payout Delay Alert', 'Payout delayed', 'Send notification, Notify team', 'Active', '06 Aug 2026', 'On trigger', '47', '95.7%', 'Finance Team'], ['Unmatched Transaction Task', 'Transaction unmatched 3+ days', 'Create review task', 'Active', '08 Aug 2026', 'On trigger', '203', '96.1%', 'Finance Ops'], ['Tax Deadline Reminder', 'Tax deadline approaching', 'Send notification, Notify team', 'Active', '05 Aug 2026', '20 Aug 2026', '12', '100%', 'Finance Manager'], ['Monthly Finance Report', 'Monthly schedule', 'Generate report, Send email', 'Paused', '01 Aug 2026', '01 Sep 2026', '8', '87.5%', 'Finance Team']];
const executions = [['08 Aug 2026 · 09:42', 'Invoice Reminder', 'Invoice overdue', 'INV-2847', 'Successful', '0.8s', 'System'], ['08 Aug 2026 · 09:16', 'Unmatched Transaction Task', '3 days unmatched', 'TXN-01842', 'Successful', '1.4s', 'System'], ['07 Aug 2026 · 18:03', 'High-Value Expense Flag', 'Expense > €5,000', 'EXP-9021', 'Awaiting Approval', '0.6s', 'System'], ['07 Aug 2026 · 15:21', 'Payout Delay Alert', 'Payout delayed', 'PAY-448', 'Failed', '2.1s', 'System'], ['06 Aug 2026 · 11:08', 'Invoice Reminder', 'Invoice overdue', 'INV-2842', 'Skipped', '—', 'System']];
const failed = [['Payout Delay Alert', 'Could not reach payment provider', '07 Aug 2026', '3 failures'], ['Monthly Finance Report', 'Recipient mailbox rejected email', '01 Aug 2026', '1 failure'], ['Invoice Reminder', 'Missing account owner', '31 Jul 2026', '2 failures']];
const recommendations = [['Invoice Follow-Up', 'Notify the responsible team when invoices become overdue.'], ['Reconciliation Review', 'Create a task when transactions remain unmatched for more than 3 days.'], ['Payout Monitoring', 'Alert the finance team when a payout becomes delayed.']];
const templates = [['Invoice', 'Notify when invoice becomes overdue', 'Keep your team informed and reduce late payments.'], ['Flag', 'Flag high-value expense (> €5,000)', 'Route unusual spend to the right approver.'], ['Wallet', 'Alert when account balance falls below threshold', 'Protect cash flow with an early warning.'], ['Report', 'Generate monthly finance report', 'Create and distribute a clear monthly summary.']];
const approvals = [['High-Value Expense Flag', 'Request approval', '€12,400', 'EXP-9021', 'Maya Chen', '08 Aug', 'CFO'], ['Invoice Reminder', 'Create task', '€10,800', 'INV-2821', 'Alex Morgan', '07 Aug', 'Finance Manager'], ['Payout Delay Alert', 'Notify team', '€8,200', 'PAY-441', 'Sam Wilson', '06 Aug', 'CFO']];
const versions = [['v3', '08 Aug 2026', 'Alex Morgan', 'Added approval step', 'Active'], ['v2', '02 Aug 2026', 'Maya Chen', 'Updated trigger conditions', 'Archived'], ['v1', '18 Jul 2026', 'Alex Morgan', 'Initial automation', 'Archived']];
const activity = [['Automation activated', '08 Aug 2026 · Alex Morgan'], ['Approval step added', '07 Aug 2026 · Maya Chen'], ['Automation tested successfully', '07 Aug 2026 · Alex Morgan'], ['Automation created', '18 Jul 2026 · Alex Morgan']];
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
    orange: 'bg-secondary text-foreground border-border',
    blue: 'bg-secondary text-foreground border-border',
    slate: 'bg-card text-muted-foreground border-border'
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-semibold ${styles[tone]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{children}</span>;
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
function statusTone(status: string): Tone {
  return status === 'Active' || status === 'Successful' ? 'green' : status === 'Paused' || status === 'Awaiting Approval' ? 'amber' : status === 'Failed' ? 'red' : 'slate';
}
export function FinancialAutomation() {
  const [query, setQuery] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(false);
  const [prompt, setPrompt] = useState('');
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
    <aside className="fixed inset-y-0 left-0 hidden w-[244px] flex-col bg-[var(--sidebar)] text-foreground lg:flex"><div className="flex h-16 items-center gap-3 border-b border-border px-6"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={17} /></div><strong className="text-lg tracking-tight text-foreground">LULU <span className="font-normal text-foreground">AI</span></strong></div><div className="px-4 py-5"><div className="mb-3 flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground"><span>Workspace</span><Plus size={13} /></div><LuluSectionNavigation activeId="vibrantly-second-9428" /></div><div className="mt-auto border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-foreground hover:bg-secondary"><Settings2 size={15} />Workspace settings</button><div className="mt-3 flex items-center gap-3 rounded-lg bg-secondary p-3"><div className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">AM</div><div><p className="text-xs font-semibold text-foreground">Alex Morgan</p><p className="text-[10px] text-muted-foreground">Admin</p></div><MoreHorizontal size={15} className="ml-auto" /></div></div></aside>
    <main className="lg:ml-[244px]"><div className="flex h-16 items-center justify-between border-b border-border bg-card px-5 lg:px-8"><div className="flex items-center gap-3"><PanelLeft size={18} className="text-muted-foreground lg:hidden" /><span className="text-xs text-muted-foreground">Business /</span><span className="text-xs font-semibold text-muted-foreground">Finance</span></div><div className="flex items-center gap-3"><div className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 md:flex"><Search size={14} className="text-muted-foreground" /><input placeholder="Search finance..." className="w-40 bg-transparent text-xs outline-none placeholder:text-muted-foreground" /></div><Activity size={17} className="text-muted-foreground" /><div className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-[10px] font-bold text-muted-foreground">AM</div></div></div>
      <div className="mx-auto max-w-[1440px] px-5 py-7 lg:px-8"><header className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-3 text-xs font-medium text-muted-foreground">Finance <span className="mx-1">/</span> Financial Automation</p><h1 className="text-3xl font-bold tracking-[-0.04em] text-foreground">Financial Automation</h1><p className="mt-2 text-sm text-muted-foreground">Automate repetitive financial processes with clear controls, approvals and audit trails.</p></div><div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary"><Plus size={15} />Create Automation</button><button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-xs font-semibold text-foreground hover:border-border"><Sparkles size={14} className="text-foreground" />Ask Lulu AI</button><button className="rounded-lg border border-border bg-card px-3 py-2.5 text-xs font-semibold text-foreground">Automation Templates</button><button className="rounded-lg border border-border bg-card p-2.5 text-foreground"><MoreHorizontal size={16} /></button></div></header>
        <div className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{[['Active Automations', '18', 'green'], ['Executions', '1,284', 'slate'], ['Successful', '1,251', 'green'], ['Failed', '33', 'red'], ['Pending Approval', '7', 'amber'], ['Estimated Time Saved', '42h', 'violet']].map(([label, value, tone]) => <article key={label} className="rounded-xl border border-border bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><div className="flex items-start justify-between"><p className="text-xs font-semibold text-muted-foreground">{label}</p><span className={`h-2 w-2 rounded-full ${tone === 'green' ? 'bg-chart-4' : tone === 'red' ? 'bg-destructive' : tone === 'amber' ? 'bg-chart-1' : 'bg-primary'}`} /></div><p className="mt-4 text-[22px] font-bold tracking-[-0.04em] text-foreground">{value}</p><p className="mt-1 text-[11px] text-muted-foreground">{label === 'Successful' ? '97.4% success rate' : label === 'Failed' ? 'Requires attention' : label === 'Executions' ? 'This month' : label === 'Estimated Time Saved' ? 'Estimated' : 'Live workspace data'}</p></article>)}</div>
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3"><div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-lg border border-border px-3 py-2"><Search size={14} className="text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search financial automations..." className="w-full bg-transparent text-xs outline-none" /></div>{['Status', 'Trigger Type', 'Action Type', 'Owner', 'Execution Status'].map(item => <button key={item} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:border-border"><Filter size={12} className="text-muted-foreground" />{item}<ChevronDown size={12} /></button>)}<button className="px-2 text-xs font-semibold text-foreground hover:text-foreground">Clear Filters</button><button className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground">Save Filter</button></div>
        <Card title="Financial Automations" subtitle={`${automations.length} automations · Updated a few seconds ago`} action="Export"><div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left text-[11px]"><thead className="border-b border-border text-[10px] uppercase tracking-wide text-muted-foreground"><tr>{['Automation', 'Trigger', 'Actions', 'Status', 'Last Run', 'Next Run', 'Executions', 'Success Rate', 'Owner', ''].map(head => <th key={head} className="pb-3 pr-4 font-bold">{head}</th>)}</tr></thead><tbody className="divide-y divide-border">{automations.filter(row => row.join(' ').toLowerCase().includes(query.toLowerCase())).map(row => <tr key={row[0]} className="group hover:bg-secondary/40"><td className="py-3 pr-4 font-bold text-foreground">{row[0]}</td><td className="max-w-[150px] py-3 pr-4 text-muted-foreground">{row[1]}</td><td className="max-w-[170px] py-3 pr-4 text-muted-foreground">{row[2]}</td><td className="py-3 pr-4"><Badge tone={statusTone(row[3])}>{row[3]}</Badge></td><td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">{row[4]}</td><td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">{row[5]}</td><td className="py-3 pr-4 font-semibold">{row[6]}</td><td className="py-3 pr-4 font-semibold text-foreground">{row[7]}</td><td className="py-3 pr-4 text-muted-foreground">{row[8]}</td><td className="relative py-3 text-right"><button onClick={() => setOpenMenu(openMenu === row[0] ? null : row[0])} className="rounded-md p-1 text-foreground hover:bg-secondary hover:text-foreground" aria-label={`Actions for ${row[0]}`}><MoreHorizontal size={16} /></button>{openMenu === row[0] && <div className="absolute right-0 top-9 z-10 w-36 rounded-lg border border-border bg-card p-1 text-left shadow-lg"><button className="flex w-full gap-2 rounded-md px-3 py-2 text-xs hover:bg-card"><Edit3 size={13} />Edit</button><button className="flex w-full gap-2 rounded-md px-3 py-2 text-xs hover:bg-card"><Copy size={13} />Duplicate</button><button className="flex w-full gap-2 rounded-md px-3 py-2 text-xs hover:bg-card"><Play size={13} />Test</button><button className="flex w-full gap-2 rounded-md px-3 py-2 text-xs hover:bg-card"><History size={13} />View History</button><button className="flex w-full gap-2 rounded-md px-3 py-2 text-xs text-chart-5 hover:bg-chart-5/10"><Trash2 size={13} />Delete</button></div>}</td></tr>)}</tbody></table></div></Card>
        <div className="my-6"><Card title="Invoice Reminder" subtitle="Automation builder · Version 3"><div className="mb-4 flex items-center justify-between"><p className="text-xs text-muted-foreground">Visual flow <span className="mx-1">·</span> All changes are versioned</p><button onClick={() => setTestMode(!testMode)} className={`rounded-lg border px-3 py-2 text-xs font-bold ${testMode ? 'border-border bg-secondary text-foreground' : 'border-border text-foreground'}`}><Play size={12} className="mr-1 inline" />{testMode ? 'Exit test mode' : 'Test automation'}</button></div>{testMode && <div className="mb-4 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-semibold text-foreground">Simulation — No changes will be made.</div>}<div className="mx-auto max-w-[680px]">{[['WHEN', 'Invoice becomes overdue', 'violet'], ['IF', 'Amount > €1,000 AND Days overdue > 3', 'blue'], ['THEN', 'Send notification to Finance Team · Create task: Follow up on invoice', 'green'], ['REQUIRES', 'Finance Manager approval for amounts > €10,000', 'amber'], ['THEN', 'Notify: Invoice reminder sent', 'slate']].map(([label, text, tone], i) => <div key={`${label}-${text}`}><div className={`flex items-center gap-4 rounded-xl border-l-4 border-${tone}-500 bg-${tone === 'violet' ? 'violet' : tone === 'blue' ? 'blue' : tone === 'green' ? 'emerald' : tone === 'amber' ? 'amber' : 'slate'}-50 px-4 py-3`}><div className={`grid h-7 w-7 place-items-center rounded-lg bg-card text-${tone === 'violet' ? 'violet' : tone === 'blue' ? 'blue' : tone === 'green' ? 'emerald' : tone === 'amber' ? 'amber' : 'slate'}-700 shadow-sm`}><Zap size={14} /></div><div className="flex-1"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p><p className="mt-1 text-xs font-semibold text-foreground">{text}</p></div><button className="rounded-md p-1.5 text-foreground hover:bg-card"><Edit3 size={14} /></button><button className="rounded-md p-1.5 text-foreground hover:bg-card"><Plus size={14} /></button></div>{i < 4 && <div className="flex h-7 justify-center text-foreground"><ArrowDown size={16} /></div>}</div>)}</div></Card></div>
        <Card title="Execution History" subtitle="Recent automation activity"><div className="mb-3 flex justify-end"><button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground">This Month <ChevronDown size={13} /></button></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-[11px]"><thead className="border-b border-border text-[10px] uppercase tracking-wide text-muted-foreground"><tr>{['Date', 'Automation', 'Trigger', 'Record', 'Result', 'Duration', 'User/System', 'Actions'].map(x => <th key={x} className="pb-3 pr-4">{x}</th>)}</tr></thead><tbody className="divide-y divide-border">{executions.map(row => <tr key={`${row[0]}-${row[3]}`}><td className="py-3 pr-4 text-muted-foreground">{row[0]}</td><td className="py-3 pr-4 font-semibold">{row[1]}</td><td className="py-3 pr-4 text-muted-foreground">{row[2]}</td><td className="py-3 pr-4 font-mono text-muted-foreground">{row[3]}</td><td className="py-3 pr-4"><Badge tone={statusTone(row[4])}>{row[4]}</Badge></td><td className="py-3 pr-4 text-muted-foreground">{row[5]}</td><td className="py-3 pr-4 text-muted-foreground">{row[6]}</td><td className="py-3"><button className="font-semibold text-foreground hover:text-foreground">View Execution</button></td></tr>)}</tbody></table></div></Card>
        <div className="my-6 grid grid-cols-1 gap-6 xl:grid-cols-2"><Card title="Failed Automations" subtitle="3 items need attention"><div className="space-y-3">{failed.map(item => <div key={item[0]} className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0"><div className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-chart-5/10 text-chart-5"><AlertTriangle size={14} /></div><div className="min-w-0 flex-1"><p className="text-xs font-bold">{item[0]}</p><p className="mt-1 text-[11px] text-muted-foreground">{item[1]}</p><p className="mt-1 text-[10px] text-muted-foreground">{item[2]} · {item[3]}</p></div><div className="flex gap-2"><button className="text-[11px] font-bold text-foreground">Investigate</button><button className="text-[11px] font-bold text-foreground">Retry</button></div></div>)}</div></Card><Card title="Pending Approvals" subtitle="Only authorized users can approve."><div className="space-y-3">{approvals.map(item => <div key={item[3]} className="rounded-lg border border-border p-3"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold">{item[0]}</p><p className="mt-1 text-[11px] text-muted-foreground">{item[1]} · {item[3]} · requested by {item[4]}</p></div><strong className="text-sm">{item[2]}</strong></div><div className="mt-3 flex items-center justify-between"><span className="text-[10px] text-muted-foreground">{item[5]} · Approver: {item[6]}</span><div className="flex gap-2"><button className="rounded-md bg-chart-4 px-2.5 py-1.5 text-[11px] font-bold text-foreground">Approve</button><button className="rounded-md border border-chart-5/30 px-2.5 py-1.5 text-[11px] font-bold text-chart-5">Reject</button></div></div></div>)}</div></Card></div>
        <Card title="AI Recommendations" subtitle="Practical next steps for your finance workspace"><div className="mb-4 flex items-center gap-2"><Sparkles size={15} className="text-foreground" /><Badge tone="violet">AI-generated</Badge></div><div className="grid gap-3 md:grid-cols-3">{recommendations.map(item => <article key={item[0]} className="rounded-lg border border-border bg-secondary/40 p-4"><h3 className="text-xs font-bold">{item[0]}</h3><p className="mt-2 min-h-10 text-[11px] leading-5 text-muted-foreground">{item[1]}</p><button className="mt-4 rounded-lg border border-border bg-card px-3 py-2 text-[11px] font-bold text-foreground">Use Template</button></article>)}</div></Card>
        <div className="my-6"><Card title="Financial Automation Templates" subtitle="Start with a proven workflow"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{templates.map(item => <article key={item[1]} className="rounded-lg border border-border p-4 hover:border-border"><div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-foreground"><FileText size={15} /></div><h3 className="mt-3 text-xs font-bold leading-5">{item[1]}</h3><p className="mt-2 min-h-10 text-[11px] leading-5 text-muted-foreground">{item[2]}</p><button className="mt-4 text-[11px] font-bold text-foreground">Use Template <span aria-hidden="true">→</span></button></article>)}</div></Card></div>
        <div className="my-6 grid grid-cols-1 gap-6 xl:grid-cols-2"><Card title="Automation Performance" action="This Month"><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{[['Total executions', '1,284'], ['Success rate', '97.4%'], ['Avg execution time', '1.2s'], ['Estimated time saved', '42h']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><strong className="mt-2 block text-xl tracking-tight">{item[1]}</strong>{item[0] === 'Estimated time saved' && <span className="text-[10px] text-muted-foreground">Estimated</span>}</div>)}</div><div className="mt-6 flex h-32 items-end gap-3 border-b border-border px-3">{[38, 52, 48, 70, 58, 82, 76, 94, 88, 100, 91, 108].map((height, i) => <div key={`bar-${height}-${i}`} className="group flex flex-1 items-end"><div style={{
                  height: `${height}px`
                }} className="w-full rounded-t-md bg-secondary transition group-hover:bg-primary" /></div>)}</div><div className="mt-2 flex justify-between text-[10px] text-muted-foreground"><span>Jan</span><span>Jun</span><span>Aug</span></div></Card><Card title="Versions & Activity"><div className="mb-4 flex gap-1 rounded-lg bg-secondary p-1"><button className="rounded-md bg-card px-3 py-1.5 text-xs font-bold text-foreground shadow-sm">Versions</button><button className="px-3 py-1.5 text-xs font-semibold text-foreground">Activity</button></div><div className="space-y-2">{versions.map(row => <div key={row[0]} className="grid grid-cols-[40px_1fr_1fr_auto] items-center gap-3 border-b border-border py-2 text-[11px] last:border-0"><strong>{row[0]}</strong><span className="text-muted-foreground">{row[1]} · {row[2]}</span><span className="text-muted-foreground">{row[3]}</span><Badge tone={row[4] === 'Active' ? 'green' : 'slate'}>{row[4]}</Badge></div>)}</div><div className="mt-4 border-t border-border pt-4">{activity.map(item => <div key={item[0]} className="flex items-center gap-3 py-2 text-[11px]"><div className="h-2 w-2 rounded-full bg-primary text-primary-foreground" /><strong>{item[0]}</strong><span className="ml-auto text-muted-foreground">{item[1]}</span></div>)}</div></Card></div>
        <section className="my-6 rounded-xl border border-border bg-gradient-to-br from-secondary via-white to-secondary p-6"><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Bot size={17} /></div><div><h2 className="text-base font-bold">Ask Lulu AI</h2><p className="text-xs text-muted-foreground">Describe a process and Lulu will draft the workflow.</p></div></div><textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="mt-5 min-h-24 w-full resize-none rounded-xl border border-border bg-card p-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" placeholder="Describe a financial process you want to automate..." aria-label="Describe a financial process" /><div className="mt-3 flex flex-wrap gap-2">{['Notify when invoice is overdue', 'Flag expenses above €5,000', 'Alert on delayed payout'].map(chip => <button key={chip} onClick={() => setPrompt(chip)} className="rounded-full border border-border bg-card px-3 py-2 text-[11px] font-medium text-foreground hover:bg-secondary">{chip}</button>)}</div><div className="mt-4 flex items-center justify-between"><p className="text-[11px] text-muted-foreground">AI-generated automations require your review before activation.</p><button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary"><Sparkles size={14} />Generate Automation</button></div></section>
        <section className="my-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dashed border-border bg-secondary p-5 opacity-70"><div><h2 className="text-sm font-bold">No financial automations yet</h2><p className="mt-1 text-xs text-muted-foreground">Create your first workflow or start with a template.</p></div><div className="flex flex-wrap gap-2"><button className="rounded-lg bg-primary px-3 py-2 text-[11px] font-bold text-primary-foreground">Create Automation</button><button className="rounded-lg border border-border bg-card px-3 py-2 text-[11px] font-bold text-foreground">Browse Templates</button><button className="rounded-lg border border-border bg-card px-3 py-2 text-[11px] font-bold text-foreground">Ask Lulu AI</button></div></section>
        <footer className="pb-8 text-center text-[11px] text-muted-foreground">Financial automations respect user permissions, approval workflows, and audit policies. High-risk actions require explicit authorization.</footer>
      </div></main>
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
