import { Target } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const SalesOpportunities = () => <BackendResourceOverviewPage
  resourceType="sales_opportunities"
  eyebrow="Sales / Opportunities"
  title="Sales Opportunities"
  description="Qualified opportunity records from connected sales systems, scoped to the current workspace."
  emptyTitle="No verified sales opportunities yet"
  emptyDescription="Connect a verified CRM or persist an opportunity through the canonical workspace workflow before reviewing pipeline state."
  emptyIcon={<Target aria-hidden="true" size={24} />}
/>;
