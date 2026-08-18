import { useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertTriangle, ArrowLeftRight, Bot, Check, ChevronDown, CircleHelp, CircleX, Clock3, Download, FileText, Filter, Landmark, Link2, MoreHorizontal, PanelLeft, Plus, RefreshCw, Search, Send, Settings2, Sparkles, Split, Upload, X, Zap } from 'lucide-react';
type Tone = 'violet' | 'green' | 'amber' | 'yellow' | 'red' | 'blue' | 'slate';
const navItems = ['Finance Overview', 'Invoices', 'Offers & Quotes', 'Payments', 'Expenses', 'Income', 'Transactions', 'Accounts', 'Cash Flow', 'Budgets', 'Financial Planning', 'Taxes', 'Payouts', 'Reconciliation', 'Financial Automation', 'Finance Settings'];
const kpis = [['Records to Review', '24', 'Needs attention', 'slate'], ['Matched', '1,847', '+12.4% this period', 'green'], ['Unmatched', '18', '4 fewer than last period', 'amber'], ['Partial Matches', '6', '2 require review', 'yellow'], ['Discrepancies', '3', '1 high severity', 'red'], ['Reconciled Amount', '€1,204,560', '82.4% of records', 'green'], ['Remaining Amount', '€48,320', '−8.2% this period', 'amber'], ['Reconciliation Progress', '82.4%', '+6.8% this period', 'violet']] as const;
const leftRecords = [['Mar 28', 'Stripe payout · INV-2847', '+€4,200.00', 'TXN-8824', 'Stripe', 'Matched', 'green'], ['Mar 27', 'Adobe Creative Cloud', '−€249.00', 'TXN-8821', 'Main Account', 'Suggested Match', 'blue'], ['Mar 26', 'Client payment · ACME', '+€8,400.00', 'TXN-8815', 'Main Account', 'Unmatched', 'amber'], ['Mar 24', 'Payroll · March', '−€42,800.00', 'TXN-8802', 'Operations', 'Partial', 'yellow'], ['Mar 22', 'Google Ads', '−€1,240.00', 'TXN-8788', 'Main Account', 'Discrepancy', 'red']] as const;
const rightRecords = [['Mar 28', 'Stripe transfer · payout', '+€4,200.00', 'ST-7291', 'Stripe', 'Matched', 'green'], ['Mar 25', 'Adobe Systems *SUBS', '−€249.00', 'BNK-4038', 'IBAN Bank', 'Suggested Match', 'blue'], ['Mar 24', 'ACME CORP TRANSFER', '+€8,400.00', 'BNK-4021', 'IBAN Bank', 'Unmatched', 'amber'], ['Mar 22', 'Payroll clearing', '−€40,000.00', 'BNK-3997', 'Operations', 'Partial', 'yellow'], ['Mar 21', 'GOOGLE *ADS', '−€1,280.00', 'BNK-3988', 'IBAN Bank', 'Discrepancy', 'red']] as const;
const suggestions = [['Adobe Creative Cloud', '−€249.00', 'Adobe Systems *SUBS', '−€249.00', 'High', 'Amount and reference match exactly'], ['Stripe payout · INV-2847', '+€4,200.00', 'Stripe transfer · payout', '+€4,200.00', 'High', 'Amount, date and source match'], ['Payroll · March', '−€42,800.00', 'Payroll clearing', '−€40,000.00', 'Medium', 'Amount matches, date differs by 2 days']];
const unmatched = [['Mar 26', 'Client payment · ACME', '+€8,400.00', 'Main Account', 'Missing Reference'], ['Mar 19', 'Cloud hosting invoice', '−€1,860.00', 'Operations', 'Timing Difference'], ['Mar 17', 'Supplier payment · NORTH', '−€3,240.00', 'Main Account', 'Missing Record']];
const rules = [['Exact Amount Match', 'Amount equals · Currency equals', '1', 'Active', 'Today'], ['Date Tolerance ±3 Days', 'Date within 3 calendar days', '2', 'Active', 'Mar 24'], ['Reference Match', 'Reference contains invoice ID', '3', 'Active', 'Mar 18'], ['External ID Match', 'External ID is present', '4', 'Inactive', 'Mar 02'], ['Description Similarity', 'Description similarity > 85%', '5', 'Active', 'Feb 28']];
const history = [['Match Confirmed', 'Today · 09:14', 'Workspace administrator', '3 records affected', 'Unmatched → Matched'], ['Sync Completed', 'Today · 08:52', 'System', '42 records updated', 'Sync finished'], ['Discrepancy Resolved', 'Yesterday · 16:40', 'Workspace administrator', 'Google Ads · €1,240', 'Needs review → Resolved'], ['Adjustment Created', 'Mar 27 · 14:22', 'Workspace administrator', 'Payroll · €2,800', 'Partial → Adjustment']];
function badgeClass(tone: Tone) {
  return {
    violet: 'bg-secondary text-foreground border-border',
    green: 'bg-secondary text-foreground border-border',
    amber: 'bg-secondary text-foreground border-border',
    yellow: 'bg-secondary text-foreground border-border',
    red: 'bg-chart-5/10 text-chart-5 border-chart-5/30',
    blue: 'bg-secondary text-foreground border-border',
    slate: 'bg-card text-muted-foreground border-border'
  }[tone];
}
function toneForStatus(status: string): Tone {
  return status === 'Matched' ? 'green' : status === 'Suggested Match' ? 'blue' : status === 'Unmatched' ? 'amber' : status === 'Partial' ? 'yellow' : 'red';
}
function Badge({
  children,
  tone = 'slate'
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-bold ${badgeClass(tone)}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{children}</span>;
}
function Section({
  title,
  subtitle,
  children,
  action
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return <section className="rounded-xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,.03)]"><header className="mb-5 flex items-start justify-between gap-4"><div><h2 className="text-[15px] font-bold tracking-[-.01em] text-foreground">{title}</h2>{subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}</div>{action}</header>{children}</section>;
}
export function LuluReconciliation() {
  const [syncing, setSyncing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [query, setQuery] = useState('');
  const [showUnmatched, setShowUnmatched] = useState(true);
  const [showRules, setShowRules] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { items: liveReconciliations, loading: liveLoading, error: liveError } = useLiveRecords('finance_reconciliations');
  const liveEmpty = !liveLoading && !liveError && liveReconciliations.length === 0;
  const startSync = () => {
    setSyncing(true);
    window.setTimeout(() => setSyncing(false), 1400);
  };
  return <div className="min-h-screen bg-[var(--background)] text-foreground">{liveLoading ? <div className="border-b border-border bg-secondary/30 px-4 py-3 text-xs text-muted-foreground">Loading live reconciliations…</div> : liveError ? <div className="border-b border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">{liveError}</div> : liveEmpty ? <div className="border-b border-dashed border-border bg-card px-4 py-3 text-xs text-muted-foreground">No live reconciliation records are available yet. Connect your finance accounts or run a reconciliation to begin.</div> : null}
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-[244px] flex-col bg-[var(--sidebar)] text-foreground lg:flex"><div className="flex h-16 items-center gap-3 border-b border-border px-6"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={17} /></div><strong className="text-lg tracking-tight text-foreground">LULU <span className="font-normal text-foreground">AI</span></strong></div><div className="px-4 py-5"><div className="mb-3 flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground"><span>Workspace</span><Plus size={13} /></div><LuluSectionNavigation activeId="sparklingly-city-3338" /></div><div className="mt-auto border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-foreground"><Settings2 size={15} /><span>Workspace settings</span></button><div className="mt-3 flex items-center gap-3 rounded-lg bg-secondary p-3"><div className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">AM</div><div><p className="text-xs font-semibold text-foreground">Workspace administrator</p><p className="text-[10px] text-muted-foreground">Admin</p></div><MoreHorizontal size={15} className="ml-auto" /></div></div></aside>
    <main className="lg:ml-[244px]"><header className="flex h-16 items-center justify-between border-b border-border bg-card px-5 lg:px-8"><div className="flex items-center gap-3"><PanelLeft size={18} className="text-muted-foreground lg:hidden" /><span className="text-xs text-muted-foreground">Business /</span><span className="text-xs font-semibold text-muted-foreground">Finance</span></div><div className="flex items-center gap-3"><div className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 md:flex"><Search size={14} className="text-muted-foreground" /><input placeholder="Search finance..." className="w-40 bg-transparent text-xs outline-none" /></div><Activity size={17} className="text-muted-foreground" /><div className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-[10px] font-bold text-muted-foreground">AM</div></div></header>
      <div className="mx-auto max-w-[1440px] px-5 py-7 lg:px-8"><div className="mb-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-3 text-xs font-medium text-muted-foreground">Finance <span className="mx-1">/</span> Reconciliation</p><h1 className="text-3xl font-bold tracking-[-.04em] text-foreground">Reconciliation</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Match your financial records with connected accounts and identify transactions or balances that need review.</p></div><div className="flex flex-wrap gap-2"><button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary"><Zap size={15} /><span>Start Reconciliation</span></button><button onClick={startSync} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-xs font-semibold text-foreground hover:border-border">{syncing ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}<span>{syncing ? 'Synchronizing financial records...' : 'Sync Data'}</span></button><button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-xs font-semibold text-foreground"><Bot size={14} /><span>Ask Lulu AI</span></button><button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-xs font-semibold text-foreground"><Download size={14} /><span>Export</span></button><button className="rounded-lg border border-border bg-card p-2.5 text-foreground"><MoreHorizontal size={16} /></button></div></div>
        <section className="mb-6 rounded-xl border border-border bg-card p-4"><div className="grid gap-3 xl:grid-cols-[1.4fr_repeat(5,1fr)]"><button className="rounded-lg border border-border px-3 py-2 text-left"><span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Reconciliation account</span><strong className="mt-1 block text-xs">Main Business Account <ChevronDown className="float-right inline text-muted-foreground" size={14} /></strong><span className="text-[10px] text-muted-foreground">IBAN Bank · EUR · €842,340 · Synced 2m ago</span></button>{[['Period', 'Current Month'], ['Status', 'All statuses'], ['Source', 'All sources'], ['Amount range', 'Any amount']].map(([label, value]) => <button key={label} className="rounded-lg border border-border px-3 py-2 text-left text-xs font-semibold text-foreground"><span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</span><span className="mt-2 block">{value}<ChevronDown className="float-right text-muted-foreground" size={14} /></span></button>)}<div className="rounded-lg border border-border px-3 py-2"><span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Search</span><div className="mt-2 flex items-center gap-2"><Search size={14} className="text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search reconciliation records..." className="min-w-0 flex-1 text-xs outline-none" /></div></div></div><div className="mt-3 flex items-center justify-end gap-3 text-xs"><button className="font-semibold text-foreground">Clear Filters</button><button onClick={() => setSaved(true)} className="font-bold text-foreground">{saved ? 'Filter Saved' : 'Save Filter'}</button></div></section>
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">{kpis.map(([label, value, delta, tone]) => <article key={label} className="rounded-xl border border-border bg-card p-3.5"><div className="flex items-start justify-between gap-2"><p className="text-[11px] font-semibold leading-4 text-muted-foreground">{label}</p><CircleHelp size={13} className="shrink-0 text-foreground" /></div><p className="mt-4 text-[20px] font-bold tracking-[-.04em] text-foreground">{value}</p><p className={`mt-1 text-[10px] font-bold ${tone === 'green' ? 'text-chart-4' : tone === 'red' ? 'text-chart-5' : tone === 'violet' ? 'text-foreground' : 'text-muted-foreground'}`}>{delta}</p>{label === 'Reconciliation Progress' && <div className="mt-3 h-1 overflow-hidden rounded-full bg-secondary"><div className="h-full w-[82%] bg-primary text-primary-foreground" /></div>}</article>)}</div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-secondary/70 px-4 py-3"><div className="flex items-center gap-3"><Badge tone="violet">In Progress</Badge><span className="text-xs text-muted-foreground">Started today at 08:42 · Last updated 2 minutes ago</span></div><button className="text-xs font-bold text-foreground">Continue reconciliation →</button></div>
        <Section title="Reconciliation Workspace" subtitle="Review and confirm suggested matches between your internal and connected account records." action={<div className="flex gap-2"><button className="rounded-lg border border-border px-3 py-2 text-[11px] font-bold text-foreground"><Filter size={13} className="mr-1 inline" />Bulk actions</button><button className="rounded-lg bg-primary px-3 py-2 text-[11px] font-bold text-primary-foreground">Confirm selected</button></div>}><div className="grid gap-4 xl:grid-cols-[1fr_120px_1fr]"><div className="min-w-0 rounded-lg border border-border"><div className="flex items-center justify-between border-b border-border bg-card px-3 py-3"><h3 className="text-xs font-bold">Lulu AI Records <span className="ml-1 text-muted-foreground">5</span></h3><span className="text-[10px] text-muted-foreground">Internal ledger</span></div>{leftRecords.map(([date, desc, amount, ref, source, status]) => <div key={ref} className={`border-l-2 p-3 ${status === 'Suggested Match' ? 'border-dashed border-border' : status === 'Matched' ? 'border-border' : status === 'Unmatched' ? 'border-border' : status === 'Partial' ? 'border-border' : 'border-chart-5'}`}><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-[11px] font-bold">{desc}</p><p className="mt-1 text-[10px] text-muted-foreground">{date} · {ref} · {source}</p></div><strong className={`shrink-0 text-[11px] ${amount.startsWith('+') ? 'text-foreground' : ''}`}>{amount}</strong></div><div className="mt-2"><Badge tone={toneForStatus(status)}>{status}</Badge></div></div>)}</div><div className="flex flex-col justify-center gap-3"><button className="rounded-lg bg-primary px-2 py-2.5 text-[10px] font-bold text-primary-foreground"><Check size={13} className="mx-auto mb-1" />Confirm Match</button><button className="rounded-lg border border-border bg-card px-2 py-2 text-[10px] font-bold text-muted-foreground"><X size={13} className="mx-auto mb-1" />Reject</button><button className="rounded-lg border border-border bg-card px-2 py-2 text-[10px] font-bold text-foreground"><Split size={13} className="mx-auto mb-1" />Split</button><span className="text-center text-[10px] text-muted-foreground">↔ Match controls</span></div><div className="min-w-0 rounded-lg border border-border"><div className="flex items-center justify-between border-b border-border bg-card px-3 py-3"><h3 className="text-xs font-bold">External Records <span className="ml-1 text-muted-foreground">5</span></h3><span className="text-[10px] text-muted-foreground">IBAN Bank · Stripe</span></div>{rightRecords.map(([date, desc, amount, ref, source, status]) => <div key={ref} className={`border-l-2 p-3 ${status === 'Suggested Match' ? 'border-dashed border-border' : status === 'Matched' ? 'border-border' : status === 'Unmatched' ? 'border-border' : status === 'Partial' ? 'border-border' : 'border-chart-5'}`}><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-[11px] font-bold">{desc}</p><p className="mt-1 text-[10px] text-muted-foreground">{date} · {ref} · {source}</p></div><strong className={`shrink-0 text-[11px] ${amount.startsWith('+') ? 'text-foreground' : ''}`}>{amount}</strong></div><div className="mt-2 flex items-center justify-between"><Badge tone={toneForStatus(status)}>{status}</Badge>{status === 'Suggested Match' && <span className="text-[10px] font-bold text-foreground">94% confidence</span>}</div></div>)}</div></div><div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground"><span>Showing 5 of 1,895 records · <strong className="text-foreground">Page 1 of 380</strong></span><div className="flex gap-2"><button className="rounded border px-2 py-1">Previous</button><button className="rounded border px-2 py-1">Next</button></div></div></Section>
        <div className="mt-6 grid gap-6 xl:grid-cols-2"><Section title="Automatic Matching" subtitle="Lulu AI identifies potential matches — all matches require your confirmation." action={<Badge tone="violet">3 suggested matches</Badge>}><div className="space-y-3">{suggestions.map(([a, aa, b, bb, confidence, evidence]) => <div key={a} className="rounded-lg border border-border bg-secondary/30 p-3"><div className="flex flex-wrap items-center gap-2 text-xs"><strong>{a}</strong><span className="text-muted-foreground">↔</span><strong>{b}</strong><Badge tone={confidence === 'High' ? 'green' : 'amber'}>{confidence} confidence</Badge></div><div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground"><span>{aa} ↔ {bb}</span><span className="rounded bg-card px-2 py-1">Amount ✓</span><span className="rounded bg-card px-2 py-1">Date ✓</span><span className="rounded bg-card px-2 py-1">Reference ~</span><span>{evidence}</span></div><div className="mt-3 flex gap-2"><button className="rounded bg-primary px-2.5 py-1.5 text-[10px] font-bold text-primary-foreground">Confirm Match</button><button className="rounded border bg-card px-2.5 py-1.5 text-[10px] font-bold">Reject</button><button className="rounded border bg-card px-2.5 py-1.5 text-[10px] font-bold text-foreground">Review</button></div></div>)}</div></Section><Section title="Balance Reconciliation" subtitle="Current Month · Main Business Account"><div className="grid grid-cols-3 border-b border-border pb-2 text-[11px] font-bold text-muted-foreground"><span>Formula</span><span className="text-right">Lulu AI</span><span className="text-right">External</span></div>{[['Opening Balance', '€980,200', '€980,200'], ['+ Inflows', '€2,409,120', '€2,409,120'], ['− Outflows', '€2,184,760', '€2,184,760'], ['± Adjustments', '€0', '€0'], ['= Expected Closing Balance', '€1,204,560', '€1,204,560'], ['External Closing Balance', '—', '€1,204,560']].map(([label, left, right]) => <div key={label} className="grid grid-cols-3 border-b border-border py-2.5 text-xs"><span className={label.startsWith('=') ? 'font-bold' : ''}>{label}</span><strong className="text-right">{left}</strong><strong className="text-right">{right}</strong></div>)}<div className="mt-3 flex items-center justify-between rounded-lg bg-secondary p-3 text-xs"><strong>Difference · €0.00</strong><Badge tone="green">Balanced</Badge></div></Section></div>
        <div className="mt-6"><Section title="Unmatched Records" subtitle="Records without a confirmed external counterpart." action={<button onClick={() => setShowUnmatched(!showUnmatched)} className="text-foreground"><ChevronDown size={17} className={showUnmatched ? '' : '-rotate-90'} /></button>}>{showUnmatched && <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="text-[10px] uppercase tracking-wide text-muted-foreground"><tr><th className="pb-3">Date</th><th>Description</th><th>Amount</th><th>Source</th><th>Possible Reason</th><th className="text-right">Actions</th></tr></thead><tbody className="divide-y divide-border">{unmatched.map(([date, desc, amount, source, reason]) => <tr key={desc}><td className="py-3 text-muted-foreground">{date}</td><td className="py-3 font-semibold">{desc}</td><td className="py-3 font-bold text-foreground">{amount}</td><td className="py-3 text-muted-foreground">{source}</td><td className="py-3"><Badge tone="amber">{reason}</Badge></td><td className="py-3 text-right"><button className="font-bold text-foreground">Find Match</button><button className="ml-3 font-bold text-muted-foreground">Investigate</button></td></tr>)}</tbody></table></div>}</Section></div>
        <div className="mt-6 grid gap-6 xl:grid-cols-2"><Section title="Partial Matches" action={<button className="text-foreground" aria-label="Expand partial matches"><ChevronDown size={17} /></button>}><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="text-[10px] uppercase tracking-wide text-muted-foreground"><tr><th className="pb-3">Record</th><th>Internal</th><th>External</th><th>Difference</th><th>Related</th><th /></tr></thead><tbody><tr><td className="py-3 font-semibold">Payroll · March</td><td>€42,800</td><td>€40,000</td><td className="font-bold text-foreground">€2,800</td><td>2 records</td><td className="text-right font-bold text-foreground">Complete Match</td></tr></tbody></table></div></Section><Section title="Reconciliation Discrepancies" subtitle="Exceptions requiring investigation." action={<Badge tone="red">3 issues</Badge>}><div className="space-y-2">{[['Amount Mismatch', 'Google Ads', '€40', 'High'], ['Date Mismatch', 'Vendor payment', '€0', 'Medium'], ['Unexpected Fee', 'Stripe payout', '€18', 'Low']].map(([issue, record, difference, severity]) => <div key={record} className="flex flex-wrap items-center gap-3 rounded-lg border border-chart-5/30 bg-chart-5/40 p-3 text-xs"><AlertTriangle size={15} className="text-chart-5" /><strong className="min-w-[120px]">{record}</strong><Badge tone="red">{issue}</Badge><span className="text-muted-foreground">Difference {difference}</span><Badge tone={severity === 'High' ? 'red' : severity === 'Medium' ? 'amber' : 'blue'}>{severity}</Badge><button className="ml-auto font-bold text-foreground">Investigate</button></div>)}</div></Section></div>
        <Section title="Reconciliation Summary" subtitle="All values are traceable to the selected account and period." action={<Badge tone="slate">EUR · Current Month</Badge>}><div className="grid gap-3 text-xs sm:grid-cols-5"><div><span className="text-muted-foreground">Opening Balance</span><strong className="mt-1 block">€980,200</strong></div><div><span className="text-muted-foreground">+ Recorded Inflows</span><strong className="mt-1 block text-foreground">€2,409,120</strong></div><div><span className="text-muted-foreground">− Recorded Outflows</span><strong className="mt-1 block">€2,184,760</strong></div><div><span className="text-muted-foreground">= Expected Closing</span><strong className="mt-1 block">€1,204,560</strong></div><div><span className="text-muted-foreground">vs External · Difference</span><strong className="mt-1 block text-foreground">€1,204,560 · €0</strong></div></div></Section>
        <div className="mt-6"><Section title="Matching Rules" subtitle="Rules run in priority order against new and synchronized records." action={<div className="flex gap-3"><button className="text-xs font-bold text-foreground"><Plus size={13} className="mr-1 inline" />Add Rule</button><button onClick={() => setShowRules(!showRules)} className="text-foreground"><Settings2 size={17} /></button></div>}>{showRules && <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="text-[10px] uppercase tracking-wide text-muted-foreground"><tr><th className="pb-3">Rule Name</th><th>Conditions</th><th>Priority</th><th>Status</th><th>Last Updated</th><th /></tr></thead><tbody className="divide-y divide-border">{rules.map(([name, condition, priority, status, updated]) => <tr key={name}><td className="py-3 font-semibold">{name}</td><td className="text-muted-foreground">{condition}</td><td>{priority}</td><td><Badge tone={status === 'Active' ? 'green' : 'slate'}>{status}</Badge></td><td className="text-muted-foreground">{updated}</td><td className="text-right font-bold text-foreground">Edit</td></tr>)}</tbody></table></div>}</Section></div>
        <div className="mt-6"><Section title="Reconciliation History" subtitle="Most recent activity first." action={<button onClick={() => setShowHistory(!showHistory)} className="text-foreground"><ChevronDown size={17} className={showHistory ? '' : '-rotate-90'} /></button>}>{showHistory && <div className="divide-y divide-border">{history.map(([action, date, user, affected, state]) => <div key={action} className="flex items-center gap-3 py-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-foreground"><Clock3 size={14} /></div><div className="min-w-0 flex-1"><p className="text-xs font-bold">{action} <span className="font-normal text-muted-foreground">· {affected}</span></p><p className="text-[11px] text-muted-foreground">{user} · {state}</p></div><time className="text-[11px] text-muted-foreground">{date}</time></div>)}</div>}</Section></div>
        <div className="mt-6 grid gap-6 xl:grid-cols-2"><Section title="AI Insights" subtitle="AI-generated · Evidence-backed"><div className="rounded-lg border border-border bg-secondary/50 p-4"><Badge tone="violet">AI Insight</Badge><p className="mt-3 text-sm font-semibold leading-6 text-foreground">Most records have been matched successfully. 4 transactions remain unmatched, including one large payment that may correspond to multiple internal records.</p><div className="mt-3 flex flex-wrap gap-2"><span className="rounded bg-card px-2 py-1 text-[10px] text-foreground">Matched Records</span><span className="rounded bg-card px-2 py-1 text-[10px] text-foreground">Unmatched Records</span><span className="rounded bg-card px-2 py-1 text-[10px] text-foreground">Amounts</span><span className="rounded bg-card px-2 py-1 text-[10px] text-foreground">Related Records</span></div></div><p className="mt-3 text-[10px] italic text-muted-foreground">AI-generated · Suggestions are not confirmed matches.</p></Section><Section title="AI Recommendations" subtitle="AI-generated · Lulu never finalizes matches without authorization."><ul className="space-y-2">{['Review high-value unmatched transactions', 'Investigate balance differences', 'Review partial matches', 'Check for duplicate records', 'Resolve missing references'].map(item => <li key={item} className="flex items-center gap-3 rounded-lg border border-border p-2.5 text-xs"><span className="grid h-5 w-5 place-items-center rounded-full bg-secondary text-[10px] font-bold text-foreground">✓</span><span className="flex-1 font-semibold">{item}</span><button className="text-[11px] font-bold text-foreground">Review</button></li>)}</ul></Section></div>
        <section className="mt-6 rounded-xl border border-border bg-gradient-to-br from-secondary via-white to-secondary p-6"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Bot size={18} /></div><div><h2 className="text-base font-bold">Ask Lulu AI</h2><p className="text-xs text-muted-foreground">Explore this reconciliation with evidence-backed assistance.</p></div></div><div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-card p-2"><textarea rows={1} placeholder="Ask Lulu AI about your reconciliation..." className="min-w-0 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none" aria-label="Ask Lulu AI about your reconciliation" /><button className="rounded-lg bg-primary p-2.5 text-primary-foreground hover:bg-primary" aria-label="Send question"><Send size={16} /></button></div><div className="mt-4 flex gap-2 overflow-x-auto pb-1">{['Which transactions are unmatched?', 'Why is this transaction unmatched?', 'Find likely matches for this transaction.', 'What discrepancies need attention?', 'Why doesn’t the account balance match?', 'Are there duplicate transactions?', 'Summarize this reconciliation period.'].map(prompt => <button key={prompt} className="shrink-0 rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary">{prompt}</button>)}</div><p className="mt-4 text-[10px] italic text-muted-foreground">AI-generated responses are informational and require your authorization before any action.</p></section>
        {saved && <div className="sticky bottom-4 mt-6 flex items-center justify-between rounded-xl border border-border bg-secondary px-4 py-3 text-xs shadow-lg"><strong>You have unsaved changes</strong><div className="flex gap-2"><button onClick={() => setSaved(false)} className="rounded-lg border border-border bg-card px-3 py-2 font-bold">Discard</button><button onClick={() => setSaved(false)} className="rounded-lg bg-primary px-3 py-2 font-bold text-primary-foreground">Save</button></div></div>}
      </div></main></div>;
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
          <span data-lulu-section-soon={section.label !== "Website" ? "true" : undefined}>{section.label}</span>
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
