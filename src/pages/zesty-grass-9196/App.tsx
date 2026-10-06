import { Theme } from './settings/types';
import { Target } from 'lucide-react';
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

  return <BackendResourceOverviewPage
    resourceType="ad_optimizations"
    eyebrow="Advertising"
    title="AI Optimization"
    description="Verified optimization records from connected advertising and marketing sources."
    emptyTitle="No optimization data available yet"
    emptyDescription="Connect advertising platforms to populate optimization records. No example metrics or recommendations are shown without verified workspace data."
    emptyIcon={<Target aria-hidden="true" size={24} />}
  />; // %EXPORT_STATEMENT%
}

export default App;
