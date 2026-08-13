import { Theme } from './settings/types';
import { LuluFinanceSettings } from './components/generated/LuluFinanceSettings';

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

  return <LuluFinanceSettings />;
}

export default App;