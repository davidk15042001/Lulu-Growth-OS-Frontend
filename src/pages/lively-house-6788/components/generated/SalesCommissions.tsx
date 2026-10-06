import { CircleDollarSign } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function SalesCommissions() {
  return <BackendResourceOverviewPage
    resourceType="sales_commissions"
    eyebrow="Sales"
    title="Commissions"
    description="Verified sales-commission records from connected workspace systems."
    emptyTitle="No commission records available yet"
    emptyDescription="Connect a sales or finance system to populate commission records. No example payouts, rates or team totals are displayed."
    emptyIcon={<CircleDollarSign aria-hidden="true" size={22} />}
  />;
}
