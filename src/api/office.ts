import { requestApi } from './client';
import { workspaceApiPath } from './types';

export type OfficeEmployeeStatus =
  | 'IDLE' | 'MONITORING' | 'WORKING' | 'COLLABORATING' | 'WAITING'
  | 'WAITING_FOR_APPROVAL' | 'HUMAN_CONTROLLED' | 'ERROR' | 'OFFLINE';

export type OfficeWorkStatus =
  | 'queued' | 'running' | 'waiting' | 'paused' | 'waiting_for_approval'
  | 'human_controlled' | 'failed' | 'completed' | 'cancelled';

export type OfficeControl = 'pause' | 'resume' | 'retry' | 'cancel' | 'takeover';

export type OfficeWorkItem = {
  id: string;
  workspaceId: string;
  parentWorkItemId?: string | null;
  primaryEmployeeId?: string | null;
  sourceType: 'agent_run' | 'agent_action_packet' | 'workflow' | 'domain_event' | 'manual' | 'system';
  sourceId?: string | null;
  sourceAgentRunId?: string | null;
  sourceRecordId?: string | null;
  title: string;
  objective: string;
  description: string;
  status: OfficeWorkStatus;
  priority: number;
  attemptCount: number;
  maxAttempts: number;
  version: number;
  relatedObjectType: string | null;
  relatedObjectId: string | null;
  context: Record<string, unknown>;
  result: Record<string, unknown> | null;
  errorCode: string | null;
  errorMessage: string | null;
  blocked?: boolean;
  humanControllerId?: string | null;
  availableAt?: string;
  pausedAt?: string | null;
  sourceWorkerId?: string | null;
  hasChildren?: boolean;
  hasRunningChildren?: boolean;
  availableControls: OfficeControl[];
  dependencies?: Array<Record<string, unknown>>;
  assignments?: Array<Record<string, unknown>>;
  attempts?: Array<Record<string, unknown>>;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  finishedAt: string | null;
};

export type OfficeCurrentWorkItem = Pick<OfficeWorkItem,
  'id' | 'title' | 'objective' | 'status' | 'version' | 'sourceType'
> & {
  relatedObject: { type: string; id: string } | null;
};

export type OfficeEmployeeSummary = {
  id: string;
  key: string;
  name: string;
  title: string;
  description?: string;
  department?: { id: string; key: string; name: string };
  availability: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE';
  status: OfficeEmployeeStatus;
  currentWorkItem: OfficeCurrentWorkItem | null;
  workSummary: { active: number; completedToday: number; failed: number };
  sourceAgentIds: string[];
  sourceModules: string[];
  lastActivityAt: string | null;
};

export type OfficeTimelineItem = {
  id: string;
  source: 'work_item' | 'domain_event';
  type: string;
  title: string;
  workItemId: string | null;
  employeeId: string | null;
  employeeName: string | null;
  aggregateType: string | null;
  aggregateId: string | null;
  statusFrom: string | null;
  statusTo: string | null;
  payload: Record<string, unknown>;
  occurredAt: string;
};

export type OfficeOverview = {
  generatedAt: string;
  timelineScope: 'recent';
  summary: {
    departmentCount: number;
    employeeCount: number;
    activeEmployees: number;
    workingEmployees: number;
    waitingEmployees: number;
    attentionEmployees: number;
    activeWorkItems: number;
    completedToday: number;
    failedWorkItems: number;
  };
  departments: Array<{
    id: string;
    key: string;
    name: string;
    description: string;
    sortOrder: number;
    employees: OfficeEmployeeSummary[];
  }>;
  timeline: OfficeTimelineItem[];
  companyBrain?: {
    generatedAt: string;
    counts: { signals: number; openSignals: number; missions: number; activeMissions: number; tasks: number; decisions: number };
    signals: Array<{ id: string; signalType: string; severity: number; materiality: number; status: string; explanation: string; detectedAt: string }>;
    missions: Array<{ id: string; title: string; objective: string; status: string; priority: number; updatedAt: string }>;
    decisions: Array<{ id: string; decisionType: string; decision: string; confidence: number; createdAt: string }>;
    learning: Array<{ id: string; outcomeType: string; outcome: string; confidence: number; verified: boolean; createdAt: string }>;
  };
};

export type OfficeEmployeeDetails = {
  employee: OfficeEmployeeSummary;
  canControl: boolean;
  capabilities: Array<{ key: string; description: string; accessMode: 'OBSERVE' | 'EXECUTE' | 'MANAGE' }>;
  currentWorkItem: OfficeWorkItem | null;
  workSummary: OfficeEmployeeSummary['workSummary'];
  recentTimeline: OfficeTimelineItem[];
};

export const officeApi = {
  overview: (workspaceId: string, signal?: AbortSignal) => requestApi<OfficeOverview>({
    path: workspaceApiPath(workspaceId, '/office/overview?timelineLimit=36'), signal,
  }),
  employee: (workspaceId: string, employeeId: string, signal?: AbortSignal) => requestApi<OfficeEmployeeDetails>({
    path: workspaceApiPath(workspaceId, `/office/employees/${encodeURIComponent(employeeId)}`), signal,
  }),
  employeeWork: (workspaceId: string, employeeId: string, options: { status?: OfficeWorkStatus; limit?: number; offset?: number } = {}, signal?: AbortSignal) => {
    const search = new URLSearchParams();
    if (options.status) search.set('status', options.status);
    if (options.limit) search.set('limit', String(options.limit));
    if (options.offset) search.set('offset', String(options.offset));
    const query = search.toString();
    return requestApi<{ items: OfficeWorkItem[]; total: number; limit: number; offset: number; canControl: boolean }>({
      path: `${workspaceApiPath(workspaceId, `/office/employees/${encodeURIComponent(employeeId)}/work`)}${query ? `?${query}` : ''}`,
      signal,
    });
  },
  timeline: (workspaceId: string, options: { before?: string; employeeId?: string; limit?: number } = {}) => {
    const search = new URLSearchParams();
    if (options.before) search.set('before', options.before);
    if (options.employeeId) search.set('employeeId', options.employeeId);
    if (options.limit) search.set('limit', String(options.limit));
    const query = search.toString();
    return requestApi<{ items: OfficeTimelineItem[]; nextCursor: string | null }>({
      path: `${workspaceApiPath(workspaceId, '/office/timeline')}${query ? `?${query}` : ''}`,
    });
  },
  control: (workspaceId: string, workItemId: string, action: OfficeControl, input: { expectedVersion: number; idempotencyKey: string; reason?: string }) => requestApi<{ item: OfficeWorkItem; idempotent: boolean; command: { id: string; command: OfficeControl } }>({
    path: workspaceApiPath(workspaceId, `/office/work-items/${encodeURIComponent(workItemId)}/${action}`),
    method: 'POST',
    body: input,
  }),
};
