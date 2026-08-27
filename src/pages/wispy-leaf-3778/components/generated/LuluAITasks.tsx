import { useLiveRecords } from '../../../../api/useLiveRecords';
import { useState } from 'react';
import { Activity, AlertCircle, Archive, ArrowRight, BarChart3, Bell, Bot, Check, ChevronDown, ChevronRight, CircleHelp, Clock3, Cloud, Database, Download, FileText, Filter, Flag, Gauge, GitBranch, Heart, History, Inbox, Info, LayoutDashboard, LifeBuoy, ListChecks, Menu, MessageSquare, MoreHorizontal, Pause, Play, Plus, RefreshCw, Search, Settings, Share2, ShieldCheck, Sparkles, Target, Trash2, UserRound, Users, X, Zap } from 'lucide-react';
type ModalKind = 'approve' | 'reject' | 'pause' | 'cancel' | 'retry' | 'create' | null;
type Tone = 'gray' | 'amber' | 'green' | 'red' | 'orange' | 'blue' | 'indigo' | 'purple' | 'teal';
interface Task {
  id: string;
  name: string;
  source: string;
  area: string;
  priority: string;
  status: string;
  owner: string;
  mode: string;
  due: string;
  progress?: number;
}
const stats: any[][] = [];
const tabs = ['All Tasks', 'My Tasks', 'AI Tasks', 'Human Tasks', 'Pending Approval', 'Executing', 'Scheduled', 'Completed', 'Failed', 'Blocked', 'Archived'];
const filters = ['Status', 'Priority', 'Business Area', 'Owner', 'AI / Human', 'Source', 'Platform', 'Due Date', 'Requires Approval', 'Execution Capability'];
const approvals: any[][] = [];
const tasks: Task[] = [];
const logs: any[][] = [];
const sources: any[][] = [];
const toneClass: Record<Tone, string> = {
  gray: 'bg-card/50 text-foreground border-border',
  amber: 'bg-secondary/10 text-foreground border-border/30',
  green: 'bg-secondary/10 text-foreground border-border/30',
  red: 'bg-chart-5/10 text-chart-5 border-chart-5/30',
  orange: 'bg-secondary/10 text-foreground border-border/30',
  blue: 'bg-secondary/10 text-foreground border-border/30',
  indigo: 'bg-secondary/10 text-foreground border-border/30',
  purple: 'bg-secondary/10 text-foreground border-border/30',
  teal: 'bg-secondary/10 text-foreground border-border/30'
};
function Badge({
  children,
  tone = 'gray',
  pulse = false
}: {
  children: string;
  tone?: Tone;
  pulse?: boolean;
}) {
  return <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold whitespace-nowrap ${toneClass[tone]}`}>{pulse && <i className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse text-primary-foreground" />}<span>{children}</span></span>;
}
function statusTone(status: string): Tone {
  if (status === 'Executing') return 'green';
  if (status === 'Awaiting Approval') return 'amber';
  if (status === 'Blocked') return 'orange';
  if (status === 'In Progress') return 'indigo';
  if (status === 'Approved') return 'blue';
  if (status === 'Failed') return 'red';
  return 'gray';
}
function priorityTone(priority: string): Tone {
  return priority === 'Critical' ? 'red' : priority === 'High' ? 'amber' : priority === 'Medium' ? 'blue' : 'gray';
}
export function LuluAITasks() {
  const { items, loading, error } = useLiveRecords('ai_tasks');
  return <main className="min-h-screen bg-[var(--background)] text-foreground flex font-sans"><aside className="hidden lg:flex w-[248px] shrink-0 border-r border-border bg-[var(--background)] flex-col p-4 sticky top-0 h-screen"><div className="flex items-center gap-3 px-3 py-4 mb-5"><div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground"><Sparkles size={18} /></div><div><strong className="text-foreground tracking-tight">lulu<span className="text-foreground">.</span>ai</strong><p className="text-[10px] text-muted-foreground mt-0.5">BUSINESS OS</p></div></div><LuluSectionNavigation activeId="wispy-leaf-3778" /></aside><section className="flex-1 min-w-0"><header className="h-16 border-b border-border bg-[var(--card)]/90 px-5 lg:px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md"><div className="flex items-center gap-2 text-xs text-muted-foreground"><span>Intelligence</span><ChevronRight size={13} /><span className="text-foreground">AI Tasks</span></div><button className="p-2 text-foreground" aria-label="Refresh tasks"><RefreshCw size={17} /></button></header><div className="p-5 lg:p-8 max-w-[1600px] mx-auto"><div className="mb-7"><p className="text-xs text-foreground mb-2 flex items-center gap-2"><Bot size={14} />AI INTELLIGENCE / EXECUTION CENTER</p><h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">AI Tasks</h1><p className="text-sm text-muted-foreground mt-2 max-w-xl">Manage and monitor authorized AI tasks from connected workspace data.</p></div>{loading ? <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">Loading live AI tasks…</div> : error ? <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-destructive">{error}</div> : !items.length ? <div className="flex min-h-[560px] items-center justify-center rounded-xl border border-dashed border-border bg-card p-10 text-center"><ListChecks className="mx-auto text-muted-foreground" size={38} /><h2 className="mt-4 text-xl font-semibold text-foreground">No live AI tasks available yet</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Create an authorized task or complete an analysis to populate this page. No example counts, priorities, due dates or progress values are displayed.</p><button className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Plus size={15} />Create Task</button></div> : <section className="overflow-x-auto rounded-xl border border-border bg-[var(--secondary)]"><table className="w-full min-w-[1000px] text-left"><thead className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">Task</th><th className="px-3 py-3">Source</th><th className="px-3 py-3">Area</th><th className="px-3 py-3">Priority</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Owner</th><th className="px-3 py-3">Due</th><th className="px-3 py-3">Updated</th></tr></thead><tbody>{items.map(record => <tr key={record.id} className="border-b border-border last:border-0"><td className="px-4 py-3.5 text-sm font-medium text-foreground">{record.name}</td><td className="px-3 py-3.5 text-xs text-muted-foreground">{String(record.data?.source || 'AI task')}</td><td className="px-3 py-3.5 text-xs text-muted-foreground">{String(record.data?.area || 'Connected workspace')}</td><td className="px-3 py-3.5 text-xs text-muted-foreground">{String(record.data?.priority || 'Recorded')}</td><td className="px-3 py-3.5 text-xs text-muted-foreground">{record.status || 'Recorded'}</td><td className="px-3 py-3.5 text-xs text-muted-foreground">{String(record.data?.owner || 'Workspace member')}</td><td className="px-3 py-3.5 text-xs text-muted-foreground">{String(record.data?.due || '—')}</td><td className="px-3 py-3.5 text-xs text-muted-foreground">{record.updatedAt}</td></tr>)}</tbody></table></section>}</div></section></main>;
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
    "id": "sparklingly-moon-5114",
    "label": "SEO"
  }, {
    "id": "zealously-path-4224",
    "label": "GEO"
  }, {
    "id": "sunny-house-9595",
    "label": "AEO"
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
