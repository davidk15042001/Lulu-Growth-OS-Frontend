import { UsersRound } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function FinanceCustomers() {
  return (
    <BackendResourceOverviewPage
      resourceType="finance_customers"
      eyebrow="Finance"
      title="Finance Customers"
      description="Verified finance customer records from the selected workspace."
      emptyTitle="No live finance customers yet"
      emptyDescription="Finance customer records appear after an authorized provider synchronizes them into this workspace. No example balances, counts or customer profiles are displayed."
      emptyIcon={<UsersRound aria-hidden="true" size={24} />}
    />
  );
}
