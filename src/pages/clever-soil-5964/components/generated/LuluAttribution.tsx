import { Target } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluAttribution() {
  return <BackendResourceOverviewPage
    resourceType="ad_attributions"
    eyebrow="Intelligence"
    title="Attribution"
    description="Live attribution intelligence from connected workspace sources."
    emptyTitle="No attribution data available yet"
    emptyDescription="Connect marketing and analytics platforms to populate channels, campaigns, touchpoints and modeled attribution. No example metrics are displayed."
    emptyIcon={<Target aria-hidden="true" size={22} />}
  />;
}
