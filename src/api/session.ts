const WORKSPACE_KEY = "lulu.workspace-id";
const PENDING_EMAIL_KEY = "lulu.pending-email";
const PENDING_INVITATION_KEY = "lulu.pending-invitation";
const CURRENT_USER_KEY = "lulu.current-user";
const ADMIN_SURFACE_KEY = "lulu.admin-surface";

export const ADMIN_PANEL_PATH = "/app/admin-billing-overview-9901";
export type AdminSurface = "admin" | "workspace";

export function isAdminUser(user: { adminCapabilities?: string[]; role?: string | null; impersonation?: { active: boolean } } | null | undefined) {
  return user?.role === 'admin' && !user.impersonation?.active && Boolean(user.adminCapabilities?.length);
}

export function getAdminSurface(): AdminSurface {
  try {
    return window.localStorage.getItem(ADMIN_SURFACE_KEY) === "workspace" ? "workspace" : "admin";
  } catch {
    return "admin";
  }
}

export function setAdminSurface(surface: AdminSurface) {
  try {
    window.localStorage.setItem(ADMIN_SURFACE_KEY, surface);
  } catch {
    /* storage is optional */
  }
}

export function prefersWorkspaceSurface(user: { adminCapabilities?: string[]; role?: string | null } | null | undefined) {
  return isAdminUser(user) && getAdminSurface() === "workspace";
}

export function getAdminLandingPath(workspacePath: string) {
  return getAdminSurface() === "workspace" ? workspacePath : ADMIN_PANEL_PATH;
}

export function getStoredUser<T>() {
  try {
    const persistentValue = window.localStorage.getItem(CURRENT_USER_KEY);
    if (persistentValue) return JSON.parse(persistentValue) as T;

    const legacySessionValue = window.sessionStorage.getItem(CURRENT_USER_KEY);
    if (!legacySessionValue) return null;

    window.localStorage.setItem(CURRENT_USER_KEY, legacySessionValue);
    window.sessionStorage.removeItem(CURRENT_USER_KEY);
    return JSON.parse(legacySessionValue) as T;
  } catch {
    return null;
  }
}

export function setStoredUser<T>(user: T) {
  try {
    window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    window.sessionStorage.removeItem(CURRENT_USER_KEY);
  } catch {
    /* storage is optional */
  }
}

export function clearStoredUser() {
  try {
    window.sessionStorage.removeItem(CURRENT_USER_KEY);
    window.localStorage.removeItem(CURRENT_USER_KEY);
  } catch {
    /* storage is optional */
  }
}

export function getSelectedWorkspaceId() {
  return window.localStorage.getItem(WORKSPACE_KEY);
}

export function setSelectedWorkspaceId(workspaceId: string) {
  window.localStorage.setItem(WORKSPACE_KEY, workspaceId);
}

export function clearSelectedWorkspaceId() {
  window.localStorage.removeItem(WORKSPACE_KEY);
}

export function getPendingEmail() {
  return window.sessionStorage.getItem(PENDING_EMAIL_KEY) ?? "";
}

export function setPendingEmail(email: string) {
  window.sessionStorage.setItem(PENDING_EMAIL_KEY, email.trim().toLowerCase());
}

export function clearPendingEmail() {
  window.sessionStorage.removeItem(PENDING_EMAIL_KEY);
}

export function getPendingInvitation() {
  return window.sessionStorage.getItem(PENDING_INVITATION_KEY);
}

export function setPendingInvitation(token: string) {
  window.sessionStorage.setItem(PENDING_INVITATION_KEY, token);
}

export function clearPendingInvitation() {
  window.sessionStorage.removeItem(PENDING_INVITATION_KEY);
}
