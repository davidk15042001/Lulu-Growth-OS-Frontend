import { StrictMode, useEffect, useState, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { LuluRuntime } from "./api/runtime";
import { PageErrorBoundary } from "./PageErrorBoundary";

type AppModule = { default: ComponentType };
type StyleModule = string;

const appModules = import.meta.glob<AppModule>("./pages/*/App.tsx");
const styleModules = import.meta.glob<StyleModule>("./pages/*/index.css", {
  query: "?inline",
  import: "default",
});

function pageSlugFromPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "entries" && segments[1]) return segments[1];
  return segments[0] ?? "";
}

export function NativePage({ slug }: { slug: string }) {
  const [App, setApp] = useState<ComponentType | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let active = true;
    setApp(null);
    setError(null);

    const appLoader = appModules[`./pages/${slug}/App.tsx`];
    const styleLoader = styleModules[`./pages/${slug}/index.css`];

    if (!appLoader) {
      setError(new Error(`Native page not found: ${slug}`));
      return () => {
        active = false;
      };
    }

    let styleElement: HTMLStyleElement | null = null;
    void Promise.all([appLoader(), styleLoader?.()]).then(([module, css]) => {
      if (!active) return;
      if (css) {
        styleElement = document.createElement("style");
        styleElement.dataset.luluPageStyle = slug;
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
      }
      setApp(() => module.default);
    }).catch((loadError) => {
      if (active) setError(loadError);
    });

    return () => {
      active = false;
      styleElement?.remove();
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
      <PageErrorBoundary pageName={slug}>
        <App />
      </PageErrorBoundary>
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
