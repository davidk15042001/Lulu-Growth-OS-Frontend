import { ArrowRight, FileCheck2, FileText, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useLuluApp } from "../../api/LuluAppContext";
import { navigateApp, routes } from "../../routing";
import { useTranslation } from "../../i18n/GlobalLanguageSwitcher";
import { WorkspaceSurfaceShell } from "../../components/WorkspaceSurfaceShell";

/**
 * Finance is intentionally a configuration/read surface for customers.
 * Lulu's agents create and send invoices and quotes from the canonical
 * commercial-document services; customers do not create them manually here.
 */
export default function FinanceTemplatesPage() {
  const t = useTranslation();
  const { selectedWorkspace } = useLuluApp();

  if (!selectedWorkspace) {
    return (
      <WorkspaceSurfaceShell activeSlug="quietly-stone-4158">
        <main className="page-frame min-h-screen bg-[var(--background)] p-6 sm:p-8">
          <div className="mx-auto max-w-4xl rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8">
            <h1 className="text-3xl font-semibold">{t("Finance")}</h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">{t("Choose a workspace to continue.")}</p>
          </div>
        </main>
      </WorkspaceSurfaceShell>
    );
  }

  const openDocuments = (kind: "invoices" | "quotes") => {
    navigateApp(kind === "invoices" ? routes.app.invoices : routes.app.quotes);
  };

  return (
    <WorkspaceSurfaceShell activeSlug="quietly-stone-4158">
      <main className="page-frame min-h-screen min-w-0 overflow-x-hidden bg-[var(--background)] px-4 py-6 sm:px-7 sm:py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <header className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_46%),var(--card)] p-6 shadow-sm sm:p-8">
            <div className="relative max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="eyebrow">{t("Finance")}</p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
                  <Sparkles size={13} aria-hidden="true" />
                  {t("Managed by Lulu agents")}
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{t("Finance templates")}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
                {t("Lulu automatically creates invoices and quotes when they are needed. Choose a template to review the format used for your customer documents.")}
              </p>
            </div>
          </header>

          <section aria-labelledby="finance-template-heading">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <h2 id="finance-template-heading" className="text-xl font-semibold">{t("Document templates")}</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{t("Your agents use these formats for every generated document.")}</p>
              </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <TemplateCard
                icon={<FileText size={22} aria-hidden="true" />}
                title={t("Invoice template")}
                description={t("The standard format Lulu uses for invoices, payment details and outstanding balances.")}
                status={t("Used automatically")}
                actionLabel={t("View invoices")}
                onAction={() => openDocuments("invoices")}
              />
              <TemplateCard
                icon={<FileCheck2 size={22} aria-hidden="true" />}
                title={t("Offer / quote template")}
                description={t("The standard format Lulu uses for offers, quotes, product lines and validity dates.")}
                status={t("Used automatically")}
                actionLabel={t("View offers and quotes")}
                onAction={() => openDocuments("quotes")}
              />
            </div>
          </section>

          <aside className="flex items-start gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 text-sm leading-6 text-sky-900">
            <Sparkles className="mt-0.5 shrink-0" size={17} aria-hidden="true" />
            <p>{t("No manual invoice or quote creation is required. Lulu generates documents from your company profile, products, customer records and approved policies.")}</p>
          </aside>
        </div>
      </main>
    </WorkspaceSurfaceShell>
  );
}

function TemplateCard({ icon, title, description, status, actionLabel, onAction }: { icon: ReactNode; title: string; description: string; status: string; actionLabel: string; onAction: () => void }) {
  return (
    <article className="group flex min-h-64 flex-col rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-sm">{icon}</span>
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">{status}</span>
      </div>
      <h3 className="mt-6 text-xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
      <button type="button" onClick={onAction} className="mt-auto inline-flex w-fit items-center gap-2 pt-6 text-sm font-semibold text-[var(--foreground)] underline-offset-4 hover:underline">
        {actionLabel}
        <ArrowRight size={15} aria-hidden="true" />
      </button>
    </article>
  );
}
