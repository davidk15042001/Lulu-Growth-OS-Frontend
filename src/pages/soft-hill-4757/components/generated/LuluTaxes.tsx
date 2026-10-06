import { Receipt } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluTaxes() {
  return <BackendResourceOverviewPage
    resourceType="ecommerce_taxes"
    eyebrow="Ecommerce"
    title="Taxes"
    description="Verified tax records from connected commerce systems."
    emptyTitle="No commerce tax records available yet"
    emptyDescription="Connect a commerce platform to populate tax configuration, jurisdictions and transactions. No example rates, stores or obligations are displayed."
    emptyIcon={<Receipt aria-hidden="true" size={22} />}
  />;
}
