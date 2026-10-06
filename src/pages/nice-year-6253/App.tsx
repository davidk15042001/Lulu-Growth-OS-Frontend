import { Theme } from './settings/types';
import { Store } from 'lucide-react';
import { BackendResourceOverviewPage } from '../../components/BackendResourceOverviewPage';

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

  return (
    <BackendResourceOverviewPage
      resourceType="ecommerce_stores"
      eyebrow="Ecommerce"
      title="Stores"
      description="Verified connected-store records for the current workspace."
      emptyTitle="No verified stores yet"
      emptyDescription="Connect an approved commerce provider before reviewing store status or synchronization details. No add-store, sync or health claims are shown without a canonical provider operation."
      emptyIcon={<Store aria-hidden="true" size={24} />}
    />
  );
}

export default App;
