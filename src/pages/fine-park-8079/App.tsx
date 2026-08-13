import { Theme } from './settings/types';
import { SalesOverview } from './components/generated/SalesOverview';
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

  return <SalesOverview />; // %EXPORT_STATEMENT%
}

export default App;