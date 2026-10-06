import { Landmark } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function FinanceAccounts() {
  return <BackendResourceOverviewPage
    resourceType="finance_accounts"
    eyebrow="Finance"
    title="Accounts"
    description="Verified financial account records from connected workspace sources."
    emptyTitle="No finance accounts available yet"
    emptyDescription="Connect a finance provider to populate accounts, balances and reconciliation records. No example balances or trends are displayed."
    emptyIcon={<Landmark aria-hidden="true" size={22} />}
  />;
}
