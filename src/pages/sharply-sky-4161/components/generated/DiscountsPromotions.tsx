import { BadgePercent } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function DiscountsPromotions() {
  return (
    <BackendResourceOverviewPage
      resourceType="ecommerce_discounts"
      eyebrow="Ecommerce"
      title="Discounts & Promotions"
      description="Verified discount and promotion records from connected ecommerce sources."
      emptyTitle="No live discounts available yet"
      emptyDescription="Discounts appear after an approved ecommerce source has synchronized them into this workspace. No example offers, values or redemption counts are displayed."
      emptyIcon={<BadgePercent aria-hidden="true" size={24} />}
    />
  );
}
