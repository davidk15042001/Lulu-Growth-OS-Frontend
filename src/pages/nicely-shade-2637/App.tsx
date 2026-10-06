import { Theme } from './settings/types';
import { ShieldCheck } from 'lucide-react';
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

  return (
    <BackendResourceOverviewPage
      resourceType="ad_attributions"
      eyebrow="Advertising"
      title="Tracking & Attribution"
      description="Verified attribution records for the current workspace."
      emptyTitle="No verified attribution records yet"
      emptyDescription="Connect an approved advertising source before reviewing conversion events or attribution health. No event counts, discrepancies or tracking actions are inferred without verified records."
      emptyIcon={<ShieldCheck aria-hidden="true" size={24} />}
    />
  ); // %EXPORT_STATEMENT%
}

export default App;
