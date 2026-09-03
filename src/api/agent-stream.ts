import { API_BASE_URL, getAccessToken } from "./client";

export type WorkspaceLiveEvent = {
  id?: string;
  sequence?: string;
  workspaceId: string;
  type: "record.created" | "run.completed" | "run.failed" | "connected" | (string & {});
  version?: number;
  aggregateType?: string;
  aggregateId?: string | null;
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

type ParsedFrame = {
  id: string | null;
  data: string | null;
};

const streams = new Map<string, StreamHandle>();

function parseFrame(frame: string): ParsedFrame {
  let id: string | null = null;
  const data: string[] = [];
  for (const line of frame.split("\n")) {
    if (line.startsWith("id:")) id = line.slice(3).trim();
    if (line.startsWith("data:")) data.push(line.slice(5).trimStart());
  }
  return { id, data: data.length > 0 ? data.join("\n") : null };
}

function retryDelay(attempt: number) {
  const exponential = Math.min(30_000, 750 * (2 ** Math.min(attempt, 6)));
  return exponential + Math.floor(Math.random() * 500);
}

function waitForRetry(delayMs: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal.aborted) return resolve();
    const timer = window.setTimeout(resolve, delayMs);
    signal.addEventListener("abort", () => {
      window.clearTimeout(timer);
      resolve();
    }, { once: true });
  });
}

function createStream(workspaceId: string): StreamHandle {
  const listeners = new Set<(event: WorkspaceLiveEvent) => void>();
  const controller = new AbortController();
  const url = `${API_BASE_URL}/workspaces/${encodeURIComponent(workspaceId)}/events/stream`;
  let lastSequence = "0";

  void (async () => {
    let reconnectAttempt = 0;
    while (!controller.signal.aborted) {
      try {
        const token = getAccessToken();
        const response = await fetch(url, {
          headers: {
            accept: "text/event-stream",
            ...(lastSequence !== "0" ? { "last-event-id": lastSequence } : {}),
            ...(token ? { authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok || !response.body) throw new Error(`Event stream returned ${response.status}`);

        reconnectAttempt = 0;
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer = `${buffer}${decoder.decode(value, { stream: true })}`.replace(/\r\n/g, "\n");
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";
          for (const frame of frames) {
            const parsed = parseFrame(frame);
            if (!parsed.data) continue;
            try {
              const event = JSON.parse(parsed.data) as WorkspaceLiveEvent;
              const sequence = event.sequence ?? parsed.id;
              if (sequence && /^\d+$/.test(sequence)) lastSequence = sequence;
              listeners.forEach((listener) => {
                try { listener(event); } catch { /* One subscriber must not interrupt the shared stream. */ }
              });
            } catch {
              // Ignore malformed frames and keep the durable stream alive.
            }
          }
        }
        if (controller.signal.aborted) return;
        throw new Error("Event stream ended");
      } catch {
        if (controller.signal.aborted) return;
        await waitForRetry(retryDelay(reconnectAttempt), controller.signal);
        reconnectAttempt += 1;
      }
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
