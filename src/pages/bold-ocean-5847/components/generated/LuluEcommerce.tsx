import * as React from 'react';
import { ArrowDown, ArrowUp, ArrowRight, BarChart3, Bell, Bot, ChevronDown, Download, Filter, Globe2, LayoutDashboard, LineChart, Package, RefreshCw, Search, Settings, ShoppingBag, Sparkles, Store, Users, Zap } from 'lucide-react';
type Tone = 'good' | 'bad' | 'neutral' | 'warn';
type KPI = {
  label: string;
  value: string;
  previous: string;
  delta: string;
  tone: Tone;
  points: string;
};
const kpis: KPI[] = [];
const products: any[][] = [];
const channels: any[][] = [];
const categories = [['Audio & Headphones', '$886,600', '12,480', '10,920', '81.20', '8.6%', '54.2%'], ['Home Office', '$709,400', '7,840', '6,920', '102.50', '6.9%', '48.6%'], ['Smart Home', '$441,000', '2,940', '2,940', '150.00', '10.4%', '51.1%'], ['Accessories & Hubs', '$147,700', '6,420', '5,580', '26.47', '12.1%', '43.8%']];
const sectionStyle = 'border-t border-[var(--border)] pt-9 mt-10';
const toneClass = (tone: Tone) => tone === 'good' ? 'bg-[var(--secondary)] text-[var(--chart-4)]' : tone === 'bad' ? 'bg-[var(--secondary)] text-[var(--chart-5)]' : tone === 'warn' ? 'bg-[var(--secondary)] text-[var(--chart-1)]' : 'bg-[var(--secondary)] text-[var(--muted-foreground)]';
function Spark({
  points,
  bad = false
}: {
  points: string;
  bad?: boolean;
}) {
  return <svg aria-label="trend sparkline" width="42" height="24" viewBox="0 0 42 24" fill="none"><polyline points={points} stroke={bad ? 'var(--chart-5)' : 'var(--chart-4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function TrendChart({
  small = false
}: {
  small?: boolean;
}) {
  return <svg className={small ? 'h-20 w-full' : 'h-64 w-full'} viewBox="0 0 640 220" preserveAspectRatio="none" role="img" aria-label="Ecommerce performance trend"><path d="M0 180 C70 160 90 168 140 140 S220 155 260 112 S340 126 390 84 S470 105 520 58 S590 74 640 24 V220 H0Z" fill="var(--border)" /><path d="M0 180 C70 160 90 168 140 140 S220 155 260 112 S340 126 390 84 S470 105 520 58 S590 74 640 24" fill="none" stroke="var(--chart-4)" strokeWidth="3" /><path d="M0 200 C70 190 100 184 150 178 S235 190 280 160 S360 171 410 135 S500 145 540 105 S600 120 640 91" fill="none" stroke="var(--chart-1)" strokeWidth="2" strokeDasharray="7 6" /><g stroke="var(--border)" strokeWidth="1"><path d="M0 50H640M0 105H640M0 160H640" /></g></svg>;
}
function Section({
  title,
  children,
  action
}: {
  title: string;
  children: React.ReactNode;
  action?: string;
}) {
  return <section className={sectionStyle}><div className="mb-4 flex items-center justify-between"><h2 className="text-[18px] font-semibold tracking-tight">{title}</h2>{action && <button className="text-sm font-semibold text-[var(--foreground)]">{action}</button>}</div>{children}</section>;
}
function DataTable({
  headers,
  rows
}: {
  headers: string[];
  rows: string[][];
}) {
  return <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-card"><table className="w-full min-w-[780px] border-collapse text-left"><thead className="bg-[var(--secondary)]"><tr>{headers.map(h => <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[.05em] text-[var(--muted-foreground)]">{h}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row[0]} className="border-t border-[var(--border)] text-[14px]"><td className="px-4 py-3 font-medium">{row[0]}</td>{row.slice(1).map((cell, i) => <td key={`${row[0]}-${i}`} className={`px-4 py-3 ${cell.startsWith('-') ? 'text-[var(--chart-5)]' : cell.startsWith('+') ? 'text-[var(--foreground)]' : ''}`}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
export function LuluEcommerce() {
  const [range, setRange] = React.useState('');
  const [ask, setAsk] = React.useState('');
  return <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-[var(--sidebar)] p-4 lg:flex"><div className="mb-5 flex items-center gap-3 px-2 py-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">L</div><span className="font-semibold text-foreground">Lulu AI</span></div><LuluSectionNavigation activeId="bold-ocean-5847" /></aside>
    <main className="px-5 py-7 sm:px-8 lg:ml-60 lg:px-12"><header><nav className="text-xs text-[var(--muted-foreground)]">Intelligence <span className="mx-2">/</span> Business Intelligence <span className="mx-2">/</span> Ecommerce</nav><div className="mt-4 flex flex-wrap items-start justify-between gap-6"><div><h1 className="text-[28px] font-bold tracking-[-.03em]">Ecommerce</h1><p className="mt-1 max-w-2xl text-[15px] text-[var(--muted-foreground)]">Live ecommerce intelligence from connected workspace sources.</p></div><div className="flex flex-wrap gap-2"><button className="flex h-8 items-center gap-1.5 rounded-md bg-[var(--primary)] px-3 text-xs font-semibold text-primary-foreground"><Sparkles size={13} /> Ask Lulu AI</button><button className="flex h-8 items-center gap-1.5 rounded-md border border-[var(--muted-foreground)] bg-card px-3 text-xs">Connect data</button></div></div></header>
      <div className="mt-7 flex flex-wrap items-center gap-3 border-y border-[var(--border)] bg-card px-3 py-3 text-xs"><button className="rounded-md border border-[var(--border)] px-3 py-1.5 font-semibold">Date Range{range ? `: ${range}` : ''}</button><span className="text-[var(--muted-foreground)]">Live workspace data only</span></div>
      <section className="mt-10 flex min-h-[520px] items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-card p-10 text-center"><div><ShoppingBag className="mx-auto text-[var(--muted-foreground)]" size={32} /><h2 className="mt-4 text-xl font-semibold">No ecommerce data available yet</h2><p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted-foreground)]">Connect an ecommerce platform to populate products, orders, customers and revenue. No example metrics are displayed.</p></div></section>
    </main>
  </div>;
}
export default LuluEcommerce;

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
