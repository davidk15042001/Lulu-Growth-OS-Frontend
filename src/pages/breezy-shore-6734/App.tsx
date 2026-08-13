import { Theme } from './settings/types';
import { LuluMarketingAnalytics } from './components/generated/LuluMarketingAnalytics';
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

  return <LuluMarketingAnalytics />; // %EXPORT_STATEMENT%
}

export default App;