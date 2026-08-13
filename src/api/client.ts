export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRequest = {
  path: string;
  method?: ApiMethod;
  body?: unknown;
  signal?: AbortSignal;
};

export type ApiEnvelope<T> = {
  success: true;
  message?: string;
  data: T;
};

type ApiErrorEnvelope = {
  success: false;
  error?: { code?: string; message?: string; details?: unknown };
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_URL?.trim() || "/api/v1").replace(/\/$/, "");
const API_REQUEST_MESSAGE = "lulu:api-request";
const API_RESPONSE_MESSAGE = "lulu:api-response";
let accessToken: string | null = null;
let refreshPromise: Promise<boolean> | null = null;

function validatedPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    throw new ApiError(400, "INVALID_API_PATH", "Invalid API path");
  }
  return path;
}

function captureSession(path: string, payload: unknown) {
  if (path === "/auth/logout") {
    accessToken = null;
    return;
  }
  if (!payload || typeof payload !== "object") return;
  const data = (payload as { data?: unknown }).data;
  if (!data || typeof data !== "object") return;
  const token = (data as { token?: unknown }).token;
  if (typeof token === "string" && token) accessToken = token;
}

async function executeRequest<T>(request: ApiRequest, allowRefresh = true): Promise<ApiEnvelope<T>> {
  const path = validatedPath(request.path);
  const headers = new Headers({ accept: "application/json" });
  if (request.body !== undefined) headers.set("content-type", "application/json");
  if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: request.method ?? "GET",
      headers,
      credentials: "include",
      body: request.body === undefined ? undefined : JSON.stringify(request.body),
      signal: request.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(0, "NETWORK_ERROR", "The Lulu API is currently unreachable");
  }

  const payload = await response.json().catch(() => null) as ApiEnvelope<T> | ApiErrorEnvelope | null;
  if (response.status === 401 && allowRefresh && path !== "/auth/refresh") {
    const refreshed = await refreshSession();
    if (refreshed) return executeRequest<T>(request, false);
  }
  if (!response.ok || !payload || payload.success === false) {
    const error = payload && "error" in payload ? payload.error : undefined;
    throw new ApiError(
      response.status,
      error?.code ?? "API_ERROR",
      error?.message ?? `API request failed (${response.status})`,
      error?.details,
    );
  }
  captureSession(path, payload);
  return payload;
}

async function refreshSession() {
  refreshPromise ??= executeRequest<{ token: string }>(
    { path: "/auth/refresh", method: "POST", body: {} },
    false,
  ).then(() => true).catch(() => {
    accessToken = null;
    return false;
  }).finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

type BrokerRequest = {
  type: typeof API_REQUEST_MESSAGE;
  id: string;
  request: Omit<ApiRequest, "signal">;
};

type BrokerResponse = {
  type: typeof API_RESPONSE_MESSAGE;
  id: string;
  result?: unknown;
  error?: { status: number; code: string; message: string; details?: unknown };
};

function isBrokerRequest(value: unknown): value is BrokerRequest {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<BrokerRequest>;
  return message.type === API_REQUEST_MESSAGE
    && typeof message.id === "string"
    && !!message.request
    && typeof message.request.path === "string";
}

export function installApiBroker() {
  const listener = async (event: MessageEvent<unknown>) => {
    if (event.origin !== window.location.origin || !isBrokerRequest(event.data)) return;
    if (!(event.source instanceof Window)) return;
    const response: BrokerResponse = { type: API_RESPONSE_MESSAGE, id: event.data.id };
    try {
      response.result = await executeRequest(event.data.request);
    } catch (error) {
      const apiError = error instanceof ApiError
        ? error
        : new ApiError(0, "UNKNOWN_ERROR", error instanceof Error ? error.message : "Unknown API error");
      response.error = {
        status: apiError.status,
        code: apiError.code,
        message: apiError.message,
        ...(apiError.details === undefined ? {} : { details: apiError.details }),
      };
    }
    event.source.postMessage(response, event.origin);
  };
  window.addEventListener("message", listener);
  return () => window.removeEventListener("message", listener);
}

export function requestApi<T>(request: ApiRequest): Promise<ApiEnvelope<T>> {
  if (window.parent === window) return executeRequest<T>(request);

  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new ApiError(0, "API_TIMEOUT", "The Lulu API request timed out"));
    }, 30_000);
    const listener = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      const response = event.data as Partial<BrokerResponse> | null;
      if (!response || response.type !== API_RESPONSE_MESSAGE || response.id !== id) return;
      cleanup();
      if (response.error) {
        reject(new ApiError(response.error.status, response.error.code, response.error.message, response.error.details));
      } else {
        resolve(response.result as ApiEnvelope<T>);
      }
    };
    const onAbort = () => {
      cleanup();
      reject(new DOMException("The operation was aborted", "AbortError"));
    };
    const cleanup = () => {
      window.clearTimeout(timeout);
      window.removeEventListener("message", listener);
      request.signal?.removeEventListener("abort", onAbort);
    };
    window.addEventListener("message", listener);
    request.signal?.addEventListener("abort", onAbort, { once: true });
    const { signal: _signal, ...serializableRequest } = request;
    window.parent.postMessage({ type: API_REQUEST_MESSAGE, id, request: serializableRequest }, window.location.origin);
  });
}
