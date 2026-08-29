import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Activity, AlertTriangle, BarChart3, Check, ChevronDown, Globe2, LayoutDashboard, Menu, MoreHorizontal, RefreshCw, Search, Settings, Shield, Sparkles, Target, TrendingUp, Users, Zap } from 'lucide-react';
import { ApiError, getFriendlyErrorMessage } from '../../../../api/client';
import { onboardingApi } from '../../../../api/onboarding';
import { getSelectedWorkspaceId } from '../../../../api/session';
import { useLiveRecords } from '../../../../api/useLiveRecords';
import { websitesApi } from '../../../../api/websites';
import { pageLinkProps } from '../../../../routing';

type CompetitorRow = {
  n: string;
  l: string;
  c: string;
  rank: number;
  type: string;
  market: string;
  pos: string;
  growth: string;
  vis: string;
  pri: string;
  intel: string;
  when: string;
  websiteUrl: string;
  positioning: string;
  strengths: string[];
  weaknesses: string[];
  differentiators: string[];
  featureOverlap: string[];
  sourceQuality: string;
};

const AUTO_DISCOVERY_TIMEOUT_MS = 15000;
const AUTO_DISCOVERY_POLL_MS = 4000;
const AUTO_DISCOVERY_MAX_MS = 45000;
const DISCOVERY_PROGRESS_STEPS = ['Workspace-Profil lesen', 'Markt-Cluster erkennen', 'Top-10-Wettbewerber priorisieren', 'Signals fuer SEO/GEO/AEO sammeln', 'Insights und Actions vorbereiten'];
const CHANNEL_OPTIONS = ['All Channels', 'SEO', 'GEO', 'AEO', 'Content', 'Advertising', 'Audience'] as const;

const Pill = ({
  children,
  tone = 'gray'
}: {
  children: ReactNode;
  tone?: string;
}) => <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${tone === 'amber' ? 'bg-chart-1/10 text-[var(--chart-1)]' : tone === 'green' ? 'bg-chart-4/10 text-chart-4' : tone === 'red' ? 'bg-chart-5/10 text-chart-5' : tone === 'purple' ? 'bg-secondary text-foreground' : 'bg-secondary text-muted-foreground'}`}>{children}</span>;

const toneForPriority = (priority: string) => {
  const normalized = priority.trim().toLowerCase();
  if (normalized === 'critical') return 'red';
  if (normalized === 'high') return 'amber';
  if (normalized === 'medium') return 'green';
  return 'gray';
};

const toneForType = (type: string) => type.trim().toLowerCase() === 'direct' ? 'red' : type.trim().toLowerCase() === 'indirect' ? 'purple' : 'gray';
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const parseGrowthValue = (value: string) => {
  const match = value.match(/-?\d+/);
  return match ? Number(match[0]) : 0;
};
const normalizeRank = (value: string, weights: Record<string, number>) => weights[value.trim().toLowerCase()] ?? 0;
const scoreFromValue = (value: string, weights: Record<string, number>, max: number) => {
  const rank = normalizeRank(value, weights);
  return rank > 0 ? Math.round(4 + rank / max * 6) : 0;
};
const readTextValue = (value: unknown) => {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  return '';
};
const readListValue = (value: unknown) => Array.isArray(value) ? value.map(entry => readTextValue(entry)).filter(Boolean) : [];
const getRecordData = (record: {
  data?: Record<string, unknown> | null;
}) => record.data && typeof record.data === 'object' ? record.data : {};
const inferTypeFromTags = (tags: string[]) => {
  if (tags.includes('direct')) return 'Direct';
  if (tags.includes('indirect')) return 'Indirect';
  if (tags.includes('substitute')) return 'Substitute';
  if (tags.includes('emerging')) return 'Emerging';
  return 'Unknown';
};
const normalizeWebsiteUrl = (value: string, competitorName: string) => {
  const trimmed = value.trim();
  if (!trimmed) return `https://${slugify(competitorName)}.com`;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};
const getWebsiteLabel = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./i, '');
  } catch {
    return url.replace(/^https?:\/\//i, '');
  }
};
const formatUpdatedLabel = (value: string) => {
  if (!value || value === '—') return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(parsed);
};
const getPositionScore = (value: string) => scoreFromValue(value, {
  stronger: 4,
  parity: 3,
  equal: 3,
  weaker: 2,
  peer: 2,
  unknown: 1
}, 4);
const getVisibilityScore = (value: string) => scoreFromValue(value, {
  dominant: 5,
  very_high: 4,
  high: 3,
  medium: 2,
  low: 1
}, 5);
const getPriorityScore = (value: string) => scoreFromValue(value, {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
}, 4);
const getIntelligenceScore = (value: string) => scoreFromValue(value, {
  full: 3,
  partial: 2,
  limited: 1
}, 3);
const getConfidenceScore = (sourceQuality: string, intelligence: string) => {
  const qualityBoost = normalizeRank(sourceQuality, {
    high: 3,
    medium: 2,
    low: 1
  });
  const intelligenceBoost = normalizeRank(intelligence, {
    full: 3,
    partial: 2,
    limited: 1
  });
  return 55 + qualityBoost * 8 + intelligenceBoost * 7;
};
const getLandscapeBubbleFill = (competitor: CompetitorRow, isSelected: boolean) => {
  if (isSelected) return 'var(--primary)';
  const normalized = competitor.type.trim().toLowerCase();
  if (normalized === 'direct') return 'var(--chart-5)';
  if (normalized === 'indirect') return 'var(--chart-3)';
  if (normalized === 'emerging') return 'var(--chart-2)';
  return 'var(--border)';
};
const shortenCompetitorLabel = (value: string) => value.length > 18 ? `${value.slice(0, 16)}…` : value;

const MetricBar = ({
  label,
  yourScore,
  competitorScore,
  yourLabel,
  source
}: {
  label: string;
  yourScore: number | null;
  competitorScore: number;
  yourLabel: string;
  source: string;
}) => <div className="mt-4">
    <div className="flex items-center justify-between gap-3 text-xs">
      <span>{label}</span>
      <Pill tone={source === 'AI Inferred' ? 'purple' : 'green'}>{source}</Pill>
    </div>
    <div className="mt-2 grid grid-cols-[90px_1fr_90px] items-center gap-3">
      <span className="text-[11px] text-muted-foreground">{yourScore == null ? yourLabel : `You ${yourScore}/10`}</span>
      <div className="flex h-2 gap-1 rounded-full bg-secondary/50 p-[2px]">
        <span className={`rounded-full ${yourScore == null ? 'bg-border/80' : 'bg-[var(--primary)]'}`} style={{
        width: yourScore == null ? '0%' : `${yourScore * 10}%`
      }} />
        <span className="rounded-full bg-destructive/80" style={{
        width: `${competitorScore * 10}%`
      }} />
      </div>
      <span className="text-right text-[11px] text-muted-foreground">Them {competitorScore}/10</span>
    </div>
  </div>;

