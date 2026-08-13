import { Theme } from './settings/types';
import { LuluAIActivity } from './components/generated/LuluAIActivity';

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

  return <LuluAIActivity />;
}

export default App;