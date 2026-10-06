import { requestApi } from './client';
import { workspaceApiPath } from './types';
export type ApiPaymentMethod='alipaycn'|'wechatpay';
export type ApiTopup={id:string;amount:string;currency:'CNY';paymentMethod:ApiPaymentMethod|'legacy';provider?:'airwallex'|string;status:string;providerStatus?:string|null;paymentStatus?:string;creditStatus?:string;settlementStatus?:string;confirmedAt?:string|null;cancelledAt?:string|null;settledAt?:string|null;merchantOrderId?:string|null;providerInvoiceId?:string|null;providerPaymentIntentId?:string|null;checkoutUrl:string|null;qrPayload:string|null;expiresAt:string|null;paidAt:string|null;creditedAt:string|null;createdAt:string};
export type ComposioUsageSummary={toolCalls:number;triggers:number;chargedAmountCny:string;toolCallPriceCny:string;triggerPriceCny:string};
export type ApiWalletOverview={wallet:{workspaceId:string;currency:'CNY';availableAmount:string;reservedAmount:string;paymentReservedAmount:string;spentAmount:string;reversalDebtAmount:string;totalFundedAmount:string;aiEnabled:boolean;version:number;updatedAt:string};topups:ApiTopup[];composioUsage:ComposioUsageSummary;packages:string[];currency:'CNY'};
export const apiWalletApi={
  overview:(workspaceId:string)=>requestApi<ApiWalletOverview>({path:workspaceApiPath(workspaceId,'/api-wallet')}),
  createTopup:(workspaceId:string,input:{amount:string;paymentMethod:ApiPaymentMethod;returnUrl:string})=>requestApi<{topup:ApiTopup;packages:string[];aiStartsAutomaticallyAfterPayment:true}>({path:workspaceApiPath(workspaceId,'/api-wallet/topups'),method:'POST',body:{...input,currency:'CNY'}}),
  syncTopup:(workspaceId:string,topupId:string)=>requestApi<ApiTopup>({path:workspaceApiPath(workspaceId,`/api-wallet/topups/${topupId}/sync`),method:'POST',body:{}}),
};
