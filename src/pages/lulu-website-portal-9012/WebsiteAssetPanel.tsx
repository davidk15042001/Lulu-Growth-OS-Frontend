import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { Image, Loader2, Sparkles, Upload, X, XCircle } from "lucide-react";
import { getFriendlyErrorMessage } from "../../api/client";
import { websitesApi, type ManagedWebsiteAsset, type WebsiteAssetEdit, type WebsiteSite } from "../../api/websites";
import { useTranslation } from "../../i18n/GlobalLanguageSwitcher";

const outputWidth = 1400;
const outputHeight = 900;
type CropPosition = { x: number; y: number };

function cropImage(file: File, zoom: number, position: CropPosition) {
  return new Promise<Blob>((resolve, reject) => {
    const image = new window.Image();
    const sourceUrl = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(sourceUrl);
      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const context = canvas.getContext("2d");
      if (!context) return reject(new Error("Canvas is not available"));
      const baseScale = Math.max(outputWidth / image.naturalWidth, outputHeight / image.naturalHeight);
      const scale = baseScale * zoom;
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      const maxOffsetX = Math.max(0, (drawWidth - outputWidth) / 2);
      const maxOffsetY = Math.max(0, (drawHeight - outputHeight) / 2);
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, outputWidth, outputHeight);
      context.drawImage(
        image,
        (outputWidth - drawWidth) / 2 + maxOffsetX * position.x,
        (outputHeight - drawHeight) / 2 + maxOffsetY * position.y,
        drawWidth,
        drawHeight,
      );
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("The image crop could not be created")), "image/jpeg", 0.92);
    };
    image.onerror = () => { URL.revokeObjectURL(sourceUrl); reject(new Error("The image could not be read")); };
    image.src = sourceUrl;
  });
}

const terminalEditStatuses = new Set<WebsiteAssetEdit["status"]>(["COMPLETED", "FAILED", "CANCELLED"]);

