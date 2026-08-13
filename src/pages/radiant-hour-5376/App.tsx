import { Theme } from './settings/types';
import { RecurringRevenue } from './components/generated/RecurringRevenue';
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

  return <RecurringRevenue />; // %EXPORT_STATEMENT%
}

export default App;