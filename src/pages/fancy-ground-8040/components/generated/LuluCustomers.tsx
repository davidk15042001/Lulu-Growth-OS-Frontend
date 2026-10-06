import { Users } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluCustomers = () => <BackendResourceOverviewPage
  resourceType="ecommerce_customers"
  eyebrow="Website & Commerce"
  title="Customers"
  description="Canonical customer records loaded from the current workspace."
  emptyTitle="No verified customers yet"
  emptyDescription="Customers will appear after a verified store or Lulu workflow persists them in the workspace."
  emptyIcon={<Users aria-hidden="true" size={24} />}
/>;
