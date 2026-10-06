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

  return <BackendResourceOverviewPage
    resourceType="finance_vendors"
    eyebrow="Finance"
    title="Vendors"
    description="Verified supplier records and financial relationships for the current workspace."
    emptyTitle="No vendor records available yet"
    emptyDescription="Connect or import supplier data through a verified finance integration. No spend, invoice, or payment figures are inferred without records."
    emptyIcon={<BriefcaseBusiness aria-hidden="true" size={24} />}
  />; // %EXPORT_STATEMENT%
}

export default App;
