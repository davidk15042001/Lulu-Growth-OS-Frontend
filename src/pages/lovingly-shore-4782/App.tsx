import { Theme } from './settings/types';
import { SalesForecast } from './components/generated/SalesForecast';
// %IMPORT_STATEMENT

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

  return <SalesForecast />; // %EXPORT_STATEMENT%
}

export default App;