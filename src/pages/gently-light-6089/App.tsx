import { Theme } from './settings/types';
import OperationsPage from '../canonical-operations/OperationsPage';
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

  return <OperationsPage />; // %EXPORT_STATEMENT%
}

export default App;
