import { useState } from 'react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Bot, BrainCircuit, ChevronDown, ChevronRight, CircleHelp, Clock3, Download, FileText, Filter, LayoutDashboard, Menu, MoreHorizontal, PanelRightClose, Plus, RefreshCw, Search, Settings, ShieldAlert, Sparkles, Target, TrendingUp, Users, X, Zap } from 'lucide-react';
type Risk = {
  title: string;
  type: string;
  area: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  probability: string;
  exposure: string;
  trend: string;
  status: string;
  owner: string;
  initials: string;
  color: string;
  detected: string;
};
const risks: Risk[] = [];
const nav = [{
  label: 'Overview',
  icon: LayoutDashboard
}, {
  label: 'AI Intelligence',
  icon: BrainCircuit
}, {
  label: 'Risk Center',
  icon: ShieldAlert
}, {
  label: 'Decisions',
  icon: Target
}, {
  label: 'Tasks',
  icon: Activity
}, {
  label: 'Reports',
  icon: FileText
}];
const evidence: Array<Record<string, any>> = [];
const sources: Array<Record<string, any>> = [];
const priority: string[] = [];
function Sidebar() {
  return <aside className="sidebar"><div className="brand"><span className="brand-mark"><Sparkles size={17} /></span><strong>Lulu AI</strong><span className="brand-tag">CORE</span></div><div className="workspace"><span className="workspace-dot" /> Connected workspace <ChevronDown size={14} /></div><p className="nav-label">WORKSPACE</p><LuluSectionNavigation activeId="boldly-time-5189" /><p className="nav-label intelligence">INTELLIGENCE</p><button className="nav-item"><BarChart3 size={17} /><span>Performance</span></button><button className="nav-item"><Users size={17} /><span>Customers</span></button><div className="sidebar-bottom"><button className="nav-item"><Settings size={17} /><span>Settings</span></button><div className="profile"><span className="avatar">AC</span><span><strong>Workspace administrator</strong><small>Administrator</small></span><MoreHorizontal size={17} /></div></div></aside>;
}
function RiskCard({
  risk,
  onOpen
}: {
  risk: Risk;
  onOpen: () => void;
}) {
  const sev = risk.severity === 'High' ? 'high' : risk.severity.toLowerCase();
  return <article className={`risk-card ${risk.severity === 'High' ? 'critical-pulse' : ''}`}><div className="risk-top"><span className="type-badge">{risk.type}</span><button aria-label={`More actions for ${risk.title}`}><MoreHorizontal size={17} /></button></div><h3>{risk.title}</h3><span className="area">{risk.area}</span><div className="risk-facts"><span><i className={`severity-dot ${sev}`} /><strong>Severity</strong> {risk.severity}</span><span><strong>Probability</strong> {risk.probability}</span></div><div className="exposure"><small>Estimated {risk.title.includes('Margin') ? 'Profit' : 'Revenue'} Exposure</small><strong>{risk.exposure}</strong></div><div className="trend-row"><span className={risk.trend.includes('Increasing') ? 'trend-up' : risk.trend.includes('New') ? 'trend-new' : 'trend-stable'}>{risk.trend.includes('Increasing') ? <ArrowUpRight size={15} /> : risk.trend.includes('Stable') ? <ArrowRightIcon /> : <Zap size={15} />} {risk.trend}</span><span className="status-chip">{risk.status}</span></div><div className="risk-footer"><span className="owner"><span className="mini-avatar" style={{
          background: risk.color
        }}>{risk.initials}</span>{risk.owner}</span><small>Detected {risk.detected}</small></div><div className="card-actions"><button onClick={onOpen}>Open</button><button>Review</button><button className="mitigate">Mitigate</button></div></article>;
}
function ArrowRightIcon() {
  return <span aria-hidden="true">→</span>;
}
function DetailPanel({ onClose }: { onClose: () => void }) {
  return <section className="detail-panel"><div className="detail-head"><div><span className="eyebrow">RISK DETAIL</span><h2>Live risk details</h2></div><button className="close-detail" onClick={onClose} aria-label="Close risk detail"><PanelRightClose size={18} /></button></div><p className="text-sm text-muted-foreground">Select a live risk item to view its evidence, dependencies and mitigation details.</p></section>;
}
function DetailSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return <section className="detail-section"><h3>{title}</h3>{children}</section>;
}
export function RiskCenter() {
  const { items, loading, error, refresh } = useLiveRecords('risk_items');
  return <main className="app-shell"><Sidebar /><div className="content">{loading ? <div className="border-b border-border bg-secondary/30 px-4 py-3 text-xs text-muted-foreground">Loading live risk items…</div> : error ? <div className="border-b border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">{error}</div> : null}<header className="topbar"><div className="breadcrumbs">Intelligence <ChevronRight size={13} /> AI Intelligence <ChevronRight size={13} /> <strong>Risk Center</strong></div><div className="header-tools"><button className="icon-btn"><Bell size={17} /></button><span className="top-avatar">WS</span></div></header><div className="page-header"><div><p className="eyebrow">AI INTELLIGENCE / RISK CENTER</p><h1>Risk Center</h1><p className="subtitle">Live risks and operational signals from connected workspace data.</p></div><div className="page-actions"><button className="purple"><Sparkles size={16} /> Ask Lulu AI</button><button type="button" onClick={() => void refresh()}><RefreshCw size={15} /> Refresh Risk Analysis</button><button><Download size={15} /> Export <ChevronDown size={14} /></button></div></div>{!loading && !error && !items.length ? <section className="bottom-card"><div className="section-title"><ShieldAlert size={18} /> No live risks available</div><p className="text-sm text-muted-foreground">Connect data sources and complete an analysis to populate risk items. No example counts, exposure estimates or risk narratives are displayed.</p></section> : <section className="risk-workspace"><div className="workspace-heading"><div><p className="eyebrow">MONITORING OVERVIEW</p><h2>Live Risks <span>{items.length} records</span></h2></div></div><div className="risk-grid">{items.map(record => <article className="risk-card" key={record.id}><div className="risk-top"><span className="type-badge">{String(record.data?.type || 'Risk')}</span></div><h3>{record.name}</h3><span className="area">{String(record.data?.area || 'Connected workspace')}</span><div className="risk-facts"><span><strong>Status</strong> {record.status || 'Recorded'}</span><span><strong>Updated</strong> {record.updatedAt}</span></div><div className="exposure"><small>Recorded value</small><strong>{record.valueAmount || '—'}</strong></div><div className="risk-footer"><span className="owner"><span className="mini-avatar">WS</span>Workspace member</span><small>Live record</small></div></article>)}</div></section>}</div></main>;
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
