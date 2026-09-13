import { Upload } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluPublishingCenter = () => <BackendResourceOverviewPage
  resourceType="ad_approvals"
  eyebrow="Advertising / Publishing"
  title="Autonomous Publishing"
  description="A verified view of persisted publishing work. Lulu shows an operation only after the backend has recorded it."
  emptyTitle="No live publishing operations yet"
  emptyDescription="Publishing work will appear after an eligible provider is connected and an operation is created by the backend."
  emptyIcon={<Upload aria-hidden="true" size={24} />}
/>;
