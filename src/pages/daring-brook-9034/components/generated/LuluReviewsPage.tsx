import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, Bot, Building2, CheckCheck, ChevronDown, Globe2, Loader2, Menu, MessageSquareReply, RefreshCw, Search, ShieldAlert, Sparkles, Star, Store, Unplug } from 'lucide-react';
import { ApiError, getFriendlyErrorMessage } from '../../../../api/client';
import { onboardingApi } from '../../../../api/onboarding';
import { getSelectedWorkspaceId } from '../../../../api/session';
import { workspaceAppApi, type GoogleReviewsLocation, type GoogleReviewsManagerReview, type GoogleReviewsManagerState } from '../../../../api/workspace-app';

type ConnectionMode = 'connected' | 'disconnected' | 'reauth';
type SentimentFilter = 'all' | 'positive' | 'mixed' | 'negative';
type ReviewScope = 'all' | 'unanswered' | 'priority';

const urgencyRank: Record<GoogleReviewsManagerReview['urgency'], number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
};

const ratingCopy = (value: number | null) => value == null ? '—' : `${value.toFixed(1)} / 5`;
const compactNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

function formatDate(value: string | null) {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(parsed);
}

function locationLabel(location: GoogleReviewsLocation) {
  return location.address ? `${location.title} · ${location.address}` : location.title;
}

