import { Theme } from './settings/types';
import { LuluEcommerce } from './components/generated/LuluEcommerce';
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

  return <LuluEcommerce />; // %EXPORT_STATEMENT%
}

export default App;