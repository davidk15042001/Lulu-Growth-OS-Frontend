import { Theme } from './settings/types';
import { LuluVerificationPage } from './components/generated/LuluVerificationPage';
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

  return <LuluVerificationPage />; // %EXPORT_STATEMENT%
}

export default App;