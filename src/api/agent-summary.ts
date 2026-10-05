import { requestApi } from './client';

export type AgentRegistrySummary = {
  minimumRequired: number;
  registeredAgents: number;
  pageSpecialists: number;
  systemAgents: number;
  byTier: {
    executive: number;
    domain_lead: number;
    specialist: number;
    auditor: number;
  };
  generatedAt: string;
};

export const agentSummaryApi = {
  get(signal?: AbortSignal) {
    return requestApi<AgentRegistrySummary>({ path: '/public/agent-summary', signal, timeoutMs: 10_000 });
  },
};
