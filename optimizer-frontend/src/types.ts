export type Provider = 'wordpress' | 'webflow' | 'shopify';
export type ExecutionMode = 'mock' | 'live';

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
}