function Pill({
  children,
  tone = 'gray',
  icon
}: {
  children: ReactNode;
  tone?: 'gray' | 'green' | 'amber' | 'red' | 'purple' | 'blue';
  icon?: ReactNode;
}) {
  const tones: Record<string, string> = {
    gray: 'bg-secondary text-muted-foreground',
    green: 'bg-chart-4/10 text-chart-4',
    amber: 'bg-chart-1/10 text-[var(--chart-1)]',
    red: 'bg-chart-5/10 text-chart-5',
    purple: 'bg-primary/10 text-primary',
    blue: 'bg-secondary/70 text-foreground'
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${tones[tone]}`}>{icon}{children}</span>;
}

function Stars({
  rating
}: {
  rating: number;
}) {
  return <span className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} className={star <= rating ? 'fill-current text-[var(--chart-1)]' : 'text-muted-foreground/40'} />)}
  </span>;
}

function SummaryCard({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return <article className="rounded-xl border border-[var(--border)] bg-card p-4">
    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
    <strong className="mt-2 block text-2xl">{value}</strong>
    <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
  </article>;
}

function ListBlock({
  title,
  items,
  empty
}: {
  title: string;
  items: string[];
  empty: string;
}) {
  return <div className="rounded-xl border border-[var(--border)] bg-card/60 p-4">
    <h3 className="text-sm font-semibold">{title}</h3>
    <div className="mt-3 space-y-2 text-xs text-muted-foreground">
      {items.length === 0 ? <p>{empty}</p> : items.map(item => <p key={item}>• {item}</p>)}
    </div>
  </div>;
}

export function LuluReviewsPage() {
  const [mobile, setMobile] = useState(false);
  const [manager, setManager] = useState<GoogleReviewsManagerState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('connected');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [query, setQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>('all');
  const [reviewScope, setReviewScope] = useState<ReviewScope>('all');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [busyConnect, setBusyConnect] = useState(false);
  const [savingReviewId, setSavingReviewId] = useState<string | null>(null);
  const workspaceId = getSelectedWorkspaceId();

  const refresh = useCallback(async () => {
    if (!workspaceId) {
      setManager(null);
      setLoading(false);
      setError('Es ist aktuell kein Workspace ausgewählt.');
      setConnectionMode('disconnected');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await workspaceAppApi.googleReviews(workspaceId, {
        ...(selectedLocationId ? { locationId: selectedLocationId } : {}),
        limit: 120
      });
      setManager(response.data);
      setConnectionMode(response.data.connected ? 'connected' : 'disconnected');
    } catch (cause) {
      setManager(null);
      if (cause instanceof ApiError && cause.code === 'GOOGLE_BUSINESS_REAUTH_REQUIRED') {
        setConnectionMode('reauth');
        setError(null);
      } else if (cause instanceof ApiError && cause.code === 'GOOGLE_BUSINESS_NOT_CONNECTED') {
        setConnectionMode('disconnected');
        setError(null);
      } else {
        setConnectionMode('connected');
        setError(getFriendlyErrorMessage(cause, 'Die Google-Reviews-Analyse konnte nicht geladen werden.'));
      }
    } finally {
      setLoading(false);
    }
  }, [selectedLocationId, workspaceId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    setReplyDrafts(current => {
      const next = { ...current };
      for (const review of manager?.reviews ?? []) {
        if (!(review.id in next)) {
          next[review.id] = review.reviewReply?.comment ?? review.suggestedReply;
        }
      }
      return next;
    });
  }, [manager?.reviews]);

  const visibleReviews = useMemo(() => {
    return [...(manager?.reviews ?? [])]
      .filter(review => {
        if (query) {
          const haystack = `${review.reviewerDisplayName} ${review.comment} ${review.summary} ${review.locationTitle} ${review.topics.join(' ')}`.toLowerCase();
          if (!haystack.includes(query.toLowerCase())) return false;
        }
        if (sentimentFilter !== 'all' && review.sentiment !== sentimentFilter) return false;
        if (reviewScope === 'unanswered' && review.reviewReply) return false;
        if (reviewScope === 'priority' && !['critical', 'high'].includes(review.urgency)) return false;
        return true;
      })
      .sort((left, right) => {
        const urgencyDelta = urgencyRank[right.urgency] - urgencyRank[left.urgency];
        if (urgencyDelta) return urgencyDelta;
        return Date.parse(right.updateTime ?? right.createTime ?? '') - Date.parse(left.updateTime ?? left.createTime ?? '');
      });
  }, [manager?.reviews, query, reviewScope, sentimentFilter]);

  const activeLocation = useMemo(() => manager?.locations.find(location => location.id === selectedLocationId) ?? null, [manager?.locations, selectedLocationId]);
  const topLocations = (manager?.locations ?? []).slice(0, 6);

  const connectGoogleBusiness = useCallback(async () => {
    if (!workspaceId) {
      setError('Es ist aktuell kein Workspace ausgewählt.');
      return;
    }
    setBusyConnect(true);
    setError(null);
    try {
      const response = await onboardingApi.startOAuth(workspaceId, 'google-business', undefined, '/app/daring-brook-9034');
      window.location.assign(response.data.authorizationUrl);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'Die Google-Business-Verbindung konnte nicht gestartet werden.'));
      setBusyConnect(false);
    }
  }, [workspaceId]);

  const saveReply = useCallback(async (review: GoogleReviewsManagerReview) => {
    if (!workspaceId) {
      setError('Es ist aktuell kein Workspace ausgewählt.');
      return;
    }
    const comment = (replyDrafts[review.id] ?? '').trim();
    if (comment.length < 3) {
      setError('Die Antwort muss mindestens 3 Zeichen lang sein.');
      return;
    }

    setSavingReviewId(review.id);
    setError(null);
    setMessage(null);
    try {
      await workspaceAppApi.updateGoogleReviewReply(workspaceId, review.id, {
        accountId: review.accountId,
        locationId: review.locationId,
        comment
      });
      setMessage(`Antwort für ${review.reviewerDisplayName} wurde gespeichert.`);
      await refresh();
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, 'Die Google-Antwort konnte nicht gespeichert werden.'));
    } finally {
      setSavingReviewId(null);
    }
  }, [refresh, replyDrafts, workspaceId]);

  return <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]" style={{
    fontFamily: 'Poppins'
  }}>
    {mobile && <button className="fixed inset-0 z-20 bg-black/30 lg:hidden" aria-label="Close navigation" onClick={() => setMobile(false)} />}
    <aside className={`${mobile ? 'flex' : 'hidden'} fixed inset-y-0 left-0 z-30 w-[220px] flex-col bg-[var(--sidebar)] px-3 py-5 lg:flex`}>
      <div className="mb-7 flex items-center gap-2 px-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--primary)] font-bold text-primary-foreground">L</span>
        <strong className="text-foreground">Lulu AI</strong>
        <button className="ml-auto rounded-md p-1 text-foreground lg:hidden" onClick={() => setMobile(false)} aria-label="Close navigation">
          <ChevronDown size={18} />
        </button>
      </div>
      <LuluSectionNavigation activeId="daring-brook-9034" />
      <div className="flex items-center gap-2 border-t border-[var(--muted-foreground)] pt-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] text-xs text-foreground">DM</span>
        <span className="text-xs text-foreground">Workspace owner</span>
      </div>
    </aside>

    <main className="lg:ml-[220px]">
      <header className="flex h-14 items-center justify-between bg-[var(--sidebar)] px-4 text-foreground sm:px-7">
        <div className="flex items-center gap-3">
          <button className="lg:hidden" onClick={() => setMobile(true)} aria-label="Open navigation">
            <Menu size={19} />
          </button>
          <span className="text-xs text-muted-foreground">Website &amp; Commerce</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-xs">Reviews</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => void refresh()} className="hidden text-xs text-foreground sm:block">
            <RefreshCw size={14} className="mr-1 inline" />
            Refresh
          </button>
          <button onClick={() => void connectGoogleBusiness()} disabled={busyConnect} className="rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-[var(--primary-foreground)] disabled:opacity-60">
            {busyConnect ? <Loader2 size={13} className="mr-1 inline animate-spin" /> : <Globe2 size={13} className="mr-1 inline" />}
            {connectionMode === 'connected' ? 'Reconnect Google' : connectionMode === 'reauth' ? 'Reconnect Google' : 'Connect Google'}
          </button>
        </div>
      </header>

      <div className="px-4 py-6 sm:px-8">
        {error && <div role="alert" className="mb-5 rounded-lg border border-chart-5/30 bg-chart-5/10 px-4 py-3 text-sm text-chart-5">{error}</div>}
        {message && <div className="mb-5 rounded-lg border border-chart-4/30 bg-chart-4/10 px-4 py-3 text-sm text-chart-4">{message}</div>}

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Pill tone="purple" icon={<Sparkles size={12} />}>Reputation Intelligence</Pill>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Google Reviews Manager</h1>
            <p className="mt-1 max-w-3xl text-sm text-[var(--muted-foreground)]">Google Business Profile wird jetzt zentral im Backend analysiert: Standorte, Review-Risiken, Antwortabdeckung, Priorisierung und Owner Replies laufen direkt aus einer strukturierten Workspace-Engine.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Pill tone={connectionMode === 'connected' ? 'green' : connectionMode === 'reauth' ? 'amber' : 'gray'} icon={connectionMode === 'connected' ? <CheckCheck size={12} /> : connectionMode === 'reauth' ? <ShieldAlert size={12} /> : <Unplug size={12} />}>
              {connectionMode === 'connected' ? 'Google verbunden' : connectionMode === 'reauth' ? 'Reauth nötig' : 'Nicht verbunden'}
            </Pill>
            {manager?.aiAvailable && <Pill tone="blue" icon={<Bot size={12} />}>AI Reply Drafts aktiv</Pill>}
          </div>
        </div>

        {!workspaceId ? <section className="mt-6 rounded-xl border border-[var(--border)] bg-card p-6">
            <h2 className="text-lg font-bold">Kein Workspace ausgewählt</h2>
            <p className="mt-2 text-sm text-muted-foreground">Sobald ein Workspace aktiv ist, lädt Lulu automatisch die verbundene Google-Business-Struktur, priorisiert Reviews und stellt Reply-Workflows bereit.</p>
          </section> : loading ? <section className="mt-6 grid min-h-[260px] place-items-center rounded-xl border border-[var(--border)] bg-card p-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              Google Reviews Manager wird geladen…
            </div>
          </section> : connectionMode !== 'connected' || !manager?.connected ? <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <article className="rounded-xl border border-[var(--border)] bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">{connectionMode === 'reauth' ? 'Google Business Verbindung abgelaufen' : 'Google Business noch nicht verbunden'}</h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Damit Lulu Reviews, Standorte, Prioritäten und Owner Replies automatisch verwalten kann, braucht dieser Workspace eine gültige Google-Business-Profile-Verbindung mit dem Scope `business.manage`.</p>
                </div>
                <Pill tone={connectionMode === 'reauth' ? 'amber' : 'gray'}>{connectionMode === 'reauth' ? 'Reconnect required' : 'Connect required'}</Pill>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <SummaryCard label="Was danach erscheint" value="Standorte" detail="Alle verfügbaren Google-Business-Locations mit Review-Volumen und Negativquote." />
                <SummaryCard label="Was danach erscheint" value="Prioritäten" detail="Offene kritische Reviews, Reply-Abdeckung und konkrete Service-Recovery-Aktionen." />
                <SummaryCard label="Was danach erscheint" value="Replies" detail="Vorgeschlagene Antworttexte, direkt speicherbar als Owner Reply." />
              </div>
            </article>

            <article className="rounded-xl border border-[var(--border)] bg-card p-5">
              <h2 className="font-bold">Nächste Schritte</h2>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p>1. Google-Business-Konto verbinden</p>
                <p>2. Richtige Business-Profile-Locations freigeben</p>
                <p>3. Lulu lädt Reviews und priorisiert offene Fälle automatisch</p>
              </div>
              <button onClick={() => void connectGoogleBusiness()} disabled={busyConnect} className="mt-5 w-full rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60">
                {busyConnect ? 'Verbinde...' : connectionMode === 'reauth' ? 'Google erneut verbinden' : 'Google jetzt verbinden'}
              </button>
            </article>
          </section> : <>
            <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="Total Reviews" value={compactNumber(manager.summary.totalReviews)} detail="Alle aktuell geladenen Google Reviews im Workspace-Scope." />
              <SummaryCard label="Average Rating" value={ratingCopy(manager.summary.averageRating)} detail="Gewichteter Durchschnitt über die geladenen Reviews." />
              <SummaryCard label="Reply Rate" value={`${manager.summary.replyRate}%`} detail={`${compactNumber(manager.summary.unansweredCount)} Reviews sind noch unbeantwortet.`} />
              <SummaryCard label="Priority Queue" value={compactNumber(manager.summary.priorityReviewCount)} detail={`${compactNumber(manager.summary.negativeCount)} negative und ${compactNumber(manager.summary.mixedCount)} gemischte Reviews brauchen Aufmerksamkeit.`} />
            </section>

            <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <article className="rounded-xl border border-[var(--border)] bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">Executive Reputation Summary</h2>
                    <p className="mt-1 text-xs text-muted-foreground">Autonom priorisierte Review-Lage aus Google Business Profile.</p>
                  </div>
                  <Pill tone="purple">{formatDate(manager.generatedAt)}</Pill>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{manager.insights.headline}</p>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <ListBlock title="Strengths" items={manager.insights.strengths} empty="Noch keine klaren Stärken erkennbar." />
                  <ListBlock title="Risks" items={manager.insights.risks} empty="Aktuell keine akuten Reputationsrisiken erkannt." />
                  <ListBlock title="Recommended Actions" items={manager.insights.recommendedActions} empty="Noch keine konkreten Maßnahmen nötig." />
                  <ListBlock title="Data Gaps" items={manager.insights.dataGaps} empty="Keine offensichtlichen Datenlücken erkannt." />
                </div>
              </article>

              <article className="rounded-xl border border-[var(--border)] bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">Filters & Topics</h2>
                    <p className="mt-1 text-xs text-muted-foreground">Standort, Sentiment und Priorität direkt auf die echte Review-Lage anwenden.</p>
                  </div>
                  <Pill tone="green" icon={<Building2 size={12} />}>{manager.locations.length} locations</Pill>
                </div>

                <div className="mt-4 grid gap-3">
                  <label className="relative flex items-center">
                    <select value={selectedLocationId} onChange={event => setSelectedLocationId(event.target.value)} className="w-full appearance-none rounded-lg border border-[var(--border)] bg-card px-3 py-2 pr-8 text-xs text-foreground">
                      <option value="">All locations</option>
                      {manager.locations.map(location => <option key={location.id} value={location.id}>{location.title}</option>)}
                    </select>
                    <ChevronDown size={12} className="pointer-events-none absolute right-3 text-muted-foreground" />
                  </label>

                  <label className="relative flex items-center rounded-lg border border-[var(--border)] px-3">
                    <Search size={15} className="text-muted-foreground" />
                    <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search reviewer, topic, summary" className="w-full py-2 text-xs outline-none" />
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="relative flex items-center">
                      <select value={sentimentFilter} onChange={event => setSentimentFilter(event.target.value as SentimentFilter)} className="w-full appearance-none rounded-lg border border-[var(--border)] bg-card px-3 py-2 pr-8 text-xs text-foreground">
                        <option value="all">All sentiment</option>
                        <option value="positive">Positive</option>
                        <option value="mixed">Mixed</option>
                        <option value="negative">Negative</option>
                      </select>
                      <ChevronDown size={12} className="pointer-events-none absolute right-3 text-muted-foreground" />
                    </label>

                    <label className="relative flex items-center">
                      <select value={reviewScope} onChange={event => setReviewScope(event.target.value as ReviewScope)} className="w-full appearance-none rounded-lg border border-[var(--border)] bg-card px-3 py-2 pr-8 text-xs text-foreground">
                        <option value="all">All reviews</option>
                        <option value="unanswered">Unanswered only</option>
                        <option value="priority">Priority only</option>
                      </select>
                      <ChevronDown size={12} className="pointer-events-none absolute right-3 text-muted-foreground" />
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {manager.insights.topTopics.map(topic => <Pill key={topic.topic} tone="blue">{topic.topic} · {topic.count}</Pill>)}
                    {!manager.insights.topTopics.length && <Pill>No recurring topics yet</Pill>}
                  </div>
                </div>
              </article>
            </section>

            <section className="mt-6 rounded-xl border border-[var(--border)] bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Managed Locations</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Standortweite Review-Abdeckung und Negativquote aus Google Business Profile.</p>
                </div>
                {activeLocation && <Pill tone="purple">{activeLocation.title}</Pill>}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {topLocations.map(location => <button key={location.id} type="button" onClick={() => setSelectedLocationId(current => current === location.id ? '' : location.id)} className={`rounded-xl border p-4 text-left ${selectedLocationId === location.id ? 'border-[var(--primary)] bg-secondary/15' : 'border-[var(--border)] bg-card'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{location.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{location.address || 'Address unavailable'}</p>
                      </div>
                      <Store size={16} className="text-muted-foreground" />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Reviews</p>
                        <strong>{compactNumber(location.totalReviewCount)}</strong>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rating</p>
                        <strong>{ratingCopy(location.averageRating)}</strong>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Open</p>
                        <strong>{compactNumber(location.unansweredCount)}</strong>
                      </div>
                    </div>
                    <p className="mt-3 text-[11px] text-muted-foreground">{location.negativeCount} negative reviews currently mapped to this location.</p>
                  </button>)}
              </div>
            </section>

            <section className="mt-6 rounded-xl border border-[var(--border)] bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Review Queue</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Priorisierte Reviews mit Fakten, abgeleiteten Risiken und direkt speicherbaren Owner Replies.</p>
                </div>
                <Pill tone="green">{visibleReviews.length} visible reviews</Pill>
              </div>

              {!visibleReviews.length ? <div className="mt-5 rounded-xl border border-dashed border-[var(--border)] bg-background p-8 text-center">
                  <AlertTriangle className="mx-auto text-muted-foreground" size={24} />
                  <h3 className="mt-3 font-semibold">Keine Reviews im aktuellen Filter</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Passe Standort, Suche oder Scope an, damit Lulu wieder Reviews für die Bearbeitung anzeigen kann.</p>
                </div> : <div className="mt-5 space-y-4">
                  {visibleReviews.map(review => <article key={review.id} className="rounded-xl border border-[var(--border)] bg-background p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold">{review.reviewerDisplayName}</h3>
                            <Pill tone={review.sentiment === 'positive' ? 'green' : review.sentiment === 'mixed' ? 'amber' : 'red'}>{review.sentiment}</Pill>
                            <Pill tone={review.urgency === 'critical' ? 'red' : review.urgency === 'high' ? 'amber' : review.urgency === 'medium' ? 'blue' : 'gray'}>{review.urgency}</Pill>
                            {review.requiresHuman && <Pill tone="amber" icon={<ShieldAlert size={12} />}>Human review</Pill>}
                            {!review.reviewReply && <Pill tone="purple">Unanswered</Pill>}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <Stars rating={review.starRating} />
                            <span>{review.locationTitle}</span>
                            <span>{formatDate(review.updateTime ?? review.createTime)}</span>
                          </div>
                        </div>

                        <div className="max-w-xl text-sm text-muted-foreground">
                          <p>{review.summary}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                        <div>
                          <div className="rounded-xl border border-[var(--border)] bg-card p-4">
                            <p className="text-sm leading-6 text-muted-foreground">{review.comment || 'No public review comment was returned by Google for this entry.'}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {review.topics.map(topic => <Pill key={topic} tone="blue">{topic}</Pill>)}
                            </div>
                          </div>

                          <div className="mt-4 grid gap-3 md:grid-cols-3">
                            <ListBlock title="Verified facts" items={review.verifiedFacts} empty="No verified facts." />
                            <ListBlock title="Inferred issues" items={review.inferredIssues} empty="No inferred issues." />
                            <ListBlock title="Recommended actions" items={review.recommendedActions} empty="No recommended actions." />
                          </div>
                        </div>

                        <div className="rounded-xl border border-[var(--border)] bg-card p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <h4 className="font-semibold">Owner Reply</h4>
                              <p className="mt-1 text-xs text-muted-foreground">Lulu schlägt die Antwort vor, du kannst sie direkt an Google senden.</p>
                            </div>
                            <Pill tone="purple" icon={<MessageSquareReply size={12} />}>AI draft</Pill>
                          </div>

                          {review.reviewReply && <div className="mt-4 rounded-lg border border-chart-4/30 bg-chart-4/10 p-3 text-xs text-chart-4">
                              Bereits live beantwortet am {formatDate(review.reviewReply.updateTime)}.
                            </div>}

                          <textarea value={replyDrafts[review.id] ?? ''} onChange={event => setReplyDrafts(current => ({
                        ...current,
                        [review.id]: event.target.value
                      }))} rows={7} className="mt-4 w-full rounded-xl border border-[var(--border)] bg-background px-3 py-3 text-sm outline-none" />

                          <div className="mt-4 flex flex-wrap gap-2">
                            <button type="button" onClick={() => setReplyDrafts(current => ({
                          ...current,
                          [review.id]: review.suggestedReply
                        }))} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium">
                              AI suggestion reset
                            </button>
                            <button type="button" onClick={() => void saveReply(review)} disabled={savingReviewId === review.id} className="rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60">
                              {savingReviewId === review.id ? 'Saving...' : 'Save owner reply'}
                            </button>
                          </div>

                          <p className="mt-4 text-[11px] text-muted-foreground">Account: {review.accountId} · Location: {review.locationId} · Public address: {review.locationAddress || 'n/a'}</p>
                        </div>
                      </div>
                    </article>)}
                </div>}
            </section>
          </>}
      </div>
    </main>
  </div>;
}
/* Lulu dropdown navigation — intentionally isolated from page content. */
const luluDropdownNavigation = [{
  "label": "Dashboard",
  "pages": [{
    "id": "fancily-leaf-1766",
    "label": "Executive Dashboard"
  }]
}, {
  "label": "AI",
  "pages": [{
    "id": "fresh-moon-5374",
    "label": "Assistant"
  }, {
    "id": "radiant-dusk-9079",
    "label": "Agents"
  }, {
    "id": "calmly-park-3313",
    "label": "Agent Marketplace"
  }, {
    "id": "rich-field-1880",
    "label": "Knowledge"
  }, {
    "id": "wondrously-second-5656",
    "label": "Actions"
  }, {
    "id": "sunny-moon-6307",
    "label": "Conversations"
  }, {
    "id": "sparkling-cave-8456",
    "label": "Activity"
  }]
}, {
  "label": "CRM",
  "pages": [{
    "id": "bright-meadow-7537",
    "label": "Overview"
  }, {
    "id": "sturdy-month-1562",
    "label": "Contacts"
  }, {
    "id": "kindly-pool-8785",
    "label": "Companies"
  }, {
    "id": "swift-hour-7844",
    "label": "Leads"
  }, {
    "id": "smartly-shade-4619",
    "label": "Deals"
  }, {
    "id": "calmly-cloud-9988",
    "label": "Pipeline"
  }, {
    "id": "cosmic-pool-1616",
    "label": "Activities"
  }, {
    "id": "deeply-noon-9539",
    "label": "Tasks"
  }, {
    "id": "sunnily-gulf-7520",
    "label": "Customer Segments"
  }, {
    "id": "gracefully-storm-2649",
    "label": "Customer Intelligence"
  }]
}, {
  "label": "Marketing",
  "pages": [{
    "id": "dreamily-soil-9290",
    "label": "Campaigns"
  }, {
    "id": "wondrous-cloud-1355",
    "label": "Content"
  }, {
    "id": "sparklingly-home-7386",
    "label": "Strategy"
  }, {
    "id": "gently-shade-2476",
    "label": "Campaigns"
  }, {
    "id": "kind-time-4492",
    "label": "Keywords"
  }, {
    "id": "smartly-shore-1468",
    "label": "Competitors"
  }, {
    "id": "breezily-wood-5980",
    "label": "Audiences"
  }, {
    "id": "breezy-shore-6734",
    "label": "Analytics"
  }]
}, {
  "label": "Advertising",
  "pages": [{
    "id": "finely-garden-9221",
    "label": "Overview"
  }, {
    "id": "friendly-path-8200",
    "label": "Analytics"
  }, {
    "id": "wise-brook-1762",
    "label": "Campaigns"
  }, {
    "id": "softly-second-7684",
    "label": "Audiences"
  }, {
    "id": "happily-storm-2690",
    "label": "Creatives"
  }, {
    "id": "sunny-minute-1092",
    "label": "Budgets"
  }, {
    "id": "zesty-grass-9196",
    "label": "AI Optimization"
  }, {
    "id": "nicely-shade-2637",
    "label": "Tracking & Attribution"
  }, {
    "id": "nice-moon-2056",
    "label": "AI Campaign & Ad Builder"
  }, {
    "id": "sunnily-peak-7188",
    "label": "Publishing & Approval Center"
  }, {
    "id": "solid-sand-5563",
    "label": "AI Experiments & A/B Testing"
  }, {
    "id": "sunny-summer-2293",
    "label": "Ad Accounts & Platform Management"
  }]
}, {
  "label": "Intelligence",
  "pages": [{
    "id": "serene-cloud-7079",
    "label": "Intelligence Overview"
  }, {
    "id": "tender-water-4095",
    "label": "Executive Overview"
  }, {
    "id": "swiftly-cliff-4166",
    "label": "Business Health"
  }, {
    "id": "sharp-current-9677",
    "label": "Growth"
  }, {
    "id": "proudly-river-8017",
    "label": "Revenue"
  }, {
    "id": "dreamily-shade-6192",
    "label": "Customers"
  }, {
    "id": "nicely-hour-4035",
    "label": "Sales"
  }, {
    "id": "eagerly-winter-3152",
    "label": "Marketing"
  }, {
    "id": "sharply-wood-4560",
    "label": "Advertising Intelligence"
  }, {
    "id": "bold-ocean-5847",
    "label": "Ecommerce Intelligence"
  }, {
    "id": "cozily-path-5612",
    "label": "Finance Intelligence"
  }, {
    "id": "gently-light-6089",
    "label": "Operations Intelligence"
  }, {
    "id": "cool-town-1727",
    "label": "Products Intelligence"
  }, {
    "id": "swift-pool-5077",
    "label": "KPI Explorer"
  }, {
    "id": "friendly-ground-4157",
    "label": "Reports"
  }, {
    "id": "brave-stream-5322",
    "label": "Comparisons"
  }, {
    "id": "sparkling-time-5280",
    "label": "Comparisons"
  }, {
    "id": "wispy-current-7490",
    "label": "Forecasts"
  }, {
    "id": "kindly-year-8981",
    "label": "Benchmarks"
  }, {
    "id": "serenely-creek-1765",
    "label": "Trends"
  }, {
    "id": "sparklingly-light-7230",
    "label": "Anomalies"
  }, {
    "id": "clever-soil-5964",
    "label": "Attribution"
  }, {
    "id": "serenely-week-1771",
    "label": "AI Insights"
  }, {
    "id": "daring-home-4179",
    "label": "AI Recommendations"
  }, {
    "id": "wispy-leaf-3778",
    "label": "AI Tasks"
  }, {
    "id": "happily-brook-7061",
    "label": "Opportunities"
  }, {
    "id": "radiant-cave-9340",
    "label": "Decisions"
  }, {
    "id": "boldly-time-5189",
    "label": "Risk Center"
  }, {
    "id": "proud-rain-4772",
    "label": "Activity Timeline"
  }]
}, {
  "label": "Finance",
  "pages": [{
    "id": "quietly-stone-4158",
    "label": "Overview"
  }, {
    "id": "breezy-soil-2475",
    "label": "Invoices"
  }, {
    "id": "tender-creek-3139",
    "label": "Offers & Quotes"
  }, {
    "id": "cool-rain-6499",
    "label": "Income"
  }, {
    "id": "richly-land-8084",
    "label": "Transactions"
  }, {
    "id": "calm-tide-3752",
    "label": "Payments"
  }, {
    "id": "zesty-earth-3938",
    "label": "Expenses"
  }, {
    "id": "bravely-bay-4544",
    "label": "Customers"
  }, {
    "id": "eager-minute-1586",
    "label": "Vendors"
  }, {
    "id": "fair-bridge-8618",
    "label": "Accounts"
  }, {
    "id": "soft-town-3284",
    "label": "Cash Flow"
  }, {
    "id": "wisely-gate-3183",
    "label": "Budgets"
  }, {
    "id": "sharp-morning-7310",
    "label": "Financial Planning"
  }, {
    "id": "sparklingly-city-3338",
    "label": "Reconciliation"
  }, {
    "id": "radiant-hour-5376",
    "label": "Recurring Revenue"
  }, {
    "id": "lucky-park-8649",
    "label": "Payouts"
  }, {
    "id": "vibrantly-second-9428",
    "label": "Financial Automation"
  }, {
    "id": "sturdy-week-3372",
    "label": "Taxes"
  }, {
    "id": "boldly-field-4971",
    "label": "Finance Settings"
  }]
}, {
  "label": "Sales",
  "pages": [{
    "id": "fine-park-8079",
    "label": "Overview"
  }, {
    "id": "softly-autumn-9038",
    "label": "Leads"
  }, {
    "id": "wildly-sun-6424",
    "label": "Opportunities"
  }, {
    "id": "deeply-month-1392",
    "label": "Deals"
  }, {
    "id": "sweet-evening-7753",
    "label": "Pipeline"
  }, {
    "id": "warmly-road-3804",
    "label": "Activities"
  }, {
    "id": "wondrously-gate-2200",
    "label": "Tasks"
  }, {
    "id": "sharp-cliff-6925",
    "label": "Customer Segments"
  }, {
    "id": "lovingly-shore-4782",
    "label": "Forecast"
  }, {
    "id": "rich-moon-9195",
    "label": "Reports"
  }, {
    "id": "lively-house-6788",
    "label": "Commissions"
  }, {
    "id": "gentle-cliff-7133",
    "label": "Goals"
  }, {
    "id": "kindly-morning-7115",
    "label": "Territories"
  }, {
    "id": "friendly-tower-1528",
    "label": "Lead Assignment"
  }]
}, {
  "label": "Website & Commerce",
  "pages": [{
    "id": "lulu-website-portal-9012",
    "label": "Website"
  }, {
    "id": "website-wordpress-jetpack-9013",
    "label": "WordPress / Jetpack"
  }, {
    "id": "website-webflow-9014",
    "label": "Webflow"
  }, {
    "id": "website-pages-cms-9015",
    "label": "Pages & CMS"
  }, {
    "id": "website-posts-9016",
    "label": "Posts"
  }, {
    "id": "website-media-assets-9017",
    "label": "Media & Assets"
  }, {
    "id": "website-domains-9018",
    "label": "Domains"
  }, {
    "id": "sparklingly-moon-5114",
    "label": "SEO"
  }, {
    "id": "zealously-path-4224",
    "label": "GEO"
  }, {
    "id": "sunny-house-9595",
    "label": "AEO"
  }, {
    "id": "daring-brook-9034",
    "label": "Reviews"
  }, {
    "id": "smart-ocean-3898",
    "label": "Overview"
  }, {
    "id": "nice-year-6253",
    "label": "Stores"
  }, {
    "id": "nicely-ocean-1051",
    "label": "Products"
  }, {
    "id": "richly-forest-5832",
    "label": "Categories"
  }, {
    "id": "mightily-shore-7108",
    "label": "Orders"
  }, {
    "id": "fancy-ground-8040",
    "label": "Customers"
  }, {
    "id": "serenely-sand-9226",
    "label": "Carts"
  }, {
    "id": "smart-village-1099",
    "label": "Inventory"
  }, {
    "id": "dreamy-shade-5445",
    "label": "Returns & Refunds"
  }, {
    "id": "sharply-sky-4161",
    "label": "Discounts & Promotions"
  }, {
    "id": "wildly-time-4260",
    "label": "Carts & Abandoned Carts"
  }, {
    "id": "quietly-moon-4186",
    "label": "Shipping"
  }, {
    "id": "merry-castle-3260",
    "label": "Payments"
  }, {
    "id": "merry-cliff-8846",
    "label": "Coupons"
  }, {
    "id": "safely-dawn-7731",
    "label": "Subscriptions"
  }, {
    "id": "purely-dusk-2409",
    "label": "Shipping & Fulfillment"
  }, {
    "id": "soft-hill-4757",
    "label": "Taxes"
  }, {
    "id": "safely-air-9334",
    "label": "Collections"
  }, {
    "id": "merry-land-6169",
    "label": "Store Performance"
  }]
}, {
  "label": "Settings",
  "pages": [{
    "id": "nicely-land-1864",
    "label": "Settings"
  }, {
    "id": "glad-coast-1428",
    "label": "Integrations"
  }, {
    "id": "pure-minute-5446",
    "label": "Billing"
  }]
}] as const;
function LuluSectionNavigation({
  activeId
}: {
  activeId: string;
}) {
  return <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1" aria-label="Lulu AI sections">
    {luluDropdownNavigation.map(section => {
      const isActiveSection = section.pages.some(page => page.id === activeId);
      return <details key={section.label} open={isActiveSection} className="group rounded-lg">
        <summary className={`flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2.5 text-sm transition [&::-webkit-details-marker]:hidden ${isActiveSection ? 'bg-secondary/15 font-medium text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
          <span data-lulu-section-soon={section.label !== "Website & Commerce" && section.label !== "Settings" ? "true" : undefined}>{section.label}</span>
          <span aria-hidden="true" className="text-xs transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <div className="ml-3 mt-1 space-y-0.5 border-l border-border pl-2 pb-1">
          {section.pages.map(page => {
            const isActivePage = page.id === activeId;
            return <a key={page.id} {...pageLinkProps(page.id)} aria-current={isActivePage ? 'page' : undefined} className={`block rounded-md px-3 py-2 text-xs transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {page.label}
              {!pageLinkProps(page.id)["data-lulu-soon"] ? null : null}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}
import { pageLinkProps } from '../../../../routing';
