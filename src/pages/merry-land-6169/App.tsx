import { Theme } from './settings/types';
import { Store } from 'lucide-react';
import { BackendResourceOverviewPage } from '../../components/BackendResourceOverviewPage';
// %IMPORT_STATEMENT%

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

  return <BackendResourceOverviewPage resourceType="ecommerce_orders" eyebrow="Commerce" title="Store Performance" description="Live records in this workflow" emptyTitle="No live records are available for this page yet." emptyDescription="No metrics or success claims are inferred while the backend state is unavailable." emptyIcon={<Store aria-hidden="true" size={24} />} />; // %EXPORT_STATEMENT%
}

export default App;
