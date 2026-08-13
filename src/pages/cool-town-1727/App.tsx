import { Theme } from './settings/types';
import { ProductsIntelligence } from './components/generated/ProductsIntelligence';

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

  return <ProductsIntelligence />;
}

export default App;