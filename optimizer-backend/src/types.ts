export type Provider = 'wordpress' | 'webflow' | 'shopify';

export type ExecutionMode = 'mock' | 'live';

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
}

export interface SerpInsight {
  keyword: string;
  topFeatures: string[];
  competitorDomains: string[];
  snapshotSource: 'dataforseo' | 'mock';
}

export interface AiSearchInsight {
  prompt: string;
  answerVisibility: number;
  citationRate: number;
  recommendation: string;
  source: 'dataforseo' | 'mock';
}

export interface SiteAnalysis {
  scores: ScoreCard;
  issues: Issue[];
  optimizations: OptimizationAction[];
  keywordInsights: KeywordInsight[];
  serpInsights: SerpInsight[];
  aiInsights: AiSearchInsight[];
  summary: string;
}

export interface SiteConnection {
  id: string;
  name: string;
  websiteUrl: string;
  provider: Provider;
  targetKeywords: string[];
  companyGoals: string;
  automationEnabled: boolean;
  automationHourUtc: number;
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

export interface CreateSiteInput {
  name: string;
  websiteUrl: string;
  provider: Provider;
  targetKeywords: string[];
  companyGoals: string;
  automationEnabled: boolean;
  automationHourUtc: number;
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
  mode?: ExecutionMode;
}
