const WORKSPACE_KEY = "lulu.workspace-id";
const PENDING_EMAIL_KEY = "lulu.pending-email";
const PENDING_INVITATION_KEY = "lulu.pending-invitation";
const CURRENT_USER_KEY = "lulu.current-user";

export function getStoredUser<T>() {
  try {
    const raw = window.localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
}

export function setStoredUser<T>(user: T) {
  try { window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user)); } catch { /* storage is optional */ }
}

export function clearStoredUser() {
  try { window.localStorage.removeItem(CURRENT_USER_KEY); } catch { /* storage is optional */ }
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
