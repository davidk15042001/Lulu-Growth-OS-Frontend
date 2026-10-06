import { WalletCards } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluCashFlow = () => <BackendResourceOverviewPage
  resourceType="finance_cashflow"
  eyebrow="Finance"
  title="Cash Flow"
  description="Canonical cash-flow records loaded from the current workspace. Forecasts and derived metrics are shown only when backed by persisted data."
  emptyTitle="No verified cash-flow records yet"
  emptyDescription="Cash movements will appear after a verified finance workflow persists them in the workspace."
  emptyIcon={<WalletCards aria-hidden="true" size={24} />}
/>;
