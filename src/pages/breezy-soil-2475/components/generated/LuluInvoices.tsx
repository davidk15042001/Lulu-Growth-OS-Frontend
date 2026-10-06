import { FileText } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluInvoices = () => <BackendResourceOverviewPage
  resourceType="finance_invoices"
  eyebrow="Finance"
  title="Invoices"
  description="Canonical invoice records loaded from the current workspace."
  emptyTitle="No verified invoices yet"
  emptyDescription="Invoices will appear after a verified finance workflow persists them in the workspace."
  emptyIcon={<FileText aria-hidden="true" size={24} />}
/>;
