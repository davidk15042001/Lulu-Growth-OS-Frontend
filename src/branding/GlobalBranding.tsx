import { useLayoutEffect } from "react";
import type { PageContract } from "../api/page-contracts";

const LOGO_PATH = "/branding/lulu-agentic-logo.svg";
const DARK_LOGO_PATH = "/branding/lulu-agentic-logo-dark.svg";
const NAMED_BRAND_SELECTOR = [
  ".brand",
  ".wordmark",
  ".lulu-logo",
  "[class*='-wordmark']",
  "[class*='lulu-logo']",
].join(",");
const LOCAL_BRAND_SELECTOR = "[data-lulu-local-brand]";

function compactText(element: Element) {
  return (element.textContent ?? "").replace(/\s+/g, "").toLowerCase();
}

function hasCompactBrandText(element: Element) {
  const text = compactText(element);
  return /lulu(?:ai|intelligence)/.test(text) && text.length <= 32;
}

function exactBrandText(value: string) {
  return /^lulu\s*(?:ai|intelligence)$/i.test(value.trim());
}

function chooseBrandHost(textElement: HTMLElement) {
  let host = textElement;
  for (let depth = 0; depth < 3; depth += 1) {
    const parent = host.parentElement;
    if (!parent || parent.matches("aside,header,footer,main,section,article")) break;
    if (!hasCompactBrandText(parent)) break;
    host = parent;
  }
  return host;
}

function findBrandHosts(root: HTMLElement, contractKind: PageContract["kind"]) {
  const found = new Set<HTMLElement>();

  root.querySelectorAll<HTMLElement>(NAMED_BRAND_SELECTOR).forEach((element) => {
    if (!element.closest(LOCAL_BRAND_SELECTOR) && hasCompactBrandText(element)) found.add(element);
  });

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const exactTextElements: HTMLElement[] = [];
  let node = walker.nextNode();
  while (node) {
    if (
      node.parentElement instanceof HTMLElement
      && !node.parentElement.closest(LOCAL_BRAND_SELECTOR)
      && exactBrandText(node.textContent ?? "")
    ) {
      exactTextElements.push(node.parentElement);
    }
    node = walker.nextNode();
  }

  exactTextElements.forEach((element, index) => {
    const structuralBrand = element.closest("aside,header,footer") !== null;
    const firstPublicBrand = index === 0 && (contractKind === "public" || contractKind === "onboarding");
    if (structuralBrand || firstPublicBrand) found.add(chooseBrandHost(element));
  });

  return [...found].filter((host) => ![...found].some((other) => other !== host && other.contains(host)));
}

function ensureBrandImage(host: HTMLElement) {
  const existing = [...host.children].find(
    (child): child is HTMLImageElement => child instanceof HTMLImageElement && child.dataset.luluGlobalBrandImage === "true",
  );
  if (existing) return;

  const image = document.createElement("img");
  image.className = "lulu-global-brand-image";
  image.src = LOGO_PATH;
  image.alt = "Lulu AI";
  image.draggable = false;
  image.dataset.luluGlobalBrandImage = "true";
  host.append(image);
}

function clearBrandHost(host: HTMLElement) {
  host.classList.remove("lulu-global-brand-host");
  host.removeAttribute("data-lulu-no-translate");
  host.removeAttribute("translate");
  [...host.children]
    .filter((child): child is HTMLImageElement => child instanceof HTMLImageElement && child.dataset.luluGlobalBrandImage === "true")
    .forEach((image) => image.remove());
}

export function GlobalBranding({ contractKind }: { contractKind: PageContract["kind"] }) {
  useLayoutEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    const appliedHosts = new Set<HTMLElement>();
    let queued = false;

    const scan = () => {
      queued = false;
      const next = findBrandHosts(root, contractKind);
      [...appliedHosts].filter((host) => !next.includes(host)).forEach((host) => {
        clearBrandHost(host);
        appliedHosts.delete(host);
      });
      next.forEach((host) => {
        host.classList.add("lulu-global-brand-host");
        host.setAttribute("data-lulu-no-translate", "true");
        host.setAttribute("translate", "no");
        ensureBrandImage(host);
        appliedHosts.add(host);
      });
    };
    const scheduleScan = () => {
      if (queued) return;
      queued = true;
      queueMicrotask(scan);
    };

    scan();
    const observer = new MutationObserver(scheduleScan);
    observer.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      appliedHosts.forEach(clearBrandHost);
    };
  }, [contractKind]);

  return <style>{globalBrandStyles}</style>;
}

const globalBrandStyles = `
.lulu-global-brand-host{min-width:0!important;min-height:52px!important;align-items:center!important;overflow:visible!important;font-size:0!important;color:transparent!important;white-space:nowrap!important}
.lulu-global-brand-host>:not(.lulu-global-brand-image):not(button){display:none!important}
.lulu-global-brand-host>button{font-size:initial!important}
.lulu-global-brand-image{display:block!important;width:min(184px,100%)!important;height:auto!important;max-height:69px!important;object-fit:contain!important;object-position:left center!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;user-select:none!important}
.dark .lulu-global-brand-image{content:url("${DARK_LOGO_PATH}")}
header .lulu-global-brand-image,footer .lulu-global-brand-image{width:min(176px,100%)!important}
@media(max-width:900px){aside .lulu-global-brand-host{min-height:42px!important}aside .lulu-global-brand-image{width:min(150px,100%)!important;max-height:56px!important}}
`;
