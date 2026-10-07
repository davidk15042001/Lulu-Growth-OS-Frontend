import { requestApi } from './client';
import { workspaceApiPath } from './types';

export type CrmDeliveryResourceType =
  | 'crm_companies'
  | 'crm_contacts'
  | 'crm_leads'
  | 'crm_deals'
  | 'crm_tasks'
  | 'sales_leads'
  | 'sales_opportunities'
  | 'sales_tasks';

export type CrmDeliveryTarget = {
  id: string;
  workspaceId: string;
  resourceType: CrmDeliveryResourceType;
  integrationTeamId: string;
  targetName: string;
  enabled: boolean;
  createToolSlug: string;
  createArguments: Record<string, unknown>;
  createResultExternalIdPath: string;
  updateToolSlug: string;
  updateArguments: Record<string, unknown>;
  cancelToolSlug: string;
  cancelArguments: Record<string, unknown>;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CrmDeliveryCandidate = {
  slug: string;
  name: string;
  description: string | null;
  toolkitSlug: string;
  inputParameters: Record<string, unknown> | null;
  outputParameters: Record<string, unknown> | null;
  tags: string[];
};

export type CrmDeliveryTargetInput = Pick<CrmDeliveryTarget,
  'resourceType' | 'integrationTeamId' | 'targetName' | 'enabled' | 'createToolSlug' |
  'createArguments' | 'createResultExternalIdPath' | 'updateToolSlug' | 'updateArguments' |
  'cancelToolSlug' | 'cancelArguments'>;

export type CrmDeliveryProjectionStatus = 'PENDING' | 'SYNCED' | 'CANCELLED' | 'FAILED' | 'AMBIGUOUS';

export type CrmDeliveryProjection = {
  id: string;
  workspaceId: string;
  sourceRecordId: string;
  resourceType: CrmDeliveryResourceType;
  recordName: string;
  recordStatus: string;
  deliveryTargetId: string;
  targetName: string;
  externalResourceId: string | null;
  status: CrmDeliveryProjectionStatus;
  lastOperation: 'CREATE' | 'UPDATE' | 'CANCEL';
  lastErrorCode: string | null;
  updatedAt: string;
};

export const crmApi = {
  deliveryProjections: (workspaceId: string, input: { resourceType?: CrmDeliveryResourceType; status?: CrmDeliveryProjectionStatus; limit?: number } = {}) => {
    const params = new URLSearchParams();
    if (input.resourceType) params.set('resourceType', input.resourceType);
    if (input.status) params.set('status', input.status);
    if (input.limit) params.set('limit', String(input.limit));
    const query = params.toString();
    return requestApi<{ items: CrmDeliveryProjection[]; nextCursor: { beforeUpdatedAt: string; beforeId: string } | null }>({
      path: workspaceApiPath(workspaceId, `/crm/delivery-projections${query ? `?${query}` : ''}`),
    });
  },
  deliveryTargets: (workspaceId: string, resourceType?: CrmDeliveryResourceType) => {
    const query = resourceType ? `?resourceType=${encodeURIComponent(resourceType)}` : '';
    return requestApi<{ items: CrmDeliveryTarget[]; limit: number }>({
      path: workspaceApiPath(workspaceId, `/crm/delivery-targets${query}`),
    });
  },
  deliveryTargetCandidates: (workspaceId: string, teamId: string) => requestApi<{ items: CrmDeliveryCandidate[] }>({
    path: workspaceApiPath(workspaceId, `/crm/delivery-targets/candidates/${encodeURIComponent(teamId)}`),
  }),
  createDeliveryTarget: (workspaceId: string, body: CrmDeliveryTargetInput) => requestApi<CrmDeliveryTarget>({
    path: workspaceApiPath(workspaceId, '/crm/delivery-targets'), method: 'POST', body,
  }),
  updateDeliveryTarget: (workspaceId: string, targetId: string, body: CrmDeliveryTargetInput) => requestApi<CrmDeliveryTarget>({
    path: workspaceApiPath(workspaceId, `/crm/delivery-targets/${encodeURIComponent(targetId)}`), method: 'PATCH', body,
  }),
};
