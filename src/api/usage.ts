import { requestApi } from "./client";

export type WorkspaceCredits = {
  periodStart: string;
  periodEnd: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  creditsUsed: number;
  providerCostUsd: number;
  customerCostUsd: number;
  tokensPerCredit: number;
  customerMarkupMultiplier: number | null;
  model: string;
  pricing: {
    inputPerMillionUsd: number;
    outputPerMillionUsd: number;
  };
  providerPricing?: {
    inputPerMillionUsd: number;
    outputPerMillionUsd: number;
  };
};

export type UsageHistoryItem = {
  id: string;
  action: string;
  operationId: string | null;
  provider: string;
  model: string;
  meteringType: "tokens" | "provider_cost";
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  credits: number;
  providerCostUsd: number;
  customerCostUsd: number;
  createdAt: string;
};

export type UsageHistoryCursor = { beforeCreatedAt: string; beforeId: string };
export type UsageHistoryPage = { items: UsageHistoryItem[]; nextCursor: UsageHistoryCursor | null };

export const usageApi = {
  credits: (workspaceId: string) =>
    requestApi<WorkspaceCredits>({ path: `/workspaces/${workspaceId}/usage/credits` }),
  history: (workspaceId: string, cursor?: UsageHistoryCursor, limit = 25) => {
    const search = new URLSearchParams({ limit: String(limit) });
    if (cursor) {
      search.set("beforeCreatedAt", cursor.beforeCreatedAt);
      search.set("beforeId", cursor.beforeId);
    }
    return requestApi<UsageHistoryPage>({ path: `/workspaces/${workspaceId}/usage/history?${search.toString()}` });
  },
};
