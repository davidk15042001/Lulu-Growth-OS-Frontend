export type WorkspaceRefreshEventDetail = {
  workspaceId: string;
  source: string;
  at: number;
};

const WORKSPACE_REFRESHED_EVENT = "lulu:workspace-refreshed";

export function emitWorkspaceRefreshed(workspaceId: string, source = "workspace-update") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<WorkspaceRefreshEventDetail>(WORKSPACE_REFRESHED_EVENT, {
    detail: {
      workspaceId,
      source,
      at: Date.now(),
    },
  }));
}

export function subscribeWorkspaceRefresh(
  workspaceId: string,
  handler: (detail: WorkspaceRefreshEventDetail) => void,
) {
  if (typeof window === "undefined") return () => undefined;
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<WorkspaceRefreshEventDetail>).detail;
    if (!detail || detail.workspaceId !== workspaceId) return;
    handler(detail);
  };
  window.addEventListener(WORKSPACE_REFRESHED_EVENT, listener as EventListener);
  return () => window.removeEventListener(WORKSPACE_REFRESHED_EVENT, listener as EventListener);
}
