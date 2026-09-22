import { requestApi } from "./client";

export type CurrentUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: "user" | "admin";
  adminCapabilities?: string[];
  impersonation?: {
    active: boolean;
    adminEmail: string | null;
  };
};

export const authApi = {
  register: (input: { email: string; password: string; first_name: string; last_name: string }) => requestApi<{ verificationRequired: boolean }>({
    path: "/auth/register", method: "POST", body: input,
  }),
  verifyOtp: (email: string, code: string) => requestApi<null>({ path: "/auth/verify-otp", method: "POST", body: { email, code } }),
  login: (email: string, password: string) => requestApi<{ token?: string; user?: CurrentUser; mfaRequired?: boolean; challengeId?: string; method?: string }>({
    path: "/auth/login", method: "POST", body: { email, password },
  }),
  verifyMfa: (challengeId: string, code: string) => requestApi<{ token: string; user: CurrentUser }>({ path: '/auth/mfa/verify', method: 'POST', body: { challengeId, code } }),
  mfaStatus: () => requestApi<{ enabled: boolean; setupAvailable: boolean; pendingSetup: boolean }>({ path: '/auth/mfa/status' }),
  mfaSetup: () => requestApi<{ secret: string; otpauthUri: string; expiresAt: string }>({ path: '/auth/mfa/setup', method: 'POST', body: {} }),
  mfaConfirm: (code: string) => requestApi<{ enabled: boolean; recoveryCodes: string[] }>({ path: '/auth/mfa/confirm', method: 'POST', body: { code } }),
  mfaDisable: (password: string, code: string) => requestApi<{ enabled: boolean; requiresReauthentication: boolean }>({ path: '/auth/mfa/disable', method: 'POST', body: { password, code } }),
  refresh: () => requestApi<{ token: string; user: CurrentUser }>({ path: "/auth/refresh", method: "POST", body: {} }),
  logout: () => requestApi<null>({ path: "/auth/logout", method: "POST", body: {} }),
  logoutAll: () => requestApi<null>({ path: "/auth/logout-all", method: "POST", body: {} }),
  sessions: () => requestApi<{ items: ActiveSession[] }>({ path: '/auth/sessions' }),
  revokeSession: (id: string) => requestApi({ path: `/auth/sessions/${id}`, method: 'DELETE' }),
  revokeOtherSessions: () => requestApi({ path: '/auth/sessions/revoke-others', method: 'POST', body: {} }),
  forgotPassword: (email: string) => requestApi<null>({ path: "/auth/forgot-password", method: "POST", body: { email } }),
  resendOtp: (email: string, purpose: "verify" | "password_reset") => requestApi<null>({
    path: "/auth/resend-otp", method: "POST", body: { email, purpose },
  }),
  resetPassword: (email: string, code: string, password: string) => requestApi<null>({
    path: "/auth/reset-password", method: "POST", body: { email, code, password },
  }),
  me: () => requestApi<CurrentUser>({ path: "/auth/me" }),
  updateMe: (input: { firstName?: string; lastName?: string }) => requestApi<CurrentUser>({
    path: "/auth/me", method: "PATCH", body: input,
  }),
  completeAdminMfa: (email:string,code:string)=>requestApi<{token:string;user:CurrentUser}>({path:'/auth/admin-mfa',method:'POST',body:{email,code}}),
  changePassword: (input: { currentPassword: string; newPassword: string }) => requestApi<{ requiresReauthentication: boolean }>({
    path: "/auth/change-password", method: "POST", body: input,
  }),
  stopImpersonation: () => requestApi<{ token: string; user: CurrentUser }>({
    path: "/auth/impersonation/stop", method: "POST", body: {},
  }),
};
export type ActiveSession = { id: string; createdAt: string; lastUsedAt: string; expiresAt: string; deviceLabel: string; current: boolean };
