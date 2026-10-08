import { Zap } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluAIActions = () => <BackendResourceOverviewPage
  resourceType="ai_actions"
  eyebrow="AI / Actions"
  title="AI Actions"
  description="Workspace-scoped AI action records with their persisted status, evidence and timestamps. Authorization and execution remain server-side."
  emptyTitle="No AI actions recorded yet"
  emptyDescription="AI actions appear here only after the backend has persisted a proposed, approved, blocked or executed action. This page never presents simulated executions."
  emptyIcon={<Zap aria-hidden="true" size={24} />}
/>;
