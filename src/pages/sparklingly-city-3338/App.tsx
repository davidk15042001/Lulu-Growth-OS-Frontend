import { Theme } from './settings/types';
import { LuluReconciliation } from './components/generated/LuluReconciliation';
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

  return <LuluReconciliation />; // %EXPORT_STATEMENT%
}

export default App;