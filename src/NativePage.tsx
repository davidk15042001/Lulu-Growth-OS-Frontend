import { StrictMode, useEffect, useState, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { LuluRuntime, usesStaticResourceGate } from "./api/runtime";
import { LiveResourceGate } from "./api/LiveResourceGate";
import { PageErrorBoundary } from "./PageErrorBoundary";
import { LuluGlobalNavigation } from "./components/LuluGlobalNavigation";
import { LuluAgentWorkspaceHeader } from "./components/LuluAgentWorkspaceHeader";
import { MinimalAgentWorkspacePage } from "./components/MinimalAgentWorkspacePage";
import { routes } from "./routing";
import { getPageContract } from "./api/page-contracts";
import { getLuluAgentContract } from "./config/lulu-agent-registry";
import nativeMobileCss from "./ui/native-mobile.css?inline";

type AppModule = { default: ComponentType };
type StyleModule = string;

const appModules = import.meta.glob<AppModule>("./pages/*/App.tsx");
const styleModules = import.meta.glob<StyleModule>("./pages/*/index.css", {
  query: "?inline",
  import: "default",
});
const authPageSlugs = new Set([
  "brightly-door-5741",
  "finely-year-1146",
  "crisp-garden-7026",
  "crisp-week-7116",
  "eagerly-bay-9885",
  "deep-coast-9085",
  "kind-morning-4984",
  "mightily-minute-5145",
]);

// Public authentication and onboarding are standalone flows. They must not
// inherit the authenticated workspace navigation, regardless of the page's
// generated slug or how the user reached the route.
const navigationFreePaths = new Set([
  routes.onboarding.companyInformation,
  routes.onboarding.businessDescription,
  routes.onboarding.productsServices,
  routes.onboarding.existingPlatforms,
  routes.onboarding.billing,
  routes.onboarding.billings,
  "/onboarding/setup-complete",
]);

const MINIMAL_AGENT_PAGE_EXCEPTIONS = new Set([
  "fancily-leaf-1766",
  "fresh-moon-5374",
  "fresh-tide-9404",
]);

function shouldUseMinimalAgentPage(
  slug: string,
  effectiveSlug: string,
  contract: ReturnType<typeof getPageContract>,
  hasAgentContract: boolean,
) {
  if (!hasAgentContract) return false;
  if (MINIMAL_AGENT_PAGE_EXCEPTIONS.has(slug)) return false;
  if (slug === "lulu-website-portal-9012" || slug === "lulu-email-portal-9013" || slug === "lulu-calendar-portal-9014") {
    return effectiveSlug === slug;
  }
  return (
    contract?.kind === "workspace" ||
    contract?.kind === "resource" ||
    contract?.kind === "metrics" ||
    contract?.kind === "ai" ||
    contract?.kind === "billing" ||
    contract?.kind === "integrations"
  );
}

function pageSlugFromPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "entries" && segments[1]) return segments[1];
  return segments[0] ?? "";
}

