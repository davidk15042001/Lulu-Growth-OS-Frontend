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

export type ComposioTool = {
  slug: string;
  name: string;
  description: string | null;
  toolkitSlug: string;
  toolkitName: string;
  logo?: string;
  isNoAuth: boolean;
};

export const composioApi = {
  toolkits: (workspaceId: string, options: { search?: string; cursor?: string | null } = {}) => {
    const params = new URLSearchParams();
    if (options.search?.trim()) params.set("search", options.search.trim());
    if (options.cursor) params.set("cursor", options.cursor);
    const query = params.toString() ? `?${params.toString()}` : "";
    return requestApi<{ items: ComposioToolkit[]; nextCursor: string | null; totalPages: number }>({
      path: workspaceApiPath(workspaceId, `/composio/toolkits${query}`),
    });
  },
  tools: (workspaceId: string, toolkit: string, search?: string) => {
    const params = new URLSearchParams({ toolkit });
    if (search?.trim()) params.set("search", search.trim());
    return requestApi<{ items: ComposioTool[]; total: number; truncated: boolean }>({
      path: workspaceApiPath(workspaceId, `/composio/tools?${params.toString()}`),
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
