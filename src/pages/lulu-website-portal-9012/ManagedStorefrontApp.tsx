import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, Globe2, Image, Loader2, Package, Plus, RefreshCw, ShoppingBag, Sparkles, XCircle } from "lucide-react";
import { getSelectedWorkspaceId } from "../../api/session";
import { storefrontApi, websitesApi, type Storefront, type StorefrontProduct, type WebsiteGenerationJob, type WebsiteSite } from "../../api/websites";
import { onboardingApi } from "../../api/onboarding";
import { productsApi } from "../../api/products";
import { getFriendlyErrorMessage } from "../../api/client";
import { DomainOwnershipPanel } from "../../components/DomainOwnershipPanel";
import { WebsiteAssetPanel } from "./WebsiteAssetPanel";

export type ManagedWebsitePanel = "builder" | "preview" | "media" | "domains";

function panelFromLocation(): ManagedWebsitePanel | null {
  const value = new URLSearchParams(window.location.search).get("panel");
  if (value === "builder" || value === "preview" || value === "shop" || value === "media" || value === "domains") {
    return value === "shop" ? "preview" : value;
  }
  return null;
}

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

function TemplatePlaceholderVisual({ label, className = "" }: { label: string; className?: string }) {
  return <div className={`grid min-h-52 place-items-center rounded-2xl border border-dashed border-foreground/20 bg-gradient-to-br from-violet-100 via-background to-cyan-100 p-6 text-center ${className}`}>
    <div><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-primary/30 bg-card/75 text-2xl font-semibold text-primary">L</div><p className="mt-3 text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">{label}</p></div>
  </div>;
}

