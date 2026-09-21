import { requestApi } from "./client";
import { workspaceApiPath } from "./types";

export type ExecutiveCycleType = "daily" | "weekly";
export type ExecutiveCycleStatus = "running" | "completed" | "failed" | "superseded";
export type ExecutiveProposalStatus = "draft" | "proposed" | "approved" | "rejected" | "dispatched" | "completed" | "cancelled";
export type ExecutiveProposalType = "strategy" | "marketing" | "campaign" | "crm" | "finance" | "product" | "operations" | "digital_employee";

export type ExecutiveOperatingCycle = {
  id: string;
  workspaceId: string;
  cycleType: ExecutiveCycleType;
  triggerType: "scheduled" | "manual" | "event";
  timezone: string;
  periodStart: string;
  periodEnd: string;
  dataCutoffAt: string;
  status: ExecutiveCycleStatus;
  summary: Record<string, unknown>;
  evidence: Record<string, unknown>;
  dataGaps: unknown[];
  failureCode: string | null;
  failureMessage: string | null;
  startedAt: string;
  completedAt: string | null;
  updatedAt: string;
};

export type ExecutiveFinding = {
  id: string;
  cycleId: string;
  findingType: string;
  subjectType: string;
  subjectId: string | null;
  severity: number;
  materiality: number;
  status: "open" | "acknowledged" | "resolved" | "dismissed";
  title: string;
  description: string;
  createdAt: string;
};

export type ExecutiveMetricForecast = {
  id: string;
  cycleId: string;
  metricId: string;
  metricKey: string;
  metricName: string;
  metricDomain: string;
  metricUnit: string;
  method: "two_point_trend";
  baselineValue: string;
  projectedLow: string;
  projectedBase: string;
  projectedHigh: string;
  baselineRecordedAt: string;
  forecastedFor: string;
  confidence: number;
  status: "active" | "calibrated" | "superseded" | "insufficient_data";
  actualValue: string | null;
  relativeError: string | null;
  calibratedAt: string | null;
};

export type ExecutiveScenario = {
  id: string;
  cycleId: string;
  name: string;
  description: string;
  status: "draft" | "ready" | "archived";
  createdAt: string;
  updatedAt: string;
};

export type ExecutiveScenarioProjection = {
  id: string;
  scenarioId: string;
  forecastId: string;
  metricId: string;
  metricKey: string;
  metricName: string;
  adjustmentPercent: string;
  projectedValue: string;
  createdAt: string;
};

export type ExecutiveScenarioDetail = ExecutiveScenario & {
  projections: ExecutiveScenarioProjection[];
};

export type ExecutiveProposal = {
  id: string;
  cycleId: string | null;
  findingId: string | null;
  proposalType: ExecutiveProposalType;
  title: string;
  objective: string;
  status: ExecutiveProposalStatus;
  priority: number;
  confidence: number;
  requiresHumanApproval: boolean;
  executionMode: "plan_only";
  companyBrainMissionId: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type ExecutiveLearningRecord = {
  id: string;
  cycleId: string | null;
  forecastId: string | null;
  proposalId: string | null;
  learningType: string;
  outcome: string;
  confidence: number;
  verified: boolean;
  createdAt: string;
};

export type ExecutiveProposalOutcome = {
  proposal: ExecutiveProposal;
  learning: ExecutiveLearningRecord | null;
  replayed: boolean;
};

export type ExecutiveOperatingSchedule = {
  id: string;
  cycleType: ExecutiveCycleType;
  timezone: string;
  hourOfDay: number;
  weekday: number;
  active: boolean;
  nextRunAt: string;
  lastRunAt: string | null;
};

export type ExecutiveOverview = {
  generatedAt: string;
  schedules: ExecutiveOperatingSchedule[];
  latestCycles: { daily: ExecutiveOperatingCycle | null; weekly: ExecutiveOperatingCycle | null };
  findings: ExecutiveFinding[];
  forecasts: ExecutiveMetricForecast[];
  proposals: ExecutiveProposal[];
  scenarios: ExecutiveScenario[];
  learning: ExecutiveLearningRecord[];
  summary: {
    visibleFindingCount: number;
    visibleProposalCount: number;
    forecastCount: number;
    scenarioCount: number;
    learningRecordCount: number;
  };
};

export type ExecutiveCycleDetail = {
  cycle: ExecutiveOperatingCycle;
  findings: ExecutiveFinding[];
  forecasts: ExecutiveMetricForecast[];
  proposals: ExecutiveProposal[];
};

export const executiveApi = {
  overview: (workspaceId: string, signal?: AbortSignal) => requestApi<ExecutiveOverview>({
    path: workspaceApiPath(workspaceId, "/executive/overview"),
    signal,
  }),
  runCycle: (workspaceId: string, cycleType: ExecutiveCycleType = "daily") => requestApi<ExecutiveCycleDetail>({
    path: workspaceApiPath(workspaceId, "/executive/cycles/run"),
    method: "POST",
    body: { cycleType },
  }),
  createScenario: (workspaceId: string, input: {
    cycleId: string;
    name: string;
    description: string;
    assumptions: unknown[];
    projections: Array<{ forecastId: string; adjustmentPercent: number }>;
  }) => requestApi<ExecutiveScenarioDetail>({
    path: workspaceApiPath(workspaceId, "/executive/scenarios"),
    method: "POST",
    body: input,
  }),
  decideProposal: (
    workspaceId: string,
    proposalId: string,
    input: { expectedVersion: number; decision: "approve" | "reject"; reason?: string | null },
  ) => requestApi<ExecutiveProposal>({
    path: workspaceApiPath(workspaceId, `/executive/proposals/${encodeURIComponent(proposalId)}/decision`),
    method: "POST",
    body: input,
  }),
  verifyProposalOutcome: (
    workspaceId: string,
    proposalId: string,
    input: { expectedVersion: number; outcome: string; evidence: Record<string, unknown>; confidence: number; idempotencyKey?: string | null },
  ) => requestApi<ExecutiveProposalOutcome>({
    path: workspaceApiPath(workspaceId, `/executive/proposals/${encodeURIComponent(proposalId)}/outcome`),
    method: "POST",
    body: input,
  }),
};
