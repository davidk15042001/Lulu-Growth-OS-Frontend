import { useState } from 'react';
import type { ReactNode } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bot, ChevronDown, ChevronRight, Download, FileText, Landmark, MoreHorizontal, PanelLeft, RefreshCw, Search, Send, Settings2, Sparkles } from 'lucide-react';
type Tone = 'violet' | 'green' | 'amber' | 'red' | 'blue' | 'slate';
const navItems = ['Finance Overview', 'Invoices', 'Offers & Quotes', 'Payments', 'Expenses', 'Income', 'Transactions', 'Accounts', 'Cash Flow', 'Budgets', 'Financial Planning', 'Taxes', 'Payouts', 'Reconciliation', 'Financial Automation', 'Finance Settings'];
const kpis = [['Opening Cash', '€980,200', 'Start of period', 'Observed', 'green'], ['Money In', '€2,409,120', '+€428,400 vs prev month', 'Observed', 'green'], ['Money Out', '€2,184,760', '+€184,200 vs prev month', 'Observed', 'amber'], ['Net Cash Flow', '+€224,360', '+12.8% vs prev month', 'Calculated', 'violet'], ['Closing Cash', '€1,204,560', '4 accounts', 'Observed', 'green'], ['Cash Flow Growth', '+12.8%', 'vs previous month', 'Calculated', 'violet'], ['Forecasted Closing Cash', '€1,380,000', 'Next 30 days', 'Forecast', 'violet']] as const;
const inflows = [['Product Sales', '€842,400', '34.9%', '↑ 8.2%', '284'], ['Services', '€724,800', '30.1%', '↑ 14.3%', '156'], ['Subscriptions', '€482,600', '20.0%', '↑ 6.3%', '412'], ['Customer Payments', '€241,320', '10.0%', '↓ 3.1%', '89'], ['Other', '€118,000', '4.9%', '—', '34']];
const outflows = [['Payroll', '€624,000', '28.6%', '↑ 0.0%', '1'], ['Marketing', '€284,200', '13.0%', '↑ 22.4%', '48'], ['Suppliers', '€398,400', '18.2%', '↑ 4.8%', '134'], ['Software', '€142,800', '6.5%', '↑ 34.0%', '67'], ['Rent', '€84,000', '3.8%', '—', '1'], ['Utilities', '€42,360', '1.9%', '↓ 2.1%', '12'], ['Taxes', '€184,200', '8.4%', '—', '3'], ['Operations', '€294,600', '13.5%', '↑ 9.2%', '89'], ['Other', '€130,200', '5.9%', '—', '28']];
const periods = [['Jan', '€1,980,400', '€1,842,200', '+€138,200', '—'], ['Feb', '€2,024,800', '€1,924,400', '+€100,400', '−27.4%'], ['Mar', '€2,180,720', '€2,000,560', '+€180,160', '+79.4%'], ['Apr', '€2,284,400', '€2,084,200', '+€200,200', '+11.1%'], ['May', '€2,340,200', '€2,104,000', '+€236,200', '+18.0%'], ['Jun (cur)', '€2,409,120', '€2,184,760', '+€224,360', '−5.0%']];
const accounts = [['Main Business Account', '+€1,284,200', '−€984,400', '+€299,800', '€842,340'], ['Operations Account', '+€480,400', '−€624,200', '−€143,800', '€213,780'], ['Stripe', '+€564,520', '−€424,160', '+€140,360', '€124,640'], ['USD Account', '+€80,000', '−€152,000', '−€72,000', '€27,800']];
const movements = [['Jun 26', 'Stripe payout', 'Inflow', '+€24,640', 'Stripe', 'Expected'], ['Jun 28', 'Adobe Creative Cloud', 'Outflow', '−€249', 'Main Account', 'Scheduled'], ['Jun 30', 'Client payment · INV-2851', 'Inflow', '+€8,400', 'Main Account', 'Expected'], ['Jul 02', 'Office rent — July', 'Outflow', '−€14,000', 'Operations', 'Scheduled'], ['Jul 05', 'Stripe payout', 'Inflow', '+€18,200', 'Stripe', 'Expected'], ['Jul 10', 'Google Ads', 'Outflow', '−€4,200', 'Main Account', 'Expected']];
const prompts = ['How is our cash flow performing?', 'Why did cash flow change?', 'How much cash came in this month?', 'What are our largest cash outflows?', 'What is our forecasted cash position?', 'What upcoming payments could affect cash flow?', 'Which recurring expenses affect cash flow most?', 'Find unusual cash movements.', 'Compare cash flow with last month.', 'Create a cash flow report.'];
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
  return <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-bold ${styles[tone]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{children}</span>;
}
function Card({
  title,
  subtitle,
  badge,
  children,
  className = ''
}: {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return <section className={`rounded-xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] ${className}`}><header className="mb-5 flex items-start justify-between gap-3"><div><h2 className="text-[15px] font-bold tracking-tight text-foreground">{title}</h2>{subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}</div>{badge}</header>{children}</section>;
}
export function LuluCashFlow() {
  const [query, setQuery] = useState('');
  const [view, setView] = useState('Monthly');
  const [horizon, setHorizon] = useState('30d');
  const table = (rows: string[][], headers: string[], money = false) => <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-[11px]"><thead className="border-b border-border text-[10px] uppercase tracking-wide text-muted-foreground"><tr>{headers.map(h => <th key={h} className="pb-2 pr-3 font-bold">{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{rows.map(r => <tr key={r[0]}>{r.map((v, i) => <td key={`${r[0]}-${i}`} className={`py-2 pr-3 ${i === 0 ? 'font-semibold text-foreground' : ''} ${money && i > 0 && i < 4 ? 'font-semibold text-foreground' : ''} ${v.startsWith('+') || v.startsWith('↑') ? 'text-foreground' : ''} ${v.startsWith('−') || v.startsWith('↓') ? 'text-foreground' : ''}`}>{v}</td>)}</tr>)}</tbody></table></div>;
  return <div className="min-h-screen bg-[var(--background)] text-foreground"><aside className="fixed inset-y-0 left-0 hidden w-[244px] flex-col bg-[var(--sidebar)] text-foreground lg:flex"><div className="flex h-16 items-center gap-3 border-b border-border px-6"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={17} /></div><strong className="text-lg tracking-tight text-foreground">LULU <span className="font-normal text-foreground">AI</span></strong></div><div className="px-4 py-5"><div className="mb-3 flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground"><span>Workspace</span><span>Finance</span></div><LuluSectionNavigation activeId="soft-town-3284" /></div><div className="mt-auto border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-foreground"><Settings2 size={15} /><span>Workspace settings</span></button><div className="mt-3 flex items-center gap-3 rounded-lg bg-secondary p-3"><div className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">AM</div><div><p className="text-xs font-semibold text-foreground">Alex Morgan</p><p className="text-[10px] text-muted-foreground">Admin</p></div><MoreHorizontal size={15} className="ml-auto" /></div></div></aside>
 <main className="lg:ml-[244px]"><div className="flex h-16 items-center justify-between border-b border-border bg-card px-5 lg:px-8"><div className="flex items-center gap-3"><PanelLeft size={18} className="text-muted-foreground lg:hidden" /><span className="text-xs text-muted-foreground">Finance /</span><span className="text-xs font-semibold text-foreground">Cash Flow</span></div><div className="flex items-center gap-3"><div className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 md:flex"><Search size={14} className="text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search finance..." className="w-40 bg-transparent text-xs outline-none placeholder:text-muted-foreground" /></div><button aria-label="Notifications" className="rounded-lg p-2 text-foreground"><Activity size={17} /></button><div className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-[10px] font-bold text-muted-foreground">AM</div></div></div>
 <div className="mx-auto max-w-[1440px] px-5 py-7 lg:px-8"><div className="mb-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-3 text-xs font-medium text-muted-foreground">Finance <span className="mx-1">/</span> Cash Flow</p><h1 className="text-3xl font-bold tracking-tight text-foreground">Cash Flow</h1><p className="mt-2 text-sm text-muted-foreground">Understand where your cash comes from, where it goes and how your cash position is changing.</p></div><div className="flex flex-wrap gap-2"><button className="btn-primary inline-flex items-center gap-2"><FileText size={15} /><span>Create Cash Flow Report</span></button><button className="btn-secondary inline-flex items-center gap-2"><Bot size={15} /><span>Ask Lulu AI</span></button><button className="btn-secondary inline-flex items-center gap-2"><Download size={15} /><span>Export</span></button><button className="btn-secondary p-2.5" aria-label="More"><MoreHorizontal size={16} /></button></div></div>
 <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"><span className="text-xs font-semibold text-muted-foreground">Reporting period</span>{[['Reporting Currency', 'EUR'], ['Date Range', 'Last 30 Days'], ['Compare With', 'Previous Month'], ['Forecast Horizon', '30 Days']].map(([a, b]) => <button key={a} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-bold text-foreground"><span>{a}</span><span className="text-foreground">{b}</span><ChevronDown size={13} className="text-muted-foreground" /></button>)}</div>
 <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{kpis.map(([name, value, detail, label, tone]) => <article key={name} className="rounded-xl border border-border bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"><div className="flex items-start justify-between gap-2"><p className="text-xs font-semibold text-muted-foreground">{name}</p><Badge tone={tone}>{label}</Badge></div><p className="mt-4 text-[22px] font-bold tracking-tight text-foreground">{value}</p><p className={`mt-1 flex items-center gap-1 text-xs font-bold ${detail.startsWith('+') ? 'text-foreground' : detail.includes('Next') ? 'text-foreground' : 'text-muted-foreground'}`}>{detail.startsWith('+') && <ArrowUpRight size={13} />}<span>{detail}</span></p><p className="mt-3 text-[11px] text-muted-foreground">{label === 'Forecast' ? 'Illustrative forecast' : 'Connected account data'}</p></article>)}</div>
 <Card title="Cash Flow" subtitle="Monthly view · EUR · last 30 days compared with previous month"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex gap-1 rounded-lg bg-secondary p-1">{['Daily', 'Weekly', 'Monthly'].map(x => <button key={x} onClick={() => setView(x)} className={`rounded-md px-3 py-1.5 text-xs font-bold ${view === x ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}>{x}</button>)}</div><div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground"><span><i className="mr-1 inline-block w-5 border-t border-dashed border-border" />Opening Cash</span><span className="text-foreground">● Money In</span><span className="text-foreground">● Money Out</span><span className="text-foreground">━ Net Cash Flow</span><span className="text-foreground">┄ Forecast</span></div></div><div className="rounded-lg bg-card/70 p-3"><svg viewBox="0 0 900 290" className="h-[280px] w-full" role="img" aria-label="Cash flow chart"><g stroke="var(--border)" strokeDasharray="3 5"><path d="M55 35H875M55 85H875M55 135H875M55 185H875M55 235H875" /></g><path d="M55 170 C120 150 150 165 200 132 S280 150 330 110 S410 135 465 96 S545 118 600 80 S680 102 740 65 S820 80 875 48 L875 235 L55 235Z" fill="var(--chart-4)" opacity=".12" /><path d="M55 205 C125 188 160 200 210 168 S285 190 340 150 S420 174 475 144 S555 158 610 126 S690 143 750 115 S820 125 875 100 L875 235 L55 235Z" fill="var(--chart-1)" opacity=".12" /><path d="M55 185 C120 180 155 173 205 154 S285 166 340 137 S420 153 470 119 S550 132 610 102 S685 115 745 88 S820 96 875 70" fill="none" stroke="var(--chart-2)" strokeWidth="3" /><path d="M55 195 C150 187 230 192 310 178 S470 184 550 165 S720 174 875 154" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeDasharray="7 6" /><path d="M670 25V245" stroke="var(--chart-2)" strokeDasharray="5 5" /><g fill="var(--muted-foreground)" fontSize="10"><text x="55" y="265">Jan</text><text x="130" y="265">Feb</text><text x="205" y="265">Mar</text><text x="280" y="265">Apr</text><text x="355" y="265">May</text><text x="430" y="265">Jun</text><text x="505" y="265">Jul</text><text x="580" y="265">Aug</text><text x="655" y="265">Sep</text><text x="730" y="265">Oct</text><text x="805" y="265">Nov</text><text x="855" y="265">Dec</text><text x="58" y="18">Historical</text><text x="690" y="18" fill="var(--chart-2)">Forecast</text><text x="5" y="238">€0</text><text x="0" y="188">€500k</text><text x="5" y="138">€1M</text><text x="0" y="88">€1.5M</text><text x="5" y="38">€2M</text></g>{[185, 154, 137, 119, 102, 88].map((y, i) => <circle key={i} cx={55 + i * 100} cy={y} r="3.5" fill="var(--foreground)" />)}</svg></div><p className="mt-3 text-[11px] text-muted-foreground">Historical data based on connected financial accounts · Forecast uses recurring data and expected payments</p></Card>
 <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><Card title="Cash Inflows" subtitle="Money In by source · Last 30 days" badge={<Badge tone="green">Observed</Badge>}>{table(inflows, ['Source', 'Amount', '%', 'Growth', 'Count'])}<div className="mt-4 flex h-3 overflow-hidden rounded-full"><span className="w-[35%] bg-chart-4" /><span className="w-[30%] bg-chart-4" /><span className="w-[20%] bg-chart-4" /><span className="w-[10%] bg-chart-4/20" /><span className="w-[5%] bg-secondary" /></div><p className="mt-2 text-[11px] font-semibold text-muted-foreground">Cash Inflows by Source <strong className="float-right text-foreground">Total €2,409,120</strong></p></Card><Card title="Cash Outflows" subtitle="Money Out by category · Last 30 days" badge={<Badge tone="green">Observed</Badge>}>{table(outflows, ['Category', 'Amount', '%', 'Growth', 'Count'])}<div className="mt-4 flex h-3 overflow-hidden rounded-full"><span className="w-[29%] bg-primary text-primary-foreground" /><span className="w-[18%] bg-primary text-primary-foreground" /><span className="w-[13%] bg-primary text-primary-foreground" /><span className="w-[40%] bg-secondary" /></div><p className="mt-2 text-[11px] font-semibold text-muted-foreground">Cash Outflows by Category <strong className="float-right text-foreground">Total €2,184,760</strong></p></Card></div>
 <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><Card title="Net Cash Flow" subtitle="Period breakdown · Last 30 days"><div className="mb-3 flex w-fit gap-1 rounded-lg bg-secondary p-1">{['Daily', 'Weekly', 'Monthly'].map(x => <button key={x} onClick={() => setView(x)} className={`rounded-md px-3 py-1 text-[11px] font-bold ${view === x ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}>{x}</button>)}</div>{table(periods, ['Period', 'Money In', 'Money Out', 'Net Cash Flow', 'Change'], true)}</Card><Card title="Cash Flow by Account" subtitle="4 connected accounts · Last 30 days" badge={<Badge tone="green">Observed</Badge>}>{table(accounts, ['Account', 'Money In', 'Money Out', 'Net Movement', 'Closing Balance', 'Action'])}<p className="mt-3 text-[11px] text-muted-foreground">Values converted to EUR · Do not duplicate Accounts module</p></Card></div>
 <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><Card title="Cash Flow Forecast" subtitle="Next 30 days · Based on recurring data and expected payments" badge={<Badge tone="violet">Forecast</Badge>}><div className="mb-4 flex gap-1 rounded-lg bg-secondary p-1 w-fit">{['7d', '30d', '60d', '90d', '6M', '12M'].map(x => <button key={x} onClick={() => setHorizon(x)} className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${horizon === x ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}>{x}</button>)}</div><div className="space-y-2 text-xs">{[['Current Cash', '€1,204,560', 'Observed'], ['Expected Inflows', '+€842,000', 'Forecast'], ['Expected Outflows', '−€666,560', 'Forecast'], ['Forecasted Net', '+€175,440', 'Calculated'], ['Forecasted Closing', '€1,380,000', 'Forecast']].map(([a, b, c]) => <div key={a} className="flex justify-between border-b border-border pb-2"><span>{a}</span><strong className={c === 'Forecast' ? 'text-foreground' : b.startsWith('+') ? 'text-foreground' : ''}>{b} <span className="ml-2 text-[10px] font-normal text-muted-foreground">{c}</span></strong></div>)}</div><div className="mt-5"><div className="flex justify-between text-xs"><span>Forecast Confidence</span><Badge tone="green">HIGH</Badge></div><div className="mt-2 h-2 rounded-full bg-secondary"><div className="h-full w-[78%] rounded-full bg-chart-4" /></div><p className="mt-2 text-[11px] italic text-muted-foreground">Confidence based on 12 months of historical data and 3 connected accounts. Not a guarantee.</p></div><div className="mt-4 flex flex-wrap gap-1.5">{['Historical cash flow', 'Recurring income', 'Recurring expenses', 'Outstanding invoices', 'Scheduled payouts'].map(x => <Badge key={x}>{x}</Badge>)}</div></Card><Card title="Upcoming Cash Movements" subtitle="Expected in the next 30 days">{table(movements, ['Date', 'Description', 'Type', 'Amount', 'Account', 'Status'])}</Card></div>
 <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><Card title="Cash Flow Risks" subtitle="3 risks detected · AI-analyzed"><div className="space-y-3">{[['Expected Cash Decline', 'Detected Jun 20', 'HIGH', 'Outflows trending +14% over 3 weeks', 'Jul 1–31', 'red'], ['Large Upcoming Outflow', 'Detected Jun 22', 'MEDIUM', 'Scheduled €42,800 payroll on Jul 01', 'Jul 1', 'amber'], ['Declining Inflows', 'Detected Jun 21', 'LOW', 'Customer payment collections down 3.1% vs last month', 'Jun 2024', 'blue']].map(r => <div key={r[0]} className="rounded-lg border border-border p-3"><div className="flex items-start gap-2"><AlertTriangle size={16} className="mt-0.5 text-foreground" /><div className="flex-1"><p className="text-xs font-bold">{r[0]}</p><p className="mt-1 text-[11px] text-muted-foreground">{r[1]} · Evidence: {r[3]} · Affected: {r[4]}</p></div><Badge tone={r[5] as Tone}>{r[2]}</Badge></div><div className="mt-3 flex gap-2"><button className="btn-secondary">Investigate</button><button className="btn-secondary">Ask Lulu AI</button></div></div>)}</div><p className="mt-4 text-[11px] italic text-muted-foreground">AI-detected · Does not constitute regulated financial advice.</p></Card><Card title="Cash Flow Anomalies" subtitle="2 anomalies detected"><div className="space-y-3">{[['Unusual Inflow Spike', 'Jun 18', 'Unexpected €84,200 cash movement from Stripe'], ['Sudden Marketing Expense Increase', 'Jun 15', 'Marketing outflows +22.4% above baseline']].map(r => <div key={r[0]} className="rounded-lg border border-border p-3"><p className="text-xs font-bold">{r[0]} <span className="ml-2 font-normal text-muted-foreground">{r[1]}</span></p><p className="mt-1 text-[11px] text-muted-foreground">{r[2]}</p><div className="mt-3 flex flex-wrap gap-2"><button className="btn-secondary">Investigate</button><button className="btn-secondary">Open Transactions</button><button className="btn-secondary">Ask Lulu AI</button></div></div>)}</div></Card></div>
 <Card title="Cash Flow Breakdown" subtitle="How your cash position changed this period · Calculated" badge={<Badge tone="violet">Calculated</Badge>} className="mt-6"><div className="grid max-w-3xl gap-2 text-sm sm:grid-cols-2">{[['Opening Cash', '€980,200', 'text-foreground'], ['+ Customer Payments', '+€241,320', 'text-foreground'], ['+ Product Revenue', '+€842,400', 'text-foreground'], ['+ Services', '+€724,800', 'text-foreground'], ['+ Other Inflows', '+€600,600', 'text-foreground'], ['= Total Money In', '+€2,409,120', 'text-foreground font-bold'], ['− Operating Expenses', '−€294,600', 'text-foreground'], ['− Supplier Payments', '−€398,400', 'text-foreground'], ['− Payroll', '−€624,000', 'text-foreground'], ['− Taxes', '−€184,200', 'text-foreground'], ['− Other Outflows', '−€683,560', 'text-foreground'], ['= Total Money Out', '−€2,184,760', 'text-foreground font-bold'], ['= Net Cash Flow', '+€224,360', 'text-foreground font-bold'], ['= Closing Cash', '€1,204,560', 'text-foreground font-bold']].map(r => <div key={r[0]} className="flex justify-between border-b border-border pb-1"><span>{r[0]}</span><strong className={r[2]}>{r[1]}</strong></div>)}</div><p className="mt-4 text-[11px] text-muted-foreground">Every value traceable to connected financial accounts · Observed and Calculated data only.</p></Card>
 <Card title="Scenario Analysis" subtitle="Explore hypothetical changes to cash flow" badge={<Badge tone="amber">Scenario — Not Actual</Badge>} className="mt-6"><p className="mb-4 rounded-lg bg-secondary p-3 text-xs font-semibold text-foreground">AI Scenario Tool — Not Actual — Never modifies financial records</p><div className="grid gap-4 xl:grid-cols-2">{[['Scenario A: Revenue Decrease −10%', '€2,168,208', '€2,184,760', '−€16,552', '€963,648'], ['Scenario B: Expense Increase +15%', '€2,409,120', '€2,512,474', '−€103,354', '€876,846']].map(r => <div key={r[0]} className="rounded-lg border border-border p-4"><h3 className="text-sm font-bold">{r[0]}</h3><div className="mt-3 space-y-2 text-xs">{[['Money In', r[1]], ['Money Out', r[2]], ['Net Cash Flow', r[3]], ['Forecasted Closing', r[4]]].map(x => <div key={x[0]} className="flex justify-between"><span>{x[0]}</span><strong className={x[0] === 'Net Cash Flow' ? 'text-chart-5' : ''}>{x[1]}</strong></div>)}</div><Badge tone="red">Negative net cash flow</Badge></div>)}</div><button className="btn-secondary mt-4 inline-flex items-center gap-2"><RefreshCw size={14} /><span>Reset Scenario</span></button></Card>
 <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2"><Card title="AI Cash Flow Insights" subtitle="AI-generated · Evidence-backed" badge={<Badge tone="violet">AI Insight</Badge>}><div className="space-y-3">{['Net cash flow decreased 5.0% compared with the previous period. The largest recorded change came from increased operating outflows (+9.2% vs last month).', 'Marketing outflows increased 22.4% this period, making it the fastest-growing expense category.', 'Subscription income grew 6.3% while customer payment collections declined 3.1%, suggesting a shift in revenue mix.'].map(t => <div key={t} className="rounded-lg border border-border bg-secondary/60 p-3"><p className="text-xs font-semibold leading-5 text-foreground">{t}</p><p className="mt-2 text-[11px] text-foreground">Evidence · Current period +€224,360 · Money In +€2,409,120 · Money Out €2,184,760</p></div>)}</div><p className="mt-4 text-[11px] italic text-muted-foreground">AI-generated · Does not claim unsupported causes.</p></Card><Card title="AI Recommendations" subtitle="AI Recommendation" badge={<Badge tone="violet">AI Recommendation</Badge>}><div className="space-y-3">{['Review unusually high marketing outflows · +22.4% growth detected', 'Investigate declining customer payment collections · −3.1% vs previous month', 'Review upcoming large payroll outflow on Jul 01 · €42,800 expected', 'Review cash flow concentration in Product Sales · 34.9% of total inflows'].map((t, i) => <button key={t} className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">{i + 1}</span><span className="text-xs font-semibold">{t}</span><ChevronRight size={14} className="ml-auto text-muted-foreground" /></button>)}</div><p className="mt-4 text-[11px] italic text-muted-foreground">AI Recommendation · AI does not initiate transfers or financial commitments.</p></Card></div>
 <section className="mt-6 rounded-xl border border-border bg-gradient-to-br from-secondary via-white to-secondary p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)]"><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Bot size={17} /></div><div><h2 className="text-base font-bold">Ask Lulu AI</h2><p className="text-xs text-muted-foreground">Your cash flow intelligence, ready when you are.</p></div></div><div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-card p-2 shadow-sm"><input aria-label="Ask Lulu AI about your cash flow" placeholder="Ask Lulu AI about your cash flow..." className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground" /><button className="rounded-lg bg-primary p-2.5 text-primary-foreground" aria-label="Send question"><Send size={16} /></button></div><div className="mt-4 flex gap-2 overflow-x-auto pb-1">{prompts.map(prompt => <button key={prompt} className="shrink-0 rounded-full border border-border bg-card px-3 py-2 text-xs font-medium text-foreground">{prompt}</button>)}</div></section><div className="h-12" /></div></main><style>{`.btn-primary{border-radius:.5rem;background:var(--primary);padding:.65rem .85rem;font-size:.7rem;font-weight:700;color:white}.btn-primary:hover{background:var(--primary);color:var(--primary-foreground)}.btn-secondary{border-radius:.5rem;border:1px solid var(--border);background:white;padding:.55rem .7rem;font-size:.68rem;font-weight:700;color:var(--muted-foreground)}.btn-secondary:hover{border-color:var(--foreground);color:var(--foreground)}`}</style></div>;
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
