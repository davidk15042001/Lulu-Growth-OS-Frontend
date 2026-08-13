import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { navigateApp } from "./routing";

type AppModule = { default: ComponentType };

const appModules = import.meta.glob<AppModule>("./pages/*/App.tsx");
const styleModules = import.meta.glob("./pages/*/index.css");

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>("a[data-lulu-route]");
  const destination = link?.dataset.luluRoute;
  if (!destination) return;
  event.preventDefault();
  navigateApp(destination);
});

async function mount() {
  const segments = window.location.pathname.split("/").filter(Boolean);
  const slug = segments[1];
  const appKey = `./pages/${slug}/App.tsx`;
  const styleKey = `./pages/${slug}/index.css`;
  const root = createRoot(document.getElementById("root")!);

  if (!slug || !appModules[appKey]) {
    root.render(<p style={{ fontFamily: "sans-serif", padding: 24 }}>Page not found.</p>);
    return;
  }

  if (styleModules[styleKey]) await styleModules[styleKey]();
  const module = await appModules[appKey]();
  const Page = module.default;
  root.render(
    <StrictMode>
      <Page />
    </StrictMode>,
  );
}

mount().catch((error) => {
  console.error(error);
  createRoot(document.getElementById("root")!).render(
    <pre style={{ whiteSpace: "pre-wrap", padding: 24 }}>Unable to load this page. Check the console for details.</pre>,
  );
});
