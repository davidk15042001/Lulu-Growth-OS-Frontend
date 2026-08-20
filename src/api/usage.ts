import { requestApi } from "./client";

export type WorkspaceCredits = {
  period: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  creditsUsed: number;
  providerCostUsd: number;
  customerCostUsd: number;
  tokensPerCredit: number;
  customerMarkupMultiplier: number;
  model: string;
  pricing: {
    inputPerMillionUsd: number;
    outputPerMillionUsd: number;
  };
};

export const usageApi = {
  credits: (workspaceId: string) =>
    requestApi<WorkspaceCredits>({ path: `/workspaces/${workspaceId}/usage/credits` }),
};
