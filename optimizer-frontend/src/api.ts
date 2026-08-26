import type { OptionsResponse, SiteDetailResponse, SiteListItem, SiteRun } from './types';

const API_BASE = (import.meta.env.VITE_API_URL?.trim() || 'http://localhost:4100/api').replace(/\/$/, '');

type Envelope<T> = {
  success: true;
  data: T;
};

async function request<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed: ${response.status}`);
  }

  return (await response.json()) as Envelope<T>;
}

export const api = {
  getOptions: async () => (await request<OptionsResponse>('/options')).data,
  listSites: async () => (await request<SiteListItem[]>('/sites')).data,
  getSite: async (siteId: string) => (await request<SiteDetailResponse>(`/sites/${siteId}`)).data,
  createSite: async (payload: object) =>
    (await request('/sites', { method: 'POST', body: JSON.stringify(payload) })).data,
  runAnalysis: async (siteId: string) =>
    (await request<SiteRun>(`/sites/${siteId}/analyze`, { method: 'POST' })).data,
  runOptimization: async (siteId: string) =>
    (await request<SiteRun>(`/sites/${siteId}/optimize`, { method: 'POST' })).data,
  runFullCycle: async (siteId: string) =>
    (await request<SiteRun>(`/sites/${siteId}/full-cycle`, { method: 'POST' })).data,
};
