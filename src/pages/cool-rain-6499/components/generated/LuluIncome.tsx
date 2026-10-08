import { CircleDollarSign } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluIncome() {
  return (
    <BackendResourceOverviewPage
      resourceType="finance_income"
      eyebrow="Finance"
      title="Income"
      description="Verified income records from connected finance sources."
      emptyTitle="No live income records yet"
      emptyDescription="Income appears after an approved finance provider synchronizes records into this workspace. No example amounts, currency totals or growth claims are displayed."
      emptyIcon={<CircleDollarSign aria-hidden="true" size={24} />}
    />
  );
}
