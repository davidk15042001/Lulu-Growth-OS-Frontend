import { requestApi } from './client';
import { workspaceApiPath } from './types';

export type QualityArtifact = {
  id: string;
  workspaceId: string;
  artifactType: string;
  canonicalEntityType: string;
  canonicalEntityId: string;
  currentVersion: number;
  status: string;
  riskClass: string;
  language: string;
  targetMarket: string | null;
  targetChannel: string | null;
  releaseMode: string;
  providerStatus: string;
  reviewCount?: number;
  openHardBlockCount?: number;
  updatedAt: string;
};

export type QualityOverview = {
  counts: {
    artifactCount: number;
    blockedCount: number;
    releasedCount: number;
    measuredCount: number;
  };
  recent: QualityArtifact[];
};

export const qualityApi = {
  overview: (workspaceId: string, signal?: AbortSignal) => requestApi<QualityOverview>({
    path: workspaceApiPath(workspaceId, '/quality/overview'), signal,
  }),
  artifacts: (workspaceId: string, options: { status?: string; artifactType?: string; limit?: number } = {}, signal?: AbortSignal) => {
    const params = new URLSearchParams();
    if (options.status) params.set('status', options.status);
    if (options.artifactType) params.set('artifactType', options.artifactType);
    if (options.limit) params.set('limit', String(options.limit));
    const query = params.toString();
    return requestApi<{ items: QualityArtifact[] }>({
      path: `${workspaceApiPath(workspaceId, '/quality/artifacts')}${query ? `?${query}` : ''}`, signal,
    });
  },
};
