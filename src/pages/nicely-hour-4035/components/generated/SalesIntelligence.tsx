import * as React from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Bot, CalendarDays, Check, ChevronDown, ChevronRight, CircleHelp, Download, FilePlus2, Filter, LayoutDashboard, LineChart, Menu, MessageSquare, MoreHorizontal, RefreshCw, Search, Settings, Sparkles, Target, TrendingUp, Users } from 'lucide-react';
type Source = 'Observed' | 'Calculated' | 'Target' | 'Benchmark' | 'Forecast' | 'AI Explanation';
type Metric = {
  label: string;
  value: string;
  previous: string;
  change: string;
  source: Source;
  tone?: 'good' | 'warn';
};
const metrics: Metric[] = [];
const months: { n: string; revenue: number; pipeline: number; deals: number }[] = [];
const stages: { name: string; count: string; value: string; width: string; color: string }[] = [];
const teams: string[][] = [];
const reps: string[][] = [];
const products: string[][] = [];
const lossReasons: (string | number)[][] = [];
const prompts: string[] = [];

function Badge({
  children
}: {
  children: Source | string;
}) {
  const cls = children === 'Observed' ? 'bg-card/60 text-foreground' : children === 'Calculated' ? 'bg-secondary/10 text-foreground' : children === 'Target' ? 'bg-secondary/15 text-foreground' : children === 'Benchmark' ? 'bg-secondary/10 text-foreground' : children === 'Forecast' ? 'bg-secondary/10 text-foreground' : 'bg-gradient-to-r from-secondary/20 to-chart-3/20 text-chart-2';
  return <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${cls}`}>{children}</span>;
}
function Sparkline({
  color = 'var(--chart-2)'
}: {
  color?: string;
}) {
  return <svg viewBox="0 0 100 28" className="h-8 w-24" role="img" aria-label="Upward twelve month trend"><polyline fill="none" stroke={color} strokeWidth="2.5" points="2,23 14,20 24,21 35,15 47,17 58,10 69,13 80,7 98,3" /><circle cx="98" cy="3" r="2.5" fill={color} /></svg>;
}
function Section({
  title,
  eyebrow,
  children,
  className = ''
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`rounded-2xl border border-border/[.08] bg-[var(--card)]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,.16)] ${className}`}><header className="mb-5 flex items-start justify-between gap-4"><div>{eyebrow && <p className="mb-1 text-[10px] font-semibold uppercase tracking-[.18em] text-foreground">{eyebrow}</p>}<h2 className="text-[17px] font-semibold tracking-tight text-foreground">{title}</h2></div><button className="rounded-lg p-1.5 text-foreground hover:bg-secondary hover:text-foreground" aria-label={`More options for ${title}`}><MoreHorizontal size={18} /></button></header>{children}</section>;
}
function Sidebar() {
  return <aside className="hidden w-[236px] shrink-0 border-r border-border/[.07] bg-[var(--sidebar)] px-3 py-5 lg:block"><div className="flex items-center gap-3 px-3"><div className="grid h-8 w-8 place-items-center rounded-xl bg-primary shadow-lg shadow-black/30 text-primary-foreground"><Sparkles size={16} /></div><div><p className="text-sm font-bold text-foreground">Lulu <span className="text-foreground">AI</span></p><p className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">Business OS</p></div></div><div className="my-7 h-px bg-secondary" /><LuluSectionNavigation activeId="nicely-hour-4035" /><div className="mt-10 rounded-xl border border-border/15 bg-secondary/[.07] p-3"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground"><Bot size={15} /> Ask Lulu</div><p className="text-[11px] leading-relaxed text-muted-foreground">Get a clear answer from your business data.</p></div></aside>;
}
function DataTable({
  headers,
  rows
}: {
  headers: string[];
  rows: string[][];
}) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-xs"><thead className="border-b border-border/[.07] text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{headers.map(header => <th key={header} className="pb-3 pr-4 font-medium">{header}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row[0]} className="border-b border-border/[.05] last:border-0">{row.map((cell, index) => <td key={`${row[0]}-${index}`} className={`py-3 pr-4 ${index === 0 ? 'font-medium text-foreground' : index === row.length - 1 ? 'text-foreground' : 'text-muted-foreground'}`}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
export function SalesIntelligence() {
  const [period, setPeriod] = React.useState('Monthly');
  const [date, setDate] = React.useState('Last 12 Months');
  const [ask, setAsk] = React.useState('');
  const [geoMode, setGeoMode] = React.useState('Map');
  const { items: liveDeals, loading: liveLoading, error: liveError } = useLiveRecords('sales_deals');
  const liveDealCount = liveDeals.length;
  const livePipelineValue = liveDeals.reduce((sum, record) => { const fields = record as Record<string, unknown>; return sum + Number(fields.amount ?? fields.value ?? 0); }, 0);
  const liveEmpty = !liveLoading && !liveError && liveDealCount === 0;
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (ask.trim()) setAsk('');
  };
  return <main className="min-h-screen bg-[var(--background)] text-foreground"><div className="flex min-h-screen"><Sidebar /><div className="min-w-0 flex-1"><header className="sticky top-0 z-10 flex min-h-[70px] items-center justify-between border-b border-border/[.07] bg-[var(--background)]/95 px-5 backdrop-blur-xl lg:px-8"><div className="flex items-center gap-3"><button className="rounded-lg p-2 text-foreground lg:hidden" aria-label="Open navigation"><Menu size={19} /></button><p className="text-xs text-muted-foreground">Intelligence <span className="mx-1 text-foreground">/</span> Business Intelligence <span className="mx-1 text-foreground">/</span> <span className="text-foreground">Sales</span></p></div><div className="flex items-center gap-2"><button className="hidden rounded-lg border border-border p-2 text-foreground sm:block" aria-label="Search"><Search size={17} /></button><button className="rounded-lg border border-border p-2 text-foreground" aria-label="Notifications"><Bell size={17} /></button><div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-primary text-xs font-bold text-[var(--primary-foreground)]">LS</div></div></header><div className="mx-auto max-w-[1450px] px-5 py-7 lg:px-8"><div className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end"><div><div className="mb-3 flex items-center gap-2 text-xs font-medium text-foreground"><span className="h-1.5 w-1.5 rounded-full bg-primary text-primary-foreground" />Live intelligence</div><h1 className="text-4xl font-bold tracking-[-.04em] text-foreground sm:text-5xl">Sales</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Understand sales performance, pipeline development, conversion and revenue generation.</p></div><div className="flex flex-wrap items-center gap-2"><select value={date} onChange={e => setDate(e.target.value)} className="rounded-lg border border-border bg-[var(--secondary)] px-3 py-2 text-xs font-medium text-foreground" aria-label="Date range">{['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last 12 Months', 'Year to Date', 'Previous Year', 'Custom Range'].map(item => <option key={item}>{item}</option>)}</select><button className="hidden rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground md:block">Compare: Previous Year <ChevronDown size={13} className="ml-1 inline" /></button><button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-lg shadow-black/20 hover:bg-primary"><Bot size={14} />Ask Lulu AI</button><button className="rounded-lg border border-border p-2 text-foreground" aria-label="Refresh data"><RefreshCw size={15} /></button><button className="hidden rounded-lg border border-border px-3 py-2 text-xs text-foreground md:block"><FilePlus2 size={14} className="mr-1 inline" />Create Report</button><button className="rounded-lg border border-border p-2 text-foreground" aria-label="Export"><Download size={15} /></button></div></div><div className="mb-8 flex items-center justify-between border-y border-border/[.07] py-3"><div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Sales overview</p><p className="mt-1 text-xs text-muted-foreground">Last updated 2 minutes ago · All sources synced</p></div><div className="hidden items-center gap-2 sm:flex"><span className="rounded-md bg-secondary px-2 py-1 text-[10px] text-muted-foreground">EUR</span><span className="rounded-md bg-chart-4/10 px-2 py-1 text-[10px] text-chart-4">No live data</span></div></div><div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">{liveLoading ? <div className="col-span-full rounded-2xl border border-border/[.08] bg-[var(--card)] p-5 text-sm text-muted-foreground">Loading live sales intelligence…</div> : liveError ? <div className="col-span-full rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">{liveError}</div> : liveEmpty ? <div className="col-span-full rounded-2xl border border-dashed border-border/[.18] bg-[var(--card)] p-8 text-center text-sm text-muted-foreground">No live sales records are available yet. Connect a CRM platform or add sales deals to begin.</div> : metrics.map(metric => <article key={metric.label} className="group rounded-2xl border border-border/[.08] bg-[var(--card)] p-4 transition hover:-translate-y-0.5 hover:border-border/30"><div className="flex items-start justify-between"><p className="text-xs text-muted-foreground">{metric.label}</p><Badge>{metric.source}</Badge></div><p className="mt-4 text-xl font-semibold tracking-tight text-foreground">{metric.value}</p><p className="mt-1 text-[11px] text-muted-foreground">Prev. {metric.previous}</p><div className="mt-3 flex items-end justify-between"><span className="flex items-center gap-1 text-xs font-semibold text-chart-4"><ArrowUpRight size={13} />{metric.change}</span><Sparkline /></div></article>)}</div>

<Section title="Sales Trend" eyebrow="12 month performance" className="mb-5"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex gap-4 text-[11px] text-muted-foreground"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Sales Revenue</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary text-primary-foreground" />Won Revenue</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full border border-dashed border-border" />Pipeline</span></div><div className="flex gap-1 rounded-lg border border-border/[.07] p-1">{['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'].map(item => <button key={item} onClick={() => setPeriod(item)} className={`rounded-md px-2.5 py-1 text-[11px] ${period === item ? 'bg-primary text-primary-foreground' : 'text-primary-foreground'}`}>{item}</button>)}</div></div>{liveEmpty ? <div className="rounded-xl border border-dashed border-border/[.18] p-8 text-center text-sm text-muted-foreground">No live sales trend data is available yet.</div> : <div className="grid grid-cols-12 items-end gap-2 border-b border-l border-border/[.08] bg-[linear-gradient(rgba(0,0,0,.035)_1px,transparent_1px)] bg-[length:100%_38px] px-3 pt-7" style={{
              height: 260
            }}>{months.map(item => <div key={item.n} className="flex h-full flex-col items-center justify-end gap-2"><div className="flex h-[calc(100%-22px)] w-full items-end justify-center gap-1"><div className="w-1/2 rounded-t bg-secondary/80" style={{
                    height: `${item.revenue}%`
                  }} /><div className="w-1/3 rounded-t bg-secondary/70" style={{
                    height: `${item.deals}%`
                  }} /></div><span className="text-[10px] text-muted-foreground">{item.n}</span></div>)}</div>}<p className="mt-3 text-[11px] text-muted-foreground">{liveEmpty ? 'No live trend data is available yet.' : `Live pipeline value ${livePipelineValue.toLocaleString()} · ${liveDealCount} deals`}</p></Section>
<div className="mb-5 grid gap-5 xl:grid-cols-3"><Section title="Sales Growth" eyebrow="Momentum"><div className="mb-4 flex items-center gap-2"><span className="rounded-full bg-chart-4/10 px-2.5 py-1 text-xs font-semibold text-chart-4">Accelerating</span><span className="text-xs text-muted-foreground">vs previous year</span></div><div className="grid grid-cols-2 gap-4">{[['Sales Revenue Growth', '+17.1%'], ['Pipeline Growth', '+21.9%'], ['Deal Volume Growth', '+12.4%'], ['New Business Growth', '+22.6%'], ['Existing Business Growth', '+8.4%']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className="mt-1 text-lg font-semibold text-foreground">{item[1]}</p></div>)}</div><div className="mt-5 flex flex-wrap gap-1">{['Accelerating', 'Growing', 'Stable', 'Slowing', 'Declining', 'Volatile'].map((item, index) => <span key={item} className={`rounded px-2 py-1 text-[10px] ${index === 0 ? 'bg-chart-4/10 text-chart-4' : 'bg-secondary text-muted-foreground'}`}>{item}</span>)}</div></Section><Section title="Pipeline Coverage" eyebrow="Calculated — Qualified Pipeline / Sales Target"><div className="flex items-center gap-6"><div className="grid h-32 w-32 shrink-0 place-items-center rounded-full" style={{
                  background: 'conic-gradient(var(--primary) 0 53%, var(--secondary) 53% 100%)'
                }}><div className="grid h-24 w-24 place-items-center rounded-full bg-[var(--secondary)]"><strong className="text-3xl text-foreground">1.6×</strong></div></div><div><p className="text-[11px] text-muted-foreground">Target Coverage</p><p className="text-lg font-semibold text-foreground">3.0×</p><p className="mt-1 text-xs text-foreground">Gap −1.4×</p></div></div><div className="mt-5 space-y-2 text-xs">{[['Enterprise', '2.4×'], ['Mid-Market', '1.8×'], ['SMB', '0.9×']].map(item => <div key={item[0]} className="flex justify-between border-b border-border/[.05] pb-2"><span className="text-muted-foreground">{item[0]}</span><strong className="text-foreground">{item[1]}</strong></div>)}</div><p className="mt-4 text-[11px] text-muted-foreground">Sales targets are organization-defined.</p></Section><Section title="Pipeline Movement" eyebrow="Net movement analysis"><div className="space-y-3 text-xs">{[['New Opportunities', '+82 · +—', 'text-chart-4'], ['Opportunities Advanced', '+124', 'text-chart-4'], ['Opportunities Stalled', '38 deals', 'text-foreground'], ['Opportunities Won', '+156 · +—', 'text-foreground'], ['Opportunities Lost', '−84 · −—', 'text-chart-5'], ['Opportunities Removed', '−12 · −—', 'text-chart-5']].map(item => <div key={item[0]} className="flex justify-between border-b border-border/[.05] pb-3"><span className="text-muted-foreground">{item[0]}</span><strong className={item[2]}>{item[1]}</strong></div>)}</div><div className="mt-5 flex h-12 items-end gap-1">{[32, 40, 27, 44, 38, 52, 46, 64, 58, 70, 76, 84].map((h, i) => <div key={`movement-${i}`} className="flex-1 rounded-t bg-gradient-to-t from-primary to-primary text-primary-foreground" style={{
                  height: `${h}%`
                }} />)}</div></Section></div>
<Section title="Sales Pipeline" eyebrow="Connected CRM configuration" className="mb-5"><div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{[['Total Pipeline', '—'], ['Opportunities', '248'], ['Avg Opportunity Value', '—'], ['Pipeline Growth', '+21.9%'], ['Pipeline Coverage', '1.6×']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className="mt-1 text-lg font-semibold text-foreground">{item[1]}</p></div>)}</div><div className="space-y-3">{stages.map(stage => <div key={stage.name} className="grid grid-cols-[90px_1fr_150px] items-center gap-3 text-xs"><span className="text-muted-foreground">{stage.name}</span><div className="h-8 rounded-r-lg bg-secondary"><div className="grid h-full place-items-center rounded-r-lg text-[11px] font-semibold text-foreground transition-all" style={{
                    width: stage.width,
                    background: stage.color
                  }}>{stage.count} opportunities</div></div><strong className="text-right text-foreground">{stage.value}</strong></div>)}</div><p className="mt-5 text-[11px] text-muted-foreground">Pipeline stages reflect connected CRM configuration. Stages cannot be modified from this view.</p></Section>
<div className="mb-5 grid gap-5 xl:grid-cols-2"><Section title="Pipeline Value" eyebrow="Open Pipeline"><div className="grid grid-cols-2 gap-4"><div><Badge>Observed</Badge><p className="mt-3 text-2xl font-semibold text-foreground">—</p><p className="text-xs text-muted-foreground">Open Pipeline</p></div><div><Badge>Calculated</Badge><p className="mt-3 text-2xl font-semibold text-foreground">—</p><p className="text-xs text-muted-foreground">Weighted Pipeline</p></div></div><div className="mt-6 space-y-3">{stages.slice(0, 5).map(stage => <div key={stage.name} className="flex items-center gap-3 text-xs"><span className="w-20 text-muted-foreground">{stage.name}</span><div className="h-2 flex-1 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary text-primary-foreground" style={{
                      width: stage.width
                    }} /></div><span className="w-24 text-right text-foreground">{stage.value}</span></div>)}</div></Section><Section title="Sales Funnel" eyebrow="Conversion from previous stage"><div className="space-y-2">{[['Leads', '1,248', '100%', '—'], ['Qualified Leads', '624', '50.0%', '—'], ['Opportunities', '312', '50.0%', '—'], ['Proposals', '186', '59.6%', '—'], ['Negotiations', '96', '51.6%', '—'], ['Won Deals', '156', '31.9%', '—']].map((item, index) => <div key={item[0]} className="flex items-center gap-3"><div className="grid h-8 place-items-center rounded-r-lg text-[11px] font-semibold text-foreground" style={{
                    width: `${100 - index * 13}%`,
                    background: `rgba(124,58,237,${0.86 - index * .08})`
                  }}>{item[0]}</div><span className="w-10 text-right text-xs text-foreground">{item[1]}</span><span className="w-12 text-right text-[10px] text-foreground">{item[2]}</span><span className="ml-auto text-[11px] text-muted-foreground">{item[3]}</span></div>)}</div></Section><Section title="Conversion Performance" eyebrow="12-month trend"><DataTable headers={['Stage', 'Current', 'Previous', 'Change']} rows={['Lead → Qualified|50.0%|44.8%|+5.2pp ↑', 'Qualified → Opportunity|50.0%|48.2%|+1.8pp ↑', 'Opportunity → Proposal|59.6%|54.1%|+5.5pp ↑', 'Proposal → Won|45.2%|40.6%|+4.6pp ↑', 'Overall Lead → Customer|12.5%|10.8%|+1.7pp ↑'].map(row => row.split('|'))} /></Section><Section title="Win Rate" eyebrow="Calculated"><div className="mb-5 flex items-end justify-between"><div><p className="text-3xl font-semibold text-foreground">—</p><p className="text-xs text-muted-foreground">Prev. — · <span className="text-chart-4">+4.2pp ↑</span></p></div><Badge>Calculated</Badge></div><div className="grid grid-cols-2 gap-4 text-xs">{[['By Product', 'Enterprise 48.2% · Pro 42.6% · Business 34.8%'], ['By Segment', 'Enterprise 52.4% · Mid-Market 38.6% · SMB 28.4%'], ['By Channel', 'Direct 44.2% · Partner 38.6% · Referral 52.8%'], ['By Market', 'EMEA 40.2% · Americas 36.8% · APAC 34.4%']].map(item => <div key={item[0]}><p className="text-muted-foreground">{item[0]}</p><p className="mt-1 leading-5 text-foreground">{item[1]}</p></div>)}</div><div className="mt-5 flex h-12 items-end gap-1">{[44, 52, 48, 58, 55, 63, 68, 62, 74, 70, 82, 88].map((h, i) => <div key={`win-${i}`} className="flex-1 rounded-t bg-secondary/70" style={{
                  height: `${h}%`
                }} />)}</div></Section></div>
<div className="mb-5 grid gap-5 xl:grid-cols-3"><Section title="Loss Rate" eyebrow="Improving"><div className="flex items-end justify-between"><p className="text-3xl font-semibold text-foreground">—</p><span className="text-xs text-foreground">−5.2pp ↓</span></div><div className="mt-5 space-y-3 text-xs">{[['At Qualified', '22.4%'], ['At Opportunity', '18.6%'], ['At Proposal', '28.4%'], ['At Negotiation', '31.2%']].map(item => <div key={item[0]} className="flex justify-between"><span className="text-muted-foreground">{item[0]}</span><strong className="text-foreground">{item[1]}</strong></div>)}</div></Section><Section title="Lost Deal Analysis" eyebrow="Connected CRM"><div className="space-y-3">{lossReasons.map(item => <div key={item[0]} className="grid grid-cols-[80px_1fr_75px] items-center gap-3 text-xs"><span className="text-muted-foreground">{item[0]}</span><div className="h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-chart-5/80" style={{
                      width: `${item[4]}%`
                    }} /></div><span className="text-right text-foreground">{item[1]}</span></div>)}</div><p className="mt-5 text-[11px] text-muted-foreground">Total Lost: 84 deals · — Loss reasons reflect data recorded in the connected CRM.</p></Section><Section title="Average Deal Value" eyebrow="Calculated"><Badge>Calculated</Badge><p className="mt-3 text-3xl font-semibold text-foreground">—</p><p className="text-xs text-muted-foreground">Prev. — · <span className="text-chart-4">— ↑</span></p><div className="mt-5 space-y-3 text-xs">{[['Enterprise', '—'], ['Pro', '—'], ['Business', '—'], ['Median Deal Value', '—']].map(item => <div key={item[0]} className="flex justify-between border-b border-border/[.05] pb-2"><span className="text-muted-foreground">{item[0]}</span><strong className="text-foreground">{item[1]}</strong></div>)}</div><Sparkline color="var(--chart-3)" /></Section><Section title="Sales Cycle" eyebrow="Lead-to-Close duration"><div className="flex items-end justify-between"><div><p className="text-3xl font-semibold text-foreground">48 days</p><p className="text-xs text-muted-foreground">Median 38 days · <span className="text-foreground">−8 days ↓ improving</span></p></div><Badge>Calculated</Badge></div><div className="mt-5 grid grid-cols-2 gap-3 text-xs">{[['Enterprise', '84 days'], ['Pro', '42 days'], ['Business', '24 days'], ['SMB', '22 days']].map(item => <div key={item[0]} className="rounded-lg bg-secondary p-3"><span className="text-muted-foreground">{item[0]}</span><strong className="mt-1 block text-foreground">{item[1]}</strong></div>)}</div></Section><Section title="Sales Velocity" eyebrow="Calculated composite metric"><Badge>Calculated</Badge><p className="mt-3 text-sm text-muted-foreground">Sales Velocity = Opportunities × Avg Deal Value × Win Rate ÷ Sales Cycle</p><p className="mt-4 text-2xl font-semibold text-foreground">—/day</p><p className="text-xs text-chart-4">Prev. — · — ↑</p><Sparkline color="var(--chart-1)" /><p className="text-[11px] text-muted-foreground">A calculated composite metric.</p></Section></div>
<Section title="Sales by Representative" eyebrow="Permission required" className="mb-5"><div className="mb-4 flex items-center justify-between"><p className="text-xs text-muted-foreground">Top performers · access to rep-level data is permission gated.</p><button className="rounded-lg border border-border px-3 py-2 text-xs text-foreground"><Filter size={13} className="mr-1 inline" /> Sort: Revenue</button></div><DataTable headers={['Representative', 'Revenue', 'Won Deals', 'Win Rate', 'Avg Deal Value', 'Sales Cycle', 'Pipeline', 'Target Attainment']} rows={reps} /></Section><div className="mb-5 grid gap-5 xl:grid-cols-2"><Section title="Sales by Team" eyebrow="Team performance"><DataTable headers={['Team', 'Revenue', 'Pipeline', 'Win Rate', 'Deals', 'Avg Deal', 'Cycle', 'Target']} rows={teams} /></Section><Section title="Sales by Product" eyebrow="Product performance"><DataTable headers={['Product', 'Revenue', 'Deals', 'Pipeline', 'Win Rate', 'Avg Deal', 'Growth']} rows={products} /></Section></div><div className="mb-5 grid gap-5 xl:grid-cols-2"><Section title="Sales by Geography" eyebrow="Regional performance"><div className="mb-4 flex gap-1 rounded-lg bg-secondary p-1 w-fit">{['Map', 'Ranking', 'Comparison'].map(item => <button key={item} onClick={() => setGeoMode(item)} className={`rounded-md px-3 py-1.5 text-xs ${geoMode === item ? 'bg-primary text-primary-foreground' : 'text-primary-foreground'}`}>{item}</button>)}</div><div className="grid gap-4 md:grid-cols-[.9fr_1.3fr]"><div className="grid min-h-40 place-items-center rounded-xl border border-border/[.06] bg-[var(--secondary)]"><div className="text-center"><div className="text-5xl opacity-80">🌐</div><p className="mt-2 text-[11px] text-muted-foreground">Revenue intensity map</p></div></div><div className="space-y-3 text-xs">{[['United Kingdom', '—', '35%', '42.4%'], ['Germany', '—', '20%', '38.6%'], ['United States', '—', '15%', '36.2%'], ['France', '—', '10%', '34.8%'], ['Netherlands', '—', '8%', '40.2%']].map((item, index) => <div key={item[0]} className="flex items-center gap-2"><span className="w-4 text-muted-foreground">0{index + 1}</span><span className="flex-1 text-foreground">{item[0]}</span><span className="text-foreground">{item[1]}</span><span className="text-foreground">{item[3]}</span></div>)}</div></div></Section><Section title="New vs Existing Business" eyebrow="Revenue composition"><div className="mb-5 flex h-11 overflow-hidden rounded-xl"><div className="grid place-items-center bg-primary text-xs font-semibold text-primary-foreground" style={{
                  width: '50%'
                }}>—</div><div className="grid place-items-center bg-secondary/80 text-xs font-semibold text-[var(--foreground)]" style={{
                  width: '40%'
                }}>—</div><div className="grid place-items-center bg-primary text-xs font-semibold text-[var(--primary-foreground)]" style={{
                  width: '10%'
                }}>—</div></div><div className="grid grid-cols-3 gap-3 text-xs">{[['New Business Revenue', '—', '+22.6%'], ['Existing Customer Revenue', '—', '+8.4%'], ['Expansion Revenue', '—', '+18.2%']].map(item => <div key={item[0]}><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className="mt-1 font-semibold text-foreground">{item[1]}</p><p className="mt-1 text-chart-4">{item[2]}</p></div>)}</div><p className="mt-5 text-xs text-muted-foreground">New customer count: 92 · Existing customer growth: —</p></Section></div>
<div className="mb-5 grid gap-5 xl:grid-cols-3"><Section title="Sales Forecast" eyebrow="Forecast"><Badge>Forecast</Badge><p className="mt-3 text-2xl font-semibold text-foreground">—</p><div className="mt-4 space-y-2 text-xs">{[['Closed Revenue (YTD)', '—'], ['Remaining Pipeline', '—'], ['Forecast Range', '— — —']].map(item => <div key={item[0]} className="flex justify-between"><span className="text-muted-foreground">{item[0]}</span><strong className="text-foreground">{item[1]}</strong></div>)}</div><button className="mt-5 text-xs font-semibold text-foreground">View Forecast <ChevronRight size={14} className="inline" /></button></Section><Section title="Sales Targets" eyebrow="Organization-defined"><div className="space-y-3 text-xs">{[['Revenue Target', '— / —', '96.0%', 'On Track'], ['Deal Target', '156 / 180', '86.7%', 'Behind'], ['New Customer Target', '92 / 100', '92.0%', 'On Track'], ['Pipeline Target', '— / —', '83.2%', 'Behind']].map(item => <div key={item[0]} className="flex items-center gap-3"><span className="flex-1 text-muted-foreground">{item[0]}</span><span className="text-foreground">{item[1]}</span><span className="text-foreground">{item[2]}</span><span className={item[3] === 'Behind' ? 'text-foreground' : 'text-foreground'}>{item[3]}</span></div>)}</div><p className="mt-5 text-[11px] text-muted-foreground">Targets are organization-defined. No targets are created automatically.</p></Section><Section title="Sales Gap" eyebrow="Annual Revenue Target"><div className="flex items-center gap-5"><div className="grid h-28 w-28 place-items-center rounded-full" style={{
                  background: 'conic-gradient(var(--primary) 0 80%, var(--secondary) 80% 100%)'
                }}><div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--secondary)]"><strong className="text-xl text-foreground">—</strong></div></div><div className="space-y-2 text-xs"><p className="text-muted-foreground">Target <strong className="ml-2 text-foreground">—</strong></p><p className="text-muted-foreground">Actual <strong className="ml-2 text-foreground">—</strong></p><p className="text-foreground">Gap −—</p></div></div><p className="mt-4 text-[11px] text-muted-foreground">Remaining pipeline covers the gap 6.5× if win rate holds.</p></Section></div>
<div className="mb-5 grid gap-5 xl:grid-cols-2"><Section title="Sales Benchmark" eyebrow="Actual vs reference"><DataTable headers={['Metric', 'Actual', 'Benchmark', 'Target', 'Signal']} rows={['Win Rate|38.4%|35%|45%|Above benchmark ✓', 'Avg Deal Value|—|—|—|Room to grow', 'Sales Cycle|48 days|62 days|40 days|Below benchmark ✓', 'Pipeline Coverage|1.6×|2.5×|3.0×|Gap', 'Conversion Rate|12.5%|10.2%|15%|Above benchmark ✓'].map(row => row.split('|'))} /><div className="mt-4 flex gap-2"><Badge>Actual</Badge><Badge>Target</Badge><Badge>Benchmark</Badge></div></Section><Section title="Sales Comparison" eyebrow="Context"><DataTable headers={['Metric', 'Current', 'Prev Period', 'Prev Year', 'Target', 'Benchmark']} rows={['Sales Revenue|—|—|—|—|—', 'Pipeline Value|—|—|—|—|—', 'Win Rate|38.4%|34.2%|29.8%|45%|35%', 'Avg Deal Value|—|—|—|—|—', 'Sales Cycle|48 days|56 days|72 days|40 days|62 days', 'Conversion Rate|12.5%|10.8%|8.4%|15%|10.2%'].map(row => row.split('|'))} /></Section></div><Section title="Key Sales KPIs" eyebrow="Executive scorecard" className="mb-5"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[['Sales Revenue', '—', '+17.1%'], ['Sales Growth', '+17.1%', 'Accelerating'], ['Pipeline Value', '—', '+21.9%'], ['Pipeline Growth', '+21.9%', 'Accelerating'], ['Win Rate', '38.4%', '+4.2pp'], ['Conversion Rate', '12.5%', '+1.7pp'], ['Average Deal Value', '—', '+10.7%'], ['Sales Cycle', '48 days', '−8 days'], ['Sales Velocity', '—/day', '+27.5%'], ['Pipeline Coverage', '1.6×', '−1.4×'], ['Closed Deals', '156', '+12.4%'], ['Forecasted Revenue', '—', 'Forecast']].map(item => <article key={item[0]} className="rounded-xl border border-border/[.06] bg-secondary p-4"><p className="text-[11px] text-muted-foreground">{item[0]}</p><p className="mt-2 text-lg font-semibold text-foreground">{item[1]}</p><p className="mt-1 text-xs text-chart-4">{item[2]}</p><Sparkline /></article>)}</div><button className="mt-5 rounded-lg bg-secondary px-3 py-2 text-xs font-semibold text-foreground">Open KPI Explorer <ChevronRight size={14} className="inline" /></button></Section>
<Section title="Explain Sales Performance" eyebrow="AI Explanation" className="mb-5"><div className="flex gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary text-[var(--primary-foreground)]"><Bot size={20} /></div><div><p className="text-sm leading-6 text-foreground">Sales revenue grew <strong className="text-foreground">— year-over-year</strong> to — accelerating from — in the prior period. Win rate improved to 38.4%, driven by stronger Enterprise conversion (52.4%) and a 10-day reduction in average sales cycle. Pipeline grew 21.9% to — with the most growth in the Enterprise and Healthcare segments. New business contributed 50% of revenue, while Organic Search showed the highest lead-to-customer conversion improvement at +5.2pp.</p><button className="mt-4 rounded-lg bg-secondary/15 px-3 py-2 text-xs font-semibold text-foreground">View AI Recommendations <ChevronRight size={14} className="inline" /></button></div></div></Section><Section title="Ask Lulu AI" eyebrow="Explore your sales performance" className="mb-5"><form onSubmit={submit} className="flex gap-2"><div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-[var(--secondary)] px-4"><MessageSquare size={16} className="text-muted-foreground" /><input value={ask} onChange={e => setAsk(e.target.value)} placeholder="Ask Lulu AI about your sales performance..." className="w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground" aria-label="Ask Lulu AI about sales" /></div><button className="rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground" type="submit">Ask</button></form><div className="mt-4 flex flex-wrap gap-2">{prompts.map(prompt => <button key={prompt} onClick={() => setAsk(prompt)} className="rounded-full border border-border/[.08] px-3 py-1.5 text-[11px] text-foreground hover:border-border/40 hover:text-foreground">{prompt}</button>)}</div></Section><details className="rounded-2xl border border-border/[.08] bg-[var(--card)] p-5"><summary className="cursor-pointer list-none text-[17px] font-semibold text-foreground">Data Sources <span className="ml-2 text-xs font-normal text-muted-foreground">Connected business systems</span></summary><div className="mt-5 grid gap-2 sm:grid-cols-5">{[['CRM', 'Connected'], ['Billing', 'Connected'], ['Marketing Analytics', 'Connected'], ['Finance', 'Partial'], ['Ecommerce', 'Not Connected']].map(item => <div key={item[0]} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-3"><span className="text-xs text-foreground">{item[0]}</span><span className={item[1] === 'Connected' ? 'text-chart-4' : item[1] === 'Partial' ? 'text-foreground' : 'text-muted-foreground'}>{item[1]}</span></div>)}</div></details><div className="mt-6 flex flex-wrap justify-between gap-3 border-t border-border/[.07] pt-5 text-[11px] text-muted-foreground"><span>Sales Intelligence · Lulu AI Business OS</span><span>Observed · Calculated · Estimated · Target · Benchmark · Forecast</span></div></div></div></div></main>;
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
