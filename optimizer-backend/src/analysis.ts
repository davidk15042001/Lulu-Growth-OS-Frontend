import { createMockAnalysis } from './mock-analysis.js';
import { collectExternalIntelligence } from './dataforseo.js';
import { flattenMarketTargets } from './markets.js';
import { buildProviderOptimizations } from './providers.js';
import type { ScoreCard, SiteAnalysis, SiteConnection } from './types.js';

function normalizeScore(value: number) {
  return Math.min(99, Math.max(35, Math.round(value)));
}

function scoreFromSignals(
  base: ScoreCard,
  keywordOpportunity: number,
  aiVisibility: number,
  citationRate: number,
): ScoreCard {
  const seo = normalizeScore(base.seo + (keywordOpportunity - 70) * 0.18);
  const geo = normalizeScore(base.geo + (aiVisibility - 55) * 0.25);
  const aeo = normalizeScore(base.aeo + (citationRate - 45) * 0.28);
  const authority = normalizeScore(base.authority + (citationRate - 45) * 0.16);
  const content = normalizeScore(base.content + (keywordOpportunity - 70) * 0.1);
  const technical = base.technical;
  const performance = base.performance;
  const overall = normalizeScore(
    (seo + geo + aeo + authority + content + technical + performance) / 7,
  );

  return {
    overall,
    seo,
    geo,
    aeo,
    technical,
    content,
    authority,
    performance,
  };
}

export async function analyzeSite(site: SiteConnection): Promise<SiteAnalysis> {
  const base = createMockAnalysis(site);
  const external = await collectExternalIntelligence(site);

  const keywordOpportunity =
    external.keywordInsights.reduce((sum, item) => sum + item.opportunity, 0) /
      Math.max(1, external.keywordInsights.length) || 70;
  const aiVisibility =
    external.aiInsights.reduce((sum, item) => sum + item.answerVisibility, 0) /
      Math.max(1, external.aiInsights.length) || 55;
  const citationRate =
    external.aiInsights.reduce((sum, item) => sum + item.citationRate, 0) /
      Math.max(1, external.aiInsights.length) || 45;

  const scores = scoreFromSignals(base.scores, keywordOpportunity, aiVisibility, citationRate);
  const optimizations = buildProviderOptimizations(site, base.issues);
  const liveSummaryPrefix =
    external.source === 'dataforseo'
      ? 'DataForSEO live intelligence is active.'
      : 'Running in mock intelligence mode because live DataForSEO credentials are missing or unavailable.';
  const markets = flattenMarketTargets(site);
  const marketSummary =
    markets.length > 0
      ? ` Monitoring ${markets.length} active market packs across ${site.targetCountries.length} countries.`
      : '';

  return {
    ...base,
    scores,
    marketInsights: external.marketInsights,
    keywordInsights: external.keywordInsights,
    serpInsights: external.serpInsights,
    aiInsights: external.aiInsights,
    optimizations,
    summary: `${liveSummaryPrefix} ${base.summary}${marketSummary}`,
  };
}
