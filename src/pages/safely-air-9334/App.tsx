import { Theme } from './settings/types';
import { LuluCollectionsPage } from './components/generated/LuluCollectionsPage';
// %IMPORT_STATEMENT%

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

  return <LuluCollectionsPage />; // %EXPORT_STATEMENT%
}

export default App;