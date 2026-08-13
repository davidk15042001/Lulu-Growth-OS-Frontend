import { Theme } from './settings/types';
import { LuluTerritories } from './components/generated/LuluTerritories';

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

  return <LuluTerritories />;
}

export default App;