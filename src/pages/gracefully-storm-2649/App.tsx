import { Theme } from './settings/types';
import { CustomerIntelligence } from './components/generated/CustomerIntelligence';

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

  return <CustomerIntelligence />;
}

export default App;