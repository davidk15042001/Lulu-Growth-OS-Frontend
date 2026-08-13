import { Theme } from './settings/types';
import { LuluEcommerceOverview } from './components/generated/LuluEcommerceOverview';

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

  return <LuluEcommerceOverview />;
}

export default App;