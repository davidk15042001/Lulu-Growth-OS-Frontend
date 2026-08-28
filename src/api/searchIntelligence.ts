import { requestApi } from "./client";
import { getSelectedWorkspaceId } from "./session";

export type SearchChannel = "seo" | "geo" | "aeo";

export type SearchConnectedTarget = {
  provider: "wordpress" | "webflow" | "shopify";
  id: string;
  label: string;
  url: string | null;
};

export type SearchItem = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  stage: string | null;
  updatedAt: string;
  createdAt: string;
  data: Record<string, unknown>;
};

export type SearchChannelSummary = {
  channel: SearchChannel;
  resourceType: string;
  dataSource: "dataforseo";
  connectedTargets: SearchConnectedTarget[];
  metrics: {
    records: number;
    opportunities: number;
    answeredOrMentioned: number;
    siteAudits: number;
  };
  items: SearchItem[];
  lastAnalyzedAt: string | null;
};

export type AppliedSearchTarget = {
  provider: "wordpress" | "webflow" | "shopify";
  targetId: string;
  label: string;
  url: string | null;
  status: "applied" | "drafted";
};

export type AnalyzeSearchInput = {
  locationCode?: number;
  languageCode?: string;
  depth?: number;
  maxKeywords?: number;
  device?: "desktop" | "mobile";
  autoApply?: boolean;
};

export type ApplySearchInput = {
  targetSiteIds?: string[];
  publish?: boolean;
};

export type AnalyzeSearchResult = SearchChannelSummary & {
  analyzedKeywords: string[];
  autoApply: boolean;
  appliedTargets?: AppliedSearchTarget[];
  generatedPage?: {
    title: string;
    slug: string;
    seoTitle: string;
    seoDescription: string;
    html: string;
  };
};

export type ApplySearchResult = {
  channel: SearchChannel;
  appliedTargets: AppliedSearchTarget[];
  publish: boolean;
  page: {
    title: string;
    slug: string;
    seoTitle: string;
    seoDescription: string;
    html: string;
  };
};

function workspacePath(path: string) {
  const workspaceId = getSelectedWorkspaceId();
  if (!workspaceId) throw new Error("No Lulu workspace is selected");
  return `/workspaces/${workspaceId}${path}`;
}

export function getSearchChannelSummary(channel: SearchChannel) {
  return requestApi<SearchChannelSummary>({
    path: workspacePath(`/search-intelligence/${channel}`),
  });
}

export function analyzeSearchChannel(channel: SearchChannel, input: AnalyzeSearchInput) {
  return requestApi<AnalyzeSearchResult>({
    path: workspacePath(`/search-intelligence/${channel}/analyze`),
    method: "POST",
    body: input,
    timeoutMs: 180_000,
  });
}

export function applySearchChannel(channel: SearchChannel, input: ApplySearchInput) {
  return requestApi<ApplySearchResult>({
    path: workspacePath(`/search-intelligence/${channel}/apply`),
    method: "POST",
    body: input,
    timeoutMs: 180_000,
  });
}
