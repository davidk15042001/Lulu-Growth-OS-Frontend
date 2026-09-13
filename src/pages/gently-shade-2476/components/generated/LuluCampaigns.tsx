import { Megaphone } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluCampaigns = () => <BackendResourceOverviewPage
  resourceType="marketing_campaigns"
  eyebrow="Marketing Workspace"
  title="Campaigns"
  description="Canonical marketing campaign records loaded from the current workspace."
  emptyTitle="No campaign data available yet"
  emptyDescription="Campaigns will appear only after a verified platform or Lulu workflow persists them in the workspace."
  emptyIcon={<Megaphone aria-hidden="true" size={24} />}
/>;
