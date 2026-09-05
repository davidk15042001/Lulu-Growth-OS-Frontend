import { requestApi } from "./client";
import type { Pagination, WorkspaceInvitation, WorkspaceMember } from "./types";
import { workspaceApiPath } from "./types";

export type SavedView = {
  id: string;
  workspaceId: string;
  userId: string;
  resourceType: string;
  name: string;
  filters: Record<string, unknown>;
  sorting: Record<string, unknown>;
  isDefault: boolean;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuditEntry = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  actorId: string | null;
  actorEmail: string | null;
  requestId: string | null;
  beforeData: Record<string, unknown> | null;
  afterData: Record<string, unknown> | null;
  createdAt: string;
};

export type WorkspaceSettings = {
  workspaceId: string;
  settings: {
    sales?: {
      moduleName?: string;
      defaultCurrency?: string;
      defaultTimeZone?: string;
      defaultLanguage?: string;
      defaultDateFormat?: string;
      defaultNumberFormat?: string;
      salesModuleEnabled?: boolean;
      aiSalesAssistanceEnabled?: boolean;
      salesNotificationsEnabled?: boolean;
      salesActivityTrackingEnabled?: boolean;
    };
  };
  createdAt: string | null;
  updatedAt: string | null;
};

export type ContentRefreshJob = {
  id: string;
  workspaceId: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  currentPhase: string;
  progress: number;
  modules: string[];
  moduleStatus: Record<string, unknown>;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export type ContentAsset = {
  id: string;
  workspaceId: string;
  snapshotId: string | null;
  module: string;
  assetType: string;
  language: string;
  title: string;
  content: Record<string, unknown>;
  status: string;
  version: number;
  generatedAt: string | null;
  updatedAt: string;
};

export type BillingState = {
  subscription: null | {
    workspaceId: string;
    provider: string;
    planKey: string;
    status: string;
    seats: number;
    trialEndsAt: string | null;
    currentPeriodStartsAt: string | null;
    currentPeriodEndsAt: string | null;
    cancelAtPeriodEnd: boolean;
    metadata: Record<string, unknown>;
  };
  usage: Array<{
    metricKey: string;
    periodStart: string;
    periodEnd: string;
    quantity: string;
    metadata: Record<string, unknown>;
    updatedAt: string;
  }>;
  payg: null | {
    enabled: boolean;
    currency: "USD";
    intervalDays: 7;
    periodStart: string;
    periodEnd: string;
    nextInvoiceAt: string;
    collectionMethod: "AUTO_CHARGE" | "CHARGE_ON_CHECKOUT";
    aiAccessBlocked: boolean;
    blockedAt: string | null;
    blockReason: "PAYMENT_SOURCE_SETUP_REQUIRED" | "PAYMENT_SOURCE_REQUIRED" | "AUTOMATIC_PAYMENT_FAILED" | string | null;
    paymentLink: string | null;
    apiCost: number;
    serverCost: number;
    estimatedTotal: number;
    inputTokens: number;
    outputTokens: number;
    apiEvents: number;
    serverDays: number;
    paymentMethods: Array<"card" | "alipaycn" | "wechatpay">;
    invoices: Array<{
      id: string;
      periodStart: string;
      periodEnd: string;
      status: "processing" | "payment_due" | "payment_failed" | "paid" | "skipped" | "failed" | "voided";
      currency: "USD";
      apiCost: number;
      serverCost: number;
      totalCost: number;
      hostedInvoiceUrl: string | null;
      invoicePdfUrl: string | null;
      finalizedAt: string | null;
      paidAt: string | null;
      billingMode: "weekly" | "api_pay_now";
    }>;
  };
};

export type GoogleReviewsAccount = {
  id: string;
  name: string;
  type: string | null;
};

export type GoogleReviewsTopicCount = {
  topic: string;
  count: number;
};

export type GoogleReviewsLocation = {
  accountId: string;
  id: string;
  title: string;
  address: string;
  storeCode: string | null;
  websiteUrl: string | null;
  totalReviewCount: number;
  averageRating: number | null;
  unansweredCount: number;
  negativeCount: number;
};

export type GoogleReviewReply = {
  comment: string;
  updateTime: string | null;
};

export type GoogleReviewsManagerReview = {
  id: string;
  name: string;
  accountId: string;
  locationId: string;
  locationTitle: string;
  locationAddress: string;
  starRating: number;
  comment: string;
  reviewerDisplayName: string;
  reviewerIsAnonymous: boolean;
  createTime: string | null;
  updateTime: string | null;
  sentiment: "positive" | "mixed" | "negative";
  urgency: "critical" | "high" | "medium" | "low";
  topics: string[];
  verifiedFacts: string[];
  inferredIssues: string[];
  recommendedActions: string[];
  summary: string;
  suggestedReply: string;
  requiresHuman: boolean;
  reviewReply: GoogleReviewReply | null;
};

export type GoogleReviewsManagerState = {
  connected: boolean;
  platformId: string | null;
  aiAvailable: boolean;
  generatedAt: string;
  accounts: GoogleReviewsAccount[];
  locations: GoogleReviewsLocation[];
  summary: {
    totalReviews: number;
    averageRating: number | null;
    replyRate: number;
    unansweredCount: number;
    negativeCount: number;
    mixedCount: number;
    positiveCount: number;
    priorityReviewCount: number;
  };
  insights: {
    headline: string;
    topTopics: GoogleReviewsTopicCount[];
    strengths: string[];
    risks: string[];
    recommendedActions: string[];
    dataGaps: string[];
  };
  reviews: GoogleReviewsManagerReview[];
};

export type GoogleBusinessAccount = {
  id: string;
  name: string;
  type: string | null;
  locationCount: number;
};

export type GoogleBusinessLocation = {
  accountId: string;
  id: string;
  title: string;
  address: string;
  storeCode: string | null;
  websiteUrl: string | null;
};

export type GoogleBusinessState = {
  provider: string;
  connected: boolean;
  platformId: string | null;
  connectionStatus: string;
  platformName: string;
  category: string;
  externalAccountId: string | null;
  grantedScopes: string[];
  lastSyncedAt: string | null;
  lastError: string | null;
  generatedAt: string;
  apiReachable: boolean;
  reauthRequired: boolean;
  accounts: GoogleBusinessAccount[];
  locations: GoogleBusinessLocation[];
  summary: {
    accountCount: number;
    locationCount: number;
  };
  nextSteps: string[];
};

export const workspaceAppApi = {
  members: (workspaceId: string) => requestApi<{ members: WorkspaceMember[]; invitations: WorkspaceInvitation[] }>({
    path: workspaceApiPath(workspaceId, "/members"),
  }),
  invite: (workspaceId: string, email: string, role: "admin" | "member" | "viewer") => requestApi<WorkspaceInvitation>({
    path: workspaceApiPath(workspaceId, "/members"), method: "POST", body: { email, role },
  }),
  updateMember: (workspaceId: string, memberId: string, role: "admin" | "member" | "viewer") => requestApi<WorkspaceMember>({
    path: workspaceApiPath(workspaceId, `/members/${memberId}`), method: "PATCH", body: { role },
  }),
  removeMember: (workspaceId: string, memberId: string) => requestApi<null>({
    path: workspaceApiPath(workspaceId, `/members/${memberId}`), method: "DELETE",
  }),
  savedViews: (workspaceId: string, resourceType?: string) => requestApi<{ items: SavedView[] }>({
    path: workspaceApiPath(workspaceId, `/saved-views${resourceType ? `?resourceType=${encodeURIComponent(resourceType)}` : ""}`),
  }),
  createSavedView: (workspaceId: string, input: {
    resourceType: string; name: string; filters?: Record<string, unknown>; sorting?: Record<string, unknown>; isDefault?: boolean; isShared?: boolean;
  }) => requestApi<SavedView>({ path: workspaceApiPath(workspaceId, "/saved-views"), method: "POST", body: input }),
  updateSavedView: (workspaceId: string, viewId: string, input: Partial<Pick<SavedView, "name" | "filters" | "sorting" | "isDefault" | "isShared">>) => requestApi<SavedView>({
    path: workspaceApiPath(workspaceId, `/saved-views/${viewId}`), method: "PATCH", body: input,
  }),
  deleteSavedView: (workspaceId: string, viewId: string) => requestApi<null>({
    path: workspaceApiPath(workspaceId, `/saved-views/${viewId}`), method: "DELETE",
  }),
  audit: (workspaceId: string, query = "limit=100") => requestApi<{ items: AuditEntry[]; pagination: Pagination }>({
    path: workspaceApiPath(workspaceId, `/audit?${query}`),
  }),
  settings: (workspaceId: string) => requestApi<WorkspaceSettings>({
    path: workspaceApiPath(workspaceId, "/settings"),
  }),
  updateSettings: (workspaceId: string, input: Pick<WorkspaceSettings["settings"], "sales">) => requestApi<WorkspaceSettings>({
    path: workspaceApiPath(workspaceId, "/settings"), method: "PATCH", body: input,
  }),
  billing: (workspaceId: string, query = "") => requestApi<BillingState>({
    path: workspaceApiPath(workspaceId, `/billing${query ? `?${query}` : ""}`),
  }),
  createPaygApiUsageCheckout: (workspaceId: string) => requestApi<{
    periodId: string;
    paymentUrl: string | null;
    status: "paid" | "payment_due" | "payment_failed" | "processing" | "failed";
    reused: boolean;
  }>({
    path: workspaceApiPath(workspaceId, "/billing/payg/api-checkout"),
    method: "POST",
    body: {},
  }),
  googleReviews: (workspaceId: string, filters?: { locationId?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (filters?.locationId) query.set("locationId", filters.locationId);
    if (filters?.limit) query.set("limit", String(filters.limit));
    return requestApi<GoogleReviewsManagerState>({
      path: workspaceApiPath(workspaceId, `/google-reviews${query.size ? `?${query.toString()}` : ""}`),
    });
  },
  googleBusiness: (workspaceId: string) => requestApi<GoogleBusinessState>({
    path: workspaceApiPath(workspaceId, "/google-business"),
  }),
  connectGoogleBusiness: (workspaceId: string, input?: { returnTo?: string }) => requestApi<{
    provider: string;
    authorizationUrl: string;
  }>({
    path: workspaceApiPath(workspaceId, "/google-business/connect"),
    method: "POST",
    body: input ?? {},
  }),
  disconnectGoogleBusiness: (workspaceId: string) => requestApi<{
    provider: string;
    platformId: string | null;
    connected: boolean;
    status: string;
  }>({
    path: workspaceApiPath(workspaceId, "/google-business/connection"),
    method: "DELETE",
  }),
  syncGoogleBusiness: (workspaceId: string) => requestApi<{
    id: string;
    platformId: string;
    jobId: string;
    status: string;
    createdAt: string;
  }>({
    path: workspaceApiPath(workspaceId, "/google-business/sync"),
    method: "POST",
    body: {},
  }),
  updateGoogleReviewReply: (workspaceId: string, reviewId: string, input: {
    accountId: string;
    locationId: string;
    comment: string;
  }) => requestApi<{
    reviewId: string;
    name: string;
    reviewReply: GoogleReviewReply;
  }>({
    path: workspaceApiPath(workspaceId, `/google-reviews/${encodeURIComponent(reviewId)}/reply`),
    method: "PUT",
    body: input,
  }),
  syncBillingCheckout: (workspaceId: string, checkoutId: string) => requestApi<{
    checkoutId: string;
    planKey: string;
    status: "pending" | "active";
    providerStatus: string;
    subscriptionId?: string | null;
    invoiceId?: string | null;
  }>({
    path: workspaceApiPath(workspaceId, `/billing/checkouts/${encodeURIComponent(checkoutId)}/sync`),
    method: "POST",
    body: {},
  }),
  startContentRefresh: (workspaceId: string, modules?: string[]) => requestApi<{ job: ContentRefreshJob; reused: boolean }>({
    path: workspaceApiPath(workspaceId, "/content-refresh"), method: "POST", body: { modules },
  }),
  contentRefreshStatus: (workspaceId: string, jobId: string) => requestApi<ContentRefreshJob>({
    path: workspaceApiPath(workspaceId, `/content-refresh/${encodeURIComponent(jobId)}?ts=${Date.now()}`),
  }),
  contentAssets: (workspaceId: string, module?: string) => requestApi<{ items: ContentAsset[] }>({
    path: workspaceApiPath(workspaceId, `/content-assets${module ? `?module=${encodeURIComponent(module)}` : ""}`),
  }),
  syncIntegration: (workspaceId: string, platformId: string) => requestApi<{
    id: string; platformId: string; jobId: string; status: string; createdAt: string;
  }>({ path: workspaceApiPath(workspaceId, `/integrations/${platformId}/sync`), method: "POST", body: {} }),
};
