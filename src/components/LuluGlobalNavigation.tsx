import { ChevronDown, LogOut } from "lucide-react";
import { pageLinkProps, navigateApp, routes } from "../routing";
import { requestApi } from "../api/client";
import { clearSelectedWorkspaceId } from "../api/session";
import { luluDropdownNavigation } from "../pages/fancily-leaf-1766/components/generated/LuluExecutiveDashboard";

type NavigationPage = { id: string; label: string; soon?: boolean };
type NavigationSection = { label: string; pages: readonly NavigationPage[] };

const navigationSections = luluDropdownNavigation as readonly NavigationSection[];

export function LuluGlobalNavigation({ activeSlug }: { activeSlug: string }) {
  return (
    <aside className="lulu-global-navigation" data-lulu-global-navigation="true">
      <div className="lulu-global-navigation__workspace-label">Workspace</div>
      <nav className="lulu-global-navigation__sections">
        {navigationSections.map((section) => {
          const isActiveSection = section.pages.some((page) => page.id === activeSlug);
          return (
            <details key={section.label} open={isActiveSection || section.label === "Website" || section.label === "Settings"}>
              <summary className={isActiveSection ? "is-active" : undefined}>
                <span>{section.label}</span>
                <ChevronDown aria-hidden="true" size={14} />
              </summary>
              <div className="lulu-global-navigation__subitems">
                {section.pages.map((page) => {
                  const props = pageLinkProps(page.id);
                  const available = Boolean(props.href);
                  const isActivePage = page.id === activeSlug;
                  return (
                    <a
                      key={page.id}
                      {...props}
                      className={isActivePage ? "is-active" : undefined}
                      aria-current={isActivePage ? "page" : undefined}
                      aria-disabled={!available || undefined}
                      tabIndex={available ? undefined : -1}
                      onClick={undefined}
                      aria-label={page.label}
                    >
                      <span>{page.label}</span>
                    </a>
                  );
                })}
                {section.label === "Settings" && (
                  <button
                    type="button"
                    className="lulu-global-navigation__logout"
                    onClick={async () => {
                      try {
                        await requestApi({ path: "/auth/logout", method: "POST", body: {} });
                      } finally {
                        clearSelectedWorkspaceId();
                        navigateApp(routes.auth.login);
                      }
                    }}
                  >
                    <LogOut aria-hidden="true" size={14} />
                    <span>Sign out</span>
                  </button>
                )}
              </div>
            </details>
          );
        })}
      </nav>
    </aside>
  );
}

export type { NavigationPage, NavigationSection };

