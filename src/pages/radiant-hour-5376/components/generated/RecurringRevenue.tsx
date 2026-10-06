import { Repeat2 } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function RecurringRevenue() {
  return <BackendResourceOverviewPage
    resourceType="finance_recurring_revenue"
    eyebrow="Finance"
    title="Recurring Revenue"
    description="Canonical recurring-revenue records from the current workspace. Derived retention, churn and forecast metrics appear only when backed by persisted data."
    emptyTitle="No verified recurring-revenue records yet"
    emptyDescription="Recurring revenue metrics will appear after a verified finance workflow persists subscription records in the workspace."
    emptyIcon={<Repeat2 aria-hidden="true" size={24} />}
  />;
}
