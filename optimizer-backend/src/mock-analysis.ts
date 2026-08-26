import type {
  AiSearchInsight,
  KeywordInsight,
  OptimizationAction,
  Provider,
  ScoreCard,
  SerpInsight,
  SiteAnalysis,
  SiteConnection,
  Issue,
} from './types.js';

function baseScores(provider: Provider): ScoreCard {
  if (provider === 'shopify') {
    return {
      overall: 72,
      seo: 75,
      geo: 68,
      aeo: 67,
      technical: 80,
      content: 69,
      authority: 61,
      performance: 74,
    };
  }
  if (provider === 'webflow') {
    return {
      overall: 76,
      seo: 79,
      geo: 73,
      aeo: 71,
      technical: 82,
      content: 72,
      authority: 64,
      performance: 78,
    };
  }
  return {
    overall: 74,
    seo: 77,
    geo: 70,
    aeo: 69,
    technical: 79,
    content: 71,
    authority: 62,
    performance: 75,
  };
}

function buildIssues(site: SiteConnection): Issue[] {
  return [
    {
      id: `${site.id}-schema-faq`,
      title: 'Missing FAQ structured data on revenue pages',
      summary: 'High-intent pages are not exposing answer-ready schema blocks for AI and snippet extraction.',
      severity: 'high',
      category: 'schema',
      impact: 86,
      confidence: 89,
      autoFixable: true,
      evidence: ['FAQ schema absent on top landing pages', 'No question-answer blocks in crawl summary'],
      recommendation: 'Inject FAQ schema plus compact answer blocks tied to target queries.',
    },
    {
      id: `${site.id}-geo-citations`,
      title: 'Brand entities are weak in AI-search summaries',
      summary: 'The brand is not consistently represented with citation-friendly summaries, proof points, and direct claims.',
      severity: 'high',
      category: 'geo',
      impact: 82,
      confidence: 78,
      autoFixable: false,
      evidence: ['Low mention clarity in mock AI visibility benchmark', 'No structured proof-point section detected'],
      recommendation: 'Add entity summary sections, trust proof, and brand-specific answer passages.',
    },
    {
      id: `${site.id}-internal-links`,
      title: 'Internal linking depth is too shallow for priority commercial pages',
      summary: 'Priority pages do not receive enough contextual internal links from supporting pages.',
      severity: 'medium',
      category: 'internal_linking',
      impact: 73,
      confidence: 84,
      autoFixable: true,
      evidence: ['Only 2 supporting links into core page cluster', 'Anchor diversity is narrow'],
      recommendation: 'Create contextual internal links from supporting content to core pages with commercial intent anchors.',
    },
    {
      id: `${site.id}-aeo-snippets`,
      title: 'Answer-engine passages are too long and not extractable',
      summary: 'Pages have long blocks of content without concise answer-first formatting.',
      severity: 'medium',
      category: 'aeo',
      impact: 70,
      confidence: 81,
      autoFixable: true,
      evidence: ['Definitions exceed snippet-friendly length', 'No direct-answer sections near H2 blocks'],
      recommendation: 'Rewrite primary answer passages into short answer-first blocks under matching headings.',
    },
  ];
}

function buildOptimizations(site: SiteConnection): OptimizationAction[] {
  return [
    {
      id: `${site.id}-opt-meta`,
      title: 'Regenerate title and meta templates',
      description: 'Create clearer search-intent-aligned title and description patterns for priority pages.',
      status: 'applied',
      autoApplied: true,
      providerAction: `Prepared ${site.provider} metadata optimization payload`,
      expectedImpact: 18,
    },
    {
      id: `${site.id}-opt-schema`,
      title: 'Deploy FAQ and organization schema',
      description: 'Add FAQ, organization, and key page schema for better search and AI citations.',
      status: 'applied',
      autoApplied: true,
      providerAction: `Generated ${site.provider} schema optimization package`,
      expectedImpact: 22,
    },
    {
      id: `${site.id}-opt-content`,
      title: 'Rewrite answer blocks for top commercial queries',
      description: 'Transform long sections into concise, answer-engine-friendly passages.',
      status: 'simulated',
      autoApplied: false,
      providerAction: `Generated review-required content rewrite suggestions for ${site.provider}`,
      expectedImpact: 19,
    },
  ];
}

function buildKeywordInsights(site: SiteConnection): KeywordInsight[] {
  const seeds = site.targetKeywords.length > 0 ? site.targetKeywords : ['seo automation', 'ai optimization'];
  return seeds.slice(0, 5).map((keyword, index) => ({
    keyword,
    intent: index % 2 === 0 ? 'commercial' : 'informational',
    opportunity: Math.max(58, 91 - index * 6),
    searchVolume: 1800 - index * 240,
    score: 88 - index * 5,
  }));
}

function buildSerpInsights(site: SiteConnection): SerpInsight[] {
  const seeds = site.targetKeywords.length > 0 ? site.targetKeywords : ['ai seo platform', 'answer engine optimization'];
  return seeds.slice(0, 3).map((keyword) => ({
    keyword,
    topFeatures: ['featured_snippet', 'people_also_ask', 'ai_overview'],
    competitorDomains: ['competitor-one.com', 'competitor-two.com', new URL(site.websiteUrl).hostname],
    snapshotSource: 'mock',
  }));
}

function buildAiInsights(site: SiteConnection): AiSearchInsight[] {
  return [
    {
      prompt: `${site.name} best solution`,
      answerVisibility: 63,
      citationRate: 48,
      recommendation: 'Improve direct entity-summary blocks and citeable proof points on commercial pages.',
      source: 'mock',
    },
    {
      prompt: `${site.name} pricing and results`,
      answerVisibility: 58,
      citationRate: 43,
      recommendation: 'Add concise pricing explainer, FAQ answers, and metrics-driven benefit copy.',
      source: 'mock',
    },
  ];
}

export function createMockAnalysis(site: SiteConnection): SiteAnalysis {
  const scores = baseScores(site.provider);
  const issues = buildIssues(site);
  const optimizations = buildOptimizations(site);
  return {
    scores,
    issues,
    optimizations,
    keywordInsights: buildKeywordInsights(site),
    serpInsights: buildSerpInsights(site),
    aiInsights: buildAiInsights(site),
    summary: `${site.name} has strong technical foundations but is under-optimized for AI-search visibility, answer extraction, and authority signaling. The fastest gains come from schema deployment, answer-first content blocks, and deeper internal linking around revenue pages.`,
  };
}
