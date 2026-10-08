import { Filter } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluSalesPipeline() {
  return (
    <BackendResourceOverviewPage
      resourceType="sales_deals"
      eyebrow="Sales"
      title="Sales Pipeline"
      description="Verified deal records from the selected workspace."
      emptyTitle="No live deals in the pipeline yet"
      emptyDescription="Deals appear after an authorized CRM workflow durably creates or synchronizes them. No example stages, values or close dates are displayed."
      emptyIcon={<Filter aria-hidden="true" size={24} />}
    />
  );
}
