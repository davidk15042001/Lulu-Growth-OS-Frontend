import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bot,
  ExternalLink,
  Globe,
  Loader2,
  Search,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";
import { getFriendlyErrorMessage } from "../../api/client";
import {
  getSearchChannelSummary,
  type AnalyzeSearchInput,
  type SearchChannel,
  type SearchChannelSummary,
  type SearchItem,
} from "../../api/searchIntelligence";

type Props = {
  channel: SearchChannel;
};

type AnalysisForm = Required<AnalyzeSearchInput>;

const CHANNEL_COPY: Record<SearchChannel, { title: string; subtitle: string; primaryLabel: string; secondaryLabel: string }> = {
  seo: {
    title: "SEO Intelligence",
    subtitle: "Live Keywords, SERPs und On-Page-Signale aus DataForSEO mit direkter Ausspielung auf WordPress, Webflow und Shopify.",
    primaryLabel: "Sichtbarkeit",
    secondaryLabel: "Rankings",
  },
  geo: {
    title: "GEO Intelligence",
    subtitle: "Prompt-, Mention- und Citation-Tracking fuer generative Suchsysteme mit automatischer Veroeffentlichung der Insight-Seiten.",
    primaryLabel: "Mentions",
    secondaryLabel: "Citations",
  },
  aeo: {
    title: "AEO Intelligence",
    subtitle: "Fragen, Antwortqualitaet und Antwortluecken aus DataForSEO mit sofortigem Auto-Apply auf verbundene Websites.",
    primaryLabel: "Antworten",
    secondaryLabel: "Fragen",
  },
};

const PROVIDER_LABELS = {
  wordpress: "WordPress",
  webflow: "Webflow",
  shopify: "Shopify",
} as const;

const DEFAULT_FORM: AnalysisForm = {
  locationCode: 2840,
  languageCode: "en",
  depth: 20,
  maxKeywords: 5,
  device: "desktop",
  autoApply: true,
};

function textValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((entry) => textValue(entry)).filter(Boolean).join(", ");
  return "";
}

function dataField(item: SearchItem, key: string) {
  return textValue(item.data?.[key]);
}

function formatDate(value: string | null) {
  if (!value) return "Noch nicht analysiert";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function statusTone(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("answer") || normalized.includes("mention") || normalized.includes("rank")) {
    return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  }
  if (normalized.includes("watch") || normalized.includes("partial") || normalized.includes("draft")) {
    return "bg-amber-500/15 text-amber-300 border-amber-500/30";
  }
  if (normalized.includes("missing") || normalized.includes("not")) {
    return "bg-rose-500/15 text-rose-300 border-rose-500/30";
  }
  return "bg-slate-500/15 text-slate-200 border-slate-500/30";
}

function itemFacts(channel: SearchChannel, item: SearchItem) {
  if (channel === "seo") {
    return [
      ["Intent", dataField(item, "intent") || item.stage || "mixed"],
      ["Volumen", dataField(item, "volume") || "0"],
      ["Difficulty", dataField(item, "difficulty") || "0"],
      ["Top URL", dataField(item, "url") || "keine"],
    ];
  }
  if (channel === "geo") {
    return [
      ["Topic", dataField(item, "topic") || item.stage || "general"],
      ["Mention", dataField(item, "mention") || item.status],
      ["Competitors", dataField(item, "competitors") || "keine"],
      ["Citation", dataField(item, "citation") || "keine"],
    ];
  }
  return [
    ["Topic", dataField(item, "topic") || item.stage || "general"],
    ["Antwort", dataField(item, "answerStatus") || item.status],
    ["Qualitaet", dataField(item, "quality") || "n/a"],
    ["Quelle", dataField(item, "sourcePage") || "keine"],
  ];
}

function itemOpportunity(channel: SearchChannel, item: SearchItem) {
  if (channel === "seo") return dataField(item, "opportunity");
  if (channel === "geo") return dataField(item, "opportunity");
  return dataField(item, "opportunity");
}

