import { useState } from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Bot, ChevronDown, ChevronRight, CircleHelp, Clock3, Database, Download, ExternalLink, FileText, Filter, GitBranch, Grid2X2, Heart, Lightbulb, ListFilter, Menu, MoreHorizontal, Plus, RefreshCw, Search, Settings2, Share2, Sparkles, Target, TrendingUp, Users, X, Zap } from 'lucide-react';
type Tab = 'Active' | 'Captured' | 'Dismissed' | 'Saved';
type Modal = 'recommendation' | 'strategy' | 'task' | null;
const navSections = [{
  label: 'Workspace',
  items: [{
    icon: Grid2X2,
    label: 'Overview'
  }, {
    icon: Activity,
    label: 'Command Center'
  }]
}, {
  label: 'Intelligence',
  items: [{
    icon: Lightbulb,
    label: 'AI Intelligence',
    child: 'Opportunities'
  }, {
    icon: BarChart3,
    label: 'Analytics'
  }, {
    icon: TrendingUp,
    label: 'Forecasts'
  }]
}, {
  label: 'Business',
  items: [{
    icon: Users,
    label: 'Customers'
  }, {
    icon: Target,
    label: 'Sales'
  }, {
    icon: Zap,
    label: 'Marketing'
  }, {
    icon: Database,
    label: 'Operations'
  }]
}, {
  label: 'Manage',
  items: [{
    icon: FileText,
    label: 'Reports'
  }, {
    icon: Settings2,
    label: 'Settings'
  }]
}];
const stats = [{
  value: '17',
  label: 'Active Opportunities',
  color: 'text-primary-foreground'
}, {
  value: '5',
  label: 'High-Value',
  color: 'text-foreground',
  dot: 'bg-primary'
}, {
  value: '3',
  label: 'New',
  color: 'text-foreground',
  dot: 'bg-primary'
}, {
  value: '4',
  label: 'Pursuing',
  color: 'text-foreground',
  dot: 'bg-primary'
}, {
  value: '22',
  label: 'Captured',
  color: 'text-foreground',
  dot: 'bg-primary'
}, {
  value: '8',
  label: 'Dismissed',
  color: 'text-muted-foreground',
  dot: 'bg-secondary'
}, {
  value: '18 min',
  label: 'Last Analysis',
  color: 'text-foreground'
}, {
  value: 'Excellent',
  label: 'Data Freshness',
  color: 'text-foreground',
  dot: 'bg-primary'
}];
const opportunities = [{
  title: 'High-Value Customer Expansion',
  type: 'Customer',
  area: 'Customers / Revenue',
  potential: 'Estimated High',
  confidence: 'High',
  urgency: 'High',
  effort: 'Medium',
  access: 'Immediately Actionable',
  status: 'Validated',
  explanation: 'A segment of high-value customers has strong repeat purchase behavior but low adoption of complementary products frequently purchased by similar customers.',
  accent: 'violet'
}, {
  title: 'Advertising Budget Reallocation',
  type: 'Advertising',
  area: 'Advertising',
  potential: 'Est. +$18K/mo',
  confidence: 'High',
  urgency: 'Immediate',
  effort: 'Low',
  access: 'Immediately Actionable',
  status: 'Validated',
  explanation: 'Three campaigns are significantly underperforming while two high-ROAS campaigns remain underfunded.',
  accent: 'amber'
}, {
  title: 'SEO Content Gap Opportunity',
  type: 'Marketing',
  area: 'Marketing',
  potential: 'Estimated Medium',
  confidence: 'Medium',
  urgency: 'High',
  effort: 'Medium',
  access: 'Easily Actionable',
  status: 'Detected',
  explanation: 'Competitor analysis reveals 40+ high-volume keyword gaps where the business currently has no ranking content.',
  accent: 'indigo'
}];
const rows = [['High-Value Customer Expansion', 'Customer', 'Customers / Revenue', 'Estimated High', 'High', 'High', 'Medium', 'Validated'], ['Advertising Budget Reallocation', 'Advertising', 'Advertising', 'Est. +$18K/mo', 'High', 'Immediate', 'Low', 'Validated'], ['SEO Content Gap', 'Marketing', 'Marketing', 'Est. Medium', 'Medium', 'High', 'Medium', 'Detected'], ['Cart Abandonment Recovery', 'Ecommerce', 'Ecommerce', 'Est. +6% conversion', 'High', 'High', 'Low', 'Validated'], ['Stalled Pipeline Reactivation', 'Sales', 'Sales', 'Est. Medium', 'Medium', 'Normal', 'Low', 'Reviewing'], ['Process Automation — Order Fulfillment', 'Operations', 'Operations', 'Est. High efficiency gain', 'Medium', 'Normal', 'High', 'Needs Validation'], ['Geographic Expansion — Southern Markets', 'Market', 'Revenue', 'Est. Medium', 'Low', 'Low', 'High', 'Detected'], ['Customer Reactivation — Lapsed Segment', 'Customer', 'Customers', 'Est. Low-Medium', 'Medium', 'Normal', 'Low', 'Detected']];
const filters = ['All (17)', 'Opportunity Type', 'Business Area', 'Potential Impact', 'Confidence', 'Urgency', 'Effort', 'Accessibility', 'Status', 'Source', 'Saved', 'Opportunity Window', 'Date'];
const prompts = ['What is my biggest opportunity?', 'Which has the highest revenue potential?', 'Which are easiest to capture?', 'Which are time-sensitive?', 'Where am I leaving money on the table?', 'Which should I pursue first?', 'Compare my top opportunities.', 'Create a strategy for this opportunity.'];
const tag = (text: string, tone = 'slate') => <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium ${tone === 'green' ? 'border-chart-4/20 bg-chart-4/10 text-chart-4' : tone === 'amber' ? 'border-chart-1/20 bg-chart-1/10 text-chart-1' : tone === 'violet' ? 'border-border/25 bg-secondary/15 text-foreground' : tone === 'blue' ? 'border-border/20 bg-secondary/10 text-foreground' : tone === 'indigo' ? 'border-border/20 bg-secondary/10 text-foreground' : 'border-border bg-secondary text-foreground'}`}>{text}</span>;
export const LuluOpportunities = () => {
  const [tab, setTab] = useState<Tab>('Active');
  const [modal, setModal] = useState<Modal>(null);
  const [detail, setDetail] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  return <div className="min-h-screen bg-[var(--background)] text-foreground font-sans selection:bg-secondary/30">
    <aside className={`${mobileNav ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-64 border-r border-border bg-[var(--sidebar)] p-5 transition-transform lg:translate-x-0`}><div className="mb-5 flex items-center gap-3 px-2 py-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">L</div><span className="font-semibold text-foreground">Lulu AI</span></div><LuluSectionNavigation activeId="happily-brook-7061" /></aside>
    <main className="lg:pl-64"><header className="sticky top-0 z-20 border-b border-border bg-[var(--card)]/90 px-5 py-4 backdrop-blur-xl md:px-8"><div className="flex items-center gap-3"><button className="text-foreground lg:hidden" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex"><span>Intelligence</span><ChevronRight size={13} /><span>AI Intelligence</span><ChevronRight size={13} /><span className="text-foreground">Opportunities</span></div><div className="ml-auto flex items-center gap-3"><button className="hidden rounded-lg border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary md:flex"><Bell size={14} className="mr-2" />Notifications</button><button className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-primary text-xs font-semibold text-primary-foreground">AR</button></div></div></header>
      <div className="mx-auto max-w-[1600px] px-5 py-8 md:px-8"><section className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="mb-3 flex items-center gap-2 text-xs font-medium text-foreground"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary text-primary-foreground" /> AI INTELLIGENCE</p><h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Opportunities</h1><p className="mt-3 max-w-xl text-sm text-muted-foreground">Discover the highest-value opportunities Lulu AI has identified across your business.</p></div><div className="flex flex-wrap gap-2"><button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-black/40 hover:brightness-110"><Sparkles size={15} /> Ask Lulu AI</button><button className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2.5 text-xs text-foreground hover:bg-secondary"><RefreshCw size={14} /> Refresh</button><button className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-xs text-foreground hover:bg-secondary md:flex"><FileText size={14} /> Create Report</button><button className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-xs text-foreground hover:bg-secondary md:flex"><Download size={14} /> Export</button></div></section>
        <div className="relative mb-6 max-w-2xl"><Search className="absolute left-3.5 top-3 text-muted-foreground" size={16} /><input aria-label="Search opportunities" placeholder="Search opportunities, customers, products, markets..." className="w-full rounded-xl border border-border bg-[var(--secondary)] py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-border/60 focus:ring-2 focus:ring-ring/10" /></div>
        <section className="mb-6 grid grid-cols-2 overflow-hidden rounded-xl border border-border bg-[var(--card)] sm:grid-cols-4 xl:grid-cols-8">{stats.map(stat => <div key={stat.label} className="border-b border-r border-border px-4 py-4 xl:border-b-0"><div className="flex items-center gap-2">{stat.dot && <span className={`h-1.5 w-1.5 rounded-full ${stat.dot} ${stat.label === 'New' ? 'animate-pulse' : ''}`} />}<strong className={`text-lg ${stat.color}`}>{stat.value}</strong></div><p className="mt-1 text-[10px] leading-tight text-muted-foreground">{stat.label}</p></div>)}</section>
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-border/20 bg-secondary/[0.08] px-4 py-3 text-sm text-foreground"><Bot size={17} className="text-foreground" /><span>Lulu AI has identified <strong>17 active opportunities</strong> across 8 business areas.</span><span className="ml-auto hidden text-xs text-foreground md:block">Analysis updated 18 min ago</span></div>
        <section className="mb-8 rounded-xl border border-border border-l-2 border-l-border bg-[var(--card)] p-5 shadow-2xl shadow-black/10"><div className="mb-4 flex flex-wrap items-center gap-3"><h2 className="text-lg font-semibold text-foreground">AI Opportunity Summary</h2>{tag('AI-generated', 'violet')}</div><p className="max-w-4xl text-sm leading-7 text-foreground">The largest current opportunity is customer expansion within the existing high-value customer base. Lulu AI estimates that targeted upsell activity could represent meaningful additional revenue, subject to validation. Two advertising opportunities and one SEO opportunity also show strong supporting evidence.</p><div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground"><span className="font-semibold text-foreground">Estimated Potential</span><span>≠</span><span className="font-semibold text-foreground">Observed Result</span><span className="text-muted-foreground">•</span><span>Estimates are directional until validated by outcomes.</span></div></section>
        <section className="mb-8"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-semibold text-foreground">Top Opportunities</h2><p className="mt-1 text-xs text-muted-foreground">Prioritized by Lulu AI across potential, confidence, and effort.</p></div><button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-foreground"><ListFilter size={14} /> Highest Potential <ChevronDown size={13} /></button></div><div className="grid gap-4 xl:grid-cols-3">{opportunities.map((opportunity, opportunityIndex) => <article key={opportunity.title} className="group rounded-xl border border-border bg-[var(--card)] p-5 transition duration-200 hover:-translate-y-1 hover:border-border/30 hover:shadow-xl hover:shadow-black/20"><div className="mb-4 flex items-start justify-between"><div><div className="mb-2 flex flex-wrap gap-2">{tag(opportunity.type + ' Opportunity', opportunity.accent)} {tag(opportunity.status, opportunity.status === 'Validated' ? 'green' : 'indigo')}</div><h3 className="text-base font-semibold text-foreground">{opportunity.title}</h3><p className="mt-1 text-xs text-muted-foreground">{opportunity.area}</p></div><span className="rounded-md border border-border/20 bg-secondary/10 px-2 py-1 text-[10px] font-medium text-foreground">{opportunity.potential}</span></div><dl className="mb-4 grid grid-cols-3 gap-2 border-y border-border py-3 text-xs"><div><dt className="text-muted-foreground">Confidence</dt><dd className="mt-1 text-foreground">{opportunity.confidence}</dd></div><div><dt className="text-muted-foreground">Urgency</dt><dd className={`mt-1 ${opportunity.urgency === 'Immediate' ? 'animate-pulse text-chart-5' : 'text-foreground'}`}>{opportunity.urgency}</dd></div><div><dt className="text-muted-foreground">Effort</dt><dd className="mt-1 text-foreground">{opportunity.effort}</dd></div></dl><p className="min-h-[76px] text-xs leading-5 text-muted-foreground">{opportunity.explanation}</p><p className="mt-3 text-[11px] text-foreground">✓ {opportunity.access}</p><div className="mt-5 flex flex-wrap gap-2"><button onClick={() => setDetail(true)} className="rounded-md bg-secondary px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary">Explore</button><button onClick={() => setModal('recommendation')} className="rounded-md border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary">Create Recommendation</button><button onClick={() => setModal(opportunityIndex === 1 ? 'task' : 'strategy')} className="rounded-md border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary">{opportunityIndex === 1 ? 'Create Task' : 'Create Strategy'}</button></div></article>)}</div></section>
        <section className="mb-8 rounded-xl border border-border bg-[var(--card)] p-4"><div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1"><Filter size={15} className="shrink-0 text-muted-foreground" />{filters.map((filter, filterIndex) => <button key={filter} className={`flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] ${filterIndex === 0 ? 'border-border/40 bg-secondary/15 text-foreground' : 'border-border text-foreground hover:border-border'}`}>{filterIndex > 0 && filter !== 'Saved' && <ChevronDown size={11} />} {filter}</button>)}</div><div className="flex gap-1 border-b border-border">{(['Active', 'Captured', 'Dismissed', 'Saved'] as Tab[]).map(item => <button key={item} onClick={() => setTab(item)} className={`border-b-2 px-4 py-3 text-xs font-medium ${tab === item ? 'border-border text-foreground' : 'border-transparent text-foreground hover:text-foreground'}`}>{item} <span className="ml-1 text-muted-foreground">{item === 'Active' ? '17' : item === 'Captured' ? '22' : item === 'Dismissed' ? '8' : '4'}</span></button>)}</div>{tab === 'Active' && <div className="overflow-x-auto"><table className="w-full min-w-[950px] text-left text-xs"><thead><tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">{['Opportunity', 'Type', 'Business Area', 'Potential', 'Confidence', 'Urgency', 'Effort', 'Status', 'Actions'].map(header => <th key={header} className="px-3 py-3 font-medium">{header}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row[0]} className="border-b border-border transition hover:bg-secondary"><td className="px-3 py-3 font-medium text-foreground">{row[0]}</td><td className="px-3 py-3">{tag(row[1], row[1] === 'Advertising' ? 'amber' : row[1] === 'Customer' ? 'violet' : 'blue')}</td><td className="px-3 py-3 text-muted-foreground">{row[2]}</td><td className="px-3 py-3 text-foreground">{row[3]}</td><td className="px-3 py-3 text-foreground">{row[4]}</td><td className="px-3 py-3 text-foreground">{row[5]}</td><td className="px-3 py-3 text-foreground">{row[6]}</td><td className="px-3 py-3">{tag(row[7], row[7] === 'Validated' ? 'green' : row[7] === 'Detected' ? 'indigo' : 'blue')}</td><td className="px-3 py-3"><button onClick={() => setDetail(true)} className="text-foreground hover:text-foreground">Explore <ChevronRight size={12} className="inline" /></button></td></tr>)}</tbody></table></div>}{tab === 'Captured' && <div className="grid gap-3 p-3 md:grid-cols-2"><div className="rounded-lg border border-chart-4/15 bg-chart-4/5 p-4"><div className="mb-2 flex items-center justify-between"><strong className="text-sm">Cart Abandonment Recovery</strong>{tag('Observed Result', 'blue')}</div><p className="text-xs text-muted-foreground">Result: +4.8% conversion • Revenue: $12,400</p><p className="mt-2 text-[11px] text-muted-foreground">Captured · Aug 12, 2024</p></div><div className="rounded-lg border border-border p-4"><strong className="text-sm">Repeat purchase campaign</strong><p className="mt-2 text-xs text-muted-foreground">Estimated Potential → validating observed outcome</p></div></div>}{tab === 'Dismissed' && <div className="p-6 text-sm text-muted-foreground">Dismissed opportunities are archived with their reason, date, and the teammate who made the decision.</div>}{tab === 'Saved' && <div className="grid gap-3 p-3 md:grid-cols-2"><div className="rounded-lg border border-border p-4"><div className="flex justify-between"><strong>High-Value Customer Expansion</strong><Heart size={15} className="fill-foreground text-foreground" /></div><p className="mt-2 text-xs text-muted-foreground">Customers / Revenue · Saved today</p><div className="mt-4 flex gap-2"><button className="text-xs text-foreground">Open</button><button className="text-xs text-foreground">Share</button><button className="text-xs text-muted-foreground">Remove</button></div></div></div>}</section>
        {detail && <section className="mb-8 rounded-xl border border-border/20 bg-[var(--card)] p-5 md:p-7"><div className="flex flex-col justify-between gap-4 border-b border-border pb-5 md:flex-row md:items-start"><div><div className="mb-3 flex flex-wrap gap-2">{tag('Customer Opportunity', 'violet')} {tag('Validated', 'green')} {tag('AI Identified', 'violet')}</div><h2 className="text-2xl font-semibold text-foreground">High-Value Customer Expansion</h2><p className="mt-2 text-xs text-muted-foreground">Customers / Revenue <span className="mx-2">•</span> Confidence: <span className="text-foreground">High</span> <span className="mx-2">•</span> Urgency: <span className="text-foreground">High</span> <span className="mx-2">•</span> Effort: Medium</p></div><div className="flex gap-2"><button onClick={() => setModal('recommendation')} className="rounded-lg bg-gradient-to-r from-primary to-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Create Recommendation</button><button onClick={() => setDetail(false)} className="rounded-lg border border-border p-2 text-foreground hover:text-foreground" aria-label="Close detail"><X size={15} /></button></div></div><div className="grid gap-6 py-6 lg:grid-cols-[1.1fr_1fr]"><div><div className="mb-3 flex items-center gap-2"><h3 className="font-semibold">Opportunity</h3>{tag('AI-generated', 'violet')}</div><p className="text-sm leading-7 text-foreground">A segment of high-value customers has purchased repeatedly but has not purchased several complementary products that are frequently purchased by similar customers. This behavioral gap suggests an underexploited cross-sell opportunity within an already-engaged customer base.</p><h3 className="mb-3 mt-7 font-semibold">Why Lulu AI Identified This Opportunity</h3><div className="space-y-2 rounded-xl border border-border bg-[var(--secondary)] p-4">{[['Observed', 'High-value customers show strong repeat purchasing (avg. 4.2 orders/yr)', 'blue'], ['Gap', 'Complementary product adoption: 12% vs 41% in similar cohort', 'amber'], ['Potential', 'Cross-sell activity may increase customer LTV', 'green'], ['AI Identified', 'Targeted cross-sell engagement for high-value segment', 'violet']].map((flow, flowIndex) => <div key={flow[0]}><div className="flex items-start gap-3"><span className={`mt-0.5 rounded px-2 py-1 text-[10px] font-semibold ${flow[2] === 'amber' ? 'bg-chart-1/15 text-chart-1' : flow[2] === 'violet' ? 'bg-secondary/15 text-foreground' : 'bg-secondary/15 text-foreground'}`}>{flow[0]}</span><p className="text-xs leading-5 text-foreground">{flow[1]}</p></div>{flowIndex < 3 && <div className="ml-4 h-3 border-l border-dashed border-border" />}</div>)}</div></div><div><h3 className="mb-3 font-semibold">Supporting Evidence</h3><div className="space-y-2">{[['Repeat Purchase Rate', '68% current · 52% benchmark · +16pp', 'CRM'], ['Complementary Product Adoption', '12% current · 41% cohort · -29pp', 'Calculated'], ['High-Value Segment LTV', '$3,240 avg · ↑ trend', 'Observed'], ['Purchase frequency', 'Accelerating · last 90 days', 'Calculated']].map(evidence => <div key={evidence[0]} className="rounded-lg border border-border bg-[var(--secondary)] p-3"><div className="flex items-center justify-between"><strong className="text-xs">{evidence[0]}</strong>{tag(evidence[2], evidence[2] === 'Observed' ? 'blue' : 'violet')}</div><p className="mt-1 text-xs text-muted-foreground">{evidence[1]}</p><div className="mt-2 flex gap-3 text-[11px] text-foreground"><button>View Analysis</button><button>Open Source <ExternalLink size={10} className="inline" /></button></div></div>)}</div></div></div><div className="grid gap-4 border-t border-border pt-6 md:grid-cols-2 lg:grid-cols-4"><div><h3 className="mb-3 text-sm font-semibold">Related Metrics</h3>{[['Customer Lifetime Value', '↑ +18%', 'Observed'], ['Repeat Purchase Rate', '↑ +16pp', 'Observed'], ['Cross-Sell Adoption', '↓ -29pp', 'Calculated'], ['Retention Rate', '↑ +4%', 'Observed']].map(metric => <div key={metric[0]} className="flex justify-between border-b border-border py-2 text-xs"><span className="text-muted-foreground">{metric[0]}</span><span className="text-chart-4">{metric[1]}</span></div>)}</div><div><h3 className="mb-3 text-sm font-semibold">Cross-Module Evidence</h3><p className="text-xs leading-6 text-muted-foreground">Customers → 4.2 avg orders/yr<br />Products → low complementary adoption<br />Revenue → 42% of total revenue<br /><strong className="text-foreground">AI Intelligence → opportunity detected</strong></p></div><div><h3 className="mb-3 text-sm font-semibold">Market Context</h3><p className="text-xs leading-6 text-muted-foreground">Complementary products show growing demand <span className="text-chart-4">+12% YoY</span>.<br />Industry benchmark: 38% adoption vs business at 12%.</p></div><div><h3 className="mb-3 text-sm font-semibold">Opportunity Window</h3><p className="text-xs leading-6 text-muted-foreground">Earliest action: <strong className="text-foreground">Immediately</strong><br />Estimated window: 3–6 months<br /><span className="text-foreground">High time sensitivity</span></p>{tag('Estimated', 'amber')}</div></div></section>}
        <section className="mb-8 grid gap-4 xl:grid-cols-2"><div className="rounded-xl border border-border bg-[var(--secondary)] p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Opportunity Comparison</h2>{tag('AI summary', 'violet')}</div><div className="overflow-x-auto"><table className="w-full min-w-[500px] text-xs"><thead><tr className="text-left text-muted-foreground"><th className="pb-3">Dimension</th><th className="pb-3 text-foreground">Customer Expansion</th><th className="pb-3 text-foreground">Ad Reallocation</th></tr></thead><tbody>{[['Potential Impact', 'High', '+$18K/mo'], ['Confidence', 'High', 'High'], ['Urgency', 'High', 'Immediate'], ['Effort', 'Medium', 'Low'], ['Accessibility', 'Immediately Actionable', 'Immediately Actionable'], ['Risk', 'Low', 'Low'], ['Time Window', '3–6 months', 'Immediate']].map(item => <tr key={item[0]} className="border-t border-border"><td className="py-2.5 text-muted-foreground">{item[0]}</td><td className="py-2.5 text-foreground">{item[1]}</td><td className="py-2.5 text-foreground">{item[2]}</td></tr>)}</tbody></table></div><p className="mt-4 text-xs leading-5 text-muted-foreground">Opportunity A has higher long-term potential impact, while Opportunity B is easier to capture immediately and requires significantly less effort.</p></div><div className="rounded-xl border border-border/20 bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary)] p-5"><div className="mb-3 flex items-center gap-2"><Bot size={18} className="text-muted-foreground" /><h2 className="text-lg font-semibold">Ask Lulu AI</h2></div><p className="mb-4 text-xs text-muted-foreground">Ask a question about your opportunities and get an evidence-backed answer.</p><div className="relative"><input placeholder="Ask Lulu AI about your opportunities..." className="w-full rounded-lg border border-border bg-primary/20 px-3 py-3 pr-10 text-xs outline-none focus:border-border" /><button className="absolute right-2 top-2 rounded-md bg-primary p-1.5 text-primary-foreground" aria-label="Send question"><ArrowUpRight size={14} /></button></div><div className="mt-4 flex flex-wrap gap-2">{prompts.slice(0, 5).map(prompt => <button key={prompt} className="rounded-full border border-border px-2.5 py-1.5 text-[10px] text-foreground hover:border-border/40 hover:text-foreground">{prompt}</button>)}</div></div></section>
        <section className="grid gap-4 xl:grid-cols-[1.1fr_1fr]"><div className="rounded-xl border border-border bg-[var(--secondary)] p-5"><h2 className="mb-5 text-lg font-semibold">Opportunity History</h2><div className="space-y-4">{[['Detected', 'AI', '18 min ago'], ['Validated', 'AI', '16 min ago'], ['Viewed', 'You', '12 min ago'], ['Saved', 'You', '8 min ago'], ['Recommendation Created', 'You', 'Just now'], ['Strategy Created', 'AI', 'Pending review']].map((event, eventIndex) => <div key={event[0]} className="flex items-center gap-3"><div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border ${eventIndex === 0 ? 'border-border/30 bg-secondary/15 text-foreground' : eventIndex === 1 ? 'border-border/30 bg-secondary/15 text-foreground' : 'border-border bg-secondary text-muted-foreground'}`}><span className="h-1.5 w-1.5 rounded-full bg-current" /></div><div className="flex-1"><p className="text-xs font-medium">{event[0]}</p><p className="text-[11px] text-muted-foreground">{event[1]} actor</p></div><span className="text-[11px] text-muted-foreground">{event[2]}</span></div>)}</div></div><div className="rounded-xl border border-border bg-[var(--secondary)] p-5"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold">Data Sources & Quality</h2><Database size={17} className="text-muted-foreground" /></div>{[['CRM', '5 min', 'Excellent', 'Customers, Sales'], ['Shopify', '8 min', 'Excellent', 'Ecommerce, Products'], ['Google Ads', '2 min', 'Excellent', 'Advertising'], ['GA4', '10 min', 'Good', 'Marketing, Ecommerce'], ['Finance', '4 hrs', 'Limited', 'Finance']].map(source => <div key={source[0]} className="grid grid-cols-[1fr_60px_80px_1.3fr] items-center border-b border-border py-2 text-[11px]"><strong>{source[0]}</strong><span className="text-muted-foreground">{source[1]}</span><span className={source[2] === 'Limited' ? 'text-foreground' : 'text-foreground'}>{source[2]}</span><span className="text-muted-foreground">{source[3]}</span></div>)}<div className="mt-4 rounded-lg border border-border/20 bg-secondary/[0.07] p-3 text-xs text-foreground">Opportunity detection is currently limited for Finance because data is more than 4 hours old.</div></div></section>
        <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{[['Loading', 'Skeleton cards for summary and evidence'], ['Empty', 'No significant opportunities detected.'], ['Insufficient Data', 'More business data is required.'], ['Limited Intelligence', 'Detection limited by missing data.'], ['Error', 'Opportunities couldn’t be loaded. Try Again.']].map(state => <div key={state[0]} className="rounded-lg border border-border bg-[var(--secondary)] p-4"><p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{state[0]}</p><p className="text-xs text-muted-foreground">{state[1]}</p></div>)}</section>
      </div></main>
      {modal && <div className="fixed inset-0 z-50 grid place-items-center bg-primary/70 p-4 backdrop-blur-sm"><div role="dialog" aria-modal="true" className="w-full max-w-lg rounded-2xl border border-border/30 bg-[var(--secondary)] p-6 shadow-2xl shadow-black/50"><div className="mb-5 flex items-start justify-between"><div><p className="mb-1 text-xs font-medium text-foreground">AI WORKSPACE</p><h2 className="text-xl font-semibold text-foreground">{modal === 'recommendation' ? 'Create AI Recommendation' : modal === 'strategy' ? 'Create Strategy' : 'Create AI Task'}</h2></div><button onClick={() => setModal(null)} className="text-foreground hover:text-foreground" aria-label="Close dialog"><X size={18} /></button></div><div className="space-y-4 text-sm">{modal === 'recommendation' && <><div><label className="text-xs text-muted-foreground">Recommendation</label><p className="mt-1 rounded-lg border border-border bg-primary/15 p-3 text-foreground">Implement targeted cross-sell campaign for high-value customer segment</p></div><div><label className="text-xs text-muted-foreground">Reason</label><p className="mt-1 text-xs text-foreground">Evidence of significant adoption gap vs comparable cohort</p></div><div className="grid grid-cols-2 gap-3"><div>{tag('Estimated revenue increase', 'amber')}</div><div>{tag('Effort: Medium · Risks: Low', 'blue')}</div></div></>}{modal === 'strategy' && <><p className="text-xs text-muted-foreground">Review the AI-proposed strategy before activation.</p>{['Objective: Expand high-value customer LTV', 'Target: High-value customers with adoption gap', 'Approach: Personalized cross-sell engagement', 'Channels: Email, CRM, account team', 'KPIs: Adoption, LTV, conversion, retention', 'Timeline: 3–6 months · Risks: Low'].map(line => <div key={line} className="rounded-lg border border-border bg-primary/15 p-3 text-xs text-foreground">{line}</div>)}</>}{modal === 'task' && <><label className="block text-xs text-muted-foreground">Opportunity<input value="Advertising Budget Reallocation" readOnly className="mt-1 w-full rounded-lg border border-border bg-primary/15 px-3 py-2 text-xs text-foreground" /></label><label className="block text-xs text-muted-foreground">Suggested action<textarea defaultValue="Reallocate budget from underperforming campaigns to high-ROAS campaigns." className="mt-1 min-h-20 w-full rounded-lg border border-border bg-primary/15 px-3 py-2 text-xs text-foreground outline-none" /></label>{tag('Expected impact: Estimated +$18K/mo', 'amber')}</>}</div><p className="mt-5 text-[11px] text-muted-foreground">Review required before this is activated in your business.</p><div className="mt-6 flex justify-end gap-2"><button onClick={() => setModal(null)} className="rounded-lg border border-border px-4 py-2.5 text-xs text-foreground">Cancel</button><button onClick={() => setModal(null)} className="rounded-lg bg-gradient-to-r from-primary to-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground">{modal === 'task' ? 'Create AI Task' : modal === 'strategy' ? 'Create Strategy' : 'Create Recommendation'}</button></div></div></div>}
    </div>;
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
