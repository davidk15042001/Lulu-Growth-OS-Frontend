import { Theme } from './settings/types';
import { LuluAeoWorkspace } from './components/generated/LuluAeoWorkspace';

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

  return <LuluAeoWorkspace />;
}

export default App;