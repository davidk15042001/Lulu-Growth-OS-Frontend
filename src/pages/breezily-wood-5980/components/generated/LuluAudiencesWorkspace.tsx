import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  ChevronRight,
  Compass,
  Eye,
  Layers,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { getFriendlyErrorMessage } from "../../../../api/client";
import { onboardingApi, type CustomerSegment, type Offering, type OnboardingSnapshot, type Platform } from "../../../../api/onboarding";
import { type WorkspaceRecord } from "../../../../api/records";
import { getSelectedWorkspaceId } from "../../../../api/session";
import { getSearchChannelSummary, type SearchChannel, type SearchChannelSummary, type SearchItem } from "../../../../api/searchIntelligence";
import { useLiveRecords } from "../../../../api/useLiveRecords";

type SearchSummaryMap = Partial<Record<SearchChannel, SearchChannelSummary>>;

type AudienceScoreCategory = {
  key: string;
  label: string;
  score: number;
  gap: number;
  evidence: string;
  why: string;
  nextMove: string;
  priority: "High" | "Medium" | "Low";
};

type AudienceAction = {
  title: string;
  detail: string;
  impact: "High" | "Medium" | "Low";
  speed: "Fast" | "Medium" | "Strategic";
  outcome: string;
};

type AudienceDataGap = {
  title: string;
  detail: string;
  resolved: boolean;
};

type AudienceSearchHit = {
  channel: SearchChannel;
  item: SearchItem;
};

type AudienceEvidence = {
  title: string;
  detail: string;
  source: string;
  tone: "green" | "amber" | "red" | "purple";
};

type AudienceSegmentInsight = {
  segment: CustomerSegment;
  liveRecord: WorkspaceRecord | null;
  relevantHits: AudienceSearchHit[];
  scores: AudienceScoreCategory[];
  totalScore: number;
  executionReadiness: number;
  discoverabilitySignal: number;
  fitSummary: string;
  buyingSummary: string;
  opportunitySummary: string;
  risks: string[];
  actions: AudienceAction[];
  evidence: AudienceEvidence[];
  dataGaps: AudienceDataGap[];
};

const CHANNELS: SearchChannel[] = ["seo", "geo", "aeo"];

