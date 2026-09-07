import { API_BASE_URL, getAccessToken } from './client';

export type OmniStreamEvent = {
  id?: string;
  sequence?: string;
  workspaceId?: string | null;
  type?: string;
  payload?: Record<string, unknown>;
  occurredAt?: string;
};
export type OmniStreamStatus = 'connecting' | 'connected' | 'reconnecting';

function delay(attempt: number) {
  return Math.min(30_000, 750 * (2 ** Math.min(attempt, 6))) + Math.floor(Math.random() * 500);
}

export function subscribeAdminOmniEvents(onEvent: (event: OmniStreamEvent) => void, onStatus?: (status: OmniStreamStatus) => void) {
  const controller = new AbortController();
  let lastSequence = '0';
  let attempt = 0;
  const wait = (ms: number) => new Promise<void>((resolve) => {
    const timer = window.setTimeout(resolve, ms);
    controller.signal.addEventListener('abort', () => { window.clearTimeout(timer); resolve(); }, { once: true });
  });
  const parse = (frame: string) => {
    const data = frame.split('\n').filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trimStart()).join('\n');
    const id = frame.split('\n').find((line) => line.startsWith('id:'))?.slice(3).trim();
    if (id && /^\d+$/.test(id)) lastSequence = id;
    if (!data) return;
    try { onEvent(JSON.parse(data) as OmniStreamEvent); } catch { /* Ignore malformed frames. */ }
  };
  void (async () => {
    while (!controller.signal.aborted) {
      onStatus?.(attempt === 0 ? 'connecting' : 'reconnecting');
      try {
        const token = getAccessToken();
        const response = await fetch(`${API_BASE_URL}/admin/omnichannel/events/stream`, {
          headers: { accept: 'text/event-stream', ...(token ? { authorization: `Bearer ${token}` } : {}), ...(lastSequence !== '0' ? { 'last-event-id': lastSequence } : {}) },
          credentials: 'include',
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!response.ok || !response.body) throw new Error(`Admin OmniChannel stream returned ${response.status}`);
        attempt = 0;
        onStatus?.('connected');
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer = `${buffer}${decoder.decode(value, { stream: true })}`.replace(/\r\n/g, '\n');
          const frames = buffer.split('\n\n');
          buffer = frames.pop() ?? '';
          frames.forEach(parse);
        }
        if (controller.signal.aborted) break;
        throw new Error('Admin OmniChannel stream ended');
      } catch {
        if (controller.signal.aborted) break;
        onStatus?.('reconnecting');
        await wait(delay(attempt));
        attempt += 1;
      }
    }
  })();
  return () => controller.abort();
}
