import { CircleDollarSign } from "lucide-react";
import { BackendResourceOverviewPage } from "../../../../components/BackendResourceOverviewPage";

export const LuluPayouts = () => <BackendResourceOverviewPage
  resourceType="finance_payouts"
  eyebrow="Finance / Payouts"
  title="Payouts"
  description="Verified payout records from connected finance and payment providers. Financial values are shown exactly as persisted by the backend."
  emptyTitle="No verified payouts yet"
  emptyDescription="Connect a finance provider or persist payout records through the canonical finance workflow before reviewing settlements. No balances or forecasts are invented."
  emptyIcon={<CircleDollarSign aria-hidden="true" size={24} />}
/>;
