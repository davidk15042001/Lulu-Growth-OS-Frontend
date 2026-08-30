import { requestApi } from './client';
import { workspaceApiPath } from './types';
import type { LuluAgentContract } from '../config/lulu-agent-registry';

export type AgentRunStatus = 'queued' | 'planning' | 'running' | 'waiting_approval' | 'completed' | 'failed' | 'cancelled';
export type AgentStep = { id: string; runId: string; sequenceNo: number; agentRole: string; title: string; instruction: string; status: string; toolName: string | null; approvalId: string | null; result: Record<string, unknown> | null; errorCode: string | null; errorMessage: string | null; };
export type AgentRun = { id: string; workspaceId: string; goal: string; status: AgentRunStatus; plan: Record<string, unknown>; result: Record<string, unknown> | null; errorCode: string | null; errorMessage: string | null; createdAt: string; updatedAt: string; };
export type AgentRunDetails = { run: AgentRun; steps: AgentStep[]; events: Array<{ id: string; eventType: string; agentRole: string | null; payload: Record<string, unknown>; createdAt: string }> };
export type IntelligenceMetric = {
  metricKey: string;
  value: unknown;
  unit: string | null;
  period: string | null;
  source: string | null;
  sourceStatus: 'verified' | 'derived' | 'forecast' | 'unavailable' | 'not_applicable';
  confidence: 'high' | 'medium' | 'low' | null;
  limitations: string[];
  measuredAt: string | null;
  updatedAt: string;
};
export type KnowledgeSection = { sectionKey: string; status: 'completed' | 'partial' | 'unavailable' | 'failed'; content: Record<string, unknown>; updatedAt: string };
export type IntelligenceBundle = {
  snapshot: {
    id: string;
    sourceRunId: string;
    status: 'completed' | 'failed' | 'running' | 'queued' | 'superseded';
    confidence: 'high' | 'medium' | 'low' | null;
    executiveSummary: string | null;
    dataGaps: string[];
    verifiedFacts: string[];
    priorities: string[];
    knowledgeBase: Record<string, unknown>;
    generatedAt: string | null;
    updatedAt: string;
  } | null;
  sections: KnowledgeSection[];
  metrics: IntelligenceMetric[];
};

export type AgentModule = 'general' | 'seo' | 'geo' | 'aeo' | 'website';

export type AgentPageContext = {
  pageId: string;
  pageLabel: string;
  sectionLabel: string;
  agentName: string | null;
  objective: string | null;
  autonomy: string | null;
  jobs: string[];
  integrations: string[];
  successMetrics: string[];
  approvalGates: string[];
};

type AgentQuery = {
  pageId?: string;
};

type CreateAgentRunOptions = {
  module?: AgentModule;
  page?: AgentPageContext;
  dedupeMinutes?: number;
};

function intelligencePath(workspaceId: string) {
  return workspaceApiPath(workspaceId, '/agent-runs/knowledge');
}

function withAgentQuery(path: string, query?: AgentQuery) {
  const search = new URLSearchParams();
  if (query?.pageId) search.set('pageId', query.pageId);
  const serialized = search.toString();
  return serialized ? `${path}?${serialized}` : path;
}

export function agentPageContextFromContract(contract: LuluAgentContract): AgentPageContext {
  return {
    pageId: contract.pageId,
    pageLabel: contract.pageLabel,
    sectionLabel: contract.sectionLabel,
    agentName: contract.agentName,
    objective: contract.objective,
    autonomy: contract.autonomy,
    jobs: [...contract.jobs],
    integrations: [...contract.integrations],
    successMetrics: [...contract.successMetrics],
    approvalGates: [...contract.approvalPolicy.gates],
  };
}

export function agentModuleForContract(contract: LuluAgentContract): AgentModule {
  const pageId = contract.pageId.toLowerCase();
  const pageLabel = contract.pageLabel.toLowerCase();
  const sectionLabel = contract.sectionLabel.toLowerCase();
  if (pageId === 'sparklingly-moon-5114' || pageLabel === 'seo') return 'seo';
  if (pageId === 'zealously-path-4224' || pageLabel === 'geo') return 'geo';
  if (pageId === 'sunny-house-9595' || pageLabel === 'aeo') return 'aeo';
  if (
    sectionLabel === 'website & commerce'
    || sectionLabel === 'google business'
    || sectionLabel === 'email'
    || sectionLabel === 'calendar'
    || pageId.startsWith('website-')
    || pageId.startsWith('email-')
    || pageId.startsWith('calendar-')
    || pageId === 'lulu-website-portal-9012'
  ) {
    return 'website';
  }
  return 'general';
}

export function autoAgentGoalForContract(contract: LuluAgentContract) {
  return `[page-agent:${contract.pageId}] ${contract.agentName}: ${contract.objective}`;
}

export const agentApi = {
  list: (workspaceId: string, query?: AgentQuery) => requestApi<{ items: AgentRun[] }>({ path: withAgentQuery(workspaceApiPath(workspaceId, '/agent-runs'), query) }),
  knowledge: (workspaceId: string, query?: AgentQuery) => requestApi<IntelligenceBundle>({ path: withAgentQuery(intelligencePath(workspaceId), query) }),
  create: (workspaceId: string, goal: string, options?: CreateAgentRunOptions) => requestApi<AgentRun>({ path: workspaceApiPath(workspaceId, '/agent-runs'), method: 'POST', body: { goal, module: options?.module, page: options?.page, dedupeMinutes: options?.dedupeMinutes } }),
  detail: (workspaceId: string, runId: string) => requestApi<AgentRunDetails>({ path: workspaceApiPath(workspaceId, `/agent-runs/${runId}`) }),
  cancel: (workspaceId: string, runId: string) => requestApi<AgentRun>({ path: workspaceApiPath(workspaceId, `/agent-runs/${runId}/cancel`), method: 'POST', body: {} }),
  approve: (workspaceId: string, runId: string, stepId: string, decision: 'approved' | 'rejected' | 'cancelled' = 'approved') => requestApi<AgentRunDetails>({ path: workspaceApiPath(workspaceId, `/agent-runs/${runId}/steps/${stepId}/approve`), method: 'POST', body: { decision } }),
};
