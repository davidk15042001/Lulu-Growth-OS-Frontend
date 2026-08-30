import { requestApi } from "./client";

export type CurrentUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: "user" | "admin";
  impersonation?: {
    active: boolean;
    adminEmail: string | null;
  };
};

export const authApi = {
  register: (input: { email: string; password: string; first_name: string; last_name: string }) => requestApi<null>({
    path: "/auth/register", method: "POST", body: input,
  }),
  verifyOtp: (email: string, code: string) => requestApi<null>({ path: "/auth/verify-otp", method: "POST", body: { email, code } }),
  login: (email: string, password: string) => requestApi<{ token: string; user: CurrentUser }>({
    path: "/auth/login", method: "POST", body: { email, password },
  }),
  refresh: () => requestApi<{ token: string; user: CurrentUser }>({ path: "/auth/refresh", method: "POST", body: {} }),
  logout: () => requestApi<null>({ path: "/auth/logout", method: "POST", body: {} }),
  logoutAll: () => requestApi<null>({ path: "/auth/logout-all", method: "POST", body: {} }),
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
  stopImpersonation: () => requestApi<{ token: string; user: CurrentUser }>({
    path: "/auth/impersonation/stop", method: "POST", body: {},
  }),
};
