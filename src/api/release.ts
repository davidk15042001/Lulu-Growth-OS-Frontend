import { requestApi } from './client';

export type BackendReleaseInfo = {
  service: 'backend';
  commitSha: string | null;
  pushedAt: string | null;
  deployedAt: string | null;
  environment: string;
};

export const releaseApi = {
  backend: (signal?: AbortSignal) => requestApi<BackendReleaseInfo>({
    path: '/version',
    signal,
    timeoutMs: 10_000,
  }),
};
