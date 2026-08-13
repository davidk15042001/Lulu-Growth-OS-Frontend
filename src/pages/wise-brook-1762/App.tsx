import { Theme } from './settings/types';
import { CampaignsWorkspace } from './components/generated/CampaignsWorkspace';

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

  return <CampaignsWorkspace />;
}

export default App;