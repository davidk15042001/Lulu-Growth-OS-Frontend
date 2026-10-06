import { Target } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function SalesGoals() {
  return <BackendResourceOverviewPage
    resourceType="sales_goals"
    eyebrow="Sales"
    title="Goals"
    description="Verified sales-goal records from connected workspace systems."
    emptyTitle="No sales goals available yet"
    emptyDescription="Connect a sales system or create a goal through the workspace assistant to populate this page. No example targets or attainment percentages are shown."
    emptyIcon={<Target aria-hidden="true" size={22} />}
  />;
}
