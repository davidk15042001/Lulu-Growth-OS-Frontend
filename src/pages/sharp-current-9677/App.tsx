import { Theme } from './settings/types';
import { TrendingUp } from 'lucide-react';
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

  return <BackendResourceOverviewPage resourceType="marketing_campaigns" eyebrow="Growth" title="Growth" description="Live records in this workflow" emptyTitle="No live records are available for this page yet." emptyDescription="No metrics or success claims are inferred while the backend state is unavailable." emptyIcon={<TrendingUp aria-hidden="true" size={24} />} />; // %EXPORT_STATEMENT%
}

export default App;
