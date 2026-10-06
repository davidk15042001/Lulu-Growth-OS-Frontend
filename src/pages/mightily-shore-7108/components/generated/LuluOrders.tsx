import { ShoppingBag } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluOrders = () => <BackendResourceOverviewPage
  resourceType="ecommerce_orders"
  eyebrow="Website & Commerce"
  title="Orders"
  description="Canonical order records loaded from the current workspace."
  emptyTitle="No verified orders yet"
  emptyDescription="Orders will appear after a verified store or Lulu workflow persists them in the workspace."
  emptyIcon={<ShoppingBag aria-hidden="true" size={24} />}
/>;
