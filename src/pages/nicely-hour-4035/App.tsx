import { Theme } from './settings/types';
import { SalesIntelligence } from './components/generated/SalesIntelligence';

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

  return <SalesIntelligence />;
}

export default App;