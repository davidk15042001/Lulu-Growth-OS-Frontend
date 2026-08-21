import { ChevronDown, MoreHorizontal } from "lucide-react";
import { pageLinkProps } from "../routing";
import { luluDropdownNavigation } from "../pages/fancily-leaf-1766/components/generated/LuluExecutiveDashboard";

type NavigationPage = { id: string; label: string; soon?: boolean };
type NavigationSection = { label: string; pages: readonly NavigationPage[] };

const navigationSections = luluDropdownNavigation as readonly NavigationSection[];

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
          const hasAvailablePage = section.pages.some((page) => Boolean(pageLinkProps(page.id).href));
          return (
            <details key={section.label} open={isActiveSection || section.label === "Website" || section.label === "Settings"}>
              <summary className={isActiveSection ? "is-active" : undefined}>
                <span>{section.label}{hasAvailablePage ? "" : " (Soon)"}</span>
                <ChevronDown aria-hidden="true" size={14} />
              </summary>
              <div className="lulu-global-navigation__subitems">
                {section.pages.map((page) => {
                  const props = pageLinkProps(page.id);
                  const available = !page.soon && Boolean(props.href);
                  const isActivePage = page.id === activeSlug;
                  return (
                    <a
                      key={page.id}
                      {...props}
                      className={isActivePage ? "is-active" : undefined}
                      aria-current={isActivePage ? "page" : undefined}
                      aria-disabled={!available || undefined}
                      tabIndex={available ? undefined : -1}
                      onClick={(event) => {
                        if (!available) event.preventDefault();
                      }}
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

export type { NavigationPage, NavigationSection };

