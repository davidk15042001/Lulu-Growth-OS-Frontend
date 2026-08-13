import { Theme } from './settings/types';
import { LuluCampaigns } from './components/generated/LuluCampaigns';

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

  return <LuluCampaigns />;
}

export default App;