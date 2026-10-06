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
      resourceType="crm_leads"
      eyebrow="CRM"
      title="Leads"
      description="Verified CRM lead records for the current workspace."
      emptyTitle="No verified CRM leads yet"
      emptyDescription="Connect an approved CRM before reviewing lead scores, qualification or conversion state. No create, import, qualify or convert action is exposed without a canonical mutation."
      emptyIcon={<UserPlus aria-hidden="true" size={24} />}
    />
  ); // %EXPORT_STATEMENT%
}

export default App;
