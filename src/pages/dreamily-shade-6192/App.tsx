import { Theme } from './settings/types';
import { CustomersIntelligence } from './components/generated/CustomersIntelligence';

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

  return <CustomersIntelligence />;
}

export default App;