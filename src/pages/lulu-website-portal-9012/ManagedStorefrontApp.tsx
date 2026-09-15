import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, Globe2, Image, Loader2, Package, Plus, RefreshCw, ShoppingBag, Sparkles, XCircle } from "lucide-react";
import { getSelectedWorkspaceId } from "../../api/session";
import { storefrontApi, websitesApi, type Storefront, type StorefrontProduct, type WebsiteGenerationJob, type WebsiteSite } from "../../api/websites";
import { getFriendlyErrorMessage } from "../../api/client";
import { DomainOwnershipPanel } from "../../components/DomainOwnershipPanel";
import { WebsiteAssetPanel } from "./WebsiteAssetPanel";

type Panel = "builder" | "shop" | "media" | "domains";

function statusLabel(status: string) {
  const values: Record<string, string> = { draft: "Entwurf", generating: "Wird erstellt", preview: "Vorschau bereit", publishing: "Wird veröffentlicht", published: "Veröffentlicht", error: "Fehler" };
  return values[status] ?? status;
}

function ProductCard({ product }: { product: StorefrontProduct }) {
  return <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
    {product.imageUrl ? <img src={product.imageUrl} alt={product.imageAlt || product.name} className="aspect-[4/3] w-full object-cover" /> : <div className="grid aspect-[4/3] place-items-center bg-secondary text-muted-foreground"><Image size={28} /></div>}
    <div className="p-4"><p className="text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">{product.category || "Produkt"}</p><h3 className="mt-1 font-semibold text-foreground">{product.name}</h3><p className="mt-2 line-clamp-3 text-sm leading-5 text-muted-foreground">{product.shortDescription || product.longDescription || "Noch keine Produktbeschreibung vorhanden."}</p><div className="mt-4 font-semibold text-foreground">{product.price ? `${product.price} ${product.currency || ""}` : "Preis auf Anfrage"}</div></div>
  </article>;
}

