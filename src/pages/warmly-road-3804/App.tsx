import { Theme } from './settings/types';
import { Activity } from 'lucide-react';
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
      resourceType="sales_activities"
      eyebrow="Sales"
      title="Activities"
      description="Verified sales-activity records for the current workspace."
      emptyTitle="No verified sales activities yet"
      emptyDescription="Connect an approved CRM or sales provider before reviewing activity metrics, timelines or follow-up suggestions. No create, import or merge action is exposed without a canonical mutation."
      emptyIcon={<Activity aria-hidden="true" size={24} />}
    />
  ); // %EXPORT_STATEMENT%
}

export default App;
