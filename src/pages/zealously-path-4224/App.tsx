import { Theme } from './settings/types';
import { LuluGeoWorkspace } from './components/generated/LuluGeoWorkspace';

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

  return <LuluGeoWorkspace />;
}

export default App;