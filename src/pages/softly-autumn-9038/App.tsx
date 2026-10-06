import { Theme } from './settings/types';
import { UserPlus } from 'lucide-react';
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
      resourceType="sales_leads"
      eyebrow="Sales"
      title="Leads"
      description="Verified sales-lead records for the current workspace."
      emptyTitle="No verified sales leads yet"
      emptyDescription="Connect an approved CRM or sales provider before reviewing lead volume, scoring or recommendations. No create, import or qualification action is exposed without a canonical mutation."
      emptyIcon={<UserPlus aria-hidden="true" size={24} />}
    />
  ); // %EXPORT_STATEMENT%
}

export default App;
