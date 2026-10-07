import { Theme } from './settings/types';
import { ArrowDownUp } from 'lucide-react';
import { BackendResourceOverviewPage } from '../../components/BackendResourceOverviewPage';

let theme: Theme = 'light';

function App() {
  function setTheme(nextTheme: Theme) {
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  return (
    <BackendResourceOverviewPage
      resourceType="finance_transactions"
      eyebrow="Finance"
      title="Transactions"
      description="Verified transaction records from the selected workspace. Amounts, status and timestamps come only from canonical finance data."
      emptyTitle="No verified transactions yet"
      emptyDescription="Connect a finance provider or create canonical transaction records before reviewing money movement. No example balances or activity are displayed."
      emptyIcon={<ArrowDownUp aria-hidden="true" size={24} />}
    />
  );
}

export default App;
