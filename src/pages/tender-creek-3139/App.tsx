import { Theme } from './settings/types';
import { LuluOffersQuotes } from './components/generated/LuluOffersQuotes';

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

  return <LuluOffersQuotes />;
}

export default App;