import { Theme } from './settings/types';
import { SalesLeadsWorkspace } from '../../components/SalesLeadsWorkspace';
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

  return <SalesLeadsWorkspace resourceType="crm_leads" activeSlug="swift-hour-7844" eyebrow="CRM" description="Verified CRM lead records for the current workspace." />; // %EXPORT_STATEMENT%
}

export default App;
