import { requestApi } from './client';
import { workspaceApiPath } from './types';
export type ApiPaymentMethod='card'|'alipaycn'|'wechatpay';
export type ApiTopup={id:string;amount:number;currency:'CNY';paymentMethod:ApiPaymentMethod;status:string;checkoutUrl:string|null;qrPayload:string|null;expiresAt:string|null;paidAt:string|null;creditedAt:string|null;createdAt:string};
export type ApiWalletOverview={wallet:{workspaceId:string;currency:'CNY';availableAmount:number;spentAmount:number;totalFundedAmount:number;aiEnabled:boolean;version:number;updatedAt:string};topups:ApiTopup[];packages:number[];currency:'CNY'};
export const apiWalletApi={
  overview:(workspaceId:string)=>requestApi<ApiWalletOverview>({path:workspaceApiPath(workspaceId,'/api-wallet')}),
  createTopup:(workspaceId:string,input:{amount:number;paymentMethod:ApiPaymentMethod;returnUrl:string})=>requestApi<{topup:ApiTopup;packages:number[];aiStartsAutomaticallyAfterPayment:true}>({path:workspaceApiPath(workspaceId,'/api-wallet/topups'),method:'POST',body:{...input,currency:'CNY'}}),
  syncTopup:(workspaceId:string,topupId:string)=>requestApi<ApiTopup>({path:workspaceApiPath(workspaceId,`/api-wallet/topups/${topupId}/sync`),method:'POST',body:{}}),
};
