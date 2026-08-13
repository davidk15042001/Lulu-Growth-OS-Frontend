import { Theme } from './settings/types';
import { LuluOrders } from './components/generated/LuluOrders';

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

  return <LuluOrders />;
}

export default App;