import { requestApi } from './client';
import { workspaceApiPath } from './types';

export type AdSpendPaymentMethod = 'card' | 'alipaycn' | 'wechatpay';
export type AdSpendTopupStatus = 'CREATED' | 'PENDING_PAYMENT' | 'REQUIRES_CUSTOMER_ACTION' | 'SUCCEEDED' | 'CANCELLED' | 'FAILED' | 'EXPIRED' | 'REFUNDED' | 'CHARGEBACK';

export type AdSpendWallet = {
  workspaceId: string; currency: 'CNY'; availableAmount: number; reservedAmount: number; paymentReservedAmount: number;
  spentAmount: number; refundedAmount: number; reversalDebtAmount: number;
  totalFundedAmount: number; totalFeeAmount: number;
  feeBasisPoints: 400; adsEnabled: boolean; version: number; updatedAt: string;
};

export type AdSpendTopup = {
  id: string; workspaceId: string; netAmount: number; feeBasisPoints: 400; feeAmount: number;
  totalAmount: number; currency: 'CNY'; paymentMethod: AdSpendPaymentMethod; status: AdSpendTopupStatus;
  providerStatus?: string | null; paymentStatus?: string; creditStatus?: string; settlementStatus?: string;
  confirmedAt?: string | null; cancelledAt?: string | null; settledAt?: string | null;
  checkoutUrl: string | null; qrPayload: string | null; expiresAt: string | null;
  paidAt: string | null; creditedAt: string | null; createdAt: string;
};

export type AdSpendOverview = { wallet: AdSpendWallet; topups: AdSpendTopup[] };

export type AdBudgetAuthorization = {
  id: string;
  workspaceId: string;
  createdBy: string;
  provider: string;
  accountId: string;
  campaignId: string;
  currency: string;
  authorizedAmount: number;
  reservedAmount: number;
  consumedAmount: number;
  remainingAmount: number;
  startsAt: string;
  endsAt: string;
  status: 'ACTIVE' | 'EXHAUSTED' | 'REVOKED' | 'EXPIRED';
  reason: string | null;
  metadata: Record<string, unknown>;
  revokedBy: string | null;
  revokedAt: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type GoogleAdsCampaignCreateInput = {
  customerId: string;
  name: string;
  dailyBudgetCny: number;
  adGroupName: string;
  headlines: string[];
  descriptions: string[];
  finalUrls: string[];
  idempotencyKey: string;
  loginCustomerId?: string;
  compliance?: Record<string, unknown>;
};

export type GoogleAdsCampaignCreateResult = {
  operationId: string;
  status: 'PAUSED' | 'CREATING' | 'PROVIDER_APPLIED' | 'SUCCEEDED' | 'FAILED' | 'UNKNOWN';
  idempotent: boolean;
  customerId: string;
  campaignId: string | null;
  campaignResourceName: string | null;
  campaignBudgetResourceName: string | null;
  adGroupResourceName: string | null;
  adGroupAdResourceName: string | null;
  recordId: string | null;
  providerRequestId?: string | null;
};

export const adSpendApi = {
  overview: (workspaceId: string) => requestApi<AdSpendOverview>({ path: workspaceApiPath(workspaceId, '/adspend') }),
  createTopup: (workspaceId: string, input: { amount: number; paymentMethod: AdSpendPaymentMethod; returnUrl: string }) =>
    requestApi<{ topup: AdSpendTopup; charge: { netAmount: number; feeAmount: number; totalAmount: number; feePercent: 4; currency: 'CNY' }; adsStartAutomaticallyAfterPayment: true }>({
      path: workspaceApiPath(workspaceId, '/adspend/topups'), method: 'POST', body: { ...input, currency: 'CNY' },
    }),
  syncTopup: (workspaceId: string, topupId: string) => requestApi<AdSpendTopup>({
    path: workspaceApiPath(workspaceId, `/adspend/topups/${topupId}/sync`), method: 'POST', body: {},
  }),
  listBudgetAuthorizations: (workspaceId: string) => requestApi<AdBudgetAuthorization[]>({
    path: workspaceApiPath(workspaceId, '/adspend/budget-authorizations'),
  }),
  createBudgetAuthorization: (workspaceId: string, input: {
    provider: string;
    accountId: string;
    campaignId: string;
    currency: string;
    amount: number;
    startsAt?: string;
    endsAt: string;
    idempotencyKey: string;
    reason?: string;
  }) => requestApi<AdBudgetAuthorization & { idempotent?: boolean }>({
    path: workspaceApiPath(workspaceId, '/adspend/budget-authorizations'), method: 'POST', body: input,
  }),
  revokeBudgetAuthorization: (workspaceId: string, authorizationId: string, reason?: string) => requestApi<AdBudgetAuthorization & { idempotent?: boolean }>({
    path: workspaceApiPath(workspaceId, `/adspend/budget-authorizations/${encodeURIComponent(authorizationId)}/revoke`),
    method: 'POST',
    body: reason ? { reason } : {},
  }),
  createGoogleAdsCampaign: (workspaceId: string, input: GoogleAdsCampaignCreateInput) => requestApi<GoogleAdsCampaignCreateResult>({
    path: workspaceApiPath(workspaceId, '/adspend/google-ads/campaigns'), method: 'POST', body: input,
  }),
  launchGoogleAdsCampaign: (workspaceId: string, campaignId: string, input: {
    customerId: string;
    campaignBudgetId?: string;
    accountCurrency: 'CNY';
    budgetAmountCny: number;
    authorizationId: string;
    operationKey: string;
    loginCustomerId?: string;
    compliance?: Record<string, unknown>;
  }) => requestApi<unknown>({
    path: workspaceApiPath(workspaceId, `/adspend/google-ads/campaigns/${encodeURIComponent(campaignId)}/launch`), method: 'POST', body: input,
  }),
  pauseGoogleAdsCampaign: (workspaceId: string, campaignId: string, input: { customerId: string; loginCustomerId?: string }) => requestApi<unknown>({
    path: workspaceApiPath(workspaceId, `/adspend/google-ads/campaigns/${encodeURIComponent(campaignId)}/pause`), method: 'POST', body: input,
  }),
};
