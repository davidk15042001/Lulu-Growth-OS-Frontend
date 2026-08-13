import { Theme } from './settings/types';
import { RevenueIntelligence } from './components/generated/RevenueIntelligence';

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

  return <RevenueIntelligence />;
}

export default App;