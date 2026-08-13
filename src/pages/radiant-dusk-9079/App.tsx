import { Theme } from './settings/types';
import { LuluAIAgents } from './components/generated/LuluAIAgents';

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

  return <LuluAIAgents />;
}

export default App;