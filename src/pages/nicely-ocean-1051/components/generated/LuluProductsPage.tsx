import { Package } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluProductsPage = () => <BackendResourceOverviewPage
  resourceType="ecommerce_products"
  eyebrow="Website & Commerce"
  title="Products"
  description="Canonical product records loaded from the current workspace."
  emptyTitle="No verified products yet"
  emptyDescription="Products will appear after a verified store or Lulu workflow persists them in the workspace."
  emptyIcon={<Package aria-hidden="true" size={24} />}
/>;
