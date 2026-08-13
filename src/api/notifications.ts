import { requestApi } from "./client";
import type { Pagination } from "./types";
import { workspaceApiPath } from "./types";

export type Notification = {
  id: string;
  workspaceId: string;
  notificationType: string;
  severity: "info" | "success" | "warning" | "error" | string;
  title: string;
  body: string | null;
  entityType: string | null;
  entityId: string | null;
  data: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
};

export const notificationApi = {
  list: (workspaceId: string, query = "limit=100") => requestApi<{
    items: Notification[]; unread: number; pagination: Pagination;
  }>({ path: workspaceApiPath(workspaceId, `/notifications?${query}`) }),
  markRead: (workspaceId: string, notificationId: string) => requestApi<Notification>({
    path: workspaceApiPath(workspaceId, `/notifications/${notificationId}/read`), method: "PATCH", body: {},
  }),
  markAllRead: (workspaceId: string) => requestApi<{ updated: number }>({
    path: workspaceApiPath(workspaceId, "/notifications/read-all"), method: "POST", body: {},
  }),
  dismiss: (workspaceId: string, notificationId: string) => requestApi<null>({
    path: workspaceApiPath(workspaceId, `/notifications/${notificationId}`), method: "DELETE",
  }),
};