function EmptyWebsiteTemplate({ hasServices, hasProducts }: { hasServices: boolean; hasProducts: boolean }) {
  const navigation = ["Startseite", "Lösungen", ...(hasServices ? ["Leistungen"] : []), ...(hasProducts ? ["Produkte"] : []), "Über uns", "Kontakt"];
  const starterCopy = "Ein vollständiger Startpunkt für deine Marke. Lulu ersetzt diese Platzhalter später durch verifizierte Unternehmensdaten, Inhalte, Bilder und Produkte.";
  const solutionCards = [
    { number: "01", title: "Dein Unternehmen", body: "Ein klarer Einstieg, der Unternehmen, Positionierung und Angebot verständlich vorstellt." },
    ...(hasServices || hasProducts ? [{ number: "02", title: hasServices && hasProducts ? "Produkte und Leistungen" : hasServices ? "Leistungen" : "Produkte", body: hasServices && hasProducts ? "Strukturierte Bereiche für Leistungen, Produkte und die wichtigsten nächsten Schritte." : hasServices ? "Ein klarer Überblick über die angebotenen Leistungen und den nächsten Schritt." : "Ein klarer Überblick über die angebotenen Produkte und den nächsten Schritt." }] : []),
    { number: "03", title: "Vertrauen aufbauen", body: "Verifizierte Informationen, klare Abläufe und Inhalte, die Sicherheit geben." },
    { number: "04", title: "Kontakt aufnehmen", body: "Ein direkter Weg für Interessenten, Fragen zu stellen und eine Anfrage zu senden." },
  ];
  const serviceCards = ["Beratung und Lösungen", "Produkte und Services", "Individuelle Unterstützung", "Verlässliche Umsetzung"];
  const strengthCards = ["Klare Positionierung", "Verifizierte Inhalte", "Ein nachvollziehbarer Prozess"];
  const processSteps = ["Anforderungen teilen", "Passenden Ansatz prüfen", "Nächsten Schritt starten"];
  const faqs = ["Was bietet dieses Unternehmen an?", "Für wen ist das Angebot gedacht?", "Wie starten wir ein Gespräch?"];
  return <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
    <div className="border-b border-border bg-card px-5 py-4 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-sm font-bold text-background">L</span><span className="text-sm font-semibold tracking-wide">DEIN BRAND-PLATZHALTER</span></div>
        <nav aria-label="Template-Navigation" className="hidden flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground lg:flex">{navigation.map((item) => <span key={item}>{item}</span>)}</nav>
        <span className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground">VORSCHAU</span>
      </div>
    </div>

    <section className="bg-gradient-to-br from-slate-950 via-violet-950 to-cyan-900 px-5 py-12 text-white sm:px-10 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.12fr_.88fr]">
        <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan-200">LULU STARTER TEMPLATE</p><h3 className="mt-4 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Deine neue Website beginnt hier</h3><p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg">{hasProducts ? starterCopy : starterCopy.replace(", Bilder und Produkte", " und Bilder")}</p><div className="mt-8 flex flex-wrap gap-3"><span className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-semibold text-slate-950">Jetzt sprechen</span>{hasServices ? <span className="inline-flex h-11 items-center rounded-xl border border-white/35 px-5 text-sm font-semibold text-white">Leistungen ansehen</span> : null}</div></div>
        <TemplatePlaceholderVisual label="Hero-Bild wird ergänzt" className="min-h-64 border-white/25 bg-white/10 text-white sm:min-h-80" />
      </div>
    </section>

    <section className="border-b border-border bg-card px-5 py-5 sm:px-10"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-xs font-semibold uppercase tracking-[.15em] text-muted-foreground"><span>Vertrauensbasis</span><span>Verifizierte Daten</span><span>Klare Abläufe</span><span>Globale Präsenz</span><span>Persönlicher Kontakt</span></div></section>

    <section className="px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">Lösungen</p><h4 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Starke Lösungen für echte Anforderungen</h4><p className="mt-3 text-sm leading-6 text-muted-foreground">Dieser Bereich wird automatisch mit den verifizierten Informationen deines Unternehmens gefüllt.</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{solutionCards.map((card) => <article key={card.number} className="flex min-h-56 flex-col rounded-2xl border border-border bg-card p-5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">{card.number}</span><h5 className="mt-5 text-xl font-semibold">{card.title}</h5><p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{card.body}</p><span className="mt-5 text-sm font-semibold text-primary">Mehr erfahren →</span></article>)}</div></div></section>

    {hasServices ? <section className="bg-secondary/30 px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Leistungen</p><h4 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Alles Wichtige auf einen Blick</h4><p className="mt-3 text-sm leading-6 text-muted-foreground">Leistungsbereiche und Angebote werden hier übersichtlich dargestellt.</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{serviceCards.map((title) => <article key={title} className="rounded-2xl border border-border bg-background p-5"><p className="text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">Leistungsbereich</p><h5 className="mt-3 text-xl font-semibold">{title}</h5><p className="mt-2 text-sm leading-6 text-muted-foreground">Beschreibung und nächster Schritt werden aus deiner Knowledge Base übernommen.</p><span className="mt-5 inline-flex text-sm font-semibold text-primary">Ansehen →</span></article>)}</div></div></section> : null}

    {hasProducts ? <section className="px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">Produkte</p><h4 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Dein Shop-Bereich</h4><p className="mt-3 text-sm leading-6 text-muted-foreground">Produktkarten erscheinen automatisch, sobald Produkte im zentralen Katalog freigegeben sind.</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{["Produktplatzhalter 01", "Produktplatzhalter 02", "Produktplatzhalter 03", "Produktplatzhalter 04"].map((title) => <article key={title} className="overflow-hidden rounded-2xl border border-dashed border-border bg-card"><TemplatePlaceholderVisual label="Produktbild wird ergänzt" className="min-h-40 rounded-none border-0 border-b" /><div className="p-4"><p className="text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">Produkt</p><h5 className="mt-2 font-semibold">{title}</h5><p className="mt-2 text-sm text-muted-foreground">Preis auf Anfrage</p></div></article>)}</div></div></section> : null}

    <section className="bg-slate-950 px-5 py-12 text-white sm:px-10 sm:py-16"><div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.85fr_1.15fr]"><TemplatePlaceholderVisual label="Unternehmensbild wird ergänzt" className="min-h-64 border-white/20 bg-white/5 text-white" /><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan-200">Kernstärken</p><h4 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Eine Marke, die verständlich und verlässlich wirkt</h4><p className="mt-4 text-sm leading-7 text-white/70">Lulu verbindet deine echten Unternehmensdaten zu einer klaren, konsistenten digitalen Präsenz.</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{strengthCards.map((item) => <div key={item} className="rounded-xl border border-white/15 bg-white/5 p-4 text-sm font-medium">{item}</div>)}</div></div></div></section>

    <section className="px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2"><TemplatePlaceholderVisual label="Galeriebild wird ergänzt" className="min-h-72" /><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Über dein Unternehmen</p><h4 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Von der ersten Information bis zum nächsten Schritt</h4><p className="mt-4 text-sm leading-7 text-muted-foreground">Dieses Modul erklärt später, wofür dein Unternehmen steht, wem du hilfst und wie Besucher mit dir arbeiten können.</p><ul className="mt-6 grid gap-3 sm:grid-cols-2">{["Positionierung", "Zielgruppen", "Angebot", "Ablauf", "Kontakt", "Vertrauen"].map((item) => <li key={item} className="flex items-center gap-2 text-sm font-medium"><span className="h-2 w-2 rounded-full bg-primary" />{item}</li>)}</ul></div></div></section>

    <section className="bg-secondary/30 px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Klarer Prozess</p><h4 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">So funktioniert es</h4><p className="mt-3 text-sm leading-6 text-muted-foreground">Ein klarer Ablauf hält Anforderungen, Entscheidungen und nächste Schritte nachvollziehbar.</p></div><div className="mt-8 grid gap-4 md:grid-cols-3">{processSteps.map((title, index) => <article key={title} className="rounded-2xl border border-border bg-card p-5"><span className="text-xs font-bold text-primary">0{index + 1}</span><h5 className="mt-4 text-xl font-semibold">{title}</h5><p className="mt-2 text-sm leading-6 text-muted-foreground">Ein kurzer, verständlicher Abschnitt mit den verifizierten Details deines Unternehmens.</p></article>)}</div></div></section>

    <section className="px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto max-w-6xl rounded-3xl bg-primary p-7 text-primary-foreground sm:p-10"><div className="grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-center"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-primary-foreground/75">Kontakt und Vertrauen</p><h4 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Bereit für den nächsten Schritt?</h4><p className="mt-4 max-w-xl text-sm leading-7 text-primary-foreground/80">Besucher sehen hier eine klare Einladung, ihre Anforderungen zu teilen und direkt Kontakt aufzunehmen.</p><span className="mt-6 inline-flex h-11 items-center rounded-xl bg-background px-5 text-sm font-semibold text-foreground">Kontakt aufnehmen</span></div><div className="rounded-2xl border border-primary-foreground/25 bg-primary-foreground/10 p-5"><p className="text-sm font-semibold">Hilfreiche Informationen</p><ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">{["Was du brauchst", "Für wen die Anfrage ist", "Gewünschter Zeitrahmen", "Relevante Dateien"].map((item) => <li key={item} className="border-b border-primary-foreground/20 pb-2 last:border-0">{item}</li>)}</ul></div></div></div></section>

    <section className="px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">Nachricht senden</p><h4 className="mt-2 text-3xl font-semibold tracking-[-.04em]">Kontaktformular</h4><p className="mt-3 text-sm leading-6 text-muted-foreground">Ein einfacher, sicherer Weg für eine erste Anfrage.</p></div><div className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2"><label className="text-sm font-medium">Name<input disabled placeholder="Name" className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" /></label><label className="text-sm font-medium">E-Mail<input disabled placeholder="E-Mail" className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" /></label><label className="text-sm font-medium sm:col-span-2">Nachricht<textarea disabled placeholder="Nachricht" rows={4} className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm" /></label><span className="inline-flex h-11 w-fit items-center rounded-xl bg-foreground px-5 text-sm font-semibold text-background">Nachricht senden</span></div></div></section>

    <section className="bg-secondary/30 px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">FAQ</p><h4 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Häufige Fragen</h4><div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card px-5">{faqs.map((question) => <details key={question} className="py-5"><summary className="cursor-pointer font-semibold">{question}</summary><p className="mt-3 text-sm leading-6 text-muted-foreground">Die Antwort wird aus den verifizierten Informationen deines Unternehmens erzeugt und hier angezeigt.</p></details>)}</div></div></section>

    <section className="border-t border-border bg-slate-950 px-5 py-12 text-center text-white sm:px-10 sm:py-16"><h4 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Deine Marke kann hier starten.</h4><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/70">Erstelle die Website im Editor. Lulu füllt dieses Template anschließend mit deinen geprüften Inhalten.</p><span className="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-semibold text-slate-950">Website erstellen</span></section>
    <footer className="flex flex-col gap-4 border-t border-border bg-card px-5 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10"><span className="font-semibold text-foreground">DEIN BRAND-PLATZHALTER</span><span>Datenschutz · Impressum · Kontakt</span><span>Powered by Lulu AI</span></footer>

    <div className="border-t border-border px-5 py-4 text-sm text-muted-foreground sm:px-10"><span className="font-semibold text-foreground">Noch keine Website veröffentlicht.</span> Die Vorschau zeigt bewusst das vollständige Lulu-Standard-Template. Erstelle deine Website im Editor, sobald du bereit bist.</div>
  </div>;
}

