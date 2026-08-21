import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { clearSelectedWorkspaceId, getSelectedWorkspaceId } from "../../api/session";
import { websitesApi, type WebsiteGenerationJob, type WebsiteSite } from "../../api/websites";
import { onboardingApi, type Platform } from "../../api/onboarding";
import { authApi } from "../../api/auth";
import { getFriendlyErrorMessage, getTechnicalErrorDetails } from "../../api/client";
import {
  ArrowRight,
  FileEdit,
  Globe2,
  Image,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  PenLine,
  Plus,
  RefreshCw,
  Search,
  Settings,
  X,
} from "lucide-react";
import { pageLinkProps } from "../../routing";
import { LuluSectionNavigation } from "../fancily-leaf-1766/components/generated/LuluExecutiveDashboard";

type Provider = "wordpress" | "webflow";

function ViewportPortal({ children }: { children: ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

function platformMatchesProvider(platform: Platform, provider: Provider) {
  const key = (platform.integrationKey ?? "").toLowerCase();
  const name = platform.name.toLowerCase();
  return key.includes(provider) || (provider === "wordpress" ? name.includes("wordpress") || name.includes("jetpack") : name.includes("webflow"));
}

function platformIsConnected(platform: Platform) {
  const status = platform.connectionStatus.toLowerCase();
  return ["connected", "active", "enabled", "authorized", "connected_with_warning"].includes(status);
}

const providerOptions: Array<{ id: Provider; label: string; description: string }> = [
  { id: "wordpress", label: "WordPress / Jetpack", description: "Seiten, Beiträge und Medien" },
  { id: "webflow", label: "Webflow", description: "Seiten, CMS und Assets" },
];

const providerContent: Record<Provider, {
  label: string;
  shortLabel: string;
  description: string;
  connectDescription: string;
  metrics: Array<{ label: string; value: string; hint: string; icon: typeof LayoutDashboard }>;
  actions: Array<{ title: string; description: string; icon: typeof Plus }>;
}> = {
  wordpress: {
    label: "WordPress / Jetpack",
    shortLabel: "WordPress",
    description: "Verwalte deine WordPress.com- oder Jetpack-Website mit Lulu AI — von der ersten Idee bis zur bestätigten Veröffentlichung.",
    connectDescription: "Verbinde WordPress.com oder Jetpack, um Seiten, Beiträge und Medien zu verwalten.",
    metrics: [
      { label: "Seiten", value: "0", hint: "Wird nach der Verbindung geladen", icon: LayoutDashboard },
      { label: "Beiträge", value: "0", hint: "Wird nach der Verbindung geladen", icon: PenLine },
      { label: "Medien", value: "0", hint: "Wird nach der Verbindung geladen", icon: Image },
      { label: "Entwürfe", value: "0", hint: "Wird nach der Verbindung geladen", icon: FileEdit },
    ],
    actions: [
      { title: "Neue Seite erstellen", description: "Lulu erstellt eine Seitenstruktur und einen ersten Textentwurf.", icon: Plus },
      { title: "Website analysieren", description: "Prüfe Inhalte, Struktur und Conversion-Potenziale deiner Website.", icon: Search },
      { title: "Medien organisieren", description: "Ordne Bilder und Dateien deinen Website-Inhalten zu.", icon: Image },
    ],
  },
  webflow: {
    label: "Webflow",
    shortLabel: "Webflow",
    description: "Verwalte deine Webflow-Website mit Lulu AI — von Seiten und CMS-Inhalten bis zur kontrollierten Veröffentlichung.",
    connectDescription: "Verbinde Webflow, um Seiten, CMS-Collections und Assets zu verwalten.",
    metrics: [
      { label: "Seiten", value: "0", hint: "Wird nach der Verbindung geladen", icon: LayoutDashboard },
      { label: "CMS-Inhalte", value: "0", hint: "Wird nach der Verbindung geladen", icon: PenLine },
      { label: "Assets", value: "0", hint: "Wird nach der Verbindung geladen", icon: Image },
      { label: "Entwürfe", value: "0", hint: "Wird nach der Verbindung geladen", icon: FileEdit },
    ],
    actions: [
      { title: "Neue Webflow-Seite planen", description: "Lulu erstellt eine Seitenstruktur für deine Webflow-Website.", icon: Plus },
      { title: "Webflow analysieren", description: "Prüfe Seitenstruktur, CMS-Inhalte und Conversion-Potenziale.", icon: Search },
      { title: "Assets organisieren", description: "Ordne Webflow-Assets und bereite sie für Inhalte vor.", icon: Image },
    ],
  },
};

export default function App() {
  const sectionParam = new URLSearchParams(window.location.search).get("section") ?? "";
  const sectionLabels: Record<string, string> = {
    "wordpress-jetpack-9013": "WordPress / Jetpack",
    "webflow-9014": "Webflow",
    "pages-cms-9015": "Pages & CMS",
    "posts-9016": "Posts",
    "media-assets-9017": "Media & Assets",
    "domains-9018": "Domains",
    "settings-9019": "Website Settings",
  };
  const initialProvider: Provider = sectionParam.startsWith("webflow") ? "webflow" : "wordpress";
  const [mobileNav, setMobileNav] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(sectionLabels[sectionParam] ?? "Übersicht");
  const [provider, setProvider] = useState<Provider>(initialProvider);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sites, setSites] = useState<WebsiteSite[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [connectionBusy, setConnectionBusy] = useState<Provider | null>(null);
  const [generationJob, setGenerationJob] = useState<{ siteId: string; job: WebsiteGenerationJob; provider: Provider } | null>(null);
  const [generationStarting, setGenerationStarting] = useState<Provider | null>(null);
  const [generationFailure, setGenerationFailure] = useState<{ provider: Provider; message: string } | null>(null);
  const [error, setError] = useState("");
  const [oauthHelpVisible, setOauthHelpVisible] = useState(false);
  const autoStartedRef = useRef("");
  const oauthReturnRef = useRef<Provider | null>(null);
  const workspaceId = getSelectedWorkspaceId();
  const content = useMemo(() => providerContent[provider], [provider]);
  const selectedSite = sites.find((site) => site.id === selectedSiteId) ?? sites.find((site) => site.provider === provider);
  const connectedPlatform = platforms.find((platform) => platformMatchesProvider(platform, provider));
  const providerConnected = Boolean(connectedPlatform && platformIsConnected(connectedPlatform));
  const providerAuthorized = Boolean(connectedPlatform && ["pending", "connected", "active", "enabled", "authorized", "connected_with_warning"].includes(connectedPlatform.connectionStatus.toLowerCase()));
  const connected = Boolean(selectedSite && providerConnected);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("oauthError");
    const oauthCode = params.get("oauthCode");
    const connectedProvider = params.get("connected");
    const oauthRequestId = params.get("oauthRequestId");
    if (!oauthError && !oauthCode && !connectedProvider) return;
    if (oauthError) {
      const providerLabel = provider === "wordpress" ? "WordPress.com" : "Webflow";
      setError(`${providerLabel}-Verbindung: ${oauthError}${oauthRequestId ? ` (Request-ID: ${oauthRequestId})` : ""}`);
      setOauthHelpVisible(provider === "wordpress");
      setGenerationStarting(null);
      setGenerationJob(null);
      setGenerationFailure({ provider, message: `${provider === "wordpress" ? "WordPress.com" : "Webflow"}-Verbindung fehlgeschlagen: ${oauthError}` });
    } else if (oauthCode || connectedProvider) {
      const returnedProvider: Provider = connectedProvider === "webflow" || provider === "webflow" ? "webflow" : "wordpress";
      oauthReturnRef.current = returnedProvider;
      autoStartedRef.current = "";
      setGenerationJob(null);
      setGenerationFailure(null);
      setGenerationStarting(returnedProvider);
    }
    const cleanUrl = `${window.location.pathname}${window.location.search.replace(/([?&])(oauthCode|oauthError|oauthRequestId|connected)=[^&]*/g, "").replace(/[?&]$/, "")}${window.location.hash}`;
    window.history.replaceState({}, "", cleanUrl);
  }, [provider]);

  useEffect(() => {
    const syncSectionFromUrl = () => {
      const nextSection = new URLSearchParams(window.location.search).get("section") ?? "";
      const nextProvider: Provider = nextSection.startsWith("webflow") ? "webflow" : "wordpress";
      setActiveSection(sectionLabels[nextSection] ?? "Übersicht");
      if (nextSection.startsWith("webflow") || nextSection.startsWith("wordpress")) setProvider(nextProvider);
    };
    syncSectionFromUrl();
    window.addEventListener("popstate", syncSectionFromUrl);
    window.addEventListener("lulu:navigate", syncSectionFromUrl);
    return () => {
      window.removeEventListener("popstate", syncSectionFromUrl);
      window.removeEventListener("lulu:navigate", syncSectionFromUrl);
    };
  }, []);

  useEffect(() => {
    if (!workspaceId) return;
    Promise.all([websitesApi.list(workspaceId), onboardingApi.platforms(workspaceId)]).then(([websiteResponse, platformResponse]) => {
      setSites(websiteResponse.data.items);
      setPlatforms(platformResponse.data.items);
      setSelectedSiteId(websiteResponse.data.items.find((site) => site.provider === provider)?.id ?? websiteResponse.data.items[0]?.id ?? "");
    }).catch((requestError) => setError(getFriendlyErrorMessage(requestError, "Die Websites und Verbindungen konnten nicht geladen werden.")));
  }, [workspaceId, provider]);

  const startAutomaticGeneration = async (nextProvider: Provider) => {
    if (!workspaceId) return;
    setError("");
    setGenerationFailure(null);
    setGenerationStarting(nextProvider);
    try {
      const response = await websitesApi.startAutomaticGeneration(workspaceId, nextProvider, document.documentElement.lang || undefined);
      setSites((current) => current.some((site) => site.id === response.data.site.id) ? current.map((site) => site.id === response.data.site.id ? response.data.site : site) : [response.data.site, ...current]);
      setSelectedSiteId(response.data.site.id);
      setGenerationStarting(null);
      setGenerationJob({ siteId: response.data.site.id, job: response.data.job, provider: nextProvider });
    } catch (requestError) {
      const friendly = getFriendlyErrorMessage(requestError, nextProvider === "wordpress" ? "WordPress ist verbunden, aber es wurde noch keine WordPress-Website gefunden." : "Webflow ist verbunden, aber es wurde noch keine CMS-Collection gefunden.");
      const details = requestError instanceof Error && "status" in requestError ? getTechnicalErrorDetails(requestError) : "";
      const message = details && details !== "Code: UNKNOWN_ERROR" ? `${friendly} — ${details}` : friendly;
      setGenerationStarting(null);
      setGenerationFailure({ provider: nextProvider, message });
      setError(message);
      void refresh();
    }
  };

  useEffect(() => {
    const oauthReturn = oauthReturnRef.current === provider;
    if (!workspaceId || !providerAuthorized || (sites.some((site) => site.provider === provider) && !oauthReturn)) return;
    const key = `${workspaceId}:${provider}`;
    if (!oauthReturn && autoStartedRef.current === key) return;
    autoStartedRef.current = key;
    oauthReturnRef.current = null;
    void startAutomaticGeneration(provider);
  }, [workspaceId, providerAuthorized, sites, provider]);

  useEffect(() => {
    if (!workspaceId || !generationJob || ["published", "failed", "cancelled"].includes(generationJob.job.status)) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const response = await websitesApi.getGenerationJob(workspaceId, generationJob.siteId, generationJob.job.id);
        if (cancelled) return;
        setGenerationJob((current) => current ? { ...current, job: response.data } : current);
        if (!["published", "failed", "cancelled"].includes(response.data.status)) window.setTimeout(poll, 2000);
        else if (response.data.status === "failed") {
          const message = response.data.errorMessage ?? "Die Website konnte nicht automatisch generiert werden.";
          const failedProvider = generationJob.provider;
          setGenerationFailure({ provider: failedProvider, message });
          setError(message);
          setGenerationJob(null);
          void websitesApi.cleanupProvider(workspaceId, failedProvider).catch(() => undefined);
          void refresh();
        }
        else if (response.data.status === "published") void refresh();
      } catch (requestError) {
        if (!cancelled) {
          const message = getFriendlyErrorMessage(requestError, "Die Website-Generierung ist fehlgeschlagen. Die Verbindung wurde zurückgesetzt.");
          const failedProvider = generationJob.provider;
          setGenerationJob(null);
          setGenerationFailure({ provider: failedProvider, message });
          setError(message);
          void websitesApi.cleanupProvider(workspaceId, failedProvider).catch(() => undefined);
        }
      }
    };
    void poll();
    return () => { cancelled = true; };
  }, [workspaceId, generationJob?.siteId, generationJob?.job.id, generationJob?.job.status]);

  const refresh = () => {
    setIsRefreshing(true);
    setError("");
    if (workspaceId) Promise.all([websitesApi.list(workspaceId), onboardingApi.platforms(workspaceId)]).then(([websiteResponse, platformResponse]) => { setSites(websiteResponse.data.items); setPlatforms(platformResponse.data.items); }).catch((requestError) => setError(getFriendlyErrorMessage(requestError, "Die Websites und Verbindungen konnten nicht geladen werden."))).finally(() => setIsRefreshing(false));
    else window.setTimeout(() => setIsRefreshing(false), 800);
  };

  const connectProvider = async (nextProvider: Provider) => {
    if (!workspaceId) { setError("Für diese Aktion ist kein Workspace ausgewählt."); return; }
    setConnectionBusy(nextProvider);
    setError("");
    try {
      const response = await onboardingApi.startOAuth(workspaceId, nextProvider, undefined, `/app/website?section=${nextProvider === "webflow" ? "webflow-9014" : "wordpress-jetpack-9013"}`);
      window.location.assign(response.data.authorizationUrl);
    } catch (requestError) {
      setError(getFriendlyErrorMessage(requestError, `${nextProvider === "webflow" ? "Webflow" : "WordPress"} konnte nicht verbunden werden.`));
      setConnectionBusy(null);
    }
  };

  const disconnectProvider = async (nextProvider: Provider) => {
    if (!workspaceId) return;
    const platform = platforms.find((item) => platformMatchesProvider(item, nextProvider));
    if (!platform) return;
    setConnectionBusy(nextProvider);
    setError("");
    try {
      await onboardingApi.deletePlatform(workspaceId, platform.id);
      setPlatforms((current) => current.filter((item) => item.id !== platform.id));
      setSites((current) => current.filter((site) => site.provider !== nextProvider));
    } catch (requestError) {
      setError(getFriendlyErrorMessage(requestError, `${nextProvider === "webflow" ? "Webflow" : "WordPress"} konnte nicht getrennt werden.`));
    } finally {
      setConnectionBusy(null);
    }
  };

  const logout = async () => {
    setAccountMenuOpen(false);
    try { await authApi.logout(); } catch { /* The local session is cleared even if the server is unreachable. */ }
    clearSelectedWorkspaceId();
    window.location.assign("/auth/login");
  };

  const changeProvider = (nextProvider: Provider) => {
    setProvider(nextProvider);
    setActiveSection(nextProvider === "webflow" ? "Webflow" : "WordPress / Jetpack");
  };

  const generationStatus = generationJob?.job.status;
  const generationLabel = generationStatus === "published" ? "Website veröffentlicht" : generationStatus === "failed" ? "Generierung fehlgeschlagen" : generationStatus === "publishing" ? "Website wird veröffentlicht" : generationStatus === "preview" ? "Website wird vorbereitet" : "Website wird generiert";
  const generationDetail = generationStatus === "planning" ? "Lulu analysiert die Unternehmensdaten und erstellt die Seitenstruktur." : generationStatus === "preview" ? "Die Inhalte, SEO-Metadaten und Seiten werden für den verbundenen Anbieter vorbereitet." : generationStatus === "publishing" ? "Die generierten Seiten werden jetzt im verbundenen CMS angelegt." : generationStatus === "published" ? "Die Website wurde erfolgreich im verbundenen CMS erstellt." : generationStatus === "failed" ? (generationJob?.job.errorMessage ?? "Bitte prüfe die Verbindung und versuche es erneut.") : "Lulu führt die automatische Website-Erstellung im Hintergrund aus.";

  return (
    <div className="min-h-screen bg-[var(--background)] text-foreground">
      {(error || connectionBusy) && <div role={error ? "alert" : "status"} className="fixed left-1/2 top-4 z-[70] w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground shadow-2xl" aria-live="polite">{error || `${connectionBusy === "wordpress" ? "WordPress / Jetpack" : "Webflow"} wird verbunden…`}</div>}
      {generationJob && <ViewportPortal><div className="fixed inset-0 z-[1000] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-black/45 p-4 backdrop-blur-sm"><div role="dialog" aria-modal="true" aria-labelledby="website-generation-title" className="my-0 max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:p-7"><div className="flex items-start gap-4"><div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${generationStatus === "failed" ? "bg-destructive/10 text-destructive" : generationStatus === "published" ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"}`}>{generationStatus === "failed" || generationStatus === "published" ? <Globe2 size={22} /> : <RefreshCw size={22} className="animate-spin" />}</div><div className="min-w-0"><h2 id="website-generation-title" className="text-lg font-semibold text-foreground">{generationLabel}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{generationDetail}</p></div></div><div className="mt-6 h-2 overflow-hidden rounded-full bg-secondary"><div className={`h-full rounded-full transition-all duration-500 ${generationStatus === "failed" ? "w-full bg-destructive" : generationStatus === "published" ? "w-full bg-emerald-500" : generationStatus === "publishing" ? "w-4/5 bg-primary" : generationStatus === "preview" ? "w-3/5 bg-primary" : generationStatus === "planning" ? "w-2/5 bg-primary" : "w-1/5 bg-primary"}`} /></div><div className="mt-5 flex items-center justify-between gap-3 text-xs text-muted-foreground"><span>{generationJob.provider === "wordpress" ? "WordPress / Jetpack" : "Webflow"}</span><span className="capitalize">{generationStatus}</span></div>{["published", "failed", "cancelled"].includes(generationStatus ?? "") && <button type="button" onClick={() => setGenerationJob(null)} className="mt-6 w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary">Schließen</button>}</div></div></ViewportPortal>}
      {generationStarting && !generationJob && <ViewportPortal><div className="fixed inset-0 z-[1000] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-black/45 p-4 backdrop-blur-sm"><div role="dialog" aria-modal="true" aria-labelledby="website-generation-start-title" className="my-0 max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6 text-foreground shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:p-7"><div className="flex items-start gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><RefreshCw size={22} className="animate-spin" /></div><div><h2 id="website-generation-start-title" className="text-lg font-semibold text-foreground">Website wird generiert</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Die Verbindung wurde bestätigt. Lulu analysiert jetzt deine Unternehmensdaten und erstellt die Website.</p><p className="mt-3 text-xs text-muted-foreground">{generationStarting === "wordpress" ? "WordPress / Jetpack" : "Webflow"}</p></div></div><div className="mt-6 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full w-1/4 animate-pulse rounded-full bg-primary" /></div></div></div></ViewportPortal>}
      {generationFailure && !generationJob && !generationStarting && <ViewportPortal><div className="fixed inset-0 z-[1000] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-black/45 p-4 backdrop-blur-sm"><div role="alertdialog" aria-modal="true" className="my-0 max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-destructive/30 bg-card p-6 text-foreground shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:p-7"><h2 className="text-lg font-semibold text-destructive">Generierung fehlgeschlagen</h2><p className="mt-3 break-words text-sm leading-6 text-muted-foreground">{generationFailure.message}</p><button type="button" onClick={() => setGenerationFailure(null)} className="mt-6 w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary">Schließen</button></div></div></ViewportPortal>}

      <aside className={`${mobileNav ? "flex" : "hidden"} fixed inset-y-0 left-0 z-30 flex h-dvh min-h-0 w-64 max-w-[calc(100vw-1rem)] flex-col overflow-hidden border-r border-border bg-[var(--sidebar)] p-4 lg:flex`}>
        <div className="mb-8 flex items-center gap-3 px-2 py-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-lg shadow-black/20">L</div>
          <div><strong className="text-base tracking-tight text-foreground">Lulu AI</strong><p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Growth workspace</p></div>
          <button className="ml-auto rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden" aria-label="Navigation schließen" onClick={() => setMobileNav(false)}><X size={17} /></button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
          <LuluSectionNavigation activeId="lulu-website-portal-9012" />
        </div>
        <div className="sticky bottom-0 z-10 relative mt-4 shrink-0 border-t border-border bg-[var(--sidebar)] pt-4">
          <div className="flex items-center gap-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-card text-xs font-semibold text-foreground">LU</div><div className="min-w-0"><p className="truncate text-sm font-medium text-foreground">Workspace account</p><p className="text-xs text-muted-foreground">Workspace member</p></div><button type="button" className="ml-auto rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground" aria-label="Account-Menü öffnen" aria-expanded={accountMenuOpen} onClick={() => setAccountMenuOpen((open) => !open)}><MoreHorizontal size={16} /></button></div>
          {accountMenuOpen && <div className="absolute bottom-12 right-0 z-40 w-44 rounded-lg border border-border bg-card p-1 shadow-xl"><button type="button" onClick={() => void logout()} className="w-full rounded-md px-3 py-2 text-left text-xs font-medium text-foreground transition hover:bg-secondary">Abmelden</button></div>}
        </div>
      </aside>
      {mobileNav && <button aria-label="Navigation schließen" className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setMobileNav(false)} />}

      <main data-lulu-scroll-container className="min-h-screen min-w-0 overflow-x-hidden lg:ml-64">
        <div className="mx-auto max-w-[1400px] px-5 py-6 sm:px-8 sm:py-8">
          <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="flex items-start gap-3"><button className="mt-1 rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden" aria-label="Navigation öffnen" onClick={() => setMobileNav(true)}><Menu size={20} /></button><div><p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Lulu AI / Website</p><h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">Website</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{content.description}</p></div></div>
            <div className="flex flex-wrap items-center gap-2"><button onClick={refresh} className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground transition hover:border-primary/40"><RefreshCw size={15} className={isRefreshing ? "animate-spin" : ""} /> Aktualisieren</button><button type="button" className="flex h-10 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground shadow-lg shadow-black/10"><Plus size={15} /> Neue Seite</button></div>
          </header>

          <section className="mb-6 rounded-xl border border-border bg-card p-5 sm:p-6"><div className="flex flex-col gap-2"><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Integrationen</p><h2 className="text-lg font-semibold tracking-tight text-foreground">Plattformen später verbinden</h2><p className="max-w-2xl text-sm leading-6 text-muted-foreground">WordPress/Jetpack und Webflow können jederzeit nach dem Onboarding hinzugefügt, erneut verbunden oder getrennt werden.</p></div><div className="mt-5 grid gap-3 md:grid-cols-2">{providerOptions.map((option) => { const platform = platforms.find((item) => platformMatchesProvider(item, option.id)); const isConnected = Boolean(platform && platformIsConnected(platform)); const isBusy = connectionBusy === option.id; return <article key={option.id} className="flex min-w-0 flex-col justify-between gap-4 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center"><div className="flex min-w-0 items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground"><Globe2 size={18} /></span><div className="min-w-0"><h3 className="truncate text-sm font-semibold text-foreground">{option.label}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{isConnected ? `Verbunden${platform?.settings?.accountName ? ` · ${String(platform.settings.accountName)}` : ""}` : platform && ["pending", "error"].includes(platform.connectionStatus.toLowerCase()) ? "Setting up…" : "Noch nicht verbunden"}</p>{platform?.lastError && <p className="mt-1 break-words text-xs text-destructive">{platform.lastError}</p>}</div></div><div className="flex shrink-0 flex-wrap gap-2"><button type="button" disabled={isBusy} onClick={() => isConnected ? void disconnectProvider(option.id) : void connectProvider(option.id)} className={`inline-flex h-9 items-center justify-center rounded-lg px-3 text-xs font-medium transition disabled:cursor-wait disabled:opacity-60 ${isConnected ? "border border-border text-foreground hover:bg-secondary" : "bg-primary text-primary-foreground hover:opacity-90"}`}>{isBusy ? "Bitte warten…" : isConnected ? "Trennen" : "Verbinden"}</button></div>{option.id === "wordpress" && !isConnected && <div className="mt-3 rounded-lg border border-border bg-background/70 p-3 text-xs leading-5 text-muted-foreground"><p>Wenn WordPress.com die Google-Anmeldung nicht initialisieren kann, melde dich dort direkt mit deiner WordPress-E-Mail oder deinem Benutzernamen und Passwort an. Lulu erhält den OAuth-Code erst nach erfolgreicher Anmeldung.</p><div className="mt-2 flex flex-wrap gap-2"><button type="button" className="rounded-md border border-border px-2.5 py-1.5 font-medium text-foreground transition hover:bg-secondary" onClick={() => { setOauthHelpVisible(true); void connectProvider("wordpress"); }}>WordPress-Verbindung neu starten</button>{oauthHelpVisible && <span className="self-center">Der neue Start erzeugt einen frischen OAuth-State.</span>}</div></div>}</article>; })}</div>{error && <p role="alert" className="mt-4 break-words text-sm text-destructive">{error}</p>}</section>

          <section className="mb-6 rounded-xl border border-border bg-card px-5 py-4"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-muted-foreground"><Globe2 size={19} /></span><div><p className="text-sm font-semibold text-foreground">Website-Provider</p><p className="mt-1 text-xs text-muted-foreground">Wähle die Plattform, die du mit Lulu verwalten möchtest.</p></div></div><label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-muted-foreground sm:min-w-[300px]"><span className="sr-only">Website-Provider auswählen</span><select value={provider} onChange={(event) => changeProvider(event.target.value as Provider)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary/50"><option value="wordpress">WordPress / Jetpack</option><option value="webflow">Webflow</option></select></label></div><div className="mt-4 flex flex-wrap gap-2">{providerOptions.map((option) => <button key={option.id} type="button" onClick={() => changeProvider(option.id)} className={`rounded-lg border px-3 py-2 text-left transition ${provider === option.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary/40"}`}><span className="block text-xs font-semibold">{option.label}</span><span className={`mt-0.5 block text-[11px] ${provider === option.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{option.description}</span></button>)}</div></section>

          <section className="mb-6 flex flex-col justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-muted-foreground"><Globe2 size={19} /></span><div><p className="text-sm font-semibold text-foreground">{content.shortLabel}-Verwaltung aktiviert</p><p className="mt-1 text-xs text-muted-foreground">{connected ? `${sites.filter((site) => site.provider === provider).length} Website-Verbindung(en) im Workspace` : `${content.shortLabel} ist aktiviert. ${content.connectDescription}`}</p></div></div><a {...pageLinkProps("fresh-tide-9404")} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-secondary">Zu Existing Platforms <ArrowRight size={14} /></a></section>

          <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{content.metrics.map((metric) => <article key={metric.label} className="rounded-xl border border-border bg-card p-4"><div className="mb-4 flex items-center justify-between"><span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{metric.label}</span><metric.icon size={16} className="text-muted-foreground" /></div><strong className="text-2xl font-semibold tracking-tight text-foreground">{metric.label === "Seiten" ? String(selectedSite ? 1 : 0) : metric.value}</strong><p className="mt-1 text-xs text-muted-foreground">{metric.hint}</p></article>)}</div>


          <section><div className="mb-3 flex items-end justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Arbeitsbereich</p><h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">{activeSection} · {content.shortLabel}</h2></div><button type="button" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary" aria-label="Website-Einstellungen"><Settings size={17} /></button></div><div className="grid gap-3 md:grid-cols-3">{content.actions.map((action) => <button key={action.title} type="button" className="group rounded-xl border border-border bg-card p-4 text-left transition hover:-translate-y-px hover:border-primary/40"><div className="mb-5 flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-muted-foreground group-hover:text-foreground"><action.icon size={17} /></span><ArrowRight size={16} className="text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" /></div><h3 className="text-sm font-semibold text-foreground">{action.title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{action.description}</p></button>)}</div></section>
        </div>
      </main>
    </div>
  );
}
