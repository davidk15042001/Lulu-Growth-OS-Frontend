import { CreditCard } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluPaymentsWorkspace = () => <BackendResourceOverviewPage
  resourceType="ecommerce_payments"
  eyebrow="Ecommerce"
  title="Payments"
  description="Canonical payment records from connected stores. Status, provider and issue data appear only when returned by the backend."
  emptyTitle="No verified payment records yet"
  emptyDescription="Payment activity will appear after a connected store synchronizes transactions into the workspace."
  emptyIcon={<CreditCard aria-hidden="true" size={24} />}
/>;
