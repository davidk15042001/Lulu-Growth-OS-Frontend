import { UsersRound } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function FinanceCustomers() {
  return <BackendResourceOverviewPage
    resourceType="finance_customers"
    eyebrow="Finance"
    title="Customers"
    description="Canonical finance-customer records from the current workspace. Revenue, payment and balance metrics appear only when returned by the backend."
    emptyTitle="No verified finance-customer records yet"
    emptyDescription="Finance customer activity will appear after a verified billing or payment workflow persists records in the workspace."
    emptyIcon={<UsersRound aria-hidden="true" size={24} />}
  />;
}
