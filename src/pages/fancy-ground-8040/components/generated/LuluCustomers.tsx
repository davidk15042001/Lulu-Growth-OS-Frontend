import { UsersRound } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluCustomers() {
  return (
    <BackendResourceOverviewPage
      resourceType="ecommerce_customers"
      eyebrow="Ecommerce"
      title="Customers"
      description="Verified ecommerce customer records from connected stores."
      emptyTitle="No live ecommerce customers yet"
      emptyDescription="Customers appear after an approved ecommerce source synchronizes records into this workspace. No example profiles, counts or customer value are displayed."
      emptyIcon={<UsersRound aria-hidden="true" size={24} />}
    />
  );
}
