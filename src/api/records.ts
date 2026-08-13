import { requestApi } from "./client";
import { getSelectedWorkspaceId } from "./session";

export type WorkspaceRecord = {
  id: string;
  workspaceId: string;
  resourceType: string;
  name: string;
  description: string | null;
  status: string;
  stage: string | null;
  valueAmount: string | null;
  currency: string | null;
  dueAt: string | null;
  tags: string[];
  data: Record<string, unknown>;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type RecordInput = Partial<Omit<WorkspaceRecord, "id" | "workspaceId" | "resourceType" | "version" | "createdAt" | "updatedAt">> & {
  name: string;
};

function workspacePath(path: string) {
  const workspaceId = getSelectedWorkspaceId();
  if (!workspaceId) throw new Error("No Lulu workspace is selected");
  return `/workspaces/${workspaceId}${path}`;
}

export function listRecords(resourceType: string, query = "") {
  return requestApi<{ items: WorkspaceRecord[]; pagination: { page: number; limit: number; total: number; pages: number } }>({
    path: workspacePath(`/records/${resourceType}${query ? `?${query}` : ""}`),
  });
}

export function createRecord(resourceType: string, input: RecordInput) {
  return requestApi<WorkspaceRecord>({
    path: workspacePath(`/records/${resourceType}`),
    method: "POST",
    body: input,
  });
}

export function updateRecord(resourceType: string, recordId: string, input: Partial<RecordInput> & { expectedVersion?: number }) {
  return requestApi<WorkspaceRecord>({
    path: workspacePath(`/records/${resourceType}/${recordId}`),
    method: "PATCH",
    body: input,
  });
}

export function archiveRecord(resourceType: string, recordId: string) {
  return requestApi<null>({
    path: workspacePath(`/records/${resourceType}/${recordId}`),
    method: "DELETE",
  });
}
