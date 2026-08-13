import { Theme } from './settings/types';
import { LuluPasswordReset } from './components/generated/LuluPasswordReset';
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

  return <LuluPasswordReset />; // %EXPORT_STATEMENT%
}

export default App;