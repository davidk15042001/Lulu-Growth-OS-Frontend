import { Theme } from './settings/types';
import { ShippingFulfillment } from './components/generated/ShippingFulfillment';

// %IMPORT_STATEMENT%

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

  return <ShippingFulfillment />; // %EXPORT_STATEMENT%
}

export default App;