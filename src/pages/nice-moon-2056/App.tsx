import { Theme } from './settings/types';
import { LuluCampaignBuilder } from './components/generated/LuluCampaignBuilder';

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

  return <LuluCampaignBuilder />;
}

export default App;