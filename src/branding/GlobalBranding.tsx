import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { PageContract } from "../api/page-contracts";

const LOGO_PATH = "/branding/lulu-intelligence-logo.png";
const NAMED_BRAND_SELECTOR = [
  ".brand",
  ".wordmark",
  ".lulu-logo",
  "[class*='-wordmark']",
  "[class*='lulu-logo']",
].join(",");

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

function sameHosts(current: HTMLElement[], next: HTMLElement[]) {
  return current.length === next.length && current.every((host, index) => host === next[index]);
}

function findBrandHosts(root: HTMLElement, contractKind: PageContract["kind"]) {
  const found = new Set<HTMLElement>();

  root.querySelectorAll<HTMLElement>(NAMED_BRAND_SELECTOR).forEach((element) => {
    if (hasCompactBrandText(element)) found.add(element);
  });

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const exactTextElements: HTMLElement[] = [];
  let node = walker.nextNode();
  while (node) {
    if (node.parentElement instanceof HTMLElement && exactBrandText(node.textContent ?? "")) {
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

export function GlobalBranding({ contractKind }: { contractKind: PageContract["kind"] }) {
  const [hosts, setHosts] = useState<HTMLElement[]>([]);

  useLayoutEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    let queued = false;

    const scan = () => {
      queued = false;
      const next = findBrandHosts(root, contractKind);
      setHosts((current) => {
        current.filter((host) => !next.includes(host)).forEach((host) => host.classList.remove("lulu-global-brand-host"));
        next.forEach((host) => {
          host.classList.add("lulu-global-brand-host");
          host.setAttribute("data-lulu-no-translate", "true");
          host.setAttribute("translate", "no");
        });
        return sameHosts(current, next) ? current : next;
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
      root.querySelectorAll(".lulu-global-brand-host").forEach((host) => host.classList.remove("lulu-global-brand-host"));
    };
  }, [contractKind]);

  return <>
    {hosts.map((host, index) => createPortal(
      <img className="lulu-global-brand-image" src={LOGO_PATH} alt="Lulu Intelligence" draggable={false} />,
      host,
      `lulu-brand-${index}`,
    ))}
    <style>{globalBrandStyles}</style>
  </>;
}

const globalBrandStyles = `
.lulu-global-brand-host{min-width:0!important;min-height:52px!important;align-items:center!important;overflow:visible!important;font-size:0!important;color:transparent!important;white-space:nowrap!important}
.lulu-global-brand-host>:not(.lulu-global-brand-image):not(button){display:none!important}
.lulu-global-brand-host>button{font-size:initial!important}
.lulu-global-brand-image{display:block!important;width:min(184px,100%)!important;height:auto!important;max-height:69px!important;object-fit:contain!important;object-position:left center!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;user-select:none!important}
header .lulu-global-brand-image,footer .lulu-global-brand-image{width:min(176px,100%)!important}
@media(max-width:900px){aside .lulu-global-brand-host{min-height:42px!important}aside .lulu-global-brand-image{width:min(150px,100%)!important;max-height:56px!important}}
`;
