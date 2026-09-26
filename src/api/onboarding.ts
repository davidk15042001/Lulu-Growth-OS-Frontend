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
      vision: string;
      targetMarket: string;
      primaryIcp: string;
      usp: string;
      shortBrandDescription: string;
      primaryChallenges: string[];
      languages: string[];
    };
    suggestions: {
      valuePropositions: AiBusinessProfileSuggestion[];
      visions: AiBusinessProfileSuggestion[];
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

export type AiPreferences = {
  detectionSettings: Record<string, boolean>;
  searchPriorities: Record<string, "low" | "medium" | "high">;
  approvalPreferences: Record<string, "always_ask" | "ask_high_impact" | "auto">;
};

export type OnboardingSnapshot = {
  workspace: Workspace;
  offerings: Offering[];
  customerSegments: CustomerSegment[];
  competitors: Competitor[];
  platforms: Platform[];
  aiPreferences: AiPreferences | null;
  completion: Record<string, unknown>;
  aiBusinessProfile: AiBusinessProfile | null;
};

export type OnboardingDocument={id:string;workspaceId:string;fileName:string;mimeType:string;sizeBytes:number;createdAt:string};

export type CatalogImportVariant = {
  name: string;
  sku: string | null;
  description?: string | null;
  price?: number | null;
  currency?: string | null;
  barcode?: string | null;
  weight?: number | null;
  weightUnit?: string | null;
  dimensionLength?: number | null;
  dimensionWidth?: number | null;
  dimensionHeight?: number | null;
  dimensionUnit?: string | null;
  moqQuantity?: number | null;
  moqUnit?: string | null;
  leadTimeMinDays?: number | null;
  leadTimeMaxDays?: number | null;
  attributes: Array<{ name: string; value: string; unit: string | null }>;
  imageEvidenceIds?: string[];
};
export type CatalogImportItem = {
  name: string;
  kind: 'product' | 'service' | 'other';
  productType?: string | null;
  description: string | null;
  category?: string | null;
  price?: number | null;
  currency?: string | null;
  sku?: string | null;
  countryOfOrigin?: string | null;
  hsCode?: string | null;
  variants: CatalogImportVariant[];
  imageEvidenceIds?: string[];
};
export type CatalogImport = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'PROCESSING' | 'REVIEW_REQUIRED' | 'COMPLETED' | 'FAILED';
  classification: {
    summary?: string;
    items?: CatalogImportItem[];
    generalKnowledge?: Array<{ title: string; content: string }>;
    catalogImport?: { evidence?: Array<{ assetId: string; kind: string; pageNumber: number | null; eligibleImageReference: boolean }> };
  };
  errorCode: string | null;
  errorMessage: string | null;
  progress: CatalogImportProgress;
};

export type CatalogImportProgress = {
  phase: 'QUEUED' | 'READING_SOURCES' | 'COLLECTING_EVIDENCE' | 'CLASSIFYING' | 'REVIEW_READY' | 'FAILED';
  documentsTotal: number;
  documentsProcessed: number;
  evidenceCount: number;
  itemCount?: number;
};

export const onboardingApi = {
  snapshot: (workspaceId: string) => requestApi<OnboardingSnapshot>({ path: workspaceApiPath(workspaceId, "/onboarding") }),
  documents:(workspaceId:string)=>requestApi<{items:OnboardingDocument[]}>({path:workspaceApiPath(workspaceId,"/onboarding/documents")}),
  uploadDocument:(workspaceId:string,file:File)=>{const body=new FormData();body.append('file',file,file.name);return requestApi<OnboardingDocument>({path:workspaceApiPath(workspaceId,"/onboarding/documents"),method:'POST',body});},
  deleteDocument:(workspaceId:string,documentId:string)=>requestApi<null>({path:workspaceApiPath(workspaceId,`/onboarding/documents/${documentId}`),method:'DELETE'}),
  activateKnowledge:(workspaceId:string,input:{text:string;documentIds:string[];referenceDocumentIds?:string[]})=>requestApi<{completed:boolean;activationId?:string;status?:'PROCESSING';productIds?:string[]}>({path:workspaceApiPath(workspaceId,"/onboarding/knowledge-activation"),method:'POST',body:input}),
  catalogImport:(workspaceId:string,activationId:string)=>requestApi<CatalogImport>({path:workspaceApiPath(workspaceId,`/onboarding/knowledge-activation/${activationId}`)}),
  confirmCatalogImport:(workspaceId:string,activationId:string)=>requestApi<{completed:true;activationId:string;productIds:string[];classification:Record<string,unknown>;premiumJobs:Array<{productId:string;variantId?:string;status:string}>}>({path:workspaceApiPath(workspaceId,`/onboarding/knowledge-activation/${activationId}/confirm`),method:'POST',body:{},timeoutMs:120_000}),
  saveCompanyInformation: (workspaceId: string, input: {
    fullName?:string; hasWebsite?: boolean;
    companyName: string; industry: string | null; countryRegion: string | null; taxId: string | null; address: string | null;
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
  oauthSelfServicePermissions: (workspaceId: string) => requestApi<{ providers: string[] }>({
    path: workspaceApiPath(workspaceId, "/onboarding/oauth-self-service-permissions"),
  }),
  whatsappConnection: (workspaceId: string) => requestApi<{
    provider: "unifyport";
    selfServiceAllowed: boolean;
    customerConnection: { address: string; displayName: string; senderStatus: string; status: string; lastError: string | null } | null;
    pendingConnection?: { accountId: string; authStatus: string; runtimeStatus: string; authPayload: Record<string, unknown> | null; lastError: string | null; phone: string | null } | null;
    adminFallback: { configured: boolean; address: string | null; displayName: string | null; status: string; provider: "unifyport" };
    effectiveMode: "CUSTOMER_OWNED" | "LULU_MANAGED";
  }>({ path: workspaceApiPath(workspaceId, "/onboarding/whatsapp/connection") }),
  connectWhatsApp: (workspaceId: string, input: { phone: string; displayName?: string }) => requestApi<{
    accountId: string;
    auth: { status?: string; auth_payload?: Record<string, unknown> | null; last_error?: string | null };
    connection: {
      provider: "unifyport";
      selfServiceAllowed: boolean;
      customerConnection: { address: string; displayName: string; senderStatus: string; status: string; lastError: string | null } | null;
      pendingConnection?: { accountId: string; authStatus: string; runtimeStatus: string; authPayload: Record<string, unknown> | null; lastError: string | null; phone: string | null } | null;
      adminFallback: { configured: boolean; address: string | null; displayName: string | null; status: string; provider: "unifyport" };
      effectiveMode: "CUSTOMER_OWNED" | "LULU_MANAGED";
    };
  }>({ path: workspaceApiPath(workspaceId, "/onboarding/whatsapp/connect"), method: "POST", body: input }),
  disconnectWhatsApp: (workspaceId: string) => requestApi({
    path: workspaceApiPath(workspaceId, "/onboarding/whatsapp/connection"), method: "DELETE",
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
  createBillingCheckout: (workspaceId: string, input: { planKey: "ai"; successUrl: string; backUrl: string }) => requestApi<{
    planKey: "ai";
    free: boolean;
    checkoutId?: string;
    checkoutUrl?: string;
    status: string;

  }>({ path: workspaceApiPath(workspaceId, "/billing"), method: "POST", body: input }),
};
