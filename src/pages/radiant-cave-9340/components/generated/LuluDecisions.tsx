import { Lightbulb } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluDecisions() {
  return <BackendResourceOverviewPage
    resourceType="decisions"
    eyebrow="Intelligence"
    title="Decisions"
    description="Verified decision records and decision context from connected workspace systems."
    emptyTitle="No decision records available yet"
    emptyDescription="Decision records appear after Lulu or an authorized workspace member creates an auditable decision. No example impact, cost or confidence values are shown."
    emptyIcon={<Lightbulb aria-hidden="true" size={22} />}
  />;
}
