import { useState } from 'react';
import type { ReactNode } from 'react';
import { Bell, Bot, BrainCircuit, ChevronDown, ChevronRight, CircleHelp, Clock3, Download, ExternalLink, FileText, Filter, Gauge, LayoutDashboard, Menu, MoreHorizontal, Play, Plus, RefreshCw, Search, Send, Settings, ShieldCheck, Sparkles, Star, Target, ThumbsDown, ThumbsUp, X, Zap } from 'lucide-react';
type Priority = 'High' | 'Medium' | 'Low';
type ModalKind = 'reject' | 'defer' | 'execute' | 'task' | null;
const stats = [['12', 'Active Recommendations', 'text-foreground'], ['4', 'High-Priority', 'text-foreground'], ['3', 'Awaiting Approval', 'text-foreground'], ['1', 'Executing', 'text-foreground'], ['28', 'Completed', 'text-chart-4'], ['6', 'Dismissed', 'text-muted-foreground'], ['14 min ago', 'Last Analysis', 'text-foreground'], ['Excellent', 'Data Freshness', 'text-chart-4']];
const recommendations = [{
  id: 'paid-spend',
  title: 'Reduce Inefficient Paid Acquisition Spend',
  area: 'Advertising',
  priority: 'High' as Priority,
  impact: '+$24K/mo savings',
  confidence: 'High',
  urgency: 'Immediate',
  effort: 'Low',
  text: 'Advertising spend increased significantly while attributed revenue growth remained comparatively lower. Several campaigns show declining efficiency.',
  ai: true
}, {
  id: 'retention',
  title: 'Improve Retention for High-Value Customer Segment',
  area: 'Customers',
  priority: 'High' as Priority,
  impact: '+8% retention',
  confidence: 'Medium',
  urgency: 'High',
  effort: 'Medium',
  text: 'Churn signals detected in top 20% of customers by LTV. Early intervention recommended before next billing cycle.',
  ai: false
}, {
  id: 'mobile-conversion',
  title: 'Address Declining Mobile Conversion Rate',
  area: 'Ecommerce',
  priority: 'Medium' as Priority,
  impact: '+3.2% conversion',
  confidence: 'High',
  urgency: 'High',
  effort: 'Medium',
  text: 'Mobile conversion rate declined 18% over the past 30 days while desktop performance remained stable.',
  ai: false
}];
const rows = [['Rebalance regional sales coverage', 'Sales', 'High', '+$31K pipeline', 'High', 'High', 'Medium', 'New'], ['Reduce invoice processing delays', 'Finance', 'Medium', '−14 hrs / week', 'High', 'Medium', 'Low', 'Reviewed'], ['Refresh dormant lead sequences', 'Marketing', 'Medium', '+6% reactivation', 'Medium', 'High', 'Low', 'Awaiting Approval'], ['Consolidate duplicate workflows', 'Operations', 'Low', '−$8K / yr', 'High', 'Low', 'Low', 'Deferred'], ['Expand enterprise onboarding', 'Revenue', 'High', '+11% activation', 'Medium', 'Immediate', 'High', 'Approved'], ['Fix search zero-result paths', 'Products', 'Medium', '+2.1% conversion', 'High', 'High', 'Medium', 'New'], ['Review pricing page messaging', 'Marketing', 'Low', '+4% engagement', 'Medium', 'Low', 'Low', 'Reviewed']];
const filters = ['All', 'Business Area', 'Priority', 'Status', 'Confidence', 'Urgency', 'Effort', 'Expected Impact', 'Requires Approval', 'Saved', 'Source', 'Date'];
const navWorkspace = [{
  Icon: LayoutDashboard,
  label: 'Overview'
}, {
  Icon: Gauge,
  label: 'Performance'
}, {
  Icon: Target,
  label: 'Goals'
}];
const navManage = [{
  Icon: FileText,
  label: 'Reports'
}, {
  Icon: Settings,
  label: 'Settings'
}];
const navIntelligence = [{
  Icon: Zap,
  label: 'AI Actions'
}, {
  Icon: ShieldCheck,
  label: 'Risks & Opportunities'
}];
const states = [['Awaiting Approval', 'bg-card text-foreground'], ['Approved', 'bg-secondary/15 text-foreground'], ['Scheduled', 'bg-secondary/15 text-foreground'], ['Executing', 'bg-secondary/15 text-foreground'], ['Completed', 'bg-chart-4/15 text-chart-4'], ['Partially Completed', 'bg-secondary/15 text-foreground'], ['Failed', 'bg-chart-5/15 text-chart-5'], ['Paused', 'bg-secondary/15 text-foreground'], ['Cancelled', 'bg-card text-muted-foreground']];
const Badge = ({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) => <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ${className}`}>{children}</span>;
const SectionTitle = ({
  children,
  action
}: {
  children: ReactNode;
  action?: ReactNode;
}) => <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold tracking-tight text-foreground">{children}</h2>{action}</div>;
export const LuluRecommendations = () => {
  const [selected, setSelected] = useState('paid-spend');
  const [tab, setTab] = useState('Active (12)');
  const [modal, setModal] = useState<ModalKind>(null);
  const [approved, setApproved] = useState(false);
  const [query, setQuery] = useState('');
  return <main className="min-h-screen bg-[var(--background)] text-foreground selection:bg-secondary/30">
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border/[.07] bg-[var(--sidebar)] px-4 py-5 lg:block">
      <div className="mb-10 flex items-center gap-3 px-2"><div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary text-primary-foreground shadow-lg shadow-black/50"><Bot size={20} /></div><span className="text-lg font-bold tracking-tight text-foreground">lulu<span className="text-foreground">.</span>ai</span></div>
      <LuluSectionNavigation activeId="daring-home-4179" />
      <div className="absolute bottom-5 left-4 right-4 rounded-xl border border-border/[.07] bg-[var(--secondary)] p-3"><div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)] text-primary-foreground" /><span className="text-xs text-foreground">Lulu AI is online</span></div><p className="mt-1 text-[11px] text-muted-foreground">Analyzed 2 min ago</p></div>
    </aside>
    <section className="lg:ml-64">
      <header className="flex min-h-[72px] flex-wrap items-center justify-between gap-4 border-b border-border/[.07] px-5 py-4 md:px-8"><div className="flex items-center gap-3"><button className="lg:hidden" aria-label="Open navigation"><Menu size={20} /></button><div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span>Intelligence</span><ChevronRight size={13} /><span>AI Intelligence</span><ChevronRight size={13} /><strong className="font-medium text-foreground">AI Recommendations</strong></div></div><div className="flex items-center gap-3"><button className="hidden rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary sm:flex"><RefreshCw size={14} className="mr-2" /> Refresh Recommendations</button><button className="hidden rounded-lg border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary md:flex"><FileText size={14} className="mr-2" /> Create Report</button><button className="rounded-lg border border-border p-2 text-foreground hover:bg-secondary" aria-label="Export"><Download size={16} /></button><button className="rounded-lg p-2 text-foreground hover:bg-secondary" aria-label="Notifications"><Bell size={17} /></button><div className="grid h-8 w-8 place-items-center rounded-full bg-secondary/30 text-xs font-semibold text-foreground">JD</div></div></header>
      <div className="mx-auto max-w-[1500px] px-5 py-7 md:px-8">
        <div className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><Badge className="mb-3 border border-border/20 bg-secondary/10 text-foreground"><Sparkles size={12} className="mr-1.5" /> Intelligence workspace</Badge><h1 className="text-3xl font-bold tracking-[-.03em] text-foreground md:text-4xl">AI Recommendations</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Lulu AI continuously identifies the actions most likely to improve your business based on your data, goals and current business context.</p></div><button className="flex items-center justify-center rounded-lg bg-gradient-to-r from-primary to-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/50 hover:brightness-110"><Sparkles size={16} className="mr-2" /> Ask Lulu AI</button></div>
        <div className="relative mb-6 max-w-xl"><Search size={17} className="absolute left-3 top-3 text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} aria-label="Search recommendations" placeholder="Search recommendations, business areas, campaigns, customers..." className="w-full rounded-lg border border-border bg-[var(--secondary)] py-2.5 pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-border/70 focus:ring-2 focus:ring-ring/20" /></div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">{stats.map(([value, label, color]) => <div key={label} className="rounded-xl border border-border/[.07] bg-[var(--secondary)] px-3 py-3"><strong className={`block text-lg font-bold ${color}`}>{label === 'Executing' && <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-secondary" />}{value}</strong><span className="mt-1 block text-[11px] leading-4 text-muted-foreground">{label}</span></div>)}</div>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/10 bg-secondary/[.06] px-4 py-3 text-xs text-foreground"><Sparkles size={14} /><span>Lulu AI currently has 12 active recommendations based on the latest business intelligence.</span></div>
        <div className="mt-7 rounded-xl border border-border/[.08] border-l-2 border-l-border bg-gradient-to-r from-secondary/[.12] to-transparent p-5"><div className="flex items-start justify-between gap-4"><div><Badge className="mb-3 bg-secondary/20 text-foreground shadow-[0_0_18px_rgba(0,0,0,.25)]"><Sparkles size={12} className="mr-1" /> AI-generated</Badge><p className="max-w-4xl text-sm leading-6 text-foreground">Lulu AI identified three high-impact actions: reduce inefficient paid acquisition spend, improve retention for high-value customers, and address declining conversion rates on mobile. Two recommendations are ready for immediate approval, and one can be executed automatically with AI.</p></div><button className="hidden shrink-0 text-xs font-medium text-foreground hover:text-foreground sm:block">View Evidence <ExternalLink size={13} className="ml-1 inline" /></button></div></div>
        <section className="mt-8"><SectionTitle action={<div className="flex items-center gap-1 text-xs text-muted-foreground"><span>Sort by</span>{['Highest Impact', 'Highest Urgency', 'Best Impact/Effort', 'Lowest Effort'].map((sort, i) => <button key={sort} className={`rounded-md px-2 py-1 ${i === 0 ? 'bg-secondary text-foreground' : 'hover:text-foreground'}`}>{sort}</button>)}</div>}>Top Recommendations</SectionTitle><div className="grid gap-4 xl:grid-cols-3">{recommendations.map(rec => <article key={rec.id} className={`rounded-xl border border-border/[.08] border-l-2 ${rec.priority === 'High' ? 'border-l-border' : 'border-l-border'} bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:border-border`}><div className="flex items-center justify-between"><Badge className={rec.priority === 'High' ? 'bg-secondary/15 text-foreground' : 'bg-secondary/15 text-foreground'}>{rec.priority} priority</Badge><button aria-label="More options" className="text-foreground hover:text-foreground"><MoreHorizontal size={17} /></button></div><h3 className="mt-4 text-base font-semibold leading-6 text-foreground">{rec.title}</h3><Badge className="mt-2 bg-card/60 text-foreground">{rec.area}</Badge><p className="mt-3 text-sm leading-5 text-muted-foreground">{rec.text}</p><div className="mt-4 flex flex-wrap gap-1.5"><Badge className="bg-secondary/10 text-foreground"><span className="mr-1 text-[10px] text-foreground/70">Estimated</span>{rec.impact}</Badge><Badge className="bg-secondary/10 text-foreground">Confidence {rec.confidence}</Badge><Badge className="bg-chart-5/10 text-chart-5">Urgency {rec.urgency}</Badge><Badge className="bg-card text-foreground">Effort {rec.effort}</Badge></div><div className="mt-5 flex flex-wrap gap-2"><button onClick={() => setSelected(rec.id)} className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-secondary">Review</button><button onClick={() => setApproved(true)} className="rounded-md border border-chart-4/40 px-2.5 py-1.5 text-xs font-medium text-chart-4 hover:bg-chart-4/10">Approve</button><button onClick={() => setModal('reject')} className="rounded-md border border-chart-5/20 px-2.5 py-1.5 text-xs text-chart-5 hover:bg-chart-5/10">Reject</button><button onClick={() => setModal('task')} className="rounded-md border border-border px-2.5 py-1.5 text-xs text-foreground hover:bg-secondary">Create Task</button>{rec.ai && <button onClick={() => setModal('execute')} className="rounded-md bg-gradient-to-r from-primary to-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground hover:brightness-110">Execute with AI</button>}</div></article>)}</div></section>
        <div className="mt-6 flex gap-2 overflow-x-auto border-b border-border/[.08] pb-2">{filters.map((filter, i) => <button key={filter} className={`flex shrink-0 items-center gap-1 rounded-md px-3 py-2 text-xs ${i === 0 ? 'bg-secondary/15 text-foreground' : 'text-foreground hover:bg-secondary hover:text-foreground'}`}>{filter}{i > 0 && <ChevronDown size={12} />}</button>)}</div>
        <section className="mt-8"><SectionTitle action={<button className="text-xs text-foreground hover:text-foreground"><Filter size={14} className="mr-1 inline" /> Filters</button>}>Recommendations</SectionTitle><div className="overflow-x-auto rounded-xl border border-border/[.08] bg-[var(--secondary)]"><div className="flex min-w-[900px] border-b border-border/[.08] px-4 pt-3">{['Active (12)', 'Completed (28)', 'Dismissed (6)', 'Saved (3)'].map(name => <button key={name} onClick={() => setTab(name)} className={`border-b-2 px-4 pb-3 text-xs font-medium ${tab === name ? 'border-border text-foreground' : 'border-transparent text-foreground'}`}>{name}</button>)}</div>{tab === 'Active (12)' ? <table className="w-full min-w-[900px] text-left text-xs"><thead className="text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Recommendation', 'Area', 'Priority', 'Impact', 'Confidence', 'Urgency', 'Effort', 'Status', ''].map(head => <th key={head} className="px-4 py-3 font-medium">{head}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row[0]} className="border-t border-border/[.06] hover:bg-secondary"><td className="px-4 py-3.5 font-medium text-foreground">{row[0]}</td><td className="px-4 py-3.5 text-muted-foreground">{row[1]}</td><td className="px-4 py-3.5"><Badge className={row[2] === 'High' ? 'bg-secondary/15 text-foreground' : row[2] === 'Medium' ? 'bg-secondary/15 text-foreground' : 'bg-card text-muted-foreground'}>{row[2]}</Badge></td><td className="px-4 py-3.5 text-foreground"><span className="mr-1 text-[9px] text-foreground/70">Est.</span>{row[3]}</td><td className="px-4 py-3.5 text-muted-foreground">{row[4]}</td><td className="px-4 py-3.5 text-muted-foreground">{row[5]}</td><td className="px-4 py-3.5 text-muted-foreground">{row[6]}</td><td className="px-4 py-3.5"><Badge className={row[7] === 'Approved' ? 'bg-chart-4/15 text-chart-4' : row[7] === 'New' ? 'bg-secondary/15 text-foreground' : 'bg-card text-foreground'}>{row[7]}</Badge></td><td className="px-4"><button aria-label={`Open ${row[0]}`} className="text-foreground hover:text-foreground"><ChevronRight size={16} /></button></td></tr>)}</tbody></table> : <div className="p-8 text-center text-sm text-muted-foreground">{tab.replace(/ \(.*\)/, '')} recommendations will appear here with their complete history and outcomes.</div>}</div></section>
        {selected === 'paid-spend' && <section className="mt-8 rounded-xl border border-border/[.08] bg-[var(--card)] p-5 md:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><Badge className="bg-secondary/15 text-foreground"><Sparkles size={12} className="mr-1" /> AI Recommended</Badge><span className="text-xs text-muted-foreground">Recommendation detail</span></div><h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">Reduce Inefficient Paid Acquisition Spend</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Review inefficient campaigns before increasing spend. Lulu AI recommends reallocating budget toward the channels and audiences showing stronger incremental returns.</p></div><button onClick={() => setSelected('')} aria-label="Close detail" className="rounded-md p-2 text-foreground hover:bg-secondary hover:text-foreground"><X size={18} /></button></div><div className="mt-8 grid gap-7 xl:grid-cols-[1.2fr_.8fr]"><div><h3 className="mb-3 text-sm font-semibold text-foreground">Why Lulu AI Recommends This <Badge className="ml-2 bg-secondary/15 text-foreground">AI-generated interpretation</Badge></h3><p className="text-sm leading-6 text-muted-foreground">Advertising spend increased significantly while attributed revenue growth remained comparatively lower. Several campaigns also show declining efficiency metrics over the past 6 weeks.</p><h3 className="mb-3 mt-7 text-sm font-semibold text-foreground">Supporting Evidence</h3><div className="grid gap-3 md:grid-cols-3">{[['Ad Spend / Revenue Ratio', '4.2x', '3.1x', '+35%', 'Last 30 days', 'Observed'], ['Campaign ROAS', '1.8x', '2.6x', '−31%', 'Last 6 weeks', 'Calculated'], ['CPC spike detected', '+42%', 'above baseline', '', 'Current', 'Observed']].map(e => <div key={e[0]} className="rounded-lg border border-border/[.08] bg-[var(--secondary)] p-3"><div className="flex justify-between"><span className="text-xs font-medium text-foreground">{e[0]}</span><Badge className={e[5] === 'Observed' ? 'bg-secondary/10 text-foreground' : 'bg-secondary/10 text-foreground'}>{e[5]}</Badge></div><strong className="mt-3 block text-xl text-foreground">{e[1]}</strong><p className="mt-1 text-[11px] text-muted-foreground">Previous {e[2]} <span className="ml-2 text-chart-5">{e[3]}</span></p><p className="mt-2 text-[11px] text-muted-foreground">{e[4]}</p><div className="mt-3 flex gap-2"><button className="text-[11px] text-foreground">View Analysis</button><button className="text-[11px] text-foreground">Open Source</button></div></div>)}</div><h3 className="mb-3 mt-7 text-sm font-semibold text-foreground">Recommendation Logic</h3><div className="rounded-lg border border-border/15 bg-secondary/[.06] p-4 text-sm">{[['Observed', 'Advertising spend increased +38% MoM'], ['Pattern', 'Efficiency declined across 4 campaigns'], ['Impact', 'Customer acquisition cost increased +29%'], ['Recommendation', 'Review inefficient campaigns before increasing spend']].map((item, i) => <div key={item[0]} className="flex items-center gap-3 py-2"><Badge className="w-28 justify-center bg-secondary text-foreground">{item[0]}</Badge><span className="text-foreground">{item[1]}</span>{i < 3 && <span className="absolute" />}</div>)}</div></div><div><h3 className="mb-3 text-sm font-semibold text-foreground">Related Business Goals</h3><div className="flex flex-wrap gap-2"><Badge className="bg-chart-4/10 text-chart-4">Reduce Costs ✓</Badge><Badge className="bg-chart-4/10 text-chart-4">Improve Marketing ✓</Badge><Badge className="bg-chart-4/10 text-chart-4">Increase Revenue ✓</Badge></div><p className="mt-3 text-xs leading-5 text-muted-foreground">This recommendation directly supports margin improvement while preserving growth capacity in your highest-performing channels.</p><div className="mt-7 rounded-lg border border-border/[.08] bg-[var(--secondary)] p-4"><h3 className="text-sm font-semibold text-foreground">AI Action Plan</h3>{[['Identify underperforming campaigns', 'AI', 'Pending'], ['Compare campaign attribution data', 'AI', 'Pending'], ['Review audience performance', 'AI', 'Pending'], ['Recommend budget reallocation', 'AI', 'Pending'], ['Apply approved changes', 'Human Approval Required', 'Awaiting']].map((step, i) => <div key={step[0]} className="flex gap-3 border-b border-border/[.06] py-3 last:border-0"><span className="font-mono text-xs text-foreground">0{i + 1}</span><div className="flex-1"><p className="text-xs text-foreground">{step[0]}</p><p className="mt-1 text-[10px] text-muted-foreground">{step[1]}</p></div><Badge className="bg-card text-muted-foreground">{step[2]}</Badge></div>)}</div><div className="mt-5 rounded-lg border border-border/[.08] bg-[var(--secondary)] p-4"><h3 className="text-sm font-semibold text-foreground">Approval</h3>{approved && <div className="my-3 rounded-md bg-chart-4/10 px-3 py-2 text-xs text-chart-4">✓ Recommendation approved</div>}<div className="mt-4 flex flex-wrap gap-2"><button onClick={() => setApproved(true)} className="rounded-md bg-gradient-to-r from-chart-4 to-primary px-3 py-2 text-xs font-semibold text-foreground">Approve Recommendation</button><button onClick={() => setModal('defer')} className="rounded-md border border-border px-3 py-2 text-xs text-foreground">Defer</button><button onClick={() => setModal('reject')} className="rounded-md border border-chart-5/20 px-3 py-2 text-xs text-chart-5">Reject</button></div>{approved && <div className="mt-3 flex gap-2"><button onClick={() => setModal('task')} className="text-xs text-foreground">Create AI Task</button><button onClick={() => setModal('execute')} className="text-xs text-foreground">Execute with AI</button></div>}</div></div></div></section>}
        <section className="mt-8 grid gap-4 lg:grid-cols-2"><div className="rounded-xl border border-border/[.08] bg-[var(--secondary)] p-5"><SectionTitle>Execution States</SectionTitle><div className="flex flex-wrap gap-2">{states.map(state => <Badge key={state[0]} className={state[1]}>{state[0] === 'Executing' && <span className="mr-1 h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />}{state[0]}</Badge>)}</div><div className="mt-5 border-t border-border/[.06] pt-4"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-foreground">AI Execution Result</h3><Badge className="bg-chart-4/10 text-chart-4">Completed ✓</Badge></div><p className="mt-3 text-sm text-foreground">Paused 3 underperforming campaigns</p><p className="mt-2 text-xs text-muted-foreground">Budget reduced on 3 campaigns · Today 09:42 AM · Google Ads</p><div className="mt-3 rounded-md bg-chart-4/[.07] p-3 text-xs text-foreground">Observed Result <strong className="ml-2 text-foreground">CPC reduced from $4.20 to $2.90</strong></div></div></div><div className="rounded-xl border border-border/[.08] bg-[var(--secondary)] p-5"><SectionTitle>Recommendation Outcome</SectionTitle><div className="flex items-center justify-between text-center text-[11px] text-muted-foreground">{['Recommendation', 'Action', 'Execution', 'Business Result', 'Outcome'].map((label, i) => <div key={label} className="flex flex-1 flex-col items-center gap-2"><div className={`h-2.5 w-2.5 rounded-full ${i < 3 ? 'bg-primary' : 'bg-primary'}`} /><span>{label}</span>{i < 4 && <span className="absolute" />}</div>)}</div><div className="mt-7 flex items-center justify-between border-t border-border/[.06] pt-4"><span className="text-xs text-muted-foreground">Current outcome</span><Badge className="bg-chart-4/10 text-chart-4">Positive</Badge></div><div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">Was this recommendation useful?<button className="rounded-md border border-border p-1.5 hover:text-foreground" aria-label="Helpful"><ThumbsUp size={14} /></button><button className="rounded-md border border-border p-1.5 hover:text-foreground" aria-label="Not helpful"><ThumbsDown size={14} /></button></div></div></section>
        <section className="mt-8 rounded-xl border border-border/20 bg-gradient-to-br from-secondary/15 to-secondary/[.05] p-6"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary/20 text-foreground"><Sparkles size={18} /></div><div><h2 className="text-lg font-semibold text-foreground">Ask Lulu AI</h2><p className="text-xs text-muted-foreground">Get context-aware answers about your recommendations.</p></div></div><div className="mt-5 flex rounded-lg border border-border bg-[var(--secondary)] p-2"><input aria-label="Ask Lulu AI" placeholder="Ask Lulu AI about your recommendations..." className="flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground" /><button aria-label="Send question" className="rounded-md bg-primary p-2 text-primary-foreground hover:bg-primary"><Send size={16} /></button></div><div className="mt-3 flex flex-wrap gap-2">{['Which recommendation should I do first?', 'Which has the highest potential impact?', 'Why did you recommend this?', 'What evidence supports this?', 'Which reduce costs?', 'Which are safe to automate?'].map(prompt => <button key={prompt} className="rounded-full border border-border px-3 py-1.5 text-[11px] text-foreground hover:border-border/40 hover:text-foreground">{prompt}</button>)}</div></section>
        <section className="mt-8 grid gap-4 xl:grid-cols-2"><div className="rounded-xl border border-border/[.08] bg-[var(--secondary)] p-5"><SectionTitle>Recommendation History</SectionTitle><div className="space-y-4">{[['Recommendation generated', 'AI', '2 hours ago'], ['Viewed', 'User', '1 hour ago'], ['Approved', 'User', '48 min ago'], ['Task created', 'User', '42 min ago'], ['AI execution started', 'AI', '18 min ago'], ['Outcome recorded', 'AI', 'Today, 09:42 AM']].map(event => <div key={event[0]} className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-primary ring-4 ring-ring/10 text-primary-foreground" /><p className="flex-1 text-xs text-foreground">{event[0]} <span className="text-muted-foreground">· {event[1]}</span></p><span className="text-[11px] text-muted-foreground">{event[2]}</span></div>)}</div></div><div className="rounded-xl border border-border/[.08] bg-[var(--secondary)] p-5"><SectionTitle>Recommendation Sources</SectionTitle><div className="space-y-3">{[['Google Ads', '2 min ago', 'Excellent', 'Advertising'], ['CRM', '15 min ago', 'Good', 'Customers, Sales'], ['Ecommerce Platform', '1 hr ago', 'Good', 'Ecommerce'], ['Finance', '4 hrs ago', 'Limited', 'Finance']].map(source => <div key={source[0]} className="flex items-center gap-3 border-b border-border/[.06] pb-3 last:border-0"><div className="flex-1"><p className="text-xs font-medium text-foreground">{source[0]}</p><p className="mt-1 text-[10px] text-muted-foreground">{source[1]} · {source[3]}</p></div><Badge className={source[2] === 'Excellent' ? 'bg-secondary/10 text-foreground' : source[2] === 'Limited' ? 'bg-secondary/10 text-foreground' : 'bg-secondary/10 text-foreground'}>{source[2]}</Badge><span className="text-foreground">{source[2] === 'Limited' ? '⚠' : '✓'}</span></div>)}</div><p className="mt-4 rounded-md bg-secondary/10 px-3 py-2 text-[11px] leading-5 text-foreground">Recommendation quality may be limited because Finance data is more than 4 hours old.</p></div></section>
        <section className="mt-8 pb-12"><SectionTitle>Data States</SectionTitle><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[['Loading skeleton state', 'Analyzing your business context…'], ['Empty', 'No recommendations available. Lulu AI has not identified any significant actions requiring attention right now.'], ['Insufficient Data', 'Not enough data. More business data is required to generate reliable recommendations.'], ['Restricted', 'AI Recommendations access restricted. You don’t have permission to view this information.']].map(state => <div key={state[0]} className="rounded-lg border border-border/[.08] bg-[var(--secondary)] p-4"><p className="text-xs font-semibold text-foreground">{state[0]}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{state[1]}</p></div>)}</div></section>
      </div>
    </section>
    {modal && <div className="fixed inset-0 z-20 grid place-items-center bg-primary/60 p-5"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl border border-border bg-[var(--secondary)] p-6 shadow-2xl shadow-black/50"><div className="flex items-start justify-between"><div><h2 className="text-xl font-semibold text-foreground">{modal === 'reject' ? 'Reject Recommendation' : modal === 'defer' ? 'Defer Recommendation' : modal === 'execute' ? 'Execute Recommendation' : 'Create AI Task'}</h2><p className="mt-1 text-sm text-muted-foreground">{modal === 'reject' ? 'Why are you rejecting this recommendation?' : modal === 'defer' ? 'Choose when Lulu AI should revisit this recommendation.' : modal === 'execute' ? 'Review action permissions before autonomous execution.' : 'Turn this recommendation into an actionable task.'}</p></div><button onClick={() => setModal(null)} aria-label="Close modal" className="text-foreground hover:text-foreground"><X size={18} /></button></div>{modal === 'reject' && <div className="mt-5 space-y-2">{['Not relevant', 'Already addressed', 'Incorrect', 'Not feasible', 'Too expensive', 'Not a priority', 'Other'].map(option => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-md border border-border/[.06] px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"><input type="radio" name="reject" /> {option}</label>)}<textarea placeholder="Add comment (optional)" className="mt-3 h-20 w-full rounded-md border border-border bg-[var(--secondary)] p-3 text-sm text-foreground outline-none" /></div>}{modal === 'defer' && <div className="mt-5 grid grid-cols-2 gap-2">{['Tomorrow', 'Next Week', 'Next Month', 'Custom Date'].map(option => <button key={option} className="rounded-md border border-border p-3 text-sm text-foreground hover:border-border/60 hover:text-foreground">{option}</button>)}</div>}{modal === 'execute' && <div className="mt-5 space-y-3 text-sm"><div className="rounded-md bg-secondary/10 p-3 text-foreground">Action: Pause underperforming campaigns<br />Target: Paid acquisition campaigns<br />Expected impact: Estimated +$24K/mo savings</div><p className="rounded-md bg-secondary/10 p-3 text-xs leading-5 text-foreground">Autonomous execution follows your AI policy. Lulu AI will only apply approved, reversible changes.</p></div>}{modal === 'task' && <div className="mt-5 space-y-3"><label className="block text-xs text-muted-foreground">Task name<input defaultValue="Reduce inefficient paid acquisition spend" className="mt-1 w-full rounded-md border border-border bg-[var(--secondary)] p-2.5 text-sm text-foreground outline-none" /></label><label className="block text-xs text-muted-foreground">Owner<input placeholder="Assign an owner" className="mt-1 w-full rounded-md border border-border bg-[var(--secondary)] p-2.5 text-sm text-foreground outline-none" /></label><label className="block text-xs text-muted-foreground">Description<textarea defaultValue="Review inefficient campaigns and recommend budget reallocation." className="mt-1 h-20 w-full rounded-md border border-border bg-[var(--secondary)] p-2.5 text-sm text-foreground outline-none" /></label></div>}<div className="mt-6 flex justify-end gap-2"><button onClick={() => setModal(null)} className="rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary">Cancel</button><button onClick={() => {
            setModal(null);
            if (modal === 'execute' || modal === 'task') setApproved(true);
          }} className={`rounded-md px-3 py-2 text-sm font-semibold text-primary-foreground ${modal === 'reject' ? 'bg-destructive hover:bg-destructive' : 'bg-gradient-to-r from-primary to-primary hover:brightness-110'}`}>{modal === 'reject' ? 'Reject Recommendation' : modal === 'execute' ? 'Confirm & Execute' : modal === 'task' ? 'Create AI Task' : 'Defer Recommendation'}</button></div></div></div>}
  </main>;
};

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
