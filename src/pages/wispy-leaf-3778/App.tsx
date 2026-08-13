import { Theme } from './settings/types';
import { LuluAITasks } from './components/generated/LuluAITasks';
// %IMPORT_STATEMENT

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

  return <LuluAITasks />; // %EXPORT_STATEMENT%
}

export default App;