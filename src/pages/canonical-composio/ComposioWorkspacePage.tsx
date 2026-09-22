import { CheckCircle2, Link2, ShieldCheck } from "lucide-react";
import { useLuluApp } from "../../api/LuluAppContext";
import { livePanelStyles } from "../../api/live-panel-ui";
import { ComposioCatalog } from "../../components/ComposioCatalog";
import { WorkspaceSurfaceShell } from "../../components/WorkspaceSurfaceShell";
import { useTranslation } from "../../i18n/GlobalLanguageSwitcher";

export default function ComposioWorkspacePage() {
  const t = useTranslation();
  const { selectedWorkspace, permissions } = useLuluApp();
  const canConnect = permissions.status === "ready" && permissions.capabilities.includes("providers.connect");

  if (!selectedWorkspace) {
    return <WorkspaceSurfaceShell activeSlug="lulu-connected-apps-9011"><main className="page-frame grid min-h-screen place-items-center p-6"><p className="text-sm text-muted-foreground">{t("Choose a workspace to continue.")}</p></main></WorkspaceSurfaceShell>;
  }

  return <WorkspaceSurfaceShell activeSlug="lulu-connected-apps-9011"><main className="page-frame min-h-screen bg-[var(--background)] px-5 py-8 text-[var(--foreground)] sm:px-8 lg:px-12">
    <div className="mx-auto max-w-6xl">
      <header className="border-b border-[var(--border)] pb-7">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-[var(--primary)]">{t("Workspace settings")}</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight">{t("Integrations")}</h1>
            <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{t("Connect the business apps Lulu is allowed to use for this workspace. Lulu-managed channels remain protected and are not exposed here.")}</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-medium">
            <ShieldCheck size={16} className="text-emerald-600" />
            {t("Credentials stay protected")}
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"><Link2 size={17} className="text-[var(--primary)]" /><p className="mt-3 text-sm font-semibold">{t("Connect approved apps")}</p><p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">{t("Choose from the catalog published by Lulu administrators.")}</p></div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"><CheckCircle2 size={17} className="text-emerald-600" /><p className="mt-3 text-sm font-semibold">{t("See connection status")}</p><p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">{t("Connected accounts are scoped to this workspace and user.")}</p></div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"><ShieldCheck size={17} className="text-[var(--primary)]" /><p className="mt-3 text-sm font-semibold">{t("Protected execution")}</p><p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">{t("Tool calls are authorized and metered by Lulu before execution.")}</p></div>
        </div>
      </header>
      <section className="mt-7 max-w-3xl">
        <ComposioCatalog workspaceId={selectedWorkspace.id} canConnect={canConnect} />
      </section>
    </div>
    <style>{livePanelStyles}</style>
  </main></WorkspaceSurfaceShell>;
}
