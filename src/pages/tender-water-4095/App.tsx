import { Theme } from './settings/types';
import { LuluExecutiveOverview } from './components/generated/LuluExecutiveOverview';

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

  return <LuluExecutiveOverview />;
}

export default App;