export type Provider = 'wordpress' | 'webflow' | 'shopify';
export type ExecutionMode = 'mock' | 'live';
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
