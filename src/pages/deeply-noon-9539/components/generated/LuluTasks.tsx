import { useMemo, useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertTriangle, ArrowDown, ArrowUp, Bot, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Circle, Clock3, Filter, Gem, GripVertical, LayoutDashboard, ListFilter, Menu, MoreHorizontal, Plus, RefreshCcw, Search, Settings, Sparkles, Target, Users, X, Zap, UserRound, BriefcaseBusiness, SlidersHorizontal, CheckSquare2, Ban, CalendarClock, Trash2, Pencil, UserPlus, Download, ArrowRight, CircleDot, Link2, WandSparkles, PanelRight, MoveRight } from 'lucide-react';
type Task = {
  id: string;
  title: string;
  related: string;
  due: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  assignee: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Blocked' | 'Overdue';
  source: string;
  checked?: boolean;
};
const tasks: Task[] = [];
const workload: Array<Record<string, any>> = [];
const nav = [{
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  label: 'AI Insights',
  icon: Sparkles
}, {
  label: 'CRM',
  icon: BriefcaseBusiness
}, {
  label: 'AI Assistant',
  icon: Bot
}, {
  label: 'AI Agents',
  icon: WandSparkles
}, {
  label: 'Settings',
  icon: Settings
}];
const crmLinks = ['Overview', 'Contacts', 'Companies', 'Leads', 'Deals', 'Pipeline', 'Activities', 'Tasks'];
const aiPriority: Array<Record<string, any>> = [];
function Priority({
  value
}: {
  value: Task['priority'];
}) {
  const Icon = value === 'Critical' ? Gem : value === 'High' ? ArrowUp : value === 'Medium' ? ArrowRight : ArrowDown;
  const color = value === 'Critical' || value === 'High' ? 'text-chart-5' : value === 'Medium' ? 'text-foreground' : 'text-foreground';
  return <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${color}`}><Icon size={14} strokeWidth={2.5} /><span>{value}</span></span>;
}
function Avatar({
  name
}: {
  name: string;
}) {
  return <span aria-label={name} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-gradient-to-br from-primary to-primary text-[10px] font-bold text-primary-foreground">{name.split(' ').map(part => part[0]).join('')}</span>;
}
function Status({
  value
}: {
  value: Task['status'];
}) {
  const styles: Record<string, string> = {
    'Not Started': 'bg-secondary text-foreground',
    'In Progress': 'bg-secondary/15 text-foreground',
    Completed: 'bg-chart-4/15 text-chart-4',
    Blocked: 'bg-chart-5/15 text-chart-5',
    Overdue: 'bg-chart-5/15 text-chart-5'
  };
  return <span className={`rounded-md px-2 py-1 text-[11px] font-medium ${styles[value]}`}>{value}</span>;
}
function Source({
  value
}: {
  value: string;
}) {
  const Icon = value === 'AI-generated' ? Sparkles : value === 'Automation' ? Zap : value === 'Integration' ? Link2 : CircleDot;
  return <span className={`inline-flex items-center gap-1 text-[11px] ${value === 'AI-generated' ? 'text-foreground' : 'text-muted-foreground'}`}><Icon size={13} />{value}</span>;
}
export function LuluTasks() {
  const [query, setQuery] = useState('');
  const { items: liveTasks, loading: liveLoading, error: liveError } = useLiveRecords('crm_tasks');
  const rows: Task[] = liveTasks.map(record => ({
    id: String(record.id),
    title: String(record.name),
    related: String(record.data?.related || record.data?.company || 'Connected workspace record'),
    due: String(record.data?.dueDate || '—'),
    priority: (String(record.data?.priority || 'Medium') as Task['priority']),
    assignee: String(record.data?.assignee || 'Workspace assignee'),
    status: (String(record.status || 'Not Started') as Task['status']),
    source: String(record.data?.source || 'Connected workspace'),
  }));
  const filtered = rows.filter(task => `${task.title} ${task.related} ${task.assignee}`.toLowerCase().includes(query.toLowerCase()));
  return <main className="min-h-screen bg-[var(--background)] text-foreground font-sans">{liveLoading ? <div className="border-b border-border bg-secondary/30 px-5 py-3 text-xs text-muted-foreground lg:pl-[244px]">Loading live CRM tasks…</div> : liveError ? <div className="border-b border-destructive/30 bg-destructive/5 px-5 py-3 text-xs text-destructive lg:pl-[244px]">{liveError}</div> : null}<aside className="fixed inset-y-0 left-0 z-20 hidden w-[224px] border-r border-border/[.07] bg-[var(--sidebar)] px-4 py-5 lg:flex lg:flex-col"><div className="mb-9 flex items-center gap-3 px-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Gem size={18} fill="currentColor" /></span><strong className="text-[17px] tracking-tight">Lulu <span className="text-foreground">AI</span></strong></div><LuluSectionNavigation activeId="deeply-noon-9539" /></aside><section><header className="flex items-center justify-between border-b border-border/[.07] px-5 py-4 sm:px-8"><div className="text-xs text-muted-foreground"><span>CRM</span><span className="mx-2 text-foreground">/</span><span className="text-foreground">Tasks</span></div><button className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground"><Plus size={15} /> Create Task</button></header><div className="mx-auto max-w-[1260px] px-5 py-7 sm:px-8"><div className="mb-7"><p className="mb-2 text-xs font-medium uppercase tracking-[.18em] text-foreground">CRM workspace</p><h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-[34px]">Tasks</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Live task records from your connected workspace.</p></div><section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4"><article className="rounded-xl border border-border/[.08] bg-card p-4"><span className="text-xs text-muted-foreground">Live Tasks</span><strong className="mt-3 block text-2xl text-foreground">{liveTasks.length}</strong></article><article className="rounded-xl border border-border/[.08] bg-card p-4"><span className="text-xs text-muted-foreground">Completed</span><strong className="mt-3 block text-2xl text-foreground">{rows.filter(task => task.status === 'Completed').length}</strong></article><article className="rounded-xl border border-border/[.08] bg-card p-4"><span className="text-xs text-muted-foreground">Overdue</span><strong className="mt-3 block text-2xl text-foreground">{rows.filter(task => task.status === 'Overdue').length}</strong></article><article className="rounded-xl border border-border/[.08] bg-card p-4"><span className="text-xs text-muted-foreground">High Priority</span><strong className="mt-3 block text-2xl text-foreground">{rows.filter(task => task.priority === 'High' || task.priority === 'Critical').length}</strong></article></section><section className="rounded-xl border border-border/[.08] bg-card"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/[.07] p-4"><h2 className="text-base font-semibold text-foreground">All Tasks</h2><label className="flex min-w-[230px] items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground"><Search size={15} /><input aria-label="Search tasks" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search live tasks…" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" /></label></div>{!liveLoading && !liveError && !rows.length ? <div className="p-12 text-center text-sm text-muted-foreground">No live CRM tasks are available yet. Add a task or connect your CRM to begin.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead className="border-b border-border/[.06] bg-secondary text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">Title</th><th className="px-3 py-3">Related Record</th><th className="px-3 py-3">Due Date</th><th className="px-3 py-3">Priority</th><th className="px-3 py-3">Assignee</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Source</th></tr></thead><tbody className="divide-y divide-border">{filtered.map(task => <tr key={task.id}><td className="px-4 py-3 text-xs font-medium text-foreground">{task.title}</td><td className="px-3 py-3 text-xs text-muted-foreground">{task.related}</td><td className="px-3 py-3 text-xs text-muted-foreground">{task.due}</td><td className="px-3 py-3"><Priority value={task.priority} /></td><td className="px-3 py-3 text-xs text-muted-foreground">{task.assignee}</td><td className="px-3 py-3"><Status value={task.status} /></td><td className="px-3 py-3"><Source value={task.source} /></td></tr>)}</tbody></table></div>}</section></div></section></main>;
}
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
