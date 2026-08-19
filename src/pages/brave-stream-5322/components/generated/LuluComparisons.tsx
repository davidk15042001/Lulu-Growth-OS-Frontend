import { useState } from 'react';
import { Activity, AlertTriangle, ArrowDown, ArrowRight, ArrowUp, ArrowUpDown, BarChart2, Bell, Brain, Check, ChevronDown, ChevronRight, Clock3, Download, GitCompare, Globe2, LayoutDashboard, Menu, MoreHorizontal, Plus, RefreshCw, Search, Settings, Share2, Sparkles, Target, Users, X, Zap } from 'lucide-react';
type PageState = 'loaded' | 'loading' | 'empty' | 'error' | 'restricted' | 'insufficient';
const navGroups = [{
  title: 'Main',
  items: [['Dashboard', LayoutDashboard], ['Intelligence', Brain], ['Opportunities', Sparkles], ['Risks', AlertTriangle], ['Recommendations', Zap], ['Tasks', Check]] as const
}, {
  title: 'Platform',
  items: [['AI Assistant', Sparkles], ['AI Agents', Brain], ['Agent Marketplace', Globe2], ['AI Knowledge', BarChart2], ['AI Actions', Zap], ['AI Conversations', Activity], ['AI Activity', Activity]] as const
}, {
  title: 'Business',
  items: [['CRM', Users], ['Marketing', Target], ['Advertising', Target], ['Products', BarChart2], ['Finance', BarChart2]] as const
}];
const metrics: string[] = [];
const extraMetrics: string[] = [];
const scoreRows: string[][] = [];
const differences: (string | number)[][] = [];
const breakdownRows: any[][] = [];
const questions: string[] = [];
const detected: string[][] = [];
const saved: string[][] = [];
const opportunities: any[][] = [];
const risks: any[][] = [];
const recommendations: any[][] = [];
export const LuluComparisons = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageState, setPageState] = useState<PageState>('loaded');
  const [comparisonType, setComparisonType] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [selectedKpi, setSelectedKpi] = useState('');
  const [trend, setTrend] = useState('');
  const [breakdown, setBreakdown] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 700);
  };
  const stateMessage = pageState === 'loading' ? 'Loading comparison intelligence…' : pageState === 'empty' ? 'No comparisons yet' : pageState === 'error' ? 'Comparison data could not be loaded' : pageState === 'restricted' ? 'You do not have access to comparison intelligence' : 'Not enough data to generate a comparison';
  return <div className="min-h-screen bg-[var(--background)] text-foreground" style={{
    fontFamily: 'Poppins'
  }}>
    <aside className={`${sidebarOpen ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-20 w-[228px] flex-col border-r border-border/[.07] bg-[var(--sidebar)] p-4 lg:flex`}>
      <div className="mb-8 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] font-bold text-primary-foreground shadow-lg shadow-black/20">L</span><span className="text-lg font-semibold text-foreground">Lulu AI</span></div>
      <LuluSectionNavigation activeId="brave-stream-5322" />
      <div className="border-t border-border/[.07] pt-4"><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-xs font-semibold text-foreground">JD</div><div><p className="text-xs font-medium text-foreground">Workspace member</p><p className="text-[11px] text-muted-foreground">Executive account</p></div><Settings size={15} className="ml-auto text-muted-foreground" /></div><div className="mt-3 flex items-center gap-2 rounded-md border border-chart-4/20 bg-chart-4/5 px-2.5 py-2 text-[11px] text-chart-4"><span className="h-1.5 w-1.5 rounded-full bg-chart-4" /> AI Active <span className="ml-auto text-muted-foreground">Live</span></div></div>
    </aside>
    <main className="min-h-screen lg:ml-[228px]"><div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-7 sm:py-7">
      <header className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div><button className="mb-4 lg:hidden" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu /></button><p className="mb-2 text-xs text-muted-foreground">Intelligence <span className="mx-1 text-foreground">/</span> Analytics <span className="mx-1 text-foreground">/</span> Comparisons</p><h1 className="text-3xl font-bold tracking-[-.04em] text-foreground sm:text-4xl">Comparisons</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Compare business performance, identify meaningful differences and understand what is driving them.</p></div><div className="flex flex-wrap gap-2"><button className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-3.5 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-black/20 hover:bg-primary"><Sparkles size={15} /> Ask Lulu AI</button><button className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3.5 py-2.5 text-xs text-foreground hover:border-border/40"><Plus size={15} /> Create Comparison</button><button aria-label="Export" className="rounded-lg border border-border p-2.5 text-foreground hover:text-foreground"><Download size={15} /></button><button aria-label="Refresh" onClick={refresh} className="rounded-lg border border-border p-2.5 text-foreground hover:text-foreground"><RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /></button></div></header>
      <div className="mb-5 flex flex-wrap gap-1.5 rounded-md border border-border/[.06] bg-secondary p-1"><span className="px-2 py-1 text-[10px] text-muted-foreground">Workspace state</span>{(['loaded', 'loading', 'empty', 'error', 'restricted', 'insufficient'] as PageState[]).map(state => <button key={state} onClick={() => setPageState(state)} className={`rounded px-2 py-1 text-[10px] capitalize ${pageState === state ? 'bg-secondary/20 text-foreground' : 'text-foreground hover:text-foreground'}`}>{state}</button>)}</div>
      {pageState !== 'loaded' ? <section className="flex min-h-[520px] items-center justify-center rounded-xl border border-border/[.08] bg-secondary p-10 text-center"><div><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-foreground">{pageState === 'error' ? <AlertTriangle /> : pageState === 'restricted' ? <X /> : <BarChart2 />}</div><h2 className="text-xl font-semibold text-foreground">{stateMessage}</h2><p className="mt-2 max-w-sm text-sm text-muted-foreground">{pageState === 'empty' ? 'Create your first comparison to reveal meaningful business differences.' : 'Try again or choose another comparison configuration.'}</p><button onClick={() => setPageState('loaded')} className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">Return to comparison</button></div></section> : <div className="grid items-start gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-xl border border-border/[.08] bg-secondary p-5 xl:sticky xl:top-5"><div className="flex items-center gap-2"><GitCompare size={18} className="text-foreground" /><h2 className="font-semibold text-foreground">Create a Comparison</h2></div><label className="mt-5 block text-xs text-muted-foreground">Comparison Type<select value={comparisonType} onChange={e => setComparisonType(e.target.value)} className="mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring">{['Time Period', 'Business Area', 'Product', 'Customer Segment', 'Marketing Channel', 'Advertising Platform', 'Campaign', 'Country', 'Region', 'Sales Representative', 'Deal Stage', 'Traffic Source', 'Device', 'Custom Dimension'].map(value => <option key={value}>{value}</option>)}</select></label><div className="mt-5 border-l-2 border-border bg-secondary/[.05] p-3"><p className="text-[11px] uppercase tracking-wider text-foreground">Compare A</p><p className="mt-1 flex items-center gap-2 text-sm font-semibold text-foreground"><span className="h-2 w-2 rounded-full bg-primary text-primary-foreground" />Connected source A <ChevronDown size={14} className="ml-auto text-muted-foreground" /></p></div><div className="flex justify-center py-2"><span className="rounded-full border border-border bg-[var(--card)] px-2 py-1 text-[10px] font-semibold text-muted-foreground">vs</span></div><div className="border-l-2 border-border bg-secondary/[.05] p-3"><p className="text-[11px] uppercase tracking-wider text-foreground">Compare B</p><p className="mt-1 flex items-center gap-2 text-sm font-semibold text-foreground"><span className="h-2 w-2 rounded-full bg-primary text-primary-foreground" />Connected source B <ChevronDown size={14} className="ml-auto text-muted-foreground" /></p></div><button className="mt-3 text-xs text-foreground hover:text-foreground"><Plus size={13} className="mr-1 inline" />Add comparison</button><div className="mt-6 border-t border-border/[.07] pt-5"><p className="text-xs font-medium text-muted-foreground">Date Range</p><select value={dateRange} onChange={e => setDateRange(e.target.value)} className="mt-2 w-full rounded-lg border border-border bg-[var(--secondary)] px-3 py-2.5 text-sm text-foreground"><option>Last 30 Days</option><option>Last 7 Days</option><option>Last 90 Days</option><option>YTD</option><option>Custom</option></select><div className="mt-2 flex flex-wrap gap-1.5">{['Today', 'Last 7D', 'Last 30D', 'Last 90D', 'YTD', 'Custom'].map(chip => <button key={chip} onClick={() => setDateRange(chip)} className={`rounded-full px-2.5 py-1 text-[10px] ${dateRange === chip ? 'bg-chart-2/20 text-chart-2' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>{chip}</button>)}</div></div><fieldset className="mt-5"><legend className="text-xs font-medium text-muted-foreground">Compare Against</legend><div className="mt-2 space-y-2 text-xs text-muted-foreground"><label className="flex gap-2"><input type="radio" defaultChecked name="against" className="accent-chart-2" /> Previous Period</label><label className="flex gap-2"><input type="radio" name="against" className="accent-primary" /> Previous Year</label><label className="flex gap-2"><input type="radio" name="against" className="accent-primary" /> Custom Period</label></div></fieldset><div className="mt-5 border-t border-border/[.07] pt-5"><p className="text-xs font-medium text-muted-foreground">Metrics</p><div className="mt-2 flex flex-wrap gap-1.5">{[...metrics, ...extraMetrics].map(metric => <button key={metric} className={`rounded-full px-2.5 py-1.5 text-[10px] ${metrics.includes(metric) ? 'bg-secondary/20 text-foreground' : 'bg-secondary text-foreground'}`}>{metric}</button>)}</div><button className="mt-3 text-xs text-foreground"><Plus size={13} className="mr-1 inline" />Add Metric</button></div><button onClick={() => setFiltersOpen(!filtersOpen)} className="mt-5 flex w-full items-center gap-2 border-t border-border/[.07] pt-4 text-xs text-foreground"><ChevronRight size={14} className={filtersOpen ? 'rotate-90' : ''} /> Filters</button>{filtersOpen && <div className="mt-3 rounded-lg bg-secondary p-3 text-xs text-muted-foreground">Channel is Advertising Platform · Country is All markets</div>}<button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] py-3 text-sm font-semibold text-foreground shadow-lg shadow-black/15 hover:brightness-110"><BarChart2 size={16} /> Generate Comparison</button></section>
        <div className="min-w-0 space-y-5"><section className="flex min-h-[520px] items-center justify-center rounded-xl border border-dashed border-border bg-secondary p-10 text-center"><div><GitCompare className="mx-auto mb-4 text-muted-foreground" size={28} /><h2 className="text-xl font-semibold text-foreground">Live comparison results are not available yet</h2><p className="mt-2 max-w-md text-sm text-muted-foreground">Connect data sources and select records to generate a comparison. No example metrics or placeholder findings are shown.</p></div></section></div>
      </div>}
      </div></main>
  </div>;
};
const BookmarkIcon = () => <span className="text-foreground">★</span>;

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
