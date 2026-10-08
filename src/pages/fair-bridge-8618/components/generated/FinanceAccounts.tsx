import { Landmark } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function FinanceAccounts() {
  return (
    <BackendResourceOverviewPage
      resourceType="finance_accounts"
      eyebrow="Finance"
      title="Finance Accounts"
      description="Verified finance account records from connected providers."
      emptyTitle="No live finance accounts yet"
      emptyDescription="Accounts appear after an approved finance provider synchronizes them into this workspace. No example balances, institutions or account health are displayed."
      emptyIcon={<Landmark aria-hidden="true" size={24} />}
    />
  );
}
