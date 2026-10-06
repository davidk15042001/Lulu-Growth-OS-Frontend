import { Theme } from './settings/types';
import { FinanceOverviewWorkspace } from '../../components/FinanceOverviewWorkspace';
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

  return <FinanceOverviewWorkspace />; // %EXPORT_STATEMENT%
}

export default App;