export function SearchChannelWorkspace({ channel }: Props) {
  const copy = CHANNEL_COPY[channel];
  const [summary, setSummary] = useState<SearchChannelSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activity, setActivity] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<AnalysisForm>(DEFAULT_FORM);
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSearchChannelSummary(channel);
      setSummary(response.data);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Die Search-Intelligence-Daten konnten nicht geladen werden."));
    } finally {
      setLoading(false);
    }
  }, [channel]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    if (!summary) return;
    setSelectedTargetIds((current) => {
      const availableIds = summary.connectedTargets.map((target) => target.id);
      if (availableIds.length === 0) return [];
      if (current.length === 0) return availableIds;
      const next = current.filter((id) => availableIds.includes(id));
      return next.length > 0 ? next : availableIds;
    });
  }, [summary]);

  const visibleItems = useMemo(() => {
    const source = summary?.items ?? [];
    if (!query.trim()) return source;
    const term = query.trim().toLowerCase();
    return source.filter((item) => {
      const blob = [
        item.name,
        item.description,
        item.status,
        item.stage,
        ...Object.values(item.data ?? {}).map((value) => textValue(value)),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(term);
    });
  }, [query, summary]);

  const selectedTargets = useMemo(
    () => summary?.connectedTargets.filter((target) => selectedTargetIds.includes(target.id)) ?? [],
    [selectedTargetIds, summary],
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-cyan-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  DataForSEO als Hauptquelle
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1 text-violet-200">
                  <Wand2 className="h-3.5 w-3.5" />
                  Automatische Freigabe aktiv
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-emerald-200">
                  <Target className="h-3.5 w-3.5" />
                  WordPress, Webflow und Shopify direkt
                </span>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Search Intelligence</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">{copy.title}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{copy.subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <Bot className="h-4 w-4 text-cyan-300" />
                  Auto-Insight-Seite pro Channel
                </span>
                <span className="inline-flex items-center gap-2">
                  <Globe className="h-4 w-4 text-cyan-300" />
                  Letzte Analyse: {formatDate(summary?.lastAnalyzedAt ?? null)}
                </span>
              </div>
            </div>
            <p className="max-w-sm rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
              Analyse, Refresh und Auto-Apply laufen jetzt zentral ueber den Update-Button in der Navigation.
            </p>
          </div>
        </section>

        {error ? (
          <section className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </section>
        ) : null}

        {activity ? (
          <section className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            {activity}
          </section>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Records</p>
            <strong className="mt-3 block text-3xl font-semibold">{summary?.metrics.records ?? 0}</strong>
            <p className="mt-2 text-sm text-slate-300">Persistiert in `{summary?.resourceType ?? `marketing_${channel}_items`}`</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">{copy.primaryLabel}</p>
            <strong className="mt-3 block text-3xl font-semibold">{summary?.metrics.answeredOrMentioned ?? 0}</strong>
            <p className="mt-2 text-sm text-slate-300">Positive Signale aus dem letzten Lauf</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Opportunities</p>
            <strong className="mt-3 block text-3xl font-semibold">{summary?.metrics.opportunities ?? 0}</strong>
            <p className="mt-2 text-sm text-slate-300">Offene Hebel fuer {copy.secondaryLabel.toLowerCase()}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Site Audits</p>
            <strong className="mt-3 block text-3xl font-semibold">{summary?.metrics.siteAudits ?? 0}</strong>
            <p className="mt-2 text-sm text-slate-300">On-Page-Signale aus dem verbundenen Bestand</p>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Analyse</p>
                <h2 className="mt-2 text-xl font-semibold">DataForSEO-Lauf starten</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Die Analyse schreibt direkt in die Channel-Records und veroeffentlicht bei Bedarf automatisch auf allen verbundenen Zielen.
                </p>
              </div>
              <p className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300 lg:max-w-sm">
                Der naechste DataForSEO-Lauf wird ueber den globalen Update-Button gestartet.
              </p>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Location Code</span>
                <input
                  type="number"
                  value={form.locationCode}
                  onChange={(event) => setForm((current) => ({ ...current, locationCode: Number(event.target.value) || 2840 }))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none ring-0"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Sprache</span>
                <select
                  value={form.languageCode}
                  onChange={(event) => setForm((current) => ({ ...current, languageCode: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none"
                >
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="zh">Chinese</option>
                </select>
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Keywords / Prompts</span>
                <select
                  value={form.maxKeywords}
                  onChange={(event) => setForm((current) => ({ ...current, maxKeywords: Number(event.target.value) }))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none"
                >
                  <option value={5}>5</option>
                  <option value={8}>8</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">SERP-Tiefe</span>
                <select
                  value={form.depth}
                  onChange={(event) => setForm((current) => ({ ...current, depth: Number(event.target.value) }))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none"
                >
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Device</span>
                <select
                  value={form.device}
                  onChange={(event) => setForm((current) => ({ ...current, device: event.target.value as AnalysisForm["device"] }))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none"
                >
                  <option value="desktop">Desktop</option>
                  <option value="mobile">Mobile</option>
                </select>
              </label>
              <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-slate-100">Auto-Freigabe</p>
                  <p className="text-xs text-slate-400">Analyse pusht direkt auf verbundene Ziele</p>
                </div>
                <input
                  type="checkbox"
                  checked={form.autoApply}
                  onChange={(event) => setForm((current) => ({ ...current, autoApply: event.target.checked }))}
                  className="h-5 w-5 rounded border-white/10 bg-slate-900"
                />
              </label>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Auto-Apply</p>
                <h2 className="mt-2 text-xl font-semibold">Verbundene Ziele</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Manuelles Re-Apply bleibt verfuegbar. Standardmaessig sind alle gefundenen Ziele vorausgewaehlt.
                </p>
              </div>
              <p className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300 lg:max-w-sm">
                Neue Ergebnisse werden beim globalen Update automatisch auf die verbundenen Ziele uebertragen.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {summary?.connectedTargets.length ? (
                summary.connectedTargets.map((target) => {
                  const checked = selectedTargetIds.includes(target.id);
                  return (
                    <label
                      key={target.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                        checked ? "border-cyan-400/40 bg-cyan-400/10" : "border-white/10 bg-slate-950/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          setSelectedTargetIds((current) =>
                            event.target.checked ? [...current, target.id] : current.filter((id) => id !== target.id),
                          );
                        }}
                        className="mt-0.5 h-5 w-5 rounded border-white/10 bg-slate-900"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-100">{target.label}</span>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                            {PROVIDER_LABELS[target.provider]}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span>ID: {target.id.slice(0, 8)}</span>
                          {target.url ? (
                            <a
                              href={target.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-cyan-200 hover:text-cyan-100"
                            >
                              {target.url}
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ) : (
                            <span>Keine URL hinterlegt</span>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-4 py-5 text-sm text-slate-400">
                  Noch keine verbundenen WordPress-, Webflow- oder Shopify-Ziele vorhanden.
                </div>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-300">
              Ausgewaehlt: {selectedTargets.length} von {summary?.connectedTargets.length ?? 0}
            </div>
          </article>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Signals</p>
              <h2 className="mt-2 text-xl font-semibold">Persistierte Ergebnisse</h2>
              <p className="mt-2 text-sm text-slate-300">
                Alle Karten unten kommen aus den echten `marketing_*_items`-Records dieses Channels.
              </p>
            </div>
            <label className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nach Keyword, Prompt, Frage oder URL filtern"
                className="w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
              />
            </label>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-300">
              <Loader2 className="h-5 w-5 animate-spin" />
              Daten werden geladen...
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-4 py-10 text-center text-sm text-slate-400">
              Noch keine Datensaetze vorhanden. Starte die Analyse, um echte SEO-, GEO- oder AEO-Signale zu erzeugen.
            </div>
          ) : (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {visibleItems.map((item) => {
                const opportunity = itemOpportunity(channel, item);
                return (
                  <article key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-50">{item.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone(item.status)}`}>
                            {item.status}
                          </span>
                          {item.stage ? (
                            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                              {item.stage}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">{formatDate(item.updatedAt)}</span>
                    </div>

                    {item.description ? <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p> : null}

                    <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                      {itemFacts(channel, item).map(([label, value]) => (
                        <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                          <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</dt>
                          <dd className="mt-1 text-sm text-slate-100">{value || "—"}</dd>
                        </div>
                      ))}
                    </dl>

                    {opportunity ? (
                      <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2.5 text-sm text-amber-100">
                        Opportunity: {opportunity}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
