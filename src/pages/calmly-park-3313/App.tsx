import { Theme } from './settings/types';
import { Bot } from 'lucide-react';
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
    resourceType="ai_agents"
    eyebrow="AI"
    title="Agent Marketplace"
    description="Verified AI agent records configured for the current workspace."
    emptyTitle="No verified AI agents yet"
    emptyDescription="Configure or connect an agent before reviewing capabilities or installation status. No example agents are displayed without verified workspace data."
    emptyIcon={<Bot aria-hidden="true" size={24} />}
  />;
}

export default App;
