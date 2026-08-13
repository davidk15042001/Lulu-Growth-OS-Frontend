import { Theme } from './settings/types';
import { LuluPaymentsWorkspace } from './components/generated/LuluPaymentsWorkspace';

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

  return <LuluPaymentsWorkspace />;
}

export default App;