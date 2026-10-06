import { CreditCard } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function PaymentsPage() {
  return <BackendResourceOverviewPage
    resourceType="finance_payments"
    eyebrow="Finance"
    title="Payments"
    description="Canonical finance-payment records from the current workspace. Provider, status and settlement details appear only when returned by the backend."
    emptyTitle="No verified finance payments yet"
    emptyDescription="Payment activity will appear after an authorized finance workflow or connected provider persists a payment record."
    emptyIcon={<CreditCard aria-hidden="true" size={24} />}
  />;
}