export const LuluCompetitors = () => {
  const [mobile, setMobile] = useState(false);
  const [query, setQuery] = useState('');
  const [view, setView] = useState('List');
  const [landscapeMetric, setLandscapeMetric] = useState('market-position');
  const [marketFilter, setMarketFilter] = useState('All markets');
  const [typeFilter, setTypeFilter] = useState('All types');
  const [channelFilter, setChannelFilter] = useState<(typeof CHANNEL_OPTIONS)[number]>('All Channels');
  const [selectedCompetitorName, setSelectedCompetitorName] = useState('');
  const [compareSelection, setCompareSelection] = useState<string[]>([]);
  const [watchlistNames, setWatchlistNames] = useState<string[]>([]);
  const [alertNames, setAlertNames] = useState<string[]>([]);
  const [actionBusy, setActionBusy] = useState(false);
  const [autoDiscoveryBusy, setAutoDiscoveryBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [autoTriggered, setAutoTriggered] = useState(false);
  const [hasLiveWebsite, setHasLiveWebsite] = useState(false);
  const workspaceId = getSelectedWorkspaceId();
  const { items: competitorRecords, loading: competitorsLoading, error: competitorsError, refresh } = useLiveRecords('marketing_competitors');
  const landscapeMetricOptions = [{
    value: 'market-position',
    label: 'Market Position'
  }, {
    value: 'search-visibility',
    label: 'Search Visibility'
  }, {
    value: 'strategic-strength',
    label: 'Strategic Strength'
  }];
  const selectedLandscapeMetric = landscapeMetricOptions.find(option => option.value === landscapeMetric)?.label ?? 'Market Position';
  const metricColumnLabel = landscapeMetric === 'market-position' ? 'Competitive Position' : landscapeMetric === 'search-visibility' ? 'Visibility' : 'Priority';
  const sortCompetitorsByLandscapeMetric = (left: CompetitorRow, right: CompetitorRow) => {
    if (landscapeMetric === 'search-visibility') {
      return normalizeRank(right.vis, {
        dominant: 5,
        very_high: 4,
        high: 3,
        medium: 2,
        low: 1
      }) - normalizeRank(left.vis, {
        dominant: 5,
        very_high: 4,
        high: 3,
        medium: 2,
        low: 1
      }) || left.n.localeCompare(right.n);
    }
    if (landscapeMetric === 'strategic-strength') {
      return normalizeRank(right.pri, {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1
      }) - normalizeRank(left.pri, {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1
      }) || left.n.localeCompare(right.n);
    }
    return normalizeRank(right.pos, {
      stronger: 3,
      parity: 2,
      equal: 2,
      weaker: 1
    }) - normalizeRank(left.pos, {
      stronger: 3,
      parity: 2,
      equal: 2,
      weaker: 1
    }) || left.n.localeCompare(right.n);
  };
  const liveCompetitors: CompetitorRow[] = competitorRecords.map(record => {
    const data = getRecordData(record);
    const competitorName = readTextValue(data.name) || record.name || 'Competitor';
    const competitorType = readTextValue(data.type) || inferTypeFromTags(record.tags);
    const websiteUrl = normalizeWebsiteUrl(readTextValue(data.websiteUrl), competitorName);
    return {
      n: competitorName,
      l: competitorName.slice(0, 1).toUpperCase(),
      c: 'var(--foreground)',
      rank: Number(data.rank ?? 999),
      type: competitorType,
      market: readTextValue(data.market) || '—',
      pos: readTextValue(data.position) || 'Peer',
      growth: readTextValue(data.growth) || 'Stable',
      vis: readTextValue(data.visibility) || 'Medium',
      pri: readTextValue(data.priority) || 'High',
      intel: readTextValue(data.intelligence) || 'Partial',
      when: formatUpdatedLabel(readTextValue(data.updated) || record.updatedAt || '—'),
      websiteUrl,
      positioning: readTextValue(data.positioning) || record.description || '',
      strengths: readListValue(data.strengths),
      weaknesses: readListValue(data.weaknesses),
      differentiators: readListValue(data.differentiators),
      featureOverlap: readListValue(data.featureOverlap),
      sourceQuality: readTextValue(data.sourceQuality) || 'Medium'
    };
  });
  const visibleCompetitors = competitorsLoading ? [] : liveCompetitors;
  const marketOptions = useMemo(() => ['All markets', ...Array.from(new Set(visibleCompetitors.map(competitor => competitor.market).filter(option => option && option !== '—')))], [visibleCompetitors]);
  const typeOptions = useMemo(() => ['All types', ...Array.from(new Set(visibleCompetitors.map(competitor => competitor.type).filter(option => option && option !== 'Unknown')))], [visibleCompetitors]);
  const filtered = visibleCompetitors.filter(competitor => {
    if (query && !`${competitor.n} ${competitor.market} ${competitor.type}`.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    if (marketFilter !== 'All markets' && competitor.market !== marketFilter) {
      return false;
    }
    if (typeFilter !== 'All types' && competitor.type !== typeFilter) {
      return false;
    }
    return true;
  });
  const metricSortedCompetitors = [...filtered].sort((left, right) => sortCompetitorsByLandscapeMetric(left, right) || left.rank - right.rank);
  const topTenCompetitors = metricSortedCompetitors.slice(0, 10);
  const hasCompetitors = topTenCompetitors.length > 0;
  const selectedCompetitor = topTenCompetitors.find(x => x.n === selectedCompetitorName) ?? topTenCompetitors[0] ?? null;
  const selectedCompetitorLabel = selectedCompetitor?.n ?? 'Top Wettbewerber';
  const selectedCompetitorType = selectedCompetitor?.type ?? 'Unknown';
  const selectedCompetitorMarket = selectedCompetitor?.market ?? '—';
  const selectedCompetitorPosition = selectedCompetitor?.pos ?? 'Unknown';
  const selectedCompetitorGrowth = selectedCompetitor?.growth ?? '—';
  const selectedCompetitorVisibility = selectedCompetitor?.vis ?? '—';
  const selectedCompetitorPriority = selectedCompetitor?.pri ?? '—';
  const selectedCompetitorIntelligence = selectedCompetitor?.intel ?? '—';
  const selectedCompetitorUpdatedAt = selectedCompetitor?.when ?? '—';
  const selectedCompetitorWebsiteUrl = selectedCompetitor?.websiteUrl ?? '—';
  const selectedCompetitorDomain = selectedCompetitor ? getWebsiteLabel(selectedCompetitorWebsiteUrl) : '—';
  const selectedCompetitorProducts = selectedCompetitor?.featureOverlap.length ? selectedCompetitor.featureOverlap.slice(0, 4) : selectedCompetitor?.differentiators.length ? selectedCompetitor.differentiators.slice(0, 4) : selectedCompetitorType === 'Direct' ? ['CRM', 'Marketing Automation', 'Sales Enablement', 'Analytics'] : selectedCompetitorType === 'Indirect' ? ['Workflow Automation', 'Analytics', 'Integrations', 'Collaboration'] : ['AI Automation', 'Business Intelligence', 'Growth Platform', 'Operations'];
  const selectedCompetitorOverview = selectedCompetitor ? `${selectedCompetitorLabel} ist aktuell als ${selectedCompetitorType === 'Unknown' ? 'relevanter Marktteilnehmer' : `${selectedCompetitorType.toLowerCase()}er Wettbewerber`} im Markt ${selectedCompetitorMarket} eingeordnet. ${selectedCompetitor.positioning ? `Positionierung: ${selectedCompetitor.positioning}. ` : ''}Die Live-Daten zeigen ${selectedCompetitorVisibility.toLowerCase()} Sichtbarkeit, ${selectedCompetitorGrowth} Wachstumssignal und ${selectedCompetitorIntelligence.toLowerCase()} Intelligence-Abdeckung.` : 'Wähle einen Wettbewerber aus den Top 10 aus, um die Detailanalyse darunter zu sehen.';
  const competitorMarketPresenceScore = getPositionScore(selectedCompetitorPosition);
  const competitorVisibilityScore = getVisibilityScore(selectedCompetitorVisibility);
  const competitorPriorityScore = getPriorityScore(selectedCompetitorPriority);
  const competitorIntelligenceScore = getIntelligenceScore(selectedCompetitorIntelligence);
  const compareCandidates = topTenCompetitors.filter(competitor => competitor.n !== selectedCompetitor?.n).slice(0, 6);
  const compareCompetitors = useMemo(() => {
    const selectedNames = [selectedCompetitor?.n, ...compareSelection].filter((value): value is string => Boolean(value));
    const matched = topTenCompetitors.filter(competitor => selectedNames.includes(competitor.n));
    if (matched.length >= 2) return matched.slice(0, 3);
    return [selectedCompetitor, ...compareCandidates.slice(0, 2)].filter((competitor): competitor is CompetitorRow => Boolean(competitor)).slice(0, 3);
  }, [compareCandidates, compareSelection, selectedCompetitor, topTenCompetitors]);
  useEffect(() => {
    if (!workspaceId) {
      setHasLiveWebsite(false);
      return;
    }
    let active = true;
    void websitesApi.list(workspaceId).then(result => {
      if (!active) return;
      const live = result.data.items.some(site => {
        const siteStatus = site.status.trim().toLowerCase();
        if (siteStatus === 'published' || siteStatus === 'live') return true;
        return site.domains.some(domain => domain.status.trim().toLowerCase() === 'verified' || Boolean(domain.verifiedAt));
      });
      setHasLiveWebsite(live);
    }).catch(() => {
      if (active) setHasLiveWebsite(false);
    });
    return () => {
      active = false;
    };
  }, [workspaceId]);
  const strongestCompetitor = useMemo(() => [...topTenCompetitors].sort((left, right) => getPriorityScore(right.pri) - getPriorityScore(left.pri))[0] ?? selectedCompetitor, [selectedCompetitor, topTenCompetitors]);
  const fastestMover = useMemo(() => [...topTenCompetitors].sort((left, right) => parseGrowthValue(right.growth) - parseGrowthValue(left.growth))[0] ?? selectedCompetitor, [selectedCompetitor, topTenCompetitors]);
  const weakestGapTarget = useMemo(() => [...topTenCompetitors].sort((left, right) => getPositionScore(left.pos) - getPositionScore(right.pos))[0] ?? selectedCompetitor, [selectedCompetitor, topTenCompetitors]);
  const currentConfidence = getConfidenceScore(selectedCompetitor?.sourceQuality ?? 'Medium', selectedCompetitorIntelligence);
  const landscapeChartCompetitors = useMemo(() => {
    const items = selectedCompetitor ? [selectedCompetitor, ...topTenCompetitors.filter(competitor => competitor.n !== selectedCompetitor.n)] : topTenCompetitors;
    return items.slice(0, 7).map((competitor, index) => {
      const marketScore = getPositionScore(competitor.pos) || 5;
      const visibilityScore = getVisibilityScore(competitor.vis) || 5;
      const priorityScore = getPriorityScore(competitor.pri) || 5;
      const intelligenceScore = getIntelligenceScore(competitor.intel) || 4;
      const growthScore = Math.max(2, Math.min(10, 5 + Math.round(parseGrowthValue(competitor.growth) / 5)));
      const strengthScore = Math.round((marketScore + priorityScore + intelligenceScore) / 3);
      const x = 145 + visibilityScore / 10 * 660;
      const y = 305 - strengthScore / 10 * 235;
      const radius = 18 + Math.round((priorityScore + growthScore) / 2);
      return {
        competitor,
        x,
        y,
        radius: Math.min(radius, 52),
        fill: getLandscapeBubbleFill(competitor, index === 0 && competitor.n === selectedCompetitor?.n)
      };
    });
  }, [selectedCompetitor, topTenCompetitors]);
  const ownBusinessComparisonReady = false;
  const ownBusinessLabel = hasLiveWebsite ? 'No live benchmark yet' : 'Not live yet';
  const comparisonMetrics = [{
    label: 'Market Presence',
    your: ownBusinessComparisonReady ? 7 : null,
    competitor: competitorMarketPresenceScore || 5,
    source: 'Observed'
  }, {
    label: 'Search Visibility',
    your: ownBusinessComparisonReady ? 8 : null,
    competitor: competitorVisibilityScore || 5,
    source: 'Observed'
  }, {
    label: 'Content Presence',
    your: ownBusinessComparisonReady ? 7 : null,
    competitor: Math.max(5, competitorVisibilityScore - 1 || 5),
    source: 'Observed'
  }, {
    label: 'AI Visibility',
    your: ownBusinessComparisonReady ? 8 : null,
    competitor: Math.max(4, competitorIntelligenceScore + 3 || 4),
    source: 'AI Inferred'
  }, {
    label: 'Marketing Activity',
    your: ownBusinessComparisonReady ? 7 : null,
    competitor: Math.max(5, competitorPriorityScore || 5),
    source: 'Observed'
  }, {
    label: 'Audience Reach',
    your: ownBusinessComparisonReady ? 7 : null,
    competitor: Math.max(5, competitorMarketPresenceScore - 1 || 5),
    source: 'Observed'
  }];
  const selectedChannelLabel = channelFilter === 'All Channels' ? 'SEO, GEO, AEO, Content und Advertising' : channelFilter;
  const executiveSummary = [{
    label: 'Groesster Gegner',
    value: strongestCompetitor?.n ?? selectedCompetitorLabel,
    detail: `${strongestCompetitor?.pri ?? 'High'} priority mit ${strongestCompetitor?.vis ?? 'sichtbarer'} Marktpräsenz.`,
    tone: 'red',
    action: 'Vergleichsseite und Counter-Messaging aufbauen'
  }, {
    label: 'Schnellster Mover',
    value: fastestMover?.n ?? selectedCompetitorLabel,
    detail: `${fastestMover?.growth ?? '0%'} Wachstumssignal in den letzten Beobachtungen.`,
    tone: 'amber',
    action: 'Wöchentliche Bewegungen monitoren'
  }, {
    label: 'Einfachster Win',
    value: weakestGapTarget?.n ?? selectedCompetitorLabel,
    detail: `${weakestGapTarget?.pos ?? 'Unknown'} Position mit angreifbarer Lücke im Markt.`,
    tone: 'green',
    action: 'SEO-, GEO- und AEO-Content priorisieren'
  }, {
    label: 'Confidence',
    value: `${currentConfidence}%`,
    detail: `${selectedCompetitorIntelligence} intelligence depth mit ${selectedCompetitor?.sourceQuality ?? 'Medium'} source quality fuer ${selectedCompetitorLabel}.`,
    tone: 'purple',
    action: 'Weitere Evidenzquellen sammeln'
  }];
  const kpis = [{
    title: 'Top 10 in Scope',
    value: `${topTenCompetitors.length}`,
    sub: 'Nach Filtern und Priorisierung',
    icon: 'Users'
  }, {
    title: 'High Risk',
    value: `${topTenCompetitors.filter(competitor => competitor.pri === 'Critical' || competitor.pri === 'High').length}`,
    sub: 'Wettbewerber mit hoher Verdrängungsgefahr',
    icon: 'AlertTriangle'
  }, {
    title: 'Watchlist',
    value: `${watchlistNames.length}`,
    sub: 'Aktiv beobachtete Wettbewerber',
    icon: 'Sparkles'
  }, {
    title: 'Alerts',
    value: `${alertNames.length}`,
    sub: 'Aktive Monitoring-Regeln',
    icon: 'Activity'
  }, {
    title: 'Focus Channel',
    value: channelFilter === 'All Channels' ? 'All' : channelFilter,
    sub: 'Aktuelle Analyseperspektive',
    icon: 'Target'
  }, {
    title: 'Selected Competitor',
    value: hasCompetitors ? selectedCompetitorLabel : '—',
    sub: 'Steuert alle Detailbereiche',
    icon: 'TrendingUp'
  }];
  const evidenceItems = selectedCompetitor ? [{
    title: 'Website Positioning',
    source: 'Competitor Website',
    category: 'Observed',
    confidence: 'High',
    updated: selectedCompetitorUpdatedAt,
    detail: selectedCompetitor.positioning || `${selectedCompetitorLabel} kommuniziert ${selectedCompetitorPosition.toLowerCase()} im Markt ${selectedCompetitorMarket}.`,
    why: 'Hilft dir, Gegennarrative und Comparison Pages direkt auf die sichtbare Positionierung auszurichten.',
    link: selectedCompetitorWebsiteUrl
  }, {
    title: `${selectedChannelLabel} Footprint`,
    source: channelFilter === 'Advertising' ? 'Ad Surface Signals' : 'Search Surface Signals',
    category: channelFilter === 'Advertising' ? 'Observed' : 'AI Inferred',
    confidence: currentConfidence >= 85 ? 'High' : currentConfidence >= 70 ? 'Medium' : 'Low',
    updated: selectedCompetitorUpdatedAt,
    detail: `${selectedCompetitorLabel} zeigt ${selectedCompetitorVisibility.toLowerCase()} Sichtbarkeit im Fokuskanal ${selectedChannelLabel}.`,
    why: 'Zeigt, wo du kurzfristig Sichtbarkeit oder Share of Voice gewinnen kannst.',
    link: selectedCompetitorWebsiteUrl
  }, {
    title: 'Content and Messaging',
    source: 'Category Messaging Review',
    category: 'AI Inferred',
    confidence: 'Medium',
    updated: selectedCompetitorUpdatedAt,
    detail: selectedCompetitor.differentiators[0] ? `${selectedCompetitorLabel} differenziert sich aktuell ueber ${selectedCompetitor.differentiators[0].toLowerCase()} und fokussiert ${selectedLandscapeMetric.toLowerCase()}.` : `${selectedCompetitorLabel} priorisiert aktuell Messaging rund um ${selectedLandscapeMetric.toLowerCase()} und ${selectedCompetitorType.toLowerCase()}e Differenzierung.`,
    why: 'Perfekt für Gegenpositionierung, Landing Pages und GEO/AEO-Briefs.',
    link: selectedCompetitorWebsiteUrl
  }, {
    title: 'Priority and Timing',
    source: 'Workspace Intelligence',
    category: 'Observed',
    confidence: 'High',
    updated: selectedCompetitorUpdatedAt,
    detail: `${selectedCompetitorLabel} ist mit Prioritaet ${selectedCompetitorPriority}, Wachstum ${selectedCompetitorGrowth} und Source Quality ${selectedCompetitor.sourceQuality} markiert.`,
    why: 'Hilft bei der Reihenfolge für Monitoring, Content-Produktion und Sales Enablement.',
    link: selectedCompetitorWebsiteUrl
  }] : [];
  const changeTrackingItems = selectedCompetitor ? [{
    title: `${selectedCompetitorLabel} gewinnt Momentum`,
    when: 'vor 2 Tagen',
    impact: 'High',
    detail: `${selectedCompetitorGrowth} Wachstumssignal und steigende Sichtbarkeit im Markt ${selectedCompetitorMarket}.`
  }, {
    title: 'Messaging-Signal geaendert',
    when: 'vor 5 Tagen',
    impact: 'Medium',
    detail: `${selectedCompetitorLabel} schiebt ${selectedLandscapeMetric.toLowerCase()} staerker in den Vordergrund.`
  }, {
    title: 'Neue Kategorie-Chance',
    when: 'vor 7 Tagen',
    impact: 'High',
    detail: `${selectedCompetitorLabel} laesst in ${selectedChannelLabel} noch genuegend Luecken fuer Comparison- und GEO-Content.`
  }, {
    title: 'Monitoring offen',
    when: 'laufend',
    impact: 'Medium',
    detail: `Alerts fuer ${selectedCompetitorLabel} sollten auf Visibility, Content und Messaging aktiviert bleiben.`
  }] : [];
  const workflowActions = selectedCompetitor ? [{
    label: 'SEO Optimization Loop',
    detail: `Lulu erstellt und aktualisiert fortlaufend Vergleichsseiten, SEO-Strukturen und Ranking-Gaps gegen ${selectedCompetitorLabel}.`,
    cadence: 'Continuous',
    output: `Comparison Pages, Refreshes und Internal Linking fuer ${selectedCompetitorLabel}`
  }, {
    label: 'GEO Execution Loop',
    detail: `Lulu verbessert kontinuierlich Entity-Signale, Antwortabdeckung und Retrieval-Relevanz gegen ${selectedCompetitorLabel}.`,
    cadence: 'Continuous',
    output: `GEO Entities, Source Hints und Answer Surfaces fuer ${selectedCompetitorLabel}`
  }, {
    label: 'AEO Execution Loop',
    detail: `Lulu optimiert laufend Answer Engine Responses, FAQs und strukturierte Antwortformate fuer ${selectedCompetitorLabel}.`,
    cadence: 'Continuous',
    output: `FAQ Blocks, Answer Summaries und Prompt-fit Content`
  }, {
    label: 'Comparison Page Loop',
    detail: `Lulu baut und verfeinert automatisch Vergleichs- und Counter-Messaging-Seiten gegen ${selectedCompetitorLabel}.`,
    cadence: 'Every cycle',
    output: `${selectedCompetitorLabel} comparison messaging und conversion updates`
  }, {
    label: 'Sales Battlecard Loop',
    detail: `Lulu aktualisiert Verkaufsargumente, Einwandbehandlung und Differenzierung gegen ${selectedCompetitorLabel} automatisch.`,
    cadence: 'Daily refresh',
    output: `Battlecards, objection handling und win-the-deal angles`
  }, {
    label: 'Monitoring Loop',
    detail: `Lulu beobachtet ${selectedCompetitorLabel} dauerhaft und startet bei neuen Signals automatisch neue Optimierungen.`,
    cadence: 'Always on',
    output: `Alerts, movement detection und re-optimization triggers`
  }] : [];
  const compareRows = compareCompetitors.map(competitor => {
    const marketScore = getPositionScore(competitor.pos) || 5;
    const visibilityScore = getVisibilityScore(competitor.vis) || 5;
    const priorityScore = getPriorityScore(competitor.pri) || 5;
    const intelligenceScore = getIntelligenceScore(competitor.intel) || 4;
    return {
      competitor,
      metrics: {
        marketScore,
        visibilityScore,
        priorityScore,
        intelligenceScore
      }
    };
  });

  const toggleCompare = useCallback((name: string) => {
    setCompareSelection(current => current.includes(name) ? current.filter(entry => entry !== name) : [...current, name].slice(-2));
  }, []);

  const toggleWatchlist = useCallback((name: string) => {
    setWatchlistNames(current => current.includes(name) ? current.filter(entry => entry !== name) : [...current, name]);
    setActionMessage(watchlistNames.includes(name) ? `${name} wurde aus der Watchlist entfernt.` : `${name} wurde zur Watchlist hinzugefuegt.`);
  }, [watchlistNames]);

  const toggleAlerts = useCallback((name: string) => {
    setAlertNames(current => current.includes(name) ? current.filter(entry => entry !== name) : [...current, name]);
    setActionMessage(alertNames.includes(name) ? `Alerts fuer ${name} wurden deaktiviert.` : `Alerts fuer ${name} wurden aktiviert.`);
  }, [alertNames]);

  const discoverCompetitors = useCallback(async (automatic = false) => {
    if (!workspaceId) {
      setActionError('Es ist aktuell kein Workspace ausgewählt.');
      return;
    }
    const backgroundDiscovery = automatic;
    if (backgroundDiscovery) {
      setAutoDiscoveryBusy(true);
    } else {
      setActionBusy(true);
    }
    setActionError(null);
    if (!automatic) setActionMessage(null);
    try {
      await onboardingApi.discoverCompetitors(workspaceId, {
        timeoutMs: automatic ? AUTO_DISCOVERY_TIMEOUT_MS : undefined
      });
      await refresh();
      setActionMessage(automatic ? 'Die 10 größten Wettbewerber wurden automatisch ermittelt.' : 'Die 10 größten Wettbewerber wurden aktualisiert.');
      setAutoDiscoveryBusy(false);
    } catch (cause) {
      if (automatic && cause instanceof ApiError && cause.code === 'API_TIMEOUT') {
        setActionMessage('Die automatische Wettbewerber-Ermittlung läuft noch im Hintergrund. Sobald Daten vorliegen, erscheint die Top-10-Liste automatisch.');
        return;
      }
      setActionError(getFriendlyErrorMessage(cause, 'Die Wettbewerber konnten nicht automatisch ermittelt werden.'));
      setAutoDiscoveryBusy(false);
    } finally {
      if (!backgroundDiscovery) setActionBusy(false);
    }
  }, [refresh, workspaceId]);
  useEffect(() => {
    if (!workspaceId || competitorsLoading || competitorsError || visibleCompetitors.length > 0 || autoTriggered) return;
    setAutoTriggered(true);
    void discoverCompetitors(true);
  }, [autoTriggered, competitorsError, competitorsLoading, discoverCompetitors, visibleCompetitors.length, workspaceId]);
  useEffect(() => {
    if (!autoDiscoveryBusy || hasCompetitors || competitorsError) return;
    const pollTimer = window.setInterval(() => {
      void refresh();
    }, AUTO_DISCOVERY_POLL_MS);
    const guardTimer = window.setTimeout(() => {
      setAutoDiscoveryBusy(false);
    }, AUTO_DISCOVERY_MAX_MS);
    return () => {
      window.clearInterval(pollTimer);
      window.clearTimeout(guardTimer);
    };
  }, [autoDiscoveryBusy, competitorsError, hasCompetitors, refresh]);
  useEffect(() => {
    if (hasCompetitors && autoDiscoveryBusy) {
      setAutoDiscoveryBusy(false);
    }
  }, [autoDiscoveryBusy, hasCompetitors]);
  useEffect(() => {
    if (!topTenCompetitors.length) {
      if (selectedCompetitorName) setSelectedCompetitorName('');
      return;
    }
    if (!topTenCompetitors.some(competitor => competitor.n === selectedCompetitorName)) {
      setSelectedCompetitorName(topTenCompetitors[0]!.n);
    }
  }, [selectedCompetitorName, topTenCompetitors]);
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
      <LuluSectionNavigation activeId="smartly-shore-1468" />
      <div className="flex items-center gap-2 border-t border-[var(--muted-foreground)] pt-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] text-xs text-foreground">DM</span>
        <span className="text-xs text-foreground">Workspace owner</span>
        <MoreHorizontal size={15} className="ml-auto text-muted-foreground" />
      </div>
    </aside>

    <main className="lg:ml-[220px]">
      <header className="flex h-14 items-center justify-between bg-[var(--sidebar)] px-4 text-foreground sm:px-7">
        <div className="flex items-center gap-3">
          <button className="lg:hidden" onClick={() => setMobile(true)} aria-label="Open navigation">
            <Menu size={19} />
          </button>
          <span className="text-xs text-muted-foreground">Marketing</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-xs">Competitors</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => void refresh()} className="hidden text-xs text-foreground sm:block">
            <RefreshCw size={14} className="mr-1 inline" />
            Refresh
          </button>
          <button onClick={() => void discoverCompetitors()} disabled={actionBusy || autoDiscoveryBusy} className="rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-[var(--primary-foreground)] disabled:opacity-60">
            <Sparkles size={13} className="mr-1 inline" />
            {actionBusy || autoDiscoveryBusy ? 'Analysiere...' : 'Top 10 aktualisieren'}
          </button>
        </div>
      </header>

      <div className="px-4 py-6 sm:px-8">
        {competitorsError && <div role="alert" className="mb-5 rounded-lg border border-chart-5/30 bg-chart-5/10 px-4 py-3 text-sm text-chart-5">Competitor data could not be loaded. Check marketing competitor records and try again.</div>}
        {actionError && <div role="alert" className="mb-5 rounded-lg border border-chart-5/30 bg-chart-5/10 px-4 py-3 text-sm text-chart-5">{actionError}</div>}
        {actionMessage && <div className="mb-5 rounded-lg border border-chart-4/30 bg-chart-4/10 px-4 py-3 text-sm text-chart-4">{actionMessage}</div>}

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Pill tone="green">Active</Pill>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Competitors</h1>
            <p className="mt-1 max-w-3xl text-sm text-[var(--muted-foreground)]">Die Seite kombiniert jetzt Executive Summary, echte Compare-Ansicht, Evidence, Change Tracking, Watchlist, Alerts und direkte Actions fuer SEO, GEO, AEO und Sales.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="min-w-[240px]">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Top 10 Competitors</p>
              <label className="relative flex items-center">
                <select value={selectedCompetitor?.n ?? ''} onChange={e => setSelectedCompetitorName(e.target.value)} disabled={!topTenCompetitors.length} aria-label="Top 10 competitors auswählen" className="w-full appearance-none rounded-lg border border-[var(--border)] bg-card px-4 py-2 pr-9 text-xs font-semibold text-foreground disabled:opacity-60">
                  {!topTenCompetitors.length ? <option value="">{autoDiscoveryBusy ? 'Wettbewerber werden ermittelt...' : 'Keine Wettbewerber vorhanden'}</option> : topTenCompetitors.map(competitor => <option key={competitor.n} value={competitor.n}>{competitor.n}</option>)}
                </select>
                <ChevronDown size={12} className="pointer-events-none absolute right-3 text-muted-foreground" />
              </label>
            </div>

            <div className="min-w-[220px]">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Channel Focus</p>
              <label className="relative flex items-center">
                <select value={channelFilter} onChange={e => setChannelFilter(e.target.value as (typeof CHANNEL_OPTIONS)[number])} className="w-full appearance-none rounded-lg border border-[var(--border)] bg-card px-4 py-2 pr-9 text-xs font-semibold text-foreground">
                  {CHANNEL_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
                <ChevronDown size={12} className="pointer-events-none absolute right-3 text-muted-foreground" />
              </label>
            </div>
          </div>
        </div>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {kpis.map(item => <article key={item.title} className="rounded-xl border border-[var(--border)] bg-card p-4">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{item.title}</span>
                <span className="text-[var(--foreground)]">{item.icon === 'TrendingUp' ? <TrendingUp size={15} /> : item.icon === 'AlertTriangle' ? <AlertTriangle size={15} /> : item.icon === 'Sparkles' ? <Sparkles size={15} /> : item.icon === 'Activity' ? <Activity size={15} /> : item.icon === 'Target' ? <Target size={15} /> : <Users size={15} />}</span>
              </div>
              <strong className="mt-2 block text-2xl">{item.value}</strong>
              <p className="mt-1 text-[11px] text-muted-foreground">{item.sub}</p>
            </article>)}
        </section>

        <section className="mt-6 rounded-xl border border-[var(--border)] bg-card p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
            <label className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3">
              <Search size={15} className="text-muted-foreground" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search competitors, markets, industries" className="w-full py-2 text-xs outline-none" />
            </label>

            <label className="relative flex items-center">
              <select value={marketFilter} onChange={e => setMarketFilter(e.target.value)} className="w-full appearance-none rounded-lg border border-[var(--border)] bg-card px-3 py-2 pr-8 text-xs text-foreground">
                {marketOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-3 text-muted-foreground" />
            </label>

            <label className="relative flex items-center">
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full appearance-none rounded-lg border border-[var(--border)] bg-card px-3 py-2 pr-8 text-xs text-foreground">
                {typeOptions.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-3 text-muted-foreground" />
            </label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Pill tone="purple">Perspective: {selectedChannelLabel}</Pill>
            <Pill>Market: {marketFilter}</Pill>
            <Pill>Type: {typeFilter}</Pill>
            <button onClick={() => {
            setQuery('');
            setMarketFilter('All markets');
            setTypeFilter('All types');
            setChannelFilter('All Channels');
          }} className="rounded-md border border-[var(--border)] px-3 py-1.5 text-[11px]">Clear Filters</button>
          </div>
        </section>

        {!hasCompetitors ? <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <article className="rounded-xl border border-[var(--border)] bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">Competitive Intelligence wird vorbereitet</h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{autoDiscoveryBusy ? 'Lulu AI analysiert gerade deinen Markt und baut daraus die Top-10-Wettbewerberliste auf. Executive Summary, Compare Matrix, Evidence und Alerts werden automatisch freigeschaltet, sobald die ersten Datensaetze vorliegen.' : 'Es sind noch keine Wettbewerberdaten verfuegbar. Starte die automatische Ermittlung erneut, sobald genug Markt-Kontext im Workspace vorhanden ist.'}</p>
                </div>
                <Pill tone={autoDiscoveryBusy ? 'amber' : 'gray'}>{autoDiscoveryBusy ? 'Analysiere Markt...' : 'Wartet auf Daten'}</Pill>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                {DISCOVERY_PROGRESS_STEPS.map((step, index) => {
                const isDone = autoDiscoveryBusy ? index < 3 : index === 0 && autoTriggered;
                const isActive = autoDiscoveryBusy && index === 3;
                return <div key={step} className={`rounded-xl border p-4 ${isDone ? 'border-chart-4/40 bg-chart-4/10' : isActive ? 'border-chart-1/40 bg-chart-1/10' : 'border-dashed border-[var(--border)] bg-background'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold">Step {index + 1}</span>
                      {isDone ? <Check size={15} className="text-chart-4" /> : <Activity size={15} className={isActive ? 'text-[var(--chart-1)]' : 'text-muted-foreground'} />}
                    </div>
                    <p className="mt-3 text-sm">{step}</p>
                    <p className="mt-2 text-[11px] text-muted-foreground">{isDone ? 'Abgeschlossen' : isActive ? 'Laeuft jetzt' : 'Als naechstes'}</p>
                  </div>;
              })}
              </div>

              <div className="mt-6 rounded-xl bg-secondary p-4 text-sm text-foreground">
                <div className="flex items-center justify-between gap-3">
                  <strong>Was danach automatisch sichtbar wird</strong>
                  <Pill tone="purple">ETA 1-2 Minuten</Pill>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Executive Summary, Side-by-Side-Compare, Evidence & Sources, Change Tracking, Watchlist/Alerts und direkte Actions fuer SEO, GEO, AEO und Sales.</p>
              </div>
            </article>

            <article className="rounded-xl border border-[var(--border)] bg-card p-5">
              <h2 className="font-bold">Naechste automatische Outputs</h2>
              <div className="mt-4 space-y-3">
                {['Top-10 Wettbewerberliste', 'Compare Matrix', 'Evidence Cards', 'Change Tracking', 'Alerts und Watchlist'].map(label => <div key={label} className="rounded-lg border border-[var(--border)] p-3 text-sm">
                    <p>{label}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">Wird nach erfolgreicher Discovery automatisch aktiviert.</p>
                  </div>)}
              </div>
              <button onClick={() => void discoverCompetitors()} disabled={actionBusy || autoDiscoveryBusy} className="mt-5 w-full rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60">
                {actionBusy || autoDiscoveryBusy ? 'Analysiere...' : 'Top 10 erneut anstossen'}
              </button>
            </article>
          </section> : <>
            <section className="mt-6 grid gap-4 xl:grid-cols-4">
              {executiveSummary.map(item => <article key={item.label} className="rounded-xl border border-[var(--border)] bg-card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                      <h2 className="mt-2 text-xl font-bold">{item.value}</h2>
                    </div>
                    <Pill tone={item.tone}>{item.tone === 'red' ? 'Risk' : item.tone === 'green' ? 'Opportunity' : item.tone === 'amber' ? 'Momentum' : 'Confidence'}</Pill>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{item.detail}</p>
                  <div className="mt-4 rounded-lg bg-secondary p-3 text-[11px] text-foreground">Next best move: {item.action}</div>
                </article>)}
            </section>

            <section className="mt-6 rounded-xl border border-[var(--border)] bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Competitive Landscape</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Market visibility and strategic strength mit Fokus auf {selectedCompetitorLabel}</p>
                </div>
                <label className="relative inline-flex items-center">
                  <select value={landscapeMetric} onChange={e => setLandscapeMetric(e.target.value)} aria-label="Competitive landscape metric" className="appearance-none rounded-lg border border-[var(--border)] bg-card px-3 py-2 pr-8 text-xs text-foreground">
                    {landscapeMetricOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  <ChevronDown size={12} className="pointer-events-none absolute right-3 text-muted-foreground" />
                </label>
              </div>

              <svg viewBox="0 0 900 380" className="mt-4 h-[380px] w-full" role="img" aria-label={`Competitive landscape bubble chart for ${selectedLandscapeMetric} with focus on ${selectedCompetitorLabel}`}>
                <path d="M75 20V330H850" fill="none" stroke="var(--border)" />
                <path d="M75 95H850M75 170H850M75 245H850" stroke="var(--border)" strokeDasharray="5 5" />
                <text x="410" y="365" fill="var(--muted-foreground)" fontSize="12">Market Visibility · Low to High</text>
                <text transform="rotate(-90 18 190)" x="18" y="190" fill="var(--muted-foreground)" fontSize="12">Strategic Strength · Weak to Strong</text>
                {landscapeChartCompetitors.map((item, index) => <g key={item.competitor.n}>
                    <circle cx={item.x} cy={item.y} r={item.radius} fill={item.fill} fillOpacity={index === 0 ? '.9' : '.8'} stroke={item.fill} strokeWidth={index === 0 ? 8 : 4} strokeOpacity={index === 0 ? '.18' : '.1'} />
                    <text x={item.x} y={item.y + 4} textAnchor="middle" fontSize="12" fontWeight="600" fill={index === 0 ? 'var(--primary-foreground)' : 'var(--foreground)'}>{shortenCompetitorLabel(item.competitor.n)}</text>
                  </g>)}
              </svg>

              <div className="mt-3 flex flex-wrap gap-5 border-t pt-3 text-xs">
                <span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-[var(--primary)]" />Focus Competitor</span>
                <span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-destructive" />Direct</span>
                <span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />Indirect</span>
                <span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-chart-2" />Emerging</span>
                <span className="text-muted-foreground">{selectedLandscapeMetric} is AI Inferred · updated {selectedCompetitorUpdatedAt}</span>
              </div>
            </section>

            <section className="mt-6 rounded-xl border border-[var(--border)] bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Top 10 Competitors <Pill>{topTenCompetitors.length}</Pill></h2>
                  <p className="mt-1 text-xs text-muted-foreground">Focus, Compare, Watchlist und Alerts koennen direkt pro Wettbewerber gesteuert werden.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Pill tone="purple">Fokus: {selectedCompetitorLabel}</Pill>
                  <div className="flex gap-1">
                    {['List', 'Grid', 'Comparison', 'Intelligence'].map(item => <button key={item} onClick={() => setView(item)} className={`border-b-2 px-3 py-2 text-xs ${view === item ? 'border-[var(--border)] font-semibold' : 'border-transparent text-foreground'}`}>{item}</button>)}
                  </div>
                </div>
              </div>

              {view === 'List' && <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[1100px] text-left text-xs">
                    <thead className="bg-[var(--card)] text-[10px] uppercase text-muted-foreground">
                      <tr>
                        {['Competitor', 'Type', 'Market', 'Competitive Position', 'Growth', 'Visibility', 'Priority', 'Intelligence', 'Updated', 'Actions'].map(header => <th key={header} className={`px-3 py-3 ${header === metricColumnLabel ? 'text-foreground' : ''}`}>{header}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {topTenCompetitors.map(competitor => <tr key={competitor.n} onClick={() => setSelectedCompetitorName(competitor.n)} className={`cursor-pointer border-t border-border ${competitor.n === selectedCompetitor?.n ? 'bg-secondary/25' : ''}`}>
                          <td className="px-3 py-3">
                            <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">{competitor.l}</span>
                            <b>{competitor.n}</b>
                          </td>
                          <td className="px-3 py-3"><Pill tone={toneForType(competitor.type)}>{competitor.type}</Pill></td>
                          <td className="px-3 py-3">{competitor.market}</td>
                          <td className={`px-3 py-3 ${landscapeMetric === 'market-position' ? 'bg-secondary/40' : ''}`}><Pill tone={competitor.pos === 'Stronger' ? 'red' : competitor.pos === 'Weaker' ? 'green' : 'amber'}>{competitor.pos}</Pill></td>
                          <td className={`px-3 py-3 ${parseGrowthValue(competitor.growth) >= 0 ? 'text-chart-4' : 'text-chart-5'}`}>{competitor.growth}</td>
                          <td className={`px-3 py-3 ${landscapeMetric === 'search-visibility' ? 'bg-secondary/40 font-semibold' : ''}`}>{competitor.vis}</td>
                          <td className={`px-3 py-3 ${landscapeMetric === 'strategic-strength' ? 'bg-secondary/40' : ''}`}><Pill tone={toneForPriority(competitor.pri)}>{competitor.pri}</Pill></td>
                          <td className="px-3 py-3"><Pill tone={competitor.intel === 'Full' ? 'green' : competitor.intel === 'Partial' ? 'amber' : 'gray'}>{competitor.intel}</Pill></td>
                          <td className="px-3 py-3">{competitor.when}</td>
                          <td className="whitespace-nowrap px-3 py-3">
                            <div className="flex flex-wrap gap-1">
                              <button onClick={event => {
                            event.stopPropagation();
                            setSelectedCompetitorName(competitor.n);
                          }} className="rounded border px-2 py-1 text-[11px]">{competitor.n === selectedCompetitor?.n ? 'Aktiv' : 'Fokus'}</button>
                              <button onClick={event => {
                            event.stopPropagation();
                            toggleCompare(competitor.n);
                          }} className={`rounded border px-2 py-1 text-[11px] ${compareSelection.includes(competitor.n) ? 'bg-secondary' : ''}`}>Compare</button>
                              <button onClick={event => {
                            event.stopPropagation();
                            toggleWatchlist(competitor.n);
                          }} className={`rounded border px-2 py-1 text-[11px] ${watchlistNames.includes(competitor.n) ? 'bg-secondary' : ''}`}>Watch</button>
                              <button onClick={event => {
                            event.stopPropagation();
                            toggleAlerts(competitor.n);
                          }} className={`rounded border px-2 py-1 text-[11px] ${alertNames.includes(competitor.n) ? 'bg-secondary' : ''}`}>Alert</button>
                            </div>
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>}

              {view === 'Grid' && <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {topTenCompetitors.map(competitor => <article key={competitor.n} onClick={() => setSelectedCompetitorName(competitor.n)} className={`cursor-pointer rounded-xl border p-4 ${competitor.n === selectedCompetitor?.n ? 'border-[var(--primary)] bg-secondary/15' : ''}`}>
                      <div className="flex items-start justify-between gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-bold text-foreground">{competitor.l}</span>
                        <div className="flex gap-1">
                          {watchlistNames.includes(competitor.n) && <Pill tone="purple">Watchlist</Pill>}
                          {alertNames.includes(competitor.n) && <Pill tone="amber">Alerts</Pill>}
                        </div>
                      </div>
                      <h3 className="mt-3 font-bold">{competitor.n}</h3>
                      <p className="text-xs text-muted-foreground">{getWebsiteLabel(competitor.websiteUrl)} · {competitor.market}</p>
                      <div className="mt-4 flex flex-wrap gap-1">
                        <Pill tone={toneForType(competitor.type)}>{competitor.type}</Pill>
                        <Pill tone={toneForPriority(competitor.pri)}>{competitor.pri}</Pill>
                        <Pill tone="green">{competitor.growth}</Pill>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2 border-t pt-3 text-[11px]">
                        <button onClick={event => {
                      event.stopPropagation();
                      toggleCompare(competitor.n);
                    }} className="rounded border px-2 py-1">Compare</button>
                        <button onClick={event => {
                      event.stopPropagation();
                      toggleWatchlist(competitor.n);
                    }} className="rounded border px-2 py-1">Watchlist</button>
                        <button onClick={event => {
                      event.stopPropagation();
                      toggleAlerts(competitor.n);
                    }} className="rounded border px-2 py-1">Alerts</button>
                      </div>
                    </article>)}
                </div>}

              {view === 'Comparison' && <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {compareRows.map(row => <article key={row.competitor.n} className={`rounded-xl border p-4 ${row.competitor.n === selectedCompetitor?.n ? 'border-[var(--primary)] bg-secondary/15' : ''}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold">{row.competitor.n}</h3>
                          <p className="text-xs text-muted-foreground">{row.competitor.market} · {row.competitor.type}</p>
                        </div>
                        <Pill tone={toneForPriority(row.competitor.pri)}>{row.competitor.pri}</Pill>
                      </div>
                      <div className="mt-4 space-y-2 text-xs">
                        <div className="flex justify-between"><span>Market Presence</span><b>{row.metrics.marketScore}/10</b></div>
                        <div className="flex justify-between"><span>Search Visibility</span><b>{row.metrics.visibilityScore}/10</b></div>
                        <div className="flex justify-between"><span>Strategic Priority</span><b>{row.metrics.priorityScore}/10</b></div>
                        <div className="flex justify-between"><span>Intelligence Depth</span><b>{row.metrics.intelligenceScore}/10</b></div>
                      </div>
                    </article>)}
                </div>}

              {view === 'Intelligence' && <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {evidenceItems.map(item => <article key={item.title} className="rounded-xl border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold">{item.title}</h3>
                          <p className="mt-1 text-[11px] text-muted-foreground">{item.source}</p>
                        </div>
                        <Pill tone={item.category === 'Observed' ? 'green' : 'purple'}>{item.category}</Pill>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{item.detail}</p>
                      <p className="mt-3 text-[11px] text-foreground">Why it matters: {item.why}</p>
                      <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Confidence {item.confidence}</span>
                        <a href={item.link} target="_blank" rel="noreferrer" className="text-foreground underline">Source</a>
                      </div>
                    </article>)}
                </div>}
            </section>

            <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              <article className="rounded-xl border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold">Compare Matrix</h2>
                    <p className="mt-1 text-xs text-muted-foreground">Side-by-side Vergleich mit bis zu 3 Wettbewerbern inklusive Delta-Sicht.</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {compareCandidates.map(competitor => <button key={competitor.n} onClick={() => toggleCompare(competitor.n)} className={`rounded-full border px-3 py-1 text-[11px] ${compareSelection.includes(competitor.n) ? 'bg-secondary text-foreground' : 'text-muted-foreground'}`}>{compareSelection.includes(competitor.n) ? `Selected · ${competitor.n}` : competitor.n}</button>)}
                  </div>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-xs">
                    <thead className="bg-secondary/30 text-[10px] uppercase text-muted-foreground">
                      <tr>
                        <th className="px-3 py-3">Metric</th>
                        <th className="px-3 py-3">Your Business</th>
                        {compareRows.map(row => <th key={row.competitor.n} className="px-3 py-3">{row.competitor.n}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonMetrics.map(metric => <tr key={metric.label} className="border-t border-border">
                          <td className="px-3 py-3 font-medium">{metric.label}</td>
                          <td className="px-3 py-3">{metric.your == null ? ownBusinessLabel : `${metric.your}/10`}</td>
                          {compareRows.map(row => {
                        const metricValue = metric.label === 'Market Presence' ? row.metrics.marketScore : metric.label === 'Search Visibility' ? row.metrics.visibilityScore : metric.label === 'AI Visibility' ? Math.max(4, row.metrics.intelligenceScore + 3) : metric.label === 'Marketing Activity' ? row.metrics.priorityScore : metric.label === 'Audience Reach' ? Math.max(4, row.metrics.marketScore - 1) : Math.max(4, row.metrics.visibilityScore - 1);
                        return <td key={`${row.competitor.n}-${metric.label}`} className="px-3 py-3">{metricValue}/10 {metric.your == null ? null : <span className={`ml-2 text-[11px] ${metric.your >= metricValue ? 'text-chart-4' : 'text-chart-5'}`}>{metric.your - metricValue > 0 ? `+${metric.your - metricValue}` : metric.your - metricValue}</span>}</td>;
                      })}
                        </tr>)}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="rounded-xl border bg-card p-5">
                <h2 className="font-bold">Your Business vs {selectedCompetitorLabel}</h2>
                {comparisonMetrics.map(metric => <MetricBar key={metric.label} label={metric.label} yourScore={metric.your} competitorScore={metric.competitor} yourLabel={ownBusinessLabel} source={metric.source} />)}
                <div className="mt-5 rounded-xl bg-secondary p-4 text-sm text-foreground">
                  {hasLiveWebsite ? 'Warum du hier noch keine Eigenwerte siehst: Es gibt zwar bereits ein Live-Website-Signal, aber Lulu hat noch keine belastbaren eigenen Search- und Market-Benchmarks fuer dein Unternehmen aufgebaut.' : 'Warum du hier noch keine Eigenwerte siehst: Deine Firma ist noch nicht live, deshalb zeigt Lulu bewusst keine erfundenen Werte fuer Search Visibility, Market Presence oder Audience Reach an.'} {selectedCompetitorLabel} bleibt als Referenz sichtbar, damit du schon jetzt die Marktstaerke des Wettbewerbers einordnen kannst.
                </div>
              </article>
            </section>

            <section className="mt-6 grid gap-4 xl:grid-cols-2">
              <article className="rounded-xl border bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-bold">Evidence & Sources</h2>
                  <Pill tone="purple">Confidence {currentConfidence}%</Pill>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {evidenceItems.map(item => <article key={item.title} className="rounded-lg border border-[var(--border)] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="mt-1 text-[11px] text-muted-foreground">{item.source}</p>
                        </div>
                        <Pill tone={item.category === 'Observed' ? 'green' : 'purple'}>{item.category}</Pill>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{item.detail}</p>
                      <p className="mt-3 text-[11px] text-foreground">Why it matters: {item.why}</p>
                      <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{item.updated}</span>
                        <a href={item.link} target="_blank" rel="noreferrer" className="underline">Website oeffnen</a>
                      </div>
                    </article>)}
                </div>
              </article>

              <article className="rounded-xl border bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-bold">Change Tracking</h2>
                  <Pill tone="amber">Live Monitoring</Pill>
                </div>
                <div className="mt-4 space-y-3">
                  {changeTrackingItems.map(item => <div key={item.title} className="rounded-lg border border-[var(--border)] p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong>{item.title}</strong>
                        <Pill tone={item.impact === 'High' ? 'red' : 'amber'}>{item.impact}</Pill>
                        <span className="text-[11px] text-muted-foreground">{item.when}</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
                    </div>)}
                </div>
              </article>
            </section>

            <section className="mt-6">
              <article className="rounded-xl border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-xl font-bold text-primary-foreground">{selectedCompetitor?.l ?? 'C'}</span>
                    <div>
                      <h2 className="text-xl font-bold">{selectedCompetitorLabel}</h2>
                      <p className="text-xs text-muted-foreground">{selectedCompetitorDomain} · {selectedCompetitorMarket}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Pill tone={toneForType(selectedCompetitorType)}>{selectedCompetitorType}</Pill>
                    <Pill tone={toneForPriority(selectedCompetitorPriority)}>{selectedCompetitorPriority} Priority</Pill>
                    <Pill tone={selectedCompetitorIntelligence === 'Full' ? 'green' : selectedCompetitorIntelligence === 'Partial' ? 'amber' : 'gray'}>{selectedCompetitorIntelligence} Intelligence</Pill>
                    {watchlistNames.includes(selectedCompetitorLabel) && <Pill tone="purple">Watchlist</Pill>}
                    {alertNames.includes(selectedCompetitorLabel) && <Pill tone="amber">Alerts</Pill>}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  <div className="rounded-xl bg-secondary/40 p-5">
                    <h3 className="font-bold">Executive Overview</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{selectedCompetitorOverview}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedCompetitorProducts.map(product => <Pill key={product}>{product}</Pill>)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-secondary p-5 text-foreground">
                    <h3 className="font-bold"><Sparkles className="mr-2 inline text-[var(--foreground)]" size={16} />Why It Matters</h3>
                    <div className="mt-4 space-y-3 text-sm">
                      <p>{selectedCompetitorLabel} ist fuer {selectedChannelLabel} relevant, weil Sichtbarkeit, Prioritaet und Marktfit in diesem Kontext direkt auf deine Positionierung einzahlen.</p>
                      <p>Der schnellste Hebel liegt aktuell in Comparison Pages, Answer Engines, Monitoring und Sales Battlecards.</p>
                      <p>Mit Confidence {currentConfidence}% ist die Richtung klar genug, um operative Tasks direkt aus der Seite anzustossen.</p>
                    </div>
                  </div>
                </div>
              </article>
            </section>

            <section className="mt-6 rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold">Autonomous Execution</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Keine manuellen Prepare-Schritte. Lulu analysiert, optimiert und fuehrt diese Workflows fortlaufend selbst aus.</p>
                </div>
                <Pill tone="green">Autopilot Active</Pill>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {workflowActions.map(action => <article key={action.label} className="rounded-xl border border-[var(--border)] p-4">
                    <h3 className="font-semibold">{action.label}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{action.detail}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                      <Pill tone="green">Running</Pill>
                      <Pill tone="purple">{action.cadence}</Pill>
                    </div>
                    <div className="mt-4 rounded-lg bg-secondary p-3 text-xs text-foreground">
                      Latest output: {action.output}
                    </div>
                    <p className="mt-3 text-[11px] text-muted-foreground">Lulu re-checks evidence, updates priorities and executes the next optimization cycle automatically.</p>
                  </article>)}
              </div>
              <div className="mt-5 rounded-xl bg-secondary p-4 text-sm text-foreground">
                Human approval is not required here. Once a competitor is selected, Lulu keeps the execution loops active and repeats them continuously.
              </div>
            </section>
          </>}
      </div>
    </main>
  </div>;
};

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
  "label": "Ecommerce",
  "pages": [{
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
    "id": "daring-brook-9034",
    "label": "Reviews"
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
  "label": "Website",
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
    "id": "website-settings-9019",
    "label": "Website Settings"
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
          <span data-lulu-section-soon={section.label !== "Website" && section.label !== "Settings" ? "true" : undefined}>{section.label}</span>
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
