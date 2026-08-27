import type {
  AuthSessionRecord,
  ChangePasswordInput,
  ConfirmPasswordResetInput,
  CreateWorkspaceUserInput,
  CreateSiteInput,
  LoginInput,
  LoginResponse,
  MfaSetupResponse,
  MfaState,
  OptionsResponse,
  PasswordResetTokenResponse,
  SessionContext,
  SiteConnection,
  SiteDetailResponse,
  SiteListItem,
  SiteRun,
  UpdateWorkspaceUserInput,
  WorkspaceUser,
} from './types';

const API_BASE = (import.meta.env.VITE_API_URL?.trim() || 'http://localhost:4100/api').replace(/\/$/, '');
const AUTH_STORAGE_KEY = 'optimizer.auth.token';
const REFRESH_STORAGE_KEY = 'optimizer.auth.refresh-token';
const REQUEST_TIMEOUT_MS = 15_000;

type Envelope<T> = {
  success: true;
  data: T;
};

type ApiErrorEnvelope = {
  success?: false;
  error?: {
    message?: string;
    code?: string;
  };
};

type RequestOptions = RequestInit & {
  timeoutMs?: number;
  skipAuthRefresh?: boolean;
};

export class ApiError extends Error {
  status: number;
  code: string | undefined;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestOptions) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), init?.timeoutMs ?? REQUEST_TIMEOUT_MS);
  const authToken = getStoredAccessToken();
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(init?.headers ?? {}),
    },
    ...init,
    signal: init?.signal ?? controller.signal,
  }).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    if (response.status === 401 && !init?.skipAuthRefresh && getStoredRefreshToken()) {
      const refreshed = await refreshSession();
      if (refreshed) {
        return request<T>(path, { ...init, skipAuthRefresh: true });
      }
    }
    let parsedError: ApiErrorEnvelope | null = null;
    try {
      parsedError = (await response.json()) as ApiErrorEnvelope;
    } catch {
      parsedError = null;
    }
    throw new ApiError(
      parsedError?.error?.message || `Request failed: ${response.status}`,
      response.status,
      parsedError?.error?.code,
    );
  }

  return (await response.json()) as Envelope<T>;
}

function getStoredAccessToken() {
  return localStorage.getItem(AUTH_STORAGE_KEY);
}

function getStoredRefreshToken() {
  return localStorage.getItem(REFRESH_STORAGE_KEY);
}

function storeSessionTokens(input: { accessToken: string; refreshToken: string }) {
  localStorage.setItem(AUTH_STORAGE_KEY, input.accessToken);
  localStorage.setItem(REFRESH_STORAGE_KEY, input.refreshToken);
}

function clearStoredAuthTokens() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(REFRESH_STORAGE_KEY);
}

async function refreshSession() {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await request<LoginResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
      skipAuthRefresh: true,
    });
    storeSessionTokens({
      accessToken: response.data.token,
      refreshToken: response.data.refreshToken,
    });
    return true;
  } catch {
    clearStoredAuthTokens();
    return false;
  }
}

export const api = {
  getOptions: async () => (await request<OptionsResponse>('/options')).data,
  login: async (payload: LoginInput) => {
    const response = await request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    storeSessionTokens({
      accessToken: response.data.token,
      refreshToken: response.data.refreshToken,
    });
    return response.data;
  },
  logout: async () => {
    try {
      if (getStoredAccessToken()) {
        await request<{ loggedOut: true }>('/auth/logout', {
          method: 'POST',
          skipAuthRefresh: true,
        });
      }
    } finally {
      clearStoredAuthTokens();
    }
  },
  clearSession: () => {
    clearStoredAuthTokens();
  },
  confirmPasswordReset: async (payload: ConfirmPasswordResetInput) =>
    (await request<{ reset: true }>('/auth/password-reset/confirm', {
      method: 'POST',
      body: JSON.stringify(payload),
      skipAuthRefresh: true,
    })).data,
  hasStoredSession: () => Boolean(getStoredAccessToken() || getStoredRefreshToken()),
  getSession: async () => (await request<SessionContext>('/session')).data,
  getMfaState: async () => (await request<MfaState>('/account/mfa')).data,
  startMfaSetup: async () => (await request<MfaSetupResponse>('/account/mfa/setup', { method: 'POST' })).data,
  enableMfa: async (code: string) =>
    (await request<MfaState>('/account/mfa/enable', {
      method: 'POST',
      body: JSON.stringify({ code }),
    })).data,
  disableMfa: async (payload: { password: string; code: string }) =>
    (await request<MfaState>('/account/mfa/disable', {
      method: 'POST',
      body: JSON.stringify(payload),
    })).data,
  getMySessions: async () => (await request<AuthSessionRecord[]>('/account/sessions')).data,
  revokeMySession: async (sessionId: string) =>
    (await request<{ revoked: true }>(`/account/sessions/${sessionId}/revoke`, { method: 'POST' })).data,
  changePassword: async (payload: ChangePasswordInput) =>
    (await request<{ changed: true }>('/account/password', {
      method: 'POST',
      body: JSON.stringify(payload),
    })).data,
  listSites: async () => (await request<SiteListItem[]>('/sites')).data,
  getSite: async (siteId: string) => (await request<SiteDetailResponse>(`/sites/${siteId}`)).data,
  createSite: async (payload: CreateSiteInput) =>
    (await request<SiteConnection>('/sites', { method: 'POST', body: JSON.stringify(payload) })).data,
  listWorkspaceUsers: async () => (await request<WorkspaceUser[]>('/admin/users')).data,
  createWorkspaceUser: async (payload: CreateWorkspaceUserInput) =>
    (await request<WorkspaceUser>('/admin/users', { method: 'POST', body: JSON.stringify(payload) })).data,
  updateWorkspaceUser: async (userId: string, payload: UpdateWorkspaceUserInput) =>
    (await request<WorkspaceUser>(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })).data,
  deleteWorkspaceMembership: async (userId: string) =>
    (await request<{ removed: true }>(`/admin/users/${userId}/membership`, { method: 'DELETE' })).data,
  createPasswordResetToken: async (userId: string) =>
    (await request<PasswordResetTokenResponse>(`/admin/users/${userId}/password-reset`, {
      method: 'POST',
    })).data,
  listWorkspaceSessions: async () => (await request<AuthSessionRecord[]>('/admin/sessions')).data,
  revokeWorkspaceSession: async (sessionId: string) =>
    (await request<{ revoked: true }>(`/admin/sessions/${sessionId}/revoke`, { method: 'POST' })).data,
  runAnalysis: async (siteId: string) =>
    (await request<SiteRun>(`/sites/${siteId}/analyze`, { method: 'POST' })).data,
  runOptimization: async (siteId: string) =>
    (await request<SiteRun>(`/sites/${siteId}/optimize`, { method: 'POST' })).data,
  runFullCycle: async (siteId: string) =>
    (await request<SiteRun>(`/sites/${siteId}/full-cycle`, { method: 'POST' })).data,
};
