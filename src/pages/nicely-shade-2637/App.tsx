import { Theme } from './settings/types';
import { LuluTrackingAttribution } from './components/generated/LuluTrackingAttribution';
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

  return <LuluTrackingAttribution />; // %EXPORT_STATEMENT%
}

export default App;