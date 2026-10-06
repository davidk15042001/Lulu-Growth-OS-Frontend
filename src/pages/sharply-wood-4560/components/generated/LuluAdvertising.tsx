import { Megaphone } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluAdvertising = () => <BackendResourceOverviewPage
  resourceType="ad_campaigns"
  eyebrow="Advertising"
  title="Advertising"
  description="Canonical advertising campaign records loaded from the current workspace."
  emptyTitle="No verified advertising campaigns yet"
  emptyDescription="Campaigns will appear after a verified advertising platform or Lulu workflow persists them in the workspace."
  emptyIcon={<Megaphone aria-hidden="true" size={24} />}
/>;
