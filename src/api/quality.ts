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

export type QualityArtifactDetail = {
  artifact: QualityArtifact & { createdBy: string | null; createdAt: string; updatedAt: string };
  versions: Array<{ id: string; version: number; content: Record<string, unknown>; producerAgentId: string; createdAt: string }>;
  currentVersionId: string | null;
  claims: Array<{ id: string; artifactVersionId: string; claimText: string; claimType: string; sourceStatus: string; verdict: string; evidenceIds: string[] }>;
  reviews: Array<{ id: string; artifactVersionId: string; reviewerAgentId: string; reviewerKind: string; verdict: string; overallScore: number | null; createdAt: string }>;
  findings: Array<{ id: string; artifactVersionId: string; severity: string; category: string; message: string; resolvedAt: string | null }>;
  releaseDecisions: Array<{ id: string; artifactVersionId: string; decision: string; reason: string; createdAt: string }>;
  feedback: unknown[];
  outcomes: unknown[];
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
  artifact: (workspaceId: string, artifactId: string, signal?: AbortSignal) => requestApi<QualityArtifactDetail>({
    path: workspaceApiPath(workspaceId, `/quality/artifacts/${artifactId}`), signal,
  }),
};
