import { useLiveRecords } from '../../../../api/useLiveRecords';
import { useMemo, useState, type ReactNode } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Brain, Building2, CalendarDays, Check, CheckCircle2, ChevronDown, CircleDollarSign, Clock3, Filter, Gauge, Layers3, Menu, RefreshCw, Search, Settings, ShieldAlert, Sparkles, Target, UserRound, Users, X } from 'lucide-react';
type Tone = 'green' | 'blue' | 'amber' | 'red' | 'gray' | 'purple';
type IconType = typeof Users;
const navItems: {
  label: string;
  icon: IconType;
}[] = [{
  label: 'CRM',
  icon: Users
}, {
  label: 'Contacts',
  icon: UserRound
}, {
  label: 'Companies',
  icon: Building2
}, {
  label: 'Leads',
  icon: Target
}, {
  label: 'Deals',
  icon: CircleDollarSign
}, {
  label: 'Pipeline',
  icon: BarChart3
}, {
  label: 'Activities',
  icon: Activity
}, {
  label: 'Tasks',
  icon: CheckCircle2
}, {
  label: 'Customer Segments',
  icon: Layers3
}, {
  label: 'Customer Intelligence',
  icon: Brain
}];
const kpis: any[][] = [];
const health: any[][] = [];
const values: any[][] = [];
const lifecycle: any[][] = [];
const topCustomers: any[][] = [];
const growing: any[][] = [];
const attention: any[][] = [];
const insights: any[][] = [];
const opportunities: any[][] = [];
const risks: any[][] = [];
const movement: any[][] = [];
const cohorts: [string, string[]][] = [];
function toneClass(tone: string, text = false) {
  const map: Record<string, string> = {
    green: 'emerald',
    blue: 'blue',
    amber: 'amber',
    red: 'rose',
    gray: 'slate',
    purple: 'indigo'
  };
  return `${text ? 'text' : 'bg'}-${map[tone] ?? 'slate'}-${text ? '600' : '500'}`;
}
function Panel({
  title,
  eyebrow,
  children,
  className = '',
  tint = false
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  tint?: boolean;
}) {
  return <section className={`rounded-2xl border p-5 shadow-[0_1px_2px_rgba(0,0,0,.03)] ${tint ? 'border-border bg-[var(--card)]' : 'border-border bg-card'} ${className}`}><header className="mb-5 flex items-start justify-between gap-4"><div>{eyebrow && <p className="text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">{eyebrow}</p>}<h2 className="mt-1 text-[17px] font-bold tracking-[-.02em] text-foreground">{title}</h2></div></header>{children}</section>;
}
function MiniLine({
  color = 'var(--foreground)',
  points = ''
}: {
  color?: string;
  points?: string;
}) {
  return <svg viewBox="0 0 168 50" className="h-14 w-full" role="img" aria-label="Trend chart"><path d="M0 46H168" stroke="var(--border)" /><polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Sidebar({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  return <aside className={`${open ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-30 w-[248px] flex-col bg-[var(--sidebar)] px-4 py-5 lg:flex`}><div className="flex items-center justify-between px-2"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-lg font-extrabold text-primary-foreground">L</div><strong className="text-[15px] text-foreground">Lulu AI</strong></div><button className="text-foreground lg:hidden" onClick={onClose} aria-label="Close navigation"><X size={18} /></button></div><div className="mt-9 px-2 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">Workspace</div><LuluSectionNavigation activeId="gracefully-storm-2649" /><div className="my-5 border-t border-border" /><button className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-foreground hover:text-foreground"><Settings size={16} /><span>Settings</span></button><div className="mt-auto border-t border-border pt-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-muted text-xs font-semibold text-foreground">JD</div><div><p className="text-[13px] font-semibold text-foreground">Workspace member</p><p className="text-[11px] text-muted-foreground">CRM Manager</p></div></div><p className="mt-4 flex items-center gap-2 text-[11px] text-chart-4"><span className="h-2 w-2 rounded-full bg-chart-4" />AI Active</p></div></aside>;
}
export function CustomerIntelligence() {
  const { items, loading, error } = useLiveRecords('crm_customer_insights');
  return <div className="min-h-screen bg-[var(--background)] text-foreground"><Sidebar open={true} onClose={() => undefined} /><main className="lg:ml-[248px]"><div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8"><div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground"><span>CRM</span><span>/</span><strong className="text-muted-foreground">Customer Intelligence</strong></div><header className="mb-7"><p className="mb-2 text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">Connected customer analytics</p><h1 className="text-3xl font-extrabold tracking-[-.04em] text-foreground sm:text-[38px]">Customer Intelligence</h1><p className="mt-2 max-w-2xl text-[14px] leading-6 text-muted-foreground">Live customer patterns, value signals and opportunities from connected CRM data.</p></header>{loading ? <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">Loading live customer intelligence…</div> : error ? <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-destructive">{error}</div> : !items.length ? <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-dashed border-border bg-card p-10 text-center"><div><Brain className="mx-auto text-muted-foreground" size={36} /><h2 className="mt-4 text-xl font-semibold text-foreground">No customer intelligence available yet</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Connect your CRM or add customer activity to populate health, value, lifecycle, retention and engagement analysis. No example scores or rates are displayed.</p></div></div> : <section className="overflow-x-auto rounded-2xl border border-border bg-card"><table className="w-full min-w-[780px] text-left"><thead className="border-b border-border bg-secondary text-[10px] font-bold uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-3">Insight</th><th className="px-3 py-3">Customer / Segment</th><th className="px-3 py-3">Value</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Updated</th></tr></thead><tbody className="divide-y divide-border">{items.map(record => <tr key={record.id}><td className="px-5 py-3 text-xs font-semibold text-foreground">{record.name}</td><td className="px-3 py-3 text-xs text-muted-foreground">{String(record.data?.customer || record.data?.segment || 'Connected workspace')}</td><td className="px-3 py-3 text-xs text-foreground">{record.valueAmount || '—'}</td><td className="px-3 py-3 text-xs text-muted-foreground">{record.status || 'Recorded'}</td><td className="px-3 py-3 text-xs text-muted-foreground">{record.updatedAt}</td></tr>)}</tbody></table></section>}</div></main></div>;
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
