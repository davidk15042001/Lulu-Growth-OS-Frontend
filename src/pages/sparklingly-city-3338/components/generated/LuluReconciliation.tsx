import { GitCompareArrows } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluReconciliation() {
  return <BackendResourceOverviewPage
    resourceType="finance_reconciliations"
    eyebrow="Finance"
    title="Reconciliation"
    description="Canonical reconciliation records from the current workspace. Exceptions and settlement state appear only when returned by the backend."
    emptyTitle="No verified reconciliation records yet"
    emptyDescription="Reconciliation activity will appear after a connected account or an authorized finance workflow persists a reconciliation record."
    emptyIcon={<GitCompareArrows aria-hidden="true" size={24} />}
  />;
}
