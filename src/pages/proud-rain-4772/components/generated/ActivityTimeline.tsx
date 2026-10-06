import { Activity } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function ActivityTimeline() {
  return <BackendResourceOverviewPage
    resourceType="activities"
    eyebrow="Intelligence"
    title="Activity Timeline"
    description="Verified activity records from connected workspace systems."
    emptyTitle="No activity records available yet"
    emptyDescription="Activity appears here after a connected system or Lulu agent produces an auditable workspace event. No example impact values are shown."
    emptyIcon={<Activity aria-hidden="true" size={22} />}
  />;
}
