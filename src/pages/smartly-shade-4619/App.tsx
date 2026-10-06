import { Theme } from './settings/types';
import { BriefcaseBusiness } from 'lucide-react';
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
      resourceType="crm_deals"
      eyebrow="CRM"
      title="Deals"
      description="Verified CRM deal records for the current workspace."
      emptyTitle="No verified CRM deals yet"
      emptyDescription="Connect an approved CRM before reviewing deal stages, values or pipeline health. No create, import or bulk action is exposed without a canonical mutation."
      emptyIcon={<BriefcaseBusiness aria-hidden="true" size={24} />}
    />
  ); // %EXPORT_STATEMENT%
}

export default App;
