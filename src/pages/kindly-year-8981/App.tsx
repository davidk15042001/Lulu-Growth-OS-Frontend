import { Theme } from './settings/types';
import { Gauge } from 'lucide-react';
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
    resourceType="benchmarks"
    eyebrow="Intelligence"
    title="Benchmarks"
    description="Verified benchmark records and reference comparisons for the current workspace."
    emptyTitle="No verified benchmark records yet"
    emptyDescription="Connect a supported benchmark source before comparing performance. No reference values, gaps or recommendations are inferred without verified records."
    emptyIcon={<Gauge aria-hidden="true" size={24} />}
  />; // %EXPORT_STATEMENT%
}

export default App;
