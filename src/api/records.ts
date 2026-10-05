import { requestApi } from "./client";
import { getSelectedWorkspaceId } from "./session";

export type WorkspaceRecord = {
  id: string;
  workspaceId: string;
  resourceType: string;
  parentId: string | null;
  name: string;
  description: string | null;
  status: string;
  stage: string | null;
  valueAmount: string | null;
  currency: string | null;
  dueAt: string | null;
  assigneeId: string | null;
  tags: string[];
  data: Record<string, unknown>;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type RecordInput = Partial<Omit<WorkspaceRecord, "id" | "workspaceId" | "resourceType" | "version" | "createdAt" | "updatedAt" | "valueAmount">> & {
  name: string;
  valueAmount?: string | number | null;
};

export type ResourceTypeDefinition = { key: string; domain: string; label: string; description: string };

export type CompanyIntelligenceSnapshot = {
  id: string;
  companyRecordId: string;
  inputFingerprint: string;
  status: 'researching' | 'complete' | 'partial' | 'blocked_funds' | 'failed';
  completeness: number | null;
  confidence: 'low' | 'medium' | 'high' | null;
  missingFields: string[];
  sourceEvidence: Array<{ url?: string; title?: string; kind?: string }>;
  outputData: Record<string, unknown>;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: string;
};

export function listResourceTypes() {
  return requestApi<{ items: ResourceTypeDefinition[] }>({ path: "/resource-types" });
}

function workspacePath(path: string) {
  const workspaceId = getSelectedWorkspaceId();
  if (!workspaceId) throw new Error("No Lulu workspace is selected");
  return workspacePathFor(workspaceId, path);
}

function workspacePathFor(workspaceId: string, path: string) {
  const normalizedWorkspaceId = workspaceId.trim();
  if (!normalizedWorkspaceId) throw new Error("No Lulu workspace is selected");
  return `/workspaces/${encodeURIComponent(normalizedWorkspaceId)}${path}`;
}

export type RecordListOptions = { includeTotal?: boolean; signal?: AbortSignal };

export function listRecords(resourceType: string, query = "", options: RecordListOptions = {}) {
  const workspaceId = getSelectedWorkspaceId();
  if (!workspaceId) throw new Error("No Lulu workspace is selected");
  return listWorkspaceRecords(workspaceId, resourceType, query, options);
}

export function listWorkspaceRecords(workspaceId: string, resourceType: string, query = "", options: RecordListOptions = {}) {
  const params = new URLSearchParams(query);
  if (options.includeTotal !== undefined && !params.has("includeTotal")) {
    params.set("includeTotal", String(options.includeTotal));
  }
  const serializedQuery = params.toString();
  return requestApi<{ items: WorkspaceRecord[]; pagination: { page: number; limit: number; total: number | null; pages: number | null; hasMore: boolean } }>({
    path: workspacePathFor(workspaceId, `/records/${resourceType}${serializedQuery ? `?${serializedQuery}` : ""}`),
    signal: options.signal,
  });
}

export function createRecord(resourceType: string, input: RecordInput) {
  return requestApi<WorkspaceRecord>({
    path: workspacePath(`/records/${resourceType}`),
    method: "POST",
    body: input,
  });
}

export function ingestRecord(resourceType: string, form: FormData) {
  return requestApi<WorkspaceRecord>({
    path: workspacePath(`/records/${resourceType}/upload`),
    method: "POST",
    body: form,
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

export function getRecord(resourceType: string, recordId: string) {
  return requestApi<WorkspaceRecord>({ path: workspacePath(`/records/${resourceType}/${recordId}`) });
}

export function restoreRecord(resourceType: string, recordId: string) {
  return requestApi<WorkspaceRecord>({
    path: workspacePath(`/records/${resourceType}/${recordId}/restore`),
    method: "POST",
    body: {},
  });
}

export function requestRecordEnrichment(resourceType: string, recordId: string) {
  return requestApi<WorkspaceRecord>({
    path: workspacePath(`/records/${resourceType}/${recordId}/enrich`),
    method: "POST",
    body: {},
  });
}

export function listCompanyIntelligenceHistory(recordId: string, limit = 20) {
  return requestApi<CompanyIntelligenceSnapshot[]>({
    path: workspacePath(`/records/crm_companies/${encodeURIComponent(recordId)}/intelligence-history?limit=${Math.min(100, Math.max(1, Math.trunc(limit)))}`),
  });
}
