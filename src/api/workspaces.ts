import { requestApi } from "./client";
import type { Workspace, WorkspaceBootstrap } from "./types";
import { workspaceApiPath } from "./types";

export type CreateWorkspaceInput = {
  companyName: string;
  slug?: string;
  industry?: string | null;
  companySize?: string | null;
  countryRegion?: string | null;
  taxId?: string | null;
  address?: string | null;
};

export type UpdateWorkspaceInput = Partial<CreateWorkspaceInput> & {
  businessDescription?: string | null;
  valueProposition?: string | null;
  targetMarket?: string | null;
  shortBrandDescription?: string | null;
  positioningTags?: string[];
  legalForm?: string | null;
  foundingYear?: number | null;
  employeeCount?: number | null;
  annualRevenueRange?: string | null;
  businessModelType?: string | null;
  companyStage?: string | null;
  salesModel?: string | null;
  salesCycleDays?: number | null;
  primaryIcp?: string | null;
  usp?: string | null;
  mission?: string | null;
  vision?: string | null;
  primaryChallenges?: string[];
  languages?: string[];
  regulatedIndustries?: string[];
};

export const workspaceApi = {
  list: (signal?: AbortSignal) => requestApi<{ items: Workspace[] }>({ path: "/workspaces", signal }),
  create: (input: CreateWorkspaceInput) => requestApi<Workspace>({ path: "/workspaces", method: "POST", body: input }),
  get: (workspaceId: string) => requestApi<Workspace>({ path: workspaceApiPath(workspaceId) }),
  update: (workspaceId: string, input: UpdateWorkspaceInput) => requestApi<Workspace>({
    path: workspaceApiPath(workspaceId), method: "PATCH", body: input,
  }),
  acceptInvitation: (token: string) => requestApi<{ workspaceId: string }>({
    path: `/workspaces/invitations/${encodeURIComponent(token)}/accept`, method: "POST", body: {},
  }),
  bootstrap: (workspaceId: string, signal?: AbortSignal) => requestApi<WorkspaceBootstrap>({
    path: workspaceApiPath(workspaceId, "/bootstrap"), signal,
  }),
};

export type EffectiveEntitlement = { key: string; enabled: boolean; limit: string | null; source: string; reason: string };
export type WorkspaceBusinessIdentity = {
  workspaceId: string;
  organization: { id: string; name: string; displayName: string | null; country: string | null; status: string } | null;
  legalEntity: { id: string; legalName: string; registrationCountry: string | null; registrationNumber: string | null; legalForm: string | null; taxIdentifier: string | null; registeredAddress: string | null; status: string; verificationStatus: string } | null;
  factory: { id: string; name: string; factoryCode: string | null; country: string | null; region: string | null; city: string | null; timezone: string | null; defaultCurrency: string | null; defaultLanguage: string | null; status: string } | null;
  brands: Array<{ id: string; name: string; domain: string | null; logoUrl: string | null; status: string }>;
  locations: Array<{ id: string; type: string; country: string | null; region: string | null; city: string | null; timezone: string | null; status: string }>;
};

export const workspaceFoundationApi = {
  entitlements: (workspaceId: string, signal?: AbortSignal) => requestApi<Record<string, EffectiveEntitlement>>({ path: workspaceApiPath(workspaceId, "/entitlements"), signal }),
  addEntitlementOverride: (workspaceId: string, input: { entitlementKey: string; enabled?: boolean; limitValue?: number | null; reason: string; expiresAt?: string | null }) => requestApi<{ id: string }>({ path: workspaceApiPath(workspaceId, "/entitlements"), method: "POST", body: input }),
  removeEntitlementOverride: (workspaceId: string, overrideId: string) => requestApi<{ id: string }>({ path: workspaceApiPath(workspaceId, `/entitlements/overrides/${encodeURIComponent(overrideId)}`), method: "DELETE" }),
  businessIdentity: (workspaceId: string, signal?: AbortSignal) => requestApi<WorkspaceBusinessIdentity>({ path: workspaceApiPath(workspaceId, "/business-identity"), signal }),
};
