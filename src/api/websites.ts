import { requestApi, requestApiBlob } from './client';

export type WebsiteProvider = 'managed';
export type WebsiteOwnershipMode = 'managed';
export type WebsiteGenerationTargetMode = 'existing' | 'new';
export type WebsiteTemplateChoice = 'auto' | 'standard' | 'one-product';
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
  recordName: string;
  expiresAt: string;
  verificationMethod: 'dns_txt' | 'dns_cname';
  cnameTarget: string | null;
  status: string;
  verifiedAt: string | null;
  lastError: string | null;
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
  requestedLanguage?: string | null;
  autoPublish?: boolean;
  attemptCount?: number;
  heartbeatAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ManagedWebsiteAsset = {
  id: string;
  siteId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  altText: string;
  placement: 'website' | 'hero' | 'product' | 'logo' | 'gallery';
  crop: Record<string, unknown>;
  publicUrl: string;
  createdAt: string;
};
export type WebsiteAssetEdit = {
  id: string;
  workspaceId: string;
  siteId: string;
  sourceAssetId: string;
  resultAssetId: string | null;
  prompt: string;
  model: string;
  status: "QUEUED" | "SUBMITTING" | "SUBMITTED" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  providerTaskId: string | null;
  creditsConsumed: number | null;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export const websitesApi = {
  list: (workspaceId: string) => requestApi<{ items: WebsiteSite[] }>({ path: `/workspaces/${workspaceId}/websites` }),
  create: (workspaceId: string, body: { provider: WebsiteProvider; ownershipMode: WebsiteOwnershipMode; name: string; externalSiteId?: string; externalSiteUrl?: string }) => requestApi<WebsiteSite>({ path: `/workspaces/${workspaceId}/websites`, method: 'POST', body }),
  addDomain: (workspaceId: string, siteId: string, hostname: string) => requestApi<WebsiteDomain>({ path: `/workspaces/${workspaceId}/websites/${siteId}/domains`, method: 'POST', body: { hostname } }),
  verifyDomain: (workspaceId: string, siteId: string, domainId: string) => requestApi<WebsiteSite>({ path: `/workspaces/${workspaceId}/websites/${siteId}/domains/${domainId}/verify`, method: 'POST', body: {} }),
  renewDomain: (workspaceId: string, siteId: string, domainId: string) => requestApi<WebsiteSite>({ path: `/workspaces/${workspaceId}/websites/${siteId}/domains/${domainId}/renew`, method: 'POST', body: {} }),
  createGenerationJob: (workspaceId: string, siteId: string, prompt: string, template: WebsiteTemplateChoice = 'auto') => requestApi<WebsiteGenerationJob>({ path: `/workspaces/${workspaceId}/websites/${siteId}/generation-jobs`, method: 'POST', body: { prompt, template }, timeoutMs: 180_000 }),
  getActiveGenerationJob: (workspaceId: string, siteId: string) => requestApi<WebsiteGenerationJob | null>({ path: `/workspaces/${workspaceId}/websites/${siteId}/generation-jobs/active` }),
  getGenerationJob: (workspaceId: string, siteId: string, jobId: string) => requestApi<WebsiteGenerationJob>({ path: `/workspaces/${workspaceId}/websites/${siteId}/generation-jobs/${jobId}` }),
  cancelGenerationJob: (workspaceId: string, siteId: string, jobId: string) => requestApi<WebsiteGenerationJob>({ path: `/workspaces/${workspaceId}/websites/${siteId}/generation-jobs/${jobId}/cancel`, method: 'POST', body: {} }),
  resumeGenerationJob: (workspaceId: string, siteId: string, jobId: string) => requestApi<WebsiteGenerationJob>({ path: `/workspaces/${workspaceId}/websites/${siteId}/generation-jobs/${jobId}/resume`, method: 'POST', body: {} }),
  publishGenerationJob: (workspaceId: string, siteId: string, jobId: string) => requestApi<WebsiteGenerationJob>({ path: `/workspaces/${workspaceId}/websites/${siteId}/generation-jobs/${jobId}/publish`, method: 'POST', body: {} }),
  listAssets: (workspaceId: string, siteId: string) => requestApi<{ items: ManagedWebsiteAsset[] }>({ path: `/workspaces/${workspaceId}/websites/${siteId}/assets` }),
  uploadAsset: (workspaceId: string, siteId: string, form: FormData) => requestApi<ManagedWebsiteAsset>({ path: `/workspaces/${workspaceId}/websites/${siteId}/assets`, method: 'POST', body: form }),
  getAssetBlob: (workspaceId: string, siteId: string, assetId: string) => requestApiBlob(`/workspaces/${workspaceId}/websites/${siteId}/assets/${assetId}`),
  deleteAsset: (workspaceId: string, siteId: string, assetId: string) => requestApi<{ id: string }>({ path: `/workspaces/${workspaceId}/websites/${siteId}/assets/${assetId}`, method: 'DELETE', body: {} }),
  editAsset: (workspaceId: string, siteId: string, assetId: string, prompt: string) => requestApi<WebsiteAssetEdit>({ path: `/workspaces/${workspaceId}/websites/${siteId}/assets/${assetId}/edit`, method: 'POST', body: { prompt }, timeoutMs: 180_000 }),
  getAssetEdit: (workspaceId: string, siteId: string, editId: string) => requestApi<WebsiteAssetEdit>({ path: `/workspaces/${workspaceId}/websites/${siteId}/asset-edits/${editId}` }),
};

export type StorefrontProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  longDescription: string | null;
  currency: string | null;
  price: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  category: string | null;
};

export type Storefront = {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  status: string;
  templateKey: string;
  previewUrl: string;
  customDomains: Array<{ hostname: string; status: string }>;
  plan: Record<string, unknown>;
  products: StorefrontProduct[];
  assets: Array<{ id: string; publicUrl: string; altText: string; placement: string }>;
};

/** Public projection used by the managed website preview and storefront. */
export const storefrontApi = {
  get: (slug: string) => requestApi<Storefront>({ path: `/public/storefront/${encodeURIComponent(slug)}` }),
  products: (slug: string) => requestApi<{ items: StorefrontProduct[] }>({ path: `/public/storefront/${encodeURIComponent(slug)}/products` }),
};
