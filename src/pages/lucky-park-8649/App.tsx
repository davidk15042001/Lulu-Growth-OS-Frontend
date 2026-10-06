import { Theme } from './settings/types';
import { CircleDollarSign } from 'lucide-react';
import { BackendResourceOverviewPage } from '../../components/BackendResourceOverviewPage';
// %IMPORT_STATEMENT

let theme: Theme = 'light';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  return <BackendResourceOverviewPage
    resourceType="finance_payouts"
    eyebrow="Finance"
    title="Payouts"
    description="Verified payout records from connected payment and commerce providers."
    emptyTitle="No payout records available yet"
    emptyDescription="Connect an approved payment provider before reviewing settlement state. No amounts, timings, reconciliations or transfer actions are inferred without verified records."
    emptyIcon={<CircleDollarSign aria-hidden="true" size={24} />}
  />; // %EXPORT_STATEMENT%
}

export default App;