const Pill = ({
  children,
  tone = "gray",
}: {
  children: ReactNode;
  tone?: "gray" | "green" | "amber" | "red" | "purple";
}) => (
  <span
    className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${
      tone === "green"
        ? "bg-chart-4/10 text-chart-4"
        : tone === "amber"
          ? "bg-chart-1/10 text-[var(--chart-1)]"
          : tone === "red"
            ? "bg-chart-5/10 text-chart-5"
            : tone === "purple"
              ? "bg-secondary text-foreground"
              : "bg-secondary text-muted-foreground"
    }`}
  >
    {children}
  </span>
);

function scoreTone(score: number) {
  if (score >= 8) return "green" as const;
  if (score >= 5) return "amber" as const;
  return "red" as const;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Not analyzed yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function average(values: number[]): number {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

function textValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((entry) => textValue(entry)).filter(Boolean).join(", ");
  if (typeof value === "object") return Object.values(value).map((entry) => textValue(entry)).filter(Boolean).join(", ");
  return "";
}

function listValue(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => textValue(entry)).filter(Boolean);
}

function numberValue(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const match = value.match(/-?\d+(\.\d+)?/);
    return match ? Number(match[0]) : null;
  }
  return null;
}

function itemBlob(item: SearchItem) {
  return [
    item.name,
    item.description,
    item.status,
    item.stage,
    ...Object.values(item.data ?? {}).map((entry) => textValue(entry)),
  ]
    .join(" ")
    .toLowerCase();
}

function matchRecord(record: WorkspaceRecord, segment: CustomerSegment) {
  const blob = [
    record.name,
    record.description,
    ...Object.values(record.data ?? {}).map((entry) => textValue(entry)),
  ]
    .join(" ")
    .toLowerCase();
  const terms = [
    segment.name,
    segment.industry,
    segment.companySize,
    segment.region,
    segment.maturityLevel,
    ...segment.buyingRoles,
    ...segment.useCases,
    ...segment.jobsToBeDone,
  ]
    .map((entry) => entry?.trim().toLowerCase())
    .filter(Boolean) as string[];
  return terms.some((term) => blob.includes(term));
}

function findRelevantHits(segment: CustomerSegment, summaries: SearchSummaryMap) {
  const terms = [
    segment.name,
    segment.industry,
    segment.companySize,
    segment.region,
    segment.maturityLevel,
    ...segment.buyingRoles,
    ...segment.useCases,
    ...segment.jobsToBeDone,
    ...segment.painPoints,
  ]
    .map((entry) => entry?.trim().toLowerCase())
    .filter(Boolean) as string[];

  return CHANNELS.flatMap((channel) => {
    const items = summaries[channel]?.items ?? [];
    return items
      .filter((item) => {
        const blob = itemBlob(item);
        return terms.some((term) => blob.includes(term));
      })
      .slice(0, 4)
      .map((item) => ({ channel, item }));
  });
}

function signalMetricsSummary(summary: SearchChannelSummary | undefined) {
  if (!summary) return "No connected search signal yet.";
  const metrics = summary.metrics;
  return `${metrics.records} records, ${metrics.opportunities} opportunities and ${summary.connectedTargets.length} connected target${summary.connectedTargets.length === 1 ? "" : "s"}.`;
}

function buildAudienceInsight(
  segment: CustomerSegment,
  snapshot: OnboardingSnapshot,
  liveRecords: WorkspaceRecord[],
  summaries: SearchSummaryMap,
) {
  const workspace = snapshot.workspace;
  const offerings = snapshot.offerings;
  const liveRecord = liveRecords.find((record) => matchRecord(record, segment)) ?? null;
  const relevantHits = findRelevantHits(segment, summaries);
  const relevantHitCount = relevantHits.length;
  const liveMemberCount = numberValue(liveRecord?.data?.members) ?? 0;
  const engagementValue = numberValue(liveRecord?.data?.engagement) ?? 0;
  const conversionValue = numberValue(liveRecord?.data?.conversion) ?? 0;
  const buyingRoleCount = segment.buyingRoles.length;
  const problemCount = segment.painPoints.length;
  const jobCount = segment.jobsToBeDone.length;
  const criteriaCount = segment.decisionCriteria.length;
  const useCaseCount = segment.useCases.length;
  const matchingOfferings = offerings.filter((offering) => {
    const blob = [
      offering.name,
      offering.description,
      offering.targetCustomer,
      offering.valueProposition,
      ...offering.useCases,
      ...offering.differentiators,
    ]
      .join(" ")
      .toLowerCase();
    return [
      segment.name,
      segment.industry,
      ...segment.useCases,
      ...segment.jobsToBeDone,
      ...segment.painPoints,
    ]
      .map((entry) => entry?.trim().toLowerCase())
      .filter((entry): entry is string => Boolean(entry))
      .some((term) => blob.includes(term));
  });

  const clarityScore = Math.min(
    10,
    2
      + (segment.industry ? 2 : 0)
      + (segment.companySize ? 1 : 0)
      + (segment.region ? 1 : 0)
      + (segment.maturityLevel ? 1 : 0)
      + (segment.priceSensitivity ? 1 : 0)
      + (segment.primarySegment ? 2 : 0),
  );
  const urgencyScore = Math.min(10, 2 + Math.min(3, problemCount) + Math.min(2, jobCount) + Math.min(1, useCaseCount) + (segment.notes ? 1 : 0) + (segment.primarySegment ? 1 : 0));
  const buyingPowerScore = Math.min(10, 2 + Math.min(3, buyingRoleCount) + Math.min(3, criteriaCount) + (segment.priceSensitivity ? 1 : 0) + (segment.primarySegment ? 1 : 0));
  const offerFitScore = Math.min(10, 2 + Math.min(4, matchingOfferings.length) + Math.min(2, useCaseCount) + (workspace.valueProposition ? 1 : 0) + (workspace.usp ? 1 : 0));
  const discoverabilityScore = Math.min(10, 2 + Math.min(3, relevantHitCount) + (summaries.seo?.lastAnalyzedAt ? 1 : 0) + (summaries.geo?.lastAnalyzedAt ? 1 : 0) + (summaries.aeo?.lastAnalyzedAt ? 1 : 0) + (liveRecord ? 1 : 0) + (liveMemberCount > 0 ? 1 : 0));
  const conversionReadinessScore = Math.min(10, 2 + (liveMemberCount > 0 ? 2 : 0) + (engagementValue > 0 ? 1 : 0) + (conversionValue > 0 ? 1 : 0) + Math.min(2, matchingOfferings.length) + (workspace.primaryIcp ? 1 : 0) + (workspace.targetMarket ? 1 : 0));

  const scores: AudienceScoreCategory[] = [
    {
      key: "clarity",
      label: "ICP Clarity",
      score: clarityScore,
      gap: 10 - clarityScore,
      evidence: `${segment.industry || "Industry missing"} · ${segment.companySize || "Company size missing"} · ${segment.region || "Region missing"}`,
      why: "A sharply defined audience lets Lulu write better pages, ads, prompts and sales talk tracks.",
      nextMove: "Tighten the segment profile with clearer company size, region, maturity and price sensitivity.",
      priority: clarityScore <= 5 ? "High" : clarityScore <= 7 ? "Medium" : "Low",
    },
    {
      key: "urgency",
      label: "Problem Urgency",
      score: urgencyScore,
      gap: 10 - urgencyScore,
      evidence: `${problemCount} pain points · ${jobCount} jobs to be done · ${useCaseCount} use cases`,
      why: "Higher pain and urgency make comparison messaging and demand capture faster to win.",
      nextMove: "Turn the top pain points into sharper outcomes, blockers and before/after language.",
      priority: urgencyScore <= 5 ? "High" : urgencyScore <= 7 ? "Medium" : "Low",
    },
    {
      key: "buying",
      label: "Buying Readiness",
      score: buyingPowerScore,
      gap: 10 - buyingPowerScore,
      evidence: `${buyingRoleCount} buying roles · ${criteriaCount} decision criteria`,
      why: "Buying roles and criteria decide whether the segment can actually move from interest to deal.",
      nextMove: "Map the champion, economic buyer and objections per segment more explicitly.",
      priority: buyingPowerScore <= 5 ? "High" : buyingPowerScore <= 7 ? "Medium" : "Low",
    },
    {
      key: "fit",
      label: "Offer Fit",
      score: offerFitScore,
      gap: 10 - offerFitScore,
      evidence: `${matchingOfferings.length} matching offering${matchingOfferings.length === 1 ? "" : "s"} aligned to this segment`,
      why: "A segment is only attractive if your actual offer system can beat alternatives for it.",
      nextMove: "Align the best offer, proof points and landing page narrative to this audience.",
      priority: offerFitScore <= 5 ? "High" : offerFitScore <= 7 ? "Medium" : "Low",
    },
    {
      key: "discoverability",
      label: "Discoverability",
      score: discoverabilityScore,
      gap: 10 - discoverabilityScore,
      evidence: `${relevantHitCount} relevant SEO/GEO/AEO signals · ${liveRecord ? "live audience record found" : "no live audience record"}`,
      why: "Discoverability determines whether the segment can be reached efficiently across search and answer surfaces.",
      nextMove: "Create segment-specific search surfaces, Q&A clusters and comparison pages for this audience.",
      priority: discoverabilityScore <= 5 ? "High" : discoverabilityScore <= 7 ? "Medium" : "Low",
    },
    {
      key: "conversion",
      label: "Conversion Readiness",
      score: conversionReadinessScore,
      gap: 10 - conversionReadinessScore,
      evidence: liveRecord
        ? `${liveMemberCount || "0"} members · ${engagementValue || "0"} engagement · ${conversionValue || "0"} conversion signal`
        : "No live audience performance record yet",
      why: "Readiness shows whether Lulu can convert this segment now or first needs proof, activation and distribution work.",
      nextMove: "Add stronger segment proof, audience-specific CTA logic and activation paths.",
      priority: conversionReadinessScore <= 5 ? "High" : conversionReadinessScore <= 7 ? "Medium" : "Low",
    },
  ];

  const totalScore = average(scores.map((item) => item.score));
  const executionReadiness = average([offerFitScore, discoverabilityScore, conversionReadinessScore]);
  const discoverabilitySignal = average([discoverabilityScore, urgencyScore, clarityScore]);
  const topGap = [...scores].sort((left, right) => right.gap - left.gap)[0];
  const secondGap = [...scores].sort((left, right) => right.gap - left.gap)[1];
  const fitSummary = matchingOfferings.length
    ? `${matchingOfferings.length} offering${matchingOfferings.length === 1 ? "" : "s"} already map to this audience.`
    : "No clear offering-to-audience mapping is documented yet.";
  const buyingSummary = buyingRoleCount
    ? `${buyingRoleCount} buying role${buyingRoleCount === 1 ? "" : "s"} and ${criteriaCount} decision criteria are documented.`
    : "Buying roles are still too weakly documented for this audience.";
  const opportunitySummary = relevantHitCount
    ? `${relevantHitCount} search and answer signals already overlap with this audience.`
    : "This audience has almost no explicit search-surface signal mapped yet.";
  const risks = [
    !segment.industry || !segment.companySize || !segment.region ? "Audience definition is still incomplete." : null,
    buyingRoleCount === 0 ? "No buying roles mapped yet." : null,
    criteriaCount === 0 ? "No decision criteria mapped yet." : null,
    matchingOfferings.length === 0 ? "No explicit offer fit documented yet." : null,
    !liveRecord ? "No live audience record exists for validation yet." : null,
  ].filter(Boolean) as string[];

  const actions: AudienceAction[] = [
    {
      title: `Clarify ${segment.name} ICP`,
      detail: topGap.nextMove,
      impact: topGap.gap >= 4 ? "High" : topGap.gap >= 2 ? "Medium" : "Low",
      speed: topGap.key === "clarity" || topGap.key === "urgency" ? "Fast" : "Medium",
      outcome: "Sharper segment definition for messaging, targeting and prioritization.",
    },
    {
      title: "Build audience-specific proof and offer mapping",
      detail: secondGap?.nextMove ?? "Add segment-specific proof, offer mapping and objections.",
      impact: "High",
      speed: matchingOfferings.length > 0 ? "Medium" : "Strategic",
      outcome: "Higher conversion readiness and better win-rates for this segment.",
    },
    {
      title: "Own search and answer surfaces for this audience",
      detail: "Translate pains, jobs and buying criteria into SEO, GEO, AEO and comparison assets.",
      impact: "High",
      speed: relevantHitCount > 0 ? "Fast" : "Medium",
      outcome: "Faster audience reach across discovery channels.",
    },
  ];

  const evidence: AudienceEvidence[] = [
    {
      title: "Segment profile",
      detail: `${segment.industry || "Industry missing"} · ${segment.companySize || "Company size missing"} · ${segment.region || "Region missing"} · ${segment.maturityLevel || "Maturity missing"}`,
      source: "Onboarding",
      tone: "green",
    },
    {
      title: "Buying system",
      detail: buyingSummary,
      source: "Customer segment",
      tone: buyingRoleCount > 0 && criteriaCount > 0 ? "green" : "amber",
    },
    {
      title: "Offer overlap",
      detail: fitSummary,
      source: "Offer catalog",
      tone: matchingOfferings.length > 0 ? "green" : "amber",
    },
    {
      title: "Discovery signals",
      detail: opportunitySummary,
      source: relevantHitCount > 0 ? "SEO/GEO/AEO" : "Data gaps",
      tone: relevantHitCount > 0 ? "purple" : "red",
    },
  ];

  const dataGaps: AudienceDataGap[] = [
    {
      title: "Audience definition",
      detail: !segment.industry || !segment.companySize || !segment.region
        ? "Industry, company size or region are still missing."
        : "Core audience fields are documented.",
      resolved: Boolean(segment.industry && segment.companySize && segment.region),
    },
    {
      title: "Buying roles",
      detail: buyingRoleCount > 0 ? "Buying roles are documented." : "No buying roles mapped yet.",
      resolved: buyingRoleCount > 0,
    },
    {
      title: "Decision criteria",
      detail: criteriaCount > 0 ? "Decision criteria are documented." : "No decision criteria mapped yet.",
      resolved: criteriaCount > 0,
    },
    {
      title: "Live validation",
      detail: liveRecord ? "A live audience record exists." : "No live audience record exists for validation yet.",
      resolved: Boolean(liveRecord),
    },
    {
      title: "Search visibility",
      detail: relevantHitCount > 0 ? "Audience-specific search signals exist." : "No strong SEO/GEO/AEO overlap detected yet.",
      resolved: relevantHitCount > 0,
    },
  ];

  return {
    segment,
    liveRecord,
    relevantHits,
    scores,
    totalScore,
    executionReadiness,
    discoverabilitySignal,
    fitSummary,
    buyingSummary,
    opportunitySummary,
    risks,
    actions,
    evidence,
    dataGaps,
  } satisfies AudienceSegmentInsight;
}

function AudienceScoreBar({ label, score, detail }: { label: string; score: number; detail: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>
        <Pill tone={scoreTone(score)}>{score}/10</Pill>
      </div>
      <div className="mt-3 h-2 rounded-full bg-secondary">
        <div
          className={`h-2 rounded-full ${
            score >= 8 ? "bg-chart-4" : score >= 5 ? "bg-[var(--chart-1)]" : "bg-chart-5"
          }`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  );
}

export const LuluAudiencesWorkspace = () => {
  const workspaceId = getSelectedWorkspaceId();
  const [query, setQuery] = useState("");
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>("");
  const [snapshot, setSnapshot] = useState<OnboardingSnapshot | null>(null);
  const [snapshotLoading, setSnapshotLoading] = useState(false);
  const [snapshotError, setSnapshotError] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<SearchSummaryMap>({});
  const [signalsLoading, setSignalsLoading] = useState(false);
  const [signalsError, setSignalsError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const {
    items: audienceRecords,
    total: audienceRecordTotal,
    loading: audienceRecordsLoading,
    error: audienceRecordsError,
    refresh: refreshAudienceRecords,
  } = useLiveRecords("marketing_audiences");

  const loadAudienceIntelligence = useCallback(async () => {
    if (!workspaceId) {
      setSnapshot(null);
      setSnapshotError(null);
      setSummaries({});
      setSignalsError(null);
      setSnapshotLoading(false);
      setSignalsLoading(false);
      return;
    }

    setSnapshotLoading(true);
    setSignalsLoading(true);
    setSnapshotError(null);
    setSignalsError(null);

    const [snapshotResult, ...searchResults] = await Promise.allSettled([
      onboardingApi.snapshot(workspaceId),
      getSearchChannelSummary("seo"),
      getSearchChannelSummary("geo"),
      getSearchChannelSummary("aeo"),
    ]);

    if (snapshotResult.status === "fulfilled") {
      setSnapshot(snapshotResult.value.data);
    } else {
      setSnapshot(null);
      setSnapshotError(getFriendlyErrorMessage(snapshotResult.reason, "Audience intelligence could not load the workspace profile."));
    }

    const nextSummaries: SearchSummaryMap = {};
    let firstSignalsError: string | null = null;
    searchResults.forEach((result, index) => {
      const channel = CHANNELS[index];
      if (result.status === "fulfilled") {
        nextSummaries[channel] = result.value.data;
      } else if (!firstSignalsError) {
        firstSignalsError = getFriendlyErrorMessage(result.reason, "Audience discovery signals could not be loaded.");
      }
    });
    setSummaries(nextSummaries);
    setSignalsError(firstSignalsError);
    setSnapshotLoading(false);
    setSignalsLoading(false);
  }, [workspaceId]);

  useEffect(() => {
    void loadAudienceIntelligence();
  }, [loadAudienceIntelligence]);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadAudienceIntelligence(), refreshAudienceRecords()]);
    } finally {
      setRefreshing(false);
    }
  }, [loadAudienceIntelligence, refreshAudienceRecords]);

  const workspace = snapshot?.workspace ?? null;
  const offerings = snapshot?.offerings ?? [];
  const customerSegments = snapshot?.customerSegments ?? [];
  const platforms = snapshot?.platforms ?? [];

  const audienceInsights = useMemo(
    () => customerSegments.map((segment) => buildAudienceInsight(segment, snapshot!, audienceRecords, summaries)),
    [audienceRecords, customerSegments, snapshot, summaries],
  );

  const visibleInsights = useMemo(() => {
    if (!query.trim()) return audienceInsights;
    const term = query.trim().toLowerCase();
    return audienceInsights.filter((insight) => {
      const blob = [
        insight.segment.name,
        insight.segment.industry,
        insight.segment.companySize,
        insight.segment.region,
        insight.segment.maturityLevel,
        ...insight.segment.painPoints,
        ...insight.segment.jobsToBeDone,
        ...insight.segment.buyingRoles,
        ...insight.segment.useCases,
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(term);
    });
  }, [audienceInsights, query]);

  useEffect(() => {
    if (!visibleInsights.length) {
      setSelectedSegmentId("");
      return;
    }
    if (!selectedSegmentId || !visibleInsights.some((insight) => insight.segment.id === selectedSegmentId)) {
      const primary = visibleInsights.find((insight) => insight.segment.primarySegment) ?? visibleInsights[0];
      setSelectedSegmentId(primary.segment.id);
    }
  }, [selectedSegmentId, visibleInsights]);

  const selectedInsight = visibleInsights.find((insight) => insight.segment.id === selectedSegmentId) ?? null;
  const topInsight = audienceInsights[0]
    ? [...audienceInsights].sort((left, right) => right.totalScore - left.totalScore || Number(right.segment.primarySegment) - Number(left.segment.primarySegment))[0]
    : null;
  const primaryInsight = audienceInsights.find((insight) => insight.segment.primarySegment) ?? topInsight;
  const unresolvedDataGaps = [
    !workspace?.primaryIcp ? "Primary ICP is not documented yet." : null,
    !workspace?.valueProposition ? "Value proposition is missing." : null,
    customerSegments.length === 0 ? "No customer segments have been defined yet." : null,
    !audienceRecordTotal ? "No live audience records exist yet." : null,
    !summaries.seo && !summaries.geo && !summaries.aeo ? "No search-intelligence signals are available yet." : null,
  ].filter(Boolean) as string[];

  const totalPainPoints = customerSegments.reduce((sum, segment) => sum + segment.painPoints.length, 0);
  const totalBuyingRoles = customerSegments.reduce((sum, segment) => sum + segment.buyingRoles.length, 0);
  const totalUseCases = customerSegments.reduce((sum, segment) => sum + segment.useCases.length, 0);
  const connectedPlatforms = platforms.filter((platform) => ["connected", "active", "synced", "authorized"].includes(platform.connectionStatus.trim().toLowerCase())).length;
  const searchSignalTotals = CHANNELS.reduce((sum, channel) => sum + (summaries[channel]?.metrics.records ?? 0), 0);
  const searchOpportunityTotals = CHANNELS.reduce((sum, channel) => sum + (summaries[channel]?.metrics.opportunities ?? 0), 0);
  const pageLoading = snapshotLoading || (audienceRecordsLoading && !audienceInsights.length);

  if (!workspaceId) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-4 py-6 text-foreground sm:px-7">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <Users className="mx-auto text-muted-foreground" size={30} />
          <h1 className="mt-4 text-xl font-semibold">No workspace selected</h1>
          <p className="mt-2 text-sm text-muted-foreground">Select a workspace first so Lulu can analyze the target audience.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-[var(--background)]/95 px-4 py-4 backdrop-blur sm:px-7">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Marketing</span>
              <ChevronRight size={12} />
              <span className="text-foreground">Audiences</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Audience Intelligence</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Lulu now analyzes your target audience from onboarding, live audience records and discovery signals so we can prioritize the best segment, expose gaps and drive execution without manual prep work.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[240px] flex-1 sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search segments, pain points, roles"
                className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                aria-label="Search audiences"
              />
            </div>
            <button
              type="button"
              onClick={() => void refreshAll()}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground"
            >
              <RefreshCw size={15} className={refreshing ? "animate-spin" : undefined} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 sm:px-7">
        {snapshotError && (
          <div role="alert" className="mb-4 rounded-xl border border-chart-5/30 bg-chart-5/10 px-4 py-3 text-sm text-chart-5">
            {snapshotError}
          </div>
        )}
        {signalsError && (
          <div role="alert" className="mb-4 rounded-xl border border-chart-1/30 bg-chart-1/10 px-4 py-3 text-sm text-[var(--chart-1)]">
            {signalsError}
          </div>
        )}
        {audienceRecordsError && (
          <div role="alert" className="mb-4 rounded-xl border border-chart-1/30 bg-chart-1/10 px-4 py-3 text-sm text-[var(--chart-1)]">
            {audienceRecordsError}
          </div>
        )}

        {pageLoading ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <RefreshCw className="mx-auto animate-spin text-muted-foreground" size={28} />
            <p className="mt-4 text-sm text-muted-foreground">Loading audience intelligence…</p>
          </div>
        ) : !snapshot || customerSegments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Users className="mx-auto text-muted-foreground" size={34} />
            <h2 className="mt-4 text-xl font-semibold">No target audience model yet</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
              Lulu needs customer segments from onboarding before it can build a full audience intelligence system. Once segments exist, this page will score them, surface the best one to attack first and generate the fastest path to win that audience.
            </p>
          </div>
        ) : (
          <>
            <section className="grid gap-4 xl:grid-cols-6">
              {[
                {
                  label: "Segments",
                  value: `${customerSegments.length}`,
                  detail: `${customerSegments.filter((segment) => segment.primarySegment).length} primary`,
                  icon: Users,
                },
                {
                  label: "Pain Points",
                  value: `${totalPainPoints}`,
                  detail: `${totalUseCases} use cases documented`,
                  icon: AlertTriangle,
                },
                {
                  label: "Buying Roles",
                  value: `${totalBuyingRoles}`,
                  detail: workspace?.primaryIcp || "Primary ICP missing",
                  icon: Target,
                },
                {
                  label: "Live Audience Records",
                  value: `${audienceRecordTotal}`,
                  detail: audienceRecordTotal ? "Observed signals available" : "No live validation yet",
                  icon: Activity,
                },
                {
                  label: "Search Signals",
                  value: `${searchSignalTotals}`,
                  detail: `${searchOpportunityTotals} opportunities`,
                  icon: Eye,
                },
                {
                  label: "Best Segment",
                  value: topInsight?.segment.name || "None",
                  detail: topInsight ? `${topInsight.totalScore}/10 overall fit` : "No segment ranked yet",
                  icon: TrendingUp,
                },
              ].map((card) => (
                <article key={card.label} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{card.label}</p>
                      <p className="mt-3 text-xl font-semibold tracking-tight text-foreground">{card.value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{card.detail}</p>
                    </div>
                    <span className="rounded-xl bg-secondary p-2 text-foreground">
                      <card.icon size={16} />
                    </span>
                  </div>
                </article>
              ))}
            </section>

            <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <article className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Audience thesis</p>
                    <h2 className="mt-2 text-lg font-semibold">Target audience operating system</h2>
                  </div>
                  <Pill tone="purple">Analyze - Prioritize - Execute</Pill>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                    <p className="text-sm font-medium text-foreground">Primary ICP</p>
                    <p className="mt-2 text-sm text-muted-foreground">{workspace?.primaryIcp || "Primary ICP is not documented yet."}</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {workspace?.valueProposition || "Value proposition missing."}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                    <p className="text-sm font-medium text-foreground">Go-to-market surface</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {workspace?.targetMarket || "Target market missing"} · {workspace?.languages.length || 0} language{workspace?.languages.length === 1 ? "" : "s"} · {connectedPlatforms} connected platform{connectedPlatforms === 1 ? "" : "s"}
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">{offerings.length} offering{offerings.length === 1 ? "" : "s"} currently documented.</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {CHANNELS.map((channel) => {
                    const summary = summaries[channel];
                    const label = channel.toUpperCase();
                    return (
                      <div key={channel} className="rounded-xl border border-border bg-card p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-foreground">{label}</p>
                          <Pill tone={summary ? "green" : "amber"}>{summary ? "Connected" : "Missing"}</Pill>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{signalMetricsSummary(summary)}</p>
                        <p className="mt-3 text-[11px] text-muted-foreground">Last analyzed: {formatDate(summary?.lastAnalyzedAt)}</p>
                      </div>
                    );
                  })}
                </div>
              </article>

              <article className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Data gaps</p>
                    <h2 className="mt-2 text-lg font-semibold">What still blocks perfect audience intelligence</h2>
                  </div>
                  <Pill tone={unresolvedDataGaps.length ? "amber" : "green"}>{unresolvedDataGaps.length} open</Pill>
                </div>
                <div className="mt-4 space-y-3">
                  {unresolvedDataGaps.length ? (
                    unresolvedDataGaps.map((gap) => (
                      <div key={gap} className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="mt-0.5 text-[var(--chart-1)]" size={16} />
                          <p className="text-sm text-muted-foreground">{gap}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 text-chart-4" size={16} />
                        <p className="text-sm text-muted-foreground">The core audience model is already well documented.</p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </section>

            <section className="mt-6 rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Priority matrix</p>
                  <h2 className="mt-2 text-lg font-semibold">Which audience should we win first?</h2>
                </div>
                <p className="text-sm text-muted-foreground">Lulu ranks each segment by ICP clarity, urgency, buying readiness, offer fit, discoverability and conversion readiness.</p>
              </div>
              <div className="mt-5 grid gap-4 xl:grid-cols-3">
                {visibleInsights.map((insight) => (
                  <button
                    key={insight.segment.id}
                    type="button"
                    onClick={() => setSelectedSegmentId(insight.segment.id)}
                    className={`rounded-2xl border p-5 text-left transition ${
                      selectedInsight?.segment.id === insight.segment.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-[var(--secondary)] hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-foreground">{insight.segment.name}</h3>
                          {insight.segment.primarySegment && <Pill tone="green">Primary</Pill>}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {[insight.segment.industry, insight.segment.companySize, insight.segment.region].filter(Boolean).join(" · ") || "Audience profile still incomplete"}
                        </p>
                      </div>
                      <Pill tone={scoreTone(insight.totalScore)}>{insight.totalScore}/10</Pill>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <AudienceScoreBar label="Execution" score={insight.executionReadiness} detail="Can Lulu move on this now?" />
                      <AudienceScoreBar label="Discovery" score={insight.discoverabilitySignal} detail="Search and answer signal strength" />
                      <AudienceScoreBar label="Validation" score={insight.liveRecord ? 8 : 3} detail={insight.liveRecord ? "Observed live record exists" : "No live validation yet"} />
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">{insight.opportunitySummary}</p>
                  </button>
                ))}
              </div>
            </section>

            {selectedInsight && (
              <>
                <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                  <article className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Selected segment</p>
                        <h2 className="mt-2 text-lg font-semibold">{selectedInsight.segment.name}</h2>
                      </div>
                      <Pill tone={scoreTone(selectedInsight.totalScore)}>{selectedInsight.totalScore}/10 fit</Pill>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      {selectedInsight.segment.notes || `${selectedInsight.segment.name} is currently the best audience to attack next based on the available business, offer and discovery signals.`}
                    </p>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <div className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                        <p className="text-sm font-medium text-foreground">Pain & urgency</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {selectedInsight.segment.painPoints.slice(0, 3).join(", ") || "No pain points documented yet."}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                        <p className="text-sm font-medium text-foreground">Buying system</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {selectedInsight.segment.buyingRoles.slice(0, 3).join(", ") || "No buying roles documented yet."}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                        <p className="text-sm font-medium text-foreground">Offer fit</p>
                        <p className="mt-2 text-sm text-muted-foreground">{selectedInsight.fitSummary}</p>
                      </div>
                      <div className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                        <p className="text-sm font-medium text-foreground">Discovery signal</p>
                        <p className="mt-2 text-sm text-muted-foreground">{selectedInsight.opportunitySummary}</p>
                      </div>
                      <div className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                        <p className="text-sm font-medium text-foreground">Live validation</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {selectedInsight.liveRecord
                            ? `${selectedInsight.liveRecord.name} is already recorded as a live audience signal.`
                            : "No live audience record exists for this segment yet."}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                        <p className="text-sm font-medium text-foreground">Main risk</p>
                        <p className="mt-2 text-sm text-muted-foreground">{selectedInsight.risks[0] || "No major audience risk detected right now."}</p>
                      </div>
                    </div>
                  </article>

                  <article className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Evidence</p>
                        <h2 className="mt-2 text-lg font-semibold">What Lulu already knows</h2>
                      </div>
                      <Pill tone="purple">{selectedInsight.relevantHits.length} signal{selectedInsight.relevantHits.length === 1 ? "" : "s"}</Pill>
                    </div>
                    <div className="mt-4 space-y-3">
                      {selectedInsight.evidence.map((item) => (
                        <div key={item.title} className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-foreground">{item.title}</p>
                            <Pill tone={item.tone}>{item.source}</Pill>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                </section>

                <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
                  <article className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Gap engine</p>
                        <h2 className="mt-2 text-lg font-semibold">What must improve to win this audience?</h2>
                      </div>
                      <Pill tone="amber">{selectedInsight.scores.filter((item) => item.gap >= 3).length} critical gaps</Pill>
                    </div>
                    <div className="mt-4 space-y-3">
                      {selectedInsight.scores.map((item) => (
                        <div key={item.key} className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-foreground">{item.label}</p>
                              <Pill tone={scoreTone(item.score)}>{item.score}/10</Pill>
                            </div>
                            <Pill tone={item.priority === "High" ? "red" : item.priority === "Medium" ? "amber" : "green"}>{item.priority}</Pill>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{item.evidence}</p>
                          <p className="mt-3 text-xs text-muted-foreground">{item.why}</p>
                          <div className="mt-3 flex items-start gap-2 text-xs text-foreground">
                            <ArrowRight size={14} className="mt-0.5 shrink-0" />
                            <span>{item.nextMove}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Data gaps</p>
                        <h2 className="mt-2 text-lg font-semibold">What is still missing</h2>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      {selectedInsight.dataGaps.map((gap) => (
                        <div key={gap.title} className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-foreground">{gap.title}</p>
                            <Pill tone={gap.resolved ? "green" : "amber"}>{gap.resolved ? "Resolved" : "Open"}</Pill>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{gap.detail}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                </section>

                <section className="mt-6 rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Fastest path</p>
                      <h2 className="mt-2 text-lg font-semibold">How Lulu should move on this audience next</h2>
                    </div>
                    <Pill tone="green">{primaryInsight?.segment.name === selectedInsight.segment.name ? "Best target" : "Actionable"}</Pill>
                  </div>
                  <div className="mt-5 grid gap-4 xl:grid-cols-3">
                    {selectedInsight.actions.map((action) => (
                      <article key={action.title} className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-foreground">{action.title}</p>
                          <Pill tone={action.impact === "High" ? "red" : action.impact === "Medium" ? "amber" : "green"}>{action.impact}</Pill>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{action.detail}</p>
                        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                          <span>{action.speed}</span>
                          <span>{action.outcome}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="mt-6 grid gap-4 xl:grid-cols-2">
                  <article className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Search intelligence</p>
                        <h2 className="mt-2 text-lg font-semibold">Relevant discovery signals</h2>
                      </div>
                      <Pill tone="purple">{selectedInsight.relevantHits.length} hits</Pill>
                    </div>
                    <div className="mt-4 space-y-3">
                      {selectedInsight.relevantHits.length ? (
                        selectedInsight.relevantHits.slice(0, 6).map(({ channel, item }) => (
                          <div key={`${channel}-${item.id}`} className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-medium text-foreground">{item.name}</p>
                              <Pill tone="purple">{channel.toUpperCase()}</Pill>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">{item.description || item.status}</p>
                            <p className="mt-3 text-[11px] text-muted-foreground">Updated {formatDate(item.updatedAt)}</p>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-xl border border-dashed border-border bg-[var(--secondary)] p-4 text-sm text-muted-foreground">
                          No strong audience-specific SEO, GEO or AEO signal is mapped yet. This is a real data gap, not a fake score.
                        </div>
                      )}
                    </div>
                  </article>

                  <article className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Autonomous execution</p>
                        <h2 className="mt-2 text-lg font-semibold">Audience loops Lulu should keep running</h2>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      {[
                        {
                          icon: Brain,
                          title: "Audience refinement loop",
                          detail: "Refine pains, jobs, buying roles and criteria until the audience profile is sharp enough to drive all downstream assets.",
                        },
                        {
                          icon: Compass,
                          title: "Messaging loop",
                          detail: "Turn the top pains and decision criteria into positioning, pages, objections and conversion copy for this audience.",
                        },
                        {
                          icon: Activity,
                          title: "Search discovery loop",
                          detail: "Translate this audience into SEO, GEO and AEO surfaces so Lulu can reach them across search and answer systems.",
                        },
                        {
                          icon: Zap,
                          title: "Activation loop",
                          detail: "Sync segment insight into content, campaigns, audience records and channel execution without waiting for manual prep.",
                        },
                        {
                          icon: Bot,
                          title: "Re-measurement loop",
                          detail: "Continuously re-score the audience based on new search signals, live audience records and updated onboarding intelligence.",
                        },
                      ].map((loop) => (
                        <div key={loop.title} className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                          <div className="flex items-start gap-3">
                            <span className="rounded-xl bg-card p-2 text-foreground">
                              <loop.icon size={16} />
                            </span>
                            <div>
                              <p className="text-sm font-medium text-foreground">{loop.title}</p>
                              <p className="mt-2 text-sm text-muted-foreground">{loop.detail}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                </section>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
};
