import { TrendingUp } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluTrends() {
  return <BackendResourceOverviewPage
    resourceType="trends"
    eyebrow="Intelligence"
    title="Trends"
    description="Verified trend records derived from connected workspace data."
    emptyTitle="No verified trends available yet"
    emptyDescription="Connect sources with enough historical observations to populate trend records. No example changes, drivers or AI inferences are displayed."
    emptyIcon={<TrendingUp aria-hidden="true" size={22} />}
  />;
}
