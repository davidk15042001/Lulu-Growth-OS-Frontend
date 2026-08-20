import { ChevronDown, MoreHorizontal, Sparkles } from "lucide-react";
import { pageLinkProps } from "../routing";

type NavigationPage = { id: string; label: string; soon?: boolean };
type NavigationSection = { label: string; pages: NavigationPage[] };

const navigationSections: NavigationSection[] = [
  { label: "Dashboard", pages: [{ id: "fancily-leaf-1766", label: "Overview" }] },
  {
    label: "AI",
    pages: [
      { id: "fresh-moon-5374", label: "Assistant" },
      { id: "radiant-dusk-9079", label: "Agents" },
      { id: "calmly-park-3313", label: "Agent Marketplace" },
      { id: "rich-field-1880", label: "Knowledge" },
      { id: "wondrously-second-5656", label: "Actions" },
      { id: "sunny-moon-6307", label: "Conversations" },
      { id: "sparkling-cave-8456", label: "Activity" },
    ],
  },
  {
    label: "CRM",
    pages: [
      { id: "bright-meadow-7537", label: "Overview" },
      { id: "sturdy-month-1562", label: "Contacts" },
      { id: "kindly-pool-8785", label: "Companies" },
      { id: "swift-hour-7844", label: "Leads" },
      { id: "smartly-shade-4619", label: "Deals" },
    ],
  },
  {
    label: "Marketing",
    pages: [
      { id: "wondrous-cloud-1355", label: "Content" },
      { id: "sparklingly-home-7386", label: "Strategy" },
      { id: "gently-shade-2476", label: "Campaigns" },
      { id: "sparklingly-moon-5114", label: "SEO" },
      { id: "zealously-path-4224", label: "GEO" },
      { id: "sunny-house-9595", label: "AEO" },
    ],
  },
  {
    label: "Website",
    pages: [
      { id: "lulu-website-portal-9012", label: "Overview" },
      { id: "website-wordpress-jetpack-9013", label: "WordPress" },
      { id: "website-webflow-9014", label: "Webflow" },
      { id: "website-shopify-9015", label: "Shopify" },
    ],
  },
  {
    label: "Settings",
    pages: [
      { id: "glad-coast-1428", label: "Integrations" },
      { id: "pure-minute-5446", label: "Billing" },
    ],
  },
];

function isAvailable(page: NavigationPage) {
  return !page.soon && Boolean(pageLinkProps(page.id).href);
}

export function LuluGlobalNavigation({ activeSlug }: { activeSlug: string }) {
  return (
    <aside className="lulu-global-navigation" data-lulu-global-navigation="true">
      <div className="lulu-global-navigation__brand">
        <img src="/branding/lulu-intelligence-logo.png" alt="Lulu AI" draggable={false} />
        <span>Lulu AI</span>
      </div>
      <div className="lulu-global-navigation__workspace-label">Workspace</div>
      <nav className="lulu-global-navigation__sections">
        {navigationSections.map((section) => {
          const isActiveSection = section.pages.some((page) => page.id === activeSlug);
          return (
            <details key={section.label} open={isActiveSection || section.label === "Website" || section.label === "Settings"}>
              <summary className={isActiveSection ? "is-active" : undefined}>
                <span>{section.label}{section.label !== "Website" && section.label !== "Settings" ? " (Soon)" : ""}</span>
                <ChevronDown aria-hidden="true" size={14} />
              </summary>
              <div className="lulu-global-navigation__subitems">
                {section.pages.map((page) => {
                  const available = isAvailable(page);
                  const props = pageLinkProps(page.id);
                  const isActivePage = page.id === activeSlug;
                  return (
                    <a
                      key={page.id}
                      {...props}
                      className={isActivePage ? "is-active" : undefined}
                      aria-current={isActivePage ? "page" : undefined}
                      aria-label={available ? page.label : `${page.label} (Soon)`}
                    >
                      <span>{page.label}{available ? "" : " (Soon)"}</span>
                    </a>
                  );
                })}
              </div>
            </details>
          );
        })}
      </nav>
      <div className="lulu-global-navigation__account">
        <button type="button">
          <span className="lulu-global-navigation__avatar">L</span>
          <span className="lulu-global-navigation__account-copy"><strong>Workspace account</strong><small>Workspace</small></span>
          <MoreHorizontal aria-hidden="true" size={16} />
        </button>
      </div>
    </aside>
  );
}
