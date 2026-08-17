import { useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertTriangle, BarChart3, Bot, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Download, Eye, FileText, Filter, Globe2, LayoutDashboard, Menu, MoreHorizontal, Plus, RefreshCw, Search, Send, Settings, Sparkles, Target, TrendingUp, Users, X, Zap } from 'lucide-react';
const navGroups: [string, string[]][] = [['WORKSPACE', ['Dashboard', 'Company Profile']], ['MARKETING', ['Strategy', 'Campaigns', 'Keywords', 'Content', 'Audiences', 'Analytics', 'SEO', 'GEO', 'AEO']], ['AI', ['AI Assistant', 'AI Agents', 'AI Insights']], ['CRM', ['Contacts', 'Companies', 'Leads', 'Deals']], ['SETTINGS', ['Integrations', 'Team', 'Billing']]];
const icons = [LayoutDashboard, FileText, Target, BarChart3, Search, FileText, Users, GaugeIcon, Globe2, Zap, Bot, Sparkles, Activity, Users, Users, Target, BarChart3, Settings];
function GaugeIcon(props: {
  size?: number;
}) {
  return <Activity {...props} />;
}
const kpis = [['Tracked Keywords', '2,847', '+124 this month', 'blue'], ['Ranking Keywords', '1,284', '45.1% of tracked', 'green'], ['High-Opportunity', '342', '+28 new', 'amber'], ['Keyword Gaps', '186', 'vs competitors', 'red'], ['High-Intent Keywords', '428', 'Commercial + Transactional', 'purple'], ['Emerging Keywords', '94', 'Rising trend', 'teal']];
const keywords = [['ai business automation software', 'Commercial', 'Observed', 'Medium', '#8', 'High', '+12%', 'Medium', 'High', 'Critical', 'Active', 'Active', 'Opportunity', '2d ago'], ['enterprise workflow automation', 'Transactional', 'Observed', 'Hard', '#14', 'Medium', '+8%', 'High', 'High', 'High', 'Active', 'Active', 'Active', '1d ago'], ['best crm for small business', 'Commercial', 'Estimated', 'Hard', 'No Data', 'None', '+18%', 'Very High', 'Opportunity', 'High', 'Gap', 'Opportunity', '—', '3d ago'], ['ai business intelligence platform', 'Commercial', 'Observed', 'Medium', '#22', 'Low', '+4%', 'Medium', 'Medium', 'High', 'Active', '—', 'Opportunity', '1d ago'], ['how to automate business processes', 'Informational', 'Observed', 'Low', '#6', 'High', 'Stable', 'Low', 'Medium', 'Medium', 'Active', 'Active', 'Covered', '4h ago'], ['marketing automation tools', 'Commercial', 'Estimated', 'Hard', 'No Data', 'None', '+24%', 'Very High', 'High', 'High', 'Gap', 'Gap', '—', '1d ago'], ['business operating system', 'Navigational', 'Observed', 'Medium', '#3', 'High', 'Stable', 'Low', 'Low', 'High', 'Active', 'Active', 'Active', '2d ago'], ['ai crm software', 'Commercial', 'Observed', 'Hard', '#31', 'Low', '+6%', 'High', 'High', 'High', 'Improving', 'Opportunity', '—', '6h ago']];
const topics = [['Business Automation', '284', 'ai business automation', 'High', 'Critical Opportunity', 68], ['CRM & Customer Management', '198', 'ai crm software', 'Medium', 'High Opportunity', 42], ['AI & Machine Learning', '312', 'ai business intelligence', 'High', 'Medium', 78], ['Marketing Automation', '167', 'marketing automation tools', 'Low', 'Critical Gap', 24], ['Workflow & Productivity', '143', 'workflow automation tools', 'Medium', 'High', 55]];
const opportunities = [['enterprise ai platform', '91', 'Commercial intent', 'High business relevance · Limited current visibility', '2 competitors ranking'], ['automate business workflows', '84', 'Transactional', 'Rising +22% trend · Gap: 3 competitors', 'Observed'], ['ai powered crm', '78', 'Commercial', 'No current ranking · High volume estimated', 'AI Inferred']];
const gaps = [['marketing automation platform', 'HubSpot #2 · Salesforce #4', 'No Data', 'High Opportunity'], ['small business crm software', 'HubSpot #1 · Pipedrive #3', 'No Data', 'High'], ['workflow management software', 'Monday.com #1', '#42', 'Medium']];
const intents = [['Informational', '1,082', '38%', 'var(--primary)'], ['Commercial', '798', '28%', 'var(--foreground)'], ['Transactional', '513', '18%', 'var(--primary)'], ['Navigational', '256', '9%', 'var(--chart-4)'], ['Local', '114', '4%', 'var(--primary)'], ['Mixed', '84', '3%', 'var(--muted-foreground)']];
const discovered = [['autonomous enterprise ai', 'Commercial', 'AI & ML', 'High', 'High Opportunity'], ['ai business growth platform', 'Commercial', 'Business Automation', 'High', 'Critical'], ['intelligent process automation software', 'Transactional', 'Workflow', 'Medium', 'High'], ['ai powered business insights', 'Informational', 'AI & ML', 'High', 'Medium'], ['enterprise ai decision making', 'Commercial', 'AI & ML', 'High', 'High']];
const btn = 'rounded-md border border-[var(--border)] bg-card px-2.5 py-1.5 text-xs font-medium hover:border-[var(--border)]';
const pill = (text: string, kind?: string) => <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold ${kind === 'red' || text.includes('Gap') ? 'bg-chart-5/10 text-chart-5' : kind === 'blue' ? 'bg-secondary text-foreground' : kind === 'green' || text === 'Active' || text === 'High' ? 'bg-chart-4/10 text-chart-4' : kind === 'purple' || text === 'Commercial' ? 'bg-secondary text-foreground' : kind === 'teal' ? 'bg-secondary text-foreground' : 'bg-secondary text-[var(--chart-1)]'}`}>{text}</span>;
const AI = () => <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/15 px-2 py-1 text-[10px] text-[var(--foreground)]"><Sparkles size={11} />AI-generated</span>;
const Section = ({
  title,
  children,
  action
}: {
  title: string;
  children: React.ReactNode;
  action?: string;
}) => <section className="mt-6"><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold">{title}</h2>{action && <button className="text-xs font-semibold text-[var(--foreground)]">{action} <ChevronRight size={13} className="inline" /></button>}</div>{children}</section>;
export const LuluKeywordsWorkspace = () => {
  const [mobile, setMobile] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [modal, setModal] = useState(true);
  const [drawer, setDrawer] = useState(true);
  const { items: liveKeywords, loading: liveLoading, error: liveError } = useLiveRecords('marketing_keywords');
  const liveEmpty = !liveLoading && !liveError && liveKeywords.length === 0;
  const filtered = keywords.filter(row => row[0].includes(query.toLowerCase()));
  return <div className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)]">
    <aside className={`${mobile ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-40 w-[220px] flex-col bg-[var(--sidebar)] px-3 py-5 lg:flex`}><div className="mb-7 flex items-center gap-2 px-2"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--primary)] font-bold text-primary-foreground">L</span><strong className="text-foreground">Lulu AI</strong></div><LuluSectionNavigation activeId="kind-time-4492" /><div className="flex items-center gap-2 border-t border-[var(--muted-foreground)] pt-4"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] text-xs text-foreground">DM</span><div><p className="text-xs text-foreground">Workspace owner</p><p className="text-[10px] text-[var(--muted-foreground)]">Growth operator</p></div><MoreHorizontal size={15} className="ml-auto text-[var(--muted-foreground)]" /></div></aside>
    {mobile && <button aria-label="Close navigation" onClick={() => setMobile(false)} className="fixed inset-0 z-30 bg-primary/40 lg:hidden" />}
    <main className="lg:ml-[220px]">{liveLoading ? <div className="border-b border-border bg-secondary/30 px-4 py-3 text-xs text-muted-foreground sm:px-7">Loading live marketing keywords…</div> : liveError ? <div className="border-b border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive sm:px-7">{liveError}</div> : liveEmpty ? <div className="border-b border-dashed border-border bg-card px-4 py-3 text-xs text-muted-foreground sm:px-7">No live marketing keywords are available yet. Add keywords or connect your marketing platform to begin.</div> : null}<header className="flex h-14 items-center justify-between bg-[var(--sidebar)] px-4 text-foreground sm:px-7"><div className="flex items-center gap-3"><button className="lg:hidden" aria-label="Open navigation" onClick={() => setMobile(true)}><Menu size={19} /></button><span className="text-xs text-[var(--muted-foreground)]">Marketing</span><span className="text-[var(--muted-foreground)]">/</span><span className="text-xs">Keywords</span></div><div className="flex items-center gap-2"><span className="hidden rounded-full bg-chart-4/15 px-2 py-1 text-[10px] text-chart-4 sm:inline">● Active</span><button className="hidden p-2 text-[var(--muted-foreground)] md:inline" aria-label="Refresh"><RefreshCw size={15} /></button><button className="hidden text-xs text-[var(--foreground)] lg:inline"><Download size={14} className="mr-1 inline" />Export</button><button className="hidden rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs md:inline"><Plus size={13} className="mr-1 inline" />Add Keyword</button><button className="hidden rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs xl:inline"><Sparkles size={13} className="mr-1 inline" />Discover Keywords</button><button className="rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground"><Sparkles size={13} className="mr-1 inline" />Ask Lulu AI</button></div></header>
      <div className="px-4 py-7 sm:px-8"><h1 className="text-2xl font-bold">Keywords</h1><p className="mt-1 text-sm text-[var(--muted-foreground)]">Discover, analyze and prioritize the search terms that can drive visibility, traffic and business growth.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">{kpis.map(k => <article key={k[0]} className="rounded-xl border border-[var(--border)] bg-card p-4 shadow-sm"><p className="text-xs text-[var(--muted-foreground)]">{k[0]}</p><strong className="mt-2 block text-2xl text-[var(--foreground)]">{k[1]}</strong><span className="mt-2 inline-block rounded-full bg-card px-2 py-1 text-[10px] text-[var(--muted-foreground)]">{k[2]}</span></article>)}</div>
        <section className="mt-6 rounded-xl border border-[var(--border)] bg-card p-4"><div className="relative"><Search className="absolute left-3 top-2.5 text-[var(--muted-foreground)]" size={17} /><input value={query} onChange={e => setQuery(e.target.value)} className="w-full rounded-lg border border-[var(--border)] py-2.5 pl-10 pr-20 text-sm outline-none focus:border-[var(--border)]" placeholder="Search keywords, topics, intent, markets..." /><kbd className="absolute right-3 top-2 rounded border bg-card px-1.5 py-1 text-[10px] text-muted-foreground">⌘ K</kbd></div><div className="mt-3 flex flex-wrap items-center gap-2">{['Intent', 'Status', 'Priority', 'Type', 'Visibility', 'Market', 'Search / AI', 'Competitor Coverage'].map(x => <button key={x} className={btn}>{x}<ChevronDown size={12} className="ml-2 inline" /></button>)}<button className="ml-auto text-xs text-[var(--foreground)]">Clear Filters</button><button className={btn}><Filter size={12} className="mr-1 inline" />Save Filter</button></div><div className="mt-4 flex gap-4 overflow-x-auto border-t pt-3 text-xs font-semibold">{['List', 'Topics', 'Opportunities', 'Competitors', 'Intent'].map(x => <button key={x} className={x === 'List' ? 'border-b-2 border-[var(--border)] pb-2 text-[var(--foreground)]' : 'pb-2 text-[var(--muted-foreground)]'}>{x}</button>)}</div></section>
        <Section title="Keyword Trends"><article className="rounded-xl border border-[var(--border)] bg-card p-4"><div className="flex items-center justify-between"><span className="text-xs text-[var(--muted-foreground)]">Portfolio movement over time</span><div className="flex gap-1">{['7D', '30D', '90D', '6M', '12M'].map(x => <button key={x} className={`rounded px-2 py-1 text-[10px] ${x === '90D' ? 'bg-[var(--secondary)] text-[var(--chart-1)]' : 'text-muted-foreground'}`}>{x}</button>)}</div></div><svg viewBox="0 0 900 190" className="mt-3 h-44 w-full" role="img" aria-label="Keyword trends line chart"><path d="M40 20V155H875" fill="none" stroke="var(--border)" /><path d="M40 125 C150 115 190 90 275 110 S420 75 510 88 S650 48 760 64 S830 35 875 42" fill="none" stroke="var(--chart-1)" strokeWidth="3" /><path d="M40 140 C170 130 240 126 330 132 S500 112 600 118 S760 88 875 96" fill="none" stroke="var(--chart-3)" strokeWidth="2" strokeDasharray="8 6" /><path d="M40 150 C180 148 260 145 350 151 S520 132 620 141 S760 122 875 130" fill="none" stroke="var(--chart-5)" strokeWidth="2" strokeDasharray="2 6" /><g fill="var(--muted-foreground)" fontSize="11"><text x="35" y="177">Jan</text><text x="190" y="177">Mar</text><text x="350" y="177">May</text><text x="510" y="177">Jul</text><text x="670" y="177">Sep</text><text x="830" y="177">Nov</text></g></svg><div className="flex flex-wrap gap-5 border-t pt-3 text-xs"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-chart-4" />Rising <b>+94</b></span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Stable <b>1,142</b></span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-chart-1" />Declining <b>48</b></span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-destructive" />Newly Lost <b>12</b></span></div></article></Section>
        <Section title={`Keywords · ${filtered.length === 8 ? '2,847' : filtered.length}`} action="View All"><div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-card"><table className="w-full min-w-[1250px] text-left text-xs"><thead className="bg-[var(--card)] text-[10px] uppercase text-[var(--muted-foreground)]"><tr><th className="px-3 py-3">□</th>{['Keyword', 'Intent', 'Data', 'Difficulty', 'Position', 'Visibility', 'Trend', 'Competition', 'Opportunity', 'Priority', 'SEO', 'GEO', 'AEO', 'Updated', 'Actions'].map(h => <th key={h} className="px-3 py-3">{h}{['Keyword', 'Volume', 'Position', 'Trend'].includes(h) && <span className="ml-1">↕</span>}</th>)}</tr></thead><tbody>{filtered.map(row => <tr key={row[0]} className="border-t border-[var(--border)] hover:bg-[var(--card)]"><td className="px-3"><input type="checkbox" checked={selected.includes(row[0])} onChange={() => setSelected(selected.includes(row[0]) ? selected.filter(x => x !== row[0]) : [...selected, row[0]])} /></td><td className="px-3 py-3 font-semibold">{row[0]}</td><td className="px-3">{pill(row[1])}</td><td className="px-3">{row[2]}</td><td className="px-3">{row[3]}</td><td className="px-3 font-semibold">{row[4]}</td><td className="px-3">{row[5]}</td><td className="px-3 text-foreground">{row[6]}</td><td className="px-3">{row[7]}</td><td className="px-3">{row[8]}</td><td className="px-3">{pill(row[9])}</td>{row.slice(10, 13).map((v, i) => <td key={`${row[0]}-${i}`} className="px-3">{v === '—' ? '—' : <span className="inline-flex items-center gap-1"><i className={`h-2 w-2 rounded-full ${v === 'Gap' ? 'bg-destructive' : v === 'Opportunity' ? 'bg-primary' : 'bg-primary'}`} />{v}</span>}</td>)}<td className="px-3 text-[var(--muted-foreground)]">{row[13]}</td><td className="px-3"><button className="text-[var(--foreground)]">View</button></td></tr>)}</tbody></table><div className="flex items-center justify-between border-t p-3 text-xs text-[var(--muted-foreground)]">Showing 8 of 2,847 <span>1&nbsp;&nbsp;2&nbsp;&nbsp;3&nbsp;&nbsp;...&nbsp;&nbsp;356 <ChevronRight size={13} className="inline" /></span></div></div>{selected.length > 0 && <div className="mt-2 flex items-center gap-2 rounded-lg bg-[var(--secondary)] p-3 text-xs text-foreground">{selected.length} selected <button className="ml-auto rounded bg-[var(--primary)] px-2 py-1 text-primary-foreground">Create Content Opportunities</button><button className="rounded border border-border px-2 py-1">Export</button></div>}</Section>
        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]"><Section title="Keyword Topics" action="View All Topics"><article className="rounded-xl border border-[var(--border)] bg-card">{topics.map(t => <div key={t[0]} className="border-b p-4 last:border-0"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm">{t[0]}</strong>{pill(`${t[1]} keywords`)}<span className="ml-auto text-xs text-[var(--muted-foreground)]">{t[3]} · {t[4]}</span></div><p className="mt-1 text-xs text-[var(--muted-foreground)]">Primary: {t[2]}</p><div className="mt-3 flex items-center gap-3"><div className="h-1.5 flex-1 rounded-full bg-secondary"><div className="h-full rounded-full bg-[var(--primary)] text-primary-foreground" style={{
                      width: `${t[5]}%`
                    }} /></div><span className="text-[10px] text-muted-foreground">{t[5]}% coverage</span><button className="text-[10px] font-semibold text-[var(--foreground)]">View Topic</button></div></div>)}</article></Section><Section title="AI Keyword Clustering"><article className="rounded-xl bg-[var(--card)] p-5 text-foreground"><AI /><h3 className="mt-3 text-lg font-bold"><Sparkles size={17} className="mr-1 inline text-[var(--foreground)]" />AI Keyword Clustering</h3><p className="mt-2 text-sm leading-6 text-[var(--foreground)]">Lulu AI can semantically cluster your keywords into strategic topic groups based on intent, context and business relevance.</p><p className="mt-4 text-xs text-[var(--muted-foreground)]">Last clustered: 2 days ago</p><div className="mt-4 flex flex-wrap gap-2"><button className="rounded bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground">Cluster Keywords</button><button className="rounded border border-border px-3 py-2 text-xs">Rename Cluster</button><button className="rounded border border-border px-3 py-2 text-xs">Merge Clusters</button></div><div className="mt-5 border-t border-border pt-4 text-sm"><b>18 clusters</b><span className="mx-2 text-muted-foreground">·</span><b>2,847 keywords organized</b></div><p className="mt-3 text-[11px] text-muted-foreground">Topic clustering requires your review before applying changes.</p></article></Section></div>
        <div className="grid gap-4 xl:grid-cols-2"><Section title="Keyword Opportunities · 342" action="View All"><article className="space-y-3">{opportunities.map(o => <div key={o[0]} className="rounded-xl border border-[var(--border)] bg-card p-4"><div className="flex gap-3"><Sparkles className="mt-1 text-[var(--foreground)]" size={17} /><div className="flex-1"><div className="flex justify-between"><h3 className="font-semibold">{o[0]}</h3><b className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--border)] text-[var(--foreground)]">{o[1]}</b></div><p className="mt-1 text-xs text-[var(--muted-foreground)]">{pill(o[2])} <span className="ml-2">{o[3]}</span></p><p className="mt-2 text-[11px] text-[var(--foreground)]">{o[4]} · AI Inferred</p><button className={`${btn} mt-3`}>View Opportunity</button><button className="ml-2 rounded-md bg-[var(--primary)] px-2.5 py-1.5 text-xs font-semibold text-primary-foreground">Create Content</button></div></div></div>)}</article></Section><Section title="Keyword Gaps · 186" action="View All"><article className="space-y-3">{gaps.map(g => <div key={g[0]} className="rounded-xl border border-[var(--border)] bg-card p-4"><div className="flex gap-3"><AlertTriangle size={17} className="mt-1 text-chart-5" /><div className="flex-1"><h3 className="font-semibold">{g[0]}</h3><p className="mt-2 text-xs text-[var(--muted-foreground)]">Competitors: {g[1]}</p><div className="mt-2 flex gap-2">{pill(`Your position: ${g[2]}`, 'red')}{pill(g[3])}</div><button className={`${btn} mt-3`}>Create Opportunity</button><button className="ml-2 rounded-md bg-[var(--primary)] px-2.5 py-1.5 text-xs font-semibold text-primary-foreground">Create Content</button></div></div></div>)}</article></Section></div>
        <Section title="Competitor Keyword Analysis"><article className="rounded-xl border border-[var(--border)] bg-card p-5"><div className="flex flex-wrap gap-2"><span className="text-xs text-[var(--muted-foreground)]">Compared with:</span>{['HubSpot', 'Salesforce', 'Pipedrive'].map(x => <button key={x} className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">{x}</button>)}<button className={btn}><Plus size={12} className="mr-1 inline" />Add Competitor</button></div><svg viewBox="0 0 800 190" className="mt-5 h-44 w-full" role="img" aria-label="Competitor keyword overlap diagram"><circle cx="345" cy="90" r="72" fill="var(--chart-4)" fillOpacity=".28" stroke="var(--chart-4)" /><circle cx="455" cy="90" r="72" fill="var(--chart-5)" fillOpacity=".24" stroke="var(--chart-5)" /><ellipse cx="400" cy="90" rx="33" ry="70" fill="var(--chart-1)" fillOpacity=".8" /><text x="270" y="94" fontSize="13" fill="var(--chart-4)">Unique to Us</text><text x="367" y="94" fontSize="13" fontWeight="bold">Shared</text><text x="512" y="94" fontSize="13" fill="var(--chart-5)">Competitor Only</text><g fontSize="14" fontWeight="bold"><text x="302" y="120">1,284</text><text x="385" y="120">842</text><text x="500" y="120">2,418</text></g></svg><div className="grid grid-cols-2 gap-3 border-t pt-4 sm:grid-cols-4">{[['Shared Keywords', '842'], ['Unique to Us', '1,284'], ["We're Beating", '284'], ["They're Beating", '558']].map(s => <div key={s[0]}><p className="text-xs text-muted-foreground">{s[0]}</p><b className="text-xl text-[var(--foreground)]">{s[1]}</b></div>)}</div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-xs"><thead className="border-b text-[10px] uppercase text-muted-foreground"><tr>{['Keyword', 'Their Position', 'Your Position', 'Intent', 'Gap Score', 'Action'].map(x => <th key={x} className="px-2 py-2">{x}</th>)}</tr></thead><tbody>{[['crm automation software', '#2', '#18', 'Commercial', '92'], ['ai workflow platform', '#4', '#8', 'Transactional', '76'], ['business intelligence ai', '#6', '#22', 'Commercial', '68'], ['marketing ai tools', '#3', 'No Data', 'Commercial', '88'], ['enterprise process automation', '#7', '#14', 'Transactional', '64']].map(r => <tr key={r[0]} className="border-b"><td className="px-2 py-2 font-medium">{r[0]}</td><td className="px-2 text-chart-5">{r[1]}</td><td className="px-2 text-foreground">{r[2]}</td><td className="px-2">{r[3]}</td><td className="px-2">{r[4]}</td><td className="px-2 text-[var(--chart-1)]">View</td></tr>)}</tbody></table></div></article></Section>
        <div className="grid gap-4 xl:grid-cols-[.9fr_1.1fr]"><Section title="Search Intent"><article className="rounded-xl border border-[var(--border)] bg-card p-5"><div className="flex flex-wrap items-center justify-center gap-5"><svg viewBox="0 0 220 220" className="h-52 w-52" role="img" aria-label="Search intent donut chart"><circle cx="110" cy="110" r="72" fill="none" stroke="var(--border)" strokeWidth="28" /><circle cx="110" cy="110" r="72" fill="none" stroke="var(--chart-3)" strokeWidth="28" strokeDasharray="172 280" transform="rotate(-90 110 110)" /><circle cx="110" cy="110" r="72" fill="none" stroke="var(--chart-1)" strokeWidth="28" strokeDasharray="126 326" strokeDashoffset="-172" transform="rotate(-90 110 110)" /><circle cx="110" cy="110" r="72" fill="none" stroke="var(--chart-2)" strokeWidth="28" strokeDasharray="82 370" strokeDashoffset="-298" transform="rotate(-90 110 110)" /><text x="110" y="106" textAnchor="middle" fontSize="14" fontWeight="bold">2,847</text><text x="110" y="124" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">Keywords</text></svg><div className="space-y-2">{intents.map(i => <div key={i[0]} className="flex items-center gap-2 text-xs"><i className="h-2.5 w-2.5 rounded-full" style={{
                      background: i[3]
                    }} /><span className="w-24">{i[0]}</span><b>{i[1]}</b><span className="text-muted-foreground">{i[2]} ↗</span></div>)}</div></div></article></Section><Section title="Intent Detail"><article className="overflow-x-auto rounded-xl border border-[var(--border)] bg-card"><table className="w-full min-w-[600px] text-left text-xs"><thead className="bg-[var(--card)] text-[10px] uppercase text-muted-foreground"><tr>{['Intent', 'Keywords', 'Ranking', 'Opportunities', 'Avg Position', 'AI Coverage'].map(x => <th key={x} className="px-3 py-3">{x}</th>)}</tr></thead><tbody>{intents.map(i => <tr key={i[0]} className="border-t"><td className="px-3 py-3">{pill(i[0])}</td><td className="px-3">{i[1]}</td><td className="px-3">{i[0] === 'Commercial' ? '398' : '—'}</td><td className="px-3 text-[var(--foreground)]">{i[0] === 'Commercial' ? '142' : '—'}</td><td className="px-3">{i[0] === 'Navigational' ? '#3' : '—'}</td><td className="px-3">{pill('AI Classified', 'purple')}</td></tr>)}</tbody></table></article></Section></div>
        <Section title="SEO / GEO / AEO Keyword Intelligence"><div className="grid gap-4 xl:grid-cols-3">{[['SEO Keyword Intelligence', 'Active', 'Ranking: 1,284 · Improving: 142 · Declining: 48 · Not Ranking: 1,563', 'ai business automation software · #8', '12 keywords have potential cannibalization issues', 'Open SEO', 'Create SEO Opportunity'], ['GEO Keyword Intelligence', 'Active', 'AI Query Coverage: 384 · Brand Mentions: 218 · Citation Present: 94 · Competitor Present: 312', 'how to automate business processes · High', 'AI Inferred metrics should be reviewed before acting.', 'Open GEO', 'Create GEO Opportunity'], ['AEO Keyword Intelligence', 'Active', 'Question Coverage: 284 · Answer Visibility: 142 · Featured Opportunities: 48 · Competitor Answers: 218', 'what is an ai business operating system · #6', 'Expand coverage for frequently asked customer questions.', 'Open AEO', 'Create AEO Opportunity']].map(c => <article key={c[0]} className="rounded-xl border border-[var(--border)] bg-card p-5"><div className="flex items-center justify-between"><h3 className="font-bold">{c[0]}</h3>{pill(c[1], c[0].startsWith('SEO') ? 'green' : c[0].startsWith('GEO') ? undefined : 'blue')}</div><p className="mt-4 text-xs leading-6">{c[2]}</p><p className="mt-4 rounded-lg bg-card p-3 text-xs font-medium">Top: {c[3]}</p><p className="mt-3 text-xs text-[var(--foreground)]">⚠ {c[4]}</p><div className="mt-4 flex gap-2"><button className="text-xs font-semibold text-[var(--foreground)]">{c[5]}</button><button className="rounded bg-[var(--primary)] px-2 py-1 text-[10px] font-semibold text-primary-foreground">{c[6]}</button></div></article>)}</div></Section>
        <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]"><Section title="Content Coverage"><article className="rounded-xl border border-[var(--border)] bg-card p-5"><p className="text-xs text-muted-foreground">Covered: 68% · Partial: 18% · Not Covered: 14%</p><div className="mt-3 flex h-2 overflow-hidden rounded-full"><div className="w-[68%] bg-primary text-primary-foreground" /><div className="w-[18%] bg-primary text-primary-foreground" /><div className="w-[14%] bg-destructive" /></div>{[['ai business automation software', 'Business Automation', '/solutions/automation', 'Covered'], ['marketing automation tools', 'Marketing Automation', '—', 'Not Covered'], ['enterprise workflow automation', 'Workflow', '/platform', 'Partial'], ['ai crm software', 'CRM', '/products/crm', 'Covered'], ['business intelligence ai', 'AI & ML', '/insights', 'Outdated']].map(r => <div key={r[0]} className="grid grid-cols-[1.4fr_1fr_.8fr_.7fr] gap-2 border-b py-3 text-xs"><span className="font-medium">{r[0]}</span><span className="text-muted-foreground">{r[1]}</span><span className="text-muted-foreground">{r[2]}</span>{pill(r[3], r[3] === 'Covered' ? 'green' : r[3] === 'Not Covered' ? 'red' : undefined)}</div>)}</article></Section><Section title="Keyword Cannibalization"><article className="rounded-xl border border-[var(--border)] bg-card p-5"><div className="mb-3">{pill('12 issues', 'red')}</div>{[['business automation', '/automation · #8', '/platform · #12'], ['ai crm software', '/crm · #18', '/solutions · #24'], ['workflow automation', '/workflow · #14', '/guides · #19']].map(r => <div key={r[0]} className="border-b py-3"><p className="text-sm font-semibold">{r[0]}</p><p className="mt-1 text-xs text-muted-foreground">{r[1]} · {r[2]} · Traffic split</p><button className={`${btn} mt-2`}>Consolidate</button><button className="ml-2 text-xs text-[var(--foreground)]">Review</button></div>)}<p className="mt-3 text-[11px] text-muted-foreground">No automatic URL changes will be made. Review required.</p></article></Section></div>
        <Section title="Keyword Prioritization"><article className="rounded-xl bg-[var(--card)] p-5 text-foreground"><div className="flex flex-wrap items-center gap-3"><AI /><h2 className="text-lg font-bold">Keyword Prioritization</h2></div><p className="mt-3 max-w-3xl text-sm text-foreground">Priority scores are calculated from business relevance, search demand, intent, competition, visibility, and strategic fit.</p><div className="mt-4 flex flex-wrap gap-2">{['Business Relevance', 'Search Demand', 'Intent', 'Competition', 'Current Visibility', 'Strategic Fit'].map(x => <span key={x} className="rounded-full border border-border px-2 py-1 text-[10px] text-foreground">{x}</span>)}</div><div className="mt-5 grid gap-4 md:grid-cols-3">{[['Critical', ['enterprise ai platform', 'marketing automation platform', 'ai business growth platform']], ['High', ['ai crm software', 'automate business workflows', 'enterprise workflow automation']], ['Medium', ['business intelligence ai', 'workflow management software', 'content automation tools']]].map(p => <div key={String(p[0])}><div className="mb-2 flex justify-between"><b>{p[0]}</b>{pill(`${(p[1] as string[]).length} keywords`, p[0] === 'Critical' ? 'red' : undefined)}</div>{(p[1] as string[]).map(x => <div key={x} className="border-b border-border py-2 text-xs"><span>{x}</span><div className="mt-1 h-1 rounded bg-muted"><span className="block h-full w-3/4 bg-[var(--primary)] text-primary-foreground" /></div><small className="text-muted-foreground">High business relevance, gap vs competitors · View</small></div>)}</div>)}</div><p className="mt-4 text-[11px] text-muted-foreground">Priority scores are based on available data. Estimated or AI Inferred scores should be reviewed before acting.</p></article></Section>
        <Section title="Lulu AI Keyword Analysis"><article className="rounded-xl bg-[var(--card)] p-5 text-foreground"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold"><Sparkles size={17} className="mr-2 inline text-[var(--foreground)]" />Lulu AI Keyword Analysis</h2><span><AI /> <small className="ml-2 text-muted-foreground">Analyzed 3 hours ago</small></span></div><div className="mt-5 grid gap-5 md:grid-cols-5">{[['Overview', 'Your keyword portfolio is healthy with strong branded visibility, while commercial gaps create clear growth levers.'], ['Strengths', 'Strong ranking position for branded and navigational terms · High GEO coverage for AI queries · Healthy topic depth'], ['Weaknesses', 'Limited visibility for high-commercial-intent terms · Content coverage gap for marketing automation · Competitor pressure'], ['Opportunities', 'Expand enterprise AI platform content · Close HubSpot gaps · Improve AEO question coverage'], ['Risks', 'Competitor rapidly gaining core commercial rankings · Cannibalization · Estimated data needs validation']].map(c => <div key={c[0]}><h3 className={`text-xs font-bold ${c[0] === 'Strengths' ? 'text-chart-4' : c[0] === 'Weaknesses' ? 'text-[var(--chart-1)]' : c[0] === 'Risks' ? 'text-chart-5' : 'text-foreground'}`}>{c[0]}</h3><p className="mt-2 text-xs leading-5 text-foreground">{c[1]}</p></div>)}</div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-[11px] text-muted-foreground"><span>Sources: Website · SEO Data · Competitor Intelligence · GEO Monitoring · AEO Monitoring · Confidence: High</span><button className="rounded bg-[var(--primary)] px-3 py-2 font-semibold text-primary-foreground">Run Full Keyword Analysis</button></div></article></Section>
        <Section title="Lulu AI Recommendations"><div className="grid gap-3 md:grid-cols-2">{['Prioritize high-intent keywords with strong business relevance and limited current visibility', 'Create content for the uncovered Marketing Automation topic cluster (167 keywords, 24% content coverage)', 'Address keyword gaps where HubSpot and Salesforce have dominant visibility', 'Expand AEO coverage for frequently asked customer and prospect questions'].map((x, i) => <article key={x} className="rounded-xl border-l-4 border-[var(--border)] border-y border-r border-[var(--border)] bg-card p-4"><Sparkles size={17} className="text-[var(--foreground)]" /><h3 className="mt-2 text-sm font-bold">{x}</h3><div className="mt-2">{pill(i === 0 ? 'Critical' : 'High')}</div><p className="mt-2 text-xs text-muted-foreground">Lulu AI found a material opportunity based on connected business and search data.</p><div className="mt-3 flex gap-2"><button className={btn}>Review</button><button className={btn}>Create Opportunity</button><button className="rounded bg-[var(--primary)] px-2 py-1 text-xs font-semibold text-primary-foreground">Create Content</button></div></article>)}</div><p className="mt-3 text-xs text-muted-foreground">AI recommendations require your review and confirmation. No content or SEO changes are applied automatically.</p></Section>
        <Section title="Keyword Alerts" action="Configure Alerts"><article className="rounded-xl border border-[var(--border)] bg-card">{[['Critical', 'Ranking lost: ‘enterprise workflow software’ dropped from #12 to #28 in 7 days', '2h ago', 'red'], ['Warning', 'Competitor HubSpot gained ranking for ‘ai business automation’ (now #4)', '6h ago', 'amber'], ['Opportunity', 'Rising keyword: ‘ai business operating system’ up +340% in 30 days', '1d ago', 'green'], ['Info', 'New keyword discovered: ‘autonomous business ai’ — AI Inferred trend', '1d ago', 'blue'], ['Warning', '12 potential keyword cannibalization issues detected', '2d ago', 'amber']].map(a => <div key={a[1]} className="flex flex-wrap items-center gap-3 border-b p-4 last:border-0"><i className={`h-2.5 w-2.5 rounded-full ${a[3] === 'red' ? 'bg-destructive' : a[3] === 'green' ? 'bg-chart-4' : a[3] === 'blue' ? 'bg-primary' : 'bg-primary'}`} /><span className="flex-1 text-sm">{a[1]}</span><small className="text-muted-foreground">{a[2]}</small><button className="text-xs font-semibold text-[var(--foreground)]">View</button><button aria-label="Dismiss alert"><X size={14} className="text-muted-foreground" /></button></div>)}</article></Section>
        <Section title="Monitoring"><div className="grid gap-3 md:grid-cols-4">{([['Position Monitoring', '2,847 keywords', Eye], ['Visibility Monitoring', 'Active', Activity], ['GEO Visibility', '384 queries', Globe2], ['AEO Visibility', '284 questions', Zap]] as [string, string, typeof Eye][]).map(s => {
              const Icon = s[2];
              return <article key={s[0]} className="rounded-xl border border-[var(--border)] bg-card p-4"><Icon size={18} className="text-[var(--chart-1)]" /><p className="mt-3 text-xs text-muted-foreground">{s[0]}</p><b className="mt-1 block text-lg">{s[1]}</b><span className="mt-2 block text-[10px] text-chart-4">● Active · checked 12m ago</span></article>;
            })}</div><button className="mt-3 text-xs font-semibold text-[var(--foreground)]">Manage Monitoring <ChevronRight size={13} className="inline" /></button></Section>
        <Section title="Discover Keywords with Lulu AI"><article className="rounded-xl border border-[var(--border)] bg-card p-5"><div className="flex items-center gap-2"><Sparkles className="text-[var(--foreground)]" /><h2 className="text-lg font-bold">Discover Keywords with Lulu AI</h2></div><p className="mt-2 text-sm text-muted-foreground">Lulu AI analyzes your company, products, markets, audiences, website and competitors to surface keyword opportunities you may be missing.</p><div className="mt-4 flex flex-wrap gap-2">{['Company Info', 'Products & Services', 'Markets', 'Website', 'Competitor Intelligence', 'Existing Keywords'].map(x => <span key={x} className="rounded-full bg-secondary px-2 py-1 text-[10px]">{x}</span>)}</div><div className="mt-4 divide-y">{discovered.map(d => <div key={d[0]} className="flex flex-wrap items-center gap-3 py-3 text-xs"><Sparkles size={15} className="text-[var(--foreground)]" /><b className="w-48">{d[0]}</b>{pill(d[1])}<span className="text-muted-foreground">{d[2]} · Relevance: {d[3]}</span>{pill(d[4])}<span className="rounded bg-secondary px-2 py-1 text-[10px] text-foreground">AI Inferred</span><div className="ml-auto flex gap-1"><button className={btn}>Add</button><button className="rounded bg-[var(--primary)] px-2 py-1 text-[10px] font-semibold text-primary-foreground">Add & Track</button><button className="text-foreground">Dismiss</button></div></div>)}</div><button className="mt-4 rounded bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground">Discover More Keywords</button><p className="mt-3 text-[11px] text-muted-foreground">Suggested keywords are AI-generated. Review before adding to your keyword portfolio.</p></article></Section>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{[['No Keywords Yet', 'Add Keyword', 'Discover with Lulu AI'], ['No Keywords Found', 'Clear Filters', ''], ['Keyword Intelligence Is Limited', 'Connect Integration', ''], ["Keyword Intelligence Couldn’t Be Loaded", 'Try Again', ''], ['Keyword Intelligence Restricted', 'Request access', '']].map(s => <article key={s[0]} className="rounded-xl border border-dashed border-[var(--border)] bg-card p-4"><Search size={17} className="text-muted-foreground" /><h3 className="mt-3 text-sm font-bold">{s[0]}</h3><button className="mt-4 rounded bg-[var(--primary)] px-2 py-1 text-xs font-semibold text-primary-foreground">{s[1]}</button>{s[2] && <button className="ml-2 rounded border px-2 py-1 text-xs">{s[2]}</button>}</article>)}</div>
      </div></main>
      {drawer && <aside className="fixed bottom-0 right-0 top-14 z-20 w-full max-w-[390px] overflow-y-auto border-l border-[var(--border)] bg-card p-5 shadow-2xl"><div className="flex items-start justify-between gap-3"><h2 className="text-lg font-bold">ai business automation software</h2><button onClick={() => setDrawer(false)} aria-label="Close keyword details"><X size={18} /></button></div><p className="mt-2 text-xs text-muted-foreground">Intent: Commercial · Topic: Business Automation<br />Market: Germany, Austria · Language: DE, EN</p><div className="mt-4 flex flex-wrap gap-2">{pill('Ranking #8')}{pill('Critical')}{pill('Visibility: High', 'green')}</div><svg viewBox="0 0 330 70" className="mt-5 w-full" role="img" aria-label="30 day keyword position sparkline"><path d="M5 58 C35 45 45 50 65 38 S95 42 115 30 S145 36 165 25 S195 31 218 20 S250 28 275 12 S300 22 325 8" fill="none" stroke="var(--chart-1)" strokeWidth="3" /></svg><div className="grid grid-cols-2 gap-3 border-y py-4 text-xs">{[['Position', '#8'], ['Visibility', 'High'], ['Clicks', 'No Data'], ['Impressions', 'No Data'], ['CTR', 'No Data'], ['Traffic', 'No Data']].map(m => <div key={m[0]}><span className="text-muted-foreground">{m[0]}</span><b className="mt-1 block">{m[1]}</b></div>)}</div><h3 className="mt-5 text-sm font-bold">Related URLs</h3><p className="mt-2 text-xs text-[var(--foreground)]">/solutions/business-automation<br />/platform/automation</p><h3 className="mt-5 text-sm font-bold">Competitors</h3><p className="mt-2 text-xs text-muted-foreground">HubSpot #4 · Salesforce #7 · Pipedrive #11</p><p className="mt-4 text-xs">SEO: {pill('Active', 'green')} GEO: {pill('Active', 'green')} AEO: {pill('Opportunity')}</p><div className="mt-5 grid grid-cols-2 gap-2"><button className={btn}>Edit</button><button className={btn}>Track</button><button className="rounded bg-[var(--primary)] px-2 py-2 text-xs font-semibold text-primary-foreground">Create Opportunity</button><button className={btn}>Create Content</button><button className="col-span-2 rounded bg-[var(--primary)] px-2 py-2 text-xs font-semibold text-primary-foreground"><Sparkles size={13} className="mr-1 inline text-[var(--foreground)]" />Ask Lulu AI</button></div><p className="mt-5 rounded bg-sidebar p-3 text-[11px] text-muted-foreground">Clicks, Impressions, CTR and Traffic require connected analytics integration.</p></aside>}
      {modal && <div className="fixed bottom-4 left-4 z-30 hidden w-[350px] rounded-xl border border-[var(--border)] bg-card p-5 shadow-2xl lg:block"><div className="flex items-center justify-between"><h2 className="font-bold">Add Keyword</h2><button onClick={() => setModal(false)} aria-label="Close add keyword"><X size={17} /></button></div><div className="mt-4 space-y-3"><label className="block text-xs font-semibold">Keyword<input className="mt-1 w-full rounded border p-2 text-xs" defaultValue="ai business automation software" /></label><div className="grid grid-cols-2 gap-2"><label className="text-xs font-semibold">Market<select className="mt-1 w-full rounded border p-2 text-xs"><option>Germany</option><option>Austria</option><option>Switzerland</option><option>UK</option></select></label><label className="text-xs font-semibold">Language<select className="mt-1 w-full rounded border p-2 text-xs"><option>DE, EN</option><option>EN</option></select></label></div><div className="grid grid-cols-2 gap-2"><label className="text-xs font-semibold">Intent<select className="mt-1 w-full rounded border p-2 text-xs"><option>Commercial</option><option>Transactional</option></select></label><label className="text-xs font-semibold">Priority<select className="mt-1 w-full rounded border p-2 text-xs"><option>Critical</option><option>High</option></select></label></div><label className="block text-xs font-semibold">Topic<select className="mt-1 w-full rounded border p-2 text-xs"><option>Business Automation</option><option>Create new topic</option></select></label><label className="flex items-center gap-2 text-xs"><input type="checkbox" defaultChecked />Track this keyword</label></div><div className="mt-5 flex justify-end gap-2"><button onClick={() => setModal(false)} className={btn}>Cancel</button><button className="rounded bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground">Add Keyword</button></div></div>}
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
