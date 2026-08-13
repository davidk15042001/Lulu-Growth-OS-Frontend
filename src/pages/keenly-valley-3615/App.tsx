import { Theme } from './settings/types';
import { LuluSetupComplete } from './components/generated/LuluSetupComplete';
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

  return <LuluSetupComplete />;
}

export default App;