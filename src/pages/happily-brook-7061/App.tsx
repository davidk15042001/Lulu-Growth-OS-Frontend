import { Theme } from './settings/types';
import { LuluOpportunities } from './components/generated/LuluOpportunities';

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

  return <LuluOpportunities />;
}

export default App;