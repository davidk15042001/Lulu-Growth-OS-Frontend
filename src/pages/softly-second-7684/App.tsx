import { Theme } from './settings/types';
import { AdvertisingAudiences } from './components/generated/AdvertisingAudiences';
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

  return <AdvertisingAudiences />; // %EXPORT_STATEMENT%
}

export default App;