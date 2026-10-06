import { TrendingUp } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function SalesForecast() {
  return <BackendResourceOverviewPage
    resourceType="sales_forecasts"
    eyebrow="Sales"
    title="Forecast"
    description="Verified sales-forecast records from connected workspace systems."
    emptyTitle="No sales forecast available yet"
    emptyDescription="Connect a CRM or sales platform to populate forecast records. No example pipeline values, confidence scores or forecast categories are displayed."
    emptyIcon={<TrendingUp aria-hidden="true" size={22} />}
  />;
}
