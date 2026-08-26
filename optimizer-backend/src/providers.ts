import type { Issue, OptimizationAction, Provider, SiteConnection } from './types.js';

const providerCapabilities: Record<Provider, { livePublishingLabel: string; supportsAutoMetadata: boolean; supportsStructuredData: boolean }> = {
  wordpress: {
    livePublishingLabel: 'WordPress content and metadata API workflow',
    supportsAutoMetadata: true,
    supportsStructuredData: true,
  },
  webflow: {
    livePublishingLabel: 'Webflow CMS and page-update workflow',
    supportsAutoMetadata: true,
    supportsStructuredData: true,
  },
  shopify: {
    livePublishingLabel: 'Shopify storefront content workflow',
    supportsAutoMetadata: true,
    supportsStructuredData: true,
  },
};

function providerAction(site: SiteConnection, issue: Issue) {
  const capability = providerCapabilities[site.provider];
  if (issue.category === 'content' || issue.category === 'aeo' || issue.category === 'geo') {
    return `${capability.livePublishingLabel}: generate updated answer blocks and content patches`;
  }
  if (issue.category === 'schema') {
    return `${capability.livePublishingLabel}: inject organization, FAQ, and page schema`;
  }
  if (issue.category === 'internal_linking') {
    return `${capability.livePublishingLabel}: add contextual internal links on mapped pages`;
  }
  return `${capability.livePublishingLabel}: update technical optimization settings`;
}

export function buildProviderOptimizations(site: SiteConnection, issues: Issue[]): OptimizationAction[] {
  return issues.map((issue) => ({
    id: `${site.id}-${issue.id}-action`,
    title: `Optimize ${issue.title.toLowerCase()}`,
    description: issue.recommendation,
    status: issue.autoFixable ? 'applied' : 'simulated',
    autoApplied: issue.autoFixable,
    providerAction: providerAction(site, issue),
    expectedImpact: Math.max(8, Math.round(issue.impact * 0.22)),
  }));
}
