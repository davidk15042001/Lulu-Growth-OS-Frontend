import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
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
  Sparkles,
  X,
} from "lucide-react";
import { pageLinkProps } from "../../routing";

const websiteItems = [
  { label: "Übersicht", active: true },
  { label: "Seiten", count: "0" },
  { label: "Beiträge", count: "0" },
  { label: "Medien", count: "0" },
  { label: "Entwürfe", count: "0" },
  { label: "Website-Einstellungen", soon: true },
];

const quickActions = [
  { title: "Neue Seite erstellen", description: "Lulu erstellt eine Seitenstruktur und einen ersten Textentwurf.", icon: Plus },
  { title: "Website analysieren", description: "Prüfe Inhalte, Struktur und Conversion-Potenziale deiner Website.", icon: Search },
  { title: "Medien organisieren", description: "Ordne Bilder und Dateien deinen Website-Inhalten zu.", icon: Image },
];

export default function App() {
  const [mobileNav, setMobileNav] = useState(false);
  const [activeSection, setActiveSection] = useState("Übersicht");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = () => {
    setIsRefreshing(true);
    window.setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-foreground" style={{ fontFamily: "Inter, sans-serif" }}>
      <aside className={`${mobileNav ? "flex" : "hidden"} fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-border bg-[var(--sidebar)] p-4 lg:flex`}>
        <div className="mb-8 flex items-center gap-3 px-2 py-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-lg shadow-black/20">L</div>
          <div>
            <strong className="text-base tracking-tight text-foreground">Lulu AI</strong>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Growth workspace</p>
          </div>
          <button className="ml-auto rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden" aria-label="Navigation schließen" onClick={() => setMobileNav(false)}><X size={17} /></button>
        </div>

        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1" aria-label="Lulu AI Hauptnavigation">
          <a {...pageLinkProps("fancily-leaf-1766")} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground">
            <LayoutDashboard size={17} /> Dashboard
          </a>
          <details open className="group rounded-lg">
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg bg-secondary/15 px-3 py-2.5 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-3"><Globe2 size={17} /> Website</span>
              <ChevronDown size={15} className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="ml-3 mt-1 space-y-0.5 border-l border-border pl-2">
              {websiteItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  disabled={item.soon}
                  onClick={() => !item.soon && setActiveSection(item.label)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition ${activeSection === item.label ? "bg-primary text-primary-foreground" : item.soon ? "cursor-not-allowed text-muted-foreground/50" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
                >
                  <span>{item.label}</span>
                  {item.soon ? <span className="text-[10px] uppercase tracking-wide">soon</span> : item.count ? <span className="opacity-70">{item.count}</span> : null}
                </button>
              ))}
            </div>
          </details>
          {["AI", "CRM", "Marketing", "Sales", "Integrations", "Billing"].map((label) => (
            <details key={label} className="group rounded-lg">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground [&::-webkit-details-marker]:hidden"><span>{label}</span><ChevronDown size={15} className="transition-transform group-open:rotate-180" /></summary>
            </details>
          ))}
        </nav>

        <div className="mt-4 space-y-3 border-t border-border pt-4">
          <div className="flex items-center gap-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-card text-xs font-semibold text-foreground">JD</div><div><p className="text-sm font-medium text-foreground">Jordan Davis</p><p className="text-xs text-muted-foreground">Workspace admin</p></div><MoreHorizontal className="ml-auto text-muted-foreground" size={16} /></div>
          <div className="flex items-center gap-2 rounded-lg border border-chart-4/20 bg-chart-4/5 px-3 py-2 text-xs text-chart-4"><span className="h-2 w-2 rounded-full bg-chart-4" /> AI Active <span className="ml-auto text-muted-foreground">Live</span></div>
        </div>
      </aside>
      {mobileNav && <button aria-label="Navigation schließen" className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setMobileNav(false)} />}

      <main className="min-h-screen lg:ml-64">
        <div className="mx-auto max-w-[1400px] px-5 py-6 sm:px-8 sm:py-8">
          <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="flex items-start gap-3">
              <button className="mt-1 rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden" aria-label="Navigation öffnen" onClick={() => setMobileNav(true)}><Menu size={20} /></button>
              <div><p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Lulu AI / Website</p><h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">Website</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Verwalte deine WordPress.com- oder Jetpack-Website mit Lulu AI — von der ersten Idee bis zur bestätigten Veröffentlichung.</p></div>
            </div>
            <div className="flex flex-wrap items-center gap-2"><button onClick={refresh} className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground transition hover:border-primary/40"><RefreshCw size={15} className={isRefreshing ? "animate-spin" : ""} /> Aktualisieren</button><button type="button" className="flex h-10 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground shadow-lg shadow-black/10"><Plus size={15} /> Neue Seite</button></div>
          </header>

          <section className="mb-6 flex flex-col justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-muted-foreground"><Globe2 size={19} /></span><div><p className="text-sm font-semibold text-foreground">Noch keine Website verbunden</p><p className="mt-1 text-xs text-muted-foreground">Verbinde WordPress.com oder Jetpack, um Inhalte zu verwalten.</p></div></div><a {...pageLinkProps("fresh-tide-9404")} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-secondary">Zu Existing Platforms <ArrowRight size={14} /></a></section>

          <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[{ label: "Seiten", value: "0", icon: LayoutDashboard }, { label: "Beiträge", value: "0", icon: PenLine }, { label: "Medien", value: "0", icon: Image }, { label: "Entwürfe", value: "0", icon: FileEdit }].map((metric) => <article key={metric.label} className="rounded-xl border border-border bg-card p-4"><div className="mb-4 flex items-center justify-between"><span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{metric.label}</span><metric.icon size={16} className="text-muted-foreground" /></div><strong className="text-2xl font-semibold tracking-tight text-foreground">{metric.value}</strong><p className="mt-1 text-xs text-muted-foreground">Wird nach der Verbindung geladen</p></article>)}
          </div>

          <section className="mb-7 rounded-xl border border-border bg-secondary/[0.05] p-5"><div className="flex flex-col gap-4 sm:flex-row"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-foreground"><Sparkles size={18} /></div><div><div className="mb-1 flex items-center gap-2"><h2 className="text-base font-semibold text-foreground">Lulu Website Intelligence</h2><span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Bereit</span></div><p className="max-w-3xl text-sm leading-6 text-muted-foreground">Verbinde deine Website, damit Lulu Struktur, Inhalte, Medien und Conversion-Potenziale analysieren kann. Alle schreibenden Aktionen werden vor der Veröffentlichung als Vorschau angezeigt.</p><button type="button" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">Website verbinden <ArrowRight size={14} /></button></div></div></section>

          <section><div className="mb-3 flex items-end justify-between"><div><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Arbeitsbereich</p><h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">{activeSection}</h2></div><button type="button" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary" aria-label="Website-Einstellungen"><Settings size={17} /></button></div><div className="grid gap-3 md:grid-cols-3">{quickActions.map((action) => <button key={action.title} type="button" className="group rounded-xl border border-border bg-card p-4 text-left transition hover:-translate-y-px hover:border-primary/40"><div className="mb-5 flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-muted-foreground group-hover:text-foreground"><action.icon size={17} /></span><ArrowRight size={16} className="text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" /></div><h3 className="text-sm font-semibold text-foreground">{action.title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{action.description}</p></button>)}</div></section>
        </div>
      </main>
    </div>
  );
}
