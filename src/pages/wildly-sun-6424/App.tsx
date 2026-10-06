import { Theme } from './settings/types';
import { Target } from 'lucide-react';
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
      resourceType="sales_opportunities"
      eyebrow="Sales"
      title="Opportunities"
      description="Verified sales-opportunity records for the current workspace."
      emptyTitle="No verified sales opportunities yet"
      emptyDescription="Connect an approved CRM or sales provider before reviewing pipeline values, forecasts or next actions. No create, import or forecast claim is shown without verified records."
      emptyIcon={<Target aria-hidden="true" size={24} />}
    />
  );
}

export default App;
