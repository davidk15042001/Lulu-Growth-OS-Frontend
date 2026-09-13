import { requestApi } from "./client";
import { workspaceApiPath } from "./types";

export type SocialProvider = "FACEBOOK" | "INSTAGRAM";
export type SocialAccountStatus = "AVAILABLE" | "BLOCKED" | "UNAVAILABLE";
export type SocialContentType = "TEXT" | "LINK" | "IMAGE";
export type SocialContentStatus = "DRAFT" | "READY" | "ARCHIVED";
export type SocialPublicationStatus =
  | "DRAFT" | "SCHEDULED" | "QUEUED" | "PUBLISHING"
  | "PUBLISHED" | "FAILED" | "CANCELLED" | "BLOCKED";
export type SocialPublicationAttemptStatus = "RUNNING" | "SUCCEEDED" | "FAILED" | "BLOCKED" | "DEAD_LETTER";
export type SocialActorType = "USER" | "AI_AGENT" | "WORKFLOW" | "SYSTEM" | "ADMIN";

export type SocialAccount = {
  id: string;
  workspaceId: string;
  providerConnectionId: string;
  provider: SocialProvider;
  displayName: string;
  facebookPageId: string;
  instagramBusinessAccountId: string | null;
  providerUsername: string | null;
  status: SocialAccountStatus;
  statusReason: string;
  verifiedAt: string | null;
  lastErrorCode: string | null;
  lastErrorMessage: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type SocialContent = {
  id: string;
  workspaceId: string;
  contentType: SocialContentType;
  status: SocialContentStatus;
  message: string;
  linkUrl: string | null;
  mediaUrl: string | null;
  altText: string | null;
  metadata: Record<string, unknown>;
  version: number;
  createdByActorType: SocialActorType;
  createdByActorRef: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SocialPublicationAttempt = {
  id: string;
  attemptNumber: number;
  status: SocialPublicationAttemptStatus;
  workerId: string;
  requestSummary: Record<string, unknown>;
  responseSummary: Record<string, unknown> | null;
  providerRequestId: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  startedAt: string;
  finishedAt: string | null;
};

export type SocialPublicationJob = {
  id: string;
  workspaceId: string;
  socialAccountId: string;
  contentId: string;
  status: SocialPublicationStatus;
  scheduledAt: string | null;
  availableAt: string;
  providerPublicationId: string | null;
  providerPermalink: string | null;
  attemptCount: number;
  maxAttempts: number;
  publishedAt: string | null;
  finishedAt: string | null;
  blockCode: string | null;
  blockMessage: string | null;
  lastErrorCode: string | null;
  lastErrorMessage: string | null;
  version: number;
  createdByActorType: SocialActorType;
  createdByActorRef: string | null;
  createdAt: string;
  updatedAt: string;
  account?: SocialAccount;
  content?: SocialContent;
  attempts?: SocialPublicationAttempt[];
};

export type CreateSocialAccountInput = {
  providerConnectionId: string;
  provider: SocialProvider;
  displayName: string;
  facebookPageId: string;
  instagramBusinessAccountId?: string | null;
  idempotencyKey: string;
};

export type CreateSocialContentInput = {
  contentType: SocialContentType;
  status: "DRAFT" | "READY";
  message: string;
  linkUrl?: string | null;
  mediaUrl?: string | null;
  altText?: string | null;
  metadata?: Record<string, unknown>;
  idempotencyKey: string;
};

export type UpdateSocialContentInput = {
  expectedVersion: number;
  status?: SocialContentStatus;
  message?: string;
  linkUrl?: string | null;
  mediaUrl?: string | null;
  altText?: string | null;
  metadata?: Record<string, unknown>;
};

export type CreateSocialPublicationInput = {
  socialAccountId: string;
  contentId: string;
  execution: "DRAFT" | "QUEUE";
  scheduledAt?: string | null;
  maxAttempts?: number;
  idempotencyKey: string;
};

function root(workspaceId: string, suffix = "") {
  return workspaceApiPath(workspaceId, `/social-publishing${suffix}`);
}

function statusQuery(status?: string) {
  return status ? `?status=${encodeURIComponent(status)}` : "";
}

export function createSocialIdempotencyKey(operation: string) {
  const id = typeof globalThis.crypto?.randomUUID === "function"
    ? globalThis.crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `social-ui:${operation}:${id}`;
}

export const socialPublishingApi = {
  listAccounts: (workspaceId: string, signal?: AbortSignal) => requestApi<{ items: SocialAccount[] }>({
    path: root(workspaceId, "/accounts"), signal,
  }),
  getAccount: (workspaceId: string, accountId: string, signal?: AbortSignal) => requestApi<SocialAccount>({
    path: root(workspaceId, `/accounts/${encodeURIComponent(accountId)}`), signal,
  }),
  createAccount: (workspaceId: string, input: CreateSocialAccountInput) => requestApi<SocialAccount>({
    path: root(workspaceId, "/accounts"), method: "POST", body: input,
  }),
  verifyAccount: (workspaceId: string, accountId: string, expectedVersion: number) => requestApi<SocialAccount>({
    path: root(workspaceId, `/accounts/${encodeURIComponent(accountId)}/verify`),
    method: "POST",
    body: { expectedVersion },
  }),
  listContent: (workspaceId: string, status?: SocialContentStatus, signal?: AbortSignal) => requestApi<{ items: SocialContent[] }>({
    path: root(workspaceId, `/content${statusQuery(status)}`), signal,
  }),
  getContent: (workspaceId: string, contentId: string, signal?: AbortSignal) => requestApi<SocialContent>({
    path: root(workspaceId, `/content/${encodeURIComponent(contentId)}`), signal,
  }),
  createContent: (workspaceId: string, input: CreateSocialContentInput) => requestApi<SocialContent>({
    path: root(workspaceId, "/content"), method: "POST", body: input,
  }),
  updateContent: (workspaceId: string, contentId: string, input: UpdateSocialContentInput) => requestApi<SocialContent>({
    path: root(workspaceId, `/content/${encodeURIComponent(contentId)}`), method: "PATCH", body: input,
  }),
  listPublications: (workspaceId: string, status?: SocialPublicationStatus, signal?: AbortSignal) => requestApi<{ items: SocialPublicationJob[] }>({
    path: root(workspaceId, `/publications${statusQuery(status)}`), signal,
  }),
  getPublication: (workspaceId: string, publicationId: string, signal?: AbortSignal) => requestApi<SocialPublicationJob>({
    path: root(workspaceId, `/publications/${encodeURIComponent(publicationId)}`), signal,
  }),
  createPublication: (workspaceId: string, input: CreateSocialPublicationInput) => requestApi<SocialPublicationJob>({
    path: root(workspaceId, "/publications"), method: "POST", body: input,
  }),
  queuePublication: (workspaceId: string, publicationId: string, expectedVersion: number, scheduledAt?: string | null) => requestApi<SocialPublicationJob>({
    path: root(workspaceId, `/publications/${encodeURIComponent(publicationId)}/queue`),
    method: "POST",
    body: { expectedVersion, ...(scheduledAt !== undefined ? { scheduledAt } : {}) },
  }),
  retryPublication: (workspaceId: string, publicationId: string, expectedVersion: number, scheduledAt?: string | null) => requestApi<SocialPublicationJob>({
    path: root(workspaceId, `/publications/${encodeURIComponent(publicationId)}/retry`),
    method: "POST",
    body: { expectedVersion, ...(scheduledAt !== undefined ? { scheduledAt } : {}) },
  }),
  cancelPublication: (workspaceId: string, publicationId: string, expectedVersion: number) => requestApi<SocialPublicationJob>({
    path: root(workspaceId, `/publications/${encodeURIComponent(publicationId)}/cancel`),
    method: "POST",
    body: { expectedVersion },
  }),
};
