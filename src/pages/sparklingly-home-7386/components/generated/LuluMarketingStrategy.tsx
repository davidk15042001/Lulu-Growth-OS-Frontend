import { useState } from 'react';
import { Activity, AlertTriangle, ArrowRight, BarChart3, Bot, Check, ChevronDown, Download, Edit3, FileText, Gauge, Globe2, GripVertical, LayoutDashboard, Menu, MoreHorizontal, Plus, RefreshCw, Send, Settings, Sparkles, Target, TrendingUp, Users, X, Zap } from 'lucide-react';
type Row = {
  name: string;
  desc?: string;
  target?: string;
  current?: string;
  progress?: number;
  deadline?: string;
  priority?: string;
  owner?: string;
  status?: string;
};
const navGroups = [{
  label: 'WORKSPACE',
  items: [['Dashboard', LayoutDashboard], ['Company Profile', FileText]]
}, {
  label: 'MARKETING',
  items: [['Strategy', Target], ['Campaigns', BarChart3], ['Content', FileText], ['Audiences', Users], ['Analytics', Gauge], ['SEO', Activity], ['GEO', Globe2], ['AEO', Zap]]
}, {
  label: 'AI',
  items: [['AI Assistant', Bot], ['AI Agents', Sparkles], ['AI Insights', Gauge]]
}, {
  label: 'CRM',
  items: [['Contacts', Users], ['Companies', Users], ['Leads', Target], ['Deals', BarChart3]]
}, {
  label: 'SETTINGS',
  items: [['Integrations', Zap], ['Team', Users], ['Billing', FileText]]
}];
const objectives: Row[] = [{
  name: 'Increase Qualified Leads',
  desc: 'High-intent lead acquisition',
  target: '+25%',
  current: '+14%',
  progress: 56,
  deadline: 'Q4 2026',
  priority: 'Critical',
  owner: 'Growth',
  status: 'On Track'
}, {
  name: 'Improve Organic Visibility',
  desc: 'Grow organic traffic share',
  target: '+40%',
  current: '+18%',
  progress: 45,
  deadline: 'Q4 2026',
  priority: 'High',
  owner: 'SEO Team',
  status: 'On Track'
}, {
  name: 'Reduce Customer Acquisition Cost',
  desc: 'Optimize spend efficiency',
  target: '-20%',
  current: '-8%',
  progress: 40,
  deadline: 'Q3 2026',
  priority: 'High',
  owner: 'Marketing',
  status: 'At Risk'
}, {
  name: 'Increase Brand Awareness',
  desc: 'DACH region awareness',
  target: '+30% NPS',
  current: '+12%',
  progress: 40,
  deadline: 'Q4 2026',
  priority: 'Medium',
  owner: 'Brand',
  status: 'On Track'
}, {
  name: 'Improve AI Visibility (GEO/AEO)',
  desc: 'Presence in AI search',
  target: '+50%',
  current: '+22%',
  progress: 44,
  deadline: 'Q4 2026',
  priority: 'High',
  owner: 'SEO',
  status: 'On Track'
}];
const markets = [['Germany', 'Core', 'Strong', '+8.2%', '€284K', 'Core Market'], ['Austria', 'Core', 'Strong', '+6.4%', '€142K', 'Core Market'], ['Switzerland', 'Growth', 'Growing', '+14.8%', '€94K', 'Growth Market'], ['UK', 'Emerging', 'Early', '+28.4%', '€28K', 'Emerging Market']];
const audiences = [['High-Value Customers', '12,840', '€428K', '+14.2%', 'Critical', 'amber'], ['High-Intent Prospects', '9,210', '—', '+22.1%', 'High', 'indigo'], ['Enterprise Buyers', '1,240', '€148K', '+4.8%', 'High', 'blue'], ['At-Risk Customers', '4,220', '€94K', '-8.4%', 'Critical', 'red']];
const dimensions = [['Goal Alignment', 91, 'var(--chart-4)'], ['Audience Alignment', 86, 'var(--chart-1)'], ['Channel Alignment', 78, 'var(--chart-1)'], ['Content Alignment', 72, 'var(--chart-5)'], ['Performance', 81, 'var(--chart-4)'], ['Market Coverage', 74, 'var(--foreground)'], ['Competitive Position', 68, 'var(--foreground)'], ['Execution Readiness', 88, 'var(--chart-4)']];
const channels = [['Organic Search', 'Long-term acquisition', 'High', '82%', 'High', 'Active'], ['Paid Search', 'High-intent conversion', 'High', '74%', 'Medium', 'Active'], ['Content Marketing', 'Authority + SEO', 'High', '68%', 'Medium', 'Active'], ['Paid Social', 'Awareness + retargeting', 'Medium', '61%', 'Low', 'Active'], ['Email', 'Nurture + retention', 'High', '91%', 'Low', 'Active'], ['GEO/AEO', 'AI visibility', 'High', '44%', 'Medium', 'Growing']];
const initiatives = [['Expand Organic Acquisition', 'On Track', 'High', '+20% qualified leads', 'Q4 2026', 'Marketing'], ['Regional Market Expansion', 'On Track', 'High', '2 new markets', 'Q4 2026', 'Regional'], ['AI Visibility Program', 'In Progress', 'High', '+50% GEO/AEO', 'Q3 2026', 'SEO Team'], ['Customer Retention Initiative', 'At Risk', 'Critical', '-15% churn', 'Q3 2026', 'CS Team']];
const kpis = [['Marketing Revenue', '€486K', '€600K', '81%', '+12.4%'], ['Qualified Leads', '2,840', '3,500', '81%', '+18.2%'], ['CAC', '€148', '€120', 'Need -19%', '↑ At Risk'], ['Conversion Rate', '4.2%', '5.5%', '76%', '+0.4%'], ['Marketing ROI', '3.8x', '4.5x', '84%', 'Stable'], ['Organic Traffic', '128K', '180K', '71%', '+22.1%']];
const insights = ['Your current positioning strongly emphasizes automation capabilities. This is a strong differentiator in the enterprise market.', 'Your value proposition is not consistently reflected across all marketing channels. Content alignment score is 72/100.', 'Competitors are increasingly competing on integration breadth — your multi-channel approach is a defensible advantage.'];
const recommendations = ['Increase focus on high-intent audience segments', 'Rebalance channel priorities — deprioritize low-ROI paid social', 'Improve content alignment with positioning', 'Reduce dependency on single acquisition channel'];
const pill = (value: string) => <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${value === 'At Risk' || value === 'Critical' ? 'bg-chart-5/10 text-[var(--chart-5)]' : value === 'High' || value === 'Medium' ? 'bg-chart-1/10 text-[var(--chart-1)]' : value === 'Growing' ? 'bg-secondary text-foreground' : 'bg-chart-4/10 text-[var(--chart-4)]'}`}>{value}</span>;
const AI = ({
  children
}: {
  children: string;
}) => <span className="inline-flex items-center gap-1 rounded-full bg-[var(--chart-1)]/15 px-2 py-1 text-[10px] text-[var(--foreground)]"><Sparkles size={11} />{children}</span>;
const Section = ({
  title,
  action,
  children
}: {
  title: string;
  action?: string;
  children: React.ReactNode;
}) => <section className="mt-7"><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold tracking-tight">{title}</h2>{action && <button className="rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-[var(--primary-foreground)]"><Plus size={13} className="mr-1 inline" />{action}</button>}</div>{children}</section>;
export const LuluMarketingStrategy = () => {
  const [mobileNav, setMobileNav] = useState(false);
  const [modal, setModal] = useState(true);
  const [query, setQuery] = useState('');
  return <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]" style={{
    fontFamily: 'Inter, sans-serif'
  }}>
  <aside className={`${mobileNav ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-30 w-[220px] flex-col bg-[var(--sidebar)] px-3 py-5 lg:flex`}><div className="mb-7 flex items-center gap-2 px-2"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--primary)] font-bold text-primary-foreground">L</span><strong className="text-foreground">Lulu AI</strong></div><LuluSectionNavigation activeId="sparklingly-home-7386" /><div className="flex items-center gap-2 border-t border-[var(--muted-foreground)] pt-4"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] text-xs text-foreground">DM</span><div><p className="text-xs text-foreground">David M</p><p className="text-[10px] text-[var(--muted-foreground)]">Growth operator</p></div><MoreHorizontal size={15} className="ml-auto text-[var(--muted-foreground)]" /></div></aside>
  {mobileNav && <button aria-label="Close navigation" onClick={() => setMobileNav(false)} className="fixed inset-0 z-20 bg-primary/40 lg:hidden" />}
  <main className="lg:ml-[220px]"><header className="flex h-14 items-center justify-between bg-[var(--sidebar)] px-4 text-foreground sm:px-7"><div className="flex items-center gap-3"><button className="lg:hidden" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={19} /></button><span className="text-xs text-[var(--muted-foreground)]">Marketing</span><span className="text-[var(--muted-foreground)]">/</span><span className="text-xs">Strategy</span></div><div className="flex items-center gap-2"><button aria-label="Refresh" className="p-2 text-[var(--muted-foreground)]"><RefreshCw size={15} /></button><button className="hidden text-xs text-[var(--foreground)] sm:block"><Download size={14} className="mr-1 inline" />Export</button><button onClick={() => setModal(true)} className="hidden text-xs text-[var(--foreground)] md:block"><Edit3 size={14} className="mr-1 inline" />Edit Strategy</button><button className="rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-[var(--primary-foreground)]"><Sparkles size={13} className="mr-1 inline" />Ask Lulu AI</button></div></header>
  <div className="px-4 py-6 sm:px-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><div className="mb-2">{pill('Active')}</div><h1 className="text-3xl font-bold tracking-tight">Marketing Strategy</h1><p className="mt-1 text-sm text-[var(--muted-foreground)]">Define, manage and continuously improve the strategy that drives your marketing growth.</p></div><div className="text-right text-xs text-[var(--muted-foreground)]">Strategy Version: <strong className="text-[var(--foreground)]">2026</strong><br />Last Updated: 2 days ago · Owner: Marketing Team · Period: Q3–Q4 2026 · Score: <strong className="text-[var(--foreground)]">84/100</strong></div></div>
   <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_1.3fr]"><article className="rounded-xl border border-[var(--border)] bg-card p-5"><div className="flex items-center justify-between"><h2 className="font-bold">Current Strategy</h2>{pill('Active')}</div><p className="mt-6 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Version</p><strong className="text-xl">Marketing Strategy 2026</strong><div className="mt-5 grid grid-cols-2 gap-4 text-xs"><span className="text-[var(--muted-foreground)]">Period<strong className="mt-1 block text-[var(--foreground)]">Q3–Q4 2026</strong></span><span className="text-[var(--muted-foreground)]">Owner<strong className="mt-1 block text-[var(--foreground)]">Marketing Team</strong></span><span className="text-[var(--muted-foreground)]">Last updated<strong className="mt-1 block text-[var(--foreground)]">2 days ago</strong></span><span className="text-[var(--muted-foreground)]">Strategy score<strong className="mt-1 block text-2xl text-[var(--foreground)]">84/100</strong></span></div></article><article className="rounded-xl bg-[var(--card)] p-5 text-foreground"><div className="flex items-center justify-between"><div><AI>AI-generated</AI><h2 className="mt-2 text-lg font-bold">Strategy Health Score</h2></div><strong className="text-3xl text-[var(--foreground)]">84<span className="text-sm text-[var(--muted-foreground)]">/100</span></strong></div><p className="mt-1 text-xs text-[var(--chart-4)]">Healthy · continuously monitored</p><div className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">{dimensions.map(d => <div key={d[0] as string} className="text-xs"><div className="mb-1 flex justify-between"><span className="text-[var(--foreground)]">{d[0] as string}</span><b>{d[1] as number}</b></div><div className="h-1.5 rounded-full bg-[var(--secondary)]"><span className="block h-full rounded-full" style={{
                    width: `${d[1]}%`,
                    background: d[2] as string
                  }} /></div></div>)}</div></article></div>
   <Section title="Business Goal Alignment"><div className="grid gap-3 xl:grid-cols-3">{[['Increase Revenue', 'Increase Qualified Acquisition', 'Expand High-Intent Paid & Organic', 'Revenue Growth'], ['Expand Market Share', 'Enter New Markets', 'Regional Market Expansion', 'Customer Growth'], ['Improve Retention', 'Reduce Churn Rate', 'At-Risk Customer Program', 'LTV Increase']].map(chain => <article key={chain[0]} className="flex flex-wrap items-center gap-1 rounded-xl border border-[var(--border)] bg-card p-3">{chain.map((x, i) => <span key={x} className="flex items-center gap-1">{i > 0 && <ArrowRight size={13} className="text-[var(--foreground)]" />}<span className="rounded-lg bg-[var(--card)] px-2 py-2 text-[11px] font-medium">{x}</span></span>)}</article>)}</div></Section>
   <Section title="Marketing Objectives" action="Add Objective"><div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-card"><table className="w-full min-w-[980px] text-left text-xs"><thead className="bg-[var(--card)] text-[10px] uppercase text-[var(--muted-foreground)]"><tr>{['Objective', 'Description', 'Target', 'Current', 'Progress', 'Deadline', 'Priority', 'Owner', 'Status'].map(h => <th key={h} className="px-3 py-3">{h}</th>)}</tr></thead><tbody>{objectives.map(o => <tr key={o.name} className="border-t border-[var(--border)]"><td className="px-3 py-3 font-semibold">{o.name}</td><td className="px-3 text-[var(--muted-foreground)]">{o.desc}</td><td className="px-3">{o.target}</td><td className="px-3">{o.current}</td><td className="px-3"><div className="flex items-center gap-2"><span className="h-1.5 w-16 rounded-full bg-[var(--secondary)]"><span className="block h-full rounded-full bg-[var(--primary)] text-primary-foreground" style={{
                          width: `${o.progress}%`
                        }} /></span>{o.progress}%</div></td><td className="px-3">{o.deadline}</td><td className="px-3">{pill(o.priority || '')}</td><td className="px-3">{o.owner}</td><td className="px-3">{pill(o.status || '')}</td></tr>)}</tbody></table></div></Section>
   <Section title="Target Markets"><div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]"><div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-card"><table className="w-full min-w-[600px] text-left text-xs"><thead className="bg-[var(--card)] text-[10px] uppercase text-[var(--muted-foreground)]"><tr>{['Market', 'Priority', 'Presence', 'Growth', 'Revenue', 'Status'].map(h => <th key={h} className="px-3 py-3">{h}</th>)}</tr></thead><tbody>{markets.map(m => <tr key={m[0]} className="border-t border-[var(--border)]"><td className="px-3 py-3 font-semibold">{m[0]}</td><td className="px-3">{m[1]}</td><td className="px-3">{m[2]}</td><td className="px-3 text-[var(--foreground)]">{m[3]}</td><td className="px-3">{m[4]}</td><td className="px-3">{pill(m[5])}</td></tr>)}</tbody></table></div><article className="rounded-xl border border-[var(--border)] bg-card p-5"><h3 className="font-bold">Market Prioritization</h3><svg viewBox="0 0 440 210" className="mt-3 w-full" role="img" aria-label="Market size and growth potential bubble chart"><path d="M45 15V180H425" fill="none" stroke="var(--border)" /><path d="M45 70H425M45 125H425" stroke="var(--border)" /><text x="185" y="205" fontSize="11" fill="var(--muted-foreground)">Market Size →</text><text transform="rotate(-90 12 120)" x="12" y="120" fontSize="11" fill="var(--muted-foreground)">Growth Potential →</text><circle cx="310" cy="120" r="29" fill="var(--chart-1)" fillOpacity=".8" /><circle cx="220" cy="105" r="22" fill="var(--chart-4)" fillOpacity=".75" /><circle cx="350" cy="62" r="16" fill="var(--chart-3)" fillOpacity=".8" /><circle cx="125" cy="42" r="11" fill="var(--border)" fillOpacity=".8" /><g fontSize="11" fill="var(--muted-foreground)"><text x="292" y="157">Germany</text><text x="204" y="135">Austria</text><text x="338" y="40">Switzerland</text><text x="105" y="30">UK</text></g></svg></article></div></Section>
   <Section title="Strategic Audiences"><div className="mb-3 flex gap-2"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter audiences..." className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs outline-none focus:border-[var(--border)]" /><button className="rounded-lg border border-[var(--border)] px-3 text-xs">All audiences <ChevronDown size={13} className="ml-1 inline" /></button></div><div className="grid gap-3 md:grid-cols-2">{audiences.filter(a => a[0].toLowerCase().includes(query.toLowerCase())).map(a => <article key={a[0]} className={`rounded-xl border bg-card p-4 ${a[5] === 'red' ? 'border-chart-5/30' : 'border-[var(--border)]'}`}><div className="flex items-start justify-between"><div><h3 className="font-bold">{a[0]}</h3><p className="mt-1 text-xs text-[var(--muted-foreground)]">Strategic segment for focused growth</p></div>{pill(a[4])}</div><div className="mt-5 grid grid-cols-3 gap-3 text-xs"><span className="text-[var(--muted-foreground)]">Members<strong className="mt-1 block text-lg text-[var(--foreground)]">{a[1]}</strong></span><span className="text-[var(--muted-foreground)]">Revenue<strong className="mt-1 block text-lg text-[var(--foreground)]">{a[2]}</strong></span><span className="text-[var(--muted-foreground)]">Growth<strong className={`mt-1 block text-lg ${a[3].startsWith('-') ? 'text-[var(--chart-5)]' : 'text-[var(--chart-4)]'}`}>{a[3]}</strong></span></div><a href="#audiences" className="mt-4 block text-xs font-semibold text-[var(--foreground)]">View Audience <ArrowRight size={13} className="inline" /></a></article>)}</div></Section>
   <div className="mt-7 grid gap-4 xl:grid-cols-2"><article className="rounded-xl border border-[var(--border)] bg-card p-5"><h2 className="text-lg font-bold">Market Positioning</h2><p className="mt-4 text-sm leading-6">“The AI Business Operating System that turns business data into intelligent decisions and automated growth.”</p><p className="mt-5 text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">Differentiators</p><ol className="mt-2 space-y-2 text-sm"><li><b>01</b> · End-to-end AI automation</li><li><b>02</b> · Unified business intelligence</li><li><b>03</b> · Deep enterprise integration</li></ol><p className="mt-5 rounded-lg bg-[var(--secondary)] p-3 text-sm font-semibold">Brand Promise: Understand your business. Act on it. Grow it.</p><button className="mt-4 rounded border border-[var(--border)] px-3 py-2 text-xs">Edit Positioning</button><button className="ml-2 rounded bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground">Improve with Lulu AI</button></article><article className="rounded-xl border border-[var(--border)] bg-card p-5"><h2 className="text-lg font-bold">Value Proposition</h2><p className="mt-4 text-sm leading-6">Lulu AI helps enterprise teams eliminate guesswork by connecting every business signal to actionable AI-driven strategy.</p><div className="mt-4 grid gap-3 text-xs sm:grid-cols-3"><span><b>Customer Problem</b><small className="mt-1 block text-[var(--muted-foreground)]">Complex data, fragmented tools, manual strategy work</small></span><span><b>Solution</b><small className="mt-1 block text-[var(--muted-foreground)]">Unified AI platform that connects, analyzes, and acts</small></span><span><b>Key Benefits</b><small className="mt-1 block text-[var(--muted-foreground)]">Clarity · speed · measurable growth</small></span></div><div className="mt-5 flex gap-2"><button className="rounded border border-[var(--border)] px-3 py-2 text-xs">Edit</button><button className="rounded bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground">Improve with Lulu AI</button></div></article></div>
   <article className="mt-7 rounded-xl bg-[var(--card)] p-5 text-foreground"><div className="flex items-center gap-3"><AI>AI-generated</AI><h2 className="text-lg font-bold"><Sparkles size={17} className="mr-1 inline text-[var(--foreground)]" />Lulu AI Positioning Analysis</h2></div><div className="mt-5 grid gap-4 md:grid-cols-3">{insights.map((x, i) => <div key={x} className="border-l border-[var(--border)] pl-4 text-sm leading-6 text-[var(--foreground)]"><p>{x}</p><div className="mt-3 flex gap-2"><span className="rounded bg-[var(--primary)]/15 px-2 py-1 text-[10px] text-[var(--foreground)]">{i === 1 ? 'Medium' : 'High'} confidence</span><span className="rounded bg-[var(--background)] px-2 py-1 text-[10px] text-[var(--muted-foreground)]">Website · CRM</span></div></div>)}</div><p className="mt-5 text-[11px] text-[var(--muted-foreground)]">Analyzed 2 hours ago · Sources: Website, CRM, Campaign Data, Competitor Intelligence</p></article>
   <Section title="Channel Strategy"><div className="grid gap-4 xl:grid-cols-[1.35fr_.65fr]"><div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-card"><table className="w-full min-w-[700px] text-left text-xs"><thead className="bg-[var(--card)] text-[10px] uppercase text-[var(--muted-foreground)]"><tr>{['Channel', 'Strategic Role', 'Priority', 'Performance', 'Investment', 'Status'].map(h => <th key={h} className="px-3 py-3">{h}</th>)}</tr></thead><tbody>{channels.map(c => <tr key={c[0]} className="border-t border-[var(--border)]"><td className="px-3 py-3 font-semibold">{c[0]}</td><td className="px-3 text-[var(--muted-foreground)]">{c[1]}</td><td className="px-3">{pill(c[2])}</td><td className="px-3">{c[3]}</td><td className="px-3">{c[4]}</td><td className="px-3">{pill(c[5])}</td></tr>)}</tbody></table></div><article className="rounded-xl border border-[var(--border)] bg-card p-5"><h3 className="font-bold">Channel Priorities</h3>{channels.map((c, i) => <div key={c[0]} className="flex items-center gap-2 border-b border-[var(--border)] py-3 text-xs"><GripVertical size={14} className="text-[var(--muted-foreground)]" /><b className="w-4 text-[var(--foreground)]">{i + 1}</b><span className="flex-1 font-medium">{c[0]}</span>{pill(i === 0 ? 'Critical' : i < 3 ? 'High' : 'Medium')}</div>)}</article></div></Section>
   <Section title="Content Strategy"><div className="grid gap-4 md:grid-cols-3">{[['Content Goals', ['Generate qualified demand · +25%', 'Build category authority · High', 'Support retention · -15% churn', 'Improve AI discoverability · +50%']], ['Content Pillars', ['AI & Automation · 18 topics', 'Business Intelligence · 14 topics', 'Product Updates · 9 topics', 'Customer Success Stories · 12 topics', 'Industry Insights · 16 topics']], ['Distribution Channels + Formats', ['Blog · High', 'Video · Medium', 'Case Studies · High', 'Guides · High', 'Landing Pages · Critical']]].map(col => <article key={col[0] as string} className="rounded-xl border border-[var(--border)] bg-card p-4"><h3 className="font-bold">{col[0] as string}</h3><ul className="mt-3 space-y-3 text-xs text-[var(--muted-foreground)]">{(col[1] as string[]).map(item => <li key={item} className="border-b border-[var(--border)] pb-2">{item}</li>)}</ul></article>)}</div></Section>
   <Section title="Search & AI Visibility Strategy"><div className="grid gap-4 md:grid-cols-3">{[['SEO', Activity, '82%', 'Grow qualified organic acquisition'], ['GEO', Globe2, '44%', 'Increase visibility in generative answers'], ['AEO', Zap, '44%', 'Own answer-ready search experiences']].map(item => {
              const Icon = item[1];
              return <article key={item[0] as string} className="rounded-xl border border-[var(--border)] bg-card p-5"><div className="flex items-center gap-2"><Icon size={18} className="text-[var(--foreground)]" /><h3 className="font-bold">{item[0] as string}</h3>{pill('High')}</div><p className="mt-4 text-xs text-[var(--muted-foreground)]">Objective</p><p className="text-sm font-medium">{item[3] as string}</p><strong className="mt-4 block text-2xl text-[var(--foreground)]">{item[2] as string}</strong><ul className="mt-3 space-y-2 text-xs text-[var(--muted-foreground)]"><li>• Build topic authority and coverage</li><li>• Align content with buyer intent</li><li>• Measure strategic visibility</li></ul><p className="mt-4 rounded bg-[var(--secondary)] p-2 text-xs">Key opportunity: scale high-intent content</p><button className="mt-3 text-xs font-semibold text-[var(--foreground)]">Open {item[0] as string} <ArrowRight size={13} className="inline" /></button></article>;
            })}</div></Section>
   <Section title="Competitive Marketing Strategy"><div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]"><div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-card"><table className="w-full min-w-[650px] text-left text-xs"><thead className="bg-[var(--card)] text-[10px] uppercase text-[var(--muted-foreground)]"><tr><th className="px-3 py-3">Competitor</th><th className="px-3 py-3">Strengths</th><th className="px-3 py-3">Weaknesses</th><th className="px-3 py-3">Positioning</th></tr></thead><tbody>{[['Northstar AI', 'Brand reach', 'Slow implementation', 'AI insights'], ['Orbit Systems', 'Integration breadth', 'Complex setup', 'Enterprise platform'], ['SignalWorks', 'Fast adoption', 'Limited depth', 'Automation']].map(row => <tr key={row[0]} className="border-t border-[var(--border)]"><td className="px-3 py-3 font-semibold">{row[0]}</td><td className="px-3">{row[1]}</td><td className="px-3 text-[var(--muted-foreground)]">{row[2]}</td><td className="px-3">{row[3]}</td></tr>)}</tbody></table></div><article className="rounded-xl bg-[var(--card)] p-5 text-foreground"><h3 className="font-bold"><Sparkles size={15} className="mr-1 inline text-[var(--foreground)]" />AI competitive insights</h3>{['Competitive Opportunity · Own integration-led growth', 'Competitive Threat · Category noise is increasing', 'Positioning Gap · Mid-market proof points'].map(x => <p key={x} className="mt-4 border-l border-[var(--border)] pl-3 text-xs text-[var(--foreground)]">{x}<span className="mt-1 block text-[10px] text-[var(--muted-foreground)]">Evidence: competitor intelligence · High confidence</span></p>)}</article></div></Section>
   <Section title="Strategic Initiatives + Roadmap"><div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-card"><table className="w-full min-w-[800px] text-left text-xs"><thead className="bg-[var(--card)] text-[10px] uppercase text-[var(--muted-foreground)]"><tr>{['Initiative', 'Status', 'Priority', 'Target', 'Deadline', 'Owner', 'Actions'].map(h => <th key={h} className="px-3 py-3">{h}</th>)}</tr></thead><tbody>{initiatives.map(row => <tr key={row[0]} className="border-t border-[var(--border)]"><td className="px-3 py-3 font-semibold">{row[0]}</td><td className="px-3">{pill(row[1])}</td><td className="px-3">{pill(row[2])}</td><td className="px-3">{row[3]}</td><td className="px-3">{row[4]}</td><td className="px-3">{row[5]}</td><td className="px-3"><MoreHorizontal size={15} /></td></tr>)}</tbody></table></div><article className="mt-4 rounded-xl border border-[var(--border)] bg-card p-4"><div className="flex justify-between text-xs text-[var(--muted-foreground)]"><span>Initiative roadmap</span><span>Q3 2026 · Q4 2026</span></div><svg viewBox="0 0 900 145" className="mt-3 w-full" role="img" aria-label="Strategic initiative Gantt roadmap"><g fontSize="11" fill="var(--muted-foreground)"><text x="220" y="15">Jul</text><text x="330" y="15">Aug</text><text x="440" y="15">Sep</text><text x="550" y="15">Oct</text><text x="660" y="15">Nov</text><text x="770" y="15">Dec</text></g>{initiatives.map((x, i) => <g key={x[0]}><text x="0" y={42 + i * 25} fontSize="11" fill="var(--muted-foreground)">{x[0]}</text><rect x={i === 2 ? 400 : 220} y={32 + i * 25} width={i === 3 ? 115 : 330} height="12" rx="6" fill={i === 0 ? 'var(--chart-1)' : i === 1 ? 'var(--chart-3)' : i === 2 ? 'var(--chart-4)' : 'var(--chart-5)'} /><circle cx={i === 2 ? 400 : 220} cy={38 + i * 25} r="4" fill="var(--foreground)" /></g>)}</svg></article></Section>
   <Section title="Strategic Marketing KPIs"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">{kpis.map(k => <article key={k[0]} className="rounded-xl border border-[var(--border)] bg-card p-4"><p className="text-xs text-[var(--muted-foreground)]">{k[0]}</p><strong className="mt-2 block text-2xl text-[var(--foreground)]">{k[1]}</strong><p className="mt-1 text-[11px] text-[var(--muted-foreground)]">Target {k[2]}</p><div className="mt-3 h-1.5 rounded-full bg-[var(--secondary)]"><span className="block h-full w-[81%] rounded-full bg-[var(--chart-1)]" /></div><span className={`mt-2 inline-block text-[11px] ${k[4].includes('Risk') ? 'text-[var(--chart-5)]' : 'text-[var(--foreground)]'}`}>{k[4]}</span></article>)}</div></Section>
   <Section title="Strategy Performance"><div className="mb-3 flex flex-wrap gap-2">{['Objective', 'Market', 'Audience', 'Channel', 'Initiative'].map(x => <button key={x} className="rounded-lg border border-[var(--border)] bg-card px-3 py-2 text-xs">{x}<ChevronDown size={12} className="ml-2 inline" /></button>)}</div><div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-card"><table className="w-full min-w-[700px] text-left text-xs"><thead className="bg-[var(--card)] text-[10px] uppercase text-[var(--muted-foreground)]"><tr>{['Objective', 'Target', 'Current', 'Progress', 'Trend', 'Status'].map(h => <th key={h} className="px-3 py-3">{h}</th>)}</tr></thead><tbody>{objectives.map(o => <tr key={o.name} className="border-t border-[var(--border)]"><td className="px-3 py-3 font-semibold">{o.name}</td><td className="px-3">{o.target}</td><td className="px-3">{o.current}</td><td className="px-3">{o.progress}%</td><td className="px-3 text-[var(--foreground)]"><TrendingUp size={13} className="inline" /> Improving</td><td className="px-3">{pill(o.status || '')}</td></tr>)}</tbody></table></div></Section>
   <Section title="Strategic Gaps"><span className="mb-3 inline-block rounded-full bg-chart-5/10 px-2 py-1 text-xs text-[var(--chart-5)]">3 gaps identified</span><div className="grid gap-3 md:grid-cols-3">{['High-value audience underrepresented in active campaigns', 'Content alignment score is below strategic target (72/100)', 'UK emerging market has insufficient marketing coverage'].map((x, i) => <article key={x} className="rounded-xl border border-[var(--border)] bg-card p-4"><AlertTriangle size={16} className="text-[var(--foreground)]" /><h3 className="mt-3 text-sm font-bold">{x}</h3><p className="mt-2 text-xs text-[var(--muted-foreground)]">Impact: {i ? 'Medium' : 'High'} · Priority: {i === 0 ? 'Critical' : i === 1 ? 'High' : 'Medium'}</p><button className="mt-4 rounded border border-[var(--border)] px-2 py-1 text-xs">Review</button><button className="ml-2 rounded bg-[var(--primary)] px-2 py-1 text-xs font-semibold text-primary-foreground">{i === 1 ? 'Ask Lulu AI' : 'Create Task'}</button></article>)}</div></Section>
   <div className="mt-7 grid gap-4 xl:grid-cols-2"><div><h2 className="mb-3 text-lg font-bold">Strategic Opportunities</h2>{[['Expand GEO/AEO investment', '87', 'High Impact'], ['High-value customer upsell program', '82', 'High Impact'], ['Content gap in enterprise decision-maker segment', '74', 'Medium Impact']].map(x => <article key={x[0]} className="mb-3 rounded-xl border border-[var(--border)] bg-card p-4"><Sparkles size={16} className="text-[var(--foreground)]" /><h3 className="mt-2 text-sm font-bold">{x[0]}</h3><p className="mt-2 text-xs text-[var(--muted-foreground)]">Potential impact: {x[2]} · Score <b className="text-[var(--foreground)]">{x[1]}</b> · Evidence: strategy data</p><button className="mt-3 rounded border px-2 py-1 text-xs">View</button><button className="ml-2 rounded bg-[var(--primary)] px-2 py-1 text-xs text-primary-foreground">Create Initiative</button></article>)}</div><div><h2 className="mb-3 text-lg font-bold">Strategic Risks</h2>{['Over-dependence on paid search acquisition', 'Rising customer acquisition costs', 'Competitive differentiation weakening in mid-market'].map((x, i) => <article key={x} className="mb-3 rounded-xl border border-[var(--border)] bg-card p-4"><AlertTriangle size={16} className="text-[var(--chart-5)]" /><h3 className="mt-2 text-sm font-bold">{x}</h3><p className="mt-2 text-xs text-[var(--muted-foreground)]">Severity: {i < 2 ? 'High' : 'Medium'} · Evidence reviewed 2 hours ago</p><button className="mt-3 rounded border px-2 py-1 text-xs">View Risk</button><button className="ml-2 rounded bg-[var(--primary)] px-2 py-1 text-xs text-primary-foreground">Create Task</button></article>)}</div></div>
   <article className="mt-7 rounded-xl bg-[var(--card)] p-5 text-foreground"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold"><Sparkles size={17} className="mr-2 inline text-[var(--foreground)]" />Lulu AI Strategy Review</h2><AI>AI-generated · 2 hours ago</AI></div><div className="mt-5 grid gap-5 md:grid-cols-5"><div><h3 className="text-xs font-bold text-[var(--foreground)]">Overall Assessment</h3><p className="mt-2 text-xs leading-5 text-[var(--foreground)]">A healthy strategy with strong alignment and clear growth levers. Focus next on content consistency and market coverage.</p></div>{[['Strengths', 'var(--chart-4)', ['Unified strategy', 'Strong objectives', 'Execution readiness']], ['Weaknesses', 'var(--foreground)', ['Content alignment', 'Competitive proof', 'UK coverage']], ['Opportunities', 'var(--primary)', ['GEO/AEO scale', 'Upsell motion', 'New markets']], ['Risks', 'var(--foreground)', ['Paid dependency', 'CAC pressure', 'Category noise']]].map(col => <div key={col[0] as string}><h3 className="text-xs font-bold" style={{
                color: col[1] as string
              }}>{col[0] as string}</h3>{(col[2] as string[]).map(item => <p key={item} className="mt-2 text-xs text-[var(--foreground)]">• {item}</p>)}</div>)}</div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--muted-foreground)] pt-4 text-[11px] text-[var(--muted-foreground)]"><span>Sources: CRM · Website · Campaign Data · Competitor Intelligence · Confidence: High</span><button className="rounded bg-[var(--primary)] px-3 py-2 font-semibold text-[var(--primary-foreground)]">Run Full Strategy Analysis</button></div></article>
   <Section title="Lulu AI Recommendations"><div className="grid gap-3 md:grid-cols-2">{recommendations.map((x, i) => <article key={x} className="rounded-xl border border-[var(--border)] bg-card p-4"><div className="flex items-start gap-3"><Sparkles size={17} className="mt-0.5 text-[var(--foreground)]" /><div><h3 className="text-sm font-bold">{x}</h3><div className="mt-2">{pill(i === 0 ? 'Critical' : 'High')}</div><p className="mt-2 text-xs text-[var(--muted-foreground)]">Lulu AI found a material opportunity to improve strategic performance based on connected data.</p><div className="mt-4 flex gap-2"><button className="rounded border px-2 py-1 text-xs">Review</button><button className="rounded border px-2 py-1 text-xs">Accept</button><button className="rounded bg-[var(--primary)] px-2 py-1 text-xs text-primary-foreground">Create Initiative</button></div></div></div></article>)}</div><p className="mt-3 text-xs text-[var(--muted-foreground)]">AI recommendations require your review and confirmation before any changes are applied.</p></Section>
   <div className="mt-7 grid gap-4 xl:grid-cols-2"><article className="rounded-xl border border-[var(--border)] bg-card p-5"><h2 className="font-bold">Change History</h2>{['Updated Content Alignment · 68 → 72 · David M · 2h ago', 'Added UK market coverage · — → Emerging · Sarah K · 1d ago', 'Published Q4 objectives · Draft → Active · David M · 2d ago', 'Updated channel priorities · v1 → v2 · Lulu AI · 4d ago'].map(x => <div key={x} className="border-l-2 border-[var(--border)] py-3 pl-3 text-xs">{x}</div>)}</article><article className="rounded-xl border border-[var(--border)] bg-card p-5"><h2 className="font-bold">Strategy Versioning</h2>{[['Marketing Strategy 2026', 'Active · Published'], ['Marketing Strategy Q1 2026', 'Archived'], ['Strategy 2026 Update Draft', 'Draft']].map(v => <div key={v[0]} className="flex items-center justify-between border-b border-[var(--border)] py-3 text-xs"><span className="font-medium">{v[0]}<small className="ml-2 text-[var(--muted-foreground)]">{v[1]}</small></span><MoreHorizontal size={15} /></div>)}<div className="mt-4 flex gap-2"><button className="rounded border px-2 py-1 text-xs">Create Draft</button><button className="rounded border px-2 py-1 text-xs">Compare Versions</button><button className="rounded bg-[var(--primary)] px-2 py-1 text-xs text-primary-foreground">Publish Strategy</button></div></article></div>
   <article className="mt-7 rounded-xl bg-[var(--card)] p-5 text-foreground"><h2 className="text-lg font-bold">Ask Lulu AI about your Marketing Strategy</h2><div className="mt-3 flex flex-wrap gap-2">{['Review my marketing strategy', 'What should we prioritize next?', 'Which channel needs more attention?', 'Where are our biggest gaps?'].map(x => <button key={x} className="rounded-full border border-[var(--muted-foreground)] px-3 py-2 text-xs text-[var(--foreground)]">{x}</button>)}</div><div className="mt-4 flex"><input placeholder="Ask anything about your strategy..." className="flex-1 rounded-l-md bg-[var(--secondary)] px-3 py-3 text-xs text-foreground outline-none" /><button className="rounded-r-md bg-[var(--primary)] px-4 text-[var(--primary-foreground)]"><Send size={15} /></button></div></article>
   <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{[['No Marketing Strategy Yet', 'Create Strategy', 'Generate with Lulu AI'], ['Strategy Intelligence Is Limited', 'Connect Integration', ''], ["Marketing Strategy Couldn't Be Loaded", 'Try Again', ''], ['Marketing Strategy Restricted', 'Request access', '']].map(s => <article key={s[0]} className="rounded-xl border border-dashed border-[var(--border)] bg-card p-4"><h3 className="text-sm font-bold">{s[0]}</h3><p className="mt-2 text-xs text-[var(--muted-foreground)]">{s[0].includes('Limited') ? 'Connect your data sources to unlock strategic intelligence.' : s[0].includes('Restricted') ? 'You do not have permission to view this workspace.' : 'Illustrative state for this workspace.'}</p><button className="mt-4 rounded bg-[var(--primary)] px-2 py-1 text-xs font-semibold text-primary-foreground">{s[1]}</button>{s[2] && <button className="ml-2 rounded border px-2 py-1 text-xs">{s[2]}</button>}</article>)}</div><article className="mt-3 rounded-xl border border-[var(--border)] bg-card p-4"><div className="h-3 w-40 animate-pulse rounded bg-[var(--secondary)]" /><div className="mt-3 h-2 w-full animate-pulse rounded bg-[var(--secondary)]" /><div className="mt-2 h-2 w-3/4 animate-pulse rounded bg-[var(--secondary)]" /><span className="mt-3 block text-[10px] text-[var(--muted-foreground)]">Loading strategy data…</span></article>
  </div></main>
  {modal && <aside className="fixed bottom-4 right-4 z-10 hidden w-[330px] rounded-xl border border-[var(--border)] bg-card p-5 shadow-xl lg:block"><div className="flex items-center justify-between"><h2 className="font-bold">Edit Strategy</h2><button onClick={() => setModal(false)} aria-label="Close edit strategy"><X size={17} /></button></div><span className="mt-3 inline-block rounded-full bg-secondary px-2 py-1 text-[10px] text-[var(--foreground)]">Unsaved changes</span><div className="mt-4 flex gap-3 overflow-x-auto border-b border-[var(--border)]">{['Objectives', 'Markets', 'Positioning', 'Channels', 'Initiatives'].map((x, i) => <button key={x} className={`shrink-0 pb-2 text-[11px] ${i === 0 ? 'border-b-2 border-[var(--border)] font-semibold' : ''}`}>{x}</button>)}</div><label className="mt-5 block text-xs font-semibold">Strategy objective<textarea className="mt-2 h-20 w-full rounded border border-[var(--border)] p-2 text-xs" defaultValue="Increase qualified acquisition while expanding sustainable market coverage." /></label><div className="mt-5 flex justify-end gap-2"><button onClick={() => setModal(false)} className="rounded border px-3 py-2 text-xs">Cancel</button><button className="rounded border px-3 py-2 text-xs">Save Draft</button><button className="rounded bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground">Publish</button></div></aside>}
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
