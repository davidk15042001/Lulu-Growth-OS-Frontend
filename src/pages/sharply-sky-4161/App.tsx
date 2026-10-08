import { Theme } from './settings/types';
import { BadgePercent } from 'lucide-react';
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
    resourceType="ecommerce_discounts"
    eyebrow="Ecommerce"
    title="Discounts and Promotions"
    description="Verified discount and promotion records from connected stores. Unsupported mutation controls stay hidden until a canonical action is available."
    emptyTitle="No verified discounts yet"
    emptyDescription="Connect a store and synchronize discount records before reviewing promotions. No example discounts are displayed."
    emptyIcon={<BadgePercent aria-hidden="true" size={24} />}
  />; // %EXPORT_STATEMENT%
}

export default App;
