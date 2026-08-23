import { ArrowRight, Globe2, LayoutTemplate, PencilLine, X } from "lucide-react";
import type { WebsiteGenerationTargetMode, WebsiteSite } from "../api/websites";

type Translate = (key: string) => string;

type Props = {
  provider: "wordpress" | "webflow";
  sites: WebsiteSite[];
  selectedSiteId: string;
  mode: WebsiteGenerationTargetMode | null;
  busy: boolean;
  onSelectSite: (siteId: string) => void;
  onSelectMode: (mode: WebsiteGenerationTargetMode) => void;
  onCancel: () => void;
  onContinue: () => void;
  t: Translate;
};

export function WebsiteGenerationTargetDialog({ provider, sites, selectedSiteId, mode, busy, onSelectSite, onSelectMode, onCancel, onContinue, t }: Props) {
  const providerSites = sites.filter((site) => site.provider === provider);
  const providerLabel = provider === "wordpress" ? "WordPress / Jetpack" : "Webflow";
  const siteRequired = provider === "wordpress";
  const canContinue = Boolean(mode && (!siteRequired || selectedSiteId) && !busy);

  return (
    <div className="pointer-events-none fixed inset-0 z-[1000] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-black/35 p-4 backdrop-blur-[3px]">
      <div role="dialog" aria-modal="true" aria-labelledby="website-target-title" style={{ color: "#111827" }} className="pointer-events-auto relative my-auto max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl sm:p-7">
        <button type="button" onClick={onCancel} aria-label={t("Close selection")} className="absolute right-4 top-4 rounded-lg border border-border p-2 text-[#4b5563] transition hover:bg-secondary">
          <X size={17} />
        </button>

        <div className="flex items-start gap-4 pr-10">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Globe2 size={22} /></span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">{providerLabel}</p>
            <h2 id="website-target-title" className="mt-1 text-xl font-semibold text-[#111827]">{t("How would you like to continue?")}</h2>
            <p className="mt-2 text-sm leading-6 text-[#4b5563]">{t("Choose whether Lulu should work with an existing website or create a fresh website. Nothing starts until you confirm this selection.")}</p>
          </div>
        </div>

        <div role="radiogroup" aria-label={t("Website type")} className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" role="radio" aria-checked={mode === "existing"} onClick={() => onSelectMode("existing")} className={`rounded-xl border p-4 text-left transition ${mode === "existing" ? "border-primary bg-primary/5 ring-2 ring-primary/15" : "border-border bg-background hover:border-primary/40"}`}>
            <div className="flex items-start gap-3">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${mode === "existing" ? "bg-primary text-primary-foreground" : "bg-secondary text-[#4b5563]"}`}><PencilLine size={18} /></span>
              <div>
                <span className="block text-sm font-semibold text-[#111827]">{t("Use an existing website")}</span>
                <span className="mt-1 block text-xs leading-5 text-[#4b5563]">{t("Matching pages are updated on the selected connected website. Other content remains in place.")}</span>
              </div>
            </div>
          </button>

          <button type="button" role="radio" aria-checked={mode === "new"} onClick={() => onSelectMode("new")} className={`rounded-xl border p-4 text-left transition ${mode === "new" ? "border-primary bg-primary/5 ring-2 ring-primary/15" : "border-border bg-background hover:border-primary/40"}`}>
            <div className="flex items-start gap-3">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${mode === "new" ? "bg-primary text-primary-foreground" : "bg-secondary text-[#4b5563]"}`}><LayoutTemplate size={18} /></span>
              <div>
                <span className="block text-sm font-semibold text-[#111827]">{t("Generate a new website")}</span>
                <span className="mt-1 block text-xs leading-5 text-[#4b5563]">{t("Fresh pages are added from the standard template without reusing matching existing pages.")}</span>
              </div>
            </div>
          </button>
        </div>

        <label className="mt-5 flex flex-col gap-1.5 text-xs font-semibold text-[#4b5563]">
          <span>{t("Publishing destination")}</span>
          <select value={selectedSiteId} onChange={(event) => onSelectSite(event.target.value)} className="h-11 rounded-lg border border-border bg-background px-3 text-sm font-normal text-[#111827] outline-none transition focus:border-primary">
            <option value="">{providerSites.length ? t("Select website") : t("No connected website found")}</option>
            {providerSites.map((site) => <option key={site.id} value={site.id}>{site.name}{site.externalSiteUrl ? ` — ${site.externalSiteUrl}` : ""}</option>)}
          </select>
        </label>

        {mode === "existing" && <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-900">{t("Existing mode can update pages with matching titles or URLs. Review the selected destination carefully.")}</p>}
        {mode === "new" && <p className="mt-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs leading-5 text-blue-900">{t("New mode preserves existing pages, adds the generated pages, and activates the generated homepage after publishing.")}</p>}
        {providerSites.length === 0 && <p role="status" className="mt-3 text-xs leading-5 text-[#4b5563]">{t("Connect or create a website at the provider first, then refresh this list.")}</p>}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="h-10 rounded-lg border border-border px-4 text-sm font-medium text-[#111827] transition hover:bg-secondary">{t("Cancel")}</button>
          <button type="button" disabled={!canContinue} onClick={onContinue} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45">
            {busy ? t("Starting…") : t("Confirm and continue")}<ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
