import { Theme } from './settings/types';
import { AdvertisingAnalytics } from './components/generated/AdvertisingAnalytics';

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

  return <AdvertisingAnalytics />;
}

export default App;