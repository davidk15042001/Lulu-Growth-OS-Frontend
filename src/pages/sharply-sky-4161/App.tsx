import { Theme } from './settings/types';
import { DiscountsPromotions } from './components/generated/DiscountsPromotions';
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

  return <DiscountsPromotions />; // %EXPORT_STATEMENT%
}

export default App;