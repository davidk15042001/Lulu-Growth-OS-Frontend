import { Theme } from './settings/types';
import { LuluCustomers } from './components/generated/LuluCustomers';

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

  return <LuluCustomers />;
}

export default App;