import { Theme } from './settings/types';
import { LuluAIPreferences } from './components/generated/LuluAIPreferences';

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

  return <LuluAIPreferences />;
}

export default App;