import { GitCompareArrows } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluComparisons() {
  return <BackendResourceOverviewPage
    resourceType="kpis"
    eyebrow="Intelligence"
    title="Comparisons"
    description="Verified KPI records from connected workspace sources, ready for comparison in the intelligence layer."
    emptyTitle="No comparison inputs available yet"
    emptyDescription="Connect reporting sources and allow KPI records to be observed before generating comparisons. No example differences or findings are shown."
    emptyIcon={<GitCompareArrows aria-hidden="true" size={22} />}
  />;
}
