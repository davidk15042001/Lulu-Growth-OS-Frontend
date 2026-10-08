import { UsersRound } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function CustomerSegments() {
  return (
    <BackendResourceOverviewPage
      resourceType="sales_segments"
      eyebrow="CRM"
      title="Customer Segments"
      description="Verified customer segment records from the selected workspace."
      emptyTitle="No live customer segments yet"
      emptyDescription="Segments appear after an authorized CRM workflow durably creates them. No example audience sizes, labels or conversion rates are displayed."
      emptyIcon={<UsersRound aria-hidden="true" size={24} />}
    />
  );
}
