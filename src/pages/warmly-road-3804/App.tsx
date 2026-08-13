import { Theme } from './settings/types';
import { SalesActivities } from './components/generated/SalesActivities';
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

  return <SalesActivities />; // %EXPORT_STATEMENT%
}

export default App;