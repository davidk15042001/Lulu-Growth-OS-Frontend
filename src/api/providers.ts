import { requestApi } from "./client";
import { workspaceApiPath } from "./types";

export type ProviderCapabilityState = {
  id: string;
  capabilityKey: string;
  status: "AVAILABLE" | "UNAVAILABLE" | "AUTHORIZATION_REQUIRED" | "PROVIDER_REVIEW" | "PLAN_REQUIRED" | "BLOCKED" | "UNCONFIRMED" | "ERROR";
  source: string;
  grantedScopes: string[];
  lastCheckedAt: string | null;
  lastError: string | null;
};

export type ProviderAsset = {
  id: string;
  providerKey: string;
  assetType: string;
  externalAssetId: string;
  displayName: string | null;
  status: string;
  capabilities: Record<string, unknown>;
  metadata: Record<string, unknown>;
  lastSyncedAt: string | null;
};

export type ProviderAccount = {
  id: string;
  providerKey: string;
  externalAccountId: string;
  name: string | null;
  accountType: string | null;
  status: string;
  currency: string | null;
  timezone: string | null;
  country: string | null;
  metadata: Record<string, unknown>;
  lastSyncedAt: string | null;
  assets: ProviderAsset[];
};

export type ProviderConnection = {
  id: string;
  scopeType: "WORKSPACE" | "ORGANIZATION" | "LULU_PLATFORM" | "PARTNER";
  workspaceId: string | null;
  organizationId: string | null;
  providerKey: string;
  displayName: string;
  mode: "LULU_MANAGED" | "CUSTOMER_OWNED" | "PARTNER_MANAGED" | "HYBRID";
  status: string;
  authorizationState: string;
  externalAccountId: string | null;
  grantedScopes: string[];
  hasCredentialReference: boolean;
  sourceType: string | null;
  sourceId: string | null;
  sharedGrantedCapabilities?: string[];
  healthStatus: string;
  healthReason: string | null;
  lastVerifiedAt: string | null;
  lastSuccessAt: string | null;
  lastWebhookAt: string | null;
  rateLimitResetAt: string | null;
  consecutiveFailures: number;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
  accounts: ProviderAccount[];
  capabilities: ProviderCapabilityState[];
  syncStates: Array<{ id: string; subjectType: string; subjectId: string; syncType: string; cursor: string | null; status: string; lastSuccessAt: string | null; lastAttemptAt: string | null; lastError: string | null; retryCount: number }>;
};

export type ProviderCatalogEntry = {
  providerKey: string;
  displayName: string;
  category: string;
  implementationStatus: string;
  defaultMode: ProviderConnection["mode"];
  capabilities: Array<{ capabilityKey: string; displayName: string; requiredScopes: string[]; defaultStatus: string }>;
};

export const providerControlApi = {
  catalog: (workspaceId: string) => requestApi<{ providers: ProviderCatalogEntry[] }>({ path: workspaceApiPath(workspaceId, "/providers/catalog") }),
  connections: (workspaceId: string) => requestApi<{ connections: ProviderConnection[] }>({ path: workspaceApiPath(workspaceId, "/providers") }),
  connection: (workspaceId: string, connectionId: string) => requestApi<ProviderConnection>({ path: workspaceApiPath(workspaceId, `/providers/${encodeURIComponent(connectionId)}`) }),
  verify: (workspaceId: string, connectionId: string) => requestApi<ProviderConnection | null>({ path: workspaceApiPath(workspaceId, `/providers/${encodeURIComponent(connectionId)}/verify`), method: "POST", body: {} }),
  changeMode: (workspaceId: string, connectionId: string, mode: ProviderConnection["mode"]) => requestApi<ProviderConnection>({ path: workspaceApiPath(workspaceId, `/providers/${encodeURIComponent(connectionId)}/mode`), method: "PATCH", body: { mode } }),
  sync: (workspaceId: string, connectionId: string, syncType = "full") => requestApi<{ jobId: string; connectionId: string; providerKey: string; syncType: string; status: string }>({ path: workspaceApiPath(workspaceId, `/providers/${encodeURIComponent(connectionId)}/sync`), method: "POST", body: { syncType } }),
  disconnect: (workspaceId: string, connectionId: string) => requestApi<ProviderConnection | null>({ path: workspaceApiPath(workspaceId, `/providers/${encodeURIComponent(connectionId)}`), method: "DELETE" }),
  mappings: (workspaceId: string, filters?: { luluObjectType?: string; luluObjectId?: string }) => {
    const query = new URLSearchParams();
    if (filters?.luluObjectType) query.set("luluObjectType", filters.luluObjectType);
    if (filters?.luluObjectId) query.set("luluObjectId", filters.luluObjectId);
    return requestApi<{ mappings: Array<Record<string, unknown>> }>({ path: workspaceApiPath(workspaceId, `/providers/mappings${query.size ? `?${query.toString()}` : ""}`) });
  },
};
