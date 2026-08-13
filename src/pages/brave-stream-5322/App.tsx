import { Theme } from './settings/types';
import { LuluComparisons } from './components/generated/LuluComparisons';
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

  return <LuluComparisons />; // %EXPORT_STATEMENT%
}

export default App;