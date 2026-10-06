import { Truck } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluShipping = () => <BackendResourceOverviewPage
  resourceType="ecommerce_shipping"
  eyebrow="Ecommerce"
  title="Shipping"
  description="Canonical shipping and fulfillment records from connected stores. Delivery status and exceptions appear only when returned by the backend."
  emptyTitle="No verified shipping records yet"
  emptyDescription="Shipping activity will appear after a connected store synchronizes fulfillment data into the workspace."
  emptyIcon={<Truck aria-hidden="true" size={24} />}
/>;
