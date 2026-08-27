export type Provider = 'wordpress' | 'webflow' | 'shopify';
export type ExecutionMode = 'mock' | 'live';
export type UserRole = 'viewer' | 'editor' | 'admin';
export type Permission =
  | 'sites:read'
  | 'sites:write'
  | 'runs:execute'
  | 'scheduler:run'
  | 'admin:users:read'
  | 'admin:users:write'
  | 'admin:sessions:read'
  | 'admin:sessions:revoke'
  | 'admin:audit:read'
  | 'admin:metrics:read'
  | 'admin:queue:read'
  | 'admin:migrations:read';
export type CountryCode = 'US' | 'DE' | 'CN' | 'GB' | 'NL' | 'SE' | 'DK' | 'NO' | 'CH' | 'CA' | 'AU' | 'AE' | 'IN' | 'PK' | 'BD';
export type LanguageCode = 'en' | 'de' | 'zh-CN' | 'nl' | 'sv' | 'da' | 'no' | 'ar' | 'hi' | 'ur' | 'bn';

export interface ScoreCard {
  overall: number;
  seo: number;
  geo: number;
  aeo: number;
  technical: number;
  content: number;
  authority: number;
  performance: number;
}

export interface Issue {
  id: string;
  title: string;
  summary: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  impact: number;
  confidence: number;
  autoFixable: boolean;
  evidence: string[];
  recommendation: string;
}

export interface OptimizationAction {
  id: string;
  title: string;
  description: string;
  status: 'proposed' | 'applied' | 'simulated' | 'skipped';
  autoApplied: boolean;
  providerAction: string;
  expectedImpact: number;
}

export interface KeywordInsight {
  keyword: string;
  intent: string;
  opportunity: number;
  searchVolume: number;
  score: number;
  marketKey: string;
  marketLabel: string;
  countryCode: CountryCode;
  countryName: string;
  languageCode: LanguageCode;
  languageLabel: string;
}

export interface SerpInsight {
  keyword: string;
  topFeatures: string[];
  competitorDomains: string[];
  snapshotSource: 'dataforseo' | 'mock';
  marketKey: string;
  marketLabel: string;
  countryCode: CountryCode;
  countryName: string;
  languageCode: LanguageCode;
  languageLabel: string;
}

export interface AiSearchInsight {
  prompt: string;
  answerVisibility: number;
  citationRate: number;
  recommendation: string;
  source: 'dataforseo' | 'mock';
  marketKey: string;
  marketLabel: string;
  countryCode: CountryCode;
  countryName: string;
  languageCode: LanguageCode;
  languageLabel: string;
}

export interface MarketLanguage {
  code: LanguageCode;
  label: string;
  dataForSeoName: string;
}

export interface MarketTarget {
  countryCode: CountryCode;
  countryName: string;
  locationName: string;
  primaryLanguageCode: LanguageCode;
  languages: MarketLanguage[];
}

export interface MarketInsight {
  marketKey: string;
  marketLabel: string;
  countryCode: CountryCode;
  countryName: string;
  languageCode: LanguageCode;
  languageLabel: string;
  seo: number;
  geo: number;
  aeo: number;
  opportunity: number;
  answerVisibility: number;
  citationRate: number;
  source: 'dataforseo' | 'mock';
}

export interface CountryOption {
  code: CountryCode;
  name: string;
  locationName: string;
  primaryLanguage: MarketLanguage;
  englishSupported: boolean;
}

export interface SiteAnalysis {
  scores: ScoreCard;
  issues: Issue[];
  optimizations: OptimizationAction[];
  marketInsights: MarketInsight[];
  keywordInsights: KeywordInsight[];
  serpInsights: SerpInsight[];
  aiInsights: AiSearchInsight[];
  summary: string;
}

export interface SiteRun {
  id: string;
  siteId: string;
  type: 'analysis' | 'optimization' | 'full_cycle';
  status: 'queued' | 'running' | 'completed' | 'failed';
  mode: ExecutionMode;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  summary?: string;
  analysis?: SiteAnalysis;
  error?: string;
}

export interface SiteConnection {
  id: string;
  workspaceId: string;
  ownerUserId: string;
  name: string;
  websiteUrl: string;
  provider: Provider;
  targetKeywords: string[];
  companyGoals: string;
  automationEnabled: boolean;
  automationHourUtc: number;
  targetCountries: CountryCode[];
  marketTargets: MarketTarget[];
  mode: ExecutionMode;
  createdAt: string;
  updatedAt: string;
  lastRunId?: string;
}

export interface CreateSiteInput {
  name: string;
  websiteUrl: string;
  provider: Provider;
  targetKeywords: string[];
  companyGoals: string;
  automationEnabled: boolean;
  automationHourUtc: number;
  targetCountries: CountryCode[];
  marketTargets: MarketTarget[];
  mode?: ExecutionMode;
}

export interface SiteListItem extends SiteConnection {
  lastRun: SiteRun | null;
}

export interface SiteDetailResponse {
  site: SiteConnection;
  lastRun: SiteRun | null;
  runs: SiteRun[];
}

export interface OptionsResponse {
  providers: Provider[];
  modes: ExecutionMode[];
  liveDataForSeo: boolean;
  countries: CountryOption[];
  defaultCountryCodes: CountryCode[];
  languageStrategy: 'local_and_english';
}

export interface SessionContext {
  workspaceId: string;
  userId: string;
  role: UserRole;
  permissions: Permission[];
  email: string;
  name: string;
}

export interface RunQueueJob {
  id: string;
  workspaceId: string;
  siteId: string;
  runId: string;
  type: SiteRun['type'];
  status: 'queued' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  attempts: number;
  error?: string;
}

export interface AppliedMigration {
  version: number;
  name: string;
  applied_at: string;
}

export interface WorkspaceUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  role: UserRole;
  membershipCreatedAt: string;
  activeSessionCount: number;
  mfaEnabled?: boolean;
}

export interface AuthSessionRecord {
  id: string;
  userId: string;
  workspaceId: string;
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string;
  createdByIp?: string;
  lastSeenIp?: string;
  userAgent?: string;
  revokedAt?: string;
  revokedReason?: string;
  replacedBySessionId?: string;
  user?: WorkspaceUser | null;
}

export interface CreateWorkspaceUserInput {
  email: string;
  name: string;
  role: UserRole;
  password: string;
}

export interface UpdateWorkspaceUserInput {
  email?: string;
  name?: string;
  role?: UserRole;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordResetTokenResponse {
  token: string;
  expiresAt: string;
  userId: string;
  email: string;
}

export interface ConfirmPasswordResetInput {
  token: string;
  newPassword: string;
}

export interface LoginInput {
  workspaceId: string;
  email: string;
  password: string;
  mfaCode?: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  sessionId: string;
  session: SessionContext;
  mfaRequired?: boolean;
}

export interface MfaState {
  enabled: boolean;
  pending: boolean;
}

export interface MfaSetupResponse extends MfaState {
  secret: string;
  otpAuthUrl: string;
}
