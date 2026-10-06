import { Store } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const StorePerformancePage = () => <BackendResourceOverviewPage
  resourceType="ecommerce_stores"
  eyebrow="Website & Commerce"
  title="Store Performance"
  description="Verified connected-store records from the current workspace. Performance metrics appear only when backed by persisted platform data."
  emptyTitle="No verified stores yet"
  emptyDescription="Connect an ecommerce platform or persist a verified store record before reviewing store performance."
  emptyIcon={<Store aria-hidden="true" size={24} />}
/>;
