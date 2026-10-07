import { Theme } from './settings/types';
import { AdvertisingWorkspace } from '../finely-garden-9221/components/generated/AdvertisingWorkspace';

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

  return <AdvertisingWorkspace />;
}

export default App;
