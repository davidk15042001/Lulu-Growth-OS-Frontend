import { useState } from 'react';
import { Activity, AlertTriangle, ArrowRight, BarChart3, Bell, Bot, Check, ChevronDown, Clock3, Database, Download, FileText, Filter, HelpCircle, LayoutDashboard, Lightbulb, MessageCircle, MoreHorizontal, Plus, RefreshCw, Search, Settings, ShieldAlert, Sparkles, Target, TrendingUp, UserRound, Users, X, Zap } from 'lucide-react';
const stats = [['8', 'Open Decisions', 'indigo'], ['2', 'Awaiting Input', 'amber'], ['3', 'Awaiting Approval', 'amber pulse'], ['5', 'High Impact', 'red'], ['1', 'Overdue', 'red pulse'], ['4', 'Recently Resolved', 'green'], ['3', 'Monitoring', 'indigo pulse']];
const decisions = [{
  title: 'Increase Google Ads Budget by 20%',
  area: 'Advertising',
  priority: 'High',
  owner: 'Marketing Director',
  deadline: 'In 3 days',
  status: 'Awaiting Decision',
  rec: 'Option B recommended',
  risk: 'Medium'
}, {
  title: 'Enter Southern European Market',
  area: 'Strategic',
  priority: 'Critical',
  owner: 'CEO',
  deadline: 'In 7 days',
  status: 'Awaiting Input',
  rec: 'Insufficient data',
  risk: 'High'
}, {
  title: 'Launch New Product Bundle',
  area: 'Product',
  priority: 'High',
  owner: 'Product Director',
  deadline: 'In 5 days',
  status: 'Under Review',
  rec: 'Option A recommended',
  risk: 'Low'
}, {
  title: 'Reduce Operating Costs Q3',
  area: 'Finance',
  priority: 'High',
  owner: 'CFO',
  deadline: 'Overdue',
  status: 'Awaiting Approval',
  rec: 'Option C recommended',
  risk: 'Medium'
}, {
  title: 'Change Email Marketing Frequency',
  area: 'Marketing',
  priority: 'Medium',
  owner: 'CMO',
  deadline: 'In 14 days',
  status: 'Open',
  rec: 'No recommendation yet',
  risk: 'Low'
}, {
  title: 'Invest in Process Automation',
  area: 'Operations',
  priority: 'Medium',
  owner: 'COO',
  deadline: 'In 30 days',
  status: 'Draft',
  rec: 'In analysis',
  risk: 'Low'
}];
const evidence = [['KPI', 'ROAS', 'Current: 2.6x', 'Target: ≥2.0x', 'Stable', 'Google Ads', 'Observed'], ['Trend', 'Conversion Volume', '+14% after last increase', '90 days', 'Positive', 'Marketing data', 'Observed'], ['Benchmark', 'Industry average ROAS', 'Business: 2.6x', '+44% above benchmark', 'Strong', 'Industry data', 'Calculated'], ['Forecast', 'Estimated Q3 revenue', 'With 10% increase', 'Confidence: Medium', 'Projected', 'Lulu AI', 'Forecast / Estimated']];
const scenarios = [['Best Case', 'Conversion rate +5%', 'ROAS 3.1x', 'Revenue +$34K', 'bg-chart-4/10 border-chart-4/30'], ['Expected Case', 'Conversion stable', 'ROAS 2.5x', 'Revenue +$28K', 'bg-secondary/10 border-border/30'], ['Worst Case', 'CPA +18%', 'ROAS drops to 1.7x', 'Revenue +$8K', 'bg-chart-5/10 border-chart-5/30']];
const compareRows = [['Expected Impact', '+$52K', '+$28K', 'Stable', '-$22K'], ['Revenue Potential', 'High', 'Favorable', 'None', 'Negative'], ['Cost', '+$20,000/mo', '+$10,000/mo', '$0', '-$10,000/mo'], ['Profitability', 'Neutral', 'Favorable', 'Neutral', 'Unfavorable'], ['Risk', 'Medium', 'Low', 'Low', 'Medium'], ['Confidence', 'Medium', 'High', 'High', 'Medium'], ['Effort', 'Low', 'Low', 'None', 'Low'], ['Time to Impact', '30 days', '30 days', '—', '30 days'], ['Reversibility', 'High', 'High', 'High', 'High'], ['Strategic Alignment', 'Strong', 'Strong', 'Neutral', 'Weak']];
const navItems = [['Overview', LayoutDashboard], ['Signals', Activity], ['Opportunities', Target], ['Decisions', Lightbulb], ['Risks', ShieldAlert], ['Scenarios', BarChart3], ['Reports', FileText]];
function Sidebar() {
  return <aside className="hidden lg:flex w-[248px] shrink-0 border-r border-border/80 bg-[var(--background)] flex-col min-h-screen">
    <div className="h-20 px-6 flex items-center gap-3 border-b border-border/70"><div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary grid place-items-center shadow-lg shadow-black/20 text-primary-foreground"><Sparkles size={19} /></div><div><strong className="text-foreground tracking-tight">Lulu AI</strong><p className="text-[10px] text-muted-foreground uppercase tracking-[.18em]">Core Platform</p></div></div>
    <div className="min-h-0 flex flex-1 flex-col overflow-hidden px-4 py-4"><LuluSectionNavigation activeId="radiant-cave-9340" /></div>
    <div className="p-4 border-t border-border/70"><button className="flex items-center gap-3 px-3 py-2 text-sm text-foreground"><Settings size={17} /> Settings</button><div className="mt-4 flex items-center gap-3 px-3"><div className="h-8 w-8 rounded-full bg-secondary/30 grid place-items-center text-xs text-foreground">JD</div><div><p className="text-xs text-foreground">Jordan Davis</p><p className="text-[11px] text-muted-foreground">Admin workspace</p></div></div></div>
  </aside>;
}
function Pill({
  children,
  tone = 'slate'
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  const tones: Record<string, string> = {
    indigo: 'bg-secondary/15 text-foreground border-border/25',
    violet: 'bg-secondary/15 text-foreground border-border/25',
    amber: 'bg-secondary/15 text-foreground border-border/25',
    red: 'bg-chart-5/15 text-chart-5 border-chart-5/25',
    green: 'bg-secondary/15 text-foreground border-border/25',
    teal: 'bg-secondary/15 text-foreground border-border/25',
    blue: 'bg-secondary/15 text-foreground border-border/25',
    orange: 'bg-secondary/15 text-foreground border-border/25',
    slate: 'bg-card/40 text-foreground border-border/50'
  };
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-[11px] font-medium ${tones[tone] ?? tones.slate}`}>{children}</span>;
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
  action?: React.ReactNode;
}) {
  return <section className="mt-8"><div className="mb-4 flex items-end justify-between"><div>{eyebrow && <p className="mb-1 text-[10px] uppercase tracking-[.2em] text-foreground/70">{eyebrow}</p>}<h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2></div>{action}</div>{children}</section>;
}
export function LuluDecisions() {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState('Option B');
  const [comment, setComment] = useState('');
  const tone = (value: string) => value === 'Critical' || value === 'Overdue' || value === 'High' ? 'red' : value === 'Medium' || value === 'Awaiting Input' ? 'amber' : value === 'Awaiting Approval' ? 'orange' : value === 'Low' ? 'green' : value === 'Open' ? 'blue' : value === 'Under Review' ? 'indigo' : value === 'Draft' ? 'slate' : 'violet';
  return <div className="min-h-screen bg-[var(--background)] text-foreground selection:bg-secondary/30">
    <div className="flex min-h-screen"><Sidebar /><main className="min-w-0 flex-1"><header className="sticky top-0 z-20 border-b border-border/70 bg-[var(--card)]/95 px-5 py-4 backdrop-blur-xl md:px-8"><div className="flex flex-wrap items-center justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground"><span>Intelligence</span><span>/</span><span>AI Intelligence</span><span>/</span><span className="text-foreground">Decisions</span></div><h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Decisions</h1><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Evaluate important business decisions with AI-powered evidence, scenarios, recommendations and risk analysis.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-black/50 hover:brightness-110"><Plus size={15} /> Create Decision</button><button className="inline-flex items-center gap-2 rounded-lg border border-border/30 bg-secondary/10 px-3 py-2.5 text-xs text-foreground"><Bot size={15} /> Ask Lulu AI</button><button aria-label="Refresh" className="rounded-lg border border-border bg-background/50 p-2.5 hover:border-border/50"><RefreshCw size={15} /></button><button className="hidden rounded-lg border border-border bg-background/50 px-3 py-2.5 text-xs sm:inline-flex items-center gap-2"><FileText size={14} /> Create Report</button><button className="hidden rounded-lg border border-border bg-background/50 px-3 py-2.5 text-xs sm:inline-flex items-center gap-2"><Download size={14} /> Export</button></div></div><label className="relative mt-5 block max-w-xl"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><input aria-label="Search decisions" placeholder="Search decisions, opportunities, risks, KPIs..." className="w-full rounded-lg border border-border bg-[var(--secondary)] py-2.5 pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-border" /></label></header>
    <div className="px-5 pb-16 md:px-8"><div className="grid grid-cols-2 gap-2 py-5 md:grid-cols-4 xl:grid-cols-7">{stats.map(([number, label, color]) => <div key={label} className="rounded-lg border border-border bg-[var(--secondary)]/80 p-3"><div className="flex items-center justify-between"><strong className="text-xl text-foreground">{number}</strong><span className={`h-2 w-2 rounded-full ${color.includes('red') ? 'bg-destructive' : color.includes('amber') ? 'bg-primary' : color.includes('green') ? 'bg-primary' : 'bg-primary'} ${color.includes('pulse') ? 'animate-pulse shadow-[0_0_10px_currentColor]' : ''}`} /></div><p className="mt-1 text-[11px] leading-4 text-muted-foreground">{label}</p></div>)}</div><div className="flex items-center gap-3 rounded-lg border border-chart-5/20 bg-chart-5/10 px-4 py-3 text-sm text-chart-5"><AlertTriangle size={17} className="text-chart-5" /><span><strong>5 high-impact decisions</strong> currently require management attention.</span></div>
      <div className="mt-5 rounded-xl border border-border/20 border-l-4 border-l-border bg-gradient-to-r from-secondary/10 via-[var(--secondary)] to-[var(--secondary)] p-5"><div className="mb-3 flex items-center gap-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-secondary/20 text-foreground"><Bot size={17} /></div><h2 className="font-semibold text-foreground">AI Decision Summary</h2><Pill tone="violet"><Sparkles size={11} /> AI-generated</Pill></div><p className="max-w-4xl text-sm leading-6 text-foreground">Two decisions require attention because their decision windows are closing. One decision has a clear preferred option based on current evidence, while another remains uncertain because required financial data is incomplete.</p></div>
      <div className="mt-7 flex gap-1 overflow-x-auto border-b border-border pb-px">{['Open (8)', 'Awaiting Input (2)', 'Awaiting Approval (3)', 'High Impact (5)', 'Overdue (1)', 'Monitoring (3)', 'Completed', 'Deferred', 'All'].map(tab => <button key={tab} className={`whitespace-nowrap px-3 py-3 text-xs ${tab === 'Open (8)' ? 'border-b-2 border-border text-foreground' : 'text-foreground hover:text-foreground'}`}>{tab}</button>)}</div><div className="flex flex-wrap gap-2 py-4">{['Status', 'Priority', 'Business Area', 'Owner', 'Decision Type', 'Source', 'Risk', 'Decision Window', 'Requires Approval', 'AI Recommendation', 'Date'].map(filter => <button key={filter} className="inline-flex items-center gap-2 rounded-md border border-border bg-[var(--primary)] px-3 py-2 text-xs text-primary-foreground hover:border-border/50 hover:text-primary-foreground"><Filter size={12} />{filter}<ChevronDown size={12} /></button>)}</div>
      <Section title="Open Decisions" eyebrow="Decision queue" action={<span className="text-xs text-muted-foreground">Showing 6 of 8</span>}><div className="overflow-x-auto rounded-xl border border-border"><table className="w-full min-w-[1060px] text-left text-xs"><thead className="bg-[var(--card)] text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Decision', 'Business Area', 'Priority', 'Owner', 'Deadline', 'Status', 'AI Recommendation', 'Risk', 'Actions'].map(heading => <th key={heading} className="px-4 py-3 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-border/80">{decisions.map(decision => <tr key={decision.title} className="bg-[var(--card)] transition hover:bg-[var(--card)]"><td className="max-w-[220px] px-4 py-4 font-medium text-foreground">{decision.title}</td><td className="px-4 py-4 text-muted-foreground">{decision.area}</td><td className="px-4 py-4"><Pill tone={tone(decision.priority)}>{decision.priority}</Pill></td><td className="px-4 py-4 text-muted-foreground">{decision.owner}</td><td className="px-4 py-4"><span className={decision.deadline === 'Overdue' ? 'text-chart-5' : 'text-foreground'}>{decision.deadline}</span></td><td className="px-4 py-4"><Pill tone={tone(decision.status)}>{decision.status}</Pill></td><td className="px-4 py-4">{decision.rec.includes('recommended') ? <Pill tone="violet"><Sparkles size={11} />{decision.rec}</Pill> : <span className="text-muted-foreground">{decision.rec}</span>}</td><td className="px-4 py-4"><Pill tone={tone(decision.risk)}>{decision.risk}</Pill></td><td className="px-4 py-4"><div className="flex gap-1"><button className="rounded bg-card px-2 py-1.5 text-foreground hover:text-foreground">Open</button><button className="rounded bg-secondary/15 px-2 py-1.5 text-foreground hover:bg-secondary/30">Review</button>{decision.title.includes('Google') && <button onClick={() => setSelected('Option B')} className="rounded bg-secondary/15 px-2 py-1.5 text-foreground">Decide</button>}</div></td></tr>)}</tbody></table></div></Section>
      <Section title="Increase Google Ads Budget by 20%" eyebrow="Decision detail" action={<Pill tone="amber"><Clock3 size={12} /> 72 hours remaining</Pill>}><div className="rounded-xl border border-border bg-[var(--secondary)] p-5 md:p-7"><div className="flex flex-wrap gap-2 border-b border-border pb-5"><Pill tone="blue">Financial / Advertising</Pill><Pill>Advertising / Growth</Pill><Pill tone="amber">High priority</Pill><Pill>Owner: Marketing Director</Pill><Pill tone="amber">Awaiting Decision</Pill><Pill tone="violet"><Sparkles size={11} /> AI Recommendation</Pill></div><div className="py-7"><p className="mb-2 text-[10px] uppercase tracking-[.2em] text-foreground">Decision Question</p><blockquote className="max-w-4xl text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-3xl">Should the company increase Google Ads spending by 20% next month?</blockquote></div><div className="grid gap-5 border-y border-border py-6 md:grid-cols-2"><div><h3 className="mb-3 text-sm font-semibold text-foreground">Context <span className="ml-2 text-[10px] font-normal uppercase text-foreground">Observed Data</span></h3><ul className="space-y-2 text-sm leading-6 text-muted-foreground"><li className="flex gap-2"><span className="text-foreground">•</span>Google Ads ROAS has been 2.6x over the past 90 days, above the 2.0x profitability threshold</li><li className="flex gap-2"><span className="text-foreground">•</span>Conversion volume increased +14% following the last budget increase in Q1</li></ul></div><div className="rounded-lg border border-border/20 bg-secondary/5 p-4"><div className="mb-2 flex items-center gap-2"><h3 className="text-sm font-semibold text-foreground">AI Interpretation</h3><Pill tone="amber">Interpretation</Pill></div><p className="text-sm leading-6 text-muted-foreground">Current campaign efficiency and conversion trajectory suggest additional budget may generate incremental return, but outcome is not guaranteed.</p></div></div><div className="grid gap-4 py-6 text-sm md:grid-cols-3"><div><p className="text-muted-foreground">Objective</p><p className="mt-1 text-foreground">Determine whether additional advertising investment is likely to generate sufficient incremental return within acceptable risk and budget limits.</p></div><div><p className="text-muted-foreground">Related Business Goal</p><p className="mt-1 text-foreground">Increase Revenue · Improve Marketing Performance</p></div><div><p className="text-muted-foreground">Success Criteria</p><p className="mt-1 text-foreground">ROAS ≥2.0x maintained · No decline in conversion volume · Evaluated within 30 days</p></div></div><div className="rounded-lg border border-chart-1/20 bg-chart-1/5 p-4"><div className="grid gap-4 text-sm sm:grid-cols-4"><div><p className="text-muted-foreground">Created</p><strong className="text-foreground">2 days ago</strong></div><div><p className="text-muted-foreground">Deadline</p><strong className="text-foreground">In 3 days</strong></div><div><p className="text-muted-foreground">Time Remaining</p><strong className="text-foreground">72 hours</strong></div><div><p className="text-muted-foreground">Timing</p><strong className="text-foreground">Approaching deadline</strong></div></div></div></div></Section>
      <Section title="Decision Options" eyebrow="Evaluate scenarios"><div className="grid gap-3 md:grid-cols-2">{[['Option A', 'Increase budget by 20%', '+$20,000/mo', 'Estimated +$52K revenue', 'Medium', 'Medium'], ['Option B', 'Increase budget by 10%', '+$10,000/mo', 'Estimated +$28K revenue', 'Low', 'High'], ['Option C', 'Maintain current budget', '$0', 'Stable (estimated)', 'Low', 'High'], ['Option D', 'Reduce budget', '-$10,000/mo', 'Estimated -$22K revenue', 'Medium', 'Medium']].map(([option, name, cost, impact, risk, confidence]) => <button key={option} onClick={() => setSelected(option)} className={`rounded-xl border p-5 text-left transition hover:-translate-y-0.5 ${selected === option ? 'border-border bg-secondary/10 shadow-[0_0_24px_rgba(0,0,0,.15)]' : 'border-border bg-[var(--primary)] hover:border-border'} text-primary-foreground`}><div className="flex items-center justify-between"><span className="text-xs font-semibold text-foreground">{option}</span>{option === 'Option B' && <Pill tone="violet"><Sparkles size={11} /> AI Recommended</Pill>}</div><h3 className="mt-3 font-semibold text-foreground">{name}</h3><div className="mt-4 grid grid-cols-3 gap-3 text-xs"><div><p className="text-muted-foreground">Cost</p><p className="mt-1 text-foreground">{cost}</p></div><div><p className="text-muted-foreground">Impact</p><p className="mt-1 text-foreground">{impact}</p></div><div><p className="text-muted-foreground">Risk / Confidence</p><p className="mt-1 text-foreground">{risk} / {confidence}</p></div></div></button>)}</div></Section>
      <Section title="Compare Options" action={<span className="text-[11px] text-muted-foreground">All impact figures estimated</span>}><div className="overflow-x-auto rounded-xl border border-border"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-[var(--card)] text-muted-foreground"><tr><th className="px-4 py-3">Assessment</th><th className="px-4 py-3">Option A</th><th className="px-4 py-3 text-foreground">Option B · Recommended</th><th className="px-4 py-3">Option C</th><th className="px-4 py-3">Option D</th></tr></thead><tbody className="divide-y divide-border/80">{compareRows.map(row => <tr key={row[0]}><td className="px-4 py-3 text-muted-foreground">{row[0]}</td>{row.slice(1).map((cell, cellIndex) => <td key={`${row[0]}-${cell}`} className={`px-4 py-3 ${cellIndex === 1 ? 'bg-secondary/10 text-foreground' : cell.toLowerCase().includes('unfavorable') || cell.toLowerCase().includes('negative') ? 'text-chart-5' : cell.toLowerCase().includes('neutral') || cell.toLowerCase().includes('medium') ? 'text-foreground' : 'text-foreground'}`}>{cell}</td>)}</tr>)}</tbody></table></div></Section>
      <div className="mt-8 grid gap-5 xl:grid-cols-[1.5fr_1fr]"><div className="rounded-xl border border-border/25 bg-gradient-to-br from-secondary/10 to-[var(--secondary)] p-6"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-foreground">Lulu AI Recommendation</h2><Pill tone="violet"><Sparkles size={11} /> AI Recommendation</Pill></div><p className="mt-4 leading-7 text-foreground">Lulu AI currently recommends <strong className="text-foreground">Option B</strong> because it offers a favorable balance between expected incremental revenue and downside risk. A 10% increase allows performance validation before committing to larger spend.</p><div className="mt-5 grid gap-5 text-sm sm:grid-cols-2"><div><p className="text-muted-foreground">Recommendation Confidence</p><strong className="text-chart-4">High</strong><p className="mt-4 text-muted-foreground">Supporting Evidence</p><p className="mt-1 text-foreground">ROAS 2.6x sustained · Conversion trend positive · Q1 increase yielded +14% volume</p></div><div><p className="text-muted-foreground">Key Assumptions</p><p className="mt-1 text-foreground">Current conversion rate maintained · No major algorithm changes · Seasonal demand stable</p><p className="mt-4 text-muted-foreground">Main Risks</p><p className="mt-1 text-foreground">Increased CPA if efficiency declines · Budget not recoverable mid-cycle</p></div></div><p className="mt-6 border-t border-border/15 pt-4 text-xs italic text-muted-foreground">This is a recommendation, not a decision. The final choice requires human judgment and approval.</p></div><div className="rounded-xl border border-border bg-[var(--secondary)] p-6"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-foreground">Decision Score</h2><div className="text-right"><strong className="text-3xl text-foreground">75</strong><span className="text-muted-foreground"> /100</span></div></div><div className="mt-5 h-3 overflow-hidden rounded-full bg-card"><div className="h-full w-[75%] rounded-full bg-gradient-to-r from-primary to-primary text-primary-foreground" /></div><div className="mt-5 grid grid-cols-2 gap-3 text-xs">{['Expected Impact|8/10', 'Confidence|7/10', 'Risk|6/10', 'Cost|7/10', 'Strategic Alignment|8/10', 'Execution Feasibility|9/10'].map(item => {
                  const [label, value] = item.split('|');
                  return <div key={label} className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">{label}</span><strong className="text-foreground">{value}</strong></div>;
                })}</div><p className="mt-5 text-[11px] text-muted-foreground">Score reflects current evidence quality and option balance.</p></div></div>
      <Section title="Supporting Evidence" eyebrow="Evidence graph"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{evidence.map(item => <article key={item[1]} className="rounded-xl border border-border bg-[var(--card)] p-4 transition hover:-translate-y-0.5 hover:border-border/40"><div className="flex items-center justify-between"><Pill tone="teal">{item[0]}</Pill><span className="text-[10px] text-foreground">{item[6]}</span></div><h3 className="mt-4 font-semibold text-foreground">{item[1]}</h3><p className="mt-2 text-sm text-foreground">{item[2]}</p><p className="mt-1 text-xs text-muted-foreground">{item[3]} · {item[4]}</p><div className="mt-4 flex gap-3 text-[11px] text-foreground"><button>View Analysis</button><button>Open Source</button></div></article>)}</div></Section>
      <Section title="Scenario Analysis" action={<span className="text-[11px] text-muted-foreground">Forecast / Estimated</span>}><div className="grid gap-3 md:grid-cols-3">{scenarios.map(scenario => <article key={scenario[0]} className={`rounded-xl border p-5 ${scenario[4]}`}><h3 className="font-semibold text-foreground">{scenario[0]}</h3><p className="mt-4 text-sm text-foreground">{scenario[1]}</p><div className="mt-4 grid grid-cols-2 gap-3 text-xs"><div><p className="text-muted-foreground">ROAS</p><strong className="text-foreground">{scenario[2].replace('ROAS ', '')}</strong></div><div><p className="text-muted-foreground">Revenue</p><strong className="text-chart-4">{scenario[3].replace('Revenue ', '')}</strong></div></div><div className="mt-4 space-y-2 border-t border-border pt-3 text-xs text-muted-foreground"><p>Assumptions <span className="float-right text-foreground">Historical trend</span></p><p>Cost Impact <span className="float-right text-foreground">+$10K</span></p><p>Risk <span className="float-right text-foreground">{scenario[0] === 'Worst Case' ? 'High' : 'Low'}</span></p></div></article>)}</div><p className="mt-3 text-xs italic text-muted-foreground">Scenario projections are estimates based on historical data and assumptions. Actual results may differ.</p></Section>
      <div className="mt-8 grid gap-5 xl:grid-cols-2"><div className="rounded-xl border border-border bg-[var(--secondary)] p-6"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-foreground">What-If Analysis</h2><Pill tone="violet"><Sparkles size={11} /> AI model</Pill></div><div className="mt-5 flex justify-between text-sm"><span>Advertising Budget</span><span className="text-muted-foreground">Current: €100,000 · Scenario: <strong className="text-foreground">€110,000 (+10%)</strong></span></div><input aria-label="Advertising budget scenario" type="range" defaultValue="60" className="mt-5 w-full accent-primary" /><div className="mt-6 grid grid-cols-2 gap-3">{[['Expected Revenue', 'est. $128K'], ['Expected ROAS', '2.5x est.'], ['Expected Profit', 'est. $18K'], ['Risk', 'Low']].map(([label, value]) => <div key={label} className="rounded-lg bg-[var(--secondary)] p-3"><p className="text-[11px] text-muted-foreground">{label}</p><strong className="mt-1 block text-foreground">{value}</strong></div>)}</div></div><div className="rounded-xl border border-border bg-[var(--secondary)] p-6"><h2 className="text-lg font-semibold text-foreground">Sensitivity Analysis</h2><div className="mt-5 space-y-4">{[['Budget', 'High impact', '100%'], ['Conversion Rate', 'Medium impact', '78%'], ['Average Order Value', 'Moderate impact', '61%'], ['Traffic', 'Low impact', '38%']].map(([label, level, width]) => <div key={label}><div className="mb-1 flex justify-between text-xs"><span className="text-foreground">{label}</span><span className="text-muted-foreground">{level}</span></div><div className="h-2 rounded-full bg-card"><div className="h-full rounded-full bg-gradient-to-r from-primary to-primary text-primary-foreground" style={{
                      width
                    }} /></div></div>)}</div><p className="mt-5 text-xs text-muted-foreground">Variables with higher sensitivity warrant closer monitoring.</p></div></div>
      <Section title="Decision Risks" eyebrow="Risk analysis"><div className="grid gap-3 md:grid-cols-3">{[['Financial Risk', 'Medium', 'Budget increase is not recoverable mid-cycle if performance drops.', 'Set ROAS floor trigger for pause'], ['Execution Risk', 'Low', 'Google Ads budget changes can be applied immediately via API.', 'None required'], ['Market Risk', 'Low', 'Seasonal demand may shift.', 'Monitor weekly']].map(([name, level, copy, mitigation]) => <article key={name} className="rounded-xl border border-border bg-[var(--card)] p-5"><div className="flex justify-between"><h3 className="font-semibold text-foreground">{name}</h3><Pill tone={level === 'Medium' ? 'amber' : 'green'}>{level}</Pill></div><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p><p className="mt-4 text-xs text-muted-foreground">Mitigation: <span className="text-foreground">{mitigation}</span></p><button className="mt-4 text-xs text-foreground">View Risk <ArrowRight size={12} className="ml-1 inline" /></button></article>)}</div></Section>
      <div className="mt-8 grid gap-5 lg:grid-cols-3"><div className="rounded-xl border border-border/20 bg-secondary/5 p-5"><h2 className="font-semibold text-foreground">Decision Reversibility</h2><Pill tone="green">Reversible</Pill><p className="mt-3 text-sm leading-6 text-muted-foreground">Advertising budget changes can be paused or reversed within 24 hours via Google Ads. Financial impact is limited to the current billing cycle.</p></div><div className="rounded-xl border border-border bg-[var(--secondary)] p-5 lg:col-span-2"><h2 className="font-semibold text-foreground">Decision Dependencies</h2><div className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><p><Check className="mr-2 inline text-chart-4" size={15} />Google Ads API: Connected</p><p><Clock3 className="mr-2 inline text-foreground" size={15} />Budget approval: Awaiting CFO</p><p><Check className="mr-2 inline text-chart-4" size={15} />Related Task: Analyze efficiency</p><p className="text-foreground">Related Recommendation: Reduce Inefficient Paid Acquisition</p><p className="text-foreground">Related Opportunity: Budget Reallocation</p></div><p className="mt-4 text-xs text-foreground">CFO approval required before execution.</p></div></div>
      <div className="mt-8 rounded-xl border border-border/25 bg-gradient-to-r from-secondary/10 to-secondary/10 p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.2em] text-foreground">Human decision required</p><h2 className="mt-1 text-xl font-semibold text-foreground">Make Decision</h2><p className="mt-1 text-sm text-muted-foreground">Choose an option, add context, and route it for approval.</p></div><button onClick={() => setShowModal(true)} className="rounded-lg bg-gradient-to-r from-primary to-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/50">Confirm Decision</button></div><div className="mt-5 flex flex-wrap gap-2">{['Option A', 'Option B', 'Option C', 'Option D', 'Other'].map(option => <button key={option} onClick={() => setSelected(option)} className={`rounded-lg border px-4 py-2.5 text-sm ${selected === option ? 'border-border bg-secondary/25 text-foreground' : 'border-border bg-secondary/30 text-foreground'}`}>{option}{option === 'Option B' && <span className="ml-2 text-[10px] text-muted-foreground">AI Recommended</span>}</button>)}</div><textarea aria-label="Decision rationale" placeholder="Why was this decision made? (optional)" className="mt-4 min-h-20 w-full rounded-lg border border-border bg-[var(--secondary)] p-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-border" /></div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2"><div className="rounded-xl border border-border bg-[var(--secondary)] p-6"><h2 className="text-lg font-semibold text-foreground">Decision Owner & Stakeholders</h2><div className="mt-5 flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-secondary/25 grid place-items-center"><UserRound size={18} className="text-foreground" /></div><div><p className="text-sm text-foreground">Marketing Director</p><p className="text-xs text-muted-foreground">Marketing · Decision Owner</p></div><button className="ml-auto text-xs text-foreground">Reassign</button></div><div className="mt-5 flex flex-wrap gap-2"><Pill> CMO · Reviewer</Pill><Pill> CFO · Approver</Pill><Pill> Growth Lead · Contributor</Pill></div><button className="mt-5 rounded-lg border border-border/30 px-3 py-2 text-xs text-foreground">Request Input</button></div><div className="rounded-xl border border-border bg-[var(--secondary)] p-6"><div className="flex justify-between"><h2 className="text-lg font-semibold text-foreground">Approval</h2><Pill tone="amber">Pending</Pill></div><p className="mt-4 text-sm text-muted-foreground">Required Approver: <strong className="text-foreground">CFO</strong></p><div className="mt-5 flex flex-wrap gap-2"><button className="rounded-lg bg-chart-4/15 px-3 py-2 text-xs text-chart-4">Approve</button><button className="rounded-lg bg-chart-5/15 px-3 py-2 text-xs text-chart-5">Reject</button><button className="rounded-lg border border-border px-3 py-2 text-xs text-foreground">Request Changes</button></div></div></div>
      <Section title="Ask Lulu AI" eyebrow="Decision copilot"><div className="rounded-xl border border-border/20 bg-[var(--secondary)] p-5"><div className="relative"><Bot className="absolute left-3 top-3 text-muted-foreground" size={17} /><input placeholder="Ask Lulu AI about your decisions..." className="w-full rounded-lg border border-border bg-[var(--secondary)] py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-border" /></div><div className="mt-4 flex flex-wrap gap-2">{['Which decisions require my attention?', 'What is the most important decision?', 'What does Lulu AI recommend?', 'Compare my current options.', 'What are the biggest risks?', 'Which decisions are overdue?'].map(prompt => <button key={prompt} className="rounded-full border border-border px-3 py-2 text-xs text-foreground hover:border-border/50 hover:text-foreground">{prompt}</button>)}</div></div></Section>
      <div className="mt-8 grid gap-5 xl:grid-cols-2"><div className="rounded-xl border border-border bg-[var(--secondary)] p-6"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-foreground">Decision History</h2><Clock3 size={17} className="text-muted-foreground" /></div><ol className="mt-5 space-y-4 border-l border-border/30 pl-5 text-sm">{['Created · User · 2 days ago', 'Input Requested · User · Yesterday', 'Recommendation Generated · AI · 4 hours ago', 'Approval Requested · User · 2 hours ago', 'Monitoring Started · AI · Pending'].map(event => <li key={event} className="relative text-foreground"><span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-[var(--muted-foreground)] text-primary-foreground" />{event}</li>)}</ol></div><div className="rounded-xl border border-border bg-[var(--secondary)] p-6"><h2 className="text-lg font-semibold text-foreground">Data Sources & Quality</h2><div className="mt-5 space-y-3">{['Google Ads · Synced 4 min ago · Excellent', 'Meta Ads · Synced 18 min ago · Good', 'GA4 · Synced 12 min ago · Excellent', 'CRM · Synced 1 hour ago · Good', 'Finance · Synced 2 hours ago · Limited'].map(source => <div key={source} className="flex items-center justify-between border-b border-border pb-3 text-xs"><span className="text-foreground">{source.split(' · ')[0]}</span><span className={source.includes('Limited') ? 'text-foreground' : 'text-foreground'}>{source.split(' · ').slice(1).join(' · ')}</span></div>)}</div><div className="mt-5 flex flex-wrap gap-2"><Pill tone="green">Completeness · Excellent</Pill><Pill tone="green">Freshness · Good</Pill><Pill tone="amber">Coverage · Limited</Pill></div></div></div>
    </div></main></div>
    {showModal && <dialog open aria-labelledby="decision-modal-title" className="fixed inset-0 z-50 m-auto w-[min(92vw,520px)] rounded-2xl border border-border/30 bg-[var(--card)] p-0 text-foreground shadow-2xl shadow-black/60 backdrop:bg-primary/70"><div className="p-6"><div className="flex items-start justify-between"><div><p className="text-[10px] uppercase tracking-[.2em] text-foreground">Human approval checkpoint</p><h2 id="decision-modal-title" className="mt-2 text-xl font-semibold text-foreground">Confirm Decision</h2></div><button onClick={() => setShowModal(false)} aria-label="Close dialog" className="text-foreground hover:text-foreground"><X size={18} /></button></div><div className="mt-6 space-y-4 rounded-lg bg-[var(--secondary)] p-4 text-sm"><p><span className="text-muted-foreground">Selected</span><strong className="ml-3 text-foreground">{selected} — Increase budget by 10%</strong></p><p><span className="text-muted-foreground">Expected Impact</span><strong className="ml-3 text-chart-4">Estimated +$28K revenue</strong></p><p><span className="text-muted-foreground">Risks</span><strong className="ml-3 text-foreground">Low–Medium</strong></p><p><span className="text-muted-foreground">Dependencies</span><strong className="ml-3 text-foreground">CFO approval, Google Ads write access</strong></p></div><div className="mt-4 flex gap-3 rounded-lg border border-border/20 bg-secondary/10 p-4 text-xs leading-5 text-foreground"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-foreground" />This decision may trigger downstream tasks or AI execution.</div><div className="mt-6 flex justify-end gap-2"><button onClick={() => setShowModal(false)} className="rounded-lg border border-border px-4 py-2.5 text-sm text-foreground">Go Back</button><button onClick={() => {
            setShowModal(false);
            setSelected('Option B');
          }} className="rounded-lg bg-gradient-to-r from-primary to-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Confirm Decision</button></div></div></dialog>}
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
