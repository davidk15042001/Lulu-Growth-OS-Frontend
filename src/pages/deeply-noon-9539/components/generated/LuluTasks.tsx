import { CheckSquare2 } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluTasks() {
  return <BackendResourceOverviewPage
    resourceType="crm_tasks"
    eyebrow="CRM"
    title="Tasks"
    description="Live task records from connected workspace systems."
    emptyTitle="No task records available yet"
    emptyDescription="Connect a CRM or create a task through Lulu Assistant to populate this page. No example tasks or completion metrics are shown."
    emptyIcon={<CheckSquare2 aria-hidden="true" size={22} />}
  />;
}
