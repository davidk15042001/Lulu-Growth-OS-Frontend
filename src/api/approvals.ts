import { requestApi } from "./client";
import type { Pagination } from "./types";
import { workspaceApiPath } from "./types";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "cancelled" | "expired";
export type Approval = {
  id: string;
  workspaceId: string;
  requestedBy: string | null;
  assignedTo: string | null;
  actionType: string;
  entityType: string | null;
  entityId: string | null;
  title: string;
  description: string | null;
  impactAmount: string | null;
  impactCurrency: string | null;
  payload: Record<string, unknown>;
  status: ApprovalStatus;
  decisionNote: string | null;
  decidedBy: string | null;
  decidedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateApprovalInput = {
  actionType: string;
  title: string;
  entityType?: string | null;
  entityId?: string | null;
  description?: string | null;
  impactAmount?: number | null;
  impactCurrency?: string | null;
  payload?: Record<string, unknown>;
  assignedTo?: string | null;
  expiresAt?: string | null;
};

export const approvalApi = {
  list: (workspaceId: string, query = "limit=100") => requestApi<{ items: Approval[]; pagination: Pagination }>({
    path: workspaceApiPath(workspaceId, `/approvals?${query}`),
  }),
  create: (workspaceId: string, input: CreateApprovalInput) => requestApi<Approval>({
    path: workspaceApiPath(workspaceId, "/approvals"), method: "POST", body: input,
  }),
  decide: (workspaceId: string, approvalId: string, decision: "approved" | "rejected" | "cancelled", note?: string) => requestApi<Approval>({
    path: workspaceApiPath(workspaceId, `/approvals/${approvalId}/decision`),
    method: "POST",
    body: { decision, note: note || null },
  }),
};
