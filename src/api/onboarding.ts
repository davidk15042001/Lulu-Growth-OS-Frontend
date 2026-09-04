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
  sku: string | null;
  portfolioGroup: string | null;
  lifecycleStage: string | null;
  launchDate: string | null;
  deliveryModel: string | null;
  serviceScope: string | null;
  setupFee: string | null;
  recurringFee: string | null;
  usageFee: string | null;
  billingInterval: string | null;
  minimumContractMonths: number | null;
  cancellationPeriodDays: number | null;
  onboardingEffort: string | null;
  fulfilmentEffort: string | null;
  differentiators: string[];
  proofPoints: string[];
  useCases: string[];
  objections: string[];
  addOns: string[];
};

export type CustomerSegment = {
  id: string;
  name: string;
  industry: string | null;
  companySize: string | null;
  region: string | null;
  maturityLevel: string | null;
  painPoints: string[];
  jobsToBeDone: string[];
  decisionCriteria: string[];
  useCases: string[];
  buyingRoles: string[];
  priceSensitivity: string | null;
  primarySegment: boolean;
  sortOrder: number;
  notes: string | null;
};

export type Competitor = {
  id: string;
  name: string;
  websiteUrl: string | null;
  competitorType: "direct" | "indirect" | "substitute" | "emerging";
  market: string | null;
  positioning: string | null;
  pricingSummary: string | null;
  strengths: string[];
  weaknesses: string[];
  differentiators: string[];
  featureOverlap: string[];
  threatLevel: string | null;
  strategicPriority: string | null;
  sourceQuality: string | null;
  monitoringFrequency: string | null;
  notes: string | null;
  lastReviewedAt: string | null;
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

export type AiBusinessProfileSuggestion = {
  value: string;
  whyItFits: string;
  competitorGap: string;
  score: number;
};

export type AiBusinessProfileCompetitorComparison = {
  name: string;
  websiteUrl: string | null;
  competitorType: string | null;
  market: string | null;
  positioning: string | null;
  strengths: string[];
  weaknesses: string[];
  whitespace: string[];
  whyYouCanWin: string;
};

export type AiGeneratedCustomerSegment = {
  name: string;
  industry: string | null;
  companySize: string | null;
  region: string | null;
  maturityLevel: string | null;
  painPoints: string[];
  jobsToBeDone: string[];
  decisionCriteria: string[];
  useCases: string[];
  buyingRoles: string[];
  priceSensitivity: string | null;
  primarySegment: boolean;
  notes: string | null;
  score: number;
  whyItFits: string;
};

export type AiBusinessProfile = {
  workspaceId: string;
  model: string | null;
  generatedAt: string | null;
  createdAt: string;
  updatedAt: string;
  payload: {
    summary: string;
    recommendedProfile: {
      valueProposition: string;
      targetMarket: string;
      primaryIcp: string;
      usp: string;
      shortBrandDescription: string;
      primaryChallenges: string[];
      languages: string[];
    };
    suggestions: {
      valuePropositions: AiBusinessProfileSuggestion[];
      targetMarkets: AiBusinessProfileSuggestion[];
      primaryIcps: AiBusinessProfileSuggestion[];
      usps: AiBusinessProfileSuggestion[];
      shortBrandDescriptions: AiBusinessProfileSuggestion[];
      primaryChallenges: AiBusinessProfileSuggestion[];
      languages: AiBusinessProfileSuggestion[];
    };
    customerSegments: AiGeneratedCustomerSegment[];
    competitorComparison: AiBusinessProfileCompetitorComparison[];
  };
};

export type OnboardingSnapshot = {
  workspace: Workspace;
  offerings: Offering[];
  customerSegments: CustomerSegment[];
  competitors: Competitor[];
  platforms: Platform[];
  completion: Record<string, unknown>;
  aiBusinessProfile: AiBusinessProfile | null;
};

export const onboardingApi = {
  snapshot: (workspaceId: string) => requestApi<OnboardingSnapshot>({ path: workspaceApiPath(workspaceId, "/onboarding") }),
  saveCompanyInformation: (workspaceId: string, input: {
    companyName: string; industry: string | null; companySize: string | null; countryRegion: string | null;
  }) => requestApi<Workspace>({ path: workspaceApiPath(workspaceId, "/onboarding/company-information"), method: "PATCH", body: input }),
  saveBusinessDescription: (workspaceId: string, input: {
    businessDescription: string | null; valueProposition: string | null; targetMarket: string | null; shortBrandDescription: string | null; positioningTags: string[];
    legalForm: string | null; foundingYear: number | null; employeeCount: number | null; annualRevenueRange: string | null;
    businessModelType: string | null; companyStage: string | null; salesModel: string | null; salesCycleDays: number | null;
    primaryIcp: string | null; usp: string | null; mission: string | null; vision: string | null;
    primaryChallenges: string[]; languages: string[]; regulatedIndustries: string[];
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
  customerSegments: (workspaceId: string) => requestApi<{ items: CustomerSegment[] }>({ path: workspaceApiPath(workspaceId, "/onboarding/customer-segments") }),
  createCustomerSegment: (workspaceId: string, input: Record<string, unknown>) => requestApi<CustomerSegment>({
    path: workspaceApiPath(workspaceId, "/onboarding/customer-segments"), method: "POST", body: input,
  }),
  updateCustomerSegment: (workspaceId: string, customerSegmentId: string, input: Record<string, unknown>) => requestApi<CustomerSegment>({
    path: workspaceApiPath(workspaceId, `/onboarding/customer-segments/${customerSegmentId}`), method: "PATCH", body: input,
  }),
  deleteCustomerSegment: (workspaceId: string, customerSegmentId: string) => requestApi<null>({
    path: workspaceApiPath(workspaceId, `/onboarding/customer-segments/${customerSegmentId}`), method: "DELETE",
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
  continueExistingPlatforms: (workspaceId: string) => requestApi<Workspace>({
    path: workspaceApiPath(workspaceId, "/onboarding/existing-platforms/continue"), method: "POST", body: {},
  }),
  competitors: (workspaceId: string) => requestApi<{ items: Competitor[] }>({ path: workspaceApiPath(workspaceId, "/onboarding/competitors") }),
  discoverCompetitors: (workspaceId: string, options?: { timeoutMs?: number }) => requestApi<{ items: Competitor[] }>({
    path: workspaceApiPath(workspaceId, "/onboarding/competitors/discover"), method: "POST", body: {}, timeoutMs: options?.timeoutMs,
  }),
  createCompetitor: (workspaceId: string, input: Record<string, unknown>) => requestApi<Competitor>({
    path: workspaceApiPath(workspaceId, "/onboarding/competitors"), method: "POST", body: input,
  }),
  updateCompetitor: (workspaceId: string, competitorId: string, input: Record<string, unknown>) => requestApi<Competitor>({
    path: workspaceApiPath(workspaceId, `/onboarding/competitors/${competitorId}`), method: "PATCH", body: input,
  }),
  deleteCompetitor: (workspaceId: string, competitorId: string) => requestApi<null>({
    path: workspaceApiPath(workspaceId, `/onboarding/competitors/${competitorId}`), method: "DELETE",
  }),
  aiBusinessProfile: (workspaceId: string) => requestApi<AiBusinessProfile | null>({ path: workspaceApiPath(workspaceId, "/onboarding/ai-business-profile") }),
  generateAiBusinessProfile: (workspaceId: string, options?: { timeoutMs?: number }) => requestApi<AiBusinessProfile>({
    path: workspaceApiPath(workspaceId, "/onboarding/ai-business-profile"), method: "POST", body: {}, timeoutMs: options?.timeoutMs,
  }),
  applyAiCustomerSegments: (workspaceId: string) => requestApi<{ items: CustomerSegment[] }>({
    path: workspaceApiPath(workspaceId, "/onboarding/ai-business-profile/customer-segments/apply"), method: "POST", body: {},
  }),
  complete: (workspaceId: string) => requestApi<Workspace>({ path: workspaceApiPath(workspaceId, "/onboarding/complete"), method: "POST", body: {} }),
  createBillingCheckout: (workspaceId: string, input: { planKey: "starter" | "ai"; successUrl: string; backUrl: string }) => requestApi<{
    planKey: "starter" | "ai";
    free: boolean;
    checkoutId?: string;
    checkoutUrl?: string;
    status: string;

  }>({ path: workspaceApiPath(workspaceId, "/billing"), method: "POST", body: input }),
};
