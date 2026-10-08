import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Building2, CheckCircle2, Globe2, LoaderCircle, MessageSquareReply, RefreshCw, Search, ShieldAlert, Star, Unplug } from "lucide-react";
import { ApiError, getFriendlyErrorMessage } from "../../../../api/client";
import { getSelectedWorkspaceId } from "../../../../api/session";
import { workspaceAppApi, type GoogleReviewsManagerReview, type GoogleReviewsManagerState } from "../../../../api/workspace-app";

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} von 5 Sternen`}>
      {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} className={star <= rating ? "fill-current text-amber-500" : "text-muted-foreground/30"} />)}
    </span>
  );
}

function StatusPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warning" | "danger" }) {
  const toneClass = tone === "good" ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : tone === "warning" ? "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300" : tone === "danger" ? "border-destructive/25 bg-destructive/10 text-destructive" : "border-border bg-secondary text-muted-foreground";
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${toneClass}`}>{children}</span>;
}

export function LuluReviewsPage() {
  const workspaceId = getSelectedWorkspaceId();
  const [manager, setManager] = useState<GoogleReviewsManagerState | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyConnect, setBusyConnect] = useState(false);
  const [savingReviewId, setSavingReviewId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [locationId, setLocationId] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const refresh = useCallback(async () => {
    if (!workspaceId) {
      setManager(null);
      setLoading(false);
      setError("Es ist aktuell kein Workspace ausgewählt.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await workspaceAppApi.googleReviews(workspaceId, { ...(locationId ? { locationId } : {}), limit: 120 });
      setManager(response.data);
    } catch (cause) {
      setManager(null);
      if (cause instanceof ApiError && ["GOOGLE_BUSINESS_NOT_CONNECTED", "GOOGLE_BUSINESS_REAUTH_REQUIRED"].includes(cause.code)) return;
      setError(getFriendlyErrorMessage(cause, "Die Google-Reviews konnten nicht geladen werden."));
    } finally {
      setLoading(false);
    }
  }, [locationId, workspaceId]);

  useEffect(() => { void refresh(); }, [refresh]);

  useEffect(() => {
    setReplyDrafts((current) => {
      const next = { ...current };
      for (const review of manager?.reviews ?? []) next[review.id] ??= review.reviewReply?.comment ?? review.suggestedReply;
      return next;
    });
  }, [manager?.reviews]);

  const visibleReviews = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (manager?.reviews ?? []).filter((review) => !normalized || `${review.reviewerDisplayName} ${review.comment} ${review.summary} ${review.locationTitle} ${review.topics.join(" ")}`.toLowerCase().includes(normalized));
  }, [manager?.reviews, query]);

  const connectGoogleBusiness = useCallback(async () => {
    if (!workspaceId) { setError("Es ist aktuell kein Workspace ausgewählt."); return; }
    setBusyConnect(true);
    setError(null);
    try {
      const response = await workspaceAppApi.connectGoogleBusiness(workspaceId, { returnTo: "/app/daring-brook-9034" });
      window.location.assign(response.data.authorizationUrl);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Die Google-Business-Verbindung konnte nicht gestartet werden."));
      setBusyConnect(false);
    }
  }, [workspaceId]);

  const saveReply = useCallback(async (review: GoogleReviewsManagerReview) => {
    if (!workspaceId) { setError("Es ist aktuell kein Workspace ausgewählt."); return; }
    const comment = (replyDrafts[review.id] ?? "").trim();
    if (comment.length < 3) { setError("Die Antwort muss mindestens 3 Zeichen lang sein."); return; }
    setSavingReviewId(review.id);
    setError(null);
    setNotice(null);
    try {
      await workspaceAppApi.updateGoogleReviewReply(workspaceId, review.id, { accountId: review.accountId, locationId: review.locationId, comment });
      setNotice(`Antwort für ${review.reviewerDisplayName} wurde gespeichert.`);
      await refresh();
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Die Google-Antwort konnte nicht gespeichert werden."));
    } finally {
      setSavingReviewId(null);
    }
  }, [refresh, replyDrafts, workspaceId]);

  const connected = Boolean(manager?.connected);

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 text-foreground sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">Website &amp; Commerce / Reviews</p>
            <h1 className="mt-2 text-3xl font-bold tracking-[-.045em] sm:text-4xl">Google Reviews Manager</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">Standorte, Review-Risiken und Owner Replies werden ausschließlich aus der verbundenen Workspace-Quelle geladen.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void refresh()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium hover:bg-secondary disabled:opacity-50"><RefreshCw size={15} className={loading ? "animate-spin" : undefined} />Aktualisieren</button>
            <button type="button" onClick={() => void connectGoogleBusiness()} disabled={busyConnect} className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"><Globe2 size={15} />{busyConnect ? "Verbinde…" : connected ? "Google neu verbinden" : "Google verbinden"}</button>
          </div>
        </header>

        {error ? <div role="alert" className="mt-5 flex items-start gap-3 rounded-2xl border border-destructive/25 bg-destructive/10 p-4 text-sm text-destructive"><AlertTriangle size={18} className="mt-0.5 shrink-0" />{error}</div> : null}
        {notice ? <div role="status" className="mt-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">{notice}</div> : null}

        {loading ? <section className="mt-6 grid min-h-[360px] place-items-center rounded-3xl border border-border bg-card"><div className="flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle size={20} className="animate-spin" />Google Reviews werden geladen…</div></section> : !connected ? <section className="mt-6 grid gap-5 rounded-3xl border border-dashed border-border bg-card p-8 lg:grid-cols-[1fr_320px] lg:p-10"><div><StatusPill tone="warning"><Unplug size={13} />Nicht verbunden</StatusPill><h2 className="mt-4 text-2xl font-semibold">Verbinde Google Business Profile</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Lulu kann Reviews, Standorte und Antwortentwürfe erst anzeigen, wenn dieser Workspace eine gültige Verbindung besitzt. Es werden keine Beispielwerte dargestellt.</p><button type="button" onClick={() => void connectGoogleBusiness()} disabled={busyConnect} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"><Globe2 size={16} />{busyConnect ? "Verbinde…" : "Verbindung starten"}</button></div><div className="rounded-2xl border border-border bg-background/60 p-5 text-sm"><p className="font-semibold">Live-Daten nach der Verbindung</p><ul className="mt-4 space-y-3 text-muted-foreground"><li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 text-emerald-600" />Standorte und Bewertungsstatus</li><li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 text-emerald-600" />Priorisierte Reviews</li><li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 text-emerald-600" />Speicherbare Owner Replies</li></ul></div></section> : <>
          <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[['Reviews', manager?.summary.totalReviews ?? 0], ['Bewertung', manager?.summary.averageRating == null ? "—" : `${manager.summary.averageRating.toFixed(1)} / 5`], ['Antwortquote', `${manager?.summary.replyRate ?? 0}%`], ['Priorität', manager?.summary.priorityReviewCount ?? 0]].map(([label, value]) => <article key={String(label)} className="rounded-2xl border border-border bg-card p-5"><p className="text-xs uppercase tracking-[.12em] text-muted-foreground">{label}</p><strong className="mt-2 block text-2xl font-semibold">{value}</strong><p className="mt-2 text-xs text-muted-foreground">Verifizierter Workspace-Wert</p></article>)}
          </section>
          <section className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center"><label className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3"><Search size={16} className="text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Reviews durchsuchen" className="w-full bg-transparent text-sm outline-none" /></label><select value={locationId} onChange={(event) => setLocationId(event.target.value)} className="min-h-10 rounded-xl border border-border bg-background px-3 text-sm"><option value="">Alle Standorte</option>{(manager?.locations ?? []).map((location) => <option key={location.id} value={location.id}>{location.title}</option>)}</select><StatusPill tone="good"><Building2 size={13} />{manager?.locations.length ?? 0} Standorte</StatusPill></section>
          <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-card"><div className="border-b border-border p-5"><h2 className="text-lg font-semibold">Review Queue</h2><p className="mt-1 text-sm text-muted-foreground">{visibleReviews.length} verifizierte Reviews im aktuellen Filter.</p></div>{visibleReviews.length === 0 ? <div className="grid min-h-[260px] place-items-center p-8 text-center"><ShieldAlert size={28} className="text-muted-foreground" /><p className="mt-3 text-sm text-muted-foreground">Keine Reviews für diesen Filter gefunden.</p></div> : <div className="divide-y divide-border">{visibleReviews.map((review) => <article key={review.id} className="p-5 sm:p-6"><div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{review.reviewerDisplayName}</h3><Stars rating={review.starRating} /><StatusPill tone={review.urgency === "critical" || review.urgency === "high" ? "danger" : review.urgency === "medium" ? "warning" : "neutral"}>{review.urgency}</StatusPill>{review.requiresHuman ? <StatusPill tone="warning"><ShieldAlert size={12} />Human review</StatusPill> : null}</div><p className="mt-2 text-xs text-muted-foreground">{review.locationTitle} · {formatDate(review.updateTime ?? review.createTime)}</p><p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">{review.comment || review.summary || "Keine öffentliche Bewertung zurückgegeben."}</p><div className="mt-3 flex flex-wrap gap-2">{review.topics.map((topic) => <StatusPill key={topic}>{topic}</StatusPill>)}</div></div><div className="w-full max-w-xl rounded-2xl border border-border bg-background/60 p-4"><div className="flex items-center justify-between gap-3"><h4 className="flex items-center gap-2 text-sm font-semibold"><MessageSquareReply size={15} />Owner Reply</h4><span className="text-xs text-muted-foreground">{review.reviewReply ? "Gespeichert" : "Entwurf"}</span></div><textarea value={replyDrafts[review.id] ?? ""} onChange={(event) => setReplyDrafts((current) => ({ ...current, [review.id]: event.target.value }))} rows={5} className="mt-3 w-full resize-y rounded-xl border border-border bg-card px-3 py-3 text-sm outline-none" /><div className="mt-3 flex flex-wrap justify-end gap-2"><button type="button" onClick={() => setReplyDrafts((current) => ({ ...current, [review.id]: review.suggestedReply }))} className="rounded-xl border border-border px-3 py-2 text-xs font-medium hover:bg-secondary">AI-Entwurf laden</button><button type="button" onClick={() => void saveReply(review)} disabled={savingReviewId === review.id} className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">{savingReviewId === review.id ? "Speichert…" : "Antwort speichern"}</button></div></div></div></article>)}</div>}</section>
        </>}
      </div>
    </main>
  );
}
