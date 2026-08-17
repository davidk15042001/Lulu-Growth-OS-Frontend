import { useCallback, useEffect, useState } from "react";
import { getFriendlyErrorMessage } from "./client";
import { listRecords, type WorkspaceRecord } from "./records";

export type LiveRecordsState = {
  items: WorkspaceRecord[];
  total: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useLiveRecords(resourceType: string | null, query = ""): LiveRecordsState {
  const [items, setItems] = useState<WorkspaceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(Boolean(resourceType));
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!resourceType) {
      setItems([]);
      setTotal(0);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await listRecords(resourceType, query);
      setItems(response.data.items);
      setTotal(response.data.pagination.total);
    } catch (cause) {
      setItems([]);
      setTotal(0);
      setError(getFriendlyErrorMessage(cause, "Live records could not be loaded. Please try again."));
    } finally {
      setLoading(false);
    }
  }, [resourceType, query]);

  useEffect(() => { void refresh(); }, [refresh]);
  return { items, total, loading, error, refresh };
}
