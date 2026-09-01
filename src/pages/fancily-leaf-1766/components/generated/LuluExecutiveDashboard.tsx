import { ArrowRight, Sparkles } from 'lucide-react';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { WorkspaceIntelligencePanel } from '../../../../components/WorkspaceIntelligencePanel';
import { useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';
import { pageLinkProps } from '../../../../routing';

const executiveQuickAccess = [
  { id: 'fresh-moon-5374', title: 'Assistant', detail: 'Ask Lulu AI directly.' },
  { id: 'bright-meadow-7537', title: 'CRM', detail: 'Open contacts, leads, deals and tasks.' },
  { id: 'quietly-stone-4158', title: 'Finance', detail: 'Review live financial records and balances.' },
  { id: 'finely-garden-9221', title: 'Advertising', detail: 'Check campaign performance and priorities.' },
  { id: 'lulu-website-portal-9012', title: 'Website', detail: 'Manage website delivery and connected providers.' },
  { id: 'daring-brook-9034', title: 'Google Reviews', detail: 'Review new feedback and draft replies.' },
];

export const LuluExecutiveDashboard = () => {
  const { currentUser, selectedWorkspace } = useLuluApp();
  const t = useTranslation();
  const workspaceName = selectedWorkspace?.companyName ?? t('Workspace');

  return (
    <main className="min-h-screen bg-[var(--background)] text-foreground">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Statistiken</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">Executive Dashboard</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              {workspaceName} is operated through specialized agent workspaces. Start with the workspace that needs attention right now.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
            Use Update in the navigation bar
          </span>
        </header>

        <WorkspaceIntelligencePanel workspaceId={selectedWorkspace?.id ?? null} />

        <section className="mb-6 grid gap-3 md:grid-cols-3">
          <article className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Workspace</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{workspaceName}</p>
            <p className="mt-1 text-sm text-muted-foreground">Current operator: {currentUser?.firstName || currentUser?.email || "Workspace member"}</p>
          </article>
          <article className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Model</p>
            <p className="mt-2 text-lg font-semibold text-foreground">One page, one agent</p>
            <p className="mt-1 text-sm text-muted-foreground">Each workspace focuses on one domain and keeps critical actions behind approval gates.</p>
          </article>
          <article className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Next step</p>
            <p className="mt-2 text-lg font-semibold text-foreground">Connect systems and review signals</p>
            <p className="mt-1 text-sm text-muted-foreground">The more sources are connected, the more each agent can do automatically.</p>
          </article>
        </section>

        <section className="mb-6 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">What users need most here</h2>
          </div>
          <ul className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
            <li className="rounded-lg border border-border bg-background/50 px-4 py-3">Open the right agent workspace for the current business area.</li>
            <li className="rounded-lg border border-border bg-background/50 px-4 py-3">Check whether live signals and knowledge are up to date.</li>
            <li className="rounded-lg border border-border bg-background/50 px-4 py-3">Approve only the actions that should actually happen in the business.</li>
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Quick access</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Open a workspace</h2>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {executiveQuickAccess.map((item) => (
              <a
                key={item.id}
                {...pageLinkProps(item.id)}
                className="rounded-xl border border-border bg-background/50 p-4 text-left transition hover:border-border hover:bg-background"
              >
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-sm text-foreground">{item.title}</strong>
                  <ArrowRight size={15} className="text-muted-foreground" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

/* Lulu dropdown navigation — intentionally isolated from page content. */
export const luluDropdownNavigation = [{
  "label": "Statistiken",
  "pages": [{
    "id": "fancily-leaf-1766",
    "label": "Executive Dashboard"
  }, {
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
    "id": "gracefully-storm-2649",
    "label": "Customer Intelligence"
  }, {
    "id": "nicely-hour-4035",
    "label": "Sales"
  }, {
    "id": "eagerly-winter-3152",
    "label": "Marketing"
  }, {
    "id": "gently-shade-2476",
    "label": "Campaign Tracker"
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
  }, {
    "id": "sparklingly-home-7386",
    "label": "Strategy"
  }, {
    "id": "friendly-path-8200",
    "label": "Advertising Analytics"
  }, {
    "id": "zesty-grass-9196",
    "label": "AI Optimization"
  }, {
    "id": "solid-sand-5563",
    "label": "AI Experiments & A/B Testing"
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
    "id": "sharply-wood-4560",
    "label": "Advertising Intelligence"
  }, {
    "id": "bold-ocean-5847",
    "label": "Ecommerce Intelligence"
  }, {
    "id": "merry-land-6169",
    "label": "Store Performance"
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
  }, {
    "id": "quietly-stone-4158",
    "label": "Finance Overview"
  }, {
    "id": "cool-rain-6499",
    "label": "Finance Income"
  }, {
    "id": "richly-land-8084",
    "label": "Finance Transactions"
  }, {
    "id": "calm-tide-3752",
    "label": "Finance Payments"
  }, {
    "id": "zesty-earth-3938",
    "label": "Finance Expenses"
  }, {
    "id": "bravely-bay-4544",
    "label": "Finance Customers"
  }, {
    "id": "eager-minute-1586",
    "label": "Finance Vendors"
  }, {
    "id": "fair-bridge-8618",
    "label": "Finance Accounts"
  }, {
    "id": "soft-town-3284",
    "label": "Finance Cash Flow"
  }, {
    "id": "wisely-gate-3183",
    "label": "Finance Budgets"
  }, {
    "id": "sharp-morning-7310",
    "label": "Finance Financial Planning"
  }, {
    "id": "sparklingly-city-3338",
    "label": "Finance Reconciliation"
  }, {
    "id": "radiant-hour-5376",
    "label": "Finance Recurring Revenue"
  }, {
    "id": "lucky-park-8649",
    "label": "Finance Payouts"
  }, {
    "id": "vibrantly-second-9428",
    "label": "Finance Financial Automation"
  }, {
    "id": "sturdy-week-3372",
    "label": "Finance Taxes"
  }, {
    "id": "fine-park-8079",
    "label": "Sales Overview"
  }, {
    "id": "softly-autumn-9038",
    "label": "Sales Leads"
  }, {
    "id": "wildly-sun-6424",
    "label": "Sales Opportunities"
  }, {
    "id": "deeply-month-1392",
    "label": "Sales Deals"
  }, {
    "id": "sweet-evening-7753",
    "label": "Sales Pipeline"
  }, {
    "id": "warmly-road-3804",
    "label": "Sales Activities"
  }, {
    "id": "wondrously-gate-2200",
    "label": "Sales Tasks"
  }, {
    "id": "sharp-cliff-6925",
    "label": "Sales Customer Segments"
  }, {
    "id": "lovingly-shore-4782",
    "label": "Sales Forecast"
  }, {
    "id": "rich-moon-9195",
    "label": "Sales Reports"
  }, {
    "id": "lively-house-6788",
    "label": "Sales Commissions"
  }, {
    "id": "gentle-cliff-7133",
    "label": "Sales Goals"
  }, {
    "id": "kindly-morning-7115",
    "label": "Sales Territories"
  }, {
    "id": "friendly-tower-1528",
    "label": "Sales Lead Assignment"
  }, {
    "id": "sunny-moon-6307",
    "label": "Conversations"
  }, {
    "id": "sparkling-cave-8456",
    "label": "Activity"
  }, {
    "id": "radiant-dusk-9079",
    "label": "Agents"
  }, {
    "id": "wondrously-second-5656",
    "label": "Actions"
  }, {
    "id": "glad-coast-1428",
    "label": "Integrations"
  }]
}, {
  "label": "Finance",
  "pages": [{
    "id": "breezy-soil-2475",
    "label": "Finance Invoices"
  }, {
    "id": "tender-creek-3139",
    "label": "Finance Offers & Quotes"
  }]
}, {
  "label": "AI",
  "pages": [{
    "id": "fresh-moon-5374",
    "label": "Assistant"
  }, {
    "id": "rich-field-1880",
    "label": "Knowledge"
  }]
}, {
  "label": "CRM",
  "pages": [{
    "id": "bright-meadow-7537",
    "label": "Overview"
  }, {
    "id": "sturdy-month-1562",
    "label": "Contacts & Companies"
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
  }]
}, {
  "label": "Email",
  "pages": [{
    "id": "email-inbox",
    "label": "Inbox"
  }, {
    "id": "email-starred",
    "label": "Starred"
  }, {
    "id": "email-sent",
    "label": "Sent"
  }, {
    "id": "email-drafts",
    "label": "Drafts"
  }, {
    "id": "email-automations",
    "label": "Automations"
  }, {
    "id": "email-settings",
    "label": "Email Settings"
  }]
}, {
  "label": "Calendar",
  "pages": [{
    "id": "calendar-overview",
    "label": "Overview"
  }, {
    "id": "calendar-settings",
    "label": "Calendar Settings"
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
    "id": "finely-garden-9221",
    "label": "Overview"
  }, {
    "id": "wise-brook-1762",
    "label": "Advertising Campaigns"
  }, {
    "id": "softly-second-7684",
    "label": "Advertising Audiences"
  }, {
    "id": "happily-storm-2690",
    "label": "Creatives"
  }, {
    "id": "sunny-minute-1092",
    "label": "Budgets"
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
    "id": "sunny-summer-2293",
    "label": "Ad Accounts & Platform Management"
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
  }]
}, {
  "label": "Settings",
  "pages": [{
    "id": "fresh-tide-9404",
    "label": "Integration"
  }, {
    "id": "pure-minute-5446",
    "label": "Billing"
  }]
}] as const;
export function LuluSectionNavigation({
  activeId
}: {
  activeId: string;
}) {
  const t = useTranslation();
  return <nav className="min-h-0 min-w-0 flex-1 space-y-1 overflow-x-hidden overflow-y-auto pr-1" aria-label={t("Lulu AI sections")}>
    {luluDropdownNavigation.map(section => {
      const isActiveSection = section.pages.some(page => page.id === activeId);
      return <details key={section.label} open={isActiveSection} className="group rounded-lg">
        <summary className={`flex min-w-0 cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2.5 text-sm leading-5 transition [&::-webkit-details-marker]:hidden ${isActiveSection ? 'bg-secondary/15 font-medium text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
          <span data-lulu-section-soon={section.label !== "Website & Commerce" && section.label !== "Settings" ? "true" : undefined}>{t(section.label)}</span>
          <span aria-hidden="true" className="text-xs transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <div className="ml-3 mt-1 space-y-0.5 border-l border-border pl-2 pb-1">
          {section.pages.map(page => {
            const isActivePage = page.id === activeId;
            const linkProps = pageLinkProps(page.id);
            return <a key={page.id} {...linkProps} aria-current={isActivePage ? 'page' : undefined} onClick={(event) => {
              if (!linkProps.href) return;
              event.preventDefault();
              if (activeId === 'lulu-website-portal-9012' && linkProps.href.startsWith('/app/website?section=')) {
                window.history.pushState({}, '', linkProps.href);
                window.dispatchEvent(new Event('lulu:navigate'));
              } else {
                window.location.assign(linkProps.href);
              }
            }} className={`block min-w-0 break-words rounded-md px-3 py-2 text-xs leading-5 transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {t(page.label)}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}
