import { Theme } from './settings/types';
import { LuluAIKnowledge } from './components/generated/LuluAIKnowledge';

let theme: Theme = 'light';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') document.documentElement.classList.add('dark');else
    document.documentElement.classList.remove('dark');
  }

  setTheme(theme);

  return <LuluAIKnowledge />;
}

export default App;