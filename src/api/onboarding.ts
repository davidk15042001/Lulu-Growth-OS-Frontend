import { requestApi } from "./client";
import type { Workspace } from "./types";
import { workspaceApiPath } from "./types";

export type Offering = {
  id: string;
  name: string;
  offeringType: "product" | "service";
  category: string | null;
  description: string | null;
  targetCustomer: string | null;
  pricingModel: string | null;
  priceAmount: string | null;
  priceCurrency: string | null;
  priceLabel: string | null;
  status: string;
  customerProblem: string | null;
  valueProposition: string | null;
  url: string | null;
  imageUrl: string | null;
  sortOrder: number;
};

export type Platform = {
  id: string;
  integrationKey: string | null;
  name: string;
  category: string;
  connectionStatus: string;
  externalAccountId: string | null;
  grantedScopes: string[];
  settings: Record<string, unknown>;
  lastSyncedAt: string | null;
  lastError: string | null;
};

export type OnboardingSnapshot = {
  workspace: Workspace;
  offerings: Offering[];
  platforms: Platform[];
  completion: Record<string, unknown>;
};

export const onboardingApi = {
  snapshot: (workspaceId: string) => requestApi<OnboardingSnapshot>({ path: workspaceApiPath(workspaceId, "/onboarding") }),
  saveCompanyInformation: (workspaceId: string, input: {
    companyName: string; industry: string | null; companySize: string | null; countryRegion: string | null;
  }) => requestApi<Workspace>({ path: workspaceApiPath(workspaceId, "/onboarding/company-information"), method: "PATCH", body: input }),
  saveBusinessDescription: (workspaceId: string, input: {
    businessDescription: string | null; valueProposition: string | null; targetMarket: string | null; shortBrandDescription: string | null; positioningTags: string[];
  }) => requestApi<Workspace>({ path: workspaceApiPath(workspaceId, "/onboarding/business-description"), method: "PATCH", body: input }),
  offerings: (workspaceId: string) => requestApi<{ items: Offering[] }>({ path: workspaceApiPath(workspaceId, "/onboarding/offerings") }),
  createOffering: (workspaceId: string, input: Record<string, unknown>) => requestApi<Offering>({
    path: workspaceApiPath(workspaceId, "/onboarding/offerings"), method: "POST", body: input,
  }),
  updateOffering: (workspaceId: string, offeringId: string, input: Record<string, unknown>) => requestApi<Offering>({
    path: workspaceApiPath(workspaceId, `/onboarding/offerings/${offeringId}`), method: "PATCH", body: input,
  }),
  deleteOffering: (workspaceId: string, offeringId: string) => requestApi<null>({
    path: workspaceApiPath(workspaceId, `/onboarding/offerings/${offeringId}`), method: "DELETE",
  }),
  platforms: (workspaceId: string) => requestApi<{ items: Platform[] }>({ path: workspaceApiPath(workspaceId, "/onboarding/platforms") }),
  startOAuth: (workspaceId: string, provider: string, shop?: string, returnTo?: string) => requestApi<{ provider: string; authorizationUrl: string }>({
    path: workspaceApiPath(workspaceId, `/onboarding/platforms/${encodeURIComponent(provider)}/connect?${new URLSearchParams({ ...(shop ? { shop } : {}), ...(returnTo ? { returnTo } : {}) }).toString()}`),
  }),
  createPlatform: (workspaceId: string, input: Record<string, unknown>) => requestApi<Platform>({
    path: workspaceApiPath(workspaceId, "/onboarding/platforms"), method: "POST", body: input,
  }),
  updatePlatform: (workspaceId: string, platformId: string, input: Record<string, unknown>) => requestApi<Platform>({
    path: workspaceApiPath(workspaceId, `/onboarding/platforms/${platformId}`), method: "PATCH", body: input,
  }),
  deletePlatform: (workspaceId: string, platformId: string) => requestApi<null>({
    path: workspaceApiPath(workspaceId, `/onboarding/platforms/${platformId}`), method: "DELETE",
  }),
  complete: (workspaceId: string) => requestApi<Workspace>({ path: workspaceApiPath(workspaceId, "/onboarding/complete"), method: "POST", body: {} }),
  createBillingCheckout: (workspaceId: string, input: { planKey: "viewer" | "starter" | "ai" | "test"; successUrl: string; backUrl: string; password?: string }) => requestApi<{
    planKey: "viewer" | "starter" | "ai" | "test";
    free: boolean;
    checkoutId?: string;
    checkoutUrl?: string;
    status: string;

  }>({ path: workspaceApiPath(workspaceId, "/billing"), method: "POST", body: input }),
};
