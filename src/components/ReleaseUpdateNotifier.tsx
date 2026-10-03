import { RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "../i18n/GlobalLanguageSwitcher";

type ReleaseManifest = {
  version?: number;
  frontend?: { sha?: string };
};

const currentReleaseSha = import.meta.env.VITE_RELEASE_SHA?.trim().toLowerCase() ?? "";
const pollIntervalMs = 5 * 60 * 1000;

function isCommitSha(value: unknown): value is string {
  return typeof value === "string" && /^[a-f0-9]{7,64}$/i.test(value);
}

/**
 * Deploys create immutable JavaScript assets, so an already-open browser tab
 * deliberately keeps its current application version.  Detect a newer release
 * in the background and let the person choose when to refresh instead of
 * interrupting a form, a conversation, or an in-progress workspace action.
 */
export function ReleaseUpdateNotifier() {
  const t = useTranslation();
  const [availableReleaseSha, setAvailableReleaseSha] = useState<string | null>(null);

  useEffect(() => {
    if (!isCommitSha(currentReleaseSha)) return undefined;

    const dismissedKey = `lulu-dismissed-release:${currentReleaseSha}`;
    let active = true;

    const checkForUpdate = async () => {
      if (document.visibilityState === "hidden") return;
      try {
        const response = await fetch("/release.json", {
          cache: "no-store",
          headers: { accept: "application/json" },
        });
        if (!response.ok) return;
        const manifest = await response.json() as ReleaseManifest;
        const nextReleaseSha = manifest.frontend?.sha?.trim().toLowerCase();
        if (!active || manifest.version !== 1 || !isCommitSha(nextReleaseSha) || nextReleaseSha === currentReleaseSha) return;
        if (window.sessionStorage.getItem(dismissedKey) === nextReleaseSha) return;
        setAvailableReleaseSha(nextReleaseSha);
      } catch {
        // A notification is optional. Connectivity issues must never obscure
        // the workspace or turn an otherwise usable app into an error state.
      }
    };

    const checkWhenVisible = () => {
      if (document.visibilityState === "visible") void checkForUpdate();
    };

    void checkForUpdate();
    const interval = window.setInterval(() => void checkForUpdate(), pollIntervalMs);
    document.addEventListener("visibilitychange", checkWhenVisible);
    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", checkWhenVisible);
    };
  }, []);

  if (!availableReleaseSha) return null;

  const dismiss = () => {
    try {
      window.sessionStorage.setItem(`lulu-dismissed-release:${currentReleaseSha}`, availableReleaseSha);
    } catch {
      // The alert can still be dismissed for this rendered session.
    }
    setAvailableReleaseSha(null);
  };

  return <aside className="fixed inset-x-3 bottom-3 z-[100] mx-auto flex max-w-lg items-center gap-3 rounded-2xl border border-violet-300/40 bg-slate-950/95 px-4 py-3 text-sm text-white shadow-2xl shadow-violet-950/40 backdrop-blur-md sm:inset-x-auto sm:right-5 sm:bottom-5" role="status" aria-live="polite">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-400/20 text-violet-200"><RefreshCw size={17} aria-hidden="true" /></span>
    <p className="min-w-0 flex-1 font-medium">{t("A new Lulu version is ready.")}</p>
    <button type="button" onClick={() => window.location.reload()} className="shrink-0 rounded-xl bg-violet-400 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">{t("Refresh now")}</button>
    <button type="button" onClick={dismiss} className="shrink-0 rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label={t("Dismiss update notice")} title={t("Dismiss update notice")}><X size={16} aria-hidden="true" /></button>
  </aside>;
}
