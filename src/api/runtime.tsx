import { useEffect, useMemo, useState, type ReactNode } from "react";
import { HOME_PAGE_SLUG, navigateApp, routes } from "../routing";
import { GlobalBranding } from "../branding/GlobalBranding";
import { LegacyChromeCleanup } from "../branding/LegacyChromeCleanup";
import { GlobalLanguageSwitcher } from "../i18n/GlobalLanguageSwitcher";
import { GlobalUploadFeedback } from "../uploads/GlobalUploadFeedback";
import { PostAnalysisCreationPrompt } from "../components/PostAnalysisCreationPrompt";
import { PostOnboardingReadinessPrompt } from "../components/PostOnboardingReadinessPrompt";
import { LiveApiPanel } from "./LiveApiPanel";
import { getPageContract } from "./page-contracts";
import { clearSelectedWorkspaceId } from "./session";
import { useLuluApp } from "./LuluAppContext";

const STATIC_RESOURCE_PAGE_SLUGS = new Set([
  "bold-ocean-5847", "calmly-park-3313",
  "daring-brook-9034", "dreamy-shade-5445", "fancily-leaf-1766", "finely-garden-9221", "gentle-cliff-7133",
  "glad-coast-1428", "happily-brook-7061", "kindly-morning-7115", "kindly-year-8981", "lucky-park-8649",
  "merry-castle-3260", "mightily-shore-7108", "nice-moon-2056", "purely-dusk-2409", "quietly-moon-4186",
  "radiant-cave-9340", "richly-forest-5832", "serenely-creek-1765", "sharp-current-9677", "sharply-sky-4161",
  "sharply-wood-4560", "smart-village-1099", "soft-hill-4757", "softly-second-7684", "solid-sand-5563",
  "sparkling-cave-8456", "sparkling-time-5280", "sparklingly-light-7230", "sparklingly-moon-5114",
  "sunnily-peak-7188", "sunny-moon-6307", "sunny-summer-2293", "swift-pool-5077", "wildly-sun-6424",
  "wildly-time-4260", "wise-brook-1762", "wispy-current-7490", "wondrously-second-5656",
]);

export function usesStaticResourceGate(slug: string) {
  return STATIC_RESOURCE_PAGE_SLUGS.has(slug);
}

export function LuluRuntime({ slug, children }: { slug: string; children: ReactNode }) {
  const appContext = useLuluApp();
  const contract = useMemo(() => getPageContract(slug), [slug]);
  const [state, setState] = useState<"checking" | "ready" | "offline">(
    contract?.kind === "public" ? "ready" : "checking",
  );
  const [workspaceId, setWorkspaceId] = useState("");

  useEffect(() => {
    if (!contract || contract.kind === "public") {
      setState("ready");
      setWorkspaceId("");
      return;
    }
    if (appContext.loading) {
      setState("checking");
      return;
    }

    const workspace = appContext.selectedWorkspace ?? appContext.workspaces[0];
    if (!workspace) {
      if (appContext.error) {
        setState("offline");
        return;
      }
      clearSelectedWorkspaceId();
      if (contract.kind === "onboarding") {
        if (slug !== "bravely-path-4713") {
          navigateApp(routes.onboarding.companyInformation, { replace: true });
          return;
        }
        setState("ready");
        return;
      }
      navigateApp(routes.onboarding.companyInformation, { replace: true });
      return;
    }

    setWorkspaceId(workspace.id);
    if (
      workspace.onboardingFileReuploadRequired
      && contract.kind === "onboarding"
      && slug !== "quiet-garden-9477"
    ) {
      navigateApp(routes.onboarding.businessDescription, { replace: true });
      return;
    }
    if (contract.kind !== "onboarding" && appContext.permissions.status === "unavailable") {
      setState("offline");
      return;
    }
    setState("ready");
  }, [appContext.error, appContext.loading, appContext.permissions.status, appContext.selectedWorkspace, appContext.workspaces, contract, slug]);

  if (!contract) {
    return <main style={{ padding: 24 }}>This page has no API contract.</main>;
  }

  return <>
    {state === "checking" && <div role="status" style={{ position: "fixed", zIndex: 9999, left: "50%", top: 12, transform: "translateX(-50%)", maxWidth: "calc(100% - 24px)", border: "1px solid #d5d5d0", borderRadius: 8, background: "#fff", color: "#686864", padding: "10px 14px", boxShadow: "0 10px 30px rgba(0,0,0,.08)", pointerEvents: "none" }}>Loading workspace…</div>}
    {state === "offline" && <div role="alert" style={{ position: "fixed", zIndex: 9999, left: "50%", top: 12, transform: "translateX(-50%)", maxWidth: "calc(100% - 24px)", border: "1px solid #d5d5d0", borderRadius: 8, background: "#fff", color: "#171717", padding: "10px 14px", boxShadow: "0 10px 30px rgba(0,0,0,.12)" }}>Live data is temporarily unavailable. Your layout remains accessible.</div>}
    {children}
    {state === "ready" && workspaceId && contract.kind !== "public" && contract.kind !== "onboarding" && (
      <LiveApiPanel workspaceId={appContext.selectedWorkspace?.id ?? workspaceId} contract={contract} />
    )}
    <GlobalBranding contractKind={contract.kind} />
    <LegacyChromeCleanup />
    <GlobalLanguageSwitcher
      showButton={slug !== "brightly-door-5741" && (contract.kind === "public" || contract.kind === "onboarding" || window.location.pathname.startsWith("/onboarding/"))}
    />
    <GlobalUploadFeedback />
    {state === "ready" && workspaceId && contract.kind !== "public" && slug === HOME_PAGE_SLUG && <PostAnalysisCreationPrompt workspaceId={appContext.selectedWorkspace?.id ?? workspaceId} />}
    {state === "ready" && workspaceId && contract.kind !== "public" && contract.kind !== "onboarding" && <PostOnboardingReadinessPrompt workspaceId={appContext.selectedWorkspace?.id ?? workspaceId} />}
  </>;
}
