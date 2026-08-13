import { requestApi } from "./client";
import type { Pagination } from "./types";
import { workspaceApiPath } from "./types";

export type Metric = {
  id: string;
  workspaceId: string;
  key: string;
  name: string;
  domain: string;
  unit: string;
  format: string | null;
  source: string | null;
  configuration: Record<string, unknown>;
  latestValue: string | null;
  latestRecordedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MetricPoint = {
  id: string;
  recordedAt: string;
  value: string;
  dimensions: Record<string, unknown>;
  sourceRecordId: string | null;
};

export type MetricInput = {
  key: string;
  name: string;
  domain: string;
  unit?: string;
  format?: string | null;
  source?: string | null;
  configuration?: Record<string, unknown>;
};

export const metricApi = {
  list: (workspaceId: string) => requestApi<{ items: Metric[] }>({ path: workspaceApiPath(workspaceId, "/metrics") }),
  get: (workspaceId: string, metricId: string) => requestApi<Metric>({ path: workspaceApiPath(workspaceId, `/metrics/${metricId}`) }),
  create: (workspaceId: string, input: MetricInput) => requestApi<Metric>({
    path: workspaceApiPath(workspaceId, "/metrics"), method: "POST", body: input,
  }),
  update: (workspaceId: string, metricId: string, input: Partial<MetricInput>) => requestApi<Metric>({
    path: workspaceApiPath(workspaceId, `/metrics/${metricId}`), method: "PATCH", body: input,
  }),
  archive: (workspaceId: string, metricId: string) => requestApi<null>({
    path: workspaceApiPath(workspaceId, `/metrics/${metricId}`), method: "DELETE",
  }),
  points: (workspaceId: string, metricId: string, query = "limit=100&order=desc") => requestApi<{
    items: MetricPoint[]; pagination: Pagination;
  }>({ path: workspaceApiPath(workspaceId, `/metrics/${metricId}/points?${query}`) }),
  ingest: (workspaceId: string, metricId: string, points: Array<{
    recordedAt: string; value: number; dimensions?: Record<string, unknown>; sourceRecordId?: string | null;
  }>) => requestApi<{ inserted: number }>({
    path: workspaceApiPath(workspaceId, `/metrics/${metricId}/points`), method: "POST", body: { points },
  }),
};
