import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, CircleStop, ExternalLink, FileText, RefreshCw, X } from "lucide-react";
import type { WebsiteGenerationJob } from "../api/websites";

type Translate = (key: string) => string;
type PreviewPage = { title: string; slug: string; content: string; url: string | null; published: boolean; publishedAt: string };

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function pageValues(value: unknown) {
  return Array.isArray(value) ? value.map(objectValue) : [];
}

function liveUrl(value: string, updatedAt: string) {
  try {
    const url = new URL(value);
    url.searchParams.set("lulu_preview", String(Date.parse(updatedAt) || Date.now()));
    return url.toString();
  } catch {
    return value;
  }
}

function previewDocument(content: string) {
  if (!content) return "";
  if (/<html[\s>]/i.test(content)) return content;
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base target="_blank"><style>html,body{margin:0;min-height:100%;background:#fff}</style></head><body>${content}</body></html>`;
}

function generationPages(job: WebsiteGenerationJob): PreviewPage[] {
  const planned = pageValues(objectValue(job.plan).pages);
  const fromPreview = pageValues(objectValue(job.preview).publishedPages);
  const fromResult = pageValues(objectValue(job.providerResult).pages);
  const published = fromPreview.length ? fromPreview : fromResult;
  const publishedFor = (page: Record<string, unknown>, index: number) => published.find((candidate) => {
    const slug = String(page.slug ?? "").toLowerCase();
    const candidateSlug = String(candidate.slug ?? "").toLowerCase();
    return (slug && candidateSlug === slug) || String(candidate.id ?? "") === String(page.id ?? "") || (!candidateSlug && published[index] === candidate);
  });
  const result = planned.map((page, index) => {
    const publication = publishedFor(page, index);
    return {
      title: String(page.title ?? page.slug ?? `Page ${index + 1}`),
      slug: String(page.slug ?? `page-${index + 1}`),
      content: String(page.content ?? ""),
      url: publication?.url ? String(publication.url) : null,
      published: Boolean(publication?.url),
      publishedAt: String(publication?.publishedAt ?? ""),
    };
  });
  for (const [index, publication] of published.entries()) {
    const slug = String(publication.slug ?? `published-${index + 1}`);
    if (result.some((page) => page.slug === slug)) continue;
    result.push({ title: String(publication.title ?? slug), slug, content: "", url: publication.url ? String(publication.url) : null, published: Boolean(publication.url), publishedAt: String(publication.publishedAt ?? "") });
  }
  return result;
}

export function WebsiteGenerationLivePanel({
  job,
  providerLabel,
  percent,
  label,
  detail,
  running,
  cancelling,
  onClose,
  onCancel,
  t,
}: {
  job: WebsiteGenerationJob;
  providerLabel: string;
  percent: number;
  label: string;
  detail: string;
  running: boolean;
  cancelling: boolean;
  onClose: () => void;
  onCancel: () => void;
  t: Translate;
}) {
  const pages = useMemo(() => generationPages(job), [job]);
  const publishedCount = pages.filter((page) => page.published).length;
  const [selectedSlug, setSelectedSlug] = useState("");
  const [previewMode, setPreviewMode] = useState<"generated" | "published">("generated");
  const previousPublishedCount = useRef(0);

  useEffect(() => {
    const latestPublished = [...pages].reverse().find((page) => page.published);
    if (publishedCount > previousPublishedCount.current && latestPublished) {
      setSelectedSlug(latestPublished.slug);
      setPreviewMode("published");
    } else if (!selectedSlug && pages[0]) {
      setSelectedSlug(latestPublished?.slug ?? pages[0].slug);
      setPreviewMode(latestPublished ? "published" : "generated");
    }
    previousPublishedCount.current = publishedCount;
  }, [pages, publishedCount, selectedSlug]);

  const selectedPage = pages.find((page) => page.slug === selectedSlug) ?? pages[0] ?? null;
  const canShowPublished = Boolean(selectedPage?.url);
  const showPublished = previewMode === "published" && canShowPublished;
  const previewVersion = selectedPage?.publishedAt || job.updatedAt;
  const src = showPublished && selectedPage?.url ? liveUrl(selectedPage.url, previewVersion) : undefined;
  const srcDoc = !showPublished && selectedPage?.content ? previewDocument(selectedPage.content) : undefined;
  const progress = Math.min(100, Math.max(0, Math.round(percent)));
  const reportedTotalPages = Number(objectValue(objectValue(job.preview).progress).totalPages ?? 0);
  const totalPages = Math.max(pages.length, Number.isFinite(reportedTotalPages) ? reportedTotalPages : 0);

  return <div className="pointer-events-none fixed inset-0 z-[1000] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-black/35 p-3 backdrop-blur-[2px] sm:p-6">
    <section role="dialog" aria-modal="true" aria-labelledby="website-generation-title" className="pointer-events-auto my-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[#dcdcde] bg-white text-[#111827] shadow-2xl sm:max-h-[calc(100dvh-3rem)]">
      <header className="flex items-start justify-between gap-4 border-b border-[#dcdcde] px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${job.status === "failed" || job.status === "cancelled" ? "bg-red-50 text-red-700" : job.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-[#2271b1]"}`}>
            {running ? <RefreshCw aria-hidden="true" size={20} className="animate-spin" /> : <CheckCircle2 aria-hidden="true" size={20} />}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#646970]">{providerLabel}</p>
            <h2 id="website-generation-title" className="mt-1 text-lg font-semibold text-[#1d2327]">{label}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-5 text-[#50575e]">{detail}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label={t("Close generation window")} title={t("Close generation window")} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#dcdcde] text-[#50575e] transition hover:bg-[#f6f7f7]">
          <X aria-hidden="true" size={17} />
        </button>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-h-[360px] min-w-0 flex-col bg-[#f0f0f1] p-3 sm:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="truncate text-xs font-semibold text-[#1d2327]">{selectedPage?.title ?? t("Live website preview")}</span>
            </div>
            <div className="flex items-center gap-2">
              {selectedPage?.content && <button type="button" onClick={() => setPreviewMode("generated")} aria-pressed={!showPublished} className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${!showPublished ? "bg-[#2271b1] text-white" : "bg-white text-[#50575e]"}`}>{t("Generated preview")}</button>}
              {canShowPublished && <button type="button" onClick={() => setPreviewMode("published")} aria-pressed={showPublished} className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${showPublished ? "bg-[#2271b1] text-white" : "bg-white text-[#50575e]"}`}>{t("WordPress live")}</button>}
              {selectedPage?.url && <a href={selectedPage.url} target="_blank" rel="noreferrer" aria-label={t("Open published page in a new tab")} title={t("Open published page in a new tab")} className="grid h-8 w-8 place-items-center rounded-md bg-white text-[#2271b1]"><ExternalLink aria-hidden="true" size={14} /></a>}
            </div>
          </div>
          <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border border-[#c3c4c7] bg-white shadow-inner">
            {(src || srcDoc) ? <iframe
              key={`${showPublished ? "published" : "generated"}:${selectedPage?.slug}:${showPublished ? previewVersion : selectedPage?.content.length}`}
              title={`${t("Live website preview")}: ${selectedPage?.title ?? ""}`}
              src={src}
              srcDoc={srcDoc}
              sandbox={showPublished ? "allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts" : "allow-popups allow-popups-to-escape-sandbox"}
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-full min-h-[420px] w-full bg-white"
            /> : <div className="grid h-full min-h-[420px] place-items-center px-8 text-center"><div><RefreshCw aria-hidden="true" size={28} className="mx-auto animate-spin text-[#2271b1]" /><p className="mt-4 text-sm font-semibold text-[#1d2327]">{t("The first page preview is being prepared")}</p><p className="mt-2 text-xs leading-5 text-[#646970]">{t("As soon as a page is generated, it appears here automatically.")}</p></div></div>}
          </div>
          {showPublished && <p className="mt-2 text-[11px] text-[#646970]">{t("If WordPress blocks embedding, open the published page in a new tab.")}</p>}
        </div>

        <aside className="min-h-0 overflow-y-auto border-t border-[#dcdcde] bg-white p-4 lg:border-l lg:border-t-0 sm:p-5">
          <div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#646970]">{t("Build progress")}</span><strong className="text-2xl font-semibold text-[#1d2327]">{progress}%</strong></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e2e4e7]"><div className={`h-full rounded-full transition-[width] duration-500 ${job.status === "failed" || job.status === "cancelled" ? "bg-red-600" : "bg-[#2271b1]"}`} style={{ width: `${progress}%` }} /></div>
          <p className="mt-2 text-xs text-[#646970]">{t("{{0}} of {{1}} pages published").replace("{{0}}", String(publishedCount)).replace("{{1}}", String(totalPages))}</p>

          <div className="mt-5 space-y-2">
            {pages.length ? pages.map((page, index) => {
              const currentTitle = String(objectValue(objectValue(job.preview).progress).currentPageTitle ?? "");
              const active = page.title === currentTitle || page.slug === selectedPage?.slug;
              const state = page.published ? t("Published") : page.content ? t("Generated") : currentTitle === page.title ? t("Building") : t("Waiting");
              return <button key={page.slug} type="button" onClick={() => { setSelectedSlug(page.slug); setPreviewMode(page.published ? "published" : "generated"); }} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${active ? "border-[#2271b1] bg-[#f0f6fc]" : "border-[#dcdcde] hover:bg-[#f6f7f7]"}`}>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${page.published ? "bg-emerald-50 text-emerald-700" : page.content ? "bg-blue-50 text-[#2271b1]" : "bg-[#f0f0f1] text-[#646970]"}`}>{page.published ? <CheckCircle2 aria-hidden="true" size={16} /> : <FileText aria-hidden="true" size={15} />}</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-[#1d2327]">{index + 1}. {page.title}</span><span className="mt-0.5 block text-xs text-[#646970]">{state}</span></span>
              </button>;
            }) : <div className="rounded-xl border border-dashed border-[#c3c4c7] p-4 text-xs leading-5 text-[#646970]">{t("Page structure is being created…")}</div>}
          </div>

          <div className="mt-5 border-t border-[#dcdcde] pt-4">
            {running ? <button type="button" disabled={cancelling} onClick={onCancel} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"><CircleStop aria-hidden="true" size={16} />{cancelling ? t("Cancelling…") : t("Cancel generation")}</button> : <button type="button" onClick={onClose} className="w-full rounded-lg bg-[#2271b1] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#135e96]">{t("Close")}</button>}
            <p className="mt-2 text-center text-[11px] leading-4 text-[#646970]">{running ? t("You can close this window. Generation continues in the background.") : t("Published intermediate results remain saved in WordPress.")}</p>
          </div>
        </aside>
      </div>
    </section>
  </div>;
}

export function WebsiteGenerationProcessButton({ percent, label, onClick, t }: { percent: number; label: string; onClick: () => void; t: Translate }) {
  return <button type="button" onClick={onClick} aria-label={t("Open website generation progress")} className="fixed bottom-5 right-20 z-[999] flex max-w-[calc(100vw-6rem)] items-center gap-3 rounded-full border border-[#dcdcde] bg-white px-4 py-2.5 text-left text-[#1d2327] shadow-2xl transition hover:-translate-y-0.5 hover:border-[#2271b1]">
    <RefreshCw aria-hidden="true" size={16} className="shrink-0 animate-spin text-[#2271b1]" />
    <span className="min-w-0 truncate text-xs font-semibold">{label}</span>
    <strong className="shrink-0 text-sm text-[#2271b1]">{Math.min(100, Math.max(0, Math.round(percent)))}%</strong>
  </button>;
}
