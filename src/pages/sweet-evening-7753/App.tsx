import { Theme } from './settings/types';
import { GitBranch } from 'lucide-react';
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

  return (
    <BackendResourceOverviewPage
      resourceType="sales_deals"
      eyebrow="Sales"
      title="Pipeline"
      description="Verified sales-deal records for the current workspace."
      emptyTitle="No verified sales deals yet"
      emptyDescription="Connect an approved CRM or sales provider before reviewing pipeline stages, values or forecasts. No create-deal or pipeline-settings action is exposed without a canonical mutation."
      emptyIcon={<GitBranch aria-hidden="true" size={24} />}
    />
  ); // %EXPORT_STATEMENT%
}

export default App;
