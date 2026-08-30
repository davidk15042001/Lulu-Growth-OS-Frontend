import * as React from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Bot, CalendarDays, ChevronDown, ChevronRight, Download, FilePlus2, LineChart, Menu, MessageSquare, MoreHorizontal, RefreshCw, Search, Settings, Sparkles, Target, Users } from 'lucide-react';
type Metric = {
  label: string;
  value: string;
  prev: string;
  change: string;
  source: string;
  down?: boolean;
};
type Customer = {
  name: string;
  revenue: string;
  share: string;
  growth: string;
  previous: string;
  segment: string;
};
const overview: Metric[] = [];
const months: Array<Record<string, any>> = [];
const customers: Customer[] = [];
const channels: any[][] = [];
const segments: any[][] = [];
const geo = [['United Kingdom', '374', '—', '+12%', '—'], ['Germany', '214', '20%', '+19%', '—'], ['United States', '160', '15%', '+24%', '—'], ['France', '107', '10%', '+8%', '—'], ['Netherlands', '85', '8%', '+28%', '—'], ['Other', '128', '12%', '+14%', '—']];
const sources: any[][] = [];
const cohort: string[] = [];
function Spark({
  color = 'var(--primary)'
}: {
  color?: string;
}) {
  return <svg viewBox="0 0 100 30" className="h-8 w-24" role="img" aria-label="Upward trend"><polyline points="2,25 14,22 25,23 38,16 49,18 62,10 75,12 88,6 98,3" fill="none" stroke={color} strokeWidth="2.5" /><circle cx="98" cy="3" r="2.5" fill={color} /></svg>;
}
function Card({
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
function Bars({
  color = 'bg-primary',
  negative = false
}: {
  color?: string;
  negative?: boolean;
}) {
  return <div className="flex h-40 items-end gap-2 border-b border-l border-border/[.08] bg-[linear-gradient(rgba(0,0,0,.035)_1px,transparent_1px)] bg-[length:100%_36px] px-3 pt-4">{months.map(item => <div key={item.m} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="flex w-full items-end justify-center gap-1"><div className={`w-2 rounded-t ${color}`} style={{
          height: `${item.v}%`
        }} /><div className={`w-1.5 rounded-t ${negative ? 'bg-chart-5/70' : 'bg-secondary/70'}`} style={{
          height: `${item.n}%`
        }} /></div><span className="text-[9px] text-muted-foreground">{item.m}</span></div>)}</div>;
}
function Sidebar() {
  return <aside className="hidden w-[236px] shrink-0 border-r border-border/[.07] bg-[var(--sidebar)] px-3 py-5 lg:block"><div className="flex items-center gap-3 px-3"><div className="grid h-8 w-8 place-items-center rounded-xl bg-primary shadow-lg shadow-black/30 text-primary-foreground"><Sparkles size={16} /></div><div><p className="text-sm font-bold text-foreground">Lulu <span className="text-foreground">AI</span></p><p className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">Business OS</p></div></div><div className="my-7 h-px bg-secondary" /><LuluSectionNavigation activeId="dreamily-shade-6192" /><div className="mt-10 rounded-xl border border-border/15 bg-secondary/[.07] p-3"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground"><Bot size={15} />Ask Lulu</div><p className="text-[11px] leading-relaxed text-muted-foreground">Get a clear answer from your business data.</p></div></aside>;
}
export function CustomersIntelligence() {
  const { items, loading, error } = useLiveRecords('crm_customer_insights');
  return <main className="min-h-screen bg-[var(--background)] text-foreground"><div className="flex min-h-screen"><Sidebar /><div className="min-w-0 flex-1">{loading ? <div className="border-b border-border bg-secondary/30 px-5 py-3 text-xs text-muted-foreground lg:px-8">Loading live customer intelligence…</div> : error ? <div className="border-b border-destructive/30 bg-destructive/5 px-5 py-3 text-xs text-destructive lg:px-8">{error}</div> : null}<header className="sticky top-0 z-10 flex min-h-[70px] items-center justify-between border-b border-border bg-[var(--background)]/95 px-5 backdrop-blur-xl lg:px-8"><p className="text-xs text-muted-foreground">Intelligence <span className="mx-1 text-foreground">/</span> Business Intelligence <span className="mx-1 text-foreground">/</span> <span className="text-foreground">Customers</span></p><button className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"><Bot size={14} className="mr-1 inline" />Ask Lulu AI</button></header><div className="mx-auto max-w-[1450px] px-5 py-7 lg:px-8"><div className="mb-8"><div className="mb-3 flex items-center gap-2 text-xs font-medium text-foreground"><span className="h-1.5 w-1.5 rounded-full bg-chart-4" />Live intelligence</div><h1 className="text-4xl font-bold tracking-[-.04em] text-foreground sm:text-5xl">Customers</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Live customer intelligence from connected CRM and workspace sources.</p></div><section className="flex min-h-[520px] items-center justify-center rounded-2xl border border-dashed border-border bg-card p-10 text-center"><div><Users className="mx-auto text-muted-foreground" size={34} />{loading ? <h2 className="mt-4 text-xl font-semibold">Loading live customer data…</h2> : error ? <h2 className="mt-4 text-xl font-semibold">Customer intelligence could not be loaded</h2> : <h2 className="mt-4 text-xl font-semibold">No customer intelligence available yet</h2>}<p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{items.length ? `${items.length} live customer insight records are available.` : 'Connect your CRM or add customer activity to populate growth, retention, acquisition and customer value analysis. No example metrics are displayed.'}</p></div></section></div></div></div></main>;
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
