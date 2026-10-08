import { Theme } from './settings/types';
import { Tags } from 'lucide-react';
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
    resourceType="ecommerce_categories"
    eyebrow="Ecommerce"
    title="Categories"
    description="Verified product category records from connected stores. Hierarchy and product counts appear only when returned by the backend."
    emptyTitle="No verified category records yet"
    emptyDescription="Connect a store and synchronize product categories before reviewing hierarchy or product assignments. No example categories are displayed."
    emptyIcon={<Tags aria-hidden="true" size={24} />}
  />; // %EXPORT_STATEMENT%
}

export default App;
