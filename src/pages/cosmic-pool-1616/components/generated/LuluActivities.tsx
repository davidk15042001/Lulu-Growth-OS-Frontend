import { Activity } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluActivities() {
  return <BackendResourceOverviewPage
    resourceType="crm_activities"
    eyebrow="CRM"
    title="Activities"
    description="Track every important interaction, follow-up and customer activity across your CRM."
    emptyTitle="Activities"
    emptyDescription="Track every important interaction, follow-up and customer activity across your CRM."
    emptyIcon={<Activity aria-hidden="true" size={22} />}
  />;
}
