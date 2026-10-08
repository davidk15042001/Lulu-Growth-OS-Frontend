import { AlertTriangle } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluAnomalies() {
  return (
    <BackendResourceOverviewPage
      resourceType="anomalies"
      eyebrow="Intelligence"
      title="Anomalies"
      description="Verified anomaly records from connected workspace data."
      emptyTitle="No verified anomalies yet"
      emptyDescription="Anomalies appear after a connected source has been analyzed and the result is durably recorded by the backend. No example metrics or findings are displayed."
      emptyIcon={<AlertTriangle aria-hidden="true" size={24} />}
    />
  );
}
