import { requestApi } from "./client";
import { workspaceApiPath } from "./types";

export type ComposioToolkit = {
  slug: string;
  name: string;
  isNoAuth: boolean;
  logo?: string;
  connected: boolean;
  connectionStatus: string | null;
  connectedAccountId: string | null;
};

export const composioApi = {
  toolkits: (workspaceId: string, search?: string) => {
    const query = search?.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
    return requestApi<{ items: ComposioToolkit[]; nextCursor: string | null; totalPages: number }>({
      path: workspaceApiPath(workspaceId, `/composio/toolkits${query}`),
    });
  },
  authorize: (workspaceId: string, toolkit: string) => requestApi<{
    sessionId: string;
    toolkit: string;
    connectedAccountId: string;
    redirectUrl: string;
  }>({
    path: workspaceApiPath(workspaceId, "/composio/authorize"),
    method: "POST",
    body: { toolkit },
  }),
};
