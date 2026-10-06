import { PackageSearch } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export function ProductsIntelligence() {
  return <BackendResourceOverviewPage
    resourceType="ecommerce_products"
    eyebrow="Intelligence"
    title="Products"
    description="Live product intelligence from connected workspace sources."
    emptyTitle="No product data available yet"
    emptyDescription="Connect an ecommerce platform to populate products, categories, demand and profitability. No example metrics are displayed."
    emptyIcon={<PackageSearch aria-hidden="true" size={22} />}
  />;
}
