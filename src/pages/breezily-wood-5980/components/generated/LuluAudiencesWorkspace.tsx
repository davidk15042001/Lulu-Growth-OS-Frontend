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
import { aiApi } from "../../../../api/ai";
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

type AudienceProfileAttribute = {
  label: string;
  value: string;
  source: string;
  inferred: boolean;
};

type AudienceDossierItem = {
  label: string;
  value: string;
  status: "verified" | "inferred" | "gap";
};

type AudienceDossierSection = {
  title: string;
  summary: string;
  items: AudienceDossierItem[];
};

type AudienceDossierAction = {
  title: string;
  detail: string;
  priority: "High" | "Medium" | "Low";
};

type AudienceDossier = {
  executiveSummary: string;
  verifiedFacts: string[];
  inferredAssumptions: string[];
  dataGaps: string[];
  sections: AudienceDossierSection[];
  messagingAngles: string[];
  channelPriorities: string[];
  objections: string[];
  actionPlan: AudienceDossierAction[];
};

type ParsedAudienceDossierResult = {
  dossier: AudienceDossier | null;
  source: "json" | "narrative" | "fallback";
};

type AudienceSegmentOrigin = "existing" | "generated";

type AudienceSegmentInsight = {
  segment: CustomerSegment;
  origin: AudienceSegmentOrigin;
  liveRecord: WorkspaceRecord | null;
  relevantHits: AudienceSearchHit[];
  scores: AudienceScoreCategory[];
  totalScore: number;
  executionReadiness: number;
  discoverabilitySignal: number;
  confidenceScore: number;
  sourceCoverage: number;
  fitSummary: string;
  buyingSummary: string;
  opportunitySummary: string;
  bestFitReason: string;
  whyNow: string;
  profileAttributes: AudienceProfileAttribute[];
  risks: string[];
  actions: AudienceAction[];
  evidence: AudienceEvidence[];
  dataGaps: AudienceDataGap[];
};

const CHANNELS: SearchChannel[] = ["seo", "geo", "aeo"];
const GENERATED_SEGMENT_PREFIX = "generated-audience-";

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

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
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

function uniqueStrings(values: unknown[], limit = Number.POSITIVE_INFINITY): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const text = textValue(value).replace(/\s+/g, " ").trim();
    if (!text) continue;
    const key = normalizeKey(text);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(text);
    if (result.length >= limit) break;
  }

  return result;
}

function limitWords(value: string, limit = 8): string {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, limit).join(" ");
}

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function normalizePriority(value: unknown): "High" | "Medium" | "Low" {
  const text = textValue(value).toLowerCase();
  if (text === "high") return "High";
  if (text === "low") return "Low";
  return "Medium";
}

function normalizeDossierStatus(value: unknown): "verified" | "inferred" | "gap" {
  const text = textValue(value).toLowerCase();
  if (text === "verified") return "verified";
  if (text === "gap") return "gap";
  return "inferred";
}

function normalizeStringList(value: unknown, limit = 12): string[] {
  return uniqueStrings(Array.isArray(value) ? value : [value], limit);
}

function extractJsonObject(content: string): string | null {
  const trimmed = content.trim();
  if (!trimmed) return null;
  if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) return trimmed;

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]?.trim();
  if (fenced && ((fenced.startsWith("{") && fenced.endsWith("}")) || (fenced.startsWith("[") && fenced.endsWith("]")))) return fenced;

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) return trimmed.slice(firstBrace, lastBrace + 1);
  return null;
}

function extractBulletLines(block: string): string[] {
  return block
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}

