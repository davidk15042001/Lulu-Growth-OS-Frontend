import { MessagesSquare } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluAIConversations = () => <BackendResourceOverviewPage
  resourceType="ai_conversations"
  eyebrow="AI / Conversations"
  title="AI Conversations"
  description="Workspace-scoped conversation records. Messages, context and assistant output appear only when returned by the backend."
  emptyTitle="No conversations yet"
  emptyDescription="Start a conversation through the connected AI workspace. No example messages or assistant conclusions are displayed here."
  emptyIcon={<MessagesSquare aria-hidden="true" size={24} />}
/>;
