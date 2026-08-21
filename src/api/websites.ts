import { requestApi } from './client';

export type WebsiteProvider = 'wordpress' | 'webflow' | 'managed';
export type WebsiteOwnershipMode = 'connected' | 'managed';
export type WebsiteSite = {
  id: string;
  workspaceId: string;
  provider: WebsiteProvider;
  ownershipMode: WebsiteOwnershipMode;
  name: string;
  externalSiteId: string | null;
  externalSiteUrl: string | null;
  status: string;
  settings: Record<string, unknown>;
  domains: WebsiteDomain[];
  createdAt: string;
  updatedAt: string;
};
export type WebsiteDomain = {
  id: string;
  siteId: string;
  hostname: string;
  verificationToken: string;
  verificationMethod: 'dns_txt' | 'dns_cname';
  status: string;
  verifiedAt: string | null;
  lastError: string | null;
};
export type WordPressContentItem = {
  ID?: number | string;
  id?: number | string;
  title?: string | { rendered?: string };
  slug?: string;
  status?: string;
  URL?: string;
  url?: string;
  link?: string;
  date?: string;
  modified?: string;
  author?: { name?: string };
  featured_image?: string;
  thumbnail?: string;
  mime_type?: string;
};
export type WordPressContent = {
  site: { id: string; name: string; url: string | null; status: string };
  pages: WordPressContentItem[];
  posts: WordPressContentItem[];
  media: WordPressContentItem[];
};
export type WebsiteProviderContent = {
  provider: WebsiteProvider;
  site: WebsiteSite;
  pages?: WordPressContentItem[];
  posts?: WordPressContentItem[];
  media?: WordPressContentItem[];
  sites?: unknown[] | { sites?: unknown[] };
  collections?: unknown[] | { collections?: unknown[] };
  customDomains?: unknown[] | { customDomains?: unknown[] };
};
export type WebsiteGenerationJob = {
  id: string;
  siteId: string;
  prompt: string;
  status: string;
  plan: Record<string, unknown>;
  preview: Record<string, unknown>;
  providerResult: Record<string, unknown>;
  errorCode: string | null;
  errorMessage: string | null;
};

export const websitesApi = {
  list: (workspaceId: string) => requestApi<{ items: WebsiteSite[] }>({ path: `/workspaces/${workspaceId}/websites` }),
  create: (workspaceId: string, body: { provider: WebsiteProvider; ownershipMode: WebsiteOwnershipMode; name: string; externalSiteId?: string; externalSiteUrl?: string }) => requestApi<WebsiteSite>({ path: `/workspaces/${workspaceId}/websites`, method: 'POST', body }),
  addDomain: (workspaceId: string, siteId: string, hostname: string) => requestApi<WebsiteDomain>({ path: `/workspaces/${workspaceId}/websites/${siteId}/domains`, method: 'POST', body: { hostname } }),
  verifyDomain: (workspaceId: string, siteId: string, domainId: string) => requestApi<WebsiteSite>({ path: `/workspaces/${workspaceId}/websites/${siteId}/domains/${domainId}/verify`, method: 'POST', body: {} }),
  createGenerationJob: (workspaceId: string, siteId: string, prompt: string) => requestApi<WebsiteGenerationJob>({ path: `/workspaces/${workspaceId}/websites/${siteId}/generation-jobs`, method: 'POST', body: { prompt } }),
  getGenerationJob: (workspaceId: string, siteId: string, jobId: string) => requestApi<WebsiteGenerationJob>({ path: `/workspaces/${workspaceId}/websites/${siteId}/generation-jobs/${jobId}` }),
  startAutomaticGeneration: (workspaceId: string, provider: 'wordpress' | 'webflow', language?: string) => requestApi<{ site: WebsiteSite; job: WebsiteGenerationJob; reused: boolean }>({ path: `/workspaces/${workspaceId}/websites/automatic-generation`, method: 'POST', body: { provider, ...(language ? { language } : {}) } }),
  cleanupProvider: (workspaceId: string, provider: 'wordpress' | 'webflow') => requestApi<void>({ path: `/workspaces/${workspaceId}/websites/cleanup-provider`, method: 'POST', body: { provider } }),
  wordpressContent: (workspaceId: string, siteId: string) => requestApi<WordPressContent>({ path: `/workspaces/${workspaceId}/websites/${siteId}/wordpress-content` }),
  providerContent: (workspaceId: string, siteId: string) => requestApi<WebsiteProviderContent>({ path: `/workspaces/${workspaceId}/websites/${siteId}/provider-content` }),
};