export function WebsiteAssetPanel({ workspaceId, site }: { workspaceId: string; site: WebsiteSite }) {
  const t = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<ManagedWebsiteAsset[]>([]);
  const [assetUrls, setAssetUrls] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [placement, setPlacement] = useState<ManagedWebsiteAsset["placement"]>("website");
  const [zoom, setZoom] = useState(1);
  const [cropPosition, setCropPosition] = useState<CropPosition>({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; position: CropPosition } | null>(null);
  const [busy, setBusy] = useState<"load" | "upload" | null>(null);
  const [error, setError] = useState("");
  const [activeAsset, setActiveAsset] = useState<ManagedWebsiteAsset | null>(null);
  const [prompt, setPrompt] = useState("");
  const [editJob, setEditJob] = useState<WebsiteAssetEdit | null>(null);
  const [editBusy, setEditBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy("load");
    setError("");
    try {
      const items = (await websitesApi.listAssets(workspaceId, site.id)).data.items;
      setAssets(items);
      const loadedUrls: Record<string, string> = {};
      await Promise.all(items.map(async (asset) => {
        try {
          loadedUrls[asset.id] = URL.createObjectURL(await websitesApi.getAssetBlob(workspaceId, site.id, asset.id));
        } catch {
          // Keep the card visible with its filename if a single asset is no longer available.
        }
      }));
      setAssetUrls((current) => {
        Object.values(current).forEach((url) => URL.revokeObjectURL(url));
        return loadedUrls;
      });
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t("Media could not be loaded.")));
    } finally {
      setBusy(null);
    }
  }, [workspaceId, site.id]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  useEffect(() => () => { Object.values(assetUrls).forEach((url) => URL.revokeObjectURL(url)); }, [assetUrls]);

  useEffect(() => {
    if (!editJob || terminalEditStatuses.has(editJob.status)) return undefined;
    const timer = window.setTimeout(async () => {
      try {
        const next = (await websitesApi.getAssetEdit(workspaceId, site.id, editJob.id)).data;
        setEditJob(next);
        if (next.status === "COMPLETED") {
          await load();
          setActiveAsset(null);
          setPrompt("");
        }
      } catch (cause) {
        setError(getFriendlyErrorMessage(cause, t("Image status could not be loaded.")));
      }
    }, 2400);
    return () => window.clearTimeout(timer);
  }, [editJob, load, site.id, workspaceId]);

  const choose = (next: File | null) => {
    if (!next && inputRef.current) inputRef.current.value = "";
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (!next) { setFile(null); setPreviewUrl(""); setCropPosition({ x: 0, y: 0 }); setZoom(1); return; }
    setFile(next);
    setPreviewUrl(URL.createObjectURL(next));
    setAltText(next.name.replace(/\.[^.]+$/, ""));
    setCropPosition({ x: 0, y: 0 });
    setZoom(1);
    setError("");
  };

  const startCropDrag = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startX: event.clientX, startY: event.clientY, position: cropPosition };
  };

  const moveCropDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const width = Math.max(1, event.currentTarget.clientWidth);
    const height = Math.max(1, event.currentTarget.clientHeight);
    const next = {
      x: Math.max(-1, Math.min(1, drag.position.x + ((event.clientX - drag.startX) / width) * 2)),
      y: Math.max(-1, Math.min(1, drag.position.y + ((event.clientY - drag.startY) / height) * 2)),
    };
    setCropPosition(next);
  };

  const endCropDrag = () => { dragRef.current = null; };

  const upload = async () => {
    if (!file) return;
    setBusy("upload");
    setError("");
    try {
      const cropped = await cropImage(file, zoom, cropPosition);
      const form = new FormData();
      form.append("file", new File([cropped], "lulu-cropped.jpg", { type: "image/jpeg" }));
      form.append("altText", altText);
      form.append("placement", placement);
      form.append("crop", JSON.stringify({ zoom, position: cropPosition, outputWidth, outputHeight, sourceName: file.name }));
      await websitesApi.uploadAsset(workspaceId, site.id, form);
      await load();
      choose(null);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t("The image could not be saved.")));
    } finally {
      setBusy(null);
    }
  };

  const openEditor = (asset: ManagedWebsiteAsset) => {
    setActiveAsset(asset);
    setPrompt("");
    setEditJob(null);
    setError("");
  };

  const closeEditor = () => {
    if (editBusy || (editJob && !terminalEditStatuses.has(editJob.status))) return;
    setActiveAsset(null);
    setPrompt("");
    setEditJob(null);
  };

  const startEdit = async () => {
    if (!activeAsset || prompt.trim().length < 3) return;
    setEditBusy(true);
    setError("");
    try {
      setEditJob((await websitesApi.editAsset(workspaceId, site.id, activeAsset.id, prompt.trim())).data);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t("The image could not be edited.")));
    } finally {
      setEditBusy(false);
    }
  };

  return <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">{t("Website media")}</p>
        <h2 className="mt-2 text-2xl font-semibold">{t("Upload and crop images")}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{t("Lulu saves the finished crop directly in the managed website project. Click an image to edit it with a prompt.")}</p>
      </div>
      <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary"><Upload size={15} /> {t("Choose image")}</button>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => choose(event.target.files?.[0] ?? null)} />
    </div>
    {error ? <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"><XCircle size={16} className="mt-0.5 shrink-0" />{error}</div> : null}
    {file ? <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="overflow-hidden rounded-2xl border border-border bg-secondary p-3"><div className="relative aspect-[14/9] touch-none overflow-hidden rounded-xl bg-slate-950" onPointerDown={startCropDrag} onPointerMove={moveCropDrag} onPointerUp={endCropDrag} onPointerCancel={endCropDrag} onDoubleClick={() => { setCropPosition({ x: 0, y: 0 }); setZoom(1); }}><img src={previewUrl} alt={t("Crop preview")} className="h-full w-full select-none object-cover" draggable={false} style={{ transform: `translate(${cropPosition.x * 12}%, ${cropPosition.y * 12}%) scale(${zoom})`, cursor: dragRef.current ? "grabbing" : "grab" }} /><span className="pointer-events-none absolute inset-x-3 bottom-3 rounded-lg bg-slate-950/65 px-3 py-2 text-center text-xs font-medium text-white">{t("Drag to position · double-click to reset")}</span></div><label className="mt-4 block text-sm font-medium">{t("Zoom")} <input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="mt-2 w-full" /></label><p className="mt-2 text-xs text-muted-foreground">{t("The crop is saved as a centered 14:9 website image.")}</p></div><div className="space-y-4"><label className="block text-sm font-medium">{t("Alt text")}<input value={altText} onChange={(event) => setAltText(event.target.value)} className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3" /></label><label className="block text-sm font-medium">{t("Placement")}<select value={placement} onChange={(event) => setPlacement(event.target.value as ManagedWebsiteAsset["placement"])} className="mt-2 h-10 w-full rounded-xl border border-border bg-background px-3"><option value="website">{t("Website")}</option><option value="hero">{t("Hero section")}</option><option value="gallery">{t("Gallery")}</option><option value="product">{t("Product")}</option><option value="logo">{t("Logo")}</option></select></label><div className="flex gap-2"><button type="button" onClick={() => void upload()} disabled={busy === "upload"} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy === "upload" ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} {t("Save crop")}</button><button type="button" onClick={() => choose(null)} className="rounded-xl border border-border px-3 text-sm">{t("Cancel")}</button></div></div></div> : null}
    <div className="mt-7">
      <div className="flex items-center justify-between"><h3 className="font-semibold">{t("Saved images")}</h3>{busy === "load" ? <Loader2 size={16} className="animate-spin text-muted-foreground" /> : null}</div>
      {assets.length ? <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{assets.map((asset) => <article key={asset.id} className="overflow-hidden rounded-xl border border-border bg-background"><button type="button" onClick={() => openEditor(asset)} className="group block w-full text-left" aria-label={t("Edit image {{0}}").replace("{{0}}", asset.altText || asset.fileName)}><div className="relative aspect-[14/9] overflow-hidden bg-secondary">{assetUrls[asset.id] ? <img src={assetUrls[asset.id]} alt={asset.altText || asset.fileName} className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.03]" /> : <div className="flex h-full items-center justify-center text-xs text-muted-foreground">{t("Loading image …")}</div>}<span className="absolute inset-x-2 bottom-2 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950/80 px-2 py-1.5 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"><Sparkles size={13} /> {t("Edit with prompt")}</span></div><div className="p-3 text-xs"><p className="font-semibold">{asset.altText || asset.fileName}</p><p className="mt-1 text-muted-foreground">{t(asset.placement)} · {Math.round(asset.sizeBytes / 1024)} KB</p></div></button></article>)}</div> : <div className="mt-3 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground"><Image size={22} className="mx-auto mb-2" />{t("No website images saved yet.")}</div>}
    </div>

    {activeAsset ? <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 sm:items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditor(); }}><div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-card p-5 shadow-2xl sm:rounded-3xl sm:p-7" role="dialog" aria-modal="true" aria-labelledby="website-asset-edit-title"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">{t("Edit image")}</p><h2 id="website-asset-edit-title" className="mt-1 text-xl font-semibold">{t("Describe the change")}</h2><p className="mt-1 text-sm text-muted-foreground">{t("Lulu creates a new version. The original stays unchanged.")}</p></div><button type="button" onClick={closeEditor} disabled={editBusy || Boolean(editJob && !terminalEditStatuses.has(editJob.status))} className="rounded-xl p-2 hover:bg-secondary disabled:opacity-40" aria-label={t("Close image editor")}><X size={20} /></button></div><div className="mt-5 grid gap-5 sm:grid-cols-[220px_minmax(0,1fr)]"><div className="overflow-hidden rounded-2xl border border-border bg-secondary">{assetUrls[activeAsset.id] ? <img src={assetUrls[activeAsset.id]} alt={activeAsset.altText || activeAsset.fileName} className="aspect-[14/9] h-full w-full object-cover" /> : <div className="flex aspect-[14/9] items-center justify-center text-xs text-muted-foreground">{t("Loading image …")}</div>}</div><div><label htmlFor="website-asset-edit-prompt" className="text-sm font-semibold">{t("What should change?")}</label><textarea id="website-asset-edit-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} disabled={editBusy || Boolean(editJob && !terminalEditStatuses.has(editJob.status))} placeholder={t("For example: Brighter daylight, same perspective, do not add people.")} className="mt-2 min-h-32 w-full resize-y rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary" /><p className="mt-2 text-xs text-muted-foreground">{t("Describe the subject, style, colors, and what should stay unchanged.")}</p></div></div>{editJob ? <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${editJob.status === "FAILED" ? "border-rose-200 bg-rose-50 text-rose-800" : editJob.status === "COMPLETED" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-border bg-secondary text-foreground"}`}><div className="flex items-center gap-2 font-semibold">{!terminalEditStatuses.has(editJob.status) ? <Loader2 size={15} className="animate-spin" /> : null}{editJob.status === "COMPLETED" ? t("New image version saved.") : editJob.status === "FAILED" ? t("Image editing failed.") : t("Image editing: {{0}}").replace("{{0}}", editJob.status.toLowerCase())}</div>{editJob.errorMessage ? <p className="mt-1">{editJob.errorMessage}</p> : null}</div> : null}<div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={closeEditor} disabled={editBusy || Boolean(editJob && !terminalEditStatuses.has(editJob.status))} className="h-10 rounded-xl border border-border px-4 text-sm font-semibold disabled:opacity-40">{t("Close")}</button><button type="button" onClick={() => void startEdit()} disabled={editBusy || prompt.trim().length < 3 || Boolean(editJob && !terminalEditStatuses.has(editJob.status))} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50">{editBusy ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />} {t("Edit image")}</button></div></div></div> : null}
  </section>;
}
