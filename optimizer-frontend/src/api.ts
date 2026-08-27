import type { CreateSiteInput, OptionsResponse, SiteConnection, SiteDetailResponse, SiteListItem, SiteRun } from './types';

const API_BASE = (import.meta.env.VITE_API_URL?.trim() || 'http://localhost:4100/api').replace(/\/$/, '');
const API_TOKEN = import.meta.env.VITE_API_TOKEN?.trim() || 'local-dev-token-change-me';
const REQUEST_TIMEOUT_MS = 15_000;

type Envelope<T> = {
  success: true;
  data: T;
};

type ApiErrorEnvelope = {
  success?: false;
  error?: {
    message?: string;
    code?: string;
  };
};

type RequestOptions = RequestInit & {
  timeoutMs?: number;
};

export class ApiError extends Error {
  status: number;
  code: string | undefined;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestOptions) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), init?.timeoutMs ?? REQUEST_TIMEOUT_MS);
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Token': API_TOKEN,
      ...(init?.headers ?? {}),
    },
    ...init,
    signal: init?.signal ?? controller.signal,
  }).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    let parsedError: ApiErrorEnvelope | null = null;
    try {
      parsedError = (await response.json()) as ApiErrorEnvelope;
    } catch {
      parsedError = null;
    }
    throw new ApiError(
      parsedError?.error?.message || `Request failed: ${response.status}`,
      response.status,
      parsedError?.error?.code,
    );
  }

  return (await response.json()) as Envelope<T>;
}

export const api = {
  getOptions: async () => (await request<OptionsResponse>('/options')).data,
  listSites: async () => (await request<SiteListItem[]>('/sites')).data,
  getSite: async (siteId: string) => (await request<SiteDetailResponse>(`/sites/${siteId}`)).data,
  createSite: async (payload: CreateSiteInput) =>
    (await request<SiteConnection>('/sites', { method: 'POST', body: JSON.stringify(payload) })).data,
  runAnalysis: async (siteId: string) =>
    (await request<SiteRun>(`/sites/${siteId}/analyze`, { method: 'POST' })).data,
  runOptimization: async (siteId: string) =>
    (await request<SiteRun>(`/sites/${siteId}/optimize`, { method: 'POST' })).data,
  runFullCycle: async (siteId: string) =>
    (await request<SiteRun>(`/sites/${siteId}/full-cycle`, { method: 'POST' })).data,
};
