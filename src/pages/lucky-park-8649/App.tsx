import { Theme } from './settings/types';
import { LuluPayouts } from './components/generated/LuluPayouts';
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

  return <LuluPayouts />; // %EXPORT_STATEMENT%
}

export default App;