import { Layers3 } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function LuluCollectionsPage() {
  return (
    <BackendResourceOverviewPage
      resourceType="ecommerce_collections"
      eyebrow="Ecommerce"
      title="Collections"
      description="Verified product collection records from connected ecommerce sources."
      emptyTitle="No live collections available yet"
      emptyDescription="Collections appear after an approved ecommerce source has synchronized records into this workspace. No example products, counts or store names are displayed."
      emptyIcon={<Layers3 aria-hidden="true" size={24} />}
    />
  );
}
