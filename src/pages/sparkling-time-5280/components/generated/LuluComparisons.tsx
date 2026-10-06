import { BarChart3 } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluComparisons = () => <BackendResourceOverviewPage
  resourceType="kpis"
  eyebrow="Intelligence"
  title="Comparisons"
  description="Verified KPI records available for comparison. Differences, scores and trends are not inferred without compatible backend data."
  emptyTitle="No verified comparison records yet"
  emptyDescription="At least two compatible KPI records are required before a comparison can be shown."
  emptyIcon={<BarChart3 aria-hidden="true" size={24} />}
/>;
