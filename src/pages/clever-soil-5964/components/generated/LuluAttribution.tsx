import { useState } from 'react';
import { Activity, BarChart3, CalendarDays, Check, ChevronDown, CircleHelp, Download, FileText, Globe2, LayoutGrid, Menu, RefreshCw, Search, Settings2, Sparkles, Star, Target, Users, X } from 'lucide-react';
type Tone = 'slate' | 'violet' | 'green' | 'amber' | 'red';
const summary = [['Total Attributed Revenue', '€284,700', 'Modeled'], ['Attributed Conversions', '1,842', 'Modeled'], ['Top Contributing Channel', 'Google Search', 'Data-Driven'], ['Top Contributing Campaign', 'Q4 Brand Campaign', 'Modeled'], ['Assisted Conversions', '3,218', 'Observed'], ['Attribution Coverage', '78.4%', 'Good'], ['Attribution Model', 'Data-Driven', 'Active model']];
const channels = [['Google Search', '€91,400', '32.1%', '412', '1,180'], ['Meta Ads', '€79,800', '28.0%', '389', '840'], ['Organic Search', '€58,200', '20.4%', '298', '920'], ['Email', '€31,600', '11.1%', '201', '1,140'], ['Direct', '€14,800', '5.2%', '98', '210'], ['Referral', '€8,900', '3.1%', '44', '118']];
const campaigns = [['Q4 Brand Campaign', 'Google Ads', '€18,400', '201', '€48,200', '16.9%', '2.62x'], ['Retargeting — Cart', 'Meta Ads', '€9,800', '184', '€41,600', '14.6%', '4.24x'], ['Search — Non-Brand', 'Google Ads', '€12,200', '156', '€32,100', '11.3%', '2.63x'], ["Newsletter Oct ’24", 'Email', '€0', '142', '€28,800', '10.1%', '—'], ['Prospecting EU', 'Meta Ads', '€14,100', '98', '€19,400', '6.8%', '1.38x']];
const modelRows = [['Google Search', '38%', '18%', '25%', '27%', '32%', '32%'], ['Meta Ads', '19%', '34%', '28%', '30%', '25%', '28%'], ['Organic Search', '28%', '14%', '22%', '18%', '22%', '20%'], ['Email', '8%', '26%', '16%', '18%', '14%', '11%'], ['Direct', '4%', '6%', '6%', '5%', '5%', '5%'], ['Referral', '3%', '2%', '3%', '2%', '2%', '4%']];
const touchpoints = [['Ad Click', 'Google Search', '1.2', '2.4 / journey', 'High'], ['Website Visit', 'Organic', '1.8', '1.9 / journey', 'Medium'], ['Email Interaction', 'Email', '3.1', '1.2 / journey', 'Frequent assist'], ['Product View', 'Direct', '3.8', '2.1 / journey', 'Medium'], ['Retargeting Click', 'Meta Ads', '4.2', '1.8 / journey', 'High'], ['Purchase / Conversion', 'Final', '—', '1.0 / journey', 'Final']];
const paths = [['Google Search → Website → Purchase', '624 journeys', 'CR: 8.2%', '€142', '1.4 days'], ['Google Search → Meta Retargeting → Email → Purchase', '398 journeys', 'CR: 6.8%', '€189', '7.2 days'], ['Organic Search → Email → Purchase', '312 journeys', 'CR: 7.1%', '€167', '4.8 days'], ['Meta Ads → Website → Google Search → Purchase', '218 journeys', 'CR: 5.4%', '€214', '11.3 days']];
const insights = [['Organic Search is under-recognized in last-touch models', 'First-touch 28%, Last-touch 14% · 920 assisted conversions', 'High'], ['Email drives high-value assists', 'Appears in 61.9% of journeys as an assist before high-value purchases', 'High'], ['Model discrepancy is significant for Meta Ads', 'Credit ranges from 19% First Touch to 34% Last Touch', 'High'], ['21.6% of conversions remain unattributed', 'Tracking or consent limitations may explain the gap', 'Medium']];
const sources = [['Google Analytics', '45 min ago', 'Excellent'], ['Google Ads', '1h ago', 'Good'], ['Meta Ads', '2h ago', 'Good'], ['Shopify', '20 min ago', 'Excellent'], ['Email Platform', '3h ago', 'Good'], ['CRM', '30 min ago', 'Excellent'], ['LinkedIn Ads', '8h ago', 'Limited']];
const Badge = ({
  children,
  tone = 'slate'
}: {
  children: React.ReactNode;
  tone?: Tone;
}) => <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${tone === 'violet' ? 'bg-secondary text-foreground' : tone === 'green' ? 'bg-chart-4/10 text-chart-4' : tone === 'red' ? 'bg-chart-5/10 text-chart-5' : tone === 'amber' ? 'bg-chart-1/10 text-chart-1' : 'bg-secondary text-muted-foreground'}`}>{children}</span>;
const Section = ({
  title,
  subtitle,
  children,
  action,
  tone = 'slate'
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  tone?: Tone;
}) => <section className={`mb-5 rounded-xl border bg-card p-5 shadow-[0_3px_16px_rgba(0,0,0,.045)] ${tone === 'violet' ? 'border-border' : tone === 'green' ? 'border-chart-4/30' : tone === 'red' ? 'border-chart-5/30' : 'border-border'}`}><header className="mb-4 flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-[16px] font-semibold tracking-[-.02em] text-foreground">{title}</h2>{subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}</div>{action}</header>{children}</section>;
export const LuluAttribution = () => {
  const [query, setQuery] = useState('');
  const [adOpen, setAdOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(true);
  const [journey, setJourney] = useState('Aggregated');
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 700);
  };
  return <div className="min-h-screen bg-[var(--background)] font-sans text-foreground"><aside className="fixed inset-y-0 left-0 z-20 hidden w-[68px] flex-col items-center border-r border-border bg-[var(--sidebar)] py-5 lg:flex"><div className="mb-8 flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">L</div><LuluSectionNavigation activeId="clever-soil-5964" /><button className="rounded-lg p-3 text-foreground" aria-label="Help"><CircleHelp size={19} /></button><div className="mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-foreground">AM</div></aside>
 <main className="lg:ml-[68px]"><div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-8 lg:px-10"><header className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div><button className="mb-3 lg:hidden" aria-label="Open navigation"><Menu size={22} /></button><p className="mb-3 text-xs text-muted-foreground">Intelligence <span className="mx-2">/</span> Analytics <span className="mx-2">/</span> <span className="font-medium text-foreground">Attribution</span></p><h1 className="text-3xl font-bold tracking-[-.05em] text-foreground sm:text-[38px]">Attribution</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Understand which channels, campaigns and customer touchpoints contribute to conversions, revenue and growth.</p></div><div className="flex flex-wrap gap-2"><button className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary"><Sparkles size={14} />Ask Lulu AI</button><button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-secondary px-3 text-xs font-medium text-foreground"><Settings2 size={14} />Configure Attribution</button><button className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs text-foreground"><Download size={14} />Export</button><button onClick={refresh} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground" aria-label="Refresh"><RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /></button></div></header>
 <section className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">{summary.map(item => <article key={item[0]} className="rounded-xl border border-border bg-card px-4 py-4 shadow-[0_3px_12px_rgba(0,0,0,.035)]"><p className="text-[11px] leading-4 text-muted-foreground">{item[0]}</p><strong className="mt-2 block truncate text-xl font-semibold tracking-[-.04em] text-foreground">{item[1]}</strong><Badge tone={item[2] === 'Active model' ? 'violet' : 'slate'}>{item[2]}</Badge></article>)}</section>
 <section className="mb-5 rounded-xl border border-border bg-card p-4"><div className="flex items-center gap-3 rounded-lg border border-border bg-secondary px-4 py-3"><Search size={18} className="text-muted-foreground" /><input value={query} onChange={e => setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search channels, campaigns, touchpoints, customers..." aria-label="Search attribution" /><kbd className="hidden rounded border border-border bg-card px-2 py-1 text-[10px] text-muted-foreground sm:block">⌘ K</kbd></div><div className="mt-3 flex gap-2 overflow-x-auto">{['Google Ads', 'Meta Ads', 'Organic Search', 'Email', 'Q4 Campaign', 'Direct'].map(chip => <button key={chip} onClick={() => setQuery(chip)} className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:border-border hover:text-foreground">{chip}</button>)}<span className="ml-auto hidden items-center gap-1 text-xs text-muted-foreground md:flex"><Star size={13} /> Favorites</span></div>{query && <p className="mt-3 text-xs text-foreground">Suggestions for <strong>{query}</strong> · Channels · Campaigns · Touchpoints</p>}</section>
 <Section title="Attribution Configuration" subtitle="Define the outcome and journey window used for this analysis." action={<Badge tone="violet">Data-Driven active</Badge>}><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">{[['Objective', 'Revenue', 'Conversions · New Customers · Leads'], ['Conversion Event', 'Purchase', 'Lead · Signup · Demo Request'], ['Attribution Model', 'Data-Driven', 'First Touch · Last Touch · Linear'], ['Lookback Window', '30 Days', '7 · 14 · 60 · 90 Days · Custom'], ['Date Range', 'Last 30 Days', 'Select date range']].map(item => <label key={item[0]} className="text-xs font-medium text-muted-foreground">{item[0]}<select className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-xs text-foreground"><option>{item[1]}</option><option>{item[2]}</option></select></label>)}</div><p className="mt-4 text-[11px] text-muted-foreground">The lookback window determines how far before a conversion Lulu AI considers eligible touchpoints for attribution.</p></Section>
 <div className="grid gap-5 xl:grid-cols-2"><Section title="Attributed Revenue" action={<Badge tone="green">Coverage 78.4% · Good</Badge>}><div className="grid grid-cols-3 gap-3">{[['Observed Revenue', '€363,200', 'Observed'], ['Attributed Revenue', '€284,700', '78.4% · Attributed'], ['Unattributed Revenue', '€78,500', '21.6% · Unattributed']].map((item, i) => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><strong className="mt-1 block text-xl text-foreground">{item[1]}</strong><Badge tone={i === 1 ? 'violet' : 'slate'}>{item[2]}</Badge></div>)}</div><div className="mt-5 flex h-3 overflow-hidden rounded-full bg-secondary" role="img" aria-label="78.4 percent attributed revenue and 21.6 percent unattributed"><div className="bg-primary text-primary-foreground" style={{
                width: '78.4%'
              }} /><div className="bg-muted" style={{
                width: '21.6%'
              }} /></div><p className="mt-3 text-[11px] italic text-muted-foreground">Attributed Revenue reflects modeled contribution based on the selected attribution model. This is not a causal measurement.</p></Section><Section title="Attributed Conversions" subtitle="Observed conversion volume with modeled credit distribution."><div className="grid grid-cols-4 gap-3">{[['Total Conversions', '2,348'], ['Attributed', '1,842'], ['Unattributed', '506'], ['Assisted', '3,218']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><strong className="mt-1 block text-xl text-foreground">{item[1]}</strong><p className="mt-1 text-[10px] text-muted-foreground">{item[0] === 'Assisted' ? 'Observed' : item[0] === 'Total Conversions' ? 'Observed' : item[0] === 'Attributed' ? '78.4%' : '21.6%'}</p></div>)}</div><div className="mt-5 flex h-2 rounded-full bg-secondary"><div className="rounded-full bg-primary text-primary-foreground" style={{
                width: '78.4%'
              }} /></div></Section></div>
 <Section title="Channel Attribution" subtitle="Attributed revenue by channel · Modeled — Data-Driven Attribution" action={<select className="rounded-lg border border-border bg-card px-3 py-2 text-xs"><option>Data-Driven</option><option>First Touch</option><option>Last Touch</option><option>Linear</option></select>}><div className="mb-5 space-y-3">{channels.map((item, i) => <div key={item[0]} className="grid grid-cols-[110px_1fr_72px] items-center gap-3 text-xs"><span className="truncate font-medium text-foreground">{item[0]}</span><div className="h-7 rounded-md bg-secondary"><div className="flex h-7 items-center rounded-md bg-primary px-2 text-[11px] font-medium text-primary-foreground" style={{
                  width: `${100 - i * 14}%`
                }}>{item[1]}</div></div><span className="text-right text-muted-foreground">{item[2]} share</span></div>)}</div><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-xs"><caption className="sr-only">Channel attribution table</caption><thead className="border-b border-border text-[11px] text-muted-foreground"><tr>{['Channel', 'Attributed Revenue', 'Conversions', 'Attribution Credit %', 'Assisted Conversions', 'Assist Share'].map(h => <th key={h} className="pb-3 font-medium">{h}</th>)}</tr></thead><tbody>{channels.map(item => <tr key={item[0]} className="border-b border-border"><th scope="row" className="py-3 font-semibold text-foreground">{item[0]}</th><td>{item[1]}</td><td>{item[3]}</td><td className="text-foreground">{item[2]}</td><td>{item[4]}</td><td className="text-muted-foreground">Modeled</td></tr>)}</tbody></table></div><p className="mt-4 text-[11px] italic text-muted-foreground">Results reflect modeled contribution under Data-Driven. Attribution is not causal proof.</p></Section>
 <Section title="Campaign Attribution" subtitle="All campaigns · Modeled · ROAS is Calculated" action={<div className="flex gap-1">{['All', 'Google Ads', 'Meta Ads', 'LinkedIn Ads', 'Email'].map((tab, i) => <button key={tab} className={`rounded-md px-3 py-1.5 text-xs ${i === 0 ? 'bg-secondary text-foreground' : 'text-foreground'}`}>{tab}</button>)}</div>}><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-xs"><caption className="sr-only">Campaign attribution table</caption><thead className="border-b border-border text-[11px] text-muted-foreground"><tr>{['Campaign', 'Platform', 'Spend', 'Conversions', 'Attributed Revenue', 'Credit', 'ROAS'].map(h => <th key={h} className="pb-3 font-medium">{h}</th>)}</tr></thead><tbody>{campaigns.map(item => <tr key={item[0]} className="border-b border-border"><th scope="row" className="py-3 font-semibold text-foreground">{item[0]}</th>{item.slice(1).map((cell, j) => <td key={`${item[0]}-${j}`} className={j === 4 ? 'font-semibold text-foreground' : ''}>{cell}</td>)}</tr>)}</tbody></table></div><div className="mt-4 flex gap-4 text-xs"><button className="text-foreground">View in Marketing →</button><button className="text-foreground">View in Advertising →</button></div></Section>
 <Section title="Ad Attribution" subtitle="Ad-level attribution requires sufficient ad-level data from connected sources." action={<button onClick={() => setAdOpen(!adOpen)} aria-label="Toggle ad attribution" className="rounded-lg border border-border p-2"><ChevronDown size={15} className={adOpen ? 'rotate-180' : ''} /></button>}>{adOpen && <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-xs"><thead className="border-b border-border text-[11px] text-muted-foreground"><tr>{['Ad', 'Platform', 'Campaign', 'Touchpoints', 'Conversions', 'Attributed Revenue', 'Credit'].map(h => <th key={h} className="pb-3 font-medium">{h}</th>)}</tr></thead><tbody>{[['Brand — Winter', 'Google Ads', 'Q4 Brand Campaign', '824', '112', '€26,400', '9.3%'], ['Cart reminder — 7d', 'Meta Ads', 'Retargeting — Cart', '612', '88', '€20,100', '7.1%'], ['Search — exact match', 'Google Ads', 'Search — Non-Brand', '438', '74', '€16,800', '5.9%']].map(item => <tr key={item[0]} className="border-b border-border"><th scope="row" className="py-3 text-foreground">{item[0]}</th>{item.slice(1).map((cell, j) => <td key={`${item[0]}-${j}`}>{cell}</td>)}</tr>)}</tbody></table></div>}</Section>
 <Section title="Compare Attribution Models" subtitle="Model selection materially affects credit distribution. All values are Modeled."><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-xs"><caption className="sr-only">Heat map comparing attribution model credit</caption><thead className="border-b border-border text-[11px] text-muted-foreground"><tr>{['Channel', 'First Touch', 'Last Touch', 'Linear', 'Time Decay', 'Position Based', 'Data-Driven'].map(h => <th key={h} className="pb-3 font-medium">{h}</th>)}</tr></thead><tbody>{modelRows.map(row => <tr key={row[0]} className="border-b border-border"><th scope="row" className="py-3 font-semibold text-foreground">{row[0]}</th>{row.slice(1).map((cell, j) => <td key={`${row[0]}-${j}`} className="p-1"><span className="block rounded-md px-3 py-2 text-center font-medium text-foreground" style={{
                      backgroundColor: `rgba(124,58,237,${Math.max(.08, parseInt(cell) / 45)})`
                    }}>{cell}</span></td>)}</tr>)}</tbody></table></div><div className="mt-4 flex flex-wrap gap-3 text-[11px] text-muted-foreground"><span>First Touch: first recorded touchpoint</span><span>Last Touch: final touchpoint</span><span>Linear: equal credit</span><span>Time Decay: closer touchpoints weighted</span><span>Position Based: first and last weighted</span><span>Data-Driven: journey contribution</span></div><p className="mt-3 text-[11px] italic text-muted-foreground">No attribution model guarantees causality.</p></Section>
 <div className="grid gap-5 xl:grid-cols-2"><Section title="Touchpoint Analysis" subtitle="Observed touchpoint data · Modeled contribution"><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-xs"><thead className="border-b border-border text-[11px] text-muted-foreground"><tr>{['Touchpoint Type', 'Channel', 'Avg Journey Position', 'Frequency', 'Attribution Contribution'].map(h => <th key={h} className="pb-3 font-medium">{h}</th>)}</tr></thead><tbody>{touchpoints.map(item => <tr key={item[0]} className="border-b border-border"><th scope="row" className="py-3 font-medium text-foreground">{item[0]}</th>{item.slice(1).map((cell, j) => <td key={`${item[0]}-${j}`}>{cell}</td>)}</tr>)}</tbody></table></div></Section><Section title="Customer Journey" subtitle="Aggregated and anonymized. Personally identifiable information is not displayed." action={<div className="flex rounded-lg border border-border p-1">{['Individual', 'Aggregated'].map(item => <button key={item} onClick={() => setJourney(item)} className={`rounded-md px-2 py-1 text-[11px] ${journey === item ? 'bg-secondary text-foreground' : ''}`}>View {item.toLowerCase()}</button>)}</div>}><div className="space-y-2">{[['Google Search Ad Click', 'First touch', '2 days', 'var(--primary)'], ['Website Visit', 'Organic · 1 day', '#', '1'], ['Meta Retargeting Click', 'Meta Ads · 3 days', '#', '1'], ['Email Interaction', 'Email · 1 day', '#', '1'], ['Purchase → €148', 'Conversion ✓', '#', '1']].map((item, i) => <div key={item[0]} className="flex items-center gap-3"><div className="flex w-7 flex-col items-center"><span className="h-3 w-3 rounded-full bg-primary text-primary-foreground" />{i < 4 && <span className="h-5 w-px bg-secondary" />}</div><div className="flex-1 rounded-lg border border-border px-3 py-2"><strong className="text-xs text-foreground">{item[0]}</strong><span className="ml-2 text-[10px] text-muted-foreground">{item[1]}</span></div></div>)}</div><p className="mt-3 text-[11px] italic text-muted-foreground">Customer journey represented as a modeled, aggregated flow.</p></Section></div>
 <Section title="Common Customer Paths" subtitle="Only statistically meaningful paths shown (min. 50 journeys). · Observed"><div className="grid gap-3 md:grid-cols-2">{paths.map(item => <article key={item[0]} className="rounded-lg border border-border p-4"><h3 className="text-sm font-medium text-foreground">{item[0]}</h3><div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground"><span>{item[1]}</span><span>{item[2]}</span><span>Avg revenue {item[3]}</span><span>{item[4]}</span></div></article>)}</div></Section>
 <div className="grid gap-5 xl:grid-cols-2"><Section title="Assisted Conversions" subtitle="An assisted conversion includes a channel in the journey that was not the final touchpoint."><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-xs"><thead className="border-b border-border text-[11px] text-muted-foreground"><tr>{['Channel', 'Assisted Conversions', 'Assisted Revenue', 'Assist Share', 'Final-Touch Conversions'].map(h => <th key={h} className="pb-3 font-medium">{h}</th>)}</tr></thead><tbody>{[['Organic Search', '920', '€82,400', '50.0%', '298'], ['Email', '1,140', '€94,200', '61.9%', '201'], ['Google Search', '1,180', '€96,800', '74.2%', '412'], ['Meta Ads', '840', '€71,200', '68.4%', '389'], ['Display', '210', '€18,900', '82.7%', '38']].map(row => <tr key={row[0]} className="border-b border-border"><th scope="row" className="py-3 font-medium text-foreground">{row[0]}</th>{row.slice(1).map((cell, j) => <td key={`${row[0]}-${j}`}>{cell}</td>)}</tr>)}</tbody></table></div></Section><Section title="Conversion Lag" subtitle="Observed journey data · Calculated averages"><div className="grid grid-cols-3 gap-3">{[['Average first touch → conversion', '8.4 days'], ['Median', '4.2 days'], ['Average last touch → conversion', '1.1 days']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><strong className="text-xl text-foreground">{item[1]}</strong></div>)}</div><div className="mt-6 flex h-32 items-end gap-3 border-b border-border">{[['0–1 day', '38%', 'h-[100%]'], ['2–7 days', '29%', 'h-[76%]'], ['8–30 days', '24%', 'h-[63%]'], ['30+ days', '9%', 'h-[32%]']].map(item => <div key={item[0]} className="flex flex-1 flex-col items-center gap-1"><span className="text-[10px] text-muted-foreground">{item[1]}</span><div className={`w-full rounded-t bg-primary ${item[2]} text-primary-foreground`} /><span className="text-[10px] text-muted-foreground">{item[0]}</span></div>)}</div></Section></div>
 <div className="grid gap-5 xl:grid-cols-2"><Section title="Touchpoint Frequency" subtitle="Higher touchpoint frequency does not imply causation."><div className="grid grid-cols-3 gap-3">{[['Converting journey', '4.2'], ['Non-converting journey', '2.1'], ['Touches per channel', '1.4']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><strong className="text-xl text-foreground">{item[1]}</strong></div>)}</div><div className="mt-5 flex h-3 overflow-hidden rounded-full"><div className="bg-muted" style={{
                width: '28%'
              }} /><div className="bg-primary text-primary-foreground" style={{
                width: '44%'
              }} /><div className="bg-primary text-primary-foreground" style={{
                width: '28%'
              }} /></div><div className="mt-2 flex justify-between text-[10px] text-muted-foreground"><span>Short 28%</span><span>Medium 44%</span><span>Long 28%</span></div></Section><Section title="Attribution Coverage" action={<Badge tone="green">Good</Badge>}><div className="grid grid-cols-3 gap-3">{[['Total Conversions', '2,348'], ['Attributed', '1,842 · 78.4%'], ['Unattributed', '506 · 21.6%']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><strong className="text-lg text-foreground">{item[1]}</strong></div>)}</div><div className="mt-4 h-2 rounded-full bg-secondary"><div className="h-2 rounded-full bg-primary text-primary-foreground" style={{
                width: '78.4%'
              }} /></div><ul className="mt-4 grid gap-2 text-xs text-muted-foreground md:grid-cols-2"><li>Tracking limitations: 8.2%</li><li>Consent restrictions: 6.4%</li><li>Identity matching: 4.1%</li><li>Offline interactions: 2.9%</li></ul><p className="mt-3 text-[11px] italic text-muted-foreground">Coverage is never fabricated; figures reflect actual data availability.</p></Section></div>
 <Section title="Customer Identity Resolution" subtitle="Observed match counts · Calculated match rate"><div className="grid gap-4 md:grid-cols-4">{[['Matched journeys', '1,842 · 78.4%'], ['Unmatched journeys', '506 · 21.6%'], ['Match rate', '78.4%'], ['Identity source', 'First-party cookies + email + CRM']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><strong className="mt-1 block text-sm text-foreground">{item[1]}</strong></div>)}</div><p className="mt-4 text-xs text-muted-foreground">Identity resolution connects touchpoints across sessions and channels to reconstruct a single customer journey. No personally identifiable information is exposed.</p></Section>
 <Section title="Lulu AI Attribution Analysis" tone="violet" action={<Badge tone="violet">AI-generated</Badge>}><div className="border-l-2 border-border pl-4"><p className="max-w-5xl text-sm leading-7 text-muted-foreground">Meta Ads receive the highest last-touch attribution credit, reflecting their role in closing conversions through retargeting. Google Search contributes most heavily to first-touch journeys, frequently initiating the customer journey. Email appears consistently as an assisting touchpoint across high-value customer journeys, though it receives limited last-touch credit under most models. Organic Search shows strong assist activity relative to its last-touch credit — a pattern worth investigating before reallocating budget.</p></div><p className="mt-4 text-[11px] italic text-muted-foreground">Attribution results reflect modeled contribution under the selected model. Attribution is not causal inference.</p></Section>
 <Section title="AI Attribution Insights" tone="violet" action={<Badge tone="violet">AI-generated</Badge>}><div className="grid gap-3 md:grid-cols-2">{insights.map(item => <article key={item[0]} className="rounded-lg bg-secondary/60 p-4"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-semibold text-foreground">{item[0]}</h3><Badge tone={item[2] === 'High' ? 'green' : 'amber'}>Confidence: {item[2]}</Badge></div><p className="mt-2 text-xs leading-5 text-muted-foreground">{item[1]}</p><p className="mt-3 text-[11px] text-foreground">Model reference · Data-Driven · AI Inferred</p></article>)}</div></Section>
 <div className="grid gap-5 xl:grid-cols-2"><Section title="Attribution Opportunities" tone="green"><div className="space-y-4">{[['Organic Search contributes strongly to first-touch journeys but receives limited last-touch credit. Consider evaluating full-journey contribution before reducing organic investment.', 'First-touch 28% · Last-touch 14% · 920 assists', 'High'], ['Email appears frequently in high-value customer journeys as an assist. Investing in email nurture flows may improve conversion rates for high-value segments.', '1,140 assisted conversions · €83 higher avg assisted revenue', 'Medium']].map(item => <article key={item[0]} className="border-l-2 border-border pl-3"><p className="text-sm leading-6 text-foreground">{item[0]}</p><p className="mt-2 text-xs text-muted-foreground">Evidence: {item[1]} · Impact: {item[2]} · Priority: {item[2]}</p><div className="mt-2 flex gap-3 text-xs"><button className="text-foreground">View</button><button className="text-foreground">Create Task</button></div></article>)}</div></Section><Section title="Attribution Risks" tone="red"><div className="space-y-4">{[['21.6% of conversions cannot currently be attributed due to tracking or identity matching limitations. Budget decisions may misrepresent channel performance.', 'High'], ['Attribution model selection materially changes channel credit distribution. Using a single model may lead to suboptimal budget allocation.', 'Medium']].map(item => <article key={item[0]} className="border-l-2 border-chart-5 pl-3"><p className="text-sm leading-6 text-foreground">{item[0]}</p><p className="mt-2 text-xs text-muted-foreground">Severity: {item[1]} · Impact: {item[1]}</p><div className="mt-2 flex gap-3 text-xs"><button className="text-chart-5">View Risk</button><button className="text-foreground">Create Task</button></div></article>)}</div></Section></div>
 <Section title="AI Recommendations" action={<Badge tone="violet">AI Recommended</Badge>}><div className="grid gap-3 md:grid-cols-2">{[['Compare attribution models before reallocating budget', 'Model discrepancy for Meta Ads is 15pp', 'High', 'High'], ['Investigate attribution coverage gap', '21.6% of conversions unattributed', 'High', 'High'], ['Evaluate Organic Search full-journey contribution', 'High assist activity underrepresented', 'Medium', 'Medium'], ['Improve identity matching rate', '78.4% match rate; investigate unmatched journeys', 'Medium', 'Medium']].map(item => <article key={item[0]} className="rounded-lg border border-border p-4"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-semibold text-foreground">{item[0]}</h3><Badge tone={item[2] === 'High' ? 'red' : 'amber'}>Priority: {item[2]}</Badge></div><p className="mt-2 text-xs text-muted-foreground">Reason: {item[1]} · Expected impact: {item[3]}</p><div className="mt-4 flex gap-3 text-xs"><button className="text-foreground">Review</button><button className="text-foreground">Create Task</button>{item[0].startsWith('Improve') && <button className="font-medium text-foreground">Execute with AI</button>}</div></article>)}</div></Section>
 <section className="mb-5 rounded-xl border border-border bg-card p-5 shadow-[0_3px_16px_rgba(0,0,0,.045)]"><button onClick={() => setTaskOpen(!taskOpen)} className="flex w-full items-center gap-2 text-left text-[16px] font-semibold text-foreground"><Target size={17} className="text-foreground" />Create Task from Attribution <ChevronDown className={`ml-auto ${taskOpen ? 'rotate-180' : ''}`} size={16} /></button>{taskOpen && <div className="mt-4 grid gap-3 border-t border-border pt-4 md:grid-cols-2"><label className="text-xs text-muted-foreground">Task name<input defaultValue="Investigate attribution coverage gap" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" /></label><label className="text-xs text-muted-foreground">Owner<select className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"><option>Anna Morgan</option><option>Sarah M.</option></select></label><label className="text-xs text-muted-foreground">Priority<select className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"><option>High</option><option>Medium</option></select></label><label className="text-xs text-muted-foreground">Due date<input type="date" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" /></label><label className="text-xs text-muted-foreground md:col-span-2">Description<textarea defaultValue="Review tracking, consent, and identity matching limitations affecting attribution coverage." className="mt-1 h-16 w-full rounded-lg border border-border px-3 py-2 text-sm" /></label><div className="md:col-span-2"><button className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Create Task</button><button onClick={() => setTaskOpen(false)} className="ml-2 rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground">Cancel</button><span className="ml-3 text-[11px] text-muted-foreground">Confirmation required</span></div></div>}</section>
 <Section title="Ask Lulu AI" tone="violet" action={<Sparkles size={18} className="text-muted-foreground" />}><div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-4 py-3"><Search size={17} className="text-muted-foreground" /><input className="flex-1 bg-transparent text-sm outline-none" placeholder="Ask about attribution..." /><button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Ask</button></div><div className="mt-3 flex flex-wrap gap-2">{['Which channel contributes most to revenue?', 'Which channels assist conversions?', 'Why does Meta receive more last-touch credit?', 'Which attribution model should I use?', 'How different are the models?', 'Where are attribution gaps?', 'Is my tracking reliable?', 'Create a report from this attribution analysis'].map(q => <button key={q} className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground">{q}</button>)}</div><div className="mt-4 rounded-lg border-l-2 border-border bg-secondary p-4 text-sm leading-6 text-muted-foreground"><Badge tone="violet">AI-generated</Badge><p className="mt-2">Google Search contributes most to attributed revenue, while Email and Organic Search are significant assisting touchpoints. Compare models before making budget decisions.</p></div></Section>
 <div className="grid gap-5 xl:grid-cols-2"><Section title="Saved Attribution Views"><div className="space-y-2">{[['Revenue', 'Data-Driven', 'Last 30 days', 'Updated 2h ago'], ['Conversions', 'First Touch vs Last Touch', 'Last 90 days', 'Updated yesterday'], ['Email Campaign Analysis', 'Linear', 'Last 60 days', 'Updated 3h ago']].map(item => <article key={item[0]} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3"><Star size={15} className="text-foreground" /><div className="flex-1"><h3 className="text-sm font-medium text-foreground">{item[0]}</h3><p className="mt-1 text-xs text-muted-foreground">{item[1]} · {item[2]} · {item[3]}</p></div><div className="flex gap-3 text-xs"><button className="text-foreground">Open</button><button className="text-foreground">Edit</button><button className="text-foreground">Duplicate</button><button className="text-muted-foreground">Delete</button></div></article>)}</div></Section><Section title="Data Sources"><div className="grid gap-2 sm:grid-cols-2">{sources.map(item => <article key={item[0]} className="rounded-lg border border-border p-3"><div className="flex items-center gap-2"><Globe2 size={15} className="text-foreground" /><h3 className="text-sm font-medium text-foreground">{item[0]}</h3><span className={`ml-auto h-2 w-2 rounded-full ${item[2] === 'Limited' ? 'bg-primary' : 'bg-chart-4'}`} /></div><p className="mt-2 text-xs text-muted-foreground">Connected · Last sync: {item[1]}</p><Badge tone={item[2] === 'Limited' ? 'amber' : 'green'}>{item[2]}</Badge></article>)}</div></Section></div>
 <div className="grid gap-5 xl:grid-cols-2"><Section title="Attribution Methodology" action={<button onClick={() => setMethodOpen(!methodOpen)} aria-label="Toggle methodology"><ChevronDown size={16} className={methodOpen ? 'rotate-180' : ''} /></button>}><p className="text-sm text-muted-foreground">Data-Driven model · Purchase conversion · 30-day lookback window.</p>{methodOpen && <div className="mt-4 grid gap-3 border-t border-border pt-4 text-xs text-muted-foreground md:grid-cols-2"><p><strong>Touchpoint definition:</strong> Ad click, website session, email interaction, product view, lead submission</p><p><strong>Identity matching:</strong> First-party cookie + email address + CRM match</p><p><strong>Data sources:</strong> Google Analytics, Google Ads, Meta Ads, Shopify, Email, CRM</p><p><strong>Limitations:</strong> Cross-device journeys may be partially unmatched; consent-declined and offline interactions are excluded.</p></div>}<p className="mt-3 text-[11px] italic text-muted-foreground">Proprietary model internals not exposed. Results represent modeled contribution, not causal proof.</p></Section><Section title="Conversion Settings"><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-xs"><thead className="border-b border-border text-[11px] text-muted-foreground"><tr><th className="pb-3">Conversion</th><th>Source</th><th>Status</th><th>Value</th></tr></thead><tbody>{[['Purchase', 'Shopify', 'Active', 'Dynamic (€ per order)'], ['Lead Submission', 'Website', 'Active', '€45 estimated'], ['Demo Request', 'CRM', 'Active', '€120 estimated'], ['Newsletter Signup', 'Email', 'Configured', '€8 estimated']].map(item => <tr key={item[0]} className="border-b border-border"><th scope="row" className="py-3 font-medium text-foreground">{item[0]}</th><td>{item[1]}</td><td><Badge tone={item[2] === 'Active' ? 'green' : 'amber'}>{item[2]}</Badge></td><td>{item[3]}</td></tr>)}</tbody></table></div><p className="mt-3 text-[11px] text-muted-foreground">Only configured and supported conversion events are displayed.</p></Section></div>
 <Section title="Attribution Data Quality" action={<Badge tone="green">Overall: Good</Badge>}><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[['Tracking Completeness', '78.4%', 'Good'], ['Identity Matching', '78.4%', 'Good'], ['Event Coverage', '94%', 'Excellent'], ['Source Synchronization', '6/7 synced', 'Good'], ['Duplicate Events', 'None detected', 'Excellent'], ['Missing Events', 'Low', 'Good'], ['Data Freshness', 'Updated 45 min ago', 'Good']].map(item => <div key={item[0]} className="rounded-lg bg-card p-3"><p className="text-[11px] text-muted-foreground">{item[0]}</p><strong className="mt-1 block text-sm text-foreground">{item[1]}</strong><Badge tone={item[2] === 'Excellent' ? 'green' : 'slate'}>{item[2]}</Badge></div>)}</div></Section>
 <Section title="Attribution History"><div className="grid gap-3 md:grid-cols-5">{[['Model changed to Data-Driven', 'Sarah M.', '2 days ago'], ['Lookback updated to 30 days', 'James K.', '3 days ago'], ['Analysis refreshed', 'System', '1h ago'], ['View saved: Revenue', 'Sarah M.', '2h ago'], ['Report created', 'James K.', '1 day ago']].map(item => <article key={item[0]} className="border-l-2 border-border pl-3"><p className="text-xs font-medium text-foreground">{item[0]}</p><p className="mt-1 text-[11px] text-muted-foreground">{item[1]} · {item[2]}</p></article>)}</div></Section>
 <section className="mb-5 grid gap-3 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground md:grid-cols-2"><p><strong className="text-foreground">Empty:</strong> No attribution data available. <button className="font-medium text-foreground">Connect Data</button></p><p><strong className="text-foreground">Insufficient data:</strong> Not enough touchpoint or conversion data to produce reliable results.</p><p><strong className="text-foreground">Coverage issue:</strong> Attribution coverage is limited by detected tracking or consent gaps.</p><p><strong className="text-foreground">Error:</strong> Attribution analysis couldn’t be loaded. <button className="font-medium text-foreground">Try Again</button></p><p><strong className="text-foreground">Restricted:</strong> Attribution access restricted.</p></section>
 <footer className="flex flex-wrap justify-between gap-3 border-t border-border py-6 text-[11px] text-muted-foreground"><span>Lulu AI Core Platform · Attribution results are modeled contribution, not causal proof.</span><span>Last updated 45 min ago</span></footer>
 </div></main></div>;
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
