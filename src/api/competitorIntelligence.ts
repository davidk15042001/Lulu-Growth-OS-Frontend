import { requestApi } from "./client";
import { workspaceApiPath } from "./types";

export type CompetitorRow = {
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

export type BaselineCategory = {
  key: string;
  label: string;
  yourScore: number;
  competitorScore: number;
  source: string;
  yourEvidence: string;
  competitorEvidence: string;
  why: string;
  nextMove: string;
  gap: number;
  priority: "High" | "Medium" | "Low";
  fastestWin: boolean;
};

export type BattleAction = {
  title: string;
  detail: string;
  impact: "High" | "Medium" | "Low";
  speed: "Fast" | "Medium" | "Strategic";
  category: string;
  outcome: string;
};

export type SummaryCard = {
  label: string;
  value: string;
  detail: string;
  tone: "green" | "amber" | "red" | "purple";
  action: string;
};

export type KpiCard = {
  title: string;
  value: string;
  sub: string;
  icon: "Sparkles" | "AlertTriangle" | "Activity" | "Target" | "Users" | "TrendingUp";
};

export type SnapshotCard = {
  title: string;
  detail: string;
  footnote: string;
};

export type DataGap = {
  title: string;
  detail: string;
  resolved: boolean;
};

export type EvidenceItem = {
  title: string;
  source: string;
  category: "Observed" | "AI Inferred";
  confidence: "High" | "Medium" | "Low";
  updated: string;
  detail: string;
  why: string;
  link: string;
};

export type ChangeTrackingItem = {
  title: string;
  when: string;
  impact: "High" | "Medium" | "Low";
  detail: string;
};

export type WorkflowAction = {
  label: string;
  detail: string;
  cadence: string;
  output: string;
};

export type ComparisonMetric = {
  label: string;
  your: number;
  competitor: number;
  source: string;
};

export type CompetitorIntelligenceItem = {
  competitor: CompetitorRow;
  selectedCompetitorOverview: string;
  selectedCompetitorProducts: string[];
  executiveSummary: SummaryCard[];
  kpis: KpiCard[];
  competitorSnapshotCards: SnapshotCard[];
  baselineCategories: BaselineCategory[];
  comparisonMetrics: ComparisonMetric[];
  battlePlanActions: BattleAction[];
  evidenceItems: EvidenceItem[];
  changeTrackingItems: ChangeTrackingItem[];
  workflowActions: WorkflowAction[];
  ownBaselineScore: number;
  competitorBaselineScore: number;
  battleReadinessScore: number;
  currentConfidence: number;
  marketScore: number;
  visibilityScore: number;
  priorityScore: number;
  intelligenceScore: number;
};

export type CompetitorIntelligenceResponse = {
  ownCompanyName: string;
  ownBusinessLabel: string;
  ownCompanyOverview: string;
  companySnapshotCards: SnapshotCard[];
  dataGaps: DataGap[];
  hasLiveWebsite: boolean;
  websiteStats: {
    totalSites: number;
    publishedSites: number;
    verifiedDomains: number;
  };
  competitors: CompetitorIntelligenceItem[];
};

export const competitorIntelligenceApi = {
  get: (workspaceId: string) => requestApi<CompetitorIntelligenceResponse>({
    path: workspaceApiPath(workspaceId, "/competitor-intelligence"),
  }),
};
