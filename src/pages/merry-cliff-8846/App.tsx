import { Theme } from './settings/types';
import { Ticket } from 'lucide-react';
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
      resourceType="ecommerce_coupons"
      eyebrow="Ecommerce"
      title="Coupons"
      description="Verified coupon records for the current workspace."
      emptyTitle="No verified coupons yet"
      emptyDescription="Connect an approved commerce provider before reviewing coupon usage, health or activity. No counts, insights or coupon actions are inferred without verified records."
      emptyIcon={<Ticket aria-hidden="true" size={24} />}
    />
  ); // %EXPORT_STATEMENT%
}

export default App;