export default function ManagedStorefrontApp() {
  const workspaceId = getSelectedWorkspaceId();
  const [sites, setSites] = useState<WebsiteSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<WebsiteSite | null>(null);
  const [storefront, setStorefront] = useState<Storefront | null>(null);
  const [job, setJob] = useState<WebsiteGenerationJob | null>(null);
  const [siteName, setSiteName] = useState("Meine Lulu Website & Shop");
  const [prompt, setPrompt] = useState("Erstelle eine vertrauenswürdige globale Website mit integriertem Online-Shop für mein Unternehmen. Nutze ausschließlich verifizierte Unternehmens- und Produktdaten.");
  const [panel, setPanel] = useState<Panel>("builder");
  const [busy, setBusy] = useState<"create" | "generate" | "publish" | "refresh" | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    if (!workspaceId) return;
    setBusy("refresh"); setError("");
    try {
      const result = await websitesApi.list(workspaceId);
      const managed = result.data.items.filter((site) => site.provider === "managed");
      setSites(managed);
      const next = managed.find((site) => site.id === selectedSite?.id) ?? managed[0] ?? null;
      setSelectedSite(next);
      if (next) {
        const active = await websitesApi.getActiveGenerationJob(workspaceId, next.id);
        setJob(active.data);
        if (next.status === "published") {
          const slug = typeof next.settings?.managedWebsite === "object" && next.settings.managedWebsite && typeof (next.settings.managedWebsite as Record<string, unknown>).publicSlug === "string" ? String((next.settings.managedWebsite as Record<string, unknown>).publicSlug) : `site-${next.id.slice(0, 8)}`;
          try { setStorefront((await storefrontApi.get(slug)).data); } catch { setStorefront(null); }
        }
      }
    } catch (requestError) { setError(getFriendlyErrorMessage(requestError, "Die Lulu-Website konnte nicht geladen werden.")); }
    finally { setBusy(null); }
  };

  useEffect(() => { void load(); }, [workspaceId]);

  useEffect(() => {
    if (!workspaceId || !selectedSite || !job || !["queued", "planning", "publishing"].includes(job.status)) return;
    const timer = window.setInterval(() => { void websitesApi.getGenerationJob(workspaceId, selectedSite.id, job.id).then((response) => setJob(response.data)).catch(() => undefined); }, 2_000);
    return () => window.clearInterval(timer);
  }, [workspaceId, selectedSite?.id, job?.id, job?.status]);

  const createManagedSite = async () => {
    if (!workspaceId) return;
    setBusy("create"); setError("");
    try {
      const response = await websitesApi.create(workspaceId, { provider: "managed", ownershipMode: "managed", name: siteName });
      setSelectedSite(response.data); setSites((current) => [response.data, ...current]);
    } catch (requestError) { setError(getFriendlyErrorMessage(requestError, "Die Lulu-Website konnte nicht erstellt werden.")); }
    finally { setBusy(null); }
  };

  const generate = async () => {
    if (!workspaceId || !selectedSite) return;
    setBusy("generate"); setError("");
    try { const response = await websitesApi.createGenerationJob(workspaceId, selectedSite.id, prompt); setJob(response.data); setSelectedSite({ ...selectedSite, status: "generating" }); }
    catch (requestError) { setError(getFriendlyErrorMessage(requestError, "Lulu konnte die Website noch nicht erstellen.")); }
    finally { setBusy(null); }
  };

  const publish = async () => {
    if (!workspaceId || !selectedSite || !job) return;
    setBusy("publish"); setError("");
    try { const response = await websitesApi.publishGenerationJob(workspaceId, selectedSite.id, job.id); setJob(response.data); setSelectedSite({ ...selectedSite, status: "published", settings: { ...selectedSite.settings, managedWebsite: response.data.providerResult } }); await load(); }
    catch (requestError) { setError(getFriendlyErrorMessage(requestError, "Die Lulu-Website konnte nicht veröffentlicht werden.")); }
    finally { setBusy(null); }
  };

  const activePlan = useMemo(() => (job?.plan && typeof job.plan === "object" ? job.plan : storefront?.plan), [job?.plan, storefront?.plan]);
  const publicSlug = storefront?.slug ?? (selectedSite ? `site-${selectedSite.id.slice(0, 8)}` : "");

  return <main className="min-h-screen bg-[var(--background)] px-5 py-7 text-foreground sm:px-8 sm:py-10"><div className="mx-auto max-w-[1400px] space-y-6">
    <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">Lulu AI / Online Presence</p><h1 className="mt-2 text-4xl font-semibold tracking-[-.05em]">Website & Shop</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">Lulu erstellt, veröffentlicht und betreibt deine Website und deinen Online-Shop selbst. WordPress, Webflow und Shopify sind dafür nicht erforderlich.</p></div><button type="button" onClick={() => void load()} disabled={busy === "refresh"} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium hover:bg-secondary disabled:opacity-60"><RefreshCw size={15} className={busy === "refresh" ? "animate-spin" : ""} /> Aktualisieren</button></header>
    {error ? <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"><XCircle size={17} className="mt-0.5 shrink-0" />{error}</div> : null}
    <nav className="flex flex-wrap gap-2 rounded-2xl border border-border bg-card p-2"><button type="button" onClick={() => setPanel("builder")} className={`rounded-xl px-4 py-2 text-sm font-semibold ${panel === "builder" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary"}`}><Sparkles size={15} className="mr-2 inline" />Builder</button><button type="button" onClick={() => setPanel("shop")} className={`rounded-xl px-4 py-2 text-sm font-semibold ${panel === "shop" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary"}`}><ShoppingBag size={15} className="mr-2 inline" />Shop-Vorschau</button><button type="button" onClick={() => setPanel("media")} className={`rounded-xl px-4 py-2 text-sm font-semibold ${panel === "media" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary"}`}><Image size={15} className="mr-2 inline" />Medien</button><button type="button" onClick={() => setPanel("domains")} className={`rounded-xl px-4 py-2 text-sm font-semibold ${panel === "domains" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary"}`}><Globe2 size={15} className="mr-2 inline" />Domain</button></nav>
    {panel === "builder" ? <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,.75fr)]"><div className="space-y-6"><section className="rounded-2xl border border-border bg-card p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">Lulu Managed Hosting</p><h2 className="mt-2 text-2xl font-semibold">Deine eigene Website</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Ein kontrolliertes Template, verifizierte Unternehmensdaten und echte Veröffentlichungsstatus – keine simulierten Provider-Aktionen.</p></div><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Globe2 size={22} /></span></div>{!selectedSite ? <div className="mt-6 space-y-4"><label className="block text-sm font-medium">Name der Website<input value={siteName} onChange={(event) => setSiteName(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 outline-none focus:border-primary" /></label><button type="button" onClick={() => void createManagedSite()} disabled={busy === "create" || !siteName.trim()} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy === "create" ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Lulu-Website erstellen</button></div> : <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-border bg-background p-4"><p className="text-xs uppercase tracking-[.12em] text-muted-foreground">Status</p><p className="mt-2 flex items-center gap-2 font-semibold"><span className={`h-2.5 w-2.5 rounded-full ${selectedSite.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`} />{statusLabel(selectedSite.status)}</p></div><div className="rounded-xl border border-border bg-background p-4"><p className="text-xs uppercase tracking-[.12em] text-muted-foreground">Template</p><p className="mt-2 font-semibold">{String((activePlan as Record<string, unknown> | undefined)?.templateKey ?? "lulu-standard-v1")}</p></div><div className="rounded-xl border border-border bg-background p-4"><p className="text-xs uppercase tracking-[.12em] text-muted-foreground">Shop-Produkte</p><p className="mt-2 flex items-center gap-2 font-semibold"><Package size={16} />{storefront?.products.length ?? "—"}</p></div></div>}</section>{selectedSite ? <section className="rounded-2xl border border-border bg-card p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">AI Website & Shop Plan</p><h2 className="mt-2 text-xl font-semibold">Inhalte aus deinem Unternehmen</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Lulu nutzt Profil, Knowledge Base und kanonische Produkte. Fehlende Premium-Bilder werden später als Asset-Aufgaben ergänzt.</p></div>{job?.status === "published" ? <CheckCircle2 className="text-emerald-600" /> : null}</div><label className="mt-5 block text-sm font-medium">Anweisung für Lulu<textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={5} className="mt-2 w-full resize-y rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary" /></label><div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => void generate()} disabled={busy === "generate" || ["queued", "planning", "publishing"].includes(job?.status ?? "")} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy === "generate" || ["queued", "planning", "publishing"].includes(job?.status ?? "") ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Website & Shop generieren</button>{job && ["preview", "generated"].includes(job.status) ? <button type="button" onClick={() => void publish()} disabled={busy === "publish"} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-5 text-sm font-semibold text-emerald-800 disabled:opacity-60">{busy === "publish" ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Veröffentlichen</button> : null}{job?.status === "failed" ? <p className="self-center text-sm text-rose-700">Die Generierung wurde angehalten: {job.errorMessage || "Bitte Anforderungen und Knowledge Base prüfen."}</p> : null}</div>{job ? <p className="mt-4 text-xs text-muted-foreground">Letzter Lauf: {statusLabel(job.status)} · {new Date(job.updatedAt).toLocaleString()}</p> : null}</section> : null}</div><aside className="rounded-2xl border border-border bg-card p-5 sm:p-7"><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">Ein System</p><h2 className="mt-2 text-xl font-semibold">Was Lulu automatisch übernimmt</h2><div className="mt-5 space-y-4">{["Template mit verifizierten Firmendaten füllen", "Produkte aus dem zentralen Katalog anzeigen", "Fehlende Bildbereiche erkennen", "Website und Shop als eine Marke veröffentlichen", "Domainbesitz prüfen und sichere Aktivierung verlangen"].map((item) => <div key={item} className="flex gap-3 text-sm leading-6"><CheckCircle2 size={17} className="mt-1 shrink-0 text-emerald-600" />{item}</div>)}</div></aside></section> : null}
    {panel === "shop" ? <section className="space-y-6"><div className="rounded-2xl border border-border bg-card p-5 sm:p-7"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">Lulu Storefront</p><h2 className="mt-2 text-2xl font-semibold">Shop-Vorschau</h2><p className="mt-2 text-sm text-muted-foreground">Die Vorschau liest aus deinem kanonischen Produkt- und Lagerbestand.</p></div>{publicSlug ? <a href={`/api/v1/public/storefront/${encodeURIComponent(publicSlug)}/render`} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary">Öffnen <ExternalLink size={15} /></a> : null}</div>{storefront?.products.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{storefront.products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">Noch keine öffentlich freigegebenen Produkte. Aktiviere Produkte im zentralen Produktbereich.</div>}</div></section> : null}
    {panel === "media" ? <section className="space-y-6">{selectedSite ? <WebsiteAssetPanel workspaceId={workspaceId ?? ""} site={selectedSite} /> : <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">Erstelle zuerst deine Lulu-Website.</div>}</section> : null}
    {panel === "domains" ? <section className="space-y-6">{selectedSite ? <DomainOwnershipPanel key={selectedSite.id} site={selectedSite} /> : <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">Erstelle zuerst deine Lulu-Website.</div>}<div className="rounded-2xl border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">DNS-Ablauf:</strong> Lulu prüft den Domainbesitz über TXT. Danach zeigt Lulu den CNAME/ALIAS-Eintrag für die Veröffentlichung. DNS wird nicht ohne ausdrückliche Berechtigung des Kunden verändert.</div></section> : null}
  </div></main>;
}
