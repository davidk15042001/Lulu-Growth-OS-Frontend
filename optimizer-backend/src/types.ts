export type Provider = 'wordpress' | 'webflow' | 'shopify';

export type ExecutionMode = 'mock' | 'live';
export type UserRole = 'viewer' | 'editor' | 'admin';

export type CountryCode =
  | 'US'
  | 'DE'
  | 'CN'
  | 'GB'
  | 'NL'
  | 'SE'
  | 'DK'
  | 'NO'
  | 'CH'
  | 'CA'
  | 'AU'
  | 'AE'
  | 'IN'
  | 'PK'
  | 'BD';

export type LanguageCode =
  | 'en'
  | 'de'
  | 'zh-CN'
  | 'nl'
  | 'sv'
  | 'da'
  | 'no'
  | 'ar'
  | 'hi'
  | 'ur'
  | 'bn';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type IssueCategory =
  | 'technical'
  | 'content'
  | 'schema'
  | 'performance'
  | 'internal_linking'
  | 'serp'
  | 'geo'
  | 'aeo';

export type FixStatus = 'proposed' | 'applied' | 'simulated' | 'skipped';

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
  severity: Severity;
  category: IssueCategory;
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
  status: FixStatus;
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

export interface AppState {
  sites: SiteConnection[];
  runs: SiteRun[];
}

export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  passwordHash?: string;
  passwordUpdatedAt?: string;
}

export interface AuthSession {
  id: string;
  userId: string;
  workspaceId: string;
  refreshTokenHash: string;
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string;
  createdByIp?: string;
  lastSeenIp?: string;
  userAgent?: string;
  revokedAt?: string;
  revokedReason?: string;
  replacedBySessionId?: string;
}

export type AuditActorType = 'user' | 'system' | 'anonymous';
export type AuditOutcome = 'success' | 'failure';

export interface AuditLogEntry {
  id: string;
  workspaceId?: string;
  actorType: AuditActorType;
  actorUserId?: string;
  actorEmail?: string;
  action: string;
  targetType: string;
  targetId?: string;
  outcome: AuditOutcome;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  createdAt: string;
  details?: Record<string, unknown>;
}

export interface PasswordResetToken {
  id: string;
  userId: string;
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
  revokedAt?: string;
  createdByUserId?: string;
}

export interface WorkspaceMembership {
  workspaceId: string;
  userId: string;
  role: UserRole;
  createdAt: string;
}

export interface RequestContext {
  workspaceId: string;
  userId: string;
  role: UserRole;
  email: string;
  name: string;
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
  marketTargets?: MarketTarget[];
  mode?: ExecutionMode;
}

export interface UpdateSiteInput {
  name?: string;
  websiteUrl?: string;
  provider?: Provider;
  targetKeywords?: string[];
  companyGoals?: string;
  automationEnabled?: boolean;
  automationHourUtc?: number;
  targetCountries?: CountryCode[];
  marketTargets?: MarketTarget[];
  mode?: ExecutionMode;
}