function buildNarrativeAudienceDossier(content: string): AudienceDossier | null {
  const trimmed = content.trim();
  if (!trimmed) return null;

  const rawSections = trimmed
    .split(/\n(?=#{1,6}\s+)/)
    .map((section) => section.trim())
    .filter(Boolean);

  const sections = rawSections
    .map((section) => {
      const [headingLine, ...bodyLines] = section.split(/\r?\n/);
      const title = headingLine.replace(/^#{1,6}\s*/, "").trim();
      if (!title || title.toLowerCase() === "json") return null;

      const body = bodyLines.join("\n").trim();
      const summary = bodyLines.find((line) => {
        const trimmedLine = line.trim();
        return trimmedLine && !trimmedLine.startsWith("-") && !trimmedLine.startsWith("*") && !trimmedLine.startsWith("•");
      })?.trim() ?? "";

      const items = extractBulletLines(body)
        .slice(0, 6)
        .map((bullet, index) => {
          const [label, ...rest] = bullet.split(":");
          const lowerTitle = title.toLowerCase();
          return {
            label: rest.length ? label.trim() : `${title} ${index + 1}`,
            value: rest.length ? rest.join(":").trim() : bullet,
            status: lowerTitle.includes("gap")
              ? "gap"
              : lowerTitle.includes("assumption") || lowerTitle.includes("inferred")
                ? "inferred"
                : "verified",
          } satisfies AudienceDossierItem;
        });

      if (!summary && !items.length) return null;
      return {
        title,
        summary,
        items,
      } satisfies AudienceDossierSection;
    })
    .filter(Boolean) as AudienceDossierSection[];

  if (!sections.length) {
    return {
      executiveSummary: trimmed.replace(/\s+/g, " ").slice(0, 600),
      verifiedFacts: [],
      inferredAssumptions: [],
      dataGaps: [],
      sections: [{
        title: "Audience analysis",
        summary: trimmed.replace(/\s+/g, " ").slice(0, 600),
        items: [],
      }],
      messagingAngles: [],
      channelPriorities: [],
      objections: [],
      actionPlan: [],
    };
  }

  return {
    executiveSummary: sections[0]?.summary || trimmed.replace(/\s+/g, " ").slice(0, 600),
    verifiedFacts: sections
      .find((section) => section.title.toLowerCase().includes("verified"))
      ?.items.map((item) => `${item.label}: ${item.value}`) ?? [],
    inferredAssumptions: sections
      .find((section) => section.title.toLowerCase().includes("assumption") || section.title.toLowerCase().includes("inferred"))
      ?.items.map((item) => `${item.label}: ${item.value}`) ?? [],
    dataGaps: sections
      .find((section) => section.title.toLowerCase().includes("gap"))
      ?.items.map((item) => `${item.label}: ${item.value}`) ?? [],
    sections: sections.slice(0, 8),
    messagingAngles: sections
      .find((section) => section.title.toLowerCase().includes("messaging"))
      ?.items.map((item) => item.value)
      .slice(0, 8) ?? [],
    channelPriorities: sections
      .find((section) => section.title.toLowerCase().includes("channel"))
      ?.items.map((item) => item.value)
      .slice(0, 8) ?? [],
    objections: sections
      .find((section) => section.title.toLowerCase().includes("objection"))
      ?.items.map((item) => item.value)
      .slice(0, 8) ?? [],
    actionPlan: sections
      .find((section) => section.title.toLowerCase().includes("action"))
      ?.items.map((item) => ({
        title: item.label,
        detail: item.value,
        priority: "Medium" as const,
      }))
      .slice(0, 6) ?? [],
  };
}

function parseAudienceDossierContent(content: string): ParsedAudienceDossierResult {
  const parsed = extractJsonObject(content);
  if (parsed) {
    try {
      const normalized = normalizeAudienceDossier(JSON.parse(parsed));
      if (normalized) {
        return { dossier: normalized, source: "json" };
      }
    } catch {
      // Fall through to narrative parsing.
    }
  }

  const narrative = buildNarrativeAudienceDossier(content);
  if (narrative) {
    return { dossier: narrative, source: "narrative" };
  }

  return { dossier: null, source: "fallback" };
}

function normalizeAudienceDossier(input: unknown): AudienceDossier | null {
  if (!input || typeof input !== "object") return null;
  const object = input as Record<string, unknown>;
  const sections = Array.isArray(object.sections)
    ? object.sections
        .map((section) => {
          if (!section || typeof section !== "object") return null;
          const sectionObject = section as Record<string, unknown>;
          const items = Array.isArray(sectionObject.items)
            ? sectionObject.items
                .map((item) => {
                  if (!item || typeof item !== "object") return null;
                  const itemObject = item as Record<string, unknown>;
                  const label = textValue(itemObject.label);
                  const value = textValue(itemObject.value);
                  if (!label || !value) return null;
                  return {
                    label,
                    value,
                    status: normalizeDossierStatus(itemObject.status),
                  } satisfies AudienceDossierItem;
                })
                .filter(Boolean) as AudienceDossierItem[]
            : [];
          const title = textValue(sectionObject.title);
          if (!title) return null;
          return {
            title,
            summary: textValue(sectionObject.summary),
            items: items.slice(0, 8),
          } satisfies AudienceDossierSection;
        })
        .filter(Boolean) as AudienceDossierSection[]
    : [];

  const dossier: AudienceDossier = {
    executiveSummary: textValue(object.executiveSummary),
    verifiedFacts: normalizeStringList(object.verifiedFacts, 8),
    inferredAssumptions: normalizeStringList(object.inferredAssumptions, 8),
    dataGaps: normalizeStringList(object.dataGaps, 8),
    sections: sections.slice(0, 8),
    messagingAngles: normalizeStringList(object.messagingAngles, 8),
    channelPriorities: normalizeStringList(object.channelPriorities, 8),
    objections: normalizeStringList(object.objections, 8),
    actionPlan: Array.isArray(object.actionPlan)
      ? object.actionPlan
          .map((item) => {
            if (!item || typeof item !== "object") return null;
            const actionObject = item as Record<string, unknown>;
            const title = textValue(actionObject.title);
            const detail = textValue(actionObject.detail);
            if (!title || !detail) return null;
            return {
              title,
              detail,
              priority: normalizePriority(actionObject.priority),
            } satisfies AudienceDossierAction;
          })
          .filter(Boolean)
          .slice(0, 6) as AudienceDossierAction[]
      : [],
  };

  if (!dossier.executiveSummary && !dossier.sections.length) return null;
  return dossier;
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

function segmentOrigin(segment: CustomerSegment): AudienceSegmentOrigin {
  return segment.id.startsWith(GENERATED_SEGMENT_PREFIX) ? "generated" : "existing";
}

function dedupeSegments(segments: CustomerSegment[]): CustomerSegment[] {
  const seen = new Set<string>();
  const deduped: CustomerSegment[] = [];

  for (const segment of segments) {
    const key = normalizeKey(segment.name) || segment.id;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    deduped.push(segment);
  }

  return deduped;
}

function deriveCountryTargets(snapshot: OnboardingSnapshot, segment: CustomerSegment, liveRecord: WorkspaceRecord | null): string[] {
  const workspace = snapshot.workspace;
  const recordValues = liveRecord ? Object.values(liveRecord.data ?? {}) : [];
  return uniqueStrings([
    segment.region,
    workspace.countryRegion,
    workspace.targetMarket,
    ...workspace.languages.map((language) => `${language.toUpperCase()} markets`),
    ...recordValues.flatMap((value) => listValue(value)),
  ], 4);
}

function deriveAgeRange(segment: CustomerSegment): string {
  const blob = [
    segment.name,
    segment.notes,
    ...segment.buyingRoles,
    ...segment.useCases,
  ]
    .join(" ")
    .toLowerCase();

  if (blob.includes("student") || blob.includes("creator") || blob.includes("social")) return "22-34";
  if (blob.includes("founder") || blob.includes("manager") || blob.includes("lead") || blob.includes("head")) return "28-45";
  if (blob.includes("director") || blob.includes("vp") || blob.includes("chief") || blob.includes("executive")) return "35-54";
  return "28-45";
}

function deriveGenderMix(segment: CustomerSegment): string {
  const blob = [segment.name, segment.notes, ...segment.buyingRoles].join(" ").toLowerCase();
  if (blob.includes("women") || blob.includes("female")) return "Primarily female";
  if (blob.includes("men") || blob.includes("male")) return "Primarily male";
  return "Mixed / not gender-specific";
}

function deriveBusinessType(snapshot: OnboardingSnapshot, segment: CustomerSegment): string {
  const workspace = snapshot.workspace;
  const offeringTypes = uniqueStrings(snapshot.offerings.map((offering) => offering.offeringType), 2).join(" + ");
  const parts = [
    workspace.businessModelType,
    segment.industry,
    segment.companySize,
    offeringTypes ? `${offeringTypes} business` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "B2B growth-focused business";
}

function derivePersonaProfile(
  snapshot: OnboardingSnapshot,
  segment: CustomerSegment,
  liveRecord: WorkspaceRecord | null,
): AudienceProfileAttribute[] {
  const workspace = snapshot.workspace;
  const countries = deriveCountryTargets(snapshot, segment, liveRecord);
  const ageRange = deriveAgeRange(segment);
  const genderMix = deriveGenderMix(segment);
  const businessType = deriveBusinessType(snapshot, segment);
  const buyerRole = uniqueStrings(segment.buyingRoles, 3).join(", ") || "Founder / Marketing / Growth";
  const maturity = [segment.maturityLevel, workspace.companyStage].filter(Boolean).join(" · ") || "Growing to scaling";
  const languages = uniqueStrings(workspace.languages.map((language) => titleCase(language)), 3).join(", ") || "Language mix not documented";

  return [
    {
      label: "Age range",
      value: ageRange,
      source: "Derived from buying roles and audience context",
      inferred: true,
    },
    {
      label: "Gender mix",
      value: genderMix,
      source: "Derived from audience wording",
      inferred: true,
    },
    {
      label: "Business",
      value: businessType,
      source: "Workspace + offerings + segment",
      inferred: false,
    },
    {
      label: "Countries / markets",
      value: countries.join(", ") || "Global / not clearly defined",
      source: "Workspace region + target market + languages",
      inferred: countries.length === 0,
    },
    {
      label: "Buyer roles",
      value: buyerRole,
      source: "Customer segment",
      inferred: segment.buyingRoles.length === 0,
    },
    {
      label: "Company stage",
      value: maturity,
      source: "Segment + workspace stage",
      inferred: !segment.maturityLevel,
    },
    {
      label: "Languages",
      value: languages,
      source: "Workspace languages",
      inferred: workspace.languages.length === 0,
    },
  ];
}

function buildFallbackAudienceDossier(insight: AudienceSegmentInsight): AudienceDossier {
  const sections: AudienceDossierSection[] = [
    {
      title: "Demographics",
      summary: "Personal-profile assumptions inferred from the current audience definition.",
      items: insight.profileAttributes
        .filter((item) => ["Age range", "Gender mix", "Languages"].includes(item.label))
        .map((item): AudienceDossierItem => ({ label: item.label, value: item.value, status: item.inferred ? "inferred" : "verified" })),
    },
    {
      title: "Firmographics",
      summary: "Business shape and company context that define the audience commercially.",
      items: insight.profileAttributes
        .filter((item) => ["Business", "Company stage"].includes(item.label))
        .concat([
          { label: "Industry", value: insight.segment.industry || "Not fully documented", source: "Customer segment", inferred: !insight.segment.industry },
          { label: "Company size", value: insight.segment.companySize || "Not fully documented", source: "Customer segment", inferred: !insight.segment.companySize },
        ])
        .map((item): AudienceDossierItem => ({ label: item.label, value: item.value, status: item.inferred ? "inferred" : "verified" })),
    },
    {
      title: "Geography",
      summary: "Where the audience appears to be concentrated right now.",
      items: insight.profileAttributes
        .filter((item) => item.label === "Countries / markets")
        .map((item): AudienceDossierItem => ({ label: item.label, value: item.value, status: item.inferred ? "inferred" : "verified" })),
    },
    {
      title: "Buying Committee",
      summary: "Who evaluates and signs off on the offer.",
      items: [
        {
          label: "Buyer roles",
          value: insight.segment.buyingRoles.join(", ") || "No roles documented yet",
          status: insight.segment.buyingRoles.length ? "verified" : "gap",
        },
        {
          label: "Decision criteria",
          value: insight.segment.decisionCriteria.join(", ") || "No decision criteria documented yet",
          status: insight.segment.decisionCriteria.length ? "verified" : "gap",
        },
      ] satisfies AudienceDossierItem[],
    },
    {
      title: "Demand & Messaging",
      summary: "What they want, why they move and how Lulu should frame the offer.",
      items: [
        {
          label: "Pain points",
          value: insight.segment.painPoints.join(", ") || "No pain points documented yet",
          status: insight.segment.painPoints.length ? "verified" : "gap",
        },
        {
          label: "Jobs to be done",
          value: insight.segment.jobsToBeDone.join(", ") || "No jobs documented yet",
          status: insight.segment.jobsToBeDone.length ? "verified" : "gap",
        },
        {
          label: "Messaging angle",
          value: insight.bestFitReason,
          status: "inferred",
        },
      ] satisfies AudienceDossierItem[],
    },
  ];

  return {
    executiveSummary: `${insight.segment.name} is currently the strongest audience based on fit, buying readiness, discovery signal and execution potential. This fallback dossier is structured from live workspace signals while the AI narrative layer is unavailable.`,
    verifiedFacts: [
      `${insight.segment.name} scores ${insight.totalScore}/10 on current audience fit.`,
      insight.fitSummary,
      insight.buyingSummary,
      insight.opportunitySummary,
    ],
    inferredAssumptions: insight.profileAttributes.filter((item) => item.inferred).map((item) => `${item.label}: ${item.value}`),
    dataGaps: insight.dataGaps.filter((item) => !item.resolved).map((item) => item.detail),
    sections: sections.filter((section) => section.items.length > 0),
    messagingAngles: [
      insight.bestFitReason,
      insight.fitSummary,
      insight.opportunitySummary,
    ],
    channelPriorities: insight.relevantHits.length
      ? uniqueStrings(insight.relevantHits.map((item) => item.channel.toUpperCase()), 3)
      : ["SEO", "GEO", "AEO"],
    objections: [
      insight.risks[0] || "No major objection pattern documented yet.",
      "Proof and offer clarity still need to be tightened for this audience.",
    ],
    actionPlan: insight.actions.map((action) => ({
      title: action.title,
      detail: action.detail,
      priority: action.impact,
    })),
  };
}

function buildAudienceAnalysisPrompt(snapshot: OnboardingSnapshot, insight: AudienceSegmentInsight, summaries: SearchSummaryMap): string {
  const context = {
    workspace: {
      companyName: snapshot.workspace.companyName,
      industry: snapshot.workspace.industry,
      companySize: snapshot.workspace.companySize,
      countryRegion: snapshot.workspace.countryRegion,
      targetMarket: snapshot.workspace.targetMarket,
      businessModelType: snapshot.workspace.businessModelType,
      companyStage: snapshot.workspace.companyStage,
      primaryIcp: snapshot.workspace.primaryIcp,
      valueProposition: snapshot.workspace.valueProposition,
      usp: snapshot.workspace.usp,
      languages: snapshot.workspace.languages,
      primaryChallenges: snapshot.workspace.primaryChallenges,
    },
    audience: {
      name: insight.segment.name,
      industry: insight.segment.industry,
      companySize: insight.segment.companySize,
      region: insight.segment.region,
      maturityLevel: insight.segment.maturityLevel,
      priceSensitivity: insight.segment.priceSensitivity,
      buyingRoles: insight.segment.buyingRoles,
      decisionCriteria: insight.segment.decisionCriteria,
      painPoints: insight.segment.painPoints,
      jobsToBeDone: insight.segment.jobsToBeDone,
      useCases: insight.segment.useCases,
      notes: insight.segment.notes,
      profileAttributes: insight.profileAttributes,
      currentScores: insight.scores.map((score) => ({ label: score.label, score: score.score, evidence: score.evidence })),
      fitSummary: insight.fitSummary,
      buyingSummary: insight.buyingSummary,
      opportunitySummary: insight.opportunitySummary,
      bestFitReason: insight.bestFitReason,
      whyNow: insight.whyNow,
      risks: insight.risks,
      dataGaps: insight.dataGaps,
    },
    offerings: snapshot.offerings.slice(0, 8).map((offering) => ({
      name: offering.name,
      type: offering.offeringType,
      targetCustomer: offering.targetCustomer,
      customerProblem: offering.customerProblem,
      valueProposition: offering.valueProposition,
      useCases: offering.useCases,
      differentiators: offering.differentiators,
      objections: offering.objections,
    })),
    liveAudienceRecord: insight.liveRecord
      ? {
          name: insight.liveRecord.name,
          description: insight.liveRecord.description,
          data: insight.liveRecord.data,
        }
      : null,
    searchSignals: {
      relevantHits: insight.relevantHits.slice(0, 8).map(({ channel, item }) => ({
        channel,
        name: item.name,
        description: item.description,
        status: item.status,
        stage: item.stage,
      })),
      summary: CHANNELS.map((channel) => ({
        channel,
        records: summaries[channel]?.metrics.records ?? 0,
        opportunities: summaries[channel]?.metrics.opportunities ?? 0,
        connectedTargets: summaries[channel]?.connectedTargets.length ?? 0,
      })),
    },
  };

  return [
    "Create a detailed target-audience intelligence dossier for this workspace.",
    "The user should not need to do manual analysis.",
    "Use the provided context only.",
    "You must strictly separate verified facts, inferred assumptions and data gaps.",
    "Never present inferred age, gender or persona traits as verified facts.",
    "Return JSON only with this exact structure:",
    JSON.stringify({
      executiveSummary: "string",
      verifiedFacts: ["string"],
      inferredAssumptions: ["string"],
      dataGaps: ["string"],
      sections: [
        {
          title: "Demographics",
          summary: "string",
          items: [{ label: "Age range", value: "string", status: "verified|inferred|gap" }],
        },
      ],
      messagingAngles: ["string"],
      channelPriorities: ["string"],
      objections: ["string"],
      actionPlan: [{ title: "string", detail: "string", priority: "High|Medium|Low" }],
    }, null, 2),
    "The sections must cover at least: Demographics, Firmographics, Geography, Psychographics, Buying Committee, Jobs To Be Done, Messaging, Channels.",
    "Context:",
    JSON.stringify(context, null, 2),
  ].join("\n");
}

function deriveRoleSeeds(snapshot: OnboardingSnapshot): string[] {
  const platformBlob = snapshot.platforms
    .map((platform) => [platform.name, platform.category, platform.integrationKey].filter(Boolean).join(" ").toLowerCase())
    .join(" ");

  return uniqueStrings([
    ...snapshot.customerSegments.flatMap((segment) => segment.buyingRoles),
    platformBlob.includes("crm") || platformBlob.includes("sales") ? "Revenue Lead" : null,
    platformBlob.includes("crm") || platformBlob.includes("sales") ? "Sales Lead" : null,
    platformBlob.includes("meta") || platformBlob.includes("linkedin") || platformBlob.includes("google") || platformBlob.includes("ads") ? "Demand Gen Lead" : null,
    platformBlob.includes("shopify") || platformBlob.includes("commerce") || platformBlob.includes("store") ? "Ecommerce Manager" : null,
    platformBlob.includes("wordpress") || platformBlob.includes("webflow") || platformBlob.includes("content") || platformBlob.includes("seo") ? "Content Lead" : null,
    "Founder",
    "Marketing Lead",
    "Growth Lead",
    "Operations Lead",
    snapshot.offerings.some((offering) => offering.offeringType === "service") ? "Managing Director" : null,
  ], 8);
}

function buildGeneratedAudienceCandidates(
  snapshot: OnboardingSnapshot,
  liveRecords: WorkspaceRecord[],
  summaries: SearchSummaryMap,
): CustomerSegment[] {
  const workspace = snapshot.workspace;
  const industries = uniqueStrings([
    workspace.industry,
    ...snapshot.customerSegments.map((segment) => segment.industry),
    ...workspace.regulatedIndustries,
  ], 4);
  const companySizes = uniqueStrings([
    workspace.companySize,
    ...snapshot.customerSegments.map((segment) => segment.companySize),
    "SMB",
    "Mid-market",
    "Enterprise",
  ], 4);
  const regions = uniqueStrings([
    workspace.countryRegion,
    workspace.targetMarket,
    ...snapshot.customerSegments.map((segment) => segment.region),
    ...workspace.languages.map((language) => `${language}-speaking markets`),
  ], 4);
  const maturities = uniqueStrings([
    workspace.companyStage,
    ...snapshot.customerSegments.map((segment) => segment.maturityLevel),
    "Growing",
    "Scaling",
    "Established",
  ], 3);
  const roleSeeds = deriveRoleSeeds(snapshot);
  const painSeeds = uniqueStrings([
    ...workspace.primaryChallenges,
    workspace.primaryIcp,
    workspace.valueProposition,
    ...snapshot.customerSegments.flatMap((segment) => [...segment.painPoints, ...segment.jobsToBeDone, ...segment.useCases, segment.notes]),
    ...snapshot.offerings.flatMap((offering) => [
      offering.customerProblem,
      offering.targetCustomer,
      offering.valueProposition,
      ...offering.useCases,
      ...offering.differentiators,
    ]),
    ...liveRecords.flatMap((record) => [
      record.name,
      record.description,
      ...Object.values(record.data ?? {}).map((entry) => textValue(entry)),
    ]),
    ...CHANNELS.flatMap((channel) => (summaries[channel]?.items ?? []).flatMap((item) => [item.name, item.description])),
  ], 16).map((value) => limitWords(value, 7));
  const useCaseSeeds = uniqueStrings([
    ...snapshot.offerings.flatMap((offering) => offering.useCases),
    ...snapshot.customerSegments.flatMap((segment) => [...segment.useCases, ...segment.jobsToBeDone]),
    workspace.primaryIcp,
    workspace.valueProposition,
    workspace.targetMarket,
  ], 14).map((value) => limitWords(value, 7));
  const decisionSeeds = uniqueStrings([
    ...snapshot.customerSegments.flatMap((segment) => segment.decisionCriteria),
    ...snapshot.offerings.flatMap((offering) => [...offering.differentiators, ...offering.proofPoints, ...offering.objections]),
    workspace.usp,
    workspace.valueProposition,
  ], 10).map((value) => limitWords(value, 7));

  const liveCandidates = liveRecords.slice(0, 4).map((record, index) => {
    const role = roleSeeds[index % Math.max(roleSeeds.length, 1)] ?? "Growth Lead";
    const industry = industries[index % Math.max(industries.length, 1)] ?? workspace.industry ?? "Digital";
    const companySize = companySizes[index % Math.max(companySizes.length, 1)] ?? workspace.companySize ?? "Growth-stage";
    const region = regions[index % Math.max(regions.length, 1)] ?? workspace.countryRegion ?? "Global";
    const maturityLevel = maturities[index % Math.max(maturities.length, 1)] ?? workspace.companyStage ?? "Scaling";

    return {
      id: `${GENERATED_SEGMENT_PREFIX}record-${record.id}`,
      name: record.name || `${role} in ${industry}`,
      industry,
      companySize,
      region,
      maturityLevel,
      painPoints: uniqueStrings([
        record.description,
        ...listValue(record.data?.painPoints),
        ...listValue(record.data?.challenges),
        painSeeds[index],
        workspace.primaryChallenges[index % Math.max(workspace.primaryChallenges.length, 1)],
      ], 3),
      jobsToBeDone: uniqueStrings([
        ...listValue(record.data?.jobsToBeDone),
        ...listValue(record.data?.jobs),
        useCaseSeeds[index],
        snapshot.offerings[index % Math.max(snapshot.offerings.length, 1)]?.useCases[0],
      ], 3),
      decisionCriteria: uniqueStrings([
        ...listValue(record.data?.decisionCriteria),
        decisionSeeds[index],
        decisionSeeds[(index + 1) % Math.max(decisionSeeds.length, 1)],
      ], 3),
      useCases: uniqueStrings([
        ...listValue(record.data?.useCases),
        useCaseSeeds[index],
        useCaseSeeds[(index + 1) % Math.max(useCaseSeeds.length, 1)],
      ], 3),
      buyingRoles: uniqueStrings([
        textValue(record.data?.role),
        textValue(record.data?.buyer),
        textValue(record.data?.owner),
        role,
      ], 2),
      priceSensitivity: textValue(record.data?.priceSensitivity) || snapshot.customerSegments[0]?.priceSensitivity || null,
      primarySegment: index === 0 && snapshot.customerSegments.length === 0,
      sortOrder: index,
      notes: "Generated by Lulu from a live audience record plus workspace and search context.",
    } satisfies CustomerSegment;
  });

  const syntheticCandidates: CustomerSegment[] = [];
  const defaultIndustry = industries[0] ?? workspace.industry ?? "Digital";
  const defaultSize = companySizes[0] ?? workspace.companySize ?? "Growth-stage";
  const defaultRegion = regions[0] ?? workspace.countryRegion ?? "Global";
  const defaultMaturity = maturities[0] ?? workspace.companyStage ?? "Scaling";

  for (let index = 0; index < 12; index += 1) {
    const role = roleSeeds[index % Math.max(roleSeeds.length, 1)] ?? "Growth Lead";
    const industry = industries[index % Math.max(industries.length, 1)] ?? defaultIndustry;
    const companySize = companySizes[index % Math.max(companySizes.length, 1)] ?? defaultSize;
    const region = regions[index % Math.max(regions.length, 1)] ?? defaultRegion;
    const maturityLevel = maturities[index % Math.max(maturities.length, 1)] ?? defaultMaturity;
    const primaryTheme = painSeeds[index % Math.max(painSeeds.length, 1)] ?? workspace.primaryIcp ?? workspace.valueProposition ?? "growth execution";
    const secondaryTheme = useCaseSeeds[index % Math.max(useCaseSeeds.length, 1)] ?? primaryTheme;
    const tertiaryTheme = painSeeds[(index + 1) % Math.max(painSeeds.length, 1)] ?? workspace.targetMarket ?? secondaryTheme;
    const name = `${role} at ${companySize} ${industry} companies`;

    syntheticCandidates.push({
      id: `${GENERATED_SEGMENT_PREFIX}${normalizeKey(name).replace(/\s+/g, "-") || index}`,
      name,
      industry,
      companySize,
      region,
      maturityLevel,
      painPoints: uniqueStrings([primaryTheme, tertiaryTheme, workspace.primaryChallenges[index % Math.max(workspace.primaryChallenges.length, 1)]], 3),
      jobsToBeDone: uniqueStrings([secondaryTheme, primaryTheme, snapshot.offerings[index % Math.max(snapshot.offerings.length, 1)]?.useCases[0]], 3),
      decisionCriteria: uniqueStrings([
        decisionSeeds[index % Math.max(decisionSeeds.length, 1)],
        decisionSeeds[(index + 1) % Math.max(decisionSeeds.length, 1)],
        workspace.usp,
      ], 3),
      useCases: uniqueStrings([
        secondaryTheme,
        snapshot.offerings[index % Math.max(snapshot.offerings.length, 1)]?.useCases[0],
        snapshot.offerings[index % Math.max(snapshot.offerings.length, 1)]?.valueProposition,
      ], 3),
      buyingRoles: uniqueStrings([role, roleSeeds[(index + 1) % Math.max(roleSeeds.length, 1)]], 2),
      priceSensitivity: snapshot.customerSegments[index % Math.max(snapshot.customerSegments.length, 1)]?.priceSensitivity ?? null,
      primarySegment: index === 0 && snapshot.customerSegments.length === 0,
      sortOrder: index + liveCandidates.length,
      notes: `Generated by Lulu from the company profile, offer catalog, live audience signals and search demand. Focus: ${secondaryTheme}.`,
    });
  }

  return dedupeSegments([...liveCandidates, ...syntheticCandidates]).slice(0, 10);
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
  const sourceCoverage = average([
    segment.industry && segment.companySize && segment.region ? 10 : 4,
    matchingOfferings.length > 0 ? 9 : 4,
    liveRecord ? 9 : 3,
    relevantHitCount > 0 ? Math.min(10, 4 + relevantHitCount) : 3,
  ]);
  const confidenceScore = average([
    totalScore,
    executionReadiness,
    sourceCoverage,
    10 - Math.min(8, scores.filter((item) => item.gap >= 4).length * 2),
  ]);
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
  const bestFitReason = [
    offerFitScore >= 7 ? "strong offer fit" : null,
    buyingPowerScore >= 7 ? "clear buying readiness" : null,
    discoverabilityScore >= 7 ? "good discovery surface" : null,
    liveRecord ? "real live validation" : null,
    segment.primarySegment ? "already aligned with the primary ICP" : null,
  ].filter(Boolean).join(", ") || "it is the strongest available mix of fit, urgency and execution readiness right now";
  const whyNow = liveRecord
    ? "This audience is actionable now because Lulu already sees live audience validation signals."
    : relevantHitCount > 0
      ? "This audience is actionable now because search and answer demand already exists."
      : matchingOfferings.length > 0
        ? "This audience is actionable now because the offer system already fits it well."
        : "This audience is promising, but it still needs stronger proof and validation.";
  const profileAttributes = derivePersonaProfile(snapshot, segment, liveRecord);
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
    origin: segmentOrigin(segment),
    liveRecord,
    relevantHits,
    scores,
    totalScore,
    executionReadiness,
    discoverabilitySignal,
    confidenceScore,
    sourceCoverage,
    fitSummary,
    buyingSummary,
    opportunitySummary,
    bestFitReason,
    whyNow,
    profileAttributes,
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
  const [dossiersBySegment, setDossiersBySegment] = useState<Record<string, AudienceDossier>>({});
  const [dossierLoadingId, setDossierLoadingId] = useState<string | null>(null);
  const [dossierStatusMessage, setDossierStatusMessage] = useState<string | null>(null);
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
    setDossiersBySegment({});
    setDossierStatusMessage(null);
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

  const generatedSegments = useMemo(
    () => (snapshot ? buildGeneratedAudienceCandidates(snapshot, audienceRecords, summaries) : []),
    [audienceRecords, snapshot, summaries],
  );

  const segmentPool = useMemo(
    () => dedupeSegments([...customerSegments, ...generatedSegments]),
    [customerSegments, generatedSegments],
  );

  const rankedAudienceInsights = useMemo(() => {
    if (!snapshot) return [];
    return segmentPool
      .map((segment) => buildAudienceInsight(segment, snapshot, audienceRecords, summaries))
      .sort((left, right) => right.totalScore - left.totalScore || Number(right.segment.primarySegment) - Number(left.segment.primarySegment));
  }, [audienceRecords, segmentPool, snapshot, summaries]);

  const audienceInsights = useMemo(
    () => rankedAudienceInsights.slice(0, 10),
    [rankedAudienceInsights],
  );

  const visibleInsights = useMemo(() => {
    const baseInsights = query.trim() ? rankedAudienceInsights : audienceInsights;
    if (!query.trim()) return baseInsights;
    const term = query.trim().toLowerCase();
    return baseInsights.filter((insight) => {
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
    }).slice(0, 10);
  }, [audienceInsights, query, rankedAudienceInsights]);

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
  const topInsight = audienceInsights[0] ?? null;
  const selectedDossier = selectedInsight ? dossiersBySegment[selectedInsight.segment.id] ?? null : null;
  const primaryInsight = audienceInsights.find((insight) => insight.segment.primarySegment) ?? topInsight;
  const generatedCandidateCount = segmentPool.filter((segment) => segmentOrigin(segment) === "generated").length;
  const manualCandidateCount = segmentPool.length - generatedCandidateCount;
  const unresolvedDataGaps = [
    !workspace?.primaryIcp ? "Primary ICP is not documented yet." : null,
    !workspace?.valueProposition ? "Value proposition is missing." : null,
    customerSegments.length === 0 && generatedSegments.length > 0 ? "No manual customer segments exist yet. The ranking is currently based on Lulu-generated audiences." : null,
    customerSegments.length === 0 && generatedSegments.length === 0 ? "Lulu could not generate audience candidates from the available business data yet." : null,
    !audienceRecordTotal ? "No live audience records exist yet." : null,
    !summaries.seo && !summaries.geo && !summaries.aeo ? "No search-intelligence signals are available yet." : null,
  ].filter(Boolean) as string[];

  const totalPainPoints = customerSegments.reduce((sum, segment) => sum + segment.painPoints.length, 0);
  const totalBuyingRoles = customerSegments.reduce((sum, segment) => sum + segment.buyingRoles.length, 0);
  const totalUseCases = customerSegments.reduce((sum, segment) => sum + segment.useCases.length, 0);
  const connectedPlatforms = platforms.filter((platform) => ["connected", "active", "synced", "authorized"].includes(platform.connectionStatus.trim().toLowerCase())).length;
  const searchSignalTotals = CHANNELS.reduce((sum, channel) => sum + (summaries[channel]?.metrics.records ?? 0), 0);
  const searchOpportunityTotals = CHANNELS.reduce((sum, channel) => sum + (summaries[channel]?.metrics.opportunities ?? 0), 0);
  const pageLoading = snapshotLoading || (audienceRecordsLoading && !rankedAudienceInsights.length);

  const loadAudienceDossier = useCallback(async (insight: AudienceSegmentInsight, force = false) => {
    if (!workspaceId || !snapshot) return;
    if (!force && dossiersBySegment[insight.segment.id]) return;

    setDossierLoadingId(insight.segment.id);
    setDossierStatusMessage(null);

    try {
      const conversations = (await aiApi.conversations(workspaceId)).data.items;
      let conversation = conversations.find((item) => item.metadata?.source === "audience-intelligence" && item.metadata?.segmentId === insight.segment.id) ?? null;

      if (!conversation) {
        conversation = (await aiApi.createConversation(workspaceId, {
          title: `Audience dossier: ${insight.segment.name}`,
          metadata: {
            source: "audience-intelligence",
            page: "audiences",
            segmentId: insight.segment.id,
          },
        })).data;
      }

      if (!force) {
        const existingMessages = (await aiApi.messages(workspaceId, conversation.id)).data.items;
        const latestAssistant = [...existingMessages].reverse().find((item) => item.role === "assistant");
        if (latestAssistant) {
          const parsedResult = parseAudienceDossierContent(latestAssistant.content);
          const dossier = parsedResult.dossier;
          if (dossier) {
            setDossiersBySegment((current) => ({ ...current, [insight.segment.id]: dossier }));
            if (parsedResult.source === "narrative") {
              setDossierStatusMessage("The AI returned narrative analysis instead of strict JSON, so Lulu normalized it automatically.");
            }
            setDossierLoadingId((current) => (current === insight.segment.id ? null : current));
            return;
          }
        }
      }

      const response = await aiApi.respond(
        workspaceId,
        conversation.id,
        buildAudienceAnalysisPrompt(snapshot, insight, summaries),
        {
          source: "audience-intelligence",
          page: "audiences",
          segmentId: insight.segment.id,
        },
      );

      const parsedResult = parseAudienceDossierContent(response.data.assistantMessage.content);
      if (!parsedResult.dossier) {
        setDossiersBySegment((current) => ({ ...current, [insight.segment.id]: buildFallbackAudienceDossier(insight) }));
        setDossierStatusMessage("Lulu is showing a structured fallback analysis because the AI response format was incomplete.");
        return;
      }

      const dossier = parsedResult.dossier;
      setDossiersBySegment((current) => ({ ...current, [insight.segment.id]: dossier }));
      if (parsedResult.source === "narrative") {
        setDossierStatusMessage("The AI returned narrative analysis instead of strict JSON, so Lulu normalized it automatically.");
      }
    } catch (error) {
      setDossiersBySegment((current) => ({ ...current, [insight.segment.id]: buildFallbackAudienceDossier(insight) }));
      setDossierStatusMessage(getFriendlyErrorMessage(error, "Lulu is showing a structured fallback analysis from the available workspace signals while the AI dossier endpoint is unavailable."));
    } finally {
      setDossierLoadingId((current) => (current === insight.segment.id ? null : current));
    }
  }, [dossiersBySegment, snapshot, summaries, workspaceId]);

  useEffect(() => {
    if (!selectedInsight) return;
    void loadAudienceDossier(selectedInsight);
  }, [loadAudienceDossier, selectedInsight]);

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
        ) : !snapshot || !rankedAudienceInsights.length ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Users className="mx-auto text-muted-foreground" size={34} />
            <h2 className="mt-4 text-xl font-semibold">No audience engine yet</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
              Lulu needs at least some company, offer or search context before it can generate and rank the 10 best audiences automatically.
            </p>
          </div>
        ) : (
          <>
            <section className="grid gap-4 xl:grid-cols-6">
              {[
                {
                  label: "Top Audiences",
                  value: `${audienceInsights.length}`,
                  detail: `${generatedCandidateCount} generated · ${manualCandidateCount} manual`,
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
                  label: "Best Audience",
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
                  <Pill tone="purple">Generate - Rank - Execute</Pill>
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

            {topInsight && (
              <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <article className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Best-fit recommendation</p>
                      <h2 className="mt-2 text-lg font-semibold">{topInsight.segment.name} is the best audience to attack now</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <Pill tone={topInsight.origin === "generated" ? "purple" : "gray"}>
                        {topInsight.origin === "generated" ? "Generated by Lulu" : "Manual"}
                      </Pill>
                      <Pill tone={scoreTone(topInsight.confidenceScore)}>{topInsight.confidenceScore}/10 confidence</Pill>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Lulu recommends this audience because it has {topInsight.bestFitReason}.
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">{topInsight.whyNow}</p>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <AudienceScoreBar label="Overall fit" score={topInsight.totalScore} detail="How strong the full audience match is" />
                    <AudienceScoreBar label="Confidence" score={topInsight.confidenceScore} detail="How reliable the current recommendation is" />
                    <AudienceScoreBar label="Source coverage" score={topInsight.sourceCoverage} detail="How much real business and signal data supports it" />
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {topInsight.profileAttributes.slice(0, 4).map((attribute) => (
                      <div key={attribute.label} className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-foreground">{attribute.label}</p>
                          <Pill tone={attribute.inferred ? "amber" : "green"}>{attribute.inferred ? "Inferred" : "Data"}</Pill>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{attribute.value}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Why this company can win</p>
                      <h2 className="mt-2 text-lg font-semibold">Current angle of attack</h2>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      `Offer fit: ${topInsight.fitSummary}`,
                      `Buying system: ${topInsight.buyingSummary}`,
                      `Discovery: ${topInsight.opportunitySummary}`,
                      `Main risk: ${topInsight.risks[0] || "No major blocking risk right now."}`,
                    ].map((item) => (
                      <div key={item} className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                        <p className="text-sm text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            )}

            <section className="mt-6 rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Priority matrix</p>
                    <h2 className="mt-2 text-lg font-semibold">Which 10 audiences should we attack first?</h2>
                </div>
                <p className="text-sm text-muted-foreground">Lulu generates its own audience candidates and ranks the best 10 by ICP clarity, urgency, buying readiness, offer fit, discoverability and conversion readiness.</p>
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
                          <Pill tone={insight.origin === "generated" ? "purple" : "gray"}>
                            {insight.origin === "generated" ? "Generated by Lulu" : "Manual"}
                          </Pill>
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
                      <AudienceScoreBar label="Confidence" score={insight.confidenceScore} detail={insight.liveRecord ? "Observed live record exists" : "Heuristic plus known business signals"} />
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
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Selected audience</p>
                        <h2 className="mt-2 text-lg font-semibold">{selectedInsight.segment.name}</h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pill tone={selectedInsight.origin === "generated" ? "purple" : "gray"}>
                          {selectedInsight.origin === "generated" ? "Generated by Lulu" : "Manual"}
                        </Pill>
                        <Pill tone={scoreTone(selectedInsight.totalScore)}>{selectedInsight.totalScore}/10 fit</Pill>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      {selectedInsight.segment.notes || `${selectedInsight.segment.name} is currently the best audience to attack next based on the available business, offer and discovery signals.`}
                    </p>
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {selectedInsight.profileAttributes.map((attribute) => (
                        <div key={attribute.label} className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-foreground">{attribute.label}</p>
                            <Pill tone={attribute.inferred ? "amber" : "green"}>{attribute.inferred ? "Inferred" : "Data"}</Pill>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{attribute.value}</p>
                          <p className="mt-3 text-xs text-muted-foreground">{attribute.source}</p>
                        </div>
                      ))}
                      <div className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                        <p className="text-sm font-medium text-foreground">Why this is the fit</p>
                        <p className="mt-2 text-sm text-muted-foreground">{selectedInsight.bestFitReason}</p>
                      </div>
                      <div className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                        <p className="text-sm font-medium text-foreground">Confidence</p>
                        <p className="mt-2 text-sm text-muted-foreground">{selectedInsight.confidenceScore}/10 based on the current evidence mix.</p>
                      </div>
                      <div className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                        <p className="text-sm font-medium text-foreground">Source coverage</p>
                        <p className="mt-2 text-sm text-muted-foreground">{selectedInsight.sourceCoverage}/10 supported by onboarding, offers, live records and search signals.</p>
                      </div>
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

                <section className="mt-6 rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">AI dossier</p>
                      <h2 className="mt-2 text-lg font-semibold">Autonomous audience analysis</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <Pill tone="purple">AI-generated</Pill>
                      {dossierStatusMessage && <Pill tone="amber">Fallback aware</Pill>}
                      {dossierLoadingId === selectedInsight.segment.id && <Pill tone="amber">Generating</Pill>}
                    </div>
                  </div>

                  {dossierStatusMessage && (
                    <div className="mt-4 rounded-xl border border-border bg-[var(--secondary)] p-4 text-sm text-muted-foreground">
                      {dossierStatusMessage}
                    </div>
                  )}

                  {dossierLoadingId === selectedInsight.segment.id && !selectedDossier ? (
                    <div className="mt-4 rounded-xl border border-border bg-[var(--secondary)] p-4 text-sm text-muted-foreground">
                      Lulu is generating a full audience dossier automatically from workspace, offering, live-record and search-intelligence context.
                    </div>
                  ) : selectedDossier ? (
                    <>
                      <p className="mt-4 text-sm text-muted-foreground">{selectedDossier.executiveSummary}</p>

                      <div className="mt-5 grid gap-4 xl:grid-cols-3">
                        <div className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-foreground">Verified facts</p>
                            <Pill tone="green">{selectedDossier.verifiedFacts.length}</Pill>
                          </div>
                          <div className="mt-3 space-y-2">
                            {selectedDossier.verifiedFacts.slice(0, 4).map((item) => (
                              <p key={item} className="text-sm text-muted-foreground">{item}</p>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-foreground">Inferred assumptions</p>
                            <Pill tone="amber">{selectedDossier.inferredAssumptions.length}</Pill>
                          </div>
                          <div className="mt-3 space-y-2">
                            {selectedDossier.inferredAssumptions.slice(0, 4).map((item) => (
                              <p key={item} className="text-sm text-muted-foreground">{item}</p>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-foreground">Data gaps</p>
                            <Pill tone="red">{selectedDossier.dataGaps.length}</Pill>
                          </div>
                          <div className="mt-3 space-y-2">
                            {selectedDossier.dataGaps.slice(0, 4).map((item) => (
                              <p key={item} className="text-sm text-muted-foreground">{item}</p>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 xl:grid-cols-2">
                        {selectedDossier.sections.map((section) => (
                          <article key={section.title} className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                            <p className="text-sm font-medium text-foreground">{section.title}</p>
                            <p className="mt-2 text-sm text-muted-foreground">{section.summary}</p>
                            <div className="mt-4 space-y-3">
                              {section.items.map((item) => (
                                <div key={`${section.title}-${item.label}`} className="rounded-lg border border-border bg-card p-3">
                                  <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                                    <Pill tone={item.status === "verified" ? "green" : item.status === "gap" ? "red" : "amber"}>
                                      {item.status === "verified" ? "Verified" : item.status === "gap" ? "Gap" : "Inferred"}
                                    </Pill>
                                  </div>
                                  <p className="mt-2 text-sm text-muted-foreground">{item.value}</p>
                                </div>
                              ))}
                            </div>
                          </article>
                        ))}
                      </div>

                      <div className="mt-5 grid gap-4 xl:grid-cols-4">
                        {[
                          { title: "Messaging angles", items: selectedDossier.messagingAngles, tone: "purple" as const },
                          { title: "Channel priorities", items: selectedDossier.channelPriorities, tone: "green" as const },
                          { title: "Likely objections", items: selectedDossier.objections, tone: "amber" as const },
                          { title: "Action plan", items: selectedDossier.actionPlan.map((item) => `${item.priority}: ${item.title} - ${item.detail}`), tone: "red" as const },
                        ].map((section) => (
                          <article key={section.title} className="rounded-xl border border-border bg-[var(--secondary)] p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-medium text-foreground">{section.title}</p>
                              <Pill tone={section.tone}>{section.items.length}</Pill>
                            </div>
                            <div className="mt-3 space-y-2">
                              {section.items.slice(0, 5).map((item) => (
                                <p key={item} className="text-sm text-muted-foreground">{item}</p>
                              ))}
                            </div>
                          </article>
                        ))}
                      </div>
                    </>
                  ) : null}
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
