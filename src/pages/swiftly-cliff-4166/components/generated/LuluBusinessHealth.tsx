import { Gauge } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluBusinessHealth() {
  return <BackendResourceOverviewPage
    resourceType="intelligence_signals"
    eyebrow="Intelligence"
    title="Business Health"
    description="Verified health and performance signals from connected workspace data."
    emptyTitle="No business health data available yet"
    emptyDescription="Connect data sources and complete a verified analysis before reviewing health signals. No example scores or performance values are displayed."
    emptyIcon={<Gauge aria-hidden="true" size={24} />}
  />;
}
