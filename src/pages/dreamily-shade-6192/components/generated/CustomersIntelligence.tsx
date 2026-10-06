import { UsersRound } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function CustomersIntelligence() {
  return <BackendResourceOverviewPage
    resourceType="crm_customer_insights"
    eyebrow="Intelligence"
    title="Customers"
    description="Canonical customer-intelligence records from connected CRM sources. Retention, acquisition and value metrics appear only when backed by persisted data."
    emptyTitle="No verified customer intelligence yet"
    emptyDescription="Connect a CRM or persist customer-insight records before reviewing intelligence analysis."
    emptyIcon={<UsersRound aria-hidden="true" size={24} />}
  />;
}
