import { type ReactNode } from "react";
import { useLiveRecords } from "./useLiveRecords";
import { useTranslation } from "../i18n/GlobalLanguageSwitcher";

export function LiveResourceGate({ enabled, resourceType, children }: { enabled: boolean; resourceType: string | null; children: ReactNode }) {
  const t = useTranslation();
  const live = useLiveRecords(enabled ? resourceType : null);
  if (!enabled) return <>{children}</>;
  const style = <style>{liveResourceGateStyles}</style>;
  if (live.loading) {
    return <>{style}<section className="lulu-live-gate" role="status"><strong>{t("Loading live data…")}</strong><span>{t("Connecting to your workspace data.")}</span></section></>;
  }
  if (live.error) {
    return <>{style}<section className="lulu-live-gate lulu-live-gate--error" role="alert"><strong>{t("Live data could not be loaded")}</strong><span>{live.error}</span><button type="button" onClick={() => void live.refresh()}>{t("Try again")}</button></section></>;
  }
  if (!live.items.length) {
    return <>{style}<section className="lulu-live-gate" role="status"><strong>{t("No live data available yet")}</strong><span>{t("Connect a data source or complete an action to populate this page. No example metrics are displayed.")}</span></section></>;
  }
  return <>{children}</>;
}

export const liveResourceGateStyles = `
.lulu-live-gate{display:flex;min-height:320px;align-items:center;justify-content:center;flex-direction:column;gap:10px;margin:24px;padding:40px;border:1px dashed var(--border,#d8d8d2);border-radius:16px;background:var(--card,#fff);color:var(--foreground,#171717);text-align:center;font-family:Poppins,ui-sans-serif,system-ui,sans-serif}
.lulu-live-gate span{max-width:560px;color:var(--muted-foreground,#686864);font-size:13px;line-height:1.55}
.lulu-live-gate button{margin-top:8px;border:1px solid var(--border,#d8d8d2);border-radius:8px;background:var(--background,#fff);padding:8px 14px;color:inherit;font:600 13px Poppins,ui-sans-serif,system-ui,sans-serif;cursor:pointer}
.lulu-live-gate--error{border-color:color-mix(in srgb,var(--destructive,#b42318) 30%,transparent)}
`;
