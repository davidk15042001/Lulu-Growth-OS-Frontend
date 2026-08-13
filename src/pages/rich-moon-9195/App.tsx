import { Theme } from './settings/types';
import { SalesReports } from './components/generated/SalesReports';

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

  return <SalesReports />;
}

export default App;