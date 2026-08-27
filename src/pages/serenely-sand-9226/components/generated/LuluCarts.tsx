import * as React from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { AlertCircle, Archive, ArrowDownUp, Bell, Bot, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock3, Cloud, Download, Ellipsis, FileBarChart, Filter, Gauge, LayoutDashboard, LifeBuoy, Menu, MoreHorizontal, RefreshCw, Search, Settings, ShoppingBag, ShoppingCart, Sparkles, Store, Tags, Users, X, Zap } from 'lucide-react';
type CartStatus = 'Abandoned' | 'Converted' | 'Active' | 'Attention';
type Platform = 'Shopify' | 'WooCommerce' | 'Webflow';
type Cart = {
  id: string;
  created: string;
  store: string;
  platform: Platform;
  customer: string;
  products: string;
  items: string;
  value: string;
  checkout: 'Started' | 'Completed' | 'Not Started' | 'Failed';
  status: CartStatus;
  activity: string;
};
type EcommerceNavItem = {
  label: string;
};
type SimpleActionItem = {
  label: 'Reports' | 'Settings';
};
type SavedFilter = {
  label: string;
};
type StatCard = {
  label: string;
  value: string;
  hint: string;
  color: string;
  glow: string;
  icon: typeof ShoppingCart;
};
type PageNumber = {
  label: string;
};
type IssueRow = {
  id: string;
  issue: string;
  platform: Platform;
  time: string;
  severity: 'High' | 'Medium';
};
type HealthRow = {
  label: string;
  status: string;
  metric: string;
  healthy: boolean;
};
type SyncRow = {
  name: string;
  platform: Platform;
  status: string;
  time: string;
  syncing: boolean;
};
type PromptItem = {
  label: string;
};
const navPrimary = [{
  label: 'Dashboard',
  icon: LayoutDashboard
}, {
  label: 'AI Platform',
  icon: Sparkles
}, {
  label: 'CRM',
  icon: Users
}, {
  label: 'Marketing',
  icon: Tags
}, {
  label: 'Advertising',
  icon: Gauge
}];
const ecommerceNav = ['Overview', 'Stores', 'Products', 'Categories', 'Orders', 'Customers', 'Carts', 'Inventory', 'Reviews', 'Merchandising', 'Automation'];
const carts: Cart[] = [];
const attention: Array<Record<string, any>> = [];
const activity: Array<Record<string, any>> = [];
const ecommerceNavItems: EcommerceNavItem[] = ecommerceNav.map(label => ({
  label
}));
const secondaryNavItems: SimpleActionItem[] = [];
const dateOptions: SavedFilter[] = [];
const savedFilters: SavedFilter[] = [];
const tableHeads: SavedFilter[] = [];
const abandonedHeads: SavedFilter[] = [];
const checkoutHeads: SavedFilter[] = [];
const pageNumbers: PageNumber[] = [];
const statCards: StatCard[] = [];
const checkoutIssues: IssueRow[] = [];
const healthRows: HealthRow[] = [];
const aiPrompts: PromptItem[] = [];
const syncRows: SyncRow[] = [];
const platformStyles: Record<Platform, string> = {
  Shopify: 'text-[var(--foreground)] bg-[var(--card)] border-[var(--border)] shadow-[0_0_16px_rgba(0,0,0,.10)]',
  WooCommerce: 'text-[var(--foreground)] bg-[var(--card)] border-[var(--border)] shadow-[0_0_16px_rgba(0,0,0,.10)]',
  Webflow: 'text-[var(--foreground)] bg-[var(--card)] border-[var(--border)] shadow-[0_0_16px_rgba(0,0,0,.10)]'
};
const statusStyles: Record<CartStatus, string> = {
  Abandoned: 'text-[var(--chart-1)] bg-[var(--card)] border-[var(--chart-1)]',
  Converted: 'text-[var(--chart-4)] bg-[var(--card)] border-[var(--chart-4)]',
  Active: 'text-[var(--foreground)] bg-[var(--card)] border-[var(--border)]',
  Attention: 'text-[var(--foreground)] bg-[var(--card)] border-[var(--border)]'
};
const statusDotStyles: Record<CartStatus, string> = {
  Abandoned: 'bg-[var(--chart-1)] shadow-[0_0_12px_rgba(0,0,0,.85)]',
  Converted: 'bg-[var(--chart-4)] shadow-[0_0_12px_rgba(0,0,0,.85)]',
  Active: 'bg-[var(--primary)] shadow-[0_0_12px_rgba(0,0,0,.85)]',
  Attention: 'bg-[var(--primary)] shadow-[0_0_12px_rgba(0,0,0,.85)]'
};
const checkoutStyles: Record<Cart['checkout'], string> = {
  Started: 'text-[var(--chart-4)] bg-[var(--card)] border-[var(--border)]',
  Completed: 'text-[var(--chart-4)] bg-[var(--card)] border-[var(--chart-4)]',
  'Not Started': 'text-[var(--muted-foreground)] bg-[var(--card)] border-[var(--muted-foreground)]',
  Failed: 'text-[var(--chart-5)] bg-[var(--card)] border-[var(--chart-5)]'
};
const checkoutDotStyles: Record<Cart['checkout'], string> = {
  Started: 'bg-[var(--chart-4)] shadow-[0_0_12px_rgba(0,0,0,.85)]',
  Completed: 'bg-[var(--chart-4)] shadow-[0_0_12px_rgba(0,0,0,.85)]',
  'Not Started': 'bg-[var(--secondary)] shadow-[0_0_12px_rgba(0,0,0,.55)]',
  Failed: 'bg-[var(--destructive)] shadow-[0_0_12px_rgba(0,0,0,.85)]'
};
function PlatformChip({
  platform,
  store
}: {
  platform: Platform | 'All Stores';
  store?: string;
}) {
  const style = platform === 'All Stores' ? 'text-[var(--foreground)] bg-secondary border-border shadow-[0_0_14px_rgba(0,0,0,.08)]' : platformStyles[platform];
  return <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-bold ${style}`}><span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]" /><span>{store ?? platform}</span></span>;
}
function StatusPill({
  status
}: {
  status: CartStatus;
}) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusStyles[status]}`}><span className={`h-1.5 w-1.5 rounded-full ${statusDotStyles[status]}`} /><span>{status}</span></span>;
}
function CheckoutPill({
  status
}: {
  status: Cart['checkout'];
}) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${checkoutStyles[status]}`}><span className={`h-1.5 w-1.5 rounded-full ${checkoutDotStyles[status]}`} /><span>{status}</span></span>;
}
export function LuluCarts() {
  const { items, loading, error } = useLiveRecords('ecommerce_carts');
  const rows = items.map(record => ({
    id: record.id,
    customer: String(record.data?.customer || record.name),
    store: String(record.data?.store || 'Connected store'),
    platform: String(record.data?.platform || 'Connected platform'),
    value: record.valueAmount || '—',
    status: String(record.status || 'Active'),
    checkout: String(record.data?.checkout || 'Not Started'),
    activity: record.updatedAt,
  }));
  return <div className="min-h-screen bg-[var(--background)] text-[var(--primary-foreground)] antialiased lg:flex"><aside className="fixed inset-y-0 left-0 z-30 hidden w-[246px] flex-col bg-[var(--sidebar)] text-foreground lg:sticky lg:top-0 lg:flex"><div className="flex h-[74px] items-center gap-3 border-b border-border px-6"><div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--primary)] text-primary-foreground"><Sparkles size={17} /></div><span className="text-[18px] font-black tracking-[-.05em]">lulu<span className="font-medium text-foreground/55">.ai</span></span></div><LuluSectionNavigation activeId="serenely-sand-9226" /></aside><main className="min-w-0 flex-1"><header className="border-b border-border bg-card px-5 py-4 sm:px-8 lg:px-10"><div className="flex items-center gap-2 text-[12px] font-semibold text-muted-foreground"><span>Ecommerce</span><ChevronRight size={13} /><span className="text-foreground">Carts</span></div></header><div className="mx-auto max-w-[1440px] space-y-5 p-5 sm:p-8 lg:p-10"><div><h1 className="text-[32px] font-black tracking-[-.05em] text-foreground sm:text-[38px]">Carts</h1><p className="mt-1 max-w-2xl text-[13px] leading-6 text-muted-foreground">Live shopping cart and checkout activity from connected ecommerce stores.</p></div>{loading ? <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">Loading live cart records…</div> : error ? <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-destructive">{error}</div> : !rows.length ? <div className="flex min-h-[520px] items-center justify-center rounded-xl border border-dashed border-border bg-card p-10 text-center"><div><ShoppingCart className="mx-auto text-muted-foreground" size={34} /><h2 className="mt-4 text-xl font-semibold text-foreground">No cart data available yet</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Connect an ecommerce store to populate cart, abandonment and checkout activity. No example carts or values are displayed.</p></div></div> : <section className="overflow-x-auto rounded-xl border border-border bg-card"><table className="w-full min-w-[900px] text-left"><thead className="border-b border-border bg-secondary text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">Cart</th><th className="px-3 py-3">Customer</th><th className="px-3 py-3">Store</th><th className="px-3 py-3">Platform</th><th className="px-3 py-3">Value</th><th className="px-3 py-3">Checkout</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Updated</th></tr></thead><tbody className="divide-y divide-border">{rows.map(row => <tr key={row.id}><td className="px-4 py-3 text-xs font-semibold text-foreground">{row.id}</td><td className="px-3 py-3 text-xs text-muted-foreground">{row.customer}</td><td className="px-3 py-3 text-xs text-muted-foreground">{row.store}</td><td className="px-3 py-3 text-xs text-muted-foreground">{row.platform}</td><td className="px-3 py-3 text-xs text-foreground">{row.value}</td><td className="px-3 py-3 text-xs text-muted-foreground">{row.checkout}</td><td className="px-3 py-3 text-xs text-muted-foreground">{row.status}</td><td className="px-3 py-3 text-xs text-muted-foreground">{row.activity}</td></tr>)}</tbody></table></section>}</div></main></div>;
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
