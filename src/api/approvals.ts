import { requestApi } from './client';
import { workspaceApiPath } from './types';

export type GrowthApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';

export type GrowthApproval = {
  id: string;
  workspaceId: string;
  requestedBy: string | null;
  assignedTo: string | null;
  actionType: string;
  entityType: string | null;
  entityId: string | null;
  title: string;
  description: string | null;
  payload: Record<string, unknown>;
  status: GrowthApprovalStatus;
  decisionNote: string | null;
  decidedBy: string | null;
  decidedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export const growthApprovalApi = {
  list: (workspaceId: string, status: GrowthApprovalStatus | 'all' = 'pending') =>
    requestApi<GrowthApproval[]>({
      path: workspaceApiPath(workspaceId, `/growth-approvals?status=${encodeURIComponent(status)}`),
    }),
  decide: (workspaceId: string, approvalId: string, decision: 'approve' | 'reject', note?: string) =>
    requestApi<GrowthApproval>({
      path: workspaceApiPath(workspaceId, `/growth-approvals/${encodeURIComponent(approvalId)}/decision`),
      method: 'POST',
      body: { decision, ...(note?.trim() ? { note: note.trim() } : {}) },
    }),
};