export default function ManagedStorefrontApp({ initialPanel }: { initialPanel?: ManagedWebsitePanel } = {}) {
  const workspaceId = getSelectedWorkspaceId();
  const [sites, setSites] = useState<WebsiteSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<WebsiteSite | null>(null);
  const [storefront, setStorefront] = useState<Storefront | null>(null);
  const [job, setJob] = useState<WebsiteGenerationJob | null>(null);
  const [siteName, setSiteName] = useState("Meine Lulu Website & Shop");
  const [prompt, setPrompt] = useState("Erstelle eine vertrauenswürdige globale Website mit integriertem Online-Shop für mein Unternehmen. Nutze ausschließlich verifizierte Unternehmens- und Produktdaten.");
  const [panel, setPanel] = useState<ManagedWebsitePanel>(() => initialPanel ?? panelFromLocation() ?? "builder");
  const [busy, setBusy] = useState<"create" | "generate" | "publish" | "refresh" | null>(null);
  const [error, setError] = useState("");
  const [catalogPresence, setCatalogPresence] = useState({ hasServices: false, hasProducts: false });

  const load = async () => {
    if (!workspaceId) return;
    setBusy("refresh"); setError("");
    try {
      const [result, onboardingResult, productsResult] = await Promise.all([
        websitesApi.list(workspaceId),
        onboardingApi.snapshot(workspaceId).catch(() => null),
        productsApi.list(workspaceId, "limit=100").catch(() => null),
      ]);
      const activeOffering = (status: string) => !["archived", "inactive", "deleted"].includes(status.trim().toLowerCase());
      const publicProduct = (product: { status: string; productType?: string; visibility?: unknown }) => product.status.trim().toLowerCase() === "active"
        && String(product.visibility ?? "public").trim().toLowerCase() === "public"
        && String(product.productType ?? "").trim().toLowerCase() !== "service";
      const offerings = onboardingResult?.data.offerings ?? [];
      const hasServices = offerings.some((offering) => offering.offeringType === "service" && activeOffering(offering.status));
      const hasProducts = offerings.some((offering) => offering.offeringType === "product" && activeOffering(offering.status))
        || (productsResult?.data.items ?? []).some((product) => publicProduct(product));
      setCatalogPresence({ hasServices, hasProducts });
      const managed = result.data.items.filter((site) => site.provider === "managed");
      setSites(managed);
      const next = managed.find((site) => site.id === selectedSite?.id) ?? managed[0] ?? null;
      setSelectedSite(next);
      setStorefront(null);
      setJob(null);
      if (next) {
        const active = await websitesApi.getActiveGenerationJob(workspaceId, next.id);
        setJob(active.data);
        if (next.status === "published") {
          const slug = typeof next.settings?.managedWebsite === "object" && next.settings.managedWebsite && typeof (next.settings.managedWebsite as Record<string, unknown>).publicSlug === "string" ? String((next.settings.managedWebsite as Record<string, unknown>).publicSlug) : `site-${next.id.slice(0, 8)}`;
          try {
            const nextStorefront = (await storefrontApi.get(slug)).data;
            setStorefront(nextStorefront);
            if (nextStorefront.products.length > 0) setCatalogPresence((current) => ({ ...current, hasProducts: true }));
          } catch { setStorefront(null); }
        }
      }
    } catch (requestError) { setError(getFriendlyErrorMessage(requestError, "Die Lulu-Website konnte nicht geladen werden.")); }
    finally { setBusy(null); }
  };

  useEffect(() => { void load(); }, [workspaceId]);

  useEffect(() => {
    const syncPanel = () => setPanel(initialPanel ?? panelFromLocation() ?? "builder");
    window.addEventListener("popstate", syncPanel);
    return () => window.removeEventListener("popstate", syncPanel);
  }, [initialPanel]);

  const setActivePanel = (next: ManagedWebsitePanel) => {
    setPanel(next);
    const url = new URL(window.location.href);
    url.searchParams.set("panel", next);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  };

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
    <nav className="flex flex-wrap gap-2 rounded-2xl border border-border bg-card p-2"><button type="button" onClick={() => setActivePanel("builder")} className={`rounded-xl px-4 py-2 text-sm font-semibold ${panel === "builder" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary"}`}><Sparkles size={15} className="mr-2 inline" />Website bearbeiten</button><button type="button" onClick={() => setActivePanel("preview")} className={`rounded-xl px-4 py-2 text-sm font-semibold ${panel === "preview" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary"}`}><ShoppingBag size={15} className="mr-2 inline" />Vorschau</button><button type="button" onClick={() => setActivePanel("media")} className={`rounded-xl px-4 py-2 text-sm font-semibold ${panel === "media" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary"}`}><Image size={15} className="mr-2 inline" />Medien</button><button type="button" onClick={() => setActivePanel("domains")} className={`rounded-xl px-4 py-2 text-sm font-semibold ${panel === "domains" ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary"}`}><Globe2 size={15} className="mr-2 inline" />Domain</button></nav>
    {panel === "builder" ? <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,.75fr)]"><div className="space-y-6"><section className="rounded-2xl border border-border bg-card p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">Lulu Managed Hosting</p><h2 className="mt-2 text-2xl font-semibold">Deine eigene Website</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Ein kontrolliertes Template, verifizierte Unternehmensdaten und echte Veröffentlichungsstatus – keine simulierten Provider-Aktionen.</p></div><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Globe2 size={22} /></span></div>{!selectedSite ? <div className="mt-6 space-y-4"><label className="block text-sm font-medium">Name der Website<input value={siteName} onChange={(event) => setSiteName(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 outline-none focus:border-primary" /></label><button type="button" onClick={() => void createManagedSite()} disabled={busy === "create" || !siteName.trim()} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy === "create" ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Lulu-Website erstellen</button></div> : <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-border bg-background p-4"><p className="text-xs uppercase tracking-[.12em] text-muted-foreground">Status</p><p className="mt-2 flex items-center gap-2 font-semibold"><span className={`h-2.5 w-2.5 rounded-full ${selectedSite.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`} />{statusLabel(selectedSite.status)}</p></div><div className="rounded-xl border border-border bg-background p-4"><p className="text-xs uppercase tracking-[.12em] text-muted-foreground">Template</p><p className="mt-2 font-semibold">{String((activePlan as Record<string, unknown> | undefined)?.templateKey ?? "lulu-standard-v1")}</p></div><div className="rounded-xl border border-border bg-background p-4"><p className="text-xs uppercase tracking-[.12em] text-muted-foreground">Shop-Produkte</p><p className="mt-2 flex items-center gap-2 font-semibold"><Package size={16} />{storefront?.products.length ?? "—"}</p></div></div>}</section>{selectedSite ? <section className="rounded-2xl border border-border bg-card p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">AI Website & Shop Plan</p><h2 className="mt-2 text-xl font-semibold">Inhalte aus deinem Unternehmen</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Lulu nutzt Profil, Knowledge Base und kanonische Produkte. Fehlende Premium-Bilder werden später als Asset-Aufgaben ergänzt.</p></div>{job?.status === "published" ? <CheckCircle2 className="text-emerald-600" /> : null}</div><label className="mt-5 block text-sm font-medium">Anweisung für Lulu<textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={5} className="mt-2 w-full resize-y rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary" /></label><div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => void generate()} disabled={busy === "generate" || ["queued", "planning", "publishing"].includes(job?.status ?? "")} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy === "generate" || ["queued", "planning", "publishing"].includes(job?.status ?? "") ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Website & Shop generieren</button>{job && ["preview", "generated"].includes(job.status) ? <button type="button" onClick={() => void publish()} disabled={busy === "publish"} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-5 text-sm font-semibold text-emerald-800 disabled:opacity-60">{busy === "publish" ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Veröffentlichen</button> : null}{job?.status === "failed" ? <p className="self-center text-sm text-rose-700">Die Generierung wurde angehalten: {job.errorMessage || "Bitte Anforderungen und Knowledge Base prüfen."}</p> : null}</div>{job ? <p className="mt-4 text-xs text-muted-foreground">Letzter Lauf: {statusLabel(job.status)} · {new Date(job.updatedAt).toLocaleString()}</p> : null}</section> : null}</div><aside className="rounded-2xl border border-border bg-card p-5 sm:p-7"><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">Ein System</p><h2 className="mt-2 text-xl font-semibold">Was Lulu automatisch übernimmt</h2><div className="mt-5 space-y-4">{["Template mit verifizierten Firmendaten füllen", "Produkte aus dem zentralen Katalog anzeigen", "Fehlende Bildbereiche erkennen", "Website und Shop als eine Marke veröffentlichen", "Domainbesitz prüfen und sichere Aktivierung verlangen"].map((item) => <div key={item} className="flex gap-3 text-sm leading-6"><CheckCircle2 size={17} className="mt-1 shrink-0 text-emerald-600" />{item}</div>)}</div></aside></section> : null}
    {panel === "preview" ? <section className="space-y-6"><div className="rounded-2xl border border-border bg-card p-5 sm:p-7"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">Lulu Storefront</p><h2 className="mt-2 text-2xl font-semibold">Website-Vorschau</h2><p className="mt-2 text-sm text-muted-foreground">So sehen Kunden deine veröffentlichte Website. Leistungen und Produkte werden nur angezeigt, wenn sie wirklich vorhanden sind.</p></div>{publicSlug && storefront ? <a href={`/api/v1/public/storefront/${encodeURIComponent(publicSlug)}/render`} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary">Öffnen <ExternalLink size={15} /></a> : null}</div>{!selectedSite || !storefront ? <EmptyWebsiteTemplate {...catalogPresence} /> : null}{storefront?.products.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{storefront.products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : storefront ? <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">Noch keine öffentlich freigegebenen Produkte. Veröffentliche zuerst die Website im Editor.</div> : null}</div></section> : null}
    {panel === "media" ? <section className="space-y-6">{selectedSite ? <WebsiteAssetPanel workspaceId={workspaceId ?? ""} site={selectedSite} /> : <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">Erstelle zuerst deine Lulu-Website.</div>}</section> : null}
    {panel === "domains" ? <section className="space-y-6">{selectedSite ? <DomainOwnershipPanel key={selectedSite.id} site={selectedSite} /> : <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">Erstelle zuerst deine Lulu-Website.</div>}<div className="rounded-2xl border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">DNS-Ablauf:</strong> Lulu prüft den Domainbesitz über TXT. Danach zeigt Lulu den CNAME/ALIAS-Eintrag für die Veröffentlichung. DNS wird nicht ohne ausdrückliche Berechtigung des Kunden verändert.</div></section> : null}
  </div></main>;
}
