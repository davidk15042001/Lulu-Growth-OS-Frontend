import { useEffect, useMemo, useState, type ReactNode } from "react";
import { navigateApp, routes } from "../routing";
import { GlobalBranding } from "../branding/GlobalBranding";
import { LegacyChromeCleanup } from "../branding/LegacyChromeCleanup";
import { GlobalLanguageSwitcher } from "../i18n/GlobalLanguageSwitcher";
import { GlobalUploadFeedback } from "../uploads/GlobalUploadFeedback";
import { PostAnalysisCreationPrompt } from "../components/PostAnalysisCreationPrompt";
import { ApiError } from "./client";
import { LiveApiPanel } from "./LiveApiPanel";
import { LiveResourceGate } from "./LiveResourceGate";
import { getPageContract } from "./page-contracts";
import {
  clearSelectedWorkspaceId,
  getSelectedWorkspaceId,
  setSelectedWorkspaceId,
} from "./session";
import { workspaceApi } from "./workspaces";
import { useLuluApp } from "./LuluAppContext";

const STATIC_RESOURCE_PAGE_SLUGS = new Set([
  "bold-ocean-5847", "boldly-field-4971", "brave-stream-5322", "calmly-park-3313", "crisp-week-7116",
  "daring-brook-9034", "dreamy-shade-5445", "fancily-leaf-1766", "finely-garden-9221", "gentle-cliff-7133",
  "glad-coast-1428", "happily-brook-7061", "kindly-morning-7115", "kindly-year-8981", "lucky-park-8649",
  "merry-castle-3260", "mightily-shore-7108", "nice-moon-2056", "purely-dusk-2409", "quietly-moon-4186",
  "radiant-cave-9340", "richly-forest-5832", "serenely-creek-1765", "sharp-current-9677", "sharply-sky-4161",
  "sharply-wood-4560", "smart-village-1099", "soft-hill-4757", "softly-second-7684", "solid-sand-5563",
  "sparkling-cave-8456", "sparkling-time-5280", "sparklingly-light-7230", "sparklingly-moon-5114", "steady-stone-6443",
  "sunnily-peak-7188", "sunny-moon-6307", "sunny-summer-2293", "swift-pool-5077", "wildly-sun-6424",
  "wildly-time-4260", "wise-brook-1762", "wispy-current-7490", "wondrously-second-5656",
]);

export function LuluRuntime({ slug, children }: { slug: string; children: ReactNode }) {
  const appContext = useLuluApp();
  const contract = useMemo(() => getPageContract(slug), [slug]);
  const [state, setState] = useState<"checking" | "ready" | "offline">(
    contract?.kind === "public" ? "ready" : "checking",
  );
  const [workspaceId, setWorkspaceId] = useState("");

  useEffect(() => {
    if (!contract || contract.kind === "public") return;
    const controller = new AbortController();

    async function load() {
      try {
        const response = await workspaceApi.list(controller.signal);
        const workspaces = response.data.items;
        let workspace = workspaces.find((item) => item.id === getSelectedWorkspaceId()) ?? workspaces[0];
        if (!workspace) {
          clearSelectedWorkspaceId();
          if (contract?.kind === "onboarding") {
            if (!["steady-stone-6443", "bravely-path-4713"].includes(slug)) {
              navigateApp(routes.onboarding.companyInformation, { replace: true });
              return;
            }
            setState("ready");
            return;
          }
          navigateApp(routes.onboarding.welcome, { replace: true });
          return;
        }
        setSelectedWorkspaceId(workspace.id);
        setWorkspaceId(workspace.id);
        if (contract?.kind !== "onboarding") {
          await workspaceApi.bootstrap(workspace.id, controller.signal);
        }
        setState("ready");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (error instanceof ApiError && error.status === 401) {
          clearSelectedWorkspaceId();
          navigateApp(routes.auth.login, { replace: true });
          return;
        }
        setState("offline");
      }
    }

    void load();
    return () => controller.abort();
  }, [contract, slug]);

  if (!contract) {
    return <main style={{ padding: 24 }}>This page has no API contract.</main>;
  }

  return <>
    {state === "checking" && <div role="status" style={{ position: "fixed", inset: 0, zIndex: 9999, display: "grid", placeItems: "center", background: "#f7f7f5", color: "#686864" }}>Loading workspace…</div>}
    {state === "offline" && <div role="alert" style={{ position: "fixed", zIndex: 9999, left: "50%", top: 12, transform: "translateX(-50%)", maxWidth: "calc(100% - 24px)", border: "1px solid #d5d5d0", borderRadius: 8, background: "#fff", color: "#171717", padding: "10px 14px", boxShadow: "0 10px 30px rgba(0,0,0,.12)" }}>Live data is temporarily unavailable. Your layout remains accessible.</div>}
    {contract.kind === "resource" && <LiveResourceGate enabled={STATIC_RESOURCE_PAGE_SLUGS.has(slug)} resourceType={contract.resourceType}>{children}</LiveResourceGate>}
    {contract.kind !== "resource" && children}
    <GlobalBranding contractKind={contract.kind} />
    <LegacyChromeCleanup />
    <GlobalLanguageSwitcher />
    <GlobalUploadFeedback />
    {state === "ready" && workspaceId && slug !== "fancily-leaf-1766" && <LiveApiPanel workspaceId={appContext.selectedWorkspace?.id ?? workspaceId} contract={contract} />}
    {state === "ready" && workspaceId && contract.kind !== "public" && <PostAnalysisCreationPrompt workspaceId={appContext.selectedWorkspace?.id ?? workspaceId} />}
  </>;
}
