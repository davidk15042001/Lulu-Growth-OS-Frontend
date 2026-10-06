import { Theme } from './settings/types';
import { Beaker } from 'lucide-react';
import { BackendResourceOverviewPage } from '../../components/BackendResourceOverviewPage';

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
      resourceType="ad_experiments"
      eyebrow="Advertising"
      title="AI Experiments & A/B Testing"
      description="Verified advertising experiment records for the current workspace."
      emptyTitle="No verified experiments yet"
      emptyDescription="Connect approved advertising data before reviewing experiment results. No hypotheses, lift, recommendations or execution controls are shown without verified records."
      emptyIcon={<Beaker aria-hidden="true" size={24} />}
    />
  );
}

export default App;
