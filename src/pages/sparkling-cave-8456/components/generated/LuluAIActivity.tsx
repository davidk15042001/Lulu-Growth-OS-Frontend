import { Activity } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluAIActivity() {
  return <BackendResourceOverviewPage
    resourceType="ai_activity"
    eyebrow="AI"
    title="AI Activity"
    description="Verified AI activity records from the selected workspace."
    emptyTitle="No verified AI activity yet"
    emptyDescription="AI activity appears after connected workspace actions are durably recorded by the backend. No example events are displayed."
    emptyIcon={<Activity aria-hidden="true" size={24} />}
  />;
}
