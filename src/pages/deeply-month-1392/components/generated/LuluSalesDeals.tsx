import { Handshake } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluSalesDeals = () => <BackendResourceOverviewPage
  resourceType="sales_deals"
  eyebrow="Sales"
  title="Deals"
  description="Canonical sales-deal records from the current workspace. Stage, ownership and value appear only when returned by the backend."
  emptyTitle="No verified sales deals yet"
  emptyDescription="Sales deals will appear after an authorized CRM workflow or connected provider persists them in the workspace."
  emptyIcon={<Handshake aria-hidden="true" size={24} />}
/>;
