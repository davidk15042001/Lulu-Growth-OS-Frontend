import { useEffect, useMemo, useState, type ReactNode } from "react";
import { navigateApp, routes } from "../routing";
import { ApiError } from "./client";
import { LiveApiPanel } from "./LiveApiPanel";
import { getPageContract } from "./page-contracts";
import {
  clearSelectedWorkspaceId,
  getSelectedWorkspaceId,
  setSelectedWorkspaceId,
} from "./session";
import { workspaceApi } from "./workspaces";

export function LuluRuntime({ slug, children }: { slug: string; children: ReactNode }) {
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
    return <main style={{ padding: 24, fontFamily: "sans-serif" }}>This page has no API contract.</main>;
  }

  return <>
    {state === "checking" && <div role="status" style={{ position: "fixed", inset: 0, zIndex: 9999, display: "grid", placeItems: "center", background: "#f7f7f5", color: "#686864", font: "500 14px Inter, sans-serif" }}>Loading workspace…</div>}
    {state === "offline" && <div role="alert" style={{ position: "fixed", zIndex: 9999, left: "50%", top: 12, transform: "translateX(-50%)", maxWidth: "calc(100% - 24px)", border: "1px solid #d5d5d0", borderRadius: 8, background: "#fff", color: "#171717", padding: "10px 14px", boxShadow: "0 10px 30px rgba(0,0,0,.12)", font: "500 13px Inter, sans-serif" }}>Live data is temporarily unavailable. Your layout remains accessible.</div>}
    {children}
    {state === "ready" && workspaceId && <LiveApiPanel workspaceId={workspaceId} contract={contract} />}
  </>;
}
