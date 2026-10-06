import { Megaphone } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function MarketingIntelligence() {
  return <BackendResourceOverviewPage
    resourceType="marketing_campaigns"
    eyebrow="Intelligence"
    title="Marketing"
    description="Canonical marketing-campaign records from the current workspace. Revenue, spend, attribution and conversion metrics appear only when returned by the backend."
    emptyTitle="No verified marketing intelligence yet"
    emptyDescription="Connect a marketing platform or persist campaign records before reviewing performance analysis."
    emptyIcon={<Megaphone aria-hidden="true" size={24} />}
  />;
}
