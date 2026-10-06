import { FileBarChart } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluReports() {
  return <BackendResourceOverviewPage
    resourceType="reports"
    eyebrow="Intelligence"
    title="Reports"
    description="Verified report records from connected workspace sources."
    emptyTitle="No reports available yet"
    emptyDescription="Connect reporting sources or create a report through the workspace assistant to populate this page. No example schedules, metrics or narratives are displayed."
    emptyIcon={<FileBarChart aria-hidden="true" size={22} />}
  />;
}
