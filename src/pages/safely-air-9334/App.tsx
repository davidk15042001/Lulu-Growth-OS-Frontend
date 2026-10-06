import { Theme } from './settings/types';
import { Layers3 } from 'lucide-react';
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
      resourceType="ecommerce_collections"
      eyebrow="Ecommerce"
      title="Collections"
      description="Verified product-collection records for the current workspace."
      emptyTitle="No verified collections yet"
      emptyDescription="Connect an approved commerce provider before reviewing collection health, synchronization or product assignments. Create, edit and sync actions remain unavailable until a canonical provider operation is connected."
      emptyIcon={<Layers3 aria-hidden="true" size={24} />}
    />
  ); // %EXPORT_STATEMENT%
}

export default App;
