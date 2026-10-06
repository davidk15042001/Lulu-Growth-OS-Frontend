import { ChartNoAxesCombined } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function SalesIntelligence() {
  return <BackendResourceOverviewPage
    resourceType="sales_deals"
    eyebrow="Intelligence"
    title="Sales Intelligence"
    description="Verified sales-deal records available for analysis. Pipeline value, win rates and trends are not inferred without compatible backend data."
    emptyTitle="No verified sales intelligence yet"
    emptyDescription="Connect a CRM or persist sales-deal records before reviewing pipeline analysis."
    emptyIcon={<ChartNoAxesCombined aria-hidden="true" size={24} />}
  />;
}
