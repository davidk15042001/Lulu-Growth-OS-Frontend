import { useLayoutEffect } from "react";

function compactText(element: Element) {
  return (element.textContent ?? "").replace(/\s+/g, "").toLowerCase();
}

function isLegacyAppTopbar(element: HTMLElement) {
  const text = compactText(element);
  const hasLegacyBrand = /lulu(?:\.|)ai/.test(text) || text.includes("businessos") || text.includes("aiworkspace");
  const hasAccountChrome = Boolean(element.querySelector('[aria-label*="Notifications" i], [aria-label*="Open navigation" i]')) || text.includes("workspaceowner") || text.includes("growthteam");
  const looksLikeTopbar = element.matches("header") || element.className.includes("top") || element.className.includes("h-[");
  return looksLikeTopbar && hasLegacyBrand && hasAccountChrome;
}

function isLegacyAppSidebar(element: HTMLElement) {
  if (element.closest(".lulu-global-navigation")) return false;

  const className = String(element.className ?? "").toLowerCase();
  const ariaLabel = (element.getAttribute("aria-label") ?? "").toLowerCase();
  const text = compactText(element);
  const hasNavigationSections =
    text.includes("dashboard") &&
    text.includes("agent") &&
    text.includes("crm") &&
    text.includes("marketing") &&
    text.includes("website");
  const looksLikeLegacySidebar =
    element.matches("aside") ||
    className.includes("left-nav") ||
    className.includes("sidebar") ||
    ariaLabel.includes("lulu ai-bereiche");

  return looksLikeLegacySidebar && hasNavigationSections;
}

function sameElements(current: HTMLElement[], next: HTMLElement[]) {
  return current.length === next.length && current.every((element, index) => element === next[index]);
}

function findLegacyChrome(root: ParentNode) {
  const pageRoot = root.querySelector(".lulu-native-page");
  if (!pageRoot) return [];
  return [...pageRoot.querySelectorAll<HTMLElement>("header, aside, nav")].filter(
    (element) => isLegacyAppTopbar(element) || isLegacyAppSidebar(element),
  );
}

export function LegacyChromeCleanup() {
  useLayoutEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    let queued = false;
    let current: HTMLElement[] = [];

    const scan = () => {
      queued = false;
      const next = findLegacyChrome(root);
      current.filter((element) => !next.includes(element)).forEach((element) => {
        element.classList.remove("lulu-legacy-app-chrome-hidden");
        element.removeAttribute("data-lulu-legacy-chrome");
      });
      next.forEach((element) => {
        element.classList.add("lulu-legacy-app-chrome-hidden");
        element.setAttribute("data-lulu-legacy-chrome", "hidden");
      });
      if (!sameElements(current, next)) current = next;
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
      current.forEach((element) => {
        element.classList.remove("lulu-legacy-app-chrome-hidden");
        element.removeAttribute("data-lulu-legacy-chrome");
      });
    };
  }, []);

  return <style>{`.lulu-legacy-app-chrome-hidden{display:none!important}`}</style>;
}
