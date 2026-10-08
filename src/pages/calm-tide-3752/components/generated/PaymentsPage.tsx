import { CreditCard } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function PaymentsPage() {
  return (
    <BackendResourceOverviewPage
      resourceType="finance_payments"
      eyebrow="Finance"
      title="Payments"
      description="Verified payment records from connected finance sources."
      emptyTitle="No live payments yet"
      emptyDescription="Payments appear after an approved finance provider synchronizes records into this workspace. No example amounts, statuses or settlement claims are displayed."
      emptyIcon={<CreditCard aria-hidden="true" size={24} />}
    />
  );
}
