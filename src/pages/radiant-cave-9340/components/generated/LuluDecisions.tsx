import { useState } from 'react';
import { Activity, AlertTriangle, ArrowRight, BarChart3, Bell, Bot, Check, ChevronDown, Clock3, Database, Download, FileText, Filter, HelpCircle, LayoutDashboard, Lightbulb, MessageCircle, MoreHorizontal, Plus, RefreshCw, Search, Settings, ShieldAlert, Sparkles, Target, TrendingUp, UserRound, Users, X, Zap } from 'lucide-react';
const stats: any[][] = [];
const decisions: Array<Record<string, any>> = [];
const evidence: any[][] = [];
const scenarios: any[][] = [];
const compareRows = [['Expected Impact', '+—', '+—', 'Stable', '-—'], ['Revenue Potential', 'High', 'Favorable', 'None', 'Negative'], ['Cost', '+—/mo', '+—/mo', '—', '-—/mo'], ['Profitability', 'Neutral', 'Favorable', 'Neutral', 'Unfavorable'], ['Risk', 'Medium', 'Low', 'Low', 'Medium'], ['Confidence', 'Medium', 'High', 'High', 'Medium'], ['Effort', 'Low', 'Low', 'None', 'Low'], ['Time to Impact', '30 days', '30 days', '—', '30 days'], ['Reversibility', 'High', 'High', 'High', 'High'], ['Strategic Alignment', 'Strong', 'Strong', 'Neutral', 'Weak']];
const navItems = [['Overview', LayoutDashboard], ['Signals', Activity], ['Opportunities', Target], ['Decisions', Lightbulb], ['Risks', ShieldAlert], ['Scenarios', BarChart3], ['Reports', FileText]];
function Sidebar() {
  return <aside className="hidden lg:flex w-[248px] shrink-0 border-r border-border/80 bg-[var(--background)] flex-col min-h-screen">
    <div className="h-20 px-6 flex items-center gap-3 border-b border-border/70"><div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary grid place-items-center shadow-lg shadow-black/20 text-primary-foreground"><Sparkles size={19} /></div><div><strong className="text-foreground tracking-tight">Lulu AI</strong><p className="text-[10px] text-muted-foreground uppercase tracking-[.18em]">Core Platform</p></div></div>
    <div className="min-h-0 flex flex-1 flex-col overflow-hidden px-4 py-4"><LuluSectionNavigation activeId="radiant-cave-9340" /></div>
    <div className="p-4 border-t border-border/70"><button className="flex items-center gap-3 px-3 py-2 text-sm text-foreground"><Settings size={17} /> Settings</button><div className="mt-4 flex items-center gap-3 px-3"><div className="h-8 w-8 rounded-full bg-secondary/30 grid place-items-center text-xs text-foreground">JD</div><div><p className="text-xs text-foreground">Workspace member</p><p className="text-[11px] text-muted-foreground">Admin workspace</p></div></div></div>
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
    <div className="px-5 pb-16 md:px-8"><div className="grid grid-cols-2 gap-2 py-5 md:grid-cols-4 xl:grid-cols-7">{stats.map(([number, label, color]) => <div key={label} className="rounded-lg border border-border bg-[var(--secondary)]/80 p-3"><div className="flex items-center justify-between"><strong className="text-xl text-foreground">{number}</strong><span className={`h-2 w-2 rounded-full ${color.includes('red') ? 'bg-destructive' : color.includes('amber') ? 'bg-primary' : color.includes('green') ? 'bg-primary' : 'bg-primary'} ${color.includes('pulse') ? 'animate-pulse shadow-[0_0_10px_currentColor]' : ''}`} /></div><p className="mt-1 text-[11px] leading-4 text-muted-foreground">{label}</p></div>)}</div><div className="flex items-center gap-3 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground"><AlertTriangle size={17} /><span>No verified live decisions are available for management analysis yet.</span></div>
      <div className="mt-5 rounded-xl border border-dashed border-border p-5"><div className="flex items-center gap-3"><Bot size={17} /><h2 className="font-semibold text-foreground">AI Decision Summary</h2></div><p className="mt-2 text-sm leading-6 text-muted-foreground">No AI decision summary can be generated until verified workspace decision data is available.</p></div>
      <div className="mt-7 flex gap-1 overflow-x-auto border-b border-border pb-px">{['Open', 'Awaiting Input', 'Awaiting Approval', 'High Impact', 'Overdue', 'Monitoring', 'Completed', 'Deferred', 'All'].map(tab => <button key={tab} className="whitespace-nowrap px-3 py-3 text-xs text-foreground hover:text-foreground">{tab}</button>)}</div><div className="flex flex-wrap gap-2 py-4">{['Status', 'Priority', 'Business Area', 'Owner', 'Decision Type', 'Source', 'Risk', 'Decision Window', 'Requires Approval', 'AI Recommendation', 'Date'].map(filter => <button key={filter} className="inline-flex items-center gap-2 rounded-md border border-border bg-[var(--primary)] px-3 py-2 text-xs text-primary-foreground hover:border-border/50 hover:text-primary-foreground"><Filter size={12} />{filter}<ChevronDown size={12} /></button>)}</div>
      <Section title="Open Decisions" eyebrow="Decision queue" action={<span className="text-xs text-muted-foreground">Showing 6 of 8</span>}><div className="overflow-x-auto rounded-xl border border-border"><table className="w-full min-w-[1060px] text-left text-xs"><thead className="bg-[var(--card)] text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{['Decision', 'Business Area', 'Priority', 'Owner', 'Deadline', 'Status', 'AI Recommendation', 'Risk', 'Actions'].map(heading => <th key={heading} className="px-4 py-3 font-medium">{heading}</th>)}</tr></thead><tbody className="divide-y divide-border/80">{decisions.map(decision => <tr key={decision.title} className="bg-[var(--card)] transition hover:bg-[var(--card)]"><td className="max-w-[220px] px-4 py-4 font-medium text-foreground">{decision.title}</td><td className="px-4 py-4 text-muted-foreground">{decision.area}</td><td className="px-4 py-4"><Pill tone={tone(decision.priority)}>{decision.priority}</Pill></td><td className="px-4 py-4 text-muted-foreground">{decision.owner}</td><td className="px-4 py-4"><span className={decision.deadline === 'Overdue' ? 'text-chart-5' : 'text-foreground'}>{decision.deadline}</span></td><td className="px-4 py-4"><Pill tone={tone(decision.status)}>{decision.status}</Pill></td><td className="px-4 py-4">{decision.rec.includes('recommended') ? <Pill tone="violet"><Sparkles size={11} />{decision.rec}</Pill> : <span className="text-muted-foreground">{decision.rec}</span>}</td><td className="px-4 py-4"><Pill tone={tone(decision.risk)}>{decision.risk}</Pill></td><td className="px-4 py-4"><div className="flex gap-1"><button className="rounded bg-card px-2 py-1.5 text-foreground hover:text-foreground">Open</button><button className="rounded bg-secondary/15 px-2 py-1.5 text-foreground hover:bg-secondary/30">Review</button>{decision.title.includes('Google') && <button onClick={() => setSelected('Option B')} className="rounded bg-secondary/15 px-2 py-1.5 text-foreground">Decide</button>}</div></td></tr>)}</tbody></table></div></Section>
      <Section title="Decision detail" eyebrow="Live workspace data"><div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Connect a decision source or create a real workspace decision to generate evidence, scenarios and recommendations.</div></Section>
      <Section title="Ask Lulu AI" eyebrow="Decision copilot"><div className="rounded-xl border border-border/20 bg-[var(--secondary)] p-5"><div className="relative"><Bot className="absolute left-3 top-3 text-muted-foreground" size={17} /><input placeholder="Ask Lulu AI about your decisions..." className="w-full rounded-lg border border-border bg-[var(--secondary)] py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-border" /></div><div className="mt-4 flex flex-wrap gap-2">{['Which decisions require my attention?', 'What is the most important decision?', 'What does Lulu AI recommend?', 'Compare my current options.', 'What are the biggest risks?', 'Which decisions are overdue?'].map(prompt => <button key={prompt} className="rounded-full border border-border px-3 py-2 text-xs text-foreground hover:border-border/50 hover:text-foreground">{prompt}</button>)}</div></div></Section>
      <div className="mt-8 grid gap-5 xl:grid-cols-2"><div className="rounded-xl border border-border bg-[var(--secondary)] p-6"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-foreground">Decision History</h2><Clock3 size={17} className="text-muted-foreground" /></div><ol className="mt-5 space-y-4 border-l border-border/30 pl-5 text-sm">{['Created · User · 2 days ago', 'Input Requested · User · Yesterday', 'Recommendation Generated · AI · 4 hours ago', 'Approval Requested · User · 2 hours ago', 'Monitoring Started · AI · Pending'].map(event => <li key={event} className="relative text-foreground"><span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-[var(--muted-foreground)] text-primary-foreground" />{event}</li>)}</ol></div><div className="rounded-xl border border-border bg-[var(--secondary)] p-6"><h2 className="text-lg font-semibold text-foreground">Data Sources & Quality</h2><div className="mt-5 space-y-3">{['Google Ads · Synced 4 min ago · Excellent', 'Meta Ads · Synced 18 min ago · Good', 'GA4 · Synced 12 min ago · Excellent', 'CRM · Synced 1 hour ago · Good', 'Finance · Synced 2 hours ago · Limited'].map(source => <div key={source} className="flex items-center justify-between border-b border-border pb-3 text-xs"><span className="text-foreground">{source.split(' · ')[0]}</span><span className={source.includes('Limited') ? 'text-foreground' : 'text-foreground'}>{source.split(' · ').slice(1).join(' · ')}</span></div>)}</div><div className="mt-5 flex flex-wrap gap-2"><Pill tone="green">Completeness · Excellent</Pill><Pill tone="green">Freshness · Good</Pill><Pill tone="amber">Coverage · Limited</Pill></div></div></div>
    </div></main></div>
    {showModal && <dialog open aria-labelledby="decision-modal-title" className="fixed inset-0 z-50 m-auto w-[min(92vw,520px)] rounded-2xl border border-border/30 bg-[var(--card)] p-0 text-foreground shadow-2xl shadow-black/60 backdrop:bg-primary/70"><div className="p-6"><div className="flex items-start justify-between"><div><p className="text-[10px] uppercase tracking-[.2em] text-foreground">Human approval checkpoint</p><h2 id="decision-modal-title" className="mt-2 text-xl font-semibold text-foreground">Confirm Decision</h2></div><button onClick={() => setShowModal(false)} aria-label="Close dialog" className="text-foreground hover:text-foreground"><X size={18} /></button></div><div className="mt-6 space-y-4 rounded-lg bg-[var(--secondary)] p-4 text-sm"><p><span className="text-muted-foreground">Selected</span><strong className="ml-3 text-foreground">{selected} — Increase budget by —</strong></p><p><span className="text-muted-foreground">Expected Impact</span><strong className="ml-3 text-chart-4">Estimated +— revenue</strong></p><p><span className="text-muted-foreground">Risks</span><strong className="ml-3 text-foreground">Low–Medium</strong></p><p><span className="text-muted-foreground">Dependencies</span><strong className="ml-3 text-foreground">CFO approval, Google Ads write access</strong></p></div><div className="mt-4 flex gap-3 rounded-lg border border-border/20 bg-secondary/10 p-4 text-xs leading-5 text-foreground"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-foreground" />This decision may trigger downstream tasks or AI execution.</div><div className="mt-6 flex justify-end gap-2"><button onClick={() => setShowModal(false)} className="rounded-lg border border-border px-4 py-2.5 text-sm text-foreground">Go Back</button><button onClick={() => {
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
