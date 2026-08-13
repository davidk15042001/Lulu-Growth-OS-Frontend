import { Theme } from './settings/types';
import { LuluIntegrations } from './components/generated/LuluIntegrations';

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

  return <LuluIntegrations />;
}

export default App;