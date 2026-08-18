import { requestApi } from './client';
import { workspaceApiPath } from './types';

export type AgentRunStatus = 'queued' | 'planning' | 'running' | 'waiting_approval' | 'completed' | 'failed' | 'cancelled';
export type AgentStep = { id: string; runId: string; sequenceNo: number; agentRole: string; title: string; instruction: string; status: string; toolName: string | null; approvalId: string | null; result: Record<string, unknown> | null; errorCode: string | null; errorMessage: string | null; };
export type AgentRun = { id: string; workspaceId: string; goal: string; status: AgentRunStatus; plan: Record<string, unknown>; result: Record<string, unknown> | null; errorCode: string | null; errorMessage: string | null; createdAt: string; updatedAt: string; };
export type AgentRunDetails = { run: AgentRun; steps: AgentStep[]; events: Array<{ id: string; eventType: string; agentRole: string | null; payload: Record<string, unknown>; createdAt: string }> };

export const agentApi = {
  list: (workspaceId: string) => requestApi<{ items: AgentRun[] }>({ path: workspaceApiPath(workspaceId, '/agent-runs') }),
  create: (workspaceId: string, goal: string) => requestApi<AgentRun>({ path: workspaceApiPath(workspaceId, '/agent-runs'), method: 'POST', body: { goal } }),
  detail: (workspaceId: string, runId: string) => requestApi<AgentRunDetails>({ path: workspaceApiPath(workspaceId, `/agent-runs/${runId}`) }),
  cancel: (workspaceId: string, runId: string) => requestApi<AgentRun>({ path: workspaceApiPath(workspaceId, `/agent-runs/${runId}/cancel`), method: 'POST', body: {} }),
  approve: (workspaceId: string, runId: string, stepId: string) => requestApi<AgentRunDetails>({ path: workspaceApiPath(workspaceId, `/agent-runs/${runId}/steps/${stepId}/approve`), method: 'POST', body: {} }),
};
