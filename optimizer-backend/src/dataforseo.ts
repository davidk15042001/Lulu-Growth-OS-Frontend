import { Buffer } from 'node:buffer';
import { config, isLiveDataForSeoEnabled } from './config.js';
import { flattenMarketTargets } from './markets.js';
import type { AiSearchInsight, KeywordInsight, MarketInsight, SerpInsight, SiteConnection } from './types.js';

type DataForSeoEnvelope<T> = {
  tasks?: Array<{
    result?: T[];
  }>;
};

function authHeader() {
  const token = Buffer.from(
    `${config.DATAFORSEO_LOGIN ?? ''}:${config.DATAFORSEO_PASSWORD ?? ''}`,
  ).toString('base64');
  return `Basic ${token}`;
}

async function postDataForSeo<T>(path: string, payload: object): Promise<T[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.DATAFORSEO_TIMEOUT_MS);
  const response = await fetch(`${config.DATAFORSEO_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([payload]),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    throw new Error(`DataForSEO request failed: ${response.status}`);
  }

  const json = (await response.json()) as DataForSeoEnvelope<T>;
  return json.tasks?.[0]?.result ?? [];
}

function fallbackKeywords(site: SiteConnection): KeywordInsight[] {
  const seeds = site.targetKeywords.length > 0 ? site.targetKeywords : ['seo automation', 'geo optimization'];
  return flattenMarketTargets(site).flatMap((market, marketIndex) =>
    seeds.slice(0, 2).map((keyword, index) => ({
      keyword,
      intent: index % 2 === 0 ? 'commercial' : 'informational',
      opportunity: Math.max(52, 84 - marketIndex * 2 - index * 4),
      searchVolume: Math.max(220, 2200 - marketIndex * 110 - index * 250),
      score: Math.max(50, 86 - marketIndex * 2 - index * 3),
      marketKey: market.marketKey,
      marketLabel: market.marketLabel,
      countryCode: market.countryCode,
      countryName: market.countryName,
      languageCode: market.languageCode,
      languageLabel: market.languageLabel,
    })),
  );
}

function fallbackSerp(site: SiteConnection): SerpInsight[] {
  const keyword = site.targetKeywords[0] ?? 'ai seo platform';
  return flattenMarketTargets(site).map((market) => ({
    keyword,
    topFeatures: ['featured_snippet', 'people_also_ask', 'ai_overview'],
    competitorDomains: ['competitor-one.com', 'competitor-two.com'],
    snapshotSource: 'mock',
    marketKey: market.marketKey,
    marketLabel: market.marketLabel,
    countryCode: market.countryCode,
    countryName: market.countryName,
    languageCode: market.languageCode,
    languageLabel: market.languageLabel,
  }));
}

function fallbackAi(site: SiteConnection): AiSearchInsight[] {
  return flattenMarketTargets(site).map((market, index) => ({
    prompt: `${site.name} ${market.countryName} ${market.languageLabel} answer visibility`,
    answerVisibility: Math.max(44, 61 - index),
    citationRate: Math.max(35, 46 - index),
    recommendation: 'Increase entity clarity, direct proof points, and answer-first passages.',
    source: 'mock',
    marketKey: market.marketKey,
    marketLabel: market.marketLabel,
    countryCode: market.countryCode,
    countryName: market.countryName,
    languageCode: market.languageCode,
    languageLabel: market.languageLabel,
  }));
}

function buildMarketInsights(
  keywordInsights: KeywordInsight[],
  aiInsights: AiSearchInsight[],
  source: 'dataforseo' | 'mock',
): MarketInsight[] {
  const aiByMarket = new Map(aiInsights.map((entry) => [entry.marketKey, entry]));
  const keywordByMarket = new Map<string, KeywordInsight>();
  for (const item of keywordInsights) {
    if (!keywordByMarket.has(item.marketKey)) keywordByMarket.set(item.marketKey, item);
  }
  return Array.from(keywordByMarket.values()).map((keyword) => {
    const ai = aiByMarket.get(keyword.marketKey);
    const opportunity = keyword.opportunity;
    const answerVisibility = ai?.answerVisibility ?? 54;
    const citationRate = ai?.citationRate ?? 44;
    return {
      marketKey: keyword.marketKey,
      marketLabel: keyword.marketLabel,
      countryCode: keyword.countryCode,
      countryName: keyword.countryName,
      languageCode: keyword.languageCode,
      languageLabel: keyword.languageLabel,
      seo: Math.max(45, Math.min(98, 58 + Math.round(opportunity * 0.28))),
      geo: Math.max(42, Math.min(98, 44 + Math.round(answerVisibility * 0.42))),
      aeo: Math.max(42, Math.min(98, 46 + Math.round(citationRate * 0.44))),
      opportunity,
      answerVisibility,
      citationRate,
      source,
    };
  });
}

export async function collectExternalIntelligence(site: SiteConnection): Promise<{
  marketInsights: MarketInsight[];
  keywordInsights: KeywordInsight[];
  serpInsights: SerpInsight[];
  aiInsights: AiSearchInsight[];
  source: 'dataforseo' | 'mock';
}> {
  if (!isLiveDataForSeoEnabled) {
    const keywordInsights = fallbackKeywords(site);
    const aiInsights = fallbackAi(site);
    return {
      marketInsights: buildMarketInsights(keywordInsights, aiInsights, 'mock'),
      keywordInsights,
      serpInsights: fallbackSerp(site),
      aiInsights,
      source: 'mock',
    };
  }

  try {
    const seedKeywords = site.targetKeywords.length > 0 ? site.targetKeywords.slice(0, 3) : [site.name];
    const marketResults = await Promise.all(
      flattenMarketTargets(site).map(async (market) => {
        const [keywordOverview, searchIntent, serpResults] = await Promise.all([
          postDataForSeo<Record<string, unknown>>('/v3/dataforseo_labs/google/keyword_overview/live', {
            keywords: seedKeywords,
            language_name: market.dataForSeoLanguage,
            location_name: market.locationName,
          }),
          postDataForSeo<Record<string, unknown>>('/v3/dataforseo_labs/google/search_intent/live', {
            keywords: seedKeywords,
            language_name: market.dataForSeoLanguage,
            location_name: market.locationName,
          }),
          postDataForSeo<Record<string, unknown>>('/v3/serp/google/organic/live/advanced', {
            keyword: seedKeywords[0],
            language_name: market.dataForSeoLanguage,
            location_name: market.locationName,
            depth: 10,
          }),
        ]);

        const keywordInsights: KeywordInsight[] = seedKeywords.map((entry, index) => {
          const overview = keywordOverview[index] ?? {};
          const intent = searchIntent[index] ?? {};
          return {
            keyword: entry,
            intent: String(intent['search_intent'] ?? intent['intent'] ?? 'commercial'),
            opportunity: Number(
              overview['keyword_difficulty'] ? 100 - Number(overview['keyword_difficulty']) : 72,
            ),
            searchVolume: Number(overview['search_volume'] ?? 0),
            score: Number(
              overview['keyword_difficulty'] ? 100 - Number(overview['keyword_difficulty']) : 70,
            ),
            marketKey: market.marketKey,
            marketLabel: market.marketLabel,
            countryCode: market.countryCode,
            countryName: market.countryName,
            languageCode: market.languageCode,
            languageLabel: market.languageLabel,
          };
        });

        const serpItems = Array.isArray(serpResults[0]?.['items'])
          ? (serpResults[0]?.['items'] as Array<Record<string, unknown>>)
          : [];
        const competitorDomains = serpItems
          .map((item) => item['domain'])
          .filter((value): value is string => typeof value === 'string')
          .slice(0, 5);

        const serpInsights: SerpInsight[] = [{
          keyword: seedKeywords[0],
          topFeatures: ['organic', 'featured_snippet', 'people_also_ask'],
          competitorDomains,
          snapshotSource: 'dataforseo',
          marketKey: market.marketKey,
          marketLabel: market.marketLabel,
          countryCode: market.countryCode,
          countryName: market.countryName,
          languageCode: market.languageCode,
          languageLabel: market.languageLabel,
        }];

        const leadKeyword = keywordInsights[0];
        const opportunity = leadKeyword?.opportunity ?? 72;
        const aiInsights: AiSearchInsight[] = [{
          prompt: `${site.name} ${market.countryName} ${market.languageLabel} answer visibility`,
          answerVisibility: Math.max(44, Math.min(92, Math.round(46 + opportunity * 0.32))),
          citationRate: Math.max(38, Math.min(88, Math.round(40 + opportunity * 0.24))),
          recommendation: 'Use SERP-driven intent, local proof points, and featured-snippet formatting to strengthen AI answer extraction.',
          source: 'dataforseo',
          marketKey: market.marketKey,
          marketLabel: market.marketLabel,
          countryCode: market.countryCode,
          countryName: market.countryName,
          languageCode: market.languageCode,
          languageLabel: market.languageLabel,
        }];

        return { keywordInsights, serpInsights, aiInsights };
      }),
    );

    const keywordInsights = marketResults.flatMap((entry) => entry.keywordInsights);
    const serpInsights = marketResults.flatMap((entry) => entry.serpInsights);
    const aiInsights = marketResults.flatMap((entry) => entry.aiInsights);

    return {
      marketInsights: buildMarketInsights(keywordInsights, aiInsights, 'dataforseo'),
      keywordInsights: keywordInsights.length > 0 ? keywordInsights : fallbackKeywords(site),
      serpInsights,
      aiInsights,
      source: 'dataforseo',
    };
  } catch (error) {
    console.warn('DataForSEO live request failed, falling back to mock intelligence.', error);
    const keywordInsights = fallbackKeywords(site);
    const aiInsights = fallbackAi(site);
    return {
      marketInsights: buildMarketInsights(keywordInsights, aiInsights, 'mock'),
      keywordInsights,
      serpInsights: fallbackSerp(site),
      aiInsights,
      source: 'mock',
    };
  }
}
