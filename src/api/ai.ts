import { requestApi } from "./client";
import type { Pagination } from "./types";
import { workspaceApiPath } from "./types";

export type Conversation = {
  id: string;
  workspaceId: string;
  userId: string;
  title: string;
  model: string | null;
  metadata: Record<string, unknown>;
  messageCount: number;
  lastMessageAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AiMessage = {
  id: string;
  conversationId: string;
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  toolName: string | null;
  toolCallId: string | null;
  metadata: Record<string, unknown>;
  inputTokens: number | null;
  outputTokens: number | null;
  createdAt: string;
};

export const aiApi = {
  conversations: (workspaceId: string, query = "limit=100&archived=false") => requestApi<{
    items: Conversation[]; pagination: Pagination;
  }>({ path: workspaceApiPath(workspaceId, `/ai/conversations?${query}`) }),
  conversation: (workspaceId: string, conversationId: string) => requestApi<Conversation>({
    path: workspaceApiPath(workspaceId, `/ai/conversations/${conversationId}`),
  }),
  createConversation: (workspaceId: string, input: { title?: string; model?: string | null; metadata?: Record<string, unknown> }) => requestApi<Conversation>({
    path: workspaceApiPath(workspaceId, "/ai/conversations"), method: "POST", body: input,
  }),
  updateConversation: (workspaceId: string, conversationId: string, input: { title?: string; model?: string | null; metadata?: Record<string, unknown> }) => requestApi<Conversation>({
    path: workspaceApiPath(workspaceId, `/ai/conversations/${conversationId}`), method: "PATCH", body: input,
  }),
  archiveConversation: (workspaceId: string, conversationId: string) => requestApi<null>({
    path: workspaceApiPath(workspaceId, `/ai/conversations/${conversationId}`), method: "DELETE",
  }),
  messages: (workspaceId: string, conversationId: string, query = "limit=200") => requestApi<{
    items: AiMessage[]; pagination: Pagination;
  }>({ path: workspaceApiPath(workspaceId, `/ai/conversations/${conversationId}/messages?${query}`) }),
  addMessage: (workspaceId: string, conversationId: string, content: string, metadata?: Record<string, unknown>) => requestApi<AiMessage>({
    path: workspaceApiPath(workspaceId, `/ai/conversations/${conversationId}/messages`),
    method: "POST",
    body: { content, metadata },
  }),
  respond: (workspaceId: string, conversationId: string, content: string, metadata?: Record<string, unknown>) => requestApi<{
    userMessage: AiMessage; assistantMessage: AiMessage; model: string;
  }>({
    path: workspaceApiPath(workspaceId, `/ai/conversations/${conversationId}/respond`),
    method: "POST",
    body: { content, metadata },
  }),
};
