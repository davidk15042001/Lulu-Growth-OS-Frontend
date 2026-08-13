import { Theme } from './settings/types';
import { LuluCrmPage } from './components/generated/LuluCrmPage';

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

  return <LuluCrmPage />;
}

export default App;