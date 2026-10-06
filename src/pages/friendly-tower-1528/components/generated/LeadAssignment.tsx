import { Route } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LeadAssignment() {
  return <BackendResourceOverviewPage
    resourceType="sales_lead_assignments"
    eyebrow="Sales"
    title="Lead Assignment"
    description="Verified lead-assignment records from connected workspace systems."
    emptyTitle="No lead-assignment records available yet"
    emptyDescription="Connect a CRM or configure an assignment workflow through the workspace assistant to populate this page. No example routing rules or performance metrics are shown."
    emptyIcon={<Route aria-hidden="true" size={22} />}
  />;
}
