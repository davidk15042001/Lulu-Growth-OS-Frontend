import { useState } from 'react';
import { AlertTriangle, Bell, CalendarDays, ChevronDown, ChevronRight, FileText, LayoutGrid, List, Menu, Plus, Search, Sparkles, X } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type Item = {
  title: string;
  type: string;
  status: string;
  campaign: string;
  audience: string;
  score: string;
  updated: string;
};
const items: Item[] = [{
  title: 'Ultimate Guide to E-Commerce Growth',
  type: 'Blog Article',
  status: 'Published',
  campaign: 'Summer Growth Campaign',
  audience: 'High-Value Customers',
  score: '92',
  updated: 'Today'
}, {
  title: 'Q4 Product Launch Landing Page',
  type: 'Landing Page',
  status: 'Scheduled',
  campaign: 'Product Launch Q4',
  audience: 'All Users',
  score: '85',
  updated: 'Yesterday'
}, {
  title: 'Customer Success Story — Connected customer',
  type: 'Case Study',
  status: 'Review',
  campaign: 'Brand Awareness',
  audience: 'Enterprise',
  score: '—',
  updated: '2 days ago'
}, {
  title: '10 Ways AI Transforms Operations',
  type: 'Blog Article',
  status: 'Draft',
  campaign: '—',
  audience: 'SMB Leaders',
  score: '—',
  updated: '3 days ago'
}, {
  title: 'Holiday Campaign Email Series',
  type: 'Email',
  status: 'Approved',
  campaign: 'Holiday Campaign',
  audience: 'Loyal Customers',
  score: '71',
  updated: '1 week ago'
}, {
  title: 'LinkedIn Thought Leadership Post',
  type: 'Social Post',
  status: 'Published',
  campaign: 'Brand Q4',
  audience: 'Executives',
  score: '88',
  updated: '5 days ago'
}];
const nav = ['Campaigns', 'Content', 'SEO', 'GEO', 'AEO', 'Audiences', 'Analytics', 'Automations'];
const filterItems = ['Status', 'Content Type', 'Channel', 'Campaign', 'Audience', 'Content Score', 'SEO Status', 'GEO Status', 'AEO Status', 'Date'];
const insights = ['This article generates 3.2× more qualified traffic than similar content', 'Landing page has strong traffic but 23% below-average conversion rate', "Content around 'AI automation' is gaining significant search visibility"];
const tabs = [{
  name: 'List'
}, {
  name: 'Grid'
}, {
  name: 'Calendar'
}];
function Pill({
  value
}: {
  value: string;
}) {
  return <span className="rounded-full border border-chart-4/20 bg-chart-4/10 px-2 py-1 text-[10px] text-foreground">● {value}</span>;
}
function Side({
  open,
  close
}: {
  open: boolean;
  close: () => void;
}) {
  return <aside className={`${open ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-20 w-64 flex-col border-r border-border/[.08] bg-[var(--sidebar)] lg:static lg:flex`}><div className="flex h-[68px] items-center gap-3 border-b border-border/[.08] px-5"><div className="rounded-lg bg-gradient-to-br from-primary to-primary p-2 text-primary-foreground"><Sparkles size={16} /></div><strong className="text-lg text-foreground">lulu<span className="text-foreground">.ai</span></strong><button className="ml-auto lg:hidden" onClick={close}><X size={18} /></button></div><LuluSectionNavigation activeId="wondrous-cloud-1355" /><div className="mt-auto m-3 rounded-xl border border-border/15 bg-secondary/[.08] p-4"><p className="text-xs font-semibold text-foreground"><Sparkles size={14} className="mr-2 inline" />Lulu Intelligence</p><p className="mt-2 text-[11px] leading-5 text-muted-foreground">Your content ecosystem is 86% healthy this week.</p></div></aside>;
}
export function LuluContent() {
  const [view, setView] = useState('List');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const { items: contentRecords, loading: contentLoading, error: contentError } = useLiveRecords('marketing_content');
  const getContentField = (record: typeof contentRecords[number], key: string) => String((record as unknown as Record<string, unknown>)[key] ?? '');
  const liveItems: Item[] = contentRecords.map(record => ({ title: getContentField(record, 'title') || getContentField(record, 'name') || 'Content item', type: getContentField(record, 'type') || 'Content', status: getContentField(record, 'status') || 'Draft', campaign: getContentField(record, 'campaign') || '—', audience: getContentField(record, 'audience') || '—', score: getContentField(record, 'score') || '—', updated: getContentField(record, 'updated') || record.updatedAt || '—' }));
  const displayItems = contentLoading ? [] : liveItems;
  const filtered = displayItems.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
  return <div className="min-h-screen bg-[var(--background)] text-foreground"><div className="flex min-h-screen"><Side open={open} close={() => setOpen(false)} /><main className="min-w-0 flex-1"><header className="flex h-[68px] items-center justify-between border-b border-border/[.08] px-5"><button className="lg:hidden" onClick={() => setOpen(true)}><Menu size={20} /></button><span className="hidden text-sm text-muted-foreground sm:block">Marketing <ChevronRight size={14} className="inline" /> <b className="text-foreground">Content</b></span><div className="flex items-center gap-4"><Bell size={18} className="text-muted-foreground" /><span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">SC</span></div></header><div className="p-5 sm:p-7">{contentError && <div role="alert" className="mb-5 rounded-lg border border-chart-5/30 bg-chart-5/10 px-4 py-3 text-sm text-chart-5">Content data could not be loaded. Check marketing content records and try again.</div>}{!contentLoading && !contentError && liveItems.length === 0 && <div className="mb-5 rounded-lg border border-dashed border-border bg-secondary p-4 text-sm text-muted-foreground">No marketing content records are available yet.</div>}<div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs text-foreground">Marketing / Content</p><h1 className="text-4xl font-bold tracking-tight text-foreground">Content</h1><p className="mt-2 text-sm text-muted-foreground">Create, manage and optimize content across your marketing ecosystem with AI.</p></div><button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground"><Plus size={15} />Create Content</button></div><div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{[['Total Content', String(contentLoading ? '—' : liveItems.length)], ['Published', String(contentLoading ? '—' : liveItems.filter(item => item.status === 'Published').length)], ['Drafts', String(contentLoading ? '—' : liveItems.filter(item => item.status === 'Draft').length)], ['Scheduled', String(contentLoading ? '—' : liveItems.filter(item => item.status === 'Scheduled').length)], ['Content Score', liveItems.length ? `${Math.round(liveItems.reduce((sum, item) => sum + (Number(item.score) || 0), 0) / liveItems.length)}/100` : '—'], ['Needs Attention', String(contentLoading ? '—' : liveItems.filter(item => ['Review', 'Rejected'].includes(item.status)).length)]].map(metric => <article key={metric[0]} className="rounded-xl border border-border/[.08] bg-secondary p-4"><Sparkles size={15} className="mb-3 text-foreground" /><p className="text-2xl font-semibold text-foreground">{metric[1]}</p><p className="mt-1 text-[11px] text-muted-foreground">{metric[0]}</p></article>)}</div><div className="mb-4 rounded-xl border border-border/[.08] bg-[var(--secondary)] p-3"><div className="flex gap-3"><div className="relative flex-1"><Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search content..." className="w-full rounded-lg border border-border bg-primary/10 py-2 pl-9 text-xs text-foreground outline-none" /></div><button className="rounded-lg border border-border px-3 text-xs text-foreground">Saved Filters <ChevronDown size={13} className="inline" /></button></div><div className="mt-3 flex gap-2 overflow-x-auto">{filterItems.map(filter => <button key={filter} className="shrink-0 rounded-full border border-border px-3 py-1.5 text-[11px] text-foreground">{filter}</button>)}</div></div><div className="mb-4 flex gap-1 border-b border-border">{tabs.map(tab => <button key={tab.name} onClick={() => setView(tab.name)} className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs ${view === tab.name ? 'border-border text-foreground' : 'border-transparent text-foreground'}`}>{tab.name}</button>)}]</div><div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]"><section className="overflow-x-auto rounded-xl border border-border/[.08] bg-secondary">{view === 'List' ? <table className="w-full min-w-[850px] text-left"><thead className="border-b border-border text-[10px] uppercase text-muted-foreground"><tr><th className="p-4">Content</th><th>Status</th><th>Campaign</th><th>Audience</th><th>Performance</th><th>Updated</th></tr></thead><tbody className="divide-y divide-white/[.06]">{filtered.map(item => <tr key={item.title} className="hover:bg-secondary/[.05]"><td className="p-4"><div className="flex items-center gap-3"><FileText size={17} className="text-foreground" /><div><p className="text-xs font-medium text-foreground">{item.title}</p><p className="mt-1 text-[10px] text-muted-foreground">{item.type}</p></div></div></td><td><Pill value={item.status} /></td><td className="text-[11px] text-muted-foreground">{item.campaign}</td><td className="text-[11px] text-muted-foreground">{item.audience}</td><td className="text-sm font-semibold text-foreground">{item.score}</td><td className="text-[11px] text-muted-foreground">{item.updated}</td></tr>)}</tbody></table> : <div className="flex min-h-[450px] flex-col items-center justify-center text-center"><LayoutGrid size={32} className="mb-3 text-foreground" /><h2 className="text-sm font-semibold text-foreground">{view} workspace</h2><p className="mt-2 text-xs text-muted-foreground">Your content planning workspace is ready.</p></div>}</section><aside className="space-y-4"><section className="rounded-xl border border-border/15 bg-secondary/[.08] p-4"><h2 className="text-sm font-semibold text-foreground"><Sparkles size={15} className="mr-2 inline text-foreground" />AI Content Insights</h2><p className="mt-2 text-[10px] text-muted-foreground">AI-generated · Updated 2 min ago</p>{insights.map(insight => <div key={insight} className="border-t border-border/[.07] py-4 text-xs leading-5 text-foreground">{insight}<button className="mt-2 block text-[10px] text-foreground">View <ChevronRight size={11} className="inline" /></button></div>)}</section><section className="rounded-xl border border-border bg-secondary p-4"><h2 className="mb-3 text-sm font-semibold text-foreground">Content Opportunities</h2>{['Create content around enterprise AI', 'Repurpose top case study', 'Expand FAQ coverage'].map(item => <div key={item} className="border-t border-border/[.07] py-3 text-[11px] text-foreground">{item}<button className="mt-2 block text-foreground">Create Content</button></div>)}</section><section className="rounded-xl border border-border/15 bg-chart-1/[.04] p-4"><h2 className="text-sm font-semibold text-foreground"><AlertTriangle size={15} className="mr-2 inline text-chart-1" />Content Risks</h2><p className="mt-3 text-[11px] leading-5 text-chart-1/75">Traffic to “Q3 Product Guide” declined 41% in 30 days</p><p className="mt-3 border-t border-chart-1/10 pt-3 text-[11px] text-chart-1/75">7 high-value pages contain outdated product information</p></section></aside></div></div></main></div></div>;
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
  }, {
    "id": "nicely-land-1864",
    "label": "Settings"
  }]
}, {
  "label": "Website",
  "pages": [{
    "id": "lulu-website-portal-9012",
    "label": "Website"
  }]
}, {
  "label": "Integrations",
  "pages": [{
    "id": "glad-coast-1428",
    "label": "Integrations"
  }]
}, {
  "label": "Billing",
  "pages": [{
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
          <span data-lulu-section-soon={section.label !== "Website" ? "true" : undefined}>{section.label}</span>
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
