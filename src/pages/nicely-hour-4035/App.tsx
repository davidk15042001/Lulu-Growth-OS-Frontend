import { Theme } from './settings/types';
import { ChartNoAxesCombined } from 'lucide-react';
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

  return <BackendResourceOverviewPage resourceType="sales_deals" eyebrow="Sales" title="Sales" description="Live records in this workflow" emptyTitle="No live records are available for this page yet." emptyDescription="No metrics or success claims are inferred while the backend state is unavailable." emptyIcon={<ChartNoAxesCombined aria-hidden="true" size={24} />} />;
}

export default App;
