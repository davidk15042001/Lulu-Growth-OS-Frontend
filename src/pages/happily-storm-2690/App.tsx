import { Theme } from './settings/types';
import { Image } from 'lucide-react';
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
      resourceType="ad_creatives"
      eyebrow="Advertising"
      title="Creatives"
      description="Verified creative records for the current workspace."
      emptyTitle="No verified creative records yet"
      emptyDescription="Connect an approved advertising source before reviewing creative assets or performance. No upload, sync or publish action is exposed without a canonical provider operation."
      emptyIcon={<Image aria-hidden="true" size={24} />}
    />
  ); // %EXPORT_STATEMENT%
}

export default App;
