import { Theme } from './settings/types';
import { Users } from 'lucide-react';
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
      resourceType="crm_contacts"
      eyebrow="CRM"
      title="Contacts"
      description="Verified CRM contact records for the current workspace."
      emptyTitle="No verified contacts yet"
      emptyDescription="Connect an approved CRM before reviewing contact data, enrichment or activity. No create, import or merge action is exposed without a canonical mutation."
      emptyIcon={<Users aria-hidden="true" size={24} />}
    />
  );
}

export default App;
