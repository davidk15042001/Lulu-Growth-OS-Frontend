import { CircleDollarSign } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluFinance() {
  return <BackendResourceOverviewPage
    resourceType="finance_transactions"
    eyebrow="Finance"
    title="Finance"
    description="Live financial intelligence from connected workspace sources."
    emptyTitle="No finance data available yet"
    emptyDescription="Connect a finance system to populate revenue, costs, margins and cash flow. No example metrics are displayed."
    emptyIcon={<CircleDollarSign aria-hidden="true" size={22} />}
  />;
}
