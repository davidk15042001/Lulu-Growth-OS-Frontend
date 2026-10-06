import { ChartNoAxesCombined } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function FinancialPlanning() {
  return <BackendResourceOverviewPage
    resourceType="finance_plans"
    eyebrow="Finance"
    title="Financial Planning"
    description="Canonical financial-plan records from the current workspace. Scenarios, targets and forecasts appear only when backed by persisted finance data."
    emptyTitle="No verified financial plans yet"
    emptyDescription="Create a plan through an authorized finance workflow before reviewing targets, scenarios or forecasts."
    emptyIcon={<ChartNoAxesCombined aria-hidden="true" size={24} />}
  />;
}
