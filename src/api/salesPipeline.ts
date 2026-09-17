import { requestApi } from "./client";
import { getSelectedWorkspaceId } from "./session";

export type SalesPipelineState = {
  kind: "lead" | "opportunity" | "task";
  state: string;
  previousState: string | null;
  transitionedAt: string | null;
  transitionedBy: string | null;
  transitionReason: string | null;
  stateVersion: number;
};

export type SalesPipelineRecord<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  id: string;
  workspaceId: string;
  resourceType: string;
  version: number;
  pipeline: SalesPipelineState;
};

function workspacePath(path: string) {
  const workspaceId = getSelectedWorkspaceId();
  if (!workspaceId) throw new Error("No Lulu workspace is selected");
  return `/workspaces/${workspaceId}/sales-pipeline${path}`;
}

export function getSalesPipelineRecord(resourceType: string, recordId: string) {
  return requestApi<SalesPipelineRecord>({ path: workspacePath(`/${resourceType}/${recordId}`) });
}

export function transitionSalesRecord(
  resourceType: string,
  recordId: string,
  input: { targetState: string; expectedVersion?: number; reason?: string | null },
) {
  return requestApi<SalesPipelineRecord>({
    path: workspacePath(`/${resourceType}/${recordId}/transition`),
    method: "POST",
    body: input,
  });
}
