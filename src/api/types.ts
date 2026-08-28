export type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";

export type Workspace = {
  id: string;
  companyName: string;
  slug: string | null;
  industry: string | null;
  companySize: string | null;
  countryRegion: string | null;
  businessDescription: string | null;
  valueProposition: string | null;
  targetMarket: string | null;
  shortBrandDescription: string | null;
  positioningTags: string[];
  legalForm: string | null;
  foundingYear: number | null;
  employeeCount: number | null;
  annualRevenueRange: string | null;
  businessModelType: string | null;
  companyStage: string | null;
  salesModel: string | null;
  salesCycleDays: number | null;
  primaryIcp: string | null;
  usp: string | null;
  mission: string | null;
  vision: string | null;
  primaryChallenges: string[];
  languages: string[];
  regulatedIndustries: string[];
  onboardingStep: string;
  onboardingCompletedAt: string | null;
  onboardingFileReuploadRequired: boolean;
  onboardingFilesPurgedAt: string | null;
  createdAt: string;
  updatedAt: string;
  role: WorkspaceRole;
  planKey?: "explorer" | "viewer" | "starter" | "ai" | "test";
};

export type WorkspaceBootstrap = {
  workspace: Workspace;
  permissions: { role: WorkspaceRole; canEdit: boolean; canAdminister: boolean };
  capabilities: { aiGeneration: boolean; transactionalEmail: boolean };
  records: {
    total: number;
    byType: Record<string, number>;
    byDomain: Record<string, number>;
  };
  metrics: Array<{
    id: string;
    key: string;
    name: string;
    domain: string;
    unit: string;
    value: string | null;
    recordedAt: string | null;
  }>;
  notifications: { unread: number };
  approvals: { pending: number };
  integrations: Record<string, number>;
  members: { total: number };
  recentActivity: Array<{
    id: string;
    action: string;
    entityType: string;
    entityId: string | null;
    actorId: string | null;
    createdAt: string;
  }>;
};

export type WorkspaceMember = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: WorkspaceRole;
  joinedAt: string;
};

export type WorkspaceInvitation = {
  id: string;
  email: string;
  role: Exclude<WorkspaceRole, "owner">;
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
};

export function workspaceApiPath(workspaceId: string, path = "") {
  return `/workspaces/${encodeURIComponent(workspaceId)}${path}`;
}
