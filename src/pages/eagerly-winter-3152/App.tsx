import { Theme } from './settings/types';
import { MarketingIntelligence } from './components/generated/MarketingIntelligence';

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

  return <MarketingIntelligence />;
}

export default App;