export function NativePage({ slug }: { slug: string }) {
  const effectiveSlug = slug === "lulu-website-portal-9012" ? (() => {
    const section = new URLSearchParams(window.location.search).get("section");
    return section ? `website-${section}` : slug;
  })() : slug === "lulu-email-portal-9013" ? (() => {
    const section = new URLSearchParams(window.location.search).get("section");
    return `email-${section || "inbox"}`;
  })() : slug === "lulu-calendar-portal-9014" ? (() => {
    const section = new URLSearchParams(window.location.search).get("section");
    return `calendar-${section || "overview"}`;
  })() : slug;
  const [App, setApp] = useState<ComponentType | null>(null);
  const [error, setError] = useState<unknown>(null);
  const contract = getPageContract(slug);
  const agentContract = getLuluAgentContract(effectiveSlug);
  const isAuthPage = authPageSlugs.has(slug) || window.location.pathname === "/login" || window.location.pathname === "/register" || window.location.pathname.startsWith("/auth/");
  const isNavigationFree = isAuthPage || navigationFreePaths.has(window.location.pathname);
  const useMinimalAgentPage = !isNavigationFree && shouldUseMinimalAgentPage(slug, effectiveSlug, contract, Boolean(agentContract));

  useEffect(() => {
    if (useMinimalAgentPage) {
      setApp(null);
      setError(null);
      return;
    }
    const resetScrollPositions = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.querySelectorAll<HTMLElement>("main, [data-lulu-scroll-container], .lulu-native-page, .lulu-native-page *").forEach((element) => {
        const style = getComputedStyle(element);
        if (element.matches("main, [data-lulu-scroll-container], .lulu-native-page") || /(auto|scroll)/.test(style.overflowY)) {
          element.scrollTop = 0;
          element.scrollLeft = 0;
        }
      });
    };
    resetScrollPositions();
    let active = true;
    setApp(null);
    setError(null);

    const pageFrame = document.querySelector<HTMLElement>(".page-frame");
    const previousPageFrameStyle = pageFrame?.getAttribute("style");
    if (pageFrame && isAuthPage) {
      pageFrame.classList.add("page-frame--auth");
      pageFrame.style.height = "auto";
      pageFrame.style.minHeight = "100vh";
      pageFrame.style.overflow = "visible";
    }

    const appLoader = appModules[`./pages/${slug}/App.tsx`];
    const styleLoader = styleModules[`./pages/${slug}/index.css`];
    if (!appLoader) {
      setError(new Error(`Native page not found: ${slug}`));
      return () => {
        active = false;
      };
    }

    let styleElement: HTMLStyleElement | null = null;
    let mobileStyleElement: HTMLStyleElement | null = null;
    void Promise.all([appLoader(), styleLoader?.()]).then(([module, css]) => {
      if (!active) return;
      if (css) {
        styleElement = document.createElement("style");
        styleElement.dataset.luluPageStyle = slug;
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
      }
      mobileStyleElement = document.createElement("style");
      mobileStyleElement.dataset.luluNativeMobile = slug;
      mobileStyleElement.textContent = nativeMobileCss;
      document.head.appendChild(mobileStyleElement);
      if (isAuthPage) {
        const livePageFrame = document.querySelector<HTMLElement>(".page-frame");
        livePageFrame?.classList.add("page-frame--auth");
        livePageFrame?.style.setProperty("height", "auto", "important");
        livePageFrame?.style.setProperty("min-height", "100vh", "important");
        livePageFrame?.style.setProperty("overflow", "visible", "important");
      }
      setApp(() => module.default);
      window.setTimeout(() => { if (active) resetScrollPositions(); }, 0);
    }).catch((loadError) => {
      if (active) setError(loadError);
    });

    return () => {
      active = false;
      styleElement?.remove();
      mobileStyleElement?.remove();
      if (pageFrame && isAuthPage) {
        if (previousPageFrameStyle == null) pageFrame.removeAttribute("style");
        else pageFrame.setAttribute("style", previousPageFrameStyle);
        pageFrame.classList.remove("page-frame--auth");
      }
    };
  }, [slug, useMinimalAgentPage, isAuthPage]);

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-foreground" role="status">
        <div className="max-w-md rounded-xl border border-border bg-[var(--card)] p-6 text-center">
          <h1 className="text-lg font-semibold">Live workspace</h1>
          <p className="mt-2 text-sm text-muted-foreground">Live data is temporarily unavailable. Your layout remains accessible.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]">Reload page</button>
        </div>
      </main>
    );
  }

  if (!App) {
    if (useMinimalAgentPage && agentContract) {
      return (
        <LuluRuntime slug={slug}>
          <div className="lulu-global-shell">
            <LuluGlobalNavigation activeSlug={effectiveSlug} />
            <div className="lulu-global-content">
              <LuluAgentWorkspaceHeader contract={agentContract} />
              <div className="lulu-native-page">
                <PageErrorBoundary pageName={slug}>
                  <MinimalAgentWorkspacePage slug={slug} contract={contract} agentContract={agentContract} />
                </PageErrorBoundary>
              </div>
            </div>
          </div>
        </LuluRuntime>
      );
    }
    return (
      <main className="page-loading" role="status">
        Loading page…
      </main>
    );
  }

  return (
    <LuluRuntime slug={slug}>
      <div className={`lulu-global-shell${isNavigationFree ? " lulu-global-shell--navigation-free" : ""}`}>
        {!isNavigationFree && <LuluGlobalNavigation activeSlug={effectiveSlug} />}
        <div className={isNavigationFree ? "lulu-global-content lulu-global-content--auth lulu-global-content--navigation-free" : "lulu-global-content"}>
          {!isNavigationFree && agentContract ? <LuluAgentWorkspaceHeader contract={agentContract} /> : null}
          <div className="lulu-native-page">
            <PageErrorBoundary pageName={slug}>
              <LiveResourceGate
                enabled={contract?.kind === "resource" && usesStaticResourceGate(slug)}
                resourceType={contract?.kind === "resource" ? contract.resourceType : null}
              >
                <App />
              </LiveResourceGate>
            </PageErrorBoundary>
          </div>
        </div>
      </div>
    </LuluRuntime>
  );
}

export function renderNativeEntry() {
  const slug = pageSlugFromPath(window.location.pathname);
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <NativePage slug={slug} />
    </StrictMode>,
  );
}
