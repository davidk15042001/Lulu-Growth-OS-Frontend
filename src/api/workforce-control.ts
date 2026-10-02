import { requestApi } from "./client";
import { workspaceApiPath } from "./types";

export type WorkflowGraph = {
  workflow: {
    id: string; objective: string; workflowType: string; sourceType: string; status: string;
    currentStage: string; metadata: Record<string, unknown>; createdAt: string; updatedAt: string;
    completedAt: string | null; failedAt: string | null;
  };
  intents: Array<{ id: string; intentType: string; intentDomain: string; status: string; requestedOutcome: string; entities: Record<string, unknown>; createdAt: string }>;
  agentRuns: Array<{ id: string; status: string; goal: string; result: Record<string, unknown> | null; errorCode: string | null; createdAt: string; updatedAt: string }>;
  agentSteps: Array<{ id: string; status: string; verificationStatus: string; approvalId: string | null; result: Record<string, unknown> | null; errorCode: string | null; createdAt: string; finishedAt: string | null }>;
  missions: Array<{ id: string; title: string; status: string; objective: string; outcome: Record<string, unknown> | null; planKind: string; planRevision: number | null; plannerVersion: string | null; planningReason: string | null; createdAt: string; updatedAt: string }>;
  planRevisions: Array<{ id: string; missionId: string; revision: number; plannerVersion: string; plannerModel: string | null; status: string; objective: string; planningReason: string; successCriteria: Record<string, unknown>; taskSnapshot: unknown[]; dependencySnapshot: unknown[]; changes: Record<string, unknown>; playbookId: string | null; playbookVersion: number | null; createdAt: string }>;
  tasks: Array<{ id: string; title: string; status: string; objective: string; taskKey: string | null; domain: string | null; planRevision: number | null; waitState: string | null; failureCategory: string | null; replanRequired: boolean; result: Record<string, unknown> | null; errorCode: string | null; createdAt: string; updatedAt: string }>;
  actionPackets: Array<{ recordId: string; runId: string; stepId: string; approvalId: string | null; createdAt: string }>;
  approvals: Array<{ id: string; status: string; actionType: string; title: string; taskId: string | null; approvalScope: string; decidedAt: string | null; createdAt: string }>;
  toolInvocations: Array<{ id: string; toolId: string; toolVersion: string; operationType: string; status: string; approvalId: string | null; executionReceipt: Record<string, unknown> | null; verification: Record<string, unknown> | null; createdAt: string; updatedAt: string }>;
};

export type Playbook = {
  id: string; playbookKey: string; name: string; description: string; domain: string; playbookType: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "DEPRECATED" | "ARCHIVED"; version: number;
  autonomyMode: "RECOMMEND_ONLY" | "SHADOW" | "AUTONOMOUS_WITHIN_POLICY"; departmentKey: string | null;
  priority: number; createdAt: string; updatedAt: string;
  steps: Array<{ id: string; stepKey: string; position: number; title: string; objective: string; domain: string; preferredRole: string | null; requiredCapabilities: string[]; requiredTools: string[]; dependsOn: string[]; conditions: Record<string, unknown>; successCriteria: Record<string, unknown>; approvalExpectation: string; slaMinutes: number | null; optionality: string; responsibility: string; failureBehavior: string }>;
  approvalRules: Array<{ id: string; actionType: string; requiredRole: string; requiredApproverCount: number; scope: string; status: string }>;
};

export type AutonomyReadiness = {
  identityReliability: string; verificationCoverage: string; providerReadiness: string; policyConfiguration: string;
  approvalConfiguration: string; evaluationHistory: string; outcomeEvidence: string; reasons: string[];
};

export type AutonomyRollout = { id: string; scopeType: string; scopeKey: string; mode: "DISABLED" | "SHADOW" | "RECOMMEND_ONLY" | "AUTONOMOUS_WITHIN_POLICY"; status: string; version: number; gateConfig: Record<string, unknown>; updatedAt: string };
export type AutonomyIncident = { id: string; workflowId: string | null; goalId: string | null; toolId: string | null; incidentType: string; severity: string; status: string; evidence: Record<string, unknown>; responseAction: string | null; createdAt: string; resolvedAt: string | null };
export type BusinessGoal = { id: string; title: string; description: string; status: string; priority: number; metricName: string; targetValue: string; currentValue: string | null; baselineValue: string | null; autonomyMode: string; updatedAt: string };
export type DecisionRequest = { id: string; title: string; question: string; status: string; options: Array<{ id: string; label: string; description?: string }>; recommendedOption: string | null; evidence: Record<string, unknown>; createdAt: string };

