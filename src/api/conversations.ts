import { requestApi } from "./client";
import { workspaceApiPath } from "./types";

export type Conversation = { id: string; title: string | null; model: string | null };
export type AssistantResponse = { userMessage: unknown; assistantMessage: { content: string }; model: string };

export const conversationApi = {
  create: (workspaceId: string, title: string) => requestApi<Conversation>({ path: workspaceApiPath(workspaceId, "/conversations"), method: "POST", body: { title, metadata: { source: "global-command-center" } } }),
  respond: (workspaceId: string, conversationId: string, content: string) => requestApi<AssistantResponse>({ path: workspaceApiPath(workspaceId, `/conversations/${conversationId}/respond`), method: "POST", body: { content, metadata: { source: "global-command-center" } } }),
};
