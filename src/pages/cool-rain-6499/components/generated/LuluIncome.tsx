import { CircleDollarSign } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluIncome() {
  return <BackendResourceOverviewPage
    resourceType="finance_income"
    eyebrow="Finance"
    title="Income"
    description="Live income records from connected finance sources."
    emptyTitle="No income data available yet"
    emptyDescription="Connect a finance platform or add an income record to populate this page. No example amounts or trends are displayed."
    emptyIcon={<CircleDollarSign aria-hidden="true" size={22} />}
  />;
}
