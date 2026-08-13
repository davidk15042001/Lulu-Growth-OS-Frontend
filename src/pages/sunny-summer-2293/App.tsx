import { Theme } from './settings/types';
import { AdAccountsWorkspace } from './components/generated/AdAccountsWorkspace';
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

  return <AdAccountsWorkspace />; // %EXPORT_STATEMENT%
}

export default App;