import { Theme } from './settings/types';
import { LuluAIActions } from './components/generated/LuluAIActions';

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

  return <LuluAIActions />;
}

export default App;