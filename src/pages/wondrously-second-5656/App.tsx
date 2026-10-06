import { Theme } from './settings/types';
import { ShieldCheck } from 'lucide-react';
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

  return <BackendResourceOverviewPage
    resourceType="ai_actions"
    eyebrow="AI"
    title="AI Actions"
    description="Verified autonomous-action records and their current execution state."
    emptyTitle="No verified AI actions yet"
    emptyDescription="Connect an approved integration and register a workspace-scoped action before reviewing execution state. No action can be enabled or run from this view without a canonical backend operation."
    emptyIcon={<ShieldCheck aria-hidden="true" size={24} />}
  />;
}

export default App;
