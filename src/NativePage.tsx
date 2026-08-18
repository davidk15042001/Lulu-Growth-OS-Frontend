import { StrictMode, useEffect, useState, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { LuluRuntime } from "./api/runtime";
import { PageErrorBoundary } from "./PageErrorBoundary";
import { LiveDataRequired } from "./components/LiveDataRequired";
import { getPageContract } from "./api/page-contracts";
import nativeMobileCss from "./ui/native-mobile.css?inline";

type AppModule = { default: ComponentType };
type StyleModule = string;

const appModules = import.meta.glob<AppModule>("./pages/*/App.tsx");
const styleModules = import.meta.glob<StyleModule>("./pages/*/index.css", {
  query: "?inline",
  import: "default",
});
const liveDataBackedSlugs = new Set(["lulu-website-portal-9012"]);

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

function pageSlugFromPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "entries" && segments[1]) return segments[1];
  return segments[0] ?? "";
}

export function NativePage({ slug }: { slug: string }) {
  const [App, setApp] = useState<ComponentType | null>(null);
  const [error, setError] = useState<unknown>(null);
  const contract = getPageContract(slug);
  const isAuthPage = authPageSlugs.has(slug) || window.location.pathname.startsWith("/auth/");
  const isOnboardingPage = contract?.kind === "onboarding";
  const showLiveDataGate = !isAuthPage && !isOnboardingPage && !liveDataBackedSlugs.has(slug);

  useEffect(() => {
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
  }, [slug]);

  if (error) {
    return (
      <main className="page-loading" role="alert">
        Unable to load this page. Check the console for details.
      </main>
    );
  }

  if (!App) {
    return (
      <main className="page-loading" role="status">
        Loading page…
      </main>
    );
  }

  return (
    <LuluRuntime slug={slug}>
      {showLiveDataGate ? (
        <LiveDataRequired pageName={slug} />
      ) : (
        <div className="lulu-native-page">
          <PageErrorBoundary pageName={slug}>
            <App />
          </PageErrorBoundary>
        </div>
      )}
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
