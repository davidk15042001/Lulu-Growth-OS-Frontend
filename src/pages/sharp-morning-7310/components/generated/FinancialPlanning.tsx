import { useState } from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, Bot, Check, ChevronDown, Download, FileDown, Menu, MoreHorizontal, PanelLeft, Plus, Send, Settings2, Sparkles, Target, TrendingUp, Wallet, X } from 'lucide-react';
type Tone = 'violet' | 'green' | 'amber' | 'red' | 'blue' | 'slate' | 'teal';
const navItems = ['Finance Overview', 'Invoices', 'Offers & Quotes', 'Payments', 'Expenses', 'Income', 'Transactions', 'Accounts', 'Cash Flow', 'Budgets', 'Financial Planning', 'Taxes', 'Payouts', 'Reconciliation', 'Financial Automation', 'Finance Settings'];
const kpis = [['Forecast Revenue', '1.8M', '+14%', 'AI Forecast', 'green'], ['Forecast Expenses', '1.2M', '+9%', 'AI Forecast', 'amber'], ['Forecast Net Cash Flow', '640K', '', 'AI Forecast', 'green'], ['Forecast Closing Cash', '890K', '', 'AI Forecast', 'blue'], ['Revenue Growth', '14.2%', '', 'Forecast', 'violet'], ['Expense Growth', '9.1%', '', 'Forecast', 'amber'], ['Financial Goal Progress', '68%', '', 'Forecast', 'violet']];
const plans = [['2027 Growth Plan', 'Jan–Dec 2027', '1.8M', '1.2M', '640K', 'Base Scenario', 'Active', 'green', '08 Aug 2026'], ['2026 Conservative Plan', 'Jan–Dec 2026', '1.4M', '1.1M', '320K', 'Conservative', 'Needs Review', 'amber', '02 Jul 2026'], ['2025 Historical Plan', 'Jan–Dec 2025', '1.1M', '940K', '180K', 'Base Scenario', 'Archived', 'slate', '15 Jan 2025']];
const goals = [['Annual Revenue Target', '2.0M', '1.1M', '1.8M', '68%', 'On Track', 'green', 'Dec 2027'], ['Cash Reserve', '500K', '280K', '420K', '56%', 'At Risk', 'amber', 'Dec 2027'], ['Expense Reduction', '100K', '38K', '62K', '38%', 'Behind', 'red', 'Dec 2027']];
const scenarios = [['Base Scenario', '1.8M', '1.2M', '640K', '890K', 'Active', 'violet'], ['Growth Scenario', '2.1M', '1.4M', '700K', '950K', 'AI Modeled', 'blue'], ['Conservative Scenario', '1.4M', '1.1M', '320K', '610K', 'AI Modeled', 'slate']];
const prompts = ['What does our financial outlook look like?', 'Are we on track to reach our revenue target?', 'Which assumptions have the largest impact?', 'Compare our base and growth scenarios.', 'What happens if revenue grows 20%?', 'Which financial goals are at risk?'];
const assumptions = [['Revenue Growth', '14%', 'p.a.', '2027 plan', 'AI Suggested', 'violet'], ['Expense Growth', '9%', 'p.a.', '2027 plan', 'User Defined', 'violet'], ['Customer Growth', '12%', 'p.a.', '2027 plan', 'Historical', 'blue'], ['Average Order Value', '€840', 'per order', '2027 plan', 'Imported', 'teal']];
function Badge({
  children,
  tone = 'slate'
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  const styles: Record<Tone, string> = {
    violet: 'bg-secondary text-foreground border-border',
    green: 'bg-secondary text-foreground border-border',
    amber: 'bg-secondary text-foreground border-border',
    red: 'bg-chart-5/10 text-chart-5 border-chart-5/30',
    blue: 'bg-secondary text-foreground border-border',
    teal: 'bg-secondary text-foreground border-border',
    slate: 'bg-card text-muted-foreground border-border'
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-bold ${styles[tone]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" /><span>{children}</span></span>;
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
  return <section className="rounded-xl border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,.03)]"><header className="mb-5 flex items-start justify-between gap-3"><div><h2 className="text-[15px] font-bold tracking-[-.02em] text-foreground">{title}</h2>{subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}</div>{action && <button className="text-xs font-bold text-foreground hover:text-foreground">{action}</button>}</header>{children}</section>;
}
function MiniChart({
  kind = 'line'
}: {
  kind?: 'line' | 'bars' | 'waterfall';
}) {
  if (kind === 'bars') return <svg viewBox="0 0 700 180" className="h-44 w-full" role="img" aria-label="Forecast bar chart"><g stroke="var(--border)" strokeDasharray="3 5"><path d="M30 30H680M30 75H680M30 120H680" /></g><g fill="var(--border)">{[40, 80, 55, 94, 66, 105, 72, 120, 90, 110, 98, 130].map((h, i) => <rect key={`bar-${i}`} x={45 + i * 50} y={155 - h} width="25" height={h} rx="3" />)}</g><path d="M45 118 C110 112 125 124 160 92 S230 104 265 80 S330 90 365 66 S430 76 465 54 S530 64 565 36 S625 48 680 20" fill="none" stroke="var(--chart-2)" strokeWidth="3" strokeDasharray="7 5" /><g fill="var(--border)" fontSize="10"><text x="42" y="174">Jan</text><text x="242" y="174">Apr</text><text x="442" y="174">Aug</text><text x="630" y="174">Dec</text></g></svg>;
  if (kind === 'waterfall') return <svg viewBox="0 0 700 180" className="h-44 w-full" role="img" aria-label="Cash forecast waterfall"><g stroke="var(--border)" strokeDasharray="3 5"><path d="M30 35H680M30 85H680M30 135H680" /></g>{[['var(--border)', 45, 65, 70], ['var(--chart-4)', 145, 42, 93], ['var(--chart-1)', 245, 62, 78], ['var(--chart-2)', 345, 92, 48], ['var(--chart-3)', 445, 45, 95]].map(([color, x, y, h]) => <rect key={String(x)} x={x} y={Number(y)} width="55" height={Number(h)} rx="4" fill={String(color)} opacity=".82" />)}<g fill="var(--muted-foreground)" fontSize="10"><text x="37" y="174">Opening</text><text x="140" y="174">Inflows</text><text x="237" y="174">Outflows</text><text x="345" y="174">Net cash</text><text x="445" y="174">Closing</text></g></svg>;
  return <svg viewBox="0 0 900 240" className="h-56 w-full" role="img" aria-label="Financial outlook multi-line area chart"><rect x="30" y="20" width="295" height="180" fill="var(--border)" /><g stroke="var(--border)" strokeDasharray="3 5"><path d="M30 35H870M30 90H870M30 145H870M30 200H870" /></g><path d="M30 160 C95 145 110 164 170 130 S250 145 315 112" fill="none" stroke="var(--muted-foreground)" strokeWidth="3" /><path d="M315 112 C390 96 430 120 490 80 S570 92 630 58 S730 70 870 28" fill="none" stroke="var(--chart-3)" strokeWidth="3" strokeDasharray="8 6" /><path d="M30 180 C100 168 135 178 190 153 S260 162 315 145 C390 135 440 150 500 120 S580 128 650 104 S760 116 870 82" fill="none" stroke="var(--chart-1)" strokeWidth="2.5" /><path d="M30 194 C90 184 120 191 180 176 S250 180 315 165 C390 152 445 168 510 144 S590 151 660 130 S770 140 870 112" fill="none" stroke="var(--chart-4)" strokeWidth="2.5" /><path d="M325 18V203" stroke="var(--chart-3)" strokeDasharray="5 5" /><g fill="var(--muted-foreground)" fontSize="10"><text x="50" y="225">Historical · 12 months</text><text x="355" y="225">Current</text><text x="690" y="225">Forecast · 12 months</text></g></svg>;
}
export function FinancialPlanning() {
  const [horizon, setHorizon] = useState('12 Months');
  const [tab, setTab] = useState('By Product');
  const [metric, setMetric] = useState('Revenue');
  const [assumption, setAssumption] = useState('Revenue Growth');
  const [slider, setSlider] = useState(14);
  const [question, setQuestion] = useState('');
  const [saved, setSaved] = useState(false);
  const [activePrompt, setActivePrompt] = useState('');
  const chartTabs = ['By Product', 'By Service', 'By Customer Segment', 'By Channel'];
  const selectClass = 'rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground outline-none hover:border-border';
  return <div className="min-h-screen bg-[var(--background)] font-sans text-foreground">
    <aside className="fixed inset-y-0 left-0 hidden w-[244px] flex-col bg-[var(--sidebar)] text-foreground lg:flex"><div className="flex h-16 items-center gap-3 border-b border-border px-6"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={17} /></div><strong className="text-lg tracking-tight text-foreground">LULU <span className="font-normal text-foreground">AI</span></strong></div><div className="px-4 py-5"><div className="mb-3 flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground"><span>Workspace</span><Plus size={13} /></div><LuluSectionNavigation activeId="sharp-morning-7310" /></div><div className="mt-auto border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-foreground hover:bg-secondary"><Settings2 size={15} /><span>Workspace settings</span></button><div className="mt-3 flex items-center gap-3 rounded-lg bg-secondary p-3"><div className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-xs font-bold text-foreground">AM</div><div><p className="text-xs font-semibold text-foreground">Alex Morgan</p><p className="text-[10px] text-muted-foreground">Admin</p></div><MoreHorizontal size={15} className="ml-auto" /></div></div></aside>
    <main className="lg:ml-[244px]"><header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-secondary px-5 backdrop-blur lg:px-8"><div className="flex items-center gap-3"><PanelLeft size={18} className="text-muted-foreground lg:hidden" /><span className="text-xs text-muted-foreground">Business /</span><span className="text-xs font-semibold text-foreground">Finance</span></div><div className="flex items-center gap-3"><button className="hidden rounded-lg border border-border px-3 py-2 text-xs text-foreground md:block">Search finance...</button><Activity size={17} className="text-muted-foreground" /><div className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-[10px] font-bold text-foreground">AM</div></div></header>
      <div className="mx-auto max-w-[1440px] px-5 py-7 lg:px-8"><div className="mb-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-3 text-xs font-medium text-muted-foreground">Finance <span className="mx-1">/</span> Financial Planning</p><h1 className="text-3xl font-bold tracking-[-.045em] text-foreground">Financial Planning</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Model your financial future, evaluate scenarios and understand how business decisions may affect performance.</p></div><div className="flex flex-wrap gap-2"><button className="btn-primary"><Plus size={15} /><span>Create Financial Plan</span></button><button className="btn-secondary"><Bot size={15} /><span>Ask Lulu AI</span></button><button className="btn-secondary"><Download size={14} /><span>Export</span></button><button className="btn-secondary px-2.5" aria-label="More actions"><MoreHorizontal size={16} /></button></div></div>
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3"><span className="mr-1 text-xs font-bold text-muted-foreground">Planning controls</span>{[['Planning Horizon', horizon], ['Currency', 'EUR'], ['Plan', '2027 Growth Plan'], ['Scenario', 'Base Scenario']].map(([label, value]) => <label key={label} className="relative"><span className="sr-only">{label}</span><select value={label === 'Planning Horizon' ? horizon : value} onChange={e => label === 'Planning Horizon' && setHorizon(e.target.value)} className={selectClass}><option>{label}: {value}</option>{label === 'Planning Horizon' && ['3 Months', '6 Months', '12 Months', '24 Months', '36 Months', 'Custom'].map(option => <option key={option}>{option}</option>)}</select><ChevronDown size={13} className="pointer-events-none absolute right-2 top-2.5 text-muted-foreground" /></label>)}<div className="ml-auto flex gap-2"><Badge tone="slate">Historical</Badge><Badge tone="blue">Current</Badge><Badge tone="violet">Forecast</Badge><Badge tone="amber">Scenario</Badge></div></div>
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-7">{kpis.map(([name, value, change, label, tone]) => <article key={name} className="rounded-xl border border-border bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,.03)]"><div className="flex items-start justify-between gap-2"><p className="text-xs font-semibold text-muted-foreground">{name}</p><Badge tone={tone as Tone}>{label}</Badge></div><p className="mt-4 text-[22px] font-bold tracking-[-.04em] text-foreground">{value}</p>{change && <p className="mt-1 flex items-center gap-1 text-xs font-bold text-foreground"><ArrowUpRight size={13} /><span>{change}</span></p>}{name === 'Financial Goal Progress' && <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary"><span className="block h-full w-[68%] rounded-full bg-primary text-primary-foreground" /></div>}</article>)}</div>
        <Card title="Financial Outlook" subtitle="Monthly view · 12 months historical, current period and 12 months forecast"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex gap-1 rounded-lg bg-secondary p-1">{['Monthly', 'Quarterly', 'Annual'].map(x => <button key={x} className={`rounded-md px-3 py-1.5 text-xs font-bold ${x === 'Monthly' ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}><span>{x}</span></button>)}</div><div className="flex flex-wrap gap-3">{['Revenue', 'Expenses', 'Cash', 'Growth'].map(x => <button key={x} onClick={() => setMetric(x)} className={`flex items-center gap-1.5 text-xs font-bold ${metric === x ? 'text-foreground' : 'text-foreground'}`}><i className={`h-2 w-2 rounded-full ${x === 'Revenue' ? 'bg-primary' : x === 'Expenses' ? 'bg-primary' : x === 'Cash' ? 'bg-primary' : 'bg-primary'}`} /><span>{x}</span></button>)}</div></div><div className="rounded-lg bg-card/70 p-2"><MiniChart /></div></Card>
        <div className="mt-6"><Card title="Financial Plans" subtitle="Illustrative demo plans · never actual financial records"><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-xs"><thead className="border-b border-border text-[10px] uppercase tracking-wide text-muted-foreground"><tr>{['Plan', 'Planning Horizon', 'Forecast Revenue', 'Forecast Expenses', 'Forecast Cash', 'Scenario', 'Status', 'Last Updated', 'Owner', ''].map(x => <th key={x} className="pb-3 pr-4 font-bold">{x}</th>)}</tr></thead><tbody className="divide-y divide-border">{plans.map(row => <tr key={row[0]} className="hover:bg-card"><td className="py-3 pr-4 font-bold text-foreground">{row[0]}</td><td className="py-3 pr-4 text-muted-foreground">{row[1]}</td><td className="py-3 pr-4 font-semibold">{row[2]}</td><td className="py-3 pr-4">{row[3]}</td><td className="py-3 pr-4 font-semibold text-foreground">{row[4]}</td><td className="py-3 pr-4"><Badge tone="violet">{row[5]}</Badge></td><td className="py-3 pr-4"><Badge tone={row[7] as Tone}>{row[6]}</Badge></td><td className="py-3 pr-4 text-muted-foreground">{row[8]}</td><td className="py-3 pr-4">Finance</td><td><button aria-label={`Actions for ${row[0]}`}><MoreHorizontal size={16} className="text-muted-foreground" /></button></td></tr>)}</tbody></table></div></Card></div>
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2"><Card title="Revenue Forecast" subtitle="Historical bars · forecast line"><div className="mb-4 flex flex-wrap gap-1 rounded-lg bg-secondary p-1">{chartTabs.map(x => <button key={x} onClick={() => setTab(x)} className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold ${tab === x ? 'bg-card text-foreground shadow-sm' : 'text-foreground'}`}><span>{x}</span></button>)}</div><MiniChart kind="bars" /><table className="mt-3 w-full text-xs"><thead className="text-left text-muted-foreground"><tr><th>Period</th><th>Historical</th><th>Forecast</th><th>Growth Rate</th></tr></thead><tbody><tr><td className="pt-2 font-semibold">Q1 2027</td><td className="pt-2">420K</td><td className="pt-2 font-bold text-foreground">480K</td><td className="pt-2 text-chart-4">+14.3%</td></tr></tbody></table></Card><Card title="Expense Forecast" subtitle="Modeled operating expenses by category"><div className="mb-4 flex gap-1 rounded-lg bg-secondary p-1"><button className="tab-active">By Category</button><button className="tab">By Department</button><button className="tab">By Vendor</button></div><div className="space-y-3 text-xs">{[['Operations', '32%', 'violet'], ['Marketing', '21%', 'blue'], ['Salaries', '25%', 'amber'], ['Technology', '14%', 'teal'], ['Other', '8%', 'slate']].map(([name, percent, tone]) => <div key={name} className="flex items-center gap-3"><span className="w-24 text-muted-foreground">{name}</span><div className="h-2 flex-1 rounded-full bg-secondary"><div className={`h-full rounded-full ${tone === 'violet' ? 'bg-primary' : tone === 'blue' ? 'bg-primary' : tone === 'amber' ? 'bg-chart-1' : tone === 'teal' ? 'bg-primary' : 'bg-muted'}`} style={{
                    width: percent
                  }} /></div><strong className="w-9 text-right">{percent}</strong></div>)}</div><p className="mt-5 text-[11px] text-muted-foreground">Forecast expenses: <strong className="text-foreground">1.2M</strong> <Badge tone="amber">Forecast</Badge></p></Card></div>
        <div className="mt-6"><Card title="Cash Forecast" subtitle="Waterfall from opening cash to modeled closing cash"><MiniChart kind="waterfall" /><div className="mt-3 flex flex-wrap gap-3"><button className="btn-secondary"><Wallet size={14} /><span>Open Cash Flow</span></button><button className="btn-secondary"><FileDown size={14} /><span>Open Accounts</span></button><Badge tone="blue">Forecast values</Badge></div></Card></div>
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2"><Card title="Financial Goals" subtitle="Calculated status vs AI Assessment"><div className="space-y-4">{goals.map(goal => <div key={goal[0]} className="rounded-lg border border-border p-4"><div className="flex items-center justify-between"><strong className="text-xs">{goal[0]}</strong><Badge tone={goal[6] as Tone}>{goal[5]}</Badge></div><div className="mt-3 h-2 rounded-full bg-secondary"><div className={`h-full rounded-full ${goal[6] === 'green' ? 'bg-chart-4' : goal[6] === 'amber' ? 'bg-chart-1' : 'bg-destructive'}`} style={{
                    width: goal[4]
                  }} /></div><div className="mt-3 grid grid-cols-3 gap-2 text-[11px]"><span>Target <b className="block text-foreground">{goal[1]}</b></span><span>Current <b className="block text-foreground">{goal[2]}</b></span><span>Forecast <b className="block text-foreground">{goal[3]}</b></span></div><p className="mt-2 text-[10px] text-muted-foreground">{goal[7]} · <span className="text-foreground">AI Assessment</span></p></div>)}</div><button className="btn-primary mt-4"><Plus size={14} /><span>Add Goal</span></button></Card><Card title="Scenario Planning" subtitle="Scenario values are hypothetical, not actual"><div className="space-y-3">{scenarios.map(scenario => <div key={scenario[0]} className="rounded-lg border border-border p-4"><div className="flex items-center justify-between"><strong className="text-sm">{scenario[0]}</strong><Badge tone={scenario[6] as Tone}>{scenario[5]}</Badge></div><div className="mt-3 grid grid-cols-4 gap-2 text-[11px]"><span>Revenue <b className="block">{scenario[1]}</b></span><span>Expenses <b className="block">{scenario[2]}</b></span><span>Net Cash <b className="block text-foreground">{scenario[3]}</b></span><span>Cash <b className="block">{scenario[4]}</b></span></div></div>)}</div><button className="btn-secondary mt-4"><Plus size={14} /><span>Create Custom Scenario</span></button></Card></div>
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2"><Card title="Scenario Comparison" subtitle="Hypothetical · Not Actual"><div className="overflow-x-auto"><table className="w-full min-w-[570px] text-xs"><thead className="text-left text-[10px] uppercase text-muted-foreground"><tr>{['Metric', 'Base', 'Growth Scenario', 'Conservative', 'Difference'].map(x => <th key={x} className="pb-3">{x}</th>)}</tr></thead><tbody className="divide-y divide-border">{[['Revenue', '1.8M', '2.1M', '1.4M', '+300K'], ['Expenses', '1.2M', '1.4M', '1.1M', '+200K'], ['Net Cash Flow', '640K', '700K', '320K', '+60K'], ['Closing Cash', '890K', '950K', '610K', '+60K'], ['Revenue Growth', '14.2%', '20%', '7%', '+5.8pp'], ['Goal Progress', '68%', '82%', '49%', '+14pp']].map(row => <tr key={row[0]}><td className="py-3 font-bold">{row[0]}</td><td>{row[1]}</td><td className="font-semibold text-foreground">{row[2]}</td><td>{row[3]}</td><td className="text-chart-4">{row[4]}</td></tr>)}</tbody></table></div><button className="btn-secondary mt-4"><X size={14} /><span>Reset Scenario</span></button></Card><Card title="Sensitivity Analysis" subtitle="Scenario Model · Not Actual"><div className="flex flex-wrap gap-2"><select value={assumption} onChange={e => setAssumption(e.target.value)} className={selectClass}>{['Revenue Growth', 'Expense Growth', 'Customer Growth', 'Average Order Value', 'Recurring Revenue'].map(x => <option key={x}>{x}</option>)}</select><Badge tone="amber">Scenario Model - Not Actual</Badge></div><label className="mt-5 block text-xs font-bold">{assumption}: <span className="text-foreground">{slider}%</span><input aria-label="Adjust assumption" type="range" min="0" max="30" value={slider} onChange={e => setSlider(Number(e.target.value))} className="mt-3 w-full accent-primary" /></label><div className="mt-5 grid grid-cols-2 gap-3 text-xs">{[['Revenue', '1.86M'], ['Expenses', '1.21M'], ['Net Cash Flow', '650K'], ['Closing Cash', '900K'], ['Goal Progress', '71%']].map(row => <div key={row[0]} className="rounded-lg bg-card p-3"><span className="text-muted-foreground">Modeled {row[0]}</span><strong className="mt-1 block">{row[1]}</strong></div>)}</div></Card></div>
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2"><Card title="Plan vs Actual" subtitle="Actual badges indicate confirmed data"><table className="w-full text-xs"><thead className="text-left text-[10px] uppercase text-muted-foreground"><tr>{['Metric', 'Planned', 'Actual', 'Variance', 'Variance%', 'Trend'].map(x => <th key={x} className="pb-3">{x}</th>)}</tr></thead><tbody className="divide-y divide-border">{[['Revenue', '1.8M', '1.1M', '−700K', '−38.9%', 'Below'], ['Expenses', '1.2M', '940K', '−260K', '−21.7%', 'Favorable'], ['Cash', '890K', '620K', '−270K', '−30.3%', 'Below']].map(row => <tr key={row[0]}><td className="py-3 font-bold">{row[0]}</td><td>{row[1]}</td><td>{row[2]} <Badge tone="blue">Actual</Badge></td><td>{row[3]}</td><td className="text-foreground">{row[4]}</td><td>{row[5]}</td></tr>)}</tbody></table></Card><Card title="Financial Planning Risks" subtitle="Decision support only"><div className="space-y-3">{[['Revenue growth below plan', 'High', 'tracking 4pp below plan', 'red'], ['Cash reserve goal at risk', 'Medium', 'review reserve coverage', 'amber'], ['High cost concentration', 'Medium', '62% of expenses in 2 categories', 'amber']].map(risk => <div key={risk[0]} className="flex items-start gap-3 rounded-lg border border-border p-3"><Target size={16} className="mt-0.5 text-muted-foreground" /><div className="flex-1"><strong className="text-xs">{risk[0]}</strong><p className="mt-1 text-[11px] text-muted-foreground">{risk[2]}</p></div><div className="flex flex-col items-end gap-2"><Badge tone={risk[3] as Tone}>{risk[1]}</Badge><div className="flex gap-2 text-[10px] font-bold text-foreground"><button>Investigate</button><button>Ask Lulu AI</button></div></div></div>)}</div><p className="mt-4 text-[10px] italic text-muted-foreground">This information does not constitute financial advice.</p></Card></div>
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2"><Card title="Financial Opportunities" subtitle="Evidence-backed planning support"><div className="mb-3"><Badge tone="violet">AI-generated</Badge></div><div className="space-y-3">{[['Recurring revenue expansion opportunity', 'Subscription mix supports a modeled 18% expansion opportunity.'], ['Cost optimization in Technology spend', 'Technology represents 14% of expenses with 9% savings potential.'], ['Growth scenario suggests 240K incremental revenue potential', 'Customer growth and average order value are the largest contributors.']].map(item => <div key={item[0]} className="rounded-lg bg-secondary/60 p-3"><div className="flex items-center gap-2"><Sparkles size={14} className="text-foreground" /><strong className="text-xs">{item[0]}</strong></div><p className="mt-1 text-[11px] text-muted-foreground">{item[1]}</p><Badge tone="violet">AI-generated</Badge></div>)}</div></Card><Card title="Planning Assumptions" subtitle="AI-suggested assumptions are NOT automatically active"><div className="overflow-x-auto"><table className="w-full min-w-[540px] text-xs"><thead className="text-left text-[10px] uppercase text-muted-foreground"><tr>{['Assumption', 'Value', 'Unit', 'Effective Period', 'Source', 'Last Updated'].map(x => <th key={x} className="pb-3">{x}</th>)}</tr></thead><tbody className="divide-y divide-border">{assumptions.map(row => <tr key={row[0]}><td className="py-3 font-semibold">{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td><td><Badge tone={row[5] as Tone}>{row[4]}</Badge></td><td className="text-muted-foreground">08 Aug 2026</td></tr>)}</tbody></table></div></Card></div>
        <section className="mt-6 rounded-xl border border-border bg-gradient-to-br from-secondary via-white to-secondary p-6 shadow-[0_4px_16px_rgba(0,0,0,.06)]"><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Bot size={17} /></div><div><h2 className="text-base font-bold">Ask Lulu AI</h2><p className="text-xs text-muted-foreground">Your financial intelligence, ready when you are.</p></div></div><div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-card p-2 shadow-sm"><input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask Lulu AI about your financial plan" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground" aria-label="Ask Lulu AI about your financial plan" /><button className="rounded-lg bg-primary p-2.5 text-primary-foreground" aria-label="Send question"><Send size={16} /></button></div><div className="mt-4 flex gap-2 overflow-x-auto pb-1">{prompts.map(prompt => <button key={prompt} onClick={() => {
              setQuestion(prompt);
              setActivePrompt(prompt);
            }} className={`shrink-0 rounded-full border px-3 py-2 text-xs font-medium ${activePrompt === prompt ? 'border-border bg-secondary text-foreground' : 'border-border bg-card text-foreground'}`}><span>{prompt}</span></button>)}</div><div className="mt-5 rounded-lg border border-border bg-card p-4"><div className="flex items-center gap-2"><Badge tone="violet">AI Insight</Badge><span className="text-[11px] text-muted-foreground">Illustrative response</span></div><p className="mt-3 text-sm leading-6 text-foreground">Your base outlook is on track for 1.8M forecast revenue and 890K closing cash. The largest sensitivity is Revenue Growth; a 20% growth assumption adds modeled upside while keeping the cash reserve goal under review.</p><p className="mt-2 text-[11px] text-foreground">Supporting evidence · Revenue growth 14.2% · cash reserve progress 56% · technology concentration 14%</p></div><div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2"><div className="rounded-lg border border-border bg-card p-3"><Badge tone="violet">AI Recommendation</Badge><p className="mt-2 text-xs font-semibold">Prioritize the cash reserve goal before entering the growth scenario.</p></div><div className="rounded-lg border border-border bg-card p-3"><Badge tone="violet">AI Recommendation</Badge><p className="mt-2 text-xs font-semibold">Review technology vendors to reduce concentration risk.</p></div></div></section>
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2"><Card title="Plan History & Audit Log"><table className="w-full text-xs"><thead className="text-left text-[10px] uppercase text-muted-foreground"><tr>{['Date', 'User/System', 'Event', 'Previous Value', 'New Value'].map(x => <th key={x} className="pb-3">{x}</th>)}</tr></thead><tbody className="divide-y divide-border">{[['08 Aug 2026', 'Sarah K.', 'Assumption changed', 'Revenue Growth 12%', '14%'], ['02 Aug 2026', 'System', 'Plan activated', 'Draft', 'Active'], ['15 Jul 2026', 'Sarah K.', 'Goal added', '—', 'Annual Revenue Target 2.0M']].map(row => <tr key={`${row[0]}-${row[2]}`}><td className="py-3 text-muted-foreground">{row[0]}</td><td>{row[1]}</td><td className="font-semibold">{row[2]}</td><td>{row[3]}</td><td>{row[4]}</td></tr>)}</tbody></table></Card><Card title="Workspace status" subtitle="Forecast and scenario services"><div className="space-y-3">{[['Loading Error', 'No errors detected', 'green'], ['Forecast Error', 'No errors detected', 'green'], ['Scenario Error', 'No errors detected', 'green'], ['Save Error', 'No errors detected', 'green'], ['Export Error', 'No errors detected', 'green'], ['Permission Error', 'No errors detected', 'green']].map(item => <div key={item[0]} className="flex items-center justify-between border-b border-border pb-2 text-xs last:border-0"><span className="font-semibold">{item[0]}</span><Badge tone={item[2] as Tone}><Check size={11} />{item[1]}</Badge></div>)}</div></Card></div>
      </div></main><div className="sticky bottom-0 z-20 flex items-center justify-center gap-3 border-t border-border bg-secondary px-5 py-3 text-xs"><span className="font-bold text-foreground">Unsaved changes</span><button onClick={() => setSaved(true)} className="rounded-md bg-primary px-3 py-1.5 font-bold text-primary-foreground">{saved ? 'Saved' : 'Save'}</button><button onClick={() => setSaved(false)} className="rounded-md border border-border bg-card px-3 py-1.5 font-bold text-foreground">Discard</button></div>
    <style>{`.btn-primary{display:inline-flex;align-items:center;gap:.45rem;border-radius:.5rem;background:var(--primary);padding:.62rem .8rem;font-size:.7rem;font-weight:700;color:white;box-shadow:0 1px 2px rgba(0,0,0,.06)}.btn-primary:hover{background:var(--primary);color:var(--primary-foreground)}.btn-secondary{display:inline-flex;align-items:center;gap:.45rem;border-radius:.5rem;border:1px solid var(--border);background:white;padding:.58rem .75rem;font-size:.7rem;font-weight:700;color:var(--muted-foreground)}.btn-secondary:hover{border-color:var(--foreground);color:var(--foreground)}.tab-active{border-radius:.375rem;background:white;padding:.38rem .62rem;font-size:.68rem;font-weight:700;color:var(--foreground);box-shadow:0 1px 2px rgba(0,0,0,.08)}.tab{border-radius:.375rem;padding:.38rem .62rem;font-size:.68rem;font-weight:700;color:var(--muted-foreground)}`}</style>
  </div>;
}
export function EmptyFinancialPlan() {
  return <div className="grid min-h-[300px] place-items-center rounded-xl border border-dashed border-border bg-card p-8 text-center"><div><div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-secondary text-foreground"><TrendingUp size={22} /></div><h2 className="mt-4 text-lg font-bold">Create your first financial plan</h2><p className="mt-2 max-w-sm text-sm text-muted-foreground">Build a financial plan using your existing business data, budgets and cash flow information.</p><button className="btn-primary mt-5">Create Financial Plan</button></div></div>;
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
