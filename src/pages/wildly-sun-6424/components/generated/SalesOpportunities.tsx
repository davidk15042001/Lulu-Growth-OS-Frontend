import * as React from 'react';
import { Bell, Bot, Check, ChevronDown, Download, Ellipsis, LayoutDashboard, Menu, Plus, RefreshCw, Search, Settings, Sparkles, Target, Users, X } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type Opp = any;
const opps: Opp[] = [];
const metrics: any[][] = [];
const funnel: any[][] = [];
const actions: any[][] = [];
const prompts = ['Which opportunities should I prioritize?', 'Which opportunities are at risk?', 'Which opportunities have the highest potential?', 'Which opportunities have stalled?', 'Show me opportunities with declining probability.'];
const tone = (v: string) => v === 'Healthy' ? 'emerald' : v === 'At Risk' ? 'rose' : v === 'Needs Attention' ? 'amber' : v === 'High' ? 'rose' : v === 'Medium' ? 'amber' : v === 'Negotiation' ? 'amber' : v === 'Proposal' ? 'indigo' : v === 'Solution Fit' ? 'violet' : v === 'Commit' ? 'cyan' : v === 'Qualified' ? 'sky' : 'slate';
function Badge({
  children
}: {
  children: string;
}) {
  return <span className={`rounded px-1.5 py-0.5 text-[9px] ${children === 'Calculated' ? 'bg-secondary/10 text-foreground' : children === 'AI' ? 'bg-secondary/20 text-foreground' : children === 'Forecast' ? 'bg-secondary/10 text-foreground' : 'bg-card/60 text-foreground'}`}>{children}</span>;
}
function Pill({
  children
}: {
  children: string;
}) {
  return <span className={`rounded-full bg-${tone(children)}-400/10 px-2 py-1 text-[10px] text-${tone(children)}-300`}>{children}</span>;
}
function Section({
  eyebrow,
  title,
  children
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return <section className="rounded-xl border border-border/[.07] bg-[var(--card)] p-5"><header className="mb-5"><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-foreground">{eyebrow}</p><h2 className="text-lg font-semibold text-foreground">{title}</h2></header>{children}</section>;
}
function Sidebar() {
  return <aside className="hidden w-[220px] shrink-0 border-r border-border/[.07] bg-[var(--sidebar)] p-4 lg:block"><div className="flex items-center gap-2 px-2"><span className="h-2 w-2 rounded-full bg-primary text-primary-foreground" /><strong className="text-foreground">lulu<span className="text-foreground">.ai</span></strong></div><p className="px-2 pt-1 text-[9px] uppercase tracking-[.2em] text-muted-foreground">Business OS</p><LuluSectionNavigation activeId="wildly-sun-6424" /><div className="mt-8 border-t border-border/[.07] pt-4"><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">JD</div><div><p className="text-xs text-foreground">Workspace member</p><p className="text-[10px] text-muted-foreground">Admin workspace</p></div><Settings size={14} className="ml-auto text-muted-foreground" /></div></div></aside>;
}
export function SalesOpportunities() {
  const { items: opportunityRecords, loading: opportunitiesLoading, error: opportunitiesError, refresh: refreshOpportunities } = useLiveRecords('sales_opportunities');
  const [period, setPeriod] = React.useState('Last 30 Days');
  const [modal, setModal] = React.useState(false);
  const [ask, setAsk] = React.useState('');
  if (opportunitiesLoading) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-muted-foreground">Loading live sales opportunities…</main>;
  if (opportunitiesError) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-sm text-destructive">{opportunitiesError}</main>;
  const liveOpportunities = opportunityRecords.filter(record => !ask || `${record.name} ${record.description ?? ''} ${record.status}`.toLowerCase().includes(ask.toLowerCase()));
  return <main className="min-h-screen bg-[var(--background)] p-6 text-foreground sm:p-10"><div className="mx-auto max-w-6xl"><header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs uppercase tracking-[.18em] text-muted-foreground">Sales</p><h1 className="mt-2 text-3xl font-bold">Opportunities</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Verified sales opportunities from the connected workspace. Pipeline values and statuses are shown only from backend records.</p></div><span className="inline-flex items-center rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">Use Update in the navigation bar</span></header>{opportunityRecords.length === 0 ? <section className="rounded-2xl border border-dashed border-border bg-card p-10 text-center"><Target className="mx-auto mb-4 text-muted-foreground" size={28} /><h2 className="text-xl font-semibold">No verified sales opportunities yet</h2><p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">Connect a verified CRM or add opportunity records through the workspace API before reviewing pipeline health.</p></section> : <section className="overflow-hidden rounded-2xl border border-border bg-card"><div className="border-b border-border p-4"><label className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2"><Search size={15} className="text-muted-foreground" /><input value={ask} onChange={e => setAsk(e.target.value)} placeholder="Search live sales opportunities" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label></div><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">Opportunity</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Stage</th><th className="px-4 py-3">Value</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Updated</th></tr></thead><tbody className="divide-y divide-border">{liveOpportunities.map(record => <tr key={record.id}><td className="px-4 py-3 font-medium">{record.name}</td><td className="px-4 py-3">{record.status}</td><td className="px-4 py-3 text-muted-foreground">{record.stage ?? '—'}</td><td className="px-4 py-3">{record.valueAmount ?? '—'} {record.currency ?? ''}</td><td className="max-w-md px-4 py-3 text-muted-foreground">{record.description ?? '—'}</td><td className="px-4 py-3 text-muted-foreground">{new Date(record.updatedAt).toLocaleString()}</td></tr>)}</tbody></table></div></section>}</div></main>;
  return <main className="min-h-screen bg-[var(--background)] text-foreground"><div className="flex min-h-screen"><Sidebar /><div className="min-w-0 flex-1 bg-[var(--background)]"><header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/[.07] bg-[var(--background)]/90 px-5 backdrop-blur md:px-8"><div className="flex items-center gap-3"><button className="lg:hidden" aria-label="Open navigation"><Menu size={18} /></button><p className="text-xs text-muted-foreground">Sales <span className="mx-2">/</span><span className="text-foreground">Opportunities</span></p></div><div className="flex items-center gap-3"><span className="hidden text-[11px] text-muted-foreground sm:block">Last synced 2 min ago</span><Bell size={17} className="text-muted-foreground" /><div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">JD</div></div></header><div className="mx-auto max-w-[1500px] space-y-6 px-5 py-7 md:px-8"><header className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"><div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-foreground">Sales Intelligence</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Opportunities</h1><p className="mt-2 text-sm text-muted-foreground">Manage qualified sales opportunities, understand their potential and prioritize the next best actions.</p></div><div className="flex flex-wrap gap-2"><button className="rounded-lg border border-border px-3 py-2 text-xs">Import</button><button className="rounded-lg border border-border px-3 py-2 text-xs">Export</button><button className="rounded-lg border border-border px-3 py-2 text-xs">More <ChevronDown size={12} className="inline" /></button><button className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"><Bot size={13} className="mr-1 inline" />Ask Lulu AI</button><button onClick={() => setModal(true)} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-lg shadow-black/20"><Plus size={13} className="mr-1 inline" />Create Opportunity</button></div></header><div className="flex justify-end"><label className="text-[10px] uppercase tracking-wider text-muted-foreground">Reporting period <select value={period} onChange={e => setPeriod(e.target.value)} className="ml-2 rounded-lg border border-border bg-[var(--secondary)] px-3 py-2 text-xs normal-case tracking-normal text-foreground"><option>Today</option><option>Last 7 Days</option><option>Last 30 Days</option><option>Month to Date</option><option>Quarter to Date</option><option>Year to Date</option></select></label></div><div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{metrics.map(m => <article key={m[0]} className="rounded-xl border border-border/[.07] bg-[var(--card)] px-4 py-4"><div className="flex justify-between gap-2"><p className="text-xs text-muted-foreground">{m[0]}</p><Badge>{m[3]}</Badge></div><p className={`mt-4 text-xl font-semibold ${m[0] === 'At Risk' ? 'text-chart-1' : 'text-foreground'}`}>{m[1]}</p><p className="mt-1 text-[11px] text-foreground">{m[2]}</p></article>)}</div><div className="rounded-xl border border-border/[.07] bg-[var(--secondary)] p-3"><div className="flex flex-wrap gap-2"><div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-border bg-[var(--secondary)] px-3"><Search size={15} className="text-muted-foreground" /><input className="w-full bg-transparent py-2 text-xs outline-none" placeholder="Search opportunities..." aria-label="Search opportunities" /><kbd className="text-[10px] text-muted-foreground">⌘K</kbd></div>{['Status', 'Stage', 'Value', 'Probability', 'Health', 'Priority', 'Owner', 'Expected Close'].map(x => <button key={x} className="rounded-lg border border-border px-3 py-2 text-[11px] text-foreground">{x} <ChevronDown size={12} className="inline" /></button>)}</div><div className="mt-3 flex flex-wrap gap-2"><Pill>Stage: Active</Pill><Pill>Priority: High</Pill><span className="ml-auto text-[11px] text-foreground">Table · Kanban · List · Columns</span></div></div><div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/20 bg-secondary/[.07] px-3 py-2 text-[11px]"><strong className="mr-2 text-foreground">3 selected</strong>{['Assign Owner', 'Change Stage', 'Change Status', 'Update Probability', 'Add Tag', 'Export', 'Archive'].map(x => <button key={x} className="rounded border border-border px-2 py-1.5">{x}</button>)}</div><section className="overflow-x-auto rounded-xl border border-border/[.07] bg-[var(--card)]"><table className="w-full min-w-[1400px] text-left text-xs" aria-label="Sales opportunities"><thead className="text-[10px] uppercase tracking-[.13em] text-muted-foreground"><tr>{['Opportunity', 'Company', 'Contact', 'Owner', 'Stage', 'Value', 'Probability', 'Expected Close', 'Health', 'Priority', 'Next Action', ''].map(h => <th key={h} scope="col" className="px-4 py-3">{h}</th>)}</tr></thead><tbody className="divide-y divide-white/[.055]">{opps.map(o => <tr key={o.name} className="hover:bg-secondary/[.03]"><td className="px-4 py-3 font-medium text-foreground">{o.name}</td><td className="px-4 py-3 text-muted-foreground">{o.company}</td><td className="px-4 py-3 text-muted-foreground">{o.contact}</td><td className="px-4 py-3 text-foreground">{o.owner}</td><td className="px-4 py-3"><Pill>{o.stage}</Pill></td><td className="px-4 py-3 text-foreground">{o.value}</td><td className="px-4 py-3 text-foreground">{o.prob}</td><td className="px-4 py-3 text-muted-foreground">{o.close}</td><td className="px-4 py-3"><Pill>{o.health}</Pill></td><td className="px-4 py-3"><Pill>{o.priority}</Pill></td><td className="px-4 py-3 text-foreground">{o.next}</td><td className="px-4 py-3"><Ellipsis size={16} /></td></tr>)}</tbody></table><footer className="flex justify-between border-t border-border/[.07] px-4 py-3 text-[11px] text-muted-foreground"><span>1–8 of 248 opportunities</span><span>50 per page　‹　1　›</span></footer></section><div className="grid gap-5 xl:grid-cols-2"><Section eyebrow="Pipeline intelligence" title="Opportunity Funnel"><div className="space-y-3">{funnel.map((f, i) => <button key={f[0]} className="flex w-full items-center gap-3 text-left"><span className="w-24 text-xs text-muted-foreground">{f[0]}</span><span className="flex h-9 items-center rounded-r-lg bg-gradient-to-r from-primary to-primary px-3 text-[11px] text-primary-foreground" style={{
                    width: `${100 - i * 13}%`
                  }}>{f[1]}</span><span className="text-[10px] text-foreground">{f[2]}</span></button>)}</div></Section><Section eyebrow="AI-assessed" title="Opportunity Health"><div className="flex h-8 overflow-hidden rounded-full"><div className="w-[68%] bg-chart-4" /><div className="w-[17%] bg-chart-1/20" /><div className="w-[11%] bg-destructive" /><div className="w-[4%] bg-destructive" /></div><div className="mt-5 grid grid-cols-2 gap-3 text-xs"><p>🟢 Healthy <strong className="float-right text-foreground">168 (—)</strong></p><p>🟡 Needs Attention <strong className="float-right text-foreground">42 (—)</strong></p><p>🔴 At Risk <strong className="float-right text-foreground">28 (—)</strong></p><p>🔴 Critical <strong className="float-right text-foreground">10 (—)</strong></p></div><p className="mt-5 text-[11px] text-muted-foreground">AI assessment. Supporting signals shown. Not a guarantee.</p></Section></div><div className="grid gap-5 xl:grid-cols-2"><Section eyebrow="Attention required" title="Opportunity Aging"><div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{[['Avg Age', '38 days'], ['Oldest', '112 days'], ['Stalled', '22'], ['Overdue close', '14']].map(x => <div key={x[0]}><p className="text-[10px] text-muted-foreground">{x[0]}</p><strong className="text-foreground">{x[1]}</strong></div>)}</div><div className="mt-5 space-y-3 text-xs">{['Analytics Dashboard · Discovery · 112 days', 'Sales Automation · Discovery · 84 days', 'Cloud Migration Suite · Proposal · 46 days', 'CRM Integration · Qualified · 38 days'].map(x => <p key={x} className="border-b border-border/[.055] pb-2 text-muted-foreground">{x}<button className="float-right text-foreground">Review</button></p>)}</div></Section><Section eyebrow="Action required" title="Opportunities at Risk"><div className="space-y-3 text-xs">{[['Analytics Dashboard', 'No activity 8 days', 'Re-engage customer'], ['Sales Automation', 'Stage aging 42 days', 'Qualify budget'], ['CRM Integration', 'Missing next action', 'Schedule workspace'], ['Cloud Migration Suite', 'Close date approaching', 'Confirm proposal status']].map(x => <div key={x[0]} className="border-b border-border/[.055] pb-3"><strong className="text-foreground">{x[0]}</strong><span className="ml-3 text-chart-1">{x[1]}</span><button className="float-right text-foreground">{x[2]}</button></div>)}</div></Section></div><Section eyebrow="AI-recommended" title="Next Best Actions"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{actions.map(a => <article key={a[0]} className="rounded-xl border border-border/[.07] bg-[var(--card)] p-4"><p className="text-[10px] uppercase tracking-wider text-foreground">{a[0]}</p><h3 className="mt-3 text-sm font-semibold text-foreground">{a[1]}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{a[2]}</p><button className="mt-4 rounded bg-secondary/15 px-2 py-1.5 text-[10px] text-foreground">Create Task</button></article>)}</div></Section><div className="grid gap-5 xl:grid-cols-2"><Section eyebrow="AI-generated" title="AI Opportunity Insights"><div className="space-y-3">{['Strategic Partnership has strong estimated value (—) and recent engagement signals.', 'Analytics Dashboard has remained in Discovery stage for 38 days, above average.', 'Sales Automation current probability (28%) may be optimistic.'].map(x => <article key={x} className="rounded-lg border border-border/20 bg-secondary/[.04] p-3 text-xs leading-5 text-foreground"><Badge>AI</Badge><p className="mt-2">{x}</p></article>)}</div></Section><Section eyebrow="AI-recommended" title="AI Recommendations"><div className="space-y-4 text-xs">{['Prioritize Strategic Partnership', 'Schedule Follow-up: Enterprise Expansion', 'Recalculate Probability: Sales Automation'].map(x => <div key={x} className="flex items-center gap-3"><Sparkles size={14} className="text-foreground" /><strong className="flex-1 text-foreground">{x}</strong><button className="text-foreground">Review</button></div>)}</div></Section></div><Section title="Recent Activity"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{['Strategic Partnership stage changed: Negotiation → Commit', 'Enterprise Expansion AI recommendation generated', 'Cloud Migration Suite probability changed: 40% → 45%', 'CRM Integration owner changed: unassigned → Marcus H', 'Sales Automation opportunity created'].map(x => <p key={x} className="border-l border-border/30 pl-3 text-xs leading-5 text-muted-foreground">{x}<span className="block text-[10px] text-muted-foreground">Today · Lulu AI</span></p>)}</div></Section><Section eyebrow="Explore your opportunities" title="Ask Lulu AI"><form onSubmit={e => {
              e.preventDefault();
              setAsk('');
            }} className="flex gap-2"><input value={ask} onChange={e => setAsk(e.target.value)} className="flex-1 rounded-lg border border-border bg-[var(--secondary)] px-3 py-3 text-sm outline-none" placeholder="Ask Lulu AI about your opportunities..." /><button className="rounded-lg bg-primary px-5 text-xs font-semibold text-primary-foreground">Send</button></form><div className="mt-4 flex flex-wrap gap-2">{prompts.map(x => <button key={x} onClick={() => setAsk(x)} className="rounded-full border border-border px-3 py-1.5 text-[10px] text-foreground">{x}</button>)}</div></Section><footer className="flex justify-between border-t border-border/[.07] pt-5 text-[10px] text-muted-foreground"><span>Opportunities · Lulu AI Sales</span><span>Recorded · Calculated · AI-generated · Forecast</span></footer></div></div></div>{modal && <div className="fixed inset-0 z-50 flex justify-end bg-primary/70 backdrop-blur"><section role="dialog" aria-modal="true" className="h-full w-full max-w-[520px] overflow-y-auto border-l border-border bg-[var(--card)] p-6"><header className="flex justify-between"><div><p className="text-[10px] uppercase tracking-widest text-foreground">Sales workspace</p><h2 className="text-xl font-semibold text-foreground">Create Opportunity</h2></div><button onClick={() => setModal(false)} aria-label="Close modal"><X /></button></header><div className="mt-6 grid grid-cols-2 gap-3">{['Opportunity Name', 'Description', 'Type', 'Source', 'Status', 'Stage', 'Priority', 'Owner', 'Company', 'Contact', 'Estimated Value', 'Currency', 'Probability %', 'Expected Close Date', 'Products / Services', 'Territory', 'Tags', 'Notes', 'Custom Fields'].map(x => <label key={x} className={x === 'Description' || x === 'Products / Services' || x === 'Notes' || x === 'Custom Fields' ? 'col-span-2 text-xs text-muted-foreground' : 'text-xs text-muted-foreground'}>{x}<input className="mt-1 w-full rounded-lg border border-border bg-[var(--secondary)] p-2.5 text-foreground" /></label>)}</div><p className="mt-5 rounded-lg border border-border/20 p-3 text-[11px] text-foreground">Potential duplicates will be checked before creating. You have unsaved changes.</p><footer className="mt-6 flex justify-end gap-2"><button onClick={() => setModal(false)} className="rounded-lg border border-border px-3 py-2 text-xs">Cancel</button><button className="rounded-lg border border-border/20 px-3 py-2 text-xs text-foreground">Create & Add Another</button><button className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Create Opportunity</button></footer></section></div>}</main>;
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
  "label": "Website & Commerce",
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
    "id": "sparklingly-moon-5114",
    "label": "SEO"
  }, {
    "id": "zealously-path-4224",
    "label": "GEO"
  }, {
    "id": "sunny-house-9595",
    "label": "AEO"
  }, {
    "id": "daring-brook-9034",
    "label": "Reviews"
  }, {
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
          <span data-lulu-section-soon={section.label !== "Website & Commerce" && section.label !== "Settings" ? "true" : undefined}>{section.label}</span>
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

