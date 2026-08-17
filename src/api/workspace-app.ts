import { requestApi } from "./client";
import type { Pagination, WorkspaceInvitation, WorkspaceMember } from "./types";
import { workspaceApiPath } from "./types";

export type SavedView = {
  id: string;
  workspaceId: string;
  userId: string;
  resourceType: string;
  name: string;
  filters: Record<string, unknown>;
  sorting: Record<string, unknown>;
  isDefault: boolean;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuditEntry = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  actorId: string | null;
  actorEmail: string | null;
  requestId: string | null;
  beforeData: Record<string, unknown> | null;
  afterData: Record<string, unknown> | null;
  createdAt: string;
};

export type BillingState = {
  subscription: null | {
    workspaceId: string;
    provider: string;
    planKey: string;
    status: string;
    seats: number;
    trialEndsAt: string | null;
    currentPeriodStartsAt: string | null;
    currentPeriodEndsAt: string | null;
    cancelAtPeriodEnd: boolean;
    metadata: Record<string, unknown>;
  };
  usage: Array<{
    metricKey: string;
    periodStart: string;
    periodEnd: string;
    quantity: string;
    metadata: Record<string, unknown>;
    updatedAt: string;
  }>;
};

export const workspaceAppApi = {
  members: (workspaceId: string) => requestApi<{ members: WorkspaceMember[]; invitations: WorkspaceInvitation[] }>({
    path: workspaceApiPath(workspaceId, "/members"),
  }),
  invite: (workspaceId: string, email: string, role: "admin" | "member" | "viewer") => requestApi<WorkspaceInvitation>({
    path: workspaceApiPath(workspaceId, "/members"), method: "POST", body: { email, role },
  }),
  updateMember: (workspaceId: string, memberId: string, role: "admin" | "member" | "viewer") => requestApi<WorkspaceMember>({
    path: workspaceApiPath(workspaceId, `/members/${memberId}`), method: "PATCH", body: { role },
  }),
  removeMember: (workspaceId: string, memberId: string) => requestApi<null>({
    path: workspaceApiPath(workspaceId, `/members/${memberId}`), method: "DELETE",
  }),
  savedViews: (workspaceId: string, resourceType?: string) => requestApi<{ items: SavedView[] }>({
    path: workspaceApiPath(workspaceId, `/saved-views${resourceType ? `?resourceType=${encodeURIComponent(resourceType)}` : ""}`),
  }),
  createSavedView: (workspaceId: string, input: {
    resourceType: string; name: string; filters?: Record<string, unknown>; sorting?: Record<string, unknown>; isDefault?: boolean; isShared?: boolean;
  }) => requestApi<SavedView>({ path: workspaceApiPath(workspaceId, "/saved-views"), method: "POST", body: input }),
  updateSavedView: (workspaceId: string, viewId: string, input: Partial<Pick<SavedView, "name" | "filters" | "sorting" | "isDefault" | "isShared">>) => requestApi<SavedView>({
    path: workspaceApiPath(workspaceId, `/saved-views/${viewId}`), method: "PATCH", body: input,
  }),
  deleteSavedView: (workspaceId: string, viewId: string) => requestApi<null>({
    path: workspaceApiPath(workspaceId, `/saved-views/${viewId}`), method: "DELETE",
  }),
  audit: (workspaceId: string, query = "limit=100") => requestApi<{ items: AuditEntry[]; pagination: Pagination }>({
    path: workspaceApiPath(workspaceId, `/audit?${query}`),
  }),
  billing: (workspaceId: string, query = "") => requestApi<BillingState>({
    path: workspaceApiPath(workspaceId, `/billing${query ? `?${query}` : ""}`),
  }),
  syncBillingCheckout: (workspaceId: string, checkoutId: string) => requestApi<{
    checkoutId: string;
    planKey: string;
    status: "pending" | "active";
    providerStatus: string;
    subscriptionId?: string | null;
    invoiceId?: string | null;
  }>({
    path: workspaceApiPath(workspaceId, `/billing/checkouts/${encodeURIComponent(checkoutId)}/sync`),
    method: "POST",
    body: {},
  }),
  syncIntegration: (workspaceId: string, platformId: string) => requestApi<{
    id: string; platformId: string; jobId: string; status: string; createdAt: string;
  }>({ path: workspaceApiPath(workspaceId, `/integrations/${platformId}/sync`), method: "POST", body: {} }),
};
