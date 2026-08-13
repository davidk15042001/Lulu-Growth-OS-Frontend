import { Theme } from './settings/types';
import { SalesOpportunities } from './components/generated/SalesOpportunities';

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

  return <SalesOpportunities />;
}

export default App;