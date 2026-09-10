import { requestApi } from './client';
import { workspaceApiPath } from './types';

export type AdSpendPaymentMethod = 'card' | 'alipaycn' | 'wechatpay';
export type AdSpendTopupStatus = 'CREATED' | 'PENDING_PAYMENT' | 'REQUIRES_CUSTOMER_ACTION' | 'SUCCEEDED' | 'CANCELLED' | 'FAILED' | 'EXPIRED' | 'REFUNDED' | 'CHARGEBACK';

export type AdSpendWallet = {
  workspaceId: string; currency: 'CNY'; availableAmount: number; reservedAmount: number;
  spentAmount: number; refundedAmount: number; totalFundedAmount: number; totalFeeAmount: number;
  feeBasisPoints: 400; adsEnabled: boolean; version: number; updatedAt: string;
};

export type AdSpendTopup = {
  id: string; workspaceId: string; netAmount: number; feeBasisPoints: 400; feeAmount: number;
  totalAmount: number; currency: 'CNY'; paymentMethod: AdSpendPaymentMethod; status: AdSpendTopupStatus;
  checkoutUrl: string | null; qrPayload: string | null; expiresAt: string | null;
  paidAt: string | null; creditedAt: string | null; createdAt: string;
};

export type AdSpendOverview = { wallet: AdSpendWallet; topups: AdSpendTopup[] };

export const adSpendApi = {
  overview: (workspaceId: string) => requestApi<AdSpendOverview>({ path: workspaceApiPath(workspaceId, '/adspend') }),
  createTopup: (workspaceId: string, input: { amount: number; paymentMethod: AdSpendPaymentMethod; returnUrl: string }) =>
    requestApi<{ topup: AdSpendTopup; charge: { netAmount: number; feeAmount: number; totalAmount: number; feePercent: 4; currency: 'CNY' }; adsStartAutomaticallyAfterPayment: true }>({
      path: workspaceApiPath(workspaceId, '/adspend/topups'), method: 'POST', body: { ...input, currency: 'CNY' },
    }),
  syncTopup: (workspaceId: string, topupId: string) => requestApi<AdSpendTopup>({
    path: workspaceApiPath(workspaceId, `/adspend/topups/${topupId}/sync`), method: 'POST', body: {},
  }),
};
