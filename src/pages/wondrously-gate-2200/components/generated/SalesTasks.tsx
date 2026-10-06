import { CheckSquare2 } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function SalesTasks() {
  return <BackendResourceOverviewPage
    resourceType="sales_tasks"
    eyebrow="Sales"
    title="Tasks"
    description="Verified sales-task records from connected workspace systems."
    emptyTitle="No sales tasks available yet"
    emptyDescription="Connect a CRM or create a sales task through the workspace assistant to populate this page. No example owners, due dates or completion metrics are shown."
    emptyIcon={<CheckSquare2 aria-hidden="true" size={22} />}
  />;
}
