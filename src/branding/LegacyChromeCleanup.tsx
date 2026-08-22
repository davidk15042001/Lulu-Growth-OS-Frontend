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
  if (className.includes("left-nav")) return true;
  if (ariaLabel.includes("lulu ai-bereiche")) return true;

  const hasLegacyBranding =
    /lulu(?:\.|)ai/.test(text) ||
    text.includes("luluai") ||
    text.includes("businessos") ||
    text.includes("workspace");
  const hasNavigationSections =
    (text.includes("dashboard") && text.includes("agent")) ||
    (text.includes("crm") && text.includes("marketing")) ||
    (text.includes("website") && text.includes("ecommerce")) ||
    (text.includes("sales") && text.includes("settings")) ||
    (text.includes("workspace") && text.includes("settings"));
  const looksLikeLegacySidebar =
    element.matches("aside") ||
    className.includes("left-nav") ||
    className.includes("sidebar") ||
    className.includes("w-64") ||
    className.includes("w-[244px]") ||
    className.includes("w-[232px]") ||
    className.includes("w-[220px]") ||
    ariaLabel.includes("lulu ai-bereiche");

  return looksLikeLegacySidebar && hasLegacyBranding && hasNavigationSections;
}

function getSidebarLayoutCompanions(element: HTMLElement) {
  const companions: HTMLElement[] = [];
  const siblingMain = element.nextElementSibling;
  if (siblingMain instanceof HTMLElement && siblingMain.matches("main, section")) companions.push(siblingMain);

  const parent = element.parentElement;
  if (parent) {
    const mainChildren = [...parent.children].filter(
      (child): child is HTMLElement => child instanceof HTMLElement && child !== element && child.matches("main, section"),
    );
    companions.push(...mainChildren);
  }

  return [...new Set(companions)];
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
    let currentCompanions: HTMLElement[] = [];

    const scan = () => {
      queued = false;
      const next = findLegacyChrome(root);
      const nextCompanions = [...new Set(next.flatMap((element) => (isLegacyAppSidebar(element) ? getSidebarLayoutCompanions(element) : [])))];
      current.filter((element) => !next.includes(element)).forEach((element) => {
        element.classList.remove("lulu-legacy-app-chrome-hidden");
        element.removeAttribute("data-lulu-legacy-chrome");
      });
      currentCompanions.filter((element) => !nextCompanions.includes(element)).forEach((element) => {
        element.classList.remove("lulu-legacy-sidebar-main-reset");
        element.removeAttribute("data-lulu-legacy-sidebar-main-reset");
      });
      next.forEach((element) => {
        element.classList.add("lulu-legacy-app-chrome-hidden");
        element.setAttribute("data-lulu-legacy-chrome", "hidden");
      });
      nextCompanions.forEach((element) => {
        element.classList.add("lulu-legacy-sidebar-main-reset");
        element.setAttribute("data-lulu-legacy-sidebar-main-reset", "true");
      });
      if (!sameElements(current, next)) current = next;
      if (!sameElements(currentCompanions, nextCompanions)) currentCompanions = nextCompanions;
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
      currentCompanions.forEach((element) => {
        element.classList.remove("lulu-legacy-sidebar-main-reset");
        element.removeAttribute("data-lulu-legacy-sidebar-main-reset");
      });
    };
  }, []);

  return (
    <style>{`
.lulu-legacy-app-chrome-hidden{display:none!important}
.lulu-legacy-sidebar-main-reset{margin-left:0!important;padding-left:0!important}
`}</style>
  );
}
