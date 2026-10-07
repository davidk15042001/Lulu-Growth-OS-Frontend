import { requestApi } from './client';
import { getSelectedWorkspaceId } from './session';
import type { WorkspaceRecord } from './records';

export type FinanceAutomationStep = {
  type: string;
  config: Record<string, unknown>;
};

export type FinanceAutomationData = {
  version: number;
  enabled: boolean;
  trigger: FinanceAutomationStep;
  actions: FinanceAutomationStep[];
  execution?: {
    lastRunAt: string | null;
    lastStatus: string;
    runs: number;
    successfulRuns: number;
    failedRuns: number;
  };
};

export type FinanceAutomation = WorkspaceRecord & { data: FinanceAutomationData };

export type FinanceAutomationInput = {
  name: string;
  description?: string | null;
  trigger: FinanceAutomationStep;
  actions: FinanceAutomationStep[];
  enabled?: boolean;
};

function workspacePath(path: string) {
  const workspaceId = getSelectedWorkspaceId();
  if (!workspaceId) throw new Error('No Lulu workspace is selected');
  return `/workspaces/${encodeURIComponent(workspaceId)}${path}`;
}

export function listFinanceAutomations(query = '') {
  const normalized = query ? (query.startsWith('?') ? query : `?${query}`) : '';
  return requestApi<{ items: FinanceAutomation[]; pagination: { page: number; limit: number; total: number | null; pages: number | null; hasMore: boolean } }>({
    path: `${workspacePath('/finance/automations')}?tag=finance-automation${normalized ? `&${normalized.slice(1)}` : ''}`,
  });
}

export function createFinanceAutomation(input: FinanceAutomationInput) {
  return requestApi<FinanceAutomation>({ path: workspacePath('/finance/automations'), method: 'POST', body: input });
}

export function updateFinanceAutomation(automationId: string, input: Partial<FinanceAutomationInput> & { expectedVersion?: number }) {
  return requestApi<FinanceAutomation>({ path: workspacePath(`/finance/automations/${encodeURIComponent(automationId)}`), method: 'PATCH', body: input });
}

export function archiveFinanceAutomation(automationId: string) {
  return requestApi<null>({ path: workspacePath(`/finance/automations/${encodeURIComponent(automationId)}`), method: 'DELETE' });
}

export function validateFinanceAutomation(automationId: string) {
  return requestApi<{ automationId: string; status: 'validated'; executionBoundary: 'validation_only'; sideEffectsApplied: false; trigger: FinanceAutomationStep; actions: FinanceAutomationStep[]; evaluatedAt: string; message: string }>({
    path: workspacePath(`/finance/automations/${encodeURIComponent(automationId)}/validate`),
    method: 'POST',
    body: {},
  });
}
