import { ListChecks } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluAITasks() {
  return <BackendResourceOverviewPage
    resourceType="ai_tasks"
    eyebrow="AI intelligence"
    title="AI Tasks"
    description="Verified AI task records from the selected workspace."
    emptyTitle="No live AI tasks available yet"
    emptyDescription="Authorized tasks appear here after they are durably created by a canonical workspace workflow. No example counts, priorities or due dates are displayed."
    emptyIcon={<ListChecks aria-hidden="true" size={24} />}
  />;
}
