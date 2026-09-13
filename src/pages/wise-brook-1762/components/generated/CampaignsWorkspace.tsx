import { Megaphone } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const CampaignsWorkspace = () => <BackendResourceOverviewPage
  resourceType="ad_campaigns"
  eyebrow="Advertising / Campaigns"
  title="Campaigns"
  description="Verified advertising campaign records from connected providers. Performance state appears only when returned by the backend."
  emptyTitle="No verified campaigns yet"
  emptyDescription="Connect an advertising provider and synchronize campaign records before reviewing spend or performance."
  emptyIcon={<Megaphone aria-hidden="true" size={24} />}
/>;
