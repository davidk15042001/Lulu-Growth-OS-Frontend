import { Theme } from './settings/types';
import { ReturnsRefundsPage } from './components/generated/ReturnsRefundsPage';
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

  return <ReturnsRefundsPage />; // %EXPORT_STATEMENT%
}

export default App;