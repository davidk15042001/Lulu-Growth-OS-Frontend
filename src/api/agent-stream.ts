import { API_BASE_URL, getAccessToken } from "./client";

export type WorkspaceLiveEvent = {
  workspaceId: string;
  type: "record.created" | "run.completed" | "run.failed" | "connected";
  resourceType?: string | null;
  recordId?: string | null;
  runId?: string | null;
  pageId?: string | null;
  payload?: Record<string, unknown>;
  occurredAt: string;
};

type StreamHandle = {
  listeners: Set<(event: WorkspaceLiveEvent) => void>;
  close: () => void;
};

const streams = new Map<string, StreamHandle>();

function createStream(workspaceId: string): StreamHandle {
  const listeners = new Set<(event: WorkspaceLiveEvent) => void>();
  const controller = new AbortController();
  const token = getAccessToken();
  const url = `${API_BASE_URL}/workspaces/${encodeURIComponent(workspaceId)}/agent-runs/stream`;

  void (async () => {
    try {
      const response = await fetch(url, {
        headers: {
          accept: "text/event-stream",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        signal: controller.signal,
      });
      if (!response.ok || !response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";
        for (const chunk of chunks) {
          const dataLine = chunk.split("\n").find((line) => line.startsWith("data: "));
          if (!dataLine) continue;
          try {
            const event = JSON.parse(dataLine.slice("data: ".length)) as WorkspaceLiveEvent;
            listeners.forEach((listener) => listener(event));
          } catch {
            // Ignore malformed frames.
          }
        }
      }
    } catch {
      // Aborted or network failure — callers can re-subscribe.
    }
  })();

  return { listeners, close: () => controller.abort() };
}

export function subscribeWorkspaceEvents(
  workspaceId: string,
  onEvent: (event: WorkspaceLiveEvent) => void,
): () => void {
  let handle = streams.get(workspaceId);
  if (!handle) {
    handle = createStream(workspaceId);
    streams.set(workspaceId, handle);
  }
  handle.listeners.add(onEvent);
  return () => {
    handle?.listeners.delete(onEvent);
    if (handle && handle.listeners.size === 0) {
      handle.close();
      streams.delete(workspaceId);
    }
  };
}