const path = (workspaceId: string, suffix: string) => workspaceApiPath(workspaceId, suffix);

export const workforceControlApi = {
  workflow: (workspaceId: string, workflowId: string, signal?: AbortSignal) => requestApi<WorkflowGraph>({ path: path(workspaceId, `/workflows/${encodeURIComponent(workflowId)}`), signal }),
  playbooks: (workspaceId: string, status?: string, signal?: AbortSignal) => requestApi<{ items: Playbook[] }>({ path: path(workspaceId, `/playbooks${status ? `?status=${encodeURIComponent(status)}` : ""}`), signal }),
  playbook: (workspaceId: string, playbookId: string, signal?: AbortSignal) => requestApi<Playbook>({ path: path(workspaceId, `/playbooks/${encodeURIComponent(playbookId)}`), signal }),
  activatePlaybook: (workspaceId: string, playbookId: string) => requestApi<Playbook>({ path: path(workspaceId, `/playbooks/${encodeURIComponent(playbookId)}/activate`), method: "POST", body: {} }),
  pausePlaybook: (workspaceId: string, playbookId: string) => requestApi<Playbook>({ path: path(workspaceId, `/playbooks/${encodeURIComponent(playbookId)}/pause`), method: "POST", body: {} }),
  autonomyReadiness: (workspaceId: string, signal?: AbortSignal) => requestApi<AutonomyReadiness>({ path: path(workspaceId, "/autonomy/readiness"), signal }),
  autonomyRollouts: (workspaceId: string, signal?: AbortSignal) => requestApi<{ items: AutonomyRollout[] }>({ path: path(workspaceId, "/autonomy/rollouts"), signal }),
  setRollout: (workspaceId: string, input: { scopeType: "WORKSPACE" | "DOMAIN" | "GOAL" | "WORKFLOW_TYPE" | "TOOL_CATEGORY"; scopeKey: string; mode: AutonomyRollout["mode"]; gateConfig?: Record<string, unknown>; status?: "ACTIVE" | "PAUSED" }) => requestApi<AutonomyRollout>({ path: path(workspaceId, "/autonomy/rollout"), method: "PUT", body: input }),
  autonomyIncidents: (workspaceId: string, signal?: AbortSignal) => requestApi<{ items: AutonomyIncident[] }>({ path: path(workspaceId, "/autonomy/incidents?limit=50"), signal }),
  mitigateIncident: (workspaceId: string, incidentId: string, status: "MITIGATED" | "RESOLVED" | "DISMISSED") => requestApi<{ id: string; status: string }>({ path: path(workspaceId, `/autonomy/incidents/${encodeURIComponent(incidentId)}/mitigate`), method: "POST", body: { status, responseAction: "control_center_review" } }),
  portfolio: (workspaceId: string, signal?: AbortSignal) => requestApi<{ goals: Array<Record<string, unknown>>; conflicts: Array<Record<string, unknown>>; missions: Array<Record<string, unknown>> }>({ path: path(workspaceId, "/executive/strategy/portfolio"), signal }),
  decisionRequests: (workspaceId: string, signal?: AbortSignal) => requestApi<{ items: DecisionRequest[] }>({ path: path(workspaceId, "/executive/strategy/decision-requests"), signal }),
  resolveDecision: (workspaceId: string, requestId: string, optionId: string, rationale?: string) => requestApi<Record<string, unknown>>({ path: path(workspaceId, `/executive/strategy/decision-requests/${encodeURIComponent(requestId)}/resolve`), method: "POST", body: { optionId, rationale } }),
  goals: (workspaceId: string, signal?: AbortSignal) => requestApi<{ items: BusinessGoal[] }>({ path: path(workspaceId, "/goals?limit=50"), signal }),
};
