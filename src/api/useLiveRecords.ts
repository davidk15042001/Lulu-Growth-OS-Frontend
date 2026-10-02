import { useCallback, useEffect, useRef, useState } from "react";
import { getFriendlyErrorMessage } from "./client";
import { listRecords, type WorkspaceRecord } from "./records";
import { getSelectedWorkspaceId } from "./session";

export type LiveRecordsLoadState = "loading" | "refreshing" | "ready" | "stale" | "error";

export type LiveRecordsState = {
  items: WorkspaceRecord[];
  total: number;
  loading: boolean;
  error: string | null;
  status: LiveRecordsLoadState;
  refresh: () => Promise<void>;
};

export function useLiveRecords(resourceType: string | null, query = "", options: { includeTotal?: boolean } = {}): LiveRecordsState {
  const [items, setItems] = useState<WorkspaceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(Boolean(resourceType));
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<LiveRecordsLoadState>("loading");
  const [dataKey, setDataKey] = useState<string | null>(null);
  const dataKeyRef = useRef<string | null>(null);
  const requestRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const workspaceId = getSelectedWorkspaceId();
  const requestKey = workspaceId && resourceType ? `${workspaceId}:${resourceType}:${query}` : null;
  const includeTotal = options.includeTotal ?? false;

  const refresh = useCallback(async () => {
    if (!resourceType || !requestKey) {
      setItems([]);
      setTotal(0);
      setLoading(false);
      setError(null);
      setDataKey(null);
      dataKeyRef.current = null;
      setStatus("ready");
      return;
    }
    const request = ++requestRef.current;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const hasVerifiedData = dataKeyRef.current === requestKey;
    setLoading(true);
    setStatus(hasVerifiedData ? "refreshing" : "loading");
    setError(null);
    try {
      const response = await listRecords(resourceType, query, { includeTotal, signal: controller.signal });
      if (request !== requestRef.current || getSelectedWorkspaceId() !== workspaceId) return;
      setItems(response.data.items);
      setTotal(response.data.pagination.total ?? response.data.items.length);
      dataKeyRef.current = requestKey;
      setDataKey(requestKey);
      setStatus("ready");
    } catch (cause) {
      if (controller.signal.aborted) return;
      if (request !== requestRef.current || getSelectedWorkspaceId() !== workspaceId) return;
      const message = getFriendlyErrorMessage(cause, "Live records could not be loaded. Please try again.");
      setStatus(hasVerifiedData ? "stale" : "error");
      setError(hasVerifiedData ? `Showing the last successfully loaded records. ${message}` : message);
    } finally {
      if (request === requestRef.current) setLoading(false);
    }
  }, [includeTotal, query, requestKey, resourceType, workspaceId]);

  useEffect(() => {
    void refresh();
    return () => {
      requestRef.current += 1;
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, [refresh]);
  const hasCurrentData = dataKey === requestKey;
  return { items: hasCurrentData ? items : [], total: hasCurrentData ? total : 0, loading: hasCurrentData ? loading : status !== "error", error, status: hasCurrentData ? status : status === "error" ? "error" : "loading", refresh };
}
