import { Map } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluTerritories() {
  return <BackendResourceOverviewPage
    resourceType="sales_territories"
    eyebrow="Sales"
    title="Territories"
    description="Verified territory assignments from connected workspace systems."
    emptyTitle="No sales territories available yet"
    emptyDescription="Connect a CRM or sales platform to populate territory definitions and assignments. No example coverage or conflict metrics are displayed."
    emptyIcon={<Map aria-hidden="true" size={22} />}
  />;
}
