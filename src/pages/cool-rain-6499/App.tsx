import { Theme } from './settings/types';
import { LuluIncome } from './components/generated/LuluIncome';
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

  return <LuluIncome />; // %EXPORT_STATEMENT%
}

export default App;