import { requestApi } from "./client";
import type { Workspace, WorkspaceBootstrap } from "./types";
import { workspaceApiPath } from "./types";

export type CreateWorkspaceInput = {
  companyName: string;
  slug?: string;
  industry?: string | null;
  companySize?: string | null;
  countryRegion?: string | null;
};

export type UpdateWorkspaceInput = Partial<CreateWorkspaceInput> & {
  businessDescription?: string | null;
  valueProposition?: string | null;
  targetMarket?: string | null;
  shortBrandDescription?: string | null;
  positioningTags?: string[];
};

export const workspaceApi = {
  list: (signal?: AbortSignal) => requestApi<{ items: Workspace[] }>({ path: "/workspaces", signal }),
  create: (input: CreateWorkspaceInput) => requestApi<Workspace>({ path: "/workspaces", method: "POST", body: input }),
  get: (workspaceId: string) => requestApi<Workspace>({ path: workspaceApiPath(workspaceId) }),
  update: (workspaceId: string, input: UpdateWorkspaceInput) => requestApi<Workspace>({
    path: workspaceApiPath(workspaceId), method: "PATCH", body: input,
  }),
  acceptInvitation: (token: string) => requestApi<{ workspaceId: string }>({
    path: `/workspaces/invitations/${encodeURIComponent(token)}/accept`, method: "POST", body: {},
  }),
  bootstrap: (workspaceId: string, signal?: AbortSignal) => requestApi<WorkspaceBootstrap>({
    path: workspaceApiPath(workspaceId, "/bootstrap"), signal,
  }),
};
