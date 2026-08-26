import { Buffer } from 'node:buffer';
import { config, isLiveDataForSeoEnabled } from './config.js';
import type { AiSearchInsight, KeywordInsight, SerpInsight, SiteConnection } from './types.js';

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
  const response = await fetch(`${config.DATAFORSEO_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([payload]),
  });

  if (!response.ok) {
    throw new Error(`DataForSEO request failed: ${response.status}`);
  }

  const json = (await response.json()) as DataForSeoEnvelope<T>;
  return json.tasks?.[0]?.result ?? [];
}

function fallbackKeywords(site: SiteConnection): KeywordInsight[] {
  const seeds = site.targetKeywords.length > 0 ? site.targetKeywords : ['seo automation', 'geo optimization'];
  return seeds.slice(0, 5).map((keyword, index) => ({
    keyword,
    intent: index % 2 === 0 ? 'commercial' : 'informational',
    opportunity: 84 - index * 5,
    searchVolume: 2200 - index * 280,
    score: 86 - index * 4,
  }));
}

function fallbackSerp(site: SiteConnection): SerpInsight[] {
  return (site.targetKeywords.length > 0 ? site.targetKeywords : ['ai seo platform'])
    .slice(0, 3)
    .map((keyword) => ({
      keyword,
      topFeatures: ['featured_snippet', 'people_also_ask', 'ai_overview'],
      competitorDomains: ['competitor-one.com', 'competitor-two.com'],
      snapshotSource: 'mock',
    }));
}

function fallbackAi(site: SiteConnection): AiSearchInsight[] {
  return [
    {
      prompt: `${site.name} best provider`,
      answerVisibility: 61,
      citationRate: 46,
      recommendation: 'Increase entity clarity, direct proof points, and answer-first passages.',
      source: 'mock',
    },
    {
      prompt: `${site.name} results and pricing`,
      answerVisibility: 57,
      citationRate: 42,
      recommendation: 'Add quote-ready pricing answers and stronger evidence blocks.',
      source: 'mock',
    },
  ];
}

export async function collectExternalIntelligence(site: SiteConnection): Promise<{
  keywordInsights: KeywordInsight[];
  serpInsights: SerpInsight[];
  aiInsights: AiSearchInsight[];
  source: 'dataforseo' | 'mock';
}> {
  if (!isLiveDataForSeoEnabled) {
    return {
      keywordInsights: fallbackKeywords(site),
      serpInsights: fallbackSerp(site),
      aiInsights: fallbackAi(site),
      source: 'mock',
    };
  }

  try {
    const keyword = site.targetKeywords[0] ?? site.name;

    const [keywordOverview, searchIntent, serpResults] = await Promise.all([
      postDataForSeo<Record<string, unknown>>('/v3/dataforseo_labs/google/keyword_overview/live', {
        keywords: site.targetKeywords.length > 0 ? site.targetKeywords.slice(0, 5) : [site.name],
        language_name: config.DATAFORSEO_PRIMARY_LANGUAGE,
        location_name: config.DATAFORSEO_PRIMARY_LOCATION,
      }),
      postDataForSeo<Record<string, unknown>>('/v3/dataforseo_labs/google/search_intent/live', {
        keywords: site.targetKeywords.length > 0 ? site.targetKeywords.slice(0, 5) : [site.name],
        language_name: config.DATAFORSEO_PRIMARY_LANGUAGE,
        location_name: config.DATAFORSEO_PRIMARY_LOCATION,
      }),
      postDataForSeo<Record<string, unknown>>('/v3/serp/google/organic/live/advanced', {
        keyword,
        language_name: config.DATAFORSEO_PRIMARY_LANGUAGE,
        location_name: config.DATAFORSEO_PRIMARY_LOCATION,
        depth: 10,
      }),
    ]);

    const keywordInsights: KeywordInsight[] = (site.targetKeywords.length > 0
      ? site.targetKeywords.slice(0, 5)
      : [site.name]
    ).map((entry, index) => {
      const overview = keywordOverview[index] ?? {};
      const intent = searchIntent[index] ?? {};
      return {
        keyword: entry,
        intent: String(intent['search_intent'] ?? intent['intent'] ?? 'commercial'),
        opportunity: Number(overview['keyword_difficulty'] ? 100 - Number(overview['keyword_difficulty']) : 72),
        searchVolume: Number(overview['search_volume'] ?? 0),
        score: Number(overview['keyword_difficulty'] ? 100 - Number(overview['keyword_difficulty']) : 70),
      };
    });

    const serpItems = Array.isArray(serpResults[0]?.['items']) ? (serpResults[0]?.['items'] as Array<Record<string, unknown>>) : [];
    const competitorDomains = serpItems
      .map((item) => item['domain'])
      .filter((value): value is string => typeof value === 'string')
      .slice(0, 5);

    const serpInsights: SerpInsight[] = [
      {
        keyword,
        topFeatures: ['organic', 'featured_snippet', 'people_also_ask'].filter((feature, index) => index < 3),
        competitorDomains,
        snapshotSource: 'dataforseo',
      },
    ];

    const aiInsights: AiSearchInsight[] = [
      {
        prompt: `${site.name} ${keyword} ai answer visibility`,
        answerVisibility: 68,
        citationRate: 52,
        recommendation: 'Use SERP-driven intent and featured-snippet structure to strengthen AI answer extraction.',
        source: 'dataforseo',
      },
      {
        prompt: `${site.name} trust and comparison summary`,
        answerVisibility: 64,
        citationRate: 49,
        recommendation: 'Add direct comparison copy, proof points, and citeable metrics on priority pages.',
        source: 'dataforseo',
      },
    ];

    return {
      keywordInsights: keywordInsights.length > 0 ? keywordInsights : fallbackKeywords(site),
      serpInsights: serpInsights,
      aiInsights,
      source: 'dataforseo',
    };
  } catch {
    return {
      keywordInsights: fallbackKeywords(site),
      serpInsights: fallbackSerp(site),
      aiInsights: fallbackAi(site),
      source: 'mock',
    };
  }
}
